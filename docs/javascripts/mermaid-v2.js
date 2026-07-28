// Rendu Mermaid autonome avec chargement conditionnel
// Charge mermaid.min.js uniquement sur les pages contenant des diagrammes
// Les blocs sont generes par pymdownx.superfences avec class="mermaid-source"

(function () {
  "use strict";

  var mermaidLoaded = false;
  var mermaidLoading = false;

  // Determine le chemin de base du script pour charger mermaid.min.js
  // IMPORTANT : cacher le resultat au parse time, avant que navigation.instant
  // ne remplace les <script> avec des chemins relatifs a la nouvelle URL
  var cachedBasePath = (function () {
    var scripts = document.querySelectorAll('script[src*="mermaid-v2"]');
    if (scripts.length > 0) {
      return scripts[scripts.length - 1].src.replace("mermaid-v2.js", "");
    }
    return "javascripts/";
  })();

  function getBasePath() {
    return cachedBasePath;
  }

  function loadMermaidLib(callback) {
    // Si mermaid est deja charge (par le theme ou par nous), on l'utilise
    if (mermaidLoaded || typeof mermaid !== "undefined") {
      mermaidLoaded = true;
      callback();
      return;
    }
    if (mermaidLoading) {
      // Attendre que le chargement en cours se termine
      var check = setInterval(function () {
        if (mermaidLoaded || typeof mermaid !== "undefined") {
          mermaidLoaded = true;
          clearInterval(check);
          callback();
        }
      }, 50);
      return;
    }
    mermaidLoading = true;
    var script = document.createElement("script");
    script.src = getBasePath() + "mermaid.min.js";
    script.onload = function () {
      mermaidLoaded = true;
      mermaidLoading = false;
      callback();
    };
    script.onerror = function () {
      mermaidLoading = false;
      console.error("Erreur : impossible de charger mermaid.min.js");
    };
    document.head.appendChild(script);
  }

  function renderMermaidBlocks() {
    var blocks = [];
    // fence_div_format produit <div class="mermaid-source">...</div>
    // On cible les div pour eviter le conflit avec le code handler de Material
    // qui traite les <pre><code> comme des blocs de code normaux
    document
      .querySelectorAll("div.mermaid-source")
      .forEach(function (divEl, i) {
        if (divEl.getAttribute("data-mermaid-rendered")) return;
        divEl.setAttribute("data-mermaid-rendered", "true");
        blocks.push({
          pre: divEl,
          code: divEl.textContent,
          index: i,
        });
      });

    if (blocks.length === 0) return;

    // Charger mermaid.min.js puis rendre les diagrammes
    loadMermaidLib(function () {
      if (typeof mermaid === "undefined") return;

      // Adapter le theme Mermaid au mode clair/sombre de MkDocs Material
      var isDark =
        document.body.getAttribute("data-md-color-scheme") === "slate";
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
      });

      // Rendre chaque diagramme sequentiellement pour eviter les conflits d'ID
      blocks.reduce(function (chain, item) {
        return chain.then(function () {
          return mermaid
            .render("mmd-" + Date.now() + "-" + item.index, item.code)
            .then(function (result) {
              var container = document.createElement("div");
              container.className = "mermaid-diagram";
              container.innerHTML = result.svg;

              var svg = container.querySelector("svg");
              if (svg) {
                svg.removeAttribute("style");
                svg.removeAttribute("height");
                var vb = svg.getAttribute("viewBox");
                if (vb) {
                  var vbW = parseFloat(vb.split(/\s+/)[2]);
                  // Largeur naturelle du SVG, mais max-width: 100% en CSS
                  // permet le redimensionnement dans le conteneur
                  svg.setAttribute("width", vbW + "px");
                }
              }

              item.pre.replaceWith(container);

              // Accessibilité : le conteneur est un bouton (clavier + AT)
              container.setAttribute("role", "button");
              container.setAttribute("tabindex", "0");
              container.setAttribute(
                "aria-label",
                "Diagramme Mermaid. Activer pour agrandir",
              );
              container.style.cursor = "pointer";
              container.title = "Agrandir le diagramme";
              container.addEventListener("click", function () {
                openMermaidLightbox(this);
              });
              container.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openMermaidLightbox(this);
                }
              });
            })
            .catch(function (err) {
              var errDiv = document.createElement("div");
              errDiv.className = "mermaid-diagram mermaid-error";
              errDiv.style.cssText =
                "color:#c0392b;padding:1em;border:1px solid #e74c3c;border-radius:4px;";
              errDiv.textContent =
                "Erreur diagramme Mermaid : " + (err.message || err);
              item.pre.replaceWith(errDiv);
            });
        });
      }, Promise.resolve());
    });
  }

  // === Lightbox avec zoom et pan ===

  function openMermaidLightbox(container) {
    var svg = container.querySelector("svg");
    if (!svg) return;

    // Eviter les lightbox empilees
    if (document.querySelector(".mermaid-lightbox")) return;

    var previouslyFocused = document.activeElement;

    // Etat du zoom/pan
    var scale = 1;
    var panX = 0;
    var panY = 0;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var panStartX = 0;
    var panStartY = 0;

    // Overlay (dialog modal)
    var overlay = document.createElement("div");
    overlay.className = "mermaid-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Diagramme Mermaid agrandi");

    // Zone de viewport (clippe le contenu)
    var viewport = document.createElement("div");
    viewport.className = "mermaid-lightbox-viewport";
    viewport.setAttribute("aria-hidden", "true");

    // Conteneur transformable
    var transformBox = document.createElement("div");
    transformBox.className = "mermaid-lightbox-transform";

    // Clone du SVG a sa taille naturelle
    var clone = svg.cloneNode(true);
    clone.removeAttribute("style");
    var vb = svg.getAttribute("viewBox");
    if (vb) {
      var parts = vb.split(/\s+/);
      clone.setAttribute("width", parts[2]);
      clone.setAttribute("height", parts[3]);
    }
    clone.style.display = "block";
    // Le diagramme est déjà nommé via le dialog ; éviter un double annonce
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("focusable", "false");

    transformBox.appendChild(clone);
    viewport.appendChild(transformBox);

    // Controles
    var controls = document.createElement("div");
    controls.className = "mermaid-lightbox-controls";
    controls.innerHTML =
      '<button type="button" data-action="zoomin" aria-label="Zoom avant">+</button>' +
      '<button type="button" data-action="zoomout" aria-label="Zoom arrière">&minus;</button>' +
      '<button type="button" data-action="fit" aria-label="Ajuster à l\'écran">Ajuster</button>' +
      '<button type="button" data-action="close" aria-label="Fermer">&times;</button>';

    overlay.appendChild(viewport);
    overlay.appendChild(controls);

    function applyTransform() {
      transformBox.style.transform =
        "translate(" + panX + "px, " + panY + "px) scale(" + scale + ")";
    }

    function fitToScreen() {
      var vw = viewport.clientWidth;
      var vh = viewport.clientHeight;
      var sw =
        clone.getAttribute("width") || clone.getBoundingClientRect().width;
      var sh =
        clone.getAttribute("height") || clone.getBoundingClientRect().height;
      scale = Math.min(vw / sw, vh / sh, 2) * 0.9;
      panX = 0;
      panY = 0;
      applyTransform();
    }

    // Zoom molette
    viewport.addEventListener("wheel", function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.85 : 1.18;
      var newScale = Math.max(0.1, Math.min(10, scale * delta));

      // Zoomer vers le curseur
      var rect = viewport.getBoundingClientRect();
      var mx = e.clientX - rect.left - rect.width / 2;
      var my = e.clientY - rect.top - rect.height / 2;
      panX = mx - ((mx - panX) * newScale) / scale;
      panY = my - ((my - panY) * newScale) / scale;

      scale = newScale;
      applyTransform();
    });

    // Pan avec drag
    viewport.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      panStartX = panX;
      panStartY = panY;
      viewport.style.cursor = "grabbing";
      e.preventDefault();
    });

    function onMove(e) {
      if (!isDragging) return;
      panX = panStartX + (e.clientX - dragStartX);
      panY = panStartY + (e.clientY - dragStartY);
      applyTransform();
    }

    function onUp() {
      isDragging = false;
      viewport.style.cursor = "grab";
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    // Touch: pinch zoom + pan
    var lastTouchDist = 0;

    viewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        panStartX = panX;
        panStartY = panY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
      }
      e.preventDefault();
    });

    viewport.addEventListener("touchmove", function (e) {
      if (e.touches.length === 1 && isDragging) {
        panX = panStartX + (e.touches[0].clientX - dragStartX);
        panY = panStartY + (e.touches[0].clientY - dragStartY);
        applyTransform();
      } else if (e.touches.length === 2) {
        var dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        if (lastTouchDist > 0) {
          scale = Math.max(0.1, Math.min(10, scale * (dist / lastTouchDist)));
          applyTransform();
        }
        lastTouchDist = dist;
      }
      e.preventDefault();
    });

    viewport.addEventListener("touchend", function () {
      isDragging = false;
      lastTouchDist = 0;
    });

    // Boutons
    controls.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var action = btn.dataset.action;
      if (action === "zoomin") {
        scale = Math.min(10, scale * 1.4);
        applyTransform();
      } else if (action === "zoomout") {
        scale = Math.max(0.1, scale * 0.7);
        applyTransform();
      } else if (action === "fit") {
        fitToScreen();
      } else if (action === "close") {
        cleanup();
      }
    });

    function getFocusable() {
      return Array.prototype.slice.call(
        overlay.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    // Fermeture
    function cleanup() {
      overlay.remove();
      document.body.classList.remove("mermaid-lightbox-open");
      document.removeEventListener("keydown", keyHandler, true);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        try {
          previouslyFocused.focus();
        } catch (err) {
          /* élément détaché */
        }
      }
    }

    function keyHandler(e) {
      // Empêche les raccourcis globaux (flèches inter-fiches, etc.)
      // tant que le dialogue est ouvert.
      e.stopPropagation();

      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
        return;
      }

      // Flèches : rester dans le dialogue (pas de navigation de page)
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        scale = Math.min(10, scale * 1.3);
        applyTransform();
        return;
      }
      if (e.key === "-") {
        e.preventDefault();
        scale = Math.max(0.1, scale * 0.7);
        applyTransform();
        return;
      }
      if (e.key === "0") {
        e.preventDefault();
        fitToScreen();
        return;
      }

      // Piège à focus dans le dialogue
      if (e.key === "Tab") {
        var focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Capture : intercepte avant les handlers bubble du document (extra.js)
    document.addEventListener("keydown", keyHandler, true);
    document.body.classList.add("mermaid-lightbox-open");
    document.body.appendChild(overlay);

    // Focus initial sur le bouton Fermer (action de sortie claire)
    var closeBtn = controls.querySelector('[data-action="close"]');
    if (closeBtn) closeBtn.focus();

    // Ajuster au premier affichage
    requestAnimationFrame(function () {
      fitToScreen();
    });
  }

  // Executer au chargement initial + souscrire a la navigation instantanee
  document.addEventListener("DOMContentLoaded", function () {
    renderMermaidBlocks();

    // document$ est disponible apres DOMContentLoaded (le JS du theme a deja execute)
    if (typeof document$ !== "undefined") {
      document$.subscribe(function () {
        setTimeout(renderMermaidBlocks, 100);
      });
    } else {
      // Fallback : observer les changements de contenu
      var target = document.querySelector(".md-content");
      if (target) {
        var observer = new MutationObserver(function () {
          setTimeout(renderMermaidBlocks, 100);
        });
        observer.observe(target, { childList: true, subtree: true });
      }
    }
  });
})();
