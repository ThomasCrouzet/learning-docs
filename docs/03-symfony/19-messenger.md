---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Symfony Messenger : bus de messages, handlers, transports Doctrine et Redis, consommation des messages, retry et messages échoués pour les traitements asynchrones."
estimated_time: "75 min"
fiche_number: 19
total_fiches: 21
cursus: "Symfony"
---

# 19 - Symfony Messenger (messages asynchrones)

> **En bref** : Déléguer les traitements lents (envoi d'email, génération de fichier, appel d'API externe) à des processus en arrière-plan avec Symfony Messenger. Tu apprendras à créer un message, son handler, à choisir un transport (Doctrine ou Redis), à consommer les messages et à gérer les échecs. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche **[13 - Services et injection de dépendances](13-services-injection-dependances.md)**
- Avoir lu la fiche **[14 - Événements et listeners](14-evenements-listeners.md)**
- Avoir lu la fiche **[04 - Introduction à Doctrine](04-introduction-doctrine.md)** (pour le transport Doctrine)
- Comprendre l'autowiring et le rôle des attributs PHP 8 (comme `#[AsEventListener]`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un message et son handler, configurer un transport (Doctrine ou Redis), router un message vers une file d'attente, consommer les messages avec `messenger:consume`, et gérer les messages qui échouent avec le mécanisme de retry et le transport `failed`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le traitement asynchrone ?

**Définition** : Le traitement asynchrone consiste à déclencher une tâche sans attendre qu'elle se termine. Le code qui déclenche la tâche continue immédiatement, et la tâche s'exécute plus tard, dans un autre processus.

**Le problème que le traitement asynchrone résout** :

Sans traitement asynchrone, voici les problèmes rencontrés :

1. **Réponse HTTP lente** : Si un contrôleur envoie un email puis attend la réponse du serveur SMTP, l'utilisateur patiente plusieurs secondes avant de voir sa page.
2. **Échec en cascade** : Si l'appel à une API externe échoue, toute la requête HTTP échoue, même si l'action principale (créer une commande) a réussi.
3. **Pics de charge** : Si mille utilisateurs déclenchent une tâche lourde en même temps, le serveur web sature.

**Comment le traitement asynchrone résout ces problèmes** :

| Problème | Solution apportée par le traitement asynchrone |
| ------------------ | ---------------------------------------------- |
| Réponse HTTP lente | La tâche est mise en file, la réponse part tout de suite |
| Échec en cascade | La tâche échouée est réessayée sans bloquer la requête |
| Pics de charge | Les tâches sont consommées au rythme du serveur, une par une |

**Analogie concrète** : Pense à un restaurant. Le serveur prend ta commande et la note sur un ticket qu'il accroche en cuisine (mise en file). Il ne reste pas planté à attendre que le plat soit prêt : il va servir d'autres clients. Le cuisinier traite les tickets dans l'ordre (consommation). Sans ce système, le serveur attendrait à côté du four pour chaque plat, et le service serait bloqué.

**Ce que le traitement asynchrone n'est PAS** :

- Le traitement asynchrone n'est pas du multithreading dans la même requête. La tâche s'exécute dans un processus séparé (un worker), pas en parallèle dans le même processus PHP.
- Le traitement asynchrone n'est pas instantané. Il y a un délai entre la mise en file et l'exécution. Si tu as besoin d'un résultat immédiat, le traitement asynchrone n'est pas adapté.

---

### Qu'est-ce qu'un bus de messages ?

**Définition** : Un bus de messages est un service central qui reçoit des messages et les transmet aux objets chargés de les traiter (les handlers). L'émetteur ne connaît pas le handler : il ne connaît que le bus.

**Le problème que le bus de messages résout** :

Sans bus de messages, le code qui veut déclencher une tâche doit connaître et appeler directement la classe qui exécute cette tâche. Cela crée un couplage fort, et mélange la décision (quoi faire) avec l'exécution (comment le faire).

**Comment le bus résout ce problème** :

