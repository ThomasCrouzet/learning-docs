---
tags:
  - Unix/Bash
  - Débutant
  - Pratique
description: "Les commandes de base Unix"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 10
cursus: "Unix/Bash"
id: "fundamentals.unix.commandes-base"
course_id: "fundamentals.unix"
content_type: "lesson"
order: 3
---

# 03 - Les commandes de base Unix

> **En bref** : À la fin de cette fiche, tu sauras créer, copier, déplacer et supprimer des fichiers et dossiers avec les commandes Unix. Lecture estimée : 50 min.


## Prérequis

- Fiche [01 - Le système de fichiers Unix/Linux](01-systeme-fichiers.md)
- Fiche [02 - Les permissions Unix](02-permissions.md)
- Savoir naviguer avec `cd`, `ls`, `pwd`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer, copier, déplacer et supprimer des fichiers et dossiers avec les commandes Unix.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Les commandes de création

**mkdir - Créer un dossier**

| Commande | Action |
| -------- | ------ |
| `mkdir dossier` | Crée un dossier |
| `mkdir -p chemin/complet/dossier` | Crée le dossier et tous les parents manquants |
| `mkdir dossier1 dossier2` | Crée plusieurs dossiers |

**touch - Créer un fichier vide**

| Commande | Action |
| -------- | ------ |
| `touch fichier.txt` | Crée un fichier vide (ou met à jour la date si existe) |
| `touch fichier1 fichier2` | Crée plusieurs fichiers |

**Analogie** : `mkdir` est comme construire une armoire vide. `touch` est comme poser une feuille blanche sur le bureau.

---

### Les commandes de copie

**cp - Copier**

| Commande | Action |
| -------- | ------ |
| `cp source destination` | Copie un fichier |
| `cp fichier.txt copie.txt` | Copie avec nouveau nom |
| `cp fichier.txt dossier/` | Copie dans un dossier |
| `cp -r dossier/ copie/` | Copie un dossier (récursif obligatoire) |
| `cp -i fichier.txt dest.txt` | Demande confirmation si dest existe |

**Important** : Pour copier un dossier, `-r` (récursif) est obligatoire.

**Analogie concrète** : `cp` est comme une photocopieuse. Tu places un document dessus, tu appuies sur le bouton, et tu obtiens une copie identique. L'original reste sur la vitre. `mv` est comme prendre un dossier posé sur un bureau et le ranger dans un tiroir : le dossier n'est plus sur le bureau, il est dans le tiroir.

---

### Les commandes de déplacement

**mv - Déplacer ou renommer**

| Commande | Action |
| -------- | ------ |
| `mv fichier.txt dossier/` | Déplace le fichier |
| `mv ancien.txt nouveau.txt` | Renomme le fichier |
| `mv dossier1/ dossier2/` | Déplace ou renomme le dossier |
| `mv -i source dest` | Demande confirmation si dest existe |

**Différence cp vs mv** :

| cp | mv |
| -- | -- |
| L'original reste | L'original disparaît |
| Crée une copie | Déplace ou renomme |

---

### Les commandes de suppression

**rm - Supprimer**

| Commande | Action |
| -------- | ------ |
| `rm fichier.txt` | Supprime un fichier |
| `rm fichier1 fichier2` | Supprime plusieurs fichiers |
| `rm -r dossier/` | Supprime un dossier et son contenu |
| `rm -i fichier.txt` | Demande confirmation |
| `rm -f fichier.txt` | Force la suppression (pas de confirmation) |
| `rm -rf dossier/` | Force la suppression récursive |

**rmdir - Supprimer un dossier vide**

| Commande | Action |
| -------- | ------ |
| `rmdir dossier` | Supprime un dossier vide seulement |

**ATTENTION** : `rm` est définitif. Il n'y a pas de corbeille en ligne de commande.

**Analogie concrète** : `rm` est comme un broyeur de documents. Une fois le papier passé dans la machine, il est impossible de le reconstituer. Contrairement à la corbeille de ton bureau (qui te permet de récupérer un fichier supprimé par erreur), `rm` détruit immédiatement et définitivement.

---

### Les liens symboliques

**ln - Créer un lien**

**Définition** : Un lien symbolique est un raccourci vers un fichier ou dossier.

| Commande | Action |
| -------- | ------ |
| `ln -s cible lien` | Crée un lien symbolique |
| `ln -s /chemin/fichier.txt raccourci.txt` | Exemple concret |

**Analogie** : Un lien symbolique est comme un raccourci Windows ou un alias macOS. Il pointe vers le fichier original sans le dupliquer.

**Différence entre lien dur et lien symbolique** :

