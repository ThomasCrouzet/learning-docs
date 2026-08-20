---
tags:
  - Virtualisation
  - Avancé
  - Pratique
description: "Projet intégrateur : infrastructure virtualisee multi-VMs avec réseau segmente, stockage partage et haute disponibilité."
estimated_time: "120 min"
fiche_number: 6
total_fiches: 6
cursus: "Virtualisation"
---

# 06 - Projet intégrateur

> **En bref** : Tu mettras en pratique l'ensemble du cursus en construisant une infrastructure virtualisee complete : plusieurs VMs sur des réseaux segmentes, du stockage partage, des snapshots et de la documentation. Lecture estimée : 120 min.

## Prérequis

- Avoir lu toutes les fiches précédentes du cursus :
  - [01 - Concepts de virtualisation](01-concepts-virtualisation.md)
  - [02 - KVM et QEMU](02-kvm-qemu.md)
  - [03 - Proxmox VE](03-proxmox.md)
  - [04 - Stockage virtualise](04-stockage-virtualise.md)
  - [05 - Réseau virtualise](05-reseau-virtualise.md)
- Disposer d'un serveur Proxmox VE fonctionnel (ou d'un poste Linux avec KVM/QEMU installe)
- Avoir au minimum 8 Go de RAM et 50 Go d'espace disque disponibles

## Objectif de cette fiche

A la fin de cette fiche, tu auras construit une infrastructure virtualisee complete comprenant un serveur web, un serveur de base de données et un serveur de monitoring, chacun sur des réseaux segmentes avec des règles de sécurité adaptees.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une architecture multi-tiers ?

**Définition** : Une architecture multi-tiers (ou multi-niveaux) est un modèle d'organisation d'infrastructure ou chaque niveau (tier) remplit un rôle spécifique et est isole des autres par des règles de réseau et de sécurité.

**Le problème que l'architecture multi-tiers résout** :

Sans architecture multi-tiers, voici les problèmes rencontres :

1. **Tout sur un seul serveur** : Le serveur web, la base de données et le monitoring sont sur la même machine. Si le serveur web est compromis, l'attaquant accede directement a la base de données.
2. **Pas de scalabilité indépendante** : Si le serveur web a besoin de plus de ressources, tu dois augmenter les ressources de la machine entière, même si la base de données n'en a pas besoin.
3. **Pas de maintenance isolée** : Pour mettre a jour la base de données, tu dois arrêter le serveur web.

**Comment l'architecture multi-tiers résout ces problèmes** :

| Problème | Solution apportée par le multi-tiers |
| --- | --- |
| Tout sur un seul serveur | Chaque tier est une VM séparée. Compromettre le tier web ne donne pas accès au tier base de données |
| Pas de scalabilité indépendante | Chaque VM a ses propres ressources. Tu augmentes la RAM du serveur web sans toucher a la base de données |
| Pas de maintenance isolée | Tu redemarres la VM de base de données sans affecter le serveur web (si le web gère la reconnexion) |

**Analogie concrète** : Imagine un restaurant. La salle (tier web) accueille les clients. La cuisine (tier application/base de données) prepare les plats. Le bureau du gerant (tier monitoring) surveille les opérations. Chaque zone a sa propre porte et ses propres règles d'accès. Les clients ne vont pas en cuisine, et le cuisinier ne va pas dans le bureau du gerant.

---

### Architecture du projet

Le projet consiste a construire l'infrastructure suivante :

<div class="diagram-design">
<p><a href="../../diagrams/24-virtualisation-06-projet-integrateur-1.html">Architecture du projet (HTML + SVG)</a></p>
<iframe src="../../diagrams/24-virtualisation-06-projet-integrateur-1.html" title="Architecture du projet" style="width:100%;min-height:600px;border:0;background:transparent"></iframe>
</div>

**Composants** :

| VM | Role | VLAN | IP | RAM | CPU | Disque |
| --- | --- | --- | --- | --- | --- | --- |
| web-server | Serveur web Nginx | 10 (DMZ) | 10.10.10.10 | 1 Go | 1 vCPU | 10 Go |
| db-server | Base de données PostgreSQL | 20 (Backend) | 10.10.20.10 | 2 Go | 2 vCPU | 20 Go |
| monitoring | Prometheus + Grafana | 30 (Management) | 10.10.30.10 | 1 Go | 1 vCPU | 15 Go |

