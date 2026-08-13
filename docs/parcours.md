---
hide:
  - toc
description: "Parcours d'apprentissage suggérés à travers les cursus du wiki, par profil et objectif."
---

# Parcours suggérés

> **En bref** : Plusieurs chemins proposés à travers les 64 cursus du wiki, adaptés à différents profils et objectifs. Chaque parcours est une suggestion d'ordre, libre à toi d'adapter selon tes besoins.

## Comment lire cette page

Chaque parcours liste les cursus dans un ordre qui maximise les dépendances naturelles : le cursus N s'appuie sur ce qui a été vu dans les cursus précédents. Tu peux sauter une étape si tu connais déjà le sujet, mais l'ordre proposé minimise les concepts manquants.

Les temps estimés sont des fourchettes basées sur les fiches du wiki. Le temps réel dépend de ton rythme et de tes objectifs (lecture rapide vs pratique approfondie).

---

## Parcours 1 - Du débutant au développeur web junior

**Public** : tu débutes en programmation et tu veux construire des applications web complètes (backend + frontend) en autonomie guidée.

**Objectif** : savoir réaliser, avec les fiches du wiki, un projet web Symfony + JavaScript/React de bout en bout (CRUD, auth basique, front simple). Ce n'est **pas** l'équivalent d'un titre de développeur junior en entreprise : la pratique sur de vrais projets et la relecture par des pairs restent nécessaires.

**Temps estimé** : ~200h de lecture et d'exercices du wiki, soit environ 3-6 mois à raison de 1-2h par jour (fourchette indicative).

### Étape 1 - Fondations (~10h)

- [Commencer](commencer/index.md) : préparer ton environnement
- [Outils IA](00-outils-ia/index.md) : apprendre à apprendre avec l'IA
- [Docker](01-docker/index.md) : isoler ton environnement de développement
- [Git](epitech/03-git/index.md) : versionner ton code

### Étape 2 - Backend PHP/Symfony (~50h)

- [PHP](02-php/index.md) : syntaxe, POO, exceptions
- [PostgreSQL](04-postgresql/index.md) : modélisation et requêtes
- [Symfony](03-symfony/index.md) : framework, Doctrine, contrôleurs
- [EasyAdmin](03-easyadmin/index.md) : interface d'administration

### Étape 3 - Frontend moderne (~50h)

- [JavaScript Moderne](06-javascript-moderne/index.md) : ES6+, Promises, async/await
- [TypeScript](07-typescript/index.md) : typage statique
- [React](08-react/index.md) : composants, hooks, Router

### Étape 4 - Qualité (~40h)

- [Testing](09-testing/index.md) : PHPUnit, Jest, Playwright
- [Architecture](10-architecture/index.md) : design patterns, SOLID
- [API Design](12-api-design/index.md) : REST, OpenAPI

### Étape 5 - Outils transverses (~20h)

- [CI/CD](11-ci-cd/index.md) : automatiser les tests et le déploiement
- [Gestion de Projet](25-gestion-projet/index.md) : organiser le travail
- [Droit et RGPD](26-droit-rgpd/index.md) : ce qu'il faut savoir avant de gérer des données utilisateurs

---

## Parcours 2 - Du dev backend au DevOps

**Public** : tu maîtrises déjà le développement applicatif et tu veux comprendre l'infrastructure qui fait tourner ton code en production.

**Objectif** : déployer, monitorer et opérer une application sur un cluster Kubernetes avec Ansible.

**Temps estimé** : ~150h.

### Étape 1 - Fondations système (~30h)

- [Unix/Bash](epitech/02-unix-bash/index.md) : ligne de commande, scripting
- [Réseaux](20-reseaux/index.md) : TCP/IP, DNS, routage
- [Services Système](21-services-systeme/index.md) : systemd, logs, cron

### Étape 2 - Conteneurisation (~30h)

