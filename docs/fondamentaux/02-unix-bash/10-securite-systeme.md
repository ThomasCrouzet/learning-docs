---
tags:
  - Unix/Bash
  - Avancé
  - Pratique
description: "Sécurité système de base"
estimated_time: "75 min"
fiche_number: 10
total_fiches: 10
cursus: "Unix/Bash"
---

# 10 - Sécurité système de base

> **En bref** : À la fin de cette fiche, tu sauras durcir la configuration SSH, protéger un serveur avec fail2ban, comprendre les bases d'AppArmor/SELinux et mettre en place une politique de mises à jour. Lecture estimée : 75 min.

## Prérequis

- Fiche [09 - Tâches planifiées et automatisation](09-taches-planifiees.md)
- Fiche [06 - Gestion des utilisateurs et groupes](06-gestion-utilisateurs.md) (sudo, utilisateurs)
- Fiche [07 - systemd et services](07-systemd-services.md) (systemctl, journalctl)
- Savoir éditer un fichier de configuration avec nano ou vim

## Objectif de cette fiche

À la fin de cette fiche, tu sauras durcir la configuration SSH d'un serveur, installer et configurer fail2ban pour bloquer les attaques par force brute, comprendre les bases des systèmes de contrôle d'accès (AppArmor/SELinux), mettre en place une politique de mises à jour, et auditer la sécurité d'un système.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la sécurité système ?

**Définition** : La sécurité système est l'ensemble des mesures qui protègent un ordinateur ou un serveur contre les accès non autorisés, les modifications malveillantes et les pannes.

**Le problème que la sécurité système résout** :

Sans mesures de sécurité, voici les problèmes rencontrés :

1. **Intrusions** : N'importe qui peut tenter de se connecter à ton serveur et deviner les mots de passe.

2. **Exploitation de failles** : Les logiciels non mis à jour contiennent des vulnérabilités connues.

3. **Escalade de privilèges** : Un programme compromis peut prendre le contrôle total du système.

**Comment la sécurité système résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Intrusions | SSH durci + fail2ban bloquent les attaques |
| Exploitation de failles | Les mises à jour corrigent les vulnérabilités |
| Escalade de privilèges | AppArmor/SELinux limitent ce que chaque programme peut faire |

**Analogie concrète** : La sécurité système est comme la sécurité d'un bâtiment. Le durcissement SSH est la porte blindée avec serrure renforcée. fail2ban est le gardien qui repère quelqu'un qui essaie toutes les clés et le met dehors. AppArmor/SELinux est le système de badges qui limite l'accès de chaque personne aux seules salles dont elle a besoin. Les mises à jour sont la maintenance qui répare les fenêtres cassées avant qu'un cambrioleur ne les repère.

**La sécurité en couches (défense en profondeur)** :

```text
Couche 1 : Pare-feu (filtrer le trafic réseau)
Couche 2 : SSH durci (accès sécurisé)
Couche 3 : fail2ban (bloquer les attaques)
Couche 4 : Permissions Unix (limiter les accès)
Couche 5 : AppArmor/SELinux (confiner les programmes)
Couche 6 : Mises à jour (corriger les failles)
Couche 7 : Audit (détecter les anomalies)
```

Chaque couche protège contre un type d'attaque différent. Si une couche est contournée, les suivantes prennent le relais.

---

### Durcissement SSH

**Définition** : Le durcissement SSH consiste à modifier la configuration du serveur SSH pour le rendre plus résistant aux attaques.

**Le problème résolu** : Par défaut, SSH autorise la connexion par mot de passe en tant que root. Des robots scannent en permanence Internet pour tenter des connexions SSH avec des mots de passe courants (attaque par force brute).

**Fichier de configuration** : `/etc/ssh/sshd_config`

**Paramètres de sécurité essentiels** :

