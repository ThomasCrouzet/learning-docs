---
tags:
  - Unix/Bash
  - Débutant
  - Pratique
description: "Les permissions Unix"
estimated_time: "50 min"
fiche_number: 2
total_fiches: 10
cursus: "Unix/Bash"
---

# 02 - Les permissions Unix

> **En bref** : À la fin de cette fiche, tu sauras lire et modifier les permissions des fichiers et dossiers avec chmod. Lecture estimée : 50 min.


## Prérequis

- Fiche [01 - Le système de fichiers Unix/Linux](01-systeme-fichiers.md)
- Savoir utiliser `ls -l` pour afficher les détails des fichiers

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et modifier les permissions des fichiers et dossiers avec `chmod`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une permission ?

**Définition** : Une permission est un droit accordé à un utilisateur pour effectuer une action sur un fichier ou dossier (lire, écrire, exécuter).

**Le problème que les permissions résolvent** :

Sans permissions, voici les problèmes rencontrés :

1. **Pas de confidentialité** : Tout le monde peut lire tous les fichiers.

2. **Pas de protection** : N'importe qui peut modifier ou supprimer n'importe quel fichier.

3. **Sécurité compromise** : Des programmes malveillants peuvent s'exécuter librement.

**Comment les permissions résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de confidentialité | Seuls les utilisateurs autorisés peuvent lire |
| Pas de protection | Seuls les utilisateurs autorisés peuvent modifier |
| Sécurité compromise | L'exécution est contrôlée |

**Analogie concrète** : Les permissions sont comme les accès à un bâtiment. Certaines personnes peuvent entrer (lecture), certaines peuvent modifier l'aménagement (écriture), et certaines peuvent utiliser les machines (exécution). Chaque personne a des droits différents selon son rôle.

---

### Les trois types de permissions

**Les permissions de base** :

| Lettre | Nom | Pour un fichier | Pour un dossier |
| ------ | --- | --------------- | --------------- |
| `r` | Read (lecture) | Lire le contenu | Lister le contenu (`ls`) |
| `w` | Write (écriture) | Modifier le contenu | Créer/supprimer des fichiers |
| `x` | Execute (exécution) | Exécuter comme programme | Entrer dans le dossier (`cd`) |
| `-` | Aucune | Permission absente | Permission absente |

**Important pour les dossiers** :

- `r` sans `x` : Tu peux voir les noms des fichiers mais pas y accéder
- `x` sans `r` : Tu peux entrer si tu connais le nom exact
- `w` sans `x` : Inutile, tu ne peux pas modifier sans entrer

---

### Les trois catégories d'utilisateurs

**Les utilisateurs concernés** :

| Catégorie | Abréviation | Description |
| --------- | ----------- | ----------- |
| User | `u` | Le propriétaire du fichier |
| Group | `g` | Les membres du groupe du fichier |
| Others | `o` | Tous les autres utilisateurs |
| All | `a` | Tout le monde (u + g + o) |

**Affichage avec ls -l** :

```text
-rwxr-xr--
│└┬┘└┬┘└┬┘
│ │  │  └── Permissions pour "others" (o)
│ │  └───── Permissions pour "group" (g)
│ └──────── Permissions pour "user" (u)
└────────── Type (- = fichier, d = dossier)
```

**Exemple décomposé** :

```text
-rwxr-xr--  fichier.txt

- = fichier
rwx = user (propriétaire) : lecture, écriture, exécution
r-x = group : lecture, exécution (pas d'écriture)
r-- = others : lecture seulement
```

---

### La notation octale

**Définition** : La notation octale représente les permissions par des chiffres de 0 à 7, où chaque chiffre correspond à une combinaison de r, w, x.

**Table de correspondance** :

| Chiffre | Binaire | Permissions | Signification |
| ------- | ------- | ----------- | ------------- |
| 0 | 000 | `---` | Aucune permission |
| 1 | 001 | `--x` | Exécution seulement |
| 2 | 010 | `-w-` | Écriture seulement |
| 3 | 011 | `-wx` | Écriture + exécution |
| 4 | 100 | `r--` | Lecture seulement |
| 5 | 101 | `r-x` | Lecture + exécution |
| 6 | 110 | `rw-` | Lecture + écriture |
| 7 | 111 | `rwx` | Toutes les permissions |

**Calcul** :

```text
r = 4
w = 2
x = 1

rwx = 4 + 2 + 1 = 7
rw- = 4 + 2 + 0 = 6
r-x = 4 + 0 + 1 = 5
r-- = 4 + 0 + 0 = 4
```