| Problème | Solution apportée par le bus |
| --------------------- | --------------------------------------------- |
| Couplage fort | L'émetteur ne connaît que le message et le bus |
| Décision et exécution mêlées | Le message décrit l'intention, le handler exécute |
| Difficile de changer le mode d'exécution | Le routage (synchrone ou asynchrone) se règle en configuration |

**Analogie concrète** : Le bus de messages est comme le service courrier d'une grande entreprise. Tu déposes une enveloppe (le message) avec une adresse. Tu ne sais pas qui exactement va l'ouvrir ni quand : le service courrier (le bus) se charge de l'acheminer au bon destinataire (le handler). Tu n'as pas besoin de connaître le bureau exact du destinataire.

**Le vocabulaire de Messenger** :

| Terme | Définition |
| ----------- | --------------------------------------------------------------- |
| Message | Un objet PHP simple qui décrit une intention (ex : `SendEmail`) |
| Handler | La classe qui exécute le traitement associé à un message |
| Bus | Le service qui reçoit les messages et les achemine |
| Transport | Le moyen de stockage et de transmission des messages (file d'attente) |
| Worker | Le processus qui lit le transport et exécute les handlers |
| Enveloppe | Le message accompagné de métadonnées (stamps) pour son acheminement |

---

### Message vs handler

**Définition** : Un **message** est un objet de données qui décrit ce qui doit être fait. Un **handler** est la classe qui sait comment le faire. Un message ne contient aucune logique, un handler ne contient aucune donnée propre.

**Le problème que cette séparation résout** :

Si la donnée et la logique sont dans la même classe, tu ne peux pas sérialiser proprement la tâche pour la stocker dans une file d'attente. Séparer les deux permet d'envoyer le message dans un transport, puis de le traiter plus tard avec un handler frais.

**Comparaison message vs handler** :

| Message | Handler |
| ------------------------------------ | ----------------------------------------- |
| Objet de données pur (DTO) | Service avec dépendances injectées |
| Pas de dépendances, pas de logique | Contient la logique métier |
| Sérialisable (stocké dans la file) | Jamais sérialisé, recréé à la consommation |
| Exemple : `SendWelcomeEmail($userId)` | Exemple : `SendWelcomeEmailHandler` |

**Analogie concrète** : Le message est comme une commande écrite sur un ticket de caisse : "1 café, table 4". Le handler est le barista qui lit le ticket et prépare le café. Le ticket ne sait pas faire le café, le barista n'a pas de café tant qu'il n'a pas lu un ticket. Les deux sont nécessaires et complémentaires.

**Ce qu'un message n'est PAS** :

- Un message n'est pas une entité Doctrine. C'est un objet simple. Tu transmets l'identifiant de l'entité (`$userId`), pas l'objet entité complet, car l'entité peut avoir changé en base au moment où le worker traite le message.

---

### Qu'est-ce qu'un transport ?

**Définition** : Un transport est le moyen par lequel les messages sont stockés en attendant d'être traités. C'est la file d'attente. Symfony Messenger supporte plusieurs technologies de transport : table SQL via Doctrine, Redis, RabbitMQ, Amazon SQS, etc.

**Le problème que le transport résout** :

Entre le moment où le message est envoyé et le moment où le worker le traite, il faut le stocker quelque part de manière fiable. Si le serveur redémarre, les messages en attente ne doivent pas être perdus.

**Comparaison des deux transports les plus courants** :

| Caractéristique | Transport Doctrine | Transport Redis |
| ---------------------- | ----------------------------------- | ---------------------------------- |
| Stockage | Table SQL (PostgreSQL, MySQL) | Serveur Redis en mémoire |
| Installation | Aucune (réutilise ta base) | Requiert un serveur Redis |
| Débit | Correct pour la plupart des projets | Très élevé |
| Persistance | Sur disque (durable) | En mémoire (configurable) |
| Cas d'usage | Démarrage simple, faible volume | Fort volume, haute fréquence |

**Analogie concrète** : Le transport est comme le tableau où la cuisine accroche les tickets de commande. Le transport Doctrine, c'est un tableau en bois solide vissé au mur : robuste, toujours présent, mais consultable une commande à la fois. Le transport Redis, c'est un écran numérique ultra-rapide : il affiche des centaines de tickets par minute, mais nécessite l'électricité (un serveur Redis dédié).

**Ce qu'un transport n'est PAS** :

- Un transport n'est pas obligatoire pour chaque message. Un message sans transport configuré est traité immédiatement et de façon synchrone, dans le même processus. C'est le comportement par défaut.

---

### Le worker et la consommation

**Définition** : Le worker est un processus PHP lancé en ligne de commande qui lit en continu un ou plusieurs transports, récupère les messages en attente et appelle les handlers correspondants. On le lance avec `php bin/console messenger:consume`.

**Le problème que le worker résout** :

Une requête HTTP a une durée de vie courte : elle se termine dès que la réponse est envoyée. Elle ne peut donc pas traiter des messages en continu. Le worker, lui, est un processus à longue durée de vie, dédié uniquement à la consommation.

**Comment ça fonctionne** :

```text
1. Le contrôleur envoie un message dans le bus
2. Le bus route le message vers un transport (file d'attente)
3. Le message attend dans la file
4. Le worker (messenger:consume) lit la file en continu
5. Le worker trouve le message et appelle son handler
6. Le handler exécute la tâche (envoi d'email, etc.)
7. Si tout réussit, le message est retiré de la file
```

**Analogie concrète** : Le worker est l'employé du service courrier qui passe en boucle relever la boîte de dépôt. Tant qu'il est en service, il traite chaque enveloppe dès qu'elle arrive. Si tu arrêtes l'employé (tu coupes le worker), les enveloppes s'accumulent dans la boîte sans être traitées, mais ne sont pas perdues.

**Ce que le worker n'est PAS** :

- Le worker n'est pas démarré automatiquement par ton serveur web. Tu dois le lancer toi-même, et le superviser en production avec un outil comme Supervisor ou systemd pour qu'il redémarre s'il s'arrête.

---

### Retry et messages échoués

**Définition** : Le **retry** est le mécanisme qui réessaie automatiquement un message dont le handler a levé une exception. Le **transport failed** est la file où atterrissent les messages qui ont épuisé toutes leurs tentatives.

**Le problème que le retry résout** :

Certaines erreurs sont temporaires : un serveur SMTP momentanément indisponible, une API externe qui répond une erreur passagère. Réessayer plus tard a de bonnes chances de réussir. Mais réessayer indéfiniment un message définitivement cassé encombrerait la file.

**Comment ça fonctionne** :

```text
1. Le handler lève une exception
2. Messenger remet le message dans la file après un délai (backoff)
3. Le délai augmente à chaque tentative (1s, 2s, 4s...)
4. Après N tentatives échouées, le message part dans le transport "failed"
5. Tu inspectes les messages failed avec messenger:failed:show
6. Tu peux les rejouer (messenger:failed:retry) ou les supprimer
```

**Comparaison retry vs failed** :

| Retry | Transport failed |
| ------------------------------------ | --------------------------------------- |
| Réessaie automatiquement | Stocke ce qui a définitivement échoué |
| Pour les erreurs temporaires | Pour les erreurs persistantes |
| Délai croissant entre les tentatives | Attente d'une action manuelle |
| Configuré par `max_retries` | Configuré par `failure_transport` |

**Analogie concrète** : Le retry est comme un facteur qui repasse plus tard si tu n'es pas chez toi : il réessaie deux ou trois fois. Le transport failed est le bureau de poste où le colis est gardé après plusieurs tentatives infructueuses : il attend que tu viennes le récupérer (action manuelle).

---

## Étapes Pratiques

### Étape 1 : Installer le composant Messenger

Le composant Messenger n'est pas inclus dans une installation minimale. Installe-le avec Composer.

```bash
# Installe le composant Messenger
composer require symfony/messenger
```

**Résultat attendu** :

```text
Using version ^7.4 for symfony/messenger
./composer.json has been updated
Running composer update symfony/messenger
Package operations: 1 install, 0 updates, 0 removals
  - Installing symfony/messenger (v7.4.0)
```

L'installation crée le fichier `config/packages/messenger.yaml` avec une configuration de base.

---

### Étape 2 : Créer un message

Un message est un objet PHP simple. Il transporte uniquement les données nécessaires au traitement. Crée le fichier `src/Message/SendWelcomeEmail.php`.

```php
<?php
// src/Message/SendWelcomeEmail.php

namespace App\Message;

// Un message est un objet de données pur (aucune dépendance, aucune logique)
final class SendWelcomeEmail
{
    public function __construct(
        // On transmet l'identifiant, jamais l'entité User complète :
        // l'entité pourrait avoir changé en base au moment de la consommation
        private int $userId,
    ) {
    }

    public function getUserId(): int
    {
        return $this->userId;
    }
}
```

**Résultat attendu** : Une classe simple, sans héritage ni interface. Messenger n'impose aucune classe parente pour un message.

---

### Étape 3 : Créer le handler

Le handler contient la logique. Il est marqué avec l'attribut `#[AsMessageHandler]`. Symfony associe automatiquement le handler au message grâce au type de l'argument de la méthode `__invoke()`.

```php
<?php
// src/MessageHandler/SendWelcomeEmailHandler.php

namespace App\MessageHandler;

use App\Message\SendWelcomeEmail;
use App\Repository\UserRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Mime\Email;

// Cet attribut déclare la classe comme handler.
// Symfony l'associe au message via le type de l'argument de __invoke().
#[AsMessageHandler]
final class SendWelcomeEmailHandler
{
    public function __construct(
        private UserRepository $userRepository,  // Injecté par autowiring
        private MailerInterface $mailer,
    ) {
    }

    // Le type de l'argument indique quel message ce handler traite
    public function __invoke(SendWelcomeEmail $message): void
    {
        // On recharge l'utilisateur depuis la base au moment du traitement
        $user = $this->userRepository->find($message->getUserId());

        // Si l'utilisateur a été supprimé entre temps, on arrête sans erreur
        if ($user === null) {
            return;
        }

        // Préparation et envoi de l'email de bienvenue
        // getUserIdentifier() renvoie l'email (propriété standard après make:user)
        $email = (new Email())
            ->to($user->getEmail())
            ->subject('Bienvenue sur la plateforme')
            ->text('Bonjour ' . $user->getUserIdentifier() . ', ton compte est actif.');

        $this->mailer->send($email);
    }
}
```

**Résultat attendu** : À ce stade, le message est traité de façon synchrone (aucun transport configuré). Si tu dispatches le message, le handler s'exécute immédiatement dans le même processus.

---

### Étape 4 : Dispatcher un message depuis un contrôleur

Pour envoyer un message, injecte `MessageBusInterface` et appelle sa méthode `dispatch()`.

```php
<?php
// src/Controller/RegistrationController.php

namespace App\Controller;

use App\Entity\User;
use App\Message\SendWelcomeEmail;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        MessageBusInterface $bus,  // Le bus de messages, injecté par autowiring
        UserPasswordHasherInterface $passwordHasher,
    ): Response {
        // Création de l'utilisateur (action principale, synchrone)
        // Rappel : make:user crée email + password + roles (pas de propriété name)
        $user = new User();
        $user->setEmail((string) $request->request->get('email'));

        // Toujours hasher le mot de passe avant de le stocker (voir fiche 12)
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            (string) $request->request->get('password')
        );
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        // Envoi du message dans le bus.
        // Si un transport asynchrone est configuré, l'email partira en arrière-plan.
        $bus->dispatch(new SendWelcomeEmail($user->getId()));

        // La réponse part immédiatement, sans attendre l'envoi de l'email
        $this->addFlash('success', 'Compte créé. Un email de bienvenue arrive.');

        return $this->redirectToRoute('home');
    }
}
```

**Résultat attendu** : La page de confirmation s'affiche tout de suite. Tant qu'aucun transport n'est configuré, l'email part quand même de façon synchrone. L'étape suivante rend le traitement asynchrone.

---

### Étape 5 : Configurer le transport Doctrine

Le transport Doctrine stocke les messages dans une table SQL de ta base existante. C'est l'option la plus simple pour démarrer, car elle ne requiert aucun nouveau serveur.

Configure d'abord la variable d'environnement dans `.env` :

```env
# Réutilise la connexion Doctrine existante pour stocker les messages
MESSENGER_TRANSPORT_DSN=doctrine://default
```

Configure ensuite `config/packages/messenger.yaml` :

```yaml
framework:
    messenger:
        # Transport où atterrissent les messages définitivement échoués
        failure_transport: failed

        transports:
            # Transport asynchrone principal, basé sur Doctrine
            async:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3        # Nombre de tentatives avant échec définitif
                    delay: 1000           # Délai initial en millisecondes (1 seconde)
                    multiplier: 2         # Le délai double à chaque tentative

            # Transport pour les messages échoués (stockés en base, table séparée)
            failed: 'doctrine://default?queue_name=failed'

        routing:
            # Tout message de cette classe part dans le transport "async"
            App\Message\SendWelcomeEmail: async
```

Génère la migration pour créer la table `messenger_messages` :

```bash
# Crée la table de stockage des messages (PostgreSQL 16 ici)
php bin/console make:migration
php bin/console doctrine:migrations:migrate --no-interaction
```

**Résultat attendu** :

```text
[notice] Migrating up to DoctrineMigrations\VersionXXXXXX
[notice] finished in XXms, 1 migrations executed
```

La table `messenger_messages` est créée. Désormais, dispatcher `SendWelcomeEmail` insère une ligne dans cette table au lieu d'exécuter le handler tout de suite.

---

### Étape 6 : Consommer les messages avec messenger:consume

Lance le worker pour traiter les messages en attente dans le transport `async`.

```bash
# Démarre un worker qui consomme le transport "async"
# L'option -vv affiche le détail de chaque message traité
php bin/console messenger:consume async -vv
```

**Résultat attendu** :

```text
[OK] Consuming messages from transport "async".

 // The worker will automatically exit once it has received a stop signal via the messenger:stop-workers command.

12:00:01 INFO      [messenger] Received message App\Message\SendWelcomeEmail
12:00:01 INFO      [messenger] Message handled by SendWelcomeEmailHandler
12:00:01 INFO      [messenger] App\Message\SendWelcomeEmail was handled successfully (acknowledging to transport).
```

Pour vérifier combien de messages attendent sans les consommer :

```bash
# Affiche le nombre de messages en attente dans chaque transport
php bin/console messenger:stats
```

```text
 ----------- -------------------
  Transport   Count of messages
 ----------- -------------------
  async       0
  failed      0
 ----------- -------------------
```

---

### Étape 7 : Utiliser le transport Redis (haute fréquence)

Pour un fort volume de messages, Redis offre un débit supérieur au transport Doctrine. Redis 7.x est la version de référence.

Le transport Redis n'est pas inclus dans le coeur de Messenger : il faut installer son paquet pont.

```bash
# Pont Redis pour Messenger (la fabrique du transport vit dans ce paquet)
composer require symfony/redis-messenger
```

Sans ce pont, un DSN `redis://` est refusé avec une erreur du type "Could not find a transport factory able to handle the configured DSN". Attention : ce pont (`symfony/redis-messenger`) gère la file Messenger ; il est distinct du client Redis (l'extension native php-redis, vérifiée plus bas) qui sert à parler au serveur Redis. Les deux sont nécessaires.

Change la variable d'environnement dans `.env` :

```env
# Transport Redis : hôte, port, puis nom du flux (stream) "messages"
MESSENGER_TRANSPORT_DSN=redis://localhost:6379/messages
```

Aucune migration n'est nécessaire : Redis crée le flux automatiquement. Vérifie que l'extension PHP `redis` est installée :

```bash
# Vérifie la présence de l'extension PHP redis
php -m | grep redis
```

```text
redis
```

Si l'extension est absente, installe-la. Contrairement au cache ou aux sessions Redis, le transport Redis de Messenger n'accepte PAS le package PHP pur `predis/predis` : il pilote directement l'extension native via les commandes Redis Streams. Tu dois donc disposer de l'extension `redis` (ou, plus rarement, `relay`).

**Résultat attendu** : La configuration `messenger.yaml` reste identique. Une fois le pont `symfony/redis-messenger` installé, seule la valeur de `MESSENGER_TRANSPORT_DSN` change. Tu peux passer de Doctrine à Redis sans toucher au code de tes messages ni de tes handlers.

> **Note** : Le transport Redis pour Messenger est détaillé dans la fiche **[Redis comme transport Messenger](../13-redis/07-redis-transport-messenger.md)** du cursus Redis.

---

### Étape 8 : Gérer les messages échoués

Quand un message épuise ses tentatives de retry, il atterrit dans le transport `failed`. Inspecte et rejoue ces messages.

```bash
# Liste les messages qui ont définitivement échoué
php bin/console messenger:failed:show
```

```text
 ------- ------------------------------ --------------------- ----------------------
  Id      Class                          Failed at             Error
 ------- ------------------------------ --------------------- ----------------------
  1       App\Message\SendWelcomeEmail   2026-05-27 12:05:00   Connection timed out
 ------- ------------------------------ --------------------- ----------------------
```

```bash
# Affiche le détail complet d'un message échoué (id 1)
php bin/console messenger:failed:show 1 -vv

# Rejoue un message échoué après avoir corrigé la cause
php bin/console messenger:failed:retry 1

# Supprime un message échoué jugé irrécupérable
php bin/console messenger:failed:remove 1
```

**Résultat attendu** : Tu gardes le contrôle sur les messages échoués. Aucune tâche n'est perdue silencieusement : elle attend dans le transport `failed` jusqu'à ce que tu décides de la rejouer ou de la supprimer.

---

## Commandes Utiles

| Commande | Action |
| ------------------------------------------------- | ----------------------------------------------- |
| `composer require symfony/messenger` | Installer le composant Messenger |
| `php bin/console messenger:consume async -vv` | Consommer le transport `async` avec détail |
| `php bin/console messenger:consume async failed` | Consommer plusieurs transports en même temps |
| `php bin/console messenger:stats` | Compter les messages en attente par transport |
| `php bin/console messenger:stop-workers` | Demander l'arrêt propre des workers |
| `php bin/console messenger:failed:show` | Lister les messages échoués |
| `php bin/console messenger:failed:retry` | Rejouer les messages échoués |
| `php bin/console messenger:failed:remove <id>` | Supprimer un message échoué |
| `php bin/console debug:messenger` | Lister les messages et leurs handlers |

---

## Pièges Fréquents

### Piège 1 : Oublier de redémarrer le worker après une modification de code

⚠️ **Problème** : Tu modifies un handler, mais le worker continue d'exécuter l'ancienne version. Tes changements semblent ignorés.

✅ **Solution** : Le worker charge le code une seule fois au démarrage et le garde en mémoire. Après chaque déploiement ou modification de code, redémarre les workers.

```bash
# Demande l'arrêt propre : chaque worker finit son message en cours puis s'arrête
php bin/console messenger:stop-workers
```

En production, configure ton superviseur (Supervisor ou systemd) pour relancer automatiquement les workers après cet arrêt.

---

### Piège 2 : Transmettre une entité Doctrine dans le message

⚠️ **Problème** : Tu mets l'objet entité `User` complet dans le message. À la consommation, l'entité est désérialisée mais détachée de Doctrine, ou ses données sont périmées par rapport à la base.

✅ **Solution** : Transmets uniquement l'identifiant. Le handler recharge l'entité fraîche depuis le repository au moment du traitement.

```php
<?php

// ❌ Ne transmets pas l'entité complète
$bus->dispatch(new SendWelcomeEmail($user));

// ✅ Transmets l'identifiant, recharge l'entité dans le handler
$bus->dispatch(new SendWelcomeEmail($user->getId()));
```

---

### Piège 3 : Aucun worker lancé, les messages s'accumulent

⚠️ **Problème** : Tu as configuré un transport asynchrone, dispatché des messages, mais rien ne se passe. Les emails ne partent jamais.

✅ **Solution** : Un transport asynchrone ne traite rien tout seul. Il faut un worker actif. Vérifie le nombre de messages en attente, puis lance un worker.

```bash
# Si "async" affiche un nombre qui monte sans descendre, aucun worker ne consomme
php bin/console messenger:stats

# Lance un worker pour vider la file
php bin/console messenger:consume async -vv
```

En production, le worker doit tourner en permanence via Supervisor ou systemd.

---

### Piège 4 : Confondre le bus et le transport

⚠️ **Problème** : Tu penses qu'envoyer un message dans le bus le rend automatiquement asynchrone. Mais sans transport configuré pour cette classe de message, le traitement reste synchrone.

✅ **Solution** : Le bus achemine, le transport diffère. Pour qu'un message soit asynchrone, il faut le router vers un transport dans la section `routing` de `messenger.yaml`.

```yaml
framework:
    messenger:
        routing:
            # Sans cette ligne, SendWelcomeEmail est traité de façon synchrone
            App\Message\SendWelcomeEmail: async
```

---

### Piège 5 : Worker qui tourne indéfiniment et consomme trop de mémoire

⚠️ **Problème** : Un worker laissé tourner très longtemps accumule de la mémoire (fuite mémoire de PHP au fil des messages).

✅ **Solution** : Limite la durée de vie du worker avec `--limit` (nombre de messages) ou `--time-limit` (durée en secondes). Le superviseur le relance ensuite proprement.

```bash
# Le worker s'arrête après 100 messages traités, puis Supervisor le relance
php bin/console messenger:consume async --limit=100

# Ou s'arrête après 3600 secondes (1 heure)
php bin/console messenger:consume async --time-limit=3600
```

---

## Checklist de Validation

- [ ] J'ai installé le composant `symfony/messenger`
- [ ] Je sais créer un message (objet de données sans logique)
- [ ] Je sais créer un handler avec l'attribut `#[AsMessageHandler]`
- [ ] Je sais dispatcher un message avec `MessageBusInterface`
- [ ] Je sais configurer un transport Doctrine et générer sa table
- [ ] Je sais configurer un transport Redis et changer de transport sans toucher au code
- [ ] Je sais router un message vers un transport dans la section `routing`
- [ ] Je sais consommer les messages avec `messenger:consume`
- [ ] Je comprends le retry et je sais gérer les messages échoués (`messenger:failed:*`)
- [ ] Je sais qu'il faut redémarrer le worker après chaque modification de code

---

## Exercice Pratique

**Énoncé** : Mets en place un traitement asynchrone qui génère un fichier PDF de facture après la validation d'une commande, sans bloquer la réponse HTTP.

**Spécifications** :

1. Crée un message `src/Message/GenerateInvoice.php` qui transporte l'identifiant de la commande (`orderId`).
2. Crée un handler `src/MessageHandler/GenerateInvoiceHandler.php` marqué avec `#[AsMessageHandler]` qui :
   - Recharge la commande depuis un `OrderRepository` (injecté).
   - Si la commande n'existe pas, s'arrête sans erreur.
   - Sinon, écrit dans un logger une ligne du type "Facture générée pour la commande N" (simule la génération du PDF par un log).
3. Configure le transport `async` basé sur Doctrine dans `messenger.yaml`, avec `max_retries: 3`.
4. Route le message `GenerateInvoice` vers le transport `async`.
5. Dans un contrôleur `OrderController`, ajoute une route `POST /order/{id}/validate` qui dispatche `GenerateInvoice` puis redirige immédiatement.
6. Vérifie le comportement : la file contient un message, puis le worker le consomme.

**Indications** :

- Le message ne contient que `private int $orderId` et son getter.
- Le handler reçoit le message via le type de l'argument de `__invoke()`.
- Pense à générer la table `messenger_messages` avec une migration.

**Résultat attendu** : Quand tu valides une commande, la réponse part instantanément. Un message attend dans le transport `async` (visible avec `messenger:stats`). Après lancement du worker, le log affiche "Facture générée pour la commande N" et la file revient à zéro.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Le message `src/Message/GenerateInvoice.php`**

```php
<?php

namespace App\Message;

// Message de données : transporte uniquement l'identifiant de la commande
final class GenerateInvoice
{
    public function __construct(
        private int $orderId,
    ) {
    }

    public function getOrderId(): int
    {
        return $this->orderId;
    }
}
```

**Étape 2 : Le handler `src/MessageHandler/GenerateInvoiceHandler.php`**

```php
<?php

namespace App\MessageHandler;

use App\Message\GenerateInvoice;
use App\Repository\OrderRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
final class GenerateInvoiceHandler
{
    public function __construct(
        private OrderRepository $orderRepository,
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(GenerateInvoice $message): void
    {
        // Recharge la commande fraîche depuis la base
        $order = $this->orderRepository->find($message->getOrderId());

        // Si la commande a été supprimée, on arrête proprement
        if ($order === null) {
            return;
        }

        // Dans un vrai projet, on générerait ici le fichier PDF.
        // Pour l'exercice, on simule par un log.
        $this->logger->info('Facture générée pour la commande {id}', [
            'id' => $order->getId(),
        ]);
    }
}
```

**Étape 3 et 4 : Configuration `config/packages/messenger.yaml`**

```yaml
framework:
    messenger:
        failure_transport: failed

        transports:
            async:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3
                    delay: 1000
                    multiplier: 2
            failed: 'doctrine://default?queue_name=failed'

        routing:
            App\Message\GenerateInvoice: async
```

Variable d'environnement dans `.env` :

```env
MESSENGER_TRANSPORT_DSN=doctrine://default
```

**Étape 5 : Le contrôleur `src/Controller/OrderController.php`**

```php
<?php

namespace App\Controller;

use App\Entity\Order;
use App\Message\GenerateInvoice;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;

final class OrderController extends AbstractController
{
    #[Route('/order/{id}/validate', name: 'order_validate', methods: ['POST'])]
    public function validate(
        Order $order,
        MessageBusInterface $bus,
    ): Response {
        // On dispatche la génération de facture en arrière-plan
        $bus->dispatch(new GenerateInvoice($order->getId()));

        // La réponse part immédiatement, sans attendre la génération du PDF
        $this->addFlash('success', 'Commande validée. La facture est en préparation.');

        return $this->redirectToRoute('order_show', ['id' => $order->getId()]);
    }
}
```

**Étape 6 : Générer la table et vérifier**

```bash
# Crée la table messenger_messages
php bin/console make:migration
php bin/console doctrine:migrations:migrate --no-interaction

# Après avoir validé une commande, vérifie qu'un message attend
php bin/console messenger:stats

# Consomme le message
php bin/console messenger:consume async -vv
```

**Vérification du comportement** :

```text
Après POST /order/5/validate :
  messenger:stats -> async : 1 message en attente
  La réponse HTTP est déjà partie (redirection)

Après messenger:consume async :
  Log : "Facture générée pour la commande 5"
  messenger:stats -> async : 0 message
```

**Explication de la solution** :

| Élément | Rôle |
| --------------------------- | ------------------------------------------------- |
| `GenerateInvoice` | Message de données, transporte l'`orderId` |
| `#[AsMessageHandler]` | Associe le handler au message via le type d'argument |
| `MessageBusInterface` | Permet de dispatcher le message depuis le contrôleur |
| `routing` | Route `GenerateInvoice` vers le transport `async` |
| `messenger:consume` | Le worker qui exécute le handler en arrière-plan |
| `find($id)` dans le handler | Recharge l'entité fraîche, jamais transmise dans le message |

---

## Navigation

← Fiche précédente : **[Workflow et state machine](18-workflow-state-machine.md)**

→ Fiche suivante : **[Traductions et internationalisation](20-traductions.md)**
