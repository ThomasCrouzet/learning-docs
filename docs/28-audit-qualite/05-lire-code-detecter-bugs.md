---
tags:
  - Audit
  - Code review
  - PHP
description: "Lire le code pour repérer des bugs avant qu'ils ne se manifestent : variables non déclarées, comparaisons toujours vraies, conversions implicites, signatures incohérentes."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 6
cursus: "Audit et Qualité"
id: "transversal.audit.lire-code-detecter-bugs"
course_id: "transversal.audit"
content_type: "lesson"
order: 5
---

# 05 - Lire le code pour repérer les bugs

> **En bref** : Certains bugs sautent aux yeux à la lecture si on connaît les patterns. Cette fiche te donne un catalogue de pièges PHP fréquents, et la technique pour décider entre corriger directement ou écrire d'abord un test qui confirme le bug. Lecture estimée : 75 min.

## Prérequis

- Fiche 2 : [Cartographier une application](02-cartographier-application.md)
- [Cursus PHP](../02-php/index.md)
- Notions de tests fonctionnels ([cursus Testing et Qualité](../09-testing/index.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras reconnaître à la lecture les patterns de bugs PHP les plus fréquents (variables non déclarées, ternaire avec chaîne toujours truthy, `??` mal utilisé, type juggling, signatures incohérentes), et choisir entre correction directe et test de confirmation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la lecture de code pour bugs ?

**Définition** : La lecture de code pour bugs est une analyse statique humaine, ciblée sur des patterns connus de bug, et indépendante de l'exécution. Tu lis le code source en cherchant des signes précis qui correspondent à des erreurs documentées, sans avoir besoin de lancer le programme.

**Le problème que la lecture de code pour bugs résout** :

Sans cette pratique, voici les problèmes rencontrés :

1. **Bugs invisibles à l'exécution normale** : certains chemins de code ne sont jamais empruntés en dev, et les bugs se révèlent en production.
2. **Confiance excessive dans les outils automatiques** : PHPStan, Psalm et les linters attrapent beaucoup, mais pas tout, et certains bugs sont subtils ou dépendent du contexte métier.
3. **Tests qui passent sur du code faux** : un test peut valider le résultat sans détecter une logique aberrante en interne.

**Comment la lecture de code pour bugs résout ces problèmes** :

| Problème | Solution apportée par la lecture de code |
| --- | --- |
| Bugs invisibles à l'exécution | On trouve les chemins suspects par lecture, indépendamment de l'exécution |
| Confiance excessive dans les outils | On complète les outils par un regard humain sur la sémantique |
| Tests qui passent sur du code faux | On valide la cohérence interne du code, pas seulement son résultat |

**Analogie concrète** : Pense à un correcteur de manuscrit qui repère les fautes typiques (fautes de frappe, accords manqués, doublons) sans réécrire le texte. Il ne juge pas le style, il chasse des patterns d'erreur connus. La lecture de code pour bugs fonctionne pareil : tu cherches des patterns précis, pas une "belle" architecture.

**Ce que la lecture de code pour bugs n'est PAS** :

- Ce n'est pas un refactoring. Tu ne réécris pas le code, tu le lis et tu documentes ce que tu trouves.
- Ce n'est pas une réécriture. Si tu veux changer la structure, c'est une autre activité, à faire après l'audit.
- Ce n'est pas un jugement esthétique. Un code laid mais correct n'est pas un bug. Un code joli mais faux en est un.

---

### Trois familles de bugs lisibles

**Définition** : Les bugs détectables à la lecture se classent en trois familles selon le niveau où ils opèrent.

**Le problème que cette classification résout** :

Sans classification, tu cherches "des bugs" en général et tu te disperses. Avec les familles, tu peux faire trois passes ciblées, chacune avec ses propres signaux d'alerte.

**Les trois familles** :

| Famille | Exemples |
| --- | --- |
| Bugs syntaxiques masqués | Variable jamais déclarée, typo dans un nom de méthode, import manquant |
| Bugs sémantiques | Comparaison toujours vraie, conversion implicite, opérateur mal utilisé |
| Bugs structurels | Signature divergente, paramètre passé au mauvais service, contrat rompu |

**Analogie concrète** : Pense à un contrôle technique de voiture qui se décompose en trois passes : carrosserie (visible), mécanique (sous le capot), électronique (calculateurs). Chaque passe utilise des outils différents et cherche des défauts différents. La lecture de code fonctionne pareil : trois passes, trois angles, trois listes de patterns.

---

### Pattern 1 : variable jamais déclarée

**Définition** : Une variable jamais déclarée est utilisée dans une expression sans avoir été assignée précédemment ni passée en paramètre. PHP émet alors un warning (depuis PHP 8, c'était une notice silencieuse avant).

**Le problème que ce pattern crée** :

1. **Valeur imprévisible** : la variable vaut `null` par défaut, ce qui peut produire des comportements aberrants selon les opérations qui suivent.
2. **Erreur masquée par `??`** : l'opérateur de coalescence court-circuite la lecture et n'émet pas toujours le warning attendu.
3. **Détection difficile** : le code "fonctionne" en apparence, mais le résultat est faux.

**Exemple** :

```php
public function index(Request $request): Response
{
    $initialTransition = $report->getStatus() ?? 'acknowledged';

    if ($report->getStatus() !== null) {
        $candidate = $statusToTransition[$report->getStatus()] ?? 'null';
        // $statusToTransition n'est jamais déclarée dans cette méthode
    }
}
```

**Analyse** :

- `$statusToTransition` n'apparaît dans aucune assignation antérieure et n'est pas un paramètre de la méthode.
- L'opérateur `??` sur une variable indéfinie est partiellement silencieux : le lecteur croit que le défaut est appliqué proprement, mais le warning sur l'index lui-même reste.
- La valeur retournée par `??` ici est la chaîne `'null'` (entre guillemets), pas la valeur `null`. C'est une faute de frappe fréquente.

**Conséquence** : le code marche en apparence mais le résultat est faux. Le test fonctionnel qui vérifie un cas nominal passe, mais le cas où `$report->getStatus()` retourne une valeur attendue ne déclenche jamais la branche prévue.

**Ce que ce pattern n'est PAS** :

- Ce n'est pas une variable optionnelle passée en paramètre. Une variable peut être `null` légitimement si la signature le permet.
- Ce n'est pas une variable globale ou statique. Si la variable vient de `global` ou d'une propriété de classe, ce n'est pas le même cas.

---

### Pattern 2 : ternaire avec chaîne toujours truthy

**Définition** : Un ternaire dont la condition est une chaîne littérale non vide est toujours vrai, car PHP convertit toute chaîne non vide en `true`. Le code semble proposer un choix, mais une seule branche est jamais exécutée.

**Le problème que ce pattern crée** :

1. **Branche morte permanente** : la branche "false" n'est jamais atteinte, mais elle reste dans le code et trompe les lecteurs.
2. **Intention perdue** : on devine que l'auteur voulait comparer une variable, mais l'a oubliée. Sans test, on ne peut pas savoir laquelle.
3. **Tests qui passent par hasard** : si la valeur attendue correspond à la branche "true", le test passe alors que le code est faux.

**Exemple** :

```php
$firstName = $this->faker->firstName('M.' ? 'male' : 'female');
```

**Analyse** :

- `'M.'` est une chaîne non vide, donc évaluée à `true`.
- Le ternaire retourne toujours `'male'`, quel que soit le contexte.
- L'intention probable était `$gender === 'M.' ? 'male' : 'female'` ou `random_int(0, 1) === 0 ? 'male' : 'female'`. La variable de comparaison a été oubliée.

**Ce que ce pattern n'est PAS** :

- Ce n'est pas une optimisation volontaire. Personne n'écrit `'M.' ? 'a' : 'b'` exprès.
- Ce n'est pas un ternaire avec `null`. `null ? 'a' : 'b'` retourne toujours `'b'`, mais c'est lisible et parfois voulu.

---

### Pattern 3 : type juggling et comparaisons faibles

**Définition** : Le type juggling est la conversion implicite de types effectuée par PHP lors des comparaisons faibles (`==`, `!=`) ou des opérations arithmétiques. Cela produit des résultats contre-intuitifs.

**Le problème que ce pattern crée** :

1. **Comparaisons trop larges** : `0 == 'abc'` était vrai avant PHP 8. `'1' == 1` est toujours vrai. `'1abc' == 1` était vrai avant PHP 8.
2. **Recherche dans un tableau imprécise** : `in_array('1', [1, 2, 3])` retourne `true` par défaut sans le troisième paramètre `strict`.
3. **Magic strings non contraintes** : `$status === 'P'` ne dit pas ce que signifie `'P'`. Pending ? Paid ? Processing ?

**Exemples** :

```php
if ($value == 0) {
    // Vrai pour 0, '0', '', null, false, [] en PHP < 8
    // Toujours surprenant
}

if (in_array('1', [1, 2, 3])) {
    // Vrai par défaut (third arg manquant)
    // En mode strict (in_array('1', [1, 2, 3], true)) : false
}

if ($status === 'P') {
    // Que signifie 'P' ? Pending ? Paid ? Pourquoi pas une constante ?
}
```

**Solutions** :

| Problème | Solution |
| --- | --- |
| Comparaison faible `==` | Préférer `===` (comparaison stricte) |
| `in_array` sans mode strict | Ajouter `, true` en troisième argument |
| Magic strings | Définir une classe de constantes (`Status::PENDING`) |
| `intval`/`floatval` implicite | Utiliser un cast explicite (`(int)`, `(float)`) |

**Ce que ce pattern n'est PAS** :

- Ce n'est pas une mauvaise pratique systématique. `==` est légitime quand tu compares deux valeurs dont tu sais qu'elles partagent le même type (rare en pratique).
- Ce n'est pas spécifique à PHP. La plupart des langages dynamiques ont des règles similaires, mais PHP a longtemps eu les règles les plus surprenantes.

---

### Pattern 4 : signature divergente

**Définition** : Une signature divergente est un appel de méthode où le type des arguments ne correspond pas au type déclaré dans la signature. Cela produit un TypeError en mode strict, ou une conversion silencieuse aberrante sinon.

**Le problème que ce pattern crée** :

1. **TypeError en production** : si le mode strict est activé partiellement, le bug se manifeste seulement dans certains chemins.
2. **Conversion silencieuse** : sans mode strict, un objet passé là où une chaîne est attendue devient `'array'` ou une représentation textuelle aberrante.
3. **Logique cassée en aval** : la méthode appelée reçoit une donnée invalide, et son résultat est faux sans erreur immédiate.

**Exemple** :

```php
// Signature de la méthode appelée
public function userImport(string $email): ?User
{
    // Attend un email en chaîne
}

// Appel dans un autre fichier
public function new(AdminContext $context): Response
{
    $userImported = $this->userManager->userImport($context);
    //                                              ^^^^^^^^
    // $context est un AdminContext, pas une string
}
```

**Analyse** :

- À l'appel, le mauvais type est passé : un objet `AdminContext` au lieu d'une chaîne.
- PHP en mode strict (`declare(strict_types=1)`) produit un `TypeError` immédiat.
- Sans mode strict, PHP tente une conversion. Pour un objet, cela appelle `__toString` s'il existe, sinon une erreur. Si une conversion silencieuse réussit, la valeur passée est aberrante (par exemple le nom de la classe) et la méthode appelée fait n'importe quoi.

**Comment détecter ce pattern** :

| Outil | Détection |
| --- | --- |
| PHPStan niveau 5+ | Détecte les types incompatibles à l'appel |
| Psalm | Détecte les types incompatibles à l'appel |
| `declare(strict_types=1)` | Erreur à l'exécution si mauvaise correspondance |
| Lecture humaine | Repérer les types des paramètres et des arguments |

---

### Pattern 5 : `??` versus `?:`

**Définition** : Les opérateurs `??` (coalescence nulle) et `?:` (ternaire court) semblent similaires mais ont des comportements différents. La confusion entre les deux est une source fréquente de bugs subtils.

**Le problème que ce pattern crée** :

1. **Confusion entre `null` et falsy** : `??` ne traite que `null` et non défini, `?:` traite tout ce qui est falsy.
2. **Défaut appliqué à tort** : si tu veux qu'un `0` reste un `0`, `?:` le remplace par le défaut, ce qui peut être faux.
3. **Défaut non appliqué quand attendu** : si tu veux qu'une chaîne vide soit remplacée, `??` ne la touche pas.

**Comparaison** :

| Opérateur | Renvoie défaut si | Exemple |
| --- | --- | --- |
| `?? 'def'` | `null` ou non défini | `$x ?? 'def'` |
| `?: 'def'` | Falsy (`null`, `false`, `0`, `''`, `[]`) | `$x ?: 'def'` |

**Exemple de mauvaise utilisation** :

```php
// Cas 1 : tu veux qu'un 0 reste un 0
$count = $data['count'] ?? 0;       // Bon : si 0 dans le tableau, on garde 0
$count = $data['count'] ?: 0;       // Faux : si 0 dans le tableau, ?: applique le défaut (qui est 0 ici, donc invisible)

// Cas 2 : tu veux qu'une chaîne vide soit remplacée
$name = $data['name'] ?? 'inconnu'; // Faux : si '' dans le tableau, on garde ''
$name = $data['name'] ?: 'inconnu'; // Bon : si '' dans le tableau, on remplace par 'inconnu'

// Cas 3 : faute de frappe classique
$value = $data['key'] ?? 'null';    // Faux : retourne la chaîne 'null', pas la valeur null
$value = $data['key'] ?? null;      // Bon : retourne null si la clé est absente
```

**Ce que ce pattern n'est PAS** :

- Ce n'est pas un choix neutre entre deux opérateurs équivalents. Les deux ne sont pas interchangeables.
- Ce n'est pas un détail. Une utilisation incorrecte change la logique métier, pas seulement la performance.

---

### Pattern 6 : `match` sans `default` (PHP 8+)

**Définition** : L'expression `match` de PHP 8 ne possède pas de branche `default`. Si aucun bras ne correspond à la valeur testée, PHP lève un `UnhandledMatchError` à l'exécution. Contrairement au `switch`, il n'y a pas de "chute silencieuse" : le programme s'arrête.

**Le problème que ce pattern crée** :

1. **Erreur fatale non anticipée** : si l'ensemble des valeurs possibles évolue (nouveau statut ajouté en BDD, nouvelle valeur d'enum), toutes les expressions `match` sans `default` deviennent des bombes à retardement.
2. **Détection difficile** : PHPStan peut le détecter si les types sont précis, mais pas toujours sur des chaînes dynamiques.

**Exemple** :

```php
// Dangereux si $status peut prendre une valeur non listée
$label = match ($status) {
    'pending'  => 'En attente',
    'approved' => 'Approuvé',
    'rejected' => 'Rejeté',
    // Pas de default : si $status === 'cancelled', UnhandledMatchError
};
```

**Solutions** :

| Situation | Solution |
| --- | --- |
| Toutes les valeurs sont connues et fixes | Ajouter `default => throw new \UnexpectedValueException(...)` pour échouer explicitement |
| Valeur inconnue = cas neutre | Ajouter `default => null` ou une valeur de repli |
| PHP ≥ 8.1 (enums, disponibles depuis PHP 8.1 ; référence cursus PHP 8.3) | Utiliser un `enum` : le type contraint les valeurs possibles, PHPStan détecte les `match` incomplets |

**Ce que ce pattern n'est PAS** :

- Ce n'est pas un bug PHP. C'est le comportement voulu : `match` est strict par design.
- Ce n'est pas toujours une erreur d'omettre le `default`. Si tu cibles un enum exhaustif, l'absence de `default` signifie "tout est couvert" - mais ajoute quand même un `default => throw` pour protéger contre les futures valeurs.

---

## Étapes Pratiques

### Étape 1 : Activer les warnings PHP

Beaucoup de bugs deviennent visibles dès qu'on n'ignore plus les warnings émis par PHP.

```php
// public/index.php ou bin/console (en environnement de dev uniquement)
error_reporting(E_ALL);
ini_set('display_errors', '1');
```

En production, garde `display_errors` à `0` et redirige les warnings vers les logs.

**Résultat attendu** :

```text
PHP Warning: Undefined variable $statusToTransition in /app/src/Controller/CommentController.php on line 42
```

---

### Étape 2 : Faire passer PHPStan ou Psalm

PHPStan et Psalm sont des analyseurs statiques qui attrapent les patterns décrits dans la section Concepts.

```bash
composer require --dev phpstan/phpstan
vendor/bin/phpstan analyse src --level 6
```

Les niveaux 5 et plus attrapent : variables non déclarées, mauvais types, conditions toujours vraies ou fausses, méthodes inexistantes.

**Résultat attendu** :

```text
 ------ ------------------------------------------------------------------
  Line   src/Controller/CommentController.php
 ------ ------------------------------------------------------------------
  42     Variable $statusToTransition might not be defined.
 ------ ------------------------------------------------------------------
  Line   src/Controller/UserCrudController.php
 ------ ------------------------------------------------------------------
  87     Parameter #1 $email of method UserManager::userImport()
         expects string, AdminContext given.
 ------ ------------------------------------------------------------------
```

---

### Étape 3 : Lire le code en cherchant les patterns

Pour chaque méthode du code que tu audites, pose-toi ces cinq questions :

1. Toutes les variables utilisées sont-elles déclarées plus haut ou passées en paramètre ?
2. Y a-t-il une comparaison qui implique deux types différents ?
3. Y a-t-il un appel de méthode dont la signature ne correspond pas aux arguments ?
4. Y a-t-il un `?? 'string'` qui retourne une chaîne plutôt que `null` ?
5. Y a-t-il une variable réutilisée qui change de sens au fil du code ?

Note chaque suspicion dans un fichier dédié au lieu de modifier le code immédiatement.

---

### Étape 4 : Décider entre correction directe et test de confirmation

Une fois qu'un bug est suspecté, tu dois choisir entre corriger directement et écrire un test de confirmation. Le tableau ci-dessous t'aide à décider.

| Situation | Action |
| --- | --- |
| Bug évident, fix trivial, code peu critique | Corriger directement avec un commit explicatif |
| Bug évident, fix trivial, code critique | Écrire un test rouge, corriger, vérifier vert |
| Bug suspect, hypothèse à valider | Écrire un test qui devrait passer si le code était correct |
| Bug confirmé mais correction non triviale | Ouvrir une issue, ne pas corriger seul |

Le test de confirmation transforme une intuition en preuve. C'est aussi une protection contre le risque de "corriger" un code qui était voulu ainsi pour une raison non documentée.

---

### Étape 5 : Documenter le bug

Pour chaque bug confirmé, écris une entrée dans un fichier `bug-hunt.md` (ou équivalent). Cette documentation devient la base d'une issue technique (voir fiche 6).

```markdown
## Bug n°1 - CommentController::index

**Suspicion** : variable `$statusToTransition` jamais déclarée.

**Analyse** :

- La variable est utilisée à la ligne 42 sans déclaration préalable.
- Le `??` n'empêche pas le warning sur l'index du tableau.
- La valeur de fallback est la chaîne `'null'`, pas la valeur `null`.

**Test écrit** : `CommentControllerTest::testIndexDoesNotEmitWarning`.

**Verdict** : bug confirmé, le test échoue avec `Warning: Undefined variable`.

**Recommandation** : déclarer le tableau `$statusToTransition` ou supprimer la branche morte.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `error_reporting(E_ALL)` | Activer tous les warnings et notices PHP |
| `php -d error_reporting=E_ALL script.php` | Activer les warnings en ligne de commande |
| `vendor/bin/phpstan analyse src --level 6` | Analyse statique niveau 6 (rigoureux) |
| `vendor/bin/psalm` | Alternative à PHPStan |
| `grep -rn "?? 'null'" src/` | Repérer les `??` sur la chaîne 'null' (suspect) |
| `grep -rn "== " src/ \| grep -v "==="` | Repérer les comparaisons faibles à examiner |
| `php -l fichier.php` | Vérifier la syntaxe PHP d'un fichier |
| `grep -rn "declare(strict_types=" src/` | Lister les fichiers en mode strict |

---

## Pièges Fréquents

### Piège 1 : Corriger sans confirmer

⚠️ **Problème** : Tu modifies un code qui te semble buggué, mais en réalité c'était voulu pour une raison non documentée (compatibilité héritée, contournement d'un autre bug, contrainte externe).

✅ **Solution** : Toujours confirmer par un test ou une discussion avec l'équipe avant de corriger. Le test de confirmation transforme l'intuition en preuve.

---

### Piège 2 : Lire chaque ligne

⚠️ **Problème** : Tu essaies de lire chaque ligne du code source en cherchant des bugs en général. Tu te noies dans les détails et tu rates les patterns importants.

✅ **Solution** : Cible des patterns, pas des fichiers complets. Fais une passe par famille de bugs (syntaxique, sémantique, structurel), avec une liste de patterns par passe.

---

### Piège 3 : Faire confiance aveugle à PHPStan

⚠️ **Problème** : Tu lances PHPStan, il ne trouve rien, donc tu conclus qu'il n'y a pas de bug.

✅ **Solution** : PHPStan trouve beaucoup, pas tout. La lecture humaine reste indispensable sur les choix sémantiques (magic strings, conventions métier, intention de l'auteur).

---

### Piège 4 : Confondre warning et bug

⚠️ **Problème** : Tu vois un warning et tu conclus immédiatement à un bug, ou inversement tu vois un code sans warning et tu conclus qu'il est correct.

✅ **Solution** : Un warning ne signifie pas toujours qu'il y a un bug. Il peut être pertinent (variable non déclarée à intention douteuse) ou anodin (avertissement de dépréciation). Inversement, un code sans warning peut contenir un bug sémantique. Analyse chaque cas en contexte.

---

### Piège 5 : Refactorer pendant l'audit

⚠️ **Problème** : Tu modifies du code que tu cherches à comprendre, et tu perds la trace de l'original. Tu ne sais plus si ton "amélioration" a introduit un nouveau bug.

✅ **Solution** : Audit d'abord, refactor ensuite. Note tes suspicions dans `bug-hunt.md` sans toucher au code. Une fois l'audit terminé, traite les bugs un par un avec une stratégie claire (test, correction, commit).

---

## Checklist de Validation

- [ ] Je sais activer les warnings PHP et lancer PHPStan
- [ ] Je reconnais le pattern de la variable jamais déclarée
- [ ] Je sais distinguer `??` et `?:` et leurs comportements respectifs
- [ ] Je sais repérer les comparaisons toujours vraies ou toujours fausses
- [ ] Je sais identifier les signatures divergentes entre appel et déclaration
- [ ] Je sais quand corriger directement et quand écrire un test de confirmation
- [ ] J'ai documenté chaque bug confirmé dans un fichier dédié

---

## Exercice Pratique

**Énoncé** : Audite le code ci-dessous et identifie tous les patterns suspects.

```php
public function processForm(Request $request): Response
{
    $type = $request->request->get('type');

    if ($type == 1) {
        $name = $request->request->get('name');
        $candidate = $namesByType[$type] ?? 'null';

        if ($candidate && in_array($candidate, $allowedNames)) {
            return $this->processSpecial($name, 'urgent' ? 'priority' : 'standard');
        }
    }

    if ($type === 'admin') {
        // ...
    }

    return $this->render('form.html.twig');
}
```

**Indications** :

- Identifie au moins 5 patterns douteux
- Pour chaque, indique si tu corrigerais directement ou si tu écrirais un test de confirmation
- Justifie chaque choix en quelques mots

**Résultat attendu** : Une liste structurée avec, pour chaque pattern : son nom, sa localisation (numéro de ligne approximatif), son risque, et la décision (correction directe ou test).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Patterns identifiés** :

1. **`$type == 1` : comparaison faible**

    - Localisation : ligne `if ($type == 1)`.
    - Risque : si `$type` vient d'un formulaire, c'est toujours une chaîne. `'1' == 1` est vrai, mais `'a1' == 1` était vrai aussi en PHP < 8.
    - Action : corriger en `===` après cast explicite, ou comparer directement à la chaîne `'1'`. Correction directe car l'intention est claire et le code est court.

2. **`$namesByType` jamais déclarée**

    - Localisation : ligne `$namesByType[$type] ?? 'null'`.
    - Risque : variable utilisée mais jamais assignée dans la méthode. Le `??` masque partiellement le warning sur l'index.
    - Action : écrire un test de confirmation (probable bug avec impact métier), puis corriger.

3. **`?? 'null'` : chaîne au lieu de valeur `null`**

    - Localisation : même ligne que ci-dessus.
    - Risque : retourne la chaîne `'null'` au lieu de la valeur `null`. La condition `if ($candidate && ...)` est donc toujours évaluée à vrai sur le booléen (chaîne non vide est truthy).
    - Action : écrire un test pour confirmer que la branche est toujours prise, puis corriger en `?? null` ou refactorer la logique.

4. **`'urgent' ? 'priority' : 'standard'` : ternaire toujours truthy**

    - Localisation : appel à `processSpecial`.
    - Risque : la chaîne `'urgent'` est toujours évaluée à `true`. Le ternaire retourne toujours `'priority'`. La branche `'standard'` est morte.
    - Action : correction directe (intention claire, c'est une faute de frappe : une variable de comparaison a été oubliée).

5. **`in_array(...)` sans `strict: true`**

    - Localisation : `in_array($candidate, $allowedNames)`.
    - Risque : match faible. Si `$candidate` vaut `'0'` et `$allowedNames` contient `false`, le match est vrai par erreur.
    - Action : correction directe en ajoutant `, true` en troisième argument. C'est une amélioration sans risque.

6. **`$type === 'admin'` après `$type == 1`**

    - Localisation : deuxième `if`.
    - Risque : l'inversion entre comparaison faible (`==`) et stricte (`===`) suggère un code écrit par plusieurs personnes ou à plusieurs époques. L'incohérence en elle-même n'est pas un bug, mais elle est un signal d'alerte sur la qualité globale du fichier.
    - Action : harmoniser sur `===` partout. Correction directe.

7. **`$allowedNames` jamais déclarée**

    - Localisation : `in_array($candidate, $allowedNames)`.
    - Risque : même patron que le pattern 2. Variable utilisée mais jamais assignée.
    - Action : écrire un test de confirmation, puis corriger.

**Synthèse** : sur 7 patterns identifiés, 4 méritent une correction directe (intention claire, faible risque) et 3 méritent un test de confirmation préalable (variables non déclarées, valeur retournée par `??`). Cette méthode garantit que chaque modification est soit triviale, soit prouvée nécessaire par un test.

---

## Navigation

← Fiche précédente : **[Prioriser les risques](04-prioriser-risques.md)**

→ Fiche suivante : **[Rédiger une issue technique efficace](06-rediger-issue-technique.md)**
