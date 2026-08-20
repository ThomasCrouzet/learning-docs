---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Choisir et combiner tcpdump, ss, ip, dig, mtr, Nmap et tshark : chaque outil une question, Nmap seulement sur un labo que tu possèdes."
estimated_time: "70 min"
fiche_number: 7
total_fiches: 8
cursus: "Analyse réseau"
---

# 07 - Articulation avec tcpdump, ss, ip, dig, mtr et Nmap

> **En bref** : Un analyseur de paquets n'est pas le premier outil. Tu vérifies le lien (`ip`), les sockets (`ss`), le nom (`dig`), le chemin (`mtr`), éventuellement les ports d'un labo (`nmap`), puis tu captures (`tcpdump`/`tshark`). Lecture estimée : 70 min.

## Prérequis

- Avoir lu [06 - tshark et automatisation](06-tshark-automatisation.md)
- Avoir lu [10 - Diagnostic et outils](../20-reseaux/10-diagnostic-outils.md)
- Nmap installé **ou** tu notes l'étape Nmap comme lecture si le binaire manque
- Autorisation : uniquement 127.0.0.1 et les machines **que tu possèdes**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras poser une question par outil, enchaîner un diagnostic loopback vérifiable, et refuser un scan Nmap hors labo.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Quelle question chaque outil tranche-t-il ?

**Définition** : Chaque outil répond à **une** question de couche. Les empiler sans question produit du bruit. Rappel méthodologique de [10 - Diagnostic et outils](../20-reseaux/10-diagnostic-outils.md).

**Le problème que cette carte résout** :

1. Capturer 500 Mo parce que "le site ne s'affiche pas", alors que `dig` montre NXDOMAIN.
2. Scanner tout le /24 du bureau avec Nmap "pour voir".
3. Lire un pcap pour savoir si nginx écoute : `ss` le dit en une ligne.

**Carte question → outil** :

| Question | Outil | Sortie utile |
| -------- | ----- | ------------ |
| L'interface est-elle UP, quelle IP, quelle route ? | `ip link`, `ip addr`, `ip route` | État, adresse, passerelle |
| Qui écoute, qui est établi ? | `ss -tulpn` / `ss -tn` | Ports, états TCP, PID |
| Le nom se résout-il ? | `dig`, `getent hosts` | Enregistrement A/AAAA, rcode |
| Le chemin souffre-t-il ? | `mtr`, `traceroute` | Perte / latence par saut |
| Quels ports sont ouverts **sur mon labo** ? | `nmap` | État open/closed/filtered |
| Quels paquets ont vraiment circulé ? | `tcpdump`, `dumpcap`, `tshark` | pcap, flags, payload |

**Analogie concrète** : Panne de chauffage. Tu ne démontes pas la chaudière avant de vérifier que le radiateur est ouvert (`ip`/`ss`), que tu es dans le bon appartement (`dig`), que le réseau de chaleur du quartier n'est pas coupé (`mtr`). Le pcap est l'analyseur de combustion : tardif, précis, coûteux.

**Ce que cette carte n'est PAS** :

- Ce n'est pas un ordre figé à 100 % : un RST déjà visible dans les logs applicatifs peut te faire sauter directement à tshark.
- Ce n'est pas "Nmap remplace ss". Nmap interroge **depuis l'extérieur** (ou localhost). `ss` lit **la machine locale**.

---

### Comment articuler `ip`, `ss` et la capture ?

**Définition** : `ip` décrit la configuration. `ss` décrit les sockets du noyau **maintenant**. La capture décrit les paquets **pendant** un intervalle. Les trois se recoupent : un `ss` LISTEN 8000 + un SYN dans tshark + une route `ip` vers 127.0.0.1 forment une histoire unique.

**Le problème que l'articulation résout** :

Sans recoupement :

1. tshark montre un SYN vers 8000, pas de SYN-ACK : tu accuses le firewall. `ss` aurait montré "rien n'écoute".
2. tshark ne capture rien sur `eth0` : `ip link` aurait montré DOWN ou une autre interface.

**Recoupement type** :

| Observation A | Observation B | Conclusion |
| ------------- | ------------- | ---------- |
| `ss` : rien sur 8000 | tshark : SYN puis RST | Service arrêté, pas un WAN |
| `ss` : LISTEN 8000 | tshark : SYN, pas de SYN-ACK | Filtre local, mauvaise interface, ou capture ailleurs |
| `ip route` : pas de default | navigateur "pas d'Internet" | Pas la peine de Follow Stream HTTPS |
| `ss` : beaucoup de TIME-WAIT | capture : FIN/ACK normaux | Charge courte, pas forcément une attaque |

