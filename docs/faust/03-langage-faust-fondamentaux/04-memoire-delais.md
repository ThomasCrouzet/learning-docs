---
tags:
  - Faust
  - Intermédiaire
  - Concept
description: "Mémoire et délais en Faust - opérateur prime, délais, feedback, tables de lecture/écriture et buffers circulaires"
estimated_time: "80 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 3 - Langage Faust fondamentaux"
id: "specializations.faust.language.memoire-delais"
course_id: "specializations.faust"
module_id: "specializations.faust.language"
content_type: "lesson"
order: 4
---

# 04 - Mémoire et délais

> **En bref** : À la fin de cette fiche, tu sauras utiliser les mécanismes de mémoire et de délai en Faust pour créer des filtres récursifs, des delay lines et des tables de données. Lecture estimée : 80 min.


## Prérequis

- Avoir lu la fiche **[02 - Les cinq opérateurs de composition](02-cinq-operateurs-composition.md)**
- Comprendre les cinq opérateurs de composition (`:`, `,`, `<:`, `:>`, `~`)
- Savoir ce qu'est un signal en Faust (une fonction du temps discret)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les mécanismes de mémoire et de délai en Faust pour créer des filtres récursifs, des delay lines et des tables de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la mémoire dans le contexte du traitement du signal ?

**Définition** : La mémoire dans le traitement du signal désigne la capacité d'un système à accéder à des valeurs passées d'un signal. Un système "avec mémoire" utilise non seulement la valeur actuelle d'un signal, mais aussi ses valeurs précédentes pour calculer sa sortie.

**Le problème que la mémoire résout** :

Sans mémoire, voici les problèmes rencontrés :

1. **Pas de filtrage possible** : Un filtre passe-bas a besoin de comparer la valeur actuelle avec les valeurs précédentes. Sans mémoire, chaque échantillon est traité de manière isolée.
2. **Pas d'effets temporels** : Un écho ou un chorus nécessitent de stocker le signal puis de le rejouer. Sans mémoire, impossible de créer ces effets.
3. **Pas de récursion** : Un oscillateur ou un accumulateur a besoin de réinjecter sa propre sortie dans son entrée. Sans mémoire, pas de boucle de rétroaction.

**Comment la mémoire résout ces problèmes** :

| Problème | Solution apportée par la mémoire |
| -------- | -------------------------------- |
| Pas de filtrage | Accéder aux échantillons passés permet de calculer des moyennes et des résonances |
| Pas d'effets temporels | Stocker des échantillons dans un buffer permet de les rejouer plus tard |
| Pas de récursion | Réinjecter la sortie précédente en entrée permet de créer des oscillateurs |

**Analogie concrète** : Imagine un carnet de notes. Si tu ne peux lire que la page actuelle, tu ne peux pas comparer avec ce que tu as écrit hier. Avec un carnet (la mémoire), tu peux feuilleter les pages précédentes pour calculer une moyenne, ou recopier une information ancienne sur la page du jour.

**Ce que la mémoire n'est PAS** :

- La mémoire n'est pas un stockage permanent sur disque. En Faust, la mémoire est la RAM utilisée pendant l'exécution. Quand le programme s'arrête, les valeurs disparaissent.
- La mémoire n'est pas illimitée. Un delay de 10 secondes à 44100 Hz consomme 441 000 échantillons en mémoire.

---

### Qu'est-ce que l'opérateur `'` (prime) ?

**Définition** : L'opérateur `'` (apostrophe, prononcé "prime") accède à la valeur précédente d'un signal. Si `x` est la valeur du signal au temps $t$, alors `x'` est la valeur de ce signal au temps $t-1$ (un échantillon plus tôt).

**Notation mathématique** : `'` correspond à $z^{-1}$ en transformée en Z, la notation standard en traitement du signal pour "décaler d'un échantillon dans le passé".

**Le problème que `'` résout** :

Sans l'opérateur `'`, voici les problèmes rencontrés :

1. **Impossible de comparer avec le passé** : Détecter un changement de niveau sonore nécessite la valeur actuelle ET la valeur précédente.
2. **Impossible de créer des filtres simples** : Le filtre le plus basique (moyenneur sur 2 échantillons) nécessite l'échantillon actuel et le précédent.

**Comment `'` résout ces problèmes** :

