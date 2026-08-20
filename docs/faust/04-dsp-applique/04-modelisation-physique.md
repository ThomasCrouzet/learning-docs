---
tags:
  - Faust
  - Avancé
  - Concept
description: "Modélisation physique en Faust - Karplus-Strong, waveguides numériques, synthèse modale et bibliothèque pm"
estimated_time: "65 min"
fiche_number: 4
total_fiches: 6
cursus: "Phase 4 - DSP appliqué"
---

# 04 - Modélisation physique

> **En bref** : À la fin de cette fiche, tu sauras implémenter l'algorithme Karplus-Strong, comprendre les waveguides numériques et utiliser la bibliothèque pm de Faust pour modéliser des instruments acoustiques. Lecture estimée : 65 min.


## Prérequis

- [Fiche 02 - Filtres](02-filtres.md) : passe-bas, passe-haut, résonant, biquad, FIR vs IIR
- [Fiche 04 - Synthèse sonore - théorie](../01-fondamentaux-acoustique/04-synthese-sonore-theorie.md) : synthèse additive, soustractive, FM, principe de génération de son

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter l'algorithme Karplus-Strong, comprendre les waveguides numériques et utiliser la bibliothèque pm de Faust pour modéliser des instruments acoustiques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la modélisation physique ?

**Définition** : La modélisation physique est une technique de synthèse sonore qui simule les lois physiques d'un instrument de musique (vibration d'une corde, propagation d'une onde dans un tuyau, résonance d'une membrane) plutôt que de reproduire directement le résultat sonore. Le son émerge naturellement de la simulation, comme il émerge naturellement de l'instrument réel.

**Le problème que la modélisation physique résout** :

Sans modélisation physique, voici les problèmes rencontrés :

1. **Synthèse statique** : la synthèse soustractive ou FM produit des sons "figés". L'évolution naturelle du timbre d'un instrument acoustique est difficile à reproduire avec des oscillateurs et des enveloppes
2. **Manque d'expressivité** : un échantillon (sample) sonne toujours pareil. Un vrai instrument réagit à la force du jeu, à la position de l'archet, au souffle du musicien
3. **Paramètres abstraits** : dans un synthétiseur classique, les paramètres (cutoff, ratio FM) n'ont pas de lien avec le monde physique

**Comment la modélisation physique résout ces problèmes** :

| Problème | Solution apportée par la modélisation physique |
| -------- | ----------------------------------------------- |
| Synthèse statique | La simulation calcule le son instant par instant : le timbre évolue naturellement |
| Manque d'expressivité | Les paramètres physiques (force, position, souffle) modifient le son en temps réel |
| Paramètres abstraits | Les paramètres ont un sens physique direct : longueur de corde, diamètre du tuyau |

**Analogie concrète** : Imagine que tu veux reproduire le son d'une cloche. Avec la synthèse classique, tu enregistres le son et tu le rejoues (sampling), ou tu empiles des sinusoïdes pour imiter le résultat (synthèse additive).
Avec la modélisation physique, tu simules un marteau qui frappe un objet métallique : tu définis la masse du marteau, la forme de la cloche, les propriétés du métal.
Le son apparaît tout seul, comme conséquence de la simulation. Si tu changes la taille de la cloche, le son change naturellement.

**Ce que la modélisation physique n'est PAS** :

- La modélisation physique n'est pas du sampling. Le sampling reproduit un résultat sonore figé. La modélisation physique calcule le son en temps réel à partir d'équations.
- La modélisation physique n'est pas une simulation visuelle 3D. On simule uniquement les phénomènes acoustiques pertinents, pas la géométrie complète.

**Comparaison modélisation physique vs synthèse classique** :

