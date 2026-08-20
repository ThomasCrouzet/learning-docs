---
tags:
  - Systèmes
  - Intermédiaire
  - Pratique
description: "Serveur DHCP : configurer ISC DHCP et dnsmasq, définir des plages d'adresses, des réservations, des options et analyser les logs."
estimated_time: "60 min"
fiche_number: 5
total_fiches: 9
cursus: "Services système"
---

# 05 - Serveur DHCP

> **En bref** : Configurer un serveur DHCP. ISC DHCP est en fin de vie depuis 2022 (dernier 4.4.3-P1) : le lab l'utilise pour la syntaxe, mais un déploiement 2026 doit évaluer Kea. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [Annuaire LDAP](04-annuaire-ldap.md)
- Connaitre les bases de l'adressage IP (adresses, masques, sous-réseaux) - cursus [Réseaux](../20-reseaux/index.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer le protocole DHCP et son fonctionnement en 4 étapes (DORA), configurer un serveur DHCP avec ISC DHCP et dnsmasq, définir des plages d'adresses et des réservations statiques, configurer les options DHCP (passerelle, DNS, domaine) et diagnostiquer les problèmes de distribution d'adresses.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que DHCP ?

**Définition** : DHCP (Dynamic Host Configuration Protocol) est un protocole réseau qui permet a un serveur de distribuer automatiquement des adresses IP et des paramètres de configuration réseau (passerelle, serveurs DNS, nom de domaine) aux machines d'un réseau.

**Le problème que DHCP résout** :

Sans DHCP, voici les problèmes rencontres :

1. **Configuration manuelle** : Chaque machine doit être configurée a la main avec une adresse IP, un masque de sous-réseau, une passerelle et des serveurs DNS. Sur un réseau de 500 machines, c'est un travail énorme et source d'erreurs.
2. **Conflits d'adresses** : Si deux machines sont configurées avec la même adresse IP, elles ne peuvent pas communiquer correctement. Sans outil centralise, les doublons sont difficiles a détecter.
3. **Gestion des départs et arrivées** : Quand une machine quitte le réseau, son adresse IP reste inutilisee. Quand une nouvelle machine arrive, il faut trouver une adresse libre.

**Comment DHCP résout ces problèmes** :

| Problème | Solution apportée par DHCP |
| --- | --- |
| Configuration manuelle | Le serveur DHCP configure automatiquement chaque machine qui se connecte |
| Conflits d'adresses | Le serveur DHCP attribue des adresses uniques et tient un registre des attributions |
| Gestion des départs et arrivées | Les adresses sont "louees" pour une durée limitée (bail). A expiration, l'adresse est liberee |

**Analogie concrète** : Le DHCP fonctionne comme la reception d'un hôtel. Quand un client arrive (une machine se connecte), la reception (le serveur DHCP) lui attribue une chambre disponible (une adresse IP) avec les informations utiles (passerelle = plan de l'hôtel, DNS = numéro de la conciergerie). Le client garde la chambre pour la durée de son sejour (bail DHCP). A son départ, la chambre est liberee et attribuable a un autre client.

**Ce que DHCP n'est PAS** :

- DHCP n'est pas DNS. DHCP distribue des adresses IP. DNS traduit des noms de domaine en adresses IP. Les deux sont complémentaires : DHCP peut indiquer aux clients quel serveur DNS utiliser.
- DHCP n'est pas un routeur. DHCP ne route pas le trafic réseau. Il indique aux clients quelle est la passerelle par défaut (le routeur), mais il ne remplit pas ce rôle lui-même.

---

### Le processus DORA

**Définition** : DORA est l'acronyme des 4 étapes du processus d'attribution d'une adresse DHCP : Discover, Offer, Request, Acknowledge.

```text
Client                                    Serveur DHCP
  |                                            |
  |--- 1. DHCP Discover (broadcast) --------->|
  |    "Y a-t-il un serveur DHCP ?"           |
  |                                            |
  |<-- 2. DHCP Offer -------------------------|
  |    "Voici l'adresse 192.168.1.50"         |
  |                                            |
  |--- 3. DHCP Request (broadcast) ---------->|
  |    "J'accepte l'adresse 192.168.1.50"     |
  |                                            |
  |<-- 4. DHCP Acknowledge -------------------|
  |    "C'est confirme, elle est a toi"       |
  |                                            |
```

**Détail de chaque étape** :

