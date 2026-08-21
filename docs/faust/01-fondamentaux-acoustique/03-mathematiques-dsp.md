---
tags:
  - Faust
  - Intermédiaire
  - Concept
description: "Mathématiques pour le DSP - nombres complexes, trigonométrie, transformées de Fourier et en Z"
estimated_time: "75 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 1 - Fondamentaux acoustique"
id: "specializations.faust.acoustics.mathematiques-dsp"
course_id: "specializations.faust"
module_id: "specializations.faust.acoustics"
content_type: "lesson"
order: 3
---

# 03 - Mathématiques pour le DSP

> **En bref** : À la fin de cette fiche, tu sauras utiliser les nombres complexes et la trigonométrie pour représenter des signaux, comprendre les transformées de Fourier et en Z, et analyser la stabilité d'un filtre numérique. Lecture estimée : 75 min.


## Prérequis

- [Fiche 01 - Acoustique et psychoacoustique](01-acoustique-psychoacoustique.md)
- [Fiche 02 - Audio numérique et théorie du signal](02-audio-numerique-theorie-signal.md)
- Savoir manipuler des fonctions mathématiques de base (addition, multiplication, puissances)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les nombres complexes et la trigonométrie pour représenter des signaux, comprendre les transformées de Fourier et en Z, et analyser la stabilité d'un filtre numérique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un nombre complexe ?

**Définition** : Un nombre complexe est un nombre composé de deux parties : une partie réelle et une partie imaginaire. On l'écrit sous la forme $z = a + jb$, où $a$ est la partie réelle, $b$ est la partie imaginaire, et $j$ est l'unité imaginaire définie par $j^2 = -1$.

**Note** : En mathématiques pures, on utilise $i$ pour l'unité imaginaire. En traitement du signal et en électronique, on utilise $j$ pour éviter la confusion avec le courant électrique $i$.

**Le problème que les nombres complexes résolvent** :

Sans les nombres complexes, voici les problèmes rencontrés en traitement du signal :

1. **Représenter amplitude ET phase** : Un signal sinusoïdal a deux propriétés simultanées (son amplitude et sa phase). Un simple nombre réel ne peut en représenter qu'une seule à la fois.
2. **Calculer des rotations** : Les signaux audio sont des oscillations (des rotations sur un cercle). Les nombres réels ne permettent pas de décrire ces rotations de manière compacte.
3. **Simplifier les équations de filtres** : Les équations des filtres numériques deviennent très longues avec uniquement des sinus et cosinus. Les nombres complexes les simplifient considérablement.

**Comment les nombres complexes résolvent ces problèmes** :

| Problème | Solution apportée par les nombres complexes |
| -------- | -------------------------------------------- |
| Représenter amplitude ET phase | Un seul nombre complexe encode les deux : le module donne l'amplitude, l'angle donne la phase |
| Calculer des rotations | Multiplier par un nombre complexe effectue une rotation |
| Simplifier les équations de filtres | Les formules s'écrivent en quelques termes au lieu de longues expressions trigonométriques |

