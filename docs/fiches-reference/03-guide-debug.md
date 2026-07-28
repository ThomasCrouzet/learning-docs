---
tags:
  - Référence
  - Débutant
description: "Guide de Debug"
estimated_time: "45 min"
fiche_number: 3
total_fiches: 18
cursus: "Fiches de référence"
---

# Guide de Debug

> **En bref** : Guide de Debug. Lecture estimée : 45 min.

Fiche de référence pour débugger une application Symfony.

---

## La fonction dump()

**Usage** : Affiche le contenu d'une variable de manière lisible.

### Dans un contrôleur

```php
public function index(): Response
{
    $product = $repository->find(1);

    dump($product);  // Affiche dans la debug bar

    return $this->render('product/index.html.twig');
}
```

### Dans Twig

```twig
{# Affiche la variable dans la page #}
{{ dump(product) }}

{# Affiche toutes les variables disponibles #}
{{ dump() }}
```

### dump() et die (dd)

```php
// Affiche et arrête l'exécution
dd($product);

// Équivalent à :
dump($product);
die();
```

---

## Lire une erreur Symfony

### Structure d'une page d'erreur

```text
┌─────────────────────────────────────────┐
│ Type d'erreur (ex: TypeError)           │  ← 1. Type
├─────────────────────────────────────────┤
│ Message d'erreur                        │  ← 2. Message
│ "Argument #1 must be of type string..." │
├─────────────────────────────────────────┤
│ Fichier et ligne                        │  ← 3. Où
│ src/Controller/ProductController.php:42 │
├─────────────────────────────────────────┤
│ Stack trace                             │  ← 4. Comment on y est arrivé
│ ProductController->show()               │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Les 4 informations clés

| Information | Où la trouver | Ce qu'elle dit |
| ----------- | ------------- | -------------- |
| **Type** | Titre de l'erreur | La catégorie du problème |
| **Message** | Sous le titre | Ce qui ne va pas |
| **Fichier:ligne** | Dans le message | Où est le problème |
| **Stack trace** | En dessous | L'enchaînement d'appels |

---

## Erreurs courantes

### "Class not found"

```text
Class "App\Entity\Produit" not found
```

**Causes possibles** :

1. Nom de classe mal orthographié (`Produit` au lieu de `Product`)
2. Namespace incorrect
3. Fichier au mauvais endroit
4. Autoload pas régénéré après déplacement

**Solution** :

```bash
composer dump-autoload
```

---

### "Service not found"

```text
The service "App\Service\MonService" has a dependency on a non-existent service
```

**Causes possibles** :

1. Classe du service n'existe pas
2. Injection de dépendance incorrecte
3. Service non déclaré dans services.yaml

**Solution** :

```bash
php bin/console cache:clear
php bin/console debug:container MonService
```

---

### "Column not found"

```text
SQLSTATE[42703]: Undefined column: column "nom" does not exist
```

**Causes possibles** :

1. Colonne pas encore créée en base
2. Nom de propriété différent du nom de colonne
3. Migration pas exécutée

**Solution** :

```bash
php bin/console doctrine:schema:validate
php bin/console doctrine:migrations:migrate
```

---

### "Route not found"

```text
No route found for "GET /produits"
```

**Causes possibles** :

1. Route pas définie
2. Méthode HTTP incorrecte (GET vs POST)
3. Cache des routes pas à jour

**Solution** :

```bash
php bin/console cache:clear
php bin/console debug:router | grep produit
```

---

### "Template not found"

```text
Unable to find template "produit/index.html.twig"
```

**Causes possibles** :

1. Fichier template n'existe pas
2. Chemin incorrect (majuscules/minuscules)
3. Fichier au mauvais endroit

**Solution** : Vérifier que le fichier existe dans `templates/`

---

## La Symfony Debug Bar

La barre de debug apparaît en bas de page en mode `dev`.

### Sections utiles

| Icône | Information |
| ----- | ----------- |
| 🟢 200 | Code HTTP de la réponse |
| ⏱️ | Temps d'exécution |
| 💾 | Requêtes SQL (clic pour voir le détail) |
| 📝 | Logs |
| 🔧 | Configuration |
| 📧 | Emails (interceptés en dev) |

### Voir les requêtes SQL

1. Clique sur le nombre de requêtes dans la debug bar
2. Tu vois la liste des requêtes avec leur temps
3. Clique sur une requête pour voir le SQL complet

---

## Le Profiler Symfony

Accès : `/_profiler` ou clic sur la debug bar.

### Sections importantes

| Section | Contenu |
| ------- | ------- |
| Request | Paramètres GET/POST, headers |
| Doctrine | Toutes les requêtes SQL |
| Twig | Templates rendus, temps |
| Logs | Messages de log |
| Events | Événements déclenchés |
| Forms | Données des formulaires |

---

## Techniques de debug

### 1. Vérifier que le code est atteint

```php
dd('Je suis ici');  // Affiche et arrête
```

### 2. Inspecter une variable

```php
dump($maVariable);
```

### 3. Vérifier le type d'une variable

```php
dump(gettype($maVariable));
dump(get_class($maVariable));  // Pour les objets
```

### 4. Afficher une requête Doctrine

```php
$query = $repository->createQueryBuilder('p')
    ->where('p.price > :price')
    ->setParameter('price', 50)
    ->getQuery();

dump($query->getSQL());  // Voir le SQL
dump($query->getParameters());  // Voir les paramètres
```

### 5. Logger un message

```php
use Psr\Log\LoggerInterface;

public function __construct(private LoggerInterface $logger)
{
}

public function index(): Response
{
    $this->logger->info('Page index appelée');
    $this->logger->error('Une erreur est survenue', ['details' => $data]);
}
```

Les logs sont dans `var/log/dev.log`.

---

## Checklist de debug

Quand quelque chose ne fonctionne pas :

1. [ ] Lire le message d'erreur **en entier**
2. [ ] Identifier le fichier et la ligne
3. [ ] Vérifier le code à cette ligne
4. [ ] Utiliser `dump()` pour inspecter les variables
5. [ ] Vérifier la debug bar pour les requêtes SQL
6. [ ] Vider le cache : `php bin/console cache:clear`
7. [ ] Vérifier les logs Docker : `docker compose logs -f`

---

## Commandes de diagnostic

```bash
# Vérifier la configuration Symfony
php bin/console debug:config

# Vérifier les routes
php bin/console debug:router

# Vérifier les services
php bin/console debug:container

# Vérifier le schéma de base de données
php bin/console doctrine:schema:validate

# Vérifier les migrations
php bin/console doctrine:migrations:status

# Voir les logs Docker
docker compose logs -f php
```

---

## En cas de page blanche

1. Vérifier les logs PHP :

   ```bash
   docker compose logs php
   ```

2. Vérifier que `APP_ENV=dev` dans `.env`

3. Vider le cache :

   ```bash
   php bin/console cache:clear
   ```

4. Vérifier les permissions du dossier `var/` :

   ```bash
   chmod -R 777 var/
   ```

---

## Navigation

← Fiche précédente : **[Aide-mémoire Symfony](02-aide-memoire-symfony.md)**

→ Fiche suivante : **[Aide-mémoire PostgreSQL](04-aide-memoire-postgresql.md)**
