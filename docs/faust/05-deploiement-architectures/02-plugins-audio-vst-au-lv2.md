---
tags:
  - Faust
  - Avancé
  - Pratique
description: "Plugins audio VST/AU/LV2 - compiler du code Faust en plugins pour les DAW avec faust2juce et faust2lv2"
estimated_time: "70 min"
fiche_number: 2
total_fiches: 5
cursus: "Phase 5 - Déploiement et architectures"
---

# 02 - Plugins audio VST/AU/LV2

> **En bref** : À la fin de cette fiche, tu sauras compiler un programme Faust en plugin VST3, AU ou LV2, l'installer dans un DAW et configurer ses paramètres et presets. Lecture estimée : 70 min.


## Prérequis

- [Fiche 01 - Système d'architectures Faust](01-systeme-architectures-faust.md)
- Faust installé avec les scripts `faust2lv2` et `faust2juce` disponibles
- Un DAW installé (Ardour, REAPER ou autre) pour tester les plugins
- Savoir écrire un programme Faust avec des contrôles (hslider, vslider, nentry)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras compiler un programme Faust en plugin VST3, AU ou LV2, l'installer dans un DAW et configurer ses paramètres et presets.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un plugin audio ?

**Définition** : Un plugin audio est un module logiciel qui s'exécute à l'intérieur d'un DAW (Digital Audio Workstation). Il traite le signal audio (effet) ou en génère (instrument virtuel). Le plugin ne fonctionne pas seul : il a besoin d'un hôte (le DAW) pour recevoir l'audio, afficher son interface et envoyer le résultat sur une piste.

**Le problème que les plugins audio résolvent** :

Sans plugins audio, voici les problèmes rencontrés :

1. **Effets matériels coûteux** : Chaque effet (reverb, delay, EQ) nécessite un appareil physique séparé.
2. **Pas de rappel de session** : Sur un appareil physique, quand tu changes les réglages, les anciens sont perdus.
3. **Pas d'automatisation** : Tu ne peux pas programmer un changement de paramètre au cours du temps.

**Comment les plugins audio résolvent ces problèmes** :

| Problème | Solution apportée par les plugins audio |
| -------- | --------------------------------------- |
| Effets matériels coûteux | Un plugin est un logiciel : il peut être dupliqué à l'infini |
| Pas de rappel de session | Le DAW sauvegarde tous les paramètres dans le fichier de projet |
| Pas d'automatisation | Le DAW peut enregistrer et rejouer les mouvements de chaque paramètre |

**Analogie concrète** : Un plugin audio fonctionne comme un appareil électroménager que tu branches sur une multiprise (le DAW). La multiprise fournit l'électricité (le signal audio), et l'appareil fait son travail (filtrer, amplifier, transformer). Tu peux brancher plusieurs appareils en série et les débrancher quand tu veux.

**Ce qu'un plugin audio n'est PAS** :

- Un plugin audio n'est pas une application autonome. Il ne peut pas fonctionner sans DAW.
- Un plugin audio n'est pas un fichier audio. Il ne contient pas de son. Il traite ou génère du son en temps réel.

Le diagramme suivant montre le workflow de création d'un plugin audio depuis le code Faust jusqu'à son utilisation dans un DAW.

<div class="diagram-design">
<p><a href="../../../diagrams/faust-05-déploiement-architectures-02-plugins-audio-vst-au-lv2-1.html">Qu&#x27;est-ce qu&#x27;un plugin audio ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/faust-05-déploiement-architectures-02-plugins-audio-vst-au-lv2-1.html" title="Qu&#x27;est-ce qu&#x27;un plugin audio ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Quels sont les formats de plugins audio ?

**Définition** : Un format de plugin audio est une spécification technique qui définit comment le plugin communique avec le DAW. Chaque format impose une interface (API) que le plugin doit respecter.

**Le problème que les formats résolvent** :

Sans format standardisé, voici les problèmes rencontrés :

1. **Incompatibilité totale** : Chaque DAW aurait sa propre interface. Un plugin écrit pour Ardour ne fonctionnerait pas dans REAPER.
2. **Effort de portage multiplié** : Le développeur devrait réécrire le code d'intégration pour chaque DAW.

**Comment les formats résolvent ces problèmes** :

| Problème | Solution apportée par les formats |
| -------- | --------------------------------- |
| Incompatibilité totale | Un plugin VST3 fonctionne dans tout DAW qui supporte VST3, sans modification |
| Effort de portage multiplié | Le développeur implémente un seul format, et tous les DAW compatibles le chargent |

**Les quatre formats principaux** :

| Format | Éditeur | Plateformes | Licence | DAW compatibles |
| ------ | ------- | ----------- | ------- | --------------- |
| VST3 | Steinberg | Windows, macOS, Linux | Propriétaire (gratuite sous conditions) | REAPER, Ardour, Cubase, Ableton Live, Bitwig |
| AU (AudioUnit) | Apple | macOS, iOS | Propriétaire (intégrée à macOS) | Logic Pro, GarageBand, REAPER (macOS) |
| LV2 | Communauté open source | Linux, macOS, Windows | Libre (ISC) | Ardour, Carla, Zrythm, Qtractor |
| AAX | Avid | Windows, macOS | Propriétaire (accord Avid requis) | Pro Tools uniquement |

**Quel format choisir ?** :

| Situation | Format recommandé |
| --------- | ----------------- |
| Linux uniquement | LV2 (support natif, compilation simple) |
| macOS uniquement | AU (intégration native avec Logic Pro) |
| Multiplateforme | VST3 (le plus largement supporté) |
| Open source / libre | LV2 (licence libre, pas de SDK propriétaire) |

**Analogie concrète** : Les formats de plugins sont comme les types de prises électriques dans le monde. Une prise française (LV2) ne rentre pas dans une prise américaine (AAX). Mais si tu utilises un adaptateur universel (VST3), tu peux te brancher dans la plupart des pays.

**Ce que les formats ne sont PAS** :

- Le format ne détermine pas la qualité sonore. Un plugin VST3 et un plugin LV2 compilés depuis le même code Faust produisent exactement le même son.
- Le format n'est pas le plugin lui-même. C'est l'emballage. Le contenu (l'algorithme DSP) reste identique.

