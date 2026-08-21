---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Lire un paquet couche par couche : Ethernet, ARP, IPv4, IPv6, ICMP, TCP, UDP, DNS, DHCP, HTTP, TLS ; déchiffrement de labo uniquement avec des clés que tu contrôles."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 8
cursus: "Analyse réseau"
id: "infrastructure.network-analysis.lire-couches-ethernet-tls"
course_id: "infrastructure.network-analysis"
content_type: "lesson"
order: 4
---

# 04 - Lire les couches d'Ethernet à TLS

> **En bref** : Tu ouvres le panneau de détails et tu descends Ethernet, ARP, IP, ICMP, TCP ou UDP, puis DNS, DHCP, HTTP ou TLS, en notant ce qui reste lisible quand le payload est chiffré. Lecture estimée : 75 min.

## Prérequis

- Avoir lu [03 - Filtres BPF et filtres d'affichage](03-filtres-bpf-et-affichage.md)
- Fichiers de labo : `icmp-echo.pcap`, `ping-lo.pcapng`, `http-lo.pcapng` (fiches 02-03)
- Savoir ce qu'est un port et un handshake TCP ([03 - Protocoles de transport](../20-reseaux/03-protocoles-transport.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras nommer chaque couche dans le détail d'un paquet, relier un champ Wireshark à sa fonction, distinguer ce que TLS cache et ce qu'il laisse visible, et déchiffrer **uniquement** un TLS de laboratoire dont tu contrôles les clés.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Comment lit-on un paquet couche par couche ?

**Définition** : Wireshark affiche trois zones : la **liste** (un paquet par ligne), le **détail** (arbre de protocoles), et les **octets** (hex + ASCII). Tu lis toujours le détail du **bas du réseau vers le haut de l'application** : lien, réseau, transport, application. Guide : [User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/).

**Le problème que cette lecture résout** :

Sans ordre de lecture :

1. Tu regardes HTTP alors que l'IP destination est fausse.
2. Tu cherches un GET dans un paquet SYN.
3. Tu ignores que loopback n'a pas d'Ethernet, et tu bloques sur "pas de MAC".

**Comment la lecture se déroule** :

| Ordre | Couche | Question | Exemple de champ |
| ----- | ------ | -------- | ---------------- |
| 1 | Frame | Quand, quelle taille ? | `frame.time`, `frame.len` |
| 2 | Ethernet (si présent) | Quelles MAC, quel EtherType ? | `eth.src`, `eth.type` |
| 3 | ARP ou IP | Qui parle à qui au niveau 3 ? | `arp`, `ip.src`, `ipv6.src` |
| 4 | ICMP / TCP / UDP | Quel service, quels flags ? | `icmp.type`, `tcp.flags`, `udp.port` |
| 5 | DNS / DHCP / HTTP / TLS | Quel message applicatif ? | `dns.qry.name`, `http.request.uri`, `tls.handshake` |

**Analogie concrète** : Ouvrir un colis : carton (Ethernet), bordereau de transport (IP), numéro de casier (port TCP), lettre à l'intérieur (HTTP). Tu ne lis pas la lettre avant de vérifier que le colis est au bon nom.

**Ce que cette lecture n'est PAS** :

- Ce n'est pas le modèle OSI récité par cœur. Les noms Wireshark suivent les dissecteurs (`eth`, `ip`, `tcp`, `http`).
- Ce n'est pas "le premier paquet de la liste est toujours un SYN". Le fichier peut commencer au milieu d'un flux.

---

### Qu'est-ce qu'Ethernet et ARP dans une capture ?

**Définition** : Ethernet (IEEE 802.3) porte une adresse MAC source, une MAC destination, et un EtherType (IPv4 `0x0800`, IPv6 `0x86dd`, ARP `0x0806`). ARP (Address Resolution Protocol) traduit une IPv4 en MAC sur le **même** lien : "qui a 192.0.2.1 ? dites-le à 192.0.2.10".

**Le problème qu'ARP résout** :

Sans ARP :

1. Une machine IPv4 ne saurait pas quelle MAC viser sur le LAN.
2. Un diagnostic "injoignable" resterait flou : pas de route, ou pas de MAC.

**Comment tu les reconnais dans Wireshark** :

| Champ | Rôle |
| ----- | ---- |
| `eth.dst == ff:ff:ff:ff:ff:ff` | Broadcast Ethernet (ARP request typique) |
| `arp.opcode == 1` | Requête ARP |
| `arp.opcode == 2` | Réponse ARP |
| `arp.src.proto_ipv4` | IPv4 de l'émetteur |
| `eth.type == 0x0806` | EtherType ARP |

**Analogie concrète** : Ethernet est le couloir de l'immeuble (numéro d'appartement = MAC). ARP est le tableau "M. Dupont habite au 12". Sans tableau, tu ne sais pas quelle porte frapper pour une IPv4.

