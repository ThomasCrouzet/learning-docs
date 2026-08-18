---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "Monitoring et logs cloud : CloudWatch, Cloud Logging, alertes, métriques, tableaux de bord et bonnes pratiques d'observabilite."
estimated_time: "70 min"
fiche_number: 9
total_fiches: 13
cursus: "Cloud"
---

# 09 - Monitoring cloud

> **En bref** : Tu découvriras les services de monitoring et de logs dans le cloud (CloudWatch, Cloud Logging), tu apprendras a créer des métriques, des alarmes et des tableaux de bord pour surveiller tes applications et reagir aux incidents. Lecture estimée : 70 min.

## Prérequis

- Avoir lu la fiche [08 - Conteneurs cloud](08-conteneurs-cloud.md)
- Avoir un compte AWS configure avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))

## Objectif de cette fiche

A la fin de cette fiche, tu sauras consulter des métriques et des logs dans CloudWatch, créer des alarmes pour détecter les problèmes, construire un tableau de bord de surveillance et configurer des notifications par e-mail ou SMS.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le monitoring cloud ?

**Définition** : Le monitoring cloud est l'ensemble des pratiques et outils qui permettent de collecter, analyser et visualiser les données de performance et de santé de tes applications et de ton infrastructure dans le cloud.

**Le problème que le monitoring résout** :

Sans monitoring, voici les problèmes rencontres :

1. **Pannes invisibles** : Ton application est en panne depuis 30 minutes et tu ne le sais pas. Ce sont les utilisateurs qui te previennent par e-mail ou sur les réseaux sociaux.
2. **Diagnostic impossible** : Quand un problème survient, tu ne sais pas ou chercher. Pas de logs centralises, pas de métriques, pas de traces. Tu devines au lieu d'analyser.
3. **Pas de prevention** : Tu ne detectes les problèmes qu'après la panne. L'utilisation CPU augmente progressivement depuis 3 jours, mais personne ne le voit avant que le serveur sature.

**Comment le monitoring résout ces problèmes** :

| Problème | Solution apportée par le monitoring |
| --- | --- |
| Pannes invisibles | Les alarmes detectent les anomalies et envoient des notifications automatiquement |
| Diagnostic impossible | Les logs et les métriques fournissent les données nécessaires pour identifier la cause |
| Pas de prevention | Les tableaux de bord montrent les tendances et les seuils permettent d'anticiper les problèmes |

**Analogie concrète** : Le monitoring, c'est comme le tableau de bord d'une voiture. Sans tableau de bord, tu conduis a l'aveugle. Tu ne sais pas a quelle vitesse tu roules (métriques), le voyant moteur ne s'allume pas quand il y a un problème (alarmes) et tu ne vois pas le niveau d'essence baisser (tendances). Le monitoring cloud, c'est ton tableau de bord pour tes applications.

**Ce que le monitoring n'est PAS** :

- Le monitoring n'est pas du debugging. Le monitoring detecte qu'il y a un problème et fournit des indices. Le debugging est le processus qui consiste a trouver et corriger le bug dans le code.
- Le monitoring n'est pas uniquement des alertes. Les alertes sont un composant du monitoring. Un bon monitoring inclut aussi des métriques, des logs, des traces et des tableaux de bord.

---

### Les trois piliers de l'observabilite

**Définition** : L'observabilite est la capacité a comprendre l'état interne d'un système en observant ses sorties. Elle repose sur trois piliers.

| Pilier | Description | Exemple |
| --- | --- | --- |
| **Métriques** | Mesures numériques collectees a intervalles réguliers | Utilisation CPU : 73%, temps de réponse : 120ms, requêtes/seconde : 450 |
| **Logs** | Enregistrements textuels des événements | `2025-01-15T14:30:00 ERROR Database connection timeout after 5000ms` |
| **Traces** | Suivi du parcours d'une requête a travers les services | Requête HTTP -> API Gateway -> Lambda -> DynamoDB (total : 230ms) |

