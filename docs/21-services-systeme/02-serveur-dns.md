---
tags:
  - Systèmes
  - Intermédiaire
  - Pratique
description: "Serveur DNS : configurer Bind9 et dnsmasq, créer des zones, gérer les enregistrements et comprendre la resolution recursive et iterative."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 9
cursus: "Services système"
---

# 02 - Serveur DNS

> **En bref** : Tu apprendras a configurer un serveur DNS avec Bind9 et dnsmasq, a créer des zones et des enregistrements, et a comprendre la difference entre resolution recursive et iterative. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [Serveur web avance](01-serveur-web-avance.md)
- Connaitre les bases de DNS et DHCP - cursus [Réseaux](../20-reseaux/index.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras installer et configurer un serveur DNS avec Bind9 dans un conteneur Docker, créer des zones directes et inverses, ajouter différents types d'enregistrements (A, AAAA, CNAME, MX, TXT, NS) et diagnostiquer les problèmes de resolution DNS.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un serveur DNS ?

**Définition** : Un serveur DNS (Domain Name System) est un service qui traduit les noms de domaine lisibles par les humains (comme `example.com`) en adresses IP utilisables par les machines (comme `104.20.23.154`). C'est l'annuaire téléphonique d'Internet.

**Le problème que le DNS résout** :

Sans DNS, voici les problèmes rencontres :

1. **Memoriser des adresses IP** : Tu devrais taper `104.20.23.154` au lieu de `example.com` pour visiter chaque site web. Avec des milliards de sites, c'est impossible.
2. **Pas de flexibilité** : Si un serveur change d'adresse IP, tu devrais mettre a jour l'adresse dans chaque machine qui y accede.
3. **Pas de services associes** : Sans DNS, il n'y a aucun moyen de savoir quel serveur gère le mail pour un domaine, ou quel est le serveur de secours.

**Comment le DNS résout ces problèmes** :

| Problème | Solution apportée par le DNS |
| --- | --- |
| Memoriser des adresses IP | Le DNS traduit automatiquement les noms de domaine en adresses IP |
| Pas de flexibilité | Modifier l'enregistrement DNS met à jour l'adresse pour tous les clients qui résolvent ce nom |
| Pas de services associes | Les enregistrements MX, SRV et TXT définissent les serveurs de mail, services et metadonnees |

**Analogie concrète** : Le DNS fonctionne comme un annuaire téléphonique. Tu ne retiens pas le numéro de telephone de chaque personne. Tu cherches son nom dans l'annuaire et tu obtiens son numéro. Si une personne change de numéro, seul l'annuaire est mis a jour. Tous ceux qui cherchent cette personne obtiendront automatiquement le nouveau numéro.

**Ce qu'un serveur DNS n'est PAS** :

- Un serveur DNS n'est pas un serveur web. Le DNS ne sert pas de pages web. Il traduit des noms en adresses. Une fois l'adresse obtenue, le navigateur contacte directement le serveur web.
- Un serveur DNS n'est pas un registrar. Le registrar est l'organisme auprès duquel tu achetes un nom de domaine (comme OVH ou Gandi). Le serveur DNS heberge les enregistrements de resolution.

---

### Les types d'enregistrements DNS

**Définition** : Les enregistrements DNS (ou Resource Records, RR) sont les entrées stockées dans une zone DNS. Chaque enregistrement associe un nom a une valeur, avec un type spécifique.

**Les types d'enregistrements principaux** :

| Type | Nom complet | Role | Exemple |
| --- | --- | --- | --- |
| A | Address | Associe un nom a une adresse IPv4 | `web.lab.local` -> `192.168.1.10` |
| AAAA | IPv6 Address | Associe un nom a une adresse IPv6 | `web.lab.local` -> `2001:db8::1` |
| CNAME | Canonical Name | Créé un alias vers un autre nom | `www.lab.local` -> `web.lab.local` |
| MX | Mail Exchange | Définit le serveur de mail pour un domaine | `lab.local` -> `mail.lab.local` (priorité 10) |
| NS | Name Server | Définit les serveurs DNS autoritaires | `lab.local` -> `ns1.lab.local` |
| TXT | Text | Stocke du texte libre (SPF, DKIM, vérification) | `lab.local` -> `v=spf1 mx -all` |
| PTR | Pointer | Resolution inverse (adresse IP vers nom) | `10.1.168.192.in-addr.arpa` -> `web.lab.local` |
| SOA | Start of Authority | Définit les paramètres de la zone (serveur principal, contact, numéros de serie) | Obligatoire dans chaque zone |

---

### Resolution recursive vs iterative

**Définition** : La resolution recursive et la resolution iterative sont deux méthodes par lesquelles un serveur DNS répond aux requêtes des clients.

**Resolution recursive** :

Le client envoie sa requête a un serveur DNS recursif (souvent celui de ton FAI ou un resolver public comme `8.8.8.8`). Ce serveur prend en charge toute la resolution : il interroge les serveurs racine, les serveurs TLD et les serveurs autoritaires jusqu'a obtenir la réponse finale, puis la renvoie au client.

```text
Client -> Serveur recursif -> Racine -> TLD (.com) -> Autoritaire (example.com)
                                                                    |
Client <- Serveur recursif <---------- Reponse : 104.20.23.154 <----+
```

**Resolution iterative** :

Le serveur DNS ne fait pas le travail a la place du client. Il répond "je ne sais pas, mais demande a ce serveur". Le client (ou le resolver) doit poser la question a chaque serveur de la chaîne lui-même.

```text
Client -> Racine : "Ou est example.com ?"
Client <- Racine : "Demande au serveur TLD .com"

Client -> TLD .com : "Ou est example.com ?"
Client <- TLD .com : "Demande au serveur autoritaire ns1.example.com"

Client -> ns1.example.com : "Quelle est l'IP de example.com ?"
Client <- ns1.example.com : "104.20.23.154"
```

**Comparaison recursive vs iterative** :

| Resolution recursive | Resolution iterative |
| --- | --- |
| Le serveur fait tout le travail | Le client fait le travail étape par étape |
| Le client envoie une seule requête | Le client envoie plusieurs requêtes |
| Utilisée entre les clients finaux et les resolvers | Utilisée entre les resolvers et les serveurs autoritaires |

---

### Qu'est-ce qu'une zone DNS ?

**Définition** : Une zone DNS est un fichier (ou un ensemble de données) qui contient tous les enregistrements DNS pour un domaine et ses sous-domaines. Le serveur DNS charge ces zones pour répondre aux requêtes.

**Le problème que les zones résolvent** :

Sans zones, voici les problèmes rencontres :

1. **Base de données monolithique** : Tous les enregistrements de tous les domaines seraient dans un seul fichier géant, impossible a gérer.
2. **Pas de délégation** : Il serait impossible de déléguer la gestion d'un sous-domaine a un autre serveur DNS.

**Comment les zones résolvent ces problèmes** :

| Problème | Solution apportée par les zones |
| --- | --- |
| Base de données monolithique | Chaque domaine a sa propre zone avec ses propres enregistrements |
| Pas de délégation | Les enregistrements NS permettent de déléguer un sous-domaine a un autre serveur DNS |

**Types de zones** :

- **Zone directe** : traduit les noms en adresses IP (la plus courante)
- **Zone inverse** : traduit les adresses IP en noms (utilisée pour le diagnostic et la vérification)

**Analogie concrète** : Une zone DNS est comme le cahier d'un standardiste dans une entreprise. Chaque département (domaine) a son propre cahier avec la liste des numéros de poste (enregistrements). Le standardiste central connaît les numéros directs de chaque département (délégation NS) et peut rediriger les appels.

---

## Étapes Pratiques

### Étape 1 : Démarrer un serveur Bind9 dans Docker

```bash
# Cree les dossiers de configuration
mkdir -p ~/lab-dns/{config,zones,cache}

# Lance le conteneur Bind9
docker run -d \
  --name lab-dns \
  -p 5353:53/udp \
  -p 5353:53/tcp \
  -v ~/lab-dns/config:/etc/bind \
  -v ~/lab-dns/zones:/var/lib/bind \
  -v ~/lab-dns/cache:/var/cache/bind \
  internetsystemsconsortium/bind9:9.20
```

**Résultat attendu** :

```text
Unable to find image 'internetsystemsconsortium/bind9:9.20' locally
9.20: Pulling from internetsystemsconsortium/bind9
...
Status: Downloaded newer image for internetsystemsconsortium/bind9:9.20
```

---

### Étape 2 : Configurer Bind9

Créé le fichier de configuration principal :

```bash
# Configuration principale de Bind9
cat > ~/lab-dns/config/named.conf << 'EOF'
// Options globales
options {
    directory "/var/cache/bind";

    // Ecoute sur toutes les interfaces
    listen-on { any; };
    listen-on-v6 { any; };

    // Autorise les requetes depuis tous les reseaux (lab uniquement)
    allow-query { any; };

    // Active la resolution recursive
    recursion yes;

    // Serveurs DNS externes pour les requetes non resolues localement
    forwarders {
        8.8.8.8;
        1.1.1.1;
    };

    // Si les forwarders echouent, tente la resolution directe
    forward first;

    // Desactive DNSSEC pour simplifier le lab
    dnssec-validation no;
};

// Zone directe pour lab.local
zone "lab.local" {
    type master;
    file "/var/lib/bind/db.lab.local";
    allow-update { none; };
};

// Zone inverse pour le reseau 192.168.1.0/24
zone "1.168.192.in-addr.arpa" {
    type master;
    file "/var/lib/bind/db.192.168.1";
    allow-update { none; };
};
EOF
```

---

### Étape 3 : Creer la zone directe

Le fichier de zone directe contient les enregistrements qui traduisent les noms en adresses IP.

```bash
# Zone directe : lab.local
cat > ~/lab-dns/zones/db.lab.local << 'EOF'
$TTL    86400   ; Duree de vie par defaut : 24 heures
@       IN      SOA     ns1.lab.local. admin.lab.local. (
                        2025040701      ; Numero de serie (AAAAMMJJNN)
                        3600            ; Refresh : 1 heure
                        900             ; Retry : 15 minutes
                        604800          ; Expire : 7 jours
                        86400           ; Negative cache TTL : 24 heures
)

; Serveurs de noms
@       IN      NS      ns1.lab.local.

; Enregistrements A (nom -> IPv4)
ns1     IN      A       192.168.1.1
web     IN      A       192.168.1.10
mail    IN      A       192.168.1.20
db      IN      A       192.168.1.30
app     IN      A       192.168.1.40

; Alias (CNAME)
www     IN      CNAME   web.lab.local.
ftp     IN      CNAME   web.lab.local.

; Serveur de mail (MX)
@       IN      MX      10      mail.lab.local.

; Enregistrements TXT
@       IN      TXT     "v=spf1 mx -all"
EOF
```

Explication de chaque partie :

- `$TTL 86400` : durée de vie par défaut des enregistrements (24h). Les resolvers mettront en cache les réponses pendant cette durée.
- `SOA` : Start of Authority. Définit le serveur DNS principal (`ns1.lab.local.`), le contact (`admin.lab.local.` = `admin@lab.local`) et les timers de synchronisation.
- `NS` : declare que `ns1.lab.local` est le serveur DNS autoritaire pour cette zone.
- `A` : associe un nom a une adresse IPv4.
- `CNAME` : créé un alias. `www.lab.local` pointe vers `web.lab.local`.
- `MX` : définit le serveur de mail avec une priorité (10). Plus le chiffre est bas, plus la priorité est haute.
- `TXT` : enregistrement texte utilise ici pour SPF (qui autorise les serveurs a envoyer du mail pour ce domaine).

---

### Étape 4 : Creer la zone inverse

La zone inverse permet la resolution d'adresse IP vers nom (reverse DNS).

```bash
# Zone inverse : 192.168.1.0/24
cat > ~/lab-dns/zones/db.192.168.1 << 'EOF'
$TTL    86400
@       IN      SOA     ns1.lab.local. admin.lab.local. (
                        2025040701
                        3600
                        900
                        604800
                        86400
)

@       IN      NS      ns1.lab.local.

; Enregistrements PTR (IP -> nom)
1       IN      PTR     ns1.lab.local.
10      IN      PTR     web.lab.local.
20      IN      PTR     mail.lab.local.
30      IN      PTR     db.lab.local.
40      IN      PTR     app.lab.local.
EOF
```

Le chiffre a gauche représente le dernier octet de l'adresse IP. L'enregistrement `10 IN PTR web.lab.local.` signifie que `192.168.1.10` correspond a `web.lab.local`.

---

### Étape 5 : Redémarrer Bind9 et tester

```bash
# Redemarre le conteneur pour charger la configuration
docker restart lab-dns

# Verifie que le conteneur est bien demarre
docker ps --filter name=lab-dns

# Verifie les logs pour detecter d'eventuelles erreurs
docker logs lab-dns 2>&1 | tail -10
```

**Résultat attendu (pas d'erreur)** :

```text
zone lab.local/IN: loaded serial 2025040701
zone 1.168.192.in-addr.arpa/IN: loaded serial 2025040701
running
```

---

### Étape 6 : Interroger le serveur DNS

Utilise `dig` pour tester la resolution de noms.

```bash
# Resolution directe : nom -> IP
dig @127.0.0.1 -p 5353 web.lab.local

# Resolution d'un alias CNAME
dig @127.0.0.1 -p 5353 www.lab.local

# Enregistrement MX (serveur de mail)
dig @127.0.0.1 -p 5353 lab.local MX

# Enregistrement TXT
dig @127.0.0.1 -p 5353 lab.local TXT

# Resolution inverse : IP -> nom
dig @127.0.0.1 -p 5353 -x 192.168.1.10
```

**Résultat attendu pour `web.lab.local`** :

```text
;; ANSWER SECTION:
web.lab.local.          86400   IN      A       192.168.1.10

;; Query time: 1 msec
;; SERVER: 127.0.0.1#5353(127.0.0.1)
```

**Résultat attendu pour `www.lab.local`** :

```text
;; ANSWER SECTION:
www.lab.local.          86400   IN      CNAME   web.lab.local.
web.lab.local.          86400   IN      A       192.168.1.10
```

Tu vois que la resolution suit le CNAME : `www` -> `web` -> `192.168.1.10`.

**Résultat attendu pour la resolution inverse** :

```text
;; ANSWER SECTION:
10.1.168.192.in-addr.arpa. 86400 IN     PTR     web.lab.local.
```

---

### Étape 7 : Tester le forwarding

Le serveur DNS doit aussi résoudre les noms externes via les forwarders.

```bash
# Teste la resolution d'un domaine externe
dig @127.0.0.1 -p 5353 google.com
```

**Résultat attendu** :

```text
;; ANSWER SECTION:
google.com.             300     IN      A       142.250.179.110

;; Query time: 25 msec
```

Le serveur a transmis la requête a ses forwarders (`8.8.8.8` ou `1.1.1.1`) et a obtenu la réponse.

---

### Étape 8 : Configurer dnsmasq (alternative legere)

Pour des besoins simples (resolution locale, lab), dnsmasq est une alternative beaucoup plus legere que Bind9.

```bash
# Arrete le conteneur Bind9
docker stop lab-dns

# Lance dnsmasq dans un conteneur
docker run -d \
  --name lab-dnsmasq \
  -p 5353:53/udp \
  -p 5353:53/tcp \
  --cap-add NET_ADMIN \
  alpine:3.24 sh -c "
    apk add --no-cache dnsmasq &&
    echo 'address=/web.lab.local/192.168.1.10' > /etc/dnsmasq.d/lab.conf &&
    echo 'address=/mail.lab.local/192.168.1.20' >> /etc/dnsmasq.d/lab.conf &&
    echo 'address=/app.lab.local/192.168.1.40' >> /etc/dnsmasq.d/lab.conf &&
    echo 'server=8.8.8.8' >> /etc/dnsmasq.d/lab.conf &&
    dnsmasq --no-daemon --log-queries
  "
```

Teste la resolution :

```bash
# Teste dnsmasq
dig @127.0.0.1 -p 5353 web.lab.local +short
```

**Résultat attendu** :

```text
192.168.1.10
```

---

### Étape 9 : Nettoyage

```bash
# Arrete et supprime les conteneurs
docker stop lab-dns lab-dnsmasq 2>/dev/null
docker rm lab-dns lab-dnsmasq 2>/dev/null
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `dig @serveur domaine` | Interroge un serveur DNS pour un domaine |
| `dig @serveur domaine MX` | Interroge les enregistrements MX |
| `dig @serveur -x IP` | Resolution inverse (IP vers nom) |
| `dig +short domaine` | Affiche uniquement la réponse (format court) |
| `dig +trace domaine` | Affiche toute la chaîne de resolution depuis la racine |
| `nslookup domaine serveur` | Alternative simple a `dig` pour les requêtes DNS |
| `host domaine serveur` | Autre alternative simple pour les requêtes DNS |

---

## Pièges Frequents

### Piège 1 : Oublier le point final dans les noms FQDN

⚠️ **Problème** : Tu écris `web.lab.local` au lieu de `web.lab.local.` dans un fichier de zone. Bind9 interprete le nom comme relatif et ajoute le domaine de la zone, ce qui donne `web.lab.local.lab.local.`.

✅ **Solution** : Dans les fichiers de zone, les noms FQDN (Fully Qualified Domain Names) doivent toujours se terminer par un point. Le point indique la racine DNS et empêche Bind9 d'ajouter le nom de la zone.

```text
; ❌ Incorrect (Bind9 ajoute .lab.local -> web.lab.local.lab.local.)
www     IN      CNAME   web.lab.local

; ✅ Correct (le point final indique un FQDN)
www     IN      CNAME   web.lab.local.
```

---

### Piège 2 : Ne pas incrementer le numéro de serie

⚠️ **Problème** : Tu modifies un fichier de zone mais tu oublies d'incrementer le numéro de serie dans l'enregistrement SOA. Les serveurs secondaires ne detectent pas le changement et ne mettent pas a jour leur copie.

✅ **Solution** : A chaque modification d'un fichier de zone, incremente le numéro de serie. La convention est `AAAAMMJJNN` (année-mois-jour-numéro de revision du jour). Exemple : `2025040701` -> `2025040702`.

---

### Piège 3 : Confondre resolution recursive et iterative

⚠️ **Problème** : Tu actives la recursion sur un serveur DNS autoritaire expose sur Internet. Des attaquants utilisent ton serveur comme amplificateur DNS pour des attaques DDoS.

✅ **Solution** : La recursion doit être activee uniquement sur les resolvers internes (serveurs DNS destines aux clients de ton réseau). Les serveurs DNS autoritaires exposes sur Internet doivent avoir `recursion no;`.

---

### Piège 4 : CNAME sur la racine du domaine

⚠️ **Problème** : Tu essaies de créer un enregistrement CNAME pour la racine du domaine (`@` ou `lab.local.`). Bind9 refuse car un CNAME ne peut pas coexister avec d'autres enregistrements (SOA, NS, MX).

✅ **Solution** : Utilise un enregistrement A pour la racine du domaine. Le CNAME est réserve aux sous-domaines.

```text
; ❌ Interdit : CNAME sur la racine
@       IN      CNAME   web.lab.local.

; ✅ Correct : A sur la racine
@       IN      A       192.168.1.10
```

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle d'un serveur DNS
- [ ] Je connais les principaux types d'enregistrements (A, AAAA, CNAME, MX, NS, TXT, PTR, SOA)
- [ ] Je comprends la difference entre resolution recursive et iterative
- [ ] Je sais configurer Bind9 avec un fichier `named.conf`
- [ ] Je sais créer une zone directe et une zone inverse
- [ ] Je sais utiliser `dig` pour interroger un serveur DNS
- [ ] Je sais configurer dnsmasq comme alternative legere

---

## Exercice Pratique

**Enonce** : Créé un serveur DNS Bind9 pour le domaine `entreprise.local` avec les enregistrements suivants :

1. `ns1.entreprise.local` -> `10.0.0.1` (serveur de noms)
2. `web.entreprise.local` -> `10.0.0.10` (serveur web)
3. `api.entreprise.local` -> `10.0.0.11` (serveur API)
4. `www.entreprise.local` -> alias vers `web.entreprise.local`
5. `mail.entreprise.local` -> `10.0.0.20` (serveur mail)
6. Enregistrement MX pointant vers `mail.entreprise.local` avec priorité 10
7. Enregistrement TXT pour SPF : `v=spf1 mx -all`
8. Zone inverse pour le réseau `10.0.0.0/24`

**Indications** :

- Utilise le conteneur Bind9 du lab
- N'oublie pas les points finaux dans les FQDN
- Teste chaque enregistrement avec `dig`

**Résultat attendu** : Tous les enregistrements résolvent correctement dans les deux sens (direct et inverse).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Configuration `named.conf` :

```bash
cat > ~/lab-dns/config/named.conf << 'EOF'
options {
    directory "/var/cache/bind";
    listen-on { any; };
    allow-query { any; };
    recursion yes;
    forwarders { 8.8.8.8; };
    dnssec-validation no;
};

zone "entreprise.local" {
    type master;
    file "/var/lib/bind/db.entreprise.local";
    allow-update { none; };
};

zone "0.0.10.in-addr.arpa" {
    type master;
    file "/var/lib/bind/db.10.0.0";
    allow-update { none; };
};
EOF
```

Zone directe :

```bash
cat > ~/lab-dns/zones/db.entreprise.local << 'EOF'
$TTL    86400
@       IN      SOA     ns1.entreprise.local. admin.entreprise.local. (
                        2025040701
                        3600
                        900
                        604800
                        86400
)

@       IN      NS      ns1.entreprise.local.

ns1     IN      A       10.0.0.1
web     IN      A       10.0.0.10
api     IN      A       10.0.0.11
mail    IN      A       10.0.0.20

www     IN      CNAME   web.entreprise.local.

@       IN      MX      10      mail.entreprise.local.
@       IN      TXT     "v=spf1 mx -all"
EOF
```

Zone inverse :

```bash
cat > ~/lab-dns/zones/db.10.0.0 << 'EOF'
$TTL    86400
@       IN      SOA     ns1.entreprise.local. admin.entreprise.local. (
                        2025040701
                        3600
                        900
                        604800
                        86400
)

@       IN      NS      ns1.entreprise.local.

1       IN      PTR     ns1.entreprise.local.
10      IN      PTR     web.entreprise.local.
11      IN      PTR     api.entreprise.local.
20      IN      PTR     mail.entreprise.local.
EOF
```

Tests :

```bash
# Redemarre Bind9
docker restart lab-dns

# Teste chaque enregistrement
dig @127.0.0.1 -p 5353 web.entreprise.local +short
# 10.0.0.10

dig @127.0.0.1 -p 5353 www.entreprise.local +short
# web.entreprise.local.
# 10.0.0.10

dig @127.0.0.1 -p 5353 entreprise.local MX +short
# 10 mail.entreprise.local.

dig @127.0.0.1 -p 5353 entreprise.local TXT +short
# "v=spf1 mx -all"

dig @127.0.0.1 -p 5353 -x 10.0.0.10 +short
# web.entreprise.local.
```

---

## Navigation

← Fiche précédente : **[01 - Serveur web avancé](01-serveur-web-avance.md)**

→ Fiche suivante : **[03 - Serveur de messagerie](03-serveur-mail.md)**
