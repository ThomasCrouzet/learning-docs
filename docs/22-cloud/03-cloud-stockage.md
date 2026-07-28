---
tags:
  - Cloud
  - Intermédiaire
  - Concept
description: "Stockage cloud : object storage (S3), block storage (EBS), file storage, classes de stockage et lifecycle policies."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 13
cursus: "Cloud"
---

# 03 - Stockage

> **En bref** : Tu découvriras les trois types de stockage cloud (objet, bloc, fichier), tu apprendras a utiliser Amazon S3 pour stocker et récupérer des fichiers, et tu configureras les classes de stockage et les règles de cycle de vie pour optimiser les coûts. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [02 - Compute](02-cloud-compute.md)
- Avoir un compte AWS configure avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))

## Objectif de cette fiche

A la fin de cette fiche, tu sauras distinguer les trois types de stockage cloud, créer un bucket S3, uploader et telecharger des fichiers, et configurer des règles de cycle de vie pour réduire les coûts.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le stockage cloud ?

**Définition** : Le stockage cloud est un service qui permet de stocker des données sur des serveurs distants geres par un fournisseur cloud. Les données sont accessibles via Internet, repliquees sur plusieurs serveurs pour garantir leur disponibilité, et facturees en fonction du volume stocke et des opérations effectuées.

**Le problème que le stockage cloud résout** :

Sans stockage cloud, voici les problèmes rencontres :

1. **Capacite limitée** : Ton disque dur a une taille fixe. Quand il est plein, tu dois acheter un nouveau disque, le formater et migrer les données.
2. **Risque de perte** : Si ton disque tombe en panne sans sauvegarde, tes données sont perdues définitivement.
3. **Accès restreint** : Les fichiers sur un serveur local ne sont accessibles que depuis le réseau local. Un collaborateur distant ne peut pas y accéder.

**Comment le stockage cloud résout ces problèmes** :

| Problème | Solution apportée par le stockage cloud |
| --- | --- |
| Capacite limitée | Le stockage cloud est virtuellement illimité. Tu ajoutes des données sans te soucier de la taille du disque |
| Risque de perte | Les données sont repliquees automatiquement sur plusieurs serveurs dans des datacenters différents |
| Accès restreint | Les données sont accessibles via Internet depuis n'importe ou, avec un controle d'accès fin |

**Analogie concrète** : Le stockage cloud, c'est comme un garde-meuble. Au lieu d'empiler tes affaires dans ton garage (disque local), tu les stockes dans un entrepot sécurisé (cloud). L'entrepot est surveille 24h/24 (haute disponibilité), tes affaires sont dupliquees dans un autre entrepot en cas d'incendie (replication), et tu peux y accéder quand tu veux avec ta clé (authentification).

**Ce que le stockage cloud n'est PAS** :

- Le stockage cloud n'est pas un disque dur distant. Un disque dur a une taille fixe et un seul point d'accès. Le stockage cloud est distribue, replique et elastique.
- Le stockage cloud n'est pas gratuit. Le Free Tier offre un volume limite (5 Go sur S3). Au-delà, chaque Go stocke et chaque requête sont factures.

---

### Les trois types de stockage cloud

**Object storage (stockage objet)** :

Le stockage objet organise les données sous forme d'objets plats dans des conteneurs appelés "buckets". Chaque objet est constitue de trois éléments : les données (le fichier), des metadonnees (informations sur le fichier) et une clé unique (le nom du fichier).

Caractéristiques :

- Pas de hiérarchie de dossiers (les "dossiers" sont simules par des prefixes dans la clé)
- Accès via HTTP/HTTPS (API REST)
- Idéal pour les fichiers statiques : images, videos, sauvegardes, logs

Services par fournisseur :

| Fournisseur | Service | Capacite max par objet |
| --- | --- | --- |
| AWS | S3 (Simple Storage Service) | 5 To |
| Azure | Blob Storage | 4.75 To |
| GCP | Cloud Storage | 5 To |

**Block storage (stockage bloc)** :

Le stockage bloc decoupe les données en blocs de taille fixe, comme un disque dur classique. Il est attache a une instance de machine virtuelle et se comporte comme un disque physique.

Caractéristiques :

- Performances élevées (faible latence, haut débit)
- Attache a une seule VM a la fois
- Idéal pour les bases de données, les systèmes de fichiers, les applications necessitant des I/O rapides

Services par fournisseur :

| Fournisseur | Service | Cas d'usage |
| --- | --- | --- |
| AWS | EBS (Elastic Block Store) | Disques pour EC2 |
| Azure | Managed Disks | Disques pour VMs Azure |
| GCP | Persistent Disks | Disques pour Compute Engine |