- [Docker](01-docker/index.md) (révision)
- [Podman](devops/01-podman/index.md) : alternative sans démon
- [Virtualisation](24-virtualisation/index.md) : KVM, Proxmox

### Étape 3 - Orchestration (~40h)

- [Kubernetes](devops/03-kubernetes/index.md) : Pods, Deployments, Services
- [OpenShift](devops/02-openshift/index.md) : plateforme Red Hat

### Étape 4 - Automation et observabilité (~50h)

- [Ansible](ansible/index.md) : playbooks, rôles, vault
- [CI/CD](11-ci-cd/index.md) : pipelines de déploiement
- [Monitoring](14-monitoring/index.md) : Prometheus, Grafana, Loki
- [Cloud](22-cloud/index.md) : AWS/GCP/Azure

---

## Parcours 3 - Préparation à la certification RNCP

**Public** : tu vises une certification professionnelle RNCP en développement / architecture SI.

**Objectif** : couvrir les 5 blocs de compétences du référentiel **à titre d'entraînement et de cartographie**. Ce wiki **ne délivre pas** de diplôme ni de certification RNCP ; seule un organisme habilité peut le faire.

**Temps estimé** : variable selon ton niveau de départ.

### Bloc 1 - Besoins utilisateurs

- [BC01 - Besoins utilisateurs](00-blocs-competences/BC01-besoins-utilisateurs/index.md) : cahier des charges, étude de marché, faisabilité

### Bloc 2 - Pilotage projet

- [BC02 - Pilotage projet](00-blocs-competences/BC02-pilotage-projet/index.md) : agile, équipe, planification
- [Gestion de Projet](25-gestion-projet/index.md) : approfondissement

### Bloc 3 - Cloud computing

- [BC03 - Cloud computing](00-blocs-competences/BC03-cloud-computing/index.md) : IaC, déploiement continu, K8s
- Approfondir avec : [CI/CD](11-ci-cd/index.md), [Cloud](22-cloud/index.md), [Kubernetes](devops/03-kubernetes/index.md)

### Bloc 4 - Développement logiciel

- [BC04 - Développement logiciel](00-blocs-competences/BC04-developpement-logiciel/index.md) : architecture serveur, sécurité, tests, mobile
- Approfondir avec : [Testing](09-testing/index.md), [Architecture](10-architecture/index.md), [Dev Mobile](23-dev-mobile/index.md)

### Bloc 5 - Architecture SI

- [BC05 - Architecture SI](00-blocs-competences/BC05-architecture-si/index.md) : infra réseau, supervision, sécurité, audit
- Approfondir avec : [Réseaux](20-reseaux/index.md), [Monitoring](14-monitoring/index.md), [Cybersécurité](cybersecurite/index.md)

---

## Parcours 4 - Introduction structurée à la cybersécurité

**Public** : tu veux découvrir la sécurité informatique (défense, offensive, GRC) de façon ordonnée.

**Objectif** : **lire et comprendre** le parcours en 8 phases, puis **pratiquer** sur des labs (hors wiki) avant toute ambition professionnelle. Les ~35h de lecture ne suffisent pas pour un métier en cybersécurité.

**Temps estimé** : ~35h pour parcourir les fiches ; plusieurs années de pratique, labs et expérience pour un niveau professionnel.

### Suivi linéaire des 8 phases du cursus

1. [Phase 1 - Fondamentaux informatiques](cybersecurite/01-fondamentaux-informatiques/index.md)
2. [Phase 2 - Fondamentaux sécurité](cybersecurite/02-fondamentaux-securite/index.md)
3. [Phase 3 - Compétences intermédiaires](cybersecurite/03-competences-intermediaires/index.md)
4. [Phase 4 - Spécialisation offensive](cybersecurite/04-specialisation-offensive/index.md) (pentest, AD, web avancé)
5. [Phase 5 - Spécialisation défensive](cybersecurite/05-specialisation-defensive/index.md) (DFIR, malware, threat hunting)
6. [Phase 6 - Domaines avancés](cybersecurite/06-domaines-avances/index.md) (cloud, OT/ICS, IA/ML)
7. [Phase 7 - Red team avancé](cybersecurite/07-red-team-avance/index.md) (C2, évasion, exploit dev)
8. [Phase 8 - Expertise et leadership](cybersecurite/08-expertise-leadership/index.md)

