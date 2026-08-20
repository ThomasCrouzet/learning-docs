---
tags:
  - Référence
  - Débutant
description: "Aide-mémoire Bash"
estimated_time: "15 min"
fiche_number: 2
total_fiches: 3
cursus: "Aide-mémoires Java, Bash, HTML/CSS"
---

# 02 - Aide-mémoire Bash

> **En bref** : Référence rapide des commandes Unix/Bash les plus utilisées. Lecture estimée : 15 min.

Référence rapide pour les commandes Unix/Bash.

---

## Navigation dans le système de fichiers

| Commande | Action |
| -------- | ------ |
| `pwd` | Affiche le répertoire courant |
| `cd /chemin` | Se déplace vers un chemin absolu |
| `cd dossier` | Se déplace vers un sous-dossier |
| `cd ..` | Remonte d'un niveau |
| `cd ~` | Se déplace vers le répertoire personnel |
| `cd -` | Retourne au répertoire précédent |
| `ls` | Liste les fichiers du répertoire courant |
| `ls -l` | Liste avec détails (permissions, taille, date) |
| `ls -a` | Liste avec les fichiers cachés (commencent par `.`) |
| `ls -la` | Liste avec détails et fichiers cachés |
| `ls -lh` | Liste avec tailles lisibles (Ko, Mo) |

---

## Manipulation de fichiers

| Commande | Action |
| -------- | ------ |
| `touch fichier.txt` | Crée un fichier vide (ou met à jour sa date) |
| `mkdir dossier` | Crée un dossier |
| `mkdir -p chemin/complet` | Crée un dossier et ses parents manquants |
| `cp source destination` | Copie un fichier |
| `cp -r source destination` | Copie un dossier (récursif) |
| `mv source destination` | Déplace ou renomme un fichier/dossier |
| `rm fichier` | Supprime un fichier |
| `rm -r dossier` | Supprime un dossier et son contenu |
| `rm -i fichier` | Supprime avec confirmation |
| `rmdir dossier` | Supprime un dossier vide |

---

## Lecture de fichiers

| Commande | Action |
| -------- | ------ |
| `cat fichier` | Affiche tout le contenu |
| `head fichier` | Affiche les 10 premières lignes |
| `head -n 5 fichier` | Affiche les 5 premières lignes |
| `tail fichier` | Affiche les 10 dernières lignes |
| `tail -n 5 fichier` | Affiche les 5 dernières lignes |
| `tail -f fichier` | Suit le fichier en temps réel |
| `less fichier` | Affiche le contenu page par page |
| `wc fichier` | Compte les lignes, mots et caractères |
| `wc -l fichier` | Compte uniquement les lignes |

---

## Permissions

### Lire les permissions

```text
-rwxr-xr--
│└┬┘└┬┘└┬┘
│ │  │  └── Autres (o) : r-- (lecture seule)
│ │  └───── Groupe (g) : r-x (lecture + exécution)
│ └──────── Propriétaire (u) : rwx (tous les droits)
└────────── Type (- = fichier, d = dossier)
```

### Modes octaux

| Valeur | Permission |
| ------ | ---------- |
| `0` | Aucune (`---`) |
| `1` | Exécution (`--x`) |
| `2` | Écriture (`-w-`) |
| `4` | Lecture (`r--`) |
| `5` | Lecture + exécution (`r-x`) |
| `6` | Lecture + écriture (`rw-`) |
| `7` | Tous les droits (`rwx`) |

### Commandes

| Commande | Action |
| -------- | ------ |
| `chmod 755 fichier` | `rwxr-xr-x` (script exécutable) |
| `chmod 644 fichier` | `rw-r--r--` (fichier standard) |
| `chmod +x fichier` | Ajoute le droit d'exécution à tous |
| `chmod u+w fichier` | Ajoute l'écriture au propriétaire |
| `chmod go-w fichier` | Retire l'écriture au groupe et aux autres |
| `chown user fichier` | Change le propriétaire |
| `chown user:group fichier` | Change le propriétaire et le groupe |
| `chown -R user dossier` | Change le propriétaire (récursif) |

---

## Redirections et pipes

| Syntaxe | Action |
| ------- | ------ |
| `commande > fichier` | Redirige la sortie dans un fichier (écrase) |
| `commande >> fichier` | Redirige la sortie dans un fichier (ajoute) |
| `commande < fichier` | Utilise un fichier comme entrée |
| `commande 2> fichier` | Redirige les erreurs dans un fichier |
| `commande 2>&1` | Redirige les erreurs vers la sortie standard |
| `commande > fichier 2>&1` | Redirige sortie et erreurs dans un fichier |
| `cmd1 \| cmd2` | Envoie la sortie de cmd1 comme entrée de cmd2 |

```bash
# Exemples
ls -l > liste.txt          # Sauvegarde la liste dans un fichier
echo "fin" >> journal.txt  # Ajoute une ligne au fichier
cat fichier | grep "mot"   # Cherche "mot" dans le fichier
ls | wc -l                 # Compte le nombre de fichiers
```

---

## Recherche

