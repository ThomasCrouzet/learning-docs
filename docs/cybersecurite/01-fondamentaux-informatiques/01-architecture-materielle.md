---
tags:
  - Cybersécurité
  - Débutant
  - Concept
description: "Architecture matérielle des ordinateurs : CPU, mémoire, bus, boot process et rings de privilèges"
estimated_time: "45 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 1 - Fondamentaux informatiques"
id: "security.cybersecurity.fundamentals-it.architecture-materielle"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.fundamentals-it"
content_type: "lesson"
order: 1
---

# 01 - Architecture matérielle et fonctionnement des ordinateurs

> **En bref** : À la fin de cette fiche, tu sauras décrire les composants matériels d'un ordinateur, expliquer le processus de démarrage du BIOS/UEFI jusqu'au système d'exploitation, distinguer mémoire physique et mémoire virtuelle, et comprendre le modèle de rings de privilèges ainsi que ses implications en cybersécurité. Lecture estimée : 45 min.


## Prérequis

- Aucune connaissance préalable en architecture matérielle n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire les composants matériels d'un ordinateur, expliquer le processus de démarrage du BIOS/UEFI jusqu'au système d'exploitation, distinguer mémoire physique et mémoire virtuelle, et comprendre le modèle de rings de privilèges ainsi que ses implications en cybersécurité.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un processeur (CPU) ?

**Définition** : Le processeur (Central Processing Unit) est le composant qui exécute les instructions des programmes. Il effectue les calculs, prend les décisions logiques et coordonne le fonctionnement de tous les autres composants.

**Le problème que le CPU résout** :

Sans processeur, voici les problèmes rencontrés :

1. **Pas de calcul possible** : aucun programme ne peut s'exécuter sans unité de traitement
2. **Pas de coordination** : les composants (mémoire, stockage, périphériques) ne peuvent pas communiquer de manière ordonnée
3. **Pas de logique** : impossible de prendre des décisions conditionnelles (si/sinon)

**Comment le CPU résout ces problèmes** :

| Problème | Solution apportée par le CPU |
| -------- | ---------------------------- |
| Pas de calcul possible | L'ALU (Arithmetic Logic Unit) effectue additions, soustractions, comparaisons |
| Pas de coordination | L'unité de contrôle séquence les opérations et synchronise les composants |
| Pas de logique | Les instructions conditionnelles (jump, branch) permettent la prise de décision |

**Analogie concrète** : Le CPU est le chef cuisinier dans une cuisine. Il lit la recette (les instructions du programme), effectue les actions (découper, mélanger = calculer), et coordonne les autres postes (le four = le stockage, le réfrigérateur = la mémoire).

**Ce que le CPU n'est PAS** :

- Le CPU n'est pas la mémoire. Il ne stocke pas les données de façon permanente. Il les traite temporairement dans ses registres.
- Le CPU n'est pas le GPU. Le GPU (Graphics Processing Unit) est spécialisé dans le calcul parallèle massif pour le graphisme. Le CPU traite des tâches séquentielles variées.

#### Architectures x86/x64 et ARM

Il existe deux grandes familles d'architectures de processeurs :

**x86/x64 (Intel, AMD)** :

- **x86** : architecture 32 bits, peut adresser 4 Go de mémoire maximum
- **x64** (aussi appelé AMD64 ou x86-64) : extension 64 bits, peut adresser 16 Eo (exaoctets) théoriques
- Utilisée dans les ordinateurs de bureau, portables et serveurs
- Jeu d'instructions complexe (CISC : Complex Instruction Set Computer)
- Consomme plus d'énergie

**ARM** :

- Architecture à jeu d'instructions réduit (RISC : Reduced Instruction Set Computer)
- Utilisée dans les smartphones, tablettes, Raspberry Pi, et depuis 2020 dans les Mac (Apple Silicon)
- Consomme moins d'énergie
- Instructions plus simples mais exécutées plus rapidement

**Comparaison x86/x64 vs ARM** :

| x86/x64 | ARM |
| -------- | --- |
| CISC : instructions complexes | RISC : instructions simples |
| Haute performance par cœur | Haute efficacité énergétique |
| Serveurs, PC de bureau | Smartphones, embarqué, Mac récents |
| Compatible avec la majorité des logiciels PC | Nécessite des logiciels compilés pour ARM |

