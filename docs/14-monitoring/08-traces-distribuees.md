---
tags:
  - Monitoring
  - Avancé
  - Pratique
description: "Traces distribuées : concepts de tracing, OpenTelemetry SDK PHP, Tempo, visualisation des traces dans Grafana."
estimated_time: "75 min"
fiche_number: 8
total_fiches: 10
cursus: "Monitoring et Observabilité"
---

# 08 - Traces distribuées

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est le tracing distribué, comment instrumenter une application Symfony avec OpenTelemetry et comment visualiser les traces dans Grafana avec Tempo. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Introduction à l'observabilité](01-introduction-observabilite.md) (les trois piliers)
- Avoir lu la fiche [04 - Prometheus - Métriques applicatives](04-prometheus-metriques.md)
- Connaître les bases de Symfony (contrôleurs, services)
- Savoir utiliser Docker Compose

## Versions utilisées dans cette fiche

| Technologie | Version |
| --- | --- |
| Grafana Tempo | 3.0.x |
| OpenTelemetry PHP | 1.x |
| PHP | 8.3 |
| Symfony | 7.4 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les concepts de tracing distribué (trace, span, context propagation), instrumenter une application Symfony avec le SDK OpenTelemetry PHP et visualiser les traces dans Grafana.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le tracing distribué ?

**Définition** : Le tracing distribué est la pratique de suivre le parcours complet d'une requête à travers tous les services qu'elle traverse. Chaque étape du parcours est enregistrée avec sa durée, permettant d'identifier les goulots d'étranglement.

**Le problème que le tracing distribué résout** :

Sans tracing distribué, voici les problèmes rencontrés :

1. **Requête lente, cause inconnue** : Un utilisateur signale que la page met 5 secondes à charger. La requête traverse l'API Gateway, le service d'authentification, le service produit et la base de données. Lequel des quatre est responsable de la lenteur ?
2. **Erreur en cascade** : Un service retourne une erreur 500. Est-ce ce service qui a le bug, ou est-ce un service en amont qui a envoyé des données incorrectes ?
3. **Dépendances cachées** : Tu ne sais pas quels services sont appelés quand un utilisateur visite une page. Les dépendances entre services ne sont pas documentées.

**Comment le tracing distribué résout ces problèmes** :

| Problème | Solution apportée par le tracing |
| --- | --- |
| Requête lente, cause inconnue | La trace montre la durée de chaque étape. Tu vois immédiatement que la base de données prend 4.2s |
| Erreur en cascade | La trace montre quel service a retourné l'erreur en premier et comment elle s'est propagée |
| Dépendances cachées | La trace montre tous les services impliqués dans chaque requête, comme une carte |

**Analogie concrète** : Le tracing distribué fonctionne comme le suivi d'un colis. Quand tu envoies un colis, tu reçois un numéro de suivi (le trace ID). Ce numéro te permet de voir chaque étape : dépôt au bureau de poste (5 min), tri au centre régional (2h), transport inter-régional (8h), livraison au destinataire (30 min). Si le colis est en retard, tu sais exactement à quelle étape le retard est survenu.

**Ce que le tracing distribué n'est PAS** :

- Le tracing distribué n'est pas du logging. Les logs enregistrent des événements individuels. Les traces suivent le parcours complet d'une requête à travers plusieurs services.
- Le tracing distribué n'est pas nécessaire pour une application monolithique simple. Si ton application est un seul service Symfony, les métriques et les logs suffisent. Le tracing devient indispensable quand tu as plusieurs services qui communiquent entre eux.

---

### Les composants d'une trace

**Définition** : Une trace est composée de spans organisés en arbre. Chaque span représente une opération.

**Trace** :

- Identifiée par un **Trace ID** unique (128 bits, affiché en hexadécimal)
- Contient un ou plusieurs spans
- Représente le parcours complet d'une requête

**Span** :

- Identifié par un **Span ID** unique
- Contient un **parent Span ID** (sauf le root span)
- Contient un **nom** d'opération, une **durée**, un **statut** et des **attributs**

