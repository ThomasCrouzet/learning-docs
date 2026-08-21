---
tags:
  - Joomla
  - Sécurité
  - Pratique
description: "HtmlView::escape (ENT_QUOTES), pièges des layouts com_content, canUpload vs isSafeFile, SVG validé non réécrit, filterText puis echo, absence SameSite CMS."
estimated_time: "55 min"
fiche_number: 21
total_fiches: 24
cursus: "Joomla CMS"
---

# 21 - Sécurité : escape, uploads, SameSite

> **En bref** : Échapper avec `HtmlView::escape` (`htmlspecialchars`, `ENT_QUOTES`), reconnaître les layouts `com_content` qui ne le font pas, décrire `canUpload` (et l'absence d'`isSafeFile` sur le chemin `com_media` inspecté), et enseigner qu'il n'existe pas d'option SameSite CMS. Lecture estimée : 55 min.

## Prérequis

- Avoir lu [API /v1, CSRF et CORS](20-api-v1-csrf-cors.md) (XSS peut contourner le CSRF)
- Avoir lu [ACL : authorise et view levels](08-acl-authorise-et-view-levels.md)
- CMS 6.1.3, PHP 8.3 (signature à 5 arguments de `session_set_cookie_params`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras quand `escape()` s'applique, où `com_content` echo sans encodage, ce que `canUpload` contrôle, et comment `session.cookie_samesite` de php.ini est **préservé** sans option CMS.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `HtmlView::escape` ?

**Définition** : `HtmlView::escape()` appelle `htmlspecialchars(..., ENT_QUOTES, UTF-8)` et convertit `null` en chaîne vide `''`. Pour du JavaScript, le pendant est `OutputFilter::stringJSSafe()` (séquences `\uXXXX`).

**Le problème que `escape()` résout** :

Sans encodage de sortie, voici les problèmes rencontrés :

1. **XSS dans le HTML** : un caractère `<` ou `"` issu d'un champ devient une balise ou un attribut.
2. **Quotes dans les attributs** : sans `ENT_QUOTES`, `'` et `"` restent dangereux selon le délimiteur.
3. **`null` affiché n'importe comment** : `escape()` normalise vers `''`.

**Comment `escape()` résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Texte HTML | Entités via `htmlspecialchars` |
| Attributs | `ENT_QUOTES` |
| `null` | Chaîne vide |

**Analogie concrète** : `escape()` est l'étiquette collée sur un carton : le nom s'affiche, il n'est plus lu comme une instruction d'emballage. L'étiquette ne lave pas le carton (ce n'est pas `filterText` à l'enregistrement).

**Ce que `escape()` n'est PAS** :

- Ce n'est pas appliqué partout dans `com_content`. Titres, légendes d'image et attributs `joomla.html.image` (`src` / `alt`, `ENT_QUOTES`) sont encodés. En revanche `created_by_alias` / auteur sont concaténés sans encodage HTML (`info_block/author.php` ; `default_articles.php` via `HTMLHelper::link`, qui n'encode ni `href` ni texte) ; `alternative_readmore` est echo brut (`readmore.php` ; `aria-label` échappé) ; `urla` / `urlb` / `urlc` n'ont que `htmlspecialchars` sans allowliste `http(s)` (`default_links.php`).
- Ce n'est pas le filtre d'enregistrement. Le champ `articletext` (idem `introtext` / `fulltext`) passe par `ComponentHelper::filterText`. La vue site `article/default.php` fait ensuite `echo $this->item->text` **sans** encodage d'entités (le titre voisin passe par `$this->escape`).
- Ce n'est pas couvert par un test unitaire `HtmlViewTest.php` (404 au tag). `AbstractViewTest.php` n'appelle pas `escape()`.

**`filterText` puis echo** : `filterText` encode les `mailto` en punycode, lit les Text Filters du groupe, saute tout filtre si `NONE`, sinon `InputFilter::clean(..., 'html')`. Guide d'installation : Public / Guest / Registered = NH (plus de HTML) ; autres groupes sauf Super Users = BL ; Super Users = **NONE**. Super Users : aucun `InputFilter` à l'enregistrement, puis HTML brut en front. InputFilter n'est pas DOMPurify. Aucune charge utile n'a été testée dans le corpus.

Hors `com_content`, `com_contact` echo `name` / `con_position` / `address` bruts ; sans attribut `filter`, `FormField::filter()` passe quand même par un `clean()` type string (tags retirés). L'absence d'échappement gabarit n'est pas une preuve d'exploit après ce filtre STRING.

---

### Qu'est-ce que `MediaHelper::canUpload` ?

**Définition** : `canUpload()` est le contrôle d'upload de `com_media` appelé depuis `LocalAdapter::checkContent`. Il éclate le nom sur **chaque point**, refuse tout segment restant dans `EXECUTABLES ∪ FORBIDDEN_FILE_EXTENSIONS` (`php`, `phtml`, `phar`, `js`, `html`, …) et exige que l'extension **finale** soit dans `restrict_uploads_extensions` (défaut `bmp`, `gif`, `jpg`, `jpeg`, `png`, `webp`, `avif`, `ico`, `mp3`, …, `pdf`, `txt`, `xls`, `csv`) ou `ignore_extensions`.

**Le problème que `canUpload` résout** :

Sans ce contrôle, voici les problèmes rencontrés :

1. **Double extension** : `photo.jpg.php` passerait une allowliste naïve « se termine par une image ».
2. **MIME déclaré par le navigateur** : le `Content-Type` HTTP n'est pas une preuve.
3. **Fichier trop gros** : `upload_maxsize` (défaut 10 Mo) est converti en octets ; `0` = pas de limite applicative (reste PHP).

**Comment `canUpload` résout ces problèmes** :

| Contrôle | Comportement 6.1.3 |
| -------- | ------------------ |
| Double extension | Rejet si un segment est exécutable / interdit |
| Allowliste | Extension finale dans `restrict_uploads_extensions` / `ignore_extensions` |
| MIME | Si `restrict_uploads` **et** `check_mime` (défauts `1`) : octets via `exif_imagetype` / `getimagesize` / `mime_content_type` / `finfo`, allowliste `upload_mime`. Le `Content-Type` HTTP n'est **pas** lu |
| Taille | Plafond **par fichier** seulement (pas de quota agrégé) |
| Nom | `getSafeName` / `File::makeSafe` (translittération, pas d'UUID) |

**Analogie concrète** : `canUpload` est le vigile à la porte du hangar `images/` / `files/`. Il lit **chaque** étiquette entre les points du nom, pèse le colis, et peut ouvrir le carton (octets MIME). Il ne renomme pas le colis avec un numéro de suivi généré.

**Ce que `canUpload` n'est PAS** :

- Ce n'est pas `InputFilter::isSafeFile`. `isSafeFile` scanne octet nul, `<?php`, short-tag, stub PHAR, `.php` dans zip/rar. Sur le chemin média **inspecté**, `LocalAdapter::checkContent` n'appelle que `canUpload` puis `File::write`. `File::upload` lance `isSafeFile` seulement si `allowUnsafe=false`.
- Ce n'est pas une réécriture SVG. Pour un `.svg`, `isValidSvg` (`enshrined/svg-sanitize` ^0.22.0) valide (rejet si `sanitize()` échoue ou s'il reste des `XmlIssues` hors commentaires / attributs `space` et `enable-background` / nœud `svg`). `LocalAdapter` écrit le `$data` **original**. `svg` et `image/svg+xml` sont **absents** des allowlistes par défaut 6.1.3.
- Ce n'est pas un stockage hors racine web. `LocalAdapter::getUrl` concatène `Uri::root()` + chemin. Ce n'est pas une couverture OWASP complète.

---

### L'option SameSite CMS n'existe pas

**Définition** : Le CMS 6.1.3 n'expose **aucune** option SameSite : pas de champ dans le fieldset cookie de `application.xml` (seulement `cookie_domain` et `cookie_path`), pas de paramètre de `JoomlaStorage`, pas d'`Set-Cookie` dans le plugin `httpheaders` (CSP, HSTS, X-Frame-Options, Referrer-Policy, COOP ; le « Secure » du plugin est HSTS), pas de page manuelle Current.

**Le problème que cette absence impose** :

Sans option CMS, voici les faits à retenir :

1. **Tu ne règles pas SameSite dans Global Configuration.**
2. **`JoomlaStorage::setCookieParams()`** recopie `lifetime` / `path` / `domain` / `secure` depuis `session_get_cookie_params()`, force `httponly` à `true`, et appelle `session_set_cookie_params` à **cinq arguments**. Pas de clé `samesite`.
3. **php.ini est préservé** : en PHP 8.3, la forme à cinq paramètres n'assigne pas `samesite` et n'appelle `zend_alter_ini_entry("session.cookie_samesite", ...)` que si la signature **tableau** est utilisée. Une valeur INI déjà en vigueur n'est **pas** vidée.

**Comment l'INI et le remember-me se comportent** :

| Surface | SameSite |
| ------- | -------- |
| Session CMS (`setCookieParams` 5 args) | INI `session.cookie_samesite` **préservé** |
| Défaut INI `""` | Aucun attribut SameSite émis sur le cookie de session |
| `NativeStorage::setOptions` | Ignore `cookie_samesite` (liste blanche) |
| Authentication - Cookie (remember-me) | `cookie->set` sans `samesite` (`expires`, `path`, `domain`, `secure`, `httponly => true`) |
| `Joomla\Input\Cookie::set` | Clé optionnelle `samesite` Lax/Strict : API **framework**, pas branchée sur la session CMS |

**Analogie concrète** : Le CMS n'a pas de bouton « SameSite » sur le tableau de bord. Si l'hébergeur a déjà collé une étiquette sur le cookie via php.ini, Joomla ne l'arrache pas (appel à 5 arguments). Le cookie « se souvenir de moi » part **sans** cette étiquette.

**Ce que cette absence n'est PAS** :

- Ce n'est pas « l'INI est vidé ». Lire « pas de paramètre samesite » comme un reset est faux.
- Ce n'est pas un défaut Lax posé par le CMS. Le défaut navigateur en l'absence d'attribut est hors sources PHP/Joomla inspectées.
- Ce n'est pas `force_ssl` ni HSTS : ils ne posent ni SameSite ni `Set-Cookie; Secure` au sens cookie de session.

---

## Étapes Pratiques

### Étape 1 : Échapper une sortie de vue

Dans un layout d'extension :

```php
echo $this->escape($item->title);
```

**Résultat attendu** : `ENT_QUOTES`, UTF-8, `null` -> `''`. Pour un titre `com_content` cœur, le voisin `$item->text` n'emprunte **pas** ce chemin.

---

### Étape 2 : Relire quatre layouts `com_content`

Ouvre et annote (sans patch cœur) :

1. `info_block/author.php` : alias / auteur sans encodage HTML.
2. `readmore.php` : `alternative_readmore` brut, `aria-label` échappé.
3. `default_links.php` : `urla` / `urlb` / `urlc` sans allowliste `http(s)`.
4. `article/default.php` : `echo $this->item->text` après `filterText` à l'enregistrement.

**Résultat attendu** : une liste « échappé / non échappé » fidèle au tag, pas une affirmation « tout le cœur est safe ».

---

### Étape 3 : Tracer un upload `com_media`

1. Laisse `restrict_uploads` et `check_mime` à `1`.
2. Refuse mentalement `image.jpg.php` (segment `php`).
3. Ne compte pas sur `isSafeFile` : il n'est pas sur ce chemin inspecté.
4. Pour un SVG : validation booléenne, fichier original écrit ; ajoute `,svg` et `,image/svg+xml` seulement si tu acceptes ce risque, conformément au guide SVG (sanitizer depuis 4.1, absent des défauts).

---

### Étape 4 : Poser SameSite **hors** CMS si besoin

1. Cherche SameSite dans Global Configuration : champ **absent**.
2. Si tu dois poser l'attribut de session, c'est **php.ini** `session.cookie_samesite` (préservé par l'appel 5 args).
3. Vérifie que le remember-me n'a toujours pas l'attribut.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `$this->escape($texte)` | `htmlspecialchars` `ENT_QUOTES` UTF-8 |
| `OutputFilter::stringJSSafe($js)` | Échapper pour un contexte JS (`\uXXXX`) |
| `MediaHelper::canUpload(...)` | Allowliste, double extension, MIME octets, taille, SVG |
| `InputFilter::isSafeFile(...)` | Autre API : **pas** le chemin `com_media` inspecté |
| `ComponentHelper::filterText(...)` | Filtre d'enregistrement `articletext` |
| php.ini `session.cookie_samesite` | Seul levier session observé (préservé, pas une option CMS) |

---

## Pièges Fréquents

### Piège 1 : Croire que `escape()` couvre alias / readmore / urla

⚠️ **Problème** : tu échappes le titre et tu conclus que la fiche article est cohérente.

✅ **Solution** : relis les quatre layouts listés. `HTMLHelper::link` n'encode ni `href` ni texte.

---

### Piège 2 : Compter sur `isSafeFile` pour `com_media`

⚠️ **Problème** : tu désactives `restrict_uploads` ou `check_mime` en pensant qu'`isSafeFile` reste.

✅ **Solution** : `checkContent` = `canUpload` + `File::write`. Désactiver un des deux flags retire le MIME par octets.

---

### Piège 3 : SVG « sanitisé » = fichier réécrit

⚠️ **Problème** : tu crois qu'`enshrined/svg-sanitize` enregistre la version nettoyée.

✅ **Solution** : c'est un validateur booléen. Le `$data` original est stocké. `svg` n'est pas dans l'allowliste par défaut.

---

### Piège 4 : SameSite dans le CMS ou INI « vidé »

⚠️ **Problème** : tu cherches un champ Global Configuration, ou tu lis l'appel 5 args comme un reset INI.

✅ **Solution** : pas d'option CMS. L'INI est **préservé**. Remember-me sans `samesite`. `Cookie::set` framework ≠ session CMS.

---

## Checklist de Validation

- [ ] J'appelle `escape()` (`ENT_QUOTES`) sur les sorties HTML que je contrôle
- [ ] Je peux citer alias / auteur / readmore / `urla` comme pièges `com_content`
- [ ] Je décris `filterText` puis `echo $item->text`, y compris Super Users `NONE`
- [ ] Je ne place pas `isSafeFile` sur le chemin `com_media` inspecté
- [ ] Je sais que SameSite CMS est absent et que l'INI est préservé

---

## Exercice Pratique

**Énoncé** : Pour chaque affirmation, réponds vrai / faux et une justification d'une phrase.

1. `HtmlView::escape` utilise `ENT_QUOTES`.
2. `created_by_alias` passe par `escape()` dans `info_block/author.php`.
3. `isSafeFile` est appelé par `LocalAdapter::checkContent`.
4. Un SVG accepté est réécrit par le sanitizer avant `File::write`.
5. `setCookieParams` à 5 arguments vide `session.cookie_samesite`.
6. Le cookie remember-me envoie un attribut SameSite.

**Résultat attendu** : six réponses V/F + justification, ancrage 6.1.3 / PHP 8.3.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

1. **Vrai** : `htmlspecialchars(..., ENT_QUOTES, UTF-8)`, `null` -> `''`.
2. **Faux** : alias / auteur sans encodage HTML.
3. **Faux** : `canUpload` puis `File::write` seulement sur le chemin inspecté.
4. **Faux** : validation booléenne, `$data` original écrit.
5. **Faux** : PHP 8.3 préserve l'INI ; seul le tableau d'options pose `samesite`.
6. **Faux** : Authentication - Cookie n'inclut pas `samesite`.

---

## Navigation

← Fiche précédente : **[API /v1, CSRF et CORS](20-api-v1-csrf-cors.md)**

→ Fiche suivante : **[Architecture : DI et événements](22-architecture-di-evenements.md)**
