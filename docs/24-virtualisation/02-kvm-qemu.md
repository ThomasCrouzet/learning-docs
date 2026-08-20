---
tags:
  - Virtualisation
  - Intermédiaire
  - Pratique
description: "KVM et QEMU : installation, création de VM, virt-manager, virsh, réseaux virtuels."
estimated_time: "90 min"
fiche_number: 2
total_fiches: 6
cursus: "Virtualisation"
---

# 02 - KVM et QEMU

> **En bref** : Tu apprendras a installer KVM et QEMU sur Linux, créer et gérer des machines virtuelles avec virsh et virt-manager, et configurer des réseaux virtuels. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [01 - Concepts de virtualisation](01-concepts-virtualisation.md)
- Avoir un processeur avec la virtualisation matérielle activee (verifie avec `kvm-ok`)
- Connaitre les commandes de base Linux (cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md))

## Objectif de cette fiche

A la fin de cette fiche, tu sauras installer KVM et QEMU sur une distribution Debian/Ubuntu, créer des machines virtuelles en ligne de commande avec virsh et via l'interface graphique virt-manager, et configurer un réseau virtuel pour que tes VMs communiquent entre elles et avec l'extérieur.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que KVM ?

**Définition** : KVM (Kernel-based Virtual Machine) est un module du noyau Linux qui transforme Linux en hyperviseur de type 1. Il permet au noyau de gérer directement les machines virtuelles en utilisant les extensions de virtualisation matérielle du processeur (Intel VT-x ou AMD-V).

**Le problème que KVM résout** :

Sans KVM, voici les problèmes rencontres :

1. **Performance médiocre** : Les hyperviseurs de type 2 (VirtualBox) ajoutent une couche entre l'OS hôte et les VMs, ce qui réduit les performances.
2. **Pas d'intégration noyau** : Les solutions tierces fonctionnent en espace utilisateur. Elles ne peuvent pas utiliser directement les optimisations du noyau Linux.
3. **Coût de licence** : Les solutions professionnelles (VMware ESXi avec fonctionnalités avancées) sont payantes.

**Comment KVM résout ces problèmes** :

| Problème | Solution apportée par KVM |
| --- | --- |
| Performance médiocre | KVM est integre au noyau Linux. Les VMs ont un accès quasi direct au processeur via VT-x/AMD-V |
| Pas d'intégration noyau | KVM est un module du noyau. Il beneficie du scheduler, de la gestion mémoire et des pilotes Linux |
| Coût de licence | KVM est open source et inclus dans le noyau Linux. Gratuit et sans restriction |

**Analogie concrète** : VirtualBox, c'est comme conduire un camion a travers un peage automatique qui verifie chaque vehicule un par un. KVM, c'est comme avoir un badge de telepeage integre au vehicule - tu passes sans ralentir parce que le système te reconnaît nativement.

**Ce que KVM n'est PAS** :

- KVM n'est pas un hyperviseur complet a lui seul. KVM fournit uniquement l'acceleration matérielle (la gestion du processeur et de la mémoire). Il a besoin de QEMU pour emuler le reste du matériel (carte réseau, disque, carte graphique).
- KVM n'est pas disponible sur Windows ou macOS. C'est un module spécifique au noyau Linux.

---

### Qu'est-ce que QEMU ?

**Définition** : QEMU (Quick Emulator) est un emulateur et virtualiseur open source. Seul, il emule un ordinateur complet en logiciel (lent). Couple avec KVM, il delegue l'exécution du processeur et de la mémoire a KVM et ne gère que l'emulation des peripheriques (disque, réseau, affichage).

**Le problème que QEMU résout** :

Sans QEMU, KVM seul ne peut pas :

1. **Emuler les peripheriques** : KVM gère le processeur et la mémoire, mais une VM a aussi besoin d'un disque dur, d'une carte réseau, d'un écran, d'un clavier.
2. **Gérer les images disque** : KVM ne sait pas créer ou manipuler des fichiers d'images disque (qcow2, raw).
3. **Fournir une interface utilisateur** : KVM n'a pas d'interface graphique ni de console serie pour interagir avec la VM.

**Comment QEMU résout ces problèmes** :