---

### Qu'est-ce que faust2lv2 ?

**Définition** : `faust2lv2` est un script fourni avec Faust qui compile un fichier `.dsp` directement en un bundle LV2 prêt à l'emploi. Il génère le code C, le compile en bibliothèque partagée et crée les fichiers de métadonnées (manifeste TTL).

**Le problème que faust2lv2 résout** :

Sans `faust2lv2`, voici les problèmes rencontrés :

1. **Chaîne de compilation manuelle** : Il faut appeler le compilateur Faust, écrire les fichiers TTL (Turtle), puis compiler la bibliothèque partagée avec les bons drapeaux.
2. **Syntaxe TTL complexe** : Les fichiers de métadonnées LV2 utilisent le format Turtle (RDF), une syntaxe verbeuse et peu intuitive.
3. **Mapping des paramètres** : Chaque contrôle Faust doit être déclaré comme un port LV2 manuellement.

**Comment faust2lv2 résout ces problèmes** :

| Problème | Solution apportée par faust2lv2 |
| -------- | ------------------------------- |
| Chaîne de compilation manuelle | Une seule commande produit le bundle LV2 complet |
| Syntaxe TTL complexe | Le script génère automatiquement les fichiers TTL |
| Mapping des paramètres | Chaque hslider/vslider/nentry devient automatiquement un port LV2 |

**Analogie concrète** : `faust2lv2` est comme une machine à emballer sous vide. Tu lui donnes le produit brut (ton code `.dsp`), elle le met dans le bon emballage (le bundle LV2), avec l'étiquette (les fichiers TTL). Le résultat est prêt à être installé dans un DAW.

**Structure d'un bundle LV2 généré** :

```text
monplugin.lv2/
├── manifest.ttl      # Déclaration du plugin pour le scan du DAW
├── monplugin.ttl      # Métadonnées complètes (ports, paramètres, catégories)
└── monplugin.so       # Bibliothèque partagée contenant le code DSP compilé
```

Sur macOS, l'extension est `.dylib` au lieu de `.so`.

---

### Qu'est-ce que faust2juce ?

**Définition** : `faust2juce` est un script qui génère un projet JUCE complet à partir d'un fichier `.dsp` Faust. JUCE est un framework C++ multiplateforme pour le développement de plugins audio. Le projet généré peut être compilé en VST3, AU, AAX ou application standalone.

**Le problème que faust2juce résout** :

Sans `faust2juce`, voici les problèmes rencontrés :

