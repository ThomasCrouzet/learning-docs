---
tags:
  - Monitoring
  - Avancé
  - Projet
description: "Projet intégrateur : déployer un stack d'observabilité complet (Prometheus, Grafana, Loki, Tempo) pour une application Symfony."
estimated_time: "120 min"
fiche_number: 10
total_fiches: 10
cursus: "Monitoring et Observabilité"
---

# 10 - Projet intégrateur

> **En bref** : Dans ce projet, tu vas déployer un stack d'observabilité complet pour une application Symfony : métriques avec Prometheus, dashboards et alertes avec Grafana, logs avec Loki, traces avec Tempo et monitoring d'infrastructure avec node_exporter et cAdvisor. Lecture estimée : 120 min.

## Prérequis

- Avoir lu toutes les fiches du cursus (01 à 09)
- Maîtriser Docker Compose
- Connaître les bases de Symfony (contrôleurs, services, Doctrine)

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| Prometheus | 3.13.x |
| Grafana | 13.x |
| Loki | 3.1.x |
| Promtail | 3.1.x |
| Grafana Tempo | 3.0.x |
| node_exporter | 1.8.x |
| cAdvisor | 0.49.x |
| PHP | 8.3 |
| Symfony | 7.4 |
| PostgreSQL | 16 |

## Objectif de cette fiche

À la fin de cette fiche, tu auras déployé un stack d'observabilité complet qui combine les trois piliers (métriques, logs, traces) avec le monitoring d'infrastructure. Tu sauras diagnostiquer un incident en corrélant métriques, logs et traces dans Grafana.

---

## Concepts

Cette section rappelle les concepts clés que tu vas mettre en pratique. Lis-la pour te rafraîchir la mémoire avant de passer aux étapes pratiques.

### Architecture du stack complet

**Définition** : Un stack d'observabilité complet est l'ensemble des outils qui permettent de surveiller une application et son infrastructure à tous les niveaux : métriques, logs, traces et ressources système.

**Vue d'ensemble de l'architecture** :

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                           GRAFANA (port 3000)                            │
│                Dashboards · Alertes · Explore · Corrélation              │
└──────┬──────────────┬──────────────┬──────────────┬──────────────────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐
│Prometheus│  │   Loki   │  │  Tempo   │  │  Alertmanager     │
│(métriques)│  │  (logs)  │  │ (traces) │  │ (notifications)   │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └───────────────────┘
     │              │              │
     │         ┌────┴─────┐  ┌────┴──────┐
     │         │ Promtail │  │OTel       │
     │         │ (collecte│  │Collector  │
     │         │  logs)   │  │(collecte  │
     │         └────┬─────┘  │ traces)   │
     │              │        └────┬──────┘
     ▼              ▼             ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION SYMFONY                                   │
│          Métriques (endpoint /metrics) · Logs (Monolog JSON)             │
│          Traces (OpenTelemetry SDK) · PostgreSQL                         │
└──────────────────────────────────────────────────────────────────────────┘
     ▲              ▲
     │              │