| Problème | Solution apportée par QEMU |
| --- | --- |
| Emulation des peripheriques | QEMU emule des cartes réseau (virtio-net), des disques (virtio-blk), des cartes graphiques (virtio-gpu) |
| Images disque | QEMU créé et gère les formats qcow2, raw, vmdk via l'outil `qemu-img` |
| Interface utilisateur | QEMU fournit une console serie, un affichage VNC/SPICE et un moniteur de controle |

**Analogie concrète** : Si KVM est le moteur d'une voiture (puissance brute), QEMU est la carrosserie et l'équipement (volant, tableau de bord, phares, boite de vitesses). Le moteur seul ne sert a rien sans carrosserie. La carrosserie sans moteur peut rouler en descente (emulation pure, très lente), mais c'est avec les deux ensemble qu'on obtient une voiture fonctionnelle et performante.

**Ce que QEMU n'est PAS** :

- QEMU n'est pas uniquement un emulateur lent. Quand il est couple avec KVM, il fonctionne a des performances quasi natives. Sa reputation de lenteur vient de son mode emulation pure (sans KVM).
- QEMU n'est pas un outil graphique. C'est un outil en ligne de commande. Pour une interface graphique, on utilise virt-manager.

---

### Qu'est-ce que libvirt ?

**Définition** : libvirt est une couche d'abstraction (API et outils) pour gérer différents hyperviseurs (KVM/QEMU, Xen, VirtualBox, LXC) de maniere uniforme. Elle fournit les outils `virsh` (CLI), `virt-manager` (GUI) et `virt-install` (création de VMs).

**Le problème que libvirt résout** :

Sans libvirt, voici les problèmes rencontres :

1. **Commandes QEMU complexes** : Creer une VM avec QEMU directement necessite une commande avec des dizaines de paramètres (processeur, mémoire, disque, réseau, affichage).
2. **Pas de gestion centralisée** : Chaque VM lancee avec QEMU est un processus indépendant. Pas de moyen simple de lister, démarrer ou arrêter toutes les VMs.
3. **Pas de persistance** : Si le serveur redemarre, les VMs lancees avec QEMU ne redemarrent pas automatiquement.

**Comment libvirt résout ces problèmes** :

| Problème | Solution apportée par libvirt |
| --- | --- |
| Commandes complexes | libvirt stocke la configuration de chaque VM dans un fichier XML. Tu geres les VMs avec des commandes simples (`virsh start`, `virsh stop`) |
| Pas de gestion centralisée | Le daemon `libvirtd` gère toutes les VMs. `virsh list` affiche l'état de chaque VM |
| Pas de persistance | Les VMs définies dans libvirt peuvent être configurées pour démarrer automatiquement au boot avec `virsh autostart` |

**Analogie concrète** : QEMU, c'est un ensemble d'outils de bricolage disperses dans un atelier. libvirt, c'est la boite a outils organisee avec un rangement pour chaque outil et une etiquette sur chaque compartiment. Tu trouves et utilises chaque outil beaucoup plus facilement.

---

### Les réseaux virtuels KVM

**Définition** : Un réseau virtuel KVM est un réseau logiciel créé par libvirt qui permet aux machines virtuelles de communiquer entre elles et avec le monde extérieur, sans necessite de cartes réseau physiques supplémentaires.

**Types de réseaux virtuels** :

| Type | Description | Accès internet | Visible de l'extérieur |
| --- | --- | --- | --- |
| **NAT** (défaut) | Les VMs partagent l'IP de l'hôte via translation d'adresses | Oui | Non (sauf port forwarding) |
| **Bridge** | Les VMs sont connectees directement au réseau physique de l'hôte | Oui | Oui |
| **Isole** | Les VMs communiquent uniquement entre elles | Non | Non |
| **Macvtap** | Les VMs obtiennent une adresse MAC sur le réseau physique | Oui | Oui |

**Le réseau NAT par défaut (`default`)** :

A l'installation de libvirt, un réseau NAT nomme `default` est créé automatiquement :