**Règles réseau** :

| Source | Destination | Ports autorises | Raison |
| --- | --- | --- | --- |
| Internet | web-server | TCP 80, 443 | Accès au site web |
| web-server | db-server | TCP 5432 | Connexion PostgreSQL |
| monitoring | web-server | TCP 9100 | Collecte des métriques (node_exporter) |
| monitoring | db-server | TCP 9100, 9187 | Collecte des métriques (node + postgres_exporter) |
| Aucune VM | Internet | - | Pas d'accès sortant (sauf web-server pour les mises à jour) |

---

## Étapes Pratiques

### Étape 1 : Creer les réseaux VLAN

**Sur Proxmox** :

```bash
# Creer les bridges VLAN dans /etc/network/interfaces
cat >> /etc/network/interfaces << 'EOF'

# VLAN 10 - DMZ
auto vmbr0.10
iface vmbr0.10 inet manual
    vlan-raw-device vmbr0

auto vmbr10
iface vmbr10 inet static
    address 10.10.10.1/24
    bridge_ports vmbr0.10
    bridge_stp off
    bridge_fd 0

# VLAN 20 - Backend
auto vmbr0.20
iface vmbr0.20 inet manual
    vlan-raw-device vmbr0

auto vmbr20
iface vmbr20 inet static
    address 10.10.20.1/24
    bridge_ports vmbr0.20
    bridge_stp off
    bridge_fd 0

# VLAN 30 - Management
auto vmbr0.30
iface vmbr0.30 inet manual
    vlan-raw-device vmbr0

auto vmbr30
iface vmbr30 inet static
    address 10.10.30.1/24
    bridge_ports vmbr0.30
    bridge_stp off
    bridge_fd 0
EOF

# Appliquer la configuration
ifreload -a
```

**Avec KVM/libvirt** (alternative sans Proxmox) :

```bash
# Creer trois reseaux isoles avec libvirt
cat > /tmp/net-dmz.xml << 'EOF'
<network>
  <name>dmz</name>
  <bridge name="virbr-dmz"/>
  <ip address="10.10.10.1" netmask="255.255.255.0">
    <dhcp>
      <range start="10.10.10.2" end="10.10.10.254"/>
    </dhcp>
  </ip>
</network>
EOF

cat > /tmp/net-backend.xml << 'EOF'
<network>
  <name>backend</name>
  <bridge name="virbr-back"/>
  <ip address="10.10.20.1" netmask="255.255.255.0">
    <dhcp>
      <range start="10.10.20.2" end="10.10.20.254"/>
    </dhcp>
  </ip>
</network>
EOF

cat > /tmp/net-mgmt.xml << 'EOF'
<network>
  <name>management</name>
  <bridge name="virbr-mgmt"/>
  <ip address="10.10.30.1" netmask="255.255.255.0">
    <dhcp>
      <range start="10.10.30.2" end="10.10.30.254"/>
    </dhcp>
  </ip>
</network>
EOF

# Definir, demarrer et activer les reseaux
for net in dmz backend management; do
  virsh net-define /tmp/net-${net}.xml
  virsh net-start ${net}
  virsh net-autostart ${net}
done

# Verifier
virsh net-list --all
```

**Résultat attendu** :

```text
 Name          State    Autostart   Persistent
------------------------------------------------
 backend       active   yes         yes
 default       active   yes         yes
 dmz           active   yes         yes
 management    active   yes         yes
```

---

### Étape 2 : Creer les machines virtuelles

**Sur Proxmox** :

