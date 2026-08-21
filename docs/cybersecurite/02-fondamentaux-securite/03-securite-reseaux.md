---
tags:
  - Cybersécurité
  - Intermédiaire
  - Pratique
description: "Firewalls, IDS/IPS, VPN, segmentation réseau, analyse de trafic et durcissement SSH"
estimated_time: "55 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 2 - Fondamentaux sécurité"
id: "security.cybersecurity.fundamentals-security.securite-reseaux"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.fundamentals-security"
content_type: "lesson"
order: 3
---

# 03 - Sécurité des réseaux - Fondamentaux

> **En bref** : À la fin de cette fiche, tu sauras configurer un firewall avec iptables/nftables, comprendre le fonctionnement des systèmes IDS/IPS, mettre en place un VPN avec WireGuard, segmenter un réseau avec des DMZ et des VLAN, et durcir une configuration SSH. Lecture estimée : 55 min.


## Prérequis

- [Phase 2, Fiche 01 - Principes de sécurité de l'information](01-principes-securite.md) (défense en profondeur, surface d'attaque)
- [Phase 2, Fiche 02 - Cryptographie](02-cryptographie.md) (TLS, chiffrement symétrique/asymétrique, PKI)
- [Phase 1, Fiche 03 - Réseaux et protocoles](../01-fondamentaux-informatiques/03-reseaux-protocoles.md) (modèle OSI, TCP/IP, routage)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer un firewall avec iptables/nftables, comprendre le fonctionnement des systèmes IDS/IPS, mettre en place un VPN avec WireGuard, segmenter un réseau avec des DMZ et des VLAN, et durcir une configuration SSH.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un firewall ?

**Définition** : Un firewall (pare-feu) est un dispositif réseau (matériel ou logiciel) qui contrôle le trafic entrant et sortant selon des règles de filtrage prédéfinies. Il autorise ou bloque les paquets en fonction de critères comme l'adresse IP source/destination, le port, le protocole.

**Le problème que les firewalls résolvent** :

Sans firewall, voici les problèmes rencontrés :

1. **Accès non contrôlé** : n'importe quel appareil sur Internet peut tenter de se connecter à n'importe quel port de ton serveur
2. **Services exposés** : des services internes (base de données, admin panel) sont accessibles depuis l'extérieur
3. **Propagation d'attaques** : un malware sur un poste peut communiquer librement avec un serveur de commande et contrôle (C2)

**Comment les firewalls résolvent ces problèmes** :

| Problème | Solution apportée par le firewall |
| -------- | --------------------------------- |
| Accès non contrôlé | Règles explicites : seuls les ports/protocoles autorisés passent |
| Services exposés | Politique par défaut : tout est bloqué sauf ce qui est explicitement autorisé |
| Propagation d'attaques | Filtrage du trafic sortant : seules les connexions légitimes sortent |

**Analogie concrète** : Un firewall est comme un videur à l'entrée d'un immeuble. Il a une liste de personnes autorisées (règles). Si tu es sur la liste, tu entres. Sinon, tu es refoulé. Il peut aussi contrôler qui sort (filtrage sortant).

**Ce qu'un firewall n'est PAS** :

- Un firewall n'est pas un antivirus. Il ne regarde pas le contenu des paquets (sauf les firewalls de nouvelle génération). Un fichier malveillant passant par un port autorisé (80, 443) traverse le firewall
- Un firewall n'est pas un IDS/IPS. Il ne détecte pas les attaques dans le trafic autorisé

#### iptables

**Définition** : iptables est l'outil historique de filtrage de paquets sous Linux. Il utilise des chaînes de règles organisées en tables pour décider du sort de chaque paquet.

**Les trois chaînes principales** :

| Chaîne | Rôle |
| ------ | ---- |
| **INPUT** | Trafic entrant destiné à la machine locale |
| **OUTPUT** | Trafic sortant généré par la machine locale |
| **FORWARD** | Trafic transitant par la machine (routeur/passerelle) |

**Les quatre actions possibles** :

| Action | Effet |
| ------ | ----- |
| **ACCEPT** | Le paquet est autorisé |
| **DROP** | Le paquet est silencieusement supprimé |
| **REJECT** | Le paquet est refusé avec un message d'erreur |
| **LOG** | Le paquet est journalisé puis passe à la règle suivante |

#### nftables

**Définition** : nftables est le successeur d'iptables, intégré au noyau Linux depuis la version 3.13 (2014). Il offre une syntaxe unifiée, de meilleures performances et une configuration plus lisible.

**Comparaison iptables vs nftables** :

