---
tags:
  - Unix/Bash
  - Intermédiaire
  - Pratique
description: "Les scripts Bash"
estimated_time: "75 min"
fiche_number: 4
total_fiches: 10
cursus: "Unix/Bash"
id: "fundamentals.unix.scripts-bash"
course_id: "fundamentals.unix"
content_type: "lesson"
order: 4
---

# 04 - Les scripts Bash

> **En bref** : À la fin de cette fiche, tu sauras créer des scripts Bash simples avec des variables, des conditions et des boucles. Lecture estimée : 75 min.


## Prérequis

- Fiche [01 - Le système de fichiers Unix/Linux](01-systeme-fichiers.md)
- Fiche [02 - Les permissions Unix](02-permissions.md)
- Fiche [03 - Les commandes de base Unix](03-commandes-base.md)
- Savoir créer un fichier et le rendre exécutable avec chmod

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des scripts Bash simples avec des variables, des conditions et des boucles.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un script Bash ?

**Définition** : Un script Bash est un fichier texte contenant une série de commandes qui s'exécutent automatiquement les unes après les autres.

**Le problème que les scripts résolvent** :

Sans scripts, voici les problèmes rencontrés :

1. **Tâches répétitives** : Tu dois retaper les mêmes commandes à chaque fois.

2. **Erreurs de frappe** : Plus tu tapes, plus tu risques de te tromper.

3. **Documentation** : Impossible de garder une trace des commandes exécutées.

**Comment les scripts résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Tâches répétitives | Le script exécute tout automatiquement |
| Erreurs de frappe | Le script est écrit une fois, exécuté plusieurs fois |
| Documentation | Le script sert de documentation des étapes |

**Analogie concrète** : Un script est comme une recette de cuisine écrite. Au lieu de te souvenir de toutes les étapes à chaque fois, tu suis la recette. Si tu veux faire le même plat demain, tu reprends la même recette.

---

### Le shebang

**Définition** : Le shebang est la première ligne d'un script qui indique quel interpréteur utiliser.

**Syntaxe** :

```bash
#!/bin/bash
```

**Explication** :

| Partie | Signification |
| ------ | ------------- |
| `#!` | Caractères magiques (shebang) |
| `/bin/bash` | Chemin vers l'interpréteur Bash |

**Variantes courantes** :

| Shebang | Utilisation |
| ------- | ----------- |
| `#!/bin/bash` | Script Bash classique |
| `#!/bin/sh` | Script shell POSIX (plus portable) |
| `#!/usr/bin/env bash` | Trouve Bash dans le PATH (plus portable) |

**Ce que le shebang n'est PAS** :

- Le shebang n'est pas un commentaire ordinaire (même s'il commence par `#`)
- Il doit être sur la toute première ligne, sans espace avant

---

### Les variables

**Définition** : Une variable stocke une valeur qu'on peut réutiliser dans le script.

**Analogie concrète** : Une variable est comme une étiquette collée sur une boîte. L'étiquette porte un nom (par exemple "prénom") et la boîte contient une valeur (par exemple "Alice"). Tu peux regarder l'étiquette pour retrouver la boîte, et tu peux changer le contenu de la boîte sans changer l'étiquette.

**Déclaration** (sans espace autour du `=`) :

```bash
nom="valeur"
```

**Utilisation** (avec `$`) :

```bash
echo $nom
echo ${nom}  # Forme recommandée
```

**Règles importantes** :

| Correct | Incorrect |
| ------- | --------- |
| `nom="valeur"` | `nom = "valeur"` (espaces interdits) |
| `echo $nom` | `echo nom` (oubli du `$`) |

**Variables spéciales** :

| Variable | Contenu |
| -------- | ------- |
| `$0` | Nom du script |
| `$1`, `$2`, ... | Arguments passés au script |
| `$#` | Nombre d'arguments |
| `$@` | Tous les arguments |
| `$?` | Code de retour de la dernière commande |

---

### Les conditions (if)

**Analogie concrète** : Une condition est comme un panneau de signalisation à un carrefour. Si tu vas vers le nord, tu prends la route de gauche. Si tu vas vers le sud, tu prends celle de droite. Le script prend un chemin ou un autre selon le résultat du test.

**Syntaxe** :

```bash
if [ condition ]; then
    commandes
elif [ autre_condition ]; then
    commandes
else
    commandes
fi
```

**Les espaces sont obligatoires** autour des crochets et de la condition.

**Opérateurs de comparaison pour les nombres** :

| Opérateur | Signification |
| --------- | ------------- |
| `-eq` | Égal à (equal) |
| `-ne` | Différent de (not equal) |
| `-gt` | Supérieur à (greater than) |
| `-ge` | Supérieur ou égal (greater or equal) |
| `-lt` | Inférieur à (less than) |
| `-le` | Inférieur ou égal (less or equal) |

**Opérateurs pour les chaînes** :

| Opérateur | Signification |
| --------- | ------------- |
| `=` | Égal |
| `!=` | Différent |
| `-z` | Chaîne vide |
| `-n` | Chaîne non vide |

