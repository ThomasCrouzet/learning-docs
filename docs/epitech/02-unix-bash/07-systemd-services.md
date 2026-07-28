---
tags:
  - Unix/Bash
  - Intermédiaire
  - Pratique
description: "systemd et gestion des services"
estimated_time: "75 min"
fiche_number: 7
total_fiches: 10
cursus: "Unix/Bash"
---

# 07 - systemd et services

> **En bref** : À la fin de cette fiche, tu sauras gérer les services Linux avec systemctl, créer tes propres unit files et analyser les logs avec journalctl. Lecture estimée : 75 min.

## Prérequis

- Fiche [06 - Gestion des utilisateurs et groupes](06-gestion-utilisateurs.md)
- Fiche [05 - Processus et signaux](05-processus-signaux.md) (notion de processus et signaux)
- Savoir utiliser `sudo`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras démarrer, arrêter et surveiller des services avec `systemctl`, créer un fichier de service personnalisé (unit file), et consulter les logs du système avec `journalctl`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que systemd ?

**Définition** : systemd est le gestionnaire de système et de services de Linux. Il est le premier processus lancé au démarrage (PID 1) et il gère le démarrage de tous les autres services.

**Le problème que systemd résout** :

Sans gestionnaire de services, voici les problèmes rencontrés :

1. **Démarrage manuel** : Il faudrait lancer chaque service à la main après chaque redémarrage.

2. **Pas de surveillance** : Si un service plante, personne ne le redémarre automatiquement.

3. **Dépendances** : Impossible de garantir qu'un service démarre après un autre (exemple : le serveur web après la base de données).

**Comment systemd résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Démarrage manuel | systemd lance automatiquement les services au boot |
| Pas de surveillance | systemd peut redémarrer un service qui plante |
| Dépendances | systemd gère l'ordre de démarrage avec `After=` et `Requires=` |

**Analogie concrète** : systemd est comme le directeur d'un hôtel. Le matin, il s'assure que chaque service ouvre dans le bon ordre : d'abord l'électricité, puis la cuisine, puis le restaurant. Si un service tombe en panne (la machine à café), il le redémarre automatiquement. Il tient aussi un registre (les logs) de tout ce qui se passe.

**Ce que systemd n'est PAS** :

- systemd n'est pas le seul système d'init qui existe. Avant systemd, Linux utilisait SysVinit (scripts dans `/etc/init.d/`). Certaines distributions utilisent encore d'autres systèmes (OpenRC sur Alpine Linux).
- systemd ne gère pas que les services. Il gère aussi les timers (tâches planifiées), les montages de disques, les sockets réseau, et bien plus.

---

### Les unités systemd (units)

**Définition** : Une unité (unit) est un objet que systemd sait gérer. Il en existe plusieurs types.

**Types d'unités courants** :

| Extension | Type | Description |
| --------- | ---- | ----------- |
| `.service` | Service | Un programme ou un démon |
| `.timer` | Timer | Une tâche planifiée (alternative à cron) |
| `.socket` | Socket | Un point d'écoute réseau |
| `.mount` | Montage | Un système de fichiers monté |
| `.target` | Cible | Un groupe d'unités (comme un "niveau de démarrage") |

**Emplacements des unit files** :

| Dossier | Usage |
| ------- | ----- |
| `/lib/systemd/system/` | Fichiers fournis par les paquets (ne pas modifier) |
| `/etc/systemd/system/` | Fichiers personnalisés (prioritaire) |
| `/run/systemd/system/` | Fichiers temporaires (runtime) |

---

### La commande systemctl

**Définition** : `systemctl` est la commande principale pour interagir avec systemd et gérer les services.

**Actions sur un service** :

| Commande | Action |
| -------- | ------ |
| `sudo systemctl start service` | Démarre le service |
| `sudo systemctl stop service` | Arrête le service |
| `sudo systemctl restart service` | Redémarre le service |
| `sudo systemctl reload service` | Recharge la configuration sans redémarrer |
| `systemctl status service` | Affiche l'état du service |
| `sudo systemctl enable service` | Active au démarrage |
| `sudo systemctl disable service` | Désactive au démarrage |
| `systemctl is-active service` | Vérifie si actif |
| `systemctl is-enabled service` | Vérifie si activé au boot |

**Différence entre start et enable** :

| Commande | Effet immédiat | Au prochain boot |
| -------- | -------------- | ---------------- |
| `start` | Démarre le service | Aucun effet |
| `enable` | Aucun effet | Démarre au boot |
| `enable --now` | Démarre le service | Démarre au boot |