```bash
# VM 1 : web-server (VLAN 10)
qm create 300 \
  --name web-server \
  --memory 1024 \
  --cores 1 \
  --cpu cputype=host \
  --scsihw virtio-scsi-single \
  --scsi0 local-lvm:10,format=raw \
  --net0 virtio,bridge=vmbr10 \
  --ipconfig0 ip=10.10.10.10/24,gw=10.10.10.1 \
  --agent enabled=1

# VM 2 : db-server (VLAN 20)
qm create 301 \
  --name db-server \
  --memory 2048 \
  --cores 2 \
  --cpu cputype=host \
  --scsihw virtio-scsi-single \
  --scsi0 local-lvm:20,format=raw \
  --net0 virtio,bridge=vmbr20 \
  --ipconfig0 ip=10.10.20.10/24,gw=10.10.20.1 \
  --agent enabled=1

# VM 3 : monitoring (VLAN 30 + acces aux VLANs 10 et 20)
qm create 302 \
  --name monitoring \
  --memory 1024 \
  --cores 1 \
  --cpu cputype=host \
  --scsihw virtio-scsi-single \
  --scsi0 local-lvm:15,format=raw \
  --net0 virtio,bridge=vmbr30 \
  --net1 virtio,bridge=vmbr10 \
  --net2 virtio,bridge=vmbr20 \
  --ipconfig0 ip=10.10.30.10/24,gw=10.10.30.1 \
  --agent enabled=1
```

**Avec KVM/libvirt** :

```bash
# VM 1 : web-server
virt-install \
  --name web-server \
  --ram 1024 \
  --vcpus 1 \
  --disk path=/var/lib/libvirt/images/web-server.qcow2,size=10,format=qcow2 \
  --os-variant debian12 \
  --network network=dmz \
  --graphics vnc \
  --cdrom /var/lib/libvirt/images/iso/debian-12.15.0-amd64-netinst.iso \
  --boot cdrom

# Point Debian 12.15 : dernier point bookworm au 11 juillet 2026
# (https://cdimage.debian.org/cdimage/archive/12.15.0/). Debian 13 est
# la stable courante ; ce lab reste sur debian12 / bookworm.

# VM 2 : db-server
virt-install \
  --name db-server \
  --ram 2048 \
  --vcpus 2 \
  --disk path=/var/lib/libvirt/images/db-server.qcow2,size=20,format=qcow2 \
  --os-variant debian12 \
  --network network=backend \
  --graphics vnc \
  --cdrom /var/lib/libvirt/images/iso/debian-12.15.0-amd64-netinst.iso \
  --boot cdrom

# VM 3 : monitoring (connecte aux trois reseaux)
virt-install \
  --name monitoring \
  --ram 1024 \
  --vcpus 1 \
  --disk path=/var/lib/libvirt/images/monitoring.qcow2,size=15,format=qcow2 \
  --os-variant debian12 \
  --network network=management \
  --network network=dmz \
  --network network=backend \
  --graphics vnc \
  --cdrom /var/lib/libvirt/images/iso/debian-12.15.0-amd64-netinst.iso \
  --boot cdrom
```

**Résultat attendu** :

```text
Trois VMs sont creees. Chacune est connectee a son propre reseau.
La VM monitoring a trois interfaces reseau pour atteindre les trois VLANs.
```

---

### Étape 3 : Installer et configurer le serveur web

Après l'installation de Debian dans la VM `web-server`, connecte-toi et installe Nginx :

```bash
# Dans la VM web-server

# Configurer l'IP statique (si pas fait via cloud-init)
cat > /etc/network/interfaces << 'EOF'
auto lo
iface lo inet loopback

auto enp0s3
iface enp0s3 inet static
    address 10.10.10.10
    netmask 255.255.255.0
    gateway 10.10.10.1
EOF

systemctl restart networking

# Installer Nginx
apt update && apt install -y nginx

# Creer une page de test
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Infrastructure Virtualisee</title></head>
<body>
<h1>Serveur Web - VLAN 10 (DMZ)</h1>
<p>Ce serveur fonctionne dans l'infrastructure virtualisee.</p>
</body>
</html>
EOF

# Verifier que Nginx fonctionne
systemctl status nginx
curl localhost
```

**Résultat attendu** :

```text
● nginx.service - A high performance web server and a reverse proxy server
     Active: active (running)
```

---

### Étape 4 : Installer et configurer la base de données

