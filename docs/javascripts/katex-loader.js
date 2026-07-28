/**
 * Chargement conditionnel de KaTeX
 * Charge katex.min.css, katex.min.js et katex-auto-render.min.js
 * uniquement sur les pages contenant des formules mathematiques (.arithmatex)
 */
(function () {
  "use strict";

  var katexLoaded = false;
  var katexLoading = false;

  // IMPORTANT : cacher les chemins au parse time, avant que navigation.instant
  // ne remplace les <script> avec des chemins relatifs a la nouvelle URL
  var cachedBasePath = (function () {
    var scripts = document.querySelectorAll('script[src*="katex-loader"]');
    if (scripts.length > 0) {
      return scripts[scripts.length - 1].src.replace("katex-loader.js", "");
    }
    return "javascripts/";
  })();

  var cachedStylesPath = cachedBasePath.replace("javascripts/", "stylesheets/");

  function getBasePath() {
    return cachedBasePath;
  }

  function getStylesPath() {
    return cachedStylesPath;
  }

  function loadCSS(href) {
    if (document.querySelector('link[href*="katex.min.css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  var KATEX_DELIMITERS = [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true },
  ];

  function renderKaTeX() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: KATEX_DELIMITERS,
        throwOnError: false,
      });
    }
  }

  function initKaTeX() {
    // Detecter la presence de formules sur la page
    var hasFormulas = document.querySelector(".arithmatex") !== null;
    if (!hasFormulas) return;

    if (katexLoaded) {
      renderKaTeX();
      return;
    }

    if (katexLoading) {
      var check = setInterval(function () {
        if (katexLoaded) {
          clearInterval(check);
          renderKaTeX();
        }
      }, 50);
      return;
    }
    katexLoading = true;

    var basePath = getBasePath();
    var stylesPath = getStylesPath();

    // Charger le CSS
    loadCSS(stylesPath + "katex.min.css");

    // Charger les scripts en sequence : katex.min.js puis auto-render
    loadScript(basePath + "katex.min.js")
      .then(function () {
        return loadScript(basePath + "katex-auto-render.min.js");
      })
      .then(function () {
        katexLoaded = true;
        katexLoading = false;
        renderKaTeX();
      })
      .catch(function () {
        katexLoading = false;
        console.error("Erreur : impossible de charger KaTeX");
      });
  }

  // Executer au chargement initial + souscrire a la navigation instantanee
  document.addEventListener("DOMContentLoaded", function () {
    initKaTeX();

    // document$ est disponible apres DOMContentLoaded (le JS du theme a deja execute)
    if (typeof document$ !== "undefined") {
      document$.subscribe(function () {
        setTimeout(initKaTeX, 100);
      });
    } else {
      // Fallback : observer les changements de contenu
      var target = document.querySelector(".md-content");
      if (target) {
        var observer = new MutationObserver(function () {
          setTimeout(initKaTeX, 100);
        });
        observer.observe(target, { childList: true, subtree: true });
      }
    }
  });
})();
