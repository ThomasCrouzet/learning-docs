---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Installer Wireshark sans lancer l'UI en root, lister les interfaces, capturer de façon bornée sur loopback, générer un pcap local avec text2pcap."
estimated_time: "60 min"
fiche_number: 2
total_fiches: 8
cursus: "Analyse réseau"
---

# 02 - Installation et capture sûre

> **En bref** : Tu installes la famille Wireshark, tu donnes les privilèges à dumpcap plutôt qu'à l'interface graphique, tu listes tes interfaces, et tu produis un premier pcap borné sur la boucle locale ou via text2pcap. Lecture estimée : 60 min.

## Prérequis

- Avoir lu [01 - Analyseur de protocoles et limites](01-analyseur-limites.md)
- Un compte administrateur **ponctuel** pour installer les paquets et configurer dumpcap
- Le droit de capturer sur **ta** machine uniquement

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Wireshark/tshark, vérifier les privilèges de dumpcap, choisir une interface, lancer une capture bornée (nombre de paquets, filtre BPF, fichier de sortie), et fabriquer un pcap miniature hors ligne avec text2pcap.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que dumpcap et pourquoi ne pas lancer Wireshark en root ?

**Définition** : `dumpcap` est le programme de capture de la famille Wireshark. Il a besoin de privilèges réseau (`cap_net_raw` et `cap_net_admin` sous Linux, accès aux BPF sous macOS). L'interface graphique et tshark, eux, doivent rester un processus utilisateur.

**Le problème que cette séparation résout** :

Sans séparation :

1. **Surface d'attaque** : un bug dans un dissector HTTP tournerait en root.
2. **Habitude dangereuse** : `sudo wireshark` devient le réflexe, y compris sur un PC quotidien.
3. **Confusion** : "ça ne marche pas" mélange droits manquants et interface absente.

**Comment la séparation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Surface d'attaque | Seul dumpcap a les capabilities / le setuid ciblé |
| Réflexe sudo GUI | Groupe `wireshark` (Linux) ou ChmodBPF (macOS) |
| Confusion | `tshark -D` teste les droits **avant** une capture longue |

**Analogie concrète** : La badgeuse d'un immeuble ouvre la porte. Le personnel d'accueil n'a pas les clés du coffre. dumpcap est la badgeuse. Wireshark est l'accueil.

**Ce que dumpcap n'est PAS** :

- dumpcap n'est pas un analyseur. Il n'affiche pas "GET /index.html". Il écrit des octets horodatés.
- dumpcap n'est pas un service réseau à laisser ouvert "au cas où". Tu le lances pour une capture, tu l'arrêtes.

