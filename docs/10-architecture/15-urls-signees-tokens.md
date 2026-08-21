---
tags:
  - Architecture
  - Sécurité
  - Intermédiaire
description: "URLs signées et tokens d'accès anonyme : donner un accès limité à une ressource sans demander de connexion, avec expiration et révocation."
estimated_time: "60 min"
fiche_number: 15
total_fiches: 17
cursus: "Architecture et Design Patterns"
id: "web.architecture.urls-signees-tokens"
course_id: "web.architecture"
content_type: "lesson"
order: 15
---

# 15 - URLs signées et tokens d'accès anonyme

> **En bref** : Permettre à un utilisateur non connecté d'accéder à une ressource précise via un lien unique, avec une durée de validité. Comparer deux approches (token opaque en BDD, URL signée avec HMAC) et choisir selon le cas. Lecture estimée : 60 min.

## Prérequis

- Fiche : [Sécurité des utilisateurs Symfony](../03-symfony/12-securite-utilisateurs.md)
- Notions de cryptographie de base (hash, HMAC)
- [Cursus PHP](../02-php/index.md) : `random_bytes`, `hash_hmac`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras générer un token d'accès anonyme avec expiration, vérifier sa validité côté serveur, choisir entre un token opaque et une URL signée, et éviter les pièges de sécurité courants.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un accès anonyme par token ?

**Définition** : Un accès anonyme par token est un mécanisme qui permet à un utilisateur non authentifié d'accéder à une ressource précise grâce à un secret à usage limité. Ce secret, transmis dans une URL, sert de preuve d'autorisation et remplace la connexion classique par identifiant et mot de passe.

**Le problème que l'accès anonyme par token résout** :

Sans accès anonyme par token, voici les problèmes rencontrés :

1. **Friction d'inscription** : un utilisateur qui veut consulter sa commande sans authentification doit créer un compte, ce qui augmente le taux d'abandon.
2. **Mots de passe inutiles** : pour des actions ponctuelles comme une désinscription, demander un mot de passe est disproportionné.
3. **Liens d'email inopérants** : un lien envoyé par email doit pouvoir agir sans demander d'authentification immédiate.

**Comment l'accès anonyme par token résout ces problèmes** :

| Problème | Solution apportée par les tokens |
| --- | --- |
| Friction d'inscription | Un lien unique suffit pour accéder à la ressource |
| Mots de passe inutiles | Le token sert de preuve à usage restreint |
| Liens d'email inopérants | Le lien contient toutes les informations nécessaires |

**Analogie concrète** : Pense à un ticket de cinéma. Le ticket donne accès à une séance précise, dans une salle précise, à une heure précise. Tu n'as pas besoin de prouver qui tu es : le ticket suffit. Une fois la séance terminée, le ticket n'a plus de valeur. Un token fonctionne de la même manière : il donne accès à une ressource précise, pour une durée limitée, sans demander de pièce d'identité.

**Ce qu'un token d'accès anonyme n'est PAS** :

- Un token n'est pas une session. Une session identifie un utilisateur connecté à travers plusieurs requêtes. Un token donne accès à une ressource spécifique, sans notion d'utilisateur connecté.
- Un token n'est pas un cookie persistant. Le cookie est lié au navigateur. Le token est lié à un lien partageable par email.
- Un token n'est pas un JWT d'authentification complète. Un JWT porte une identité et des permissions globales. Un token d'accès anonyme porte une autorisation ciblée et temporaire.

---

### Cas d'usage typiques

**Définition** : Les tokens d'accès anonyme apparaissent dans de nombreux scénarios où la friction de connexion serait excessive ou impossible. Voici les cas les plus fréquents en pratique.

**Tableau des cas d'usage** :

| Cas | Exemple |
| --- | --- |
| Suivi d'une commande | Lien envoyé par email après commande, sans création de compte |
| Lien magique de login | Cliquer sur un lien dans l'email équivaut à se connecter |
| Désinscription newsletter | Lien direct sans demander le mot de passe |
| Validation d'email | Confirmation d'inscription |
| Partage de ressource | Lien public temporaire vers un document privé |
| Réinitialisation de mot de passe | Lien à usage unique avec courte durée de vie |
| Invitation à rejoindre une équipe | Lien envoyé à une adresse précise |