**Analogie concrète** : Imagine que tu geres un restaurant. Les métriques, ce sont les chiffres : nombre de clients par heure, temps moyen d'attente, chiffre d'affaires. Les logs, c'est le journal des événements : "14h30 : le four est en panne", "15h00 : le four est repare". Les traces, c'est le suivi d'une commande : "commande recue -> preparee en cuisine -> servie en salle -> payee" avec le temps de chaque étape.

---

### Qu'est-ce que Amazon CloudWatch ?

**Définition** : CloudWatch est le service de monitoring et d'observabilite d'AWS. Il collecte automatiquement les métriques de tous les services AWS et permet de créer des alarmes, des tableaux de bord et des requêtes sur les logs.

**Composants de CloudWatch** :

| Composant | Role | Exemple |
| --- | --- | --- |
| **Métriques** | Collecte de données numériques | CPUUtilization, NetworkIn, 4XXError |
| **Logs** | Stockage et recherche de logs | Logs d'application, logs de conteneurs, logs d'accès |
| **Alarmes** | Détection de seuils et notifications | Alarme si CPU > 80% pendant 5 minutes |
| **Dashboards** | Tableaux de bord visuels | Graphiques de métriques, statut des alarmes |
| **Events/EventBridge** | Reactions automatiques aux événements | Redémarrer une instance quand elle tombe en panne |
| **Insights** | Analyse avancée des logs | Requêtes SQL-like sur les logs (Logs Insights) |

---

### Les métriques CloudWatch

**Définition** : Une métrique est une serie temporelle de valeurs numériques. Chaque point de données a un timestamp, une valeur et une unité.

**Concepts clés** :

| Concept | Description |
| --- | --- |
| **Namespace** | Catégorie de métriques (ex: `AWS/EC2`, `AWS/RDS`, `AWS/ECS`) |
| **Metric Name** | Nom de la métrique (ex: `CPUUtilization`, `MemoryUtilization`) |
| **Dimension** | Filtre qui identifie la ressource (ex: `InstanceId=i-1234567890abcdef0`) |
| **Period** | Intervalle d'agrégation en secondes (60, 300, 3600) |
| **Statistic** | Fonction d'agrégation (Average, Sum, Maximum, Minimum, SampleCount) |

**Métriques automatiques par service** :

| Service | Métriques clés | Namespace |
| --- | --- | --- |
| EC2 | CPUUtilization, NetworkIn, NetworkOut, StatusCheckFailed | AWS/EC2 |
| RDS | CPUUtilization, FreeableMemory, DatabaseConnections, ReadLatency | AWS/RDS |
| ECS | CPUUtilization, MemoryUtilization | AWS/ECS |
| S3 | NumberOfObjects, BucketSizeBytes | AWS/S3 |
| ALB | RequestCount, TargetResponseTime, HTTPCode_ELB_5XX_Count | AWS/ApplicationELB |

---

### Les logs CloudWatch

**Structure des logs** :

<div class="diagram-design">
<p><a href="../../diagrams/22-cloud-09-monitoring-cloud-1.html">Les logs CloudWatch (HTML + SVG)</a></p>
<iframe src="../../diagrams/22-cloud-09-monitoring-cloud-1.html" title="Les logs CloudWatch" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

| Concept | Description | Exemple |
| --- | --- | --- |
| **Log Group** | Conteneur logique pour un ensemble de flux de logs | `/ecs/demo-app` |
| **Log Stream** | Flux individuel de logs (une source) | `ecs/demo-app/task-abc123` |
| **Log Event** | Un enregistrement de log individuel | `{"timestamp": 1705312200, "message": "Request received"}` |
| **Retention** | Durée de conservation des logs (1 jour a 10 ans, ou indefini) | 30 jours |

---

### Les alarmes CloudWatch

**Définition** : Une alarme surveille une métrique et déclenche une action quand la valeur dépasse un seuil défini.

**États d'une alarme** :

