---
tags:
  - Faust
  - Débutant
  - Concept
description: "Programmation fonctionnelle - concepts fondamentaux pour comprendre le paradigme de Faust"
estimated_time: "95 min"
fiche_number: 1
total_fiches: 3
cursus: "Phase 2 - Prérequis programmation"
---

# 01 - Programmation fonctionnelle - concepts

> **En bref** : À la fin de cette fiche, tu sauras expliquer les concepts clés de la programmation fonctionnelle et comprendre pourquoi Faust est un langage fonctionnel. Lecture estimée : 95 min.


## Prérequis

- Aucune connaissance préalable de programmation fonctionnelle n'est requise (tout est expliqué ci-dessous)
- Une familiarité minimale avec la notion de variable et de fonction dans un langage quelconque est utile, mais pas obligatoire

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les concepts clés de la programmation fonctionnelle et comprendre pourquoi Faust est un langage fonctionnel.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un paradigme de programmation ?

**Définition** : Un paradigme de programmation est une façon de structurer et d'organiser un programme. C'est un ensemble de règles et de principes qui dictent comment écrire du code.

**Le problème que les paradigmes résolvent** :

Sans paradigme, voici les problèmes rencontrés :

1. **Absence de structure** : chaque programmeur organise son code différemment, rendant la lecture et la maintenance difficiles.
2. **Pas de garanties** : sans règles, rien n'empêche d'écrire du code imprévisible ou impossible à vérifier.
3. **Réutilisation limitée** : sans conventions partagées, le code d'un programmeur est difficilement réutilisable par un autre.

**Comment les paradigmes résolvent ces problèmes** :

| Problème              | Solution apportée par un paradigme                              |
| --------------------- | --------------------------------------------------------------- |
| Absence de structure  | Des règles communes imposent une organisation lisible           |
| Pas de garanties      | Le paradigme interdit certaines pratiques sources d'erreurs     |
| Réutilisation limitée | Des conventions partagées permettent de comprendre le code d'autrui |

**Analogie concrète** : Un paradigme, c'est comme un système de rangement dans un entrepôt. Le système "par couleur" range les objets par couleur. Le système "par taille" range les objets par taille. Les deux fonctionnent, mais chacun impose des règles différentes. Un programmeur qui connaît le système de rangement retrouve immédiatement ce qu'il cherche.

**Les deux paradigmes principaux** :

| Paradigme impératif                      | Paradigme fonctionnel                          |
| ---------------------------------------- | ---------------------------------------------- |
| Décrit **comment** faire (étape par étape) | Décrit **quoi** calculer (résultat attendu)    |
| Modifie des variables en mémoire         | Produit de nouvelles valeurs sans modifier l'existant |
| Utilise des boucles et des conditions    | Utilise des fonctions et la composition        |
| Exemples : C, Java, Python (style usuel) | Exemples : Haskell, Faust, Erlang             |

---

### Qu'est-ce que le paradigme impératif ?

**Définition** : Le paradigme impératif décrit un programme comme une suite d'instructions qui modifient l'état de la mémoire, étape par étape. Le programmeur indique au programme **comment** arriver au résultat.

**Caractéristiques du paradigme impératif** :

