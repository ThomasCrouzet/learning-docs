---
tags:
  - Faust
  - Expert
  - Projet
description: "Projets créatifs - instrument VST complet, installation sonore, effet audio innovant et live coding avec Faust"
estimated_time: "95 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 7 - Maîtrise et contribution"
---

# 04 - Projets créatifs

> **En bref** : À la fin de cette fiche, tu sauras mener un projet créatif complet avec Faust, de la conception à la distribution, en choisissant les techniques et plateformes adaptées à ton objectif artistique. Lecture estimée : 95 min.


## Prérequis

- [Phase 1 complète - Fondamentaux acoustique](../01-fondamentaux-acoustique/index.md) : acoustique, audio numérique, mathématiques DSP, synthèse sonore
- [Phase 2 complète - Prérequis programmation](../02-prerequis-programmation/index.md) : programmation fonctionnelle, C++, environnement et outils
- [Phase 3 complète - Langage Faust fondamentaux](../03-langage-faust-fondamentaux/index.md) : syntaxe, opérateurs de composition, UI, mémoire et délais
- [Phase 4 complète - DSP appliqué](../04-dsp-applique/index.md) : oscillateurs, filtres, effets, modélisation physique
- [Phase 5 complète - Déploiement et architectures](../05-deploiement-architectures/index.md) : système d'architectures, plugins, applications standalone
- [Phase 6 complète - Intégration et projets avancés](../06-integration-projets-avances/index.md) : intégration multi-plateformes, projets avancés
- [Fiche 01 - Optimisation et performance](01-optimisation-performance.md) : vectorisation, benchmarking, profiling CPU
- [Fiche 02 - Contribution au projet Faust](02-contribution-projet.md) : compiler internals, PRs, communauté
- [Fiche 03 - Recherche et innovation](03-recherche-innovation.md) : papers académiques, Syfala FPGA, sémantique formelle

## Objectif de cette fiche

À la fin de cette fiche, tu sauras mener un projet créatif complet avec Faust, de la conception à la distribution, en choisissant les techniques et plateformes adaptées à ton objectif artistique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un instrument VST complet ?

**Définition** : Un instrument VST complet est un plugin audio autonome qui fonctionne dans un DAW (Digital Audio Workstation). Il combine un moteur de synthèse (le DSP écrit en Faust), une interface graphique personnalisée (via JUCE ou un autre framework), un système de presets et un format de distribution standard (VST3, AU, AAX).

**Le problème qu'un instrument VST complet résout** :

Sans instrument VST complet, voici les problèmes rencontrés :

1. **Code DSP inutilisable par les musiciens** : un fichier `.dsp` ne peut pas être chargé directement dans un DAW. Les musiciens utilisent Ableton, Logic Pro ou Reaper, pas la ligne de commande Faust
2. **Pas de persistance des réglages** : sans système de presets, l'utilisateur doit refaire tous ses réglages à chaque ouverture du projet
3. **Interface générique** : l'interface auto-générée par Faust (sliders et boutons bruts) ne communique pas l'identité sonore de l'instrument. Un synthétiseur professionnel a une interface qui guide l'utilisateur et reflète le caractère de l'instrument

**Comment un instrument VST complet résout ces problèmes** :

| Problème | Solution apportée par l'instrument VST complet |
| -------- | ----------------------------------------------- |
| Code DSP inutilisable | Le plugin VST3/AU se charge dans tous les DAW du marché, comme n'importe quel instrument commercial |
| Pas de persistance | Le système de presets sauvegarde et rappelle les réglages dans le projet du DAW et dans des fichiers exportables |
| Interface générique | L'UI JUCE personnalisée offre une expérience visuelle cohérente avec l'identité sonore de l'instrument |

