---
tags:
  - Faust
  - Débutant
  - Concept
description: "Audio numérique et théorie du signal - échantillonnage, quantification, FFT et représentation numérique du son"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 1 - Fondamentaux acoustique"
---

# 02 - Audio numérique et théorie du signal

> **En bref** : À la fin de cette fiche, tu sauras expliquer comment le son est converti en données numériques, calculer des fréquences de Nyquist et des latences, et comprendre le rôle de la FFT. Lecture estimée : 60 min.


## Prérequis

- [Fiche 01 - Acoustique et psychoacoustique](01-acoustique-psychoacoustique.md) : ondes sonores, fréquence, amplitude, timbre, spectre harmonique
- Python 3 installé sur ta machine
- NumPy installé (`pip install numpy`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer comment le son est converti en données numériques, calculer des fréquences de Nyquist et des latences, et comprendre le rôle de la FFT.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'échantillonnage ?

**Définition** : L'échantillonnage (sampling) est le processus de mesure d'un signal analogique continu à intervalles réguliers pour le convertir en une série de valeurs discrètes. Chaque mesure s'appelle un **échantillon** (sample). La **fréquence d'échantillonnage** (sample rate) indique combien de mesures sont prises par seconde.

**Le problème que l'échantillonnage résout** :

Sans échantillonnage, voici les problèmes rencontrés :

1. **Impossible de stocker le son** : un signal analogique est continu, il contient une infinité de valeurs entre deux instants. Un ordinateur ne peut pas stocker une infinité de valeurs
2. **Impossible de traiter le son par calcul** : un processeur ne peut effectuer des opérations que sur des nombres. Sans conversion en nombres, aucun traitement numérique n'est possible
3. **Impossible de transmettre le son sans perte** : la copie analogique dégrade le signal à chaque génération. Un fichier numérique se copie sans dégradation

**Comment l'échantillonnage résout ces problèmes** :

| Problème | Solution apportée par l'échantillonnage |
| -------- | --------------------------------------- |
| Impossible de stocker le son | Le son est représenté par une suite finie de nombres stockables sur disque |
| Impossible de traiter par calcul | Chaque échantillon est un nombre sur lequel on peut appliquer des opérations mathématiques |
| Impossible de transmettre sans perte | Les nombres se copient parfaitement, sans dégradation |

**Analogie concrète** : Imagine que tu filmes un cycliste. Si tu prends 1 photo par seconde, tu rates beaucoup de mouvement. Si tu prends 30 photos par seconde, tu obtiens un film fluide. L'échantillonnage audio fonctionne pareil : plus tu prends de mesures par seconde, plus la capture est fidèle.

**Ce que l'échantillonnage n'est PAS** :

- L'échantillonnage n'est pas la quantification. L'échantillonnage décide **quand** mesurer (axe horizontal, le temps). La quantification décide **avec quelle précision** mesurer (axe vertical, l'amplitude). Ce sont deux étapes distinctes de la numérisation.
- L'échantillonnage n'est pas un enregistrement compressé. L'échantillonnage brut (PCM) ne compresse pas les données. La compression (MP3, AAC) est une étape séparée qui intervient après.

Le diagramme suivant résume les trois étapes de la conversion analogique-numérique, de l'onde sonore au signal PCM :

<div class="diagram-design">
<p><a href="../../../diagrams/faust-01-fondamentaux-acoustique-02-audio-numérique-theorie-signal-1.html">Qu&#x27;est-ce que l&#x27;échantillonnage ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/faust-01-fondamentaux-acoustique-02-audio-numérique-theorie-signal-1.html" title="Qu&#x27;est-ce que l&#x27;échantillonnage ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

#### Fréquences d'échantillonnage courantes

| Sample rate | Utilisation |
| ----------- | ----------- |
| 44 100 Hz | CD audio, musique grand public |
| 48 000 Hz | Vidéo, broadcast, production audiovisuelle |
| 96 000 Hz | Production musicale haute qualité |
| 192 000 Hz | Mastering, archivage audiophile |

**Pourquoi 44 100 Hz pour le CD ?** L'oreille humaine entend jusqu'à environ 20 000 Hz. Pour capturer fidèlement un signal de 20 000 Hz, il faut échantillonner à au moins 40 000 Hz (on verra pourquoi avec le théorème de Nyquist-Shannon). Le chiffre 44 100 a été choisi pour des raisons techniques liées aux magnétoscopes utilisés pour les premiers enregistrements numériques.

---

### Qu'est-ce que le théorème de Nyquist-Shannon ?

**Définition** : Le théorème de Nyquist-Shannon affirme qu'un signal analogique peut être parfaitement reconstruit à partir de ses échantillons si et seulement si la fréquence d'échantillonnage est **au moins le double** de la fréquence maximale contenue dans le signal. Cette fréquence limite s'appelle la **fréquence de Nyquist**.

Formule :

