---
tags:
  - Monitoring
  - Intermédiaire
  - Pratique
description: "Grafana - Dashboards : installer Grafana, connecter Prometheus, créer des dashboards et utiliser les variables."
estimated_time: "90 min"
fiche_number: 5
total_fiches: 10
cursus: "Monitoring et Observabilité"
---

# 05 - Grafana - Dashboards

> **En bref** : À la fin de cette fiche, tu sauras installer Grafana avec Docker, connecter Prometheus comme datasource, créer des dashboards avec différents types de panels et utiliser les variables de dashboard. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [03 - Prometheus - Introduction](03-prometheus-introduction.md)
- Avoir lu la fiche [04 - Prometheus - Métriques applicatives](04-prometheus-metriques.md)
- Savoir écrire des requêtes PromQL basiques

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| Grafana | 11.x |
| Prometheus | 3.13.x |
| Docker | 27.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Grafana, le connecter à Prometheus, créer un dashboard avec des panels time series, stat, gauge et table, et utiliser les variables pour rendre les dashboards dynamiques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Grafana ?

**Définition** : Grafana est une plateforme open source de visualisation et d'analyse de données. Elle se connecte à des sources de données (Prometheus, Loki, PostgreSQL, Elasticsearch) et permet de créer des dashboards interactifs avec des graphiques, des jauges et des tableaux.

**Le problème que Grafana résout** :

Sans Grafana, voici les problèmes rencontrés :

1. **Interface Prometheus limitée** : L'interface web de Prometheus ne propose qu'un graphique basique. Impossible de créer des dashboards avec plusieurs graphiques, des jauges colorées ou des tableaux de résumé.
2. **Sources de données multiples** : Si tu utilises Prometheus pour les métriques et Loki pour les logs, tu dois jongler entre deux interfaces. Il n'y a pas de vue unifiée.
3. **Pas de partage** : Les requêtes PromQL tapées dans l'interface Prometheus sont éphémères. Tu ne peux pas sauvegarder un ensemble de graphiques pour les consulter plus tard ou les partager avec ton équipe.

**Comment Grafana résout ces problèmes** :

| Problème | Solution apportée par Grafana |
| --- | --- |
| Interface limitée | Dizaines de types de panels (time series, stat, gauge, table, heatmap, bar chart) |
| Sources multiples | Une seule interface pour toutes les sources de données |
| Pas de partage | Les dashboards sont sauvegardés, versionnés et exportables en JSON |

**Analogie concrète** : Prometheus est une base de données qui stocke les mesures. C'est comme un classeur rempli de chiffres. Grafana est le tableau de bord qui transforme ces chiffres en graphiques lisibles. C'est comme passer des colonnes de chiffres dans un tableur à un rapport visuel avec des courbes et des indicateurs colorés.

**Ce que Grafana n'est PAS** :

- Grafana n'est pas un outil de collecte de données. Grafana ne collecte rien. Il se connecte aux sources de données existantes (Prometheus, Loki) et affiche les données qu'elles contiennent.
- Grafana n'est pas un remplacement de Prometheus. Grafana a besoin de Prometheus (ou d'une autre source) pour fonctionner. Sans source de données, Grafana ne peut rien afficher.

---

### Les types de panels Grafana

**Définition** : Un panel est un composant visuel dans un dashboard. Chaque panel affiche les données d'une requête sous une forme spécifique (graphique, jauge, nombre).

**Types de panels les plus utilisés** :

| Type | Usage | Exemple |
| --- | --- | --- |
| Time series | Évolution dans le temps | Requêtes HTTP par seconde sur les 24 dernières heures |
| Stat | Valeur unique mise en évidence | Taux d'erreurs actuel (2.3%) |
| Gauge | Valeur avec seuils colorés | Utilisation CPU (vert < 70%, orange < 90%, rouge > 90%) |
| Table | Données tabulaires | Liste des endpoints avec leur temps de réponse moyen |
| Bar chart | Comparaison de valeurs | Répartition des codes HTTP (200, 404, 500) |
| Heatmap | Distribution dans le temps | Distribution des temps de réponse par heure |

