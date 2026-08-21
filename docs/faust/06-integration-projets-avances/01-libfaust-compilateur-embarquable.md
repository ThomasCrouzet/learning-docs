---
tags:
  - Faust
  - Avancé
  - Concept
description: "libfaust compilateur embarquable - API libfaust, compilation JIT via LLVM, interpréteur et hot-reloading"
estimated_time: "90 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 6 - Intégration et projets avancés"
id: "specializations.faust.integration.libfaust-compilateur-embarquable"
course_id: "specializations.faust"
module_id: "specializations.faust.integration"
content_type: "lesson"
order: 1
---

# 01 - libfaust : compilateur embarquable

> **En bref** : À la fin de cette fiche, tu sauras utiliser libfaust pour compiler du code Faust à la volée dans une application C++, créer des instances DSP et implémenter le hot-reloading. Lecture estimée : 90 min.


## Prérequis

- [Fiche 01 - Système d'architectures Faust](../05-deploiement-architectures/01-systeme-architectures-faust.md)
- [Fiche 02 - C++ : notions essentielles](../02-prerequis-programmation/02-cpp-notions-essentielles.md)
- Savoir compiler un projet C++ avec CMake (commandes `cmake` et `make`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser libfaust pour compiler du code Faust à la volée dans une application C++, créer des instances DSP et implémenter le hot-reloading.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que libfaust ?

**Définition** : libfaust est le compilateur Faust sous forme de bibliothèque C++ embarquable. Au lieu d'utiliser le compilateur Faust en ligne de commande (`faust`), tu peux intégrer le compilateur directement dans ton application C++ et compiler du code Faust à la volée (au runtime).

**Le problème que libfaust résout** :

Sans libfaust, voici les problèmes rencontrés :

1. **Compilation statique uniquement** : Pour modifier un algorithme DSP, tu dois fermer l'application, recompiler avec `faust`, puis relancer. Chaque modification impose un cycle complet compilation/linkage/exécution.

2. **Pas de personnalisation utilisateur** : L'utilisateur final de ton application ne peut pas écrire ses propres algorithmes Faust. Le DSP est figé à la compilation.

3. **Pas d'environnement interactif** : Impossible de proposer un éditeur de code Faust intégré à une application audio (comme un synthétiseur modulaire virtuel).

**Comment libfaust résout ces problèmes** :

| Problème | Solution apportée par libfaust |
| -------- | ------------------------------ |
| Compilation statique uniquement | Le code Faust est compilé à la volée pendant l'exécution de l'application |
| Pas de personnalisation utilisateur | L'utilisateur peut écrire du code Faust et l'exécuter immédiatement |
| Pas d'environnement interactif | Tu peux construire un éditeur de code avec prévisualisation audio en temps réel |

**Analogie concrète** : Sans libfaust, modifier un effet audio revient à éteindre un amplificateur, démonter un circuit imprimé, remplacer un composant, remonter le tout, puis rallumer. Avec libfaust, c'est comme si l'amplificateur pouvait reconfigurer ses circuits en temps réel pendant qu'il joue.

**Ce que libfaust n'est PAS** :

- libfaust n'est pas un runtime audio. Il ne gère pas les entrées/sorties audio (JACK, ALSA, CoreAudio). Il compile du code Faust et produit des objets DSP que ton application doit connecter elle-même à un driver audio.
- libfaust n'est pas un éditeur de code. Il ne fournit pas d'interface graphique. C'est une bibliothèque C++ que tu intègres dans ton propre programme.

---

### Qu'est-ce que la compilation JIT via LLVM ?

**Définition** : La compilation JIT (Just-In-Time) est une technique qui compile du code source en code machine natif pendant l'exécution du programme. libfaust utilise LLVM comme infrastructure de compilation pour transformer le code Faust en instructions machine optimisées, directement en mémoire, sans écrire de fichier intermédiaire sur le disque.

**Le problème que la compilation JIT résout** :

Sans compilation JIT, voici les problèmes rencontrés :

1. **Compilation lente** : Le cycle classique (code source -> C++ -> compilation GCC/Clang -> exécutable) prend plusieurs secondes à plusieurs minutes.

2. **Fichiers intermédiaires** : La compilation classique génère des fichiers `.cpp`, `.o`, puis un exécutable. Gérer ces fichiers temporaires complique l'intégration.

3. **Performance de l'interprétation** : Interpréter le code Faust au lieu de le compiler est plus simple, mais 2 à 5 fois plus lent que le code natif. Pour l'audio temps réel, cette lenteur peut causer des coupures.

**Comment la compilation JIT résout ces problèmes** :

| Problème | Solution apportée par la compilation JIT |
| -------- | ---------------------------------------- |
| Compilation lente | LLVM compile en quelques centaines de millisecondes (typiquement 100-500 ms) |
| Fichiers intermédiaires | Tout se passe en mémoire, aucun fichier sur le disque |
| Performance de l'interprétation | Le code JIT atteint la même performance que le code compilé statiquement |

**Analogie concrète** : Imagine un traducteur simultané (JIT) versus un traducteur qui écrit d'abord la traduction sur papier (compilation classique). Le traducteur simultané produit le résultat immédiatement et avec la même qualité. Le traducteur papier est plus lent car il passe par une étape écrite intermédiaire, mais le résultat final est identique.

**Ce que la compilation JIT n'est PAS** :

- Le JIT n'est pas de l'interprétation. L'interprétation exécute le code instruction par instruction à chaque appel. Le JIT compile une fois en code machine natif, puis exécute ce code natif aussi vite qu'un programme compilé classiquement.
- Le JIT n'est pas instantané. La compilation elle-même prend du temps (quelques centaines de millisecondes). C'est après la compilation que l'exécution est rapide.

**Comparaison des modes d'exécution** :

| Mode | Temps de compilation | Performance d'exécution | Dépendances |
| ---- | -------------------- | ----------------------- | ----------- |
| Compilation classique (faust -> C++ -> gcc) | Secondes à minutes | Maximale | GCC ou Clang installé |
| Compilation JIT (libfaust + LLVM) | 100-500 ms | Maximale (identique) | libfaust + LLVM |
| Interpréteur Faust | 0 ms (pas de compilation) | 2-5x plus lent | libfaust seul |

---

### Qu'est-ce qu'une DSP Factory ?

**Définition** : Une DSP Factory est l'objet retourné par libfaust après la compilation d'un code Faust. Elle contient le code compilé (sous forme de code machine JIT ou de bytecode interpréteur) et peut créer autant d'instances DSP indépendantes que nécessaire.

**Le problème que la DSP Factory résout** :

Sans DSP Factory, voici les problèmes rencontrés :

1. **Recompilation inutile** : Si tu veux jouer 8 voix du même synthétiseur, tu devrais compiler le code Faust 8 fois. Chaque compilation consomme du temps et de la mémoire.

2. **Pas de séparation compilation/exécution** : Sans factory, le résultat de la compilation serait directement une instance jouable. Tu ne pourrais pas créer plusieurs instances indépendantes à partir d'une seule compilation.

3. **Gestion mémoire complexe** : Sans objet central, chaque instance devrait gérer sa propre copie du code compilé.

**Comment la DSP Factory résout ces problèmes** :

| Problème | Solution apportée par la DSP Factory |
| -------- | ------------------------------------ |
| Recompilation inutile | Une seule compilation produit une factory. La factory crée N instances. |
| Pas de séparation compilation/exécution | La factory (compilation) est séparée des instances (exécution). |
| Gestion mémoire complexe | La factory centralise le code compilé. Les instances ne contiennent que leur état (mémoires, paramètres). |

**Analogie concrète** : La DSP Factory fonctionne comme un moule dans une usine. Fabriquer le moule (compilation) prend du temps et coûte cher. Mais une fois le moule prêt, tu peux produire des centaines de pièces identiques (instances DSP) rapidement et à faible coût. Chaque pièce est indépendante (son propre état), mais elles sont toutes fabriquées à partir du même moule.

**Ce qu'une DSP Factory n'est PAS** :

- Une DSP Factory n'est pas une instance jouable. Tu ne peux pas appeler `compute()` directement sur une factory. Tu dois d'abord créer une instance avec `createDSPInstance()`.
- Une DSP Factory n'est pas liée à un driver audio. Elle contient uniquement le code compilé. La connexion au système audio se fait au niveau de l'instance.

**La fonction de compilation** :

```cpp
// createDSPFactoryFromString() compile du code Faust en DSP Factory
// Paramètres :
//   - "MonSynth"       : nom du programme (identifiant)
//   - code_faust       : le code source Faust (chaîne de caractères)
//   - argc, argv       : arguments du compilateur (nombre et tableau)
//   - ""               : cible (vide = machine hôte)
//   - error_msg        : message d'erreur si la compilation échoue
//   - optimize         : niveau d'optimisation (-1 = défaut)
llvm_dsp_factory* factory = createDSPFactoryFromString(
    "MonSynth",         // Nom du programme
    code_faust,         // Code source Faust
    0, nullptr,         // Pas d'arguments supplémentaires
    "",                 // Cible par défaut (machine hôte)
    error_msg,          // Récupère les erreurs
    -1                  // Optimisation par défaut
);
```

---

### Qu'est-ce que createDSPInstance() ?

**Définition** : `createDSPInstance()` est la méthode de la DSP Factory qui crée une instance DSP jouable. Chaque instance possède son propre état interne (mémoires de délai, valeurs de paramètres, compteurs) et peut être utilisée indépendamment des autres instances créées par la même factory.

**Le problème que createDSPInstance() résout** :

Sans `createDSPInstance()`, voici les problèmes rencontrés :

1. **Pas de polyphonie** : Impossible de jouer plusieurs notes simultanément avec le même synthétiseur sans créer plusieurs instances indépendantes.

2. **Pas d'isolation** : Si deux canaux audio utilisent le même effet (par exemple une réverbe), modifier les paramètres d'un canal affecterait l'autre.

**Comment createDSPInstance() résout ces problèmes** :

| Problème | Solution apportée par createDSPInstance() |
| -------- | ----------------------------------------- |
| Pas de polyphonie | Chaque instance a son propre état interne. 8 instances = 8 voix indépendantes. |
| Pas d'isolation | Chaque instance a ses propres paramètres. Modifier l'un n'affecte pas les autres. |

**Le cycle de vie d'une instance DSP** :

```cpp
// 1. Créer l'instance à partir de la factory
dsp* instance = factory->createDSPInstance();

// 2. Initialiser l'instance avec la fréquence d'échantillonnage
//    init() prépare les mémoires internes (délais, filtres)
instance->init(44100);  // 44100 Hz

// 3. Optionnel : connecter une interface utilisateur
//    buildUserInterface() expose les paramètres (sliders, boutons)
//    via un objet UI (voir le pattern UI de Faust)
MyUI ui;
instance->buildUserInterface(&ui);

// 4. Calculer les échantillons audio dans la boucle audio
//    compute() remplit les buffers de sortie à partir des buffers d'entrée
//    Paramètres : nombre d'échantillons, tableau d'entrées, tableau de sorties
instance->compute(buffer_size, inputs, outputs);

// 5. Libérer la mémoire quand l'instance n'est plus nécessaire
delete instance;
```

**Méthodes importantes d'une instance DSP** :

| Méthode | Rôle | Quand l'appeler |
| ------- | ---- | --------------- |
| `init(sampleRate)` | Initialise l'instance pour une fréquence d'échantillonnage donnée | Une seule fois, après la création |
| `compute(count, inputs, outputs)` | Calcule `count` échantillons audio | À chaque appel du callback audio |
| `buildUserInterface(&ui)` | Expose les paramètres de l'instance | Après `init()`, avant `compute()` |
| `getNumInputs()` | Retourne le nombre d'entrées audio | Pour allouer les buffers |
| `getNumOutputs()` | Retourne le nombre de sorties audio | Pour allouer les buffers |
| `instanceClear()` | Remet les mémoires internes à zéro | Pour réinitialiser sans recréer |

---

### Qu'est-ce que l'interpréteur Faust ?

**Définition** : L'interpréteur Faust est un mode d'exécution alternatif au JIT LLVM. Au lieu de compiler le code Faust en code machine natif, l'interpréteur transforme le code en bytecode (instructions intermédiaires) qui sont exécutées par une machine virtuelle intégrée à libfaust. La fonction `createInterpreterDSPFactoryFromString()` remplace `createDSPFactoryFromString()`.

**Le problème que l'interpréteur résout** :

Sans interpréteur, voici les problèmes rencontrés :

1. **Dépendance LLVM** : LLVM est une bibliothèque volumineuse (plusieurs centaines de Mo). Sur des systèmes embarqués, des appareils mobiles ou des environnements contraints, installer LLVM est impossible ou impraticable.

2. **Portabilité limitée** : LLVM ne supporte pas toutes les architectures processeur. Sur une plateforme exotique, le JIT LLVM ne fonctionne pas.

3. **Complexité de compilation** : Compiler libfaust avec le support LLVM nécessite une configuration complexe et un temps de build long.

**Comment l'interpréteur résout ces problèmes** :

| Problème | Solution apportée par l'interpréteur |
| -------- | ------------------------------------ |
| Dépendance LLVM | L'interpréteur ne nécessite pas LLVM. La bibliothèque est plus légère. |
| Portabilité limitée | Le bytecode s'exécute sur toute plateforme où libfaust compile. |
| Complexité de compilation | Compiler libfaust sans LLVM est plus simple et plus rapide. |

**Analogie concrète** : Le JIT LLVM est comme un chef cuisinier qui prépare un plat gastronomique dans une cuisine professionnelle : le résultat est excellent mais il faut une cuisine équipée. L'interpréteur est comme préparer le même plat avec un réchaud de camping : c'est possible partout, le résultat est correct, mais c'est plus lent.

**Ce que l'interpréteur n'est PAS** :

- L'interpréteur n'est pas inutilisable en temps réel. Pour des algorithmes légers (synthétiseurs simples, effets basiques), la performance est suffisante pour le temps réel.
- L'interpréteur n'est pas moins précis. Les résultats audio sont identiques au JIT. Seule la vitesse d'exécution diffère.

**Comparaison JIT vs Interpréteur** :

| Critère | JIT LLVM | Interpréteur |
| ------- | -------- | ------------ |
| Performance | Maximale (code natif) | 2-5x plus lent |
| Dépendance | Nécessite LLVM (~300 Mo) | Aucune dépendance lourde |
| Portabilité | Architectures supportées par LLVM | Toute plateforme |
| Temps de compilation | 100-500 ms | Quasi instantané |
| Fonction de création | `createDSPFactoryFromString()` | `createInterpreterDSPFactoryFromString()` |
| Header à inclure | `faust/dsp/llvm-dsp.h` | `faust/dsp/interpreter-dsp.h` |

**Utilisation de l'interpréteur** :

```cpp
#include <faust/dsp/interpreter-dsp.h>

// La signature est similaire au JIT, mais la fonction est différente
std::string error_msg;
interpreter_dsp_factory* factory = createInterpreterDSPFactoryFromString(
    "MonSynth",         // Nom du programme
    code_faust,         // Code source Faust
    0, nullptr,         // Pas d'arguments supplémentaires
    error_msg           // Récupère les erreurs
);

// Le reste est identique : créer une instance, init, compute
dsp* instance = factory->createDSPInstance();
instance->init(44100);
```

---

### Qu'est-ce que le hot-reloading ?

**Définition** : Le hot-reloading est la technique qui permet de recompiler du code Faust pendant l'exécution de l'application et de remplacer le DSP actif par le nouveau sans interrompre le flux audio. L'ancien DSP continue à jouer pendant la compilation du nouveau. Une fois le nouveau DSP prêt, un cross-fade (fondu enchaîné) assure la transition sans clic ni coupure.

**Le problème que le hot-reloading résout** :

Sans hot-reloading, voici les problèmes rencontrés :

1. **Interruption audio** : Chaque modification du code Faust impose d'arrêter l'audio, recompiler, puis relancer. L'interruption casse l'écoute et ralentit le travail créatif.

2. **Perte de contexte** : Quand tu redémarres l'audio après modification, les mémoires internes (réverbes, délais) sont remises à zéro. Tu perds l'ambiance sonore en cours.

3. **Cycle itératif lent** : Modifier un paramètre, arrêter, recompiler, relancer, réécouter : ce cycle prend 5-10 secondes minimum. Pour affiner un son, tu répètes ce cycle des dizaines de fois.

**Comment le hot-reloading résout ces problèmes** :

| Problème | Solution apportée par le hot-reloading |
| -------- | -------------------------------------- |
| Interruption audio | L'audio ne s'arrête jamais. Le cross-fade assure une transition fluide. |
| Perte de contexte | Le nouveau DSP démarre immédiatement avec de nouvelles mémoires. Le cross-fade masque la transition. |
| Cycle itératif lent | La modification est audible en moins d'une seconde après la sauvegarde du fichier. |

**Analogie concrète** : Le hot-reloading fonctionne comme le changement de décor dans un théâtre. Pendant qu'une scène se joue sur le devant de la scène (ancien DSP), les machinistes installent le nouveau décor derrière le rideau (compilation). Quand le nouveau décor est prêt, on baisse lentement les lumières sur l'ancien décor et on les monte sur le nouveau (cross-fade). Le public ne voit jamais de scène vide.

**Ce que le hot-reloading n'est PAS** :

- Le hot-reloading n'est pas une modification en temps réel des paramètres. Modifier un slider (fréquence, gain) n'est pas du hot-reloading. Le hot-reloading recompile le code source Faust entier et remplace l'algorithme.
- Le hot-reloading ne préserve pas l'état interne du DSP. Les mémoires de délai, les filtres et les compteurs du nouveau DSP partent de zéro. Le cross-fade masque cette discontinuité.

**Le processus de hot-reloading étape par étape** :

```text
1. L'ancien DSP tourne dans la boucle audio (thread audio)
2. Le fichier .dsp est modifié et sauvegardé
3. Le thread de compilation détecte la modification
4. Le thread de compilation appelle createDSPFactoryFromString()
   (cette étape prend 100-500 ms, sur un thread séparé)
5. La nouvelle factory crée une nouvelle instance DSP
6. La nouvelle instance est initialisée (init, buildUserInterface)
7. Le thread audio effectue un cross-fade :
   - Pendant N échantillons (ex: 1024) :
     sortie = ancien_DSP * (1 - t/N) + nouveau_DSP * (t/N)
8. L'ancien DSP est supprimé
9. Le nouveau DSP est maintenant actif
```

---

### API C vs API C++

**Définition** : libfaust fournit deux API. L'API C++ (headers `faust/dsp/llvm-dsp.h` et `faust/dsp/interpreter-dsp.h`) est l'API native, utilisée dans les applications C++. L'API C (header `faust/dsp/libfaust-c.h`) fournit les mêmes fonctionnalités avec des fonctions C pures, ce qui permet l'intégration dans des langages qui ne supportent pas C++ (Python via ctypes, Rust via FFI, Go via cgo, etc.).

**Le problème que l'API C résout** :

Sans API C, voici les problèmes rencontrés :

1. **Incompatibilité C++** : Les langages comme Python, Rust ou Swift ne peuvent pas appeler directement des classes C++ (mangling de noms, vtables, exceptions). L'interopérabilité C++ est complexe et fragile.

2. **Binding compliqué** : Créer un binding vers une API C++ nécessite des outils spécialisés (SWIG, pybind11) et une maintenance constante.

**Comment l'API C résout ces problèmes** :

| Problème | Solution apportée par l'API C |
| -------- | ----------------------------- |
| Incompatibilité C++ | Les fonctions C utilisent des conventions d'appel universelles, supportées par tous les langages |
| Binding compliqué | L'API C expose des fonctions simples avec des types basiques (pointeurs, entiers, chaînes) |

**Comparaison des deux API** :

| Opération | API C++ | API C |
| --------- | ------- | ----- |
| Header | `faust/dsp/llvm-dsp.h` | `faust/dsp/libfaust-c.h` |
| Créer une factory | `createDSPFactoryFromString(...)` | `createCDSPFactoryFromString(...)` |
| Créer une instance | `factory->createDSPInstance()` | `createCDSPInstance(factory)` |
| Calculer | `instance->compute(n, in, out)` | `computeCDSPInstance(instance, n, in, out)` |
| Détruire | `delete instance;` | `deleteCDSPInstance(instance);` |

---

### Qu'est-ce que la sérialisation d'une factory ?

**Définition** : La sérialisation permet de sauvegarder une DSP Factory compilée sur le disque (sous forme de bitcode LLVM) et de la recharger ultérieurement sans recompiler le code Faust. La fonction `writeDSPFactoryToBitcodeFile()` sauvegarde, et `readDSPFactoryFromBitcodeFile()` recharge.

**Le problème que la sérialisation résout** :

Sans sérialisation, voici les problèmes rencontrés :

1. **Recompilation au démarrage** : Chaque lancement de l'application recompile le code Faust. Pour un projet complexe avec plusieurs DSP, le démarrage prend plusieurs secondes.

2. **Pas de cache** : Si l'utilisateur utilise le même algorithme Faust plusieurs fois, chaque utilisation déclenche une compilation complète.

**Comment la sérialisation résout ces problèmes** :

| Problème | Solution apportée par la sérialisation |
| -------- | -------------------------------------- |
| Recompilation au démarrage | La factory est chargée depuis le fichier bitcode en quelques millisecondes |
| Pas de cache | Le bitcode sert de cache : compiler une fois, charger N fois |

**Analogie concrète** : La sérialisation fonctionne comme la congélation d'un plat cuisiné. Préparer le plat (compilation) prend du temps. Mais une fois congelé (sérialisé), tu peux le réchauffer (charger) en quelques instants, autant de fois que tu veux.

**Fonctions de sérialisation** :

```cpp
// Sauvegarder la factory sur le disque (bitcode LLVM)
writeDSPFactoryToBitcodeFile(factory, "/chemin/vers/mon_synth.bc");

// Recharger la factory depuis le fichier bitcode
// Beaucoup plus rapide que recompiler le code source Faust
std::string error_msg;
llvm_dsp_factory* factory = readDSPFactoryFromBitcodeFile(
    "/chemin/vers/mon_synth.bc",
    "",                 // Cible par défaut
    error_msg,          // Récupère les erreurs
    -1                  // Optimisation par défaut
);
```

---

### Considérations multi-thread

**Définition** : Dans une application audio, deux threads principaux coexistent. Le thread audio (temps réel, haute priorité) appelle `compute()` à intervalle régulier (toutes les 1-10 ms). Le thread de compilation (priorité normale) exécute `createDSPFactoryFromString()` quand l'utilisateur modifie le code. Ces deux threads ne doivent jamais interférer.

**Le problème que la gestion multi-thread résout** :

Sans gestion correcte des threads, voici les problèmes rencontrés :

1. **Blocage du thread audio** : Si la compilation (100-500 ms) bloque le thread audio, l'audio coupe pendant la compilation. À 44100 Hz avec un buffer de 256 échantillons, le thread audio doit répondre en moins de 5,8 ms.

2. **Corruption de données** : Si le thread audio lit un pointeur DSP pendant que le thread de compilation le modifie, le programme crash ou produit du bruit.

3. **Clic audio** : Si le remplacement du DSP n'est pas progressif (cross-fade), la discontinuité entre l'ancien et le nouveau signal produit un clic audible.

**Comment la gestion multi-thread résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Blocage du thread audio | La compilation s'exécute sur un thread séparé. Le thread audio n'est jamais bloqué. |
| Corruption de données | Un pointeur atomique (`std::atomic<dsp*>`) garantit un échange sûr entre threads. |
| Clic audio | Un cross-fade de 512-2048 échantillons (10-50 ms) lisse la transition. |

**Règles strictes du thread audio** :

| Interdit dans le thread audio | Pourquoi |
| ----------------------------- | -------- |
| Allocation mémoire (`new`, `malloc`) | Peut bloquer si le système n'a plus de mémoire contigüe |
| Verrouillage (`mutex`, `lock`) | Peut bloquer indéfiniment si un autre thread détient le verrou |
| Entrées/sorties disque (`fopen`, `cout`) | Temps d'accès imprévisible (µs à ms) |
| Compilation (`createDSPFactoryFromString`) | Prend 100-500 ms, le thread audio ne peut pas attendre |

**Autorisé dans le thread audio** :

| Autorisé dans le thread audio | Pourquoi |
| ------------------------------ | -------- |
| `compute()` | Exécute du code machine pur, temps prévisible |
| Lecture atomique (`atomic::load`) | Opération sans blocage, quelques nanosecondes |
| Calculs arithmétiques | Opérations en registres, temps constant |

---

## Étapes Pratiques

### Étape 1 : Inclure libfaust dans un projet C++ (CMake)

Crée un dossier de projet avec la structure suivante :

```text
mon-projet-libfaust/
├── CMakeLists.txt
└── main.cpp
```

Crée le fichier `CMakeLists.txt` :

```text
cmake_minimum_required(VERSION 3.14)
project(MonProjetLibfaust)

# Chercher le package libfaust installé sur le système
# find_package cherche les fichiers de configuration CMake de libfaust
find_package(faust REQUIRED)

# Créer l'exécutable à partir de main.cpp
add_executable(mon_projet main.cpp)

# Lier libfaust à l'exécutable
# faust::faust est la cible CMake exportée par libfaust
target_link_libraries(mon_projet PRIVATE faust::faust)
```

Si `find_package` ne trouve pas libfaust, tu peux spécifier le chemin manuellement :

```text
cmake_minimum_required(VERSION 3.14)
project(MonProjetLibfaust)

# Chemin vers l'installation de libfaust (à adapter selon ton système)
set(FAUST_DIR "/usr/local" CACHE PATH "Chemin vers l'installation de Faust")

add_executable(mon_projet main.cpp)

# Ajouter le répertoire des headers de libfaust
target_include_directories(mon_projet PRIVATE ${FAUST_DIR}/include)

# Lier la bibliothèque libfaust
# Sur macOS, le fichier est libfaust.dylib
# Sur Linux, le fichier est libfaust.so
target_link_libraries(mon_projet PRIVATE ${FAUST_DIR}/lib/libfaust.so)
```

**Résultat attendu** :

```text
Le projet CMake est configuré. Tu peux le vérifier avec :
$ mkdir build && cd build
$ cmake ..

Si tout est correct, tu verras :
-- Found faust: /usr/local/lib/libfaust.so
-- Configuring done
-- Generating done
```

---

### Étape 2 : Compiler du code Faust depuis une chaîne de caractères

Crée le fichier `main.cpp` avec ce contenu minimal :

```cpp
// main.cpp
// Ce programme compile du code Faust en mémoire et affiche les informations du DSP

// Header libfaust pour la compilation JIT via LLVM
#include <faust/dsp/llvm-dsp.h>

// Headers standard C++
#include <iostream>  // Pour cout et cerr
#include <string>    // Pour std::string

int main() {
    // Code Faust à compiler : un oscillateur sinusoïdal à 440 Hz
    // Le code est une simple chaîne de caractères C++
    std::string code_faust = R"(
        import("stdfaust.lib");
        freq = hslider("Frequence", 440, 20, 20000, 1);
        gain = hslider("Volume", 0.5, 0, 1, 0.01);
        process = os.osc(freq) * gain;
    )";

    // Variable qui recevra le message d'erreur si la compilation échoue
    std::string error_msg;

    // Compiler le code Faust en DSP Factory
    // createDSPFactoryFromString() retourne nullptr en cas d'erreur
    llvm_dsp_factory* factory = createDSPFactoryFromString(
        "MonOscillateur",   // Nom du programme (identifiant interne)
        code_faust,         // Code source Faust
        0, nullptr,         // Pas d'arguments supplémentaires du compilateur
        "",                 // Cible : chaîne vide = machine hôte
        error_msg,          // Récupère le message d'erreur éventuel
        -1                  // Niveau d'optimisation : -1 = valeur par défaut
    );

    // Vérifier si la compilation a réussi
    if (!factory) {
        // La compilation a échoué : afficher l'erreur et quitter
        std::cerr << "Erreur de compilation Faust : " << error_msg << std::endl;
        return 1;
    }

    std::cout << "Compilation réussie." << std::endl;

    // Créer une instance DSP à partir de la factory
    dsp* instance = factory->createDSPInstance();

    // Afficher les informations du DSP compilé
    std::cout << "Nombre d'entrées  : " << instance->getNumInputs() << std::endl;
    std::cout << "Nombre de sorties : " << instance->getNumOutputs() << std::endl;

    // Libérer la mémoire
    delete instance;
    deleteDSPFactory(factory);

    std::cout << "Mémoire libérée. Fin du programme." << std::endl;
    return 0;
}
```

Compile et exécute :

```bash
# Créer le dossier de build et configurer CMake
mkdir -p build && cd build
cmake ..

# Compiler le projet
make

# Exécuter
./mon_projet
```

**Résultat attendu** :

```text
Compilation réussie.
Nombre d'entrées  : 0
Nombre de sorties : 1
Mémoire libérée. Fin du programme.
```

Le DSP a 0 entrées (l'oscillateur génère un signal sans entrée audio) et 1 sortie (mono).

---

### Étape 3 : Créer une instance DSP et appeler compute()

Remplace le contenu de `main.cpp` pour ajouter le calcul audio :

```cpp
// main.cpp
// Ce programme compile du code Faust et calcule des échantillons audio

#include <faust/dsp/llvm-dsp.h>
#include <iostream>
#include <string>
#include <cstring>  // Pour memset

int main() {
    // Code Faust : oscillateur sinusoïdal
    std::string code_faust = R"(
        import("stdfaust.lib");
        process = os.osc(440) * 0.5;
    )";

    std::string error_msg;

    // Étape 1 : Compiler le code Faust
    llvm_dsp_factory* factory = createDSPFactoryFromString(
        "Oscillateur", code_faust, 0, nullptr, "", error_msg, -1
    );

    if (!factory) {
        std::cerr << "Erreur : " << error_msg << std::endl;
        return 1;
    }

    // Étape 2 : Créer une instance DSP
    dsp* instance = factory->createDSPInstance();

    // Étape 3 : Initialiser l'instance
    // 44100 = fréquence d'échantillonnage (44.1 kHz, standard CD)
    int sample_rate = 44100;
    instance->init(sample_rate);

    // Étape 4 : Préparer les buffers audio
    int num_inputs = instance->getNumInputs();    // 0 pour cet oscillateur
    int num_outputs = instance->getNumOutputs();   // 1 (mono)
    int buffer_size = 256;                         // Nombre d'échantillons par bloc

    // Allouer les buffers d'entrée (tableau de pointeurs vers des tableaux de float)
    // Chaque entrée est un tableau de buffer_size échantillons
    float** inputs = new float*[num_inputs];
    for (int i = 0; i < num_inputs; i++) {
        inputs[i] = new float[buffer_size];
        memset(inputs[i], 0, buffer_size * sizeof(float));  // Remplir de zéros
    }

    // Allouer les buffers de sortie
    float** outputs = new float*[num_outputs];
    for (int i = 0; i < num_outputs; i++) {
        outputs[i] = new float[buffer_size];
        memset(outputs[i], 0, buffer_size * sizeof(float));  // Remplir de zéros
    }

    // Étape 5 : Calculer un bloc de 256 échantillons
    // compute() remplit les buffers de sortie avec les échantillons générés
    instance->compute(buffer_size, inputs, outputs);

    // Afficher les 10 premiers échantillons de la sortie
    std::cout << "10 premiers échantillons (sinusoïde 440 Hz à 44100 Hz) :" << std::endl;
    for (int i = 0; i < 10; i++) {
        std::cout << "  sortie[" << i << "] = " << outputs[0][i] << std::endl;
    }

    // Étape 6 : Libérer toute la mémoire
    for (int i = 0; i < num_inputs; i++) delete[] inputs[i];
    delete[] inputs;
    for (int i = 0; i < num_outputs; i++) delete[] outputs[i];
    delete[] outputs;
    delete instance;
    deleteDSPFactory(factory);

    return 0;
}
```

**Résultat attendu** :

```text
10 premiers échantillons (sinusoïde 440 Hz à 44100 Hz) :
  sortie[0] = 0
  sortie[1] = 0.0312869
  sortie[2] = 0.0624735
  sortie[3] = 0.0934596
  sortie[4] = 0.124145
  sortie[5] = 0.15443
  sortie[6] = 0.184214
  sortie[7] = 0.213397
  sortie[8] = 0.241878
  sortie[9] = 0.269558
```

Les valeurs augmentent progressivement : c'est le début de la sinusoïde (la partie montante du premier quart de cycle). L'amplitude maximale sera 0.5 (car on multiplie par 0.5).

---

### Étape 4 : Implémenter le hot-reloading basique

Crée un fichier `hot_reload.cpp` qui surveille un fichier Faust et le recompile automatiquement à chaque modification :

```cpp
// hot_reload.cpp
// Démontre le hot-reloading : surveillance d'un fichier + recompilation automatique

#include <faust/dsp/llvm-dsp.h>
#include <iostream>
#include <fstream>    // Pour lire le fichier .dsp
#include <sstream>    // Pour stringstream
#include <string>
#include <atomic>     // Pour le pointeur atomique (échange sûr entre threads)
#include <thread>     // Pour le thread de surveillance
#include <chrono>     // Pour la temporisation
#include <cstring>    // Pour memset
#include <sys/stat.h> // Pour stat() (date de modification du fichier)

// Pointeur atomique vers l'instance DSP active
// std::atomic garantit que l'échange entre threads est sûr
std::atomic<dsp*> dsp_actif{nullptr};

// Lire le contenu d'un fichier texte et le retourner comme string
std::string lire_fichier(const std::string& chemin) {
    std::ifstream fichier(chemin);           // Ouvrir le fichier en lecture
    if (!fichier.is_open()) return "";        // Retourner vide si impossible d'ouvrir
    std::stringstream buffer;
    buffer << fichier.rdbuf();               // Lire tout le contenu d'un coup
    return buffer.str();                     // Convertir en string
}

// Obtenir la date de dernière modification d'un fichier (en secondes depuis epoch)
time_t date_modification(const std::string& chemin) {
    struct stat info;
    if (stat(chemin.c_str(), &info) != 0) return 0;  // Erreur : retourner 0
    return info.st_mtime;                              // Retourner la date de modification
}

// Thread de surveillance : vérifie le fichier toutes les 500 ms
void thread_surveillance(const std::string& chemin_dsp) {
    time_t derniere_modif = 0;    // Date de la dernière modification connue
    int sample_rate = 44100;

    while (true) {
        // Vérifier si le fichier a été modifié
        time_t modif_actuelle = date_modification(chemin_dsp);

        if (modif_actuelle != derniere_modif) {
            derniere_modif = modif_actuelle;

            // Le fichier a changé : lire le nouveau code
            std::string code = lire_fichier(chemin_dsp);
            if (code.empty()) {
                std::cerr << "Fichier vide ou introuvable." << std::endl;
                continue;
            }

            std::cout << "Modification détectée, recompilation..." << std::endl;

            // Compiler le nouveau code Faust
            std::string error_msg;
            llvm_dsp_factory* factory = createDSPFactoryFromString(
                "HotReload", code, 0, nullptr, "", error_msg, -1
            );

            if (!factory) {
                // Erreur de compilation : afficher le message et continuer
                // L'ancien DSP reste actif
                std::cerr << "Erreur de compilation : " << error_msg << std::endl;
                continue;
            }

            // Créer la nouvelle instance
            dsp* nouvelle_instance = factory->createDSPInstance();
            nouvelle_instance->init(sample_rate);

            // Échanger l'instance active de manière atomique
            // L'ancien DSP est récupéré pour être supprimé
            dsp* ancienne_instance = dsp_actif.exchange(nouvelle_instance);

            std::cout << "Nouveau DSP actif ("
                      << nouvelle_instance->getNumInputs() << " entrées, "
                      << nouvelle_instance->getNumOutputs() << " sorties)."
                      << std::endl;

            // Supprimer l'ancienne instance
            // Dans une application réelle, tu attendrais que le thread audio
            // ait fini d'utiliser l'ancienne instance avant de la supprimer
            if (ancienne_instance) {
                delete ancienne_instance;
            }
        }

        // Attendre 500 ms avant la prochaine vérification
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
}

int main(int argc, char* argv[]) {
    // Vérifier qu'un fichier .dsp est passé en argument
    if (argc < 2) {
        std::cerr << "Usage : " << argv[0] << " fichier.dsp" << std::endl;
        return 1;
    }

    std::string chemin_dsp = argv[1];

    // Lancer le thread de surveillance en arrière-plan
    // std::thread exécute thread_surveillance dans un thread séparé
    std::thread surveillant(thread_surveillance, chemin_dsp);

    // Simuler la boucle audio principale
    // Allouer les buffers HORS de la boucle : new/delete sont interdits dans le thread audio
    int buffer_size = 256;
    float* sortie = new float[buffer_size];
    float* input_buf = new float[buffer_size]();

    std::cout << "Surveillance de " << chemin_dsp << " en cours..." << std::endl;
    std::cout << "Modifie le fichier pour déclencher la recompilation." << std::endl;

    // Boucle audio simplifiée (dans une vraie application, ce serait un callback audio)
    while (true) {
        // Charger le pointeur DSP actif de manière atomique
        dsp* instance = dsp_actif.load();

        if (instance && instance->getNumOutputs() > 0) {
            float* outputs_ptr[1] = {sortie};
            float* inputs_ptr[1] = {nullptr};

            if (instance->getNumInputs() > 0) {
                inputs_ptr[0] = input_buf;
            }

            // Calculer les échantillons (pas d'allocation ici)
            instance->compute(buffer_size, inputs_ptr, outputs_ptr);
        }

        // Simuler le rythme du callback audio (~5.8 ms pour 256 samples @ 44100 Hz)
        std::this_thread::sleep_for(std::chrono::microseconds(5800));
    }

    delete[] input_buf;
    delete[] sortie;
    surveillant.join();
    return 0;
}
```

Pour tester, crée un fichier `test.dsp` :

```faust
// test.dsp
import("stdfaust.lib");
process = os.osc(440) * 0.3;
```

Compile et lance le programme :

```bash
# Compiler le programme de hot-reloading
cd build
cmake ..
make

# Lancer le programme avec le fichier test.dsp
./hot_reload ../test.dsp
```

**Résultat attendu** :

```text
Surveillance de ../test.dsp en cours...
Modifie le fichier pour déclencher la recompilation.
Modification détectée, recompilation...
Nouveau DSP actif (0 entrées, 1 sorties).
```

Modifie maintenant `test.dsp` (par exemple, change la fréquence de 440 à 880) et sauvegarde. Le programme détecte la modification et recompile automatiquement :

```text
Modification détectée, recompilation...
Nouveau DSP actif (0 entrées, 1 sorties).
```

---

### Étape 5 : Utiliser l'interpréteur comme alternative

Remplace le header et la fonction de compilation pour passer au mode interpréteur :

```cpp
// interpreteur.cpp
// Même fonctionnalité que main.cpp mais avec l'interpréteur (sans LLVM)

// Remplacer llvm-dsp.h par interpreter-dsp.h
#include <faust/dsp/interpreter-dsp.h>
#include <iostream>
#include <string>
#include <cstring>

int main() {
    // Le code Faust est identique
    std::string code_faust = R"(
        import("stdfaust.lib");
        process = os.osc(440) * 0.5;
    )";

    std::string error_msg;

    // Utiliser createInterpreterDSPFactoryFromString au lieu de createDSPFactoryFromString
    // La signature est légèrement différente : pas de paramètre "cible" ni "optimisation"
    interpreter_dsp_factory* factory = createInterpreterDSPFactoryFromString(
        "Oscillateur",      // Nom du programme
        code_faust,         // Code source Faust
        0, nullptr,         // Pas d'arguments supplémentaires
        error_msg           // Récupère les erreurs
    );

    if (!factory) {
        std::cerr << "Erreur : " << error_msg << std::endl;
        return 1;
    }

    std::cout << "Compilation (interpréteur) réussie." << std::endl;

    // Le reste est identique au mode JIT
    dsp* instance = factory->createDSPInstance();
    instance->init(44100);

    // Préparer les buffers
    int buffer_size = 256;
    float** inputs = new float*[0];   // 0 entrées
    float** outputs = new float*[1];  // 1 sortie
    outputs[0] = new float[buffer_size];
    memset(outputs[0], 0, buffer_size * sizeof(float));

    // Calculer les échantillons
    instance->compute(buffer_size, inputs, outputs);

    // Afficher les 10 premiers échantillons
    std::cout << "10 premiers échantillons (interpréteur) :" << std::endl;
    for (int i = 0; i < 10; i++) {
        std::cout << "  sortie[" << i << "] = " << outputs[0][i] << std::endl;
    }

    // Les valeurs sont identiques à celles du mode JIT
    // Seule la vitesse d'exécution diffère

    // Libérer la mémoire
    delete[] outputs[0];
    delete[] outputs;
    delete[] inputs;
    delete instance;
    deleteInterpreterDSPFactory(factory);

    return 0;
}
```

**Résultat attendu** :

```text
Compilation (interpréteur) réussie.
10 premiers échantillons (interpréteur) :
  sortie[0] = 0
  sortie[1] = 0.0312869
  sortie[2] = 0.0624735
  sortie[3] = 0.0934596
  sortie[4] = 0.124145
  sortie[5] = 0.15443
  sortie[6] = 0.184214
  sortie[7] = 0.213397
  sortie[8] = 0.241878
  sortie[9] = 0.269558
```

Les valeurs sont identiques au mode JIT. La différence est invisible sur un petit calcul comme celui-ci. La différence de performance se manifeste sur des algorithmes complexes avec des buffers volumineux.

---

## Commandes Utiles

| Commande / Fonction | Action |
| -------------------- | ------ |
| `createDSPFactoryFromString()` | Compiler du code Faust en factory JIT (LLVM) |
| `createInterpreterDSPFactoryFromString()` | Compiler du code Faust en factory interpréteur |
| `factory->createDSPInstance()` | Créer une instance DSP jouable à partir d'une factory |
| `instance->init(sampleRate)` | Initialiser l'instance pour une fréquence d'échantillonnage |
| `instance->compute(n, in, out)` | Calculer N échantillons audio |
| `instance->buildUserInterface(&ui)` | Connecter les paramètres du DSP à une interface |
| `instance->getNumInputs()` | Nombre d'entrées audio du DSP |
| `instance->getNumOutputs()` | Nombre de sorties audio du DSP |
| `writeDSPFactoryToBitcodeFile()` | Sauvegarder une factory sur le disque (bitcode LLVM) |
| `readDSPFactoryFromBitcodeFile()` | Charger une factory depuis un fichier bitcode |
| `deleteDSPFactory(factory)` | Libérer la mémoire d'une factory JIT |
| `deleteInterpreterDSPFactory(factory)` | Libérer la mémoire d'une factory interpréteur |

---

## Pièges Fréquents

### Piège 1 : Compiler dans le thread audio

**Problème** : Appeler `createDSPFactoryFromString()` dans le callback audio. La compilation prend 100-500 ms. Le thread audio dispose de 5,8 ms (256 échantillons à 44100 Hz). Résultat : coupure audio immédiate.

**Solution** : Toujours compiler dans un thread séparé. Le thread audio ne doit appeler que `compute()`.

```cpp
// ❌ Incorrect : compilation dans le callback audio
void audioCallback(float** inputs, float** outputs, int frames) {
    // JAMAIS de compilation ici
    factory = createDSPFactoryFromString(...);  // BLOQUE pendant 100-500 ms
    instance = factory->createDSPInstance();
    instance->compute(frames, inputs, outputs);
}

// ✅ Correct : compilation dans un thread séparé
void threadCompilation() {
    factory = createDSPFactoryFromString(...);  // Thread séparé, pas de contrainte temps réel
    dsp* nouveau = factory->createDSPInstance();
    nouveau->init(44100);
    dsp_actif.store(nouveau);  // Échange atomique
}

void audioCallback(float** inputs, float** outputs, int frames) {
    dsp* instance = dsp_actif.load();  // Lecture atomique, quelques nanosecondes
    if (instance) instance->compute(frames, inputs, outputs);
}
```

---

### Piège 2 : Oublier d'appeler init() avant compute()

**Problème** : Appeler `compute()` sans avoir appelé `init()` d'abord. Les mémoires internes du DSP (délais, filtres) ne sont pas initialisées. Résultat : valeurs absurdes ou crash.

**Solution** : Toujours appeler `init(sampleRate)` une seule fois après la création de l'instance, avant tout appel à `compute()`.

```cpp
// ❌ Incorrect : compute() sans init()
dsp* instance = factory->createDSPInstance();
instance->compute(256, inputs, outputs);  // Mémoires non initialisées

// ✅ Correct : init() puis compute()
dsp* instance = factory->createDSPInstance();
instance->init(44100);  // Initialiser d'abord
instance->compute(256, inputs, outputs);  // Maintenant c'est sûr
```

---

### Piège 3 : Ne pas vérifier le retour de createDSPFactoryFromString()

**Problème** : Si le code Faust contient une erreur de syntaxe, `createDSPFactoryFromString()` retourne `nullptr`. Appeler `createDSPInstance()` sur un pointeur nul provoque un crash immédiat (segfault).

**Solution** : Toujours vérifier que la factory n'est pas `nullptr` avant de l'utiliser.

```cpp
// ❌ Incorrect : pas de vérification
llvm_dsp_factory* factory = createDSPFactoryFromString(...);
dsp* instance = factory->createDSPInstance();  // CRASH si factory == nullptr

// ✅ Correct : vérification systématique
llvm_dsp_factory* factory = createDSPFactoryFromString(...);
if (!factory) {
    std::cerr << "Erreur : " << error_msg << std::endl;
    return;  // Ne pas continuer
}
dsp* instance = factory->createDSPInstance();
```

---

### Piège 4 : Fuites mémoire sur les factories et instances

**Problème** : Oublier de libérer les factories et instances DSP. Chaque factory occupe plusieurs Mo (code LLVM compilé). Chaque instance occupe la mémoire de ses buffers internes. En hot-reloading, une fuite mémoire à chaque recompilation épuise rapidement la mémoire.

**Solution** : Toujours libérer les anciennes instances et factories avant ou après le remplacement.

```cpp
// ❌ Incorrect : fuite mémoire à chaque recompilation
while (fichier_modifié) {
    factory = createDSPFactoryFromString(...);
    instance = factory->createDSPInstance();
    // L'ancienne factory et l'ancienne instance ne sont jamais libérées
}

// ✅ Correct : libération systématique
while (fichier_modifié) {
    llvm_dsp_factory* nouvelle_factory = createDSPFactoryFromString(...);
    dsp* nouvelle_instance = nouvelle_factory->createDSPInstance();
    nouvelle_instance->init(44100);

    // Récupérer et libérer l'ancien DSP
    dsp* ancien = dsp_actif.exchange(nouvelle_instance);
    if (ancien) delete ancien;
    if (ancienne_factory) deleteDSPFactory(ancienne_factory);
    ancienne_factory = nouvelle_factory;
}
```

---

### Piège 5 : Confondre JIT et interpréteur dans les includes

**Problème** : Inclure `llvm-dsp.h` mais appeler `createInterpreterDSPFactoryFromString()`, ou inversement. Les types de factory ne sont pas interchangeables. `llvm_dsp_factory*` et `interpreter_dsp_factory*` sont des types différents.

**Solution** : Utiliser le bon header pour le bon mode.

```cpp
// Mode JIT (LLVM) :
#include <faust/dsp/llvm-dsp.h>
llvm_dsp_factory* factory = createDSPFactoryFromString(...);
// Libération : deleteDSPFactory(factory);

// Mode interpréteur :
#include <faust/dsp/interpreter-dsp.h>
interpreter_dsp_factory* factory = createInterpreterDSPFactoryFromString(...);
// Libération : deleteInterpreterDSPFactory(factory);
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre le compilateur Faust en ligne de commande et libfaust embarqué
- [ ] Je sais ce qu'est la compilation JIT et pourquoi elle utilise LLVM
- [ ] Je comprends le pattern Factory : une compilation produit une factory, une factory crée N instances
- [ ] Je connais le cycle de vie d'une instance DSP : `createDSPInstance()` -> `init()` -> `compute()` -> `delete`
- [ ] Je sais que l'interpréteur est une alternative au JIT LLVM (plus léger mais plus lent)
- [ ] Je comprends le hot-reloading : recompilation + cross-fade sans interruption audio
- [ ] Je sais que la compilation doit se faire dans un thread séparé du thread audio
- [ ] Je connais la différence entre l'API C et l'API C++
- [ ] Je sais sérialiser une factory en bitcode LLVM pour éviter la recompilation
- [ ] Je sais utiliser `std::atomic` pour échanger le DSP actif entre threads de manière sûre
- [ ] J'ai compilé et exécuté un programme C++ utilisant libfaust
- [ ] J'ai vérifié que les résultats du JIT et de l'interpréteur sont identiques

---

## Exercice Pratique

**Énoncé** : Crée une application C++ qui lit du code Faust depuis un fichier, le compile avec libfaust, le joue via un callback audio simple, et surveille le fichier pour recompiler automatiquement à chaque modification (hot-reload basique).

**Indications** :

- Utilise `createDSPFactoryFromString()` pour la compilation JIT
- Utilise `std::atomic<dsp*>` pour l'échange sûr entre le thread audio et le thread de compilation
- Surveille la date de modification du fichier avec `stat()` toutes les 500 ms dans un thread séparé
- Implémente un cross-fade basique de 1024 échantillons lors du remplacement du DSP
- Alloue les buffers audio en dehors du thread audio (avant la boucle)
- Gère les erreurs de compilation : affiche le message d'erreur et conserve l'ancien DSP

**Résultat attendu** :

- L'application démarre, compile le fichier `.dsp`, et commence à calculer des échantillons audio
- Quand tu modifies le fichier `.dsp` et sauvegardes, l'application détecte la modification, recompile, et bascule vers le nouveau DSP
- Si le code modifié contient une erreur, l'ancien DSP reste actif et l'erreur est affichée
- Le cross-fade de 1024 échantillons assure une transition sans clic

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```cpp
// hot_reload_complet.cpp
// Application complète de hot-reloading avec cross-fade

#include <faust/dsp/llvm-dsp.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <atomic>
#include <thread>
#include <chrono>
#include <cstring>
#include <sys/stat.h>

// ========== Configuration ==========

// Fréquence d'échantillonnage
const int SAMPLE_RATE = 44100;

// Taille du buffer audio (nombre d'échantillons par bloc)
const int BUFFER_SIZE = 256;

// Durée du cross-fade en échantillons
const int CROSSFADE_LENGTH = 1024;

// Intervalle de surveillance du fichier (en millisecondes)
const int WATCH_INTERVAL_MS = 500;

// ========== Variables globales ==========

// Pointeur atomique vers l'instance DSP active
std::atomic<dsp*> dsp_actif{nullptr};

// Pointeur atomique vers l'ancienne instance (pour le cross-fade)
std::atomic<dsp*> dsp_ancien{nullptr};

// Compteur atomique pour le cross-fade (nombre d'échantillons restants)
std::atomic<int> crossfade_restant{0};

// Factory active (pour la libération mémoire)
llvm_dsp_factory* factory_active = nullptr;

// ========== Fonctions utilitaires ==========

// Lire le contenu d'un fichier texte
std::string lire_fichier(const std::string& chemin) {
    std::ifstream fichier(chemin);
    if (!fichier.is_open()) return "";
    std::stringstream buffer;
    buffer << fichier.rdbuf();
    return buffer.str();
}

// Obtenir la date de dernière modification d'un fichier
time_t date_modification(const std::string& chemin) {
    struct stat info;
    if (stat(chemin.c_str(), &info) != 0) return 0;
    return info.st_mtime;
}

// ========== Thread de surveillance ==========

void thread_surveillance(const std::string& chemin_dsp) {
    time_t derniere_modif = 0;

    while (true) {
        time_t modif_actuelle = date_modification(chemin_dsp);

        if (modif_actuelle != derniere_modif && modif_actuelle != 0) {
            derniere_modif = modif_actuelle;

            // Lire le nouveau code source
            std::string code = lire_fichier(chemin_dsp);
            if (code.empty()) {
                std::cerr << "[Surveillant] Fichier vide ou introuvable." << std::endl;
                std::this_thread::sleep_for(std::chrono::milliseconds(WATCH_INTERVAL_MS));
                continue;
            }

            std::cout << "[Surveillant] Modification détectée, recompilation..." << std::endl;

            // Compiler le nouveau code Faust
            std::string error_msg;
            llvm_dsp_factory* nouvelle_factory = createDSPFactoryFromString(
                "HotReload", code, 0, nullptr, "", error_msg, -1
            );

            if (!nouvelle_factory) {
                // Erreur de compilation : l'ancien DSP reste actif
                std::cerr << "[Surveillant] Erreur de compilation :" << std::endl;
                std::cerr << "  " << error_msg << std::endl;
                std::cerr << "[Surveillant] L'ancien DSP reste actif." << std::endl;
                std::this_thread::sleep_for(std::chrono::milliseconds(WATCH_INTERVAL_MS));
                continue;
            }

            // Créer et initialiser la nouvelle instance
            dsp* nouvelle_instance = nouvelle_factory->createDSPInstance();
            nouvelle_instance->init(SAMPLE_RATE);

            std::cout << "[Surveillant] Nouveau DSP compilé ("
                      << nouvelle_instance->getNumInputs() << " in, "
                      << nouvelle_instance->getNumOutputs() << " out)." << std::endl;

            // Stocker l'ancienne instance pour le cross-fade
            dsp* ancienne = dsp_actif.exchange(nouvelle_instance);
            dsp_ancien.store(ancienne);

            // Déclencher le cross-fade
            crossfade_restant.store(CROSSFADE_LENGTH);

            // Libérer l'ancienne factory (après un délai pour laisser le cross-fade finir)
            // Dans une application de production, on utiliserait un mécanisme plus robuste
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            if (factory_active) {
                deleteDSPFactory(factory_active);
            }
            factory_active = nouvelle_factory;

            std::cout << "[Surveillant] Cross-fade en cours (" << CROSSFADE_LENGTH
                      << " échantillons)." << std::endl;
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(WATCH_INTERVAL_MS));
    }
}

// ========== Boucle audio simulée ==========

void boucle_audio() {
    // Allouer les buffers une seule fois (en dehors de la boucle)
    float* buffer_sortie_actif = new float[BUFFER_SIZE];
    float* buffer_sortie_ancien = new float[BUFFER_SIZE];
    float* buffer_sortie_final = new float[BUFFER_SIZE];
    float* buffer_entree = new float[BUFFER_SIZE];
    memset(buffer_entree, 0, BUFFER_SIZE * sizeof(float));

    int compteur_blocs = 0;

    while (true) {
        dsp* actif = dsp_actif.load();

        if (actif && actif->getNumOutputs() > 0) {
            // Préparer les pointeurs de buffers
            float* out_actif[1] = {buffer_sortie_actif};
            float* in[1] = {buffer_entree};

            // Calculer les échantillons du DSP actif
            actif->compute(BUFFER_SIZE, in, out_actif);

            // Vérifier si un cross-fade est en cours
            int cf_restant = crossfade_restant.load();
            dsp* ancien = dsp_ancien.load();

            if (cf_restant > 0 && ancien && ancien->getNumOutputs() > 0) {
                // Cross-fade en cours : calculer aussi l'ancien DSP
                float* out_ancien[1] = {buffer_sortie_ancien};
                ancien->compute(BUFFER_SIZE, in, out_ancien);

                // Appliquer le cross-fade échantillon par échantillon
                for (int i = 0; i < BUFFER_SIZE && cf_restant > 0; i++) {
                    // t varie de 1.0 (début) à 0.0 (fin du cross-fade)
                    float t = static_cast<float>(cf_restant) / CROSSFADE_LENGTH;

                    // Mélange : ancien * t + nouveau * (1 - t)
                    buffer_sortie_final[i] =
                        buffer_sortie_ancien[i] * t +
                        buffer_sortie_actif[i] * (1.0f - t);

                    cf_restant--;
                }

                crossfade_restant.store(cf_restant);

                // Si le cross-fade est terminé, libérer l'ancien DSP
                if (cf_restant <= 0) {
                    dsp* a_supprimer = dsp_ancien.exchange(nullptr);
                    if (a_supprimer) {
                        delete a_supprimer;
                        std::cout << "[Audio] Cross-fade terminé." << std::endl;
                    }
                }
            } else {
                // Pas de cross-fade : copier directement
                memcpy(buffer_sortie_final, buffer_sortie_actif,
                       BUFFER_SIZE * sizeof(float));
            }

            // Afficher un échantillon toutes les 100 itérations (pour vérification)
            compteur_blocs++;
            if (compteur_blocs % 100 == 0) {
                std::cout << "[Audio] Bloc " << compteur_blocs
                          << " | Échantillon[0] = " << buffer_sortie_final[0]
                          << std::endl;
            }
        }

        // Simuler le rythme du callback audio
        // 256 échantillons à 44100 Hz = ~5.8 ms par bloc
        std::this_thread::sleep_for(std::chrono::microseconds(5800));
    }

    // Libérer les buffers (jamais atteint dans cette boucle infinie)
    delete[] buffer_sortie_actif;
    delete[] buffer_sortie_ancien;
    delete[] buffer_sortie_final;
    delete[] buffer_entree;
}

// ========== Point d'entrée ==========

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage : " << argv[0] << " fichier.dsp" << std::endl;
        std::cerr << std::endl;
        std::cerr << "Exemple :" << std::endl;
        std::cerr << "  " << argv[0] << " mon_synth.dsp" << std::endl;
        return 1;
    }

    std::string chemin_dsp = argv[1];

    // Vérifier que le fichier existe
    if (date_modification(chemin_dsp) == 0) {
        std::cerr << "Fichier introuvable : " << chemin_dsp << std::endl;
        return 1;
    }

    std::cout << "=== Hot-Reload Faust ===" << std::endl;
    std::cout << "Fichier surveillé : " << chemin_dsp << std::endl;
    std::cout << "Sample rate       : " << SAMPLE_RATE << " Hz" << std::endl;
    std::cout << "Buffer size       : " << BUFFER_SIZE << " échantillons" << std::endl;
    std::cout << "Cross-fade        : " << CROSSFADE_LENGTH << " échantillons" << std::endl;
    std::cout << "========================" << std::endl;

    // Lancer le thread de surveillance
    std::thread surveillant(thread_surveillance, chemin_dsp);

    // Lancer la boucle audio sur le thread principal
    boucle_audio();

    surveillant.join();
    return 0;
}
```

**Test de la solution** :

Crée un fichier `test.dsp` :

```faust
// test.dsp - Oscillateur simple
import("stdfaust.lib");
process = os.osc(440) * 0.3;
```

Compile et lance :

```bash
# Compiler
cd build && cmake .. && make

# Lancer le hot-reload
./hot_reload_complet ../test.dsp
```

**Résultat attendu au démarrage** :

```text
=== Hot-Reload Faust ===
Fichier surveillé : ../test.dsp
Sample rate       : 44100 Hz
Buffer size       : 256 échantillons
Cross-fade        : 1024 échantillons
========================
[Surveillant] Modification détectée, recompilation...
[Surveillant] Nouveau DSP compilé (0 in, 1 out).
[Surveillant] Cross-fade en cours (1024 échantillons).
[Audio] Cross-fade terminé.
[Audio] Bloc 100 | Échantillon[0] = 0.278991
```

Modifie `test.dsp` pour changer la fréquence :

```faust
// test.dsp - Fréquence modifiée
import("stdfaust.lib");
process = os.osc(880) * 0.3;
```

**Résultat attendu après modification** :

```text
[Surveillant] Modification détectée, recompilation...
[Surveillant] Nouveau DSP compilé (0 in, 1 out).
[Surveillant] Cross-fade en cours (1024 échantillons).
[Audio] Cross-fade terminé.
```

Introduis une erreur de syntaxe dans `test.dsp` :

```faust
// test.dsp - Erreur volontaire
import("stdfaust.lib");
process = os.osc(880) *;
```

**Résultat attendu avec erreur** :

```text
[Surveillant] Modification détectée, recompilation...
[Surveillant] Erreur de compilation :
  ERROR : syntax error, unexpected SEP
[Surveillant] L'ancien DSP reste actif.
```

L'ancien DSP (880 Hz) continue de tourner malgré l'erreur. Corrige le fichier et sauvegarde : le nouveau code sera compilé et le DSP remplacé.

---

## Navigation

→ Fiche suivante : **[02 - Faust et JUCE](02-faust-juce.md)**
