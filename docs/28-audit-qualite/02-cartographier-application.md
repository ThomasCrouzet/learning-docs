---
tags:
  - Audit
  - Méthodologie
  - Symfony
description: "Cartographier une application existante : méthodologie en 5 temps pour transformer du code inconnu en tableau actionnable de routes, contrôleurs et entités."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 6
cursus: "Audit et Qualité"
---

# 02 - Cartographier une application

> **En bref** : Une cartographie est un tableau structuré qui répond à "Que fait cette application, qui peut faire quoi, et où ?". Cette fiche te donne une méthode en cinq temps et des commandes prêtes à l'emploi pour produire le livrable en une journée. Lecture estimée : 75 min.

## Prérequis

- Fiche 1 : [Pourquoi auditer une application existante](01-pourquoi-auditer.md)
- Cursus Symfony (contrôleurs, routes, entités)
- Cursus 09-testing (notion de tests fonctionnels)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras produire un tableau de cartographie des routes d'une application Symfony, repérer les zones logiques (front public, back admin, transverses) et identifier les fonctionnalités qui méritent une attention particulière.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une cartographie ?

**Définition** : Une cartographie d'application est un tableau structuré qui associe chaque entrée du système (route, URL, point d'accès) à ce qu'elle déclenche (contrôleur, permissions, données touchées). Elle transforme du code inconnu en vue d'ensemble actionnable.

**Le problème que la cartographie résout** :

Sans cartographie, voici les problèmes rencontrés :

1. **Perte dans le code** : on ouvre un fichier au hasard, on suit des appels de méthode, on perd le fil et on oublie d'où l'on est parti.
2. **Zones oubliées** : on connaît bien la partie publique parce qu'on l'a vue, mais on ignore tout du back-office, des commandes en ligne, des écouteurs d'événements.
3. **Pas de base de décision** : impossible de répondre à "quelle zone tester en priorité ?" si on n'a pas de vue d'ensemble écrite.

**Comment la cartographie résout ces problèmes** :

| Problème | Solution apportée par la cartographie |
| --- | --- |
| Perte dans le code | Une vue tabulaire qui sert de point d'ancrage |
| Zones oubliées | Une grille exhaustive des points d'entrée |
| Pas de base de décision | Un document qu'on peut annoter et trier |

**Analogie concrète** : Pense à un plan d'évacuation affiché dans un bâtiment. Il ne décrit pas chaque pièce dans le détail, mais il indique où sont les issues, les extincteurs et les zones de rassemblement. Tu sais où aller sans avoir à explorer chaque couloir. Une cartographie d'application joue le même rôle pour un développeur qui découvre un projet.

**Ce qu'une cartographie n'est PAS** :