| iptables | nftables |
| -------- | -------- |
| Commandes séparées (iptables, ip6tables, arptables) | Commande unique (nft) |
| Syntaxe complexe avec de nombreuses options | Syntaxe plus claire et cohérente |
| Tables et chaînes prédéfinies | Tables et chaînes personnalisables |
| Performances limitées pour les grands jeux de règles | Performances optimisées (jeux de données natifs) |

#### pfSense

**Définition** : pfSense est une distribution FreeBSD spécialisée qui transforme un ordinateur en firewall/routeur complet avec une interface web de gestion. C'est une solution open source très utilisée en entreprise.

**Fonctionnalités principales** :

- Firewall avec état (stateful)
- NAT / redirection de ports
- VPN (OpenVPN, IPsec, WireGuard)
- IDS/IPS (avec Suricata)
- DHCP / DNS
- Proxy et cache

### Qu'est-ce qu'un IDS/IPS ?

**Définition** : Un IDS (Intrusion Détection System) surveille le trafic réseau et alerte en cas d'activité suspecte. Un IPS (Intrusion Prevention System) fait la même chose mais peut en plus bloquer le trafic malveillant automatiquement.

**Le problème que les IDS/IPS résolvent** :

Sans IDS/IPS, voici les problèmes rencontrés :

1. **Attaques invisibles** : un firewall autorise le trafic HTTP, mais ne détecte pas une injection SQL dans une requête HTTP
2. **Détection tardive** : sans surveillance, on découvre une attaque des jours ou des semaines après
3. **Réponse manuelle** : même si on détecte l'attaque, il faut intervenir manuellement pour la bloquer

**Comment les IDS/IPS résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Attaques invisibles | Analyse du contenu des paquets (deep packet inspection) |
| Détection tardive | Alertes en temps réel |
| Réponse manuelle | L'IPS bloque automatiquement le trafic malveillant |

**Analogie concrète** : Si le firewall est le videur à l'entrée, l'IDS est la caméra de surveillance dans le bâtiment. Elle observe tout ce qui se passe à l'intérieur et alerte le gardien si quelque chose est suspect. L'IPS, c'est un gardien avec le pouvoir d'intervenir et d'expulser les intrus.

**Comparaison IDS vs IPS** :

| IDS | IPS |
| --- | --- |
| Détecte et alerte | Détecte, alerte et bloque |
| Passif (copie du trafic) | Actif (en ligne avec le trafic) |
| Pas de risque de blocage légitime | Risque de faux positifs bloquants |
| Adapté à la surveillance | Adapté à la protection active |

#### Snort

**Définition** : Snort est le système IDS/IPS open source le plus connu, créé en 1998. Il analyse le trafic réseau en temps réel et compare les paquets à une base de signatures de menaces connues.

**Modes de fonctionnement** :

| Mode | Description |
| ---- | ----------- |
| Sniffer | Affiche les paquets en temps réel (comme tcpdump) |
| Packet Logger | Enregistre les paquets sur disque pour analyse ultérieure |
| IDS | Analyse le trafic et génère des alertes selon les règles |
| IPS (inline) | Bloque le trafic malveillant en temps réel |

#### Suricata

**Définition** : Suricata est un IDS/IPS/NSM (Network Security Monitoring) open source, développé par l'OISF. Il est multithreadé (plus performant que Snort sur les gros volumes de trafic) et compatible avec les règles Snort.

**Avantages par rapport à Snort 2** (Snort 3, documenté par Cisco, est multithreadé : un thread de contrôle et plusieurs threads de détection) :

| Caractéristique | Snort 2 | Snort 3 | Suricata |
| --------------- | ------- | ------- | -------- |
| Threading | Un thread de paquets par processus | Plusieurs threads de paquets par processus | Multi-thread |
| Protocoles | HTTP, DNS, FTP | Étendus via plugins | HTTP, DNS, FTP, TLS, SMB, SSH, MQTT... |
| Extraction de fichiers | Limitée | Améliorée | Native |
| Logs JSON | Non natif | Possible via plugins | Natif (EVE JSON) |

### Qu'est-ce qu'un VPN ?

**Définition** : Un VPN (Virtual Private Network) crée un tunnel chiffré entre deux points à travers un réseau non sécurisé (Internet). Tout le trafic passant par le tunnel est chiffré et protégé.

**Le problème que les VPN résolvent** :

Sans VPN, voici les problèmes rencontrés :

