---
tags:
  - Faust
  - Avancé
  - Concept
description: "Système d'architectures Faust - architecture files, séparation DSP/UI/audio, faust2xxx et backends de compilation"
estimated_time: "80 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 5 - Déploiement et architectures"
---

# 01 - Système d'architectures Faust

> **En bref** : À la fin de cette fiche, tu sauras expliquer le système d'architectures de Faust, choisir le bon script faust2xxx pour ta cible de déploiement et comprendre les différents backends de compilation. Lecture estimée : 80 min.


## Prérequis

- [Phase 3 complète - Langage Faust fondamentaux](../../faust/03-langage-faust-fondamentaux/index.md) (syntaxe, opérateurs de composition, UI, mémoire et délais)
- [Phase 4 complète - DSP appliqué](../../faust/04-dsp-applique/index.md) (oscillateurs, filtres, effets, modélisation physique, bibliothèques)
- Savoir compiler un programme Faust avec `faust` et `faust2jaqt` (vu en [Fiche 03 - Environnement et outils](../../faust/02-prerequis-programmation/03-environnement-outils.md))
- Connaître les bases du C++ (vu en [Fiche 02 - C++ : notions essentielles](../../faust/02-prerequis-programmation/02-cpp-notions-essentielles.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le système d'architectures de Faust, choisir le bon script faust2xxx pour ta cible de déploiement et comprendre les différents backends de compilation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Le problème de la portabilité du code DSP

**Définition** : La portabilité du code DSP désigne la capacité d'un même algorithme de traitement du signal à s'exécuter sur des plateformes différentes (plugin VST dans un DAW, application web dans un navigateur, carte embarquée Bela) sans modification du code source.

**Le problème que la portabilité résout** :

Sans portabilité, voici les problèmes rencontrés :

1. **Réécriture complète pour chaque cible** : Un filtre passe-bas écrit pour JACK ne fonctionne pas dans un plugin LV2. Il faut réécrire la gestion audio, l'interface graphique et la boucle principale pour chaque plateforme.

2. **Maintenance impossible** : Quand tu corriges un bug dans la version JACK, il faut reporter la correction dans la version VST, la version web, la version embarquée.

3. **Expertise multi-plateforme requise** : Chaque cible a son propre SDK et ses propres APIs audio (VST3, LV2, WebAudio, CoreAudio, JACK). C'est irréaliste pour un musicien ou un chercheur en acoustique.

**Comment Faust résout ces problèmes** :

| Problème | Solution apportée par Faust |
| --- | --- |
| Réécriture pour chaque cible | Tu écris le DSP une seule fois en Faust. Le système d'architectures génère le code spécifique à chaque plateforme |
| Maintenance impossible | Une correction dans le fichier `.dsp` se propage automatiquement à toutes les cibles lors de la recompilation |
| Expertise multi-plateforme | Les architecture files encapsulent la complexité de chaque plateforme. Tu n'as pas besoin de connaître l'API VST3 pour générer un plugin VST |

**Analogie concrète** : Imagine que tu écris une lettre (ton algorithme DSP) à envoyer dans 10 pays. Sans ce service, il faudrait la traduire dans 10 langues et utiliser 10 types d'enveloppes. Le système d'architectures de Faust est un service postal universel : tu déposes ta lettre en un seul exemplaire, et le service la traduit et l'expédie correctement pour chaque pays.

**Ce que la portabilité Faust n'est PAS** :

- La portabilité Faust ne signifie pas que le résultat est identique partout. Un plugin VST a une interface graphique dans un DAW, une application JACK a sa propre fenêtre, une version WebAssembly tourne dans un navigateur. Le traitement du signal est identique, mais l'emballage autour change.
- La portabilité Faust ne signifie pas "zéro configuration". Certaines cibles nécessitent des dépendances spécifiques (Qt pour les interfaces graphiques, JACK pour le routage audio, un SDK VST pour les plugins). Le système d'architectures simplifie, mais n'élimine pas totalement les prérequis.

---

### Qu'est-ce qu'un architecture file ?

**Définition** : Un architecture file est un fichier C++ template qui définit comment le code DSP généré par le compilateur Faust est intégré dans un contexte d'exécution. Il fournit trois éléments : le pilote audio (comment les échantillons entrent et sortent), l'interface utilisateur (comment l'utilisateur contrôle les paramètres) et la boucle principale du programme (comment tout démarre et s'exécute).

**Le problème que les architecture files résolvent** :

Sans architecture files, voici les problèmes rencontrés :

1. **Le code Faust compilé ne fait rien seul** : Le compilateur produit une classe C++ avec `compute()`, mais cette classe ne sait pas d'où viennent les échantillons, ni où les envoyer, ni comment afficher une interface.

2. **Le code d'intégration est complexe** : Connecter la classe DSP à JACK, CoreAudio ou WebAudio demande des centaines de lignes de C++ spécifique à chaque plateforme.

3. **Chaque développeur réinvente la roue** : Sans architecture files partagées, chacun écrit son propre code d'intégration, avec ses propres bugs.

**Comment les architecture files résolvent ces problèmes** :

| Problème | Solution apportée par les architecture files |
| --- | --- |
| Le code DSP ne fait rien seul | L'architecture file fournit le `main()`, le pilote audio et l'interface graphique |
| Code d'intégration complexe | L'architecture file contient déjà tout le code d'intégration validé |
| Réinvention de la roue | Les architecture files sont partagés et maintenus par l'équipe Faust |

**Analogie concrète** : Le code Faust compilé est comme un moteur de voiture. Le moteur sait transformer du carburant en énergie mécanique, mais un moteur posé sur une table ne sert à rien.
L'architecture file est le châssis de la voiture : il fournit le réservoir (entrée audio), les roues (sortie audio), le volant (interface utilisateur) et le démarreur (boucle principale).
Le même moteur peut être installé dans un châssis de berline (application JACK), un châssis de camion (plugin VST) ou un châssis de bateau (application web).

**Ce qu'un architecture file n'est PAS** :

- Un architecture file n'est pas du code Faust. C'est du code C++ qui contient un emplacement réservé (`<<includeIntrinsic>>` et `<<includeclass>>`) où le compilateur Faust insère le code DSP généré.
- Un architecture file n'est pas un fichier de configuration. Il ne contient pas des paramètres clé-valeur. C'est un programme C++ complet avec des classes, des fonctions et une logique d'exécution.

**Où sont stockés les architecture files** :

```text
/usr/local/share/faust/
├── architecture/          # Architecture files (jack-qt.cpp, lv2.cpp, minimal.cpp, ...)
├── audio/                 # Pilotes audio (jack-dsp.h, coreaudio-dsp.h, alsa-dsp.h, ...)
└── gui/                   # Frameworks UI (QTUI.h, GTKUI.h, console.h, ...)
```

---

### Comment fonctionne la séparation DSP / UI / Audio ?

**Définition** : La séparation DSP / UI / Audio est le principe architectural fondamental de Faust. Le code Faust ne définit que le traitement du signal (DSP). L'architecture file fournit le conteneur : le pilote audio (entrée/sortie des échantillons) et l'interface utilisateur (contrôle des paramètres). Ces trois couches sont indépendantes et interchangeables.

**Le problème que cette séparation résout** :

Sans cette séparation, voici les problèmes rencontrés :

1. **Couplage fort** : Si le code DSP est mélangé avec le code de l'interface graphique et le code du pilote audio, changer de pilote audio (de JACK à CoreAudio) oblige à réécrire aussi le DSP et l'interface.

2. **Impossibilité de réutiliser** : Un algorithme de réverbération écrit dans un plugin VST ne peut pas être extrait pour être utilisé dans une application web. Le DSP, l'UI et l'audio sont entrelacés.

3. **Tests difficiles** : Pour tester un algorithme DSP, il faut initialiser l'interface graphique et le pilote audio, même si le test ne concerne que le traitement du signal.

**Comment cette séparation résout ces problèmes** :

| Problème | Solution apportée par la séparation DSP / UI / Audio |
| --- | --- |
| Couplage fort | Chaque couche est un module indépendant. Changer le pilote audio ne touche pas le DSP |
| Impossibilité de réutiliser | Le même fichier `.dsp` est réutilisé tel quel dans n'importe quel contexte |
| Tests difficiles | On peut tester le DSP avec un pilote audio factice et sans interface graphique |

**Analogie concrète** : Pense à un lecteur DVD. Le film (DSP) est gravé sur le disque. Le téléviseur (UI) affiche l'image. Les haut-parleurs (Audio) produisent le son. Tu peux regarder le même film sur un téléviseur 24 pouces ou un écran de cinéma. Tu peux l'écouter avec des écouteurs ou une sono de salle. Le film ne change pas, seul l'équipement autour change.

**Ce que cette séparation n'est PAS** :

- Cette séparation ne signifie pas que les couches ne communiquent pas. L'UI envoie les valeurs des paramètres au DSP (par exemple, la fréquence de coupure d'un filtre). Le pilote audio appelle la méthode `compute()` du DSP à chaque cycle. Mais chaque couche a sa responsabilité propre.
- Cette séparation ne signifie pas que tu dois écrire les trois couches. Tu n'écris que le DSP. Les deux autres couches sont fournies par l'architecture file.

Le diagramme suivant montre comment un même code Faust est compilé vers différentes architectures cibles :

<div class="diagram-design">
<p><a href="../../../diagrams/faust-05-deploiement-architectures-01-systeme-architectures-faust-1.html">Comment fonctionne la séparation DSP / UI / Audio ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/faust-05-deploiement-architectures-01-systeme-architectures-faust-1.html" title="Comment fonctionne la séparation DSP / UI / Audio ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Les trois couches en détail

Chaque programme Faust déployé repose sur trois couches distinctes. Cette section décrit le rôle précis de chacune.

#### Couche 1 : Audio driver

Le pilote audio gère la communication avec le matériel. Il appelle `compute()` du DSP à chaque buffer.

Pilotes disponibles : JACK (Linux/macOS), ALSA (Linux), CoreAudio (macOS), PortAudio (multiplateforme), WebAudio (navigateur), Dummy (tests).

#### Couche 2 : UI (interface utilisateur)

L'UI affiche les contrôles (`hslider`, `vslider`, `button`, `nentry`) et transmet les valeurs au DSP.

Frameworks disponibles : Qt (bureau), GTK (bureau/Linux), Web HTML/JS (navigateur), Console (texte), Headless (plugins).

#### Couche 3 : DSP (traitement du signal)

Le code que tu écris en Faust, compilé en une classe avec trois méthodes : `init(sample_rate)`, `compute(count, inputs, outputs)` et `buildUserInterface(ui)`.

**Le flux d'exécution** :

```text
Audio driver (JACK/ALSA/CoreAudio/WebAudio)
    │
    │ appelle compute() à chaque buffer
    ▼
DSP (ton code Faust compilé)
    │
    │ reçoit les valeurs des paramètres
    ▼
UI (Qt/GTK/Web/Console)
```

1. Le programme démarre (`main()` dans l'architecture file)
2. Le DSP est initialisé avec `init(sample_rate)`
3. L'UI est construite avec `buildUserInterface()`
4. Le pilote audio appelle `compute()` en boucle
5. Les modifications de paramètres via l'UI sont transmises au DSP en temps réel

---

### Que sont les scripts faust2xxx ?

**Définition** : Les scripts `faust2xxx` sont des scripts shell fournis avec Faust qui automatisent la chaîne complète de déploiement : compilation Faust vers un langage cible, sélection de l'architecture file appropriée, puis compilation du langage cible vers un exécutable ou un plugin. Chaque script cible une plateforme précise.

**Le problème que les scripts faust2xxx résolvent** :

Sans les scripts `faust2xxx`, voici les problèmes rencontrés :

1. **Chaîne de compilation en plusieurs étapes** : Pour produire une application JACK + Qt, il faut appeler `faust` avec l'option `-a`, puis `g++` avec les drapeaux Qt, JACK, les chemins d'inclusion et les options d'optimisation. C'est une commande de 200 caractères.

2. **Différences entre plateformes** : Les chemins, noms de bibliothèques et drapeaux changent entre Linux, macOS et Windows.

3. **Dépendances implicites** : Certaines cibles nécessitent des outils supplémentaires (qmake pour Qt, wasm-ld pour WebAssembly).

**Comment les scripts faust2xxx résolvent ces problèmes** :

| Problème | Solution apportée par les scripts faust2xxx |
| --- | --- |
| Chaîne de compilation multi-étapes | Une seule commande : `faust2jaqt mon_programme.dsp` |
| Différences entre plateformes | Chaque script détecte la plateforme et ajuste les drapeaux automatiquement |
| Dépendances implicites | Le script vérifie les dépendances et affiche un message clair si quelque chose manque |

**Analogie concrète** : Les scripts `faust2xxx` fonctionnent comme des machines à café à capsules. Tu insères la capsule (ton fichier `.dsp`) et tu appuies sur le bouton (faust2jaqt, faust2lv2, faust2wasm). La machine gère tout le reste. Sans elle, tu devrais moudre, chauffer, doser et filtrer toi-même.

**Ce que les scripts faust2xxx ne sont PAS** :

- Les scripts `faust2xxx` ne sont pas des compilateurs. Ils appellent le compilateur Faust (`faust`) et le compilateur C++ (`g++` ou `clang++`) en coulisses. Ce sont des scripts d'automatisation.
- Les scripts `faust2xxx` ne modifient pas ton code Faust. Ils prennent ton fichier `.dsp` en entrée et produisent un exécutable ou un plugin en sortie. Le fichier `.dsp` reste intact.

**Liste des principaux scripts faust2xxx** :

| Script | Cible | Description |
| --- | --- | --- |
| `faust2jaqt` | JACK + Qt | Application autonome avec interface graphique Qt et sortie JACK |
| `faust2jack` | JACK (CLI) | Application JACK en ligne de commande (sans interface graphique) |
| `faust2caqt` | CoreAudio + Qt | Application macOS avec CoreAudio et interface Qt |
| `faust2lv2` | Plugin LV2 | Plugin audio au format LV2 (compatible Ardour, Carla, Qtractor) |
| `faust2vst` | Plugin VST2 | Format VST2 historique. Le SDK VST2 n'est plus distribué par Steinberg : préfère `faust2juce` pour cibler le VST3 |
| `faust2juce` | JUCE | Projet JUCE complet (VST3, AU, standalone). Voie recommandée pour les plugins modernes |
| `faust2wasm` | WebAssembly | Module WebAssembly pour le Web Audio API dans un navigateur |
| `faust2android` | Android | Application Android avec interface tactile |
| `faust2ios` | iOS | Application iOS pour iPhone et iPad |
| `faust2bela` | Bela | Code optimisé pour la carte embarquée Bela |
| `faust2api` | API C++ | Bibliothèque C++ réutilisable (sans UI, sans audio driver) |

**Comment choisir le bon script** :

```text
Quelle est ta cible ?
│
├── Application de bureau
│   ├── Avec interface graphique → faust2jaqt (Linux) ou faust2caqt (macOS)
│   └── Sans interface graphique → faust2jack
│
├── Plugin audio pour un DAW
│   ├── Format LV2 → faust2lv2
│   ├── Format VST2 (legacy, SDK indisponible) → faust2vst
│   └── Format VST3 + AU + standalone → faust2juce (recommandé)
│
├── Application web
│   └── Navigateur → faust2wasm
│
├── Application mobile
│   ├── Android → faust2android
│   └── iOS → faust2ios
│
└── Hardware embarqué
    └── Carte Bela → faust2bela
```

---

### Que sont les backends de compilation ?

**Définition** : Un backend de compilation est le module du compilateur Faust qui génère le code dans un langage cible spécifique. Le compilateur Faust traduit d'abord le code `.dsp` en une représentation intermédiaire (un graphe de signal), puis le backend transforme cette représentation en code C++, C, Rust, WebAssembly ou un autre langage.

**Le problème que les backends résolvent** :

Sans backends multiples, voici les problèmes rencontrés :

1. **Dépendance à un seul langage** : Sans backends multiples, impossible d'utiliser Faust dans un projet Rust, un navigateur web ou un environnement CSound.

2. **Performances sous-optimales** : Le C++ est performant sur bureau, mais pour le web, le WebAssembly est plus adapté. Pour l'embarqué, le C pur est nécessaire pour les microcontrôleurs (ESP32, Teensy).

3. **Intégration difficile** : Intégrer du C++ dans un projet Rust demande un binding FFI complexe. Un backend Rust natif élimine cette complexité.

**Comment les backends résolvent ces problèmes** :

| Problème | Solution apportée par les backends |
| --- | --- |
| Dépendance à un seul langage | L'option `-lang` permet de choisir parmi plus de 10 langages cibles |
| Performances sous-optimales | Chaque backend génère du code idiomatique et optimisé pour son langage cible |
| Intégration difficile | Le code généré s'intègre nativement dans un projet du langage cible |

**Analogie concrète** : Les backends fonctionnent comme les sorties d'un adaptateur de voyage universel. Tu branches ton appareil (ton code Faust) d'un côté, et tu choisis la prise de l'autre (C++ pour le bureau, WebAssembly pour le web, Rust pour un projet Rust). Le courant (le traitement du signal) est le même.

**Ce qu'un backend n'est PAS** :

- Un backend n'est pas un compilateur complet. Il génère du code source. Il faut ensuite un compilateur du langage cible (g++, rustc, wasm-ld) pour produire un exécutable.
- Un backend ne change pas l'algorithme. Le traitement du signal est mathématiquement identique quel que soit le backend.

**Liste des backends disponibles** :

| Backend | Option `-lang` | Description | Cas d'usage |
| --- | --- | --- | --- |
| C++ | `cpp` (défaut) | Code C++ avec classes et templates | Applications de bureau, plugins audio |
| C | `c` | Code C pur (pas de classes) | Systèmes embarqués, compatibilité maximale |
| Rust | `rust` | Code Rust avec ownership et traits | Projets Rust, sécurité mémoire |
| LLVM IR | `llvm` | Représentation intermédiaire LLVM | Compilation JIT (FaustLive, libfaust) |
| WebAssembly | `wasm` | Bytecode WebAssembly | Applications web, navigateurs |
| Interpreter | `interp` | Bytecode interprété par Faust | Prototypage rapide, hot-reloading |
| Java | `java` | Code Java | Applications Android, intégration JVM |
| Julia | `julia` | Code Julia | Calcul scientifique, recherche |
| CSound | `csound` | Opcode CSound | Intégration dans des orchestres CSound |
| Soul | `soul` | Code Soul (JUCE) | Pipeline audio Soul/JUCE |

**Comparaison des backends les plus utilisés** :

| Critère | C++ (`cpp`) | Rust (`rust`) | WebAssembly (`wasm`) |
| --- | --- | --- | --- |
| Performance | Maximale | Comparable au C++ | Proche du natif dans le navigateur |
| Plateforme | Bureau, plugins, embarqué | Bureau, plugins | Navigateurs web |
| Sécurité mémoire | Manuelle | Garantie par le compilateur | Sandbox du navigateur |
| Écosystème audio | Très large (JUCE, VST, LV2) | En croissance | Web Audio API |
| Maturité du backend | Très mature (backend par défaut) | Stable | Stable |

---

### Quelles sont les options principales du compilateur ?

**Définition** : Les options du compilateur Faust sont des drapeaux passés en ligne de commande qui contrôlent le comportement de la compilation : choix de l'architecture file, du langage cible, du fichier de sortie et des optimisations.

**Options essentielles** :

| Option | Rôle | Syntaxe | Exemple |
| --- | --- | --- | --- |
| `-a` | Spécifie l'architecture file à utiliser | `-a <fichier.cpp>` | `faust -a jack-qt.cpp synth.dsp` |
| `-lang` | Choisit le langage cible (backend) | `-lang <langage>` | `faust -lang rust synth.dsp` |
| `-o` | Définit le fichier de sortie | `-o <fichier>` | `faust -o synth.cpp synth.dsp` |
| `-vec` | Active la vectorisation automatique (SIMD) | `-vec` | `faust -vec synth.dsp` |
| `-double` | Utilise des flottants 64 bits (double précision) | `-double` | `faust -double synth.dsp` |
| `-i` | Inclut les bibliothèques en ligne (inlining) | `-i` | `faust -i synth.dsp` |
| `-cn` | Définit le nom de la classe C++ générée | `-cn <nom>` | `faust -cn MonSynth synth.dsp` |

Les options se combinent librement. Exemples :

```bash
# Compiler vers Rust en double précision avec un nom de classe personnalisé
faust -lang rust -double -cn MonFiltre -o mon_filtre.rs filtre.dsp
```

---

### Comment créer sa propre architecture file ?

**Définition** : Créer sa propre architecture file consiste à écrire un fichier C++ qui définit comment le code DSP Faust est intégré dans un contexte d'exécution personnalisé. Cela permet d'adapter Faust à un pilote audio, un framework UI ou un environnement qui n'est pas couvert par les architecture files standard.

**Le problème que la création d'architectures personnalisées résout** :

Sans la possibilité de créer ses propres architecture files, voici les problèmes rencontrés :

1. **Cibles non couvertes** : Si tu utilises un pilote audio propriétaire ou un framework UI exotique, aucun architecture file standard ne conviendra.

2. **Intégration dans un projet existant** : Tu veux intégrer du DSP Faust dans une application C++ existante qui a déjà son propre système audio et son propre framework UI. Les architecture files standard imposent leur propre `main()` et leur propre boucle principale, ce qui entre en conflit.

**Comment la création d'architectures personnalisées résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Cibles non couvertes | Tu écris un architecture file adapté à ta cible spécifique |
| Intégration dans un projet existant | Tu écris un architecture file minimal qui s'intègre dans la boucle principale de ton application |

**Structure minimale d'un architecture file** :

```cpp
// minimal-arch.cpp - Architecture file minimale

#include <iostream>
#include <cmath>

// Le compilateur Faust insère ici les définitions de types internes
<<includeIntrinsic>>

// Le compilateur Faust insère ici la classe DSP générée
<<includeclass>>

int main(int argc, char* argv[])
{
    // 1. Créer et initialiser le DSP
    mydsp dsp;
    dsp.init(44100);  // Taux d'échantillonnage

    // 2. Préparer les buffers (256 échantillons)
    int buffer_size = 256;
    float** inputs = new float*[dsp.getNumInputs()];
    float** outputs = new float*[dsp.getNumOutputs()];
    for (int i = 0; i < dsp.getNumInputs(); i++)
        inputs[i] = new float[buffer_size]();
    for (int i = 0; i < dsp.getNumOutputs(); i++)
        outputs[i] = new float[buffer_size];

    // 3. Traiter un buffer d'échantillons
    dsp.compute(buffer_size, inputs, outputs);

    // 4. Afficher les premiers échantillons de sortie
    for (int i = 0; i < 10; i++)
        std::cout << "[" << i << "] = " << outputs[0][i] << std::endl;

    // 5. Libérer la mémoire
    for (int i = 0; i < dsp.getNumInputs(); i++) delete[] inputs[i];
    for (int i = 0; i < dsp.getNumOutputs(); i++) delete[] outputs[i];
    delete[] inputs;
    delete[] outputs;
    return 0;
}
```

**Les deux marqueurs obligatoires** :

| Marqueur | Rôle |
| --- | --- |
| `<<includeIntrinsic>>` | Le compilateur insère ici les définitions de types internes (FAUSTFLOAT, etc.) |
| `<<includeclass>>` | Le compilateur insère ici la classe DSP complète (avec `init`, `compute`, `buildUserInterface`) |

**API de la classe DSP générée** (méthodes utilisables dans un architecture file) :

| Méthode | Rôle |
| --- | --- |
| `int getNumInputs()` | Retourne le nombre d'entrées audio |
| `int getNumOutputs()` | Retourne le nombre de sorties audio |
| `void init(int sample_rate)` | Initialise le DSP avec le taux d'échantillonnage |
| `void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs)` | Traite `count` échantillons |
| `void buildUserInterface(UI* ui_interface)` | Déclare les paramètres de l'interface |

**Registre d'architectures** : le compilateur cherche les architecture files dans cet ordre : chemin `-a` absolu, répertoire courant, `$FAUST_LIB_PATH/architecture/`, `/usr/local/share/faust/architecture/`, `/usr/share/faust/architecture/`.

---

## Étapes Pratiques

### Étape 1 : Créer un programme Faust de test

Crée un fichier `test-archi.dsp` qui contient un oscillateur avec un contrôle de fréquence et de volume. Ce programme sera compilé vers différentes cibles dans les étapes suivantes.

```faust
// test-archi.dsp - Programme de test pour les architectures Faust
// Un oscillateur sinusoïdal avec contrôle de fréquence et de volume

import("stdfaust.lib");

// Paramètres contrôlables par l'utilisateur
freq = hslider("Fréquence [Hz]", 440, 20, 2000, 1);
gain = hslider("Volume", 0.5, 0, 1, 0.01);

// Traitement : oscillateur sinusoïdal multiplié par le volume
process = os.osc(freq) * gain;
```

Enregistre ce fichier dans un dossier de travail dédié :

```bash
# Créer un dossier de travail
mkdir -p ~/faust-architectures

# Se placer dans le dossier
cd ~/faust-architectures
```

---

### Étape 2 : Compiler vers C++ avec le compilateur Faust

Compile le programme vers C++ pour examiner le code généré :

```bash
# Compiler test-archi.dsp vers C++
faust -o test-archi.cpp test-archi.dsp
```

**Résultat attendu** :

```text
# Aucune sortie dans le terminal = compilation réussie
# Le fichier test-archi.cpp a été créé
```

Examine les éléments clés du fichier C++ généré :

```bash
# Afficher les premières lignes pour voir la structure de la classe
head -80 test-archi.cpp
```

**Résultat attendu** (extrait simplifié) :

```text
// Code généré par le compilateur Faust
// ...

class mydsp : public dsp {
  private:
    int fSampleRate;
    float fConst0;
    float fRec0[2];
    FAUSTFLOAT fHslider0;  // Fréquence
    FAUSTFLOAT fHslider1;  // Volume

  public:
    void init(int sample_rate) { ... }
    void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs) { ... }
    void buildUserInterface(UI* ui_interface) { ... }
};
```

Ce fichier C++ contient la classe `mydsp` avec les trois méthodes de l'API DSP. Il ne contient ni `main()`, ni pilote audio, ni interface graphique. C'est le rôle de l'architecture file.

---

### Étape 3 : Compiler vers différentes cibles avec faust2xxx

Compile le même programme vers trois cibles différentes pour observer la portabilité :

**Cible 1 : Application JACK avec interface Qt**

```bash
# Compiler vers une application JACK + Qt
faust2jaqt test-archi.dsp
```

**Résultat attendu** :

```text
# Le fichier exécutable test-archi est créé dans le répertoire courant
```

**Résultat attendu** : Lance `./test-archi`. Une fenêtre Qt s'ouvre avec deux curseurs : "Fréquence [Hz]" et "Volume". Un son sinusoïdal est audible.

**Cible 2 : Plugin LV2**

```bash
# Compiler vers un plugin LV2
faust2lv2 test-archi.dsp

# Examiner le contenu du plugin
ls -la test-archi.lv2/
```

**Résultat attendu** : Un dossier `test-archi.lv2/` contenant `manifest.ttl`, `test-archi.ttl` et `test-archi.so`.

**Cible 3 : WebAssembly**

```bash
# Compiler vers WebAssembly
faust2wasm test-archi.dsp

# Examiner les fichiers générés
ls -la test-archi-wasm/
```

**Résultat attendu** : Un dossier contenant `test-archi.wasm`, `test-archi.js` et `index.html`.

---

### Étape 4 : Examiner un architecture file simple

Examine l'architecture file minimale fournie avec Faust :

```bash
# Trouver et afficher un architecture file
# Le chemin dépend de ton installation
cat /usr/local/share/faust/architecture/minimal.cpp

# Si non trouvé, chercher sur le système
find /usr -name "minimal.cpp" -path "*/faust/*" 2>/dev/null
```

Observe dans ce fichier :

1. Les marqueurs `<<includeIntrinsic>>` et `<<includeclass>>` (emplacements d'insertion du code DSP)
2. La fonction `main()` (point d'entrée)
3. Les inclusions de pilotes audio et de frameworks UI

Compile avec un architecture file spécifique pour voir le résultat :

```bash
# Compiler avec un architecture file
faust -a minimal.cpp -o test-with-arch.cpp test-archi.dsp

# Comparer les tailles
wc -l test-archi.cpp test-with-arch.cpp
```

**Résultat attendu** :

```text
  150 test-archi.cpp
  450 test-with-arch.cpp
```

Le fichier avec architecture est plus volumineux : il contient le `main()`, le pilote audio et l'interface utilisateur en plus du DSP.

---

### Étape 5 : Compiler vers WebAssembly et Rust avec les backends

Utilise directement le compilateur Faust avec les backends WebAssembly et Rust :

```bash
# Compiler vers WebAssembly
faust -lang wasm -o test-archi.wasm test-archi.dsp

# Compiler vers Rust
faust -lang rust -o test-archi.rs test-archi.dsp
```

Examine le code Rust généré :

```bash
# Voir la structure du code Rust généré
head -30 test-archi.rs
```

**Résultat attendu** (extrait simplifié) :

```text
// Code Rust généré par le compilateur Faust

pub struct mydsp {
    fSampleRate: i32,
    fConst0: f32,
    fRec0: [f32; 2],
    fHslider0: f32,  // Fréquence
    fHslider1: f32,  // Volume
}

impl mydsp {
    pub fn new() -> mydsp { ... }
    pub fn init(&mut self, sample_rate: i32) { ... }
    pub fn compute(&mut self, count: i32, inputs: &[&[f32]], outputs: &mut [&mut [f32]]) { ... }
}
```

Le code Rust utilise une struct au lieu d'une classe, et `&mut self` au lieu de pointeurs. Le traitement du signal est identique au C++, seule la syntaxe change. Le fichier `.wasm` est un binaire compact, beaucoup plus petit que les fichiers texte C++ ou Rust.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `faust -o output.cpp input.dsp` | Compile vers C++ (backend par défaut) |
| `faust -lang rust -o output.rs input.dsp` | Compile vers Rust |
| `faust -lang wasm -o output.wasm input.dsp` | Compile vers WebAssembly |
| `faust -a arch.cpp -o output.cpp input.dsp` | Compile avec un architecture file spécifique |
| `faust -vec -double input.dsp` | Compile avec vectorisation et double précision |
| `faust -h` | Affiche l'aide complète du compilateur |
| `faust2jaqt input.dsp` | Application JACK + Qt |
| `faust2caqt input.dsp` | Application CoreAudio + Qt (macOS) |
| `faust2lv2 input.dsp` | Plugin LV2 |
| `faust2vst input.dsp` | Plugin VST |
| `faust2juce input.dsp` | Projet JUCE complet (VST3, AU, standalone) |
| `faust2wasm input.dsp` | WebAssembly pour navigateur |
| `faust2bela input.dsp` | Code pour carte Bela |

---

## Pièges Fréquents

### Piège 1 : Confondre le compilateur Faust et les scripts faust2xxx

**Problème** : Utiliser `faust` quand il faudrait utiliser `faust2jaqt`, ou inversement.

**Solution** : Le compilateur `faust` génère du code source (C++, Rust, WebAssembly). Les scripts `faust2xxx` génèrent un exécutable ou un plugin prêt à l'emploi. Si tu veux un programme fonctionnel en une seule commande, utilise `faust2xxx`. Si tu veux le code source pour l'intégrer dans ton propre projet, utilise `faust`.

```bash
# ❌ faust seul génère du C++ mais pas d'exécutable
faust -o synth.cpp synth.dsp
# synth.cpp existe mais n'est pas exécutable

# ✅ faust2jaqt génère un exécutable complet
faust2jaqt synth.dsp
# ./synth est exécutable et produit du son
```

---

### Piège 2 : Oublier les dépendances d'un script faust2xxx

**Problème** : Le script `faust2jaqt` échoue avec une erreur de bibliothèque manquante.

**Solution** : Chaque script a ses propres dépendances. `faust2jaqt` requiert Qt5 + JACK, `faust2lv2` requiert le LV2 SDK, `faust2wasm` requiert Emscripten.

```bash
# ✅ Installer les dépendances (Debian/Ubuntu)
sudo apt install qtbase5-dev libjack-jackd2-dev

# ✅ Installer les dépendances (macOS)
brew install qt jack
```

---

### Piège 3 : Confondre backend et architecture file

**Problème** : Croire que l'option `-lang rust` suffit pour obtenir un programme Rust fonctionnel.

**Solution** : L'option `-lang rust` génère du code Rust (le DSP), mais sans `main()`, sans pilote audio et sans interface utilisateur. Pour un programme complet, il faut soit utiliser un script `faust2xxx`, soit intégrer le code généré dans un projet Rust existant.

```bash
# ❌ Ceci génère une struct Rust, pas un programme complet
faust -lang rust -o synth.rs synth.dsp
# synth.rs contient la struct mydsp mais pas de fn main()

# ✅ Pour un programme Rust complet, intègre synth.rs dans un projet Cargo
# ou utilise faust2xxx pour une cible prédéfinie
```

---

### Piège 4 : Utiliser un architecture file incompatible avec le backend

**Problème** : Utiliser un architecture file C++ avec un backend Rust.

**Solution** : Les architecture files sont écrits dans le langage du backend par défaut (C++). Si tu utilises `-lang rust`, il n'y a pas d'architecture file Rust standard. Le backend Rust génère uniquement le code DSP, que tu intègres dans ton propre code Rust.

```bash
# ❌ Incompatible : architecture C++ avec backend Rust
faust -a jack-qt.cpp -lang rust -o synth.rs synth.dsp
# Erreur : l'architecture file est du C++, le backend génère du Rust

# ✅ Avec le backend C++ (défaut), les architecture files fonctionnent
faust -a jack-qt.cpp -o synth.cpp synth.dsp
```

---

### Piège 5 : Ne pas spécifier le taux d'échantillonnage dans une architecture personnalisée

**Problème** : La sortie audio est silencieuse ou produit un son incorrect.

**Solution** : La méthode `init()` doit être appelée avec le bon taux d'échantillonnage avant le premier appel à `compute()`. Oublier `init()` ou passer une valeur de 0 produit un comportement indéfini.

```cpp
// ❌ Oublier d'initialiser le DSP
mydsp dsp;
dsp.compute(256, inputs, outputs);  // Comportement indéfini !

// ✅ Toujours appeler init() avant compute()
mydsp dsp;
dsp.init(44100);  // Initialiser avec 44100 Hz
dsp.compute(256, inputs, outputs);  // Fonctionne correctement
```

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est un architecture file et son rôle dans le système Faust
- [ ] Je sais décrire les trois couches (Audio driver, UI, DSP) et leur responsabilité
- [ ] J'ai compilé un programme Faust vers C++ avec `faust -o output.cpp input.dsp`
- [ ] J'ai utilisé au moins un script faust2xxx pour générer un programme fonctionnel
- [ ] J'ai examiné un architecture file et identifié les marqueurs `<<includeIntrinsic>>` et `<<includeclass>>`
- [ ] Je sais choisir le bon script faust2xxx en fonction de ma cible de déploiement
- [ ] J'ai compilé vers WebAssembly avec `faust -lang wasm`
- [ ] J'ai compilé vers Rust avec `faust -lang rust`
- [ ] Je sais expliquer la différence entre un backend de compilation et un architecture file
- [ ] Je connais les options principales du compilateur (`-a`, `-lang`, `-o`, `-vec`, `-double`)

---

## Exercice Pratique

**Énoncé** : Prends le programme Faust suivant (un oscillateur avec filtre passe-bas et contrôles UI) et compile-le vers trois cibles différentes : application Qt (faust2jaqt), plugin LV2 (faust2lv2) et WebAssembly (faust2wasm). Compare les fichiers générés pour chaque cible.

Programme Faust à utiliser :

```faust
// exo-multi-cible.dsp - Oscillateur + filtre + UI
import("stdfaust.lib");

freq = hslider("Fréquence [Hz]", 440, 20, 4000, 1);
waveform = nentry("Forme d'onde [0=sin, 1=saw, 2=square]", 0, 0, 2, 1);
cutoff = hslider("Coupure filtre [Hz]", 2000, 100, 10000, 1);
resonance = hslider("Résonance", 0.7, 0.1, 10, 0.1);
gain = hslider("Volume", 0.3, 0, 1, 0.01);

oscillator = (os.osc(freq), os.sawtooth(freq), os.square(freq)) : select3(waveform);
process = oscillator : fi.resonlp(cutoff, resonance, 1) * gain;
```

**Indications** :

- Crée un dossier `~/faust-exercice-architectures/` pour cet exercice
- Enregistre le programme ci-dessus dans un fichier `exo-multi-cible.dsp`
- Compile vers les trois cibles une par une
- Pour chaque cible, note le nombre de fichiers générés, leur taille et leur type
- Remplis le tableau comparatif ci-dessous

**Résultat attendu** :

Un tableau rempli avec les informations suivantes :

| Cible | Commande | Fichiers générés | Taille totale approximative |
| --- | --- | --- | --- |
| Application Qt | `faust2jaqt exo-multi-cible.dsp` | 1 exécutable | ~200 Ko |
| Plugin LV2 | `faust2lv2 exo-multi-cible.dsp` | 3 fichiers (.so, .ttl, manifest.ttl) | ~150 Ko |
| WebAssembly | `faust2wasm exo-multi-cible.dsp` | 3 fichiers (.wasm, .js, .html) | ~20 Ko |

Observations à formuler :

1. Quelle cible produit le fichier le plus volumineux et pourquoi ?
2. Quelle cible produit le fichier le plus compact et pourquoi ?
3. Le traitement du signal est-il identique dans les trois cas ?

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Créer le dossier et le fichier source, puis compiler vers les trois cibles.

```bash
# Créer le dossier de travail et s'y placer
mkdir -p ~/faust-exercice-architectures
cd ~/faust-exercice-architectures

# Créer exo-multi-cible.dsp avec le contenu de l'énoncé, puis compiler :
faust2jaqt exo-multi-cible.dsp          # Cible 1 : Application Qt
faust2lv2 exo-multi-cible.dsp           # Cible 2 : Plugin LV2
faust2wasm exo-multi-cible.dsp          # Cible 3 : WebAssembly
```

**Étape 2** : Vérifier les fichiers générés pour chaque cible.

```bash
# Application Qt : 1 exécutable
ls -lh exo-multi-cible

# Plugin LV2 : 3 fichiers (manifest.ttl, .ttl, .so)
ls -lh exo-multi-cible.lv2/

# WebAssembly : 3 fichiers (.wasm, .js, .html)
ls -lh exo-multi-cible-wasm/
```

**Étape 3** : Remplir le tableau comparatif.

| Cible | Commande | Fichiers générés | Taille totale |
| --- | --- | --- | --- |
| Application Qt | `faust2jaqt exo-multi-cible.dsp` | 1 exécutable (~210 Ko) | ~210 Ko |
| Plugin LV2 | `faust2lv2 exo-multi-cible.dsp` | 3 fichiers (.so ~145 Ko + 2 .ttl ~5 Ko) | ~150 Ko |
| WebAssembly | `faust2wasm exo-multi-cible.dsp` | 3 fichiers (.wasm ~3 Ko + .js ~9 Ko + .html ~2 Ko) | ~14 Ko |

**Étape 4** : Répondre aux questions d'observation.

1. **Plus volumineux** : l'application Qt (~210 Ko) car elle inclut l'interface graphique Qt et le pilote JACK.
2. **Plus compact** : WebAssembly (~14 Ko) car le format `.wasm` est un bytecode dense et l'UI est en HTML/JS.
3. **Signal identique ?** Oui. Le traitement est mathématiquement identique. Seul le conteneur change.

---

## Navigation

→ Fiche suivante : **[02 - Plugins audio VST/AU/LV2](02-plugins-audio-vst-au-lv2.md)**
