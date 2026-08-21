---
tags:
  - Faust
  - Intermédiaire
  - Pratique
description: "Oscillateurs et synthèse en Faust - os.osc, formes d'onde, modulations AM/FM, wavetable, ADSR et polyphonie"
estimated_time: "70 min"
fiche_number: 1
total_fiches: 6
cursus: "Phase 4 - DSP appliqué"
id: "specializations.faust.dsp.oscillateurs-synthese"
course_id: "specializations.faust"
module_id: "specializations.faust.dsp"
content_type: "lesson"
order: 1
---

# 01 - Oscillateurs et synthèse

> **En bref** : À la fin de cette fiche, tu sauras créer des oscillateurs, appliquer des modulations AM et FM, utiliser des enveloppes ADSR et construire un synthétiseur polyphonique en Faust. Lecture estimée : 70 min.


## Prérequis

- Phase 3 complète (langage Faust fondamentaux) :
  - [Fiche 01 - Syntaxe et sémantique de base](../03-langage-faust-fondamentaux/01-syntaxe-semantique-base.md)
  - [Fiche 02 - Les cinq opérateurs de composition](../03-langage-faust-fondamentaux/02-cinq-operateurs-composition.md)
  - [Fiche 03 - Interfaces utilisateur (UI)](../03-langage-faust-fondamentaux/03-interfaces-utilisateur-ui.md)
  - [Fiche 04 - Mémoire et délais](../03-langage-faust-fondamentaux/04-memoire-delais.md)
- [Fiche 04 - Synthèse sonore - théorie](../01-fondamentaux-acoustique/04-synthese-sonore-theorie.md) (concepts de synthèse additive, soustractive, FM, ADSR)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des oscillateurs, appliquer des modulations AM et FM, utiliser des enveloppes ADSR et construire un synthétiseur polyphonique en Faust.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un oscillateur en Faust ?

**Définition** : Un oscillateur est une fonction qui génère un signal périodique à une fréquence donnée. En Faust, la bibliothèque `oscillators.lib` (préfixe `os.`) fournit des oscillateurs prêts à l'emploi pour les quatre formes d'onde fondamentales.

**Le problème que les oscillateurs de la bibliothèque résolvent** :

Sans les oscillateurs de la bibliothèque, voici les problèmes rencontrés :

1. **Aliasing** : un oscillateur naïf produit des fréquences parasites au-dessus de la fréquence de Nyquist (grésillements, sons métalliques non désirés)
2. **Complexité mathématique** : implémenter des oscillateurs anti-aliasés (PolyBLEP, bandlimited) nécessite des techniques avancées
3. **Réinvention inutile** : recoder les mêmes fonctions éprouvées avec des risques d'erreur

**Comment les oscillateurs de la bibliothèque résolvent ces problèmes** :

