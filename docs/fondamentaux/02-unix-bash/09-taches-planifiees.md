---
tags:
  - Unix/Bash
  - Intermédiaire
  - Pratique
description: "Tâches planifiées et automatisation"
estimated_time: "60 min"
fiche_number: 9
total_fiches: 10
cursus: "Unix/Bash"
id: "fundamentals.unix.taches-planifiees"
course_id: "fundamentals.unix"
content_type: "lesson"
order: 9
---

# 09 - Tâches planifiées et automatisation

> **En bref** : À la fin de cette fiche, tu sauras planifier des tâches automatiques avec cron, crontab, at, les timers systemd et configurer logrotate. Lecture estimée : 60 min.

## Prérequis

- Fiche [08 - Stockage et systèmes de fichiers](08-stockage-montages.md)
- Fiche [07 - systemd et services](07-systemd-services.md) (unit files et systemctl)
- Fiche [04 - Les scripts Bash](04-scripts-bash.md) (écriture de scripts)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras planifier des tâches récurrentes avec `cron` et `crontab`, exécuter des commandes différées avec `at`, créer des timers systemd, et configurer la rotation des logs avec `logrotate`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une tâche planifiée ?

**Définition** : Une tâche planifiée est une commande ou un script qui s'exécute automatiquement à un moment précis ou à intervalles réguliers, sans intervention manuelle.

**Le problème que les tâches planifiées résolvent** :

Sans tâches planifiées, voici les problèmes rencontrés :

1. **Oubli** : Tu dois te rappeler de lancer les sauvegardes chaque nuit.

2. **Indisponibilité** : Il faut être connecté à 3h du matin pour lancer la maintenance.

3. **Incohérence** : Les tâches ne sont pas exécutées au même moment chaque jour.

**Comment les tâches planifiées résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Oubli | La tâche s'exécute automatiquement |
| Indisponibilité | La tâche tourne même si personne n'est connecté |
| Incohérence | L'exécution est à heure fixe, sans variation |

**Analogie concrète** : Une tâche planifiée est comme un réveil programmé. Tu le règles une fois (tous les jours à 7h) et il sonne automatiquement, que tu y penses ou non. Tu peux avoir plusieurs réveils pour différentes tâches : un pour te lever, un pour la réunion de 14h, un pour prendre un médicament.

**Ce qu'une tâche planifiée n'est PAS** :

- Une tâche planifiée n'est pas un service permanent. Un service tourne en continu (comme un serveur web). Une tâche planifiée s'exécute, termine son travail et s'arrête.
- Une tâche planifiée ne garantit pas le succès. Si le script contient une erreur, il échouera. Il faut toujours vérifier les logs.

---

### cron et crontab

**Définition** : `cron` est le service qui exécute les tâches planifiées. `crontab` est le fichier qui contient la liste des tâches d'un utilisateur.

**Format d'une ligne crontab** :

```text
minute  heure  jour_du_mois  mois  jour_de_la_semaine  commande
  *       *         *          *            *           /chemin/script.sh
```

**Signification de chaque champ** :

| Champ | Valeurs | Description |
| ----- | ------- | ----------- |
| Minute | 0-59 | Minute de l'heure |
| Heure | 0-23 | Heure du jour (format 24h) |
| Jour du mois | 1-31 | Jour du mois |
| Mois | 1-12 | Mois de l'année |
| Jour de la semaine | 0-7 | 0 et 7 = dimanche, 1 = lundi |

**Caractères spéciaux** :

| Caractère | Signification | Exemple |
| --------- | ------------- | ------- |
| `*` | Toutes les valeurs | `* * * * *` = chaque minute |
| `,` | Liste de valeurs | `1,15,30` = minutes 1, 15 et 30 |
| `-` | Plage | `1-5` = lundi à vendredi |
| `/` | Intervalle | `*/10` = toutes les 10 unités |

**Exemples courants** :

