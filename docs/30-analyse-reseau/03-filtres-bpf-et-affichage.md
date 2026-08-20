---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Distinguer filtres de capture BPF (pcap-filter) et filtres d'affichage Wireshark : syntaxes, moment d'usage, piège tcp port 80 versus tcp.port == 80."
estimated_time: "70 min"
fiche_number: 3
total_fiches: 8
cursus: "Analyse réseau"
---

# 03 - Filtres BPF et filtres d'affichage

> **En bref** : Le filtre de capture (BPF) décide ce qui est écrit sur disque ; le filtre d'affichage décide ce qui est montré après dissection. Les deux langages n'ont pas la même syntaxe : `tcp port 80` n'est pas `tcp.port == 80`. Lecture estimée : 70 min.

## Prérequis

- Avoir lu [02 - Installation et capture sûre](02-installation-capture-sure.md)
- Avoir un fichier `/tmp/lab-analyse-reseau/http-lo.pcapng` (sinon refais l'étape HTTP de la fiche 02)
- Distinguer port TCP et protocole applicatif

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire un filtre BPF pour dumpcap/tcpdump/tshark `-f`, écrire un filtre d'affichage pour Wireshark/tshark `-Y`, expliquer pourquoi tu ne les mélanges jamais, et tester tes filtres sur un pcap local.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un filtre de capture BPF ?

**Définition** : Un filtre de capture est une expression **BPF** (Berkeley Packet Filter), compilée par libpcap, appliquée **pendant** la capture. Seuls les paquets qui matchent sont copiés vers le fichier. C'est la même famille de syntaxe que `tcpdump`. Documentation : [pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html), [User's Guide 4.10](https://www.wireshark.org/docs/wsug_html_chunked/ChCapCaptureFilterSection.html), [wiki CaptureFilters](https://wiki.wireshark.org/CaptureFilters).

**Le problème que le BPF résout** :

Sans BPF à la capture :

1. **Volume** : tu enregistres du 1 Gbit/s pour diagnostiquer un DNS.
2. **Secrets hors sujet** : sessions mail, VPN, HTTP d'un autre process.
3. **Drops** : dumpcap n'écrit pas assez vite, Expert Info ment plus tard.

**Comment le BPF résout ces problèmes** :

| Problème | Primitive BPF |
| -------- | ------------- |
| Trop de volume | `port 53`, `tcp port 8000`, `host 127.0.0.1` |
| Secrets hors sujet | `not port 22` (si tu es en SSH distant : le guide Wireshark filtre même tout seul via `SSH_CONNECTION`) |
| Drops | Moins de paquets à copier = moins de pertes d'enregistrement |

**Analogie concrète** : Un tri postal **à l'entrée du centre**. Les sacs "pas pour cette ville" ne rentrent pas dans le camion. Tu ne peux pas "retrouver" une lettre que le tri a rejetée : elle n'est pas dans le camion.

**Ce qu'un filtre BPF n'est PAS** :

- Ce n'est pas un filtre d'affichage. `tcp.port == 80` est **invalide** en BPF.
- Ce n'est pas modifiable au milieu d'une capture déjà lancée. Tu arrêtes, tu changes `-f`, tu relances.
- Ce n'est pas un dissector. BPF lit des offsets (Ethernet, IP, ports). Il ne "comprend" pas HTTP GET, sauf astuces d'octets bruts.

Primitives utiles (libellé officiel pcap-filter) :

| Expression BPF | Signification |
| -------------- | ------------- |
| `host 192.0.2.1` | IPv4/IPv6/ARP dont une adresse est cet hôte |
| `net 192.0.2.0/24` | Réseau CIDR |
| `port 53` | TCP **ou** UDP **ou** SCTP port 53 |
| `tcp port 80` | TCP seulement, port 80 source **ou** destination |
| `udp src port 53` | UDP, port source 53 |
| `icmp` | IPv4 ICMP |
| `icmp6` | ICMPv6 |
| `ip` | IPv4 seulement (exclut ARP, IPv6) |
| `ip6` | IPv6 |
| `ether host 00:11:22:33:44:55` | Adresse MAC |
| `not broadcast and not multicast` | Réduit le bruit de service |
| `tcp[tcpflags] & tcp-syn != 0` | Segment avec flag SYN |

Combinateurs : `and`, `or`, `not` (ou `&&`, `||`, `!`). Parentheses pour grouper. Guillemets autour de l'expression dans le shell : `-f "tcp port 80 and host 127.0.0.1"`.

Exemple officiel du guide Wireshark : `tcp port 23 and host 10.0.0.5`.

---

### Qu'est-ce qu'un filtre d'affichage ?

**Définition** : Un filtre d'affichage (display filter) est une expression du **langage Wireshark**, appliquée **après** dissection, sur des champs nommés (`tcp.port`, `http.request.method`, `dns.qry.name`). Il cache ou montre des paquets **déjà dans le fichier**. Il ne réduit pas ce qui a été capturé. Documentation : [Building Display Filter Expressions](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html), [wireshark-filter(4)](https://www.wireshark.org/docs/man-pages/wireshark-filter.html).

**Le problème que le filtre d'affichage résout** :

Le fichier est déjà là, parfois large, et tu dois :

1. Isoler un flux (`tcp.stream eq 0`).
2. Trouver les retransmissions (`tcp.analysis.retransmission`).
3. Chercher un nom DNS (`dns.qry.name == "example.com"`).
4. Combiner des champs que BPF ne connaît pas (`http.response.code == 404`).

**Comment le filtre d'affichage résout ces problèmes** :

| Besoin | Filtre d'affichage |
| ------ | ------------------ |
| Un protocole | `dns` ou `http` ou `tls` |
| Une IP | `ip.addr == 127.0.0.1` |
| Un port TCP | `tcp.port == 8000` |
| Une méthode HTTP | `http.request.method == "GET"` |
| Un sous-réseau | `ip.addr == 192.0.2.0/24` |
| Plusieurs ports | `tcp.port in {80, 443, 8000}` |
| Négation | `not arp` |
| ET / OU | `dns and ip.src == 127.0.0.1` |

Opérateurs (table 6.6 du guide) : `==` / `eq`, `!=` / `ne`, `>`, `<`, `>=`, `<=`, `contains`, `matches`. Logique : `and` / `&&`, `or`, `not`.

**Analogie concrète** : Tu as **déjà** toutes les factures dans le classeur. Le filtre d'affichage est un post-it "montre seulement les factures électricité > 50 €". Les autres factures sont encore dans le classeur.

**Ce qu'un filtre d'affichage n'est PAS** :

- Ce n'est pas BPF. `tcp port 80` est **invalide** (ou mal compris) comme display filter. Le correct est `tcp.port == 80`.
- Ce n'est pas un moyen de "nettoyer" un pcap pour le partager. Les paquets cachés sont toujours dans le fichier. Pour extraire un sous-ensemble : `tshark -r in.pcapng -Y "http" -w out.pcapng` (écrit seulement ce qui match, plus dépendances de réassemblage selon les options).
- Ce n'est pas un filtre efficace sur une capture live à très haut débit : tshark prévient que `-Y` pendant un live fait plus facilement dropper. Préfère `-f` à la capture.

---

### Pourquoi `tcp port 80` n'est pas `tcp.port == 80` ?

**Définition** : Ce sont deux langages distincts. BPF parle comme tcpdump (`tcp port 80`). Wireshark parle avec des champs pointés (`tcp.port == 80`). Le wiki CaptureFilters le dit en titre : "Capture filter is not a display filter".

**Le problème que cette distinction résout** :

Sans elle, tu copies un filtre du mauvais camp :

1. Tu mets `tcp.port == 80` dans la barre de **capture** : erreur de syntaxe libpcap, capture qui ne démarre pas.
2. Tu mets `tcp port 80` dans la barre d'**affichage** : Wireshark refuse (fond rouge) ou ne fait pas ce que tu crois.
3. Tu filtres `port 80` en BPF en croyant "HTTP uniquement" : tu prends aussi un proxy, ou tu rates HTTP sur 8080.

**Tableau d'équivalence (sens proche, pas une traduction automatique)** :

| Intention | Capture BPF (`-f`) | Affichage (`-Y` / barre Wireshark) |
| --------- | ------------------ | ---------------------------------- |
| TCP port 80 | `tcp port 80` | `tcp.port == 80` |
| UDP ou TCP port 53 | `port 53` | `tcp.port == 53 or udp.port == 53` |
| Hôte 192.0.2.1 | `host 192.0.2.1` | `ip.addr == 192.0.2.1` |
| IPv4 seulement | `ip` | `ip` (protocole IPv4, pas `ip.addr`) |
| HTTP (dissecté) | pas d'équivalent BPF propre (sauf approximation `tcp port 80`) | `http` |
| TLS | `tcp port 443` (approximation par port) | `tls` |
| SYN seulement | `tcp[tcpflags] & (tcp-syn) != 0` | `tcp.flags.syn == 1` |

**Analogie concrète** : L'adresse postale "12 rue de la Gare" n'est pas le GPS "48.87, 2.33". Les deux désignent parfois le même immeuble. Tu ne colles pas des coordonnées GPS sur l'enveloppe.

**Ce que cette équivalence n'est PAS** :

- Ce n'est pas une bijection. `http` n'a pas d'équivalent BPF fiable : HTTP peut être sur 80, 8080, 8000. BPF voit un port. Wireshark voit le dissector.
- `port 80` en BPF matche **source ou destination**, TCP et UDP. `tcp.dstport == 80` est plus étroit.

tshark : `-f` = capture filter, `-Y` = display filter. Si tu omets `-f`/`-Y` et que tu mets des mots après les options, tshark traite ça comme **capture filter** en live, et comme **display filter** si `-r` lit un fichier ([manuel tshark](https://www.wireshark.org/docs/man-pages/tshark.html)). Ce piège est documenté plus bas.

---

### Quand utiliser l'un, l'autre, ou les deux ?

**Définition** : Tu poses le BPF le plus étroit **qui ne te fait pas rater le diagnostic**, tu captures, tu explores ensuite avec des display filters de plus en plus précis.

**Le problème que cette stratégie résout** :

1. BPF trop large : secrets + drops.
2. BPF trop étroit : tu rates le DNS qui explique l'échec HTTP.
3. Display filter seul en live : CPU de dissection, drops.

**Règle de décision** :

| Situation | Outil |
| --------- | ----- |
| Tu sais que le problème est "port 8000 sur lo" | BPF `tcp port 8000` |
| Tu ne sais pas encore si c'est DNS ou TCP | BPF `host 127.0.0.1` puis display `dns or tcp.port == 8000` |
| Fichier déjà capturé | Display seulement |
| Script qui extrait des colonnes | `tshark -r ... -Y ... -T fields -e ...` |
| Capture distante via SSH | BPF qui **exclut** le port SSH (Wireshark peut le faire via `SSH_CONNECTION`) |

**Analogie concrète** : À l'entrée de l'entrepôt tu refuses les palettes "rayon vêtements" (BPF). Dans l'entrepôt tu cherches la boîte "vis 4 mm" (display filter).

**Ce que cette stratégie n'est PAS** :

- Ce n'est pas "toujours capturer tout puis filtrer". Sur un poste personnel de labo, loopback + `-c 20` est petit. Sur un serveur, non.
- Ce n'est pas capturer `tcp port 80` pour du HTTPS : le clair HTTP n'y est pas, et HTTPS n'est plus sur 80.

---

## Étapes Pratiques

Répertoire :

```bash
cd /tmp/lab-analyse-reseau
```

Si `http-lo.pcapng` n'existe pas, refais l'étape HTTP de la fiche 02.

---

### Étape 1 : Un BPF valide, un BPF invalide

```bash
# Valide (syntaxe pcap-filter)
tshark -f "tcp port 8000" -D >/dev/null
dumpcap -f "tcp port 8000" -D >/dev/null
```

Ces commandes listent les interfaces ; elles montrent surtout que libpcap **accepte** l'expression. Pour un rejet explicite :

```bash
tshark -i lo -f "tcp.port == 8000" -c 1 -w /tmp/lab-analyse-reseau/ne-doit-pas-exister.pcapng
```

**Résultat attendu** : message d'erreur libpcap du type `syntax error` / `unexpected '.'` / `illegal token`. Aucun fichier utile. Tu viens de coller un **display filter** dans `-f`.

---

### Étape 2 : Un display filter sur un fichier

```bash
tshark -r http-lo.pcapng -Y "tcp.port == 8000"
tshark -r http-lo.pcapng -Y "http.request"
tshark -r http-lo.pcapng -Y "tcp.port == 8000" -T fields -e frame.number -e ip.src -e tcp.dstport -e _ws.col.info
```

**Résultat attendu** :

- Première commande : handshake SYN/SYN-ACK/ACK + données HTTP.
- Deuxième : seulement les paquets où le dissector HTTP a vu une requête.
- Troisième : colonnes tabulées, port 8000 visible.

Maintenant l'erreur inverse :

```bash
tshark -r http-lo.pcapng -Y "tcp port 8000"
```

**Résultat attendu** : tshark refuse le filtre (syntax error), fond rouge dans l'UI Wireshark. `tcp port 8000` n'est pas du langage d'affichage.

---

### Étape 3 : Comparer `port 8000` (BPF déjà appliqué) et `http` (affichage)

Le fichier `http-lo.pcapng` a été capturé avec `tcp port 8000`. Tous les paquets du fichier concernent déjà ce port. Compare :

```bash
tshark -r http-lo.pcapng -q -z io,stat,0
tshark -r http-lo.pcapng -Y "http" -q -z io,stat,0
```

**Résultat attendu** : le premier total de paquets est **plus grand** que le second. Les SYN/ACK n'ont pas encore de couche HTTP. BPF a gardé tout le TCP 8000. Le display `http` ne garde que ce que le dissector HTTP a classé.

---

### Étape 4 : Filtres d'affichage utiles sur le labo

```bash
tshark -r http-lo.pcapng -Y "tcp.flags.syn == 1"
tshark -r http-lo.pcapng -Y "http.request.method == \"GET\""
tshark -r ping-lo.pcapng -Y "icmp.type == 8"
tshark -r icmp-echo.pcap -Y "eth.addr == 00:0e:b6:00:00:01"
```

**Résultat attendu** :

```text
# SYN : au moins le SYN client, souvent le SYN-ACK (syn==1 aussi)
# GET : une ligne HTTP
# icmp.type 8 : Echo request
# eth.addr : le paquet text2pcap
```

Dans Wireshark GUI : colle `tcp.port == 8000 and http` dans la barre du haut (pas le champ Capture Options). Fond **vert** = syntaxe OK, **rouge** = erreur.

---

### Étape 5 : Membership et champs fréquents

```bash
tshark -r http-lo.pcapng -Y "tcp.port in {8000, 80, 443}"
tshark -r http-lo.pcapng -Y "ip.addr == 127.0.0.1"
tshark -r http-lo.pcapng -Y "frame.len > 60"
```

**Résultat attendu** : les paquets loopback HTTP matchent les trois filtres (sauf si un paquet a une longueur <= 60 ; dans ce cas le troisième est un sous-ensemble).

Référence `in { ... }` : section Membership Operator du [guide d'affichage](https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html).

---

### Étape 6 : Extraire un sous-fichier

```bash
tshark -r http-lo.pcapng -Y "http.request" -w /tmp/lab-analyse-reseau/http-req-only.pcapng
capinfos /tmp/lab-analyse-reseau/http-req-only.pcapng
```

**Résultat attendu** : `Number of packets` plus petit que le fichier d'origine. Tu as **écrit** un nouveau pcap, tu n'as pas "caché" des paquets.

Pour le partage, ce n'est **pas** une anonymisation (fiche [08](08-confidentialite-pcap-et-exercice.md)).

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark -f "tcp port 8000" ...` | Filtre de **capture** BPF |
| `tshark -Y "tcp.port == 8000" -r fichier.pcapng` | Filtre d'**affichage** |
| `tshark -r f.pcapng -Y "http.request"` | Paquets avec une requête HTTP dissectée |
| `tshark -r f.pcapng -Y "dns"` | Paquets DNS |
| `tshark -r f.pcapng -Y "tcp.flags.syn == 1 and tcp.flags.ack == 0"` | SYN seuls (ouverture) |
| `tshark -r f.pcapng -Y "tcp.stream eq 0"` | Premier flux TCP numéroté par Wireshark |
| `dumpcap -f "host 192.0.2.1 and not port 22" -w out.pcapng` | Capture bornée à un hôte, sans SSH |

---

## Pièges Fréquents

### Piège 1 : Coller le mauvais langage

⚠️ **Problème** : Capture Options de Wireshark contient `tcp.port == 80`. La capture refuse de démarrer.

✅ **Solution** : Dans Capture Options : `tcp port 80`. Dans la barre au-dessus de la liste de paquets : `tcp.port == 80`. Même distinction `-f` / `-Y` en tshark.

---

### Piège 2 : Arguments positionnels de tshark

⚠️ **Problème** : `tshark -r http-lo.pcapng tcp port 8000` te surprend. `tshark -i lo tcp.port == 8000` aussi.

✅ **Solution** : Après les options, tshark interprète le reste comme **capture filter** en live, et comme **display filter** si `-r` est présent. Écris toujours `-f` ou `-Y` explicitement. Cite : DESCRIPTION du [manuel tshark](https://www.wireshark.org/docs/man-pages/tshark.html).

---

### Piège 3 : `ip.addr != 127.0.0.1` mal compris

⚠️ **Problème** : Tu veux "pas de loopback". Le filtre `ip.addr != 127.0.0.1` ne fait pas ce que tu crois : un paquet a **deux** `ip.addr` (src et dst). `!=` signifie "toutes les occurrences différentes" depuis Wireshark 3.6. Un paquet 8.8.8.8 → 127.0.0.1 peut rester affiché ou disparaître selon la version et le sens.

✅ **Solution** : Pour exclure un hôte : `not ip.addr == 127.0.0.1`. Relis la note du guide sur `!=` (changement 3.6).

---

### Piège 4 : Croire que `port 80` = HTTP

⚠️ **Problème** : BPF `port 80` sur un serveur qui parle HTTP/2 TLS sur 443 : tu ne captures rien d'utile.

✅ **Solution** : BPF sur le **port réel** (`tcp port 8000` dans ce labo, `tcp port 443` pour HTTPS). HTTP comme protocole = display `http`, après coup, éventuellement après déchiffrement TLS.

---

### Piège 5 : Display filter en capture live chargée

⚠️ **Problème** : `tshark -i eth0 -Y "http"` sur un serveur. Dissection de tout le trafic, drops.

✅ **Solution** : `-f "tcp port 80 or tcp port 443"` à la capture, `-Y "http"` seulement à la lecture du fichier (`-r`).

---

## Checklist de Validation

- [ ] Je cite BPF = capture, display filter = affichage
- [ ] J'écris `tcp port 80` d'un côté et `tcp.port == 80` de l'autre sans les inverser
- [ ] Je sais que `http` n'a pas d'équivalent BPF exact
- [ ] J'ai provoqué volontairement l'erreur `-f "tcp.port == 8000"`
- [ ] J'ai listé des GET avec `-Y "http.request"`
- [ ] Je n'utilise plus d'arguments positionnels de filtre sans `-f`/`-Y`

---

## Exercice Pratique

**Énoncé** : À partir de `http-lo.pcapng` (ou recapture équivalente), écris **quatre** lignes de commandes, chacune avec le **bon** langage, qui font :

1. Relire le fichier en ne montrant que les SYN TCP (ouverture ou SYN-ACK).
2. Relire le fichier en ne montrant que les requêtes HTTP GET.
3. (Re)capturer sur loopback au plus 10 paquets TCP port 8000 (BPF), fichier `ex3.pcapng`.
4. Relire `ex3.pcapng` en extraire les numéros de frame et la méthode HTTP (champ vide si pas HTTP).

**Indications** :

- SYN affichage : `tcp.flags.syn == 1`
- GET : `http.request.method == "GET"`
- Capture : `-f` + `-c` + `-i lo`
- Champs : `-T fields -e frame.number -e http.request.method`

**Résultat attendu** : quatre commandes recopiables, plus une sortie où le GET a un numéro de frame entier.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
cd /tmp/lab-analyse-reseau

# 1. display filter
tshark -r http-lo.pcapng -Y "tcp.flags.syn == 1"

# 2. display filter
tshark -r http-lo.pcapng -Y "http.request.method == \"GET\""

# 3. capture BPF (relance python3 -m http.server 8000 --bind 127.0.0.1 si besoin)
tshark -i lo -p -c 10 -f "tcp port 8000" -w ex3.pcapng
# dans un autre terminal : curl -s -o /dev/null http://127.0.0.1:8000/

# 4. display + champs
tshark -r ex3.pcapng -T fields -e frame.number -e http.request.method
```

**Résultat attendu** (forme, les numéros varient) :

```text
1
2
3 GET
4
5
```

Les lignes sans `GET` sont les paquets TCP sans requête HTTP (handshake, ACK, éventuellement réponse dont le champ méthode est vide). C'est le comportement normal de `-T fields`.

---

## Navigation

← Fiche précédente : **[Installation et capture sûre](02-installation-capture-sure.md)**

→ Fiche suivante : **[Lire les couches d'Ethernet à TLS](04-lire-couches-ethernet-tls.md)**