**Analogie concrète** : Pense aux différents types de coupons que tu reçois dans la vie quotidienne. Une carte d'embarquement (suivi de commande), un bon de réduction nominatif (lien magique), un coupon de retour postal pré-payé (désinscription) : chaque coupon a une finalité unique, une validité limitée et n'a pas besoin de pièce d'identité.

---

### Approche 1 : Token opaque stocké en BDD

**Définition** : Un token opaque est un grand nombre aléatoire généré côté serveur, stocké dans la base de données et associé à une ressource cible. Lorsqu'une requête arrive avec ce token dans l'URL, le serveur le compare à celui qu'il a enregistré.

**Le problème que le token opaque résout** :

1. **Contrôle complet** : le serveur sait exactement quels tokens existent et peut les modifier.
2. **Révocation immédiate** : supprimer une ligne en base invalide le token instantanément.
3. **Audit possible** : on peut savoir combien de fois un token a été utilisé.

**Tableau des invariants d'un token opaque** :

| Invariant | Mise en oeuvre |
| --- | --- |
| Imprévisible | `random_bytes(32)` puis `bin2hex` (64 caractères) |
| Expirable | Colonne `token_expires_at` |
| Révocable | Suppression de la ligne ou flag |
| Lié à une ressource | Clé étrangère vers la ressource ciblée |
| Usage unique (optionnel) | Flag `used_at` |

**Analogie concrète** : Pense à un coffre-fort à la banque. Le coffre a un numéro, et seule la banque possède la liste des coffres existants. Pour ouvrir un coffre, tu présentes ta clé : la banque vérifie son registre. Si la banque retire ton coffre du registre, ta clé devient inutile. Le token opaque fonctionne pareil : la base de données joue le rôle du registre.

**Ce qu'un token opaque n'est PAS** :

- Un token opaque n'est pas une signature. Sa valeur n'est pas calculée à partir d'autres données, elle est purement aléatoire.
- Un token opaque n'est pas auto-vérifiable. Il faut interroger la base pour savoir s'il est valide.

---

### Approche 2 : URL signée (HMAC)

**Définition** : Une URL signée est une URL dont les paramètres sont accompagnés d'une signature cryptographique. Cette signature est calculée à partir d'une clé secrète détenue par le serveur. Le serveur peut donc vérifier la validité d'une URL sans rien stocker, en recalculant la signature côté serveur.

**Le problème que l'URL signée résout** :

1. **Aucun stockage requis** : pas de table de tokens, pas de requête supplémentaire en base.
2. **Distribution massive** : on peut générer des millions de liens sans coût de stockage.
3. **Performance** : la vérification ne demande qu'un calcul de hash, sans accès disque.

**Tableau des invariants d'une URL signée** :

| Invariant | Mise en oeuvre |
| --- | --- |
| Imprévisible | HMAC-SHA256 avec un secret long |
| Expirable | Timestamp d'expiration dans l'URL, vérifié côté serveur |
| Révocable | Difficile sans liste noire (faiblesse de cette approche) |
| Idempotent | Aucun stockage requis |

**Analogie concrète** : Pense à un sceau de cire sur une lettre médiévale. Seul le seigneur possède le sceau. Quand tu reçois la lettre, tu peux vérifier que le sceau est authentique : pas besoin de demander au seigneur s'il a vraiment écrit la lettre. Si quelqu'un modifie le contenu, le sceau ne correspond plus. L'URL signée fonctionne pareil : la signature garantit que les paramètres n'ont pas été modifiés.

**Ce qu'une URL signée n'est PAS** :

- Une URL signée n'est pas chiffrée. Les paramètres restent lisibles dans l'URL, seule leur intégrité est garantie.
- Une URL signée n'est pas révocable individuellement. Pour révoquer un lien, il faut soit changer la clé secrète (invalide tous les liens), soit maintenir une liste noire.

---

