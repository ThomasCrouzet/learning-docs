---
tags:
  - Redis
  - Intermédiaire
  - Pratique
description: "Stocker les sessions PHP dans Redis pour améliorer la scalabilité et la performance"
estimated_time: "60 min"
fiche_number: 5
total_fiches: 8
cursus: "Redis et Cache"
---

# 05 - Redis dans Symfony - Sessions

> **En bref** : À la fin de cette fiche, tu sauras configurer Symfony pour stocker les sessions utilisateur dans Redis, comprendre les avantages par rapport au stockage en fichiers et migrer un projet existant. Lecture estimée : 60 min.

## Prérequis

- Fiche [01 - Introduction à Redis](01-introduction-redis.md)
- Fiche [02 - Installation et CLI redis](02-installation-cli-redis.md)
- Fiche [04 - Redis dans Symfony - Cache](04-redis-symfony-cache.md)
- Cursus Symfony : fiche 12 (sécurité et utilisateurs)
- Savoir ce qu'est une session PHP et comment fonctionne l'authentification Symfony

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Redis | 7.x |
| Symfony | 7.4 LTS |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras stocker les sessions PHP dans Redis, configurer le framework.session de Symfony, comprendre les avantages en termes de performance et de scalabilité, et sécuriser les sessions.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une session PHP ?

**Définition** : Une session PHP est un mécanisme qui permet de conserver des données entre plusieurs requêtes HTTP pour un même utilisateur. HTTP est un protocole sans état (stateless) : chaque requête est indépendante. La session permet de "se souvenir" de l'utilisateur entre les requêtes.

**Comment fonctionne une session** :

```text
1. L'utilisateur se connecte (login)
2. PHP crée un identifiant de session unique (ex: abc123)
3. PHP envoie un cookie PHPSESSID=abc123 au navigateur
4. À chaque requête suivante, le navigateur renvoie le cookie
5. PHP utilise cet identifiant pour retrouver les données de la session
6. Les données contiennent : user_id, rôle, panier, etc.
```

**Stockage par défaut** : Par défaut, PHP stocke les données de session dans des fichiers sur le disque du serveur, dans le dossier `/tmp/sess_*`.

---

### Le problème du stockage des sessions en fichiers

**Définition** : Le stockage des sessions en fichiers fonctionne bien pour un seul serveur avec peu d'utilisateurs. Mais il pose des problèmes quand l'application grandit.

**Les problèmes** :

1. **Pas de partage entre serveurs** : Si tu as deux serveurs PHP derrière un load balancer, les fichiers de session du serveur A ne sont pas accessibles depuis le serveur B. L'utilisateur est déconnecté à chaque changement de serveur.

2. **Performance** : Lire et écrire des fichiers sur disque est plus lent que lire depuis la RAM. Avec beaucoup d'utilisateurs simultanés, le disque devient un goulot d'étranglement.

3. **Nettoyage** : PHP doit régulièrement supprimer les fichiers de session expirés (garbage collection). Ce processus peut bloquer les requêtes.

4. **Perte au redémarrage du conteneur** : Si ton serveur PHP tourne dans un conteneur Docker sans volume pour `/tmp`, les sessions sont perdues à chaque redémarrage.

**Comment Redis résout ces problèmes** :

| Problème | Solution Redis |
| -------- | -------------- |
| Pas de partage entre serveurs | Redis est un serveur centralisé accessible par tous les serveurs PHP |
| Performance | Redis stocke en RAM, accès en microsecondes |
| Nettoyage | Redis gère automatiquement l'expiration avec le TTL |
| Perte au redémarrage | Redis est un processus séparé avec sa propre persistance |

Le diagramme suivant montre comment Redis centralise les sessions pour plusieurs serveurs PHP.

<div class="diagram-design">
<p><a href="../../diagrams/13-redis-05-redis-symfony-sessions-1.html">Le problème du stockage des sessions en fichiers (HTML + SVG)</a></p>
<iframe src="../../diagrams/13-redis-05-redis-symfony-sessions-1.html" title="Le problème du stockage des sessions en fichiers" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : Le stockage en fichiers, c'est comme chaque caissier d'un magasin qui note les achats d'un client fidèle sur son propre carnet. Si le client passe à une autre caisse, le caissier ne connaît pas son historique. Redis, c'est comme un système informatique central : n'importe quel caissier peut consulter le profil du client.

**Ce que les sessions Redis ne sont PAS** :