1. **Créer un projet JUCE manuellement** : Il faut configurer les modules, écrire le code d'intégration et configurer les cibles de compilation. Cela prend plusieurs heures.
2. **Multiformat** : Pour produire un plugin VST3 ET AU, il faut maîtriser la configuration multiformat de JUCE.

**Comment faust2juce résout ces problèmes** :

| Problème | Solution apportée par faust2juce |
| -------- | -------------------------------- |
| Créer un projet JUCE manuellement | Le script génère un projet complet, prêt à compiler |
| Multiformat | Le projet JUCE produit simultanément VST3, AU et standalone |

**Analogie concrète** : `faust2juce` est comme un architecte qui transforme ton croquis (le fichier `.dsp`) en plans de construction complets (le projet JUCE). Tu n'as plus qu'à construire (compiler).

**Ce que faust2juce n'est PAS** :

- `faust2juce` ne compile pas directement le plugin final. Il génère un projet JUCE que tu dois ensuite compiler avec CMake.
- `faust2juce` n'est pas une alternative à `faust2lv2` pour le format LV2. JUCE ne supporte pas nativement LV2.

**Options principales de faust2juce** :

| Option | Rôle | Exemple |
| ------ | ---- | ------- |
| `--midi` | Active le support MIDI | `faust2juce --midi synth.dsp` |
| `--nvoices N` | Active la polyphonie avec N voix | `faust2juce --nvoices 8 synth.dsp` |
| `--effect auto` | Ajoute un effet global en sortie de la polyphonie | `faust2juce --nvoices 8 --effect auto synth.dsp` |
| `--soundfile` | Active le support des fichiers audio | `faust2juce --soundfile sampler.dsp` |

---

### Comment les paramètres Faust deviennent des paramètres de plugin ?

**Définition** : Chaque contrôle d'interface Faust (`hslider`, `vslider`, `nentry`, `button`, `checkbox`, `hbargraph`) devient automatiquement un paramètre du plugin. Le DAW affiche ces paramètres et permet de les automatiser.

**Correspondance entre Faust et le plugin** :

| Contrôle Faust | Paramètre du plugin | Comportement |
| -------------- | -------------------- | ------------ |
| `hslider("Gain", 0.5, 0, 1, 0.01)` | Slider, range 0-1, défaut 0.5 | Modifiable |
| `nentry("Ordre", 2, 1, 8, 1)` | Champ numérique, range 1-8 | Modifiable |
| `button("Bypass")` | Bouton on/off | 0 ou 1 |
| `hbargraph("Level", 0, 1)` | Indicateur (lecture seule) | Non modifiable |

**Métadonnées pour le comportement des paramètres** :

```faust
// [style:knob] : affiche un potentiomètre rotatif au lieu d'un slider
gain = hslider("Gain [style:knob]", 0.5, 0, 1, 0.01);

// [unit:Hz] : affiche l'unité à côté de la valeur
freq = hslider("Freq [unit:Hz]", 440, 20, 20000, 1);

// [scale:log] : échelle logarithmique (utile pour les fréquences)
cutoff = hslider("Cutoff [unit:Hz] [scale:log]", 1000, 20, 20000, 1);

// [midi:ctrl N] : associe un contrôleur MIDI CC
volume = hslider("Volume [midi:ctrl 7]", 0.8, 0, 1, 0.01);
```

**Analogie concrète** : Le mapping automatique fonctionne comme un traducteur de formulaire. Tu remplis le formulaire en Faust (nom du champ, valeur min, valeur max, valeur par défaut) et le traducteur produit le même formulaire au format du plugin.

---

### Comment configurer les métadonnées d'un plugin ?

**Définition** : Les métadonnées d'un plugin sont les informations qui l'identifient dans le DAW : nom, auteur, version, licence. En Faust, elles se déclarent avec `declare` en début de fichier.

```faust
declare name "Stereo Reverb";
declare author "John";
declare version "1.0";
declare license "MIT";
declare description "Réverbération stéréo avec pré-delay et damping";
declare copyright "(c) 2026 John";
declare category "Reverb";
```

**Analogie concrète** : Les métadonnées sont comme l'étiquette d'un produit alimentaire. Sans étiquette, tu as un bocal anonyme. Avec l'étiquette, tu sais ce que c'est (nom), qui l'a fabriqué (auteur) et quand il expire (version).

---

### Comment fonctionne la polyphonie dans les plugins ?

