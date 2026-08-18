---
tags:
  - Monitoring
  - Intermédiaire
  - Pratique
description: "Logs structurés avec Monolog dans Symfony : niveaux, format JSON, handlers, processors et bonnes pratiques."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 10
cursus: "Monitoring et Observabilité"
---

# 02 - Logs structurés

> **En bref** : À la fin de cette fiche, tu sauras configurer Monolog dans Symfony pour produire des logs structurés en JSON, utiliser les niveaux de log, les handlers et les processors. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Introduction à l'observabilité](01-introduction-observabilite.md)
- Connaître les bases de Symfony (contrôleurs, services, configuration YAML)
- Avoir un projet Symfony fonctionnel dans Docker (cursus `03-symfony/`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer Monolog pour écrire des logs structurés en JSON, choisir le bon niveau de log pour chaque situation et utiliser des processors pour enrichir automatiquement tes logs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un log ?

**Définition** : Un log est un message enregistré par une application pour documenter un événement. Chaque log contient au minimum un timestamp (date et heure), un niveau de sévérité et un message.

**Le problème que les logs résolvent** :

Sans logs, voici les problèmes rencontrés :

1. **Aucune trace des événements** : Quand un utilisateur signale un bug, tu n'as aucun moyen de savoir ce qui s'est passé dans l'application à ce moment-là.
2. **Impossible de reproduire** : Sans savoir exactement quelles actions ont été effectuées et dans quel ordre, reproduire un bug est un travail de devinette.
3. **Pas de contexte** : Même si tu sais qu'une erreur s'est produite, tu ne sais pas qui était l'utilisateur, quelle URL il visitait, ni quels paramètres il avait envoyés.

**Comment les logs résolvent ces problèmes** :

| Problème | Solution apportée par les logs |
| --- | --- |
| Aucune trace des événements | Chaque événement important est enregistré avec sa date et son contexte |
| Impossible de reproduire | Les logs montrent la séquence exacte des actions avant le bug |
| Pas de contexte | Les logs structurés incluent l'utilisateur, l'URL, les paramètres et plus |

**Analogie concrète** : Les logs sont comme le journal de bord d'un navire. Le capitaine note chaque événement : départ du port, changement de cap, tempête rencontrée, avarie constatée. Si le navire a un problème, le journal de bord permet de reconstituer exactement ce qui s'est passé.

**Ce que les logs ne sont PAS** :

- Les logs ne sont pas des métriques. Les métriques sont des valeurs numériques (compteurs, jauges). Les logs sont des messages texte décrivant des événements.
- Les logs ne sont pas un outil de débogage en production. Tu ne dois pas ajouter des `var_dump` ou des `echo` en production. Utilise les niveaux de log appropriés.

---

### Qu'est-ce qu'un log structuré ?

**Définition** : Un log structuré est un log écrit dans un format machine-lisible (généralement JSON) au lieu d'un simple texte libre. Chaque information est un champ nommé avec une valeur typée.

**Le problème que les logs structurés résolvent** :

Sans logs structurés, voici les problèmes rencontrés :

1. **Recherche difficile** : Dans un fichier de logs en texte libre, chercher "toutes les erreurs de l'utilisateur 42" nécessite des expressions régulières complexes qui cassent dès que le format du message change.
2. **Parsing fragile** : Chaque développeur écrit ses messages différemment. Un outil qui parse ces logs doit deviner où se trouve chaque information.
3. **Agrégation impossible** : Compter le nombre d'erreurs par type, par utilisateur ou par endpoint est très difficile avec du texte libre.

**Comment les logs structurés résolvent ces problèmes** :

| Problème | Solution apportée par les logs structurés |
| --- | --- |
| Recherche difficile | Chaque champ est nommé. Chercher `user_id=42` est trivial |
| Parsing fragile | Le format JSON est standard. Tous les outils le comprennent |
| Agrégation impossible | Les champs structurés permettent des agrégations (count, group by) |

**Comparaison log texte vs log structuré** :

Log en texte libre :

```text
[2026-03-20 14:32:15] app.INFO: User 42 logged in from 192.168.1.10
```

Log structuré (JSON) :

```json
{
  "datetime": "2026-03-20T14:32:15+00:00",
  "channel": "app",
  "level": "INFO",
  "message": "User logged in",
  "context": {
    "user_id": 42,
    "ip": "192.168.1.10"
  }
}
```

Le log structuré est plus verbeux, mais chaque donnée est dans un champ nommé. Un outil comme Loki peut filtrer par `user_id`, `ip` ou `level` sans expression régulière.

---

### Les niveaux de log

**Définition** : Le niveau de log (log level) indique la sévérité d'un événement. Monolog utilise les 8 niveaux définis par la spécification PSR-3, du moins grave au plus grave.

**Les 8 niveaux de log (du moins grave au plus grave)** :

| Niveau | Valeur | Quand l'utiliser | Exemple |
| --- | --- | --- | --- |
| DEBUG | 100 | Informations détaillées pour le développement | Requête SQL exécutée, valeur d'une variable |
| INFO | 200 | Événements normaux de l'application | Utilisateur connecté, commande exécutée |
| NOTICE | 250 | Événements normaux mais significatifs | Configuration chargée, cache vidé |
| WARNING | 300 | Situations anormales mais non bloquantes | Utilisation d'une API obsolète, cache indisponible (fallback utilisé) |
| ERROR | 400 | Erreurs qui empêchent une fonctionnalité | Échec d'envoi d'email, requête API externe échouée |
| CRITICAL | 500 | Erreurs graves nécessitant une intervention | Composant applicatif indisponible, perte de connexion base de données |
| ALERT | 550 | Action immédiate nécessaire | Site web entièrement down, base de données corrompue |
| EMERGENCY | 600 | Système inutilisable | Système de fichiers plein, kernel panic |

**Règle pratique** : En production, configure tes handlers pour enregistrer les logs de niveau WARNING et au-dessus. Les niveaux DEBUG et INFO génèrent trop de volume en production.

---

### Qu'est-ce que Monolog ?

**Définition** : Monolog est la bibliothèque de logging de référence en PHP. Symfony l'intègre nativement via le bundle MonologBundle. Monolog implémente la spécification PSR-3 (interface standard de logging en PHP).

**Le problème que Monolog résout** :

Sans Monolog, voici les problèmes rencontrés :

1. **Logging artisanal** : Sans bibliothèque dédiée, les développeurs utilisent `error_log()`, `file_put_contents()` ou `echo` pour logger. Chaque développeur fait différemment.
2. **Pas de niveaux** : Impossible de filtrer les logs par sévérité. Tous les messages sont mélangés.
3. **Pas de destinations multiples** : Écrire dans un fichier ET envoyer par email ET stocker dans une base de données nécessite du code custom.

**Comment Monolog résout ces problèmes** :

| Problème | Solution apportée par Monolog |
| --- | --- |
| Logging artisanal | Interface PSR-3 standard. Tous les développeurs utilisent la même API |
| Pas de niveaux | 8 niveaux de sévérité (DEBUG à EMERGENCY) |
| Pas de destinations multiples | Système de handlers : chaque handler envoie les logs vers une destination |

**Architecture de Monolog** :

Le diagramme suivant montre le pipeline de logs Monolog dans Symfony.

<div class="diagram-design">
<p><a href="../../diagrams/14-monitoring-02-logs-structures-1.html">Qu&#x27;est-ce que Monolog ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/14-monitoring-02-logs-structures-1.html" title="Qu&#x27;est-ce que Monolog ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

```text
Logger
  │
  ├── Handler 1 : StreamHandler (fichier)
  │     └── Formatter : JsonFormatter
  │
  ├── Handler 2 : RotatingFileHandler (fichiers rotatifs)
  │     └── Formatter : LineFormatter
  │
  └── Handler 3 : FingersCrossedHandler (buffer)
        └── Handler interne : StreamHandler
              └── Formatter : JsonFormatter

Processors (ajoutent des champs à chaque log) :
  ├── WebProcessor (URL, méthode HTTP, IP)
  ├── IntrospectionProcessor (fichier, ligne, classe)
  └── MemoryUsageProcessor (mémoire utilisée)
```

Trois composants clés :

- **Handlers** : où envoyer les logs (fichier, email, base de données, Slack)
- **Formatters** : comment formater les logs (texte, JSON, HTML)
- **Processors** : quelles informations ajouter automatiquement à chaque log

---

### Les handlers Monolog

**Définition** : Un handler est un composant qui reçoit un log et l'envoie vers une destination (fichier, flux, service externe).

**Handlers les plus utilisés** :

| Handler | Destination | Usage |
| --- | --- | --- |
| `StreamHandler` | Fichier ou flux (stderr) | Handler de base, écrit dans un fichier |
| `RotatingFileHandler` | Fichiers rotatifs | Crée un nouveau fichier chaque jour, supprime les anciens |
| `FingersCrossedHandler` | Buffer en mémoire | Stocke les logs en mémoire et les écrit uniquement si une erreur survient |
| `SyslogHandler` | Syslog système | Envoie les logs vers le daemon syslog du système |
| `ErrorLogHandler` | `error_log()` PHP | Utilise la fonction native PHP |

**Le handler `FingersCrossedHandler`** mérite une explication :

En production, tu ne veux pas enregistrer les logs DEBUG et INFO (trop de volume). Mais quand une erreur survient, les logs DEBUG et INFO qui précèdent l'erreur sont précieux pour comprendre le contexte.

Le `FingersCrossedHandler` :

1. Stocke tous les logs en mémoire (y compris DEBUG et INFO)
2. Si un log de niveau ERROR (ou au-dessus) arrive, il écrit tous les logs stockés vers la destination finale
3. Si aucune erreur ne survient pendant la requête, les logs sont supprimés

---

### Les processors Monolog

**Définition** : Un processor est un composant qui ajoute automatiquement des informations à chaque log avant qu'il ne soit envoyé au handler.

**Processors les plus utiles** :

| Processor | Informations ajoutées |
| --- | --- |
| `WebProcessor` | URL, méthode HTTP, adresse IP du client, referrer |
| `IntrospectionProcessor` | Nom du fichier, numéro de ligne, nom de la classe et de la méthode |
| `MemoryUsageProcessor` | Quantité de mémoire utilisée par PHP |
| `UidProcessor` | Identifiant unique pour la requête (corrélation) |
| `GitProcessor` | Branche et commit Git actuels |

---

### La rotation des logs

**Définition** : La rotation des logs est le processus de création de nouveaux fichiers de logs à intervalles réguliers (chaque jour, chaque semaine) et la suppression des fichiers les plus anciens.

**Le problème que la rotation résout** :

Sans rotation, voici les problèmes rencontrés :

1. **Fichier trop volumineux** : Un fichier de log qui grossit sans limite peut remplir le disque et faire planter le serveur.
2. **Recherche lente** : Chercher dans un fichier de plusieurs Go est très lent.
3. **Pas d'historique organisé** : Impossible de consulter les logs d'un jour précis sans parcourir tout le fichier.

**Comment la rotation résout ces problèmes** :

| Problème | Solution apportée par la rotation |
| --- | --- |
| Fichier trop volumineux | Un nouveau fichier est créé chaque jour. Les anciens sont supprimés |
| Recherche lente | Chaque fichier correspond à un jour. Tu ouvres directement le fichier du jour voulu |
| Pas d'historique organisé | Les fichiers sont nommés avec la date : `app-2026-03-20.log` |

---

## Étapes Pratiques

### Étape 1 : Vérifier la configuration Monolog par défaut

Dans un projet Symfony, Monolog est configuré dans le fichier `config/packages/monolog.yaml`.

Ouvre ce fichier et examine sa structure :

```yaml
# config/packages/monolog.yaml
monolog:
  channels:
    - deprecation

when@dev:
  monolog:
    handlers:
      main:
        # Enregistre tous les logs de niveau DEBUG et au-dessus
        type: stream
        # Écrit dans la sortie standard d'erreur (stderr)
        path: "%kernel.logs_dir%/%kernel.environment%.log"
        level: debug
        channels: ["!event"]
      console:
        type: console
        process_psr_3_messages: false
        channels: ["!event", "!doctrine", "!console"]

when@prod:
  monolog:
    handlers:
      main:
        type: fingers_crossed
        # Écrit uniquement si une erreur ERROR ou au-dessus survient
        action_level: error
        handler: nested
        excluded_http_codes: [404, 405]
      nested:
        type: stream
        path: "%kernel.logs_dir%/%kernel.environment%.log"
        level: debug
        formatter: monolog.formatter.json
```

Points importants :

- En **dev** : tous les logs DEBUG et au-dessus sont écrits dans un fichier
- En **prod** : le `fingers_crossed` handler stocke les logs en mémoire et ne les écrit que si une erreur survient

---

### Étape 2 : Configurer les logs structurés en JSON

Modifie la configuration de production pour utiliser le format JSON :

```yaml
# config/packages/monolog.yaml
when@prod:
  monolog:
    handlers:
      main:
        type: fingers_crossed
        action_level: error
        handler: nested
        # Exclut les erreurs 404 et 405 (pas de log pour les pages non trouvées)
        excluded_http_codes: [404, 405]
        buffer_size: 50
      nested:
        type: stream
        # Écrit dans stderr pour que Docker capture les logs
        path: "php://stderr"
        level: debug
        # Format JSON pour des logs structurés
        formatter: monolog.formatter.json
      deprecation:
        type: stream
        channels: [deprecation]
        path: "%kernel.logs_dir%/deprecation.log"
```

Explication des choix :

- `path: "php://stderr"` : les logs sortent sur la sortie d'erreur standard. Docker capture automatiquement stderr. Tu pourras les voir avec `docker logs`.
- `formatter: monolog.formatter.json` : chaque log est une ligne JSON. Les outils comme Loki et Promtail peuvent parser ce format.
- `buffer_size: 50` : le buffer `fingers_crossed` conserve les 50 derniers logs. Si une erreur survient, ces 50 logs sont écrits (contexte).

---

### Étape 3 : Écrire des logs dans un contrôleur Symfony

Crée un contrôleur qui utilise le logger :

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    // Symfony injecte automatiquement le logger via l'autowiring
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    #[Route('/products/{id}', name: 'product_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        // Log INFO : événement normal, un produit est consulté
        $this->logger->info('Product viewed', [
            'product_id' => $id,
            // Le contexte est un tableau clé-valeur
            // Ces données apparaîtront dans le champ "context" du log JSON
        ]);

        // Simule la recherche du produit
        $product = $this->findProduct($id);

        if ($product === null) {
            // Log WARNING : le produit n'existe pas (pas une erreur applicative)
            $this->logger->warning('Product not found', [
                'product_id' => $id,
            ]);

            return $this->json(['error' => 'Product not found'], 404);
        }

        return $this->json($product);
    }

    private function findProduct(int $id): ?array
    {
        // Simule une base de données
        $products = [
            1 => ['id' => 1, 'name' => 'Clavier mécanique', 'price' => 89.99],
            2 => ['id' => 2, 'name' => 'Souris ergonomique', 'price' => 45.50],
        ];

        return $products[$id] ?? null;
    }
}
```

**Résultat attendu** (log JSON produit) :

```json
{
  "message": "Product viewed",
  "context": {
    "product_id": 1
  },
  "level": 200,
  "level_name": "INFO",
  "channel": "app",
  "datetime": "2026-03-20T14:32:15.123456+00:00",
  "extra": {}
}
```

---

### Étape 4 : Ajouter des processors pour enrichir les logs

Configure des processors dans Monolog pour ajouter automatiquement des informations utiles à chaque log :

```yaml
# config/packages/monolog.yaml
monolog:
  channels:
    - deprecation

  handlers:
    main:
      type: stream
      path: "php://stderr"
      level: debug
      formatter: monolog.formatter.json
      # Les processors sont appliqués dans l'ordre
      processors:
        # Ajoute l'URL, la méthode HTTP et l'IP du client
        - monolog.processor.web
        # Ajoute un identifiant unique par requête
        - monolog.processor.uid