| Expression | Signification |
| ---------- | ------------- |
| `0 * * * *` | Toutes les heures (à la minute 0) |
| `0 2 * * *` | Tous les jours à 2h du matin |
| `30 8 * * 1-5` | Du lundi au vendredi à 8h30 |
| `0 0 1 * *` | Le premier de chaque mois à minuit |
| `*/5 * * * *` | Toutes les 5 minutes |
| `0 3 * * 0` | Chaque dimanche à 3h du matin |

**Raccourcis cron** :

| Raccourci | Équivalent |
| --------- | ---------- |
| `@reboot` | Au démarrage du système |
| `@daily` | `0 0 * * *` (une fois par jour) |
| `@weekly` | `0 0 * * 0` (une fois par semaine) |
| `@monthly` | `0 0 1 * *` (une fois par mois) |
| `@hourly` | `0 * * * *` (une fois par heure) |

**Commandes crontab** :

| Commande | Action |
| -------- | ------ |
| `crontab -e` | Éditer ta crontab |
| `crontab -l` | Lister tes tâches |
| `crontab -r` | Supprimer toutes tes tâches |
| `sudo crontab -e -u nom` | Éditer la crontab d'un autre utilisateur |

---

### La commande at

**Définition** : `at` permet de planifier une commande unique à exécuter une seule fois à un moment donné. Contrairement à cron qui est récurrent, `at` est ponctuel.

**Différence entre cron et at** :

| cron | at |
| ---- | -- |
| Tâches récurrentes | Tâche unique |
| S'exécute à chaque intervalle | S'exécute une seule fois |
| Configuration permanente | Disparaît après exécution |

**Syntaxe** :

```bash
at heure << 'EOF'
commande1
commande2
EOF
```

**Exemples de formats horaires** :

| Format | Signification |
| ------ | ------------- |
| `at 15:30` | Aujourd'hui à 15h30 |
| `at 15:30 tomorrow` | Demain à 15h30 |
| `at now + 2 hours` | Dans 2 heures |
| `at now + 30 minutes` | Dans 30 minutes |
| `at 10:00 Jan 15` | Le 15 janvier à 10h |

**Gestion des tâches at** :

| Commande | Action |
| -------- | ------ |
| `atq` | Lister les tâches en attente |
| `atrm numéro` | Supprimer une tâche |

---

### Les timers systemd

**Définition** : Un timer systemd est l'alternative moderne à cron. Il utilise un fichier `.timer` qui déclenche un fichier `.service` selon un planning défini.

**Avantages des timers systemd par rapport à cron** :

| cron | Timer systemd |
| ---- | ------------- |
| Pas de logs centralisés | Logs via journalctl |
| Pas de gestion des dépendances | Peut dépendre d'autres services |
| Si la tâche échoue, pas de redémarrage | Peut redémarrer en cas d'échec |
| Pas de notification d'échec intégrée | Intégré dans l'écosystème systemd |

**Structure d'un timer** :

Le timer nécessite deux fichiers :

1. Un fichier `.service` qui définit la commande à exécuter
2. Un fichier `.timer` qui définit quand l'exécuter

**Exemple de fichier .timer** :

```text
[Unit]
Description=Timer pour la sauvegarde quotidienne

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

**Directives du timer** :

| Directive | Signification |
| --------- | ------------- |
| `OnCalendar=daily` | Une fois par jour |
| `OnCalendar=weekly` | Une fois par semaine |
| `OnCalendar=*-*-* 02:00:00` | Tous les jours à 2h |
| `OnBootSec=5min` | 5 minutes après le démarrage |
| `OnUnitActiveSec=1h` | Toutes les heures après le dernier lancement |
| `Persistent=true` | Rattrape les exécutions manquées (si la machine était éteinte) |

---

### logrotate

**Définition** : `logrotate` est un outil qui compresse et supprime automatiquement les anciens fichiers de logs pour éviter qu'ils ne remplissent le disque.

**Le problème résolu** : Les fichiers de logs grandissent indéfiniment. Sans rotation, un serveur web qui écrit 1 Go de logs par jour remplira le disque en quelques semaines.

**Configuration** :

Le fichier principal est `/etc/logrotate.conf`. Les configurations spécifiques sont dans `/etc/logrotate.d/`.

**Exemple de configuration** :

```text
/var/log/mon-app/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0640 root adm
    postrotate
        systemctl reload mon-app
    endscript
}
```

**Directives courantes** :

| Directive | Signification |
| --------- | ------------- |
| `daily` | Rotation quotidienne |
| `weekly` | Rotation hebdomadaire |
| `rotate 7` | Conserver 7 fichiers archivés |
| `compress` | Compresser les anciens logs (gzip) |
| `missingok` | Pas d'erreur si le fichier n'existe pas |
| `notifempty` | Ne pas faire de rotation si le fichier est vide |
| `create 0640 root adm` | Permissions du nouveau fichier |
| `postrotate ... endscript` | Commande à exécuter après la rotation |

---

## Étapes Pratiques

### Étape 1 : Voir ta crontab actuelle

```bash
# Lister tes tâches planifiées
crontab -l