**Analogie concrète** : Imagine une boussole posée sur une table. Pour décrire la position de l'aiguille, tu as besoin de deux informations : la distance entre le centre et la pointe de l'aiguille (le module) et la direction vers laquelle elle pointe (l'angle). Un nombre complexe fonctionne exactement comme cette boussole : il combine une distance et une direction en une seule valeur.

**Ce qu'un nombre complexe n'est PAS** :

- Un nombre complexe n'est pas "imaginaire" au sens de "fictif". Il est tout aussi réel et utile qu'un nombre ordinaire. Le terme "imaginaire" est un nom historique malheureux.
- Un nombre complexe n'est pas un vecteur 2D, même s'il y ressemble visuellement. Un nombre complexe peut être multiplié par un autre (rotation + mise à l'échelle), tandis que le produit de deux vecteurs 2D n'a pas cette propriété.

**Notation cartésienne et notation polaire** :

Un nombre complexe s'écrit de deux façons équivalentes :

- Cartésienne : $z = a + jb$ (partie réelle + partie imaginaire)
- Polaire : $z = r \cdot e^{j\theta}$ (module + angle)

Conversions :

$$r = \sqrt{a^2 + b^2} \qquad \theta = \text{atan2}(b, a)$$

$$a = r \cdot \cos(\theta) \qquad b = r \cdot \sin(\theta)$$

L'avantage de la notation polaire : en polaire, multiplier deux nombres complexes revient à multiplier les modules et additionner les angles. C'est beaucoup plus simple qu'en cartésien.

---

### La formule d'Euler

**Définition** : La formule d'Euler établit le lien fondamental entre les exponentielles complexes et la trigonométrie : $e^{j\theta} = \cos(\theta) + j\sin(\theta)$. Cette formule est la base de tout le traitement du signal numérique.

**Le problème que la formule d'Euler résout** :

Sans la formule d'Euler, voici les problèmes rencontrés :

1. **Deux fonctions au lieu d'une** : Pour décrire un signal sinusoïdal, il faut manipuler séparément le cosinus et le sinus.
2. **Calculs lourds** : Les identités trigonométriques ($\cos(A+B)$, $\sin(A+B)$) sont difficiles à mémoriser et à appliquer.
3. **Signaux difficiles à combiner** : Additionner deux sinusoïdes de fréquences différentes produit des formules longues.

**Comment la formule d'Euler résout ces problèmes** :

| Problème | Solution apportée par la formule d'Euler |
| -------- | ---------------------------------------- |
| Deux fonctions au lieu d'une | Une seule exponentielle complexe $e^{j\theta}$ contient les deux |
| Calculs lourds | Les règles des exponentielles sont simples : $e^a \cdot e^b = e^{a+b}$ |
| Signaux difficiles à combiner | Additionner des exponentielles complexes est direct |

**Analogie concrète** : Imagine un point qui tourne sur un cercle (comme l'aiguille des secondes d'une horloge). Si tu regardes ce point depuis le côté droit, tu vois un mouvement de va-et-vient (c'est le cosinus). Si tu regardes depuis le dessous, tu vois un autre va-et-vient (c'est le sinus). La formule d'Euler dit que le mouvement circulaire complet (l'exponentielle complexe) contient les deux va-et-vient en même temps.

**Ce que la formule d'Euler n'est PAS** :

- La formule d'Euler n'est pas une approximation. C'est une égalité exacte, valable pour toute valeur de $\theta$.
- La formule d'Euler n'est pas réservée aux mathématiciens. En DSP, elle est utilisée constamment pour écrire et analyser les signaux.

**Conséquence directe pour les signaux** :

Un signal sinusoïdal de fréquence $f$, d'amplitude $A$ et de phase $\phi$ s'écrit :

$$\text{Forme trigonométrique :} \quad x(t) = A \cdot \cos(2\pi f t + \phi)$$

$$\text{Forme complexe :} \quad x(t) = \text{Re}\left\{ A \cdot e^{j(2\pi f t + \phi)} \right\}$$

Où $\text{Re}\{\}$ signifie "prendre la partie réelle".

---

### Qu'est-ce que la trigonométrie pour l'audio ?

**Définition** : La trigonométrie pour l'audio utilise les fonctions sinus et cosinus comme générateurs de signaux sonores. Un signal sinusoïdal pur est décrit par $x(t) = A \cdot \sin(2\pi f t + \phi)$, où $A$ est l'amplitude, $f$ la fréquence en Hz, $t$ le temps en secondes et $\phi$ la phase initiale en radians.

**Le problème que la trigonométrie résout** :

Sans la trigonométrie, voici les problèmes rencontrés :

1. **Décrire un son mathématiquement** : Un son est une vibration périodique. Sans sinus et cosinus, on ne peut pas écrire une formule qui décrit cette vibration.
2. **Contrôler la hauteur d'un son** : Pour générer un La 440 Hz, il faut une formule qui oscille exactement 440 fois par seconde.
3. **Comprendre le déphasage** : Quand deux signaux sont décalés dans le temps, il faut quantifier ce décalage.

**Comment la trigonométrie résout ces problèmes** :

| Problème | Solution apportée par la trigonométrie |
| -------- | -------------------------------------- |
| Décrire un son | Les fonctions $\sin$/$\cos$ décrivent exactement les oscillations périodiques |
| Contrôler la hauteur | La fréquence $f$ dans $\sin(2\pi f t)$ donne le nombre d'oscillations par seconde |
| Comprendre le déphasage | La phase $\phi$ dans $\sin(2\pi f t + \phi)$ quantifie le décalage temporel |

**Analogie concrète** : Imagine une balancoire. Elle va d'avant en arrière de manière régulière. La hauteur maximale correspond à l'amplitude. Le nombre d'allers-retours par seconde correspond à la fréquence. Le fait que la balancoire ait démarré déjà en mouvement (plutôt qu'au repos) correspond à la phase initiale.

**Ce que la trigonométrie audio n'est PAS** :

- La trigonométrie audio n'est pas limitée aux triangles. En audio, on utilise $\sin$/$\cos$ pour leur propriété d'oscillation périodique.
- La trigonométrie audio n'est pas réservée aux sons purs. Tout son complexe (voix, guitare) peut être décomposé en une somme de sinusoïdes.

**Fréquence angulaire $\omega$** :

$$\omega = 2\pi f \qquad \text{(en radians par seconde)}$$

L'avantage de $\omega$ est de simplifier les formules : $\sin(\omega t)$ au lieu de $\sin(2\pi f t)$.

---

### Qu'est-ce que la transformée de Fourier ?