**Lien avec la cybersécurité** : L'architecture du processeur détermine le format des instructions machine. Un exploit (programme qui exploite une faille) écrit pour x86 ne fonctionnera pas sur ARM. Les chercheurs en sécurité doivent connaître l'architecture cible pour écrire du shellcode (code injecté dans un programme vulnérable).

---

### Qu'est-ce que la mémoire ?

**Définition** : La mémoire est un composant qui stocke des données. Il existe plusieurs types de mémoire, chacun avec un rôle précis dans la hiérarchie de stockage.

**Le problème que la mémoire résout** :

Sans mémoire, voici les problèmes rencontrés :

1. **Le CPU ne peut rien stocker** : les registres du CPU sont trop petits (quelques octets) pour contenir un programme entier
2. **Pas de persistance** : sans stockage permanent, tout disparaît à l'extinction
3. **Lenteur d'accès** : un seul type de mémoire ne peut pas être à la fois rapide et volumineux

**Comment la mémoire résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Registres trop petits | La RAM offre des Go de stockage temporaire rapide |
| Pas de persistance | Le disque dur/SSD conserve les données hors tension |
| Lenteur d'accès | La hiérarchie de cache (L1, L2, L3) accélère les accès fréquents |

**Analogie concrète** : Imagine un bureau de travail. Les registres du CPU sont tes mains (très rapide, très peu de capacité). Le cache est la surface de ton bureau (rapide d'accès, capacité limitée). La RAM est l'étagère à côté du bureau (il faut se lever, mais il y a plus de place). Le disque dur est l'armoire dans une autre pièce (lent d'accès, énorme capacité).

#### Types de mémoire

**RAM (Random Access Memory)** :

- Mémoire volatile : les données disparaissent quand on coupe l'alimentation
- Accès rapide : quelques nanosecondes
- Contient les programmes en cours d'exécution et leurs données
- Capacité typique : 8 Go à 64 Go sur un PC moderne

**ROM (Read-Only Memory)** :

- Mémoire non volatile : conserve les données sans alimentation
- Contient le firmware (BIOS/UEFI) gravé à la fabrication
- Ne peut pas être modifiée facilement (variantes : EEPROM, Flash)

**Mémoire cache (L1, L2, L3)** :

- Mémoire très rapide intégrée directement dans le CPU
- L1 : la plus rapide (1-2 nanosecondes), la plus petite (32-64 Ko par coeur)
- L2 : rapide (3-10 ns), moyenne (256 Ko - 1 Mo par coeur)
- L3 : moins rapide (10-30 ns), plus grande (8-64 Mo partagée entre les coeurs)

**Lien avec la cybersécurité** : Les attaques par cold boot (cold boot attack) exploitent le fait que la RAM ne perd pas ses données instantanément quand on coupe l'alimentation. Un attaquant peut refroidir les barrettes de RAM (avec un spray réfrigérant) pour ralentir la perte de données, puis lire le contenu de la mémoire. Cela permet de récupérer des clés de chiffrement qui étaient en mémoire.

---

### Qu'est-ce qu'un bus ?

**Définition** : Un bus est un ensemble de fils conducteurs (physiques ou logiques) qui transportent des données entre les composants d'un ordinateur.

**Le problème que les bus résolvent** :

Sans bus, voici les problèmes rencontrés :

1. **Pas de communication** : le CPU ne peut pas envoyer de données à la mémoire ou aux périphériques
2. **Câblage individuel** : il faudrait un fil dédié entre chaque paire de composants, ce qui est impraticable
3. **Pas de synchronisation** : les composants ne savent pas quand lire ou écrire des données

**Comment les bus résolvent ces problèmes** :

| Problème | Solution apportée par les bus |
| -------- | ----------------------------- |
| Pas de communication | Les bus fournissent un canal partagé entre les composants |
| Câblage individuel | Un bus unique connecte plusieurs composants |
| Pas de synchronisation | Le bus système est cadencé par une horloge |

**Analogie concrète** : Le bus est une autoroute avec des voies dédiées. Le bus d'adresses indique la destination (quelle sortie prendre). Le bus de données transporte le chargement (les données). Le bus de contrôle affiche les panneaux de signalisation (lire, écrire, prêt).

**Types de bus** :

