---
tags:
  - Faust
  - Expert
  - Concept
description: "Contribution au projet Faust - dépôt grame-cncm/faust, architecture du compilateur, PRs, tests et communauté"
estimated_time: "105 min"
fiche_number: 2
total_fiches: 5
cursus: "Phase 7 - Maîtrise et contribution"
---

# 02 - Contribution au projet Faust

> **En bref** : À la fin de cette fiche, tu sauras naviguer dans le code source du compilateur Faust, contribuer aux bibliothèques et à la documentation, et participer à la communauté Faust. Lecture estimée : 105 min.


## Prérequis

- Phase 4 complète (DSP appliqué) :
  - [Fiche 01 - Oscillateurs et synthèse](../04-dsp-applique/01-oscillateurs-synthese.md)
  - [Fiche 04 - Modélisation physique](../04-dsp-applique/04-modelisation-physique.md)
- Connaissance de Git : branches, commits, pull requests, merge (voir [Aide-mémoire Git](../../fiches-reference/05-aide-memoire-git.md) si besoin)
- Connaissance de base du C++ : compilation, classes, pointeurs (voir [Fiche 02 - C++ notions essentielles](../02-prerequis-programmation/02-cpp-notions-essentielles.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras naviguer dans le code source du compilateur Faust, contribuer aux bibliothèques et à la documentation, et participer à la communauté Faust.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le dépôt grame-cncm/faust ?

**Définition** : Le dépôt `grame-cncm/faust` est le dépôt GitHub officiel du compilateur Faust. Il contient le code source complet du compilateur (en C++), les bibliothèques standard Faust, les outils associés (faust2xxx), la documentation et les tests. Il est maintenu par GRAME-CNCM (Centre National de Création Musicale, basé à Lyon).

**Le problème que le dépôt centralisé résout** :

Sans dépôt centralisé, voici les problèmes rencontrés :

1. **Fragmentation du code** : le compilateur, les bibliothèques et les outils seraient dispersés sur plusieurs sites. Trouver la bonne version de chaque composant serait difficile
2. **Pas de traçabilité** : sans historique Git centralisé, il serait impossible de savoir qui a modifié quoi, quand et pourquoi. Les régressions seraient difficiles à identifier
3. **Contribution anarchique** : sans processus de pull request et de review, n'importe qui pourrait introduire du code cassé dans le compilateur

**Comment le dépôt centralisé résout ces problèmes** :

| Problème | Solution apportée par le dépôt GitHub |
| -------- | ------------------------------------- |
| Fragmentation du code | Tout est regroupé dans un seul dépôt avec une structure claire |
| Pas de traçabilité | Git conserve l'historique complet de chaque modification |
| Contribution anarchique | Le processus de PR avec review par les mainteneurs garantit la qualité |

**Analogie concrète** : Le dépôt `grame-cncm/faust` est comme le bureau d'études central d'une usine. Tous les plans de fabrication (le code source), les pièces standard (les bibliothèques), les modes d'emploi (la documentation) et les fiches de contrôle qualité (les tests) sont rangés au même endroit. Pour proposer une modification d'un plan, tu soumets une demande de modification (la pull request) qui est vérifiée par les ingénieurs en chef (les mainteneurs) avant d'être intégrée.

**Ce que le dépôt n'est PAS** :

- Le dépôt n'est pas un forum de discussion. Les discussions techniques se font sur les issues GitHub, la mailing list et le Slack. Le dépôt contient uniquement le code et sa documentation technique.
- Le dépôt n'est pas figé. Il évolue activement avec des commits réguliers, des releases et des branches de développement.

#### Structure du dépôt

```text
grame-cncm/faust/
├── compiler/              # Code source du compilateur Faust (C++)
│   ├── parser/            # Analyseur syntaxique (lexer + parser)
│   ├── signals/           # Représentation intermédiaire (arbre de signaux)
│   ├── normalize/         # Passes de normalisation et simplification
│   ├── generator/         # Backends de génération de code
│   │   ├── c/             # Backend C
│   │   ├── cpp/           # Backend C++
│   │   ├── llvm/          # Backend LLVM
│   │   ├── wasm/          # Backend WebAssembly
│   │   ├── rust/          # Backend Rust
│   │   └── ...
│   └── errors/            # Gestion des erreurs et diagnostics
├── architecture/          # Fichiers d'architecture (faust2xxx)
│   ├── jack-qt.cpp        # Architecture JACK + Qt
│   ├── coreaudio-qt.cpp   # Architecture CoreAudio + Qt (macOS)
│   ├── webaudio/          # Architecture Web Audio API
│   └── ...
├── libraries/             # Bibliothèques Faust standard
│   ├── stdfaust.lib       # Fichier d'import principal
│   ├── oscillators.lib    # Oscillateurs (os.*)
│   ├── filters.lib        # Filtres (fi.*)
│   ├── envelopes.lib      # Enveloppes (en.*)
│   ├── physmodels.lib     # Modélisation physique (pm.*)
│   └── ...
├── tests/                 # Suite de tests
│   ├── impulse-tests/     # Tests de non-régression par réponse impulsionnelle
│   ├── codegen-tests/     # Tests de génération de code
│   └── ...
├── tools/                 # Outils annexes (faust2xxx scripts)
├── documentation/         # Documentation technique
├── CMakeLists.txt         # Fichier de build CMake principal
└── README.md              # Présentation du projet
```

#### Branches principales

| Branche | Rôle | Stabilité |
| ------- | ---- | --------- |
| `master-dev` | Branche de développement actif | Instable (peut casser) |
| `master` | Branche stable | Testée, utilisable en production |
| `vX.Y.Z` | Tags de release | Figée, correspond à une version publiée |

#### Releases

Les releases suivent le versionnage sémantique :

```text
Version : X.Y.Z

X = version majeure (changements incompatibles)
Y = version mineure (nouvelles fonctionnalités, rétrocompatible)
Z = patch (corrections de bugs)

Exemple : Faust 2.83.1 (version stable indicative ; vérifie la dernière release sur GitHub GRAME)
  2  = version majeure
  83 = version mineure
  1  = patch
```

---

### Qu'est-ce que l'architecture du compilateur Faust ?

**Définition** : Le compilateur Faust est un programme C++ qui transforme du code source Faust (un fichier `.dsp`) en code dans un autre langage (C++, C, LLVM IR, WebAssembly, Rust, etc.). Cette transformation se fait en trois étapes principales : le frontend (parsing), la normalisation (optimisation de l'arbre de signaux) et le backend (génération de code cible).

**Le problème que cette architecture résout** :

Sans architecture en passes séparées, voici les problèmes rencontrés :

1. **Code monolithique ingérable** : un compilateur qui fait tout en une seule passe serait un bloc de code énorme et impossible à maintenir
2. **Ajout de backends impossible** : pour chaque nouveau langage cible (Rust, WASM, etc.), il faudrait réécrire tout le compilateur
3. **Optimisations difficiles** : sans représentation intermédiaire, les optimisations seraient mélangées avec le parsing et la génération de code

**Comment l'architecture en passes résout ces problèmes** :

| Problème | Solution apportée par l'architecture en passes |
| -------- | ----------------------------------------------- |
| Code monolithique | Chaque passe est un module C++ indépendant avec une responsabilité claire |
| Ajout de backends impossible | Les backends sont interchangeables : on ajoute un nouveau backend sans toucher au frontend ni aux optimisations |
| Optimisations difficiles | Les passes d'optimisation travaillent sur une représentation intermédiaire commune, indépendante du langage source et du langage cible |

**Analogie concrète** : Le compilateur Faust fonctionne comme une chaîne de traduction de documents.
Imagine que tu dois traduire un livre français en 10 langues. Tu ne fais pas 10 traductions indépendantes depuis le français.
Tu traduis d'abord le français en une "langue intermédiaire" simplifiée et structurée (la normalisation).
Ensuite, chaque traducteur spécialisé (le backend) prend cette langue intermédiaire et produit la version finale dans sa langue cible.
Si tu veux ajouter une 11e langue, tu ajoutes un traducteur sans retoucher le livre original ni la langue intermédiaire.

**Ce que le compilateur n'est PAS** :

- Le compilateur Faust n'est pas un interpréteur. Il ne lit pas le code Faust ligne par ligne pour l'exécuter immédiatement. Il génère du code complet dans un autre langage, qui sera ensuite compilé par un compilateur classique (GCC, Clang, etc.).
- Le compilateur Faust n'est pas un compilateur C++. Il est écrit en C++, mais il compile du code Faust (pas du C++).

#### Les trois étapes du compilateur

```text
Pipeline du compilateur Faust :

┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│  FRONTEND   │ → │  NORMALISATION   │ → │   BACKEND   │
│  (parsing)  │    │ (optimisation)   │    │ (génération)│
└─────────────┘    └──────────────────┘    └─────────────┘
     │                     │                      │
     ▼                     ▼                      ▼
Code Faust          Arbre de signaux         Code cible
(.dsp)              simplifié et            (C++, LLVM,
                    optimisé                WASM, Rust...)
```

#### Frontend : parsing du code Faust

Le frontend lit le fichier `.dsp` et construit un arbre de signaux (Signal Tree). Cette étape comprend :

1. **Analyse lexicale** : le code source est découpé en tokens (mots-clés, opérateurs, identifiants, nombres)
2. **Analyse syntaxique** : les tokens sont organisés en un arbre syntaxique abstrait (AST) selon la grammaire de Faust
3. **Propagation des signaux** : l'AST est converti en un arbre de signaux qui représente les flux de données audio échantillon par échantillon

```text
Exemple de parsing :

Code Faust :
  process = _ * 0.5;

Tokens :
  [IDENT:"process"] [ASSIGN:"="] [WIRE:"_"] [MUL:"*"] [NUM:"0.5"] [SEMICOLON:";"]

Arbre de signaux :
  Mul
  ├── Input(0)      // le signal d'entrée "_"
  └── Const(0.5)    // la constante 0.5
```

#### Normalisation : simplification et optimisation

La normalisation transforme l'arbre de signaux pour le simplifier et l'optimiser. Les principales passes sont :

| Passe | Action | Exemple |
| ----- | ------ | ------- |
| Propagation de constantes | Calcule les expressions constantes à la compilation | `440 * 2` devient `880` |
| Élimination de code mort | Supprime les signaux qui ne sont connectés à aucune sortie | Un signal calculé mais jamais utilisé est supprimé |
| Factorisation | Identifie les sous-expressions communes pour ne les calculer qu'une fois | `sin(x) + sin(x)` calcule `sin(x)` une seule fois |
| Simplification algébrique | Applique des identités mathématiques | `x * 1` devient `x`, `x + 0` devient `x` |
| Mise en forme normale | Ordonne les opérations de manière canonique | Facilite la détection de sous-expressions communes |

#### Backend : génération de code

Le backend prend l'arbre de signaux optimisé et génère du code dans le langage cible. Chaque backend est un module C++ séparé.

| Backend | Langage cible | Usage principal |
| ------- | ------------- | --------------- |
| C++ | `fichier.cpp` | Plugins audio (JUCE, JACK, Qt) |
| C | `fichier.c` | Systèmes embarqués |
| LLVM IR | Code intermédiaire LLVM | Compilation JIT (temps réel) |
| WebAssembly | `fichier.wasm` | Applications web (Web Audio API) |
| Rust | `fichier.rs` | Intégration dans des projets Rust |
| Soul | `fichier.soul` | Pipeline audio Soul |
| Interpreter | Bytecode interne | IDE Faust, prototypage rapide |

#### Les passes d'optimisation intermédiaires

En plus de la normalisation, le compilateur applique des optimisations spécifiques selon les options de compilation :

```text
Options d'optimisation du compilateur :

-vec    Active la vectorisation (traitement par blocs d'échantillons)
        Le code généré utilise des boucles SIMD pour traiter
        plusieurs échantillons en parallèle

-sch    Active le scheduling (répartition sur plusieurs threads)
        Les calculs indépendants sont distribués sur les cœurs CPU

-vs N   Définit la taille du vecteur (nombre d'échantillons par bloc)
        Par défaut : 32. Valeurs typiques : 4, 8, 16, 32, 64, 128

-omp    Utilise OpenMP pour la parallélisation
        Alternative au scheduling natif de Faust

-mcd N  Maximum Copy Delay : seuil en échantillons au-delà duquel
        les delays utilisent un buffer circulaire au lieu d'une copie
```

---

### Qu'est-ce que compiler le compilateur ?

**Définition** : Compiler le compilateur signifie transformer le code source C++ du compilateur Faust en un exécutable binaire (`faust`) que tu peux utiliser sur ta machine. Cette opération nécessite un compilateur C++ (GCC ou Clang), CMake (outil de build) et des dépendances optionnelles (LLVM, libmicrohttpd, etc.).

**Le problème que la compilation depuis les sources résout** :

Sans compilation depuis les sources, voici les problèmes rencontrés :

1. **Pas d'accès aux dernières fonctionnalités** : les versions précompilées (packages) ne contiennent que les releases stables. Les corrections de bugs et les nouvelles fonctionnalités sont d'abord disponibles uniquement dans le code source
2. **Impossible de tester ses modifications** : si tu modifies le compilateur (correction de bug, ajout de fonctionnalité), tu dois pouvoir le recompiler pour tester tes changements
3. **Plateformes non supportées** : les binaires précompilés ne sont pas disponibles pour toutes les plateformes. La compilation depuis les sources permet d'installer Faust partout

**Comment la compilation depuis les sources résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas d'accès aux dernières fonctionnalités | Tu compiles directement la branche `master-dev` avec les derniers commits |
| Impossible de tester ses modifications | Tu modifies le code, recompiles et testes immédiatement |
| Plateformes non supportées | CMake s'adapte à la plateforme cible |

**Analogie concrète** : Compiler le compilateur, c'est comme assembler toi-même une machine-outil à partir de ses pièces détachées. La plupart des utilisateurs achètent la machine déjà montée (la version précompilée). Mais si tu veux modifier un composant de la machine (ajouter une fonctionnalité au compilateur), tu dois savoir la démonter, remplacer la pièce et la remonter (compiler depuis les sources).

#### Dépendances

| Dépendance | Obligatoire | Rôle |
| ---------- | ----------- | ---- |
| CMake (>= 3.5) | Oui | Système de build |
| GCC ou Clang | Oui | Compilateur C++ |
| LLVM (>= 15.0) | Non | Backend LLVM (compilation JIT) |
| libmicrohttpd | Non | Serveur HTTP embarqué (faust -httpd) |
| libsndfile | Non | Lecture/écriture de fichiers audio |
| pkg-config | Non | Détection automatique des bibliothèques |

#### Options de build CMake

| Option | Valeur | Effet |
| ------ | ------ | ----- |
| `-DINCLUDE_LLVM=ON` | ON/OFF | Active le backend LLVM (nécessite LLVM installé) |
| `-DINCLUDE_HTTP=ON` | ON/OFF | Active le serveur HTTP embarqué |
| `-DINCLUDE_OSC=ON` | ON/OFF | Active le support OSC |
| `-DCMAKE_BUILD_TYPE=Release` | Debug/Release | Mode de compilation (Debug = avec symboles de débogage) |
| `-DCMAKE_INSTALL_PREFIX=/usr/local` | chemin | Répertoire d'installation |

---

### Qu'est-ce que la suite de tests ?

**Définition** : La suite de tests du compilateur Faust est un ensemble de programmes Faust (.dsp) et de scripts qui vérifient que le compilateur fonctionne correctement. Elle comprend des tests de non-régression (impulse tests) qui comparent la sortie du compilateur à des résultats de référence, et des tests de génération de code qui vérifient que chaque backend produit du code valide.

**Le problème que les tests résolvent** :

Sans tests, voici les problèmes rencontrés :

1. **Régressions silencieuses** : une modification du compilateur peut casser une fonctionnalité existante sans que personne ne s'en aperçoive. Le bug ne serait découvert que des semaines ou des mois plus tard par un utilisateur
2. **Backends incohérents** : le backend C++ et le backend WASM pourraient produire des résultats différents pour le même programme Faust. Sans tests de comparaison, ces incohérences resteraient cachées
3. **Peur de modifier** : sans filet de sécurité, les développeurs hésitent à modifier le compilateur par peur de casser quelque chose

**Comment les tests résolvent ces problèmes** :

| Problème | Solution apportée par les tests |
| -------- | ------------------------------- |
| Régressions silencieuses | Les impulse tests comparent automatiquement la sortie actuelle à la référence. Toute différence est signalée |
| Backends incohérents | Les tests de génération vérifient que chaque backend produit un résultat identique |
| Peur de modifier | Les tests donnent confiance : si tous les tests passent après une modification, elle est probablement correcte |

**Analogie concrète** : Les tests du compilateur sont comme les essais de conformité d'une usine automobile. Après chaque modification sur la chaîne de montage (le compilateur), on fait passer la voiture (le code généré) sur un banc d'essai standardisé (les tests). Si la voiture réussit tous les tests (freinage, vitesse, émissions), la modification est validée. Si un test échoue, la modification est rejetée jusqu'à correction.

#### Types de tests

| Type | Répertoire | Ce qu'il vérifie |
| ---- | ---------- | ---------------- |
| Impulse tests | `tests/impulse-tests/` | La sortie audio est identique à la référence pour chaque programme de test |
| Codegen tests | `tests/codegen-tests/` | Le code généré compile sans erreur dans chaque backend |
| Architecture tests | `tests/architecture-tests/` | Les fichiers d'architecture (faust2xxx) fonctionnent correctement |
| Error tests | `tests/error-tests/` | Le compilateur détecte correctement les erreurs de syntaxe et de type |

---

### Qu'est-ce que contribuer aux bibliothèques ?

**Définition** : Contribuer aux bibliothèques Faust signifie ajouter, corriger ou améliorer les fichiers `.lib` du dépôt `grame-cncm/faustlibraries`. Ces bibliothèques contiennent les fonctions standard que tous les développeurs Faust utilisent quotidiennement : oscillateurs (`os.*`), filtres (`fi.*`), enveloppes (`en.*`), effets (`ef.*`), etc.

**Le problème que les contributions aux bibliothèques résolvent** :

Sans contributions communautaires, voici les problèmes rencontrés :

1. **Bibliothèques incomplètes** : l'équipe GRAME ne peut pas couvrir tous les besoins de tous les utilisateurs. Des fonctions utiles manquent (types d'enveloppes, algorithmes de réverbération, filtres spécialisés)
2. **Bugs non corrigés** : les utilisateurs découvrent des bugs que les mainteneurs n'ont pas rencontrés. Sans processus de contribution, ces bugs restent en attente
3. **Documentation insuffisante** : les fonctions existantes manquent de documentation dans certains cas où d'exemples d'utilisation

**Comment les contributions résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Bibliothèques incomplètes | Les contributeurs ajoutent les fonctions dont ils ont besoin |
| Bugs non corrigés | Les contributeurs proposent des corrections directement via PR |
| Documentation insuffisante | Les contributeurs ajoutent des exemples et de la documentation |

**Analogie concrète** : Les bibliothèques Faust sont comme une boîte à outils partagée dans un atelier communautaire. La direction de l'atelier (GRAME) fournit les outils de base (marteau, tournevis, scie). Mais les artisans (les contributeurs) peuvent ajouter des outils spécialisés (un gabarit de découpe, un guide de perçage) tant qu'ils respectent le format de rangement (les conventions de nommage) et que les autres artisans valident l'outil (la review).

#### Le dépôt faustlibraries

Les bibliothèques sont dans un dépôt séparé : `grame-cncm/faustlibraries`. Ce dépôt est inclus comme sous-module dans le dépôt principal du compilateur.

```text
grame-cncm/faustlibraries/
├── stdfaust.lib           # Import principal (importe toutes les bibliothèques)
├── oscillators.lib        # os.* - oscillateurs
├── filters.lib            # fi.* - filtres
├── envelopes.lib          # en.* - enveloppes
├── delays.lib             # de.* - lignes de retard
├── noises.lib             # no.* - générateurs de bruit
├── maths.lib              # ma.* - constantes et fonctions mathématiques
├── basics.lib             # ba.* - fonctions utilitaires
├── effects.lib            # ef.* - effets audio
├── compressors.lib        # co.* - compresseurs et limiteurs
├── physmodels.lib         # pm.* - modélisation physique
├── reverbs.lib            # re.* - réverbérations
├── signals.lib            # si.* - opérations sur les signaux
├── routes.lib             # ro.* - routage de signaux
├── analyzers.lib          # an.* - analyseurs (RMS, détection de pitch)
├── interpolators.lib      # it.* - interpolation
├── soundfiles.lib         # so.* - fichiers audio
├── platform.lib           # pl.* - fonctions spécifiques à la plateforme
└── README.md
```

#### Conventions de nommage des bibliothèques

| Règle | Exemple correct | Exemple incorrect |
| ----- | --------------- | ----------------- |
| Préfixe de bibliothèque suivi de `.` | `en.adsr` | `adsr` (sans préfixe) |
| Noms en camelCase | `en.smoothEnvelope` | `en.smooth_envelope` |
| Noms descriptifs en anglais | `fi.lowpass3e` | `fi.lp3` (abréviation ambiguë) |
| Chaque fonction documentée avec `declare` | `declare smoothEnvelope author "...";` | Pas de documentation |

#### Documentation d'une fonction de bibliothèque

Chaque fonction de bibliothèque doit être documentée avec des `declare` dans le fichier `.lib` :

```faust
//-----------------------------`(en.)customEnvelope`------------------------------
// Description courte de la fonction.
//
// #### Usage
//
// ```
// en.customEnvelope(attack, release, gate) : _
// ```
//
// Where:
//
// * `attack`: attack time in seconds
// * `release`: release time in seconds
// * `gate`: trigger signal (0 or 1)
//
// #### Reference
//
// <https://lien-vers-reference-si-pertinent>
//-------------------------------------------------------------------------------
customEnvelope(attack, release, gate) = /* implémentation */;
```

---

### Qu'est-ce que contribuer au compilateur ?

**Définition** : Contribuer au compilateur Faust signifie modifier le code source C++ du dépôt `grame-cncm/faust` pour corriger un bug, ajouter une fonctionnalité ou améliorer les performances. C'est un niveau de contribution plus avancé que les bibliothèques, car il nécessite de comprendre l'architecture interne du compilateur.

**Le problème que les contributions au compilateur résolvent** :

Sans contributions au compilateur, voici les problèmes rencontrés :

1. **Bugs bloquants non corrigés** : certains bugs empêchent des utilisateurs de travailler et l'équipe GRAME a des ressources limitées
2. **Fonctionnalités manquantes** : des besoins spécifiques (nouveau backend, nouvelle optimisation, nouveau type de données) ne sont pas prioritaires pour l'équipe principale
3. **Stagnation du projet** : un projet open source qui n'accepte pas de contributions externes perd en dynamisme et en communauté

**Comment les contributions au compilateur résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Bugs bloquants | Les contributeurs identifient, diagnostiquent et corrigent directement les bugs |
| Fonctionnalités manquantes | Les contributeurs implémentent les fonctionnalités dont ils ont besoin |
| Stagnation du projet | Les contributions externes apportent des idées neuves et de l'énergie |

**Analogie concrète** : Contribuer au compilateur est comme participer à la réparation du moteur d'un bus municipal. Le bus (le compilateur) transporte tout le monde (les utilisateurs). Quand le moteur a un problème, le mécanicien principal (GRAME) le répare. Mais si un passager qualifié (un contributeur) repère une fuite et sait la colmater, il peut proposer la réparation. Le mécanicien vérifie le travail (review) avant de remettre le bus en service.

**Ce qu'une contribution au compilateur n'est PAS** :

- Ce n'est pas un droit. Les mainteneurs peuvent refuser une PR si elle ne respecte pas les conventions, si elle casse des tests ou si elle ne correspond pas à la direction du projet.
- Ce n'est pas réservé aux experts. Même une correction de typo dans un message d'erreur ou une amélioration d'un commentaire dans le code source est une contribution valide.

#### Processus de contribution au compilateur

```text
1. Identifier le problème
   ↓
2. Ouvrir une issue sur GitHub
   (décrire le bug ou la feature demandée)
   ↓
3. Discuter avec les mainteneurs
   (valider l'approche avant de coder)
   ↓
4. Forker le dépôt et créer une branche
   ↓
5. Implémenter la modification
   ↓
6. Écrire ou adapter les tests
   ↓
7. Vérifier que tous les tests passent
   ↓
8. Ouvrir une pull request
   ↓
9. Répondre aux commentaires de review
   ↓
10. Merge par un mainteneur
```

#### Conventions de code C++ du compilateur

| Convention | Exemple |
| ---------- | ------- |
| Classes en PascalCase | `SignalVisitor`, `CodeContainer` |
| Méthodes en camelCase | `generateCode()`, `getSignalType()` |
| Variables locales en camelCase | `signalTree`, `delayLength` |
| Constantes en SCREAMING_SNAKE_CASE | `MAX_INPUTS`, `DEFAULT_BUFFER_SIZE` |
| Indentation : 4 espaces | Pas de tabulations |
| Accolades : style Allman (sur la ligne suivante) | Voir exemple ci-dessous |

```cpp
// Style du code du compilateur Faust
class SignalVisitor
{
   public:
    // Constructeur
    SignalVisitor(Tree signal)
        : fSignal(signal)
    {
    }

    // Visite un nœud de l'arbre de signaux
    void visit(Tree node)
    {
        if (isNil(node)) {
            return;
        }
        // Traitement du nœud
        processNode(node);
    }

   private:
    Tree fSignal;  // Préfixe "f" pour les champs de classe
};
```

---

### Qu'est-ce que contribuer à la documentation ?

**Définition** : Contribuer à la documentation Faust signifie ajouter, corriger ou améliorer le contenu du dépôt `grame-cncm/faustdoc`. Ce dépôt contient la documentation officielle de Faust, rédigée en Markdown et publiée sur le site faustdoc.grame.fr. Il couvre le langage, le compilateur, les bibliothèques et les outils.

**Le problème que les contributions à la documentation résolvent** :

Sans contributions à la documentation, voici les problèmes rencontrés :

1. **Documentation obsolète** : les nouvelles fonctionnalités du compilateur ou des bibliothèques ne sont pas toujours documentées immédiatement
2. **Exemples manquants** : les utilisateurs ont besoin d'exemples concrets pour comprendre les fonctions. Les développeurs du compilateur n'ont pas toujours le temps d'en écrire
3. **Erreurs dans la doc** : des exemples de code qui ne compilent plus, des paramètres mal décrits, des liens cassés

**Comment les contributions à la documentation résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Documentation obsolète | Les contributeurs ajoutent la doc des nouvelles fonctionnalités |
| Exemples manquants | Les contributeurs écrivent des exemples tirés de leur expérience |
| Erreurs dans la doc | Les contributeurs corrigent directement via PR |

**Analogie concrète** : La documentation est comme le mode d'emploi d'un appareil électroménager. Le fabricant (GRAME) écrit le mode d'emploi initial. Mais les utilisateurs (les contributeurs) découvrent des astuces, des cas d'usage non documentés et des erreurs. En contribuant au mode d'emploi, ils aident tous les futurs utilisateurs.

#### Structure du dépôt faustdoc

```text
grame-cncm/faustdoc/
├── docs/
│   ├── manual/            # Manuel de référence du langage
│   │   ├── syntax.md      # Syntaxe Faust
│   │   ├── operators.md   # Opérateurs de composition
│   │   ├── primitives.md  # Primitives du langage
│   │   └── ...
│   ├── tutorials/         # Tutoriels pas à pas
│   ├── workshops/         # Matériel de workshops
│   └── ...
├── mkdocs.yml             # Configuration MkDocs
└── README.md
```

---

### Qu'est-ce que la communauté Faust ?

**Définition** : La communauté Faust est l'ensemble des développeurs, chercheurs, musiciens et artistes qui utilisent et contribuent au langage Faust. Elle s'organise autour de canaux de communication (mailing list, Slack), de conférences (IFC) et de workshops organisés par GRAME.

**Le problème que la communauté résout** :

Sans communauté, voici les problèmes rencontrés :

1. **Isolation** : chaque développeur travaille seul, sans pouvoir poser de questions ni partager ses découvertes
2. **Duplication d'efforts** : plusieurs personnes peuvent résoudre le même problème indépendamment, sans savoir que la solution existe déjà
3. **Pas de retour utilisateur** : les mainteneurs ne savent pas comment le langage est utilisé en pratique, quelles fonctionnalités manquent ou quels bugs sont les plus gênants

**Comment la communauté résout ces problèmes** :

| Problème | Solution apportée par la communauté |
| -------- | ----------------------------------- |
| Isolation | La mailing list et le Slack permettent de poser des questions et d'obtenir des réponses rapidement |
| Duplication d'efforts | Le partage de code et de bibliothèques évite de réinventer la roue |
| Pas de retour utilisateur | Les conférences et les issues GitHub fournissent un retour direct aux mainteneurs |

**Analogie concrète** : La communauté Faust est comme une guilde d'artisans spécialisés. Chaque artisan a ses compétences propres (DSP, plugins, web audio, recherche). La guilde organise des réunions régulières (les conférences IFC) où les artisans partagent leurs techniques, présentent leurs créations et apprennent les uns des autres. Entre les réunions, ils communiquent par messages (la mailing list et le Slack).

#### Canaux de communication

| Canal | URL / accès | Usage |
| ----- | ----------- | ----- |
| Mailing list faust-dev | `sourceforge.net/projects/faudiostream/` | Questions techniques, annonces, discussions de design |
| Slack Faust | Invitation via le site GRAME | Discussions informelles, aide rapide, partage de code |
| GitHub Issues | `github.com/grame-cncm/faust/issues` | Rapports de bugs, demandes de fonctionnalités |
| GitHub Discussions | `github.com/grame-cncm/faust/discussions` | Questions générales, idées, showcase |

#### Conférences et événements

| Événement | Fréquence | Description |
| --------- | --------- | ----------- |
| IFC (International Faust Conférence) | Tous les 2 ans | Conférence académique dédiée à Faust : présentations, papers, workshops |
| NIME (New Interfaces for Musical Expression) | Annuel | Conférence sur les interfaces musicales (Faust y est souvent présenté) |
| DAFx (Digital Audio Effects) | Annuel | Conférence sur les effets audio numériques |
| Workshops GRAME | Ponctuels | Ateliers pratiques organisés par GRAME à Lyon |
| Linux Audio Conférence | Annuel | Conférence sur l'audio sous Linux |

---

### Qu'est-ce que la gouvernance du projet Faust ?

**Définition** : La gouvernance du projet Faust définit qui prend les décisions, qui peut intégrer du code et sous quelles licences le code est distribué. Le projet est maintenu par GRAME-CNCM, un centre national de création musicale basé à Lyon (France). GRAME emploie les développeurs principaux du compilateur et assure la pérennité du projet.

**Le problème que la gouvernance résout** :

Sans gouvernance claire, voici les problèmes rencontrés :

1. **Conflits de direction** : sans autorité décisionnelle, les contributeurs pourraient vouloir emmener le projet dans des directions incompatibles
2. **Incertitude juridique** : sans licence claire, les utilisateurs ne savent pas s'ils peuvent utiliser Faust dans leurs projets commerciaux
3. **Abandon possible** : un projet sans structure institutionnelle peut mourir si son créateur arrête de le maintenir

**Comment la gouvernance résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Conflits de direction | GRAME a le mot final sur les décisions techniques et la roadmap |
| Incertitude juridique | Les licences sont clairement définies (GPL pour le compilateur, LGPL pour les bibliothèques) |
| Abandon possible | GRAME est une institution publique avec un financement pérenne |

**Analogie concrète** : La gouvernance de Faust fonctionne comme celle d'un parc national. Le parc (le projet Faust) est géré par un organisme public (GRAME). Les visiteurs (les utilisateurs) peuvent profiter du parc librement. Les bénévoles (les contributeurs) peuvent planter des arbres et entretenir les sentiers, mais c'est l'organisme qui décide du plan d'aménagement global.

#### Licences

| Composant | Licence | Ce que cela signifie |
| --------- | ------- | -------------------- |
| Compilateur Faust | GPL v2 | Le compilateur est libre. Si tu le modifies et le redistribues, tu dois partager tes modifications sous GPL |
| Bibliothèques Faust | LGPL | Tu peux utiliser les bibliothèques dans des projets commerciaux sans publier ton code. Tu dois partager les modifications des bibliothèques elles-mêmes |
| Code généré par Faust | Pas de restriction | Le code C++, WASM, etc. généré par le compilateur t'appartient. Tu peux le distribuer sous la licence de ton choix |

#### Contributeurs principaux

| Personne | Rôle |
| -------- | ---- |
| Yann Orlarey | Créateur de Faust, directeur scientifique de GRAME |
| Stéphane Letz | Développeur principal du compilateur et des outils |
| Romain Michon | Développeur, bibliothèques (dont la Physical Modeling Library `pm.*`) et architectures |
| Dominique Fober | Développeur, recherche et formalisation |

---

### Quelles sont les bonnes pratiques pour contribuer ?

**Définition** : Les bonnes pratiques de contribution sont un ensemble de recommandations pour maximiser les chances qu'une contribution soit acceptée et pour rendre le processus agréable pour tout le monde (contributeur et mainteneurs).

**Le problème que les bonnes pratiques résolvent** :

Sans bonnes pratiques, voici les problèmes rencontrés :

1. **PR rejetées** : une contribution techniquement correcte peut être rejetée si elle ne respecte pas les conventions, si elle manque de tests ou si elle n'a pas été discutée en amont
2. **Temps perdu** : un contributeur peut passer des heures sur une fonctionnalité que les mainteneurs ne veulent pas intégrer
3. **Frustration mutuelle** : des échanges tendus entre contributeurs et mainteneurs quand les attentes ne sont pas alignées

**Comment les bonnes pratiques résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| PR rejetées | Respecter les conventions et discuter avant de coder réduit fortement les rejets |
| Temps perdu | Ouvrir une issue d'abord permet de valider l'intérêt de la contribution |
| Frustration mutuelle | Des attentes claires et un processus transparent évitent les malentendus |

**Analogie concrète** : Les bonnes pratiques de contribution sont comme les règles d'un concours de cuisine. Tu peux cuisiner le meilleur plat du monde, mais si tu ne respectes pas les contraintes (ingrédients imposés, temps limité, présentation) ton plat sera disqualifié. Les règles ne sont pas là pour t'empêcher de cuisiner, mais pour que le jury (les mainteneurs) puisse évaluer ton travail de manière juste et efficace.

#### Recommandations par ordre de difficulté

| Niveau | Type de contribution | Pourquoi commencer par là |
| ------ | -------------------- | ------------------------- |
| 1 (débutant) | Corriger une typo ou améliorer un commentaire | Aucune connaissance du compilateur nécessaire |
| 2 (débutant) | Améliorer la documentation (faustdoc) | Connaissance du langage Faust suffisante |
| 3 (intermédiaire) | Écrire un exemple d'utilisation | Montre que tu maîtrises les bibliothèques |
| 4 (intermédiaire) | Ajouter une fonction de bibliothèque | Premier vrai code Faust contributif |
| 5 (avancé) | Corriger un bug du compilateur | Nécessite de comprendre l'architecture interne |
| 6 (expert) | Ajouter une fonctionnalité au compilateur | Nécessite de maîtriser le code C++ du compilateur |

---

## Étapes Pratiques

### Étape 1 : Cloner et compiler le compilateur Faust depuis les sources

On clone le dépôt officiel et on compile le compilateur Faust sur ta machine.

Commande :

```bash
# Cloner le dépôt principal avec les sous-modules (inclut les bibliothèques)
git clone --recurse-submodules https://github.com/grame-cncm/faust.git

# Se placer dans le dépôt
cd faust

# Créer un dossier de build séparé (bonne pratique CMake)
mkdir build && cd build

# Configurer le build avec CMake
# -DCMAKE_BUILD_TYPE=Release : compilation optimisée
# Les backends LLVM et HTTP sont désactivés par défaut (plus simple pour commencer)
cmake .. -DCMAKE_BUILD_TYPE=Release

# Compiler le compilateur (utiliser tous les cœurs CPU disponibles)
# Le nombre après -j dépend de ta machine (4 pour un quad-core, 8 pour un octa-core)
make -j$(nproc 2>/dev/null || sysctl -n hw.ncpu)
```

**Résultat attendu** :

```text
-- The C compiler identification is ...
-- The CXX compiler identification is ...
-- Configuring done
-- Generating done
-- Build files have been written to: /chemin/vers/faust/build
...
[100%] Built target faust

L'exécutable "faust" se trouve dans build/bin/faust
```

Vérifie que le compilateur fonctionne :

```bash
# Afficher la version du compilateur fraîchement compilé
./bin/faust --version
```

**Résultat attendu** :

```text
FAUST Version X.Y.Z
```

---

### Étape 2 : Explorer la structure du code source

On examine les dossiers principaux pour comprendre l'organisation du code.

Commande :

```bash
# Remonter à la racine du dépôt
cd /chemin/vers/faust

# Voir la structure des dossiers principaux (2 niveaux de profondeur)
find compiler -maxdepth 2 -type d | sort

# Compter le nombre de fichiers C++ dans le compilateur
find compiler -name "*.cpp" | wc -l

# Compter le nombre de fichiers d'en-tête
find compiler -name "*.hh" -o -name "*.h" | wc -l

# Voir les bibliothèques incluses
ls libraries/
```

**Résultat attendu** :

```text
compiler
compiler/errors
compiler/extended
compiler/generator
compiler/generator/c
compiler/generator/cpp
compiler/generator/llvm
compiler/generator/rust
compiler/generator/wasm
...
compiler/normalize
compiler/parser
compiler/signals
compiler/transform
compiler/typing

Environ 150-200 fichiers .cpp
Environ 150-200 fichiers .hh ou .h

analyzers.lib    envelopes.lib    maths.lib       physmodels.lib   signals.lib
basics.lib       filters.lib      misceffects.lib  platform.lib     soundfiles.lib
compressors.lib  interpolators.lib  noises.lib     reverbs.lib      stdfaust.lib
delays.lib       oscillators.lib  routes.lib
```

Explore le fichier principal du compilateur pour comprendre le point d'entrée :

```bash
# Le point d'entrée du compilateur est dans compiler/
# Chercher la fonction main
grep -rn "int main" compiler/ --include="*.cpp" | head -5
```

**Résultat attendu** :

```text
compiler/main.cpp:XX: int main(int argc, const char* argv[])
```

---

### Étape 3 : Lancer la suite de tests

On exécute les tests pour vérifier que le compilateur compilé fonctionne correctement.

Commande :

```bash
# Se placer dans le dossier de tests
cd /chemin/vers/faust/tests

# Lister les types de tests disponibles
ls

# Lancer les impulse tests (tests de non-régression)
# Ces tests compilent chaque fichier .dsp de test et comparent
# la sortie à la référence
cd impulse-tests

# Lancer le script de test (peut prendre plusieurs minutes)
# L'option -c spécifie le backend à tester (cpp = C++)
./test.sh -c cpp

# Vérifier les résultats
echo "Tests terminés. Vérifier les résultats ci-dessus."
```

**Résultat attendu** :

```text
Testing file1.dsp... OK
Testing file2.dsp... OK
Testing file3.dsp... OK
...
All tests passed (ou un résumé des tests réussis/échoués)
```

Si des tests échouent après une modification, cela signifie que ta modification a introduit une régression. Tu dois corriger le problème avant de proposer une PR.

---

### Étape 4 : Créer une fonction de bibliothèque simple et proposer une PR

On crée une nouvelle fonction d'enveloppe dans `envelopes.lib` et on prépare une pull request.

Commençons par créer et tester la fonction localement :

```faust
// Fichier de test : test_custom_envelope.dsp
// On teste notre nouvelle enveloppe avant de la proposer

import("stdfaust.lib");

// Enveloppe AHR (Attack-Hold-Release) :
// Monte pendant "attack" secondes, reste au maximum pendant "hold" secondes,
// puis descend pendant "release" secondes.
// Utile pour des sons percussifs avec un plateau contrôlable.
ahr(attack, hold, release, gate) = env
with {
    // Détection du front montant de gate
    trig = gate > gate';

    // Compteur d'échantillons depuis le dernier trigger
    counter = +(1) ~ *(1 - trig);

    // Durées en échantillons
    attackSamples = int(attack * ma.SR);
    holdSamples = int(hold * ma.SR);
    releaseSamples = int(release * ma.SR);

    // Phase d'attaque : montée linéaire de 0 à 1
    attackPhase = min(counter, attackSamples) / max(1, attackSamples);

    // Phase de hold : reste à 1
    // Phase de release : descente linéaire de 1 à 0
    releaseStart = attackSamples + holdSamples;
    releasePhase = max(0, 1 - max(0, counter - releaseStart) /
        max(1, releaseSamples));

    // Enveloppe complète : attaque puis hold+release
    env = min(attackPhase, releasePhase);
};

// Test : un oscillateur avec l'enveloppe AHR
attack = hslider("[1]attack", 0.01, 0.001, 1, 0.001);
hold = hslider("[2]hold", 0.1, 0, 1, 0.01);
release = hslider("[3]release", 0.3, 0.01, 2, 0.01);
gate = button("[4]gate");

process = os.osc(440) * ahr(attack, hold, release, gate) * 0.5;
```

Teste la fonction :

```bash
# Compiler et tester l'enveloppe AHR
faust2caqt test_custom_envelope.dsp
```

**Résultat attendu** :

```text
- Quand tu appuies sur "gate" :
  - Le son monte progressivement pendant "attack" secondes
  - Le son reste au volume maximum pendant "hold" secondes
  - Le son descend progressivement pendant "release" secondes
  - Le son s'éteint complètement à la fin du release
```

Une fois la fonction testée, prépare la PR :

```bash
# Forker le dépôt grame-cncm/faustlibraries sur GitHub (via l'interface web)

# Cloner ton fork
git clone https://github.com/TON-USERNAME/faustlibraries.git
cd faustlibraries

# Créer une branche pour ta contribution
git checkout -b add-ahr-envelope

# Ouvrir envelopes.lib dans ton éditeur et ajouter la fonction ahr
# en respectant le format de documentation du fichier (voir conventions)

# Ajouter un fichier de test dans le dépôt principal
# tests/impulse-tests/archs/add-ahr-test.dsp

# Committer avec un message descriptif
git add envelopes.lib
git commit -m "Add AHR (Attack-Hold-Release) envelope to envelopes.lib"

# Pousser la branche sur ton fork
git push origin add-ahr-envelope

# Créer la PR sur GitHub (via l'interface web ou gh CLI)
```

---

### Étape 5 : Contribuer à la documentation

On corrige ou améliore une page de la documentation officielle.

Commande :

```bash
# Cloner le dépôt de documentation
git clone https://github.com/grame-cncm/faustdoc.git
cd faustdoc

# Installer les dépendances pour la prévisualisation locale
pip install mkdocs mkdocs-material

# Lancer le serveur de prévisualisation
mkdocs serve
```

**Résultat attendu** :

```text
INFO    -  Building documentation...
INFO    -  Cleaning site directory
INFO    -  Documentation built in X.XX seconds
INFO    -  [HH:MM:SS] Serving on http://127.0.0.1:8000/
```

Ouvre `http://127.0.0.1:8000/` dans ton navigateur pour voir la documentation. Identifie une page à améliorer (exemple manquant, explication confuse, lien cassé), modifie le fichier Markdown correspondant, et vérifie le rendu en temps réel.

```bash
# Créer une branche pour ta contribution
git checkout -b improve-filters-doc

# Modifier le fichier concerné (exemple : ajouter un exemple dans la page filtres)
# docs/manual/syntax.md ou le fichier pertinent

# Vérifier que le build passe sans erreur
mkdocs build --strict

# Committer et pousser
git add docs/
git commit -m "Add practical example for fi.lowpass function"
git push origin improve-filters-doc

# Créer la PR sur GitHub
```

**Résultat attendu** :

```text
INFO    -  Building documentation...
INFO    -  Documentation built in X.XX seconds

Si le build réussit sans warning ni erreur, la documentation est valide.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `git clone --recurse-submodules https://github.com/grame-cncm/faust.git` | Cloner le dépôt Faust avec les bibliothèques |
| `cmake .. -DCMAKE_BUILD_TYPE=Release` | Configurer le build en mode Release |
| `make -j$(nproc)` | Compiler avec tous les cœurs CPU |
| `./bin/faust --version` | Vérifier la version du compilateur compilé |
| `./tests/impulse-tests/test.sh -c cpp` | Lancer les tests de non-régression (backend C++) |
| `git checkout -b nom-de-branche` | Créer une branche pour ta contribution |
| `git push origin nom-de-branche` | Pousser ta branche sur ton fork |
| `mkdocs serve` | Prévisualiser la documentation localement |
| `mkdocs build --strict` | Vérifier que la documentation compile sans erreur |

---

## Pièges Fréquents

### Piège 1 : Oublier les sous-modules lors du clone

**Problème** : Tu clones le dépôt sans `--recurse-submodules`. Les bibliothèques (dossier `libraries/`) sont vides. Le compilateur compile mais ne trouve pas les bibliothèques standard quand tu essaies de compiler un fichier `.dsp`.

**Solution** : Toujours cloner avec `--recurse-submodules`, ou initialiser les sous-modules après coup :

```bash
# Si tu as déjà cloné sans les sous-modules
git submodule update --init --recursive
```

---

### Piège 2 : Ne pas discuter avant de coder

**Problème** : Tu passes 20 heures à implémenter une fonctionnalité, tu ouvres une PR, et les mainteneurs te disent qu'ils ne veulent pas cette fonctionnalité, ou qu'ils la veulent implémentée différemment.

**Solution** : Toujours ouvrir une issue d'abord pour décrire ce que tu veux faire et demander l'avis des mainteneurs. Attends leur feu vert avant de commencer à coder.

```text
Titre de l'issue : [Feature request] Add AHR envelope to envelopes.lib

Contenu :

## Description
I would like to add an Attack-Hold-Release (AHR) envelope to envelopes.lib.
This envelope is useful for percussive sounds with a controllable plateau.

## Proposed API
en.ahr(attack, hold, release, gate) : _

## Use case
[Décrire un cas d'usage concret]

## Implementation plan
[Décrire brièvement l'approche technique]
```

---

### Piège 3 : Proposer une PR sans tests

**Problème** : Ta PR modifie le compilateur ou une bibliothèque, mais tu ne fournis aucun test. Les mainteneurs doivent écrire les tests eux-mêmes, ce qui ralentit la review et diminue les chances d'acceptation.

**Solution** : Toujours accompagner une PR de tests. Pour une fonction de bibliothèque, crée un fichier `.dsp` qui exerce la fonction. Pour une modification du compilateur, ajoute un test dans `tests/impulse-tests/` :

```faust
// Test pour l'enveloppe AHR
// Ce fichier vérifie que l'enveloppe produit les bonnes valeurs
import("stdfaust.lib");

// Enveloppe avec des paramètres fixes pour un test reproductible
// attack = 0.01s, hold = 0.05s, release = 0.1s
process = en.ahr(0.01, 0.05, 0.1, 1);
```

---

### Piège 4 : Modifier la branche master directement

**Problème** : Tu fais tes modifications directement sur la branche `master` de ton fork. Quand tu veux synchroniser avec le dépôt officiel, tu as des conflits de merge.

**Solution** : Toujours travailler sur une branche dédiée. Garder `master` synchronisée avec le dépôt officiel :

```bash
# Ajouter le dépôt officiel comme remote "upstream"
git remote add upstream https://github.com/grame-cncm/faust.git

# Synchroniser ton master avec le dépôt officiel
git checkout master
git fetch upstream
git merge upstream/master

# Créer une branche de travail depuis master à jour
git checkout -b ma-contribution
```

---

### Piège 5 : Ignorer les conventions de nommage des bibliothèques

**Problème** : Tu nommes ta fonction `my_cool_filter` au lieu de suivre la convention camelCase avec préfixe. Les mainteneurs te demandent de renommer, ce qui retarde l'acceptation de la PR.

**Solution** : Vérifier les conventions du fichier `.lib` cible avant de commencer :

```faust
// Incorrect : underscore, pas de préfixe
my_cool_filter(fc, q) = /* ... */;

// Correct : camelCase avec le préfixe de la bibliothèque
// (ici fi. pour filters.lib)
coolFilter(fc, q) = /* ... */;
// Utilisé comme : fi.coolFilter(1000, 0.7)
```

---

## Checklist de Validation

- [ ] Je sais où trouver le code source du compilateur Faust sur GitHub (`grame-cncm/faust`)
- [ ] Je connais la structure du dépôt (compiler/, libraries/, tests/, architecture/)
- [ ] Je sais expliquer les trois étapes du compilateur (frontend, normalisation, backend)
- [ ] Je sais cloner le dépôt avec les sous-modules et compiler le compilateur depuis les sources
- [ ] Je sais lancer la suite de tests et interpréter les résultats
- [ ] Je connais le dépôt `grame-cncm/faustlibraries` et ses conventions de nommage
- [ ] Je sais préparer une PR pour une fonction de bibliothèque (code, test, documentation)
- [ ] Je connais le dépôt `grame-cncm/faustdoc` et le processus de contribution à la documentation
- [ ] Je connais les canaux de communication de la communauté Faust (mailing list, Slack, IFC)
- [ ] Je sais que le compilateur est sous GPL, les bibliothèques sous LGPL et le code généré est libre

---

## Exercice Pratique

**Énoncé** : Identifie une fonction manquante ou une amélioration dans une bibliothèque Faust. Par exemple, un nouveau type d'enveloppe dans `envelopes.lib`. Implémente cette fonction en respectant les conventions de nommage, écris un exemple d'utilisation et un test, et prépare une PR complète (description, test, documentation).

Voici un scénario concret : ajouter une enveloppe `AHDSR` (Attack-Hold-Decay-Sustain-Release) à `envelopes.lib`. Cette enveloppe étend l'enveloppe ADSR classique en ajoutant une phase de "hold" entre l'attaque et le decay, pendant laquelle le signal reste au maximum.

**Indications** :

- Forke le dépôt `grame-cncm/faustlibraries`
- Crée une branche `add-ahdsr-envelope`
- Implémente `ahdsr(attack, hold, decay, sustain, release, gate)` dans `envelopes.lib`
- Respecte le format de documentation : commentaire `//----...` avec `#### Usage`, `Where:`, description des paramètres
- Crée un fichier de test `test_ahdsr.dsp` qui utilise l'enveloppe avec un oscillateur
- Écris la description de la PR avec : un résumé, le cas d'usage, un exemple de code et la mention des tests
- Vérifie que la compilation fonctionne : `faust test_ahdsr.dsp -o /dev/null`

**Résultat attendu** :

- Un fork du dépôt `faustlibraries` avec une branche `add-ahdsr-envelope`
- La fonction `ahdsr` ajoutée dans `envelopes.lib` avec la documentation au format standard
- Un fichier `test_ahdsr.dsp` qui compile sans erreur et produit un son correct
- Une description de PR prête à être soumise

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. La fonction `ahdsr` à ajouter dans `envelopes.lib`

```faust
//---------------------------`(en.)ahdsr`-----------------------------------------
// Attack-Hold-Decay-Sustain-Release envelope. Attempt the envelope when
// `gate` transitions from 0 to 1, release when `gate` transitions from 1 to 0.
// The hold phase keeps the signal at maximum (1.0) between the attack and decay
// phases. This is useful for brass-like or organ-like sounds where the attack
// reaches full volume and stays there briefly before decaying to the sustain
// level.
//
// #### Usage
//
// ```
// en.ahdsr(attack, hold, decay, sustain, release, gate) : _
// ```
//
// Where:
//
// * `attack`: attack time in seconds (ramp from 0 to 1)
// * `hold`: hold time in seconds (stay at 1.0 after attack)
// * `decay`: decay time in seconds (ramp from 1 to sustain level)
// * `sustain`: sustain level (between 0 and 1)
// * `release`: release time in seconds (ramp from sustain to 0)
// * `gate`: trigger signal (1 = note on, 0 = note off)
//------------------------------------------------------------------------------
ahdsr(attack, hold, decay, sustain, release, gate) = env
letrec {
    // 'env' est la valeur de l'enveloppe (entre 0 et 1)
    // On utilise letrec pour définir un système récursif à état
    'env = currentEnv
    with {
        // Durées en échantillons
        attackSamples = max(1, int(attack * ma.SR));
        holdSamples = max(1, int(hold * ma.SR));
        decaySamples = max(1, int(decay * ma.SR));
        releaseSamples = max(1, int(release * ma.SR));

        // Détection de front montant (gate passe de 0 à 1)
        trigAttack = gate > gate';

        // Compteur d'échantillons depuis le dernier trigger
        // Se remet à 0 au front montant de gate
        counter = ba.countup(attackSamples + holdSamples + decaySamples +
            releaseSamples + ma.SR, gate : ba.impulsify) ;

        // Phase d'attaque : montée linéaire de 0 à 1
        attackEnv = min(1.0, counter / attackSamples);

        // Phase de hold : reste à 1
        holdEnd = attackSamples + holdSamples;

        // Phase de decay : descente linéaire de 1 à sustain
        decayEnd = holdEnd + decaySamples;
        decayEnv = select2(counter > holdEnd,
            1.0,
            max(sustain, 1.0 - (1.0 - sustain) *
                (counter - holdEnd) / decaySamples));

        // Enveloppe pendant le gate (attaque + hold + decay + sustain)
        gateEnv = select2(counter > attackSamples,
            attackEnv,
            select2(counter > holdEnd,
                1.0,
                select2(counter > decayEnd,
                    decayEnv,
                    sustain)));

        // Phase de release : descente depuis le niveau actuel vers 0
        releaseEnv = env * max(0.0, 1.0 - (1.0 / releaseSamples));

        // Sélection : gate actif = phase attaque/hold/decay/sustain
        //             gate inactif = phase release
        currentEnv = select2(gate, releaseEnv, gateEnv);
    };
};
```

### 2. Le fichier de test `test_ahdsr.dsp`

```faust
import("stdfaust.lib");

// --- Contrôles ---
attack = hslider("[1]attack", 0.05, 0.001, 1, 0.001);
hold = hslider("[2]hold", 0.1, 0, 1, 0.01);
decay = hslider("[3]decay", 0.2, 0.01, 2, 0.01);
sustain = hslider("[4]sustain", 0.7, 0, 1, 0.01);
release = hslider("[5]release", 0.3, 0.01, 2, 0.01);
gate = button("[6]gate");

// --- Test de l'enveloppe AHDSR ---
// On applique l'enveloppe sur un oscillateur sinusoïdal à 440 Hz
process = os.osc(440) * en.ahdsr(attack, hold, decay, sustain, release, gate)
    * 0.5;
```

### 3. Vérification de la compilation

```bash
# Vérifier que le fichier compile sans erreur
faust test_ahdsr.dsp -o /dev/null

# Compiler et tester avec une interface audio
faust2caqt test_ahdsr.dsp
```

**Résultat attendu** :

```text
Compilation :
  Pas d'erreur, pas de warning

Test audio :
  1. Appuyer sur "gate" :
     - Le son monte pendant 0.05s (attack)
     - Le son reste au maximum pendant 0.1s (hold)
     - Le son descend vers 70% pendant 0.2s (decay)
     - Le son reste à 70% (sustain) tant que gate est enfoncé

  2. Relâcher "gate" :
     - Le son descend de 70% vers 0 pendant 0.3s (release)
     - Le son s'éteint complètement
```

### 4. Description de la PR

```text
Titre : Add AHDSR (Attack-Hold-Decay-Sustain-Release) envelope to envelopes.lib

Summary :
  Add en.ahdsr(attack, hold, decay, sustain, release, gate) to envelopes.lib.
  This envelope extends the classic ADSR by adding a "hold" phase between
  attack and decay. During the hold phase, the envelope stays at maximum (1.0)
  for a specified duration before decaying to the sustain level.

Use case :
  - Brass-like sounds where the attack reaches full volume and holds briefly
  - Organ-like sounds with a strong initial presence before settling
  - Sound effects that need a guaranteed minimum duration at full volume

API :
  en.ahdsr(attack, hold, decay, sustain, release, gate) : _

Tests :
  - test_ahdsr.dsp : functional test with oscillator and UI controls
  - Verified compilation with : faust test_ahdsr.dsp -o /dev/null

Checklist :
  [x] Follows naming conventions (camelCase, en. prefix)
  [x] Documentation follows standard format (Usage, Where, Reference)
  [x] Test file provided
  [x] Compiles without errors or warnings
```

**Points à observer dans la solution** :

- La documentation de la fonction suit exactement le format des autres fonctions de `envelopes.lib` : commentaire avec tirets, `#### Usage`, bloc de code, `Where:` avec la liste des paramètres.
- Le nom `ahdsr` suit la convention camelCase et s'inscrit naturellement à côté de `adsr`, `ar`, `asr` déjà présents dans la bibliothèque.
- Le fichier de test est simple et autonome : tu le compiles pour vérifier que la fonction fonctionne.
- La description de la PR est structurée avec un résumé, un cas d'usage, l'API, les tests et une checklist. Cela facilite la review par les mainteneurs.
- On a choisi une contribution de niveau 4 (fonction de bibliothèque), qui est le bon point d'entrée pour un premier contributeur. Les contributions au compilateur (niveaux 5-6) viendront après avoir acquis de l'expérience avec le processus.

---

## Navigation

← Fiche précédente : **[01 - Optimisation et performance](01-optimisation-performance.md)**

→ Fiche suivante : **[03 - Recherche et innovation](03-recherche-innovation.md)**
