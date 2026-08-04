---
tags:
  - Monitoring
  - Intermédiaire
  - Pratique
description: "Prometheus - Métriques applicatives : instrumenter Symfony avec promphp, exposer /metrics, PromQL avancé."
estimated_time: "90 min"
fiche_number: 4
total_fiches: 10
cursus: "Monitoring et Observabilité"
---

# 04 - Prometheus - Métriques applicatives

> **En bref** : À la fin de cette fiche, tu sauras instrumenter une application Symfony pour exposer des métriques Prometheus sur un endpoint `/metrics`, créer des compteurs, jauges et histogrammes, et écrire des requêtes PromQL avancées. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [03 - Prometheus - Introduction](03-prometheus-introduction.md)
- Avoir un projet Symfony fonctionnel dans Docker
- Connaître les bases de Prometheus (types de métriques, pull model)

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| PHP | 8.3 |
| Symfony | 7.4 |
| promphp/prometheus_client_php | 2.x |
| Prometheus | 3.13.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer la bibliothèque Prometheus pour PHP, créer des métriques custom dans une application Symfony et écrire des requêtes PromQL pour analyser ces métriques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'instrumentation ?

**Définition** : L'instrumentation est le processus d'ajout de code dans une application pour collecter des métriques. L'application expose ensuite ces métriques sur un endpoint HTTP (`/metrics`) que Prometheus peut scraper.

**Le problème que l'instrumentation résout** :

Sans instrumentation, voici les problèmes rencontrés :

1. **Métriques système insuffisantes** : Node Exporter fournit des métriques sur le CPU, la mémoire et le disque. Mais il ne sait rien de ton application. Combien de commandes ont été passées ? Quel est le temps de réponse moyen de l'API ? Ces informations n'existent pas sans instrumentation.
2. **Pas de visibilité métier** : Les métriques système ne répondent pas aux questions métier. "Combien d'utilisateurs se sont connectés cette heure ?" ou "Quel pourcentage de paiements échouent ?" sont invisibles sans instrumentation.
3. **Diagnostic lent** : Sans métriques applicatives, quand l'application est lente, tu ne sais pas si c'est la base de données, le cache, un service externe ou le code PHP qui est responsable.

**Comment l'instrumentation résout ces problèmes** :

| Problème | Solution apportée par l'instrumentation |
| --- | --- |
| Métriques système insuffisantes | L'application expose ses propres métriques (requêtes, erreurs, latence) |
| Pas de visibilité métier | Tu définis des métriques métier (commandes, paiements, inscriptions) |
| Diagnostic lent | Les histogrammes montrent exactement où le temps est passé |

**Analogie concrète** : Les métriques système (Node Exporter) sont comme les indicateurs du tableau de bord d'une voiture : vitesse, niveau d'essence, température moteur. L'instrumentation applicative, c'est comme ajouter un GPS qui te dit combien de kilomètres tu as parcourus, combien de livraisons tu as effectuées et combien de temps chaque livraison a pris. Le tableau de bord te dit si la voiture fonctionne. Le GPS te dit si ton activité est performante.

---

### La bibliothèque promphp/prometheus_client_php

**Définition** : `promphp/prometheus_client_php` est la bibliothèque PHP officielle pour créer des métriques Prometheus dans une application PHP. Elle fournit les quatre types de métriques (counter, gauge, histogram, summary) et un renderer qui génère la sortie au format texte Prometheus.

**Composants principaux** :

| Composant | Rôle |
| --- | --- |
| `CollectorRegistry` | Registre central qui stocke toutes les métriques |
| `Counter` | Crée et incrémente des compteurs |
| `Gauge` | Crée et met à jour des jauges |
| `Histogram` | Crée et observe des histogrammes |
| `RenderTextFormat` | Génère la sortie `/metrics` au format Prometheus |
| `Storage\Redis` | Stocke les métriques dans Redis (persistance entre les requêtes) |
| `Storage\InMemory` | Stocke les métriques en mémoire (perdu à chaque requête) |
| `Storage\APCng` | Stocke les métriques dans APCu (partagé entre les requêtes PHP-FPM) |

**Point important sur le stockage** : PHP est un langage sans état (stateless). Chaque requête HTTP crée un nouveau processus PHP. Les métriques doivent être stockées dans un stockage partagé (Redis ou APCu) pour persister entre les requêtes.

---

Le diagramme suivant montre le flux d'exposition des métriques depuis l'application Symfony jusqu'aux dashboards Grafana.