- Elles ne remplacent pas l'authentification. La session stocke le résultat de l'authentification (qui est connecté), pas le mécanisme d'authentification lui-même.
- Elles ne garantissent pas une persistance éternelle. Les sessions ont un TTL. Redis peut aussi manquer de mémoire et supprimer des sessions (politique d'éviction).

---

### Le handler de session Symfony

**Définition** : Symfony utilise un "session handler" pour gérer le stockage des sessions. Par défaut, c'est le handler natif de PHP (fichiers). Tu peux le remplacer par un handler Redis.

**Les handlers disponibles** :

| Handler | Stockage | Performance | Partage |
| ------- | -------- | ----------- | ------- |
| `session.handler.native_file` | Fichiers `/tmp` | Moyen | Non |
| `RedisSessionHandler` | Redis | Rapide | Oui |
| `PdoSessionHandler` | Base de données | Lent | Oui |
| `MemcachedSessionHandler` | Memcached | Rapide | Oui |

**Comparaison fichiers vs Redis pour les sessions** :

| Critère | Fichiers | Redis |
| ------- | -------- | ----- |
| Vitesse de lecture | ~1 ms (disque) | ~0.1 ms (RAM) |
| Partage multi-serveurs | Non | Oui |
| Nettoyage des sessions expirées | Garbage collection PHP | Automatique (TTL) |
| Persistance au redémarrage PHP | Dépend du volume | Oui (AOF/RDB) |
| Complexité de mise en place | Aucune (par défaut) | Configuration requise |

---

### Sécurité des sessions

**Définition** : Les sessions contiennent des données sensibles (identité de l'utilisateur, rôle, etc.). Il est important de les sécuriser.

**Mesures de sécurité** :

| Mesure | Description | Configuration |
| ------ | ----------- | ------------- |
| Cookie secure | Le cookie de session n'est envoyé que sur HTTPS | `cookie_secure: auto` |
| Cookie httponly | Le cookie n'est pas accessible via JavaScript | `cookie_httponly: true` |
| Cookie samesite | Protection contre les attaques CSRF | `cookie_samesite: lax` |
| Durée de vie limitée | La session expire après un temps d'inactivité | `gc_maxlifetime: 1800` |
| Régénération d'ID | L'ID de session est renouvelé après le login | Automatique avec Symfony |

**Redis et sécurité** :

Redis n'ajoute pas de risque de sécurité supplémentaire par rapport aux fichiers, à condition que le serveur Redis ne soit pas accessible depuis l'extérieur. Dans un environnement Docker, Redis n'est accessible que par les services du même réseau Docker.

---

## Étapes Pratiques

### Étape 1 : Vérifier la configuration actuelle des sessions

Avant de passer à Redis, vérifie comment les sessions sont actuellement configurées dans ton projet Symfony :

```bash
# Affiche la configuration actuelle des sessions
php bin/console debug:config framework session
```

**Résultat attendu (configuration par défaut)** :

```yaml
framework:
    session:
        handler_id: null  # Utilise le handler natif PHP (fichiers)
        cookie_secure: auto
        cookie_samesite: lax
        storage_factory_id: session.storage.factory.native
```

---

### Étape 2 : Configurer la connexion Redis pour les sessions

Ajoute l'URL Redis dans le fichier `.env` si ce n'est pas déjà fait :

```env
# .env
REDIS_URL=redis://redis:6379
```

---

### Étape 3 : Configurer le handler de session Redis

Modifie la configuration des sessions dans Symfony :

```yaml
# config/packages/framework.yaml
framework:
    session:
        # Utilise Redis comme handler de session
        handler_id: Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler

        # Durée de vie de la session côté serveur (en secondes)
        # 1800 secondes = 30 minutes d'inactivité
        gc_maxlifetime: 1800

        # Durée de vie du cookie côté navigateur (en secondes)
        # 0 = le cookie expire quand le navigateur est fermé
        cookie_lifetime: 0

        # Sécurité du cookie
        cookie_secure: auto       # HTTPS automatique en production
        cookie_httponly: true      # Pas accessible via JavaScript
        cookie_samesite: lax      # Protection CSRF
```

---

### Étape 4 : Déclarer le service RedisSessionHandler

Déclare le handler comme un service Symfony :

```yaml
# config/services.yaml
services:
    # Connexion Redis pour les sessions
    Redis:
        # Crée une instance de la classe Redis (extension PHP)
        # ou Predis\Client si tu utilises Predis
        class: Redis
        calls:
            # Connecte au serveur Redis
            - connect:
                - '%env(REDIS_HOST)%'  # Hôte Redis
                - '%env(int:REDIS_PORT)%'  # Port Redis

    # Alternative avec Predis (si tu utilises predis/predis)
    # Redis:
    #     class: Predis\Client
    #     arguments:
    #         - '%env(REDIS_URL)%'

    # Handler de session Redis
    Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler:
        arguments:
            # Instance de connexion Redis
            - '@Redis'
            # Options du handler
            - prefix: 'sf_session:'  # Préfixe des clés de session dans Redis
              ttl: 1800              # TTL des sessions en secondes (30 min)
```

Ajoute les variables d'environnement pour la connexion Redis :

```env
# .env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
```

**Alternative simplifiée** (avec `framework.yaml` seulement, sans déclarer le service manuellement) :

```yaml
# config/packages/framework.yaml
framework:
    session:
        handler_id: '%env(REDIS_URL)%'
        gc_maxlifetime: 1800
        cookie_secure: auto
        cookie_httponly: true
        cookie_samesite: lax
```

Cette syntaxe simplifiée utilise le DSN Redis directement. Symfony crée automatiquement le handler.

**Note** : N'ajoute pas `/session` après le DSN. Dans un DSN Redis (`redis://redis:6379`), le chemin indique le numéro de base de données (0 à 15), pas un préfixe de clé. La syntaxe `%env(REDIS_URL)%/session` est invalide et peut provoquer une erreur de configuration ou utiliser une base de données inattendue. Si tu veux isoler les sessions, configure un préfixe dans le service `RedisSessionHandler` (voir l'exemple principal de cette fiche).

---

### Étape 5 : Tester la configuration

Redémarre les services et vérifie que les sessions fonctionnent :

```bash
# Redémarre les conteneurs
cd ~/redis-lab && docker compose restart
```

```bash
# Vide le cache Symfony pour prendre en compte la nouvelle configuration
docker compose exec php php bin/console cache:clear
```

```bash
# Vérifie la configuration des sessions
docker compose exec php php bin/console debug:config framework session
```

**Résultat attendu** :

```yaml
framework:
    session:
        handler_id: Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler
        gc_maxlifetime: 1800
        cookie_secure: auto
        cookie_httponly: true
        cookie_samesite: lax
```

---

### Étape 6 : Vérifier les sessions dans Redis

Connecte-toi à un page de ton application qui crée une session (par exemple, une page de login), puis vérifie dans Redis :

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli
```

```bash
# Liste les clés de session (dev uniquement : KEYS bloque Redis)
# En production, préfère : SCAN 0 MATCH sf_session:* COUNT 100
KEYS sf_session:*
# 1) "sf_session:abc123def456..."

# Vérifie le TTL d'une session
TTL "sf_session:abc123def456..."
# (integer) 1798 (environ 30 minutes)

# Vérifie le type de la clé
TYPE "sf_session:abc123def456..."
# string

# Voir le contenu (les données de session sont sérialisées)
GET "sf_session:abc123def456..."
# (données binaires sérialisées PHP - ne pas modifier manuellement)

# Compte le nombre de sessions actives
KEYS sf_session:*
# (montre toutes les sessions)

# Quitte
QUIT
```

---

### Étape 7 : Utiliser les sessions dans un contrôleur

Voici comment utiliser les sessions dans un contrôleur Symfony (aucun changement par rapport aux sessions fichiers) :

```php
<?php
// src/Controller/CartController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;

class CartController extends AbstractController
{
    #[Route('/cart', name: 'cart_show')]
    public function show(Request $request): Response
    {
        // Récupère la session depuis la requête
        $session = $request->getSession();

        // Lit une valeur de la session (retourne [] si la clé n'existe pas)
        $cart = $session->get('cart', []);

        return $this->render('cart/show.html.twig', [
            'cart' => $cart,
        ]);
    }

    #[Route('/cart/add/{productId}', name: 'cart_add')]
    public function add(int $productId, Request $request): Response
    {
        $session = $request->getSession();

        // Récupère le panier actuel (ou un tableau vide)
        $cart = $session->get('cart', []);

        // Ajoute le produit au panier
        if (isset($cart[$productId])) {
            // Si le produit est déjà dans le panier, incrémente la quantité
            $cart[$productId]++;
        } else {
            // Sinon, ajoute-le avec une quantité de 1
            $cart[$productId] = 1;
        }

        // Sauvegarde le panier dans la session
        // Cette opération écrit dans Redis automatiquement
        $session->set('cart', $cart);

        return $this->redirectToRoute('cart_show');
    }

    #[Route('/cart/clear', name: 'cart_clear')]
    public function clear(Request $request): Response
    {
        $session = $request->getSession();

        // Supprime la clé 'cart' de la session
        $session->remove('cart');

        return $this->redirectToRoute('cart_show');
    }
}
```

**Point important** : Le code du contrôleur est identique que tu utilises des fichiers ou Redis. C'est la force de l'abstraction Symfony. Tu changes uniquement la configuration, pas le code.

---

### Étape 8 : Configurer la durée de session par environnement

Tu peux avoir des durées de session différentes selon l'environnement :

```yaml
# config/packages/framework.yaml (configuration par défaut)
framework:
    session:
        handler_id: '%env(REDIS_URL)%'
        gc_maxlifetime: 1800      # 30 minutes
        cookie_secure: auto
        cookie_httponly: true
        cookie_samesite: lax
```

```yaml
# config/packages/dev/framework.yaml (développement)
framework:
    session:
        gc_maxlifetime: 86400     # 24 heures (pour ne pas être déconnecté pendant le dev)
```

```yaml
# config/packages/prod/framework.yaml (production)
framework:
    session:
        gc_maxlifetime: 1800      # 30 minutes (sécurité)
        cookie_secure: true       # Force HTTPS
```

---

### Étape 9 : Surveiller les sessions

Crée une commande Symfony pour surveiller les sessions actives :

```php
<?php
// src/Command/SessionStatsCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:session:stats',
    description: 'Affiche les statistiques des sessions actives dans Redis',
)]
class SessionStatsCommand extends Command
{
    public function __construct(
        private \Redis $redis,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Compte les clés de session dans Redis
        $cursor = null;
        $count = 0;
        $ttls = [];

        // Utilise SCAN pour parcourir les clés sans bloquer Redis
        do {
            // phpredis : scan() met à jour $cursor par référence et
            // retourne un tableau de clés (false si aucune clé)
            $result = $this->redis->scan($cursor, 'sf_session:*', 100);

            if ($result !== false) {
                foreach ($result as $key) {
                    $count++;
                    $ttl = $this->redis->ttl($key);
                    if ($ttl > 0) {
                        $ttls[] = $ttl;
                    }
                }
            }
        } while ($cursor > 0);

        $io->title('Statistiques des sessions');
        $io->listing([
            "Sessions actives : {$count}",
            'TTL moyen : ' . ($count > 0 ? round(array_sum($ttls) / count($ttls)) . ' secondes' : 'N/A'),
            'TTL minimum : ' . ($count > 0 ? min($ttls) . ' secondes' : 'N/A'),
            'TTL maximum : ' . ($count > 0 ? max($ttls) . ' secondes' : 'N/A'),
        ]);

        return Command::SUCCESS;
    }
}
```

```bash
# Exécute la commande
php bin/console app:session:stats
```

**Résultat attendu** :

```text
Statistiques des sessions
=========================

 * Sessions actives : 3
 * TTL moyen : 1650 secondes
 * TTL minimum : 1200 secondes
 * TTL maximum : 1800 secondes