┌────┴─────┐  ┌────┴─────┐
│  node_   │  │ cAdvisor │
│ exporter │  │(conteneurs)│
│ (système)│  └──────────┘
└──────────┘
```

**Rôle de chaque composant** :

| Composant | Rôle | Pilier |
| --- | --- | --- |
| Prometheus | Collecte et stocke les métriques (pull model) | Métriques |
| node_exporter | Expose les métriques système (CPU, RAM, disque) | Métriques |
| cAdvisor | Expose les métriques des conteneurs Docker | Métriques |
| Loki | Stocke et permet de requêter les logs | Logs |
| Promtail | Collecte les logs Docker et les envoie à Loki | Logs |
| Tempo | Stocke les traces distribuées | Traces |
| OTel Collector | Reçoit les traces de l'application et les envoie à Tempo | Traces |
| Grafana | Visualise métriques, logs et traces dans des dashboards unifiés | Tous |

---

### Les quatre niveaux de monitoring

Ce projet couvre quatre niveaux de monitoring. Chaque niveau répond à une question différente :

| Niveau | Question | Outils |
| --- | --- | --- |
| Infrastructure | Le serveur fonctionne-t-il correctement ? | node_exporter, cAdvisor |
| Application | L'application répond-elle correctement ? | Prometheus + métriques Symfony |
| Logs | Que s'est-il passé exactement ? | Loki + Promtail |
| Traces | Où le temps est-il passé ? | Tempo + OpenTelemetry |

**Analogie concrète** : Imagine un restaurant. Le monitoring d'infrastructure vérifie que la cuisine a du gaz, de l'eau et de l'électricité. Le monitoring applicatif vérifie que les plats sont servis en moins de 15 minutes. Les logs enregistrent chaque commande et chaque événement en cuisine. Les traces suivent le parcours d'une commande depuis la prise de commande jusqu'à l'assiette servie, en mesurant le temps à chaque étape (préparation, cuisson, dressage, service).

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Crée le dossier de travail avec les sous-dossiers nécessaires
mkdir -p ~/monitoring-cursus/projet-integrateur/config
mkdir -p ~/monitoring-cursus/projet-integrateur/symfony-app
```

---

### Étape 2 : Créer le fichier Docker Compose complet

Ce fichier contient tous les services du stack. C'est le fichier le plus important du projet.

```yaml
# ~/monitoring-cursus/projet-integrateur/docker-compose.yml
services:
  # ──────────────────────────────────────────────
  # APPLICATION
  # ──────────────────────────────────────────────

  # Application Symfony (simulée par un générateur de métriques et logs)
  symfony-app:
    image: php:8.3-cli
    volumes:
      - ./symfony-app:/app
    working_dir: /app
    command: php -S 0.0.0.0:8080 index.php
    ports:
      - "8080:8080"
    labels:
      # Labels utilisés par Promtail pour identifier le service
      app: "symfony"
      environment: "dev"

  # Base de données
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # ──────────────────────────────────────────────
  # MÉTRIQUES
  # ──────────────────────────────────────────────

  # Prometheus : collecte toutes les métriques
  prometheus:
    image: prom/prometheus:v3.13.0
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./config/alert-rules.yml:/etc/prometheus/alert-rules.yml:ro
      - prometheus-data:/prometheus

  # node_exporter : métriques système
  node-exporter:
    image: prom/node-exporter:v1.8.1
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--path.rootfs=/rootfs"

  # cAdvisor : métriques des conteneurs
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1
    ports:
      - "8081:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    privileged: true

  # ──────────────────────────────────────────────
  # LOGS
  # ──────────────────────────────────────────────

  # Loki : stockage des logs
  loki:
    image: grafana/loki:3.1.0
    ports:
      - "3100:3100"
    volumes:
      - ./config/loki-config.yml:/etc/loki/local-config.yaml:ro
      - loki-data:/loki
    command: -config.file=/etc/loki/local-config.yaml

  # Promtail : historique Loki (EOL 2 mars 2026). Pour un lab 2026, préfère Grafana Alloy.
  promtail:
    image: grafana/promtail:3.1.0
    volumes:
      - ./config/promtail-config.yml:/etc/promtail/config.yml:ro
      # ⚠️ Lab uniquement : docker.sock (même :ro) ≈ accès root via l'API Docker
      - /var/run/docker.sock:/var/run/docker.sock:ro
    command: -config.file=/etc/promtail/config.yml
    depends_on:
      - loki

  # ──────────────────────────────────────────────
  # TRACES
  # ──────────────────────────────────────────────

  # Grafana Tempo : stockage des traces
  tempo:
    image: grafana/tempo:3.0.0
    ports:
      - "3200:3200"
      - "4317:4317"
    volumes:
      - ./config/tempo-config.yml:/etc/tempo/config.yml:ro
      - tempo-data:/var/tempo
    command: -config.file=/etc/tempo/config.yml

  # OpenTelemetry Collector
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.104.0
    ports:
      # OTLP/HTTP (4318). Le port 4317 est réservé à OTLP/gRPC
      - "4318:4318"
    volumes:
      - ./config/otel-collector-config.yml:/etc/otelcol/config.yaml:ro
    command: --config=/etc/otelcol/config.yaml
    depends_on:
      - tempo

  # ──────────────────────────────────────────────
  # VISUALISATION
  # ──────────────────────────────────────────────

  # Grafana : dashboards unifiés
  grafana:
    image: grafana/grafana:13.1.3
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
      - ./config/grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml:ro
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus
      - loki
      - tempo

volumes:
  postgres-data:
  prometheus-data:
  loki-data:
  tempo-data:
  grafana-data:
```

