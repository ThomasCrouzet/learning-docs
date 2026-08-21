---
tags:
  - Joomla
  - API
  - Sécurité
description: "Web services /api/index.php/v1, en-tête X-Joomla-Token, droits core.login.api et core.login.site, CSRF (jeton ≠ ACL) et CORS isOriginAllowed 6.1.3."
estimated_time: "50 min"
fiche_number: 20
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.api-v1-csrf-cors"
course_id: "web.joomla"
content_type: "lesson"
order: 20
---

# 20 - API /v1, CSRF et CORS

> **En bref** : Appeler `/api/index.php/v1` avec `X-Joomla-Token` et les deux droits `core.login.api` **et** `core.login.site`, séparer le jeton CSRF de l'ACL, et figer CORS sur `isOriginAllowed` (@since 6.1.3, CVE-2026-71573). Lecture estimée : 50 min.

## Prérequis

- Avoir lu [Plugin console et CLI](19-plugin-console-et-cli.md)
- Avoir lu [ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) (`authorise` n'est pas un jeton)
- PHP 8.3.0, CMS 6.1.3, un compte capable de recevoir un jeton d'API

## Objectif de cette fiche

À la fin de cette fiche, tu sauras construire un appel `/v1`, poser les deux droits de login API, vérifier un formulaire avec `form.token` / `Session::checkToken`, et décrire CORS tel qu'il est corrigé en 6.1.3.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'API `/v1` ?

**Définition** : Les web services du CMS s'exposent sous `/api/index.php/v1`. L'authentification machine utilise l'en-tête `X-Joomla-Token`. Le compte porteur du jeton doit avoir **au moins** `core.login.api` **et** `core.login.site`.

**Le problème que l'API `/v1` résout** :

Sans ce front controller, voici les problèmes rencontrés :

1. **Pas de contrat HTTP JSON** : un client externe devrait parcourir le HTML du site.
2. **Session navigateur obligatoire** : un cron ou un autre CMS ne possède pas le cookie de session site.
3. **Un seul droit de login** : `core.login.api` seul ne suffit pas ; `core.login.site` est exigé en plus.

**Comment `/v1` résout ces problèmes** :

| Problème | Solution apportée par `/v1` |
| -------- | --------------------------- |
| Client hors HTML | Front `ApiApplication` (`api/includes/app.php`) |
| Pas de cookie session | En-tête `X-Joomla-Token` |
| Login incomplet | Les deux actions `core.login.api` et `core.login.site` |

**Analogie concrète** : `/api/index.php/v1` est un guichet distinct de la boutique HTML (`index.php`) et du bureau admin. Le badge du guichet s'appelle `X-Joomla-Token`. Le règlement du badge exige deux tampons : entrée guichet (`core.login.api`) **et** entrée boutique (`core.login.site`). Un seul tampon refuse le passage.

**Ce que l'API `/v1` n'est PAS** :

- Ce n'est pas un tutoriel d'écriture 6.1. La page programmeur « Web Services API » est un stub inachevé. La page conceptuelle 6.1 reste titrée **« Communicate with the Joomla 4.x Web Services API »** (`X-Joomla-Token`, cURL, `/v1/content/articles`).
- Ce n'est pas un jeton CSRF. `X-Joomla-Token` identifie un compte API ; le jeton de formulaire identifie une session HTML.
- Ce n'est pas une preuve ACL de contenu. Un jeton valide n'accorde pas `authorise('core.edit', 'com_content.article.22')`.

**Substitut versionné** : tests Cypress API (dont `com_media`) et `tests/README.md` du tag 6.1.3. Ne pas inventer un parcours admin non lu dans le corpus.

Le type de plugin d'authentification API est `api-authentication` (`ApiApplication::$authenticationPluginType`). Les plugins `webservices` inspectés s'abonnent à `onBeforeApiRoute` (liste partielle).

---

### Qu'est-ce que le jeton CSRF ?

**Définition** : La protection CSRF 6.1 est un jeton de session (synchronizer token). Tu l'émets avec `HTMLHelper::_('form.token')`. Tu le vérifies avec `Session::checkToken()` ou `$this->checkToken()`. Le même secret peut arriver via l'en-tête `HTTP_X_CSRF_TOKEN`.

**Le problème que le jeton CSRF résout** :

Sans ce jeton, voici les problèmes rencontrés :

1. **Requête forgée** : un autre site déclenche un POST sur une session déjà ouverte dans le navigateur.
2. **Action à effet de bord sans preuve d'origine formulaire** : création, publication, suppression.
3. **Confusion avec l'ACL** : « le POST a un jeton » n'est pas « l'utilisateur a le droit ».

**Comment le CSRF 6.1 résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| POST forgé depuis un autre site | Le jeton de session doit accompagner la requête |
| Client hors formulaire HTML | En-tête `HTTP_X_CSRF_TOKEN` |
| Droit d'édition | Toujours `$user->authorise(action, asset)` **en plus** |

**Analogie concrète** : Le jeton CSRF est le tampon encreur du formulaire que tu es en train de remplir. Le badge API (`X-Joomla-Token`) est une carte d'abonné machine. La clé de l'archive (`authorise`) est un troisième objet. Poser le tampon n'ouvre pas l'archive.

**Ce que le jeton CSRF n'est PAS** :

- Ce n'est pas une authentification. Un jeton valide ne prouve pas qui est connecté au-delà de « cette session a émis ce formulaire ».
- Ce n'est pas un droit ACL. `checkToken()` ne remplace pas `authorise()`.
- Ce n'est pas une couverture OWASP complète. Un XSS peut contourner le CSRF. Le filtre HTTP par défaut de `Input::get()` est `cmd`. Les requêtes SQL se lient avec `bind()`.

---

### Qu'est-ce que `isOriginAllowed` (CORS 6.1.3) ?

**Définition** : `ApiApplication::isOriginAllowed` (`@since 6.1.3`) découpe `cors_allow_origin` et compare l'en-tête `Origin` avec `in_array` **strict**. `respond()` et `handlePreflight()` ne reflètent l'origine et les credentials que sur un hit. La valeur `*` produit `Access-Control-Allow-Origin: *` **sans** credentials.

**Le problème que `isOriginAllowed` résout** :

Sans cette méthode, voici les problèmes rencontrés :

1. **CVE-2026-71573** : versions **4.0.0-5.4.7** et **6.0.0-6.1.2**, corrigée en **5.4.8** / **6.1.3** (avis JSST [20260802]).
2. **Origine reflétée trop largement** : un navigateur d'un autre site lirait des réponses API.
3. **`*` avec credentials** : combinaison interdite côté navigateur ; le code 6.1.3 n'associe pas credentials à `*`.

**Comment CORS 6.1.3 se comporte** :

| Cas | Comportement observé |
| --- | -------------------- |
| `Origin` présent dans la liste | Hit : origine (et credentials selon config) reflétées |
| `Origin` absent de la liste | Pas de reflet |
| `*` | ACAO `*` sans credentials |
| Comparaison | `in_array` strict après découpage de `cors_allow_origin` |

**Analogie concrète** : `cors_allow_origin` est une liste d'invités collée à la porte. Le videur (`isOriginAllowed`) compare le nom sur la carte (`Origin`) à la liste, sans approximation. L'étoile `*` ouvre la porte à tout le monde mais refuse le vestiaire (credentials).

**Ce que CORS n'est PAS** :

- Ce n'est pas le jeton CSRF. CORS décide ce qu'un **navigateur** d'une autre origine a le droit de lire. CSRF décide si un POST HTML appartient à la session courante.
- Ce n'est pas une suite de tests du tag : aucun test PHPUnit/Cypress **nommé** pour CORS n'a été trouvé sous `tests/` en 6.1.3.
- Ce n'est pas un réglage SameSite (absent du CMS, fiche 21).

---

## Étapes Pratiques

### Étape 1 : Distinguer les trois objets avant tout appel

Écris cette table sur un brouillon (pas dans un ticket avec des secrets) :

| Objet | Preuve | Ce qu'il ne prouve pas |
| ----- | ------ | ---------------------- |
| `X-Joomla-Token` | Compte API | CSRF, `authorise` sur un article |
| `form.token` / `HTTP_X_CSRF_TOKEN` | Session HTML | Login API, droit `core.edit` |
| `$user->authorise(...)` | Action + asset | Origine du formulaire, CORS |

**Résultat attendu** : tu n'utilises plus « le jeton » au singulier.

---

### Étape 2 : Émettre et vérifier le CSRF HTML

Dans un formulaire d'extension :

```php
echo HTMLHelper::_('form.token');
```

Dans le contrôleur qui reçoit le POST :

```php
// Jeton de session, aussi accepté via HTTP_X_CSRF_TOKEN.
if (!Session::checkToken()) {
    throw new \RuntimeException('Jeton CSRF invalide');
}

// Le jeton ne remplace pas l'ACL.
if (!$this->getCurrentUser()->authorise('core.edit', 'com_content.article.22')) {
    throw new \RuntimeException('ACL refuse core.edit');
}
```

**Résultat attendu** : un POST sans champ jeton (et sans en-tête `HTTP_X_CSRF_TOKEN`) est rejeté **avant** toute écriture. Un POST avec jeton et sans `core.edit` est encore rejeté.

---

### Étape 3 : Appeler `/v1` avec les deux droits

La page conceptuelle 6.1 (encore titrée Joomla 4.x) montre cURL vers `/v1/content/articles` avec `X-Joomla-Token`. Forme observée :

```bash
curl -sS \
  -H "X-Joomla-Token: TON_JETON" \
  "https://exemple.local/api/index.php/v1/content/articles"
```

**Résultat attendu** :

- Compte **sans** `core.login.api` ou **sans** `core.login.site` : l'appel n'est pas un login API complet.
- Le tutoriel d'écriture 6.1 est inachevé : ne pas inventer d'autres verbes ou chemins hors cette page et hors les specs Cypress `tests/System/integration/api/com_*`.

Remplace `TON_JETON` localement. Ne le commite pas. Ne le mélange pas avec le jeton CSRF.

---

### Étape 4 : Figer CORS sur 6.1.3

1. Vérifie que le CMS est **6.1.3** (pas 6.1.2 : CVE-2026-71573).
2. Lis `ApiApplication::isOriginAllowed` comme contrat `@since 6.1.3`.
3. N'enseigne pas un test CORS du dépôt : il n'y en a pas de nommé sous `tests/`.

**Résultat attendu** : tu cites 6.1.3 + `in_array` strict + `*` sans credentials, pas un comportement « pré-6.1.3 ».

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `curl -H "X-Joomla-Token: …" https://exemple.local/api/index.php/v1/content/articles` | Appel conceptuel `/v1` (page encore titrée 4.x) |
| `HTMLHelper::_('form.token')` | Champ hidden CSRF |
| `Session::checkToken()` | Vérifier POST ou `HTTP_X_CSRF_TOKEN` |
| `$this->checkToken()` | Même contrôle depuis un contrôleur |
| `$user->authorise('core.login.api', …)` | Droit de login API (insuffisant seul) |
| `$user->authorise('core.login.site', …)` | Second droit exigé pour l'API |

---

## Pièges Fréquents

### Piège 1 : Un seul droit de login

⚠️ **Problème** : tu accordes `core.login.api` et tu t'arrêtes.

✅ **Solution** : le compte doit aussi avoir `core.login.site`. Les deux sont exigés.

---

### Piège 2 : Jeton CSRF = ACL

⚠️ **Problème** : `checkToken()` passe, tu écris en base.

✅ **Solution** : enchaîne `authorise(action, asset)`. Un jeton valide ne prouve ni l'authentification métier ni le droit.

---

### Piège 3 : Manuel Web Services 6.1 comme tutoriel complet

⚠️ **Problème** : tu suis la page 6.1 comme un guide d'implémentation à jour. Elle est encore titrée Joomla 4.x ; le tutoriel API est un stub inachevé.

✅ **Solution** : retenir le contrat `/api/index.php/v1` + `X-Joomla-Token` + les deux droits. Pour du code d'exemple versionné, les specs Cypress API du tag.

---

### Piège 4 : CORS d'une version < 6.1.3

⚠️ **Problème** : tu documentes le comportement d'une 6.1.2.

✅ **Solution** : CVE-2026-71573 concerne 4.0.0-5.4.7 et 6.0.0-6.1.2. La correction inspectée est 6.1.3 (`isOriginAllowed`).

---

## Checklist de Validation

- [ ] Je construis l'URL sous `/api/index.php/v1`
- [ ] Je pose `X-Joomla-Token` et les deux droits `core.login.api` **et** `core.login.site`
- [ ] Je sépare CSRF, jeton API et `authorise`
- [ ] Je sais que `HTTP_X_CSRF_TOKEN` est un canal CSRF, pas l'en-tête API
- [ ] Je date CORS à 6.1.3 / CVE-2026-71573

---

## Exercice Pratique

**Énoncé** : Un collègue dit : « J'ai mis le jeton dans l'en-tête, donc CSRF et ACL sont bons, et n'importe quel navigateur peut appeler `/v1`. » Écris une correction en quatre phrases, une par affirmation fausse ou incomplète.

**Indications** :

- Quel en-tête est l'API ? Quel en-tête est le CSRF ?
- Quels deux `core.login.*` ?
- `checkToken` vs `authorise`
- `isOriginAllowed` vs « n'importe quel navigateur »

**Résultat attendu** : quatre phrases, sans secret, ancrées 6.1.3.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

1. **En-tête** : `X-Joomla-Token` authentifie l'API. Le CSRF HTML utilise `form.token` ou `HTTP_X_CSRF_TOKEN`. Ce n'est pas le même objet.
2. **Login** : le compte doit avoir `core.login.api` **et** `core.login.site`. Un seul droit ne décrit pas le contrat.
3. **ACL** : ni le jeton API ni le jeton CSRF ne remplacent `$user->authorise(action, asset)`.
4. **CORS** : `isOriginAllowed` compare `Origin` à `cors_allow_origin` (strict). Ce n'est pas « n'importe quel navigateur », sauf configuration `*` (sans credentials). En 6.1.2 ce code n'existait pas sous cette annotation ; la CVE-2026-71573 est corrigée en 6.1.3.

---

## Navigation

← Fiche précédente : **[Plugin console et CLI](19-plugin-console-et-cli.md)**

→ Fiche suivante : **[Sécurité : escape, uploads, SameSite](21-securite-escape-uploads-samesite.md)**
