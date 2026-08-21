---
tags:
  - Monitoring
  - Avancé
  - Pratique
description: "Logs avec Loki : architecture, Promtail, LogQL, corrélation logs-métriques dans Grafana."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 10
cursus: "Monitoring et Observabilité"
id: "infrastructure.monitoring.logs-loki"
course_id: "infrastructure.monitoring"
content_type: "lesson"
order: 7
---

# 07 - Logs avec Loki

> **En bref** : À la fin de cette fiche, tu sauras déployer Loki et Promtail avec Docker Compose, écrire des requêtes LogQL pour rechercher et agréger des logs, et corréler logs et métriques dans Grafana. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [02 - Logs structurés](02-logs-structures.md)
- Avoir lu la fiche [05 - Grafana - Dashboards](05-grafana-dashboards.md)
- Savoir utiliser Docker Compose

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| Loki | 3.1.x (labo de cette fiche ; la ligne courante Grafana Labs est 3.7.x) |
| Promtail | 3.1.x (EOL le 2 mars 2026 ; successeur : Grafana Alloy) |
| Grafana | 13.1.x (image `grafana/grafana:13.1.3` dans le compose) |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Loki et Promtail, comprendre l'architecture de collecte de logs, écrire des requêtes LogQL et corréler les logs avec les métriques Prometheus dans Grafana.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Loki ?

**Définition** : Loki est un système d'agrégation de logs développé par Grafana Labs. Il est conçu pour être économique et facile à utiliser. Loki n'indexe pas le contenu des logs (contrairement à Elasticsearch) mais indexe uniquement les labels associés à chaque flux de logs.

**Le problème que Loki résout** :

Sans Loki, voici les problèmes rencontrés :

1. **Logs dispersés** : Chaque conteneur Docker écrit ses logs dans son propre flux. Pour chercher un événement, tu dois te connecter à chaque conteneur un par un avec `docker logs`.
2. **Pas de recherche centralisée** : Impossible de chercher "toutes les erreurs 500 des dernières 24 heures" sur l'ensemble de tes services en une seule requête.
3. **Pas de corrélation** : Quand Prometheus montre un pic d'erreurs, tu ne peux pas cliquer pour voir les logs correspondants. Tu dois chercher manuellement dans les fichiers.

**Comment Loki résout ces problèmes** :

| Problème | Solution apportée par Loki |
| --- | --- |
| Logs dispersés | Loki centralise les logs de tous les conteneurs en un seul endroit |
| Pas de recherche centralisée | LogQL permet de chercher dans tous les logs avec une seule requête |
| Pas de corrélation | Grafana affiche Loki et Prometheus côte à côte. Tu passes des métriques aux logs en un clic |

**Analogie concrète** : Sans Loki, les logs de chaque service sont comme des carnets individuels rangés dans des tiroirs différents. Pour trouver une information, tu dois ouvrir chaque tiroir et feuilleter chaque carnet. Avec Loki, c'est comme si tous les carnets étaient numérisés dans un moteur de recherche. Tu tapes ta requête et tu trouves immédiatement l'information, quel que soit le carnet d'origine.

**Ce que Loki n'est PAS** :

- Loki n'est pas un remplacement d'Elasticsearch. Elasticsearch indexe le contenu complet de chaque log, ce qui permet des recherches full-text très rapides mais coûte cher en stockage et en CPU. Loki indexe uniquement les labels, ce qui le rend plus léger mais moins performant pour les recherches full-text complexes.
- Loki n'est pas un outil de métriques. Loki stocke des logs (messages texte). Pour les métriques (valeurs numériques), utilise Prometheus.

**Comparaison Loki vs Elasticsearch** :

| Loki | Elasticsearch |
| --- | --- |
| Indexe les labels uniquement | Indexe tout le contenu |
| Léger en stockage et CPU | Gourmand en ressources |
| Requêtes LogQL (similaire à PromQL) | Requêtes Lucene / KQL |
| Intégré nativement à Grafana | Nécessite Kibana |
| Idéal pour les logs conteneurisés | Idéal pour les recherches full-text |