---

### Étape 3 : Créer l'application simulée

Cette application PHP simule une application Symfony en exposant un endpoint `/metrics` pour Prometheus et en générant des logs JSON.

```php
<?php
// ~/monitoring-cursus/projet-integrateur/symfony-app/index.php

// Application simulée qui génère des métriques, logs et erreurs

// Compteurs en mémoire (en production, utiliser un client Prometheus PHP)
$requestFile = '/tmp/request_count.txt';
$errorFile = '/tmp/error_count.txt';

// Initialise les compteurs si nécessaire
if (!file_exists($requestFile)) { file_put_contents($requestFile, '0'); }
if (!file_exists($errorFile)) { file_put_contents($errorFile, '0'); }

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Endpoint métriques pour Prometheus
if ($uri === '/metrics') {
    header('Content-Type: text/plain');

    $requests = (int) file_get_contents($requestFile);
    $errors = (int) file_get_contents($errorFile);

    // Métriques au format Prometheus
    echo "# HELP http_requests_total Total des requêtes HTTP reçues\n";
    echo "# TYPE http_requests_total counter\n";
    echo "http_requests_total{method=\"GET\",status=\"200\"} {$requests}\n";
    echo "http_requests_total{method=\"GET\",status=\"500\"} {$errors}\n";
    echo "\n";
    echo "# HELP http_request_duration_seconds Durée des requêtes HTTP\n";
    echo "# TYPE http_request_duration_seconds histogram\n";
    // Simule un histogramme avec des buckets
    $le50 = intval($requests * 0.7);
    $le100 = intval($requests * 0.9);
    $le250 = intval($requests * 0.95);
    $le500 = $requests;
    echo "http_request_duration_seconds_bucket{le=\"0.05\"} {$le50}\n";
    echo "http_request_duration_seconds_bucket{le=\"0.1\"} {$le100}\n";
    echo "http_request_duration_seconds_bucket{le=\"0.25\"} {$le250}\n";
    echo "http_request_duration_seconds_bucket{le=\"0.5\"} {$le500}\n";
    echo "http_request_duration_seconds_bucket{le=\"+Inf\"} {$le500}\n";
    echo "http_request_duration_seconds_sum " . ($requests * 0.08) . "\n";
    echo "http_request_duration_seconds_count {$requests}\n";
    echo "\n";
    echo "# HELP app_active_users Nombre d'utilisateurs actifs\n";
    echo "# TYPE app_active_users gauge\n";
    echo "app_active_users " . random_int(10, 50) . "\n";
    exit;
}

// Incrémente le compteur de requêtes
$requests = (int) file_get_contents($requestFile);
file_put_contents($requestFile, (string) ($requests + 1));

// Simule des erreurs aléatoires (10% des requêtes)
$isError = random_int(1, 10) === 1;

if ($isError) {
    $errors = (int) file_get_contents($errorFile);
    file_put_contents($errorFile, (string) ($errors + 1));

    // Log d'erreur au format JSON (comme Monolog)
    $log = json_encode([
        'message' => 'Internal Server Error',
        'context' => ['uri' => $uri, 'method' => $method],
        'level' => 500,
        'level_name' => 'ERROR',
        'channel' => 'request',
        'datetime' => date('c'),
        'extra' => ['ip' => '127.0.0.1', 'memory_usage' => memory_get_usage()],
    ]);
    error_log($log);

    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Internal Server Error']);
    exit;
}

// Simule un temps de réponse variable (entre 20ms et 200ms)
usleep(random_int(20000, 200000));

// Log de succès au format JSON
$log = json_encode([
    'message' => 'Request handled successfully',
    'context' => ['uri' => $uri, 'method' => $method, 'status' => 200],
    'level' => 200,
    'level_name' => 'INFO',
    'channel' => 'request',
    'datetime' => date('c'),
    'extra' => ['ip' => '127.0.0.1', 'memory_usage' => memory_get_usage()],
]);
error_log($log);

// Réponse normale
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'uri' => $uri,
    'timestamp' => date('c'),
]);
```