**Lister les services** :

| Commande | Action |
| -------- | ------ |
| `systemctl list-units --type=service` | Services chargés |
| `systemctl list-units --type=service --state=running` | Services en cours |
| `systemctl list-units --type=service --state=failed` | Services en échec |
| `systemctl list-unit-files --type=service` | Tous les fichiers de service |

---

### Structure d'un unit file

**Définition** : Un unit file est un fichier de configuration qui décrit un service à systemd.

**Structure de base** :

```text
[Unit]
Description=Description du service
After=network.target
Requires=autre.service

[Service]
Type=simple
ExecStart=/chemin/vers/commande
ExecStop=/chemin/vers/commande_arret
Restart=on-failure
User=utilisateur
Group=groupe
WorkingDirectory=/chemin/travail

[Install]
WantedBy=multi-user.target
```

**Sections expliquées** :

| Section | Rôle |
| ------- | ---- |
| `[Unit]` | Métadonnées et dépendances |
| `[Service]` | Configuration du service lui-même |
| `[Install]` | Quand et comment le service s'active au boot |

**Directives importantes de [Unit]** :

| Directive | Rôle |
| --------- | ---- |
| `Description` | Description lisible par un humain |
| `After` | Démarre après cette unité |
| `Before` | Démarre avant cette unité |
| `Requires` | Dépendance obligatoire (si elle échoue, ce service aussi) |
| `Wants` | Dépendance optionnelle |

**Directives importantes de [Service]** :

| Directive | Rôle |
| --------- | ---- |
| `Type` | Type de service (`simple`, `forking`, `oneshot`, `notify`) |
| `ExecStart` | Commande de démarrage |
| `ExecStop` | Commande d'arrêt |
| `ExecReload` | Commande de rechargement |
| `Restart` | Politique de redémarrage (`no`, `on-failure`, `always`) |
| `RestartSec` | Délai avant redémarrage (en secondes) |
| `User` | Utilisateur qui exécute le service |
| `WorkingDirectory` | Dossier de travail |
| `Environment` | Variables d'environnement |

**Types de service** :

| Type | Comportement |
| ---- | ------------ |
| `simple` | Le processus principal reste au premier plan (défaut) |
| `forking` | Le processus se détache en arrière-plan (fork) |
| `oneshot` | Exécute une commande puis se termine |
| `notify` | Comme `simple`, mais le service signale quand il est prêt |

---

### La commande journalctl

**Définition** : `journalctl` permet de consulter les logs centralisés de systemd (le journal).

**Options courantes** :

| Commande | Action |
| -------- | ------ |
| `journalctl` | Tous les logs |
| `journalctl -u service` | Logs d'un service spécifique |
| `journalctl -u service -f` | Suivre les logs en temps réel |
| `journalctl -u service --since "1 hour ago"` | Logs de la dernière heure |
| `journalctl -u service --since today` | Logs d'aujourd'hui |
| `journalctl -u service -n 50` | Les 50 dernières lignes |
| `journalctl -p err` | Seulement les erreurs |
| `journalctl -b` | Logs depuis le dernier démarrage |
| `journalctl --disk-usage` | Espace occupé par les logs |

**Niveaux de priorité** :

| Niveau | Signification |
| ------ | ------------- |
| `emerg` | Système inutilisable |
| `alert` | Action immédiate requise |
| `crit` | Condition critique |
| `err` | Erreur |
| `warning` | Avertissement |
| `notice` | Événement normal mais significatif |
| `info` | Information |
| `debug` | Débogage |

---

## Étapes Pratiques

### Étape 1 : Vérifier l'état des services

```bash
# Voir l'état d'un service courant
systemctl status sshd

# Lister les services en cours
systemctl list-units --type=service --state=running

# Lister les services en échec
systemctl list-units --type=service --state=failed
```

**Résultat attendu** :

```text
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running) since Mon 2024-01-15 10:00:00 CET; 5h ago
   Main PID: 1234 (sshd)
      Tasks: 1 (limit: 4657)
     Memory: 3.2M
        CPU: 45ms
     CGroup: /system.slice/ssh.service
             └─1234 sshd: /usr/sbin/sshd -D
```

---

### Étape 2 : Démarrer et arrêter un service

```bash
# Arrêter un service (exemple : cron)
sudo systemctl stop cron

# Vérifier qu'il est arrêté
systemctl status cron

# Redémarrer le service
sudo systemctl start cron

# Vérifier qu'il est relancé
systemctl is-active cron
```

