---
tags:
  - Architecture
  - Avancé
  - Sécurité
description: "Multi-tenancy : isoler les données de plusieurs clients dans une même application. Stratégies (base, schéma, colonne) et pièges d'isolation."
estimated_time: "75 min"
fiche_number: 12
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 12 - Multi-tenancy : isoler les données par client

> **En bref** : Quand une seule application sert plusieurs clients (ou organisations, sites, équipes) avec des données strictement isolées, on parle de multi-tenancy. Cette fiche compare les trois stratégies d'isolation et montre comment éviter les fuites de données entre tenants. Lecture estimée : 75 min.

## Prérequis

- Fiche 8 : [Clean Architecture](08-clean-architecture.md)
- Cursus PostgreSQL (`04-postgresql/`, au moins les fiches 1 à 5)
- Cursus Symfony (notion de Repository et de RequestStack)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir la stratégie de multi-tenancy adaptée à ton contexte, l'implémenter en Symfony avec Doctrine, et identifier les zones du code où une fuite inter-tenant pourrait se produire.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le multi-tenancy ?

**Définition** : Le multi-tenancy est un modèle d'architecture où une seule instance d'application sert plusieurs clients (appelés tenants), tout en garantissant que les données de chaque tenant restent strictement isolées des autres.

**Le problème que le multi-tenancy résout** :

Sans multi-tenancy, voici les problèmes rencontrés :

1. **Coût d'infrastructure élevé** : il faut déployer une instance complète par client, multiplier les bases de données, les serveurs et les processus de déploiement.
2. **Maintenance multipliée** : chaque mise à jour doit être déployée sur des dizaines (ou des centaines) d'instances séparées.
3. **Pas de mutualisation** : aucune ressource n'est partagée, ce qui gaspille la mémoire, le CPU et le stockage.

**Comment le multi-tenancy résout ces problèmes** :

| Problème | Solution apportée par le multi-tenancy |
| --- | --- |
| Coût d'infrastructure élevé | Une seule instance sert tous les tenants |
| Maintenance multipliée | Une seule mise à jour pour tous |
| Pas de mutualisation | CPU, mémoire et stockage partagés |

**Analogie concrète** : Pense à un immeuble avec plusieurs locataires. L'immeuble est partagé (structure, ascenseur, chauffage central), mais chaque locataire a sa propre clé, son propre palier et son propre courrier. Personne ne peut entrer dans l'appartement d'un autre. Le bâtiment fonctionne comme une seule construction, mais les vies privées restent séparées.

**Ce que le multi-tenancy n'est PAS** :

- Le multi-tenancy n'est pas du multi-instance. Le multi-instance déploie une application complète par client (une base de données, un processus, un domaine séparés). Le multi-tenancy partage une seule instance entre tous.
- Le multi-tenancy n'est pas du sharding. Le sharding découpe une base unique en plusieurs morceaux pour répartir la charge ou les données, sans préoccupation d'isolation entre clients.

**Comparaison multi-tenancy vs multi-instance** :

| Multi-tenancy | Multi-instance |
| --- | --- |
| Une instance pour tous les clients | Une instance par client |
| Coût mutualisé | Coût multiplié par le nombre de clients |
| Mise à jour centralisée | Mise à jour par client |
| Isolation logique (à concevoir) | Isolation physique (par défaut) |

---

### Qu'est-ce que la stratégie « base de données par tenant » ?

**Définition** : Chaque tenant possède sa propre base de données. L'application choisit la base à interroger en fonction du tenant courant.

**Le problème que cette stratégie résout** :

1. **Risque de fuite inter-tenant** : impossible techniquement qu'une requête sur la base du tenant A retourne des données du tenant B.
2. **Conformité réglementaire stricte** : certains secteurs (santé, finance) exigent une séparation physique des données.
3. **Backup et restauration par client** : on peut sauvegarder ou restaurer la base d'un tenant sans toucher aux autres.

**Comment cette stratégie résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Risque de fuite | Isolation physique : pas de chemin d'accès commun |
| Conformité réglementaire | Chaque base peut être chiffrée et hébergée séparément |
| Backup par client | Une commande `pg_dump` par base, indépendamment |