---

### Étape 4 : Créer la configuration Prometheus

```yaml
# ~/monitoring-cursus/projet-integrateur/config/prometheus.yml
global:
  scrape_interval: 15s

rule_files:
  - "alert-rules.yml"

scrape_configs:
  # Prometheus lui-même
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Application Symfony
  - job_name: "symfony"
    static_configs:
      - targets: ["symfony-app:8080"]
    metrics_path: /metrics

  # Métriques système
  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  # Métriques conteneurs
  - job_name: "cadvisor"
    static_configs:
      - targets: ["cadvisor:8080"]

  # Métriques Loki
  - job_name: "loki"
    static_configs:
      - targets: ["loki:3100"]

  # Métriques Tempo
  - job_name: "tempo"
    static_configs:
      - targets: ["tempo:3200"]
```

---

### Étape 5 : Créer les règles d'alertes

```yaml
# ~/monitoring-cursus/projet-integrateur/config/alert-rules.yml
groups:
  # Alertes applicatives
  - name: application
    rules:
      # Taux d'erreurs 500 supérieur à 5%
      - alert: HighErrorRate
        expr: >
          rate(http_requests_total{status="500"}[5m])
          / rate(http_requests_total[5m])
          > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Taux d'erreurs HTTP 500 supérieur à 5%"
          description: "Le taux d'erreurs est de {{ $value | printf \"%.1f\" }}%."

      # Latence P95 supérieure à 250ms
      - alert: HighLatency
        expr: >
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 0.25
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latence P95 supérieure à 250ms"
          description: "La latence P95 est de {{ $value | printf \"%.3f\" }}s."

  # Alertes infrastructure
  - name: infrastructure
    rules:
      # CPU supérieur à 80%
      - alert: HighCpuUsage
        expr: >
          100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU utilisé à plus de 80%"

      # Mémoire disponible inférieure à 20%
      - alert: LowMemory
        expr: >
          (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 < 20
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Mémoire disponible inférieure à 20%"

      # Disque rempli à plus de 85%
      - alert: DiskAlmostFull
        expr: >
          (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 85
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Disque rempli à plus de 85%"
```

---

### Étape 6 : Créer la configuration Loki

```yaml
# ~/monitoring-cursus/projet-integrateur/config/loki-config.yml
auth_enabled: false

server:
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
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

---

### Étape 7 : Créer la configuration Promtail

```yaml
# ~/monitoring-cursus/projet-integrateur/config/promtail-config.yml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      # Nom du conteneur
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      # Nom du service Docker Compose
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: 'service'
```

---

### Étape 8 : Créer la configuration Tempo

```yaml
# ~/monitoring-cursus/projet-integrateur/config/tempo-config.yml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "0.0.0.0:4317"
        http:
          endpoint: "0.0.0.0:4318"

storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces
    wal:
      path: /var/tempo/wal

compaction:
  block_retention: 48h
```

---

### Étape 9 : Créer la configuration OpenTelemetry Collector

```yaml
# ~/monitoring-cursus/projet-integrateur/config/otel-collector-config.yml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: "0.0.0.0:4317"
      http:
        endpoint: "0.0.0.0:4318"

processors:
  batch:
    timeout: 5s
    send_batch_size: 1000

exporters:
  otlp/tempo:
    endpoint: "tempo:4317"
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/tempo]
```

---

### Étape 10 : Créer le provisioning Grafana

Le provisioning permet de configurer les datasources Grafana automatiquement au démarrage, sans passer par l'interface.

```yaml
# ~/monitoring-cursus/projet-integrateur/config/grafana-datasources.yml
apiVersion: 1

