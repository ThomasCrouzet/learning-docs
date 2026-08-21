---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Firewalls et filtrage : iptables, nftables, règles INPUT/OUTPUT/FORWARD, zones de confiance, ufw."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 14
cursus: "Réseaux"
---

# 07 - Firewalls et filtrage

> **En bref** : Tu apprendras à configurer un firewall Linux avec iptables et nftables, à écrire des règles de filtrage INPUT/OUTPUT/FORWARD, à comprendre les zones de confiance et à utiliser ufw pour simplifier la gestion. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [06 - Commutation et VLANs](06-commutations-vlans.md)
- Connaître les bases de TCP/IP (adresses IP, ports, protocoles)
- Savoir utiliser un terminal Linux

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer un firewall Linux pour contrôler le trafic réseau entrant et sortant, écrire des règles de filtrage précises et utiliser ufw comme interface simplifiée.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un firewall ?

**Définition** : Un firewall (pare-feu) est un système de sécurité qui controle le trafic réseau en autorisant ou bloquant les paquets selon des règles predefinies. Il agit comme un point de passage oblige entre deux réseaux (par exemple entre ton réseau local et Internet).

**Le problème que les firewalls résolvent** :

Sans firewall, voici les problèmes rencontres :

1. **Accès non controle** : N'importe qui sur Internet peut tenter de se connecter a n'importe quel port ouvert sur ta machine. Un serveur SSH, une base de données ou un service de test sont accessibles a tous.
2. **Propagation d'attaques** : Un service compromis peut communiquer librement avec l'extérieur pour telecharger du code malveillant ou exfiltrer des données.
3. **Pas de segmentation** : Tous les services sur le réseau sont au même niveau de confiance. Un visiteur web a le meme accès réseau qu'un administrateur.

**Comment les firewalls résolvent ces problèmes** :

| Problème | Solution apportée par le firewall |
| --- | --- |
| Accès non controle | Seuls les ports explicitement autorises acceptent des connexions |
| Propagation d'attaques | Les règles de sortie limitent les communications vers l'extérieur |
| Pas de segmentation | Les zones de confiance separent les niveaux d'accès |

**Analogie concrète** : Un firewall fonctionne comme le vigile a l'entrée d'un immeuble. Il a une liste de personnes autorisées (les règles). Quand quelqu'un se presente, le vigile verifie son identité (adresse IP source, port de destination, protocole) et décide de le laisser entrer ou de le refuser. Le vigile peut aussi contrôler les sorties : certains employés n'ont pas le droit de sortir des documents sensibles.

**Ce qu'un firewall n'est PAS** :

- Un firewall n'est pas un antivirus. Il ne scanne pas le contenu des fichiers a la recherche de malwares. Il controle uniquement le flux réseau (qui parle a qui, sur quel port).
- Un firewall n'est pas un système de détection d'intrusion (IDS). Il ne detecte pas les comportements suspects dans le trafic autorise. Il applique des règles binaires : autoriser ou bloquer.

**Comparaison firewall a états vs firewall sans état** :

| Firewall sans état (stateless) | Firewall a états (stateful) |
| --- | --- |
| Examine chaque paquet indépendamment | Suit les connexions en cours |
| Necessite des règles pour chaque direction | Autorise automatiquement les réponses |
| Plus rapide mais moins précis | Plus précis mais consomme plus de mémoire |
| Exemple : règles iptables simples | Exemple : iptables avec `-m conntrack` |

---

### Qu'est-ce qu'iptables ?

**Définition** : iptables est l'outil en ligne de commande qui permet de configurer le firewall Netfilter integre au noyau Linux. Il organise les règles de filtrage en tables et en chaînes.

**Le problème qu'iptables résout** :

Sans iptables, voici les problèmes rencontres :

1. **Pas d'interface de gestion** : Netfilter est integre au noyau Linux, mais sans outil pour le configurer, il est inutilisable.
2. **Règles complexes** : Filtrer le trafic necessite de définir des critères précis (IP source, port, protocole, état de connexion). Sans syntaxe structuree, c'est ingerable.

**Comment iptables résout ces problèmes** :

| Problème | Solution apportée par iptables |
| --- | --- |
| Pas d'interface de gestion | Commande en ligne structuree avec une syntaxe coherente |
| Règles complexes | Organisation en tables et chaînes avec des cibles predefinies (ACCEPT, DROP, REJECT) |

