---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Cadre légal et RGPD d'un pcap, secrets, anonymisation, fichiers sûrs, limites du chiffrement, exercice de diagnostic progressif avec preuves vérifiables."
estimated_time: "80 min"
fiche_number: 8
total_fiches: 8
cursus: "Analyse réseau"
---

# 08 - Confidentialité des pcap et exercice de diagnostic

> **En bref** : Un pcap est un fichier de données personnelles et souvent de secrets ; tu ne captures que sur un réseau autorisé, tu réduis, tu anonymises avant partage, et tu valides le cursus par un diagnostic loopback aux résultats chiffrés. Lecture estimée : 80 min.

## Prérequis

- Avoir lu [01 - Analyseur de protocoles et limites](01-analyseur-limites.md) à [07 - Articulation avec tcpdump, ss, ip, dig, mtr et Nmap](07-articulation-tcpdump-ss-ip-dig-mtr-nmap.md)
- Notion de donnée personnelle : [01 - Introduction au RGPD](../26-droit-rgpd/01-introduction-rgpd.md) (recommandé)
- Les pcap de labo dans `/tmp/lab-analyse-reseau/`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras dire pourquoi un pcap est sensible, lister ce que tu dois retirer avant un partage, rester dans le cadre légal (autorisation, pas de MITM, pas de malware pcap), et mener un diagnostic progressif dont chaque étape produit une preuve mesurable.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi un pcap est-il un fichier sensible ?

**Définition** : Un fichier pcap/pcapng contient des adresses (IP, MAC), des identifiants de session, parfois des noms DNS, des URL, des cookies, des tokens `Authorization`, des mots de passe HTTP basiques, du contenu métier (santé, RH, cartes). En droit européen, une adresse IP **peut** être une donnée personnelle. Le RGPD s'applique dès qu'un fichier permet d'identifier une personne physique, même indirectement.

**Le problème que cette qualification résout** :

Sans elle :

1. Tu joins `capture.pcapng` à un ticket public : cookies de session encore valides.
2. Tu copies le pcap sur une clé USB non chiffrée.
3. Tu crois que "c'est technique, ce n'est pas nominatif".

**Ce qu'un pcap contient souvent** :

| Élément | Exemple de champ | Risque |
| ------- | ---------------- | ------ |
| Identifiant réseau | `ip.addr`, `eth.addr` | Traçage d'une personne / d'un poste |
| Nom DNS | `dns.qry.name` | Sites visités |
| HTTP clair | `http.cookie`, `http.authorization` | Prise de session |
| TLS keylog / DSB | `editcap --inject-secrets` | Déchiffrement de **tout** le flux |
| Charge utile métier | Follow Stream | Données clients |

**Analogie concrète** : Un pcap est plus proche d'une **boîte d'archives de courrier ouvert** que d'un journal d'accès anonyme. Tu ne laisses pas cette boîte dans un open-space.

**Ce qu'un pcap n'est PAS** :

- Ce n'est pas anonyme parce que tu as renommé le fichier `debug.pcap`.
- Ce n'est pas hors RGPD parce que la capture dure 10 secondes.
- Ce n'est pas "OK à publier" parce que le wiki SampleCaptures existe : ces traces sont **choisies** et souvent anonymisées par leurs auteurs. Les tiennes ne le sont pas.

Ce cursus n'est **pas** un avis juridique. Pour un traitement réel, tu croises [CNIL](https://www.cnil.fr/) / DPO / textes RGPD. Fiche pédagogique : [01 - Introduction au RGPD](../26-droit-rgpd/01-introduction-rgpd.md).

---

### Qu'est-ce qu'une capture autorisée ?

**Définition** : Une capture est autorisée quand tu es propriétaire du réseau, ou que tu as un **mandat écrit** (employeur, client, labo pédagogique sur **tes** machines). Capturer le Wi-Fi du café, le VPN d'un collègue, ou le trafic d'un utilisateur sans base légale n'est pas un exercice.

**Le problème que cette règle résout** :

1. Confusion "promiscuous mode" = droit. Non : c'est une option technique.
2. Confusion "c'est pour la sécu" = mandat. Non : un SOC a un cadre, un apprenant sur un LAN partagé n'en a pas.

**Checklist avant START** :