datasources:
  # Prometheus pour les métriques
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true

  # Loki pour les logs
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
    jsonData:
      derivedFields:
        # Permet de passer d'un log à une trace via le trace_id
        - name: TraceID
          datasourceUid: tempo
          matcherRegex: '"trace_id":"(\w+)"'
          url: '$${__value.raw}'

  # Tempo pour les traces
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    uid: tempo
    editable: true
    jsonData:
      tracesToLogs:
        datasourceUid: loki
        tags: ['service']
      tracesToMetrics:
        datasourceUid: prometheus
        tags: ['service']
```

---

### Étape 11 : Lancer le stack complet

```bash
# Lance tous les services
cd ~/monitoring-cursus/projet-integrateur && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 11/11
 ✔ Network projet-integrateur_default                Created
 ✔ Container projet-integrateur-postgres-1           Started
 ✔ Container projet-integrateur-node-exporter-1      Started
 ✔ Container projet-integrateur-cadvisor-1           Started
 ✔ Container projet-integrateur-loki-1               Started
 ✔ Container projet-integrateur-tempo-1              Started
 ✔ Container projet-integrateur-promtail-1           Started
 ✔ Container projet-integrateur-otel-collector-1     Started
 ✔ Container projet-integrateur-prometheus-1         Started
 ✔ Container projet-integrateur-grafana-1            Started
 ✔ Container projet-integrateur-symfony-app-1        Started
```

Vérifie que tous les services sont en cours d'exécution :

```bash
# Vérifie l'état de tous les conteneurs
cd ~/monitoring-cursus/projet-integrateur && docker compose ps
```

Tous les conteneurs doivent être en état `running`.

---

### Étape 12 : Générer du trafic

Envoie des requêtes vers l'application pour générer des métriques et des logs :

```bash
# Envoie 100 requêtes vers l'application (une par seconde)
for i in $(seq 1 100); do
  curl -s http://localhost:8080/api/products > /dev/null
  sleep 1
done
```

Tu peux lancer cette commande dans un autre terminal et la laisser tourner pendant que tu configures les dashboards.

---

### Étape 13 : Vérifier les datasources Grafana

1. Ouvre Grafana : `http://localhost:3000` (admin/admin)
2. Va dans **Connections** > **Data sources**

Tu dois voir trois datasources déjà configurées grâce au provisioning :

| Datasource | URL |
| --- | --- |
| Prometheus | `http://prometheus:9090` |
| Loki | `http://loki:3100` |
| Tempo | `http://tempo:3200` |

Clique sur chacune et sur **Save & test** pour vérifier la connexion.

---

### Étape 14 : Créer le dashboard "Vue d'ensemble"

Ce dashboard donne une vue globale de l'état de l'application et de l'infrastructure.

**Panel 1 - Taux de requêtes par seconde (Time Series)** :

```promql
sum(rate(http_requests_total[5m]))
```

- Title : `Request Rate (req/s)`

**Panel 2 - Taux d'erreurs (Time Series)** :

```promql
sum(rate(http_requests_total{status="500"}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

- Title : `Error Rate (%)`
- Unit : Percent (0-100)
- Thresholds sur l'axe Y : rouge au-dessus de 5

**Panel 3 - Latence P95 (Time Series)** :

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

- Title : `Latency P95 (s)`
- Unit : seconds

**Panel 4 - Utilisateurs actifs (Stat)** :

```promql
app_active_users
```

- Type : Stat
- Title : `Active Users`

**Panel 5 - CPU système (Gauge)** :

```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

- Type : Gauge
- Unit : Percent (0-100)
- Thresholds : vert < 60, orange < 80, rouge >= 80
- Title : `System CPU`

**Panel 6 - Mémoire système (Gauge)** :

