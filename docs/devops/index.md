---
tags:
  - Podman
  - OpenShift
  - Kubernetes
  - Ansible
  - CI/CD
  - Monitoring
description: "Infrastructure : CI/CD, conteneurisation, orchestration, monitoring et automatisation."
hide:
  - toc
---

# Infrastructure

Ce cursus couvre les outils d'infrastructure : pipelines CI/CD, conteneurisation rootless avec Podman, orchestration avec OpenShift et Kubernetes, observabilité avec Prometheus/Grafana, et automatisation avec Ansible.

**57 fiches** réparties sur 6 modules.

---

## CI/CD Pipelines (10 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à la CI/CD](../11-ci-cd/01-introduction-ci-cd.md) | Concepts fondamentaux de l'intégration et du déploiement continus |
| 02 | [GitHub Actions - Premiers pas](../11-ci-cd/02-github-actions-premiers-pas.md) | Créer et exécuter un premier workflow GitHub Actions |
| 03 | [GitHub Actions - Tests et lint](../11-ci-cd/03-github-actions-tests-lint.md) | Configurer tests et linting automatiques |
| 04 | [GitHub Actions - Build et artefacts](../11-ci-cd/04-github-actions-build-artefacts.md) | Builder des images Docker et gérer les artefacts |
| 05 | [GitHub Actions - Avancé](../11-ci-cd/05-github-actions-avance.md) | Matrix builds, secrets, environments, réutilisation |
| 06 | [GitLab CI - Introduction](../11-ci-cd/06-gitlab-ci-introduction.md) | Fichier .gitlab-ci.yml, stages, jobs, runners |
| 07 | [GitLab CI - Pipeline complet](../11-ci-cd/07-gitlab-ci-pipeline-complet.md) | Pipeline complet avec services, cache et environments |
| 08 | [Exécution locale des pipelines](../11-ci-cd/08-execution-locale-pipelines.md) | Exécuter les pipelines en local avec act et gitlab-runner |
| 09 | [Stratégies de déploiement](../11-ci-cd/09-strategies-deploiement.md) | Blue-green, canary et rolling update |
| 10 | [Projet intégrateur](../11-ci-cd/10-projet-integrateur.md) | Pipeline CI/CD complet pour Symfony + React |

---

## Podman (5 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à Podman](01-podman/01-introduction-podman.md) | Découvrir Podman et la conteneurisation rootless |
| 02 | [Images et conteneurs](01-podman/02-images-conteneurs.md) | Gérer les images et les conteneurs |
| 03 | [Pods](01-podman/03-pods-podman.md) | Les pods dans Podman |
| 04 | [Podman Compose et Quadlet](01-podman/04-podman-compose.md) | Podman Compose et Quadlet |
| 05 | [Fonctionnalités avancées](01-podman/05-podman-avance.md) | Fonctionnalités avancées de Podman |

---

## OpenShift (6 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à OpenShift](02-openshift/01-introduction-openshift.md) | Découvrir la plateforme Red Hat OpenShift |
| 02 | [Installation CRC](02-openshift/02-installation-crc.md) | Installer un cluster local avec CRC |
| 03 | [Déployer une application](02-openshift/03-deploiement-application.md) | Déployer une application sur OpenShift |
| 04 | [Routes et services](02-openshift/04-routes-services.md) | Routes et services |
| 05 | [Builds et ImageStreams](02-openshift/05-builds-imagestreams.md) | Builds et ImageStreams |
| 06 | [Stockage et configuration](02-openshift/06-stockage-configuration.md) | Stockage et configuration (projet intégrateur) |

---

## Kubernetes (12 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à Kubernetes](03-kubernetes/01-introduction-kubernetes.md) | Architecture, composants et cas d'utilisation |
| 02 | [Installation Minikube](03-kubernetes/02-installation-minikube.md) | Installation locale avec Minikube et kubectl |
| 03 | [Pods et containers](03-kubernetes/03-pods-containers.md) | Créer, inspecter et gérer les pods |
| 04 | [Deployments et ReplicaSets](03-kubernetes/04-deployments-replicasets.md) | Cycle de vie, réplication et mises à jour |
| 05 | [Services et networking](03-kubernetes/05-services-networking.md) | ClusterIP, NodePort, LoadBalancer et Ingress |
| 06 | [ConfigMaps et Secrets](03-kubernetes/06-configmaps-secrets.md) | Externaliser la configuration et les données sensibles |
| 07 | [Volumes et persistance](03-kubernetes/07-volumes-persistance.md) | PV, PVC et StorageClasses |
| 08 | [Namespaces et RBAC](03-kubernetes/08-namespaces-rbac.md) | Isoler les environnements et contrôler les accès |
| 09 | [Health checks et autoscaling](03-kubernetes/09-health-checks-autoscaling.md) | Santé des pods et ajustement automatique des ressources |
| 10 | [Helm](03-kubernetes/10-helm-gestionnaire-packages.md) | Gestionnaire de packages Kubernetes |
| 11 | [Déployer Symfony sur Kubernetes](03-kubernetes/11-deployer-symfony-kubernetes.md) | Symfony + PostgreSQL + Redis sur Minikube |
| 12 | [Projet intégrateur](03-kubernetes/12-projet-integrateur.md) | Application complète Symfony + React + PostgreSQL |