```

---

### Étape 10 : Forcer la déconnexion d'un utilisateur

Pour forcer la déconnexion d'un utilisateur, supprime sa session dans Redis :

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli
```

```bash
# Trouve la session de l'utilisateur
# (tu dois connaître l'ID de session, visible dans le cookie PHPSESSID du navigateur)
KEYS sf_session:*
# 1) "sf_session:abc123"
# 2) "sf_session:def456"
# 3) "sf_session:ghi789"

# Supprime une session spécifique
DEL sf_session:abc123
# (integer) 1

# Pour forcer la déconnexion de TOUS les utilisateurs :
# ⚠️ À utiliser avec précaution
# Supprime toutes les sessions
# (utilise un script ou SCAN + DEL pour ne supprimer que les sessions)
```

**Méthode avec SCAN (recommandée)** :

```bash
# Parcours les clés de session et supprime-les une par une
# Cette commande est un exemple, pas une commande Redis native
# En pratique, tu utiliserais un script Lua ou une commande Symfony

# Depuis redis-cli, tu peux utiliser :
SCAN 0 MATCH sf_session:* COUNT 100
# Puis DEL sur chaque clé retournée
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:config framework session` | Affiche la configuration des sessions |
| `php bin/console cache:clear` | Vide le cache Symfony |
| `KEYS sf_session:*` | Liste les sessions (dev uniquement ; en prod préfère SCAN) |
| `TTL sf_session:xxx` | TTL d'une session |
| `DEL sf_session:xxx` | Supprime une session (déconnexion) |