# Voir la crontab système
cat /etc/crontab

# Voir les tâches des dossiers cron
ls /etc/cron.d/
ls /etc/cron.daily/
ls /etc/cron.weekly/
```

**Résultat attendu** :

```text
no crontab for alex
```

(Si tu n'as pas encore de tâche planifiée.)

---

### Étape 2 : Créer ta première tâche cron

```bash
# Créer un script de test
mkdir -p ~/scripts
cat > ~/scripts/cron-test.sh << 'EOF'
#!/bin/bash
echo "$(date) - Tâche cron exécutée" >> ~/cron-test.log
EOF
chmod +x ~/scripts/cron-test.sh

# Ajouter une tâche cron (toutes les minutes pour le test)
crontab -e
```

Ajoute cette ligne dans l'éditeur :

```text
* * * * * /home/<utilisateur>/scripts/cron-test.sh
```

```bash
# Vérifier que la tâche est enregistrée
crontab -l

# Attendre 2 minutes puis vérifier le log
cat ~/cron-test.log
```

**Résultat attendu** (après 2 minutes) :

```text
Mon Jan 15 10:31:00 CET 2024 - Tâche cron exécutée
Mon Jan 15 10:32:00 CET 2024 - Tâche cron exécutée
```

---

### Étape 3 : Supprimer la tâche de test

```bash
# Éditer la crontab et supprimer la ligne de test
crontab -e
# (supprimer la ligne ajoutée à l'étape 2)

# Vérifier
crontab -l

# Nettoyer
rm -f ~/cron-test.log
```

---

### Étape 4 : Utiliser at pour une tâche unique

```bash
# Planifier une commande dans 2 minutes
at now + 2 minutes << 'EOF'
echo "Tâche at exécutée à $(date)" > /tmp/at-test.txt
EOF

# Voir les tâches en attente
atq

# Attendre 2 minutes puis vérifier
cat /tmp/at-test.txt

# Nettoyer
rm -f /tmp/at-test.txt
```

**Résultat attendu** :

```text
job 1 at Mon Jan 15 10:35:00 2024
Tâche at exécutée à Mon Jan 15 10:35:00 CET 2024
```

---

### Étape 5 : Créer un timer systemd

**Créer le script** :

```bash
sudo tee /usr/local/bin/timer-test.sh > /dev/null << 'EOF'
#!/bin/bash
echo "$(date) - Timer systemd exécuté" >> /tmp/timer-test.log
EOF
sudo chmod +x /usr/local/bin/timer-test.sh
```

**Créer le fichier service** :

```bash
sudo tee /etc/systemd/system/timer-test.service > /dev/null << 'EOF'
[Unit]
Description=Test du timer systemd

[Service]
Type=oneshot
ExecStart=/usr/local/bin/timer-test.sh
EOF
```

**Créer le fichier timer** :

```bash
sudo tee /etc/systemd/system/timer-test.timer > /dev/null << 'EOF'
[Unit]
Description=Timer de test (toutes les minutes)

[Timer]
OnCalendar=*-*-* *:*:00
Persistent=true

[Install]
WantedBy=timers.target
EOF
```

**Activer et vérifier** :

```bash
# Recharger la configuration
sudo systemctl daemon-reload

