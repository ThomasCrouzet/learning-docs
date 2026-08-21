---
tags:
  - Architecture
  - Sécurité
  - Intermédiaire
description: "Anti-énumération : empêcher un attaquant de découvrir quels comptes existent via les retours d'erreur du formulaire de login, d'inscription ou de reset password."
estimated_time: "60 min"
fiche_number: 14
total_fiches: 17
cursus: "Architecture et Design Patterns"
id: "web.architecture.anti-enumeration"
course_id: "web.architecture"
content_type: "lesson"
order: 14
---

# 14 - Anti-énumération : ne pas révéler qui existe

> **En bref** : Si ton formulaire répond "Email inconnu" quand l'email n'existe pas et "Mot de passe incorrect" quand il existe, un attaquant peut énumérer les comptes. Cette fiche te montre comment renvoyer la même réponse dans les deux cas, sans dégrader l'expérience utilisateur légitime. Lecture estimée : 60 min.

## Prérequis

- [Cursus PHP](../02-php/index.md)
- Fiche [Sécurité et utilisateurs](../03-symfony/12-securite-utilisateurs.md) du cursus Symfony

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les zones de ton application vulnérables à l'énumération, écrire des réponses indistinguables entre cas d'erreur et cas de succès, et compléter cette protection par du rate limiting.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'énumération de comptes ?

