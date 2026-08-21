---
tags:
  - Faust
  - Avancé
  - Pratique
description: "Embarqué et hardware - Bela, Raspberry Pi, ESP32, Teensy et FPGA (Syfala) avec Faust"
estimated_time: "60 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 5 - Déploiement et architectures"
id: "specializations.faust.deployment.embarque-hardware"
course_id: "specializations.faust"
module_id: "specializations.faust.deployment"
content_type: "lesson"
order: 5
---

# 05 - Embarqué et hardware

> **En bref** : À la fin de cette fiche, tu sauras choisir la bonne plateforme embarquée pour ton projet audio, compiler du code Faust pour Bela, Raspberry Pi et ESP32, et comprendre les contraintes du temps réel embarqué. Lecture estimée : 60 min.


## Prérequis

- [Fiche 01 - Système d'architectures Faust](01-systeme-architectures-faust.md)
- [Fiche 02 - C++ : notions essentielles](../02-prerequis-programmation/02-cpp-notions-essentielles.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir la bonne plateforme embarquée pour ton projet audio, compiler du code Faust pour Bela, Raspberry Pi et ESP32, et comprendre les contraintes du temps réel embarqué.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Quelles sont les contraintes de l'embarqué audio ?

**Définition** : Les contraintes de l'embarqué audio sont les limitations matérielles qui influencent directement la conception du programme Faust. Un système embarqué audio exécute un programme sur un matériel dédié (sans écran, sans clavier) avec la garantie stricte que chaque échantillon est calculé avant sa date limite de lecture.

**Le problème que l'embarqué résout** :

Sans système embarqué dédié, voici les problèmes rencontrés :

1. **Latence trop élevée** : Un ordinateur de bureau introduit 5 à 20 ms de latence. Pour un musicien jouant en live, c'est perceptible et gênant au-delà de 10 ms.

2. **Interruptions imprévisibles** : Le système d'exploitation peut interrompre le calcul audio pour gérer une notification ou un rafraîchissement d'écran, provoquant un décrochage audio (buffer underrun).

3. **Encombrement et coût** : Embarquer un ordinateur complet dans un pédalier de guitare est impraticable (taille, poids, consommation, prix).

**Comment l'embarqué résout ces problèmes** :

| Problème | Solution apportée par l'embarqué |
| -------- | -------------------------------- |
| Latence trop élevée | Accès direct au matériel audio, latence < 1 ms possible |
| Interruptions imprévisibles | Le programme audio a la priorité absolue |
| Encombrement et coût | Cartes compactes (5 à 15 cm), alimentation USB, prix de 10 à 150 euros |

**Analogie concrète** : Imagine la différence entre un restaurant gastronomique et un food truck. Le restaurant (un ordinateur de bureau) offre beaucoup de services, mais le temps de service est long et variable. Le food truck (un système embarqué) ne fait qu'une seule chose, mais il le fait vite, de manière prévisible, et il tient dans un petit espace.

**Les cinq contraintes principales** :

| Contrainte | Description | Impact sur le code Faust |
| ---------- | ----------- | ------------------------ |
| Mémoire limitée | De 520 KB (ESP32) à 1 GB (Raspberry Pi) | Limiter les tables, les délais longs, la polyphonie |
| CPU limité | De 240 MHz (ESP32) à 1.5 GHz (Raspberry Pi) | Limiter la complexité, éviter les algorithmes coûteux |
| Latence ultra-faible | De quelques microsecondes (FPGA) à quelques ms | Tailles de buffer très petites (16 à 128 échantillons) |
| Pas d'OS complet | Pas de système de fichiers, pas de réseau | Le programme doit être autonome |
| Temps réel strict | Chaque échantillon doit être calculé dans un temps fixe | Pas d'allocation dynamique, pas de boucles variables |

---

### Qu'est-ce que Bela ?

**Définition** : Bela est une plateforme embarquée dédiée à l'audio temps réel. Elle se compose d'une carte BeagleBone Black (ARM 1 GHz) et d'une cape audio avec entrées/sorties audio et 8 entrées analogiques pour capteurs. Bela atteint une latence inférieure à 1 ms grâce à un noyau Xenomai temps réel.

**Le problème que Bela résout** :

Sans Bela, voici les problèmes rencontrés :

1. **Latence excessive** : Un ordinateur avec une carte son USB atteint au mieux 3-5 ms. Pour un instrument interactif (capteur de geste vers son), cette latence rend l'interaction artificielle.

2. **Câblage de capteurs complexe** : Connecter des capteurs analogiques à un ordinateur nécessite un Arduino intermédiaire et une communication série, ajoutant latence et complexité.

3. **Pas de plateforme clé en main** : Combiner processeur, carte son, entrées capteurs et noyau temps réel soi-même prend des semaines.

**Comment Bela résout ces problèmes** :

| Problème | Solution apportée par Bela |
| -------- | -------------------------- |
| Latence excessive | Noyau Xenomai, buffer de 16 échantillons, latence < 1 ms |
| Câblage de capteurs complexe | 8 entrées analogiques intégrées, synchronisées avec l'audio |
| Pas de plateforme clé en main | Tout intégré : processeur + audio + capteurs + noyau RT |

**Analogie concrète** : Bela est comme un atelier de luthier tout équipé. Au lieu d'acheter séparément l'établi, les outils et les instruments de mesure, tu achètes un atelier complet où tout est câblé et optimisé pour fabriquer des instruments.

**Caractéristiques** : ARM Cortex-A8 1 GHz, 512 MB RAM, 2 entrées/sorties audio stéréo, 8 entrées analogiques, latence < 1 ms, `faust2bela`, ~150 euros.

---

### Qu'est-ce que le Raspberry Pi (pour l'audio) ?

**Définition** : Le Raspberry Pi est un ordinateur monocarte sous Linux. Pour l'audio, il utilise JACK ou ALSA. Il offre plus de puissance que Bela (quad-core 1.5 GHz, jusqu'à 8 GB RAM), mais sa latence est plus élevée car Linux n'est pas temps réel par défaut.

**Le problème que le Raspberry Pi résout** :

Sans Raspberry Pi, voici les problèmes rencontrés :

1. **Coût élevé** : Un ordinateur portable pour le traitement audio coûte plusieurs centaines d'euros.
2. **Encombrement** : Un ordinateur portable ne se monte pas dans un boîtier de pédalier.
3. **Manque de connectique** : Pas de GPIO pour connecter boutons, LED ou capteurs.

**Comment le Raspberry Pi résout ces problèmes** :

| Problème | Solution apportée par le Raspberry Pi |
| -------- | ------------------------------------- |
| Coût élevé | Carte à 35-80 euros + carte son USB ou HAT audio 20-50 euros |
| Encombrement | Format carte de crédit (85 x 56 mm) |
| Manque de connectique | 40 broches GPIO |

**Analogie concrète** : Le Raspberry Pi est comme une cuisine de studio. Plus grande et mieux équipée qu'un food truck (Bela), elle permet de préparer des plats plus élaborés. Mais le service est un peu plus lent parce que la cuisine sert aussi pour d'autres tâches.

**Ce que le Raspberry Pi n'est PAS** :

- Le Raspberry Pi n'est pas temps réel par défaut. Sans noyau RT-PREEMPT, la latence est imprévisible.
- Le Raspberry Pi n'a pas de carte son de qualité intégrée. Un HAT audio (HiFiBerry, IQaudio) ou une carte son USB est indispensable.

**Caractéristiques** : Quad-core 1.5 GHz, 1-8 GB RAM, latence 3-10 ms, `faust2jack` ou `faust2alsa`, 50-100 euros (avec carte son).

---

### Qu'est-ce que l'ESP32 (pour l'audio) ?

**Définition** : L'ESP32 est un microcontrôleur Wi-Fi/Bluetooth avec un processeur dual-core à 240 MHz et 520 KB de SRAM. Pour l'audio, il utilise le protocole I2S avec un codec externe. Faust le cible via `faust2esp32`.

**Le problème que l'ESP32 résout** :

Sans ESP32, voici les problèmes rencontrés :

1. **Coût trop élevé** : Un Bela coûte 150 euros. Pour un simple effet audio, c'est disproportionné.
2. **Taille excessive** : Même un Raspberry Pi Zéro est trop grand pour des instruments portables ou wearables.
3. **Consommation électrique** : Un Raspberry Pi consomme 3-5 watts, limitant l'autonomie sur batterie.

**Comment l'ESP32 résout ces problèmes** :

| Problème | Solution apportée par l'ESP32 |
| -------- | ----------------------------- |
| Coût trop élevé | Module à 3-8 euros, codec I2S à 5-10 euros |
| Taille excessive | Module de 25 x 18 mm |
| Consommation électrique | 80-240 mA, fonctionnement sur batterie possible |

**Analogie concrète** : L'ESP32 est comme un réchaud de camping. Très compact, pas cher. Tu ne peux pas y préparer un repas gastronomique (programme complexe), mais pour une soupe (effet simple), il fait le travail. Et il fonctionne sur batterie.

**Limitations pour Faust** :

| Limitation | Impact |
| ---------- | ------ |
| 520 KB SRAM | Réverbération limitée à quelques centaines de ms. Pas de convolution. |
| 240 MHz dual-core | Maximum ~50 opérations flottantes par échantillon à 44.1 kHz |
| Pas de FPU double précision | Utiliser impérativement `-single` (float 32 bits) |

---

### Qu'est-ce que Teensy (pour l'audio) ?

**Définition** : Teensy est un microcontrôleur ARM rapide (Cortex-M7, 600 MHz) avec 1 MB de RAM. Son Audio Shield fournit un codec I2S de qualité. La librairie Audio Teensy offre des blocs connectables, compatibles avec Faust via `faust2teensy`.

**Le problème que Teensy résout** :

Sans Teensy, voici les problèmes rencontrés :

1. **Compromis performance/taille** : L'ESP32 est petit mais lent. Le Raspberry Pi est puissant mais encombrant.
2. **Écosystème audio limité** : L'ESP32 n'a pas de librairie audio intégrée.
3. **Latence des microcontrôleurs classiques** : Les microcontrôleurs 8 bits sont trop lents pour l'audio 44.1 kHz.

**Comment Teensy résout ces problèmes** :

| Problème | Solution apportée par Teensy |
| -------- | ---------------------------- |
| Compromis performance/taille | Cortex-M7 600 MHz dans 35 x 18 mm |
| Écosystème audio limité | Librairie Audio avec blocs connectables |
| Latence des microcontrôleurs classiques | 600 MHz avec FPU, audio 44.1 kHz sans difficulté |

**Analogie concrète** : Teensy est comme une cuisine mobile professionnelle. Plus petite qu'une cuisine de studio (Raspberry Pi), mieux équipée qu'un réchaud (ESP32), avec un four rapide (Cortex-M7) et des ustensiles de qualité (Audio Shield).

**Caractéristiques** : ARM Cortex-M7 600 MHz, 1 MB RAM, I2S via Audio Shield, `faust2teensy`, 40-50 euros (carte + shield).

---

### Qu'est-ce que le FPGA et le projet Syfala ?

**Définition** : Un FPGA (Field-Programmable Gate Array) est un circuit intégré reconfigurable. Contrairement à un processeur qui exécute des instructions séquentiellement, un FPGA configure ses portes logiques pour former un circuit dédié. Le projet Syfala (GRAME/INSA Lyon) compile du code Faust directement en circuit FPGA sur Xilinx Zynq, avec une latence de quelques microsecondes.

**Le problème que le FPGA résout** :

1. **Limite de latence logicielle** : Même Bela est limitée par son processeur ARM. Pour du feedback acoustique ou du contrôle haptique, il faut descendre sous 100 microsecondes.
2. **Limite de parallélisme** : Un processeur exécute séquentiellement. Un programme Faust avec 128 canaux dépasse les capacités d'un CPU embarqué.

**Comment le FPGA résout ces problèmes** :

| Problème | Solution apportée par le FPGA |
| -------- | ----------------------------- |
| Limite de latence logicielle | Calcul en circuit matériel, quelques microsecondes |
| Limite de parallélisme | Toutes les opérations câblées en parallèle |

**Analogie concrète** : Un processeur est comme un cuisinier qui suit une recette étape par étape. Un FPGA est comme une chaîne de montage : chaque poste fait une opération en permanence, les pièces avancent en continu. Le plat est prêt presque instantanément.

**Ce que le FPGA n'est PAS** :

- Le FPGA n'est pas un processeur. Il configure ses portes logiques pour devenir un circuit. Quand tu compiles pour FPGA, le résultat est un circuit, pas un programme.
- Le FPGA n'est pas encore grand public pour l'audio. Syfala est un projet de recherche. Il faut Xilinx Vivado (dizaines de Go) et une carte FPGA compatible (200-500 euros).

**Caractéristiques Syfala** : Xilinx Zynq, latence ~10 microsecondes, jusqu'à 128 canaux, jusqu'à 384 kHz. Projet : github.com/inria-emeraude/syfala.

---

### Comment choisir sa plateforme ?

**Définition** : Le choix dépend de cinq critères : latence requise, complexité du programme, budget, taille physique et compétence technique.

**Tableau comparatif** :

| Critère | Bela | Raspberry Pi | ESP32 | Teensy | FPGA (Syfala) |
| ------- | ---- | ------------ | ----- | ------ | ------------- |
| CPU | 1 GHz ARM | 1.5 GHz quad ARM | 240 MHz dual | 600 MHz ARM | N/A (circuit) |
| RAM | 512 MB | 1-8 GB | 520 KB | 1 MB | Dépend de la carte |
| Latence min. | < 1 ms | 3-10 ms | 2-5 ms | 1-3 ms | ~10 microsecondes |
| Prix total | ~150 euros | 50-100 euros | 10-20 euros | 40-50 euros | 200-500 euros |
| Cas d'usage | Instruments DIY | Multi-effets | Effets simples | Synthés/effets | Recherche |
| Outil Faust | `faust2bela` | `faust2jack` | `faust2esp32` | `faust2teensy` | Syfala toolchain |

**Arbre de décision** :

```text
Latence < 1 ms requise ?
├── Oui → Capteurs analogiques intégrés ?
│         ├── Oui → Bela
│         └── Non → Latence < 100 µs ? → FPGA (Syfala), sinon → Bela
└── Non → Budget < 30 euros ?
          ├── Oui → Programme simple ? → ESP32, sinon → Teensy
          └── Non → Programme complexe (reverb, polyphonie) ? → Raspberry Pi, sinon → Teensy
```

---

### Qu'est-ce que faust2api ?

**Définition** : `faust2api` génère une API C/C++ portable à partir d'un programme Faust. Au lieu de produire une application complète, il génère uniquement le code DSP avec une interface de programmation. Ce code s'intègre dans n'importe quel projet C/C++ embarqué.

**Le problème que faust2api résout** :

1. **Outils faust2xxx manquants** : Ta plateforme n'a pas d'outil dédié (ex: pas de `faust2stm32`).
2. **Intégration dans un projet existant** : Tu veux ajouter du DSP Faust dans un firmware existant.
3. **Contrôle total** : Tu gères toi-même les buffers audio et l'I2S.

**Analogie concrète** : Les outils `faust2xxx` sont des plats cuisinés tout prêts. `faust2api` est un ingrédient préparé (une sauce) que tu intègres dans ta propre recette.

```cpp
// Structure de l'API générée
class DspFaust {
public:
    DspFaust(int sample_rate, int buffer_size);
    void compute(int count, float** inputs, float** outputs);
    void setParamValue(const char* path, float value);
    float getParamValue(const char* path);
};
```

---

### Quelles sont les optimisations pour l'embarqué ?

**Définition** : Les optimisations pour l'embarqué sont des options de compilation et des techniques de code qui réduisent la consommation mémoire et CPU. Elles sont indispensables sur ESP32 et Teensy.

**Options de compilation** :

| Option | Effet | Recommandé pour |
| ------ | ----- | --------------- |
| `-single` | Float 32 bits au lieu de double 64 bits | ESP32, Teensy, Bela |
| `-scal` | Mode scalaire (pas de vectorisation SIMD) | Tous les microcontrôleurs |
| `-tg N` | Taille maximale des tables = N | ESP32 (mémoire limitée) |

**Techniques de code** :

| Technique | Pourquoi | Exemple |
| --------- | -------- | ------- |
| Réduire les délais | 1 s à 44.1 kHz = 172 KB en float | Max 0.2 s sur ESP32 |
| Éviter la convolution | Nécessite FFT et grandes tables | Réverbérations algorithmiques |
| Limiter la polyphonie | Chaque voix duplique le programme | 2-4 voix sur ESP32, 8-16 sur Teensy |
| Filtres simples | Ordre élevé = plus de CPU | Préférer ordre 1 ou 2 |

---

## Étapes Pratiques

### Étape 1 : Compiler pour Bela avec faust2bela

Crée un fichier `effet-bela.dsp` :

```faust
// effet-bela.dsp - Trémolo pour Bela
import("stdfaust.lib");

// Paramètres (mappables aux entrées analogiques sur Bela)
freq = hslider("freq", 5, 0.1, 20, 0.01);    // Fréquence du LFO en Hz
depth = hslider("depth", 0.5, 0, 1, 0.01);   // Profondeur du trémolo

// LFO sinusoïdal transformé en modulation d'amplitude
lfo = os.osc(freq);
modulation = 1 - depth + depth * (1 + lfo) / 2;

// Trémolo stéréo
process = _, _ : *(modulation), *(modulation);
```

Compile et déploie :

```bash
# Compiler le programme pour Bela
faust2bela effet-bela.dsp

# Envoyer le C++ généré sur la carte Bela et l'exécuter
# (option officielle : -tobela, pas une adresse IP)
faust2bela -tobela effet-bela.dsp
```

**Résultat attendu** :

```text
effet-bela_bela/
├── render.cpp       # Code C++ généré pour Bela
├── Makefile         # Fichier de compilation
└── ...              # Fichiers auxiliaires
```

---

### Étape 2 : Déployer sur Raspberry Pi avec faust2jack

Crée un fichier `delay-pi.dsp` :

```faust
// delay-pi.dsp - Delay simple pour Raspberry Pi
import("stdfaust.lib");

// Paramètres du delay
delay_time = hslider("delay_ms", 300, 10, 2000, 1) : /(1000) : *(ma.SR) : int;
feedback = hslider("feedback", 0.4, 0, 0.95, 0.01);
mix = hslider("mix", 0.5, 0, 1, 0.01);

// Ligne de délai avec rétroaction
delay_line = +~(@(delay_time) * feedback);

// Mélange dry/wet
mixer(dry, wet) = dry * (1 - mix) + wet * mix;
process = _ <: _, delay_line : mixer;
```

Sur le Raspberry Pi :

```bash
# Installer JACK
sudo apt install jackd2 libjack-jackd2-dev

# Démarrer JACK (buffer 256 = ~5.8 ms de latence)
jackd -d alsa -r 44100 -p 256 &

# Compiler et exécuter
faust2jack delay-pi.dsp
./delay-pi
```

**Résultat attendu** :

```text
JACK server started
delay-pi connected to JACK
L'effet de delay est actif. Latence totale : ~5.8 ms.
```

---

### Étape 3 : Aperçu de la compilation ESP32

Crée un fichier `distortion-esp32.dsp` :

```faust
// distortion-esp32.dsp - Distorsion optimisée pour ESP32
import("stdfaust.lib");

drive = hslider("drive", 0.5, 0, 1, 0.01);
tone = hslider("tone", 800, 200, 4000, 1);
level = hslider("level", 0.5, 0, 1, 0.01);

// Distorsion douce (tanh) + filtre passe-bas ordre 1 (léger en CPU)
gain = 1 + drive * 20;
process = *(gain) : ma.tanh : fi.lowpass(1, tone) : *(level);
```

Compile et flashe :

```bash
# Générer le projet ESP-IDF
faust2esp32 -lib distortion-esp32.dsp

# Compiler et flasher (nécessite ESP-IDF installé)
cd distortion-esp32_esp32
idf.py build
idf.py -p /dev/ttyUSB0 flash
```

**Câblage requis** :

```text
ESP32              Codec I2S (PCM5102A)
─────              ────────────────────
GPIO 25 (BCLK)  → BCK
GPIO 26 (LRCLK) → LCK
GPIO 22 (DOUT)  → DIN
3.3V             → VCC
GND              → GND
```

---

### Étape 4 : Comprendre les contraintes mémoire et CPU

**Calcul de la mémoire des délais** :

```text
Formule : mémoire = durée_secondes × fréquence × taille_float

Exemples (float 32 bits, 44.1 kHz) :
- Delay 300 ms :  0.3 × 44100 × 4 =  52 KB  → OK sur ESP32
- Delay 1 s :     1.0 × 44100 × 4 = 172 KB  → Limite sur ESP32
- Reverb (4 lignes, 500 ms) : 4 × 0.5 × 44100 × 4 = 345 KB → NON sur ESP32
```

**Budget CPU par plateforme** (opérations float par échantillon à 44.1 kHz) :

```text
- ESP32 (240 MHz) :         ~50 opérations
- Teensy 4.1 (600 MHz) :    ~200 opérations
- Bela (1 GHz ARM) :        ~500 opérations
- Raspberry Pi 4 (1.5 GHz) : ~1000 opérations (par core)
```

---

### Étape 5 : Optimiser un programme Faust pour l'embarqué

**Programme trop lourd pour ESP32** :

```faust
// ❌ Trop lourd : reverb longue + filtre coûteux
import("stdfaust.lib");
process = _ : fi.lowpass(8, 2000) : re.zita_rev1;
```

**Version optimisée** :

```faust
// ✅ Optimisé pour ESP32
import("stdfaust.lib");

// 3 allpass courts au lieu de zita_rev1 (24 KB vs 345 KB)
mini_reverb = fi.allpass_fcomb(1024, 347, 0.7)
            : fi.allpass_fcomb(1024, 571, 0.7)
            : fi.allpass_fcomb(1024, 857, 0.7);

mix = hslider("mix", 0.3, 0, 1, 0.01);
process = _ <: *(1 - mix), (fi.lowpass(1, 2000) : mini_reverb : *(mix)) :> _;
```

```bash
# Compilation optimisée pour l'embarqué
faust -single -scal -tg 1024 reverb-esp32.dsp -o reverb-esp32.cpp
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust2bela effet.dsp` | Compiler pour Bela |
| `faust2bela -tobela effet.dsp` | Envoyer le C++ sur la carte Bela et l'exécuter |
| `faust2jack effet.dsp` | Compiler pour JACK (Raspberry Pi ou desktop) |
| `faust2alsa effet.dsp` | Compiler pour ALSA (Linux sans JACK) |
| `faust2esp32 -lib effet.dsp` | Générer un projet ESP-IDF |
| `faust2teensy effet.dsp` | Générer du code pour Teensy |
| `faust2api -android effet.dsp` | Générer une API portable Android |
| `faust -single effet.dsp -o out.cpp` | Compiler en float 32 bits |
| `faust -scal effet.dsp -o out.cpp` | Compiler en mode scalaire |
| `faust -tg 1024 effet.dsp -o out.cpp` | Limiter la taille des tables |

---

## Pièges Fréquents

### Piège 1 : Utiliser double au lieu de float sur un microcontrôleur

**Problème** : Par défaut, Faust génère du code en double précision (64 bits). Sur ESP32 ou Teensy, c'est 2 à 10 fois plus lent car ces CPU n'ont pas de FPU 64 bits.

**Solution** : Toujours utiliser `-single` pour les cibles embarquées.

```bash
# ❌ Incorrect : double précision par défaut
faust moneffet.dsp -o moneffet.cpp

# ✅ Correct : simple précision
faust -single moneffet.dsp -o moneffet.cpp
```

---

### Piège 2 : Délais trop longs sur ESP32

**Problème** : Un delay de 1 seconde consomme 172 KB. Sur un ESP32 (520 KB SRAM, dont une partie utilisée par le système), cela laisse très peu de mémoire.

**Solution** : Limiter les délais à 200-300 ms sur ESP32.

```faust
// ❌ Trop long pour ESP32
delay_line = @(2 * ma.SR);

// ✅ Acceptable pour ESP32
delay_line = @(0.2 * ma.SR : int);
```

---

### Piège 3 : Buffer underrun sur Raspberry Pi sans noyau RT

**Problème** : Avec un noyau Linux standard et un buffer petit (64 échantillons), le système provoque des craquements.

**Solution** : Utiliser un noyau RT-PREEMPT ou augmenter la taille du buffer.

```bash
# ❌ Buffer trop petit sans noyau RT
jackd -d alsa -r 44100 -p 64

# ✅ Buffer adapté au noyau standard
jackd -d alsa -r 44100 -p 256
```

---

### Piège 4 : Oublier le codec I2S sur ESP32

**Problème** : Le DAC intégré de l'ESP32 (8 bits) produit un son de très mauvaise qualité.

**Solution** : Utiliser un codec I2S externe (PCM5102A pour la sortie, INMP441 pour l'entrée).

---

### Piège 5 : Utiliser re.zita_rev1 sur un microcontrôleur

**Problème** : `re.zita_rev1` utilise 8 lignes de délai longues et consomme plusieurs centaines de KB.

**Solution** : Réverbérations minimalistes avec des allpass courts.

```faust
// ❌ Trop gourmand sur ESP32/Teensy
reverb = re.zita_rev1;

// ✅ Réverbération légère
reverb = fi.allpass_fcomb(512, 200, 0.6)
       : fi.allpass_fcomb(512, 317, 0.6)
       : fi.allpass_fcomb(512, 431, 0.6);
```

---

## Checklist de Validation

- [ ] Je connais les cinq contraintes de l'embarqué audio
- [ ] Je sais ce qu'est Bela et pourquoi sa latence est inférieure à 1 ms
- [ ] Je sais utiliser `faust2bela` pour compiler un programme pour Bela
- [ ] Je sais utiliser `faust2jack` pour déployer sur Raspberry Pi
- [ ] Je connais les limitations de l'ESP32 (520 KB SRAM, 240 MHz)
- [ ] Je connais le Teensy et son Audio Shield
- [ ] Je comprends le principe du FPGA et le projet Syfala
- [ ] Je sais utiliser le tableau comparatif pour choisir une plateforme
- [ ] Je sais utiliser `faust2api` pour générer une API C++ portable
- [ ] Je connais les options d'optimisation : `-single`, `-scal`, `-tg`
- [ ] Je sais estimer la mémoire utilisée par les lignes de délai

---

## Exercice Pratique

**Énoncé** : Concevoir un effet guitare portable complet.

1. **Choisir la plateforme** : Parmi Bela, Raspberry Pi, ESP32 et Teensy, choisir la plateforme la mieux adaptée pour un pédalier de guitare portable. Justifier avec au moins trois arguments.

2. **Écrire le programme Faust** : Créer `pedale-guitare.dsp` avec trois effets en série :
   - **Distorsion** : saturation douce avec contrôle de gain
   - **Delay** : délai mono avec feedback, durée adaptée à la plateforme
   - **Réverbération** : réverbe légère adaptée aux contraintes mémoire

3. **Décrire le câblage hardware** : Schéma entre la plateforme, le codec audio et les potentiomètres de contrôle.

**Indications** :

- Budget maximum : 50 euros
- Latence inférieure à 10 ms
- Fonctionnement sur batterie
- Utiliser `-single` et `-scal`
- Chaque effet doit avoir au moins un paramètre contrôlable

**Résultat attendu** : Un document justifiant le choix, un fichier `.dsp` fonctionnel, un schéma de câblage, et la commande de compilation.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Choix de la plateforme : Teensy 4.0 + Audio Shield

1. **Budget** : Teensy 4.0 (~25 euros) + Audio Shield (~15 euros) = ~40 euros. Le Bela (150 euros) dépasse le budget.
2. **Puissance** : Cortex-M7 600 MHz et 1 MB RAM permettent les trois effets simultanément. L'ESP32 (520 KB) est trop limité pour delay + reverb.
3. **Format compact** : 35 x 18 mm, tient dans un boîtier de pédalier.
4. **Audio intégré** : L'Audio Shield fournit un codec I2S de qualité (SGTL5000).
5. **Consommation** : 100-150 mA, compatible batterie USB.

---

### Programme Faust

```faust
// pedale-guitare.dsp - Distorsion + delay + reverb pour Teensy 4.0
import("stdfaust.lib");

// Paramètres (contrôlables par potentiomètres)
drive = hslider("drive", 0.5, 0, 1, 0.01);
delay_ms = hslider("delay_ms", 250, 20, 500, 1);
delay_fb = hslider("delay_fb", 0.35, 0, 0.85, 0.01);
reverb_mix = hslider("reverb_mix", 0.25, 0, 0.7, 0.01);
output_level = hslider("level", 0.7, 0, 1, 0.01);

// Distorsion : tanh + filtre passe-bas ordre 1
dist_gain = 1 + drive * 20;
distortion = *(dist_gain) : ma.tanh : fi.lowpass(1, 4000);

// Delay : max 500 ms = 86 KB (OK pour 1 MB RAM)
max_delay = 0.5 * ma.SR : int;
delay_samples = delay_ms : /(1000) : *(ma.SR) : int;
delay_effect = +~(de.delay(max_delay, delay_samples) * delay_fb);

// Reverb : 3 allpass = 24 KB
reverb = fi.allpass_fcomb(2048, 443, 0.65)
       : fi.allpass_fcomb(2048, 631, 0.65)
       : fi.allpass_fcomb(2048, 857, 0.65);
reverb_effect = _ <: *(1 - reverb_mix), (reverb : *(reverb_mix)) :> _;

// Chaîne complète (mémoire totale : ~112 KB sur 1 MB)
process = distortion : delay_effect : reverb_effect : *(output_level);
```

---

### Schéma de câblage

```text
                    ┌──────────────────────┐
                    │    Teensy 4.0        │
                    │    + Audio Shield    │
Guitare ──→ Jack ──→│ LINE IN     LINE OUT│──→ Jack ──→ Ampli
                    │ A0 ←── Pot Drive    │  Potentiomètre 10K
                    │ A1 ←── Pot Delay    │  (chaque pot : 3.3V / signal / GND)
                    │ A2 ←── Pot Reverb   │
                    │ A3 ←── Pot Level    │
                    │ VIN ←── Batterie 5V │
                    └──────────────────────┘
```

---

### Commande de compilation

```bash
# Compiler pour Teensy avec optimisations embarquées
faust2teensy -single pedale-guitare.dsp

# Ou manuellement
faust -single -scal pedale-guitare.dsp -o PedaleGuitare.cpp
```

---

## Navigation

← Fiche précédente : **[04 - Web et mobile](04-web-mobile.md)**