| Bus | Rôle | Exemple |
| --- | ---- | ------- |
| Bus système (FSB) | Relie CPU et mémoire | Front Side Bus |
| Bus PCI Express | Relie CPU et cartes d'extension | Carte graphique, carte réseau |
| Bus USB | Relie les périphériques externes | Clavier, souris, clé USB |
| Bus SATA | Relie le stockage | Disque dur, SSD |

**Lien avec la cybersécurité** : Les attaques DMA (Direct Memory Access) exploitent les bus qui permettent aux périphériques d'accéder directement à la mémoire sans passer par le CPU. Un attaquant connectant un périphérique malveillant (via Thunderbolt, FireWire ou PCI Express) peut lire ou écrire dans la RAM, contournant ainsi le système d'exploitation et ses protections.

---

### Qu'est-ce que le stockage ?

**Définition** : Le stockage est un composant qui conserve les données de façon permanente, même quand l'ordinateur est éteint.

**Types de stockage** :

| Type | Technologie | Vitesse de lecture | Capacité typique |
| ---- | ----------- | ------------------ | ---------------- |
| HDD (Hard Disk Drive) | Plateaux magnétiques rotatifs | 100-200 Mo/s | 1-20 To |
| SSD SATA | Mémoire flash via interface SATA | 500-600 Mo/s | 256 Go - 4 To |
| SSD NVMe | Mémoire flash via PCI Express | 3000-7000 Mo/s | 256 Go - 4 To |

**Ce que le stockage n'est PAS** :

- Le stockage n'est pas la RAM. La RAM est volatile et rapide. Le stockage est permanent et plus lent.
- Le stockage n'est pas le cache. Le cache est intégré au CPU et contient quelques Mo.

---

### Qu'est-ce que le BIOS/UEFI ?

**Définition** : Le BIOS (Basic Input/Output System) et l'UEFI (Unified Extensible Firmware Interface) sont des firmwares stockés dans la ROM de la carte mère. Ils initialisent le matériel au démarrage et lancent le système d'exploitation.

**Le problème que le BIOS/UEFI résout** :

Sans BIOS/UEFI, voici les problèmes rencontrés :

1. **Le matériel n'est pas initialisé** : au démarrage, le CPU ne sait pas quel matériel est connecté
2. **Pas de lancement du système** : le CPU ne sait pas où trouver le système d'exploitation sur le disque
3. **Pas de configuration matérielle** : impossible de régler l'ordre de démarrage ou les paramètres matériels

**Comment le BIOS/UEFI résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Matériel non initialisé | Le POST (Power-On Self-Test) détecte et teste tous les composants |
| Pas de lancement du système | Le bootloader est localisé et chargé en mémoire |
| Pas de configuration | L'interface de setup permet de modifier les paramètres |

**Comparaison BIOS vs UEFI** :

| BIOS (ancien) | UEFI (moderne) |
| -------------- | -------------- |
| Interface texte | Interface graphique possible |
| Disques jusqu'à 2 To (MBR) | Disques au-delà de 2 To (GPT) |
| Démarrage lent | Démarrage rapide (Fast Boot) |
| Pas de Secure Boot | Secure Boot : vérifie la signature du bootloader |
| 16 bits | 32 ou 64 bits |

**Analogie concrète** : Le BIOS/UEFI est le gardien de nuit d'un immeuble de bureaux. Quand tu arrives le matin (démarrage), le gardien vérifie que toutes les installations fonctionnent (POST), allume les lumières et la climatisation (initialisation du matériel), puis te dirige vers ton bureau (chargement du système d'exploitation).

**Lien avec la cybersécurité** : Un firmware rootkit est un malware installé dans le BIOS/UEFI. Il est extrêmement dangereux car il survit à la réinstallation du système d'exploitation et au formatage du disque dur. Le Secure Boot d'UEFI a été conçu pour empêcher le chargement de code non signé au démarrage.

---

### Qu'est-ce que le processus de démarrage (boot process) ?

**Définition** : Le processus de démarrage est la séquence d'étapes qui s'exécutent entre le moment où tu appuies sur le bouton d'alimentation et le moment où le système d'exploitation est prêt à l'emploi.

**Étapes du boot process** :