**Définition** : La transformée de Fourier est une opération mathématique qui décompose un signal en une somme de sinusoïdes de fréquences, amplitudes et phases différentes. Elle transforme un signal du domaine temporel vers le domaine fréquentiel.

**Le problème que la transformée de Fourier résout** :

Sans la transformée de Fourier, voici les problèmes rencontrés :

1. **Signal opaque** : Un signal audio brut est une suite de valeurs. On ne peut pas savoir quelles fréquences il contient en le regardant.
2. **Filtrage aveugle** : Pour supprimer un bruit à 50 Hz, il faut d'abord identifier cette fréquence dans le signal.
3. **Analyse impossible** : Comparer deux sons est très difficile dans le domaine temporel.

**Comment la transformée de Fourier résout ces problèmes** :

| Problème | Solution apportée par la transformée de Fourier |
| -------- | ------------------------------------------------ |
| Signal opaque | Le spectre montre clairement chaque fréquence présente et son amplitude |
| Filtrage aveugle | On identifie la fréquence parasite dans le spectre, puis on la supprime |
| Analyse impossible | Le spectre de deux sons différents a des formes visiblement distinctes |

**Analogie concrète** : Imagine que tu écoutes un orchestre jouer un accord. Ton oreille entend un son global. La transformée de Fourier fait ce que fait un analyseur de spectre : elle sépare l'accord en chaque note individuelle (violon à 440 Hz, flûte à 880 Hz, contrebasse à 110 Hz) et mesure le volume de chacune.

**Ce que la transformée de Fourier n'est PAS** :

- La transformée de Fourier n'est pas une modification du signal. Elle fournit une autre manière de le regarder (comme une radiographie montre l'intérieur du corps sans le modifier).
- La transformée de Fourier n'est pas limitée à l'audio. Elle s'applique à tout signal (images, vibrations, signaux radio).

**Spectre d'amplitude et spectre de phase** :

La transformée produit des nombres complexes pour chaque fréquence. Le module $|X(f)|$ donne l'amplitude (le volume) de chaque fréquence. L'angle $\angle X(f)$ donne la phase (le décalage temporel) de chaque sinusoïde.

**DFT et FFT** :

- **DFT** (Discrete Fourier Transform) : version adaptée aux signaux numériques. Coût : $N^2$ opérations.
- **FFT** (Fast Fourier Transform) : algorithme rapide pour calculer la DFT. Résultat identique. Coût : $N \cdot \log_2(N)$ opérations (pour $N = 1024$ : 100 fois plus rapide que la DFT).

---

### Qu'est-ce que la transformée en Z ?

**Définition** : La transformée en Z est l'outil mathématique principal pour concevoir et analyser les filtres numériques. Elle transforme une suite d'échantillons discrets en une fonction de la variable complexe $z$. La relation avec la fréquence s'établit par $z = e^{j\omega}$.

**Le problème que la transformée en Z résout** :

Sans la transformée en Z, voici les problèmes rencontrés :

1. **Analyser un filtre échantillon par échantillon** : Pour savoir comment un filtre se comporte, il faudrait tester chaque fréquence une par une.
2. **Concevoir un filtre stable** : Un filtre mal conçu peut produire un signal qui explose. Sans outil d'analyse, on ne découvre ce problème qu'à l'exécution.
3. **Comparer des filtres** : Deux filtres peuvent avoir des équations différentes mais des comportements similaires.

**Comment la transformée en Z résout ces problèmes** :

| Problème | Solution apportée par la transformée en Z |
| -------- | ----------------------------------------- |
| Analyser un filtre | La fonction de transfert $H(z)$ décrit le comportement complet en une formule |
| Concevoir un filtre stable | Les pôles de $H(z)$ indiquent immédiatement si le filtre est stable |
| Comparer des filtres | Deux filtres se comparent directement via leurs fonctions de transfert |

**Analogie concrète** : Imagine que tu as une recette de cuisine (le filtre) et que tu veux savoir quel goût aura le plat pour chaque ingrédient possible. Au lieu de cuisiner des centaines de fois, la transformée en Z te donne une fiche technique complète qui décrit le résultat pour n'importe quel ingrédient.

**Ce que la transformée en Z n'est PAS** :

- La transformée en Z n'est pas la transformée de Fourier. La transformée de Fourier est un cas particulier de la transformée en Z (quand $z$ est sur le cercle unité $|z| = 1$).
- La transformée en Z n'est pas réservée aux filtres audio. Elle s'applique à tout système numérique traitant des suites de valeurs.

**Comparaison transformée de Fourier vs transformée en Z** :

| Transformée de Fourier | Transformée en Z |
| ---------------------- | ---------------- |
| Analyse le contenu fréquentiel d'un signal | Analyse le comportement d'un système (filtre) |
| Répond à "quelles fréquences sont dans ce son ?" | Répond à "comment ce filtre modifie-t-il chaque fréquence ?" |