**File storage (stockage fichier)** :

Le stockage fichier fournit un système de fichiers partage accessible par plusieurs machines simultanement via des protocoles réseau (NFS, SMB).

Caractéristiques :

- Hiérarchie de dossiers classique
- Accès simultane depuis plusieurs VMs
- Idéal pour le partage de fichiers entre applications, les répertoires utilisateurs

Services par fournisseur :

| Fournisseur | Service | Protocole |
| --- | --- | --- |
| AWS | EFS (Elastic File System) | NFS |
| Azure | Azure Files | SMB, NFS |
| GCP | Filestore | NFS |

**Comparaison des trois types** :

| Critère | Object storage | Block storage | File storage |
| --- | --- | --- | --- |
| Accès | HTTP/API | Attache a une VM | Protocole réseau (NFS/SMB) |
| Performance | Bonne (débit) | Excellente (latence) | Bonne |
| Partage | Oui (via URL) | Non (1 VM) | Oui (plusieurs VMs) |
| Coût/Go | Le moins cher | Le plus cher | Intermédiaire |
| Cas d'usage | Fichiers statiques, backups | BDD, OS disque | Partage de fichiers |

---

### Classes de stockage S3

**Définition** : Les classes de stockage définissent le niveau de disponibilité, de performance et de coût du stockage. Plus tes données sont accedees fréquemment, plus tu choisis une classe performante (et chere). Moins elles sont accedees, plus tu choisis une classe économique.

| Classe | Accès | Disponibilite | Coût stockage | Coût accès |
| --- | --- | --- | --- | --- |
| S3 Standard | Frequent | 99.99% | `$$$` | `$` |
| S3 Intelligent-Tiering | Variable | 99.9% | `$$`-`$$$` | `$` |
| S3 Standard-IA | Peu frequent | 99.9% | `$$` | `$$` |
| S3 One Zone-IA | Peu frequent | 99.5% | `$` | `$$` |
| S3 Glacier Instant | Archive, accès rare | 99.9% | `$` | `$$$` |
| S3 Glacier Flexible | Archive, accès très rare | 99.99% | `¢` | `$$$$` |
| S3 Glacier Deep Archive | Archive long terme | 99.99% | `¢` | `$$$$$` |

**Règles de choix** :

- Données accedees quotidiennement : **S3 Standard**
- Données accedees quelques fois par mois : **S3 Standard-IA**
- Données dont le pattern d'accès est imprevisible : **S3 Intelligent-Tiering**
- Données de sauvegarde accedees rarement : **S3 Glacier Flexible**
- Archives réglementaires conservees 7-10 ans : **S3 Glacier Deep Archive**

---

### Lifecycle policies (règles de cycle de vie)

**Définition** : Une lifecycle policy est une règle automatique qui deplace tes objets vers une classe de stockage moins chere ou les supprime après une periode définie. Cela te permet de réduire les coûts sans intervention manuelle.

Exemple de cycle de vie typique :

```text
Jour 0      : Upload dans S3 Standard (acces frequent)
Jour 30     : Transition vers S3 Standard-IA (acces peu frequent)
Jour 90     : Transition vers S3 Glacier Flexible (archivage)
Jour 365    : Suppression automatique
```

---

## Étapes Pratiques

### Étape 1 : Creer un bucket S3

```bash
# Creer un bucket S3 (le nom doit etre unique au monde)
aws s3 mb s3://mon-premier-bucket-cloud-2025

# Verifier que le bucket existe
aws s3 ls
```

**Résultat attendu** :

```text
make_bucket: mon-premier-bucket-cloud-2025
2025-01-15 10:30:00 mon-premier-bucket-cloud-2025
```

---

### Étape 2 : Uploader des fichiers

```bash
# Creer un fichier de test
echo "Bonjour depuis le cloud !" > test.txt

# Uploader le fichier dans le bucket
aws s3 cp test.txt s3://mon-premier-bucket-cloud-2025/

# Uploader un dossier entier
mkdir -p mon-dossier
echo "Fichier 1" > mon-dossier/fichier1.txt
echo "Fichier 2" > mon-dossier/fichier2.txt
aws s3 cp mon-dossier/ s3://mon-premier-bucket-cloud-2025/mon-dossier/ --recursive
```

**Résultat attendu** :

```text
upload: ./test.txt to s3://mon-premier-bucket-cloud-2025/test.txt
upload: mon-dossier/fichier1.txt to s3://mon-premier-bucket-cloud-2025/mon-dossier/fichier1.txt
upload: mon-dossier/fichier2.txt to s3://mon-premier-bucket-cloud-2025/mon-dossier/fichier2.txt
```

