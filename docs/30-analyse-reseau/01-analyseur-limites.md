---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "Rôle et limites d'un analyseur de protocoles : capture, dissection, formats pcap/pcapng, famille Wireshark, ce qu'un analyseur ne peut pas voir."
estimated_time: "50 min"
fiche_number: 1
total_fiches: 8
cursus: "Analyse réseau"
id: "infrastructure.network-analysis.analyseur-limites"
course_id: "infrastructure.network-analysis"
content_type: "lesson"
order: 1
---

# 01 - Analyseur de protocoles et limites

> **En bref** : Un analyseur de protocoles enregistre des trames, les découpe en champs et t'aide à lire ce qui a réellement transité, mais il ne voit pas tout : commutation, chiffrement, droits et captures incomplètes posent des limites nettes. Lecture estimée : 50 min.

## Prérequis

- Avoir lu [03 - Protocoles de transport](../20-reseaux/03-protocoles-transport.md) (TCP, UDP, ports, handshake)
- Avoir lu [10 - Diagnostic et outils](../20-reseaux/10-diagnostic-outils.md) (ping, ss, tcpdump, nmap, dig)
- Savoir ouvrir un terminal et lire une commande `sudo`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est un analyseur de protocoles, citer ses limites techniques et juridiques, distinguer pcap et pcapng, et choisir entre dumpcap, tshark et Wireshark selon la tâche.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un analyseur de protocoles ?

**Définition** : Un analyseur de protocoles (packet analyzer) est un logiciel qui copie des trames réseau, les enregistre dans un fichier, puis les découpe champ par champ (Ethernet, IP, TCP, DNS, HTTP, TLS, etc.) pour que tu puisses les lire.

**Le problème que l'analyseur résout** :

Sans analyseur, voici les problèmes rencontrés :

1. **Boîte noire** : une application échoue, les logs métier sont vides, tu ne sais pas si un paquet est parti, arrivé, refusé ou répondu.
2. **Hypothèses non vérifiées** : tu supposes un timeout DNS, un reset TCP ou un certificat TLS, sans preuve.
3. **Problèmes intermittents** : l'incident dure 2 secondes. Sans enregistrement, il n'existe plus.

**Comment l'analyseur résout ces problèmes** :

| Problème | Solution apportée par l'analyseur |
| -------- | --------------------------------- |
| Boîte noire | Copie brute des octets qui ont transité sur l'interface |
| Hypothèses non vérifiées | Dissection : chaque champ a un nom, une valeur et un numéro de RFC |
| Problèmes intermittents | Fichier pcap/pcapng relisible plus tard, hors de la crise |

**Analogie concrète** : Pense à un enregistreur de caisse. La caisse affiche "paiement refusé". L'enregistreur garde le ticket : heure, montant, code d'erreur, carte utilisée. Tu ne devines plus, tu lis le ticket. L'analyseur fait la même chose pour les paquets.

**Ce qu'un analyseur n'est PAS** :