**Opérateurs pour les fichiers** :

| Opérateur | Signification |
| --------- | ------------- |
| `-e fichier` | Le fichier existe |
| `-f fichier` | C'est un fichier régulier |
| `-d fichier` | C'est un dossier |
| `-r fichier` | Lisible |
| `-w fichier` | Modifiable |
| `-x fichier` | Exécutable |

---

### Les boucles

**Analogie concrète** : Une boucle est comme une chaîne de montage dans une usine. La même opération est répétée sur chaque pièce qui passe sur le tapis roulant. Tu définis l'opération une seule fois, et la boucle l'applique automatiquement à chaque élément.

**Boucle for (parcourir une liste)** :

```bash
for element in liste; do
    commandes
done
```

**Exemples** :

```bash
# Parcourir des valeurs
for fruit in pomme banane orange; do
    echo "J'aime les ${fruit}s"
done

# Parcourir des fichiers
for fichier in *.txt; do
    echo "Fichier : $fichier"
done

# Boucle avec séquence de nombres
for i in {1..5}; do
    echo "Numéro $i"
done
```

**Boucle while** :

```bash
while [ condition ]; do
    commandes
done
```

**Exemple** :

```bash
compteur=0
while [ $compteur -lt 5 ]; do
    echo "Compteur : $compteur"
    compteur=$((compteur + 1))
done
```

---

### Les calculs arithmétiques

**Syntaxe** :

```bash
resultat=$((expression))
```

**Exemples** :

```bash
a=10
b=3

somme=$((a + b))
difference=$((a - b))
produit=$((a * b))
quotient=$((a / b))
reste=$((a % b))

echo "Somme : $somme"        # 13
echo "Quotient : $quotient"  # 3 (division entière)
```

---

### Lire l'entrée utilisateur

**Syntaxe** :

```bash
read -p "Message : " variable
```

**Exemple** :

```bash
read -p "Quel est ton prénom ? " prenom
echo "Bonjour, $prenom !"
```

---

## Étapes Pratiques

### Étape 1 : Créer ton premier script

```bash
# Créer le fichier
touch premier_script.sh

# Éditer le fichier (avec nano, vim, ou VS Code)
```

Contenu du fichier `premier_script.sh` :

```bash
#!/bin/bash
# Mon premier script Bash

echo "Bonjour !"
echo "Ce script fonctionne."
echo "Nous sommes le $(date)"
```

```bash
# Rendre exécutable
chmod +x premier_script.sh

# Exécuter
./premier_script.sh
```

**Résultat attendu** :

```text
Bonjour !
Ce script fonctionne.
Nous sommes le lun. 15 janv. 2024 10:30:00 CET
```

---

### Étape 2 : Script avec variables

Crée `variables.sh` :

```bash
#!/bin/bash
# Script avec des variables

nom="Nadia"
age=20
ville="Lyon"

echo "Je m'appelle ${nom}"
echo "J'ai ${age} ans"
echo "J'habite à ${ville}"

# Modification de variable
age=$((age + 1))
echo "L'année prochaine, j'aurai ${age} ans"
```

---

### Étape 3 : Script avec arguments

Crée `arguments.sh` :

```bash
#!/bin/bash
# Script utilisant les arguments

echo "Nom du script : $0"
echo "Nombre d'arguments : $#"
echo "Premier argument : $1"
echo "Deuxième argument : $2"
echo "Tous les arguments : $@"
```

**Exécution** :

```bash
chmod +x arguments.sh
./arguments.sh Alice Bob Charlie
```

**Résultat attendu** :

```text
Nom du script : ./arguments.sh
Nombre d'arguments : 3
Premier argument : Alice
Deuxième argument : Bob
Tous les arguments : Alice Bob Charlie
```

---

### Étape 4 : Script avec conditions

Crée `conditions.sh` :

```bash
#!/bin/bash
# Script avec conditions

read -p "Entre un nombre : " nombre

if [ $nombre -gt 0 ]; then
    echo "$nombre est positif"
elif [ $nombre -lt 0 ]; then
    echo "$nombre est négatif"
else
    echo "Le nombre est zéro"
fi
```

---

### Étape 5 : Vérifier l'existence d'un fichier

Crée `verifier_fichier.sh` :

```bash
#!/bin/bash
# Vérifie si un fichier existe

if [ $# -eq 0 ]; then
    echo "Usage : $0 <fichier>"
    exit 1
fi

fichier=$1

if [ -e "$fichier" ]; then
    if [ -f "$fichier" ]; then
        echo "$fichier est un fichier"
    elif [ -d "$fichier" ]; then
        echo "$fichier est un dossier"
    fi

    if [ -r "$fichier" ]; then
        echo "Il est lisible"
    fi
    if [ -w "$fichier" ]; then
        echo "Il est modifiable"
    fi
    if [ -x "$fichier" ]; then
        echo "Il est exécutable"
    fi
else
    echo "$fichier n'existe pas"
fi
```

