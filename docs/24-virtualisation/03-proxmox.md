---
tags:
  - Virtualisation
  - Intermédiaire
  - Pratique
description: "Proxmox VE : installation, interface web, création de VMs et conteneurs LXC, gestion du stockage."
estimated_time: "90 min"
fiche_number: 3
total_fiches: 6
cursus: "Virtualisation"
id: "infrastructure.virtualization.proxmox"
course_id: "infrastructure.virtualization"
content_type: "lesson"
order: 3
---

# 03 - Proxmox VE

> **En bref** : Tu apprendras a installer Proxmox VE, naviguer dans son interface web, créer des machines virtuelles et des conteneurs LXC, et configurer le stockage. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [02 - KVM et QEMU](02-kvm-qemu.md)
- Comprendre les concepts d'hyperviseur de type 1, de VM et de conteneur (fiche [01 - Concepts de virtualisation](01-concepts-virtualisation.md))
- Connaître les bases de l'administration Linux (cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Proxmox VE sur un serveur, utiliser l'interface web pour créer et gérer des VMs et des conteneurs LXC, et configurer les pools de stockage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Proxmox VE ?

**Définition** : Proxmox Virtual Environment (Proxmox VE) est une plateforme de virtualisation open source basée sur Debian Linux. Elle combine KVM pour les machines virtuelles et LXC pour les conteneurs système, le tout gère via une interface web complete.

**Le problème que Proxmox VE résout** :

Sans Proxmox VE, voici les problèmes rencontres :

1. **Gestion en ligne de commande uniquement** : Avec KVM/QEMU et virsh, tu geres tout en ligne de commande. Créer une VM, lui attacher un disque, configurer le réseau - chaque opération necessite une commande spécifique. C'est fonctionnel mais lent et sujet aux erreurs.
2. **Pas de vue d'ensemble** : Avec virsh, tu vois les VMs une par une. Pas de tableau de bord montrant l'utilisation des ressources (CPU, RAM, disque) de toutes les VMs en un coup d'oeil.
3. **Pas de gestion native des conteneurs** : KVM ne gère que les VMs. Si tu veux aussi des conteneurs système (LXC), tu dois installer et configurer LXC séparément.

**Comment Proxmox VE résout ces problèmes** :

| Problème | Solution apportée par Proxmox VE |
| --- | --- |
| Gestion en ligne de commande | Interface web complete pour toutes les opérations (création, configuration, snapshots, migration) |
| Pas de vue d'ensemble | Tableau de bord avec métriques temps réel de chaque VM et conteneur |
| Pas de gestion native des conteneurs | Proxmox integre KVM (VMs) et LXC (conteneurs) dans une seule interface |

**Analogie concrète** : Si KVM + virsh est un ensemble d'outils de mecanique (clefs, tournevis, cric), Proxmox VE est un garage complet avec un pont elevateur, un ordinateur de diagnostic et un système de gestion des pièces. Les outils de base sont les memes (KVM en dessous), mais l'environnement de travail est beaucoup plus organise et productif.

**Ce que Proxmox VE n'est PAS** :

- Proxmox VE n'est pas un cloud provider. Il ne fournit pas de facturation a l'usage, d'API compatible AWS ou de services manages (bases de données, queues). C'est un hyperviseur avec une interface web, pas une plateforme cloud.
- Proxmox VE n'est pas Docker/Podman. Les conteneurs LXC de Proxmox sont des conteneurs système (un système d'exploitation complet) et non des conteneurs d'application. Un conteneur LXC est plus proche d'une VM legere que d'un conteneur Docker.

---

### Qu'est-ce qu'un conteneur LXC ?

