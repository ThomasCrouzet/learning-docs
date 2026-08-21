---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Automatiser l'analyse avec tshark : -f/-Y, -T fields, statistiques -z, deux passes -2, capinfos et editcap pour des extraits reproductibles."
estimated_time: "70 min"
fiche_number: 6
total_fiches: 8
cursus: "Analyse réseau"
id: "infrastructure.network-analysis.tshark-automatisation"
course_id: "infrastructure.network-analysis"
content_type: "lesson"
order: 6
---

# 06 - tshark et automatisation

> **En bref** : tshark fait en script ce que Wireshark fait à la souris : lire un pcap, filtrer, extraire des champs, imprimer des tables conv/expert/io, et découper des fichiers avec editcap. Lecture estimée : 70 min.

## Prérequis

- Avoir lu [05 - Flux TCP, réassemblage et retransmissions](05-flux-tcp-retransmissions.md)
- Fichiers `/tmp/lab-analyse-reseau/http-lo.pcapng` et `ping-lo.pcapng`
- Savoir rediriger stdout (`>`, `|`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir `-f` vs `-Y`, extraire des colonnes avec `-T fields`, produire des statistiques `-z`, utiliser `-2` quand un champ "regarde vers le futur", et découper / résumer un pcap avec editcap et capinfos.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que tshark ?

**Définition** : tshark est l'analyseur de protocoles en ligne de commande de Wireshark. Il capture via libpcap/dumpcap, lit tous les formats que Wireshark lit, écrit par défaut du **pcapng**, et imprime un résumé ou un détail. Manuel : [tshark(1)](https://www.wireshark.org/docs/man-pages/tshark.html).

**Le problème que tshark résout** :

Sans tshark :

1. Tu ne peux pas analyser un pcap sur un serveur sans écran.
2. Tu ne peux pas coller la même commande dans un rapport : l'UI n'est pas reproductible.
3. Tu recopies des champs à la main depuis l'écran.

**Comment tshark résout ces problèmes** :

| Problème | Option |
| -------- | ------ |
| Serveur sans GUI | `tshark -r fichier.pcapng` |
| Reproductibilité | Une ligne de commande versionnée |
| Extraction | `-T fields -e champ` |
| Stats | `-q -z conv,tcp` |
| Capture bornée | `-i -f -c -w` |

Sans option, tshark se comporte **comme tcpdump** : première interface, une ligne par paquet. Avec `-r`, il lit un fichier.

**Analogie concrète** : Wireshark est la table de mixage avec écrans. tshark est la même table pilotée par une feuille de patch (la ligne de commande). Le son (les dissecteurs) est le même.

**Ce que tshark n'est PAS** :

- tshark n'est pas dumpcap. dumpcap n'analyse pas. tshark analyse, donc consomme plus de CPU.
- `-w` n'écrit **pas** du texte. `-w` = paquets bruts. Pour du texte : redirection de stdout, **sans** `-w`.
- Un display filter pendant une capture live chargée fait dropper plus facilement (manuel tshark). Capture avec `-f`, analyse avec `-r -Y`.

---

### Comment tshark sépare capture, affichage et écriture ?

**Définition** : `-f` filtre **avant** écriture (BPF). `-Y` filtre **après** dissection (display). `-r` lit un fichier. `-w` écrit des paquets bruts. `-V` imprime l'arbre. `-T fields` imprime des colonnes. `-q` tait le listing pour ne garder que `-z`.

**Le problème que ces options résolvent** :

Un seul binaire, plusieurs métiers. Sans carte d'options tu mélanges tout.

**Carte minimale** :

| Option | Rôle |
| ------ | ---- |
| `-i lo` | Interface live |
| `-f "tcp port 8000"` | BPF |
| `-c 20` | Nombre de paquets lus/capturés |
| `-a duration:10` | Autostop |
| `-r in.pcapng` | Lecture |
| `-w out.pcapng` | Écriture brute |
| `-Y "http"` | Display filter |
| `-2` | Deux passes (champs "response in frame") |
| `-R` | Read filter de la **première** passe (seulement avec `-2`) |
| `-T fields -e x` | Colonnes |
| `-E separator=,` | CSV |
| `-z conv,tcp` | Statistique |
| `-o tls.keylog_file:keys.log` | Préférence ponctuelle |
| `-P` | Imprime le résumé **même** si `-w` |

**Analogie concrète** : `-f` est le portail de l'entrepôt. `-w` est le camion. `-r` est décharger le camion. `-Y` est trier les cartons déjà déchargés. `-T fields` est recopier des étiquettes dans un tableur.

**Ce que `-w` + `-Y` n'est PAS** :

- En **live**, le manuel : les display filters ne sont **pas** supportés quand on capture **et** qu'on sauve. Tu captures avec `-f`, tu filtres à la relecture.
- Avec `-r` et `-Y` et `-w`, tshark écrit les paquets qui matchent (et certaines dépendances de réassemblage). Les paquets cachés ne sont plus dans `out.pcapng`.

---

### Qu'est-ce que `-T fields` et `-z` ?

**Définition** : `-T fields` transforme chaque paquet en une ligne de valeurs de champs dissectés (`-e`). `-z` calcule une table **à la fin** du fichier (conversations, endpoints, I/O, expert, DNS, follow, ...). Liste : `tshark -z help`.

**Le problème que ces sorties résolvent** :

Le résumé par défaut est fait pour un humain. Un script a besoin de colonnes stables, ou d'un tableau unique.

**Exemples stables pour ce cursus** :

```bash
tshark -r http-lo.pcapng -T fields -e frame.number -e ip.src -e tcp.dstport -e http.request.uri
tshark -r http-lo.pcapng -q -z conv,tcp
tshark -r http-lo.pcapng -q -z endpoints,ip
tshark -r http-lo.pcapng -q -z io,stat,1,tcp,icmp
tshark -r http-lo.pcapng -q -z expert,note
tshark -r dns-lo.pcapng -q -z dns,tree
```

CSV :

```bash
tshark -r http-lo.pcapng -T fields -E header=y -E separator=, -E quote=d \
  -e frame.number -e ip.src -e ip.dst -e tcp.port
```

**Analogie concrète** : `-T fields` est un export tableur une ligne par pièce. `-z` est le récapitulatif de fin de mois.

**Ce que `-z` n'est PAS** :

- `-z` n'est pas filtré par `-Y` (sauf mention contraire : beaucoup de `-z` ont un filtre **en paramètre**, exemple `-z expert,note,tcp`).
- `-z proto,colinfo` est un cas à part : il **modifie** le résumé, donc tu n'utilises **pas** `-q` avec lui (manuel).
- `-z credentials` extrait des mots de passe vus dans FTP/HTTP/IMAP/POP/SMTP. Tu ne l'utilises pas sur un pcap que tu n'as pas le droit de lire. Ici : interdit hors labo à toi.

---

### Que font `-2`, capinfos et editcap ?

**Définition** :

- `-2` : deux passes sur le fichier. La première accumule les liens "réponse dans la frame N". Obligatoire pour certains champs. Impossible en live. [tshark(1)](https://www.wireshark.org/docs/man-pages/tshark.html).
- `capinfos` : métadonnées du fichier (nombre de paquets, durée, encapsulation, taille).
- `editcap` : découpe, snaplen, décalage temporel, injection de secrets TLS (`--inject-secrets`), suppression de paquets par numéro.

**Le problème que ces outils résolvent** :

1. `http.response_in` vide sans `-2`.
2. Un pcap de 2 Go alors que 30 secondes autour de l'incident suffisent.
3. Partager un fichier avec trop de payload (snaplen) - encore imparfait, voir fiche 08.

**Commandes type** :

```bash
capinfos http-lo.pcapng
editcap -s 96 http-lo.pcapng http-headers.pcapng
editcap -r http-lo.pcapng http-sel.pcapng 1-10
tshark -2 -r http-lo.pcapng -T fields -e frame.number -e http.response_in
```

**Analogie concrète** : capinfos est la page de garde du dossier. editcap est le massicot. `-2` est relire le dossier une deuxième fois maintenant que tu as l'index des réponses.

**Ce que editcap n'est PAS** :

- `editcap -s 96` n'anonymise pas les IP ni les MAC. Il **tronque**. Un cookie dans les 96 premiers octets reste là.
- editcap ne "répare" pas un pcap droppé. Il ne réinvente pas les paquets manquants.

---

## Étapes Pratiques

```bash
cd /tmp/lab-analyse-reseau
```

---

### Étape 1 : Résumé vs détail vs champs

```bash
tshark -r http-lo.pcapng
tshark -r http-lo.pcapng -c 1 -V | head -n 30
tshark -r http-lo.pcapng -T fields -e frame.number -e _ws.col.protocol -e _ws.col.info
```

**Résultat attendu** : trois présentations du même fichier. La troisième est scriptable (tabulations).

---

### Étape 2 : Extraire uniquement les GET

```bash
tshark -r http-lo.pcapng -Y "http.request" -T fields \
  -e frame.number -e ip.src -e tcp.srcport -e http.request.method -e http.request.uri
```

**Résultat attendu** :

```text
12 127.0.0.1 54321 GET /
```

Les numéros changent. La méthode `GET` et l'URI `/` sont les invariants du labo.

Compte :

```bash
tshark -r http-lo.pcapng -Y "http.request" -T fields -e http.request.method | wc -l
```

**Résultat attendu** : `1` (un curl).

---

### Étape 3 : Statistiques `-z`

```bash
tshark -r http-lo.pcapng -q -z conv,tcp
tshark -r ping-lo.pcapng -q -z io,stat,1
tshark -r http-lo.pcapng -q -z expert
```

**Résultat attendu** : tables textuelles, pas de listing paquet si `-q` est bien là. Sans `-q`, tu as listing **plus** table : plus difficile à parser.

---

### Étape 4 : Deux passes

```bash
tshark -r http-lo.pcapng -T fields -e frame.number -e http.response_in
tshark -2 -r http-lo.pcapng -T fields -e frame.number -e http.response_in
```

**Résultat attendu** : la première commande laisse souvent `http.response_in` vide. La seconde, sur le paquet GET, affiche le **numéro de frame** de la réponse. C'est exactement le cas d'usage de `-2`.

---

### Étape 5 : capinfos + editcap snaplen

```bash
capinfos http-lo.pcapng
editcap -s 64 http-lo.pcapng http-snap64.pcapng
capinfos http-snap64.pcapng
tshark -r http-snap64.pcapng -Y "http.request"
```

**Résultat attendu** : `Packet size limit` / snaplen 64 sur le second fichier. Le GET peut **disparaître** du dissector HTTP : l'URI est au-delà de 64 octets. Tu as prouvé que snaplen trop courte casse l'analyse applicative. Pour un vrai travail HTTP, ne tronque pas à 64.

---

### Étape 6 : Mini-script reproductible

```bash
cat > /tmp/lab-analyse-reseau/resume-http.sh << 'EOF'
#!/bin/sh
set -eu
FILE=$1
echo "== capinfos =="
capinfos "$FILE"
echo "== GET =="
tshark -r "$FILE" -Y "http.request" -T fields \
  -e frame.number -e http.request.method -e http.request.uri
echo "== conv tcp =="
tshark -r "$FILE" -q -z conv,tcp
echo "== expert =="
tshark -r "$FILE" -q -z expert
EOF
chmod +x /tmp/lab-analyse-reseau/resume-http.sh
/tmp/lab-analyse-reseau/resume-http.sh /tmp/lab-analyse-reseau/http-lo.pcapng
```

**Résultat attendu** : un rapport texte que tu peux coller dans un ticket. Demain, la même commande produit la même structure.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tshark -r f.pcapng -Y "http" -T fields -e http.request.uri` | Extrait les URI |
| `tshark -q -z conv,tcp -r f.pcapng` | Conversations TCP |
| `tshark -q -z endpoints,ip -r f.pcapng` | Endpoints IPv4/IPv6 selon type |
| `tshark -q -z io,stat,1 -r f.pcapng` | Paquets par seconde |
| `tshark -q -z expert -r f.pcapng` | Expert Info |
| `tshark -2 -r f.pcapng -T fields -e http.response_in` | Lien requête → réponse |
| `capinfos f.pcapng` | Métadonnées |
| `editcap -s 96 in.pcapng out.pcapng` | Tronque chaque paquet à 96 octets |
| `tshark -G fields,http` | Glossaire des champs `http.*` |

---

## Pièges Fréquents

### Piège 1 : `-w` pour sauver du texte

⚠️ **Problème** : `tshark -r f.pcapng -w rapport.txt`. Le fichier n'est pas lisible dans un éditeur.

✅ **Solution** : `tshark -r f.pcapng > rapport.txt`. `-w` = pcap/pcapng.

---

### Piège 2 : Display filter en live + `-w`

⚠️ **Problème** : `tshark -i eth0 -Y "http" -w out.pcapng` : le manuel indique que `-Y` n'est pas supporté dans ce combo live+save.

✅ **Solution** : `tshark -i eth0 -f "tcp port 80" -w out.pcapng` puis `tshark -r out.pcapng -Y "http"`.

---

### Piège 3 : Parser `-z conv` sans `-q`

⚠️ **Problème** : un script compte les lignes de paquets en plus du tableau.

✅ **Solution** : toujours `-q` avec `-z` (sauf `proto,colinfo`).

---

### Piège 4 : Oublier les guillemets BPF

⚠️ **Problème** : `tshark -f tcp port 8000` : le shell coupe à l'espace.

✅ **Solution** : `-f "tcp port 8000"`.

---

## Checklist de Validation

- [ ] Je distingue `-f`, `-Y`, `-r`, `-w`
- [ ] J'extrais un GET en `-T fields`
- [ ] J'imprime conv / expert avec `-q -z`
- [ ] Je vois l'effet de `-2` sur `http.response_in`
- [ ] Je sais que snaplen 64 casse HTTP
- [ ] J'ai un script `resume-http.sh` qui tourne sur un fichier

---

## Exercice Pratique

**Énoncé** : Écris une commande unique (une ligne, éventuellement avec `-2`) qui, sur `http-lo.pcapng`, affiche pour **chaque requête HTTP** : numéro de frame, méthode, URI, et numéro de frame de la réponse.

Puis une deuxième commande qui compte les paquets TCP de ce fichier via `-z io,stat,0` (intervalle unique).

**Indications** :

- Filtre `-Y "http.request"`
- Champs `frame.number`, `http.request.method`, `http.request.uri`, `http.response_in`
- `-2` est nécessaire pour `http.response_in`

**Résultat attendu** : une ligne du type `12 GET / 15` et un tableau io,stat dont le COUNT de FILTERED (ou la colonne Frames) est égal au nombre de paquets du fichier si tu n'as pas mis de filtre sur io,stat.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
cd /tmp/lab-analyse-reseau

tshark -2 -r http-lo.pcapng -Y "http.request" -T fields \
  -e frame.number -e http.request.method -e http.request.uri -e http.response_in

tshark -r http-lo.pcapng -q -z io,stat,0
```

**Résultat attendu** (numéros variables) :

```text
8 GET / 10
```

```text
Interval:  ...
| Frames | Bytes |
|     12 |  2345 |
```

Si `http.response_in` est vide malgré `-2`, la réponse n'est pas dans le fichier (capture `-c` trop petit). Recapture avec `-c 30`.

---

## Navigation

← Fiche précédente : **[Flux TCP, réassemblage et retransmissions](05-flux-tcp-retransmissions.md)**

→ Fiche suivante : **[Articulation avec tcpdump, ss, ip, dig, mtr et Nmap](07-articulation-tcpdump-ss-ip-dig-mtr-nmap.md)**
