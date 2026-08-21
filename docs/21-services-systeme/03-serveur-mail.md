---
tags:
  - Systèmes
  - Avancé
  - Pratique
description: "Serveur de messagerie : configurer Postfix (MTA) et Dovecot (MDA), comprendre SPF/DKIM/DMARC et les bases anti-spam."
estimated_time: "90 min"
fiche_number: 3
total_fiches: 9
cursus: "Services système"
---

# 03 - Serveur de messagerie

> **En bref** : Tu apprendras a configurer un serveur de messagerie complet avec Postfix pour l'envoi et Dovecot pour la reception, a comprendre les mécanismes d'authentification SPF, DKIM et DMARC, et a mettre en place les bases de la lutte anti-spam. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [Serveur DNS](02-serveur-dns.md) (les enregistrements MX et TXT sont essentiels pour le mail)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le fonctionnement de la chaîne de livraison du mail (MTA, MDA, MUA), configurer Postfix pour envoyer des mails, configurer Dovecot pour les recevoir via IMAP, et comprendre le rôle des enregistrements SPF, DKIM et DMARC dans la lutte contre le spam et l'usurpation d'identité.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un serveur de messagerie ?

**Définition** : Un serveur de messagerie est un ensemble de logiciels qui gerent l'envoi, le transport, la reception et le stockage des e-mails. Il repose sur trois composants principaux : le MTA (envoi et transport), le MDA (livraison dans la boite aux lettres) et le MUA (client de messagerie).

**Le problème que les serveurs de messagerie résolvent** :

Sans serveur de messagerie, voici les problèmes rencontres :

1. **Pas de communication asynchrone** : Sans e-mail, toute communication necessite que les deux parties soient disponibles en même temps (telephone, messagerie instantanée).
2. **Pas de stockage** : Les messages ne sont conserves nulle part. Si le destinataire n'est pas connecte, le message est perdu.
3. **Pas de routage** : Sans mécanisme de transport, un message ne peut pas traverser plusieurs réseaux pour atteindre un destinataire distant.

**Comment les serveurs de messagerie résolvent ces problèmes** :

| Problème | Solution apportée par le serveur de messagerie |
| --- | --- |
| Pas de communication asynchrone | Le serveur stocke le message jusqu'à ce que le destinataire le consulte |
| Pas de stockage | Le MDA place les messages dans une boite aux lettres sur le serveur |
| Pas de routage | Le MTA utilise les enregistrements MX du DNS pour trouver le serveur du destinataire |

