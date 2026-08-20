---
tags:
  - Faust
  - Avancé
  - Pratique
description: "Faust et JUCE - intégration du DSP Faust dans le framework JUCE pour créer des plugins audio professionnels"
estimated_time: "65 min"
fiche_number: 2
total_fiches: 5
cursus: "Phase 6 - Intégration et projets avancés"
---

# 02 - Faust et JUCE

> **En bref** : À la fin de cette fiche, tu sauras créer un plugin audio professionnel en combinant Faust pour le DSP et JUCE pour l'interface et la gestion des formats de plugins. Lecture estimée : 65 min.


## Prérequis

- [Fiche 01 - libfaust : compilateur embarquable](01-libfaust-compilateur-embarquable.md)
- [Fiche 02 - Plugins audio (VST/AU/LV2)](../05-deploiement-architectures/02-plugins-audio-vst-au-lv2.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un plugin audio professionnel en combinant Faust pour le DSP et JUCE pour l'interface et la gestion des formats de plugins.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que JUCE ?

**Définition** : JUCE (Jules' Utility Class Extensions) est un framework C++ open-source pour créer des plugins audio (VST3, AU, AAX) et des applications audio professionnelles. Il fournit : gestion audio I/O, interface graphique, paramètres automatisables et export multi-format.

**Le problème que JUCE résout** :

Sans JUCE, voici les problèmes rencontrés :

1. **Formats multiples** : Pour distribuer un plugin, tu dois implémenter séparément les APIs VST3, Audio Unit et AAX.
2. **Interface graphique manuelle** : Tu dois écrire du code OpenGL ou natif pour chaque bouton et slider.
3. **Portabilité** : Le code natif diffère entre macOS, Windows et Linux.

**Comment JUCE résout ces problèmes** :

| Problème | Solution apportée par JUCE |
| --- | --- |
| Formats multiples | Un seul code source génère VST3, AU et AAX automatiquement |
| Interface graphique manuelle | Composants prêts à l'emploi (Slider, ComboBox, Label) |
| Portabilité | JUCE compile sur macOS, Windows et Linux sans modification |

**Analogie concrète** : Imagine que tu fabriques un meuble. Sans JUCE, tu dois acheter le bois brut et fabriquer chaque pièce toi-même pour chaque type de client. Avec JUCE, tu disposes d'un atelier complet avec des gabarits de découpe et une machine qui produit le meuble dans le format souhaité. Tu te concentres sur le design, pas sur la fabrication des vis.

**Ce que JUCE n'est PAS** :

- JUCE n'est pas un langage de traitement du signal. Il fournit l'infrastructure (UI, formats, I/O) mais le code DSP doit être écrit séparément. C'est là que Faust intervient.
- JUCE n'est pas un DAW. C'est un outil pour les développeurs qui créent des plugins utilisables dans un DAW.

**Comparaison Faust vs JUCE** :

| Faust | JUCE |
| --- | --- |
| Langage dédié au DSP | Framework C++ généraliste audio |
| Décrit le traitement du signal | Gère l'UI, les formats et l'I/O |
| Code concis (quelques lignes) | Code verbeux (classes, héritage, callbacks) |

---

### Qu'est-ce que faust2juce ?

**Définition** : `faust2juce` est un outil qui génère un projet JUCE complet à partir d'un fichier Faust `.dsp`. Il produit le code C++ du DSP, les fichiers de projet et une interface graphique fonctionnelle.

**Le problème que faust2juce résout** :

Sans faust2juce, voici les problèmes rencontrés :

1. **Intégration manuelle** : Tu dois exporter le C++ depuis Faust, créer un projet JUCE à la main et écrire le code d'interconnexion.
2. **Synchronisation des paramètres** : Chaque slider Faust doit être connecté manuellement à un AudioParameterFloat dans JUCE.

**Comment faust2juce résout ces problèmes** :

| Problème | Solution apportée par faust2juce |
| --- | --- |
| Intégration manuelle | Génère tout le code d'interconnexion automatiquement |
| Synchronisation des paramètres | Les sliders Faust deviennent des paramètres JUCE synchronisés |

**Analogie concrète** : faust2juce est comme un traducteur professionnel. Tu écris ton texte en français (Faust), et le traducteur produit un livre complet en anglais (projet JUCE) avec la couverture et la mise en page.

**Options principales de faust2juce** :

| Option | Effet |
| --- | --- |
| `-midi` | Active le support MIDI (réception de notes, CC) |
| `-nvoices N` | Active la polyphonie avec N voix simultanées |
| `-effect fichier.dsp` | Ajoute un effet global après le synthétiseur polyphonique |
| `-poly2` | Mode polyphonique avec effet intégré |

---

### Qu'est-ce que processBlock() ?

**Définition** : `processBlock()` est la méthode centrale d'un plugin JUCE. L'hôte audio (le DAW) l'appelle à intervalles réguliers pour traiter un bloc d'échantillons. Le code DSP Faust est exécuté ici via `compute()`.

**Le problème que processBlock() résout** :

Sans processBlock(), voici les problèmes rencontrés :

1. **Pas de point d'entrée** : Le DAW ne sait pas quelle fonction appeler pour le traitement audio.
2. **Gestion des buffers** : Les échantillons arrivent par blocs de taille variable (64, 128, 256, 512).

**Analogie concrète** : processBlock() est comme le guichet d'une boulangerie. Le client (le DAW) arrive avec un plateau vide (le buffer) et dit : "Remplissez-le." Le boulanger (ton plugin) remplit le plateau et le rend. Le client revient toutes les quelques millisecondes.

**Fonctionnement dans le code généré** :

```cpp
// Extrait simplifié du code généré par faust2juce
void FaustPluginProcessor::processBlock(
    juce::AudioBuffer<float>& buffer,  // Le buffer audio à remplir
    juce::MidiBuffer& midiMessages     // Les messages MIDI recus
)
{
    int numSamples = buffer.getNumSamples();

    float* channels[2];
    channels[0] = buffer.getWritePointer(0);  // Canal gauche
    channels[1] = buffer.getWritePointer(1);  // Canal droit

    // Appel du DSP Faust pour traiter le bloc
    fDSP->compute(numSamples, channels, channels);
}
```

**Ce que processBlock() n'est PAS** :

- processBlock() n'est pas appelé une seule fois. À 44100 Hz avec un buffer de 256, il est appelé environ 172 fois par seconde.
- processBlock() tourne dans le thread audio temps réel. Jamais d'allocations mémoire ni d'accès disque ici.

---

### Comment fonctionnent les paramètres Faust dans JUCE ?

**Définition** : Chaque slider, bouton ou checkbox Faust est automatiquement converti en AudioParameterFloat dans JUCE. Le DAW peut voir, modifier et automatiser chaque paramètre.

**Analogie concrète** : Imagine des boutons physiques (l'UI) reliés par câbles à des moteurs (le DSP). Si on tourne un bouton, le câble transmet le mouvement au moteur. Si le moteur est piloté par un programme (l'automation), le câble fait tourner le bouton en retour.

**Correspondance des types** :

| Widget Faust | Paramètre JUCE |
| --- | --- |
| `hslider("Freq", 440, 20, 20000, 1)` | `AudioParameterFloat("Freq", "Freq", 20.0f, 20000.0f, 440.0f)` |
| `button("Gate")` | `AudioParameterFloat("Gate", "Gate", 0.0f, 1.0f, 0.0f)` |
| `checkbox("Bypass")` | `AudioParameterFloat("Bypass", "Bypass", 0.0f, 1.0f, 0.0f)` |

---

### Qu'est-ce qu'une UI personnalisée dans JUCE ?

**Définition** : Par défaut, faust2juce génère une interface générique. Une UI personnalisée remplace cette interface par un design JUCE sur mesure (knobs, visualisations, couleurs).

**Le problème que l'UI personnalisée résout** :

Sans UI personnalisée, voici les problèmes rencontrés :

1. **Interface générique** : Tous les plugins faust2juce se ressemblent.
2. **Pas de visualisations** : Pas d'oscilloscope ni d'analyseur de spectre.

**Analogie concrète** : faust2juce génère un meuble en kit IKEA : fonctionnel mais standard. L'UI personnalisée, c'est engager un menuisier pour habiller ce meuble avec du bois massif et des poignées design.

**Accès aux paramètres Faust depuis JUCE** :

```cpp
// Connecter un slider JUCE au paramètre Faust "Freq"
freqAttachment = std::make_unique<
    juce::AudioProcessorValueTreeState::SliderAttachment>(
    processor.getValueTreeState(), "Freq", freqSlider
);
```

---

### Qu'est-ce que l'intégration manuelle ?

**Définition** : L'intégration manuelle consiste à inclure le code C++ généré par Faust dans un projet JUCE existant, sans faust2juce. Tu compiles ton `.dsp` en C++ avec `faust -lang cpp`, puis tu intègres la classe DSP dans ton AudioProcessor.

**Le problème que l'intégration manuelle résout** :

Sans intégration manuelle, voici les problèmes rencontrés :

1. **Projet existant** : Tu as déjà un plugin JUCE et tu veux y ajouter du DSP Faust.
2. **Contrôle limité** : faust2juce impose sa structure de projet.

**Analogie concrète** : faust2juce construit une maison entière. L'intégration manuelle, c'est acheter un moteur (le DSP Faust) et l'installer dans une voiture que tu as déjà (ton projet JUCE).

**Comparaison faust2juce vs intégration manuelle** :

| faust2juce | Intégration manuelle |
| --- | --- |
| Génère un projet complet | Tu ajoutes Faust à un projet existant |
| Interface auto-générée | Tu crées l'interface toi-même |
| Idéal pour un nouveau plugin | Idéal pour un projet existant |
| Moins de contrôle | Contrôle total |

---

### Comment fonctionne le MIDI dans JUCE+Faust ?

**Définition** : Le MIDI dans un plugin JUCE+Faust permet de recevoir des notes et des CC depuis le DAW pour piloter la synthèse Faust (polyphonie, modulation).

**Le problème que le MIDI résout** :

Sans support MIDI, voici les problèmes rencontrés :

1. **Pas de jeu au clavier** : Le synthétiseur produit un son continu, pas de notes.
2. **Pas de polyphonie** : Impossible de jouer plusieurs notes simultanément.

**Comment le MIDI résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas de jeu au clavier | Les messages note on/off pilotent `freq`, `gain` et `gate` |
| Pas de polyphonie | `-nvoices N` crée N instances du DSP |

**Analogie concrète** : Le MIDI est comme une partition musicale. Le clavier MIDI est le musicien qui envoie les instructions. JUCE est le chef d'orchestre qui les transmet aux voix polyphoniques Faust.

**Convention Faust pour la polyphonie** :

```faust
import("stdfaust.lib");

// Paramètres standards obligatoires pour la polyphonie
freq = hslider("freq", 440, 20, 20000, 0.01);  // Fréquence de la note
gain = hslider("gain", 0.5, 0, 1, 0.01);       // Vélocité (0 à 1)
gate = button("gate");                          // 1 = touche enfoncée

envelope = en.adsr(0.01, 0.1, 0.7, 0.3, gate);
process = os.osc(freq) * envelope * gain;
```

---

### Projucer vs CMake

**Définition** : Projucer est l'outil graphique historique de JUCE. CMake est un système de build multi-plateforme via fichiers texte.

**Comparaison Projucer vs CMake** :

| Projucer | CMake |
| --- | --- |
| Interface graphique | Fichier texte (CMakeLists.txt) |
| Spécifique à JUCE | Standard de l'industrie C++ |
| Difficile à intégrer en CI/CD | S'intègre facilement en CI/CD |
| Historique | Recommandé depuis JUCE 6 |

**Recommandation** : CMake est recommandé pour les projets modernes.

---

### Comment debugger le DSP Faust dans JUCE ?

**Définition** : Debugger le DSP Faust dans JUCE consiste à inspecter le comportement du code DSP généré dans le contexte du plugin en exécution.

**Techniques de debugging** :

| Problème | Technique |
| --- | --- |
| Son incorrect | Breakpoint dans `compute()` pour inspecter les échantillons |
| Valeurs aberrantes | `DBG()` de JUCE pour afficher les valeurs dans la console |
| Performance insuffisante | Profiler (Instruments sur macOS, VTune sur Windows/Linux) |

**Analogie concrète** : Debugger le DSP dans JUCE, c'est ouvrir le capot d'une voiture en marche pour observer le moteur. Le debugger permet de ralentir (breakpoint), observer les pièces (variables) et mesurer les performances.

```cpp
// Vérifier les valeurs aberrantes dans processBlock
for (int i = 0; i < buffer.getNumSamples(); ++i)
{
    if (std::isnan(data[i]) || std::isinf(data[i]))
        DBG("ERREUR: NaN/Inf au canal " + juce::String(ch));
}
```

---

## Étapes Pratiques

### Étape 1 : Générer un projet JUCE avec faust2juce

Crée un fichier `mon-synth.dsp` :

```faust
// mon-synth.dsp - Synthétiseur pour faust2juce
import("stdfaust.lib");

// Paramètres MIDI standards pour la polyphonie
freq = hslider("freq [unit:Hz] [scale:log]", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Oscillateur avec sélection de forme d'onde
waveform = nentry("Waveform [tooltip:0=Sine 1=Saw 2=Square]", 0, 0, 2, 1);
osc = select3(waveform, os.osc(freq), os.sawtooth(freq), os.square(freq));

// Enveloppe ADSR
attack = hslider("Attack [unit:s]", 0.01, 0.001, 2, 0.001);
decay = hslider("Decay [unit:s]", 0.1, 0.001, 2, 0.001);
sustain = hslider("Sustain", 0.7, 0, 1, 0.01);
release = hslider("Release [unit:s]", 0.3, 0.001, 5, 0.001);
envelope = en.adsr(attack, decay, sustain, release, gate);

// Filtre passe-bas
cutoff = hslider("Cutoff [unit:Hz] [scale:log]", 5000, 20, 20000, 1);
resonance = hslider("Resonance", 0.5, 0, 1, 0.01);

process = osc : fi.resonlp(cutoff, resonance * 5, 1) * envelope * gain;
```

Génère le projet JUCE :

```bash
# -midi : support MIDI, -nvoices 8 : 8 voix polyphoniques
faust2juce -midi -nvoices 8 mon-synth.dsp
```

**Résultat attendu** :

```text
Un dossier mon-synth/ est créé contenant :
mon-synth/
├── CMakeLists.txt              # Build CMake
├── mon-synth.jucer             # Projet Projucer (alternatif)
├── Source/
│   ├── FaustPluginProcessor.cpp # AudioProcessor (contient compute())
│   ├── FaustPluginEditor.cpp   # Interface graphique
│   └── FaustDSP.h              # Code C++ généré depuis Faust
└── JuceLibraryCode/
```

---

### Étape 2 : Compiler le projet avec CMake

```bash
cd mon-synth
mkdir build && cd build

# Configurer le projet
cmake .. -DCMAKE_BUILD_TYPE=Release

# Compiler (utilise tous les coeurs)
cmake --build . --config Release -j$(nproc 2>/dev/null || sysctl -n hw.ncpu)
```

**Résultat attendu** :

```text
[100%] Built target mon-synth_VST3
[100%] Built target mon-synth_Standalone

Le build produit :
- Un plugin VST3 dans build/mon-synth_artefacts/Release/VST3/
- Une application standalone dans build/mon-synth_artefacts/Release/Standalone/
```

Teste le plugin :

```bash
# Lancer en standalone (macOS)
open build/mon-synth_artefacts/Release/Standalone/mon-synth.app
```

---

### Étape 3 : Modifier l'UI JUCE générée

Pour un contrôle complet, crée `Source/CustomEditor.h` qui remplace l'éditeur généré :

```cpp
// Source/CustomEditor.h - Éditeur personnalisé
#pragma once
#include <JuceHeader.h>
#include "FaustPluginProcessor.h"

class CustomEditor : public juce::AudioProcessorEditor
{
public:
    CustomEditor(FaustPluginProcessor& p)
        : AudioProcessorEditor(p), processor(p)
    {
        setSize(600, 400);

        // Slider rotatif pour le cutoff
        cutoffSlider.setSliderStyle(juce::Slider::RotaryVerticalDrag);
        cutoffSlider.setTextBoxStyle(
            juce::Slider::TextBoxBelow, false, 80, 20);
        addAndMakeVisible(cutoffSlider);

        // Connecter au paramètre Faust "Cutoff"
        cutoffAttachment = std::make_unique<
            juce::AudioProcessorValueTreeState::SliderAttachment>(
            processor.getValueTreeState(), "Cutoff", cutoffSlider);
    }

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(30, 30, 30));
        g.setColour(juce::Colours::white);
        g.setFont(20.0f);
        g.drawText("Mon Synthé", getLocalBounds().removeFromTop(40),
                   juce::Justification::centred);
    }

    void resized() override
    {
        auto area = getLocalBounds().reduced(10);
        area.removeFromTop(40);
        cutoffSlider.setBounds(area.reduced(50));
    }

private:
    FaustPluginProcessor& processor;
    juce::Slider cutoffSlider;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment>
        cutoffAttachment;
};
```

---

### Étape 4 : Intégrer manuellement du code Faust dans un projet JUCE existant

Génère le code C++ depuis Faust :

```bash
# -cn MonFiltre : nom de la classe générée
faust -lang cpp -cn MonFiltre -o Source/MonFiltre.h mon-filtre.dsp
```

Intègre le DSP dans ton AudioProcessor :

```cpp
#include "MonFiltre.h"
#include "faust/gui/MapUI.h"

class MonPluginProcessor : public juce::AudioProcessor
{
private:
    std::unique_ptr<MonFiltre> faustDSP;
    MapUI faustUI;

public:
    MonPluginProcessor() { faustDSP = std::make_unique<MonFiltre>(); }

    void prepareToPlay(double sampleRate, int) override
    {
        faustDSP->init(static_cast<int>(sampleRate));
        faustDSP->buildUserInterface(&faustUI);
    }

    void processBlock(juce::AudioBuffer<float>& buffer,
                      juce::MidiBuffer&) override
    {
        float* outputs[2];
        for (int ch = 0; ch < 2; ++ch)
            outputs[ch] = buffer.getWritePointer(ch);

        // Mettre à jour les paramètres puis traiter
        faustUI.setParamValue("Cutoff", cutoffValue);
        faustDSP->compute(buffer.getNumSamples(), outputs, outputs);
    }
};
```

---

### Étape 5 : Ajouter une visualisation (oscilloscope)

Crée `Source/Oscilloscope.h` pour afficher la forme d'onde en temps réel :

```cpp
#pragma once
#include <JuceHeader.h>

class Oscilloscope : public juce::Component, public juce::Timer
{
public:
    Oscilloscope() { startTimerHz(30); }

    // Appelé depuis processBlock pour envoyer les échantillons
    void pushSamples(const float* data, int numSamples)
    {
        for (int i = 0; i < numSamples; ++i)
        {
            buffer[writePos] = data[i];
            writePos = (writePos + 1) % bufferSize;
        }
    }

    void paint(juce::Graphics& g) override
    {
        g.fillAll(juce::Colour(20, 20, 30));
        g.setColour(juce::Colours::limegreen);

        juce::Path path;
        for (int i = 0; i < bufferSize; ++i)
        {
            int idx = (writePos + i) % bufferSize;
            float x = (float)i / bufferSize * getWidth();
            float y = (1.0f - buffer[idx]) * 0.5f * getHeight();
            if (i == 0) path.startNewSubPath(x, y);
            else path.lineTo(x, y);
        }
        g.strokePath(path, juce::PathStrokeType(1.5f));
    }

    void timerCallback() override { repaint(); }

private:
    static constexpr int bufferSize = 512;
    float buffer[bufferSize] = {};
    int writePos = 0;
};
```

Intègre l'oscilloscope dans l'éditeur et envoie les échantillons depuis processBlock :

```cpp
// Dans processBlock, après le traitement DSP
if (oscilloscope != nullptr)
    oscilloscope->pushSamples(buffer.getReadPointer(0),
                              buffer.getNumSamples());
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `faust2juce fichier.dsp` | Génère un projet JUCE |
| `faust2juce -midi -nvoices 8 fichier.dsp` | Projet JUCE polyphonique 8 voix |
| `faust2juce -midi -nvoices 8 -effect effet.dsp synth.dsp` | Polyphonie + effet global |
| `faust -lang cpp -cn NomClasse -o sortie.h fichier.dsp` | Code C++ pour intégration manuelle |
| `cmake .. -DCMAKE_BUILD_TYPE=Release` | Configure le build CMake |
| `cmake --build . --config Release` | Compile le projet JUCE |

---

## Pièges Fréquents

### Piège 1 : Noms de paramètres incompatibles avec JUCE

**Problème** : Le plugin crashe. JUCE requiert des identifiants ASCII sans accents ni espaces.

**Solution** : Utilise des noms simples et ajoute un tooltip pour le label lisible.

```faust
// ❌ Accent et espace
hslider("Fréquence du filtre", 440, 20, 20000, 1)

// ✅ ASCII simple avec tooltip
hslider("Freq [tooltip:Fréquence du filtre en Hz]", 440, 20, 20000, 1)
```

---

### Piège 2 : Oublier d'initialiser le DSP avant compute()

**Problème** : Le plugin produit du silence ou du bruit.

**Solution** : Appelle `init()` dans `prepareToPlay()`, avant tout appel à `compute()`.

```cpp
void prepareToPlay(double sampleRate, int) override
{
    faustDSP->init(static_cast<int>(sampleRate));
    faustDSP->buildUserInterface(&faustUI);
}
```

---

### Piège 3 : Mauvaise taille du tableau de pointeurs dans compute()

**Problème** : Segfault. Le DSP Faust attend un nombre de canaux spécifique.

**Solution** : Vérifie avec `getNumInputs()` et `getNumOutputs()`.

```cpp
int numOutputs = faustDSP->getNumOutputs();
std::vector<float*> outputs(numOutputs);
for (int ch = 0; ch < numOutputs; ++ch)
    outputs[ch] = buffer.getWritePointer(ch);
faustDSP->compute(numSamples, inputs.data(), outputs.data());
```

---

### Piège 4 : Allocation mémoire dans le thread audio

**Problème** : Craquements et décrochages audio.

**Solution** : Alloue toute la mémoire dans `prepareToPlay()`, jamais dans `processBlock()`.

```cpp
// ❌ Allocation dans processBlock
std::vector<float*> outputs(2);  // alloue à chaque appel

// ✅ Pré-allouer dans prepareToPlay
outputPtrs.resize(faustDSP->getNumOutputs());  // une seule fois
```

---

### Piège 5 : Changement de sample rate non géré

**Problème** : Le plugin sonne faux après un changement de fréquence d'échantillonnage.

**Solution** : Réinitialise le DSP dans `prepareToPlay()` (appelé à chaque changement).

```cpp
void prepareToPlay(double sampleRate, int) override
{
    faustDSP->instanceInit(static_cast<int>(sampleRate));
}
```

---

### Piège 6 : Confusion entre faust2juce et intégration manuelle

**Problème** : Tu mélanges les deux approches dans le même projet.

**Solution** : Choisis une seule approche.

| Situation | Approche recommandée |
| --- | --- |
| Nouveau plugin | faust2juce |
| Projet JUCE existant | Intégration manuelle |
| UI très personnalisée | faust2juce + remplacement de l'éditeur |

---

## Checklist de Validation

- [ ] J'ai compris ce que JUCE fournit (UI, formats, I/O) et ce que Faust fournit (DSP)
- [ ] J'ai généré un projet JUCE avec faust2juce et je l'ai compilé
- [ ] J'ai compris le rôle de processBlock() et comment compute() y est appelé
- [ ] J'ai compris la synchronisation automatique des paramètres Faust/JUCE
- [ ] J'ai modifié l'interface graphique générée
- [ ] J'ai compris la différence entre faust2juce et l'intégration manuelle
- [ ] J'ai utilisé les conventions MIDI (freq, gain, gate) pour la polyphonie
- [ ] J'ai compris la différence entre Projucer et CMake
- [ ] J'ai ajouté une visualisation (oscilloscope) dans le plugin

---

## Exercice Pratique

**Énoncé** : Crée un plugin de synthétiseur FM avec faust2juce : oscillateur FM + filtre + ADSR + reverb. Personnalise l'UI JUCE avec un layout en 4 groupes visuels (Oscillateur, Filtre, Enveloppe, Effets).

Le synthétiseur doit avoir :

1. **Groupe "Oscillateur"** : oscillateur FM avec `ModIndex` (0-10, init 2) et `ModRatio` (0.5-8, init 2)
2. **Groupe "Filtre"** : filtre passe-bas avec `Cutoff` (20-20000 Hz, log) et `Resonance` (0-1)
3. **Groupe "Enveloppe"** : ADSR (Attack, Decay, Sustain, Release)
4. **Groupe "Effets"** : reverb avec `RoomSize` (0-1) et `Wet` (0-1)
5. **Polyphonie** : 8 voix avec les conventions MIDI (freq, gain, gate)

**Indications** :

- Oscillateur FM : `os.osc(freq + os.osc(freq * modRatio) * modIndex * freq)`
- Filtre : `fi.resonlp(cutoff, resonance * 5, 1)`
- ADSR : `en.adsr(attack, decay, sustain, release, gate)`
- Reverb : `re.mono_freeverb(roomSize, 0.5, 0.5, 0)` dans un fichier séparé (signature : fb1, fb2, damp, spread)
- Utilise `-effect` pour séparer le synthé de la reverb
- UI JUCE : utilise `juce::GroupComponent` pour les groupes visuels

**Résultat attendu** :

```text
Un plugin VST3/AU fonctionnel avec :
- Un synthétiseur FM polyphonique jouable au clavier MIDI
- Un filtre passe-bas résonant
- Une enveloppe ADSR
- Une reverb
- Une interface organisée en 4 groupes : [Oscillateur] [Filtre] [Enveloppe] [Effets]
- Tous les paramètres automatisables dans le DAW
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée `fm-synth.dsp` :

```faust
// fm-synth.dsp - Synthétiseur FM polyphonique
import("stdfaust.lib");

// Paramètres MIDI standards
freq = hslider("freq [unit:Hz]", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Oscillateur FM
modIndex = hslider("[0]ModIndex", 2, 0, 10, 0.01);
modRatio = hslider("[1]ModRatio", 2, 0.5, 8, 0.01);
modulateur = os.osc(freq * modRatio) * modIndex * freq;
oscillateur = os.osc(freq + modulateur);

// Filtre
cutoff = hslider("[2]Cutoff [unit:Hz] [scale:log]", 5000, 20, 20000, 1);
resonance = hslider("[3]Resonance", 0.3, 0, 1, 0.01);

// Enveloppe ADSR
attack = hslider("[4]Attack [unit:s]", 0.01, 0.001, 2, 0.001);
decay = hslider("[5]Decay [unit:s]", 0.1, 0.001, 2, 0.001);
sustain = hslider("[6]Sustain", 0.7, 0, 1, 0.01);
release = hslider("[7]Release [unit:s]", 0.3, 0.001, 5, 0.001);
envelope = en.adsr(attack, decay, sustain, release, gate);

// Chaîne : oscillateur FM -> filtre -> enveloppe -> gain
process = oscillateur : fi.resonlp(cutoff, resonance * 5 + 0.5, 1)
          * envelope * gain;
```

Crée `fm-reverb.dsp` :

```faust
// fm-reverb.dsp - Reverb appliquée après le mixage polyphonique
import("stdfaust.lib");

roomSize = hslider("RoomSize", 0.5, 0, 1, 0.01);
wet = hslider("Wet", 0.3, 0, 1, 0.01);

// Mélange dry/wet
// re.mono_freeverb(fb1, fb2, damp, spread) : 4 arguments (spread=0 en mono)
process = _ <: *(1-wet), re.mono_freeverb(roomSize, 0.5, 0.5, 0) * wet :> _;
```

Génère et compile :

```bash
# Générer le projet avec reverb séparée
faust2juce -midi -nvoices 8 -effect fm-reverb.dsp fm-synth.dsp

# Compiler
cd fm-synth && mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release -j$(nproc 2>/dev/null || sysctl -n hw.ncpu)
```

Pour l'UI personnalisée, crée `Source/CustomEditor.h` avec 4 `juce::GroupComponent` (Oscillateur, Filtre, Enveloppe, Effets), chacun contenant des sliders rotatifs connectés aux paramètres Faust via `SliderAttachment`. Organise les groupes en 4 colonnes :

```cpp
// Structure de l'éditeur personnalisé (extrait)
class CustomEditor : public juce::AudioProcessorEditor
{
public:
    CustomEditor(FaustPluginProcessor& p) : AudioProcessorEditor(p)
    {
        setSize(700, 500);

        // Créer 4 GroupComponent avec couleurs distinctes
        oscGroup.setText("Oscillateur");
        filterGroup.setText("Filtre");
        envGroup.setText("Enveloppe");
        fxGroup.setText("Effets");

        // Pour chaque paramètre : créer un Slider rotatif
        // et le connecter via SliderAttachment
        // Exemple pour ModIndex :
        modIndexSlider.setSliderStyle(juce::Slider::RotaryVerticalDrag);
        modIndexAttachment = std::make_unique<
            juce::AudioProcessorValueTreeState::SliderAttachment>(
            p.getValueTreeState(), "ModIndex", modIndexSlider);
    }

    void resized() override
    {
        auto area = getLocalBounds().reduced(10);
        area.removeFromTop(40);  // Titre
        int colWidth = area.getWidth() / 4;
        // Répartir les 4 groupes en colonnes
        oscGroup.setBounds(area.removeFromLeft(colWidth).reduced(5));
        filterGroup.setBounds(area.removeFromLeft(colWidth).reduced(5));
        envGroup.setBounds(area.removeFromLeft(colWidth).reduced(5));
        fxGroup.setBounds(area.reduced(5));
    }
};
```

```text
Vérifie que :
- Le clavier MIDI joue des notes polyphoniques (jusqu'à 8)
- ModIndex change la richesse harmonique (0 = sinusoïde, 10 = métallique)
- ModRatio change le timbre (entier = harmonique, décimal = inharmonique)
- Cutoff et Resonance colorent le son
- L'enveloppe ADSR donne forme aux notes
- La reverb ajoute de l'espace (RoomSize grande = cathédrale)
- Tous les paramètres sont automatisables dans le DAW
```

---

## Navigation

← Fiche précédente : **[01 - libfaust : compilateur embarquable](01-libfaust-compilateur-embarquable.md)**

→ Fiche suivante : **[03 - Faust et Max/PureData/SuperCollider](03-faust-max-puredata-supercollider.md)**