**Ce qu'ARP n'est PAS** :

- ARP n'existe pas pour joindre une IP **hors** du lien : ça, c'est la passerelle et le routage.
- ARP n'apparaît **pas** sur loopback. D'où le pcap text2pcap ci-dessous.
- Un "ARP storm" n'est pas un ping. C'est trop de requêtes ARP (bruit, boucle, scan).

---

### Qu'est-ce qu'IPv4, IPv6 et ICMP dans une capture ?

**Définition** : IPv4 et IPv6 acheminent le paquet d'une adresse logique à une autre. ICMP (IPv4) et ICMPv6 signalent erreurs et diagnostics (echo request/reply = ping, destination unreachable, time exceeded).

**Le problème que ces en-têtes résolvent pour le diagnostic** :

1. Savoir **qui** parle (`ip.src` / `ipv6.src`).
2. Savoir si le paquet est fragmenté (`ip.flags.mf`, `ip.frag_offset`).
3. Distinguer "l'hôte ne répond pas" (pas d'echo reply) et "un routeur refuse" (ICMP unreachable).

**Champs à lire en premier** :

| Protocole | Champ | Lecture |
| --------- | ----- | ------- |
| IPv4 | `ip.src`, `ip.dst` | Adresses |
| IPv4 | `ip.ttl` | TTL ; un TTL qui diminue trop vite signale une boucle possible |
| IPv4 | `ip.proto` | 1 ICMP, 6 TCP, 17 UDP |
| IPv6 | `ipv6.src`, `ipv6.dst` | Adresses 128 bits |
| IPv6 | `ipv6.nxt` | Next header |
| ICMP | `icmp.type` | 8 echo request, 0 echo reply |
| ICMPv6 | `icmpv6.type` | 128 echo request, 129 echo reply |

**Analogie concrète** : L'adresse IP est le nom de la ville + numéro de rue. ICMP est le tampon de La Poste : "destinataire inconnu", "délai dépassé", ou "accusé de réception du ping".

**Ce qu'ICMP n'est PAS** :

- ICMP n'est pas "le protocole d'Internet". Internet tourne surtout TCP/UDP. ICMP est le canal d'erreur et de test.
- Un ping qui passe ne prouve pas que le port 443 est ouvert.

---

### Comment distinguer TCP, UDP, DNS, DHCP et HTTP ?

**Définition** : TCP (ports, flags SYN/ACK/FIN/RST, numéros de séquence) établit une session fiable. UDP envoie des datagrammes sans session. DNS interroge des noms (UDP 53 le plus souvent, TCP 53 pour les réponses longues et les zones). DHCP attribue IPv4 (UDP 67/68). HTTP est le texte d'une requête web en clair, souvent porté par TCP, aujourd'hui souvent **dans** TLS.

**Le problème que cette distinction résout** :

Sans elle tu mélanges :

1. Un timeout DNS (UDP 53, pas de réponse) et un timeout HTTP (TCP établi, pas de GET réponse).
2. Un RST TCP (port fermé / refus) et un ICMP unreachable.
3. HTTP et HTTPS : même famille applicative, visibilité très différente.

**Repères de dissection** :

| Protocole | Display filter | Ce que tu dois voir |
| --------- | -------------- | ------------------- |
| TCP | `tcp` | Ports, flags, seq, ack, window |
| UDP | `udp` | Ports, longueur |
| DNS | `dns` | `dns.qry.name`, `dns.flags.response`, `dns.a` |
| DHCP | `dhcp` | `dhcp.option.dhcp` (discover/offer/request/ack) |
| HTTP | `http` | Méthode, URI, code, en-têtes texte |
| TLS | `tls` | Handshake, version, SNI, Application Data |

**Analogie concrète** : TCP est un appel téléphonique (décroché, conversation, raccroché). UDP est un SMS. DNS est l'annuaire. DHCP est le bureau qui te donne un badge d'entrée (IP). HTTP est le contenu de la lettre **si** l'enveloppe n'est pas opaque.

**Ce que ces dissecteurs ne sont PAS** :

- `http` n'est pas "tout ce qui va au port 80". Un port 8000 local, dans ce cursus, **est** HTTP.
- `dns` n'est pas "tout UDP 53". DoH (DNS over HTTPS) apparaît comme `tls`/`http`.
- DHCP n'est pas visible sur loopback dans le labo par défaut : pas de lease à demander à 127.0.0.1. Tu le reconnais sur une interface LAN **à toi**, filtre `port 67 or port 68` (BPF) / `dhcp` (affichage).

---

### Que voit-on de TLS, et comment déchiffre-t-on en labo ?

**Définition** : TLS (ex-SSL) assure authentification, intégrité et confidentialité au-dessus de TCP. Wireshark dissecte le handshake **sans** clés : version, cipher suite, certificat, souvent le SNI (`tls.handshake.extensions_server_name`). Les `Application Data` restent opaques. Pour voir HTTP dans HTTPS, tu fournis des **secrets de session** que **ton** client a exportés (`SSLKEYLOGFILE`). Wiki : [TLS](https://wiki.wireshark.org/TLS).

**Le problème que cette règle résout** :

1. Tu n'essaies pas de "casser" le HTTPS d'un tiers.
2. Tu n'utilises pas un MITM (proxy TLS interceptant) sur des utilisateurs qui n'ont pas consenti.
3. Tu sais encore diagnostiquer un HTTPS qui échoue **sans** déchiffrer : alert TLS, certificat expiré visible au handshake, RST, timeout.

**Trois méthodes de déchiffrement (wiki TLS), une seule recommandée ici** :

| Méthode | Condition | À utiliser dans ce cursus |
| ------- | --------- | ------------------------- |
| Key log (`SSLKEYLOGFILE`) | Le client ou le serveur que **tu** lances écrit les secrets | Oui, localhost uniquement |
| Clé RSA privée du serveur | Pas de (EC)DHE, pas TLS 1.3, handshake avec ClientKeyExchange | Non pour le labo courant (TLS 1.3 + ECDHE partout) |
| PSK | Appareil qui utilise un PSK connu | Hors scope |

Préférences Wireshark : Edit → Preferences → Protocols → TLS → (Pre)-Master-Secret log filename. tshark : `-o tls.keylog_file:/chemin/vers/sslkeys.log`.

TCP requis pour le déchiffrement : "Allow subdissector to reassemble TCP streams" (activé par défaut) ; "Reassemble out-of-order segments" depuis Wireshark 3.0 (souvent à activer).

Injection dans un pcapng : `editcap --inject-secrets tls,keys.txt in.pcap out-dsb.pcapng` (Wireshark 3.0+, Decryption Secrets Block).

**Analogie concrète** : TLS est une enveloppe opaque. Le recto montre l'expéditeur, le destinataire, parfois le nom du service (SNI = le nom sur l'enveloppe). Le keylog est **ta** copie de la clé de **ton** cadenas, pas un passe-partout du quartier.

**Ce que le déchiffrement n'est PAS** :

- Ce n'est pas un MITM. Tu n'intercales pas un faux certificat dans le trafic d'autrui.
- Ce n'est pas valable pour Safari / anciens Edge (bibliothèques sans `SSLKEYLOGFILE`). Firefox, Chrome, curl (OpenSSL/LibreSSL/BoringSSL) le supportent souvent.
- Ce n'est pas anodin : le fichier keylog **déchiffre** les sessions concernées. Tu le traites comme un secret (fiche [08](08-confidentialite-pcap-et-exercice.md)).

Capture BPF pour TLS : tu ne filtres pas "tls" en BPF. Tu filtres le port, exemple `tcp port 443` ([wiki TLS, Capture Filter](https://wiki.wireshark.org/TLS)).

---

## Étapes Pratiques

```bash
cd /tmp/lab-analyse-reseau
```

---

### Étape 1 : Ethernet + ICMP via text2pcap

```bash
tshark -r icmp-echo.pcap -V
```

Lis dans l'ordre et coche :

1. Frame (taille).
2. Ethernet II : MAC source `00:0e:b6:00:00:01`, destination `00:0e:b6:00:00:02`, EtherType IPv4.
3. IPv4 : `192.0.2.1` → `192.0.2.2`, protocole ICMP.
4. ICMP : Type 8 Echo request.

**Résultat attendu** : les quatre blocs sont présents. C'est le paquet **avec** Ethernet que loopback ne te donne pas.

---

### Étape 2 : ARP synthétique avec text2pcap

```bash
cat > arp-whohas.hex << 'EOF'
000000 ff ff ff ff ff ff 00 11 22 33 44 55 08 06 00 01
000010 08 00 06 04 00 01 00 11 22 33 44 55 c0 00 02 0a
000020 00 00 00 00 00 00 c0 00 02 01
EOF
text2pcap arp-whohas.hex arp-whohas.pcap
tshark -r arp-whohas.pcap -V
```

**Résultat attendu** :

```text
Ethernet II, Src: 00:11:22:33:44:55, Dst: ff:ff:ff:ff:ff:ff
Address Resolution Protocol (request)
    Sender IP address: 192.0.2.10
    Target IP address: 192.0.2.1
```

Filtre d'affichage : `arp.opcode == 1`. Filtre BPF équivalent si tu capturais du vrai ARP : `arp`.

---

### Étape 3 : ICMP réel sur loopback

```bash
tshark -r ping-lo.pcapng -V -c 1
```

**Résultat attendu** : pas d'Ethernet II (souvent `Null/Loopback` ou `Linux cooked`). IP + ICMP Echo. Si le fichier est IPv6, tu verras ICMPv6 type 128. Les deux sont valides.

---

### Étape 4 : TCP et HTTP clair

```bash
tshark -r http-lo.pcapng
tshark -r http-lo.pcapng -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0" -V
tshark -r http-lo.pcapng -Y "http.request" -V
```

Sur le SYN, lis : port source éphémère, port dest 8000, flag SYN, window.

Sur le GET, lis : `Hypertext Transfer Protocol` → `GET / HTTP/1.1`, `Host: 127.0.0.1:8000`.

**Résultat attendu** : le SYN n'a **pas** de couche HTTP. Le GET a TCP **et** HTTP. C'est la descente couche par couche.

Follow Stream se fait dans la fiche [05](05-flux-tcp-retransmissions.md). Ici tu restes sur un paquet à la fois.

---

### Étape 5 : UDP local (si tu as `udp-lo.pcapng`)

```bash
tshark -r udp-lo.pcapng -V
```

**Résultat attendu** : UDP destination port 9, payload ASCII `lab-udp` dans les octets. Pas de handshake.

Si le fichier n'existe pas, refais l'exercice de la fiche 02.

---

### Étape 6 : DNS - génération locale ou lecture de champ

Option A, **si** tu as un résolveur local (souvent le cas) et le droit de capturer `lo` :

Terminal 1 :

```bash
tshark -i lo -p -c 6 -f "udp port 53" -w dns-lo.pcapng
```

Terminal 2 :

```bash
python3 -c 'import socket; socket.getaddrinfo("localhost", None)'
```

Puis :

```bash
tshark -r dns-lo.pcapng -Y "dns" -T fields -e dns.qry.name -e dns.flags.response
```

**Résultat attendu** : au moins un nom (`localhost` ou similaire) et un 0 (requête) / 1 (réponse). Si **aucun** paquet : ton OS ne passe pas par UDP 53 sur loopback (cache, nsswitch). Ce n'est pas un échec du cursus : passe à l'option B.

Option B, hors ligne, paquet DNS minimal via text2pcap (requête A pour `test`, ID 0x0001, vers 192.0.2.53) :

Le plus simple pour vérifier le dissector DNS reste l'option A. Si A est vide, tu notes : "DNS non observé sur lo" et tu retiens les champs `dns.qry.name` / `dns.a` pour une capture LAN **autorisée** plus tard, BPF `port 53`.

Option C, **optionnelle** si tu as Internet **et** l'autorisation d'interroger un résolveur public **depuis ta machine** : `dig example.com` pendant `tshark -f "port 53"`. Ce n'est **pas** requis.

---

### Étape 7 : DHCP - reconnaissance, pas d'émission sauvage

Tu **n'envoies pas** de DHCPDISCOVER sur un LAN d'entreprise. Sur **ton** labo (VM NAT, Raspberry, box à toi) :

BPF : `port 67 or port 68`. Display : `dhcp`.

Champs : `dhcp.option.dhcp` = Discover (1), Offer (2), Request (3), ACK (5).

**Résultat attendu** si tu captures pendant qu'une **machine à toi** demande une lease : quatre messages DORA. Sinon, tu retiens le tableau, sans forcer un renouvellement sur un réseau partagé.

---

### Étape 8 : TLS de laboratoire, clés que tu contrôles

Objectif : un HTTPS **local**, pas un site tiers.

Terminal A (certificat jetable dans `/tmp`, pas dans un dépôt) :

```bash
cd /tmp/lab-analyse-reseau
openssl req -x509 -newkey rsa:2048 -keyout lab-key.pem -out lab-cert.pem \
  -days 1 -nodes -subj "/CN=localhost"
openssl s_server -accept 8443 -cert lab-cert.pem -key lab-key.pem -www
```

Si `openssl s_server` n'existe pas, saute l'étape et retiens le principe.

Terminal B :

```bash
cd /tmp/lab-analyse-reseau
tshark -i lo -p -c 40 -f "tcp port 8443" -w tls-lo.pcapng
```

Terminal C (après "Capturing on") :

```bash
export SSLKEYLOGFILE=/tmp/lab-analyse-reseau/sslkeys.log
curl -k --tlsv1.2 -s -o /dev/null https://127.0.0.1:8443/
```

`-k` : accepte le certificat auto-signé **de ton** serveur. `--tlsv1.2` : si ta version de curl le permet ; sinon laisse négocier.

Sans keylog, lecture :

```bash
tshark -r tls-lo.pcapng -Y "tls.handshake.type == 1"
```

**Résultat attendu** : `Client Hello`. Tu peux aussi voir `tls.handshake.extensions_server_name` selon le client. Les lignes `Application Data` n'affichent pas le HTML.

Avec keylog **si** curl l'a écrit (`wc -l sslkeys.log` non nul) :

```bash
tshark -o tls.keylog_file:/tmp/lab-analyse-reseau/sslkeys.log \
  -r tls-lo.pcapng -Y "http" 
```

**Résultat attendu** : des paquets HTTP apparaissent **après** déchiffrement. Si `sslkeys.log` est vide, ta build de curl n'exporte pas les clés : tu t'arrêtes, tu as déjà vu le handshake. Tu n'installes pas un proxy MITM "pour forcer".

Arrête `openssl s_server` (Ctrl+C). Efface `lab-key.pem` après l'exercice si tu n'en as plus besoin.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark -r f.pcapng -V` | Détail de toutes les couches |
| `tshark -r f.pcapng -Y "arp"` | Trames ARP |
| `tshark -r f.pcapng -Y "icmp.type == 8"` | Echo request IPv4 |
| `tshark -r f.pcapng -Y "http.request"` | Requêtes HTTP claires |
| `tshark -r f.pcapng -Y "tls.handshake.type == 1"` | Client Hello |
| `tshark -o tls.keylog_file:sslkeys.log -r f.pcapng` | Relire en appliquant un keylog |
| `editcap --inject-secrets tls,sslkeys.log in.pcapng out-dsb.pcapng` | Embarquer les secrets dans un pcapng |

---

## Pièges Fréquents

### Piège 1 : Chercher `eth.src` sur loopback

⚠️ **Problème** : Filtre `eth` sur `ping-lo.pcapng` : zéro paquet.

✅ **Solution** : Commence par `frame` et `ip`. Ethernet n'est pas universel. Vérifie le type de lien dans `capinfos` (`Ethernet` vs `Null` vs `Linux cooked`).

---

### Piège 2 : Prendre Application Data TLS pour du HTTP cassé

⚠️ **Problème** : Follow TCP Stream montre `....@!#`. Tu débogues curl.

✅ **Solution** : Regarde le dissector de la liste : `TLS`. C'est chiffré. Diagnostique handshake, alertes, RST. Déchiffre seulement avec **ton** keylog.

---

### Piège 3 : Clé RSA du serveur sur un TLS 1.3

⚠️ **Problème** : Tu configures Preferences → RSA keys, rien ne se déchiffre.

✅ **Solution** : Le wiki TLS : la clé RSA ne marche pas en TLS 1.3 ni avec (EC)DHE. Utilise `SSLKEYLOGFILE`.

---

### Piège 4 : Déchiffrer le navigateur de quelqu'un d'autre

⚠️ **Problème** : Variable d'environnement `SSLKEYLOGFILE` globale sur un poste partagé.

✅ **Solution** : Keylog uniquement dans **ton** terminal, vers un fichier de labo, pour **ton** `curl` / navigateur de test. Jamais un MITM vers un site tiers "pour apprendre".

---

## Checklist de Validation

- [ ] Je lis Frame → Lien → IP → Transport → Application
- [ ] Je reconnais un ARP request (broadcast, opcode 1)
- [ ] Je distingue ICMP echo et TCP SYN
- [ ] Je trouve un GET dans `http-lo.pcapng`
- [ ] Je sais que DNS/DHCP se filtrent par ports BPF `53` / `67`/`68` et par display `dns` / `dhcp`
- [ ] Je liste ce que TLS montre sans clés (handshake, SNI, cert) et ce qu'il cache
- [ ] Je refuse le MITM ; keylog = mes clés, mon labo

---

## Exercice Pratique

**Énoncé** : Remplis le tableau suivant pour **trois** paquets que tu as réellement ouverts (`icmp-echo.pcap` paquet 1, `http-lo.pcapng` un SYN, `http-lo.pcapng` un GET). Pour chaque paquet, note : protocoles dans l'arbre, IP src/dst, ports si TCP/UDP, un champ applicatif ou "aucun".

**Indications** :

- Commande d'aide : `tshark -r fichier -c 1 -V` ou `-Y "http.request" -V -c 1`
- Les IP loopback sont 127.0.0.1 ; le pcap text2pcap utilise 192.0.2.0/24

**Résultat attendu** : trois lignes de tableau, sans payload inventé.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

| Paquet | Protocoles | L3 | L4 | Applicatif |
| ------ | ---------- | -- | -- | ---------- |
| icmp-echo #1 | eth, ip, icmp | 192.0.2.1 → 192.0.2.2 | (ICMP n'a pas de ports TCP) | icmp.type = 8 |
| http-lo SYN | ip, tcp (pas eth souvent) | 127.0.0.1 → 127.0.0.1 | src éphémère, dst 8000, SYN | aucun |
| http-lo GET | ip, tcp, http | 127.0.0.1 → 127.0.0.1 | dst 8000 | `GET /` , Host 127.0.0.1:8000 |

Les numéros de ports source du SYN/GET varient à chaque `curl`. Le port destination 8000 et la méthode GET ne varient pas si tu as suivi le labo.

---

## Navigation

← Fiche précédente : **[Filtres BPF et filtres d'affichage](03-filtres-bpf-et-affichage.md)**

→ Fiche suivante : **[Flux TCP, réassemblage et retransmissions](05-flux-tcp-retransmissions.md)**