```mermaid
flowchart LR
    app[Application Symfony] --> endpoint["/metrics<br>Format Prometheus"]
    endpoint --> prom[Prometheus<br>Scraping]
    prom --> grafana[Grafana<br>Dashboards]
```

### L'endpoint /metrics

**Définition** : L'endpoint `/metrics` est une route HTTP exposée par l'application qui retourne toutes les métriques au format texte Prometheus. Prometheus interroge cet endpoint à intervalle régulier (scraping).

**Format de sortie** :

```text
# HELP app_http_requests_total Total number of HTTP requests
# TYPE app_http_requests_total counter
app_http_requests_total{method="GET",status="200",route="/api/products"} 1542
app_http_requests_total{method="POST",status="201",route="/api/orders"} 89

# HELP app_http_request_duration_seconds HTTP request duration in seconds
# TYPE app_http_request_duration_seconds histogram
app_http_request_duration_seconds_bucket{route="/api/products",le="0.01"} 800
app_http_request_duration_seconds_bucket{route="/api/products",le="0.05"} 1200
app_http_request_duration_seconds_bucket{route="/api/products",le="0.1"} 1450
app_http_request_duration_seconds_bucket{route="/api/products",le="+Inf"} 1542
app_http_request_duration_seconds_sum{route="/api/products"} 45.23
app_http_request_duration_seconds_count{route="/api/products"} 1542
```

Chaque métrique est précédée de deux commentaires :

- `# HELP` : description humaine de la métrique
- `# TYPE` : type de la métrique (counter, gauge, histogram, summary)

---

### PromQL avancé

**Définition** : PromQL (Prometheus Query Language) est le langage de requête de Prometheus. Il permet de filtrer, agréger et transformer les métriques.

**Fonctions essentielles** :

| Fonction | Usage | Exemple |
| --- | --- | --- |
| `rate(counter[durée])` | Taux d'augmentation par seconde | `rate(http_requests_total[5m])` |
| `increase(counter[durée])` | Augmentation totale sur la durée | `increase(http_requests_total[1h])` |
| `sum()` | Somme de toutes les séries | `sum(rate(http_requests_total[5m]))` |
| `avg()` | Moyenne de toutes les séries | `avg(rate(http_requests_total[5m]))` |
| `max()` / `min()` | Valeur max / min (sur une gauge, pas un counter brut) | `max(node_memory_MemAvailable_bytes)` |
| `histogram_quantile()` | Calcule un percentile (sur un histogramme avec `rate`) | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
| `sum by (label)` | Somme groupée par label | `sum by (method) (rate(http_requests_total[5m]))` |

---

## Étapes Pratiques

### Étape 1 : Installer la bibliothèque PHP

Dans ton projet Symfony, installe la bibliothèque Prometheus :

```bash
# Installe la bibliothèque Prometheus pour PHP
composer require promphp/prometheus_client_php
```

**Résultat attendu** :

```text
./composer.json has been updated
Loading composer repositories with package information
Updating dependencies
  - Installing promphp/prometheus_client_php (v2.9.1)
```

---

### Étape 2 : Configurer le stockage des métriques

Les métriques doivent persister entre les requêtes PHP. Utilise APCu (la solution la plus simple, sans dépendance externe) ou Redis.

**Option A : Stockage APCu** (recommandé pour commencer) :

Vérifie que l'extension APCu est installée dans ton conteneur PHP :

```bash
# Vérifie que APCu est disponible
docker exec symfony-app php -m | grep apcu
```

**Résultat attendu** :

```text
apcu
```

Si APCu n'est pas installé, ajoute-le dans ton `Dockerfile` :

```dockerfile
# Ajoute l'extension APCu
RUN pecl install apcu && docker-php-ext-enable apcu
```

Crée le service de registre Prometheus dans Symfony :

```yaml
# config/services.yaml
services:
  # Stockage APCu pour les métriques Prometheus
  Prometheus\Storage\APCng:
    class: Prometheus\Storage\APCng

  # Registre central des métriques
  Prometheus\CollectorRegistry:
    class: Prometheus\CollectorRegistry
    arguments:
      - '@Prometheus\Storage\APCng'
```

**Option B : Stockage Redis** (si tu as Redis disponible) :

```yaml
# config/services.yaml
services:
  Prometheus\Storage\Redis:
    class: Prometheus\Storage\Redis
    arguments:
      - host: '%env(REDIS_HOST)%'
        port: '%env(int:REDIS_PORT)%'

  Prometheus\CollectorRegistry:
    class: Prometheus\CollectorRegistry
    arguments:
      - '@Prometheus\Storage\Redis'
```

---

### Étape 3 : Créer le contrôleur /metrics