**Analogie concrète** : Un serveur de messagerie fonctionne comme le système postal classique. Tu écris une lettre (MUA), tu la déposés a La Poste (MTA d'envoi). La Poste achemine la lettre via ses centres de tri (relais MTA). Le facteur local (MDA) la depose dans ta boite aux lettres. Tu la recuperes quand tu veux (IMAP/POP3).

**Ce qu'un serveur de messagerie n'est PAS** :

- Un serveur de messagerie n'est pas une messagerie instantanée. Le mail est asynchrone : l'envoi et la lecture ne sont pas simultanes. La messagerie instantanée (Slack, WhatsApp) est synchrone.
- Un serveur de messagerie n'est pas un serveur web. Même si tu consultes tes mails via un webmail (Roundcube, Gmail), c'est une interface web qui communique avec le serveur de messagerie en arriere-plan.

---

### Les trois composants : MTA, MDA, MUA

**Définition** : La chaîne de livraison du mail repose sur trois composants distincts, chacun avec un rôle précis.

| Composant | Nom complet | Role | Exemples |
| --- | --- | --- | --- |
| MUA | Mail User Agent | Client de messagerie utilise par l'utilisateur | Thunderbird, Outlook, Roundcube |
| MTA | Mail Transfer Agent | Transport les mails entre serveurs via SMTP | Postfix, Exim, Sendmail |
| MDA | Mail Delivery Agent | Livre les mails dans la boite aux lettres de l'utilisateur | Dovecot, Cyrus |

**Le parcours d'un mail** :

```text
[Expediteur]                                          [Destinataire]
    |                                                       |
  [MUA] --SMTP--> [MTA envoi] --SMTP--> [MTA reception] ---> [MDA]
                   (Postfix)             (Postfix)         (Dovecot)
                                                              |
                                                    [Boite aux lettres]
                                                              |
                                                  [MUA] <--IMAP/POP3--
```

**Les protocoles** :

| Protocole | Port | Role |
| --- | --- | --- |
| SMTP | 25 (non chiffre), 587 (submission), 465 (SMTPS) | Envoi et transport des mails entre serveurs |
| IMAP | 143 (non chiffre), 993 (IMAPS) | Consultation des mails (les mails restent sur le serveur) |
| POP3 | 110 (non chiffre), 995 (POP3S) | Telechargement des mails (les mails sont retires du serveur) |

**Comparaison IMAP vs POP3** :

| IMAP | POP3 |
| --- | --- |
| Les mails restent sur le serveur | Les mails sont telecharges et supprimes du serveur |
| Synchronisation multi-appareils | Un seul appareil accede aux mails |
| Necessite plus d'espace serveur | Libere l'espace serveur après telechargement |
| Protocole recommande aujourd'hui | Utilise surtout pour des besoins spécifiques |

---

### Qu'est-ce que SPF ?

**Définition** : SPF (Sender Policy Framework) est un mécanisme qui permet a un domaine de déclarer quels serveurs sont autorises a envoyer des mails en son nom. Il repose sur un enregistrement TXT dans le DNS.

**Le problème que SPF résout** :

Sans SPF, voici les problèmes rencontres :

1. **Usurpation d'adresse (spoofing)** : N'importe qui peut envoyer un mail en pretendant être `admin@tondomaine.com`. Le protocole SMTP ne verifie pas l'identité de l'expéditeur.
2. **Spam** : Les spammeurs utilisent des domaines légitimes pour envoyer du spam, ce qui ruine la reputation du domaine.

**Comment SPF résout ces problèmes** :

| Problème | Solution apportée par SPF |
| --- | --- |
| Usurpation d'adresse | Le serveur de reception verifie que l'IP de l'expéditeur est autorisée par l'enregistrement SPF |
| Spam | Les mails envoyés depuis des serveurs non autorises sont rejetes ou marques comme spam |

**Exemple d'enregistrement SPF** :

```text
lab.local.  IN  TXT  "v=spf1 mx ip4:192.168.1.20 -all"
```

Signification :

- `v=spf1` : version du protocole SPF
- `mx` : les serveurs MX du domaine sont autorises a envoyer
- `ip4:192.168.1.20` : cette adresse IP est autorisée a envoyer
- `-all` : tous les autres serveurs sont rejetes (hard fail)

---

### Qu'est-ce que DKIM ?

**Définition** : DKIM (DomainKeys Identified Mail) est un mécanisme d'authentification qui ajoute une signature cryptographique aux en-tetes des mails. Le serveur de reception verifie la signature avec la clé publique publiee dans le DNS du domaine.

**Le problème que DKIM résout** :

Sans DKIM, voici les problèmes rencontres :

1. **Modification en transit** : Un mail peut être modifie pendant le transport entre les serveurs. Le destinataire n'a aucun moyen de le savoir.
2. **Authenticite non verifiable** : Meme avec SPF, on ne peut pas prouver que le contenu du mail n'a pas été altere.

**Comment DKIM résout ces problèmes** :

| Problème | Solution apportée par DKIM |
| --- | --- |
| Modification en transit | La signature couvre les en-tetes et le corps du mail. Toute modification invalide la signature |
| Authenticite non verifiable | La clé publique dans le DNS permet de vérifier que le mail a bien été signe par le domaine |

---

### Qu'est-ce que DMARC ?

**Définition** : DMARC (Domain-based Message Authentication, Reporting and Conformance) est une politique qui indique aux serveurs de reception comment traiter les mails qui echouent aux vérifications SPF et DKIM. Il définit aussi un mécanisme de reporting.

**Exemple d'enregistrement DMARC** :

```text
_dmarc.lab.local.  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@lab.local"
```

Signification :

- `v=DMARC1` : version du protocole
- `p=reject` : politique - rejeter les mails qui echouent (autres options : `none`, `quarantine`)
- `rua=mailto:dmarc@lab.local` : adresse ou envoyer les rapports DMARC

**Relation entre SPF, DKIM et DMARC** :

```text
Mail recu par le serveur destinataire
    |
    +--> Verification SPF (l'IP est-elle autorisee ?)
    |        |
    +--> Verification DKIM (la signature est-elle valide ?)
    |        |
    +--> Politique DMARC (que faire si SPF/DKIM echouent ?)
             |
             +--> none : ne rien faire (reporting seul)
             +--> quarantine : placer en spam
             +--> reject : refuser le mail
```

---

## Étapes Pratiques

### Étape 1 : Préparer l'environnement

```bash
# Cree les dossiers de travail
mkdir -p ~/lab-mail/{postfix,dovecot,mail}

# Cree un reseau Docker dedie
docker network create lab-mail-net
```

---

### Étape 2 : Démarrer Postfix (MTA)

> **Note - image communautaire** : `boky/postfix` est une image communautaire (non officielle). Elle convient à l'apprentissage mais n'est pas publiée par le projet Postfix. Pour un déploiement de production, préfère les paquets Postfix officiels de ta distribution. Le tag `:latest` n'est pas déterministe - en environnement réel, épingle une version fixe.

```bash
# Lance Postfix dans un conteneur (image communautaire, usage pedagogique)
docker run -d \
  --name lab-postfix \
  --network lab-mail-net \
  -p 127.0.0.1:2525:25 \
  -e HOSTNAME=mail.lab.local \
  -e DOMAIN=lab.local \
  -v ~/lab-mail/postfix:/etc/postfix \
  boky/postfix:latest

# Verifie que le conteneur demarre
docker logs lab-postfix 2>&1 | tail -5
```

**Résultat attendu** :

```text
postfix/master[1]: daemon started -- version 3.8.x
```

---

### Étape 3 : Configurer Postfix manuellement

Créé un fichier de configuration Postfix :

```bash
# Configuration principale de Postfix
cat > ~/lab-mail/postfix/main.cf << 'EOF'
# Nom du serveur
myhostname = mail.lab.local
mydomain = lab.local

# Domaines pour lesquels ce serveur accepte le mail
mydestination = $myhostname, $mydomain, localhost

# Reseau autorise a envoyer via ce serveur
mynetworks = 127.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

# Format de stockage des mails (Maildir)
home_mailbox = Maildir/

# Banniere SMTP (ne pas reveler trop d'informations)
smtpd_banner = $myhostname ESMTP

# Taille maximale d'un mail (25 Mo)
message_size_limit = 26214400

# Desactive l'authentification SMTP pour le lab
smtpd_sasl_auth_enable = no

# Interface d'ecoute
inet_interfaces = all
inet_protocols = ipv4
EOF
```

Redemarre le conteneur pour appliquer la configuration :

```bash
docker restart lab-postfix
```

---

### Étape 4 : Envoyer un mail de test avec telnet

Le protocole SMTP est un protocole texte. Tu peux envoyer un mail manuellement avec `telnet` pour comprendre le fonctionnement.

```bash
# Installe telnet si necessaire (dans un conteneur Alpine)
docker run --rm -it --network lab-mail-net alpine:3.22 sh -c "
  apk add --no-cache busybox-extras &&
  echo -e 'HELO test\nMAIL FROM:<test@lab.local>\nRCPT TO:<user@lab.local>\nDATA\nSubject: Test\n\nCeci est un mail de test.\n.\nQUIT' |
  telnet lab-postfix 25
"
```

**Résultat attendu** :

```text
220 mail.lab.local ESMTP
250 mail.lab.local
250 2.1.0 Ok
250 2.1.5 Ok
354 End data with <CR><LF>.<CR><LF>
250 2.0.0 Ok: queued as ABC123DEF
221 2.0.0 Bye
```

Chaque ligne correspond a une étape du protocole SMTP :

- `220` : le serveur se presente
- `HELO` : le client se presente
- `MAIL FROM` : définit l'expéditeur
- `RCPT TO` : définit le destinataire
- `DATA` : commence le contenu du message
- `.` : termine le message
- `QUIT` : ferme la connexion

---

### Étape 5 : Démarrer Dovecot (MDA/IMAP)

```bash
# Lance Dovecot dans un conteneur
docker run -d \
  --name lab-dovecot \
  --network lab-mail-net \
  -p 1143:143 \
  -v ~/lab-mail/dovecot:/etc/dovecot \
  -v ~/lab-mail/mail:/var/mail \
  dovecot/dovecot:2.3-latest

# Verifie le demarrage
docker logs lab-dovecot 2>&1 | tail -5
```

**Résultat attendu** :

```text
dovecot: master: Dovecot v2.3.x starting up
```

> **Note - tag Dovecot** : `dovecot/dovecot:latest` pointe vers Dovecot 2.4. La configuration 2.3 de cette fiche n'est **pas** compatible avec 2.4 (auth, chemins, image rootless). Le tag `2.3-latest` conserve le lab tel quel. Voir [Running with Docker](https://doc.dovecot.org/latest/installation/docker.html) et la note 2.3 vers 2.4 sur [doc.dovecot.org](https://doc.dovecot.org/latest/installation/upgrade/2.3-to-2.4.html).

---

### Étape 6 : Configurer Dovecot

```bash
# Configuration minimale de Dovecot
cat > ~/lab-mail/dovecot/dovecot.conf << 'EOF'
# Protocoles actives
protocols = imap

# Emplacement des mails au format Maildir
mail_location = maildir:/var/mail/%u/Maildir

# Authentification (mode texte plat pour le lab)
passdb {
    driver = passwd-file
    args = /etc/dovecot/users
}

userdb {
    driver = passwd-file
    args = /etc/dovecot/users
}

# Ecoute sur toutes les interfaces
listen = *

# Desactive SSL pour le lab (jamais en production)
ssl = no

# Autorise l'authentification en texte plat (lab uniquement)
auth_mechanisms = plain login
disable_plaintext_auth = no
EOF

# Cree un utilisateur de test
# Format : user:password:uid:gid::home
echo "user@lab.local:{PLAIN}password123:1000:1000::/var/mail/user@lab.local" > ~/lab-mail/dovecot/users

# Redemarre Dovecot
docker restart lab-dovecot
```

---

### Étape 7 : Tester l'accès IMAP

```bash
# Teste la connexion IMAP avec curl
curl -v --url "imap://localhost:1143" \
  --user "user@lab.local:password123" \
  --request "LIST \"\" \"*\""
```

**Résultat attendu** :

```text
* Listing mailbox ...
< * LIST (\HasNoChildren) "." "INBOX"
```

Tu vois la boite aux lettres INBOX de l'utilisateur.

---

### Étape 8 : Vérifier les enregistrements DNS pour le mail

En production, les enregistrements DNS suivants sont essentiels :

```bash
# Verifie l'enregistrement MX (si ton serveur DNS est configure)
dig @127.0.0.1 -p 5353 lab.local MX +short
# 10 mail.lab.local.

# Verifie l'enregistrement SPF
dig @127.0.0.1 -p 5353 lab.local TXT +short
# "v=spf1 mx ip4:192.168.1.20 -all"

# Verifie l'enregistrement DMARC
dig @127.0.0.1 -p 5353 _dmarc.lab.local TXT +short
# "v=DMARC1; p=reject; rua=mailto:dmarc@lab.local"
```

---

### Étape 9 : Nettoyage

```bash
# Arrete et supprime tout
docker stop lab-postfix lab-dovecot 2>/dev/null
docker rm lab-postfix lab-dovecot 2>/dev/null
docker network rm lab-mail-net 2>/dev/null
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `postconf -n` | Affiche la configuration active de Postfix (valeurs non par défaut) |
| `postqueue -p` | Affiche la file d'attente des mails |
| `postqueue -f` | Force le reenvoi des mails en file d'attente |
| `postsuper -d ALL` | Supprime tous les mails de la file d'attente |
| `doveadm mailbox list -u user@lab.local` | Liste les dossiers de la boite aux lettres |
| `swaks --to user@lab.local --from test@lab.local --server localhost:2525` | Envoie un mail de test avec swaks |
| `openssl s_client -connect mail.lab.local:993` | Teste la connexion IMAPS |

---

## Pièges Fréquents

### Piège 1 : Open relay (relais ouvert)

⚠️ **Problème** : Ton serveur Postfix accepte de relayer des mails pour n'importe quel domaine, pas seulement les tiens. Les spammeurs l'utilisent comme relais pour envoyer du spam.

✅ **Solution** : Restreins les réseaux autorises avec `mynetworks` et active l'authentification SMTP (`smtpd_sasl_auth_enable = yes`) pour les clients externes. Verifie avec :

```bash
# Teste si ton serveur est un relais ouvert
# Cette commande doit echouer (relay denied)
telnet mail.lab.local 25
HELO test
MAIL FROM:<spam@external.com>
RCPT TO:<victim@gmail.com>
# Reponse attendue : 454 Relay access denied
```

---

### Piège 2 : Oublier les enregistrements DNS

⚠️ **Problème** : Tu configures Postfix et Dovecot mais tu oublies les enregistrements MX, SPF et DKIM dans le DNS. Tes mails sont rejetes ou classes en spam par les serveurs destinataires.

✅ **Solution** : Avant de mettre un serveur mail en production, configure obligatoirement :

- Un enregistrement MX pointant vers ton serveur
- Un enregistrement SPF autorisant tes serveurs
- DKIM avec une clé publique dans le DNS
- Un enregistrement DMARC definissant la politique

---

### Piège 3 : Desactiver SSL en production

⚠️ **Problème** : Tu laisses `ssl = no` dans Dovecot et `smtpd_use_tls = no` dans Postfix. Les mots de passe et les mails circulent en clair sur le réseau.

✅ **Solution** : Active toujours TLS en production. Utilise les ports 993 (IMAPS) et 587 (submission avec STARTTLS) au lieu des ports non chiffres.

---

### Piège 4 : Confondre MTA et MDA

⚠️ **Problème** : Tu penses que Postfix gère tout seul la livraison et la consultation des mails. Tu configures Postfix sans Dovecot et tu ne comprends pas pourquoi les clients IMAP ne se connectent pas.

✅ **Solution** : Postfix (MTA) transporte les mails. Dovecot (MDA) les stocke et les rend accessibles via IMAP/POP3. Les deux sont nécessaires pour un serveur de mail complet.

---

## Checklist de Validation

- [ ] Je sais expliquer les rôles du MTA, MDA et MUA
- [ ] Je connais les protocoles SMTP, IMAP et POP3 avec leurs ports
- [ ] Je sais configurer Postfix pour envoyer des mails
- [ ] Je sais configurer Dovecot pour recevoir des mails via IMAP
- [ ] Je comprends le rôle des enregistrements SPF, DKIM et DMARC
- [ ] Je sais envoyer un mail manuellement via le protocole SMTP
- [ ] Je connais les risques d'un relais ouvert (open relay)

---

## Exercice Pratique

**Énoncé** : Configure un serveur de messagerie complet pour le domaine `entreprise.local` :

1. Postfix comme MTA acceptant les mails pour `@entreprise.local`
2. Dovecot comme MDA avec deux utilisateurs : `alice@entreprise.local` et `bob@entreprise.local`
3. Envoie un mail de `alice` a `bob` via SMTP
4. Consulte le mail de `bob` via IMAP
5. Redige les enregistrements DNS nécessaires (MX, SPF, DMARC)

**Indications** :

- Utilise le réseau Docker `lab-mail-net`
- Créé les fichiers de configuration manuellement
- Teste l'envoi avec `telnet` ou `swaks`
- Teste la reception avec `curl` en mode IMAP

**Résultat attendu** : Alice peut envoyer un mail a Bob, et Bob peut le lire via IMAP.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Preparation :

```bash
# Cree les dossiers
mkdir -p ~/lab-mail-ex/{postfix,dovecot,mail}
docker network create lab-mail-ex-net 2>/dev/null
```

Configuration Postfix :

```bash
cat > ~/lab-mail-ex/postfix/main.cf << 'EOF'
myhostname = mail.entreprise.local
mydomain = entreprise.local
mydestination = $myhostname, $mydomain, localhost
mynetworks = 127.0.0.0/8, 172.16.0.0/12
home_mailbox = Maildir/
smtpd_banner = $myhostname ESMTP
inet_interfaces = all
inet_protocols = ipv4
EOF
```

Configuration Dovecot avec deux utilisateurs :

```bash
cat > ~/lab-mail-ex/dovecot/dovecot.conf << 'EOF'
protocols = imap
mail_location = maildir:/var/mail/%u/Maildir
passdb {
    driver = passwd-file
    args = /etc/dovecot/users
}
userdb {
    driver = passwd-file
    args = /etc/dovecot/users
}
listen = *
ssl = no
auth_mechanisms = plain login
disable_plaintext_auth = no
EOF

# Deux utilisateurs
cat > ~/lab-mail-ex/dovecot/users << 'EOF'
alice@entreprise.local:{PLAIN}alice123:1000:1000::/var/mail/alice@entreprise.local
bob@entreprise.local:{PLAIN}bob123:1001:1001::/var/mail/bob@entreprise.local
EOF
```

Démarrage :

```bash
# Postfix (image communautaire boky/postfix, usage pedagogique uniquement)
docker run -d --name lab-postfix-ex --network lab-mail-ex-net \
  -p 2526:25 -v ~/lab-mail-ex/postfix:/etc/postfix \
  boky/postfix:latest

# Dovecot
docker run -d --name lab-dovecot-ex --network lab-mail-ex-net \
  -p 1144:143 -v ~/lab-mail-ex/dovecot:/etc/dovecot \
  -v ~/lab-mail-ex/mail:/var/mail \
  dovecot/dovecot:2.3-latest
```

Envoi d'un mail d'Alice a Bob :

```bash
docker run --rm -it --network lab-mail-ex-net alpine:3.22 sh -c "
  apk add --no-cache busybox-extras &&
  echo -e 'HELO test\nMAIL FROM:<alice@entreprise.local>\nRCPT TO:<bob@entreprise.local>\nDATA\nSubject: Salut Bob\n\nCeci est un message d Alice.\n.\nQUIT' |
  telnet lab-postfix-ex 25
"
```

Lecture du mail de Bob :

```bash
curl -v --url "imap://localhost:1144/INBOX" \
  --user "bob@entreprise.local:bob123" \
  --request "FETCH 1 BODY[TEXT]"
```

Enregistrements DNS :

```text
; MX
entreprise.local.       IN  MX  10  mail.entreprise.local.

; SPF
entreprise.local.       IN  TXT "v=spf1 mx -all"

; DMARC
_dmarc.entreprise.local. IN  TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@entreprise.local"
```

Nettoyage :

```bash
docker stop lab-postfix-ex lab-dovecot-ex 2>/dev/null
docker rm lab-postfix-ex lab-dovecot-ex 2>/dev/null
docker network rm lab-mail-ex-net 2>/dev/null
```

---

## Navigation

← Fiche précédente : **[02 - Serveur DNS](02-serveur-dns.md)**

→ Fiche suivante : **[04 - Annuaire LDAP](04-annuaire-ldap.md)**
