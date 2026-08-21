---
tags:
  - Unix/Bash
  - Intermédiaire
  - Pratique
description: "Gestion des utilisateurs et groupes Unix"
estimated_time: "60 min"
fiche_number: 6
total_fiches: 10
cursus: "Unix/Bash"
id: "fundamentals.unix.gestion-utilisateurs"
course_id: "fundamentals.unix"
content_type: "lesson"
order: 6
---

# 06 - Gestion des utilisateurs et groupes

> **En bref** : À la fin de cette fiche, tu sauras créer et gérer des utilisateurs et des groupes, comprendre les fichiers système associés et configurer sudo. Lecture estimée : 60 min.

## Prérequis

- Fiche [05 - Processus et signaux](05-processus-signaux.md)
- Fiche [02 - Les permissions Unix](02-permissions.md) (les permissions user/group/others)
- Savoir utiliser `sudo` pour exécuter une commande en tant qu'administrateur

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des utilisateurs et des groupes, modifier leurs propriétés, comprendre les fichiers `/etc/passwd` et `/etc/shadow`, et configurer les droits d'administration avec `sudo` et `visudo`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un utilisateur Unix ?

**Définition** : Un utilisateur Unix est une identité sur le système, identifiée par un nom (login) et un numéro unique (UID - User ID). Chaque fichier, chaque processus appartient à un utilisateur.

**Le problème que la gestion des utilisateurs résout** :

Sans utilisateurs distincts, voici les problèmes rencontrés :

1. **Pas d'isolation** : Tout le monde partage les mêmes fichiers et peut tout modifier.

2. **Pas de responsabilité** : Impossible de savoir qui a fait quoi sur le système.

3. **Sécurité nulle** : Un programme malveillant lancé par n'importe qui peut tout détruire.

**Comment la gestion des utilisateurs résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas d'isolation | Chaque utilisateur a son propre dossier personnel et ses propres permissions |
| Pas de responsabilité | Les logs enregistrent quel utilisateur a exécuté quelle action |
| Sécurité nulle | Les permissions limitent ce que chaque utilisateur peut faire |

**Analogie concrète** : Un système Unix est comme un immeuble de bureaux. Chaque employé (utilisateur) a son propre bureau (dossier personnel), son propre badge (UID), et des accès limités aux salles (fichiers). Le concierge (root) a le passe-partout qui ouvre toutes les portes. Les équipes (groupes) partagent l'accès à certaines salles communes.

**Ce qu'un utilisateur n'est PAS** :

- Un utilisateur n'est pas forcément une personne physique. De nombreux utilisateurs sont des comptes techniques créés pour des services (exemple : `www-data` pour le serveur web, `postgres` pour la base de données).
- Un utilisateur n'est pas le mot de passe. L'utilisateur est l'identité, le mot de passe est le moyen d'authentification.

---

### Qu'est-ce qu'un groupe ?

**Définition** : Un groupe est un ensemble d'utilisateurs qui partagent des permissions communes. Chaque utilisateur a un groupe principal et peut appartenir à des groupes secondaires.

**Comparaison utilisateur vs groupe** :

| Utilisateur | Groupe |
| ----------- | ------ |
| Identité individuelle | Ensemble d'utilisateurs |
| UID unique | GID unique |
| Un seul groupe principal | Peut contenir plusieurs utilisateurs |
| Permissions individuelles | Permissions partagées |

**Exemple concret** :

```text
Utilisateurs : alice, bob, charlie
Groupe "dev" : alice, bob
Groupe "design" : bob, charlie

Un fichier avec permissions rw-rw---- et groupe "dev"
  → alice peut lire et écrire (membre de dev)
  → bob peut lire et écrire (membre de dev)
  → charlie ne peut pas y accéder (pas membre de dev)
```

---

### Le fichier /etc/passwd

**Définition** : Le fichier `/etc/passwd` contient la liste de tous les utilisateurs du système. Chaque ligne décrit un utilisateur.

**Format d'une ligne** :

```text
nom:x:UID:GID:commentaire:dossier_personnel:shell
```

**Exemple** :

```text
alex:x:1000:1000:Alex Martin:/home/alex:/bin/bash
```

**Explication des champs** :

