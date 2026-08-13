# Learning Docs

Documentation pédagogique francophone pour apprendre le développement logiciel, l'infrastructure, le DevOps et des domaines associés, avec une **structure explicite** et une **progression ordonnée**.

Le contenu d'apprentissage (`docs/`) est **en français**. Ce dépôt et le site public s'adressent d'abord à un public francophone.

| Métrique (recalculée depuis le dépôt) | Valeur |
| ------------------------------------- | -----: |
| Fiches pédagogiques (gate structure) | **604** |
| Cursus (carte générée) | **64** |
| Pages Markdown sous `docs/` | **~700** |

Les chiffres de référence sont dans [`docs/carte-cursus.md`](docs/carte-cursus.md) (`npm run generate:cursus-map`). Ne pas traiter des arrondis marketing comme source de vérité.

Site public (lorsqu'il est déployé) : <https://thomascrouzet.github.io/learning-docs/>

---

## À quoi sert ce projet

- Un grand ensemble de **fiches** Markdown avec les mêmes sections prévisibles : prérequis, objectifs, concepts, étapes pratiques, pièges, checklist, exercice, navigation.
- Un wiki **MkDocs Material**, avec des validateurs et des tests **Node.js**.
- Un apprentissage **en autonomie**, y compris hors ligne après clone ou hébergement local.
- Une rédaction pensée pour des besoins d'apprentissage **explicites et prévisibles** (structure stable, consignes sans implicite, étapes courtes, charge cognitive réduite).

Le projet a été conçu initialement par une personne autiste pour répondre à des besoins d'apprentissage vécus. Cela **n'est pas** une affirmation d'adaptation universelle à toutes les personnes neurodivergentes, ni un substitut à une pédagogie professionnelle, à une recherche utilisateur dédiée ou à un accompagnement adapté.

## Provenance IA et responsabilité éditoriale

La **majorité du corpus a été générée ou largement développée avec l'aide de l'intelligence artificielle**. La relecture humaine est progressive et reste incomplète. Les contrôles automatiques attrapent surtout la structure, beaucoup de liens et des régressions d'outillage : ils **ne prouvent pas** que chaque phrase technique ou chaque exemple de code est exact.

Cette provenance fait partie du projet, pas d'une note de bas de page. Le dépôt décrit sa méthode de revue, ses limites et sa politique de fraîcheur pour que chacun puisse juger le niveau de confiance. Les outils d'audit peuvent produire des rapports locaux machine-readable, mais ces artefacts générés ne sont pas versionnés comme garantie publique. Voir [docs/a-propos.md](docs/a-propos.md) et [docs/politique-fraicheur.md](docs/politique-fraicheur.md).

### Rôles (résumé)

| Rôle | Responsabilité |
| ---- | -------------- |
| Intention et cadre pédagogique | humains (mainteneurs) |
| Production ou enrichissement du contenu | majoritairement assisté par IA |
| Décision de fusion dans le dépôt | humains |
| Gates automatiques (lint, tests, build) | scripts CI / locaux |
| Certification juridique, fiscale, médicale ou de sécurité | **hors périmètre** |

## Domaines couverts (aperçu)

Pile web (Docker, PHP, Symfony, PostgreSQL, JavaScript, TypeScript, React), qualité (tests, architecture, API), infrastructure (CI/CD, Kubernetes, Ansible, monitoring, cloud), systèmes et parcours Epitech, cybersécurité, IA, Faust (audio DSP), crypto-monnaies (ton critique, sans promotion), gestion de projet, introduction RGPD, UX et fiches de référence.

Carte complète : [`docs/carte-cursus.md`](docs/carte-cursus.md).

---

## Démarrage rapide (clone propre)

```bash
git clone https://github.com/ThomasCrouzet/learning-docs.git
cd learning-docs
npm ci
docker compose up -d
```

Ouvre `http://localhost:8100`.

**Prérequis** : Node.js >= 22, Docker. Gestionnaire de paquets : **npm** uniquement (`package-lock.json`).

### Validation et build

| Tâche | Commande |
| ----- | -------- |
| Tests unitaires | `npm test` |
| Gate complète (tests + suite lint) | `npm run validate` |
| Audit documentaire | `npm run audit:docs` |
| Échantillon d'exécution de snippets | `npm run audit:snippets` |
| Régénérer la carte des cursus | `npm run generate:cursus-map` |
| Build MkDocs strict | `docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.7 build --strict` |
| Ou avec Python local | `pip install -r requirements.txt && mkdocs build --strict` |

Les versions de référence de la pile principale sont résumées dans [docs/a-propos.md](docs/a-propos.md). Préférer les lignes LTS ou maintenues plutôt que le dernier numéro disponible, sauf si une fiche traite explicitement du legacy.

---

## Contribuer et support

- [CONTRIBUTING.md](CONTRIBUTING.md) - proposer un changement
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md) - signaler une vulnérabilité
- Modèles d'issues sous `.github/ISSUE_TEMPLATE/` (erreur factuelle, contenu obsolète, lien cassé, accessibilité)

### Signaler un problème de contenu

| Type | Comment |
| ---- | ------- |
| Erreur factuelle | Issue « erreur factuelle » avec chemin de la fiche et extrait |
| Contenu périmé | Issue « contenu obsolète » avec version observée |
| Lien mort | Issue « lien cassé » |
| Accessibilité | Issue « accessibilité » (clavier, contraste, mobile, charge cognitive) |

## Licence

| Partie | Licence |
| ------ | ------- |
| Contenu pédagogique (`docs/`) | [CC BY 4.0](LICENSE) |
| Outillage du projet (`scripts/`, aides CI, …) | [MIT](LICENSE-CODE) |
| Assets tiers (KaTeX et Mermaid) | [NOTICE](NOTICE) |

## Structure du dépôt (court)

```text
docs/           # contenu du wiki (français)
scripts/        # validateurs et générateurs
e2e/            # contrôles d'accessibilité Playwright
mkdocs.yml      # navigation et thème du site
docker-compose.yml
```

Les prompts de mainteneur locaux, les rapports d'audit générés et les plans de travail ponctuels ne font pas partie de la surface pédagogique publiée ; privilégier la documentation et les scripts publics ci-dessus.

---

## English (short)

Learning Docs is a **French-first** pedagogical wiki (MkDocs Material + Node validators) for self-paced learning in software and infrastructure topics. Most of the corpus was produced with AI assistance; human review is incomplete; automated gates do not certify every technical claim. See [docs/a-propos.md](docs/a-propos.md). Content licence: CC BY 4.0; tooling: MIT.