**Analogie concrète** : Pense à des coffres-forts séparés dans une banque. Chaque client a son coffre, et même les employés ne peuvent ouvrir qu'un coffre à la fois. Si un coffre est compromis, les autres restent fermés.

**Ce que cette stratégie n'est PAS** :

- Ce n'est pas la solution par défaut. Elle apporte une isolation forte au prix d'une complexité opérationnelle élevée (déploiement, migrations, surveillance).
- Ce n'est pas adapté aux applications avec des centaines ou des milliers de tenants. Le coût de gestion explose au-delà de quelques dizaines de bases.

**Inconvénients** :

| Inconvénient | Détail |
| --- | --- |
| Coût d'infrastructure | Une base = un coût (RAM, disque, licence selon le SGBD) |
| Migrations à répliquer | Chaque changement de schéma s'exécute sur chaque base |
| Complexité opérationnelle | Monitoring, backup, alerting multipliés par le nombre de tenants |
| Recherche cross-tenant difficile | Agréger des statistiques globales nécessite de requêter toutes les bases |

---

### Qu'est-ce que la stratégie « schéma par tenant » ?

**Définition** : Tous les tenants partagent un seul serveur de base de données et une seule base, mais chacun possède son propre schéma (au sens PostgreSQL : un namespace contenant ses propres tables).

**Le problème que cette stratégie résout** :

1. **Coût plus faible que la base par tenant** : un seul cluster PostgreSQL héberge tous les schémas.
2. **Isolation forte** : les tables sont physiquement séparées dans des schémas distincts.
3. **Objets globaux partageables** : les rôles, extensions et fonctions communes restent à la racine.

**Comment cette stratégie résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Coût trop élevé de la stratégie 1 | Un seul cluster, plusieurs schémas |
| Besoin d'isolation forte | Chaque tenant a ses propres tables nommées `tenant_a.documents`, `tenant_b.documents` |
| Partage de fonctions communes | Schéma `public` partagé pour les utilitaires |

**Analogie concrète** : Pense à un immeuble où chaque locataire a son appartement (schéma), mais où l'ascenseur, l'eau et le chauffage (objets globaux) sont communs. Chaque locataire range ses affaires dans son appartement, sans interférer avec les autres.

**Ce que cette stratégie n'est PAS** :

- Ce n'est pas équivalent à la stratégie 1. Les schémas partagent le même processus PostgreSQL et le même cache : un tenant qui consomme beaucoup de ressources affecte les autres.
- Ce n'est pas trivial à mettre en place avec Doctrine. Le mapping multi-schéma demande une configuration manuelle (changement de search_path par requête).

**Inconvénients** :

| Inconvénient | Détail |
| --- | --- |
| Limite du nombre de schémas | PostgreSQL gère bien jusqu'à quelques centaines de schémas, au-delà la performance se dégrade |
| Migrations centralisées mais complexes | Une migration doit s'appliquer à chaque schéma, généralement via une boucle |
| Configuration Doctrine spécifique | Le `search_path` doit changer dynamiquement selon le tenant |
| Pas d'isolation des ressources serveur | Un tenant lourd ralentit tous les autres |

---

### Qu'est-ce que la stratégie « colonne tenant_id partagée » ?

**Définition** : Toutes les tables métier comportent une colonne `tenant_id` qui identifie le propriétaire de chaque ligne. Une seule base, un seul schéma, des tables partagées. L'isolation repose sur des filtres applicatifs systématiques.

**Le problème que cette stratégie résout** :

1. **Coût d'infrastructure minimal** : une seule base, un seul schéma, un seul processus.
2. **Scalabilité horizontale facile** : les outils standards (réplication, partitionnement, indexation) fonctionnent sans adaptation.
3. **Recherche cross-tenant simple** : une requête sans filtre `tenant_id` agrège toutes les données.

**Comment cette stratégie résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Coût élevé | Une seule base pour tous |
| Scalabilité | Index, réplication et partitionnement standard |
| Statistiques globales | Requête SQL classique sans gestion multi-base |

