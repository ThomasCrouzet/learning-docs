---
tags:
  - Monitoring
  - Intermédiaire
  - Pratique
description: "Prometheus - Introduction : architecture pull model, modèle de données, types de métriques et configuration Docker."
estimated_time: "75 min"
fiche_number: 3
total_fiches: 10
cursus: "Monitoring et Observabilité"
id: "infrastructure.monitoring.prometheus-introduction"
course_id: "infrastructure.monitoring"
content_type: "lesson"
order: 3
---

# 03 - Prometheus - Introduction

> **En bref** : À la fin de cette fiche, tu sauras installer Prometheus avec Docker, comprendre son architecture pull model, son modèle de données et les quatre types de métriques. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Introduction à l'observabilité](01-introduction-observabilite.md)
- Avoir lu la fiche [02 - Logs structurés](02-logs-structures.md)
- Savoir utiliser Docker et Docker Compose (cursus `01-docker/`)

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| Prometheus | 3.13.x |
| Docker | 27.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer et configurer Prometheus avec Docker, comprendre le pull model, configurer les targets et écrire des requêtes PromQL basiques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Prometheus ?

**Définition** : Prometheus est un système de monitoring et d'alerting open source, créé par SoundCloud en 2012 et maintenu par la Cloud Native Computing Foundation (CNCF). Il collecte et stocke des métriques sous forme de séries temporelles.

**Le problème que Prometheus résout** :

Sans Prometheus, voici les problèmes rencontrés :

1. **Pas de collecte automatique** : Tu dois écrire du code custom pour collecter les métriques de chaque service (CPU, mémoire, requêtes HTTP). Chaque service a un format différent.
2. **Pas de stockage historique** : Les métriques sont disponibles à l'instant T mais pas dans le temps. Impossible de voir une tendance sur les dernières 24 heures.
3. **Pas de langage de requête** : Pour calculer le taux d'erreurs par minute ou la latence au 95e percentile, tu dois écrire du code complexe.

**Comment Prometheus résout ces problèmes** :

| Problème | Solution apportée par Prometheus |
| --- | --- |
| Pas de collecte automatique | Prometheus scrape automatiquement les métriques exposées par chaque service à intervalle régulier |
| Pas de stockage historique | Prometheus stocke les métriques dans une base de données de séries temporelles optimisée |
| Pas de langage de requête | PromQL (Prometheus Query Language) permet des calculs complexes sur les métriques |

**Analogie concrète** : Prometheus fonctionne comme un agent de recensement qui fait le tour des maisons à heure fixe pour collecter des données (nombre d'habitants, consommation d'eau, température). Il note toutes ces données dans un registre organisé par date. Quand on lui pose une question ("Quelle maison consomme le plus d'eau ce mois-ci ?"), il consulte son registre et répond.

**Ce que Prometheus n'est PAS** :

- Prometheus n'est pas un outil de logs. Prometheus collecte des valeurs numériques (métriques), pas des messages texte. Pour les logs, utilise Loki (fiche 07).
- Prometheus n'est pas un outil de traces. Prometheus ne suit pas le parcours d'une requête à travers les services. Pour les traces, utilise Tempo ou Jaeger (fiche 08).
- Prometheus n'est pas un outil de visualisation. Prometheus stocke les données et fournit PromQL pour les interroger. Pour la visualisation (graphiques, dashboards), utilise Grafana (fiche 05).

---

### L'architecture pull model

**Définition** : Le pull model signifie que Prometheus va chercher (scrape) les métriques auprès de chaque service à intervalle régulier. C'est l'inverse du push model où les services envoient leurs métriques vers un serveur central.

**Le problème que le pull model résout** :

Sans pull model, voici les problèmes rencontrés avec le push model :

1. **Surcharge du serveur** : En push model, tous les services envoient leurs métriques en même temps. Le serveur central peut être submergé.
2. **Configuration distribuée** : Chaque service doit connaître l'adresse du serveur de métriques. Si l'adresse change, il faut reconfigurer tous les services.
3. **Détection de panne** : En push model, si un service ne pousse plus de métriques, tu ne sais pas s'il est en panne ou s'il n'a rien à envoyer.

**Comment le pull model résout ces problèmes** :