Référence : [CaptureSetup/CapturePrivileges](https://wiki.wireshark.org/CaptureSetup/CapturePrivileges). Guide utilisateur : [chapitre Capture](https://www.wireshark.org/docs/wsug_html_chunked/).

---

### Qu'est-ce qu'une interface de capture ?

**Définition** : Une interface de capture est le point d'entrée choisi par dumpcap : carte Ethernet, Wi-Fi, boucle locale (`lo` / `lo0`), ou, sous Linux, le pseudo-périphérique `any` (toutes les interfaces, en-tête "cooked" LINUX_SLL).

**Le problème que le choix d'interface résout** :

Sans choix explicite :

1. tshark prend la première interface non-loopback. Tu captures le Wi-Fi alors que tu voulais `lo`.
2. Tu cherches de l'Ethernet sur loopback : il n'y en a souvent pas (DLT_NULL, LINUX_SLL).
3. Tu actives le mode promiscuous sans le savoir, et tu copies plus de trames que nécessaire.

**Comment le choix d'interface se fait** :

| Interface | Ce que tu y vois | En-tête lien typique |
| --------- | ---------------- | -------------------- |
| `lo` / `lo0` | Trafic local à la machine | Souvent **pas** Ethernet |
| `eth0` / `en0` | Trafic de cette carte | Ethernet (ou 802.11) |
| `any` (Linux) | Toutes les interfaces | LINUX_SLL / SLL2, pas un vrai Ethernet |
| `wlan0` en mode monitor | Trames 802.11 brutes | RadioTap ; casse souvent l'association Wi-Fi |

**Analogie concrète** : Choisir l'interface, c'est choisir **quelle prise** du tableau électrique tu mesures. Mesurer la prise cuisine ne te dit rien sur le compteur du voisin.

**Ce qu'une interface n'est PAS** :

- `any` n'est pas un standard portable. Il est absent de macOS.
- Le mode promiscuous (`-p` pour le **désactiver** dans tshark/dumpcap) n'est pas un MITM. Il demande à la carte de garder les trames dont la MAC destination n'est pas la sienne, **sur le segment local**. Un commutateur peut quand même ne pas te les envoyer.

---

### Qu'est-ce qu'une capture sûre ?

**Définition** : Une capture sûre est une capture **bornée** : interface choisie, filtre BPF dès le départ, nombre de paquets ou durée max, fichier dans un répertoire que tu contrôles, arrêt explicite. Elle se limite au réseau autorisé.

**Le problème que la capture sûre résout** :

Sans bornes :

1. Le fichier grossit jusqu'à remplir le disque.
2. Tu enregistres des mots de passe, cookies, tokens, données de santé.
3. Tu satures dumpcap, qui droppe, et tu analyses un mensonge.

**Comment borner une capture** :

| Borne | Option tshark / dumpcap | Effet |
| ----- | ----------------------- | ----- |
| Interface | `-i lo` | Un seul point d'entrée |
| Filtre BPF | `-f "tcp port 8000"` | Le noyau jette le reste **avant** disque |
| Nombre de paquets | `-c 40` | Arrêt automatique |
| Durée | `-a duration:30` | Arrêt après 30 secondes |
| Taille fichier | `-a filesize:10240` | Arrêt vers 10 Mo (valeur en kio) |
| Ring buffer | `-b filesize:1000 -b files:5` | 5 fichiers d'environ 1 Mo, recyclés |
| Snaplen | `-s 96` | Tronque chaque paquet (en-têtes seulement) |
| Pas promiscuous | `-p` | Moins de trames "des autres" |

**Analogie concrète** : Un dictaphone avec minuterie 5 minutes, posé dans **ta** salle de réunion, micro dirigé vers **ta** table. Pas un micro 24 h dans le couloir.

**Ce qu'une capture sûre n'est PAS** :

- Ce n'est pas "capturer sans `-c` et arrêter avec Ctrl+C quand tu penses que c'est bon". Ctrl+C est acceptable **en plus** des bornes, pas à la place.
- Ce n'est pas capturer sur le Wi-Fi public du train "parce que c'est du labo". Ce n'est pas ton réseau.

Guide : [Filtering while capturing](https://www.wireshark.org/docs/wsug_html_chunked/ChCapCaptureFilterSection.html). Syntaxe BPF : [pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

---

### Comment obtenir un pcap sans télécharger d'échantillon douteux ?

**Définition** : Tu fabriques le fichier toi-même : capture loopback d'un ping ou d'un serveur HTTP local, ou conversion d'un dump hexadécimal avec `text2pcap`. Les fichiers du wiki [SampleCaptures](https://wiki.wireshark.org/SampleCaptures) restent **optionnels**, pour plus tard, hors contrainte offline, et tu évites les sections malware.

**Le problème que la génération locale résout** :

1. Pas d'Internet, pas de labo.
2. Pas de pcap d'exploit / ver / "crack traces".
3. Résultat **vérifiable** : tu connais l'émetteur, le récepteur, le moment.

**Comment tu t'y prends** :

| Méthode | Outil | Usage |
| ------- | ----- | ----- |
| Ping loopback | `ping` + `tshark -i lo` | ICMP visible tout de suite |
| HTTP local | `python3 -m http.server` + `curl` | TCP + HTTP clair |
| Hex -> pcap | `text2pcap` | Ethernet/ARP même sans carte |
| Wiki officiel | SampleCaptures | Optionnel, jamais obligatoire |

**Analogie concrète** : Pour apprendre à lire une facture, tu imprime **ta** facture d'eau. Tu n'achètes pas un dossier de fausses factures d'inconnus sur un forum.

**Ce que text2pcap n'est PAS** :

- text2pcap n'est pas un sniffer. Il ne lit pas le réseau. Il transforme un texte d'octets en fichier pcap.
- Un hex dump copié n'importe où n'est pas "sûr" par magie. Ici le dump est court, documenté, plage d'adressage TEST-NET-1 (`192.0.2.0/24`, documentation).

---

## Étapes Pratiques

Répertoire de travail commun à tout le cursus :

```bash
mkdir -p /tmp/lab-analyse-reseau
cd /tmp/lab-analyse-reseau
```

---

### Étape 1 : Installer (une fois, avec réseau si besoin)

Debian / Ubuntu :

```bash
sudo apt-get update
sudo apt-get install -y wireshark tshark
```

Le paquet pose souvent la question : autoriser les non-root à capturer. Réponds **oui** si c'est **ton** poste. Puis :

```bash
sudo usermod -aG wireshark "$USER"
```

Déconnecte-toi et reconnecte-toi (ou `newgrp wireshark`). Vérifie :

```bash
groups
getcap "$(command -v dumpcap)"
```

**Résultat attendu** (Linux avec capabilities) :

```text
... wireshark ...
/usr/bin/dumpcap cap_net_admin,cap_net_raw=eip
```

Fedora / RHEL : le groupe `wireshark` existe déjà après installation du paquet. Ajoute ton utilisateur, puis reconnecte-toi.

macOS (Homebrew, si déjà utilisé sur ta machine) :

```bash
brew install wireshark
```

L'installeur officiel Wireshark pour macOS dépose ChmodBPF. Sans accès BPF, `tshark -D` sera vide. Relance l'installeur ChmodBPF fourni avec Wireshark.

Tu n'as **pas** besoin d'Internet pour les étapes 2 à 6 une fois les binaires présents.

---

### Étape 2 : Lister les interfaces

```bash
tshark -D
ip link show
```

Sous macOS, remplace `ip link show` par `ifconfig`.

**Résultat attendu** : au moins une boucle locale (`lo` ou `lo0`). Note **exactement** le nom. Dans la suite, si ta boucle locale s'appelle `lo0`, substitue `lo0` à `lo`.

---

### Étape 3 : Capture ICMP bornée sur loopback

Terminal A :

```bash
cd /tmp/lab-analyse-reseau
tshark -i lo -p -c 4 -f "icmp" -w ping-lo.pcapng
```

`-p` : pas de promiscuous (inutile sur loopback, et c'est le bon réflexe).
`-c 4` : quatre paquets puis arrêt.
`-f "icmp"` : filtre de **capture** BPF, pas un filtre d'affichage.

Terminal B, **pendant** que tshark attend :

```bash
ping -c 2 127.0.0.1
```

**Résultat attendu** côté tshark :

```text
Capturing on 'Loopback'
4
```

Puis tshark quitte tout seul.

Vérification :

```bash
capinfos ping-lo.pcapng
tshark -r ping-lo.pcapng
```

**Résultat attendu** (extrait) :

```text
Number of packets: 4
...
ICMP 127.0.0.1 > 127.0.0.1 Echo (ping) request
ICMP 127.0.0.1 > 127.0.0.1 Echo (ping) reply
```

Si `ping` n'envoie que de l'IPv6 (`ping6` / `inet6`), utilise `ping -4 -c 2 127.0.0.1` si ta commande le permet, ou change le BPF en `icmp or icmp6`.

---

### Étape 4 : Fabriquer un pcap Ethernet+ICMP avec text2pcap (hors ligne)

Ce dump est un echo request IPv4 de `192.0.2.1` vers `192.0.2.2` (plage de documentation RFC 5737). Aucun réseau réel n'est sollicité.

```bash
cd /tmp/lab-analyse-reseau
cat > icmp-echo.hex << 'EOF'
000000 00 0e b6 00 00 02 00 0e b6 00 00 01 08 00 45 00
000010 00 28 00 00 00 00 ff 01 37 d1 c0 00 02 01 c0 00
000020 02 02 08 00 ad 4b 00 01 00 01 3f 2b 6b 08 00 00
EOF
text2pcap icmp-echo.hex icmp-echo.pcap
tshark -r icmp-echo.pcap -V | head -n 40
```

**Résultat attendu** (points de contrôle) :

```text
Ethernet II, Src: 00:0e:b6:00:00:01, Dst: 00:0e:b6:00:00:02
Internet Protocol Version 4, Src: 192.0.2.1, Dst: 192.0.2.2
Internet Control Message Protocol
    Type: 8 (Echo (ping) request)
```

Tu as maintenant un paquet **avec** en-tête Ethernet, ce que loopback ne fournit souvent pas.

---

### Étape 5 : HTTP local, toujours borné

Terminal A :

```bash
cd /tmp/lab-analyse-reseau
python3 -m http.server 8000 --bind 127.0.0.1
```

Terminal B :

```bash
cd /tmp/lab-analyse-reseau
tshark -i lo -p -c 20 -f "tcp port 8000" -w http-lo.pcapng
```

Terminal C, **après** le démarrage de tshark :

```bash
curl -s -o /dev/null http://127.0.0.1:8000/
```

Arrête le serveur HTTP avec Ctrl+C dans le terminal A.

```bash
capinfos http-lo.pcapng
tshark -r http-lo.pcapng -Y "http.request"
```

**Résultat attendu** :

```text
Number of packets: ...  (au moins le handshake + GET + réponse)
HTTP 127.0.0.1 → 127.0.0.1 GET / HTTP/1.1
```

Le filtre d'affichage `-Y` est vu en détail dans la fiche [03](03-filtres-bpf-et-affichage.md). Ici tu constates seulement que le GET est dans le fichier.

---

### Étape 6 : Ring buffer (à connaître, pas à laisser tourner)

Tu n'utilises ceci que si tu dois capturer plus longtemps **sur un labo à toi**. Exemple pédagogique de 3 petits fichiers, 1 seconde chacun, puis arrêt :

```bash
cd /tmp/lab-analyse-reseau
tshark -i lo -p -f "icmp" -a duration:3 -b duration:1 -b files:3 -w ring.pcapng
```

Dans un second terminal, `ping 127.0.0.1` pendant ces 3 secondes.

**Résultat attendu** : des fichiers du type `ring_00001_*.pcapng`, `ring_00002_*.pcapng`. Tu les supprimes après l'exercice (`rm -f ring_*.pcapng`).

Référence ring buffer : option `-b` du [manuel tshark](https://www.wireshark.org/docs/man-pages/tshark.html).

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark -D` | Liste les interfaces |
| `tshark -i lo -p -c 4 -f "icmp" -w ping-lo.pcapng` | Capture ICMP bornée sur loopback |
| `tshark -i lo -p -c 20 -f "tcp port 8000" -w http-lo.pcapng` | Capture HTTP local |
| `capinfos fichier.pcapng` | Nombre de paquets, durée, taille |
| `text2pcap dump.hex out.pcap` | Convertit un dump hex en pcap |
| `dumpcap -i lo -c 4 -f "icmp" -w ping.pcapng` | Même capture, sans dissection |
| `tshark -a duration:30 -i lo -w timed.pcapng` | Arrêt après 30 secondes |

---

## Pièges Fréquents

### Piège 1 : Capturer sans `-f` ni `-c` sur une interface réelle

⚠️ **Problème** : `tshark -i eth0 -w /tmp/tout.pcapng` sur un serveur chargé. Le disque grossit, dumpcap droppe, le fichier contient des secrets.

✅ **Solution** : Toujours `-f`, toujours une borne (`-c` ou `-a`), toujours un répertoire que tu contrôles. En production, préfère dumpcap + BPF.

---

### Piège 2 : Chercher Ethernet sur `lo`

⚠️ **Problème** : Tu ouvres `ping-lo.pcapng` et tu ne vois pas de MAC. Tu crois que la capture est cassée.

✅ **Solution** : Le loopback n'encapsule souvent pas en Ethernet. Les couches IP et ICMP sont valides. Pour Ethernet/ARP, utilise text2pcap (étape 4) ou une interface réelle **à toi**.

---

### Piège 3 : Lancer tshark après le ping

⚠️ **Problème** : tshark démarre trop tard, `-c 4` attend, rien n'arrive, tu interromps.

✅ **Solution** : Démarre la capture **avant** le générateur de trafic. Vérifie que tshark affiche `Capturing on ...` puis seulement lance `ping` / `curl`.

---

### Piège 4 : Interface `any` copiée depuis un tutoriel Linux

⚠️ **Problème** : Sur macOS, `-i any` échoue.

✅ **Solution** : Utilise le nom exact de `tshark -D`. Documente ce nom dans tes notes de labo.

---

### Piège 5 : SampleCaptures comme prérequis

⚠️ **Problème** : Un tutoriel exige un pcap de malware pour "voir des retransmissions".

✅ **Solution** : Ce cursus n'en a pas besoin. Tu génères ICMP, HTTP, et plus tard un TCP vers un port fermé (RST). SampleCaptures reste un **lien optionnel** : [wiki SampleCaptures](https://wiki.wireshark.org/SampleCaptures).

---

## Checklist de Validation

- [ ] tshark et dumpcap répondent à `--version`
- [ ] Je ne lance pas `sudo wireshark`
- [ ] `tshark -D` liste au moins loopback
- [ ] J'ai un `ping-lo.pcapng` avec 4 paquets ICMP
- [ ] J'ai un `icmp-echo.pcap` créé par text2pcap, avec Ethernet
- [ ] J'ai un `http-lo.pcapng` contenant un `http.request`
- [ ] Chaque capture live avait `-c` ou `-a` et un `-f`

---

## Exercice Pratique

**Énoncé** : Produis un fichier `/tmp/lab-analyse-reseau/udp-lo.pcapng` qui contient **exactement** le trafic d'un datagramme UDP local vers le port 9 (discard) de 127.0.0.1. Tu dois pouvoir montrer :

1. La commande de capture (BPF + borne).
2. La commande qui a généré le datagramme.
3. `capinfos` : au moins 1 paquet.
4. `tshark -r udp-lo.pcapng -Y "udp.port == 9"` : au moins une ligne.

**Indications** :

- Démarre tshark avant Python.
- Générateur possible :

```bash
python3 -c 'import socket; s=socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.sendto(b"lab-udp", ("127.0.0.1", 9)); s.close()'
```

- Filtre de capture BPF : `udp port 9`.
- `-c 2` suffit souvent (parfois un seul paquet).

**Résultat attendu** : un pcap relisible offline, sans autre trafic.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Terminal 1 :

```bash
cd /tmp/lab-analyse-reseau
tshark -i lo -p -c 2 -f "udp port 9" -w udp-lo.pcapng
```

Terminal 2 :

```bash
python3 -c 'import socket; s=socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.sendto(b"lab-udp", ("127.0.0.1", 9)); s.close()'
```

Vérification :

```bash
capinfos udp-lo.pcapng
tshark -r udp-lo.pcapng -Y "udp.port == 9" -T fields -e ip.src -e ip.dst -e udp.dstport
```

**Résultat attendu** :

```text
Number of packets: 1
127.0.0.1 127.0.0.1 9
```

Si tu as 2 paquets, un ICMP "port unreachable" peut accompagner l'UDP. C'est acceptable : le BPF `udp port 9` ne garde que l'UDP. Avec `-c 2` et un ICMP, tshark peut rester bloqué : passe alors `-f "udp port 9 or icmp"` **ou** `-c 1`. Le critère de réussite est : le datagramme UDP destination 9 est dans le fichier.

---

## Navigation

← Fiche précédente : **[Analyseur de protocoles et limites](01-analyseur-limites.md)**

→ Fiche suivante : **[Filtres BPF et filtres d'affichage](03-filtres-bpf-et-affichage.md)**