**Analogie concrète** : Pense à un dortoir partagé où chaque lit porte une étiquette avec le nom du dormeur. Tout le monde partage la pièce, mais chacun ne touche qu'à ses propres affaires. La discipline (filtrer par étiquette) est la seule garantie d'ordre.

**Ce que cette stratégie n'est PAS** :

- Ce n'est pas une isolation physique. Les données de tous les tenants cohabitent dans les mêmes tables. Une requête mal écrite peut tout lire.
- Ce n'est pas la stratégie la plus sûre. Elle est la plus économique, mais la plus exposée aux fuites par bug ou oubli.

**Inconvénients** :

| Inconvénient | Détail |
| --- | --- |
| Isolation par convention | Tout repose sur les filtres applicatifs, jamais oubliés |
| Risque de fuite si filtre oublié | Une seule requête sans `WHERE tenant_id = ?` expose tout |
| Index obligatoires | Sans index sur `tenant_id`, les performances s'effondrent |
| Backup par tenant complexe | Il faut filtrer manuellement par `tenant_id` pour extraire un tenant |

---

### Tableau comparatif global des trois stratégies

| Critère | DB par tenant | Schéma par tenant | Colonne partagée |
| --- | --- | --- | --- |
| Isolation | Très forte | Forte | Par convention |
| Coût opérationnel | Élevé | Moyen | Faible |
| Performance | Variable | Bonne | Très bonne |
| Migrations | À répliquer | Centralisées | Centralisées |
| Risque de fuite | Quasi nul | Faible | Élevé sans contrôle |
| Backup par tenant | Trivial | Possible | Complexe |
| Nombre de tenants supporté | Dizaines | Centaines | Millions |
| Complexité de mise en oeuvre | Élevée | Élevée | Faible |

---

### Quels sont les invariants à respecter ?

**Définition** : Un invariant est une règle qui doit toujours être vraie dans le système, à toutes les étapes. En multi-tenancy, les invariants garantissent l'isolation.

**Liste des invariants obligatoires** :

1. **Toute requête de lecture DOIT filtrer par tenant** : aucune méthode de Repository ne doit renvoyer de données sans avoir appliqué le filtre.
2. **Toute insertion DOIT renseigner le tenant_id** : la colonne `tenant_id` est `NOT NULL`, et la valeur provient du tenant courant.
3. **Aucune route ne DOIT exposer un tenant_id en paramètre libre** : le tenant courant est déduit de la session, du sous-domaine ou du token, jamais d'un paramètre que l'utilisateur peut modifier.
4. **Les filtres globaux DOIVENT être actifs par défaut** : si tu utilises un mécanisme de filtre Doctrine, il est activé dans le bootstrap, pas optionnellement.
5. **Chaque relation entre entités DOIT pointer vers une entité du même tenant** : un `Document` du tenant A ne doit jamais référencer une `Category` du tenant B.

**Analogie concrète** : Pense à une bibliothèque où chaque livre porte un code couleur correspondant à sa section. Les invariants sont les règles que tous les employés doivent suivre : « toujours ranger un livre rouge en section rouge », « ne jamais déplacer un livre vers une autre section », « toujours vérifier la couleur avant de placer ». Si un employé oublie une règle, le système s'effondre silencieusement.

**Ce que les invariants ne sont PAS** :

- Les invariants ne sont pas des bonnes pratiques optionnelles. Ce sont des règles dont la violation entraîne une faille de sécurité.
- Les invariants ne sont pas des commentaires dans le code. Ils doivent être appliqués par le code lui-même (Repository de base, filtres Doctrine, contraintes de base).

---

## Étapes Pratiques

Cette section présente la mise en oeuvre de la stratégie « colonne partagée », la plus courante dans les applications Symfony.

### Étape 1 : Créer l'entité Tenant

Cette étape crée l'entité qui représente un locataire de l'application.

Code de l'entité :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