| Lien symbolique (`ln -s`) | Lien dur (`ln`) |
| ------------------------- | --------------- |
| Peut pointer vers un dossier | Seulement pour fichiers |
| Peut traverser les disques | Même disque seulement |
| Si l'original est supprimé, le lien est cassé | Le fichier existe tant qu'un lien existe |

---

### Les commandes de lecture

**cat - Afficher le contenu**

| Commande | Action |
| -------- | ------ |
| `cat fichier.txt` | Affiche tout le contenu |
| `cat fichier1 fichier2` | Concatène et affiche |

**head et tail - Afficher le début ou la fin**

| Commande | Action |
| -------- | ------ |
| `head fichier.txt` | Affiche les 10 premières lignes |
| `head -n 5 fichier.txt` | Affiche les 5 premières lignes |
| `tail fichier.txt` | Affiche les 10 dernières lignes |
| `tail -n 20 fichier.txt` | Affiche les 20 dernières lignes |
| `tail -f fichier.txt` | Suit le fichier en temps réel |

**Analogie concrète** : `cat` est comme ouvrir un livre et lire toutes les pages d'un coup. `head` est comme lire uniquement la table des matières au début. `tail` est comme regarder les dernières pages d'un carnet pour voir les notes les plus récentes.

---

### Écrire dans un fichier

**Les redirections**

| Opérateur | Action |
| --------- | ------ |
| `>` | Écrit dans un fichier (écrase le contenu) |
| `>>` | Ajoute à la fin du fichier |

**Exemples** :

```bash
echo "Bonjour" > fichier.txt     # Crée/écrase avec "Bonjour"
echo "Au revoir" >> fichier.txt  # Ajoute "Au revoir" à la fin
```

---

## Étapes Pratiques

### Étape 1 : Créer une structure de dossiers

```bash
# Créer un dossier de travail
mkdir -p ~/exercices-bash
cd ~/exercices-bash

# Créer une structure de projet
mkdir -p projet/{src,docs,tests}

# Vérifier
ls -la projet/
```

**Résultat attendu** :

```text
drwxr-xr-x  5 alex alex 4096 jan 15 10:30 .
drwxr-xr-x  3 alex alex 4096 jan 15 10:30 ..
drwxr-xr-x  2 alex alex 4096 jan 15 10:30 docs
drwxr-xr-x  2 alex alex 4096 jan 15 10:30 src
drwxr-xr-x  2 alex alex 4096 jan 15 10:30 tests
```

---

### Étape 2 : Créer des fichiers

```bash
cd projet

# Créer des fichiers vides
touch src/main.java
touch src/utils.java
touch docs/readme.txt
touch tests/test1.java

# Vérifier
ls -la src/
```

---

### Étape 3 : Écrire du contenu

```bash
# Écrire dans un fichier
echo "# Mon Projet" > docs/readme.txt
echo "Description du projet" >> docs/readme.txt

# Vérifier
cat docs/readme.txt
```

**Résultat attendu** :

```text
# Mon Projet
Description du projet
```

---

### Étape 4 : Copier des fichiers

```bash
# Copier un fichier
cp src/main.java src/main_backup.java

# Copier vers un autre dossier
cp docs/readme.txt docs/readme_copie.txt

# Copier un dossier entier
cp -r src/ src_backup/

# Vérifier
ls -la src/
ls -la
```

---

### Étape 5 : Déplacer et renommer

```bash
# Renommer un fichier
mv src/utils.java src/helpers.java

# Déplacer un fichier
mv src/main_backup.java tests/

# Vérifier
ls src/
ls tests/
```

---

### Étape 6 : Supprimer

```bash
# Supprimer un fichier
rm src_backup/helpers.java

# Supprimer un dossier vide
rmdir src_backup

# Oups, il n'est pas vide
# Utiliser rm -r
rm -r src_backup

# Vérifier
ls
```

---

### Étape 7 : Créer des liens symboliques

```bash
# Créer un lien vers readme.txt
ln -s docs/readme.txt readme_link.txt

# Vérifier
ls -la readme_link.txt

# Lire via le lien
cat readme_link.txt
```

**Résultat attendu** :

```text
lrwxrwxrwx  1 alex alex 15 jan 15 10:30 readme_link.txt -> docs/readme.txt
```

Le `l` au début indique que c'est un lien.

---

### Étape 8 : Lire des fichiers

