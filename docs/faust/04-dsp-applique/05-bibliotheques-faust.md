---
tags:
  - Faust
  - Intermédiaire
  - Concept
description: "Bibliothèques Faust - stdfaust.lib, tour complet des bibliothèques standard et conventions"
estimated_time: "75 min"
fiche_number: 5
total_fiches: 6
cursus: "Phase 4 - DSP appliqué"
---

# 05 - Bibliothèques Faust

> **En bref** : À la fin de cette fiche, tu sauras naviguer dans les bibliothèques standard de Faust, trouver la bonne fonction pour chaque besoin et comprendre les conventions de nommage. Lecture estimée : 75 min.


## Prérequis

- [Fiche 01 - Oscillateurs et synthèse](01-oscillateurs-synthese.md) : oscillateurs, enveloppes ADSR, synthèse AM/FM
- [Fiche 02 - Filtres](02-filtres.md) : passe-bas, passe-haut, résonant, biquad
- [Fiche 03 - Effets audio](03-effets-audio.md) : delay, chorus, reverb, compresseur

## Objectif de cette fiche

À la fin de cette fiche, tu sauras naviguer dans les bibliothèques standard de Faust, trouver la bonne fonction pour chaque besoin et comprendre les conventions de nommage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que stdfaust.lib ?

**Définition** : `stdfaust.lib` est la méta-bibliothèque de Faust. C'est un fichier unique qui importe automatiquement toutes les bibliothèques standard. En une seule ligne, tu obtiens accès à l'ensemble des fonctions disponibles.

**Le problème que stdfaust.lib résout** :

Sans `stdfaust.lib`, voici les problèmes rencontrés :

1. **Imports multiples** : tu dois écrire une ligne d'import pour chaque bibliothèque utilisée
2. **Oubli d'import** : si tu utilises une fonction sans avoir importé sa bibliothèque, le compilateur renvoie une erreur

**Comment stdfaust.lib résout ces problèmes** :

| Problème | Solution apportée par stdfaust.lib |
| -------- | ---------------------------------- |
| Imports multiples | Une seule ligne importe tout : `import("stdfaust.lib");` |
| Oubli d'import | Toutes les bibliothèques sont disponibles en permanence |

**Analogie concrète** : `stdfaust.lib` fonctionne comme une boîte à outils complète. Au lieu d'aller chercher le tournevis dans le tiroir A, le marteau dans le tiroir B et la clé dans le tiroir C, tu ouvres une seule boîte qui contient tous tes outils, chacun rangé dans son compartiment avec une étiquette.

**Ce que stdfaust.lib n'est PAS** :

- `stdfaust.lib` n'est pas une bibliothèque de fonctions. Elle ne définit aucune fonction elle-même. Elle se contente de ré-exporter les fonctions de toutes les autres bibliothèques.
- `stdfaust.lib` n'est pas obligatoire. Tu peux importer chaque bibliothèque individuellement si tu préfères un contrôle explicite.

```faust
// Convention universelle : toujours en première ligne de tout programme Faust
import("stdfaust.lib");

// Alternative explicite (rarement utilisée) :
// import("oscillators.lib");
// import("filters.lib");
```

---

### Tour complet des bibliothèques standard

Les sections suivantes présentent chaque bibliothèque avec son préfixe, ses fonctions clés et un exemple d'utilisation.

#### maths.lib (ma) - Constantes et conversions

Constantes fondamentales et fonctions de conversion entre unités audio.

**Constantes principales** :

| Constante | Description |
| --------- | ----------- |
| `ma.PI` | Pi (3.14159...) |
| `ma.SR` | Fréquence d'échantillonnage courante (ex. 44100, 48000) |
| `ma.BS` | Taille du buffer audio courant |
| `ma.T` | Période d'échantillonnage (1/SR, durée d'un sample en secondes) |

Ces conversions d'unités audio **ne sont pas** dans `maths.lib` : elles vivent dans `basics.lib` (préfixe `ba.`). Tu les as quand même après `import("stdfaust.lib");`.

**Fonctions de conversion (`ba.`, basics.lib)** :