- Une cartographie n'est pas un diagramme UML exhaustif. L'objectif est la lisibilité, pas l'exactitude formelle.
- Une cartographie n'est pas une documentation utilisateur. Elle s'adresse aux développeurs qui interviennent sur le code.
- Une cartographie n'est pas un schéma d'architecture. Elle ne montre pas les couches techniques (base, cache, file d'attente), elle montre les points d'entrée et leurs effets.

---

### La méthodologie en cinq temps

**Définition** : Cartographier une application revient à répondre à cinq questions, dans l'ordre, pour chaque point d'entrée du système.

**Le problème que cette méthode résout** :

Sans méthode, on cartographie au hasard. On note la route, puis on oublie le rôle requis. On note le contrôleur, puis on oublie l'entité. Le tableau final est incomplet et difficile à exploiter.

**Détail des cinq temps** :

| Temps | Question | Sortie |
| --- | --- | --- |
| 1. Route | Quelle URL déclenche le code ? | URL + méthode HTTP |
| 2. Contrôleur | Quelle méthode est appelée ? | `FichierController::action` |
| 3. Permissions | Qui peut y accéder ? | Rôle requis ou `aucun` (public) |
| 4. Entités | Quelles données sont manipulées ? | Liste des entités lues / écrites |
| 5. Invariants | Qu'est-ce qui doit toujours être vrai ? | 1 à 3 invariants par fonctionnalité |

**Analogie concrète** : Pense à un guide touristique qui décrit une ville. Pour chaque lieu, il note l'adresse, le bâtiment, qui peut entrer, ce qu'on y trouve et la règle à respecter (pas de photo, silence, etc.). Cinq champs simples, répétés pour chaque lieu, produisent un guide complet et utilisable.

**Ce que cette méthode n'est PAS** :

- Ce n'est pas une séquence rigide. Tu peux passer d'un temps à l'autre selon ce que le code te révèle.
- Ce n'est pas un remplissage exhaustif. Les routes triviales (mentions légales, sitemap) peuvent rester sans invariants.

---

### Trois zones logiques typiques

**Définition** : La plupart des applications web se décomposent en trois zones logiques selon leur public et leurs risques : front public, back-office admin, et transverses.

**Le problème que ce découpage résout** :

Sans découpage, on traite toutes les routes de la même façon. On consacre autant de temps à `/mentions-legales` qu'à `/admin/utilisateurs/{id}/supprimer`, alors que les enjeux sont très différents.

**Détail des trois zones** :

| Zone | Public | Routes typiques | Risques principaux |
| --- | --- | --- | --- |
| Front public | Visiteurs / utilisateurs finaux | `/` , `/connexion`, `/{slug}/...` | Validation des entrées, anti-énumération |
| Back-office admin | Gestionnaires | `/admin/...` | Permissions, journalisation |
| Transverses | Tous | Sécurité, middleware, listeners | Comportement implicite, effets de bord |

**Analogie concrète** : Pense à un magasin. Il y a la partie ouverte au public (rayons, caisse), la partie réservée au personnel (réserve, bureau du gérant), et les éléments transverses (caméras de surveillance, alarme, climatisation). Chacune a ses propres règles et ses propres risques. Un audit qui les confond passe à côté de l'essentiel.

**Ce que ce découpage n'est PAS** :

- Ce n'est pas une règle universelle. Une API publique peut n'avoir aucun back-office, une application interne peut n'avoir aucun front public.
- Ce n'est pas une étiquette définitive. Une route peut basculer d'une zone à l'autre (passage d'une fonctionnalité bêta du back-office au front public).

---

### Niveau de granularité

**Définition** : La granularité d'une cartographie est le degré de détail qu'elle vise. Plus elle est fine, plus elle coûte cher à produire et à maintenir.

**Le problème que ce choix résout** :

Sans choix explicite, on dérive vers la cartographie exhaustive. On passe trois semaines à lister 400 routes sans jamais lire le code. La cartographie devient une fin en soi au lieu d'un outil de décision.

**Comparaison des trois granularités** :

| Granularité | Effort | Cas d'usage |
| --- | --- | --- |
| Très fin (chaque route) | 2 à 5 jours | Audit complet pour reprise majeure |
| Moyen (par bloc fonctionnel) | 1 jour | Audit de prise de poste |
| Macro (zones logiques) | 2 heures | Premier coup d'œil avant choix d'investissement |

**Analogie concrète** : Pense à un cartographe qui doit représenter un pays. Il choisit l'échelle selon l'usage : une carte routière (1 / 250 000) pour planifier un voyage, une carte de randonnée (1 / 25 000) pour une marche, un plan cadastral pour un acte notarié. Une seule échelle ne convient pas à tous les usages. Une cartographie d'application suit le même principe.

**Ce que cette gradation n'est PAS** :

- Ce n'est pas un classement de qualité. Une cartographie macro n'est pas inférieure à une cartographie fine, elle répond à une question différente.
- Ce n'est pas un point de départ figé. On commence souvent par le macro, et on descend dans le détail sur les zones identifiées comme critiques.

---

### Cartographie écrite vs cartographie visuelle

**Définition** : Une cartographie peut prendre plusieurs formes : tableau Markdown (texte), diagramme Mermaid (visuel), mur de post-it (atelier). Chaque format a ses avantages et ses limites.

