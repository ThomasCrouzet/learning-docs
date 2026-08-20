---
tags:
  - Méthodologie
  - Débutant
  - Concept
description: "02 - La Supervision et le Monitoring"
estimated_time: "25 min"
fiche_number: 2
total_fiches: 4
cursus: "Architecture SI"
---

# 02 - La Supervision et le Monitoring

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est la supervision informatique, comment mettre en place du monitoring pour surveiller tes serveurs et applications, et comment configurer des alertes. Lecture estimée : 25 min.


## Prérequis

- Fiche **[01 - L'Infrastructure Réseau](01-infrastructure-reseau.md)**
- Fiche **[01-docker/01-docker-compose-symfony.md](../../01-docker/01-docker-compose-symfony.md)** (concepts Docker)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est la supervision informatique, comment mettre en place du monitoring pour surveiller tes serveurs et applications, et comment configurer des alertes.

---

## Concepts

### Qu'est-ce que la supervision (monitoring) ?

**Définition** : La supervision est l'ensemble des techniques et outils qui permettent de surveiller en temps réel l'état de santé d'un système informatique (serveurs, applications, réseau) et d'être alerté en cas de problème.

**Le problème que la supervision résout** :

Sans supervision, voici les problèmes rencontrés :

1. **Pannes non détectées** : Le serveur est en panne depuis 2h et personne ne le sait.
2. **Problèmes qui s'aggravent** : Le disque se remplit lentement jusqu'au crash.
3. **Diagnostic difficile** : Impossible de savoir ce qui s'est passé hier à 3h du matin.
4. **Réaction tardive** : Les utilisateurs signalent le problème avant l'équipe IT.

**Comment la supervision résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pannes non détectées | Alertes instantanées |
| Problèmes qui s'aggravent | Seuils d'alerte préventifs |
| Diagnostic difficile | Historique et graphiques |
| Réaction tardive | Notification proactive |

**Analogie concrète** : La supervision est comme le tableau de bord d'une voiture. Tu vois la vitesse, le niveau d'essence, la température moteur. Si l'essence est basse, un voyant s'allume AVANT la panne sèche. Sans tableau de bord, tu roules à l'aveugle jusqu'à ce que le moteur cale.

Le diagramme suivant présente les trois piliers de l'observabilité et la question à laquelle chacun répond.

<div class="diagram-design">
<p><a href="../../../diagrams/competences-metier-05-architecture-si-02-supervision-monitoring-1.html">Qu&#x27;est-ce que la supervision (monitoring) ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/competences-metier-05-architecture-si-02-supervision-monitoring-1.html" title="Qu&#x27;est-ce que la supervision (monitoring) ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Quels sont les types de métriques à surveiller ?

**Métriques d'infrastructure (ressources)** :

USE (Brendan Gregg) mesure **Utilization, Saturation, Errors** pour une ressource (CPU, mémoire, disque, réseau). RED (Tom Wilkie) mesure **Rate, Errors, Duration** pour un service. Les deux se complètent : USE pour la machine, RED pour l'application.

| Type | Métriques | Exemple de problème |
| ---- | --------- | ------------------- |
| **CPU** | Utilisation, load average | Application lente |
| **Mémoire** | RAM utilisée, swap | Crash par manque de mémoire |
| **Disque** | Espace libre, I/O | Base de données bloquée |
| **Réseau** | Bande passante, latence | Temps de réponse élevé |

**Métriques applicatives** :

| Métrique | Signification | Seuil typique |
| -------- | ------------- | ------------- |
| Temps de réponse | Durée d'une requête | < 200ms |
| Taux d'erreur | % de requêtes en échec | < 1% |
| Requêtes/seconde | Charge de l'application | Selon capacité |
| Connexions actives | Utilisateurs simultanés | Selon licence/config |

---

### Qu'est-ce qu'une alerte ?

**Définition** : Une alerte est une notification automatique envoyée quand une métrique dépasse un seuil défini.

**Niveaux d'alerte** :

| Niveau | Signification | Action |
| ------ | ------------- | ------ |
| **Info** | Information, pas d'action requise | Historique |
| **Warning** | Attention, seuil d'avertissement atteint | Surveiller |
| **Critical** | Problème grave, intervention requise | Agir immédiatement |

**Exemple de seuils** :

| Métrique | Warning | Critical |
| -------- | ------- | -------- |
| CPU | > 80% | > 95% |
| RAM | > 85% | > 95% |
| Disque | > 80% | > 90% |
| Temps de réponse | > 500ms | > 2s |

---

### Quels sont les outils de monitoring courants ?

| Outil | Type | Usage |
| ----- | ---- | ----- |
| **Prometheus** | Collecte métriques | Standard pour Kubernetes et Docker |
| **Grafana** | Visualisation | Tableaux de bord graphiques |
| **Zabbix** | Supervision complète | Entreprise, très complet |
| **Nagios** | Supervision historique | Alertes, checks |
| **Uptime Kuma** | Monitoring simple | Checks HTTP, léger |
| **Netdata** | Temps réel | Métriques système instantanées |

**Stack moderne courante** : Prometheus (collecte) + Grafana (visualisation) + Alertmanager (alertes)

---

## Étapes Pratiques

### Étape 1 : Installer Uptime Kuma avec Docker (monitoring simple)

Uptime Kuma est un outil simple pour surveiller la disponibilité de services.

```yaml
# docker-compose.yml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - ./uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped
```

```bash
# Lancer le conteneur
docker compose up -d
```

**Résultat attendu** : Accéder à `http://localhost:3001` et créer un compte admin.

---

### Étape 2 : Configurer un check HTTP

Dans Uptime Kuma :

1. Cliquer sur "Add New Monitor"
2. Configurer :

   | Champ | Valeur |
   | ----- | ------ |
   | Monitor Type | HTTP(s) |
   | Friendly Name | Mon Site Web |
   | URL | <https://example.com> |
   | Heartbeat Interval | 60 secondes |

3. Sauvegarder

**Résultat attendu** : Le monitoring commence et affiche le statut UP/DOWN.

---

### Étape 3 : Installer Prometheus + Grafana (stack complète)

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - "9090:9090"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"
    environment:
      # Mot de passe de labo uniquement - ne jamais réutiliser en production
      - GF_SECURITY_ADMIN_PASSWORD=lab-change-me
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

```bash
# Lancer la stack
docker compose up -d
```

**Résultat attendu** :

- Prometheus : `http://localhost:9090`
- Grafana : `http://localhost:3000` (utilisateur `admin`, mot de passe = valeur de `GF_SECURITY_ADMIN_PASSWORD` dans le compose, ici `lab-change-me` - labo uniquement)

---

### Étape 4 : Créer un dashboard Grafana

1. Accéder à Grafana (`http://localhost:3000`)
2. Aller dans **Connections** → **Data sources** (Grafana 10+ ; ce n'est plus Configuration)
3. Ajouter Prometheus :

   | Champ | Valeur |
   | ----- | ------ |
   | Name | Prometheus |
   | URL | <http://prometheus:9090> |

4. Cliquer "Save & Test"

5. Créer un Dashboard :
   - Dashboards → New Dashboard → Add visualization
   - Sélectionner Prometheus comme source
   - Query : `node_cpu_seconds_total`
   - Sauvegarder

---

### Étape 5 : Requêtes PromQL utiles

PromQL est le langage de requête de Prometheus.

```promql
# CPU utilisé (%)
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Mémoire utilisée (%)
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Espace disque utilisé (%)
(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100

# Requêtes HTTP par seconde (si tu as un exporter)
rate(http_requests_total[5m])

# Temps de réponse moyen
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

---

### Étape 6 : Configurer une alerte

Dans Grafana 10+, les alertes ne se créent plus dans l'onglet Alert d'un panel (alerting historique retiré). Utilise Grafana Alerting :

1. Menu **Alerts & IRM** → **Alert rules** → **New alert rule**
2. Configurer :

    | Champ | Valeur |
    | ----- | ------ |
    | Name | CPU élevé |
    | Query | `100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
    | Condition | IS ABOVE 80 |
    | Evaluate every | 1m |
    | Pending period | 5m |

3. Configurer un contact point (email, Slack, webhook) puis sauvegarder la règle

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `docker stats` | Voir les ressources des conteneurs en temps réel |
| `htop` | Moniteur système interactif (CPU, RAM, processus) |
| `df -h` | Espace disque par partition |
| `free -h` | Utilisation mémoire |
| `uptime` | Load average du système |
| `curl -s localhost:9090/-/healthy` | Vérifier que Prometheus est UP |

---

## Pièges Fréquents

### Piège 1 : Trop d'alertes (alert fatigue)

⚠️ **Problème** : 100 alertes par jour → on les ignore toutes.

✅ **Solution** : Alerter uniquement sur ce qui nécessite une action. Une alerte = une action.

---

### Piège 2 : Seuils trop sensibles

⚠️ **Problème** : Alerte à 70% de CPU → alertes toutes les 5 minutes pour des pics normaux.

✅ **Solution** : Utiliser des seuils réalistes et des durées (alerte si > 90% pendant 5 minutes).

---

### Piège 3 : Ne surveiller que la disponibilité

⚠️ **Problème** : Le site répond "200 OK" mais met 30 secondes → pas d'alerte.

✅ **Solution** : Surveiller aussi le temps de réponse et le contenu de la réponse.

---

### Piège 4 : Pas de rétention des métriques

⚠️ **Problème** : Impossible de voir ce qui s'est passé il y a 1 mois.

✅ **Solution** : Configurer la rétention (ex: 30 jours) et archiver les données importantes.

---

## Checklist de Validation

- [ ] Je comprends ce qu'est la supervision et son utilité
- [ ] Je connais les métriques principales (CPU, RAM, disque, réseau)
- [ ] Je sais installer un outil de monitoring simple (Uptime Kuma)
- [ ] Je comprends l'architecture Prometheus + Grafana
- [ ] Je sais écrire des requêtes PromQL basiques
- [ ] Je sais configurer une alerte avec des seuils

---

## Exercice Pratique

**Énoncé** : Tu dois mettre en place la supervision pour un serveur web.

1. Liste 5 métriques à surveiller avec leurs seuils Warning et Critical
2. Écris 2 requêtes PromQL pour CPU et mémoire
3. Décris une règle d'alerte pour le temps de réponse HTTP

**Résultat attendu** : Un document Markdown d'environ 40 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

### 1. Métriques et seuils

| Métrique | Description | Warning | Critical |
| -------- | ----------- | ------- | -------- |
| CPU | Utilisation processeur | > 75% (5min) | > 90% (5min) |
| RAM | Mémoire utilisée | > 80% | > 95% |
| Disque | Espace utilisé | > 80% | > 90% |
| HTTP Response Time | Temps de réponse moyen | > 500ms | > 2000ms |
| HTTP Error Rate | % de réponses 5xx | > 1% | > 5% |

---

### 2. Requêtes PromQL

**CPU utilisé (%)** :

```promql
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Mémoire utilisée (%)** :

```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

---

### 3. Règle d'alerte - Temps de réponse HTTP

```yaml
alert: HTTPResponseTimeTooHigh
expr: |
  rate(http_request_duration_seconds_sum[5m])
  / rate(http_request_duration_seconds_count[5m]) > 0.5
for: 5m
labels:
  severity: warning
annotations:
  summary: "Temps de réponse HTTP élevé"
  description: "Le temps de réponse moyen dépasse 500ms depuis 5 minutes"
```

**Logique** : Alerte si le temps de réponse moyen dépasse 500ms pendant 5 minutes consécutives.

---

## Navigation

← Fiche précédente : **[01 - L'Infrastructure Réseau](01-infrastructure-reseau.md)**

→ Fiche suivante : **[03 - La Sécurité du Système d'Information](03-securite-systeme-information.md)**