### Comparaison token opaque vs URL signée

**Définition** : Le choix entre token opaque et URL signée dépend des contraintes de ton projet : volume de liens à générer, besoin de révocation, importance de la performance, complexité acceptable.

**Tableau comparatif** :

| Critère | Token opaque (BDD) | URL signée (HMAC) |
| --- | --- | --- |
| Stockage serveur | Une ligne par token | Aucun |
| Révocation immédiate | Oui | Non (liste noire requise) |
| Performance | Une requête BDD par vérification | Aucune requête BDD |
| Usage unique facile | Oui (`used_at`) | Non |
| Distribution massive (millions) | Coûteux en stockage | Économe |
| Cas typique | Reset password, validation email | Liens de désinscription, suivi de commande |

**Analogie concrète** : Le token opaque, c'est le coffre-fort à la banque avec un registre. L'URL signée, c'est le sceau de cire que tu peux apposer sur un nombre infini de lettres. Le coffre est plus contrôlable mais demande de la place. Le sceau est économe mais une fois la lettre envoyée, tu ne peux plus la rappeler.

**Comment choisir** :

- Pour une action sensible et révocable (reset password, validation email) : token opaque.
- Pour un lien massivement distribué sans besoin de révocation (désinscription newsletter, suivi public) : URL signée.

---

## Étapes Pratiques

### Étape 1 : Générer un token opaque

Cette étape crée un secret cryptographique imprévisible et l'enregistre côté serveur avec une date d'expiration.

```php
<?php

// On génère 32 octets aléatoires (256 bits d'entropie)
// puis on les convertit en chaîne hexadécimale de 64 caractères
$token = bin2hex(random_bytes(32));

// On fixe une expiration à 24 heures à partir de maintenant
$expiresAt = (new \DateTimeImmutable())->modify('+24 hours');

// On stocke le token et l'expiration sur l'entité ciblée
$order->setAccessToken($token);
$order->setAccessTokenExpiresAt($expiresAt);
$this->em->flush();
```

**Résultat attendu** :

```text
Token généré : a3f9e2c1b8d4f6e7... (64 caractères hexadécimaux)
Expiration : 2026-05-19 18:30:00
```

Note : 32 octets représentent 256 bits d'entropie, ce qui est suffisant pour résister à toute attaque par force brute (un attaquant devrait essayer 2^256 combinaisons).

---

### Étape 2 : Construire l'URL et l'envoyer par email

Une fois le token enregistré, on construit l'URL absolue à transmettre par email.

```php
<?php

// On génère l'URL absolue contenant l'identifiant et le token
$url = $this->urlGenerator->generate(
    'order_track',
    ['id' => $order->getId(), 'token' => $token],
    UrlGeneratorInterface::ABSOLUTE_URL,
);

// On envoie l'email avec un lien cliquable
$this->mailer->send(
    (new Email())
        ->to($order->getEmail())
        ->subject('Suivi de ta commande')
        ->html("<p>Suivi : <a href=\"{$url}\">cliquer ici</a></p>")
);
```

**Résultat attendu** :

```text
Email envoyé avec un lien de la forme :
https://exemple.test/commande/42/suivi/a3f9e2c1b8d4f6e7...
```

---

### Étape 3 : Vérifier le token côté serveur

Le contrôleur reçoit l'identifiant et le token, puis vérifie leur cohérence et leur fraîcheur.

```php
<?php

#[Route('/commande/{id}/suivi/{token}', name: 'order_track')]
public function track(int $id, string $token, OrderRepository $orders): Response
{
    // On récupère la commande ciblée
    $order = $orders->find($id);
    if ($order === null) {
        throw $this->createNotFoundException();
    }

    // On vérifie qu'un token est bien associé à cette commande
    if ($order->getAccessToken() === null) {
        throw $this->createAccessDeniedException();
    }

    // On compare en temps constant pour éviter les timing attacks
    if (!hash_equals($order->getAccessToken(), $token)) {
        throw $this->createAccessDeniedException();
    }

    // On vérifie que le token n'est pas expiré
    if ($order->getAccessTokenExpiresAt() < new \DateTimeImmutable()) {
        throw $this->createAccessDeniedException();
    }

    return $this->render('order/track.html.twig', ['order' => $order]);
}
```