**Le problème que cette comparaison résout** :

Sans comparaison explicite, on choisit le format par défaut (souvent un diagramme) sans peser ses inconvénients (maintenance lourde, vue figée).

**Comparaison des formats** :

| Format | Avantage | Limite |
| --- | --- | --- |
| Tableau Markdown | Versionné, recherchable | Pas de vue d'ensemble visuelle |
| Diagramme Mermaid | Vue globale | Fige rapidement, dur à maintenir |
| Mur de post-it | Excellent en atelier collectif | Volatile, non versionné |

Recommandation : un tableau Markdown principal, et un diagramme Mermaid macro complémentaire. Tu gardes la rigueur du texte versionné et la lisibilité d'un schéma de haut niveau.

**Analogie concrète** : Pense à une recette de cuisine. Le texte écrit donne les quantités précises et les étapes. Une photo du plat fini donne l'intention visuelle. Les deux se complètent. Si tu n'as que la photo, tu rates les proportions. Si tu n'as que le texte, tu rates l'aspect attendu. Une cartographie suit le même équilibre.

**Ce que ces formats ne sont PAS** :

- Le diagramme Mermaid n'est pas plus précis qu'un tableau. Il est seulement plus rapide à lire de loin.
- Le tableau Markdown n'est pas démodé. C'est le seul format qui se relise sans outil dédié et qui se diffe proprement dans Git.

---

## Étapes Pratiques

### Étape 1 : Lister toutes les routes

Pour une application Symfony moderne, les routes sont déclarées via l'attribut `#[Route(...)]` au-dessus des méthodes de contrôleur. La première étape consiste à les recenser toutes.

Recherche brute dans le code :

```bash
# Cherche toutes les declarations #[Route dans les controleurs
grep -rn "#\[Route" src/Controller/
```

Cette commande renvoie une ligne par déclaration `#[Route(...)]` avec son chemin de fichier et son numéro de ligne. Comprends bien :

- `-r` : recherche récursive dans le dossier indiqué
- `-n` : affiche le numéro de ligne

