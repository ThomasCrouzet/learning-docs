---
tags:
  - Joomla
  - Intermédiaire
  - Pratique
description: "Trois couches de cache Joomla 6.1.3 : Page Cache, Conservative vs Progressive, cache par module, et les quatre moteurs du tag."
estimated_time: "40 min"
fiche_number: 9
total_fiches: 24
cursus: "Joomla CMS"
id: "web.joomla.cache-trois-couches"
course_id: "web.joomla"
content_type: "lesson"
order: 9
---

# 09 - Cache : trois couches

> **En bref** : Joomla cache une page entière, une vue de composant et des modules, avec des règles d'invalidation différentes ; le guide qui cite APC, Eaccelerator et `JCache` est périmé pour 6.1.3. Lecture estimée : 40 min.

## Prérequis

- Fiche [02 - Installation de Joomla 6.1.3](02-installation-6-1-3.md)
- Fiche [08 - ACL : authorise et view levels](08-acl-authorise-et-view-levels.md) (view levels dans la clé du cache module)
- Accès Super User à **Système** vers **Configuration globale** et **Vider le cache**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras nommer les trois couches d'administration, expliquer pourquoi sauver un article ne vide pas le cache page, choisir Conservative ou Progressive, et n'utiliser que les quatre moteurs expédiés par le tag 6.1.3.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que les trois couches de cache ?

**Définition** : Sur une page site, trois sorties peuvent être mises en cache, avec trois commandes d'administration distinctes.

| Couche | Commande d'administration | Ce qui est stocké |
| ------ | ------------------------- | ----------------- |
| Cache **page** | Plugin **System - Page Cache** | La page HTML entière, clé = URL |
| Cache **vue / module** (Conservative ou Progressive) | Configuration globale, onglet Système, **System Cache** | Sortie de la vue de composant, et modules selon le mode |
| Cache **par module** | Onglet Advanced du module : Use global ou No caching | Sortie d'un module, temps en **secondes** |

**Le problème que ces trois couches résolvent** :

Sans cache, chaque visiteur refait les mêmes requêtes. Avec une seule couche mal choisie, un panier reçoit une page commune, ou un article modifié reste ancien.

Le guide décrit un ordre d'agressivité : Conservative, puis Progressive, puis Page caching. La première couche rencontrée **écrase** les plus profondes : si `cache/page` répond, Conservative n'est **même pas consulté**.

**Analogie concrète** : Trois photocopieuses (journal entier, un article, un encadré). Si tu as déjà le journal, tu n'ouvres plus les deux autres machines.

**Ce que ces trois couches ne sont PAS** :

- Ce n'est pas un composant de CDN externe.
- Ce n'est pas le cache opcode PHP (OPcache). APC comme cache **opcode** n'est pas un moteur Joomla 6.1.3.
- Ce n'est pas `JCache` / `JCacheView` / `JController` : ces noms du guide développeur sont **périmés** pour le tag 6.1.3.

---

### Plugin System - Page Cache

**Définition** : Le plugin **System - Page Cache**, une fois activé, enregistre la page site et la ressert tant que le **Cache Time** global (minutes, Configuration globale) n'est pas écoulé.

Le fichier type, handler File, ressemble à :

```text
cache/page/xxx-cache-page-yyy.php
```

`yyy` est un hash de l'URL, pour séparer les pages.

**Le problème que le cache page résout** :

Sans lui, une page d'article inchangée est recalculée à chaque visite anonyme.

**Règle d'invalidation** : **sauver un article ne vide PAS le cache page.** Pour voir le nouveau texte : **Système** vers **Vider le cache**, groupe **page**. Le plugin ne cache pas les visiteurs **connectés**. Un panier doit **exclure** les items ou URL concernés (onglet Advanced).

**Analogie concrète** : Une photo de vitrine prise ce matin. Changer le prix à l'intérieur **ne change pas** la photo. Il faut retirer la photo (groupe `page`).

**Ce que le cache page n'est PAS** :

- Ce n'est pas le dossier `cache/com_content` (cache vue).
- Ce n'est pas vidé par l'enregistrement d'un article. Confondre les deux couches est le piège le plus fréquent du guide.

---

### Conservative vs Progressive

**Définition** : Dans Configuration globale vers Système vers Cache Settings, **System Cache** prend trois valeurs :

- **OFF** - Caching disabled
- **ON - Conservative caching**
- **ON - Progressive caching**

Les deux modes ON cachent des **vues de composants** et des **modules**, seulement sur les pages **non** déjà servies par le Page Cache.

**Le problème que ces deux modes résolvent** :

Conservative laisse désactiver le cache **module par module**. Progressive, pour les visiteurs **non connectés**, cache **tous** les modules : **No caching** **n'a alors aucun effet**.

**Comparaison** :

| Critère | Conservative | Progressive |
| ------- | ------------ | ----------- |
| Vues des composants cœur | Mêmes conditions dans le code (pas un mode « invité » vs « connecté ») | Identique |
| Modules, visiteur déconnecté | Respecte Use global / No caching | **Tous** les modules sont cachés ; No caching ignoré |
| Fichier modules (handler File) | Un cache par module selon options | Un fichier commun sous `cache/com_modules` pour la sortie modules |
| Utilisateur connecté | `com_content` : vue **non** cachable si `$user->get('id')` | Même règle de vue |