```promql
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

- Type : Gauge
- Unit : Percent (0-100)
- Thresholds : vert < 60, orange < 80, rouge >= 80
- Title : `System Memory`

**Panel 7 - Logs d'erreurs (Logs panel)** :

- Datasource : Loki
- Query :

```text
{service="symfony-app"} |= "ERROR"
```

- Type : Logs
- Title : `Application Errors`

---

### Étape 15 : Créer le dashboard "Conteneurs Docker"

**Panel 1 - CPU par conteneur (Time Series)** :

```promql
rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100
```

- Legend : `{{ name }}`
- Title : `Container CPU (%)`

**Panel 2 - Mémoire par conteneur (Time Series)** :

```promql
container_memory_working_set_bytes{name!=""}
```

- Unit : bytes (SI)
- Legend : `{{ name }}`
- Title : `Container Memory`

**Panel 3 - Réseau par conteneur (Time Series)** :

- Query A (reçu) :

```promql
rate(container_network_receive_bytes_total{name!=""}[5m])
```

- Query B (envoyé) :

```promql
rate(container_network_transmit_bytes_total{name!=""}[5m])
```

- Unit : bytes/sec (SI)
- Title : `Container Network I/O`

---

### Étape 16 : Explorer la corrélation métriques-logs

L'un des principaux bénéfices d'un stack unifié dans Grafana est la possibilité de passer d'une métrique à un log en quelques clics.

1. Dans Grafana, va dans **Explore**
2. Clique sur **Split** pour ouvrir deux panneaux côte à côte
3. Panneau gauche - sélectionne **Prometheus** et tape la requête ci-dessous
4. Panneau droit - sélectionne **Loki** et tape la requête ci-dessous
5. Zoome sur un pic d'erreurs dans le graphique Prometheus. Les logs Loki se synchronisent automatiquement sur la même période.

Requête Prometheus (panneau gauche) :

```promql
sum(rate(http_requests_total{status="500"}[5m]))
```

Requête Loki (panneau droit) :

```text
{service="symfony-app"} |= "ERROR"
```

Ce workflow permet de répondre à la question : "Le taux d'erreurs a augmenté, que disent les logs ?"

---

### Étape 17 : Simuler un incident et le diagnostiquer

Simule une surcharge de l'application pour déclencher les alertes et pratiquer le diagnostic.

**Étape 17a - Générer une charge importante** :

```bash
# Envoie 10 requêtes en parallèle, 500 fois
for i in $(seq 1 500); do
  for j in $(seq 1 10); do
    curl -s http://localhost:8080/api/orders > /dev/null &
  done
  # Attend que les 10 requêtes parallèles se terminent
  wait
  sleep 0.1
done
```

**Étape 17b - Observer les métriques** :

1. Ouvre le dashboard "Vue d'ensemble"
2. Observe le taux de requêtes augmenter
3. Observe le taux d'erreurs augmenter (10% des requêtes génèrent des erreurs 500)
4. Vérifie le CPU système dans le panel Gauge

**Étape 17c - Consulter les alertes** :

1. Ouvre Prometheus : `http://localhost:9090/alerts`
2. Vérifie si l'alerte `HighErrorRate` est en état `pending` ou `firing`

**Étape 17d - Corréler avec les logs** :

1. Dans Grafana Explore, sélectionne Loki
2. Cherche les erreurs pendant la période de surcharge avec la requête ci-dessous
3. Tu verras les logs d'erreurs avec les détails (URI, méthode, message)

Requête LogQL pour les erreurs :

```text
{service="symfony-app"} | json | level_name="ERROR"
```

**Étape 17e - Vérifier l'impact sur l'infrastructure** :

1. Vérifie le CPU et la mémoire du conteneur `symfony-app` avec la requête ci-dessous
2. Compare avec les autres conteneurs pour confirmer que c'est bien l'application qui consomme les ressources

Requête PromQL pour le CPU du conteneur Symfony :

```promql
rate(container_cpu_usage_seconds_total{name=~".*symfony.*"}[1m]) * 100
```

---

### Étape 18 : Nettoyer

```bash
# Arrête les conteneurs (conserve les volumes)
cd ~/monitoring-cursus/projet-integrateur && docker compose down
```