**Définition** : L'énumération de comptes est une technique d'attaque qui consiste à découvrir, un par un, quels comptes (emails, noms d'utilisateur, numéros) existent dans un système. L'attaquant n'essaie pas encore de se connecter : il construit d'abord une liste de cibles valides en exploitant les messages d'erreur ou les comportements différents de l'application.

**Le problème que l'énumération crée** :

Sans protection contre l'énumération, voici les problèmes rencontrés :

1. **Liste de cibles précise** : l'attaquant constitue une liste validée de comptes existants avant de lancer une attaque par force brute. Au lieu de tester 1 million d'emails au hasard, il en cible 10 000 qu'il sait valides.
2. **Atteinte à la vie privée** : un attaquant peut découvrir qu'une personne précise (avec son adresse email professionnelle ou personnelle) possède un compte sur un service sensible (banque, santé, site adulte, plateforme militante).
3. **Phishing ciblé** : avec une liste d'emails confirmés, l'attaquant peut envoyer des emails de phishing crédibles ("Bonjour, votre compte chez Service X requiert une action").

**Comment l'anti-énumération résout ces problèmes** :

| Problème | Solution apportée par l'anti-énumération |
| --- | --- |
| Liste de cibles précise | Aucun message ne confirme l'existence d'un compte |
| Atteinte à la vie privée | L'attaquant ne peut pas distinguer "compte existe" et "compte n'existe pas" |
| Phishing ciblé | Les emails inconnus produisent la même réponse que les emails connus |

**Analogie concrète** : Imagine un voleur qui sonne à chaque porte d'un immeuble pour voir laquelle a un nom sur la sonnette. Une fois sa liste constituée, il peut planifier son cambriolage sur les appartements occupés. L'énumération, c'est ça : tester chaque "sonnette" (email) pour voir laquelle correspond à un compte réel. L'anti-énumération, c'est masquer tous les noms sur les sonnettes.

**Ce que l'énumération n'est PAS** :

- L'énumération n'est pas une attaque par force brute. La force brute essaie de deviner des mots de passe sur un compte connu. L'énumération vient avant : elle cherche à savoir quels comptes existent.
- L'énumération n'est pas une fuite massive de données (data breach). Un data breach expose tout le contenu de la base d'un coup. L'énumération est un sondage discret, un compte à la fois, en exploitant le comportement normal de l'application.

**Comparaison énumération vs force brute** :

| Énumération | Force brute |
| --- | --- |
| Cherche à savoir QUI existe | Cherche à deviner LE mot de passe |
| Vise les emails ou identifiants | Vise les mots de passe |
| Exploite les messages d'erreur | Exploite la faiblesse des mots de passe |
| Étape de reconnaissance | Étape d'exploitation |

---

### Quels sont les trois points d'entrée vulnérables ?

**Définition** : Trois fonctionnalités courantes d'une application web peuvent involontairement révéler quels comptes existent : le formulaire de connexion (login), le formulaire d'inscription (signup) et le formulaire de mot de passe oublié (reset password). Chacun a son signal de fuite caractéristique.

**Le problème que ces points d'entrée créent** :

1. **Surface d'attaque multiple** : même si tu protèges le login, un attaquant peut énumérer via le formulaire d'inscription.
2. **Mesures incohérentes** : on protège souvent un seul formulaire et on oublie les deux autres.
3. **Comportements asynchrones** : le reset password envoie ou non un email selon que le compte existe, ce qui se mesure côté serveur de mail.

**Tableau des signaux qui trahissent l'existence d'un compte** :

| Fonctionnalité | Signal qui trahit l'existence |
| --- | --- |
| Login | Message différent entre "email inconnu" et "mot de passe incorrect" |
| Inscription | Message "cet email est déjà utilisé" lors de la création |
| Reset password | Message "email envoyé" pour un compte existant, "email inconnu" sinon |

**Analogie concrète** : Imagine un immeuble avec trois entrées différentes : la porte principale (login), la porte de l'agence de location (inscription) et la boîte aux lettres collective (reset password). Si tu sécurises seulement la porte principale, un voleur peut toujours interroger la gardienne de l'agence ("Avez-vous un appartement loué par M. Dupont ?") ou observer quelles lettres arrivent à quelle adresse. L'anti-énumération doit couvrir les trois entrées.

**Ce que ces points d'entrée ne sont PAS** :

- Ce ne sont pas les seuls points vulnérables. Une API de recherche de profils publics, une fonction "inviter un ami par email", ou même un formulaire de contact peuvent aussi fuiter l'information.
- Ces points ne sont pas faciles à protéger sans réfléchir à l'expérience utilisateur. On y reviendra dans l'étape 1.

---

### Qu'est-ce que le principe d'indistinguabilité ?

**Définition** : Le principe d'indistinguabilité dit que pour une même action utilisateur, la réponse de l'application doit être strictement identique, que l'entrée corresponde à un compte existant ou non. Un attaquant ne doit pas pouvoir distinguer les deux cas en regardant la réponse.

**Le problème que l'indistinguabilité résout** :

1. **Fuite d'information par le contenu** : un message différent révèle directement l'état du compte.
2. **Fuite d'information par le code HTTP** : retourner 200 dans un cas et 404 dans l'autre est aussi une fuite.
3. **Fuite d'information par la présence d'un cookie** : créer une session uniquement quand le compte existe est aussi détectable.

**Comment l'indistinguabilité résout ces problèmes** :

| Mauvaise réponse | Bonne réponse |
| --- | --- |
| "Cet email n'existe pas" | "Si un compte existe avec cet email, tu vas recevoir un lien" |
| "Mot de passe incorrect" | "Identifiants invalides" |
| "Cet email est déjà utilisé" | "Si tu as déjà un compte, utilise mot de passe oublié" |

**Analogie concrète** : Imagine que tu téléphones à un standard. Pour chaque question que tu poses, la standardiste répond toujours la même phrase : "Votre message a été transmis." Tu ne sais pas si elle a vraiment trouvé le destinataire, ni si elle a noté ta demande. C'est frustrant, mais aucun attaquant ne peut t'utiliser pour deviner qui travaille dans l'entreprise.

**Ce que l'indistinguabilité n'est PAS** :

- L'indistinguabilité n'est pas le silence. Tu dois quand même répondre quelque chose à l'utilisateur, sinon il croit que le formulaire est cassé.
- L'indistinguabilité n'est pas un mensonge délibéré. Tu n'affirmes pas qu'un compte existe : tu dis "si un compte existe, voici ce qui se passe".

**Comparaison réponse explicite vs indistinguable** :

| Réponse explicite (mauvais) | Réponse indistinguable (bon) |
| --- | --- |
| Révèle l'état du compte | Couvre tous les cas |
| "Plus pratique" pour l'utilisateur | Un peu moins direct, mais sécurisé |
| Facilite l'énumération | Bloque l'énumération |
| Souvent demandé par les designers UX | Compromis acceptable avec un bon wording |

---

### Qu'est-ce qu'une timing attack ?

**Définition** : Une timing attack (attaque temporelle) consiste à mesurer le temps de réponse du serveur pour deviner ce qu'il a fait. Même si la réponse textuelle est identique dans tous les cas, le serveur peut prendre 10 ms quand l'email n'existe pas (juste une requête en base) et 200 ms quand il existe (requête en base puis vérification du mot de passe avec un algorithme coûteux comme bcrypt). Cette différence de 190 ms est mesurable et révèle l'existence du compte.

**Le problème que les timing attacks créent** :

1. **Indistinguabilité de surface seulement** : tu as un texte identique, mais le serveur trahit l'information par son temps de réponse.
2. **Mesure statistique fiable** : en répétant la mesure 100 fois et en calculant la moyenne, l'attaquant gomme le bruit du réseau et obtient une mesure stable.
3. **Vulnérabilité par défaut** : la plupart des frameworks ne hashent pas un mot de passe leurre quand l'utilisateur n'existe pas. Tu dois ajouter cette protection explicitement.

**Comment se protéger des timing attacks** :

| Cas | Protection à appliquer |
| --- | --- |
| Vérification de mot de passe | Hasher un mot de passe leurre quand l'utilisateur n'existe pas |
| Comparaison de tokens | Utiliser `hash_equals()` (comparaison en temps constant) |
| Comparaison de chaînes sensibles | Jamais `===` ou `==` sur un secret |
| Calcul de durée variable | Forcer une durée minimale via `usleep()` (technique de dernier recours) |

**Analogie concrète** : Imagine que tu poses la même question à deux personnes : "Vous connaissez M. Dupont ?" Toutes les deux répondent "Je ne peux rien dire." Mais la première répond instantanément, et la seconde hésite 5 secondes avant de répondre. Tu en déduis que la seconde a probablement réfléchi à quoi répondre parce qu'elle connaît M. Dupont. Le timing révèle l'information même quand le texte ne la révèle pas.

**Ce qu'une timing attack n'est PAS** :

- Une timing attack n'est pas une attaque par déni de service. Le DDoS sature le serveur, la timing attack mesure sa rapidité normale.
- Une timing attack n'est pas réservée aux experts. Avec un script en 20 lignes et 1000 requêtes, n'importe qui peut détecter une différence de 50 ms.

---

### Pourquoi le rate limiting est-il indispensable ?

**Définition** : Le rate limiting (limitation de débit) restreint le nombre de requêtes qu'une même source peut envoyer dans un intervalle de temps. Par exemple : "maximum 5 tentatives de login par IP par 15 minutes". Sans rate limiting, un attaquant peut tester 1000 emails par seconde et énumérer ta base entière en quelques heures, même avec des messages indistinguables.

**Le problème que l'absence de rate limiting crée** :

1. **Énumération à grande échelle** : sans limite, l'attaquant teste des millions d'emails dans la nuit.
2. **Mesures de timing facilitées** : plus l'attaquant fait de requêtes, plus sa moyenne de timing est précise.
3. **Saturation des services en aval** : envoyer des emails de reset pour 100 000 utilisateurs en quelques minutes peut bloquer ton service SMTP et alerter ton fournisseur.

**Comment le rate limiting complète l'anti-énumération** :

| Mesure | Couverture |
| --- | --- |
| Indistinguabilité textuelle | Bloque la fuite par message |
| Hash leurre + `hash_equals` | Bloque la fuite par timing |
| Rate limiting par IP | Bloque le volume d'attaques |
| Monitoring + alertes | Détecte une tentative en cours |

**Analogie concrète** : L'indistinguabilité, c'est masquer les sonnettes. Le rate limiting, c'est la règle "interdit de sonner plus de 5 sonnettes par minute, sinon le concierge sort". Les deux mesures combinées rendent l'énumération coûteuse en temps et bruyante.

**Ce que le rate limiting n'est PAS** :

- Le rate limiting n'est pas un CAPTCHA. Le CAPTCHA bloque les bots évidents, le rate limiting limite tout le monde (y compris les bots déguisés en humains).
- Le rate limiting basé uniquement sur l'IP n'est pas infaillible. Un attaquant peut faire tourner ses requêtes sur 1000 IPs via TOR ou un botnet. Il faut combiner plusieurs signaux (IP, user-agent, empreinte de navigateur, etc.).

---

## Étapes Pratiques

### Étape 1 : Réécrire le formulaire de reset password

Cette étape transforme un formulaire qui révèle l'existence des comptes en un formulaire indistinguable. La logique est simple : on cherche l'utilisateur, on lui envoie un email s'il existe, et on affiche toujours le même message.

Code complet du contrôleur :

```php
<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\PasswordResetService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PasswordResetController extends AbstractController
{
    #[Route('/mot-de-passe-oublie', name: 'forgot_password', methods: ['GET', 'POST'])]
    public function forgot(
        Request $request,
        UserRepository $users,
        PasswordResetService $resetService,
    ): Response {
        // On gère le POST : l'utilisateur a soumis son email
        if ($request->isMethod('POST')) {
            // Récupération de l'email saisi (chaîne vide si absent)
            $email = (string) $request->request->get('email', '');

            // Recherche silencieuse du compte
            // Si le compte n'existe pas, on ne lève pas d'exception
            $user = $users->findOneActiveByEmail($email);

            // On envoie l'email UNIQUEMENT si le compte existe
            // Mais on ne le dit pas à l'utilisateur
            if ($user !== null) {
                $resetService->sendResetEmail($user);
            }

            // Message identique dans les deux cas (existe ou non)
            // C'est le coeur de l'indistinguabilité textuelle
            $this->addFlash(
                'success',
                'Si un compte existe avec cette adresse, un lien vient d\'être envoyé.'
            );

            // Redirection pour éviter le double POST
            return $this->redirectToRoute('forgot_password');
        }

        // Affichage du formulaire vide en GET
        return $this->render('security/forgot.html.twig');
    }
}
```

**Résultat attendu** :

```text
Que l'email saisi corresponde à un compte ou non, l'utilisateur voit toujours :

  "Si un compte existe avec cette adresse, un lien vient d'être envoyé."

Le code HTTP est 302 (redirection) dans les deux cas.
Le cookie de session est identique dans les deux cas.
```

Remarques importantes :

- Le flash est identique dans les deux cas (utilisateur trouvé ou non).
- Aucun message d'erreur ne révèle l'existence ou non du compte.
- La redirection après POST évite que l'utilisateur ne renvoie sa requête en rafraîchissant la page.

---

### Étape 2 : Égaliser le temps de réponse du login

Cette étape règle le problème de la timing attack sur le login. On hashe un mot de passe leurre quand l'utilisateur n'existe pas, pour que le temps total soit comparable au cas où l'utilisateur existe.

```php
<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class LoginAuthenticator
{
    // Hash bcrypt cost=13 d'un mot de passe jamais utilisé en production
    // Généré une fois avec password_hash() : 60 caractères, alphabet bcrypt valide
    // Un placeholder tronqué n'égalise PAS le timing (password_verify court-circuite)
    private const DUMMY_PASSWORD_HASH = '$2y$13$FqDauFQ4phD3NunncBFEa.M6KShgMKX4ZPtja20OE1/63dSkWUNTO';

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $users,
    ) {
    }

    public function authenticate(string $email, string $plainPassword): ?User
    {
        // Recherche du compte (quelques millisecondes)
        $user = $this->users->findOneActiveByEmail($email);

        if ($user === null) {
            // L'utilisateur n'existe pas
            // On exécute quand même un password_verify
            // Sinon le serveur répond beaucoup plus vite que dans l'autre branche
            // ce qui révèle immédiatement que le compte n'existe pas
            password_verify($plainPassword, self::DUMMY_PASSWORD_HASH);

            // On retourne null comme dans le cas "mot de passe incorrect"
            return null;
        }

        // L'utilisateur existe : on vérifie son mot de passe pour de vrai
        if (!$this->passwordHasher->isPasswordValid($user, $plainPassword)) {
            return null;
        }

        // Tout est bon : on retourne l'utilisateur authentifié
        return $user;
    }
}
```

**Résultat attendu** :

```text
Test avec un email inexistant : temps moyen 195 ms
Test avec un email existant + mauvais mot de passe : temps moyen 200 ms
Différence : 5 ms, sous le seuil de bruit réseau

Avant la protection :
Test avec un email inexistant : temps moyen 3 ms
Test avec un email existant + mauvais mot de passe : temps moyen 200 ms
Différence : 197 ms, parfaitement mesurable
```

Le contrôleur de login appelle ensuite ce service et renvoie toujours le même message générique :

```php
if ($user === null) {
    $this->addFlash('error', 'Identifiants invalides.');
    return $this->redirectToRoute('login');
}
```

---

### Étape 3 : Comparer des tokens avec hash_equals

Quand tu vérifies un token (token de reset password, token d'activation de compte, token CSRF), tu compares deux chaînes. Si tu utilises `===` ou `==`, la comparaison s'arrête au premier caractère différent : deux chaînes qui diffèrent dès le premier caractère sont comparées plus vite que deux chaînes qui ne diffèrent qu'au dernier. C'est exploitable par timing.

`hash_equals()` compare toujours en temps constant, peu importe où sont les différences.

```php
<?php

namespace App\Service;

use App\Repository\PasswordResetTokenRepository;

final class PasswordResetTokenValidator
{
    public function __construct(
        private PasswordResetTokenRepository $tokens,
    ) {
    }

    public function validate(string $providedToken): ?int
    {
        // On extrait l'identifiant du token fourni (ex: les 16 premiers caractères)
        $tokenId = substr($providedToken, 0, 16);
        $providedSecret = substr($providedToken, 16);

        // On récupère le token stocké correspondant
        $storedToken = $this->tokens->find($tokenId);

        if ($storedToken === null) {
            return null;
        }

        // Récupération du secret attendu (chaîne stockée en base)
        $expectedSecret = $storedToken->getSecret();

        // Comparaison résistante aux timing attacks
        // hash_equals compare chaque caractère même après une différence
        if (!hash_equals($expectedSecret, $providedSecret)) {
            return null;
        }

        // Le token est valide : on retourne l'identifiant de l'utilisateur
        return $storedToken->getUserId();
    }
}
```

**Résultat attendu** :

```text
Temps de comparaison hash_equals avec un token totalement faux : 1.2 microsecondes
Temps de comparaison hash_equals avec un token presque correct : 1.2 microsecondes

Sans hash_equals (avec === ) :
Temps avec un token totalement faux : 0.1 microsecondes
Temps avec un token presque correct (15/16 caractères corrects) : 1.0 microsecondes
```

Règle absolue : ne JAMAIS utiliser `===` ou `==` pour comparer des tokens, signatures, hashes, clés API ou tout autre secret.

---

### Étape 4 : Ajouter du rate limiting

Le rate limiting limite le nombre de tentatives par source. Symfony fournit le composant `RateLimiter` qui s'intègre proprement dans les contrôleurs et le firewall de sécurité.

Configuration `config/packages/rate_limiter.yaml` :

```yaml
framework:
    rate_limiter:
        # Limite globale pour le formulaire de login
        # 5 tentatives par tranche de 15 minutes par identifiant (IP)
        login_form:
            policy: 'token_bucket'
            limit: 5
            rate: { interval: '15 minutes', amount: 5 }

        # Limite pour le formulaire mot de passe oublié
        # 3 demandes par heure par identifiant (IP)
        forgot_password:
            policy: 'sliding_window'
            limit: 3
            interval: '1 hour'

        # Limite pour l'inscription
        # 10 inscriptions par jour par identifiant (IP)
        signup_form:
            policy: 'sliding_window'
            limit: 10
            interval: '24 hours'
```

Application dans le contrôleur :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

final class PasswordResetController extends AbstractController
{
    #[Route('/mot-de-passe-oublie', name: 'forgot_password', methods: ['GET', 'POST'])]
    public function forgot(
        Request $request,
        RateLimiterFactory $forgotPasswordLimiter,
        // ... autres dépendances
    ): Response {
        // On crée un limiteur lié à l'IP de la requête
        $limiter = $forgotPasswordLimiter->create($request->getClientIp());

        // On tente de consommer un jeton du seau
        if (!$limiter->consume(1)->isAccepted()) {
            // Trop de tentatives : on renvoie 429 Too Many Requests
            return new Response(
                'Trop de tentatives, réessaye plus tard.',
                Response::HTTP_TOO_MANY_REQUESTS,
            );
        }

        // ... logique normale du contrôleur (recherche utilisateur, envoi email)
        return $this->redirectToRoute('forgot_password');
    }
}
```

**Résultat attendu** :

```text
1ère requête : 200 OK
2e requête : 200 OK
3e requête : 200 OK
4e requête : 429 Too Many Requests, "Trop de tentatives, réessaye plus tard."

Après 1 heure : compteur réinitialisé.
```

Note de sécurité : si tu es derrière un reverse proxy (Caddy, nginx, Cloudflare), assure-toi que `$request->getClientIp()` renvoie bien l'IP réelle du client et non celle du proxy. Configure les trusted proxies dans `config/packages/framework.yaml`.

---

### Étape 5 : Tester l'indistinguabilité

Un test automatisé garantit que tes deux réponses (email connu, email inconnu) restent identiques au fil des modifications. C'est une protection contre les régressions futures.

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class PasswordResetControllerTest extends WebTestCase
{
    public function testForgotPasswordReturnsIdenticalResponseForKnownAndUnknownEmail(): void
    {
        $client = static::createClient();

        // Cas 1 : email correspondant à un compte existant
        $client->request('POST', '/mot-de-passe-oublie', [
            'email' => 'connu@example.com',
        ]);
        $client->followRedirect();
        $responseKnown = $client->getResponse()->getContent();

        // Cas 2 : email ne correspondant à aucun compte
        $client->request('POST', '/mot-de-passe-oublie', [
            'email' => 'inconnu@example.com',
        ]);
        $client->followRedirect();
        $responseUnknown = $client->getResponse()->getContent();

        // Les deux réponses HTML doivent être strictement identiques
        // Si une future modification réintroduit un message différent
        // ce test échouera immédiatement
        static::assertSame($responseKnown, $responseUnknown);
    }

    public function testLoginReturnsGenericMessageForUnknownEmail(): void
    {
        $client = static::createClient();

        $client->request('POST', '/login', [
            'email' => 'inconnu@example.com',
            'password' => 'peu-importe',
        ]);
        $client->followRedirect();

        // Le message d'erreur doit être générique
        static::assertStringContainsString(
            'Identifiants invalides',
            $client->getResponse()->getContent(),
        );

        // Et NE DOIT PAS contenir de mention de l'existence du compte
        static::assertStringNotContainsString(
            'inconnu',
            $client->getResponse()->getContent(),
        );
    }
}
```

**Résultat attendu** :

```text
PHPUnit
Tests : 2, Assertions : 3, OK
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| `hash_equals($a, $b)` | Comparaison de chaînes résistante aux timing attacks |
| `password_verify($plain, $hash)` | Vérification d'un mot de passe contre un hash bcrypt/argon2 |
| `$limiter->consume(1)->isAccepted()` | Vérifie si la requête respecte le rate limit |
| `RateLimiterFactory` | Service Symfony qui crée des limiteurs liés à une clé (IP, user...) |
| `Response::HTTP_TOO_MANY_REQUESTS` | Code HTTP 429 standard pour signaler un dépassement |
| Flash unique | Même message d'information pour cas succès et cas échec |

---

## Pièges Fréquents

### Piège 1 : Messages d'erreur révélateurs

⚠️ **Problème** : Tu as protégé le login mais tu as oublié l'inscription, qui affiche encore "Cet email est déjà utilisé". Un attaquant peut énumérer en tentant de s'inscrire avec chaque email de sa liste.

✅ **Solution** : Audite TOUS les retours utilisateur de TOUS les formulaires liés aux comptes. Inscription, login, reset password, changement d'email dans le profil, "inviter un ami" : chaque endroit qui prend un email en entrée doit être indistinguable.

```php
// ❌ Inscription qui fuite
if ($this->users->findOneByEmail($email) !== null) {
    throw new \DomainException('Cet email est déjà utilisé.');
}

// ✅ Inscription indistinguable
if ($this->users->findOneByEmail($email) !== null) {
    // On envoie un email "tu as déjà un compte" à l'adresse
    $this->mailer->sendAccountAlreadyExistsNotice($email);
} else {
    // On crée le compte normalement
    $this->users->create($email, $password);
}
// Dans les DEUX cas, on affiche le même message
$this->addFlash('success', 'Si tu n\'avais pas encore de compte, il vient d\'être créé. Sinon, vérifie ta boîte mail.');
```

---

### Piège 2 : Comparaison de tokens avec ===

⚠️ **Problème** : Tu compares un token de reset password avec `if ($expected === $provided)`. C'est vulnérable aux timing attacks : deux tokens qui diffèrent dès le premier caractère sont comparés en moins de nanosecondes, alors que deux tokens identiques sur les 30 premiers caractères prennent plus longtemps.

✅ **Solution** : Toujours utiliser `hash_equals()` pour toute comparaison de secret.

```php
// ❌ Vulnérable aux timing attacks
if ($expectedToken === $providedToken) { /* ... */ }

// ✅ Résistant aux timing attacks
if (hash_equals($expectedToken, $providedToken)) { /* ... */ }
```

---

### Piège 3 : Pas de hash leurre

⚠️ **Problème** : Tu as un message générique pour le login, mais quand l'utilisateur n'existe pas tu retournes `null` immédiatement sans hasher quoi que ce soit. Le temps de réponse trahit le cas "utilisateur inexistant" en 5 ms contre 200 ms pour un cas "mot de passe incorrect".

✅ **Solution** : Toujours exécuter un `password_verify()` factice quand l'utilisateur n'existe pas, avec un hash bcrypt de coût équivalent à celui de tes vrais hashes.

```php
// ❌ Pas de hash leurre
if ($user === null) {
    return null; // Réponse instantanée, trahit l'absence de compte
}

// ✅ Hash leurre
if ($user === null) {
    password_verify($plainPassword, self::DUMMY_PASSWORD_HASH);
    return null;
}
```

---

### Piège 4 : Rate limit basé uniquement sur l'IP

⚠️ **Problème** : Tu limites à 5 tentatives par IP. Un attaquant utilise un botnet de 10 000 IPs ou un proxy distribué. Chaque IP fait 5 tentatives, soit 50 000 tentatives au total, sans déclencher la moindre alerte.

✅ **Solution** : Combine plusieurs signaux dans la clé de rate limiting : IP, user-agent, empreinte de navigateur, email saisi. Ajoute également un rate limit global ("maximum 1000 tentatives sur tout le site par minute") qui détecte les attaques distribuées.

```php
// ❌ Limite uniquement par IP
$limiter = $factory->create($request->getClientIp());

// ✅ Limite combinée IP + email saisi
$key = sprintf('%s|%s', $request->getClientIp(), $email);
$limiter = $factory->create($key);

// + Limite globale séparée
$globalLimiter = $globalFactory->create('global');
if (!$globalLimiter->consume(1)->isAccepted()) {
    // Alerte : tentative massive en cours
}
```

---

### Piège 5 : Anti-énumération sans monitoring

⚠️ **Problème** : Tu as toutes les protections en place, mais aucune alerte. Un attaquant tente l'énumération pendant 3 jours, génère 100 000 lignes de log, et tu ne le sais pas avant qu'un utilisateur signale un comportement suspect.

✅ **Solution** : Ajoute un compteur (Prometheus, Datadog ou simple log structuré) qui suit le taux d'échecs de login, le taux de demandes de reset password, et le taux de retours 429. Configure une alerte quand ces taux dépassent un seuil (par exemple, plus de 100 échecs par minute alors que la moyenne est de 5).

```php
// Dans le contrôleur de login, après chaque échec
// Pas de label "unknown_account" vs "wrong_password" : ce serait de l'énumération via les métriques
$this->metrics->increment('auth.login.failure');

// Une alerte est déclenchée si auth.login.failure > 100/min
```

---

## Checklist de Validation

- [ ] Mon formulaire de reset password renvoie le même message dans tous les cas
- [ ] Mon login utilise un message générique "Identifiants invalides"
- [ ] Mon inscription ne révèle pas qu'un email est déjà utilisé
- [ ] Mes comparaisons de tokens utilisent `hash_equals`
- [ ] Je hash un mot de passe leurre quand l'utilisateur n'existe pas
- [ ] J'ai ajouté du rate limiting sur les routes d'authentification
- [ ] J'ai des tests automatisés qui vérifient l'indistinguabilité
- [ ] J'ai un monitoring du taux d'échecs d'authentification

---

## Exercice Pratique

**Énoncé** : Audite et corrige le code suivant qui présente trois fuites d'information majeures.

```php
<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class LoginController extends AbstractController
{
    public function __construct(
        private UserRepository $users,
    ) {
    }

    public function login(Request $request): Response
    {
        $email = (string) $request->request->get('email');
        $password = (string) $request->request->get('password');

        $user = $this->users->findOneByEmail($email);
        if ($user === null) {
            return $this->render('login.html.twig', [
                'error' => 'Aucun compte avec cet email.',
            ]);
        }

        if (!password_verify($password, $user->getPasswordHash())) {
            return $this->render('login.html.twig', [
                'error' => 'Mot de passe incorrect.',
            ]);
        }

        // ... connexion réussie
        return $this->redirectToRoute('home');
    }
}
```

**Indications** :

1. Identifie les trois failles principales (message d'erreur, timing, absence de protection en volume).
2. Réécris le code en respectant l'indistinguabilité, la résistance aux timing attacks, et en ajoutant du rate limiting.
3. Assure-toi que les utilisateurs légitimes ne sont pas bloqués par le rate limit (5 tentatives par 15 minutes est raisonnable).

**Résultat attendu** : Un contrôleur qui ne distingue plus jamais "email inconnu" de "mot de passe incorrect", qui exécute toujours une vérification de hash et qui rejette les tentatives trop nombreuses avec un code 429.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Failles identifiées** :

1. **Messages d'erreur différents** : "Aucun compte avec cet email" et "Mot de passe incorrect" révèlent directement l'existence ou non du compte.
2. **Pas de hash leurre** : quand l'utilisateur n'existe pas, on retourne immédiatement sans appeler `password_verify`. Le timing trahit l'absence de compte.
3. **Pas de rate limiting** : un attaquant peut tester des milliers d'emails sans aucune limite.

**Code corrigé** :

```php
<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;

final class LoginController extends AbstractController
{
    // Hash bcrypt cost=13 d'un mot de passe jamais utilisé en production
    // Généré une fois avec password_hash() : 60 caractères, alphabet bcrypt valide
    private const DUMMY_PASSWORD_HASH = '$2y$13$FqDauFQ4phD3NunncBFEa.M6KShgMKX4ZPtja20OE1/63dSkWUNTO';

    public function __construct(
        private UserRepository $users,
    ) {
    }

    public function login(
        Request $request,
        RateLimiterFactory $loginFormLimiter,
    ): Response {
        // Faille 3 corrigée : rate limiting par IP
        $limiter = $loginFormLimiter->create($request->getClientIp());
        if (!$limiter->consume(1)->isAccepted()) {
            return new Response(
                'Trop de tentatives, réessaye plus tard.',
                Response::HTTP_TOO_MANY_REQUESTS,
            );
        }

        $email = (string) $request->request->get('email');
        $password = (string) $request->request->get('password');

        $user = $this->users->findOneByEmail($email);

        // Faille 2 corrigée : on hashe un mot de passe leurre quand l'utilisateur n'existe pas
        // Le temps de réponse est ainsi comparable au cas "utilisateur existe + mauvais mot de passe"
        if ($user === null) {
            password_verify($password, self::DUMMY_PASSWORD_HASH);

            // Faille 1 corrigée : message générique identique aux autres cas d'échec
            return $this->render('login.html.twig', [
                'error' => 'Identifiants invalides.',
            ]);
        }

        if (!password_verify($password, $user->getPasswordHash())) {
            // Faille 1 corrigée : même message générique
            return $this->render('login.html.twig', [
                'error' => 'Identifiants invalides.',
            ]);
        }

        // Connexion réussie
        return $this->redirectToRoute('home');
    }
}
```

**Configuration associée** dans `config/packages/rate_limiter.yaml` :

```yaml
framework:
    rate_limiter:
        login_form:
            policy: 'token_bucket'
            limit: 5
            rate: { interval: '15 minutes', amount: 5 }
```

**Vérification** :

- Que l'email existe ou non, le message d'erreur est strictement "Identifiants invalides".
- Le temps de réponse est dominé par `password_verify` dans les deux cas (utilisateur existant ou non), donc indistinguable.
- Au-delà de 5 tentatives par IP par 15 minutes, l'application renvoie 429 sans même chercher l'utilisateur en base.

Ce contrôleur reste perfectible (combinaison IP + email pour la clé de rate limit, monitoring du taux d'échecs, alerte sur les pics), mais il a refermé les trois fuites identifiées.

---

## Navigation

← Fiche précédente : **[Soft delete](13-soft-delete.md)**

→ Fiche suivante : **[URLs signées et tokens d'accès anonyme](15-urls-signees-tokens.md)**
