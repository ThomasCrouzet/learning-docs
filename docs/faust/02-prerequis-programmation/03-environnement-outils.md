---
tags:
  - Faust
  - Débutant
  - Pratique
description: "Environnement et outils - installation de Faust, JACK, outils de compilation et workflow de développement"
estimated_time: "125 min"
fiche_number: 3
total_fiches: 3
cursus: "Phase 2 - Prérequis programmation"
---

# 03 - Environnement et outils

> **En bref** : À la fin de cette fiche, tu sauras installer Faust et ses outils, configurer JACK, compiler et exécuter un premier programme Faust, et visualiser son circuit de signal. Lecture estimée : 125 min.


## Prérequis

- [Fiche 01 - Programmation fonctionnelle - concepts](01-programmation-fonctionnelle-concepts.md)
- [Fiche 02 - C++ : notions essentielles](02-cpp-notions-essentielles.md)
- Savoir utiliser le terminal (ligne de commande)
- Git installé sur ta machine (pour cloner le dépôt Faust)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Faust et ses outils, configurer JACK, compiler et exécuter un premier programme Faust, et visualiser son circuit de signal.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le compilateur Faust ?

**Définition** : Le compilateur Faust (`faust`) est un programme en ligne de commande qui transforme un fichier source `.dsp` (Faust) en code C++, C, Rust, WebAssembly ou d'autres langages cibles.

**Le problème que le compilateur Faust résout** :

Sans le compilateur Faust, voici les problèmes rencontrés :

1. **Écrire du DSP en C++ est complexe** : Le traitement du signal en C++ demande des centaines de lignes de code pour gérer les boucles d'échantillons, les buffers, les optimisations vectorielles. Un filtre passe-bas en C++ fait 50 lignes. En Faust, il en fait 3.

2. **Le code DSP n'est pas portable** : Un plugin audio écrit pour JACK ne fonctionne pas dans un navigateur web. Il faut réécrire le code pour chaque plateforme cible.

3. **L'optimisation est difficile** : Écrire du code DSP performant (vectorisation SIMD, parallélisation) demande une expertise en architecture processeur que peu de développeurs audio possèdent.

**Comment le compilateur Faust résout ces problèmes** :

| Problème | Solution apportée par le compilateur Faust |
| --- | --- |
| Complexité du C++ pour le DSP | Tu écris en Faust (haut niveau), le compilateur génère le C++ optimisé |
| Code non portable | Le même fichier `.dsp` compile vers JACK, LV2, VST, WebAssembly, etc. |
| Optimisation difficile | Le compilateur applique automatiquement la vectorisation et les optimisations |

**Analogie concrète** : Le compilateur Faust fonctionne comme un traducteur professionnel. Tu écris ta recette de cuisine en français (Faust), et le traducteur la convertit en anglais (C++), en espagnol (Rust) ou en japonais (WebAssembly). La recette reste la même, mais chaque traduction respecte les conventions de la langue cible.

**Ce que le compilateur Faust n'est PAS** :

- Le compilateur Faust n'est pas un logiciel audio. Il ne produit aucun son. Il transforme du code source en code cible. C'est le programme compilé ensuite (avec `g++` par exemple) qui produit du son.
- Le compilateur Faust n'est pas un éditeur de code. Tu écris ton code dans un éditeur (VS Code) et tu appelles le compilateur depuis le terminal.

**Options principales du compilateur** :

| Option | Rôle | Exemple |
| --- | --- | --- |
| `-a` | Spécifie le fichier d'architecture (wrapper) | `faust -a jack-qt.cpp` |
| `-o` | Nom du fichier de sortie | `faust -o output.cpp` |
| `-lang` | Langage cible (cpp, c, rust, wasm...) | `faust -lang rust` |
| `-vec` | Active la vectorisation (SIMD) | `faust -vec` |
| `-double` | Utilise des flottants 64 bits au lieu de 32 | `faust -double` |

---

### Que sont les scripts faust2xxx ?

**Définition** : Les scripts `faust2xxx` sont des scripts shell fournis avec Faust qui automatisent la chaîne complète : compilation Faust vers C++, puis compilation C++ vers un exécutable ou un plugin pour une cible donnée.

