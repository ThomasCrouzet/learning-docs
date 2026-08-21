---
tags:
  - Faust
  - Intermédiaire
  - Concept
description: "Syntaxe et sémantique de base de Faust - process, import, signaux et primitives du langage"
estimated_time: "75 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 3 - Langage Faust fondamentaux"
id: "specializations.faust.language.syntaxe-semantique-base"
course_id: "specializations.faust"
module_id: "specializations.faust.language"
content_type: "lesson"
order: 1
---

# 01 - Syntaxe et sémantique de base

> **En bref** : À la fin de cette fiche, tu sauras écrire un programme Faust simple, comprendre la notion de signal comme fonction du temps, et utiliser les primitives du langage. Lecture estimée : 75 min.


## Prérequis

- Phase 1 complète - Fondamentaux d'acoustique ([fiches 01 à 04](../01-fondamentaux-acoustique/index.md))
- [Fiche 03 - Environnement et outils](../02-prerequis-programmation/03-environnement-outils.md) (installation de Faust, IDE en ligne, outils de compilation)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire un programme Faust simple, comprendre la notion de signal comme fonction du temps, et utiliser les primitives du langage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le paradigme "tout est signal" ?

**Définition** : En Faust, tout programme décrit une transformation de signaux. Un programme ne contient pas de boucles, de variables modifiables ou d'instructions séquentielles. Il décrit uniquement comment des signaux d'entrée sont transformés en signaux de sortie.

**Le problème que ce paradigme résout** :

Sans ce paradigme, voici les problèmes rencontrés en programmation audio :

1. **Complexité temporelle** : En C++ ou Python, tu dois gérer manuellement les boucles échantillon par échantillon, les buffers, les indices de lecture et d'écriture. Le risque de bugs est élevé.

2. **Synchronisation difficile** : Quand tu traites plusieurs flux audio en parallèle, tu dois garantir toi-même que tous les signaux avancent au même rythme. Un décalage d'un seul échantillon produit des artefacts audibles.

3. **Optimisation manuelle** : Tu dois écrire du code performant à la main (vectorisation, gestion mémoire) pour atteindre le temps réel.

**Comment le paradigme "tout est signal" résout ces problèmes** :

| Problème | Solution apportée par Faust |
| -------- | --------------------------- |
| Complexité temporelle | Tu décris la transformation, le compilateur génère la boucle audio |
| Synchronisation difficile | Tous les signaux avancent automatiquement au même rythme |
| Optimisation manuelle | Le compilateur optimise le code généré (vectorisation, parallélisation) |

**Analogie concrète** : Imagine une chaîne de montage dans une usine. Tu ne programmes pas le mouvement de chaque ouvrier (approche impérative). Tu décris les postes de travail et comment les pièces passent d'un poste à l'autre (approche Faust). La chaîne tourne ensuite toute seule, chaque pièce avançant d'un poste à chaque cycle.

**Ce que "tout est signal" n'est PAS** :

- Ce n'est pas de la programmation impérative. Tu ne donnes pas des instructions pas à pas ("lis cet échantillon, multiplie-le, écris le résultat"). Tu décris une relation entre entrées et sorties.
- Ce n'est pas de la programmation orientée objet. Il n'y a pas de classes, pas d'héritage, pas de méthodes. Un programme Faust est une expression mathématique qui transforme des signaux.

---

### Qu'est-ce que `process` ?

**Définition** : `process` est le point d'entrée obligatoire de tout programme Faust. C'est le nom réservé qui définit la transformation audio principale du programme. Chaque programme Faust doit contenir exactement une définition de `process`.

**Le problème que `process` résout** :

Sans point d'entrée standard, le compilateur ne saurait pas quelle expression constitue le programme principal. Avec `process`, il n'y a aucune ambiguïté : le compilateur cherche systématiquement cette définition. Les autres définitions du fichier sont des sous-expressions utilisées par `process`.

**Analogie concrète** : `process` est comme la porte d'entrée d'une maison. Une maison peut avoir plusieurs pièces (les définitions intermédiaires), mais il n'y a qu'une seule porte d'entrée par laquelle on accède à l'ensemble. Le compilateur Faust entre toujours par `process`.

