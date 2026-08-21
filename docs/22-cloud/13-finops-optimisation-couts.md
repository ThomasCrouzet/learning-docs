---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "FinOps et optimisation des coûts cloud : cost allocation tags, Reserved Instances, Savings Plans, instances Spot, rightsizing, AWS Budgets et les trois phases Inform/Optimize/Operate."
estimated_time: "75 min"
fiche_number: 13
total_fiches: 13
cursus: "Cloud"
id: "infrastructure.cloud.finops-optimisation-couts"
course_id: "infrastructure.cloud"
content_type: "lesson"
order: 13
---

# 13 - FinOps : maîtriser les coûts cloud

> **En bref** : Tu découvriras le FinOps, la discipline qui aide les équipes à maîtriser et optimiser leurs dépenses cloud. Tu apprendras à étiqueter les coûts, à comparer les modèles d'achat (à la demande, Reserved Instances, Savings Plans, Spot), à redimensionner tes ressources et à mettre en place des budgets et des alertes. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [02 - Compute](02-cloud-compute.md) pour comprendre les instances et leurs tailles
- Avoir lu la fiche [09 - Monitoring et logs cloud](09-monitoring-cloud.md) pour la notion de métriques et d'alertes
- Avoir un compte AWS configuré avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras définir le FinOps et ses trois phases, étiqueter les ressources avec des cost allocation tags, choisir le bon modèle d'achat (à la demande, Reserved Instances, Savings Plans, Spot) selon le cas d'usage, identifier des ressources surdimensionnées (rightsizing), et créer un budget avec alerte via AWS Budgets.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le FinOps ?

**Définition** : Le FinOps (contraction de Finance et DevOps) est une discipline et une culture qui visent à donner à chaque équipe la responsabilité de ses dépenses cloud, en alliant les enjeux financiers, techniques et métier. L'objectif n'est pas de dépenser le moins possible, mais d'obtenir le maximum de valeur pour chaque euro dépensé.

**Le problème que le FinOps résout** :

Sans FinOps, voici les problèmes rencontrés dans le cloud :

1. **Coûts imprévisibles** : Le cloud facture à l'usage. Sans suivi, une ressource oubliée ou un pic de trafic peut faire exploser la facture en fin de mois, sans que personne ne l'ait anticipé.
2. **Dilution de la responsabilité** : Avec un budget IT classique, personne ne se sent responsable d'une ressource qui tourne pour rien. Le coût est « celui de l'entreprise », pas celui de l'équipe.
3. **Gaspillage invisible** : Des serveurs surdimensionnés, des disques non utilisés ou des environnements de test laissés allumés la nuit coûtent cher sans apporter de valeur, et ce gaspillage reste invisible sans outil de suivi.

**Comment le FinOps résout ces problèmes** :

| Problème | Solution apportée par le FinOps |
| --- | --- |
| Coûts imprévisibles | Suivi en temps quasi réel, budgets et alertes |
| Dilution de la responsabilité | Attribution des coûts par équipe/projet grâce aux tags |
| Gaspillage invisible | Détection des ressources surdimensionnées ou inutilisées (rightsizing) |

