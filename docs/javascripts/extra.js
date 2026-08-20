/**
 * Blocs visuels pedagogiques + UX apprenant
 * - Blocs pedagogiques (definition, analogie, warning, solution, note, resultat)
 * - Barre de progression de lecture
 * - Memoire de position de lecture (localStorage)
 * - Persistance des checklists de validation (localStorage)
 * - Solutions d'exercices masquees par defaut
 * - Raccourcis clavier navigation inter-fiches
 */
(function () {
  "use strict";

  /**
   * Regles basees sur le premier <strong> d'un paragraphe.
   * On cherche <p><strong>Mot-cle</strong> : ...</p>
   */
  var STRONG_RULES = [
    {
      match: /^Définition$/,
      className: "pedagogical-block--definition",
    },
    {
      match: /^Analogie concrète$/,
      className: "pedagogical-block--analogy",
    },
    {
      match: /^Résultat attendu$/,
      className: "pedagogical-block--result",
    },
  ];

  /**
   * Regles basees sur le texte brut du paragraphe (debut).
   * Cible les lignes commencant par un emoji indicateur.
   */
  var TEXT_RULES = [
    {
      pattern: /^⚠️/,
      className: "pedagogical-block--warning",
    },
    {
      pattern: /^✅/,
      className: "pedagogical-block--solution",
    },
  ];

  function highlightBlocks() {
    var article = document.querySelector(".md-content article");
    if (!article) return;

    // 1. Regles strong:first-child sur les paragraphes
    var strongs = article.querySelectorAll("p > strong:first-child");
    for (var i = 0; i < strongs.length; i++) {
      var strong = strongs[i];
      var text = strong.textContent.trim();
      for (var j = 0; j < STRONG_RULES.length; j++) {
        if (STRONG_RULES[j].match.test(text)) {
          var p = strong.parentElement;
          if (p && p.tagName === "P") {
            p.classList.add(STRONG_RULES[j].className);
          }
          break;
        }
      }
    }

    // 2. Regles textuelles sur les paragraphes (emoji en debut)
    var paragraphs = article.querySelectorAll("p");
    for (var k = 0; k < paragraphs.length; k++) {
      var pText = paragraphs[k].textContent.trim();
      for (var l = 0; l < TEXT_RULES.length; l++) {
        if (TEXT_RULES[l].pattern.test(pText)) {
          paragraphs[k].classList.add(TEXT_RULES[l].className);
          break;
        }
      }
    }

    // 3. Blockquotes contenant > **Note** -> bloc violet
    var blockquotes = article.querySelectorAll("blockquote");
    for (var m = 0; m < blockquotes.length; m++) {
      var bq = blockquotes[m];
      var firstStrong = bq.querySelector("p > strong:first-child");
      if (firstStrong && /^Note$/.test(firstStrong.textContent.trim())) {
        bq.classList.add("pedagogical-block--note");
      }
    }
  }

  /**
   * Barre de progression de lecture
   * Affiche une fine barre en haut de page indiquant la progression dans la fiche.
   * Ignoree sur les pages d'accueil (detection via .grid cards).
   */
  function initReadingProgress() {
    // Supprime une barre existante (navigation instantanee)
    var existing = document.querySelector(".reading-progress");
    if (existing) existing.remove();

    // Skip sur les pages index/home
    var article = document.querySelector(".md-content article");
    if (!article) return;
    if (
      article.querySelector(".grid.cards") ||
      article.querySelector(".md-typeset > .grid")
    )
      return;

    var bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", "0");
    bar.setAttribute("aria-label", "Progression de lecture");
    document.body.appendChild(bar);

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        bar.style.width = "100%";
        bar.setAttribute("aria-valuenow", "100");
        return;
      }
      var percent = Math.min(
        100,
        Math.round((scrollTop / docHeight) * 100),
      );
      bar.style.width = percent + "%";
      bar.setAttribute("aria-valuenow", String(percent));
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // ===================================================================
  // Memoire de position de lecture (localStorage)
  // Sauvegarde la position de scroll et propose de reprendre la lecture
  // ===================================================================

  var saveTimeout = null;

  function isContentPage() {
    var article = document.querySelector(".md-content article");
    if (!article) return false;
    if (
      article.querySelector(".grid.cards") ||
      article.querySelector(".md-typeset > .grid")
    )
      return false;
    return true;
  }

  function saveReadingPosition() {
    if (!isContentPage()) return;
    var path = window.location.pathname;
    var scrollY = window.scrollY;
    // Ne sauvegarder que si on a scrolle significativement
    if (scrollY < 200) return;
    try {
      localStorage.setItem(
        "readpos:" + path,
        JSON.stringify({ y: scrollY, ts: Date.now() }),
      );
    } catch (e) {
      /* quota depasse */
    }
  }

  function initReadingPosition() {
    if (!isContentPage()) return;

    // Sauvegarder la position au scroll (debounce 1s)
    window.addEventListener(
      "scroll",
      function () {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveReadingPosition, 1000);
      },
      { passive: true },
    );

    // Sauvegarder avant de quitter la page
    window.addEventListener("beforeunload", saveReadingPosition);

    // Proposer de reprendre la lecture
    var path = window.location.pathname;
    try {
      var saved = JSON.parse(localStorage.getItem("readpos:" + path));
      if (!saved || saved.y < 200) return;

      // Ignorer les positions trop anciennes (> 30 jours)
      if (Date.now() - saved.ts > 30 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem("readpos:" + path);
        return;
      }

      // Eviter les doublons
      var existing = document.querySelector(".reading-resume-banner");
      if (existing) existing.remove();

      // Afficher le bandeau de reprise
      var banner = document.createElement("div");
      banner.className = "reading-resume-banner";
      banner.setAttribute("role", "status");
      banner.setAttribute("aria-live", "polite");
      banner.innerHTML =
        '<span>Tu avais commence cette fiche. </span>' +
        '<button class="reading-resume-btn" type="button">Reprendre la lecture</button>' +
        '<button class="reading-resume-close" type="button" aria-label="Fermer">&times;</button>';

      var article = document.querySelector(".md-content article");
      if (!article) return;
      var firstChild = article.querySelector("h1");
      if (firstChild && firstChild.nextSibling) {
        firstChild.parentNode.insertBefore(banner, firstChild.nextSibling);
      } else {
        article.insertBefore(banner, article.firstChild);
      }

      banner.querySelector(".reading-resume-btn").addEventListener(
        "click",
        function () {
          var reduceMotion =
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({
            top: saved.y,
            behavior: reduceMotion ? "auto" : "smooth",
          });
          banner.remove();
        },
      );

      banner.querySelector(".reading-resume-close").addEventListener(
        "click",
        function () {
          banner.remove();
        },
      );

      // Auto-masquer apres 10 secondes
      setTimeout(function () {
        if (banner.parentNode) {
          banner.style.opacity = "0";
          banner.style.transition = "opacity 0.3s";
          setTimeout(function () {
            banner.remove();
          }, 300);
        }
      }, 10000);
    } catch (e) {
      /* erreur localStorage */
    }
  }

  // ===================================================================
  // Persistance des checklists de validation (localStorage)
  // ===================================================================

  /**
   * Extrait le libellé textuel d'un item de checklist (hors le contrôle).
   * Structure Material/pymdownx :
   * <li class="task-list-item">
   *   <label class="task-list-control"><input ...><span class="task-list-indicator"></span></label>
   *   Texte du critère
   * </li>
   */
  function getChecklistItemLabel(checkbox) {
    var item = checkbox.closest(".task-list-item");
    if (!item) return "Critère de validation";
    var clone = item.cloneNode(true);
    var control = clone.querySelector(".task-list-control");
    if (control) control.remove();
    var text = (clone.textContent || "").replace(/\s+/g, " ").trim();
    return text || "Critère de validation";
  }

  function initChecklistPersistence() {
    var path = window.location.pathname;
    var checkboxes = document.querySelectorAll(
      '.md-typeset .task-list-control input[type="checkbox"]',
    );
    if (checkboxes.length === 0) return;

    // Restaurer l'etat sauvegarde
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem("checklist:" + path) || "{}");
    } catch (e) {
      /* erreur parse */
    }

    checkboxes.forEach(function (cb, i) {
      // Nom accessible : le <label class="task-list-control"> n'englobe pas le texte
      // (contrainte du rendu pymdownx custom_checkbox). aria-label reprend le critère.
      var labelText = getChecklistItemLabel(cb);
      cb.setAttribute("aria-label", labelText);
      // Rendre la case interactive (le markdown la génère disabled)
      cb.disabled = false;
      cb.removeAttribute("disabled");

      if (saved[i]) cb.checked = true;

      cb.addEventListener("change", function () {
        try {
          var state = JSON.parse(
            localStorage.getItem("checklist:" + path) || "{}",
          );
          if (cb.checked) {
            state[i] = true;
          } else {
            delete state[i];
          }
          localStorage.setItem("checklist:" + path, JSON.stringify(state));
        } catch (e) {
          /* quota depasse */
        }
      });
    });
  }

  // ===================================================================
  // Solutions d'exercices masquees par defaut
  // Enveloppe les sections "Solution de l'Exercice" dans un <details>
  // ===================================================================

  function wrapSolutions() {
    var article = document.querySelector(".md-content article");
    if (!article) return;

    var headings = article.querySelectorAll("h2");
    headings.forEach(function (h2) {
      if (!/Solution de l['']Exercice/i.test(h2.textContent)) return;
      // Ne pas re-wrapper si deja fait
      if (h2.closest("details.solution-wrapper")) return;

      // Collecter tous les elements freres jusqu'au prochain h2 ou hr+h2
      var siblings = [];
      var next = h2.nextElementSibling;
      while (next) {
        if (next.tagName === "H2" || next.tagName === "H1") break;
        // Stopper avant la section Navigation (## Navigation)
        if (
          next.tagName === "H2" &&
          /^Navigation$/i.test(next.textContent.trim())
        )
          break;
        siblings.push(next);
        next = next.nextElementSibling;
      }

      if (siblings.length === 0) return;

      // Creer le wrapper <details> (disclosure natif : pas d'aria-live)
      var details = document.createElement("details");
      details.className = "solution-wrapper";

      var summary = document.createElement("summary");
      summary.className = "solution-summary";
      summary.textContent = h2.textContent.trim() || "Solution de l'exercice";

      details.appendChild(summary);

      // Deplacer les elements dans le details
      siblings.forEach(function (el) {
        details.appendChild(el);
      });

      // Remplacer le h2 par le details
      h2.replaceWith(details);
    });
  }

  // ===================================================================
  // Raccourcis clavier navigation inter-fiches
  // ===================================================================

  /**
   * Les flèches ne doivent PAS changer de fiche lorsque le focus est dans
   * une zone qui consomme les flèches (scroll horizontal, dialogue, etc.).
   * Voir C13 (scrollable-region-focusable) et lightbox Mermaid.
   */
  function shouldSkipInterFicheArrows(target) {
    if (!target || target === document.documentElement) return false;

    // Lightbox Mermaid ouverte (classe body + présence dialog)
    if (
      document.body.classList.contains("mermaid-lightbox-open") ||
      document.querySelector(".mermaid-lightbox")
    ) {
      return true;
    }

    // Dialog / alerte ARIA
    if (target.closest && target.closest('[role="dialog"], [role="alertdialog"]')) {
      return true;
    }

    // Zone scrollable rendue focusable (code, tableaux)
    if (
      target.getAttribute &&
      target.getAttribute("data-a11y-scroll-region") === "true"
    ) {
      return true;
    }
    if (
      target.closest &&
      target.closest('[data-a11y-scroll-region="true"]')
    ) {
      return true;
    }

    // Élément réellement scrollable (overflow)
    if (
      target.scrollWidth > target.clientWidth + 2 ||
      target.scrollHeight > target.clientHeight + 2
    ) {
      return true;
    }

    // Contrôles qui gèrent déjà le clavier
    var tag = target.tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      tag === "BUTTON" ||
      tag === "SUMMARY"
    ) {
      return true;
    }
    if (target.isContentEditable) return true;

    return false;
  }

  function initKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      // Ne pas intercepter avec modificateurs
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (shouldSkipInterFicheArrows(e.target)) return;

      if (e.key === "ArrowLeft") {
        var prev = document.querySelector(
          '.md-footer__link--prev, a[rel="prev"]',
        );
        if (prev) {
          prev.click();
          e.preventDefault();
        }
      } else if (e.key === "ArrowRight") {
        var next = document.querySelector(
          '.md-footer__link--next, a[rel="next"]',
        );
        if (next) {
          next.click();
          e.preventDefault();
        }
      }
    });
  }

  // ===================================================================
  // Indicateurs de scroll horizontal (mobile, code blocks et tableaux)
  // ===================================================================

  /**
   * WCAG 2.1.1 / axe scrollable-region-focusable :
   * les zones overflow (code, tableaux) doivent être focusables au clavier
   * lorsqu'elles débordent réellement (surtout mobile).
   */
  function makeScrollRegionFocusable(el, label) {
    if (!el) return;
    var overflows =
      el.scrollWidth > el.clientWidth + 2 ||
      el.scrollHeight > el.clientHeight + 2;
    if (!overflows) {
      // Nettoyer si le reflow a supprimé le besoin
      if (el.getAttribute("data-a11y-scroll-region") === "true") {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
        el.removeAttribute("data-a11y-scroll-region");
      }
      return;
    }
    if (el.getAttribute("data-a11y-scroll-region") === "true") return;
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", label);
    el.setAttribute("data-a11y-scroll-region", "true");
  }

  function initScrollIndicators() {
    // Indicateurs sur les blocs de code
    var codeBlocks = document.querySelectorAll(".md-typeset pre");
    codeBlocks.forEach(function (pre) {
      var code = pre.querySelector("code");
      // La zone qui scrolle est souvent le <code> (Material)
      makeScrollRegionFocusable(
        code,
        "Bloc de code défilable horizontalement",
      );
      makeScrollRegionFocusable(
        pre,
        "Bloc de code défilable horizontalement",
      );

      if (pre.querySelector(".code-scroll-indicator")) return;
      if (!code || code.scrollWidth <= pre.clientWidth + 10) return;

      var indicator = document.createElement("div");
      indicator.className = "code-scroll-indicator";
      indicator.setAttribute("aria-hidden", "true");
      pre.appendChild(indicator);

      pre.addEventListener(
        "scroll",
        function () {
          var atEnd =
            pre.scrollLeft + pre.clientWidth >= pre.scrollWidth - 10;
          indicator.classList.toggle("hidden", atEnd);
        },
        { passive: true },
      );
    });

    // Indicateurs sur les tableaux
    var tableWraps = document.querySelectorAll(".md-typeset__scrollwrap");
    tableWraps.forEach(function (wrap) {
      makeScrollRegionFocusable(
        wrap,
        "Tableau défilable horizontalement",
      );

      if (wrap.querySelector(".table-scroll-hint")) return;
      var tableEl = wrap.querySelector(".md-typeset__table");
      if (!tableEl || tableEl.scrollWidth <= wrap.clientWidth + 10) return;

      var hint = document.createElement("div");
      hint.className = "table-scroll-hint";
      hint.setAttribute("aria-hidden", "true");
      hint.textContent = "Faire défiler \u2192";
      wrap.parentNode.insertBefore(hint, wrap.nextSibling);
    });
  }

  // ===================================================================
  // Navigation latérale : s'assurer que le lien actif est entièrement
  // visible (évite target-size axe sur items partiellement clipés)
  // ===================================================================

  function scrollActiveNavIntoView() {
    var active = document.querySelector(
      ".md-sidebar--primary .md-nav__link--active",
    );
    if (!active || typeof active.scrollIntoView !== "function") return;
    // nearest : ne déplace le scrollwrap que si nécessaire
    try {
      active.scrollIntoView({ block: "nearest", inline: "nearest" });
    } catch (e) {
      active.scrollIntoView(false);
    }
  }

  // ===================================================================
  // Initialisation
  // ===================================================================

  function initAll() {
    highlightBlocks();
    initReadingProgress();
    initReadingPosition();
    initChecklistPersistence();
    wrapSolutions();
    initScrollIndicators();
    scrollActiveNavIntoView();
  }

  // Executer au chargement initial + souscrire a la navigation instantanee
  document.addEventListener("DOMContentLoaded", function () {
    initAll();
    initKeyboardShortcuts();
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        initScrollIndicators();
      }, 150);
    });

    // document$ est disponible apres DOMContentLoaded (le JS du theme a deja execute)
    if (typeof document$ !== "undefined") {
      document$.subscribe(function () {
        initAll();
      });
    } else {
      // Fallback : observer les changements de contenu
      var target = document.querySelector(".md-content");
      if (target) {
        var observer = new MutationObserver(function () {
          initAll();
        });
        observer.observe(target, { childList: true, subtree: true });
      }
    }
  });
})();