---

### Qu'est-ce que Promtail ?

**Définition** : Promtail est l'agent de collecte de logs de Loki. Il lit les fichiers de logs ou les flux Docker, ajoute des labels et envoie les logs vers Loki.

**Le problème que Promtail résout** :

Sans Promtail, voici les problèmes rencontrés :

1. **Pas de collecte automatique** : Loki est un serveur de stockage. Il ne va pas chercher les logs lui-même. Quelque chose doit pousser les logs vers Loki.
2. **Labels manquants** : Les logs bruts ne contiennent pas les labels nécessaires pour les filtrer dans Loki (nom du service, environnement, nom du conteneur).
3. **Formats variés** : Chaque application écrit ses logs dans un format différent. Certains sont en JSON, d'autres en texte libre.

**Comment Promtail résout ces problèmes** :

| Problème | Solution apportée par Promtail |
| --- | --- |
| Pas de collecte automatique | Promtail lit les fichiers de logs et les envoie à Loki en continu |
| Labels manquants | Promtail ajoute des labels (nom du conteneur, nom du service, chemin du fichier) |
| Formats variés | Promtail peut parser les logs (regex, JSON, logfmt) pour en extraire des labels |

**Architecture de collecte** :

Le diagramme suivant montre le pipeline de collecte, stockage et consultation des logs avec Loki.

<div class="diagram-design">
<p><a href="../../diagrams/14-monitoring-07-logs-loki-1.html">Qu&#x27;est-ce que Promtail ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/14-monitoring-07-logs-loki-1.html" title="Qu&#x27;est-ce que Promtail ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

```text
┌──────────────┐     ┌──────────────┐     ┌──────────┐     ┌─────────┐
│  Application │────→│  Docker logs │────→│ Promtail │────→│  Loki   │
│  (stdout)    │     │  (fichiers)  │     │ (agent)  │     │(stockage)│
└──────────────┘     └──────────────┘     └──────────┘     └────┬────┘
                                                                │
                                                                ▼
                                                          ┌─────────┐
                                                          │ Grafana │
                                                          │(requêtes)│
                                                          └─────────┘
```

---

### Qu'est-ce que LogQL ?

**Définition** : LogQL est le langage de requête de Loki. Sa syntaxe est inspirée de PromQL (Prometheus). Il permet de filtrer les logs par labels, de chercher du texte dans les messages et d'agréger les résultats.

**Types de requêtes LogQL** :

| Type | Usage | Exemple |
| --- | --- | --- |
| Log query | Affiche les lignes de logs | `{job="symfony"} \|= "error"` |
| Metric query | Calcule des métriques à partir des logs | `rate({job="symfony"} \|= "error" [5m])` |

**Syntaxe des log queries** :

```text
{label="valeur"}                    → Filtre par label
{label="valeur"} |= "texte"        → Contient le texte (case sensitive)
{label="valeur"} != "texte"         → Ne contient pas le texte
{label="valeur"} |~ "regex"         → Correspond à la regex
{label="valeur"} !~ "regex"         → Ne correspond pas à la regex
```

**Syntaxe des metric queries** :