# Activer et démarrer le timer
sudo systemctl enable --now timer-test.timer

# Vérifier l'état du timer
systemctl status timer-test.timer

# Lister tous les timers actifs
systemctl list-timers
```

**Résultat attendu** :

```text
● timer-test.timer - Timer de test (toutes les minutes)
     Loaded: loaded (/etc/systemd/system/timer-test.timer; enabled)
     Active: active (waiting)
    Trigger: Mon 2024-01-15 10:36:00 CET
```

```bash
# Après quelques minutes, voir les logs
cat /tmp/timer-test.log
journalctl -u timer-test.service
```

---

### Étape 6 : Nettoyer le timer de test

```bash
# Arrêter et désactiver
sudo systemctl stop timer-test.timer
sudo systemctl disable timer-test.timer

# Supprimer les fichiers
sudo rm /etc/systemd/system/timer-test.timer
sudo rm /etc/systemd/system/timer-test.service
sudo rm /usr/local/bin/timer-test.sh
sudo rm -f /tmp/timer-test.log

# Recharger
sudo systemctl daemon-reload
```

---

### Étape 7 : Examiner logrotate

```bash
# Voir la configuration principale
cat /etc/logrotate.conf

# Voir les configurations par service
ls /etc/logrotate.d/

# Voir une configuration spécifique
cat /etc/logrotate.d/apt

# Simuler une rotation (dry-run)
sudo logrotate -d /etc/logrotate.conf
```

**Résultat attendu** :

```text
reading config file /etc/logrotate.conf
rotating pattern: /var/log/apt/term.log monthly (12 rotations)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `crontab -e` | Éditer la crontab |
| `crontab -l` | Lister les tâches cron |
| `crontab -r` | Supprimer toutes les tâches |
| `at heure` | Planifier une tâche unique |
| `atq` | Lister les tâches at |
| `atrm numéro` | Supprimer une tâche at |
| `systemctl list-timers` | Lister les timers systemd |
| `sudo logrotate -d config` | Simuler une rotation de logs |
| `sudo logrotate -f config` | Forcer une rotation |

---

## Pièges Fréquents

### Piège 1 : Variables d'environnement manquantes dans cron

⚠️ **Problème** : Cron exécute les tâches avec un environnement minimal. `PATH`, `HOME` et d'autres variables peuvent manquer.

✅ **Solution** : Utiliser des chemins absolus dans les scripts cron.

```text
# INCORRECT (peut ne pas trouver la commande)
* * * * * backup.sh

# CORRECT (chemin absolu)
* * * * * /home/<utilisateur>/scripts/backup.sh

# OU définir le PATH dans la crontab
PATH=/usr/local/bin:/usr/bin:/bin
* * * * * backup.sh
```

---

### Piège 2 : Sortie de cron non redirigée

