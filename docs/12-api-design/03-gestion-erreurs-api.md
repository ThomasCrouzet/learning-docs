---
tags:
  - API
  - Intermédiaire
  - Pratique
description: "Gérer les erreurs API de façon standardisée avec RFC 7807 Problem Details, validation, codes applicatifs et messages sécurisés."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 10
cursus: "API Design et Documentation"
---

# 03 - Gestion des erreurs API

> **En bref** : Cette fiche couvre la gestion standardisée des erreurs API : le format RFC 7807 Problem Details, la validation des données d'entrée, les codes d'erreur applicatifs, les messages utiles vs sécurisés, et l'internationalisation des erreurs. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche **[01 - Principes REST avancés](01-principes-rest-avances.md)** (codes de statut HTTP)
- Avoir lu la fiche **[11 - Validation des données](../03-symfony/11-validation-donnees.md)** du cursus Symfony
- Savoir créer un contrôleur API Symfony qui retourne du JSON

## Objectif de cette fiche

À la fin de cette fiche, tu sauras formater les erreurs API selon le standard RFC 7807, gérer les erreurs de validation de façon structurée, définir des codes d'erreur applicatifs, et distinguer les messages destinés au développeur de ceux destinés à l'utilisateur final.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la gestion d'erreurs API ?

**Définition** : La gestion d'erreurs API est l'ensemble des pratiques qui déterminent comment une API communique les erreurs au client. Elle inclut le choix du code de statut HTTP, le format du body d'erreur, et le niveau de détail fourni.

**Le problème que la gestion d'erreurs résout** :

Sans gestion d'erreurs standardisée, voici les problèmes rencontrés :

1. **Formats incohérents** : chaque endpoint retourne les erreurs dans un format différent (`{"error": "..."}`, `{"message": "..."}`, `{"errors": [...]}`).
2. **Informations insuffisantes** : le client reçoit « Erreur 400 » sans savoir quel champ est invalide.
3. **Fuite d'informations** : le client reçoit une stack trace PHP ou un message SQL qui expose la structure de la base de données.

**Comment la gestion d'erreurs résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Formats incohérents | Un format d'erreur unique pour toute l'API (RFC 7807) |
| Informations insuffisantes | Des champs structurés indiquant le champ, le code d'erreur et le message |
| Fuite d'informations | Séparation entre messages développeur (logs) et messages client (réponse) |

**Analogie concrète** : Quand tu remplis un formulaire papier et qu'il y a une erreur, un bon formulaire te dit exactement quel champ est incorrect et pourquoi (« Le champ date doit être au format JJ/MM/AAAA »). Un mauvais formulaire te dit juste « Formulaire invalide » sans plus de détails.

**Ce que la gestion d'erreurs n'est PAS** :

- La gestion d'erreurs n'est pas la gestion des exceptions. Les exceptions sont un mécanisme interne de PHP. La gestion d'erreurs API est la façon dont on traduit ces exceptions en réponses HTTP compréhensibles.
- La gestion d'erreurs n'est pas la journalisation (logging). Les logs enregistrent les détails techniques pour le développeur. La réponse d'erreur fournit des informations utiles au client.

---

### RFC 7807 - Problem Details for HTTP APIs

**Définition** : La RFC 9457 (juillet 2023) rend obsolète la RFC 7807 et définit le format actuel _Problem Details for HTTP APIs_. Le type de contenu reste `application/problem+json`. Les membres `type` et `title` sont optionnels (un `type` absent équivaut à `about:blank`). La RFC 9457 ajoute notamment un registre IANA des types de problème et des précisions pour plusieurs problèmes dans une même réponse.

**Le problème que la RFC 7807 résout** :

Sans standard, chaque API invente son propre format :

```json
{"error": "Not found"}
{"message": "Validation failed", "errors": [...]}
{"status": "error", "code": 422, "data": null}
```

Le client doit gérer chaque format différemment.

**Structure RFC 7807** :