| Question | Si non |
| -------- | ------ |
| Est-ce ma machine / mon labo / mon homelab ? | N'enregistre pas |
| Suis-je sur loopback uniquement ? | Loopback = plus simple à justifier (trafic **de** ta machine **vers** elle) |
| Ai-je un filtre BPF étroit ? | Recalibre `-f` |
| Ai-je une borne `-c` / `-a` ? | Ajoute-la |
| Vais-je stocker le fichier chiffré, avec une date de destruction ? | Ne copie pas sur un chat |

**Analogie concrète** : Enregistrer une réunion. Micro dans **ta** cuisine : OK. Micro sous la table de la cantine : pas OK, même si le micro "marche bien".

**Ce qu'une autorisation n'est PAS** :

- Ce n'est pas "le mot de passe Wi-Fi est écrit au tableau".
- Ce n'est pas un MITM "parce que sinon je ne vois pas le HTTPS". Le labo TLS de la fiche 04 utilise **ton** `openssl s_server` et **ton** keylog.

---

### Comment réduire et anonymiser un pcap avant partage ?

**Définition** : Réduire = enlever des paquets et des octets inutiles au diagnostic. Anonymiser = remplacer ou supprimer des identifiants et secrets pour qu'un destinataire **n'ait pas** besoin d'eux. Les deux sont distincts. `editcap -s` réduit. Ça n'anonymise pas les IP.

**Le problème que cette pratique résout** :

Un collègue a besoin de voir "le SYN-ACK manque". Il n'a pas besoin du cookie de session ni de 40 Mo de TLS Application Data.

**Mesures, de la plus simple à la plus forte** :

| Mesure | Outil | Effet | Limite |
| ------ | ----- | ----- | ------ |
| Ne pas capturer le surplus | BPF `-f` | Jamais sur disque | Tu peux rater un protocole voisin |
| Borne de durée / compte | `-c`, `-a` | Fichier court | Idem |
| Extraire un stream | `tshark -Y "tcp.stream eq 0" -w out.pcapng` | Un flux | IP encore là |
| Tronquer | `editcap -s 96` | Coupe le payload | Cookie parfois dans les 96 octets ; HTTP cassé |
| Retirer le keylog | Ne pas joindre `sslkeys.log` ; pas de DSB | Pas de déchiffrement | Handshake encore là |
| Filtrer les paquets DNS/HTTP hors sujet | `-Y` + `-w` | Moins de noms | IP restantes |
| Remplacer les IP (hors scope outil Wireshark pur) | `tcprewrite` (tcpreplay) si installé | IP de documentation `192.0.2.0/24` | Checksums, conversations à retester |

Wireshark / tshark n'offrent **pas** un bouton "RGPD compliant". `editcap --inject-secrets` fait l'inverse : il **ajoute** des secrets. Tu ne publies jamais un `*-dsb.pcapng` de labo personnel.

Pour un ticket interne, le minimum acceptable est souvent :

1. Extraire **un** stream.
2. Vérifier Follow Stream : pas de mot de passe.
3. Tronquer si le payload n'est pas le sujet (`editcap -s 128`).
4. Dire dans le ticket **ce que tu as retiré**.

**Analogie concrète** : Avant d'envoyer une photocopie de facture au SAV, tu barres le CB, tu gardes le numéro de commande. Tronquer à 96 octets, c'est couper le bas de page : le CB en haut reste.

**Ce que l'anonymisation n'est PAS** :

- Ce n'est pas `chmod 644` sur le pcap.
- Ce n'est pas changer l'extension `.pcapng` → `.data`.
- Ce n'est pas "SampleCaptures le fait, donc je peux poster le mien".

---

### Quels pcap sont sûrs pour apprendre ?

**Définition** : Un pcap d'apprentissage sûr est un fichier **que tu as généré** (loopback, text2pcap, serveur local) ou, en option **hors ligne de ce cursus**, un échantillon du wiki [SampleCaptures](https://wiki.wireshark.org/SampleCaptures) **hors** sections virus/worms/crack/PROTOS malformé si tu n'as pas un objectif dissector.

**Le problème que cette politique résout** :

1. Télécharger un pcap "ransomware" pour voir du TCP : risque disque, juridique, hors besoin.
2. Casser tshark avec un fuzz PROTOS sans le vouloir.
3. Apprendre sur des traces dont tu ne contrôles pas le contenu (données réelles fuitées).

**Autorisé dans ce cursus** :

