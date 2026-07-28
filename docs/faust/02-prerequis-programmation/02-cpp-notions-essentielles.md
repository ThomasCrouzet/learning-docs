---
tags:
  - Faust
  - Débutant
  - Concept
description: "C++ notions essentielles - comprendre le code C++ généré par le compilateur Faust"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 3
cursus: "Phase 2 - Prérequis programmation"
---

# 02 - C++ : notions essentielles

> **En bref** : À la fin de cette fiche, tu sauras lire et comprendre le code C++ généré par le compilateur Faust, et compiler un projet C++ simple utilisant du code Faust. Lecture estimée : 60 min.


## Prérequis

- [Fiche 01 - Programmation fonctionnelle - concepts](01-programmation-fonctionnelle-concepts.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et comprendre le code C++ généré par le compilateur Faust, et compiler un projet C++ simple utilisant du code Faust.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi C++ pour Faust ?

**Définition** : C++ est un langage compilé et performant utilisé pour le traitement audio temps réel. Le compilateur Faust traduit le code Faust en C++ (entre autres cibles) pour produire des programmes audio exécutables.

**Le problème que C++ résout dans le contexte Faust** :

Sans connaître C++, voici les problèmes rencontrés :

1. **Code généré illisible** : Le compilateur Faust produit du C++ que tu ne peux pas comprendre sans notions de ce langage.
2. **Debug impossible** : Si le programme audio ne fonctionne pas, tu ne peux pas lire le code intermédiaire pour trouver l'erreur.
3. **Intégration bloquée** : Pour intégrer du code Faust dans un projet C++ (plugin audio, application), tu dois comprendre les deux langages.

**Comment C++ résout ces problèmes** :

| Problème | Solution apportée par la connaissance de C++ |
| -------- | --------------------------------------------- |
| Code généré illisible | Tu sais lire les types, fonctions et classes du code produit |
| Debug impossible | Tu peux tracer le flux d'exécution dans le code généré |
| Intégration bloquée | Tu peux modifier et adapter le code C++ pour ton projet |

**Analogie concrète** : Faust est comme un traducteur automatique qui convertit un texte français en anglais. Même si tu écris en français (Faust), le résultat final est en anglais (C++). Si la traduction contient une erreur, tu dois comprendre l'anglais pour la corriger. Tu n'as pas besoin de le maîtriser comme un natif, mais tu dois savoir le lire.

**Ce que cette fiche n'est PAS** :

- Cette fiche n'est pas un cours complet de C++. Elle couvre uniquement les notions nécessaires pour lire le code C++ généré par Faust.
- Cette fiche n'apprend pas à écrire des programmes C++ complexes. L'objectif est la lecture, pas l'écriture avancée.

---

### Qu'est-ce que la compilation et le linking ?

**Définition** : La compilation transforme du code source (fichier `.cpp`) en code machine exécutable par le processeur, en trois étapes : préprocesseur, compilateur et linker.

**Le problème que la compilation résout** :

Sans compilation, voici les problèmes rencontrés :

1. **Le processeur ne comprend pas le texte** : Un fichier `.cpp` est du texte. Le processeur ne sait exécuter que des instructions binaires.
2. **Pas de vérification** : Les erreurs de syntaxe ou de type ne sont détectées qu'à l'exécution.
3. **Performance insuffisante** : Un langage interprété traduit chaque ligne à chaque exécution. Pour le traitement audio temps réel, il faut la vitesse native du code compilé.

**Les trois étapes de la compilation** :

| Étape | Outil | Entrée | Sortie | Rôle |
| ----- | ----- | ------ | ------ | ---- |
| 1. Préprocesseur | `cpp` | `.cpp` / `.h` | `.cpp` (expansé) | Résout les `#include` et `#define` |
| 2. Compilation | `g++` / `clang++` | `.cpp` (expansé) | `.o` (objet) | Traduit le C++ en code machine |
| 3. Linking | `ld` (via `g++`) | `.o` (objets) | exécutable | Assemble les fichiers objets en un programme |

**Les types de fichiers C++** :

| Extension | Nom | Rôle |
| --------- | --- | ---- |
| `.h` ou `.hpp` | Header (en-tête) | Déclare les fonctions, classes et types |
| `.cpp` | Source | Contient le code exécutable |
| `.o` | Objet | Code machine intermédiaire |
| (sans extension) | Exécutable | Le programme final |

**Analogie concrète** : Imagine la construction d'un meuble en kit. Le préprocesseur rassemble toutes les pièces de différentes boîtes. Le compilateur façonne chaque pièce selon les plans. Le linker assemble les pièces pour former le meuble complet.

**Ce que la compilation n'est PAS** :

- La compilation n'est pas l'exécution. Compiler produit un fichier exécutable, mais ne le lance pas.
- La compilation n'est pas l'interprétation. Python est interprété (traduit à la volée). En C++, tout est traduit d'abord, puis exécuté.

---

### Qu'est-ce que les types fondamentaux ?

**Définition** : Les types fondamentaux définissent la nature d'une donnée en mémoire : nombre entier, nombre à virgule, booléen.

**Le problème que les types résolvent** :

Sans types, voici les problèmes rencontrés :

1. **Mémoire gaspillée** : Le programme ne sait pas combien de mémoire réserver.
2. **Opérations incorrectes** : Rien n'empêche d'additionner un nombre et un texte.
3. **Précision inadaptée** : En audio, il faut choisir entre précision (`double`) et performance (`float`).

**Les types fondamentaux en C++** :

| Type | Taille | Usage en audio |
| ---- | ------ | -------------- |
| `int` | 4 octets | Compteurs, index de buffer, fréquence d'échantillonnage |
| `float` | 4 octets (~7 chiffres) | Échantillons audio (usage standard) |
| `double` | 8 octets (~15 chiffres) | Échantillons audio (haute précision) |
| `bool` | 1 octet | État d'un bouton, bypass on/off |

**Le choix float vs double en audio** :

| Critère | `float` (32 bits) | `double` (64 bits) |
| ------- | ------------------ | ------------------- |
| Performance CPU | Plus rapide | Plus lent (deux fois plus de données) |
| Usage courant | Plugins audio, synthétiseurs | Filtres haute précision, accumulation longue |

Par défaut, Faust génère du code utilisant `FAUSTFLOAT` (configurable, souvent `float`).

**Analogie concrète** : Les types sont comme des contenants dans une cuisine. Un verre à shot (`bool`) contient vrai ou faux. Un verre standard (`float`) suffit pour la plupart des usages. Un grand pichet (`double`) contient deux fois plus avec plus de précision, mais prend plus de place.

**Ce que les types ne sont PAS** :

- Les types ne sont pas optionnels en C++. Contrairement à Python (`x = 42`), en C++ tu écris `int x = 42`.
- Un `float` n'est pas exact. `0.1` est approximé (`0.100000001490...`). Rarement audible, mais important pour le debug.

---

### Qu'est-ce que les pointeurs et les références ?

**Définition** : Un pointeur contient l'adresse mémoire d'une autre variable. Une référence est un alias pour une variable existante. Les deux permettent d'accéder à une donnée sans la copier.

**Le problème que les pointeurs résolvent** :

Sans pointeurs, voici les problèmes rencontrés :

1. **Copie coûteuse** : Passer un buffer de 44100 échantillons nécessiterait de tout copier à chaque appel.
2. **Pas de modification externe** : `compute()` doit écrire directement dans le buffer de sortie.
3. **Pas de tableaux dynamiques** : Les buffers audio ont une taille variable selon le bloc.

**Syntaxe** :

```cpp
int valeur = 42;
int* pointeur = &valeur;  // pointeur contient l'adresse de valeur
int& reference = valeur;  // reference est un alias de valeur
```

**Les pointeurs dans le code Faust généré** :

```cpp
virtual void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs) {
    FAUSTFLOAT* input0 = inputs[0];   // Buffer d'entrée canal gauche
    FAUSTFLOAT* output0 = outputs[0]; // Buffer de sortie canal gauche
    for (int i = 0; i < count; i++) {
        output0[i] = input0[i] * 0.5f; // Traite chaque échantillon
    }
}
```

**Lecture de `FAUSTFLOAT**`** :

| Expression | Signification |
| ---------- | ------------- |
| `FAUSTFLOAT` | Un type (float ou double, configurable) |
| `FAUSTFLOAT*` | Un pointeur vers un buffer audio (un canal) |
| `FAUSTFLOAT**` | Un tableau de buffers (tous les canaux) |
| `outputs[0][i]` | Le i-eme échantillon du premier canal de sortie |

**Analogie concrète** : Un pointeur est comme une adresse postale. L'adresse est courte, mais donne accès à tout le contenu de la maison. Quand Faust transmet un buffer à `compute()`, il envoie l'adresse, pas les 44100 échantillons.

**Ce que les pointeurs ne sont PAS** :

- Un pointeur n'est pas la donnée elle-même. `int* p` contient une adresse, pas un entier.
- Un pointeur peut être `nullptr` (nul). Y accéder provoque un crash (segmentation fault).

---

### Qu'est-ce qu'une classe ?

**Définition** : Une classe regroupe des données (attributs) et des fonctions (méthodes). En C++, `struct` et `class` sont quasi identiques : seule la visibilité par défaut diffère (publique pour `struct`, privée pour `class`).

**Le problème que les classes résolvent** :

Sans classes, voici les problèmes rencontrés :

1. **Données éparpillées** : L'état du processeur audio serait dans des variables globales sans lien.
2. **Pas d'encapsulation** : N'importe quel code pourrait modifier l'état interne.
3. **Pas de réutilisation** : Impossible de créer plusieurs instances du même processeur.

**Exemple de classe C++** :

```cpp
class MonProcesseur {
private:
    int fSampleRate;
    float fGain;
public:
    MonProcesseur() { fSampleRate = 44100; fGain = 1.0f; } // Constructeur
    void init(int sr) { fSampleRate = sr; }
    void compute(int count, float** inputs, float** outputs) {
        float* in = inputs[0];
        float* out = outputs[0];
        for (int i = 0; i < count; i++) { out[i] = in[i] * fGain; }
    }
};
```

**La classe DSP générée par Faust** :

Chaque programme Faust produit une classe avec ces méthodes :

| Méthode | Rôle |
| ------- | ---- |
| `getNumInputs()` | Nombre d'entrées audio |
| `getNumOutputs()` | Nombre de sorties audio |
| `init(int sample_rate)` | Initialise le processeur |
| `buildUserInterface(UI* ui)` | Déclare les paramètres (sliders, boutons) |
| `compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs)` | Traite un bloc d'échantillons |

**Analogie concrète** : Une classe est comme le plan d'une pédale d'effet guitare. Le plan décrit les composants (attributs) et les fonctions (méthodes). Tu peux fabriquer autant de pédales identiques que tu veux, chacune indépendante.

**Ce qu'une classe n'est PAS** :

- Une classe n'est pas un objet. La classe est le plan, l'objet est la chose construite. `MonProcesseur` est la classe, `MonProcesseur proc;` crée l'objet.

---

### Qu'est-ce que les templates (aperçu) ?

**Définition** : Un template permet d'écrire une fonction ou classe qui fonctionne avec n'importe quel type, sans réécrire le code pour chaque type.

**Le problème que les templates résolvent** :

Sans templates, tu devrais écrire une version pour `float`, une autre pour `double`, etc.

**Exemple** :

```cpp
// Avec template : une seule fonction générique
template <typename T>
T maximum(T a, T b) { return (a > b) ? a : b; }

float x = maximum<float>(3.14f, 2.71f);   // T = float
double y = maximum<double>(3.14, 2.71);    // T = double
```

Le code Faust généré utilise dans certains cas des templates pour les fonctions utilitaires :

```cpp
// Cas de base : N = 0 → résultat 1 (x^0 = 1)
template <>
inline float faustpower<0>(float x) { return 1.0f; }

// Cas récursif : x^N = x^(N-1) * x
template <int N>
inline float faustpower(float x) { return faustpower<N - 1>(x) * x; }
// faustpower<3>(x) calcule x * x * x
```

**Analogie concrète** : Un template est comme un emporte-pièce en cuisine. Le même moule en forme d'étoile découpe de la pâte à biscuit, de la pâte à modeler ou du fromage. La forme (le code) est identique, seul le matériau (le type) change.

Tu n'as pas besoin de créer des templates. Tu dois juste les reconnaître dans le code généré.

---

### Qu'est-ce que CMake ?

**Définition** : CMake génère les fichiers de configuration nécessaires pour compiler un projet C++. Il remplace les Makefiles manuels par un fichier portable `CMakeLists.txt`.

**Le problème que CMake résout** :

Sans CMake, voici les problèmes rencontrés :

1. **Commandes trop longues** : Un projet multi-fichiers avec bibliothèques externes nécessite des commandes `g++` difficiles à maintenir.
2. **Pas de portabilité** : Un Makefile Linux ne fonctionne pas sur macOS ou Windows.
3. **Dépendances manuelles** : Trouver les bibliothèques (JACK, PortAudio) varie selon le système.

**Exemple de `CMakeLists.txt` pour un projet Faust** :

```text
cmake_minimum_required(VERSION 3.20)
project(FaustExample)
add_executable(faust_example main.cpp)
target_link_libraries(faust_example jack)
```

**Commandes terminal** :

```bash
mkdir build && cd build  # Créer un dossier de build
cmake ..                 # Générer les fichiers de compilation
cmake --build .          # Compiler le projet
```

**Analogie concrète** : CMake est comme un chef de chantier. Tu lui donnes les plans (`CMakeLists.txt`) et la liste des matériaux (bibliothèques). Il organise le travail et distribue les tâches au compilateur.

**Ce que CMake n'est PAS** :

- CMake n'est pas un compilateur. Il génère des Makefiles utilisés par `g++`/`clang++`.
- CMake n'est pas obligatoire pour Faust. Tu peux compiler directement avec `g++`. CMake devient utile quand le projet grossit.

---

### Comment lire du code C++ généré par Faust ?

**Définition** : Le code C++ généré par Faust suit une structure standard et prévisible, avec les mêmes méthodes quel que soit l'algorithme audio.

**La structure type** :

| Section | Repère dans le code |
| ------- | ------------------- |
| Classe DSP | `class mydsp : public dsp` |
| Attributs | `int fSampleRate;`, `float fRec0[2];` |
| `init()` | Fréquence d'échantillonnage, reset des variables |
| `buildUserInterface()` | `addHorizontalSlider`, `addButton`, etc. |
| `compute()` | La boucle `for` qui traite chaque échantillon |

**Exemple complet : Faust vers C++** :

```faust
// volume.dsp - Contrôle de volume simple
import("stdfaust.lib");
gain = hslider("Gain", 0.5, 0, 1, 0.01);
process = _ * gain;
```

Code C++ généré (simplifié) :

```cpp
class mydsp : public dsp {
private:
    int fSampleRate;
    FAUSTFLOAT fHslider0;  // Slider "Gain"
public:
    int getNumInputs() { return 1; }   // 1 entrée (le _)
    int getNumOutputs() { return 1; }  // 1 sortie

    void init(int sample_rate) {
        fSampleRate = sample_rate;
        fHslider0 = FAUSTFLOAT(0.5);  // Valeur par défaut
    }

    void buildUserInterface(UI* ui_interface) {
        ui_interface->addHorizontalSlider("Gain",
            &fHslider0, FAUSTFLOAT(0.5),
            FAUSTFLOAT(0), FAUSTFLOAT(1), FAUSTFLOAT(0.01));
    }

    void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs) {
        FAUSTFLOAT* input0 = inputs[0];
        FAUSTFLOAT* output0 = outputs[0];
        float fSlow0 = float(fHslider0);  // Lit le slider une fois par bloc
        for (int i = 0; i < count; i++) {
            output0[i] = FAUSTFLOAT(float(input0[i]) * fSlow0);
        }
    }
};
```

**Correspondance Faust vers C++** :

| Code Faust | Code C++ généré |
| ---------- | --------------- |
| `hslider("Gain", 0.5, 0, 1, 0.01)` | `addHorizontalSlider(...)` dans `buildUserInterface()` |
| `_ * gain` | `input0[i] * fSlow0` dans `compute()` |
| `process = ...` | La méthode `compute()` entière |

**Variables nommées du code généré** :

| Préfixe | Rôle | Exemple |
| ------- | ---- | ------- |
| `fConst` | Constante pré-calculée dans `init()` | `fConst0 = 2*PI/SR` |
| `fSlow` | Valeur UI lue une fois par bloc dans `compute()` | `fSlow0 = float(fHslider0)` |
| `fRec` | Mémoire (état précédent pour les opérateurs récursifs) | `fRec0[2]` |
| `fHslider` | Variable liée à un slider horizontal | `fHslider0` |

**Analogie concrète** : Lire du code C++ généré par Faust est comme lire la partition d'orchestre d'une mélodie que tu as sifflée. La mélodie est la même, mais la notation est plus détaillée et technique.

---

## Étapes Pratiques

### Étape 1 : Compiler un Hello World en C++

Crée un fichier `hello.cpp` :

```cpp
#include <iostream>
int main() {
    std::cout << "Hello, Faust world!" << std::endl;
    return 0;
}
```

Compile et exécute :

```bash
g++ -o hello hello.cpp
./hello
```

**Résultat attendu** :

```text
Hello, Faust world!
```

---

### Étape 2 : Simuler un buffer audio avec types et pointeurs

Crée un fichier `types_audio.cpp` :

```cpp
#include <iostream>
#include <cmath>

int main() {
    int sample_rate = 44100;
    float frequency = 440.0f;
    double phase = 0.0;
    const int buffer_size = 8;
    float buffer[buffer_size];
    float* output = buffer;  // Pointeur vers le buffer
    double phase_increment = 2.0 * M_PI * frequency / sample_rate;

    for (int i = 0; i < buffer_size; i++) {
        output[i] = static_cast<float>(sin(phase));
        phase += phase_increment;
    }

    std::cout << "Buffer audio (8 echantillons de sin 440 Hz) :" << std::endl;
    for (int i = 0; i < buffer_size; i++) {
        std::cout << "  echantillon[" << i << "] = " << output[i] << std::endl;
    }
    return 0;
}
```

```bash
g++ -o types_audio types_audio.cpp
./types_audio
```

**Résultat attendu** :

```text
Buffer audio (8 echantillons de sin 440 Hz) :
  echantillon[0] = 0
  echantillon[1] = 0.0626697
  echantillon[2] = 0.125127
  echantillon[3] = 0.187161
  echantillon[4] = 0.248561
  echantillon[5] = 0.30912
  echantillon[6] = 0.368632
  echantillon[7] = 0.426894
```

---

### Étape 3 : Lire un fichier C++ généré par Faust

Crée un fichier Faust `sinus.dsp` :

```faust
import("stdfaust.lib");
freq = hslider("Frequence", 440, 20, 20000, 1);
gain = hslider("Volume", 0.5, 0, 1, 0.01);
process = os.osc(freq) * gain;
```

Génère le C++ (si Faust est installé) :

```bash
faust -lang cpp -o sinus.cpp sinus.dsp
```

Sinon, voici le code généré simplifié :

```cpp
class mydsp : public dsp {
private:
    int fSampleRate;
    float fConst0;           // 2*PI/SR
    float fRec0[2];          // Mémoire de l'oscillateur
    FAUSTFLOAT fHslider0;    // Slider "Frequence"
    FAUSTFLOAT fHslider1;    // Slider "Volume"
public:
    int getNumInputs() { return 0; }  // Synthétiseur : pas d'entrée
    int getNumOutputs() { return 1; } // Mono

    void init(int sample_rate) {
        fSampleRate = sample_rate;
        fConst0 = 6.2831855f / float(fSampleRate);
        fRec0[0] = 0.0f; fRec0[1] = 0.0f;
        fHslider0 = FAUSTFLOAT(440);
        fHslider1 = FAUSTFLOAT(0.5);
    }

    void buildUserInterface(UI* ui_interface) {
        ui_interface->addHorizontalSlider("Frequence",
            &fHslider0, FAUSTFLOAT(440),
            FAUSTFLOAT(20), FAUSTFLOAT(20000), FAUSTFLOAT(1));
        ui_interface->addHorizontalSlider("Volume",
            &fHslider1, FAUSTFLOAT(0.5),
            FAUSTFLOAT(0), FAUSTFLOAT(1), FAUSTFLOAT(0.01));
    }

    void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs) {
        FAUSTFLOAT* output0 = outputs[0];
        float fSlow0 = fConst0 * float(fHslider0); // Incrément de phase
        float fSlow1 = float(fHslider1);            // Volume
        for (int i = 0; i < count; i++) {
            fRec0[0] = fSlow0 + fRec0[1];           // Accumule la phase
            output0[i] = FAUSTFLOAT(std::sin(fRec0[0]) * fSlow1);
            fRec0[1] = fRec0[0];                    // Sauvegarde
        }
    }
};
```

---

### Étape 4 : Identifier les parties clés

Dans le code généré, repère ces éléments :

- **`init()`** : `fSampleRate` (fréquence d'échantillonnage), `fConst0` (constante pré-calculée), `fRec0` (mémoire remise à zéro)
- **`compute()`** : `fSlow0`/`fSlow1` (valeurs UI lues une fois par bloc), la boucle `for` (traitement échantillon par échantillon)
- **`buildUserInterface()`** : chaque `addHorizontalSlider` correspond à un `hslider` Faust. Le `&fHslider0` est un pointeur : l'interface modifie directement cette variable

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `g++ -o programme source.cpp` | Compile un fichier C++ en exécutable |
| `g++ -std=c++17 -Wall -o prog source.cpp` | Compile en C++17 avec avertissements |
| `faust -lang cpp -o sortie.cpp source.dsp` | Génère du C++ depuis un fichier Faust |
| `cmake .. && cmake --build .` | Configure et compile un projet CMake |
| `clang++ -o prog source.cpp` | Alternative a g++ (compilateur Clang) |

---

## Pièges Fréquents

### Piège 1 : Oublier le point-virgule

**Problème** : Chaque instruction C++ se termine par `;`. L'oublier produit une erreur souvent signalée sur la ligne suivante.

**Solution** : Si l'erreur pointe vers une ligne correcte, vérifie la ligne précédente.

```cpp
// ❌ Point-virgule manquant
int x = 42
float y = 3.14f;  // L'erreur sera signalée ici

// ✅ Correct
int x = 42;
float y = 3.14f;
```

---

### Piège 2 : Confondre `=` et `==`

**Problème** : `=` est l'affectation, `==` est la comparaison. Les confondre donne un comportement incorrect silencieux.

**Solution** : Dans un `if`, utilise toujours `==`.

---

### Piège 3 : Accéder à un tableau hors limites

**Problème** : `buffer[8]` dans un tableau de taille 8 ne produit pas toujours d'erreur en C++. Le programme lit une zone mémoire aléatoire.

**Solution** : L'index doit être entre 0 et `taille - 1`.

---

### Piège 4 : Ne pas initialiser les variables

**Problème** : Une variable locale non initialisée contient une valeur aléatoire. En audio, cela produit un "pop" ou du bruit.

**Solution** : Initialise toujours tes variables. Le code Faust généré le fait dans `init()`.

---

### Piège 5 : Mélanger `float` et `double`

**Problème** : Mélanger les types provoque des conversions implicites qui ralentissent le traitement.

**Solution** : Utilise le suffixe `f` pour les littéraux float : `0.5f` au lieu de `0.5`.

---

## Checklist de Validation

- [ ] J'ai compilé et exécuté un programme C++ Hello World
- [ ] Je connais la différence entre `int`, `float`, `double` et `bool`
- [ ] Je comprends ce qu'est un pointeur et pourquoi `FAUSTFLOAT**` représente les buffers audio
- [ ] Je sais ce que font `init()`, `compute()` et `buildUserInterface()` dans le code Faust généré
- [ ] Je sais identifier `fSlow0`, `fRec0`, `fConst0` et leur rôle
- [ ] Je comprends les bases de CMake (`CMakeLists.txt`, `add_executable`, `cmake --build`)

---

## Exercice Pratique

**Énoncé** : Analyse le code C++ généré par Faust pour un oscillateur sinusoïdal stéréo. Identifie la méthode `compute()`, les buffers d'entrée/sortie, les paramètres UI et la méthode `init()`.

Code Faust source :

```faust
import("stdfaust.lib");
freq = hslider("Frequence [unit:Hz]", 440, 20, 20000, 1);
vol = hslider("Volume [unit:dB]", -6, -60, 0, 0.1);
gain = ba.db2linear(vol);
sinus = os.osc(freq) * gain;
process = sinus, sinus;
```

Code C++ généré (simplifié) :

```cpp
class mydsp : public dsp {
private:
    int fSampleRate;
    float fConst0;
    FAUSTFLOAT fHslider0;
    float fRec0[2];
    FAUSTFLOAT fHslider1;
public:
    int getNumInputs() { return 0; }
    int getNumOutputs() { return 2; }

    void init(int sample_rate) {
        fSampleRate = sample_rate;
        fConst0 = 6.2831855f / float(fSampleRate);
        fHslider0 = FAUSTFLOAT(440);
        fRec0[0] = 0.0f; fRec0[1] = 0.0f;
        fHslider1 = FAUSTFLOAT(-6);
    }

    void buildUserInterface(UI* ui_interface) {
        ui_interface->addHorizontalSlider("Frequence",
            &fHslider0, FAUSTFLOAT(440),
            FAUSTFLOAT(20), FAUSTFLOAT(20000), FAUSTFLOAT(1));
        ui_interface->addHorizontalSlider("Volume",
            &fHslider1, FAUSTFLOAT(-6),
            FAUSTFLOAT(-60), FAUSTFLOAT(0), FAUSTFLOAT(0.1));
    }

    void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs) {
        FAUSTFLOAT* output0 = outputs[0];
        FAUSTFLOAT* output1 = outputs[1];
        float fSlow0 = fConst0 * float(fHslider0);
        float fSlow1 = std::pow(10.0f, 0.05f * float(fHslider1));
        for (int i = 0; i < count; i++) {
            fRec0[0] = fSlow0 + fRec0[1];
            float fTemp0 = std::sin(fRec0[0]) * fSlow1;
            output0[i] = FAUSTFLOAT(fTemp0);
            output1[i] = FAUSTFLOAT(fTemp0);
            fRec0[1] = fRec0[0];
        }
    }
};
```

**Indications** :

- Combien d'entrées et de sorties ? Pourquoi ?
- Dans `init()`, identifie chaque variable et son rôle
- Dans `compute()`, que représente `fSlow1` ? Quel lien avec `ba.db2linear(vol)` ?
- Pourquoi `fRec0` a 2 éléments ?
- Pourquoi `output0[i]` et `output1[i]` reçoivent la même valeur ?

**Résultat attendu** : Un document avec les réponses aux cinq questions ci-dessus.

---

## Solution de l'Exercice

> **Note** : Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Entrées/sorties** : 0 entrée (synthétiseur, pas de `_`), 2 sorties (stéréo via `process = sinus, sinus;` avec l'opérateur parallèle `,`).

**Variables dans `init()`** :

| Variable | Rôle |
| -------- | ---- |
| `fSampleRate` | Fréquence d'échantillonnage |
| `fConst0` | `2*PI/SR`, facteur de conversion fréquence vers incrément de phase |
| `fHslider0` | Slider "Fréquence" (440 Hz par défaut) |
| `fHslider1` | Slider "Volume" (-6 dB par défaut) |
| `fRec0[2]` | Mémoire de l'oscillateur (phase actuelle et précédente) |

`fConst0` est dans `init()` et non `compute()` car la fréquence d'échantillonnage ne change jamais. Le calculer une seule fois est une optimisation.

**`fSlow1` et `ba.db2linear()`** :

```cpp
float fSlow1 = std::pow(10.0f, 0.05f * float(fHslider1));
// = 10^(volume_dB / 20) = conversion dB vers linéaire
// -6 dB → 10^(-0.3) ≈ 0.5012 (environ moitié du volume)
```

C'est exactement la formule de `ba.db2linear(vol)`. Les variables `fSlow` sont calculées une fois par bloc (avant la boucle `for`), pas à chaque échantillon.

**`fRec0` avec 2 éléments** : l'oscillateur accumule la phase. Il a besoin de la valeur précédente (`fRec0[1]`) pour calculer l'actuelle (`fRec0[0]`). Cela correspond à l'opérateur récursif `~` utilisé en interne par `os.osc()`.

**Même valeur sur les deux sorties** : `process = sinus, sinus;` envoie le même signal sur les deux canaux. Le compilateur optimise en calculant `fTemp0` une seule fois.

---

## Navigation

← Fiche précédente : **[01 - Programmation fonctionnelle - concepts](01-programmation-fonctionnelle-concepts.md)**

→ Fiche suivante : **[03 - Environnement et outils](03-environnement-outils.md)**