| Champ | Type | Obligatoire | Description |
| ----- | ---- | ----------- | ----------- |
| `type` | string (URI) | Oui | URI identifiant le type d'erreur. Pointe vers une documentation. |
| `title` | string | Oui | Titre court et lisible par un humain. Ne change pas d'un appel à l'autre. |
| `status` | integer | Recommandé | Le code de statut HTTP (ex: 422). |
| `detail` | string | Recommandé | Explication détaillée de cette occurrence spécifique. |
| `instance` | string (URI) | Optionnel | URI identifiant cette occurrence spécifique (utile pour le support). |

**Exemple complet** :

```json
{
    "type": "https://api.example.com/errors/validation-failed",
    "title": "Validation des données échouée",
    "status": 422,
    "detail": "Le champ 'email' n'est pas une adresse email valide.",
    "instance": "/api/users/registration/abc123"
}
```

**Champs supplémentaires** : La RFC permet d'ajouter des champs personnalisés. Par exemple, un champ `violations` pour lister les erreurs de validation :

```json
{
    "type": "https://api.example.com/errors/validation-failed",
    "title": "Validation des données échouée",
    "status": 422,
    "detail": "2 erreurs de validation détectées.",
    "violations": [
        {
            "field": "email",
            "message": "Cette adresse email n'est pas valide.",
            "code": "INVALID_EMAIL"
        },
        {
            "field": "password",
            "message": "Le mot de passe doit contenir au moins 8 caractères.",
            "code": "TOO_SHORT"
        }
    ]
}
```

**Ce que la RFC 7807 n'est PAS** :

- La RFC 7807 n'est pas obligatoire. C'est un standard recommandé. Tu peux utiliser ton propre format, mais la RFC 7807 est reconnue par l'industrie et comprise par les outils (Swagger UI, Postman).
- La RFC 7807 ne remplace pas les codes de statut HTTP. Le code HTTP reste dans les headers. Le body fournit des détails supplémentaires.

---

### Messages utiles vs messages sécurisés

**Définition** : Un message utile aide le client à corriger l'erreur. Un message sécurisé ne révèle pas d'informations internes sur le système. L'enjeu est de trouver l'équilibre entre les deux.

**Le problème que cette distinction résout** :

Sans cette distinction :

1. **Messages trop détaillés** : exposent la structure de la base de données, les noms de tables, les requêtes SQL.
2. **Messages trop vagues** : « Erreur interne » ne permet pas au client de corriger le problème.

**Règle de séparation** :

| Type d'erreur | Message client (réponse HTTP) | Message développeur (logs) |
| ------------- | ----------------------------- | -------------------------- |
| Validation (422) | Détaillé : « Le champ email n'est pas valide » | Non nécessaire |
| Authentification (401) | Générique : « Token invalide ou expiré » | Détaillé : « Token JWT expiré depuis 3h » |
| Autorisation (403) | Générique : « Accès refusé » | Détaillé : « User #42 a le rôle ROLE_USER, ROLE_ADMIN requis » |
| Erreur serveur (500) | Générique : « Erreur interne du serveur » | Détaillé : stack trace, requête SQL, etc. |
| Ressource introuvable (404) | « La ressource demandée n'existe pas » | Non nécessaire |
| Conflit (409) | « Un élément avec cet identifiant existe déjà » | Détaillé : « Duplicate key on column isbn » |

**Ce que cette distinction n'est PAS** :

- Cette distinction ne signifie pas que les erreurs 4xx doivent être vagues. Les erreurs de validation (422) doivent être détaillées pour que le client puisse corriger sa requête.
- Cette distinction ne s'applique pas uniquement à la production. En développement, tu peux ajouter des détails supplémentaires (contrôlé par la variable d'environnement `APP_ENV`).

---

### Codes d'erreur applicatifs

**Définition** : Les codes d'erreur applicatifs sont des identifiants uniques (chaînes ou nombres) qui permettent au client d'identifier précisément le type d'erreur, au-delà du code de statut HTTP.