- Sous-réseau : `192.168.122.0/24`
- Passerelle : `192.168.122.1` (l'hôte)
- DHCP : `192.168.122.2` a `192.168.122.254`
- Les VMs peuvent accéder a Internet via l'hôte
- Les machines extérieures ne peuvent pas atteindre les VMs directement

---

## Étapes Pratiques

### Étape 1 : Installer KVM, QEMU et les outils

```bash
# Mettre a jour les paquets
sudo apt update

# Installer KVM, QEMU et les outils de gestion
sudo apt install -y \
  qemu-kvm \
  libvirt-daemon-system \
  libvirt-clients \
  bridge-utils \
  virtinst \
  virt-manager

# qemu-kvm : QEMU avec support KVM
# libvirt-daemon-system : le daemon libvirtd et sa configuration
# libvirt-clients : les outils CLI (virsh)
# bridge-utils : gestion des bridges reseau
# virtinst : outil virt-install pour creer des VMs
# virt-manager : interface graphique de gestion des VMs
```

**Résultat attendu** :

```text
Les paquets sont installes sans erreur.
```

---

### Étape 2 : Configurer les permissions utilisateur

```bash
# Ajouter ton utilisateur aux groupes necessaires
sudo usermod -aG libvirt $USER
sudo usermod -aG kvm $USER

# Verifier les groupes (tu dois te deconnecter/reconnecter pour que ce soit effectif)
groups $USER
```

**Résultat attendu** :

```text
thomas : thomas libvirt kvm
```

Après avoir ajoute ton utilisateur aux groupes, deconnecte-toi et reconnecte-toi (ou redemarre) pour que les changements prennent effet.

---

### Étape 3 : Verifier que les services fonctionnent

```bash
# Verifier le statut du service libvirtd
sudo systemctl status libvirtd

# Verifier que le module KVM est charge
lsmod | grep kvm
```

**Résultat attendu** :

```text
# systemctl status libvirtd
● libvirtd.service - Virtualization daemon
     Active: active (running)

# lsmod | grep kvm
kvm_intel             364544  0
kvm                  1028096  1 kvm_intel
```

Si tu as un processeur AMD, tu verras `kvm_amd` au lieu de `kvm_intel`.

---

### Étape 4 : Verifier le réseau virtuel par défaut

```bash
# Lister les reseaux virtuels
virsh net-list --all
```

**Résultat attendu** :

```text
 Name      State    Autostart   Persistent
--------------------------------------------
 default   active   yes         yes
```

Si le réseau `default` n'est pas actif :

```bash
# Demarrer le reseau par defaut
virsh net-start default

# Activer le demarrage automatique
virsh net-autostart default
```

```bash
# Voir les details du reseau par defaut
virsh net-info default
```

**Résultat attendu** :

```text
Name:           default
UUID:           xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Active:         yes
Persistent:     yes
Autostart:      yes
Bridge:         virbr0
```

---

### Étape 5 : Telecharger une image ISO

Pour créer une VM, tu as besoin d'une image ISO d'un système d'exploitation. On utilisera Debian 12 :

```bash
# Creer un dossier pour les images ISO
mkdir -p /var/lib/libvirt/images/iso

# Telecharger l'ISO Debian 12 (netinst, ~600 Mo)
sudo wget -P /var/lib/libvirt/images/iso/ \
  https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.9.0-amd64-netinst.iso
```

**Résultat attendu** :

```text
Le fichier debian-12.9.0-amd64-netinst.iso est telecharge dans /var/lib/libvirt/images/iso/.
```

---

### Étape 6 : Creer une machine virtuelle avec virt-install

```bash
# Creer une VM Debian 12 avec virt-install
virt-install \
  --name debian-test \
  --ram 2048 \
  --vcpus 2 \
  --disk path=/var/lib/libvirt/images/debian-test.qcow2,size=20,format=qcow2 \
  --os-variant debian12 \
  --network network=default \
  --graphics vnc,listen=0.0.0.0 \
  --cdrom /var/lib/libvirt/images/iso/debian-12.9.0-amd64-netinst.iso \
  --boot cdrom

# --name : nom de la VM
# --ram : memoire en Mo (2 Go)
# --vcpus : nombre de processeurs virtuels
# --disk : image disque qcow2 de 20 Go (creee automatiquement)
# --os-variant : optimisations specifiques a Debian 12
# --network : connecter au reseau NAT par defaut
# --graphics : activer l'affichage VNC
# --cdrom : image ISO pour l'installation
# --boot : demarrer sur le CD-ROM
```

**Résultat attendu** :

```text
Starting install...
Allocating 'debian-test.qcow2'
Creating domain...
```

L'installation de Debian demarre. Tu peux te connecter a la console VNC pour suivre l'installation.

---

### Étape 7 : Gérer les VMs avec virsh

```bash
# Lister toutes les VMs (actives et inactives)
virsh list --all

# Demarrer une VM
virsh start debian-test

# Arreter une VM proprement (equivalent a appuyer sur le bouton power)
virsh shutdown debian-test

# Forcer l'arret (equivalent a debrancher la prise)
virsh destroy debian-test

# Redemarrer une VM
virsh reboot debian-test

# Voir les informations d'une VM
virsh dominfo debian-test

# Voir la configuration XML complete
virsh dumpxml debian-test
```

**Résultat attendu** :

```text
# virsh list --all
 Id   Name          State
-------------------------------
 1    debian-test   running
```

---

### Étape 8 : Se connecter a la console de la VM

```bash
# Se connecter a la console serie (si configuree dans la VM)
virsh console debian-test

# Pour quitter la console serie : Ctrl+]
```

Pour la connexion VNC (interface graphique) :

```bash
# Trouver le port VNC de la VM
virsh vncdisplay debian-test
```

**Résultat attendu** :

```text
:0
```

Le port VNC est `5900 + numero affiche`. Ici `:0` signifie port `5900`. Connecte-toi avec un client VNC (par exemple `virt-viewer` ou `tigervnc-viewer`) :

```bash
# Se connecter avec virt-viewer
virt-viewer debian-test
```

---

### Étape 9 : Configurer le démarrage automatique

```bash
# Activer le demarrage automatique d'une VM au boot du serveur
virsh autostart debian-test

# Desactiver le demarrage automatique
virsh autostart --disable debian-test

# Verifier le statut autostart
virsh dominfo debian-test | grep "Autostart"
```

**Résultat attendu** :

```text
Autostart:      enable
```

---

### Étape 10 : Creer un réseau virtuel isole

```bash
# Creer un fichier de definition du reseau
cat > /tmp/reseau-isole.xml << 'EOF'
<network>
  <name>isole</name>
  <bridge name="virbr-isole"/>
  <ip address="10.10.10.1" netmask="255.255.255.0">
    <dhcp>
      <range start="10.10.10.2" end="10.10.10.254"/>
    </dhcp>
  </ip>
</network>
EOF

# Definir le reseau dans libvirt
virsh net-define /tmp/reseau-isole.xml

# Demarrer le reseau
virsh net-start isole

# Activer le demarrage automatique
virsh net-autostart isole

# Verifier
virsh net-list --all
```

**Résultat attendu** :

```text
 Name      State    Autostart   Persistent
--------------------------------------------
 default   active   yes         yes
 isole     active   yes         yes
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `virsh list --all` | Lister toutes les VMs |
| `virsh start <vm>` | Démarrer une VM |
| `virsh shutdown <vm>` | Arreter proprement une VM |
| `virsh destroy <vm>` | Forcer l'arrêt d'une VM |
| `virsh reboot <vm>` | Redémarrer une VM |
| `virsh dominfo <vm>` | Informations sur une VM |
| `virsh dumpxml <vm>` | Configuration XML d'une VM |
| `virsh console <vm>` | Connexion a la console serie |
| `virsh vncdisplay <vm>` | Port VNC d'une VM |
| `virsh autostart <vm>` | Activer le démarrage automatique |
| `virsh net-list --all` | Lister les réseaux virtuels |
| `virsh net-info <reseau>` | Informations sur un réseau |
| `virt-install --os-variant list` | Lister les variantes d'OS supportees |
| `qemu-img create -f qcow2 <fichier> <taille>` | Creer une image disque |

---

## Pièges Frequents

### Piège 1 : Permission refusee sur virsh

**Problème** : Tu obtiens l'erreur `error: Failed to connect socket to '/var/run/libvirt/libvirt-sock': Permission denied` quand tu executes `virsh list`.

**Solution** : Ajoute ton utilisateur au groupe `libvirt` et reconnecte-toi :

```bash
sudo usermod -aG libvirt $USER
# Puis deconnexion/reconnexion
```

Si tu es presse, tu peux utiliser `sudo virsh` en attendant, mais la solution propre est de configurer le groupe.

### Piège 2 : Le réseau default n'est pas actif

**Problème** : Tu créés une VM avec `--network network=default` mais tu obtiens l'erreur `error: Network not found: no network with matching name 'default'`.

**Solution** : Le réseau default n'est pas demarre ou pas défini :

```bash
# Verifier
virsh net-list --all

# Si le reseau existe mais est inactif
virsh net-start default
virsh net-autostart default

# Si le reseau n'existe pas du tout
virsh net-define /etc/libvirt/qemu/networks/default.xml
virsh net-start default
virsh net-autostart default
```

### Piège 3 : L'image ISO introuvable

**Problème** : Tu lances `virt-install` avec un chemin vers une ISO qui n'existe pas ou dont libvirt n'a pas la permission de lecture.

**Solution** : Place toujours tes ISO dans `/var/lib/libvirt/images/` (le pool de stockage par défaut de libvirt). Ce dossier a les bonnes permissions. Verifie que le fichier existe et est lisible :

```bash
ls -la /var/lib/libvirt/images/iso/
```

### Piège 4 : Oublier --os-variant

**Problème** : Tu créés une VM sans `--os-variant`. La VM fonctionne mais les performances sont mauvaises car QEMU n'applique pas les optimisations spécifiques au système d'exploitation invite.

**Solution** : Specifie toujours `--os-variant`. Pour trouver la valeur correcte :

```bash
# Lister les variantes disponibles
virt-install --os-variant list | grep debian
```

---

## Checklist de Validation

- [ ] J'ai installe KVM, QEMU, libvirt et virt-manager
- [ ] Mon utilisateur est dans les groupes `libvirt` et `kvm`
- [ ] Le service `libvirtd` est actif
- [ ] Le réseau virtuel `default` est actif et en autostart
- [ ] J'ai créé une VM avec `virt-install`
- [ ] Je sais démarrer, arrêter et lister les VMs avec `virsh`
- [ ] Je sais me connecter a la console d'une VM

---

## Exercice Pratique

**Enonce** : Créé une machine virtuelle Debian 12 nommee `web-server` avec les specifications suivantes :

- 1 Go de RAM
- 1 vCPU
- Disque de 10 Go au format qcow2
- Connectee au réseau NAT par défaut
- Console VNC activee

Après l'installation, configure le démarrage automatique de la VM et créé un réseau isole nomme `backend` avec le sous-réseau `172.16.0.0/24`.

**Indications** :

- Utilise `virt-install` pour créer la VM
- Utilise `virsh autostart` pour le démarrage automatique
- Créé un fichier XML pour le réseau isole, inspire de l'étape 10

**Résultat attendu** :

- `virsh list --all` montre la VM `web-server`
- `virsh dominfo web-server` montre `Autostart: enable`
- `virsh net-list --all` montre les réseaux `default` et `backend`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Creer la VM** :

```bash
virt-install \
  --name web-server \
  --ram 1024 \
  --vcpus 1 \
  --disk path=/var/lib/libvirt/images/web-server.qcow2,size=10,format=qcow2 \
  --os-variant debian12 \
  --network network=default \
  --graphics vnc,listen=0.0.0.0 \
  --cdrom /var/lib/libvirt/images/iso/debian-12.9.0-amd64-netinst.iso \
  --boot cdrom
```

**Configurer le démarrage automatique** :

```bash
virsh autostart web-server
```

**Creer le réseau isole** :

```bash
cat > /tmp/reseau-backend.xml << 'EOF'
<network>
  <name>backend</name>
  <bridge name="virbr-backend"/>
  <ip address="172.16.0.1" netmask="255.255.255.0">
    <dhcp>
      <range start="172.16.0.2" end="172.16.0.254"/>
    </dhcp>
  </ip>
</network>
EOF

virsh net-define /tmp/reseau-backend.xml
virsh net-start backend
virsh net-autostart backend
```

**Vérification** :

```bash
# Verifier la VM
virsh list --all
```

```text
 Id   Name          State
-------------------------------
 -    web-server    shut off
```

```bash
# Verifier l'autostart
virsh dominfo web-server | grep Autostart
```

```text
Autostart:      enable
```

```bash
# Verifier les reseaux
virsh net-list --all
```

```text
 Name      State    Autostart   Persistent
--------------------------------------------
 backend   active   yes         yes
 default   active   yes         yes
```

---

## Navigation

← Fiche précédente : **[01 - Concepts de virtualisation](01-concepts-virtualisation.md)**

→ Fiche suivante : **[03 - Proxmox VE](03-proxmox.md)**