| Problème | Solution apportée par `os.*` |
| -------- | ---------------------------- |
| Aliasing | Les oscillateurs riches en harmoniques (`os.sawtooth`, `os.square`, `os.triangle`) sont anti-aliasés ; `os.osc` est une lecture de table sinus (pas d'harmonique parasite à anti-aliaser) |
| Complexité mathématique | Une seule ligne suffit : `os.osc(440)` produit un sinus pur à 440 Hz |
| Réinvention inutile | Bibliothèque maintenue par GRAME, testée et optimisée |

**Analogie concrète** : Les oscillateurs `os.*` sont comme des moules à gâteaux professionnels. Au lieu de sculpter chaque gâteau à la main (risque de forme irrégulière), tu verses la pâte dans le moule (la fréquence) et tu obtiens une forme parfaite à chaque fois.

**Ce qu'un oscillateur n'est PAS** :

- Un oscillateur n'est pas un instrument de musique complet. Il produit un signal brut et continu. Pour obtenir un son musical, il faut ajouter une enveloppe et souvent un filtre.
- Un oscillateur n'est pas un lecteur de fichier audio. Il génère un signal mathématiquement.

Le diagramme suivant présente les quatre formes d'onde fondamentales et leur caractère sonore.

<div class="diagram-design">
<p><a href="../../../diagrams/faust-04-dsp-applique-01-oscillateurs-synthese-1.html">Qu&#x27;est-ce qu&#x27;un oscillateur en Faust ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/faust-04-dsp-applique-01-oscillateurs-synthese-1.html" title="Qu&#x27;est-ce qu&#x27;un oscillateur en Faust ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

#### Les quatre oscillateurs de base

| Fonction | Forme d'onde | Harmoniques | Son |
| -------- | ------------ | ----------- | --- |
| `os.osc(freq)` | Sinusoïde | Fondamentale seule | Pur, doux, "flûteux" |
| `os.sawtooth(freq)` | Dent de scie | Toutes (1, 2, 3, 4...) à 1/n | Riche, brillant, "cuivré" |
| `os.square(freq)` | Carré | Impaires (1, 3, 5...) à 1/n | Creux, "boisé", "clarinette" |
| `os.triangle(freq)` | Triangle | Impaires (1, 3, 5...) à 1/n² | Doux, entre sinus et carré |

Chaque oscillateur prend un argument `freq` (en Hz) et produit un signal entre -1 et +1.

---

### Qu'est-ce que le bruit ?

**Définition** : Le bruit est un signal aléatoire sans périodicité. En Faust, `no.noise` génère du bruit blanc : chaque échantillon est une valeur aléatoire entre -1 et +1.

**Le problème que le bruit résout** :

Sans source de bruit, voici les problèmes rencontrés :

1. **Pas de sons percussifs réalistes** : cymbales, hi-hats et caisses claires contiennent du bruit
2. **Pas de textures atmosphériques** : vent, pluie, souffle sont des bruits naturels
3. **Pas de synthèse soustractive** : cette technique part d'un signal riche (souvent du bruit) et le filtre

**Analogie concrète** : Le bruit blanc est comme la lumière blanche en optique. La lumière blanche contient toutes les couleurs. En la filtrant, on isole la couleur voulue. Le bruit blanc contient toutes les fréquences, et en le filtrant, on isole la bande voulue.

#### Variantes de bruit

| Type | Spectre | Expression Faust |
| ---- | ------- | ---------------- |
| Blanc | Plat (énergie égale par Hz) | `no.noise` |
| Rose | -3 dB/octave | `no.pink_noise` (ou `no.noise : no.pink_filter`) |
| Brun | -6 dB/octave | `no.noise : fi.lowpass(1, 500)` |

---

### Qu'est-ce que la modulation d'amplitude (AM) ?

**Définition** : La modulation d'amplitude (AM) consiste à multiplier un signal porteur par un signal modulateur. Le résultat est un son dont le volume fluctue au rythme du modulateur.

**Le problème que la modulation d'amplitude résout** :

Sans modulation d'amplitude, voici les problèmes rencontrés :

1. **Sons statiques** : un oscillateur seul produit un son monotone et irréaliste
2. **Palette sonore limitée** : les quatre formes d'onde de base ne suffisent pas
3. **Pas de trémolo** : la variation périodique du volume est impossible sans AM

**Comment la modulation d'amplitude résout ces problèmes** :

| Problème | Solution apportée par la modulation AM |
| -------- | -------------------------------------- |
| Sons statiques | Le volume varie dans le temps, rendant le son vivant |
| Palette sonore limitée | La multiplication crée de nouvelles fréquences (bandes latérales) |
| Pas de trémolo | Un LFO en modulateur produit un trémolo |

**Analogie concrète** : La modulation d'amplitude fonctionne comme un variateur de lumière automatique. La lampe (le porteur) émet une lumière constante. Le variateur (le modulateur) monte et descend régulièrement. Si le variateur tourne lentement (< 20 Hz), on voit un scintillement (trémolo). Si le variateur tourne très vite (> 20 Hz), de nouvelles fréquences apparaissent (ring modulation).

**Deux régimes de modulation AM** :

| Régime | Fréquence du modulateur | Résultat perçu |
| ------ | ----------------------- | --------------- |
| Tremolo | < 20 Hz (sous-audio) | Pulsation audible du volume |
| Ring modulation | > 20 Hz (audio) | Nouvelles fréquences : `fp ± fm` |

Pour un trémolo, on décale le modulateur pour qu'il oscille entre 0 et 1 :

```text
Tremolo = porteur × (1 - depth × (1 - lfo) / 2)

depth = 0 : pas de tremolo. depth = 1 : maximum.
```

---

### Qu'est-ce que la modulation de fréquence (FM) ?

**Définition** : La modulation de fréquence (FM) consiste à faire varier la fréquence instantanée d'un oscillateur porteur en y ajoutant le signal d'un oscillateur modulateur. Le résultat est un son riche en harmoniques contrôlé par deux paramètres : le ratio et l'index de modulation.

**Le problème que la modulation de fréquence résout** :

Sans modulation de fréquence, voici les problèmes rencontrés :

1. **Timbres complexes coûteux** : reproduire des cloches ou des cuivres nécessite de nombreux oscillateurs en synthèse additive
2. **Spectre figé** : les formes d'onde de base ont un spectre fixe
3. **Manque de contrôle** : la synthèse additive est difficile à paramétrer

**Comment la modulation de fréquence résout ces problèmes** :

| Problème | Solution apportée par la FM |
| -------- | --------------------------- |
| Timbres complexes coûteux | Deux oscillateurs suffisent pour un spectre très riche |
| Spectre figé | L'index de modulation contrôle la richesse spectrale en temps réel |
| Manque de contrôle | Deux paramètres (ratio, index) explorent une vaste palette sonore |

**Analogie concrète** : Imagine une sirène de pompier dont la montée-descente en fréquence se fait des centaines de fois par seconde, trop vite pour être perçue comme un changement de hauteur. Le résultat est un son complexe et métallique. C'est la FM : un oscillateur "secoue" la fréquence d'un autre si vite que de nouvelles harmoniques apparaissent.

**Comparaison AM vs FM** :

| Modulation d'amplitude (AM) | Modulation de fréquence (FM) |
| --------------------------- | ---------------------------- |
| Le volume du porteur varie | La fréquence du porteur varie |
| Produit 2 bandes latérales : fp ± fm | Produit de nombreuses bandes latérales |
| Spectre simple | Spectre complexe, contrôlé par l'index |

#### Paramètres clés de la synthèse FM

**Ratio (C:M)** : le rapport entre fréquence porteuse et modulatrice. Détermine la position des harmoniques.

| Ratio C:M | Type de spectre | Son |
| --------- | --------------- | --- |
| 1:1 | Harmoniques entiers | Dent de scie |
| 1:2 | Impaires prédominantes | Carré/clarinette |
| 1:1.41 | Partiels inharmoniques | Cloche métallique |
| 1:3.5 | Très inharmoniques | Gong, percussion |

**Index de modulation** : contrôle la richesse spectrale. Plus l'index est élevé, plus le spectre est riche.

```text
Index = 0   : sinusoïde seule
Index = 1   : quelques harmoniques
Index = 5   : spectre riche, cuivré/métallique
Index = 10  : spectre très dense
Index = 25+ : quasi-bruit

En Faust : process = os.osc(fc + index * fm * os.osc(fm));
  où fm = fc * ratio
```

---

### Qu'est-ce que la synthèse par table d'ondes (wavetable) ?

**Définition** : La synthèse par table d'ondes stocke un cycle d'une forme d'onde dans un tableau et le lit en boucle à la vitesse correspondant à la fréquence voulue. En Faust, `rdtable` permet cette lecture.

**Le problème que la wavetable résout** :

1. **Calcul coûteux** : `sin()` à chaque échantillon consomme du CPU
2. **Formes d'onde arbitraires** : les `os.*` ne fournissent que 4 formes de base
3. **Pas de morphing** : impossible de passer d'une forme à une autre sans wavetable

**Analogie concrète** : Une wavetable fonctionne comme un disque vinyle miniature. La forme d'onde est gravée une seule fois dans le sillon. L'aiguille tourne en boucle à vitesse variable : lente pour un son grave, rapide pour un son aigu.

```text
En Faust :
  rdtable(tablesize, waveform, read_index)
  - tablesize  : nombre d'échantillons dans la table
  - waveform   : expression qui génère le contenu
  - read_index : index de lecture (0 à tablesize-1)
```

---

### Qu'est-ce qu'une enveloppe ADSR ?

**Définition** : Une enveloppe ADSR (Attack, Decay, Sustain, Release) décrit comment l'amplitude d'un son évolue dans le temps. En Faust, `en.adsr(attack, decay, sustain, release, gate)` génère cette courbe (valeurs entre 0 et 1).

**Le problème que l'enveloppe ADSR résout** :

1. **Sons sans vie** : un oscillateur seul démarre et s'arrête brutalement
2. **Pas de contrôle expressif** : impossible de jouer staccato ou legato
3. **Clics audibles** : les discontinuités du signal produisent des artefacts

**Comment l'enveloppe ADSR résout ces problèmes** :

| Problème | Solution apportée par l'ADSR |
| -------- | ---------------------------- |
| Sons sans vie | L'enveloppe modèle le comportement temporel d'un instrument réel |
| Pas de contrôle expressif | Les 4 paramètres sculptent la dynamique du son |
| Clics audibles | Les phases attack et release lissent le début et la fin du son |

**Analogie concrète** : L'enveloppe ADSR fonctionne comme le volume d'une télévision. Quand tu appuies sur "marche" (gate = 1) : le volume monte (Attack), redescend un peu (Decay), se stabilise (Sustain). Quand tu appuies sur "arrêt" (gate = 0) : le volume descend progressivement (Release).

**Les quatre phases** :

```text
Amplitude
    ^
  1 |      /\
    |     /  \
  S |    /    \___________
    |   /                  \
  0 |_/______________________\___> Temps
    |  A   D    Sustain    R  |
    touche                 touche
    enfoncée               relâchée
```

| Paramètre | Unité | Valeur typique | Effet |
| --------- | ----- | -------------- | ----- |
| Attack | secondes | 0.01 - 0.5 | Court = percussif. Long = doux |
| Decay | secondes | 0.05 - 1.0 | Court = plat. Long = décroissant |
| Sustain | ratio (0-1) | 0.3 - 0.8 | Bas = s'éteint. Haut = soutenu |
| Release | secondes | 0.05 - 2.0 | Court = sec. Long = résonne |

**Exemples de timbres** :

| Instrument | Attack | Decay | Sustain | Release |
| ---------- | ------ | ----- | ------- | ------- |
| Piano | 0.001 | 0.5 | 0.3 | 0.5 |
| Orgue | 0.01 | 0.01 | 1.0 | 0.01 |
| Pad / nappe | 1.0 | 0.5 | 0.7 | 2.0 |
| Percussion | 0.001 | 0.2 | 0.0 | 0.1 |

---

### Qu'est-ce que la polyphonie en Faust ?

**Définition** : La polyphonie en Faust est un mécanisme intégré au compilateur qui duplique automatiquement un programme monophonique pour créer le nombre de voix demandé, avec gestion automatique des messages MIDI.

**Le problème que la polyphonie intégrée résout** :

1. **Duplication manuelle** : il faudrait copier-coller le code de synthèse 8 fois
2. **Gestion MIDI complexe** : allocation des voix, voice stealing, etc.
3. **Scalabilité impossible** : changer le nombre de voix nécessiterait de réécrire le code

**Comment la polyphonie intégrée résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Duplication manuelle | Le compilateur duplique le `process` pour chaque voix |
| Gestion MIDI complexe | Le runtime gère allocation, note-on/off et voice stealing |
| Scalabilité impossible | Changer `[nvoices:8]` en `[nvoices:16]` suffit |

**Analogie concrète** : La polyphonie Faust fonctionne comme un chef de chorale. Tu écris la partition pour une seule voix (le `process`). Le chef (le compilateur) distribue les notes aux chanteurs disponibles. Quand un chanteur finit sa note, il est disponible pour la suivante.

#### Convention polyphonique Faust

Le programme doit respecter une convention précise :

```text
1. Déclarer : declare options "[midi:on][nvoices:8]";

2. Utiliser les noms exacts :
   - freq : fréquence de la note (Hz)
   - gain : vélocité (0-1)
   - gate : état de la touche (1 = enfoncée, 0 = relâchée)

3. (Optionnel) Déclarer un effet global : effect = ...;
```

---

### Comment combiner oscillateur + enveloppe + filtre ?

**Définition** : Un synthétiseur basique chaîne trois éléments : une source (oscillateur), un contrôle temporel (enveloppe ADSR) et un contrôle spectral (filtre). C'est le modèle fondamental de la synthèse soustractive.

```text
Oscillateur ──> Filtre ──> × Enveloppe ──> Sortie

En Faust : process = oscillator : filter * envelope;
```

**Analogie concrète** : Cette chaîne fonctionne comme un robinet avec un filtre et un variateur de pression. L'oscillateur est la source d'eau. Le filtre purifie l'eau (élimine les harmoniques non voulues). Le variateur (l'enveloppe) contrôle le débit dans le temps.