**Le problème que les codes applicatifs résolvent** :

Le code HTTP 422 signifie « données invalides », mais ne dit pas pourquoi. Plusieurs erreurs de validation retournent toutes 422 :

- Email invalide → 422
- Mot de passe trop court → 422
- Date dans le futur → 422

Les codes applicatifs permettent au client de différencier ces cas.

**Convention de nommage** :

```text
DOMAIN_ACTION_REASON

Exemples :
- USER_EMAIL_INVALID
- USER_PASSWORD_TOO_SHORT
- ARTICLE_TITLE_REQUIRED
- ARTICLE_SLUG_DUPLICATE
- AUTH_TOKEN_EXPIRED
- AUTH_TOKEN_INVALID
```

**Exemple dans une réponse** :

```json
{
    "type": "https://api.example.com/errors/validation-failed",
    "title": "Validation des données échouée",
    "status": 422,
    "violations": [
        {
            "field": "email",
            "message": "Cette adresse email n'est pas valide.",
            "code": "USER_EMAIL_INVALID"
        }
    ]
}
```

Le client peut utiliser le code `USER_EMAIL_INVALID` pour afficher un message dans la langue de l'utilisateur, ou pour mettre en rouge le champ email.

---

## Étapes Pratiques

### Étape 1 : Créer la classe ProblemDetails

Crée une classe PHP qui représente une erreur au format RFC 7807.

```php
<?php
// src/ApiError/ProblemDetails.php

namespace App\ApiError;

// Cette classe représente une erreur API au format RFC 7807
// Elle est immuable : une fois créée, on ne modifie pas ses propriétés
class ProblemDetails
{
    // Le type est une URI qui identifie le type d'erreur
    private string $type;
    // Le titre est un résumé court et fixe de l'erreur
    private string $title;
    // Le code de statut HTTP
    private int $status;
    // Le détail est spécifique à cette occurrence de l'erreur
    private string $detail;
    // L'instance identifie cette occurrence précise (optionnel)
    private ?string $instance;
    // Les champs supplémentaires (violations, etc.)
    private array $extra;

    public function __construct(
        string $type,
        string $title,
        int $status,
        string $detail = '',
        ?string $instance = null,
        array $extra = []
    ) {
        $this->type = $type;
        $this->title = $title;
        $this->status = $status;
        $this->detail = $detail;
        $this->instance = $instance;
        $this->extra = $extra;
    }

    // Convertit l'objet en tableau pour la sérialisation JSON
    public function toArray(): array
    {
        $data = [
            'type' => $this->type,
            'title' => $this->title,
            'status' => $this->status,
        ];

        // On n'inclut les champs optionnels que s'ils sont renseignés
        if ($this->detail !== '') {
            $data['detail'] = $this->detail;
        }

        if ($this->instance !== null) {
            $data['instance'] = $this->instance;
        }

        // On fusionne les champs supplémentaires
        return array_merge($data, $this->extra);
    }

    public function getStatus(): int
    {
        return $this->status;
    }
}
```

**Résultat attendu** : une classe capable de générer un tableau conforme à la RFC 7807.

---

### Étape 2 : Créer une factory pour les erreurs courantes

Crée une factory qui simplifie la création des erreurs les plus fréquentes.

