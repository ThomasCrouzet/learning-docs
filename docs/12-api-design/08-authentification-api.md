---
tags:
  - API
  - Avancé
  - Pratique
description: "Sécuriser une API Symfony avec JWT, comprendre OAuth2 et les API keys, et protéger les endpoints avec le composant Security."
estimated_time: "90 min"
fiche_number: 8
total_fiches: 10
cursus: "API Design et Documentation"
---

# 08 - Authentification API

> **En bref** : Cette fiche couvre les mécanismes d'authentification pour sécuriser une API REST : JSON Web Tokens (JWT), clés API (API keys), concepts OAuth2, configuration du composant Security de Symfony et protection des endpoints avec API Platform. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[07 - Versioning d'API](07-versioning-api.md)**
- Connaître le composant Security de Symfony (fiche **[12 - Sécurité et authentification](../03-symfony/12-securite-utilisateurs.md)**)
- Connaître les codes de statut 401 et 403 (fiche **[01 - Principes REST avancés](01-principes-rest-avances.md)**)
- Savoir utiliser API Platform (fiche **[05 - API Platform - Introduction](05-api-platform-introduction.md)**)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras différencier les mécanismes d'authentification API (JWT, API key, OAuth2), configurer l'authentification JWT dans un projet Symfony avec LexikJWTAuthenticationBundle, protéger les endpoints par rôle, et sécuriser les ressources API Platform.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'authentification API ?

**Définition** : L'authentification API est le processus qui vérifie l'identité du client qui envoie une requête. Contrairement à une application web classique qui utilise des sessions et des cookies, une API REST est **sans état** (stateless) : chaque requête doit contenir toutes les informations nécessaires pour s'identifier.

**Le problème que l'authentification API résout** :

Sans authentification, voici les problèmes rencontrés :

1. **Accès libre** : n'importe qui peut lire, modifier ou supprimer des données via l'API.
2. **Pas de traçabilité** : impossible de savoir quel client a effectué quelle action.
3. **Pas de contrôle d'accès** : impossible de limiter certaines opérations à certains utilisateurs (par exemple, seul un administrateur peut supprimer un livre).

**Comment l'authentification API résout ces problèmes** :

| Problème | Solution apportée par l'authentification |
| -------- | ---------------------------------------- |
| Accès libre | Chaque requête doit contenir un identifiant valide (token, clé) |
| Pas de traçabilité | Le token identifie l'utilisateur à chaque requête |
| Pas de contrôle d'accès | Les rôles dans le token déterminent les opérations autorisées |

**Analogie concrète** : L'authentification API fonctionne comme un badge d'accès dans un immeuble de bureaux. À chaque porte (endpoint), tu dois présenter ton badge (token). Le badge contient ton nom et ton niveau d'accès. Si ton badge est expiré ou invalide, la porte reste fermée.

**Ce que l'authentification API n'est PAS** :

- L'authentification n'est pas l'autorisation. L'authentification répond à « Qui es-tu ? ». L'autorisation répond à « As-tu le droit de faire cela ? ». Les deux sont nécessaires mais ce sont des étapes distinctes.
- L'authentification API ne signifie pas utiliser des sessions. Les API REST sont stateless : le serveur ne stocke pas l'état de connexion. Chaque requête est indépendante.

---

### Les trois mécanismes d'authentification

**Définition** : Il existe trois mécanismes principaux pour authentifier les clients d'une API : les JSON Web Tokens (JWT), les clés API (API keys) et OAuth2.

**Mécanisme 1 : JSON Web Token (JWT)** :

Le client s'authentifie avec un identifiant et un mot de passe. Le serveur retourne un token JWT. Le client envoie ce token dans le header `Authorization` de chaque requête suivante.

```text
1. Client → POST /api/login {"email": "user@test.com", "password": "secret"}
2. Serveur → {"token": "eyJhbGciOiJSUzI1NiIs..."}
3. Client → GET /api/books  Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
4. Serveur → [liste des livres]
```

