---
tags:
  - Faust
description: "Cursus complet Faust (GRAME-CNCM) - Programmation fonctionnelle pour le traitement du signal audio temps réel"
---

# Cursus Faust 2026 - Traitement du Signal Audio et Synthèse Sonore

Curriculum structuré en **7 phases progressives** couvrant le langage Faust (GRAME-CNCM) : de l'acoustique fondamentale au déploiement sur toutes les plateformes (plugins, web, embarqué).

**Durée estimée totale** : 12-24 mois selon intensité.

---

## Phase 1 - Fondamentaux Acoustique (2-3 mois)

Ondes sonores, audio numérique, mathématiques du DSP et théorie de la synthèse sonore.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Acoustique et psychoacoustique](01-fondamentaux-acoustique/01-acoustique-psychoacoustique.md) | Ondes, fréquence, amplitude, timbre, spectre harmonique, Fletcher-Munson |
| 02 | [Audio numérique et théorie du signal](01-fondamentaux-acoustique/02-audio-numerique-theorie-signal.md) | Nyquist-Shannon, échantillonnage, quantification, PCM, FFT, latence |
| 03 | [Mathématiques pour le DSP](01-fondamentaux-acoustique/03-mathematiques-dsp.md) | Nombres complexes, trigonométrie, Fourier, transformée en Z, pôles/zéros |
| 04 | [Synthèse sonore - théorie](01-fondamentaux-acoustique/04-synthese-sonore-theorie.md) | Additive, soustractive, FM, modélisation physique, granulaire, ADSR |

---

## Phase 2 - Prérequis Programmation (1-2 mois)

Programmation fonctionnelle, bases de C++ et installation de l'environnement Faust.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Programmation fonctionnelle - concepts](02-prerequis-programmation/01-programmation-fonctionnelle-concepts.md) | Fonctions pures, composition, HOF, récursion, immutabilité, Arrows |
| 02 | [C++ : notions essentielles](02-prerequis-programmation/02-cpp-notions-essentielles.md) | Compilation, types, pointeurs, classes, CMake, lire du C++ généré |
| 03 | [Environnement et outils](02-prerequis-programmation/03-environnement-outils.md) | Faust CLI, JACK, faust2xxx, VS Code, faust2svg, Git |

---

## Phase 3 - Langage Faust Fondamentaux (2-3 mois)

Syntaxe, opérateurs de composition, interfaces utilisateur et gestion de la mémoire.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Syntaxe et sémantique de base](03-langage-faust-fondamentaux/01-syntaxe-semantique-base.md) | `process`, `import`, signaux comme fonctions du temps, primitives |
| 02 | [Les cinq opérateurs de composition](03-langage-faust-fondamentaux/02-cinq-operateurs-composition.md) | `:` séquentiel, `,` parallèle, `<:` split, `:>` merge, `~` récursif |
| 03 | [Interfaces utilisateur (UI)](03-langage-faust-fondamentaux/03-interfaces-utilisateur-ui.md) | hslider, vslider, nentry, button, checkbox, groupes, métadonnées |
| 04 | [Mémoire et délais](03-langage-faust-fondamentaux/04-memoire-delais.md) | `'` (prime), `@` délai, `~` feedback, rdtable/rwtable, buffers circulaires |

---

## Phase 4 - DSP Appliqué (2-3 mois)

Oscillateurs, filtres, effets audio, modélisation physique et bibliothèques Faust.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Oscillateurs et synthèse](04-dsp-applique/01-oscillateurs-synthese.md) | os.osc, os.sawtooth, bruit, AM/FM, wavetable, ADSR, polyphonie |
| 02 | [Filtres](04-dsp-applique/02-filtres.md) | Passe-bas, passe-haut, résonant, biquad, FIR vs IIR, EQ paramétrique |
| 03 | [Effets audio](04-dsp-applique/03-effets-audio.md) | Distorsion, delay, chorus, flanger, reverb Schroeder, compresseur |
| 04 | [Modélisation physique](04-dsp-applique/04-modelisation-physique.md) | Karplus-Strong, waveguides, synthèse modale, bibliothèque pm |
| 05 | [Bibliothèques Faust](04-dsp-applique/05-bibliotheques-faust.md) | stdfaust.lib, tour des bibliothèques, conventions, contribution |
| 06 | [Anti-aliasing et oscillateurs band-limited](04-dsp-applique/06-anti-aliasing-oscillateurs.md) | Repliement spectral, Nyquist, os.sawtooth vs os.lf_saw, sawN, PolyBLEP |

