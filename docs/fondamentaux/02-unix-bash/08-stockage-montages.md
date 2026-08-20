---
tags:
  - Unix/Bash
  - Intermédiaire
  - Concept
description: "Stockage et systèmes de fichiers Linux"
estimated_time: "75 min"
fiche_number: 8
total_fiches: 10
cursus: "Unix/Bash"
---

# 08 - Stockage et systèmes de fichiers

> **En bref** : À la fin de cette fiche, tu sauras partitionner un disque, créer un système de fichiers, monter des partitions et surveiller l'espace disque. Lecture estimée : 75 min.

## Prérequis

- Fiche [07 - systemd et services](07-systemd-services.md)
- Fiche [01 - Le système de fichiers Unix/Linux](01-systeme-fichiers.md) (arborescence `/`)
- Savoir utiliser `sudo`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser `fdisk` et `parted` pour partitionner un disque, créer un système de fichiers avec `mkfs`, monter des partitions avec `mount` et `/etc/fstab`, surveiller l'espace avec `df` et `du`, et comprendre les bases de LVM et du RAID.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un système de fichiers ?

**Définition** : Un système de fichiers (filesystem) est la méthode utilisée pour organiser et stocker les données sur un disque. Il définit comment les fichiers sont nommés, rangés et retrouvés.

**Le problème que les systèmes de fichiers résolvent** :

Sans système de fichiers, voici les problèmes rencontrés :

1. **Données brutes** : Le disque ne contient que des zéros et des uns, sans structure.

2. **Pas de noms** : Impossible de donner un nom à un fichier ou de le retrouver.

3. **Pas de hiérarchie** : Impossible de créer des dossiers pour organiser les fichiers.

**Comment les systèmes de fichiers résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Données brutes | Le système de fichiers ajoute une structure logique au disque |
| Pas de noms | Chaque fichier a un nom et des métadonnées (taille, date, permissions) |
| Pas de hiérarchie | Les dossiers organisent les fichiers en arborescence |

**Analogie concrète** : Un disque dur sans système de fichiers est comme un terrain vague. Tu peux y poser des objets, mais sans adresse ni rangement. Le système de fichiers est comme construire un entrepôt avec des étagères étiquetées, des allées numérotées et un registre d'inventaire. Tu sais exactement où chaque objet se trouve.

**Systèmes de fichiers courants sous Linux** :

| Système | Usage | Caractéristiques |
| ------- | ----- | ---------------- |
| `ext4` | Linux standard | Le plus courant, fiable, journalisé |
| `xfs` | Serveurs, gros fichiers | Performant pour les gros volumes |
| `btrfs` | Moderne | Snapshots, compression, sous-volumes |
| `vfat` | Clés USB | Compatible Windows/Mac/Linux |
| `ntfs` | Disques Windows | Lecture native, écriture via ntfs-3g |
| `swap` | Mémoire virtuelle | Extension de la RAM sur disque |

---

### Disques, partitions et montages

**Définition** : Un disque physique est découpé en partitions, chaque partition contient un système de fichiers, et chaque système de fichiers est monté sur un point de montage dans l'arborescence.

**Le processus complet** :

```text
Disque physique (/dev/sda)
  → Partition 1 (/dev/sda1) → ext4 → montée sur /
  → Partition 2 (/dev/sda2) → ext4 → montée sur /home
  → Partition 3 (/dev/sda3) → swap → mémoire virtuelle
```

**Nommage des disques** :

| Nom | Type |
| --- | ---- |
| `/dev/sda` | Premier disque SATA/SCSI |
| `/dev/sdb` | Deuxième disque SATA/SCSI |
| `/dev/sda1` | Première partition du premier disque |
| `/dev/sda2` | Deuxième partition du premier disque |
| `/dev/nvme0n1` | Premier disque NVMe |
| `/dev/nvme0n1p1` | Première partition du premier NVMe |
| `/dev/vda` | Premier disque virtuel (VM/VPS) |

**Qu'est-ce qu'un point de montage ?**

**Définition** : Un point de montage est un dossier vide dans l'arborescence où le contenu d'une partition devient accessible.