---

## Étapes Pratiques

### Étape 1 : Tester chaque oscillateur de la bibliothèque os

Crée un programme qui permet de choisir entre les 4 formes d'onde et de contrôler la fréquence.

```faust
// Fichier : oscillateurs_base.dsp
import("stdfaust.lib");

freq = hslider("freq [unit:Hz]", 440, 20, 2000, 0.1);
gain = hslider("gain", 0.3, 0, 1, 0.01);
wave = nentry("onde [style:menu{'sinus':0;'scie':1;'carré':2;'triangle':3}]", 0, 0, 3, 1);

// Sélection parmi les 4 oscillateurs
oscillator = select4(wave,
    os.osc(freq),        // 0 = sinusoïde
    os.sawtooth(freq),   // 1 = dent de scie
    os.square(freq),     // 2 = carré
    os.triangle(freq)    // 3 = triangle
);

process = oscillator * gain;

// Fonction utilitaire de sélection parmi 4 signaux
select4(sel, s0, s1, s2, s3) = select2(sel > 1,
    select2(sel, s0, s1),
    select2(sel - 2, s2, s3)
);
```

```bash
faust2jaqt oscillateurs_base.dsp
```

**Résultat attendu** :

```text
- Sinusoïde : son pur, doux, sans harmoniques (flûte, diapason)
- Dent de scie : son riche, brillant (cuivre, synthétiseur analogique)
- Carré : son creux, "boisé" (clarinette, 8-bit rétro)
- Triangle : son doux avec léger caractère (entre sinus et carré)
```