**Mécanisme 2 : Clé API (API key)** :

Le client possède une clé unique générée par le serveur. Il l'envoie dans un header personnalisé ou en query parameter à chaque requête.

```text
GET /api/books
X-API-Key: ak_live_abc123def456
```

**Mécanisme 3 : OAuth2** :

Un protocole de délégation d'autorisation. Un client (application tierce) obtient un token d'accès limité au nom de l'utilisateur, sans jamais connaître son mot de passe.

```text
1. L'application redirige l'utilisateur vers le serveur d'autorisation
2. L'utilisateur se connecte et autorise l'application
3. Le serveur d'autorisation retourne un code d'autorisation
4. L'application échange le code contre un token d'accès
5. L'application utilise le token pour accéder à l'API
```

**Comparaison des trois mécanismes** :

| Critère | JWT | API Key | OAuth2 |
| ------- | --- | ------- | ------ |
| Cas d'usage | API avec utilisateurs authentifiés | API entre services, clés techniques | API avec délégation d'accès (applications tierces) |
| Sécurité | Élevée (signé, expirable) | Moyenne (clé statique, pas d'expiration native) | Très élevée (scopes, refresh tokens) |
| Complexité | Moyenne | Faible | Élevée |
| Stateless | Oui | Oui | Oui (après obtention du token) |
| Expiration | Oui (configurée dans le token) | Non (sauf si tu la gères manuellement) | Oui (access token + refresh token) |
| Adapté à | Applications SPA, mobiles | Intégrations serveur-à-serveur | Grandes plateformes (Google, GitHub) |

---

Le diagramme suivant illustre le flux complet d'authentification JWT entre un client et l'API.

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API

    C->>A: POST /login (email, password)
    A-->>C: JWT Token
    C->>A: GET /api/data<br>Authorization: Bearer JWT
    A->>A: Vérifie la signature
    A-->>C: Données protégées
```

### Qu'est-ce qu'un JWT ?

**Définition** : Un JSON Web Token (JWT, prononcé « jot ») est un format de token auto-contenu qui encode des informations (claims) dans une chaîne de caractères signée. Le serveur peut vérifier l'authenticité du token sans consulter une base de données.

**Le problème que JWT résout** :

Sans JWT, voici les problèmes rencontrés :

1. **Sessions côté serveur** : le serveur doit stocker l'état de chaque utilisateur connecté, ce qui consomme de la mémoire et ne fonctionne pas avec plusieurs serveurs (scaling horizontal).
2. **Requête en base à chaque appel** : pour valider un token opaque (aléatoire), le serveur doit chercher le token dans la base de données à chaque requête.

**Comment JWT résout ces problèmes** :

| Problème | Solution apportée par JWT |
| -------- | ------------------------- |
| Sessions côté serveur | Le token contient toutes les informations, rien à stocker côté serveur |
| Requête en base à chaque appel | Le serveur vérifie la signature du token sans accès base de données |

**Structure d'un JWT** :

Un JWT est composé de trois parties séparées par des points :

```text
eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTEwMDgwMDB9.signature
|---- Header ----||----- Payload -----||- Signature -|
```

| Partie | Contenu | Encodage |
| ------ | ------- | -------- |
| Header | Algorithme de signature (`RS256`) et type (`JWT`) | Base64url |
| Payload | Données (claims) : identifiant utilisateur, rôles, expiration | Base64url |
| Signature | Vérification d'intégrité : le serveur signe le header + payload avec sa clé privée | Binaire signé |

**Exemple de payload décodé** :

```json
{
    "iat": 1711008000,
    "exp": 1711011600,
    "roles": ["ROLE_USER"],
    "username": "user@test.com"
}
```

| Claim | Signification | Exemple |
| ----- | ------------- | ------- |
| `iat` | Issued At - date de création du token | 1711008000 (timestamp UNIX) |
| `exp` | Expiration - date d'expiration | 1711011600 (1 heure après `iat`) |
| `roles` | Rôles Symfony de l'utilisateur | `["ROLE_USER"]` |
| `username` | Identifiant de l'utilisateur | `"user@test.com"` |

**Analogie concrète** : Un JWT est comme un billet de concert horodaté. Le billet contient ton nom, la date du concert et un numéro de place (le payload). Il est tamponné avec le sceau officiel de l'organisateur (la signature). Le vigile (le serveur) vérifie le sceau sans appeler le bureau de l'organisateur. Si le billet est modifié (nom changé), le sceau ne correspond plus.

**Ce qu'un JWT n'est PAS** :

- Un JWT n'est pas chiffré par défaut. Le payload est encodé en Base64, pas chiffré. N'importe qui peut le décoder et lire son contenu. Ne mets jamais de données sensibles (mot de passe, numéro de carte) dans un JWT.
- Un JWT n'est pas révocable facilement. Une fois émis, le token est valide jusqu'à son expiration. Pour « déconnecter » un utilisateur, il faut attendre l'expiration ou maintenir une liste noire (blacklist), ce qui annule l'avantage stateless.

---

### Qu'est-ce qu'une clé API ?

**Définition** : Une clé API (API key) est une chaîne de caractères unique et secrète attribuée à un client. Elle identifie le client (pas un utilisateur humain) et permet de contrôler et limiter l'accès à l'API.

**Le problème que les clés API résolvent** :

Sans clés API :

1. **Pas d'identification des clients** : impossible de savoir quelle application consomme l'API.
2. **Pas de limitation de débit (rate limiting)** : impossible de limiter le nombre de requêtes par client.

**Quand utiliser une clé API plutôt qu'un JWT** :

| Utilise une clé API quand... | Utilise un JWT quand... |
| ---------------------------- | ----------------------- |
| Le client est un service (serveur à serveur) | Le client est un utilisateur humain |
| Pas besoin de rôles complexes | Tu as besoin de rôles et permissions |
| L'accès est permanent (pas d'expiration) | L'accès doit expirer |
| Tu veux identifier l'application, pas l'utilisateur | Tu veux identifier l'utilisateur |

---

### OAuth2 : les concepts clés

**Définition** : OAuth2 est un protocole d'autorisation qui permet à une application tierce d'accéder aux ressources d'un utilisateur sans connaître son mot de passe. L'utilisateur autorise l'application à agir en son nom, avec des permissions limitées (scopes).

**Le problème qu'OAuth2 résout** :

Sans OAuth2, voici les problèmes rencontrés :

1. **Partage de mot de passe** : l'application tierce a besoin du mot de passe de l'utilisateur pour accéder à l'API.
2. **Accès illimité** : l'application tierce a le même accès que l'utilisateur, sans restriction.

**Comment OAuth2 résout ces problèmes** :

| Problème | Solution apportée par OAuth2 |
| -------- | ---------------------------- |
| Partage de mot de passe | L'utilisateur se connecte directement au serveur d'autorisation, jamais via l'application tierce |
| Accès illimité | Les scopes limitent les permissions de l'application (lecture seule, écriture, etc.) |

**Les 4 rôles OAuth2** :

| Rôle | Description | Exemple |
| ---- | ----------- | ------- |
| Resource Owner | L'utilisateur qui possède les données | Toi, sur GitHub |
| Client | L'application qui veut accéder aux données | Une application CI/CD |
| Authorization Server | Le serveur qui authentifie l'utilisateur et délivre les tokens | `github.com/login/oauth` |
| Resource Server | L'API qui contient les données protégées | `api.github.com` |

**Ce qu'OAuth2 n'est PAS** :

- OAuth2 n'est pas un protocole d'authentification. C'est un protocole d'autorisation. Il ne vérifie pas l'identité de l'utilisateur : il délègue des permissions. OpenID Connect (OIDC) est la couche d'authentification construite sur OAuth2.
- OAuth2 n'est pas nécessaire pour une API interne. Si ton API est consommée uniquement par ton propre frontend, JWT suffit. OAuth2 est utile quand des applications tierces doivent accéder à ton API.

---

## Étapes Pratiques

### Étape 1 : Installer LexikJWTAuthenticationBundle

Installe le bundle qui gère l'authentification JWT dans Symfony.

```bash
# Installer le bundle JWT
composer require lexik/jwt-authentication-bundle
```

```bash
# Générer les clés RSA pour signer les tokens
# La clé privée signe les tokens, la clé publique les vérifie
php bin/console lexik:jwt:generate-keypair
```

**Résultat attendu** :

```text
config/jwt/private.pem  ← clé privée (ne jamais partager)
config/jwt/public.pem   ← clé publique (peut être partagée)
```

```bash
# Vérifier que les clés ont été créées
ls -la config/jwt/
```

```text
-rw------- 1 user user 3272 private.pem
-rw-r--r-- 1 user user  800 public.pem
```

---

### Étape 2 : Configurer le bundle JWT

Configure le bundle dans le fichier de configuration Symfony.

```yaml
# config/packages/lexik_jwt_authentication.yaml

lexik_jwt_authentication:
    # Chemin vers la clé privée (pour signer les tokens)
    secret_key: '%kernel.project_dir%/config/jwt/private.pem'
    # Chemin vers la clé publique (pour vérifier les tokens)
    public_key: '%kernel.project_dir%/config/jwt/public.pem'
    # Passphrase de la clé privée (définie dans .env)
    pass_phrase: '%env(JWT_PASSPHRASE)%'
    # Durée de validité du token en secondes (3600 = 1 heure)
    token_ttl: 3600
```

Le fichier `.env` contient la passphrase :

```env
# .env - la passphrase est générée automatiquement
JWT_PASSPHRASE=ta_passphrase_secrete
```

---

### Étape 3 : Créer l'entité User

Crée une entité `User` compatible avec le composant Security de Symfony.

```php
<?php
// src/Entity/User.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
#[ORM\Table(name: 'app_user')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private string $email = '';

    // Les rôles de l'utilisateur (ROLE_USER, ROLE_ADMIN, etc.)
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    // Le mot de passe hashé (jamais le mot de passe en clair)
    #[ORM\Column]
    private string $password = '';

    public function getId(): ?int { return $this->id; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    // Méthode requise par UserInterface
    // Retourne l'identifiant unique de l'utilisateur
    public function getUserIdentifier(): string { return $this->email; }

    // Méthode requise par UserInterface
    // Retourne les rôles de l'utilisateur
    // ROLE_USER est toujours ajouté automatiquement
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    // Méthode requise par PasswordAuthenticatedUserInterface
    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    // Méthode requise par UserInterface
    // Efface les données sensibles temporaires (mot de passe en clair)
    public function eraseCredentials(): void {}
}
```

```bash
# Créer la migration
php bin/console make:migration

# Exécuter la migration
php bin/console doctrine:migrations:migrate
```

---

### Étape 4 : Configurer le firewall Symfony

Configure le composant Security pour gérer l'authentification JWT.

```yaml
# config/packages/security.yaml

security:
    # Algorithme de hashage des mots de passe
    password_hashers:
        App\Entity\User: 'auto'

    # Le provider indique à Symfony où trouver les utilisateurs
    providers:
        app_user_provider:
            entity:
                class: App\Entity\User
                property: email

    firewalls:
        # Le firewall "login" gère l'endpoint de connexion
        login:
            pattern: ^/api/login
            stateless: true
            # json_login : le client envoie un JSON avec email et password
            json_login:
                # URL de l'endpoint de connexion
                check_path: /api/login
                # Champ contenant l'identifiant dans le JSON
                username_path: email
                # Champ contenant le mot de passe dans le JSON
                password_path: password
                # En cas de succès, le bundle JWT génère et retourne le token
                success_handler: lexik_jwt_authentication.handler.authentication_success
                # En cas d'échec, une erreur 401 est retournée
                failure_handler: lexik_jwt_authentication.handler.authentication_failure

        # Le firewall "api" protège tous les endpoints /api/
        api:
            pattern: ^/api
            stateless: true
            # jwt : chaque requête doit contenir un token JWT valide
            jwt: ~

    # Contrôle d'accès : quels rôles peuvent accéder à quelles URL
    access_control:
        # L'endpoint de login est accessible sans authentification
        - { path: ^/api/login, roles: PUBLIC_ACCESS }
        # Les endpoints de documentation sont accessibles sans authentification
        - { path: ^/api/docs, roles: PUBLIC_ACCESS }
        # Tous les autres endpoints /api/ nécessitent une authentification
        - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

Ajoute la route de login :

```yaml
# config/routes.yaml

api_login:
    path: /api/login
    methods: ['POST']
```

---

### Étape 5 : Créer un utilisateur de test

Crée un utilisateur de test avec une commande Symfony.

```php
<?php
// src/Command/CreateUserCommand.php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:create-user', description: 'Crée un utilisateur de test')]
class CreateUserCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Créer un utilisateur standard
        $user = new User();
        $user->setEmail('user@test.com');
        $user->setRoles(['ROLE_USER']);
        // Le hasher transforme le mot de passe en clair en hash sécurisé
        $user->setPassword($this->hasher->hashPassword($user, 'password123'));

        $this->em->persist($user);

        // Créer un administrateur
        $admin = new User();
        $admin->setEmail('admin@test.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->hasher->hashPassword($admin, 'admin123'));

        $this->em->persist($admin);

        $this->em->flush();

        $output->writeln('Utilisateurs créés :');
        $output->writeln('- user@test.com / password123 (ROLE_USER)');
        $output->writeln('- admin@test.com / admin123 (ROLE_ADMIN)');

        return Command::SUCCESS;
    }
}
```

```bash
# Créer les utilisateurs de test
php bin/console app:create-user
```

**Résultat attendu** :

```text
Utilisateurs créés :
- user@test.com / password123 (ROLE_USER)
- admin@test.com / admin123 (ROLE_ADMIN)
```

---

### Étape 6 : Tester l'authentification JWT

Teste le flux complet d'authentification.

```bash
# 1. Se connecter pour obtenir un token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "password123"}'
```

**Résultat attendu** :

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTEwMDgwMDAsImV4cCI6MTcxMTAxMTYwMCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidXNlckB0ZXN0LmNvbSJ9.signature..."
}
```

```bash
# 2. Utiliser le token pour accéder à un endpoint protégé
# Remplace <TOKEN> par le token obtenu à l'étape précédente
curl http://localhost:8000/api/books \
  -H "Authorization: Bearer <TOKEN>"