---

## Pièges Fréquents

### Piège 1 : Oublier de configurer le TTL des sessions

⚠️ **Problème** : Tu ne configures pas `gc_maxlifetime` ni le TTL dans le handler Redis. Les sessions n'expirent jamais et Redis se remplit progressivement.

✅ **Solution** : Configure toujours un TTL pour les sessions. Une bonne valeur par défaut est 1800 secondes (30 minutes) :

```yaml
framework:
    session:
        gc_maxlifetime: 1800  # 30 minutes
```

---

### Piège 2 : Tester avec des sessions fichiers en développement et Redis en production

⚠️ **Problème** : Tu utilises des fichiers en développement et Redis en production. Un bug lié aux sessions ne sera découvert qu'en production.

✅ **Solution** : Utilise Redis dans tous les environnements (dev, staging, production) pour détecter les problèmes le plus tôt possible. Docker rend cela facile.

---

### Piège 3 : Stocker de gros objets dans la session

⚠️ **Problème** : Tu stockes des objets volumineux dans la session (listes de produits, résultats de requêtes). Chaque requête HTTP lit et écrit toute la session. Plus la session est grosse, plus c'est lent.

✅ **Solution** : Garde la session légère. Stocke uniquement les identifiants et les flags. Utilise le cache (pas la session) pour les données volumineuses.