---

### Les variables de dashboard

**Définition** : Les variables de dashboard sont des paramètres dynamiques qui permettent de filtrer les données affichées sans modifier les requêtes PromQL de chaque panel. Elles apparaissent comme des menus déroulants en haut du dashboard.

**Le problème que les variables résolvent** :

Sans variables, voici les problèmes rencontrés :

1. **Duplication de dashboards** : Tu crées un dashboard par environnement (dev, staging, prod). C'est le même dashboard avec un filtre différent. Si tu modifies un panel, tu dois le modifier dans chaque copie.
2. **Dashboards rigides** : Les requêtes PromQL sont codées en dur. Pour changer le filtre (autre route, autre instance), tu dois modifier chaque panel manuellement.

**Comment les variables résolvent ces problèmes** :

| Problème | Solution apportée par les variables |
| --- | --- |
| Duplication | Un seul dashboard avec une variable `$environment` en menu déroulant |
| Dashboards rigides | Les requêtes utilisent `$variable`. Le menu déroulant change le filtre dynamiquement |

---

## Étapes Pratiques

### Étape 1 : Créer le projet avec Docker Compose

Crée un dossier de travail :

```bash
# Crée le dossier de travail
mkdir -p ~/monitoring-cursus/grafana-dashboards
```

Crée le fichier `docker-compose.yml` avec Prometheus et Grafana :

```yaml
# ~/monitoring-cursus/grafana-dashboards/docker-compose.yml
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

  # Grafana : visualisation des métriques
  grafana:
    image: grafana/grafana:13.1.3
    ports:
      # Expose Grafana sur le port 3000
      - "3000:3000"
    volumes:
      # Persiste les dashboards et la configuration
      - grafana-data:/var/lib/grafana
    environment:
      # Identifiants par défaut (à changer en production)
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      # Désactive la demande de changement de mot de passe
      - GF_USERS_ALLOW_SIGN_UP=false

  # Node Exporter pour avoir des métriques système
  node-exporter:
    image: prom/node-exporter:v1.8.1
    ports:
      - "9100:9100"

volumes:
  prometheus-data:
  grafana-data:
```

Crée le fichier `prometheus.yml` :

```yaml
# ~/monitoring-cursus/grafana-dashboards/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]
```

---

### Étape 2 : Lancer la stack

```bash
# Lance tous les services en arrière-plan
cd ~/monitoring-cursus/grafana-dashboards && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 4/4
 ✔ Network grafana-dashboards_default         Created
 ✔ Container grafana-dashboards-prometheus-1   Started
 ✔ Container grafana-dashboards-grafana-1      Started
 ✔ Container grafana-dashboards-node-exporter-1  Started
```

Vérifie que tous les services fonctionnent :

```bash
# Vérifie les statuts
cd ~/monitoring-cursus/grafana-dashboards && docker compose ps
```

---

### Étape 3 : Se connecter à Grafana

Ouvre ton navigateur et va à :

```text
http://localhost:3000
```

Connecte-toi avec les identifiants suivants :

- **Username** : `admin`
- **Password** : `admin`

Tu arriveras sur la page d'accueil de Grafana.

---

### Étape 4 : Ajouter Prometheus comme datasource

1. Dans le menu latéral gauche, clique sur l'icône engrenage (**Connections**)
2. Clique sur **Data sources**
3. Clique sur **Add data source**
4. Sélectionne **Prometheus**
5. Dans le champ **Prometheus server URL**, tape :

```text
http://prometheus:9090
```

Note : on utilise `prometheus` (le nom du service Docker Compose) et non `localhost`, car Grafana communique avec Prometheus via le réseau Docker.

1. Laisse les autres paramètres par défaut
2. Clique sur **Save & test**

**Résultat attendu** :

```text
✓ Successfully queried the Prometheus API.
```

---

### Étape 5 : Créer un nouveau dashboard

