# Passage 1 - Versions, architecture, templates, extensions

**Statut** : Partial (24/24 affirmations retenues après vérification)  
**Date de consultation** : 20 août 2026  
**Périmètre** : CMS Joomla! 6.x, tag `joomla-cms` 6.1.3, manuel 6.1 Current, guide utilisateur  
**Hors périmètre** : Joomla! Framework comme produit séparé ; 4.x et 3.x comme héritage

Les références `[S1]` à `[S24]` pointent vers [sources.md](sources.md).

---

Le cursus doit porter sur le **CMS Joomla!**, produit distinct du **Joomla! Framework** (bibliothèques PHP installables via Composer, sans fonctionnalités ni surcharge CMS ; l'un n'exige pas d'installer l'autre). [S6]

La cible est la branche majeure **6.x** (manuel programmeur **6.1 Current**) ; **5.x** est en Legacy et en correctifs seulement ; **4.x** et **3.x** sont de l'héritage à isoler. [S7]

L'entrée officielle en 6.x est une **mise à niveau in-place depuis 5.4.x**, pas une migration. [S5]

Le tag **6.1.3** ancre bootstrap, DI, MVC, sécurité et extensions ; le manuel 6.1 et le guide utilisateur restent la référence versionnée, sous réserve des écarts code/doc ci-dessous.

## Versions, prérequis et support

Deux paquets sont proposés le même jour ; 6.x accepte les fonctionnalités, 5.x est gelé en bugfix, 4.x/3.x sont hors support. Pour 6.x, *Minimum* est la version refusée par le CMS, *Supported* le plancher que le projet accepte encore de corriger. Modules PHP exigés en 5.x et 6.x : `json`, `simplexml`, `dom`, `zlib`, `gd`, et `mysqlnd` ou `pdo_mysql` ou `pdo_pgsql` ; mémoire PHP recommandée en 6.x : au moins 256 Mo. [S2]

La branche Git par défaut de `joomla/joomla-cms` reste `5.4-dev` alors que la release GitHub et le manuel Current sont en 6.1.3 : figer les exemples du cursus sur le **tag 6.1.3**, pas sur `HEAD` de la branche par défaut.

| Série | Dernier paquet | PHP min / reco | MySQL | MariaDB | PostgreSQL | Apache / Nginx / IIS | Support |
| ----- | -------------- | -------------- | ----- | ------- | ---------- | -------------------- | ------- |
| 6.x | 6.1.3, 18 août 2026 [S1] | 8.3.0 / 8.4 [S2] | 8.0.13 | 10.6 supporté, 10.4 min, 12.0 reco | 14.0 supporté, 12.0 min, 17.6 reco | 2.4 / 1.26 supporté, 1.29 reco / 10 | 14 oct. 2025 · 17 oct. 2028 · 16 oct. 2029 [S4] |
| 5.x | 5.4.8, 18 août 2026 | 8.1.0 / 8.3 [S3] | 8.0.13 | 10.4.0 | 12.0 | 2.4 / 1.21 / 10 | bugfix jusqu'au 13 oct. 2026, sécu jusqu'au 12 oct. 2027 (série : 17 oct. 2023 · 13 oct. 2026 · 12 oct. 2027) |
| 4.x | 4.4.14, 30 sept. 2025 | 7.2.5 / 8.2 | 5.6 | - | 11.0 | - | série non supportée |
| 3.x | - | - | - | - | - | - | fin 17 août 2023 ; LTS étendu jusqu'au 17 fév. 2025 |

Les dates 6.x 2028/2029 suivent la même grille que 5.x : les en-têtes de colonnes absents du HTML de la feuille de route empêchent de nommer officiellement chaque jalon.

## Montée de version et héritage à isoler