```php
<?php
// src/ApiError/ProblemDetailsFactory.php

namespace App\ApiError;

// Cette factory crée des objets ProblemDetails pour les cas courants
// Elle centralise les types d'erreur et garantit la cohérence
class ProblemDetailsFactory
{
    // URL de base pour les types d'erreur
    // En production, ce sera l'URL réelle de ta documentation
    private const BASE_URI = 'https://api.example.com/errors';

    // Erreur de validation (422)
    // $violations est un tableau d'erreurs de validation
    public function validationFailed(array $violations): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/validation-failed',
            title: 'Validation des données échouée',
            status: 422,
            detail: count($violations) . ' erreur(s) de validation détectée(s).',
            extra: ['violations' => $violations]
        );
    }

    // Ressource non trouvée (404)
    public function notFound(string $resource, mixed $id): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/not-found',
            title: 'Ressource non trouvée',
            status: 404,
            detail: sprintf(
                'La ressource %s avec l\'identifiant %s n\'existe pas.',
                $resource,
                $id
            )
        );
    }

    // Conflit - doublon (409)
    public function conflict(string $field, string $value): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/conflict',
            title: 'Conflit de données',
            status: 409,
            detail: sprintf(
                'Un élément avec la valeur "%s" pour le champ "%s" existe déjà.',
                $value,
                $field
            )
        );
    }

    // JSON invalide (400)
    public function invalidJson(): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/invalid-json',
            title: 'JSON invalide',
            status: 400,
            detail: 'Le corps de la requête n\'est pas du JSON valide.'
        );
    }

    // Erreur serveur (500)
    // Le message détaillé va dans les logs, pas dans la réponse
    public function serverError(): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/server-error',
            title: 'Erreur interne du serveur',
            status: 500,
            detail: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
        );
    }

    // Accès refusé (403)
    public function forbidden(): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/forbidden',
            title: 'Accès refusé',
            status: 403,
            detail: 'Vous n\'avez pas les droits suffisants pour cette action.'
        );
    }

    // Authentification requise (401)
    public function unauthorized(): ProblemDetails
    {
        return new ProblemDetails(
            type: self::BASE_URI . '/unauthorized',
            title: 'Authentification requise',
            status: 401,
            detail: 'Token d\'authentification manquant ou invalide.'
        );
    }
}
```

**Résultat attendu** : une factory qui crée des erreurs standardisées en une seule ligne de code.

---

### Étape 3 : Intégrer la validation Symfony

Crée un service qui transforme les erreurs de validation Symfony en format RFC 7807.

```php
<?php
// src/ApiError/ValidationErrorBuilder.php

namespace App\ApiError;

use Symfony\Component\Validator\ConstraintViolationListInterface;

// Ce service transforme les violations de validation Symfony
// en un format structuré pour la RFC 7807
class ValidationErrorBuilder
{
    public function __construct(
        private ProblemDetailsFactory $factory,
    ) {
    }

    // Transforme une liste de violations Symfony en ProblemDetails
    public function fromViolations(
        ConstraintViolationListInterface $violations
    ): ProblemDetails {
        $errors = [];

        foreach ($violations as $violation) {
            $errors[] = [
                // Le champ qui a provoqué l'erreur (ex: "title", "email")
                'field' => $violation->getPropertyPath(),
                // Le message lisible par un humain
                'message' => $violation->getMessage(),
                // Le code d'erreur applicatif
                // On transforme le code Symfony en code lisible
                'code' => $this->resolveCode($violation),
            ];
        }

        return $this->factory->validationFailed($errors);
    }

    // Transforme le code de contrainte Symfony en code applicatif lisible
    private function resolveCode(mixed $violation): string
    {
        // Symfony fournit un code UUID pour chaque contrainte
        // On le transforme en code lisible
        $message = $violation->getMessage();
        $constraint = $violation->getCode();

        // Mapping des codes Symfony les plus courants
        $map = [
            'c1051bb4-d103-4f74-8988-acbcafc7fdc3' => 'FIELD_REQUIRED',
            '57c2f299-1154-4870-89bb-ef3b1f5ad229' => 'FIELD_BLANK',
            'bd79c0ab-ddba-46cc-a703-a7571571d5af' => 'INVALID_EMAIL',
            'd94b19cc-114f-4f44-9cc4-4138e80a87b9' => 'TOO_SHORT',
            '25e6c5e4-a5d7-4b7c-8ac4-e18f3c4f5a6d' => 'TOO_LONG',
        ];

        return $map[$constraint] ?? 'VALIDATION_ERROR';
    }
}
```

**Résultat attendu** : les erreurs de validation Symfony sont automatiquement transformées en format RFC 7807.

---