**Analogie concrète** : Écrire le code DSP Faust, c'est comme concevoir le moteur d'une voiture. Le moteur seul ne sert à rien : il faut ajouter une carrosserie (l'interface graphique), un tableau de bord (les presets), des roues et un volant (les formats VST3/AU) pour que quelqu'un puisse conduire la voiture. L'instrument VST complet est la voiture prête à rouler.

**Ce qu'un instrument VST complet n'est PAS** :

- Un instrument VST complet n'est pas un simple prototype `faust2jaqt`. Un prototype permet de tester le son, mais il n'est pas distribuable et n'a pas de presets.
- Un instrument VST complet n'est pas un logiciel standalone uniquement. Le format VST3/AU permet l'intégration dans un DAW, avec automation des paramètres, routage audio et MIDI, et mixage avec d'autres instruments.

#### Architecture d'un instrument VST complet

```text
Instrument VST complet - Architecture
══════════════════════════════════════

┌─────────────────────────────────────────────────────┐
│                   DAW (hôte)                        │
│  ┌───────────────────────────────────────────────┐  │
│  │              Plugin VST3 / AU                 │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │          UI JUCE personnalisée          │  │  │
│  │  │  ┌──────┐  ┌──────┐  ┌──────────────┐  │  │  │
│  │  │  │Knobs │  │Menus │  │ Visualiseur  │  │  │  │
│  │  │  └──────┘  └──────┘  └──────────────┘  │  │  │
│  │  └───────────────┬─────────────────────────┘  │  │
│  │                  │ paramètres                  │  │
│  │  ┌───────────────▼─────────────────────────┐  │  │
│  │  │          Moteur DSP (Faust)              │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌───────┐  │  │  │
│  │  │  │ Synthèse │→ │ Filtres  │→ │ Effets│  │  │  │
│  │  │  │ FM + Sub │  │ Résonant │  │ Chorus│  │  │  │
│  │  │  └──────────┘  └──────────┘  │ Reverb│  │  │  │
│  │  │                              └───────┘  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │        Système de presets (.json)        │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                  Audio + MIDI                       │
└─────────────────────────────────────────────────────┘
```

#### Moteur de synthèse : FM + soustractive

L'instrument combine deux techniques de synthèse complémentaires.

| Technique | Rôle dans l'instrument | Paramètres clés |
| --------- | ---------------------- | --------------- |
| Synthèse FM | Timbres complexes, harmoniques riches (cloches, basses métalliques, pads évolutifs) | Ratio modulateur/porteuse, index de modulation |
| Synthèse soustractive | Timbres classiques (leads, basses rondes, pads doux) | Type d'oscillateur, cutoff, résonance |
| Polyphonie 16 voix | Permet de jouer des accords et des lignes mélodiques complexes | Nombre de voix, allocation |

```faust
import("stdfaust.lib");

// ─────────────────────────────────────
// Synthétiseur hybride FM + soustractif
// ─────────────────────────────────────

// Paramètres MIDI (reconnus automatiquement par Faust)
freq = hslider("freq", 440, 20, 8000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// --- Sélection du mode de synthèse ---
// 0 = soustractive, 1 = FM
synth_mode = hslider("[1]Mode (0=Sub, 1=FM)", 0, 0, 1, 1);

// --- Synthèse soustractive ---
// Oscillateur sélectionnable : 0 = saw, 1 = square, 2 = triangle
osc_type = hslider("[2]Osc Type (0-2)", 0, 0, 2, 1);

saw = os.sawtooth(freq);
square = os.square(freq);
triangle = os.triangle(freq);

// Sélection de l'oscillateur par index
sub_osc = saw * (osc_type == 0)
        + square * (osc_type == 1)
        + triangle * (osc_type == 2);

// Filtre résonant avec enveloppe
cutoff_base = hslider("[3]Cutoff (Hz)", 2000, 100, 10000, 1);
resonance = hslider("[4]Resonance", 0.5, 0, 0.95, 0.01);
env_amount = hslider("[5]Filter Env", 0.5, 0, 1, 0.01);

// Enveloppe du filtre (ADSR rapide)
filter_env = en.adsr(0.01, 0.2, 0.3, 0.1, gate);
cutoff = cutoff_base + filter_env * env_amount * 8000;

sub_voice = sub_osc : fi.resonlp(cutoff, resonance, 1);

// --- Synthèse FM ---
fm_ratio = hslider("[6]FM Ratio", 2, 0.5, 8, 0.01);
fm_index = hslider("[7]FM Index", 3, 0, 15, 0.01);

// Modulateur : fréquence = freq * ratio
// L'index de modulation contrôle la déviation en fréquence
modulator = os.osc(freq * fm_ratio) * freq * fm_index;

// Porteuse : fréquence = freq + modulation
fm_voice = os.osc(freq + modulator);

// --- Mixage FM / Soustractive ---
voice = sub_voice * (1 - synth_mode) + fm_voice * synth_mode;

// --- Enveloppe d'amplitude ADSR ---
attack = hslider("[8]Attack (s)", 0.01, 0.001, 2, 0.001);
decay = hslider("[9]Decay (s)", 0.2, 0.01, 2, 0.01);
sustain = hslider("[10]Sustain", 0.7, 0, 1, 0.01);
release_t = hslider("[11]Release (s)", 0.3, 0.01, 5, 0.01);

amp_env = en.adsr(attack, decay, sustain, release_t, gate);

// --- Sortie de la voix ---
process = voice * amp_env * gain;
```

#### Effets intégrés

L'instrument inclut deux effets intégrés qui s'appliquent après le mixage des voix.

```faust
// ─────────────────────────────────────
// Effets intégrés (appliqués en post-polyphonie)
// ─────────────────────────────────────

// Le bloc "effect" est reconnu par faust2juce
// Il s'applique une seule fois sur le mix de toutes les voix

// --- Chorus ---
chorus_rate = hslider("v:Effects/h:Chorus/[1]Rate (Hz)", 1.2, 0.1, 5, 0.01);
chorus_depth = hslider("v:Effects/h:Chorus/[2]Depth (ms)", 3, 0.5, 10, 0.1);
chorus_mix = hslider("v:Effects/h:Chorus/[3]Mix", 0.3, 0, 1, 0.01);

chorus_engine(x) = x * (1 - chorus_mix) + delayed * chorus_mix
with {
    maxdel = int(0.05 * ma.SR);
    lfo = os.osc(chorus_rate);
    mod_delay = (10 + lfo * chorus_depth) / 1000 * ma.SR;
    delayed = x : de.fdelay(maxdel, mod_delay);
};

// --- Reverb ---
reverb_size = hslider("v:Effects/h:Reverb/[1]Room Size", 0.6, 0, 1, 0.01);
reverb_damp = hslider("v:Effects/h:Reverb/[2]Damping", 0.4, 0, 1, 0.01);
reverb_mix = hslider("v:Effects/h:Reverb/[3]Mix", 0.25, 0, 1, 0.01);

reverb_engine(x) = x * (1 - reverb_mix) + reverbed * reverb_mix
with {
    reverbed = x : re.mono_freeverb(reverb_size, reverb_damp, 0.5, 1);
};

// Chaîne d'effets globale
effect = chorus_engine : reverb_engine;
```

#### Pipeline de développement

```text
Pipeline de développement d'un instrument VST complet
═════════════════════════════════════════════════════

Phase 1 : Spécification
├── Définir le son cible (quel type de musique, quelles textures)
├── Lister les paramètres exposés à l'utilisateur
├── Dessiner une maquette de l'interface graphique
└── Choisir les formats de sortie (VST3, AU, AAX)

Phase 2 : Prototypage Faust
├── Écrire le moteur de synthèse dans un fichier .dsp
├── Tester avec faust2jaqt ou l'IDE en ligne
├── Itérer sur le son jusqu'à satisfaction
└── Vérifier la charge CPU avec -vec et le benchmarking

Phase 3 : faust2juce
├── Générer le projet JUCE : faust2juce -jucemodulesdir /path/to/JUCE/modules synth.dsp
├── Ouvrir le projet dans Projucer ou CMake
├── Compiler en VST3 et AU pour vérifier le fonctionnement de base
└── Tester la polyphonie MIDI dans un DAW

Phase 4 : Interface graphique JUCE
├── Remplacer l'UI générique par des composants JUCE personnalisés
├── Créer les knobs, sliders et visualiseurs
├── Ajouter le système de presets (sauvegarde/chargement JSON)
└── Tester l'ergonomie avec des musiciens

Phase 5 : Tests et distribution
├── Tester dans plusieurs DAW (Ableton, Logic, Reaper, Bitwig)
├── Tester sur macOS, Windows et Linux
├── Vérifier l'absence de clics, pops et fuites mémoire
├── Créer l'installateur (PKG sur macOS, NSIS sur Windows)
└── Distribuer (site web, GitHub Releases, KVR Audio)
```

---

### Qu'est-ce qu'une installation sonore interactive ?

**Définition** : Une installation sonore interactive est une oeuvre artistique composée de plusieurs sources sonores disposées dans un espace physique. Ces sources réagissent en temps réel aux mouvements et à la présence du public grâce à des capteurs. Faust génère et traite le son sur des cartes embarquées, et le protocole OSC coordonne la communication entre les nœuds.

**Le problème qu'une installation sonore interactive résout** :

Sans installation sonore interactive, voici les problèmes rencontrés :

1. **Son figé** : une diffusion sonore classique (haut-parleurs + lecteur audio) joue toujours la même chose, quel que soit le public. L'expérience est passive et identique pour chaque visiteur
2. **Pas de spatialisation physique** : un système stéréo ou surround classique est limité à un point d'écoute optimal. Une installation multi-sources crée un espace sonore immersif dans lequel le visiteur se déplace
3. **Dépendance à un ordinateur central** : un ordinateur portable qui gère tout le son est un point de défaillance unique. S'il plante, l'installation entière s'arrête

**Comment une installation sonore interactive résout ces problèmes** :

| Problème | Solution apportée par l'installation interactive |
| -------- | ------------------------------------------------ |
| Son figé | Les capteurs détectent la présence et les mouvements du public. Le son évolue en fonction de l'interaction |
| Pas de spatialisation physique | Plusieurs sources sonores (3, 5, 8 ou plus) sont réparties dans l'espace. Le visiteur est immergé dans le son |
| Dépendance à un ordinateur central | Chaque nœud (Bela ou Raspberry Pi) est autonome. Si un nœud tombe, les autres continuent de fonctionner |

**Analogie concrète** : Imagine une forêt dans laquelle chaque arbre produit un son différent. Quand tu t'approches d'un arbre, son son devient plus fort et change de caractère. Quand tu t'éloignes, il redevient discret. L'ensemble des arbres crée un paysage sonore vivant qui réagit à ta position. L'installation sonore interactive fonctionne de la même manière : chaque source sonore est un "arbre" qui réagit à ton passage.

**Ce qu'une installation sonore interactive n'est PAS** :

- Une installation sonore interactive n'est pas un concert. Un concert a une scène, un public assis et une diffusion frontale. Une installation est un espace dans lequel le public se déplace librement et participe à la création sonore.
- Une installation sonore interactive n'est pas un système hi-fi multicanal. Un système hi-fi reproduit un enregistrement fixe. Une installation génère le son en temps réel en fonction des capteurs.

#### Architecture matérielle

```text
Installation sonore - Architecture matérielle
══════════════════════════════════════════════

                    ┌───────────────────┐
                    │   Ordinateur      │
                    │   de contrôle     │
                    │   (monitoring)    │
                    └────────┬──────────┘
                             │ OSC (Wi-Fi ou Ethernet)
          ┌──────────────────┼──────────────────┐
          │                  │                  │
  ┌───────▼──────┐   ┌──────▼───────┐   ┌──────▼───────┐
  │   Noeud 1    │   │   Noeud 2    │   │   Noeud 3    │
  │   (Bela)     │   │   (Bela)     │   │ (Rasp. Pi)   │
  │              │   │              │   │              │
  │ ┌──────────┐ │   │ ┌──────────┐ │   │ ┌──────────┐ │
  │ │  Faust   │ │   │ │  Faust   │ │   │ │  Faust   │ │
  │ │  DSP     │ │   │ │  DSP     │ │   │ │  DSP     │ │
  │ └──────────┘ │   │ └──────────┘ │   │ └──────────┘ │
  │ ┌──────────┐ │   │ ┌──────────┐ │   │ ┌──────────┐ │
  │ │ Capteurs │ │   │ │ Capteurs │ │   │ │ Capteurs │ │
  │ │ Ultrason │ │   │ │   PIR    │ │   │ │   Micro  │ │
  │ └──────────┘ │   │ └──────────┘ │   │ └──────────┘ │
  │  [Enceinte]  │   │  [Enceinte]  │   │  [Enceinte]  │
  └──────────────┘   └──────────────┘   └──────────────┘

Légende :
- Noeud : carte embarquée autonome avec audio et capteurs
- OSC : protocole Open Sound Control pour la communication
- Chaque noeud exécute son propre programme Faust
- L'ordinateur de contrôle est optionnel (monitoring/configuration)
```

#### Types de capteurs

| Capteur | Ce qu'il mesure | Usage dans l'installation |
| ------- | --------------- | ------------------------- |
| Ultrason (HC-SR04) | Distance (2 cm - 4 m) | Détecter la proximité d'un visiteur et moduler le son |
| PIR (infrarouge passif) | Présence/mouvement | Déclencher un son quand quelqu'un entre dans une zone |
| Microphone | Niveau sonore ambiant | Le son de l'installation réagit au bruit du public |
| Accéléromètre | Mouvement et orientation | Objets que le visiteur peut manipuler pour changer le son |
| Photorésistance (LDR) | Luminosité | Le son change en fonction de l'éclairage ou quand on cache le capteur |

#### Communication OSC entre les nœuds

```faust
import("stdfaust.lib");

// ─────────────────────────────────────
// Noeud d'installation sonore avec OSC
// ─────────────────────────────────────

// Paramètre contrôlé par le capteur de distance (via OSC)
// Le capteur ultrason envoie une valeur entre 0 (loin) et 1 (proche)
proximity = hslider("proximity [osc:/proximity]", 0, 0, 1, 0.001);

// Paramètre reçu des autres noeuds via OSC
// Permet une interaction entre les noeuds
neighbor_level = hslider("neighbor [osc:/neighbor/level]", 0, 0, 1, 0.001);

// --- Synthèse réactive à la proximité ---
// Plus le visiteur est proche, plus le son est riche et fort
base_freq = 80;

// La fréquence augmente avec la proximité
freq = base_freq + proximity * 200;

// L'index FM augmente avec la proximité (son plus complexe)
fm_index = proximity * 8;

// Le son du voisin influence le timbre (interaction entre noeuds)
fm_ratio = 2 + neighbor_level * 3;

// Synthèse FM réactive
modulator = os.osc(freq * fm_ratio) * freq * fm_index;
carrier = os.osc(freq + modulator);

// Le volume dépend de la proximité
volume = proximity * 0.8;

process = carrier * volume;
```

Lancement d'un nœud avec OSC :

```bash
# Compiler le programme Faust pour Bela
faust2bela installation_node.dsp

# OU compiler en standalone avec support OSC
faust2jaqt -osc installation_node.dsp

# Lancer avec un port OSC spécifique (un port différent par noeud)
./installation_node -port 5510 -xmit 1
```

Envoyer des messages OSC depuis un script Python (pour tester) :

```bash
# Installer python-osc (sur l'ordinateur de contrôle)
pip install python-osc
```

```text
# Exemple de script Python pour simuler un capteur
# (à exécuter sur l'ordinateur de contrôle)

from pythonosc import udp_client
import time, math

client = udp_client.SimpleUDPClient("192.168.1.10", 5510)

# Simuler un visiteur qui s'approche puis s'éloigne
for i in range(200):
    # Onde sinusoidale entre 0 et 1
    proximity = (math.sin(i * 0.05) + 1) / 2
    client.send_message("/proximity", proximity)
    time.sleep(0.05)
```

---

### Qu'est-ce qu'un effet audio innovant ?

**Définition** : Un effet audio innovant est un processeur de signal qui n'existe pas encore sur le marché ou qui combine des techniques existantes de manière originale. Il peut s'agir d'une reverb basée sur la modélisation physique d'un espace réel, d'un delay intelligent qui analyse le tempo du signal entrant, ou d'une distorsion spectrale sélective qui ne traite que certaines bandes de fréquences.

**Le problème qu'un effet audio innovant résout** :

Sans effet audio innovant, voici les problèmes rencontrés :

1. **Saturation du marché** : des centaines de reverbs, delays et distorsions existent déjà. Un nouveau plugin qui fait la même chose qu'un autre n'apporte aucune valeur
2. **Limites des effets classiques** : les algorithmes classiques (Schroeder, FDN, waveshaping) ont des caractéristiques sonores connues et prévisibles. Certains résultats sonores ne peuvent pas être obtenus avec les effets existants
3. **Manque de contrôle intelligent** : les effets classiques ont des paramètres statiques. Un delay à 300 ms reste à 300 ms, même si le tempo de la musique change

**Comment un effet audio innovant résout ces problèmes** :

| Problème | Solution apportée par l'effet innovant |
| -------- | -------------------------------------- |
| Saturation du marché | L'originalité de l'approche crée un effet unique qui se distingue de la concurrence |
| Limites des effets classiques | Combiner ou réinventer les techniques ouvre de nouvelles possibilités sonores |
| Manque de contrôle intelligent | L'analyse du signal entrant permet d'adapter automatiquement les paramètres de l'effet |

**Analogie concrète** : Un effet classique est comme un couteau de cuisine standard : il coupe tout de la même manière. Un effet innovant est comme un couteau qui adapte son tranchant au type d'aliment : plus fin pour le poisson, plus épais pour le pain, dentelé pour la tomate. L'outil s'adapte intelligemment à ce qu'il traite.

**Ce qu'un effet audio innovant n'est PAS** :

- Un effet innovant n'est pas un effet "différent pour être différent". L'originalité doit apporter une valeur sonore réelle. Un effet inutilisable musicalement n'a pas d'intérêt, même s'il est techniquement original.
- Un effet innovant n'est pas nécessairement complexe. Une idée simple mais bien exécutée (un filtre qui suit la hauteur de la voix, par exemple) est plus innovante qu'un algorithme complexe.

#### Exemples d'effets innovants

| Concept | Principe | Originalité |
| ------- | -------- | ----------- |
| Reverb par modélisation physique | Simuler les réflexions dans un espace 3D réel (dimensions, matériaux des murs, position de la source) | Chaque "salle" a un son unique lié à sa géométrie réelle, pas à des paramètres abstraits |
| Delay intelligent | Analyser le tempo du signal entrant (détection de transitoires) et synchroniser le delay automatiquement | Le delay s'adapte au tempo sans réglage manuel, même si le tempo change |
| Distorsion spectrale sélective | Appliquer la distorsion uniquement sur certaines bandes de fréquences (par exemple, distordre les médiums mais garder les basses et les aigus propres) | Contrôle chirurgical de la saturation, impossible avec une distorsion classique |
| Granulateur spectral | Découper le signal en grains, appliquer une FFT sur chaque grain, puis recombiner en modifiant l'ordre des bins spectraux | Textures sonores inédites, entre le gel spectral et la granulation temporelle |

#### Prototype de distorsion spectrale sélective

```faust
import("stdfaust.lib");

// ─────────────────────────────────────
// Distorsion spectrale sélective
// Applique la distorsion uniquement sur la bande médium
// ─────────────────────────────────────

// Séparation en 3 bandes de fréquences
// Bande basse : 0 - low_freq
// Bande médium : low_freq - high_freq
// Bande haute : high_freq - SR/2
low_freq = hslider("[1]Low Crossover (Hz)", 300, 50, 1000, 1);
high_freq = hslider("[2]High Crossover (Hz)", 3000, 1000, 10000, 1);

// Séparation en 3 bandes avec des filtres Butterworth ordre 4
// fi.lowpass(ordre, freq) et fi.highpass(ordre, freq)
low_band(x) = x : fi.lowpass(4, low_freq);
mid_band(x) = x : fi.highpass(4, low_freq) : fi.lowpass(4, high_freq);
high_band(x) = x : fi.highpass(4, high_freq);

// Distorsion appliquée uniquement sur la bande médium
drive = hslider("[3]Drive", 5, 1, 30, 0.1);
distort(x) = ma.tanh(x * drive) / ma.tanh(drive);

// Mix final : mélange dry/wet entre le signal sec et le signal multibande traité
mix = hslider("[4]Dry/Wet", 0.5, 0, 1, 0.01);

// Le signal d'entrée est dupliqué : une copie sèche (1 - mix), une copie
// traitée (basses propres + médiums distordus + aigus propres) pondérée par mix.
wet_signal = low_band, (mid_band : distort), high_band :> _;
process = _ <: _ * (1 - mix), wet_signal * mix :> _;
```

#### Pipeline de développement d'un effet innovant

```text
Pipeline de développement d'un effet audio innovant
════════════════════════════════════════════════════

Phase 1 : Idéation
├── Identifier un problème sonore non résolu ou mal résolu
├── Rechercher l'état de l'art (papers, plugins existants)
├── Formuler l'idée en une phrase claire
└── Vérifier la faisabilité technique (temps réel, CPU)

Phase 2 : Prototype Faust
├── Implémenter l'algorithme de base dans un fichier .dsp
├── Tester avec différentes sources audio (voix, guitare, batterie)
├── Mesurer la charge CPU avec -vec et le benchmarking
└── Itérer sur l'algorithme (ajuster, simplifier, optimiser)

Phase 3 : Benchmarking et comparaison
├── Comparer avec les effets existants les plus proches
├── Mesurer la latence (nombre d'échantillons de retard)
├── Vérifier la stabilité (pas de clics, pas de dérive, pas d'explosion)
└── Documenter les cas d'usage et les limites

Phase 4 : Plugin distributable
├── Compiler avec faust2juce en VST3/AU
├── Ajouter une interface graphique adaptée
├── Créer des presets qui montrent les possibilités de l'effet
└── Tester dans plusieurs DAW et systèmes d'exploitation
```

---

### Qu'est-ce que le live coding avec Faust ?

**Définition** : Le live coding est une pratique de performance artistique dans laquelle le musicien-programmeur écrit et modifie du code en temps réel devant un public. Le code est compilé et exécuté instantanément (hot-reloading), et le son change à mesure que le code est modifié. Avec Faust, le live coding utilise FaustLive ou `faustgen~` dans Max/MSP pour recompiler le DSP à la volée.

**Le problème que le live coding résout** :

Sans live coding, voici les problèmes rencontrés :

1. **Cycle compile-test trop long** : le workflow classique (écrire → compiler → lancer → écouter → arrêter → modifier → recompiler) prend plusieurs secondes à chaque changement. Cela brise le flux créatif
2. **Performance figée** : un musicien électronique classique lance des boucles préparées et ajuste des knobs. La structure musicale est définie à l'avance. Le live coding permet de créer la musique à partir de zéro pendant la performance
3. **Processus créatif opaque** : le public d'un concert électronique voit quelqu'un derrière un ordinateur sans comprendre ce qui se passe. Le live coding rend le processus visible : le code est projeté sur un écran, et le public voit les changements en temps réel

**Comment le live coding résout ces problèmes** :

| Problème | Solution apportée par le live coding |
| -------- | ------------------------------------ |
| Cycle compile-test trop long | Le hot-reloading compile et remplace le DSP en quelques millisecondes, sans interruption du son |
| Performance figée | Le musicien construit la pièce en direct, avec la possibilité de prendre des directions imprévues |
| Processus créatif opaque | Le code projeté montre au public exactement ce que le musicien fait et pense |

**Analogie concrète** : Le live coding est comme un peintre qui peint en direct devant un public. Chaque coup de pinceau modifie le tableau en temps réel. Le public voit le processus créatif se dérouler, pas seulement le résultat final. De même, le live coder écrit du code et le public entend chaque modification prendre effet immédiatement.

**Ce que le live coding n'est PAS** :

- Le live coding n'est pas du DJing. Un DJ mixe des morceaux existants. Le live coder crée le son à partir de code, en temps réel, à partir de rien (ou presque).
- Le live coding n'est pas de la démonstration technique. L'objectif est artistique et musical, pas de montrer qu'on sait programmer vite. La qualité sonore et musicale prime sur la quantité de code écrit.

**Comparaison live coding vs performance électronique classique** :

| Live coding | Performance électronique classique |
| ----------- | ---------------------------------- |
| Le son est créé en temps réel par du code | Le son est préparé à l'avance (samples, boucles, presets) |
| Le processus est visible (code projeté) | Le processus est opaque (écran d'ordinateur) |
| Risque élevé (erreurs en direct) | Risque faible (tout est préparé) |
| Chaque performance est unique | Les performances sont reproductibles |
| Compétences : programmation + musique | Compétences : mixage + arrangement |

#### Outils de live coding Faust

| Outil | Description | Avantage |
| ----- | ----------- | -------- |
| FaustLive | Application standalone dédiée au live coding Faust. Interface graphique avec éditeur de code et hot-reloading intégré | Prêt à l'emploi, pas de configuration nécessaire |
| `faustgen~` dans Max/MSP | Objet Max qui compile du code Faust en temps réel. Le code est édité dans un éditeur intégré | Intégration avec l'écosystème Max (visuels, MIDI, OSC, Jitter) |
| `faust~` dans PureData | Objet PureData équivalent à `faustgen~` | Open source, léger, multi-plateforme |
| Faust IDE en ligne | Éditeur web avec compilation et exécution dans le navigateur | Aucune installation requise, partage facile |

#### Snippets réutilisables pour le live coding

En performance, la vitesse d'écriture est essentielle. Prépare une bibliothèque de snippets que tu peux taper ou coller rapidement.

```faust
// ─────────────────────────────────────
// Snippets de live coding Faust
// ─────────────────────────────────────

// --- Snippet 1 : Kick drum ---
// Un kick basique : sinusoide dont la fréquence descend rapidement
kick(gate) = os.osc(freq) * amp
with {
    // La fréquence descend de 200 Hz à 50 Hz en 100 ms
    freq = 50 + 150 * en.ar(0.001, 0.1, gate);
    // L'amplitude décroît en 200 ms
    amp = en.ar(0.001, 0.2, gate);
};

// --- Snippet 2 : Hi-hat ---
// Bruit filtré passe-haut avec enveloppe très courte
hihat(gate) = no.noise : fi.highpass(2, 8000) * en.ar(0.001, 0.05, gate);

// --- Snippet 3 : Bass line ---
// Oscillateur carré avec filtre passe-bas résonant
bass(freq, gate) = os.square(freq) : fi.resonlp(cutoff, 0.7, 1) * amp
with {
    cutoff = 200 + 1800 * en.adsr(0.01, 0.1, 0.3, 0.1, gate);
    amp = en.adsr(0.01, 0.1, 0.8, 0.1, gate);
};

// --- Snippet 4 : Pad ---
// Accord de 3 oscillateurs désaccordés avec reverb
pad(freq, gate) = (osc1 + osc2 + osc3) / 3 * amp
with {
    // 3 oscillateurs légèrement désaccordés (+/- 2 Hz)
    osc1 = os.sawtooth(freq - 2);
    osc2 = os.sawtooth(freq);
    osc3 = os.sawtooth(freq + 2);
    amp = en.adsr(0.5, 0.3, 0.7, 1.0, gate);
};

// --- Snippet 5 : Séquenceur simple ---
// Séquenceur 4 pas avec horloge réglable
sequencer(bpm) = clock : counter
with {
    // ba.pulse(period) génère un trigger tous les N échantillons
    samples_per_beat = int(ma.SR * 60 / bpm);
    clock = ba.pulse(samples_per_beat);
    // Compteur cyclique 0 → 3 (4 pas) déclenché par l'horloge
    counter = +(1) ~ *(1 - clock) : %(4);
};
```

#### Techniques de performance live

```text
Techniques de performance live coding
══════════════════════════════════════

1. Build progressif
   ├── Commencer par un seul oscillateur ou un bruit
   ├── Ajouter des éléments un par un (filtre, enveloppe, effet)
   ├── Le public entend la construction progressive du son
   └── Chaque étape est un changement audible et intéressant

2. Variations en temps réel
   ├── Modifier un paramètre numérique (fréquence, index FM)
   ├── Changer le type de filtre ou d'oscillateur
   ├── Ajouter ou retirer un effet
   └── Modifier la structure de composition (série → parallèle)

3. Interaction avec le public
   ├── Paramètres OSC contrôlés par le public (smartphones, capteurs)
   ├── Réagir aux réactions du public (plus fort, plus doux, plus intense)
   ├── Projeter le code pour que le public suive les modifications
   └── Expliquer brièvement les changements entre les sections

4. Combinaison avec des visuels
   ├── Processing : visuels génératifs synchronisés avec l'audio
   ├── TouchDesigner : environnement visuel temps réel avec OSC
   ├── Hydra : live coding vidéo dans le navigateur
   └── Le son contrôle les visuels via OSC ou analyse audio

5. Gestion des erreurs en performance
   ├── Préparer des "filets de sécurité" (fichiers .dsp de secours)
   ├── Tester chaque changement mentalement avant de compiler
   ├── Garder une copie fonctionnelle du dernier état stable
   └── Transformer les erreurs en opportunités créatives
```

---

### Qu'est-ce que la méthodologie de projet ?

**Définition** : La méthodologie de projet est l'ensemble des pratiques qui structurent le développement d'un projet créatif Faust, de l'idée initiale à la distribution finale. Elle couvre les phases de recherche, spécification, prototypage, développement, test et distribution, ainsi que les pratiques transversales de documentation, versionnage et tests audio.

**Le problème que la méthodologie de projet résout** :

Sans méthodologie structurée, voici les problèmes rencontrés :

1. **Projet qui n'aboutit pas** : sans plan clair, le développeur passe d'une idée à l'autre sans jamais terminer. Le projet reste un éternel prototype
2. **Bugs audio non détectés** : sans tests systématiques, des clics, pops, fuites de mémoire ou dérives numériques passent inaperçus et sont découverts par les utilisateurs
3. **Code non maintenable** : sans documentation et versionnage, le développeur oublie pourquoi il a fait certains choix. Revenir sur le projet après quelques mois devient difficile

**Comment la méthodologie de projet résout ces problèmes** :

| Problème | Solution apportée par la méthodologie |
| -------- | ------------------------------------- |
| Projet qui n'aboutit pas | Les phases structurées (spécification → prototype → développement → test → distribution) garantissent une progression linéaire vers un livrable concret |
| Bugs audio non détectés | Les tests audio systématiques (signal de test, mesure de latence, vérification de stabilité) détectent les problèmes avant la distribution |
| Code non maintenable | La documentation du code (commentaires, README, changelog) et le versionnage Git permettent de comprendre et maintenir le projet dans la durée |

**Analogie concrète** : La méthodologie de projet est comme un plan de construction pour une maison. Sans plan, le maçon pose des briques au hasard et la maison risque de s'effondrer. Avec un plan, chaque étape est définie à l'avance : fondations, murs, toit, finitions. Le plan ne limite pas la créativité de l'architecte, il garantit que la maison sera habitable à la fin.

#### Phases d'un projet créatif Faust

| Phase | Objectif | Livrables |
| ----- | -------- | --------- |
| 1. Recherche | Comprendre l'état de l'art et identifier l'originalité du projet | Notes de recherche, liste de références |
| 2. Spécification | Définir précisément ce que le projet doit faire | Cahier des charges, maquette UI |
| 3. Prototype | Valider le concept avec un code minimal fonctionnel | Fichier `.dsp` fonctionnel, enregistrement audio |
| 4. Développement | Implémenter la version complète avec UI et presets | Code source complet, interface graphique |
| 5. Test | Vérifier la stabilité, la performance et la compatibilité | Rapports de test, fichiers audio de référence |
| 6. Distribution | Rendre le projet accessible aux utilisateurs | Installateur, page web, documentation utilisateur |

#### Tests audio essentiels

```text
Tests audio pour un projet Faust
═════════════════════════════════

1. Test de silence
   - Entrée : aucune note, aucun trigger
   - Attendu : silence complet (0.0 sur tous les échantillons)
   - Vérifie : pas de bruit de fond, pas de DC offset

2. Test de stabilité longue durée
   - Entrée : signal continu pendant 10 minutes
   - Attendu : pas de dérive, pas de clic, pas d'explosion
   - Vérifie : stabilité numérique des filtres et des boucles de feedback

3. Test de charge CPU
   - Mesurer la charge CPU avec toutes les voix actives
   - Attendu : < 50% d'un coeur CPU à 44 100 Hz
   - Vérifie : le plugin est utilisable dans un mix avec d'autres plugins

4. Test de latence
   - Mesurer le retard entre entrée et sortie
   - Attendu : < 256 échantillons (< 6 ms à 44 100 Hz)
   - Vérifie : pas de latence excessive pour le jeu en temps réel

5. Test multi-DAW
   - Charger le plugin dans Ableton, Logic, Reaper, Bitwig
   - Attendu : fonctionnement identique dans tous les DAW
   - Vérifie : compatibilité des formats VST3/AU
```

#### Versionnage avec Git

```bash
# Initialiser le dépôt pour un projet Faust
git init mon-instrument-faust
cd mon-instrument-faust

# Structure de base du projet
mkdir -p src presets docs tests

# src/     → fichiers .dsp et code JUCE
# presets/ → fichiers JSON de presets
# docs/    → documentation (cahier des charges, manuel utilisateur)
# tests/   → fichiers audio de test et scripts de benchmarking
```

```text
Structure d'un projet Faust bien organisé
══════════════════════════════════════════

mon-instrument-faust/
├── src/
│   ├── synth.dsp          # Moteur de synthèse principal
│   ├── effects.dsp        # Effets intégrés
│   └── juce/              # Code JUCE pour l'interface graphique
│       ├── PluginProcessor.cpp
│       └── PluginEditor.cpp
├── presets/
│   ├── factory/
│   │   ├── pad-warm.json
│   │   ├── lead-bright.json
│   │   └── bass-deep.json
│   └── user/              # Presets créés par l'utilisateur
├── docs/
│   ├── cahier-des-charges.md
│   ├── changelog.md
│   └── manuel-utilisateur.md
├── tests/
│   ├── test-silence.sh
│   ├── test-stability.sh
│   └── audio-reference/   # Fichiers audio de référence pour comparaison
├── .gitignore
├── README.md
└── CMakeLists.txt
```

---

## Étapes Pratiques

### Étape 1 : Choisir un projet parmi les 4 proposés

Lis attentivement la description de chaque projet et choisis celui qui correspond le mieux à tes intérêts et à ton matériel disponible.

| Projet | Ce qu'il faut | Difficulté | Matériel requis |
| ------ | ------------- | ---------- | --------------- |
| 1. Instrument VST | Faust + JUCE + DAW | Elevée | Ordinateur avec DAW |
| 2. Installation sonore | Faust + capteurs + OSC | Elevée | Bela ou Raspberry Pi + capteurs |
| 3. Effet innovant | Faust + créativité DSP | Moyenne | Ordinateur avec DAW |
| 4. Live coding | Faust + FaustLive/Max | Moyenne | Ordinateur + projecteur (optionnel) |

**Résultat attendu** :

```text
Tu as choisi un projet parmi les 4. Tu sais pourquoi ce projet
t'intéresse et tu as vérifié que tu disposes du matériel nécessaire.
```

---

### Étape 2 : Rédiger un cahier des charges

Avant d'écrire une seule ligne de code, rédige un document qui décrit précisément ton projet.

Le cahier des charges doit contenir :

```text
Cahier des charges - Template
═════════════════════════════

1. Nom du projet
   [Nom court et descriptif]

2. Description en une phrase
   [Ce que fait le projet, pour qui, et pourquoi]

3. Fonctionnalités principales
   - Fonctionnalité 1 : [description]
   - Fonctionnalité 2 : [description]
   - Fonctionnalité 3 : [description]

4. Paramètres exposés à l'utilisateur
   | Paramètre | Plage | Valeur par défaut | Description |
   | --------- | ----- | ----------------- | ----------- |
   | ...       | ...   | ...               | ...         |

5. Cible de déploiement
   [VST3/AU, standalone, embarqué, web]

6. Contraintes techniques
   - CPU max : [pourcentage d'un coeur]
   - Latence max : [millisecondes]
   - Sample rate : [44100 / 48000 Hz]

7. Critères de réussite
   - [ ] Critère 1
   - [ ] Critère 2
   - [ ] Critère 3
```

**Résultat attendu** :

```text
Tu as un document écrit (fichier texte ou Markdown) qui décrit
ton projet de manière précise et mesurable. Les critères de réussite
sont objectifs : tu pourras vérifier chacun d'eux à la fin du projet.
```

---

### Étape 3 : Prototyper le DSP en Faust

Écris le moteur DSP dans un fichier `.dsp`. A cette étape, concentre-toi uniquement sur le son. L'interface graphique et les presets viendront plus tard.

```bash
# Créer la structure du projet
mkdir -p mon-projet/src mon-projet/presets mon-projet/docs mon-projet/tests

# Créer le fichier DSP principal
touch mon-projet/src/prototype.dsp

# Éditer avec ton éditeur de code
code mon-projet/src/prototype.dsp
```

Teste le prototype en continu pendant le développement :

```bash
# Compiler et lancer le prototype
faust2jaqt mon-projet/src/prototype.dsp

# OU utiliser l'IDE Faust en ligne pour un retour immédiat
# https://faustide.grame.fr/
```

**Résultat attendu** :

```text
Tu as un fichier .dsp fonctionnel qui produit le son attendu.
Le prototype n'a pas besoin d'être parfait : il valide le concept sonore.
Les paramètres principaux sont accessibles via des sliders et des boutons.
La charge CPU est raisonnable (mesurée avec le flag -bench ou l'IDE en ligne).
```

---

### Étape 4 : Choisir la plateforme de déploiement

En fonction de ton projet, choisis le script `faust2xxx` adapté et compile ton prototype pour la plateforme cible.

| Projet | Script de compilation | Commande |
| ------ | --------------------- | -------- |
| Instrument VST | `faust2juce` | `faust2juce -jucemodulesdir /path/to/JUCE/modules -nvoices 16 synth.dsp` |
| Installation sonore | `faust2bela` ou `faust2alsa` | `faust2bela -osc node.dsp` |
| Effet innovant | `faust2juce` | `faust2juce -jucemodulesdir /path/to/JUCE/modules effect.dsp` |
| Live coding | FaustLive ou `faustgen~` | Ouvrir FaustLive et charger le fichier `.dsp` |

```bash
# Exemple : compiler un instrument VST avec polyphonie
faust2juce -jucemodulesdir ~/JUCE/modules -nvoices 16 mon-projet/src/synth.dsp

# Le résultat est un dossier contenant un projet JUCE complet
# Ouvrir le .jucer avec Projucer ou compiler avec CMake
```

**Résultat attendu** :

```text
Le prototype est compilé pour la plateforme cible.
- Pour un VST : le plugin se charge dans un DAW et produit du son
- Pour Bela : le programme s'exécute sur la carte et répond aux capteurs
- Pour FaustLive : le code se recompile à chaque sauvegarde
```

---

### Étape 5 : Développer, tester et documenter

Cette étape finale transforme le prototype en produit fini.

**Développement** :

```bash
# Itérer sur le code avec versionnage
cd mon-projet
git init
git add .
git commit -m "Prototype initial fonctionnel"

# Créer une branche pour chaque fonctionnalité
git checkout -b feature/chorus-effect
# ... développer ...
git add .
git commit -m "Ajouter chorus intégré"
git checkout main
git merge feature/chorus-effect
```

**Tests audio** :

```bash
# Tester la charge CPU avec le benchmarking Faust
faust -vec -bench src/synth.dsp

# Tester la stabilité : compiler et laisser tourner 10 minutes
faust2jaqt src/synth.dsp
# Jouer des notes et vérifier l'absence de clics et de pops
```

**Documentation** :

```bash
# Documenter dans le README
# - Comment compiler le projet
# - Comment installer le plugin
# - Description des paramètres
# - Exemples de presets et d'usage
```

**Résultat attendu** :

```text
Le projet est complet :
- Le code est versionné avec Git (commits clairs et atomiques)
- Les tests audio confirment la stabilité et la performance
- La documentation permet à un autre développeur de compiler et utiliser le projet
- Les presets démontrent les capacités du projet
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust2juce -jucemodulesdir /path synth.dsp` | Générer un projet JUCE à partir d'un fichier Faust |
| `faust2juce -nvoices 16 synth.dsp` | Générer un instrument polyphonique JUCE (16 voix) |
| `faust2bela node.dsp` | Compiler pour la carte Bela (audio embarqué) |
| `faust2bela -osc node.dsp` | Compiler pour Bela avec support OSC |
| `faust2jaqt -osc effect.dsp` | Compiler en standalone avec support OSC |
| `faust -vec -bench synth.dsp` | Benchmarker la charge CPU avec vectorisation |
| `faust -a minimal.cpp synth.dsp -o synth.cpp` | Générer le C++ avec une architecture minimale |
| `./app -port 5510 -xmit 1` | Lancer une application Faust avec envoi OSC sur le port 5510 |

---

## Pièges Fréquents

### Piège 1 : Commencer par l'interface graphique avant le son

**Problème** : Passer des jours à créer une belle interface JUCE avant d'avoir validé le moteur de synthèse. Si le son ne convient pas, l'interface est inutile et doit être refaite.

**Solution** : Toujours prototyper le DSP en premier avec `faust2jaqt` ou l'IDE en ligne. Ne passer à l'interface graphique que lorsque le son est satisfaisant.

```text
Ordre correct :
1. Prototype DSP (faust2jaqt) → valider le son
2. Compilation plugin (faust2juce) → valider dans le DAW
3. Interface graphique (JUCE) → habiller le plugin
4. Presets → démontrer les possibilités

Ordre incorrect :
1. Interface graphique → jolie mais pas de son
2. Prototype DSP → le son ne convient pas
3. Refaire l'interface → temps perdu
```

---

### Piège 2 : Polyphonie qui consomme trop de CPU

**Problème** : Avec 16 voix de polyphonie, la charge CPU est 16 fois celle d'une voix. Si une voix consomme 5% du CPU, 16 voix consomment 80%, ce qui rend le plugin inutilisable dans un mix.

**Solution** : Optimiser le DSP d'une seule voix avant d'activer la polyphonie. Utiliser la vectorisation (`-vec`) et mesurer la charge CPU par voix.

```bash
# Mesurer la charge CPU d'une seule voix
faust -vec -bench synth_mono.dsp

# Règle pratique :
# Si une voix consomme X% du CPU,
# N voix consomment environ N * X% du CPU.
# Objectif : < 3% par voix pour 16 voix (total < 48%)
```

---

### Piège 3 : OSC non configuré pour l'installation

**Problème** : Les nœuds de l'installation ne communiquent pas entre eux. Les messages OSC sont envoyés mais jamais reçus. Causes fréquentes : mauvais port, firewall, adresse IP incorrecte.

**Solution** : Tester la communication OSC étape par étape avant de déployer l'installation complète.

```bash
# 1. Vérifier que le noeud écoute sur le bon port
./node -port 5510

# 2. Envoyer un message de test depuis un autre ordinateur
# Utiliser oscsend (outil en ligne de commande) ou un script Python
oscsend 192.168.1.10 5510 /proximity f 0.5

# 3. Vérifier la réception avec oscrecv
oscrecv 5510

# 4. Si rien n'est reçu :
#    - Vérifier l'adresse IP du noeud (ip addr ou ifconfig)
#    - Vérifier que le port n'est pas bloqué par un firewall
#    - Vérifier que les machines sont sur le même réseau
```

---

### Piège 4 : Live coding sans filet de sécurité

**Problème** : En performance live, une erreur de syntaxe ou un feedback > 1.0 peut couper le son ou produire un bruit assourdissant devant le public. Le stress de la performance augmente le risque d'erreurs.

**Solution** : Préparer des mécanismes de sécurité avant la performance.

```text
Checklist de sécurité pour le live coding :

1. Volume master
   - Toujours avoir un contrôle de volume physique (table de mixage)
   - Ne jamais dépendre uniquement du volume logiciel

2. Fichiers de secours
   - Préparer 3-4 fichiers .dsp fonctionnels et testés
   - Si le code en cours de modification ne compile pas,
     charger un fichier de secours

3. Limiteur en sortie
   - Toujours placer un limiteur hardware ou logiciel
     après la sortie de Faust
   - Cela protège les enceintes et l'audition du public

4. Copie fonctionnelle
   - Avant chaque modification en live, copier le code actuel
   - Si la modification échoue, revenir à la copie
   - FaustLive garde un historique automatique

5. Répétition
   - Répéter la performance entière au moins 3 fois
   - Pratiquer les transitions entre les sections
   - Simuler des erreurs et s'entraîner à les récupérer
```

---

### Piège 5 : Ne pas tester dans plusieurs DAW

**Problème** : Le plugin fonctionne dans Ableton Live mais plante dans Logic Pro, ou le contraire. Chaque DAW a des subtilités dans la gestion des plugins (taille de buffer, ordre d'appel des callbacks, gestion des presets).

**Solution** : Tester systématiquement dans au moins 3 DAW avant de distribuer.

```text
Matrice de test multi-DAW :

| Test                  | Ableton | Logic | Reaper | Bitwig |
| --------------------- | ------- | ----- | ------ | ------ |
| Chargement du plugin  | [ ]     | [ ]   | [ ]    | [ ]    |
| Polyphonie MIDI       | [ ]     | [ ]   | [ ]    | [ ]    |
| Automation paramètres | [ ]     | [ ]   | [ ]    | [ ]    |
| Sauvegarde de preset  | [ ]     | [ ]   | [ ]    | [ ]    |
| Rappel de preset      | [ ]     | [ ]   | [ ]    | [ ]    |
| Sauvegarde de projet  | [ ]     | [ ]   | [ ]    | [ ]    |
| Rappel de projet      | [ ]     | [ ]   | [ ]    | [ ]    |
| Buffer 64 samples     | [ ]     | [ ]   | [ ]    | [ ]    |
| Buffer 1024 samples   | [ ]     | [ ]   | [ ]    | [ ]    |
| Pas de clics/pops     | [ ]     | [ ]   | [ ]    | [ ]    |
```

---

## Checklist de Validation

- [ ] Je sais expliquer l'architecture d'un instrument VST complet (DSP + UI + presets + format de distribution)
- [ ] Je sais utiliser `faust2juce` pour générer un projet JUCE à partir d'un fichier Faust
- [ ] Je comprends la différence entre le bloc `process` (voix) et le bloc `effect` (post-polyphonie)
- [ ] Je sais concevoir une installation sonore interactive avec capteurs et OSC
- [ ] Je sais compiler pour Bela ou Raspberry Pi avec `faust2bela` ou `faust2alsa`
- [ ] Je comprends comment les messages OSC contrôlent les paramètres Faust (`[osc:/path]`)
- [ ] Je sais prototyper un effet audio innovant et le comparer avec les effets existants
- [ ] Je connais les outils de live coding Faust (FaustLive, `faustgen~`, Faust IDE)
- [ ] Je sais préparer des snippets réutilisables pour une performance live
- [ ] Je connais les techniques de performance (build progressif, variations, interaction public)
- [ ] Je sais structurer un projet Faust (src/, presets/, docs/, tests/)
- [ ] Je sais appliquer les tests audio essentiels (silence, stabilité, CPU, latence, multi-DAW)
- [ ] Je sais rédiger un cahier des charges pour un projet créatif

---

## Exercice Pratique

**Enoncé** : Réalise le Projet 1 (Instrument VST) en version simplifiée. Crée un synthétiseur polyphonique avec les fonctionnalités suivantes :

- 2 oscillateurs sélectionnables (saw, square, triangle) avec possibilité de les mixer
- Un filtre résonant passe-bas avec une enveloppe dédiée (contrôle du cutoff par ADSR)
- Une enveloppe d'amplitude ADSR complète (attack, decay, sustain, release)
- Un effet de chorus intégré
- Une reverb intégrée
- Compilation en plugin VST3 avec `faust2juce`
- Création de 3 presets : pad, lead, bass

**Indications** :

- Utilise les variables `freq`, `gain` et `gate` pour la polyphonie MIDI
- Le bloc `process` contient la voix de synthèse (une seule voix, Faust gère la duplication)
- Le bloc `effect` contient les effets post-polyphonie (chorus + reverb)
- Organise les contrôles dans des groupes UI (`vgroup`, `hgroup`) pour la lisibilité
- Le filtre résonant utilise `fi.resonlp(cutoff, resonance, gain)`
- Le chorus utilise un LFO sinusoidal avec `os.osc(rate)` et un delay fractionnaire `de.fdelay`
- La reverb utilise `re.mono_freeverb` de la bibliothèque standard
- Compile avec `-nvoices 16` pour la polyphonie 16 voix

**Résultat attendu** :

- Le plugin se charge dans un DAW et répond au MIDI
- Les 2 oscillateurs peuvent être sélectionnés et mixés via un slider
- Le filtre résonant sculpte le timbre avec une enveloppe ADSR dédiée
- L'enveloppe d'amplitude contrôle le volume de chaque note
- Le chorus épaissit le son de manière subtile
- La reverb ajoute de la spatialisation
- Les 3 presets produisent des sons distincts et musicalement utiles

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
import("stdfaust.lib");

// ═══════════════════════════════════════════════
// Synthétiseur polyphonique - Exercice Projet 1
// ═══════════════════════════════════════════════

// --- Paramètres MIDI (reconnus automatiquement) ---
freq = hslider("freq", 440, 20, 8000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// ─────────────────────────────────────
// Section oscillateurs
// ─────────────────────────────────────

// Type d'oscillateur pour chaque oscillateur (0=saw, 1=square, 2=triangle)
osc1_type = vgroup("[1]Oscillators", hslider("[1]Osc1 Type (0-2)", 0, 0, 2, 1));
osc2_type = vgroup("[1]Oscillators", hslider("[2]Osc2 Type (0-2)", 1, 0, 2, 1));

// Mix entre les deux oscillateurs (0 = osc1 seul, 1 = osc2 seul)
osc_mix = vgroup("[1]Oscillators", hslider("[3]Osc Mix", 0.5, 0, 1, 0.01));

// Désaccordage de l'oscillateur 2 en demi-tons (-12 à +12)
osc2_detune = vgroup("[1]Oscillators",
    hslider("[4]Osc2 Detune (st)", 0, -12, 12, 0.01));

// Fonction qui sélectionne le type d'oscillateur
select_osc(f, t) = os.sawtooth(f) * (t == 0)
                  + os.square(f) * (t == 1)
                  + os.triangle(f) * (t == 2);

// Fréquence de l'oscillateur 2 avec désaccordage
// Formule : freq * 2^(demi-tons / 12)
freq2 = freq * 2 ^ (osc2_detune / 12);

// Génération des deux oscillateurs
oscillator1 = select_osc(freq, osc1_type);
oscillator2 = select_osc(freq2, osc2_type);

// Mixage des deux oscillateurs
osc_output = oscillator1 * (1 - osc_mix) + oscillator2 * osc_mix;

// ─────────────────────────────────────
// Section filtre
// ─────────────────────────────────────

// Fréquence de coupure de base
filter_cutoff = vgroup("[2]Filter",
    hslider("[1]Cutoff (Hz)", 2000, 50, 15000, 1));

// Résonance du filtre (0 = pas de résonance, 0.95 = forte résonance)
filter_reso = vgroup("[2]Filter",
    hslider("[2]Resonance", 0.3, 0, 0.95, 0.01));

// Quantité d'enveloppe appliquée au cutoff (0 = pas d'enveloppe, 1 = max)
filter_env_amount = vgroup("[2]Filter",
    hslider("[3]Env Amount", 0.5, 0, 1, 0.01));

// ADSR du filtre (contrôle la modulation du cutoff dans le temps)
filter_attack = vgroup("[2]Filter",
    hslider("[4]F.Attack (s)", 0.01, 0.001, 2, 0.001));
filter_decay = vgroup("[2]Filter",
    hslider("[5]F.Decay (s)", 0.3, 0.01, 2, 0.01));
filter_sustain = vgroup("[2]Filter",
    hslider("[6]F.Sustain", 0.4, 0, 1, 0.01));
filter_release = vgroup("[2]Filter",
    hslider("[7]F.Release (s)", 0.2, 0.01, 3, 0.01));

// Enveloppe du filtre
filter_env = en.adsr(filter_attack, filter_decay, filter_sustain,
    filter_release, gate);

// Cutoff final = base + enveloppe * quantité * plage de modulation
// La plage de modulation est de 10000 Hz maximum
cutoff_final = filter_cutoff + filter_env * filter_env_amount * 10000;

// Appliquer le filtre résonant passe-bas
filtered = osc_output : fi.resonlp(cutoff_final, filter_reso, 1);

// ─────────────────────────────────────
// Section enveloppe d'amplitude
// ─────────────────────────────────────

amp_attack = vgroup("[3]Amplitude",
    hslider("[1]Attack (s)", 0.01, 0.001, 2, 0.001));
amp_decay = vgroup("[3]Amplitude",
    hslider("[2]Decay (s)", 0.2, 0.01, 2, 0.01));
amp_sustain = vgroup("[3]Amplitude",
    hslider("[3]Sustain", 0.7, 0, 1, 0.01));
amp_release = vgroup("[3]Amplitude",
    hslider("[4]Release (s)", 0.3, 0.01, 5, 0.01));

// Enveloppe d'amplitude
amp_env = en.adsr(amp_attack, amp_decay, amp_sustain, amp_release, gate);

// ─────────────────────────────────────
// Sortie de la voix (une seule voix, Faust duplique pour la polyphonie)
// ─────────────────────────────────────
process = filtered * amp_env * gain;

// ─────────────────────────────────────
// Effets post-polyphonie (appliqués sur le mix de toutes les voix)
// ─────────────────────────────────────

// --- Chorus ---
ch_rate = vgroup("[4]Chorus", hslider("[1]Rate (Hz)", 1.2, 0.1, 5, 0.01));
ch_depth = vgroup("[4]Chorus", hslider("[2]Depth (ms)", 3, 0.5, 10, 0.1));
ch_mix = vgroup("[4]Chorus", hslider("[3]Mix", 0.3, 0, 1, 0.01));

chorus_fx(x) = x * (1 - ch_mix) + delayed * ch_mix
with {
    // Buffer max : 50 ms en échantillons
    maxdel = int(0.05 * ma.SR);

    // LFO sinusoidal pour moduler le delay
    lfo = os.osc(ch_rate);

    // Delay de base (10 ms) modulé par le LFO
    mod_delay = (10 + lfo * ch_depth) / 1000 * ma.SR;

    // Delay fractionnaire pour éviter les clics
    delayed = x : de.fdelay(maxdel, mod_delay);
};

// --- Reverb ---
rv_size = vgroup("[5]Reverb", hslider("[1]Room Size", 0.6, 0, 1, 0.01));
rv_damp = vgroup("[5]Reverb", hslider("[2]Damping", 0.4, 0, 1, 0.01));
rv_mix = vgroup("[5]Reverb", hslider("[3]Mix", 0.25, 0, 1, 0.01));

reverb_fx(x) = x * (1 - rv_mix) + reverbed * rv_mix
with {
    reverbed = x : re.mono_freeverb(rv_size, rv_damp, 0.5, 1);
};

// Chaîne d'effets : chorus puis reverb
effect = chorus_fx : reverb_fx;
```

**Compilation** :

```bash
# Compiler en plugin VST3 avec 16 voix de polyphonie
faust2juce -jucemodulesdir ~/JUCE/modules -nvoices 16 synth_poly.dsp

# Le résultat est un dossier "synth_poly/" contenant le projet JUCE
# Ouvrir avec Projucer ou compiler directement avec CMake

# Pour tester rapidement sans JUCE (standalone avec MIDI) :
faust2caqt -nvoices 16 -midi synth_poly.dsp
```

**Les 3 presets** :

```text
Preset 1 : Pad (son doux et large)
═══════════════════════════════════
Oscillators:
  Osc1 Type     = 0 (saw)
  Osc2 Type     = 2 (triangle)
  Osc Mix       = 0.5
  Osc2 Detune   = 0.05 (léger désaccordage pour de la largeur)
Filter:
  Cutoff        = 1200 Hz
  Resonance     = 0.2
  Env Amount    = 0.3
  F.Attack      = 0.5 s
  F.Decay       = 0.8 s
  F.Sustain     = 0.5
  F.Release     = 1.0 s
Amplitude:
  Attack        = 0.8 s
  Decay         = 0.5 s
  Sustain       = 0.7
  Release       = 1.5 s
Chorus:
  Rate          = 0.8 Hz
  Depth         = 5 ms
  Mix           = 0.4
Reverb:
  Room Size     = 0.75
  Damping       = 0.3
  Mix           = 0.35

Résultat : son large, chaud et évolutif. Les attaques lentes
et le chorus prononcé créent un pad immersif pour les accords.


Preset 2 : Lead (son brillant et percussif)
════════════════════════════════════════════
Oscillators:
  Osc1 Type     = 1 (square)
  Osc2 Type     = 0 (saw)
  Osc Mix       = 0.4
  Osc2 Detune   = 7 (quinte au-dessus)
Filter:
  Cutoff        = 3000 Hz
  Resonance     = 0.6
  Env Amount    = 0.7
  F.Attack      = 0.005 s
  F.Decay       = 0.15 s
  F.Sustain     = 0.3
  F.Release     = 0.1 s
Amplitude:
  Attack        = 0.005 s
  Decay         = 0.1 s
  Sustain       = 0.8
  Release       = 0.2 s
Chorus:
  Rate          = 1.5 Hz
  Depth         = 2 ms
  Mix           = 0.2
Reverb:
  Room Size     = 0.4
  Damping       = 0.5
  Mix           = 0.15

Résultat : son percussif et brillant. L'enveloppe de filtre rapide
crée un "pluck" sur l'attaque. La résonance ajoute du caractère.
Le second oscillateur à la quinte enrichit le timbre.


Preset 3 : Bass (son grave et rond)
════════════════════════════════════
Oscillators:
  Osc1 Type     = 0 (saw)
  Osc2 Type     = 1 (square)
  Osc Mix       = 0.3
  Osc2 Detune   = -12 (une octave en dessous)
Filter:
  Cutoff        = 600 Hz
  Resonance     = 0.4
  Env Amount    = 0.4
  F.Attack      = 0.005 s
  F.Decay       = 0.2 s
  F.Sustain     = 0.2
  F.Release     = 0.1 s
Amplitude:
  Attack        = 0.005 s
  Decay         = 0.15 s
  Sustain       = 0.9
  Release       = 0.1 s
Chorus:
  Rate          = 1.0 Hz
  Depth         = 1 ms
  Mix           = 0.1
Reverb:
  Room Size     = 0.2
  Damping       = 0.7
  Mix           = 0.05

Résultat : son grave, rond et stable. Le cutoff bas et l'enveloppe
de filtre courte créent un son de basse avec du "punch" sur l'attaque.
Le second oscillateur une octave en dessous ajoute de la profondeur.
Le chorus et la reverb sont minimaux pour garder la précision dans
les basses fréquences.
```

**Vérification** :

```text
1. Charger le plugin dans un DAW (Ableton, Logic, Reaper)
2. Jouer des notes MIDI avec un clavier :
   → Chaque note déclenche une voix avec sa propre fréquence
   → Jusqu'à 16 notes simultanées (polyphonie)

3. Tester le preset Pad :
   → Jouer un accord (Do-Mi-Sol)
   → Le son monte lentement, large et chaud
   → Relâcher : le son s'éteint progressivement (1.5 s)

4. Tester le preset Lead :
   → Jouer une note rapide
   → L'attaque est percussive avec un "pluck" du filtre
   → Le son est brillant et présent

5. Tester le preset Bass :
   → Jouer des notes graves (octaves 1-2)
   → Le son est rond et profond avec du punch
   → Le chorus et la reverb sont quasi imperceptibles

6. Vérifier la charge CPU :
   → Avec 8 voix actives, le CPU doit rester sous 30%
   → Avec 16 voix actives, le CPU doit rester sous 60%

7. Vérifier l'absence de clics :
   → Jouer rapidement des notes courtes (staccato)
   → Aucun clic ni pop audible
   → L'enveloppe de release empêche les coupures brutales
```

---

## Navigation

← Fiche précédente : **[03 - Recherche et innovation](03-recherche-innovation.md)**

→ Fiche suivante : **[05 - Aide-mémoire des signatures de bibliothèque](05-aide-memoire-signatures.md)**