**Architecture d'iptables** :

<div class="diagram-design">
<p><a href="../../diagrams/20-reseaux-07-firewalls-filtrage-1.html">Qu&#x27;est-ce qu&#x27;iptables ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/20-reseaux-07-firewalls-filtrage-1.html" title="Qu&#x27;est-ce qu&#x27;iptables ?" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

**Les trois chaînes principales** :

| Chaîne | Role | Exemple |
| --- | --- | --- |
| INPUT | Filtre les paquets destines a la machine locale | Autoriser SSH (port 22) |
| OUTPUT | Filtre les paquets émis par la machine locale | Bloquer les requêtes DNS non autorisées |
| FORWARD | Filtre les paquets qui traversent la machine (routeur) | Autoriser le trafic entre deux réseaux |

**Les trois actions principales** :

| Action (cible) | Comportement |
| --- | --- |
| ACCEPT | Le paquet est autorise a passer |
| DROP | Le paquet est silencieusement supprime (pas de réponse) |
| REJECT | Le paquet est refuse avec un message d'erreur ICMP |

---

### Qu'est-ce que nftables ?

**Définition** : nftables est le successeur d'iptables. Il remplace iptables, ip6tables, arptables et ebtables par un outil unique avec une syntaxe plus claire et de meilleures performances.

**Le problème que nftables résout** :

Sans nftables (en restant sur iptables), voici les problèmes rencontres :

1. **Fragmentation des outils** : IPv4 utilise iptables, IPv6 utilise ip6tables, ARP utilise arptables. Chaque protocole a son propre outil.
2. **Syntaxe lourde** : Chaque modification necessite une commande séparée. Pas de possibilite de regrouper des règles ou d'utiliser des variables.
3. **Performances limitées** : iptables parcourt les règles de maniere linéaire (une par une). Avec des centaines de règles, cela ralentit le traitement.

**Comment nftables résout ces problèmes** :

| Problème | Solution apportée par nftables |
| --- | --- |
| Fragmentation des outils | Un seul outil (`nft`) gère IPv4, IPv6, ARP et les ponts |
| Syntaxe lourde | Syntaxe structuree avec tables, chaînes et ensembles (sets) |
| Performances limitées | Moteur optimise avec recherche par dictionnaire au lieu de parcours linéaire |

**Comparaison iptables vs nftables** :

| iptables | nftables |
| --- | --- |
| Commande `iptables` | Commande `nft` |
| Tables predefinies (filter, nat, mangle) | Tables définies par l'utilisateur |
| Une commande par règle | Fichier de configuration structuree |
| Linéaire (O(n)) | Optimise avec des sets (O(1)) |
| Encore très repandu | Défaut sur Debian 11+, RHEL 9+ |

---

### Qu'est-ce qu'ufw ?

**Définition** : ufw (Uncomplicated Firewall) est une interface simplifiée pour iptables/nftables. Il permet de configurer un firewall avec des commandes simples et lisibles, sans connaître la syntaxe complexe d'iptables.

**Le problème qu'ufw résout** :

Sans ufw, voici les problèmes rencontres :

1. **Complexite de la syntaxe** : Les commandes iptables sont longues et faciles a mal écrire. Une erreur peut bloquer tout le trafic réseau.
2. **Pas de profils applicatifs** : Avec iptables, tu dois connaître les ports de chaque application. ufw fournit des profils predefinies (OpenSSH, Apache, Nginx).

**Comment ufw résout ces problèmes** :

| Problème | Solution apportée par ufw |
| --- | --- |
| Complexite de la syntaxe | Commandes simples : `ufw allow 22`, `ufw deny 80` |
| Pas de profils applicatifs | Profils integres : `ufw allow OpenSSH`, `ufw allow 'Nginx Full'` |

**Analogie concrète** : Si iptables est le panneau de controle complet d'une centrale electrique, ufw est l'interrupteur sur le mur. Les deux contrôlent l'électricité, mais l'interrupteur est suffisant pour la majorité des besoins quotidiens.

---

### Qu'est-ce qu'une zone de confiance ?

**Définition** : Une zone de confiance est un segment de réseau auquel on attribue un niveau de confiance spécifique. Les règles de firewall différent selon la zone d'ou provient ou vers laquelle va le trafic.

**Les zones classiques** :