Depuis 5.4.x, désactiver le plugin **Behaviour - Backward Compatibility** (couche J4 vers J5, sans numéro) **avant** de passer à J6 ; installer et activer **Behaviour - Backward Compatibility 6** (essentiel pour 5.4 vers 6.x ; activé automatiquement lors d'une montée vers 5.4.x). Une **nouvelle** install 6.0 livre ce plugin **installé mais désactivé**. [S5]

Hors cursus principal : Factory `getDbo` / `getSession` / `getLanguage` / `getDocument` / `getUser` / `getCache` (@deprecated 4.3, retrait prévu **7.0**), `CMSApplication::getInstance()` et `getRouter()` (4.0/4.3 vers 7.0), et toute édition des fichiers livrés de Cassiopeia. [S10]

## Architecture d'une requête (code 6.1.3)

Chaîne **observée dans le code** (à enseigner comme flux réel, pas comme contrat d'API publié) : `index.php` impose PHP >= 8.3.0 et `_JEXEC`, puis `includes/app.php` démarre le conteneur DI, alias `session` / `session.web` / `SessionInterface` vers `session.web.site`, instancie `SiteApplication`, l'assigne à `Factory::$application` et appelle `execute()`. L'admin et l'API reprennent le schéma avec `AdministratorApplication` et `ApiApplication` ; le CLI (`cli/joomla.php`) résout `Joomla\Console\Application` et alias la session vers `session.cli`. [S8]

`CMSApplication::execute()` importe les plugins `behaviour` et `system`, dispatche `onBeforeExecute`, appelle `doExecute()`, puis `render()` / `respond()` (`onBeforeRender`, `onAfterRender`, `onBeforeRespond`, `onAfterRespond`). Côté site, `doExecute()` fait `initialiseApp()`, `route()` (`SiteRouter::parse`, `onAfterRoute`, autorisation du menu `Itemid`) puis `dispatch()`. `dispatch()` enregistre les `joomla.asset.json` composant/template et `ComponentHelper::renderComponent()` exécute `bootComponent($option)->getDispatcher($app)->dispatch()`. `ComponentDispatcher::dispatch()` exige `core.manage` en administrateur, parse `task` (`controller.task`), crée le contrôleur via `MVCFactory` et enchaîne `execute()` / `redirect()`. Le manuel 6.1 des événements application décrit le même ordre HTTP (`onAfterInitialise` ... `onAfterRespond`). [S9]

`Factory::createContainer()` (recommandation DI depuis Joomla 4) enregistre notamment Application, Authentication, CacheController, Config, Console, Database, Dispatcher, Document, Form, Input, Language, Mailer, Menu, Pathway, Session, WebAssetRegistry, Router, User. Remplacer les getters Factory historiques par le conteneur (`DatabaseInterface`) ou `Factory::getApplication()`. [S10]

## Sécurité à enseigner avec PHP/OWASP

Protection CSRF 6.1 : jeton de session (synchronizer token), aussi via l'en-tête `HTTP_X_CSRF_TOKEN` ; `HTMLHelper::_('form.token')` et `Session::checkToken()` / `$this->checkToken()` ; un jeton valide ne prouve ni authentification ni droit ACL (`$user->authorise(action, asset)`). Filtre HTTP par défaut de `Input::get()` : `cmd`. Requêtes SQL : `bind()` (prepared statements) comme règle contre l'injection. `includes/framework.php` refuse les overrides d'IP (`IpHelper::setAllowIpOverrides`) sauf `behind_loadbalancer`. Cela recouvre la fiche OWASP CSRF (jeton framework / en-tête custom sur les requêtes à effet de bord ; un XSS peut contourner le CSRF) **sans** valoir une couverture OWASP complète. [S11][S24]

## Templates : personnalisation pérenne vs core

Chemin durable : **templates enfants**, `user.css` / `user.js`, **overrides** sous `html/` ; modifier les fichiers livrés de Cassiopeia est une modification du core écrasée à la mise à jour. [S13]

Cassiopeia charge `user.css` / `user.js` via le Web Asset Manager **après** le preset LTR/RTL, le CSS de langue et le thème de couleur ; les médias installent sous `media/templates/site/cassiopeia`, le PHP sous `templates/`. [S14]

Un override **de même nom** s'applique toujours ; un **layout alternatif** est opt-in, **sans underscore** dans le nom de fichier principal, choisi sur le formulaire module/composant (les plugins n'offrent pas ce choix). Les fragments **JLayout** se surchargent sous `html/layouts` (`LayoutHelper::render('joomla.content...')` vers `layouts/joomla/content/...php`). [S15]

Depuis Joomla 5.2, le courrier core passe par **Mail Templates** (System Dashboard vers Templates) ; le chrome HTML est le JLayout `mailtemplate.php` (tableau 3 rangées), surchargeable dans le template site sans toucher au core. [S16]

Le guide Cassiopeia (dump `templateDetails.xml`, schéma de polices None/local/web, positions s'arrêtant à `debug`) **retarde** le core 5.4/6.1, qui ajoute piles **system font**, champs `systemFontBody` / `systemFontHeading` et positions `error-403` / `error-404` (utilisées dans `error.php`). [S17]

Cassiopeia est documenté accessible et responsive (options de style, contraste obligatoire, référence WebAIM) mais son `index.php` n'a **pas** de lien d'évitement ; **Atum** applique des classes a11y par utilisateur (`a11y_mono`, `a11y_contrast`, `a11y_highlight`, `a11y_font`) et `data-color-scheme` / `data-bs-theme`, non documentés pour le template site. [S18]

## Extensions, packaging, API et tests

Cinq types courants : composants, modules, plugins, templates, langues ; plus packages, files, libraries. Installation : ZIP, dossier, URL ou JED. [S19]

Composant/module moderne : manifeste `<namespace path="src">`, PSR-4 sous `src/`, `services/provider.php` enregistrant `MVCFactory`, `DispatcherFactory` et `ComponentInterface` ou Module (modèle core : `com_contact` ; tutoriel : `com_example`). [S20]

SQL : `<install>`, `<uninstall>`, `<update><schemas>` ; **première install** : les fichiers d'update **ne s'exécutent pas** (Joomla mémorise seulement le dernier) ; `<version>` du manifeste **n'est pas** corrélé à `version_id` dans `#__schemas`. [S21]

Package : zipper les archives filles avec `pkg_<packagename>.xml`. Publication d'updates : XML d'update + ZIP aligné sur `<downloadurl>` + `<updateservers>` de type `extension` ou `collection`. [S22]

Web services : `/api/index.php/v1`, en-tête `X-Joomla-Token` ; compte avec au moins `core.login.api` **et** `core.login.site`. [S24]

Tests (branche **5.4-dev**) : PHPUnit `tests/Unit` et `tests/Integration` ; Cypress E2E (`npm run cypress:run`) sur installeur, UI et API, specs `tests/System/integration/api/com_*`. [S23]

## Cinq parcours et fil rouge (matière vérifiée seulement)

Dépendances : **intégrateur** (Cassiopeia enfant, `user.css`/`user.js`, overrides, WAM) vers **administrateur** (ACL `authorise`, Mail Templates, montée 5.4 vers 6.x, jetons CSRF) vers **créateur de templates** (positions, layouts alternatifs, JLayout, e-mails, limites a11y Cassiopeia/Atum) vers **développeur d'extensions** (manifeste, PSR-4, `provider.php`, schémas SQL, package, update server) vers **expert** (front controllers, événements HTTP, DI, API `/v1`, CLI, PHPUnit/Cypress, dépréciations 7.0).

Progression rapide : tag 6.1.3 + prérequis PHP 8.3 + enfant Cassiopeia + un override + un jeton de formulaire.

Progression approfondie : DI à la place de `Factory::getDbo()`, composant namespacé, plugin de compatibilité 6, endpoint API authentifié, spec Cypress `com_*`.

Fil rouge réalisable avec la matière : template enfant + composant type `com_example`/`com_contact` + module + contrôle ACL + appel `/api/index.php/v1` ou commande CLI + ZIP/package/`<updateservers>` + tests Unit/API.

**Non couvert par ce passage** : workflows, SEF/recherche, scheduler, cache, langues/multilingue, médias, champs, menus/modules métier, staging/déploiement, WCAG complète, validation d'uploads, secrets, audit d'extensions.

## Lacunes, contradictions et confiance

La page 6.1 *Lifecycle* est un **TODO inachevé**. Le manuel Web Asset Manager 6.1 dit que `Document::addScript` / `addStyleSheet` disparaîtront **en Joomla 6** ; dans 6.1.3 elles existent encore, **@deprecated 4.3, retrait 7.0**. Même écart pour `CMSApplication::getCfg()` (annotation 7.0 vs message runtime « removed in 6.0 », méthode toujours là). [S12]

Guide Cassiopeia vs `templateDetails.xml` core : polices système et positions d'erreur absentes du dump officiel. Accessibilité site : pas de skip-link dans Cassiopeia malgré l'affichage « accessible ». Dates de support 6.x : appariement 2028/2029 **inféré**. Tests E2E documentés sur **5.4-dev**, pas sur le tag 6.1.3. Ne pas présenter le flux `execute()`/`dispatch()` comme API garantie : c'est une convention lue dans le CMS.

## Incertitudes du passage 1 (objet du passage 2)

- `docs.joomla.org/What_version_of_Joomla!_should_you_use` non inspectable (interstitiel Cloudflare) : tables EOS wiki non utilisées.
- Le tableau des prérequis 6.1 ne liste pas PHP 8.5, alors qu'une annonce du 31 janvier 2026 (6.0.2/5.4.2) revendiquait le support PHP 8.5.
- Feuille de route : dates 6.x 17 octobre 2028 et 16 octobre 2029 sans en-têtes de colonnes visibles ; appariement bugfix/sécu inféré.
- Versions Framework 3.4.1 / 4.0.4 mentionnées sur la feuille de route, non vérifiées dans un dépôt.
- Guide d'upgrade : MariaDB 10.6.x parmi les seuils ; manuel 6.1 : minimum 10.4. Borne réellement appliquée par le composant Update non exécutée.
- Pas de chemin 4.4 vers 6.x documenté ; 5.4.x exigé d'abord.
- « Branche stable actuelle » n'est pas univoque : `default_branch` GitHub = `5.4-dev`, dernière release = 6.1.3, manuel Current = 6.1.
- Tests unitaires/e2e du tag 6.1.3 non inspectés (`SessionTest.php` introuvable à l'URL tentée).
- ACL, cache, langues, médias/uploads, menus SEF seulement partiels.
- `ApiApplication` (clientId 3, plugins `api-authentication`/`webservices`, `ApiRouter`) non recoupée ligne à ligne avec le chapitre Web Services.
- SameSite, uploads, secrets (`configuration.php`), XSS d'échappement HTML non vérifiés dans le code des vues.
- Différences 5.4 vs 6.1 hors PHP minimum, `initialiseTemplate` (depuis 6.1.0) et CORS `isOriginAllowed` (depuis 6.1.3) non inventoriées.
- Aucune source inspectée n'énonce un niveau WCAG 2.x pour Cassiopeia ou Atum.
- Guide favicons vs règle « ne pas éditer Cassiopeia parent » : conflit non tranché.
- Pas de pipeline staging/déploiement intégré au core (Akeeba, outils d'hébergeur, mysqldump).
- Workflows, overrides de champs, scheduler lazy vs cron : couverture partielle.
- Héritage des overrides template enfant vs parent : comportement 5.4/6.1 non relu.
- Tableau des balises de manifeste 6.1 marqué « Out of date » ; config composants pointe encore un tutoriel J3.x.
- Groupes d'événements plugins hors tutoriel shortcodes encore en partie sur docs.joomla.org.
