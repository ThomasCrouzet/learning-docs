# Passage 4B - SameSite php.ini, OWASP restant, extract web joomlaupdate

**Statut** : Partial  
**Date de consultation** : 20 août 2026  
**Cible** : tag `joomla-cms` 6.1.3, PHP 8.3  
**Les `[S1]` à `[S24]` de ce fichier** correspondent à `P4B-S1` ... `P4B-S24` dans [sources.md](sources.md).

---

Au tag 6.1.3, l'appel à cinq arguments de `JoomlaStorage` **préserve** `session.cookie_samesite` : PHP 8.3 ne le réinitialise pas et ne l'ignore pas à l'émission du cookie de session. Le plugin Authentication - Cookie n'envoie **pas** d'attribut SameSite.

À l'enregistrement, `articletext` est passé par `filterText` / InputFilter (et TinyMCE côté client) ; la vue site echo `$item->text` brut.

`com_media` n'a qu'un plafond **par fichier** et stocke un nom utilisateur sanitizé, pas un identifiant généré ; hors `com_content`, `com_contact` echo des champs texte et des `href` sans échappement.

L'extract web écrase un homonyme du paquet comme le CLI, et conserve un extra sous `media/templates/` s'il n'est ni entrée ZIP ni piste d'obsolescence.

## SameSite : l'INI est préservé, le remember-me n'a pas l'attribut

`JoomlaStorage::setCookieParams()` recopie `lifetime` / `path` / `domain` / `secure` depuis `session_get_cookie_params()`, force `httponly` à `true`, et appelle `session_set_cookie_params($lifetime, $path, $domain, $secure, true)` : pas d'argument `samesite`, pas de signature tableau. [S1]

En PHP 8.3, la forme à cinq paramètres n'a pas de paramètre SameSite ; seule la signature tableau (PHP 7.3+, clés `lifetime`, `path`, `domain`, `secure`, `httponly`, `samesite`) permet de le poser. [S2]

Résultat explicite : la branche à cinq arguments n'assigne jamais `samesite` et n'appelle `zend_alter_ini_entry("session.cookie_samesite", ...)` que lorsque la clé tableau est présente. Une valeur php.ini déjà en vigueur est donc **préservée**, pas reset à la chaîne vide par défaut. [S3] Cette valeur est ensuite **utilisée** : `php_session_send_cookie()` n'ajoute l'attribut que si `PS(cookie_samesite)` est non vide ; le défaut INI `""` signifie aucun attribut SameSite sur le cookie de session. [S4]

Le plugin Authentication - Cookie n'inclut `samesite` dans aucun `cookie->set()` : remember-me (`onUserAfterLogin`) passe `expires`, `path`, `domain`, `secure`, `httponly => true`. [S5] En PHP 8.3, l'omission de `samesite` n'émet pas l'attribut. [S6]

Le CMS ne fixe pas `session.cookie_samesite` : l'effet dépend de php.ini (préservé, éventuellement vide). Le défaut navigateur quand l'attribut est absent (Lax moderne) est hors sources PHP/Joomla inspectées.

## Sanitisation à l'enregistrement vs echo de `$item->text`

`articletext` n'est pas stocké brut : dans `article.xml`, le champ éditeur (idem `introtext` / `fulltext`) a `filter="\Joomla\CMS\Component\ComponentHelper::filterText"`. [S7]

`filterText` encode d'abord les `mailto` en punycode, lit les Text Filters du groupe, saute tout filtre si `NONE`, sinon construit un `InputFilter` et `clean(..., 'html')` : NH / défaut = liste blanche vide (plus de HTML) ; BL / CBL = listes de blocage ; WL = allowlist avec `xssAuto = 0`. Tags bloqués par défaut : `script`, `iframe`, `applet`, `object`, `embed`, `style`, `base`, `meta`, `link`, etc. ; avec `xssAuto`, tout attribut `on*` est retiré. Install (guide) : Public / Guest / Registered = NH ; autres groupes sauf Super Users = BL ; Super Users = NONE. [S8]

TinyMCE (éditeur par défaut) : si « Use Joomla Text Filter » est Off (défaut), `invalid_elements` vaut `script,applet,iframe`. Editor-None contourne TinyMCE, pas les filtres globaux. [S9]