1. Dans le menu latéral, clique sur **Dashboards**
2. Clique sur **New** puis **New Dashboard**
3. Clique sur **Add visualization**
4. Sélectionne la datasource **Prometheus**

Tu es maintenant dans l'éditeur de panel.

---

### Étape 6 : Créer un panel Time Series - Requêtes HTTP

Dans l'éditeur de panel :

1. Dans le champ **Metrics browser**, tape la requête PromQL :

```promql
rate(prometheus_http_requests_total[5m])
```

1. Clique sur **Run queries** (ou Shift+Enter)
2. Un graphique de séries temporelles apparaît

**Configuration du panel** :

- **Panel title** : `Requêtes HTTP Prometheus (par seconde)`
- Dans le panneau de droite, section **Standard options** :
  - **Unit** : `requests/sec (reqps)`
- Section **Legend** :
  - **Mode** : Table
  - **Values** : Last

1. Clique sur **Apply** en haut à droite pour sauvegarder le panel

---

### Étape 7 : Créer un panel Stat - Uptime

1. Clique sur **Add** puis **Visualization** dans le dashboard
2. Sélectionne **Prometheus** comme datasource
3. Tape la requête :

```promql
time() - process_start_time_seconds{job="prometheus"}
```

1. Dans le panneau de droite :
   - **Panel title** : `Uptime Prometheus`
   - **Visualization** : Sélectionne **Stat** (en haut du panneau de droite)
   - **Standard options > Unit** : `duration (s)` - Grafana affichera "2h 15m" au lieu de "8100"
   - **Thresholds** : supprime les seuils par défaut (pas besoin ici)

2. Clique sur **Apply**

---

### Étape 8 : Créer un panel Gauge - Utilisation mémoire

1. Ajoute un nouveau panel
2. Tape la requête :