| Fonction | Description |
| -------- | ----------- |
| `ba.db2linear(x)` | Convertit des dB en amplitude linéaire |
| `ba.linear2db(x)` | Convertit une amplitude linéaire en dB |
| `ba.midikey2hz(n)` | Convertit un numéro MIDI (0-127) en fréquence Hz |
| `ba.hz2midikey(f)` | Convertit une fréquence Hz en numéro MIDI |

```faust
import("stdfaust.lib");

// Oscillateur contrôlé par un numéro MIDI, volume en dB
freq = ba.midikey2hz(hslider("note", 69, 24, 96, 1));
gain = ba.db2linear(hslider("volume [unit:dB]", -12, -96, 0, 0.1));
process = os.osc(freq) * gain;
```

---

#### basics.lib (ba) - Utilitaires de base

Compteurs, sélecteurs, bypass, conversions tempo/échantillons.

| Fonction | Description |
| -------- | ----------- |
| `ba.bus(N)` | Bus de N signaux parallèles (identité sur N canaux) |
| `ba.selector(i, N)` | Sélectionne l'entrée i (0-based) parmi N (constantes à la compilation) |
| `ba.counter(trig)` | Compteur incrémenté à chaque trigger |
| `ba.time` | Compteur d'échantillons depuis le début de l'exécution |
| `ba.tempo(bpm)` | Nombre d'échantillons par beat à un BPM donné |
| `ba.sec2samp(s)` | Convertit des secondes en nombre d'échantillons |
| `ba.bypass1(b, fx)` | Bypass mono : si b=1, le signal contourne l'effet fx |
| `ba.bypass2(b, fx)` | Bypass stéréo |
| `ba.if(cond, then, else)` | Sélection conditionnelle entre deux signaux |

```faust
import("stdfaust.lib");

// Effet avec bypass contrôlé par un bouton
bypass = checkbox("bypass");
effect = fi.lowpass(2, 800);
process = ba.bypass1(bypass, effect);
```

---

#### signals.lib (si) - Manipulation de signaux

Lissage, blocage, interpolation et contrôle de flux.

| Fonction | Description |
| -------- | ----------- |
| `si.smoo` | Lissage par défaut (~10 ms), élimine les clics sur les paramètres UI |
| `si.smooth(s)` | Lissage exponentiel paramétrable (s = coefficient du pôle, 0 à 1) |
| `si.bus(N)` | Bus de N signaux identité |
| `si.block(N)` | Bloque N signaux (remplace par des zéros) |
| `si.interpolate(d, x, y)` | Interpolation linéaire entre x et y (d : 0=x, 1=y) |

```faust
import("stdfaust.lib");

// Slider de fréquence lissé pour éviter les clics
freq = hslider("freq", 440, 100, 2000, 1) : si.smoo;
gain = hslider("gain", 0.5, 0, 1, 0.01) : si.smoo;
process = os.osc(freq) * gain;
```

---

#### oscillators.lib (os) - Générateurs de formes d'onde

Tous les oscillateurs standard, bandlimités pour l'audio et non-bandlimités pour les LFO.

| Fonction | Forme d'onde | Bandlimité | Sortie |
| -------- | ------------ | ---------- | ------ |
| `os.osc(f)` | Sinusoïde | Oui | -1 à +1 |
| `os.sawtooth(f)` | Dents de scie | Oui | -1 à +1 |
| `os.square(f)` | Carrée | Oui | -1 à +1 |
| `os.triangle(f)` | Triangle | Oui | -1 à +1 |
| `os.imptrain(f)` | Train d'impulsions | Oui | 0 ou 1 |
| `os.lf_saw(f)` | Dents de scie LFO | Non | -1 à +1 |
| `os.lf_squarewave(f)` | Carrée LFO | Non | -1 ou +1 |
| `os.lf_triangle(f)` | Triangle LFO | Non | -1 à +1 |

**Différence audio vs LFO** :