**Le problème que les scripts faust2xxx résolvent** :

Sans les scripts `faust2xxx`, voici les problèmes rencontrés :

1. **Chaîne de compilation manuelle** : Il faut appeler le compilateur Faust, puis écrire les commandes `g++` avec les bons drapeaux, les bonnes bibliothèques, les bons chemins d'inclusion. Chaque cible (JACK, LV2, VST) a ses propres options de compilation.

2. **Connaissance requise des architectures** : Il faut savoir quel fichier d'architecture utiliser pour chaque cible et comment le configurer.

3. **Risque d'erreur** : Une erreur dans les drapeaux de compilation produit un binaire non fonctionnel ou un crash silencieux.

**Comment les scripts faust2xxx résolvent ces problèmes** :

| Problème | Solution apportée par faust2xxx |
| --- | --- |
| Chaîne de compilation manuelle | Une seule commande fait tout |
| Connaissance des architectures | Le script choisit l'architecture automatiquement |
| Risque d'erreur | Le script utilise les drapeaux validés par l'équipe Faust |

**Analogie concrète** : Les scripts `faust2xxx` sont comme des moules à gâteaux. Tu prépares la même pâte (ton code `.dsp`), mais selon le moule que tu choisis (faust2jaqt, faust2lv2, faust2wasm), tu obtiens un gâteau de forme différente (application JACK, plugin LV2, application web).

**Ce que les scripts faust2xxx ne sont PAS** :

- Les scripts `faust2xxx` ne sont pas des compilateurs. Ils appellent le compilateur Faust puis le compilateur C++ en coulisses. Ce sont des scripts d'automatisation.
- Les scripts `faust2xxx` ne sont pas interchangeables. Chaque script cible une plateforme précise. `faust2jaqt` produit une application JACK avec interface Qt, pas un plugin VST.

**Scripts les plus courants** :

| Script | Cible | Description |
| --- | --- | --- |
| `faust2jaqt` | JACK + Qt | Application autonome avec interface graphique Qt et sortie JACK |
| `faust2jack` | JACK (CLI) | Application JACK en ligne de commande (sans interface graphique) |
| `faust2caqt` | CoreAudio + Qt | Application macOS avec CoreAudio (pas besoin de JACK) |
| `faust2lv2` | Plugin LV2 | Plugin audio au format LV2 (compatible Ardour, Carla) |
| `faust2wasm` | WebAssembly | Module WebAssembly pour le Web Audio API |
| `faust2svg` | Diagramme SVG | Image SVG du circuit de signal (pas du son, un schéma) |

---

### Qu'est-ce que JACK Audio Connection Kit ?

**Définition** : JACK (JACK Audio Connection Kit) est un serveur audio professionnel qui permet de router des flux audio entre différentes applications en temps réel, avec une latence très faible.

**Le problème que JACK résout** :

Sans JACK, voici les problèmes rencontrés :

1. **Pas de routage inter-applications** : Sur un système standard, chaque application audio envoie son signal directement à la carte son. Impossible de connecter la sortie d'un synthétiseur Faust à l'entrée d'un enregistreur audio.

2. **Latence élevée** : Les systèmes audio grand public (PulseAudio, CoreAudio par défaut) ajoutent une latence de 20 à 50 millisecondes. Pour le traitement audio en temps réel, c'est trop.

3. **Pas de synchronisation** : Sans serveur central, chaque application utilise son propre taux d'échantillonnage et sa propre taille de buffer. Les flux audio ne sont pas synchronisés.

**Comment JACK résout ces problèmes** :

| Problème | Solution apportée par JACK |
| --- | --- |
| Pas de routage inter-applications | JACK permet de connecter les entrées/sorties de n'importe quelle application |
| Latence élevée | JACK accède directement au pilote audio, latence de 1 à 5 ms |
| Pas de synchronisation | JACK impose un taux d'échantillonnage et un buffer uniques à toutes les applications |

**Analogie concrète** : JACK fonctionne comme un standard téléphonique à l'ancienne. L'opérateur (JACK) possède un panneau avec des prises pour chaque ligne (application audio). Il connecte physiquement les lignes entre elles avec des câbles. Tu décides qui parle à qui en branchant ou débranchant les câbles.