Le diagramme suivant illustre comment une trace traverse plusieurs services, avec un Trace ID partagé.

<div class="diagram-design">
<p><a href="../../diagrams/14-monitoring-08-traces-distribuees-1.html">Les composants d&#x27;une trace (HTML + SVG)</a></p>
<iframe src="../../diagrams/14-monitoring-08-traces-distribuees-1.html" title="Les composants d&#x27;une trace" style="width:100%;min-height:520px;border:0;background:transparent"></iframe>
</div>

**Exemple de trace** :

```text
Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736

Root Span: HTTP GET /api/orders/42        [0ms ─────────────────────── 250ms]
  ├── Span: AuthService.validateToken      [5ms ──── 25ms]
  ├── Span: OrderService.getOrder          [30ms ────────────────── 220ms]
  │   ├── Span: Database.query             [35ms ────────── 180ms]
  │   │   └── Span: pg.execute             [40ms ──────── 175ms]
  │   └── Span: Cache.get                  [185ms ── 195ms]
  └── Span: Serializer.serialize           [225ms ── 245ms]
```

Dans cet exemple :

- La requête totale prend 250ms
- La requête base de données (`pg.execute`) prend 135ms, soit 54% du temps total
- C'est le principal goulot d'étranglement

**Attributs d'un span** :

| Attribut | Description | Exemple |
| --- | --- | --- |
| `span.name` | Nom de l'opération | `HTTP GET /api/orders` |
| `span.kind` | Type (SERVER, CLIENT, INTERNAL) | `SERVER` |
| `span.status` | Statut (OK, ERROR) | `OK` |
| `http.method` | Méthode HTTP | `GET` |
| `http.status_code` | Code de réponse | `200` |
| `http.url` | URL de la requête | `/api/orders/42` |
| `db.system` | Système de base de données | `postgresql` |
| `db.statement` | Requête SQL | `SELECT * FROM orders WHERE id = $1` |

---

### Qu'est-ce que la propagation de contexte ?

**Définition** : La propagation de contexte (context propagation) est le mécanisme par lequel le Trace ID et le Span ID sont transmis d'un service à l'autre. Sans propagation de contexte, chaque service crée sa propre trace indépendante, et il est impossible de les relier.

**Comment ça fonctionne** :

Quand le Service A appelle le Service B, il ajoute des headers HTTP contenant le Trace ID et le Span ID :

```text
Service A ──── HTTP Request ────→ Service B
                Headers:
                traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

Le header `traceparent` suit le standard W3C Trace Context :

```text
00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
│   │                                │                  │
│   │                                │                  └── Flags (01 = sampled)
│   │                                └── Parent Span ID (16 hex chars)
│   └── Trace ID (32 hex chars)
└── Version (toujours 00)
```

Le Service B lit ces headers, crée un span enfant avec le même Trace ID et continue la trace.

---

### Qu'est-ce que OpenTelemetry ?

**Définition** : OpenTelemetry (OTel) est un standard open source pour l'instrumentation des applications. Il fournit des APIs, SDKs et outils pour collecter les métriques, logs et traces de manière unifiée, indépendamment du backend de stockage (Tempo, Jaeger, Datadog).

**Le problème que OpenTelemetry résout** :

Sans OpenTelemetry, voici les problèmes rencontrés :

1. **Vendor lock-in** : Chaque backend de tracing (Jaeger, Zipkin, Datadog) a son propre SDK. Si tu changes de backend, tu dois réécrire toute l'instrumentation.
2. **Standards incompatibles** : Jaeger utilise son propre format de propagation, Zipkin un autre. Deux services instrumentés avec des SDKs différents ne peuvent pas partager une trace.
3. **Trois SDKs différents** : Un SDK pour les métriques, un pour les logs, un pour les traces. Trois bibliothèques à installer, configurer et maintenir.

**Comment OpenTelemetry résout ces problèmes** :

| Problème | Solution apportée par OpenTelemetry |
| --- | --- |
| Vendor lock-in | Un seul SDK, compatible avec tous les backends (Tempo, Jaeger, Datadog) |
| Standards incompatibles | Standard W3C Trace Context pour la propagation |
| Trois SDKs | Un seul SDK pour les métriques, les logs et les traces |

---

### Qu'est-ce que Grafana Tempo ?

**Définition** : Grafana Tempo est un backend de stockage de traces distribué, développé par Grafana Labs. Il stocke les traces et permet de les rechercher par Trace ID. Tempo est conçu pour être économique : il n'indexe que les Trace IDs, pas les attributs des spans.

**Comparaison Tempo vs Jaeger** :

| Tempo | Jaeger |
| --- | --- |
| Stockage économique (objet store, blocs Parquet) | Nécessite Elasticsearch ou Cassandra pour l'index |
| Pas d'index inversé de tous les attributs | Indexe les attributs des spans |
| Recherche par Trace ID et par TraceQL (service, durée, attributs) | Recherche par attributs (service, opération, durée) |
| Intégré nativement à Grafana | Interface Jaeger UI séparée |

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Crée le dossier de travail
mkdir -p ~/monitoring-cursus/tracing
```

