# Passage 3B - SameSite, uploads OWASP, XSS com_content, favicons, joomla.asset.json

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3, manuel 6.1 Current, guide.joomla.org  
**Les `[S1]` à `[S23]` de ce fichier** correspondent à `P3B-S1` ... `P3B-S23` dans [sources.md](sources.md).

---

Le CMS Joomla 6.1.3 n'expose **aucune option SameSite** : ni champ de configuration globale, ni paramètre de `JoomlaStorage`, ni en-tête du plugin HTTP Headers, ni mention dans le manuel programmeur 6.1 Current.

Les contrôles d'upload recoupent des points des cheat sheets OWASP (liste blanche d'extensions, double extension, MIME lu sur le fichier) **sans couverture OWASP complète** : `isSafeFile` n'est pas sur le chemin `com_media` inspecté, le sanitizer SVG ne réécrit pas le fichier, le stockage reste sous la racine web.

Cassiopeia résout les favicons via `HTMLHelper::image` vers des fichiers livrés sous `media/system/images` ; un homonyme dans le `joomla.asset.json` enfant **remplace** l'entrée parent, sans fusion de propriétés.

## Cookies SameSite (API stable, interne, plugin, framework)

L'API stable de configuration globale n'offre, dans le fieldset cookie de `application.xml`, que `cookie_domain` et `cookie_path` ; les chaînes de langue et `configuration.php-dist` exposent les mêmes deux propriétés, sans champ `samesite` / `cookie_samesite`. [S1]

Le manuel 6.1 Current documente `JoomlaStorage` uniquement pour le domaine et le chemin de cookie dans l'objet d'options du constructeur, et les cookies de session uniquement via Session lifetime (Global Configuration / System) : ni SameSite ni `session.cookie_samesite`. [S5]

Côté implémentation interne, `JoomlaStorage` ne lit ni n'applique SameSite : `setOptions()` recopie `cookie_domain`, `cookie_path` et `force_ssl`, puis `setCookieParams()` appelle `session_set_cookie_params` à cinq arguments (HttpOnly forcé à `true`, pas d'argument ni de clé SameSite) ; `clear()` utilise `setcookie` sans SameSite. [S2]

Détail vendor, pas un réglage CMS : `composer.lock` pince `joomla/session` 4.0.0 ; `NativeStorage::setOptions` (utilisé via `JoomlaStorage`) n'autorise qu'une liste blanche (`cookie_domain`, `cookie_path`, `cookie_secure`, `cookie_httponly`, `cookie_lifetime`, etc.) et **ignore** `cookie_samesite` ; les manuels 6.1 inspectés ne nomment pas `php.ini` `session.cookie_samesite` comme option CMS. [S3]

Le plugin `plugins/system/httpheaders` et le guide HTTP Headers couvrent CSP, HSTS, X-Frame-Options, Referrer-Policy, COOP et en-têtes voisins ; **pas** de `Set-Cookie`, SameSite ni Secure de cookie (le « Secure » du plugin est HSTS). [S4]

API framework distincte (`joomla/input` 4.0.0, hors config globale et hors session CMS) : `Joomla\Input\Cookie::set` documente une clé optionnelle `samesite` (`Lax` ou `Strict`) ; l'omettre n'écrit pas l'attribut. Cette API n'est pas utilisée par `JoomlaStorage::setCookieParams`. [S6]

Contexte historique, pas 6.1.3 : le PR joomla-cms#25414 (ajouter SameSite à la config globale) a été fermé non fusionné en 2022. Le plugin Authentication - Cookie appelle `cookie->set` sans `samesite` (hors surfaces demandées, non relu en détail).

## Téléversements : recoupement OWASP File Upload (couverture partielle)

`MediaHelper::canUpload` éclate le nom sur **chaque point**, rejette tout segment restant dans `EXECUTABLES ∪ FORBIDDEN_FILE_EXTENSIONS` (`php`, `phtml`, `phar`, `js`, `html`, etc.) et exige que l'extension finale soit dans `restrict_uploads_extensions` (défaut `bmp`, `gif`, `jpg`, `jpeg`, `png`, `webp`, `avif`, `ico`, `mp3`, ..., `pdf`, `txt`, `xls`, `csv`) ou `ignore_extensions` : recoupement liste blanche et double extension (`.jpg.php`). [S7]

Si `restrict_uploads` et `check_mime` (défauts `1`), `getMimeType` lit les octets (`exif_imagetype`, `getimagesize`, `mime_content_type`, `finfo`) puis `checkMimeType` allowliste `upload_mime` ; le `Content-Type` HTTP n'est pas lu. Le contrôle MIME tombe si l'un des deux flags est désactivé. [S8]

`InputFilter::isSafeFile` (et le clone `File::isSafeFile`) scanne octet nul, `<?php`, short-tag `<?` sur certaines extensions, stub PHAR `__HALT_COMPILER()`, et `.php` dans zip/rar. Sur le chemin média inspecté, `LocalAdapter::checkContent` n'appelle que `canUpload` puis `File::write` ; `File::upload` (filesystem 4.2) lance `isSafeFile` seulement si `allowUnsafe=false` (tracker #48038). [S9]