```bash
# Dans la VM db-server

# Configurer l'IP statique
cat > /etc/network/interfaces << 'EOF'
auto lo
iface lo inet loopback

auto enp0s3
iface enp0s3 inet static
    address 10.10.20.10
    netmask 255.255.255.0
    gateway 10.10.20.1
EOF

systemctl restart networking

# Installer PostgreSQL (Debian 12 livre PostgreSQL 15 dans les dépôts par défaut :
# paquet postgresql 15+248+deb12u1, voir packages.debian.org/bookworm/postgresql)
apt update && apt install -y postgresql

# Configurer PostgreSQL pour ecouter sur toutes les interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" \
  /etc/postgresql/15/main/postgresql.conf

# Autoriser les connexions depuis le VLAN web (10.10.10.0/24)
echo "host all all 10.10.10.0/24 scram-sha-256" >> \
  /etc/postgresql/15/main/pg_hba.conf

# Redemarrer PostgreSQL
systemctl restart postgresql

# Creer un utilisateur et une base de test
sudo -u postgres psql -c "CREATE USER webapp WITH PASSWORD 'MotDePasseDB123';"
sudo -u postgres psql -c "CREATE DATABASE appdb OWNER webapp;"

# Verifier que PostgreSQL ecoute
ss -tlnp | grep 5432
```

**Résultat attendu** :

```text
LISTEN 0      244          0.0.0.0:5432       0.0.0.0:*    users:(("postgres",pid=1234,fd=5))
```

---

### Étape 5 : Configurer les règles de firewall

Sur l'hôte de virtualisation, configure les règles de trafic entre les VLANs :

```bash
# Activer le forwarding IP
echo 1 > /proc/sys/net/ipv4/ip_forward

# Politique par defaut : tout bloquer entre les VLANs
iptables -P FORWARD DROP

# Autoriser le trafic etabli/associe (reponses aux connexions deja autorisees)
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

# Regle 1 : Internet -> web-server (ports 80 et 443)
iptables -t nat -A PREROUTING -p tcp -m multiport --dports 80,443 -j DNAT --to-destination 10.10.10.10
iptables -A FORWARD -p tcp -d 10.10.10.10 -m multiport --dports 80,443 -j ACCEPT

# Regle 2 : web-server -> db-server (port 5432)
iptables -A FORWARD -s 10.10.10.10 -d 10.10.20.10 -p tcp --dport 5432 -j ACCEPT

# Regle 3 : monitoring -> web-server (port 9100 - node_exporter)
iptables -A FORWARD -s 10.10.30.10 -d 10.10.10.10 -p tcp --dport 9100 -j ACCEPT

# Regle 4 : monitoring -> db-server (ports 9100 et 9187)
iptables -A FORWARD -s 10.10.30.10 -d 10.10.20.10 -p tcp -m multiport --dports 9100,9187 -j ACCEPT

# Regle 5 : NAT pour que web-server accede a Internet (mises a jour)
iptables -t nat -A POSTROUTING -s 10.10.10.0/24 -o enp0s3 -j MASQUERADE
iptables -A FORWARD -s 10.10.10.0/24 -o enp0s3 -j ACCEPT

# Verifier les regles
iptables -L -n -v
iptables -t nat -L -n -v
```

**Résultat attendu** :

```text
Chain FORWARD (policy DROP)
target     prot opt source               destination
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0     state RELATED,ESTABLISHED
ACCEPT     tcp  --  0.0.0.0/0            10.10.10.10   multiport dports 80,443
ACCEPT     tcp  --  10.10.10.10          10.10.20.10   tcp dpt:5432
ACCEPT     tcp  --  10.10.30.10          10.10.10.10   tcp dpt:9100
ACCEPT     tcp  --  10.10.30.10          10.10.20.10   multiport dports 9100,9187
ACCEPT     all  --  10.10.10.0/24        0.0.0.0/0
```

---

### Étape 6 : Tester la connectivite

```bash
# Depuis web-server : tester la connexion a PostgreSQL
apt install -y postgresql-client
psql -h 10.10.20.10 -U webapp -d appdb -c "SELECT 1;"
```

**Résultat attendu** :

```text
 ?column?
----------
        1
(1 row)
```

```bash
# Depuis web-server : verifier que le reseau management N'est PAS accessible
ping -c 2 10.10.30.10
```

**Résultat attendu** :

```text
PING 10.10.30.10 (10.10.30.10) 56(84) bytes of data.
--- 10.10.30.10 ping statistics ---
2 packets transmitted, 0 received, 100% packet loss
```