⚠️ **Problème** : Par défaut, cron envoie la sortie par email (qui n'est souvent pas configuré). Les erreurs passent inaperçues.

✅ **Solution** : Rediriger la sortie vers un fichier de log.

```text
# Pas de sortie visible
* * * * * /home/<utilisateur>/scripts/backup.sh

# Sortie dans un fichier
* * * * * /home/<utilisateur>/scripts/backup.sh >> /tmp/backup.log 2>&1
```

Le `2>&1` redirige aussi les erreurs (stderr) vers le même fichier.

---

### Piège 3 : crontab -r au lieu de crontab -e

⚠️ **Problème** : `crontab -r` supprime TOUTE la crontab sans confirmation. Les touches `r` et `e` sont voisines.

✅ **Solution** : Sauvegarder ta crontab régulièrement.

```bash
# Sauvegarder la crontab
crontab -l > ~/crontab-backup.txt

# En cas de suppression accidentelle, restaurer
crontab ~/crontab-backup.txt
```

---

### Piège 4 : Le caractère % dans cron

⚠️ **Problème** : Le caractère `%` est interprété comme un saut de ligne dans crontab.

✅ **Solution** : Échapper le `%` avec un backslash `\%` ou mettre la commande dans un script.

```text
# INCORRECT (% coupe la commande)
* * * * * date +%Y-%m-%d >> /tmp/date.log

# CORRECT (% échappé)
* * * * * date +\%Y-\%m-\%d >> /tmp/date.log

# MIEUX (utiliser un script)
* * * * * /home/<utilisateur>/scripts/log-date.sh
```

---

## Checklist de Validation

- [ ] Je sais éditer ma crontab avec `crontab -e`
- [ ] Je sais lire et écrire une expression cron (minute heure jour mois jour_semaine)
- [ ] Je sais planifier une tâche unique avec `at`
- [ ] Je sais créer un timer systemd (.timer + .service)
- [ ] Je comprends la différence entre cron, at et les timers systemd
- [ ] Je sais consulter les logs des tâches planifiées
- [ ] Je comprends le fonctionnement de logrotate
- [ ] Je sais rediriger la sortie des tâches cron vers un fichier

---

## Exercice Pratique

**Énoncé** : Crée un système de sauvegarde automatique avec cron.

**Indications** :

1. Crée un script `~/scripts/backup-auto.sh` qui :
   - Crée une archive tar.gz du dossier `~/Documents`
   - Nomme l'archive avec la date du jour
   - Stocke l'archive dans `~/backups/`
   - Supprime les archives de plus de 7 jours
   - Écrit un log de l'opération

2. Planifie ce script pour s'exécuter tous les jours à 2h du matin via crontab

3. Teste le script manuellement d'abord

**Résultat attendu** :

```text
=== Backup du 2024-01-15 ===
Création de ~/backups/backup-2024-01-15.tar.gz
Taille : 2.3M
Nettoyage des archives > 7 jours
Backup terminé avec succès
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier ~/scripts/backup-auto.sh** :

```bash
#!/bin/bash
# Script de sauvegarde automatique des Documents

# Variables
BACKUP_DIR="$HOME/backups"
SOURCE_DIR="$HOME/Documents"
DATE=$(date +%Y-%m-%d)
ARCHIVE="${BACKUP_DIR}/backup-${DATE}.tar.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"
RETENTION=7

# Créer le dossier de backup si nécessaire
mkdir -p "$BACKUP_DIR"

echo "=== Backup du $DATE ===" >> "$LOG_FILE"

# Vérifier que le dossier source existe
if [ ! -d "$SOURCE_DIR" ]; then
    echo "ERREUR : $SOURCE_DIR n'existe pas" >> "$LOG_FILE"
    exit 1
fi

# Créer l'archive
echo "Création de $ARCHIVE" >> "$LOG_FILE"
tar -czf "$ARCHIVE" -C "$HOME" Documents 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
    # Afficher la taille
    taille=$(du -sh "$ARCHIVE" | awk '{print $1}')
    echo "Taille : $taille" >> "$LOG_FILE"
else
    echo "ERREUR : Échec de la création de l'archive" >> "$LOG_FILE"
    exit 1
fi

# Supprimer les archives de plus de 7 jours
echo "Nettoyage des archives > $RETENTION jours" >> "$LOG_FILE"
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +$RETENTION -delete

echo "Backup terminé avec succès" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
```

**Installation** :

```bash
# Rendre exécutable
chmod +x ~/scripts/backup-auto.sh

# Tester manuellement
~/scripts/backup-auto.sh

# Vérifier le résultat
cat ~/backups/backup.log
ls -la ~/backups/

# Ajouter à la crontab
crontab -e
```

**Ligne à ajouter dans la crontab** :

```text
0 2 * * * /home/<utilisateur>/scripts/backup-auto.sh
```

> **Note** : Cron définit `HOME`, `LOGNAME` et `SHELL` depuis `/etc/passwd`. En revanche `PATH` est minimal (`/usr/bin:/bin` en général). Utilise des chemins absolus pour les commandes, ou définis `PATH=` en tête de crontab.

---

## Navigation

← Fiche précédente : **[Stockage et systèmes de fichiers](08-stockage-montages.md)**

→ Fiche suivante : **[Sécurité système de base](10-securite-systeme.md)**
