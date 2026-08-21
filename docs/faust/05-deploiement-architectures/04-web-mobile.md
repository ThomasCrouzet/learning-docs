---
tags:
  - Faust
  - Avancé
  - Pratique
description: "Web et mobile - faust2wasm, WebAudio API, PWA, faust2android et faust2ios"
estimated_time: "105 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 5 - Déploiement et architectures"
id: "specializations.faust.deployment.web-mobile"
course_id: "specializations.faust"
module_id: "specializations.faust.deployment"
content_type: "lesson"
order: 4
---

# 04 - Web et mobile

> **En bref** : À la fin de cette fiche, tu sauras déployer un programme Faust dans un navigateur web via WebAssembly, créer une PWA audio et compiler vers des applications Android et iOS. Lecture estimée : 105 min.


## Prérequis

- [Fiche 01 - Système d'architectures Faust](01-systeme-architectures-faust.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déployer un programme Faust dans un navigateur web via WebAssembly, créer une PWA audio et compiler vers des applications Android et iOS.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que faust2wasm ?

**Définition** : `faust2wasm` est un outil de compilation qui transforme un programme Faust en module WebAssembly (`.wasm`) accompagné d'un fichier JavaScript de liaison (glue code). Ce module peut être chargé dans un navigateur web pour exécuter du traitement audio en temps réel.

**Le problème que faust2wasm résout** :

Sans `faust2wasm`, voici les problèmes rencontrés :

1. **Pas de code natif dans le navigateur** : Un navigateur web ne peut pas exécuter du C++ ou du code machine directement. Le code Faust compilé en natif (via `faust2jaqt` ou `faust2jack`) ne peut pas tourner dans une page web.

2. **Performances insuffisantes en JavaScript pur** : Écrire du DSP en JavaScript pur est trop lent pour du traitement audio temps réel. JavaScript est un langage interprété qui ne garantit pas la régularité temporelle nécessaire à l'audio.

3. **Distribution complexe** : Pour partager un programme audio natif, il faut que l'utilisateur télécharge un exécutable, l'installe et configure son système audio. Avec le web, l'utilisateur ouvre une URL et le programme fonctionne immédiatement.

**Comment faust2wasm résout ces problèmes** :

| Problème | Solution apportée par faust2wasm |
| -------- | -------------------------------- |
| Pas de code natif dans le navigateur | WebAssembly est un format binaire exécutable par tous les navigateurs modernes |
| Performances insuffisantes en JS | Le code WebAssembly tourne à une vitesse proche du code natif (environ 80-90% des performances C++) |
| Distribution complexe | L'utilisateur ouvre une page web, pas besoin d'installation |

**Analogie concrète** : `faust2wasm` est comme un traducteur qui convertit un livre écrit en langue technique (le code Faust/C++) en une langue universelle (WebAssembly) que tous les navigateurs du monde comprennent. Le livre traduit contient les mêmes informations et fonctionne presque aussi bien que l'original.

**Ce que faust2wasm n'est PAS** :

- `faust2wasm` ne génère pas une application web complète. Il produit un module `.wasm` et un fichier JavaScript. Tu dois toi-même créer la page HTML et connecter le module au système audio du navigateur (WebAudio API).
- `faust2wasm` n'est pas limité à l'audio. WebAssembly peut exécuter n'importe quel calcul, mais dans le contexte Faust, il est utilisé spécifiquement pour le traitement de signaux audio.

**Options principales de faust2wasm** :

| Option | Effet |
| ------ | ----- |
| (sans option) | Compile un module monophonique standard |
| `-poly` | Active la polyphonie (plusieurs voix simultanées, utile pour les synthétiseurs) |
| `-worklet` | Génère du code compatible AudioWorklet (thread audio séparé, recommandé) |
| `-poly -worklet` | Combine polyphonie et AudioWorklet |

**Fichiers générés par faust2wasm** :

```text
faust2wasm monsynth.dsp
├── monsynth.wasm          # Le module WebAssembly compilé (code DSP binaire)
├── monsynth.js            # Le glue code JavaScript (charge et interface le .wasm)
```

---

### Qu'est-ce que la WebAudio API ?

**Définition** : La WebAudio API est une interface de programmation JavaScript intégrée à tous les navigateurs modernes. Elle permet de créer, manipuler et router des signaux audio directement dans le navigateur. Elle repose sur un graphe de nœuds audio (AudioNode) connectés entre eux.

**Le problème que la WebAudio API résout** :

Sans la WebAudio API, voici les problèmes rencontrés :

1. **Pas d'accès au matériel audio** : JavaScript seul ne peut pas accéder à la carte son de l'ordinateur pour produire ou capturer du son.

2. **Pas de traitement en temps réel** : Sans API dédiée, il faudrait utiliser des plugins tiers (comme Flash ou Java Applets) pour traiter de l'audio dans le navigateur. Ces technologies sont obsolètes et abandonnées.

3. **Pas de routage flexible** : Connecter un synthétiseur à un effet puis à la sortie audio nécessite un système de routage structuré.

**Comment la WebAudio API résout ces problèmes** :

| Problème | Solution apportée par la WebAudio API |
| -------- | ------------------------------------- |
| Pas d'accès au matériel audio | `AudioContext` fournit un accès standardisé à la carte son |
| Pas de traitement en temps réel | Les `AudioNode` traitent l'audio échantillon par échantillon dans un thread dédié |
| Pas de routage flexible | Les nœuds se connectent avec `.connect()` pour former un graphe audio |

**Analogie concrète** : La WebAudio API fonctionne comme une table de mixage dans un studio. L'`AudioContext` est la table de mixage elle-même (elle gère l'alimentation et la synchronisation). Chaque `AudioNode` est un module (synthétiseur, effet, égaliseur) que tu branches avec des câbles (`.connect()`). La sortie finale (`destination`) est le haut-parleur.

**Les trois éléments fondamentaux** :

| Élément | Rôle | Exemple |
| ------- | ---- | ------- |
| `AudioContext` | Point d'entrée de la WebAudio API, gère le contexte audio global | `const ctx = new AudioContext()` |
| `AudioNode` | Bloc de traitement audio (source, effet ou destination) | `OscillatorNode`, `GainNode`, `AudioWorkletNode` |
| `destination` | La sortie audio finale (les haut-parleurs) | `ctx.destination` |

**Ce que la WebAudio API n'est PAS** :

- La WebAudio API n'est pas un DAW (station de travail audio). Elle fournit les briques de base, pas une interface de production musicale complète.
- La WebAudio API n'est pas spécifique à Faust. Elle est utilisable avec n'importe quel code JavaScript ou WebAssembly pour traiter de l'audio.

**Exemple de graphe audio** :

```text
┌──────────────┐     ┌──────────┐     ┌─────────────┐
│ OscillatorNode│────→│ GainNode │────→│ destination │
│ (source)      │     │ (volume) │     │ (speakers)  │
└──────────────┘     └──────────┘     └─────────────┘
```