// L'entité Tenant représente un client/organisation locataire de l'application
#[ORM\Entity]
#[ORM\Table(name: 'tenants')]
class Tenant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Le slug sert d'identifiant public et stable (ex : utilisé dans les URLs)
    #[ORM\Column(length: 64, unique: true)]
    private string $slug;

    // Nom lisible affiché dans l'interface
    #[ORM\Column(length: 128)]
    private string $name;

    public function __construct(string $slug, string $name)
    {
        $this->slug = $slug;
        $this->name = $name;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getName(): string
    {
        return $this->name;
    }
}
```

**Résultat attendu** :

```text
La table tenants existe avec 3 colonnes : id, slug (unique), name.
Chaque tenant a un identifiant interne (id) et un identifiant public (slug).
```

---

### Étape 2 : Ajouter une relation tenant sur chaque entité métier

Cette étape relie chaque entité de domaine au tenant qui la possède.

Code de l'entité `Document` :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'documents')]
// L'index composite (tenant_id, created_at) est crucial pour les performances
#[ORM\Index(columns: ['tenant_id', 'created_at'])]
class Document
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // La relation est NOT NULL : impossible de créer un document orphelin
    #[ORM\ManyToOne(targetEntity: Tenant::class)]
    #[ORM\JoinColumn(nullable: false)]
    private Tenant $tenant;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(type: 'text')]
    private string $content;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    // Le tenant est passé au constructeur : impossible d'instancier sans tenant
    public function __construct(Tenant $tenant, string $title, string $content)
    {
        $this->tenant = $tenant;
        $this->title = $title;
        $this->content = $content;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTenant(): Tenant
    {
        return $this->tenant;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
```

**Pourquoi passer le tenant au constructeur** : si la propriété `$tenant` n'avait pas de valeur par défaut et n'était pas obligatoire dans le constructeur, un développeur pourrait créer un `Document` sans tenant, contournant l'invariant 2.

**Résultat attendu** :

```text
La table documents a une colonne tenant_id NOT NULL avec une contrainte FK.
Tout document créé en mémoire ou persisté est obligatoirement rattaché à un tenant.
```

---

### Étape 3 : Récupérer le tenant courant via la requête

Cette étape crée un service qui retrouve le tenant à partir de la requête HTTP en cours.

Code du provider :

```php
<?php

namespace App\Tenant;

use App\Entity\Tenant;
use App\Repository\TenantRepository;
use Symfony\Component\HttpFoundation\RequestStack;

// Service centralisé pour récupérer le tenant actif
// Tous les autres services qui ont besoin du tenant passent par ici
class CurrentTenantProvider
{
    public function __construct(
        private RequestStack $requestStack,
        private TenantRepository $tenantRepository,
    ) {
    }

    public function getCurrent(): Tenant
    {
        $request = $this->requestStack->getCurrentRequest();

        // Cas particulier : aucune requête HTTP active (CLI, worker, etc.)
        // Le code appelant doit décider comment fournir le tenant dans ce cas
        if ($request === null) {
            throw new \DomainException('Pas de requête HTTP active');
        }

        // Le slug est extrait des attributs de la route
        // Exemple pedagogique : route '/{tenant_slug}/documents'
        // En production, ne pas faire confiance a un parametre d'URL seul :
        // lier le tenant a la session, au sous-domaine ou a un token (voir Piege 2)
        $slug = $request->attributes->get('tenant_slug');

        if ($slug === null) {
            throw new \DomainException('Aucun tenant identifié dans la requête');
        }

        $tenant = $this->tenantRepository->findOneBy(['slug' => $slug]);

        // Si le slug ne correspond à aucun tenant, on lève une exception
        // au lieu de retourner null : ainsi, aucun code appelant ne peut
        // continuer sans tenant valide
        if ($tenant === null) {
            throw new \DomainException("Tenant inconnu : {$slug}");
        }

        return $tenant;
    }
}
```

**Résultat attendu** :

```text
Une requête sur /agence-a/documents retourne le tenant dont le slug est 'agence-a'.
Une requête sur /inexistant/documents lève une exception DomainException.
Aucune méthode ne retourne null : l'appelant ne peut jamais oublier de vérifier.
```

---

### Étape 4 : Filtrer toutes les requêtes via un Repository de base

Cette étape garantit que toutes les méthodes de Repository métier filtrent automatiquement par tenant.

