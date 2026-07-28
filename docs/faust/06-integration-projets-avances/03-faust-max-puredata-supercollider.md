---
tags:
  - Faust
  - Avancé
  - Pratique
description: "Faust et Max/PureData/SuperCollider - faustgen~, faust2puredata, faust2supercollider et workflow hybride"
estimated_time: "60 min"
fiche_number: 3
total_fiches: 5
cursus: "Phase 6 - Intégration et projets avancés"
---

# 03 - Faust et Max/PureData/SuperCollider

> **En bref** : À la fin de cette fiche, tu sauras intégrer du code Faust dans Max/MSP, PureData et SuperCollider, et adopter un workflow hybride combinant les forces de chaque environnement. Lecture estimée : 60 min.


## Prérequis

- [Fiche 01 - Système d'architectures Faust](../05-deploiement-architectures/01-systeme-architectures-faust.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras intégrer du code Faust dans Max/MSP, PureData et SuperCollider, et adopter un workflow hybride combinant les forces de chaque environnement.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Max/MSP ?

**Définition** : Max/MSP est un environnement de programmation visuelle pour la musique et le multimédia, développé par Cycling '74 (aujourd'hui Ableton). On crée des programmes en connectant des boîtes (objets) avec des câbles dans une interface graphique appelée "patcher".

**Le problème que Max/MSP résout** :

Sans Max/MSP, voici les problèmes rencontrés :

1. **Prototypage lent** : Pour tester une idée musicale interactive, tu dois écrire un programme complet en C++, compiler, exécuter, ajuster, recommencer.
2. **Pas de visualisation du flux** : Dans un programme textuel, le chemin du signal audio est caché dans le code.
3. **Barrière technique** : Les musiciens qui ne maîtrisent pas la programmation textuelle ne peuvent pas créer d'outils interactifs.

**Comment Max/MSP résout ces problèmes** :

| Problème | Solution apportée par Max/MSP |
| --- | --- |
| Prototypage lent | Connecter des boîtes graphiquement permet de tester une idée en quelques minutes |
| Pas de visualisation du flux | Les câbles montrent visuellement le chemin du signal |
| Barrière technique | L'interface graphique est accessible aux non-programmeurs |

**Analogie concrète** : Max/MSP fonctionne comme un panneau de câblage dans un studio d'enregistrement. Chaque appareil (synthétiseur, filtre, effet) est une boîte. Tu branches des câbles entre les appareils pour créer un chemin audio, sans souder de composant.

**Ce que Max/MSP n'est PAS** :

- Max/MSP n'est pas un séquenceur audio (DAW). C'est un environnement de programmation pour créer tes propres outils.
- Max/MSP n'est pas gratuit. C'est un logiciel commercial (contrairement à PureData).

---

### Qu'est-ce que faustgen~ ?

**Définition** : `faustgen~` est un objet Max qui intègre le compilateur Faust directement dans Max/MSP. Il permet d'écrire du code Faust dans un patcher Max, de le compiler en temps réel et de l'utiliser comme n'importe quel autre objet Max.

**Le problème que faustgen~ résout** :

Sans `faustgen~`, voici les problèmes rencontrés :

1. **Cycle édition-compilation lent** : Pour utiliser du code Faust dans Max, tu dois compiler un external avec `faust2max6`, fermer Max, copier le fichier, relancer Max et recharger le patch.
2. **Pas de prototypage interactif** : Impossible de modifier le code Faust et d'entendre le résultat immédiatement.

**Comment faustgen~ résout ces problèmes** :

| Problème | Solution apportée par faustgen~ |
| --- | --- |
| Cycle édition-compilation lent | Compilation JIT en quelques millisecondes, sans quitter Max |
| Pas de prototypage interactif | Hot-reloading : le son se met à jour dès que tu modifies le code |

**Analogie concrète** : Imagine un carnet de brouillon posé sur ta table de mixage. Tu écris une formule mathématique sur le carnet, et immédiatement un nouveau module apparaît sur la table de mixage avec les bons boutons et entrées/sorties. Tu ratures la formule, tu en écris une autre, et le module se transforme instantanément.

**Fonctionnement** :