**Cursus complémentaires recommandés** :

- [Réseaux](20-reseaux/index.md) : prérequis avant Phase 3
- [Langage C](19-langage-c/index.md) : prérequis avant Phase 7 (exploit dev)
- [Cloud](22-cloud/index.md) : pour la sécurité cloud (Phase 6)

---

## Parcours 5 - Introduction structurée à l'IA / Machine Learning

**Public** : tu veux comprendre les bases des systèmes d'IA modernes (ML classique, deep learning, LLM, agents).

**Objectif** : **lire et comprendre** le cursus en 9 phases et réaliser les exercices indiqués. Ce n'est pas une formation d'ingénieur IA : la recherche, les projets et l'expérience professionnelle restent hors périmètre d'une simple lecture.

**Temps estimé** : ~30h pour parcourir le cursus IA, plus le temps de pratique sur des notebooks et projets personnels.

### Suivi linéaire des 9 phases du cursus

1. [Phase 1 - Fondamentaux mathématiques](ia/01-fondamentaux-mathematiques/index.md)
2. [Phase 2 - Programmation et outils](ia/02-programmation-outils/index.md)
3. [Phase 3 - Machine learning classique](ia/03-machine-learning-classique/index.md)
4. [Phase 4 - Deep learning fondamental](ia/04-deep-learning-fondamental/index.md)
5. [Phase 5 - Architectures modernes et NLP](ia/05-architectures-modernes-nlp/index.md)
6. [Phase 6 - Large Language Models](ia/06-large-language-models/index.md)
7. [Phase 7 - Systèmes agentiques et MLOps](ia/07-systemes-agentiques-mlops/index.md)
8. [Phase 8 - Spécialisations avancées](ia/08-specialisations-avancees/index.md)
9. [Phase 9 - Expertise, recherche et leadership](ia/09-expertise-recherche-leadership/index.md)

**Cursus complémentaires** :

- [Python](15-python/index.md) puis [Python Data](16-python-data/index.md) : base technique indispensable
- [Architecture](10-architecture/index.md) : pour désigner des systèmes ML en production
- [Monitoring](14-monitoring/index.md) : pour le MLOps

---

## Parcours 6 - Approche curieuse, par domaines indépendants

**Public** : tu n'as pas d'objectif professionnel précis et tu veux explorer plusieurs domaines.

Ces cursus sont **indépendants** : tu peux les commencer sans prérequis.

- [Faust](faust/index.md) : programmation audio fonctionnelle, traitement DSP
- [Crypto-monnaies](crypto-monnaies/index.md) : comprendre la blockchain sans le battage médiatique
- [Cursus Epitech](epitech/index.md) : Java, Rust, Node.js - langages multiples
- [UX Design](27-ux-design/index.md) : ergonomie et accessibilité
- [Audit et Qualité](28-audit-qualite/index.md) : cartographier et auditer une application existante

---

## Tu ne sais toujours pas par où commencer ?

- **Si tu veux écrire du code rapidement** : commence par [PHP](02-php/index.md) ou [Python](15-python/index.md).
- **Si tu veux comprendre l'écosystème web moderne** : commence par [JavaScript Moderne](06-javascript-moderne/index.md).
- **Si tu veux préparer un entretien technique** : utilise les [Aide-mémoires](fiches-reference/index.md) pour réviser rapidement.
- **Si tu veux voir tout ce qui existe** : consulte la [Carte des cursus](carte-cursus.md).