**Analogie concrète** : Le planning des salles (`ss`) dit si une salle est réservée. La caméra (`tshark`) dit qui est entré. Le plan du bâtiment (`ip`) dit si la porte donne bien sur cette salle.

**Ce que `ss` n'est PAS** :

- `ss` n'est pas un historique. Un handshake de 50 ms déjà fermé a disparu de `ss -tn`. D'où le pcap.
- `netstat` est l'ancien nom. Sur Linux actuel, `ss` est l'outil.

---

### Comment articuler `dig`, `mtr`, tcpdump et tshark ?

**Définition** : `dig` interroge le DNS **volontairement**. `mtr` envoie des probes (ICMP ou UDP/TCP selon options) et mesure perte/latence par saut. `tcpdump` capture avec la même syntaxe BPF que tshark `-f`. tshark **dissecte** plus loin (display filters, HTTP, TLS).

**Le problème que cette articulation résout** :

1. "Le site est lent" : `mtr` montre 80 % de perte au saut 4, tshark sur ton PC ne montrera que des retransmissions **conséquences**.
2. `dig` NXDOMAIN : tshark sur 443 ne trouvera jamais de certificat utile.
3. tcpdump sur un serveur minimal écrit le pcap ; tu l'ouvres plus tard dans Wireshark.

**Rôles complémentaires** :

| Outil | Force | Limite |
| ----- | ----- | ------ |
| `dig @127.0.0.53 example.com` | rcode, TTL, serveur interrogé | Ne prouve pas que l'appli utilise ce résolveur |
| `mtr -r -c 20 127.0.0.1` | Perte/latence | Sauts filtrant ICMP : apparence de perte |
| `tcpdump -i lo -n -c 10 tcp port 8000` | Léger, partout | Peu de dissection HTTP |
| `tshark -r f.pcapng -Y http` | Dissection | Plus lourd, privilèges dumpcap |

tcpdump écrit un pcap compatible : `tcpdump -i lo -c 10 -w /tmp/lab-analyse-reseau/td.pcap tcp port 8000`. Même BPF que [pcap-filter(7)](https://www.tcpdump.org/manpages/pcap-filter.7.html).

**Analogie concrète** : `dig` = tu appelles l'annuaire. `mtr` = tu comptes les feux rouges sur le trajet. tcpdump = tu enregistres la radio de bord. tshark = tu décodes ensuite chaque message radio.

**Ce que `mtr` n'est PAS** :

- `mtr` n'est pas un sniffer. Il **génère** du trafic. Sur un réseau de production d'autrui, c'est déjà une sonde. Ici : `127.0.0.1` ou une cible **à toi**.
- Une perte ICMP au saut N n'est pas toujours une perte de **ton** HTTPS : beaucoup de routeurs policent ICMP.

---

### Comment utiliser Nmap sans sortir du labo ?

**Définition** : Nmap envoie des paquets pour découvrir des hôtes et l'état de ports. Dans ce cursus, la **seule** cible autorisée est un service que tu as lancé (127.0.0.1, IP d'une VM à toi). Scanner le réseau du voisin, d'un employeur, ou "Internet" n'est pas un exercice.

**Le problème que cette règle résout** :

1. Un scan est bruyant, parfois assimilé à une attaque, parfois interdit par contrat.
2. Nmap n'explique pas un timeout applicatif : trop d'options (`-sV`, `-A`, scripts) pour un diagnostic HTTP local.

**Usages légitimes ici** :

| Commande | Rôle | Cible |
| -------- | ---- | ----- |
| `nmap -p 8000 127.0.0.1` | Le port du `http.server` est-il open ? | localhost |
| `nmap -sT -p 8000,8443 127.0.0.1` | Connect scan TCP, pas besoin de raw socket | localhost |
| `nmap -sn 127.0.0.1` | Hôte up | localhost |

**Analogie concrète** : Nmap est frapper aux portes **de ta** maison pour voir lesquelles s'ouvrent. Frapper à toutes les portes de la rue n'est pas un labo.

**Ce que Nmap n'est PAS** :

- Nmap n'est pas un analyseur de payload HTTP. `curl` + tshark le sont.
- `-sV` / scripts NSE ne sont pas requis ici. Tu n'en as pas besoin pour valider le port 8000.
- Un pcap d'un scan Nmap **vers autrui** n'est pas un livrable de ce cursus.

Si tu captures pendant `nmap -p 8000 127.0.0.1`, tu verras un SYN (et la suite) : utile pour relier "open" et "SYN-ACK". BPF : `tcp port 8000`.

---

## Étapes Pratiques

Tous les tests ci-dessous ciblent **127.0.0.1** sauf mention d'une interface locale en lecture seule.

```bash
cd /tmp/lab-analyse-reseau
```

---

### Étape 1 : `ip` - configuration locale

```bash
ip -br link
ip -br addr
ip route
```