---

### Étape 3 : Lister et telecharger des fichiers

```bash
# Lister les objets dans le bucket
aws s3 ls s3://mon-premier-bucket-cloud-2025/ --recursive

# Telecharger un fichier
aws s3 cp s3://mon-premier-bucket-cloud-2025/test.txt ./test-telecharge.txt

# Telecharger un dossier entier
aws s3 cp s3://mon-premier-bucket-cloud-2025/mon-dossier/ ./telecharge/ --recursive

# Verifier le contenu telecharge
cat test-telecharge.txt
```

**Résultat attendu** :

```text
2025-01-15 10:31:00         27 test.txt
2025-01-15 10:31:00         10 mon-dossier/fichier1.txt
2025-01-15 10:31:00         10 mon-dossier/fichier2.txt
download: s3://mon-premier-bucket-cloud-2025/test.txt to ./test-telecharge.txt
Bonjour depuis le cloud !
```

---

### Étape 4 : Configurer une lifecycle policy

Créé un fichier de configuration JSON pour la politique de cycle de vie :

```bash
# Creer le fichier de configuration
cat > lifecycle.json << 'EOF'
{
    "Rules": [
        {
            "ID": "transition-vers-glacier",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "logs/"
            },
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 90,
                    "StorageClass": "GLACIER"
                }
            ],
            "Expiration": {
                "Days": 365
            }
        }
    ]
}
EOF

# Appliquer la politique au bucket
aws s3api put-bucket-lifecycle-configuration \
  --bucket mon-premier-bucket-cloud-2025 \
  --lifecycle-configuration file://lifecycle.json

# Verifier la politique
aws s3api get-bucket-lifecycle-configuration \
  --bucket mon-premier-bucket-cloud-2025
```

**Résultat attendu** :

```json
{
    "Rules": [
        {
            "ID": "transition-vers-glacier",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "logs/"
            },
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 90,
                    "StorageClass": "GLACIER"
                }
            ],
            "Expiration": {
                "Days": 365
            }
        }
    ]
}
```

---

### Étape 5 : Activer le versioning

Le versioning conserve toutes les versions d'un fichier. Si tu ecrases ou supprimes un fichier par erreur, tu peux récupérer une version précédente.

```bash
# Activer le versioning sur le bucket
aws s3api put-bucket-versioning \
  --bucket mon-premier-bucket-cloud-2025 \
  --versioning-configuration Status=Enabled

# Verifier l'etat du versioning
aws s3api get-bucket-versioning --bucket mon-premier-bucket-cloud-2025

# Uploader deux versions du meme fichier
echo "Version 1" > test.txt
aws s3 cp test.txt s3://mon-premier-bucket-cloud-2025/

echo "Version 2" > test.txt
aws s3 cp test.txt s3://mon-premier-bucket-cloud-2025/

# Lister les versions
aws s3api list-object-versions \
  --bucket mon-premier-bucket-cloud-2025 \
  --prefix test.txt
```

**Résultat attendu** :

```json
{
    "Versions": [
        {
            "Key": "test.txt",
            "VersionId": "abc123",
            "IsLatest": true,
            "LastModified": "2025-01-15T10:35:00.000Z"
        },
        {
            "Key": "test.txt",
            "VersionId": "def456",
            "IsLatest": false,
            "LastModified": "2025-01-15T10:31:00.000Z"
        }
    ]
}
```

---

### Étape 6 : Nettoyer les ressources

```bash
# Supprimer tous les objets du bucket
aws s3 rm s3://mon-premier-bucket-cloud-2025/ --recursive

# Supprimer le bucket (doit etre vide)
aws s3 rb s3://mon-premier-bucket-cloud-2025
```

**Résultat attendu** :

```text
delete: s3://mon-premier-bucket-cloud-2025/test.txt
delete: s3://mon-premier-bucket-cloud-2025/mon-dossier/fichier1.txt
delete: s3://mon-premier-bucket-cloud-2025/mon-dossier/fichier2.txt
remove_bucket: mon-premier-bucket-cloud-2025
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws s3 mb s3://nom` | Creer un bucket |
| `aws s3 rb s3://nom` | Supprimer un bucket vide |
| `aws s3 ls` | Lister les buckets |
| `aws s3 ls s3://nom/` | Lister les objets d'un bucket |
| `aws s3 cp fichier s3://nom/` | Uploader un fichier |
| `aws s3 cp s3://nom/fichier .` | Telecharger un fichier |
| `aws s3 rm s3://nom/fichier` | Supprimer un objet |
| `aws s3 sync dossier/ s3://nom/` | Synchroniser un dossier avec un bucket |

