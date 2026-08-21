---
tags:
  - Méthodologie
  - Débutant
  - Pratique
description: "02 - La Sécurité et l'Authentification Web"
estimated_time: "40 min"
fiche_number: 2
total_fiches: 4
cursus: "Développement logiciel"
id: "transversal.professional-skills.software.securite-authentification"
course_id: "transversal.professional-skills"
module_id: "transversal.professional-skills.software"
content_type: "lesson"
order: 2
---

# 02 - La Sécurité et l'Authentification Web

> **En bref** : À la fin de cette fiche, tu sauras implémenter une authentification sécurisée (sessions, JWT), hasher correctement les mots de passe, configurer HTTPS/SSL, et protéger ton application contre les vulnérabilités web courantes (OWASP Top 10). Lecture estimée : 40 min.


## Prérequis

- Fiche **[01 - L'Architecture Serveur Web](01-architecture-serveur-web.md)**
- Fiche **[02-php/01-introduction-php.md](../../02-php/01-introduction-php.md)** (PHP)
- Fiche **[03-symfony/01-architecture-symfony.md](../../03-symfony/01-architecture-symfony.md)** (Symfony)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter une authentification sécurisée (sessions, JWT), hasher correctement les mots de passe, configurer HTTPS/SSL, et protéger ton application contre les vulnérabilités web courantes (OWASP Top 10).

---

## Concepts

### Qu'est-ce que l'authentification vs l'autorisation ?

**Définition** :

| Concept | Question | Exemple |
| ------- | -------- | ------- |
| **Authentification** | Qui es-tu ? | Login avec email/mot de passe |
| **Autorisation** | Qu'as-tu le droit de faire ? | Accès admin ou simple utilisateur |

**Analogie concrète** : À l'entrée d'un immeuble, le badge vérifie que tu es bien un résident (authentification). Une fois à l'intérieur, le même badge détermine à quels étages tu as accès (autorisation).

---

### Comment hasher un mot de passe ?

**Définition** : Le hashage est une transformation irréversible qui convertit un mot de passe en une chaîne de caractères fixe. On ne stocke jamais le mot de passe en clair.

**Ce qu'il faut utiliser** :

| Algorithme | Usage | Recommandation |
| ---------- | ----- | -------------- |
| **bcrypt** | Standard actuel | Recommandé |
| **Argon2id** | Plus récent et sécurisé | Très recommandé |
| MD5, SHA1 | Ancien | INTERDIT (trop rapide) |
| SHA256 seul | Hash simple | INSUFFISANT (pas de sel) |

**Pourquoi bcrypt/Argon2 ?**

| Propriété | MD5/SHA | bcrypt/Argon2 |
| --------- | ------- | ------------- |
| Vitesse | Très rapide (mauvais) | Lent (volontairement) |
| Sel | Non intégré | Intégré automatiquement |
| Coût ajustable | Non | Oui (work factor) |

**Exemple en PHP** :

```php
// Hasher un mot de passe (à l'inscription)
$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
// Résultat : $2y$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW

// Vérifier un mot de passe (à la connexion)
if (password_verify($passwordSaisi, $hashStocke)) {
    // Mot de passe correct
}
```

---

### Qu'est-ce qu'un JWT ?

**Définition** : JWT (JSON Web Token) est un standard pour transmettre des informations de manière sécurisée entre deux parties, sous forme d'un token signé.

Le diagramme suivant montre le flux complet d'authentification par JWT.

<div class="diagram-design">
<p><a href="../../../diagrams/competences-metier-04-developpement-logiciel-02-securite-authentification-1.html">Qu&#x27;est-ce qu&#x27;un JWT ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/competences-metier-04-developpement-logiciel-02-securite-authentification-1.html" title="Qu&#x27;est-ce qu&#x27;un JWT ?" style="width:100%;min-height:560px;border:0;background:transparent"></iframe>
</div>

**Structure d'un JWT** :

```text
xxxxx.yyyyy.zzzzz
  │      │      │
  │      │      └── Signature (vérifie l'intégrité)
  │      └── Payload (données : user_id, rôles, expiration)
  └── Header (algorithme utilisé)
```

**Exemple de payload** :

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "roles": ["ROLE_USER"],
  "iat": 1516239022,
  "exp": 1516242622
}
```

**JWT vs Sessions** :

| Aspect | Session | JWT |
| ------ | ------- | --- |
| Stockage | Serveur (Redis, fichiers) | Client (localStorage, cookie) |
| Scalabilité | Nécessite partage entre serveurs | Stateless, scale facilement |
| Révocation | Facile (supprimer côté serveur) | Difficile (token valide jusqu'à expiration) |
| Taille | ID de session (~32 caractères) | Token complet (~300+ caractères) |
| Cas d'usage | Applications web classiques | APIs, microservices |

---

### Qu'est-ce que HTTPS/TLS ?

**Définition** : HTTPS est HTTP avec chiffrement TLS (Transport Layer Security). Il garantit que les données échangées entre le navigateur et le serveur sont chiffrées et ne peuvent pas être lues par un tiers.

**Ce que TLS protège** :

| Protection | Description |
| ---------- | ----------- |
| Confidentialité | Les données sont chiffrées |
| Intégrité | Les données ne sont pas modifiées en transit |
| Authenticité | Le serveur est bien celui qu'il prétend être |

**Obtenir un certificat** :

| Méthode | Prix | Usage |
| ------- | ---- | ----- |
| Let's Encrypt | Gratuit | Sites publics |
| Certificat payant | 50-500€/an | Garanties, wildcard, EV |
| Certificat auto-signé | Gratuit | Développement uniquement |

---

### Quelles sont les vulnérabilités OWASP Top 10 ?

**OWASP** (Open Web Application Security Project) publie les 10 vulnérabilités web les plus critiques. Le classement ci-dessous est celui du **Top 10:2025** (pas celui de 2021) :

| Rang | Vulnérabilité | Description |
| ---- | ------------- | ----------- |
| A01 | Broken Access Control | Accès à des ressources non autorisées (inclut CSRF et SSRF) |
| A02 | Security Misconfiguration | Config par défaut, headers manquants, XXE |
| A03 | Software Supply Chain Failures | Chaîne d'approvisionnement et composants vulnérables |
| A04 | Cryptographic Failures | Données sensibles non chiffrées |
| A05 | Injection | SQL injection, XSS, command injection, etc. |
| A06 | Insecure Design | Architecture non sécurisée |
| A07 | Authentication Failures | Mots de passe faibles, pas de 2FA |
| A08 | Software or Data Integrity Failures | Code ou données non vérifiés |
| A09 | Security Logging and Alerting Failures | Pas de logs ni d'alertes pour détecter les attaques |
| A10 | Mishandling of Exceptional Conditions | Erreurs mal gérées, messages trop verbeux, fail-open |

---

## Étapes Pratiques

### Étape 1 : Configurer l'authentification Symfony

```yaml
# config/packages/security.yaml
security:
    password_hashers:
        Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface:
            algorithm: auto  # Utilise bcrypt ou argon2 selon disponibilité

    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email

    firewalls:
        main:
            lazy: true
            provider: app_user_provider
            form_login:
                login_path: app_login
                check_path: app_login
                default_target_path: app_home
            logout:
                path: app_logout
                target: app_home
            remember_me:
                secret: '%kernel.secret%'
                lifetime: 604800  # 1 semaine

    access_control:
        - { path: ^/admin, roles: ROLE_ADMIN }
        - { path: ^/profile, roles: ROLE_USER }