**Analogie concrète** : Imagine un bâtiment (l'arborescence `/`). Chaque disque est comme un container de stockage extérieur. Monter un disque, c'est comme connecter le container à une porte du bâtiment (le point de montage). Une fois connecté, tu accèdes au contenu du container en passant par cette porte.

---

### La commande df

**Définition** : `df` (Disk Free) affiche l'espace disponible sur les systèmes de fichiers montés.

**Options courantes** :

| Commande | Action |
| -------- | ------ |
| `df` | Espace disque en blocs |
| `df -h` | Espace en taille lisible (Ko, Mo, Go) |
| `df -T` | Affiche le type de système de fichiers |
| `df -hT` | Combinaison des deux |
| `df -h /home` | Espace du système de fichiers contenant `/home` |

**Colonnes de sortie** :

| Colonne | Signification |
| ------- | ------------- |
| `Filesystem` | Nom du périphérique |
| `Size` | Taille totale |
| `Used` | Espace utilisé |
| `Avail` | Espace disponible |
| `Use%` | Pourcentage utilisé |
| `Mounted on` | Point de montage |

---

### La commande du

**Définition** : `du` (Disk Usage) affiche la taille d'un fichier ou d'un dossier.

**Options courantes** :

| Commande | Action |
| -------- | ------ |
| `du -h dossier` | Taille de chaque sous-dossier |
| `du -sh dossier` | Taille totale du dossier seulement |
| `du -sh *` | Taille de chaque élément du dossier courant |
| `du -h --max-depth=1 dossier` | Un seul niveau de profondeur |

**Différence entre df et du** :

| `df` | `du` |
| ---- | ---- |
| Espace sur les partitions | Taille des fichiers/dossiers |
| Vue globale du système | Vue détaillée d'un dossier |
| Inclut les fichiers supprimés encore ouverts | Ne compte que les fichiers existants |

---

### Le partitionnement

**Définition** : Le partitionnement est le découpage d'un disque en sections indépendantes. Chaque partition peut contenir un système de fichiers différent.

**Deux types de tables de partition** :

| Type | Nom complet | Caractéristiques |
| ---- | ----------- | ---------------- |
| MBR | Master Boot Record | Ancien, max 4 partitions primaires, max 2 To |
| GPT | GUID Partition Table | Moderne, 128 partitions, pas de limite de taille pratique |

**Outils de partitionnement** :

| Outil | Usage |
| ----- | ----- |
| `fdisk` | Partitionnement interactif (MBR et GPT) |
| `parted` | Partitionnement avancé (GPT recommandé) |
| `lsblk` | Lister les disques et partitions |

---

### La commande mkfs

**Définition** : `mkfs` (Make Filesystem) crée un système de fichiers sur une partition.

**Syntaxes courantes** :

| Commande | Action |
| -------- | ------ |
| `sudo mkfs.ext4 /dev/sdb1` | Crée un système ext4 |
| `sudo mkfs.xfs /dev/sdb1` | Crée un système xfs |
| `sudo mkfs.vfat /dev/sdb1` | Crée un système FAT32 |
| `sudo mkswap /dev/sdb2` | Crée un espace swap |

**ATTENTION** : `mkfs` efface toutes les données de la partition. Vérifie toujours deux fois le nom du périphérique avant d'exécuter cette commande.

---

### Le montage et /etc/fstab

**Monter manuellement** :

```bash
sudo mount /dev/sdb1 /mnt/data
```

**Démonter** :

```bash
sudo umount /mnt/data
```

**Le fichier /etc/fstab** :

**Définition** : `/etc/fstab` (File System Table) définit les partitions à monter automatiquement au démarrage.

**Format** :

```text
# périphérique    point_montage    type    options    dump    pass
/dev/sda1         /                ext4    defaults   0       1
/dev/sda2         /home            ext4    defaults   0       2
UUID=abcd-1234    /mnt/data        ext4    defaults   0       2
```

**Colonnes expliquées** :

| Colonne | Signification |
| ------- | ------------- |
| Périphérique | `/dev/sda1` ou `UUID=...` |
| Point de montage | Dossier où monter |
| Type | Système de fichiers (ext4, xfs, vfat) |
| Options | Options de montage (defaults, ro, noexec) |
| Dump | Sauvegarde (0 = non, 1 = oui) |
| Pass | Ordre de vérification au boot (0 = pas de vérification) |

**Options de montage courantes** :

| Option | Signification |
| ------ | ------------- |
| `defaults` | Options standard (rw, suid, dev, exec, auto, nouser, async) |
| `ro` | Lecture seule |
| `noexec` | Interdit l'exécution de programmes |
| `nosuid` | Ignore le bit SUID |
| `noatime` | Ne met pas à jour la date d'accès (performance) |

---

### LVM (Logical Volume Manager)

**Définition** : LVM est une couche d'abstraction entre les disques physiques et les systèmes de fichiers. Il permet de redimensionner les partitions dynamiquement.

**Le problème que LVM résout** :

Avec des partitions classiques, si `/home` est plein et `/var` a de l'espace libre, tu ne peux pas transférer l'espace sans tout reformater. LVM permet de redimensionner les volumes à chaud.

**Architecture LVM** :

```text
Disques physiques (PV - Physical Volumes)
    /dev/sda1, /dev/sdb1
        ↓
Groupe de volumes (VG - Volume Group)
    vg-data (combine les PV)
        ↓
Volumes logiques (LV - Logical Volumes)
    /dev/vg-data/lv-home → monté sur /home
    /dev/vg-data/lv-var  → monté sur /var
```

**Analogie concrète** : LVM est comme un ensemble de piscines connectées. Les disques physiques sont les arrivées d'eau (PV). Toute l'eau est mélangée dans un grand bassin (VG). Tu peux ensuite répartir l'eau dans des piscines de différentes tailles (LV), et tu peux les agrandir ou les réduire à volonté.

**Commandes LVM de base** :

| Commande | Action |
| -------- | ------ |
| `sudo pvs` | Lister les Physical Volumes |
| `sudo vgs` | Lister les Volume Groups |
| `sudo lvs` | Lister les Logical Volumes |
| `sudo lvextend -L +10G /dev/vg/lv` | Agrandir un LV de 10 Go |
| `sudo resize2fs /dev/vg/lv` | Redimensionner le système de fichiers (ext4) |

---

### RAID (concepts)

**Définition** : Le RAID (Redundant Array of Independent Disks) combine plusieurs disques pour améliorer les performances et/ou la fiabilité.

**Niveaux RAID courants** :

| Niveau | Disques min. | Capacité | Tolérance panne | Usage |
| ------ | ------------ | -------- | ---------------- | ----- |
| RAID 0 | 2 | 100% | Aucune | Performance (pas de sécurité) |
| RAID 1 | 2 | 50% | 1 disque | Miroir (sécurité maximale) |
| RAID 5 | 3 | (N-1)/N | 1 disque | Équilibre performance/sécurité |
| RAID 10 | 4 | 50% | 1 par miroir | Performance + sécurité |

**Analogie concrète** :

- **RAID 0** : Tu écris la moitié d'un livre sur un cahier, l'autre moitié sur un autre. Si tu perds un cahier, le livre est illisible. Mais tu écris deux fois plus vite.
- **RAID 1** : Tu recopies le même livre dans deux cahiers identiques. Si tu perds un cahier, tu as toujours l'autre. Mais tu utilises deux cahiers pour un seul livre.

**Ce que le RAID n'est PAS** :

- Le RAID n'est pas une sauvegarde. Il protège contre la panne d'un disque, mais pas contre la suppression accidentelle de fichiers, les virus ou les catastrophes physiques.

---

## Étapes Pratiques

### Étape 1 : Voir l'espace disque

```bash
# Espace disponible sur toutes les partitions
df -hT

# Espace utilisé par ton dossier personnel
du -sh ~

# Taille de chaque dossier dans /var
sudo du -h --max-depth=1 /var
```

**Résultat attendu** :

```text
Filesystem     Type   Size  Used Avail Use% Mounted on
/dev/sda1      ext4    50G   15G   33G  32% /
tmpfs          tmpfs  2.0G     0  2.0G   0% /dev/shm
/dev/sda2      ext4   100G   45G   50G  48% /home
```

---

### Étape 2 : Lister les disques et partitions

```bash
# Voir tous les disques et partitions
lsblk

# Voir avec plus de détails
lsblk -f

# Voir les UUID
sudo blkid
```

**Résultat attendu** :

```text
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0    50G  0 disk
├─sda1   8:1    0    49G  0 part /
└─sda2   8:2    0     1G  0 part [SWAP]
```

---

### Étape 3 : Trouver les fichiers volumineux

```bash
# Trouver les 10 plus gros fichiers dans /var
sudo du -ah /var | sort -rh | head -10

# Trouver les fichiers de plus de 100 Mo
sudo find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null
```

**Résultat attendu** :

```text
1.2G    /var/log/journal
500M    /var/cache/apt/archives
200M    /var/lib/dpkg
```

---

### Étape 4 : Voir les montages actuels

```bash
# Voir les systèmes de fichiers montés
mount | column -t

# Voir seulement les vrais disques (pas tmpfs, etc.)
mount | grep "^/dev"

# Voir le contenu de fstab
cat /etc/fstab
```

**Résultat attendu** :

```text
/dev/sda1 on / type ext4 (rw,relatime)
/dev/sda2 on /home type ext4 (rw,relatime)
```

---

### Étape 5 : Monter et démonter un périphérique (exemple avec clé USB)

```bash
# Identifier la clé USB
lsblk

# Créer un point de montage
sudo mkdir -p /mnt/usb

# Monter la clé
sudo mount /dev/sdb1 /mnt/usb

# Vérifier le contenu
ls /mnt/usb

# Démonter proprement
sudo umount /mnt/usb
```

**Résultat attendu** :

```text
Documents  Photos  Videos
```

---

### Étape 6 : Vérifier la santé d'un système de fichiers

```bash
# Voir les statistiques d'un système de fichiers ext4
sudo tune2fs -l /dev/sda1 | head -20

# Compter les inodes (métadonnées de fichiers)
df -i
```

**Résultat attendu** :

```text
Filesystem     Inodes  IUsed   IFree IUse% Mounted on
/dev/sda1     3276800 245678 3031122    8% /
```

---

### Étape 7 : Créer un fichier comme disque virtuel (exercice sûr)

Cette étape te permet de pratiquer le partitionnement sans risquer tes disques réels.

```bash
# Créer un fichier de 100 Mo qui simule un disque
dd if=/dev/zero of=/tmp/disque-test.img bs=1M count=100

# Créer un système de fichiers dessus
mkfs.ext4 /tmp/disque-test.img

# Créer un point de montage
sudo mkdir -p /mnt/test

# Monter le fichier comme un disque
sudo mount -o loop /tmp/disque-test.img /mnt/test

# Vérifier
df -h /mnt/test
ls -la /mnt/test

# Créer un fichier dedans
echo "Test de montage" | sudo tee /mnt/test/test.txt
cat /mnt/test/test.txt

# Démonter et nettoyer
sudo umount /mnt/test
sudo rmdir /mnt/test
rm /tmp/disque-test.img
```

**Résultat attendu** :

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/loop0       93M   24K   86M   1% /mnt/test
Test de montage
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `df -hT` | Espace disque avec types |
| `du -sh dossier` | Taille d'un dossier |
| `lsblk` | Lister disques et partitions |
| `sudo blkid` | Voir les UUID |
| `sudo mount /dev/xxx /mnt/point` | Monter une partition |
| `sudo umount /mnt/point` | Démonter |
| `sudo mkfs.ext4 /dev/xxx` | Créer un système ext4 |
| `cat /etc/fstab` | Configuration des montages |
| `sudo pvs / vgs / lvs` | Informations LVM |

---

## Pièges Fréquents

### Piège 1 : mkfs sur la mauvaise partition

⚠️ **Problème** : `mkfs` efface TOUTES les données de la partition. Écrire sur `/dev/sda1` au lieu de `/dev/sdb1` détruit ton système.

✅ **Solution** : Toujours vérifier avec `lsblk` avant d'exécuter `mkfs`.

```bash
# TOUJOURS vérifier d'abord
lsblk

# Puis seulement formater
sudo mkfs.ext4 /dev/sdb1
```

---

### Piège 2 : Démonter un périphérique en cours d'utilisation

⚠️ **Problème** : "target is busy" si un processus utilise le point de montage.

✅ **Solution** : Fermer tous les fichiers et sortir du dossier.

```bash
# Trouver qui utilise le point de montage
sudo lsof +D /mnt/usb

# Ou forcer le démontage (dernier recours)
sudo umount -l /mnt/usb
```

---

### Piège 3 : Erreur dans /etc/fstab

⚠️ **Problème** : Une erreur dans `/etc/fstab` peut empêcher le système de démarrer.

✅ **Solution** : Tester le montage manuellement avant de modifier fstab.

```bash
# 1. Tester le montage manuellement
sudo mount /dev/sdb1 /mnt/data

# 2. Si ça fonctionne, ajouter à fstab
# 3. Tester fstab sans redémarrer
sudo mount -a

# Si aucune erreur, le montage est correct
```

---

### Piège 4 : Confondre df et du

⚠️ **Problème** : `df` et `du` peuvent montrer des tailles différentes.

✅ **Solution** : Comprendre que `df` compte les fichiers supprimés encore ouverts, pas `du`.

```bash
# Un processus tient un fichier supprimé ouvert
# df montre l'espace occupé, du ne le voit pas

# Trouver les fichiers supprimés encore ouverts
sudo lsof +L1
```

---

### Piège 5 : Pipe et portée des variables dans while

⚠️ **Problème** : En bash, un pipe (`|`) crée un sous-shell. Les variables modifiées dans un `while ... done` alimenté par un pipe ne sont pas visibles après la boucle.

```bash
total=0
df -h | grep "^/dev/" | while read ligne; do
    total=$((total + 1))  # Modifié dans le sous-shell
done
echo "Total : $total"  # Affiche 0 - les modifications sont perdues
```

✅ **Solution** : Utiliser la redirection `< <(commande)` pour conserver le shell courant.

```bash
total=0
while read ligne; do
    total=$((total + 1))  # Modifié dans le shell courant
done < <(df -h | grep "^/dev/")
echo "Total : $total"  # Affiche la valeur correcte
```

---

## Checklist de Validation

- [ ] Je sais vérifier l'espace disque avec `df -h`
- [ ] Je sais mesurer la taille d'un dossier avec `du -sh`
- [ ] Je sais lister les disques et partitions avec `lsblk`
- [ ] Je sais monter et démonter une partition
- [ ] Je comprends le format de `/etc/fstab`
- [ ] Je sais créer un système de fichiers avec `mkfs`
- [ ] Je comprends les bases de LVM (PV, VG, LV)
- [ ] Je connais les niveaux RAID courants (0, 1, 5, 10)

---

## Exercice Pratique

**Énoncé** : Crée un script qui analyse l'espace disque et alerte si une partition dépasse un seuil.

**Indications** :

1. Le script prend un seuil en pourcentage en argument (par défaut 80%)
2. Il parcourt toutes les partitions avec `df`
3. Il affiche un avertissement pour chaque partition qui dépasse le seuil
4. Il affiche un résumé à la fin

**Résultat attendu** :

```bash
./verif-disque.sh 50
```

```text
=== Vérification de l'espace disque (seuil : 50%) ===
ALERTE : / utilise 65% (seuil : 50%)
OK : /home utilise 32%
OK : /boot utilise 45%
=== Résultat : 1 alerte(s) sur 3 partitions ===
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier verif-disque.sh** :

```bash
#!/bin/bash
# Vérification de l'espace disque avec alerte

# Seuil par défaut : 80%
seuil=${1:-80}

echo "=== Vérification de l'espace disque (seuil : ${seuil}%) ==="

alertes=0
total=0

# Parcourir les partitions (ignorer l'en-tête et tmpfs)
df -h | grep "^/dev/" | while read filesystem size used avail pourcent montage; do
    # Retirer le % du pourcentage
    usage=${pourcent%\%}
    total=$((total + 1))

    if [ "$usage" -ge "$seuil" ]; then
        echo "ALERTE : $montage utilise ${pourcent} (seuil : ${seuil}%)"
        alertes=$((alertes + 1))
    else
        echo "OK : $montage utilise ${pourcent}"
    fi
done

# Compter les résultats
nb_partitions=$(df -h | grep "^/dev/" | wc -l)
nb_alertes=$(df -h | grep "^/dev/" | awk '{gsub(/%/,"",$5); if ($5 >= '$seuil') print}' | wc -l)

echo "=== Résultat : $nb_alertes alerte(s) sur $nb_partitions partitions ==="
```

**Exécution** :

```bash
chmod +x verif-disque.sh
./verif-disque.sh 50
./verif-disque.sh 80
./verif-disque.sh
```

---

## Navigation

← Fiche précédente : **[systemd et services](07-systemd-services.md)**

→ Fiche suivante : **[Tâches planifiées et automatisation](09-taches-planifiees.md)**