| Modélisation physique | Synthèse classique (soustractive, FM, additive) |
| --------------------- | ------------------------------------------------ |
| Simule les causes (physique de l'instrument) | Imite les effets (forme du son) |
| Paramètres physiques (longueur, tension, souffle) | Paramètres abstraits (cutoff, ratio, index) |
| Son réaliste et expressif | Son synthétique, qui peut sonner artificiel |
| Coût CPU plus élevé | Coût CPU plus faible dans la majorité des cas |

---

### Qu'est-ce que l'algorithme Karplus-Strong ?

**Définition** : L'algorithme Karplus-Strong est la méthode de modélisation physique la plus simple. Il simule le son d'une corde pincée : on remplit une ligne de retard (delay line) avec du bruit, puis on fait circuler ce bruit en boucle à travers un filtre passe-bas. Le delay détermine la hauteur de la note et le filtre simule l'amortissement naturel de la corde.

**Le problème que Karplus-Strong résout** :

Sans Karplus-Strong, voici les problèmes rencontrés :

1. **Corde pincée irréaliste** : reproduire le son d'une guitare avec des oscillateurs classiques donne un résultat plat et artificiel
2. **Complexité excessive** : une simulation physique complète d'une corde nécessite de résoudre des équations aux dérivées partielles, ce qui est lourd en calcul
3. **Manque de variété naturelle** : chaque "pincement" d'une vraie corde est légèrement différent. Reproduire cette variété nécessite des dizaines de samples par note

**Comment Karplus-Strong résout ces problèmes** :

| Problème | Solution apportée par Karplus-Strong |
| -------- | ------------------------------------ |
| Corde pincée irréaliste | Le bruit initial contient toutes les harmoniques. Le filtre dans la boucle atténue progressivement les aigus |
| Complexité excessive | L'algorithme utilise seulement un buffer, un filtre et une boucle de retour |
| Manque de variété naturelle | Le bruit initial est aléatoire : chaque pincement produit un son légèrement différent |

**Analogie concrète** : Imagine que tu secoues une boîte remplie de billes (le bruit initial). Le son est chaotique. Les parois absorbent un peu d'énergie à chaque rebond (le filtre). Progressivement, les rebonds rapides (les aigus) disparaissent en premier, et il ne reste que les rebonds lents et réguliers (la fondamentale). C'est exactement Karplus-Strong.

**Ce que Karplus-Strong n'est PAS** :

- Karplus-Strong n'est pas une synthèse soustractive. En soustractive, un oscillateur génère un signal en continu. En Karplus-Strong, le signal est généré une seule fois puis décroît par recirculation.
- Karplus-Strong n'est pas limité aux cordes pincées. Avec des variations (type d'excitation, filtres différents), on peut simuler des percussions ou des sons métalliques.

#### Fonctionnement de l'algorithme

L'algorithme repose sur quatre éléments :

1. **L'excitation** : une courte impulsion de bruit blanc qui simule le "pincement" de la corde.
2. **La ligne de retard (delay line)** : un buffer circulaire de taille N échantillons qui détermine la fréquence fondamentale.
3. **Le filtre passe-bas** : une moyenne de deux échantillons consécutifs qui atténue les hautes fréquences à chaque passage.
4. **La boucle de rétroaction (feedback)** : la sortie du filtre est réinjectée dans le delay.

**Calcul de la taille du delay** :

```text
N = sample_rate / fréquence_désirée

Exemples à 44 100 Hz :
- La2 (110 Hz) → N = 44100 / 110 = 401 échantillons
- La4 (440 Hz) → N = 44100 / 440 = 100,2 ≈ 100 échantillons
```

**Le filtre Karplus-Strong original** :

```text
y(n) = (x(n) + x(n-1)) / 2

Ce filtre est un FIR d'ordre 1. Il atténue les fréquences hautes
plus rapidement que les fréquences basses.
```

```text
Schéma du signal Karplus-Strong :

Bruit initial ──┐
                 │
                 ▼
         ┌──────────────┐
    ┌────│  Delay (N)   │◄──┐
    │    └──────────────┘   │
    │                       │
    ▼                       │
  Sortie ──► Filtre LP ─────┘
```

#### Évolution temporelle du son

