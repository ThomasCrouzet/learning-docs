---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "DNS et DHCP : resolution de noms, zones DNS, enregistrements A, AAAA, CNAME, MX, NS et fonctionnement du bail DHCP."
estimated_time: "60 min"
fiche_number: 4
total_fiches: 14
cursus: "Réseaux"
---

# 04 - DNS et DHCP

> **En bref** : Tu découvriras comment le DNS traduit les noms de domaine en adresses IP, les différents types d'enregistrements DNS (A, AAAA, CNAME, MX, NS), et comment le DHCP attribue automatiquement les adresses IP aux machines. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [03 - Protocoles de transport](03-protocoles-transport.md) pour connaître les differences entre TCP et UDP, les ports et le fonctionnement de la couche transport

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer le processus de resolution DNS, lire et interpréter les principaux types d'enregistrements DNS, utiliser les outils de diagnostic DNS (`nslookup`, `dig`), et décrire le mécanisme d'attribution d'adresse par DHCP.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le DNS ?

**Définition** : Le DNS (Domain Name System) est un système distribue qui traduit les noms de domaine lisibles par les humains (comme `example.com`) en adresses IP utilisables par les machines (comme `104.20.23.154`). Le DNS fonctionne principalement sur le port 53, en UDP pour les requêtes courtes et en TCP pour les réponses volumineuses.

**Le problème que le DNS résout** :

Sans DNS, voici les problèmes rencontres :