**Résultat attendu** :

```text
active
```

---

### Étape 3 : Activer un service au démarrage

```bash
# Vérifier si cron est activé au boot
systemctl is-enabled cron

# Activer au démarrage
sudo systemctl enable cron

# Désactiver au démarrage
sudo systemctl disable cron

# Activer ET démarrer en une seule commande
sudo systemctl enable --now cron
```

**Résultat attendu** :

```text
enabled
```

---

### Étape 4 : Créer un service personnalisé

Crée un script simple que systemd va gérer.

```bash
# Créer le script
sudo tee /usr/local/bin/mon-service.sh > /dev/null << 'EOF'
#!/bin/bash
# Service simple qui écrit l'heure toutes les 10 secondes
while true; do
    echo "$(date) - Mon service tourne" >> /tmp/mon-service.log
    sleep 10
done
EOF

# Rendre exécutable
sudo chmod +x /usr/local/bin/mon-service.sh
```

Crée le unit file :

```bash
sudo tee /etc/systemd/system/mon-service.service > /dev/null << 'EOF'
[Unit]
Description=Mon service de test
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/mon-service.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

```bash
# Recharger la configuration systemd
sudo systemctl daemon-reload

# Démarrer le service
sudo systemctl start mon-service

# Vérifier l'état
systemctl status mon-service
```

**Résultat attendu** :

```text
● mon-service.service - Mon service de test
     Loaded: loaded (/etc/systemd/system/mon-service.service; disabled)
     Active: active (running) since Mon 2024-01-15 15:30:00 CET
   Main PID: 5678 (mon-service.sh)
      Tasks: 2 (limit: 4657)
     Memory: 1.0M
```

---

### Étape 5 : Vérifier les logs du service

```bash
# Voir les logs du service
journalctl -u mon-service

# Suivre les logs en temps réel
journalctl -u mon-service -f

# Appuie sur Ctrl+C pour arrêter le suivi

# Voir le fichier de log créé par le script
cat /tmp/mon-service.log
```

**Résultat attendu** :

```text
Mon Jan 15 15:30:00 2024 - Mon service tourne
Mon Jan 15 15:30:10 2024 - Mon service tourne
Mon Jan 15 15:30:20 2024 - Mon service tourne
```

---

### Étape 6 : Consulter les logs système

```bash
# Logs depuis le dernier démarrage
journalctl -b

# Seulement les erreurs
journalctl -p err --since today

# Logs d'un service spécifique de la dernière heure
journalctl -u sshd --since "1 hour ago"

# Espace occupé par les logs
journalctl --disk-usage
```

**Résultat attendu** :

```text
Archived and active journals take up 48.0M in the file system.
```

---

### Étape 7 : Nettoyer le service de test

```bash
# Arrêter le service
sudo systemctl stop mon-service

# Désactiver au démarrage (si activé)
sudo systemctl disable mon-service

# Supprimer les fichiers
sudo rm /etc/systemd/system/mon-service.service
sudo rm /usr/local/bin/mon-service.sh
sudo rm -f /tmp/mon-service.log

# Recharger la configuration
sudo systemctl daemon-reload
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `systemctl status service` | État d'un service |
| `sudo systemctl start service` | Démarrer |
| `sudo systemctl stop service` | Arrêter |
| `sudo systemctl restart service` | Redémarrer |
| `sudo systemctl enable --now service` | Activer au boot et démarrer |
| `sudo systemctl disable service` | Désactiver au boot |
| `systemctl list-units --type=service` | Lister les services |
| `journalctl -u service -f` | Suivre les logs |
| `journalctl -p err --since today` | Erreurs du jour |
| `sudo systemctl daemon-reload` | Recharger la configuration |

---

## Pièges Fréquents

### Piège 1 : Oublier daemon-reload

⚠️ **Problème** : Après avoir modifié un unit file, systemd utilise toujours l'ancienne version.

✅ **Solution** : Toujours exécuter `daemon-reload` après une modification.

```bash
# Modifier le fichier de service
sudo nano /etc/systemd/system/mon-service.service

# OBLIGATOIRE : recharger la configuration
sudo systemctl daemon-reload

# Redémarrer le service pour appliquer
sudo systemctl restart mon-service
```

---

### Piège 2 : Confondre enable et start

⚠️ **Problème** : `enable` ne démarre pas le service. `start` ne l'active pas au boot.

✅ **Solution** : Utiliser `enable --now` pour les deux.