---

### Étape 2 : Créer le fichier Docker Compose

```yaml
# ~/monitoring-cursus/tracing/docker-compose.yml
services:
  # Grafana Tempo : stockage des traces
  tempo:
    image: grafana/tempo:3.0.0
    ports:
      # gRPC pour la réception des traces
      - "4317:4317"
      # HTTP pour l'API et l'interface
      - "3200:3200"
    volumes:
      - ./tempo-config.yml:/etc/tempo/config.yml:ro
      - tempo-data:/var/tempo
    command: -config.file=/etc/tempo/config.yml

  # OpenTelemetry Collector : reçoit les traces et les envoie à Tempo
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.104.0
    ports:
      # OTLP/HTTP (réception des traces depuis l'application)
      # Port 4318 = OTLP sur HTTP ; le port 4317 est réservé à OTLP/gRPC
      - "4318:4318"
    volumes:
      - ./otel-collector-config.yml:/etc/otelcol/config.yaml:ro
    command: --config=/etc/otelcol/config.yaml
    depends_on:
      - tempo

  # Grafana : visualisation
  grafana:
    image: grafana/grafana:13.1.3
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - tempo

  # Prometheus : métriques
  prometheus:
    image: prom/prometheus:v3.13.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro

volumes:
  tempo-data:
  grafana-data:
```

---

### Étape 3 : Créer la configuration Tempo

```yaml
# ~/monitoring-cursus/tracing/tempo-config.yml
server:
  http_listen_port: 3200

# Réception des traces
distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: "0.0.0.0:4317"
        http:
          endpoint: "0.0.0.0:4318"

# Stockage
storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces
    wal:
      path: /var/tempo/wal

# Rétention des blocs (Tempo 3.0 : le composant `compactor` n'existe plus)
# Un bloc YAML `compactor:` fait échouer le parse : "field compactor not found"
compaction:
  block_retention: 48h
```

---

### Étape 4 : Créer la configuration OpenTelemetry Collector

```yaml
# ~/monitoring-cursus/tracing/otel-collector-config.yml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: "0.0.0.0:4317"
      http:
        endpoint: "0.0.0.0:4318"

processors:
  batch:
    # Regroupe les traces par lots pour optimiser l'envoi
    timeout: 5s
    send_batch_size: 1000

exporters:
  otlp/tempo:
    # Envoie les traces vers Tempo
    endpoint: "tempo:4317"
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/tempo]
```

---

### Étape 5 : Créer la configuration Prometheus

```yaml
# ~/monitoring-cursus/tracing/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
```

---

### Étape 6 : Lancer la stack

```bash
# Lance tous les services
cd ~/monitoring-cursus/tracing && docker compose up -d
```

Vérifie que Tempo est prêt :

```bash
# Vérifie que Tempo répond
curl -s http://localhost:3200/ready
```