```text
count_over_time({label="valeur"}[5m])   → Nombre de logs sur 5 minutes
rate({label="valeur"}[5m])              → Taux de logs par seconde sur 5 minutes
bytes_over_time({label="valeur"}[5m])   → Volume de logs en octets sur 5 minutes
```

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Crée le dossier de travail
mkdir -p ~/monitoring-cursus/loki-logs
```

---

### Étape 2 : Créer le fichier Docker Compose

```yaml
# ~/monitoring-cursus/loki-logs/docker-compose.yml
services:
  # Loki : stockage et requêtes des logs
  loki:
    image: grafana/loki:3.1.0
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml:ro
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml

  # Promtail : collecte les logs et les envoie à Loki
  # Note 2026 : Grafana a annoncé la fin de vie de Promtail (2 mars 2026).
  # L'agent successeur est Grafana Alloy. Ici Promtail 3.1.0 reste l'exemple
  # de labo du curseur Loki 3.1 ; ne pas le copier en production neuve.
  promtail:
    image: grafana/promtail:3.1.0
    volumes:
      - ./promtail-config.yml:/etc/promtail/config.yml:ro
      # Monte le socket Docker pour lire les logs des conteneurs
      # ⚠️ Sécurité : l'accès au socket Docker (même en :ro) donne un accès
      # quasi root à l'hôte via l'API Docker. Lab local uniquement. En prod,
      # préfère un agent DaemonSet / journald / fichier, sans docker.sock.
      - /var/run/docker.sock:/var/run/docker.sock:ro
    command: -config.file=/etc/promtail/config.yml
    depends_on:
      - loki

  # Grafana : visualisation
  grafana:
    image: grafana/grafana:13.1.3
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - loki

  # Prometheus : métriques (pour la corrélation)
  prometheus:
    image: prom/prometheus:v3.13.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro

  # Application de test qui génère des logs
  log-generator:
    image: mingrammer/flog:latest
    # Génère des logs au format Apache à raison de 5 logs par seconde
    command: -f apache_combined -d 200ms -l

volumes:
  loki-data:
  grafana-data:
```

---

### Étape 3 : Créer la configuration Loki

```yaml
# ~/monitoring-cursus/loki-logs/loki-config.yml
# Configuration de Loki
auth_enabled: false

server:
  # Port d'écoute HTTP
  http_listen_port: 3100

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: "2024-01-01"
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

limits_config:
  # Rejette les logs plus anciens que 168 heures (7 jours)
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  # Durée de rétention effective (obligatoire si retention_enabled: true)
  retention_period: 168h

# Rétention des données
compactor:
  working_directory: /loki/compactor
  retention_enabled: true
  retention_delete_delay: 2h
  delete_request_store: filesystem
```

---

### Étape 4 : Créer la configuration Promtail

```yaml
# ~/monitoring-cursus/loki-logs/promtail-config.yml
# Configuration de Promtail
server:
  http_listen_port: 9080

# Fichier de positions (mémorise où Promtail en est dans chaque fichier)
positions:
  filename: /tmp/positions.yaml

# Client : où envoyer les logs
clients:
  # URL de l'API push de Loki
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # Collecte les logs des conteneurs Docker
  - job_name: docker
    docker_sd_configs:
      # Découverte automatique des conteneurs via le socket Docker
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      # Utilise le nom du conteneur comme label "container"
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      # Utilise le nom du compose service comme label "service"
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: 'service'
```

---

### Étape 5 : Créer la configuration Prometheus

```yaml
# ~/monitoring-cursus/loki-logs/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "loki"
    static_configs:
      - targets: ["loki:3100"]
```

---

### Étape 6 : Lancer la stack

```bash
# Lance tous les services
cd ~/monitoring-cursus/loki-logs && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 6/6
 ✔ Network loki-logs_default              Created
 ✔ Container loki-logs-loki-1             Started
 ✔ Container loki-logs-promtail-1         Started
 ✔ Container loki-logs-grafana-1          Started
 ✔ Container loki-logs-prometheus-1       Started
 ✔ Container loki-logs-log-generator-1    Started
```

Vérifie que Loki est prêt :

```bash
# Vérifie que Loki répond
curl -s http://localhost:3100/ready
```

**Résultat attendu** :

```text
ready
```

---

### Étape 7 : Ajouter Loki comme datasource dans Grafana

1. Connecte-toi à Grafana (`http://localhost:3000`, admin/admin)
2. Va dans **Connections** > **Data sources**
3. Clique sur **Add data source**
4. Sélectionne **Loki**
5. Dans le champ **URL** :

```text
http://loki:3100
```

1. Clique sur **Save & test**

**Résultat attendu** :

```text
✓ Data source successfully connected.
```

Ajoute aussi Prometheus comme datasource (URL : `http://prometheus:9090`).

---