| Problème | Solution apportée par `'` |
| -------- | ------------------------- |
| Impossible de comparer avec le passé | `x'` donne immédiatement la valeur précédente de `x` |
| Impossible de créer des filtres simples | `(x + x') / 2` crée un filtre moyenneur en une ligne |

**Analogie concrète** : Un thermomètre à mémoire. Le thermomètre affiche la température actuelle (25 C). Le bouton "rappel" affiche la température précédente (23 C). L'opérateur `'` est ce bouton "rappel" : il te donne la valeur d'il y a un instant.

**Ce que `'` n'est PAS** :

- `'` n'est pas un délai variable. Il donne toujours exactement la valeur d'il y a 1 échantillon. Pour des délais plus longs, on utilise `@`.
- `'` n'est pas une dérivée mathématique. Même si la notation ressemble au symbole de dérivée (`f'`), ici `'` est un opérateur de délai.

**Chaînage de `'`** :

| Expression | Signification | Notation Z |
| ---------- | ------------- | ---------- |
| `x'` | Valeur il y a 1 échantillon | $z^{-1}$ |
| `x''` | Valeur il y a 2 échantillons | $z^{-2}$ |
| `x'''` | Valeur il y a 3 échantillons | $z^{-3}$ |

**Exemple de fonctionnement dans le temps** :

```text
Temps (échantillon) :  0    1    2    3    4    5
x                   :  0.0  0.5  1.0  0.8  0.3  0.0
x'                  :  0.0  0.0  0.5  1.0  0.8  0.3
x''                 :  0.0  0.0  0.0  0.5  1.0  0.8
```

Au temps 0, il n'y a pas de valeur précédente. Faust initialise `x'` à 0.0 par défaut.

---

### Qu'est-ce que `mem` ?

**Définition** : `mem` est un opérateur Faust qui retarde un signal d'exactement un échantillon. Il est strictement équivalent à `_'` (identité suivie de prime). C'est une forme explicite du délai unitaire.

| Situation | Utiliser |
| --------- | -------- |
| Accéder à la valeur précédente d'une expression nommée | `x'` |
| Insérer un délai unitaire dans une chaîne de composition | `mem` |
| Rendre le code plus lisible dans un diagramme de flux | `mem` |

```faust
// Ces deux lignes sont équivalentes
process = _ : mem;       // Utilise mem
process = _';            // Utilise prime sur l'identité
```

---

### Qu'est-ce que l'opérateur `@` (délai variable) ?

**Définition** : L'opérateur `@` (prononcé "at") retarde un signal d'un nombre donné d'échantillons. La syntaxe est `signal @ n`, où `n` est le nombre d'échantillons de retard. Contrairement à `'` qui donne toujours un délai de 1, `@` permet des délais de longueur arbitraire.

**Le problème que `@` résout** :

Sans l'opérateur `@`, voici les problèmes rencontrés :

1. **Délais longs impossibles avec `'`** : Pour un écho de 0.5 seconde à 44100 Hz, il faudrait écrire 22050 apostrophes. C'est impossible en pratique.
2. **Délais fixes uniquement** : Sans `@`, la durée du délai est codée en dur. Impossible de la modifier en temps réel avec un slider.
3. **Pas d'effets de modulation** : Un chorus ou un flanger nécessite un délai dont la durée varie dans le temps.

**Comment `@` résout ces problèmes** :

| Problème | Solution apportée par `@` |
| -------- | ------------------------- |
| Délais longs impossibles | `x @ 22050` retarde de 22050 échantillons en une expression |
| Délais fixes uniquement | `n` peut être un signal : `x @ hslider("delay", ...)` |
| Pas de modulation | `n` peut varier dans le temps pour un chorus ou un flanger |

