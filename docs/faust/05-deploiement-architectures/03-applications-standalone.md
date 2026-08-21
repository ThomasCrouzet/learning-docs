---
tags:
  - Faust
  - Avancé
  - Pratique
description: "Applications standalone Faust - faust2jaqt, faust2jack, externals pour Max/PD/SC et FaustLive"
estimated_time: "70 min"
fiche_number: 3
total_fiches: 5
cursus: "Phase 5 - Déploiement et architectures"
id: "specializations.faust.deployment.applications-standalone"
course_id: "specializations.faust"
module_id: "specializations.faust.deployment"
content_type: "lesson"
order: 3
---

# 03 - Applications standalone

> **En bref** : À la fin de cette fiche, tu sauras compiler et exécuter des applications Faust standalone avec différents drivers audio, et créer des externals pour Max/MSP, PureData et SuperCollider. Lecture estimée : 70 min.


## Prérequis

- [Fiche 01 - Système d'architectures Faust](01-systeme-architectures-faust.md)
- [Fiche 03 - Environnement et outils](../02-prerequis-programmation/03-environnement-outils.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras compiler et exécuter des applications Faust standalone avec différents drivers audio, et créer des externals pour Max/MSP, PureData et SuperCollider.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que faust2jaqt ?

**Définition** : `faust2jaqt` est un script de compilation qui transforme un fichier Faust `.dsp` en application standalone avec une interface graphique Qt et le driver audio JACK. C'est le workflow le plus rapide pour tester un programme Faust sur un ordinateur de bureau.

**Le problème que faust2jaqt résout** :

Sans `faust2jaqt`, voici les problèmes rencontrés :

1. **Chaîne de compilation manuelle** : Il faut appeler le compilateur Faust, puis écrire les commandes `g++` avec les drapeaux Qt et les liens JACK.
2. **Interface graphique manuelle** : Créer une fenêtre Qt avec sliders et boutons demande des dizaines de lignes de C++ supplémentaires.
3. **Intégration JACK manuelle** : Gérer les callbacks JACK (client, ports, boucle audio) est répétitif et source d'erreurs.

**Comment faust2jaqt résout ces problèmes** :

| Problème | Solution apportée par faust2jaqt |
| -------- | -------------------------------- |
| Chaîne de compilation manuelle | Une seule commande : `faust2jaqt fichier.dsp` |
| Interface graphique manuelle | L'interface Qt est générée depuis les métadonnées du code Faust |
| Intégration JACK manuelle | Le script lie automatiquement les bibliothèques JACK |

**Analogie concrète** : `faust2jaqt` est comme un distributeur automatique de boissons. Tu insères ta recette (le fichier `.dsp`), tu appuies sur un bouton, et tu obtiens une boisson prête à boire (l'application). Sans le distributeur, tu devrais aller chercher les ingrédients et les mélanger toi-même.

**Ce que faust2jaqt n'est PAS** :

- `faust2jaqt` n'est pas un éditeur de code. Il compile ton fichier `.dsp` en application exécutable.
- `faust2jaqt` n'est pas adapté à la production finale. Pour distribuer un effet audio, compile en plugin (VST, LV2).

**Options courantes de faust2jaqt** :

| Option | Effet | Exemple |
| ------ | ----- | ------- |
| `-httpd` | Ajoute un serveur HTTP pour contrôler l'application à distance | `faust2jaqt -httpd synth.dsp` |
| `-osc` | Ajoute le support OSC (Open Sound Control) | `faust2jaqt -osc synth.dsp` |
| `-midi` | Active le support MIDI | `faust2jaqt -midi synth.dsp` |
| `-nvoices N` | Polyphonie à N voix (pour les synthétiseurs) | `faust2jaqt -nvoices 8 synth.dsp` |
| `-effect auto` | Ajoute un effet global en mode polyphonique | `faust2jaqt -nvoices 8 -effect auto synth.dsp` |
| `-double` | Utilise des flottants 64 bits | `faust2jaqt -double filtre.dsp` |

---

### Qu'est-ce que faust2caqt ?

**Définition** : `faust2caqt` est un script de compilation identique à `faust2jaqt`, mais qui utilise CoreAudio (le driver audio natif de macOS) au lieu de JACK. L'interface graphique reste Qt.

**Le problème que faust2caqt résout** :

Sans `faust2caqt`, voici les problèmes rencontrés :

1. **Dépendance à JACK sur macOS** : JACK n'est pas installé par défaut sur macOS. Pour tester un programme Faust rapidement, installer et configurer JACK représente une étape supplémentaire.

2. **Routage inutile pour un test simple** : Quand tu veux juste entendre le résultat d'un programme, le routage JACK (connexion des ports, configuration du serveur) est une surcharge inutile.

**Comment faust2caqt résout ces problèmes** :

| Problème | Solution apportée par faust2caqt |
| -------- | -------------------------------- |
| Dépendance à JACK sur macOS | Utilise CoreAudio, déjà présent sur tout Mac |
| Routage inutile pour un test simple | L'application se connecte directement à la carte son |

**Analogie concrète** : `faust2caqt` est comme brancher un casque directement sur un instrument de musique. `faust2jaqt` est comme passer par une table de mixage (JACK) avant d'atteindre le casque. Pour un test rapide, le branchement direct suffit.

**Comparaison faust2jaqt vs faust2caqt** :

| Caractéristique | faust2jaqt | faust2caqt |
| --------------- | ---------- | ---------- |
| Driver audio | JACK | CoreAudio (macOS) |
| OS supporté | Linux, macOS | macOS uniquement |
| Dépendance externe | JACK doit être installé et démarré | Aucune (CoreAudio est natif) |
| Routage inter-applications | Oui (via les ports JACK) | Non |
| Interface graphique | Qt | Qt |
| Latence | Dépend de la configuration JACK | Dépend de la configuration CoreAudio |

---

### Qu'est-ce que faust2jack ?

**Définition** : `faust2jack` est un script de compilation qui génère une application JACK sans interface graphique (headless). L'application tourne en ligne de commande et traite le signal audio en arrière-plan.

**Le problème que faust2jack résout** :

Sans `faust2jack`, voici les problèmes rencontrés :

1. **Interface graphique inutile** : Pour un traitement audio en arrière-plan, une fenêtre Qt est superflue.
2. **Dépendance à Qt** : Installer Qt sur un serveur Linux minimal est inutilement lourd.

**Comment faust2jack résout ces problèmes** :

| Problème | Solution apportée par faust2jack |
| -------- | -------------------------------- |
| Interface graphique inutile | Pas de fenêtre, l'application tourne en ligne de commande |
| Dépendance à Qt | Aucune dépendance à Qt, seulement JACK |

**Analogie concrète** : `faust2jack` est comme un répondeur téléphonique. Il traite le signal en arrière-plan, sans écran ni boutons visibles. Tu le lances et il fonctionne tout seul.

**Ce que faust2jack n'est PAS** :

- `faust2jack` ne génère pas de contrôles interactifs. Les sliders ne sont pas accessibles visuellement. Utilise `-osc` pour les contrôler via OSC.
- `faust2jack` ne remplace pas `faust2jaqt` pour le développement. L'interface graphique reste plus pratique pour les tests.

---

### Qu'est-ce que faust2alsa ?

**Définition** : `faust2alsa` est un script de compilation qui génère une application standalone utilisant ALSA (Advanced Linux Sound Architecture) comme driver audio. ALSA est le système audio de bas niveau intégré au noyau Linux.

**Le problème que faust2alsa résout** :

Sans `faust2alsa`, voici les problèmes rencontrés :

1. **JACK non disponible** : Sur certaines distributions Linux minimales ou embarquées, JACK n'est pas installé.
2. **Latence excessive** : PulseAudio/PipeWire ajoutent de la latence. ALSA donne un accès direct au matériel.

**Comment faust2alsa résout ces problèmes** :

| Problème | Solution apportée par faust2alsa |
| -------- | -------------------------------- |
| JACK non disponible | Utilise ALSA, toujours présent sur Linux |
| Latence excessive | Accès direct au matériel via ALSA |

**Analogie concrète** : `faust2alsa` est comme parler directement à quelqu'un dans la même pièce (accès direct au matériel), tandis que `faust2jaqt` est comme passer par un interprète (JACK) qui peut aussi traduire pour d'autres personnes en même temps.

**Ce que faust2alsa n'est PAS** :

- `faust2alsa` n'est pas utilisable sur macOS ou Windows. ALSA est spécifique à Linux.
- `faust2alsa` ne permet pas le routage inter-applications. ALSA envoie le signal directement à la carte son.

---

### Qu'est-ce que FaustLive ?

**Définition** : FaustLive est une application de bureau qui permet le prototypage audio en temps réel avec hot-reloading. Tu édites ton code Faust, tu sauvegardes, et FaustLive recompile instantanément grâce à LLVM JIT. Le son change en temps réel, sans interruption.

**Le problème que FaustLive résout** :

Sans FaustLive, voici les problèmes rencontrés :

1. **Cycle édition-compilation-test lent** : Recompiler avec `faust2jaqt`, relancer, reconnecter les ports JACK prend 10 à 30 secondes à chaque modification.
2. **Interruption du son** : À chaque recompilation, le son s'arrête.
3. **Exploration difficile** : Chercher le bon coefficient pour un filtre demande des dizaines d'itérations rapides.

**Comment FaustLive résout ces problèmes** :

| Problème | Solution apportée par FaustLive |
| -------- | ------------------------------- |
| Cycle lent | Recompilation instantanée (< 100 ms) grâce à LLVM JIT |
| Interruption du son | Transition sans coupure entre les versions |
| Exploration difficile | Modifier, sauvegarder, entendre : moins d'une seconde |

**Analogie concrète** : FaustLive est comme un sculpteur qui travaille l'argile sur un tour. Chaque geste modifie la forme en temps réel. Sans FaustLive, c'est comme si le sculpteur devait cuire la pièce au four après chaque retouche.

**Ce que FaustLive n'est PAS** :

- FaustLive n'est pas un outil de production. Il sert au prototypage. Pour un plugin final, utilise `faust2xxx`.
- FaustLive n'est pas toujours disponible dans les distributions récentes. Vérifie sur le site de GRAME.

---

### Que sont les externals pour Max/MSP ?

**Définition** : `faustgen~` est un objet Max/MSP qui intègre le compilateur Faust directement dans Max. Tu écris du code Faust dans l'éditeur intégré de l'objet, et le code est compilé en temps réel via LLVM JIT.

**Le problème que faustgen~ résout** :

Sans `faustgen~`, voici les problèmes rencontrés :

1. **DSP limité en Max** : Les objets natifs couvrent les cas courants, mais certaines transformations complexes sont difficiles à réaliser en Max pur.
2. **External C++ complexe** : Créer un external Max en C++ demande de comprendre le SDK Max, la gestion mémoire et les callbacks DSP.
3. **Itération lente** : Modifier un external C++ impose le cycle compilation-relancement.

**Comment faustgen~ résout ces problèmes** :

| Problème | Solution apportée par faustgen~ |
| -------- | ------------------------------- |
| DSP limité en Max | Accès à tout le langage Faust dans un objet Max |
| External C++ complexe | Tu écris en Faust, la compilation est automatique |
| Itération lente | Le code est recompilé en temps réel dans Max |

**Analogie concrète** : `faustgen~` est comme un traducteur simultané dans une réunion internationale (le patch Max). Au lieu d'envoyer un document et d'attendre la traduction (compiler un external C++), le traducteur convertit tes phrases en temps réel.

**Ce que faustgen~ n'est PAS** :

- `faustgen~` n'est pas un objet audio standard. Il contient un compilateur complet (LLVM), donc il est plus lourd en mémoire.
- `faustgen~` n'est pas un remplacement de Max. Il s'intègre comme un objet parmi d'autres.

---

### Que sont les externals pour PureData ?

**Définition** : `faust2puredata` est un script qui compile un fichier Faust `.dsp` en external PureData (fichier `.pd_linux` sur Linux, `.pd_darwin` sur macOS, `.pd_windows` sur Windows).

**Le problème que faust2puredata résout** :

Sans `faust2puredata`, voici les problèmes rencontrés :

1. **External Pd en C complexe** : Le SDK PureData demande de manipuler des structures C spécifiques (`t_object`, `t_signal`) et les callbacks `dsp_add`.
2. **DSP avancé difficile en Pd vanilla** : Les algorithmes complexes (réverbération, synthèse FM) sont laborieux à construire avec des objets graphiques seuls.
3. **Portabilité limitée** : Un external écrit en C pour Linux doit être recompilé avec des drapeaux différents pour chaque OS.

**Comment faust2puredata résout ces problèmes** :

| Problème | Solution apportée par faust2puredata |
| -------- | ------------------------------------ |
| External Pd en C complexe | Tu écris en Faust, le script compile l'external |
| DSP avancé difficile | Accès à tout le langage Faust dans un objet Pd |
| Portabilité limitée | Le même `.dsp` compile vers Linux, macOS et Windows |

**Analogie concrète** : `faust2puredata` est comme un moule à pièces détachées. Tu conçois la pièce dans un logiciel de CAO (Faust), et le moule produit la pièce physique (l'external) adaptée à la machine cible.

**Ce que faust2puredata n'est PAS** :

- `faust2puredata` ne génère pas un patch Pd. Il génère un external (bibliothèque dynamique) que tu charges dans un patch.
- `faust2puredata` ne fait pas de hot-reloading. Chaque modification nécessite une recompilation.

---

### Que sont les externals pour SuperCollider ?

**Définition** : `faust2supercollider` est un script qui compile un fichier Faust `.dsp` en UGen (Unit Generator) SuperCollider. Le UGen compilé s'utilise dans sclang comme n'importe quel UGen natif et tourne dans scsynth en C++.

**Le problème que faust2supercollider résout** :

Sans `faust2supercollider`, voici les problèmes rencontrés :

1. **UGen C++ complexe** : Le SDK SuperCollider demande de comprendre l'architecture client/serveur, les macros UGen et la gestion des buffers.
2. **Pas de DSP personnalisé** : Certains algorithmes spécifiques n'existent pas parmi les UGens standard.
3. **Performances en sclang** : Le DSP écrit en sclang est moins performant que du C++ compilé.

**Comment faust2supercollider résout ces problèmes** :

| Problème | Solution apportée par faust2supercollider |
| -------- | ----------------------------------------- |
| UGen C++ complexe | Tu écris en Faust, le script génère le UGen C++ |
| Pas de DSP personnalisé | Tu crées exactement l'algorithme dont tu as besoin |
| Performances en sclang | Le UGen compilé tourne dans scsynth en C++ natif |

**Analogie concrète** : `faust2supercollider` est comme un atelier de pédales de guitare sur mesure. Au lieu de souder le circuit toi-même (écrire un UGen en C++), tu dessines le schéma (Faust) et l'atelier fabrique la pédale prête à brancher.

**Ce que faust2supercollider n'est PAS** :

- `faust2supercollider` ne génère pas du code sclang. Il génère un plugin UGen (bibliothèque dynamique).
- `faust2supercollider` ne fait pas de hot-reloading. Chaque modification nécessite une recompilation et un redémarrage de scsynth.

---

### Comparaison des cibles standalone

**Cibles standalone** :

| Script | OS supporté | Driver audio | Interface graphique | Dépendances |
| ------ | ----------- | ------------ | ------------------- | ----------- |
| `faust2jaqt` | Linux, macOS | JACK | Qt | JACK, Qt |
| `faust2caqt` | macOS | CoreAudio | Qt | Qt |
| `faust2jack` | Linux, macOS | JACK | Aucune (headless) | JACK |
| `faust2alsa` | Linux | ALSA | Gtk | ALSA, Gtk |

**Externals pour environnements tiers** :

| Script/Objet | Environnement | Compilation | Hot-reloading |
| ------------ | ------------- | ----------- | ------------- |
| `faustgen~` | Max/MSP | Temps réel (LLVM JIT dans Max) | Oui |
| `faust2puredata` | PureData | Hors ligne (script shell) | Non |
| `faust2supercollider` | SuperCollider | Hors ligne (script shell) | Non |

**Choix de la cible selon le contexte** :

| Contexte | Cible recommandée |
| -------- | ----------------- |
| Prototypage rapide sur macOS | `faust2caqt` (pas besoin de JACK) |
| Développement avec routage audio | `faust2jaqt` (connexions JACK entre applications) |
| Serveur audio sans écran | `faust2jack` (headless) |
| Linux embarqué sans JACK | `faust2alsa` |
| Exploration sonore avec retour immédiat | FaustLive (hot-reloading) |
| Intégration dans un patch Max/MSP | `faustgen~` |
| Intégration dans un patch PureData | `faust2puredata` |
| Intégration dans SuperCollider | `faust2supercollider` |

---

## Étapes Pratiques

### Étape 1 : Compiler et lancer avec faust2jaqt (Qt + JACK)

Cette étape crée une application standalone avec interface graphique et sortie JACK.

Crée un fichier `synth-test.dsp` :

```faust
// synth-test.dsp
// Synthétiseur simple avec fréquence et volume contrôlables

import("stdfaust.lib");

// Slider de fréquence : valeur par défaut 440 Hz, entre 20 et 2000 Hz, pas de 1
freq = hslider("Fréquence [Hz]", 440, 20, 2000, 1);

// Slider de volume : valeur par défaut 0.3, entre 0 et 1, pas de 0.01
vol = hslider("Volume", 0.3, 0, 1, 0.01);

// Oscillateur sinusoïdal multiplié par le volume
process = os.osc(freq) * vol;
```

Assure-toi que JACK est démarré, puis compile :

```bash
# Démarrer JACK si ce n'est pas déjà fait (macOS)
jackd -d coreaudio -r 44100 -p 256 &
```

```bash
# Compiler le synthétiseur en application JACK + Qt
faust2jaqt synth-test.dsp
```

```bash
# Lancer l'application
./synth-test
```

**Résultat attendu** :

```text
Une fenêtre Qt s'ouvre avec deux sliders :
- "Fréquence [Hz]" : réglable de 20 à 2000 Hz (valeur initiale : 440)
- "Volume" : réglable de 0 à 1 (valeur initiale : 0.3)

Tu entends un son sinusoïdal. Déplace les sliders pour changer
la fréquence et le volume en temps réel.
```

Pour quitter, ferme la fenêtre ou appuie sur `Ctrl+C` dans le terminal.

---

### Étape 2 : Compiler avec faust2caqt (Qt + CoreAudio) sur macOS

Cette étape ne nécessite pas JACK.

```bash
# Compiler avec CoreAudio (macOS uniquement)
faust2caqt synth-test.dsp

# Lancer l'application
./synth-test
```

**Résultat attendu** :

```text
La même fenêtre Qt s'ouvre. Le son sort via CoreAudio (pas besoin de JACK).
L'application ne crée pas de ports JACK : pas de routage inter-applications.
```

---

### Étape 3 : Tester FaustLive avec hot-reloading

FaustLive permet de modifier le code et d'entendre le résultat en temps réel.

```bash
# Lancer FaustLive (installer depuis https://github.com/grame-cncm/faustlive)
FaustLive
```

Ouvre ton fichier `synth-test.dsp` par glisser-déposer ou via le menu **File > Open**.

Modifie le code dans un éditeur externe (VS Code par exemple) :

```faust
// synth-test.dsp - Version modifiée pour tester le hot-reloading
import("stdfaust.lib");

// Ajouter un deuxième oscillateur pour créer un battement
freq = hslider("Fréquence [Hz]", 440, 20, 2000, 1);
detune = hslider("Désaccord [Hz]", 2, 0, 10, 0.1);
vol = hslider("Volume", 0.3, 0, 1, 0.01);

// Deux oscillateurs légèrement désaccordés créent un battement audible
process = (os.osc(freq) + os.osc(freq + detune)) * 0.5 * vol;
```

Sauvegarde le fichier. FaustLive recompile automatiquement. Tu entends immédiatement le battement entre les deux oscillateurs, sans interruption du son.

**Résultat attendu** :

```text
- Le son change en continu à chaque sauvegarde
- Un nouveau slider "Désaccord [Hz]" apparaît dans l'interface
- En réglant le désaccord entre 1 et 5 Hz, tu entends un battement
  (variation périodique du volume, comme un vibrato lent)
```

---

### Étape 4 : Compiler un external PureData et le charger dans un patch

Cette étape génère un external Pd depuis un fichier Faust et l'utilise dans un patch.

Crée un fichier `freeverb.dsp` :

```faust
// freeverb.dsp - Réverbération Freeverb pour PureData
import("stdfaust.lib");

roomsize = hslider("roomsize", 0.5, 0, 1, 0.01);  // 0=petite, 1=grande
damp = hslider("damp", 0.5, 0, 1, 0.01);            // 0=brillant, 1=mat
wet = hslider("wet", 0.3, 0, 1, 0.01);              // 0=sec, 1=100% réverbe

// re.stereo_freeverb(fb1, fb2, damp, spread) prend 2 entrées, donne 2 sorties.
// On câble nos propres sliders dessus : roomsize pilote la taille (fb1),
// fb2=0.5 (allpass), damp l'amortissement, spread=0.
reverb = re.stereo_freeverb(roomsize, 0.5, damp, 0);

// Mélange dry/wet stéréo : le couple (L, R) est dupliqué en une copie sèche
// (* 1-wet) et une copie réverbérée (* wet), puis les canaux sont resommés.
dry = _ * (1 - wet), _ * (1 - wet);
wet_path = reverb : _ * wet, _ * wet;
process = _, _ <: dry, wet_path :> _, _;
```

```bash
# Compiler en external PureData
faust2puredata freeverb.dsp
```

**Résultat attendu** :

```text
freeverb~.pd_darwin     (sur macOS)
freeverb~.pd_linux      (sur Linux)
```

Le fichier généré est un external PureData. Pour l'utiliser dans un patch :

1. Copie le fichier `.pd_darwin` (ou `.pd_linux`) dans le dossier de ton patch Pd
2. Ouvre PureData
3. Crée un nouvel objet (`Ctrl+1` ou `Cmd+1`) et tape `freeverb~`
4. Connecte une source audio à ses entrées et `dac~` à ses sorties

**Résultat attendu** :

```text
PureData charge l'objet freeverb~ dans le patch.
Le son du microphone (adc~) passe par la réverbération
et sort dans les haut-parleurs (dac~).
Les paramètres (roomsize, damp, wet) sont contrôlables
via des messages Pd envoyés à l'objet.
```

---

### Étape 5 : Connecter des applications Faust entre elles via JACK

JACK permet de router le signal audio entre plusieurs applications Faust. Dans cet exemple, tu vas connecter la sortie d'un synthétiseur à l'entrée d'un effet.

Crée un fichier `delay-effect.dsp` :

```faust
// delay-effect.dsp - Effet de délai simple (écho)
import("stdfaust.lib");

delay_ms = hslider("Délai [ms]", 300, 10, 2000, 1);
feedback = hslider("Feedback", 0.5, 0, 0.95, 0.01);
mix = hslider("Mix", 0.4, 0, 1, 0.01);

// Convertir les ms en échantillons (ma.SR = fréquence d'échantillonnage)
delay_samples = delay_ms * ma.SR / 1000;
max_delay = 2 * ma.SR;  // Buffer de 2 secondes max

// Ligne de délai avec feedback récursif
delay_line = + ~ (de.delay(max_delay, delay_samples) : *(feedback));

// Mixage sec/mouillé
process = _ <: *(1 - mix), (delay_line : *(mix)) :> _;
```

Compile les deux programmes :

```bash
# Compiler le synthétiseur et l'effet de délai
faust2jaqt synth-test.dsp
faust2jaqt delay-effect.dsp
```

Lance les deux applications (JACK doit être démarré) :

```bash
# Lancer les deux applications en arrière-plan
./synth-test &
./delay-effect &
```

Connecte la sortie du synthétiseur à l'entrée de l'effet :

```bash
# Voir les ports disponibles
jack_lsp

# Connecter le synthétiseur vers l'effet
jack_connect synth-test:out_0 delay-effect:in_0

# Connecter l'effet vers les haut-parleurs
jack_connect delay-effect:out_0 system:playback_1
jack_connect delay-effect:out_0 system:playback_2
```

**Résultat attendu** : le son du synthétiseur passe par l'effet de délai. Tu entends le son original suivi d'échos. Ajuste le feedback et le délai dans la fenêtre de l'effet. Pour visualiser les connexions, lance `qjackctl` et clique sur **Connect**.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust2jaqt fichier.dsp` | Compile en application JACK + Qt |
| `faust2jaqt -midi fichier.dsp` | Compile avec support MIDI |
| `faust2jaqt -osc fichier.dsp` | Compile avec support OSC |
| `faust2jaqt -httpd fichier.dsp` | Compile avec serveur HTTP de contrôle |
| `faust2jaqt -nvoices 8 fichier.dsp` | Compile en synthétiseur polyphonique (8 voix) |
| `faust2caqt fichier.dsp` | Compile en application CoreAudio + Qt (macOS) |
| `faust2jack fichier.dsp` | Compile en application JACK headless |
| `faust2alsa fichier.dsp` | Compile en application ALSA (Linux) |
| `faust2puredata fichier.dsp` | Compile en external PureData |
| `faust2supercollider fichier.dsp` | Compile en UGen SuperCollider |
| `jack_lsp` | Liste les ports JACK disponibles |
| `jack_connect port1 port2` | Connecte deux ports JACK |
| `jack_disconnect port1 port2` | Déconnecte deux ports JACK |

---

## Pièges Fréquents

### Piège 1 : JACK n'est pas démarré avant faust2jaqt

**Problème** : Tu lances une application compilée avec `faust2jaqt` et tu obtiens :

```text
Cannot connect to JACK server
```

**Solution** : Démarre JACK avant de lancer l'application.

```bash
# Démarrer JACK en arrière-plan (macOS)
jackd -d coreaudio -r 44100 -p 256 &
```

```bash
# Démarrer JACK en arrière-plan (Linux)
jackd -d alsa -r 44100 -p 256 &
```

Ou utilise `faust2caqt` sur macOS pour éviter complètement JACK.

---

### Piège 2 : Qt non installé pour faust2jaqt ou faust2caqt

**Problème** : La compilation échoue avec `fatal error: QApplication: No such file or directory`.

**Solution** : Installe Qt (`brew install qt@5` sur macOS, `sudo apt-get install qtbase5-dev` sur Linux).

---

### Piège 3 : L'external PureData ne se charge pas

**Problème** : PureData affiche `freeverb~: can't load library`.

**Solution** : Vérifie que le fichier `.pd_darwin`/`.pd_linux` est dans le dossier du patch ou dans le chemin de recherche de Pd (**File > Preferences > Path**). Vérifie aussi que l'architecture correspond (Intel vs ARM).

---

### Piège 4 : Les ports JACK ne se connectent pas

**Problème** : `jack_connect` échoue avec `error connecting ports`.

**Solution** : Vérifie les noms de ports exacts avec `jack_lsp -c`. Les noms dépendent du nom de l'application (ex. `synth-test:out_0`).

---

### Piège 5 : FaustLive ne recompile pas au changement

**Problème** : Tu sauvegardes le `.dsp` mais FaustLive ne réagit pas.

**Solution** : FaustLive ne surveille que les fichiers ouverts par glisser-déposer ou **File > Open**. Si tu as copié le code dans l'éditeur interne, il ne surveille aucun fichier externe. Rouvre le fichier via le menu.

---

### Piège 6 : Confusion entre faustgen~ et faust2puredata

**Problème** : Tu essaies d'utiliser `faustgen~` dans PureData ou `faust2puredata` dans Max/MSP.

**Solution** : `faustgen~` est exclusif à Max/MSP (compilation temps réel). `faust2puredata` est exclusif à PureData (compilation hors ligne).

---

## Checklist de Validation

- [ ] Je sais compiler un programme Faust avec `faust2jaqt` et lancer l'application
- [ ] Je sais utiliser `faust2caqt` sur macOS sans JACK
- [ ] Je comprends la différence entre `faust2jaqt` (Qt + JACK) et `faust2jack` (headless)
- [ ] Je sais que `faust2alsa` est l'alternative Linux sans JACK
- [ ] Je sais utiliser FaustLive pour le prototypage avec hot-reloading
- [ ] Je sais créer un external PureData avec `faust2puredata`
- [ ] Je comprends le rôle de `faustgen~` dans Max/MSP
- [ ] Je comprends le rôle de `faust2supercollider` pour SuperCollider
- [ ] Je sais connecter des applications Faust entre elles via JACK (`jack_connect`)
- [ ] Je connais les options courantes de faust2jaqt (`-midi`, `-osc`, `-httpd`, `-nvoices`)

---

## Exercice Pratique

**Énoncé** : Créer un looper audio simple avec les fonctionnalités suivantes :

- Enregistrement du signal d'entrée dans un buffer circulaire (`rwtable`)
- Lecture en boucle du buffer enregistré
- Overdub (superposition de nouvelles couches sur l'enregistrement existant)
- Contrôle par boutons : Record, Play, Stop, Clear

Compile l'application en standalone et teste-la.

**Indications** :

- Utilise `rwtable` pour le buffer audio. `rwtable(taille, init, index_ecriture, valeur, index_lecture)` est une table de lecture/écriture
- La taille du buffer détermine la durée maximale de la boucle. À 44100 Hz, un buffer de 441000 échantillons donne 10 secondes
- Utilise `button` pour les boutons et `checkbox` pour les états on/off
- L'index de lecture et d'écriture doivent avancer au même rythme (compteur modulo la taille du buffer)
- Pour l'overdub, additionne le signal existant dans le buffer avec le nouveau signal d'entrée
- L'opérateur `ba.countup(max, reset)` de la bibliothèque standard crée un compteur utile pour l'index
- Compile avec `faust2jaqt` ou `faust2caqt`

**Résultat attendu** :

- L'application affiche 4 boutons : Record, Play, Stop, Clear
- En activant Record, le signal du microphone est enregistré dans le buffer
- En activant Play, le buffer est lu en boucle
- En activant Record pendant la lecture, le nouveau signal se superpose à l'ancien (overdub)
- Le bouton Clear remet le buffer à zéro

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Créer le fichier looper.dsp

```faust
// looper.dsp - Looper audio avec enregistrement, lecture, overdub et clear
import("stdfaust.lib");

// Taille du buffer : 10 secondes à la fréquence d'échantillonnage
buf_size = 10 * ma.SR;

// Contrôles (checkbox = état on/off, button = impulsion)
record = checkbox("[1] Record");
play = checkbox("[2] Play");
clear = button("[3] Clear");
mon_vol = hslider("[4] Monitor", 0.5, 0, 1, 0.01);
loop_vol = hslider("[5] Loop Volume", 0.8, 0, 1, 0.01);

// Compteur cyclique de 0 à buf_size-1, remis à 0 par clear
counter = ba.countup(buf_size - 1, clear) : %(buf_size);

// Signal à écrire dans le buffer :
// clear → silence / record → overdub (entrée + existant) / sinon → conserver
write_signal(input, existing) =
    select2(clear > 0,
        select2(record > 0,
            existing,           // Pas d'enregistrement : on conserve le contenu
            input + existing    // Enregistrement actif : overdub
        ),
        0.0                     // Clear : on écrit du silence
    );

// Buffer avec rétroaction : lire et réécrire à chaque échantillon
looper(input) = (write_signal(input) : write_to_table) ~ _
with {
    write_to_table(val) = rwtable(buf_size, 0.0, counter, val, counter);
};

// Mélange du monitoring direct et de la boucle en lecture
process = _ <: (*(mon_vol)), (looper : *(play) : *(loop_vol)) :> _;
```

### Compiler et tester

```bash
# Compiler (JACK + Qt ou CoreAudio + Qt sur macOS)
faust2jaqt looper.dsp    # ou faust2caqt looper.dsp

# Lancer l'application
./looper
```

**Résultat attendu** :

```text
L'application affiche :
- [1] Record : checkbox pour activer/désactiver l'enregistrement
- [2] Play : checkbox pour activer/désactiver la lecture
- [3] Clear : bouton pour effacer le buffer
- [4] Monitor : slider pour le volume de l'entrée directe
- [5] Loop Volume : slider pour le volume de la boucle

Test du looper :
1. Active "Record" → parle ou joue dans le micro (10 sec max)
2. Désactive "Record" et active "Play" → la boucle se répète
3. Active "Record" pendant que "Play" est actif → overdub
4. Appuie sur "Clear" → le buffer est vidé (silence)
```

### Vérification du diagramme

```bash
# Générer et ouvrir le diagramme SVG
faust2svg looper.dsp
open looper-svg/process.svg   # macOS (xdg-open sur Linux)
```

Le diagramme montre le signal d'entrée qui se divise en deux chemins : le monitoring direct et le looper (buffer `rwtable` avec contrôles). Les deux chemins se rejoignent en sortie.

---

## Navigation

← Fiche précédente : **[02 - Plugins audio VST/AU/LV2](02-plugins-audio-vst-au-lv2.md)**

→ Fiche suivante : **[04 - Web et mobile](04-web-mobile.md)**