| Étape | Nom | Type | Description |
| --- | --- | --- | --- |
| 1 | Discover | Broadcast | Le client envoie un message a tout le réseau pour trouver un serveur DHCP |
| 2 | Offer | Unicast | Le serveur propose une adresse IP disponible au client |
| 3 | Request | Broadcast | Le client accepte l'offre (broadcast pour informer les autres serveurs DHCP eventuels) |
| 4 | Acknowledge | Unicast | Le serveur confirme l'attribution et envoie les paramètres complets |

---

### Les baux DHCP (leases)

**Définition** : Un bail DHCP (lease) est la durée pendant laquelle un client peut utiliser l'adresse IP attribuee par le serveur. A l'expiration du bail, le client doit renouveler sa demande ou liberer l'adresse.

**Cycle de vie d'un bail** :

```text
Attribution    50% du bail    87.5% du bail    Expiration
     |              |               |              |
     |--- Bail actif ---|           |              |
     |              |-- Renouvellement T1 -->|     |
     |              |               |-- T2 -->|   |
     |              |               |              |-- Expiration
```

- **T1 (50%)** : Le client tente de renouveler le bail auprès du même serveur DHCP (unicast).
- **T2 (87.5%)** : Si le renouvellement T1 échoue, le client tente de contacter n'importe quel serveur DHCP (broadcast).
- **Expiration** : Si aucun serveur ne répond, le client perd son adresse IP.

---

### Réservations statiques

**Définition** : Une réservation statique associe une adresse IP fixe a une adresse MAC spécifique. Le serveur DHCP attribue toujours la même adresse IP a cette machine, combinant les avantages du DHCP (configuration automatique) et de l'IP fixe (adresse previsible).

**Quand utiliser une réservation** :

- Serveurs (web, base de données, DNS) qui doivent avoir une adresse fixe
- Imprimantes réseau
- Équipements d'infrastructure (switchs, points d'accès Wi-Fi)

---

## Étapes Pratiques

### Étape 1 : Préparer l'environnement réseau

```bash
# Cree un reseau Docker dedie pour le lab DHCP
# Le reseau utilise un sous-reseau specifique
docker network create \
  --subnet=172.20.0.0/24 \
  --gateway=172.20.0.1 \
  lab-dhcp-net

# Cree le dossier de travail
mkdir -p ~/lab-dhcp/{config,leases}
```

---

### Étape 2 : Configurer ISC DHCP

```bash
# Configuration du serveur DHCP
cat > ~/lab-dhcp/config/dhcpd.conf << 'EOF'
# Parametres globaux
# Duree du bail par defaut : 1 heure
default-lease-time 3600;
# Duree maximale du bail : 24 heures
max-lease-time 86400;

# Ce serveur fait autorite pour ce sous-reseau
authoritative;

# Journalisation
log-facility local7;

# Definition du sous-reseau
subnet 172.20.0.0 netmask 255.255.255.0 {
    # Plage d'adresses dynamiques (de .100 a .200)
    range 172.20.0.100 172.20.0.200;

    # Passerelle par defaut
    option routers 172.20.0.1;

    # Serveurs DNS
    option domain-name-servers 8.8.8.8, 1.1.1.1;

    # Nom de domaine
    option domain-name "lab.local";

    # Masque de sous-reseau
    option subnet-mask 255.255.255.0;

    # Adresse de broadcast
    option broadcast-address 172.20.0.255;
}

# Reservation statique pour un serveur web
host serveur-web {
    # Adresse MAC de la machine
    hardware ethernet 02:42:ac:14:00:0a;
    # Adresse IP reservee
    fixed-address 172.20.0.10;
    # Nom d'hote
    option host-name "web.lab.local";
}

# Reservation statique pour une imprimante
host imprimante {
    hardware ethernet 02:42:ac:14:00:0b;
    fixed-address 172.20.0.11;
    option host-name "printer.lab.local";
}
EOF
```

Explication des sections :

- **Paramètres globaux** : durée du bail par défaut et maximale
- **subnet** : définit le réseau, la plage d'adresses dynamiques et les options
- **host** : réservations statiques (adresse MAC -> adresse IP fixe)

---

### Étape 3 : Démarrer le serveur DHCP