Crée un contrôleur qui expose les métriques au format Prometheus :

```php
<?php
// src/Controller/MetricsController.php

namespace App\Controller;

use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MetricsController
{
    public function __construct(
        // Injecte le registre central des métriques
        private CollectorRegistry $registry,
    ) {
    }

    #[Route('/metrics', name: 'prometheus_metrics', methods: ['GET'])]
    public function metrics(): Response
    {
        // Crée le renderer au format texte Prometheus
        $renderer = new RenderTextFormat();

        // Génère la sortie de toutes les métriques enregistrées
        $result = $renderer->render($this->registry->getMetricFamilySamples());

        // Retourne la réponse avec le bon Content-Type
        return new Response(
            $result,
            200,
            // Content-Type obligatoire pour que Prometheus reconnaisse le format
            ['Content-Type' => RenderTextFormat::MIME_TYPE]
        );
    }
}
```

---

### Étape 4 : Créer un compteur de requêtes HTTP

Crée un event subscriber qui compte chaque requête HTTP :

```php
<?php
// src/EventSubscriber/MetricsSubscriber.php

namespace App\EventSubscriber;

use Prometheus\CollectorRegistry;
use Prometheus\Exception\MetricsRegistrationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class MetricsSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private CollectorRegistry $registry,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Enregistre le temps de début de la requête
            KernelEvents::REQUEST => ['onRequest', 1000],
            // Enregistre les métriques après la réponse
            KernelEvents::RESPONSE => ['onResponse', -1000],
        ];
    }

    public function onRequest(RequestEvent $event): void
    {
        // Ne traite que la requête principale (pas les sous-requêtes)
        if (!$event->isMainRequest()) {
            return;
        }

        // Stocke le timestamp de début dans les attributs de la requête
        $event->getRequest()->attributes->set(
            '_metrics_start_time',
            microtime(true)
        );
    }

    public function onResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $response = $event->getResponse();

        // Ignore l'endpoint /metrics lui-même pour ne pas polluer les métriques
        if ($request->getPathInfo() === '/metrics') {
            return;
        }

        $method = $request->getMethod();
        $status = (string) $response->getStatusCode();
        $route = $request->attributes->get('_route', 'unknown');

        // Compteur : nombre total de requêtes HTTP
        try {
            $counter = $this->registry->getOrRegisterCounter(
                // Namespace (préfixe de la métrique)
                'app',
                // Nom de la métrique
                'http_requests_total',
                // Description
                'Total number of HTTP requests',
                // Labels
                ['method', 'status', 'route']
            );
            // Incrémente le compteur de 1
            $counter->inc([$method, $status, $route]);
        } catch (MetricsRegistrationException $e) {
            // Silencieux : ne pas casser l'application si les métriques échouent
        }

        // Histogramme : durée des requêtes HTTP
        $startTime = $request->attributes->get('_metrics_start_time');
        if ($startTime !== null) {
            $duration = microtime(true) - $startTime;

            try {
                $histogram = $this->registry->getOrRegisterHistogram(
                    'app',
                    'http_request_duration_seconds',
                    'HTTP request duration in seconds',
                    ['method', 'route'],
                    // Buckets : intervalles de temps en secondes
                    [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
                );
                $histogram->observe($duration, [$method, $route]);
            } catch (MetricsRegistrationException $e) {
                // Silencieux
            }
        }
    }
}
```

---

### Étape 5 : Créer des métriques métier

Crée un service qui expose des métriques métier :

```php
<?php
// src/Service/OrderMetricsService.php

namespace App\Service;

use Prometheus\CollectorRegistry;

class OrderMetricsService
{
    public function __construct(
        private CollectorRegistry $registry,
    ) {
    }

    /**
     * Incrémente le compteur de commandes créées
     */
    public function recordOrderCreated(string $paymentMethod): void
    {
        $counter = $this->registry->getOrRegisterCounter(
            'app',
            'orders_created_total',
            'Total number of orders created',
            ['payment_method']
        );
        $counter->inc([$paymentMethod]);
    }

    /**
     * Incrémente le compteur de commandes échouées
     */
    public function recordOrderFailed(string $reason): void
    {
        $counter = $this->registry->getOrRegisterCounter(
            'app',
            'orders_failed_total',
            'Total number of failed orders',
            ['reason']
        );
        $counter->inc([$reason]);
    }

    /**
     * Met à jour la jauge du montant du panier
     */
    public function recordCartValue(float $value): void
    {
        $gauge = $this->registry->getOrRegisterGauge(
            'app',
            'cart_value_euros',
            'Current cart value in euros',
            ['currency']
        );
        $gauge->set($value, ['EUR']);
    }

    /**
     * Enregistre le temps de traitement d'une commande
     */
    public function recordOrderProcessingTime(float $durationSeconds): void
    {
        $histogram = $this->registry->getOrRegisterHistogram(
            'app',
            'order_processing_duration_seconds',
            'Order processing duration in seconds',
            [],
            // Buckets adaptés au traitement de commandes
            [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
        );
        $histogram->observe($durationSeconds);
    }
}
```

