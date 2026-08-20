---
tags:
  - Unix/Bash
  - Débutant
  - Pratique
description: "Le système de fichiers Unix/Linux"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 10
cursus: "Unix/Bash"
---

# 01 - Le système de fichiers Unix/Linux

> **En bref** : À la fin de cette fiche, tu sauras naviguer dans l'arborescence des fichiers Unix/Linux et comprendre les chemins absolus et relatifs. Lecture estimée : 55 min.


## Prérequis

- Savoir ouvrir un terminal sur ton ordinateur
- Aucune connaissance préalable d'Unix n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras naviguer dans l'arborescence des fichiers Unix/Linux et comprendre les chemins absolus et relatifs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le système de fichiers Unix ?

**Définition** : Le système de fichiers Unix est une structure hiérarchique en arbre qui organise tous les fichiers et dossiers de l'ordinateur à partir d'une racine unique `/`.

**Le problème que le système de fichiers résout** :

Sans organisation hiérarchique, voici les problèmes rencontrés :

1. **Fichiers éparpillés** : Tous les fichiers seraient au même niveau, impossible à organiser.

2. **Noms en conflit** : Deux fichiers ne pourraient pas avoir le même nom.

3. **Recherche difficile** : Impossible de regrouper les fichiers par catégorie ou projet.

**Comment le système de fichiers résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Fichiers éparpillés | Les dossiers permettent de regrouper les fichiers |
| Noms en conflit | Deux fichiers peuvent avoir le même nom s'ils sont dans des dossiers différents |
| Recherche difficile | L'arborescence organise les fichiers de manière logique |

**Analogie concrète** : Le système de fichiers est comme un classeur à tiroirs. La racine `/` est le meuble complet. Chaque tiroir est un dossier (comme `/home`, `/var`). Dans chaque tiroir, il y a des dossiers suspendus (sous-dossiers), et dans ces dossiers, des documents (fichiers).

---

### La racine et l'arborescence

**Définition** : La racine `/` est le point de départ de toute l'arborescence. Tous les fichiers et dossiers sont des descendants de `/`.

**Structure simplifiée d'un système Unix** :

```text
/                          ← Racine
├── home/                  ← Dossiers personnels des utilisateurs
│   ├── alice/
│   │   ├── Documents/
│   │   └── Projets/
│   └── bob/
├── etc/                   ← Fichiers de configuration
├── var/                   ← Données variables (logs, etc.)
├── tmp/                   ← Fichiers temporaires
├── usr/                   ← Programmes et bibliothèques
└── bin/                   ← Commandes de base
```

**Dossiers importants** :

| Dossier | Contenu |
| ------- | ------- |
| `/` | Racine du système |
| `/home` | Dossiers personnels des utilisateurs |
| `/home/utilisateur` | Ton dossier personnel (aussi noté `~`) |
| `/etc` | Fichiers de configuration |
| `/var` | Données variables (logs, caches) |
| `/tmp` | Fichiers temporaires (nettoyage périodique par âge via systemd-tmpfiles, souvent 10 jours ; vidé au boot seulement si `/tmp` est un tmpfs) |
| `/usr` | Programmes installés |
| `/bin` | Commandes essentielles |

---

### Le dossier personnel (~)

**Définition** : Le dossier personnel est ton espace privé sur le système. Il est représenté par le symbole `~` (tilde).

**Correspondance** :

| Notation | Chemin complet |
| -------- | -------------- |
| `~` | `/home/tonnom` (Linux) ou `/Users/tonnom` (macOS) |
| `~/Documents` | `/home/tonnom/Documents` |
| `~/Projets` | `/home/tonnom/Projets` |

**Exemple** :

```bash
# Ces deux commandes font la même chose
cd /home/alex/Documents
cd ~/Documents
```

---

### Chemins absolus et relatifs

**Définition** :

- Un **chemin absolu** commence par `/` et donne le chemin complet depuis la racine.
- Un **chemin relatif** part du dossier courant et ne commence pas par `/`.

**Comparaison** :

| Type | Commence par | Exemple | Dépend du dossier courant |
| ---- | ------------ | ------- | ------------------------- |
| Absolu | `/` | `/home/alex/Documents` | Non, toujours le même |
| Relatif | autre chose | `Documents` ou `./Documents` | Oui |

**Symboles spéciaux** :

| Symbole | Signification |
| ------- | ------------- |
| `.` | Dossier courant |
| `..` | Dossier parent (un niveau au-dessus) |
| `~` | Dossier personnel |
| `/` | Racine (quand en début de chemin) |
| `/` | Séparateur de dossiers (dans un chemin) |