Pour un `.svg`, `canUpload` délègue à `isValidSvg` (`enshrined/svg-sanitize` `^0.22.0`) : `sanitize()` du contenu, rejet si `false` ou s'il reste des `XmlIssues` hors commentaires / attributs `space` et `enable-background` / nœud `svg`. Ce n'est **pas** un CDR : `LocalAdapter` écrit le `$data` original. `svg` et `image/svg+xml` sont absents des défauts 6.1.3 de `restrict_uploads_extensions` et `upload_mime`. [S10]

Les chemins files vs images ne sont pas dans `canUpload` / `isSafeFile` : `config.xml` fixe `file_path=files` et `image_path=images` ; le plugin filesystem local expose par défaut les répertoires `images` et `files`. `LocalAdapter::getUrl` concatène `Uri::root()` + chemin : stockage et récupération **sous la racine web**, contrairement à la priorité OWASP hôte séparé puis hors webroot. [S11]

Non inspectés ici (donc non tranchés) : antivirus, nom aléatoire, scan asynchrone, quota ; carte exhaustive des appelants de `isSafeFile` hors `File::upload`.

## XSS dans les vues cœur `com_content` (OWASP XSS, couverture partielle)

Les layouts cœur n'échappent pas uniformément : `created_by_alias` / auteur sont concaténés et affichés sans encodage HTML (`info_block/author.php` ; `default_articles.php` via `HTMLHelper::link`, qui n'encode ni `href` ni texte) ; `alternative_readmore` est echo brut (`readmore.php`, `aria-label` échappé) ; `urla` / `urlb` / `urlc` ne reçoivent que `htmlspecialchars` sans allowliste `http(s)` (`default_links.php`). Titres, légendes d'image et attributs `joomla.html.image` (`src` / `alt`, `ENT_QUOTES`) sont encodés. [S12]

Hors périmètre : sanitisation à l'enregistrement (`articletext` / éditeur / `InputFilter`) ; tmpl administrator `com_content` ; autres composants que `com_content`. Pas de revendication de couverture XSS du cœur entier.

## Favicons, `HTMLHelper::image` et mises à jour

Cassiopeia 6.1.3 enregistre `joomla-favicon.svg`, `favicon.ico` et `joomla-favicon-pinned.svg` via `HTMLHelper::_('image', ..., [], true, 1)` : chemin relatif au dossier `images`, valeur = URL du premier fichier trouvé par `includeRelativeFiles`. [S13]

Sur le tag 6.1.3, ces trois fichiers sont dans `build/media_source/system/images`, **pas** dans `build/media_source/templates/site/cassiopeia/images` (qui contient `logo.svg`, `select-bg*.svg`, `template_preview.png`, `template_thumbnail.png`). `recreate-media.mjs` copie `media_source` vers `media/` (filtre : hors `.js` / `.css` seulement). Le tag git n'a pas l'arbre `media/` (artefact de build). [S14]

`update:joomla:remove-old-files` n'appelle que `JoomlaInstallerScript::deleteUnexistingFiles()` : la liste 6.1.3 n'a aucune entrée `favicon.ico`, `joomla-favicon*`, `cassiopeia/images` ni `media/system/images` (restes Cassiopeia : anciens CSS/SCSS). Cette commande n'infirme ni ne prouve un écrasement. [S15]