| Problème | Solution du pull model |
| --- | --- |
| Surcharge du serveur | Prometheus contrôle le rythme de collecte. Il scrape un service à la fois, à intervalles réguliers |
| Configuration distribuée | Seul Prometheus doit connaître les adresses des services. La configuration est centralisée |
| Détection de panne | Si Prometheus ne peut pas scraper un service, la métrique `up` passe à 0. La panne est détectée automatiquement |

**Analogie concrète** : Le pull model, c'est comme un facteur qui fait sa tournée tous les matins pour relever les compteurs d'eau. Il contrôle le rythme (une tournée par jour). Si une maison est fermée, il le note. Le push model, c'est comme si chaque habitant devait apporter sa facture à la mairie. Si tout le monde vient en même temps, c'est la cohue. Si quelqu'un ne vient pas, on ne sait pas s'il a oublié ou s'il a déménagé.

**Comment fonctionne le scraping** :

<div class="diagram-design">
<p><a href="../../diagrams/14-monitoring-03-prometheus-introduction-1.html">L&#x27;architecture pull model (HTML + SVG)</a></p>
<iframe src="../../diagrams/14-monitoring-03-prometheus-introduction-1.html" title="L&#x27;architecture pull model" style="width:100%;min-height:520px;border:0;background:transparent"></iframe>
</div>

Prometheus contrôle le rythme du scraping. Les services n'ont pas besoin de savoir que Prometheus existe : ils exposent leur endpoint `/metrics`.

Chaque service expose un endpoint HTTP `/metrics` qui retourne ses métriques au format texte Prometheus. Prometheus interroge ce endpoint à intervalles réguliers (par défaut 15 secondes).

---

### Le modèle de données

**Définition** : Prometheus stocke les métriques sous forme de séries temporelles. Une série temporelle est identifiée par un nom de métrique et un ensemble de labels (paires clé-valeur).

**Structure d'une métrique** :

```text
nom_de_la_metrique{label1="valeur1", label2="valeur2"} valeur timestamp
```

Exemple concret :

```text
http_requests_total{method="GET", status="200", handler="/api/products"} 1542 1710950400
```

Décomposition :