| Zone | Niveau de confiance | Exemple |
| --- | --- | --- |
| Interne (LAN) | Élevé | Réseau de bureau, machines administrees |
| DMZ | Moyen | Serveurs web, serveurs mail accessibles depuis Internet |
| Externe (WAN) | Faible | Internet, réseaux publics |

**Le problème que les zones résolvent** :

Sans zones, toutes les interfaces réseau ont les mêmes règles. Un serveur web accessible depuis Internet a les memes permissions qu'un serveur de base de données interne. Avec des zones, tu appliques des règles différentes selon l'origine du trafic.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'état actuel du firewall

Avant de modifier quoi que ce soit, verifie l'état actuel du firewall.

```bash
# Affiche toutes les regles iptables en cours
sudo iptables -L -n -v
```

**Résultat attendu** :

```text
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
```

Les trois chaînes sont vides et la politique par défaut est ACCEPT (tout est autorise).

```bash
# Verifie si ufw est installe et son etat
sudo ufw status
```

**Résultat attendu** :

```text
Status: inactive
```

---

### Étape 2 : Configurer des règles iptables de base

```bash
# Autorise les connexions deja etablies et leurs reponses
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Autorise le trafic sur l'interface loopback (localhost)
sudo iptables -A INPUT -i lo -j ACCEPT

# Autorise les connexions SSH (port 22)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Autorise les connexions HTTP (port 80)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Autorise les connexions HTTPS (port 443)
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Autorise le ping (ICMP echo request)
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# Bloque tout le reste en entree
sudo iptables -P INPUT DROP
```

**Résultat attendu** après `sudo iptables -L -n` :

```text
Chain INPUT (policy DROP)
target     prot opt source               destination
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            ctstate RELATED,ESTABLISHED
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:80
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:443
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0            icmptype 8

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
```

---

### Étape 3 : Règles iptables avancées

```bash
# Autorise SSH uniquement depuis le reseau local 192.168.1.0/24
sudo iptables -I INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# Bloque SSH depuis toutes les autres sources
sudo iptables -A INPUT -p tcp --dport 22 -j DROP

# Limite les tentatives de connexion SSH (max 3 par minute)
sudo iptables -I INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
  -m limit --limit 3/min --limit-burst 3 -j ACCEPT

# Journalise les paquets bloques avant de les supprimer
sudo iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 4
sudo iptables -A INPUT -j DROP
```

```bash
# Verifie les logs des paquets bloques
sudo journalctl -k | grep "IPTABLES-DROP" | tail -5
```

**Résultat attendu** :

```text
kernel: IPTABLES-DROP: IN=eth0 OUT= SRC=203.0.113.45 DST=192.168.1.10 ...
```

---

### Étape 4 : Sauvegarder et restaurer les règles iptables

Les règles iptables sont perdues au redémarrage. Tu dois les sauvegarder.

```bash
# Sauvegarde les regles actuelles dans un fichier
sudo iptables-save > /etc/iptables/rules.v4

# Restaure les regles depuis le fichier
sudo iptables-restore < /etc/iptables/rules.v4
```

Pour que les règles se chargent automatiquement au démarrage :

```bash
# Installe le paquet de persistance (Debian/Ubuntu)
sudo apt install -y iptables-persistent

# Les regles sont sauvegardees automatiquement dans :
# /etc/iptables/rules.v4 (IPv4)
# /etc/iptables/rules.v6 (IPv6)
```

---

### Étape 5 : Configurer nftables

```bash
# Cree un fichier de configuration nftables
sudo tee /etc/nftables.conf << 'EOF'
#!/usr/sbin/nft -f

# Vide les regles existantes
flush ruleset

# Table de filtrage pour IPv4
table inet filter {
    # Chaine pour le trafic entrant
    chain input {
        type filter hook input priority 0; policy drop;

        # Autorise les connexions etablies
        ct state established,related accept

        # Autorise le loopback
        iifname lo accept

        # Ping IPv4. La famille inet couvre aussi IPv6 :
        # sans icmpv6 (nd-ns / nd-na), le NDP casse.
        icmp type echo-request accept
        icmpv6 type { nd-ns, nd-na, nd-router-advert, echo-request } accept

        # Autorise SSH, HTTP, HTTPS
        tcp dport { 22, 80, 443 } accept

        # Journalise et bloque le reste
        log prefix "nftables-drop: " drop
    }

    # Chaine pour le trafic sortant
    chain output {
        type filter hook output priority 0; policy accept;
    }

    # Chaine pour le trafic en transit
    chain forward {
        type filter hook forward priority 0; policy drop;
    }
}
EOF
```