### Étape 8 : Explorer les logs dans Grafana

1. Dans le menu latéral, clique sur **Explore**
2. Sélectionne la datasource **Loki**
3. Tape la requête LogQL :

```text
{service="log-generator"}
```

1. Clique sur **Run query**

Tu verras les logs générés par le conteneur `log-generator` au format Apache.

---

### Étape 9 : Écrire des requêtes LogQL

**Requête 1 - Tous les logs d'un service** :

```text
{service="log-generator"}
```

**Requête 2 - Filtrer les erreurs (codes 5xx)** :

```text
{service="log-generator"} |~ "\" 5[0-9]{2} "
```

Cette regex cherche les lignes contenant un code HTTP commençant par 5 (500, 502, 503...).

**Requête 3 - Exclure les requêtes normales** :

```text
{service="log-generator"} != "\" 200 "
```

Exclut les lignes contenant le code 200.

**Requête 4 - Parser les logs JSON** :

Si tes logs Symfony sont en JSON, tu peux parser les champs :

```text
{service="symfony-app"} | json | level="ERROR"
```

Le pipe `| json` parse chaque ligne JSON et crée des labels à partir des champs. Tu peux ensuite filtrer par champ (`level="ERROR"`).

**Requête 5 - Compter les logs par service (metric query)** :

```text
sum by (service) (count_over_time({service=~".+"}[5m]))
```

**Requête 6 - Taux d'erreurs par seconde** :

```text
sum(rate({service="log-generator"} |~ "\" 5[0-9]{2} " [5m]))
```

---

### Étape 10 : Corréler logs et métriques dans Grafana

La force de Grafana est la corrélation entre les datasources. Tu peux passer d'un graphique Prometheus à des logs Loki.

1. Va dans **Explore**
2. Clique sur **Split** (en haut à droite) pour ouvrir deux panneaux
3. Panneau gauche : sélectionne **Prometheus** et tape :

```promql
rate(prometheus_http_requests_total[5m])
```

1. Panneau droit : sélectionne **Loki** et tape :

```text
{service="prometheus"}
```

Tu vois les métriques et les logs côte à côte. Quand tu zoomes sur une période dans le graphique Prometheus, les logs Loki se synchronisent automatiquement sur la même période.

---

### Étape 11 : Créer un dashboard avec logs et métriques

1. Crée un nouveau dashboard
2. Ajoute un panel Time Series avec une requête Prometheus :

```promql
sum by (service) (count_over_time({service=~".+"}[1m]))
```

Note : cette requête est une metric query LogQL, utilise la datasource Loki.

1. Ajoute un panel Logs (type de panel) avec :

```text
{service="log-generator"} |~ "\" 5[0-9]{2} "
```

Ce panel affiche les lignes de logs en erreur en temps réel.

---

### Étape 12 : Nettoyer

```bash
# Arrête les conteneurs (conserve les volumes)
cd ~/monitoring-cursus/loki-logs && docker compose down
```

> **Note** : `docker compose down` sans `-v` conserve les volumes Docker (données Loki, Grafana). Ne l'utilise pas comme nettoyage habituel : le drapeau volumes détruit les données. Réserve-le à un reset volontaire et documenté. Attention : cela supprime définitivement les logs stockés dans Loki.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `curl http://localhost:3100/ready` | Vérifie que Loki est prêt |
| `curl http://localhost:3100/loki/api/v1/labels` | Liste les labels disponibles |
| `curl -G http://localhost:3100/loki/api/v1/query --data-urlencode 'query={service="app"}'` | Exécute une requête LogQL via l'API |
| `docker compose logs -f log-generator` | Suit les logs du générateur en temps réel |

---

## Pièges Fréquents

### Piège 1 : Promtail ne collecte pas les logs Docker

⚠️ **Problème** : Promtail est lancé mais aucun log n'apparaît dans Loki.

✅ **Solution** : Vérifie que le socket Docker est monté correctement dans Promtail :