macOS : `ifconfig` et `netstat -rn`.

**Résultat attendu** : `lo` / `lo0` UP, adresse 127.0.0.1/8. S'il n'y a pas de route par défaut, tu le notes : un `mtr` vers Internet échouera pour **cette** raison, pas pour HTTP.

---

### Étape 2 : `ss` avant / pendant HTTP

Terminal A :

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Terminal B :

```bash
ss -tlnp | grep 8000
```

**Résultat attendu** :

```text
LISTEN 0 5 127.0.0.1:8000 0.0.0.0:* ...
```

Pendant un `curl -s -o /dev/null http://127.0.0.1:8000/` :

```bash
ss -tn '( dport = :8000 or sport = :8000 )'
```

**Résultat attendu** : brièvement ESTAB, puis plus rien (connexion courte). Preuve que `ss` n'est pas un enregistreur.

---

### Étape 3 : `dig` - résolution, sans mentir sur l'offline

```bash
dig localhost A
dig -x 127.0.0.1
```

**Résultat attendu** : `localhost` a souvent un A `127.0.0.1` (fichier hosts, pas forcément un serveur DNS). `dig` te montre **où** il a demandé (`SERVER:` en bas). Si `dig` échoue : `getent hosts localhost`.

Tu n'as pas besoin d'Internet. Tu n'interroges pas un domaine tiers pour valider cette étape.

---

### Étape 4 : `mtr` vers loopback

```bash
mtr -r -c 5 127.0.0.1
```

Si `mtr` est absent : `traceroute -n 127.0.0.1` (ou `traceroute 127.0.0.1`).

**Résultat attendu** : un saut, perte 0 %, latence < 1 ms. C'est le **témoin** : un mtr vers une cible distante **à toi** se lira par différence (plus de sauts, latence plus haute). Tu n'exécutes pas de mtr vers une IP au hasard.

---

### Étape 5 : tcpdump puis tshark sur le même flux

Terminal A : le `http.server` tourne encore.

Terminal B :

```bash
sudo tcpdump -i lo -n -c 15 -w /tmp/lab-analyse-reseau/td-http.pcap tcp port 8000
```

Si dumpcap/tshark ont déjà les droits, et que tcpdump demande sudo : c'est normal (tcpdump n'utilise pas le groupe wireshark). Alternative sans sudo si ta politique locale le permet : `tshark -i lo ...`.

Terminal C :

```bash
curl -s -o /dev/null http://127.0.0.1:8000/
```

Puis :

```bash
tcpdump -n -r /tmp/lab-analyse-reseau/td-http.pcap
tshark -r /tmp/lab-analyse-reseau/td-http.pcap -Y "http.request"
```

**Résultat attendu** : tcpdump montre des flags `[S]`, `[S.]`, `[P.]`. tshark montre le GET. **Même fichier**, deux profondeurs de lecture. C'est l'articulation.

---

### Étape 6 : Nmap **uniquement** sur 127.0.0.1:8000

Le serveur HTTP de l'étape 2 doit encore écouter.

```bash
nmap -sT -p 8000,8001 127.0.0.1
```

**Résultat attendu** :

```text
PORT     STATE  SERVICE
8000/tcp open   http-alt
8001/tcp closed http-alt
```

Les noms de service viennent du fichier ports de Nmap (8000 = http-alt). L'état **open/closed** est ce que tu valides.

Capture optionnelle **pendant** le scan, toujours localhost :

```bash
tshark -i lo -p -c 20 -f "tcp port 8000 or tcp port 8001" -w nmap-lo.pcapng
```

Dans un autre terminal, relance le `nmap`. Puis `tshark -r nmap-lo.pcapng`. Tu dois voir des SYN vers 8000 (SYN-ACK) et vers 8001 (RST).

Arrête le serveur HTTP (Ctrl+C).

**Interdit** : `nmap 192.168.1.0/24`, `nmap scanme.nmap.org` n'est pas requis, `nmap` vers l'IP du voisin. Si tu veux un hôte d'entraînement officiel Nmap, ce n'est **pas** dans ce cursus offline.

---

### Étape 7 : Enchaînement écrit (diagnostic type)

Scénario : "curl <http://127.0.0.1:8000/> échoue".

Ordre **écrit** avant de capturer :

1. `ip -br addr` : lo UP ?
2. `ss -tlnp | grep 8000` : LISTEN ?
3. Si non : démarre le serveur, ne capture pas encore.
4. Si oui : `curl -v` puis seulement `tshark -i lo -f "tcp port 8000"`.
5. Nmap : confirmation de port, pas la première commande.

