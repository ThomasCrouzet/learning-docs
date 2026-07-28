---
tags:
  - Référence
  - Monitoring
description: "Aide-mémoire Monitoring : PromQL, LogQL, Grafana et configuration Prometheus"
estimated_time: "20 min"
fiche_number: 16
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire Monitoring

> **En bref** : Aide-mémoire Monitoring. Lecture estimée : 20 min.

Fiche de référence rapide pour le monitoring : requêtes PromQL, configuration Prometheus, dashboards Grafana et requêtes LogQL (Loki).

---

## Requêtes PromQL (Prometheus)

### Basiques

| Requête | Description |
| ------- | ----------- |
| `up` | Cibles accessibles (1 = up, 0 = down) |
| `rate(counter[5m])` | Taux par seconde sur 5 minutes |
| `increase(counter[1h])` | Augmentation totale sur 1 heure |
| `time() - process_start_time_seconds` | Uptime en secondes |

### Agrégations

| Requête | Description |
| ------- | ----------- |
| `sum(metric)` | Somme de toutes les séries |
| `avg(metric)` | Moyenne |
| `max(metric)` / `min(metric)` | Maximum / minimum |
| `count(metric > 0)` | Nombre de séries correspondantes |
| `topk(5, metric)` | Top 5 valeurs |
| `sum by (label) (metric)` | Somme groupée par label |

### Application

```text
# Requêtes par seconde
rate(http_requests_total[5m])

# Taux d'erreurs 5xx
rate(http_requests_total{status=~"5.."}[5m])

# Latence P95 (classique : toujours agréger avec sum by (le) avant histogram_quantile)
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# Latence P99
histogram_quantile(0.99, sum by (le) (rate(app_http_request_duration_seconds_bucket[5m])))

# Temps de réponse moyen
rate(duration_sum[5m]) / rate(duration_count[5m])
```

### Infrastructure

```text
# CPU %
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Mémoire %
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disque %
100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100)

# Charge système
node_load1, node_load5, node_load15
```

### Conteneurs (cAdvisor)

```text
# CPU conteneur %
rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100

# Mémoire conteneur
container_memory_working_set_bytes{name!=""}

# Top 5 conteneurs par mémoire
topk(5, container_memory_working_set_bytes{name!=""})
```

---

## Configuration Prometheus

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "symfony-app"
    metrics_path: "/metrics"
    static_configs:
      - targets: ["symfony-app:8080"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "cadvisor"
    static_configs:
      - targets: ["cadvisor:8080"]

rule_files:
  - "alert-rules.yml"
```

---

## Commandes Prometheus API

| Commande | Action |
| -------- | ------ |
| `curl localhost:9090/api/v1/targets` | Lister les cibles |
| `curl localhost:9090/api/v1/query?query=up` | Exécuter une requête |
| `curl -X POST localhost:9090/-/reload` | Recharger la configuration |
| `curl localhost:9090/ready` | Vérifier la santé |

---

## Grafana - Types de panels

| Type | Usage |
| ---- | ----- |
| Time Series | Métriques dans le temps (graphes) |
| Stat | Valeur unique avec code couleur |
| Gauge | Jauge circulaire avec seuils |
| Table | Données tabulaires |
| Bar Chart | Comparaison de valeurs |
| Heatmap | Distribution dans le temps |
| Logs | Lignes de log en temps réel |

### Datasources

| Service | URL (Docker Compose) |
| ------- | -------------------- |
| Prometheus | `http://prometheus:9090` |
| Loki | `http://loki:3100` |
| Tempo | `http://tempo:3200` |

### Variables de dashboard

```text
label_values(up, job)           # Liste des jobs
label_values(up, instance)      # Liste des instances
```

---

## Requêtes LogQL (Loki)

### Sélection de logs

```text
{service="symfony-app"}                    # Par label
{service=~".+"}                            # Tous les services (regex)
```

### Filtres

| Opérateur | Description | Exemple |
| --------- | ----------- | ------- |
| `\|= "texte"` | Contient | `{service="app"} \|= "error"` |
| `!= "texte"` | Ne contient pas | `{service="app"} != "debug"` |
| `\|~ "regex"` | Correspond au regex | `{service="app"} \|~ "5[0-9]{2}"` |
| `!~ "regex"` | Ne correspond pas | `{service="app"} !~ "200"` |

### Parsing JSON

```text
{service="app"} | json | level="ERROR"
```

### Métriques depuis les logs

```text
# Nombre de logs en 5 min
count_over_time({service="app"}[5m])

# Logs par seconde
rate({service="app"}[5m])

# Volume en octets
bytes_over_time({service="app"}[5m])

# Comptage par service
sum by (service) (count_over_time({service=~".+"}[5m]))
```

---

## Niveaux de log

| Niveau | Quand l'utiliser |
| ------ | ---------------- |
| `ERROR` | Impact utilisateur, action requise |
| `WARNING` | Anormal mais fonctionnel |
| `INFO` | Événement normal attendu |
| `DEBUG` | Détail technique (développement) |

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| `localhost` comme URL de datasource en Docker | Utiliser le nom du service : `http://prometheus:9090` |
| Utiliser la valeur brute d'un counter | Toujours utiliser `rate(counter[5m])` |
| Trop de labels = explosion des séries | Labels à faible cardinalité (method, status, route) |
| Alertes sans durée `for` | Toujours `For: 2-5m` minimum |
| Requête LogQL sans sélecteur de label | Toujours commencer par `{label="value"}` |
| Données Grafana perdues au redémarrage | Monter un volume : `grafana-data:/var/lib/grafana` |
| Logger des données sensibles | Jamais de mots de passe, clés API, numéros de carte |
| `node_exporter` sur macOS ne montre rien | Normal : collecte les métriques VM, pas macOS |

---

## Liens utiles

- [01 - Introduction observabilité](../14-monitoring/01-introduction-observabilite.md)
- [03 - Prometheus introduction](../14-monitoring/03-prometheus-introduction.md)
- [04 - Métriques applicatives](../14-monitoring/04-prometheus-metriques.md)
- [05 - Grafana dashboards](../14-monitoring/05-grafana-dashboards.md)
- [07 - Logs avec Loki](../14-monitoring/07-logs-loki.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire Redis](15-aide-memoire-redis.md)**

→ Fiche suivante : **[Aide-mémoire Architecture](17-aide-memoire-architecture.md)**
