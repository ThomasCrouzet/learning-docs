---
tags:
  - Faust
  - Intermédiaire
  - Pratique
description: "Anti-aliasing et oscillateurs band-limited en Faust - repliement spectral, Nyquist, os.sawtooth vs os.lf_saw, sawN, PolyBLEP, compromis CPU/qualité"
estimated_time: "65 min"
fiche_number: 6
total_fiches: 6
cursus: "Phase 4 - DSP appliqué"
---

# 06 - Anti-aliasing et oscillateurs band-limited

> **En bref** : À la fin de cette fiche, tu sauras pourquoi un oscillateur naïf produit de l'aliasing, et tu sauras choisir entre les oscillateurs band-limited (`os.sawtooth`, `os.square`, `os.triangle`), les oscillateurs LFO (`os.lf_saw`, `os.lf_squarewave`, `os.lf_triangle`) et la table sinus (`os.osc`) selon le compromis CPU/qualité. Lecture estimée : 65 min.


## Prérequis

- [Fiche 01 - Oscillateurs et synthèse](01-oscillateurs-synthese.md) : les quatre formes d'onde, `os.osc`, `os.sawtooth`, modulations
- [Fiche 05 - Bibliothèques Faust](05-bibliotheques-faust.md) : préfixes de bibliothèque, différence audio vs LFO, `ma.SR`
- Connaissance de base de la fréquence d'échantillonnage (Hz, sample rate). Si tu ne connais pas ce terme, il est expliqué ci-dessous.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le phénomène d'aliasing, identifier quand il se produit, et choisir l'oscillateur Faust adapté (band-limited, LFO ou table sinus) en connaissant son coût CPU.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la fréquence de Nyquist ?

**Définition** : La fréquence de Nyquist est la moitié de la fréquence d'échantillonnage. C'est la fréquence maximale qu'un système numérique peut représenter sans erreur. À une fréquence d'échantillonnage de 48000 Hz, la fréquence de Nyquist vaut 24000 Hz.

$$f_{Nyquist} = \frac{f_{e}}{2}$$

Avec $f_e$ la fréquence d'échantillonnage (sample rate), notée `ma.SR` en Faust.

**Le problème que la limite de Nyquist met en évidence** :

Sans la connaissance de cette limite, voici les problèmes rencontrés :

1. **Fréquences invisibles** : un système numérique ne peut pas distinguer une fréquence au-dessus de Nyquist d'une autre fréquence plus basse
2. **Choix de fréquence d'échantillonnage** : on ne sait pas pourquoi le standard audio est 44100 Hz ou 48000 Hz
3. **Sons parasites inexpliqués** : sans la limite de Nyquist, on ne comprend pas d'où viennent certains grésillements

**Analogie concrète** : Imagine une roue de chariot filmée par une caméra. La caméra prend 24 images par seconde. Si la roue tourne lentement, la vidéo montre le bon sens de rotation. Mais si la roue tourne très vite (plus vite que la caméra ne capture), la vidéo montre la roue qui tourne à l'envers, ou immobile. La caméra (l'échantillonnage) ne peut pas "voir" une rotation plus rapide que la moitié de sa cadence. C'est exactement la limite de Nyquist.

**Pourquoi le standard audio est à 44100 ou 48000 Hz** :

L'oreille humaine entend jusqu'à environ 20000 Hz. Pour représenter sans erreur toutes les fréquences audibles, il faut une fréquence d'échantillonnage d'au moins 40000 Hz (deux fois 20000). Les standards 44100 Hz (CD) et 48000 Hz (vidéo, audio pro) laissent une marge confortable au-dessus de 20000 Hz.

---

### Qu'est-ce que l'aliasing (repliement spectral) ?

**Définition** : L'aliasing, ou repliement spectral, est l'apparition de fréquences parasites quand un signal contient des composantes au-dessus de la fréquence de Nyquist. Ces fréquences trop hautes sont "repliées" vers le bas du spectre et deviennent audibles à une fréquence incorrecte.

**Le problème que l'aliasing pose** :

Sans gestion de l'aliasing, voici les problèmes rencontrés :

1. **Sons métalliques non désirés** : des fréquences parasites apparaissent et ne sont pas musicalement liées à la note jouée
2. **Inharmonicité** : les fréquences repliées tombent à des positions arbitraires, ce qui détruit la cohérence harmonique du son
3. **Dégradation dans les aigus** : plus la note est aiguë, plus ses harmoniques dépassent Nyquist, et plus l'aliasing est audible

**Comment l'aliasing apparaît** :