```text
1. Tu crées un objet faustgen~ dans le patcher Max
2. Tu double-cliques → un éditeur de texte s'ouvre
3. Tu écris ton code Faust dans l'éditeur
4. Tu sauvegardes (Ctrl+S) → faustgen~ compile via LLVM JIT
5. Les inlets et outlets se mettent à jour automatiquement
```

**Communication Max ↔ Faust** :

| Mécanisme | Direction | Exemple |
| --- | --- | --- |
| Inlets/outlets audio | Max ↔ Faust | Le signal audio passe par les inlets et sort par les outlets |
| Messages | Max → Faust | Envoyer `freq 880` pour modifier un paramètre UI |

---

### Qu'est-ce que PureData (Pd) ?

**Définition** : PureData (Pd) est un environnement de programmation visuelle pour la musique et le multimédia, créé par Miller Puckette (créateur original de Max). Pd est open source, gratuit et multiplateforme.

**Le problème que PureData résout** :

Sans PureData, voici les problèmes rencontrés :

1. **Coût de Max/MSP** : La licence Max coûte plusieurs centaines d'euros.
2. **Pas de solution légère** : Max est volumineux. Pour un Raspberry Pi ou Bela, il faut un outil léger.
3. **Code propriétaire** : Avec Max, tu ne peux pas redistribuer librement tes créations.

**Comment PureData résout ces problèmes** :

| Problème | Solution apportée par PureData |
| --- | --- |
| Coût de Max/MSP | Pd est entièrement gratuit et open source (licence BSD) |
| Pas de solution légère | Pd fonctionne sur des machines modestes (Raspberry Pi, Bela) |
| Code propriétaire | Le code source est disponible, modifiable et redistribuable |

**Analogie concrète** : Si Max/MSP est une cuisine professionnelle entièrement équipée (puissante mais coûteuse), PureData est une cuisine communautaire ouverte à tous. Les ustensiles sont plus simples, mais tu peux y cuisiner les mêmes plats et inviter qui tu veux.

**Ce que PureData n'est PAS** :

- PureData n'est pas un clone de Max. Pd a sa propre identité et ses propres bibliothèques.
- PureData n'est pas moins puissant que Max pour le traitement audio. Les différences se trouvent dans l'interface graphique et l'écosystème.

**Intégration Faust : faust2puredata** :

`faust2puredata` compile un programme Faust en external PureData (`.pd_linux`, `.pd_darwin` ou `.dll`). Tu charges cet external dans un patch Pd comme n'importe quel objet natif. Faust génère automatiquement le code C et compile l'external.

---

### Qu'est-ce que SuperCollider ?

**Définition** : SuperCollider est un environnement de programmation audio composé de deux parties : un langage de programmation textuel (sclang) et un serveur de synthèse audio temps réel (scsynth).

**Le problème que SuperCollider résout** :

Sans SuperCollider, voici les problèmes rencontrés :

1. **Programmation visuelle limitée** : Dans Max et Pd, les programmes complexes deviennent des toiles d'araignée de câbles illisibles.
2. **Pas de composition algorithmique** : Créer de la musique générée par des algorithmes est fastidieux dans un environnement graphique.
3. **Pas de scripting** : Automatiser des tâches est impraticable boîte par boîte.

**Comment SuperCollider résout ces problèmes** :

| Problème | Solution apportée par SuperCollider |
| --- | --- |
| Programmation visuelle limitée | Le code textuel est plus lisible pour les programmes complexes |
| Pas de composition algorithmique | sclang offre des patterns, des routines et des structures de données riches |
| Pas de scripting | Tout est scriptable : boucles, conditions, fonctions, classes |

**Analogie concrète** : Si Max/Pd est un atelier où tu assembles des modules physiques avec des câbles, SuperCollider est un bureau d'architecte. Tu dessines des plans détaillés (code textuel) qui permettent de décrire des structures beaucoup plus complexes et de les reproduire à volonté.

**Architecture de SuperCollider** :

| Composant | Rôle |
| --- | --- |
| sclang | Langage de programmation. Envoie des commandes au serveur. |
| scsynth | Serveur de synthèse audio. Exécute le DSP en temps réel. |
| SynthDef | Définition d'un instrument (graphe de UGens). |
| UGen | Unité de génération/traitement de signal (oscillateur, filtre, etc.). |

**Intégration Faust : faust2supercollider** :