**Le délai unitaire $z^{-1}$** :

En transformée en Z, $z^{-1}$ représente un délai d'un échantillon :

```text
Signal original :    x[0], x[1], x[2], x[3], ...
Signal retardé :     0,    x[0], x[1], x[2], ...  (= z^(-1) * X(z))
Retardé de 2 :       0,    0,    x[0], x[1], ...  (= z^(-2) * X(z))
```

**Fonction de transfert** :

$H(z) = Y(z) / X(z)$ est le rapport entre la sortie et l'entrée. Exemple pour $y[n] = 0.5 \cdot x[n] + 0.5 \cdot x[n-1]$ :

$$H(z) = 0.5 + 0.5 \cdot z^{-1} = 0.5 \cdot \frac{z + 1}{z}$$

---

### Qu'est-ce que les pôles et zéros ?

**Définition** : Les pôles et zéros sont les valeurs de $z$ pour lesquelles la fonction de transfert $H(z)$ atteint respectivement l'infini (pôles) ou zéro (zéros). On les visualise sur le plan des z, un plan complexe avec un cercle de rayon 1 appelé cercle unité.

**Le problème que les pôles et zéros résolvent** :

Sans les pôles et zéros, voici les problèmes rencontrés :

1. **Stabilité inconnue** : Un filtre peut devenir instable sans qu'on le sache avant exécution.
2. **Réponse en fréquence invisible** : Calculer $|H(e^{j\omega})|$ pour chaque fréquence est fastidieux.
3. **Conception par essai-erreur** : Concevoir un filtre qui atténue une fréquence précise nécessite de deviner les coefficients.

**Comment les pôles et zéros résolvent ces problèmes** :

| Problème | Solution apportée par les pôles et zéros |
| -------- | ---------------------------------------- |
| Stabilité inconnue | Si tous les pôles sont à l'intérieur du cercle unité, le filtre est stable |
| Réponse en fréquence invisible | La position des pôles et zéros permet d'estimer visuellement la réponse |
| Conception par essai-erreur | On place les pôles et zéros aux positions voulues, puis on en déduit les coefficients |

**Analogie concrète** : Imagine une nappe posée sur une table. Les zéros sont des punaises qui tirent la nappe vers le bas (atténuation). Les pôles sont des bâtons qui poussent la nappe vers le haut (amplification). La forme de la nappe représente la réponse en fréquence. En déplaçant punaises et bâtons, tu changes cette forme.

**Ce que les pôles et zéros ne sont PAS** :

- Les pôles et zéros ne sont pas des fréquences. Ce sont des positions dans le plan complexe. Leur angle par rapport à l'axe réel indique la fréquence où ils ont le plus d'effet.
- Les pôles ne signifient pas que le filtre produit un signal infini. Un filtre stable a des pôles à l'intérieur du cercle unité.

**Règle de stabilité** :

- Filtre **STABLE** : tous les pôles strictement à l'intérieur du cercle unité ($|p| < 1$)
- Filtre **INSTABLE** : au moins un pôle à l'extérieur ($|p| > 1$)
- Filtre **LIMITE** : un pôle exactement sur le cercle unité ($|p| = 1$) - oscillation constante

**Le plan des z** :

```text
                    Imaginaire (j)
                        |     * zéro
                   _____|_____
                 /      |      \
               /        |        \
              |         |    x    |   <- pôle
    ----------|---------|---------|---------> Réel
              |         |         |
               \        |        /
                 \______|______/
                        |
                  cercle unité (rayon = 1)

  x = pôle     * = zéro
```

Fréquences le long du cercle unité :

- Angle $0$ radian - $0$ Hz (composante continue)
- Angle $\frac{\pi}{2}$ radians - $\frac{f_s}{4}$
- Angle $\pi$ radians - $\frac{f_s}{2}$ (fréquence de Nyquist)

---

### Qu'est-ce que la réponse impulsionnelle et la réponse en fréquence ?

**Définition** : La réponse impulsionnelle $h[n]$ est la sortie d'un filtre quand on lui envoie une impulsion (un échantillon à 1 suivi de zéros). La réponse en fréquence $H(f)$ est la transformée de Fourier de la réponse impulsionnelle : elle indique comment le filtre modifie chaque fréquence.

**Le problème que ces concepts résolvent** :

1. **Comportement inconnu** : On ne sait pas ce que fait un filtre sans le tester avec chaque signal possible.
2. **Comparaison impossible** : Deux filtres avec des équations différentes peuvent produire le même résultat.
3. **Prédiction impossible** : On ne peut pas prédire la sortie du filtre pour un signal arbitraire.

**Comment ces concepts résolvent ces problèmes** :

