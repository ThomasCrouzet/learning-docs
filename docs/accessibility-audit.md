---
tags:
  - UX
  - Référence
description: "Audit d'accessibilité WCAG 2.2 AA du wiki MkDocs Material (baseline, corrections, vérifications)."
estimated_time: "15 min"
fiche_number: 1
total_fiches: 1
cursus: "Références"
---

# Audit d'accessibilité WCAG 2.2 AA

> **En bref** : Rapport d'audit technique du site MkDocs Material (shell UI, composants custom, pages représentatives), avec baseline, corrections et résultats mesurés. Lecture estimée : 15 min.

## Prérequis

- Aucune connaissance préalable d'accessibilité n'est requise pour lire ce rapport.
- Contexte technique : le projet est un **wiki statique** (MkDocs Material 9.7.6 au moment de la campagne OSS ; pin courant du dépôt : 9.7.7, correctif XSS des suggestions de recherche du 17 juillet 2026), pas une SPA.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qui a été audité, ce qui a été corrigé, et comment rejouer les vérifications.

---

## 1. Périmètre

| Élément | Détail |
| ------- | ------ |
| Projet | `ThomasCrouzet/learning-docs` |
| Surface | Wiki MkDocs Material servi en build de production (`site/`) |
| Cible | WCAG 2.2 niveau AA |
| Contenu pédagogique | Plus de 700 pages HTML générées depuis `docs/**/*.md` |
| Code custom audité | `docs/stylesheets/extra.css`, `docs/javascripts/extra.js`, `docs/javascripts/mermaid-v2.js`, `docs/overrides/*` |
| Hors périmètre de correction massive | Réécriture éditoriale de 580+ fiches (signalée en limites si besoin cognitif) |
| Auth | Aucune authentification |

### Cartographie fonctionnelle

| Zone | Description | Risque a11y |
| ---- | ----------- | ----------- |
| Shell Material | Header, onglets, drawer mobile, recherche, TOC, footer | Contraste, focus, landmarks |
| Navigation | Sidebar multi-niveaux, tabs sticky, prune | Target size, sticky overlay |
| Contenu fiche | H1-H3, listes, tableaux, code, admonitions | Contraste code, sémantique |
| Checklists | Cases pymdownx `tasklist` | Labels manquants |
| Mermaid | Diagrammes + lightbox zoom | Clavier, dialog, focus |
| Progression | `.md-progress` (instant) + barre de lecture custom | Nom accessible ARIA |
| Thèmes | Clair (`default`) / sombre (`slate`) | Contraste liens/boutons |
| Préférences | `prefers-reduced-motion` | Animations |

---

## 2. Environnement

| Paramètre | Valeur |
| --------- | ------ |
| Date | 2026-07-22 |
| Branche | `audit/wcag-2.2-aa-2026-07` |
| Node | >= 22 (mesuré : v26.5.0) |
| MkDocs Material | 9.7.6 lors de la campagne ; pin courant `squidfunk/mkdocs-material:9.7.7` |
| Serveur de validation | `npx serve site -l 4173` (**build de production**, pas `mkdocs serve`) |
| axe-core | via `@axe-core/playwright` 4.12.1 |
| Playwright | 1.61.1 (Chromium desktop + mobile) |
| Tags axe | `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` |

---

## 3. Matrice de couverture

| Route / composant | États | Interaction | Risque | Test |
| ----------------- | ----- | ----------- | ------ | ---- |
| `/` | clair, sombre | lecture, liens, boutons | contraste header/accent | axe + structure |
| `/parcours/` | clair | navigation | densité | axe |
| `/a-propos/` | clair | lecture | contraste footer | axe |
| `/commencer/` | clair | démarrage | structure | axe |
| `/02-php/01-introduction-php/` | clair, mobile | checklist, code | labels, commentaires code | axe + labels |
| `/03-symfony/09-formulaires/` | clair | checklist, code | idem | axe |
| `/10-architecture/07-mvc-profondeur/` | clair | Mermaid | dialog clavier | axe + keyboard |
| `/ia/.../01-algebre-lineaire/` | clair | KaTeX/code | contraste code | axe |
| `/tags/` | clair | nombreux liens | contraste massif | axe |
| `/carte-cursus/`, index cursus | clair | listes | structure | axe |
| Drawer / search Material | mobile | ouverture | focus (thème) | structure mobile |
| Lightbox Mermaid | ouvert/fermé | Enter, Escape, Tab | focus trap | Playwright dédié |