**Exemples de chemins relatifs** :

```text
Situation : tu es dans /home/alex/Projets

./fichier.txt      → /home/alex/Projets/fichier.txt
../Documents       → /home/alex/Documents
../../bob          → /home/bob
```

**Analogie concrète** :

- **Chemin absolu** : L'adresse postale complète "12 rue de la Paix, 75002 Paris, France". Elle est unique et complète.
- **Chemin relatif** : "La maison d'en face". Ça dépend d'où tu te trouves actuellement.

---

### La commande pwd

**Définition** : `pwd` (Print Working Directory) affiche le chemin absolu du dossier dans lequel tu te trouves.

**Utilité** : Quand tu es perdu et que tu veux savoir où tu es.

**Syntaxe** :

```bash
pwd
```

**Exemple** :

```bash
$ pwd
/home/alex/Projets
```

---

### La commande cd

**Définition** : `cd` (Change Directory) permet de se déplacer dans l'arborescence.

**Syntaxes courantes** :

| Commande | Action |
| -------- | ------ |
| `cd dossier` | Va dans le sous-dossier |
| `cd /chemin/absolu` | Va au chemin absolu |
| `cd ..` | Remonte d'un niveau |
| `cd ../..` | Remonte de deux niveaux |
| `cd ~` ou `cd` | Va au dossier personnel |
| `cd -` | Retourne au dossier précédent |

**Exemples** :

```bash
$ pwd
/home/alex

$ cd Documents
$ pwd
/home/alex/Documents

$ cd ..
$ pwd
/home/alex

$ cd /tmp
$ pwd
/tmp

$ cd ~
$ pwd
/home/alex
```

---

### La commande ls

**Définition** : `ls` (List) affiche le contenu d'un dossier.

**Options courantes** :

| Commande | Action |
| -------- | ------ |
| `ls` | Liste les fichiers du dossier courant |
| `ls chemin` | Liste les fichiers du dossier spécifié |
| `ls -l` | Liste détaillée (permissions, taille, date) |
| `ls -a` | Affiche les fichiers cachés (commençant par `.`) |
| `ls -la` | Combinaison : détaillé + fichiers cachés |
| `ls -lh` | Taille lisible par l'humain (Ko, Mo, Go) |

**Exemple de sortie** :

```bash
$ ls -la
total 24
drwxr-xr-x  5 alex alex 4096 jan 15 10:30 .
drwxr-xr-x  3 alex alex 4096 jan 10 09:00 ..
-rw-r--r--  1 alex alex  220 jan 15 10:30 .bashrc
drwxr-xr-x  2 alex alex 4096 jan 15 10:30 Documents
-rw-r--r--  1 alex alex 1024 jan 15 10:30 fichier.txt
```

**Explication des colonnes** :

| Colonne | Signification |
| ------- | ------------- |
| `drwxr-xr-x` | Type et permissions |
| `5` | Nombre de liens |
| `alex` | Propriétaire |
| `alex` | Groupe |
| `4096` | Taille en octets |
| `jan 15 10:30` | Date de modification |
| `.` | Nom du fichier/dossier |

**Identifier un dossier** :

- Si la première lettre est `d` → c'est un dossier (directory)
- Si la première lettre est `-` → c'est un fichier

---

## Étapes Pratiques

### Étape 1 : Ouvrir le terminal et vérifier ta position

```bash
pwd
```

**Résultat attendu** :

```text
/home/tonnom
```

ou sur macOS :

```text
/Users/tonnom
```

---

### Étape 2 : Explorer le dossier personnel

```bash
ls
```

**Résultat attendu** (varie selon ton système) :

```text
Bureau    Documents    Images    Musique    Projets    Téléchargements
```

---

### Étape 3 : Naviguer dans les dossiers

```bash
# Aller dans Documents
cd Documents

# Vérifier la position
pwd

# Remonter d'un niveau
cd ..

# Vérifier la position
pwd
```

**Résultat attendu** :

```text
/home/tonnom/Documents
/home/tonnom
```

---

### Étape 4 : Explorer la racine

```bash
# Aller à la racine
cd /

# Voir le contenu
ls

# Voir le contenu détaillé
ls -l
```

**Résultat attendu** :

```text
bin   etc   home   lib   tmp   usr   var   ...
```

---

### Étape 5 : Utiliser les chemins relatifs