Le ping échoue car les règles de firewall n'autorisent pas le trafic du VLAN web vers le VLAN management.

---

### Étape 7 : Creer des snapshots de l'infrastructure

```bash
# Prendre un snapshot de chaque VM avant d'aller plus loin

# Proxmox
qm snapshot 300 infra-base --description "Infrastructure de base configuree"
qm snapshot 301 infra-base --description "PostgreSQL installe et configure"
qm snapshot 302 infra-base --description "VM monitoring prete"

# Avec virsh
virsh snapshot-create-as web-server --name "infra-base" --description "Nginx installe"
virsh snapshot-create-as db-server --name "infra-base" --description "PostgreSQL configure"
virsh snapshot-create-as monitoring --name "infra-base" --description "VM monitoring prete"

# Verifier les snapshots
qm listsnapshot 300
qm listsnapshot 301
qm listsnapshot 302
```

**Résultat attendu** :

```text
# qm listsnapshot 300
`-- infra-base   Infrastructure de base configuree   2025-01-15T16:00:00Z
 `-- current     You are here!
```

---

### Étape 8 : Configurer le stockage de sauvegardes

```bash
# Sur l'hote : creer un partage NFS pour les sauvegardes
apt install -y nfs-kernel-server
mkdir -p /srv/nfs/backups
chown nobody:nogroup /srv/nfs/backups

echo "/srv/nfs/backups 10.10.0.0/16(rw,sync,no_subtree_check,no_root_squash)" >> /etc/exports
exportfs -rav
systemctl enable --now nfs-kernel-server

# Ajouter le stockage dans Proxmox
pvesm add nfs backup-nfs \
  --server 10.10.30.1 \
  --export /srv/nfs/backups \
  --content backup

# Sauvegarder les VMs
vzdump 300 --storage backup-nfs --mode snapshot --compress zstd
vzdump 301 --storage backup-nfs --mode snapshot --compress zstd
vzdump 302 --storage backup-nfs --mode snapshot --compress zstd

# Verifier les sauvegardes
ls -lh /srv/nfs/backups/dump/
```

**Résultat attendu** :

```text
-rw-r--r-- 1 root root 1.2G vzdump-qemu-300-2025_01_15-16_30_00.vma.zst
-rw-r--r-- 1 root root 2.1G vzdump-qemu-301-2025_01_15-16_35_00.vma.zst
-rw-r--r-- 1 root root 1.0G vzdump-qemu-302-2025_01_15-16_40_00.vma.zst
```

---

### Étape 9 : Documenter l'infrastructure

Créé un fichier de documentation pour ton infrastructure :