**Exécution** :

```bash
./verifier_fichier.sh premier_script.sh
./verifier_fichier.sh /tmp
./verifier_fichier.sh inexistant.txt
```

---

### Étape 6 : Script avec boucle

Crée `boucle.sh` :

```bash
#!/bin/bash
# Script avec boucles

echo "=== Boucle for avec liste ==="
for fruit in pomme banane orange; do
    echo "Fruit : $fruit"
done

echo ""
echo "=== Boucle for avec séquence ==="
for i in {1..5}; do
    echo "Numéro $i"
done

echo ""
echo "=== Boucle while ==="
compteur=1
while [ $compteur -le 3 ]; do
    echo "Compteur : $compteur"
    compteur=$((compteur + 1))
done
```

---

### Étape 7 : Script pratique - Backup

Crée `backup.sh` :

```bash
#!/bin/bash
# Script de sauvegarde simple

if [ $# -ne 2 ]; then
    echo "Usage : $0 <source> <destination>"
    exit 1
fi

source=$1
destination=$2
date_backup=$(date +%Y%m%d_%H%M%S)

if [ ! -e "$source" ]; then
    echo "Erreur : $source n'existe pas"
    exit 1
fi

nom_backup="${destination}/backup_${date_backup}"

if [ -d "$source" ]; then
    cp -r "$source" "$nom_backup"
else
    cp "$source" "$nom_backup"
fi

echo "Backup créé : $nom_backup"
```

**Exécution** :

```bash
mkdir -p ~/backups
./backup.sh premier_script.sh ~/backups
ls ~/backups
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `chmod +x script.sh` | Rendre exécutable |
| `./script.sh` | Exécuter le script |
| `bash script.sh` | Exécuter sans chmod |
| `read -p "msg" var` | Lire une entrée |
| `$((expression))` | Calcul arithmétique |
| `exit 0` | Quitter avec succès |
| `exit 1` | Quitter avec erreur |

---

## Pièges Fréquents

### Piège 1 : Espaces autour du =

⚠️ **Problème** : "command not found"

✅ **Solution** : Pas d'espaces autour du `=`.

```bash
# Incorrect
nom = "valeur"

# Correct
nom="valeur"
```

---

### Piège 2 : Oublier les espaces dans les conditions

⚠️ **Problème** : "unary operator expected"

✅ **Solution** : Espaces obligatoires dans `[ condition ]`.

```bash
# Incorrect
if [$a -eq $b]; then

# Correct
if [ $a -eq $b ]; then
```

---

### Piège 3 : Oublier le shebang

⚠️ **Problème** : Comportement imprévisible.

✅ **Solution** : Toujours commencer par `#!/bin/bash`.

---

### Piège 4 : Variable vide dans une condition

⚠️ **Problème** : "unary operator expected" si la variable est vide.

✅ **Solution** : Mettre la variable entre guillemets.

```bash
# Problème si $nom est vide
if [ $nom = "test" ]; then

# Correct
if [ "$nom" = "test" ]; then
```

---

## Checklist de Validation

- [ ] Je sais créer un script avec le shebang `#!/bin/bash`
- [ ] Je sais rendre un script exécutable avec `chmod +x`
- [ ] Je sais déclarer et utiliser des variables
- [ ] Je sais utiliser les arguments `$1`, `$2`, `$#`
- [ ] Je sais écrire des conditions avec `if`
- [ ] Je sais écrire des boucles `for` et `while`
- [ ] Je sais faire des calculs avec `$(( ))`

---

## Exercice Pratique

**Énoncé** : Crée un script qui compte les fichiers d'un dossier.

**Indications** :

- Le script prend un dossier en argument
- Il vérifie que l'argument est bien un dossier
- Il compte les fichiers (pas les dossiers) dans ce répertoire
- Il affiche le résultat

**Résultat attendu** :

```bash
./compter_fichiers.sh /etc
```

```text
Le dossier /etc contient 42 fichiers.
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier compter_fichiers.sh** :

```bash
#!/bin/bash
# Compte les fichiers dans un dossier

# Vérifier qu'un argument est fourni
if [ $# -ne 1 ]; then
    echo "Usage : $0 <dossier>"
    exit 1
fi

dossier=$1

# Vérifier que c'est un dossier
if [ ! -d "$dossier" ]; then
    echo "Erreur : $dossier n'est pas un dossier"
    exit 1
fi

# Compter les fichiers
compteur=0
for element in "$dossier"/*; do
    if [ -f "$element" ]; then
        compteur=$((compteur + 1))
    fi
done

echo "Le dossier $dossier contient $compteur fichiers."
```

**Exécution** :

```bash
chmod +x compter_fichiers.sh
./compter_fichiers.sh /etc
./compter_fichiers.sh ~
```

---

## Navigation

← Fiche précédente : **[Les commandes de base Unix](03-commandes-base.md)**

→ Fiche suivante : **[Processus et signaux](05-processus-signaux.md)**