**Ce que `process` n'est PAS** :

- `process` n'est pas une fonction que tu appelles. Tu ne peux pas écrire `process(x)`. C'est une définition, pas un appel.
- `process` n'est pas optionnel. Un programme Faust sans `process` provoque une erreur de compilation.

**Comparaison avec d'autres langages** :

| Langage | Point d'entrée | Syntaxe |
| ------- | -------------- | ------- |
| Faust | `process` | `process = expression;` |
| C/C++ | `main()` | `int main() { ... }` |
| Python | Exécution directe | Le fichier est exécuté de haut en bas |
| Java | `main()` | `public static void main(String[] args) { ... }` |

---

### Qu'est-ce que `import("stdfaust.lib")` ?

**Définition** : `import("stdfaust.lib")` est l'instruction qui charge les bibliothèques standard de Faust. Ces bibliothèques contiennent des centaines de fonctions prêtes à l'emploi : oscillateurs, filtres, effets, outils mathématiques.

**Le problème que `import` résout** :

Sans `import`, voici les problèmes rencontrés :

1. **Tout réécrire** : Tu devrais écrire toi-même chaque oscillateur, chaque filtre, chaque fonction utilitaire.

2. **Erreurs de calcul** : Implémenter un filtre ou un oscillateur correct exige des connaissances DSP avancées. Le moindre bug introduit des artefacts audio.

3. **Code non portable** : Sans bibliothèque commune, chaque développeur utilise ses propres conventions. Le partage de code devient difficile.

**Comment `import` résout ces problèmes** :

| Problème | Solution apportée par `import` |
| -------- | ------------------------------ |
| Tout réécrire | Accès à des centaines de fonctions testées et optimisées |
| Erreurs de calcul | Les fonctions des bibliothèques sont validées par la communauté |
| Code non portable | Tout le monde utilise les mêmes bibliothèques standard |

**Analogie concrète** : `import("stdfaust.lib")` est comme ouvrir une boîte à outils professionnelle. Au lieu de fabriquer toi-même un tournevis et un marteau, tu ouvres la boîte et tu utilises les outils fournis. Chaque outil a un nom précis (`os.osc` pour un oscillateur, `fi.lowpass` pour un filtre passe-bas).

**Ce que `import` n'est PAS** :

- `import` ne charge pas un fichier de code impératif. Il rend disponible un ensemble de définitions fonctionnelles (des expressions de signaux nommées).
- `import` n'est pas obligatoire pour compiler. Un programme Faust peut fonctionner sans `import`, mais tu ne pourras utiliser que les primitives de base du langage.

**Les préfixes des bibliothèques standard** :

| Préfixe | Bibliothèque | Contenu |
| ------- | ------------ | ------- |
| `os` | `oscillators.lib` | Oscillateurs (sinus, carré, dent de scie...) |
| `fi` | `filters.lib` | Filtres (passe-bas, passe-haut, résonant...) |
| `ef` | `effects.lib` | Effets (réverbe, chorus, flanger...) |
| `ma` | `maths.lib` | Constantes et fonctions mathématiques |
| `no` | `noises.lib` | Générateurs de bruit |
| `en` | `envelopes.lib` | Enveloppes (ADSR, ASR...) |
| `de` | `delays.lib` | Lignes de délai |
| `an` | `analyzers.lib` | Analyseurs (amplitude, fréquence...) |

---

### Qu'est-ce qu'un signal en Faust ?

