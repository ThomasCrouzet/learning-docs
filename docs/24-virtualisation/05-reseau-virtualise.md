---
tags:
  - Virtualisation
  - Intermédiaire
  - Pratique
description: "Réseau virtualisé : bridges, NAT, VLANs dans les VMs, Open vSwitch bases."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 6
cursus: "Virtualisation"
id: "infrastructure.virtualization.reseau-virtualise"
course_id: "infrastructure.virtualization"
content_type: "lesson"
order: 5
---

# 05 - Réseau virtualisé

> **En bref** : Tu apprendras à configurer les réseaux virtuels pour tes VMs, créer des bridges, configurer le NAT et les VLANs, et découvrir Open vSwitch pour des architectures réseau avancées. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [04 - Stockage virtualise](04-stockage-virtualise.md)
- Comprendre les bases des réseaux (IP, sous-réseaux, routage) - cursus [Réseaux](../20-reseaux/index.md)
- Savoir gérer des VMs avec KVM ou Proxmox (fiches [02](02-kvm-qemu.md) et [03](03-proxmox.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer un bridge Linux pour connecter des VMs au réseau physique, créer un réseau NAT isole, configurer des VLANs pour segmenter le trafic, et comprendre les bases d'Open vSwitch.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un bridge (pont réseau) ?

**Définition** : Un bridge est un commutateur (switch) virtuel logiciel. Il connecte plusieurs interfaces réseau (physiques ou virtuelles) sur le meme segment de réseau, exactement comme un switch physique connecte plusieurs cables Ethernet.

**Le problème que les bridges résolvent** :

Sans bridge, voici les problèmes rencontres :

1. **VMs isolées du réseau physique** : Les VMs sont sur un réseau interne. Elles ne peuvent pas être atteintes par les machines physiques du réseau local.
2. **Pas d'adresse IP sur le réseau local** : Les VMs doivent passer par du NAT pour communiquer avec l'extérieur. Les autres machines du réseau ne peuvent pas se connecter directement aux VMs.
3. **Configuration complexe du routage** : Sans bridge, tu dois configurer du port forwarding pour chaque service de chaque VM.

**Comment les bridges résolvent ces problèmes** :

| Problème | Solution apportée par le bridge |
| --- | --- |
| VMs isolées | Le bridge connecte les interfaces virtuelles des VMs au réseau physique |
| Pas d'IP sur le réseau local | Les VMs obtiennent une IP du DHCP du réseau local, comme une machine physique |
| Configuration complexe | Les VMs sont directement accessibles sur le réseau local, pas de NAT nécessaire |

**Analogie concrète** : Un bridge, c'est comme une multiprise réseau. Tu as une seule prise murale (interface physique), et le bridge te permet d'y brancher plusieurs cables (interfaces virtuelles des VMs). Chaque cable obtient sa propre adresse sur le réseau, comme s'il était branche directement au routeur.

**Ce qu'un bridge n'est PAS** :

- Un bridge n'est pas un routeur. Il ne fait pas de translation d'adresses (NAT) et ne route pas le trafic entre des réseaux différents. Il connecte des interfaces sur le meme réseau.
- Un bridge n'est pas un firewall. Il transmet tout le trafic entre les interfaces connectees sans filtrage. Pour filtrer, utilise `iptables` ou `nftables` en complement.

---

### Qu'est-ce que le NAT pour les VMs ?

**Définition** : Le NAT (Network Address Translation) dans un contexte de virtualisation permet aux VMs d'accéder a Internet en partageant l'adresse IP de l'hôte. Les VMs ont des adresses privées invisibles de l'extérieur.

**Le problème que le NAT résout** :

Sans NAT, voici les problèmes rencontres :

1. **Pas assez d'adresses IP** : Tu as une seule IP publique mais 10 VMs qui doivent accéder a Internet.
2. **Exposition involontaire** : Si les VMs sont directement sur le réseau, elles sont accessibles par n'importe qui sur ce réseau. Pour des VMs de test ou de développement, c'est un risque inutile.

**Comment le NAT résout ces problèmes** :

| Problème | Solution apportée par le NAT |
| --- | --- |
| Pas assez d'IPs | Toutes les VMs partagent l'IP de l'hôte pour accéder a l'extérieur |
| Exposition involontaire | Les VMs sont sur un réseau prive. Elles sont invisibles de l'extérieur sauf configuration explicite (port forwarding) |

**Comparaison bridge vs NAT** :

| Critère | Bridge | NAT |
| --- | --- | --- |
| IP des VMs | Sur le réseau local (ex: 192.168.1.x) | Réseau prive (ex: 192.168.122.x) |
| Visible de l'extérieur | Oui | Non (sauf port forwarding) |
| Accès Internet | Oui | Oui (via l'hôte) |
| Cas d'usage | Serveurs de production | VMs de test, développement |
| Configuration | Plus complexe | Plus simple (défaut de libvirt) |

---

### Qu'est-ce qu'un VLAN ?

**Définition** : Un VLAN (Virtual Local Area Network) est un réseau logique isole a l'intérieur d'un réseau physique. Il permet de segmenter le trafic sans ajouter de cablage physique. Chaque VLAN est identifie par un numéro (tag) de 1 a 4094.

**Le problème que les VLANs résolvent** :

Sans VLANs, voici les problèmes rencontres :

1. **Pas de segmentation** : Toutes les VMs sont sur le meme réseau. Une VM compromise peut attaquer toutes les autres.
2. **Broadcast excessif** : Chaque message broadcast est envoyé a toutes les VMs, meme celles qui n'en ont pas besoin. Avec 100 VMs, le trafic broadcast sature le réseau.
3. **Pas de règles par zone** : Impossible d'appliquer des politiques de sécurité différentes (par exemple : les VMs web accessibles de l'extérieur, les VMs de base de données accessibles uniquement en interne).

**Comment les VLANs résolvent ces problèmes** :

| Problème | Solution apportée par les VLANs |
| --- | --- |
| Pas de segmentation | Chaque VLAN est un réseau isole. Une VM sur le VLAN 10 ne peut pas communiquer avec le VLAN 20 sans routeur |
| Broadcast excessif | Les broadcasts restent dans leur VLAN. Moins de trafic parasite |
| Pas de règles par zone | Chaque VLAN a ses propres règles de firewall et d'accès |

**Analogie concrète** : Un VLAN, c'est comme les étages d'un immeuble de bureaux. Chaque étage (VLAN) a ses propres bureaux et son propre couloir. Les employés d'un étage ne voient pas les employés d'un autre étage, même si tout le monde est dans le meme bâtiment (le meme réseau physique). Pour communiquer entre étages, il faut passer par l'ascenseur (le routeur).

---

### Qu'est-ce qu'Open vSwitch ?

**Définition** : Open vSwitch (OVS) est un switch virtuel logiciel avance. Contrairement aux bridges Linux standards, OVS supporte nativement les VLANs, le monitoring de flux (NetFlow, sFlow), le protocole OpenFlow et la gestion centralisée du réseau.

**Le problème qu'Open vSwitch résout** :

Sans OVS, les bridges Linux standards ont des limites :

1. **Gestion des VLANs limitée** : Les bridges Linux supportent les VLANs, mais la configuration est fastidieuse et manque d'outils de gestion.
2. **Pas de monitoring de flux** : Impossible de voir quel trafic passe par le bridge, vers quelle destination, en quelle quantité.
3. **Pas de gestion centralisée** : Chaque bridge est configure indépendamment. Avec des dizaines de serveurs, la configuration devient ingerable.

**Comment Open vSwitch résout ces problèmes** :

| Problème | Solution apportée par OVS |
| --- | --- |
| Gestion des VLANs limitée | OVS gère les VLANs avec des commandes simples (`ovs-vsctl set port`) |
| Pas de monitoring | OVS supporte NetFlow, sFlow et IPFIX pour visualiser les flux |
| Pas de gestion centralisée | OVS supporte OpenFlow, un protocole standard pour contrôler les switches a distance |

**Comparaison bridge Linux vs Open vSwitch** :

| Critère | Bridge Linux | Open vSwitch |
| --- | --- | --- |
| Installation | Inclus dans le noyau | Paquet supplémentaire |
| VLANs | Support basique | Support complet avec trunk/access |
| Monitoring | Aucun | NetFlow, sFlow, IPFIX |
| OpenFlow | Non | Oui |
| Complexite | Simple | Plus complexe |
| Cas d'usage | Petites infras, VMs simples | Datacenters, SDN, infras complexes |

**Analogie concrète** : Le bridge Linux, c'est un simple switch non-manageable que tu branches et qui fonctionne. Open vSwitch, c'est un switch manageable avec une interface web, des statistiques de trafic, des VLANs configurables et une gestion a distance. Les deux font passer le trafic, mais le second te donne beaucoup plus de controle.

---

## Étapes Pratiques

### Étape 1 : Créer un bridge Linux

```bash
# Installer les outils necessaires
sudo apt install -y bridge-utils

# Creer un bridge
sudo ip link add name br0 type bridge

# Ajouter l'interface physique au bridge
# Attention : tu perdras temporairement la connexion si tu es connecte en SSH via cette interface
sudo ip link set enp0s3 master br0

# Activer le bridge
sudo ip link set br0 up

# Assigner une IP au bridge (au lieu de l'interface physique)
sudo ip addr add 192.168.1.50/24 dev br0

# Ajouter la route par defaut
sudo ip route add default via 192.168.1.1 dev br0

# Verifier la configuration
bridge link show
```

**Résultat attendu** :

```text
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 master br0 state forwarding
```

---

### Étape 2 : Rendre le bridge permanent (Debian/Ubuntu)

```bash
# Editer le fichier de configuration reseau
sudo tee /etc/network/interfaces << 'EOF'
# Interface physique (sans IP, esclave du bridge)
auto enp0s3
iface enp0s3 inet manual

# Bridge
auto br0
iface br0 inet static
    address 192.168.1.50
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 192.168.1.1
    bridge_ports enp0s3
    bridge_stp off
    bridge_fd 0
EOF

# Redemarrer le reseau
sudo systemctl restart networking
```

**Résultat attendu** :

```text
Le bridge br0 est actif avec l'IP 192.168.1.50.
L'interface enp0s3 est esclave du bridge.
```

---

### Étape 3 : Connecter une VM au bridge

```bash
# Creer une VM connectee au bridge br0 (au lieu du reseau NAT default)
virt-install \
  --name vm-bridged \
  --ram 1024 \
  --vcpus 1 \
  --disk path=/var/lib/libvirt/images/vm-bridged.qcow2,size=10,format=qcow2 \
  --os-variant debian12 \
  --network bridge=br0,model=virtio \
  --graphics vnc \
  --cdrom /var/lib/libvirt/images/iso/debian-12.15.0-amd64-netinst.iso \
  --boot cdrom
```

La VM obtiendra une adresse IP du DHCP de ton réseau local (par exemple `192.168.1.51`), comme une machine physique.

**Résultat attendu** :

```text
La VM demarre et obtient une IP sur le reseau 192.168.1.0/24.
Elle est accessible directement depuis les autres machines du reseau local.
```

---

### Étape 4 : Configurer un réseau NAT avec iptables

```bash
# Creer un bridge interne pour le reseau NAT
sudo ip link add name br-nat type bridge
sudo ip addr add 10.0.0.1/24 dev br-nat
sudo ip link set br-nat up

# Activer le forwarding IP
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Rendre le forwarding permanent
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Configurer le NAT avec iptables
sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o enp0s3 -j MASQUERADE

# Autoriser le trafic forward
sudo iptables -A FORWARD -i br-nat -o enp0s3 -j ACCEPT
sudo iptables -A FORWARD -i enp0s3 -o br-nat -m state --state RELATED,ESTABLISHED -j ACCEPT

# Verifier les regles
sudo iptables -t nat -L -n -v
```

**Résultat attendu** :

```text
Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination
MASQUERADE  all  --  10.0.0.0/24          0.0.0.0/0
```

Les VMs sur le bridge `br-nat` avec une adresse en `10.0.0.x` peuvent accéder a Internet via l'hôte.

---

### Étape 5 : Configurer un port forwarding

Pour rendre un service d'une VM NAT accessible de l'extérieur :

```bash
# Rediriger le port 8080 de l'hote vers le port 80 de la VM 10.0.0.10
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.0.0.10:80

# Autoriser le trafic vers cette destination
sudo iptables -A FORWARD -p tcp -d 10.0.0.10 --dport 80 -j ACCEPT
```

**Résultat attendu** :

```text
En accedant a http://<ip-hote>:8080, tu atteins le serveur web de la VM 10.0.0.10 sur le port 80.
```

---

### Étape 6 : Configurer des VLANs

```bash
# Installer le support VLAN
sudo apt install -y vlan
sudo modprobe 8021q

# Rendre le module permanent
echo "8021q" | sudo tee -a /etc/modules

# Creer une interface VLAN 10 sur l'interface physique
sudo ip link add link enp0s3 name enp0s3.10 type vlan id 10
sudo ip link set enp0s3.10 up

# Creer un bridge pour le VLAN 10
sudo ip link add name br-vlan10 type bridge
sudo ip link set enp0s3.10 master br-vlan10
sudo ip addr add 10.10.10.1/24 dev br-vlan10
sudo ip link set br-vlan10 up

# Creer une interface VLAN 20
sudo ip link add link enp0s3 name enp0s3.20 type vlan id 20
sudo ip link set enp0s3.20 up

# Creer un bridge pour le VLAN 20
sudo ip link add name br-vlan20 type bridge
sudo ip link set enp0s3.20 master br-vlan20
sudo ip addr add 10.10.20.1/24 dev br-vlan20
sudo ip link set br-vlan20 up

# Verifier les VLANs
cat /proc/net/vlan/config
```

**Résultat attendu** :

```text
VLAN Dev name    | VLAN ID
Name-Type: VLAN_NAME_TYPE_RAW_PLUS_VID_NO_PAD
enp0s3.10      | 10  | enp0s3
enp0s3.20      | 20  | enp0s3
```

---

### Étape 7 : Connecter des VMs aux VLANs dans Proxmox

**Via l'interface web** :

1. Selectionne la VM
2. Va dans **Hardware** puis **Network Device**
3. Selectionne le bridge `vmbr0`
4. Dans le champ **VLAN Tag**, entre le numéro du VLAN (par exemple `10`)

**Via la ligne de commande** :

```bash
# Configurer une VM sur le VLAN 10
qm set 200 --net0 virtio,bridge=vmbr0,tag=10

# Configurer une VM sur le VLAN 20
qm set 201 --net0 virtio,bridge=vmbr0,tag=20

# Verifier
qm config 200 | grep net
qm config 201 | grep net
```

**Résultat attendu** :

```text
# VM 200
net0: virtio=XX:XX:XX:XX:XX:XX,bridge=vmbr0,tag=10

# VM 201
net0: virtio=XX:XX:XX:XX:XX:XX,bridge=vmbr0,tag=20
```

Les deux VMs sont sur le meme bridge physique mais dans des VLANs différents. Elles ne peuvent pas communiquer entre elles sans routeur.

---

### Étape 8 : Installer et configurer Open vSwitch (bases)

```bash
# Installer Open vSwitch
sudo apt install -y openvswitch-switch

# Verifier que le service est actif
sudo systemctl status openvswitch-switch

# Creer un bridge OVS
sudo ovs-vsctl add-br ovs-br0

# Ajouter une interface physique au bridge OVS
sudo ovs-vsctl add-port ovs-br0 enp0s4

# Ajouter un port avec un VLAN tag (access port)
sudo ovs-vsctl add-port ovs-br0 vnet0 tag=10

# Ajouter un port trunk (qui transporte plusieurs VLANs)
sudo ovs-vsctl add-port ovs-br0 enp0s5 trunks=10,20,30

# Voir la configuration du bridge OVS
sudo ovs-vsctl show
```

**Résultat attendu** :

```text
Bridge ovs-br0
    Port ovs-br0
        Interface ovs-br0
            type: internal
    Port enp0s4
        Interface enp0s4
    Port vnet0
        tag: 10
        Interface vnet0
    Port enp0s5
        trunks: [10, 20, 30]
        Interface enp0s5
```

```bash
# Voir les flux sur le bridge
sudo ovs-ofctl dump-flows ovs-br0

# Voir les statistiques des ports
sudo ovs-ofctl dump-ports ovs-br0
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ip link add name <br> type bridge` | Créer un bridge Linux |
| `ip link set <iface> master <br>` | Ajouter une interface a un bridge |
| `bridge link show` | Lister les interfaces d'un bridge |
| `virsh net-list --all` | Lister les réseaux libvirt |
| `virsh net-info <reseau>` | Informations sur un réseau libvirt |
| `iptables -t nat -L -n` | Lister les règles NAT |
| `cat /proc/net/vlan/config` | Lister les VLANs configures |
| `ovs-vsctl show` | Voir la configuration Open vSwitch |
| `ovs-vsctl add-br <nom>` | Créer un bridge OVS |
| `ovs-vsctl add-port <br> <port>` | Ajouter un port a un bridge OVS |
| `ovs-ofctl dump-flows <br>` | Voir les flux d'un bridge OVS |

---

## Pièges Fréquents

### Piège 1 : Perdre la connexion SSH en configurant le bridge

**Problème** : Tu ajoutes ton interface physique (par laquelle tu es connecte en SSH) a un bridge sans avoir d'abord configure l'IP du bridge. Tu perds la connexion.

**Solution** : Toujours configurer le bridge dans un script ou dans `/etc/network/interfaces` et appliquer les changements d'un coup. Si tu configures en ligne de commande, prepare toutes les commandes a l'avance et execute-les dans un script ou dans un seul `bash -c` :

```bash
sudo bash -c '
ip link add name br0 type bridge
ip link set enp0s3 master br0
ip addr del 192.168.1.50/24 dev enp0s3
ip addr add 192.168.1.50/24 dev br0
ip link set br0 up
ip route add default via 192.168.1.1 dev br0
'
```

### Piège 2 : Oublier d'activer le forwarding IP pour le NAT

**Problème** : Tu configures les règles iptables pour le NAT, mais les VMs ne peuvent pas accéder a Internet. Le forwarding IP est desactive par défaut sur Linux.

**Solution** : Active le forwarding IP :

```bash
# Temporaire
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Permanent
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Piège 3 : VLANs non propages par le switch physique

**Problème** : Tu configures des VLANs sur le serveur mais les VMs sur différents serveurs physiques ne peuvent pas communiquer dans le meme VLAN. Le switch physique entre les deux serveurs ne propage pas les tags VLAN.

**Solution** : Configure le port du switch physique en mode trunk pour qu'il transporte les tags VLAN. Sans cette configuration sur le switch physique, les tags VLAN sont supprimes a la sortie du serveur.

### Piège 4 : Confondre VLAN tag et sous-réseau IP

**Problème** : Tu penses qu'assigner un VLAN tag a une VM change automatiquement son sous-réseau IP. La VM ne peut plus communiquer car elle a une IP sur le mauvais sous-réseau.

**Solution** : Le VLAN tag isole le trafic au niveau 2 (Ethernet). L'adresse IP (niveau 3) doit être configurée séparément dans la VM. Chaque VLAN doit avoir son propre sous-réseau IP et son propre serveur DHCP ou sa propre plage d'adresses statiques.

---

## Checklist de Validation

- [ ] Je sais créer un bridge Linux et y connecter des VMs
- [ ] Je comprends la difference entre un réseau bridge et un réseau NAT
- [ ] Je sais configurer les règles iptables pour le NAT et le port forwarding
- [ ] Je sais créer et configurer des VLANs
- [ ] Je sais connecter des VMs a des VLANs dans Proxmox
- [ ] Je comprends le rôle d'Open vSwitch et je sais créer un bridge OVS basique

---

## Exercice Pratique

**Énoncé** : Créé une architecture réseau pour une petite application web :

1. Un bridge `br-web` pour les serveurs web (VLAN 10, sous-réseau `10.10.10.0/24`)
2. Un bridge `br-db` pour les bases de données (VLAN 20, sous-réseau `10.10.20.0/24`)
3. Le réseau web doit avoir accès a Internet via NAT
4. Le réseau base de données doit être complètement isole (pas d'accès Internet)
5. Configure du port forwarding pour que le port 80 de l'hôte redirige vers le serveur web (`10.10.10.10`)

**Indications** :

- Créé les interfaces VLAN et les bridges associes
- Active le forwarding IP et configure le NAT uniquement pour le sous-réseau web
- Configure les règles iptables pour le port forwarding
- Ne configure pas de règle NAT pour le sous-réseau base de données

**Résultat attendu** :

- Une VM sur `br-web` peut accéder a Internet
- Une VM sur `br-db` ne peut pas accéder a Internet
- Le port 80 de l'hôte redirige vers `10.10.10.10:80`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Créer les interfaces VLAN et les bridges** :

```bash
# Charger le module VLAN
sudo modprobe 8021q

# VLAN 10 - Web
sudo ip link add link enp0s3 name enp0s3.10 type vlan id 10
sudo ip link set enp0s3.10 up
sudo ip link add name br-web type bridge
sudo ip link set enp0s3.10 master br-web
sudo ip addr add 10.10.10.1/24 dev br-web
sudo ip link set br-web up

# VLAN 20 - Base de donnees
sudo ip link add link enp0s3 name enp0s3.20 type vlan id 20
sudo ip link set enp0s3.20 up
sudo ip link add name br-db type bridge
sudo ip link set enp0s3.20 master br-db
sudo ip addr add 10.10.20.1/24 dev br-db
sudo ip link set br-db up
```

**Configurer le NAT uniquement pour le réseau web** :

```bash
# Activer le forwarding IP
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# NAT pour le sous-reseau web uniquement
sudo iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o enp0s3 -j MASQUERADE

# Autoriser le forward pour le reseau web
sudo iptables -A FORWARD -i br-web -o enp0s3 -j ACCEPT
sudo iptables -A FORWARD -i enp0s3 -o br-web -m state --state RELATED,ESTABLISHED -j ACCEPT

# Bloquer explicitement le forward pour le reseau DB
sudo iptables -A FORWARD -i br-db -o enp0s3 -j DROP
```

**Configurer le port forwarding** :

```bash
# Rediriger le port 80 de l'hote vers le serveur web
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.10.10.10:80
sudo iptables -A FORWARD -p tcp -d 10.10.10.10 --dport 80 -j ACCEPT
```

**Vérification** :

```bash
# Verifier les bridges
bridge link show
```

```text
enp0s3.10: <BROADCAST,MULTICAST,UP> mtu 1500 master br-web state forwarding
enp0s3.20: <BROADCAST,MULTICAST,UP> mtu 1500 master br-db state forwarding
```

```bash
# Verifier les regles iptables
sudo iptables -t nat -L -n
sudo iptables -L -n
```

```text
Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination
MASQUERADE  all  --  10.10.10.0/24        0.0.0.0/0

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0   (br-web -> enp0s3)
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0   state RELATED,ESTABLISHED
DROP       all  --  0.0.0.0/0            0.0.0.0/0   (br-db -> enp0s3)
ACCEPT     tcp  --  0.0.0.0/0            10.10.10.10  tcp dpt:80
```

La VM web sur `10.10.10.10` peut accéder a Internet et est accessible depuis l'extérieur sur le port 80. La VM base de données sur `10.10.20.x` ne peut pas accéder a Internet et n'est pas visible de l'extérieur.

---

## Navigation

← Fiche précédente : **[04 - Stockage virtualise](04-stockage-virtualise.md)**

→ Fiche suivante : **[06 - Projet intégrateur](06-projet-integrateur.md)**
