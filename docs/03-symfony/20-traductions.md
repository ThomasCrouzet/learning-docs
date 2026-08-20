---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Composant Translation de Symfony : fichiers de catalogue YAML et XLIFF, service translator, filtre trans dans Twig, domaines de traduction, pluralisation ICU et gestion de la locale."
estimated_time: "70 min"
fiche_number: 20
total_fiches: 21
cursus: "Symfony"
---

# 20 - Traductions et internationalisation (i18n)

> **En bref** : Rendre une application Symfony multilingue avec le composant Translation. Tu apprendras à organiser les fichiers de catalogue, à traduire dans les contrôleurs et dans Twig, à utiliser les domaines, à gérer la pluralisation avec le format ICU, et à changer la langue via `_locale`. Lecture estimée : 70 min.

## Prérequis

- Avoir lu la fiche **[02 - Les contrôleurs et les routes](02-controleurs-routes.md)**
- Avoir lu la fiche **[03 - Templates Twig](03-templates-twig.md)**
- Avoir lu la fiche **[13 - Services et injection de dépendances](13-services-injection-dependances.md)**
- Comprendre le format YAML (clés et valeurs)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer la locale par défaut, créer des fichiers de catalogue YAML et XLIFF, traduire un texte dans un contrôleur avec le service `translator` et dans un template avec le filtre `|trans`, organiser les messages par domaines, gérer le pluriel avec le format ICU, et changer la langue d'une page via le paramètre `_locale`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'internationalisation ?

**Définition** : L'internationalisation (souvent abrégée i18n) est la conception d'une application pour qu'elle puisse être adaptée à plusieurs langues et régions, sans modifier son code. La localisation (l10n) est l'adaptation concrète à une langue donnée.

**Le problème que l'internationalisation résout** :

Sans internationalisation, voici les problèmes rencontrés :

1. **Textes figés dans le code** : Les phrases sont écrites en dur dans les templates et les contrôleurs. Pour ajouter une langue, il faut dupliquer chaque fichier.
2. **Maintenance impossible** : Corriger une faute dans un texte oblige à chercher cette phrase dans tout le code.
3. **Incohérences** : La même phrase est traduite différemment à plusieurs endroits.

**Comment l'internationalisation résout ces problèmes** :

| Problème | Solution apportée par l'internationalisation |
| ----------------------- | ---------------------------------------------- |
| Textes figés | Les phrases sont remplacées par des clés |
| Maintenance impossible | Toutes les traductions sont dans des fichiers dédiés |
| Incohérences | Une clé donne toujours la même traduction |

**Analogie concrète** : Pense à une notice de montage de meuble. Au lieu d'écrire les instructions une fois par langue dans le carton, le fabricant numérote chaque étape (1, 2, 3) et fournit un livret par langue qui associe chaque numéro à un texte. Pour ajouter l'italien, il suffit d'ajouter un livret : les schémas numérotés ne changent pas. Les numéros sont les clés, les livrets sont les catalogues de traduction.

**Ce que l'internationalisation n'est PAS** :

- L'internationalisation n'est pas de la traduction automatique. Tu fournis toi-même les traductions humaines. Symfony fournit le mécanisme, pas le contenu traduit.
- L'internationalisation ne concerne pas que le texte. Les formats de date, de nombre et de monnaie changent aussi selon la région, mais relèvent d'autres composants (Intl).

---

### La locale