```

Pour enregistrer ces processors comme services, ajoute dans `config/services.yaml` :

```yaml
# config/services.yaml
services:
  monolog.processor.web:
    class: Monolog\Processor\WebProcessor
    tags:
      - { name: monolog.processor }

  monolog.processor.uid:
    class: Monolog\Processor\UidProcessor
    tags:
      - { name: monolog.processor }
```

**Résultat attendu** (log JSON enrichi par les processors) :

```json
{
  "message": "Product viewed",
  "context": {
    "product_id": 1
  },
  "level": 200,
  "level_name": "INFO",
  "channel": "app",
  "datetime": "2026-03-20T14:32:15.123456+00:00",
  "extra": {
    "url": "/products/1",
    "ip": "172.18.0.1",
    "http_method": "GET",
    "server": "localhost",
    "referrer": null,
    "uid": "a1b2c3d4"
  }
}
```

Le champ `extra` contient les données ajoutées par les processors. L'`uid` permet de regrouper tous les logs d'une même requête.

---

### Étape 5 : Utiliser les niveaux de log correctement

Voici un service qui utilise les différents niveaux de log dans des situations concrètes :

```php
<?php
// src/Service/PaymentService.php

namespace App\Service;

use Psr\Log\LoggerInterface;

class PaymentService
{
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    public function processPayment(int $orderId, float $amount): bool
    {
        // DEBUG : détails techniques pour le développement
        $this->logger->debug('Starting payment processing', [
            'order_id' => $orderId,
            'amount' => $amount,
            'currency' => 'EUR',
        ]);

        // Simule un appel à l'API de paiement
        $result = $this->callPaymentApi($orderId, $amount);

        if ($result['status'] === 'success') {
            // INFO : événement métier normal
            $this->logger->info('Payment processed successfully', [
                'order_id' => $orderId,
                'amount' => $amount,
                'transaction_id' => $result['transaction_id'],
            ]);
            return true;
        }

        if ($result['status'] === 'retry') {
            // WARNING : problème temporaire, pas bloquant
            $this->logger->warning('Payment API returned retry status', [
                'order_id' => $orderId,
                'retry_after' => $result['retry_after'],
            ]);
            return false;
        }

        // ERROR : le paiement a échoué
        $this->logger->error('Payment failed', [
            'order_id' => $orderId,
            'amount' => $amount,
            'error_code' => $result['error_code'],
            'error_message' => $result['error_message'],
        ]);

        return false;
    }