```

**Résultat attendu** : la liste des livres est retournée (code 200).

```bash
# 3. Tester sans token → 401 Unauthorized
curl -i http://localhost:8000/api/books
```

**Résultat attendu** :

```text
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"code": 401, "message": "JWT Token not found"}
```

```bash
# 4. Tester avec un token invalide → 401 Unauthorized
curl -i http://localhost:8000/api/books \
  -H "Authorization: Bearer token_invalide_123"
```

**Résultat attendu** :

```text
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"code": 401, "message": "Invalid JWT Token"}
```

---

### Étape 7 : Protéger les endpoints par rôle

Ajoute des restrictions de rôle sur les opérations API Platform.

```php
<?php
// src/Entity/Book.php - avec sécurité

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        // Lecture : accessible à tous les utilisateurs authentifiés
        new GetCollection(
            description: 'Liste les livres.',
            security: 'is_granted("ROLE_USER")'
        ),
        new Get(
            description: 'Affiche un livre.',
            security: 'is_granted("ROLE_USER")'
        ),
        // Écriture : réservée aux administrateurs
        new Post(
            description: 'Crée un livre.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent créer des livres.'
        ),
        new Patch(
            description: 'Modifie un livre.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent modifier des livres.'
        ),
        new Delete(
            description: 'Supprime un livre.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent supprimer des livres.'
        ),
    ],
    normalizationContext: ['groups' => ['book:read']],
    denormalizationContext: ['groups' => ['book:write']],
)]
#[ORM\Entity]
class Book
{
    // ... propriétés et méthodes identiques aux fiches précédentes
}
```

**Résultat attendu** :

```bash
# Utilisateur standard → lecture autorisée
curl http://localhost:8000/api/books \
  -H "Authorization: Bearer <TOKEN_USER>"