**Résultat attendu** :

```text
Si le token est valide et non expiré : page de suivi affichée.
Si le token est absent, faux ou expiré : erreur 403.
Si la commande n'existe pas : erreur 404.
```

Note : `hash_equals` compare deux chaînes en temps constant, c'est-à-dire que la durée de comparaison ne dépend pas du contenu. Cela empêche un attaquant de deviner le token caractère par caractère en mesurant le temps de réponse.

---

### Étape 4 : URL signée avec Symfony UriSigner

Pour l'approche sans stockage, Symfony propose `UriSigner` qui signe et vérifie une URL à l'aide d'une clé secrète configurée dans l'application.

```php
<?php

use Symfony\Component\HttpFoundation\UriSigner;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UnsubscribeService
{
    public function __construct(
        private UriSigner $uriSigner,
        private UrlGeneratorInterface $urlGenerator,
    ) {
    }

    public function generateUnsubscribeUrl(int $userId): string
    {
        // On construit l'URL absolue avec un timestamp d'expiration
        $url = $this->urlGenerator->generate('newsletter_unsubscribe', [
            'user' => $userId,
            'expires' => (new \DateTimeImmutable('+30 days'))->getTimestamp(),
        ], UrlGeneratorInterface::ABSOLUTE_URL);

        // On signe l'URL : UriSigner ajoute un paramètre _hash
        return $this->uriSigner->sign($url);
    }
}
```

Vérification côté contrôleur :

```php
<?php

#[Route('/newsletter/unsubscribe', name: 'newsletter_unsubscribe')]
public function unsubscribe(Request $request, UriSigner $uriSigner): Response
{
    // On vérifie la signature de l'URL complète
    if (!$uriSigner->checkRequest($request)) {
        throw $this->createAccessDeniedException();
    }

    // On vérifie l'expiration : le timestamp doit être dans le futur
    $expires = $request->query->getInt('expires');
    if ($expires < time()) {
        throw $this->createAccessDeniedException();
    }

    $userId = $request->query->getInt('user');
    // On procède à la désinscription...

    return $this->render('newsletter/unsubscribed.html.twig');
}
```

**Résultat attendu** :

```text
URL générée :
https://exemple.test/newsletter/unsubscribe?user=42&expires=1779302400&_hash=abc123...

Si l'URL est intacte et non expirée : désinscription effectuée.
Si un paramètre est modifié : la signature ne correspond plus, accès refusé.
```

---

### Étape 5 : Invalider après usage (token opaque uniquement)

Pour une action sensible comme la réinitialisation de mot de passe, on invalide le token immédiatement après consommation. Cette opération n'est possible qu'avec l'approche en base de données.

```php
<?php

public function consume(Order $order): void
{
    // On supprime le token et son expiration
    $order->setAccessToken(null);
    $order->setAccessTokenExpiresAt(null);
    $this->em->flush();
}
```

**Résultat attendu** :

```text
Le token est effacé en base.
Un second clic sur le même lien renvoie une erreur 403.
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| `random_bytes(32)` | Génère 32 octets cryptographiquement aléatoires |
| `bin2hex(...)` | Convertit en chaîne hexadécimale (longueur multipliée par 2) |
| `hash_equals($a, $b)` | Compare deux chaînes en temps constant |
| `hash_hmac('sha256', $data, $key)` | Génère une signature HMAC |
| `UriSigner::sign($url)` | Signe une URL Symfony |
| `UriSigner::checkRequest($request)` | Vérifie une URL signée |

---

## Pièges Fréquents

### Piège 1 : Token court ou prévisible

⚠️ **Problème** : Utiliser `rand()`, `mt_rand()`, `uniqid()` ou un timestamp pour générer le token. Ces fonctions ne sont pas cryptographiquement sûres et peuvent être devinées.

✅ **Solution** : Toujours utiliser `random_bytes` avec au moins 32 octets, puis convertir en hexadécimal.

```php
<?php