### Étape 4 : Utiliser dans le contrôleur

Intègre la gestion d'erreurs dans un contrôleur.

```php
<?php
// src/Controller/Api/UserController.php

namespace App\Controller\Api;

use App\ApiError\ProblemDetailsFactory;
use App\ApiError\ValidationErrorBuilder;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/users')]
class UserController extends AbstractController
{
    public function __construct(
        private ProblemDetailsFactory $problemFactory,
        private ValidationErrorBuilder $validationBuilder,
    ) {
    }

    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        ValidatorInterface $validator,
        EntityManagerInterface $em
    ): JsonResponse {
        // Étape 1 : Décoder le JSON
        $payload = json_decode($request->getContent(), true);

        // Si le JSON est invalide, retourner 400 au format RFC 7807
        if ($payload === null) {
            $problem = $this->problemFactory->invalidJson();
            return $this->problemResponse($problem);
        }

        // Étape 2 : Créer l'entité et la remplir
        $user = new User();
        $user->setEmail($payload['email'] ?? '');
        $user->setUsername($payload['username'] ?? '');

        // Étape 3 : Valider avec le Validator Symfony
        $violations = $validator->validate($user);

        // S'il y a des erreurs de validation, retourner 422 au format RFC 7807
        if (count($violations) > 0) {
            $problem = $this->validationBuilder->fromViolations($violations);
            return $this->problemResponse($problem);
        }

        // Étape 4 : Persister
        $em->persist($user);
        $em->flush();

        return $this->json(
            ['id' => $user->getId(), 'email' => $user->getEmail()],
            Response::HTTP_CREATED
        );
    }

    // Méthode utilitaire pour retourner une réponse au format RFC 7807
    private function problemResponse(
        \App\ApiError\ProblemDetails $problem
    ): JsonResponse {
        $response = new JsonResponse(
            $problem->toArray(),
            $problem->getStatus()
        );

        // Le Content-Type RFC 7807 est application/problem+json
        $response->headers->set('Content-Type', 'application/problem+json');

        return $response;
    }
}
```

**Résultat attendu** :

```bash
# Envoi d'un JSON invalide
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{invalid json'
```

```json
{
    "type": "https://api.example.com/errors/invalid-json",
    "title": "JSON invalide",
    "status": 400,
    "detail": "Le corps de la requête n'est pas du JSON valide."
}
```

```bash
# Envoi de données invalides
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "pas-un-email", "username": ""}'
```

```json
{
    "type": "https://api.example.com/errors/validation-failed",
    "title": "Validation des données échouée",
    "status": 422,
    "detail": "2 erreur(s) de validation détectée(s).",
    "violations": [
        {
            "field": "email",
            "message": "Cette valeur n'est pas une adresse email valide.",
            "code": "INVALID_EMAIL"
        },
        {
            "field": "username",
            "message": "Cette valeur ne doit pas être vide.",
            "code": "FIELD_BLANK"
        }
    ]
}
```

---

### Étape 5 : Créer un EventListener global pour les exceptions

Crée un listener qui intercepte toutes les exceptions et les transforme en réponses RFC 7807.