| Paramètre | Valeur recommandée | Explication |
| --------- | ------------------ | ----------- |
| `Port` | Un port non standard (ex: 2222) | Réduit les scans automatiques |
| `PermitRootLogin` | `no` | Interdit la connexion directe en root |
| `PasswordAuthentication` | `no` | Interdit les mots de passe (clés SSH uniquement) |
| `PubkeyAuthentication` | `yes` | Autorise l'authentification par clé |
| `MaxAuthTries` | `3` | Limite les tentatives de connexion |
| `LoginGraceTime` | `30` | 30 secondes max pour s'authentifier |
| `AllowUsers` | `alex` | Seuls les utilisateurs listés peuvent se connecter |
| `X11Forwarding` | `no` | Désactive le transfert graphique (rarement utile sur serveur) |
| `PermitEmptyPasswords` | `no` | Interdit les mots de passe vides |

**Authentification par clé SSH** :

L'authentification par clé est plus sûre que par mot de passe :

1. Tu génères une paire de clés (publique + privée) sur ton ordinateur
2. Tu copies la clé publique sur le serveur
3. À chaque connexion, le serveur vérifie que tu possèdes la clé privée

```bash
# Générer une paire de clés (sur ton ordinateur local)
ssh-keygen -t ed25519 -C "ton@email.com"

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/id_ed25519.pub utilisateur@serveur
```

**Ce que le changement de port n'est PAS** :

- Changer le port SSH n'est pas une mesure de sécurité forte. C'est de la "sécurité par l'obscurité". Un attaquant déterminé peut scanner tous les ports. Mais cela réduit fortement les tentatives automatisées des robots.

---

### fail2ban

**Définition** : fail2ban est un service qui surveille les logs et bloque automatiquement les adresses IP qui échouent trop de tentatives de connexion.

**Le problème que fail2ban résout** :

Sans fail2ban, un attaquant peut essayer des milliers de mots de passe par minute sans être bloqué. Même avec des mots de passe forts, cela consomme des ressources et pollue les logs.

**Comment fail2ban fonctionne** :

```text
1. fail2ban surveille les fichiers de logs (ex: /var/log/auth.log)
2. Il détecte les tentatives de connexion échouées
3. Après X échecs en Y minutes, il bloque l'IP avec iptables/nftables
4. Après un délai, l'IP est automatiquement débloquée
```

**Analogie concrète** : fail2ban est comme un videur de boîte de nuit. Si quelqu'un se présente avec la mauvaise carte d'identité 5 fois de suite, le videur le met dehors et lui interdit l'entrée pendant 10 minutes. Après ce délai, la personne peut réessayer.

**Configuration** : `/etc/fail2ban/jail.local`

**Paramètres clés** :

| Paramètre | Signification |
| --------- | ------------- |
| `bantime` | Durée du bannissement (ex: 10m, 1h, 1d) |
| `findtime` | Fenêtre de temps pour compter les échecs |
| `maxretry` | Nombre d'échecs avant bannissement |
| `ignoreip` | Adresses IP à ne jamais bannir |

---

### AppArmor et SELinux

**Définition** : AppArmor et SELinux sont des systèmes de contrôle d'accès obligatoire (MAC - Mandatory Access Control). Ils limitent ce que chaque programme peut faire, même s'il est exécuté en tant que root.

**Le problème résolu** :

Avec les permissions Unix classiques, un programme lancé par root peut tout faire. Si un service web est compromis et tourne en root, l'attaquant a accès à tout le système. AppArmor/SELinux limitent chaque programme aux seuls fichiers et actions dont il a besoin.

**Différence entre les deux** :

| AppArmor | SELinux |
| -------- | ------- |
| Utilisé par Debian, Ubuntu, SUSE | Utilisé par Red Hat, Fedora, CentOS |
| Basé sur les chemins de fichiers | Basé sur des étiquettes (labels) |
| Plus simple à configurer | Plus puissant mais plus complexe |
| Profils par application | Politique globale du système |

**Modes d'AppArmor** :

| Mode | Description |
| ---- | ----------- |
| `enforce` | Bloque les accès non autorisés |
| `complain` | Enregistre les violations sans bloquer |
| `unconfined` | Pas de restriction |

**Commandes AppArmor** :