| État | Description |
| --- | --- |
| **OK** | La métrique est dans les limites normales |
| **ALARM** | La métrique a dépasse le seuil défini |
| **INSUFFICIENT_DATA** | Pas assez de données pour évaluer la métrique |

**Actions possibles quand une alarme se déclenche** :

- Envoyer une notification via SNS (e-mail, SMS, webhook)
- Arreter, redémarrer ou terminer une instance EC2
- Declencher une politique d'auto-scaling
- Executer une action Systems Manager

---

### Equivalents multi-cloud

| Fonctionnalité | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Métriques | CloudWatch Metrics | Cloud Monitoring | Azure Monitor |
| Logs | CloudWatch Logs | Cloud Logging | Azure Monitor Logs |
| Alertes | CloudWatch Alarms | Cloud Alerting | Azure Alerts |
| Tableaux de bord | CloudWatch Dashboards | Cloud Monitoring Dashboards | Azure Dashboards |
| Analyse de logs | CloudWatch Logs Insights | Cloud Logging queries | Log Analytics |

---

## Étapes Pratiques

### Étape 1 : Consulter les métriques d'une instance EC2

```bash
# Lister les metriques disponibles pour EC2
aws cloudwatch list-metrics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization
```

```bash
# Recuperer la metrique CPU d'une instance sur les 30 dernieres minutes
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time $(date -u -v-30M +"%Y-%m-%dT%H:%M:%SZ") \
  --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --period 300 \
  --statistics Average Maximum
```

**Résultat attendu** :

```text
{
    "Label": "CPUUtilization",
    "Datapoints": [
        {
            "Timestamp": "2025-01-15T14:00:00Z",
            "Average": 12.5,
            "Maximum": 35.2,
            "Unit": "Percent"
        },
        {
            "Timestamp": "2025-01-15T14:05:00Z",
            "Average": 15.8,
            "Maximum": 42.1,
            "Unit": "Percent"
        }
    ]
}
```

---

### Étape 2 : Creer un groupe de logs et envoyer des logs

```bash
# Creer un groupe de logs avec une retention de 30 jours
aws logs create-log-group \
  --log-group-name /application/demo-monitoring

aws logs put-retention-policy \
  --log-group-name /application/demo-monitoring \
  --retention-in-days 30

# Creer un flux de logs
aws logs create-log-stream \
  --log-group-name /application/demo-monitoring \
  --log-stream-name serveur-1
```

```bash
# Envoyer des evenements de log
aws logs put-log-events \
  --log-group-name /application/demo-monitoring \
  --log-stream-name serveur-1 \
  --log-events \
    timestamp=$(date +%s000),message='{"level":"INFO","message":"Application demarree","port":3000}' \
    timestamp=$(date +%s001),message='{"level":"INFO","message":"Connexion base de donnees OK"}' \
    timestamp=$(date +%s002),message='{"level":"WARN","message":"Latence elevee","duration_ms":1200}' \
    timestamp=$(date +%s003),message='{"level":"ERROR","message":"Timeout base de donnees","duration_ms":5000}'
```

---

### Étape 3 : Rechercher dans les logs avec Logs Insights

```bash
# Requeter les logs pour trouver les erreurs
aws logs start-query \
  --log-group-name /application/demo-monitoring \
  --start-time $(date -u -v-1H +%s) \
  --end-time $(date -u +%s) \
  --query-string 'fields @timestamp, @message
    | filter @message like /ERROR/
    | sort @timestamp desc
    | limit 20'
```

**Résultat attendu** :

```text
{
    "queryId": "abc123-def456-ghi789"
}
```

```bash
# Recuperer les resultats de la requete
aws logs get-query-results --query-id abc123-def456-ghi789
```

**Résultat attendu** :

```text
{
    "results": [
        [
            {"field": "@timestamp", "value": "2025-01-15 14:30:00.003"},
            {"field": "@message", "value": "{\"level\":\"ERROR\",\"message\":\"Timeout base de donnees\",\"duration_ms\":5000}"}
        ]
    ],
    "status": "Complete"
}
```

**Requêtes Logs Insights utiles** :