```php
// ❌ Session trop volumineuse
$session->set('products', $productRepository->findAll());

// ✅ Session légère - stocke uniquement les IDs
$session->set('cart', [42 => 2, 55 => 1]);
// Puis récupère les produits depuis le cache ou la base quand c'est nécessaire
```

---

### Piège 4 : Redis non disponible = site inaccessible

⚠️ **Problème** : Si Redis tombe en panne, aucune session ne peut être créée ou lue. Le site entier devient inaccessible pour les utilisateurs connectés.

✅ **Solution** : En production, utilise Redis en mode Sentinel ou Cluster pour la haute disponibilité. En développement, assure-toi que Redis démarre avec ton `docker compose up`.

```yaml
# docker-compose.yml - Redis démarre avant PHP
services:
    php:
        depends_on:
            - redis
    redis:
        image: redis:7-alpine
        restart: unless-stopped
```

---

### Piège 5 : RedisSessionHandler sans verrouillage de session

⚠️ **Problème** : `RedisSessionHandler` de Symfony **ne verrouille pas** la session. Si deux requêtes concurrentes (par exemple des appels JavaScript en parallèle) écrivent la session en même temps, tu peux perdre des données. Un symptôme fréquent est une erreur de type "Invalid CSRF token".

✅ **Solution** :

- Évite d'écrire massivement en session pendant des requêtes parallèles
- Pour un verrouillage de session côté Redis, utilise le handler natif PHP via `php.ini` (`session.save_handler = redis`) plutôt que `RedisSessionHandler` seul
- En production multi-onglets / API concurrente, teste explicitement les courses d'écriture sur la session

Documentation officielle Symfony : `RedisSessionHandler` does not perform session locking.

---

### Piège 6 : Confondre le préfixe de session et le préfixe de cache

⚠️ **Problème** : Les sessions et le cache utilisent le même Redis sans préfixe. Tu fais un `FLUSHDB` pour vider le cache et tu supprimes aussi toutes les sessions (déconnexion de tous les utilisateurs).

✅ **Solution** : Utilise des préfixes différents pour les sessions et le cache :

```yaml
# Sessions avec préfixe sf_session:
Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler:
    arguments:
        - '@Redis'
        - prefix: 'sf_session:'

# Cache avec préfixe sf_cache: (configuré dans cache.yaml)
# Symfony ajoute automatiquement un préfixe au cache
```

Tu peux aussi utiliser des bases de données Redis séparées :

```text
Base 0 → Cache applicatif
Base 1 → Sessions
```

---

## Checklist de Validation