    private function callPaymentApi(int $orderId, float $amount): array
    {
        // Simule une réponse API
        return [
            'status' => 'success',
            'transaction_id' => 'txn_' . uniqid(),
        ];
    }
}
```

---

### Étape 6 : Configurer la rotation des logs

Si tu écris les logs dans des fichiers (au lieu de stderr), utilise le `RotatingFileHandler` :

```yaml
# config/packages/monolog.yaml
when@prod:
  monolog:
    handlers:
      main:
        type: fingers_crossed
        action_level: error
        handler: rotating
        buffer_size: 50
      rotating:
        # Crée un nouveau fichier chaque jour
        type: rotating_file
        path: "%kernel.logs_dir%/app.log"
        # Conserve les logs des 14 derniers jours
        max_files: 14
        level: debug
        formatter: monolog.formatter.json
```

**Résultat attendu** dans le dossier `var/log/` :

```text
var/log/
├── app-2026-03-18.log
├── app-2026-03-19.log
├── app-2026-03-20.log    (aujourd'hui)
```

Chaque jour, un nouveau fichier est créé. Les fichiers de plus de 14 jours sont automatiquement supprimés.

---

### Étape 7 : Tester les logs en local

Vérifie que les logs fonctionnent en faisant une requête vers ton application :

```bash
# Envoie une requête vers le contrôleur de produit
curl -s http://localhost:8080/products/1 | python3 -m json.tool
```

**Résultat attendu** :

```json
{
    "id": 1,
    "name": "Clavier mécanique",
    "price": 89.99
}
```

Vérifie les logs émis par l'application :

```bash
# Affiche les derniers logs du conteneur Symfony
docker logs symfony-app --tail 10
```

**Résultat attendu** (une ligne JSON par log) :

```json
{"message":"Product viewed","context":{"product_id":1},"level":200,"level_name":"INFO","channel":"app","datetime":"2026-03-20T14:32:15.123456+00:00","extra":{"url":"/products/1","ip":"172.18.0.1","http_method":"GET","uid":"a1b2c3d4"}}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker logs <conteneur>` | Affiche les logs d'un conteneur Docker |
| `docker logs <conteneur> --tail 50` | Affiche les 50 dernières lignes de logs |
| `docker logs <conteneur> -f` | Suit les logs en temps réel (Ctrl+C pour quitter) |
| `docker logs <conteneur> --since 1h` | Affiche les logs de la dernière heure |
| `php bin/console debug:config monolog` | Affiche la configuration Monolog résolue |

---

## Pièges Fréquents

### Piège 1 : Logger des données sensibles

⚠️ **Problème** : Tu logges des données personnelles (mot de passe, numéro de carte bancaire, token API) dans les logs. Ces données se retrouvent en clair dans les fichiers de logs.

✅ **Solution** : Ne jamais logger de données sensibles. Utilise des identifiants (user_id, order_id) au lieu de données personnelles (email, nom). Si tu dois logger une valeur sensible, masque-la :

```php
// ❌ Mauvais : le mot de passe est dans les logs
$this->logger->info('User login attempt', [
    'email' => $email,
    'password' => $password,
]);

// ✅ Bon : seul l'identifiant est loggé
$this->logger->info('User login attempt', [
    'user_id' => $user->getId(),
]);
```

---

### Piège 2 : Utiliser le mauvais niveau de log

⚠️ **Problème** : Tu logges tout en ERROR ou tout en DEBUG. Résultat : en production, soit tu as trop de bruit (tout en ERROR), soit tu manques les problèmes importants (tout en DEBUG et filtré).

✅ **Solution** : Applique ces règles simples :

- Quelque chose a cassé et l'utilisateur est impacté ? **ERROR**
- Quelque chose est anormal mais l'application continue de fonctionner ? **WARNING**
- Un événement métier normal s'est produit ? **INFO**
- Tu as besoin de détails techniques pour déboguer ? **DEBUG**

---

### Piège 3 : Logs dans des fichiers en environnement Docker

⚠️ **Problème** : Tu configures Monolog pour écrire dans `var/log/prod.log` à l'intérieur du conteneur Docker. Le fichier grossit et remplit le disque du conteneur. Tu ne peux pas lire les logs facilement depuis l'extérieur.

✅ **Solution** : En environnement Docker, écris les logs sur `php://stderr`. Docker capture automatiquement la sortie stderr et la rend disponible via `docker logs` :

```yaml
# ✅ Bon : les logs sortent sur stderr
nested:
  type: stream
  path: "php://stderr"
```

---

### Piège 4 : Oublier le contexte dans les logs

⚠️ **Problème** : Tu écris des logs sans contexte. Le message seul ne suffit pas pour comprendre le problème.

✅ **Solution** : Ajoute toujours le contexte sous forme de tableau associatif :

```php
// ❌ Mauvais : pas de contexte
$this->logger->error('Payment failed');

// ✅ Bon : contexte complet
$this->logger->error('Payment failed', [
    'order_id' => $orderId,
    'amount' => $amount,
    'error_code' => $errorCode,
]);
```

---

## Checklist de Validation

- [ ] Je sais configurer Monolog dans `config/packages/monolog.yaml`
- [ ] Je comprends la différence entre les niveaux DEBUG, INFO, WARNING et ERROR
- [ ] Je sais écrire des logs structurés en JSON avec le `JsonFormatter`
- [ ] Je sais utiliser le `FingersCrossedHandler` pour la production
- [ ] Je sais ajouter des processors pour enrichir les logs (URL, IP, UID)
- [ ] Je sais configurer la rotation des logs avec le `RotatingFileHandler`
- [ ] Je sais lire les logs d'un conteneur Docker avec `docker logs`

---

## Exercice Pratique

**Énoncé** : Configure Monolog dans un projet Symfony pour produire des logs structurés en JSON. Crée un service `OrderService` avec une méthode `createOrder()` qui logue chaque étape (validation, paiement, confirmation). Utilise les niveaux de log appropriés.

**Indications** :

- Configure le handler `fingers_crossed` pour la production
- Utilise `php://stderr` comme destination
- Ajoute les processors `WebProcessor` et `UidProcessor`
- La méthode `createOrder()` doit loguer au minimum 3 événements :
  - INFO : commande créée
  - WARNING : si le stock est faible
  - ERROR : si le paiement échoue

**Résultat attendu** :

- Les logs apparaissent en JSON dans `docker logs`
- Chaque log contient le message, le contexte, l'URL, l'IP et un UID de requête
- Les niveaux de log sont corrects pour chaque situation

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Configuration Monolog** :

```yaml
# config/packages/monolog.yaml
monolog:
  channels:
    - deprecation
    - order

when@dev:
  monolog:
    handlers:
      main:
        type: stream
        path: "%kernel.logs_dir%/%kernel.environment%.log"
        level: debug
        channels: ["!event"]
        formatter: monolog.formatter.json

when@prod:
  monolog:
    handlers:
      main:
        type: fingers_crossed
        action_level: error
        handler: nested
        excluded_http_codes: [404, 405]
        buffer_size: 50
      nested:
        type: stream
        path: "php://stderr"
        level: debug
        formatter: monolog.formatter.json
```

**Configuration des processors** :

```yaml
# config/services.yaml
services:
  # ... autres services

  Monolog\Processor\WebProcessor:
    tags:
      - { name: monolog.processor }

  Monolog\Processor\UidProcessor:
    tags:
      - { name: monolog.processor }
```

**Service OrderService** :

```php
<?php
// src/Service/OrderService.php

namespace App\Service;

use Psr\Log\LoggerInterface;

class OrderService
{
    public function __construct(
        // Symfony injecte le logger du channel "order"
        private LoggerInterface $orderLogger,
    ) {
    }

    public function createOrder(int $userId, array $items): array
    {
        // INFO : début du processus de commande
        $this->orderLogger->info('Order creation started', [
            'user_id' => $userId,
            'item_count' => count($items),
        ]);

        // Étape 1 : Validation
        $validationResult = $this->validateOrder($items);
        if (!$validationResult['valid']) {
            // WARNING : la validation a échoué mais ce n'est pas une erreur système
            $this->orderLogger->warning('Order validation failed', [
                'user_id' => $userId,
                'reason' => $validationResult['reason'],
            ]);
            return ['success' => false, 'error' => $validationResult['reason']];
        }

        // Étape 2 : Vérification du stock
        $stockLevel = $this->checkStock($items);
        if ($stockLevel < 5) {
            // WARNING : stock faible, pas bloquant mais à surveiller
            $this->orderLogger->warning('Low stock detected during order', [
                'user_id' => $userId,
                'stock_remaining' => $stockLevel,
                'items' => array_column($items, 'id'),
            ]);
        }

        // Étape 3 : Paiement
        $paymentResult = $this->processPayment($userId, $items);
        if (!$paymentResult['success']) {
            // ERROR : le paiement a échoué, l'utilisateur est impacté
            $this->orderLogger->error('Payment failed during order creation', [
                'user_id' => $userId,
                'error_code' => $paymentResult['error_code'],
                'error_message' => $paymentResult['error_message'],
            ]);
            return ['success' => false, 'error' => 'Payment failed'];
        }

        // INFO : commande créée avec succès
        $orderId = random_int(1000, 9999);
        $this->orderLogger->info('Order created successfully', [
            'user_id' => $userId,
            'order_id' => $orderId,
            'total' => $paymentResult['total'],
            'transaction_id' => $paymentResult['transaction_id'],
        ]);

        return [
            'success' => true,
            'order_id' => $orderId,
        ];
    }

    private function validateOrder(array $items): array
    {
        if (empty($items)) {
            return ['valid' => false, 'reason' => 'No items in order'];
        }
        return ['valid' => true];
    }

    private function checkStock(array $items): int
    {
        // Simule un niveau de stock
        return random_int(1, 20);
    }

    private function processPayment(int $userId, array $items): array
    {
        // Simule un paiement réussi
        $total = array_sum(array_column($items, 'price'));
        return [
            'success' => true,
            'total' => $total,
            'transaction_id' => 'txn_' . uniqid(),
        ];
    }
}
```

**Contrôleur** :

```php
<?php
// src/Controller/OrderController.php

namespace App\Controller;

use App\Service\OrderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class OrderController extends AbstractController
{
    #[Route('/orders', name: 'order_create', methods: ['POST'])]
    public function create(Request $request, OrderService $orderService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'] ?? 0;
        $items = $data['items'] ?? [];

        $result = $orderService->createOrder($userId, $items);

        if ($result['success']) {
            return $this->json($result, 201);
        }

        return $this->json($result, 400);
    }
}
```

**Test** :

```bash
# Envoie une requête POST pour créer une commande
curl -s -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id": 42, "items": [{"id": 1, "price": 29.99}, {"id": 2, "price": 15.00}]}'
```

**Résultat attendu** :

```json
{
    "success": true,
    "order_id": 4521
}
```

**Logs produits** (visibles via `docker logs`) :

```json
{"message":"Order creation started","context":{"user_id":42,"item_count":2},"level":200,"level_name":"INFO","channel":"order","datetime":"2026-03-20T14:32:15+00:00","extra":{"url":"/orders","http_method":"POST","ip":"172.18.0.1","uid":"f3a1b2c4"}}
{"message":"Order created successfully","context":{"user_id":42,"order_id":4521,"total":44.99,"transaction_id":"txn_65f1a2b3c4"},"level":200,"level_name":"INFO","channel":"order","datetime":"2026-03-20T14:32:15+00:00","extra":{"url":"/orders","http_method":"POST","ip":"172.18.0.1","uid":"f3a1b2c4"}}
```

---

## Navigation

← Fiche précédente : **[Introduction à l'observabilité](01-introduction-observabilite.md)**

→ Fiche suivante : **[Prometheus - Introduction](03-prometheus-introduction.md)**