```text
# Compter les erreurs par niveau de log
fields @timestamp, @message
| parse @message '{"level":"*"' as log_level
| stats count() by log_level

# Top 10 des erreurs les plus frequentes
fields @timestamp, @message
| filter @message like /ERROR/
| stats count() as nb by @message
| sort nb desc
| limit 10

# Latence moyenne et P99
fields @timestamp, @message
| parse @message '"duration_ms":*}' as duration
| stats avg(duration) as moy, pct(duration, 99) as p99
```

---

### Étape 4 : Creer un sujet SNS pour les notifications

```bash
# Creer un sujet SNS pour les notifications d'alarme
aws sns create-topic --name alarmes-monitoring

# S'abonner par e-mail
aws sns subscribe \
  --topic-arn arn:aws:sns:eu-west-3:123456789012:alarmes-monitoring \
  --protocol email \
  --notification-endpoint ton-email@exemple.fr
```

**Résultat attendu** :

```text
{
    "SubscriptionArn": "pending confirmation"
}
```

Un e-mail de confirmation est envoyé. Tu dois cliquer sur le lien pour activer l'abonnement.

---

### Étape 5 : Creer une alarme CloudWatch

```bash
# Alarme CPU : se declenche si le CPU depasse 80% pendant 5 minutes
aws cloudwatch put-metric-alarm \
  --alarm-name "cpu-haute-demo" \
  --alarm-description "Alarme si CPU > 80% pendant 5 minutes" \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-monitoring \
  --ok-actions arn:aws:sns:eu-west-3:123456789012:alarmes-monitoring \
  --tags Key=Environment,Value=dev
```

Decomposition des paramètres :

- `--period 300` : la métrique est evaluee toutes les 5 minutes (300 secondes)
- `--threshold 80` : le seuil est de 80%
- `--evaluation-periods 1` : l'alarme se déclenche après 1 periode depassant le seuil
- `--alarm-actions` : action quand l'état passe a ALARM (envoi de notification)
- `--ok-actions` : action quand l'état revient a OK (notification de retour a la normale)

```bash
# Verifier le statut de l'alarme
aws cloudwatch describe-alarms \
  --alarm-names "cpu-haute-demo" \
  --query "MetricAlarms[0].{Nom:AlarmName,Etat:StateValue,Seuil:Threshold}"
```

**Résultat attendu** :

```text
{
    "Nom": "cpu-haute-demo",
    "Etat": "OK",
    "Seuil": 80.0
}
```

---

### Étape 6 : Creer des alarmes pour RDS et ECS

```bash
# Alarme RDS : connexions a la base de donnees
aws cloudwatch put-metric-alarm \
  --alarm-name "rds-connexions-demo" \
  --alarm-description "Alarme si plus de 50 connexions simultanees" \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=demo-postgres \
  --statistic Average \
  --period 300 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-monitoring

# Alarme ECS : utilisation memoire des conteneurs
aws cloudwatch put-metric-alarm \
  --alarm-name "ecs-memoire-demo" \
  --alarm-description "Alarme si memoire > 85% pendant 10 minutes" \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ClusterName,Value=demo-cluster Name=ServiceName,Value=demo-service \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-monitoring
```

---

### Étape 7 : Creer un tableau de bord CloudWatch