---

### Qu'est-ce qu'un AudioWorklet ?

**Définition** : Un AudioWorklet est un mécanisme de la WebAudio API qui permet d'exécuter du code de traitement audio dans un thread séparé du thread principal (main thread) du navigateur. Le code DSP tourne dans un `AudioWorkletProcessor`, et le nœud correspondant dans le graphe audio est un `AudioWorkletNode`.

**Le problème que les AudioWorklets résolvent** :

Sans AudioWorklet, voici les problèmes rencontrés :

1. **Glitches audio (craquements)** : Avant les AudioWorklets, le traitement audio personnalisé passait par le `ScriptProcessorNode`, qui tournait sur le main thread. Toute opération lourde sur la page (animation, calcul, rendu DOM) bloquait le traitement audio et provoquait des craquements.

2. **Latence élevée** : Le `ScriptProcessorNode` utilisait des buffers de grande taille (1024 à 16384 échantillons) pour compenser les interruptions du main thread. Cela ajoutait une latence perceptible (23 ms à 370 ms à 44.1 kHz).

3. **Pas de garantie temps réel** : Le main thread est partagé entre l'audio, le rendu visuel, les événements utilisateur et le garbage collector JavaScript. Aucune priorité n'est garantie pour l'audio.

**Comment les AudioWorklets résolvent ces problèmes** :

| Problème | Solution apportée par AudioWorklet |
| -------- | ---------------------------------- |
| Glitches audio | Le code DSP tourne dans un thread séparé, isolé des opérations de la page |
| Latence élevée | Les buffers peuvent être petits (128 échantillons = 2.9 ms à 44.1 kHz) |
| Pas de garantie temps réel | Le thread audio a une priorité élevée, proche du temps réel |

**Analogie concrète** : Imagine un musicien qui joue dans un orchestre (le navigateur). Si ce musicien doit aussi servir des boissons au public (gérer le DOM, les animations), il rate des notes à chaque fois qu'il se lève pour servir. L'AudioWorklet, c'est lui donner une chaise dédiée dans la fosse d'orchestre : il ne fait que jouer, sans être interrompu par d'autres tâches.

**Ce qu'un AudioWorklet n'est PAS** :

- Un AudioWorklet n'est pas un Web Worker classique. Un Web Worker est un thread généraliste. Un AudioWorklet est un thread spécialisé pour l'audio, avec des contraintes de timing strictes et un accès direct au graphe audio.
- Un AudioWorklet n'est pas optionnel pour des applications audio sérieuses. Le `ScriptProcessorNode` est officiellement deprecated (abandonné). Toute nouvelle application web audio doit utiliser les AudioWorklets.

**Architecture d'un AudioWorklet** :

```text
┌─────────────────────────────┐
│       Main Thread           │
│                             │
│  ┌───────────────────────┐  │
│  │  AudioWorkletNode     │  │
│  │  (interface JS)       │  │
│  └──────────┬────────────┘  │
│             │ messages       │
└─────────────┼───────────────┘
              │
┌─────────────┼───────────────┐
│       Audio Thread          │
│             │               │
│  ┌──────────▼────────────┐  │
│  │ AudioWorkletProcessor │  │
│  │ (code DSP / Wasm)     │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

---

### Qu'est-ce que faust-web-component ?

**Définition** : `faust-web-component` est une bibliothèque JavaScript qui fournit des composants web (Web Components) permettant d'intégrer un programme Faust dans une page HTML avec une interface utilisateur générée automatiquement. Tu écris une seule balise HTML et la bibliothèque se charge de la compilation, de l'AudioWorklet et de l'affichage des contrôles.

**Le problème que faust-web-component résout** :

Sans `faust-web-component`, voici les problèmes rencontrés :

1. **Intégration manuelle complexe** : Pour faire tourner du Faust dans un navigateur, tu dois toi-même charger le module `.wasm`, créer l'`AudioContext`, configurer l'`AudioWorkletNode`, parser les métadonnées UI et construire les contrôles HTML (sliders, boutons). Cela représente des dizaines de lignes de code.

2. **Pas d'interface utilisateur automatique** : Faust génère des métadonnées UI (sliders, boutons, groupes) dans le code DSP. Sans outil dédié, ces métadonnées sont ignorées dans le navigateur.

3. **Maintenance difficile** : Chaque changement dans le programme Faust nécessite de mettre à jour manuellement l'interface HTML.

**Comment faust-web-component résout ces problèmes** :

| Problème | Solution apportée par faust-web-component |
| -------- | ----------------------------------------- |
| Intégration manuelle complexe | Une seule balise HTML suffit pour tout charger |
| Pas d'UI automatique | L'interface est générée à partir des métadonnées Faust (sliders, boutons) |
| Maintenance difficile | L'UI se met à jour automatiquement quand le code DSP change |

**Analogie concrète** : `faust-web-component` est comme un cadre photo numérique. Tu lui donnes une photo (le code Faust) et il s'occupe de tout : l'afficher, gérer le rétroéclairage, proposer les réglages de luminosité. Tu ne programmes pas l'écran toi-même.

**Exemple d'utilisation** :

```html
<!-- Charger la bibliothèque -->
<script src="https://cdn.jsdelivr.net/npm/@grame/faust-web-component@0.4/dist/faust-web-component.js"></script>