**Analogie concrète** : Un tapis roulant dans un aéroport. Tu poses ta valise sur le tapis (le signal d'entrée). La valise met un certain temps à arriver à l'autre bout (le signal de sortie). La longueur du tapis détermine le délai. Avec `@`, tu choisis la longueur du tapis.

**Ce que `@` n'est PAS** :

- `@` n'est pas un opérateur de composition comme `:` ou `,`. C'est un opérateur binaire qui prend un signal et un nombre d'échantillons.
- `@` n'est pas gratuit en mémoire. Un délai de 5 secondes à 44100 Hz consomme 220 500 valeurs flottantes.

**Conversion temps/échantillons** : $n_{échantillons} = durée_{secondes} \times f_{échantillonnage}$

| Durée | À 44100 Hz | À 48000 Hz |
| ----- | ---------- | ---------- |
| 10 ms | 441 | 480 |
| 100 ms | 4 410 | 4 800 |
| 0.5 s | 22 050 | 24 000 |
| 1 s | 44 100 | 48 000 |

En Faust, la fréquence d'échantillonnage est accessible via `ma.SR` (après `import("stdfaust.lib");`).

```faust
import("stdfaust.lib");
// Délai de 0.5 seconde, quelle que soit la fréquence d'échantillonnage
process = _ @ int(0.5 * ma.SR);
```

**Contrainte importante** : Le compilateur Faust doit connaître la taille maximale du délai à la compilation. Quand `n` est un signal variable (un slider), Faust utilise la valeur maximale du slider pour allouer le buffer.

---

### Qu'est-ce que l'opérateur `~` (feedback) ?

**Définition** : L'opérateur `~` (tilde, prononcé "feedback" ou "récursion") crée une boucle de rétroaction. Il prend la sortie d'un circuit et la réinjecte en entrée avec un délai implicite d'un échantillon.

**Le problème que `~` résout** :

Sans l'opérateur `~`, voici les problèmes rencontrés :

1. **Pas de récursion possible** : Un filtre IIR réinjecte sa propre sortie dans son calcul. Sans boucle de rétroaction, impossible de créer ce type de filtre.
2. **Pas de compteur** : Compter les échantillons écoulés nécessite d'additionner 1 à chaque pas de temps et mémoriser le total.
3. **Pas d'oscillateur récursif** : Un oscillateur par récurrence (chaque échantillon dépend du précédent) nécessite `~`.

**Comment `~` résout ces problèmes** :

| Problème | Solution apportée par `~` |
| -------- | ------------------------- |
| Pas de récursion possible | `~` crée une boucle où la sortie est réinjectée en entrée |
| Pas de compteur | `+(1) ~ _` crée un compteur qui s'incrémente à chaque échantillon |
| Pas d'oscillateur récursif | `~` permet de construire des oscillateurs par récurrence |

**Analogie concrète** : Un micro placé devant un haut-parleur. Le son sort du haut-parleur, entre dans le micro, est amplifié, ressort du haut-parleur, entre à nouveau dans le micro... C'est une boucle de feedback (larsen). En Faust, `~` crée cette boucle de manière contrôlée, avec un délai d'un échantillon pour éviter les paradoxes de causalité.

**Ce que `~` n'est PAS** :

- `~` n'est pas un simple câble de retour. Il inclut un délai implicite d'un échantillon (obligatoire pour que le calcul soit possible).
- `~` n'est pas l'opérateur séquentiel `:`. L'opérateur `:` connecte sans boucle. L'opérateur `~` crée une boucle qui revient en arrière.

**Comparaison `:` (séquentiel) vs `~` (feedback)** :

| `:` séquentiel | `~` feedback |
| -------------- | ------------ |
| Signal va de gauche à droite | Signal revient en boucle |
| Pas de délai implicite | Délai implicite d'1 échantillon |
| Pas de mémoire | Crée de la mémoire |
| `A : B` = sortie de A entre dans B | `A ~ B` = sortie de A passe dans B puis revient en entrée de A |

**Fonctionnement de `~`** avec l'expression `process = + ~ _;` :

```text
              ┌─────────────────────────┐
              │                         │
              v                         │
entrée ──>  [+]  ──> sortie            │
              ^                         │
              │                         │
              └──── [z^-1] ─────────────┘
                   (délai 1 éch.)
```

**Exemple dans le temps** (entrée constante de 1.0) :

```text
Temps :          0     1     2     3     4     5
Entrée :         1.0   1.0   1.0   1.0   1.0   1.0
Feedback (t-1) : 0.0   1.0   2.0   3.0   4.0   5.0
Sortie :         1.0   2.0   3.0   4.0   5.0   6.0
```

Le résultat est un accumulateur (intégrateur).

---

### Qu'est-ce que `rdtable` ?

**Définition** : `rdtable(n, init, index)` crée une table de lecture seule. La table est remplie une seule fois au démarrage avec le signal `init`, puis consultée via l'index de lecture.

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `n` | Entier constant | Taille de la table |
| `init` | Signal | Signal d'initialisation (les `n` premiers échantillons sont stockés) |
| `index` | Signal | Position de lecture (de 0 à n-1) |

**Le problème que `rdtable` résout** :

1. **Calcul en temps réel coûteux** : Calculer un sinus à chaque échantillon demande du CPU. Pré-calculer les valeurs dans une table est plus rapide.
2. **Pas de wavetable** : La synthèse par table d'ondes repose sur la lecture cyclique d'une forme d'onde pré-calculée.

**Analogie concrète** : Un dictionnaire papier. Tu ne recalcules pas la définition d'un mot à chaque fois que tu le cherches. Le dictionnaire est écrit une fois pour toutes (c'est `init`). Pour trouver un mot, tu vas à la bonne page (c'est l'`index`).

