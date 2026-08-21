---
tags:
  - Virtualisation
  - Intermédiaire
  - Pratique
description: "Stockage virtualise : images disque qcow2 et raw, snapshots, migration de VMs, stockage partage NFS et iSCSI."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 6
cursus: "Virtualisation"
---

# 04 - Stockage virtualise

> **En bref** : Tu apprendras a gérer les images disque (qcow2, raw), créer et restaurer des snapshots, migrer des VMs entre serveurs, et configurer du stockage partage avec NFS et iSCSI. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [03 - Proxmox VE](03-proxmox.md)
- Savoir créer et gérer des VMs avec KVM/QEMU (fiche [02 - KVM et QEMU](02-kvm-qemu.md))
- Connaître les bases du système de fichiers Linux (cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir le bon format d'image disque, créer et restaurer des snapshots, migrer une VM d'un serveur a un autre, et configurer un stockage partage NFS ou iSCSI pour tes VMs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une image disque ?

**Définition** : Une image disque est un fichier sur l'hôte qui représente le disque dur d'une machine virtuelle. Pour la VM, ce fichier apparaît comme un vrai disque physique. Toutes les données de la VM (système d'exploitation, applications, fichiers) sont stockées dans ce fichier.

**Le problème que les images disque résolvent** :

Sans images disque, voici les problèmes rencontres :

1. **Un disque physique par VM** : Chaque VM aurait besoin de son propre disque dur physique. Avec 20 VMs, il faudrait 20 disques physiques.
2. **Gaspillage d'espace** : Un disque physique de 100 Go alloue a une VM est entièrement réserve, même si la VM n'utilise que 5 Go.
3. **Migration impossible** : Deplacer un disque physique d'un serveur a un autre necessite d'arrêter la VM, retirer le disque et le reinstaller physiquement.

**Comment les images disque résolvent ces problèmes** :

| Problème | Solution apportée par les images disque |
| --- | --- |
| Un disque physique par VM | Plusieurs images disque coexistent sur un meme disque physique |
| Gaspillage d'espace | Les formats comme qcow2 supportent le thin provisioning : le fichier ne prend que l'espace réellement utilise |
| Migration impossible | Le fichier image peut être copie sur un autre serveur via le réseau |

**Analogie concrète** : Imagine une bibliothèque. Avec des disques physiques, chaque livre (VM) a besoin de sa propre etagere complete (disque physique), même si le livre est fin. Avec les images disque, une seule etagere (disque physique) peut contenir plusieurs livres, et chaque livre ne prend que l'espace qu'il occupe réellement.

---

### Les formats d'images disque

**Définition** : Le format d'image disque définit comment les données de la VM sont stockées dans le fichier. Chaque format a ses avantages et inconvénients.

**Format qcow2 (QEMU Copy-On-Write 2)** :

Le format natif de QEMU/KVM. C'est le format le plus utilise avec KVM.

Caractéristiques :

- **Thin provisioning** : le fichier grandit au fur et a mesure que la VM écrit des données. Un disque de 100 Go ne prend que 5 Go si la VM n'utilise que 5 Go.
- **Snapshots integres** : les snapshots sont stockes directement dans le fichier qcow2.
- **Compression** : les données peuvent être compressees pour réduire la taille du fichier.
- **Chiffrement** : le fichier peut être chiffre avec LUKS.

**Format raw** :

Le format le plus simple. Le fichier est une copie exacte bit a bit du disque virtuel.

Caractéristiques :

- **Performance maximale** : pas de traduction entre le format et le disque réel. Lecture et écriture directes.
- **Pas de thin provisioning** : le fichier fait immédiatement la taille complete du disque (100 Go = 100 Go sur le disque hôte).
- **Pas de snapshots integres** : les snapshots doivent être geres par une couche externe (LVM, ZFS).
- **Compatible universellement** : lisible par n'importe quel outil de virtualisation.

**Autres formats** :

| Format | Utilisation |
| --- | --- |
| **vmdk** | VMware. Utile pour importer/exporter des VMs vers/depuis VMware |
| **vdi** | VirtualBox. Le format natif de VirtualBox |
| **vhdx** | Hyper-V. Le format natif de Microsoft Hyper-V |

**Comparaison qcow2 vs raw** :

| Critère | qcow2 | raw |
| --- | --- | --- |
| Taille initiale | Quelques Ko (grandit au besoin) | Taille complete immédiatement |
| Performance | Bonne (léger overhead) | Maximale (accès direct) |
| Snapshots | Integres dans le fichier | Non (LVM/ZFS nécessaire) |
| Compression | Oui | Non |
| Chiffrement | Oui (LUKS) | Non (chiffrement au niveau OS) |
| Migration | Facile (un fichier a copier) | Facile mais plus gros |
| Cas d'usage | Usage général, développement | Production haute performance |

---

### Qu'est-ce qu'un snapshot ?

**Définition** : Un snapshot est une capture de l'état d'une VM a un instant donne. Il enregistre l'état du disque (et optionnellement de la mémoire) pour pouvoir y revenir plus tard.

**Le problème que les snapshots résolvent** :

Sans snapshots, voici les problèmes rencontres :

1. **Mise a jour risquee** : Tu mets a jour le système d'exploitation de ta VM. La mise à jour échoue et le système ne demarre plus. Tu n'as aucun moyen de revenir en arriere.
2. **Test destructif** : Tu veux tester une configuration dangereuse (supprimer un service, modifier le réseau). Si ca casse, tu dois tout reinstaller.
3. **Sauvegarde longue** : Copier l'intégralité de l'image disque (20 Go, 100 Go) pour chaque point de restauration prend du temps et de l'espace.

**Comment les snapshots résolvent ces problèmes** :

| Problème | Solution apportée par les snapshots |
| --- | --- |
| Mise a jour risquee | Prends un snapshot avant la mise à jour. Si elle échoue, reviens au snapshot en quelques secondes |
| Test destructif | Prends un snapshot, teste, puis reviens au snapshot si le test échoue |
| Sauvegarde longue | Un snapshot ne copie pas tout le disque. Il enregistre uniquement les changements futurs (copy-on-write) |

**Analogie concrète** : Un snapshot, c'est comme le bouton "Sauvegarder" dans un jeu video. Tu sauvegardes avant un passage difficile. Si tu echoues, tu recharges la sauvegarde et tu es exactement au même endroit, comme si rien ne s'était passe.

**Ce qu'un snapshot n'est PAS** :

- Un snapshot n'est pas une sauvegarde (backup). Un snapshot est stocke sur le meme disque que la VM. Si le disque tombe en panne, tu perds la VM ET ses snapshots. Une sauvegarde est une copie sur un support différent.
- Un snapshot n'est pas gratuit en performance. Chaque snapshot ajoute une couche de lecture. Plus tu as de snapshots, plus les lectures sont lentes. Limite-toi a 2 ou 3 snapshots et supprime les anciens.

---

### Qu'est-ce que la migration de VM ?

**Définition** : La migration est le deplacement d'une machine virtuelle d'un serveur physique a un autre. Elle peut être a froid (VM arretee) ou a chaud (live migration, VM en fonctionnement).

**Types de migration** :

| Type | VM pendant la migration | Interruption | Prérequis |
| --- | --- | --- | --- |
| **A froid** (offline) | Arretee | Minutes (copie + démarrage) | Aucun stockage partage nécessaire |
| **A chaud** (live) | En fonctionnement | Moins d'une seconde | Stockage partage obligatoire |

**Migration a froid** : l'image disque et la configuration sont copiees vers le serveur cible. La VM est arretee pendant toute la durée de la copie.

**Migration a chaud (live)** : la mémoire de la VM est copiee incrementalement vers le serveur cible pendant que la VM continue de fonctionner. À la fin, une micro-coupure (millisecondes) permet de basculer l'exécution.

---

### Qu'est-ce que le stockage partage ?

**Définition** : Le stockage partage est un espace de stockage accessible simultanement par plusieurs serveurs via le réseau. Il permet aux VMs de migrer entre serveurs sans copier les images disque.

**Le problème que le stockage partage résout** :

Sans stockage partage :

1. **Migration lente** : Pour migrer une VM, tu dois copier l'image disque complete (des dizaines ou centaines de Go) a travers le réseau.
2. **Pas de live migration** : Sans stockage partage, la VM doit être arretee pour copier le disque. Impossible de migrer sans interruption.
3. **Données dupliquees** : Si la même VM est utilisée sur plusieurs serveurs (basculement), l'image est dupliquee partout.

**Protocoles de stockage partage** :

| Protocole | Type | Fonctionnement | Cas d'usage |
| --- | --- | --- | --- |
| **NFS** | Fichier | Partage de dossiers via le réseau | Simple, petites et moyennes infras |
| **iSCSI** | Bloc | Export de disques bruts via le réseau | Haute performance, grosses infras |
| **Ceph** | Objet/Bloc | Stockage distribue multi-nœud | Clusters Proxmox, haute disponibilité |
| **GlusterFS** | Fichier | Système de fichiers distribue | Stockage redondant multi-serveur |

**Analogie concrète** : Le stockage local, c'est un classeur dans ton bureau. Seul toi peux y accéder. Le stockage partage NFS, c'est une armoire dans un couloir commun : tous les collègues (serveurs) y accedent. Le stockage iSCSI, c'est un coffre-fort partage avec un accès controleal : chaque personne a sa propre clé pour un tiroir dedie.

---

## Étapes Pratiques

### Étape 1 : Créer et gérer des images disque avec qemu-img

```bash
# Creer une image qcow2 de 20 Go (thin provisioned)
qemu-img create -f qcow2 /var/lib/libvirt/images/test-disk.qcow2 20G
```

**Résultat attendu** :

```text
Formatting '/var/lib/libvirt/images/test-disk.qcow2', fmt=qcow2 cluster_size=65536 extended_l2=off compression_type=zlib size=21474836480 lazy_refcounts=off refcount_bits=16
```

```bash
# Verifier la taille reelle du fichier (thin provisioning)
ls -lh /var/lib/libvirt/images/test-disk.qcow2
qemu-img info /var/lib/libvirt/images/test-disk.qcow2
```

**Résultat attendu** :

```text
# ls -lh
-rw-r--r-- 1 root root 193K  test-disk.qcow2

# qemu-img info
image: /var/lib/libvirt/images/test-disk.qcow2
file format: qcow2
virtual size: 20 GiB (21474836480 bytes)
disk size: 196 KiB
```

Le fichier fait 193 Ko sur le disque alors que sa taille virtuelle est de 20 Go. C'est le thin provisioning en action.

---

### Étape 2 : Convertir entre formats

```bash
# Convertir une image qcow2 en raw
qemu-img convert -f qcow2 -O raw \
  /var/lib/libvirt/images/test-disk.qcow2 \
  /var/lib/libvirt/images/test-disk.raw

# Convertir une image raw en qcow2
qemu-img convert -f raw -O qcow2 \
  /var/lib/libvirt/images/test-disk.raw \
  /var/lib/libvirt/images/test-disk-converted.qcow2

# Convertir un VMDK (VMware) en qcow2
qemu-img convert -f vmdk -O qcow2 \
  /var/lib/libvirt/images/vmware-disk.vmdk \
  /var/lib/libvirt/images/vmware-disk.qcow2
```

**Résultat attendu** :

```text
Les fichiers sont convertis sans erreur.
Verifie avec qemu-img info <fichier> que le format est correct.
```

---

### Étape 3 : Redimensionner une image disque

```bash
# Agrandir une image qcow2 de 10 Go
qemu-img resize /var/lib/libvirt/images/test-disk.qcow2 +10G

# Verifier la nouvelle taille
qemu-img info /var/lib/libvirt/images/test-disk.qcow2
```

**Résultat attendu** :

```text
virtual size: 30 GiB (32212254720 bytes)
```

Attention : agrandir l'image disque ne suffit pas. Tu dois aussi agrandir la partition et le système de fichiers a l'intérieur de la VM :

```bash
# Dans la VM : agrandir la partition (exemple avec parted)
sudo parted /dev/vda resizepart 1 100%

# Agrandir le systeme de fichiers ext4
sudo resize2fs /dev/vda1

# Verifier
df -h
```

---

### Étape 4 : Créer et restaurer un snapshot (virsh)

```bash
# Creer un snapshot de la VM (inclut le disque)
virsh snapshot-create-as debian-test \
  --name "avant-mise-a-jour" \
  --description "Snapshot avant la mise a jour systeme"

# Lister les snapshots
virsh snapshot-list debian-test
```

**Résultat attendu** :

```text
 Name                 Creation Time             State
-------------------------------------------------------
 avant-mise-a-jour    2025-01-15 14:30:00 +0100 running
```

```bash
# Voir les details d'un snapshot
virsh snapshot-info debian-test avant-mise-a-jour

# Revenir au snapshot (restaurer l'etat precedent)
virsh snapshot-revert debian-test avant-mise-a-jour

# Supprimer un snapshot
virsh snapshot-delete debian-test avant-mise-a-jour
```

---

### Étape 5 : Créer et restaurer un snapshot (Proxmox)

**Via l'interface web** :

1. Selectionne la VM ou le conteneur
2. Clique sur **Snapshots** dans le menu lateral
3. Clique sur **Take Snapshot**
4. Donne un nom et une description
5. Pour restaurer : selectionne le snapshot et clique sur **Rollback**

**Via la ligne de commande** :

```bash
# Snapshot d'une VM Proxmox
qm snapshot 200 avant-mise-a-jour --description "Avant mise a jour"

# Lister les snapshots
qm listsnapshot 200

# Restaurer un snapshot
qm rollback 200 avant-mise-a-jour

# Supprimer un snapshot
qm delsnapshot 200 avant-mise-a-jour

# Snapshot d'un conteneur LXC
pct snapshot 100 avant-config
pct listsnapshot 100
pct rollback 100 avant-config
```

**Résultat attendu** :

```text
# qm listsnapshot 200
`-- avant-mise-a-jour   Avant mise a jour   2025-01-15T14:30:00Z
 `-- current            You are here!
```

---

### Étape 6 : Configurer un partage NFS

**Sur le serveur NFS** (la machine qui partage le stockage) :

```bash
# Installer le serveur NFS
sudo apt install -y nfs-kernel-server

# Creer le dossier a partager
sudo mkdir -p /srv/nfs/vms

# Configurer les permissions
sudo chown nobody:nogroup /srv/nfs/vms

# Configurer l'export NFS
echo "/srv/nfs/vms 192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports

# Appliquer la configuration
sudo exportfs -rav

# Demarrer le service
sudo systemctl enable --now nfs-kernel-server
```

**Résultat attendu** :

```text
exporting 192.168.1.0/24:/srv/nfs/vms
```

**Sur le client (serveur de virtualisation)** :

```bash
# Installer le client NFS
sudo apt install -y nfs-common

# Creer le point de montage
sudo mkdir -p /mnt/nfs-vms

# Monter le partage NFS
sudo mount -t nfs 192.168.1.10:/srv/nfs/vms /mnt/nfs-vms

# Verifier le montage
df -h /mnt/nfs-vms

# Rendre le montage permanent
echo "192.168.1.10:/srv/nfs/vms /mnt/nfs-vms nfs defaults 0 0" | sudo tee -a /etc/fstab
```

**Ajouter le stockage NFS dans Proxmox** :

```bash
# Via l'interface web : Datacenter > Storage > Add > NFS
# Ou via la ligne de commande :
pvesm add nfs nfs-vms \
  --server 192.168.1.10 \
  --export /srv/nfs/vms \
  --content images,iso,backup,vztmpl

# Verifier
pvesm status
```

**Résultat attendu** :

```text
Name        Type    Status  Total       Used        Available   %
local       dir     active  100.00 GiB  25.00 GiB   71.00 GiB   25.00%
local-lvm   lvmthin active  200.00 GiB  30.00 GiB  170.00 GiB   15.00%
nfs-vms     nfs     active  500.00 GiB  10.00 GiB  490.00 GiB    2.00%
```

---

### Étape 7 : Migrer une VM a froid

```bash
# Migration a froid avec virsh (entre deux hotes KVM)
virsh migrate --offline --persistent debian-test qemu+ssh://192.168.1.20/system

# Migration a froid dans Proxmox (entre deux noeuds du cluster)
# Via l'interface web : clic droit sur la VM > Migrate
# Ou via la CLI :
qm migrate 200 pve2 --online 0
```

Pour migrer manuellement (sans cluster) :

```bash
# Sur le serveur source : exporter la configuration et le disque
virsh dumpxml debian-test > /tmp/debian-test.xml
scp /tmp/debian-test.xml 192.168.1.20:/tmp/
scp /var/lib/libvirt/images/debian-test.qcow2 192.168.1.20:/var/lib/libvirt/images/

# Sur le serveur cible : importer la VM
virsh define /tmp/debian-test.xml
virsh start debian-test
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `qemu-img create -f qcow2 <f> <t>` | Créer une image qcow2 |
| `qemu-img info <fichier>` | Informations sur une image disque |
| `qemu-img convert -f <src> -O <dst>` | Convertir entre formats |
| `qemu-img resize <fichier> +<taille>` | Agrandir une image |
| `virsh snapshot-create-as <vm> --name <n>` | Créer un snapshot (virsh) |
| `virsh snapshot-list <vm>` | Lister les snapshots |
| `virsh snapshot-revert <vm> <snapshot>` | Restaurer un snapshot |
| `qm snapshot <id> <nom>` | Créer un snapshot (Proxmox VM) |
| `qm rollback <id> <snapshot>` | Restaurer un snapshot Proxmox |
| `pct snapshot <id> <nom>` | Créer un snapshot (Proxmox LXC) |
| `pvesm status` | État des stockages Proxmox |

---

## Pièges Fréquents

### Piège 1 : Accumuler trop de snapshots

**Problème** : Tu créés un snapshot avant chaque modification et tu ne les supprimes jamais. Après plusieurs mois, tu as 20 snapshots qui ralentissent les lectures du disque et consomment beaucoup d'espace.

**Solution** : Limite-toi a 2 ou 3 snapshots maximum. Supprime les anciens des qu'ils ne sont plus utiles. Utilise les snapshots pour des opérations ponctuelles (mise à jour, test), pas comme outil de sauvegarde long terme.

```bash
# Lister et supprimer les anciens snapshots
virsh snapshot-list debian-test
virsh snapshot-delete debian-test ancien-snapshot
```

### Piège 2 : Confondre snapshot et backup

**Problème** : Tu comptes sur les snapshots pour protéger tes données. Le disque physique tombe en panne et tu perds tout, y compris les snapshots.

**Solution** : Les snapshots sont sur le meme disque que la VM. Toujours completer par des sauvegardes (backup) sur un stockage distant :

```bash
# Proxmox : sauvegarder une VM sur un stockage externe
vzdump 200 --storage nfs-vms --mode snapshot --compress zstd
```

### Piège 3 : Agrandir l'image sans agrandir la partition

**Problème** : Tu agrandis l'image disque avec `qemu-img resize` mais la VM ne voit pas l'espace supplémentaire. Le système de fichiers a toujours l'ancienne taille.

**Solution** : Après `qemu-img resize`, tu dois aussi agrandir la partition et le système de fichiers a l'intérieur de la VM :

```bash
# Dans la VM
sudo parted /dev/vda resizepart 1 100%
sudo resize2fs /dev/vda1
```

### Piège 4 : NFS sans les bonnes options d'export

**Problème** : Tu configures un export NFS sans `no_root_squash`. Les VMs ne peuvent pas écrire sur le stockage NFS car l'utilisateur root de la VM est converti en `nobody`.

**Solution** : Pour le stockage de VMs, utilise toujours `no_root_squash` dans les options d'export NFS. Cette option est nécessaire car libvirt et Proxmox ecrivent les images disque en tant que root.

---

## Checklist de Validation

- [ ] Je connais la difference entre les formats qcow2 et raw
- [ ] Je sais créer et inspecter des images disque avec `qemu-img`
- [ ] Je sais convertir des images entre formats
- [ ] Je sais créer et restaurer des snapshots avec virsh ou Proxmox
- [ ] Je comprends la difference entre un snapshot et une sauvegarde
- [ ] Je sais configurer un partage NFS pour le stockage de VMs
- [ ] Je comprends les bases de la migration de VMs

---

## Exercice Pratique

**Énoncé** : Realise les opérations suivantes sur une VM existante :

1. Créé une image disque qcow2 nommee `data-disk.qcow2` de 15 Go
2. Attache cette image a une VM existante comme deuxième disque
3. Créé un snapshot de la VM nomme `avant-ajout-donnees`
4. Verifie la taille réelle de l'image sur le disque (thin provisioning)
5. Convertis l'image en format raw et compare les tailles

**Indications** :

- Utilise `qemu-img create` pour créer l'image
- Utilise `virsh attach-disk` pour attacher le disque a la VM
- Utilise `ls -lh` et `qemu-img info` pour vérifier les tailles
- Utilise `qemu-img convert` pour la conversion

**Résultat attendu** :

- L'image qcow2 fait quelques Ko sur le disque (thin provisioning)
- L'image raw fait 15 Go sur le disque (pas de thin provisioning)
- Le snapshot apparaît dans `virsh snapshot-list`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Créer l'image disque** :

```bash
qemu-img create -f qcow2 /var/lib/libvirt/images/data-disk.qcow2 15G
```

```text
Formatting '/var/lib/libvirt/images/data-disk.qcow2', fmt=qcow2 ... size=16106127360
```

**Attacher le disque a la VM** :

```bash
# Attacher comme deuxieme disque (vdb)
virsh attach-disk debian-test \
  /var/lib/libvirt/images/data-disk.qcow2 vdb \
  --driver qemu \
  --subdriver qcow2 \
  --persistent
```

```text
Disk attached successfully
```

**Créer le snapshot** :

```bash
virsh snapshot-create-as debian-test \
  --name "avant-ajout-donnees" \
  --description "Snapshot avant l'ajout de donnees sur le disque supplementaire"
```

**Vérifier les tailles** :

```bash
# Taille reelle du fichier qcow2 (thin provisioned)
ls -lh /var/lib/libvirt/images/data-disk.qcow2
qemu-img info /var/lib/libvirt/images/data-disk.qcow2
```

```text
-rw-r--r-- 1 root root 193K data-disk.qcow2

image: data-disk.qcow2
file format: qcow2
virtual size: 15 GiB (16106127360 bytes)
disk size: 196 KiB
```

L'image qcow2 fait 193 Ko alors que sa taille virtuelle est de 15 Go.

**Convertir en raw** :

```bash
qemu-img convert -f qcow2 -O raw \
  /var/lib/libvirt/images/data-disk.qcow2 \
  /var/lib/libvirt/images/data-disk.raw

ls -lh /var/lib/libvirt/images/data-disk.raw
```

```text
-rw-r--r-- 1 root root 15G data-disk.raw
```

L'image raw fait immédiatement 15 Go sur le disque. C'est la difference fondamentale entre qcow2 (thin provisioning) et raw (allocation complete).

**Vérifier le snapshot** :

```bash
virsh snapshot-list debian-test
```

```text
 Name                   Creation Time             State
---------------------------------------------------------
 avant-ajout-donnees    2025-01-15 15:00:00 +0100 running
```

---

## Navigation

← Fiche précédente : **[03 - Proxmox VE](03-proxmox.md)**

→ Fiche suivante : **[05 - Réseau virtualise](05-reseau-virtualise.md)**