> **Note - image communautaire et avenir d'ISC DHCP** : `networkboot/dhcpd` est une image communautaire (non officielle). Elle convient à l'apprentissage mais n'est pas publiée par ISC.
>
> ISC DHCP (dhcpd) est en maintenance de sécurité uniquement depuis 2022 : ISC recommande Kea pour les nouveaux déploiements de production. Pour l'apprentissage, dhcpd reste un bon support (syntaxe claire, toujours disponible dans les distributions). Pour un déploiement de production en 2026, évalue Kea (`kea-dhcp4-server`). Le tag Docker `:latest` n'est pas déterministe - en environnement réel, épingle une version fixe.

```bash
# Cree un fichier de baux vide (requis par ISC DHCP)
touch ~/lab-dhcp/leases/dhcpd.leases

# Lance le serveur DHCP (image communautaire, usage pedagogique)
docker run -d \
  --name lab-dhcp \
  --network lab-dhcp-net \
  --ip 172.20.0.2 \
  -v ~/lab-dhcp/config/dhcpd.conf:/etc/dhcp/dhcpd.conf \
  -v ~/lab-dhcp/leases:/var/lib/dhcp \
  networkboot/dhcpd:latest \
  eth0

# Verifie le demarrage
docker logs lab-dhcp 2>&1 | tail -10
```

**Résultat attendu** :

```text
Internet Systems Consortium DHCP Server 4.4.x
For info, please visit https://www.isc.org/software/dhcp/
Listening on LPF/eth0/...
Sending on   LPF/eth0/...
```

---

### Étape 4 : Tester l'attribution d'adresse

Lance un conteneur client qui demande une adresse DHCP :

```bash
# Lance un client sans adresse IP (mode reseau personnalise)
docker run -d \
  --name lab-dhcp-client \
  --network lab-dhcp-net \
  alpine:3.19 sleep 3600

# Verifie l'adresse IP obtenue par le client
docker exec lab-dhcp-client ip addr show eth0
```

**Résultat attendu** :

```text
2: eth0@if7: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 172.20.0.100/24 scope global eth0
```

Le client a reçu une adresse dans la plage dynamique (172.20.0.100-200).

---

### Étape 5 : Consulter les baux actifs

```bash
# Affiche le fichier des baux
cat ~/lab-dhcp/leases/dhcpd.leases
```

**Résultat attendu** :

```text
lease 172.20.0.100 {
  starts 2025/04/07 10:00:00;
  ends 2025/04/07 11:00:00;
  binding state active;
  hardware ethernet 02:42:ac:14:00:64;
  client-hostname "lab-dhcp-client";
}
```

Chaque bail contient :

- L'adresse IP attribuee
- La date de début et de fin
- L'état du bail (active, free, expired)
- L'adresse MAC du client
- Le nom d'hôte du client

---

### Étape 6 : Configurer dnsmasq comme serveur DHCP

dnsmasq est une alternative plus simple qui combine DNS et DHCP dans un seul service.

```bash
# Arrete le serveur ISC DHCP
docker stop lab-dhcp

# Lance dnsmasq comme serveur DHCP
docker run -d \
  --name lab-dnsmasq-dhcp \
  --network lab-dhcp-net \
  --ip 172.20.0.3 \
  --cap-add NET_ADMIN \
  alpine:3.19 sh -c "
    apk add --no-cache dnsmasq &&
    cat > /etc/dnsmasq.conf << 'DNSCONF'
# Interface d'ecoute
interface=eth0

# Plage DHCP : adresses .100 a .200, bail de 12 heures
dhcp-range=172.20.0.100,172.20.0.200,255.255.255.0,12h

# Options DHCP
dhcp-option=3,172.20.0.1
dhcp-option=6,8.8.8.8,1.1.1.1
dhcp-option=15,lab.local

# Reservation statique (MAC,IP,nom)
dhcp-host=02:42:ac:14:00:0a,172.20.0.10,web

# Journalisation DHCP
log-dhcp

# Desactive le serveur DNS (utilise uniquement DHCP)
port=0
DNSCONF
    dnsmasq --no-daemon --log-queries
  "
```

Explication des options dnsmasq :

- `dhcp-range` : plage d'adresses, masque et durée du bail
- `dhcp-option=3` : passerelle par défaut
- `dhcp-option=6` : serveurs DNS
- `dhcp-option=15` : nom de domaine
- `dhcp-host` : réservation statique (format simplifie)
- `log-dhcp` : journalise toutes les transactions DHCP

---

### Étape 7 : Analyser les logs DHCP

```bash
# Affiche les logs de dnsmasq (transactions DHCP)
docker logs lab-dnsmasq-dhcp 2>&1 | grep -i dhcp
```

**Résultat attendu** :