> **Note** : `docker compose down` sans `-v` conserve les volumes Docker (métriques, logs, traces, Grafana). Ne l'utilise pas comme nettoyage habituel : le drapeau volumes détruit les données. Réserve-le à un reset volontaire et documenté. Attention : cela supprime définitivement toutes les données d'observabilité stockées dans les volumes.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose ps` | Vérifie l'état de tous les conteneurs |
| `docker compose logs -f symfony-app` | Suit les logs de l'application |
| `curl http://localhost:8080/metrics` | Affiche les métriques de l'application |
| `curl http://localhost:9090/api/v1/targets` | Vérifie les targets Prometheus |
| `curl http://localhost:9090/api/v1/alerts` | Liste les alertes actives |
| `curl http://localhost:3100/ready` | Vérifie que Loki est prêt |
| `curl http://localhost:3200/ready` | Vérifie que Tempo est prêt |

---

## Pièges Fréquents

### Piège 1 : Un service ne démarre pas

⚠️ **Problème** : Un ou plusieurs conteneurs restent en état `restarting` ou `exited`.

✅ **Solution** : Vérifie les logs du service en erreur :

```bash
# Affiche les logs du service qui ne démarre pas
cd ~/monitoring-cursus/projet-integrateur && docker compose logs <service>
```

Causes fréquentes :

- Port déjà utilisé : un autre projet utilise le même port. Arrête-le ou change le port dans le Docker Compose.
- Fichier de configuration manquant : vérifie que tous les fichiers dans `config/` existent.
- Espace disque insuffisant : `docker system df` montre l'espace utilisé par Docker.

---

### Piège 2 : Prometheus ne collecte pas les métriques de l'application

⚠️ **Problème** : La target `symfony` est en état `DOWN` dans Prometheus.

✅ **Solution** : Vérifie que l'application expose bien les métriques :

```bash
# Vérifie que l'endpoint /metrics répond
curl http://localhost:8080/metrics
```

Si la commande ne retourne rien, vérifie que le conteneur `symfony-app` est en cours d'exécution avec `docker compose ps`.

---

### Piège 3 : Les logs n'apparaissent pas dans Loki

⚠️ **Problème** : Dans Grafana Explore avec la datasource Loki, aucun log n'apparaît.

✅ **Solution** :

1. Vérifie que Promtail est en cours d'exécution : `docker compose logs promtail`
2. Vérifie que Loki est prêt : `curl http://localhost:3100/ready`
3. Essaie une requête qui sélectionne tous les logs : `{service=~".+"}`
4. Si aucun résultat, vérifie que le socket Docker est monté correctement dans Promtail

---

### Piège 4 : Trop de conteneurs, la machine ralentit

⚠️ **Problème** : Le stack complet (11 conteneurs) consomme beaucoup de ressources. La machine devient lente.

✅ **Solution** : Si ta machine a moins de 8 Go de RAM, lance un stack réduit sans cAdvisor et node_exporter :

```bash
# Lance uniquement les services essentiels
cd ~/monitoring-cursus/projet-integrateur && docker compose up -d \
  symfony-app postgres prometheus loki promtail grafana
```

Tu perds le monitoring d'infrastructure mais tu gardes les trois piliers (métriques applicatives, logs, traces).

---

## Checklist de Validation

- [ ] Le Docker Compose contient 11 services et ils sont tous en état `running`
- [ ] Les 6 targets Prometheus sont en état `UP`
- [ ] Les datasources Grafana (Prometheus, Loki, Tempo) sont configurées et fonctionnelles
- [ ] Le dashboard "Vue d'ensemble" affiche 7 panels fonctionnels
- [ ] Le dashboard "Conteneurs Docker" affiche les métriques par conteneur
- [ ] Je sais corréler métriques et logs dans Grafana Explore (Split view)
- [ ] J'ai simulé un incident et identifié le problème via les métriques et les logs
- [ ] Les alertes Prometheus se déclenchent correctement
- [ ] Je comprends le rôle de chaque composant du stack

---

## Exercice Pratique

**Énoncé** : Déploie le stack complet, génère du trafic et réalise les tâches suivantes :