---

### Étape 2 : Créer un trémolo (AM) avec LFO

```faust
// Fichier : tremolo.dsp
import("stdfaust.lib");

freq = hslider("freq [unit:Hz]", 440, 20, 2000, 0.1);
lfo_rate = hslider("LFO rate [unit:Hz]", 5, 0.1, 20, 0.1);
depth = hslider("depth", 0.5, 0, 1, 0.01);
gain = hslider("gain", 0.3, 0, 1, 0.01);

lfo = os.osc(lfo_rate);

// Modulateur oscille entre (1 - depth) et 1
// lfo = +1 → volume max ; lfo = -1 → volume = (1 - depth)
tremolo_mod = 1 - depth * (1 - lfo) / 2;

process = os.sawtooth(freq) * tremolo_mod * gain;
```

```bash
faust2jaqt tremolo.dsp
```

**Résultat attendu** :

```text
- rate=5, depth=0.5 : le volume pulse 5 fois/s (tremolo guitare vintage)
- rate=1, depth=1.0 : pulsation lente, le son s'éteint entre chaque cycle
- rate=15, depth=0.3 : vibration rapide et subtile, son "vivant"
```

---

### Étape 3 : Créer un son de cloche par synthèse FM

La synthèse FM avec un ratio inharmonique (par exemple 1.41) produit des sons de cloche.