Malgré des articles web et des réponses Stack Overflow, **Conservative n'est pas « déconnecté » et Progressive n'est pas « connecté »**. Pour `com_content`, le `DisplayController` site pose `$cachable = false` dès qu'il y a un id utilisateur, **dans les deux modes**.

Sauver un article **vide le cache vue conservative de `com_content`** (dossier `cache/com_content`). C'est pour cela que le texte mis à jour apparaît en Conservative, alors qu'il resterait ancien en cache **page**.

**Analogie concrète** : Conservative = tu choisis quels encadrés photocopier. Progressive (visiteur anonyme) = tu photocopies **tous** les encadrés dans la même liasse, même si un encadré portait « ne pas photocopier ».

**Ce que Progressive n'est PAS** : pas « le cache des utilisateurs connectés ». Si le plugin page répond, tu n'arrives pas ici.

---

### Cache par module : secondes, Itemid, coupé si connecté

**Définition** : L'onglet Advanced d'un module propose **Use global** ou **No caching**. Le **Cache Time du module est en secondes**. Le Cache Time **global** est en **minutes**.

Exemple `mod_menu.xml` : `cache=1` (`JGLOBAL_USE_GLOBAL`), `cache_time=900` (900 **secondes**), `cachemode` caché `itemid`.

L'identité du cache combine : **id module**, **view levels**, **Itemid**.

`ModuleRenderer` n'enveloppe `renderModule` via `moduleCache` que si `cache==1`, cache application `>= 1`, et `cachemode` ni `id` ni `safeuri`. `moduleCache` **coupe** si `owncache`/`cache` vaut 0, si le cache global vaut 0, **ou si l'utilisateur est connecté**.

Modes documentés : `static`, `itemid` (défaut), `safeuri`, `id`.

**Le problème que cette troisième couche résout** :

Sans connaître l'unité, tu lis 900 et tu crois poser 900 minutes. Le Cache Time global est en **minutes** ; celui du module est en **secondes**.

**Analogie concrète** : Une photocopieuse de bureau compte le temps de pause en minutes. Un minuteur de cuisine compte en secondes. Si tu règles 900 sur le minuteur en croyant que c'est le même cadran que la photocopieuse, tu n'attends pas la même durée.

**Ce que le cache module n'est PAS** :

- Ce n'est pas actif pour un utilisateur **connecté** : `moduleCache` coupe.
- Ce n'est pas indépendant de l'Itemid en mode défaut : changer de page (autre `#__menu.id`) change la clé.

---

### Moteurs du tag 6.1.3 et API dépréciée

**Définition** : Le tag **6.1.3** n'expédie que quatre classes de stockage :

- `ApcuStorage`
- `FileStorage`
- `MemcachedStorage`
- `RedisStorage`

Le guide administrateur liste encore APC, Eaccelerator, File, Memcache, Redis, XCache. Le guide développeur parle de `JCache`, `JCacheView`, `JController`. **Ces listes sont périmées** pour 6.1.3.

`Cache::getInstance()` est déprécié depuis **4.2**, retrait prévu en **7.0**, au profit de `CacheControllerFactoryInterface`.

**Le problème que cette correction résout** :

Un tutoriel « APC » ou `JCache::getInstance()` cible un moteur ou une classe **absents** du CMS 6.1.3.

**Tableau à figer** :

| Guide (périmé) | Tag 6.1.3 |
| -------------- | --------- |
| APC, Eaccelerator, File, Memcache, Redis, XCache | `ApcuStorage`, `FileStorage`, `MemcachedStorage`, `RedisStorage` **seulement** |
| `JCache` / `JCacheView` | `CacheControllerFactoryInterface` |
| `Cache::getInstance()` | Déprécié 4.2, retrait 7.0 |

**Analogie concrète** : Le mode d'emploi cite des fours disparus. Tu te fies à la plaque signalétique du tag 6.1.3.

**Ce que ces quatre moteurs ne sont PAS** : `MemcachedStorage` n'est pas `Memcache` (sans « d ») ; `ApcuStorage` n'est pas « APC ».

---

## Étapes Pratiques

### Étape 1 : Observer le cache page sans vider à l'enregistrement

1. Configuration globale : System Cache **OFF**, Cache Handler **File**, Cache Time **15**, Path vide.
2. Active le plugin **System - Page Cache**.
3. Déconnecte-toi. Ouvre un article en frontend.
4. Vérifie qu'un fichier apparaît sous `cache/page/`.
5. Modifie le texte de l'article en administration, enregistre, recharge le frontend **sans** vider le cache.

**Résultat attendu** : l'ancien texte reste (`cache/page` non vidé). Puis **Système** vers **Vider le cache**, groupe **page** : le nouveau texte s'affiche.

---

### Étape 2 : Observer le cache vue conservative de `com_content`

1. Désactive le plugin Page Cache (sinon il masque la couche suivante).
2. System Cache = **ON - Conservative caching**.
3. Déconnecte-toi. Recharge l'article.