$$f_s \geq 2 \times f_{\text{max}}$$

$$f_{\text{Nyquist}} = \frac{f_s}{2}$$

**Le problème que le théorème de Nyquist-Shannon résout** :

Sans ce théorème, voici les problèmes rencontrés :

1. **Choix arbitraire du sample rate** : sans règle, on ne sait pas combien d'échantillons par seconde sont nécessaires. Trop peu : le son est déformé. Trop : gaspillage de mémoire
2. **Apparition de fréquences fantômes (aliasing)** : si le sample rate est trop bas, des fréquences qui n'existaient pas dans le signal original apparaissent dans l'enregistrement numérique
3. **Impossibilité de garantir la fidélité** : sans critère mathématique, impossible de savoir si la numérisation est fidèle

**Comment le théorème de Nyquist-Shannon résout ces problèmes** :

| Problème | Solution apportée par le théorème |
| -------- | --------------------------------- |
| Choix arbitraire du sample rate | La règle est précise : $f_s \geq 2 \times f_{\text{max}}$ |
| Fréquences fantômes (aliasing) | On sait exactement quelle condition évite l'aliasing |
| Impossibilité de garantir la fidélité | Si la condition est respectée, la reconstruction est mathématiquement parfaite |

**Analogie concrète** : Imagine une roue de vélo avec un repère rouge. Tu prends des photos à intervalles réguliers. Si la roue tourne lentement et que tu prends 3 photos/seconde, tu vois clairement le mouvement. Mais si la roue tourne vite (10 tours/seconde), le repère semble tourner en arrière. C'est l'aliasing : un échantillonnage trop lent crée une fausse perception de la fréquence.

**Ce que le théorème de Nyquist-Shannon n'est PAS** :

- Le théorème ne dit pas que 2x est "suffisant pour un bon son". C'est le minimum mathématique. En pratique, on ajoute une marge et des filtres anti-aliasing.
- Le théorème ne concerne pas la qualité subjective. Il garantit la fidélité mathématique. La qualité perçue dépend aussi de la quantification et de la chaîne de reproduction.

#### Exemples de fréquences de Nyquist

| Sample rate | Fréquence de Nyquist | Conséquence |
| ----------- | -------------------- | ----------- |
| 44 100 Hz | 22 050 Hz | Couvre l'audition humaine (20-20 000 Hz) |
| 48 000 Hz | 24 000 Hz | Couvre l'audition humaine avec marge |
| 96 000 Hz | 48 000 Hz | Capture des harmoniques ultrasoniques |
| 22 050 Hz | 11 025 Hz | Insuffisant pour la musique (perte des aigus) |

---

### Qu'est-ce que l'aliasing (repliement spectral) ?

**Définition** : L'aliasing (ou repliement spectral) est un artefact qui se produit quand un signal contient des fréquences supérieures à la fréquence de Nyquist. Ces fréquences trop hautes sont "repliées" et apparaissent comme des fréquences plus basses qui n'existaient pas dans le signal original. On les appelle **fréquences fantômes**.

Formule de la fréquence fantôme :

$$f_{\text{fantome}} = f_s - f_{\text{originale}}$$

**Le problème que l'aliasing pose** :

Sans comprendre l'aliasing, voici les problèmes rencontrés :

1. **Sons parasites inexplicables** : des fréquences bizarres apparaissent dans l'enregistrement
2. **Dégradation irréversible** : une fois enregistré avec aliasing, le signal est corrompu
3. **Synthèse sonore défectueuse** : les oscillateurs produisent des harmoniques qui dépassent la fréquence de Nyquist

**Comment éviter l'aliasing** :

| Problème | Solution |
| -------- | -------- |
| Sons parasites | Appliquer un filtre anti-aliasing (passe-bas) avant l'échantillonnage |
| Dégradation irréversible | Filtrer les fréquences au-dessus de Nyquist en amont |
| Synthèse défectueuse | Utiliser des algorithmes "band-limited" qui ne génèrent pas de fréquences au-delà de Nyquist |

**Analogie concrète** : Dans un film, les roues de voiture semblent parfois tourner en arrière. La caméra prend 24 images/seconde. Si la roue dépasse 12 tours/seconde (la moitié de 24), le mouvement est "replié" et semble inverser. C'est l'aliasing audio : une fréquence trop haute se "replie" en une fausse fréquence basse.

**Ce que l'aliasing n'est PAS** :

- L'aliasing n'est pas du bruit aléatoire. Le bruit est un signal aléatoire réparti sur tout le spectre. L'aliasing produit des fréquences précises et prédictibles par la formule ci-dessus.
- L'aliasing n'est pas une distorsion d'amplitude. La distorsion modifie la forme d'onde par saturation. L'aliasing ajoute des fréquences qui n'existaient pas, sans modifier les fréquences existantes.

#### Exemple concret d'aliasing

