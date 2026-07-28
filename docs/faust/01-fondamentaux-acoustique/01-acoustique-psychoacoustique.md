---
tags:
  - Faust
  - Débutant
  - Concept
description: "Acoustique et psychoacoustique - ondes sonores, fréquence, amplitude, timbre et perception auditive"
estimated_time: "65 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 1 - Fondamentaux acoustique"
---

# 01 - Acoustique et psychoacoustique

> **En bref** : À la fin de cette fiche, tu sauras décrire les propriétés physiques du son, expliquer le spectre harmonique et comprendre comment l'oreille humaine perçoit les fréquences et les intensités. Lecture estimée : 65 min.


## Prérequis

- Aucune connaissance préalable d'acoustique n'est requise (tout est expliqué ci-dessous)
- Savoir utiliser une calculatrice scientifique (fonctions puissance et logarithme)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire les propriétés physiques du son, expliquer le spectre harmonique et comprendre comment l'oreille humaine perçoit les fréquences et les intensités.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une onde sonore ?

**Définition** : Une onde sonore est une vibration mécanique qui se propage dans un milieu matériel (air, eau, métal) sous forme de variations de pression. Sans milieu de propagation, il n'y a pas de son (le vide spatial est silencieux).

**Le problème que la compréhension des ondes sonores résout** :

Sans comprendre les ondes sonores, voici les problèmes rencontrés :

1. **Impossible de programmer de l'audio** : le traitement du signal manipule des représentations numériques d'ondes sonores. Sans comprendre ce qu'on manipule, le code n'a aucun sens.
2. **Pas de diagnostic** : quand un son produit par un programme est "faux" ou "bizarre", impossible de comprendre pourquoi sans connaître la physique sous-jacente.
3. **Pas de créativité** : concevoir un nouveau son (synthèse) nécessite de savoir comment les sons sont construits physiquement.

**Comment la compréhension des ondes sonores résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Impossible de programmer de l'audio | Chaque échantillon numérique correspond à une valeur de pression à un instant donné : le lien entre code et physique devient concret |
| Pas de diagnostic | Connaître les propriétés d'une onde (fréquence, amplitude, phase) permet d'identifier ce qui ne va pas dans un signal |
| Pas de créativité | Savoir qu'un son est une somme d'ondes simples ouvre la porte à la synthèse additive, soustractive, FM, etc. |

**Analogie concrète** : Imagine que tu jettes un caillou dans un lac. Des cercles concentriques se forment à la surface et s'éloignent du point d'impact. Le son fonctionne de la même manière, mais en trois dimensions : la source vibrante (un haut-parleur, une corde de guitare) pousse les molécules d'air, qui poussent les molécules voisines, créant une vague de compression qui se propage jusqu'à ton oreille.

**Ce qu'une onde sonore n'est PAS** :

- Une onde sonore n'est pas un déplacement de matière. Les molécules d'air ne voyagent pas de la source à ton oreille. Elles oscillent sur place et transmettent l'énergie de proche en proche (comme une file de dominos).
- Une onde sonore n'est pas une onde électromagnétique. La lumière, les ondes radio et les micro-ondes se propagent dans le vide. Le son a besoin d'un milieu matériel.

### Les trois propriétés fondamentales d'une onde sonore

Chaque onde sonore est caractérisée par trois propriétés mesurables : la fréquence, l'amplitude et la phase.

#### Fréquence (Hz)

**Définition** : La fréquence est le nombre de cycles complets d'oscillation par seconde. Elle se mesure en Hertz (Hz). Un cycle complet correspond à une compression suivie d'une raréfaction de l'air.