```

---

### Étape 2 : Créer un formulaire de login sécurisé

```php
// src/Controller/SecurityController.php
#[Route('/login', name: 'app_login')]
public function login(AuthenticationUtils $authUtils): Response
{
    // Récupérer l'erreur de connexion s'il y en a une
    $error = $authUtils->getLastAuthenticationError();

    // Dernier email saisi
    $lastUsername = $authUtils->getLastUsername();

    return $this->render('security/login.html.twig', [
        'last_username' => $lastUsername,
        'error' => $error,
    ]);
}
```

```twig
{# templates/security/login.html.twig #}
<form method="post">
    {% if error %}
        <div class="alert alert-danger">{{ error.messageKey|trans }}</div>
    {% endif %}

    <label for="username">Email</label>
    <input type="email" id="username" name="_username"
           value="{{ last_username }}" required autofocus>

    <label for="password">Mot de passe</label>
    <input type="password" id="password" name="_password" required>

    {# Protection CSRF #}
    <input type="hidden" name="_csrf_token"
           value="{{ csrf_token('authenticate') }}">

    <label>
        <input type="checkbox" name="_remember_me"> Se souvenir de moi
    </label>

    <button type="submit">Connexion</button>
</form>
```

---

### Étape 3 : Protéger contre l'injection SQL

```php
// ❌ DANGEREUX - Injection SQL possible
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $connection->query($sql);

// ✅ SÉCURISÉ - Requête préparée avec Doctrine
$user = $entityManager
    ->getRepository(User::class)
    ->findOneBy(['email' => $email]);

// ✅ SÉCURISÉ - QueryBuilder avec paramètres
$qb = $entityManager->createQueryBuilder();
$qb->select('u')
   ->from(User::class, 'u')
   ->where('u.email = :email')
   ->setParameter('email', $email);
$user = $qb->getQuery()->getOneOrNullResult();
```

---

### Étape 4 : Protéger contre XSS

```twig
{# ✅ SÉCURISÉ - Twig échappe automatiquement #}
<p>Bienvenue {{ user.name }}</p>
{# Si user.name = "<script>alert('xss')</script>" #}
{# Affiche : &lt;script&gt;alert('xss')&lt;/script&gt; #}

{# ❌ DANGEREUX - raw désactive l'échappement #}
<p>{{ user.bio|raw }}</p>  {# Ne faire que si bio est HTML sûr #}

{# ✅ SÉCURISÉ pour les URLs #}
<a href="{{ path('user_profile', {id: user.id}) }}">Profil</a>
```

---

### Étape 5 : Configurer les headers de sécurité

```nginx
# Dans la configuration Nginx
server {
    # ...

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    # X-XSS-Protection est déprécié : on le fixe à 0 pour désactiver
    # l'ancien auditeur XSS des navigateurs (retiré de Chrome et Safari,
    # jamais implémenté par Firefox). La protection XSS repose désormais
    # sur une Content-Security-Policy stricte (voir ci-dessous).
    add_header X-XSS-Protection "0" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    # CSP stricte : pas de script ni de style inline, pas d'objet, base verrouillée
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self';" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

| Header | Protection |
| ------ | ---------- |
| X-Frame-Options | Empêche l'intégration dans une iframe (clickjacking) |
| X-Content-Type-Options | Empêche le MIME sniffing |
| X-XSS-Protection | En-tête déprécié, fixé à `0` (désactive l'ancien auditeur XSS) |
| Content-Security-Policy | Contrôle les sources autorisées (protection XSS recommandée) |
| Strict-Transport-Security | Force HTTPS |

---

### Étape 6 : Implémenter un JWT (API)

```php
// Installation
// composer require lexik/jwt-authentication-bundle

// Génération des clés
// php bin/console lexik:jwt:generate-keypair
```

```yaml
# config/packages/lexik_jwt_authentication.yaml
lexik_jwt_authentication:
    secret_key: '%kernel.project_dir%/config/jwt/private.pem'
    public_key: '%kernel.project_dir%/config/jwt/public.pem'
    pass_phrase: '%env(JWT_PASSPHRASE)%'
    token_ttl: 3600  # 1 heure
```

```yaml
# config/packages/security.yaml
security:
    firewalls:
        api:
            pattern: ^/api
            stateless: true
            jwt: ~

    access_control:
        - { path: ^/api/login, roles: PUBLIC_ACCESS }
        - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console security:hash-password` | Hasher un mot de passe |
| `php bin/console lexik:jwt:generate-keypair` | Générer les clés JWT |
| `openssl s_client -connect example.com:443` | Vérifier le certificat SSL |
| `curl -I https://example.com` | Voir les headers de sécurité |

---

## Pièges Fréquents

### Piège 1 : Stocker les mots de passe en clair ou en MD5

⚠️ **Problème** : Les mots de passe sont immédiatement compromis en cas de fuite.

✅ **Solution** : Toujours utiliser `password_hash()` avec bcrypt ou Argon2.

---

### Piège 2 : Token JWT avec secret faible

⚠️ **Problème** : Un secret comme "secret123" peut être deviné.

✅ **Solution** : Clé RSA ou secret aléatoire de 256 bits minimum.

---

### Piège 3 : Pas de protection CSRF

⚠️ **Problème** : Un site malveillant peut soumettre des formulaires à ta place.

✅ **Solution** : Token CSRF sur tous les formulaires (automatique avec Symfony Forms).

---

### Piège 4 : Messages d'erreur trop précis

⚠️ **Problème** : "Cet email n'existe pas" permet d'énumérer les comptes.

✅ **Solution** : Message générique "Identifiants incorrects".

---

## Checklist de Validation

- [ ] Je comprends la différence entre authentification et autorisation
- [ ] Je sais hasher un mot de passe avec bcrypt/Argon2
- [ ] Je comprends le fonctionnement d'un JWT
- [ ] Je sais protéger contre l'injection SQL
- [ ] Je sais protéger contre XSS
- [ ] Je connais les headers de sécurité HTTP
- [ ] Je sais configurer l'authentification Symfony

---

## Exercice Pratique

**Énoncé** : Identifie les failles de sécurité dans ce code et propose des corrections.

```php
// Connexion
$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email = '$email'";
$user = $db->query($sql)->fetch();

if ($user && $user['password'] === md5($password)) {
    $_SESSION['user_id'] = $user['id'];
    echo "Bienvenue " . $user['name'];
}
```

**Résultat attendu** : Liste des failles + code corrigé.

---

## Solution de l'Exercice

````markdown
## Failles identifiées

| Faille | Ligne | Risque |
| ------ | ----- | ------ |
| Injection SQL | `"SELECT ... '$email'"` | Accès à toute la BDD |
| MD5 pour mot de passe | `md5($password)` | Cassable en secondes |
| XSS | `echo $user['name']` | Exécution de JS |
| Pas de CSRF | Formulaire | Soumission forcée |
| Comparaison non sécurisée | `===` sur hash | Timing attack possible |

## Code corrigé

```php
// Connexion sécurisée avec Symfony
public function login(Request $request, UserRepository $repo): Response
{
    $email = $request->request->get('email');
    $password = $request->request->get('password');

    // Vérification CSRF
    if (!$this->isCsrfTokenValid('login', $request->request->get('_token'))) {
        throw new AccessDeniedException('Token CSRF invalide');
    }

    // Requête préparée (pas d'injection SQL)
    $user = $repo->findOneBy(['email' => $email]);

    // Vérification sécurisée du mot de passe (bcrypt)
    if ($user && password_verify($password, $user->getPassword())) {
        // Session gérée par Symfony Security
        return $this->redirectToRoute('home');
    }

    // Message générique (pas d'énumération)
    $this->addFlash('error', 'Identifiants incorrects');
    return $this->redirectToRoute('login');
}
```

```twig
{# Template sécurisé #}
<p>Bienvenue {{ user.name }}</p>  {# Échappement automatique #}
```

````

---

## Navigation

← Fiche précédente : **[01 - L'Architecture Serveur Web](01-architecture-serveur-web.md)**

→ Fiche suivante : **[03 - Les Tests et la Qualité Logicielle](03-tests-qualite-logicielle.md)**