| Source | Exemple |
| ------ | ------- |
| Loopback | ping, python http.server, UDP port 9, RST 8001 |
| text2pcap | `icmp-echo.pcap`, `arp-whohas.pcap` (192.0.2.0/24) |
| TLS labo | `openssl s_server` + **ton** curl + keylog **local** |
| SampleCaptures | **Optionnel**, plus tard, HTTP/DNS/ARP documentés, pas les malware |

**Analogie concrète** : Apprendre la chimie avec de l'eau et du sel, pas avec un flacon non étiqueté trouvé dans la rue.

**Ce qu'un pcap "d'exemple Internet" n'est PAS** :

- Ce n'est pas obligatoire pour valider le cursus.
- Ce n'est pas forcément légal à redistribuer (droits des auteurs, données).
- Un pcap avec secrets TLS embarqués (DSB) est pratique pour un test de dissector, dangereux à forwarder.

---

### Comment relire les limites du chiffrement avant l'exercice ?

**Définition** : Sans secrets, tu diagnostiques TLS au niveau handshake, certificats, alertes, timings, resets. Avec secrets **que tu contrôles**, tu descends dans HTTP. Jamais l'inverse (forcer le clair d'un tiers).

**Le problème que ce rappel résout** : l'exercice intégrateur ci-dessous est **en HTTP clair local**. Si un jour le service est en HTTPS, tu n'inventes pas un MITM pour coller aux mêmes commandes `http.request` : tu changes de critère (`tls.handshake.type == 1`, iRTT, RST).

**Analogie concrète** : Si la lettre est sous enveloppe opaque, tu traces le cachet de la poste, tu n'ouvres pas le courrier du voisin.

**Ce que "exercice en HTTP clair" n'est PAS** : une invitation à désactiver TLS en production.

---

## Étapes Pratiques

Les étapes 1 à 4 préparent l'exercice. L'étape 5 **est** l'exercice long (reprise dans la section Exercice).

```bash
cd /tmp/lab-analyse-reseau
```

---

### Étape 1 : Inventaire de sensibilité d'un pcap de labo

```bash
capinfos http-lo.pcapng
tshark -r http-lo.pcapng -q -z endpoints,ip
tshark -r http-lo.pcapng -Y "http.cookie or http.authorization" 
tshark -r http-lo.pcapng -q -z follow,tcp,ascii,0 | head -n 40
```

**Résultat attendu** : endpoints = 127.0.0.1. Pas de cookie (curl simple). Follow Stream = GET / sans mot de passe. Tu écris quand même : "si un Cookie: était là, je ne partagerais pas ce Follow Stream".

---

### Étape 2 : Extraire un stream, tronquer, comparer

```bash
tshark -r http-lo.pcapng -Y "tcp.stream eq 0" -w stream0.pcapng
editcap -s 96 stream0.pcapng stream0-snap96.pcapng
echo "== original =="
tshark -r stream0.pcapng -Y "http.request" -T fields -e http.request.uri
echo "== snap96 =="
tshark -r stream0-snap96.pcapng -Y "http.request" -T fields -e http.request.uri
```

**Résultat attendu** : l'URI peut disparaître après snaplen 96. Tu notes dans le ticket : "payload tronqué, analyse limitée aux en-têtes IP/TCP".

Vérifie qu'aucun keylog n'est collé :

```bash
ls -l sslkeys.log 2>/dev/null || echo "pas de keylog dans ce dossier"
```

---

### Étape 3 : Destruction des secrets de labo TLS

Si tu as créé `lab-key.pem` / `sslkeys.log` à la fiche 04 :

```bash
rm -f /tmp/lab-analyse-reseau/lab-key.pem /tmp/lab-analyse-reseau/sslkeys.log
```

Les pcap TLS **sans** keylog restent du handshake. Les pcap **avec** DSB : tu les supprimes aussi s'ils existent (`rm -f *-dsb.pcapng`).

**Résultat attendu** : `ls` ne montre plus de clé privée ni de keylog.

---

### Étape 4 : Politique SampleCaptures (lecture, pas de téléchargement requis)

