---
tags:
  - Monitoring
  - Avancé
  - Pratique
description: "Monitoring d'infrastructure : node_exporter pour les métriques système, cAdvisor pour Docker et kube-state-metrics pour Kubernetes."
estimated_time: "75 min"
fiche_number: 9
total_fiches: 10
cursus: "Monitoring et Observabilité"
---

# 09 - Monitoring d'infrastructure

> **En bref** : À la fin de cette fiche, tu sauras collecter les métriques système (CPU, mémoire, disque, réseau) avec node_exporter, surveiller les conteneurs Docker avec cAdvisor et comprendre le monitoring Kubernetes avec kube-state-metrics. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [08 - Traces distribuées](08-traces-distribuees.md)
- Avoir lu la fiche [03 - Prometheus - Introduction](03-prometheus-introduction.md) (architecture et PromQL)
- Avoir lu la fiche [05 - Grafana - Dashboards](05-grafana-dashboards.md)
- Savoir utiliser Docker Compose

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| node_exporter | 1.8.x |
| cAdvisor | 0.49.x |
| Prometheus | 2.53.x |
| Grafana | 11.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer node_exporter et cAdvisor avec Docker Compose, visualiser les métriques système et conteneur dans Grafana, écrire des requêtes PromQL pour surveiller l'infrastructure et comprendre les principes du monitoring Kubernetes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le monitoring d'infrastructure ?

**Définition** : Le monitoring d'infrastructure est la surveillance des ressources matérielles et logicielles qui font fonctionner tes applications : le processeur (CPU), la mémoire (RAM), le disque, le réseau et les conteneurs.

**Le problème que le monitoring d'infrastructure résout** :

Sans monitoring d'infrastructure, voici les problèmes rencontrés :

1. **Pannes silencieuses** : Le disque se remplit progressivement pendant des semaines. Un jour, l'application s'arrête car il n'y a plus d'espace. Personne n'a vu le problème arriver.
2. **Diagnostic incomplet** : Prometheus montre que ton application Symfony est lente, mais tu ne sais pas si c'est à cause du code, de la base de données, ou parce que le serveur manque de mémoire.
3. **Conteneurs incontrôlés** : Tu as 10 conteneurs Docker. L'un d'eux consomme 90% du CPU du serveur, mais tu ne sais pas lequel.

**Comment le monitoring d'infrastructure résout ces problèmes** :

| Problème | Solution apportée par le monitoring d'infrastructure |
| --- | --- |
| Pannes silencieuses | Une alerte se déclenche quand le disque dépasse 80% de remplissage |
| Diagnostic incomplet | Les métriques système montrent si le problème vient du serveur ou de l'application |
| Conteneurs incontrôlés | cAdvisor montre la consommation CPU et mémoire de chaque conteneur individuellement |

**Analogie concrète** : Le monitoring applicatif (fiches précédentes) est comme surveiller la santé d'un conducteur : est-il fatigué, fait-il des erreurs ? Le monitoring d'infrastructure est comme surveiller la voiture elle-même : niveau d'huile, pression des pneus, température du moteur. Un bon conducteur dans une voiture en panne ne peut pas avancer. Il faut surveiller les deux.

**Ce que le monitoring d'infrastructure n'est PAS** :

- Le monitoring d'infrastructure n'est pas du monitoring applicatif. node_exporter ne sait pas si ton application Symfony retourne des erreurs 500. Il sait seulement si le serveur a assez de mémoire et de CPU.
- Le monitoring d'infrastructure ne remplace pas les logs. Il ne te dit pas _pourquoi_ le CPU est à 100%, seulement _qu'il est_ à 100%. Pour comprendre la cause, tu combines les métriques d'infrastructure avec les logs (Loki) et les traces (Tempo).

---

### Qu'est-ce que node_exporter ?

**Définition** : node_exporter est un programme développé par le projet Prometheus. Il expose les métriques du système d'exploitation (CPU, mémoire, disque, réseau) au format Prometheus, afin que Prometheus puisse les collecter.

**Le problème que node_exporter résout** :

Sans node_exporter, voici les problèmes rencontrés :