```faust
// Fichier : cloche_fm.dsp
import("stdfaust.lib");

fc = hslider("freq porteuse [unit:Hz]", 440, 50, 2000, 0.1);
ratio = hslider("ratio C:M", 1.41, 0.1, 10, 0.01);
    // 1.41 ≈ √2 = cloche inharmonique ; 1.0 = harmonique
index = hslider("index", 5, 0, 25, 0.1);
gain = hslider("gain", 0.3, 0, 1, 0.01);

fm = fc * ratio;
modulator = index * fm * os.osc(fm);
carrier = os.osc(fc + modulator);

// Enveloppe percussive : attaque courte, pas de sustain, longue résonance
strike = button("strike");
envelope = en.adsr(0.001, 1.5, 0.0, 2.0, strike);

process = carrier * envelope * gain;
```

```bash
faust2jaqt cloche_fm.dsp
```

**Résultat attendu** :

```text
- ratio=1.41, index=5 : cloche métallique claire, résonne ~2 secondes
- ratio=1.0, index=5 : son harmonique (cuivre), plus de cloche
- ratio=2.7, index=8 : gong ou bol tibétain, très métallique
- ratio=1.41, index=0 : sinusoïde pure (modulation désactivée)
```

---

### Étape 4 : Implémenter une enveloppe ADSR sur un oscillateur