| Commande | Action |
| -------- | ------ |
| `sudo aa-status` | Voir les profils actifs |
| `sudo aa-enforce /etc/apparmor.d/profil` | Passer en mode enforce |
| `sudo aa-complain /etc/apparmor.d/profil` | Passer en mode complain |

---

### Mises à jour de sécurité

**Définition** : Les mises à jour de sécurité corrigent les vulnérabilités découvertes dans les logiciels installés.

**Pourquoi les mises à jour sont critiques** :

Quand une vulnérabilité est découverte, elle reçoit un identifiant CVE (Common Vulnerabilities and Exposures). Les attaquants exploitent en priorité les systèmes non mis à jour dont les CVE sont connues.

**Commandes de mise à jour (Debian/Ubuntu)** :

| Commande | Action |
| -------- | ------ |
| `sudo apt update` | Met à jour la liste des paquets disponibles |
| `sudo apt upgrade` | Installe les mises à jour disponibles |
| `sudo apt full-upgrade` | Mise à jour complète (peut supprimer des paquets) |
| `sudo apt autoremove` | Supprime les paquets obsolètes |
| `apt list --upgradable` | Liste les paquets à mettre à jour |

**Mises à jour automatiques** :

```bash
# Installer les mises à jour automatiques de sécurité
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

### Audit de sécurité

**Définition** : Un audit de sécurité est une vérification systématique de la configuration et de l'état du système pour détecter les faiblesses.

**Points à vérifier** :

| Vérification | Commande |
| ------------ | -------- |
| Utilisateurs avec UID 0 (root) | `awk -F: '$3 == 0 {print $1}' /etc/passwd` |
| Fichiers avec SUID/SGID | `find / -perm /6000 -type f 2>/dev/null` |
| Fichiers sans propriétaire | `find / -nouser -o -nogroup 2>/dev/null` |
| Ports en écoute | `ss -tlnp` |
| Services actifs | `systemctl list-units --type=service --state=running` |
| Connexions SSH récentes | `last -a \| head -20` |
| Tentatives de connexion échouées | `sudo lastb \| head -20` |
| Logs de sécurité | `sudo journalctl -u sshd --since today` |

---

## Étapes Pratiques

### Étape 1 : Auditer l'état actuel du système

```bash
# Voir les ports en écoute
ss -tlnp

# Voir les services en cours
systemctl list-units --type=service --state=running | head -20

# Voir les utilisateurs avec accès sudo
grep -E '^sudo|^wheel' /etc/group

# Voir les dernières connexions
last | head -10
```

**Résultat attendu** :

```text
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN 0      128    0.0.0.0:22          0.0.0.0:*         sshd
LISTEN 0      128    [::]:22             [::]:*            sshd
```

---

### Étape 2 : Examiner la configuration SSH actuelle

```bash
# Voir la configuration SSH
sudo cat /etc/ssh/sshd_config | grep -v "^#" | grep -v "^$"

# Vérifier les paramètres critiques
sudo sshd -T | grep -E "permitrootlogin|passwordauthentication|pubkeyauthentication|maxauthtries|port"
```

**Résultat attendu** (valeurs effectives ; `sshd -T` affiche la config compilée, pas seulement le fichier commenté) :

```text
port 22
permitrootlogin prohibit-password
passwordauthentication yes
pubkeyauthentication yes
maxauthtries 6
```

Sur Ubuntu 24.04 / OpenSSH récent, `PermitRootLogin` vaut `prohibit-password` par défaut (connexion root uniquement par clé, pas par mot de passe). Certaines installations plus anciennes affichent encore `permitrootlogin yes`. Le durcissement de l'étape suivante force `no`.

---

### Étape 3 : Durcir la configuration SSH

**ATTENTION** : Avant de modifier SSH, assure-toi d'avoir un accès alternatif au serveur (console physique, console web du fournisseur) au cas où tu te bloquerais.

**Ordre obligatoire** (sinon lockout) :

1. Copie ta clé publique (`ssh-copy-id`) et **teste** une connexion par clé dans un **second terminal** encore ouvert.
2. Garde la session SSH actuelle ouverte pendant tout le redémarrage.
3. Seulement ensuite, désactive `PasswordAuthentication`.

```bash
# Vérifier que ta clé fonctionne AVANT de désactiver les mots de passe
# (dans un second terminal, pendant que le premier reste connecté)
ssh -o PreferredAuthentications=publickey -o PasswordAuthentication=no user@serveur