Code du Repository de base :

```php
<?php

namespace App\Repository;

use App\Tenant\CurrentTenantProvider;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

// Classe abstraite que tous les Repositories métier doivent étendre
// pour bénéficier du filtrage automatique par tenant
abstract class TenantAwareRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        string $entityClass,
        protected CurrentTenantProvider $tenantProvider,
    ) {
        parent::__construct($registry, $entityClass);
    }

    // Méthode utilitaire qui retourne un QueryBuilder
    // déjà filtré par le tenant courant
    protected function tenantAwareQueryBuilder(string $alias = 'e'): QueryBuilder
    {
        return $this->createQueryBuilder($alias)
            ->andWhere("{$alias}.tenant = :tenant")
            ->setParameter('tenant', $this->tenantProvider->getCurrent());
    }
}
```

Code du Repository métier :

```php
<?php

namespace App\Repository;

use App\Entity\Document;
use App\Tenant\CurrentTenantProvider;
use Doctrine\Persistence\ManagerRegistry;

class DocumentRepository extends TenantAwareRepository
{
    public function __construct(
        ManagerRegistry $registry,
        CurrentTenantProvider $tenantProvider,
    ) {
        parent::__construct($registry, Document::class, $tenantProvider);
    }

    // Toute méthode publique part du QueryBuilder filtré
    public function findAllForCurrentTenant(): array
    {
        return $this->tenantAwareQueryBuilder('d')
            ->orderBy('d.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByTitleForCurrentTenant(string $term): array
    {
        return $this->tenantAwareQueryBuilder('d')
            ->andWhere('d.title LIKE :term')
            ->setParameter('term', '%' . $term . '%')
            ->getQuery()
            ->getResult();
    }
}
```

**Règle stricte** : aucune méthode de Repository métier ne doit appeler `createQueryBuilder` directement. Toutes passent par `tenantAwareQueryBuilder`. Cette convention est vérifiable par revue de code ou par un outil d'analyse statique.

**Résultat attendu** :

```text
Toutes les requêtes générées par DocumentRepository contiennent
WHERE d.tenant = :tenant
Aucune fuite possible par oubli, car la classe parente impose le filtre.
```

---

### Étape 5 : Tester l'isolation entre tenants

Cette étape vérifie par un test fonctionnel que deux tenants ne peuvent pas voir les données l'un de l'autre.

Code du test :

```php
<?php

namespace App\Tests\Functional;

use App\Entity\Document;
use App\Entity\Tenant;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;

class TenantIsolationTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $em;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = static::getContainer()->get(EntityManagerInterface::class);
    }

    public function testTenantAdoesNotSeeTenantBDocuments(): void
    {
        // On crée deux tenants distincts
        $tenantA = $this->createTenant('agence-a', 'Agence A');
        $tenantB = $this->createTenant('agence-b', 'Agence B');

        // On crée un document pour le tenant B uniquement
        $this->createDocument($tenantB, 'Document confidentiel de B', 'Contenu sensible');

        // Le tenant A visite sa propre page de documents
        $this->client->request('GET', '/' . $tenantA->getSlug() . '/documents');

        static::assertResponseIsSuccessful();

        // Le document du tenant B ne doit jamais apparaître
        static::assertSelectorTextNotContains('body', 'Document confidentiel de B');
        static::assertSelectorTextNotContains('body', 'Contenu sensible');
    }

    private function createTenant(string $slug, string $name): Tenant
    {
        $tenant = new Tenant($slug, $name);
        $this->em->persist($tenant);
        $this->em->flush();

        return $tenant;
    }

    private function createDocument(Tenant $tenant, string $title, string $content): Document
    {
        $document = new Document($tenant, $title, $content);
        $this->em->persist($document);
        $this->em->flush();

        return $document;
    }
}
```

**Pourquoi ce test est obligatoire** : il vérifie en bout de chaîne, depuis la requête HTTP jusqu'au rendu, que l'isolation tient. Un test unitaire de Repository peut passer alors que la vue affiche encore des données croisées.

**Résultat attendu** :