Les pages HTML partagent le même shell. L'échantillon couvre les gabarits distincts (accueil, parcours, fiche riche, mermaid, tags, index cursus, 404).

---

## 4. Baseline (avant correction)

Commandes :

```bash
npm test                    # 377 passed
npm run lint                # OK
docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.7 build
npx serve site -l 4173
node e2e/axe-baseline.mjs
```

### Violations axe agrégées (échantillon 18 vues)

| Règle | Impact | Pages | Nœuds (ordre) | Cause racine |
| ----- | ------ | ----- | ------------- | ------------ |
| `color-contrast` | serious | 18/18 | ~3000+ | Teal Material `#009485` + blanc ~3.76:1 ; onglets inactifs ~2.59:1 ; accent liens ; commentaires code ; badge méta |
| `aria-progressbar-name` | serious | 18/18 | 18 | `.md-progress` Material sans `aria-label` |
| `label` | critical | 5 | 37 | Checklists `task-list` : texte hors du `<label>` |
| `target-size` | serious | 2+ | 4+ | Sticky section nav (lifted) masquant les enfants ; cibles denses |

Aucune violation causée par les modifications à ce stade (baseline pure).

---

## 5. Corrections réalisées

Journal :

| ID | Critère WCAG | Emplacement | Preuve initiale | Cause | Correction | Test |
| -- | ------------ | ----------- | --------------- | ----- | ---------- | ---- |
| C1 | 1.4.3 Contraste | `extra.css` primary teal | blanc sur `#009485` 3.76:1 | palette Material | Primary `#00695c` (~6.61:1) ; onglets blancs | axe 0 contrast header |
| C2 | 1.4.3 | `extra.css` accent | `#e64a19` sur blanc 3.91:1 | accent deep-orange | Accent `#bf360c` (~5.60:1) | axe home links |
| C3 | 1.4.3 | `extra.css` code | `.c1` `#717171` / `#f5f5f5` 4.47:1 | variables Material | Commentaires `#424242` | axe fiches code |
| C4 | 1.4.3 | `extra.css` slate | boutons `#00695c` sur `#1e2129` 2.43:1 | primary sombre | Liens/boutons slate `#4db6ac` | axe dark home |
| C5 | 1.4.3 | `extra.css` méta/footer | badge 4.41:1 ; copyright 4.47:1 | gris trop clair | Couleurs renforcées | axe 0 |
| C6 | 4.1.2 Nom | `overrides/main.html` | progressbar sans nom | thème | `aria-label` via script post-load | Playwright progress |
| C7 | 1.3.1 / 4.1.2 | `extra.js` checklists | input sans nom | pymdownx custom_checkbox | `aria-label` depuis texte item + enable | Playwright labels |
| C8 | 2.5.8 Target Size | `extra.css` nav | sticky lifted | Material | `position: static` sur section active lifted ; min-height liens | axe target-size 0 |
| C9 | 2.1.1 / 2.4.3 | `mermaid-v2.js` | div click-only | custom | rôle=button, tabindex=0, dialog, focus trap, Escape, restore | Playwright mermaid |
| C10 | 2.3.3 | `extra.js` | smooth scroll | custom | honore `prefers-reduced-motion` | présence CSS + logique |
| C11 | 4.1.2 | `extra.js` solutions | `aria-live` abusif | custom | retiré (détails natif) | revue manuelle |
| C12 | 2.4.1 | `404.html` | skip vide | page sans ancre | `id` H1 + liens base_url | structure |
| C13 | 2.1.1 | `extra.js` scroll regions | `scrollable-region-focusable` mobile | code/tableaux overflow | `tabindex=0` + `role=region` si overflow | Playwright mobile |
| C14 | 2.1.1 | `extra.js` flèches + `mermaid-v2.js` | flèches changeaient de fiche depuis région scrollable / dialog | raccourcis globaux trop larges | skip si scroll-region / dialog ; capture+stopPropagation dans lightbox | Playwright flèches + mermaid |

---

## 6. Vérifications exécutées (après correction)

### Passe 1 - Statique

| Commande | Résultat |
| -------- | -------- |
| `npm test` | 377 passed |
| `npm run lint` | OK (baseline) |
| Recherche `tabindex` positif dans code UI | Aucun (seule mention pédagogique React) |
| `aria-hidden` sur séparateurs décoratifs | OK (pipes méta) |