| Problème | Solution apportée |
| -------- | ----------------- |
| Comportement inconnu | La réponse impulsionnelle caractérise entièrement le filtre avec un seul test |
| Comparaison impossible | Deux filtres identiques ont la même réponse impulsionnelle |
| Prédiction impossible | La sortie pour tout signal est obtenue par convolution avec la réponse impulsionnelle |

**Analogie concrète** : Imagine que tu frappes une cloche avec un marteau (c'est l'impulsion). Le son que produit la cloche (sa résonance, sa durée, ses harmoniques) est sa réponse impulsionnelle. Ce son te dit tout sur la cloche : sa taille, son matériau, sa forme.

**Ce que la réponse impulsionnelle n'est PAS** :

- La réponse impulsionnelle n'est pas la sortie du filtre pour un signal audio réel. C'est la sortie pour un signal de test spécifique (l'impulsion).
- La réponse en fréquence n'est pas un égaliseur. Elle décrit le comportement du filtre mais ne le modifie pas.

**Comparaison FIR vs IIR** :

| FIR (Finite Impulse Response) | IIR (Infinite Impulse Response) |
| ----------------------------- | ------------------------------- |
| Réponse impulsionnelle de durée finie | Réponse impulsionnelle de durée théoriquement infinie |
| N'utilise que les entrées passées et présentes | Utilise aussi les sorties passées (rétroaction) |
| Toujours stable | Peut être instable si mal conçu |
| Nécessite plus de coefficients | Moins de coefficients pour un résultat équivalent |
| Phase linéaire possible | Phase linéaire impossible (sauf cas spéciaux) |

**La convolution** :

La convolution applique un filtre à un signal. La sortie $y[n]$ est calculée en multipliant la réponse impulsionnelle $h[k]$ par le signal d'entrée retardé $x[n-k]$, puis en additionnant :

$$y[n] = \sum_{k=0}^{M-1} h[k] \cdot x[n-k]$$

Exemple avec $h = [0.25, 0.5, 0.25]$ :

```text
y[0] = 0.25*x[0]                           = 0.25*1.0 = 0.25
y[1] = 0.25*x[1] + 0.5*x[0]                = 0.25*0.8 + 0.5*1.0 = 0.70
y[2] = 0.25*x[2] + 0.5*x[1] + 0.25*x[0]   = 0.25*0.6 + 0.5*0.8 + 0.25*1.0 = 0.80
```

---

### Notation DSP utilisée en Faust

**Définition** : Faust utilise une notation DSP spécifique. Les symboles principaux sont $T$ (période d'échantillonnage), $z^{-1}$ (délai d'un échantillon, écrit `'` ou `mem` en Faust), et $f_s$ (fréquence d'échantillonnage `ma.SR` en Faust).

**Le problème que cette notation résout** :

1. **Confusion entre formules mathématiques et code** : Les équations DSP utilisent $z^{-1}$, mais en code, ce concept s'exprime autrement.
2. **Unités ambiguës** : Sans convention, on ne sait pas si une fréquence est en Hz, en radians/s, ou normalisée.

**Comment cette notation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Confusion formules/code | Tableau de correspondance clair entre notation DSP et syntaxe Faust |
| Unités ambiguës | Conventions explicites pour chaque grandeur |

**Tableau de correspondance DSP vers Faust** :

| Notation DSP | Signification | Syntaxe Faust |
| ------------ | ------------- | ------------- |
| $x[n]$ | Échantillon courant | `_` (entrée) |
| $x[n-1]$ | Échantillon précédent | `_'` ou `mem(_)` |
| $x[n-k]$ | Échantillon retardé de k | `@(k)` |
| $z^{-1}$ | Délai unitaire | `'` (prime) ou `mem` |
| $f_s$ ou SR | Fréquence d'échantillonnage | `ma.SR` |
| $T = 1/f_s$ | Période d'échantillonnage | `1.0/ma.SR` |
| $H(z)$ | Fonction de transfert | Expression Faust |
| $y[n]$ | Sortie courante | `process` |

**Ce que la notation Faust n'est PAS** :

- La notation Faust n'est pas du C++ ou du Python. Faust est un langage fonctionnel déclaratif. On décrit ce que le signal doit être, pas les étapes pour le calculer.
- Le `'` (prime) de Faust n'est pas une dérivée mathématique. C'est l'opérateur de délai d'un échantillon, équivalent à $z^{-1}$.

---

## Étapes Pratiques

### Étape 1 : Calculer un signal sinusoïdal avec la formule d'Euler

Nous allons calculer les valeurs d'un signal sinusoïdal de 440 Hz échantillonné à 44100 Hz.

Paramètres et calculs préliminaires :

$$f = 440 \text{ Hz} \qquad f_s = 44100 \text{ Hz} \qquad A = 1.0 \qquad \phi = 0$$

$$\omega = 2\pi f = 2 \times 3.14159 \times 440 = 2764.60 \text{ rad/s}$$

$$\omega_n = \frac{\omega}{f_s} = \frac{2764.60}{44100} = 0.06268 \text{ rad/échantillon}$$

Pour chaque échantillon $n$, la forme complexe donne :

$$z[n] = e^{j \cdot \omega_n \cdot n} = \cos(\omega_n \cdot n) + j\sin(\omega_n \cdot n)$$

Le signal réel : $x[n] = \cos(\omega_n \cdot n)$

```python
import numpy as np

f, fs, A = 440, 44100, 1.0
omega_n = 2 * np.pi * f / fs

for n in range(6):
    z = A * np.exp(1j * omega_n * n)
    print(f"n={n}  cos={z.real:+.4f}  sin={z.imag:+.4f}  "
          f"module={abs(z):.4f}  phase={np.angle(z):+.4f} rad")
```

**Résultat attendu** :

```text
n=0  cos=+1.0000  sin=+0.0000  module=1.0000  phase=+0.0000 rad
n=1  cos=+0.9980  sin=+0.0627  module=1.0000  phase=+0.0627 rad
n=2  cos=+0.9921  sin=+0.1253  module=1.0000  phase=+0.1254 rad
n=3  cos=+0.9822  sin=+0.1874  module=1.0000  phase=+0.1881 rad
n=4  cos=+0.9685  sin=+0.2491  module=1.0000  phase=+0.2508 rad
n=5  cos=+0.9510  sin=+0.3100  module=1.0000  phase=+0.3135 rad
```

Le module reste constant à 1 (amplitude inchangée) et la phase augmente de $\omega_n$ à chaque échantillon.

---

### Étape 2 : Analyser un filtre avec la transformée en Z

Prenons le filtre passe-bas $y[n] = 0.5 \cdot x[n] + 0.5 \cdot x[n-1]$ (moyenne de deux échantillons).

**Obtenir $H(z)$** :

$$y[n] = 0.5 \cdot x[n] + 0.5 \cdot x[n-1]$$

En transformée en Z ($x[n-1] \to z^{-1} \cdot X(z)$) :

$$Y(z) = 0.5 \cdot X(z) + 0.5 \cdot z^{-1} \cdot X(z) = X(z) \cdot (0.5 + 0.5 \cdot z^{-1})$$

$$H(z) = \frac{Y(z)}{X(z)} = 0.5 \cdot (1 + z^{-1}) = 0.5 \cdot \frac{z + 1}{z}$$

**Trouver les pôles et zéros** :

- Zéros (numérateur $= 0$) : $z + 1 = 0 \implies z = -1$
- Pôles (dénominateur $= 0$) : $z = 0$
- Stabilité : $|\text{pôle}| = |0| = 0 < 1 \implies$ filtre **STABLE**

**Diagramme pôle-zéro** :

```text
                    Imaginaire (j)
                   _____|_____
                 /      |      \
               /        |        \
              |         |         |
   * ---------|----x----|---------|---------> Réel
 z=-1         |   z=0   |         |
              |         |         |
               \        |        /
                 \______|______/
                  cercle unité

  * = zéro en z = -1 (fréquence de Nyquist)
  x = pôle en z = 0 (filtre stable)
```

Le zéro en $z = -1$ annule le signal à la fréquence de Nyquist : c'est bien un filtre passe-bas.

---

### Étape 3 : Calculer la réponse en fréquence

On évalue $H(z)$ sur le cercle unité en posant $z = e^{j\omega}$ :

$$H(e^{j\omega}) = 0.5 \cdot (1 + e^{-j\omega})$$

Module (gain) :

$$|H| = 0.5 \cdot \sqrt{2 + 2\cos(\omega)} = |\cos(\omega/2)|$$

Valeurs clés :

| Fréquence | $\omega$ | Gain | dB |
| --------- | -------- | ---- | -- |
| 0 Hz | $0$ | $\|\cos(0)\| = 1.0$ | +0.0 dB |
| 11025 Hz | $\frac{\pi}{2}$ | $\|\cos(\frac{\pi}{4})\| = 0.7071$ | -3.0 dB |
| 22050 Hz | $\pi$ | $\|\cos(\frac{\pi}{2})\| = 0.0$ | $-\infty$ dB |

Le filtre laisse passer les basses fréquences (gain 1 à 0 Hz) et supprime complètement la fréquence de Nyquist (gain 0).

---

### Étape 4 : Vérifier la correspondance avec Faust

Le filtre $y[n] = 0.5 \cdot x[n] + 0.5 \cdot x[n-1]$ s'écrit en Faust :

```faust
process = _ <: (*(0.5)), (_' : *(0.5)) :> _;
```

Lecture du code : `_` est l'entrée $x[n]$, `<:` la duplique en deux branches, `*(0.5)` multiplie par 0.5 dans la première branche, `_' : *(0.5)` retarde d'un échantillon puis multiplie dans la seconde, et `:>` additionne les deux branches en une sortie unique $y[n]$.

---

## Commandes Utiles

| Formule | Signification |
| ------- | ------------- |
| $z = a + jb$ | Nombre complexe en notation cartésienne |
| $z = r \cdot e^{j\theta}$ | Nombre complexe en notation polaire |
| $e^{j\theta} = \cos(\theta) + j\sin(\theta)$ | Formule d'Euler |
| $\omega = 2\pi f$ | Fréquence angulaire (radians/seconde) |
| $\omega_n = 2\pi f / f_s$ | Fréquence angulaire normalisée (radians/échantillon) |
| $H(z) = Y(z) / X(z)$ | Fonction de transfert d'un filtre |
| $z^{-1}$ | Délai d'un échantillon |

---

## Pièges Fréquents

### Piège 1 : Confondre $i$ et $j$

**Problème** : En mathématiques pures, l'unité imaginaire est $i$. En DSP et en Python (NumPy), c'est $j$ ou `1j`.

**Solution** : En DSP, utiliser toujours $j$. En Python, écrire `1j` (pas `j` seul).

```python
z = 3 + 4j        # Correct
z = complex(3, 4)  # Correct
# z = 3 + j*4     # Erreur : j n'est pas défini comme variable
```

---

### Piège 2 : Oublier la normalisation de la fréquence

**Problème** : Les formules DSP utilisent parfois $f$ (Hz), parfois $\omega$ (rad/s), parfois $\omega_n$ (normalisée). Mélanger ces unités produit des résultats faux.

**Solution** : Vérifier systématiquement l'unité de fréquence :

$$f = 440 \text{ Hz} \qquad \text{(cycles par seconde)}$$

$$\omega = 2\pi \times 440 = 2764.6 \text{ rad/s} \qquad \text{(fréquence angulaire)}$$

$$\omega_n = \frac{2\pi \times 440}{44100} = 0.0627 \qquad \text{(fréquence normalisée, sans unité)}$$

---

### Piège 3 : Confondre transformée de Fourier et transformée en Z

**Problème** : Les deux transformées sont liées mais servent des objectifs différents.

**Solution** :

- Analyser un **SIGNAL** (quelles fréquences ?) - Transformée de Fourier (DFT/FFT)
- Analyser un **FILTRE** (comment il modifie ?) - Transformée en Z

---

### Piège 4 : Croire qu'un pôle sur le cercle unité rend le filtre stable

**Problème** : Un pôle sur le cercle unité ($|p| = 1$) produit une oscillation qui ne s'amortit jamais.

**Solution** : Pour la stabilité, les pôles doivent être **strictement** à l'intérieur ($|p| < 1$, pas $|p| \leq 1$).

---

### Piège 5 : Confondre `'` (prime/délai) et `'` (dérivée) en Faust

**Problème** : En mathématiques, $f'$ est la dérivée. En Faust, `_'` est le signal retardé d'un échantillon.

**Solution** : En Faust, `'` est toujours un délai. `_'` = $x[n-1]$, `_''` = $x[n-2]$.

---

## Checklist de Validation

- [ ] Je sais écrire un nombre complexe en notation cartésienne ($a + jb$) et polaire ($r \cdot e^{j\theta}$)
- [ ] Je sais convertir entre les deux notations (module, phase, partie réelle, partie imaginaire)
- [ ] Je connais la formule d'Euler : $e^{j\theta} = \cos(\theta) + j\sin(\theta)$
- [ ] Je sais calculer la fréquence angulaire $\omega = 2\pi f$ et la fréquence normalisée $\omega_n = \omega / f_s$
- [ ] Je comprends ce que la transformée de Fourier produit : spectre d'amplitude et spectre de phase
- [ ] Je sais la différence entre DFT et FFT (même résultat, vitesse différente)
- [ ] Je sais calculer la fonction de transfert $H(z)$ d'un filtre simple
- [ ] Je sais trouver les pôles et zéros d'une fonction de transfert
- [ ] Je sais vérifier la stabilité d'un filtre (pôles strictement dans le cercle unité)
- [ ] Je comprends la différence entre FIR et IIR
- [ ] Je connais la correspondance entre notation DSP ($z^{-1}$) et Faust (`'`, `mem`)

---

## Exercice Pratique

**Énoncé** :

Cet exercice comporte deux parties.

**Partie 1** : Exprimer un signal sinusoïdal de 440 Hz (La4), d'amplitude 0.8, avec une phase initiale de $\frac{\pi}{4}$ radians, échantillonné à 44100 Hz :

1. Forme trigonométrique : $x[n] = A \cdot \cos(\omega_n \cdot n + \phi)$
2. Forme complexe (Euler) : $x[n] = \text{Re}\left\{ A \cdot e^{j(\omega_n \cdot n + \phi)} \right\}$
3. Calculer les valeurs des 5 premiers échantillons ($n = 0$ à $4$)

**Partie 2** : Soit le filtre $y[n] = 0.5 \cdot x[n] + 0.5 \cdot x[n-1]$ :

1. Écrire la fonction de transfert $H(z)$
2. Trouver les pôles et les zéros
3. Dessiner le diagramme pôle-zéro sur le plan des z
4. Déterminer si le filtre est stable
5. Calculer le gain aux fréquences : 0 Hz, 11025 Hz ($f_s/4$), 22050 Hz ($f_s/2$)

**Indications** :

- Utiliser $\omega_n = 2\pi f / f_s$ et la formule d'Euler
- Remplacer $x[n-1]$ par $z^{-1} \cdot X(z)$ dans l'équation du filtre
- Pour le gain, évaluer $|H(e^{j\omega})|$ ; le gain à $\omega = 0$ se calcule avec $e^{j \cdot 0} = 1$

**Résultat attendu** :

- Partie 1 : 5 valeurs numériques pour le signal (décimales à 4 chiffres)
- Partie 2 : une fonction de transfert, un pôle, un zéro, un diagramme, une conclusion de stabilité, et 3 valeurs de gain

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Partie 1 : Signal sinusoïdal de 440 Hz en notation complexe

**Calcul des paramètres** :

$$f = 440 \text{ Hz} \qquad f_s = 44100 \text{ Hz} \qquad A = 0.8 \qquad \phi = \frac{\pi}{4} = 0.7854 \text{ rad}$$

$$\omega_n = \frac{2\pi \times 440}{44100} = 0.06268 \text{ rad/échantillon}$$

**Forme trigonométrique** : $x[n] = 0.8 \cdot \cos(0.06268 \cdot n + 0.7854)$

**Forme complexe** : $x[n] = \text{Re}\left\{ 0.8 \cdot e^{j(0.06268 \cdot n + 0.7854)} \right\}$

**Calcul des 5 premiers échantillons** :

```python
import numpy as np

omega_n = 2 * np.pi * 440 / 44100
A, phi = 0.8, np.pi / 4

for n in range(5):
    x_n = A * np.cos(omega_n * n + phi)
    print(f"n={n}  angle={omega_n*n + phi:.4f} rad  x[n]={x_n:+.4f}")
```

```text
n=0  angle=0.7854 rad  x[n]=+0.5657
n=1  angle=0.8481 rad  x[n]=+0.5283
n=2  angle=0.9108 rad  x[n]=+0.4894
n=3  angle=0.9735 rad  x[n]=+0.4491
n=4  angle=1.0362 rad  x[n]=+0.4076
```

Les valeurs décroissent car la phase initiale $\frac{\pi}{4}$ place le signal dans la partie descendante du cosinus.

---

### Partie 2 : Analyse du filtre passe-bas

**1. Fonction de transfert** :

$$Y(z) = 0.5 \cdot X(z) + 0.5 \cdot z^{-1} \cdot X(z) = X(z) \cdot (0.5 + 0.5 \cdot z^{-1})$$

$$H(z) = 0.5 + 0.5 \cdot z^{-1} = 0.5 \cdot \frac{z + 1}{z}$$

**2. Pôles et zéros** :

- Zéro : $z + 1 = 0 \implies z = -1$
- Pôle : $z = 0$

**3. Diagramme pôle-zéro** :

```text
                    Imaginaire (j)
                   ______|______
                 /       |       \
               /         |         \
              |          |          |
   *----------|----x-----|----------|---------> Réel
 z=-1         |   z=0    |          |     z=+1
              |          |          |
               \         |         /
                 \_______|_______/
                  cercle unité

  * = zéro en z = -1  (angle = pi → fréquence = fs/2)
  x = pôle en z = 0   (au centre)
```

**4. Stabilité** :

Le pôle est en $z = 0$. $|0| = 0 < 1$ : le pôle est strictement à l'intérieur du cercle unité. Le filtre est **STABLE**.

**5. Gain aux fréquences demandées** :

Formule : $|H(e^{j\omega})| = |\cos(\omega/2)|$

| Fréquence | $\omega$ | Gain | dB | Interprétation |
| --------- | -------- | ---- | -- | -------------- |
| 0 Hz | $0$ | $1.0$ | +0.0 dB | Passe intégralement |
| 11025 Hz | $\frac{\pi}{2}$ | $0.7071$ | -3.0 dB | Atténue de moitié en puissance |
| 22050 Hz | $\pi$ | $0.0$ | $-\infty$ dB | Supprime complètement |

---

## Navigation

← Fiche précédente : **[02 - Audio numérique et théorie du signal](02-audio-numerique-theorie-signal.md)**

→ Fiche suivante : **[04 - Synthèse sonore - théorie](04-synthese-sonore-theorie.md)**