**Résultat attendu** : une checklist datée dans tes notes, pas un pcap de 200 Mo.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ip -br link` | État des interfaces |
| `ip -br addr` | Adresses |
| `ip route` | Table de routage |
| `ss -tlnp` | Ports TCP en écoute |
| `ss -tn` | Connexions TCP établies |
| `dig localhost A` | Résolution A de localhost |
| `mtr -r -c 5 127.0.0.1` | Chemin rapport (5 probes) |
| `tcpdump -i lo -n -c 10 tcp port 8000` | Capture BPF légère |
| `nmap -sT -p 8000 127.0.0.1` | État du port 8000 **local** |
| `tshark -r f.pcap -Y "http.request"` | Dissection HTTP du pcap tcpdump |

---

## Pièges Fréquents

### Piège 1 : Nmap en premier

⚠️ **Problème** : Le site interne ne charge pas, tu lances `nmap -A` sur le serveur de prod.

✅ **Solution** : `ss` et logs sur le serveur, `dig`, `curl -v`, capture BPF étroite. Nmap `-A` est bruyant et hors cadre.

---

### Piège 2 : Croire que tcpdump "ne voit pas HTTP"

⚠️ **Problème** : tcpdump affiche `Flags [P.], seq ...` sans `GET`. Tu recapture avec Wireshark en root.

✅ **Solution** : `tcpdump -A` (ASCII) ou ouvre le **même** pcap dans tshark. Le fichier était bon.

---

### Piège 3 : `mtr` vers une IP publique "pour l'exercice"

⚠️ **Problème** : Tu satures un tiers, et en offline ça échoue de toute façon.

✅ **Solution** : `mtr 127.0.0.1` pour apprendre la lecture du tableau. Une cible distante seulement si c'est **ton** serveur et que tu as une raison.

---

### Piège 4 : Confondre LISTEN et "le paquet arrive"

⚠️ **Problème** : `ss` montre 0.0.0.0:8000, curl vers 127.0.0.1 marche, un collègue sur une autre machine n'accède pas.

✅ **Solution** : `ip` (bind 127.0.0.1 vs 0.0.0.0), firewall, et **autorisation** avant de capturer sur le LAN. Un bind `127.0.0.1` n'est pas visible depuis une autre machine : Nmap depuis cette autre machine dira `closed`/`filtered`, c'est cohérent.

---

## Checklist de Validation

- [ ] Je cite une question pour `ip`, `ss`, `dig`, `mtr`, `nmap`, `tcpdump`/`tshark`
- [ ] J'ai vu LISTEN 8000 dans `ss` pendant `http.server`
- [ ] J'ai un pcap tcpdump relisible par tshark
- [ ] Nmap n'a ciblé que 127.0.0.1 (ou une VM à moi)
- [ ] Je n'utilise pas Nmap comme premier outil d'un timeout HTTP
- [ ] Je sais que `ss` n'historise pas

---

## Exercice Pratique

**Énoncé** : Reproduis un diagnostic complet **local** dont les cinq preuves tiennent dans un fichier texte `preuve-diag.txt` :

1. Sortie `ss -tlnp` filtrée port 8000 (serveur lancé).
2. Sortie `nmap -sT -p 8000 127.0.0.1` avec `open`.
3. Commande tcpdump ou tshark utilisée (BPF `tcp port 8000`, `-c` <= 30).
4. Une ligne tshark `http.request`.
5. Une phrase : "Je n'ai scanné que 127.0.0.1."

**Indications** :

- Démarre le serveur avant ss/nmap/capture.
- Redirige les sorties : `ss ... | tee -a preuve-diag.txt`

**Résultat attendu** : le fichier contient les cinq preuves, sans adresse hors loopback dans Nmap.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
cd /tmp/lab-analyse-reseau
python3 -m http.server 8000 --bind 127.0.0.1
# autre terminal :
{
  echo "== ss =="
  ss -tlnp | grep 8000
  echo "== nmap =="
  nmap -sT -p 8000 127.0.0.1
  echo "== capture =="
  echo 'tshark -i lo -p -c 20 -f "tcp port 8000" -w preuve.pcapng'
} > preuve-diag.txt
```

Lance tshark **puis** `curl -s -o /dev/null http://127.0.0.1:8000/`. Ensuite :

```bash
{
  echo "== http.request =="
  tshark -r preuve.pcapng -Y "http.request"
  echo "Je n'ai scanné que 127.0.0.1."
} >> preuve-diag.txt
```

Contrôle : `grep -E '8000|GET|127.0.0.1' preuve-diag.txt` montre les trois motifs. Aucune ligne Nmap vers une autre IP.

---

## Navigation

← Fiche précédente : **[tshark et automatisation](06-tshark-automatisation.md)**

→ Fiche suivante : **[Confidentialité des pcap et exercice de diagnostic](08-confidentialite-pcap-et-exercice.md)**