**Définition** : Un plugin polyphonique est un instrument virtuel capable de jouer plusieurs notes simultanément. Chaque note active occupe une "voix".

**Convention Faust pour la polyphonie** :

```faust
// Les trois paramètres obligatoires (noms exacts, en minuscules)
freq = hslider("freq", 440, 20, 20000, 1);    // Fréquence de la note (Hz)
gain = hslider("gain", 0.5, 0, 1, 0.01);      // Vélocité (0 à 1)
gate = button("gate");                          // Note on (1) / note off (0)
```

**Règles strictes** : les paramètres doivent s'appeler exactement `freq`, `gain` et `gate`. `freq` reçoit la fréquence MIDI convertie en Hz. `gain` reçoit la vélocité normalisée. `gate` vaut 1 quand la note est enfoncée, 0 quand elle est relâchée.

**Analogie concrète** : La polyphonie fonctionne comme un choeur de chanteurs. Le chef de choeur (le système MIDI) dit à chaque chanteur quand commencer (`gate = 1`), quelle note chanter (`freq`) et à quel volume (`gain`).

**Ce que la polyphonie n'est PAS** :

- La polyphonie n'est pas le multicanal. La polyphonie concerne le nombre de notes simultanées, le multicanal concerne le nombre de canaux audio (mono, stéréo, surround).
- La polyphonie n'est pas illimitée. Chaque voix consomme du CPU.

---

### Comment distribuer un plugin ?

**Définition** : Distribuer un plugin consiste à copier les fichiers compilés dans les dossiers standard que les DAW scannent au démarrage.

**Chemins d'installation par OS** :

| Format | macOS | Linux |
| ------ | ----- | ----- |
| VST3 | `~/Library/Audio/Plug-Ins/VST3/` | `~/.vst3/` |
| AU | `~/Library/Audio/Plug-Ins/Components/` | N/A |
| LV2 | `~/.lv2/` | `~/.lv2/` |