<!-- Intégrer un programme Faust avec une seule balise -->
<faust-editor>
import("stdfaust.lib");
freq = hslider("Fréquence", 440, 20, 20000, 1);
gain = hslider("Volume", 0.5, 0, 1, 0.01);
process = os.osc(freq) * gain;
</faust-editor>
```

---

### ScriptProcessor vs AudioWorklet

**Définition** : `ScriptProcessorNode` et `AudioWorkletNode` sont deux mécanismes de la WebAudio API pour exécuter du code de traitement audio personnalisé dans le navigateur. Le premier est obsolète (deprecated), le second est le standard actuel.

**Comparaison ScriptProcessor vs AudioWorklet** :

| Critère | ScriptProcessorNode | AudioWorkletNode |
| ------- | ------------------- | ---------------- |
| Thread d'exécution | Main thread (partagé avec le DOM) | Thread audio dédié |
| Taille de buffer | 256 à 16384 échantillons | 128 échantillons (fixe) |
| Latence minimale | ~6 ms (256 échantillons à 44.1 kHz) | ~2.9 ms (128 échantillons à 44.1 kHz) |
| Risque de glitches | Élevé (le DOM peut bloquer l'audio) | Faible (thread isolé) |
| Statut | Deprecated (abandonné par le W3C) | Standard actuel |
| Support navigateurs | Tous les navigateurs | Chrome 66+, Firefox 76+, Safari 14.1+ |
| Garbage collector | Peut interrompre le traitement | N'affecte pas le thread audio |

**Ce qu'il faut retenir** : Utilise toujours `AudioWorkletNode` pour tout nouveau projet. Le `ScriptProcessorNode` n'existe que pour la compatibilité avec d'anciens codes. L'option `-worklet` de `faust2wasm` génère du code compatible AudioWorklet.

---

### Qu'est-ce qu'une PWA (Progressive Web App) ?

**Définition** : Une PWA (Progressive Web App) est une application web qui peut être installée sur l'appareil de l'utilisateur (ordinateur ou smartphone) et fonctionner comme une application native. Elle utilise un Service Worker pour gérer le cache et un fichier manifest pour décrire l'application.

**Le problème que les PWA résolvent** :

Sans PWA, voici les problèmes rencontrés :

1. **Pas de mode offline** : Une page web classique ne fonctionne pas sans connexion internet. Si tu as un synthétiseur Faust en ligne et que tu perds la connexion, le programme s'arrête.

2. **Pas d'icône sur l'écran d'accueil** : L'utilisateur doit ouvrir son navigateur, taper l'URL ou chercher un favori. Ce n'est pas pratique.

3. **Expérience dégradée** : Dans un navigateur, la barre d'adresse, les onglets et les menus occupent de l'espace. L'application ne ressemble pas à une app native.

**Comment les PWA résolvent ces problèmes** :

| Problème | Solution apportée par les PWA |
| -------- | ----------------------------- |
| Pas de mode offline | Le Service Worker met en cache les fichiers nécessaires (HTML, JS, Wasm) |
| Pas d'icône sur l'écran | Le manifest permet l'installation avec une icône dédiée |
| Expérience dégradée | Le mode "standalone" masque la barre du navigateur |

**Analogie concrète** : Une PWA est comme une émission de télévision enregistrée sur un magnétoscope. Tu peux la regarder en direct (en ligne) ou en différé (offline). Une fois enregistrée, elle est disponible dans ta bibliothèque (icône sur l'écran d'accueil) et se lance sans passer par le guide des programmes (le navigateur).

**Les deux fichiers essentiels d'une PWA** :

| Fichier | Rôle |
| ------- | ---- |
| `manifest.json` | Décrit l'application (nom, icône, couleur, mode d'affichage) |
| `sw.js` (Service Worker) | Script qui intercepte les requêtes réseau et gère le cache |

**Ce qu'une PWA n'est PAS** :

- Une PWA n'est pas une application native compilée. Elle reste du HTML/CSS/JavaScript exécuté par le moteur du navigateur, même quand elle est "installée".
- Une PWA n'a pas accès à toutes les API natives. Certaines fonctionnalités (Bluetooth, NFC, certains capteurs) peuvent être limitées selon le navigateur et le système d'exploitation.

---

### Qu'est-ce que faust2android ?

**Définition** : `faust2android` est un outil de compilation qui transforme un programme Faust en une application Android native. Il génère un projet Android Studio complet contenant le code DSP compilé (via le NDK, le kit de développement natif Android), une interface utilisateur Java/Kotlin, et les fichiers de configuration Gradle.

**Le problème que faust2android résout** :

Sans `faust2android`, voici les problèmes rencontrés :

1. **Compétences multiples requises** : Pour créer une app audio Android, tu dois maîtriser Java ou Kotlin, le NDK (C/C++ natif), l'API audio Android (Oboe ou OpenSL ES), et le build system Gradle. Cela représente des mois d'apprentissage.

2. **Latence audio élevée** : L'API audio Java standard (AudioTrack) introduit une latence importante. Pour de l'audio temps réel, il faut utiliser le NDK avec des bibliothèques natives, ce qui est complexe.

3. **Pas d'interface utilisateur automatique** : Tu dois créer manuellement les contrôles (sliders, boutons) qui correspondent aux paramètres du programme Faust.

**Comment faust2android résout ces problèmes** :

| Problème | Solution apportée par faust2android |
| -------- | ----------------------------------- |
| Compétences multiples requises | L'outil génère tout le code Android automatiquement à partir du fichier `.dsp` |
| Latence audio élevée | Le code DSP tourne en natif via le NDK, avec une latence minimale |
| Pas d'UI automatique | L'interface est générée à partir des métadonnées Faust (sliders, boutons, groupes) |

**Analogie concrète** : `faust2android` est comme un architecte qui transforme un simple croquis (le fichier `.dsp`) en plans de construction complets (le projet Android Studio) avec toutes les spécifications techniques. Tu n'as pas besoin de savoir poser les briques toi-même : l'architecte fournit le projet prêt à construire.

**Ce que faust2android n'est PAS** :

- `faust2android` ne publie pas l'application sur le Play Store. Il génère un projet que tu dois compiler et signer toi-même.
- `faust2android` ne gère pas les fonctionnalités Android avancées (GPS, caméra, réseau). Il se concentre sur l'audio et l'interface des paramètres DSP.

---

### Qu'est-ce que faust2ios ?

**Définition** : `faust2ios` est un outil de compilation qui transforme un programme Faust en une application iOS native. Il génère un projet Xcode contenant le code DSP compilé en C++, une interface utilisateur Objective-C ou Swift, et les fichiers de configuration du projet.

**Le problème que faust2ios résout** :

Sans `faust2ios`, voici les problèmes rencontrés :

1. **Écosystème fermé** : Le développement iOS nécessite un Mac, Xcode, un compte développeur Apple, et la maîtrise de Swift ou Objective-C. Écrire du DSP performant en Swift n'est pas réaliste pour du temps réel.

2. **API audio complexe** : L'API audio native d'iOS (Core Audio / Audio Unit) est en C et réputée difficile à utiliser. La gestion des buffers, des callbacks et des interruptions audio demande une expertise spécifique.

3. **Interface à reconstruire** : Comme pour Android, tu dois créer manuellement les contrôles correspondant aux paramètres du programme Faust.

**Comment faust2ios résout ces problèmes** :

| Problème | Solution apportée par faust2ios |
| -------- | ------------------------------- |
| Écosystème fermé | L'outil génère un projet Xcode complet, prêt à compiler |
| API audio complexe | Le code DSP est encapsulé avec Core Audio, la gestion audio est automatique |
| Interface à reconstruire | L'UI est générée à partir des métadonnées Faust |

**Analogie concrète** : `faust2ios` est comme un service de traduction certifiée. Tu fournis un document (le fichier `.dsp`) et le service te rend une version traduite, formatée et validée selon les normes du pays de destination (les exigences d'Apple/Xcode). Tu n'as plus qu'à soumettre le document.

**Comparaison faust2android vs faust2ios** :

| Critère | faust2android | faust2ios |
| ------- | ------------- | --------- |
| Plateforme cible | Android | iOS |
| IDE généré | Projet Android Studio | Projet Xcode |
| Langage de l'interface | Java/Kotlin | Objective-C/Swift |
| Compilation native | NDK (C++ via JNI) | C++ direct |
| Système requis | Linux, macOS ou Windows | macOS uniquement |
| API audio | Oboe / OpenSL ES | Core Audio |

---

### Qu'est-ce que faust2api ?

**Définition** : `faust2api` est un outil qui génère une API (interface de programmation) dans un langage cible (C++, Java, Swift) pour intégrer du DSP Faust dans une application mobile existante. Contrairement à `faust2android` ou `faust2ios` qui génèrent une application complète, `faust2api` génère uniquement le moteur DSP et son interface de contrôle.

**Le problème que faust2api résout** :

Sans `faust2api`, voici les problèmes rencontrés :

1. **Application existante** : Tu as déjà une application mobile et tu veux y ajouter du traitement audio Faust. Générer une application complète avec `faust2android` ne t'aide pas.

2. **Contrôle fin de l'intégration** : Tu veux gérer toi-même l'interface utilisateur, le cycle de vie de l'application et l'initialisation audio, mais tu veux que le DSP soit fourni sous forme de bibliothèque.

**Comment faust2api résout ces problèmes** :

| Problème | Solution apportée par faust2api |
| -------- | ------------------------------- |
| Application existante | L'API générée s'intègre dans n'importe quel projet mobile existant |
| Contrôle fin de l'intégration | Tu obtiens une classe avec des méthodes `start()`, `stop()`, `setParam()`, sans UI imposée |

**Analogie concrète** : Si `faust2android` te donne une voiture complète, `faust2api` te donne uniquement le moteur. Tu l'installes dans le véhicule de ton choix (ton application existante) et tu le contrôles avec tes propres commandes.

**Ce que faust2api n'est PAS** :

- `faust2api` ne génère pas d'interface utilisateur. Tu obtiens uniquement les fonctions pour démarrer, arrêter et contrôler le DSP.
- `faust2api` ne génère pas une application autonome. Le code produit doit être intégré dans un projet existant.

---

### Qu'est-ce que SmartKeyboard ?

**Définition** : SmartKeyboard est une interface tactile développée pour Faust qui affiche un clavier musical interactif sur l'écran d'un appareil mobile (ou d'un navigateur). Il gère la polyphonie, la vélocité (force de pression), le pitch bend (glissement horizontal) et la pression continue (aftertouch).

**Le problème que SmartKeyboard résout** :

Sans SmartKeyboard, voici les problèmes rencontrés :

1. **Pas d'instrument sur mobile** : Un écran tactile n'a pas de touches physiques. Sans interface adaptée, l'utilisateur ne peut pas jouer de notes.

2. **Interaction limitée** : Un simple bouton HTML ne gère ni la polyphonie (plusieurs doigts), ni la vélocité, ni le glissement entre les notes.

3. **Développement complexe** : Créer une interface tactile musicale performante (gestion du multitouch, calcul de la vélocité, détection du glissement) demande beaucoup de code.

**Comment SmartKeyboard résout ces problèmes** :

| Problème | Solution apportée par SmartKeyboard |
| -------- | ----------------------------------- |
| Pas d'instrument sur mobile | Affiche un clavier configurable adapté à l'écran tactile |
| Interaction limitée | Gère polyphonie, vélocité, pitch bend et aftertouch nativement |
| Développement complexe | S'intègre avec les métadonnées Faust (`declare interface "SmartKeyboard{...}"`) |

**Analogie concrète** : SmartKeyboard est comme un clavier en caoutchouc pliable que tu déposes sur n'importe quelle table. Il s'adapte à l'espace disponible (la taille de l'écran), il détecte la force de tes frappes (vélocité) et te permet de glisser le doigt entre les notes (pitch bend).

**Ce que SmartKeyboard n'est PAS** :

- SmartKeyboard n'est pas un synthétiseur. Il ne produit pas de son lui-même. Il envoie des informations de contrôle (note, vélocité, pression) au programme Faust qui se charge de la synthèse.
- SmartKeyboard n'est pas limité au clavier piano. Il peut afficher des grilles, des pads ou d'autres dispositions configurables.

---

## Étapes Pratiques

### Étape 1 : Compiler en WebAssembly avec faust2wasm

Crée un fichier `synth.dsp` avec un synthétiseur simple :

```faust
// synth.dsp
// Synthétiseur simple avec contrôle de fréquence et de volume
import("stdfaust.lib");