```text
PHPUnit exécute le test, vérifie que la page du tenant A
ne contient ni le titre ni le contenu du document du tenant B.
Test : OK.
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| `php bin/console doctrine:database:create --connection=tenant_a` | Créer une base par tenant (stratégie 1) |
| `CREATE SCHEMA tenant_a` | Créer un schéma PostgreSQL (stratégie 2) |
| Filtre Doctrine (`SQLFilter`) | Filtrage transparent côté ORM (stratégie 3) |
| `CurrentTenantProvider` | Service centralisé pour le tenant actif |
| `php bin/console doctrine:migrations:migrate --em=tenant_a` | Migrer une base spécifique (stratégie 1) |
| `EXPLAIN ANALYZE SELECT * FROM documents WHERE tenant_id = 1` | Vérifier qu'un index sur `tenant_id` est bien utilisé |

---

## Pièges Fréquents

### Piège 1 : Filtrer côté contrôleur uniquement

⚠️ **Problème** : Tu places le filtre `tenant` dans le contrôleur, en appelant `$repository->findAll()` puis en filtrant manuellement le résultat. Si une seule route oublie le filtre, ou si un service interne appelle le Repository sans contrôleur, fuite immédiate.

✅ **Solution** : Filtrer au niveau le plus bas (Repository de base ou filtre Doctrine global). Le contrôleur ne doit jamais avoir à se soucier du tenant : c'est le Repository qui garantit l'isolation.

```php
<?php

// MAUVAIS : filtre dans le contrôleur, oublié dans 3 mois
public function list(): Response
{
    $all = $this->repository->findAll(); // récupère TOUT
    $filtered = array_filter($all, fn ($d) => $d->getTenant() === $current);

    return $this->render(...);
}

// BON : filtre dans le Repository, impossible à oublier
public function list(): Response
{
    $docs = $this->repository->findAllForCurrentTenant();

    return $this->render(...);
}
```

---

### Piège 2 : Récupérer le tenant via un paramètre URL non vérifié

⚠️ **Problème** : Tu utilises un paramètre `?tenant_id=42` ou un header `X-Tenant-Id` envoyé par le client. N'importe quel utilisateur peut modifier cette valeur pour accéder aux données d'un autre tenant.

✅ **Solution** : Lier le tenant à la session authentifiée, au sous-domaine ou à un token signé. Toujours vérifier que l'utilisateur connecté appartient bien au tenant ciblé.

```php
<?php

// MAUVAIS : tenant fourni par l'URL, manipulable
$tenantId = $request->query->get('tenant_id');

// BON : tenant déduit du sous-domaine, vérifié contre les droits utilisateur
$host = $request->getHost(); // ex : 'agence-a.example.com'
$slug = explode('.', $host)[0];
$tenant = $this->tenantRepository->findOneBy(['slug' => $slug]);

if (!$this->security->getUser()->belongsTo($tenant)) {
    throw new AccessDeniedException();
}
```

---

### Piège 3 : Migrations qui oublient `tenant_id NOT NULL`

⚠️ **Problème** : Lors de l'ajout du multi-tenancy à une application existante, la colonne `tenant_id` est ajoutée comme `nullable` pour ne pas casser les lignes existantes. Mais elle reste `nullable` ensuite, ce qui permet d'insérer des enregistrements orphelins échappant aux filtres.

✅ **Solution** : Migrer en trois étapes : ajouter la colonne nullable, remplir toutes les lignes existantes avec un tenant valide, puis appliquer la contrainte `NOT NULL`.

```sql
-- Étape 1 : ajouter la colonne (autorisée à NULL temporairement)
ALTER TABLE documents ADD COLUMN tenant_id INTEGER REFERENCES tenants(id);

-- Étape 2 : remplir les lignes existantes (script de migration de données)
UPDATE documents SET tenant_id = 1 WHERE tenant_id IS NULL;