```faust
// Fichier : synth_adsr.dsp
import("stdfaust.lib");

freq = hslider("[0]freq [unit:Hz]", 440, 20, 2000, 0.1);
attack = hslider("[1]attack [unit:s]", 0.01, 0.001, 2.0, 0.001);
decay = hslider("[2]decay [unit:s]", 0.1, 0.001, 2.0, 0.001);
sustain = hslider("[3]sustain", 0.7, 0, 1, 0.01);
release = hslider("[4]release [unit:s]", 0.3, 0.001, 5.0, 0.001);
gate = button("[5]gate");
gain = hslider("[6]gain", 0.3, 0, 1, 0.01);

envelope = en.adsr(attack, decay, sustain, release, gate);

process = os.sawtooth(freq) * envelope * gain;
```

```bash
faust2jaqt synth_adsr.dsp
```

**Résultat attendu** :

```text
- Piano (a=0.001, d=0.5, s=0.3, r=0.5) : attaque immédiate, volume décroissant
- Orgue (a=0.01, d=0.01, s=1.0, r=0.01) : on/off instantané, volume constant
- Pad (a=1.0, d=0.5, s=0.7, r=2.0) : montée lente, extinction progressive
- Percussion (a=0.001, d=0.2, s=0.0, r=0.1) : impact bref, son sec
```

---

### Étape 5 : Construire un synthétiseur polyphonique simple

```faust
// Fichier : synth_poly.dsp
import("stdfaust.lib");

declare options "[midi:on][nvoices:8]";

// Paramètres de convention polyphonique (noms obligatoires)
freq = hslider("freq", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Contrôles utilisateur
attack = hslider("[0]attack [unit:s]", 0.01, 0.001, 2.0, 0.001);
decay = hslider("[1]decay [unit:s]", 0.1, 0.001, 2.0, 0.001);
sustain = hslider("[2]sustain", 0.7, 0, 1, 0.01);
release = hslider("[3]release [unit:s]", 0.3, 0.001, 5.0, 0.001);
cutoff = hslider("[4]cutoff [unit:Hz]", 5000, 100, 15000, 1);
resonance = hslider("[5]resonance", 0.5, 0, 0.99, 0.01);

envelope = en.adsr(attack, decay, sustain, release, gate);

// Chaîne : oscillateur → filtre passe-bas → enveloppe × vélocité
process = os.sawtooth(freq)
    : fi.resonlp(cutoff, resonance, 1)
    * envelope * gain;

// Volume master après mixage des voix
effect = *(hslider("master", 0.5, 0, 1, 0.01));
```

```bash
faust2jaqt -midi -nvoices 8 synth_poly.dsp
```

**Résultat attendu** :