```text
dnsmasq-dhcp: DHCPDISCOVER(eth0) 02:42:ac:14:00:64
dnsmasq-dhcp: DHCPOFFER(eth0) 172.20.0.100 02:42:ac:14:00:64
dnsmasq-dhcp: DHCPREQUEST(eth0) 172.20.0.100 02:42:ac:14:00:64
dnsmasq-dhcp: DHCPACK(eth0) 172.20.0.100 02:42:ac:14:00:64 lab-dhcp-client
```

Tu vois les 4 étapes DORA (Discover, Offer, Request, Acknowledge) pour chaque client.

---

### Étape 8 : Forcer le renouvellement d'un bail

```bash
# Depuis le client, force le renouvellement DHCP
docker exec lab-dhcp-client sh -c "
  # Relache l'adresse IP actuelle
  ip addr flush dev eth0
  # Redemande une adresse (necessite un client DHCP)
  udhcpc -i eth0
"
```

**Résultat attendu** :

```text
udhcpc: started, v1.36.1
udhcpc: broadcasting discover
udhcpc: broadcasting select for 172.20.0.100
udhcpc: lease of 172.20.0.100 obtained from 172.20.0.3, lease time 43200
```

---

### Étape 9 : Nettoyage

```bash
# Arrete et supprime tout
docker stop lab-dhcp lab-dhcp-client lab-dnsmasq-dhcp 2>/dev/null
docker rm lab-dhcp lab-dhcp-client lab-dnsmasq-dhcp 2>/dev/null
docker network rm lab-dhcp-net 2>/dev/null
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cat /var/lib/dhcp/dhcpd.leases` | Affiche les baux actifs (ISC DHCP) |
| `dhcpd -t -cf /etc/dhcp/dhcpd.conf` | Teste la syntaxe de la configuration ISC DHCP |
| `udhcpc -i eth0` | Client DHCP minimaliste (BusyBox/Alpine) |
| `dhclient -v eth0` | Client DHCP (Debian/Ubuntu) avec sortie détaillée |
| `dhclient -r eth0` | Libere le bail DHCP courant |
| `ip addr show eth0` | Affiche l'adresse IP obtenue par DHCP |
| `journalctl -u isc-dhcp-server` | Logs du serveur DHCP (systemd) |

---

## Pièges Frequents

### Piège 1 : Deux serveurs DHCP sur le meme réseau

⚠️ **Problème** : Tu demarres un serveur DHCP sur un réseau ou il y en a déjà un (ta box Internet par exemple). Les clients reçoivent des configurations contradictoires et certaines machines n'ont plus accès a Internet.

✅ **Solution** : Avant de démarrer un serveur DHCP, verifie qu'il n'y en a pas déjà un sur le réseau. Utilise un réseau Docker isole pour les tests. En production, desactive le DHCP de la box si tu veux utiliser ton propre serveur.

---

### Piège 2 : Plage d'adresses qui chevauche les adresses fixes

⚠️ **Problème** : Ta plage dynamique va de `.1` a `.254`. Tu configures une réservation a `.10`, mais le serveur a déjà attribue `.10` a un autre client. Conflit d'adresses.

✅ **Solution** : Réserve une plage pour les adresses statiques (ex: `.1-.49`) et une plage pour les adresses dynamiques (ex: `.100-.200`). Les réservations doivent être dans la plage statique, hors de la plage dynamique.

```text
172.20.0.1   - 172.20.0.49  : adresses fixes et reservations
172.20.0.50  - 172.20.0.99  : reserve pour l'extension
172.20.0.100 - 172.20.0.200 : plage dynamique DHCP
172.20.0.201 - 172.20.0.254 : reserve pour equipements reseau
```

---

### Piège 3 : Bail trop court ou trop long

⚠️ **Problème** : Tu configures un bail de 5 minutes. Les clients renouvellent constamment, generant du trafic inutile. Ou tu configures un bail de 30 jours et les adresses ne sont jamais liberees.

✅ **Solution** : Adapte la durée du bail au contexte :

| Contexte | Durée recommandée |
| --- | --- |
| Réseau Wi-Fi public (cafe, hôtel) | 1 a 4 heures |
| Bureau (postes fixes) | 8 a 24 heures |
| Serveurs (avec réservation) | 24 heures a 7 jours |
| Lab de test | 1 a 2 heures |

---

### Piège 4 : Oublier l'option `authoritative`