**Définition** : Un signal en Faust est une fonction du temps discret. Formellement, un signal $s$ est une fonction qui associe à chaque entier $t$ (le numéro d'échantillon) une valeur flottante : $s(t) \to \text{float}$. Le temps $t$ commence à 0 et augmente de 1 à chaque échantillon.

**Le problème que cette abstraction résout** :

Sans cette abstraction, voici les problèmes rencontrés :

1. **Gestion manuelle du temps** : En C++, tu dois créer une variable de compteur, l'incrémenter à chaque échantillon, et gérer toi-même la correspondance temps/valeur.

2. **Confusion entre échantillon et buffer** : Un échantillon est une valeur unique à un instant donné. Un buffer est un tableau d'échantillons. Mélanger les deux provoque des bugs subtils.

3. **Synchronisation des calculs** : Quand tu combines plusieurs signaux, tu dois t'assurer qu'ils sont tous évalués au même instant $t$.

**Comment les signaux en Faust résolvent ces problèmes** :

| Problème | Solution apportée par les signaux |
| -------- | --------------------------------- |
| Gestion manuelle du temps | Le compilateur gère automatiquement l'avancement de $t$ |
| Confusion échantillon/buffer | En Faust, tu ne manipules que des signaux, le compilateur gère les buffers |
| Synchronisation des calculs | Tous les signaux sont évalués simultanément à chaque $t$ |

**Analogie concrète** : Imagine un thermomètre qui enregistre la température chaque seconde. À la seconde 0, il affiche 20.5. À la seconde 1, il affiche 20.6. À la seconde 2, il affiche 20.4. Ce thermomètre est un signal : il associe un numéro de seconde (le temps $t$) à une valeur (la température). En Faust, un signal audio fonctionne de la même manière, mais il enregistre 44100 valeurs par seconde (à 44.1 kHz) et chaque valeur représente la position de la membrane du haut-parleur.

**Ce qu'un signal n'est PAS** :

- Un signal n'est pas un tableau. Tu ne peux pas accéder à `s[5]` comme dans un tableau. Un signal est une fonction mathématique évaluée automatiquement par le compilateur.
- Un signal n'est pas une variable. Il ne peut pas être modifié après sa définition. Il est calculé pour chaque valeur de $t$.

**Exemple concret** :

```text
Fréquence d'échantillonnage : 44100 Hz

Signal constant : s(t) = 0.5
  t=0 → 0.5,  t=1 → 0.5,  t=2 → 0.5, ...

Signal sinusoïdal à 1 Hz : s(t) = sin(2 * pi * t / 44100)
  t=0     → 0.0
  t=11025 → 1.0   (quart de période)
  t=22050 → 0.0   (demi-période)
  t=33075 → -1.0  (trois quarts de période)
  t=44100 → 0.0   (période complète)
```

---

### Qu'est-ce que la syntaxe des définitions ?

**Définition** : En Faust, une définition lie un nom à une expression de signal. La syntaxe est `nom = expression;`. Le point-virgule est obligatoire à la fin de chaque définition.

**Le problème que les définitions résolvent** :

Sans définitions nommées, voici les problèmes rencontrés :

1. **Illisibilité** : Un programme constitué d'une seule expression longue est difficile à lire et à comprendre.

2. **Duplication** : Si la même sous-expression est utilisée plusieurs fois, tu dois la copier-coller à chaque endroit.

**Comment les définitions résolvent ces problèmes** :

| Problème | Solution apportée par les définitions |
| -------- | ------------------------------------- |
| Illisibilité | Tu découpes l'expression en sous-expressions nommées |
| Duplication | Tu définis une fois, tu réutilises le nom partout |

**Analogie concrète** : Les définitions sont comme des étiquettes sur des boîtes de rangement. Au lieu de décrire à chaque fois "la boîte bleue sur l'étagère du haut qui contient les vis de 6mm", tu colles une étiquette "vis_6mm" et tu utilises ce nom partout.

**Exemples** :

```faust
// Définition d'une constante
gain = 0.5;

// Définition utilisant une autre définition
volume = _ * gain;

// Définition avec plusieurs opérations
mixage = _ * 0.7 + _ * 0.3;

// process utilise les définitions
process = volume;
```

**Règles de syntaxe** :

| Règle | Exemple correct | Exemple incorrect |
| ----- | --------------- | ----------------- |
| Point-virgule obligatoire | `gain = 0.5;` | `gain = 0.5` |
| Nom en minuscules recommandé | `mon_gain = 0.5;` | (convention, pas une erreur) |
| Pas d'espaces dans les noms | `mon_gain = 0.5;` | `mon gain = 0.5;` |
| Un seul `=` par définition | `gain = 0.5;` | `gain = volume = 0.5;` |

---

### Que sont les commentaires en Faust ?

**Définition** : Les commentaires sont du texte ignoré par le compilateur. Ils servent à documenter le code pour les humains. Faust supporte deux types de commentaires, identiques à ceux du C/C++.

**Les deux types de commentaires** :

```faust
// Commentaire sur une seule ligne
// Tout ce qui suit les deux barres obliques est ignoré

/* Commentaire sur
   plusieurs lignes.
   Tout entre les délimiteurs est ignoré. */

// Exemple dans un programme
gain = 0.5; // Le gain de sortie (entre 0 et 1)

/* Ce programme prend un signal mono en entrée
   et réduit son volume de moitié */
process = _ * gain;
```

---

### Que sont les primitives du langage ?

**Définition** : Les primitives sont les opérations de base intégrées au langage Faust. Elles opèrent sur des signaux échantillon par échantillon. Aucune importation n'est nécessaire pour les utiliser.

**Le problème que les primitives résolvent** :

Sans primitives intégrées, voici les problèmes rencontrés :

1. **Impossible de transformer les signaux** : Sans addition, multiplication ou division, tu ne peux pas modifier l'amplitude, mixer des signaux ou calculer des moyennes.

2. **Dépendance externe** : Tu devrais importer une bibliothèque rien que pour faire une addition.

**Analogie concrète** : Les primitives sont comme les outils de base dans un atelier (marteau, tournevis, pince). Ils sont fournis avec l'atelier, tu n'as pas besoin de les acheter séparément. Les bibliothèques (`import`) fournissent des outils spécialisés en plus.

**Ce que les primitives ne sont PAS** :

- Elles ne sont pas des opérations sur des nombres isolés. En Faust, `0.5` est un signal constant (il vaut 0.5 à chaque échantillon $t$). L'opération `_ * 0.5` multiplie chaque échantillon du signal d'entrée par 0.5.
- Elles ne modifient pas un signal existant. Elles créent un nouveau signal résultant de l'opération.

#### Primitives numériques

| Primitive | Signification | Exemple Faust | Effet sur le signal |
| --------- | ------------- | ------------- | ------------------- |
| `+` | Addition | `_ + _` | Additionne deux signaux |
| `-` | Soustraction | `_ - _` | Soustrait un signal d'un autre |
| `*` | Multiplication | `_ * 0.5` | Réduit l'amplitude de moitié |
| `/` | Division | `_ / 2` | Divise le signal par 2 |
| `%` | Modulo (reste) | `_ % 1.0` | Reste de la division |

**Constantes numériques** :

```faust
freq = 440;    // Constante entière (signal constant valant 440)
gain = 0.5;    // Constante flottante (signal constant valant 0.5)
petit = 1e-6;  // Notation scientifique (0.000001)
```

#### Primitives de comparaison

Le résultat est un signal qui vaut 1.0 (vrai) ou 0.0 (faux) à chaque échantillon.

| Primitive | Signification | Exemple | Résultat |
| --------- | ------------- | ------- | -------- |
| `<` | Inférieur strict | `_ < 0.0` | 1.0 si l'échantillon est négatif |
| `>` | Supérieur strict | `_ > 1.0` | 1.0 si l'échantillon dépasse 1.0 |
| `<=` | Inférieur ou égal | `_ <= 0.5` | 1.0 si au plus 0.5 |
| `>=` | Supérieur ou égal | `_ >= -1.0` | 1.0 si au moins -1.0 |
| `==` | Égal | `_ == 0.0` | 1.0 si exactement 0.0 |
| `!=` | Différent | `_ != 0.0` | 1.0 si différent de 0.0 |

#### Primitives logiques

| Primitive | Signification | Exemple |
| --------- | ------------- | ------- |
| `&` | ET logique | `(>0.0) & (<1.0)` - vrai si entre 0 et 1 |
| `\|` | OU logique | `(==0.0) \| (==1.0)` - vrai si 0 ou 1 |
| `xor` | OU exclusif | `a xor b` - vrai si un seul est vrai |

#### Primitives mathématiques

| Primitive | Description | Entrées | Primitive | Description | Entrées |
| --------- | ----------- | ------- | --------- | ----------- | ------- |
| `sin` | Sinus | 1 | `abs` | Valeur absolue | 1 |
| `cos` | Cosinus | 1 | `min` | Minimum | 2 |
| `tan` | Tangente | 1 | `max` | Maximum | 2 |
| `exp` | Exponentielle | 1 | `floor` | Arrondi bas | 1 |
| `log` | Logarithme | 1 | `ceil` | Arrondi haut | 1 |
| `sqrt` | Racine carrée | 1 | `rint` | Arrondi proche | 1 |

---

### Qu'est-ce que la largeur d'un signal ?

**Définition** : La largeur d'un signal (ou d'une expression) est le nombre de canaux qu'il représente. Un signal mono a une largeur de 1. Deux signaux en parallèle ont une largeur de 2. La largeur détermine le nombre d'entrées et de sorties d'une expression.