---

## Monitoring et Observabilité (10 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à l'observabilité](../14-monitoring/01-introduction-observabilite.md) | Les trois piliers et la stack Prometheus+Grafana+Loki |
| 02 | [Logs structurés](../14-monitoring/02-logs-structures.md) | Monolog dans Symfony : niveaux, JSON, handlers |
| 03 | [Prometheus - Introduction](../14-monitoring/03-prometheus-introduction.md) | Architecture pull model, modèle de données, métriques |
| 04 | [Prometheus - Métriques applicatives](../14-monitoring/04-prometheus-metriques.md) | Instrumenter Symfony avec promphp et PromQL |
| 05 | [Grafana - Dashboards](../14-monitoring/05-grafana-dashboards.md) | Installer Grafana, connecter Prometheus, créer des dashboards |
| 06 | [Grafana - Alerting](../14-monitoring/06-grafana-alerting.md) | Alertes, contact points et notification policies |
| 07 | [Logs avec Loki](../14-monitoring/07-logs-loki.md) | Promtail, LogQL, corrélation logs-métriques |
| 08 | [Traces distribuées](../14-monitoring/08-traces-distribuees.md) | OpenTelemetry SDK PHP, Tempo, visualisation |
| 09 | [Monitoring d'infrastructure](../14-monitoring/09-monitoring-infrastructure.md) | node_exporter, cAdvisor, kube-state-metrics |
| 10 | [Projet intégrateur](../14-monitoring/10-projet-integrateur.md) | Stack d'observabilité complet pour Symfony |

---

## Ansible (14 fiches)

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Introduction à Ansible](../ansible/01-ansible/01-introduction-ansible.md) | Découvrir Ansible et ses principes fondamentaux |
| 02 | [Installation et configuration](../ansible/01-ansible/02-installation-configuration.md) | Installer Ansible et configurer l'environnement |
| 03 | [Inventaire](../ansible/01-ansible/03-inventaire.md) | Définir et organiser les hôtes gérés |
| 04 | [Commandes ad-hoc et modules](../ansible/01-ansible/04-commandes-ad-hoc-modules.md) | Exécuter des commandes ponctuelles avec les modules |
| 05 | [Playbooks fondamentaux](../ansible/01-ansible/05-playbooks-fondamentaux.md) | Écrire et exécuter des playbooks YAML |
| 06 | [Variables et facts](../ansible/01-ansible/06-variables-facts.md) | Utiliser les variables et les facts système |
| 07 | [Conditions et boucles](../ansible/01-ansible/07-conditions-boucles.md) | Contrôler l'exécution avec when et loop |
| 08 | [Templates Jinja2](../ansible/01-ansible/08-templates-jinja2.md) | Générer des fichiers dynamiques avec Jinja2 |
| 09 | [Handlers et tags](../ansible/01-ansible/09-handlers-tags.md) | Déclencher des actions et filtrer l'exécution |
| 10 | [Rôles](../ansible/01-ansible/10-roles.md) | Structurer le code avec les rôles Ansible |
| 11 | [Ansible Galaxy](../ansible/01-ansible/11-ansible-galaxy.md) | Partager et réutiliser des rôles avec Galaxy |
| 12 | [Ansible Vault](../ansible/01-ansible/12-ansible-vault.md) | Chiffrer les données sensibles |
| 13 | [Multi-environnement](../ansible/01-ansible/13-gestion-multi-environnement.md) | Gérer plusieurs environnements (dev, staging, prod) |
| 14 | [Intégration CI/CD](../ansible/01-ansible/14-integration-ci-cd.md) | Intégrer Ansible dans un pipeline CI/CD |

---

!!! note "Parcours recommandé"
    Commence par **CI/CD** pour comprendre les pipelines, puis **Podman** pour maîtriser les conteneurs, **OpenShift** et **Kubernetes** qui s'appuient sur ces connaissances. **Monitoring** et **Ansible** peuvent être suivis indépendamment.

<!-- material/tags { scope: true } -->
