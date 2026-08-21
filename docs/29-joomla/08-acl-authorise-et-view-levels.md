---
tags:
  - Joomla
  - Intermédiaire
  - Concept
description: "Distinguer $user->authorise() (actions sur un asset) et getAuthorisedViewLevels() (visibilité), avec le court-circuit racine."
estimated_time: "40 min"
fiche_number: 8
total_fiches: 24
cursus: "Joomla CMS"
---

# 08 - ACL : authorise et view levels

> **En bref** : Une action ACL se teste avec `$user->authorise($action, $asset)` ; la visibilité d'un élément se teste avec `getAuthorisedViewLevels()`. Ce n'est pas le même chemin. Lecture estimée : 40 min.

## Prérequis

- Fiche [01 - CMS, Framework et versions](01-cms-vs-framework-et-versions.md)
- Fiche [07 - Montée de 5.4 vers 6](07-montee-5-4-vers-6.md) (contexte 6.1.3)
- Notions de groupes d'utilisateurs (Registered, Super Users) dans l'administration Joomla

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appeler `$user->authorise($action, $asset)`, expliquer le court-circuit racine, relier `Access::check()` à `#__assets.rules`, et ne plus confondre cette API avec les niveaux de vue.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que `$user->authorise($action, $asset)` ?

**Définition** : `$user->authorise($action, $assetname)` répond **true** ou **false** : cet utilisateur a-t-il le droit d'exécuter **cette action** sur **cet asset** ?

Exemple officiel pour l'article d'id 22 :

```php
$user    = Factory::getApplication()->getIdentity();
$allowed = $user->authorise('core.edit', 'com_content.article.22');
```

Exemple au niveau composant :

```php
$allowed = $user->authorise('core.create', 'com_contact');
```

**Le problème que `authorise` résout** :

Joomla n'applique pas les règles tout seul dans ton code. Sans cet appel : bouton « Modifier » hors `core.edit`, POST de création hors `core.create`, ou test d'un view level pris pour un droit d'édition.

Pour plusieurs actions d'un composant : `ContentHelper::getActions('com_example')` puis `$canDo->get('core.create')`.

**Analogie concrète** : Un badge d'immeuble ouvre **une porte précise** (action + asset). Ce n'est pas « cet étage est visible depuis le hall » (niveau de vue).

**Ce que `authorise` n'est PAS** :

- Ce n'est pas un niveau de vue (`Public`, `Guest`, `Registered`, `Special`, `Super Users`).
- Ce n'est pas une preuve d'authentification CSRF. Un jeton de formulaire valide ne remplace pas `authorise`.
- Ce n'est pas documenté comme une nouveauté J6. La page programmeur 6.1 **renvoie encore** au tutoriel ACL **J3.x** et affirme que l'ACL n'a pas changé de 3 à 4 ou 5. Enseigne `authorise` depuis le **code 6.1.3** et le guide des niveaux, pas depuis un tutoriel J3.x comme source de vérité 6.x.

---

### Le court-circuit racine

**Définition** : Pour un utilisateur **racine**, `authorise()` **raccourcit à `true`** sans parcourir les règles de l'asset demandé.

Le code 6.1.3 (`libraries/src/User/User.php`) pose `$this->isRoot` une fois par exécution. Un utilisateur est racine si :

1. son **id** (numérique) ou son **username** égale `root_user` de la configuration, ou
2. il a `core.admin` sur l'**asset racine** (`Access::getAssetRules(1)->allow('core.admin', $identities)`).

Ensuite :

```php
return $this->isRoot ? true : (bool) Access::check($this->id, $action, $assetname);
```

**Le problème que ce court-circuit résout** :

Sans racine, une omission dans `#__assets.rules` bloquerait le Super User. Le court-circuit le rend **non restreint** (`core.admin` Global Configuration, page programmeur 6.1 : « completely unrestricted »). `isRoot` n'est calculé qu'une fois par requête.

**Analogie concrète** : Le propriétaire a un passe qui ouvre **toutes** les portes. Le gardien ne consulte plus le tableau pièce par pièce.

**Ce que le court-circuit n'est PAS** :

- Ce n'est pas un niveau de vue. Un Super User a aussi des view levels, mais `authorise` ne les lit pas dans ce raccourci.
- Ce n'est pas `core.admin` **au niveau d'un seul composant**. `core.admin` sur `com_content` autorise les actions de ce composant, pas tout le site. Le court-circuit racine exige `core.admin` sur l'**asset racine** (ou `root_user`).
- Ce n'est pas un invité (`id` 0) : le test `core.admin` racine exige `$this->id > 0`.

---

### `Access::check()` et `#__assets.rules`

**Définition** : Si l'utilisateur n'est pas racine, `authorise()` délègue à `Access::check($userId, $action, $assetKey)`. Cette méthode lit le JSON imbriqué de la colonne `rules` de `#__assets`.

Exemple de JSON sur l'asset `com_content` (page programmeur 6.1, valeurs d'illustration) :

```text
{"core.admin":{"7":1},"core.manage":{"6":1},"core.create":{"3":1},"core.edit":{"4":1,"2":1},"core.edit.state":{"5":1},"core.delete":{"2":0}}
```

