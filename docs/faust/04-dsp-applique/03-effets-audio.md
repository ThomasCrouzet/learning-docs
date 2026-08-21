---
tags:
  - Faust
  - Intermédiaire
  - Pratique
description: "Effets audio en Faust - distorsion, delay, chorus, flanger, phaser, reverb et compresseur"
estimated_time: "65 min"
fiche_number: 3
total_fiches: 6
cursus: "Phase 4 - DSP appliqué"
id: "specializations.faust.dsp.effets-audio"
course_id: "specializations.faust"
module_id: "specializations.faust.dsp"
content_type: "lesson"
order: 3
---

# 03 - Effets audio

> **En bref** : À la fin de cette fiche, tu sauras implémenter les effets audio classiques en Faust : distorsion, delay, modulation, reverb et dynamique. Lecture estimée : 65 min.


## Prérequis

- [Fiche 04 - Mémoire et délais](../03-langage-faust-fondamentaux/04-memoire-delais.md) : opérateur `@`, lignes de retard, feedback
- [Fiche 01 - Oscillateurs et synthèse](01-oscillateurs-synthese.md) : oscillateurs de base, LFO, enveloppes ADSR

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter les effets audio classiques en Faust : distorsion, delay, modulation, reverb et dynamique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la distorsion ?

**Définition** : La distorsion est un effet audio qui modifie la forme d'onde d'un signal en ajoutant des harmoniques. Elle transforme un signal propre en un signal plus riche ou plus agressif selon l'intensité appliquée.

**Le problème que la distorsion résout** :

Sans distorsion, voici les problèmes rencontrés :

1. **Son trop propre** : une guitare électrique sans distorsion sonne fin et sans caractère
2. **Manque d'harmoniques** : un signal sinusoidal est pauvre en contenu spectral
3. **Pas de saturation contrôlée** : la saturation des amplis a lampes crée un son recherché qu'il faut reproduire numériquement

| Problème | Solution apportée par la distorsion |
| -------- | ----------------------------------- |
| Son trop propre | La distorsion ajoute du caractère et de la présence |
| Manque d'harmoniques | Le waveshaping génère de nouvelles harmoniques |
| Pas de saturation contrôlée | Les fonctions tanh/atan simulent les circuits analogiques |

**Analogie concrète** : Imagine un haut-parleur poussé au maximum. Quand le volume dépasse ce qu'il peut reproduire, les crêtes du signal sont "écrasées". Le son devient plus riche. La distorsion numérique reproduit cet écrasement de manière contrôlée.

**Ce que la distorsion n'est PAS** :

- La distorsion n'est pas du bruit. Le bruit est aléatoire. La distorsion modifie le signal existant de manière déterministe.
- La distorsion n'est pas un filtre. Un filtre retire des fréquences. La distorsion en ajoute.

#### Types de distorsion

| Type | Principe | Son |
| ---- | -------- | --- |
| Hard clipping | Crêtes coupées brutalement à un seuil fixe | Agressif, métallique |
| Soft clipping (tanh, atan) | Crêtes arrondies progressivement | Chaud, musical |
| Overdrive | Soft clipping avec gain modéré | Crunch, bluesy |
| Bitcrusher | Réduction de résolution numérique | Lo-fi, granuleux |

#### Fonctions de transfert

```text
Hard clip :                    Soft clip (tanh) :

Sortie                         Sortie
  1 ┤      ___________           1 ┤     ________────
    │     /                        │    /
  0 ┤────/──────── Entrée        0 ┤───/───────── Entrée
    │   /                          │  /
 -1 ┤__/                        -1 ┤──────________
```

En Faust, la division par `tanh(drive)` normalise la sortie pour que le volume maximal reste à 1, quel que soit le drive :

```faust
hardclip(x) = max(-1, min(1, x));
softclip(drive, x) = ma.tanh(x * drive) / ma.tanh(drive);
atanclip(drive, x) = ma.atan(x * drive) / ma.atan(drive);
```

---