| Oscillateur audio (os.sawtooth) | LFO (os.lf_saw) |
| ------------------------------- | ---------------- |
| Bandlimité (pas d'aliasing) | Non bandlimité (plus rapide) |
| Pour les fréquences audibles (20-20000 Hz) | Pour les fréquences basses (0.01-20 Hz) |
| Sortie bipolaire (-1 à +1) | Sortie bipolaire (-1 à +1) |

---

#### noises.lib (no) - Générateurs de bruit

| Fonction | Description |
| -------- | ----------- |
| `no.noise` | Bruit blanc (toutes les fréquences à énergie égale) |
| `no.pink_noise` | Bruit rose (-3 dB/octave, énergie égale par octave) |
| `no.lfnoise(f)` | Bruit basse fréquence interpolé à fréquence f |
| `no.lfnoise0(f)` | Bruit basse fréquence non interpolé (paliers) |
| `no.multinoise(N)` | N canaux de bruit indépendants |

```faust
import("stdfaust.lib");

// Synthèse soustractive : bruit blanc filtré par un passe-bas résonant
cutoff = hslider("cutoff", 1000, 100, 10000, 1) : si.smoo;
process = no.noise : fi.resonlp(cutoff, 5, 1);
```

---

#### filters.lib (fi) - Filtres numériques

| Fonction | Type | Paramètres |
| -------- | ---- | ---------- |
| `fi.lowpass(N, fc)` | Passe-bas Butterworth | N = ordre, fc = coupure |
| `fi.highpass(N, fc)` | Passe-haut Butterworth | N = ordre, fc = coupure |
| `fi.bandpass(N, fl, fh)` | Passe-bande | N = ordre, fl/fh = bornes |
| `fi.resonlp(fc, Q, gain)` | Passe-bas résonant | fc = coupure, Q = résonance |
| `fi.resonhp(fc, Q, gain)` | Passe-haut résonant | fc = coupure, Q = résonance |
| `fi.peak_eq(gain, fc, bw)` | EQ paramétrique (peak) | gain = dB, fc = centre, bw = bande passante (Hz) |
| `fi.low_shelf(gain, fc)` | Shelf bas | gain = dB, fc = transition |
| `fi.high_shelf(gain, fc)` | Shelf haut | gain = dB, fc = transition |
| `fi.allpass_fcomb(dmax, d, g)` | Allpass comb | delay + feedback |
| `fi.notchw(width, fc)` | Coupe-bande (notch) | width = largeur |
| `fi.tf2(b0, b1, b2, a1, a2)` | Biquad (coefficients directs) | 5 coefficients |

```faust
import("stdfaust.lib");

// EQ paramétrique 3 bandes
eq = fi.low_shelf(hslider("low [unit:dB]", 0, -24, 24, 0.1), 200)
   : fi.peak_eq(hslider("mid [unit:dB]", 0, -24, 24, 0.1), 1000, 500)
   : fi.high_shelf(hslider("high [unit:dB]", 0, -24, 24, 0.1), 5000);
process = eq;
```

---

#### envelopes.lib (en) - Enveloppes temporelles

| Fonction | Description |
| -------- | ----------- |
| `en.adsr(a, d, s, r, gate)` | Enveloppe ADSR (a/d/r en secondes, s en 0-1) |
| `en.asr(a, s, r, gate)` | Enveloppe sans phase decay |
| `en.ar(a, r, gate)` | Enveloppe attaque-relâchement |
| `en.smoothEnvelope(t, gate)` | Enveloppe lissée (S-curve) |

```faust
import("stdfaust.lib");

// Synthétiseur avec enveloppe ADSR
freq = hslider("freq", 440, 50, 2000, 1);
gate = button("gate");
process = os.sawtooth(freq) * en.adsr(0.01, 0.2, 0.7, 0.3, gate);
```

---

#### compressors.lib (co) - Traitement de la dynamique

| Fonction | Description |
| -------- | ----------- |
| `co.compressor_mono(ratio, thresh, att, rel)` | Compresseur mono |
| `co.compressor_stereo(ratio, thresh, att, rel)` | Compresseur stéréo (détection liée) |
| `co.limiter_1176_R4_mono` | Limiteur inspiré du 1176 mono |
| `co.limiter_1176_R4_stereo` | Limiteur inspiré du 1176 stéréo |

Paramètres : ratio (2-20), thresh (dB, -30 à 0), att (secondes, 0.001-0.1), rel (secondes, 0.05-0.5).

```faust
import("stdfaust.lib");

// Compresseur mono : ratio 4:1, seuil -20 dB, attaque 5 ms, relâchement 100 ms
process = co.compressor_mono(4, -20, 0.005, 0.1);
```

---

#### reverbs.lib (re) - Réverbérations

| Fonction | Description |
| -------- | ----------- |
| `re.mono_freeverb(fb1, fb2, damp, spread)` | Freeverb mono |
| `re.stereo_freeverb(fb1, fb2, damp, spread)` | Freeverb stéréo |
| `re.fdnrev0(maxdel, f1, f2, t60dc, t60m)` | Feedback Delay Network |
| `re.zita_rev1_stereo(rdel, f1, f2, t60dc, t60m, fsmax)` | Zita-Rev1 stéréo (haute qualité) |

---

#### delays.lib (de) - Lignes de retard

| Fonction | Description |
| -------- | ----------- |
| `de.delay(maxdel, d)` | Delay entier (d en échantillons) |
| `de.fdelay(maxdel, d)` | Delay fractionnaire avec interpolation linéaire |
| `de.sdelay(maxdel, interp, d)` | Delay fractionnaire avec interpolation de Lagrange |

`maxdel` doit être une constante connue à la compilation. `d` peut varier dynamiquement mais doit rester inférieur ou égal à `maxdel`.

```faust
import("stdfaust.lib");

// Echo simple avec feedback
delay_ms = hslider("delay [unit:ms]", 300, 10, 1000, 1) : si.smoo;
feedback = hslider("feedback", 0.4, 0, 0.95, 0.01) : si.smoo;
maxdel = 48000;  // 1 seconde à 48 kHz
echo = + ~ (de.fdelay(maxdel, delay_ms * ma.SR / 1000) * feedback);
process = echo;
```

---

#### routes.lib (ro) - Routage de signaux

| Fonction | Description |
| -------- | ----------- |
| `ro.cross(N)` | Croise N signaux (inverse leur ordre) |
| `ro.crossnn(N)` | Échange deux groupes de N signaux |
| `ro.interleave(N, M)` | Entrelace N groupes de M signaux |
| `ro.hadamard(N)` | Matrice de Hadamard N x N (N = puissance de 2) |

---

#### spats.lib (sp) - Spatialisation

| Fonction | Description |
| -------- | ----------- |
| `sp.panner(pan)` | Panoramique stéréo (pan : 0=gauche, 1=droite) |
| `sp.spat(N, a, d)` | Spatialisation sur N canaux (a=angle, d=distance) |
| `sp.stereoize(fx)` | Transforme un effet mono en stéréo |

```faust
import("stdfaust.lib");

// Auto-pan : un LFO contrôle la position stéréo
pan = os.osc(0.5) * 0.5 + 0.5;  // LFO 0.5 Hz, converti de -1..+1 en 0..1
process = os.osc(440) : sp.panner(pan);
```

---

#### physmodels.lib (pm) - Modélisation physique

Composants modulaires pour instruments virtuels : chaînes, excitateurs, résonateurs, terminaisons.

| Catégorie | Exemples | Description |
| --------- | -------- | ----------- |
| Chaînes | `pm.chain(A : B : C)` | Connecte des éléments en série |
| Excitateurs | `pm.pluckString`, `pm.blower` | Pincer, souffler |
| Cordes | `pm.nylonString`, `pm.steelString` | Modèles de cordes complets |
| Résonateurs | `pm.openTube` | Segment de tube pour instruments à vent |

---

#### platform.lib (pl) - Informations plateforme

Fournit `pl.SR` (sample rate) et `pl.BS` (buffer size), identiques à `ma.SR` et `ma.BS`. Dans la pratique, on utilise les versions `ma.*` car `maths.lib` est toujours importée via `stdfaust.lib`.

---

#### analyzers.lib (an) - Analyse de signal

| Fonction | Description |
| -------- | ----------- |
| `an.amp_follower(rel)` | Suiveur d'amplitude (rel = relâchement en secondes) |
| `an.amp_follower_ud(att, rel)` | Suiveur avec attaque et relâchement séparés |
| `an.rms_envelope_rect(period)` | Enveloppe RMS (fenêtre rectangulaire) |
| `an.mth_octave_analyzer(M, ftop, N)` | Analyseur par bandes (1/M d'octave, N bandes) |

```faust
import("stdfaust.lib");

// Vu-mètre : affiche le niveau en dB
level = an.amp_follower(0.1) : ba.linear2db
      : hbargraph("level [unit:dB]", -60, 0);
process = _ <: _, level : attach;
```

---

### Conventions de nommage

**Préfixes de bibliothèque** :

| Préfixe | Bibliothèque | Domaine |
| ------- | ------------ | ------- |
| `ma.` | maths.lib | Constantes et conversions |
| `ba.` | basics.lib | Utilitaires de base |
| `si.` | signals.lib | Manipulation de signaux |
| `os.` | oscillators.lib | Formes d'onde |
| `no.` | noises.lib | Bruit |
| `fi.` | filters.lib | Filtres |
| `en.` | envelopes.lib | Enveloppes |
| `co.` | compressors.lib | Dynamique |
| `re.` | reverbs.lib | Réverbérations |
| `de.` | delays.lib | Lignes de retard |
| `ro.` | routes.lib | Routage |
| `sp.` | spats.lib | Spatialisation |
| `pm.` | physmodels.lib | Modélisation physique |
| `pl.` | platform.lib | Plateforme |
| `an.` | analyzers.lib | Analyse |

**Suffixes et préfixes courants** :

| Élément | Signification | Exemple |
| ------- | ------------- | ------- |
| `_mono` | Version mono | `co.compressor_mono` |
| `_stereo` | Version stéréo | `co.compressor_stereo` |
| `lf_` | Low frequency (non bandlimité) | `os.lf_saw` |
| `f` (préfixe) | Fractionnaire (interpolé) | `de.fdelay` |
| `N` (nombre) | Ordre du filtre | `fi.lowpass(N, fc)` |

**Règle de lecture** :

```text
os.lf_squarewave → os (oscillators.lib) + lf_ (basse fréquence) + squarewave (carrée)
co.compressor_stereo → co (compressors.lib) + compressor + _stereo (2 canaux)
fi.resonlp → fi (filters.lib) + reson (résonant) + lp (lowpass)
```

---

### Comment explorer une bibliothèque

| Méthode | Outil | Ce qu'elle révèle |
| ------- | ----- | ------------------ |
| Lire le code source | Éditeur de texte | Signature, implémentation, commentaires |
| Rechercher par mot-clé | `grep` dans les fichiers `.lib` | Trouver une fonction par nom partiel |
| Visualiser le diagramme | `faust2svg` | Schéma-bloc de la fonction |
| Documentation en ligne | [faustlibraries.grame.fr](https://faustlibraries.grame.fr/) | Descriptions, exemples, paramètres |

---

## Étapes Pratiques

### Étape 1 : Lister les bibliothèques disponibles

Localise les fichiers de bibliothèque Faust sur ta machine.

Commande :

```bash
# Trouver le répertoire des bibliothèques Faust
find /usr/local/share/faust -name "*.lib" -type f 2>/dev/null | sort
```

**Résultat attendu** :

```text
/usr/local/share/faust/analyzers.lib
/usr/local/share/faust/basics.lib
/usr/local/share/faust/compressors.lib
/usr/local/share/faust/delays.lib
/usr/local/share/faust/envelopes.lib
/usr/local/share/faust/filters.lib
/usr/local/share/faust/maths.lib
...
/usr/local/share/faust/stdfaust.lib
```

---

### Étape 2 : Explorer une bibliothèque (os) avec grep et faust2svg

Commande pour chercher les fonctions exportées :

```bash
# Lister les définitions de fonctions publiques dans oscillators.lib
grep -E "^[a-z][a-zA-Z0-9_]*\(" /usr/local/share/faust/oscillators.lib | head -20
```

**Résultat attendu** :

```text
osc(freq) = ...
sawtooth(freq) = ...
square(freq) = ...
triangle(freq) = ...
...
```

Visualise le diagramme SVG d'une fonction :

```bash
# Créer un fichier test et générer le diagramme
echo 'import("stdfaust.lib"); process = os.osc(440);' > /tmp/test_osc.dsp
faust2svg /tmp/test_osc.dsp
# Le diagramme est dans /tmp/test_osc-svg/process.svg
```

---

### Étape 3 : Utiliser les conversions de ma (dB vers linéaire, MIDI vers Hz)

Crée le fichier `conversions.dsp` :

```faust
import("stdfaust.lib");

// Conversion MIDI vers Hz
midi_note = hslider("MIDI note", 69, 24, 96, 1);
freq = ba.midikey2hz(midi_note);  // MIDI 69 = La4 = 440 Hz

// Conversion dB vers linéaire
volume_db = hslider("volume [unit:dB]", -12, -96, 0, 0.1);
gain = ba.db2linear(volume_db);  // -12 dB ≈ 0.25, 0 dB = 1.0

process = os.osc(freq) * gain;
```

Compile et teste :

```bash
faust -o conversions.cpp conversions.dsp && echo "Compilation OK"
```

**Résultat attendu** :

```text
Compilation OK

Vérifications :
- MIDI 69 → 440 Hz (La4)
- MIDI 60 → 261.63 Hz (Do4, Do central ; MIDI 60 n'est pas Do3)
- -6 dB → gain ≈ 0.501
- 0 dB → gain = 1.0
```

---

### Étape 4 : Combiner des fonctions de plusieurs bibliothèques

Crée le fichier `synth_complet.dsp` qui utilise 7 bibliothèques :

```faust
import("stdfaust.lib");

// Paramètres (si = signals.lib pour le lissage)
freq = hslider("freq", 440, 50, 2000, 1) : si.smoo;
gate = button("gate");
gain = ba.db2linear(hslider("volume [unit:dB]", -12, -96, 0, 0.1));  // ba (basics.lib)

// Source : oscillateur + bruit (os + no)
noise_amount = hslider("noise", 0.05, 0, 0.5, 0.01);
source = os.sawtooth(freq) * (1 - noise_amount) + no.noise * noise_amount;

// Filtre résonant avec enveloppe de coupure (fi + en)
cutoff_base = hslider("cutoff", 3000, 100, 10000, 1) : si.smoo;
filter_env = en.ar(0.01, 0.5, gate);
cutoff = cutoff_base + (cutoff_base * 0.5 * filter_env);
filtered = source : fi.resonlp(min(cutoff, 15000), 3, 1);

// Enveloppe d'amplitude et spatialisation (en + sp)
amp_env = en.adsr(0.01, 0.2, 0.6, 0.4, gate);
pan = hslider("pan", 0.5, 0, 1, 0.01);
process = filtered * amp_env * gain : sp.panner(pan);
```

```bash
faust -o synth_complet.cpp synth_complet.dsp && echo "Compilation OK"
```

**Résultat attendu** :

```text
Compilation OK - 7 bibliothèques utilisées : ma, si, os, no, fi, en, sp
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `import("stdfaust.lib");` | Importer toutes les bibliothèques standard |
| `find /usr/local/share/faust -name "*.lib"` | Lister les fichiers de bibliothèque installés |
| `grep "^[a-z]" oscillators.lib` | Lister les fonctions publiques d'une bibliothèque |
| `faust2svg fichier.dsp` | Générer un diagramme SVG du programme |
| `faust -o output.cpp input.dsp` | Compiler un programme Faust en C++ |

---

## Pièges Fréquents

### Piège 1 : Oublier l'import

**Problème** : Utiliser une fonction sans `import("stdfaust.lib");` produit une erreur "undefined symbol".

**Solution** : Toujours commencer chaque fichier `.dsp` par `import("stdfaust.lib");`.

```faust
// ❌ Incorrect
process = os.osc(440);  // Erreur : "undefined symbol : os"

// ✅ Correct
import("stdfaust.lib");
process = os.osc(440);
```

---

### Piège 2 : Confondre oscillateurs audio et LFO

**Problème** : `os.lf_saw` comme source audio produit de l'aliasing. `os.sawtooth` comme LFO gaspille du CPU.

**Solution** : `lf_*` pour la modulation (< 20 Hz). Oscillateurs bandlimités pour les fréquences audibles.

```faust
import("stdfaust.lib");

// ❌ os.lf_saw(440) → aliasing audible
// ✅ os.sawtooth(440) → bandlimité, propre

// ❌ os.sawtooth(5) comme LFO → gaspillage CPU
// ✅ os.lf_saw(5) → optimal pour la modulation
```

---

### Piège 3 : Dépasser maxdel dans les delays

**Problème** : Si la valeur de delay dépasse `maxdel`, le comportement est indéfini (silence, bruit, crash).

**Solution** : Calculer `maxdel` en tenant compte du sample rate maximum et clamper la valeur avec `min`.

```faust
// ❌ maxdel = 22050 avec slider allant jusqu'à 2 secondes → dépassement
// ✅ maxdel = 96000 (2 s à 48 kHz) + min(delay_samp, maxdel)
```

---

### Piège 4 : Oublier si.smoo sur les paramètres d'interface

**Problème** : Les sliders changent de valeur de façon discontinue, produisant des clics audibles.

**Solution** : Appliquer `si.smoo` sur tous les paramètres continus (fréquence, gain, cutoff).

```faust
import("stdfaust.lib");

// ❌ freq = hslider("freq", 440, 50, 2000, 1);       → clics
// ✅ freq = hslider("freq", 440, 50, 2000, 1) : si.smoo;  → lisse
```

---

### Piège 5 : Confondre fi.lowpass et fi.resonlp

**Problème** : `fi.lowpass` est un filtre Butterworth plat. `fi.resonlp` a un pic de résonance. Les résultats sonores sont très différents.

**Solution** : `fi.lowpass` pour un filtrage transparent. `fi.resonlp` pour un caractère sonore marqué.

---

## Checklist de Validation

- [ ] Je sais écrire `import("stdfaust.lib");` et expliquer ce que cela importe
- [ ] Je connais le préfixe de chaque bibliothèque (ma, ba, si, os, no, fi, en, co, re, de, ro, sp, pm, an)
- [ ] Je sais utiliser `ba.db2linear` et `ba.midikey2hz` pour les conversions
- [ ] Je sais quand utiliser `si.smoo` et pourquoi
- [ ] Je sais choisir le bon oscillateur (`os.osc` vs `os.sawtooth` vs `os.lf_saw`)
- [ ] Je sais utiliser `fi.resonlp` et `en.adsr`
- [ ] Je sais combiner des fonctions de 5+ bibliothèques dans un même programme
- [ ] Je sais explorer une bibliothèque via `grep` et `faust2svg`
- [ ] Je comprends les conventions de nommage (préfixes, suffixes `_mono`/`_stereo`, préfixe `lf_`)

---

## Exercice Pratique

**Énoncé** : Crée un effet "Space Echo" utilisant au minimum 6 bibliothèques. Le Space Echo combine un delay modulé par un LFO, un filtre dans la boucle de feedback, un ducking via une enveloppe, un compresseur en sortie, et une spatialisation stéréo.

**Cahier des charges** :

- **os** : un LFO sinusoïdal qui module le temps de delay (effet chorus/wow)
- **de** : une ligne de delay fractionnaire avec feedback
- **fi** : un filtre passe-bas dans la boucle de feedback (les répétitions deviennent plus sombres)
- **en** : une enveloppe de ducking qui réduit le signal sec quand l'effet est actif
- **co** : un compresseur en sortie pour contrôler la dynamique
- **sp** : une panoramique alternée (ping-pong entre gauche et droite)

**Paramètres d'interface** :

- delay time : 200 à 800 ms (défaut 400 ms)
- feedback : 0 à 0.9 (défaut 0.5)
- LFO rate : 0.1 à 5 Hz (défaut 0.8 Hz)
- LFO depth : 0 à 20 ms (défaut 5 ms)
- filter cutoff : 500 à 8000 Hz (défaut 3000 Hz)
- dry/wet mix : 0 à 1 (défaut 0.4)

**Indications** :

- Lisse tous les paramètres d'interface avec `si.smoo`
- Calcule `maxdel` pour supporter delay max + LFO depth max
- La modulation LFO s'ajoute au temps de delay de base
- Le filtre dans la boucle s'applique au signal retardé avant le retour
- Le `sp.panner` alterne entre gauche et droite avec un LFO synchronisé au delay

**Résultat attendu** : Un fichier `space_echo.dsp` qui compile sans erreur et produit un écho spatial avec des répétitions de plus en plus sombres, modulées en pitch, et alternant entre les canaux stéréo.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
import("stdfaust.lib");

// ============================================================
// Space Echo - Effet utilisant 8 bibliothèques
// ============================================================

// === Paramètres (si = signals.lib pour le lissage) ===
delay_ms   = hslider("[1]delay [unit:ms]", 400, 200, 800, 1) : si.smoo;
feedback   = hslider("[2]feedback", 0.5, 0, 0.9, 0.01) : si.smoo;
lfo_rate   = hslider("[3]LFO rate [unit:Hz]", 0.8, 0.1, 5, 0.01) : si.smoo;
lfo_depth  = hslider("[4]LFO depth [unit:ms]", 5, 0, 20, 0.1) : si.smoo;
filter_fc  = hslider("[5]filter cutoff [unit:Hz]", 3000, 500, 8000, 1) : si.smoo;
drywet     = hslider("[6]dry/wet", 0.4, 0, 1, 0.01) : si.smoo;

// === Constantes (ma = maths.lib) ===
// Buffer max : delay max (800 ms) + LFO depth max (20 ms) à 48 kHz
maxdel = 48000;

// === LFO pour modulation du delay (os = oscillators.lib) ===
lfo = os.osc(lfo_rate) * lfo_depth;

// === Temps de delay modulé, converti en échantillons ===
delay_samp = (delay_ms + lfo) * ma.SR / 1000.0;

// === Boucle de delay avec filtre dans le feedback ===
// de = delays.lib, fi = filters.lib
// Schéma : entrée → (+) → delay → filtre → (* feedback) → retour
space_delay = + ~ (de.fdelay(maxdel, max(1, min(delay_samp, maxdel)))
                   : fi.lowpass(2, filter_fc)
                   : *(feedback));

// === Spatialisation ping-pong (sp = spats.lib) ===
// Le panoramique oscille au rythme du delay
ping_pong_pan = os.lf_triangle(1.0 / (delay_ms / 1000.0))
              : *(0.4) + 0.5;  // oscille entre 0.1 et 0.9

// === Compresseur en sortie (co = compressors.lib) ===
output_comp = co.compressor_mono(3, -12, 0.005, 0.1);

// === Assemblage final ===
// Signal sec dupliqué en stéréo + signal traité en stéréo (ping-pong)
process = _ <: dry, wet :> _, _
with {
    // Signal sec : mono dupliqué en stéréo pour le merge
    dry = *(1 - drywet) <: _, _;

    // Signal traité : delay → compresseur → panoramique (stéréo)
    wet = space_delay
        : output_comp
        : *(drywet)
        : sp.panner(ping_pong_pan);
};
```

**Bibliothèques utilisées** : si (lissage), ma (conversion ms/samples), os (LFO modulation + ping-pong), de (delay), fi (filtre feedback), co (compresseur), sp (panoramique).

```bash
faust -o space_echo.cpp space_echo.dsp && echo "Space Echo compilé avec succès"
```

**Résultat attendu** :

```text
Space Echo compilé avec succès
Les échos deviennent progressivement plus sombres (filtre), avec un léger
"wow" (LFO), alternant gauche/droite (ping-pong), sans saturation (compresseur).
```

---

## Navigation

← Fiche précédente : **[04 - Modélisation physique](04-modelisation-physique.md)**

→ Fiche suivante : **[06 - Anti-aliasing et oscillateurs band-limited](06-anti-aliasing-oscillateurs.md)**