```bash
# Applique la configuration
sudo nft -f /etc/nftables.conf

# Verifie les regles en cours
sudo nft list ruleset
```

**Résultat attendu** :

```text
table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;
        ct state established,related accept
        iifname "lo" accept
        icmp type echo-request accept
        icmpv6 type { nd-ns, nd-na, nd-router-advert, echo-request } accept
        tcp dport { 22, 80, 443 } accept
        log prefix "nftables-drop: " drop
    }

    chain output {
        type filter hook output priority filter; policy accept;
    }

    chain forward {
        type filter hook forward priority filter; policy drop;
    }
}
```

---

### Étape 6 : Utiliser ufw

```bash
# Installe ufw si necessaire (Debian/Ubuntu)
sudo apt install -y ufw

# Definit la politique par defaut : bloquer en entree, autoriser en sortie
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autorise SSH (important : a faire AVANT d'activer le firewall)
sudo ufw allow ssh

# Autorise HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Active le firewall
sudo ufw enable
```

**Résultat attendu** :

```text
Default incoming policy changed to 'deny'
Default outgoing policy changed to 'allow'
Rules updated
Rules updated (v6)
Firewall is active and enabled on system startup
```

```bash
# Verifie l'etat du firewall
sudo ufw status verbose
```

**Résultat attendu** :

```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

---

### Étape 7 : Règles ufw avancées

```bash
# Autorise SSH uniquement depuis un sous-reseau
sudo ufw allow from 192.168.1.0/24 to any port 22

# Autorise un port specifique pour une adresse IP
sudo ufw allow from 10.0.0.5 to any port 3306

# Bloque une adresse IP specifique
sudo ufw deny from 203.0.113.100

# Supprime une regle par numero
sudo ufw status numbered
sudo ufw delete 3

# Autorise un profil applicatif
sudo ufw app list
sudo ufw allow 'Nginx Full'
```

```bash
# Affiche les regles avec numeros
sudo ufw status numbered
```

**Résultat attendu** :

```text
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
[ 4] 22/tcp                     ALLOW IN    192.168.1.0/24
[ 5] 3306/tcp                   ALLOW IN    10.0.0.5
[ 6] Nginx Full                 ALLOW IN    Anywhere
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `sudo iptables -L -n -v` | Liste toutes les règles iptables avec compteurs |
| `sudo iptables -F` | Vide toutes les règles. **Danger** : si la politique par défaut est déjà DROP, tu peux couper ta session SSH. Prépare une règle ACCEPT pour SSH avant, ou travaille en console locale. |
| `sudo iptables-save` | Exporte les règles au format texte |
| `sudo iptables-restore < fichier` | Restaure les règles depuis un fichier |
| `sudo nft list ruleset` | Affiche toutes les règles nftables |
| `sudo nft flush ruleset` | Vide toutes les règles nftables |
| `sudo ufw status verbose` | Affiche l'état detaille d'ufw |
| `sudo ufw enable` | Active le firewall ufw |
| `sudo ufw disable` | Desactive le firewall ufw |
| `sudo ufw reset` | Reinitialise toutes les règles ufw |
| `sudo ufw allow <port>/tcp` | Autorise un port TCP |
| `sudo ufw deny from <ip>` | Bloque une adresse IP |

---

## Pièges Fréquents

### Piège 1 : Se bloquer soi-meme en SSH

⚠️ **Problème** : Tu changes la politique par défaut a DROP sans avoir autorise SSH avant. Tu perds l'accès a ta machine.

✅ **Solution** : Autorise **toujours** SSH avant de changer la politique par défaut :

```bash
# ✅ Bon ordre : autoriser SSH d'abord
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -P INPUT DROP

# ❌ Mauvais ordre : politique DROP d'abord = deconnexion immediate
sudo iptables -P INPUT DROP
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT  # Trop tard
```

---

### Piège 2 : Oublier les connexions etablies

⚠️ **Problème** : Tu autorises le port 80 en entrée mais les réponses HTTP ne sortent pas. Le serveur web ne répond pas.

✅ **Solution** : Ajoute une règle pour les connexions etablies en première position :

```bash
# Cette regle autorise les paquets de reponse pour les connexions deja etablies
sudo iptables -I INPUT 1 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
```