1. **Adresses impossibles a retenir** : Les humains ne peuvent pas memoriser des dizaines d'adresses IP. Tu retiens facilement `google.com` mais pas `142.250.74.238`.
2. **Pas de flexibilité** : Si un site web change de serveur (et donc d'adresse IP), tous les utilisateurs doivent connaître la nouvelle adresse. Sans DNS, il faudrait prevenir chaque utilisateur individuellement.
3. **Pas de répartition de charge** : Un seul nom de domaine doit pouvoir pointer vers plusieurs serveurs pour repartir le trafic.

**Comment le DNS résout ces problèmes** :

| Problème | Solution apportée par le DNS |
| --- | --- |
| Adresses impossibles a retenir | Les noms de domaine sont faciles a memoriser |
| Pas de flexibilité | On modifie l'enregistrement DNS pour pointer vers la nouvelle adresse, sans impacter les utilisateurs |
| Pas de répartition de charge | Un nom peut pointer vers plusieurs adresses IP (round-robin DNS) |

**Analogie concrète** : Le DNS fonctionne comme un annuaire téléphonique. Tu cherches le nom "Restaurant Le Bon Coin" (le nom de domaine) et tu trouves son numéro de telephone (l'adresse IP). Si le restaurant change de numéro, l'annuaire est mis a jour et tout le monde continue d'appeler le bon numéro.

**Ce que le DNS n'est PAS** :

- Le DNS n'est pas un service d'hebergement. Il ne stocke pas les sites web, il indique simplement ou les trouver (l'adresse IP du serveur).
- Le DNS n'est pas instantané. Les enregistrements DNS sont mis en cache a différents niveaux. Après une modification, il faut attendre l'expiration du cache (le TTL) pour que le changement se propage.

---

### Le processus de resolution DNS

**Définition** : La resolution DNS est le processus par lequel un nom de domaine est traduit en adresse IP. Ce processus implique plusieurs serveurs DNS organises en hiérarchie.

**Les étapes de resolution** :

```text
1. L'utilisateur tape "example.com" dans son navigateur

2. Le navigateur interroge le resolveur DNS local (cache du systeme)
   → Si l'adresse est en cache : reponse immediate
   → Sinon : le resolveur interroge les serveurs DNS

3. Le resolveur interroge un serveur DNS racine (root server)
   → Reponse : "Je ne connais pas example.com, mais
      demande au serveur .com"

4. Le resolveur interroge le serveur TLD .com
   → Reponse : "Je ne connais pas example.com, mais
      demande au serveur ns1.example.com"

5. Le resolveur interroge le serveur autoritaire de example.com
   → Reponse : "example.com a l'adresse 104.20.23.154"

6. Le resolveur met en cache la reponse et la retourne au navigateur
```

**La hiérarchie DNS** :

```text
                    . (racine)
                   / | \
                 /   |   \
              .com  .org  .fr
              / \      |     \
         google  example  wikipedia  gouv
```

| Niveau | Nom | Exemple | Role |
| --- | --- | --- | --- |
| Racine | . | 13 serveurs racine mondiaux (a.root-servers.net a m.root-servers.net) | Point de départ de toute resolution |
| TLD | Top-Level Domain | .com, .org, .fr, .dev | Gère par des registres (Verisign pour .com, AFNIC pour .fr) |
| Domaine | Second-level domain | example.com, google.fr | Gère par le propriétaire du domaine |
| Sous-domaine | Third-level et au-delà | `www.example.com`, `mail.example.com` | Défini par le propriétaire |

---

### Les types d'enregistrements DNS

**Définition** : Un enregistrement DNS (DNS record) est une entrée dans la base de données d'un serveur DNS. Chaque type d'enregistrement a un rôle spécifique.

**Les enregistrements principaux** :

| Type | Nom | Role | Exemple |
| --- | --- | --- | --- |
| A | Address | Associe un nom a une adresse IPv4 | `example.com → 104.20.23.154` |
| AAAA | IPv6 Address | Associe un nom a une adresse IPv6 | `example.com → 2606:2800:220:1:248:1893:25c8:1946` |
| CNAME | Canonical Name | Créé un alias vers un autre nom | `www.example.com → example.com` |
| MX | Mail Exchange | Indique le serveur de messagerie | `example.com → mail.example.com (priorite 10)` |
| NS | Name Server | Indique les serveurs DNS autoritaires | `example.com → ns1.example.com` |
| TXT | Text | Stocke du texte libre (vérification, SPF, DKIM) | `example.com → "v=spf1 include:_spf.google.com ~all"` |
| SOA | Start of Authority | Informations sur la zone (admin, serial, TTL) | Paramètres de la zone example.com |
| PTR | Pointer | Resolution inverse (IP vers nom) | `34.216.184.93 → example.com` |
| SRV | Service | Localise un service spécifique | `_sip._tcp.example.com → sip.example.com:5060` |

**Le TTL (Time To Live)** :

Chaque enregistrement DNS a un TTL exprime en secondes. Le TTL indique combien de temps l'enregistrement peut être garde en cache avant d'être redemande au serveur autoritaire.

| TTL | Durée | Usage typique |
| --- | --- | --- |
| 300 | 5 minutes | DNS dynamique, migration en cours |
| 3600 | 1 heure | Usage courant |
| 86400 | 24 heures | Enregistrements stables |

---

### Les zones DNS

**Définition** : Une zone DNS est une portion de l'espace de noms DNS geree par un serveur DNS autoritaire. Un fichier de zone contient tous les enregistrements DNS d'un domaine.

**Exemple de fichier de zone** :

```text
; Zone file pour example.com
$TTL 3600                          ; TTL par defaut : 1 heure
@       IN  SOA   ns1.example.com. admin.example.com. (
                    2025040701     ; Serial (date + numero)
                    3600           ; Refresh (1h)
                    900            ; Retry (15min)
                    604800         ; Expire (1 semaine)
                    86400          ; Minimum TTL (1 jour)
                  )

; Serveurs de noms
@       IN  NS    ns1.example.com.
@       IN  NS    ns2.example.com.

; Enregistrements A
@       IN  A     104.20.23.154
www     IN  A     104.20.23.154
mail    IN  A     93.184.216.50

; Enregistrement AAAA
@       IN  AAAA  2606:2800:220:1:248:1893:25c8:1946

; Alias
blog    IN  CNAME www.example.com.

; Serveur de messagerie
@       IN  MX    10  mail.example.com.
@       IN  MX    20  backup-mail.example.com.

; Verification SPF
@       IN  TXT   "v=spf1 mx -all"
```

Le `@` représente le nom de la zone elle-même (`example.com`). Les points a la fin des noms (`example.com.`) indiquent un nom pleinement qualifie (FQDN).

---

### Qu'est-ce que le DHCP ?

**Définition** : Le DHCP (Dynamic Host Configuration Protocol) est un protocole qui attribue automatiquement une configuration IP (adresse IP, masque, passerelle, serveur DNS) aux machines qui se connectent a un réseau. Le DHCP fonctionne sur les ports UDP 67 (serveur) et 68 (client).

**Le problème que le DHCP résout** :

Sans DHCP, voici les problèmes rencontres :

1. **Configuration manuelle** : Chaque machine doit être configurée manuellement avec une adresse IP, un masque, une passerelle et un serveur DNS. Sur un réseau de 200 machines, cela prend des heures.
2. **Conflits d'adresses** : Deux administrateurs attribuent la même adresse IP a deux machines différentes. Les deux machines ne fonctionnent plus correctement.
3. **Gaspillage d'adresses** : Une machine qui quitte le réseau conserve son adresse. Les adresses ne sont jamais recyclee.

**Comment le DHCP résout ces problèmes** :

| Problème | Solution apportée par le DHCP |
| --- | --- |
| Configuration manuelle | Les machines reçoivent automatiquement leur configuration |
| Conflits d'adresses | Le serveur DHCP verifie qu'une adresse n'est pas déjà utilisée avant de l'attribuer |
| Gaspillage d'adresses | Les adresses sont attribuees sous forme de bail temporaire et recyclees a l'expiration |

**Analogie concrète** : Le DHCP fonctionne comme la reception d'un hôtel. Quand tu arrives (ta machine se connecte au réseau), la reception (le serveur DHCP) te donne un numéro de chambre (une adresse IP) et une carte d'accès (la configuration réseau). La chambre est reservee pour la durée de ton sejour (le bail DHCP). Quand tu pars, la chambre est liberee pour le prochain client.

**Ce que le DHCP n'est PAS** :

- Le DHCP ne fournit pas une adresse permanente (par défaut). L'adresse est louee pour une durée limitée (le bail). A l'expiration, la machine doit renouveler le bail ou recevoir une nouvelle adresse.
- Le DHCP n'est pas obligatoire. Tu peux configurer une adresse IP statique (fixe) manuellement. C'est d'ailleurs recommande pour les serveurs, les imprimantes réseau et les routeurs.

---

### Le processus DHCP (DORA)

**Définition** : L'attribution d'une adresse par DHCP se fait en 4 étapes, memorisees par l'acronyme DORA :

```text
Client                          Serveur DHCP
   |                               |
   |--- DISCOVER (broadcast) ----->|   1. "Y a-t-il un serveur DHCP ?"
   |                               |
   |<------ OFFER -----------------|   2. "Oui, voici une adresse pour toi"
   |                               |
   |--- REQUEST (broadcast) ------>|   3. "J'accepte cette adresse"
   |                               |
   |<------ ACK ------------------|   4. "C'est confirme, elle est a toi"
   |                               |
```

Les 4 étapes :

1. **Discover** : Le client envoie un message broadcast (`255.255.255.255`) car il ne connaît pas encore l'adresse du serveur DHCP. Message : "Je cherche un serveur DHCP."
2. **Offer** : Le serveur DHCP répond avec une proposition : adresse IP, masque, passerelle, serveur DNS et durée du bail.
3. **Request** : Le client accepte l'offre (en broadcast, car plusieurs serveurs DHCP peuvent avoir repondu).
4. **Acknowledge** : Le serveur confirme et le client peut utiliser l'adresse.

**Le bail DHCP** :

| Paramètre | Description | Valeur typique |
| --- | --- | --- |
| Durée du bail | Combien de temps l'adresse est reservee | 24 heures (domestique), 8 heures (entreprise) |
| Renouvellement | Le client tente de renouveler a 50% du bail | A 12 heures sur un bail de 24h |
| Rebinding | Si le renouvellement échoue, nouvelle tentative a 87.5% | A 21 heures sur un bail de 24h |
| Expiration | Si tout échoue, le client perd l'adresse | A 24 heures |

---

## Étapes Pratiques

### Étape 1 : Résoudre un nom de domaine avec nslookup

```bash
# Resout le nom example.com en adresse IP
nslookup example.com
```

**Résultat attendu** (les adresses IP de example.com changent dans le temps ; une ou plusieurs réponses A sont possibles) :

```text
Server:     127.0.0.53
Address:    127.0.0.53#53

Non-authoritative answer:
Name:   example.com
Address: 104.20.23.154
```

Ce résultat montre :

- `Server: 127.0.0.53` : le serveur DNS local utilise pour la requête
- `Non-authoritative answer` : la réponse vient du cache, pas directement du serveur autoritaire
- `Address: 104.20.23.154` : une adresse IPv4 du domaine a un instant T

---

### Étape 2 : Interroger un serveur DNS spécifique

```bash
# Utilise le serveur DNS de Google (8.8.8.8) au lieu du DNS local
nslookup example.com 8.8.8.8
```

**Résultat attendu** :

```text
Server:     8.8.8.8
Address:    8.8.8.8#53

Non-authoritative answer:
Name:   example.com
Address: 104.20.23.154
```

Tu peux ainsi comparer les réponses de différents serveurs DNS pour diagnostiquer des problèmes de propagation.

---

### Étape 3 : Utiliser dig pour des requêtes DNS détaillées

La commande `dig` (Domain Information Groper) est plus puissante que `nslookup` pour le diagnostic DNS.

```bash
# Requete detaillee pour l'enregistrement A de example.com
dig example.com A
```

**Résultat attendu** :

```text
; <<>> DiG 9.18.18 <<>> example.com A
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;example.com.           IN  A

;; ANSWER SECTION:
example.com.        3600    IN  A   104.20.23.154

;; Query time: 12 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Mon Apr 07 14:30:00 UTC 2025
;; MSG SIZE  rcvd: 56
```

Les sections importantes :

- `QUESTION SECTION` : ce qui a été demande (enregistrement A de example.com)
- `ANSWER SECTION` : la réponse (`104.20.23.154` avec un TTL de 3600 secondes)
- `Query time` : le temps de resolution (12 ms)

---

### Étape 4 : Consulter différents types d'enregistrements

```bash
# Enregistrements MX (serveurs de messagerie)
dig example.com MX +short
```

**Résultat attendu** :

```text
0 .
```

(Ce domaine d'exemple n'a pas de serveur mail configure.)

```bash
# Enregistrements NS (serveurs de noms)
dig example.com NS +short
```

**Résultat attendu** :

```text
a.iana-servers.net.
b.iana-servers.net.
```

```bash
# Enregistrements TXT (verification, SPF)
dig example.com TXT +short
```

**Résultat attendu** :

```text
"v=spf1 -all"
```

L'option `+short` affiche uniquement la réponse sans les détails.

---

### Étape 5 : Tracer la resolution DNS complete

```bash
# Trace toutes les etapes de la resolution DNS
dig +trace example.com
```

**Résultat attendu** (resume) :

```text
.                   IN  NS  a.root-servers.net.    (serveur racine)
com.                IN  NS  a.gtld-servers.net.    (serveur TLD .com)
example.com.        IN  NS  a.iana-servers.net.    (serveur autoritaire)
example.com.        IN  A   104.20.23.154          (reponse finale)
```

Tu vois les 4 étapes de la resolution : racine → TLD → autoritaire → réponse.

---

### Étape 6 : Verifier ta configuration DHCP

```bash
# Affiche les informations du bail DHCP actuel
cat /var/lib/dhcp/dhclient.leases 2>/dev/null || cat /var/lib/NetworkManager/*.lease 2>/dev/null || echo "Aucun fichier de bail trouve"
```

**Résultat attendu** :

```text
lease {
  interface "eth0";
  fixed-address 192.168.1.42;
  option subnet-mask 255.255.255.0;
  option routers 192.168.1.1;
  option domain-name-servers 192.168.1.1;
  option dhcp-lease-time 86400;
  renew 3 2025/04/08 14:30:00;
  rebind 3 2025/04/08 20:30:00;
  expire 4 2025/04/09 02:30:00;
}
```

Tu vois :

- `fixed-address` : l'adresse IP attribuee
- `option routers` : la passerelle par défaut
- `option domain-name-servers` : le serveur DNS
- `dhcp-lease-time` : la durée du bail en secondes (86400 = 24 heures)
- `renew`, `rebind`, `expire` : les dates de renouvellement

---

### Étape 7 : Renouveler le bail DHCP

```bash
# Libere le bail DHCP actuel et en demande un nouveau
sudo dhclient -r eth0 && sudo dhclient eth0
```

**Résultat attendu** :

```text
DHCPRELEASE on eth0
DHCPDISCOVER on eth0
DHCPOFFER from 192.168.1.1
DHCPREQUEST on eth0
DHCPACK from 192.168.1.1
bound to 192.168.1.42
```

Tu vois les étapes DORA en action : DISCOVER, OFFER, REQUEST, ACK.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `nslookup <domaine>` | Resolution DNS simple |
| `nslookup <domaine> <serveur_dns>` | Resolution via un serveur DNS spécifique |
| `dig <domaine> A` | Requête DNS détaillée (enregistrement A) |
| `dig <domaine> MX +short` | Affiche les serveurs de messagerie |
| `dig <domaine> NS +short` | Affiche les serveurs de noms |
| `dig +trace <domaine>` | Trace la resolution DNS complete |
| `dig -x <adresse_ip>` | Resolution DNS inverse (IP vers nom) |
| `sudo dhclient -r eth0` | Libere le bail DHCP |
| `sudo dhclient eth0` | Demande un nouveau bail DHCP |
| `cat /etc/resolv.conf` | Affiche le serveur DNS configure |

---

## Pièges Frequents

### Piège 1 : Croire que le DNS est instantané

⚠️ **Problème** : Tu modifies un enregistrement DNS et tu t'attends a ce que le changement soit visible immédiatement.

✅ **Solution** : Les enregistrements DNS sont mis en cache a plusieurs niveaux (navigateur, système, resolveur, FAI). Le TTL détermine la durée de mise en cache. Après une modification, il faut attendre l'expiration du TTL. Pour les migrations importantes, diminue le TTL a 300 secondes (5 minutes) plusieurs jours avant la migration.

---

### Piège 2 : Confondre CNAME et A

⚠️ **Problème** : Tu créés un enregistrement CNAME pour ton domaine racine (`example.com`) et cela casse d'autres enregistrements (MX, TXT).

✅ **Solution** : Un enregistrement CNAME ne peut pas coexister avec d'autres enregistrements pour le même nom. Le domaine racine a besoin d'enregistrements MX (mail), NS (serveurs de noms) et TXT (SPF). Utilise un enregistrement A pour le domaine racine et un CNAME uniquement pour les sous-domaines (`www.example.com → example.com`).

---

### Piège 3 : Oublier le point final dans les fichiers de zone

⚠️ **Problème** : Dans un fichier de zone DNS, tu écris `www IN CNAME example.com` au lieu de `www IN CNAME example.com.` (sans le point final).

✅ **Solution** : Sans le point final, le serveur DNS ajoute le nom de la zone. `example.com` sans point devient `example.com.example.com.` - ce qui n'existe pas. Le point final indique un FQDN (Fully Qualified Domain Name) complet.

---

### Piège 4 : Confondre serveur DHCP et serveur DNS

⚠️ **Problème** : Tu penses que le serveur DHCP et le serveur DNS sont la même chose parce que ta box Internet fait les deux.

✅ **Solution** : Ce sont deux services différents. Le DHCP attribue les adresses IP. Le DNS traduit les noms en adresses IP. Ta box Internet fait souvent les deux, mais dans un réseau d'entreprise, ce sont généralement des serveurs separes.

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle du DNS (traduction nom → adresse IP)
- [ ] Je connais les étapes de la resolution DNS (racine → TLD → autoritaire)
- [ ] Je sais distinguer les enregistrements A, AAAA, CNAME, MX, NS et TXT
- [ ] Je sais utiliser `nslookup` et `dig` pour interroger le DNS
- [ ] Je sais expliquer le rôle du DHCP (attribution automatique d'adresses)
- [ ] Je connais les 4 étapes DORA (Discover, Offer, Request, Acknowledge)
- [ ] Je comprends le concept de bail DHCP et son renouvellement

---

## Exercice Pratique

**Enonce** : Utilise les outils DNS pour explorer les enregistrements de plusieurs domaines et diagnostiquer la configuration DNS de ta machine.

**Questions** :

1. Quelle est l'adresse IPv4 de `google.fr` ? Et son adresse IPv6 ?
2. Quels sont les serveurs de noms (NS) de `wikipedia.org` ?
3. Quels sont les serveurs de messagerie (MX) de `gmail.com` ? Quelles sont leurs priorités ?
4. Quel serveur DNS ta machine utilise-t-elle ? (indice : `/etc/resolv.conf`)
5. Trace la resolution DNS complete de `github.com` et identifie les serveurs racine, TLD et autoritaire impliques.

**Indications** :

- Utilise `dig <domaine> A` et `dig <domaine> AAAA` pour la question 1
- Utilise `dig <domaine> NS +short` pour la question 2
- Utilise `dig <domaine> MX +short` pour la question 3
- Utilise `cat /etc/resolv.conf` pour la question 4
- Utilise `dig +trace <domaine>` pour la question 5

**Résultat attendu** : Tu as les réponses aux cinq questions et tu es capable d'utiliser `dig` pour diagnostiquer des problèmes DNS.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Question 1 : Adresses IP de google.fr**

```bash
dig google.fr A +short
```

```text
142.250.74.227
```

```bash
dig google.fr AAAA +short
```

```text
2a00:1450:4007:80e::2003
```

Réponse : IPv4 = `142.250.74.227` (peut varier), IPv6 = `2a00:1450:4007:80e::2003` (peut varier). Google utilise plusieurs adresses IP et la réponse dépend de ta localisation.

**Question 2 : Serveurs de noms de wikipedia.org**

```bash
dig wikipedia.org NS +short
```

```text
ns0.wikimedia.org.
ns1.wikimedia.org.
ns2.wikimedia.org.
```

Réponse : Wikipedia utilise les serveurs DNS de Wikimedia (`ns0`, `ns1`, `ns2`).

**Question 3 : Serveurs de messagerie de gmail.com**

```bash
dig gmail.com MX +short
```

```text
5 gmail-smtp-in.l.google.com.
10 alt1.gmail-smtp-in.l.google.com.
20 alt2.gmail-smtp-in.l.google.com.
30 alt3.gmail-smtp-in.l.google.com.
40 alt4.gmail-smtp-in.l.google.com.
```

Réponse : Gmail a 5 serveurs de messagerie. Le nombre avant le nom est la priorité (plus le nombre est bas, plus la priorité est haute). Le serveur `gmail-smtp-in.l.google.com` (priorité 5) est utilise en premier. Si celui-ci est indisponible, le courrier est envoyé a `alt1` (priorité 10), puis `alt2` (priorité 20), etc.

**Question 4 : Serveur DNS utilise**

```bash
cat /etc/resolv.conf
```

```text
nameserver 127.0.0.53
```

Réponse : Sur beaucoup de systèmes Linux modernes, le resolveur local `systemd-resolved` écoute sur `127.0.0.53` et transmet les requêtes au serveur DNS configure (souvent celui fourni par le DHCP, comme la box Internet).

Pour voir le serveur DNS réel :

```bash
resolvectl status 2>/dev/null | grep "DNS Servers"
```

**Question 5 : Trace de resolution pour github.com**

```bash
dig +trace github.com
```

Résultat resume :

```text
.                     IN NS   a.root-servers.net.       (racine)
com.                  IN NS   a.gtld-servers.net.       (TLD .com)
github.com.           IN NS   dns1.p08.nsone.net.       (autoritaire)
github.com.           IN A    140.82.121.3              (reponse)
```

Réponse : La resolution passe par un serveur racine (`a.root-servers.net`), puis le serveur TLD .com (`a.gtld-servers.net`), puis le serveur autoritaire de GitHub (`dns1.p08.nsone.net`), qui donne l'adresse finale.

---

## Navigation

← Fiche précédente : **[03 - Protocoles de transport](03-protocoles-transport.md)**

→ Fiche suivante : **[05 - Routage](05-routage.md)**