Lecture :

- `1` = **Allowed**
- `0` = **Denied**
- Groupe absent = **Inherited**

Les identités passées à `allow()` sont les **groupes** de l'utilisateur, plus l'id utilisateur en négatif (`$userId * -1`) pour une règle posée sur un utilisateur précis.

**Le problème que `#__assets.rules` résout** :

Le nested set `#__assets` fait **hériter** : article vers catégorie(s) vers `com_content` vers la configuration globale.

**Comment Joomla tranche (logique publiée)** : action ; groupes et ancêtres ; `rules` de l'asset puis des parents. Un **Denied** (`0`) à n'importe quel niveau **bloque**. Sinon un **Allowed** (`1`) **autorise**. Sinon refus implicite.

`Access::check()` retourne `true`, `false` (refus explicite) ou `null` (refus implicite). `authorise()` caste en booléen : `null` devient `false`.

**Analogie concrète** : Un classeur à tiroirs. Une étiquette rouge « interdit » dans **n'importe quel** tiroir l'emporte.

**Ce que `#__assets.rules` n'est PAS** :

- Ce n'est pas `#__viewlevels`. Les view levels ont leur propre table et leur propre JSON `rules` (listes de groupes), sans actions `core.*`.
- Ce n'est pas une spécification 6.x : la page 6.1 **pointe encore** vers le tutoriel J3.x. L'API `User::authorise` / `Access::check` est celle du tag 6.1.3.

---

### `getAuthorisedViewLevels()` : visibilité, liste sans doublon

**Définition** : `$user->getAuthorisedViewLevels()` retourne la liste des **niveaux de vue** autorisés pour cet utilisateur. Ce chemin décide si un article, un module ou un item de menu est **visible**, pas s'il est **éditable**.

Le guide sépare :

- **permissions d'action** (héritage Global vers composant vers élément) ;
- **niveaux** Public, Guest, Registered, Special, Super Users.

Le guide **ne cite pas** `authorise()`.

`User::getAuthorisedViewLevels()` appelle `Access::getAuthorisedViewLevels($this->id)` : charge `#__viewlevels`, part du niveau `1`, ajoute les niveaux dont `rules` contient un groupe (ou l'id négatif), puis **dédoublonne** (`array_unique`). C'est le « DISTINCT » de cette API : deux groupes, un seul entier par niveau.

**Le problème que les view levels résolvent** :

Sans eux, tu n'as que « connecté / pas connecté ». Tu ne sépares pas Guest et Registered à l'affichage.

**Comparaison avec `authorise`** :

| `authorise($action, $asset)` | `getAuthorisedViewLevels()` |
| ---------------------------- | --------------------------- |
| Droit de **faire** (éditer, créer, publier) | Droit de **voir** |
| Table `#__assets` | Table `#__viewlevels` |
| Court-circuit racine vers `true` | Liste d'entiers de niveaux, sans doublon |
| Exemple : `core.edit` sur `com_content.article.22` | Exemple : l'article a `access = 1` (Public) |

**Analogie concrète** : La vitrine (view level) décide qui **voit** le produit. La clé de la réserve (`authorise`) décide qui a le droit de **changer** le prix.

**Ce que les view levels ne sont PAS** :

- Ce n'est pas `core.edit` / `core.delete`. Un lecteur Registered **voit** un article `Registered` sans pouvoir l'éditer.
- Ce n'est pas un substitut d'`authorise` dans une extension. Les deux tests sont nécessaires si tu as à la fois affichage et action.

Après routage, `SiteApplication` lit `Itemid` et appelle `authorise($Itemid)` sur l'item de menu (redirection login, ou 403 / accueil). C'est encore une **action** sur un asset de menu, pas un view level. La fiche [11 - SEF, menus et Itemid](11-sef-menus-et-itemid.md) reprend `Itemid`.

---

## Étapes Pratiques

### Étape 1 : Tester une action dans une extension

Dans `#__assets`, `name = 'com_content'` : JSON `rules` avec `1` = Allowed, `0` = Denied, groupe absent = Inherited.

Dans un contrôleur ou une vue, récupère l'identité courante (pas `Factory::getUser()`, déprécié vers 7.0) :

```php
use Joomla\CMS\Factory;
use Joomla\CMS\Helper\ContentHelper;

$user    = Factory::getApplication()->getIdentity();
$allowed = $user->authorise('core.edit', 'com_content.article.22');

$canDo = ContentHelper::getActions('com_content');
if ($canDo->get('core.create')) {
    // Afficher le bouton Nouveau
}
```

**Résultat attendu** : `$allowed` true ou false. Un Super User racine obtient `true` même sans règle locale sur l'article 22.

---

### Étape 2 : Lister les view levels de l'utilisateur

```php
$levels = $user->getAuthorisedViewLevels();
```

**Résultat attendu** : tableau d'entiers sans doublon (`#__viewlevels.id`), pas des actions `core.*`.

---

### Étape 3 : Vérifier l'écart documentation programmeur

Ouvre la page Permissions du manuel 6.1 Current. Elle renvoie au tutoriel ACL **J3.x** et affirme que l'ACL n'a pas changé de 3 à 4 ou 5.

**Résultat attendu** : tu t'appuies sur `User::authorise` / `Access::check` du tag 6.1.3, pas sur le tutoriel J3.x comme contrat 6.x.

---

## Commandes Utiles

| Appel | Action |
| ----- | ------ |
| `$user->authorise('core.edit', 'com_content.article.22')` | Tester une action sur un asset |
| `$user->authorise('core.create', 'com_contact')` | Tester une action au niveau composant |
| `Access::check($userId, $action, $assetKey)` | Lire `#__assets.rules` (après le court-circuit racine) |
| `$user->getAuthorisedViewLevels()` | Liste **sans doublon** des niveaux de vue |
| `ContentHelper::getActions('com_example')` | Plusieurs actions d'un composant (barre d'outils) |