```text
- Chaque touche MIDI déclenche une voix (fréquence + vélocité)
- 8 notes simultanées maximum (voice stealing au-delà)
- cutoff bas (500 Hz) = son sombre ; cutoff haut (15000 Hz) = brillant
- résonance à 0.9 = son "acide" type TB-303
```

---

## Commandes Utiles

| Commande / Expression Faust | Action |
| --------------------------- | ------ |
| `os.osc(freq)` | Oscillateur sinusoïdal à `freq` Hz |
| `os.sawtooth(freq)` | Oscillateur dent de scie à `freq` Hz |
| `os.square(freq)` | Oscillateur carré à `freq` Hz |
| `os.triangle(freq)` | Oscillateur triangle à `freq` Hz |
| `no.noise` | Générateur de bruit blanc (-1 à +1) |
| `en.adsr(a, d, s, r, gate)` | Enveloppe ADSR (sortie entre 0 et 1) |
| `fi.resonlp(fc, q, gain)` | Filtre passe-bas résonant |
| `os.osc(fc + idx * fm * os.osc(fm))` | Synthèse FM basique |
| `declare options "[midi:on][nvoices:N]";` | Activer polyphonie à N voix |
| `faust2jaqt -midi -nvoices 8 file.dsp` | Compiler avec MIDI et 8 voix |
| `rdtable(size, content, index)` | Lire dans une table d'ondes |

---

## Pièges Fréquents

### Piège 1 : Oublier d'importer stdfaust.lib

**Problème** : Utiliser `os.osc(440)` sans `import("stdfaust.lib");` provoque une erreur "undefined symbol os".

**Solution** : Toujours placer `import("stdfaust.lib");` en début de fichier.

---

### Piège 2 : Volume trop fort avec la polyphonie

**Problème** : 8 voix à gain 1.0 produisent une amplitude de 8.0 (clipping).

**Solution** : Définir un `effect` qui contrôle le volume global.

```faust
// Problème : 8 voix additionnées → clipping
effect = _;

// Solution : volume master
effect = *(hslider("master", 0.3, 0, 1, 0.01));
```

---

### Piège 3 : Noms incorrects pour les paramètres polyphoniques

**Problème** : Les paramètres doivent s'appeler exactement `freq`, `gain` et `gate`. Utiliser `frequency` ou `volume` empêche la connexion MIDI.

**Solution** : Respecter les noms de convention.

```faust
// Incorrect :
frequency = hslider("frequency", 440, 20, 20000, 0.01);

// Correct :
freq = hslider("freq", 440, 20, 20000, 0.01);
```

---

### Piège 4 : Index de modulation FM trop élevé

**Problème** : Un index > 10-15 produit un spectre quasi-bruit, sans musicalité.

**Solution** : Commencer à 1-3 et augmenter progressivement. Pour la plupart des sons musicaux, un index entre 1 et 8 suffit.

---

### Piège 5 : Clics sans enveloppe

**Problème** : Démarrer/arrêter un oscillateur brutalement crée des clics audibles.

**Solution** : Toujours utiliser une enveloppe, même minimale (5-10 ms suffisent).

```faust
// Problème : clic audible
process = os.osc(440) * button("gate");

// Solution : enveloppe anti-clic minimale
process = os.osc(440) * en.adsr(0.005, 0.01, 1.0, 0.005, button("gate"));
```

---

### Piège 6 : Confondre sustain (niveau) et sustain (durée)

**Problème** : Le paramètre `sustain` de `en.adsr` est un **niveau** (0 à 1), pas une **durée** en secondes.

**Solution** : Seuls `attack`, `decay` et `release` sont en secondes. `sustain` est un ratio sans unité.

```text
en.adsr(attack, decay, sustain, release, gate)
         │        │       │        │
         secondes secondes ratio   secondes
                          (0-1)
```

---

## Checklist de Validation