| Champ | Valeur | Signification |
| ----- | ------ | ------------- |
| `alex` | nom | Nom de connexion |
| `x` | mot de passe | Indique que le mot de passe est dans `/etc/shadow` |
| `1000` | UID | Identifiant numérique de l'utilisateur |
| `1000` | GID | Identifiant numérique du groupe principal |
| `Alex Martin` | commentaire | Nom complet ou description |
| `/home/alex` | dossier | Dossier personnel |
| `/bin/bash` | shell | Shell de connexion |

**UID spéciaux** :

| UID | Signification |
| --- | ------------- |
| 0 | root (administrateur) |
| 1-999 | Comptes système (services) |
| 1000+ | Utilisateurs normaux |

---

### Le fichier /etc/shadow

**Définition** : Le fichier `/etc/shadow` contient les mots de passe chiffrés et les informations d'expiration. Seul root peut le lire.

**Format simplifié** :

```text
nom:mot_de_passe_chiffré:dernière_modification:min:max:avertissement:inactivité:expiration
```

**Pourquoi un fichier séparé ?** `/etc/passwd` doit être lisible par tous les utilisateurs (pour résoudre les noms). Stocker les mots de passe dans un fichier séparé (`/etc/shadow`) lisible uniquement par root protège les mots de passe chiffrés.

---

### Le fichier /etc/group

**Définition** : Le fichier `/etc/group` contient la liste de tous les groupes et leurs membres.

**Format** :

```text
nom_groupe:x:GID:membres
```

**Exemple** :

```text
dev:x:1001:alice,bob
design:x:1002:bob,charlie
sudo:x:27:alex
```

---

### Les commandes de gestion des utilisateurs

**Créer un utilisateur** :

| Commande | Action |
| -------- | ------ |
| `sudo useradd nom` | Crée un utilisateur (basique) |
| `sudo useradd -m nom` | Crée avec dossier personnel |
| `sudo useradd -m -s /bin/bash nom` | Crée avec dossier et shell Bash |
| `sudo adduser nom` | Version interactive (Debian/Ubuntu) |

**Modifier un utilisateur** :

| Commande | Action |
| -------- | ------ |
| `sudo usermod -aG groupe nom` | Ajoute l'utilisateur au groupe |
| `sudo usermod -s /bin/zsh nom` | Change le shell |
| `sudo usermod -d /home/nouveau nom` | Change le dossier personnel |
| `sudo usermod -l nouveau_nom ancien_nom` | Renomme l'utilisateur |

**Supprimer un utilisateur** :

| Commande | Action |
| -------- | ------ |
| `sudo userdel nom` | Supprime l'utilisateur (garde le dossier) |
| `sudo userdel -r nom` | Supprime l'utilisateur et son dossier |

**Gérer le mot de passe** :

| Commande | Action |
| -------- | ------ |
| `sudo passwd nom` | Définit le mot de passe |
| `passwd` | Change ton propre mot de passe |
| `sudo passwd -l nom` | Verrouille le compte |
| `sudo passwd -u nom` | Déverrouille le compte |

---

### Les commandes de gestion des groupes

| Commande | Action |
| -------- | ------ |
| `sudo groupadd nom_groupe` | Crée un groupe |
| `sudo groupdel nom_groupe` | Supprime un groupe |
| `sudo groupmod -n nouveau ancien` | Renomme un groupe |
| `groups nom_utilisateur` | Affiche les groupes d'un utilisateur |
| `id nom_utilisateur` | Affiche UID, GID et groupes |

---

### sudo et visudo

**Définition** : `sudo` (Superuser Do) permet à un utilisateur autorisé d'exécuter une commande en tant que root (administrateur).

**Le problème que sudo résout** :

Sans `sudo`, il faudrait se connecter directement en tant que root pour administrer le système. C'est dangereux car :

1. Toute commande s'exécute avec les privilèges maximaux (risque d'erreur fatale)
2. Pas de trace de qui a fait quoi
3. Le mot de passe root est partagé entre tous les administrateurs

**Comment sudo résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Privilèges permanents | sudo accorde les privilèges commande par commande |
| Pas de trace | sudo enregistre chaque commande dans les logs |
| Mot de passe partagé | Chaque administrateur utilise son propre mot de passe |

**visudo** :

`visudo` est la commande pour éditer en sécurité le fichier `/etc/sudoers` qui définit qui peut utiliser `sudo`.

```bash
sudo visudo
```

**Format du fichier sudoers** :

```text
# utilisateur  hôte=(identité)  commandes
alex    ALL=(ALL:ALL) ALL
```

