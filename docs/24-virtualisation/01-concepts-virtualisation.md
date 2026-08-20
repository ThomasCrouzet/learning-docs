---
tags:
  - Virtualisation
  - Débutant
  - Concept
description: "Concepts de virtualisation : hyperviseur type 1 et 2, VM vs conteneur, emulation vs para-virtualisation."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 6
cursus: "Virtualisation"
---

# 01 - Concepts de virtualisation

> **En bref** : Tu découvriras les fondamentaux de la virtualisation, les differences entre hyperviseurs de type 1 et 2, la distinction entre machines virtuelles et conteneurs, et les principes d'emulation et de para-virtualisation. Lecture estimée : 60 min.

## Prérequis

- Connaitre les bases de l'administration système Linux (commandes, système de fichiers, processus) - cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md)
- Comprendre les bases des réseaux (IP, ports, protocoles) - cursus [Réseaux](../20-reseaux/index.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras définir la virtualisation, distinguer les types d'hyperviseurs, comparer les machines virtuelles aux conteneurs et expliquer les modes d'emulation et de para-virtualisation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la virtualisation ?

**Définition** : La virtualisation est une technologie qui permet de créer des versions logicielles (virtuelles) de ressources physiques - serveurs, réseaux, stockage - a partir d'une seule machine physique. Chaque ressource virtuelle fonctionne comme si elle était une machine indépendante.

**Le problème que la virtualisation résout** :

Sans virtualisation, voici les problèmes rencontres :

1. **Sous-utilisation du matériel** : Un serveur physique dedie a une seule application utilise en moyenne 10 a 15% de sa capacité. Le reste est gaspille.
2. **Isolation impossible** : Deux applications sur le meme serveur partagent le meme système d'exploitation. Si une application plante ou consomme toutes les ressources, l'autre est affectee.
3. **Déploiement lent** : Installer un nouveau serveur physique prend des jours ou des semaines (commande, livraison, installation en salle serveur, cablage, configuration).

**Comment la virtualisation résout ces problèmes** :

| Problème | Solution apportée par la virtualisation |
| --- | --- |
| Sous-utilisation du matériel | Plusieurs machines virtuelles tournent sur un seul serveur physique, utilisant 60 a 80% de sa capacité |
| Isolation impossible | Chaque machine virtuelle a son propre système d'exploitation et ses propres ressources isolées |
| Déploiement lent | Creer une machine virtuelle prend quelques minutes a partir d'un modèle (template) |

**Analogie concrète** : Imagine un immeuble de bureaux. Sans virtualisation, chaque entreprise achète un bâtiment entier pour y installer trois employés - un gaspillage énorme d'espace. Avec la virtualisation, un seul bâtiment est divise en bureaux indépendants (machines virtuelles). Chaque bureau a sa propre porte, sa propre clé et son propre espace, mais ils partagent le meme bâtiment physique.

**Ce que la virtualisation n'est PAS** :

- La virtualisation n'est pas le cloud. Le cloud utilise la virtualisation comme fondation, mais ajoute des couches supplémentaires : facturation a l'usage, API de gestion, scalabilité automatique. La virtualisation peut exister sans cloud (un serveur dans ton bureau avec des VMs).
- La virtualisation n'est pas l'emulation. L'emulation reproduit un matériel complètement différent (par exemple, emuler un processeur ARM sur un processeur x86). La virtualisation execute le code natif du processeur, ce qui est beaucoup plus rapide.

---

### Qu'est-ce qu'un hyperviseur ?

**Définition** : Un hyperviseur est le logiciel qui créé et gère les machines virtuelles. Il partage les ressources physiques (processeur, mémoire, stockage) entre les différentes machines virtuelles de maniere isolée.

**Le problème que l'hyperviseur résout** :

Sans hyperviseur, voici les problèmes rencontres :

1. **Pas de partage des ressources** : Sans logiciel intermédiaire, une seule instance de système d'exploitation peut s'exécuter sur un processeur a la fois.
2. **Pas d'isolation sécurisée** : Les applications partagent le meme espace mémoire et le meme noyau, ce qui créé des risques de sécurité et de stabilité.

**Comment l'hyperviseur résout ces problèmes** :

| Problème | Solution apportée par l'hyperviseur |
| --- | --- |
| Pas de partage des ressources | L'hyperviseur repartit le temps processeur, la mémoire et le stockage entre les VMs |
| Pas d'isolation sécurisée | Chaque VM a son propre espace mémoire et son propre noyau, totalement isoles |

**Il existe deux types d'hyperviseurs** :

**Hyperviseur de type 1 (bare-metal)** :

L'hyperviseur s'installe directement sur le matériel physique, sans système d'exploitation intermédiaire. Il a un accès direct au processeur, a la mémoire et au stockage.

Exemples :

- **VMware ESXi** : leader historique en entreprise
- **Proxmox VE** : solution open source basée sur KVM et LXC
- **Hyper-V (rôle Windows Server)** : hyperviseur Microsoft en production. La SKU autonome gratuite Hyper-V Server s'arrête à 2019 (support étendu jusqu'au 10 janvier 2029) ; il n'y a plus de Hyper-V Server 2022/2025 gratuit.
- **Xen** : utilise par AWS pour ses premières instances EC2