```yaml
volumes:
  # Le socket Docker doit être accessible en lecture
  - /var/run/docker.sock:/var/run/docker.sock:ro
```

Sur macOS avec OrbStack ou Docker Desktop, le chemin du socket peut varier. Vérifie avec :

```bash
# Vérifie le chemin du socket Docker
docker context inspect | grep Host
```

---

### Piège 2 : Logs trop volumineux

⚠️ **Problème** : Loki consomme beaucoup de stockage car toutes les applications envoient tous leurs logs (y compris DEBUG).

✅ **Solution** : Filtre les logs dans Promtail avant de les envoyer à Loki. Ajoute un pipeline de filtrage :

```yaml
scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
    pipeline_stages:
      # Supprime les lignes DEBUG
      - drop:
          expression: ".*DEBUG.*"
```

---

### Piège 3 : Requête LogQL sans sélecteur de label

⚠️ **Problème** : Tu tapes une requête LogQL sans sélecteur de label (`|= "error"`). Loki retourne une erreur.

✅ **Solution** : Toute requête LogQL doit commencer par un sélecteur de label entre accolades :

```text
# ❌ Mauvais : pas de sélecteur de label
|= "error"

# ✅ Bon : sélecteur de label obligatoire
{service="symfony-app"} |= "error"

# ✅ Bon : sélectionner tous les services
{service=~".+"} |= "error"
```

---

## Checklist de Validation

- [ ] Loki est installé et répond sur `http://localhost:3100/ready`
- [ ] Promtail collecte les logs des conteneurs Docker
- [ ] Loki est ajouté comme datasource dans Grafana
- [ ] Je sais écrire des log queries LogQL (filtres par label, texte, regex)
- [ ] Je sais écrire des metric queries LogQL (`count_over_time`, `rate`)
- [ ] Je sais corréler logs (Loki) et métriques (Prometheus) dans Grafana Explore
- [ ] Je comprends la différence entre Loki et Elasticsearch

---

## Exercice Pratique

**Énoncé** : Déploie la stack Loki + Promtail + Grafana avec le générateur de logs. Écris les requêtes LogQL suivantes :

1. Affiche tous les logs du service `log-generator`
2. Filtre uniquement les requêtes HTTP en erreur (codes 4xx et 5xx)
3. Compte le nombre de logs par minute pour chaque service
4. Calcule le taux d'erreurs 5xx par seconde sur les 5 dernières minutes
5. Crée un dashboard avec un panel Logs (erreurs) et un panel Time Series (taux de logs par minute)

**Indications** :

- Les codes 4xx correspondent au pattern `" 4[0-9]{2} "`
- Les codes 5xx correspondent au pattern `" 5[0-9]{2} "`
- Utilise `sum by (service) (count_over_time(...))` pour le comptage
- Utilise `rate(...)` pour le taux par seconde

**Résultat attendu** :

- Les 5 requêtes retournent des résultats
- Le dashboard montre les erreurs en temps réel

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Requête 1 - Tous les logs** :

```text
{service="log-generator"}
```

**Requête 2 - Erreurs 4xx et 5xx** :

```text
{service="log-generator"} |~ "\" [45][0-9]{2} "
```

**Requête 3 - Nombre de logs par minute** :

```text
sum by (service) (count_over_time({service=~".+"}[1m]))
```

**Requête 4 - Taux d'erreurs 5xx par seconde** :

```text
sum(rate({service="log-generator"} |~ "\" 5[0-9]{2} " [5m]))
```

**Requête 5 - Dashboard** :

Panel Logs :

- Datasource : Loki
- Query : `{service="log-generator"} |~ "\" [45][0-9]{2} "`
- Visualization : Logs

Panel Time Series :

- Datasource : Loki
- Query : `sum by (service) (count_over_time({service=~".+"}[1m]))`
- Visualization : Time Series
- Unit : `logs/min`

---

## Navigation

← Fiche précédente : **[Grafana - Alerting](06-grafana-alerting.md)**

→ Fiche suivante : **[Traces distribuées](08-traces-distribuees.md)**