```bash
# Retourner au dossier personnel
cd ~

# Aller dans un sous-dossier avec chemin relatif
cd Documents

# Aller dans un dossier frère (même niveau que Documents)
cd ../Téléchargements
pwd
```

**Résultat attendu** :

```text
/home/tonnom/Téléchargements
```

---

### Étape 6 : Voir les fichiers cachés

```bash
cd ~
ls -la
```

**Résultat attendu** (fichiers commençant par `.`) :

```text
.bashrc
.config
.local
...
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pwd` | Affiche le dossier courant |
| `cd dossier` | Change de dossier |
| `cd ..` | Remonte d'un niveau |
| `cd ~` | Va au dossier personnel |
| `cd -` | Retourne au dossier précédent |
| `ls` | Liste le contenu |
| `ls -la` | Liste détaillée avec fichiers cachés |
| `ls -lh` | Liste avec tailles lisibles |

---

## Pièges Fréquents

### Piège 1 : Espace dans le nom de dossier

⚠️ **Problème** : Le terminal interprète l'espace comme un séparateur.

✅ **Solution** : Utiliser des guillemets ou un backslash.

```bash
# Incorrect
cd Mon Dossier  # ERREUR : cherche "Mon" puis "Dossier"

# Correct
cd "Mon Dossier"
cd Mon\ Dossier
```

---

### Piège 2 : Confondre / et \

⚠️ **Problème** : Windows utilise `\`, Unix utilise `/`.

✅ **Solution** : Toujours utiliser `/` sur Unix/Linux/macOS.

```bash
# Incorrect (style Windows)
cd home\alex

# Correct (style Unix)
cd home/alex
```

---

### Piège 3 : Chemin inexistant

⚠️ **Problème** : Message "No such file or directory".

✅ **Solution** : Vérifier l'orthographe et l'existence avec `ls`.

```bash
# Vérifier que le dossier existe
ls

# Si le dossier n'apparaît pas, il n'existe pas
```

---

### Piège 4 : Majuscules/minuscules

⚠️ **Problème** : Unix est sensible à la casse.

✅ **Solution** : Respecter exactement les majuscules et minuscules.

```bash
# Si le dossier s'appelle "Documents"
cd documents  # ERREUR
cd Documents  # Correct
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est la racine `/`
- [ ] J'ai compris ce qu'est le dossier personnel `~`
- [ ] J'ai compris la différence entre chemin absolu et relatif
- [ ] J'ai utilisé `pwd` pour afficher le dossier courant
- [ ] J'ai utilisé `cd` pour me déplacer
- [ ] J'ai utilisé `ls` pour lister le contenu
- [ ] J'ai utilisé `ls -la` pour voir les fichiers cachés
- [ ] J'ai compris les symboles `.` (courant) et `..` (parent)

---

## Exercice Pratique

**Énoncé** : Navigue dans ton système de fichiers et réponds aux questions.

**Indications** :

1. Va dans ton dossier personnel
2. Liste tous les fichiers (y compris cachés)
3. Compte combien de fichiers commencent par un point
4. Va dans `/etc` et liste le contenu
5. Depuis `/etc`, va directement dans ton dossier Documents avec un chemin relatif
6. Affiche le chemin absolu de ta position actuelle

**Questions** :

1. Quel est le chemin absolu de ton dossier personnel ?
2. Combien de fichiers cachés as-tu trouvés ?
3. Quel chemin relatif as-tu utilisé pour aller de `/etc` à `~/Documents` ?

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Aller au dossier personnel
cd ~

# 2. Lister tous les fichiers
ls -la

# 3. Compter les fichiers cachés (commençant par .)
# Réponse : compte manuellement les lignes commençant par .
# (entre 10 et 20 selon le système)

# 4. Aller dans /etc
cd /etc
ls

# 5. Aller dans Documents avec chemin relatif
cd ~/Documents
# Ou depuis /etc :
# cd ../home/tonnom/Documents

# 6. Afficher le chemin absolu
pwd
# Résultat : /home/tonnom/Documents
```

**Réponses aux questions** :

1. Le chemin absolu du dossier personnel est `/home/tonnom` (Linux) ou `/Users/tonnom` (macOS)
2. Le nombre de fichiers cachés varie (entre 10 et 30 pour une installation standard)
3. Le chemin relatif depuis `/etc` vers `~/Documents` est `../home/tonnom/Documents`

---

## Navigation

→ Fiche suivante : **[Les permissions Unix](02-permissions.md)**