1. Crée un dashboard "Vue d'ensemble" avec au minimum : taux de requêtes, taux d'erreurs, latence P95, CPU système, mémoire système et logs d'erreurs
2. Crée un dashboard "Conteneurs Docker" avec CPU et mémoire par conteneur
3. Simule un incident (charge importante) et documente le diagnostic en répondant à ces questions :
   - Quel est le taux d'erreurs pendant l'incident ?
   - Quels messages d'erreurs apparaissent dans les logs ?
   - Quel conteneur consomme le plus de CPU ?
   - L'alerte `HighErrorRate` s'est-elle déclenchée ?

**Indications** :

- Lance le générateur de trafic dans un terminal séparé
- Utilise Grafana Explore en mode Split pour corréler métriques et logs
- Les métriques mettent ~30 secondes à apparaître (scrape interval de 15s)
- Vérifie les alertes dans Prometheus (`http://localhost:9090/alerts`)

**Résultat attendu** :

- Deux dashboards fonctionnels dans Grafana
- Un diagnostic documenté avec les réponses aux 4 questions
- Au moins une alerte en état `firing`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Dashboard "Vue d'ensemble"** :

Les 7 panels sont décrits en détail dans l'étape 14. Voici un récapitulatif :

| Panel | Type | Datasource | Requête clé |
| --- | --- | --- | --- |
| Request Rate | Time Series | Prometheus | `sum(rate(http_requests_total[5m]))` |
| Error Rate | Time Series | Prometheus | `sum(rate(http_requests_total{status="500"}[5m])) / sum(rate(http_requests_total[5m])) * 100` |
| Latency P95 | Time Series | Prometheus | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
| Active Users | Stat | Prometheus | `app_active_users` |
| System CPU | Gauge | Prometheus | `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| System Memory | Gauge | Prometheus | `(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100` |
| Errors | Logs | Loki | `{service="symfony-app"} \|= "ERROR"` |

**Dashboard "Conteneurs Docker"** :

Les 3 panels sont décrits dans l'étape 15.

**Diagnostic d'incident** :

Réponses attendues après la simulation de charge :

1. **Taux d'erreurs** : Environ 10% (l'application simule 10% d'erreurs). Visible dans le panel Error Rate.
2. **Messages d'erreurs** : `"Internal Server Error"` avec les détails de l'URI et de la méthode. Visibles dans Loki avec la requête `{service="symfony-app"} | json | level_name="ERROR"`.
3. **Conteneur le plus consommateur** : `symfony-app` consomme le plus de CPU pendant la charge. Visible dans le panel Container CPU du dashboard Docker.
4. **Alerte HighErrorRate** : Oui, l'alerte passe en état `firing` après 2 minutes si le taux d'erreurs dépasse 5%. Visible dans Prometheus > Alerts.

---

## Récapitulatif du cursus

Ce projet intégrateur conclut le cursus **Monitoring et Observabilité**. Voici ce que tu as appris au fil des 10 fiches :

| Fiche | Compétence acquise |
| --- | --- |
| 01 - Introduction | Les trois piliers de l'observabilité |
| 02 - Logs structurés | Logs JSON avec Monolog dans Symfony |
| 03 - Prometheus Introduction | Architecture pull model et PromQL |
| 04 - Prometheus Métriques | Instrumenter une application (counters, gauges, histogrammes) |
| 05 - Grafana Dashboards | Créer des dashboards avec des requêtes PromQL |
| 06 - Grafana Alerting | Configurer des alertes et des seuils |
| 07 - Logs avec Loki | Centraliser les logs avec LogQL |
| 08 - Traces distribuées | Instrumenter avec OpenTelemetry et visualiser avec Tempo |
| 09 - Monitoring d'infrastructure | Surveiller le système et les conteneurs |
| 10 - Projet intégrateur | Assembler tous les composants en un stack complet |

Tu es maintenant capable de mettre en place un stack d'observabilité complet pour une application en production.

---

## Navigation

← Fiche précédente : **[Monitoring d'infrastructure](09-monitoring-infrastructure.md)**

Fin du cursus Monitoring et Observabilité.