---

### Étape 6 : Configurer Prometheus pour scraper l'application

Mets à jour le fichier `prometheus.yml` :

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "symfony-app"
    # L'endpoint de métriques de ton application
    metrics_path: "/metrics"
    static_configs:
      # Nom du service dans Docker Compose et port
      - targets: ["symfony-app:8080"]
```

---

### Étape 7 : Tester les métriques

Vérifie que l'endpoint `/metrics` fonctionne :

```bash
# Interroge l'endpoint /metrics de l'application
curl -s http://localhost:8080/metrics | head -20
```

**Résultat attendu** :

```text
# HELP app_http_requests_total Total number of HTTP requests
# TYPE app_http_requests_total counter
app_http_requests_total{method="GET",status="200",route="product_show"} 5
app_http_requests_total{method="GET",status="404",route="product_show"} 1

# HELP app_http_request_duration_seconds HTTP request duration in seconds
# TYPE app_http_request_duration_seconds histogram
app_http_request_duration_seconds_bucket{method="GET",route="product_show",le="0.005"} 2
app_http_request_duration_seconds_bucket{method="GET",route="product_show",le="0.01"} 4
```

Génère du trafic pour avoir des métriques :

```bash
# Envoie 50 requêtes vers l'application
for i in $(seq 1 50); do
  curl -s http://localhost:8080/products/1 > /dev/null
  curl -s http://localhost:8080/products/999 > /dev/null
done
```

---

### Étape 8 : Écrire des requêtes PromQL avancées

Ouvre l'interface Prometheus (`http://localhost:9090`) et essaie ces requêtes :

**Taux de requêtes par seconde, groupé par route** :

```promql
sum by (route) (rate(app_http_requests_total[5m]))
```

**Taux d'erreurs (pourcentage de réponses 5xx)** :

```promql
sum(rate(app_http_requests_total{status=~"5.."}[5m]))
/
sum(rate(app_http_requests_total[5m]))
* 100
```

Cette requête :

1. Calcule le taux de requêtes avec un status commençant par 5 (500, 502, 503...)
2. Divise par le taux total de requêtes
3. Multiplie par 100 pour obtenir un pourcentage

**Temps de réponse au 95e percentile** :

```promql
histogram_quantile(0.95, sum by (le) (rate(app_http_request_duration_seconds_bucket[5m])))
```

Cette requête calcule le temps de réponse en dessous duquel se trouvent 95% des requêtes.

**Nombre de commandes créées par heure** :

```promql
increase(app_orders_created_total[1h])
```

**Temps de réponse moyen par route** :

```promql
sum by (route) (rate(app_http_request_duration_seconds_sum[5m]))
/
sum by (route) (rate(app_http_request_duration_seconds_count[5m]))
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `composer require promphp/prometheus_client_php` | Installe la bibliothèque Prometheus PHP |
| `curl http://localhost:8080/metrics` | Affiche les métriques de l'application |
| `curl http://localhost:9090/api/v1/query?query=up` | Exécute une requête PromQL via l'API |
| `docker exec <conteneur> php -m \| grep apcu` | Vérifie que APCu est installé |

---

## Pièges Fréquents

### Piège 1 : Trop de labels créent une explosion de séries

⚠️ **Problème** : Tu ajoutes un label `user_id` à un compteur de requêtes. Avec 100 000 utilisateurs, tu crées 100 000 séries temporelles. Prometheus consomme beaucoup de mémoire et devient lent.

✅ **Solution** : Les labels doivent avoir une cardinalité faible (peu de valeurs distinctes). Utilise `method` (GET, POST, PUT, DELETE), `status` (200, 404, 500) ou `route` (quelques dizaines). Ne mets jamais d'identifiants uniques (user_id, order_id, session_id) comme labels.

```php
// ❌ Mauvais : user_id a une cardinalité élevée
$counter->inc([$method, $status, $userId]);

// ✅ Bon : seuls des labels à cardinalité faible
$counter->inc([$method, $status, $route]);
```

---

### Piège 2 : Métriques perdues entre les requêtes PHP