# Sauvegarder la configuration
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Éditer la configuration
sudo nano /etc/ssh/sshd_config
```

Modifie ces paramètres (uniquement après le test de clé réussi) :

```text
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
PermitEmptyPasswords no
```

```bash
# Vérifier la syntaxe de la configuration
sudo sshd -t

# Si aucune erreur, redémarrer SSH (service souvent nommé ssh sur Ubuntu)
sudo systemctl restart sshd || sudo systemctl restart ssh

# Vérifier que SSH tourne
systemctl status sshd || systemctl status ssh
```

**Résultat attendu** :

```text
● sshd.service - OpenBSD Secure Shell server
     Active: active (running)
```

**IMPORTANT** : Ne ferme pas ta session actuelle avant d'avoir testé la connexion dans un nouveau terminal.

```bash
# Dans un NOUVEAU terminal, tester la connexion
ssh -p 2222 alex@serveur
```

---

### Étape 4 : Installer et configurer fail2ban

```bash
# Installer fail2ban
sudo apt install fail2ban -y

# Créer la configuration locale
sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[DEFAULT]
bantime  = 10m
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8

[sshd]
enabled = true
port    = 2222
logpath = %(sshd_log)s
maxretry = 3
bantime = 1h
EOF

# Démarrer et activer fail2ban
sudo systemctl enable --now fail2ban

# Vérifier l'état
sudo systemctl status fail2ban
```

**Résultat attendu** :

```text
● fail2ban.service - Fail2Ban Service
     Active: active (running)
```

---

### Étape 5 : Surveiller fail2ban

```bash
# Voir l'état général de fail2ban
sudo fail2ban-client status

# Voir l'état du jail SSH
sudo fail2ban-client status sshd

# Voir les IP bannies
sudo fail2ban-client get sshd banip

# Voir les logs de fail2ban
sudo journalctl -u fail2ban --since today
```

**Résultat attendu** :

```text
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  `- File list:        /var/log/auth.log
`- Actions
   |- Currently banned: 0
   |- Total banned:     0
   `- Banned IP list:
```

```bash
# Débannir une IP (si nécessaire)
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

---

### Étape 6 : Vérifier AppArmor

```bash
# Vérifier si AppArmor est actif
sudo aa-status

# Voir les profils chargés
sudo apparmor_status

# Voir les événements AppArmor récents
sudo dmesg | grep apparmor | tail -10
```

**Résultat attendu** :

```text
apparmor module is loaded.
35 profiles are loaded.
35 profiles are in enforce mode.
0 profiles are in complain mode.
4 processes have profiles defined.
```

---

### Étape 7 : Mettre à jour le système

```bash
# Mettre à jour la liste des paquets
sudo apt update

# Voir les mises à jour disponibles
apt list --upgradable

# Installer les mises à jour
sudo apt upgrade -y

# Supprimer les paquets obsolètes
sudo apt autoremove -y

# Vérifier si un redémarrage est nécessaire
[ -f /var/run/reboot-required ] && echo "Redémarrage nécessaire" || echo "Pas de redémarrage nécessaire"
```

**Résultat attendu** :

```text
Reading package lists... Done
Building dependency tree... Done
All packages are up to date.
Pas de redémarrage nécessaire
```

---

### Étape 8 : Créer un script d'audit de sécurité

```bash
cat > ~/scripts/audit-securite.sh << 'SCRIPT'
#!/bin/bash
# Script d'audit de sécurité de base

echo "========================================="
echo "  AUDIT DE SÉCURITÉ - $(date)"
echo "========================================="

echo ""
echo "=== 1. Utilisateurs avec UID 0 ==="
awk -F: '$3 == 0 {print $1}' /etc/passwd