Alternative côté Symfony (plus structurée, mais nécessite que l'application boote correctement) :

```bash
# Affiche un tableau des routes connues par le routeur Symfony
php bin/console debug:router
```

Cette commande affiche un tableau avec nom de route, méthode HTTP, schéma et chemin. Elle a l'avantage de couvrir les routes générées par les bundles (EasyAdmin, API Platform), invisibles dans un simple `grep`. **FOSUserBundle** n'est plus maintenu et n'est pas un bundle Symfony 7 : ne l'attends pas sur un projet récent.

**Résultat attendu** :

```text
src/Controller/HomeController.php:15:    #[Route('/', name: 'home')]
src/Controller/AccountController.php:22:    #[Route('/compte', name: 'account_show')]
src/Controller/AccountController.php:35:    #[Route('/compte/editer', name: 'account_edit')]
```

---

### Étape 2 : Identifier le rôle requis pour chaque route

Le rôle requis (qui peut accéder à la route) peut se déclarer à trois endroits différents en Symfony. Tu dois vérifier les trois sources.

Les trois sources possibles :

1. **Attribut `#[IsGranted(...)]`** au-dessus de la méthode de contrôleur
2. **Méthode `$this->denyAccessUnlessGranted(...)`** dans le corps de la méthode
3. **`security.yaml` section `access_control`** (basé sur des patterns d'URL)

Pour repérer rapidement les contrôles d'accès inline :

```bash
# Affiche les 5 lignes au-dessus de chaque #[Route /admin
# pour reveler les #[IsGranted voisins
grep -B 5 "Route.*/admin" src/Controller/ -r
```

L'option `-B 5` affiche les 5 lignes avant chaque correspondance, ce qui révèle les annotations placées juste au-dessus.

Exemple de fichier `security.yaml` à consulter en parallèle :

```yaml
# config/packages/security.yaml
security:
    access_control:
        # Toute URL sous /admin exige le role ROLE_ADMIN
        - { path: ^/admin, roles: ROLE_ADMIN }
        # Toute URL sous /compte exige une connexion
        - { path: ^/compte, roles: ROLE_USER }
```

**Résultat attendu** :

```text
Pour chaque route, une mention :
  - "aucun" (route publique)
  - "ROLE_USER" (utilisateur connecte)
  - "ROLE_ADMIN" (administrateur)
  - "ROLE_XXX" (role specifique au projet)
```

---

### Étape 3 : Repérer les entités manipulées

Pour chaque route, lis le corps de la méthode et identifie les entités lues ou écrites. Trois indices te servent :

- Paramètres injectés dans le constructeur du contrôleur (`UserRepository`, `EntityManagerInterface`)
- Arguments typés directement sur la méthode (`Order $order` : résolution d'entité, `MapEntity` depuis Symfony 6.2, anciennement ParamConverter)
- Appels explicites dans le corps (`$this->em->find(User::class, $id)`, `$repository->findOneBy(...)`)

Exemple à lire pour deviner les entités :

```php
<?php

// src/Controller/CatalogController.php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CatalogController extends AbstractController
{
    public function __construct(
        private ProductRepository $products,
    ) {
    }

    #[Route('/catalogue/{slug}', name: 'catalog_product')]
    public function show(string $slug): Response
    {
        // L'entite Product est lue via le repository injecte
        $product = $this->products->findOneBy(['slug' => $slug]);

        return $this->render('catalog/product.html.twig', [
            'product' => $product,
        ]);
    }
}
```

Dans cet exemple, l'entité manipulée est `Product` (en lecture).

**Résultat attendu** :

```text
Pour chaque route, une mention :
  - "aucune" si la route ne touche pas la base
  - "Product (lecture)" pour une consultation
  - "Order (ecriture)" pour une creation ou modification
  - "User, Order (lecture)" si plusieurs entites sont consultees
```

---

### Étape 4 : Remplir le tableau de cartographie

Compile les informations recueillies dans un tableau Markdown que tu versionnes dans le dépôt (par exemple dans `docs/audit/cartographie.md`).

Format de référence :

| URL | Méthode HTTP | Contrôleur::action | Rôle requis | Entité principale | Description fonctionnelle (1 phrase) |
| --- | --- | --- | --- | --- | --- |
| `/` | GET | `HomeController::index` | aucun (public) | aucune | Page d'accueil publique |
| `/compte/editer` | GET, POST | `AccountController::edit` | `ROLE_USER` | `User` | Modification du profil par l'utilisateur connecté |
| `/admin/utilisateurs` | GET | `UserCrudController::index` | `ROLE_ADMIN` | `User` | Liste paginée des utilisateurs (back-office) |

Astuce : commence par les routes qui font peur (paiement, suppression, authentification). Tu peux ignorer les routes triviales (page de mentions légales, sitemap, favicon) en première passe et y revenir plus tard si tu as le temps.

**Résultat attendu** :

```text
Un fichier Markdown dans le depot, avec :
  - Un tableau d'au moins 10 lignes
  - Une ligne par route critique
  - Un commit qui versionne le fichier
```

---

### Étape 5 : Identifier les invariants

Pour les 5 à 10 routes les plus critiques, ajoute une colonne "Invariants" ou une section séparée par route. Un invariant est une règle métier qui doit toujours être vraie, indépendamment du chemin emprunté dans le code.

Exemples d'invariants formulés correctement :

- Cette suppression doit toujours créer une entrée dans l'historique
- Cette consultation ne doit jamais exposer des données d'un autre utilisateur
- Cette validation ne doit être franchie qu'avec un email confirmé
- Ce paiement ne doit jamais être confirmé sans réservation correspondante

Exemples d'invariants mal formulés :

- "Le code doit être propre" (trop vague)
- "Les tests doivent passer" (ce n'est pas un invariant métier)
- "L'utilisateur doit être content" (non vérifiable)

Cette colonne devient la base de la fiche suivante (identifier les invariants métier en profondeur).

**Résultat attendu** :

```text
Pour chaque route critique, 1 a 3 invariants ecrits sous forme :
  - phrase courte
  - verbe d'obligation explicite (doit, ne doit jamais)
  - sujet metier identifiable (utilisateur, commande, paiement)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `grep -rn "#\[Route" src/Controller/` | Lister toutes les déclarations `#[Route]` |
| `php bin/console debug:router` | Tableau des routes (nécessite Symfony bootable) |
| `php bin/console debug:router --show-controllers` | Inclut le contrôleur cible pour chaque route |
| `php bin/console debug:container` | Lister tous les services enregistrés |
| `php bin/console debug:event-dispatcher` | Lister les écouteurs d'événements (comportements transverses) |
| `grep -rn "IsGranted" src/Controller/` | Repérer les permissions inline |
| `grep -rn "denyAccessUnlessGranted" src/Controller/` | Repérer les contrôles d'accès en code |

---

## Pièges Fréquents

### Piège 1 : Cartographie exhaustive d'un coup

⚠️ **Problème** : Tu décides de lister les 250 routes du projet avant de lire la moindre ligne de code. Tu passes deux jours à remplir un tableau, mais tu n'as pas encore ouvert un seul contrôleur.

✅ **Solution** : Découpe en zones (front public, back admin, transverses) et boucle. Cartographie 20 à 30 routes par jour, en lisant les contrôleurs au passage. La cartographie et la lecture s'enrichissent mutuellement.

---

### Piège 2 : Confondre route et action

⚠️ **Problème** : Tu notes une seule ligne pour `/commande/{id}` sans préciser que GET affiche la commande et POST la modifie. Tes invariants se mélangent et tu rates des bugs.

✅ **Solution** : Une ligne par couple (URL, méthode HTTP). Si la même URL accepte GET et POST avec des comportements différents, cartographier les deux séparément.

---

### Piège 3 : Oublier les routes héritées d'un bundle

⚠️ **Problème** : Tu listes uniquement ce que tu trouves dans `src/`, mais EasyAdmin, API Platform ou un autre bundle génèrent des routes invisibles. Ton audit passe à côté du back-office complet.

✅ **Solution** : Toujours croiser `grep` et `php bin/console debug:router`. Le routeur Symfony connaît toutes les routes, y compris celles définies par les bundles tiers.

---

### Piège 4 : Cartographier sans contexte métier

⚠️ **Problème** : Tu cartographies `/admin/widgets` sans savoir ce qu'est un widget dans ce projet. Tu écris des invariants génériques qui ne reflètent pas la réalité métier.

✅ **Solution** : Note les questions à mesure qu'elles arrivent et bloque une session avec une personne qui connaît le métier. Mieux vaut une cartographie partielle avec contexte qu'une cartographie complète sans contexte.

---

### Piège 5 : Mise à jour qui décroche

⚠️ **Problème** : Tu cartographies une fois, puis tu oublies. Six mois plus tard, ton document mentionne des routes qui n'existent plus et omet les nouveautés. Plus personne ne fait confiance au tableau.

✅ **Solution** : La cartographie n'est utile que si elle reflète le code actuel. Re-génère la liste des routes à chaque audit, ne la maintiens pas manuellement. Un script qui régénère `cartographie.md` à partir de `debug:router` est plus fiable qu'une mise à jour à la main.

---

## Checklist de Validation

- [ ] J'ai listé toutes les routes via `grep` ou `debug:router`
- [ ] J'ai associé chaque route à son contrôleur et son rôle requis
- [ ] J'ai identifié les zones logiques (front, admin, transverses)
- [ ] J'ai produit un tableau Markdown avec au moins 10 lignes
- [ ] J'ai identifié au moins 3 invariants pour les routes les plus critiques
- [ ] Mon tableau est versionné dans le projet (git)

---

## Exercice Pratique

**Énoncé** : Tu disposes du fichier de routes ci-dessous, extrait d'une application e-commerce :

```text
src/Controller/Front/HomeController.php:12:    #[Route('/', name: 'home', methods: ['GET'])]
src/Controller/Front/CatalogController.php:18:    #[Route('/catalogue', name: 'catalog_index')]
src/Controller/Front/CatalogController.php:32:    #[Route('/catalogue/{slug}', name: 'catalog_product')]
src/Controller/Front/CartController.php:25:    #[Route('/panier', name: 'cart_show')]
src/Controller/Front/CartController.php:42:    #[Route('/panier/ajouter/{productId}', name: 'cart_add', methods: ['POST'])]
src/Controller/Front/OrderController.php:30:    #[Route('/commande/valider', name: 'order_validate', methods: ['POST'])]
src/Controller/Front/OrderController.php:60:    #[Route('/commande/{id}/suivi/{token}', name: 'order_track')]
src/Controller/Admin/ProductCrudController.php:20:    #[Route('/admin/produits/{id}/supprimer', name: 'admin_product_delete', methods: ['POST'])]
```

**Indications** :

- Identifie les zones logiques (front public, back admin, transverses)
- Devine le rôle requis pour chaque route (suppose des conventions classiques)
- Identifie 3 routes que tu mettrais en priorité dans ton audit, et explique pourquoi

**Résultat attendu** : Une liste écrite de trois éléments (zones, rôles, priorités) qui te servirait de base pour cartographier ce projet.

---

## Solution de l'Exercice

> **Note** : Cette section contient une proposition de solution. Essaie d'abord de résoudre l'exercice par toi-même avant de la consulter. La "bonne réponse" dépend du contexte ; l'important est de pouvoir justifier tes choix.

---

Une proposition possible :

**1. Zones logiques** :

- Front public : les 7 premières routes (`/`, `/catalogue`, `/catalogue/{slug}`, `/panier`, `/panier/ajouter/{productId}`, `/commande/valider`, `/commande/{id}/suivi/{token}`)
- Back admin : `/admin/produits/{id}/supprimer`
- Transverses : aucune route transverse explicite dans cet extrait (mais il y en a probablement dans les écouteurs d'événements, à vérifier avec `debug:event-dispatcher`)

**2. Rôles requis (hypothèses classiques)** :

| Route | Rôle probable |
| --- | --- |
| `/` | aucun (public) |
| `/catalogue` | aucun (public) |
| `/catalogue/{slug}` | aucun (public) |
| `/panier` | aucun (public, panier de session) |
| `/panier/ajouter/{productId}` | aucun (public) |
| `/commande/valider` | `ROLE_USER` probable, mais à confirmer (certaines plateformes acceptent un invité) |
| `/commande/{id}/suivi/{token}` | aucun (accès par token de suivi, vérification dans le code) |
| `/admin/produits/{id}/supprimer` | `ROLE_ADMIN` ou rôle équivalent (gestionnaire produits) |

**3. Trois routes prioritaires** :

- `/commande/valider` : touche un flux financier, une erreur peut entraîner une perte d'argent ou une commande non honorée
- `/commande/{id}/suivi/{token}` : accès anonyme par token, risque de fuite d'information si le token est mal généré ou mal vérifié
- `/admin/produits/{id}/supprimer` : destruction de données, doit toujours laisser une trace et exiger le bon rôle

**Discussion** : tes choix dépendent de ton hypothèse sur le métier et sur la nature des risques. Documenter cette hypothèse fait partie de l'exercice. Une autre personne pourrait justifier d'autres priorités (par exemple `/panier/ajouter/{productId}` si l'application a déjà subi des attaques par énumération de produits).

---

## Navigation

← Fiche précédente : **[Pourquoi auditer une application existante](01-pourquoi-auditer.md)**

→ Fiche suivante : **[Identifier les invariants métier](03-invariants-metier.md)**