```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

1. Configuration :
   - **Panel title** : `Utilisation mémoire (%)`
   - **Visualization** : **Gauge**
   - **Standard options > Unit** : `Percent (0-100)`
   - **Standard options > Min** : `0`
   - **Standard options > Max** : `100`
   - **Thresholds** :
     - Vert : 0 (base)
     - Orange : 70
     - Rouge : 90

2. Clique sur **Apply**

La jauge affichera une couleur verte si la mémoire est en dessous de 70%, orange entre 70% et 90%, et rouge au-dessus de 90%.

---

### Étape 9 : Créer un panel Table - Métriques par endpoint

1. Ajoute un nouveau panel
2. Tape la requête :

```promql
sum by (handler) (rate(prometheus_http_requests_total[5m]))
```

1. Configuration :
   - **Panel title** : `Requêtes par endpoint`
   - **Visualization** : **Table**
   - Dans **Transform** (onglet en bas), ajoute la transformation **Organize fields** pour renommer les colonnes si nécessaire

2. Clique sur **Apply**

---

### Étape 10 : Ajouter une variable de dashboard

Les variables rendent les dashboards dynamiques. Ajoute une variable `job` qui permet de filtrer par job Prometheus.

1. Va dans les paramètres du dashboard (icône engrenage en haut à droite)
2. Clique sur **Variables** dans le menu de gauche
3. Clique sur **New variable**
4. Configure la variable :
   - **Name** : `job`
   - **Type** : Query
   - **Data source** : Prometheus
   - **Query** : `label_values(up, job)`
   - **Refresh** : On dashboard load
   - **Multi-value** : Activé (permet de sélectionner plusieurs jobs)
   - **Include All option** : Activé

5. Clique sur **Apply**

Un menu déroulant `job` apparaît en haut du dashboard.

**Utiliser la variable dans les requêtes** :

Modifie la requête d'un panel pour utiliser la variable :

```promql
up{job=~"$job"}
```

Le `=~` est un opérateur regex. La variable `$job` est remplacée par la valeur sélectionnée dans le menu déroulant. Si "All" est sélectionné, `$job` devient `prometheus|node-exporter` (regex OR).

---

### Étape 11 : Sauvegarder le dashboard

1. Clique sur l'icône disquette (ou Ctrl+S) en haut
2. Donne un nom au dashboard : `Monitoring Overview`
3. Clique sur **Save**

Le dashboard est maintenant sauvegardé dans Grafana. Tu peux le retrouver dans **Dashboards** dans le menu latéral.

---

### Étape 12 : Importer un dashboard communautaire

Grafana dispose d'une bibliothèque de dashboards créés par la communauté. Importe le dashboard officiel Node Exporter.

1. Dans le menu latéral, clique sur **Dashboards**
2. Clique sur **New** puis **Import**
3. Dans le champ **Import via grafana.com**, tape l'ID du dashboard :

```text
1860
```

1. Clique sur **Load**
2. Sélectionne la datasource **Prometheus**
3. Clique sur **Import**

Le dashboard **Node Exporter Full** apparaît avec des dizaines de panels préconfigurés : CPU, mémoire, réseau, disque, etc.

---

### Étape 13 : Exporter un dashboard en JSON

Tu peux exporter un dashboard pour le versionner dans Git ou le partager.

1. Ouvre le dashboard que tu veux exporter
2. Clique sur l'icône **Share** (en haut)
3. Clique sur l'onglet **Export**
4. Active **Export for sharing externally**
5. Clique sur **Save to file**

Le fichier JSON téléchargé contient la définition complète du dashboard. Tu peux le réimporter dans n'importe quelle instance Grafana.

**Bonne pratique** : Stocke tes dashboards JSON dans ton dépôt Git. En cas de perte de Grafana, tu peux les réimporter.

---

### Étape 14 : Nettoyer

```bash
# Arrête et supprime les conteneurs (sans supprimer les volumes)
cd ~/monitoring-cursus/grafana-dashboards && docker compose down
```

> **Note** : `docker compose down` sans `-v` conserve les volumes Docker (données Grafana, Prometheus). Pour un environnement pédagogique temporaire dont tu veux tout supprimer, tu peux ajouter `-v` : `docker compose down -v`. Attention : cela supprime définitivement les dashboards et configurations sauvegardés dans Grafana.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose up -d` | Lance Grafana + Prometheus |
| `docker compose down` | Arrête les conteneurs (conserve les volumes) |
| `docker compose down -v` | Arrête et supprime tout, y compris les volumes (données Grafana perdues) |
| `curl http://localhost:3000/api/health` | Vérifie que Grafana est en marche |
| `curl -u admin:admin http://localhost:3000/api/datasources` | Liste les datasources via l'API |

---

## Pièges Fréquents

### Piège 1 : Utiliser localhost comme URL de datasource

⚠️ **Problème** : Tu configures Prometheus comme datasource avec l'URL `http://localhost:9090`. Grafana affiche "Error: Bad Gateway" ou "No data".

✅ **Solution** : Dans Docker Compose, les conteneurs communiquent via le réseau Docker. Utilise le nom du service comme nom d'hôte :

```text
# ❌ Mauvais : localhost pointe vers le conteneur Grafana lui-même
http://localhost:9090

# ✅ Bon : prometheus est le nom du service Docker Compose
http://prometheus:9090
```

---

### Piège 2 : Dashboard vide après import

⚠️ **Problème** : Tu importes un dashboard communautaire mais tous les panels affichent "No data".

✅ **Solution** : Vérifie que :

1. La datasource est correctement sélectionnée pendant l'import
2. Les métriques attendues par le dashboard sont bien exposées (par exemple, le dashboard Node Exporter a besoin de Node Exporter)
3. Le nom de la datasource correspond à celui utilisé dans le dashboard (souvent "Prometheus")

---

### Piège 3 : Données Grafana perdues après un redémarrage

⚠️ **Problème** : Tu redémarres les conteneurs et les dashboards, les datasources et les utilisateurs ont disparu.

✅ **Solution** : Monte un volume Docker pour persister les données de Grafana :