```php
<?php
// src/EventListener/ApiExceptionListener.php

namespace App\EventListener;

use App\ApiError\ProblemDetails;
use App\ApiError\ProblemDetailsFactory;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

// Ce listener intercepte toutes les exceptions pour les routes /api/*
// et les transforme en réponses RFC 7807
#[AsEventListener]
class ApiExceptionListener
{
    public function __construct(
        private ProblemDetailsFactory $factory,
        private LoggerInterface $logger,
        // L'environnement actuel (dev, prod)
        private string $environment,
    ) {
    }

    public function __invoke(ExceptionEvent $event): void
    {
        $request = $event->getRequest();

        // On ne traite que les requêtes API (URL commençant par /api/)
        if (!str_starts_with($request->getPathInfo(), '/api/')) {
            return;
        }

        $exception = $event->getThrowable();

        // On log l'exception complète pour le développeur
        $this->logger->error('API Exception', [
            'message' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
            'url' => $request->getUri(),
        ]);

        // On crée la réponse ProblemDetails
        $problem = $this->createProblem($exception);

        $response = new JsonResponse(
            $problem->toArray(),
            $problem->getStatus()
        );
        $response->headers->set('Content-Type', 'application/problem+json');

        // On remplace la réponse par notre réponse formatée
        $event->setResponse($response);
    }

    private function createProblem(\Throwable $exception): ProblemDetails
    {
        // Si c'est une exception HTTP Symfony (NotFoundHttpException, etc.)
        if ($exception instanceof HttpExceptionInterface) {
            $status = $exception->getStatusCode();

            return match ($status) {
                404 => $this->factory->notFound('ressource', 'inconnue'),
                403 => $this->factory->forbidden(),
                401 => $this->factory->unauthorized(),
                // Pour les autres codes HTTP, on crée un ProblemDetails générique
                default => new ProblemDetails(
                    type: 'https://api.example.com/errors/http-error',
                    title: 'Erreur HTTP',
                    status: $status,
                    detail: $exception->getMessage()
                ),
            };
        }

        // Pour toutes les autres exceptions → 500
        // En production, on ne montre PAS le message d'exception
        // En développement, on peut montrer plus de détails
        if ($this->environment === 'dev') {
            return new ProblemDetails(
                type: 'https://api.example.com/errors/server-error',
                title: 'Erreur interne du serveur',
                status: 500,
                detail: $exception->getMessage(),
                extra: ['trace' => $exception->getTraceAsString()]
            );
        }

        return $this->factory->serverError();
    }
}
```

Configuration du service :

```yaml
# config/services.yaml

services:
    App\EventListener\ApiExceptionListener:
        arguments:
            $environment: '%kernel.environment%'
```

**Résultat attendu** : toutes les exceptions dans les routes `/api/*` retournent automatiquement une réponse au format RFC 7807.

---

### Étape 6 : Gérer l'internationalisation des erreurs

Crée un système pour retourner les messages d'erreur dans la langue du client.

```php
<?php
// src/ApiError/TranslatableViolationBuilder.php

namespace App\ApiError;

use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

// Ce service traduit les messages de validation selon la locale du client
class TranslatableViolationBuilder
{
    public function __construct(
        private ProblemDetailsFactory $factory,
        private TranslatorInterface $translator,
    ) {
    }

    // Transforme les violations en ProblemDetails avec messages traduits
    public function fromViolations(
        ConstraintViolationListInterface $violations,
        string $locale = 'fr'
    ): ProblemDetails {
        $errors = [];

        foreach ($violations as $violation) {
            $errors[] = [
                'field' => $violation->getPropertyPath(),
                // Le message est traduit selon la locale
                'message' => $this->translator->trans(
                    $violation->getMessageTemplate(),
                    $violation->getParameters(),
                    'validators',
                    $locale
                ),
                'code' => $this->resolveCode($violation->getCode()),
            ];
        }

        return $this->factory->validationFailed($errors);
    }

    private function resolveCode(?string $code): string
    {
        $map = [
            'c1051bb4-d103-4f74-8988-acbcafc7fdc3' => 'FIELD_REQUIRED',
            'bd79c0ab-ddba-46cc-a703-a7571571d5af' => 'INVALID_EMAIL',
        ];

        return $map[$code] ?? 'VALIDATION_ERROR';
    }
}
```

Le client indique sa langue via le header `Accept-Language` :

```bash
# Requête en français
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -H "Accept-Language: fr" \
  -d '{"email": ""}'

# Requête en anglais
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"email": ""}'
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `curl -i -X POST URL -H "Content-Type: application/json" -d '{}'` | Tester une erreur de validation |
| `curl -i -X GET http://localhost:8000/api/inexistant` | Tester une erreur 404 |
| `php bin/console debug:event-dispatcher kernel.exception` | Lister les listeners d'exception |
| `php bin/console debug:validator App\\Entity\\User` | Voir les contraintes de validation d'une entité |