Cette ligne signifie : l'utilisateur `alex` peut exécuter toutes les commandes sur tous les hôtes en tant que n'importe quel utilisateur.

**Donner accès sudo à un utilisateur** (méthode la plus simple) :

```bash
sudo usermod -aG sudo nom_utilisateur
```

---

## Étapes Pratiques

### Étape 1 : Examiner les utilisateurs existants

```bash
# Voir les utilisateurs du système
cat /etc/passwd

# Compter les utilisateurs
wc -l /etc/passwd

# Voir seulement les utilisateurs "humains" (UID >= 1000)
awk -F: '$3 >= 1000 {print $1, $3, $6}' /etc/passwd
```

**Résultat attendu** :

```text
alex 1000 /home/alex
```

---

### Étape 2 : Examiner tes informations

```bash
# Voir ton identité
whoami

# Voir tes UID, GID et groupes
id

# Voir les groupes auxquels tu appartiens
groups
```

**Résultat attendu** :

```text
alex
uid=1000(alex) gid=1000(alex) groups=1000(alex),27(sudo),100(users)
alex sudo users
```

---

### Étape 3 : Créer un utilisateur

```bash
# Créer un utilisateur avec dossier personnel et shell Bash
sudo useradd -m -s /bin/bash testuser

# Définir son mot de passe
sudo passwd testuser

# Vérifier la création
grep testuser /etc/passwd

# Vérifier le dossier personnel
ls -la /home/testuser/
```

**Résultat attendu** :

```text
testuser:x:1001:1001::/home/testuser:/bin/bash
```

---

### Étape 4 : Créer un groupe et y ajouter un utilisateur

```bash
# Créer un groupe
sudo groupadd developpeurs

# Vérifier la création
grep developpeurs /etc/group

# Ajouter testuser au groupe
sudo usermod -aG developpeurs testuser

# Vérifier les groupes de testuser
groups testuser
```

**Résultat attendu** :

```text
developpeurs:x:1002:
developpeurs:x:1002:testuser
testuser : testuser developpeurs
```

---

### Étape 5 : Tester les permissions par groupe

```bash
# Créer un dossier partagé pour le groupe
sudo mkdir /opt/projet-dev
sudo chown :developpeurs /opt/projet-dev
sudo chmod 770 /opt/projet-dev

# Vérifier les permissions
ls -ld /opt/projet-dev
```

**Résultat attendu** :

```text
drwxrwx--- 2 root developpeurs 4096 jan 15 10:30 /opt/projet-dev
```

---

### Étape 6 : Voir les connexions récentes

```bash
# Dernières connexions
last | head -10

# Connexions échouées (nécessite sudo)
sudo lastb | head -10

# Utilisateurs actuellement connectés
who
w
```

**Résultat attendu** :

```text
alex     pts/0        2024-01-15 10:30 (192.168.1.10)
```

---

### Étape 7 : Nettoyer l'utilisateur de test

```bash
# Supprimer l'utilisateur et son dossier
sudo userdel -r testuser

# Supprimer le groupe
sudo groupdel developpeurs

# Vérifier
grep testuser /etc/passwd
grep developpeurs /etc/group
```

**Résultat attendu** : Aucune sortie (les entrées ont été supprimées).

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `whoami` | Affiche ton nom d'utilisateur |
| `id` | Affiche UID, GID et groupes |
| `groups` | Liste tes groupes |
| `sudo useradd -m -s /bin/bash nom` | Crée un utilisateur |
| `sudo passwd nom` | Définit le mot de passe |
| `sudo usermod -aG groupe nom` | Ajoute au groupe |
| `sudo userdel -r nom` | Supprime utilisateur et dossier |
| `sudo groupadd nom` | Crée un groupe |
| `sudo groupdel nom` | Supprime un groupe |
| `sudo visudo` | Édite la configuration sudo |

---

## Pièges Fréquents

### Piège 1 : Oublier -a avec usermod -G

⚠️ **Problème** : `usermod -G groupe nom` remplace tous les groupes secondaires au lieu d'en ajouter un.

✅ **Solution** : Toujours utiliser `-aG` (append + Group).

```bash
# DANGEREUX : remplace tous les groupes secondaires
sudo usermod -G nouveau_groupe alice

# CORRECT : ajoute un groupe en conservant les autres
sudo usermod -aG nouveau_groupe alice
```

---

### Piège 2 : Oublier -m avec useradd

