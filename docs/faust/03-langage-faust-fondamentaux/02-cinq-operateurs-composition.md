---
tags:
  - Faust
  - Intermédiaire
  - Concept
description: "Les cinq opérateurs de composition - le coeur du langage Faust : séquentiel, parallèle, split, merge et récursif"
estimated_time: "105 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 3 - Langage Faust fondamentaux"
id: "specializations.faust.language.cinq-operateurs-composition"
course_id: "specializations.faust"
module_id: "specializations.faust.language"
content_type: "lesson"
order: 2
---

# 02 - Les cinq opérateurs de composition

> **En bref** : À la fin de cette fiche, tu sauras utiliser les cinq opérateurs de composition de Faust pour construire des circuits de traitement audio complexes à partir de blocs simples. Lecture estimée : 105 min.


## Prérequis

- [Fiche 01 - Syntaxe et sémantique de base](01-syntaxe-semantique-base.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les cinq opérateurs de composition de Faust pour construire des circuits de traitement audio complexes à partir de blocs simples.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

Les cinq opérateurs de composition sont **le concept central du langage Faust**. Tout programme Faust est une combinaison de ces cinq opérateurs. Chaque opérateur connecte des blocs de traitement (des expressions qui ont des entrées et des sorties) de manière différente.

### Vue d'ensemble : les cinq opérateurs

| Opérateur | Symbole | Nom | Entrées | Sorties | Usage typique |
| --------- | ------- | --- | ------- | ------- | ------------- |
| Séquentiel | `:` | deux-points | entrées de A | sorties de B | Chaîner des traitements (A puis B) |
| Parallèle | `,` | virgule | entrées de A + B | sorties de A + B | Placer des blocs côte à côte |
| Split | `<:` | distribuer | entrées de A | sorties de B | Dupliquer/distribuer un signal |
| Merge | `:>` | fusionner | entrées de A | sorties de B | Mixer plusieurs signaux en un |
| Récursif | `~` | tilde | entrées de A + sorties de B | sorties de A | Créer une boucle de rétroaction |

Le diagramme suivant donne une vue synthétique des cinq opérateurs de composition et de leur rôle :

<div class="diagram-design">
<p><a href="../../../diagrams/faust-03-langage-faust-fondamentaux-02-cinq-operateurs-composition-1.html">Vue d&#x27;ensemble : les cinq opérateurs (HTML + SVG)</a></p>
<iframe src="../../../diagrams/faust-03-langage-faust-fondamentaux-02-cinq-operateurs-composition-1.html" title="Vue d&#x27;ensemble : les cinq opérateurs" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Règles de priorité des opérateurs

| Priorité | Opérateur | Symbole |
| -------- | --------- | ------- |
| 1 (la plus haute) | Récursif | `~` |
| 2 | Parallèle | `,` |
| 3 | Séquentiel | `:` |
| 4 (la plus basse) | Split et Merge | `<:` et `:>` |

**Règle pratique** : En cas de doute, utilise des parenthèses pour rendre l'intention explicite.

---

### Qu'est-ce que l'opérateur séquentiel `:` ?

**Définition** : L'opérateur séquentiel `:` (deux-points) connecte la sortie d'un bloc A à l'entrée d'un bloc B. L'expression `A : B` signifie "la sortie de A va dans l'entrée de B".

**Le problème que l'opérateur séquentiel résout** :

Sans l'opérateur séquentiel, impossible de connecter la sortie d'un traitement à l'entrée du suivant. Le code serait monolithique et non réutilisable.

**Comment l'opérateur séquentiel résout ces problèmes** :

| Problème | Solution apportée par `:` |
| -------- | ------------------------- |
| Pas de chaînage | Connecte directement la sortie de A à l'entrée de B |
| Code monolithique | Permet de décomposer en petits blocs indépendants |
| Pas de réutilisation | Chaque bloc peut être réutilisé dans différentes chaînes |

**Condition obligatoire** : Le nombre de sorties de A **doit** être égal au nombre d'entrées de B. Sinon, le compilateur Faust affiche une erreur.

```text
A (2 sorties) : B (2 entrées)    --> OK
A (1 sortie)  : B (2 entrées)    --> ERREUR
A (3 sorties) : B (1 entrée)     --> ERREUR
```

**Analogie concrète** : Des tuyaux de plomberie connectés bout à bout. L'eau (le signal) sort du premier tuyau (bloc A) et entre directement dans le second (bloc B). Le diamètre de sortie doit correspondre exactement au diamètre d'entrée.

**Diagramme** :

```text
         ┌─────┐     ┌─────┐
entrée ──┤  A  ├──●──┤  B  ├── sortie
         └─────┘     └─────┘

  A : B  =  la sortie de A va dans l'entrée de B
```

**Ce que l'opérateur séquentiel n'est PAS** :

- L'opérateur `:` n'est pas un opérateur d'affectation. Il ne stocke pas de valeur, il connecte un flux de signal.
- L'opérateur `:` n'est pas un séparateur d'instructions. Le `:` décrit une connexion permanente entre deux blocs de traitement.

**Exemple** :

```faust
// Un signal d'entrée multiplié par 0.5 (gain), puis limité entre -1 et 1 (clip)
process = *(0.5) : min(1) : max(-1);
```

---

### Qu'est-ce que l'opérateur parallèle `,` ?

**Définition** : L'opérateur parallèle `,` (virgule) place deux blocs A et B côte à côte, sans aucune connexion entre eux. Les entrées et sorties s'additionnent.

**Le problème que l'opérateur parallèle résout** :

Sans l'opérateur parallèle, impossible de traiter plusieurs signaux en même temps, de créer du stéréo ou de construire des blocs multi-canaux.

| Problème | Solution apportée par `,` |
| -------- | ------------------------- |
| Un seul canal | Place plusieurs traitements côte à côte |
| Pas de stéréo | Deux blocs parallèles donnent gauche et droite |
| Pas de regroupement | Construit des blocs avec le nombre d'entrées/sorties voulu |

**Calcul des entrées et sorties** :

```text
A a 1 entrée, 1 sortie  +  B a 1 entrée, 1 sortie
→ A, B a 2 entrées, 2 sorties
```

**Analogie concrète** : Deux tuyaux de plomberie posés côte à côte, chacun transportant son propre flux d'eau. Les deux tuyaux sont indépendants.

**Diagramme** :

```text
           ┌─────┐
entrée 1 ──┤  A  ├── sortie 1
           └─────┘
           ┌─────┐
entrée 2 ──┤  B  ├── sortie 2
           └─────┘

  A, B  =  A et B côte à côte, sans connexion
```

**Ce que l'opérateur parallèle n'est PAS** :

- L'opérateur `,` ne mélange pas les signaux. Il les place côte à côte sans interaction.
- L'opérateur `,` n'est pas le séparateur de paramètres d'une fonction. En Faust, la virgule est un opérateur de composition à part entière.

**Comparaison entre séquentiel et parallèle** :

| Séquentiel `:` | Parallèle `,` |
| --------------- | -------------- |
| Connecte A puis B en série | Place A et B côte à côte |
| La sortie de A va dans B | Aucune connexion entre A et B |
| Nombre de sorties de A = entrées de B | Les entrées/sorties s'additionnent |

**Exemple** :

```faust
// Deux oscillateurs indépendants : un à 440 Hz (gauche), un à 880 Hz (droite)
import("stdfaust.lib");
process = os.osc(440), os.osc(880);
```

---

### Qu'est-ce que l'opérateur split `<:` ?

**Définition** : L'opérateur split `<:` (distribuer) distribue les sorties de A vers les entrées de B. Les sorties de A sont dupliquées automatiquement pour remplir toutes les entrées de B.

**Le problème que l'opérateur split résout** :

Sans l'opérateur split, impossible de copier un signal pour l'envoyer à plusieurs traitements ou de convertir du mono en stéréo.

| Problème | Solution apportée par `<:` |
| -------- | -------------------------- |
| Pas de duplication | Duplique automatiquement les sorties vers les entrées |
| Mono vers stéréo | `_ <: _, _` duplique un signal mono en stéréo |
| Pas de distribution | Distribue un signal vers autant de blocs que nécessaire |

**Règle de distribution** : Le nombre de sorties de A doit diviser le nombre d'entrées de B.

```text
1 sortie  <:  2 entrées  -->  OK (signal dupliqué 2 fois)
2 sorties <:  4 entrées  -->  OK (chaque sortie dupliquée 2 fois)
2 sorties <:  3 entrées  -->  ERREUR (2 ne divise pas 3)
```

**Analogie concrète** : Un robinet avec un répartiteur en T. L'eau arrive par un seul tuyau et le répartiteur la distribue dans deux (ou plus) tuyaux de sortie. Chaque tuyau reçoit une copie complète du flux.

**Diagramme** :

```text
                     ┌─────┐
                  ┌──┤  B1 ├── sortie 1
         ┌─────┐ │  └─────┘
entrée ──┤  A  ├─┤
         └─────┘ │  ┌─────┐
                  └──┤  B2 ├── sortie 2
                     └─────┘

  A <: (B1, B2)  =  la sortie de A est dupliquée vers B1 et B2
```

**Ce que l'opérateur split n'est PAS** :

- L'opérateur `<:` ne divise pas le signal en deux moitiés. Chaque destination reçoit une copie complète.
- L'opérateur `<:` n'alterne pas entre les sorties. Toutes les destinations reçoivent le signal en permanence.

**Exemple** :

```faust
// Un oscillateur envoyé vers deux gains différents (gauche fort, droite faible)
import("stdfaust.lib");
process = os.osc(440) <: *(0.8), *(0.3);
```

---

### Qu'est-ce que l'opérateur merge `:>` ?

**Définition** : L'opérateur merge `:>` (fusionner) fusionne plusieurs signaux en un nombre réduit de signaux en les **additionnant**.

**Le problème que l'opérateur merge résout** :

Sans l'opérateur merge, impossible de combiner plusieurs signaux en un seul ou de réduire le nombre de canaux.

| Problème | Solution apportée par `:>` |
| -------- | -------------------------- |
| Pas de mixage | Additionne les signaux automatiquement |
| Trop de canaux | Réduit N signaux à M signaux (N > M) |
| Stéréo vers mono | `_, _ :> _` additionne gauche et droite |

**Règle de fusion** : Le nombre de sorties de A doit être un multiple du nombre d'entrées de B.

```text
2 sorties :>  1 entrée   -->  OK (2 signaux additionnés en 1)
4 sorties :>  2 entrées  -->  OK (groupes de 2, additionnés)
3 sorties :>  2 entrées  -->  ERREUR (3 n'est pas un multiple de 2)
```

**Analogie concrète** : Deux rivières qui se rejoignent en un confluent. L'eau des deux rivières se mélange en un seul cours d'eau. Le débit total est la somme des deux débits.

**Diagramme** :

```text
         ┌─────┐
entrée 1─┤  A1 ├─┐
         └─────┘ │  ┌─────┐
                  ├──┤  B  ├── sortie (somme)
         ┌─────┐ │  └─────┘
entrée 2─┤  A2 ├─┘
         └─────┘

  (A1, A2) :> B  =  les sorties de A1 et A2 sont additionnées vers B
```

**Ce que l'opérateur merge n'est PAS** :

- L'opérateur `:>` ne fait pas la moyenne. Il **additionne**. Pour la moyenne, divise par le nombre de sources.
- L'opérateur `:>` ne sélectionne pas un signal parmi plusieurs. Tous les signaux contribuent.

**Comparaison entre split et merge** :

| Split `<:` | Merge `:>` |
| ---------- | ---------- |
| Distribue un signal vers plusieurs | Fusionne plusieurs signaux en un |
| Duplique (copie) | Additionne (somme) |
| 1 vers N | N vers 1 |

**Exemple** :

```faust
// Mixer 4 oscillateurs en mono, puis diviser par 4 pour normaliser
import("stdfaust.lib");
process = os.osc(220), os.osc(330), os.osc(440), os.osc(550) :> *(0.25);
```

---

### Qu'est-ce que l'opérateur récursif `~` ?

**Définition** : L'opérateur récursif `~` (tilde) crée une boucle de rétroaction (feedback). L'expression `A ~ B` connecte la sortie de A vers l'entrée de B, puis la sortie de B est renvoyée vers la **première** entrée de A, avec un **délai implicite d'un échantillon**.

**Le problème que l'opérateur récursif résout** :

Sans l'opérateur récursif, chaque échantillon est traité sans mémoire des précédents. Impossible de créer des filtres IIR, des compteurs ou des oscillateurs récursifs.

| Problème | Solution apportée par `~` |
| -------- | ------------------------- |
| Pas de mémoire | Le délai d'un échantillon conserve la valeur précédente |
| Pas de filtres | Permet de réinjecter la sortie filtrée dans l'entrée |
| Pas de compteurs | Permet d'accumuler des valeurs au fil du temps |
| Pas d'oscillateurs | Permet de créer des boucles de génération de signal |

**Fonctionnement détaillé de `A ~ B`** :

1. A produit une sortie
2. Cette sortie est envoyée vers l'entrée de B
3. La sortie de B est renvoyée vers la **première** entrée de A (avec un délai d'un échantillon)
4. Les éventuelles autres entrées de A restent disponibles pour des signaux externes
5. Le cycle se répète pour chaque échantillon

**Analogie concrète** : Un microphone placé devant son propre haut-parleur. Le son capté (sortie de A) passe par un traitement (B), puis est renvoyé dans le haut-parleur (entrée de A). Il y a toujours un petit délai (le délai d'un échantillon). En audio numérique, ce feedback est contrôlé et stable.

**Diagramme** :

```text
            ┌───────────────┐
            │    ┌───┐      │
            ▼    │z⁻¹│      │
  entrée ──(+)───┤   ├──►───┤
            │    └───┘      │
            │    ┌───┐      │
            └────┤ B │◄─────┘
                 └───┘

  z⁻¹ = délai d'un échantillon
  (+) = le signal de retour arrive dans la première entrée de A
```

**Ce que l'opérateur récursif n'est PAS** :

- L'opérateur `~` ne crée pas une boucle infinie. Le délai d'un échantillon garantit un calcul fini.
- L'opérateur `~` n'est pas un opérateur de répétition. Il réinjecte la sortie dans l'entrée en continu.

**Exemple : compteur** :

```faust
// Compteur qui s'incrémente de 1 à chaque échantillon
process = +(1) ~ _;
```

Déroulement pas à pas :

| Échantillon | Retour (z⁻1) | Entrée (1) | Sortie (retour + 1) |
| ----------- | ------------- | ---------- | -------------------- |
| 0 | 0 (init) | 1 | 1 |
| 1 | 1 | 1 | 2 |
| 2 | 2 | 1 | 3 |
| 3 | 3 | 1 | 4 |
| 4 | 4 | 1 | 5 |

---

## Étapes Pratiques

### Étape 1 : Séquentiel -- chaîne gain, clip, sortie

Crée un fichier `composition.dsp` :

```faust
// composition.dsp -- Chaîne séquentielle : gain → clip → sortie
// *(0.5) réduit le volume de moitié
// min(1.0) empêche le signal de dépasser 1.0
// max(-1.0) empêche le signal de descendre sous -1.0
process = *(0.5) : min(1.0) : max(-1.0);
```

Compile et teste :

```bash
faust -svg composition.dsp
faust2jack composition.dsp && ./composition
```

**Résultat attendu** :

```text
Le diagramme SVG montre 3 blocs connectés en série :
  [entrée] → [*0.5] → [min 1.0] → [max -1.0] → [sortie]
```

---

### Étape 2 : Parallèle -- deux oscillateurs indépendants (stéréo)

Crée un fichier `stereo.dsp` :

```faust
// stereo.dsp -- Deux oscillateurs en stéréo
import("stdfaust.lib");

// La virgule place les deux signaux côte à côte : 0 entrées, 2 sorties
process = os.osc(440), os.osc(554);
```

```bash
faust2jack stereo.dsp && ./stereo
```

**Résultat attendu** :

```text
Canal gauche : sinus à 440 Hz (La4)
Canal droite : sinus à 554 Hz (Do#5)
```

---

### Étape 3 : Split -- un signal mono distribué en stéréo avec gains différents

Crée un fichier `split.dsp` :

```faust
// split.dsp -- Signal mono distribué en stéréo
import("stdfaust.lib");

// <: distribue le sinus vers 2 destinations avec des gains différents
process = os.osc(440) <: *(0.8), *(0.3);
```

```bash
faust2jack split.dsp && ./split
```

**Résultat attendu** :

```text
Canal gauche : sinus à 440 Hz, volume à 80%
Canal droite : sinus à 440 Hz, volume à 30%
```

---

### Étape 4 : Merge -- mixer 4 oscillateurs en un signal mono

Crée un fichier `merge.dsp` :

```faust
// merge.dsp -- 4 oscillateurs mixés en mono
import("stdfaust.lib");

// 4 oscillateurs harmoniques (220, 440, 660, 880 Hz)
oscillateurs = os.osc(220), os.osc(440), os.osc(660), os.osc(880);

// :> additionne les 4 signaux, *(0.25) normalise pour éviter la saturation
process = oscillateurs :> *(0.25);
```

```bash
faust2jack merge.dsp && ./merge
```

**Résultat attendu** :

```text
Un signal mono contenant le mélange de 4 sinus harmoniques,
normalisé à 25% pour éviter la saturation.
```

---

### Étape 5 : Récursif -- compteur simple et intégrateur

**Partie A : Compteur**

Crée un fichier `compteur.dsp` :

```faust
// compteur.dsp -- Compteur qui s'incrémente à chaque échantillon
// +(1) : ajoute 1 au signal d'entrée
// ~ _ : renvoie la sortie vers l'entrée (délai implicite d'un échantillon)
process = +(1) ~ _;
```

```bash
faust2plot compteur.dsp | head -10
```

**Résultat attendu** : Les valeurs 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (le compteur s'incrémente).

**Explication du circuit** :

```text
        ┌──────────────────┐
        │     retour       │
        ▼                  │
  ──►  (+) ── sortie ──►──┤
        ▲                  │
        │      ┌───┐       │
        └──────┤z⁻¹│◄──── ┘
               └───┘
```

**Partie B : Intégrateur (accumulateur)**

Crée un fichier `integrateur.dsp` :

```faust
// integrateur.dsp -- Accumulateur (somme cumulée du signal d'entrée)
// + a 2 entrées : la première reçoit le retour, la seconde le signal externe
// Résultat : somme cumulée (intégrale discrète) du signal d'entrée
process = + ~ _;
```

```text
        ┌──────────────────┐
        │     retour       │
        ▼                  │
  ──►  (+) ── sortie ──►──┤
   │    ▲                  │
   │    │      ┌───┐       │
   │    └──────┤z⁻¹│◄──── ┘
   │           └───┘
entrée externe (signal à accumuler)
```

---

### Étape 6 : Combiner tous les opérateurs -- un effet stéréo complet

Crée un fichier `tremolo-stereo.dsp` :

```faust
// tremolo-stereo.dsp -- Trémolo stéréo utilisant les 5 opérateurs
import("stdfaust.lib");

// Paramètres utilisateur
freq = hslider("Fréquence trémolo", 5, 0.1, 20, 0.1);
depth = hslider("Profondeur", 0.5, 0, 1, 0.01);
mix = hslider("Mix (dry/wet)", 0.5, 0, 1, 0.01);

// LFO : oscille entre (1-depth) et 1
// Opérateur : (séquentiel) - chaîne les blocs
lfo = os.osc(freq) : *(depth/2) : +(1 - depth/2);

// Trémolo mono : multiplie l'entrée par le LFO
// Opérateur , (parallèle) - place l'entrée et le LFO côte à côte
tremolo_mono = _ , lfo : *;

// Dry/wet : mélange signal original et traité
// Opérateur <: (split) - duplique l'entrée
// Opérateur :> (merge) - fusionne dry et wet
drywet = _ <: *(1-mix), (tremolo_mono : *(mix)) :> _;

// Stéréo : un traitement par canal
// Opérateur , (parallèle)
// Opérateur ~ (récursif) - utilisé en interne par os.osc
process = drywet, drywet;
```

```bash
faust2jack tremolo-stereo.dsp && ./tremolo-stereo
```

**Résultat attendu** :

```text
Application stéréo avec 3 sliders (fréquence, profondeur, mix).
Les 5 opérateurs sont utilisés : : , <: :> ~ (voir les commentaires du code).
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust -svg fichier.dsp` | Génère un diagramme SVG du circuit |
| `faust2jack fichier.dsp` | Compile pour JACK audio (ligne de commande) |
| `faust2jaqt fichier.dsp` | Compile pour JACK audio (interface graphique Qt) |
| `faust2plot fichier.dsp` | Génère les valeurs de sortie (pour vérifier les calculs) |
| `faust -a minimal.cpp fichier.dsp` | Génère le code C++ avec l'architecture minimale |

---

## Pièges Fréquents

### Piège 1 : Nombre d'entrées/sorties incompatible avec `:`

**Problème** : Erreur `ERROR : sequential composition ... has 2 outputs and ... has 1 input`.

```faust
// ERREUR : os.osc(440), os.osc(880) a 2 sorties, *(0.5) a 1 entrée
process = os.osc(440), os.osc(880) : *(0.5);
```

**Solution** : Applique le traitement à chaque canal :

```faust
import("stdfaust.lib");
process = os.osc(440), os.osc(880) : *(0.5), *(0.5);
```

---

### Piège 2 : Confondre `,` et `:` -- parallèle vs séquentiel

**Problème** : Tu veux chaîner mais tu utilises `,`. Le résultat a trop d'entrées/sorties.

```faust
// ERREUR DE LOGIQUE : place les 2 blocs côte à côte (2 entrées, 2 sorties)
process = *(0.5), min(1.0);
```

**Solution** : Utilise `:` pour connecter en série :

```faust
// CORRECT : 1 entrée, 1 sortie
process = *(0.5) : min(1.0);
```

---

### Piège 3 : Oublier de normaliser après un merge `:>`

**Problème** : Le merge additionne. 4 signaux fusionnés = amplitude 4 fois trop élevée.

```faust
// PROBLÈME : amplitude max = 4.0 (saturation)
import("stdfaust.lib");
process = os.osc(220), os.osc(440), os.osc(660), os.osc(880) :> _;
```

**Solution** : Divise par le nombre de signaux :

```faust
// CORRECT : amplitude normalisée (max = 1.0)
import("stdfaust.lib");
process = os.osc(220), os.osc(440), os.osc(660), os.osc(880) :> *(0.25);
```

---

### Piège 4 : Boucle récursive instable avec `~`

**Problème** : Le signal de retour n'est pas atténué, croissance exponentielle.

```faust
// DANGER : multiplié par 1.1 à chaque échantillon, explose vers l'infini
process = *(1.1) ~ _;
```

**Solution** : Le coefficient doit être strictement inférieur à 1 en valeur absolue :

```faust
// CORRECT : le coefficient 0.99 atténue à chaque échantillon
process = *(0.99) ~ _;
```

**Règle** : Pour qu'une boucle récursive soit stable, |gain| < 1.

---

### Piège 5 : Priorité des opérateurs -- résultat inattendu

**Problème** : `,` a une priorité plus haute que `:`, donc `A : B, C : D` est interprété comme `A : (B, C) : D`.

**Solution** : Utilise des parenthèses :

```faust
process = (A : B), (C : D);
```

---

## Checklist de Validation

- [ ] Je sais que Faust a exactement 5 opérateurs de composition
- [ ] Je sais utiliser `:` pour chaîner des traitements en série
- [ ] Je sais utiliser `,` pour placer des blocs côte à côte
- [ ] Je sais utiliser `<:` pour dupliquer/distribuer un signal
- [ ] Je sais utiliser `:>` pour fusionner/additionner des signaux
- [ ] Je sais utiliser `~` pour créer une boucle de rétroaction
- [ ] Je connais la condition de `:` (sorties A = entrées B)
- [ ] Je connais la règle de `<:` (sorties A doit diviser entrées B)
- [ ] Je connais la règle de `:>` (sorties A multiple de entrées B)
- [ ] Je sais que `~` introduit un délai implicite d'un échantillon
- [ ] Je connais l'ordre de priorité : `~` > `,` > `:` > `<:` et `:>`
- [ ] Je sais normaliser après un merge (diviser par le nombre de sources)
- [ ] Je sais que le gain d'une boucle récursive doit être < 1 pour la stabilité

---

## Exercice Pratique

**Énoncé** : Construis un mixeur 4 canaux vers stéréo.

Le mixeur doit avoir les caractéristiques suivantes :

- **4 entrées** : 4 signaux mono (canaux 1, 2, 3, 4)
- **2 sorties** : un signal stéréo (gauche, droite)
- Chaque canal possède :
  - Un contrôle de **volume** (slider de 0 à 1)
  - Un contrôle de **panoramique** (pan : 0 = gauche, 0.5 = centre, 1 = droite)
- Les 4 canaux sont fusionnés en 2 bus (gauche et droite)
- Un contrôle de **volume master** s'applique à la sortie stéréo finale

**Indications** :

- Crée une fonction `canal(v, p)` qui applique le volume `v`, puis distribue en stéréo avec le pan `p`
- Pour le panoramique : gauche = signal \* (1 - p), droite = signal \* p
- Utilise `<:` pour distribuer chaque canal mono en stéréo
- Utilise `,` pour placer les 4 canaux en parallèle
- Utilise `:>` pour fusionner les 4 paires stéréo en une seule paire
- Utilise `:` pour chaîner le volume master à la fin
- Utilise les 5 opérateurs dans ton programme

**Résultat attendu** :

```text
Un programme Faust avec :
- 4 entrées audio mono, 2 sorties audio (stéréo)
- 8 sliders de canal (4 volumes + 4 pans) + 1 slider master
- Le signal est correctement normalisé (pas de saturation)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
// mixeur-4ch.dsp -- Mixeur 4 canaux vers stéréo
import("stdfaust.lib");

// Contrôles de canal (volume et panoramique)
vol1 = hslider("[1]Canal 1/Volume", 0.7, 0, 1, 0.01);
vol2 = hslider("[2]Canal 2/Volume", 0.7, 0, 1, 0.01);
vol3 = hslider("[3]Canal 3/Volume", 0.7, 0, 1, 0.01);
vol4 = hslider("[4]Canal 4/Volume", 0.7, 0, 1, 0.01);

pan1 = hslider("[1]Canal 1/Pan", 0.3, 0, 1, 0.01);
pan2 = hslider("[2]Canal 2/Pan", 0.5, 0, 1, 0.01);
pan3 = hslider("[3]Canal 3/Pan", 0.5, 0, 1, 0.01);
pan4 = hslider("[4]Canal 4/Pan", 0.7, 0, 1, 0.01);

master = hslider("[5]Master/Volume", 0.8, 0, 1, 0.01);

// canal(v, p) : mono → stéréo avec volume et panoramique
//   : (séquentiel)  - chaîne volume puis split
//   <: (split)      - duplique pour gauche et droite
//   , (parallèle)   - gains gauche et droite côte à côte
canal(v, p) = *(v) : _ <: *(1-p), *(p);

// 4 canaux en parallèle : 4 entrées, 8 sorties (4 x 2)
quatre_canaux = canal(vol1, pan1), canal(vol2, pan2),
                canal(vol3, pan3), canal(vol4, pan4);

// :> (merge) fusionne les 8 sorties en 2 (somme par paire)
bus_stereo = quatre_canaux :> _, _;

// : (séquentiel) chaîne le bus avec le volume master
// *(0.25) normalise la somme des 4 canaux
sortie = bus_stereo : *(master * 0.25), *(master * 0.25);

process = sortie;
```

**Diagramme du circuit** :

```text
  entrée 1 ── canal(vol1,pan1) ── G1,D1 ──┐
  entrée 2 ── canal(vol2,pan2) ── G2,D2 ──┤
  entrée 3 ── canal(vol3,pan3) ── G3,D3 ──┼─ :> ─ G,D ─ *(master*0.25) ─ sortie
  entrée 4 ── canal(vol4,pan4) ── G4,D4 ──┘
```

Les 5 opérateurs sont utilisés : `:` dans `canal()` et pour chaîner bus → master, `,` pour les 4 canaux en parallèle, `<:` pour le split mono → stéréo, `:>` pour la fusion 8 → 2, et `~` en interne par les bibliothèques Faust.

---

## Navigation

← Fiche précédente : **[01 - Syntaxe et sémantique de base](01-syntaxe-semantique-base.md)**

→ Fiche suivante : **[03 - Interfaces utilisateur (UI)](03-interfaces-utilisateur-ui.md)**