La copie CLI `core:update` (`Folder::copy` de l'extrait vers `JPATH_BASE`) écrase les fichiers dont le chemin existe dans le paquet, et ne supprime pas les fichiers extra du dossier cible. Un favicon **ajouté** sous `media/templates/site/cassiopeia/images` n'est pas écrasé si ce nom n'est pas dans le paquet ; le **même nom** sous `media/system/images` le serait, car il est dans `media_source/system/images`. ZIP Full/Update 6.1.3 non décompressé : inférence via le pipeline de build, pas listing d'archive. [S16]

Le conflit de guides se résout sans `html/` ni héritabilité : « will not be affected » vise l'ajout des trois noms **non livrés** dans `media/templates/site/cassiopeia/images` (comme `user.css`) ; « ne pas modifier les médias parents » vise les fichiers **livrés** (logo, CSS). Le même article Favicons déploie aussi vers `media/templates/site/{yourtemplate}/images` (exemple `cassiopeia-green`) ; Child Templates : les fichiers enfant « are not affected by Joomla updates ». [S17]

Nuance de recherche relative : `includeRelativeFiles` pose `$templaPath` à `JPATH_THEMES` sauf si le template est héritable ou a un parent ; un style non héritable est cherché sous le dossier thème, pas sous `media/templates`. L'extract web `com_joomlaupdate` n'a pas été relu (seulement la copie CLI).

## Fusion `joomla.asset.json` enfant vs parent

Un asset homonyme (même `type` et `name`) issu d'un `joomla.asset.json` chargé plus tard **remplace** entièrement l'entrée précédente : pas de fusion de `uri`, dépendances ou attributs, pas d'ignorance. `WebAssetRegistry::add()` stocke `$this->assets[$type][$name]` et, en collision, émet l'événement `override` puis assigne le nouvel `WebAssetItem` ; `parseRegistryFile` crée un item par objet JSON et appelle `add()`. [S18]

Pour un template enfant, `SiteApplication::dispatch` et `AdministratorApplication::dispatch` enregistrent le `joomla.asset.json` **parent d'abord**, enfant ensuite ; `parseRegistryFiles` parcourt `dataFilesNew` dans cet ordre, donc l'homonyme enfant l'emporte. [S19]

`addTemplateRegistryFile` et `addExtensionRegistryFile` n'implémentent **aucune** règle parent/enfant : chacune n'enfile qu'un chemin via `addRegistryFile()` (template site `templates/{template}/joomla.asset.json` ou admin `{admin}/templates/{template}/joomla.asset.json` ; extension `media/{name}/joomla.asset.json`). Un chemin déjà dans `dataFilesNew` / `dataFilesParsed` est ignoré ; un chemin sans fichier sur disque n'est pas enfilé. [S20]

Les deux fichiers sont chargés : les assets déclarés seulement dans le parent **restent** ; seules les clés `type`+`name` identiques sont écrasées. [S21]

Les tests 6.1.3 couvrent le remplacement homonyme via `WebAssetRegistry::add()` (événement `override`) et le parse d'**un** JSON de fixture ; ils n'exercent pas `addTemplateRegistryFile` / `addExtensionRegistryFile` parent vs enfant. [S22]

La documentation programmeur 6.1 (Web Asset Manager, Register / Overriding) affirme qu'une définition ultérieure de même nom d'item remplace la précédente. [S23]

Ce remplacement de registre est distinct du fallback `HTMLHelper` `mediaPath`, qui peut encore résoudre une URI relative contre les dossiers médias enfant puis parent **après** l'enregistrement de l'item.

## Pièges

- Chercher SameSite dans Global Configuration, `JoomlaStorage`, `httpheaders` ou le manuel session : le CMS 6.1.3 **n'expose pas** cette option. `force_ssl` et HSTS ne posent pas l'attribut SameSite ni `Set-Cookie; Secure`.
- Utiliser `Joomla\Input\Cookie::set(..., ['samesite' => 'Lax'])` en croyant régler le cookie de **session** CMS : API framework distincte, non branchée sur `setCookieParams`.
- Compter sur `isSafeFile` pour `com_media` : le chemin inspecté s'arrête à `canUpload` + `File::write`. Désactiver `restrict_uploads` ou `check_mime` retire le MIME par octets.
- Croire qu'un `.svg` « sanitisé » est réécrit : le sanitizer est un validateur booléen ; le fichier original est stocké. `svg` n'est pas dans les allowlistes par défaut.
- Éditer `media/system/images/favicon.ico` (ou les `joomla-favicon*`) : noms livrés, écrasables à l'update. Déposer les **mêmes** noms sous `media/templates/site/cassiopeia/images` (ou un template enfant) est le scénario « will not be affected ».
- Attendre une fusion champ à champ de `joomla.asset.json` : l'enfant **remplace** l'item entier ; un asset parent sans homonyme enfant survit.

## Glossaire de ce passage

| Nom | Rôle | Type |
| --- | ---- | ---- |
| SameSite | Attribut cookie Lax/Strict | **absent** de l'API CMS 6.1.3 inspectée |
| `application.xml` cookie fieldset | `cookie_domain`, `cookie_path` seulement | API stable |
| `JoomlaStorage` / `NativeStorage` | Session ; ignore `cookie_samesite` | détail interne |
| `Joomla\Input\Cookie::set` | Clé optionnelle `samesite` | API framework, pas la session CMS |
| plg_system_httpheaders | CSP, HSTS, XFO, Referrer-Policy, COOP | reco ; pas Set-Cookie |
| Allowliste d'extensions | Dernière extension dans `restrict_uploads_extensions` / `ignore_extensions` | API stable |
| CDR | Réécriture du fichier malveillant | **non fait** pour le SVG `com_media` |
| Homonyme d'asset | Même `type` + `name` dans le registre WAM | API stable (dernier gagne) |
| `HTMLHelper::image` `returnPath` 1 | URL du premier fichier `images/` trouvé | API stable |

## Lacunes encore ouvertes de ce passage

- Listing réel des ZIP Full/Update 6.1.3 : non décompressés ; écrasement des favicons livrés inféré de `media_source` + `Folder::copy`.
- Effet d'une valeur brute `php.ini` `session.cookie_samesite` **avant** `NativeStorage::setOptions` : non établi ; Joomla ne la documente pas et ne l'applique pas.
- Tests d'intégration parent/enfant sur deux `joomla.asset.json` templates : absents ; remplacement prouvé par `add()` + ordre `dispatch`.
- Autres vues / composants que les layouts `com_content` cités.
- Recoupements OWASP File Upload non inspectés (antivirus, nom aléatoire, scan asynchrone, quota).
- Extract web `com_joomlaupdate` non relu (seulement copie CLI).