| Commande | Action |
| -------- | ------ |
| `find . -name "*.txt"` | Cherche les fichiers .txt dans le dossier courant |
| `find /home -type f` | Cherche uniquement les fichiers |
| `find /home -type d` | Cherche uniquement les dossiers |
| `find . -name "*.log" -delete` | Supprime tous les fichiers .log trouvés |
| `grep "mot" fichier` | Cherche "mot" dans un fichier |
| `grep -r "mot" dossier` | Cherche "mot" récursivement dans un dossier |
| `grep -i "mot" fichier` | Cherche sans distinction majuscules/minuscules |
| `grep -n "mot" fichier` | Affiche les numéros de lignes |
| `grep -c "mot" fichier` | Compte le nombre de correspondances |
| `which commande` | Affiche le chemin de la commande |
| `locate fichier` | Cherche un fichier dans la base de données système |

---

## Processus

| Commande | Action |
| -------- | ------ |
| `ps` | Liste les processus de l'utilisateur |
| `ps aux` | Liste tous les processus du système |
| `top` | Affiche les processus en temps réel |
| `kill PID` | Arrête un processus par son identifiant |
| `kill -9 PID` | Force l'arrêt d'un processus |
| `killall nom` | Arrête tous les processus portant ce nom |
| `commande &` | Lance une commande en arrière-plan |
| `bg` | Reprend un processus suspendu en arrière-plan |
| `fg` | Ramène un processus en avant-plan |
| `jobs` | Liste les processus en arrière-plan |
| `Ctrl+C` | Interrompt le processus en cours |
| `Ctrl+Z` | Suspend le processus en cours |

---

## Variables et scripts Bash

### Créer et exécuter un script

```bash
#!/bin/bash
# La première ligne (shebang) indique quel interpréteur utiliser
```

```bash
chmod +x mon_script.sh   # Rendre le script exécutable
./mon_script.sh           # Exécuter le script
```

### Variables

```bash
# Déclaration (pas d'espace autour du =)
NOM="Alice"
AGE=25

# Utilisation
echo "Bonjour $NOM"
echo "Tu as ${AGE} ans"

# Lecture depuis l'entrée utilisateur
read -p "Ton nom : " NOM

# Arguments du script
$0    # Nom du script
$1    # Premier argument
$2    # Deuxième argument
$#    # Nombre d'arguments
$@    # Tous les arguments
$?    # Code de retour de la dernière commande (0 = succès)
```

### Conditions

```bash
if [ "$NOM" = "Alice" ]; then
    echo "Bonjour Alice"
elif [ "$NOM" = "Bob" ]; then
    echo "Bonjour Bob"
else
    echo "Bonjour inconnu"
fi
```

### Opérateurs de test

| Opérateur | Description |
| --------- | ----------- |
| `-eq` | Égal (nombres) |
| `-ne` | Différent (nombres) |
| `-lt` | Inférieur (nombres) |
| `-gt` | Supérieur (nombres) |
| `-le` | Inférieur ou égal (nombres) |
| `-ge` | Supérieur ou égal (nombres) |
| `=` | Égal (chaînes) |
| `!=` | Différent (chaînes) |
| `-z` | Chaîne vide |
| `-n` | Chaîne non vide |
| `-f` | Le fichier existe |
| `-d` | Le dossier existe |
| `-r` | Le fichier est lisible |
| `-w` | Le fichier est modifiable |
| `-x` | Le fichier est exécutable |

### Boucles

```bash
# Boucle for
for i in 1 2 3 4 5; do
    echo "Nombre : $i"
done

# Boucle for sur des fichiers
for fichier in *.txt; do
    echo "Fichier : $fichier"
done

# Boucle for avec séquence
for i in $(seq 1 10); do
    echo "$i"
done

# Boucle while
compteur=0
while [ $compteur -lt 5 ]; do
    echo "$compteur"
    compteur=$((compteur + 1))
done
```

### Calculs

```bash
resultat=$((5 + 3))       # Addition
resultat=$((10 / 2))      # Division
resultat=$((7 % 3))       # Modulo
```

---

## Commandes utiles

| Commande | Action |
| -------- | ------ |
| `man commande` | Affiche le manuel de la commande |
| `commande --help` | Affiche l'aide courte |
| `history` | Affiche l'historique des commandes |
| `!!` | Répète la dernière commande |
| `!n` | Répète la commande numéro n de l'historique |
| `alias ll="ls -la"` | Crée un raccourci de commande |
| `unalias ll` | Supprime un alias |
| `export VAR="valeur"` | Définit une variable d'environnement |
| `echo $VAR` | Affiche la valeur d'une variable |
| `source fichier.sh` | Exécute un script dans le shell courant |
| `clear` | Efface le terminal |
| `date` | Affiche la date et l'heure |
| `whoami` | Affiche le nom d'utilisateur courant |
| `hostname` | Affiche le nom de la machine |
| `df -h` | Affiche l'espace disque disponible |
| `du -sh dossier` | Affiche la taille d'un dossier |
| `sort fichier` | Trie les lignes d'un fichier |
| `uniq` | Supprime les doublons consécutifs |
| `cut -d',' -f1 fichier` | Extrait la colonne 1 (séparateur `,`) |
| `diff fichier1 fichier2` | Compare deux fichiers |

---

## Navigation

← Fiche précédente : **[Aide-mémoire Java](01-aide-memoire-java.md)**

→ Fiche suivante : **[Aide-mémoire HTML/CSS](03-aide-memoire-html-css.md)**