// Contrôle de fréquence via un slider (20 Hz à 2000 Hz, valeur par défaut 440 Hz)
freq = hslider("Fréquence", 440, 20, 2000, 1);

// Contrôle de volume via un slider (0 à 1, valeur par défaut 0.3)
gain = hslider("Volume", 0.3, 0, 1, 0.01);

// Bouton gate pour activer/désactiver le son
gate = button("Gate");

// Oscillateur sinusoïdal multiplié par le volume et le bouton gate
process = os.osc(freq) * gain * gate;
```

Compile ce programme en WebAssembly avec l'option `-worklet` :

```bash
# Compiler en WebAssembly avec support AudioWorklet
faust2wasm -worklet synth.dsp
```

**Résultat attendu** :

```text
# Fichiers générés dans le répertoire courant
synth.wasm           # Module WebAssembly (code DSP compilé)
synth.js             # Glue code JavaScript (charge le .wasm et expose l'API)
```

Vérifie que les fichiers ont été créés :

```bash
# Lister les fichiers générés
ls -la synth.wasm synth.js
```

**Résultat attendu** :

```text
-rw-r--r--  1 user  staff  12345 Mar 19 10:00 synth.js
-rw-r--r--  1 user  staff   6789 Mar 19 10:00 synth.wasm
```

---

### Étape 2 : Créer une page HTML minimale qui charge le module Faust

> **Note** : Le code JavaScript ci-dessous est volontairement **simplifié** (pseudo-code pédagogique) pour montrer le principe : charger le glue code, créer un contexte audio, instancier le nœud, le connecter. L'API réelle de **faustwasm** repose sur des fabriques (`FaustMonoDspGenerator` / `FaustPolyDspGenerator`) et une méthode `createNode(audioContext, ...)`. Adapte-toi à l'API exacte de la version de faustwasm que tu utilises.

Crée un fichier `index.html` dans le même répertoire que les fichiers générés :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synthétiseur Faust</title>
    <style>
        /* Style minimal pour la page */
        body {
            font-family: sans-serif;
            max-width: 600px;
            margin: 40px auto;
            padding: 0 20px;
        }
        button {
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            margin: 10px 5px;
        }
        /* Le bouton actif change de couleur */
        .active {
            background-color: #4CAF50;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Synthétiseur Faust - WebAssembly</h1>

    <!-- Bouton pour démarrer l'audio (obligatoire : les navigateurs bloquent
         l'audio tant que l'utilisateur n'a pas interagi avec la page) -->
    <button id="startBtn">Démarrer l'audio</button>

    <!-- Zone d'affichage du statut -->
    <p id="status">Audio non démarré</p>

    <script type="module">
        // Importer le glue code généré par faust2wasm
        import createSynthProcessor from './synth.js';

        let audioContext = null;
        let synthNode = null;

        // Fonction appelée quand l'utilisateur clique sur "Démarrer l'audio"
        document.getElementById('startBtn').addEventListener('click', async () => {
            // Créer le contexte audio (obligatoire pour tout traitement WebAudio)
            if (!audioContext) {
                audioContext = new AudioContext();
            }

            // Si le contexte est suspendu (politique autoplay du navigateur),
            // le reprendre
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Charger et instancier le module Faust WebAssembly
            synthNode = await createSynthProcessor(audioContext);

            // Connecter le nœud Faust à la sortie audio (les haut-parleurs)
            synthNode.connect(audioContext.destination);

            // Mettre à jour l'interface
            document.getElementById('status').textContent =
                'Audio démarré - fréquence : 440 Hz';
            document.getElementById('startBtn').classList.add('active');
        });
    </script>
</body>
</html>
```