**Le problème que la notion de largeur résout** :

Sans notion de largeur, voici les problèmes rencontrés :

1. **Connexions incompatibles** : Si tu essaies de connecter une sortie stéréo (2 canaux) à une entrée mono (1 canal), que se passe-t-il ? Sans règle claire, le résultat est imprévisible.

2. **Erreurs silencieuses** : En C++, connecter des buffers de tailles différentes provoque des lectures hors limites, sans message d'erreur explicite.

**Comment la notion de largeur résout ces problèmes** :

| Problème | Solution apportée par la largeur |
| -------- | -------------------------------- |
| Connexions incompatibles | Le compilateur vérifie la compatibilité des largeurs à la compilation |
| Erreurs silencieuses | Une incompatibilité de largeur provoque une erreur explicite |

**Analogie concrète** : La largeur fonctionne comme le nombre de voies sur une route. Une route à 1 voie (mono) ne peut pas se connecter directement à une autoroute à 4 voies sans un échangeur adapté. Le compilateur Faust vérifie que les "routes" sont compatibles.

**Expressions de base et leur largeur** :

| Expression | Entrées | Sorties | Description |
| ---------- | ------- | ------- | ----------- |
| `_` | 1 | 1 | Passe un signal (identité) |
| `!` | 1 | 0 | Supprime un signal |
| `0.5` | 0 | 1 | Signal constant (pas d'entrée) |
| `_,_` | 2 | 2 | Deux signaux parallèles |
| `_,_,_` | 3 | 3 | Trois signaux parallèles |
| `_ + _` | 2 | 1 | Additionne deux entrées en une sortie |
| `_ * 0.5` | 1 | 1 | Multiplie une entrée par une constante |

**Ce que la largeur n'est PAS** :

- La largeur n'est pas le nombre d'échantillons. Chaque canal contient une infinité d'échantillons (un par valeur de $t$). La largeur compte les canaux, pas les échantillons.
- La largeur n'est pas fixée à 2 (stéréo). Un programme Faust peut avoir 1, 2, 8, 64 ou n'importe quel nombre de canaux.

---

## Étapes Pratiques

### Étape 1 : Créer un programme passthrough

Un programme passthrough laisse passer le signal d'entrée sans le modifier. C'est le programme Faust le plus simple possible.

Crée un fichier `passthrough.dsp` avec ce contenu :

```faust
// passthrough.dsp
// Ce programme laisse passer le signal d'entrée tel quel
process = _;
```

**Explication** :

- `_` est la primitive d'identité. Elle prend un signal en entrée et le renvoie tel quel en sortie.
- Ce programme a 1 entrée et 1 sortie (largeur de 1).

**Résultat attendu** :

```text
Largeur : 1 entrée → 1 sortie
Le signal de sortie est identique au signal d'entrée.
```

---

### Étape 2 : Créer un signal constant et additionner deux signaux

Crée un fichier `bases.dsp` :

```faust
// bases.dsp
// Exemples de programmes Faust élémentaires

// Signal constant (0 entrée → 1 sortie)
// Chaque échantillon vaut 0.5
// constant = 0.5;

// Addition de deux signaux (2 entrées → 1 sortie)
// À chaque échantillon t : sortie(t) = entrée1(t) + entrée2(t)
// addition = _ + _;

// Programme actif : décommente celui que tu veux tester
process = 0.5;
```

**Explication** :

- `0.5` est un signal constant : à chaque échantillon $t$, la sortie vaut 0.5. Ce programme a 0 entrée et 1 sortie.
- `_ + _` additionne deux signaux. Ce programme a 2 entrées et 1 sortie.
- Change la ligne `process` pour tester chaque variante.

**Résultat attendu** :

```text
process = 0.5;   → 0 entrée, 1 sortie (signal constant)
process = _ + _; → 2 entrées, 1 sortie (somme des entrées)
```

---

### Étape 3 : Utiliser les primitives mathématiques

Crée un fichier `maths.dsp` :

```faust
// maths.dsp
// Valeur absolue du signal d'entrée (redresse les valeurs négatives)
// Si entrée(t) = -0.7, alors sortie(t) = 0.7
process = abs;
```

**Résultat attendu** :

```text
Largeur : 1 entrée → 1 sortie
  entrée(t) =  0.6 → sortie(t) = 0.6
  entrée(t) = -0.8 → sortie(t) = 0.8
```

---

### Étape 4 : Premier oscillateur sinusoïdal

Crée un fichier `oscillateur.dsp` :

```faust
// oscillateur.dsp
// Ce programme génère un son sinusoïdal à 440 Hz (la note La)

// Importer les bibliothèques standard pour accéder aux oscillateurs
import("stdfaust.lib");

// Définir la fréquence en Hz
freq = 440;

// os.osc(f) génère un signal sinusoïdal à la fréquence f
// Le signal oscille entre -1.0 et +1.0
process = os.osc(freq);
```

**Explication** :

- `import("stdfaust.lib")` charge toutes les bibliothèques standard, dont `oscillators.lib` (préfixe `os`).
- `os.osc(440)` génère un signal sinusoïdal à 440 Hz. Ce signal vaut $\sin(2\pi \times 440 \times t / SR)$ où $SR$ est la fréquence d'échantillonnage.
- Ce programme a 0 entrée et 1 sortie : il génère un son sans avoir besoin d'entrée audio.

**Résultat attendu** :

```text
Entrée : aucune (0 entrée)
Sortie : une sinusoïde à 440 Hz, amplitude entre -1.0 et 1.0
Son : un La pur et continu (la note de référence pour accorder les instruments)
Largeur : 0 entrée → 1 sortie
```

---

### Étape 5 : Compiler et exécuter avec faust2jaqt

La commande `faust2jaqt` compile un programme Faust en application audio autonome avec une interface graphique Qt et le serveur audio JACK.

Ouvre un terminal et exécute :

```bash
# Compiler le programme oscillateur en application JACK/Qt
faust2jaqt oscillateur.dsp
```

**Résultat attendu** :

```text
# La compilation génère un exécutable, puis on le lance
./oscillateur
```

L'application ouvre une fenêtre Qt. Tu entends un son sinusoïdal continu à 440 Hz. Ferme la fenêtre ou appuie sur `Ctrl+C` pour arrêter.

**Alternatives si JACK n'est pas installé** : `faust2paqt` (PortAudio), `faust2caqt` (CoreAudio/macOS), `faust2alsa` (ALSA/Linux).

---

### Étape 6 : Visualiser avec faust2svg

La commande `faust2svg` génère un diagramme SVG qui représente visuellement le circuit de signaux de ton programme.

```bash
# Générer le diagramme SVG du programme
faust2svg oscillateur.dsp
```

**Résultat attendu** :

```text
# Un dossier est créé avec les fichiers SVG
oscillateur-svg/
├── process.svg       # Diagramme du bloc principal
└── ...               # Sous-diagrammes éventuels
```

Ouvre `oscillateur-svg/process.svg` dans un navigateur pour visualiser le circuit de signaux. Le diagramme montre le bloc `os.osc(440)` connecté à la sortie. Plus le programme est complexe, plus le diagramme aide à comprendre les connexions.

```bash
# macOS :
open oscillateur-svg/process.svg
# Linux :
xdg-open oscillateur-svg/process.svg
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust fichier.dsp` | Compiler et afficher le code C++ généré |
| `faust -a minimal.cpp fichier.dsp` | Compiler avec un fichier d'architecture minimal |
| `faust2jaqt fichier.dsp` | Compiler en application JACK + Qt |
| `faust2paqt fichier.dsp` | Compiler en application PortAudio + Qt |
| `faust2caqt fichier.dsp` | Compiler en application CoreAudio + Qt (macOS) |
| `faust2svg fichier.dsp` | Générer un diagramme SVG du circuit |
| `faust -version` | Afficher la version du compilateur Faust |
| `faust --help` | Afficher l'aide complète du compilateur |

---

## Pièges Fréquents

### Piège 1 : Oublier le point-virgule

**Problème** : Chaque définition en Faust doit se terminer par un point-virgule. L'oublier provoque une erreur de compilation.

```faust
// ❌ Incorrect : pas de point-virgule
gain = 0.5
process = _ * gain;
```

**Solution** : Ajouter le point-virgule à la fin de chaque définition.

```faust
// ✅ Correct
gain = 0.5;
process = _ * gain;
```

**Message d'erreur typique** :

```text
ERROR : syntax error, unexpected IDENT, expecting SEP
```

---

### Piège 2 : Oublier `import` avant d'utiliser une bibliothèque

**Problème** : Si tu utilises `os.osc`, `fi.lowpass` ou toute autre fonction de bibliothèque sans `import("stdfaust.lib")`, le compilateur ne reconnaît pas le nom.

```faust
// ❌ Incorrect : pas d'import
process = os.osc(440);
```

**Solution** : Ajouter `import("stdfaust.lib");` en début de fichier.

```faust
// ✅ Correct
import("stdfaust.lib");
process = os.osc(440);
```

**Message d'erreur typique** :

```text
ERROR : undefined symbol : os
```

---

### Piège 3 : Incompatibilité de largeur

**Problème** : Connecter des expressions avec des largeurs incompatibles provoque une erreur. Par exemple, `+` attend 2 entrées mais une expression n'en fournit qu'une.

**Solution** : Vérifier que le nombre de sorties correspond au nombre d'entrées attendues. Tu apprendras les opérateurs de composition dans la fiche suivante.

---

### Piège 4 : Confondre `=` et `==`

**Problème** : `=` lie un nom à une expression (définition). `==` compare deux signaux. Les confondre provoque des erreurs.

**Solution** : `gain = 0.5;` est une **définition**. `_ == 0.0` est une **comparaison** (renvoie 1.0 ou 0.0).

---

### Piège 5 : Volume trop fort avec les oscillateurs

**Problème** : `os.osc(440)` génère un signal entre -1.0 et 1.0, ce qui correspond au volume maximum. Sur des haut-parleurs ou un casque, ce volume peut être désagréable ou dangereux pour l'audition.

**Solution** : Toujours atténuer le signal de sortie.

```faust
import("stdfaust.lib");

// ✅ Correct : atténuation à 10% du volume maximum
process = os.osc(440) * 0.1;
```

---

## Checklist de Validation

- [ ] Je comprends que Faust décrit des transformations de signaux, pas des instructions séquentielles
- [ ] Je sais que `process` est le point d'entrée obligatoire de tout programme Faust
- [ ] Je sais utiliser `import("stdfaust.lib")` pour accéder aux bibliothèques standard
- [ ] Je comprends qu'un signal est une fonction du temps $s(t) \to \text{float}$
- [ ] Je sais écrire une définition avec la syntaxe `nom = expression;`
- [ ] Je connais les primitives numériques : `+`, `-`, `*`, `/`, `%`
- [ ] Je connais les primitives de comparaison : `<`, `>`, `<=`, `>=`, `==`, `!=`
- [ ] Je connais les primitives logiques : `&`, `|`, `xor`
- [ ] Je connais les primitives mathématiques : `sin`, `cos`, `abs`, `sqrt`, `min`, `max`...
- [ ] Je comprends la notion de largeur (nombre d'entrées/sorties) d'une expression
- [ ] J'ai compilé et exécuté un programme Faust avec `faust2jaqt` ou équivalent
- [ ] J'ai visualisé un diagramme SVG avec `faust2svg`

---

## Exercice Pratique

**Énoncé** : Écrire un programme Faust en deux étapes.

**Partie 1** : Crée un programme `attenuation.dsp` qui prend un signal mono en entrée, le multiplie par 0.5 (réduction de volume de 50%) et produit le résultat en sortie.

**Partie 2** : Modifie le programme pour ajouter un oscillateur sinusoïdal à 440 Hz au signal d'entrée atténué. Le résultat final doit être la somme du signal d'entrée atténué et de l'oscillateur (lui aussi atténué à 0.3 pour éviter un volume trop fort).

**Indications** :

- Pour la partie 1, tu as besoin de `_` (entrée) et `*` (multiplication)
- Pour la partie 2, tu as besoin de `import("stdfaust.lib")` et `os.osc(440)`
- Utilise des définitions intermédiaires pour rendre le code lisible
- L'opérateur `+` additionne deux signaux en un seul

**Résultat attendu** :

- Partie 1 : un programme avec 1 entrée et 1 sortie, le signal de sortie est deux fois moins fort que l'entrée
- Partie 2 : un programme avec 1 entrée et 1 sortie, le signal de sortie est le mélange du signal d'entrée atténué et d'un La 440 Hz

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Partie 1 : Atténuation simple

```faust
// attenuation.dsp - Partie 1
// Réduit le volume du signal d'entrée de 50%

// Définition du facteur d'atténuation
gain = 0.5;

// process prend un signal mono en entrée (_)
// et le multiplie par le gain (0.5)
process = _ * gain;
```

**Vérification** :

```text
Largeur : 1 entrée → 1 sortie
  entrée(t) =  0.8 → sortie(t) =  0.4  (0.8 * 0.5)
  entrée(t) = -0.6 → sortie(t) = -0.3  (-0.6 * 0.5)
```

---

### Partie 2 : Atténuation + oscillateur

```faust
// attenuation.dsp - Partie 2
// Mélange le signal d'entrée atténué avec un oscillateur sinusoïdal

// Importer les bibliothèques pour accéder à os.osc
import("stdfaust.lib");

// Définitions intermédiaires
gain_entree = 0.5;     // Atténuation du signal d'entrée (50%)
gain_osc = 0.3;        // Atténuation de l'oscillateur (30%)
freq = 440;            // Fréquence de l'oscillateur en Hz

// Signal d'entrée atténué
entree_attenuee = _ * gain_entree;

// Oscillateur sinusoïdal atténué
osc_attenue = os.osc(freq) * gain_osc;

// Mélange : addition des deux signaux
// entree_attenuee a 1 entrée et 1 sortie
// osc_attenue a 0 entrée et 1 sortie
// Le + additionne les deux sorties
process = entree_attenuee + osc_attenue;
```

**Vérification** :

```text
Largeur : 1 entrée → 1 sortie

Exemple numérique (à un instant t donné) :
  entrée(t) = 0.8, os.osc(440)(t) = 0.7
  entree_attenuee(t) = 0.8 * 0.5 = 0.4
  osc_attenue(t)     = 0.7 * 0.3 = 0.21
  sortie(t)          = 0.4 + 0.21 = 0.61
```

Compile et teste :

```bash
faust2jaqt attenuation.dsp && ./attenuation
```

Tu entends le mélange du signal d'entrée atténué et du La 440 Hz. Visualise le diagramme avec `faust2svg attenuation.dsp` pour vérifier la structure.

---

## Navigation

→ Fiche suivante : **[02 - Les cinq opérateurs de composition](02-cinq-operateurs-composition.md)**