**Résultat attendu** : un fichier sous `cache/com_content`. Après nouvel enregistrement de l'article, le texte mis à jour s'affiche (cache vue conservative de `com_content` vidé).

---

### Étape 3 : Unités module et handler du tag

Ouvre un `mod_menu`, onglet Advanced : Cache Time **900** = 900 **secondes**. Le global **15** = 15 **minutes**. Connecté : cache par module **coupé**.

Dans Configuration globale, liste **Cache Handler**.

**Résultat attendu** : File / APCu / Memcached / Redis selon PHP, pas Eaccelerator / XCache / Memcache. En CLI : `php cli/joomla.php cache:clean`.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php cli/joomla.php cache:clean` | Nettoyer les entrées de cache |
| Administration vers Système vers Vider le cache, groupe `page` | Invalider le cache page (non vidé en sauvant un article) |
| Plugin **System - Page Cache** activé / désactivé | Couche page entière |
| System Cache Conservative / Progressive / OFF | Couche vue / module |

---

## Pièges Fréquents

### Piège 1 : Sauver un article et croire que tout le cache tombe

⚠️ **Problème** : Le cache **page** reste. Les visiteurs anonymes voient l'ancien HTML.

✅ **Solution** : Vider le groupe `page`, ou attendre le Cache Time. Le cache vue conservative de `com_content`, lui, est vidé à l'enregistrement.

---

### Piège 2 : 900 secondes prises pour 900 minutes

⚠️ **Problème** : Cache Time module = 900. Cache Time global = 15. Tu mélanges les unités.

✅ **Solution** : Module = **secondes**. Global = **minutes**. 900 secondes = 15 minutes, coïncidence fréquente avec le défaut `mod_menu`.

---

### Piège 3 : Progressive + No caching sur un module

⚠️ **Problème** : En Progressive, visiteur déconnecté, **No caching** n'a aucun effet.

✅ **Solution** : Si tu dois exclure un module, rester en **Conservative**, ou exclure la page du plugin Page Cache, selon la couche réellement active.

---

### Piège 4 : Copier le guide APC / Eaccelerator / `JCache`

⚠️ **Problème** : Moteur ou classe absents du tag 6.1.3.

✅ **Solution** : `ApcuStorage`, `FileStorage`, `MemcachedStorage`, `RedisStorage` seulement. Remplacer `Cache::getInstance()` par `CacheControllerFactoryInterface` (retrait 7.0).

---

### Piège 5 : Tester le cache vue en étant connecté

⚠️ **Problème** : `com_content` pose `$cachable = false` si `$user->get('id')`. `moduleCache` coupe aussi si connecté.

✅ **Solution** : Te déconnecter pour observer `cache/com_content` et le cache module.

---

## Checklist de Validation

- [ ] Je nomme les trois couches : Page Cache, Conservative/Progressive, cache par module
- [ ] Je sais que sauver un article ne vide **pas** le cache page
- [ ] Je sais que sauver un article vide le cache vue conservative de `com_content`
- [ ] Je distingue Conservative (No caching module honoré) et Progressive (modules tous cachés si déconnecté)
- [ ] Je connais secondes (module) vs minutes (global)
- [ ] Je liste les quatre moteurs du tag 6.1.3, pas APC/Eaccelerator/`JCache`

---

## Exercice Pratique

**Énoncé** : Un rédacteur enregistre un article. Les visiteurs anonymes voient encore l'ancien texte. Le plugin **System - Page Cache** est activé. System Cache est Conservative. Un menu a Cache Time = 900.

Réponds :

1. Pourquoi l'ancien texte reste-t-il visible ?
2. Que se passe-t-il pour `cache/com_content` à l'enregistrement ?
3. 900, c'est quelle unité, sur quelle couche ?
4. Quels quatre storages le tag 6.1.3 expédie-t-il ? Que faire de `Cache::getInstance()` ?

**Indications** :

- Sépare groupe `page` et groupe `com_content`.
- Ne cite pas APC ni `JCache` comme moteurs actuels.

**Résultat attendu** : Quatre réponses alignées sur le tag 6.1.3.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Ancien texte** : le plugin Page Cache sert `cache/page`. Sauver un article **ne vide pas** cette couche. Vider le groupe **page** (ou attendre l'expiration).

2. **`cache/com_content`** : le cache vue **conservative** de `com_content` **est** vidé à l'enregistrement. Cette couche est invisible tant que le plugin page répond en premier.

3. **900** : **secondes**, cache **par module** (défaut `mod_menu`). Le global est en **minutes**.

4. **Moteurs** : `ApcuStorage`, `FileStorage`, `MemcachedStorage`, `RedisStorage` seulement. `Cache::getInstance()` est déprécié 4.2, retrait 7.0 ; utiliser `CacheControllerFactoryInterface`.

---

## Navigation

← Fiche précédente : **[ACL : authorise et view levels](08-acl-authorise-et-view-levels.md)**

→ Fiche suivante : **[Scheduler : Lazy et Web Cron](10-scheduler-lazy-et-webcron.md)**