```text
Instant 0 (excitation) :
  Le buffer est rempli de bruit blanc → spectre plat
  ████████████████████████████████

Après quelques cycles :
  Les hautes fréquences diminuent
  ████████████████████░░░░░░░░░░░

Après de nombreux cycles :
  Il ne reste que la fondamentale et les premières harmoniques
  ████████░░░░░░░░░░░░░░░░░░░░░░░

Après très longtemps :
  Le son s'éteint complètement
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

---

### Qu'est-ce qu'une waveguide numérique ?

**Définition** : Une waveguide numérique (digital waveguide) modélise la propagation d'ondes dans un milieu physique (corde, tuyau). Elle utilise deux lignes de retard : l'onde "aller" et l'onde "retour". Les extrémités sont modélisées par des terminaisons qui réfléchissent l'onde.

**Le problème que les waveguides numériques résolvent** :

Sans waveguides numériques, voici les problèmes rencontrés :

1. **Karplus-Strong trop simpliste** : une vraie corde a des ondes dans les deux sens qui se réfléchissent aux extrémités
2. **Interaction entre éléments impossible** : la corde interagit avec le chevalet, le chevalet avec la table d'harmonie. Sans modèle bidirectionnel, ces interactions ne sont pas simulées
3. **Instruments à vent impossibles** : un tuyau de clarinette a une extrémité fermée et une ouverte. L'onde se réfléchit différemment à chaque bout

**Comment les waveguides numériques résolvent ces problèmes** :

| Problème | Solution apportée par les waveguides |
| -------- | ------------------------------------ |
| Karplus-Strong trop simpliste | Deux delay lines capturent la physique complète de la propagation |
| Interaction entre éléments impossible | Les jonctions permettent de coupler plusieurs éléments |
| Instruments à vent impossibles | Les terminaisons modélisent les conditions aux limites (ouvert/fermé) |

**Analogie concrète** : Imagine une corde à sauter tenue par deux personnes. Quand une personne donne une impulsion, l'onde se propage jusqu'à l'autre bout, rebondit, et revient. La waveguide numérique modélise exactement cela : une ligne de retard pour l'onde aller, une autre pour l'onde retour, et des "personnes" aux extrémités qui réfléchissent l'onde.

**Comparaison Karplus-Strong vs waveguide numérique** :

| Karplus-Strong | Waveguide numérique |
| -------------- | ------------------- |
| 1 delay line | 2 delay lines (aller + retour) |
| Propagation unidirectionnelle | Propagation bidirectionnelle |
| Pas de terminaisons explicites | Terminaisons modélisées (ouvert/fermé) |
| Corde pincée uniquement | Cordes, tuyaux, barres, membranes |

#### Types de terminaisons

| Type | Réflexion | Exemple physique | Coefficient |
| ---- | --------- | ---------------- | ----------- |
| Fermée (rigide) | Totale, sans inversion | Sillet de guitare | +1 |
| Ouverte | Totale, avec inversion | Bout ouvert d'une flûte | -1 |
| Amortie | Partielle | Chevalet (transmet de l'énergie à la table) | entre -1 et +1 |

Le type de terminaison détermine quelles harmoniques sont présentes :

```text
Corde (deux extrémités fermées) :
  → Toutes les harmoniques (1f, 2f, 3f, 4f, 5f...)

Tuyau fermé-ouvert (clarinette) :
  → Uniquement les harmoniques impaires (1f, 3f, 5f, 7f...)

Tuyau ouvert-ouvert (flûte) :
  → Toutes les harmoniques (1f, 2f, 3f, 4f, 5f...)