1. **Alimentation** : le bouton envoie un signal électrique à la carte mère
2. **POST (Power-On Self-Test)** : le firmware teste la RAM, le CPU, le clavier, le stockage
3. **Initialisation du matériel** : le firmware configure les composants détectés
4. **Recherche du bootloader** : le firmware cherche un programme de démarrage sur le disque (selon l'ordre de boot configuré)
5. **Chargement du bootloader** : le bootloader (GRUB sous Linux, Windows Boot Manager sous Windows) est copié en RAM
6. **Chargement du noyau** : le bootloader charge le noyau du système d'exploitation en mémoire
7. **Initialisation du noyau** : le noyau initialise les pilotes, monte les systèmes de fichiers, lance les services
8. **Écran de connexion** : le système est prêt

**Lien avec la cybersécurité** : Chaque étape du boot process est une cible potentielle. Un bootkit modifie le bootloader pour s'exécuter avant le système d'exploitation. Le Secure Boot vérifie la chaîne de confiance : le firmware vérifie le bootloader, le bootloader vérifie le noyau.

---

### Qu'est-ce que la mémoire physique vs mémoire virtuelle ?

**Définition** : La mémoire physique est la RAM réellement installée dans l'ordinateur. La mémoire virtuelle est une abstraction gérée par le système d'exploitation qui donne à chaque programme l'illusion de disposer de son propre espace mémoire continu et privé.

**Le problème que la mémoire virtuelle résout** :

Sans mémoire virtuelle, voici les problèmes rencontrés :

1. **Conflits d'adresses** : deux programmes pourraient écrire à la même adresse mémoire physique et se corrompre mutuellement
2. **Pas d'isolation** : un programme pourrait lire les données d'un autre programme (mots de passe, clés de chiffrement)
3. **Limitation de la RAM** : un programme ne peut pas utiliser plus de mémoire que la RAM disponible

**Comment la mémoire virtuelle résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Conflits d'adresses | Chaque programme a son propre espace d'adresses virtuelles, traduit en adresses physiques par la MMU |
| Pas d'isolation | Un programme ne peut pas accéder à l'espace d'adresses d'un autre programme |
| Limitation de la RAM | Le swap permet d'utiliser le disque comme extension de la RAM |

**Fonctionnement** :

- Le système découpe la mémoire en pages (typiquement 4 Ko)
- La MMU (Memory Management Unit), un composant matériel du CPU, traduit les adresses virtuelles en adresses physiques
- La table des pages maintient la correspondance entre pages virtuelles et pages physiques
- Si une page demandée n'est pas en RAM (page fault), le système la charge depuis le disque (swap)

**Analogie concrète** : Imagine un hôtel. Chaque client (programme) a un numéro de chambre (adresse virtuelle). Le client ne connaît que son numéro de chambre, pas l'emplacement physique exact dans le bâtiment (adresse physique). La réception (MMU) fait la correspondance. Un client ne peut pas entrer dans la chambre d'un autre client.

**Lien avec la cybersécurité** : Les attaques par buffer overflow exploitent des erreurs dans la gestion de la mémoire pour écrire au-delà des limites d'un buffer et modifier des données critiques (comme l'adresse de retour d'une fonction). Les protections modernes incluent l'ASLR (Address Space Layout Randomization) qui place les segments mémoire à des adresses aléatoires pour rendre les exploits plus difficiles.

---

### Qu'est-ce que les rings de privilèges (Ring 0-3) ?

**Définition** : Les rings de privilèges sont un mécanisme matériel du processeur (x86/x64) qui définit des niveaux d'accès. Ring 0 a le plus de privilèges (accès total au matériel), Ring 3 a le moins (exécution restreinte).

**Le problème que les rings résolvent** :

Sans rings de privilèges, voici les problèmes rencontrés :

1. **Pas de protection** : n'importe quel programme pourrait accéder directement au matériel et corrompre le système
2. **Instabilité** : une erreur dans un programme pourrait planter l'ordinateur entier
3. **Pas de sécurité** : un programme malveillant pourrait tout contrôler sans restriction

**Comment les rings résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de protection | Seul le code en Ring 0 peut accéder au matériel |
| Instabilité | Un crash en Ring 3 ne plante pas le noyau (Ring 0) |
| Pas de sécurité | Les programmes utilisateur (Ring 3) doivent demander au noyau (Ring 0) via des appels système (syscalls) |

**Les quatre rings** :

| Ring | Nom | Contenu | Privilèges |
| ---- | --- | ------- | ---------- |
| Ring 0 | Noyau (Kernel) | Noyau du système d'exploitation | Accès total : matériel, mémoire, instructions privilégiées |
| Ring 1 | Pilotes (théorique) | Rarement utilisé en pratique | Accès limité au matériel |
| Ring 2 | Services (théorique) | Rarement utilisé en pratique | Accès limité |
| Ring 3 | Utilisateur (User) | Applications (navigateur, éditeur de texte) | Aucun accès direct au matériel |

**En pratique** : la plupart des systèmes modernes n'utilisent que Ring 0 (noyau) et Ring 3 (applications). Ring 1 et Ring 2 ne sont quasiment jamais utilisés.

**Analogie concrète** : Imagine un hôpital. Le Ring 0 est le bloc opératoire : seuls les chirurgiens (le noyau) peuvent y entrer et manipuler les instruments critiques. Le Ring 3 est la salle d'attente : les patients (les programmes) peuvent y rester mais doivent demander à un médecin (appel système) pour accéder aux zones protégées.

Le diagramme suivant illustre la hiérarchie des rings de privilèges, du noyau (accès total) jusqu'aux applications utilisateur (accès restreint) :

<div class="diagram-design">
<p><a href="../../../diagrams/cybersecurite-01-fondamentaux-informatiques-01-architecture-materielle-1.html">Qu&#x27;est-ce que les rings de privilèges (Ring 0-3) ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/cybersecurite-01-fondamentaux-informatiques-01-architecture-materielle-1.html" title="Qu&#x27;est-ce que les rings de privilèges (Ring 0-3) ?" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

**Ce que les rings ne sont PAS** :

- Les rings ne sont pas des utilisateurs. Un administrateur (root) exécute toujours ses programmes en Ring 3. C'est le noyau qui tourne en Ring 0, pas l'utilisateur root directement.
- Les rings ne sont pas du logiciel. Ce sont des mécanismes matériels du processeur.

**Ring -1 et Ring -2** :

Les architectures modernes ont ajouté des niveaux encore plus profonds :

| Ring | Nom | Contenu |
| ---- | --- | ------- |
| Ring -1 | Hyperviseur | Logiciel de virtualisation (VMware, Hyper-V) |
| Ring -2 | SMM (System Management Mode) | Firmware, gestion d'alimentation |
| Ring -3 | Intel ME / AMD PSP | Micro-contrôleur intégré, toujours actif |

**Lien avec la cybersécurité** : Un rootkit noyau (kernel rootkit) s'installe en Ring 0 pour obtenir un contrôle total. Les hyperviseurs malveillants (Blue Pill) s'installent en Ring -1 pour contrôler le noyau lui-même. Intel ME (Ring -3) a fait l'objet de vulnérabilités critiques car il fonctionne même quand l'ordinateur est éteint (en veille).

---

## Étapes Pratiques

### Étape 1 : Identifier les composants de ta machine

Ouvre un terminal Linux (ou WSL sous Windows) et exécute ces commandes pour découvrir ton matériel.

**Voir les informations du CPU** :

```bash
# Affiche les informations détaillées du processeur
lscpu
```

**Résultat attendu** :

```text
Architecture:            x86_64
CPU op-mode(s):          32-bit, 64-bit
CPU(s):                  8
Model name:              Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz
L1d cache:               256 KiB
L1i cache:               256 KiB
L2 cache:                2 MiB
L3 cache:                16 MiB
```

---

### Étape 2 : Vérifier la mémoire RAM

```bash
# Affiche la quantité de mémoire RAM en format lisible
free -h
```

**Résultat attendu** :

```text
              total        used        free      shared  buff/cache   available
Mem:           15Gi       4.2Gi       8.1Gi       256Mi       3.1Gi        10Gi
Swap:         2.0Gi          0B       2.0Gi
```

**Explication** :

- **total** : quantité totale de RAM installée
- **used** : mémoire utilisée par les programmes
- **free** : mémoire complètement inutilisée
- **buff/cache** : mémoire utilisée comme cache (récupérable si besoin)
- **Swap** : espace disque utilisé comme extension de la RAM

---

### Étape 3 : Lister les périphériques de stockage

```bash
# Liste les disques et partitions avec leurs tailles
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
```

**Résultat attendu** :

```text
NAME   SIZE TYPE MOUNTPOINT
sda    500G disk
├─sda1 512M part /boot/efi
├─sda2 480G part /
└─sda3  19G part [SWAP]
```

---

### Étape 4 : Vérifier les informations du firmware (BIOS/UEFI)

```bash
# Vérifie si le système a démarré en mode UEFI ou BIOS
# Si le dossier existe, le système est en mode UEFI
ls /sys/firmware/efi 2>/dev/null && echo "Mode UEFI" || echo "Mode BIOS"
```

**Résultat attendu** :

```text
Mode UEFI
```

---

### Étape 5 : Explorer la mémoire virtuelle

```bash
# Affiche les mappings mémoire du processus shell actuel
cat /proc/self/maps | head -20
```

**Résultat attendu** :

```text
55a3c2400000-55a3c2402000 r--p 00000000 08:01 1234567  /usr/bin/cat
55a3c2402000-55a3c2407000 r-xp 00002000 08:01 1234567  /usr/bin/cat
55a3c2407000-55a3c240a000 r--p 00007000 08:01 1234567  /usr/bin/cat
7f8a12000000-7f8a12021000 rw-p 00000000 00:00 0
```

**Explication des colonnes** :

- `55a3c2400000-55a3c2402000` : plage d'adresses virtuelles
- `r--p` : permissions (r=lecture, w=écriture, x=exécution, p=privé)
- Le fichier associé (ici `/usr/bin/cat`)

---

### Étape 6 : Observer les rings en action avec dmesg

```bash
# Affiche les messages du noyau (Ring 0) lors du démarrage
# Nécessite les droits root
sudo dmesg | head -30
```

**Résultat attendu** :

```text
[    0.000000] Linux version 6.1.0-18-amd64 (debian-kernel@lists.debian.org)
[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.1.0-18-amd64 root=/dev/sda2
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable
```

Ces messages montrent le noyau (Ring 0) qui initialise le matériel et la mémoire au démarrage.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `lscpu` | Affiche les informations détaillées du CPU |
| `free -h` | Affiche l'utilisation de la RAM en format lisible |
| `lsblk` | Liste les périphériques de stockage et partitions |
| `lspci` | Liste tous les périphériques connectés au bus PCI |
| `lsusb` | Liste les périphériques USB connectés |
| `sudo dmidecode -t memory` | Affiche les détails des barrettes de RAM |
| `sudo dmidecode -t bios` | Affiche les informations du BIOS/UEFI |
| `cat /proc/meminfo` | Affiche les statistiques détaillées de la mémoire |
| `cat /proc/cpuinfo` | Affiche les informations brutes du CPU |
| `sudo dmesg` | Affiche les messages du noyau |
| `uname -a` | Affiche l'architecture et la version du noyau |

---

## Pièges Fréquents

### Piège 1 : Confondre mémoire (RAM) et stockage (disque)

**Problème** : Dire "mon ordinateur a 500 Go de mémoire" en parlant du disque dur.

**Solution** : La mémoire (RAM) est volatile et mesurée en Go (8-64 Go typiquement). Le stockage (HDD/SSD) est permanent et mesuré en Go ou To (256 Go - 4 To typiquement). Ce sont deux composants distincts avec des rôles différents.

---

### Piège 2 : Confondre architecture 32 bits et 64 bits

**Problème** : Installer un système d'exploitation 32 bits sur une machine 64 bits et ne pas pouvoir utiliser plus de 4 Go de RAM.

**Solution** : Vérifie ton architecture avec `uname -m`. Si le résultat est `x86_64`, installe toujours un système 64 bits. Un processeur 64 bits peut exécuter du code 32 bits, mais l'inverse n'est pas vrai.

---

### Piège 3 : Croire que Ring 0 = utilisateur root

**Problème** : Penser qu'un utilisateur root exécute son code en Ring 0 (noyau).

**Solution** : Même en root, tes programmes s'exécutent en Ring 3. L'utilisateur root a le droit de demander au noyau (Ring 0) de faire des opérations que les utilisateurs normaux ne peuvent pas demander. La distinction Ring 0/Ring 3 est matérielle (CPU), la distinction root/utilisateur est logicielle (système d'exploitation).

---

### Piège 4 : Ignorer le Secure Boot

**Problème** : Désactiver le Secure Boot pour installer Linux et oublier de le réactiver, laissant la machine vulnérable aux bootkits.

**Solution** : La plupart des distributions Linux modernes (Ubuntu, Fedora, Debian) supportent le Secure Boot. Active-le dans les paramètres UEFI et vérifie que ta distribution le supporte.

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle du CPU, de la RAM, du cache et du stockage
- [ ] Je connais la différence entre x86/x64 et ARM
- [ ] Je sais ce que fait le BIOS/UEFI et je connais la différence entre les deux
- [ ] Je peux décrire les 8 étapes du processus de démarrage
- [ ] Je comprends la différence entre mémoire physique et mémoire virtuelle
- [ ] Je sais expliquer les rings de privilèges (Ring 0 à Ring 3)
- [ ] Je connais au moins 3 attaques matérielles (cold boot, DMA, firmware rootkit)
- [ ] J'ai exécuté les commandes `lscpu`, `free -h` et `lsblk` sur ma machine

---

## Exercice Pratique

**Énoncé** : Réalise un audit matériel complet de ta machine en utilisant les commandes Linux. Tu dois produire un rapport texte contenant les informations suivantes.

**Indications** :

- Architecture du CPU (x86 ou ARM, 32 ou 64 bits)
- Nombre de coeurs et fréquence
- Taille du cache L1, L2, L3
- Quantité de RAM totale et utilisée
- Espace de swap configuré
- Liste des disques avec leurs tailles et types
- Mode de démarrage (BIOS ou UEFI)
- Liste des 3 premiers périphériques PCI

**Résultat attendu** : Un fichier texte `audit-materiel.txt` contenant toutes ces informations, organisées par catégorie.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
#!/bin/bash
# Script d'audit matériel complet
# Crée un fichier audit-materiel.txt avec les informations de la machine

OUTPUT="audit-materiel.txt"

# En-tête du rapport
echo "=== AUDIT MATÉRIEL ===" > "$OUTPUT"
echo "Date : $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Section CPU
echo "--- CPU ---" >> "$OUTPUT"
# Récupère le nom du modèle du processeur
echo "Modèle : $(grep 'model name' /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)" >> "$OUTPUT"
# Récupère l'architecture (x86_64, aarch64, etc.)
echo "Architecture : $(uname -m)" >> "$OUTPUT"
# Compte le nombre de coeurs
echo "Coeurs : $(nproc)" >> "$OUTPUT"
# Récupère les tailles de cache depuis lscpu
echo "Cache L1d : $(lscpu | grep 'L1d' | awk '{print $NF}')" >> "$OUTPUT"
echo "Cache L2 : $(lscpu | grep 'L2' | awk '{print $NF}')" >> "$OUTPUT"
echo "Cache L3 : $(lscpu | grep 'L3' | awk '{print $NF}')" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Section Mémoire
echo "--- MÉMOIRE ---" >> "$OUTPUT"
# Affiche les informations de mémoire en format lisible
free -h | grep -E 'Mem|Swap' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Section Stockage
echo "--- STOCKAGE ---" >> "$OUTPUT"
# Liste les disques avec type et taille
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Section Firmware
echo "--- FIRMWARE ---" >> "$OUTPUT"
# Vérifie si le système est en mode UEFI ou BIOS
if [ -d /sys/firmware/efi ]; then
    echo "Mode : UEFI" >> "$OUTPUT"
else
    echo "Mode : BIOS" >> "$OUTPUT"
fi
echo "" >> "$OUTPUT"

# Section PCI (3 premiers périphériques)
echo "--- PÉRIPHÉRIQUES PCI (3 premiers) ---" >> "$OUTPUT"
# Liste les 3 premiers périphériques PCI
lspci | head -3 >> "$OUTPUT"

echo ""
echo "Audit terminé. Résultat dans $OUTPUT"
```

Pour exécuter ce script :

```bash
# Rendre le script exécutable
chmod +x audit-materiel.sh

# Exécuter le script
./audit-materiel.sh

# Vérifier le contenu du rapport
cat audit-materiel.txt
```

---

## Navigation

→ Fiche suivante : **[02 - Systèmes d'exploitation - Théorie et Pratique](02-systemes-exploitation.md)**
