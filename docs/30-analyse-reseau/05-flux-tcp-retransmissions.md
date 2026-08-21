---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Suivre un flux TCP, réassembler le flux applicatif, lire retransmissions, fenêtres, timings, conversations, endpoints, IO Graphs et Expert Info."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 8
cursus: "Analyse réseau"
id: "infrastructure.network-analysis.flux-tcp-retransmissions"
course_id: "infrastructure.network-analysis"
content_type: "lesson"
order: 5
---

# 05 - Flux TCP, réassemblage et retransmissions

> **En bref** : Tu isoles un `tcp.stream`, tu reconstitues le dialogue applicatif, puis tu lis les drapeaux d'analyse TCP (retransmission, Dup ACK, fenêtre) et les vues Statistiques / Expert Info. Lecture estimée : 75 min.

## Prérequis

- Avoir lu [04 - Lire les couches d'Ethernet à TLS](04-lire-couches-ethernet-tls.md)
- Avoir `http-lo.pcapng` (fiche 02)
- Connaître SYN, ACK, SEQ, fenêtre ([03 - Protocoles de transport](../20-reseaux/03-protocoles-transport.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras suivre un flux TCP, expliquer un drapeau `tcp.analysis.*`, relier timings et fenêtre à une lenteur, et extraire conversations, endpoints, graphe d'I/O et Expert Info avec Wireshark ou tshark.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Follow TCP Stream et le réassemblage ?

**Définition** : Follow TCP Stream (Analyse → Follow → TCP Stream) applique un filtre d'affichage du type `tcp.stream eq N` et montre les octets applicatifs dans l'ordre du flux, client et serveur distingués. Le réassemblage TCP recolle des segments (y compris out-of-order) pour que HTTP ou TLS voient un buffer continu.

Guides : [Following Protocol Streams](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html) et [TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

**Le problème que Follow Stream résout** :

Sans lui :

1. Tu lis un GET éclaté en deux segments TCP, tu ne vois pas l'URI complète dans un seul paquet.
2. Tu filtres mal `ip.addr and tcp.port` à la main, tu mélange deux conversations qui partagent un port.
3. Tu cherches un mot de passe HTTP dans la liste paquet par paquet.

**Comment Follow Stream résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Payload éclaté | Fenêtre ASCII / raw du stream |
| Plusieurs conversations | Sélecteur Stream 0, 1, 2... (`tcp.stream`) |
| Aller-retour illisible | Couleurs / préfixe : client vs serveur (tshark tabule le serveur) |

tshark équivalent : `tshark -r f.pcapng -q -z follow,tcp,ascii,0`

**Analogie concrète** : Un roman découpé en 40 enveloppes. Follow Stream est relier les pages dans l'ordre, pas lire le tampon postal de chaque enveloppe.

**Ce que Follow Stream n'est PAS** :

- Ce n'est pas une capture. Fermer la fenêtre avec "Close" **laisse** le display filter `tcp.stream eq N`. "Back" le retire. Le guide le dit explicitement.
- Ce n'est pas un déchiffrement TLS. Follow **TLS** Stream n'affiche du clair que si les secrets sont fournis ([wiki TLS](https://wiki.wireshark.org/TLS)).
- Le contenu n'est pas mis à jour pendant une capture live : tu refermes et rouvres le dialogue.

Préférence TCP utile : "Allow subdissector to reassemble TCP streams" (défaut : activé).

---

### Qu'est-ce que l'analyse TCP de Wireshark (`tcp.analysis`) ?

**Définition** : Le dissector TCP maintient, pour chaque session, le prochain numéro de séquence attendu. Il pose des drapeaux sous `SEQ/ACK analysis` quand un paquet sort du scénario simple. Préférence : `Analyze TCP sequence numbers`. Documentation officielle : [7.5 TCP Analysis](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html).

**Le problème que cette analyse résout** :

Sans elle tu dois comparer à la main seq/ack/len sur des milliers de lignes. Avec elle, tu filtres `tcp.analysis.flags` et tu vas aux anomalies.

**Drapeaux à connaître (libellés officiels, conditions résumées)** :

| Drapeau | Filtre | Signification opérationnelle |
| ------- | ------ | ---------------------------- |
| Retransmission | `tcp.analysis.retransmission` | Segment déjà vu / seq en retard, sans coller aux critères "fast" / "spurious" / "ooo" |
| Fast Retransmission | `tcp.analysis.fast_retransmission` | Retransmission après Dup ACKs (ou saut > 2 MSS) très tôt (< 20 ms après le dernier ACK) |
| Out-Of-Order | `tcp.analysis.out_of_order` | Seq en retard mais arrivée dans le seuil RTT (iRTT ou 3 ms par défaut) |
| Previous segment not captured | `tcp.analysis.lost_segment` | Seq **en avance** : un morceau manque dans **le fichier** |
| Dup ACK | `tcp.analysis.duplicate_ack` | ACK répété, segment vide, fenêtre inchangée (souvent perte perçue) |
| Spurious Retransmission | `tcp.analysis.spurious_retransmission` | Retransmission de données **déjà** ACK côté analyse |
| ZeroWindow | `tcp.analysis.zero_window` | Fenêtre récepteur = 0 (pas SYN/FIN/RST) |
| Window Full | `tcp.analysis.window_full` | L'émetteur remplit la fenêtre annoncée |
| Keep-Alive | `tcp.analysis.keep_alive` | Sondes de connexion, seq = next-1 |
| ACKed unseen segment | `tcp.analysis.ack_lost_segment` | ACK d'octets que **la capture** n'a pas vus |
| Port numbers reused | `tcp.analysis.reused_ports` | Nouveau SYN, mêmes 4-uplets, autre ISN |

**Analogie concrète** : Un rapporteur de séance qui note "phrase répétée", "page manquante dans **mon** cahier", "l'autre a dit stop j'ai trop de travail" (`ZeroWindow`). "Page manquante dans mon cahier" n'est pas "la phrase n'a jamais été dite".

**Ce que `tcp.analysis` n'est PAS** :

- Ce n'est pas la vérité réseau à 100 %. Le guide Expert Info : c'est un **indice**, pas un verdict. "Previous segment not captured" = souvent **ta** capture incomplète.
- Ce n'est pas applicable si tu désactives `Analyze TCP sequence numbers`.
- Fast Retransmission **remplace** Out-Of-Order et Retransmission quand ses conditions sont vraies (ordre de précédence du guide).

Filtre pratique : `tcp.analysis.flags` (au moins un drapeau). Complétude d'une conversation : `tcp.completeness` (bits SYN=1, SYN-ACK=2, ACK=4, DATA=8, FIN=16, RST=32). Exemple officiel : handshake seul = `tcp.completeness==7`.

---

### Que sont les timings, la fenêtre et la latence dans un pcap ?

**Définition** : Chaque paquet a un horodatage. Wireshark calcule des deltas (`frame.time_delta`, `tcp.time_delta`), un RTT initial (`tcp.analysis.initial_rtt`, iRTT) et suit la **fenêtre** d'émission (`tcp.window_size`). La latence applicative se lit comme le temps entre une requête (GET) et la réponse (HTTP 200), pas comme le seul ping ICMP.

**Le problème que ces champs résolvent** :

1. "C'est lent" sans savoir si c'est le réseau (RTT), le serveur (temps jusqu'au premier octet), ou la fenêtre (récepteur saturé).
2. Confondre 200 ms de RTT transatlantique avec une retransmission locale.

**Comment tu mesures** :

| Question | Où regarder |
| -------- | ----------- |
| RTT du handshake | iRTT sous SEQ/ACK analysis, ou delta SYN → SYN-ACK |
| Temps entre paquets | View → Time Display Format → Seconds Since Previous Displayed Packet |
| Récepteur saturé | `tcp.analysis.zero_window` puis `tcp.analysis.window_update` |
| Perte | Retransmissions + Dup ACK, pas seulement un "trou" visuel |
| Débit | Statistics → I/O Graphs (paquets/s ou bits/s) |

**Analogie concrète** : Un péage. Le RTT est l'aller-retour voiture. La fenêtre est le nombre de tickets que le péage accepte d'un coup. `ZeroWindow` = barrière fermée, plus de tickets. Une retransmission = tu renvoies un ticket déjà parti, parce que l'accusé n'est pas revenu.

**Ce que ces timings ne sont PAS** :

- L'horodatage n'est pas plus précis que l'horloge de la machine de capture.
- iRTT n'est pas le RTT applicatif HTTP (il peut manquer si le handshake n'est pas dans le fichier).
- Une capture avec snaplen courte fausse parfois l'analyse de longueur de segment.

---

### Que sont Conversations, Endpoints, I/O Graphs et Expert Info ?

**Définition** : Ce sont des vues **agrégées** sur tout le fichier (ou le display filter courant).

- **Conversations** : paires d'extrémités (Ethernet, IP, TCP, UDP...). Pour TCP : 4-uplet, paquets/octets dans chaque sens, début, durée. Menu Statistics → Conversations. tshark : `-z conv,tcp`.
- **Endpoints** : une ligne par adresse (combien de paquets **impliquant** cette IP). tshark : `-z endpoints,ip`.
- **I/O Graphs** : courbe volume / temps. Tu peux superposer `tcp.analysis.retransmission`. tshark : `-z io,stat,1` (tranches de 1 s).
- **Expert Info** : anomalies classées Chat / Note / Warn / Error. Menu Analyze → Expert Information. tshark : `-z expert`. Le guide [7.4](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvExpert.html) : présence d'expert ≠ preuve de panne ; absence ≠ santé garantie.

**Le problème que ces vues résolvent** :

La liste de paquets ne répond pas à "qui parle le plus ?" ni à "à 14:32 le débit s'effondre-t-il ?".

**Comment tu t'en sers dans un diagnostic** :

| Question | Vue |
| -------- | --- |
| Quel flux TCP est le plus gros ? | Conversations → TCP, tri par bytes |
| Combien d'IPs distinctes ? | Endpoints → IPv4 |
| Pic de trafic à un instant | I/O Graphs |
| Y a-t-il des checksums / retransmissions / HTTP 404 ? | Expert Info |

**Analogie concrète** : Conversations = liste des appels téléphoniques (qui avec qui, combien de minutes). Endpoints = qui a décroché le plus souvent. I/O Graph = consommation électrique minute par minute. Expert Info = voyants du tableau de bord, à vérifier avant d'ouvrir le moteur.

**Ce que ces vues ne sont PAS** :

- Conversations n'est pas Follow Stream : pas de payload recollé.
- `-z` de tshark ignore le display filter **principal** ; beaucoup d'options `-z` ont leur **propre** filtre optionnel ([manuel tshark](https://www.wireshark.org/docs/man-pages/tshark.html)).
- Expert "Chat" (SYN) n'est pas une erreur.

---

## Étapes Pratiques

```bash
cd /tmp/lab-analyse-reseau
```

---

### Étape 1 : Identifier le numéro de stream

```bash
tshark -r http-lo.pcapng -T fields -e tcp.stream -e ip.src -e tcp.srcport -e ip.dst -e tcp.dstport | sort | uniq
```

**Résultat attendu** : une seule valeur de stream (souvent `0`) pour le curl vers 8000. Si tu as relancé curl plusieurs fois dans le même fichier, tu auras 0, 1, 2...

Dans Wireshark : clic droit sur un paquet TCP → Follow → TCP Stream. Vérifie le filtre sous la liste : `tcp.stream eq 0`.

---

### Étape 2 : Follow Stream en tshark

```bash
tshark -r http-lo.pcapng -q -z follow,tcp,ascii,0
```

**Résultat attendu** (extrait) :

```text
GET / HTTP/1.1
Host: 127.0.0.1:8000
...
HTTP/1.0 200 OK
...
```

Le texte du serveur est indenté par une tabulation (doc Follow Stream tshark). Tu viens de réassembler le dialogue HTTP.

Si le stream n'est pas 0, remplace le dernier argument.

---

### Étape 3 : Handshake, iRTT, fenêtre

```bash
tshark -r http-lo.pcapng -Y "tcp.flags.syn == 1" -T fields \
  -e frame.number -e frame.time_relative -e tcp.flags.str -e tcp.window_size
```

Sur le premier paquet de données ou un ACK post-handshake :

```bash
tshark -r http-lo.pcapng -Y "tcp.analysis.initial_rtt" -T fields \
  -e frame.number -e tcp.analysis.initial_rtt
```

**Résultat attendu** : un iRTT très petit (loopback, souvent < 1 ms). Sur un WAN, tu verrais 20-200 ms. Ici tu calibres l'outil, tu ne diagnostiques pas Internet.

---

### Étape 4 : Provoquer un RST (port fermé) et le lire

Aucun serveur sur 8001 :

```bash
tshark -i lo -p -c 4 -f "tcp port 8001" -w rst-lo.pcapng
```

Autre terminal :

```bash
python3 -c 'import socket; s=socket.socket(); s.settimeout(1); s.connect(("127.0.0.1", 8001))'
```

La connexion échoue (Connection refused). Puis :

```bash
tshark -r rst-lo.pcapng
tshark -r rst-lo.pcapng -Y "tcp.flags.reset == 1"
```

**Résultat attendu** : SYN, puis RST (ou SYN-ACK absent + RST). Expert Info : séquence / reset. Ce n'est **pas** une retransmission. C'est un refus local, vérifiable.

---

### Étape 5 : Conversations, endpoints, I/O, expert

```bash
tshark -r http-lo.pcapng -q -z conv,tcp
tshark -r http-lo.pcapng -q -z endpoints,ip
tshark -r http-lo.pcapng -q -z io,stat,1
tshark -r http-lo.pcapng -q -z expert
```

**Résultat attendu** :

- `conv,tcp` : une ligne 127.0.0.1:éphémère ↔ 127.0.0.1:8000, frames/bytes > 0, duration courte.
- `endpoints,ip` : 127.0.0.1 avec tout le trafic.
- `io,stat,1` : intervalle 1 s, un pic unique.
- `expert` : éventuellement Chat (SYN). Pas d'Error obligatoire.

Dans l'UI :

1. Statistics → Conversations → onglet TCP.
2. Statistics → Endpoints → IPv4.
3. Statistics → I/O Graphs : série par défaut, plus une série display filter `tcp.analysis.retransmission`.
4. Analyze → Expert Information.

---

### Étape 6 : Filtrer les drapeaux d'analyse

```bash
tshark -r http-lo.pcapng -Y "tcp.analysis.flags"
tshark -r rst-lo.pcapng -Y "tcp.analysis.flags"
```

**Résultat attendu** : loopback HTTP propre = souvent **zéro** ligne. RST = pas forcément un `tcp.analysis.retransmission`. Pour voir une retransmission **sans** pcap malware, tu n'en fabriques pas une artificielle compliquée : tu retiens le filtre, et tu sais que "Previous segment not captured" apparaîtra si tu ouvres un pcap **coupé** (`editcap -A/-B` ou capture démarrée trop tard).

Démonstration "segment manquant dans le fichier" :

```bash
# garde seulement les paquets 3 à 9999 : on enlève le début du handshake
editcap -r http-lo.pcapng http-coupe.pcapng 3-9999
tshark -r http-coupe.pcapng -Y "tcp.analysis.lost_segment or tcp.analysis.ack_lost_segment"
```

**Résultat attendu** : au moins un drapeau "unseen" / "lost_segment", **alors que** le réseau loopback n'a perdu personne. Preuve que l'analyse lit **le fichier**, pas la vérité physique.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark -r f.pcapng -q -z follow,tcp,ascii,0` | Reconstitue le stream TCP 0 |
| `tshark -r f.pcapng -Y "tcp.stream eq 0"` | Liste les paquets de ce stream |
| `tshark -r f.pcapng -Y "tcp.analysis.retransmission"` | Retransmissions |
| `tshark -r f.pcapng -Y "tcp.analysis.zero_window"` | Fenêtre à zéro |
| `tshark -r f.pcapng -q -z conv,tcp` | Table des conversations TCP |
| `tshark -r f.pcapng -q -z endpoints,ip` | Table des endpoints IP |
| `tshark -r f.pcapng -q -z io,stat,1` | Volume par seconde |
| `tshark -r f.pcapng -q -z expert` | Expert Info |

---

## Pièges Fréquents

### Piège 1 : Accuser le WAN pour "Previous segment not captured"

⚠️ **Problème** : Expert Warn, tu ouvres un ticket transitoire opérateur.

✅ **Solution** : Vérifie d'abord si le handshake est **dans** le fichier, si dumpcap a droppé, si tu as utilisé `editcap` / un BPF trop tardif. Étape 6 de cette fiche.

---

### Piège 2 : Oublier que Close laisse le filtre stream

⚠️ **Problème** : Après Follow Stream, "il n'y a plus que 12 paquets, le réseau est mort".

✅ **Solution** : Regarde la barre de display filter. Efface `tcp.stream eq N` ou clique Back.

---

### Piège 3 : Confondre Out-Of-Order et Retransmission

⚠️ **Problème** : Deux chemins (Wi-Fi + Ethernet, ou load-balancing) livrent un seq en retard **vite** : Out-Of-Order. Tu parles de perte.

✅ **Solution** : Lis le drapeau exact. OOO : seuil iRTT / 3 ms. Retransmission : seq en retard hors de ce cas. Fast Retransmission a la priorité sur les deux ([guide 7.5](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvTCPAnalysis.html)).

---

### Piège 4 : I/O Graph vide parce que l'unité est mal choisie

⚠️ **Problème** : Capture de 4 paquets loopback, graphe en Mbit/s, courbe plate.

✅ **Solution** : Passe en paquets/s ou bits/s, intervalle 1 ms / 10 ms sur un labo court. tshark `io,stat,0.001` pour un fichier très court.

---

## Checklist de Validation

- [ ] Je récupère `tcp.stream` et je relis le GET en ASCII
- [ ] Je cite au moins retransmission, Dup ACK, lost_segment, zero_window
- [ ] Je distingue perte réseau et capture coupée
- [ ] Je lis iRTT sur le labo loopback
- [ ] Je produis conv/endpoints/io/expert en tshark
- [ ] Je reconnais un RST de port fermé

---

## Exercice Pratique

**Énoncé** : À partir de `http-lo.pcapng` et `rst-lo.pcapng` (recrée-les si besoin), réponds par des **valeurs mesurées** :

1. Nombre de conversations TCP dans `http-lo.pcapng`.
2. Contenu de la première ligne du Follow Stream 0 (doit commencer par `GET`).
3. Y a-t-il `tcp.analysis.retransmission` dans `http-lo.pcapng` (oui/non + commande) ?
4. Nombre de paquets RST dans `rst-lo.pcapng`.
5. Après `editcap -r http-lo.pcapng coupe.pcapng 4-9999`, le filtre `tcp.analysis.flags` est-il vide ?

**Indications** :

- Question 1 : `-z conv,tcp` et `-q`
- Question 2 : `-z follow,tcp,ascii,0`
- Question 5 : si le fichier a moins de 4 paquets, coupe plus tôt (`2-9999`)

**Résultat attendu** : cinq réponses chiffrées ou oui/non, reproductibles sur ta machine.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
cd /tmp/lab-analyse-reseau
tshark -r http-lo.pcapng -q -z conv,tcp
tshark -r http-lo.pcapng -q -z follow,tcp,ascii,0 | head
tshark -r http-lo.pcapng -Y "tcp.analysis.retransmission"
tshark -r rst-lo.pcapng -Y "tcp.flags.reset == 1"
editcap -r http-lo.pcapng coupe.pcapng 4-9999
tshark -r coupe.pcapng -Y "tcp.analysis.flags"
```

Réponses typiques (un curl unique, un connect refusé unique) :

1. **1** conversation TCP (parfois 1 ligne plus l'en-tête du tableau).
2. `GET / HTTP/1.1`
3. **non** (aucune ligne) sur un loopback sain.
4. **au moins 1** RST.
5. **non, le filtre n'est pas vide** : tu as créé un "lost" / "unseen" artificiel. Si encore vide, le fichier d'origine avait très peu de paquets : coupe dès le paquet 2.

---

## Navigation

← Fiche précédente : **[Lire les couches d'Ethernet à TLS](04-lire-couches-ethernet-tls.md)**

→ Fiche suivante : **[tshark et automatisation](06-tshark-automatisation.md)**