- Le programme contient des **variables** dont la valeur change au fil du temps
- Le programme utilise des **boucles** (pour, tant que) pour répéter des instructions
- L'**ordre des instructions** compte : inverser deux lignes peut changer le résultat
- Le programme a un **état** (l'ensemble des valeurs des variables à un instant donné)

**Exemple en pseudo-code impératif** :

```text
-- Calculer la somme des nombres de 1 à 5
total = 0             -- On crée une variable et on met 0 dedans
i = 1                 -- On crée un compteur

TANT QUE i <= 5 :     -- On répète tant que i n'a pas dépassé 5
    total = total + i  -- On modifie total en ajoutant i
    i = i + 1          -- On modifie i en ajoutant 1

AFFICHER total         -- Résultat : 15
```

Ce programme modifie `total` et `i` à chaque tour de boucle. L'état de la mémoire change constamment.

---

### Qu'est-ce que le paradigme fonctionnel ?

**Définition** : Le paradigme fonctionnel décrit un programme comme un ensemble de fonctions mathématiques qui transforment des données d'entrée en données de sortie, sans modifier d'état en mémoire. Le programmeur indique au programme **quoi** calculer.

**Le problème que le paradigme fonctionnel résout** :

Sans paradigme fonctionnel, voici les problèmes rencontrés :

1. **État partagé imprévisible** : quand plusieurs parties du programme modifient la même variable, le résultat dépend de l'ordre d'exécution. C'est une source majeure de bugs.
2. **Difficulté à paralléliser** : si deux instructions modifient la même donnée, on ne peut pas les exécuter en même temps sans risque de conflit.
3. **Tests difficiles** : pour tester une fonction qui dépend de variables globales, il faut recréer tout l'état du programme.
4. **Optimisation limitée** : le compilateur ne peut pas réorganiser les instructions si l'ordre compte.

**Comment le paradigme fonctionnel résout ces problèmes** :

| Problème                      | Solution apportée par le fonctionnel                          |
| ----------------------------- | ------------------------------------------------------------- |
| État partagé imprévisible     | Pas de modification d'état : chaque fonction produit une nouvelle valeur |
| Difficulté à paralléliser     | Sans état partagé, les fonctions s'exécutent en parallèle sans conflit |
| Tests difficiles              | Une fonction pure ne dépend que de ses arguments : facile à tester isolément |
| Optimisation limitée          | Le compilateur peut réorganiser librement les calculs          |

**Analogie concrète** : Imagine deux approches pour préparer un repas. L'approche impérative, c'est un chef qui utilise un seul plan de travail et modifie le contenu d'un même saladier à chaque étape (il y met la farine, puis ajoute les oeufs, puis mélange). L'approche fonctionnelle, c'est un chef qui utilise un bol propre à chaque étape : il prend la farine (bol 1), les oeufs (bol 2), et produit un mélange dans un nouveau bol (bol 3) sans jamais modifier le contenu des bols précédents.

**Ce que le paradigme fonctionnel n'est PAS** :

- Le paradigme fonctionnel n'est pas un simple "style de codage". C'est un ensemble de principes stricts qui changent fondamentalement la façon de concevoir un programme.
- Le paradigme fonctionnel n'est pas incompatible avec le monde réel. Certains langages (Haskell, Faust, Erlang) l'utilisent en production pour des systèmes critiques.
- Le paradigme fonctionnel n'est pas forcément plus lent. Les compilateurs de langages fonctionnels produisent souvent du code aussi rapide (voire plus rapide) que le code impératif équivalent, grâce aux optimisations rendues possibles par l'absence d'effets de bord.

**Exemple en pseudo-code fonctionnel** :

```text
-- Calculer la somme des nombres de 1 à 5

FONCTION somme(n) :
    SI n == 0 :
        RETOURNER 0
    SINON :
        RETOURNER n + somme(n - 1)

AFFICHER somme(5)      -- Résultat : 15
```

Ce programme ne modifie aucune variable. Chaque appel à `somme` produit une nouvelle valeur.

---

### Qu'est-ce qu'une fonction pure ?

**Définition** : Une fonction pure est une fonction qui, pour les mêmes arguments en entrée, retourne toujours le même résultat, et ne produit aucun effet de bord (elle ne modifie rien en dehors d'elle-même).

**Le problème que les fonctions pures résolvent** :

Sans fonctions pures, voici les problèmes rencontrés :

1. **Résultats imprévisibles** : une fonction qui dépend d'une variable globale peut retourner un résultat différent à chaque appel, même avec les mêmes arguments.
2. **Effets cachés** : une fonction qui modifie un fichier, une base de données ou une variable globale a des conséquences invisibles pour celui qui l'appelle.
3. **Tests complexes** : pour tester une fonction impure, il faut préparer tout l'environnement (fichiers, base de données, variables globales) avant chaque test.

**Comment les fonctions pures résolvent ces problèmes** :

| Problème                | Solution apportée par les fonctions pures                   |
| ----------------------- | ----------------------------------------------------------- |
| Résultats imprévisibles | Même entrée = même sortie, toujours                         |
| Effets cachés           | Aucun effet de bord : la fonction ne touche à rien d'autre  |
| Tests complexes         | Pour tester : vérifier que f(entrée) == sortie attendue     |

**Analogie concrète** : Une fonction pure, c'est comme un distributeur de boissons fiable. Tu mets 2 euros et tu appuies sur "Café" : tu obtiens toujours un café. Le distributeur ne change pas la température de la pièce, n'envoie pas de SMS, ne modifie rien autour de lui. Il prend une entrée et produit une sortie, point final.

**Ce qu'une fonction pure n'est PAS** :

- Une fonction pure n'est pas une fonction qui "ne fait rien d'utile". Elle fait exactement une chose : transformer une entrée en sortie.
- Une fonction pure n'est pas nécessairement simple. Elle peut effectuer des calculs très complexes, tant qu'elle ne modifie rien en dehors d'elle-même.

**Propriété clé : la transparence référentielle** :

Une fonction pure est **référentiellement transparente**. Cela signifie qu'on peut remplacer l'appel de la fonction par sa valeur de retour sans changer le comportement du programme.

```text
-- Fonction pure
FONCTION doubler(x) :
    RETOURNER x * 2

-- Ces deux lignes sont équivalentes :
resultat = doubler(5) + doubler(3)
resultat = 10 + 6

-- Le compilateur peut remplacer doubler(5) par 10 librement
-- C'est la transparence référentielle
```

```text
-- Fonction impure (CONTRE-EXEMPLE)
compteur = 0

FONCTION ajouter_et_compter(x) :
    compteur = compteur + 1     -- Effet de bord : modifie compteur
    RETOURNER x + compteur

-- Premier appel : ajouter_et_compter(5) retourne 6  (compteur vaut 1)
-- Deuxième appel : ajouter_et_compter(5) retourne 7  (compteur vaut 2)
-- Même entrée (5), mais résultat différent à chaque appel
```

**Lien avec Faust** : En Faust, chaque bloc de traitement audio est une fonction pure. Un filtre passe-bas, par exemple, prend un signal en entrée et produit un signal filtré en sortie, sans modifier d'état global. C'est ce qui permet au compilateur Faust d'optimiser et de paralléliser le code automatiquement.

---

### Qu'est-ce que la composition de fonctions ?

**Définition** : La composition de fonctions consiste à combiner deux ou plusieurs fonctions en une nouvelle fonction, en utilisant la sortie d'une fonction comme entrée de la suivante. En notation mathématique : `(f . g)(x) = f(g(x))`.

**Le problème que la composition de fonctions résout** :

Sans composition de fonctions, voici les problèmes rencontrés :

1. **Variables intermédiaires inutiles** : on doit stocker chaque résultat intermédiaire dans une variable, ce qui alourdit le code.
2. **Logique fragmentée** : la transformation complète est dispersée sur plusieurs lignes, rendant difficile la compréhension du flux de données.
3. **Réutilisation difficile** : chaque transformation est codée "en dur" dans une séquence, pas combinable librement.

**Comment la composition de fonctions résout ces problèmes** :

| Problème                        | Solution apportée par la composition               |
| ------------------------------- | --------------------------------------------------- |
| Variables intermédiaires inutiles | Le résultat passe directement d'une fonction à l'autre |
| Logique fragmentée              | La chaîne de transformations se lit comme un pipeline |
| Réutilisation difficile         | On combine les fonctions librement pour créer de nouvelles transformations |

**Analogie concrète** : La composition de fonctions, c'est comme une chaîne de montage dans une usine. La pièce brute entre à gauche, passe par la machine A (qui la découpe), puis par la machine B (qui la ponce), puis par la machine C (qui la peint). Chaque machine prend le résultat de la précédente. On peut réorganiser les machines ou en ajouter de nouvelles sans reconstruire toute l'usine.

```text
-- Sans composition : variables intermédiaires
donnees = [3, 1, 4, 1, 5, 9]
resultat1 = filtrer_pairs(donnees)       -- [4]
resultat2 = doubler_chaque(resultat1)    -- [8]
resultat3 = somme(resultat2)             -- 8

-- Avec composition : pipeline direct
resultat = somme(doubler_chaque(filtrer_pairs(donnees)))
-- Résultat : 8

-- Ou, avec un opérateur de composition (noté >> ici) :
traitement = filtrer_pairs >> doubler_chaque >> somme
resultat = traitement(donnees)
-- Résultat : 8
```

**Lien direct avec Faust** : En Faust, l'opérateur `:` (séquentiel) est exactement un opérateur de composition. Il connecte la sortie d'un bloc à l'entrée du suivant :

```faust
// En Faust : composition avec l'opérateur séquentiel ":"
// Le signal entre à gauche, passe par le gain, puis par le filtre
process = *(0.5) : fi.lowpass(2, 1000);
// Équivalent à : filtre(gain(signal))
```

Ce code signifie : prendre le signal d'entrée, le multiplier par 0.5, puis appliquer un filtre passe-bas. C'est une composition de deux fonctions.

---

### Qu'est-ce qu'une fonction d'ordre supérieur (HOF) ?

**Définition** : Une fonction d'ordre supérieur est une fonction qui prend une ou plusieurs fonctions comme arguments, ou qui retourne une fonction comme résultat. Le terme anglais est _Higher-Order Function_ (HOF).

**Le problème que les fonctions d'ordre supérieur résolvent** :

Sans fonctions d'ordre supérieur, voici les problèmes rencontrés :

1. **Duplication de code** : pour appliquer différentes opérations à une liste, on réécrit une boucle à chaque fois, seule l'opération change.
2. **Code rigide** : chaque fonction fait exactement une chose. On ne peut pas personnaliser son comportement sans modifier son code source.
3. **Abstraction limitée** : on ne peut pas exprimer des patterns généraux comme "appliquer une opération à chaque élément".

**Comment les fonctions d'ordre supérieur résolvent ces problèmes** :

| Problème            | Solution apportée par les HOF                                 |
| ------------------- | ------------------------------------------------------------- |
| Duplication de code | Une seule fonction générique (map, filter) remplace toutes les boucles |
| Code rigide         | On passe l'opération en argument, rendant la fonction flexible |
| Abstraction limitée | Les HOF permettent d'exprimer des patterns réutilisables       |

**Analogie concrète** : Imagine une machine à café programmable. Sans HOF, tu as une machine qui fait uniquement des expressos. Avec HOF, tu as une machine qui accepte une "recette" (une fonction) en entrée : tu lui donnes la recette "expresso" et elle fait un expresso, tu lui donnes la recette "cappuccino" et elle fait un cappuccino. La machine est la même, c'est la recette passée en paramètre qui change le résultat.

**Ce qu'une HOF n'est PAS** :

- Une HOF n'est pas une fonction "compliquée". `map` (appliquer une opération à chaque élément) est une HOF, et son principe est simple.
- Une HOF n'est pas spécifique aux langages fonctionnels. JavaScript, Python et Java (depuis la version 8) supportent les HOF.

**Les trois HOF fondamentales** :

```text
-- MAP : appliquer une fonction à chaque élément
map(doubler, [1, 2, 3])
-- Résultat : [2, 4, 6]
-- "doubler" est passée en argument à "map"

-- FILTER : garder les éléments qui satisfont un critère
filter(est_pair, [1, 2, 3, 4, 5])
-- Résultat : [2, 4]
-- "est_pair" est passée en argument à "filter"

-- REDUCE : combiner tous les éléments en une seule valeur
reduce(addition, [1, 2, 3, 4, 5], 0)
-- Résultat : 15
-- "addition" est passée en argument à "reduce"
-- 0 est la valeur initiale
```

**Exemple de fonction qui retourne une fonction** :

```text
FONCTION creer_multiplicateur(facteur) :
    RETOURNER FONCTION(x) :
        RETOURNER x * facteur

doubler = creer_multiplicateur(2)
tripler = creer_multiplicateur(3)

doubler(5)    -- Résultat : 10
tripler(5)    -- Résultat : 15
```

La fonction `creer_multiplicateur` retourne une nouvelle fonction. C'est une HOF.

---

### Qu'est-ce que la récursion ?

**Définition** : La récursion est une technique où une fonction s'appelle elle-même pour résoudre un problème, en le décomposant en sous-problèmes plus petits. Chaque appel récursif traite un cas plus simple, jusqu'à atteindre un **cas de base** qui arrête la récursion.

**Le problème que la récursion résout** :

Sans récursion, voici les problèmes rencontrés :

1. **Structures imbriquées** : parcourir un arbre de fichiers ou une structure hiérarchique est très difficile avec des boucles classiques.
2. **Définitions naturellement récursives** : certains problèmes se décrivent naturellement en termes d'eux-mêmes (factorielle, suites mathématiques).
3. **Pas de boucle en fonctionnel pur** : dans un langage fonctionnel pur, il n'y a pas de boucle `POUR` ou `TANT QUE` (car les boucles nécessitent de modifier un compteur). La récursion les remplace.

**Comment la récursion résout ces problèmes** :

| Problème                            | Solution apportée par la récursion                    |
| ----------------------------------- | ----------------------------------------------------- |
| Structures imbriquées               | La fonction s'appelle sur chaque sous-structure       |
| Définitions naturellement récursives | Le code reflète directement la définition mathématique |
| Pas de boucle en fonctionnel pur    | La récursion remplace les boucles sans modifier d'état |

**Analogie concrète** : Imagine que tu veux compter les personnes dans une file d'attente, mais tu ne vois que la personne devant toi. Tu demandes à la première : "Combien de personnes derrière toi ?" Elle pose la même question à la suivante, et ainsi de suite. La dernière répond "zéro" (cas de base). Chaque personne ajoute 1 à la réponse reçue et la transmet. Quand la réponse revient jusqu'à toi, tu as le total.

**Ce que la récursion n'est PAS** :

- La récursion n'est pas une boucle infinie. Toute récursion correcte a un **cas de base** qui l'arrête.
- La récursion n'est pas toujours moins performante qu'une boucle. Certains compilateurs optimisent la récursion terminale pour la rendre aussi rapide qu'une boucle (on appelle cela _tail call optimization_).

**Les deux éléments obligatoires d'une récursion** :

1. **Cas de base** : la condition qui arrête la récursion (sans lui, la fonction s'appelle indéfiniment et le programme plante)
2. **Cas récursif** : l'appel de la fonction à elle-même, avec un argument **plus petit** (qui se rapproche du cas de base)

```text
-- Factorielle : 5! = 5 * 4 * 3 * 2 * 1 = 120
FONCTION factorielle(n) :
    SI n == 0 :                       -- Cas de base
        RETOURNER 1
    SINON :                           -- Cas récursif
        RETOURNER n * factorielle(n - 1)

factorielle(5)
-- factorielle(5) = 5 * factorielle(4)
-- factorielle(4) = 4 * factorielle(3)
-- factorielle(3) = 3 * factorielle(2)
-- factorielle(2) = 2 * factorielle(1)
-- factorielle(1) = 1 * factorielle(0)
-- factorielle(0) = 1                 -- Cas de base atteint
-- Remontée : 1 * 1 * 2 * 3 * 4 * 5 = 120
```

**La pile d'appels** :

Chaque appel récursif est empilé dans la **pile d'appels** (call stack) de la mémoire. Quand le cas de base est atteint, les appels se "dépilent" un par un :

```text
-- Pile d'appels pour factorielle(4) :
|  factorielle(0) = 1              |  <-- sommet (dernier appel)
|  factorielle(1) = 1 * 1 = 1     |
|  factorielle(2) = 2 * 1 = 2     |
|  factorielle(3) = 3 * 2 = 6     |
|  factorielle(4) = 4 * 6 = 24    |  <-- base (premier appel)
```

**Lien avec Faust** : En Faust, l'opérateur `~` (tilde) crée une **boucle de rétroaction récursive**. La sortie d'un bloc est renvoyée à son entrée, échantillon par échantillon. C'est le mécanisme qui permet de créer des filtres et des oscillateurs :

```faust
// Compteur simple en Faust : le signal se réinjecte
// +(1) ajoute 1, puis ~ renvoie le résultat en entrée
process = +(1) ~ _;
// Produit : 1, 2, 3, 4, 5, 6...
// _ signifie "le signal tel quel" (identité)
```

---

### Qu'est-ce que l'immutabilité ?

**Définition** : L'immutabilité signifie qu'une donnée, une fois créée, ne peut jamais être modifiée. Pour obtenir une version différente de la donnée, on crée une **nouvelle** donnée.

**Le problème que l'immutabilité résout** :

Sans immutabilité, voici les problèmes rencontrés :

1. **Modifications imprévues** : une partie du programme modifie une donnée, et une autre partie du programme utilise cette même donnée sans savoir qu'elle a changé.
2. **Accès concurrent dangereux** : si deux processus modifient la même donnée en même temps, le résultat est imprévisible (condition de course).
3. **Débogage difficile** : quand une donnée a une valeur inattendue, il faut retrouver quel code l'a modifiée, ce qui peut être n'importe où dans le programme.

**Comment l'immutabilité résout ces problèmes** :

| Problème                      | Solution apportée par l'immutabilité                     |
| ----------------------------- | -------------------------------------------------------- |
| Modifications imprévues       | Impossible de modifier une donnée : elle reste constante |
| Accès concurrent dangereux    | Pas de conflit : personne ne modifie la donnée           |
| Débogage difficile            | La valeur d'une donnée est fixée à sa création           |

**Analogie concrète** : L'immutabilité, c'est comme un registre comptable. Quand tu fais une erreur dans un registre, tu ne gommes pas la ligne. Tu ajoutes une **nouvelle ligne** qui corrige l'erreur. L'historique complet est conservé. Tu peux toujours remonter dans le temps pour voir l'état exact du registre à n'importe quel moment.

**Ce que l'immutabilité n'est PAS** :

- L'immutabilité ne signifie pas que le programme ne peut pas évoluer. Le programme crée de nouvelles données à chaque étape, il ne modifie pas les anciennes.
- L'immutabilité ne gaspille pas forcément de la mémoire. Les compilateurs modernes partagent les parties communes entre l'ancienne et la nouvelle donnée (technique appelée _structural sharing_).

```text
-- Style mutable (modifie la donnée originale)
liste = [1, 2, 3]
liste.ajouter(4)         -- liste vaut maintenant [1, 2, 3, 4]
                         -- L'ancienne version [1, 2, 3] est perdue

-- Style immutable (crée une nouvelle donnée)
liste1 = [1, 2, 3]
liste2 = liste1 + [4]   -- liste2 vaut [1, 2, 3, 4]
                         -- liste1 vaut toujours [1, 2, 3]
```

**Lien avec Faust** : En Faust, les signaux sont des flux immuables. Un signal audio est une séquence infinie de valeurs (une par échantillon). On ne "modifie" jamais un signal existant : on crée un **nouveau signal** en appliquant une transformation.

```faust
// Le signal d'entrée n'est pas modifié
// On crée un nouveau signal = l'entrée multipliée par 0.5
process = *(0.5);
// L'entrée originale existe toujours, intacte
// *(0.5) produit un nouveau flux de valeurs
```

---

### Qu'est-ce que la curryfication et l'application partielle ?

**Définition** : La curryfication est la transformation d'une fonction qui prend plusieurs arguments en une suite de fonctions qui prennent chacune un seul argument. L'application partielle consiste à fournir seulement une partie des arguments d'une fonction, obtenant une nouvelle fonction qui attend les arguments restants.

**Le problème que la curryfication et l'application partielle résolvent** :

Sans curryfication ni application partielle, voici les problèmes rencontrés :

1. **Fonctions rigides** : une fonction à 3 paramètres exige toujours ses 3 paramètres d'un coup. On ne peut pas la personnaliser partiellement.
2. **Duplication de code** : si on veut une variante d'une fonction avec un paramètre fixé, on doit écrire une nouvelle fonction.
3. **Composition limitée** : les fonctions à plusieurs arguments se composent mal (la composition attend des fonctions à un argument).

**Comment la curryfication et l'application partielle résolvent ces problèmes** :

| Problème              | Solution                                                          |
| --------------------- | ----------------------------------------------------------------- |
| Fonctions rigides     | On fournit les arguments un par un, dans l'ordre souhaité        |
| Duplication de code   | On fixe un argument pour créer une variante, sans réécrire la fonction |
| Composition limitée   | Les fonctions à un argument se composent naturellement            |

**Analogie concrète** : Imagine un formulaire de commande en ligne. Sans application partielle, tu dois remplir tous les champs d'un coup (nom, adresse, produit, quantité). Avec application partielle, tu peux préremplir le nom et l'adresse (ce sont toujours les mêmes), et obtenir un formulaire simplifié qui ne demande plus que le produit et la quantité.

```text
-- Fonction classique à 2 arguments
FONCTION multiplier(a, b) :
    RETOURNER a * b

multiplier(3, 5)      -- Résultat : 15

-- Version curryfiée : chaque argument est fourni séparément
FONCTION multiplier_curry(a) :
    RETOURNER FONCTION(b) :
        RETOURNER a * b

multiplier_curry(3)(5)  -- Résultat : 15

-- Application partielle : on fixe le premier argument
tripler = multiplier_curry(3)
-- tripler est maintenant une fonction qui attend un seul argument

tripler(5)   -- Résultat : 15
tripler(10)  -- Résultat : 30
```

**Lien avec Faust** : En Faust, la curryfication est utilisée pour paramétrer les processeurs audio. Un filtre passe-bas est une fonction qui attend un ordre, une fréquence de coupure et un signal. On peut fixer l'ordre et la fréquence pour obtenir un filtre prêt à l'emploi :

```faust
// fi.lowpass est une fonction "curryfiée"
// fi.lowpass(2) fixe l'ordre à 2, retourne une fonction qui attend la fréquence
// fi.lowpass(2, 1000) fixe aussi la fréquence, retourne un processeur prêt
process = fi.lowpass(2, 1000);
// Ce processeur attend juste un signal en entrée
```

---

### Qu'est-ce que les Arrows ?

**Définition** : Les Arrows sont un concept de programmation fonctionnelle avancée, formalisé par John Hughes en 2000 (dans le langage Haskell). Une Arrow est une abstraction qui modélise un **calcul avec une entrée et une sortie**, composable de manière structurée. C'est une généralisation des fonctions et des monades.

**Le problème que les Arrows résolvent** :

Sans Arrows, voici les problèmes rencontrés :

1. **Flux de données complexes** : quand un calcul a plusieurs entrées et sorties, la composition simple de fonctions (f . g) ne suffit plus.
2. **Parallélisme structurel** : exprimer que deux calculs s'exécutent en parallèle sur des données séparées n'a pas de notation claire avec de simples fonctions.
3. **Boucles de rétroaction** : en traitement du signal, la sortie d'un bloc revient souvent en entrée (feedback). Les fonctions classiques ne modélisent pas cela.

**Comment les Arrows résolvent ces problèmes** :

| Problème                 | Solution apportée par les Arrows                           |
| ------------------------ | ---------------------------------------------------------- |
| Flux de données complexes | Les Arrows gèrent explicitement les entrées et sorties multiples |
| Parallélisme structurel  | L'opérateur `***` exécute deux Arrows en parallèle         |
| Boucles de rétroaction   | L'opérateur `loop` connecte la sortie à l'entrée           |

**Analogie concrète** : Imagine un réseau de tuyaux dans une usine de traitement d'eau. Chaque machine (Arrow) a des tuyaux d'entrée et des tuyaux de sortie. On peut connecter la sortie d'une machine à l'entrée d'une autre (composition séquentielle), faire passer l'eau dans deux machines en parallèle (composition parallèle), ou renvoyer une partie de la sortie vers l'entrée (boucle de recirculation). Les Arrows sont le plan de ce réseau de tuyaux.

**Ce que les Arrows ne sont PAS** :

- Les Arrows ne sont pas un concept nécessaire pour commencer à programmer en Faust. Tu peux utiliser Faust efficacement sans connaître la théorie des Arrows. Ce concept explique **pourquoi** Faust est conçu comme il l'est.
- Les Arrows ne sont pas des "flèches" au sens graphique. Le mot "Arrow" désigne une structure mathématique précise.

**Les opérateurs Arrow et leurs équivalents en Faust** :

| Opérateur Arrow (Haskell)       | Opérateur Faust | Signification                        |
| ------------------------------- | --------------- | ------------------------------------ |
| `>>>` (composition séquentielle) | `:`             | Connecter la sortie à l'entrée suivante |
| `***` (composition parallèle)   | `,`             | Exécuter deux calculs en parallèle   |
| `&&&` (fanout)                  | `<:`            | Envoyer une entrée vers plusieurs sorties |
| (pas d'équivalent direct)       | `:>`            | Fusionner plusieurs sorties vers moins d'entrées |
| `loop` (boucle de rétroaction)  | `~`             | Renvoyer la sortie vers l'entrée     |

**Faust est essentiellement un langage d'Arrows** sur les signaux audio. Chaque processeur Faust est une Arrow : il a des entrées, des sorties, et se compose avec d'autres processeurs via les cinq opérateurs de composition.

```faust
// Les 5 opérateurs de composition de Faust (dont 4 correspondent aux Arrows)
// Séquentiel (>>>)  : signal -> gain -> filtre
process = *(0.5) : fi.lowpass(2, 1000);

// Parallèle (***)  : deux signaux traités indépendamment
// process = *(0.5) , *(0.3);

// Split (<:)       : un signal envoyé vers deux traitements
// process = _ <: *(0.5) , *(0.3);

// Merge (:>)       : plusieurs sorties fusionnées (sommées) vers moins d'entrées
// process = _ <: *(0.5) , *(0.3) :> _;

// Feedback (~)     : la sortie revient en entrée (rétroaction)
// process = +(1) ~ _;
```

---

### Pourquoi Faust utilise le paradigme fonctionnel ?

**Définition** : Faust est un langage fonctionnel **par conception**. Ce choix n'est pas accidentel : le paradigme fonctionnel offre des propriétés essentielles pour le traitement du signal audio en temps réel.

**Les raisons du choix fonctionnel** :

1. **Déterminisme** : une fonction pure produit toujours le même résultat pour les mêmes entrées. En audio temps réel, un résultat imprévisible signifie un artefact sonore (clic, craquement, silence). Le déterminisme est non négociable.

2. **Parallélisme automatique** : sans état partagé, le compilateur Faust peut automatiquement distribuer les calculs sur plusieurs coeurs du processeur. Le programmeur n'a rien à faire : le compilateur détecte les parties indépendantes du programme et les parallélise.

3. **Optimisation par le compilateur** : grâce à la transparence référentielle, le compilateur Faust peut réorganiser, simplifier et optimiser le code sans risquer de changer son comportement. Il peut fusionner des boucles, éliminer les calculs redondants et produire du code C++ très efficace.

4. **Vérification formelle** : la sémantique fonctionnelle de Faust est définie mathématiquement. Le compilateur peut vérifier des propriétés du programme (nombre d'entrées/sorties, absence de division par zéro) avant même de le compiler.

5. **Composition naturelle** : en traitement du signal, on chaîne des blocs (oscillateur -> filtre -> amplificateur). C'est exactement la composition de fonctions. Le paradigme fonctionnel colle parfaitement à ce modèle.

**Comparaison : traitement audio impératif vs Faust** :

| Aspect                    | Approche impérative (C/C++)                        | Approche fonctionnelle (Faust)                  |
| ------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| Calcul audio              | Boucle for sur chaque échantillon                  | Fonction mathématique sur le signal              |
| Parallélisme              | Manuel (threads, mutex, gestion de la mémoire)     | Automatique (détecté par le compilateur)          |
| Optimisation              | Manuelle (le programmeur optimise le code)          | Automatique (le compilateur optimise)             |
| Bugs courants             | Buffer overflow, race condition, fuite mémoire      | Quasi impossibles par construction                |
| Courbe d'apprentissage    | Complexe (bas niveau, gestion de la mémoire)        | Différente (paradigme fonctionnel à apprendre)    |

---

## Étapes Pratiques

### Étape 1 : Comparer impératif vs fonctionnel sur un calcul simple

Le calcul suivant est une somme : additionner tous les nombres d'une liste. Compare les deux approches.

**Approche impérative** (avec boucle et variable modifiable) :

```text
FONCTION somme_imperative(liste) :
    total = 0                      -- Variable modifiable
    POUR chaque element DANS liste :
        total = total + element    -- On modifie total à chaque tour
    RETOURNER total

somme_imperative([10, 20, 30])
-- Tour 1 : total = 0 + 10 = 10
-- Tour 2 : total = 10 + 20 = 30
-- Tour 3 : total = 30 + 30 = 60
-- Résultat : 60
```

**Approche fonctionnelle** (avec récursion, sans modification) :

```text
FONCTION somme_fonctionnelle(liste) :
    SI liste EST VIDE :
        RETOURNER 0
    SINON :
        RETOURNER premier(liste) + somme_fonctionnelle(reste(liste))

somme_fonctionnelle([10, 20, 30])
-- somme([10, 20, 30]) = 10 + somme([20, 30])
-- somme([20, 30])     = 20 + somme([30])
-- somme([30])         = 30 + somme([])
-- somme([])           = 0               (cas de base)
-- Remontée : 30 + 0 = 30, 20 + 30 = 50, 10 + 50 = 60
-- Résultat : 60
```

**Résultat attendu** : les deux approches donnent 60, mais la version fonctionnelle ne modifie aucune variable.

---

### Étape 2 : Observer les fonctions pures

Vérifie si chaque fonction ci-dessous est pure ou impure. Justifie ta réponse.

```text
-- Fonction A
FONCTION carre(x) :
    RETOURNER x * x

-- Fonction B
compteur_global = 0
FONCTION incrementer() :
    compteur_global = compteur_global + 1
    RETOURNER compteur_global

-- Fonction C
FONCTION saluer(nom) :
    RETOURNER "Bonjour, " + nom

-- Fonction D
FONCTION heure_actuelle() :
    RETOURNER SYSTEME.heure()
```

**Résultat attendu** :

```text
Fonction A (carre)          : PURE - même entrée = même sortie, pas d'effet de bord
Fonction B (incrementer)    : IMPURE - modifie compteur_global (effet de bord)
                              et retourne un résultat différent à chaque appel
Fonction C (saluer)         : PURE - même entrée = même sortie, pas d'effet de bord
Fonction D (heure_actuelle) : IMPURE - retourne un résultat différent à chaque appel
                              (dépend de l'état du système)
```

---

### Étape 3 : Pratiquer la composition de fonctions

Construis un pipeline de transformations en composant des fonctions simples.

```text
-- Fonctions de base
FONCTION doubler(x) :
    RETOURNER x * 2

FONCTION ajouter_10(x) :
    RETOURNER x + 10

FONCTION est_superieur_a_20(x) :
    RETOURNER x > 20

-- Composition : doubler puis ajouter 10
traitement = ajouter_10(doubler(x))

-- Appliquer à la valeur 8
-- Étape 1 : doubler(8) = 16
-- Étape 2 : ajouter_10(16) = 26
-- Résultat : 26

-- Utiliser le résultat dans un test
est_superieur_a_20(ajouter_10(doubler(8)))
-- est_superieur_a_20(26) = VRAI
```

**Résultat attendu** : le pipeline produit 26, et le test retourne VRAI.

---

### Étape 4 : Utiliser les fonctions d'ordre supérieur

Applique `map`, `filter` et `reduce` sur une liste de nombres.

```text
donnees = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

-- MAP : doubler chaque élément
map(doubler, donnees)
-- Résultat : [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

-- FILTER : garder uniquement les nombres pairs
FONCTION est_pair(x) :
    RETOURNER x MODULO 2 == 0

filter(est_pair, donnees)
-- Résultat : [2, 4, 6, 8, 10]

-- REDUCE : calculer le produit de tous les éléments
FONCTION multiplier(a, b) :
    RETOURNER a * b

reduce(multiplier, [1, 2, 3, 4, 5], 1)
-- Étape 1 : 1 * 1 = 1
-- Étape 2 : 1 * 2 = 2
-- Étape 3 : 2 * 3 = 6
-- Étape 4 : 6 * 4 = 24
-- Étape 5 : 24 * 5 = 120
-- Résultat : 120

-- Chaîner les HOF (composition) :
-- Prendre les pairs, les doubler, puis les additionner
reduce(addition, map(doubler, filter(est_pair, donnees)), 0)
-- filter : [2, 4, 6, 8, 10]
-- map    : [4, 8, 12, 16, 20]
-- reduce : 4 + 8 + 12 + 16 + 20 = 60
-- Résultat : 60
```

**Résultat attendu** : la chaîne complète produit 60.

---

### Étape 5 : Écrire une fonction récursive

Écris une fonction qui calcule la puissance d'un nombre (x^n) de façon récursive.

```text
FONCTION puissance(x, n) :
    SI n == 0 :                    -- Cas de base : x^0 = 1
        RETOURNER 1
    SINON :                        -- Cas récursif : x^n = x * x^(n-1)
        RETOURNER x * puissance(x, n - 1)

puissance(2, 5)
-- puissance(2, 5) = 2 * puissance(2, 4)
-- puissance(2, 4) = 2 * puissance(2, 3)
-- puissance(2, 3) = 2 * puissance(2, 2)
-- puissance(2, 2) = 2 * puissance(2, 1)
-- puissance(2, 1) = 2 * puissance(2, 0)
-- puissance(2, 0) = 1              (cas de base)
-- Remontée : 2*1=2, 2*2=4, 2*4=8, 2*8=16, 2*16=32
-- Résultat : 32
```

**Résultat attendu** : `puissance(2, 5)` retourne 32.

---

### Étape 6 : Observer l'immutabilité en action

Compare un traitement mutable et immutable sur une structure de données.

```text
-- Style MUTABLE
utilisateur = { nom: "Alice", age: 25 }
utilisateur.age = 26              -- On modifie l'objet original
-- utilisateur vaut { nom: "Alice", age: 26 }
-- La version avec age=25 est perdue

-- Style IMMUTABLE
utilisateur_v1 = { nom: "Alice", age: 25 }
utilisateur_v2 = copier(utilisateur_v1, { age: 26 })
-- utilisateur_v1 vaut toujours { nom: "Alice", age: 25 }
-- utilisateur_v2 vaut { nom: "Alice", age: 26 }
-- Les deux versions coexistent
```

**Résultat attendu** : dans le style immutable, les deux versions de l'utilisateur existent simultanément.

---

### Étape 7 : Observer la curryfication

Transforme une fonction à deux arguments en version curryfiée, puis utilise l'application partielle.

```text
-- Fonction classique
FONCTION ajouter(a, b) :
    RETOURNER a + b

ajouter(3, 5)            -- Résultat : 8

-- Version curryfiée
FONCTION ajouter_curry(a) :
    RETOURNER FONCTION(b) :
        RETOURNER a + b

ajouter_curry(3)(5)      -- Résultat : 8

-- Application partielle : on fixe a = 10
ajouter_10 = ajouter_curry(10)
ajouter_10(5)            -- Résultat : 15
ajouter_10(20)           -- Résultat : 30

-- Utilisation avec map
map(ajouter_10, [1, 2, 3])
-- Résultat : [11, 12, 13]
```

**Résultat attendu** : `ajouter_10` est une fonction spécialisée créée par application partielle. Combinée avec `map`, elle ajoute 10 à chaque élément de la liste.

---

### Étape 8 : Identifier les concepts fonctionnels dans un programme Faust

Lis le programme Faust suivant et identifie chaque concept fonctionnel utilisé.

```faust
import("stdfaust.lib");

// Un simple processeur audio : gain ajustable + filtre passe-bas
gain = hslider("Gain", 0.5, 0, 1, 0.01);
freq = hslider("Frequency", 1000, 100, 10000, 1);

process = *(gain) : fi.lowpass(2, freq);
```

**Résultat attendu** :

```text
Concept identifié           | Où dans le code
----------------------------|------------------------------------------
Fonction pure               | *(gain) est une fonction pure : entrée * gain = sortie
Fonction pure               | fi.lowpass(2, freq) est une fonction pure
Composition                 | L'opérateur ":" compose les deux fonctions
Application partielle       | fi.lowpass(2, freq) fixe l'ordre et la fréquence
Immutabilité                | Le signal d'entrée n'est pas modifié,
                            | chaque étape crée un nouveau signal
Arrow (séquentiel)          | ":" est l'opérateur de composition séquentielle
```

---

## Commandes Utiles

| Concept | Notation mathématique | Équivalent Faust |
| ------- | --------------------- | ---------------- |
| Composition `f(g(x))` | `f . g` | `g : f` |
| Application partielle | `f(a, _)` | `f(a)` |
| Composition séquentielle | `>>>` | `:` |
| Composition parallèle | `***` | `,` |
| Boucle de rétroaction | `loop` | `~` |
| Fanout (split) | `&&&` | `<:` |
| Fusion (merge) | - | `:>` |

---

## Pièges Fréquents

### Piège 1 : Confondre récursion infinie et récursion correcte

**Problème** : oublier le cas de base provoque un appel infini qui fait planter le programme.

**Solution** : toujours écrire le cas de base **en premier**, avant le cas récursif.

```text
-- INCORRECT : pas de cas de base
FONCTION compter(n) :
    RETOURNER n + compter(n - 1)    -- Ne s'arrête jamais

-- CORRECT : cas de base en premier
FONCTION compter(n) :
    SI n == 0 :                      -- Cas de base
        RETOURNER 0
    RETOURNER n + compter(n - 1)    -- Cas récursif
```

---

### Piège 2 : Croire que "fonctionnel" signifie "sans variable"

**Problème** : penser que la programmation fonctionnelle interdit d'utiliser des noms pour stocker des valeurs.

**Solution** : en fonctionnel, on peut nommer des valeurs. La règle est que ces valeurs sont **immutables** (on ne les modifie pas après les avoir définies). Ce ne sont pas des "variables" au sens impératif, mais des **constantes nommées**.

```text
-- C'est parfaitement fonctionnel :
x = 42                     -- x est une constante, jamais modifiée ensuite
resultat = doubler(x)      -- resultat est une constante aussi

-- Ce qui est interdit en fonctionnel :
x = 42
x = x + 1                 -- INTERDIT : on modifie x
```

---

### Piège 3 : Confondre curryfication et application partielle

**Problème** : utiliser les deux termes de façon interchangeable.

**Solution** : ce sont deux concepts liés mais distincts.

- **Curryfication** : transformer la structure d'une fonction. `f(a, b)` devient `f(a)(b)`. C'est une transformation automatique.
- **Application partielle** : fournir seulement certains arguments. `ajouter_10 = ajouter(10)`. C'est une utilisation concrète.

La curryfication **rend possible** l'application partielle, mais ce n'est pas la même chose.

---

### Piège 4 : Penser que l'ordre de composition en Faust est le même qu'en mathématiques

**Problème** : en mathématiques, `(f . g)(x)` signifie `f(g(x))`, donc `g` s'exécute en premier. En Faust, `g : f` signifie aussi `g` en premier puis `f`, mais l'ordre de lecture visuelle est inversé par rapport à la notation `f(g(x))`.

**Solution** : en Faust, lis de gauche à droite. Le signal entre à gauche et sort à droite :

```text
-- Mathématiques : f(g(x))   → g s'exécute d'abord, puis f
-- Faust :         g : f     → g s'exécute d'abord, puis f
-- L'ordre d'exécution est le même, mais en Faust on lit de gauche à droite
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre paradigme impératif et paradigme fonctionnel
- [ ] Je sais expliquer ce qu'est une fonction pure et donner un exemple
- [ ] Je sais composer des fonctions pour créer un pipeline de transformations
- [ ] Je sais utiliser `map`, `filter` et `reduce` (les trois HOF fondamentales)
- [ ] Je sais écrire une fonction récursive avec un cas de base et un cas récursif
- [ ] Je comprends pourquoi l'immutabilité évite les bugs liés à l'état partagé
- [ ] Je sais transformer une fonction à 2 arguments en version curryfiée
- [ ] Je comprends le lien entre les Arrows et les opérateurs de composition de Faust
- [ ] Je peux identifier les concepts fonctionnels dans un programme Faust simple

---

## Exercice Pratique

**Énoncé** : Cet exercice comporte deux parties.

**Partie 1** : Réécrire un algorithme impératif en style fonctionnel.

Voici un algorithme impératif qui calcule la somme des carrés des nombres pairs d'une liste :

```text
FONCTION somme_carres_pairs_imperatif(liste) :
    resultat = 0
    POUR chaque element DANS liste :
        SI element MODULO 2 == 0 :
            resultat = resultat + (element * element)
    RETOURNER resultat

somme_carres_pairs_imperatif([1, 2, 3, 4, 5, 6])
-- Résultat attendu : 4 + 16 + 36 = 56
```

Réécris cette fonction en style fonctionnel en utilisant :

- `filter` pour garder les nombres pairs
- `map` pour calculer le carré de chaque nombre
- `reduce` pour additionner les résultats
- Aucune variable modifiable

**Partie 2** : Identifier les concepts fonctionnels dans un programme Faust.

Voici un programme Faust. Pour chaque ligne, identifie le ou les concepts fonctionnels utilisés (fonction pure, composition, application partielle, immutabilité, récursion/feedback, HOF) :

```faust
import("stdfaust.lib");

vol = hslider("Volume", 0.5, 0, 1, 0.01);
freq = hslider("Freq", 440, 20, 20000, 1);

oscillateur = os.osc(freq);
traitement = *(vol) : fi.lowpass(2, 2000);

process = oscillateur : traitement;
```

**Indications** :

- Pour la partie 1, commence par identifier les trois opérations (filtrer, transformer, combiner) puis utilise les HOF correspondantes
- Pour la partie 2, rappelle-toi que chaque opérateur Faust (`:`, `,`, `~`, `<:`, `:>`) correspond à un concept fonctionnel
- `os.osc(freq)` est un exemple d'application partielle (on fixe la fréquence)

**Résultat attendu** :

- Partie 1 : la version fonctionnelle produit 56, sans aucune variable modifiable
- Partie 2 : un tableau associant chaque ligne du code Faust aux concepts fonctionnels utilisés

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Solution Partie 1

```text
-- Fonctions de base (fonctions pures)
FONCTION est_pair(x) :
    RETOURNER x MODULO 2 == 0

FONCTION carre(x) :
    RETOURNER x * x

FONCTION addition(a, b) :
    RETOURNER a + b

-- Version fonctionnelle : composition de HOF
FONCTION somme_carres_pairs(liste) :
    RETOURNER reduce(addition, map(carre, filter(est_pair, liste)), 0)

somme_carres_pairs([1, 2, 3, 4, 5, 6])

-- Déroulement étape par étape :
-- 1. filter(est_pair, [1, 2, 3, 4, 5, 6])
--    → [2, 4, 6]
--
-- 2. map(carre, [2, 4, 6])
--    → [4, 16, 36]
--
-- 3. reduce(addition, [4, 16, 36], 0)
--    → 0 + 4 = 4
--    → 4 + 16 = 20
--    → 20 + 36 = 56
--
-- Résultat : 56

-- Version alternative avec un opérateur de composition (>>) :
somme_carres_pairs = filter(est_pair) >> map(carre) >> reduce(addition, 0)
-- Se lit : filtrer les pairs, puis calculer les carrés, puis additionner
```

**Concepts utilisés dans cette solution** :

| Concept | Où dans le code |
| ------- | --------------- |
| Fonctions pures | `est_pair`, `carre`, `addition` |
| HOF | `filter`, `map`, `reduce` prennent des fonctions en argument |
| Composition | Les trois HOF sont chaînées : la sortie de l'une est l'entrée de la suivante |
| Immutabilité | Aucune variable n'est modifiée. La liste originale reste intacte |
| Application partielle | `filter(est_pair)` fixe le prédicat, retournant une fonction qui attend une liste |

---

### Solution Partie 2

```text
Ligne de code                          | Concepts fonctionnels
---------------------------------------|-----------------------------------------------
vol = hslider("Volume", 0.5, 0, 1,    | Constante nommée (immutabilité) :
  0.01)                                | vol est défini une fois et jamais modifié
                                       |
freq = hslider("Freq", 440, 20,       | Constante nommée (immutabilité) :
  20000, 1)                            | freq est défini une fois et jamais modifié
                                       |
oscillateur = os.osc(freq)             | Application partielle : os.osc est une
                                       | fonction qui attend une fréquence. On fixe
                                       | freq pour obtenir un processeur prêt.
                                       | Fonction pure : même fréquence = même signal
                                       |
traitement = *(vol) :                  | Composition (opérateur ":") : la sortie du
  fi.lowpass(2, 2000)                  | gain entre dans le filtre.
                                       | Application partielle : fi.lowpass(2, 2000)
                                       | fixe l'ordre et la fréquence de coupure.
                                       | Fonctions pures : *(vol) et fi.lowpass
                                       |
process = oscillateur : traitement     | Composition (opérateur ":") : la sortie de
                                       | l'oscillateur entre dans le traitement.
                                       | Arrow séquentielle : ":" est l'opérateur >>>
                                       | Immutabilité : chaque étape crée un nouveau
                                       | signal sans modifier les précédents
```

---

## Navigation

→ Fiche suivante : **[02 - C++ : notions essentielles](02-cpp-notions-essentielles.md)**