⚠️ **Problème** : Sans le mot-clé `authoritative`, le serveur ISC DHCP ne répond pas aux requêtes de clients qui ont une adresse d'un autre sous-réseau. Les clients gardent une vieille adresse invalide.

✅ **Solution** : Ajoute toujours `authoritative;` dans la configuration si ton serveur est le serveur DHCP principal du réseau. Cela lui permet d'envoyer des DHCPNAK pour forcer les clients a obtenir une nouvelle adresse.

---

## Checklist de Validation

- [ ] Je sais expliquer le protocole DHCP et le processus DORA
- [ ] Je sais configurer un serveur DHCP avec ISC DHCP (dhcpd.conf)
- [ ] Je sais définir une plage d'adresses dynamiques et des options réseau
- [ ] Je sais créer des réservations statiques basées sur l'adresse MAC
- [ ] Je sais configurer dnsmasq comme serveur DHCP alternatif
- [ ] Je sais lire et interpréter les baux DHCP et les logs
- [ ] Je comprends les risques de deux serveurs DHCP sur le meme réseau

---

## Exercice Pratique

**Enonce** : Configure un serveur DHCP pour un réseau d'entreprise `10.0.0.0/24` :

1. Plage dynamique : `10.0.0.100` a `10.0.0.200`
2. Passerelle : `10.0.0.1`
3. Serveurs DNS : `10.0.0.2` (DNS interne) et `8.8.8.8` (DNS externe)
4. Nom de domaine : `entreprise.local`
5. Bail par défaut : 4 heures, maximum 12 heures
6. Trois réservations : serveur web (`.10`), serveur mail (`.20`), imprimante (`.30`)
7. Lance deux clients et verifie qu'ils obtiennent des adresses dans la plage dynamique

**Indications** :

- Utilise un réseau Docker `--subnet=10.0.0.0/24`
- Invente des adresses MAC pour les réservations
- Consulte le fichier des baux après l'attribution

**Résultat attendu** : Les deux clients obtiennent des adresses entre `.100` et `.200`, et le fichier des baux les confirme.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

```bash
# Cree le reseau
docker network create --subnet=10.0.0.0/24 --gateway=10.0.0.1 lab-dhcp-ex-net

# Cree la configuration
mkdir -p ~/lab-dhcp-ex
cat > ~/lab-dhcp-ex/dhcpd.conf << 'EOF'
default-lease-time 14400;
max-lease-time 43200;
authoritative;

subnet 10.0.0.0 netmask 255.255.255.0 {
    range 10.0.0.100 10.0.0.200;
    option routers 10.0.0.1;
    option domain-name-servers 10.0.0.2, 8.8.8.8;
    option domain-name "entreprise.local";
    option subnet-mask 255.255.255.0;
}

host serveur-web {
    hardware ethernet aa:bb:cc:dd:ee:10;
    fixed-address 10.0.0.10;
}

host serveur-mail {
    hardware ethernet aa:bb:cc:dd:ee:20;
    fixed-address 10.0.0.20;
}

host imprimante {
    hardware ethernet aa:bb:cc:dd:ee:30;
    fixed-address 10.0.0.30;
}
EOF

# Fichier de baux vide
touch ~/lab-dhcp-ex/dhcpd.leases

# Lance le serveur
docker run -d --name lab-dhcp-ex \
  --network lab-dhcp-ex-net --ip 10.0.0.2 \
  -v ~/lab-dhcp-ex/dhcpd.conf:/etc/dhcp/dhcpd.conf \
  -v ~/lab-dhcp-ex/dhcpd.leases:/var/lib/dhcp/dhcpd.leases \
  networkboot/dhcpd:latest eth0

# Lance deux clients
docker run -d --name client1 --network lab-dhcp-ex-net alpine:3.19 sleep 3600
docker run -d --name client2 --network lab-dhcp-ex-net alpine:3.19 sleep 3600

# Verifie les adresses
docker exec client1 ip addr show eth0
docker exec client2 ip addr show eth0

# Consulte les baux
cat ~/lab-dhcp-ex/dhcpd.leases
```

Nettoyage :

```bash
docker stop lab-dhcp-ex client1 client2 2>/dev/null
docker rm lab-dhcp-ex client1 client2 2>/dev/null
docker network rm lab-dhcp-ex-net 2>/dev/null
```

---

## Navigation

← Fiche précédente : **[04 - Annuaire LDAP](04-annuaire-ldap.md)**

→ Fiche suivante : **[06 - Proxy et reverse proxy](06-proxy-reverse-proxy.md)**