---

## Phase 5 - Déploiement et Architectures (2-3 mois)

Architecture files, plugins audio, applications standalone, web/mobile et embarqué.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Système d'architectures Faust](05-deploiement-architectures/01-systeme-architectures-faust.md) | Architecture files, séparation DSP/UI/audio, faust2xxx, backends |
| 02 | [Plugins audio (VST/AU/LV2)](05-deploiement-architectures/02-plugins-audio-vst-au-lv2.md) | faust2juce, faust2lv2, workflow DAW, paramètres, presets |
| 03 | [Applications standalone](05-deploiement-architectures/03-applications-standalone.md) | faust2jaqt, faust2jack, externals Max/PD/SC, FaustLive |
| 04 | [Web et mobile](05-deploiement-architectures/04-web-mobile.md) | faust2wasm, WebAudio API, PWA, faust2android, faust2ios |
| 05 | [Embarqué et hardware](05-deploiement-architectures/05-embarque-hardware.md) | Bela, Raspberry Pi, ESP32/Teensy, FPGA (Syfala), contraintes |

---

## Phase 6 - Intégration et Projets Avancés (2-3 mois)

libfaust, JUCE, environnements créatifs, protocoles de contrôle et machine learning audio.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [libfaust : compilateur embarquable](06-integration-projets-avances/01-libfaust-compilateur-embarquable.md) | API libfaust, JIT LLVM, createDSPFactory, interpréteur, hot-reloading |
| 02 | [Faust et JUCE](06-integration-projets-avances/02-faust-juce.md) | Framework JUCE, processBlock, faust2juce workflow, UI custom |
| 03 | [Faust et Max/PureData/SuperCollider](06-integration-projets-avances/03-faust-max-puredata-supercollider.md) | faustgen~, faust2puredata, faust2supercollider, workflow hybride |
| 04 | [MIDI, OSC et capteurs](06-integration-projets-avances/04-midi-osc-capteurs.md) | [midi:ctrl], polyphonie freq/gain/gate, OSC, capteurs, SmartFaust |
| 05 | [Faust et Machine Learning (DDSP)](06-integration-projets-avances/05-faust-machine-learning-ddsp.md) | DDSP, auto-différentiation, PyTorch, neural audio synthesis |

---

## Phase 7 - Approfondissement et contribution (continu)

Optimisation, contribution au projet open source, recherche académique et projets créatifs. Cette phase approfondit la pratique ; elle ne certifie pas un niveau professionnel à elle seule.

| # | Fiche | Description |
| - | ----- | ----------- |
| 01 | [Optimisation et performance](07-maitrise-contribution/01-optimisation-performance.md) | -vec/-sch/-omp, benchmarking, code C++ généré, profiling CPU |
| 02 | [Contribution au projet Faust](07-maitrise-contribution/02-contribution-projet.md) | Repo grame-cncm/faust, compiler internals, PRs, tests, communauté |
| 03 | [Recherche et innovation](07-maitrise-contribution/03-recherche-innovation.md) | Papers académiques, IFC/NIME/DAFx, Syfala FPGA, sémantique formelle |
| 04 | [Projets créatifs](07-maitrise-contribution/04-projets-creatifs.md) | Instrument VST complet, installation sonore, effet innovant, live coding |
| 05 | [Aide-mémoire des signatures de bibliothèque](07-maitrise-contribution/05-aide-memoire-signatures.md) | Signatures os/fi/ef/re/dm, process = re.mono_freeverb, référence rapide |

---

## Ressources Recommandées

| Ressource | Type | Focus |
| --------- | ---- | ----- |
| Faust Documentation | Documentation officielle | Référence complète du langage |
| Faust IDE en ligne | IDE web | Prototypage et test rapide |
| Faust Playground | Outil visuel | Programmation visuelle Faust |
| GRAME-CNCM | Institution | Centre national de création musicale |
| Julius O. Smith III | Cours en ligne | DSP et synthèse (Stanford/CCRMA) |
| Kadenze | Cours en ligne | Real-Time Audio Signal Processing in Faust |
| Faust Libraries | Documentation | Référence des bibliothèques |