```bash
# Créer un fichier avec plusieurs lignes
for i in {1..20}; do echo "Ligne $i" >> long_fichier.txt; done

# Voir tout le contenu
cat long_fichier.txt

# Voir les premières lignes
head long_fichier.txt

# Voir les 5 dernières lignes
tail -n 5 long_fichier.txt
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `mkdir -p dossier/sous` | Crée dossiers imbriqués |
| `touch fichier.txt` | Crée fichier vide |
| `cp source dest` | Copie fichier |
| `cp -r dossier/ copie/` | Copie dossier |
| `mv source dest` | Déplace ou renomme |
| `rm fichier` | Supprime fichier |
| `rm -r dossier/` | Supprime dossier |
| `ln -s cible lien` | Crée lien symbolique |
| `cat fichier` | Affiche contenu |
| `head -n 10 fichier` | Premières lignes |
| `tail -n 10 fichier` | Dernières lignes |

---

## Pièges Fréquents

### Piège 1 : rm sans -r sur un dossier

⚠️ **Problème** : "cannot remove: Is a directory"

✅ **Solution** : Utiliser `-r` pour les dossiers.

```bash
# Incorrect
rm dossier/  # ERREUR

# Correct
rm -r dossier/
```

---

### Piège 2 : cp sans -r sur un dossier

⚠️ **Problème** : "omitting directory"

✅ **Solution** : Utiliser `-r` pour copier un dossier.

```bash
# Incorrect
cp dossier/ copie/  # ERREUR

# Correct
cp -r dossier/ copie/
```

---

### Piège 3 : Écraser un fichier avec >

⚠️ **Problème** : Le contenu précédent est perdu.

✅ **Solution** : Utiliser `>>` pour ajouter.

```bash
# Écrase le contenu !
echo "nouveau" > fichier.txt

# Ajoute à la fin
echo "nouveau" >> fichier.txt
```

---

### Piège 4 : rm -rf /

⚠️ **Problème** : Supprime TOUT le système.

✅ **Solution** : Toujours vérifier la commande avant de l'exécuter.

```bash
# DANGEREUX - ne jamais exécuter
rm -rf /

# DANGEREUX - espace en trop !
rm -rf / home/user  # Supprime / puis home/user

# Vérifier avec ls avant
ls chemin/
rm -rf chemin/
```

---

### Piège 5 : Lien symbolique vers fichier inexistant

⚠️ **Problème** : Le lien est "cassé" si la cible est déplacée ou supprimée.

✅ **Solution** : Utiliser des chemins absolus pour les liens.

```bash
# Lien relatif (peut casser si tu te déplaces)
ln -s ../fichier.txt lien.txt

# Lien absolu (plus robuste)
ln -s /home/user/fichier.txt lien.txt
```

---

## Checklist de Validation

- [ ] Je sais créer des dossiers avec `mkdir` et `mkdir -p`
- [ ] Je sais créer des fichiers avec `touch`
- [ ] Je sais copier avec `cp` et `cp -r`
- [ ] Je sais déplacer et renommer avec `mv`
- [ ] Je sais supprimer avec `rm` et `rm -r`
- [ ] Je sais créer des liens symboliques avec `ln -s`
- [ ] Je sais écrire dans un fichier avec `>` et `>>`
- [ ] Je sais lire un fichier avec `cat`, `head`, `tail`

---

## Exercice Pratique

**Énoncé** : Crée une structure de projet complet.

**Indications** :

1. Crée un dossier `mon-site` avec cette structure :

   ```text
   mon-site/
   ├── css/
   │   └── style.css
   ├── js/
   │   └── app.js
   ├── images/
   ├── index.html
   └── readme.md
   ```

2. Dans `readme.md`, écris :

   ```text
   # Mon Site
   Un site web simple.
   ```

3. Copie `style.css` vers `style_backup.css`

4. Crée un lien symbolique `lien_readme` qui pointe vers `readme.md`

5. Affiche le contenu de `readme.md` via le lien

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Créer la structure de dossiers et fichiers :

```bash
mkdir -p mon-site/{css,js,images}
touch mon-site/css/style.css
touch mon-site/js/app.js
touch mon-site/index.html
touch mon-site/readme.md
```

**Étape 2** : Écrire dans readme.md :

```bash
echo "# Mon Site" > mon-site/readme.md
echo "Un site web simple." >> mon-site/readme.md
```

**Étape 3** : Copier style.css :

```bash
cp mon-site/css/style.css mon-site/css/style_backup.css
```

**Étape 4** : Créer le lien symbolique :

```bash
ln -s mon-site/readme.md lien_readme
```

**Étape 5** : Afficher via le lien et vérifier la structure :

```bash
cat lien_readme
ls -laR mon-site/
```

**Sortie de `cat lien_readme`** :

```text
# Mon Site
Un site web simple.
```

---

## Navigation

← Fiche précédente : **[Les permissions Unix](02-permissions.md)**

→ Fiche suivante : **[Les scripts Bash](04-scripts-bash.md)**