La vue site `article/default.php` fait `echo $this->item->text` dans le body, sans encodage d'entités (le titre voisin passe par `$this->escape`). OWASP traite ce HTML de body comme cas de **sanitisation**, pas d'encodage d'entités. La défense observée est le filtre à l'enregistrement, pas l'échappement de sortie. [S10]

InputFilter n'est pas DOMPurify. Aucune charge utile n'a été testée.

## Uploads com_media : taille et nom

Les params `com_media` n'exposent ni quota de stockage, ni nombre de fichiers, ni quota par utilisateur. Le seul champ de taille est `upload_maxsize` (défaut 10 Mo) : zéro = pas de limite applicative. [S13] `MediaHelper::canUpload` convertit en octets et refuse si dépassement. [S14]

`LocalAdapter` ne tire pas un nom aléatoire : `createFile` fait `$name = getSafeName($name)` puis `File::write`. `uniqid()` ne sert qu'à un temporaire de `checkContent`. [S16] `File::makeSafe` : translitération, caractères hors `[A-Za-z0-9._-` espace] retirés ; pas d'UUID, pas de plafond de longueur. [S17]

Recoupement File Upload : plafond **par fichier** en place ; pas de quota agrégé ; le nom reste un nom utilisateur sanitizé, alors que la fiche OWASP exige un nom généré. [S18]

## Échappement manquant hors com_content : com_contact

Dans `com_contact`, `name`, `con_position`, `address`, `suburb`, `telephone` (et champs liés) sont des `text` / `textarea` **sans** `filterText`. Le gabarit site echo `$this->item->name` et `con_position` bruts ; `default_address.php` fait `nl2br($this->item->address)` et echo brut. Sans attribut `filter`, `FormField::filter()` passe quand même par `InputFilter::clean()` type string (tags retirés). L'absence d'échappement est dans le gabarit ; ce n'est pas une preuve d'exploit après ce filtre STRING. [S11]

`default_links.php` préfixe `http://` si besoin, puis echo `href` et libellé sans `htmlspecialchars`. `filter="url"` : pas d'allowliste http/https exclusive, pas d'encodage d'attribut. [S12]

Pas d'audit exhaustif des autres composants cœur.

## Extract web com_joomlaupdate

Le chemin web extrait le ZIP à la racine via `administrator/components/com_joomlaupdate/extract.php` (`ZIPExtraction`), pas `restore.php` (absent). [S19]

Un homonyme du paquet est **écrasé** : chaque fichier est ouvert en `'wb'` (troncature). `skipFiles` ne contient que `administrator/components/com_joomlaupdate/update.php`. [S20]

Un fichier extra sous `media/templates/...` qui n'est pas une entrée du ZIP n'est ni écrasé ni supprimé : l'extracteur ne parcourt que les Local File Headers. [S21]

Après extraction, `finalisation.php` appelle `JoomlaInstallerScript::deleteUnexistingFiles()` : seules les pistes d'obsolescence listées sont effacées. [S22]

Côté CLI : même schéma (`Folder::copy` force true). Un extra `favicon.ico` sous `media/templates/site/cassiopeia/images` (absent de `media_source` Cassiopeia) est conservé web et CLI. Un homonyme livré (`logo.svg`) est écrasé des deux côtés. [S23][S24]

Liste complète `deleteUnexistingFiles()` 6.1.3 non réénumérée ici.

## Pièges

- Lire « pas de paramètre samesite » comme « l'INI est vidé » : l'INI est préservé ; seul `""` omet l'attribut.
- Super Users en `NONE` : aucun `InputFilter` à l'enregistrement, puis echo HTML brut en front.
- `upload_maxsize = 0` : plus de plafond applicatif (reste PHP).
- `makeSafe` n'est pas un nom généré : collision et prévisibilité restent celles du nom fourni.
- Extra template conservé **seulement** s'il n'est pas homonyme du paquet et pas une piste `deleteUnexistingFiles`.
- `com_contact` : tags retirés en STRING à l'enregistrement ≠ échappement de sortie, surtout pour `href`.

## Lacunes restantes de ce passage

Couverture OWASP volontairement bornée (pas un audit complet). Exploitabilité des echo `com_contact` après `cleanString` non établie. ZIP Full/Update non décompressé. Liste `deleteUnexistingFiles()` non énumérée.