---

## Pièges Fréquents

### Piège 1 : Confondre action et visibilité

⚠️ **Problème** : Tu testes un view level et tu crois avoir autorisé `core.edit`. Un lecteur voit l'article, un autre écran lui propose « Modifier ».

✅ **Solution** : Visibilité = `getAuthorisedViewLevels()`. Action = `authorise('core.edit', 'com_content.article.22')`. Les deux chemins sont distincts (jalon du cursus).

---

### Piège 2 : Oublier le court-circuit racine

⚠️ **Problème** : Tes tests d'ACL passent toujours pour le compte Super User. Tu conclus que tes règles d'article sont correctes.

✅ **Solution** : Retester avec un utilisateur **non racine** (Editor, Author). Pour un racine, `authorise` retourne `true` sans lire l'asset demandé.

---

### Piège 3 : Prendre le tutoriel J3.x pour une spec 6.x

⚠️ **Problème** : La page programmeur 6.1 pointe encore vers J3.x. Tu copies des noms de classes J3.

✅ **Solution** : Garder l'idée (actions + assets + héritage). Appeler `Factory::getApplication()->getIdentity()->authorise(...)` comme le manuel 6.1 le montre dans l'exemple `com_content.article.22`.

---

### Piège 4 : Traiter `core.admin` composant comme racine site

⚠️ **Problème** : Un compte a `core.admin` sur `com_content` seulement. Tu t'attends au court-circuit racine sur tout le site.

✅ **Solution** : Le court-circuit exige `core.admin` sur l'**asset racine** (ou `root_user`). `core.admin` composant = « Configure ACL & Options » de ce composant.

---

### Piège 5 : Attendre des doublons de niveaux

⚠️ **Problème** : L'utilisateur est dans deux groupes qui autorisent le même view level. Tu itères deux fois.

✅ **Solution** : `getAuthorisedViewLevels()` dédoublonne (`array_unique`). Chaque niveau apparaît au plus une fois.

---

## Checklist de Validation

- [ ] Je sais appeler `$user->authorise($action, $asset)`
- [ ] Je sais qu'un utilisateur racine court-circuite à `true`
- [ ] Je relie `Access::check()` à `#__assets.rules` (JSON 1 / 0 / héritage)
- [ ] Je distingue actions et view levels (Public, Guest, Registered, Special, Super Users)
- [ ] Je sais que `getAuthorisedViewLevels()` retourne une liste **sans doublon**
- [ ] Je ne prends pas la page programmeur ACL J3.x pour une API nouvelle de J6

---

## Exercice Pratique

**Énoncé** : Un article d'id 22 a le niveau de vue **Registered**. Alice (groupe Author, pas Super User) **voit** l'article une fois connectée. Bob (Super User du site) et Alice cliquent tous les deux sur « Modifier ».

Réponds :

1. Quel appel décide qu'Alice **voit** l'article ?
2. Quel appel décide qu'Alice **peut modifier** l'article 22 ?
3. Pourquoi Bob obtient `true` même si `rules` de l'article 22 est `{}` ?
4. Si Alice appartient à deux groupes qui donnent le niveau Registered, combien de fois ce niveau apparaît-il dans `getAuthorisedViewLevels()` ?

**Indications** :

- Écris les signatures `authorise(...)` et `getAuthorisedViewLevels()`.
- Nomme l'asset `com_content.article.22`.

**Résultat attendu** : Quatre réponses, sans mélange action / visibilité.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

1. **Voir** : `getAuthorisedViewLevels()`. Le niveau Registered de l'article doit être dans cette liste (déduite de `#__viewlevels`, pas de `#__assets`).

2. **Modifier** : `$user->authorise('core.edit', 'com_content.article.22')`. Si cet appel est faux, Alice voit l'article sans droit d'édition.

3. **Bob** : utilisateur racine (`root_user` ou `core.admin` sur l'asset racine). `authorise()` **court-circuite à `true`** sans lire les `rules` de l'article 22.

4. **Une seule fois** : la liste est dédoublonnée (`array_unique`). Deux groupes, un seul entier de niveau.

---

## Navigation

← Fiche précédente : **[Montée de 5.4 vers 6](07-montee-5-4-vers-6.md)**

→ Fiche suivante : **[Cache : trois couches](09-cache-trois-couches.md)**