**Résultat attendu** :

```text
ready
```

---

### Étape 7 : Instrumenter une application Symfony

Installe les packages OpenTelemetry dans ton projet Symfony :

```bash
# SDK + export OTLP + attributs sémantiques (SERVICE_NAME, etc.)
composer require open-telemetry/sdk open-telemetry/exporter-otlp open-telemetry/sem-conv
# Client HTTP PSR-18 requis par le transport OTLP/HTTP
composer require guzzlehttp/guzzle php-http/guzzle7-adapter
```

Configure OpenTelemetry dans Symfony en créant un service :

```php
<?php
// src/Service/TracingService.php

namespace App\Service;

use OpenTelemetry\API\Trace\TracerInterface;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\Contrib\Otlp\SpanExporter;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Trace\SpanProcessor\SimpleSpanProcessor;
use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SemConv\ResourceAttributes;

class TracingService
{
    private TracerInterface $tracer;

    public function __construct()
    {
        // Transport OTLP/HTTP vers le collector (port 4318 = HTTP, pas gRPC)
        $transport = (new OtlpHttpTransportFactory())->create(
            'http://otel-collector:4318/v1/traces',
            'application/x-protobuf'
        );
        // SpanExporter attend un TransportInterface, pas une URL en chaîne
        $exporter = new SpanExporter($transport);

        // Ressource : identifie le service dans Tempo / Grafana
        $resource = ResourceInfoFactory::defaultResource()->merge(
            ResourceInfo::create(Attributes::create([
                ResourceAttributes::SERVICE_NAME => 'symfony-app',
                ResourceAttributes::SERVICE_VERSION => '1.0.0',
            ]))
        );

        $tracerProvider = new TracerProvider(
            new SimpleSpanProcessor($exporter),
            null,
            $resource
        );

        $this->tracer = $tracerProvider->getTracer('symfony-app');
    }

    public function getTracer(): TracerInterface
    {
        return $this->tracer;
    }
}
```

---

### Étape 8 : Ajouter des traces aux contrôleurs

```php
<?php
// src/Controller/OrderController.php

namespace App\Controller;

use App\Service\TracingService;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class OrderController extends AbstractController
{
    public function __construct(
        private TracingService $tracingService,
    ) {
    }

    #[Route('/api/orders/{id}', name: 'order_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $tracer = $this->tracingService->getTracer();

        // Crée le span racine pour cette requête
        $span = $tracer->spanBuilder('HTTP GET /api/orders/' . $id)
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->setAttribute('http.method', 'GET')
            ->setAttribute('http.url', '/api/orders/' . $id)
            ->startSpan();

        // Active le span dans le contexte courant
        $scope = $span->activate();

        try {
            // Span enfant : recherche dans la base de données
            $dbSpan = $tracer->spanBuilder('Database.findOrder')
                ->setAttribute('db.system', 'postgresql')
                ->setAttribute('db.statement', 'SELECT * FROM orders WHERE id = $1')
                ->startSpan();

            // Simule une requête base de données (120ms)
            usleep(120000);
            $order = ['id' => $id, 'total' => 99.99, 'status' => 'paid'];

            $dbSpan->setStatus(StatusCode::STATUS_OK);
            $dbSpan->end();

            // Span enfant : sérialisation
            $serializeSpan = $tracer->spanBuilder('Serializer.serialize')
                ->startSpan();

            // Simule la sérialisation (5ms)
            usleep(5000);

            $serializeSpan->setStatus(StatusCode::STATUS_OK);
            $serializeSpan->end();

            // Termine le span racine avec succès
            $span->setAttribute('http.status_code', 200);
            $span->setStatus(StatusCode::STATUS_OK);

            return $this->json($order);
        } catch (\Throwable $e) {
            // En cas d'erreur, marque le span en erreur
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            $span->recordException($e);
            throw $e;
        } finally {
            // Ferme toujours le span et le scope
            $span->end();
            $scope->detach();
        }
    }
}
```

---

### Étape 9 : Configurer Tempo dans Grafana