- Un analyseur n'est pas un IDS. Il n'émet pas d'alerte automatique "attaque en cours". Il montre des paquets. C'est toi qui interprètes.
- Un analyseur n'est pas un proxy ni un MITM. Il n'altère pas le trafic. Il le copie (sur l'interface où il a le droit de lire).
- Un analyseur n'est pas un sniffer magique du réseau entier. Sur un commutateur Ethernet, tu vois surtout le trafic de ta machine, plus le broadcast/multicast, sauf miroir de port (SPAN) autorisé.

Documentation de référence : [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/).

---

### Qu'est-ce qu'une capture incomplète ?

**Définition** : Une capture est incomplète quand le fichier ne contient pas tous les paquets qui ont réellement circulé, ou quand chaque paquet est tronqué (snapshot length trop courte).

**Le problème que cette notion résout** :

Sans cette notion, tu conclus à tort :

1. **Faux "le serveur n'a pas répondu"** : le SYN-ACK a existé, dumpcap l'a perdu (buffer plein, CPU saturé, filtre trop tardif).
2. **Faux "payload vide"** : tu as demandé 64 octets par paquet (`-s 64`). Le HTTP est plus loin dans la trame.
3. **Faux diagnostic de retransmission** : Wireshark marque "Previous segment not captured" parce que **toi** tu as loupé le segment, pas parce que le réseau l'a perdu.

**Comment cette notion résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Paquets manquants | Vérifier les compteurs "dropped" de dumpcap/tshark, réduire le volume (filtre BPF, `-c`, ring buffer) |
| Paquets tronqués | Capturer la longueur complète (snapshot length 0 / 262144, valeur par défaut de tshark) |
| Confusion perte réelle / perte de capture | Croiser avec `ss`, logs applicatifs, et le message Expert "Previous segment not captured" |

**Analogie concrète** : Filmer un match avec un téléphone qui rame. Tu ne vois pas le but. Ce n'est pas que le but n'a pas eu lieu : c'est que ta caméra a sauté des images. Un pcap "dropped" est cette caméra.

**Ce qu'une capture incomplète n'est PAS** :

- Ce n'est pas la même chose qu'une perte réseau (drop routeur, file d'attente pleine, Wi-Fi). La perte réseau se voit aussi chez les deux extrémités (retransmissions des deux côtés).
- Ce n'est pas un bug de dissection. Un dissector peut mal nommer un champ même si tous les octets sont là.

---

### Quelles sont les limites d'un analyseur ?

**Définition** : Les limites sont les situations où l'analyseur ne peut pas te donner le contenu utile, même s'il tourne correctement : trafic invisible, trafic chiffré, trafic hors de ton droit, trafic trop volumineux.

**Le problème que ces limites résolvent** (quand tu les connais) :

Sans les connaître, voici les erreurs fréquentes :

1. **Attendre du clair HTTP sur le port 443** : tu ouvres "Follow TCP Stream" et tu vois du binaire. TLS a fait son travail.
2. **Capturer sur un laptop en Wi-Fi et "ne rien voir" du voisin** : le point d'accès et le chiffrement 802.11 isolent les stations. Ce n'est pas un échec de Wireshark.
3. **Lancer Wireshark en production sans filtre** : le disque se remplit, la machine rame, tu perds des paquets, tu as aussi copié des secrets (cookies, Authorization, mots de passe).

**Comment ces limites se traduisent** :

| Limite | Ce que tu vois encore | Ce que tu ne vois pas |
| ------ | --------------------- | --------------------- |
| TLS 1.2/1.3 sans secrets | Handshake, SNI souvent, certificats, ports, timings | Corps HTTP, cookies, JSON |
| Commutateur sans SPAN | Trafic de ta NIC, broadcast, multicast | Unicast entre deux autres machines |
| VPN / overlay | Paquets encapsulés (souvent UDP 51820, 1194, ESP) | Le flux interne tant que tu n'es pas dans le tunnel |
| Promiscuous mode refusé | Trafic adressé à ta machine | Trames destinées à d'autres MAC sur le même segment |
| Pas d'autorisation | Rien d'exploitable en justice ni en interne | Tout capture hors mandat est un risque légal |

**Analogie concrète** : Tu as le droit d'ouvrir **ton** courrier. Un analyseur est l'équivalent d'ouvrir les enveloppes qui passent par **ta** boîte. Ouvrir le courrier des voisins, ou lire une lettre déjà mise sous pli opaque (TLS), dépasse l'outil.

**Ce que ces limites ne sont PAS** :

- Ce n'est pas une excuse pour arrêter le diagnostic. Timings, retransmissions, resets, codes DNS, échec de handshake TLS restent visibles sans déchiffrer.
- Ce n'est pas une invitation à installer un MITM. Le déchiffrement légitime se fait avec des clés **que tu contrôles** (`SSLKEYLOGFILE`, laboratoire). Fiche [04](04-lire-couches-ethernet-tls.md) et [08](08-confidentialite-pcap-et-exercice.md).

---

### Qu'est-ce que pcap et pcapng ?

**Définition** : `pcap` (libpcap) est un format de fichier historique : une en-tête globale, puis des paquets (horodatage + octets). `pcapng` (successeur de pcap) est le format natif actuel de Wireshark et tshark : plusieurs interfaces, commentaires, blocs de secrets TLS (DSB), options plus riches.

**Le problème que ces formats résolvent** :

Sans format d'enregistrement, tu ne pourrais pas :

1. Relire le trafic après coup.
2. Passer un fichier de tcpdump vers Wireshark.
3. Joindre des métadonnées (nom d'interface, secrets de session TLS) au fichier.

**Comment pcap et pcapng se comparent** :

| pcap | pcapng |
| ---- | ------ |
| Une interface par fichier (en pratique) | Plusieurs interfaces dans un fichier |
| Simple, lu partout (tcpdump, tshark, Wireshark) | Format par défaut de tshark `-w` |
| Pas de bloc de secrets TLS intégré | Peut embarquer un Decryption Secrets Block (`editcap --inject-secrets`) |
| Extension fréquente `.pcap` / `.cap` | Extension fréquente `.pcapng` |

**Analogie concrète** : pcap est une cassette audio une piste. pcapng est une bande multi-pistes avec une feuille de notes collée (commentaires, secrets, plusieurs micros).

**Ce que pcap/pcapng n'est PAS** :

- Ce n'est pas un format "anonyme". Le fichier contient des adresses MAC, IP, payloads. Le traiter comme un log applicatif anodin est une erreur (fiche [08](08-confidentialite-pcap-et-exercice.md)).
- Ce n'est pas un exécutable. Ouvrir un pcap dans Wireshark n'exécute pas le trafic. En revanche, un pcap **malveillant** peut faire planter un dissector : tu n'en télécharges pas au hasard.

Référence tshark : le format d'écriture par défaut est pcapng ([manuel tshark](https://www.wireshark.org/docs/man-pages/tshark.html)).

---

### Que font dumpcap, tshark et Wireshark ?

**Définition** : Ce sont trois programmes de la même famille. `dumpcap` capture. `tshark` capture et dissecte en ligne de commande. `Wireshark` est l'interface graphique. Wireshark et tshark lancent dumpcap pour la capture live.

**Le problème que cette séparation résout** :

Sans séparation des rôles :

1. Tu lancerais toute l'interface graphique en root pour lire une interface. La surface d'attaque serait énorme.
2. Tu n'aurais pas d'outil léger pour un serveur sans écran.
3. Tu mélangerais capture (volume, privilèges) et analyse (CPU, dissecteurs).

**Comment la famille se répartit le travail** :

| Outil | Rôle | Quand l'utiliser |
| ----- | ---- | ---------------- |
| `dumpcap` | Capture brute vers un fichier | Production, long enregistrement, privilèges minimaux |
| `tshark` | Capture ou lecture + dissection CLI, filtres, statistiques | Scripts, serveurs, validation reproductible |
| `Wireshark` | Lecture graphique, Follow Stream, IO Graphs, Expert Info | Analyse humaine d'un fichier déjà capturé |
| `tcpdump` | Capture CLI via libpcap, hors famille Wireshark | Serveur minimal, même syntaxe BPF |

**Analogie concrète** : dumpcap est le micro. tshark est le micro plus une table de mixage en ligne de commande. Wireshark est le studio avec écrans. tcpdump est un autre micro, compatible sur le format de bande.

**Ce que cette famille n'est PAS** :

- Ce n'est pas un seul binaire. Si `dumpcap` n'a pas les capacités `cap_net_raw` / `cap_net_admin` (Linux) ou l'accès aux `/dev/bpf*` (macOS), l'interface graphique n'affichera pas d'interfaces, même ouverte.
- Ce n'est pas un outil offensif. Capturer sans autorisation reste illégal, quel que soit le programme.

Privilèges : [CaptureSetup/CapturePrivileges](https://wiki.wireshark.org/CaptureSetup/CapturePrivileges). Détail d'installation : fiche [02](02-installation-capture-sure.md).

---

## Étapes Pratiques

### Étape 1 : Vérifier que les binaires existent

Tu ne captures pas encore. Tu constates la présence des outils.

```bash
command -v dumpcap
command -v tshark
command -v wireshark
command -v tcpdump
command -v text2pcap
command -v capinfos
command -v editcap
```

**Résultat attendu** :

```text
/usr/bin/dumpcap
/usr/bin/tshark
/usr/bin/wireshark
/usr/bin/tcpdump
/usr/bin/text2pcap
/usr/bin/capinfos
/usr/bin/editcap
```

Les chemins varient (`/usr/local/bin`, `/opt/homebrew/bin`, `/Applications/Wireshark.app/Contents/MacOS/`). Si `command -v` n'affiche rien pour un outil, il n'est pas dans le `PATH`. L'installation est dans la fiche [02](02-installation-capture-sure.md).

---

### Étape 2 : Lire la version, sans capturer

```bash
tshark --version | head -n 5
dumpcap --version | head -n 3
```

**Résultat attendu** (exemple, ta version sera différente) :

```text
TShark (Wireshark) 4.4.x
...
Dumpcap (Wireshark) 4.4.x
```

Tu confirmes que tshark et dumpcap appartiennent à la même installation. Un mélange de versions (paquet distro + binaire local) produit des erreurs de plugins obscures.

---

### Étape 3 : Distinguer "lister les interfaces" et "capturer"

```bash
tshark -D
```

**Résultat attendu** (exemple Linux) :

```text
1. eth0
2. wlan0
3. lo
4. any
5. bluetooth0
```

Sur macOS, tu verras plutôt `en0`, `lo0`, et tu n'auras souvent **pas** d'interface `any`.

Si la commande affiche `The user doesn't have permission to capture on that device` ou une liste vide, tu n'as pas les privilèges de capture. Ce n'est pas une panne réseau. Suite : fiche [02](02-installation-capture-sure.md).

Tu t'arrêtes ici : tu n'as pas encore lancé `-i` avec `-w`.

---

### Étape 4 : Classer un incident dans les limites

Prends cette situation écrite (pas de capture) :

> Un collègue dit : "Wireshark sur mon PC ne montre pas le HTTP du serveur de fichier entre l'imprimante et le NAS. Donc le NAS n'envoie rien."

Réponds par écrit avec trois questions :

1. Sur quel équipement l'analyseur est-il branché ?
2. Le flux est-il unicast entre deux autres MAC ?
3. Le service est-il en TLS (port 443, SMB chiffré, etc.) ?

**Résultat attendu** :

```text
1. PC du collègue = un hôte du LAN, pas un SPAN du commutateur.
2. Unicast NAS <-> imprimante : invisible sans miroir de port.
3. Même visible, le payload peut être chiffré. Conclusion "le NAS n'envoie rien" n'est pas soutenue.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark --version` | Affiche la version de tshark |
| `dumpcap --version` | Affiche la version de dumpcap |
| `tshark -D` | Liste les interfaces visibles par tshark |
| `dumpcap -D` | Liste les interfaces visibles par dumpcap |
| `command -v tshark` | Indique si tshark est dans le `PATH` |
| `capinfos fichier.pcapng` | Résumé d'un fichier déjà capturé (nombre de paquets, durée) |

---

## Pièges Fréquents

### Piège 1 : Croire que Wireshark voit tout le LAN

⚠️ **Problème** : Tu captures sur l'interface Wi-Fi de ton ordinateur et tu t'attends à voir toutes les conversations du bâtiment.

✅ **Solution** : Sur un réseau commuté ou Wi-Fi d'infrastructure, tu vois le trafic de **ta** station, plus une partie du broadcast. Pour voir un unicast entre deux autres machines, il te faut un miroir de port sur un équipement que tu administres, ou capturer **sur** l'une des deux machines, avec autorisation.

---

### Piège 2 : Confondre "pas de payload lisible" et "pas de trafic"

⚠️ **Problème** : Follow TCP Stream affiche du binaire. Tu conclus que la capture a échoué.

✅ **Solution** : Vérifie le dissector : si tu vois `TLS` / `Client Hello` / `Application Data`, la capture a réussi. Le contenu applicatif est chiffré. Tu peux quand même mesurer RTT, resets, certificats, SNI.

---

### Piège 3 : Analyser un pcap comme s'il était complet

⚠️ **Problème** : Expert Info affiche "Previous segment not captured". Tu accuses le WAN.

✅ **Solution** : D'abord regarder si dumpcap a droppé (`Packets dropped`). Ensuite seulement parler de perte réseau. Une capture trop large, sans BPF, sur une interface chargée, droppe.

---

### Piège 4 : Lancer l'interface graphique en root

⚠️ **Problème** : `sudo wireshark` "parce que sinon je ne vois pas les interfaces".

✅ **Solution** : Donner les privilèges à **dumpcap** (groupe `wireshark` + capabilities Linux, ChmodBPF macOS). L'interface graphique reste un utilisateur normal. Voir [CapturePrivileges](https://wiki.wireshark.org/CaptureSetup/CapturePrivileges).

---

## Checklist de Validation

- [ ] Je sais définir un analyseur de protocoles en une phrase
- [ ] Je cite au moins trois limites : commutation, chiffrement, capture incomplète
- [ ] Je distingue pcap et pcapng
- [ ] Je sais à quoi servent dumpcap, tshark et Wireshark
- [ ] Je n'identifie pas Wireshark à un IDS ni à un MITM
- [ ] Je refuse de capturer sans autorisation, même "pour voir"

---

## Exercice Pratique

**Énoncé** : Pour chacune des six situations, indique si un analyseur sur **ton** PC (interface locale, pas de SPAN) peut (A) voir les en-têtes utiles, (B) voir le payload en clair, (C) ne pas voir le flux. Une seule lettre.

1. `curl http://127.0.0.1:8000/` lancé sur le même PC, capture sur `lo`.
2. Navigation HTTPS vers un site public, capture sur `en0`/`eth0`, **sans** `SSLKEYLOGFILE`.
3. Copie de fichier SMB entre un NAS et un autre PC du LAN.
4. Requête DNS UDP depuis ton PC vers le résolveur.
5. Handshake TLS de ton navigateur vers un serveur, **avec** `SSLKEYLOGFILE` exporté par **ton** navigateur.
6. Ping ICMP de ton PC vers 127.0.0.1.

**Indications** :

- "En-têtes utiles" = IP, ports, flags TCP, noms DNS, SNI, codes ICMP.
- Le loopback n'a souvent **pas** d'en-tête Ethernet. Les en-têtes IP/TCP restent là.
- Le déchiffrement TLS n'est légitime que pour un flux dont tu contrôles les clés.

**Résultat attendu** : une lettre A, B ou C par numéro, avec cinq mots de justification.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **B** - HTTP clair sur loopback : en-têtes **et** payload (requête GET, corps) sont lisibles.
2. **A** - HTTPS sans secrets : tu vois TCP/TLS (Client Hello, certificats, Application Data opaque). Pas le HTML.
3. **C** - Unicast entre deux autres machines : invisible depuis ton PC sans miroir.
4. **B** - DNS UDP n'est en général pas chiffré (sauf DoH/DoT). Question et réponse lisibles.
5. **B** - Avec le keylog **de ton** client, Wireshark peut déchiffrer ce flux. Jamais le trafic d'un tiers.
6. **A** ou **B** selon ce que tu appelles payload : ICMP echo a un champ data souvent trivial. Les en-têtes ICMP sont lisibles. Réponse attendue : **A** si tu réserves B aux protocoles applicatifs, **B** si tu comptes le data ICMP. L'important est : le ping loopback **est** visible.

---

## Navigation

← Retour à l'index : **[Cursus Analyse réseau](index.md)**

→ Fiche suivante : **[Installation et capture sûre](02-installation-capture-sure.md)**
