---
tags:
  - Unix/Bash
  - Intermédiaire
  - Pratique
description: "Processus et signaux Unix"
estimated_time: "60 min"
fiche_number: 5
total_fiches: 10
cursus: "Unix/Bash"
id: "fundamentals.unix.processus-signaux"
course_id: "fundamentals.unix"
content_type: "lesson"
order: 5
---

# 05 - Processus et signaux

> **En bref** : À la fin de cette fiche, tu sauras lister, surveiller et contrôler les processus Unix, envoyer des signaux et gérer les tâches en arrière-plan. Lecture estimée : 60 min.

## Prérequis

- Fiche [04 - Les scripts Bash](04-scripts-bash.md)
- Savoir exécuter des commandes dans le terminal

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lister les processus en cours, interpréter leur état, envoyer des signaux pour les arrêter ou les suspendre, et gérer des tâches en arrière-plan avec `bg`, `fg` et `nohup`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un processus ?

**Définition** : Un processus est un programme en cours d'exécution. Chaque commande que tu lances dans le terminal crée un processus identifié par un numéro unique appelé PID (Process ID).

**Le problème que la gestion des processus résout** :

Sans gestion des processus, voici les problèmes rencontrés :

1. **Programme bloqué** : Un programme qui ne répond plus monopolise le terminal sans possibilité de l'arrêter.

2. **Ressources épuisées** : Un programme consomme toute la mémoire ou le processeur sans que tu puisses le détecter.

3. **Pas de multitâche** : Tu ne peux exécuter qu'une seule commande à la fois dans un terminal.

**Comment la gestion des processus résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Programme bloqué | Tu peux l'arrêter avec un signal (`kill`) |
| Ressources épuisées | Tu peux surveiller la consommation avec `top` ou `htop` |
| Pas de multitâche | Tu peux envoyer des tâches en arrière-plan avec `&`, `bg`, `fg` |

**Analogie concrète** : Un processus est comme un employé dans un bureau. Chaque employé a un badge avec un numéro (le PID). Le directeur (toi) peut consulter la liste des employés présents (`ps`), surveiller leur activité en temps réel (`top`), ou demander à un employé de s'arrêter (`kill`). Certains employés travaillent au premier plan (devant toi) et d'autres en arrière-plan (dans un autre bureau).

**Ce qu'un processus n'est PAS** :

- Un processus n'est pas un programme. Un programme est un fichier sur le disque. Un processus est ce programme en cours d'exécution en mémoire.
- Un processus n'est pas permanent. Il existe seulement tant que le programme tourne. Quand le programme se termine, le processus disparaît.

---

### La commande ps

**Définition** : `ps` (Process Status) affiche la liste des processus en cours.

**Options courantes** :

| Commande | Action |
| -------- | ------ |
| `ps` | Processus du terminal courant |
| `ps aux` | Tous les processus du système |
| `ps -ef` | Tous les processus (format complet) |
| `ps aux --sort=-%mem` | Triés par consommation mémoire |
| `ps aux --sort=-%cpu` | Triés par consommation CPU |

**Colonnes importantes de `ps aux`** :

| Colonne | Signification |
| ------- | ------------- |
| `USER` | Propriétaire du processus |
| `PID` | Identifiant unique du processus |
| `%CPU` | Pourcentage de processeur utilisé |
| `%MEM` | Pourcentage de mémoire utilisée |
| `VSZ` | Mémoire virtuelle (Ko) |
| `RSS` | Mémoire physique réellement utilisée (Ko) |
| `STAT` | État du processus |
| `START` | Heure de démarrage |
| `COMMAND` | Commande qui a lancé le processus |

**États des processus (colonne STAT)** :

| Lettre | Signification |
| ------ | ------------- |
| `R` | Running - en cours d'exécution |
| `S` | Sleeping - en attente d'un événement |
| `D` | Disk sleep - en attente d'entrée/sortie disque |
| `T` | Stopped - suspendu |
| `Z` | Zombie - terminé mais pas nettoyé |

---

### La commande top et htop

**Définition** : `top` affiche les processus en temps réel, triés par consommation de ressources. `htop` est une version améliorée avec une interface plus lisible.

**Différence entre ps et top** :

| `ps` | `top` / `htop` |
| ---- | --------------- |
| Instantané figé | Mise à jour en temps réel |
| Affiche et quitte | Reste ouvert jusqu'à ce que tu le fermes |
| Pas interactif | Interactif (tri, filtre, kill) |

**Raccourcis dans top** :

| Touche | Action |
| ------ | ------ |
| `q` | Quitter |
| `M` | Trier par mémoire |
| `P` | Trier par CPU |
| `k` | Tuer un processus (demande le PID) |
| `h` | Aide |