1. Connecte-toi à Grafana (`http://localhost:3000`)
2. Va dans **Connections** > **Data sources**
3. Ajoute **Tempo** comme datasource :
   - **URL** : `http://tempo:3200`
4. Clique sur **Save & test**

**Résultat attendu** :

```text
✓ Successfully connected to Tempo data source.
```

---

### Étape 10 : Visualiser les traces

1. Dans Grafana, va dans **Explore**
2. Sélectionne la datasource **Tempo**
3. Dans le champ **TraceQL**, tape :

```text
{resource.service.name="symfony-app"}
```

1. Clique sur **Run query**

Tu verras la liste des traces. Clique sur une trace pour voir la vue détaillée en waterfall (cascade) :

```text
symfony-app: HTTP GET /api/orders/42    [0ms ──────────── 130ms]
  ├── symfony-app: Database.findOrder    [2ms ────── 122ms]
  └── symfony-app: Serializer.serialize  [124ms ── 129ms]
```

Chaque span affiche sa durée. Tu vois immédiatement que la base de données prend 120ms sur 130ms total.

---

### Étape 11 : Nettoyer

```bash
# Arrête les conteneurs (conserve les volumes)
cd ~/monitoring-cursus/tracing && docker compose down
```

> **Note** : `docker compose down` sans `-v` conserve les volumes Docker (données Tempo, Grafana). Ne l'utilise pas comme nettoyage habituel : le drapeau volumes détruit les données. Réserve-le à un reset volontaire et documenté. Attention : cela supprime définitivement les traces et configurations stockées dans les volumes.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `curl http://localhost:3200/ready` | Vérifie que Tempo est prêt |
| `curl http://localhost:3200/api/traces/<trace-id>` | Récupère une trace par son ID |
| `docker compose logs otel-collector` | Vérifie les logs du collector |
| `docker compose logs tempo` | Vérifie les logs de Tempo |

---

## Pièges Fréquents

### Piège 1 : Oublier de fermer les spans

⚠️ **Problème** : Tu crées un span mais tu oublies d'appeler `$span->end()`. Le span reste ouvert et n'est jamais envoyé à Tempo. La trace est incomplète.

✅ **Solution** : Utilise un bloc `try/finally` pour garantir que le span est toujours fermé :

```php
$span = $tracer->spanBuilder('my-operation')->startSpan();
$scope = $span->activate();
try {
    // ... ton code
} finally {
    $span->end();
    $scope->detach();
}
```

---

### Piège 2 : Traces non corrélées entre services

⚠️ **Problème** : Deux services ont des traces mais elles ne sont pas reliées. Chaque service a son propre Trace ID.

✅ **Solution** : Assure-toi que la propagation de contexte est configurée. Quand un service appelle un autre service HTTP, les headers `traceparent` doivent être propagés. Le SDK OpenTelemetry fait cela automatiquement si le client HTTP est instrumenté.

---

### Piège 3 : Trop de spans créés

⚠️ **Problème** : Tu crées un span pour chaque ligne de code. La trace contient des centaines de spans et est difficile à lire. Tempo consomme beaucoup de stockage.

✅ **Solution** : Crée des spans pour les opérations significatives uniquement :

- Appels HTTP sortants
- Requêtes base de données
- Appels à des services externes
- Opérations métier importantes

Ne crée pas de spans pour les opérations triviales (assignation de variable, boucle simple).

---

## Checklist de Validation

- [ ] Je comprends les concepts de trace, span et context propagation
- [ ] Tempo est installé et accessible
- [ ] Le OpenTelemetry Collector est configuré pour recevoir et transmettre les traces
- [ ] J'ai instrumenté un contrôleur Symfony avec des spans
- [ ] Les traces apparaissent dans Grafana Explore (datasource Tempo)
- [ ] Je sais lire une vue waterfall pour identifier les goulots d'étranglement
- [ ] Je comprends la différence entre OpenTelemetry, Tempo et Jaeger

---

## Exercice Pratique

