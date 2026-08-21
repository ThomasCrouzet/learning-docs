---
tags:
  - Cloud
  - Intermédiaire
  - Concept
description: "Compute cloud : machines virtuelles (EC2, Compute Engine), conteneurs manages (ECS, Cloud Run) et serverless (Lambda)."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 13
cursus: "Cloud"
---

# 02 - Compute

> **En bref** : Tu découvriras les trois familles de compute cloud (machines virtuelles, conteneurs manages, serverless), tu apprendras a choisir le bon type d'instance et tu lanceras ta première VM sur AWS EC2. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Introduction au Cloud](01-introduction-cloud.md)
- Savoir utiliser Docker (images, conteneurs) - cursus [Docker](../01-docker/index.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lancer une machine virtuelle sur AWS EC2, comprendre les types d'instances, distinguer les trois familles de compute cloud et déployer une fonction serverless basique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le compute cloud ?

**Définition** : Le compute cloud désigne la puissance de calcul mise a disposition par un fournisseur cloud. C'est le composant qui execute ton code, qu'il s'agisse d'un serveur web, d'un traitement de données ou d'une API.

**Le problème que le compute cloud résout** :

Sans compute cloud, voici les problèmes rencontres :

1. **Achat de serveurs physiques** : Pour heberger une application, tu dois acheter un serveur, l'installer dans un datacenter, le brancher et le configurer. Cela prend des semaines et coûte des milliers d'euros.
2. **Sur-dimensionnement ou sous-dimensionnement** : Tu achetes un serveur pour supporter le pic de charge prévu. Le reste du temps, 80% de la puissance est inutilisee. Ou pire, ton serveur est trop petit et ton application est lente.
3. **Pas de redondance** : Si ton serveur tombe en panne, ton application est hors ligne le temps de la reparation.

**Comment le compute cloud résout ces problèmes** :

| Problème | Solution apportée par le compute cloud |
| --- | --- |
| Achat de serveurs physiques | Tu créés une VM en quelques secondes via la console ou le CLI. Pas de matériel a gérer |
| Sur/sous-dimensionnement | Tu changes la taille de ta VM a tout moment. L'auto-scaling ajoute ou retire des instances automatiquement |
| Pas de redondance | Tu deploies sur plusieurs zones de disponibilité. Si une zone tombe, les autres prennent le relais |

**Analogie concrète** : Le compute cloud, c'est comme la location de voitures. Au lieu d'acheter une voiture (serveur physique) que tu utilises 10% du temps, tu loues exactement le vehicule dont tu as besoin : une citadine pour les courses (petite instance), un utilitaire pour un demenagement (grosse instance), ou un taxi qui vient quand tu appelles (serverless).

**Ce que le compute cloud n'est PAS** :

- Le compute cloud n'est pas un simple hébergement mutualisé. Un hébergement partage met plusieurs sites sur un meme serveur sans isolation. Une VM cloud est un environnement isole avec des ressources garanties.
- Le compute cloud n'est pas forcément plus cher qu'un serveur physique. Pour des charges variables, le cloud est souvent moins cher car tu paies uniquement ce que tu consommes.

---

### Machines virtuelles (VMs)

**Définition** : Une machine virtuelle (VM) est un ordinateur simule par logiciel. Elle possède son propre processeur virtuel, sa mémoire, son disque et son système d'exploitation. Sur un meme serveur physique, plusieurs VMs fonctionnent de maniere isolée.

**Services VM par fournisseur** :

| Fournisseur | Service | Description |
| --- | --- | --- |
| AWS | EC2 (Elastic Compute Cloud) | Le service VM le plus utilise au monde |
| Azure | Virtual Machines | VMs intégrées a l'écosystème Microsoft |
| GCP | Compute Engine | VMs haute performance |

**Types d'instances** :

Les fournisseurs cloud proposent différents types d'instances optimises pour des usages spécifiques :

| Famille | Usage | Exemple AWS |
| --- | --- | --- |
| Général purpose | Applications web, microservices | t3.micro, m6i.large |
| Compute optimized | Calculs intensifs, encodage video | c6i.xlarge |
| Memory optimized | Bases de données en mémoire, caches | r6i.large |
| Storage optimized | Bases de données, data warehouses | i3.large |
| Accelerated computing | Machine learning, rendu 3D | p4d.24xlarge (GPU) |

**Convention de nommage AWS EC2** :

Le nom d'une instance suit le format `[famille][generation].[taille]` :

- `t3.micro` : famille **t** (général purpose, burstable), génération **3**, taille **micro** (2 vCPU, 1 Gio RAM)
- `m6i.large` : famille **m** (général purpose), génération **6**, processeur **Intel**, taille **large** (2 vCPU, 8 Go RAM)
- `c6i.xlarge` : famille **c** (compute optimized), génération **6**, processeur **Intel**, taille **xlarge** (4 vCPU, 8 Go RAM)

**Modèles de tarification** :

| Modèle | Description | Economie |
| --- | --- | --- |
| On-Demand | Paiement a la seconde, sans engagement | 0% (prix de référence) |
| Reserved Instances | Engagement 1 ou 3 ans | Jusqu'a -72% |
| Spot Instances | Capacite inutilisee, prix variable, peut être interrompu | Jusqu'a -90% |
| Savings Plans | Engagement sur un montant par heure | Jusqu'a -72% |

---

### Conteneurs manages

**Définition** : Un service de conteneurs manages execute tes conteneurs Docker sans que tu aies a gérer les serveurs sous-jacents. Tu fournis l'image Docker, le service se charge de l'exécuter, la scaler et la surveiller.

**Services de conteneurs manages par fournisseur** :

| Fournisseur | Service | Description |
| --- | --- | --- |
| AWS | ECS (Elastic Container Service) | Orchestration de conteneurs propre a AWS |
| AWS | Fargate | Exécution de conteneurs sans gérer de serveurs |
| Azure | Azure Container Instances (ACI) | Conteneurs a la demande |
| GCP | Cloud Run | Conteneurs serverless (facturation a la requête) |

**Comparaison VM vs conteneur manage** :

| Critère | VM (EC2) | Conteneur manage (ECS/Fargate) |
| --- | --- | --- |
| Temps de démarrage | 30-60 secondes | 5-15 secondes |
| Isolation | OS complet | Processus isole |
| Taille minimale | ~500 Mo (OS) | ~10 Mo (image legere) |
| Gestion OS | Toi (mises à jour, patches) | Fournisseur |
| Cas d'usage | Applications monolithiques, legacy | Microservices, applications cloud-native |

---

### Serverless

**Définition** : Le serverless (sans serveur) est un modèle d'exécution ou le fournisseur cloud gère entièrement l'infrastructure. Tu deploies uniquement du code (une fonction), et le fournisseur l'execute a la demande. Tu ne paies que le temps d'exécution réel de ton code.

**Le problème que le serverless résout** :

Sans serverless, meme pour une simple API qui reçoit 10 requêtes par jour, tu dois maintenir un serveur fonctionnant 24h/24 (et payer pour 24h/24).

**Comment le serverless résout ce problème** :

Avec le serverless, ton code ne tourne que quand une requête arrive. Entre deux requêtes, rien ne tourne et tu ne paies rien.

**Services serverless par fournisseur** :

| Fournisseur | Service | Langages supportes |
| --- | --- | --- |
| AWS | Lambda | Python, Node.js, Java, Go, .NET, Ruby |
| Azure | Azure Functions | C#, JavaScript, Python, Java, PowerShell |
| GCP | Cloud Functions | Node.js, Python, Go, Java, .NET, Ruby, PHP |

**Limites du serverless** :

- **Cold start** : la première exécution après une periode d'inactivite est plus lente (quelques centaines de millisecondes a quelques secondes)
- **Durée d'exécution limitée** : AWS Lambda impose un maximum de 15 minutes par exécution
- **État ephemere** : une fonction serverless ne conserve pas de données entre deux executions. Tu dois utiliser un service externe (base de données, cache) pour persister les données

**Comparaison des trois familles de compute** :

| Critère | VM | Conteneur manage | Serverless |
| --- | --- | --- | --- |
| Controle | Total | Partiel | Aucun |
| Scalabilite | Manuelle ou auto-scaling | Automatique | Automatique |
| Facturation | A la seconde (VM active) | A la seconde (conteneur actif) | A la requête + durée d'exécution |
| Démarrage | 30-60 s | 5-15 s | Cold start : 0.1-5 s |
| Maintenance | Toi (OS, patches) | Partielle | Aucune |
| Cas d'usage | Tout | Microservices | API, événements, taches courtes |

---

## Étapes Pratiques

### Étape 1 : Lancer une instance EC2

```bash
# Recuperer l'AMI Amazon Linux 2023 la plus recente pour ta region
# (les AMI ID hardcodes deviennent rapidement invalides)
AMI_ID=$(aws ssm get-parameters \
  --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \
  --query 'Parameters[0].Value' \
  --output text)

# Lancer une instance t3.micro avec Amazon Linux 2023
# (le Free Plan AWS a changé en 2025 : ne suppose pas que t3.micro est gratuit)
aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type t3.micro \
  --key-name ma-cle-ssh \
  --security-group-ids sg-xxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ma-premiere-vm}]' \
  --count 1
```

Avant de lancer cette commande, tu dois :

1. Créer une paire de clés SSH dans la console EC2 (**Key Pairs** puis **Create key pair**)
2. Utiliser un Security Group qui autorise le SSH (port 22)
3. Récupérer un AMI valide pour ta region (ne jamais copier un AMI ID d'un tutoriel : il est lie a une region et expire)

**Résultat attendu** :

```json
{
    "Instances": [
        {
            "InstanceId": "i-0abcdef1234567890",
            "InstanceType": "t3.micro",
            "State": {
                "Name": "pending"
            }
        }
    ]
}
```

---

### Étape 2 : Vérifier l'état de l'instance

```bash
# Verifier que l'instance est en cours d'execution
aws ec2 describe-instances \
  --instance-ids i-0abcdef1234567890 \
  --query "Reservations[0].Instances[0].{State:State.Name,IP:PublicIpAddress,Type:InstanceType}"
```

**Résultat attendu** :

```json
{
    "State": "running",
    "IP": "54.93.xxx.xxx",
    "Type": "t3.micro"
}
```

---

### Étape 3 : Se connecter a l'instance via SSH

```bash
# Se connecter a l'instance (remplace l'IP par celle de ton instance)
ssh -i ~/.ssh/ma-cle-ssh.pem ec2-user@54.93.xxx.xxx
```

Une fois connecte :

```bash
# Verifier les ressources de l'instance
cat /proc/cpuinfo | grep "model name" | head -1
free -h
df -h /
```

**Résultat attendu** :

```text
model name      : Intel(R) Xeon(R) ...
              total        used        free
Mem:           983Mi       150Mi       600Mi
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1      8.0G  1.5G  6.5G  19% /
```

---

### Étape 4 : Créer une fonction Lambda

```bash
# Creer un fichier avec le code de la fonction
cat > lambda_function.py << 'PYEOF'
import json

def lambda_handler(event, context):
    """Fonction Lambda simple qui retourne un message."""
    name = event.get("name", "monde")
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"Bonjour {name} depuis Lambda !"
        })
    }
PYEOF

# Creer l'archive ZIP requise par Lambda
zip function.zip lambda_function.py

# Creer la fonction Lambda (necessite un role IAM avec les permissions Lambda)
aws lambda create-function \
  --function-name ma-premiere-fonction \
  --runtime python3.12 \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::123456789012:role/lambda-basic-role
```

**Résultat attendu** :

```json
{
    "FunctionName": "ma-premiere-fonction",
    "Runtime": "python3.12",
    "State": "Active"
}
```

---

### Étape 5 : Tester la fonction Lambda

```bash
# Invoquer la fonction avec un evenement de test
aws lambda invoke \
  --function-name ma-premiere-fonction \
  --payload '{"name": "Thomas"}' \
  --cli-binary-format raw-in-base64-out \
  response.json

# Lire la reponse
cat response.json
```

**Résultat attendu** :

```json
{"statusCode": 200, "body": "{\"message\": \"Bonjour Thomas depuis Lambda !\"}"}
```

---

### Étape 6 : Nettoyer les ressources

```bash
# Terminer l'instance EC2 (attention : l'instance sera supprimee)
aws ec2 terminate-instances --instance-ids i-0abcdef1234567890

# Supprimer la fonction Lambda
aws lambda delete-function --function-name ma-premiere-fonction
```

**Résultat attendu** :

```text
L'instance passe a l'etat "shutting-down" puis "terminated".
La fonction Lambda est supprimee.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws ec2 run-instances` | Lancer une nouvelle instance EC2 |
| `aws ec2 describe-instances` | Lister les instances EC2 |
| `aws ec2 stop-instances` | Arreter une instance (sans la supprimer) |
| `aws ec2 start-instances` | Redémarrer une instance arretee |
| `aws ec2 terminate-instances` | Supprimer définitivement une instance |
| `aws lambda create-function` | Créer une fonction Lambda |
| `aws lambda invoke` | Executer une fonction Lambda |
| `aws lambda delete-function` | Supprimer une fonction Lambda |

---

## Pièges Fréquents

### Piège 1 : Oublier de terminer une instance EC2

**Problème** : Tu lances une instance pour tester et tu oublies de la terminer. Elle continue de tourner et de facturer. Une instance `t3.micro` hors Free Tier coûte de l'ordre de quelques euros a une dizaine d'euros par mois si elle tourne 24h/24 (selon la region).

**Solution** : Prends l'habitude de lister tes instances actives régulièrement et de terminer celles que tu n'utilises plus.

```bash
# Lister toutes les instances en cours d'execution
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query "Reservations[].Instances[].{ID:InstanceId,Name:Tags[?Key=='Name']|[0].Value,Type:InstanceType}"
```

### Piège 2 : Choisir un type d'instance trop gros

**Problème** : Tu choisis une instance `m5.xlarge` (4 vCPU, 16 Go RAM) pour un simple site statique. Tu paies 10 fois plus que nécessaire.

**Solution** : Commence toujours par la plus petite instance possible (`t3.micro` ou `t3.small`). Surveille l'utilisation CPU et mémoire. Augmente la taille uniquement si les métriques montrent un goulot d'etranglement.

### Piège 3 : Ignorer les cold starts Lambda

**Problème** : Ta fonction Lambda met 3 secondes a répondre après une periode d'inactivite. L'utilisateur percoit un temps de chargement anormal.

**Solution** : Utilise la fonctionnalité **Provisioned Concurrency** pour garder un nombre minimum d'instances prechauffees. Cette option a un coût supplémentaire, utilise-la uniquement pour les fonctions critiques en temps de réponse.

---

## Checklist de Validation

- [ ] Je sais distinguer VM, conteneur manage et serverless
- [ ] Je connais les types d'instances EC2 et je sais choisir le bon type
- [ ] Je sais lancer et terminer une instance EC2 via le CLI
- [ ] Je sais créer et invoquer une fonction Lambda
- [ ] Je comprends les modèles de tarification (On-Demand, Reserved, Spot)
- [ ] Je sais nettoyer mes ressources pour éviter la surfacturation

---

## Exercice Pratique

**Énoncé** : Tu dois heberger trois applications différentes. Pour chacune, choisis le type de compute le plus adapte (VM, conteneur manage ou serverless) et justifie ton choix.

Applications :

1. Une API REST qui reçoit en moyenne 5 requêtes par minute et chaque requête se traite en moins de 2 secondes
2. Un serveur de jeu video multijoueur qui maintient des connexions WebSocket permanentes avec 200 joueurs simultanement
3. Un pipeline de traitement d'images qui est déclenche quand un utilisateur uploade une photo

**Indications** :

- Pense au pattern de trafic : est-il constant ou par pics ?
- Pense a la durée de vie des connexions : courte (requête/réponse) ou longue (WebSocket) ?
- Pense au coût : payes-tu pour du temps inutilise ?

**Résultat attendu** : Un tableau avec les colonnes Application, Type de compute, Justification.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

| Application | Type de compute | Justification |
| --- | --- | --- |
| API REST (5 req/min) | **Serverless** (Lambda) | Le trafic est faible et intermittent. Avec une VM, tu paierais 24h/24 pour 5 requêtes par minute. Avec Lambda, tu ne paies que les quelques millisecondes d'exécution par requête. Le coût est quasi nul. |
| Serveur de jeu (WebSocket) | **VM** (EC2) ou **conteneur** long-running | Un serveur de jeu qui maintient des milliers de sockets ouverts en continu reste mieux sur VM/conteneur (état local, latence, durée illimitée). Lambda + API Gateway WebSocket peut traiter des messages ponctuels, mais n'est pas le bon modèle pour un game server qui garde la session joueur en mémoire 24h/24. Lambda reste limité a 15 minutes par invocation. |
| Traitement d'images | **Serverless** (Lambda) ou **Conteneur manage** (Fargate) | Le traitement est déclenche par un événement (upload) et de courte durée. Lambda est idéal pour ce cas. Si le traitement est plus long ou plus complexe, un conteneur Fargate est preferable car Lambda est limite a 15 minutes. |

---

## Navigation

← Fiche précédente : **[01 - Introduction au Cloud](01-introduction-cloud.md)**

→ Fiche suivante : **[03 - Stockage](03-cloud-stockage.md)**