Pour tester cette page, tu dois la servir via un serveur HTTP local. Les navigateurs bloquent le chargement de modules WebAssembly depuis le protocole `file://`.

```bash
# Démarrer un serveur HTTP local dans le répertoire courant
# Python 3 est préinstallé sur la plupart des systèmes
python3 -m http.server 8080
```

**Résultat attendu** :

```text
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

Ouvre ton navigateur à l'adresse `http://localhost:8080`. Clique sur "Démarrer l'audio" pour entendre le synthétiseur.

---

### Étape 3 : Utiliser AudioWorklet pour le traitement audio

Quand tu compiles avec `faust2wasm -worklet`, le fichier JavaScript généré configure automatiquement un `AudioWorkletProcessor`. Voici comment fonctionne le mécanisme en détail.

Le glue code JavaScript effectue ces opérations :

```text
1. Charge le fichier .wasm (module WebAssembly)
2. Enregistre un AudioWorkletProcessor dans le thread audio
3. Crée un AudioWorkletNode dans le main thread
4. Le processeur reçoit les données audio, appelle le code Wasm, renvoie le résultat
```

**Architecture complète du flux audio** :

```text
┌────────────────────────────────────────────────┐
│                 Main Thread                     │
│                                                 │
│  index.html                                     │
│    │                                            │
│    ▼                                            │
│  AudioContext                                   │
│    │                                            │
│    ▼                                            │
│  AudioWorkletNode ◄──── paramètres (freq, gain) │
│    │                                            │
└────┼────────────────────────────────────────────┘
     │ (communication inter-thread)
┌────┼────────────────────────────────────────────┐
│    ▼              Audio Thread                  │
│                                                 │
│  AudioWorkletProcessor                          │
│    │                                            │
│    ▼                                            │
│  synth.wasm (code DSP Faust)                    │
│    │                                            │
│    ▼                                            │
│  128 échantillons de sortie par cycle           │
│                                                 │
└─────────────────────────────────────────────────┘
```

Pour modifier les paramètres du synthétiseur depuis JavaScript, tu utilises l'API du nœud Faust :

```javascript
// Modifier la fréquence du synthétiseur à 880 Hz (La une octave au-dessus)
synthNode.setParamValue('/synth/Fréquence', 880);

// Modifier le volume à 50%
synthNode.setParamValue('/synth/Volume', 0.5);

// Activer le gate (déclencher le son)
synthNode.setParamValue('/synth/Gate', 1);

// Désactiver le gate (couper le son)
synthNode.setParamValue('/synth/Gate', 0);

// Lire la valeur actuelle d'un paramètre
const freqActuelle = synthNode.getParamValue('/synth/Fréquence');
console.log('Fréquence actuelle :', freqActuelle, 'Hz');
```

**Résultat attendu** :

```text
Fréquence actuelle : 880 Hz
```

---

### Étape 4 : Ajouter une interface utilisateur web

Ajoute des contrôles HTML pour piloter le synthétiseur. Modifie le fichier `index.html` en ajoutant des sliders et un bouton de gate :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synthétiseur Faust</title>
    <style>
        body {
            font-family: sans-serif;
            max-width: 600px;
            margin: 40px auto;
            padding: 0 20px;
        }
        button {
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
            margin: 10px 5px;
        }
        .active { background-color: #4CAF50; color: white; }
        /* Style des contrôles */
        .control {
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .control label {
            min-width: 100px;
            font-weight: bold;
        }
        .control input[type="range"] {
            flex: 1;
        }
        .control .value {
            min-width: 60px;
            text-align: right;
        }
        #gateBtn {
            background-color: #ddd;
            padding: 20px 40px;
            font-size: 20px;
            border: 2px solid #999;
            border-radius: 8px;
        }
        #gateBtn.active {
            background-color: #f44336;
            border-color: #d32f2f;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Synthétiseur Faust</h1>

    <button id="startBtn">Démarrer l'audio</button>
    <p id="status">Audio non démarré</p>

    <!-- Contrôles du synthétiseur (masqués tant que l'audio n'est pas démarré) -->
    <div id="controls" style="display: none;">
        <!-- Slider de fréquence -->
        <div class="control">
            <label for="freqSlider">Fréquence</label>
            <input type="range" id="freqSlider" min="20" max="2000" value="440" step="1">
            <span class="value" id="freqValue">440 Hz</span>
        </div>

        <!-- Slider de volume -->
        <div class="control">
            <label for="gainSlider">Volume</label>
            <input type="range" id="gainSlider" min="0" max="1" value="0.3" step="0.01">
            <span class="value" id="gainValue">0.30</span>
        </div>

        <!-- Bouton Gate (maintenir pour jouer) -->
        <div class="control">
            <button id="gateBtn">Jouer (maintenir)</button>
        </div>
    </div>

    <script type="module">
        import createSynthProcessor from './synth.js';

        let audioContext = null;
        let synthNode = null;

        // Démarrer l'audio au clic
        document.getElementById('startBtn').addEventListener('click', async () => {
            if (!audioContext) {
                audioContext = new AudioContext();
            }
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Charger le module Faust
            synthNode = await createSynthProcessor(audioContext);
            synthNode.connect(audioContext.destination);

            // Afficher les contrôles
            document.getElementById('controls').style.display = 'block';
            document.getElementById('status').textContent = 'Audio démarré';
            document.getElementById('startBtn').classList.add('active');
        });

        // Slider de fréquence : mise à jour en temps réel
        document.getElementById('freqSlider').addEventListener('input', (e) => {
            const freq = parseFloat(e.target.value);
            // Envoyer la nouvelle fréquence au module Faust
            synthNode.setParamValue('/synth/Fréquence', freq);
            document.getElementById('freqValue').textContent = freq + ' Hz';
        });

        // Slider de volume : mise à jour en temps réel
        document.getElementById('gainSlider').addEventListener('input', (e) => {
            const gain = parseFloat(e.target.value);
            // Envoyer le nouveau volume au module Faust
            synthNode.setParamValue('/synth/Volume', gain);
            document.getElementById('gainValue').textContent = gain.toFixed(2);
        });

        // Bouton Gate : maintenir pour jouer, relâcher pour couper
        const gateBtn = document.getElementById('gateBtn');

        // Activer le son quand on appuie (souris ou toucher)
        gateBtn.addEventListener('mousedown', () => {
            synthNode.setParamValue('/synth/Gate', 1);
            gateBtn.classList.add('active');
        });

        // Couper le son quand on relâche
        gateBtn.addEventListener('mouseup', () => {
            synthNode.setParamValue('/synth/Gate', 0);
            gateBtn.classList.remove('active');
        });

        // Gérer aussi les événements tactiles (mobile)
        gateBtn.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Empêcher le double événement sur mobile
            synthNode.setParamValue('/synth/Gate', 1);
            gateBtn.classList.add('active');
        });

        gateBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            synthNode.setParamValue('/synth/Gate', 0);
            gateBtn.classList.remove('active');
        });
    </script>