-- Étape 3 : appliquer la contrainte NOT NULL (étape obligatoire)
ALTER TABLE documents ALTER COLUMN tenant_id SET NOT NULL;
```

---

### Piège 4 : Tests unitaires sans tenant

⚠️ **Problème** : Tu instancies une entité dans un test unitaire sans fournir de tenant (en passant un mock partiel ou en désactivant le constructeur). Le test passe, mais ne reflète pas la réalité où le tenant est obligatoire.

✅ **Solution** : Toujours instancier une entité avec un tenant réel (ou un fake explicite) dans les tests, même unitaires. Cela force le code de test à respecter les invariants.

```php
<?php

// MAUVAIS : on contourne le constructeur, le test ne reflète pas la réalité
$document = (new \ReflectionClass(Document::class))->newInstanceWithoutConstructor();

// BON : on fournit un tenant fake, le test reste fidèle au modèle
$fakeTenant = new Tenant('test', 'Test Tenant');
$document = new Document($fakeTenant, 'Titre', 'Contenu');
```

---

### Piège 5 : Index manquants sur tenant_id

⚠️ **Problème** : Toutes les requêtes contiennent `WHERE tenant_id = ?`, mais aucune table n'a d'index sur `tenant_id`. Quand un tenant a 10 000 lignes parmi 1 000 000 au total, chaque requête scanne toute la table.

✅ **Solution** : Ajouter systématiquement un index sur `tenant_id` ou, mieux, un index composite incluant les colonnes souvent filtrées avec.

```sql
-- Index simple : utile pour toutes les requêtes filtrées par tenant
CREATE INDEX idx_documents_tenant ON documents(tenant_id);

-- Index composite : encore mieux pour les requêtes triées par date
CREATE INDEX idx_documents_tenant_created
    ON documents(tenant_id, created_at DESC);
```

**Comment vérifier** : exécute `EXPLAIN ANALYZE` sur une requête réelle et confirme que l'index est utilisé (présence de `Index Scan` ou `Bitmap Index Scan`, absence de `Seq Scan`).

---

## Checklist de Validation

- [ ] Je sais distinguer les trois stratégies de multi-tenancy (base, schéma, colonne)
- [ ] Je sais identifier les cinq invariants à respecter dans un système multi-tenant
- [ ] Je sais récupérer le tenant courant depuis une requête HTTP via un service dédié
- [ ] Je sais filtrer toutes les requêtes Doctrine par tenant via un Repository de base
- [ ] Je sais écrire un test fonctionnel qui prouve l'isolation entre deux tenants
- [ ] Je connais les pièges courants (filtre oublié, paramètre manipulable, index manquant)
- [ ] Je sais migrer une application existante vers le multi-tenancy en trois étapes

---

## Exercice Pratique

**Énoncé** : Tu dois ajouter le multi-tenancy à une application existante qui gère des notes. L'entité `Note` contient `title`, `content` et `createdAt`. Trois agences utilisent l'application et leurs notes doivent être strictement isolées. Chaque agence accède à l'application via un sous-domaine dédié (`agence-a.example.com`, `agence-b.example.com`, `agence-c.example.com`).

**Indications** :

- Crée l'entité `Tenant` et la relation sur `Note`
- Implémente un `CurrentTenantProvider` qui récupère le tenant depuis le sous-domaine
- Modifie `NoteRepository` pour filtrer automatiquement par tenant via un Repository de base
- Écris un test fonctionnel qui prouve l'isolation entre deux agences

**Résultat attendu** : Une application où la même URL (`/notes`) renvoie un contenu différent selon le sous-domaine d'accès, et où un test automatisé prouve qu'aucune fuite n'est possible.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Entité `Tenant`** (identique à l'étape pratique 1, voir ci-dessus).

**Étape 2 : Entité `Note` avec relation tenant** :

```php
<?php

namespace App\Entity;