- 1 Hz = 1 cycle par seconde
- 440 Hz = 440 cycles par seconde (note La4, la note de référence pour accorder les instruments)
- 20 000 Hz = 20 000 cycles par seconde (limite haute de l'audition humaine)

**La période** est l'inverse de la fréquence. Elle représente la durée d'un cycle complet :

$$T = \frac{1}{f}$$

Exemples :

- $f = 440 \text{ Hz} \rightarrow T = \frac{1}{440} = 0{,}00227 \text{ s} \approx 2{,}27 \text{ ms}$
- $f = 100 \text{ Hz} \rightarrow T = \frac{1}{100} = 0{,}01 \text{ s} = 10 \text{ ms}$
- $f = 1000 \text{ Hz} \rightarrow T = \frac{1}{1000} = 0{,}001 \text{ s} = 1 \text{ ms}$

**Relation avec la perception** : la fréquence détermine la **hauteur** du son (grave ou aigu).

| Fréquence | Perception |
| --------- | ---------- |
| 20-200 Hz | Sons graves (basse, contrebasse) |
| 200-2000 Hz | Sons médiums (voix humaine, guitare) |
| 2000-20 000 Hz | Sons aigus (cymbales, sifflement) |

**Longueur d'onde** : la distance parcourue par l'onde pendant un cycle complet.

$$\lambda = \frac{v}{f}$$

où :

- $\lambda$ (lambda) = longueur d'onde en mètres
- $v$ = vitesse du son $\approx 343$ m/s dans l'air à 20°C
- $f$ = fréquence en Hz

Exemples :

- $f = 20 \text{ Hz} \rightarrow \lambda = \frac{343}{20} = 17{,}15 \text{ m}$ (onde très longue)
- $f = 440 \text{ Hz} \rightarrow \lambda = \frac{343}{440} = 0{,}78 \text{ m}$ (environ 78 cm)
- $f = 20000 \text{ Hz} \rightarrow \lambda = \frac{343}{20000} = 0{,}017 \text{ m}$ (environ 1,7 cm)

#### Amplitude (dB)

**Définition** : L'amplitude est la valeur maximale de la variation de pression par rapport à la pression atmosphérique au repos. Elle détermine le **volume** perçu du son (fort ou faible).

**L'échelle des décibels (dB SPL)** : l'oreille humaine perçoit une gamme énorme de pressions sonores (rapport de 1 à 1 000 000). Pour rendre ces valeurs utilisables, on utilise une échelle logarithmique : le décibel (dB SPL, Sound Pressure Level).

$$L = 20 \times \log_{10}\!\left(\frac{p}{p_0}\right)$$

où :

- $L$ = niveau sonore en dB SPL
- $p$ = pression acoustique mesurée (en Pascals)
- $p_0$ = pression de référence = 20 $\mu$Pa (seuil d'audition à 1 kHz)

**Niveaux de référence courants** :

| Niveau (dB SPL) | Source sonore | Perception |
| ---------------- | ------------- | ---------- |
| 0 | Seuil d'audition | Silence perçu |
| 30 | Chuchotement | Très faible |
| 60 | Conversation normale | Modéré |
| 85 | Trafic urbain dense | Fort (risque si prolongé) |
| 100 | Concert rock | Très fort |
| 120 | Seuil de douleur | Dangereux |
| 140 | Avion au décollage | Lésions immédiates |

**Propriété importante** : une augmentation de 6 dB correspond à un doublement de la pression sonore. Une augmentation de 10 dB est perçue par l'oreille comme un doublement du volume.

Exemples de calcul :

- Un son à 60 dB double en pression : $60 + 6 = 66$ dB
- Un son perçu deux fois plus fort qu'un son à 60 dB : environ 70 dB

#### Phase

**Définition** : La phase indique la position de l'onde dans son cycle à un instant donné. Elle se mesure en degrés (0° à 360°) ou en radians (0 à $2\pi$).

**Le problème que la phase résout** :

Quand deux ondes de même fréquence se rencontrent, leur relation de phase détermine le résultat :

| Relation de phase | Résultat | Description |
| ----------------- | -------- | ----------- |
| En phase (0°) | Interférence constructive | Les amplitudes s'additionnent : le son est plus fort |
| En opposition de phase (180°) | Interférence destructive | Les amplitudes s'annulent : silence |
| Phase intermédiaire | Interférence partielle | Le résultat dépend du décalage exact |

**Analogie concrète** : Imagine deux personnes qui poussent une balançoire. Si elles poussent au même moment (en phase), la balançoire va très haut. Si l'une pousse pendant que l'autre tire (opposition de phase), la balançoire ne bouge pas.

**En traitement du signal** : la phase est essentielle pour les effets audio (flanger, phaser, chorus) et pour éviter les problèmes d'annulation lors du mixage de plusieurs microphones.

---

### Qu'est-ce que le spectre harmonique ?

**Définition** : Le spectre harmonique est la décomposition d'un son en une série de fréquences individuelles (sinusoïdes). Tout son périodique peut être décomposé en une somme de sinusoïdes dont les fréquences sont des multiples entiers d'une fréquence de base.

**Le problème que le spectre harmonique résout** :

Sans la notion de spectre harmonique, voici les problèmes rencontrés :

1. **Sons indiscernables** : impossible d'expliquer pourquoi un piano et une flûte jouant la même note sonnent différemment
2. **Synthèse impossible** : impossible de recréer artificiellement le son d'un instrument
3. **Filtrage aveugle** : impossible de cibler une composante spécifique d'un son sans affecter les autres

**Comment le spectre harmonique résout ces problèmes** :

| Problème | Solution apportée par le spectre harmonique |
| -------- | -------------------------------------------- |
| Sons indiscernables | Chaque instrument a une "recette" unique d'harmoniques qui le caractérise |
| Synthèse impossible | En additionnant des sinusoïdes dans les bonnes proportions, on peut recréer n'importe quel son |
| Filtrage aveugle | On peut cibler des bandes de fréquences précises dans le spectre |

**Analogie concrète** : Le spectre harmonique est comme la recette d'un gâteau. Le gâteau fini (le son) est composé d'ingrédients (les sinusoïdes). Deux gâteaux peuvent avoir la même taille (même fréquence fondamentale) mais des goûts différents (timbres différents) parce que leurs recettes utilisent des proportions différentes d'ingrédients.

#### Fondamentale, harmoniques et partiels

**Fondamentale ($f_1$)** : la fréquence la plus basse d'un son périodique. C'est elle qui détermine la note perçue.

**Harmoniques** : les fréquences multiples entiers de la fondamentale.

Pour une fondamentale $f_1 = 100$ Hz :

- Harmonique 1 (fondamentale) : $f_1 = 100$ Hz
- Harmonique 2 : $f_2 = 200$ Hz
- Harmonique 3 : $f_3 = 300$ Hz
- Harmonique 4 : $f_4 = 400$ Hz
- Harmonique 5 : $f_5 = 500$ Hz
- ...
- Harmonique n : $f_n = n \times 100$ Hz

**Partiels** : terme plus général qui désigne toute composante fréquentielle d'un son, même si elle n'est pas un multiple entier de la fondamentale. Les sons de cloches ou de cymbales contiennent des partiels non harmoniques (inharmoniques).

| Terme | Définition | Exemple |
| ----- | ---------- | ------- |
| Fondamentale | Fréquence la plus basse ($f_1$) | 440 Hz pour La4 |
| Harmonique | Multiple entier de $f_1$ | 880, 1320, 1760 Hz |
| Partiel | Toute composante fréquentielle | 440, 880, 1127, 1760 Hz (cloche) |

#### Contenu harmonique de quelques formes d'onde

En synthèse sonore, on utilise des formes d'onde de base. Chacune a un contenu harmonique caractéristique :

| Forme d'onde | Harmoniques présentes | Amplitude relative | Son |
| ------------ | --------------------- | ------------------- | --- |
| Sinusoïde | Fondamentale seule | 1 | Pur, doux, "flûteux" |
| Carrée (square) | Impaires uniquement (1, 3, 5, 7...) | $1/n$ | Creux, "boisé" |
| Dents de scie (sawtooth) | Toutes (1, 2, 3, 4...) | $1/n$ | Riche, brillant, "cuivré" |
| Triangle | Impaires uniquement (1, 3, 5, 7...) | $1/n^2$ | Doux, entre sinusoïde et carrée |

```text
Onde carrée à 100 Hz - harmoniques impaires uniquement :
  Harm. n° :  1     3     5     7     9     11    13
  Fréq.    :  100   300   500   700   900   1100  1300 Hz
  Ampl.    :  1.00  0.33  0.20  0.14  0.11  0.09  0.08

Onde en dents de scie à 100 Hz - toutes les harmoniques :
  Harm. n° :  1     2     3     4     5     6     7
  Fréq.    :  100   200   300   400   500   600   700  Hz
  Ampl.    :  1.00  0.50  0.33  0.25  0.20  0.17  0.14
```

---

### Qu'est-ce que le timbre ?

**Définition** : Le timbre est la qualité sonore qui permet de distinguer deux sons de même hauteur (fréquence) et même volume (amplitude) joués par deux instruments différents. Le timbre est déterminé par le contenu harmonique du son et par l'évolution de ce contenu dans le temps.

**Le problème que la notion de timbre résout** :

Sans comprendre le timbre, voici les problèmes rencontrés :

1. **Confusion entre hauteur et identité** : deux instruments jouent la même note, mais on ne peut pas expliquer pourquoi ils sonnent différemment
2. **Synthèse plate** : les sons générés artificiellement sont "morts" et ne ressemblent pas à de vrais instruments
3. **Design sonore limité** : impossible de créer des sons nouveaux et intéressants

**Comment la notion de timbre résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Confusion entre hauteur et identité | Le timbre est la "signature" unique de chaque source sonore |
| Synthèse plate | Le timbre évolue dans le temps (attaque, sustain, relâchement) : modéliser cette évolution rend le son vivant |
| Design sonore limité | En manipulant les harmoniques et leur évolution, on peut créer des timbres inédits |

**Les composantes du timbre** :

1. **Contenu spectral** : quelles harmoniques sont présentes et en quelles proportions
2. **Enveloppe spectrale** : comment les proportions des harmoniques changent au cours du temps
3. **Transitoires** : les bruits très courts au début du son (attaque du marteau sur la corde du piano, souffle initial de la flûte)
4. **Enveloppe d'amplitude** : comment le volume global évolue dans le temps (ADSR : Attack, Decay, Sustain, Release)

```text
Exemple : pourquoi un piano et une flûte jouant La4 (440 Hz) sonnent différemment

Piano La4 :
- Attaque percussive rapide (marteau qui frappe la corde)
- Beaucoup d'harmoniques au début, qui diminuent progressivement
- Sustain long qui décroît lentement
- Harmoniques : 440, 880, 1320, 1760, 2200 Hz (amplitudes décroissantes)

Flûte La4 :
- Attaque douce avec léger souffle
- Peu d'harmoniques (son presque sinusoïdal)
- Sustain stable tant que le musicien souffle
- Harmoniques : 440 Hz dominant, 880 Hz très faible, peu au-delà
```

---

### Qu'est-ce que la psychoacoustique ?

**Définition** : La psychoacoustique est la science qui étudie comment le cerveau humain perçoit et interprète les sons. Elle révèle que notre perception ne correspond pas directement aux mesures physiques : l'oreille n'est ni linéaire, ni uniforme.

**Le problème que la psychoacoustique résout** :

Sans psychoacoustique, voici les problèmes rencontrés :

1. **Mix déséquilibré** : on ajuste les niveaux selon les valeurs physiques, mais le résultat semble déséquilibré à l'oreille
2. **Compression audio inefficace** : on stocke des informations sonores que l'oreille ne peut pas percevoir
3. **Design sonore non intuitif** : les paramètres de synthèse ne correspondent pas à la perception

**Comment la psychoacoustique résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Mix déséquilibré | Les courbes d'isosonie permettent de compenser la sensibilité variable de l'oreille selon les fréquences |
| Compression audio inefficace | Le masquage fréquentiel permet de supprimer les composantes inaudibles (principe du MP3) |
| Design sonore non intuitif | On utilise des échelles perceptuelles (logarithmiques) plutôt que linéaires |

**Analogie concrète** : L'oreille fonctionne comme un appareil photo automatique : elle ajuste la sensibilité selon les conditions, ignore certains détails (masquage) et perçoit les changements de façon non linéaire (un flash semble beaucoup plus lumineux dans une pièce sombre que dans une pièce éclairée).

#### Courbes de Fletcher-Munson (courbes d'isosonie)

Les courbes de Fletcher-Munson (ou courbes isosoniques, norme ISO 226) montrent que la sensibilité de l'oreille humaine varie selon la fréquence.

**Constats principaux** :

1. **L'oreille est plus sensible entre 2 kHz et 5 kHz** : c'est la zone de fréquences de la voix humaine. L'évolution a rendu nos oreilles particulièrement sensibles à cette plage.
2. **Les basses fréquences nécessitent plus de puissance** : un son à 50 Hz doit être beaucoup plus fort qu'un son à 3 kHz pour être perçu au même volume.
3. **À faible volume, les basses et les aigus disparaissent** : c'est pour cela que la musique semble "plate" quand on baisse le volume.

```text
Courbe d'isosonie à 40 phones (volume modéré) :

Fréquence :   50 Hz    200 Hz   1 kHz    3,5 kHz   10 kHz
dB SPL req. : ~60      ~45      40       ~35       ~47

Conclusion : pour qu'un son à 50 Hz paraisse aussi fort qu'à 1 kHz,
il faut le jouer 20 dB plus fort.
```

**Le phone** : unité de sonie (intensité perçue). Par définition, 1 phone = 1 dB SPL à 1 kHz. À d'autres fréquences, le nombre de phones peut différer du nombre de dB SPL.

#### Masquage fréquentiel

**Définition** : Le masquage fréquentiel est le phénomène par lequel un son fort rend inaudible un son faible de fréquence voisine.

**Types de masquage** :

| Type | Description | Exemple |
| ---- | ----------- | ------- |
| Masquage simultané | Un son fort masque un son faible présent au même instant | Une grosse caisse à 80 dB masque une basse à 60 dB si leurs fréquences sont proches |
| Masquage temporel (pré/post) | Un son fort masque les sons faibles qui le précèdent ou le suivent de quelques millisecondes | Le transitoire d'une caisse claire masque les sons faibles juste avant et après |

**Application en audio numérique** : le format MP3 et les codecs similaires exploitent le masquage pour supprimer les composantes fréquentielles que l'oreille ne peut pas percevoir, réduisant ainsi la taille du fichier sans perte audible significative.

#### Perception logarithmique des fréquences

**Définition** : L'oreille humaine perçoit les fréquences de façon logarithmique, pas linéaire. Cela signifie que le rapport entre deux fréquences compte plus que leur différence absolue.

**Conséquence directe** : un intervalle d'une octave correspond toujours à un doublement de fréquence, quelle que soit la fréquence de départ.

```text
Octaves à partir de La (A) :

La1 :   55 Hz
La2 :  110 Hz    (×2)    Écart : 55 Hz
La3 :  220 Hz    (×2)    Écart : 110 Hz
La4 :  440 Hz    (×2)    Écart : 220 Hz
La5 :  880 Hz    (×2)    Écart : 440 Hz
La6 : 1760 Hz    (×2)    Écart : 880 Hz
La7 : 3520 Hz    (×2)    Écart : 1760 Hz

Observation : l'écart en Hz double à chaque octave, mais chaque intervalle
est perçu comme "le même saut" par l'oreille.
```

**Application en traitement du signal** : les interfaces de contrôle de fréquence (potentiomètres de filtres, EQ) utilisent des échelles logarithmiques pour que la rotation du bouton corresponde à la perception auditive.

---

### Plage audible humaine

**Définition** : La plage audible humaine s'étend de 20 Hz à 20 000 Hz (20 kHz) en fréquence, et de 0 dB SPL (seuil d'audition) à 120-140 dB SPL (seuil de douleur) en amplitude.

```text
Plage audible humaine :

Fréquence :
  20 Hz ◄────────────────────────────────────────► 20 000 Hz
  Infrasons │     Audible par l'humain        │ Ultrasons
            │                                  │
  Graves     Médiums          Aigus
  20-200 Hz  200-2000 Hz      2000-20000 Hz

Amplitude :
  0 dB SPL ◄─────────────────────────────────► 140 dB SPL
  Seuil        Confortable    Fort     Douleur
  d'audition   (30-60 dB)     (80-100) (>120 dB)
```

**Facteurs qui réduisent cette plage** :

| Facteur | Effet |
| ------- | ----- |
| Âge | Perte progressive des hautes fréquences (presbyacousie) : à 50 ans, la limite haute descend souvent vers 12-14 kHz |
| Exposition au bruit | Dommages irréversibles aux cellules ciliées de l'oreille interne |
| Pathologies | Acouphènes, otites chroniques, etc. |

---

### Conversion MIDI vers Hz

**Définition** : Le protocole MIDI (Musical Instrument Digital Interface) représente les notes par des nombres entiers de 0 à 127. La formule de conversion permet de passer d'un numéro de note MIDI à sa fréquence en Hz, et inversement.

**La formule MIDI vers Hz** :

$$f = 440 \times 2^{(n - 69) / 12}$$

où :

- $f$ = fréquence en Hz
- $n$ = numéro de note MIDI (0 à 127)
- 440 = fréquence de référence (La4)
- 69 = numéro MIDI de La4
- 12 = nombre de demi-tons dans une octave

**La formule inverse (Hz vers MIDI)** :

$$n = 69 + 12 \times \log_2\!\left(\frac{f}{440}\right)$$

Qui peut aussi s'écrire :

$$n = 69 + 12 \times \frac{\ln(f / 440)}{\ln(2)}$$

**Notes de référence courantes** :

| Note | Numéro MIDI | Fréquence (Hz) |
| ---- | ----------- | --------------- |
| Do-1 (C-1) | 0 | 8,18 |
| Do2 (C2) | 36 | 65,41 |
| Do3 (C3, middle C) | 60 | 261,63 |
| La4 (A4) | 69 | 440,00 |
| Do5 (C5) | 72 | 523,25 |
| Sol9 (G9) | 127 | 12 543,85 |

**Pourquoi $2^{1/12}$** : l'octave est divisée en 12 demi-tons égaux (tempérament égal). Puisqu'une octave = doublement de fréquence, chaque demi-ton correspond à une multiplication par $2^{1/12} \approx 1{,}05946$. Vérification : $(2^{1/12})^{12} = 2^1 = 2$ (une octave).

---

## Étapes Pratiques

### Étape 1 : Calculer la fréquence d'une note MIDI

Calcule la fréquence de la note MIDI 60 (Do3, middle C).

Applique la formule :

$$f = 440 \times 2^{(n - 69) / 12}$$

$n = 60$

$$f = 440 \times 2^{(60 - 69) / 12}$$

$$f = 440 \times 2^{-9/12}$$

$$f = 440 \times 2^{-0{,}75}$$

$$f = 440 \times 0{,}5946$$

$$f = 261{,}63 \text{ Hz}$$

**Résultat attendu** : la note MIDI 60 (Do3) correspond à 261,63 Hz.

---

### Étape 2 : Calculer le numéro MIDI d'une fréquence

Trouve le numéro MIDI correspondant à 330 Hz.

$$n = 69 + 12 \times \log_2\!\left(\frac{f}{440}\right)$$

$f = 330$ Hz

$$n = 69 + 12 \times \log_2\!\left(\frac{330}{440}\right)$$

$$n = 69 + 12 \times \log_2(0{,}75)$$

$$n = 69 + 12 \times (-0{,}415)$$

$$n = 69 + (-4{,}98)$$

$$n = 64{,}02$$

$$n \approx 64$$

**Résultat attendu** : 330 Hz correspond au numéro MIDI 64 (Mi4 / E4). Vérification : $440 \times 2^{-5/12} = 329{,}63$ Hz. La légère différence (330 vs 329,63) indique que 330 Hz est très proche de Mi4 mais pas exactement tempéré.

---

### Étape 3 : Calculer les fréquences d'une octave complète

Calcule les fréquences des 12 demi-tons de l'octave commençant à La4 (440 Hz).

Pour chaque demi-ton, multiplie par $2^{1/12} \approx 1{,}05946$ :

```text
Note      MIDI   Calcul                          Fréquence (Hz)
──────────────────────────────────────────────────────────────────
La4  (A4)   69   440,00 × 1,05946^0  = 440,00     440,00
La#4 (A#4)  70   440,00 × 1,05946^1  = 466,16     466,16
Si4  (B4)   71   440,00 × 1,05946^2  = 493,88     493,88
Do5  (C5)   72   440,00 × 1,05946^3  = 523,25     523,25
Do#5 (C#5)  73   440,00 × 1,05946^4  = 554,37     554,37
Ré5  (D5)   74   440,00 × 1,05946^5  = 587,33     587,33
Ré#5 (D#5)  75   440,00 × 1,05946^6  = 622,25     622,25
Mi5  (E5)   76   440,00 × 1,05946^7  = 659,26     659,26
Fa5  (F5)   77   440,00 × 1,05946^8  = 698,46     698,46
Fa#5 (F#5)  78   440,00 × 1,05946^9  = 739,99     739,99
Sol5 (G5)   79   440,00 × 1,05946^10 = 783,99     783,99
Sol#5(G#5)  80   440,00 × 1,05946^11 = 830,61     830,61
La5  (A5)   81   440,00 × 1,05946^12 = 880,00     880,00
```

**Résultat attendu** : La5 (880 Hz) est exactement le double de La4 (440 Hz), ce qui confirme que 12 demi-tons = 1 octave.

---

### Étape 4 : Calculer les harmoniques d'une note

Calcule les 8 premières harmoniques de La2 (110 Hz) et identifie les notes correspondantes.

```text
Harmonique   Fréquence   Calcul        Note la plus proche   Intervalle
──────────────────────────────────────────────────────────────────────────
1 (fond.)    110 Hz      110 × 1       La2  (A2)             Fondamentale
2            220 Hz      110 × 2       La3  (A3)             Octave
3            330 Hz      110 × 3       Mi4  (E4)             Quinte + octave
4            440 Hz      110 × 4       La4  (A4)             2 octaves
5            550 Hz      110 × 5       Do#5 (C#5) ≈          Tierce majeure + 2 oct.
6            660 Hz      110 × 6       Mi5  (E5)             Quinte + 2 octaves
7            770 Hz      110 × 7       ~Sol5 (entre Sol et Sol#)  Septième mineure ≈
8            880 Hz      110 × 8       La5  (A5)             3 octaves
```

**Résultat attendu** : les harmoniques 2, 4 et 8 sont des octaves de la fondamentale. L'harmonique 3 correspond à une quinte (7 demi-tons), l'harmonique 5 à une tierce majeure (4 demi-tons). L'harmonique 7 ne correspond pas exactement à une note du tempérament égal. La série harmonique est le fondement de l'harmonie musicale occidentale.

---

### Étape 5 : Analyser l'effet des courbes de Fletcher-Munson

Analyse la perception de trois sons de même pression sonore (60 dB SPL) mais de fréquences différentes.

```text
Trois sons, tous à 60 dB SPL :

Son A (100 Hz)  → Perception ≈ 50 phones → paraît MOINS fort
Son B (1000 Hz) → Perception = 60 phones → référence
Son C (3500 Hz) → Perception ≈ 65 phones → paraît PLUS fort

Conclusion : trois sons de même puissance physique sont perçus
à des volumes différents selon leur fréquence.
```

**Résultat attendu** : le son à 3500 Hz paraît le plus fort, celui à 100 Hz le plus faible, celui à 1000 Hz entre les deux. C'est pour cela que les ingénieurs du son utilisent des EQ correctifs et que les enceintes intègrent parfois un bouton "loudness" pour booster basses et aigus à faible volume.

---

### Étape 6 : Vérifier la perception logarithmique

Compare deux intervalles de fréquence de même taille absolue (100 Hz) à deux endroits du spectre.

Intervalle 1 : $100 \rightarrow 200$ Hz = rapport $2:1$ = une octave (12 demi-tons)

Intervalle 2 : $5000 \rightarrow 5100$ Hz = rapport $1{,}02:1$ = 0,34 demi-ton

100 Hz d'écart dans les graves = une octave entière. 100 Hz d'écart dans les aigus = un intervalle quasi imperceptible.

C'est pourquoi les échelles de fréquence en audio sont TOUJOURS logarithmiques.

**Résultat attendu** : l'intervalle 100-200 Hz couvre une octave (rapport 2:1), l'intervalle 5000-5100 Hz couvre environ 1/3 de demi-ton (rapport 1,02:1). La perception des fréquences est logarithmique : ce sont les rapports qui comptent, pas les différences absolues.

---

## Commandes Utiles

| Formule | Action |
| ------- | ------ |
| $f = 440 \times 2^{(n-69)/12}$ | Convertir un numéro MIDI en fréquence Hz |
| $n = 69 + 12 \times \log_2(f/440)$ | Convertir une fréquence Hz en numéro MIDI |
| $T = 1 / f$ | Calculer la période à partir de la fréquence |
| $\lambda = 343 / f$ | Calculer la longueur d'onde dans l'air (20°C) |
| $L = 20 \times \log_{10}(p / p_0)$ | Calculer le niveau en dB SPL |
| $f_n = n \times f_1$ | Calculer la fréquence de l'harmonique n |
| $f_{\text{octave}} = f \times 2$ | Monter d'une octave |
| $f_{\text{demiton}} = f \times 2^{1/12}$ | Monter d'un demi-ton |

---

## Pièges Fréquents

### Piège 1 : Confondre fréquence et volume

**Problème** : Penser qu'un son aigu est forcément plus fort qu'un son grave. La fréquence (Hz) détermine la hauteur (grave/aigu). L'amplitude (dB) détermine le volume (fort/faible). Ce sont deux propriétés indépendantes.

**Solution** : Un son très grave (50 Hz) peut être très fort (100 dB), et un son très aigu (15 kHz) peut être très faible (20 dB). Fréquence et amplitude sont deux axes distincts.

---

### Piège 2 : Utiliser des échelles linéaires pour les fréquences

**Problème** : Placer les fréquences sur une échelle linéaire (0, 1000, 2000, 3000...) donne une répartition qui ne correspond pas à la perception auditive. Sur une telle échelle, l'intervalle 100-200 Hz (une octave) occupe le même espace que l'intervalle 1000-1100 Hz (un tiers de demi-ton).

**Solution** : Toujours utiliser une échelle logarithmique pour les fréquences. Sur une échelle log, chaque octave occupe le même espace visuel, ce qui correspond à la perception.

```text
Échelle linéaire (incorrecte pour l'audio) :
0     2000    4000    6000    8000    10000 Hz
|------|-------|-------|-------|-------|

Échelle logarithmique (correcte pour l'audio) :
20  50 100  200  500  1k   2k   5k  10k  20k Hz
|---|---|-----|-----|-----|-----|-----|-----|-----|
 ← Chaque segment représente environ une octave →
```

---

### Piège 3 : Croire que +6 dB = "deux fois plus fort"

**Problème** : Confondre doublement de pression et doublement de volume perçu. +6 dB = doublement de la pression sonore. Mais l'oreille ne perçoit pas un doublement de volume à +6 dB.

**Solution** : Pour doubler le volume **perçu**, il faut environ +10 dB. C'est une conséquence de la perception logarithmique de l'intensité.

- $+6 \text{ dB}$ = pression $\times 2$ - volume perçu légèrement plus fort
- $+10 \text{ dB}$ = pression $\times 3{,}16$ - volume perçu environ $\times 2$
- $+20 \text{ dB}$ = pression $\times 10$ - volume perçu environ $\times 4$

---

### Piège 4 : Oublier que les harmoniques sont des multiples ENTIERS

**Problème** : Penser que toutes les composantes fréquentielles d'un son sont des harmoniques. Les harmoniques sont strictement des multiples entiers de la fondamentale ($2f$, $3f$, $4f$...). Les partiels non entiers (comme dans une cloche ou un gong) sont des partiels inharmoniques.

**Solution** : Utiliser le terme "harmonique" uniquement pour les multiples entiers. Utiliser "partiel" comme terme générique pour toute composante fréquentielle.

---

### Piège 5 : Négliger la phase dans les opérations multi-signaux

**Problème** : Mixer deux signaux identiques sans vérifier leur phase peut résulter en un silence (opposition de phase) au lieu du doublement attendu.

**Solution** : Toujours vérifier l'alignement de phase lors du mixage. En synthèse, être conscient que deux oscillateurs de même fréquence mais en opposition de phase s'annulent.

Signal A : $\sin(2\pi \times 440 \times t)$

Signal B : $\sin(2\pi \times 440 \times t)$ - $A + B = 2 \times \sin(2\pi \times 440 \times t)$ (addition constructive)

Signal A : $\sin(2\pi \times 440 \times t)$

Signal C : $\sin(2\pi \times 440 \times t + \pi)$ - $A + C = 0$ (annulation totale)

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est une onde sonore et comment elle se propage
- [ ] Je connais les trois propriétés fondamentales d'une onde : fréquence, amplitude, phase
- [ ] Je sais calculer une période à partir d'une fréquence et inversement
- [ ] Je sais expliquer la différence entre fondamentale, harmoniques et partiels
- [ ] Je peux décrire le spectre harmonique d'une onde carrée et d'une onde en dents de scie
- [ ] Je sais ce qu'est le timbre et quels facteurs le composent
- [ ] Je peux expliquer les courbes de Fletcher-Munson en termes simples
- [ ] Je sais ce qu'est le masquage fréquentiel et son application (MP3)
- [ ] Je comprends pourquoi la perception des fréquences est logarithmique
- [ ] Je sais convertir un numéro MIDI en fréquence Hz avec la formule
- [ ] Je sais convertir une fréquence Hz en numéro MIDI avec la formule inverse
- [ ] Je connais la plage audible humaine (20 Hz - 20 kHz)

---

## Exercice Pratique

**Énoncé** : Calcule les fréquences des 12 notes de la gamme chromatique à partir de Do3 (MIDI 60) jusqu'à Do4 (MIDI 72). Ensuite, pour chacune des 4 premières notes (Do3, Do#3, Ré3, Ré#3), calcule les 4 premières harmoniques et dessine sur papier un spectre harmonique simplifié (axe horizontal = fréquence, axe vertical = amplitude relative, en supposant une onde en dents de scie où l'amplitude de l'harmonique n est $1/n$).

**Indications** :

- Utilise la formule : $f = 440 \times 2^{(n - 69) / 12}$
- Pour les harmoniques : $f_k = k \times f_1$ (avec $k = 1, 2, 3, 4$)
- Pour l'amplitude d'une dent de scie : $\text{amplitude}(k) = 1/k$
- Dessine le spectre avec des barres verticales (une barre par harmonique) sur une feuille de papier
- Utilise une échelle logarithmique sur l'axe des fréquences

**Résultat attendu** :

- Un tableau de 13 lignes (Do3 à Do4) avec numéro MIDI et fréquence Hz
- 4 mini-spectres dessinés sur papier, chacun montrant 4 barres verticales
- La fréquence de Do4 doit être exactement le double de Do3

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Partie 1 : Gamme chromatique de Do3 à Do4

```text
Note      MIDI (n)   Calcul : 440 × 2^((n-69)/12)            Fréquence (Hz)
────────────────────────────────────────────────────────────────────────────────
Do3  (C3)    60      440 × 2^((60-69)/12) = 440 × 2^(-0,750)    261,63
Do#3 (C#3)   61      440 × 2^((61-69)/12) = 440 × 2^(-0,667)    277,18
Ré3  (D3)    62      440 × 2^((62-69)/12) = 440 × 2^(-0,583)    293,66
Ré#3 (D#3)   63      440 × 2^((63-69)/12) = 440 × 2^(-0,500)    311,13
Mi3  (E3)    64      440 × 2^((64-69)/12) = 440 × 2^(-0,417)    329,63
Fa3  (F3)    65      440 × 2^((65-69)/12) = 440 × 2^(-0,333)    349,23
Fa#3 (F#3)   66      440 × 2^((66-69)/12) = 440 × 2^(-0,250)    369,99
Sol3 (G3)    67      440 × 2^((67-69)/12) = 440 × 2^(-0,167)    392,00
Sol#3(G#3)   68      440 × 2^((68-69)/12) = 440 × 2^(-0,083)    415,30
La3  (A3)    69      440 × 2^((69-69)/12) = 440 × 2^(0)         440,00
La#3 (A#3)   70      440 × 2^((70-69)/12) = 440 × 2^(0,083)     466,16
Si3  (B3)    71      440 × 2^((71-69)/12) = 440 × 2^(0,167)     493,88
Do4  (C4)    72      440 × 2^((72-69)/12) = 440 × 2^(0,250)     523,25
```

**Vérification** : Do4 (523,25 Hz) / Do3 (261,63 Hz) = 2,000. Le rapport est bien de 2 (une octave).

---

### Partie 2 : Spectres harmoniques (onde en dents de scie)

```text
Spectre en dents de scie - 4 notes, 4 harmoniques chacune :

Do3 (261,63 Hz) :
  Harm.  Fréquence    Ampl.   Barres
  1        261,63     1,000   ████████████████████
  2        523,25     0,500   ██████████
  3        784,88     0,333   ███████
  4       1046,50     0,250   █████

Do#3 (277,18 Hz) :
  1        277,18     1,000   ████████████████████
  2        554,37     0,500   ██████████
  3        831,55     0,333   ███████
  4       1108,73     0,250   █████

Ré3 (293,66 Hz) :
  1        293,66     1,000   ████████████████████
  2        587,33     0,500   ██████████
  3        880,99     0,333   ███████
  4       1173,32     0,250   █████

Ré#3 (311,13 Hz) :
  1        311,13     1,000   ████████████████████
  2        622,25     0,500   ██████████
  3        933,38     0,333   ███████
  4       1244,50     0,250   █████
```

**Observations** :

1. La structure des amplitudes (1, 1/2, 1/3, 1/4) est identique car la forme d'onde est la même.
2. Les fréquences absolues changent, mais les rapports entre harmoniques restent constants.

**Pour le dessin sur papier** : trace un axe horizontal (fréquences de 200 à 1400 Hz, échelle logarithmique) et un axe vertical (amplitude de 0 à 1). Place 4 barres verticales par note. Compare les spectres : même forme, décalée vers la droite quand la fondamentale monte.

---

## Navigation

→ Fiche suivante : **[02 - Audio numérique et théorie du signal](02-audio-numerique-theorie-signal.md)**