### Qu'est-ce qu'un delay ?

**Définition** : Un delay est un effet qui enregistre le signal audio et le rejoue après un certain temps. Le signal retardé est mixé avec l'original, créant un écho.

**Le problème que le delay résout** :

1. **Son sec et plat** : le signal direct manque de profondeur
2. **Pas de rythme ajouté** : impossible de créer des motifs par répétition
3. **Pas de profondeur stéréo** : le son reste ancré au centre

| Problème | Solution apportée par le delay |
| -------- | ------------------------------ |
| Son sec et plat | Les répétitions ajoutent de la profondeur |
| Pas de rythme ajouté | Le delay synchronisé au tempo crée des motifs rythmiques |
| Pas de profondeur stéréo | Le ping-pong delay alterne gauche/droite |

**Analogie concrète** : Le delay fonctionne comme un écho dans une montagne. Tu cries, et quelques secondes plus tard tu entends ta voix revenir. Si l'écho rebondit plusieurs fois (feedback), ta voix se répète de plus en plus faiblement.

**Ce qu'un delay n'est PAS** :

- Un delay n'est pas une reverb. La reverb simule des milliers de réflexions denses. Le delay produit des répétitions distinctes et espacées.

| Paramètre | Description | Valeurs typiques |
| --------- | ----------- | ---------------- |
| Delay time | Temps avant la première répétition | 50 - 2000 ms |
| Feedback | Proportion du signal renvoyée dans l'entrée | 0 - 0.95 (jamais >= 1) |
| Mix (dry/wet) | Proportion original/retardé | 0 - 1 |

Le diagramme suivant montre l'architecture d'un delay avec boucle de feedback :

<div class="diagram-design">
<p><a href="../../../diagrams/faust-04-dsp-applique-03-effets-audio-1.html">Qu&#x27;est-ce qu&#x27;un delay ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/faust-04-dsp-applique-03-effets-audio-1.html" title="Qu&#x27;est-ce qu&#x27;un delay ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que le chorus ?

**Définition** : Le chorus épaissit le son en mixant le signal original avec une copie dont le temps de retard oscille lentement (LFO). Cette variation crée un léger désaccordage qui simule plusieurs instruments jouant ensemble.

**Le problème que le chorus résout** :

1. **Son trop fin** : un seul instrument sonne maigre par rapport à un ensemble
2. **Manque de richesse** : le signal est statique, sans mouvement spectral

| Problème | Solution |
| -------- | -------- |
| Son trop fin | Le désaccordage simule plusieurs instruments ensemble |
| Manque de richesse | La modulation du delay crée un mouvement spectral continu |

**Analogie concrète** : Imagine un choeur de 20 chanteurs sur la même note. Chaque chanteur est légèrement décalé en hauteur et en timing. Le résultat sonne plus large et plus vivant qu'un seul chanteur. Le chorus reproduit cet effet avec une seule source.

**Comparaison chorus vs flanger** :

| Chorus | Flanger |
| ------ | ------- |
| Delay : 1-20 ms | Delay : 0.1-5 ms |
| LFO : 0.1-5 Hz | LFO : 0.1-10 Hz |
| Feedback faible (0-0.3) | Feedback élevé (0-0.95) |
| Son épais, large | Son métallique, filtre en peigne |

---

### Qu'est-ce que le flanger ?

**Définition** : Le flanger utilise un delay très court (0.1-5 ms), modulé par un LFO, avec un feedback prononcé. La combinaison du signal original et du signal retardé crée un filtre en peigne dont les encoches balaient le spectre.

**Analogie concrète** : Le nom vient d'une technique des années 1960 : un ingénieur posait le doigt sur le rebord (flange) d'une bande magnétique pour la ralentir légèrement. Ce décalage variable créait l'effet caractéristique de "jet".

#### Le filtre en peigne (comb filter)

Additionner un signal avec une copie retardée de quelques ms annule certaines fréquences et en renforce d'autres :