```

---

### Qu'est-ce que la synthèse modale ?

**Définition** : La synthèse modale décompose la vibration d'un objet en ses modes propres. Chaque mode est une fréquence de résonance modélisée par un filtre résonant. L'excitation est envoyée à travers un banc de filtres résonants. Le son résultant est la somme des réponses de tous les modes.

**Le problème que la synthèse modale résout** :

Sans synthèse modale, voici les problèmes rencontrés :

1. **Sons inharmoniques impossibles** : les waveguides produisent des harmoniques régulières. Les objets rigides (cloches, barres) ont des partiels inharmoniques
2. **Résonances complexes difficiles** : un tambour ou un gong a de nombreuses résonances. Les modéliser avec des waveguides nécessiterait un réseau très complexe
3. **Contrôle des partiels limité** : avec une waveguide, il est difficile de contrôler individuellement chaque partiel

**Comment la synthèse modale résout ces problèmes** :

| Problème | Solution apportée par la synthèse modale |
| -------- | ---------------------------------------- |
| Sons inharmoniques impossibles | Chaque mode a sa propre fréquence, pas nécessairement un multiple entier |
| Résonances complexes difficiles | Chaque mode est un filtre indépendant : on empile autant de modes qu'on veut |
| Contrôle des partiels limité | Chaque mode a trois paramètres : fréquence, amplitude, temps de décroissance |

**Analogie concrète** : Imagine un xylophone. Chaque lame vibre à plusieurs fréquences (les modes) qui ne sont pas des multiples entiers de la fondamentale. La synthèse modale modélise un ensemble de "lames" virtuelles, chacune vibrant à sa fréquence propre, dont les vibrations s'additionnent pour former le son final.

**Comparaison waveguide vs synthèse modale** :

| Waveguide numérique | Synthèse modale |
| -------------------- | --------------- |
| Modélise la propagation d'ondes | Modélise les fréquences de résonance |
| Idéale pour cordes et tuyaux | Idéale pour objets rigides (cloches, barres, plaques) |
| Harmoniques régulières | Partiels libres (harmoniques ou non) |
| Sons entretenus possibles | Sons percussifs principalement |

#### Exemples de modes pour des objets réels

```text
Barre métallique (xylophone) - rapports de fréquence :
Mode 1 :  1,000 × f₁   (fondamentale)
Mode 2 :  2,756 × f₁   (pas un multiple entier)
Mode 3 :  5,404 × f₁
Mode 4 :  8,933 × f₁

Corde (harmoniques régulières, pour comparaison) :
Mode 1 :  1 × f₁
Mode 2 :  2 × f₁
Mode 3 :  3 × f₁
Mode 4 :  4 × f₁
```

---

### Qu'est-ce que la bibliothèque `pm` de Faust ?

**Définition** : La bibliothèque `pm` (physical modeling) de Faust fournit des composants prêts à l'emploi pour construire des instruments par modélisation physique : excitateurs (pincement, souffle, frappe), résonateurs (tube, corde), terminaisons et fonctions d'assemblage.

**Le problème que la bibliothèque pm résout** :

Sans la bibliothèque pm, voici les problèmes rencontrés :

1. **Tout recoder à chaque fois** : implémenter une waveguide depuis zéro est long et source d'erreurs
2. **Expertise en physique nécessaire** : calculer les bons coefficients demande des connaissances approfondies
3. **Pas de standard** : chaque développeur invente sa propre API

**Comment la bibliothèque pm résout ces problèmes** :

| Problème | Solution apportée par pm |
| -------- | ------------------------ |
| Tout recoder à chaque fois | Les composants sont prêts à l'emploi : tu les assembles |
| Expertise en physique nécessaire | Les coefficients physiques sont encapsulés dans les fonctions |
| Pas de standard | pm fournit une API cohérente et documentée |

**Analogie concrète** : La bibliothèque pm est comme un jeu de construction (type LEGO Technic). Tu as des pièces standard : des tuyaux, des cordes, des marteaux. Tu les assembles pour créer ton instrument sans coder les delay lines ni calculer les coefficients acoustiques.

#### Les fonctions principales de pm

**Assemblage** :

| Fonction | Rôle |
| -------- | ---- |
| `pm.chain(A : B : C)` | Connecte des éléments bas niveau en série |
| `pm.lTermination(t, c)` | Terminaison gauche |
| `pm.rTermination(t, c)` | Terminaison droite |

**Modèles complets de cordes** :

| Fonction | Rôle | Instrument typique |
| -------- | ---- | ------------------ |
| `pm.idealString(length, pluckPosition, excitation)` | Corde idéale (terminaisons rigides incluses) | Harpe |
| `pm.nylonString(...)` | Corde nylon complète | Guitare classique |
| `pm.steelString(...)` | Corde acier complète | Guitare folk |

**Segments de résonateur (à assembler avec `pm.chain`)** :

| Fonction | Rôle | Instrument typique |
| -------- | ---- | ------------------ |
| `pm.openTube(maxLength, length)` | Segment de tube ouvert | Flûte, clarinette |

**Excitateurs** :

| Fonction | Rôle | Action simulée |
| -------- | ---- | -------------- |
| `pm.pluckString(length, cutoff, maxFreq, sharpness, gain, trigger)` | Excitation par pincement | Pincer une corde |
| `pm.strike(exPos, sharpness, gain, trigger)` | Excitation par frappe | Frapper un objet |
| `pm.blower(pressure, ...)` | Excitation par souffle | Souffler dans un tube |

**Modèles d'instruments complets (haut niveau)** :

| Fonction | Rôle |
| -------- | ---- |
| `pm.clarinetModel(length, pressure, reedStiffness, bellOpening)` | Clarinette complète |
| `pm.clarinet_ui` | Clarinette avec interface intégrée |

> **Note** : `physmodels.lib` distingue les segments bas niveau (à câbler soi-même
> avec `pm.chain` et des terminaisons) des modèles complets (`pm.idealString`,
> `pm.nylonString`, `pm.clarinetModel`) qui incluent déjà leurs terminaisons. Les
> étapes 3 et 4 utilisent ces modèles complets, plus simples et plus fiables.

---

## Étapes Pratiques

### Étape 1 : Implémenter Karplus-Strong from scratch

On construit l'algorithme en partant de zéro. Crée un fichier `karplus_basic.dsp` :

```faust
import("stdfaust.lib");