**Énoncé** : Instrumente un contrôleur Symfony `ProductController` avec les spans suivants :

1. Span racine : `HTTP GET /api/products`
2. Span enfant : `Cache.lookup` (simule 10ms)
3. Span enfant : `Database.query` (simule 80ms, seulement si cache miss)
4. Span enfant : `Serializer.serialize` (simule 5ms)

Simule un cache hit (30% des requêtes) et un cache miss (70%). Le span `Database.query` ne doit apparaître que pour les cache misses.

**Indications** :

- Utilise `random_int(1, 10)` pour simuler le cache (1-3 = hit, 4-10 = miss)
- Ajoute des attributs `cache.hit` (boolean) et `db.system` (string)
- Vérifie dans Grafana que les traces avec cache hit sont plus courtes

**Résultat attendu** :

- Les traces apparaissent dans Grafana
- Les traces avec cache hit montrent 2 spans (cache + serialize)
- Les traces avec cache miss montrent 3 spans (cache + database + serialize)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use App\Service\TracingService;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    public function __construct(
        private TracingService $tracingService,
    ) {
    }

    #[Route('/api/products', name: 'product_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $tracer = $this->tracingService->getTracer();

        // Span racine
        $rootSpan = $tracer->spanBuilder('HTTP GET /api/products')
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->setAttribute('http.method', 'GET')
            ->setAttribute('http.url', '/api/products')
            ->startSpan();
        $rootScope = $rootSpan->activate();

        try {
            // Span : Cache lookup
            $cacheSpan = $tracer->spanBuilder('Cache.lookup')
                ->setAttribute('cache.type', 'redis')
                ->startSpan();

            // Simule 10ms de lecture cache
            usleep(10000);

            // 30% de cache hit (1-3 sur 10)
            $cacheHit = random_int(1, 10) <= 3;
            $cacheSpan->setAttribute('cache.hit', $cacheHit);
            $cacheSpan->setStatus(StatusCode::STATUS_OK);
            $cacheSpan->end();

            $products = [];

            if (!$cacheHit) {
                // Span : Database query (seulement si cache miss)
                $dbSpan = $tracer->spanBuilder('Database.query')
                    ->setAttribute('db.system', 'postgresql')
                    ->setAttribute('db.statement', 'SELECT * FROM products LIMIT 20')
                    ->startSpan();

                // Simule 80ms de requête SQL
                usleep(80000);

                $products = [
                    ['id' => 1, 'name' => 'Clavier', 'price' => 89.99],
                    ['id' => 2, 'name' => 'Souris', 'price' => 45.50],
                ];

                $dbSpan->setStatus(StatusCode::STATUS_OK);
                $dbSpan->end();
            } else {
                $products = [
                    ['id' => 1, 'name' => 'Clavier (cached)', 'price' => 89.99],
                ];
            }

            // Span : Sérialisation
            $serializeSpan = $tracer->spanBuilder('Serializer.serialize')
                ->startSpan();

            // Simule 5ms
            usleep(5000);

            $serializeSpan->setStatus(StatusCode::STATUS_OK);
            $serializeSpan->end();

            $rootSpan->setAttribute('http.status_code', 200);
            $rootSpan->setAttribute('cache.hit', $cacheHit);
            $rootSpan->setStatus(StatusCode::STATUS_OK);

            return $this->json($products);
        } catch (\Throwable $e) {
            $rootSpan->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            $rootSpan->recordException($e);
            throw $e;
        } finally {
            $rootSpan->end();
            $rootScope->detach();
        }
    }
}
```

**Vérification dans Grafana** :

Dans Explore avec la datasource Tempo, tu verras :

- Traces avec cache hit (~15ms total, 2 spans enfants)
- Traces avec cache miss (~95ms total, 3 spans enfants)

La différence de durée entre les deux types de traces est clairement visible.

---

## Navigation

← Fiche précédente : **[Logs avec Loki](07-logs-loki.md)**

→ Fiche suivante : **[Monitoring d'infrastructure](09-monitoring-infrastructure.md)**