---

## Pièges Frequents

### Piège 1 : Rendre un bucket public par erreur

**Problème** : Tu configures un bucket S3 en accès public pour servir des fichiers statiques, mais tu y stockes aussi des fichiers sensibles (logs, sauvegardes de base de données). N'importe qui peut les telecharger.

**Solution** : Depuis 2023, AWS bloque l'accès public par défaut sur les nouveaux buckets. Ne desactive jamais ce blocage sauf si tu comprends exactement les conséquences. Utilise CloudFront (CDN) devant S3 pour servir des fichiers publics en gardant le bucket prive.

### Piège 2 : Ignorer les coûts de requêtes S3

**Problème** : Le stockage S3 est bon marche (environ 0,023 USD/Go/mois en Standard), mais chaque requête est facturee. 1 million de requêtes GET coûtent environ 0,40 dollar. Si une application genere des millions de requêtes, la facture peut exploser.

**Solution** : Utilise un CDN (CloudFront) devant S3 pour les fichiers accedes fréquemment. Le CDN met en cache les fichiers et réduit le nombre de requêtes vers S3.

### Piège 3 : Oublier le versioning avant de supprimer

**Problème** : Tu supprimes un fichier important dans un bucket sans versioning. Le fichier est perdu définitivement.

**Solution** : Active le versioning sur tous les buckets contenant des données importantes. Avec le versioning, une suppression ajoute simplement un "delete marker" et tu peux récupérer le fichier.

---

## Checklist de Validation

- [ ] Je distingue les trois types de stockage (objet, bloc, fichier)
- [ ] Je sais créer un bucket S3 et uploader des fichiers
- [ ] Je connais les classes de stockage S3 et leurs cas d'usage
- [ ] Je sais configurer une lifecycle policy
- [ ] Je sais activer et utiliser le versioning
- [ ] Je sais nettoyer mes ressources (suppression du bucket)

---

## Exercice Pratique

**Enonce** : Tu geres une application qui genere trois types de fichiers. Propose une stratégie de stockage S3 pour chaque type.

Types de fichiers :

1. **Photos de profil** : images JPEG de 200 Ko, accedees des dizaines de fois par jour par les utilisateurs
2. **Logs d'application** : fichiers texte de 50 Mo, consultes uniquement en cas de problème (quelques fois par mois)
3. **Rapports annuels** : documents PDF de 5 Mo, generes une fois par an, conserves 10 ans pour conformité réglementaire

Pour chaque type, indique :

- La classe de stockage initiale
- La lifecycle policy recommandée
- Le versioning (active ou non)

**Indications** :

- Plus un fichier est accede souvent, plus sa classe de stockage doit être performante
- Les fichiers archives a long terme doivent aller vers Glacier
- Le versioning est utile pour les fichiers qui peuvent être modifies ou supprimes par erreur

**Résultat attendu** : Un tableau avec les colonnes Type, Classe initiale, Lifecycle, Versioning.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

| Type | Classe initiale | Lifecycle | Versioning |
| --- | --- | --- | --- |
| Photos de profil | S3 Standard | Aucune transition (accès frequent permanent) | Oui (pour récupérer une ancienne photo si l'utilisateur ecrase la sienne) |
| Logs d'application | S3 Standard | J+7 vers Standard-IA, J+30 vers Glacier Flexible, J+90 suppression | Non (les logs ne sont pas modifies, ils sont en append-only) |
| Rapports annuels | S3 Standard-IA | J+30 vers Glacier Deep Archive, expiration après 3650 jours (10 ans) | Oui (pour conserver toutes les versions en cas de modification) |

Explications :

- **Photos de profil** : Accedees quotidiennement, elles restent en S3 Standard. Le versioning permet de revenir a une ancienne photo si l'utilisateur fait une erreur.
- **Logs d'application** : Utiles uniquement en cas de problème. Après une semaine, ils passent en Standard-IA (moins cher, accès rare). Après un mois, en Glacier. Après 3 mois, ils sont supprimes.
- **Rapports annuels** : Generes rarement mais conserves longtemps. Le Deep Archive est la classe la moins chere pour du stockage long terme (environ 0,00099 USD/Go/mois).

---

## Navigation

← Fiche précédente : **[02 - Compute](02-cloud-compute.md)**

→ Fiche suivante : **[04 - Réseau cloud](04-cloud-reseau.md)**