```text
Réponse en fréquence d'un filtre en peigne (delay = 2 ms) :

Amplitude
  1 ┤  ╱╲      ╱╲      ╱╲      ╱╲      ╱╲
    │ ╱  ╲    ╱  ╲    ╱  ╲    ╱  ╲    ╱  ╲
  0 ┤──────╲╱──────╲╱──────╲╱──────╲╱──────╲╱───
    └──┬──────┬──────┬──────┬──────┬──────── Hz
       0    500   1000   1500   2000   2500

Encoches espacées de 1/delay = 500 Hz. Le LFO les déplace dans le spectre.
```

---

### Qu'est-ce que le phaser ?

**Définition** : Le phaser fait passer le signal à travers une chaîne de filtres allpass modulés par un LFO. Le mélange du signal filtré avec l'original crée des encoches irrégulièrement espacées qui balaient le spectre.

**Analogie concrète** : Imagine un store vénitien devant une fenêtre. En inclinant les lames, tu bloques certaines bandes de lumière. Le phaser crée des "lames" qui bloquent certaines bandes de fréquence, et le LFO les fait pivoter lentement.

**Comparaison flanger vs phaser** :

| Flanger | Phaser |
| ------- | ------ |
| Basé sur un delay court | Basé sur des filtres allpass |
| Encoches harmoniquement espacées | Encoches irrégulièrement espacées |
| Son métallique, "jet" | Son doux, "tournant" |

Un filtre allpass laisse passer toutes les fréquences avec la même amplitude mais modifie leur phase. En additionnant le signal original et le signal déphasé, les fréquences en opposition de phase s'annulent.

```text
Phaser à 4 étages :

Signal ──┬──────────────────────────────────┬── Sortie
         │                                  │
         └── [AP1] ── [AP2] ── [AP3] ── [AP4] ──┘
                        ▲
                      [LFO]

4 étages = 2 encoches. Règle : encoches = étages / 2.
```

---

### Qu'est-ce que la reverb ?

**Définition** : La reverb simule les réflexions sonores dans un espace clos. Un son émis dans une pièce rebondit sur les surfaces, créant des milliers de réflexions qui s'estompent progressivement.

**Le problème que la reverb résout** :

1. **Son anéchoique** : un son sans réverbération sonne artificiel
2. **Pas de spatialisation** : impossible de simuler un espace réel
3. **Mix sans cohésion** : les instruments semblent jouer dans des espaces différents

| Problème | Solution apportée par la reverb |
| -------- | ------------------------------- |
| Son anéchoique | La reverb ajoute les réflexions que l'oreille attend |
| Pas de spatialisation | Les paramètres caractérisent un type d'espace |
| Mix sans cohésion | La même reverb place tous les instruments dans le même espace |

**Analogie concrète** : Frappe dans tes mains dans une salle de bains (écho court, brillant) puis dans une cathédrale (écho long, diffus). La reverb numérique reproduit ces réflexions avec des réseaux de delays et de filtres.

**Ce que la reverb n'est PAS** :

- La reverb n'est pas un delay. Le delay produit des répétitions distinctes. La reverb produit un continuum dense de réflexions qui fusionnent.

#### Algorithme de Schroeder

```text
                    ┌── [Comb 1] ──┐
Signal ─────────────├── [Comb 2] ──┤──(+)── [AP 1] ── [AP 2] ── Sortie
                    ├── [Comb 3] ──┤
                    └── [Comb 4] ──┘

4 filtres comb en parallèle (réflexions) + 2 allpass en série (diffusion).
Filtre comb = delay + feedback : combfilter(dt, fb) = + ~ (@(dt) * fb);
```

#### Reverb FDN (Feedback Delay Network)

Évolution de Schroeder : une matrice de couplage (Hadamard) mélange les sorties de tous les delays avant réinjection, créant des réflexions croisées plus denses. La bibliothèque `re` fournit des reverbs prêtes à l'emploi (`re.mono_freeverb`).

---

### Qu'est-ce qu'un compresseur ?