- [ ] Je comprends les limites du stockage des sessions en fichiers
- [ ] J'ai configuré Redis comme handler de session dans Symfony
- [ ] Je sais vérifier les sessions dans Redis avec redis-cli
- [ ] Le code de mes contrôleurs n'a pas changé (abstraction Symfony)
- [ ] Je comprends l'importance du TTL pour les sessions
- [ ] Je sais forcer la déconnexion d'un utilisateur en supprimant sa session Redis
- [ ] Je garde mes sessions légères (IDs et flags, pas d'objets volumineux)
- [ ] Je sais configurer la sécurité des cookies de session

---

## Exercice Pratique

**Énoncé** : Configure les sessions Redis dans un projet Symfony et implémente un panier d'achat simple.

**Indications** :

- Configure le handler de session Redis dans ton projet
- Crée un `CartController` avec les actions :
  - `show` : affiche le contenu du panier (depuis la session)
  - `add(productId)` : ajoute un produit au panier
  - `remove(productId)` : retire un produit du panier
  - `clear` : vide le panier
- Vérifie dans Redis que les sessions sont créées
- Vérifie que le TTL est correct
- Ouvre un deuxième navigateur (ou une fenêtre privée) et vérifie que chaque navigateur a sa propre session
- Supprime une session dans Redis et vérifie que l'utilisateur est déconnecté

**Résultat attendu** : Le panier fonctionne avec des sessions stockées dans Redis. Chaque navigateur a sa propre session indépendante.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Configuration :

```yaml
# config/packages/framework.yaml
framework:
    session:
        handler_id: '%env(REDIS_URL)%'
        gc_maxlifetime: 1800
        cookie_secure: auto
        cookie_httponly: true
        cookie_samesite: lax
```

```env
# .env
REDIS_URL=redis://redis:6379
```

Contrôleur :

```php
<?php
// src/Controller/CartController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/cart')]
class CartController extends AbstractController
{
    #[Route('', name: 'cart_show')]
    public function show(Request $request): Response
    {
        $session = $request->getSession();
        $cart = $session->get('cart', []);

        return $this->render('cart/show.html.twig', [
            'cart' => $cart,
            'total' => array_sum($cart),
        ]);
    }

    #[Route('/add/{productId}', name: 'cart_add')]
    public function add(int $productId, Request $request): Response
    {
        $session = $request->getSession();
        $cart = $session->get('cart', []);

        // Incrémente la quantité ou ajoute avec quantité 1
        $cart[$productId] = ($cart[$productId] ?? 0) + 1;

        $session->set('cart', $cart);

        $this->addFlash('success', "Produit {$productId} ajouté au panier.");

        return $this->redirectToRoute('cart_show');
    }

    #[Route('/remove/{productId}', name: 'cart_remove')]
    public function remove(int $productId, Request $request): Response
    {
        $session = $request->getSession();
        $cart = $session->get('cart', []);

        // Supprime le produit du panier
        unset($cart[$productId]);

        $session->set('cart', $cart);

        $this->addFlash('success', "Produit {$productId} retiré du panier.");

        return $this->redirectToRoute('cart_show');
    }

    #[Route('/clear', name: 'cart_clear')]
    public function clear(Request $request): Response
    {
        $session = $request->getSession();
        $session->remove('cart');

        $this->addFlash('success', 'Panier vidé.');

        return $this->redirectToRoute('cart_show');
    }
}
```

Template :

```html
{# templates/cart/show.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Mon Panier{% endblock %}

{% block body %}
    <h1>Mon Panier</h1>

    {% for message in app.flashes('success') %}
        <div class="alert alert-success">{{ message }}</div>
    {% endfor %}

    {% if cart is empty %}
        <p>Le panier est vide.</p>
    {% else %}
        <table>
            <thead>
                <tr>
                    <th>Produit ID</th>
                    <th>Quantité</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {% for productId, quantity in cart %}
                    <tr>
                        <td>{{ productId }}</td>
                        <td>{{ quantity }}</td>
                        <td>
                            <a href="{{ path('cart_remove', {productId: productId}) }}">
                                Retirer
                            </a>
                        </td>
                    </tr>
                {% endfor %}
            </tbody>
        </table>

        <p>Total d'articles : {{ total }}</p>

        <a href="{{ path('cart_clear') }}">Vider le panier</a>
    {% endif %}
{% endblock %}
```

Vérification dans Redis :

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli

# Après avoir visité /cart/add/42
KEYS sf_session:*
# 1) "sf_session:abc123..."

TTL "sf_session:abc123..."
# (integer) ~1800

# Supprime la session pour forcer la déconnexion
DEL "sf_session:abc123..."
# (integer) 1

# Rafraîchis la page - une nouvelle session est créée (panier vide)

QUIT
```

---

## Navigation

← Fiche précédente : **[Redis dans Symfony - Cache](04-redis-symfony-cache.md)**

→ Fiche suivante : **[Stratégies de cache](06-strategies-cache.md)**
