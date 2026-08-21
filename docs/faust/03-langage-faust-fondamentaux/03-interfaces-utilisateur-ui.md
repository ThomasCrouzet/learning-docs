---
tags:
  - Faust
  - Intermédiaire
  - Pratique
description: "Interfaces utilisateur Faust - sliders, boutons, groupes et métadonnées pour contrôler les paramètres DSP"
estimated_time: "70 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 3 - Langage Faust fondamentaux"
id: "specializations.faust.language.interfaces-utilisateur-ui"
course_id: "specializations.faust"
module_id: "specializations.faust.language"
content_type: "lesson"
order: 3
---

# 03 - Interfaces utilisateur (UI)

> **En bref** : À la fin de cette fiche, tu sauras créer des interfaces utilisateur complètes pour tes programmes Faust, organiser les paramètres en groupes et ajouter des métadonnées. Lecture estimée : 70 min.


## Prérequis

- [Fiche 01 - Syntaxe et sémantique de base](01-syntaxe-semantique-base.md)
- [Fiche 02 - Les cinq opérateurs de composition](02-cinq-operateurs-composition.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des interfaces utilisateur complètes pour tes programmes Faust, organiser les paramètres en groupes et ajouter des métadonnées.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une interface utilisateur en Faust ?

**Définition** : Une interface utilisateur (UI) en Faust est un ensemble de widgets (curseurs, boutons, afficheurs) qui permettent de contrôler et de visualiser les paramètres d'un programme audio en temps réel, sans modifier le code source.

**Le problème que les interfaces utilisateur résolvent** :

Sans interface utilisateur, voici les problèmes rencontrés :

1. **Valeurs figées** : Pour changer une fréquence de 440 Hz à 880 Hz, tu dois modifier le code et recompiler.
2. **Pas de contrôle en temps réel** : Pendant que le son joue, tu ne peux rien ajuster.
3. **Aucun retour visuel** : Aucun moyen de voir le niveau de sortie du signal.

**Comment les interfaces utilisateur résolvent ces problèmes** :

| Problème | Solution apportée par les UI |
| --- | --- |
| Valeurs figées | Les widgets fournissent des valeurs modifiables sans toucher au code |
| Pas de contrôle en temps réel | Les curseurs et boutons agissent immédiatement pendant l'exécution |
| Aucun retour visuel | Les bargraphs affichent les niveaux de signal en temps réel |

**Analogie concrète** : Imagine un amplificateur de guitare. Sur le panneau avant, tu trouves des boutons rotatifs (volume, tonalité, gain), un interrupteur on/off et un VU-mètre. Tu n'as pas besoin d'ouvrir l'amplificateur et de ressouder des composants pour changer le volume : tu tournes le bouton. Les widgets Faust sont ces boutons et afficheurs sur le panneau avant de ton programme audio.

**Ce qu'une interface utilisateur Faust n'est PAS** :

- Une UI Faust n'est pas un éditeur graphique de signal. Elle fournit uniquement des contrôles pour les paramètres numériques du programme.
- Une UI Faust n'est pas figée dans un seul style visuel. Le même code Faust peut générer une interface Qt, une page web ou un plugin VST. L'apparence dépend de l'architecture de déploiement.

---

### Qu'est-ce qu'un widget de valeur ?

**Définition** : Un widget de valeur est un élément d'interface qui produit un signal constant contrôlé par l'utilisateur. Ce signal est un nombre que l'utilisateur peut modifier en temps réel via un curseur ou un champ numérique.

**Le problème que les widgets de valeur résolvent** :

Sans widgets de valeur, voici les problèmes rencontrés :

1. **Paramètres inaccessibles** : Pour changer la fréquence d'un oscillateur, tu dois modifier le code et recompiler.
2. **Plage non contrôlée** : Rien n'empêche de mettre une fréquence de -5000 Hz, ce qui peut produire du bruit.

**Comment les widgets de valeur résolvent ces problèmes** :

| Problème | Solution apportée par les widgets de valeur |
| --- | --- |
| Paramètres inaccessibles | Le curseur permet de modifier la valeur en temps réel |
| Plage non contrôlée | Les paramètres `min`, `max` et `step` garantissent des valeurs valides |

**Analogie concrète** : Un thermostat mural. La molette a une position minimale (15 degrés) et maximale (30 degrés), et avance par pas de 0.5 degrés. Tu ne peux pas demander -50 degrés ni 300 degrés. Le widget de valeur Faust fonctionne pareil : tu définis la plage et le pas.

**Les trois types de widgets de valeur** :

| Widget | Syntaxe | Apparence |
| --- | --- | --- |
| `hslider` | `hslider("label", init, min, max, step)` | Curseur horizontal |
| `vslider` | `vslider("label", init, min, max, step)` | Curseur vertical |
| `nentry` | `nentry("label", init, min, max, step)` | Champ numérique avec flèches haut/bas |

**Paramètres communs** :

| Paramètre | Signification | Exemple |
| --- | --- | --- |
| `label` | Nom affiché dans l'interface | `"Fréquence"` |
| `init` | Valeur initiale au démarrage | `440` |
| `min` | Valeur minimale autorisée | `20` |
| `max` | Valeur maximale autorisée | `20000` |
| `step` | Pas d'incrémentation | `1` |

**Exemple de chaque widget** :

```faust
// Curseur horizontal pour régler une fréquence entre 20 et 20000 Hz
freq = hslider("Fréquence", 440, 20, 20000, 1);

// Curseur vertical pour régler un volume entre 0 et 1
vol = vslider("Volume", 0.5, 0, 1, 0.01);

// Entrée numérique pour choisir un nombre d'harmoniques (entier)
harmoniques = nentry("Harmoniques", 4, 1, 16, 1);
```

**Comment choisir** : utilise `hslider`/`vslider` pour les plages continues larges (fréquence, volume) et `nentry` pour les valeurs entières avec peu de choix (1 à 8). Choisis `hslider` ou `vslider` selon la disposition souhaitée (horizontale ou verticale).

---

### Qu'est-ce qu'un widget de déclenchement ?

**Définition** : Un widget de déclenchement est un élément d'interface qui produit un signal 0 ou 1. Contrairement aux widgets de valeur qui donnent un nombre quelconque dans une plage, un widget de déclenchement ne produit que deux états : activé (1) ou désactivé (0).

**Le problème que les widgets de déclenchement résolvent** :

Sans widgets de déclenchement, voici les problèmes rencontrés :

1. **Pas d'interrupteur** : Pour couper le son, tu dois fermer le programme ou mettre le volume à 0 manuellement.
2. **Pas de déclenchement ponctuel** : Impossible de déclencher un son bref sur commande.

**Comment les widgets de déclenchement résolvent ces problèmes** :

| Problème | Solution apportée par les widgets de déclenchement |
| --- | --- |
| Pas d'interrupteur | `checkbox` fournit un toggle on/off permanent |
| Pas de déclenchement ponctuel | `button` envoie 1 tant qu'il est pressé, 0 dès qu'il est relâché |

**Analogie concrète** : Pense à deux types d'interrupteurs chez toi. L'interrupteur de la lumière (checkbox) : tu appuies une fois, la lumière reste allumée ; tu appuies à nouveau, elle s'éteint. La sonnette de la porte (button) : elle sonne tant que tu appuies dessus, et elle s'arrête dès que tu relâches.

**Les deux types de widgets de déclenchement** :

| Widget | Syntaxe | Comportement |
| --- | --- | --- |
| `button` | `button("label")` | Vaut 1 tant que l'utilisateur appuie, 0 sinon |
| `checkbox` | `checkbox("label")` | Alterne entre 0 et 1 à chaque clic |

**Ce qu'un widget de déclenchement n'est PAS** :

- Un `button` n'est pas un bouton qui déclenche une action unique (comme "Enregistrer" dans un logiciel). C'est un signal continu qui vaut 1 pendant toute la durée de l'appui.
- Un `checkbox` n'est pas un sélecteur multiple. Il ne peut prendre que deux valeurs : 0 ou 1.

**Exemple** :

```faust
// Bouton gate : le son passe uniquement quand on appuie
gate = button("Play");

// Interrupteur mute : coupe le son quand activé
mute = checkbox("Mute");

// Utilisation : le signal passe si gate est actif ET mute est inactif
process = os.osc(440) * gate * (1 - mute);
```

---

### Qu'est-ce qu'un groupe ?

**Définition** : Un groupe est un conteneur qui rassemble plusieurs widgets sous un même label. Il organise l'interface en zones visuellement distinctes et crée une hiérarchie dans les noms des paramètres.

**Le problème que les groupes résolvent** :

Sans groupes, voici les problèmes rencontrés :

1. **Interface désordonnée** : Avec 10 paramètres en vrac, l'interface devient difficile à lire.
2. **Noms ambigus** : Deux paramètres "Volume" sont impossibles à distinguer.
3. **Pas de structure logique** : L'utilisateur ne sait pas quels paramètres sont liés.

**Comment les groupes résolvent ces problèmes** :

| Problème | Solution apportée par les groupes |
| --- | --- |
| Interface désordonnée | Les groupes créent des zones visuelles séparées avec des titres |
| Noms ambigus | Le chemin complet distingue `Oscillateur/Volume` de `Filtre/Volume` |
| Pas de structure logique | Les paramètres liés sont regroupés visuellement |

**Analogie concrète** : Le tableau de bord d'une voiture. Les compteurs de vitesse sont regroupés dans une zone, les commandes de climatisation dans une autre, l'audio dans une troisième. Les groupes Faust fonctionnent pareil : ils créent des zones étiquetées dans l'interface.

**Les trois types de groupes** :

| Groupe | Syntaxe | Disposition |
| --- | --- | --- |
| `hgroup` | `hgroup("label", contenu)` | Les widgets sont côte à côte horizontalement |
| `vgroup` | `vgroup("label", contenu)` | Les widgets sont empilés verticalement |
| `tgroup` | `tgroup("label", contenu)` | Les widgets sont dans des onglets |

**Exemple** :

```faust
import("stdfaust.lib");

// Groupe vertical principal contenant deux sous-groupes horizontaux
process = vgroup("Synthétiseur",
    hgroup("Oscillateur",
        os.osc(hslider("Fréquence", 440, 20, 20000, 1))
        * hslider("Volume", 0.5, 0, 1, 0.01)
    )
    * hgroup("Contrôle",
        // Le bouton gate laisse passer le signal quand on appuie
        button("Play")
        // Le checkbox mute coupe le signal quand il est coché
        * (1 - checkbox("Mute"))
    )
);
```

**Groupes imbriqués** :

Les groupes peuvent être imbriqués. Chaque niveau ajoute un préfixe au chemin du paramètre, ce qui permet d'avoir deux widgets avec le même nom dans des groupes différents.

```faust
process = vgroup("Synthé",
    // Chemin : /Synthé/Oscillateur 1/Fréquence
    hgroup("Oscillateur 1", os.osc(hslider("Fréquence", 440, 20, 2000, 1)))
    +
    // Chemin : /Synthé/Oscillateur 2/Fréquence
    hgroup("Oscillateur 2", os.osc(hslider("Fréquence", 880, 20, 2000, 1)))
);
```

---

### Qu'est-ce qu'un bargraph ?

**Définition** : Un bargraph est un widget d'affichage qui visualise la valeur d'un signal de sortie. Contrairement aux sliders et boutons qui sont des widgets d'entrée (l'utilisateur envoie une valeur au programme), le bargraph est un widget de sortie (le programme envoie une valeur à l'interface).

**Le problème que les bargraphs résolvent** :

Sans bargraphs, voici les problèmes rencontrés :

1. **Signal invisible** : Tu ne sais pas si le signal de sortie est faible, fort ou s'il sature.
2. **Débogage difficile** : Tu ne peux pas observer les valeurs intermédiaires pour trouver un problème.

**Comment les bargraphs résolvent ces problèmes** :

| Problème | Solution apportée par les bargraphs |
| --- | --- |
| Signal invisible | La barre affiche le niveau du signal en temps réel |
| Débogage difficile | Tu peux attacher un bargraph à n'importe quel point du programme |

**Analogie concrète** : Le thermomètre à mercure. Il ne contrôle pas la température, il ne fait que l'afficher. Le bargraph fait pareil : il ne modifie pas le signal audio, il le montre visuellement.

**Les deux types de bargraphs** :

| Widget | Syntaxe | Apparence |
| --- | --- | --- |
| `hbargraph` | `hbargraph("label", min, max)` | Barre horizontale |
| `vbargraph` | `vbargraph("label", min, max)` | Barre verticale |

**Ce qu'un bargraph n'est PAS** :

- Un bargraph n'est pas un widget d'entrée. L'utilisateur ne peut pas cliquer dessus pour modifier une valeur. Il est en lecture seule.
- Un bargraph n'est pas un oscilloscope. Il n'affiche qu'une seule valeur instantanée (un nombre), pas une courbe dans le temps.

**Fonctionnement technique** :

Un bargraph doit recevoir un signal via l'opérateur `:` ou la fonction `attach`.

```faust
import("stdfaust.lib");

// Méthode 1 : le signal passe dans le bargraph (le plus simple)
process = os.osc(440) : *(0.5) : vbargraph("Niveau", -1, 1);

// Méthode 2 : attach - le signal passe sans modification,
// et sa valeur est envoyée au bargraph en parallèle
process = os.osc(440) : *(0.5)
    <: attach(_, hbargraph("Niveau", -1, 1));
```

---

### Que sont les métadonnées ?

**Définition** : Les métadonnées sont des informations supplémentaires ajoutées dans le label d'un widget, entre crochets `[]`. Elles modifient l'apparence, le comportement ou l'interprétation du widget sans changer la logique du programme.

**Le problème que les métadonnées résolvent** :

Sans métadonnées, voici les problèmes rencontrés :

1. **Apparence par défaut** : Tous les sliders sont des curseurs linéaires, même quand un potentiomètre rotatif serait plus adapté.
2. **Pas d'information contextuelle** : L'utilisateur voit "440" mais ne sait pas que c'est en Hz.
3. **Échelle inadaptée** : Un slider de 20 à 20000 Hz en linéaire compresse les basses fréquences.
4. **Pas de contrôle externe** : Impossible d'associer un paramètre à un contrôleur MIDI.

**Comment les métadonnées résolvent ces problèmes** :

| Problème | Solution apportée par les métadonnées |
| --- | --- |
| Apparence par défaut | `[style:knob]` transforme un slider en potentiomètre |
| Pas d'information contextuelle | `[unit:Hz]` et `[tooltip:texte]` ajoutent des indications |
| Échelle inadaptée | `[scale:log]` passe en échelle logarithmique |
| Pas de contrôle externe | `[midi:ctrl N]` associe un contrôleur MIDI CC |

**Analogie concrète** : Les étiquettes et marquages sur les boutons d'un amplificateur. Le bouton de volume a une étiquette "Volume", une unité "dB" et une courbe logarithmique. Ces informations ne changent pas le circuit interne : elles aident l'utilisateur à comprendre et utiliser le bouton.

**Syntaxe** : les métadonnées s'ajoutent entre crochets dans le label du widget. Plusieurs métadonnées peuvent être combinées.

```faust
// Syntaxe générale - plusieurs métadonnées dans un même label
hslider("Fréquence [unit:Hz] [scale:log] [tooltip:Fréquence de l'oscillateur]",
    440, 20, 20000, 1)
```

**Liste des métadonnées courantes** :

| Métadonnée | Effet | Exemple |
| --- | --- | --- |
| `[style:knob]` | Affiche le slider comme un potentiomètre rotatif | `hslider("Gain [style:knob]", ...)` |
| `[tooltip:texte]` | Affiche une info-bulle au survol | `hslider("Freq [tooltip:Fréquence fondamentale]", ...)` |
| `[unit:Hz]` | Affiche l'unité à côté de la valeur | `hslider("Freq [unit:Hz]", ...)` |
| `[unit:dB]` | Affiche l'unité dB | `hslider("Gain [unit:dB]", ...)` |
| `[scale:log]` | Utilise une échelle logarithmique | `hslider("Freq [scale:log]", ...)` |
| `[scale:exp]` | Utilise une échelle exponentielle | `hslider("Time [scale:exp]", ...)` |
| `[acc:x y z min max]` | Contrôle par accéléromètre (mobile) | `hslider("Tilt [acc:0 0 -10 0 10]", ...)` |
| `[midi:ctrl N]` | Association au contrôleur MIDI CC numéro N | `hslider("Vol [midi:ctrl 7]", ...)` |

**Ce que les métadonnées ne sont PAS** :

- Les métadonnées ne sont pas du code DSP. Elles ne modifient pas le calcul du signal (c'est l'interaction utilisateur qui change, pas le résultat).
- Les métadonnées ne sont pas universelles. Par exemple, `[acc:...]` ne fonctionne que sur les plateformes mobiles.

---

## Étapes Pratiques

### Étape 1 : Créer un oscillateur avec contrôle de fréquence par slider

On commence par le programme le plus simple : un oscillateur sinusoidal dont la fréquence est contrôlée par un slider horizontal.

Crée un fichier `ui-demo.dsp` avec ce contenu :

```faust
// ui-demo.dsp - Oscillateur avec contrôle de fréquence
import("stdfaust.lib");

// hslider("label", init, min, max, step) crée un curseur horizontal
// 440 = valeur initiale, 20 = min, 20000 = max, 1 = pas
freq = hslider("Fréquence", 440, 20, 20000, 1);

// Le slider remplace la valeur fixe qu'on aurait écrite : os.osc(440)
process = os.osc(freq);
```

Compile et lance le programme :

```bash
faust2jaqt ui-demo.dsp
./ui-demo
```

**Résultat attendu** : une fenêtre avec un curseur "Fréquence" positionné sur 440. En le déplaçant, la hauteur du son change en temps réel.

---

### Étape 2 : Ajouter un contrôle de volume avec slider

On ajoute un deuxième slider pour contrôler le volume (amplitude) du signal. Modifie `ui-demo.dsp` :

```faust
// ui-demo.dsp - Oscillateur avec contrôle de fréquence et volume
import("stdfaust.lib");

freq = hslider("Fréquence", 440, 20, 20000, 1);

// Volume : 0.5 initial, de 0 (silence) à 1 (max), pas de 0.01
vol = hslider("Volume", 0.5, 0, 1, 0.01);

// On multiplie le signal par le volume (0 = muet, 1 = pleine amplitude)
process = os.osc(freq) * vol;
```

Compile et teste :

```bash
faust2jaqt ui-demo.dsp
./ui-demo
```

**Résultat attendu** : deux curseurs ("Fréquence" sur 440, "Volume" sur 0.5) fonctionnent indépendamment.

---

### Étape 3 : Organiser en groupes

Avec plus de paramètres, il faut les organiser en groupes logiques. Modifie `ui-demo.dsp` :

```faust
// ui-demo.dsp - Interface organisée en groupes
import("stdfaust.lib");

// vgroup : éléments empilés verticalement
// hgroup : éléments côte à côte horizontalement
process = vgroup("Synthétiseur",
    // Chemin complet du slider : /Synthétiseur/Oscillateur/Fréquence
    hgroup("Oscillateur",
        os.osc(hslider("Fréquence", 440, 20, 20000, 1))
    )
    // Chemin complet du slider : /Synthétiseur/Amplitude/Volume
    * hgroup("Amplitude",
        hslider("Volume", 0.5, 0, 1, 0.01)
    )
);
```

Compile et teste :

```bash
faust2jaqt ui-demo.dsp
./ui-demo
```

**Résultat attendu** : les deux groupes "Oscillateur" et "Amplitude" apparaissent côte à côte dans un cadre "Synthétiseur", chacun avec son slider.

---

### Étape 4 : Ajouter un bouton on/off

Modifie `ui-demo.dsp` :

```faust
// ui-demo.dsp - Ajout de bouton et checkbox
import("stdfaust.lib");

process = vgroup("Synthétiseur",
    hgroup("Oscillateur",
        os.osc(hslider("Fréquence", 440, 20, 20000, 1))
    )
    * hgroup("Amplitude",
        hslider("Volume", 0.5, 0, 1, 0.01)
        * button("Play")            // 1 quand maintenu, 0 quand relâché
        * (1 - checkbox("Mute"))    // (1-checkbox) inverse : coché = silence
    )
);
```

Compile et teste :

```bash
faust2jaqt ui-demo.dsp
./ui-demo
```

**Résultat attendu** : le groupe "Amplitude" contient le slider "Volume", un bouton "Play" et un checkbox "Mute". Le son ne joue que si Play est maintenu ET Mute n'est pas coché.

---

### Étape 5 : Ajouter un bargraph pour visualiser le niveau de sortie

On ajoute un VU-mètre. Modifie `ui-demo.dsp` :

```faust
// ui-demo.dsp - Ajout d'un bargraph de niveau
import("stdfaust.lib");

synth = vgroup("Synthétiseur",
    hgroup("Oscillateur",
        os.osc(hslider("Fréquence", 440, 20, 20000, 1))
    )
    * hgroup("Amplitude",
        hslider("Volume", 0.5, 0, 1, 0.01)
        * button("Play")
        * (1 - checkbox("Mute"))
    )
);

// hbargraph("label", min, max) affiche le niveau sans modifier le signal
// Le signal passe dans le bargraph avant la sortie
process = synth : hbargraph("Niveau", -1, 1);
```

Compile et teste :

```bash
faust2jaqt ui-demo.dsp
./ui-demo
```

**Résultat attendu** : une barre horizontale "Niveau" oscille entre -1 et 1 au rythme du signal. Quand Play est relâché ou Mute coché, la barre reste à 0.

---

### Étape 6 : Ajouter des métadonnées (unités, tooltips, style knob)

On enrichit l'interface avec des métadonnées. Modifie `ui-demo.dsp` :

```faust
// ui-demo.dsp - Version finale avec métadonnées
import("stdfaust.lib");

process = vgroup("Synthétiseur",
    hgroup("Oscillateur",
        os.osc(
            // [unit:Hz] affiche l'unité, [scale:log] = échelle logarithmique
            // [tooltip:...] affiche une info-bulle au survol
            hslider("Fréquence [unit:Hz] [scale:log]
                [tooltip:Fréquence de l'oscillateur en Hertz]",
                440, 20, 20000, 1)
        )
    )
    * hgroup("Amplitude",
        // [style:knob] affiche un potentiomètre rotatif
        hslider("Volume [style:knob]
            [tooltip:Réglage du volume de sortie]", 0.5, 0, 1, 0.01)
        * button("Play [tooltip:Maintenir pour jouer le son]")
        * (1 - checkbox("Mute [tooltip:Cocher pour couper le son]"))
    )
) : hbargraph("Niveau [tooltip:Niveau instantané du signal]", -1, 1);
```

Compile et teste :

```bash
faust2jaqt ui-demo.dsp
./ui-demo
```

**Résultat attendu** :

```text
- Le slider "Fréquence" affiche "Hz" et utilise une échelle logarithmique
- Le slider "Volume" apparaît comme un potentiomètre rotatif (knob)
- En survolant chaque widget, une info-bulle explicative s'affiche
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `hslider("label", init, min, max, step)` | Crée un curseur horizontal |
| `vslider("label", init, min, max, step)` | Crée un curseur vertical |
| `nentry("label", init, min, max, step)` | Crée un champ numérique |
| `button("label")` | Crée un bouton momentané (1 si pressé) |
| `checkbox("label")` | Crée un interrupteur toggle (0/1) |
| `hgroup("label", contenu)` | Crée un groupe horizontal |
| `vgroup("label", contenu)` | Crée un groupe vertical |
| `tgroup("label", contenu)` | Crée un groupe à onglets |
| `hbargraph("label", min, max)` | Crée une barre de visualisation horizontale |
| `vbargraph("label", min, max)` | Crée une barre de visualisation verticale |
| `[style:knob]` | Métadonnée : affiche un potentiomètre rotatif |
| `[unit:Hz]` | Métadonnée : affiche l'unité Hz |
| `[scale:log]` | Métadonnée : échelle logarithmique |
| `[tooltip:texte]` | Métadonnée : info-bulle |
| `[midi:ctrl N]` | Métadonnée : association MIDI CC |
| `[acc:x y z min max]` | Métadonnée : contrôle par accéléromètre |

---

## Pièges Fréquents

### Piège 1 : Oublier l'import de la bibliothèque standard

**Problème** : `ERROR : undefined symbol : os`.

**Solution** : Ajoute `import("stdfaust.lib");` en début de fichier.

---

### Piège 2 : Valeur initiale hors de la plage min/max

**Problème** : Le slider ne se positionne pas comme attendu au démarrage.

**Solution** : Vérifie que `init` est compris entre `min` et `max`.

```faust
// ❌ Incorrect : 440 n'est pas entre 0 et 100
hslider("Freq", 440, 0, 100, 1)

// ✅ Correct : 440 est entre 20 et 20000
hslider("Freq", 440, 20, 20000, 1)
```

---

### Piège 3 : Confondre button et checkbox

**Problème** : Le son s'arrête dès que tu relâches le clic (tu as utilisé `button` au lieu de `checkbox`).

**Solution** : `checkbox` pour un état persistant, `button` pour un déclenchement momentané.

```faust
// ❌ button : le son s'arrête quand on relâche
process = os.osc(440) * button("On/Off");

// ✅ checkbox : maintient l'état après le clic
process = os.osc(440) * checkbox("On/Off");
```

---

### Piège 4 : Métadonnées mal formatées

**Problème** : Le slider reste linéaire malgré `[scale:log]`.

**Solution** : Les métadonnées doivent être à l'intérieur du label (entre les guillemets).

```faust
// ❌ Incorrect : métadonnées en dehors du label
hslider("Fréquence", 440, 20, 20000, 1) [scale:log]

// ✅ Correct : métadonnées dans le label
hslider("Fréquence [scale:log]", 440, 20, 20000, 1)
```

---

### Piège 5 : Bargraph sans signal d'entrée

**Problème** : Erreur de compilation car le bargraph ne reçoit pas de signal.

**Solution** : Connecte un signal au bargraph avec `:` ou `attach`.

```faust
// ❌ Incorrect : le bargraph flotte sans signal
process = os.osc(440);
vuMetre = hbargraph("Niveau", -1, 1);

// ✅ Correct : le signal passe dans le bargraph
process = os.osc(440) : hbargraph("Niveau", -1, 1);
```

---

### Piège 6 : Deux widgets avec le même label sans groupes

**Problème** : Deux sliders "Volume" sont fusionnés en un seul contrôle.

**Solution** : Place-les dans des groupes différents.

```faust
// ❌ Les deux sliders ont le même chemin "/Volume"
vol1 = hslider("Volume", 0.5, 0, 1, 0.01);
vol2 = hslider("Volume", 0.5, 0, 1, 0.01);

// ✅ Chemins distincts "/Osc1/Volume" et "/Osc2/Volume"
vol1 = hgroup("Osc1", hslider("Volume", 0.5, 0, 1, 0.01));
vol2 = hgroup("Osc2", hslider("Volume", 0.5, 0, 1, 0.01));
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre widget d'entrée (slider, button) et widget de sortie (bargraph)
- [ ] J'ai créé un slider avec les 5 paramètres : label, init, min, max, step
- [ ] J'ai compris la différence entre `button` (momentané) et `checkbox` (persistant)
- [ ] J'ai organisé mes widgets en groupes avec `hgroup`, `vgroup` ou `tgroup`
- [ ] J'ai utilisé un bargraph pour visualiser un signal de sortie
- [ ] J'ai ajouté des métadonnées (`[unit:...]`, `[scale:log]`, `[style:knob]`, `[tooltip:...]`)
- [ ] Je sais que les métadonnées se placent entre crochets dans le label du widget
- [ ] Je sais que deux widgets de même nom doivent être dans des groupes différents

---

## Exercice Pratique

**Énoncé** : Crée un synthétiseur simple dans un fichier `synth-ui.dsp` avec les caractéristiques suivantes :

1. Un groupe **"Oscillateur"** contenant :
   - Un `nentry` pour choisir la forme d'onde (1 = sinus, 2 = dent de scie, 3 = carré), valeur initiale 1, pas de 1
   - Un `hslider` pour la fréquence en Hz avec échelle logarithmique, plage 20-20000, valeur initiale 440

2. Un groupe **"Amplitude"** contenant :
   - Un `hslider` pour le volume en dB (affiché avec l'unité), style knob, plage -96 à 0, valeur initiale -12, pas de 0.1
   - Un `button` "Mute" pour couper le son
   - Un `hbargraph` "VU-mètre" pour visualiser le niveau de sortie, plage -1 à 1

3. Les deux groupes doivent être dans un groupe principal **"Mon Synthé"**

**Indications** :

- Utilise `os.osc(freq)` pour le sinus, `os.sawtooth(freq)` pour la dent de scie, `os.square(freq)` pour le carré
- Pour sélectionner la forme d'onde en fonction du `nentry`, utilise `select3` : `select3(choix - 1, signal1, signal2, signal3)` (on soustrait 1 car `select3` attend un index commencant à 0)
- Pour convertir des dB en amplitude linéaire, utilise `ba.db2linear(valeur_db)`
- Pour le mute avec un button, multiplie par `(1 - button("Mute"))` (quand Mute est pressé, le signal est multiplié par 0)

**Résultat attendu** : un groupe "Mon Synthé" contenant "Oscillateur" (nentry Forme + slider Fréquence en Hz logarithmique) et "Amplitude" (knob Volume en dB + bouton Mute + VU-mètre).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
// synth-ui.dsp - Synthétiseur avec interface UI complète
import("stdfaust.lib");

process = vgroup("Mon Synthé",
    // Groupe Oscillateur : sélection de forme d'onde + fréquence
    hgroup("Oscillateur",
        // select3(index, s1, s2, s3) - on soustrait 1 car index commence à 0
        select3(
            nentry("Forme [tooltip:1=Sinus 2=Dent de scie 3=Carré]",
                1, 1, 3, 1) - 1,
            os.osc(freq),        // Index 0 : sinus
            os.sawtooth(freq),   // Index 1 : dent de scie
            os.square(freq)      // Index 2 : carré
        )
    )
    // Groupe Amplitude : volume en dB + mute
    * hgroup("Amplitude",
        // ba.db2linear convertit dB en amplitude linéaire
        ba.db2linear(
            hslider("Volume [style:knob] [unit:dB]
                [tooltip:Volume de sortie en décibels]",
                -12, -96, 0, 0.1)
        )
        * (1 - button("Mute [tooltip:Maintenir pour couper le son]"))
    )
    // VU-mètre en sortie
    : hbargraph("VU-mètre [tooltip:Niveau instantané du signal]", -1, 1)
)
with {
    // Fréquence partagée par les 3 oscillateurs, dans le groupe Oscillateur
    freq = hgroup("Oscillateur",
        hslider("Fréquence [unit:Hz] [scale:log]
            [tooltip:Fréquence fondamentale en Hertz]",
            440, 20, 20000, 1)
    );
};
```

**Explications de la solution** :

1. **Structure des groupes** : `vgroup("Mon Synthé", ...)` contient deux `hgroup` ("Oscillateur" et "Amplitude") côte à côte.
2. **Sélection de forme d'onde** : `select3(index, s1, s2, s3)` choisit entre trois signaux. Le `nentry` retourne 1, 2 ou 3, et on soustrait 1 pour obtenir l'index 0, 1 ou 2.
3. **Conversion dB** : `ba.db2linear(-12)` convertit -12 dB en amplitude linéaire (environ 0.25).
4. **Fréquence partagée** : Définie dans `with { ... }` et rattachée au groupe "Oscillateur" pour que le slider apparaisse au bon endroit.
5. **Chaîne du signal** : `oscillateur * volume * (1-mute) : bargraph`.

Compile et vérifie :

```bash
faust2jaqt synth-ui.dsp
./synth-ui
```

---

## Navigation

← Fiche précédente : **[02 - Les cinq opérateurs de composition](02-cinq-operateurs-composition.md)**

→ Fiche suivante : **[04 - Mémoire et délais](04-memoire-delais.md)**