```bash
# Creer un tableau de bord
aws cloudwatch put-dashboard \
  --dashboard-name "demo-monitoring" \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "x": 0,
        "y": 0,
        "width": 12,
        "height": 6,
        "properties": {
          "title": "CPU EC2",
          "metrics": [
            ["AWS/EC2", "CPUUtilization", "InstanceId", "i-1234567890abcdef0"]
          ],
          "period": 300,
          "stat": "Average",
          "region": "eu-west-3",
          "view": "timeSeries"
        }
      },
      {
        "type": "metric",
        "x": 12,
        "y": 0,
        "width": 12,
        "height": 6,
        "properties": {
          "title": "Connexions RDS",
          "metrics": [
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", "demo-postgres"]
          ],
          "period": 300,
          "stat": "Average",
          "region": "eu-west-3",
          "view": "timeSeries"
        }
      },
      {
        "type": "metric",
        "x": 0,
        "y": 6,
        "width": 12,
        "height": 6,
        "properties": {
          "title": "Memoire ECS",
          "metrics": [
            ["AWS/ECS", "MemoryUtilization", "ClusterName", "demo-cluster", "ServiceName", "demo-service"]
          ],
          "period": 300,
          "stat": "Average",
          "region": "eu-west-3",
          "view": "timeSeries"
        }
      },
      {
        "type": "alarm",
        "x": 12,
        "y": 6,
        "width": 12,
        "height": 6,
        "properties": {
          "title": "Statut des alarmes",
          "alarms": [
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:cpu-haute-demo",
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:rds-connexions-demo",
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:ecs-memoire-demo"
          ]
        }
      }
    ]
  }'
```

**Résultat attendu** :

```text
{
    "DashboardValidationMessages": []
}
```

Un tableau vide de `DashboardValidationMessages` signifie que le tableau de bord est valide.

---

### Étape 8 : Nettoyer les ressources

```bash
# Supprimer les alarmes
aws cloudwatch delete-alarms \
  --alarm-names "cpu-haute-demo" "rds-connexions-demo" "ecs-memoire-demo"

# Supprimer le tableau de bord
aws cloudwatch delete-dashboards --dashboard-names "demo-monitoring"

# Supprimer le sujet SNS
aws sns delete-topic \
  --topic-arn arn:aws:sns:eu-west-3:123456789012:alarmes-monitoring

# Supprimer les logs
aws logs delete-log-group --log-group-name /application/demo-monitoring
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws cloudwatch list-metrics --namespace <ns>` | Lister les métriques d'un namespace |
| `aws cloudwatch get-metric-statistics` | Récupérer les statistiques d'une métrique |
| `aws cloudwatch describe-alarms` | Lister toutes les alarmes et leur statut |
| `aws cloudwatch set-alarm-state` | Forcer l'état d'une alarme (pour tester) |
| `aws logs describe-log-groups` | Lister les groupes de logs |
| `aws logs tail <groupe> --follow` | Suivre les logs en temps réel |
| `aws logs start-query` | Lancer une requête Logs Insights |
| `aws logs get-query-results --query-id <id>` | Récupérer les résultats d'une requête |
| `aws sns list-topics` | Lister les sujets SNS |
| `aws sns list-subscriptions` | Lister les abonnements SNS |

---

## Pièges Frequents

### Piège 1 : Ne surveiller que le CPU

**Problème** : Tu créés une alarme CPU a 80% et tu penses que le monitoring est en place. Mais l'application plante a cause d'un manque de mémoire, de connexions a la base de données saturees ou d'un disque plein. Le CPU reste a 20% et aucune alarme ne se déclenche.

**Solution** : Mets en place un monitoring multi-couche. Pour chaque service, surveille au minimum :

- **EC2** : CPU, mémoire (necessite l'agent CloudWatch), disque, réseau
- **RDS** : CPU, mémoire libre, connexions, latence de lecture/écriture, espace disque
- **ECS** : CPU, mémoire, nombre de tasks en cours d'exécution
- **ALB** : temps de réponse, erreurs 5XX, requêtes par seconde

### Piège 2 : Alarmes trop sensibles

**Problème** : Tu configures une alarme qui se déclenche des que le CPU dépasse 50% pendant 1 minute. L'alarme se déclenche et se résout 20 fois par jour. Tu finis par ignorer les notifications (fatigue d'alerte).

**Solution** : Choisis des seuils réalistes et des periodes d'evaluation plus longues. Par exemple :

- CPU > 80% pendant 10 minutes (2 periodes de 5 minutes) pour une alerte
- CPU > 95% pendant 5 minutes pour une alerte critique
- Moins de 5 alarmes par jour en fonctionnement normal

### Piège 3 : Pas de retention sur les logs