</body>
</html>
```

Redémarre le serveur HTTP local et teste dans le navigateur :

```bash
# Servir les fichiers localement
python3 -m http.server 8080
```

**Résultat attendu** :

```text
La page affiche :
- Un bouton "Démarrer l'audio"
- Un slider "Fréquence" (20 à 2000 Hz)
- Un slider "Volume" (0 à 1)
- Un bouton "Jouer (maintenir)" - le son se joue tant que tu appuies
```

---

### Étape 5 : Compiler pour Android avec faust2android (aperçu du workflow)

Cette étape présente le workflow de compilation vers Android. Elle nécessite Android Studio et le NDK installés sur ta machine.

Crée un programme Faust adapté au mobile avec SmartKeyboard :

```faust
// mobile_synth.dsp
// Synthétiseur pour mobile avec interface SmartKeyboard
import("stdfaust.lib");

// Déclarer l'interface SmartKeyboard (clavier tactile)
declare interface "SmartKeyboard{
    'Number of Keyboards':'1',
    'Max Keyboard Polyphony':'4',
    'Keyboard 0 - Number of Keys':'13',
    'Keyboard 0 - Lowest Key':'60'
}";

// Paramètres standard pour la polyphonie Faust
freq = hslider("freq", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Enveloppe ADSR simple
envelope = en.adsr(0.01, 0.1, 0.7, 0.3, gate);

// Synthèse : oscillateur sinusoïdal avec enveloppe
process = os.osc(freq) * gain * envelope;

// Activer la polyphonie (obligatoire pour SmartKeyboard)
// effect permet d'ajouter un effet global (ici, un simple passage)
effect = _, _;
```

Compile vers Android :

```bash
# Compiler le programme Faust en projet Android Studio
# L'option -install tente d'installer sur un appareil connecté
faust2android mobile_synth.dsp
```

**Résultat attendu** :

```text
# Un répertoire de projet Android Studio est généré
mobile_synth/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Code Java de l'interface utilisateur
│   │   │   ├── jni/           # Code C++ natif (DSP Faust compilé)
│   │   │   ├── res/           # Ressources Android (layouts, icônes)
│   │   │   └── AndroidManifest.xml
│   ├── build.gradle
├── build.gradle
└── settings.gradle
```

Pour compiler et installer l'application :

```bash
# Ouvrir le projet dans Android Studio
# Linux/macOS :
open mobile_synth/ -a "Android Studio"

# Ou compiler en ligne de commande (nécessite le SDK Android configuré)
cd mobile_synth && ./gradlew assembleDebug
```

**Workflow complet pour faust2ios** (sur macOS uniquement) :

```bash
# Compiler vers iOS - génère un projet Xcode
faust2ios mobile_synth.dsp

# Le projet Xcode est généré dans le répertoire courant
# Ouvrir dans Xcode
open mobile_synth.xcodeproj
```

**Résultat attendu** :

```text
# Structure du projet Xcode généré
mobile_synth.xcodeproj
mobile_synth/
├── FaustAU/           # Code Audio Unit (traitement audio iOS)
├── ViewController.mm  # Interface utilisateur (Objective-C)
├── Info.plist         # Configuration de l'application
└── faust-dsp.h       # Code DSP Faust compilé en C++
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust2wasm fichier.dsp` | Compiler en WebAssembly (module standard) |
| `faust2wasm -worklet fichier.dsp` | Compiler en WebAssembly avec AudioWorklet |
| `faust2wasm -poly fichier.dsp` | Compiler en WebAssembly avec polyphonie |
| `faust2wasm -poly -worklet fichier.dsp` | Compiler en WebAssembly polyphonique + AudioWorklet |
| `faust2android fichier.dsp` | Compiler en application Android |
| `faust2ios fichier.dsp` | Compiler en application iOS (macOS requis) |
| `faust2api -android fichier.dsp` | Générer une API Android (intégration dans app existante) |
| `faust2api -ios fichier.dsp` | Générer une API iOS (intégration dans app existante) |
| `python3 -m http.server 8080` | Serveur HTTP local pour tester les pages web |

---

## Pièges Fréquents

### Piège 1 : L'audio ne démarre pas dans le navigateur

**Problème** : Tu ouvres ta page web et rien ne se passe. Aucun son, aucune erreur visible.

**Solution** : Les navigateurs modernes appliquent une politique "autoplay" : l'audio ne peut démarrer qu'après une interaction utilisateur (clic, toucher). Tu dois créer l'`AudioContext` et appeler `resume()` dans un gestionnaire d'événement utilisateur.

```javascript
// ✅ Correct : créer le contexte au clic
document.getElementById('startBtn').addEventListener('click', async () => {
    const ctx = new AudioContext();
    await ctx.resume(); // Nécessaire si le contexte est suspendu
    // ... charger le module Faust
});
```

```javascript
// ❌ Incorrect : créer le contexte au chargement de la page
const ctx = new AudioContext(); // Ignoré par le navigateur sans interaction
```

---

### Piège 2 : Charger le fichier .wasm depuis file://

**Problème** : Tu ouvres `index.html` directement dans le navigateur (double-clic sur le fichier). Le navigateur affiche une erreur dans la console : `Failed to fetch` ou `CORS error`.

**Solution** : Les navigateurs interdisent le chargement de modules WebAssembly depuis le protocole `file://`. Tu dois utiliser un serveur HTTP local.

```bash
# ✅ Correct : servir via HTTP
python3 -m http.server 8080
# Puis ouvrir http://localhost:8080

# ❌ Incorrect : ouvrir directement le fichier
# file:///Users/user/projet/index.html  ← ne fonctionne pas
```

---

### Piège 3 : Chemins de paramètres incorrects dans setParamValue

**Problème** : Tu appelles `synthNode.setParamValue('/synth/Volume', 0.5)` mais le paramètre ne change pas. Aucune erreur visible.

**Solution** : Le chemin du paramètre dépend du nom du fichier `.dsp` et du label du slider. Utilise `getParams()` pour lister tous les chemins disponibles.

```javascript
// Lister tous les paramètres disponibles et leurs chemins
const params = synthNode.getParams();
console.log('Paramètres disponibles :', params);
```

**Résultat attendu** :

```text
Paramètres disponibles : ["/synth/Fréquence", "/synth/Volume", "/synth/Gate"]
```

Les chemins sont sensibles à la casse et aux accents. Copie-les exactement depuis la sortie de `getParams()`.

---

### Piège 4 : Oublier le mode polyphonique pour SmartKeyboard

**Problème** : Tu compiles un programme avec `declare interface "SmartKeyboard{...}"` sans l'option `-poly`. Le clavier s'affiche mais une seule note à la fois fonctionne.

**Solution** : SmartKeyboard nécessite le mode polyphonique. Ajoute `-poly` à la commande de compilation.

```bash
# ✅ Correct : compilation polyphonique
faust2wasm -poly -worklet mobile_synth.dsp
faust2android -poly mobile_synth.dsp

# ❌ Incorrect : compilation monophonique
faust2wasm mobile_synth.dsp
```

De plus, le programme Faust doit contenir les paramètres standard de polyphonie (`freq`, `gain`, `gate`) et déclarer un `effect` :

```faust
// ✅ Correct : paramètres polyphoniques standards
freq = hslider("freq", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");
effect = _, _;  // Effet stéréo passthrough (obligatoire)
```

---

### Piège 5 : Latence élevée sur Android

**Problème** : Le synthétiseur fonctionne sur Android mais la latence entre le toucher et le son est perceptible (50-200 ms).

**Solution** : La latence audio dépend de l'appareil Android. Les options pour la réduire :

- Utilise l'API Oboe (incluse par défaut dans les versions récentes de `faust2android`) qui sélectionne automatiquement le chemin audio le plus rapide.
- Réduis la taille du buffer audio dans les paramètres de l'application.
- Teste sur un appareil récent : les appareils Android récents (Android 10+) ont une latence plus faible.

---

## Checklist de Validation

- [ ] Je comprends que `faust2wasm` compile un fichier `.dsp` en module WebAssembly (`.wasm` + `.js`)
- [ ] Je sais que l'option `-worklet` génère du code AudioWorklet (recommandé)
- [ ] Je sais créer un `AudioContext` et le démarrer après une interaction utilisateur
- [ ] Je comprends la différence entre le main thread et le thread audio (AudioWorklet)
- [ ] Je sais connecter un nœud Faust à `ctx.destination` pour produire du son
- [ ] Je sais modifier les paramètres Faust depuis JavaScript avec `setParamValue`
- [ ] Je comprends pourquoi il faut un serveur HTTP local pour tester (pas de `file://`)
- [ ] Je connais `faust-web-component` pour intégrer Faust avec une seule balise HTML
- [ ] Je comprends la différence entre `ScriptProcessorNode` (deprecated) et `AudioWorkletNode`
- [ ] Je sais ce qu'est une PWA et quels fichiers sont nécessaires (manifest + Service Worker)
- [ ] Je connais `faust2android` et `faust2ios` pour les applications mobiles natives
- [ ] Je connais `faust2api` pour intégrer du DSP Faust dans une application existante
- [ ] Je sais que SmartKeyboard fournit une interface tactile pour instruments sur mobile

---

## Exercice Pratique

**Énoncé** : Créer un synthétiseur FM polyphonique web.

Compile un synthétiseur FM en WebAssembly et intègre-le dans une page HTML avec un clavier virtuel (boutons HTML) et des contrôles de paramètres.

**Partie 1** : Écris le programme Faust `fm_synth.dsp` :

- Un oscillateur porteur (sinusoïdal) dont la fréquence est modulée par un oscillateur modulateur.
- Paramètres : fréquence (`freq`), gain (`gain`), gate (`gate`), index de modulation (`modIndex`, de 0 à 10), ratio de modulation (`modRatio`, de 0.5 à 8).
- Enveloppe ADSR sur le gate.
- Le programme doit supporter la polyphonie (paramètres `freq`, `gain`, `gate` standards + `effect`).

**Partie 2** : Compile avec `faust2wasm -poly -worklet` et crée une page HTML avec :

- Un bouton "Démarrer l'audio"
- Un clavier virtuel de 8 boutons (notes Do4 à Do5) qui envoient les fréquences correspondantes
- Un slider pour l'index de modulation
- Un slider pour le ratio de modulation

**Indications** :

- La synthèse FM fonctionne ainsi : $\text{sortie} = \sin(2\pi \cdot freq \cdot t + index \cdot \sin(2\pi \cdot freq \cdot ratio \cdot t))$
- En Faust, utilise `os.osc` pour les oscillateurs
- Les fréquences des notes Do4 à Do5 : 261, 293, 329, 349, 392, 440, 493, 523 Hz
- Pour la polyphonie web, le glue code expose des méthodes `keyOn(canal, note_midi, vélocité)` et `keyOff(canal, note_midi, vélocité)`
- Les notes MIDI correspondantes : Do4 = 60, Ré4 = 62, Mi4 = 64, Fa4 = 65, Sol4 = 67, La4 = 69, Si4 = 71, Do5 = 72

**Résultat attendu** :

- Le synthétiseur joue un son FM dont le timbre change quand tu modifies l'index et le ratio de modulation
- Plusieurs notes peuvent sonner en même temps (polyphonie)
- Le son se déclenche quand tu appuies sur un bouton de note et s'arrête quand tu relâches

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Partie 1 : Programme Faust FM polyphonique

```faust
// fm_synth.dsp
// Synthétiseur FM polyphonique
import("stdfaust.lib");

// Paramètres polyphoniques standards (noms obligatoires pour la polyphonie)
freq = hslider("freq", 440, 20, 20000, 0.01);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// Paramètres de la synthèse FM
// L'index de modulation contrôle la "brillance" du son (0 = sinusoïde pure)
modIndex = hslider("Index de modulation", 2, 0, 10, 0.01);

// Le ratio de modulation contrôle la relation harmonique entre porteur et modulateur
// ratio = 1 → harmoniques naturelles, ratio = 1.5 → son métallique/cloche
modRatio = hslider("Ratio de modulation", 1, 0.5, 8, 0.01);

// Enveloppe ADSR
// attack = 0.01s, decay = 0.1s, sustain = 0.7 (70%), release = 0.3s
envelope = en.adsr(0.01, 0.1, 0.7, 0.3, gate);

// Synthèse FM :
// 1. Le modulateur oscille à freq * modRatio
// 2. Sa sortie est multipliée par modIndex * freq (déviation de fréquence)
// 3. Cette valeur est ajoutée à la fréquence du porteur
modulateur = os.osc(freq * modRatio) * modIndex * freq;
porteur = os.osc(freq + modulateur);

// Sortie : porteur * enveloppe * gain
process = porteur * envelope * gain;

// Effet global pour la polyphonie (passage stéréo, obligatoire)
effect = _, _;
```

Compile le programme :

```bash
# Compiler en WebAssembly polyphonique avec AudioWorklet
faust2wasm -poly -worklet fm_synth.dsp
```

**Résultat attendu** :

```text
fm_synth.wasm    # Module WebAssembly
fm_synth.js      # Glue code JavaScript avec support polyphonique
```

---

### Partie 2 : Page HTML avec clavier virtuel

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Synthétiseur FM - Faust WebAssembly</title>
    <style>
        body {
            font-family: sans-serif;
            max-width: 700px;
            margin: 40px auto;
            padding: 0 20px;
            background: #f5f5f5;
        }
        h1 { text-align: center; }

        /* Bouton de démarrage */
        #startBtn {
            display: block;
            margin: 20px auto;
            padding: 15px 30px;
            font-size: 18px;
            cursor: pointer;
        }
        #startBtn.active {
            background-color: #4CAF50;
            color: white;
        }

        /* Clavier virtuel */
        .keyboard {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin: 30px 0;
        }
        .key {
            width: 60px;
            height: 120px;
            background: white;
            border: 2px solid #333;
            border-radius: 0 0 6px 6px;
            cursor: pointer;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
            user-select: none;
        }
        .key:active, .key.active {
            background: #4CAF50;
            color: white;
        }

        /* Contrôles de paramètres */
        .control {
            margin: 15px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .control label {
            min-width: 180px;
            font-weight: bold;
        }
        .control input[type="range"] { flex: 1; }
        .control .value {
            min-width: 50px;
            text-align: right;
        }

        #controls { display: none; }
    </style>
</head>
<body>
    <h1>Synthétiseur FM</h1>

    <button id="startBtn">Démarrer l'audio</button>
    <p id="status" style="text-align: center;">Audio non démarré</p>

    <div id="controls">
        <!-- Clavier virtuel : 8 touches (Do4 à Do5) -->
        <div class="keyboard">
            <div class="key" data-midi="60">Do</div>
            <div class="key" data-midi="62">Ré</div>
            <div class="key" data-midi="64">Mi</div>
            <div class="key" data-midi="65">Fa</div>
            <div class="key" data-midi="67">Sol</div>
            <div class="key" data-midi="69">La</div>
            <div class="key" data-midi="71">Si</div>
            <div class="key" data-midi="72">Do</div>
        </div>

        <!-- Slider d'index de modulation -->
        <div class="control">
            <label for="modIndexSlider">Index de modulation</label>
            <input type="range" id="modIndexSlider"
                   min="0" max="10" value="2" step="0.1">
            <span class="value" id="modIndexValue">2.0</span>
        </div>

        <!-- Slider de ratio de modulation -->
        <div class="control">
            <label for="modRatioSlider">Ratio de modulation</label>
            <input type="range" id="modRatioSlider"
                   min="0.5" max="8" value="1" step="0.1">
            <span class="value" id="modRatioValue">1.0</span>
        </div>
    </div>

    <script type="module">
        import createFMProcessor from './fm_synth.js';

        let audioContext = null;
        let synthNode = null;

        // Démarrer l'audio
        document.getElementById('startBtn').addEventListener('click', async () => {
            if (!audioContext) {
                audioContext = new AudioContext();
            }
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Charger le module FM polyphonique
            synthNode = await createFMProcessor(audioContext);
            synthNode.connect(audioContext.destination);

            // Afficher les contrôles
            document.getElementById('controls').style.display = 'block';
            document.getElementById('status').textContent = 'Audio démarré - joue une note';
            document.getElementById('startBtn').classList.add('active');
        });

        // Gestion du clavier virtuel
        const keys = document.querySelectorAll('.key');

        keys.forEach(key => {
            const midiNote = parseInt(key.dataset.midi);

            // Appui souris : déclencher la note (keyOn)
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                // keyOn(canal, note_midi, vélocité)
                // canal = 0, vélocité = 100 (sur 127)
                synthNode.keyOn(0, midiNote, 100);
                key.classList.add('active');
            });

            // Relâchement souris : couper la note (keyOff)
            key.addEventListener('mouseup', (e) => {
                e.preventDefault();
                // keyOff(canal, note_midi, vélocité)
                synthNode.keyOff(0, midiNote, 100);
                key.classList.remove('active');
            });

            // Si la souris quitte le bouton pendant l'appui, couper la note
            key.addEventListener('mouseleave', () => {
                synthNode.keyOff(0, midiNote, 100);
                key.classList.remove('active');
            });

            // Événements tactiles (mobile)
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                synthNode.keyOn(0, midiNote, 100);
                key.classList.add('active');
            });

            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                synthNode.keyOff(0, midiNote, 100);
                key.classList.remove('active');
            });
        });

        // Slider d'index de modulation
        document.getElementById('modIndexSlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            // Le chemin utilise le nom du fichier et le label du slider
            synthNode.setParamValue('/fm_synth/Index_de_modulation', value);
            document.getElementById('modIndexValue').textContent = value.toFixed(1);
        });

        // Slider de ratio de modulation
        document.getElementById('modRatioSlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            synthNode.setParamValue('/fm_synth/Ratio_de_modulation', value);
            document.getElementById('modRatioValue').textContent = value.toFixed(1);
        });
    </script>