freq = hslider("freq", 220, 50, 1000, 0.1);
gate = button("gate");

// Excitation : bruit blanc pendant un cycle de delay
// en.ar(attack, release, gate) génère une enveloppe courte
// La durée du burst = 1 période de la fréquence fondamentale
burstDuration = 1.0 / freq;
excitation = no.noise * en.ar(0.001, burstDuration, gate);

// Delay compensé (-0.5 pour le retard du filtre moyenneur)
delayLength = ma.SR / freq - 0.5;

// Filtre passe-bas moyenneur : y(n) = (x(n) + x(n-1)) / 2
lowpass = _ <: (_, _') :> _ * 0.5;

// Boucle Karplus-Strong : excitation + feedback(delay + filtre)
process = excitation : + ~ (de.fdelay(4096, delayLength) : lowpass);
```

Compile et teste :

```bash
faust2caqt karplus_basic.dsp
```

**Résultat attendu** :

```text
Quand tu appuies sur "gate" :
- Un son de corde pincée riche en harmoniques au début
- Les aigus disparaissent progressivement
- Le son s'éteint naturellement après quelques secondes
- Chaque appui produit un son légèrement différent (bruit aléatoire)
```

---

### Étape 2 : Ajouter des contrôles (fréquence, amortissement, excitation)

On améliore l'algorithme avec des contrôles. Crée un fichier `karplus_controls.dsp` :

```faust
import("stdfaust.lib");

// Contrôles utilisateur
freq = hslider("[1]freq", 220, 50, 1000, 0.1);
damping = hslider("[2]damping", 0.1, 0, 1, 0.01);
brightness = hslider("[3]brightness", 0.5, 0, 1, 0.01);
gain = hslider("[4]gain", 0.8, 0, 1, 0.01);
gate = button("[5]gate");

// Excitation : 2 ms de bruit blanc au front montant de gate
excitSamples = int(0.002 * ma.SR);
counter = ba.countup(excitSamples, gate);
excitation = no.noise * (counter < excitSamples);

// Delay et filtre paramétrique
delayLength = ma.SR / freq - 1;
// Interpole entre signal direct (brillant) et filtré (mat)
feedbackFilter(x) = x * brightness + x' * (1 - brightness);
feedbackGain = 1.0 - damping * 0.01;

// Assemblage
process = excitation : + ~ (de.fdelay(4096, delayLength)
    : feedbackFilter : *(feedbackGain)) : *(gain);
```

**Résultat attendu** :

```text
- damping contrôle la durée (0 = long, 1 = très court)
- brightness contrôle la brillance (0 = mat, 1 = brillant)
- freq change la hauteur en temps réel
```

---

### Étape 3 : Créer une corde pincée avec la bibliothèque pm

On utilise la bibliothèque `pm` pour construire le même type de son avec des composants de plus haut niveau. Crée un fichier `pm_string.dsp` :

```faust
import("stdfaust.lib");

freq = hslider("[1]freq", 220, 50, 1000, 0.1);
gain = hslider("[2]gain", 0.8, 0, 1, 0.01);
// Position du pincement : 0.5 = milieu (son doux), 0.1 = bord (son brillant)
pluckPosition = hslider("[3]pluck position", 0.3, 0.01, 0.99, 0.01);
gate = button("[4]gate");

// pm.f2l convertit une fréquence en longueur de delay (en mètres)
stringLength = pm.f2l(freq);

// L'excitation est une impulsion brève au front montant de gate
// ba.impulsify transforme le maintien du bouton en une seule impulsion
excitation = gate : ba.impulsify * gain;

// pm.idealString est un modèle de corde COMPLET : il inclut déjà ses deux
// terminaisons rigides. Sa signature réelle est :
//   pm.idealString(length, pluckPosition, excitation)
// On lui passe directement les 3 arguments, sans pm.chain ni terminaisons
// manuelles (ces dernières sont internes au modèle).
process = pm.idealString(stringLength, pluckPosition, excitation);
```

**Résultat attendu** :

```text
- Son réaliste de corde pincée
- pluck position 0.5 → son doux (type harpe)
- pluck position 0.1 → son brillant (type guitare près du chevalet)
```

La documentation officielle de `physmodels.lib` précise que `pm.idealString` a des terminaisons rigides : la corde ne s'amortit pas toute seule (elle "ring forever"). Coupe le son avec `gate` ou passe à `pm.ks` / `pm.nylonString` si tu veux un amortissement naturel.

---

### Étape 4 : Créer un instrument à vent simple avec pm

On modélise une clarinette (tube fermé-ouvert, harmoniques impaires) à l'aide du modèle haut niveau `pm.clarinetModel`. Crée un fichier `pm_wind.dsp` :

```faust
import("stdfaust.lib");

freq = hslider("[1]freq", 220, 50, 2000, 0.1);
pressure = hslider("[2]pressure", 0.5, 0, 1, 0.01);
// Rigidité de l'anche : plus la valeur est haute, plus le timbre est brillant
reedStiffness = hslider("[3]reed stiffness", 0.5, 0, 1, 0.01);
// Ouverture du pavillon : influence la brillance et la projection du son
bellOpening = hslider("[4]bell opening", 0.5, 0, 1, 0.01);
gain = hslider("[5]gain", 0.5, 0, 1, 0.01);
gate = button("[6]gate");

// pm.f2l convertit la fréquence en longueur de tube (en mètres)
tubeLength = pm.f2l(freq);

// pm.clarinetModel est un modèle complet de clarinette. Signature réelle :
//   pm.clarinetModel(tubeLength, pressure, reedStiffness, bellOpening)
// La pression est l'excitation par souffle : on la coupe avec gate
// pour que le son ne joue que quand le bouton est maintenu.
process = pm.clarinetModel(tubeLength, pressure * gate, reedStiffness, bellOpening) * gain;
```

**Résultat attendu** :

```text
- Son continu tant que "gate" est maintenu
- Caractère "boisé" (harmoniques impaires uniquement)
- pressure modifie le volume et le timbre
- Le son s'éteint quand tu relâches "gate"
```

---

### Étape 5 : Rendre l'instrument polyphonique

On transforme le Karplus-Strong en instrument polyphonique MIDI. Crée un fichier `karplus_poly.dsp` :

```faust
import("stdfaust.lib");

// Faust reconnaît "freq", "gain" et "gate" comme paramètres MIDI
freq = hslider("freq", 440, 50, 2000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Contrôles globaux (partagés entre toutes les voix)
damping = hslider("[1]damping", 0.05, 0, 0.5, 0.01);
brightness = hslider("[2]brightness", 0.5, 0, 1, 0.01);

// Excitation proportionnelle à la vélocité
excitDur = 0.001 + gain * 0.003;
excitSamples = int(excitDur * ma.SR);
counter = ba.countup(excitSamples, gate);
excitation = no.noise * (counter < excitSamples) * gain;

// Delay et filtre
delayLength = ma.SR / freq - 1;
feedbackFilter(x) = x * brightness + x' * (1 - brightness);
// Le feedback diminue quand la note est relâchée (gate = 0)
feedbackGain = 1.0 - damping - (1 - gate) * 0.005;

process = excitation : + ~ (de.fdelay(4096, delayLength)
    : feedbackFilter : *(feedbackGain));
```

Compile avec la polyphonie activée :

```bash
faust2caqt -nvoices 6 -midi karplus_poly.dsp
```

**Résultat attendu** :

```text
- L'instrument répond au MIDI (note on/off, vélocité)
- Jusqu'à 6 notes simultanées
- Vélocité faible → son doux, vélocité forte → son brillant
- Le son s'éteint progressivement au note off
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust2caqt fichier.dsp` | Compiler pour macOS avec interface graphique |
| `faust2jaqt fichier.dsp` | Compiler pour Linux avec JACK |
| `faust2caqt -nvoices N -midi fichier.dsp` | Compiler avec polyphonie et MIDI |
| `pm.f2l(freq)` | Convertir une fréquence en longueur de delay pour pm |
| `de.fdelay(maxDelay, length)` | Delay fractionnaire (précision sub-échantillon) |
| `no.noise` | Générateur de bruit blanc |
| `ba.impulsify` | Transforme un signal en impulsion au front montant |

---

## Pièges Fréquents

### Piège 1 : Oublier de compenser le retard du filtre

**Problème** : Le filtre passe-bas dans la boucle ajoute environ 0,5 échantillon de retard. Sans compensation, la fréquence est légèrement trop basse.

**Solution** :

```faust
// Sans compensation (fréquence fausse)
delayLength = ma.SR / freq;

// Avec compensation (fréquence correcte)
delayLength = ma.SR / freq - 0.5;
```

---

### Piège 2 : Feedback trop élevé = son qui ne s'éteint jamais

**Problème** : Si le feedback atteint ou dépasse 1.0, le son ne décroît jamais ou sature.

**Solution** : Toujours garder le feedback strictement inférieur à 1.0 :

```faust
// Sûr : feedback contrôlé par un paramètre borné
feedbackGain = hslider("feedback", 0.998, 0.9, 0.999, 0.001);
```

---

### Piège 3 : Taille de delay trop petite pour les basses fréquences

**Problème** : `de.fdelay(maxDelay, ...)` a une taille maximale fixée. Si la fréquence est trop basse, le delay dépasse cette taille.

**Solution** : Utiliser une valeur de maxDelay suffisante :

```faust
// 4096 couvre jusqu'à 44100/4096 ≈ 10.8 Hz (largement suffisant)
de.fdelay(4096, delayLength)
```

---

### Piège 4 : Confondre excitation ponctuelle et continue

**Problème** : Envoyer du bruit en continu produit du bruit permanent, pas un son de corde.

**Solution** : L'excitation doit être une impulsion courte :

```faust
// Incorrect : bruit continu
excitation = no.noise * gate;

// Correct : impulsion de quelques millisecondes
excitSamples = int(0.002 * ma.SR);
counter = ba.countup(excitSamples, gate);
excitation = no.noise * (counter < excitSamples);
```

---

### Piège 5 : Ne pas utiliser de delay fractionnaire

**Problème** : Arrondir la taille du delay à un entier désaccorde la note.

**Solution** : Utiliser `de.fdelay` qui interpole les longueurs fractionnaires :

```faust
// Incorrect : delay entier (désaccordé)
de.delay(4096, int(ma.SR / freq))

// Correct : delay fractionnaire (précis)
de.fdelay(4096, ma.SR / freq)
```

---

## Checklist de Validation

- [ ] Je sais expliquer le principe de la modélisation physique (simuler les causes, pas les effets)
- [ ] Je sais décrire les 4 éléments de Karplus-Strong (bruit, delay, filtre, feedback)
- [ ] Je sais calculer la taille du delay pour une fréquence donnée (N = SR / freq)
- [ ] Je comprends pourquoi le filtre passe-bas simule l'amortissement de la corde
- [ ] Je sais expliquer la différence entre Karplus-Strong et une waveguide bidirectionnelle
- [ ] Je connais les types de terminaisons (ouverte, fermée, amortie) et leur effet sur les harmoniques
- [ ] Je sais expliquer la synthèse modale et quand l'utiliser (objets rigides, partiels inharmoniques)
- [ ] Je sais utiliser les modèles complets `pm.idealString` et `pm.clarinetModel`
- [ ] Je sais utiliser les excitateurs `pm.pluckString`, `pm.strike` et `pm.blower`
- [ ] Je sais rendre un instrument polyphonique avec `-nvoices` et les variables `freq`, `gain`, `gate`

---

## Exercice Pratique

**Énoncé** : Crée une guitare virtuelle à 6 cordes. Chaque corde est un Karplus-Strong avec sa propre fréquence fondamentale, déclenchée par un bouton dédié :

| Corde | Note | Fréquence (Hz) |
| ----- | ---- | --------------- |
| 6 (la plus grave) | Mi2 (E2) | 82,41 |
| 5 | La2 (A2) | 110,00 |
| 4 | Ré3 (D3) | 146,83 |
| 3 | Sol3 (G3) | 196,00 |
| 2 | Si3 (B3) | 246,94 |
| 1 (la plus aiguë) | Mi4 (E4) | 329,63 |

Ajoute un contrôle de brillance global (cutoff du filtre dans la boucle).

**Indications** :

- Crée une fonction `string(freq, gate)` qui encapsule Karplus-Strong pour une corde
- Utilise 6 boutons distincts pour déclencher chaque corde
- Additionne les 6 sorties et divise par 6 pour éviter la saturation
- Utilise `de.fdelay` pour la précision des fréquences

**Résultat attendu** :

- 6 boutons dans l'interface, un par corde
- Un slider "brightness" global
- Les 6 cordes peuvent sonner simultanément

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
import("stdfaust.lib");

brightness = hslider("[0]brightness", 0.5, 0, 1, 0.01);
masterGain = hslider("[1]master gain", 0.8, 0, 1, 0.01);

// Un bouton par corde
gate6 = button("[2]corde 6 (Mi2)");
gate5 = button("[3]corde 5 (La2)");
gate4 = button("[4]corde 4 (Re3)");
gate3 = button("[5]corde 3 (Sol3)");
gate2 = button("[6]corde 2 (Si3)");
gate1 = button("[7]corde 1 (Mi4)");

// Fonction Karplus-Strong pour une corde
string(freq, gate) = excitation : + ~ (delay : filter)
with {
    excitSamples = int(0.002 * ma.SR);
    counter = ba.countup(excitSamples, gate);
    excitation = no.noise * (counter < excitSamples) * 0.5;

    // Delay fractionnaire compensé (-0.5 pour le filtre)
    delayLength = ma.SR / freq - 0.5;
    delay = de.fdelay(4096, delayLength);

    // Filtre contrôlé par brightness (variable globale capturée)
    filter(x) = x * brightness + x' * (1 - brightness);
};

// Les 6 cordes
corde6 = string(82.41, gate6);   // Mi2 (E2)
corde5 = string(110.00, gate5);  // La2 (A2)
corde4 = string(146.83, gate4);  // Ré3 (D3)
corde3 = string(196.00, gate3);  // Sol3 (G3)
corde2 = string(246.94, gate2);  // Si3 (B3)
corde1 = string(329.63, gate1);  // Mi4 (E4)

// Mixage normalisé
process = (corde6 + corde5 + corde4 + corde3 + corde2 + corde1)
    / 6 * masterGain;
```

**Compilation** :

```bash
faust2caqt guitare_6cordes.dsp
```

**Vérification** :

```text
- L'interface affiche 1 slider brightness, 1 slider master gain, 6 boutons
- "corde 6 (Mi2)" → son grave à 82,41 Hz
- "corde 1 (Mi4)" → son aigu à 329,63 Hz
- Plusieurs boutons en même temps → les cordes sonnent simultanément
- brightness vers 0 → son mat, vers 1 → son brillant
```

**Points clés de la solution** :

- `string(freq, gate)` encapsule tout l'algorithme. On la réutilise 6 fois.
- Le bloc `with { ... }` garde les variables locales, évitant les conflits de noms.
- La division par 6 empêche la saturation quand toutes les cordes jouent.
- `brightness` global est capturé par toutes les instances de `string`.

---

## Navigation

← Fiche précédente : **[03 - Effets audio](03-effets-audio.md)**

→ Fiche suivante : **[05 - Bibliothèques Faust](05-bibliotheques-faust.md)**