```bash
# Ne démarre PAS le service (juste au prochain boot)
sudo systemctl enable mon-service

# Ne persiste PAS au redémarrage
sudo systemctl start mon-service

# Fait les deux
sudo systemctl enable --now mon-service
```

---

### Piège 3 : Chemin relatif dans ExecStart

⚠️ **Problème** : systemd exige des chemins absolus dans les unit files.

✅ **Solution** : Toujours utiliser le chemin complet.

```text
# INCORRECT
ExecStart=mon-service.sh

# CORRECT
ExecStart=/usr/local/bin/mon-service.sh
```

---

### Piège 4 : Service qui redémarre en boucle

⚠️ **Problème** : Avec `Restart=always`, un service qui plante immédiatement redémarre sans arrêt.

✅ **Solution** : Utiliser `RestartSec` et `StartLimitIntervalSec` pour limiter les redémarrages.

```text
[Service]
Restart=on-failure
RestartSec=5
StartLimitIntervalSec=60
StartLimitBurst=3
```

Cette configuration limite à 3 redémarrages par minute. Après 3 échecs en 60 secondes, systemd arrête d'essayer.

---

## Checklist de Validation

- [ ] Je sais vérifier l'état d'un service avec `systemctl status`
- [ ] Je sais démarrer, arrêter et redémarrer un service
- [ ] Je comprends la différence entre `enable` et `start`
- [ ] Je sais créer un unit file personnalisé
- [ ] Je sais recharger la configuration avec `daemon-reload`
- [ ] Je sais consulter les logs avec `journalctl`
- [ ] Je sais filtrer les logs par service, priorité et date
- [ ] Je sais lister les services en cours et en échec

---

## Exercice Pratique

**Énoncé** : Crée un service systemd complet avec surveillance.

**Indications** :

1. Crée un script `/usr/local/bin/health-check.sh` qui :
   - Vérifie l'espace disque disponible
   - Vérifie la charge CPU
   - Écrit les résultats dans `/var/log/health-check.log`

2. Crée un unit file pour ce script
3. Configure-le pour redémarrer en cas d'échec (délai : 10 secondes)
4. Démarre et active le service
5. Consulte les logs avec `journalctl`

**Résultat attendu** :

```bash
systemctl status health-check
```

```text
● health-check.service - Vérification de santé du système
     Active: active (running)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier /usr/local/bin/health-check.sh** :

```bash
#!/bin/bash
# Script de vérification de santé du système

LOG_FILE="/var/log/health-check.log"

while true; do
    echo "=== Vérification à $(date) ===" >> "$LOG_FILE"

    # Espace disque
    espace=$(df -h / | tail -1 | awk '{print $5}')
    echo "Espace disque utilisé sur / : $espace" >> "$LOG_FILE"

    # Charge CPU (moyenne sur 1 minute)
    charge=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}')
    echo "Charge CPU (1 min) : $charge" >> "$LOG_FILE"

    # Mémoire utilisée
    memoire=$(free -h | grep Mem | awk '{print $3 "/" $2}')
    echo "Mémoire utilisée : $memoire" >> "$LOG_FILE"

    echo "" >> "$LOG_FILE"

    # Attendre 30 secondes avant la prochaine vérification
    sleep 30
done
```

**Fichier /etc/systemd/system/health-check.service** :

```text
[Unit]
Description=Vérification de santé du système
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/health-check.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Commandes d'installation** :

```bash
# Créer le script
sudo nano /usr/local/bin/health-check.sh
# (copier le contenu ci-dessus)

# Rendre exécutable
sudo chmod +x /usr/local/bin/health-check.sh

# Créer le unit file
sudo nano /etc/systemd/system/health-check.service
# (copier le contenu ci-dessus)

# Recharger, démarrer et activer
sudo systemctl daemon-reload
sudo systemctl enable --now health-check

# Vérifier
systemctl status health-check

# Voir les logs
journalctl -u health-check -f

# Voir le fichier de log
cat /var/log/health-check.log
```

**Nettoyage après l'exercice** :

```bash
sudo systemctl stop health-check
sudo systemctl disable health-check
sudo rm /etc/systemd/system/health-check.service
sudo rm /usr/local/bin/health-check.sh
sudo rm -f /var/log/health-check.log
sudo systemctl daemon-reload
```

---

## Navigation

← Fiche précédente : **[Gestion des utilisateurs et groupes](06-gestion-utilisateurs.md)**

→ Fiche suivante : **[Stockage et systèmes de fichiers](08-stockage-montages.md)**