```bash
cat > /root/infra-doc.md << 'EOF'
# Documentation infrastructure virtualisee

## VMs

| ID  | Nom         | Role        | VLAN | IP           | RAM  | CPU  | Disque |
| --- | ----------- | ----------- | ---- | ------------ | ---- | ---- | ------ |
| 300 | web-server  | Nginx       | 10   | 10.10.10.10  | 1 Go | 1    | 10 Go  |
| 301 | db-server   | PostgreSQL  | 20   | 10.10.20.10  | 2 Go | 2    | 20 Go  |
| 302 | monitoring  | Prometheus  | 30   | 10.10.30.10  | 1 Go | 1    | 15 Go  |

## Reseaux

| VLAN | Nom        | Sous-reseau     | Passerelle  | Role       |
| ---- | ---------- | --------------- | ----------- | ---------- |
| 10   | DMZ        | 10.10.10.0/24   | 10.10.10.1  | Web public |
| 20   | Backend    | 10.10.20.0/24   | 10.10.20.1  | BDD        |
| 30   | Management | 10.10.30.0/24   | 10.10.30.1  | Monitoring |

## Regles de firewall

| Source       | Destination  | Port(s)    | Protocole |
| ------------ | ------------ | ---------- | --------- |
| Internet     | web-server   | 80, 443    | TCP       |
| web-server   | db-server    | 5432       | TCP       |
| monitoring   | web-server   | 9100       | TCP       |
| monitoring   | db-server    | 9100, 9187 | TCP       |

## Sauvegardes

- Stockage : NFS sur /srv/nfs/backups
- Frequence prevue : quotidienne
- Retention prevue : 7 jours
EOF
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `qm list` | Lister les VMs Proxmox |
| `qm snapshot <id> <nom>` | Creer un snapshot |
| `vzdump <id> --storage <s>` | Sauvegarder une VM |
| `pvesm status` | État des stockages |
| `iptables -L -n -v` | Voir les règles de firewall |
| `iptables -t nat -L -n -v` | Voir les règles NAT |
| `virsh net-list --all` | Lister les réseaux (libvirt) |
| `ss -tlnp` | Verifier les ports en écoute |
| `ping -c 2 <ip>` | Tester la connectivite |

---

## Pièges Frequents

### Piège 1 : Oublier les règles de retour (stateful)

**Problème** : Tu autorises le trafic du web-server vers le db-server (port 5432), mais la réponse de PostgreSQL ne peut pas revenir car il n'y a pas de règle dans l'autre sens.

**Solution** : Utilise le suivi de connexion (conntrack) pour autoriser automatiquement les réponses :

```bash
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
```

Cette règle doit être placee en premier dans la chaîne FORWARD. Elle autorise toutes les réponses aux connexions déjà etablies.

### Piège 2 : La VM monitoring ne peut pas atteindre les autres VLANs

**Problème** : La VM monitoring a trois interfaces réseau mais ne peut pas communiquer avec les VMs des autres VLANs.

**Solution** : Verifie que :

1. Les trois interfaces sont configurées avec les bonnes IPs dans la VM monitoring
2. Les règles de firewall autorisent le trafic de monitoring vers les VMs cibles
3. Les routes sont correctes dans la VM monitoring

```bash
# Dans la VM monitoring : verifier les interfaces
ip addr show

# Verifier les routes
ip route show
```

### Piège 3 : Ne pas sauvegarder les règles iptables

**Problème** : Tu as configure toutes les règles de firewall. Le serveur redemarre et toutes les règles ont disparu. iptables ne sauvegarde pas les règles automatiquement.

**Solution** : Installe `iptables-persistent` pour sauvegarder et restaurer les règles au démarrage :

```bash
apt install -y iptables-persistent

# Les regles sont sauvegardees lors de l'installation
# Pour resauvegarder apres une modification :
iptables-save > /etc/iptables/rules.v4
```

### Piège 4 : Dimensionner trop petit

**Problème** : Tu alloues le strict minimum de RAM aux VMs. PostgreSQL manque de mémoire et commence a utiliser le swap, ce qui ralentit les requêtes.

**Solution** : Verifie la consommation réelle avant de dimensionner :

- Nginx : 512 Mo minimum, 1 Go recommande
- PostgreSQL : 1 Go minimum, 2 Go recommande (shared_buffers = 25% de la RAM)
- Prometheus + Grafana : 1 Go minimum

Laisse toujours 20% de marge pour les pics de charge.

---

## Checklist de Validation

- [ ] J'ai créé trois réseaux VLAN isoles (DMZ, Backend, Management)
- [ ] J'ai créé trois VMs, chacune sur son propre VLAN
- [ ] Nginx est installe et accessible sur le web-server
- [ ] PostgreSQL est installe et accessible depuis le web-server (et uniquement depuis le web-server)
- [ ] Les règles de firewall bloquent le trafic non autorise entre les VLANs
- [ ] J'ai créé un snapshot de chaque VM
- [ ] J'ai configure un stockage NFS pour les sauvegardes
- [ ] J'ai sauvegarde les trois VMs
- [ ] J'ai documente l'infrastructure (VMs, réseaux, règles)

---

## Exercice Pratique

**Enonce** : Etends l'infrastructure en ajoutant les éléments suivants :

1. Un conteneur LXC (ID 310) nomme `reverse-proxy` sur le VLAN 10 (IP `10.10.10.5`) avec Nginx configure comme reverse proxy vers le web-server (`10.10.10.10`)
2. Une règle de firewall qui redirige le port 443 de l'hôte vers le reverse proxy au lieu du web-server
3. Un snapshot de chaque VM et conteneur nomme `phase-2`
4. Mets a jour le fichier de documentation `infra-doc.md` avec les nouvelles informations

**Indications** :

- Utilise `pct create` pour le conteneur LXC
- Configure Nginx dans le conteneur comme reverse proxy avec `proxy_pass`
- Modifie les règles iptables pour rediriger le port 443 vers `10.10.10.5`
- Créé les snapshots avec `qm snapshot` et `pct snapshot`

**Résultat attendu** :

- Le conteneur `reverse-proxy` est accessible sur `10.10.10.5`
- Le port 443 de l'hôte redirige vers le reverse proxy
- Le reverse proxy transmet les requêtes au web-server
- Quatre snapshots `phase-2` existent (3 VMs + 1 conteneur)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Creer le conteneur reverse proxy** :

```bash
# Sur Proxmox : le suffixe du template change. Liste d'abord :
# pveam update && pveam available --section system | grep debian-12-standard
pct create 310 local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst \
  --hostname reverse-proxy \
  --password "MotDePasseSecure123" \
  --storage local-lvm \
  --rootfs 4 \
  --cores 1 \
  --memory 256 \
  --swap 256 \
  --net0 name=eth0,bridge=vmbr10,ip=10.10.10.5/24,gw=10.10.10.1 \
  --onboot 1