**Analogie concrète** : Distribuer un plugin, c'est comme ranger un livre dans la bonne étagère d'une bibliothèque. Le bibliothécaire (le DAW) ne cherche les livres que sur certaines étagères (les chemins d'installation).

---

## Étapes Pratiques

### Étape 1 : Créer un effet audio simple (EQ paramétrique)

```bash
# Créer le dossier de travail
mkdir -p ~/faust-plugins
```

```bash
# Créer le fichier param_eq.dsp
cat > ~/faust-plugins/param_eq.dsp << 'EOF'
// param_eq.dsp - Égaliseur paramétrique 1 bande
import("stdfaust.lib");

declare name "Param EQ";
declare author "John";
declare version "1.0";
declare license "MIT";
declare description "Égaliseur paramétrique à une bande";

// Fréquence centrale du filtre (échelle logarithmique)
freq = hslider("Freq [unit:Hz] [scale:log] [style:knob]", 1000, 20, 20000, 1);

// Gain en décibels (-24 dB à +24 dB)
gain_db = hslider("Gain [unit:dB] [style:knob]", 0, -24, 24, 0.1);

// Facteur Q (Q élevé = bande étroite)
q_factor = hslider("Q [style:knob]", 1.0, 0.1, 10.0, 0.01);

// fi.peak_eq applique un filtre peak EQ, bandwidth = freq / Q
process = fi.peak_eq(gain_db, freq, freq / q_factor)
        , fi.peak_eq(gain_db, freq, freq / q_factor);
EOF
```

---

### Étape 2 : Compiler en LV2 avec faust2lv2

```bash
# Compiler le fichier .dsp en plugin LV2
faust2lv2 ~/faust-plugins/param_eq.dsp
```

**Résultat attendu** :

```text
(pas de sortie si la compilation réussit)
```

```bash
# Vérifier le bundle LV2 généré
ls ~/faust-plugins/param_eq.lv2/
```

**Résultat attendu** :

```text
manifest.ttl
param_eq.ttl
param_eq.so
```

```bash
# Installer le plugin dans le dossier standard LV2
mkdir -p ~/.lv2
cp -r ~/faust-plugins/param_eq.lv2 ~/.lv2/
```

---

### Étape 3 : Installer et tester dans un DAW

#### Tester dans Ardour

1. Lance Ardour et crée un projet
2. Crée une piste audio (menu **Track** > **Add Track**)
3. Clique sur le slot d'insert de la piste
4. Cherche **"Param EQ"** dans le **Plugin Selector**
5. Double-clique pour ajouter le plugin à la piste

#### Tester dans REAPER

1. Lance REAPER et crée une piste
2. Clique sur le bouton **FX** de la piste
3. Cherche **"Param EQ"** et double-clique pour l'ajouter

Si le plugin n'apparaît pas, vérifie que `~/.lv2/` est configuré dans les préférences LV2 du DAW, puis relance le scan.

---

### Étape 4 : Compiler en VST3/AU avec faust2juce

```bash
# Définir JUCE_PATH si nécessaire
export JUCE_PATH=~/JUCE
```

```bash
# Générer le projet JUCE (VST3 + AU + standalone)
faust2juce ~/faust-plugins/param_eq.dsp
```

```bash
# Compiler avec CMake
mkdir -p ~/faust-plugins/param_eq/build
cd ~/faust-plugins/param_eq/build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
```

**Résultat attendu** :

```text
...
[100%] Built target param_eq_VST3
[100%] Built target param_eq_AU
```

```bash
# Installer le VST3 (macOS)
cp -r ~/faust-plugins/param_eq/build/param_eq_artefacts/Release/VST3/Param\ EQ.vst3 \
  ~/Library/Audio/Plug-Ins/VST3/

# Installer l'AU (macOS)
cp -r ~/faust-plugins/param_eq/build/param_eq_artefacts/Release/AU/Param\ EQ.component \
  ~/Library/Audio/Plug-Ins/Components/
```

```bash
# Installer le VST3 (Linux)
cp -r ~/faust-plugins/param_eq/build/param_eq_artefacts/Release/VST3/Param\ EQ.vst3 \
  ~/.vst3/
```

---

### Étape 5 : Ajouter la polyphonie MIDI pour un synthétiseur

```bash
# Créer le fichier synth_poly.dsp
cat > ~/faust-plugins/synth_poly.dsp << 'EOF'
// synth_poly.dsp - Synthétiseur polyphonique soustractif
import("stdfaust.lib");

declare name "Poly Synth";
declare author "John";
declare version "1.0";
declare license "MIT";
declare description "Synthétiseur polyphonique soustractif";

// Paramètres de polyphonie (noms obligatoires, remplis par le système MIDI)
freq = hslider("freq", 440, 20, 20000, 1);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Paramètres modifiables par l'utilisateur
cutoff = hslider("Cutoff [unit:Hz] [scale:log] [style:knob]", 5000, 100, 20000, 1);
resonance = hslider("Resonance [style:knob]", 0.7, 0.1, 5.0, 0.01);
attack = hslider("Attack [unit:s] [style:knob]", 0.01, 0.001, 2.0, 0.001);
decay = hslider("Decay [unit:s] [style:knob]", 0.1, 0.001, 2.0, 0.001);
sustain = hslider("Sustain [style:knob]", 0.7, 0, 1, 0.01);
release = hslider("Release [unit:s] [style:knob]", 0.3, 0.001, 5.0, 0.001);

// Dent de scie -> filtre passe-bas résonant -> enveloppe ADSR * vélocité
process = os.sawtooth(freq)
        : fi.resonlp(cutoff, resonance, 1.0)
        * (en.adsr(attack, decay, sustain, release, gate))
        * gain;
EOF
```

```bash
# Compiler en plugin LV2 polyphonique (8 voix)
faust2lv2 -nvoices 8 ~/faust-plugins/synth_poly.dsp
cp -r ~/faust-plugins/synth_poly.lv2 ~/.lv2/

# Compiler en plugin JUCE polyphonique (8 voix, avec MIDI)
faust2juce --midi --nvoices 8 ~/faust-plugins/synth_poly.dsp
```

Pour tester : ajoute le plugin sur une piste MIDI, connecte un clavier MIDI ou utilise l'éditeur MIDI du DAW, et joue des notes.

---

### Étape 6 : Configurer les métadonnées du plugin (declare)

Vérifie que les métadonnées sont intégrées dans le plugin LV2 :

```bash
# Lire les métadonnées dans le fichier TTL
head -30 ~/.lv2/param_eq.lv2/param_eq.ttl
```

Les lignes `doap:name`, `doap:maintainer` et `doap:license` du fichier TTL correspondent aux déclarations `declare` du code Faust.

**Métadonnées recommandées pour la distribution** :

```faust
declare name "Nom du Plugin";
declare author "Ton Nom";
declare version "1.0.0";
declare license "MIT";
declare copyright "(c) 2026 Ton Nom";
declare description "Description courte du plugin";
declare category "Effect";   // ou "Synthesizer", "Analyzer"
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust2lv2 fichier.dsp` | Compile en plugin LV2 |
| `faust2lv2 -nvoices 8 fichier.dsp` | Compile en plugin LV2 polyphonique |
| `faust2juce fichier.dsp` | Génère un projet JUCE (VST3/AU/standalone) |
| `faust2juce --midi --nvoices 8 fichier.dsp` | Projet JUCE polyphonique avec MIDI |
| `faust2juce --effect auto fichier.dsp` | Projet JUCE avec détection automatique de l'effet |
| `cp -r plugin.lv2 ~/.lv2/` | Installe un plugin LV2 |
| `cmake --build . --config Release` | Compile un projet JUCE configuré |
| `lv2ls` | Liste tous les plugins LV2 installés |

---

## Pièges Fréquents

### Piège 1 : Le plugin n'apparaît pas dans le DAW

**Problème** : Tu as compilé le plugin et copié les fichiers, mais le DAW ne le trouve pas.

**Solution** : Vérifie que le bundle est dans le bon dossier (`~/.lv2/` ou `~/Library/Audio/Plug-Ins/VST3/`), qu'il contient les fichiers nécessaires (manifest.ttl, .ttl, .so/.dylib), et relance le DAW pour forcer un re-scan.

---

### Piège 2 : faust2juce échoue avec "JUCE_PATH not set"

**Problème** : La compilation avec `faust2juce` affiche `ERROR: JUCE_PATH is not set`.

**Solution** : Définis la variable d'environnement et rends-la permanente :

```bash
# Ajouter au profil (zsh sur macOS)
echo 'export JUCE_PATH=~/JUCE' >> ~/.zshrc
source ~/.zshrc
```

---

### Piège 3 : Les paramètres de polyphonie ne fonctionnent pas

**Problème** : Les notes MIDI ne produisent aucun son ou jouent toutes la même fréquence.

**Solution** : Vérifie que les noms sont exactement `freq`, `gain` et `gate` (en minuscules) :

```faust
// ❌ Incorrect : noms non reconnus par le système
frequency = hslider("frequency", 440, 20, 20000, 1);

// ✅ Correct : noms exacts attendus
freq = hslider("freq", 440, 20, 20000, 1);
```

---

### Piège 4 : Le plugin craque quand on modifie les paramètres

**Problème** : Le son craque quand tu modifies les paramètres rapidement.

**Solution** : Utilise `si.smoo` pour lisser les changements de valeur :

```faust
// ❌ Changement brusque : crée des clics audio
freq = hslider("Freq", 1000, 20, 20000, 1);

// ✅ Changement lissé : transition fluide
freq = hslider("Freq", 1000, 20, 20000, 1) : si.smoo;
```

---

### Piège 5 : Le plugin VST3 ne se charge pas après mise à jour

**Problème** : Le DAW utilise l'ancienne version après recompilation.

**Solution** : Supprime le cache de plugins du DAW et relance-le :

```bash
# REAPER (macOS)
rm ~/Library/Application\ Support/REAPER/reaper-vstplugins64.ini

# Ardour
rm -rf ~/.config/ardour*/cache/
```

---

## Checklist de Validation

- [ ] J'ai créé un effet audio (EQ paramétrique) avec des paramètres contrôlables
- [ ] J'ai compilé le plugin en LV2 avec `faust2lv2` et le bundle contient les 3 fichiers
- [ ] J'ai installé le plugin LV2 dans `~/.lv2/` et le DAW le reconnaît
- [ ] J'ai compilé le plugin en VST3/AU avec `faust2juce` et CMake
- [ ] J'ai créé un synthétiseur polyphonique avec les paramètres `freq`, `gain`, `gate`
- [ ] Le synthétiseur répond aux notes MIDI et joue des accords
- [ ] Les métadonnées du plugin s'affichent correctement dans le DAW
- [ ] Je sais installer un plugin dans les dossiers standard de mon OS

---

## Exercice Pratique

**Énoncé** : Crée un plugin de reverb stéréo avec pré-delay, taille de salle (room size), damping et dry/wet. Compile-le en LV2 et en VST3. Ajoute les métadonnées complètes (nom, auteur, version, licence, description).

**Indications** :

- Utilise `re.mono_freeverb` de la bibliothèque standard pour l'algorithme de reverb
- Applique la reverb séparément sur chaque canal pour un effet stéréo
- Le pré-delay s'implémente avec `de.delay(maxDelay, delayTime)` (convertis ms en échantillons : `ms * ma.SR / 1000`)
- Utilise `si.smoo` sur tous les paramètres pour éviter les clics
- Le dry/wet mélange signal original et effet : `(1 - mix) * input + mix * reverb_signal`
- Nomme le fichier `stereo_reverb.dsp`

**Résultat attendu** :

- Un plugin LV2 dans `~/.lv2/stereo_reverb.lv2/`
- Un projet JUCE compilable en VST3
- Le plugin affiche "Stereo Reverb" avec 4 paramètres dans le DAW

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Créer le fichier stereo_reverb.dsp
cat > ~/faust-plugins/stereo_reverb.dsp << 'EOF'
// stereo_reverb.dsp - Réverbération stéréo avec pré-delay
import("stdfaust.lib");

declare name "Stereo Reverb";
declare author "John";
declare version "1.0.0";
declare license "MIT";
declare copyright "(c) 2026 John";
declare description "Réverbération stéréo avec pré-delay, taille de salle et damping";
declare category "Reverb";

// Pré-delay en millisecondes (0 à 200 ms)
predelay_ms = hslider("Pre-Delay [unit:ms] [style:knob]", 20, 0, 200, 1) : si.smoo;

// Taille de salle (0 = petite pièce, 1 = cathédrale)
roomsize = hslider("Room Size [style:knob]", 0.5, 0, 1, 0.01) : si.smoo;

// Damping (0 = reverb brillante, 1 = reverb sourde)
damping = hslider("Damping [style:knob]", 0.5, 0, 1, 0.01) : si.smoo;

// Dry/Wet (0 = 100% sec, 1 = 100% reverb)
mix = hslider("Dry/Wet [style:knob]", 0.3, 0, 1, 0.01) : si.smoo;

// Convertir le pré-delay en échantillons
predelay_samples = predelay_ms * ma.SR / 1000;
max_predelay = 65536;

// Pré-delay suivi de l'algorithme Freeverb
// Signature : re.mono_freeverb(fb1, fb2, damp, spread)
//   fb1 = taille de salle (feedback des combs), fb2 = feedback des allpass,
//   damp = amortissement des aigus, spread = étalement spatial (0 en mono)
reverb_mono = de.delay(max_predelay, predelay_samples)
            : re.mono_freeverb(roomsize, 0.5, damping, 0);

// Mélange dry/wet pour un canal
drywet(input, reverb_signal) = (1 - mix) * input + mix * reverb_signal;

// Traitement stéréo : chaque canal passe par la reverb indépendamment
process = _ , _ : par(i, 2, ((_ <: _, reverb_mono) : drywet));
EOF
```

**Explication du code** :

- `de.delay(max_predelay, predelay_samples)` : retarde le signal avant la reverb
- `re.mono_freeverb(roomsize, 0.5, damping, 0)` : algorithme Freeverb (4 arguments : fb1, fb2, damp, spread)
- `_ <: _, reverb_mono` : le signal est dupliqué (une copie sèche, une traitée)
- `drywet` : mélange les deux copies selon le paramètre mix
- `par(i, 2, ...)` : applique le traitement aux deux canaux stéréo

```bash
# Compiler et installer en LV2
faust2lv2 ~/faust-plugins/stereo_reverb.dsp
cp -r ~/faust-plugins/stereo_reverb.lv2 ~/.lv2/

# Générer et compiler le projet JUCE (VST3)
faust2juce ~/faust-plugins/stereo_reverb.dsp
mkdir -p ~/faust-plugins/stereo_reverb/build
cd ~/faust-plugins/stereo_reverb/build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release

# Installer le VST3 (macOS)
cp -r ~/faust-plugins/stereo_reverb/build/stereo_reverb_artefacts/Release/VST3/Stereo\ Reverb.vst3 \
  ~/Library/Audio/Plug-Ins/VST3/
```

Pour tester : ajoute le plugin sur une piste audio stéréo, lance la lecture avec un signal audio et ajuste les 4 paramètres.

---

## Navigation

← Fiche précédente : **[01 - Système d'architectures Faust](01-systeme-architectures-faust.md)**

→ Fiche suivante : **[03 - Applications standalone](03-applications-standalone.md)**