echo ""
echo "=== 2. Utilisateurs pouvant utiliser sudo ==="
grep -E '^sudo|^wheel' /etc/group

echo ""
echo "=== 3. Ports en écoute ==="
ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null

echo ""
echo "=== 4. Services actifs ==="
systemctl list-units --type=service --state=running --no-pager | head -20

echo ""
echo "=== 5. Dernières connexions SSH ==="
last -a | head -10

echo ""
echo "=== 6. Tentatives de connexion échouées ==="
sudo lastb 2>/dev/null | head -10

echo ""
echo "=== 7. Espace disque ==="
df -h | grep "^/dev/"

echo ""
echo "=== 8. Mises à jour disponibles ==="
apt list --upgradable 2>/dev/null | tail -n +2

echo ""
echo "=== 9. État de fail2ban ==="
sudo fail2ban-client status 2>/dev/null || echo "fail2ban non installé"

echo ""
echo "=== 10. État d'AppArmor ==="
sudo aa-status 2>/dev/null | head -5 || echo "AppArmor non disponible"

echo ""
echo "========================================="
echo "  FIN DE L'AUDIT"
echo "========================================="
SCRIPT

chmod +x ~/scripts/audit-securite.sh
```

```bash
# Exécuter l'audit
sudo ~/scripts/audit-securite.sh
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `sudo sshd -t` | Vérifier la config SSH |
| `sudo systemctl restart sshd` | Redémarrer SSH |
| `sudo fail2ban-client status sshd` | État de fail2ban pour SSH |
| `sudo fail2ban-client set sshd unbanip IP` | Débannir une IP |
| `sudo aa-status` | État d'AppArmor |
| `sudo apt update && sudo apt upgrade` | Mises à jour |
| `ss -tlnp` | Ports en écoute |
| `last` | Dernières connexions |
| `sudo lastb` | Connexions échouées |
| `sudo journalctl -u sshd` | Logs SSH |

---

## Pièges Fréquents

### Piège 1 : Se bloquer en durcissant SSH

⚠️ **Problème** : Désactiver `PasswordAuthentication` avant d'avoir configuré les clés SSH te bloque dehors.

✅ **Solution** : Toujours configurer et tester les clés SSH AVANT de désactiver les mots de passe.

```bash
# 1. D'abord, copier ta clé SSH
ssh-copy-id utilisateur@serveur

# 2. Tester la connexion par clé (nouveau terminal)
ssh utilisateur@serveur

# 3. SEULEMENT si la clé fonctionne, désactiver les mots de passe
sudo nano /etc/ssh/sshd_config
# PasswordAuthentication no
sudo systemctl restart sshd
```

---

### Piège 2 : Se bannir avec fail2ban

⚠️ **Problème** : Tu te trompes de mot de passe 3 fois et fail2ban bannit ta propre IP.

✅ **Solution** : Toujours ajouter ton IP dans `ignoreip`.

```text
[DEFAULT]
ignoreip = 127.0.0.1/8 ton_ip_publique
```

```bash
# Si tu es déjà banni, utiliser la console web du serveur
sudo fail2ban-client set sshd unbanip ton_ip
```

---

### Piège 3 : Oublier de tester la config SSH avant de fermer la session

⚠️ **Problème** : Tu modifies SSH, redémarres le service, fermes ta session, et la nouvelle config est incorrecte.

✅ **Solution** : Toujours tester dans un nouveau terminal avant de fermer l'ancien.

```bash
# Terminal 1 : modifier et redémarrer SSH
sudo nano /etc/ssh/sshd_config
sudo sshd -t  # Vérifier la syntaxe
sudo systemctl restart sshd

# Terminal 2 (NOUVEAU) : tester la connexion
ssh -p 2222 alex@serveur

# Si ça fonctionne dans le terminal 2, fermer le terminal 1
# Si ça ne fonctionne pas, restaurer dans le terminal 1
sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
sudo systemctl restart sshd
```

---

### Piège 4 : Négliger les mises à jour

⚠️ **Problème** : Les systèmes non mis à jour sont la cible principale des attaques.