**Définition** : LXC (Linux Containers) est une technologie de conteneurs système. Contrairement a Docker (conteneur d'application), un conteneur LXC execute un système d'exploitation Linux complet (init system, services, utilisateurs) en partageant le noyau de l'hôte.

**Comparaison VM vs LXC vs Docker** :

| Critère | VM (KVM) | Conteneur LXC | Conteneur Docker |
| --- | --- | --- | --- |
| Noyau | Propre noyau | Noyau de l'hôte | Noyau de l'hôte |
| Init system | Oui (systemd) | Oui (systemd) | Non (un seul processus) |
| Isolation | Forte (hyperviseur) | Moyenne (namespaces) | Moyenne (namespaces) |
| Démarrage | 30 secondes a minutes | 1 a 3 secondes | Moins d'une seconde |
| RAM minimum | 512 Mo | 64 Mo | Quelques Mo |
| Cas d'usage | OS différents, isolation forte | Services système légers | Applications, microservices |

**Analogie concrète** : Une VM, c'est une maison individuelle avec ses propres fondations, murs et toit. Un conteneur LXC, c'est un appartement dans un immeuble - tu as ton propre espace de vie complet (cuisine, salle de bain) mais tu partages les fondations et la structure de l'immeuble. Un conteneur Docker, c'est une chambre d'hôtel - juste l'essentiel pour une nuit (ou une tache).

---

### Le stockage dans Proxmox

**Définition** : Proxmox VE organise le stockage en pools. Chaque pool est une source de stockage (disque local, NFS, iSCSI) configurée pour accueillir un type de contenu spécifique (images disque, ISO, sauvegardes, templates).

**Types de contenu de stockage** :

| Type | Description | Extension |
| --- | --- | --- |
| **Images disque** (images) | Disques des VMs et conteneurs | `.qcow2`, `.raw` |
| **ISO** (iso) | Images d'installation | `.iso` |
| **Templates** (vztmpl) | Templates de conteneurs LXC | `.tar.gz` |
| **Sauvegardes** (backup) | Fichiers de backup VMs/CTs | `.vma`, `.tar` |
| **Snippets** (snippets) | Fichiers de configuration (cloud-init, hookscripts) | divers |

**Stockages preconfigures** :

A l'installation, Proxmox créé deux stockages :

- **local** : stocke les ISO, templates et sauvegardes (`/var/lib/vz`)
- **local-lvm** : stocke les images disque des VMs et conteneurs (LVM thin pool)

---

## Étapes Pratiques

### Étape 1 : Installer Proxmox VE

Proxmox VE s'installe comme un système d'exploitation complet. Telecharge l'ISO depuis le site officiel.

1. Telecharge l'ISO Proxmox VE depuis `https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso/proxmox-ve-9-2-iso-installer` (version courante en 2026 : Proxmox VE 9.x, basée sur Debian 13). Le fichier s'appelle par exemple `proxmox-ve_9.2-1.iso` : verifie le nom exact sur la page de telechargement avant de lancer `dd`.
2. Crée une clé USB bootable avec `dd` (Linux), Rufus (Windows) ou balenaEtcher (multi-plateforme). Adapte le nom de fichier a l'ISO telechargee, par exemple : `sudo dd if=proxmox-ve_9.2-1.iso of=/dev/sdX bs=4M status=progress oflag=sync`

   ⚠️ **Danger** : `dd` ecrase integralement le peripherique cible. Un mauvais `of=` (par exemple le disque système au lieu de la clé USB) détruit les données sans confirmation. Avant d'exécuter `dd` :

   - Identifie la clé USB avec `lsblk` ou `diskutil list` (macOS)
   - Verifie que `of=` pointe bien vers la clé (ex. `/dev/sdb` ou `/dev/disk4`), **jamais** vers `/dev/sda`, `/dev/nvme0n1` ou le disque de ton système
   - Le nom `sdX` n'est qu'un placeholder : remplace-le par le bon peripherique
   - Si tu n'es pas sur, utilise balenaEtcher ou Rufus, qui affichent une confirmation
3. Demarre le serveur sur la clé USB
4. Suis l'assistant d'installation :
   - Accepte la licence
   - Selectionne le disque d'installation
   - Configure le pays, le fuseau horaire et la langue du clavier
   - Définis le mot de passe root et une adresse e-mail
   - Configure le réseau (nom d'hôte, IP, passerelle, DNS)
5. Valide et attends la fin de l'installation

**Résultat attendu** :

```text
Proxmox VE est installe.
L'ecran affiche l'URL de l'interface web : https://<ip-du-serveur>:8006
```

---

### Étape 2 : Accéder a l'interface web

Ouvre un navigateur et va a l'adresse affichee a la fin de l'installation.

1. Ouvre `https://<ip-du-serveur>:8006`
2. Accepte l'avertissement de certificat auto-signe
3. Connecte-toi avec :
   - **Utilisateur** : `root`
   - **Mot de passe** : celui défini lors de l'installation
   - **Realm** : `Linux PAM standard authentication`

**Résultat attendu** :

```text
Tu vois le tableau de bord Proxmox avec :
- A gauche : l'arborescence du datacenter (noeud, stockages)
- Au centre : le resume du noeud (CPU, RAM, disque)
- En haut : la barre de menu
```

---

### Étape 3 : Desactiver le message d'abonnement (optionnel)

Proxmox affiche un message "No valid subscription" a chaque connexion. Ce message est normal sur la version gratuite.

```bash
# Se connecter en SSH au serveur Proxmox
ssh root@<ip-du-serveur>

# Sur Proxmox VE 9 (Debian 13 / trixie) les depots utilisent le format deb822
# (.sources), pas l'ancien format une ligne (.list). Sur VE 8 (bookworm)
# tu peux encore voir des fichiers .list.

# Desactiver le depot entreprise (necessite un abonnement).
# Le fichier par defaut est pve-enterprise.sources, pas pve-enterprise.list.
# Recopie le bloc ci-dessous (Enabled: no) pour eviter les erreurs 401.
cat > /etc/apt/sources.list.d/pve-enterprise.sources << 'EOF'
Types: deb
URIs: https://enterprise.proxmox.com/debian/pve
Suites: trixie
Components: pve-enterprise
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
Enabled: no
EOF

# Configurer le depot gratuit (no-subscription), format officiel VE 9 :
cat > /etc/apt/sources.list.d/proxmox.sources << 'EOF'
Types: deb
URIs: http://download.proxmox.com/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
EOF

# Mettre a jour les paquets
apt update && apt full-upgrade -y
```

**Résultat attendu** :

```text
Les paquets sont mis a jour depuis le depot no-subscription.
```

---

### Étape 4 : Telecharger un template LXC

Avant de créer un conteneur LXC, tu as besoin d'un template (image de base).

1. Dans l'interface web, clique sur ton nœud (par exemple `pve`)
2. Clique sur **local** (stockage)
3. Clique sur **CT Templates**
4. Clique sur **Templates**
5. Cherche et telecharge `debian-12-standard`

En ligne de commande :

```bash
# Lister les templates disponibles (le suffixe de version change)
pveam available --section system

# Telecharger le template Debian 12 : recopie le nom exact affiche
# par pveam available (exemple courant : debian-12-standard_12.12-1_amd64.tar.zst)
pveam download local debian-12-standard_12.12-1_amd64.tar.zst
```

**Résultat attendu** :

```text
Le template Debian 12 est telecharge dans le stockage local.
```

---

### Étape 5 : Créer un conteneur LXC

**Via l'interface web** :

1. Clique sur **Create CT** (en haut a droite)
2. Onglet **Général** :
   - **CT ID** : 100 (ou le prochain numéro disponible)
   - **Hostname** : `ct-debian`
   - **Password** : un mot de passe pour root
3. Onglet **Template** :
   - **Storage** : local
   - **Template** : debian-12-standard
4. Onglet **Disks** :
   - **Storage** : local-lvm
   - **Disk size** : 8 Go
5. Onglet **CPU** :
   - **Cores** : 1
6. Onglet **Memory** :
   - **Memory** : 512 Mo
   - **Swap** : 512 Mo
7. Onglet **Network** :
   - **Bridge** : vmbr0
   - **IPv4** : DHCP (ou une IP statique)
8. Valide et créé le conteneur

**Via la ligne de commande** :

```bash
# Creer un conteneur LXC
pct create 100 local:vztmpl/debian-12-standard_12.12-1_amd64.tar.zst \
  --hostname ct-debian \
  --password "MotDePasseSecure123" \
  --storage local-lvm \
  --rootfs 8 \
  --cores 1 \
  --memory 512 \
  --swap 512 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp

# Demarrer le conteneur
pct start 100

# Verifier le statut
pct status 100
```

**Résultat attendu** :

```text
# pct status 100
status: running
```

---

### Étape 6 : Se connecter au conteneur LXC

```bash
# Se connecter a la console du conteneur
pct enter 100

# Tu es maintenant dans le conteneur
hostname
```

**Résultat attendu** :

```text
ct-debian
```

```bash
# Sortir du conteneur
exit
```

---

### Étape 7 : Créer une machine virtuelle

**Via l'interface web** :

1. Telecharge d'abord une image ISO :
   - Clique sur **local** (stockage) puis **ISO Images** puis **Upload**
   - Selectionne l'ISO Debian 12 (telechargee sur ton poste). Le nom
     de fichier suit le point release Debian (exemple 2026 : `debian-12.15.0-amd64-netinst.iso` sur [debian.org/releases/bookworm](https://www.debian.org/releases/bookworm/))
2. Clique sur **Create VM** (en haut a droite)
3. Onglet **Général** :
   - **VM ID** : 200
   - **Name** : `vm-debian`
4. Onglet **OS** :
   - **ISO image** : selectionne l'ISO Debian 12
   - **Type** : Linux
   - **Version** : 6.x - 2.6 Kernel
5. Onglet **System** :
   - **SCSI Controller** : VirtIO SCSI single
   - Coche **Qemu Agent**
6. Onglet **Disks** :
   - **Storage** : local-lvm
   - **Disk size** : 20 Go
   - **Format** : Raw (par défaut sur LVM)
7. Onglet **CPU** :
   - **Cores** : 2
   - **Type** : host (meilleures performances)
8. Onglet **Memory** :
   - **Memory** : 2048 Mo
9. Onglet **Network** :
   - **Bridge** : vmbr0
   - **Model** : VirtIO (meilleures performances)
10. Valide et créé la VM

**Via la ligne de commande** :

```bash
# Creer une VM
qm create 200 \
  --name vm-debian \
  --memory 2048 \
  --cores 2 \
  --cpu cputype=host \
  --scsihw virtio-scsi-single \
  --scsi0 local-lvm:20,format=raw \
  --cdrom local:iso/debian-12.15.0-amd64-netinst.iso \
  --net0 virtio,bridge=vmbr0 \
  --boot order=ide2 \
  --agent enabled=1

# Demarrer la VM
qm start 200
```

**Résultat attendu** :

```text
La VM est creee et demarre. Tu peux ouvrir la console dans l'interface web
(onglet Console de la VM) pour suivre l'installation de Debian.
```

---

### Étape 8 : Gérer les VMs et conteneurs via la CLI

```bash
# Lister les VMs
qm list

# Lister les conteneurs
pct list

# Demarrer/Arreter une VM
qm start 200
qm shutdown 200
qm stop 200  # arret force

# Demarrer/Arreter un conteneur
pct start 100
pct shutdown 100
pct stop 100  # arret force

# Voir la configuration d'une VM
qm config 200

# Voir la configuration d'un conteneur
pct config 100
```

**Résultat attendu** :

```text
# qm list
      VMID NAME         STATUS     MEM(MB)    BOOTDISK(GB) PID
       200 vm-debian    running    2048              20.00 12345

# pct list
VMID       Status     Lock         Name
100        running                 ct-debian
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `qm list` | Lister les VMs |
| `qm create <id>` | Créer une VM |
| `qm start <id>` | Démarrer une VM |
| `qm shutdown <id>` | Arreter proprement une VM |
| `qm stop <id>` | Forcer l'arrêt d'une VM |
| `qm config <id>` | Voir la configuration d'une VM |
| `pct list` | Lister les conteneurs LXC |
| `pct create <id>` | Créer un conteneur |
| `pct start <id>` | Démarrer un conteneur |
| `pct enter <id>` | Ouvrir une console dans un conteneur |
| `pct config <id>` | Voir la configuration d'un conteneur |
| `pveam available` | Lister les templates disponibles |
| `pveam download local <template>` | Telecharger un template |
| `pvesm status` | Voir l'état des stockages |

---

## Pièges Fréquents

### Piège 1 : Ne pas installer le QEMU Guest Agent

**Problème** : Tu créés une VM sans le QEMU Guest Agent. Proxmox ne peut pas connaître l'adresse IP de la VM, ne peut pas faire de snapshot coherent du système de fichiers, et l'arrêt propre (`qm shutdown`) ne fonctionne pas toujours.

**Solution** : Installe le QEMU Guest Agent dans chaque VM :

```bash
# Dans la VM (Debian/Ubuntu)
sudo apt install -y qemu-guest-agent
sudo systemctl enable --now qemu-guest-agent
```

Dans Proxmox, verifie que l'option "QEMU Agent" est activee dans les options de la VM.

### Piège 2 : Utiliser le mauvais type de CPU

**Problème** : Tu laisses le type de CPU par défaut (`kvm64`). Les performances sont médiocres car le processeur emule est générique et ne profite pas des instructions avancées de ton processeur réel.

**Solution** : Dans les paramètres de la VM, change le type de CPU en `host`. Cela expose toutes les fonctionnalités de ton processeur réel a la VM.

Attention : avec le type `host`, la VM ne peut pas être migree vers un serveur avec un processeur différent. Si tu prevois de migrer des VMs entre serveurs Proxmox, utilise un type générique comme `x86-64-v3`.

### Piège 3 : Remplir le stockage local-lvm

**Problème** : Tu créés plusieurs VMs et conteneurs sans surveiller l'espace. Le stockage `local-lvm` est plein et plus rien ne fonctionne.

**Solution** : Surveille régulièrement l'espace avec `pvesm status` ou via l'interface web (onglet Storage du nœud). Configure des alertes. Prevois au moins 20% d'espace libre pour les snapshots et les opérations de maintenance.

```bash
# Verifier l'espace des stockages
pvesm status
```

### Piège 4 : Confondre conteneur LXC et conteneur Docker

**Problème** : Tu essaies d'utiliser un conteneur LXC comme un conteneur Docker (un processus par conteneur, image immutable). Ou tu essaies de faire tourner Docker directement dans un conteneur LXC non configure.

**Solution** : Les conteneurs LXC sont des conteneurs système. Utilise-les comme des VMs legeres (installe des paquets, configure des services). Pour Docker dans un LXC, active l'option "nesting" dans les fonctionnalités du conteneur :

```bash
# Activer le nesting pour Docker dans LXC
pct set 100 --features nesting=1
```

---

## Checklist de Validation

- [ ] J'ai installe Proxmox VE (ou compris le processus d'installation)
- [ ] Je sais me connecter a l'interface web
- [ ] J'ai créé un conteneur LXC et je sais m'y connecter
- [ ] J'ai créé une machine virtuelle et installe un système d'exploitation
- [ ] Je sais démarrer, arrêter et lister les VMs et conteneurs
- [ ] Je comprends la difference entre les stockages `local` et `local-lvm`

---

## Exercice Pratique

**Énoncé** : Créé une infrastructure minimale dans Proxmox avec :

1. Un conteneur LXC (ID 101) nomme `web-frontend` avec 256 Mo de RAM, 1 core et 4 Go de disque
2. Une VM (ID 201) nommee `db-server` avec 1024 Mo de RAM, 2 cores et 15 Go de disque
3. Les deux doivent être sur le bridge `vmbr0`
4. Le conteneur doit démarrer automatiquement au boot du serveur

**Indications** :

- Utilise `pct create` pour le conteneur et `qm create` pour la VM
- Utilise `pct set` pour configurer le démarrage automatique
- Verifie avec `pct list` et `qm list`

**Résultat attendu** :

- `pct list` montre le conteneur 101
- `qm list` montre la VM 201
- `pct config 101` montre `onboot: 1`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Créer le conteneur LXC** :

```bash
# Creer le conteneur web-frontend
pct create 101 local:vztmpl/debian-12-standard_12.12-1_amd64.tar.zst \
  --hostname web-frontend \
  --password "MotDePasseSecure123" \
  --storage local-lvm \
  --rootfs 4 \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp

# Configurer le demarrage automatique
pct set 101 --onboot 1

# Demarrer le conteneur
pct start 101
```

**Créer la VM** :

```bash
# Creer la VM db-server
qm create 201 \
  --name db-server \
  --memory 1024 \
  --cores 2 \
  --cpu cputype=host \
  --scsihw virtio-scsi-single \
  --scsi0 local-lvm:15,format=raw \
  --net0 virtio,bridge=vmbr0 \
  --agent enabled=1
```

**Vérification** :

```bash
# Verifier le conteneur
pct list
```

```text
VMID       Status     Lock         Name
101        running                 web-frontend
```

```bash
# Verifier la VM
qm list
```

```text
      VMID NAME         STATUS     MEM(MB)    BOOTDISK(GB) PID
       201 db-server    stopped    1024              15.00 0
```

```bash
# Verifier le demarrage automatique du conteneur
pct config 101 | grep onboot
```

```text
onboot: 1
```

La VM `db-server` est a l'état `stopped` car on n'a pas attache d'ISO pour installer un système d'exploitation. Pour l'installer, attache une ISO et demarre la VM :

```bash
qm set 201 --cdrom local:iso/debian-12.15.0-amd64-netinst.iso
qm set 201 --boot order=ide2
qm start 201
```

---

## Navigation

← Fiche précédente : **[02 - KVM et QEMU](02-kvm-qemu.md)**

→ Fiche suivante : **[04 - Stockage virtualise](04-stockage-virtualise.md)**