---

### Piège 3 : Règles iptables perdues au redémarrage

⚠️ **Problème** : Tu configures des règles iptables, tu redemarres la machine, et toutes les règles ont disparu.

✅ **Solution** : Installe `iptables-persistent` ou sauvegarde manuellement :

```bash
# Sauvegarde apres chaque modification
sudo iptables-save > /etc/iptables/rules.v4
```

---

### Piège 4 : Confondre DROP et REJECT

⚠️ **Problème** : Tu utilises DROP pour tout, ce qui rend le diagnostic difficile. Les clients attendent un timeout au lieu de recevoir une erreur immediate.

✅ **Solution** : Utilise REJECT pour les services internes (retour d'erreur rapide) et DROP pour le trafic externe (ne revele pas l'existence du service) :

```bash
# Pour le trafic interne : REJECT (reponse rapide)
sudo iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 3306 -j REJECT

# Pour le trafic externe : DROP (pas de reponse)
sudo iptables -A INPUT -p tcp --dport 3306 -j DROP
```

---

## Checklist de Validation

- [ ] Je sais expliquer la difference entre INPUT, OUTPUT et FORWARD
- [ ] Je sais écrire une règle iptables pour autoriser un port
- [ ] Je sais limiter l'accès SSH a un sous-réseau spécifique
- [ ] Je sais sauvegarder et restaurer les règles iptables
- [ ] Je comprends la syntaxe nftables et je sais écrire un fichier de configuration
- [ ] Je sais utiliser ufw pour configurer un firewall rapidement
- [ ] Je sais expliquer la difference entre DROP et REJECT
- [ ] Je connais les zones de confiance (LAN, DMZ, WAN)

---

## Exercice Pratique

**Énoncé** : Configure un firewall pour un serveur web qui heberge un site et une base de données. Le serveur doit respecter ces contraintes :

1. Autoriser SSH uniquement depuis le réseau 192.168.1.0/24
2. Autoriser HTTP (80) et HTTPS (443) depuis n'importe ou
3. Autoriser PostgreSQL (5432) uniquement depuis 10.0.0.0/8 (réseau applicatif)
4. Bloquer tout le reste en entrée
5. Autoriser tout le trafic en sortie
6. Journaliser les paquets bloques

**Indications** :

- Commence par les connexions etablies (conntrack)
- N'oublie pas l'interface loopback
- Utilise iptables ou nftables selon ta preference
- Teste avec `sudo iptables -L -n -v` ou `sudo nft list ruleset`

**Résultat attendu** : Le serveur accepte SSH depuis le LAN, HTTP/HTTPS depuis partout, PostgreSQL depuis le réseau applicatif, et bloque tout le reste avec journalisation.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Solution avec iptables** :

```bash
# Vide les regles existantes
# Attention lab : -F vide les règles. Sur un serveur distant, assure-toi d'avoir un accès console
# ou une règle SSH ACCEPT avant de passer INPUT en DROP.
sudo iptables -F

# Autorise les connexions etablies
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Autorise le loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Autorise SSH depuis le LAN uniquement
sudo iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# Autorise HTTP et HTTPS depuis partout
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Autorise PostgreSQL depuis le reseau applicatif
sudo iptables -A INPUT -p tcp --dport 5432 -s 10.0.0.0/8 -j ACCEPT

# Journalise les paquets bloques
sudo iptables -A INPUT -j LOG --log-prefix "FW-DROP: " --log-level 4

# Politique par defaut : bloquer en entree
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Sauvegarde
sudo iptables-save > /etc/iptables/rules.v4
```

**Solution avec nftables** :

```text
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        ct state established,related accept
        iifname lo accept
        tcp dport 22 ip saddr 192.168.1.0/24 accept
        tcp dport { 80, 443 } accept
        tcp dport 5432 ip saddr 10.0.0.0/8 accept
        log prefix "FW-DROP: " drop
    }
    chain output {
        type filter hook output priority 0; policy accept;
    }
    chain forward {
        type filter hook forward priority 0; policy drop;
    }
}
```

**Solution avec ufw** :

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.1.0/24 to any port 22
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 10.0.0.0/8 to any port 5432
sudo ufw enable
```

---

## Navigation

← Fiche précédente : **[06 - Commutation et VLANs](06-commutations-vlans.md)**

→ Fiche suivante : **[08 - Services réseau](08-services-reseau.md)**