Cas d'usage : serveurs de production en datacenter, infrastructure cloud, environnements critiques.

**Hyperviseur de type 2 (hosted)** :

L'hyperviseur s'installe sur un système d'exploitation existant (Windows, macOS, Linux). Il s'execute comme une application classique.

Exemples :

- **VirtualBox** : gratuit et multi-plateforme (Oracle)
- **VMware Workstation / Fusion** : solution commerciale (Workstation pour Windows/Linux, Fusion pour macOS)
- **QEMU** : emulateur et virtualiseur open source (souvent couple avec KVM)
- **Parallels Desktop** : solution pour macOS

Cas d'usage : postes de développement, tests, formation, environnements temporaires.

**Comparaison type 1 vs type 2** :

| Critère | Type 1 (bare-metal) | Type 2 (hosted) |
| --- | --- | --- |
| Installation | Sur le matériel directement | Sur un OS existant |
| Performance | Optimale (accès direct au matériel) | Reduite (passe par l'OS hôte) |
| Complexite | Configuration plus complexe | Installation simple comme une application |
| Cas d'usage | Production, datacenter | Développement, tests |
| Exemples | ESXi, Proxmox, Hyper-V Server | VirtualBox, VMware Workstation |

**Analogie concrète** : Un hyperviseur de type 1, c'est comme un gerant d'immeuble qui possède le bâtiment et repartit les étages entre les locataires. Il a un accès direct a toutes les ressources. Un hyperviseur de type 2, c'est comme un sous-locataire qui loue un étage et le repartit en bureaux. Il dépend du propriétaire de l'étage (le système d'exploitation hôte) pour accéder aux ressources.

<div class="diagram-design">
<p><a href="../../diagrams/24-virtualisation-01-concepts-virtualisation-1.html">Qu&#x27;est-ce qu&#x27;un hyperviseur ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/24-virtualisation-01-concepts-virtualisation-1.html" title="Qu&#x27;est-ce qu&#x27;un hyperviseur ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Machine virtuelle vs conteneur

**Définition** : Une machine virtuelle (VM) emule un ordinateur complet avec son propre système d'exploitation. Un conteneur partage le noyau du système hôte et isole uniquement l'application et ses dépendances.

**Le problème que les conteneurs résolvent par rapport aux VMs** :

Les VMs fonctionnent bien, mais elles ont des limites :

1. **Consommation de ressources** : Chaque VM embarque un système d'exploitation complet (noyau, pilotes, services système). Cela représente plusieurs centaines de Mo a plusieurs Go de mémoire, rien que pour l'OS.
2. **Démarrage lent** : Démarrer un système d'exploitation complet prend entre 30 secondes et plusieurs minutes.
3. **Duplication inutile** : Si tu as 10 VMs avec le meme OS, tu as 10 copies du même noyau en mémoire.

**Comment les conteneurs résolvent ces problèmes** :

| Problème | VM | Conteneur |
| --- | --- | --- |
| Consommation de ressources | Chaque VM a son propre OS (Go de RAM) | Le conteneur partage le noyau hôte (Mo de RAM) |
| Démarrage | 30 secondes a plusieurs minutes | Moins d'une seconde |
| Duplication | 10 VMs = 10 copies de l'OS | 10 conteneurs = 1 seul noyau partage |

**Ce qu'un conteneur n'est PAS** :

- Un conteneur n'est pas une VM allegee. C'est une technologie fondamentalement différente. Une VM virtualise le matériel. Un conteneur isole les processus au niveau du système d'exploitation.
- Un conteneur n'est pas aussi isole qu'une VM. Puisque les conteneurs partagent le noyau hôte, une faille dans le noyau peut affecter tous les conteneurs. Les VMs ont une isolation plus forte car chaque VM a son propre noyau.

**Quand utiliser quoi** :

| Situation | Choix recommande | Raison |
| --- | --- | --- |
| Applications microservices | Conteneur | Léger, démarrage rapide, orchestration facile |
| Isolation forte requise (multi-tenant) | VM | Noyau separe, isolation complete |
| Systèmes d'exploitation différents | VM | Chaque VM a son propre OS |
| Environnement de dev rapide | Conteneur | Démarrage instantané, images partagées |
| Applications legacy Windows sur Linux | VM | Necessite un OS Windows complet |

<div class="diagram-design">
<p><a href="../../diagrams/24-virtualisation-01-concepts-virtualisation-2.html">Machine virtuelle vs conteneur (HTML + SVG)</a></p>
<iframe src="../../diagrams/24-virtualisation-01-concepts-virtualisation-2.html" title="Machine virtuelle vs conteneur" style="width:100%;min-height:920px;border:0;background:transparent"></iframe>
</div>

---

### Emulation vs para-virtualisation

**Définition** : L'emulation et la para-virtualisation sont deux méthodes différentes pour permettre a un système d'exploitation invite (guest) de communiquer avec le matériel physique de l'hôte.

**Emulation (virtualisation complete)** :

L'hyperviseur simule un matériel virtuel complet. Le système d'exploitation invite croit qu'il tourne sur un vrai ordinateur. Il n'a pas besoin d'être modifie.

Fonctionnement :

1. Le système invite envoie une instruction au matériel virtuel
2. L'hyperviseur intercepte cette instruction
3. L'hyperviseur traduit l'instruction pour le matériel réel
4. Le résultat est renvoye au système invite

Avantages :

- Compatible avec n'importe quel système d'exploitation (pas de modification requise)
- Permet de virtualiser des architectures différentes (ARM sur x86, par exemple)

Inconvénients :

- Plus lent car chaque instruction doit être traduite
- Consomme plus de ressources processeur

**Para-virtualisation** :

Le système d'exploitation invite est modifie pour communiquer directement avec l'hyperviseur via une interface speciale (hypercalls). Il sait qu'il est virtualise et coopere avec l'hyperviseur.

Fonctionnement :

1. Le système invite envoie un hypercall directement a l'hyperviseur
2. L'hyperviseur traite la demande et accede au matériel réel
3. Le résultat est renvoye au système invite

Avantages :

- Beaucoup plus rapide que l'emulation (pas de traduction d'instructions)
- Moins de surcharge processeur

Inconvénients :

- Le système invite doit être modifie (pilotes para-virtualises - virtio)
- Tous les systèmes d'exploitation ne supportent pas la para-virtualisation

**Virtualisation assistee par le matériel (VT-x / AMD-V)** :

Les processeurs modernes (Intel VT-x, AMD-V) integrent des instructions speciales pour la virtualisation. L'hyperviseur n'a plus besoin de traduire les instructions privilegiees - le processeur les gère nativement.

C'est la méthode utilisée par KVM et les hyperviseurs modernes. Elle combine les avantages de l'emulation (compatibilité) et de la para-virtualisation (performance).

**Comparaison des trois approches** :

| Critère | Emulation | Para-virtualisation | Assistee par matériel |
| --- | --- | --- | --- |
| Modification de l'OS invite | Non | Oui (pilotes virtio) | Non |
| Performance | Faible | Bonne | Excellente |
| Compatibilite OS | Totale | Limitée | Totale |
| Exemple | QEMU (sans KVM) | Xen (mode PV) | KVM + QEMU |
| Cas d'usage | Emulation ARM sur x86 | Serveurs optimises | Usage général |

**Analogie concrète** : Imagine que tu parles a quelqu'un qui ne parle pas ta langue.

- **Emulation** : tu as un traducteur qui traduit chaque mot un par un. C'est lent mais ca fonctionne avec n'importe quelle langue.
- **Para-virtualisation** : l'autre personne a appris quelques mots de ta langue (les plus importants). La communication est plus rapide car elle evite la traduction pour les échanges courants.
- **Assistee par matériel** : vous avez tous les deux un ecouteur de traduction instantanée integre. La traduction est transparente et quasi instantanée.

---

## Étapes Pratiques

### Étape 1 : Verifier le support de la virtualisation matérielle

Avant de pouvoir créer des machines virtuelles avec KVM, ton processeur doit supporter la virtualisation matérielle (Intel VT-x ou AMD-V).

```bash
# Verifier si le processeur supporte la virtualisation
# Cherche "vmx" (Intel VT-x) ou "svm" (AMD-V) dans les flags du processeur
grep -E '(vmx|svm)' /proc/cpuinfo | head -1
```

**Résultat attendu** :

```text
flags           : ... vmx ...
```

Si rien ne s'affiche, la virtualisation n'est pas activee dans le BIOS/UEFI ou ton processeur ne la supporte pas.

```bash
# Methode alternative : utiliser lscpu
lscpu | grep -i "virtualisation\|virtualization"
```

**Résultat attendu** :

```text
Virtualization:                     VT-x
```

---

### Étape 2 : Verifier que KVM est utilisable

```bash
# Installer le paquet de verification (Debian/Ubuntu)
sudo apt install -y cpu-checker

# Verifier que KVM est utilisable
kvm-ok
```

**Résultat attendu** :

```text
INFO: /dev/kvm exists
KVM acceleration can be used
```

Si le résultat indique que KVM ne peut pas être utilise, verifie dans le BIOS/UEFI que la virtualisation est activee (Intel VT-x ou AMD-V).

---

### Étape 3 : Lister les machines virtuelles existantes (apercu)

Si KVM et libvirt sont installes (tu les installeras en détail dans la fiche suivante), tu peux lister les VMs :

```bash
# Lister les VMs (necessite libvirt installe)
sudo virsh list --all
```

**Résultat attendu** :

```text
 Id   Name   State
--------------------
```

La liste est vide car aucune VM n'a encore été créée. Tu creeras ta première VM dans la fiche suivante.

---

### Étape 4 : Explorer les informations de virtualisation du système

```bash
# Voir les informations detaillees sur le processeur
lscpu

# Voir la memoire disponible (utile pour dimensionner les VMs)
free -h

# Voir l'espace disque disponible (utile pour les images disque)
df -h /
```

**Résultat attendu** :

```text
# lscpu (extrait)
Architecture:            x86_64
CPU(s):                  8
Thread(s) per core:      2
Core(s) per socket:      4
Virtualization:          VT-x

# free -h
              total        used        free
Mem:           15Gi       4.2Gi        8.1Gi

# df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       100G   25G   71G  26% /
```

Note les valeurs de mémoire et d'espace disque. Tu en auras besoin pour dimensionner tes VMs dans les fiches suivantes.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `grep -E '(vmx\|svm)' /proc/cpuinfo` | Verifier le support de la virtualisation matérielle |
| `kvm-ok` | Verifier que KVM est utilisable |
| `lscpu` | Afficher les informations du processeur |
| `free -h` | Afficher la mémoire disponible |
| `df -h` | Afficher l'espace disque disponible |
| `sudo virsh list --all` | Lister toutes les VMs (KVM/libvirt) |

---

## Pièges Frequents

### Piège 1 : La virtualisation est desactivee dans le BIOS

**Problème** : Tu essaies de créer une VM avec KVM mais tu obtiens l'erreur "KVM acceleration can NOT be used". La virtualisation matérielle est desactivee dans le BIOS/UEFI de ta machine.

**Solution** : Redemarre ta machine, entre dans le BIOS/UEFI (touche F2, F12, Suppr ou Echap selon le fabricant), cherche l'option "Intel Virtualization Technology" ou "SVM Mode" et active-la. L'emplacement exact varie selon le fabricant :

- **Intel** : Advanced > CPU Configuration > Intel Virtualization Technology > Enabled
- **AMD** : Advanced > CPU Configuration > SVM Mode > Enabled

### Piège 2 : Confondre VM et conteneur

**Problème** : Tu utilises une VM pour chaque microservice de ton application. Tu te retrouves avec 15 VMs qui consomment 30 Go de RAM juste pour les systèmes d'exploitation.

**Solution** : Utilise des conteneurs (Docker, Podman) pour les microservices. Réserve les VMs pour les cas où tu as besoin d'une isolation forte ou d'un système d'exploitation différent. Une bonne approche : une VM par environnement (dev, staging, prod), des conteneurs pour les applications a l'intérieur de chaque VM.

### Piège 3 : Ne pas vérifier les ressources disponibles

**Problème** : Tu créés une VM avec 8 Go de RAM sur une machine qui n'en a que 16 Go. Le système hôte manque de mémoire et devient inutilisable.

**Solution** : Laisse toujours au minimum 2 Go de RAM pour le système hôte. Sur une machine avec 16 Go, n'alloue pas plus de 12 a 14 Go au total pour toutes les VMs combinees. Verifie avec `free -h` avant de créer une nouvelle VM.

---

## Checklist de Validation

- [ ] Je sais définir la virtualisation et expliquer ses avantages
- [ ] Je distingue un hyperviseur de type 1 (bare-metal) d'un type 2 (hosted)
- [ ] Je connais les differences entre une VM et un conteneur et je sais quand utiliser chacun
- [ ] Je comprends la difference entre emulation, para-virtualisation et virtualisation assistee par matériel
- [ ] J'ai verifie que mon processeur supporte la virtualisation matérielle
- [ ] Je sais combien de mémoire et d'espace disque j'ai disponible pour les VMs

---

## Exercice Pratique

**Enonce** : Classe les situations suivantes et indique si tu utiliserais une VM ou un conteneur, et quel type d'hyperviseur serait le plus adapte.

Situations a classer :

1. Deployer 20 microservices d'une application web
2. Heberger un serveur Windows sur une machine Linux de production
3. Tester une application sur un poste de développement
4. Isoler complètement les environnements de trois clients différents sur un meme serveur physique en datacenter
5. Executer un ancien logiciel prévu pour un processeur ARM sur une machine x86

**Indications** :

- Demande-toi si tu as besoin d'un système d'exploitation complet ou juste d'un environnement isole
- Reflechis au niveau d'isolation requis
- Considere si c'est un environnement de production ou de développement

**Résultat attendu** : Un tableau avec les colonnes Situation, Choix (VM ou conteneur), Type d'hyperviseur et Justification.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

| Situation | Choix | Type d'hyperviseur | Justification |
| --- | --- | --- | --- |
| 20 microservices web | Conteneur | - | Les conteneurs sont légers et rapides a démarrer. 20 VMs consommeraient trop de ressources |
| Windows sur Linux (production) | VM | Type 1 (Proxmox, ESXi) | Windows necessite son propre noyau. En production, un type 1 offre les meilleures performances |
| Test sur poste de dev | VM | Type 2 (VirtualBox) | Un hyperviseur de type 2 s'installe facilement sur un poste de travail existant |
| Isolation multi-client (datacenter) | VM | Type 1 (Proxmox, ESXi) | L'isolation entre clients doit être forte (noyaux separes). Le type 1 est adapte aux serveurs de production |
| Logiciel ARM sur x86 | VM (emulation) | Type 2 (QEMU) | QEMU peut emuler un processeur ARM sur x86. C'est de l'emulation, pas de la virtualisation classique |

Explications :

- **20 microservices** : Avec des conteneurs, tu utilises quelques centaines de Mo de mémoire au total. Avec des VMs, il te faudrait au minimum 20 Go rien que pour les systèmes d'exploitation (1 Go par VM minimum).
- **Windows sur Linux** : Un conteneur ne peut pas exécuter Windows sur un hôte Linux car les conteneurs partagent le noyau de l'hôte. Il faut obligatoirement une VM avec un noyau Windows.
- **Test sur poste de dev** : VirtualBox s'installe en quelques minutes sur Windows, macOS ou Linux. Pas besoin de reinstaller ton système d'exploitation pour un hyperviseur de type 1.
- **Isolation multi-client** : Si un client exploite une faille du noyau dans un conteneur, il pourrait accéder aux données des autres clients. Avec des VMs, chaque client a son propre noyau, ce qui rend ce type d'attaque beaucoup plus difficile.
- **Logiciel ARM sur x86** : C'est un cas d'emulation pure. QEMU traduit les instructions ARM en instructions x86 une par une. C'est lent mais c'est la seule solution sans matériel ARM.

---

## Navigation

→ Fiche suivante : **[02 - KVM et QEMU](02-kvm-qemu.md)**