**Définition** : Un compresseur réduit automatiquement le volume des sons forts. Quand le signal dépasse un seuil (threshold), le compresseur atténue les crêtes selon un ratio configurable.

**Le problème que le compresseur résout** :

1. **Dynamique trop large** : sons forts trop forts, sons faibles inaudibles
2. **Crêtes qui saturent** : les pics transitoires dépassent le seuil de distorsion
3. **Manque de densité** : variations de volume gênantes

**Analogie concrète** : Imagine quelqu'un qui monte et baisse constamment le volume de la télévision : dialogues (faibles) = monte, explosions (fortes) = baisse. Le compresseur fait cela automatiquement.

**Comparaison compresseur vs limiteur** :

| Compresseur | Limiteur |
| ----------- | -------- |
| Ratio : 2:1 à 8:1 | Ratio : infini (> 20:1) |
| Atténue les crêtes | Bloque les crêtes |
| Attack réglable | Attack très rapide (< 1 ms) |

| Paramètre | Description | Valeurs typiques |
| --------- | ----------- | ---------------- |
| Threshold | Niveau à partir duquel comprimer | -40 à 0 dB |
| Ratio | Taux de réduction (4:1 = 4 dB d'excès -> 1 dB en sortie) | 1:1 à 20:1 |
| Attack | Temps de réaction | 0.1 - 100 ms |
| Release | Temps de retour au gain normal | 10 - 1000 ms |
| Makeup gain | Compensation de volume après compression | 0 - 30 dB |

```text
Courbe de compression (threshold = -20 dB, ratio = 4:1) :

Sortie (dB)
  0 ┤                              ___── sans compression (1:1)
-10 ┤                    ___──  ── avec compression (4:1)
-20 ┤          ___──────── threshold
-30 ┤___──
    └─────┬───────┬───────┬──── Entrée (dB)
        -40     -20      0

Sous -20 dB : signal inchangé. Au-dessus : 4 dB d'excès -> 1 dB en sortie.
```

---

### Qu'est-ce que la spatialisation ?

**Définition** : La spatialisation positionne un son dans l'espace stéréo. La technique la plus courante est le panoramique (panning), qui distribue le signal entre gauche et droite.

**Analogie concrète** : Comme l'agencement des plats sur une table : empilés au centre, on ne distingue rien. Répartis, chaque plat est identifiable. Le panoramique place chaque instrument à un endroit précis.

#### Lois de panoramique

| Loi | Formule | Centre |
| --- | ------- | ------ |
| Linéaire | $L = 1 - \text{pan}$, $R = \text{pan}$ | Perte de volume (-6 dB) |
| Puissance constante | $L = \cos(\text{pan} \cdot \pi/2)$, $R = \sin(\text{pan} \cdot \pi/2)$ | Volume constant |

En Faust, `sp.panner(pan)` est un panoramique **linéaire** (mono vers stéréo, pan de 0 à 1). La loi de puissance constante est fournie par `sp.constantPowerPan(pan)` (stéréo vers stéréo). Source : [spats.lib](https://faustlibraries.grame.fr/libs/spats/).

---

## Étapes Pratiques

### Étape 1 : Créer une distorsion soft-clip avec tanh

```faust
import("stdfaust.lib");

// Soft clip normalisé : drive contrôle l'intensité (1-20)
softclip(drive, x) = ma.tanh(x * drive) / ma.tanh(drive);

process = _ : *(input_gain) : softclip(drive) : *(output_gain)
with {
    input_gain = hslider("[1]Input Gain (dB)", 0, -12, 24, 0.1) : ba.db2linear;
    drive = hslider("[2]Drive", 1, 1, 20, 0.1);
    output_gain = hslider("[3]Output Gain (dB)", 0, -24, 6, 0.1) : ba.db2linear;
};
```

```bash
faust2jaqt softclip.dsp
```

**Résultat attendu** :

```text
- Drive 1 : signal quasi-inchangé, son propre et transparent.
- Drive 5 : crêtes arrondies, son légèrement plus chaud.
- Drive 15-20 : forte saturation, beaucoup d'harmoniques ajoutées.
```

---

### Étape 2 : Implémenter un delay stéréo avec feedback

```faust
import("stdfaust.lib");

// Delay mono avec feedback et mixage dry/wet
delay_fb(delayMs, fb) = + ~ (@(d) * fb)
with {
    d = int(delayMs / 1000 * ma.SR);
};

drywet(mix, effect) = _ <: *(1 - mix), effect * mix :> _;

// Appliqué en parallèle sur 2 canaux (stéréo)
process = par(i, 2, drywet(mix, delay_fb(delay_time, feedback)))
with {
    delay_time = hslider("[1]Delay Time (ms)", 300, 10, 2000, 1);
    feedback = hslider("[2]Feedback", 0.4, 0, 0.95, 0.01);
    mix = hslider("[3]Dry/Wet", 0.3, 0, 1, 0.01);
};
```

```bash
faust2jaqt stereo_delay.dsp
```

**Résultat attendu** :

```text
- Feedback 0 : écho unique après le temps configuré.
- Feedback 0.5 : 4-5 répétitions audibles, volume décroissant.
- Feedback 0.9 : longue queue de plusieurs secondes.
  Attention : feedback >= 1.0 = signal qui explose (volume infini).
```

---

### Étape 3 : Créer un chorus mono

```faust
import("stdfaust.lib");

// Chorus : delay modulé par LFO sinusoidal
chorus_mono(rate, depth, base_delay, mix, x) = x * (1 - mix) + delayed * mix
with {
    maxdel = int((base_delay + depth + 10) / 1000 * ma.SR);
    lfo = os.osc(rate);
    mod_delay = (base_delay + lfo * depth) / 1000 * ma.SR;
    delayed = x : de.fdelay(maxdel, mod_delay);
};

process = chorus_mono(rate, depth, base_delay, mix)
with {
    rate = hslider("[1]Rate (Hz)", 1.5, 0.1, 5, 0.01);
    depth = hslider("[2]Depth (ms)", 3, 0.5, 15, 0.1);
    base_delay = hslider("[3]Base Delay (ms)", 10, 5, 30, 0.1);
    mix = hslider("[4]Dry/Wet", 0.5, 0, 1, 0.01);
};
```

```bash
faust2jaqt chorus.dsp
```

**Résultat attendu** :

```text
- Rate 1.5 Hz, Depth 3 ms : chorus subtil, son légèrement plus large.
- Rate 0.5 Hz, Depth 8 ms : chorus prononcé, effet de "vague" audible.
- Rate 4 Hz, Depth 1 ms : vibrato (tremblement de hauteur).
```

---

### Étape 4 : Implémenter une reverb Schroeder simplifiée

```faust
import("stdfaust.lib");

comb(dt, fb) = + ~ (@(dt) * fb);

schroeder_reverb(rt60, damping, mix, x) = x * (1 - mix) + reverbed * mix
with {
    // 4 temps de delay premiers entre eux (en échantillons)
    dt1 = int(0.0297 * ma.SR);  dt2 = int(0.0371 * ma.SR);
    dt3 = int(0.0411 * ma.SR);  dt4 = int(0.0437 * ma.SR);

    // Feedback calculé pour le RT60 souhaité
    fb(dt) = 10 ^ (-3 * dt / (rt60 * ma.SR));

    // Filtre passe-bas pour le damping (absorption de l'air)
    lpf = *(1 - damping) : + ~ *(damping);

    // 4 combs en parallèle + passe-bas
    comb_section = x <:
        (comb(dt1, fb(dt1)) : lpf), (comb(dt2, fb(dt2)) : lpf),
        (comb(dt3, fb(dt3)) : lpf), (comb(dt4, fb(dt4)) : lpf)
    :> /(4);

    // 2 allpass en série pour la diffusion
    allpass_section = fi.allpass_comb(1024, int(0.005 * ma.SR), 0.7)
                    : fi.allpass_comb(512, int(0.0017 * ma.SR), 0.7);

    reverbed = comb_section : allpass_section;
};

process = _ : schroeder_reverb(rt60, damping, mix)
with {
    rt60 = hslider("[1]RT60 (s)", 1.5, 0.3, 5, 0.1);
    damping = hslider("[2]Damping", 0.3, 0, 0.9, 0.01);
    mix = hslider("[3]Dry/Wet", 0.3, 0, 1, 0.01);
};
```

```bash
faust2jaqt schroeder_reverb.dsp
```

**Résultat attendu** :

```text
- RT60 0.5 s, Damping 0.5 : petite pièce, reverb courte et mate.
- RT60 1.5 s, Damping 0.3 : salle moyenne, reverb naturelle.
- RT60 4 s, Damping 0.1 : cathédrale, queue très longue et brillante.

Pour une qualité studio, utilise re.mono_freeverb de la bibliothèque.
```

---

### Étape 5 : Utiliser le compresseur de la bibliothèque

```faust
import("stdfaust.lib");

// co.compressor_mono(ratio, threshold_dB, attack_s, release_s)
process = _ : compressor : *(makeup)
with {
    threshold = hslider("[1]Threshold (dB)", -20, -60, 0, 0.1);
    ratio = hslider("[2]Ratio", 4, 1, 20, 0.1);
    attack = hslider("[3]Attack (ms)", 10, 0.1, 100, 0.1) / 1000;
    release = hslider("[4]Release (ms)", 100, 10, 1000, 1) / 1000;
    makeup = hslider("[5]Makeup Gain (dB)", 0, 0, 30, 0.1) : ba.db2linear;
    compressor = co.compressor_mono(ratio, threshold, attack, release);
};
```

```bash
faust2jaqt compressor.dsp
```

**Résultat attendu** :

```text
- Threshold -20 dB, Ratio 4:1 : compression modérée, son plus homogène.
- Threshold -10 dB, Ratio 2:1 : compression légère, quasi-naturel.
- Threshold -30 dB, Ratio 10:1 : compression agressive, son dense et écrasé.
  Ajoute 10-20 dB de makeup gain pour compenser.
```

---

## Commandes Utiles

| Code Faust | Action |
| ---------- | ------ |
| `ma.tanh(x * drive)` | Saturation douce (soft clip) |
| `x @ int(d)` | Retarde de d échantillons |
| `+ ~ (@(d) * fb)` | Delay avec feedback |
| `_ : de.fdelay(maxd, d)` | Delay fractionnaire (interpolation) |
| `os.osc(freq)` | LFO sinusoidal |
| `fi.allpass_comb(maxd, d, fb)` | Filtre allpass |
| `re.mono_freeverb(fb1, fb2, damp, spread)` | Reverb mono |
| `co.compressor_mono(ratio, th, att, rel)` | Compresseur mono |
| `sp.panner(pan)` | Panoramique stéréo linéaire (0 = gauche, 1 = droite) |
| `sp.constantPowerPan(pan)` | Panoramique stéréo à puissance constante (entrée stéréo) |
| `ba.db2linear` | dB vers gain linéaire |

---

## Pièges Fréquents

### Piège 1 : Feedback >= 1 dans un delay

**Problème** : Si le feedback est >= 1, le signal croît indéfiniment et explose en quelques millisecondes (bruit dangereux pour les enceintes et l'audition).

**Solution** : Plafonner le feedback à 0.95 dans l'interface.

```faust
// Mauvais : feedback peut atteindre 1.0
feedback = hslider("Feedback", 0.5, 0, 1, 0.01);
// Correct : plafonné à 0.95
feedback = hslider("Feedback", 0.5, 0, 0.95, 0.01);
```

---

### Piège 2 : Oublier la normalisation après distorsion

**Problème** : `tanh(x * drive)` sans normalisation augmente le volume de sortie quand le drive augmente.

**Solution** : Diviser par `tanh(drive)` pour normaliser.

```faust
// Mauvais
distortion(drive, x) = ma.tanh(x * drive);
// Correct
distortion(drive, x) = ma.tanh(x * drive) / ma.tanh(drive);
```

---

### Piège 3 : Taille de buffer insuffisante pour le delay

**Problème** : En Faust, la taille max du delay doit être connue à la compilation. Buffer trop petit = comportement indéfini.

**Solution** : Utiliser `de.fdelay` avec un maxdelay calculé à partir du slider.

```faust
// Mauvais : pas de taille max
delayed = x @ int(delayMs / 1000 * ma.SR);
// Correct : maxdelay explicite
delayed = de.fdelay(int(2 * ma.SR), delayMs / 1000 * ma.SR, x);
```

---

### Piège 4 : Chorus qui crée des clics audio

**Problème** : Un delay à échantillons entiers (`@`) crée des discontinuités quand le LFO module le delay.

**Solution** : Utiliser `de.fdelay` (delay fractionnaire) qui interpole entre les échantillons.

---

### Piège 5 : Compresseur sans makeup gain

**Problème** : Le compresseur réduit le volume des crêtes. Sans makeup gain, le signal semble plus faible.

**Solution** : Ajouter du makeup gain en sortie (6-12 dB si le compresseur réduit de 12 dB max).

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre hard clip et soft clip
- [ ] Je sais implémenter une distorsion tanh normalisée en Faust
- [ ] Je comprends le rôle du feedback dans un delay et pourquoi il ne doit jamais atteindre 1.0
- [ ] Je sais créer un delay avec feedback en utilisant l'opérateur `~`
- [ ] Je comprends comment un LFO module le delay pour créer un chorus
- [ ] Je sais expliquer la différence entre chorus, flanger et phaser
- [ ] Je comprends le filtre en peigne et son rôle dans le flanger et la reverb
- [ ] Je sais expliquer l'algorithme de Schroeder (comb parallèles + allpass séries)
- [ ] Je connais les paramètres d'un compresseur (threshold, ratio, attack, release, makeup gain)
- [ ] Je sais utiliser `co.compressor_mono` de la bibliothèque Faust
- [ ] Je comprends la loi de puissance constante pour le panoramique stéréo

---

## Exercice Pratique

**Énoncé** : Crée un pedalboard virtuel avec 4 effets en série : distorsion, chorus, delay et reverb. Chaque effet a un bypass individuel et ses propres contrôles dans un groupe UI dédié.

**Indications** :

- Utilise `vgroup` pour organiser les contrôles de chaque effet
- Chaque effet a un `checkbox` de bypass
- Chaîne : distorsion -> chorus -> delay -> reverb
- La distorsion utilise `tanh` avec contrôle de drive
- Le chorus utilise un LFO sinusoidal avec rate et depth
- Le delay a des contrôles de temps, feedback et mix
- La reverb utilise `re.mono_freeverb`
- Ajoute un volume master en sortie

**Résultat attendu** :

- 4 groupes de contrôles + volume master
- Chaque effet activable/désactivable individuellement
- Signal mono en entrée, mono en sortie

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
import("stdfaust.lib");

// Bypass : si activé (1), le signal passe sans modification
// select2(sel) choisit entre ses 2 entrées : entrée 1 si sel=0, entrée 2 si sel=1
bypass_switch(bypass, effect) = _ <: (effect, _) : select2(bypass);

// ── Distorsion ──
distortion = bypass_switch(bp, effect)
with {
    bp = vgroup("[1]Distortion", checkbox("[0]Bypass"));
    effect = vgroup("[1]Distortion", *(ig) : sc(dr) : *(og));
    dr = vgroup("[1]Distortion", hslider("[1]Drive", 3, 1, 20, 0.1));
    ig = vgroup("[1]Distortion", hslider("[2]Input (dB)", 0, -12, 24, 0.1)
         : ba.db2linear);
    og = vgroup("[1]Distortion", hslider("[3]Output (dB)", 0, -24, 6, 0.1)
         : ba.db2linear);
    sc(d, x) = ma.tanh(x * d) / ma.tanh(d);
};

// ── Chorus ──
chorus = bypass_switch(bp, effect)
with {
    bp = vgroup("[2]Chorus", checkbox("[0]Bypass"));
    effect = vgroup("[2]Chorus", chorus_engine);
    rate = vgroup("[2]Chorus", hslider("[1]Rate (Hz)", 1.5, 0.1, 5, 0.01));
    depth = vgroup("[2]Chorus", hslider("[2]Depth (ms)", 3, 0.5, 15, 0.1));
    bdel = vgroup("[2]Chorus", hslider("[3]Base Delay (ms)", 10, 5, 30, 0.1));
    mix = vgroup("[2]Chorus", hslider("[4]Mix", 0.5, 0, 1, 0.01));
    chorus_engine(x) = x * (1 - mix) + (x : de.fdelay(maxd, md)) * mix
    with {
        maxd = int((bdel + depth + 10) / 1000 * ma.SR);
        md = (bdel + os.osc(rate) * depth) / 1000 * ma.SR;
    };
};

// ── Delay ──
delay_effect = bypass_switch(bp, effect)
with {
    bp = vgroup("[3]Delay", checkbox("[0]Bypass"));
    effect = vgroup("[3]Delay", delay_engine);
    dt = vgroup("[3]Delay", hslider("[1]Time (ms)", 300, 10, 2000, 1));
    fb = vgroup("[3]Delay", hslider("[2]Feedback", 0.4, 0, 0.95, 0.01));
    mix = vgroup("[3]Delay", hslider("[3]Mix", 0.3, 0, 1, 0.01));
    delay_engine(x) = x * (1 - mix) + wet * mix
    with {
        d = int(dt / 1000 * ma.SR);
        // maxdel doit être une constante connue à la compilation
        maxdel = 96000;  // 2 secondes à 48 kHz
        wet = x : + ~ (de.fdelay(maxdel, d) * fb);
    };
};

// ── Reverb ──
reverb_effect = bypass_switch(bp, effect)
with {
    bp = vgroup("[4]Reverb", checkbox("[0]Bypass"));
    effect = vgroup("[4]Reverb", reverb_engine);
    rm = vgroup("[4]Reverb", hslider("[1]Room Size", 0.7, 0, 1, 0.01));
    dp = vgroup("[4]Reverb", hslider("[2]Damping", 0.5, 0, 1, 0.01));
    mix = vgroup("[4]Reverb", hslider("[3]Mix", 0.3, 0, 1, 0.01));
    // re.mono_freeverb(fb1, fb2, damp, spread) : rm pilote la taille de salle,
    // fb2 = 0.5 (allpass), dp pilote l'amortissement, spread = 0
    reverb_engine(x) = x * (1 - mix) + (x : re.mono_freeverb(rm, 0.5, dp, 0))
                        * mix;
};

// ── Master ──
master = *(vgroup("[5]Master",
    hslider("[1]Volume (dB)", 0, -60, 6, 0.1) : ba.db2linear));

// ── Pedalboard ──
process = distortion : chorus : delay_effect : reverb_effect : master;
```

**Test du pedalboard** :

```bash
faust2jaqt pedalboard.dsp
```

**Résultat attendu** :

```text
1. Tous les bypass activés : signal identique à l'entrée.
2. Distorsion seule : drive à 10, son saturé et chaud.
3. Distorsion + Chorus : son saturé plus large et ondulant.
4. Les 4 effets : signal saturé, épaissi, répété et spatialisé.
   Suggestion : Drive 5, Chorus Mix 0.3, Delay Mix 0.2, Reverb Mix 0.25.
5. Volume master : réglage global sans affecter les effets.
```

---

## Navigation

← Fiche précédente : **[02 - Filtres](02-filtres.md)**

→ Fiche suivante : **[04 - Modélisation physique](04-modelisation-physique.md)**