- **`http_requests_total`** : nom de la métrique (nombre total de requêtes HTTP)
- **`{method="GET", status="200", handler="/api/products"}`** : labels qui identifient cette série
- **`1542`** : valeur actuelle (1542 requêtes)
- **`1710950400`** : timestamp Unix (optionnel, Prometheus l'ajoute automatiquement)

**Les labels** :

Les labels permettent de filtrer et d'agréger les métriques. La même métrique `http_requests_total` peut avoir plusieurs combinaisons de labels :

```text
http_requests_total{method="GET", status="200"} 1542
http_requests_total{method="GET", status="404"} 23
http_requests_total{method="POST", status="200"} 456
http_requests_total{method="POST", status="500"} 7
```

Chaque combinaison unique de labels crée une série temporelle distincte.

---

### Les quatre types de métriques

**Définition** : Prometheus définit quatre types de métriques. Chaque type a un usage précis.

**Type 1 : Counter (compteur)**

Un counter est une valeur qui ne fait qu'augmenter (ou revenir à zéro en cas de redémarrage). Il sert à compter des événements.

Exemples :

- Nombre de requêtes HTTP traitées
- Nombre d'erreurs survenues
- Nombre d'octets envoyés

```text
# Compteur : ne fait qu'augmenter
http_requests_total{method="GET"} 1542
http_requests_total{method="GET"} 1543  (15 secondes plus tard)
http_requests_total{method="GET"} 1545  (15 secondes plus tard)
```

Un counter seul n'est pas très utile. On utilise la fonction `rate()` en PromQL pour calculer le taux d'augmentation par seconde.

**Type 2 : Gauge (jauge)**

Un gauge est une valeur qui peut monter et descendre. Il représente un état actuel.

Exemples :

- Température du CPU
- Nombre de connexions actives
- Quantité de mémoire utilisée

```text
# Jauge : monte et descend
node_memory_used_bytes 4294967296
node_memory_used_bytes 4194304000  (15 secondes plus tard, a baissé)
node_memory_used_bytes 4396972032  (15 secondes plus tard, a monté)
```

**Type 3 : Histogram (histogramme)**

Un histogram mesure la distribution des valeurs dans des intervalles (buckets) prédéfinis. Il sert à mesurer des durées ou des tailles.

Exemples :

- Temps de réponse HTTP (combien de requêtes en moins de 100ms, 250ms, 500ms, 1s ?)
- Taille des requêtes HTTP

```text
# Histogramme avec buckets
http_request_duration_seconds_bucket{le="0.1"} 500    (500 requêtes en moins de 100ms)
http_request_duration_seconds_bucket{le="0.25"} 750   (750 requêtes en moins de 250ms)
http_request_duration_seconds_bucket{le="0.5"} 900    (900 requêtes en moins de 500ms)
http_request_duration_seconds_bucket{le="1.0"} 980    (980 requêtes en moins de 1s)
http_request_duration_seconds_bucket{le="+Inf"} 1000  (1000 requêtes au total)
http_request_duration_seconds_sum 234.5                (somme de toutes les durées)
http_request_duration_seconds_count 1000               (nombre total de mesures)
```

L'histogramme permet de calculer des percentiles (p50, p90, p99) avec la fonction `histogram_quantile()`.

**Type 4 : Summary (résumé)**

Un summary est similaire à un histogram mais calcule les quantiles côté client (dans l'application) au lieu de côté serveur (dans Prometheus).

```text
# Summary avec quantiles précalculés
http_request_duration_seconds{quantile="0.5"} 0.12     (50% des requêtes en moins de 120ms)
http_request_duration_seconds{quantile="0.9"} 0.45     (90% des requêtes en moins de 450ms)
http_request_duration_seconds{quantile="0.99"} 1.2     (99% des requêtes en moins de 1.2s)
http_request_duration_seconds_sum 234.5
http_request_duration_seconds_count 1000
```

**Comparaison des types** :

| Type | Valeur | Usage | Exemple |
| --- | --- | --- | --- |
| Counter | Ne fait qu'augmenter | Compter des événements | Requêtes HTTP, erreurs |
| Gauge | Monte et descend | État actuel | Mémoire utilisée, connexions actives |
| Histogram | Distribution en buckets | Durées, tailles | Temps de réponse |
| Summary | Quantiles précalculés | Durées (côté client) | Temps de réponse (plus simple, moins flexible) |

**Recommandation** : Utilise des counters pour compter, des gauges pour les états, et des histograms pour les durées. Les summaries sont rarement nécessaires.

---

### Le fichier prometheus.yml

**Définition** : Le fichier `prometheus.yml` est le fichier de configuration principal de Prometheus. Il définit les paramètres globaux et la liste des cibles (targets) à scraper.

**Structure du fichier** :

```yaml
# Configuration globale
global:
  # Intervalle entre chaque scrape (par défaut 1 minute)
  scrape_interval: 15s
  # Intervalle d'évaluation des règles d'alerte
  evaluation_interval: 15s

# Liste des cibles à scraper
scrape_configs:
  # Chaque job est un groupe de cibles similaires
  - job_name: "prometheus"
    # Liste des cibles (adresse:port)
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "symfony-app"
    # Chemin de l'endpoint de métriques (défaut : /metrics)
    metrics_path: "/metrics"
    static_configs:
      - targets: ["symfony-app:8080"]
```

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

Crée un dossier pour le projet Prometheus :

```bash
# Crée le dossier de travail
mkdir -p ~/monitoring-cursus/prometheus-intro
```

```bash
# Va dans le dossier
cd ~/monitoring-cursus/prometheus-intro
```

---

### Étape 2 : Créer le fichier de configuration Prometheus

```bash
# Crée le fichier prometheus.yml
cat > ~/monitoring-cursus/prometheus-intro/prometheus.yml << 'EOF'
# Configuration de Prometheus
global:
  # Scrape toutes les 15 secondes
  scrape_interval: 15s
  # Évalue les règles toutes les 15 secondes
  evaluation_interval: 15s

scrape_configs:
  # Job 1 : Prometheus scrape ses propres métriques
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
        labels:
          # Label custom pour identifier l'environnement
          environment: "development"
EOF
```

---

### Étape 3 : Créer le fichier Docker Compose

```bash
# Crée le fichier docker-compose.yml
cat > ~/monitoring-cursus/prometheus-intro/docker-compose.yml << 'EOF'
# Docker Compose pour Prometheus
services:
  prometheus:
    # Image officielle de Prometheus
    image: prom/prometheus:v3.13.0
    ports:
      # Expose Prometheus sur le port 9090
      - "9090:9090"
    volumes:
      # Monte le fichier de configuration
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      # Volume pour persister les données entre les redémarrages
      - prometheus-data:/prometheus
    command:
      # Active les fonctionnalités recommandées
      - "--config.file=/etc/prometheus/prometheus.yml"
      # Rétention des données pendant 15 jours
      - "--storage.tsdb.retention.time=15d"
      # Active l'API d'administration
      - "--web.enable-lifecycle"

volumes:
  prometheus-data:
EOF
```

---

### Étape 4 : Lancer Prometheus

```bash
# Lance Prometheus en arrière-plan
cd ~/monitoring-cursus/prometheus-intro && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 2/2
 ✔ Network prometheus-intro_default  Created
 ✔ Container prometheus-intro-prometheus-1  Started
```

Vérifie que Prometheus est en cours d'exécution :

```bash
# Vérifie le statut du conteneur
docker compose -f ~/monitoring-cursus/prometheus-intro/docker-compose.yml ps
```

**Résultat attendu** :

```text
NAME                                IMAGE                    STATUS         PORTS
prometheus-intro-prometheus-1       prom/prometheus:v3.13.0  Up 10 seconds  0.0.0.0:9090->9090/tcp
```

---

### Étape 5 : Vérifier les targets

Ouvre ton navigateur et va à :

```text
http://localhost:9090/targets
```

Tu verras la liste des cibles que Prometheus scrape. La cible `prometheus` doit être en état `UP`.

Tu peux aussi vérifier via l'API :

```bash
# Liste les targets via l'API
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool | head -30
```

**Résultat attendu** (extrait) :

```json
{
    "status": "success",
    "data": {
        "activeTargets": [
            {
                "labels": {
                    "instance": "localhost:9090",
                    "job": "prometheus",
                    "environment": "development"
                },
                "health": "up",
                "lastScrape": "2026-03-20T14:32:15.123Z"
            }
        ]
    }
}
```

---

### Étape 6 : Explorer les métriques brutes

Chaque target expose ses métriques sur un endpoint HTTP. Consulte les métriques brutes de Prometheus :

```bash
# Affiche les 20 premières lignes des métriques de Prometheus
curl -s http://localhost:9090/metrics | head -20
```

**Résultat attendu** :

```text
# HELP go_gc_duration_seconds A summary of pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 2.5e-05
go_gc_duration_seconds{quantile="0.25"} 3.8e-05
go_gc_duration_seconds{quantile="0.5"} 5.2e-05
# HELP prometheus_http_requests_total Counter of HTTP requests.
# TYPE prometheus_http_requests_total counter
prometheus_http_requests_total{code="200",handler="/metrics"} 5
prometheus_http_requests_total{code="200",handler="/api/v1/targets"} 1
```

Chaque métrique commence par des commentaires `# HELP` (description) et `# TYPE` (type de métrique), suivis des valeurs.

---

### Étape 7 : Écrire des requêtes PromQL

Ouvre l'interface Prometheus (`http://localhost:9090`) et essaie ces requêtes :

**Requête 1 : Voir toutes les cibles actives**

```promql
up
```

**Résultat** : `up{instance="localhost:9090", job="prometheus"} 1`

**Requête 2 : Nombre total de requêtes HTTP Prometheus**

```promql
prometheus_http_requests_total
```

**Résultat** : Plusieurs séries avec différentes combinaisons de labels `code` et `handler`.

**Requête 3 : Filtrer par label**

```promql
prometheus_http_requests_total{code="200"}
```

**Résultat** : Uniquement les requêtes avec le code de réponse 200.

**Requête 4 : Calculer le taux de requêtes par seconde (sur 5 minutes)**

```promql
rate(prometheus_http_requests_total[5m])
```

**Résultat** : Le taux de requêtes par seconde pour chaque combinaison de labels, calculé sur une fenêtre de 5 minutes.

**Requête 5 : Somme de toutes les requêtes par code de réponse**

```promql
sum by (code) (rate(prometheus_http_requests_total[5m]))
```

**Résultat** : Le taux total de requêtes par seconde, groupé par code de réponse.

**Requête 6 : Mémoire utilisée par Prometheus (en Mo)**

```promql
process_resident_memory_bytes / 1024 / 1024
```

**Résultat** : La mémoire utilisée par le processus Prometheus, convertie en mégaoctets.

---

### Étape 8 : Ajouter une deuxième target (Node Exporter)

Pour avoir plus de métriques à explorer, ajoute Node Exporter (métriques système) au Docker Compose.

Modifie le fichier `docker-compose.yml` :

```yaml
# docker-compose.yml mis à jour
services:
  prometheus:
    image: prom/prometheus:v3.13.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.retention.time=15d"
      - "--web.enable-lifecycle"

  # Node Exporter : expose les métriques système (CPU, mémoire, disque)
  node-exporter:
    image: prom/node-exporter:v1.8.1
    ports:
      - "9100:9100"

volumes:
  prometheus-data:
```

Mets à jour le fichier `prometheus.yml` pour ajouter la nouvelle target :

```yaml
# prometheus.yml mis à jour
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Nouvelle target : Node Exporter
  - job_name: "node-exporter"
    static_configs:
      # node-exporter est le nom du service dans Docker Compose
      - targets: ["node-exporter:9100"]
```

Relance les services :

```bash
# Recrée les conteneurs avec la nouvelle configuration
cd ~/monitoring-cursus/prometheus-intro && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 2/2
 ✔ Container prometheus-intro-node-exporter-1  Started
 ✔ Container prometheus-intro-prometheus-1     Started
```

Vérifie que les deux targets sont en état UP :

```promql
up
```

**Résultat attendu** :

```text
up{instance="localhost:9090", job="prometheus"} 1
up{instance="node-exporter:9100", job="node-exporter"} 1
```

---

### Étape 9 : Explorer les métriques système

Avec Node Exporter, tu as accès à des centaines de métriques système. Voici quelques requêtes utiles :

**Utilisation CPU** :

```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

Cette requête calcule le pourcentage d'utilisation CPU (100% moins le temps en idle).

**Mémoire disponible (en Go)** :

```promql
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024
```

**Espace disque utilisé (en pourcentage)** :

```promql
100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100)
```

---

### Étape 10 : Nettoyer

```bash
# Arrête les conteneurs (conserve les volumes)
cd ~/monitoring-cursus/prometheus-intro && docker compose down
```

> **Note** : `docker compose down` sans `-v` conserve les volumes Docker (données Prometheus). Ne l'utilise pas comme nettoyage habituel : le drapeau volumes détruit les données. Réserve-le à un reset volontaire et documenté. Attention : cela supprime définitivement l'historique des métriques stocké dans le volume.

**Résultat attendu** :

```text
[+] Running 3/3
 ✔ Container prometheus-intro-node-exporter-1  Removed
 ✔ Container prometheus-intro-prometheus-1     Removed
 ✔ Network prometheus-intro_default            Removed
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose up -d` | Lance Prometheus en arrière-plan |
| `docker compose down` | Arrête les conteneurs (conserve les volumes) |
| `docker compose down -v` | Arrête et supprime tout (conteneurs + volumes) - données perdues |
| `curl http://localhost:9090/metrics` | Affiche les métriques brutes de Prometheus |
| `curl http://localhost:9090/api/v1/targets` | Liste les targets via l'API |
| `curl http://localhost:9090/api/v1/query?query=up` | Exécute une requête PromQL via l'API |
| `curl -X POST http://localhost:9090/-/reload` | Recharge la configuration sans redémarrage |

---

## Pièges Fréquents

### Piège 1 : Target en état DOWN

⚠️ **Problème** : Une target apparaît en état `DOWN` dans la page `/targets` de Prometheus.

✅ **Solution** : Vérifie les points suivants dans l'ordre :

1. Le service cible est-il démarré ? (`docker compose ps`)
2. Le endpoint `/metrics` est-il accessible depuis le conteneur Prometheus ? (les noms de services Docker Compose servent de noms d'hôtes)
3. Le port est-il correct dans `prometheus.yml` ?

```bash
# Teste l'accès depuis le conteneur Prometheus
docker exec prometheus-intro-prometheus-1 wget -qO- http://node-exporter:9100/metrics | head -5
```

---

### Piège 2 : Utiliser localhost au lieu du nom de service Docker

⚠️ **Problème** : Dans `prometheus.yml`, tu mets `localhost:9100` comme target pour Node Exporter. Prometheus ne peut pas atteindre Node Exporter.

✅ **Solution** : Dans Docker Compose, chaque service est accessible par son nom de service, pas par `localhost`. Utilise le nom du service :

```yaml
# ❌ Mauvais : localhost ne pointe pas vers Node Exporter
- targets: ["localhost:9100"]

# ✅ Bon : utilise le nom du service Docker Compose
- targets: ["node-exporter:9100"]
```

Exception : Prometheus peut se scraper lui-même via `localhost:9090` car il accède à son propre processus.

---

### Piège 3 : Oublier de recharger la configuration

⚠️ **Problème** : Tu modifies `prometheus.yml` mais les nouvelles targets n'apparaissent pas.

✅ **Solution** : Prometheus ne relit pas automatiquement sa configuration. Deux options :

```bash
# Option 1 : Envoie un signal de rechargement via l'API
curl -X POST http://localhost:9090/-/reload
```

```bash
# Option 2 : Redémarre le conteneur
docker compose restart prometheus
```

L'option 1 est préférable car elle ne perd pas les données en mémoire.

---

### Piège 4 : Confondre rate() et valeur brute d'un counter

⚠️ **Problème** : Tu regardes la valeur brute d'un counter (`http_requests_total = 15423`) et tu ne comprends pas ce que ce nombre signifie.

✅ **Solution** : La valeur brute d'un counter est un total cumulé depuis le dernier redémarrage. Ce nombre seul n'est pas utile. Utilise `rate()` pour obtenir le taux par seconde :

```promql
# ❌ Peu utile : valeur cumulée
http_requests_total

# ✅ Utile : taux de requêtes par seconde sur 5 minutes
rate(http_requests_total[5m])
```

---

## Checklist de Validation

- [ ] Prometheus est installé et accessible sur `http://localhost:9090`
- [ ] Je comprends le pull model (Prometheus va chercher les métriques)
- [ ] Je sais configurer une target dans `prometheus.yml`
- [ ] Je connais les quatre types de métriques (counter, gauge, histogram, summary)
- [ ] Je sais écrire des requêtes PromQL basiques (`up`, `rate()`, filtres par labels)
- [ ] Je sais ajouter une target Node Exporter pour les métriques système

---

## Exercice Pratique

**Énoncé** : Déploie Prometheus et Node Exporter avec Docker Compose. Configure Prometheus pour scraper les deux services. Écris des requêtes PromQL pour répondre aux questions suivantes :

1. Combien de targets sont en état UP ?
2. Quel est le taux de requêtes HTTP vers Prometheus par seconde ?
3. Combien de mémoire RAM est disponible sur le système ?
4. Quel est le pourcentage d'utilisation du CPU ?

**Indications** :

- Utilise les fichiers `docker-compose.yml` et `prometheus.yml` créés dans les étapes pratiques
- Utilise l'onglet Graph dans l'interface Prometheus pour visualiser les résultats
- Les métriques Node Exporter commencent par `node_`
- La mémoire est en bytes. Divise par 1024 trois fois pour obtenir des Go.

**Résultat attendu** :

- Les deux targets sont UP
- Tu as les réponses numériques aux quatre questions

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Démarrage** :

```bash
# Crée les fichiers comme dans les étapes pratiques puis lance
cd ~/monitoring-cursus/prometheus-intro && docker compose up -d
```

**Question 1 : Combien de targets sont UP ?**

```promql
count(up == 1)
```

**Résultat** : `2` (Prometheus + Node Exporter).

**Question 2 : Taux de requêtes HTTP par seconde ?**

```promql
sum(rate(prometheus_http_requests_total[5m]))
```

**Résultat** (exemple) : `0.35` (environ 0.35 requêtes par seconde).

**Question 3 : Mémoire RAM disponible (en Go) ?**

```promql
node_memory_MemAvailable_bytes / 1024 / 1024 / 1024
```

**Résultat** (exemple) : `5.2` (5.2 Go de RAM disponible).

**Question 4 : Pourcentage d'utilisation du CPU ?**

```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Résultat** (exemple) : `12.5` (12.5% d'utilisation CPU).

**Nettoyage** :

```bash
# Arrête les conteneurs (conserve les volumes)
cd ~/monitoring-cursus/prometheus-intro && docker compose down
```

> **Note** : Pour tout supprimer y compris les volumes, utilise `docker compose down -v`. Attention : les données Prometheus sont alors définitivement perdues.

---

## Navigation

← Fiche précédente : **[Logs structurés](02-logs-structures.md)**

→ Fiche suivante : **[Prometheus - Métriques applicatives](04-prometheus-metriques.md)**