### Passe 2 - Tests

| Commande | Résultat |
| -------- | -------- |
| `npm test` | 377 passed |
| `npx playwright test e2e/a11y.spec.js --project=chromium-desktop` | **44 passed** |
| `npx playwright test e2e/a11y.spec.js --project=chromium-mobile` | (voir artefact `playwright-mobile.txt`) |

### Passe 3 - axe sur build de production

| Commande | Résultat |
| -------- | -------- |
| `docker ... mkdocs-material:9.7.7 build` | pin courant (la campagne OSS a mesuré 9.7.6) |
| `npx serve site -l 4173` | OK |
| `node e2e/axe-baseline.mjs` (post-fix) | **0 violations** sur 18 vues (clair, sombre, mobile, 404) |

### Passe 4 - Clavier (guidée, automatisée + manuelle)

| Parcours | Résultat |
| -------- | -------- |
| Skip link → ancre contenu | OK (Playwright) |
| Tab initial sur en-tête | OK (élément focusable) |
| Mermaid : Enter ouvre, Escape ferme, focus restauré | OK (Playwright) |
| Checklists cochables au clavier | OK (enabled + nom) |

### Passe 5 - Visuel / préférences

| Condition | Résultat |
| --------- | -------- |
| Thème clair | Contraste header/onglets/code OK (axe) |
| Thème sombre | Boutons/liens teal clair OK (axe) |
| `prefers-reduced-motion` | Règle CSS présente ; scroll reprise sans smooth forcé |
| Mobile 375px | 0 violation axe sur fiche PHP |

### Passe 6 - Contre-audit des corrections

| Risque recherché | Constat |
| ---------------- | ------- |
| ARIA cosmétique pour tromper axe | Non : labels checklist issus du texte visible ; progressbar nommée réellement |
| Règles axe désactivées | Non |
| Sticky nav désactivé | Oui, volontairement sur section active lifted (justifié 2.5.8) |
| Secrets dans le diff | Non |

### Passe 7 - Build propre final

| Étape | Résultat |
| ----- | -------- |
| Rebuild Docker production | OK |
| Tests unitaires | 377 passed |
| E2E axe sur `serve site` | 0 violations + 44 tests Playwright desktop |

---

## 7. Avant / après (échantillon)

| Métrique | Baseline | Après |
| -------- | -------- | ----- |
| Pages avec `aria-progressbar-name` | 18/18 | 0 |
| Pages avec `label` (checklists) | 5 | 0 |
| Violations `color-contrast` (accueil) | 26 nœuds | 0 |
| Violations `color-contrast` (tags) | 1964 nœuds | 0 |
| Violations `target-size` (fiches) | présentes | 0 |
| Total violations axe (18 vues) | > 0 partout | **0 partout** |

---

## 8. Limites résiduelles

1. **Thème Material upstream** : d'autres pages hors échantillon partagent le shell corrigé via CSS/JS global ; un balayage exhaustif des 700 HTML n'a pas été rejoué page par page (couverture par gabarit + tests E2E).
2. **Contenu Markdown pédagogique** : accessibilité cognitive éditoriale (longueur, jargon) traitée par les audits documentaires existants (`npm run audit:docs`), pas réécrite ici.
3. **Contraste monochrome forcé** (`forced-colors`) : non instrumenté automatiquement.
4. **incomplete axe** : quelques nœuds `color-contrast` incomplete (éléments non déterministes) - pas des violations.

---

## 9. Commandes de non-régression

```bash
npm install
docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.7 build
npx serve site -l 4173   # terminal séparé
npm test
npm run test:e2e:a11y
npm run test:a11y:baseline
```

---

## 10. Fichiers modifiés (principaux)

- `docs/stylesheets/extra.css` - contraste, focus, nav, code, reduced-motion
- `docs/javascripts/extra.js` - checklists, reduced-motion scroll, solutions
- `docs/javascripts/mermaid-v2.js` - lightbox accessible
- `docs/overrides/main.html` - nom progressbar, méta
- `docs/overrides/404.html` - ancre + liens
- `e2e/a11y.spec.js`, `e2e/axe-baseline.mjs`, `playwright.config.js`
- `package.json` - scripts e2e / a11y

---

## Navigation

← Retour : **[Accueil](index.md)**

→ Référence UX : **[Cursus UX Design](27-ux-design/index.md)**