**Problème** : Tu ne configures pas de retention sur tes groupes de logs. Après 6 mois, tu as des teraoctets de logs stockes dans CloudWatch. La facture de stockage est énorme.

**Solution** : Configure une retention adaptee a chaque groupe de logs :

- Logs de développement : 7 jours
- Logs applicatifs : 30 a 90 jours
- Logs d'audit/conformité : 1 a 10 ans
- Logs volumineux : exporte vers S3 pour un stockage moins cher

### Piège 4 : Logs non structures

**Problème** : Tes logs sont des lignes de texte brut sans format coherent. Les recherches dans Logs Insights sont inefficaces car il faut parser chaque ligne avec des expressions régulières.

**Solution** : Utilise des logs structures en JSON. Chaque événement contient des champs standards :

```json
{
  "timestamp": "2025-01-15T14:30:00Z",
  "level": "ERROR",
  "message": "Timeout base de donnees",
  "service": "api",
  "duration_ms": 5000,
  "request_id": "req-abc123"
}
```

Les logs JSON permettent d'utiliser Logs Insights sans regex : `filter level = "ERROR" | stats count() by service`.

---

## Checklist de Validation

- [ ] Je sais consulter les métriques d'un service AWS dans CloudWatch
- [ ] Je sais créer un groupe de logs et envoyer des événements
- [ ] Je sais utiliser Logs Insights pour rechercher dans les logs
- [ ] Je sais créer une alarme CloudWatch avec un seuil et une notification
- [ ] Je sais créer un tableau de bord CloudWatch
- [ ] Je comprends les trois piliers de l'observabilite (métriques, logs, traces)
- [ ] Je connais les bonnes pratiques de retention des logs et de seuils d'alarmes

---

## Exercice Pratique

**Enonce** : Mets en place le monitoring complet pour une application web composee d'une instance EC2, d'une base de données RDS et d'un service ECS :

1. Créé un sujet SNS `alarmes-exercice` avec un abonnement e-mail
2. Créé les alarmes suivantes :
   - CPU EC2 > 80% pendant 10 minutes
   - Mémoire libre RDS < 200 Mo pendant 5 minutes
   - Erreurs 5XX ALB > 10 par minute pendant 5 minutes
   - Mémoire ECS > 85% pendant 10 minutes
3. Créé un tableau de bord `exercice-monitoring` avec 4 widgets :
   - Graphique CPU de l'instance EC2
   - Graphique mémoire libre de RDS
   - Graphique nombre de requêtes de l'ALB
   - Widget statut des 4 alarmes
4. Créé un groupe de logs `/application/exercice` avec une retention de 30 jours
5. Écris une requête Logs Insights qui compte les erreurs par niveau de log

**Indications** :

- Commence par le sujet SNS (tu en as besoin pour les alarmes)
- Pour l'alarme de mémoire libre RDS, utilise `LessThanThreshold` comme comparateur
- Utilise `evaluation-periods 2` pour éviter les faux positifs
- Remplace les identifiants de ressources (InstanceId, DBInstanceIdentifier, etc.) par les tiens