use App\Repository\NoteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NoteRepository::class)]
#[ORM\Table(name: 'notes')]
#[ORM\Index(columns: ['tenant_id', 'created_at'])]
class Note
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Tenant::class)]
    #[ORM\JoinColumn(nullable: false)]
    private Tenant $tenant;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(type: 'text')]
    private string $content;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $createdAt;

    public function __construct(Tenant $tenant, string $title, string $content)
    {
        $this->tenant = $tenant;
        $this->title = $title;
        $this->content = $content;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTenant(): Tenant
    {
        return $this->tenant;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
```

**Étape 3 : Provider basé sur le sous-domaine** :

```php
<?php

namespace App\Tenant;

use App\Entity\Tenant;
use App\Repository\TenantRepository;
use Symfony\Component\HttpFoundation\RequestStack;

class CurrentTenantProvider
{
    public function __construct(
        private RequestStack $requestStack,
        private TenantRepository $tenantRepository,
    ) {
    }

    public function getCurrent(): Tenant
    {
        $request = $this->requestStack->getCurrentRequest();

        if ($request === null) {
            throw new \DomainException('Pas de requête HTTP active');
        }

        // On extrait le sous-domaine du host
        // Exemple : 'agence-a.example.com' => 'agence-a'
        $host = $request->getHost();
        $parts = explode('.', $host);

        // Si le host n'a pas de sous-domaine (ex : 'example.com'), on refuse
        if (count($parts) < 3) {
            throw new \DomainException("Aucun sous-domaine tenant détecté dans : {$host}");
        }

        $slug = $parts[0];
        $tenant = $this->tenantRepository->findOneBy(['slug' => $slug]);

        if ($tenant === null) {
            throw new \DomainException("Tenant inconnu : {$slug}");
        }

        return $tenant;
    }
}
```

**Étape 4 : Repository de base et `NoteRepository`** :

```php
<?php

namespace App\Repository;

use App\Tenant\CurrentTenantProvider;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

abstract class TenantAwareRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        string $entityClass,
        protected CurrentTenantProvider $tenantProvider,
    ) {
        parent::__construct($registry, $entityClass);
    }

    protected function tenantAwareQueryBuilder(string $alias = 'e'): QueryBuilder
    {
        return $this->createQueryBuilder($alias)
            ->andWhere("{$alias}.tenant = :tenant")
            ->setParameter('tenant', $this->tenantProvider->getCurrent());
    }
}
```

```php
<?php

namespace App\Repository;

use App\Entity\Note;
use App\Tenant\CurrentTenantProvider;
use Doctrine\Persistence\ManagerRegistry;

class NoteRepository extends TenantAwareRepository
{
    public function __construct(
        ManagerRegistry $registry,
        CurrentTenantProvider $tenantProvider,
    ) {
        parent::__construct($registry, Note::class, $tenantProvider);
    }

    public function findAllForCurrentTenant(): array
    {
        return $this->tenantAwareQueryBuilder('n')
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
```

**Étape 5 : Test d'isolation** :

```php
<?php

namespace App\Tests\Functional;

use App\Entity\Note;
use App\Entity\Tenant;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class NoteIsolationTest extends WebTestCase
{
    public function testAgenceAdoesNotSeeAgenceBNotes(): void
    {
        $client = static::createClient();
        $em = static::getContainer()->get(EntityManagerInterface::class);

        // On crée deux tenants
        $agenceA = new Tenant('agence-a', 'Agence A');
        $agenceB = new Tenant('agence-b', 'Agence B');
        $em->persist($agenceA);
        $em->persist($agenceB);

        // On crée une note privée pour l'agence B
        $note = new Note($agenceB, 'Note privée de B', 'Information confidentielle');
        $em->persist($note);
        $em->flush();

        // On simule un accès via le sous-domaine de l'agence A
        $client->request('GET', '/notes', [], [], [
            'HTTP_HOST' => 'agence-a.example.com',
        ]);

        static::assertResponseIsSuccessful();
        static::assertSelectorTextNotContains('body', 'Note privée de B');
        static::assertSelectorTextNotContains('body', 'Information confidentielle');
    }
}
```

**Vérification** : ce test échoue si :

- Le `NoteRepository` n'étend pas `TenantAwareRepository`
- Le `CurrentTenantProvider` retourne un mauvais tenant
- Le contrôleur appelle `findAll()` au lieu de `findAllForCurrentTenant()`

Le test garantit donc que la chaîne complète d'isolation tient bien.

---

## Navigation

← Fiche précédente : **[Anti-patterns](11-anti-patterns.md)**

→ Fiche suivante : **[Soft delete](13-soft-delete.md)**