1. **Pas de métriques système dans Prometheus** : Prometheus ne connaît rien de ton serveur. Il ne sait ni combien de mémoire est utilisée, ni quel est le taux d'utilisation du CPU.
2. **Outils manuels** : Tu dois te connecter en SSH et taper `top`, `df -h` ou `free -m` pour vérifier l'état du serveur. Impossible de voir l'historique ou de configurer des alertes.

**Comment node_exporter résout ces problèmes** :

| Problème | Solution apportée par node_exporter |
| --- | --- |
| Pas de métriques système | node_exporter expose des centaines de métriques système sur un endpoint HTTP |
| Outils manuels | Prometheus collecte ces métriques automatiquement. Grafana les affiche. Des alertes se déclenchent |

**Métriques principales exposées par node_exporter** :

| Métrique | Description | Type |
| --- | --- | --- |
| `node_cpu_seconds_total` | Temps CPU par mode (idle, user, system) | Counter |
| `node_memory_MemTotal_bytes` | Mémoire totale en octets | Gauge |
| `node_memory_MemAvailable_bytes` | Mémoire disponible en octets | Gauge |
| `node_filesystem_avail_bytes` | Espace disque disponible en octets | Gauge |
| `node_filesystem_size_bytes` | Taille totale du disque en octets | Gauge |
| `node_network_receive_bytes_total` | Octets reçus sur le réseau | Counter |
| `node_network_transmit_bytes_total` | Octets envoyés sur le réseau | Counter |
| `node_load1` | Charge système moyenne sur 1 minute | Gauge |
| `node_load5` | Charge système moyenne sur 5 minutes | Gauge |
| `node_load15` | Charge système moyenne sur 15 minutes | Gauge |

---

### Qu'est-ce que cAdvisor ?

**Définition** : cAdvisor (Container Advisor) est un outil développé par Google qui collecte les métriques de ressources des conteneurs en cours d'exécution. Il expose ces métriques au format Prometheus.

**Le problème que cAdvisor résout** :

Sans cAdvisor, voici les problèmes rencontrés :

1. **Métriques agrégées uniquement** : node_exporter montre le CPU total du serveur, mais pas la consommation de chaque conteneur Docker individuellement.
2. **`docker stats` limité** : La commande `docker stats` affiche les ressources en temps réel, mais sans historique, sans alertes et sans graphiques.

**Comment cAdvisor résout ces problèmes** :

| Problème | Solution apportée par cAdvisor |
| --- | --- |
| Métriques agrégées | cAdvisor expose les métriques CPU, mémoire, réseau et disque de chaque conteneur séparément |
| `docker stats` limité | Prometheus collecte les métriques cAdvisor. Tu obtiens l'historique, les graphiques et les alertes |

**Métriques principales exposées par cAdvisor** :

| Métrique | Description | Type |
| --- | --- | --- |
| `container_cpu_usage_seconds_total` | Temps CPU utilisé par le conteneur | Counter |
| `container_memory_usage_bytes` | Mémoire utilisée par le conteneur | Gauge |
| `container_memory_working_set_bytes` | Mémoire réellement utilisée (hors cache) | Gauge |
| `container_network_receive_bytes_total` | Octets reçus par le conteneur | Counter |
| `container_network_transmit_bytes_total` | Octets envoyés par le conteneur | Counter |
| `container_fs_usage_bytes` | Espace disque utilisé par le conteneur | Gauge |

**Comparaison node_exporter vs cAdvisor** :

| node_exporter | cAdvisor |
| --- | --- |
| Métriques du système hôte (serveur) | Métriques des conteneurs individuels |
| CPU total, mémoire totale, disque total | CPU par conteneur, mémoire par conteneur |
| Ne connaît pas Docker | Conçu spécifiquement pour les conteneurs |
| Surveille le "matériel" | Surveille les "locataires" du matériel |

---

### Monitoring Kubernetes avec kube-state-metrics

**Définition** : kube-state-metrics est un service qui écoute l'API Kubernetes et génère des métriques sur l'état des objets Kubernetes (pods, deployments, nodes, services). Ces métriques sont exposées au format Prometheus.

