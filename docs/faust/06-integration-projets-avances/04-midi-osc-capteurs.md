---
tags:
  - Faust
  - Avancé
  - Pratique
description: "MIDI, OSC et capteurs - contrôle MIDI, protocole OSC, capteurs mobiles et SmartFaust"
estimated_time: "95 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 6 - Intégration et projets avancés"
---

# 04 - MIDI, OSC et capteurs

> **En bref** : À la fin de cette fiche, tu sauras contrôler un programme Faust via MIDI et OSC, implémenter la polyphonie MIDI et utiliser les capteurs de mouvement comme contrôleurs. Lecture estimée : 95 min.


## Prérequis

- [Fiche 03 - Interfaces utilisateur (UI)](../03-langage-faust-fondamentaux/03-interfaces-utilisateur-ui.md)
- [Fiche 01 - Oscillateurs et synthèse](../04-dsp-applique/01-oscillateurs-synthese.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras contrôler un programme Faust via MIDI et OSC, implémenter la polyphonie MIDI et utiliser les capteurs de mouvement comme contrôleurs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le contrôle MIDI dans Faust ?

**Définition** : Le contrôle MIDI dans Faust est un mécanisme qui permet d'associer des messages MIDI (notes, contrôleurs continus, pitch bend) à des paramètres de l'interface utilisateur via des métadonnées entre crochets dans le label des widgets.

**Le problème que le contrôle MIDI résout** :

Sans contrôle MIDI, voici les problèmes rencontrés :

1. **Pas de clavier musical** : Pour jouer des notes, tu dois déplacer manuellement un slider de fréquence dans l'interface graphique, ce qui est lent et imprécis.
2. **Pas de contrôle physique** : Tu ne peux pas utiliser un potentiomètre ou un fader physique pour modifier un paramètre en temps réel. Tout passe par la souris.
3. **Pas de communication avec les DAW** : Les logiciels de musique (Ableton, Reaper, Ardour) communiquent avec les instruments via MIDI. Sans support MIDI, ton synthétiseur Faust est isolé.

**Comment le contrôle MIDI résout ces problèmes** :

| Problème | Solution apportée par le contrôle MIDI |
| --- | --- |
| Pas de clavier musical | `[midi:keyon]` et `[midi:keyoff]` reçoivent les notes jouées sur un clavier |
| Pas de contrôle physique | `[midi:ctrl N]` associe un slider à un contrôleur continu (potentiomètre, fader) |
| Pas de communication avec les DAW | Le programme Faust répond aux messages MIDI envoyés par n'importe quel logiciel |

**Analogie concrète** : Imagine un piano numérique connecté à un module de sons. Le piano envoie des messages (quelle touche est enfoncée, avec quelle force) et le module de sons les reçoit pour produire le son correspondant. Les métadonnées MIDI dans Faust fonctionnent comme le câble MIDI entre le piano et le module : elles définissent quels messages contrôlent quels paramètres.

**Ce que le contrôle MIDI Faust n'est PAS** :

- Le contrôle MIDI n'est pas un protocole audio. MIDI transporte des messages de contrôle (quelle note, quel volume, quel paramètre), pas du son. Le son est généré par le programme Faust lui-même.
- Le contrôle MIDI n'est pas automatique. Tu dois explicitement ajouter les métadonnées `[midi:...]` sur chaque widget que tu veux contrôler.

**Les métadonnées MIDI disponibles** :

| Métadonnée | Message MIDI reçu | Plage de valeurs | Exemple d'utilisation |
| --- | --- | --- | --- |
| `[midi:ctrl N]` | Control Change numéro N | 0-127 (mappé sur min-max du slider) | Volume, modulation, filtre |
| `[midi:keyon M]` | Note On sur la note M | 0-127 (vélocité) | Déclenchement de note |
| `[midi:keyoff M]` | Note Off sur la note M | 0-127 (vélocité de relâchement) | Fin de note |
| `[midi:key M]` | Note On/Off sur la note M | 0 ou 1 | Gate on/off |
| `[midi:keypress M]` | Aftertouch polyphonique note M | 0-127 | Pression par note |
| `[midi:pitchwheel]` | Pitch Bend | 0 à 16383 (centre 8192, mappé sur min-max du slider) | Variation de hauteur |
| `[midi:chanpress]` | Channel Aftertouch | 0-127 | Pression globale du clavier |
| `[midi:pgm]` | Program Change | 0-127 | Changement de preset |

**Exemple de base** :

```faust
import("stdfaust.lib");

// Le slider de fréquence est contrôlé par le MIDI CC 74
// Quand on tourne le potentiomètre CC 74 sur le contrôleur MIDI,
// la valeur est mappée de 0-127 vers la plage 200-2000 Hz
freq = hslider("Fréquence [midi:ctrl 74]", 440, 200, 2000, 1);

// Le slider de volume est contrôlé par le MIDI CC 7 (volume standard)
vol = hslider("Volume [midi:ctrl 7]", 0.5, 0, 1, 0.01);

process = os.osc(freq) * vol;
```

---

### Qu'est-ce que la polyphonie MIDI ?

**Définition** : La polyphonie MIDI dans Faust est un mécanisme qui permet de jouer plusieurs notes simultanément. Le programme Faust définit le traitement d'une seule voix, et le compilateur crée automatiquement plusieurs instances (voix) qui sont déclenchées indépendamment par les notes MIDI.

**Le problème que la polyphonie MIDI résout** :

Sans polyphonie, voici les problèmes rencontrés :

1. **Une seule note à la fois** : Un synthétiseur monophonique ne peut jouer qu'une note. Impossible de jouer un accord (Do-Mi-Sol) sur un clavier.
2. **Gestion manuelle des voix** : Programmer manuellement 8 oscillateurs indépendants avec allocation de voix est complexe et source d'erreurs.
3. **Code dupliqué** : Sans polyphonie automatique, tu dois copier le même code de synthèse pour chaque voix.

**Comment la polyphonie MIDI résout ces problèmes** :

| Problème | Solution apportée par la polyphonie |
| --- | --- |
| Une seule note à la fois | Le compilateur crée N voix indépendantes, chaque note reçoit sa propre voix |
| Gestion manuelle des voix | L'allocation de voix est automatique : une note entrante utilise une voix libre |
| Code dupliqué | Tu écris le code d'une seule voix, Faust la duplique automatiquement |

**Analogie concrète** : Imagine un orchestre. Le compositeur écrit la partition pour un seul violon. Le chef d'orchestre (le compilateur Faust) distribue automatiquement cette partition à 8 violonistes (8 voix). Quand une note arrive, le chef désigne un violoniste libre pour la jouer. Quand le violoniste termine sa note, il redevient disponible pour la suivante.

**La convention freq/gain/gate** :

Pour que la polyphonie fonctionne, le programme Faust doit utiliser trois paramètres avec des noms précis :

| Paramètre | Rôle | Valeur reçue du MIDI |
| --- | --- | --- |
| `freq` | Fréquence de la note en Hz | Conversion automatique du numéro MIDI (ex: note 69 = 440 Hz) |
| `gain` | Vélocité normalisée (force de frappe) | Vélocité MIDI (0-127) divisée par 127, résultat entre 0 et 1 |
| `gate` | État de la note (enfoncée ou relâchée) | 1 quand la touche est enfoncée, 0 quand elle est relâchée |

**Déclaration de la polyphonie** :

```faust
// Active le MIDI et définit 8 voix de polyphonie
declare options "[midi:on][nvoices:8]";
```

- `[midi:on]` : active la réception MIDI pour ce programme
- `[nvoices:8]` : le compilateur crée 8 instances indépendantes du programme

**Ce que la polyphonie MIDI n'est PAS** :

- La polyphonie n'est pas un mixeur. Faust additionne automatiquement les signaux de toutes les voix actives. Tu n'as pas à gérer le mélange.
- La polyphonie ne gère pas les effets partagés. Si tu veux une reverb appliquée à toutes les voix, tu dois utiliser le mécanisme `effect` (voir concept suivant).

**Exemple de synthétiseur polyphonique minimal** :

```faust
import("stdfaust.lib");

// Déclaration : MIDI activé, 8 voix de polyphonie
declare options "[midi:on][nvoices:8]";

// freq reçoit automatiquement la fréquence de la note MIDI jouée
freq = hslider("freq", 440, 20, 20000, 1);

// gain reçoit automatiquement la vélocité (0 à 1) de la note jouée
gain = hslider("gain", 0.5, 0, 1, 0.01);

// gate reçoit automatiquement 1 quand la touche est enfoncée, 0 quand relâchée
gate = button("gate");

// Une voix : oscillateur sinusoïdal * vélocité * état de la note
process = os.osc(freq) * gain * gate;
```

---

### Qu'est-ce que l'effet post-polyphonie ?

**Définition** : L'effet post-polyphonie (`effect`) est un bloc DSP appliqué une seule fois après le mélange de toutes les voix polyphoniques. Il permet d'ajouter un traitement partagé (reverb, chorus, delay) sans le dupliquer dans chaque voix.

**Le problème que l'effet post-polyphonie résout** :

Sans `effect`, voici les problèmes rencontrés :

1. **Reverb dupliquée** : Si tu places une reverb dans `process`, elle est dupliquée dans chaque voix. Avec 8 voix, tu as 8 reverbs qui consomment 8 fois plus de CPU.
2. **Résultat sonore incorrect** : 8 reverbs indépendantes mélangées ne sonnent pas comme une seule reverb appliquée au mélange. Le résultat est brouillon et peu naturel.

**Comment l'effet post-polyphonie résout ces problèmes** :

| Problème | Solution apportée par `effect` |
| --- | --- |
| Reverb dupliquée | `effect` est instancié une seule fois, après le mélange des voix |
| Résultat sonore incorrect | Toutes les voix passent par la même reverb, comme dans un vrai espace acoustique |

**Analogie concrète** : Dans une salle de concert, il y a un seul espace acoustique (la réverbération de la salle). Chaque musicien joue dans cette même salle. On n'a pas besoin d'une salle séparée par musicien. Le mot-clé `effect` fonctionne pareil : c'est la salle de concert partagée par toutes les voix.

**Syntaxe** :

```faust
import("stdfaust.lib");
declare options "[midi:on][nvoices:8]";

freq = hslider("freq", 440, 20, 20000, 1);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// process définit UNE voix (dupliquée 8 fois)
process = os.osc(freq) * gain * gate;

// effect est appliqué UNE SEULE FOIS après le mélange de toutes les voix
// dm.zita_light : reverb de qualité studio de la bibliothèque Faust
effect = dm.zita_light;
```

---

### Que sont les groupes MIDI (conventions Général MIDI) ?

**Définition** : Les groupes MIDI sont des numéros de Control Change (CC) standardisés par la norme Général MIDI. Chaque numéro correspond à un paramètre conventionnel que tous les synthétiseurs et contrôleurs reconnaissent.

**Le problème que les groupes MIDI résolvent** :

Sans conventions, voici les problèmes rencontrés :

1. **Numéros arbitraires** : Chaque fabricant utilise des numéros de CC différents pour le volume ou la modulation. Un contrôleur qui envoie CC 7 ne pilote pas forcément le volume sur tous les synthétiseurs.
2. **Pas d'interopérabilité** : Brancher un nouveau contrôleur MIDI nécessite de reconfigurer tous les mappings à chaque fois.

**Comment les conventions Général MIDI résolvent ces problèmes** :

| Problème | Solution apportée par Général MIDI |
| --- | --- |
| Numéros arbitraires | Chaque CC a un rôle standardisé (CC 7 = volume partout) |
| Pas d'interopérabilité | Un contrôleur Général MIDI fonctionne immédiatement avec tout synthétiseur conforme |

**Les CC les plus courants** :

| CC | Nom standard | Utilisation typique |
| --- | --- | --- |
| 1 | Modulation Wheel | Vibrato, intensité de modulation |
| 7 | Channel Volume | Volume principal du canal |
| 10 | Pan | Panoramique gauche/droite |
| 11 | Expression | Volume dynamique (pour le jeu expressif) |
| 64 | Sustain Pedal | Pédale de sustain (0-63 = off, 64-127 = on) |
| 71 | Resonance (Timbre) | Résonance du filtre |
| 74 | Brightness (Cutoff) | Fréquence de coupure du filtre |

**Exemple d'utilisation des conventions Général MIDI** :

```faust
import("stdfaust.lib");

// CC 7 pour le volume : tout contrôleur MIDI envoie du volume sur CC 7
vol = hslider("Volume [midi:ctrl 7]", 0.8, 0, 1, 0.01);

// CC 1 pour la modulation : la molette de modulation du clavier
mod = hslider("Modulation [midi:ctrl 1]", 0, 0, 1, 0.01);

// CC 74 pour le filtre : convention General MIDI pour le cutoff
cutoff = hslider("Cutoff [midi:ctrl 74]", 1000, 100, 10000, 1);

// Oscillateur avec vibrato contrôlé par modulation
// La fréquence oscille autour de 440 Hz avec une amplitude proportionnelle à mod
vibrato = os.osc(5) * mod * 10;
process = os.osc(440 + vibrato) * vol;
```

---

### Qu'est-ce que le protocole OSC ?

**Définition** : OSC (Open Sound Control) est un protocole réseau pour la communication entre logiciels et matériels musicaux. Il transmet des messages contenant des adresses (chemins) et des valeurs typées (float, int, string) via UDP sur un réseau local.

**Le problème que l'OSC résout** :

Sans OSC, voici les problèmes rencontrés :

1. **Limites du MIDI** : MIDI ne transporte que des entiers entre 0 et 127. Pour un paramètre qui nécessite des valeurs décimales précises (fréquence à 440.5 Hz), MIDI manque de résolution.
2. **Pas de communication réseau** : MIDI utilise un câble physique (ou USB). Impossible de contrôler un synthétiseur depuis un autre ordinateur sur le réseau sans matériel supplémentaire.
3. **Noms cryptiques** : En MIDI, le CC 74 ne dit rien sur ce qu'il contrôle. Il faut connaître la convention ou lire la documentation.

**Comment l'OSC résout ces problèmes** :

| Problème | Solution apportée par l'OSC |
| --- | --- |
| Limites du MIDI (0-127) | OSC transporte des floats 32 bits (ex: 440.5) et des valeurs de précision arbitraire |
| Pas de communication réseau | OSC utilise UDP/IP : contrôle depuis n'importe quel appareil sur le réseau |
| Noms cryptiques | OSC utilise des adresses lisibles : `/synth/freq` au lieu de "CC 74" |

**Analogie concrète** : Imagine que MIDI est un système de communication par talkie-walkie avec des codes numériques ("code 7, valeur 95"). OSC est plutôt un système de messagerie texte sur réseau Wi-Fi : tu envoies "/salon/lumière/intensité 0.75" et le destinataire comprend immédiatement ce qui est contrôlé.

**Comparaison MIDI vs OSC** :

| MIDI | OSC |
| --- | --- |
| Valeurs entières 0-127 | Valeurs float, int, string, blob |
| Câble physique ou USB | Réseau UDP/IP (Wi-Fi, Ethernet) |
| 16 canaux maximum | Pas de limite de canaux |
| Adresses numériques (CC 74) | Adresses textuelles (`/synth/freq`) |
| Latence ~1 ms | Latence ~1-5 ms (réseau local) |
| Standard universel depuis 1983 | Standard ouvert depuis 2002 |

**Ce que l'OSC n'est PAS** :

- L'OSC n'est pas un remplacement de MIDI. MIDI reste le standard pour les claviers et les DAW. OSC est complémentaire, utilisé pour le contrôle réseau et les paramètres à haute résolution.
- L'OSC n'est pas un protocole audio. Comme MIDI, il transporte des messages de contrôle, pas du son.

---

### Qu'est-ce que l'architecture OSC dans Faust ?

**Définition** : L'architecture OSC dans Faust est le mécanisme qui associe automatiquement chaque widget de l'interface utilisateur à une adresse OSC. Quand tu compiles un programme Faust avec l'option `-osc`, chaque slider, bouton et bargraph devient contrôlable via un message OSC dont l'adresse correspond au chemin du widget dans l'interface.

**Le problème que l'architecture OSC résout** :

Sans architecture OSC intégrée, voici les problèmes rencontrés :

1. **Mapping manuel** : Tu dois écrire du code réseau pour recevoir les messages OSC et les connecter à chaque paramètre.
2. **Adresses arbitraires** : Sans convention, chaque développeur invente ses propres adresses OSC, rendant l'interopérabilité impossible.

**Comment l'architecture OSC résout ces problèmes** :

| Problème | Solution apportée par l'architecture OSC |
| --- | --- |
| Mapping manuel | Le mapping est automatique : chaque widget a son adresse OSC |
| Adresses arbitraires | Les adresses suivent la hiérarchie des groupes UI : `/groupe/sous-groupe/paramètre` |

**Correspondance widgets vers adresses OSC** :

```faust
// Ce programme Faust...
process = vgroup("Synthé",
    hgroup("Oscillateur",
        os.osc(hslider("freq", 440, 20, 20000, 1))
        * hslider("gain", 0.5, 0, 1, 0.01)
    )
);
```

```text
...génère automatiquement ces adresses OSC :
/Synthé/Oscillateur/freq    (float, 20 à 20000)
/Synthé/Oscillateur/gain    (float, 0 à 1)
```

**Ports OSC par défaut** :

| Port | Rôle |
| --- | --- |
| 5510 | Port d'entrée (le programme écoute les messages OSC entrants) |
| 5511 | Port de sortie (le programme envoie les valeurs des bargraphs) |
| 5512 | Port de notification (le programme annonce son existence sur le réseau) |

---

### Que sont les capteurs mobiles dans Faust ?

**Définition** : Les capteurs mobiles sont des composants matériels intégrés dans les smartphones et tablettes (accéléromètre, gyroscope, boussole) dont les données peuvent être mappées sur des paramètres Faust via des métadonnées `[acc:...]` et `[gyr:...]`.

**Le problème que les capteurs mobiles résolvent** :

Sans capteurs, voici les problèmes rencontrés :

1. **Contrôle limité à l'écran** : Sur un smartphone, le seul mode d'interaction est de toucher l'écran, ce qui occupe les mains et limite l'expressivité.
2. **Pas de geste physique** : Impossible d'utiliser l'inclinaison ou la rotation du téléphone pour moduler un paramètre sonore.

**Comment les capteurs mobiles résolvent ces problèmes** :

| Problème | Solution apportée par les capteurs |
| --- | --- |
| Contrôle limité à l'écran | L'accéléromètre capte l'inclinaison sans toucher l'écran |
| Pas de geste physique | Le gyroscope et la boussole captent la rotation et l'orientation |

**Analogie concrète** : Imagine un instrument de musique que tu contrôles en le tenant et en le bougeant dans l'espace, comme un theremin. Plus tu inclines le téléphone vers la droite, plus la note est aiguë. Plus tu le penches en avant, plus le volume augmente. Les capteurs transforment les mouvements physiques en paramètres musicaux.

**Les trois types de capteurs** :

| Capteur | Mesure | Métadonnée Faust | Axes |
| --- | --- | --- | --- |
| Accéléromètre | Accélération linéaire (inclinaison) | `[acc:axe courbe amin amid amax]` | X (gauche-droite), Y (avant-arrière), Z (haut-bas) |
| Gyroscope | Vitesse de rotation | `[gyr:axe courbe gmin gmid gmax]` | X (tangage), Y (roulis), Z (lacet) |
| Boussole | Orientation magnétique | Pas de métadonnée dédiée (utilise OSC) | - |

**Paramètres de la métadonnée `[acc:...]`** :

| Paramètre | Signification |
| --- | --- |
| `axe` | Axe du capteur : 0 = X, 1 = Y, 2 = Z |
| `courbe` | Type de mapping : 0 = linéaire croissant, 1 = linéaire décroissant, 2 = en V (centré) |
| `amin` | Valeur minimale de l'accéléromètre |
| `amid` | Valeur centrale de l'accéléromètre |
| `amax` | Valeur maximale de l'accéléromètre |

**Exemple** :

```faust
import("stdfaust.lib");

// L'inclinaison gauche-droite (axe X) contrôle la fréquence
// Courbe 0 = mapping linéaire croissant
// L'accéléromètre va de -10 (incliné à gauche) à 10 (incliné à droite)
// Le centre est 0 (téléphone horizontal)
freq = hslider("Fréquence [acc:0 0 -10 0 10]", 440, 200, 2000, 1);

// L'inclinaison avant-arrière (axe Y) contrôle le volume
// Courbe 0 = mapping linéaire croissant
vol = hslider("Volume [acc:1 0 -10 0 10]", 0.5, 0, 1, 0.01);

process = os.osc(freq) * vol;
```

---

### Qu'est-ce que SmartFaust ?

**Définition** : SmartFaust est un ensemble d'applications Faust pour smartphones qui utilisent les capteurs embarqués (accéléromètre, gyroscope, écran tactile) comme contrôleurs d'instruments de musique. L'outil `faust2smartkeyboard` génère des applications mobiles avec un clavier tactile et le support des capteurs.

**Le problème que SmartFaust résout** :

Sans SmartFaust, voici les problèmes rencontrés :

1. **Pas d'instrument mobile** : Créer une application musicale pour smartphone nécessite de programmer en Swift (iOS) ou Kotlin (Android), en plus du code DSP.
2. **Intégration capteurs complexe** : Lire les données de l'accéléromètre et les connecter au code audio demande du code natif spécifique à chaque plateforme.

**Comment SmartFaust résout ces problèmes** :

| Problème | Solution apportée par SmartFaust |
| --- | --- |
| Pas d'instrument mobile | `faust2smartkeyboard` génère une application mobile complète depuis le code Faust |
| Intégration capteurs complexe | Les métadonnées `[acc:...]` et `[gyr:...]` connectent directement les capteurs aux paramètres |

**Analogie concrète** : SmartFaust transforme un smartphone en instrument de musique, comme un luthier qui transforme du bois en guitare. Tu écris la "recette sonore" en Faust, et `faust2smartkeyboard` construit l'instrument final que tu peux installer sur ton téléphone et jouer en le touchant et en le bougeant.

---

### Comment combiner MIDI et OSC ?

**Définition** : La combinaison MIDI + OSC consiste à utiliser MIDI pour les événements discrets (notes, velocity, sustain pedal) et OSC pour les paramètres continus à haute résolution (filtres, effets, spatialisation). Les deux protocoles fonctionnent simultanément dans un programme Faust.

**Le problème que la combinaison résout** :

Sans combinaison, voici les problèmes rencontrés :

1. **MIDI seul est limité** : Les CC MIDI ont une résolution de 7 bits (128 valeurs). Pour un filtre qui balaye de 20 Hz à 20000 Hz, 128 paliers créent des sauts audibles.
2. **OSC seul manque de notes** : OSC n'a pas de convention universelle pour les notes musicales. Chaque logiciel utilise ses propres adresses.

**Comment la combinaison résout ces problèmes** :

| Problème | Solution apportée par la combinaison |
| --- | --- |
| MIDI seul est limité en résolution | OSC prend en charge les paramètres continus avec des floats 32 bits |
| OSC seul manque de convention pour les notes | MIDI gère les notes avec la convention universelle note/velocity/gate |

**Analogie concrète** : Imagine un pianiste qui joue sur un clavier MIDI (les notes) pendant qu'un ingénieur du son ajuste les effets depuis une tablette via OSC (paramètres continus). Chacun utilise l'outil le mieux adapté à sa tâche.

---

### Quelle est la latence des différents protocoles ?

**Définition** : La latence est le temps écoulé entre l'envoi d'un message de contrôle et sa prise en compte par le programme audio. Chaque protocole a sa propre latence caractéristique, qui s'ajoute à la latence du buffer audio.

**Les latences typiques** :

| Protocole | Latence typique | Facteurs influençant la latence |
| --- | --- | --- |
| MIDI USB | ~1 ms | Longueur du câble, charge USB |
| MIDI DIN (câble 5 broches) | ~1-2 ms | Débit fixe de 31.25 kbaud |
| OSC sur réseau local (Ethernet) | ~1-3 ms | Charge réseau, taille des paquets |
| OSC sur Wi-Fi | ~3-10 ms | Qualité du signal Wi-Fi, congestion |
| Bluetooth MIDI | ~10-20 ms | Version Bluetooth, distance |
| OSC sur internet | ~20-200 ms | Distance géographique, routage réseau |

**Impact sur le jeu musical** :

| Latence totale | Perception |
| --- | --- |
| < 5 ms | Imperceptible, jeu confortable |
| 5-10 ms | Perceptible par les musiciens expérimentés |
| 10-20 ms | Gênant pour le jeu en temps réel |
| > 20 ms | Délai audible, jeu difficile |

**Ce que la latence n'est PAS** :

- La latence du protocole n'est pas la latence totale. La latence totale inclut aussi le buffer audio (souvent 5-20 ms). Un MIDI à 1 ms avec un buffer audio de 10 ms donne une latence totale de 11 ms.

---

## Étapes Pratiques

### Étape 1 : Ajouter le contrôle MIDI CC à un synthétiseur existant

On part d'un oscillateur simple et on ajoute des métadonnées MIDI pour que ses paramètres soient contrôlables par un contrôleur MIDI externe.

Crée un fichier `midi-cc.dsp` avec ce contenu :

```faust
// midi-cc.dsp - Contrôle MIDI CC d'un oscillateur
import("stdfaust.lib");

// Active le support MIDI
declare options "[midi:on]";

// CC 74 (Brightness) contrôle la fréquence du filtre
// Le contrôleur MIDI mappe automatiquement 0-127 vers 200-5000
freq = hslider("Fréquence [midi:ctrl 74] [unit:Hz] [scale:log]",
    440, 200, 5000, 1);

// CC 7 (Channel Volume) contrôle le volume
vol = hslider("Volume [midi:ctrl 7]", 0.5, 0, 1, 0.01);

// CC 1 (Modulation Wheel) contrôle l'intensité du vibrato
// La molette de modulation du clavier MIDI est associée au CC 1
modAmount = hslider("Modulation [midi:ctrl 1]", 0, 0, 50, 0.1);

// Vibrato : oscillation lente (5 Hz) dont l'amplitude est contrôlée par CC 1
vibrato = os.osc(5) * modAmount;

// Le signal final : oscillateur sinusoïdal avec vibrato, multiplié par le volume
process = os.osc(freq + vibrato) * vol;
```

Compile et lance avec le support MIDI :

```bash
# -midi active le support MIDI dans l'architecture JACK
faust2jaqt -midi midi-cc.dsp
./midi-cc
```

**Résultat attendu** :

```text
Une fenêtre s'ouvre avec trois sliders :
- "Fréquence" (440 Hz)
- "Volume" (0.5)
- "Modulation" (0)

Si un contrôleur MIDI est connecté :
- Tourner le CC 74 déplace le slider "Fréquence"
- Tourner le CC 7 déplace le slider "Volume"
- Tourner la molette de modulation (CC 1) ajoute un vibrato

Les sliders peuvent aussi être déplacés à la souris.
Les deux modes de contrôle (MIDI et souris) fonctionnent simultanément.
```

---

### Étape 2 : Implémenter un synthétiseur polyphonique MIDI complet

On crée un synthétiseur capable de jouer 8 notes simultanément avec un clavier MIDI. Le code définit une seule voix ; Faust la duplique automatiquement.

Crée un fichier `poly-synth.dsp` :

```faust
// poly-synth.dsp - Synthétiseur polyphonique 8 voix
import("stdfaust.lib");

// Active le MIDI et définit 8 voix de polyphonie
declare options "[midi:on][nvoices:8]";

// ─────────────────────────────────────────────────────
// Paramètres automatiquement gérés par la polyphonie
// ─────────────────────────────────────────────────────

// freq reçoit la fréquence de la note MIDI jouée (en Hz)
// Note MIDI 60 (Do central) → freq = 261.63 Hz
// Note MIDI 69 (La 440) → freq = 440 Hz
freq = hslider("freq", 440, 20, 20000, 1);

// gain reçoit la vélocité normalisée (0 à 1)
// Vélocité MIDI 127 (frappe forte) → gain = 1
// Vélocité MIDI 64 (frappe moyenne) → gain ≈ 0.5
gain = hslider("gain", 0.5, 0, 1, 0.01);

// gate vaut 1 quand la touche est enfoncée, 0 quand elle est relâchée
gate = button("gate");

// ─────────────────────────────────────────────────────
// Enveloppe ADSR
// ─────────────────────────────────────────────────────

// L'enveloppe ADSR modélise l'évolution du volume dans le temps :
// Attack : montée rapide quand la touche est enfoncée
// Decay : descente vers le niveau de sustain
// Sustain : niveau maintenu tant que la touche reste enfoncée
// Release : descente vers le silence quand la touche est relâchée
envelope = en.adsr(
    // Attack : 10 ms (montée rapide)
    0.01,
    // Decay : 100 ms (descente vers le sustain)
    0.1,
    // Sustain : 70% du volume maximum
    0.7,
    // Release : 200 ms (extinction progressive après relâchement)
    0.2,
    // gate : signal de déclenchement (1 = touche enfoncée)
    gate
);

// ─────────────────────────────────────────────────────
// Synthèse : une voix
// ─────────────────────────────────────────────────────

// Chaque voix produit une onde sinusoïdale à la fréquence de la note
// multipliée par la vélocité et l'enveloppe ADSR
process = os.osc(freq) * gain * envelope;
```

Compile et teste :

```bash
# -midi active le MIDI, -nvoices 8 confirme 8 voix de polyphonie
faust2jaqt -midi -nvoices 8 poly-synth.dsp
./poly-synth
```

**Résultat attendu** :

```text
Le programme attend des messages MIDI Note On/Off.

Si un clavier MIDI est connecté :
- Jouer une note produit un son sinusoïdal avec enveloppe ADSR
- Jouer un accord (plusieurs touches simultanées) produit plusieurs
  notes en même temps (jusqu'à 8 simultanées)
- Frapper fort produit un son plus fort (vélocité)
- Relâcher une touche déclenche le release de l'enveloppe (200 ms)

Sans clavier MIDI, tu peux tester avec un logiciel
qui envoie des messages MIDI (ex: VMPK, aconnect).
```

---

### Étape 3 : Activer l'OSC et contrôler les paramètres depuis un autre logiciel

On reprend le synthétiseur de l'étape 1 et on active le support OSC pour le contrôler via le réseau.

Crée un fichier `osc-synth.dsp` :

```faust
// osc-synth.dsp - Synthétiseur contrôlable via OSC
import("stdfaust.lib");

// Groupe principal pour structurer les adresses OSC
process = vgroup("Synthé",

    hgroup("Oscillateur",
        // Adresse OSC générée : /Synthé/Oscillateur/freq
        os.osc(hslider("freq [unit:Hz] [scale:log]", 440, 200, 5000, 1))
    )

    * hgroup("Amplitude",
        // Adresse OSC générée : /Synthé/Amplitude/vol
        hslider("vol", 0.5, 0, 1, 0.01)
    )

    // Adresse OSC pour le bargraph : /Synthé/level
    : hbargraph("level", -1, 1)
);
```

Compile avec l'option OSC et lance :

```bash
# -osc active le support OSC dans le programme compilé
faust2jaqt -osc osc-synth.dsp
./osc-synth
```

Le programme affiche les ports OSC au démarrage :

```text
Faust OSC version 1.x
  listening on port 5510
  sending on port 5511
  xmit on port 5512
```

Teste le contrôle OSC depuis le terminal avec `oscsend` (paquet `liblo-utils` sous Linux, `liblo` sous macOS) :

```bash
# Envoie la valeur 880.0 à l'adresse /Synthé/Oscillateur/freq
# Format : oscsend <host> <port> <adresse> <type> <valeur>
# "f" signifie float (nombre décimal)
oscsend localhost 5510 /Synthé/Oscillateur/freq f 880.0

# Change le volume à 0.3
oscsend localhost 5510 /Synthé/Amplitude/vol f 0.3

# Demande la liste de toutes les adresses OSC disponibles
oscsend localhost 5510 /Synthé xplore
```

**Résultat attendu** :

```text
Après l'envoi de la commande oscsend pour la fréquence :
- Le slider "freq" de l'interface graphique se déplace à 880
- La hauteur du son change immédiatement

Après l'envoi de la commande oscsend pour le volume :
- Le slider "vol" se déplace à 0.3
- Le volume du son diminue

Le contrôle par OSC et par souris fonctionnent simultanément.
```

---

### Étape 4 : Mapper un accéléromètre sur un paramètre (simulation)

On utilise les métadonnées de capteurs pour préparer un programme qui réagit à l'accéléromètre. Sur un ordinateur de bureau, on simule les capteurs avec les sliders ou via OSC.

Crée un fichier `accelero-synth.dsp` :

```faust
// accelero-synth.dsp - Synthétiseur contrôlé par accéléromètre
import("stdfaust.lib");

process = vgroup("Capteurs",

    hgroup("Contrôle par mouvement",
        os.osc(
            // [acc:0 0 -10 0 10] : l'axe X de l'accéléromètre contrôle la fréquence
            // axe = 0 (X : gauche-droite)
            // courbe = 0 (mapping linéaire croissant)
            // amin = -10 (incliné à gauche, valeur minimale du capteur)
            // amid = 0 (téléphone horizontal, valeur centrale)
            // amax = 10 (incliné à droite, valeur maximale du capteur)
            // La fréquence va de 200 Hz (gauche) à 2000 Hz (droite)
            hslider("Fréquence [acc:0 0 -10 0 10] [unit:Hz]",
                440, 200, 2000, 1)
        )

        // [acc:1 0 -10 0 10] : l'axe Y contrôle le volume
        // axe = 1 (Y : avant-arrière)
        // Pencher en avant augmente le volume
        * hslider("Volume [acc:1 0 -10 0 10]",
            0.5, 0, 1, 0.01)

        // [acc:2 2 -10 0 10] : l'axe Z contrôle le vibrato
        // axe = 2 (Z : haut-bas)
        // courbe = 2 (en V : le vibrato augmente dans les deux sens
        //   à partir de la position horizontale)
        * (1 + os.osc(5) *
            hslider("Vibrato [acc:2 2 -10 0 10]",
                0, 0, 0.3, 0.01))
    )
);
```

Compile et teste :

```bash
# Sur ordinateur, les capteurs sont simulés par les sliders
faust2jaqt -osc accelero-synth.dsp
./accelero-synth
```

Pour simuler les capteurs via OSC depuis le terminal :

```bash
# Simule une inclinaison à droite (accéléromètre X = 8)
# Le slider "Fréquence" se déplace vers les aigus
oscsend localhost 5510 /Capteurs/Contrôle\ par\ mouvement/Fréquence f 1500

# Simule une inclinaison avant (accéléromètre Y = 5)
# Le volume augmente
oscsend localhost 5510 /Capteurs/Contrôle\ par\ mouvement/Volume f 0.8
```

**Résultat attendu** :

```text
Sur ordinateur :
- Les sliders sont interactifs à la souris
- Déplacer "Fréquence" change la hauteur du son (200-2000 Hz)
- Déplacer "Volume" change l'intensité
- Déplacer "Vibrato" ajoute un tremblement au son

Sur smartphone (après compilation avec faust2smartkeyboard) :
- Incliner le téléphone à droite → son plus aigu
- Incliner vers l'avant → son plus fort
- Secouer le téléphone → vibrato
```

---

### Étape 5 : Combiner MIDI (notes) + OSC (contrôle continu)

On crée un synthétiseur polyphonique qui reçoit les notes par MIDI et les paramètres d'effet par OSC, combinant le meilleur des deux protocoles.

Crée un fichier `midi-osc-combined.dsp` :

```faust
// midi-osc-combined.dsp - MIDI pour les notes, OSC pour les effets
import("stdfaust.lib");

// Active MIDI et polyphonie
declare options "[midi:on][nvoices:8]";

// ─────────────────────────────────────────────────────
// Paramètres polyphoniques (contrôlés par MIDI)
// ─────────────────────────────────────────────────────

// freq, gain, gate sont gérés automatiquement par le MIDI
freq = hslider("freq", 440, 20, 20000, 1);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");

// ─────────────────────────────────────────────────────
// Paramètres de timbre (contrôlés par MIDI CC ou OSC)
// ─────────────────────────────────────────────────────

// CC 74 (Brightness) contrôle le cutoff du filtre
// Ce paramètre est aussi accessible via OSC : /Timbre/cutoff
cutoff = hgroup("Timbre",
    hslider("cutoff [midi:ctrl 74] [unit:Hz] [scale:log]",
        2000, 100, 10000, 1));

// CC 71 (Resonance) contrôle la résonance du filtre
resonance = hgroup("Timbre",
    hslider("resonance [midi:ctrl 71]",
        0.5, 0.1, 5, 0.01));

// ─────────────────────────────────────────────────────
// Synthèse d'une voix
// ─────────────────────────────────────────────────────

// Enveloppe ADSR déclenchée par gate
envelope = en.adsr(0.01, 0.1, 0.7, 0.3, gate);

// Onde en dent de scie filtrée par un filtre passe-bas résonant
// La fréquence de coupure est contrôlée par MIDI CC 74 ou OSC
process = os.sawtooth(freq)
    : fi.resonlp(cutoff, resonance, 1)
    * gain * envelope;

// ─────────────────────────────────────────────────────
// Effet post-polyphonie (contrôlable via OSC uniquement)
// ─────────────────────────────────────────────────────

// Les paramètres de reverb sont accessibles via OSC :
// /Reverb/roomSize, /Reverb/damping, etc.
effect = vgroup("Reverb",
    dm.zita_light
);
```

Compile avec MIDI et OSC :

```bash
# -midi active le MIDI, -osc active l'OSC, -nvoices 8 active la polyphonie
faust2jaqt -midi -osc -nvoices 8 midi-osc-combined.dsp
./midi-osc-combined
```

Contrôle les paramètres de reverb via OSC pendant que tu joues des notes MIDI :

```bash
# Modifie les paramètres de la reverb via OSC
# (les adresses exactes dépendent de l'implémentation de dm.zita_light)
oscsend localhost 5510 /Reverb/Decay_Time_in_Band_0 f 4.0
oscsend localhost 5510 /Reverb/Decay_Time_in_Band_1 f 3.0
```

**Résultat attendu** :

```text
Le synthétiseur fonctionne avec les deux protocoles simultanément :

MIDI (notes et contrôle) :
- Les notes du clavier MIDI déclenchent les voix polyphoniques
- La molette CC 74 contrôle le cutoff du filtre
- La molette CC 71 contrôle la résonance

OSC (paramètres d'effet) :
- Les paramètres de reverb sont ajustables via OSC
- Modifier la reverb n'interrompt pas le jeu MIDI

Les deux protocoles coexistent sans conflit.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `declare options "[midi:on]";` | Active le support MIDI dans le programme |
| `declare options "[nvoices:N]";` | Définit N voix de polyphonie |
| `[midi:ctrl N]` | Associe un widget au MIDI CC numéro N |
| `[midi:keyon M]` | Associe un widget au Note On de la note M |
| `[midi:keyoff M]` | Associe un widget au Note Off de la note M |
| `[midi:pitchwheel]` | Associe un widget au pitch bend |
| `[midi:chanpress]` | Associe un widget au channel aftertouch |
| `[acc:axe courbe min mid max]` | Associe un widget à l'accéléromètre |
| `[gyr:axe courbe min mid max]` | Associe un widget au gyroscope |
| `effect = ...;` | Définit un effet post-polyphonie |
| `faust2jaqt -midi fichier.dsp` | Compile avec support MIDI (JACK/Qt) |
| `faust2jaqt -osc fichier.dsp` | Compile avec support OSC |
| `faust2jaqt -midi -osc fichier.dsp` | Compile avec MIDI et OSC |
| `faust2smartkeyboard fichier.dsp` | Génère une application mobile avec capteurs |
| `oscsend host port /adresse f valeur` | Envoie un message OSC |

---

## Pièges Fréquents

### Piège 1 : Oublier `declare options "[midi:on]"`

**Problème** : Tu ajoutes `[midi:ctrl 7]` sur un slider, mais le slider ne réagit pas aux messages MIDI.

**Solution** : Ajoute `declare options "[midi:on]";` en début de fichier. Sans cette déclaration, le programme ignore tous les messages MIDI.

```faust
// ❌ Incorrect : pas de déclaration MIDI
import("stdfaust.lib");
freq = hslider("Fréquence [midi:ctrl 74]", 440, 200, 5000, 1);
process = os.osc(freq);

// ✅ Correct : MIDI activé
import("stdfaust.lib");
declare options "[midi:on]";
freq = hslider("Fréquence [midi:ctrl 74]", 440, 200, 5000, 1);
process = os.osc(freq);
```

---

### Piège 2 : Nommer les paramètres polyphoniques incorrectement

**Problème** : Le synthétiseur polyphonique ne produit aucun son quand tu joues des notes MIDI, ou toutes les voix jouent la même note.

**Solution** : Les trois paramètres polyphoniques doivent s'appeler exactement `freq`, `gain` et `gate` (en minuscules, sans accent, sans espace). Ce sont des noms réservés que le système polyphonique recherche.

```faust
// ❌ Incorrect : noms non reconnus par le système polyphonique
frequency = hslider("frequency", 440, 20, 20000, 1);
velocity = hslider("velocity", 0.5, 0, 1, 0.01);
noteOn = button("noteOn");

// ✅ Correct : noms reconnus par le système polyphonique
freq = hslider("freq", 440, 20, 20000, 1);
gain = hslider("gain", 0.5, 0, 1, 0.01);
gate = button("gate");
```

---

### Piège 3 : Placer la reverb dans `process` au lieu de `effect`

**Problème** : Le synthétiseur polyphonique consomme beaucoup de CPU et la reverb sonne de manière étrange (chaque note a sa propre reverb).

**Solution** : Utilise le mot-clé `effect` pour les traitements partagés. Le mot-clé `effect` est instancié une seule fois après le mélange des voix.

```faust
// ❌ Incorrect : la reverb est dupliquée dans chaque voix (8 reverbs)
process = os.osc(freq) * gain * gate : dm.zita_light;

// ✅ Correct : la reverb est appliquée une fois après le mélange
process = os.osc(freq) * gain * gate;
effect = dm.zita_light;
```

---

### Piège 4 : Oublier l'option `-midi` à la compilation

**Problème** : Le code contient `declare options "[midi:on]"` mais le programme ne reçoit aucun message MIDI.

**Solution** : L'option MIDI doit être activée à la fois dans le code (`declare options`) et à la compilation (`-midi`).

```bash
# ❌ Incorrect : pas d'option -midi
faust2jaqt poly-synth.dsp

# ✅ Correct : -midi active le support MIDI dans l'architecture
faust2jaqt -midi poly-synth.dsp
```

---

### Piège 5 : Confondre les ports OSC

**Problème** : Tu envoies des messages OSC mais le programme ne réagit pas.

**Solution** : Vérifie que tu envoies les messages sur le port d'entrée (5510 par défaut), pas sur le port de sortie (5511) ou de notification (5512).

```bash
# ❌ Incorrect : port 5511 est le port de SORTIE (le programme envoie)
oscsend localhost 5511 /Synthé/freq f 880.0

# ✅ Correct : port 5510 est le port d'ENTRÉE (le programme écoute)
oscsend localhost 5510 /Synthé/freq f 880.0
```

---

### Piège 6 : Adresses OSC avec espaces ou caractères spéciaux

**Problème** : Un message OSC envoyé à `/Mon Synthé/Fréquence` n'est pas reçu par le programme.

**Solution** : Les adresses OSC contenant des espaces ou des caractères accentués doivent être échappées dans le terminal. Utilise des labels sans espaces dans le code Faust pour simplifier les adresses OSC.

```faust
// ❌ Problématique : l'adresse OSC contient des espaces et accents
// Adresse générée : /Mon Synthé/Oscillateur/Fréquence
process = vgroup("Mon Synthé", os.osc(hslider("Fréquence", 440, 200, 5000, 1)));

// ✅ Plus pratique : adresses OSC simples et sans espaces
// Adresse générée : /synth/osc/freq
process = vgroup("synth", hgroup("osc", os.osc(hslider("freq", 440, 200, 5000, 1))));
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre MIDI (contrôle discret, 0-127) et OSC (contrôle continu, float)
- [ ] J'ai ajouté `declare options "[midi:on]"` dans un programme Faust
- [ ] J'ai associé un slider à un MIDI CC avec `[midi:ctrl N]`
- [ ] J'ai créé un synthétiseur polyphonique avec les paramètres `freq`, `gain` et `gate`
- [ ] J'ai compris le rôle de `effect` pour les traitements post-polyphonie
- [ ] J'ai compilé un programme avec `-osc` et envoyé un message OSC avec `oscsend`
- [ ] J'ai compris les métadonnées `[acc:...]` pour les capteurs mobiles
- [ ] J'ai compris les conventions Général MIDI (CC 1 = modulation, CC 7 = volume, CC 74 = cutoff)
- [ ] J'ai combiné MIDI (notes) et OSC (paramètres continus) dans un même programme

---

## Exercice Pratique

**Énoncé** : Crée un synthétiseur polyphonique 8 voix dans un fichier `synth-complet.dsp` avec les caractéristiques suivantes :

1. **Oscillateur avec forme d'onde sélectionnable** :
   - Un paramètre contrôlé par MIDI CC 70 permet de choisir entre sinus, dent de scie et carré
   - Le paramètre va de 0 à 2 (0 = sinus, 1 = dent de scie, 2 = carré)
   - Utilise `select3` pour sélectionner la forme d'onde

2. **Filtre passe-bas résonant** :
   - Fréquence de coupure (cutoff) contrôlée par MIDI CC 1 (molette de modulation), plage 100-10000 Hz, échelle logarithmique
   - Résonance contrôlée par MIDI CC 74, plage 0.5-5

3. **Enveloppe ADSR** :
   - Attack = 10 ms, Decay = 100 ms, Sustain = 0.7, Release = 300 ms

4. **Effet post-polyphonie** :
   - Reverb `dm.zita_light` contrôlable via OSC

5. **Contrôle OSC pour les paramètres de reverb** :
   - Les paramètres de la reverb doivent être dans un groupe "Reverb" pour générer des adresses OSC claires

**Indications** :

- Déclare `declare options "[midi:on][nvoices:8]";` en début de fichier
- Les paramètres `freq`, `gain` et `gate` sont réservés pour la polyphonie
- Utilise `os.osc(freq)`, `os.sawtooth(freq)`, `os.square(freq)` pour les trois formes d'onde
- Utilise `fi.resonlp(cutoff, Q, gain)` pour le filtre passe-bas résonant
- Utilise `en.adsr(a, d, s, r, gate)` pour l'enveloppe
- Utilise `select3(index, signal0, signal1, signal2)` pour la sélection de forme d'onde (index commence à 0)
- Compile avec `faust2jaqt -midi -osc -nvoices 8`

**Résultat attendu** :

```text
Le synthétiseur répond aux notes MIDI avec 8 voix de polyphonie.

Contrôle MIDI :
- Notes du clavier → déclenchent les voix (freq/gain/gate)
- CC 70 → change la forme d'onde (sinus → dent de scie → carré)
- CC 1 (modwheel) → balaye le filtre de 100 à 10000 Hz
- CC 74 → ajuste la résonance du filtre

Contrôle OSC :
- Les paramètres de la reverb sont accessibles via /Reverb/...
- Modifier la reverb via oscsend change le son en temps réel

Le filtre résonant crée des variations de timbre expressives
quand le cutoff est balayé avec la molette de modulation.
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
// synth-complet.dsp - Synthétiseur polyphonique MIDI + OSC
import("stdfaust.lib");

// Active le MIDI et définit 8 voix de polyphonie
declare options "[midi:on][nvoices:8]";

// ─────────────────────────────────────────────────────
// Paramètres polyphoniques (gérés automatiquement par MIDI)
// ─────────────────────────────────────────────────────

// freq reçoit la fréquence de la note MIDI jouée
freq = hslider("freq", 440, 20, 20000, 1);

// gain reçoit la vélocité normalisée (0 à 1)
gain = hslider("gain", 0.5, 0, 1, 0.01);

// gate vaut 1 quand la touche est enfoncée, 0 quand relâchée
gate = button("gate");

// ─────────────────────────────────────────────────────
// Paramètres de timbre (contrôlés par MIDI CC)
// ─────────────────────────────────────────────────────

// CC 70 sélectionne la forme d'onde
// 0 = sinus, 1 = dent de scie, 2 = carré
// Le CC mappe 0-127 vers 0-2
waveform = hslider("waveform [midi:ctrl 70]", 0, 0, 2, 1);

// CC 1 (Modulation Wheel) contrôle le cutoff du filtre
// Échelle logarithmique pour un contrôle musical
// Plage de 100 Hz (son sombre) à 10000 Hz (son brillant)
cutoff = hslider("cutoff [midi:ctrl 1] [unit:Hz] [scale:log]",
    2000, 100, 10000, 1);

// CC 74 (Brightness) contrôle la résonance du filtre
// Plage de 0.5 (pas de résonance) à 5 (forte résonance)
resonance = hslider("resonance [midi:ctrl 74]",
    0.5, 0.5, 5, 0.01);

// ─────────────────────────────────────────────────────
// Enveloppe ADSR
// ─────────────────────────────────────────────────────

// Enveloppe qui modèle l'évolution du volume dans le temps
envelope = en.adsr(
    0.01,   // Attack : 10 ms (montée rapide)
    0.1,    // Decay : 100 ms (descente vers sustain)
    0.7,    // Sustain : 70% du volume max
    0.3,    // Release : 300 ms (extinction après relâchement)
    gate    // Déclencheur : touche enfoncée/relâchée
);

// ─────────────────────────────────────────────────────
// Sélection de la forme d'onde
// ─────────────────────────────────────────────────────

// select3 choisit entre trois signaux selon l'index (0, 1 ou 2)
// int(waveform) convertit la valeur float en entier
oscillator = select3(int(waveform),
    // Index 0 : onde sinusoïdale (son pur, pas d'harmoniques)
    os.osc(freq),
    // Index 1 : dent de scie (riche en harmoniques, son brillant)
    os.sawtooth(freq),
    // Index 2 : onde carrée (harmoniques impaires, son creux)
    os.square(freq)
);

// ─────────────────────────────────────────────────────
// Synthèse d'une voix : oscillateur → filtre → enveloppe
// ─────────────────────────────────────────────────────

// Le signal passe par trois étapes :
// 1. L'oscillateur génère le son brut
// 2. Le filtre passe-bas enlève les harmoniques au-dessus du cutoff
// 3. L'enveloppe module le volume dans le temps
process = oscillator
    // fi.resonlp : filtre passe-bas résonant
    // cutoff : fréquence de coupure (les fréquences au-dessus sont atténuées)
    // resonance : pic de résonance au cutoff (Q factor)
    // 1 : gain unitaire
    : fi.resonlp(cutoff, resonance, 1)
    // Multiplication par vélocité et enveloppe
    * gain * envelope;

// ─────────────────────────────────────────────────────
// Effet post-polyphonie : reverb partagée
// ─────────────────────────────────────────────────────

// La reverb est instanciée UNE SEULE FOIS après le mélange des voix
// Les paramètres sont accessibles via OSC : /Reverb/...
effect = vgroup("Reverb", dm.zita_light);
```

**Explications de la solution** :

1. **Polyphonie** : `declare options "[midi:on][nvoices:8]"` active le MIDI et crée 8 instances du `process`. Les paramètres `freq`, `gain` et `gate` sont automatiquement alimentés par les notes MIDI.

2. **Sélection de forme d'onde** : `select3(int(waveform), sinus, sawtooth, carré)` choisit l'oscillateur en fonction de la valeur du CC 70. `int()` convertit le float en entier pour que `select3` fonctionne correctement.

3. **Filtre résonant** : `fi.resonlp(cutoff, resonance, 1)` applique un filtre passe-bas. Le cutoff est contrôlé par la molette de modulation (CC 1) et la résonance par le CC 74.

4. **Enveloppe ADSR** : L'enveloppe transforme la note instantanée (gate on/off) en une évolution progressive du volume. Sans enveloppe, le son apparaîtrait et disparaîtrait brutalement.

5. **Effet post-polyphonie** : `effect = vgroup("Reverb", dm.zita_light)` place la reverb dans un groupe nommé, ce qui génère des adresses OSC claires sous `/Reverb/`.

Compile et vérifie :

```bash
faust2jaqt -midi -osc -nvoices 8 synth-complet.dsp
./synth-complet
```

```text
Vérifie que :
- Les notes MIDI déclenchent des voix indépendantes
- Jouer un accord produit plusieurs notes simultanées
- Le CC 70 change la forme d'onde (le timbre change)
- La molette de modulation (CC 1) balaye le filtre
- Le CC 74 modifie la résonance du filtre
- La reverb est contrôlable via OSC
- Le release de 300 ms crée une extinction progressive
```

---

## Navigation

← Fiche précédente : **[03 - Faust et Max/PureData/SuperCollider](03-faust-max-puredata-supercollider.md)**

→ Fiche suivante : **[05 - Faust et Machine Learning (DDSP)](05-faust-machine-learning-ddsp.md)**