**Exemples courants** :

| Octal | Symbolique | Utilisation typique |
| ----- | ---------- | ------------------- |
| 755 | `rwxr-xr-x` | Scripts exécutables |
| 644 | `rw-r--r--` | Fichiers normaux |
| 700 | `rwx------` | Fichiers privés |
| 777 | `rwxrwxrwx` | Tout le monde peut tout faire (dangereux) |
| 600 | `rw-------` | Fichiers très privés |

---

### La commande chmod

**Définition** : `chmod` (Change Mode) modifie les permissions d'un fichier ou dossier.

**Deux syntaxes possibles** :

**1. Syntaxe octale** :

```bash
chmod 755 fichier
chmod 644 fichier
```

**2. Syntaxe symbolique** :

```bash
chmod u+x fichier       # Ajoute exécution pour user
chmod g-w fichier       # Retire écriture pour group
chmod o=r fichier       # Définit lecture seulement pour others
chmod a+r fichier       # Ajoute lecture pour tous
chmod u=rwx,g=rx,o=r fichier  # Définit tout
```

**Opérateurs** :

| Opérateur | Action |
| --------- | ------ |
| `+` | Ajoute la permission |
| `-` | Retire la permission |
| `=` | Définit exactement ces permissions |

**Option récursive** :

```bash
chmod -R 755 dossier/   # Applique à tout le contenu du dossier
```

---

### La commande chown

**Définition** : `chown` (Change Owner) modifie le propriétaire et/ou le groupe d'un fichier.

**Syntaxe** :

```bash
chown utilisateur fichier            # Change le propriétaire
chown utilisateur:groupe fichier     # Change propriétaire et groupe
chown :groupe fichier                # Change seulement le groupe
chown -R utilisateur dossier/        # Récursif
```

**Note** : Cette commande nécessite souvent les droits administrateur (`sudo`).

---

## Étapes Pratiques

### Étape 1 : Voir les permissions actuelles

```bash
# Créer un dossier de test
mkdir -p ~/test-permissions
cd ~/test-permissions

# Créer des fichiers de test
touch fichier1.txt
touch script.sh
mkdir dossier1

# Voir les permissions
ls -la
```

**Résultat attendu** :

```text
drwxr-xr-x  3 alex alex 4096 jan 15 10:30 .
drwxr-xr-x  5 alex alex 4096 jan 15 10:30 ..
drwxr-xr-x  2 alex alex 4096 jan 15 10:30 dossier1
-rw-r--r--  1 alex alex    0 jan 15 10:30 fichier1.txt
-rw-r--r--  1 alex alex    0 jan 15 10:30 script.sh
```

---

### Étape 2 : Rendre un script exécutable

```bash
# Le script n'est pas encore exécutable
ls -l script.sh
# -rw-r--r--  (pas de x)

# Ajouter la permission d'exécution pour le propriétaire
chmod u+x script.sh

# Vérifier
ls -l script.sh
# -rwxr--r--  (x ajouté pour user)
```

---

### Étape 3 : Utiliser la notation octale

```bash
# Mettre les permissions 755 (rwxr-xr-x)
chmod 755 script.sh
ls -l script.sh
# -rwxr-xr-x

# Mettre les permissions 644 (rw-r--r--)
chmod 644 fichier1.txt
ls -l fichier1.txt
# -rw-r--r--

# Permissions très restrictives (700)
chmod 700 dossier1
ls -ld dossier1
# drwx------
```

---

### Étape 4 : Retirer des permissions

```bash
# Retirer l'écriture pour group et others
chmod go-w fichier1.txt

# Retirer toutes les permissions pour others
chmod o-rwx script.sh
ls -l script.sh
# -rwxr-x---
```

---

### Étape 5 : Tester les permissions

```bash
# Créer un fichier avec contenu
echo "Contenu du fichier" > test.txt

# Retirer la lecture
chmod u-r test.txt

# Essayer de lire
cat test.txt
# Permission denied (si tu es le propriétaire, tu peux quand même avec sudo)

# Remettre la lecture
chmod u+r test.txt
cat test.txt
# Contenu du fichier
```

---

### Étape 6 : Permissions sur les dossiers