1. **Trafic interceptable** : sur un réseau public (Wi-Fi d'hôtel), le trafic peut être capturé
2. **Accès distant non sécurisé** : un employé en télétravail accède au réseau interne sans protection
3. **Communication inter-sites exposée** : deux bureaux d'une entreprise communiquent via Internet en clair

**Comment les VPN résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Trafic interceptable | Le tunnel VPN chiffre tout le trafic |
| Accès distant | Le VPN crée une extension sécurisée du réseau interne |
| Communication inter-sites | Le VPN site-to-site relie les deux réseaux de manière transparente |

**Analogie concrète** : Un VPN, c'est comme un tube opaque et verrouillé entre deux bâtiments. Même si le tube passe dans la rue (Internet), personne ne peut voir ou toucher ce qui circule à l'intérieur.

#### OpenVPN

**Définition** : OpenVPN est un logiciel VPN open source qui utilise TLS/SSL pour le tunnel chiffré. Il fonctionne en espace utilisateur (pas besoin de module noyau).

**Caractéristiques** :

| Aspect | Détail |
| ------ | ------ |
| Protocole | TLS/SSL (port TCP 443 ou UDP 1194) |
| Chiffrement | AES-256-GCM |
| Authentification | Certificats X.509, username/password, MFA |
| Plateformes | Linux, Windows, macOS, Android, iOS |

#### WireGuard

**Définition** : WireGuard est un protocole VPN moderne, intégré au noyau Linux depuis la version 5.6 (2020). Il est plus simple, plus rapide et plus sécurisé qu'OpenVPN et IPsec.

**Comparaison avec OpenVPN** :

| WireGuard | OpenVPN |
| --------- | ------- |
| ~4000 lignes de code | ~100 000 lignes de code |
| Intégré au noyau Linux | Espace utilisateur |
| Chiffrement moderne (ChaCha20, Curve25519) | Chiffrement configurable (peut être mal configuré) |
| Configuration minimale | Configuration complexe |
| UDP uniquement | TCP ou UDP |

#### IPsec

**Définition** : IPsec (Internet Protocol Security) est un ensemble de protocoles qui sécurise les communications au niveau de la couche réseau (couche 3). Il est souvent utilisé pour les VPN site-to-site dans les grandes entreprises.

**Deux modes de fonctionnement** :

| Mode | Usage |
| ---- | ----- |
| **Transport** | Chiffre uniquement les données (payload), pas l'en-tête IP. Utilisé pour la communication de bout en bout |
| **Tunnel** | Chiffre le paquet IP complet et l'encapsule dans un nouveau paquet. Utilisé pour les VPN site-to-site |

### Qu'est-ce que la segmentation réseau ?

**Définition** : La segmentation réseau consiste à diviser un réseau en sous-réseaux isolés, chacun avec ses propres règles d'accès. Le trafic entre les segments est contrôlé par des firewalls ou des routeurs.

**Le problème que la segmentation résout** :

Sans segmentation, voici les problèmes rencontrés :

1. **Mouvement latéral** : un attaquant qui compromet un poste de travail accède directement aux serveurs
2. **Explosion du périmètre** : tous les appareils sont dans le même réseau, la surface d'attaque est maximale
3. **Difficulté de contrôle** : impossible d'appliquer des politiques différentes à des populations différentes

**Comment la segmentation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Mouvement latéral | Les segments sont isolés : passer d'un segment à l'autre nécessite de traverser un firewall |
| Explosion du périmètre | Chaque segment a sa propre surface d'attaque, plus petite |
| Difficulté de contrôle | Règles spécifiques par segment (ex : les imprimantes n'accèdent pas aux serveurs) |

**Analogie concrète** : Dans un hôpital, chaque service (urgences, maternité, bloc opératoire) est séparé par des portes contrôlées. Un visiteur en salle d'attente ne peut pas entrer directement au bloc opératoire. La segmentation réseau applique le même principe.

#### DMZ (Zone Démilitarisée)

**Définition** : Une DMZ est un sous-réseau isolé qui héberge les services accessibles depuis Internet (serveur web, email, DNS public). Elle est séparée du réseau interne par un firewall.

**Architecture typique** :

```text
Internet
    |
[Firewall externe]
    |
   DMZ  (serveur web, serveur mail)
    |
[Firewall interne]
    |
Réseau interne  (postes de travail, base de données)
```

**Règle clé** : Le trafic Internet ne touche jamais directement le réseau interne. Même si un serveur en DMZ est compromis, l'attaquant est bloqué par le firewall interne.

#### Micro-segmentation

**Définition** : La micro-segmentation pousse la segmentation au niveau de chaque machine ou application individuelle. Chaque workload (VM, conteneur, application) a ses propres règles de communication.

**Cas d'usage** : Dans un environnement cloud ou Kubernetes, deux conteneurs sur le même serveur physique ne peuvent communiquer que si une politique réseau l'autorise explicitement.

### Proxy, Reverse Proxy et WAF

#### Proxy (forward proxy)

**Définition** : Un proxy est un intermédiaire entre les clients internes et Internet. Toutes les requêtes sortantes passent par le proxy, qui peut filtrer, journaliser et mettre en cache le trafic.

#### Reverse proxy

**Définition** : Un reverse proxy est un intermédiaire entre Internet et les serveurs internes. Les requêtes entrantes arrivent sur le reverse proxy, qui les distribue aux serveurs backend appropriés.

**Comparaison** :

| Forward proxy | Reverse proxy |
| ------------- | ------------- |
| Protège les clients (navigation sortante) | Protège les serveurs (trafic entrant) |
| Le client connaît le proxy | Le client ne sait pas que le proxy existe |
| Filtrage web, contrôle parental | Load balancing, terminaison TLS, cache |

#### WAF (Web Application Firewall)

**Définition** : Un WAF est un firewall spécialisé qui analyse le trafic HTTP/HTTPS pour détecter et bloquer les attaques applicatives (injection SQL, XSS, CSRF).

**ModSecurity** est le WAF open source le plus utilisé. Il peut être déployé avec Apache, Nginx ou comme module Suricata.

**Différence entre firewall classique et WAF** :

| Firewall classique | WAF |
| ------------------ | --- |
| Filtre au niveau réseau (IP, port, protocole) | Filtre au niveau applicatif (HTTP, contenu) |
| Ne regarde pas le contenu des requêtes | Analyse les paramètres, les en-têtes, le corps |
| Bloque les connexions non autorisées | Bloque les injections SQL, XSS, etc. |

### SSH Hardening

**Définition** : Le durcissement SSH (SSH hardening) consiste à configurer le service SSH de manière à réduire sa surface d'attaque et à renforcer l'authentification.

**Les risques d'un SSH mal configuré** :

- Attaque par brute-force sur les mots de passe
- Connexion root directe
- Utilisation d'algorithmes de chiffrement obsolètes
- Exposition du service sur un port prévisible

### TLS Mutual Authentication (mTLS)

**Définition** : Dans une connexion TLS classique, seul le serveur présente un certificat. En mTLS (mutual TLS), le client présente aussi un certificat, ce qui permet au serveur de vérifier l'identité du client.

**Cas d'usage** :

- Communication entre microservices (service mesh)
- API entre partenaires B2B
- VPN basé sur des certificats

---

## Étapes Pratiques

### Étape 1 : Configurer un firewall avec iptables

```bash
# Afficher les règles actuelles
sudo iptables -L -n -v

# Politique par défaut : tout bloquer en entrée, tout autoriser en sortie
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Autoriser le trafic loopback (communication interne de la machine)
sudo iptables -A INPUT -i lo -j ACCEPT

# Autoriser les connexions déjà établies (réponses aux requêtes sortantes)
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Autoriser SSH (port 22) uniquement depuis un réseau spécifique
sudo iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# Autoriser HTTP et HTTPS depuis partout
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Journaliser les paquets rejetés (pour le debug)
sudo iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 4

# Afficher les règles mises en place
sudo iptables -L -n -v
```

**Résultat attendu** :

```text
Chain INPUT (policy DROP)
num  target     prot opt source               destination
1    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           /* loopback */
2    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           ctstate RELATED,ESTABLISHED
3    ACCEPT     tcp  --  192.168.1.0/24       0.0.0.0/0           tcp dpt:22
4    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:80
5    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:443
6    LOG        all  --  0.0.0.0/0            0.0.0.0/0           LOG flags 0 level 4 prefix "IPTABLES-DROP: "
```

### Étape 2 : Configurer un firewall avec nftables

```bash
# Créer un fichier de configuration nftables
cat << 'EOF' > /tmp/firewall.nft
#!/usr/sbin/nft -f

# Vider les règles existantes
flush ruleset

# Créer la table et les chaînes
table inet mon_firewall {
    chain input {
        type filter hook input priority 0; policy drop;

        # Autoriser le loopback
        iif "lo" accept

        # Autoriser les connexions établies
        ct state established,related accept

        # Autoriser ICMP (ping)
        ip protocol icmp accept
        ip6 nexthdr icmpv6 accept

        # Autoriser SSH depuis le réseau local
        tcp dport 22 ip saddr 192.168.1.0/24 accept

        # Autoriser HTTP et HTTPS
        tcp dport { 80, 443 } accept

        # Journaliser et rejeter le reste
        log prefix "NFT-DROP: " counter drop
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
EOF

# Appliquer la configuration (en test)
echo "Pour appliquer : sudo nft -f /tmp/firewall.nft"
echo "Pour vérifier  : sudo nft list ruleset"
```

**Résultat attendu** :

```text
Pour appliquer : sudo nft -f /tmp/firewall.nft
Pour vérifier  : sudo nft list ruleset
```

### Étape 3 : Configurer WireGuard (serveur)

```bash
# Installer WireGuard (Debian/Ubuntu)
# sudo apt install wireguard

# Générer les clés du serveur
wg genkey | tee /tmp/wg-server-private.key | wg pubkey > /tmp/wg-server-public.key

# Générer les clés du client
wg genkey | tee /tmp/wg-client-private.key | wg pubkey > /tmp/wg-client-public.key

# Créer la configuration du serveur
cat << EOF > /tmp/wg0-server.conf
[Interface]
# Adresse IP du serveur dans le tunnel VPN
Address = 10.0.0.1/24
# Port d'écoute UDP
ListenPort = 51820
# Clé privée du serveur
PrivateKey = $(cat /tmp/wg-server-private.key)

# Règles firewall pour le forwarding (NAT)
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Clé publique du client
PublicKey = $(cat /tmp/wg-client-public.key)
# Adresse IP autorisée pour ce client
AllowedIPs = 10.0.0.2/32
EOF

# Créer la configuration du client
cat << EOF > /tmp/wg0-client.conf
[Interface]
# Adresse IP du client dans le tunnel VPN
Address = 10.0.0.2/24
# Clé privée du client
PrivateKey = $(cat /tmp/wg-client-private.key)
# Serveur DNS à utiliser dans le tunnel
DNS = 1.1.1.1

[Peer]
# Clé publique du serveur
PublicKey = $(cat /tmp/wg-server-public.key)
# Adresse publique du serveur
Endpoint = serveur.example.com:51820
# Tout le trafic passe par le VPN
AllowedIPs = 0.0.0.0/0
# Maintenir la connexion active (NAT traversal)
PersistentKeepalive = 25
EOF

echo "Configuration serveur : /tmp/wg0-server.conf"
echo "Configuration client  : /tmp/wg0-client.conf"
echo ""
echo "Pour activer : sudo wg-quick up wg0"
echo "Pour vérifier : sudo wg show"
```

**Résultat attendu** :

```text
Configuration serveur : /tmp/wg0-server.conf
Configuration client  : /tmp/wg0-client.conf

Pour activer : sudo wg-quick up wg0
Pour vérifier : sudo wg show
```

### Étape 4 : Durcir la configuration SSH

```bash
# Afficher la configuration SSH recommandée
cat << 'EOF' > /tmp/sshd_config_hardened
# === Configuration SSH durcie ===

# Écouter uniquement sur le port 2222 (changer le port par défaut)
Port 2222

# Écouter uniquement sur la boucle locale (127.0.0.1).
# 0.0.0.0 n'est PAS une adresse locale : c'est toutes les interfaces IPv4.
ListenAddress 127.0.0.1

# Protocole SSH version 2 uniquement
Protocol 2

# Désactiver la connexion root
PermitRootLogin no

# Authentification par clé uniquement (désactiver les mots de passe)
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no

# Désactiver les méthodes d'authentification non utilisées
ChallengeResponseAuthentication no
KerberosAuthentication no
GSSAPIAuthentication no

# Limiter les utilisateurs autorisés
AllowUsers deploy admin

# Limiter le nombre de tentatives de connexion
MaxAuthTries 3

# Limiter le nombre de sessions simultanées
MaxSessions 3

# Timeout de connexion (déconnexion après inactivité)
ClientAliveInterval 300
ClientAliveCountMax 2

# Désactiver le forwarding X11 (interface graphique)
X11Forwarding no

# Désactiver le forwarding TCP (sauf si nécessaire)
AllowTcpForwarding no

# Algorithmes de chiffrement modernes uniquement
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org

# Bannière de connexion
Banner /etc/ssh/banner.txt

# Journalisation détaillée
LogLevel VERBOSE
EOF

echo "Configuration SSH durcie générée : /tmp/sshd_config_hardened"
echo ""
echo "Pour appliquer :"
echo "  1. sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup"
echo "  2. sudo cp /tmp/sshd_config_hardened /etc/ssh/sshd_config"
echo "  3. sudo sshd -t  (tester la configuration)"
echo "  4. sudo systemctl restart sshd"
```

**Résultat attendu** :

```text
Configuration SSH durcie générée : /tmp/sshd_config_hardened

Pour appliquer :
  1. sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
  2. sudo cp /tmp/sshd_config_hardened /etc/ssh/sshd_config
  3. sudo sshd -t  (tester la configuration)
  4. sudo systemctl restart sshd
```

### Étape 5 : Écrire des règles Suricata

```bash
# Créer un fichier de règles Suricata personnalisées
cat << 'EOF' > /tmp/local.rules
# Règle 1 : Détecter un scan de ports (SYN scan avec nmap)
alert tcp any any -> $HOME_NET any (msg:"SCAN nmap SYN scan détecté"; \
  flags:S; threshold:type threshold, track by_src, count 20, seconds 5; \
  classtype:attempted-recon; sid:1000001; rev:1;)

# Règle 2 : Détecter une tentative d'injection SQL dans une URL
alert http any any -> $HOME_NET any (msg:"WEB injection SQL dans URL"; \
  http.uri; content:"UNION"; nocase; content:"SELECT"; nocase; \
  classtype:web-application-attack; sid:1000002; rev:1;)

# Règle 3 : Détecter un téléchargement d'exécutable Windows
alert http $HOME_NET any -> any any (msg:"FILE téléchargement exécutable PE"; \
  flow:established,to_client; \
  content:"MZ"; offset:0; depth:2; \
  classtype:policy-violation; sid:1000003; rev:1;)

# Règle 4 : Détecter une connexion SSH depuis une adresse externe
alert tcp !$HOME_NET any -> $HOME_NET 22 (msg:"POLICY connexion SSH externe"; \
  flow:to_server; flags:S; \
  classtype:policy-violation; sid:1000004; rev:1;)

# Règle 5 : Détecter une communication DNS vers un domaine suspect
alert dns any any -> any any (msg:"DNS requête vers domaine suspect"; \
  dns.query; content:".evil.com"; nocase; endswith; \
  classtype:bad-unknown; sid:1000005; rev:1;)
EOF

echo "Règles Suricata créées : /tmp/local.rules"
echo ""
echo "Pour tester les règles :"
echo "  suricata -T -c /etc/suricata/suricata.yaml -S /tmp/local.rules"
```

**Résultat attendu** :

```text
Règles Suricata créées : /tmp/local.rules

Pour tester les règles :
  suricata -T -c /etc/suricata/suricata.yaml -S /tmp/local.rules
```

### Étape 6 : Analyser le trafic réseau avec tcpdump

```bash
# Capturer le trafic sur l'interface eth0 (10 paquets)
# sudo tcpdump -i eth0 -c 10 -nn

# Capturer uniquement le trafic HTTP
# sudo tcpdump -i eth0 -c 10 -nn port 80

# Capturer le trafic DNS
# sudo tcpdump -i eth0 -c 10 -nn port 53

# Capturer et sauvegarder dans un fichier pcap pour analyse dans Wireshark
# sudo tcpdump -i eth0 -c 100 -w /tmp/capture.pcap

# Créer un script d'analyse de trafic
cat << 'PYEOF' > /tmp/analyse-trafic.py
#!/usr/bin/env python3
"""Script d'analyse de trafic réseau simplifié.

Ce script analyse un fichier de log et identifie les patterns suspects.
En conditions réelles, on utiliserait scapy ou pyshark pour analyser les pcap.
"""

# Exemples de logs réseau simulés
logs = [
    "192.168.1.10 -> 10.0.0.5:22 SYN",
    "192.168.1.10 -> 10.0.0.5:80 SYN",
    "192.168.1.10 -> 10.0.0.5:443 SYN",
    "192.168.1.10 -> 10.0.0.5:3306 SYN",
    "192.168.1.10 -> 10.0.0.5:5432 SYN",
    "192.168.1.10 -> 10.0.0.5:8080 SYN",
    "192.168.1.10 -> 10.0.0.5:8443 SYN",
    "10.0.0.5:80 -> 192.168.1.10 SYN-ACK",
    "10.0.0.5:443 -> 192.168.1.10 SYN-ACK",
    "192.168.1.20 -> 10.0.0.5:80 GET /login?user=admin' OR '1'='1",
    "192.168.1.30 -> 10.0.0.5:80 GET /index.html",
]

# Analyse
print("=== Analyse de trafic réseau ===\n")

# Détecter les scans de ports (beaucoup de SYN depuis la même source)
syn_sources = {}
for log in logs:
    if "SYN" in log and "SYN-ACK" not in log:
        source = log.split(" -> ")[0]
        syn_sources[source] = syn_sources.get(source, 0) + 1

for source, count in syn_sources.items():
    if count > 5:
        print(f"[ALERTE] Scan de ports détecté depuis {source} ({count} SYN)")

# Détecter les tentatives d'injection SQL
for log in logs:
    patterns_sql = ["OR '1'='1", "UNION SELECT", "DROP TABLE", "--"]
    for pattern in patterns_sql:
        if pattern in log:
            print(f"[ALERTE] Injection SQL détectée : {log}")
            break

print("\n=== Fin de l'analyse ===")
PYEOF
python3 /tmp/analyse-trafic.py
```

**Résultat attendu** :

```text
=== Analyse de trafic réseau ===

[ALERTE] Scan de ports détecté depuis 192.168.1.10 (7 SYN)
[ALERTE] Injection SQL détectée : 192.168.1.20 -> 10.0.0.5:80 GET /login?user=admin' OR '1'='1

=== Fin de l'analyse ===
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `sudo iptables -L -n -v` | Lister les règles iptables avec compteurs |
| `sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT` | Autoriser SSH en entrée |
| `sudo iptables -P INPUT DROP` | Politique par défaut : tout bloquer en entrée |
| `sudo nft list ruleset` | Lister toutes les règles nftables |
| `sudo wg-quick up wg0` | Activer l'interface WireGuard |
| `sudo wg show` | Afficher l'état de WireGuard |
| `sudo tcpdump -i eth0 -nn -c 50` | Capturer 50 paquets sur eth0 |
| `sudo tcpdump -i eth0 -w capture.pcap` | Sauvegarder la capture dans un fichier pcap |
| `sudo suricata -c /etc/suricata/suricata.yaml -i eth0` | Lancer Suricata sur eth0 |
| `sudo ss -tlnp` | Lister les ports TCP en écoute |
| `ssh -o StrictHostKeyChecking=yes user@host` | Se connecter en SSH avec vérification stricte |

---

## Pièges Fréquents

### Piège 1 : Se verrouiller hors du serveur avec iptables

**Problème** : Tu appliques une règle `iptables -P INPUT DROP` sans avoir d'abord autorisé SSH. Tu perds immédiatement l'accès au serveur.

**Solution** : Autorise toujours SSH avant de changer la politique par défaut. Ou utilise une tâche cron qui réinitialise les règles au bout de 5 minutes :

```bash
# Ajouter une sécurité : réinitialisation dans 5 minutes
echo "iptables -F && iptables -P INPUT ACCEPT" | at now + 5 minutes
# Puis configurer les règles. Si tout fonctionne, annuler le cron :
atrm $(atq | tail -1 | cut -f1)
```

### Piège 2 : Penser que le VPN protège de tout

**Problème** : Un VPN chiffre le trafic entre deux points. Mais si ton appareil est compromis par un malware, le VPN ne protège rien : le malware accède aux données avant le chiffrement.

**Solution** : Le VPN est une couche de protection, pas une solution complète. Il doit être combiné avec un antivirus/EDR, un firewall local et de bonnes pratiques.

### Piège 3 : Configurer un IDS sans jamais lire les alertes

**Problème** : Installer Suricata et ne jamais consulter les logs. Les alertes s'accumulent, mais personne ne les traite. L'IDS devient inutile.

**Solution** : Mets en place un SIEM (Security Information and Event Management) ou au minimum un dashboard pour visualiser et prioriser les alertes. Définis un processus de traitement des alertes.

### Piège 4 : Oublier le filtrage du trafic sortant

**Problème** : On configure le firewall pour filtrer le trafic entrant, mais on autorise tout le trafic sortant. Un malware peut alors communiquer librement avec son serveur C2.

**Solution** : Applique le principe du moindre privilège au trafic sortant aussi. N'autorise que les ports et destinations nécessaires (DNS, HTTP/HTTPS, NTP).

### Piège 5 : Changer le port SSH sans mettre à jour le firewall

**Problème** : Tu changes le port SSH de 22 à 2222 dans `sshd_config`, mais la règle firewall autorise toujours le port 22 et bloque le port 2222. Résultat : tu perds l'accès SSH.

**Solution** : Mets à jour le firewall avant de redémarrer SSH. Ou mieux : ajoute d'abord une règle pour le nouveau port, redémarre SSH, vérifie que la connexion fonctionne sur le nouveau port, puis supprime la règle de l'ancien port.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre un firewall et un IDS/IPS
- [ ] Je sais configurer des règles iptables de base (INPUT, OUTPUT, DROP, ACCEPT)
- [ ] Je comprends la syntaxe nftables et ses avantages sur iptables
- [ ] Je sais expliquer le fonctionnement de WireGuard et le configurer
- [ ] Je connais la différence entre OpenVPN, WireGuard et IPsec
- [ ] Je sais ce qu'est une DMZ et pourquoi elle est nécessaire
- [ ] Je comprends la micro-segmentation et ses cas d'usage
- [ ] Je sais écrire une règle Suricata basique
- [ ] Je sais durcir une configuration SSH (au moins 5 paramètres)
- [ ] Je connais la différence entre un proxy, un reverse proxy et un WAF
- [ ] Je sais capturer et analyser du trafic réseau avec tcpdump

---

## Exercice Pratique

**Énoncé** : Tu es administrateur réseau d'une PME de 50 employés. L'entreprise dispose d'un serveur web (accessible depuis Internet), d'un serveur de base de données (interne uniquement), et de 50 postes de travail. Tu dois :

1. Concevoir une architecture réseau segmentée avec une DMZ
2. Écrire les règles iptables pour le firewall externe (entre Internet et la DMZ)
3. Écrire les règles iptables pour le firewall interne (entre la DMZ et le réseau interne)
4. Configurer une interface WireGuard pour permettre le télétravail sécurisé
5. Produire un fichier de configuration SSH durci pour le serveur web en DMZ
6. Écrire 3 règles Suricata pour détecter les attaques les plus courantes

**Indications** :

- Le serveur web écoute sur les ports 80 et 443
- La base de données PostgreSQL écoute sur le port 5432
- Le serveur web en DMZ doit pouvoir communiquer avec la base de données interne (port 5432 uniquement)
- Les postes de travail doivent pouvoir naviguer sur Internet (HTTP/HTTPS) et utiliser le DNS
- Le VPN WireGuard écoute sur le port 51820 du firewall externe

**Résultat attendu** : Un document complet avec le schéma réseau, les règles iptables des deux firewalls, la configuration WireGuard, la configuration SSH durcie et les 3 règles Suricata.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Architecture réseau segmentée

```text
Internet
    |
[Firewall externe] (fw-ext) - 203.0.113.1
    |                    |
   DMZ (172.16.0.0/24)   WireGuard (10.0.0.0/24)
    |
  Serveur Web (172.16.0.10)
    |
[Firewall interne] (fw-int)
    |
Réseau Interne (192.168.1.0/24)
    |                    |
  Postes de travail     Serveur BDD (192.168.1.20)
  (192.168.1.100-150)
```

### 2. Règles du firewall externe

```bash
# Firewall externe (fw-ext)
# Politique par défaut
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Connexions établies
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# HTTP/HTTPS depuis Internet vers le serveur web en DMZ
sudo iptables -A FORWARD -p tcp -d 172.16.0.10 --dport 80 -j ACCEPT
sudo iptables -A FORWARD -p tcp -d 172.16.0.10 --dport 443 -j ACCEPT

# WireGuard
sudo iptables -A INPUT -p udp --dport 51820 -j ACCEPT

# Autoriser le trafic VPN vers le réseau interne
sudo iptables -A FORWARD -i wg0 -j ACCEPT
```

### 3. Règles du firewall interne

```bash
# Firewall interne (fw-int)
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Loopback et connexions établies
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Serveur web DMZ vers base de données interne (PostgreSQL uniquement)
sudo iptables -A FORWARD -p tcp -s 172.16.0.10 -d 192.168.1.20 --dport 5432 -j ACCEPT

# Postes de travail vers Internet (HTTP, HTTPS, DNS)
sudo iptables -A FORWARD -p tcp -s 192.168.1.0/24 --dport 80 -j ACCEPT
sudo iptables -A FORWARD -p tcp -s 192.168.1.0/24 --dport 443 -j ACCEPT
sudo iptables -A FORWARD -p udp -s 192.168.1.0/24 --dport 53 -j ACCEPT
sudo iptables -A FORWARD -p tcp -s 192.168.1.0/24 --dport 53 -j ACCEPT

# Bloquer tout autre trafic de la DMZ vers le réseau interne
sudo iptables -A FORWARD -s 172.16.0.0/24 -d 192.168.1.0/24 -j DROP
```

### 4. Configuration WireGuard

```bash
# /etc/wireguard/wg0.conf sur le firewall externe
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <clé_privée_serveur>
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT

# Employé en télétravail 1
[Peer]
PublicKey = <clé_publique_employe1>
AllowedIPs = 10.0.0.2/32

# Employé en télétravail 2
[Peer]
PublicKey = <clé_publique_employe2>
AllowedIPs = 10.0.0.3/32
```

### 5. Configuration SSH durcie pour le serveur web

```text
Port 2222
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
MaxAuthTries 3
MaxSessions 2
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowTcpForwarding no
AllowUsers deploy
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
LogLevel VERBOSE
```

### 6. Trois règles Suricata

```text
# Détecter un scan de ports
alert tcp any any -> $HOME_NET any (msg:"SCAN détecté"; flags:S; \
  threshold:type threshold, track by_src, count 30, seconds 10; \
  sid:2000001; rev:1;)

# Détecter une tentative d'injection SQL
alert http any any -> $HOME_NET any (msg:"SQLi tentative UNION SELECT"; \
  http.uri; content:"UNION"; nocase; content:"SELECT"; nocase; \
  sid:2000002; rev:1;)

# Détecter une connexion SSH sur un port non standard
alert tcp any any -> $HOME_NET 2222 (msg:"SSH connexion vers port non standard"; \
  flow:to_server; flags:S; sid:2000003; rev:1;)
```

---

## Navigation

← Fiche précédente : **[02 - Cryptographie - Fondements et Applications](02-cryptographie.md)**

→ Fiche suivante : **[04 - Gouvernance, Risque et Conformité (GRC) - Introduction](04-gouvernance-risque-conformite.md)**