**Analogie concrète** : Le FinOps, c'est comme la gestion du budget d'une colocation où chacun consomme de l'électricité. Sans suivi, la facture commune grimpe et personne ne fait attention. Avec le FinOps, on installe un compteur par chambre (les tags), chacun voit ce qu'il consomme, on repère le radiateur resté allumé toute la journée (gaspillage), et on choisit un abonnement adapté à la consommation réelle (le bon modèle d'achat).

**Ce que le FinOps n'est PAS** :

- Le FinOps n'est pas seulement « réduire les coûts ». C'est optimiser le rapport valeur/coût : parfois, dépenser plus pour aller plus vite est le bon choix. Le FinOps aide à décider en connaissance de cause.
- Le FinOps n'est pas la responsabilité d'une seule équipe finance. C'est une collaboration entre les équipes techniques, financières et métier.

---

### Les trois phases du FinOps : Inform, Optimize, Operate

**Définition** : Le FinOps s'organise en trois phases qui forment un cycle continu. On commence par rendre les coûts visibles (Inform), puis on les optimise (Optimize), puis on ancre les bonnes pratiques dans le fonctionnement quotidien (Operate). Le cycle recommence ensuite en boucle.

**Détail des trois phases** :

| Phase | Objectif | Activités typiques |
| --- | --- | --- |
| Inform (informer) | Donner de la visibilité sur les coûts | Tagging, tableaux de bord, allocation des coûts par équipe |
| Optimize (optimiser) | Réduire le gaspillage et le coût unitaire | Rightsizing, achat de Reserved Instances/Savings Plans, Spot, arrêt des ressources inutiles |
| Operate (opérer) | Ancrer les pratiques dans la durée | Budgets, alertes, gouvernance, revues régulières, automatisation |

**Pourquoi un cycle et non une étape unique** :

Le cloud évolue en permanence (nouveaux services, nouveaux besoins, nouveaux tarifs). Une optimisation faite aujourd'hui peut devenir obsolète demain. Les trois phases tournent donc en boucle : on informe, on optimise, on opère, puis on réévalue.

```text
Inform  ->  Optimize  ->  Operate
   ^                          |
   |__________________________|
        (cycle continu)
```

**Analogie concrète** : C'est comme entretenir sa forme physique. D'abord on mesure (Inform : poids, fréquence cardiaque). Ensuite on agit (Optimize : régime, sport). Enfin on installe une routine durable (Operate : habitudes hebdomadaires). On ne mesure pas une seule fois : on recommence le cycle régulièrement.

---

### Les cost allocation tags

**Définition** : Un cost allocation tag est une étiquette (paire clé/valeur) attachée à une ressource cloud, qui permet de répartir les coûts par équipe, projet, environnement ou centre de coût. C'est le fondement de la phase Inform : sans tags, impossible de savoir qui dépense quoi.

**Le problème que les tags résolvent** :

Sans tags, la facture cloud est un total global indifférencié. On voit qu'on a dépensé 10 000 euros, mais pas si c'est l'équipe A ou l'environnement de test qui en est responsable. Impossible alors d'agir de façon ciblée.

**Exemples de tags utiles** :

| Clé du tag | Valeur exemple | Usage |
| --- | --- | --- |
| `Environment` | `prod`, `staging`, `dev` | Séparer les coûts par environnement |
| `Team` | `paiement`, `mobile` | Attribuer les coûts à une équipe |
| `Project` | `refonte-site` | Suivre le coût d'un projet |
| `CostCenter` | `CC-4012` | Rattacher à un centre de coût comptable |

**Règle d'or** : définir une convention de tags **dès le début**, et l'imposer (par exemple via une politique qui refuse les ressources non taguées). Activer ensuite ces tags comme « cost allocation tags » dans la console de facturation pour qu'ils apparaissent dans les rapports de coûts.

**Ce que les tags ne sont PAS** :

- Un tag n'est pas rétroactif pour la facturation : un tag activé aujourd'hui n'apparaît dans les rapports de coûts qu'à partir de son activation, pas pour le passé.
- Un tag n'est pas une simple description libre. Pour le FinOps, il doit suivre une convention stricte, sinon les rapports sont inexploitables (`team=Paiement` et `team=paiement` seraient comptés séparément).

---

### Les modèles d'achat du compute

**Définition** : Le cloud propose plusieurs façons de payer la même puissance de calcul. Le choix du modèle a un impact majeur sur la facture : pour une charge identique, l'écart de prix entre deux modèles peut dépasser 70 %.

**Les quatre modèles principaux (AWS)** :

| Modèle | Principe | Réduction typique | Cas d'usage |
| --- | --- | --- | --- |
| À la demande (On-Demand) | Paiement à l'heure/seconde, sans engagement | 0 % (prix de référence) | Charges imprévisibles, courte durée, tests |
| Reserved Instances (RI) | Engagement 1 ou 3 ans sur un type d'instance précis | jusqu'à ~72 % (Standard RI, 3 ans All Upfront) | Charges stables et prévisibles |
| Savings Plans | Engagement 1 ou 3 ans sur un montant horaire de dépense | jusqu'à ~72 % | Charges stables, mais plus flexible que les RI |
| Spot | Capacité inutilisée d'AWS, prix variable, interruptible | jusqu'à ~90 % | Charges tolérantes aux interruptions |

**Détail des Reserved Instances** :

Une Reserved Instance est un engagement à utiliser un certain type d'instance pendant 1 ou 3 ans, en échange d'une forte réduction. La contrepartie est la rigidité : la réduction s'applique à un type d'instance et une région donnés.

**Détail des Savings Plans** :

Un Savings Plan est un engagement non pas sur un type d'instance, mais sur un montant de dépense horaire (par exemple 10 USD/heure de compute) pendant 1 ou 3 ans. Il est plus souple : la réduction s'applique automatiquement aux instances utilisées, même si on change de type ou de région (selon le type de plan).

**Détail des instances Spot** :

Les instances Spot utilisent la capacité inutilisée d'AWS, vendue à prix réduit. En contrepartie, AWS peut les **interrompre** avec un préavis court (2 minutes) si elle a besoin de la capacité. Elles conviennent aux traitements qui peuvent être interrompus et repris : calcul par lots, rendu, tests, traitements de données.

**Comparaison RI vs Savings Plans vs Spot** :

| Critère | Reserved Instances | Savings Plans | Spot |
| --- | --- | --- | --- |
| Engagement | 1 ou 3 ans, type fixé | 1 ou 3 ans, montant USD/h | Aucun |
| Flexibilité | Faible | Moyenne à élevée | Élevée (mais interruptible) |
| Risque d'interruption | Non | Non | Oui (préavis 2 min) |
| Réduction max | ~72 % | ~72 % | ~90 % |

**Ce que les modèles d'achat ne sont PAS** :

- Un engagement (RI ou Savings Plan) n'est pas un remboursement si tu n'utilises pas la capacité : tu paies l'engagement même inutilisé. Il ne faut s'engager que sur la part stable et certaine de la charge.
- Une instance Spot n'est pas une instance « moins puissante ». C'est exactement la même machine ; seule la garantie de disponibilité change.

---

### Le rightsizing

**Définition** : Le rightsizing (dimensionnement au juste niveau) consiste à ajuster la taille des ressources (CPU, mémoire, type d'instance, taille de disque) à leur usage réel, afin de ne pas payer pour de la capacité inutilisée.

**Le problème que le rightsizing résout** :

Par prudence ou par habitude, on provisionne souvent des ressources trop grandes : une instance à 16 Go de RAM qui n'en utilise jamais plus de 3, un disque de 500 Go rempli à 5 %. On paie alors pour de la capacité dormante.

**Comment faire du rightsizing** :

1. Observer les métriques d'usage réel sur une période représentative (CPU, mémoire, réseau, IOPS disque) via le monitoring (fiche 09).
2. Comparer l'usage réel à la capacité provisionnée.
3. Si l'usage est durablement faible, choisir une taille d'instance plus petite ou un disque plus modeste.
4. Vérifier après le changement que les performances restent acceptables.

**Exemple chiffré** :

| Situation | Instance | Coût mensuel approximatif |
| --- | --- | --- |
| Avant rightsizing | `m5.2xlarge` (8 vCPU, 32 Go), utilisée à 15 % | ~280 USD |
| Après rightsizing | `m5.large` (2 vCPU, 8 Go), utilisée à 60 % | ~70 USD |

Le redimensionnement divise ici le coût par quatre, tout en laissant une marge de capacité confortable.

**Ce que le rightsizing n'est PAS** :

- Le rightsizing n'est pas une réduction brutale à la plus petite taille possible. On garde une marge pour les pics. Sous-dimensionner dégrade les performances et peut coûter plus cher (incidents, lenteur).
- Le rightsizing n'est pas une action ponctuelle. Les besoins évoluent : c'est une activité récurrente de la phase Optimize.

---

### Budgets et alertes

**Définition** : Un budget cloud est un seuil de dépense (ou d'usage) défini à l'avance, assorti d'alertes qui préviennent quand on s'approche ou dépasse ce seuil. C'est l'outil central de la phase Operate : il transforme le suivi passif en garde-fou actif. Sur AWS, ce service s'appelle AWS Budgets.

**Le problème que les budgets résolvent** :

Sans budget ni alerte, on découvre un dépassement seulement à la réception de la facture, en fin de mois, quand il est trop tard pour réagir. Les budgets permettent d'être prévenu **pendant** le mois, dès qu'une tendance anormale apparaît.

**Types de budgets AWS** :

| Type de budget | Surveille | Exemple |
| --- | --- | --- |
| Budget de coût | Le montant dépensé | Alerte si la dépense mensuelle dépasse 500 USD |
| Budget d'usage | Une quantité consommée | Alerte si plus de 1000 heures d'instance |
| Budget de couverture RI/SP | Le taux de couverture des engagements | Alerte si moins de 80 % du compute est couvert |

**Bonnes pratiques d'alerte** :

- Définir plusieurs seuils (par exemple à 80 %, 100 % et 120 % du budget) pour réagir progressivement.
- Alerter aussi sur le **prévisionnel** (forecast) : être prévenu si la tendance actuelle laisse présager un dépassement en fin de mois.
- Diriger les alertes vers les bonnes personnes (l'équipe responsable du périmètre, pas une boîte mail générique).

**Ce que les budgets ne sont PAS** :

- Un budget AWS n'est pas un plafond qui coupe automatiquement les dépenses : par défaut, il **alerte** mais ne bloque rien. Couper des ressources demande une automatisation supplémentaire.
- Un budget n'est pas figé. On le révise quand l'activité change (lancement d'un produit, fin d'un projet).

---

## Étapes Pratiques

### Étape 1 : Taguer une ressource pour l'allocation des coûts

On ajoute des tags à une instance EC2 existante. Remplace l'identifiant par celui d'une de tes instances.

```bash
# Ajouter des tags d'allocation de coût à une instance EC2
aws ec2 create-tags \
  --resources i-0123456789abcdef0 \
  --tags Key=Environment,Value=prod Key=Team,Value=paiement Key=Project,Value=refonte-site
```

```bash
# Vérifier les tags appliqués
aws ec2 describe-tags \
  --filters "Name=resource-id,Values=i-0123456789abcdef0" \
  --query 'Tags[*].{Cle:Key,Valeur:Value}' \
  --output table
```

**Résultat attendu** :

```text
-------------------------------
|        DescribeTags         |
+--------------+--------------+
|     Cle      |   Valeur     |
+--------------+--------------+
|  Environment |  prod        |
|  Project     |  refonte-site|
|  Team        |  paiement    |
+--------------+--------------+
```

**Note** : Pour que ces tags apparaissent dans les rapports de coûts, il faut ensuite les activer comme « cost allocation tags » dans la console de facturation (section Billing > Cost allocation tags). L'activation n'agit que sur les coûts futurs.

---

### Étape 2 : Consulter les coûts par tag avec Cost Explorer

Le service Cost Explorer permet d'interroger les coûts. On peut regrouper les dépenses par tag pour voir la répartition.

```bash
# Coût du mois en cours, regroupé par valeur du tag "Team"
aws ce get-cost-and-usage \
  --time-period Start=2026-05-01,End=2026-05-31 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=TAG,Key=Team
```

**Résultat attendu** (extrait) :

```json
{
  "ResultsByTime": [
    {
      "TimePeriod": { "Start": "2026-05-01", "End": "2026-05-31" },
      "Groups": [
        {
          "Keys": ["Team$paiement"],
          "Metrics": { "UnblendedCost": { "Amount": "412.55", "Unit": "USD" } }
        },
        {
          "Keys": ["Team$mobile"],
          "Metrics": { "UnblendedCost": { "Amount": "188.20", "Unit": "USD" } }
        }
      ]
    }
  ]
}
```

Tu vois ici la dépense attribuée à chaque équipe grâce au tag `Team`. C'est exactement ce que permet la phase Inform.

---

### Étape 3 : Comparer les modèles d'achat sur un exemple

Calcule à la main l'économie d'un engagement par rapport au paiement à la demande, pour une instance qui tourne en continu toute l'année.

```text
Instance à la demande : 0,10 $/heure
Heures par an         : 24 x 365 = 8760 heures
Coût annuel à la demande : 8760 x 0,10 = 876 $

Même instance en Reserved Instance 1 an (réduction ~40 %) :
Coût annuel RI : 876 x (1 - 0,40) = 525,60 $

Économie annuelle : 876 - 525,60 = 350,40 $ (soit 40 %)
```

**Résultat attendu** :

```text
Modèle             | Coût annuel | Économie
-------------------|-------------|---------
À la demande       | 876,00 $    | référence
Reserved Instance  | 525,60 $    | 350,40 $ (40 %)
```

Conclusion : pour une charge **stable** qui tourne en continu, l'engagement est très rentable. Pour une charge intermittente, le paiement à la demande peut rester plus avantageux (on ne paie que l'usage réel).

---

### Étape 4 : Identifier une ressource à redimensionner (rightsizing)

On observe l'utilisation CPU moyenne d'une instance sur les 14 derniers jours via CloudWatch.

```bash
# Récupérer l'utilisation CPU moyenne d'une instance sur 14 jours
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-0123456789abcdef0 \
  --start-time 2026-05-13T00:00:00Z \
  --end-time 2026-05-27T00:00:00Z \
  --period 86400 \
  --statistics Average \
  --query 'Datapoints[*].{Jour:Timestamp,CPU:Average}' \
  --output table
```

**Résultat attendu** (extrait) :

```text
------------------------------------------
|         GetMetricStatistics            |
+--------+-------------------------------+
|  CPU   |            Jour               |
+--------+-------------------------------+
|  12.4  |  2026-05-13T00:00:00Z         |
|  14.1  |  2026-05-14T00:00:00Z         |
|  11.8  |  2026-05-15T00:00:00Z         |
+--------+-------------------------------+
```

Interprétation : une utilisation CPU durablement autour de 12 à 14 % indique une instance **surdimensionnée**. Tu peux envisager de passer à une taille inférieure (par exemple de `m5.2xlarge` à `m5.large`) et vérifier que les performances restent correctes.

---

### Étape 5 : Créer un budget mensuel avec alerte

On crée un budget de coût mensuel de 500 dollars, avec une alerte à 80 % de consommation.

```bash
# Définir le budget dans un fichier JSON
cat > /tmp/budget.json << 'EOF'
{
  "BudgetName": "budget-mensuel-prod",
  "BudgetLimit": { "Amount": "500", "Unit": "USD" },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
EOF
```

```bash
# Définir l'alerte : notifier par e-mail à 80 % de la consommation réelle
cat > /tmp/notifications.json << 'EOF'
[
  {
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [
      { "SubscriptionType": "EMAIL", "Address": "equipe-prod@example.com" }
    ]
  }
]
EOF
```

```bash
# Créer le budget avec son alerte
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws budgets create-budget \
  --account-id "$ACCOUNT_ID" \
  --budget file:///tmp/budget.json \
  --notifications-with-subscribers file:///tmp/notifications.json
```

```bash
# Vérifier que le budget existe
aws budgets describe-budgets \
  --account-id "$ACCOUNT_ID" \
  --query 'Budgets[*].{Nom:BudgetName,Limite:BudgetLimit.Amount}' \
  --output table
```

**Résultat attendu** :

```text
----------------------------------------
|           DescribeBudgets            |
+----------------------+---------------+
|        Limite        |      Nom      |
+----------------------+---------------+
|  500.0               |  budget-mensuel-prod |
+----------------------+---------------+
```

Désormais, dès que la dépense réelle du mois atteint 400 dollars (80 % de 500 dollars), l'équipe reçoit un e-mail d'alerte.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws ec2 create-tags --resources <id> --tags Key=K,Value=V` | Taguer une ressource pour l'allocation des coûts |
| `aws ce get-cost-and-usage ...` | Interroger les coûts (Cost Explorer) |
| `aws ce get-cost-and-usage --group-by Type=TAG,Key=<tag>` | Répartir les coûts par tag |
| `aws cloudwatch get-metric-statistics ...` | Obtenir l'usage réel d'une ressource (rightsizing) |
| `aws budgets create-budget ...` | Créer un budget avec alerte |
| `aws budgets describe-budgets --account-id <id>` | Lister les budgets existants |
| `aws ce get-savings-plans-purchase-recommendation` | Obtenir des recommandations de Savings Plans |

---

## Pièges Fréquents

### Piège 1 : Confondre FinOps et réduction des coûts à tout prix

⚠️ **Problème** : Tu coupes des ressources et tu refuses tout engagement pour minimiser la facture, mais les performances se dégradent et les équipes perdent du temps.

✅ **Solution** : Le FinOps optimise le rapport **valeur/coût**, pas le coût brut. Parfois, dépenser plus (instance plus grande, Savings Plan) crée plus de valeur (rapidité, fiabilité). Décide en fonction de la valeur métier, pas seulement du montant.

---

### Piège 2 : S'engager (RI/Savings Plan) sur une charge incertaine

⚠️ **Problème** : Tu achètes des Reserved Instances pour 3 ans, puis le projet est arrêté au bout de 6 mois. Tu paies l'engagement pour rien.

✅ **Solution** : N'engage que la part **stable et certaine** de ta charge (ce qui tourne en continu et durera). Couvre la part variable avec du paiement à la demande ou du Spot. Commence par des engagements 1 an avant de passer à 3 ans.

```text
Charge de base permanente   -> Reserved Instances / Savings Plans
Charge variable, incertaine -> À la demande
Charge interruptible        -> Spot
```

---

### Piège 3 : Utiliser des instances Spot pour une charge non interruptible

⚠️ **Problème** : Tu héberges une base de données critique sur des instances Spot pour économiser, et AWS interrompt l'instance avec 2 minutes de préavis : ton service tombe.

✅ **Solution** : Le Spot convient uniquement aux charges **tolérantes aux interruptions** (calcul par lots, rendu, tests, traitements reprenables). Ne mets jamais sur du Spot un service qui doit rester disponible en permanence sans reprise automatique.

---

### Piège 4 : Oublier que les tags ne sont pas rétroactifs

⚠️ **Problème** : Tu actives les cost allocation tags aujourd'hui et tu t'attends à voir la répartition des coûts du mois dernier. Les rapports restent vides pour le passé.

✅ **Solution** : L'activation d'un cost allocation tag n'agit que sur les coûts **futurs**. Définis et active ta convention de tags **dès le départ** d'un projet. Tu ne pourras pas reconstituer la répartition des périodes antérieures à l'activation.

---

### Piège 5 : Croire qu'un budget bloque automatiquement les dépenses

⚠️ **Problème** : Tu crées un budget de 500 dollars en pensant que les ressources seront coupées au-delà. La facture dépasse 500 dollars sans rien arrêter.

✅ **Solution** : Par défaut, AWS Budgets **alerte** mais ne bloque rien. Pour couper réellement des ressources au dépassement, il faut une automatisation (par exemple une action Budgets liée à une politique IAM restrictive, ou une fonction Lambda déclenchée par l'alerte).

---

## Checklist de Validation

- [ ] Je sais définir le FinOps et expliquer qu'il optimise la valeur, pas seulement le coût
- [ ] Je connais les trois phases Inform, Optimize, Operate et leur enchaînement en cycle
- [ ] Je sais taguer une ressource et expliquer le rôle des cost allocation tags
- [ ] Je distingue les quatre modèles d'achat (à la demande, RI, Savings Plans, Spot)
- [ ] Je sais sur quel type de charge appliquer un engagement et sur lequel utiliser du Spot
- [ ] Je sais identifier une ressource surdimensionnée à partir de ses métriques (rightsizing)
- [ ] Je sais créer un budget mensuel avec une alerte via AWS Budgets
- [ ] Je comprends qu'un budget alerte mais ne bloque pas par défaut

---

## Exercice Pratique

**Énoncé** : Une entreprise te confie l'analyse de son parc cloud. Tu dois recommander un modèle d'achat pour chaque charge, puis estimer une économie.

**Données du parc** :

| Charge | Profil d'usage |
| --- | --- |
| Site web de production | Tourne en continu 24/7 toute l'année, charge stable |
| Traitement de données nocturne | Calcul par lots, 2 heures par nuit, peut être interrompu et repris |
| Environnement de démonstration | Utilisé ponctuellement, quelques heures par semaine, imprévisible |

**Questions** :

1. Pour chaque charge, indique le modèle d'achat le plus adapté (à la demande, Reserved Instance/Savings Plan, ou Spot) et justifie en une phrase.
2. Le site de production tourne sur une instance à la demande à 0,20 USD/heure. Calcule son coût annuel à la demande, puis le coût avec une Reserved Instance offrant 50 % de réduction. Quelle est l'économie annuelle ?
3. Quel tag minimal recommanderais-tu pour distinguer ces trois charges dans les rapports de coûts ?

**Indications** :

- Charge stable permanente -> engagement. Charge interruptible -> Spot. Charge imprévisible et courte -> à la demande.
- Heures par an pour une charge 24/7 : 24 x 365 = 8760 heures.
- Pour la question 3, pense à un tag qui sépare par usage ou par environnement.

**Résultat attendu** : Trois recommandations justifiées, un calcul d'économie chiffré, et une convention de tag.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Question 1 : modèle d'achat par charge**

| Charge | Modèle recommandé | Justification |
| --- | --- | --- |
| Site web de production | Reserved Instance ou Savings Plan | Charge stable et permanente : l'engagement maximise la réduction sur une dépense certaine |
| Traitement de données nocturne | Spot | Calcul par lots interruptible et reprenable : le Spot offre jusqu'à 90 % de réduction sans risque pour le service |
| Environnement de démonstration | À la demande | Usage ponctuel et imprévisible : on ne paie que les heures réellement consommées, sans engagement |

**Question 2 : calcul de l'économie sur le site de production**

```text
Heures par an : 24 x 365 = 8760 heures

Coût à la demande :
8760 x 0,20 = 1752 $ par an

Coût en Reserved Instance (50 % de réduction) :
1752 x (1 - 0,50) = 876 $ par an

Économie annuelle :
1752 - 876 = 876 $ par an (soit 50 %)
```

Réponse : le coût annuel à la demande est de 1752 dollars. En Reserved Instance avec 50 % de réduction, il tombe à 876 dollars. L'économie annuelle est de 876 dollars.

**Question 3 : convention de tag**

Le tag minimal pertinent est un tag d'environnement ou d'usage, par exemple :

```text
Clé : Environment
Valeurs : prod (site web), batch (traitement nocturne), demo (environnement de démonstration)
```

Ce tag unique suffit à séparer les trois charges dans Cost Explorer (regroupement `--group-by Type=TAG,Key=Environment`). On peut l'enrichir avec un tag `Team` ou `Project` selon les besoins de l'organisation. L'essentiel est de définir cette convention **dès le départ** pour que les coûts soient correctement attribués dès le premier jour.

---

## Navigation

← Fiche précédente : **[12 - Infrastructure as Code avec AWS CDK](12-iac-aws-cdk.md)**

Tu as terminé le cursus Cloud. Tu maîtrises maintenant les fondamentaux du cloud computing d'AWS, du compute au serverless en passant par le stockage, le réseau, la sécurité IAM, l'Infrastructure as Code (Terraform et CDK) et la maîtrise des coûts avec le FinOps.

→ Cursus recommandé : **[CI/CD](../11-ci-cd/index.md)** - Automatise le déploiement de tes fonctions Lambda et de tes applications cloud avec GitHub Actions et GitLab CI