**Raccourcis supplémentaires dans htop** :

| Touche | Action |
| ------ | ------ |
| `F2` | Configuration |
| `F3` | Rechercher un processus |
| `F5` | Vue en arbre (processus parents/enfants) |
| `F9` | Envoyer un signal |
| `F10` | Quitter |

---

### Les signaux

**Définition** : Un signal est un message envoyé à un processus pour lui demander d'effectuer une action (s'arrêter, se suspendre, se recharger).

**Le problème que les signaux résolvent** :

Sans signaux, impossible de communiquer avec un processus en cours d'exécution. Si un programme boucle à l'infini ou ne répond plus, tu ne peux rien faire à part redémarrer la machine.

**Signaux courants** :

| Signal | Numéro | Action | Description |
| ------ | ------ | ------ | ----------- |
| `SIGTERM` | 15 | Terminer proprement | Demande au processus de se fermer. Il peut sauvegarder ses données. |
| `SIGKILL` | 9 | Tuer immédiatement | Force l'arrêt. Le processus ne peut pas l'ignorer. |
| `SIGSTOP` | 19 | Suspendre | Met le processus en pause. |
| `SIGCONT` | 18 | Reprendre | Reprend un processus suspendu. |
| `SIGHUP` | 1 | Recharger | Demande de relire la configuration. |
| `SIGINT` | 2 | Interruption | Équivalent de Ctrl+C. |

**Analogie concrète** : Les signaux sont comme des messages envoyés à un employé. SIGTERM est une note polie : "Termine ce que tu fais et rentre chez toi." SIGKILL est un agent de sécurité qui te sort du bâtiment immédiatement, sans te laisser le temps de ranger ton bureau.

**Ce que SIGKILL n'est PAS** :

- SIGKILL n'est pas la solution par défaut. Il faut d'abord essayer SIGTERM pour laisser au processus le temps de se terminer proprement (sauvegarder des données, fermer des connexions).
- SIGKILL ne peut pas être intercepté ni ignoré par le processus. C'est un dernier recours.

---

### La commande kill

**Définition** : `kill` envoie un signal à un processus identifié par son PID.

**Syntaxe** :

| Commande | Action |
| -------- | ------ |
| `kill PID` | Envoie SIGTERM (arrêt propre) |
| `kill -9 PID` | Envoie SIGKILL (arrêt forcé) |
| `kill -15 PID` | Envoie SIGTERM explicitement |
| `kill -1 PID` | Envoie SIGHUP (recharger config) |
| `killall nom` | Tue tous les processus portant ce nom |
| `pkill nom` | Tue les processus dont le nom contient la chaîne |

**Ordre recommandé pour arrêter un processus** :