- [ ] Je sais utiliser les 4 oscillateurs (`os.osc`, `os.sawtooth`, `os.square`, `os.triangle`)
- [ ] Je sais générer du bruit blanc avec `no.noise`
- [ ] Je comprends la différence entre trémolo (AM sous-audio) et ring modulation (AM audio)
- [ ] Je sais créer un trémolo avec un LFO
- [ ] Je comprends les paramètres FM : ratio et index de modulation
- [ ] Je sais créer un son de cloche par FM (ratio inharmonique)
- [ ] Je sais utiliser `en.adsr(a, d, s, r, gate)` et je sais que sustain est un niveau (0-1)
- [ ] Je connais la convention polyphonique Faust : `freq`, `gain`, `gate`
- [ ] Je sais activer la polyphonie et définir un `effect` global
- [ ] Je sais construire la chaîne oscillateur + filtre + enveloppe

---

## Exercice Pratique

**Énoncé** : Crée un synthétiseur FM polyphonique (8 voix) avec :

1. Contrôle du ratio porteuse/modulatrice (slider de 0.1 à 10)
2. Contrôle de l'index de modulation (slider de 0 à 15)
3. Enveloppe ADSR complète avec les 4 paramètres réglables
4. Sortie stéréo avec un léger chorus (détunage entre les canaux gauche et droit)
5. Un slider master pour le volume global

**Indications** :

- Utilise `declare options "[midi:on][nvoices:8]";`
- Respecte la convention `freq`, `gain`, `gate`
- Pour le chorus stéréo : crée deux signaux FM légèrement désaccordés (un à `freq` et l'autre à `freq * 1.003`). Ce détunage de 0.3 % crée un battement lent et agréable
- Définis `effect` pour le volume master

**Résultat attendu** :

- 8 voix simultanées, son FM contrôlable via ratio et index
- Enveloppe ADSR fonctionnelle
- Son stéréo "large" et "vivant" grâce au chorus

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
// Fichier : synth_fm_poly.dsp
import("stdfaust.lib");

declare options "[midi:on][nvoices:8]";

// Convention polyphonique (noms obligatoires)
freq = hslider("freq", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Paramètres FM
ratio = hslider("[0]ratio C:M", 1.0, 0.1, 10, 0.01);
index_mod = hslider("[1]index", 3, 0, 15, 0.01);

// Paramètres ADSR
att = hslider("[2]attack [unit:s]", 0.01, 0.001, 2.0, 0.001);
dec = hslider("[3]decay [unit:s]", 0.1, 0.001, 2.0, 0.001);
sus = hslider("[4]sustain", 0.7, 0, 1, 0.01);
rel = hslider("[5]release [unit:s]", 0.3, 0.001, 5.0, 0.001);

// Moteur FM : génère un signal FM à la fréquence f
fm_synth(f) = os.osc(f + mod_signal)
with {
    fm = f * ratio;
    mod_signal = index_mod * fm * os.osc(fm);
};

envelope = en.adsr(att, dec, sus, rel, gate);

// Sortie stéréo avec chorus (détunage gauche/droit de 0.3 %)
// À 440 Hz : droit = 441.32 Hz → battement à 1.32 Hz
process = left, right
with {
    left  = fm_synth(freq) * envelope * gain;
    right = fm_synth(freq * 1.003) * envelope * gain;
};

// Volume master appliqué après mixage des voix
effect = *(master), *(master)
with {
    master = hslider("[6]master", 0.3, 0, 1, 0.01);
};
```

**Compilation et test** :

```bash
faust2jaqt -midi -nvoices 8 synth_fm_poly.dsp
```

**Résultat attendu** :

```text
- ratio=1.0, index=3 : son FM chaud, cuivré, image stéréo large
- ratio=1.41, index=5, a=0.001, d=1.5, s=0, r=2 : cloches métalliques
- ratio=1.0, index=2, a=1.0, d=0.5, s=0.7, r=2.0 : pad planant et spacieux
- ratio=1.0, index=1, a=0.01, d=0.3, s=0.5, r=0.1 : basse FM (style DX7)

Le slider master contrôle le volume global sans clipping,
même avec 8 voix simultanées.
```

---

## Navigation

→ Fiche suivante : **[02 - Filtres](02-filtres.md)**