**Ce que `rdtable` n'est PAS** :

- `rdtable` n'est pas modifiable après le démarrage. Pour une table modifiable en temps réel, on utilise `rwtable`.
- `rdtable` n'est pas un tableau dynamique. Sa taille `n` est fixée à la compilation.

---

### Qu'est-ce que `rwtable` ?

**Définition** : `rwtable(n, init, windex, wsignal, rindex)` crée une table de lecture/écriture. Contrairement à `rdtable`, cette table peut être modifiée en permanence pendant l'exécution.

| Paramètre | Type | Description |
| --------- | ---- | ----------- |
| `n` | Entier constant | Taille de la table |
| `init` | Signal | Valeur initiale de toutes les cases |
| `windex` | Signal | Index d'écriture |
| `wsignal` | Signal | Signal à écrire |
| `rindex` | Signal | Index de lecture |

**Le problème que `rwtable` résout** :

1. **Pas de buffer audio** : Stocker un signal pour le relire plus tard (delay line) nécessite un espace accessible en écriture ET en lecture.
2. **Pas de delay line explicite** : Certaines implémentations avancées (delay avec interpolation, multi-tap delay) nécessitent un contrôle fin sur le buffer.

**Analogie concrète** : Un tableau blanc divisé en cases numérotées. Un stylo écrit une valeur dans une case. Un lecteur lit une valeur dans une autre case. Le stylo et le lecteur avancent indépendamment. Quand le stylo arrive à la dernière case, il revient à la première et écrase l'ancienne valeur.

**Ce que `rwtable` n'est PAS** :

- `rwtable` n'est pas un fichier. Les données existent uniquement en RAM pendant l'exécution.
- `rwtable` n'est pas redimensionnable. La taille `n` est fixée à la compilation.

**Comparaison `rdtable` vs `rwtable`** :

| `rdtable` | `rwtable` |
| --------- | --------- |
| Lecture seule | Lecture et écriture |
| Remplie une fois au démarrage | Modifiable en permanence |
| 3 paramètres | 5 paramètres |
| Wavetables, LUT | Delay lines, loopers |

---

### Qu'est-ce qu'un buffer circulaire ?

**Définition** : Un buffer circulaire est une structure de données où un index d'écriture parcourt un tableau de taille fixe, et revient au début quand il atteint la fin. Les anciennes valeurs sont progressivement écrasées. C'est la technique fondamentale pour implémenter une delay line.

**Le problème que les buffers circulaires résolvent** :

1. **Mémoire infinie nécessaire** : Sans recyclage, stocker chaque échantillon nécessiterait un espace qui grandit indéfiniment.
2. **Déplacement de données coûteux** : Décaler tous les éléments d'une case à chaque échantillon serait trop lent.

| Problème | Solution apportée par le buffer circulaire |
| -------- | ------------------------------------------ |
| Mémoire infinie | La taille est fixe, les anciennes valeurs sont écrasées |
| Déplacement coûteux | Seul l'index avance, aucun déplacement de données |

**Analogie concrète** : Une horloge. Les aiguilles tournent de 1 à 12, puis reviennent à 1. L'aiguille (l'index d'écriture) avance toujours dans le même sens et revient au début après un tour complet. Le cadran (le buffer) a une taille fixe.