Ouvre (quand tu as Internet, hors session offline) : [https://wiki.wireshark.org/SampleCaptures](https://wiki.wireshark.org/SampleCaptures).

Tu retiens :

- Section HTTP / DNS / ARP : possibles plus tard.
- Sections "Viruses and worms", "Crack Traces" : **hors** cursus.
- Tu ne dois **rien** télécharger pour réussir l'exercice de l'étape 5.

---

### Étape 5 : Diagnostic progressif (voir Exercice pratique)

Les commandes exactes et les valeurs attendues sont dans l'exercice et sa solution. Tu exécutes **sans** lire la solution d'abord.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark -Y "http.cookie or http.authorization" -r f.pcapng` | Cherche des secrets HTTP clairs |
| `tshark -Y "tcp.stream eq 0" -r f.pcapng -w stream0.pcapng` | Extraire un flux |
| `editcap -s 96 in.pcapng out.pcapng` | Tronquer le payload |
| `capinfos f.pcapng` | Taille, nombre de paquets, durée |
| `tshark -q -z endpoints,ip -r f.pcapng` | Lister les IP présentes |
| `rm -f sslkeys.log lab-key.pem` | Détruire des secrets de labo |

---

## Pièges Fréquents

### Piège 1 : Joindre le pcap et le keylog "pour aider"

⚠️ **Problème** : Le destinataire déchiffre toutes les sessions du fichier, y compris hors sujet.

✅ **Solution** : Soit tu déchiffres chez toi et tu colles **un extrait Follow Stream déjà relu**, soit tu envoies un pcap **sans** secrets. Pas les deux.

---

### Piège 2 : `editcap -s` pris pour une anonymisation IP

⚠️ **Problème** : "J'ai snaplen 64, je peux publier." Les MAC et IP sont dans les premiers octets.

✅ **Solution** : Snaplen réduit le payload. Les identifiants L2/L3 restent. Pour un dépôt public, génère un pcap **synthétique** (text2pcap, 192.0.2.0/24) plutôt que d'anonymiser un vrai trafic.

---

### Piège 3 : Capturer sur un Wi-Fi partagé "en promiscuous"

⚠️ **Problème** : Tu enregistres d'autres personnes.

✅ **Solution** : Loopback, ou réseau dont tu es admin, mandat écrit. Le mode promiscuous n'est pas un droit.

---

### Piège 4 : Télécharger un pcap malware pour "voir des retransmissions"

⚠️ **Problème** : Hors besoin, hors offline, risque.

✅ **Solution** : Retransmissions : fichier coupé (`editcap -r`) comme fiche 05. RST : connect port fermé. HTTP : python http.server.

---

## Checklist de Validation

- [ ] Je traite un pcap comme un fichier de données personnelles / secrets
- [ ] Je ne capture que loopback ou réseau autorisé
- [ ] Je sais extraire un stream et tronquer
- [ ] Je ne joins pas `sslkeys.log` à un ticket public
- [ ] Je n'ai pas besoin de SampleCaptures pour finir le cursus
- [ ] J'ai les preuves chiffrées de l'exercice (nombres de paquets, GET, RST)

---

## Exercice Pratique

**Énoncé** : Diagnostic progressif **100 % local**. Crée un dossier propre et un rapport `rapport-diag.md` qui contient les preuves des 8 étapes suivantes. Chaque étape a un **critère numérique ou textuel exact**.

Prépare :

```bash
mkdir -p /tmp/lab-analyse-reseau/examen
cd /tmp/lab-analyse-reseau/examen
python3 -m http.server 8000 --bind 127.0.0.1
```

Laisse le serveur tourner pendant les étapes 1 à 6.

1. **Lien** : `ip -br addr` (ou `ifconfig lo0`) montre loopback UP. Colle une ligne.
2. **Socket** : `ss -tlnp` contient `127.0.0.1:8000` (ou `*:8000`) en LISTEN.
3. **Capture HTTP** : commande tshark **avec** `-f "tcp port 8000"` **et** `-c` entre 10 et 40, fichier `http-examen.pcapng`. Puis un `curl -s -o /dev/null http://127.0.0.1:8000/`.
4. **Preuve GET** : `tshark -r http-examen.pcapng -Y "http.request.method == \"GET\""` affiche **au moins 1** ligne. Note `capinfos` : `Number of packets` = N (N >= 5 typiquement).
5. **Follow Stream** : la sortie `-z follow,tcp,ascii,0` contient la chaîne `GET /`.
6. **Nmap labo** : `nmap -sT -p 8000 127.0.0.1` → `open`. Aucune autre IP.
7. **RST** : arrête le serveur HTTP. Capture `tcp port 8001`, fichier `rst-examen.pcapng`. `python3 -c 'import socket; s=socket.socket(); s.settimeout(1); s.connect(("127.0.0.1", 8001))'`. Preuve : au moins 1 `tcp.flags.reset == 1`.
8. **Partage sûr** : à partir de `http-examen.pcapng`, produis `http-examen-snap96.pcapng` via `editcap -s 96`. Dans le rapport, une phrase : les IP 127.0.0.1 **sont encore là** (ce n'est pas une anonymisation). Recherche `http.cookie` : 0 ligne.

**Indications** :

- Démarre **toujours** tshark avant curl/python connect.
- Interface : `lo` ou `lo0` selon `tshark -D`.
- Si `ss` n'affiche pas le PID, le LISTEN suffit.
- Si Nmap manque : étape 6 = `ss` LISTEN + phrase "Nmap absent, port vérifié par ss uniquement" (le critère `open` Nmap est alors remplacé par LISTEN).

**Résultat attendu** : `rapport-diag.md` + deux pcap (`http-examen.pcapng`, `rst-examen.pcapng`) + un pcap tronqué. Un relecteur relance les commandes `tshark -r` et obtient les mêmes motifs (GET, RST, N paquets).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Commandes (adapte `lo` / `lo0`) :

```bash
mkdir -p /tmp/lab-analyse-reseau/examen
cd /tmp/lab-analyse-reseau/examen

# Terminal A
python3 -m http.server 8000 --bind 127.0.0.1

# Terminal B - étapes 1-2
ip -br addr
ss -tlnp | grep 8000

# Terminal B - étape 3
tshark -i lo -p -c 20 -f "tcp port 8000" -w http-examen.pcapng
# Terminal C :
curl -s -o /dev/null http://127.0.0.1:8000/

# Étapes 4-5
capinfos http-examen.pcapng
tshark -r http-examen.pcapng -Y "http.request.method == \"GET\""
tshark -r http-examen.pcapng -q -z follow,tcp,ascii,0

# Étape 6
nmap -sT -p 8000 127.0.0.1

# Étape 7 : Ctrl+C sur le serveur, puis
tshark -i lo -p -c 4 -f "tcp port 8001" -w rst-examen.pcapng
python3 -c 'import socket; s=socket.socket(); s.settimeout(1); s.connect(("127.0.0.1", 8001))'
tshark -r rst-examen.pcapng -Y "tcp.flags.reset == 1"

# Étape 8
editcap -s 96 http-examen.pcapng http-examen-snap96.pcapng
tshark -r http-examen.pcapng -Y "http.cookie"
tshark -r http-examen-snap96.pcapng -q -z endpoints,ip
```

**Valeurs qui valident** (les numéros de frames varient, les motifs non) :

| Étape | Critère réussi |
| ----- | -------------- |
| 1 | loopback UP, 127.0.0.1 |
| 2 | LISTEN ... 8000 |
| 3 | fichier `http-examen.pcapng` non vide |
| 4 | >= 1 GET ; N paquets >= 1 (souvent >= 8 avec handshake) |
| 5 | texte `GET /` |
| 6 | `8000/tcp open` **et** cible 127.0.0.1 seulement |
| 7 | >= 1 RST |
| 8 | 0 cookie ; endpoints toujours 127.0.0.1 après snap96 |

Exemple de `capinfos` (N variable) :

```text
File name:           http-examen.pcapng
Number of packets:   18
```

Exemple GET :

```text
  4 0.001234 127.0.0.1 → 127.0.0.1 HTTP GET / HTTP/1.1
```

Si l'étape 4 échoue : tshark lancé **après** curl, ou `-c` trop petit, ou mauvais `-i`. Recapture.

Si l'étape 7 n'a pas de RST : le connect Python a tourné avant tshark, ou un firewall local avale le SYN. Relance tshark d'abord. Sur certains OS, "connection refused" produit quand même un RST visible sur `lo`.

Tu n'as téléchargé aucun pcap externe. Tu n'as scanné que 127.0.0.1. Tu n'as pas déchiffré de TLS tiers.

---

## Navigation

← Fiche précédente : **[Articulation avec tcpdump, ss, ip, dig, mtr et Nmap](07-articulation-tcpdump-ss-ip-dig-mtr-nmap.md)**

→ Retour à l'index : **[Cursus Analyse réseau](index.md)**