`faust2supercollider` compile un programme Faust en UGen SuperCollider. Le UGen compilé s'utilise dans des SynthDefs exactement comme les UGens natifs. Faust génère automatiquement le code C++ et compile le plugin.

---

### Qu'est-ce qu'un workflow hybride ?

**Définition** : Un workflow hybride consiste à utiliser Faust pour la partie DSP (traitement du signal) et Max, PureData ou SuperCollider pour la partie contrôle (séquençage, interface, interactions).

**Le problème que le workflow hybride résout** :

Sans workflow hybride, voici les problèmes rencontrés :

1. **Tout faire dans un seul outil** : Implémenter un filtre complexe dans Max/Pd nécessite des dizaines d'objets interconnectés, difficiles à maintenir.
2. **Tout faire en Faust** : Créer un séquenceur ou une interface interactive en Faust n'est pas naturel. Faust est conçu pour le DSP, pas pour le contrôle.

**Comment le workflow hybride résout ces problèmes** :

| Problème | Solution apportée par le workflow hybride |
| --- | --- |
| Tout faire dans un seul outil | Le DSP complexe est en Faust (compact, optimisé), le contrôle est en Max/Pd/SC (visuel, flexible) |
| Tout faire en Faust | L'interface et le séquençage sont dans l'environnement hôte, qui excelle dans ces tâches |

**Analogie concrète** : C'est comme la construction d'une maison. L'électricien (Faust) installe le câblage électrique car c'est son domaine d'expertise. Le décorateur (Max/Pd/SC) s'occupe de l'agencement des pièces. Le résultat est meilleur que si chacun faisait le travail de l'autre.

**Répartition des tâches** :

| Tâche | Outil recommandé | Raison |
| --- | --- | --- |
| Filtres, modélisation physique, effets | Faust | Syntaxe mathématique concise, code optimisé |
| Séquençage et patterns | Max/Pd/SC | Objets metro, counter, séquenceurs natifs |
| Interface graphique, capteurs | Max/Pd/SC | Widgets visuels, MIDI, OSC natifs |
| Composition algorithmique | SuperCollider | Patterns, routines, langage riche |

---

### Comparaison : Max vs PureData vs SuperCollider

| Critère | Max/MSP | PureData (Pd) | SuperCollider (SC) |
| --- | --- | --- | --- |
| **Licence** | Commerciale (payante) | Open source (BSD, gratuit) | Open source (GPL, gratuit) |
| **Paradigme** | Programmation visuelle | Programmation visuelle | Programmation textuelle |
| **Forces** | Écosystème riche, Max for Live | Léger, embarqué (Bela, RPi) | Composition algorithmique, patterns |
| **Faiblesses** | Coût, fermé, lourd | Interface basique | Courbe d'apprentissage |
| **Intégration Faust** | `faustgen~` (temps réel) | `faust2puredata` (external) | `faust2supercollider` (UGen) |
| **Hot-reloading** | Oui (natif) | Non (recompilation) | Non (recompilation) |

---

## Étapes Pratiques

### Étape 1 : Utiliser faustgen~ dans Max

**Prérequis** : Max/MSP 8+ avec le package `faustgen~` (File → Package Manager → "faustgen" → Install).

**Créer un patch** :

```text
1. Nouveau patcher (Cmd+N)
2. Crée un objet (touche "n"), tape "faustgen~"
3. Double-clique sur l'objet pour ouvrir l'éditeur
```

**Code Faust à écrire dans l'éditeur** :

```faust
import("stdfaust.lib");

freq = hslider("freq", 440, 20, 20000, 1);
vol = hslider("vol", 0.5, 0, 1, 0.01);

process = os.osc(freq) * vol;
```

**Connecter dans le patch** :

```text
[faustgen~]          ← L'objet avec le code Faust
     |
[dac~]               ← Sortie audio

Pour contrôler les paramètres, envoie des messages :

[freq 880(           ← Message pour changer la fréquence
     |
[faustgen~]
```

**Résultat attendu** :

```text
- Le son sinusoïdal sort par dac~
- En envoyant "freq 880", la fréquence change en temps réel
- En modifiant le code et en sauvegardant, le son se met à jour (hot-reloading)
```

---

### Étape 2 : Compiler et installer un external PureData

Crée un fichier `monfiltre.dsp` :