1. `kill PID` (SIGTERM - arrêt propre)
2. Attendre quelques secondes
3. `kill -9 PID` (SIGKILL - seulement si SIGTERM n'a pas fonctionné)

---

### Tâches en arrière-plan

**Définition** : Une tâche en arrière-plan est un processus qui s'exécute sans bloquer le terminal, te permettant de continuer à taper d'autres commandes.

**Commandes de gestion** :

| Commande | Action |
| -------- | ------ |
| `commande &` | Lance en arrière-plan |
| `Ctrl+Z` | Suspend la tâche en cours |
| `bg` | Reprend la dernière tâche suspendue en arrière-plan |
| `fg` | Ramène la dernière tâche en arrière-plan au premier plan |
| `jobs` | Liste les tâches du terminal courant |
| `fg %1` | Ramène la tâche numéro 1 au premier plan |
| `bg %2` | Reprend la tâche numéro 2 en arrière-plan |

**Analogie concrète** : Imagine que tu cuisines. Quand tu mets un plat au four (`&`), tu es libre de préparer autre chose. Avec `Ctrl+Z`, tu mets un plat en pause (tu éteins le feu sous la casserole). Avec `bg`, tu rallumes le feu sans rester devant. Avec `fg`, tu reviens devant la casserole pour la surveiller.

---

### La commande nohup

**Définition** : `nohup` (No Hang Up) permet de lancer un processus qui continue de tourner même après la fermeture du terminal.

**Le problème résolu** : Normalement, quand tu fermes un terminal, tous les processus lancés depuis ce terminal reçoivent un signal SIGHUP et s'arrêtent. `nohup` empêche ce comportement.

**Syntaxe** :

```bash
nohup commande &
```

La sortie est redirigée automatiquement vers un fichier `nohup.out`.

---

### La commande systemctl status

**Définition** : `systemctl status` affiche l'état d'un service géré par systemd (le gestionnaire de services de Linux).

**Syntaxe** :

```bash
systemctl status nom_du_service
```

Cette commande sera approfondie dans la fiche 07 sur systemd.

---

## Étapes Pratiques

### Étape 1 : Lister les processus

```bash
# Voir les processus du terminal courant
ps

# Voir tous les processus du système
ps aux

# Voir les 10 processus qui consomment le plus de CPU
ps aux --sort=-%cpu | head -11
```

**Résultat attendu** :

```text
  PID TTY          TIME CMD
 1234 pts/0    00:00:00 bash
 5678 pts/0    00:00:00 ps
```

---

### Étape 2 : Surveiller en temps réel

```bash
# Lancer top
top
```

Observe l'affichage pendant quelques secondes. Appuie sur `M` pour trier par mémoire, puis sur `P` pour revenir au tri par CPU. Appuie sur `q` pour quitter.

```bash
# Si htop est installé (meilleure interface)
htop
```

**Résultat attendu** : Un tableau interactif montrant les processus, la consommation CPU et mémoire, avec des barres de progression colorées (pour htop).

---

### Étape 3 : Lancer un processus en arrière-plan

```bash
# Lancer un processus long en arrière-plan
sleep 60 &

# Vérifier qu'il tourne
jobs
```

**Résultat attendu** :

```text
[1]+ 12345
[1]+  Running                 sleep 60 &
```

---

### Étape 4 : Suspendre et reprendre un processus

```bash
# Lancer un processus au premier plan
sleep 120

# Appuyer sur Ctrl+Z pour le suspendre
# Le terminal affiche :
# [1]+  Stopped                 sleep 120

# Reprendre en arrière-plan
bg

# Vérifier
jobs
```

**Résultat attendu** :

```text
[1]+  Running                 sleep 120 &
```

```bash
# Ramener au premier plan
fg

# Appuyer sur Ctrl+C pour l'arrêter
```

---

### Étape 5 : Trouver et tuer un processus

```bash
# Lancer un processus en arrière-plan
sleep 300 &

# Trouver son PID
ps aux | grep sleep

# Tuer proprement (remplacer PID par le numéro trouvé)
kill PID

# Vérifier qu'il est bien arrêté
jobs
```

**Résultat attendu** :

```text
alex      12345  0.0  0.0   5476   580 pts/0    S    10:30   0:00 sleep 300
[1]+  Terminated              sleep 300
```

---

### Étape 6 : Utiliser killall et pkill

```bash
# Lancer plusieurs processus sleep
sleep 200 &
sleep 200 &
sleep 200 &

# Voir les processus sleep
ps aux | grep "sleep 200"

# Tuer tous les processus sleep
killall sleep

# Vérifier
jobs
```

**Résultat attendu** :

```text
[1]   Terminated              sleep 200
[2]-  Terminated              sleep 200
[3]+  Terminated              sleep 200
```

---

### Étape 7 : Utiliser nohup

```bash
# Lancer un processus qui survit à la fermeture du terminal
nohup sleep 600 &

# Vérifier qu'il tourne
ps aux | grep "sleep 600"

# Voir la sortie redirigée
ls -la nohup.out
```

**Résultat attendu** :

```text
nohup: ignoring input and appending output to 'nohup.out'
```

---

### Étape 8 : Vérifier l'état d'un service

```bash
# Voir l'état du service SSH
systemctl status sshd

# Voir l'état du service cron
systemctl status cron
```

**Résultat attendu** :

```text
● sshd.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/sshd.service; enabled)
     Active: active (running) since Mon 2024-01-15 10:00:00 CET
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ps aux` | Liste tous les processus |
| `top` | Surveillance temps réel |
| `htop` | Surveillance améliorée |
| `kill PID` | Arrêt propre (SIGTERM) |
| `kill -9 PID` | Arrêt forcé (SIGKILL) |
| `killall nom` | Arrêter tous les processus par nom |
| `commande &` | Lancer en arrière-plan |
| `Ctrl+Z` | Suspendre |
| `bg` | Reprendre en arrière-plan |
| `fg` | Ramener au premier plan |
| `jobs` | Lister les tâches |
| `nohup commande &` | Processus persistant |

---

## Pièges Fréquents

### Piège 1 : Utiliser kill -9 en premier

⚠️ **Problème** : SIGKILL ne laisse pas le processus sauvegarder ses données ni fermer proprement ses fichiers.

✅ **Solution** : Toujours essayer SIGTERM d'abord, puis SIGKILL si nécessaire.

```bash
# D'abord SIGTERM
kill 12345

# Attendre 5 secondes
sleep 5

# Si toujours vivant, SIGKILL
kill -9 12345
```

---

### Piège 2 : Confondre PID et numéro de tâche

⚠️ **Problème** : `kill` utilise le PID, `fg` et `bg` utilisent le numéro de tâche (avec `%`).

✅ **Solution** : Utiliser `jobs -l` pour voir les PID associés aux numéros de tâches.

```bash
# Voir les tâches avec leurs PID
jobs -l

# Tuer par PID
kill 12345

# Ramener au premier plan par numéro de tâche
fg %1
```

---

### Piège 3 : Processus zombie

⚠️ **Problème** : Un processus zombie (état `Z`) est terminé mais son processus parent n'a pas récupéré son code de retour. `kill -9` ne fonctionne pas sur un zombie.

✅ **Solution** : Identifier le processus parent et le redémarrer ou le tuer.

```bash
# Trouver les zombies
ps aux | grep defunct

# Trouver le parent (PPID)
ps -ef | grep PID_DU_ZOMBIE

# Tuer le parent pour nettoyer le zombie
kill PPID_DU_PARENT
```

---

### Piège 4 : Fermer le terminal tue les processus

⚠️ **Problème** : Tous les processus lancés dans un terminal meurent quand tu le fermes.

✅ **Solution** : Utiliser `nohup` ou `disown` pour détacher un processus du terminal.

```bash
# Avant de fermer le terminal
nohup commande_longue &

# Ou détacher un processus déjà lancé
commande_longue &
disown %1
```

---

## Checklist de Validation

- [ ] Je sais lister les processus avec `ps` et `ps aux`
- [ ] Je sais surveiller les processus en temps réel avec `top` ou `htop`
- [ ] Je sais identifier le PID d'un processus
- [ ] Je sais envoyer des signaux avec `kill`
- [ ] Je connais la différence entre SIGTERM et SIGKILL
- [ ] Je sais lancer un processus en arrière-plan avec `&`
- [ ] Je sais suspendre (`Ctrl+Z`), reprendre (`bg`) et ramener (`fg`) une tâche
- [ ] Je sais utiliser `nohup` pour un processus persistant

---

## Exercice Pratique

**Énoncé** : Crée un script de surveillance des processus.

**Indications** :

1. Crée un script `surveillance.sh` qui :
   - Affiche le nombre total de processus en cours
   - Affiche les 5 processus les plus gourmands en CPU
   - Affiche les 5 processus les plus gourmands en mémoire
   - Vérifie si un processus donné en argument tourne

2. Le script prend un nom de processus en argument optionnel

**Résultat attendu** :

```bash
./surveillance.sh sshd
```

```text
=== Surveillance système ===
Nombre total de processus : 142

=== Top 5 CPU ===
USER       PID %CPU  COMMAND
root         1  2.3  systemd
alex      4567  1.2  firefox
...

=== Top 5 Mémoire ===
USER       PID %MEM  COMMAND
alex      4567  5.1  firefox
alex      7890  3.2  code
...

=== Recherche : sshd ===
Le processus sshd est actif (PID : 1234)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier surveillance.sh** :

```bash
#!/bin/bash
# Script de surveillance des processus

echo "=== Surveillance système ==="

# Compter le nombre total de processus
nb_processus=$(ps aux | wc -l)
# On retire 1 pour l'en-tête
nb_processus=$((nb_processus - 1))
echo "Nombre total de processus : $nb_processus"

echo ""
echo "=== Top 5 CPU ==="
# Afficher l'en-tête puis les 5 premiers triés par CPU
ps aux --sort=-%cpu | head -6

echo ""
echo "=== Top 5 Mémoire ==="
# Afficher l'en-tête puis les 5 premiers triés par mémoire
ps aux --sort=-%mem | head -6

# Vérifier un processus spécifique si un argument est fourni
if [ $# -ge 1 ]; then
    processus=$1
    echo ""
    echo "=== Recherche : $processus ==="

    # Chercher le processus (grep -v grep pour exclure la commande grep elle-même)
    resultat=$(ps aux | grep "$processus" | grep -v grep)

    if [ -n "$resultat" ]; then
        pid=$(echo "$resultat" | head -1 | awk '{print $2}')
        echo "Le processus $processus est actif (PID : $pid)"
    else
        echo "Le processus $processus n'est pas actif"
    fi
fi
```

**Exécution** :

```bash
chmod +x surveillance.sh
./surveillance.sh
./surveillance.sh sshd
./surveillance.sh bash
```

---

## Navigation

← Fiche précédente : **[Les scripts Bash](04-scripts-bash.md)**

→ Fiche suivante : **[Gestion des utilisateurs et groupes](06-gestion-utilisateurs.md)**