**Ce qu'un buffer circulaire n'est PAS** :

- Un buffer circulaire n'est pas une file d'attente. Dans une file, les éléments retirés libèrent de la place. Dans un buffer circulaire, les anciennes valeurs sont écrasées.

**Schéma** :

```text
Taille : 8 cases, instant t = 10, délai = 5
windex = 10 % 8 = 2       rindex = (10 - 5) % 8 = 5

    ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
    │  8  │  9  │ >10<│  3  │  4  │ [5] │  6  │  7  │
    └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
      [0]   [1]   [2]   [3]   [4]   [5]   [6]   [7]

    >10< = écriture    [5] = lecture (5 échantillons plus tôt)
```

---

### Combinaison de `~` et `@` : feedback avec délais longs

**Définition** : L'opérateur `~` crée un feedback avec un délai d'un seul échantillon. En combinant `~` avec `@`, on crée des boucles de rétroaction avec des délais plus longs. C'est la technique utilisée pour les échos et les réverbérations.

| Problème | Solution |
| -------- | -------- |
| Écho trop court (1 échantillon = 0.02 ms) | `+ ~ (@(delai) : *(gain))` crée un écho audible |
| Réverbération impossible | Plusieurs boucles `~` avec des délais `@` différents |

```text
                   ┌──────────────────────────────────┐
                   │                                  │
                   v                                  │
entrée ──>  [+]  ──>  sortie                         │
                   ^                                  │
                   │                                  │
                   └── [× gain] ◄── [@(délai)] ◄──────┘
```

---

## Étapes Pratiques

### Étape 1 : Utiliser `'` pour créer un filtre moyenneur

Crée un fichier `moyenneur.dsp` :

```faust
// Filtre moyenneur sur 2 échantillons
// Moyenne entre la valeur actuelle et la valeur précédente
process = _ <: (_, _') :> /(2);
```

- `<:` duplique le signal en 2 copies
- `(_, _')` : le signal actuel et sa valeur précédente en parallèle
- `:>` additionne les deux, `/(2)` divise par 2

**Résultat attendu** :

```text
Entrée :  [1.0, 0.0, 1.0, 0.0, 1.0, 0.0]
Sortie :  [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
```

Écriture alternative avec `mem` :

```faust
// + additionne le signal actuel et le précédent, puis on divise par 2
process = +(mem) : /(2);
```

```bash
# Génère le diagramme SVG du filtre
faust -svg moyenneur.dsp
```

---

### Étape 2 : Créer un écho simple avec `@`

Crée un fichier `echo-simple.dsp` :

```faust
import("stdfaust.lib");

delai = int(0.5 * ma.SR);  // 0.5 s → 22050 échantillons à 44100 Hz
gain_echo = 0.5;             // Signal retardé à 50% du volume

// Signal retardé et atténué
signal_retarde = (_ @ delai) * gain_echo;

// Mix : signal original + signal retardé
process = _ <: (_, signal_retarde) :> _;
```

```text
                            ┌──── [identité] ────────┐
entrée ──> [split <:]  ────┤                         ├──> [merge :>] ──> sortie
                            └──── [@22050] ──[×0.5]──┘
```

```bash
faust2jack echo-simple.dsp
```

**Résultat attendu** :

```text
Le signal original + une copie retardée de 0.5 s à 50% du volume.
Un écho unique (une seule répétition).
```

---

### Étape 3 : Créer un accumulateur avec `~`

Crée un fichier `accumulateur.dsp` :

```faust
// Compteur : additionne 1 à chaque échantillon
// t=0 : 0+1=1, t=1 : 1+1=2, t=2 : 2+1=3, ...
compteur = +(1) ~ _;
process = compteur;
```

**Résultat attendu** :

```text
Sortie : 1, 2, 3, 4, 5, 6, 7, 8, ...
À 44100 Hz, après 1 seconde le compteur vaut 44100.
```

Variante avec modulo (compteur cyclique) :

```faust
import("stdfaust.lib");

// Compte de 0 à N-1 puis revient à 0
N = int(ma.SR);  // Cycle d'une seconde
compteur_cyclique = (+(1) : %(N)) ~ _;
process = compteur_cyclique;
```

**Résultat attendu** :

```text
Sortie : 1, 2, 3, ..., 44099, 0, 1, 2, 3, ...
```