// ❌ Mauvaise pratique
$token = md5(uniqid());

// ✅ Bonne pratique
$token = bin2hex(random_bytes(32));
```

---

### Piège 2 : Comparaison avec ===

⚠️ **Problème** : Comparer deux tokens avec `===` ou `==`. Cette comparaison s'arrête au premier caractère différent, ce qui ouvre la voie aux timing attacks (un attaquant mesure le temps de réponse pour deviner les caractères corrects).

✅ **Solution** : Toujours utiliser `hash_equals`, qui compare en temps constant.

```php
<?php

// ❌ Vulnérable aux timing attacks
if ($order->getAccessToken() === $token) {
    // ...
}

// ✅ Sécurisé
if (hash_equals($order->getAccessToken(), $token)) {
    // ...
}
```

---

### Piège 3 : Token sans expiration

⚠️ **Problème** : Un token sans date d'expiration reste valide indéfiniment. Un attaquant qui intercepte l'email peut l'utiliser des années plus tard.

✅ **Solution** : Toujours fixer une `expires_at` et la vérifier à chaque utilisation. Pour un reset password : 1 heure. Pour un suivi de commande : 30 jours maximum.

---

### Piège 4 : Token loggé en clair

⚠️ **Problème** : Si ton serveur log les URLs complètes (Nginx, Apache, middleware), le token apparaît dans les logs. Un accès aux logs permet de réutiliser le token.

✅ **Solution** : Configurer le serveur web pour masquer les paramètres sensibles, ou placer le token dans un en-tête plutôt que dans l'URL pour les API. Pour les liens email, raccourcir la durée d'expiration.

---

### Piège 5 : URL signée sans expiration

⚠️ **Problème** : Une URL signée sans paramètre `expires` est valide tant que la clé secrète n'a pas changé. Le lien devient éternel.

✅ **Solution** : Toujours inclure un timestamp `expires` dans les paramètres signés et le vérifier explicitement côté serveur.

---

### Piège 6 : Réutilisation après usage

⚠️ **Problème** : Pour une action sensible comme la réinitialisation de mot de passe, laisser le token valide après usage permet à un attaquant qui obtient le lien de l'utiliser à son tour.

✅ **Solution** : Invalider le token immédiatement après consommation. Pour une URL signée, basculer sur un token opaque ou utiliser une liste noire en cache (Redis).

---

## Checklist de Validation

- [ ] Je sais générer un token de 64 caractères hexadécimaux avec `random_bytes`
- [ ] Je sais comparer un token avec `hash_equals`
- [ ] Je sais ajouter une expiration et la vérifier
- [ ] Je sais distinguer token opaque (BDD) et URL signée (HMAC)
- [ ] Je sais utiliser `UriSigner` de Symfony pour signer une URL
- [ ] Je sais invalider un token après usage

---

## Exercice Pratique

**Énoncé** : Implémente un système de validation d'email après inscription.

**Indications** :

- À l'inscription, générer un token et envoyer un email avec un lien `/validation/{token}`
- Le lien doit expirer après 48 heures
- Quand l'utilisateur clique, vérifier le token et marquer son compte comme `emailValidated = true`
- Invalider le token après usage
- Si le token est expiré ou invalide, afficher une page neutre proposant de renvoyer l'email (sans révéler si un compte existe)

**Résultat attendu** : Un parcours complet d'inscription, de validation et de renvoi de lien, sans fuite d'information sur les comptes existants.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Entité User** (champs essentiels) :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private string $email;

    #[ORM\Column]
    private bool $emailValidated = false;

    // Token de validation, nullable car effacé après usage
    #[ORM\Column(length: 64, nullable: true)]
    private ?string $validationToken = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $validationTokenExpiresAt = null;

    // Getters et setters omis pour la concision
}
```

**Service de génération** :