```bash
# Créer un dossier avec fichiers
mkdir mondossier
echo "test" > mondossier/fichier.txt

# Retirer le droit d'entrée (x)
chmod u-x mondossier

# Essayer d'y entrer
cd mondossier
# Permission denied

# Essayer de lister
ls mondossier
# Peut afficher les noms mais pas les détails

# Remettre les permissions
chmod u+x mondossier
cd mondossier
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ls -l` | Affiche les permissions |
| `chmod 755 fichier` | Permissions rwxr-xr-x |
| `chmod 644 fichier` | Permissions rw-r--r-- |
| `chmod u+x fichier` | Ajoute exécution pour user |
| `chmod go-w fichier` | Retire écriture pour group et others |
| `chmod -R 755 dossier/` | Permissions récursives |

---

## Pièges Fréquents

### Piège 1 : chmod 777 partout

⚠️ **Problème** : Donner toutes les permissions à tout le monde est dangereux.

✅ **Solution** : Utiliser les permissions minimales nécessaires.

```bash
# Dangereux : tout le monde peut tout faire
chmod 777 fichier

# Mieux : permissions appropriées
chmod 644 fichier.txt  # Fichier normal
chmod 755 script.sh    # Script exécutable
chmod 700 fichier_prive.txt  # Fichier privé
```

---

### Piège 2 : Oublier x sur un dossier

⚠️ **Problème** : Impossible d'entrer dans le dossier.

✅ **Solution** : Les dossiers ont besoin de `x` pour être traversés.

```bash
# Problème
chmod 644 dossier/
cd dossier/  # Permission denied

# Solution
chmod 755 dossier/
cd dossier/  # OK
```

---

### Piège 3 : Se verrouiller soi-même

⚠️ **Problème** : Retirer ses propres permissions.

✅ **Solution** : On peut toujours utiliser chmod si on est propriétaire.

```bash
# Se verrouiller
chmod 000 fichier.txt
cat fichier.txt  # Permission denied

# Se déverrouiller (on est toujours propriétaire)
chmod 644 fichier.txt
cat fichier.txt  # OK
```

---

### Piège 4 : Oublier le récursif

⚠️ **Problème** : chmod n'affecte pas le contenu des sous-dossiers.

✅ **Solution** : Utiliser `-R` pour récursif.

```bash
# Ne change que le dossier, pas son contenu
chmod 755 dossier/

# Change le dossier ET tout son contenu
chmod -R 755 dossier/
```

---

## Checklist de Validation

- [ ] J'ai compris les trois permissions (r, w, x)
- [ ] J'ai compris les trois catégories (user, group, others)
- [ ] Je sais lire une chaîne de permissions (-rwxr-xr--)
- [ ] Je sais utiliser chmod avec la notation octale (755, 644)
- [ ] Je sais utiliser chmod avec la notation symbolique (u+x, go-w)
- [ ] J'ai compris l'importance de x pour les dossiers
- [ ] Je sais utiliser chmod -R pour le mode récursif

---

## Exercice Pratique

**Énoncé** : Crée une structure de fichiers avec des permissions spécifiques.

**Indications** :

1. Crée un dossier `projet` avec les permissions 755
2. Dans ce dossier, crée :
   - `readme.txt` avec permissions 644 (lisible par tous)
   - `config.conf` avec permissions 600 (privé)
   - `run.sh` avec permissions 755 (exécutable)
   - Un sous-dossier `logs` avec permissions 700 (privé)
3. Vérifie toutes les permissions avec `ls -la`

**Résultat attendu** :

```text
drwxr-xr-x  projet/
-rw-r--r--  readme.txt
-rw-------  config.conf
-rwxr-xr-x  run.sh
drwx------  logs/
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Créer le dossier projet
mkdir projet
chmod 755 projet

# Aller dans le dossier
cd projet

# Créer les fichiers
touch readme.txt config.conf run.sh
mkdir logs

# Appliquer les permissions
chmod 644 readme.txt
chmod 600 config.conf
chmod 755 run.sh
chmod 700 logs

# Vérifier
ls -la
```

**Sortie attendue** :

```text
total 16
drwxr-xr-x  3 alex alex 4096 jan 15 10:30 .
drwxr-xr-x  5 alex alex 4096 jan 15 10:30 ..
-rw-------  1 alex alex    0 jan 15 10:30 config.conf
drwx------  2 alex alex 4096 jan 15 10:30 logs
-rw-r--r--  1 alex alex    0 jan 15 10:30 readme.txt
-rwxr-xr-x  1 alex alex    0 jan 15 10:30 run.sh
```

---

## Navigation

← Fiche précédente : **[Le système de fichiers Unix/Linux](01-systeme-fichiers.md)**

→ Fiche suivante : **[Les commandes de base Unix](03-commandes-base.md)**