**Ce que JACK n'est PAS** :

- JACK n'est pas un logiciel audio. Il ne produit pas de son, ne le modifie pas, ne l'enregistre pas. Il route le signal entre les applications qui, elles, produisent ou modifient le son.
- JACK n'est pas un remplacement du pilote audio. JACK utilise le pilote audio existant (ALSA sous Linux, CoreAudio sous macOS). Il ajoute une couche de routage au-dessus.

**Deux paramètres essentiels de JACK** :

| Paramètre | Rôle | Valeur recommandée |
| --- | --- | --- |
| Sample rate (taux d'échantillonnage) | Nombre d'échantillons par seconde | 44100 Hz ou 48000 Hz |
| Buffer size (taille du buffer) | Nombre d'échantillons traités par cycle | 256 ou 512 (compromis latence/stabilité) |

La **latence** dépend du buffer size : `latence = buffer_size / sample_rate`. Avec un buffer de 256 à 44100 Hz : `256 / 44100 = 5.8 ms`.

---

### Qu'est-ce que faust2svg ?

**Définition** : `faust2svg` est un script qui génère un diagramme SVG (image vectorielle) représentant le circuit de signal d'un programme Faust. Ce diagramme montre comment les signaux entrent, sont transformés et sortent.

**Le problème que faust2svg résout** : Le code Faust décrit des opérations mathématiques sur des signaux. Sans représentation visuelle, il est difficile de comprendre le flux du signal et de trouver les erreurs de connexion.

**Analogie concrète** : `faust2svg` fonctionne comme un plan électrique. Le code Faust est le texte qui décrit le circuit ("le fil rouge va de la résistance au condensateur"). Le diagramme SVG est le schéma visuel du circuit, avec les composants dessinés et les fils tracés.

**Ce que faust2svg n'est PAS** :

- `faust2svg` ne produit pas de son. Il produit une image. C'est un outil de visualisation, pas de compilation audio.
- `faust2svg` ne génère pas un fichier SVG unique. Il crée un dossier contenant plusieurs fichiers SVG (un par bloc fonctionnel), avec un fichier `process.svg` principal.

---

### VS Code pour Faust

**Définition** : L'extension "Faust" pour VS Code ajoute la coloration syntaxique du langage Faust, l'aperçu des diagrammes SVG et l'autocomplétion des fonctions de la bibliothèque standard.

**Analogie concrète** : Configurer VS Code pour Faust, c'est comme installer un établi de menuisier avec tous les outils à portée de main. Sans configuration, tu dois aller chercher chaque outil dans une pièce différente.

---

### Qu'est-ce que Faust IDE en ligne ?

**Définition** : Faust IDE (`faustide.grame.fr`) est un environnement de développement complet accessible depuis un navigateur web. Il permet d'écrire, compiler, exécuter et écouter un programme Faust sans rien installer.

**Analogie concrète** : Faust IDE est comme une cuisine d'essai dans un magasin d'électroménager. Tu peux tester une recette (un programme) sans posséder les appareils chez toi. Pratique pour expérimenter, mais tu ne cuisines pas tous tes repas là-bas.

**Ce que Faust IDE n'est PAS** :

- Faust IDE n'est pas un outil offline. Il nécessite une connexion internet.
- Faust IDE n'est pas un remplacement de l'environnement local. Les performances sont limitées (WebAssembly dans le navigateur) et certaines cibles de compilation ne sont pas disponibles.

---

### Qu'est-ce que FaustLive ?

**Définition** : FaustLive est une application de bureau qui permet d'écrire du code Faust et d'entendre le résultat immédiatement grâce au hot-reloading (rechargement à chaud). Chaque modification du code est compilée et appliquée en temps réel, grâce à LLVM JIT.

**Analogie concrète** : FaustLive est comme un potier qui travaille l'argile sur son tour. Il modifie la forme en continu et voit le résultat instantanément. Sans FaustLive, c'est comme si le potier devait cuire la pièce au four après chaque retouche pour voir le résultat.

**Ce que FaustLive n'est PAS** :

- FaustLive n'est pas un outil de production. Il sert au prototypage rapide. Pour produire un plugin final (LV2, VST), utilise les scripts `faust2xxx`.
- FaustLive n'est pas toujours disponible dans les distributions récentes de Faust. Vérifie sa disponibilité sur le site de GRAME.

---

### Git pour le versionnage des projets audio

**Définition** : Git est un système de contrôle de version qui enregistre l'historique de chaque modification de tes fichiers `.dsp` et te permet de revenir à une version antérieure si une modification casse ton programme.

**Analogie concrète** : Git est comme un cahier de laboratoire. Le scientifique note chaque expérience (commit), avec la date, ce qu'il a fait et pourquoi. S'il obtient un mauvais résultat, il relit ses notes pour retrouver l'état précédent qui fonctionnait.

**Ce que Git n'est PAS** :

- Git n'est pas un système de sauvegarde automatique. Tu dois explicitement créer un commit pour enregistrer une version.
- Git n'est pas adapté aux fichiers audio volumineux (WAV, AIFF). Il est conçu pour les fichiers texte comme les `.dsp`. Pour les fichiers audio, utilise Git LFS ou un système de stockage séparé.

---

## Étapes Pratiques

### Étape 1 : Installer Faust depuis les sources

L'installation depuis les sources te donne accès à la version la plus récente de Faust et à tous les scripts `faust2xxx`.

Commence par installer les dépendances selon ton système :

```bash
# macOS - installer les dépendances avec Homebrew
brew install cmake llvm libsndfile libmicrohttpd pkg-config
```

```bash
# Linux (Debian/Ubuntu) - installer les dépendances
sudo apt-get update
sudo apt-get install -y build-essential cmake llvm-dev libsndfile1-dev \
  libmicrohttpd-dev pkg-config git
```

Ensuite, les étapes sont identiques sur macOS et Linux :

```bash
# Cloner le dépôt officiel de Faust
git clone https://github.com/grame-cncm/faust.git
cd faust
```

```bash
# Initialiser les sous-modules (bibliothèques et architectures)
git submodule update --init
```

```bash
# Compiler Faust (utilise tous les coeurs disponibles)
make
```

```bash
# Installer Faust dans /usr/local (nécessite les droits administrateur)
sudo make install
```

#### Alternative : binaires pré-compilés

Si tu ne souhaites pas compiler depuis les sources, des binaires pré-compilés sont disponibles sur la page des releases GitHub :

```bash
# Vérifier la page des releases
# https://github.com/grame-cncm/faust/releases
```

Sur macOS, Faust est aussi disponible via Homebrew :

```bash
# Installation via Homebrew (version peut être plus ancienne)
brew install faust
```

---

### Étape 2 : Vérifier l'installation de Faust

```bash
# Vérifier que le compilateur est accessible
faust --version
```

**Résultat attendu** :

```text
FAUST Version 2.x.x
```

Le numéro de version exact dépend de la date de clonage du dépôt.

```bash
# Vérifier que les scripts faust2xxx sont installés
which faust2jaqt faust2svg
```

**Résultat attendu** :

```text
/usr/local/bin/faust2jaqt
/usr/local/bin/faust2svg
```

---

### Étape 3 : Installer et configurer JACK

#### Sur macOS

```bash
# Installer JACK via Homebrew
brew install jack qjackctl
```

`qjackctl` est l'interface graphique pour configurer et contrôler JACK. Elle n'est pas obligatoire, mais elle simplifie le routage audio.

#### Sur Linux (Debian/Ubuntu)

```bash
# Installer JACK et QjackCtl
sudo apt-get install -y jackd2 qjackctl
```

Lors de l'installation de `jackd2`, le système demande si JACK doit fonctionner avec des privilèges temps réel. Réponds **Oui** pour obtenir la latence la plus faible.

#### Démarrer JACK en ligne de commande

```bash
# Démarrer JACK avec un taux de 44100 Hz et un buffer de 256 échantillons
jackd -d coreaudio -r 44100 -p 256
```

Sur Linux, remplace `coreaudio` par `alsa` :

```bash
# Démarrer JACK avec ALSA (Linux)
jackd -d alsa -r 44100 -p 256
```

**Résultat attendu** :

```text
jackdmp 1.9.x
...
Driver "coreaudio" running
```

Le serveur JACK tourne maintenant en arrière-plan. Laisse ce terminal ouvert.

#### Alternative : QjackCtl (interface graphique)

Tu peux aussi lancer `qjackctl &` pour démarrer JACK via l'interface graphique. Dans **Setup**, configure le **Sample Rate** (44100) et **Frames/Period** (256), puis clique sur **Start**.

---

### Étape 4 : Créer un premier programme Faust

Crée un dossier pour tes projets Faust, puis crée un fichier `hello.dsp` :

```bash
# Créer le dossier de projets
mkdir -p ~/faust-projets
```

Crée le fichier `~/faust-projets/hello.dsp` avec ce contenu :

```faust
// hello.dsp - Passthrough stéréo
// Ce programme copie l'entrée audio vers la sortie sans modification.

// La virgule (,) est l'opérateur parallèle :
// elle place deux signaux côte à côte.
// L'underscore (_) représente un signal d'identité :
// il laisse passer le signal sans le modifier.
process = _, _ ;
```

**Explication du code** :

- `process` : le mot-clé obligatoire qui définit le programme Faust. C'est le point d'entrée, comme `main()` en C++.
- `_` : le signal d'identité. Il prend un signal en entrée et le renvoie tel quel en sortie.
- `,` : l'opérateur de composition parallèle. Il place deux expressions côte à côte.
- `_, _` : deux signaux d'identité en parallèle = passthrough stéréo (entrée gauche vers sortie gauche, entrée droite vers sortie droite).

---

### Étape 5 : Compiler et exécuter avec faust2jaqt

Assure-toi que JACK est démarré (étape 3), puis :

```bash
# Compiler hello.dsp en application JACK avec interface Qt
faust2jaqt ~/faust-projets/hello.dsp
```

**Résultat attendu** :

```text
(pas de sortie si la compilation réussit)
```

La commande crée un exécutable dans le même dossier que le fichier source.

```bash
# Lancer l'application compilée
~/faust-projets/hello
```

**Résultat attendu** : une fenêtre Qt s'ouvre. Comme le programme est un simple passthrough, la fenêtre est vide (pas de contrôles). Le son de ton microphone (entrée) passe directement dans tes haut-parleurs (sortie).

Pour quitter l'application, ferme la fenêtre ou appuie sur `Ctrl+C` dans le terminal.

**Sur macOS sans JACK** : tu peux utiliser `faust2caqt` à la place, qui utilise CoreAudio directement :

```bash
# Alternative macOS : compiler avec CoreAudio au lieu de JACK
faust2caqt ~/faust-projets/hello.dsp
~/faust-projets/hello
```

---

### Étape 6 : Générer le diagramme SVG avec faust2svg

```bash
# Générer le diagramme SVG de hello.dsp
faust2svg ~/faust-projets/hello.dsp
```

**Résultat attendu** :

```text
(pas de sortie si la génération réussit)
```

La commande crée un dossier `hello-svg/` contenant plusieurs fichiers SVG :

```bash
# Lister les fichiers SVG générés
ls ~/faust-projets/hello-svg/
```

**Résultat attendu** :

```text
process.svg
```

Le fichier principal est `process.svg`. Ouvre-le dans un navigateur :

```bash
# Ouvrir le diagramme sur macOS
open ~/faust-projets/hello-svg/process.svg
```

```bash
# Ouvrir le diagramme sur Linux
xdg-open ~/faust-projets/hello-svg/process.svg
```

Le diagramme montre deux lignes parallèles : chaque ligne représente un signal d'identité (`_`). L'entrée à gauche est connectée directement à la sortie à droite.

---

### Étape 7 : Configurer VS Code

#### Installer l'extension Faust

1. Ouvre VS Code
2. Ouvre le panneau des extensions : `Ctrl+Shift+X` (ou `Cmd+Shift+X` sur macOS)
3. Cherche **"Faust"** dans la barre de recherche
4. Installe l'extension **"Faust"** (par Music Music)

**Note** : Si tu travailles en environnement offline, télécharge le fichier `.vsix` de l'extension depuis un ordinateur connecté, puis installe-le manuellement :

```bash
# Installer une extension depuis un fichier .vsix
code --install-extension faust-0.x.x.vsix
```

#### Configuration recommandée pour VS Code

Ouvre les paramètres JSON de VS Code (`Ctrl+Shift+P` puis "Preferences: Open Settings (JSON)") et ajoute :

```json
{
  "files.associations": {
    "*.dsp": "faust",
    "*.lib": "faust"
  },
  "editor.tabSize": 2,
  "editor.rulers": [100]
}
```

Pour vérifier : ouvre `hello.dsp` dans VS Code. Le mot-clé `process` doit être coloré et le mode de langage en bas à droite doit indiquer **"Faust"**.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `faust --version` | Affiche la version du compilateur Faust |
| `faust -h` | Affiche l'aide complète du compilateur |
| `faust fichier.dsp` | Compile un fichier Faust vers C++ (sortie standard) |
| `faust -o sortie.cpp fichier.dsp` | Compile un fichier Faust vers un fichier C++ |
| `faust2jaqt fichier.dsp` | Compile vers une application JACK + Qt |
| `faust2jack fichier.dsp` | Compile vers une application JACK (sans interface graphique) |
| `faust2caqt fichier.dsp` | Compile vers une application CoreAudio + Qt (macOS) |
| `faust2svg fichier.dsp` | Génère le diagramme SVG du circuit de signal |
| `faust2lv2 fichier.dsp` | Compile vers un plugin LV2 |
| `jackd -d coreaudio -r 44100 -p 256` | Démarre JACK avec CoreAudio (macOS) |
| `jackd -d alsa -r 44100 -p 256` | Démarre JACK avec ALSA (Linux) |
| `qjackctl` | Lance l'interface graphique de JACK |
| `jack_lsp` | Liste les ports JACK disponibles |
| `jack_connect port1 port2` | Connecte deux ports JACK |

---

## Pièges Fréquents

### Piège 1 : JACK n'est pas démarré

**Problème** : Tu lances une application compilée avec `faust2jaqt` et tu obtiens :

```text
Cannot connect to JACK server
```

**Solution** : Démarre JACK avant de lancer l'application :

```bash
# Démarrer JACK (macOS)
jackd -d coreaudio -r 44100 -p 256 &
```

```bash
# Démarrer JACK (Linux)
jackd -d alsa -r 44100 -p 256 &
```

Le `&` à la fin lance JACK en arrière-plan pour que tu puisses continuer à utiliser le terminal.

---

### Piège 2 : faust2jaqt introuvable

**Problème** : Le terminal affiche :

```text
faust2jaqt: command not found
```

**Solution** : Vérifie que `/usr/local/bin` est dans ton `PATH`. Si ce n'est pas le cas, ajoute-le :

```bash
# macOS (zsh)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

```bash
# Linux (bash)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

---

### Piège 3 : Qt non installé pour faust2jaqt

**Problème** : La compilation avec `faust2jaqt` échoue avec des erreurs liées à Qt :

```text
fatal error: QApplication: No such file or directory
```

**Solution** : Installe Qt :

```bash
# macOS
brew install qt@5
```

```bash
# Linux (Debian/Ubuntu)
sudo apt-get install -y qtbase5-dev qt5-qmake
```

---

### Piège 4 : Conflits de taux d'échantillonnage

**Problème** : JACK démarre avec un taux de 44100 Hz, mais ta carte son ne supporte que 48000 Hz. Tu obtiens :

```text
Cannot set sample rate to 44100
```

**Solution** : Utilise un taux d'échantillonnage supporté par ta carte son :

```bash
# Démarrer JACK à 48000 Hz
jackd -d coreaudio -r 48000 -p 256
```

---

### Piège 5 : Permission refusée pour JACK en temps réel (Linux)

**Problème** : Sur Linux, JACK affiche :

```text
Cannot use real-time scheduling (FIFO at priority 10)
```

**Solution** : Ajoute ton utilisateur au groupe `audio` :

```bash
# Ajouter ton utilisateur au groupe audio
sudo usermod -a -G audio $USER
```

Déconnecte-toi puis reconnecte-toi pour que le changement prenne effet.

---

## Checklist de Validation

- [ ] J'ai installé le compilateur Faust et `faust --version` affiche un numéro de version
- [ ] Les scripts `faust2jaqt` et `faust2svg` sont accessibles depuis le terminal
- [ ] JACK est installé et démarre sans erreur
- [ ] J'ai créé le fichier `hello.dsp` avec un passthrough stéréo
- [ ] J'ai compilé `hello.dsp` avec `faust2jaqt` (ou `faust2caqt`) et l'application s'exécute
- [ ] J'ai généré le diagramme SVG de `hello.dsp` et je l'ai ouvert dans un navigateur
- [ ] VS Code reconnaît les fichiers `.dsp` comme du Faust (coloration syntaxique active)
- [ ] Git est installé et je sais créer un dépôt pour mes projets Faust

---

## Exercice Pratique

**Énoncé** : Installe l'environnement complet de développement Faust, crée un programme qui génère un signal sinusoïdal à 440 Hz, compile-le, exécute-le et visualise son diagramme SVG.

**Indications** :

- Crée un fichier `sinus.dsp` dans ton dossier `~/faust-projets/`
- La bibliothèque standard Faust contient le module `os` (oscillateurs) avec la fonction `osc(freq)` qui génère une sinusoïde
- Pour utiliser cette fonction, tu dois importer la bibliothèque standard avec `import("stdfaust.lib");`
- Le programme complet tient en 2 lignes (import + process)
- Compile avec `faust2jaqt` ou `faust2caqt`
- Génère le diagramme SVG avec `faust2svg`
- Initialise un dépôt Git dans ton dossier de projets

**Résultat attendu** :

- L'application s'ouvre et tu entends un son pur (la note La, 440 Hz) dans un seul canal (mono)
- Le diagramme SVG montre la chaîne de signal de l'oscillateur
- Ton dossier `~/faust-projets/` est un dépôt Git avec un premier commit

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Créer le programme

Crée le fichier `~/faust-projets/sinus.dsp` avec ce contenu :

```faust
// sinus.dsp - Génération d'une sinusoïde à 440 Hz

// Importer la bibliothèque standard Faust
import("stdfaust.lib");

// os.osc(freq) génère un signal sinusoïdal à la fréquence donnée.
// Le signal oscille entre -1.0 et +1.0 (mono).
process = os.osc(440);
```

### Compiler et exécuter

```bash
# Compiler avec JACK + Qt (Linux ou macOS avec JACK)
faust2jaqt ~/faust-projets/sinus.dsp
```

```bash
# Ou compiler avec CoreAudio + Qt (macOS sans JACK)
faust2caqt ~/faust-projets/sinus.dsp
```

```bash
# Exécuter l'application
~/faust-projets/sinus
```

**Résultat attendu** : une fenêtre Qt s'ouvre. Tu entends un son continu à 440 Hz (la note La, mono). Ferme la fenêtre ou appuie sur `Ctrl+C` pour arrêter.

### Générer le diagramme SVG

```bash
# Générer le diagramme
faust2svg ~/faust-projets/sinus.dsp
```

```bash
# Ouvrir le diagramme (macOS)
open ~/faust-projets/sinus-svg/process.svg
```

```bash
# Ouvrir le diagramme (Linux)
xdg-open ~/faust-projets/sinus-svg/process.svg
```

**Résultat attendu** : le diagramme montre un bloc `osc` avec une entrée (la fréquence 440) et une sortie (le signal sinusoïdal).

### Initialiser Git

```bash
# Initialiser le dépôt et créer le .gitignore
cd ~/faust-projets
git init
```

Crée un fichier `.gitignore` à la racine du dossier :

```text
# Exécutables compilés (pas d'extension sur macOS/Linux)
hello
sinus

# Dossiers de diagrammes SVG générés
*-svg/

# Fichiers objets et temporaires
*.o
*.so
*.dylib
```

```bash
# Ajouter les fichiers source et créer le premier commit
git add hello.dsp sinus.dsp .gitignore
git commit -m "Ajouter les premiers programmes Faust (hello et sinus)"
```

---

## Navigation

← Fiche précédente : **[02 - C++ : notions essentielles](02-cpp-notions-essentielles.md)**