✅ **Solution** : Automatiser les mises à jour de sécurité.

```bash
# Installer les mises à jour automatiques
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

# Vérifier la configuration
cat /etc/apt/apt.conf.d/20auto-upgrades
```

**Configuration attendue** :

```text
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

---

## Checklist de Validation

- [ ] Je sais examiner la configuration SSH avec `sshd -T`
- [ ] Je sais durcir SSH (port, root login, clés SSH)
- [ ] Je sais vérifier la syntaxe SSH avec `sshd -t`
- [ ] Je sais installer et configurer fail2ban
- [ ] Je sais consulter l'état de fail2ban et débannir une IP
- [ ] Je comprends le rôle d'AppArmor/SELinux
- [ ] Je sais mettre à jour le système et activer les mises à jour automatiques
- [ ] Je sais réaliser un audit de sécurité de base

---

## Exercice Pratique

**Énoncé** : Sécurise un serveur en appliquant les bonnes pratiques vues dans cette fiche.

**Indications** :

1. Génère une paire de clés SSH (si ce n'est pas déjà fait)
2. Configure SSH pour :
   - Interdire la connexion root
   - Limiter les tentatives à 3
   - Réduire le temps de grâce à 30 secondes
3. Installe et configure fail2ban pour SSH :
   - Maximum 3 tentatives
   - Bannissement de 1 heure
   - Ajoute ton IP dans ignoreip
4. Vérifie l'état d'AppArmor
5. Lance une mise à jour complète du système
6. Exécute le script d'audit de sécurité
7. Planifie l'audit pour s'exécuter chaque dimanche à 3h du matin (crontab)

**Résultat attendu** : Un serveur avec SSH durci, fail2ban actif, système à jour et un audit hebdomadaire.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Générer une clé SSH (sur ton ordinateur local)
ssh-keygen -t ed25519 -C "ton@email.com"
ssh-copy-id -i ~/.ssh/id_ed25519.pub alex@serveur

# 2. Configurer SSH (sur le serveur)
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo nano /etc/ssh/sshd_config
```

Paramètres à modifier :

```text
PermitRootLogin no
MaxAuthTries 3
LoginGraceTime 30
```

```bash
# Vérifier et appliquer
sudo sshd -t
sudo systemctl restart sshd

# TESTER dans un nouveau terminal avant de continuer

# 3. Installer et configurer fail2ban
sudo apt install fail2ban -y

sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[DEFAULT]
bantime  = 10m
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8 TON_IP_ICI

[sshd]
enabled = true
port    = ssh
maxretry = 3
bantime = 1h
EOF

sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd

# 4. Vérifier AppArmor
sudo aa-status

# 5. Mettre à jour le système
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y

# 6. Exécuter l'audit de sécurité
sudo ~/scripts/audit-securite.sh

# 7. Planifier l'audit hebdomadaire
crontab -e
```

Ajouter cette ligne dans la crontab :

```text
0 3 * * 0 /home/alex/scripts/audit-securite.sh >> /home/alex/logs/audit.log 2>&1
```

```bash
# Créer le dossier de logs
mkdir -p ~/logs

# Vérifier la crontab
crontab -l
```

---

## Fin du cursus Unix/Bash

Tu as terminé les 10 fiches du cursus Unix/Bash. Tu maîtrises maintenant :

- La navigation dans le système de fichiers
- Les permissions et la gestion des utilisateurs
- Les commandes de manipulation de fichiers
- Les scripts Bash
- Les processus et les signaux
- systemd et la gestion des services
- Le stockage et les systèmes de fichiers
- Les tâches planifiées et l'automatisation
- La sécurité système de base

Pour aller plus loin, tu peux continuer avec :

- Le cursus **[Réseaux](../../20-reseaux/index.md)** pour comprendre les protocoles réseau, le DNS et les pare-feux
- Le cursus **[Services système](../../21-services-systeme/index.md)** pour approfondir l'administration de serveurs

---

## Navigation

← Fiche précédente : **[Tâches planifiées et automatisation](09-taches-planifiees.md)**
