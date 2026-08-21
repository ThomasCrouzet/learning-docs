(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CurriculumOrientation = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var STORAGE_KEY = "learning-docs:orientation:v2";

  function getBrowserStorage() {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function safeStorage(storage) {
    try {
      var probe = "__curriculum_probe__";
      storage.setItem(probe, "1");
      storage.removeItem(probe);
      return storage;
    } catch (error) {
      return null;
    }
  }

  function loadPreferences(storage) {
    var available = safeStorage(storage);
    if (!available) return { objectiveId: "", knownCourseIds: [], knownFicheIds: [] };
    try {
      var value = JSON.parse(available.getItem(STORAGE_KEY) || "{}");
      return {
        objectiveId: typeof value.objectiveId === "string" ? value.objectiveId : "",
        knownCourseIds: Array.isArray(value.knownCourseIds) ? value.knownCourseIds.filter(function (id) { return typeof id === "string"; }) : [],
        knownFicheIds: Array.isArray(value.knownFicheIds) ? value.knownFicheIds.filter(function (id) { return typeof id === "string"; }) : [],
      };
    } catch (error) {
      return { objectiveId: "", knownCourseIds: [], knownFicheIds: [] };
    }
  }

  function savePreferences(storage, preferences) {
    var available = safeStorage(storage);
    if (!available) return false;
    try {
      available.setItem(STORAGE_KEY, JSON.stringify(preferences));
      return true;
    } catch (error) {
      return false;
    }
  }

  function resetPreferences(storage) {
    var available = safeStorage(storage);
    if (!available) return false;
    try {
      available.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  function recommendationReason(fiche, missingIds, selectedPath) {
    if (missingIds.length) return "Cette fiche correspond à ton objectif. Des prérequis sont recommandés, mais tu peux quand même la consulter.";
    if (selectedPath) return "Cette fiche est une prochaine étape disponible pour l’objectif choisi.";
    return "Cette fiche peut être ouverte directement et ne demande aucun prérequis de fiche.";
  }

  function recommend(manifest, preferences, limit) {
    var selectedPath = manifest.paths.find(function (item) { return item.id === preferences.objectiveId; });
    var preferredCourses = selectedPath
      ? selectedPath.recommendations.reduce(function (all, item) { return all.concat(item.course_ids); }, selectedPath.entry_course_ids.slice())
      : manifest.courses.map(function (course) { return course.id; });
    var knownCourses = new Set(preferences.knownCourseIds);
    var knownFiches = new Set(preferences.knownFicheIds);
    var courseRank = new Map();
    preferredCourses.forEach(function (id, index) { if (!courseRank.has(id)) courseRank.set(id, index); });
    var candidates = manifest.fiches.filter(function (fiche) {
      return courseRank.has(fiche.course_id) && !knownCourses.has(fiche.course_id) && !knownFiches.has(fiche.id);
    }).map(function (fiche) {
      var missingIds = fiche.requires_ids.filter(function (id) { return !knownFiches.has(id); });
      var missingCourses = fiche.requires_course_ids.filter(function (id) { return !knownCourses.has(id); });
      return {
        fiche: fiche,
        missingIds: missingIds,
        missingCourses: missingCourses,
        reason: recommendationReason(fiche, missingIds.concat(missingCourses), selectedPath),
        rank: courseRank.get(fiche.course_id),
      };
    });
    candidates.sort(function (a, b) {
      var availability = (a.missingIds.length + a.missingCourses.length) - (b.missingIds.length + b.missingCourses.length);
      return availability || a.rank - b.rank || a.fiche.order - b.fiche.order || a.fiche.id.localeCompare(b.fiche.id);
    });
    return candidates.slice(0, limit || 6);
  }

  function createElement(tag, attributes, text) {
    var element = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (name) {
      if (name === "className") element.className = attributes[name];
      else element.setAttribute(name, attributes[name]);
    });
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function render(container, manifest, storage) {
    var preferences = loadPreferences(storage);
    container.replaceChildren();
    var form = createElement("form", { className: "orientation-form", "aria-label": "Choisir une orientation facultative" });
    var objectiveLabel = createElement("label", { for: "orientation-objective" }, "Objectif facultatif");
    var objective = createElement("select", { id: "orientation-objective", name: "objective" });
    objective.appendChild(createElement("option", { value: "" }, "Aucun objectif, afficher plusieurs entrées"));
    manifest.paths.forEach(function (item) {
      var option = createElement("option", { value: item.id }, item.title);
      option.selected = item.id === preferences.objectiveId;
      objective.appendChild(option);
    });
    form.appendChild(objectiveLabel);
    form.appendChild(objective);

    var fieldset = createElement("fieldset", { className: "orientation-known" });
    fieldset.appendChild(createElement("legend", {}, "Cursus déjà connus, facultatif"));
    manifest.courses.forEach(function (course) {
      var label = createElement("label", {});
      var checkbox = createElement("input", { type: "checkbox", value: course.id, name: "known-course" });
      checkbox.checked = preferences.knownCourseIds.indexOf(course.id) !== -1;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + course.title));
      fieldset.appendChild(label);
    });
    form.appendChild(fieldset);
    var actions = createElement("div", { className: "orientation-actions" });
    var submit = createElement("button", { type: "submit" }, "Afficher des propositions");
    var reset = createElement("button", { type: "button", className: "orientation-reset" }, "Réinitialiser mes choix locaux");
    var explore = createElement("a", { href: "../carte-cursus/", className: "orientation-explore" }, "Explorer librement");
    actions.appendChild(submit);
    actions.appendChild(reset);
    actions.appendChild(explore);
    form.appendChild(actions);
    container.appendChild(form);
    var results = createElement("section", { className: "orientation-results", "aria-live": "polite", "aria-labelledby": "orientation-results-title" });
    results.appendChild(createElement("h2", { id: "orientation-results-title" }, "Prochaines fiches possibles"));
    container.appendChild(results);

    function currentPreferences() {
      return {
        objectiveId: objective.value,
        knownCourseIds: Array.from(form.querySelectorAll('input[name="known-course"]:checked')).map(function (input) { return input.value; }),
        knownFicheIds: preferences.knownFicheIds.slice(),
      };
    }

    function update(persist) {
      preferences = currentPreferences();
      if (persist) savePreferences(storage, preferences);
      var proposals = recommend(manifest, preferences, 6);
      results.querySelectorAll(".orientation-card, .orientation-empty").forEach(function (node) { node.remove(); });
      if (!proposals.length) {
        results.appendChild(createElement("p", { className: "orientation-empty" }, "Aucune proposition supplémentaire. Tu peux modifier tes choix ou explorer librement."));
        return;
      }
      proposals.forEach(function (proposal) {
        var card = createElement("article", { className: "orientation-card" });
        card.appendChild(createElement("h3", {}, proposal.fiche.title));
        card.appendChild(createElement("p", {}, proposal.reason));
        if (proposal.missingIds.length || proposal.missingCourses.length) {
          var details = createElement("details", {});
          details.appendChild(createElement("summary", {}, "Voir les prérequis recommandés"));
          details.appendChild(createElement("p", {}, proposal.missingIds.concat(proposal.missingCourses).join(", ")));
          card.appendChild(details);
        }
        var open = createElement("a", { href: "../" + proposal.fiche.href }, proposal.missingIds.length || proposal.missingCourses.length ? "Commencer malgré les prérequis" : "Ouvrir la fiche");
        var known = createElement("button", { type: "button", "data-fiche-id": proposal.fiche.id }, "Je connais déjà cette fiche");
        known.addEventListener("click", function () {
          if (preferences.knownFicheIds.indexOf(proposal.fiche.id) === -1) preferences.knownFicheIds.push(proposal.fiche.id);
          savePreferences(storage, preferences);
          update(false);
        });
        card.appendChild(open);
        card.appendChild(known);
        results.appendChild(card);
      });
    }

    form.addEventListener("submit", function (event) { event.preventDefault(); update(true); });
    reset.addEventListener("click", function () {
      resetPreferences(storage);
      preferences = { objectiveId: "", knownCourseIds: [], knownFicheIds: [] };
      objective.value = "";
      form.querySelectorAll('input[name="known-course"]').forEach(function (input) { input.checked = false; });
      update(false);
      objective.focus();
    });
    update(false);
  }

  function init() {
    var container = document.getElementById("curriculum-orientation");
    if (!container || container.dataset.initialized === "true") return;
    container.dataset.initialized = "true";
    var manifestUrl = new URL(container.getAttribute("data-manifest"), window.location.href);
    fetch(manifestUrl, { credentials: "same-origin" })
      .then(function (response) { if (!response.ok) throw new Error("manifest"); return response.json(); })
      .then(function (manifest) { render(container, manifest, getBrowserStorage()); })
      .catch(function () {
        container.replaceChildren(createElement("p", {}, "L’orientation interactive est indisponible. La carte complète reste accessible."));
        container.appendChild(createElement("a", { href: "../carte-cursus/" }, "Explorer librement"));
      });
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", init);
    if (typeof document$ !== "undefined" && document$.subscribe) document$.subscribe(init);
  }

  return { STORAGE_KEY: STORAGE_KEY, getBrowserStorage: getBrowserStorage, safeStorage: safeStorage, loadPreferences: loadPreferences, savePreferences: savePreferences, resetPreferences: resetPreferences, recommend: recommend, render: render, init: init };
});