```faust
// monfiltre.dsp - Filtre passe-bas réglable
import("stdfaust.lib");

cutoff = hslider("cutoff", 1000, 20, 20000, 1);
resonance = hslider("resonance", 0.7, 0.1, 10, 0.01);

// Le signal entre par l'inlet de l'external Pd
process = fi.resonlp(cutoff, resonance, 1);
```

**Compiler et installer** :

```bash
# Compile en external PureData
faust2puredata monfiltre.dsp

# Installe (macOS)
cp -r monfiltre ~/Documents/Pd/externals/

# Installe (Linux)
cp -r monfiltre ~/.local/lib/pd/extra/
```

**Utiliser dans un patch Pd** :

```text
[osc~ 440]                ← Source audio
     |
[monfiltre~]              ← L'external Faust
     |
[dac~]                    ← Sortie audio

Pour contrôler les paramètres :

[cutoff 500(              ← Change la fréquence de coupure
     |
[monfiltre~]
```

**Résultat attendu** :

```text
- L'objet [monfiltre~] apparaît dans le patch sans erreur
- En envoyant "cutoff 500", le filtre coupe au-dessus de 500 Hz
- En augmentant la résonance, le filtre résonne autour de la coupure
```

---

### Étape 3 : Compiler et installer un UGen SuperCollider

Crée un fichier `faustverb.dsp` :

```faust
// faustverb.dsp - Réverbération stéréo
import("stdfaust.lib");

roomSize = hslider("roomSize", 0.5, 0, 1, 0.01);
wetDry = hslider("wetDry", 0.3, 0, 1, 0.01);

reverb = dm.zita_light;

// Dry/wet mix : signal original * (1-wet) + reverb * wet
process = _, _ <: (*(1-wetDry), *(1-wetDry)), (reverb : *(wetDry), *(wetDry))
        :> _, _;
```

**Compiler et installer** :

```bash
# Compile en UGen SuperCollider
faust2supercollider faustverb.dsp

# Installe (macOS)
cp -r FaustVerb ~/Library/Application\ Support/SuperCollider/Extensions/

# Installe (Linux)
cp -r FaustVerb ~/.local/share/SuperCollider/Extensions/
```

Relance SuperCollider (ou Menu Language → Recompile Class Library).

**Utiliser dans SuperCollider** :

```text
// Démarre le serveur
s.boot;

// Définition du synthétiseur
(
SynthDef(\reverbTest, {
    var source = BPF.ar(WhiteNoise.ar(0.3), 800, 0.1);
    var reverbed = FaustVerb.ar(source, source,
        roomSize: 0.7, wetDry: 0.4);
    Out.ar(0, reverbed);
}).add;
)

// Joue et modifie en temps réel
x = Synth(\reverbTest);
x.set(\roomSize, 0.9);
x.free;
```

**Résultat attendu** :

```text
- Le UGen FaustVerb est reconnu par SuperCollider
- Le synthétiseur joue un bruit filtré avec réverbération
- x.set(\roomSize, 0.9) change la taille de la pièce audiblement
```

---

### Étape 4 : Créer un patch hybride (contrôle Pd + DSP Faust)

**Synthétiseur Faust** (`synthfaust.dsp`) :

```faust
// synthfaust.dsp - Synthétiseur soustractif pour workflow hybride
import("stdfaust.lib");

freq = hslider("freq", 440, 20, 20000, 1);
gate = button("gate");
filterFreq = hslider("filterFreq", 2000, 20, 20000, 1);

// Enveloppe ADSR : attaque 10ms, déclin 100ms, sustain 70%, release 200ms
envelope = en.adsr(0.01, 0.1, 0.7, 0.2, gate);

// Dent de scie → filtre passe-bas → enveloppe
process = os.sawtooth(freq)
    : fi.resonlp(filterFreq, 2, 1)
    : *(envelope) : *(0.3);
```

```bash
faust2puredata synthfaust.dsp
cp -r synthfaust ~/Documents/Pd/externals/
```

**Patch PureData** :