```yaml
grafana:
  image: grafana/grafana:13.1.3
  volumes:
    # Ce volume persiste les données entre les redémarrages
    - grafana-data:/var/lib/grafana
```

Sans ce volume, les données sont stockées dans le conteneur et supprimées à chaque redémarrage.

---

## Checklist de Validation

- [ ] Grafana est installé et accessible sur `http://localhost:3000`
- [ ] Prometheus est ajouté comme datasource dans Grafana
- [ ] J'ai créé un dashboard avec au moins 4 types de panels (Time Series, Stat, Gauge, Table)
- [ ] J'ai ajouté une variable de dashboard et je l'utilise dans les requêtes
- [ ] J'ai importé un dashboard communautaire (Node Exporter Full #1860)
- [ ] J'ai exporté un dashboard en JSON
- [ ] Je comprends la différence entre les types de panels et quand utiliser chacun

---

## Exercice Pratique

**Énoncé** : Crée un dashboard "Application Overview" dans Grafana qui contient les panels suivants :

1. **Time Series** : Taux de requêtes HTTP par seconde (groupé par code de réponse)
2. **Stat** : Nombre total de requêtes dans la dernière heure
3. **Gauge** : Taux d'erreurs 5xx (seuils : vert < 1%, orange < 5%, rouge > 5%)
4. **Stat** : Temps de réponse au 95e percentile
5. **Table** : Top 5 des routes les plus lentes

Ajoute une variable `instance` qui permet de filtrer par instance.

**Indications** :

- Utilise les métriques `prometheus_http_requests_total` (Prometheus se scrape lui-même)
- Pour l'histogramme, utilise `prometheus_http_request_duration_seconds` si disponible
- Les seuils de la gauge utilisent des valeurs entre 0 et 100 (pourcentage)
- La variable `instance` utilise `label_values(up, instance)`

**Résultat attendu** :

- Un dashboard avec 5 panels fonctionnels
- La variable `instance` filtre les données dans tous les panels

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Panel 1 : Time Series - Requêtes par seconde** :

```promql
sum by (code) (rate(prometheus_http_requests_total{instance=~"$instance"}[5m]))
```

Configuration :

- Title : `Requêtes HTTP/s par code de réponse`
- Unit : `reqps`
- Legend : `{{code}}`

**Panel 2 : Stat - Total requêtes dernière heure** :

```promql
sum(increase(prometheus_http_requests_total{instance=~"$instance"}[1h]))
```

Configuration :

- Title : `Requêtes (dernière heure)`
- Unit : `short`
- Color mode : `Background`

**Panel 3 : Gauge - Taux d'erreurs** :

```promql
sum(rate(prometheus_http_requests_total{instance=~"$instance", code=~"5.."}[5m]))
/ sum(rate(prometheus_http_requests_total{instance=~"$instance"}[5m]))
* 100
```

Configuration :

- Title : `Taux d'erreurs 5xx`
- Unit : `Percent (0-100)`
- Min : `0`, Max : `100`
- Thresholds : Vert (base), Orange (1), Rouge (5)

**Panel 4 : Stat - Latence p95** :

```promql
histogram_quantile(0.95, sum by (le) (rate(prometheus_http_request_duration_seconds_bucket{instance=~"$instance"}[5m])))
```

Configuration :

- Title : `Latence P95`
- Unit : `seconds (s)`

**Panel 5 : Table - Routes les plus lentes** :

```promql
topk(5, sum by (handler) (rate(prometheus_http_request_duration_seconds_sum{instance=~"$instance"}[5m]) / rate(prometheus_http_request_duration_seconds_count{instance=~"$instance"}[5m])))
```

Configuration :

- Title : `Top 5 routes les plus lentes`
- Visualization : Table

**Variable** :

- Name : `instance`
- Query : `label_values(up, instance)`
- Multi-value : activé
- Include All : activé

---

## Navigation

← Fiche précédente : **[Prometheus - Métriques applicatives](04-prometheus-metriques.md)**

→ Fiche suivante : **[Grafana - Alerting](06-grafana-alerting.md)**