# → 200 OK

# Utilisateur standard → création refusée
curl -X POST http://localhost:8000/api/books \
  -H "Authorization: Bearer <TOKEN_USER>" \
  -H "Content-Type: application/ld+json" \
  -d '{"title": "Test", "author": "Test"}'
# → 403 Forbidden

# Administrateur → création autorisée
curl -X POST http://localhost:8000/api/books \
  -H "Authorization: Bearer <TOKEN_ADMIN>" \
  -H "Content-Type: application/ld+json" \
  -d '{"title": "Test", "author": "Test"}'
# → 201 Created
```

---

### Étape 8 : Implémenter l'authentification par clé API

Crée un authenticator Symfony pour les clés API.

```php
<?php
// src/Security/ApiKeyAuthenticator.php

namespace App\Security;

use App\Repository\ApiTokenRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

// Cet authenticator vérifie le header X-API-Key dans chaque requête
class ApiKeyAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private ApiTokenRepository $tokenRepository,
    ) {
    }

    // Cette méthode détermine si l'authenticator doit être utilisé
    // Il s'active uniquement si le header X-API-Key est présent
    public function supports(Request $request): ?bool
    {
        return $request->headers->has('X-API-Key');
    }

    // Cette méthode extrait et vérifie la clé API
    public function authenticate(Request $request): Passport
    {
        // On lit la clé API depuis le header
        $apiKey = $request->headers->get('X-API-Key');

        if ($apiKey === null) {
            throw new CustomUserMessageAuthenticationException(
                'Clé API manquante.'
            );
        }

        // On cherche le token en base de données
        $apiToken = $this->tokenRepository->findOneBy(['token' => $apiKey]);

        if ($apiToken === null) {
            throw new CustomUserMessageAuthenticationException(
                'Clé API invalide.'
            );
        }

        // SelfValidatingPassport : pas besoin de vérifier un mot de passe
        // On retourne l'utilisateur associé au token
        return new SelfValidatingPassport(
            new UserBadge($apiToken->getOwner()->getUserIdentifier())
        );
    }

    // En cas de succès, on laisse la requête continuer
    public function onAuthenticationSuccess(
        Request $request,
        TokenInterface $token,
        string $firewallName
    ): ?Response {
        return null;
    }

    // En cas d'échec, on retourne une erreur 401
    public function onAuthenticationFailure(
        Request $request,
        AuthenticationException $exception
    ): ?Response {
        return new JsonResponse(
            ['error' => $exception->getMessageKey()],
            Response::HTTP_UNAUTHORIZED
        );
    }
}
```

L'entité `ApiToken` associe une clé à un utilisateur :

```php
<?php
// src/Entity/ApiToken.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class ApiToken
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // La clé API unique (par exemple : ak_live_abc123def456)
    #[ORM\Column(length: 255, unique: true)]
    private string $token = '';

    // L'utilisateur propriétaire de cette clé
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private User $owner;

    // Date de création de la clé
    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getToken(): string { return $this->token; }
    public function setToken(string $token): self
    {
        $this->token = $token;
        return $this;
    }

    public function getOwner(): User { return $this->owner; }
    public function setOwner(User $owner): self
    {
        $this->owner = $owner;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

**Résultat attendu** :

```bash
# Avec une clé API valide
curl http://localhost:8000/api/books \
  -H "X-API-Key: ak_live_abc123def456"
# → 200 OK

# Avec une clé API invalide
curl -i http://localhost:8000/api/books \
  -H "X-API-Key: cle_invalide"
# → 401 Unauthorized {"error": "Clé API invalide."}
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `composer require lexik/jwt-authentication-bundle` | Installer le bundle JWT |
| `php bin/console lexik:jwt:generate-keypair` | Générer les clés RSA |
| `php bin/console debug:config lexik_jwt_authentication` | Voir la configuration JWT |
| `php bin/console debug:firewall` | Lister les firewalls configurés |
| `php bin/console security:hash-password` | Hasher un mot de passe |
| `php bin/console debug:router \| grep login` | Vérifier la route de login |

---

## Pièges Fréquents

### Piège 1 : Oublier de générer les clés RSA

⚠️ **Problème** : Tu installes le bundle JWT mais tu ne génères pas les clés RSA. L'erreur suivante apparaît au login :

```text
Unable to create a signed JWT from the given configuration.
```

✅ **Solution** : Exécute `php bin/console lexik:jwt:generate-keypair`. Vérifie que les fichiers `config/jwt/private.pem` et `config/jwt/public.pem` existent.

### Piège 2 : Envoyer le token sans le préfixe "Bearer"

⚠️ **Problème** : Tu envoies le header `Authorization: eyJ0eXAi...` au lieu de `Authorization: Bearer eyJ0eXAi...`. Le serveur retourne 401.

✅ **Solution** : Le header `Authorization` doit toujours commencer par le mot `Bearer` suivi d'un espace puis du token.

```bash
# ❌ Incorrect : pas de préfixe Bearer
curl -H "Authorization: eyJ0eXAi..." http://localhost:8000/api/books

# ✅ Correct : préfixe Bearer suivi d'un espace
curl -H "Authorization: Bearer eyJ0eXAi..." http://localhost:8000/api/books
```

### Piège 3 : Token expiré

⚠️ **Problème** : Le token a expiré (durée par défaut : 1 heure). Le serveur retourne 401 avec le message « Expired JWT Token ».

✅ **Solution** : Redemande un token en appelant `POST /api/login`. Pour les tests, tu peux augmenter la durée dans `lexik_jwt_authentication.yaml` (par exemple `token_ttl: 86400` pour 24 heures).

### Piège 4 : Confondre 401 et 403

⚠️ **Problème** : Tu retournes 403 quand le token est manquant ou invalide.

✅ **Solution** : 401 signifie « Authentification requise » (pas de token, token invalide, token expiré). 403 signifie « Authentifié mais pas autorisé » (token valide mais rôle insuffisant).

| Situation | Code attendu |
| --------- | ------------ |
| Pas de token | 401 |
| Token invalide | 401 |
| Token expiré | 401 |
| Token valide mais ROLE_USER au lieu de ROLE_ADMIN | 403 |

### Piège 5 : Committer les clés RSA dans Git

⚠️ **Problème** : Les fichiers `config/jwt/private.pem` et `config/jwt/public.pem` sont commités dans le dépôt Git. N'importe qui peut signer des tokens.

✅ **Solution** : Ajoute les clés dans `.gitignore` :

```text
# .gitignore
config/jwt/*.pem
```

---

## Checklist de Validation

- [ ] Je connais la différence entre JWT, API key et OAuth2
- [ ] Je sais dans quel cas utiliser chaque mécanisme
- [ ] LexikJWTAuthenticationBundle est installé et les clés RSA sont générées
- [ ] L'endpoint `POST /api/login` retourne un token JWT valide
- [ ] Les endpoints protégés retournent 401 sans token et 200 avec un token valide
- [ ] Les opérations d'écriture sont réservées à ROLE_ADMIN (403 pour ROLE_USER)
- [ ] Je sais implémenter un authenticator par clé API
- [ ] Je comprends la structure d'un JWT (header, payload, signature)
- [ ] Les clés RSA ne sont pas commités dans Git

---

## Exercice Pratique

**Énoncé** : Sécurise l'API de bibliothèque avec authentification JWT et contrôle d'accès par rôle.

**Spécifications** :

- Endpoint de login : `POST /api/login` avec email et password
- Deux rôles : `ROLE_USER` (lecture seule) et `ROLE_ADMIN` (lecture + écriture)
- Les endpoints GET (`/api/books`, `/api/books/{id}`) sont accessibles avec `ROLE_USER`
- Les endpoints POST, PATCH, DELETE sont accessibles uniquement avec `ROLE_ADMIN`
- Les endpoints de documentation (`/api/docs`) restent publics
- Token valide pendant 1 heure
- Deux utilisateurs de test : `user@test.com` (ROLE_USER) et `admin@test.com` (ROLE_ADMIN)

**Indications** :

- Installe LexikJWTAuthenticationBundle et génère les clés RSA
- Configure le firewall `security.yaml` avec `json_login` et `jwt`
- Utilise l'attribut `security` sur les opérations API Platform
- Teste chaque scénario avec curl : sans token, token user, token admin

**Résultat attendu** :

| Scénario | Endpoint | Code attendu |
| -------- | -------- | ------------ |
| Sans token | GET /api/books | 401 |
| Token user | GET /api/books | 200 |
| Token user | POST /api/books | 403 |
| Token admin | POST /api/books | 201 |
| Token admin | DELETE /api/books/1 | 204 |
| Token expiré | GET /api/books | 401 |

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

La solution complète est présentée dans les étapes pratiques de cette fiche. Voici un résumé de la structure de fichiers :

```text
config/
├── jwt/
│   ├── private.pem                     ← clé privée RSA
│   └── public.pem                      ← clé publique RSA
├── packages/
│   ├── lexik_jwt_authentication.yaml   ← configuration JWT
│   └── security.yaml                   ← firewalls et access_control
└── routes.yaml                         ← route /api/login

src/
├── Command/
│   └── CreateUserCommand.php           ← commande pour créer les utilisateurs de test
├── Entity/
│   ├── User.php                        ← entité utilisateur
│   └── Book.php                        ← entité livre avec attributs security
└── Security/
    └── ApiKeyAuthenticator.php         ← authenticator par clé API (optionnel)
```

Tests complets :

```bash
# 1. Obtenir un token utilisateur
TOKEN_USER=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "password123"}' | php -r 'echo json_decode(file_get_contents("php://stdin"))->token;')

# 2. Obtenir un token administrateur
TOKEN_ADMIN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}' | php -r 'echo json_decode(file_get_contents("php://stdin"))->token;')

# 3. Tester sans token → 401
curl -i http://localhost:8000/api/books
# → HTTP/1.1 401 Unauthorized

# 4. Tester avec token user → 200 (lecture)
curl -i http://localhost:8000/api/books \
  -H "Authorization: Bearer $TOKEN_USER"
# → HTTP/1.1 200 OK

# 5. Tester création avec token user → 403 (interdit)
curl -i -X POST http://localhost:8000/api/books \
  -H "Authorization: Bearer $TOKEN_USER" \
  -H "Content-Type: application/ld+json" \
  -d '{"title": "Test", "author": "Test"}'
# → HTTP/1.1 403 Forbidden

# 6. Tester création avec token admin → 201 (autorisé)
curl -i -X POST http://localhost:8000/api/books \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/ld+json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin"}'
# → HTTP/1.1 201 Created
```

---

## Navigation

← Fiche précédente : **[07 - Versioning d'API](07-versioning-api.md)**

→ Fiche suivante : **[09 - Introduction à GraphQL](09-introduction-graphql.md)**