**Le problème que kube-state-metrics résout** :

Sans kube-state-metrics, voici les problèmes rencontrés :

1. **Pas de visibilité sur l'état du cluster** : Tu ne sais pas combien de pods sont en état `Running`, combien sont en `CrashLoopBackOff`, combien de replicas sont attendus vs disponibles.
2. **Kubectl en boucle** : Tu tapes `kubectl get pods` toutes les 5 minutes pour vérifier l'état du cluster. Aucune alerte, aucun historique.

**Comment kube-state-metrics résout ces problèmes** :

| Problème | Solution apportée par kube-state-metrics |
| --- | --- |
| Pas de visibilité | kube-state-metrics expose l'état de chaque objet Kubernetes comme métrique Prometheus |
| Kubectl en boucle | Prometheus collecte ces métriques. Tu crées des alertes sur les pods en erreur, les deployments incomplets |

**Métriques principales** :

| Métrique | Description |
| --- | --- |
| `kube_pod_status_phase` | Phase du pod (Pending, Running, Failed) |
| `kube_pod_container_status_restarts_total` | Nombre de redémarrages d'un conteneur |
| `kube_deployment_spec_replicas` | Nombre de replicas souhaités |
| `kube_deployment_status_replicas_available` | Nombre de replicas disponibles |
| `kube_node_status_condition` | État du node (Ready, DiskPressure, MemoryPressure) |

**Note** : Les étapes pratiques de cette fiche se concentrent sur node_exporter et cAdvisor avec Docker Compose. Kubernetes nécessite un cluster (voir le cursus DevOps). Les métriques kube-state-metrics sont présentées ici pour compléter ta compréhension théorique.

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Crée le dossier de travail
mkdir -p ~/monitoring-cursus/infra-monitoring
```

---

### Étape 2 : Créer le fichier Docker Compose

```yaml
# ~/monitoring-cursus/infra-monitoring/docker-compose.yml
services:
  # node_exporter : métriques système
  node-exporter:
    image: prom/node-exporter:v1.8.1
    ports:
      - "9100:9100"
    volumes:
      # Monte les systèmes de fichiers en lecture seule
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      # Indique à node_exporter où trouver les fichiers système
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--path.rootfs=/rootfs"
      # Désactive les collecteurs inutiles dans un environnement Docker
      - "--collector.disable-defaults"
      # Active uniquement les collecteurs pertinents
      - "--collector.cpu"
      - "--collector.meminfo"
      - "--collector.filesystem"
      - "--collector.netdev"
      - "--collector.loadavg"
      - "--collector.diskstats"

  # cAdvisor : métriques des conteneurs Docker
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1
    ports:
      - "8080:8080"
    volumes:
      # Accès au socket Docker et aux systèmes de fichiers
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    privileged: true

  # Prometheus : collecte les métriques de node_exporter et cAdvisor
  prometheus:
    image: prom/prometheus:v2.53.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alert-rules.yml:/etc/prometheus/alert-rules.yml:ro
      - prometheus-data:/prometheus
    depends_on:
      - node-exporter
      - cadvisor

  # Grafana : dashboards
  grafana:
    image: grafana/grafana:11.1.0
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus

  # Application de test : génère de la charge
  # polinux/stress est multi-architecture (AMD64 et ARM64), contrairement à d'anciennes images
  stress-test:
    image: polinux/stress
    # Génère de la charge CPU (1 worker) et mémoire (128 Mo) pendant 300 secondes
    command: --cpu 1 --vm 1 --vm-bytes 128M --timeout 300s

volumes:
  prometheus-data:
  grafana-data:
```

**Note sur macOS (OrbStack / Docker Desktop)** : Sur macOS, node_exporter et cAdvisor collectent les métriques de la VM Linux qui exécute Docker, pas de macOS directement. Les métriques sont valides mais représentent la VM, pas le Mac hôte.

---

### Étape 3 : Créer la configuration Prometheus

```yaml
# ~/monitoring-cursus/infra-monitoring/prometheus.yml
global:
  # Collecte les métriques toutes les 15 secondes
  scrape_interval: 15s