pct start 310
```

**Installer et configurer Nginx comme reverse proxy** :

```bash
# Entrer dans le conteneur
pct enter 310

# Installer Nginx
apt update && apt install -y nginx

# Configurer le reverse proxy
cat > /etc/nginx/sites-available/reverse-proxy << 'EOF'
server {
    listen 80;
    listen 443 ssl;
    server_name _;

    # Certificats auto-signes pour le test
    # En production, utilise Let's Encrypt ou un certificat valide
    ssl_certificate /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

    location / {
        proxy_pass http://10.10.10.10;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Creer un certificat auto-signe pour le test
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out /etc/nginx/ssl/selfsigned.crt \
  -subj "/CN=reverse-proxy"

# Activer la configuration
ln -sf /etc/nginx/sites-available/reverse-proxy /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et recharger Nginx
nginx -t && systemctl reload nginx

# Sortir du conteneur
exit
```

**Modifier les règles de firewall** :

```bash
# Supprimer l'ancienne regle de redirection vers web-server (port 443)
iptables -t nat -D PREROUTING -p tcp --dport 443 -j DNAT --to-destination 10.10.10.10

# Ajouter la nouvelle regle vers le reverse proxy
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 10.10.10.5
iptables -A FORWARD -p tcp -d 10.10.10.5 --dport 443 -j ACCEPT

# Sauvegarder les regles
iptables-save > /etc/iptables/rules.v4
```

**Creer les snapshots** :

```bash
# Snapshot phase-2 pour chaque VM et conteneur
qm snapshot 300 phase-2 --description "Ajout du reverse proxy"
qm snapshot 301 phase-2 --description "Ajout du reverse proxy"
qm snapshot 302 phase-2 --description "Ajout du reverse proxy"
pct snapshot 310 phase-2 --description "Reverse proxy configure"
```

**Mettre a jour la documentation** :

Ajoute les informations suivantes au fichier `infra-doc.md` :

```text
## Phase 2 - Reverse Proxy

| ID  | Nom            | Type | Role           | VLAN | IP          | RAM    |
| --- | -------------- | ---- | -------------- | ---- | ----------- | ------ |
| 310 | reverse-proxy  | LXC  | Nginx RP       | 10   | 10.10.10.5  | 256 Mo |

Regles ajoutees :
- Port 443 de l'hote -> reverse-proxy (10.10.10.5:443)
- reverse-proxy -> web-server (10.10.10.10:80) via proxy_pass
```

**Vérification** :

```bash
# Tester l'acces via le reverse proxy
curl -k https://<ip-hote>/
```

```text
<h1>Serveur Web - VLAN 10 (DMZ)</h1>
```

La requête HTTPS arrive sur le reverse proxy (`10.10.10.5`), qui la transmet au web-server (`10.10.10.10`). La page s'affiche correctement.

---

## Navigation

← Fiche précédente : **[05 - Réseau virtualise](05-reseau-virtualise.md)**