```text
--- Séquenceur ---

[toggle]  →  [metro 250]  →  [send bang]

[receive bang]
     |
[i 0] → [+ 1] → [mod 8] → [send step]

[receive step]  →  [tabread notes]  →  [mtof]  →  [freq $1(  →  [synthfaust~]  →  [dac~]

--- Tableau de notes (gamme Do majeur) ---

[table notes 8]     Valeurs : 60, 62, 64, 65, 67, 69, 71, 72

--- Gate (note on/off) ---

[receive bang]  →  [gate 1(  →  [synthfaust~]    (note on)
[receive bang]  →  [delay 200]  →  [gate 0(  →  [synthfaust~]    (note off)

--- Filtre ---

[hslider]  →  [filterFreq $1(  →  [synthfaust~]
```

**Résultat attendu** :

```text
- Le séquenceur joue une gamme Do majeur en boucle (8 notes)
- Chaque note est déclenchée par gate=1, puis relâchée après 200ms
- L'enveloppe ADSR façonne chaque note
- Le slider filterFreq modifie le timbre en temps réel
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `faust2puredata fichier.dsp` | Compile en external PureData |
| `faust2supercollider fichier.dsp` | Compile en UGen SuperCollider |
| `faust2max6 fichier.dsp` | Compile en external Max/MSP (alternatif à faustgen~) |
| `faust2puredata -double fichier.dsp` | Compile en double précision (64 bits) |
| `faust2supercollider -noprefix fichier.dsp` | Compile sans préfixe dans le nom du UGen |

---

## Pièges Fréquents

### Piège 1 : faustgen~ non trouvé dans Max

**Problème** : L'objet `faustgen~` apparaît en pointillés dans Max.

**Solution** : Installe le package via File → Package Manager → "faustgen" → Install. Redémarre Max.

---

### Piège 2 : External Pd non trouvé

**Problème** : PureData affiche `monfiltre~: can't load library`.

**Solution** : Ajoute le dossier de l'external au chemin de recherche de Pd (Edit → Preferences → Path → New → ajoute le dossier). Redémarre Pd.

---

### Piège 3 : UGen SuperCollider non reconnu

**Problème** : SuperCollider affiche `ERROR: Class not defined`.

**Solution** : Recompile la bibliothèque de classes (Menu Language → Recompile Class Library ou Ctrl+Shift+L). Redémarre le serveur avec `s.reboot;`.

---

### Piège 4 : Nombre d'inlets/outlets incorrect avec faustgen~

**Problème** : Le nombre d'inlets/outlets ne correspond pas au code Faust.

**Solution** : Vérifie que `process` a le bon nombre d'entrées et de sorties.

```faust
// 0 entrée, 1 sortie → 0 inlet audio, 1 outlet audio
process = os.osc(440);

// 1 entrée, 1 sortie → 1 inlet audio, 1 outlet audio
process = fi.resonlp(1000, 1, 1);
```

---

### Piège 5 : Les paramètres ne changent pas dans le workflow hybride

**Problème** : Les messages envoyés depuis Pd ne modifient pas les paramètres Faust.

**Solution** : Le nom du paramètre dans le message doit correspondre exactement au label Faust (sensible à la casse).

```text
Code Faust :  freq = hslider("freq", 440, 20, 20000, 1);

[freq 880(     ← Correct : correspond au label "freq"
[Freq 880(     ← Incorrect : majuscule
[frequency 880( ← Incorrect : nom différent
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre Max/MSP, PureData et SuperCollider
- [ ] J'ai compris le rôle de `faustgen~` (compilation en temps réel dans Max)
- [ ] J'ai compris le rôle de `faust2puredata` (compilation en external Pd)
- [ ] J'ai compris le rôle de `faust2supercollider` (compilation en UGen SC)
- [ ] J'ai compris le concept de workflow hybride (DSP en Faust, contrôle dans l'hôte)
- [ ] J'ai réussi à compiler un external PureData avec `faust2puredata`
- [ ] J'ai réussi à compiler un UGen SuperCollider avec `faust2supercollider`
- [ ] J'ai créé un patch hybride combinant séquençage Pd et DSP Faust
- [ ] Je sais que les noms de paramètres doivent correspondre exactement entre Faust et l'hôte

---

## Exercice Pratique

**Énoncé** : Crée un instrument de modélisation physique basé sur l'algorithme Karplus-Strong en Faust, compile-le pour PureData, et crée un patch Pd qui le contrôle avec un séquenceur simple.

L'algorithme Karplus-Strong simule une corde pincée :

1. Un bruit bref (excitation) est injecté dans une ligne de retard
2. La sortie est filtrée (passe-bas) et renvoyée à l'entrée (feedback)
3. La fréquence = taux d'échantillonnage / longueur du delay
4. Le filtrage progressif simule l'amortissement d'une corde

**Partie 1 - Code Faust** : Crée `karplus.dsp` avec les paramètres `freq` (100-1000 Hz), `gate` (button), `damping` (0-1).

**Partie 2 - Patch PureData** : Séquenceur 8 pas, tempo réglable (100-500 ms), contrôle du damping, gamme pentatonique (60, 64, 67, 69, 72, 76, 79, 84).

**Indications** :

- Ligne de retard : `de.fdelay(4096, ma.SR / freq)`
- Excitation : `no.noise * gate`
- Filtre moyenneur : `_ <: _, mem : + : *(0.5) : *(1 - damping * 0.5)`
- Feedback : opérateur `~` (récursion)

**Résultat attendu** :

```text
- Chaque pas déclenche une note de corde pincée (son guitare/clavecin)
- La gamme pentatonique crée une mélodie agréable
- damping faible = notes longues et brillantes
- damping élevé = notes courtes et sourdes
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 - Code Faust (`karplus.dsp`)** :