---

### Étape 4 : Créer une wavetable sinusoïdale avec `rdtable`

Crée un fichier `wavetable-sinus.dsp` :

```faust
import("stdfaust.lib");

tablesize = 1024;  // 1024 échantillons pour une période de sinus
freq = hslider("Fréquence [unit:Hz]", 440, 20, 2000, 1);

// Table : sin(2π × i / tablesize) pour chaque index i
sinus_init = sin(2 * ma.PI * ba.time / tablesize);

// Phaseur : index qui parcourt la table à la vitesse de freq
// increment = freq × tablesize / SR ≈ 10.22 à 440 Hz
phaseur = freq * tablesize / ma.SR : (+ : %(tablesize)) ~ _ : int;

// Lecture cyclique de la table
process = rdtable(tablesize, sinus_init, phaseur);
```

```bash
faust2jack wavetable-sinus.dsp
./wavetable-sinus
```

**Résultat attendu** :

```text
Un son sinusoïdal pur à 440 Hz (la note La).
Le slider "Fréquence" permet de changer la hauteur en temps réel.
```

---

### Étape 5 : Implémenter un buffer circulaire avec `rwtable`

Crée un fichier `delay-rwtable.dsp` :

```faust
import("stdfaust.lib");

bufsize = 131072;  // 2^17 ≈ 2.97 secondes à 44100 Hz
delai_sec = hslider("Délai [unit:s]", 0.3, 0.01, 2.0, 0.01);
delai_ech = int(delai_sec * ma.SR);

// Index d'écriture : compteur cyclique 0 → bufsize-1
windex = (+(1) : %(bufsize)) ~ _;

// Index de lecture : écriture moins délai (avec modulo pour rester dans les bornes)
rindex = (windex - delai_ech + bufsize) : %(bufsize);

// rwtable(taille, init, index_écriture, signal_à_écrire, index_lecture)
delay_line = rwtable(bufsize, 0.0, windex, _, rindex);

// Mix : 50% original + 50% retardé
process = _ <: (_, delay_line) :> /(2);
```

```bash
faust2jack delay-rwtable.dsp
./delay-rwtable
```

**Résultat attendu** :

```text
Le signal d'entrée est mélangé avec une copie retardée.
Le slider "Délai" change la durée du retard en temps réel.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust -svg fichier.dsp` | Génère le diagramme de signal en SVG |
| `faust2jack fichier.dsp` | Compile en application JACK (temps réel) |
| `faust2sndfile fichier.dsp` | Compile pour traiter des fichiers audio |
| `faust -a minimal.cpp fichier.dsp -o fichier.cpp` | Génère le code C++ avec une architecture minimale |
| `faust2jaqt fichier.dsp` | Compile avec interface Qt et JACK |

---

## Pièges Fréquents

### Piège 1 : Feedback divergent (explosion du signal)

**Problème** : Quand on utilise `~` sans atténuation, le signal croît indéfiniment.

**Solution** : Toujours multiplier le feedback par un gain strictement inférieur à 1.

```faust
// ❌ DANGEREUX : le signal croît sans limite
process = + ~ _;

// ✅ CORRECT : le feedback est atténué de 50% à chaque tour
process = + ~ *(0.5);
```

---

### Piège 2 : Délai de 0 échantillon avec `@`

**Problème** : `signal @ 0` ne produit pas de délai. Contrairement à `~`, `@` n'ajoute pas de délai minimum.

**Solution** :

```faust
// ❌ Si delai vaut 0, aucun retard
process = _ @ delai;

// ✅ Le délai est au minimum de 1 échantillon
process = _ @ max(1, delai);
```

---

### Piège 3 : Index hors bornes dans les tables

**Problème** : Si l'index dépasse la taille de la table, le comportement est indéfini (crash possible).

**Solution** : Toujours appliquer un modulo ou borner l'index.

```faust
// ❌ L'index pourrait dépasser tablesize
process = rdtable(tablesize, init, index);

// ✅ Le modulo garantit que l'index reste dans [0, tablesize-1]
process = rdtable(tablesize, init, index % tablesize);
```

---

### Piège 4 : Oublier `int()` pour les index de table

**Problème** : Les index de `rdtable` et `rwtable` doivent être des entiers.