| Situation | Conséquence |
| --------- | ----------- |
| Une harmonique tombe juste sous Nyquist | Aucun repliement, le son est correct |
| Une harmonique dépasse Nyquist | Elle est repliée à `f_e - f` et devient parasite |
| Une note aiguë avec beaucoup d'harmoniques | De nombreuses harmoniques se replient, le son devient sale |

**Formule du repliement** : une fréquence $f$ au-dessus de Nyquist se replie à la fréquence :

$$f_{alias} = f_{e} - f \quad \text{(pour } f_{Nyquist} < f < f_e\text{)}$$

**Exemple chiffré** : à 48000 Hz, Nyquist vaut 24000 Hz. Une dent de scie naïve à 5000 Hz contient les harmoniques 5000, 10000, 15000, 20000, 25000, 30000... L'harmonique à 25000 Hz dépasse Nyquist : elle se replie à `48000 - 25000 = 23000 Hz`. L'harmonique à 30000 Hz se replie à `48000 - 30000 = 18000 Hz`. Ces deux fréquences (23000 et 18000 Hz) ne sont pas des multiples de 5000. Elles sonnent faux.

**Analogie concrète** : L'aliasing fonctionne comme un escalier vu de loin. Si tu dessines une diagonale parfaite (le signal continu) mais que tu n'as que des pixels carrés pour la représenter (l'échantillonnage), tu obtiens un escalier en marches (le signal échantillonné). Quand la diagonale est trop raide pour la grille de pixels, les marches forment un motif visuel parasite (le crénelage). En audio, ce crénelage devient des fréquences parasites audibles.

**Ce que l'aliasing n'est PAS** :

- L'aliasing n'est pas du bruit blanc. Le bruit blanc est aléatoire. L'aliasing produit des fréquences précises, mais placées au mauvais endroit.
- L'aliasing n'est pas un défaut de Faust. C'est une conséquence mathématique de l'échantillonnage. Tout système numérique y est confronté.

---

### Qu'est-ce qu'un oscillateur trivial (naïf) ?

**Définition** : Un oscillateur trivial, ou naïf, est un oscillateur qui génère une forme d'onde par calcul direct, sans précaution contre l'aliasing. Par exemple, une dent de scie triviale incrémente une valeur de 0 à 1 puis revient brutalement à 0. Cette discontinuité brutale contient des harmoniques infinies, dont beaucoup dépassent Nyquist.

**Le problème des oscillateurs triviaux** :

1. **Harmoniques infinies** : une transition verticale (un saut instantané) contient théoriquement toutes les fréquences jusqu'à l'infini
2. **Aliasing garanti** : toutes les harmoniques au-dessus de Nyquist se replient
3. **Inutilisable en audio** : pour des notes aiguës, le son devient désagréable

**Pourquoi les formes d'onde "à angles" posent problème** :

| Forme d'onde | Caractéristique géométrique | Contenu harmonique |
| ------------ | --------------------------- | ------------------ |
| Sinusoïde | Courbe lisse, aucun angle | Une seule fréquence (pas d'aliasing possible) |
| Triangle | Angles "doux" (pente change) | Harmoniques décroissant en 1/n² (peu d'aliasing) |
| Carrée | Sauts verticaux | Harmoniques décroissant en 1/n (aliasing modéré) |
| Dent de scie | Saut vertical brutal | Harmoniques décroissant en 1/n (aliasing fort) |

**Analogie concrète** : Un oscillateur trivial est comme une voiture qui passe d'arrêt à pleine vitesse instantanément. Physiquement impossible sans casser le moteur. En audio, le "saut" instantané de la dent de scie est tout aussi violent : il génère un contenu spectral que le système numérique ne peut pas représenter proprement, d'où les fréquences parasites.

---

### Qu'est-ce qu'un oscillateur band-limited ?

**Définition** : Un oscillateur band-limited (à bande limitée) est un oscillateur conçu pour ne produire aucune harmonique au-dessus de la fréquence de Nyquist. Il "lisse" les transitions brutales pour supprimer les fréquences qui causeraient de l'aliasing. En Faust, `os.sawtooth`, `os.square` et `os.triangle` sont band-limited (famille DPW : `saw2`, `squareN(2)`, `triangleN(2)`).

**Le problème que les oscillateurs band-limited résolvent** :

1. **Aliasing audible** : ils suppriment les harmoniques problématiques avant qu'elles ne se replient
2. **Qualité dans les aigus** : le son reste propre même pour des notes très aiguës
3. **Complexité d'implémentation** : tu n'as pas à coder toi-même les techniques anti-aliasing

**Comment les oscillateurs band-limited résolvent ces problèmes** :

| Problème | Solution apportée par les oscillateurs band-limited |
| -------- | --------------------------------------------------- |
| Aliasing audible | Les harmoniques au-dessus de Nyquist sont supprimées à la source |
| Qualité dans les aigus | La forme d'onde reste musicale sur toute la tessiture |
| Complexité d'implémentation | Une seule fonction (`os.sawtooth(freq)`) gère tout |

**Analogie concrète** : Un oscillateur band-limited est comme un sculpteur prudent qui arrondit légèrement les angles trop vifs d'une statue avant de la transporter. La statue garde sa forme générale (le timbre), mais les arêtes les plus fines (les harmoniques trop hautes) qui se casseraient au transport (qui causeraient l'aliasing) sont adoucies à l'avance.

**Ce qu'un oscillateur band-limited n'est PAS** :

- Un oscillateur band-limited n'est pas un oscillateur filtré après coup. Le filtrage a posteriori ne peut pas retirer l'aliasing une fois qu'il est replié. La limitation de bande se fait pendant la génération de la forme d'onde.
- Un oscillateur band-limited n'est pas plus lent de façon prohibitive. Il consomme un peu plus de CPU qu'un oscillateur trivial, mais reste utilisable en temps réel.

---

### Quelles techniques rendent un oscillateur band-limited ?

**Définition** : Faust propose deux familles d'oscillateurs audio à bande limitée : la famille DPW (`sawN`, `sawtooth`, `square`, `triangle`) et la famille PolyBLEP (`polyblep_saw`, `polyblep_square`, `polyblep_triangle`). Ce ne sont pas les mêmes fonctions.

**La famille DPW (`sawN`, `sawtooth`)** :

`os.sawN(N, freq)` construit une dent de scie anti-aliasée par la méthode DPW (Differentiated Polynomial Waveform). `N` n'est **pas** un nombre d'harmoniques : c'est l'ordre polynomial, une constante de compilation comprise entre 1 et 4. `os.sawtooth(freq)` est un alias de `os.saw2` (donc `sawN` d'ordre 2). `os.square` et `os.triangle` sont des `squareN(2)` et `triangleN(2)`.

| Paramètre | Rôle |
| --------- | ---- |
| `N` | Ordre polynomial DPW (constante 1, 2, 3 ou 4) |
| `freq` | Fréquence fondamentale en Hz |

Plus `N` est grand (jusqu'à 4), plus l'anti-aliasing est fort, mais plus le calcul est coûteux. Un appel `os.sawN(16, freq)` ou `os.sawN(32, freq)` ne compile pas.

**La technique PolyBLEP (Polynomial Band-Limited Step)** :

PolyBLEP corrige les discontinuités de la forme d'onde. À chaque saut brutal, elle ajoute une petite correction polynomiale. En Faust, cela correspond aux fonctions `os.polyblep_saw`, `os.polyblep_square` et `os.polyblep_triangle`. Ce n'est **pas** l'implémentation interne de `os.sawtooth`.

**Comparaison des deux techniques** :

| DPW (`os.sawtooth` = `saw2`) | PolyBLEP (`os.polyblep_saw`) |
| ---------------------------- | ---------------------------- |
| Polynôme différencié d'ordre 1 à 4 | Corrige les discontinuités localement |
| `os.sawN(N, freq)` avec N ∈ {1,2,3,4} | Coût quasi constant |
| Choix par défaut (`os.sawtooth`) | Variante alternative, fonctions séparées |

**Analogie concrète** : DPW `sawN` est comme adoucir toute la rampe avec un outil d'ordre choisi (1 à 4). PolyBLEP est comme poncer uniquement les coins qui dépassent : tu ne touches qu'aux discontinuités. Les deux réduisent l'aliasing, mais ce sont deux outils distincts dans `oscillators.lib`.

---

### Quelle est la différence entre oscillateurs audio, LFO et table sinus ?

**Définition** : Faust propose trois catégories d'oscillateurs : les oscillateurs audio band-limited (pour les fréquences audibles), les oscillateurs LFO non band-limited (pour la modulation lente) et la table sinus (`os.osc`, lecture d'une sinusoïde pré-calculée).

**Pourquoi distinguer ces trois catégories** :

1. **Usage différent** : un oscillateur audio doit sonner propre dans les aigus ; un LFO module un paramètre et n'est jamais entendu directement
2. **Coût différent** : le band-limiting coûte du CPU ; pour un LFO lent, ce coût est inutile
3. **Risque d'aliasing différent** : un LFO tourne lentement (sous 20 Hz), donc même non band-limité, il ne produit pas d'aliasing audible

**Tableau de correspondance des trois catégories** :

| Catégorie | Fonctions | Band-limited | Plage d'usage | Sortie |
| --------- | --------- | ------------ | ------------- | ------ |
| Audio | `os.sawtooth`, `os.square`, `os.triangle` | Oui (DPW / `saw2`, `squareN(2)`, `triangleN(2)`) | 20 à 20000 Hz | -1 à +1 |
| LFO | `os.lf_saw`, `os.lf_squarewave`, `os.lf_triangle` | Non | 0.01 à 20 Hz | -1 à +1 (bipolaire) |
| Table sinus | `os.osc` | Sans objet (pas d'harmonique) | Toute fréquence | -1 à +1 |

**Important sur les LFO** : les oscillateurs `os.lf_*` sont **bipolaires**, c'est-à-dire qu'ils oscillent entre -1 et +1. Pour moduler un paramètre qui doit rester positif (un temps de delay, une fréquence de coupure), il faut souvent les décaler et les mettre à l'échelle.

```text
Conversion d'un LFO bipolaire (-1 à +1) vers unipolaire (0 à 1) :
  lfo_unipolaire = os.lf_triangle(rate) * 0.5 + 0.5
```

**Pourquoi `os.osc` n'a pas besoin d'être band-limited** :

`os.osc` lit une table contenant un seul cycle de sinusoïde. Une sinusoïde ne contient qu'une seule fréquence (sa fondamentale) et aucune harmonique. Comme il n'y a pas d'harmonique, il n'y a rien à replier au-dessus de Nyquist. `os.osc` ne produit donc jamais d'aliasing, quelle que soit la fréquence.

**Analogie concrète** : Choisir entre ces trois catégories, c'est comme choisir un véhicule selon le trajet. L'oscillateur audio band-limited est une voiture de tourisme conçue pour l'autoroute (les fréquences audibles, où la qualité compte). Le LFO est un vélo pour les courtes distances lentes (la modulation), inutile de lui mettre un moteur. La table sinus est un véhicule électrique silencieux et sans émission (pas d'harmonique, donc pas d'aliasing par construction).

**Ce qu'il ne faut PAS confondre** :

- Un oscillateur LFO n'est pas adapté à l'audio. `os.lf_saw(440)` joué directement produit de l'aliasing audible, car il n'est pas band-limited.
- Un oscillateur audio n'est pas optimal pour un LFO. `os.sawtooth(0.5)` comme LFO fonctionne, mais gaspille du CPU à band-limiter un signal qu'on n'entend pas.

---

### Quel est le compromis CPU/qualité ?

**Définition** : Le compromis CPU/qualité est le choix entre la fidélité du son (absence d'aliasing, richesse harmonique) et la consommation de ressources processeur. Un oscillateur plus précis coûte plus cher à calculer.

**Hiérarchie des coûts (du moins cher au plus cher)** :

| Oscillateur | Coût CPU relatif | Aliasing | Quand l'utiliser |
| ----------- | ---------------- | -------- | ---------------- |
| `os.lf_saw`, `os.lf_squarewave`, `os.lf_triangle` | Très faible | Présent (inaudible sous 20 Hz) | Modulation (LFO) uniquement |
| `os.osc` (table sinus) | Faible | Aucun | Sinusoïdes, LFO sinus, sous-oscillateur |
| `os.sawtooth`, `os.square`, `os.triangle` (DPW ordre 2) | Modéré | Quasi nul | Oscillateurs audio (choix par défaut) |
| `os.polyblep_saw`, `os.polyblep_square`, `os.polyblep_triangle` | Modéré | Quasi nul | Variante PolyBLEP (fonctions séparées) |
| `os.sawN(N, freq)` avec N = 1 à 4 | Croît avec N | Meilleur anti-aliasing si N augmente | Réglage de l'ordre DPW (pas un nombre d'harmoniques) |

**Règles de décision** :

```text
1. Le signal est-il un LFO (< 20 Hz, jamais entendu directement) ?
   → OUI : os.lf_saw / os.lf_squarewave / os.lf_triangle (le moins cher)

2. Le signal est-il une sinusoïde pure ?
   → OUI : os.osc (pas d'aliasing, peu coûteux)

3. Le signal est-il un oscillateur audio riche (scie, carré, triangle) ?
   → OUI : os.sawtooth / os.square / os.triangle (DPW ordre 2, choix par défaut)

4. As-tu besoin d'un ordre DPW différent, ou d'une variante PolyBLEP ?
   → os.sawN(N, freq) avec N = 1, 2, 3 ou 4
   → ou os.polyblep_saw / os.polyblep_square / os.polyblep_triangle
```

**Analogie concrète** : Le compromis CPU/qualité est comme le choix de la résolution d'une photo. Une photo en très haute résolution (oscillateur précis) est magnifique mais occupe beaucoup d'espace (CPU). Pour une vignette d'aperçu (un LFO), une basse résolution suffit largement. Tu adaptes la qualité à l'usage réel.

---

## Étapes Pratiques

### Étape 1 : Entendre l'aliasing avec une dent de scie naïve

On construit une dent de scie triviale (naïve) à la main pour entendre l'aliasing, puis on la compare à la version band-limited.

```faust
// Fichier : aliasing_demo.dsp
import("stdfaust.lib");

freq = hslider("freq [unit:Hz]", 5000, 1000, 12000, 1);
gain = hslider("gain", 0.2, 0, 1, 0.01);

// Dent de scie NAIVE construite manuellement :
// un compteur de phase qui monte de 0 a 1 puis repart brutalement a 0.
// Cette discontinuite brutale genere de l'aliasing.
phase = os.phasor(1, freq);   // rampe 0..1 a la frequence freq
naive_saw = phase * 2 - 1;    // mise a l'echelle vers -1..+1

// Selecteur entre la version naive et la version band-limited
mode = checkbox("band-limited (coche) vs naive (decoche)");
chosen = select2(mode, naive_saw, os.sawtooth(freq));

process = chosen * gain;
```

```bash
faust2jaqt aliasing_demo.dsp
```

**Résultat attendu** :

```text
- Decoche (naive) a 5000 Hz : son sale, "metallique", avec des frequences
  parasites qui ne suivent pas la note quand tu montes en frequence
- Coche (band-limited) a 5000 Hz : son propre, brillant mais musical
- Plus tu montes en frequence, plus la difference est flagrante
- A 1000 Hz, la difference est faible (peu d'harmoniques depassent Nyquist)
```

---

### Étape 2 : Comparer les trois oscillateurs audio band-limited

On teste les trois formes d'onde band-limited et on observe qu'elles restent propres dans les aigus.

```faust
// Fichier : oscillateurs_bandlimited.dsp
import("stdfaust.lib");

freq = hslider("freq [unit:Hz]", 440, 50, 12000, 0.1);
gain = hslider("gain", 0.3, 0, 1, 0.01);
forme = nentry("forme [style:menu{'scie':0;'carre':1;'triangle':2}]", 0, 0, 2, 1);

// Selection parmi les trois oscillateurs band-limited
oscillateur = select3(forme,
    os.sawtooth(freq),   // 0 = dent de scie band-limited
    os.square(freq),     // 1 = carre band-limited
    os.triangle(freq)    // 2 = triangle band-limited
);

process = oscillateur * gain;

// Note : select3 est une primitive native de Faust ; cette definition
// locale est montree a titre pedagogique (elle reproduit la primitive
// a partir de select2). En pratique, tu peux supprimer ces 4 lignes et
// utiliser directement le select3 integre au langage.
select3(sel, s0, s1, s2) = select2(sel >= 2,
    select2(sel, s0, s1),
    s2
);
```

```bash
faust2jaqt oscillateurs_bandlimited.dsp
```

**Résultat attendu** :

```text
- Scie : son riche et brillant, propre meme a 8000 Hz
- Carre : son creux, "boise", propre dans les aigus
- Triangle : son doux, presque sinusoidal dans les aigus (peu d'harmoniques)
- Aucun gresillement metallique, contrairement a une version naive
```

---

### Étape 3 : Comparer les ordres DPW de sawN

On utilise `os.sawN` pour entendre l'effet de l'ordre polynomial (1 à 4), pas un nombre d'harmoniques.

```faust
// Fichier : sawN_demo.dsp
import("stdfaust.lib");

freq = hslider("freq [unit:Hz]", 220, 50, 2000, 0.1);
gain = hslider("gain", 0.3, 0, 1, 0.01);

// os.sawN(N, freq) : N = ordre DPW (constante 1, 2, 3 ou 4).
// N=1 est proche d'une scie naive ; N=2 est os.sawtooth ; N=4 anti-aliase plus fort.
saw_1 = os.sawN(1, freq);
saw_2 = os.sawN(2, freq);
saw_4 = os.sawN(4, freq);

choix = nentry("ordre DPW [style:menu{'1':0;'2':1;'4':2}]", 1, 0, 2, 1);
oscillateur = select3(choix, saw_1, saw_2, saw_4);

process = oscillateur * gain;

// select3 est natif ; on le redefinit ici par souci de clarte (cf. etape 2).
select3(sel, s0, s1, s2) = select2(sel >= 2,
    select2(sel, s0, s1),
    s2
);
```

```bash
faust2jaqt sawN_demo.dsp
```

**Résultat attendu** :

```text
- Ordre 1 : anti-aliasing faible, plus d'artefacts dans les aigus
- Ordre 2 (= os.sawtooth) : compromis par defaut
- Ordre 4 : anti-aliasing plus fort, un peu plus de CPU
- Un N hors {1,2,3,4} (par exemple 16 ou 32) ne compile pas
```

---

### Étape 4 : Utiliser un LFO bipolaire pour moduler un paramètre

On utilise `os.lf_triangle` (non band-limited, bipolaire) comme LFO pour moduler la fréquence de coupure d'un filtre, en le convertissant de bipolaire vers la bonne plage.

```faust
// Fichier : lfo_modulation.dsp
import("stdfaust.lib");

freq = hslider("freq [unit:Hz]", 110, 50, 1000, 0.1);
gain = hslider("gain", 0.3, 0, 1, 0.01);

// LFO triangle a 2 Hz : sortie bipolaire entre -1 et +1.
// Inaudible directement (sous 20 Hz), donc PAS besoin de band-limiting.
lfo_rate = hslider("LFO rate [unit:Hz]", 2, 0.1, 10, 0.01);
lfo_bipolaire = os.lf_triangle(lfo_rate);   // -1 a +1

// Conversion bipolaire -> plage de coupure [500 ; 5000] Hz.
// 1. (lfo + 1) / 2 ramene -1..+1 vers 0..1
// 2. on etale vers 500..5000 Hz
cutoff = 500 + (lfo_bipolaire * 0.5 + 0.5) * 4500;

// Source audio : dent de scie band-limited
source = os.sawtooth(freq);

// Filtre passe-bas resonant module par le LFO (effet "wah" automatique)
process = source : fi.resonlp(cutoff, 5, 1) * gain;
```

```bash
faust2jaqt lfo_modulation.dsp
```

**Résultat attendu** :

```text
- La frequence de coupure balaie de 500 a 5000 Hz au rythme du LFO (effet "wah")
- A LFO rate = 2 Hz : le balayage se repete 2 fois par seconde
- Le son source (scie band-limited) reste propre, seul le filtre bouge
- Si tu remplaces os.lf_triangle par os.triangle, le resultat est identique
  a l'oreille (le LFO est trop lent pour que l'aliasing soit audible),
  mais tu gaspilles du CPU
```

---

### Étape 5 : Mesurer le coût avec et sans band-limiting

On compile une version naïve et une version band-limited pour comparer la taille du code généré, indicateur indirect du coût CPU.

```faust
// Fichier : cout_naive.dsp
import("stdfaust.lib");
// Version naive : un simple phasor mis a l'echelle
process = (os.phasor(1, 440) * 2 - 1) * 0.3;
```

```faust
// Fichier : cout_bandlimited.dsp
import("stdfaust.lib");
// Version band-limited : DPW (os.sawtooth = saw2)
process = os.sawtooth(440) * 0.3;
```

```bash
# Compiler les deux versions et compter les lignes de code C++ generees
faust cout_naive.dsp -o naive.cpp
faust cout_bandlimited.dsp -o bandlimited.cpp
wc -l naive.cpp bandlimited.cpp
```

**Résultat attendu** :

```text
- naive.cpp        : code court (peu d'operations par echantillon)
- bandlimited.cpp  : code plus long (DPW ajoute des calculs)

La version band-limited genere davantage de code et consomme plus de CPU,
mais elle supprime l'aliasing. Pour un oscillateur audio, ce surcout est justifie.
Pour un LFO, il ne l'est pas.
```

---

## Commandes Utiles

| Commande / Expression Faust | Action |
| --------------------------- | ------ |
| `os.osc(freq)` | Oscillateur sinusoïdal (table sinus, aucun aliasing) |
| `os.sawtooth(freq)` | Dent de scie band-limited (alias de `saw2`, DPW) |
| `os.square(freq)` | Carré band-limited (`squareN(2)`) |
| `os.triangle(freq)` | Triangle band-limited (`triangleN(2)`) |
| `os.sawN(N, freq)` | Dent de scie DPW d'ordre N (N = 1, 2, 3 ou 4) |
| `os.polyblep_saw(freq)` | Dent de scie anti-aliasée par PolyBLEP |
| `os.lf_saw(freq)` | Dent de scie LFO non band-limited (bipolaire -1/+1) |
| `os.lf_squarewave(freq)` | Carré LFO non band-limited (bipolaire -1/+1) |
| `os.lf_triangle(freq)` | Triangle LFO non band-limited (bipolaire -1/+1) |
| `os.phasor(1, freq)` | Rampe de phase 0 à 1 (brique de base, naïve) |
| `lfo * 0.5 + 0.5` | Convertir un LFO bipolaire en unipolaire (0 à 1) |
| `ma.SR` | Fréquence d'échantillonnage courante (Hz) |

---

## Pièges Fréquents

### Piège 1 : Utiliser un oscillateur LFO pour de l'audio

⚠️ **Problème** : Utiliser `os.lf_saw(440)` comme source audio produit de l'aliasing audible, car les `os.lf_*` ne sont pas band-limited.

✅ **Solution** : Réserver `os.lf_*` à la modulation lente (sous 20 Hz). Pour l'audio, utiliser `os.sawtooth`, `os.square` ou `os.triangle`.

```faust
// Probleme : aliasing audible
process = os.lf_saw(440) * 0.3;

// Solution : version band-limited
process = os.sawtooth(440) * 0.3;
```

---

### Piège 2 : Utiliser un oscillateur audio pour un LFO

⚠️ **Problème** : Utiliser `os.sawtooth(2)` comme LFO fonctionne, mais gaspille du CPU en band-limitant un signal qu'on n'entend jamais.

✅ **Solution** : Pour un LFO, utiliser `os.lf_saw`, `os.lf_squarewave` ou `os.lf_triangle`, qui sont plus légers.

```faust
// Gaspillage : band-limiting inutile sur un LFO
lfo = os.sawtooth(2);

// Optimal : LFO leger
lfo = os.lf_saw(2);
```

---

### Piège 3 : Oublier que les LFO sont bipolaires

⚠️ **Problème** : Utiliser directement `os.lf_triangle(rate)` pour moduler un temps de delay donne des valeurs négatives (le LFO descend jusqu'à -1), ce qui produit un comportement indéfini.

✅ **Solution** : Convertir le LFO bipolaire (-1 à +1) en unipolaire (0 à 1) avant de l'utiliser pour un paramètre positif.

```faust
// Probleme : valeurs negatives possibles
delay_mod = os.lf_triangle(2) * 10;   // va de -10 a +10 ms

// Solution : conversion en unipolaire puis mise a l'echelle
delay_mod = (os.lf_triangle(2) * 0.5 + 0.5) * 10;   // va de 0 a 10 ms
```

---

### Piège 4 : Croire qu'un filtre passe-bas après coup supprime l'aliasing

⚠️ **Problème** : Générer une dent de scie naïve puis la filtrer avec `fi.lowpass` ne supprime pas l'aliasing. Une fois repliées sous Nyquist, les fréquences parasites sont dans la bande audible et le filtre ne peut plus les distinguer du signal utile.

✅ **Solution** : Empêcher l'aliasing à la source en utilisant un oscillateur band-limited. Le band-limiting se fait pendant la génération, pas après.

```faust
// Probleme : le filtre n'enleve PAS l'aliasing deja replie
process = (os.phasor(1, 6000) * 2 - 1) : fi.lowpass(4, 10000);

// Solution : pas d'aliasing genere des le depart
process = os.sawtooth(6000) : fi.lowpass(4, 10000);
```

---

### Piège 5 : Passer une variable ou un N > 4 à os.sawN

⚠️ **Problème** : `os.sawN(N, freq)` exige que `N` soit une constante de compilation égale à 1, 2, 3 ou 4. Un `hslider` comme `N`, ou un N du type 16 / 32 / 64, provoque une erreur de compilation. `N` n'est pas un nombre d'harmoniques.

✅ **Solution** : Utiliser uniquement les ordres 1 à 4, et basculer entre versions constantes avec `select2` / `select3`.

```faust
// Probleme : N variable, et hors de 1..4
n = hslider("ordre", 16, 1, 64, 1);
process = os.sawN(n, 220);   // erreur de compilation

// Solution : N constants dans {1,2,3,4} + selection
choix = nentry("h [style:menu{'2':0;'4':1}]", 0, 0, 1, 1);
process = select2(choix, os.sawN(2, 220), os.sawN(4, 220)) * 0.3;
```

---

### Piège 6 : Penser que os.osc peut produire de l'aliasing

⚠️ **Problème** : Croire qu'il faut "protéger" `os.osc` contre l'aliasing en limitant sa fréquence.

✅ **Solution** : `os.osc` lit une sinusoïde pure, qui n'a aucune harmonique. Il n'y a donc rien à replier au-dessus de Nyquist. `os.osc` ne produit jamais d'aliasing, quelle que soit la fréquence demandée.

---

## Checklist de Validation

- [ ] Je sais que la fréquence de Nyquist vaut la moitié de la fréquence d'échantillonnage
- [ ] Je sais expliquer le repliement spectral (aliasing) avec la formule `f_alias = f_e - f`
- [ ] Je comprends pourquoi une dent de scie naïve produit de l'aliasing (discontinuité brutale)
- [ ] Je sais que `os.sawtooth`, `os.square`, `os.triangle` sont band-limited (DPW / `saw2`, `squareN(2)`, `triangleN(2)`)
- [ ] Je sais que `os.lf_saw`, `os.lf_squarewave`, `os.lf_triangle` sont des LFO non band-limited et bipolaires (-1 à +1)
- [ ] Je sais que `os.osc` ne produit jamais d'aliasing (pas d'harmonique à replier)
- [ ] Je sais convertir un LFO bipolaire en unipolaire avec `* 0.5 + 0.5`
- [ ] Je connais `os.sawN(N, freq)` : `N` est l'ordre DPW (constante 1 à 4), pas un nombre d'harmoniques
- [ ] Je sais que PolyBLEP correspond à `os.polyblep_saw` (et non à `os.sawtooth`)
- [ ] Je sais choisir l'oscillateur adapté selon le compromis CPU/qualité
- [ ] Je comprends qu'un filtre après coup ne supprime pas l'aliasing déjà replié

---

## Exercice Pratique

**Énoncé** : Crée un programme Faust qui démontre l'effet de l'aliasing en montant progressivement en fréquence, et qui propose un comparatif A/B entre trois sources :

1. Une dent de scie naïve (construite avec `os.phasor`)
2. Une dent de scie band-limited DPW (`os.sawtooth`)
3. Une dent de scie PolyBLEP (`os.polyblep_saw`)

Le programme doit permettre de basculer entre les trois sources et de balayer la fréquence de 1000 Hz à 12000 Hz.

**Indications** :

- Construis la dent de scie naïve avec `os.phasor(1, freq) * 2 - 1`
- Utilise un `nentry` avec menu pour choisir la source (0, 1, 2)
- Utilise un `select3` pour basculer entre les trois sources
- Ajoute un slider de fréquence de 1000 à 12000 Hz
- Ajoute un slider de gain (commence bas, 0.2, pour protéger tes oreilles)
- Lisse le gain avec `si.smoo` pour éviter les clics

**Résultat attendu** : Un fichier `comparatif_aliasing.dsp` qui compile sans erreur. En montant la fréquence avec la source naïve, tu dois entendre les fréquences parasites apparaître. Avec les sources band-limited et additive, le son doit rester propre.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
// Fichier : comparatif_aliasing.dsp
import("stdfaust.lib");

// === Parametres d'interface ===
freq = hslider("[0]freq [unit:Hz]", 1000, 1000, 12000, 1) : si.smoo;
gain = hslider("[1]gain", 0.2, 0, 1, 0.01) : si.smoo;
source = nentry("[2]source [style:menu{'naive':0;'DPW sawtooth':1;'PolyBLEP':2}]",
    1, 0, 2, 1);

// === Source 1 : dent de scie NAIVE ===
// os.phasor genere une rampe 0..1 ; on l'etale vers -1..+1.
// Le retour brutal de 1 a 0 cree une discontinuite : aliasing garanti.
naive_saw = os.phasor(1, freq) * 2 - 1;

// === Source 2 : dent de scie band-limited DPW (os.sawtooth = saw2) ===
bl_saw = os.sawtooth(freq);

// === Source 3 : dent de scie PolyBLEP ===
// os.polyblep_saw est une fonction distincte de os.sawtooth (DPW).
polyblep_saw = os.polyblep_saw(freq);

// === Selection entre les trois sources ===
chosen = select3(source, naive_saw, bl_saw, polyblep_saw);

process = chosen * gain;

// === select3 natif, redefini ici par souci de clarte (cf. etape 2) ===
select3(sel, s0, s1, s2) = select2(sel >= 2,
    select2(sel, s0, s1),
    s2
);
```

**Compilation et test** :

```bash
faust2jaqt comparatif_aliasing.dsp
```

**Résultat attendu** :

```text
- Source "naive", freq montant de 1000 a 12000 Hz :
    des frequences parasites apparaissent et descendent quand la note monte
    (effet "metallique" caracteristique de l'aliasing)

- Source "DPW sawtooth" : son propre sur toute la plage, brillant mais musical

- Source "PolyBLEP" : son propre sur toute la plage (correction locale des sauts)

Conclusion : la version naive est la seule a produire de l'aliasing audible.
Les deux autres sont propres, avec un cout CPU plus eleve.
```

**Points à observer dans la solution** :

- La source naïve utilise `os.phasor` comme brique de base, ce qui montre concrètement d'où vient l'aliasing (la discontinuité du retour à zéro).
- `os.polyblep_saw` est la variante PolyBLEP ; `os.sawtooth` reste du DPW (`saw2`). `os.sawN` n'accepte que N = 1, 2, 3 ou 4.
- Le gain démarre bas (0.2) et est lissé avec `si.smoo` pour éviter les clics au changement de valeur.
- L'effet est le plus spectaculaire dans les aigus : à 1000 Hz la différence est subtile, à 12000 Hz elle est évidente.

---

## Navigation

← Fiche précédente : **[05 - Bibliothèques Faust](05-bibliotheques-faust.md)**