Un signal de 30 000 Hz échantillonné à 44 100 Hz : Nyquist = 22 050 Hz, donc 30 000 Hz > 22 050 Hz = aliasing. Fréquence fantôme = 44 100 - 30 000 = **14 100 Hz** (parfaitement audible, alors que 30 000 Hz ne l'était pas).

---

### Qu'est-ce que la quantification ?

**Définition** : La quantification est le processus qui attribue une valeur numérique discrète à chaque échantillon. La **résolution en bits** (bit depth) détermine le nombre de valeurs possibles pour représenter l'amplitude du signal. Avec $n$ bits, on dispose de $2^n$ niveaux de quantification.

**Le problème que la quantification résout** :

Sans quantification, voici les problèmes rencontrés :

1. **Amplitude continue impossible à stocker** : un échantillon analogique peut avoir une infinité de valeurs possibles entre -1 et +1. Un ordinateur ne peut stocker qu'un nombre fini de valeurs
2. **Précision variable** : sans norme de résolution, chaque système utiliserait une précision différente, rendant les fichiers incompatibles
3. **Bruit de fond incontrôlé** : sans résolution suffisante, l'arrondi des valeurs introduit un bruit audible (bruit de quantification)

**Comment la quantification résout ces problèmes** :

| Problème | Solution apportée par la quantification |
| -------- | --------------------------------------- |
| Amplitude continue impossible à stocker | Chaque échantillon est arrondi au niveau le plus proche parmi $2^n$ niveaux |
| Précision variable | Les standards (16-bit, 24-bit, 32-bit) définissent des résolutions interchangeables |
| Bruit de fond incontrôlé | Plus il y a de bits, plus le bruit de quantification est faible et inaudible |

**Analogie concrète** : Imagine que tu mesures la température extérieure. Si ton thermomètre n'affiche que des nombres entiers (20°C, 21°C, 22°C), tu perds la précision : 20,7°C sera arrondi à 21°C. Si ton thermomètre affiche un chiffre après la virgule (20,7°C), la mesure est plus précise. La quantification fonctionne pareil : plus tu as de bits, plus la "graduation" de ton thermomètre sonore est fine, et moins tu perds de détails.

**Ce que la quantification n'est PAS** :

- La quantification n'est pas l'échantillonnage. L'échantillonnage décide **quand** mesurer (dans le temps). La quantification décide **avec quelle précision** mesurer (en amplitude).
- La quantification n'est pas la compression. La compression réduit la taille du fichier en supprimant des données jugées redondantes ou inaudibles. La quantification est une étape de la numérisation brute, avant toute compression.

#### Résolutions courantes

| Résolution | Niveaux de quantification | Rapport signal/bruit (SNR) | Utilisation |
| ---------- | ------------------------- | -------------------------- | ----------- |
| 8 bits | 256 ($2^{8}$) | ~48 dB | Téléphonie ancienne, jeux rétro |
| 16 bits | 65 536 ($2^{16}$) | ~96 dB | CD audio |
| 24 bits | 16 777 216 ($2^{24}$) | ~144 dB | Production musicale professionnelle |
| 32 bits float | plage dynamique très large (exposant) | non comparable à un SNR PCM entier | Traitement interne (DAW, Faust) |

**Rapport signal/bruit (SNR)** : Le SNR mesure la distance entre le signal utile et le bruit de quantification. La formule approximative pour un signal **entier** (PCM à n bits) est :

$$\text{SNR} \approx 6{,}02 \times n + 1{,}76 \text{ dB}$$

Cette formule **ne s'applique pas** tel quel au 32-bit float : le float n'a pas un nombre fixe de niveaux uniformes comme le PCM entier. Le chiffre « ~1528 dB » obtenu en injectant n=32 dans la formule PCM est donc **trompeur** pour le float. En pratique, on retient surtout que le 32-bit float offre une grande marge avant clipping dans les traitements internes.

```text
Exemples :
  16 bits → 6,02 × 16 + 1,76 = 98,08 dB
  24 bits → 6,02 × 24 + 1,76 = 146,24 dB
```

**Pourquoi 32-bit float en traitement ?** En 32-bit entier, si le signal dépasse la plage, il sature brutalement (clipping). En 32-bit float (virgule flottante), la plage dynamique est bien plus large : un signal peut temporairement dépasser 0 dBFS sans distorsion, ce qui est précieux en traitement intermédiaire (DAW, Faust).

---

### Qu'est-ce que le PCM (Pulse Code Modulation) ?

**Définition** : Le PCM (Pulse Code Modulation, modulation par impulsions codées) est le format standard de représentation numérique brute du son. Chaque échantillon est stocké comme un nombre (entier ou flottant) correspondant à l'amplitude du signal à cet instant. Le format WAV utilise le PCM.

**Le problème que le PCM résout** :

Sans format standard de stockage, voici les problèmes rencontrés :

1. **Pas de format universel** : chaque fabricant utiliserait son propre encodage incompatible
2. **Perte de qualité** : sans format brut de référence, chaque traitement risque de dégrader le signal
3. **Complexité de décodage** : un format compressé nécessite un décodeur spécifique

**Comment le PCM résout ces problèmes** :

| Problème | Solution apportée par le PCM |
| -------- | ---------------------------- |
| Pas de format universel | Standard reconnu par tous les logiciels et matériels audio |
| Perte de qualité | Stockage brut sans transformation destructive |
| Complexité de décodage | Suite de nombres, lisible directement sans décodeur |

**Analogie concrète** : Le PCM est comme un carnet où tu notes la température toutes les secondes (23,4 - 23,5 - 23,3...). C'est brut, ça prend de la place, mais c'est exact. Un format compressé (MP3) serait comme écrire "environ 23 degrés pendant 10 secondes" - plus compact mais moins précis.

**Ce que le PCM n'est PAS** :

- Le PCM n'est pas un format compressé. Le MP3, l'AAC et l'OGG sont des formats compressés. Le PCM stocke chaque échantillon sans aucune compression.
- Le PCM n'est pas un format de fichier. Le PCM est une méthode d'encodage. Le WAV est un format de fichier qui **contient** des données PCM (avec un en-tête décrivant le sample rate, le bit depth, etc.).

**Comparaison PCM vs formats compressés** :

| PCM (WAV) | Compressé (MP3) |
| --------- | --------------- |
| Aucune perte de qualité | Perte de qualité (données supprimées) |
| Fichier volumineux (~10 Mo/min en 16-bit 44,1 kHz stéréo) | Fichier compact (~1 Mo/min à 128 kbps) |
| Décodage instantané | Décodage nécessitant du CPU |
| Standard en production | Standard en diffusion |

#### Calcul de la taille d'un fichier PCM

$$\text{taille (octets)} = f_s \times \frac{\text{bit depth}}{8} \times \text{canaux} \times \text{durée (s)}$$

```text
Exemple : 1 min stéréo, 16-bit, 44 100 Hz = 44100 × 2 × 2 × 60 ≈ 10,1 Mo
```

---

### Qu'est-ce que la FFT (Fast Fourier Transform) ?

**Définition** : La FFT (Fast Fourier Transform, transformée de Fourier rapide) est un algorithme qui décompose un signal temporel en ses composantes fréquentielles. Elle transforme une série d'échantillons dans le **domaine temporel** (amplitude en fonction du temps) en une représentation dans le **domaine fréquentiel** (amplitude et phase en fonction de la fréquence).

**Le problème que la FFT résout** :

Sans FFT, voici les problèmes rencontrés :

1. **Impossible d'identifier les fréquences** : un signal temporel ne montre que des oscillations, sans révéler quelles fréquences le composent
2. **Impossible de filtrer efficacement** : pour supprimer une fréquence précise, il faut d'abord la localiser dans le spectre
3. **Calcul de Fourier trop lent** : la DFT nécessite $N^2$ opérations (~1,9 milliard pour 44 100 échantillons). La FFT réduit cela à $N \times \log_2(N)$, soit ~700 000 opérations

**Comment la FFT résout ces problèmes** :

| Problème | Solution apportée par la FFT |
| -------- | ---------------------------- |
| Impossible d'identifier les fréquences | La FFT décompose le signal en une liste de fréquences avec leur amplitude |
| Impossible de filtrer efficacement | On peut supprimer ou modifier une fréquence précise dans le domaine fréquentiel |
| Calcul trop lent | L'algorithme FFT réduit la complexité de $O(N^2)$ à $O(N \log N)$ |

**Analogie concrète** : Imagine que tu entends un orchestre jouer un accord. Le son que tu entends est un mélange de toutes les notes jouées en même temps (c'est le domaine temporel). La FFT est comme un musicien expert qui écoute l'accord et dit : "Il y a un Do à forte intensité, un Mi à intensité moyenne, et un Sol à faible intensité." Elle décompose le mélange en ses composantes individuelles (c'est le domaine fréquentiel).

**Ce que la FFT n'est PAS** :

- La FFT n'est pas un filtre. La FFT analyse le contenu fréquentiel. Un filtre modifie le signal. On peut utiliser la FFT pour comprendre un signal, puis appliquer un filtre séparément.
- La FFT n'est pas uniquement pour l'audio. Elle s'applique à tout signal périodique : images (compression JPEG), vibrations mécaniques, signaux radio, analyse de données financières.

#### Domaine temporel vs domaine fréquentiel

| Domaine temporel | Domaine fréquentiel |
| ---------------- | ------------------- |
| Axe X = temps | Axe X = fréquence |
| Axe Y = amplitude | Axe Y = magnitude (intensité de chaque fréquence) |
| Montre la forme d'onde | Montre le spectre |
| Utile pour voir l'enveloppe du son | Utile pour voir le contenu harmonique |

#### Qu'est-ce qu'un spectrogramme ?

Un **spectrogramme** combine temps (axe horizontal), fréquences (axe vertical) et amplitude (couleur/intensité) sur un seul graphique. Il est produit en appliquant la FFT sur de petites fenêtres successives du signal (technique appelée **STFT**, Short-Time Fourier Transform).

---

### Qu'est-ce que la latence et les buffers ?

**Définition** : La **latence** est le délai entre le moment où un son entre dans le système (entrée microphone, note MIDI) et le moment où le son traité sort (haut-parleurs, casque). Le **buffer** (tampon) est un bloc de mémoire qui accumule un certain nombre d'échantillons avant de les envoyer au processeur pour traitement. La taille du buffer détermine directement la latence.

Formule :

$$\text{latence (s)} = \frac{\text{taille buffer}}{f_s}$$

```text
Exemple : buffer de 256 échantillons à 44 100 Hz
= 256 / 44 100
= 0,00580 secondes
≈ 5,8 ms
```

**Le problème que les buffers résolvent** :

Sans buffers, voici les problèmes rencontrés :

1. **Surcharge d'appels système** : traiter chaque échantillon individuellement force le CPU à intervenir 44 100 fois par seconde
2. **Coupures audio (glitches)** : si le processeur n'a pas fini quand l'échantillon suivant arrive, le son se coupe
3. **Inefficacité du processeur** : les processeurs sont optimisés pour traiter des blocs, pas des valeurs isolées

**Comment les buffers résolvent ces problèmes** :

| Problème | Solution apportée par les buffers |
| -------- | --------------------------------- |
| Surcharge d'appels système | Le CPU est sollicité une fois par buffer (~172 fois/s pour 256 à 44 100 Hz) |
| Coupures audio | Le buffer accumule des échantillons, laissant au CPU le temps de traiter |
| Inefficacité du processeur | Le traitement par blocs exploite les caches CPU et les instructions SIMD |

**Analogie concrète** : Imagine un serveur de restaurant. Il pourrait servir chaque plat dès qu'il est prêt, mais il passerait son temps en allers-retours. Il est plus efficace de regrouper plusieurs plats sur un plateau (le buffer). Le compromis : les premiers plats attendent un peu (la latence), mais le service est plus stable.

**Ce que la latence n'est PAS** :

- La latence n'est pas le temps de traitement. Le temps de traitement est le temps que le CPU met pour calculer les effets. La latence inclut le temps de traitement **plus** le temps d'attente dans les buffers d'entrée et de sortie.
- La latence n'est pas synonyme de mauvaise qualité. Une latence élevée ne dégrade pas la qualité du son. Elle ajoute seulement un délai perceptible, gênant pour le jeu en temps réel mais sans impact sur la fidélité audio.

#### Le compromis latence / stabilité

| Taille de buffer | Latence (à 44 100 Hz) | Stabilité | Usage |
| ---------------- | ---------------------- | --------- | ----- |
| 32 échantillons | 0,7 ms | Très fragile | Expérimental uniquement |
| 64 échantillons | 1,5 ms | Fragile | Machines puissantes, monitoring |
| 128 échantillons | 2,9 ms | Bonne | Jeu en temps réel |
| 256 échantillons | 5,8 ms | Très bonne | Production musicale |
| 512 échantillons | 11,6 ms | Excellente | Mixage, traitement lourd |
| 1024 échantillons | 23,2 ms | Maximale | Traitement hors temps réel |
| 2048 échantillons | 46,4 ms | Maximale | Rendu offline |

**Seuil de perception** : un musicien perçoit la latence au-delà de 10-15 ms.

**Latence aller-retour** : En pratique, la latence totale comprend le buffer d'entrée **et** le buffer de sortie. La latence round-trip est donc au minimum le double : buffer de 256 à 44 100 Hz donne au moins $2 \times 5{,}8 = 11{,}6$ ms.

---

## Étapes Pratiques

### Étape 1 : Calculer la fréquence de Nyquist

Pour un sample rate donné, la fréquence de Nyquist est la fréquence maximale représentable sans aliasing.

Commande :

```python
# Calcul de la fréquence de Nyquist pour différents sample rates
sample_rates = [22050, 44100, 48000, 96000, 192000]

for sr in sample_rates:
    # La fréquence de Nyquist est exactement la moitié du sample rate
    nyquist = sr / 2
    print(f"Sample rate : {sr:>6} Hz → Nyquist : {nyquist:>6.0f} Hz")
```

**Résultat attendu** :

```text
Sample rate :  22050 Hz → Nyquist :  11025 Hz
Sample rate :  44100 Hz → Nyquist :  22050 Hz
Sample rate :  48000 Hz → Nyquist :  24000 Hz
Sample rate :  96000 Hz → Nyquist :  48000 Hz
Sample rate : 192000 Hz → Nyquist :  96000 Hz
```

---

### Étape 2 : Détecter l'aliasing et calculer les fréquences fantômes

Quand une fréquence dépasse la fréquence de Nyquist, elle est repliée. Voici comment calculer la fréquence fantôme résultante.

Commande :

```python
# Vérification d'aliasing pour un sample rate de 44 100 Hz
sample_rate = 44100
nyquist = sample_rate / 2

# Fréquences à tester
frequences = [1000, 10000, 20000, 22050, 25000, 30000, 40000]

print(f"Sample rate : {sample_rate} Hz")
print(f"Fréquence de Nyquist : {nyquist} Hz")
print("-" * 60)

for freq in frequences:
    if freq <= nyquist:
        # Pas d'aliasing : la fréquence est correctement représentée
        print(f"{freq:>6} Hz → OK (sous la fréquence de Nyquist)")
    else:
        # Aliasing : calcul de la fréquence fantôme
        freq_fantome = sample_rate - freq
        print(f"{freq:>6} Hz → ALIASING ! Fréquence fantôme : {freq_fantome} Hz")
```

**Résultat attendu** :

```text
Sample rate : 44100 Hz
Fréquence de Nyquist : 22050.0 Hz
------------------------------------------------------------
  1000 Hz → OK (sous la fréquence de Nyquist)
 10000 Hz → OK (sous la fréquence de Nyquist)
 20000 Hz → OK (sous la fréquence de Nyquist)
 22050 Hz → OK (sous la fréquence de Nyquist)
 25000 Hz → ALIASING ! Fréquence fantôme : 19100 Hz
 30000 Hz → ALIASING ! Fréquence fantôme : 14100 Hz
 40000 Hz → ALIASING ! Fréquence fantôme : 4100 Hz
```

---

### Étape 3 : Calculer le nombre de niveaux de quantification

La résolution en bits détermine la finesse de la mesure d'amplitude. Chaque bit supplémentaire double le nombre de niveaux.

Commande :

```python
# Calcul du nombre de niveaux de quantification et du SNR théorique
bit_depths = [8, 16, 24, 32]

print(f"{'Bits':>6} | {'Niveaux':>14} | {'SNR (dB)':>10}")
print("-" * 38)

for bits in bit_depths:
    # Nombre de niveaux = 2 élevé à la puissance bits
    niveaux = 2 ** bits
    # SNR théorique pour un signal PCM entier
    snr = 6.02 * bits + 1.76
    print(f"{bits:>6} | {niveaux:>14,} | {snr:>10.2f}")
```

**Résultat attendu** :

```text
  Bits |        Niveaux |   SNR (dB)
--------------------------------------
     8 |            256 |      49.92
    16 |         65,536 |      98.08
    24 |     16,777,216 |     146.24
    32 |  4,294,967,296 |     194.40
```

---

### Étape 4 : Calculer la latence pour différentes tailles de buffer

La latence dépend de la taille du buffer et du sample rate. Voici comment la calculer.

Commande :

```python
# Calcul de latence pour différentes combinaisons buffer/sample rate
buffer_sizes = [64, 128, 256, 512, 1024, 2048]
sample_rates = [44100, 48000, 96000]

# En-tête du tableau
header = f"{'Buffer':>8} |"
for sr in sample_rates:
    header += f" {sr:>8} Hz |"
print(header)
print("-" * len(header))

# Calcul pour chaque taille de buffer
for buf in buffer_sizes:
    row = f"{buf:>8} |"
    for sr in sample_rates:
        # Latence = taille du buffer / sample rate, convertie en millisecondes
        latence_ms = (buf / sr) * 1000
        row += f" {latence_ms:>8.2f} ms |"
    print(row)
```

**Résultat attendu** :

```text
  Buffer |  44100 Hz |  48000 Hz |  96000 Hz |
-----------------------------------------------
      64 |  1.45 ms  |  1.33 ms  |  0.67 ms  |
     128 |  2.90 ms  |  2.67 ms  |  1.33 ms  |
     256 |  5.80 ms  |  5.33 ms  |  2.67 ms  |
     512 | 11.61 ms  | 10.67 ms  |  5.33 ms  |
    1024 | 23.22 ms  | 21.33 ms  | 10.67 ms  |
    2048 | 46.44 ms  | 42.67 ms  | 21.33 ms  |
```

---

### Étape 5 : Calculer la taille d'un fichier PCM

Commande :

```python
# Calcul de taille de fichier WAV (PCM non compressé)
# Formule : sample_rate × (bit_depth/8) × canaux × durée_secondes
configs = [
    (44100, 16, 2, "CD audio (44,1 kHz / 16-bit / stéréo)"),
    (48000, 24, 2, "Production (48 kHz / 24-bit / stéréo)"),
    (96000, 24, 2, "Hi-Res (96 kHz / 24-bit / stéréo)"),
]

duree = 60  # 1 minute

for sr, bits, ch, description in configs:
    taille = sr * (bits / 8) * ch * duree
    taille_mo = taille / (1024 * 1024)
    print(f"{description:45s} → {taille_mo:>7.1f} Mo")
```

**Résultat attendu** :

```text
CD audio (44,1 kHz / 16-bit / stéréo)        →    10.1 Mo
Production (48 kHz / 24-bit / stéréo)         →    16.5 Mo
Hi-Res (96 kHz / 24-bit / stéréo)             →    33.0 Mo
```

---

### Étape 6 : Visualiser la FFT d'un signal simple

Cette étape montre comment la FFT décompose un signal temporel en ses composantes fréquentielles.

Commande :

```python
import numpy as np

# Paramètres
sample_rate = 44100
duree = 0.01  # 10 ms
N = int(sample_rate * duree)
t = np.linspace(0, duree, N, endpoint=False)

# Signal composé de 3 fréquences (440 Hz, 880 Hz, 1320 Hz)
signal = (
    1.0 * np.sin(2 * np.pi * 440 * t) +   # Fondamentale à 440 Hz
    0.5 * np.sin(2 * np.pi * 880 * t) +    # 2ème harmonique
    0.3 * np.sin(2 * np.pi * 1320 * t)     # 3ème harmonique
)

# Calcul de la FFT et extraction des magnitudes
fft_result = np.fft.fft(signal)
magnitudes = np.abs(fft_result) / N          # Normalisation
frequences = np.fft.fftfreq(N, d=1/sample_rate)

# On ne garde que la moitié positive (le spectre est symétrique)
mask = frequences >= 0
freq_pos = frequences[mask]
mag_pos = magnitudes[mask] * 2  # ×2 car on a retiré la moitié

# Affichage des pics significatifs
print("Fréquences détectées par la FFT :")
for i in range(len(freq_pos)):
    if mag_pos[i] > 0.1:
        print(f"  {freq_pos[i]:>8.1f} Hz → amplitude : {mag_pos[i]:.2f}")
```

**Résultat attendu** :

```text
Fréquences détectées par la FFT :
     440.0 Hz → amplitude : 1.00
     880.0 Hz → amplitude : 0.50
    1320.0 Hz → amplitude : 0.30
```

La FFT a identifié les 3 fréquences et leurs amplitudes respectives.

---

## Commandes Utiles

| Formule | Calcul |
| ------- | ------ |
| `nyquist = sample_rate / 2` | Fréquence maximale représentable |
| `freq_fantome = sample_rate - freq` | Fréquence d'aliasing |
| `niveaux = 2 ** bits` | Nombre de niveaux de quantification |
| `snr = 6.02 * bits + 1.76` | Rapport signal/bruit en dB |
| `latence_ms = (buffer / sr) * 1000` | Latence en millisecondes |
| `taille = sr * (bits/8) * canaux * durée` | Taille fichier PCM en octets |

---

## Pièges Fréquents

### Piège 1 : Confondre échantillonnage et quantification

**Problème** : Beaucoup de débutants confondent sample rate (fréquence d'échantillonnage) et bit depth (résolution en bits), car les deux influencent la qualité audio.

**Solution** : Retiens cette distinction simple :

- **Sample rate** = combien de fois par seconde on mesure → axe **horizontal** (temps)
- **Bit depth** = avec quelle précision on mesure → axe **vertical** (amplitude)

```text
Augmenter le sample rate → capture des fréquences plus hautes
Augmenter le bit depth  → réduit le bruit de quantification
```

---

### Piège 2 : Croire qu'un sample rate plus élevé améliore toujours le son

**Problème** : "96 kHz est forcément mieux que 44,1 kHz" est une idée reçue.

**Solution** : L'oreille humaine n'entend pas au-delà de 20 kHz. Un sample rate de 44,1 kHz capture toutes les fréquences audibles. Un sample rate plus élevé est utile en production (marge pour le traitement, filtrage) mais pour l'écoute finale, la différence est inaudible dans des tests en double aveugle.

---

### Piège 3 : Oublier la latence aller-retour

**Problème** : Calculer la latence avec un seul buffer alors qu'en pratique il y a un buffer d'entrée ET un buffer de sortie.

**Solution** : La latence réelle (round-trip) est au minimum le double de la latence d'un seul buffer, plus le temps de traitement du CPU :

$$\text{Latence round-trip} \geq 2 \times \frac{\text{buffer size}}{f_s} + t_{\text{traitement}}$$

---

### Piège 4 : Ignorer le filtre anti-aliasing

**Problème** : Penser que respecter le théorème de Nyquist suffit. En réalité, les signaux analogiques contiennent toujours des fréquences au-dessus de la Nyquist (harmoniques, bruit).

**Solution** : Tout convertisseur analogique-numérique (ADC) sérieux inclut un **filtre anti-aliasing** (filtre passe-bas) qui coupe les fréquences au-dessus de la fréquence de Nyquist **avant** l'échantillonnage. Ce filtre est analogique et matériel.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre échantillonnage et quantification
- [ ] Je sais calculer la fréquence de Nyquist pour un sample rate donné
- [ ] Je sais calculer la fréquence fantôme produite par l'aliasing
- [ ] Je sais calculer le nombre de niveaux de quantification pour une résolution donnée
- [ ] Je sais calculer la latence en millisecondes à partir de la taille du buffer et du sample rate
- [ ] Je sais expliquer ce que fait la FFT (passage temporel → fréquentiel)
- [ ] Je sais calculer la taille d'un fichier PCM (WAV)
- [ ] Je connais le compromis latence / stabilité et je sais choisir une taille de buffer adaptée

---

## Exercice Pratique

**Énoncé** : Réponds aux questions suivantes en effectuant les calculs à la main (ou avec Python pour vérifier).

**Partie 1 - Latence** :

Calcule la latence (en millisecondes) pour les combinaisons suivantes :

| Buffer | Sample rate | Latence ? |
| ------ | ----------- | --------- |
| 256 | 44 100 Hz | ? |
| 512 | 44 100 Hz | ? |
| 1024 | 44 100 Hz | ? |
| 256 | 48 000 Hz | ? |
| 512 | 48 000 Hz | ? |
| 1024 | 48 000 Hz | ? |

**Partie 2 - Aliasing** :

Un signal de 30 000 Hz est échantillonné à 44 100 Hz.

1. Quelle est la fréquence de Nyquist ?
2. Y a-t-il aliasing ? Pourquoi ?
3. Quelle fréquence fantôme apparaît ?
4. Cette fréquence fantôme est-elle audible ?

**Partie 3 - Quantification** :

1. Combien de niveaux de quantification offre une résolution de 16 bits ?
2. Combien de niveaux de quantification offre une résolution de 24 bits ?
3. Quel est le SNR théorique pour 16 bits et 24 bits ?

**Indications** :

- Latence (ms) = $(\text{buffer} / f_s) \times 1000$
- Fréquence de Nyquist = $f_s / 2$
- Fréquence fantôme = $f_s - f_{\text{originale}}$
- Niveaux = $2^n$
- SNR = $6{,}02 \times n + 1{,}76$ dB

**Résultat attendu** : Un tableau rempli pour la partie 1, des réponses argumentées pour la partie 2, et des valeurs numériques pour la partie 3.

---

## Solution de l'Exercice

> **Note** : Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Partie 1 - Latence

| Buffer | Sample rate | Calcul | Latence |
| ------ | ----------- | ------ | ------- |
| 256 | 44 100 Hz | 256 / 44100 x 1000 | **5,80 ms** |
| 512 | 44 100 Hz | 512 / 44100 x 1000 | **11,61 ms** |
| 1024 | 44 100 Hz | 1024 / 44100 x 1000 | **23,22 ms** |
| 256 | 48 000 Hz | 256 / 48000 x 1000 | **5,33 ms** |
| 512 | 48 000 Hz | 512 / 48000 x 1000 | **10,67 ms** |
| 1024 | 48 000 Hz | 1024 / 48000 x 1000 | **21,33 ms** |

**Observation** : Doubler la taille du buffer double la latence. Un buffer de 256 donne ~5,8 ms (imperceptible), un buffer de 1024 donne ~23,2 ms (perceptible par un musicien).

---

### Partie 2 - Aliasing

1. **Fréquence de Nyquist** = 44 100 / 2 = **22 050 Hz**
2. **Aliasing ?** OUI, car 30 000 Hz > 22 050 Hz. Le signal dépasse la fréquence de Nyquist.
3. **Fréquence fantôme** = 44 100 - 30 000 = **14 100 Hz**
4. **Audible ?** OUI. 14 100 Hz est dans la plage audible (20-20 000 Hz). Le signal original de 30 000 Hz était inaudible, mais l'aliasing l'a transformé en un parasite audible à 14 100 Hz. C'est ce qui rend l'aliasing dangereux : un signal ultrasonique inaudible devient un parasite clairement audible.

---

### Partie 3 - Quantification

**16 bits** :

- Niveaux = $2^{16}$ = **65 536**
- SNR = $6{,}02 \times 16 + 1{,}76$ = **98,08 dB**

**24 bits** :

- Niveaux = $2^{24}$ = **16 777 216**
- SNR = $6{,}02 \times 24 + 1{,}76$ = **146,24 dB**

**Observation** : Passer de 16 à 24 bits multiplie les niveaux par 256 et ajoute ~48 dB de SNR, bien au-delà de l'oreille humaine (~120 dB).

---

## Navigation

← Fiche précédente : **[01 - Acoustique et psychoacoustique](01-acoustique-psychoacoustique.md)**

→ Fiche suivante : **[03 - Mathématiques pour le DSP](03-mathematiques-dsp.md)**