⚠️ **Problème** : Sans `-m`, le dossier personnel n'est pas créé. L'utilisateur ne peut pas se connecter correctement.

✅ **Solution** : Toujours utiliser `-m` pour créer le dossier personnel.

```bash
# Pas de dossier personnel créé
sudo useradd alice

# Dossier personnel créé automatiquement
sudo useradd -m alice
```

---

### Piège 3 : Modifier /etc/sudoers sans visudo

⚠️ **Problème** : Une erreur de syntaxe dans `/etc/sudoers` peut bloquer totalement l'accès sudo.

✅ **Solution** : Toujours utiliser `visudo` qui vérifie la syntaxe avant de sauvegarder.

```bash
# DANGEREUX : pas de vérification de syntaxe
sudo nano /etc/sudoers

# CORRECT : vérifie la syntaxe avant de sauvegarder
sudo visudo
```

---

### Piège 4 : Supprimer un utilisateur avec des processus actifs

⚠️ **Problème** : `userdel` échoue si l'utilisateur a des processus en cours.

✅ **Solution** : Arrêter les processus d'abord, puis supprimer.

```bash
# Trouver les processus de l'utilisateur
ps -u testuser

# Tuer tous ses processus (par propriétaire, pas par nom de processus)
sudo killall -u testuser

# Alternative portable (disponible sans installation supplémentaire)
sudo pkill -u testuser

# Puis supprimer
sudo userdel -r testuser
```

> **Note** : `killall nom` tue par **nom de processus** (ex : `killall firefox`). `killall -u utilisateur` tue par **propriétaire** - ce sont deux usages distincts. `pkill -u utilisateur` est plus portable.

---

## Checklist de Validation

- [ ] Je sais afficher mes informations utilisateur avec `whoami`, `id` et `groups`
- [ ] Je sais lire le fichier `/etc/passwd` et comprendre chaque champ
- [ ] Je sais créer un utilisateur avec `useradd -m -s /bin/bash`
- [ ] Je sais définir un mot de passe avec `passwd`
- [ ] Je sais créer un groupe avec `groupadd`
- [ ] Je sais ajouter un utilisateur à un groupe avec `usermod -aG`
- [ ] Je comprends le rôle de `sudo` et de `visudo`
- [ ] Je sais supprimer un utilisateur et un groupe

---

## Exercice Pratique

**Énoncé** : Crée une structure multi-utilisateurs pour un projet d'équipe.

**Indications** :

1. Crée deux utilisateurs : `dev1` et `dev2` (avec dossier personnel et shell Bash)
2. Crée un groupe `equipe-web`
3. Ajoute les deux utilisateurs au groupe `equipe-web`
4. Crée un dossier partagé `/opt/web-project` appartenant au groupe `equipe-web`
5. Configure les permissions pour que les membres du groupe puissent lire et écrire, mais pas les autres
6. Vérifie que la configuration est correcte
7. Nettoie tout (supprime les utilisateurs, le groupe, le dossier)

**Résultat attendu** :

```text
drwxrwx--- 2 root equipe-web 4096 jan 15 10:30 /opt/web-project
dev1 : dev1 equipe-web
dev2 : dev2 equipe-web
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Créer les utilisateurs
sudo useradd -m -s /bin/bash dev1
sudo useradd -m -s /bin/bash dev2
sudo passwd dev1
sudo passwd dev2

# 2. Créer le groupe
sudo groupadd equipe-web

# 3. Ajouter les utilisateurs au groupe
sudo usermod -aG equipe-web dev1
sudo usermod -aG equipe-web dev2

# 4. Créer le dossier partagé
sudo mkdir /opt/web-project

# 5. Configurer les permissions
sudo chown :equipe-web /opt/web-project
sudo chmod 770 /opt/web-project

# 6. Vérifier
ls -ld /opt/web-project
groups dev1
groups dev2

# 7. Nettoyer
sudo userdel -r dev1
sudo userdel -r dev2
sudo groupdel equipe-web
sudo rm -r /opt/web-project
```

**Sortie attendue des vérifications** :

```text
drwxrwx--- 2 root equipe-web 4096 jan 15 10:30 /opt/web-project
dev1 : dev1 equipe-web
dev2 : dev2 equipe-web
```

---

## Navigation

← Fiche précédente : **[Processus et signaux](05-processus-signaux.md)**

→ Fiche suivante : **[systemd et services](07-systemd-services.md)**