**Définition** : La locale est un identifiant qui désigne une langue et, optionnellement, une région. Elle suit le format `langue` (ex : `fr`) ou `langue_REGION` (ex : `fr_BE` pour le français de Belgique, `en_US` pour l'anglais américain).

**Le problème que la locale résout** :

L'application doit savoir dans quelle langue répondre à chaque requête. La locale est l'information qui porte ce choix tout au long du traitement de la requête.

**Comment Symfony détermine la locale** :

La locale vit sur la requête HTTP. Le mécanisme recommandé est le paramètre `_locale` dans la route. La persistance en session (sticky locale) n'est **pas** automatique : tu dois l'activer explicitement.

```text
1. Le paramètre _locale dans la route (ex : /fr/articles) - mécanisme recommandé
2. Sinon, la locale déjà posée sur le Request
3. Sinon, la locale par défaut (default_locale dans la configuration)
```

Pour garder la langue d'une visite à l'autre via la session, vois la doc Symfony « How to Work with the User's Locale » (sticky session) : ce n'est pas le comportement par défaut.

**Analogie concrète** : La locale est comme le drapeau que tu choisis au début d'un distributeur de billets : tout l'écran s'adapte à ce choix. Tant que tu ne changes pas de drapeau, l'appareil te parle dans la même langue.

**Exemples de locales courantes** :

| Locale | Langue et région |
| ------ | ---------------------- |
| `fr` | Français |
| `fr_BE` | Français (Belgique) |
| `en` | Anglais |
| `en_US` | Anglais (États-Unis) |
| `es` | Espagnol |
| `de` | Allemand |

---

### Le catalogue de traduction

**Définition** : Un catalogue de traduction est un fichier qui associe des clés à leurs traductions pour une langue donnée. Symfony charge ces fichiers depuis le dossier `translations/`. Le nom du fichier encode le domaine et la locale.

**Le problème que le catalogue résout** :

Les traductions doivent être stockées dans des fichiers structurés, faciles à éditer par un traducteur sans toucher au code PHP. Le catalogue centralise toutes les paires clé/traduction d'une langue.

**Convention de nommage des fichiers** :

```text
translations/
├── messages.fr.yaml      → domaine "messages", langue française
├── messages.en.yaml      → domaine "messages", langue anglaise
├── validators.fr.yaml    → domaine "validators", langue française
└── security.en.xliff     → domaine "security", langue anglaise, format XLIFF
```

Le format du nom est strict : `domaine.locale.format`.

**Comparaison des formats de catalogue** :

| Format YAML | Format XLIFF |
| ------------------------------ | --------------------------------------- |
| Lisible et concis | Verbeux (basé sur XML) |
| Idéal pour les petits projets | Standard de l'industrie de la traduction |
| Édité à la main facilement | Compatible avec les outils de traduction (TMS) |
| Pas de métadonnées | Supporte notes, statut de traduction, contexte |

**Analogie concrète** : Le catalogue est comme un dictionnaire bilingue. À gauche le mot dans une langue de référence (la clé), à droite sa traduction. Tu as un dictionnaire par langue cible. Le format YAML est un dictionnaire de poche, le format XLIFF est un dictionnaire professionnel annoté.

**Ce qu'un catalogue n'est PAS** :

- Un catalogue n'est pas une base de données. C'est un fichier statique chargé au démarrage. Pour des traductions modifiables par les utilisateurs en temps réel, il faut une autre approche (loader personnalisé).

---

### Le domaine de traduction

**Définition** : Un domaine est un regroupement logique de traductions par thème. Le domaine par défaut s'appelle `messages`. Tu peux créer d'autres domaines comme `validators`, `emails` ou `admin` pour organiser tes traductions.

**Le problème que les domaines résolvent** :

Dans une grande application, le fichier de traductions devient énorme et désorganisé. Les domaines permettent de découper les traductions par contexte d'usage.

**Comment ça fonctionne** :

| Domaine | Contenu typique |
| ------------ | ------------------------------------------- |
| `messages` | Textes généraux de l'interface (par défaut) |
| `validators` | Messages d'erreur de validation |
| `emails` | Contenu des emails transactionnels |
| `admin` | Textes de l'interface d'administration |

**Analogie concrète** : Les domaines sont comme les rayons d'une bibliothèque. Tous les livres sont des livres (des traductions), mais tu les ranges par thème : romans, sciences, cuisine. Pour trouver une recette, tu vas au rayon cuisine, pas au rayon romans. Le domaine `emails` regroupe toutes les traductions liées aux emails.

**Ce qu'un domaine n'est PAS** :

- Un domaine n'est pas une locale. Une locale est une langue, un domaine est un thème. Tu as un fichier par couple domaine/locale : `emails.fr.yaml`, `emails.en.yaml`, `admin.fr.yaml`, etc.

---

### La pluralisation avec ICU

**Définition** : La pluralisation est la sélection automatique de la bonne forme d'un texte selon une quantité. Le format ICU (International Components for Unicode) est un standard qui décrit ces règles de manière portable entre les langues.

**Le problème que la pluralisation résout** :

Le pluriel ne se résume pas à ajouter un "s". "0 article", "1 article", "2 articles" suivent des règles qui changent selon la langue (le russe a trois formes plurielles, l'arabe six). Coder ces règles à la main est source d'erreurs.

**Le format ICU pour le pluriel** :

```text
{count, plural,
    =0 {Aucun article}
    one {# article}
    other {# articles}
}
```

Dans ce format, `#` est remplacé par la valeur de `count`. Les catégories `one` et `other` correspondent aux règles de la langue.

**Comparaison ancien format vs ICU** :

| Ancien format (déprécié) | Format ICU (recommandé en 7.4) |
| --------------------------------------- | ----------------------------------- |
| `Aucun\|un\|articles` (syntaxe à pipes) | Syntaxe `{count, plural, ...}` |
| Difficile à lire | Explicite et standardisé |
| Catégories implicites | Catégories nommées (`one`, `other`) |
| Spécifique à Symfony | Standard international ICU |

**Analogie concrète** : La pluralisation ICU est comme un panneau d'affichage de parking qui choisit le bon message selon le nombre de places : "Complet" (zéro), "1 place" (une), "12 places" (plusieurs). Le panneau applique une règle au lieu d'afficher toujours la même phrase. ICU est le langage standard pour écrire cette règle.

**Ce que la pluralisation n'est PAS** :

- La pluralisation ICU n'est pas réservée au pluriel. Le format ICU gère aussi la sélection par genre (`select`), par nombre ordinal et l'insertion de variables formatées.

---

## Étapes Pratiques

### Étape 1 : Installer et configurer le composant Translation

Le composant Translation est inclus dans la plupart des installations Symfony web. Si besoin, installe-le, puis configure la locale par défaut.

```bash
# Installe le composant Translation (si absent)
composer require symfony/translation
```

Configure la locale par défaut dans `config/packages/translation.yaml` :

```yaml
framework:
    # Langue utilisée quand aucune autre locale n'est déterminée
    default_locale: 'fr'

    translator:
        # Dossier où Symfony cherche les fichiers de catalogue
        default_path: '%kernel.project_dir%/translations'

        # Langue de repli si une clé n'est pas traduite dans la locale demandée
        fallbacks:
            - 'fr'
```

**Résultat attendu** : Symfony utilise le français par défaut et cherche les traductions dans le dossier `translations/`. Si une clé manque dans une langue, il retombe sur le français.

---

### Étape 2 : Créer un catalogue YAML

Crée le fichier `translations/messages.fr.yaml` pour le domaine par défaut en français.

```yaml
# translations/messages.fr.yaml
# Clés organisées par préfixe pour structurer le catalogue
homepage:
    title: 'Bienvenue sur la plateforme'
    subtitle: 'Apprends à ton rythme'

article:
    create: 'Créer un article'
    edit: "Modifier l'article"
    deleted: "L'article a été supprimé"
```

Crée la version anglaise `translations/messages.en.yaml` :

```yaml
# translations/messages.en.yaml
homepage:
    title: 'Welcome to the platform'
    subtitle: 'Learn at your own pace'

article:
    create: 'Create an article'
    edit: 'Edit the article'
    deleted: 'The article has been deleted'
```

**Résultat attendu** : Deux catalogues pour le domaine `messages`. La clé `homepage.title` donne "Bienvenue sur la plateforme" en français et "Welcome to the platform" en anglais.

---

### Étape 3 : Traduire dans un contrôleur avec le service translator

Injecte `TranslatorInterface` pour traduire un message côté PHP, par exemple pour un message flash.

```php
<?php
// src/Controller/ArticleController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

final class ArticleController extends AbstractController
{
    #[Route('/article/{id}/delete', name: 'article_delete', methods: ['POST'])]
    public function delete(
        int $id,
        TranslatorInterface $translator,  // Le service de traduction, injecté
    ): Response {
        // Logique de suppression ici (omise pour l'exemple)

        // trans() traduit la clé dans la locale courante de la requête.
        // Le deuxième argument (paramètres) est vide ici, le troisième est le domaine.
        $message = $translator->trans('article.deleted');

        $this->addFlash('success', $message);

        return $this->redirectToRoute('article_list');
    }
}
```

**Résultat attendu** :

```text
Requête POST sur /article/3/delete  -> flash "L'article a été supprimé"
(la locale courante est ici 'fr', valeur de default_locale ; trans() traduit
 dans cette locale. Pour servir la page en anglais via une URL /en/...,
 vois l'Étape 7 : changer la locale via {_locale} dans la route.)
```

---

### Étape 4 : Traduire dans un template Twig

Twig propose le filtre `|trans` et la balise `{% trans %}`. Le filtre est l'approche la plus courante.

```twig
{# templates/home/index.html.twig #}

{# Le filtre |trans traduit la clé dans la locale courante #}
<h1>{{ 'homepage.title'|trans }}</h1>

<p>{{ 'homepage.subtitle'|trans }}</p>

{# Bouton avec une clé du préfixe "article" #}
<a href="{{ path('article_new') }}">
    {{ 'article.create'|trans }}
</a>
```

**Résultat attendu** (locale `fr`) :

```html
<h1>Bienvenue sur la plateforme</h1>
<p>Apprends à ton rythme</p>
<a href="/fr/article/new">Créer un article</a>
```

Pour insérer une variable dans une traduction, utilise un paramètre. Dans le catalogue :

```yaml
# translations/messages.fr.yaml
article:
    greeting: 'Bonjour %name%, tu as %count% articles'
```

Dans le template, passe les paramètres au filtre :

```twig
{# Les clés du tableau correspondent aux placeholders %name% et %count% #}
<p>{{ 'article.greeting'|trans({'%name%': user.name, '%count%': articleCount}) }}</p>
```

**Résultat attendu** :

```html
<p>Bonjour Alex, tu as 5 articles</p>
```

---

### Étape 5 : Utiliser un domaine personnalisé

Crée un domaine `emails` pour isoler les traductions des emails. Le fichier est `translations/emails.fr.yaml`.

```yaml
# translations/emails.fr.yaml
welcome:
    subject: 'Bienvenue'
    body: 'Ton compte est désormais actif'
```

Pour utiliser ce domaine dans un contrôleur, passe son nom en troisième argument de `trans()` :

```php
<?php

// Le troisième argument (null = paramètres) puis le domaine "emails"
$subject = $translator->trans('welcome.subject', [], 'emails');
$body = $translator->trans('welcome.body', [], 'emails');
```

Dans Twig, passe le domaine en deuxième argument du filtre :

```twig
{# Premier argument : paramètres (aucun ici). Deuxième : le domaine "emails" #}
<h1>{{ 'welcome.subject'|trans({}, 'emails') }}</h1>
<p>{{ 'welcome.body'|trans({}, 'emails') }}</p>
```

**Résultat attendu** : Symfony cherche la clé `welcome.subject` dans `emails.fr.yaml`, et non dans `messages.fr.yaml`. Les domaines évitent les collisions de clés entre contextes.

---

### Étape 6 : Gérer le pluriel avec le format ICU

Le format ICU sélectionne la bonne forme selon une quantité. Le domaine doit porter le suffixe `+intl-icu` pour activer l'interprétation ICU.

Crée le fichier `translations/messages+intl-icu.fr.yaml` :

```yaml
# translations/messages+intl-icu.fr.yaml
# Le suffixe +intl-icu active le format ICU pour ce catalogue
notifications:
    count: |
        {count, plural,
            =0 {Aucune notification}
            one {# notification}
            other {# notifications}
        }
```

Dans le template, passe la variable `count` :

```twig
{# La variable count pilote la sélection de la forme plurielle #}
<span>{{ 'notifications.count'|trans({'count': notificationCount}) }}</span>
```

**Résultat attendu** :

```text
notificationCount = 0  -> "Aucune notification"
notificationCount = 1  -> "1 notification"
notificationCount = 5  -> "5 notifications"
```

---

### Étape 7 : Changer la locale via _locale dans la route

Pour qu'une partie de l'application change de langue selon l'URL, ajoute le paramètre spécial `_locale` dans la définition de route.

```php
<?php
// src/Controller/HomeController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    // {_locale} est un paramètre spécial : Symfony l'utilise pour fixer la locale.
    // requirements limite les valeurs acceptées à fr ou en (évite /xx/...).
    #[Route('/{_locale}/home', name: 'home', requirements: ['_locale' => 'fr|en'])]
    public function index(): Response
    {
        // La locale est déjà positionnée par le routeur grâce à {_locale}.
        // Les traductions du template s'afficheront dans cette langue.
        return $this->render('home/index.html.twig');
    }
}
```

**Résultat attendu** :

```text
GET /fr/home  -> page en français
GET /en/home  -> page en anglais
GET /xx/home  -> 404 (xx n'est pas autorisé par requirements)
```

---

### Étape 8 : Vérifier les traductions avec les commandes de debug

Symfony fournit des commandes pour lister les traductions et repérer les clés manquantes ou inutilisées.

```bash
# Liste les traductions du domaine "messages" pour le français,
# et signale les clés manquantes ou inutilisées
php bin/console debug:translation fr --domain=messages
```

**Résultat attendu** :

```text
 ------- ----------- ------------------------------- -------------------------------
  State   Domain      Id                              Message Preview (fr)
 ------- ----------- ------------------------------- -------------------------------
          messages    homepage.title                  Bienvenue sur la plateforme
          messages    article.create                  Créer un article
  unused  messages    article.edit                    Modifier l'article
  missing messages    article.archived                (clé utilisée mais non traduite)
 ------- ----------- ------------------------------- -------------------------------
```

La colonne `State` indique `missing` (clé utilisée dans le code mais absente du catalogue) ou `unused` (clé présente mais jamais utilisée).

---

## Commandes Utiles

| Commande | Action |
| ----------------------------------------------- | ------------------------------------------------ |
| `composer require symfony/translation` | Installer le composant Translation |
| `php bin/console debug:translation fr --domain=messages` | Lister les traductions et clés manquantes |
| `php bin/console translation:extract --dump-messages fr` | Afficher les clés extraites du code (sans écrire) |
| `php bin/console translation:extract --force fr` | Mettre à jour les catalogues avec les clés trouvées |
| `php bin/console debug:config framework translator` | Afficher la configuration du translator |
| `$translator->trans('cle')` | Traduire une clé dans la locale courante |
| `{{ 'cle'\|trans }}` | Traduire une clé dans un template Twig |

---

## Pièges Fréquents

### Piège 1 : Nom de fichier de catalogue incorrect

⚠️ **Problème** : Tes traductions ne sont pas prises en compte. Le filtre `|trans` affiche la clé brute (`homepage.title`) au lieu du texte traduit.

✅ **Solution** : Le nom du fichier doit suivre exactement le format `domaine.locale.format`. Une erreur sur le domaine, la locale ou l'extension empêche le chargement.

```text
❌ message.fr.yaml      (domaine au singulier au lieu de "messages")
❌ messages.fr_FR.yaml  (locale trop précise si tu utilises "fr")
✅ messages.fr.yaml     (domaine, locale et format corrects)
```

Vide le cache après modification : `php bin/console cache:clear`.

---

### Piège 2 : Clé affichée brute au lieu de la traduction

⚠️ **Problème** : La page affiche `article.create` au lieu de "Créer un article".

✅ **Solution** : Trois causes possibles, à vérifier dans l'ordre.

```text
1. La clé n'existe pas dans le catalogue de la locale courante
   -> vérifie avec : php bin/console debug:translation fr --domain=messages
2. Le filtre |trans est mal écrit (ex : |translate au lieu de |trans)
3. Le cache contient une ancienne version
   -> php bin/console cache:clear
```

---

### Piège 3 : Oublier le suffixe +intl-icu pour le pluriel

⚠️ **Problème** : Tu écris une règle de pluriel au format ICU, mais le texte affiché contient les accolades brutes : `{count, plural, ...}`.

✅ **Solution** : Le format ICU n'est interprété que si le nom du fichier contient le suffixe `+intl-icu`. Sans ce suffixe, Symfony traite le contenu comme un texte ordinaire.

```text
❌ messages.fr.yaml             (ICU non interprété, accolades affichées)
✅ messages+intl-icu.fr.yaml    (ICU interprété, pluriel fonctionnel)
```

---

### Piège 4 : Locale non transmise aux sous-requêtes ou aux services

⚠️ **Problème** : La page principale est traduite, mais un email envoyé depuis un service reste dans la mauvaise langue.

✅ **Solution** : Hors du contexte d'une requête HTTP (commande console, worker Messenger), la locale n'est pas positionnée automatiquement. Indique explicitement la locale en quatrième argument de `trans()`.

```php
<?php

// Force la locale "en" pour cette traduction, quel que soit le contexte
$subject = $translator->trans('welcome.subject', [], 'emails', 'en');
```

---

### Piège 5 : Confondre default_locale et fallbacks

⚠️ **Problème** : Tu penses que `default_locale` sert de langue de repli quand une clé manque, mais ce n'est pas son rôle.

✅ **Solution** : Distingue les deux réglages.

| Réglage | Rôle |
| --------------- | ----------------------------------------------------- |
| `default_locale` | Locale utilisée quand aucune locale n'est déterminée par la requête |
| `fallbacks` | Locale(s) consultée(s) quand une clé manque dans la locale demandée |

Les deux peuvent pointer vers la même langue, mais ils répondent à deux questions différentes.

---

## Checklist de Validation

- [ ] J'ai configuré `default_locale` et `fallbacks` dans `translation.yaml`
- [ ] Je sais créer un catalogue YAML avec la convention `domaine.locale.yaml`
- [ ] Je connais la différence entre le format YAML et le format XLIFF
- [ ] Je sais traduire dans un contrôleur avec `TranslatorInterface`
- [ ] Je sais traduire dans Twig avec le filtre `|trans`
- [ ] Je sais passer des paramètres à une traduction (`%name%`)
- [ ] Je sais créer et utiliser un domaine personnalisé
- [ ] Je sais gérer le pluriel avec le format ICU et le suffixe `+intl-icu`
- [ ] Je sais changer la langue d'une route avec `{_locale}`
- [ ] Je sais utiliser `debug:translation` pour repérer les clés manquantes

---

## Exercice Pratique

**Énoncé** : Rends bilingue (français et anglais) la page de profil d'un utilisateur, avec un compteur de messages géré au pluriel.

**Spécifications** :

1. Configure `default_locale: 'fr'` et un fallback `fr` dans `translation.yaml`.
2. Crée deux catalogues du domaine `messages` :
   - `translations/messages.fr.yaml` avec les clés : `profile.title` ("Mon profil"), `profile.edit` ("Modifier mon profil").
   - `translations/messages.en.yaml` avec les mêmes clés traduites en anglais.
3. Crée un catalogue ICU `translations/messages+intl-icu.fr.yaml` avec une clé `profile.messages` qui affiche :
   - 0 message : "Aucun message"
   - 1 message : "1 message"
   - plusieurs : "N messages"
4. Crée la version anglaise `translations/messages+intl-icu.en.yaml` de cette clé pluralisée.
5. Crée un contrôleur `ProfileController` avec une route `/{_locale}/profile` (locales autorisées : `fr|en`) qui rend un template.
6. Dans le template, affiche le titre, le bouton d'édition (via `|trans`) et le compteur de messages pluralisé (via `|trans({'count': messageCount})`).

**Indications** :

- Le compteur ICU utilise les catégories `=0`, `one`, `other`.
- Pense au suffixe `+intl-icu` pour le catalogue de pluralisation.
- Vérifie avec `debug:translation fr --domain=messages` qu'aucune clé n'est manquante.

**Résultat attendu** : Sur `/fr/profile`, la page affiche "Mon profil", "Modifier mon profil" et un compteur en français adapté à la quantité. Sur `/en/profile`, tout est en anglais. L'URL `/de/profile` renvoie une 404.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Configuration `config/packages/translation.yaml`**

```yaml
framework:
    default_locale: 'fr'
    translator:
        default_path: '%kernel.project_dir%/translations'
        fallbacks:
            - 'fr'
```

**Étape 2 : Catalogues du domaine messages**

```yaml
# translations/messages.fr.yaml
profile:
    title: 'Mon profil'
    edit: 'Modifier mon profil'
```

```yaml
# translations/messages.en.yaml
profile:
    title: 'My profile'
    edit: 'Edit my profile'
```

**Étape 3 et 4 : Catalogues ICU pour le pluriel**

```yaml
# translations/messages+intl-icu.fr.yaml
profile:
    messages: |
        {count, plural,
            =0 {Aucun message}
            one {# message}
            other {# messages}
        }
```

```yaml
# translations/messages+intl-icu.en.yaml
profile:
    messages: |
        {count, plural,
            =0 {No message}
            one {# message}
            other {# messages}
        }
```

**Étape 5 : Le contrôleur `src/Controller/ProfileController.php`**

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProfileController extends AbstractController
{
    // {_locale} fixe la langue, requirements limite aux locales gérées
    #[Route('/{_locale}/profile', name: 'profile', requirements: ['_locale' => 'fr|en'])]
    public function show(): Response
    {
        // Valeur simulée du nombre de messages
        return $this->render('profile/show.html.twig', [
            'messageCount' => 3,
        ]);
    }
}
```

**Étape 6 : Le template `templates/profile/show.html.twig`**

```twig
{# Titre et bouton via le domaine "messages" par défaut #}
<h1>{{ 'profile.title'|trans }}</h1>

<a href="{{ path('profile_edit') }}">
    {{ 'profile.edit'|trans }}
</a>

{# Compteur pluralisé : la variable count pilote la forme choisie #}
<p>{{ 'profile.messages'|trans({'count': messageCount}) }}</p>
```

**Vérification du comportement** :

```text
GET /fr/profile (messageCount = 3) :
  "Mon profil"
  "Modifier mon profil"
  "3 messages"

GET /en/profile (messageCount = 3) :
  "My profile"
  "Edit my profile"
  "3 messages"

GET /fr/profile (messageCount = 0) :
  "Aucun message"

GET /de/profile :
  404 (de non autorisé par requirements)
```

**Explication de la solution** :

| Élément | Rôle |
| ------------------------------ | ------------------------------------------------- |
| `default_locale` + `fallbacks` | Langue par défaut et repli si clé manquante |
| `messages.fr.yaml` / `.en.yaml` | Catalogues standards du domaine par défaut |
| Suffixe `+intl-icu` | Active l'interprétation du format ICU |
| `{_locale}` + `requirements` | Fixe la langue depuis l'URL, restreint les valeurs |
| `\|trans` | Traduit la clé dans la locale courante |
| `{'count': ...}` | Pilote la sélection de la forme plurielle |

---

## Navigation

← Fiche précédente : **[Symfony Messenger (messages asynchrones)](19-messenger.md)**

→ Fiche suivante : **[Pagination des résultats](21-pagination.md)**