⚠️ **Problème** : Tu utilises `Storage\InMemory` et les métriques sont vides à chaque scrape de Prometheus. Les métriques ne persistent pas entre les requêtes PHP.

✅ **Solution** : Utilise `Storage\APCng` (APCu) ou `Storage\Redis`. Ces stockages sont partagés entre les processus PHP-FPM.

---

### Piège 3 : L'endpoint /metrics casse l'application

⚠️ **Problème** : Une erreur dans le code des métriques (registre introuvable, label manquant) fait planter toute l'application.

✅ **Solution** : Encapsule toujours le code des métriques dans un try/catch. Les métriques ne doivent jamais empêcher l'application de fonctionner :

```php
try {
    $counter->inc([$method, $status, $route]);
} catch (\Throwable $e) {
    // Log l'erreur mais ne casse pas l'application
    $this->logger->warning('Metrics error', ['error' => $e->getMessage()]);
}
```

---

### Piège 4 : Oublier d'exclure /metrics du compteur

⚠️ **Problème** : Prometheus scrape `/metrics` toutes les 15 secondes. Si tu comptes les requêtes vers `/metrics`, tes métriques sont polluées par le trafic interne de scraping.

✅ **Solution** : Exclue la route `/metrics` dans ton subscriber :

```php
// Ignore l'endpoint /metrics
if ($request->getPathInfo() === '/metrics') {
    return;
}
```

---

## Checklist de Validation

- [ ] La bibliothèque `promphp/prometheus_client_php` est installée
- [ ] Le stockage des métriques est configuré (APCu ou Redis)
- [ ] L'endpoint `/metrics` retourne des métriques au format Prometheus
- [ ] Un compteur HTTP enregistre le nombre de requêtes par méthode, status et route
- [ ] Un histogramme enregistre la durée des requêtes
- [ ] Prometheus scrape l'application avec succès (target UP)
- [ ] Je sais écrire des requêtes PromQL avec `rate()`, `sum by` et `histogram_quantile()`

---

## Exercice Pratique

**Énoncé** : Instrumente ton application Symfony avec les métriques suivantes :

1. Un compteur `app_http_requests_total` avec les labels `method`, `status` et `route`
2. Un histogramme `app_http_request_duration_seconds` avec les labels `method` et `route`
3. Un compteur métier `app_user_logins_total` avec le label `method` (form, api, sso)
4. Une jauge `app_active_sessions` qui représente le nombre de sessions actives

Ensuite, écris les requêtes PromQL pour :

- Calculer le taux de requêtes par seconde
- Calculer le temps de réponse au 99e percentile
- Calculer le taux d'erreurs en pourcentage

**Indications** :

- Utilise l'event subscriber pour les métriques HTTP
- Crée un service dédié pour les métriques métier
- Les buckets de l'histogramme doivent couvrir de 5ms à 10s

**Résultat attendu** :

- L'endpoint `/metrics` affiche les quatre métriques
- Les requêtes PromQL retournent des résultats corrects

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Le compteur HTTP et l'histogramme sont déjà implémentés dans l'étape 4 (MetricsSubscriber).

**Service pour les métriques métier** :

```php
<?php
// src/Service/UserMetricsService.php

namespace App\Service;

use Prometheus\CollectorRegistry;

class UserMetricsService
{
    public function __construct(
        private CollectorRegistry $registry,
    ) {
    }

    public function recordLogin(string $method): void
    {
        $counter = $this->registry->getOrRegisterCounter(
            'app',
            'user_logins_total',
            'Total number of user logins',
            ['method']
        );
        $counter->inc([$method]);
    }

    public function setActiveSessions(int $count): void
    {
        $gauge = $this->registry->getOrRegisterGauge(
            'app',
            'active_sessions',
            'Number of currently active sessions',
            []
        );
        $gauge->set($count);
    }
}
```

**Requêtes PromQL** :

```promql
# Taux de requêtes par seconde
sum(rate(app_http_requests_total[5m]))
```

```promql
# Temps de réponse au 99e percentile
histogram_quantile(0.99, sum by (le) (rate(app_http_request_duration_seconds_bucket[5m])))
```

```promql
# Taux d'erreurs en pourcentage
sum(rate(app_http_requests_total{status=~"5.."}[5m]))
/ sum(rate(app_http_requests_total[5m]))
* 100
```

---

## Navigation

← Fiche précédente : **[Prometheus - Introduction](03-prometheus-introduction.md)**

→ Fiche suivante : **[Grafana - Dashboards](05-grafana-dashboards.md)**