```php
<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class EmailValidationService
{
    // Durée de validité du lien : 48 heures
    private const TOKEN_LIFETIME = '+48 hours';

    public function __construct(
        private EntityManagerInterface $em,
        private MailerInterface $mailer,
        private UrlGeneratorInterface $urlGenerator,
    ) {
    }

    public function sendValidationEmail(User $user): void
    {
        // Génération d'un token cryptographiquement sûr
        $token = bin2hex(random_bytes(32));
        $expiresAt = new \DateTimeImmutable(self::TOKEN_LIFETIME);

        $user->setValidationToken($token);
        $user->setValidationTokenExpiresAt($expiresAt);
        $this->em->flush();

        $url = $this->urlGenerator->generate(
            'email_validate',
            ['token' => $token],
            UrlGeneratorInterface::ABSOLUTE_URL,
        );

        $email = (new Email())
            ->to($user->getEmail())
            ->subject('Confirme ton adresse email')
            ->html("<p>Pour activer ton compte : <a href=\"{$url}\">cliquer ici</a></p>");

        $this->mailer->send($email);
    }
}
```

**Repository** : on cherche un utilisateur par token, en utilisant `hash_equals` après récupération. Pour éviter de tester chaque utilisateur, on utilise le token comme clé indexée.

```php
<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // Le token étant aléatoire et long, l'index suffit
    // hash_equals est appliqué ensuite par sécurité
    public function findByValidationToken(string $token): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.validationToken = :token')
            ->setParameter('token', $token)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
```

**Contrôleur de validation** :

```php
<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EmailValidationController extends AbstractController
{
    #[Route('/validation/{token}', name: 'email_validate')]
    public function validate(
        string $token,
        UserRepository $users,
        EntityManagerInterface $em,
    ): Response {
        $user = $users->findByValidationToken($token);

        // Réponse neutre si le token n'existe pas
        if ($user === null) {
            return $this->render('email/validation_failed.html.twig');
        }

        // Comparaison en temps constant (défense en profondeur)
        if (!hash_equals($user->getValidationToken() ?? '', $token)) {
            return $this->render('email/validation_failed.html.twig');
        }

        // Vérification de l'expiration
        $expiresAt = $user->getValidationTokenExpiresAt();
        if ($expiresAt === null || $expiresAt < new \DateTimeImmutable()) {
            return $this->render('email/validation_failed.html.twig');
        }

        // Validation effective
        $user->setEmailValidated(true);

        // Invalidation immédiate du token (usage unique)
        $user->setValidationToken(null);
        $user->setValidationTokenExpiresAt(null);
        $em->flush();

        return $this->render('email/validation_success.html.twig');
    }
}
```

**Contrôleur de renvoi (anti-énumération)** :

```php
<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\EmailValidationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ResendValidationController extends AbstractController
{
    #[Route('/validation/renvoyer', name: 'email_validation_resend', methods: ['GET', 'POST'])]
    public function resend(
        Request $request,
        UserRepository $users,
        EmailValidationService $service,
    ): Response {
        if ($request->isMethod('POST')) {
            $email = (string) $request->request->get('email', '');
            $user = $users->findOneBy(['email' => $email]);

            // On envoie le mail uniquement si l'utilisateur existe et n'est pas déjà validé
            // Mais on affiche TOUJOURS le même message neutre
            if ($user !== null && !$user->isEmailValidated()) {
                $service->sendValidationEmail($user);
            }

            return $this->render('email/resend_confirmation.html.twig');
        }

        return $this->render('email/resend_form.html.twig');
    }
}
```

**Points clés de la solution** :

- Token généré avec `random_bytes(32)` : 256 bits d'entropie.
- Durée de validité de 48 heures via `validationTokenExpiresAt`.
- Comparaison sécurisée avec `hash_equals` en complément de la requête indexée.
- Invalidation immédiate après usage : un même lien ne peut servir qu'une fois.
- Anti-énumération : le contrôleur de renvoi affiche toujours le même message, qu'un compte existe ou non.
- Page d'erreur unique pour token invalide, expiré ou inexistant : aucune information révélée.

---

## Navigation

← Fiche précédente : **[Anti-énumération](14-anti-enumeration.md)**

→ Fiche suivante : **[Filtres Doctrine](16-filtres-doctrine.md)**