---

## Pièges Fréquents

### Piège 1 : Exposer les détails techniques en production

⚠️ **Problème** : La réponse d'erreur contient la stack trace PHP, le nom de la table SQL ou le chemin du fichier.

✅ **Solution** : En production, ne retourne que des messages génériques pour les erreurs 5xx. Les détails vont dans les logs.

```php
<?php
// ❌ Incorrect en production
return $this->json([
    'error' => $exception->getMessage(),
    'file' => $exception->getFile(),
    'line' => $exception->getLine(),
], 500);

// ✅ Correct en production
$this->logger->error('API Error', ['exception' => $exception]);
return $this->json([
    'type' => 'https://api.example.com/errors/server-error',
    'title' => 'Erreur interne du serveur',
    'status' => 500,
], 500);
```

### Piège 2 : Retourner 200 avec un message d'erreur dans le body

⚠️ **Problème** : La réponse retourne 200 OK avec `{"success": false, "error": "Not found"}`. Le client HTTP ne détecte pas l'erreur automatiquement.

✅ **Solution** : Toujours utiliser le code de statut HTTP approprié (400, 404, 422, etc.). Le body fournit les détails, le code de statut indique la catégorie d'erreur.

### Piège 3 : Oublier le Content-Type application/problem+json

⚠️ **Problème** : Les réponses d'erreur utilisent `Content-Type: application/json` au lieu de `application/problem+json`. Le client ne sait pas que c'est une réponse RFC 7807.

✅ **Solution** : Toujours définir le header `Content-Type: application/problem+json` pour les réponses d'erreur.

```php
<?php
$response->headers->set('Content-Type', 'application/problem+json');
```

### Piège 4 : Ne pas différencier 400 et 422

⚠️ **Problème** : Toutes les erreurs de données retournent 400. Le client ne sait pas si le JSON est cassé ou si les données sont invalides.

✅ **Solution** : 400 = le JSON est syntaxiquement invalide. 422 = le JSON est valide mais les données ne respectent pas les règles métier.

---

## Checklist de Validation

- [ ] Mes erreurs API suivent le format RFC 7807 (type, title, status, détail)
- [ ] Le Content-Type des réponses d'erreur est `application/problem+json`
- [ ] Les erreurs de validation retournent 422 avec un tableau `violations`
- [ ] Chaque violation contient `field`, `message` et `code`
- [ ] Les erreurs 5xx ne révèlent pas de détails techniques en production
- [ ] Un EventListener global intercepte les exceptions non gérées
- [ ] Je différencie 400 (JSON cassé) de 422 (validation échouée)
- [ ] Les erreurs sont loguées côté serveur avec tous les détails techniques

---

## Exercice Pratique

**Énoncé** : Implémente la gestion d'erreurs RFC 7807 pour l'API de livres (fiches 1 et 2).

**Spécifications** :

- Crée une classe `ProblemDetails` et une `ProblemDetailsFactory`
- Ajoute la validation Symfony sur l'entité `Book` : `title` NotBlank, `author` NotBlank, `isbn` unique (vérification manuelle)
- Les erreurs de validation retournent 422 avec un tableau `violations` contenant `field`, `message` et `code`
- Un JSON invalide retourne 400
- Un isbn en doublon retourne 409
- Crée un `ApiExceptionListener` qui intercepte les exceptions pour les routes `/api/*`
- En mode `dev`, la réponse 500 inclut le message de l'exception. En mode `prod`, la réponse est générique.

**Indications** :

- Utilise les contraintes Assert de Symfony : `#[Assert\NotBlank]`, `#[Assert\Length]`
- Vérifie l'unicité de l'ISBN dans le contrôleur avant `persist()`
- Teste les erreurs avec curl : JSON invalide, champs manquants, ISBN en doublon