```faust
// karplus.dsp - Karplus-Strong : simulation de corde pincée
import("stdfaust.lib");

// Paramètres contrôlés depuis PureData
freq = hslider("freq", 440, 100, 1000, 1);
gate = button("gate");
damping = hslider("damping", 0.5, 0, 1, 0.01);

// Longueur du delay en échantillons (SR / fréquence)
delayLength = ma.SR / freq;

// Excitation : bruit blanc déclenché par le gate
excitation = no.noise * gate;

// Filtre moyenneur : moyenne entre échantillon courant et précédent
// Élimine progressivement les hautes fréquences à chaque tour de boucle
averager = _ <: _, mem : + : *(0.5) : *(1 - damping * 0.5);

// Karplus-Strong : excitation + feedback (delay → filtre → retour)
// L'opérateur ~ crée la boucle de rétroaction
karplusStrong = (+ (excitation)) ~ (de.fdelay(4096, delayLength) : averager);

process = karplusStrong : *(0.8);
```

```bash
faust2puredata karplus.dsp
cp -r karplus ~/Documents/Pd/externals/
```

**Partie 2 - Patch PureData** :

```text
--- Séquenceur ---

[toggle]  →  [metro 250]  →  [send bang]

[hslider 100 500 250 1]  →  inlet droit de [metro]   (tempo réglable)

[receive bang]  →  [i 0] → [+ 1] → [mod 8] → [send step]

[receive step]  →  [tabread notes]  →  [mtof]  →  [freq $1(  →  [karplus~]  →  [dac~]

--- Tableau de notes (gamme pentatonique) ---

[table notes 8]
[0 60, 1 64, 2 67, 3 69, 4 72, 5 76, 6 79, 7 84(  →  [tabwrite notes]

--- Gate ---

[receive bang]  →  [gate 1(  →  [karplus~]             (note on)
[receive bang]  →  [delay 50]  →  [gate 0(  →  [karplus~]   (note off après 50ms)

--- Damping ---

[hslider 0 1 0.5 0.01]  →  [damping $1(  →  [karplus~]
```

**Explications** :

1. **Boucle de rétroaction** : Le bruit est injecté une seule fois (pendant le gate de 50 ms), puis circule dans le delay en boucle. Le filtre moyenneur supprime les hautes fréquences à chaque tour, simulant l'amortissement d'une corde.

2. **Fréquence et delay** : `freq = 440` donne un delay de `44100 / 440 = 100` échantillons, soit une période de 2.27 ms = 440 Hz.

3. **Gamme pentatonique** : Les notes 60, 64, 67, 69, 72, 76, 79, 84 forment une gamme pentatonique majeure de Do. Cette gamme sonne agréablement dans n'importe quel ordre.

4. **Séparation des responsabilités** : Faust fait le DSP (synthèse Karplus-Strong), Pd fait le contrôle (séquençage, conversion MIDI, interface).

---

## Navigation

← Fiche précédente : **[02 - Faust et JUCE](02-faust-juce.md)**

→ Fiche suivante : **[04 - MIDI, OSC et capteurs](04-midi-osc-capteurs.md)**