**Solution** :

```faust
// ❌ L'index est un flottant
index = freq * tablesize / ma.SR;

// ✅ Conversion explicite en entier
index = int(freq * tablesize / ma.SR);
```

---

### Piège 5 : Confusion entre `~` et `:`

**Problème** : Utiliser `:` au lieu de `~` ne crée pas de boucle de rétroaction.

**Solution** :

```faust
// ❌ Pas de feedback : le signal passe de + à * sans boucle
process = + : *(0.5);

// ✅ Feedback : la sortie de *(0.5) est réinjectée dans +
process = + ~ *(0.5);
```

---

## Checklist de Validation

- [ ] Je comprends que `x'` donne la valeur de `x` au temps $t-1$
- [ ] Je sais chaîner `'` pour accéder à des valeurs plus anciennes (`x''`, `x'''`)
- [ ] Je sais utiliser `@` pour créer un délai de `n` échantillons
- [ ] Je sais convertir une durée en secondes en nombre d'échantillons ($durée \times SR$)
- [ ] Je comprends le fonctionnement de `~` (boucle de feedback avec délai implicite d'1 échantillon)
- [ ] Je sais que le gain de feedback doit être $< 1$ pour éviter la divergence
- [ ] Je sais créer une table de lecture seule avec `rdtable`
- [ ] Je sais créer une table de lecture/écriture avec `rwtable`
- [ ] Je comprends le principe du buffer circulaire (index + modulo)
- [ ] Je sais combiner `~` et `@` pour créer un feedback avec un délai long

---

## Exercice Pratique

**Énoncé** : Implémenter un effet de delay avec feedback.

**Cahier des charges** :

1. Le signal d'entrée est mélangé avec une copie retardée de 0.3 seconde
2. Le signal retardé est réinjecté dans le delay (boucle de feedback)
3. Le gain de feedback est contrôlé par un slider (de 0 à 0.9)
4. Le mix entre le signal sec et le signal mouillé est à 50/50
5. Utiliser `@` pour le délai et `~` pour la rétroaction

**Indications** :

- Utilise `import("stdfaust.lib");` pour accéder à `ma.SR`
- Le délai en échantillons : `int(0.3 * ma.SR)`
- `~` réinjecte la sortie avec un délai d'1 échantillon, `@` ajoute le reste
- Le feedback doit être multiplié par le gain (slider) pour s'atténuer

**Résultat attendu** :

- Feedback = 0 : un seul écho à 0.3 seconde, puis silence
- Feedback = 0.5 : plusieurs échos qui s'atténuent progressivement
- Feedback = 0.9 : les échos persistent longtemps

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
import("stdfaust.lib");

// Délai de 0.3 seconde → 13230 échantillons à 44100 Hz
delai = int(0.3 * ma.SR);

// Gain de feedback : 0.0 = un seul écho, 0.9 = nombreux échos
// Ne jamais dépasser 1.0 (divergence du signal)
feedback = hslider("Feedback", 0.5, 0, 0.9, 0.01);

// Delay line avec feedback :
// 1. + additionne le signal d'entrée et le feedback
// 2. @ retarde la somme de 'delai' échantillons
// 3. * feedback atténue le signal retardé
// 4. ~ réinjecte le résultat dans l'entrée de +
delay_feedback = + ~ (@(delai) : *(feedback));

// Mix : 50% signal sec + 50% signal mouillé
process = _ <: (_, delay_feedback) :> /(2);
```

Fonctionnement avec une impulsion et feedback = 0.5 (délai simplifié à 5 échantillons) :

```text
Temps :     0      1-4    5      6-9    10     11-14   15
Entrée :    1.0    0.0    0.0    0.0    0.0    0.0     0.0
Sortie :    0.0    0.0    1.0    0.0    0.0    0.0     0.5
                          ↑                             ↑
                     1er écho                    2e écho (×0.5)

Le 3e écho arrive au temps 20 avec un gain de 0.25 (0.5 × 0.5).
```

```bash
# Compile et lance
faust2jack delay-feedback.dsp
./delay-feedback

# Visualise le diagramme
faust -svg delay-feedback.dsp
```

---

## Navigation

← Fiche précédente : **[03 - Interfaces utilisateur (UI)](03-interfaces-utilisateur-ui.md)**