**Résultat attendu** : toutes les erreurs retournent une réponse RFC 7807 avec le bon code de statut et le bon Content-Type.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Entity/Book.php - avec les contraintes de validation

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Le titre est obligatoire et doit faire entre 1 et 255 caractères
    #[Assert\NotBlank(message: 'Le titre est obligatoire.')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'Le titre ne peut pas dépasser {{ limit }} caractères.'
    )]
    #[ORM\Column(length: 255)]
    private string $title = '';

    // L'auteur est obligatoire
    #[Assert\NotBlank(message: 'L\'auteur est obligatoire.')]
    #[ORM\Column(length: 255)]
    private string $author = '';

    // L'ISBN est optionnel mais doit être unique (vérifié dans le contrôleur)
    #[Assert\Length(
        min: 10,
        max: 13,
        minMessage: 'L\'ISBN doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'L\'ISBN ne peut pas dépasser {{ limit }} caractères.'
    )]
    #[ORM\Column(length: 13, nullable: true, unique: true)]
    private ?string $isbn = null;

    #[ORM\Column(nullable: true)]
    private ?int $publishedYear = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $genre = null;

    // Getters et setters...
    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getAuthor(): string { return $this->author; }
    public function setAuthor(string $author): self { $this->author = $author; return $this; }
    public function getIsbn(): ?string { return $this->isbn; }
    public function setIsbn(?string $isbn): self { $this->isbn = $isbn; return $this; }
    public function getPublishedYear(): ?int { return $this->publishedYear; }
    public function setPublishedYear(?int $year): self { $this->publishedYear = $year; return $this; }
    public function getGenre(): ?string { return $this->genre; }
    public function setGenre(?string $genre): self { $this->genre = $genre; return $this; }
}
```

```php
<?php
// src/Controller/Api/BookController.php - méthode create avec gestion d'erreurs

#[Route('', methods: ['POST'])]
public function create(
    Request $request,
    ValidatorInterface $validator,
    EntityManagerInterface $em,
    BookRepository $repository,
    ProblemDetailsFactory $problemFactory,
    ValidationErrorBuilder $validationBuilder
): JsonResponse {
    // Étape 1 : JSON valide ?
    $payload = json_decode($request->getContent(), true);
    if ($payload === null) {
        $problem = $problemFactory->invalidJson();
        return new JsonResponse(
            $problem->toArray(),
            $problem->getStatus(),
            ['Content-Type' => 'application/problem+json']
        );
    }

    // Étape 2 : Créer et remplir l'entité
    $book = new Book();
    $book->setTitle($payload['title'] ?? '');
    $book->setAuthor($payload['author'] ?? '');
    $book->setIsbn($payload['isbn'] ?? null);
    $book->setPublishedYear($payload['publishedYear'] ?? null);
    $book->setGenre($payload['genre'] ?? null);

    // Étape 3 : Valider
    $violations = $validator->validate($book);
    if (count($violations) > 0) {
        $problem = $validationBuilder->fromViolations($violations);
        return new JsonResponse(
            $problem->toArray(),
            $problem->getStatus(),
            ['Content-Type' => 'application/problem+json']
        );
    }

    // Étape 4 : Vérifier l'unicité de l'ISBN
    if ($book->getIsbn() !== null) {
        $existing = $repository->findOneBy(['isbn' => $book->getIsbn()]);
        if ($existing !== null) {
            $problem = $problemFactory->conflict('isbn', $book->getIsbn());
            return new JsonResponse(
                $problem->toArray(),
                $problem->getStatus(),
                ['Content-Type' => 'application/problem+json']
            );
        }
    }

    // Étape 5 : Persister
    $em->persist($book);
    $em->flush();

    return $this->json(
        ['id' => $book->getId(), 'title' => $book->getTitle()],
        Response::HTTP_CREATED
    );
}
```

---

## Navigation

← Fiche précédente : **[02 - Pagination, filtrage et tri](02-pagination-filtrage-tri.md)**

→ Fiche suivante : **[04 - OpenAPI et Swagger](04-openapi-swagger.md)**