# Fichiers de règles d'alertes
rule_files:
  - "alert-rules.yml"

scrape_configs:
  # Métriques de Prometheus lui-même
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # Métriques système via node_exporter
  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  # Métriques des conteneurs via cAdvisor
  - job_name: "cadvisor"
    static_configs:
      - targets: ["cadvisor:8080"]
```

---

### Étape 4 : Créer les règles d'alertes

```yaml
# ~/monitoring-cursus/infra-monitoring/alert-rules.yml
groups:
  - name: infrastructure
    rules:
      # Alerte si le CPU est utilisé à plus de 80% pendant 5 minutes
      - alert: HighCpuUsage
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU utilisé à plus de 80%"
          description: "Le CPU est à {{ $value | printf \"%.1f\" }}% d'utilisation depuis 5 minutes."

      # Alerte si la mémoire disponible est inférieure à 20%
      - alert: LowMemory
        expr: (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 < 20
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Mémoire disponible inférieure à 20%"
          description: "Il reste {{ $value | printf \"%.1f\" }}% de mémoire disponible."

      # Alerte si le disque est rempli à plus de 85%
      - alert: DiskAlmostFull
        expr: (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 85
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Disque rempli à plus de 85%"
          description: "Le disque est rempli à {{ $value | printf \"%.1f\" }}%."

      # Alerte si un conteneur utilise plus de 512 Mo de mémoire
      - alert: ContainerHighMemory
        expr: container_memory_working_set_bytes{name!=""} > 536870912
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Conteneur {{ $labels.name }} utilise plus de 512 Mo"
          description: "Le conteneur utilise {{ $value | humanize }} de mémoire."
```

---

### Étape 5 : Lancer la stack

```bash
# Lance tous les services
cd ~/monitoring-cursus/infra-monitoring && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 6/6
 ✔ Network infra-monitoring_default           Created
 ✔ Container infra-monitoring-node-exporter-1 Started
 ✔ Container infra-monitoring-cadvisor-1      Started
 ✔ Container infra-monitoring-prometheus-1    Started
 ✔ Container infra-monitoring-grafana-1       Started
 ✔ Container infra-monitoring-stress-test-1   Started
```

Vérifie que les exporteurs répondent :

```bash
# Vérifie node_exporter
curl -s http://localhost:9100/metrics | head -5
```

**Résultat attendu** :

```text
# HELP node_cpu_seconds_total Seconds the CPUs spent in each mode.
# TYPE node_cpu_seconds_total counter
node_cpu_seconds_total{cpu="0",mode="idle"} 12345.67
node_cpu_seconds_total{cpu="0",mode="system"} 234.56
node_cpu_seconds_total{cpu="0",mode="user"} 567.89
```

```bash
# Vérifie cAdvisor
curl -s http://localhost:8080/metrics | head -5
```

**Résultat attendu** :

```text
# HELP cadvisor_version_info A metric with a constant '1' value labeled by...
# TYPE cadvisor_version_info gauge
cadvisor_version_info{...} 1
# HELP container_cpu_usage_seconds_total Cumulative cpu time consumed
# TYPE container_cpu_usage_seconds_total counter
```

---

### Étape 6 : Vérifier les targets dans Prometheus

1. Ouvre Prometheus dans le navigateur : `http://localhost:9090`
2. Va dans **Status** > **Targets**

Tu dois voir trois targets avec l'état `UP` :

| Job | Endpoint | État |
| --- | --- | --- |
| `prometheus` | `localhost:9090` | UP |
| `node` | `node-exporter:9100` | UP |
| `cadvisor` | `cadvisor:8080` | UP |

Si une target est `DOWN`, vérifie les logs du service concerné avec `docker compose logs <service>`.

---

### Étape 7 : Explorer les métriques système dans Prometheus

Ouvre Prometheus (`http://localhost:9090`) et teste les requêtes PromQL suivantes.

**Requête 1 - Utilisation CPU en pourcentage** :

```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

Cette requête calcule le pourcentage de CPU utilisé. Elle prend le taux de temps CPU inactif (`idle`) sur 5 minutes et le soustrait de 100.

**Requête 2 - Mémoire utilisée en pourcentage** :

```promql
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

**Requête 3 - Espace disque utilisé en pourcentage** :

```promql
(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100
```

**Requête 4 - Débit réseau entrant en octets par seconde** :

```promql
rate(node_network_receive_bytes_total[5m])
```

**Requête 5 - Charge système** :

```promql
node_load5
```

Cette métrique montre la charge moyenne sur 5 minutes. Une valeur supérieure au nombre de CPU disponibles indique une surcharge.

---

### Étape 8 : Explorer les métriques Docker dans Prometheus

**Requête 6 - CPU par conteneur (en pourcentage)** :

```promql
rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100
```

Le filtre `name!=""` exclut les métriques globales (sans nom de conteneur).

**Requête 7 - Mémoire par conteneur** :

```promql
container_memory_working_set_bytes{name!=""}
```

`working_set_bytes` est la mémoire réellement utilisée par le conteneur, hors cache du système de fichiers. C'est cette valeur qui déclenche un OOM kill (arrêt forcé pour manque de mémoire) quand elle dépasse la limite configurée.

**Requête 8 - Top 5 des conteneurs par mémoire** :

```promql
topk(5, container_memory_working_set_bytes{name!=""})
```

**Requête 9 - Débit réseau par conteneur** :

```promql
rate(container_network_receive_bytes_total{name!=""}[5m])
```

---

### Étape 9 : Configurer Grafana

1. Connecte-toi à Grafana (`http://localhost:3000`, admin/admin)
2. Va dans **Connections** > **Data sources**
3. Ajoute **Prometheus** comme datasource :
   - **URL** : `http://prometheus:9090`
4. Clique sur **Save & test**

**Résultat attendu** :

```text
✓ Successfully queried the Prometheus API.
```

---

### Étape 10 : Créer un dashboard système

Crée un nouveau dashboard avec les panels suivants.

**Panel 1 - Utilisation CPU (Gauge)** :

- Type de visualisation : **Gauge**
- Query :

```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

- Unit : `Percent (0-100)`
- Thresholds : vert < 60, orange < 80, rouge >= 80
- Title : `CPU Usage`

**Panel 2 - Mémoire utilisée (Gauge)** :

- Type de visualisation : **Gauge**
- Query :

```promql
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100
```

- Unit : `Percent (0-100)`
- Thresholds : vert < 60, orange < 80, rouge >= 80
- Title : `Memory Usage`

**Panel 3 - Espace disque (Gauge)** :

- Type de visualisation : **Gauge**
- Query :

```promql
(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100
```

- Unit : `Percent (0-100)`
- Thresholds : vert < 70, orange < 85, rouge >= 85
- Title : `Disk Usage`

**Panel 4 - CPU dans le temps (Time Series)** :

- Type de visualisation : **Time Series**
- Query :

```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

- Title : `CPU Usage Over Time`

**Panel 5 - Charge système (Time Series)** :

- Type de visualisation : **Time Series**
- Query A : `node_load1` (Legend : `1 min`)
- Query B : `node_load5` (Legend : `5 min`)
- Query C : `node_load15` (Legend : `15 min`)
- Title : `System Load`

---

### Étape 11 : Créer un dashboard Docker

Crée un deuxième dashboard pour les métriques Docker.

**Panel 1 - CPU par conteneur (Time Series)** :

- Query :

```promql
rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100
```

- Legend : `{{ name }}`
- Title : `Container CPU Usage`

**Panel 2 - Mémoire par conteneur (Time Series)** :

- Query :

```promql
container_memory_working_set_bytes{name!=""}
```

- Unit : `bytes (SI)`
- Legend : `{{ name }}`
- Title : `Container Memory Usage`

**Panel 3 - Réseau par conteneur (Time Series)** :

- Query A (reçu) :

```promql
rate(container_network_receive_bytes_total{name!=""}[5m])
```

- Query B (envoyé) :

```promql
rate(container_network_transmit_bytes_total{name!=""}[5m])
```

- Unit : `bytes/sec (SI)`
- Title : `Container Network I/O`

**Panel 4 - Tableau récapitulatif (Table)** :

- Type de visualisation : **Table**
- Query A (CPU) :

```promql
rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100
```

- Query B (Mémoire) :

```promql
container_memory_working_set_bytes{name!=""}
```

- Format : Instant (pas Time Series)
- Title : `Container Resources`

---

### Étape 12 : Vérifier les alertes

1. Dans Prometheus (`http://localhost:9090`), va dans **Alerts**
2. Tu vois les règles d'alertes définies dans `alert-rules.yml`
3. Le conteneur `stress-test` devrait déclencher l'alerte `ContainerHighMemory` après quelques minutes

```bash
# Vérifie l'état des alertes via l'API
curl -s http://localhost:9090/api/v1/alerts | python3 -m json.tool
```

**Résultat attendu** (si le stress-test est en cours) :

```json
{
    "status": "success",
    "data": {
        "alerts": [
            {
                "labels": {
                    "alertname": "ContainerHighMemory",
                    "name": "infra-monitoring-stress-test-1"
                },
                "state": "firing"
            }
        ]
    }
}
```

---

### Étape 13 : Nettoyer

```bash
# Arrête les conteneurs (conserve les volumes)
cd ~/monitoring-cursus/infra-monitoring && docker compose down
```

> **Note** : `docker compose down` sans `-v` conserve les volumes Docker. Pour un environnement pédagogique temporaire dont tu veux tout supprimer, tu peux ajouter `-v` : `docker compose down -v`. Attention : cela supprime définitivement les données Prometheus et Grafana.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `curl http://localhost:9100/metrics` | Affiche toutes les métriques node_exporter |
| `curl http://localhost:8080/metrics` | Affiche toutes les métriques cAdvisor |
| `curl http://localhost:9090/api/v1/targets` | Liste les targets Prometheus et leur état |
| `curl http://localhost:9090/api/v1/alerts` | Liste les alertes actives |
| `docker stats --no-stream` | Affiche la consommation de chaque conteneur (instantané) |

---

## Pièges Fréquents

### Piège 1 : node_exporter n'affiche pas les métriques sur macOS

⚠️ **Problème** : Sur macOS, node_exporter dans Docker collecte les métriques de la VM Linux (OrbStack ou Docker Desktop), pas du Mac hôte. Les valeurs de mémoire et disque ne correspondent pas à ce que tu vois avec `top` sur macOS.

✅ **Solution** : C'est le comportement attendu. Docker sur macOS exécute les conteneurs dans une VM Linux. node_exporter voit cette VM. En production (serveur Linux), node_exporter voit directement le matériel. Pour l'apprentissage, les métriques de la VM sont suffisantes.

---

### Piège 2 : cAdvisor ne démarre pas

⚠️ **Problème** : cAdvisor affiche une erreur `Cannot connect to the Docker daemon`.

✅ **Solution** : Vérifie que le socket Docker est monté correctement. Sur macOS avec OrbStack, le chemin peut être différent :

```bash
# Vérifie le chemin du socket Docker
docker context inspect --format '{{ .Endpoints.docker.Host }}'
```

Si le résultat est différent de `unix:///var/run/docker.sock`, adapte le volume dans le Docker Compose.

---

### Piège 3 : Métriques cAdvisor avec des noms de conteneurs vides

⚠️ **Problème** : Les requêtes cAdvisor retournent beaucoup de résultats avec `name=""`. Ce sont les métriques globales (cgroups) qui ne correspondent pas à des conteneurs.

✅ **Solution** : Filtre toujours avec `name!=""` dans tes requêtes PromQL :

```promql
# ❌ Sans filtre : inclut les métriques globales
container_memory_working_set_bytes

# ✅ Avec filtre : uniquement les conteneurs nommés
container_memory_working_set_bytes{name!=""}
```

---

### Piège 4 : Requête CPU qui retourne toujours 0

⚠️ **Problème** : La requête `node_cpu_seconds_total` retourne une valeur qui augmente en continu (c'est un counter). Tu ne vois pas le pourcentage d'utilisation.

✅ **Solution** : Utilise `rate()` pour convertir un counter en taux par seconde, puis fais le calcul de pourcentage :

```promql
# ❌ Mauvais : valeur brute du counter (toujours croissante)
node_cpu_seconds_total{mode="idle"}

# ✅ Bon : taux d'utilisation en pourcentage
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

---

## Checklist de Validation

- [ ] node_exporter est installé et expose les métriques sur `http://localhost:9100/metrics`
- [ ] cAdvisor est installé et expose les métriques sur `http://localhost:8080/metrics`
- [ ] Prometheus collecte les métriques des deux exporteurs (targets UP)
- [ ] Je sais écrire des requêtes PromQL pour le CPU, la mémoire et le disque
- [ ] Je sais écrire des requêtes PromQL pour les conteneurs Docker
- [ ] J'ai créé un dashboard système dans Grafana (CPU, mémoire, disque)
- [ ] J'ai créé un dashboard Docker dans Grafana (CPU et mémoire par conteneur)
- [ ] Les règles d'alertes sont configurées et visibles dans Prometheus
- [ ] Je comprends le rôle de kube-state-metrics pour Kubernetes

---

## Exercice Pratique

**Énoncé** : Déploie la stack de monitoring d'infrastructure et crée un dashboard Grafana complet avec les éléments suivants :

1. Un panel Gauge pour le CPU avec des seuils colorés (vert/orange/rouge)
2. Un panel Gauge pour la mémoire avec des seuils colorés
3. Un panel Time Series montrant le CPU dans le temps
4. Un panel Time Series montrant la mémoire par conteneur Docker
5. Un panel Table listant chaque conteneur avec son CPU et sa mémoire actuels
6. Lance le conteneur `stress-test` et observe l'impact sur les métriques

**Indications** :

- Utilise `rate(node_cpu_seconds_total{mode="idle"}[5m])` pour le CPU système
- Utilise `container_memory_working_set_bytes{name!=""}` pour la mémoire par conteneur
- Pour le panel Table, utilise le format **Instant** (pas Time Series)
- Observe l'alerte `ContainerHighMemory` se déclencher dans Prometheus

**Résultat attendu** :

- Le dashboard affiche 5 panels fonctionnels
- Le conteneur `stress-test` est visible dans les métriques Docker
- L'alerte `ContainerHighMemory` passe en état `firing` après 5 minutes

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Panel 1 - Gauge CPU** :

- Datasource : Prometheus
- Query : `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
- Visualization : Gauge
- Unit : Percent (0-100)
- Thresholds : 0 = vert, 60 = orange, 80 = rouge

**Panel 2 - Gauge Mémoire** :

- Datasource : Prometheus
- Query : `(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100`
- Visualization : Gauge
- Unit : Percent (0-100)
- Thresholds : 0 = vert, 60 = orange, 80 = rouge

**Panel 3 - Time Series CPU** :

- Datasource : Prometheus
- Query : `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
- Visualization : Time Series
- Title : CPU Usage Over Time

**Panel 4 - Time Series Mémoire par conteneur** :

- Datasource : Prometheus
- Query : `container_memory_working_set_bytes{name!=""}`
- Visualization : Time Series
- Legend : `{{ name }}`
- Unit : bytes (SI)
- Title : Container Memory

**Panel 5 - Table des conteneurs** :

- Datasource : Prometheus
- Query A : `rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100`
  - Legend : `CPU %`
  - Format : Table, Instant
- Query B : `container_memory_working_set_bytes{name!=""}`
  - Legend : `Memory`
  - Format : Table, Instant
- Visualization : Table
- Title : Container Resources

**Vérification des alertes** :

Après le lancement de `stress-test`, attends 5 minutes puis vérifie dans Prometheus > Alerts. L'alerte `ContainerHighMemory` doit être en état `firing` pour le conteneur `stress-test`.

---

## Navigation

← Fiche précédente : **[Traces distribuées](08-traces-distribuees.md)**

→ Fiche suivante : **[Projet intégrateur](10-projet-integrateur.md)**