</body>
</html>
```

Pour tester :

```bash
# Servir les fichiers localement
python3 -m http.server 8080
```

**Résultat attendu** :

```text
http://localhost:8080 affiche :
- Un bouton "Démarrer l'audio"
- 8 touches de piano (Do4 à Do5)
- 2 sliders (index et ratio de modulation)

Comportement :
- Cliquer sur une touche déclenche un son FM
- Plusieurs touches simultanées fonctionnent (polyphonie)
- Index = 0 : son sinusoïdal pur
- Index = 5, Ratio = 1 : son riche en harmoniques (type orgue)
- Index = 8, Ratio = 1.4 : son métallique (type cloche)
- Relâcher une touche déclenche le release de l'enveloppe ADSR
```

Vérifie la structure complète du projet :

```bash
# Lister tous les fichiers du projet web
ls -la
```

**Résultat attendu** :

```text
fm_synth.dsp       # Programme Faust source
fm_synth.wasm      # Module WebAssembly compilé
fm_synth.js        # Glue code JavaScript
index.html         # Page web avec clavier virtuel
```

---

## Navigation

← Fiche précédente : **[03 - Applications standalone](03-applications-standalone.md)**

→ Fiche suivante : **[05 - Embarqué et hardware](05-embarque-hardware.md)**