**Résultat attendu** : 4 alarmes en statut "INSUFFICIENT_DATA" (normal si les ressources n'existent pas), 1 tableau de bord fonctionnel, 1 groupe de logs avec retention configurée.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**1. Creer le sujet SNS** :

```bash
# Creer le sujet
aws sns create-topic --name alarmes-exercice

# S'abonner
aws sns subscribe \
  --topic-arn arn:aws:sns:eu-west-3:123456789012:alarmes-exercice \
  --protocol email \
  --notification-endpoint ton-email@exemple.fr
```

**2. Creer les 4 alarmes** :

```bash
# Alarme 1 : CPU EC2 > 80% pendant 10 minutes
aws cloudwatch put-metric-alarm \
  --alarm-name "exercice-cpu-ec2" \
  --alarm-description "CPU EC2 > 80% pendant 10 min" \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-exercice \
  --ok-actions arn:aws:sns:eu-west-3:123456789012:alarmes-exercice

# Alarme 2 : Memoire libre RDS < 200 Mo pendant 5 minutes
aws cloudwatch put-metric-alarm \
  --alarm-name "exercice-memoire-rds" \
  --alarm-description "Memoire libre RDS < 200 Mo" \
  --namespace AWS/RDS \
  --metric-name FreeableMemory \
  --dimensions Name=DBInstanceIdentifier,Value=demo-postgres \
  --statistic Average \
  --period 300 \
  --threshold 209715200 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-exercice

# Alarme 3 : Erreurs 5XX ALB > 10/minute pendant 5 minutes
aws cloudwatch put-metric-alarm \
  --alarm-name "exercice-5xx-alb" \
  --alarm-description "Erreurs 5XX ALB > 10/min" \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_ELB_5XX_Count \
  --dimensions Name=LoadBalancer,Value=app/demo-alb/1234567890abcdef \
  --statistic Sum \
  --period 60 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 5 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-exercice

# Alarme 4 : Memoire ECS > 85% pendant 10 minutes
aws cloudwatch put-metric-alarm \
  --alarm-name "exercice-memoire-ecs" \
  --alarm-description "Memoire ECS > 85% pendant 10 min" \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ClusterName,Value=demo-cluster Name=ServiceName,Value=demo-service \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:eu-west-3:123456789012:alarmes-exercice
```

**3. Creer le tableau de bord** :

```bash
aws cloudwatch put-dashboard \
  --dashboard-name "exercice-monitoring" \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "x": 0, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "CPU EC2",
          "metrics": [["AWS/EC2", "CPUUtilization", "InstanceId", "i-1234567890abcdef0"]],
          "period": 300, "stat": "Average", "region": "eu-west-3"
        }
      },
      {
        "type": "metric",
        "x": 12, "y": 0, "width": 12, "height": 6,
        "properties": {
          "title": "Memoire libre RDS",
          "metrics": [["AWS/RDS", "FreeableMemory", "DBInstanceIdentifier", "demo-postgres"]],
          "period": 300, "stat": "Average", "region": "eu-west-3"
        }
      },
      {
        "type": "metric",
        "x": 0, "y": 6, "width": 12, "height": 6,
        "properties": {
          "title": "Requetes ALB",
          "metrics": [["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/demo-alb/1234567890abcdef"]],
          "period": 300, "stat": "Sum", "region": "eu-west-3"
        }
      },
      {
        "type": "alarm",
        "x": 12, "y": 6, "width": 12, "height": 6,
        "properties": {
          "title": "Statut des alarmes",
          "alarms": [
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:exercice-cpu-ec2",
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:exercice-memoire-rds",
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:exercice-5xx-alb",
            "arn:aws:cloudwatch:eu-west-3:123456789012:alarm:exercice-memoire-ecs"
          ]
        }
      }
    ]
  }'
```

**4. Creer le groupe de logs** :

```bash
aws logs create-log-group --log-group-name /application/exercice
aws logs put-retention-policy \
  --log-group-name /application/exercice \
  --retention-in-days 30
```

**5. Requête Logs Insights** :

```text
fields @timestamp, @message
| parse @message '{"level":"*"' as log_level
| stats count() as nombre by log_level
| sort nombre desc
```

**Nettoyer** :

```bash
aws cloudwatch delete-alarms \
  --alarm-names "exercice-cpu-ec2" "exercice-memoire-rds" "exercice-5xx-alb" "exercice-memoire-ecs"
aws cloudwatch delete-dashboards --dashboard-names "exercice-monitoring"
aws sns delete-topic --topic-arn arn:aws:sns:eu-west-3:123456789012:alarmes-exercice
aws logs delete-log-group --log-group-name /application/exercice
```

---

## Navigation

← Fiche précédente : **[08 - Conteneurs cloud](08-conteneurs-cloud.md)**

→ Fiche suivante : **[10 - Projet intégrateur](10-projet-integrateur.md)**
