---
tags:
  - Faust
  - Expert
  - Concept
description: "Faust et Machine Learning (DDSP) - Differentiable DSP, auto-différentiation, PyTorch et neural audio synthesis"
estimated_time: "65 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 6 - Intégration et projets avancés"
---

# 05 - Faust et Machine Learning (DDSP)

> **En bref** : À la fin de cette fiche, tu sauras expliquer le concept de DDSP, comprendre comment Faust s'intègre avec PyTorch pour la synthèse audio neuronale, et identifier les cas d'usage pertinents. Lecture estimée : 65 min.


## Prérequis

- Avoir complété la [**Phase 4 - DSP appliqué**](../04-dsp-applique/index.md) (fiches 01 à 05)
- Comprendre les oscillateurs, filtres et effets audio en Faust
- Savoir compiler un programme Faust et exporter vers différentes cibles
- Notions de base en machine learning recommandées (réseau de neurones, gradient, entraînement) mais pas obligatoires : tout est expliqué ci-dessous

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le concept de DDSP, comprendre comment Faust s'intègre avec PyTorch pour la synthèse audio neuronale, et identifier les cas d'usage pertinents.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Neural Audio Synthesis ?

**Définition** : Le Neural Audio Synthesis est un domaine de recherche qui utilise des réseaux de neurones pour générer, transformer ou analyser des signaux audio. Au lieu de programmer manuellement des algorithmes de synthèse (oscillateurs, filtres), on entraîne un modèle à produire du son en lui montrant des exemples.

**Le problème que le Neural Audio Synthesis résout** :

Sans Neural Audio Synthesis, voici les problèmes rencontrés :

1. **Modélisation limitée** : Certains sons (voix humaine, instruments acoustiques complexes) sont très difficiles à reproduire fidèlement avec des algorithmes classiques. La programmation manuelle de chaque nuance est un travail considérable.
2. **Paramétrage manuel** : Chaque son cible nécessite un ajustement manuel des paramètres du synthétiseur. Un ingénieur du son doit passer des heures à régler des dizaines de paramètres pour approcher un timbre particulier.
3. **Rigidité des modèles** : Un algorithme de synthèse classique est conçu pour un type de son précis. Passer d'une guitare à une flute nécessite un algorithme complètement différent.

**Comment le Neural Audio Synthesis résout ces problèmes** :

| Problème | Solution apportée par le Neural Audio Synthesis |
| -------- | ------------------------------------------------ |
| Modélisation limitée | Le réseau apprend automatiquement les caractéristiques du son à partir d'exemples |
| Paramétrage manuel | Le réseau trouve lui-même les bons paramètres en s'entraînant sur des données |
| Rigidité des modèles | Un même modèle peut s'adapter à différents sons en changeant les données d'entraînement |

**Analogie concrète** : Imagine un peintre qui copie un tableau. Avec la synthèse classique, on lui donne un guide pas-à-pas ("trace un trait ici, mélange ces couleurs"). Avec le Neural Audio Synthesis, on lui montre le tableau original et il apprend par lui-même à le reproduire en essayant encore et encore, en corrigeant ses erreurs à chaque tentative.

**Principales approches de Neural Audio Synthesis** :

| Approche | Principe | Avantage | Inconvénient |
| -------- | -------- | -------- | ------------ |
| WaveNet (2016) | Réseau autorégressif, prédit un échantillon à la fois | Qualité très élevée | Extrêmement lent (des heures pour 1 seconde d'audio) |
| SampleRNN (2017) | Réseau récurrent multi-échelle | Plus rapide que WaveNet | Qualité inférieure, artefacts |
| RAVE (2021) | Auto-encodeur variationnel en temps réel | Temps réel possible | Requiert beaucoup de données d'entraînement |
| DDSP (2020) | Réseau + modules DSP différentiables | Meilleure qualité, moins de paramètres | Limité aux sons harmoniques (dans sa forme de base) |

---

### Qu'est-ce que DDSP (Differentiable Digital Signal Processing) ?

**Définition** : DDSP (Differentiable Digital Signal Processing) est une approche qui combine des modules de traitement du signal classiques (oscillateurs, filtres, enveloppes) avec l'apprentissage profond. Le mot "differentiable" signifie que ces modules DSP sont rendus dérivables mathématiquement, ce qui permet de les entraîner avec la backpropagation, la même technique utilisée pour entraîner les réseaux de neurones.

**Le problème que DDSP résout** :

Sans DDSP, voici les problèmes rencontrés :

1. **Réseaux de neurones trop coûteux** : Les approches purement neuronales (WaveNet, SampleRNN) doivent apprendre toute la physique du son à partir de zéro. Elles ont besoin de millions de paramètres et de jours d'entraînement sur GPU.
2. **Artefacts audibles** : Les réseaux de neurones classiques génèrent le signal échantillon par échantillon ou par blocs. Ils produisent souvent des craquements, du souffle ou des discontinuités perceptibles.
3. **Pas de structure audio** : Un réseau de neurones classique ne sait pas ce qu'est un harmonique, une fréquence fondamentale ou une enveloppe. Il doit tout redécouvrir dans les données, ce qui est inefficace.

**Comment DDSP résout ces problèmes** :

| Problème | Solution apportée par DDSP |
| -------- | -------------------------- |
| Réseaux trop coûteux | Les modules DSP apportent la structure (oscillateurs, filtres), le réseau n'a qu'à apprendre les paramètres. Résultat : 100x moins de paramètres |
| Artefacts audibles | Les modules DSP produisent des signaux propres par construction (un oscillateur sinusoidal ne craque pas) |
| Pas de structure audio | Le DSP encode la connaissance acoustique (harmoniques, enveloppes, formants), le réseau de neurones l'exploite |

**Analogie concrète** : Imagine que tu veux apprendre à un robot à jouer du piano. L'approche neuronale pure revient à lui donner des mains articulées et des milliers d'heures d'enregistrements : il doit tout découvrir seul. L'approche DDSP revient à lui fournir un piano mécanique (les modules DSP) et à lui apprendre uniquement quelles touches appuyer et avec quelle force (les paramètres). Le robot apprend plus vite car le mécanisme est déjà construit.

**Ce que DDSP n'est PAS** :

- DDSP n'est pas un réseau de neurones classique. Il ne génère pas le signal audio directement. Il utilise un réseau de neurones uniquement pour prédire les paramètres de modules DSP qui, eux, produisent le son.
- DDSP n'est pas un simple synthétiseur. Un synthétiseur classique utilise des paramètres fixes ou contrôlés manuellement. DDSP apprend automatiquement les bons paramètres à partir de données audio.
- DDSP n'est pas limité à un seul type de son. On peut changer les modules DSP (oscillateurs additifs, soustractifs, FM) pour s'adapter à différents types de sons.

**Comparaison Neural Audio classique vs DDSP** :

| Neural Audio classique | DDSP |
| ---------------------- | ---- |
| Génère le signal brut (échantillon par échantillon) | Génère des paramètres pour des modules DSP |
| Millions de paramètres | Milliers de paramètres |
| Artefacts fréquents | Signal propre (garanti par le DSP) |
| Boîte noire (pas d'interprétation) | Paramètres interprétables (fréquence, amplitude, filtre) |
| Entraînement long (jours) | Entraînement court (heures) |
| Temps réel difficile | Temps réel plus accessible |

---

### Qu'est-ce que l'auto-différentiation ?

**Définition** : L'auto-différentiation est une technique qui permet à un programme informatique de calculer automatiquement les dérivées (gradients) de ses sorties par rapport à ses entrées. En machine learning, les gradients indiquent dans quelle direction modifier les paramètres d'un modèle pour réduire l'erreur. C'est le moteur de l'entraînement par backpropagation.

**Le problème que l'auto-différentiation résout** :

Sans auto-différentiation, voici les problèmes rencontrés :

1. **Calcul manuel des dérivées** : Pour chaque programme DSP, il faudrait calculer à la main la dérivée de chaque opération. Pour un programme complexe avec des centaines d'opérations, c'est une tâche titanesque et sujette aux erreurs.
2. **Différentiation numérique imprécise** : L'alternative est la différentiation numérique (calculer la dérivée par approximation avec de petites perturbations). Cette méthode est lente (il faut évaluer le programme deux fois par paramètre) et imprécise (erreurs d'arrondi).
3. **Pas d'entraînement possible** : Sans gradients, impossible d'utiliser la descente de gradient pour ajuster les paramètres du DSP. L'entraînement automatique est bloqué.

**Comment l'auto-différentiation résout ces problèmes** :

| Problème | Solution apportée par l'auto-différentiation |
| -------- | --------------------------------------------- |
| Calcul manuel | Le compilateur génère automatiquement le code de la dérivée |
| Imprécision numérique | Les dérivées sont exactes (pas d'approximation) |
| Pas d'entraînement | Les gradients permettent la descente de gradient et donc l'entraînement |

**Analogie concrète** : Imagine que tu fais une recette de cuisine et que le plat est trop salé. L'auto-différentiation te dit exactement de combien réduire chaque ingrédient pour que le plat soit moins salé. Sans elle, tu devrais goûter le plat, changer un ingrédient au hasard, re-goûter, et recommencer des centaines de fois. Avec elle, tu obtiens directement la correction optimale.

**Ce que l'auto-différentiation n'est PAS** :

- L'auto-différentiation n'est pas la différentiation symbolique (comme dans un logiciel de calcul formel). Elle ne simplifie pas les expressions mathématiques. Elle calcule les valeurs numériques des dérivées pour des entrées données.
- L'auto-différentiation n'est pas la différentiation numérique (approximation par perturbation). Elle est exacte et efficace, pas une estimation.

---

### Comment Faust supporte l'auto-différentiation ?

**Définition** : Le compilateur Faust peut générer automatiquement le code de la dérivée d'un programme Faust. Pour chaque programme qui calcule `y = f(x, p1, p2, ...)` (où `p1, p2` sont des paramètres), Faust peut produire un second programme qui calcule `dy/dp1, dy/dp2, ...` (les dérivées partielles de la sortie par rapport à chaque paramètre).

**Le problème que l'auto-différentiation dans Faust résout** :

Sans cette fonctionnalité, voici les problèmes rencontrés :

1. **Incompatibilité DSP/ML** : Les programmes Faust ne sont pas directement utilisables dans un pipeline d'entraînement PyTorch ou TensorFlow. Pas de gradient = pas d'optimisation.
2. **Réécriture manuelle** : Il faudrait réécrire le programme Faust en Python/PyTorch pour obtenir les gradients. Cette réécriture est fastidieuse et peut introduire des bugs.
3. **Perte de l'expertise Faust** : Les bibliothèques Faust (`stdfaust.lib`) contiennent des centaines de modules DSP optimisés. Sans auto-différentiation, on perd tout ce travail accumulé.

**Comment Faust résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Incompatibilité DSP/ML | Le compilateur produit des programmes différentiables directement |
| Réécriture manuelle | Le code dérivé est généré automatiquement, sans intervention humaine |
| Perte de l'expertise | Les bibliothèques Faust restent utilisables telles quelles |

**Principe de fonctionnement** :

Le compilateur Faust applique les règles de dérivation en chaîne (chain rule) sur le graphe de signal interne du programme :

```text
Programme original :           Programme dérivé (généré) :

entrée ──> [×gain] ──> sortie   entrée ──> [dérivée de ×gain] ──> gradient
                                          par rapport à gain

y = x × gain                    dy/d(gain) = x
```

Chaque opération primitive a une dérivée connue :

| Opération | Dérivée par rapport au paramètre `p` |
| --------- | ------------------------------------- |
| `x + p` | `1` |
| `x * p` | `x` |
| `sin(p)` | `cos(p)` |
| `x @ delay` | Dérivée du délai (plus complexe) |

Le compilateur compose ces dérivées élémentaires pour obtenir la dérivée du programme complet.

---

### Qu'est-ce que faust2pytorch ?

**Définition** : `faust2pytorch` est un outil (en cours de développement dans l'écosystème de recherche Faust) qui exporte un programme Faust comme un module PyTorch différentiable. Le programme DSP écrit en Faust devient un "layer" (couche) dans un réseau de neurones PyTorch, avec des gradients calculés automatiquement.

**Le problème que faust2pytorch résout** :

Sans faust2pytorch, voici les problèmes rencontrés :

1. **Deux mondes séparés** : Le DSP est écrit en Faust et le machine learning est écrit en Python/PyTorch. Ces deux mondes ne communiquent pas nativement.
2. **Pas de gradient à travers le DSP** : PyTorch peut calculer les gradients de ses propres opérations, mais pas d'un programme Faust externe. L'entraînement s'arrête à la frontière du DSP.
3. **Performances insuffisantes** : Réécrire le DSP en Python pur est possible mais très lent. Faust compile en C++ optimisé, Python est interprété.

**Comment faust2pytorch résout ces problèmes** :

| Problème | Solution apportée par faust2pytorch |
| -------- | ----------------------------------- |
| Deux mondes séparés | Le programme Faust est encapsulé dans un module PyTorch natif |
| Pas de gradient | Le code dérivé généré par Faust est intégré dans le backward pass de PyTorch |
| Performances | Le DSP reste compilé en C++ optimisé, appelé depuis PyTorch via des bindings |

**Analogie concrète** : Imagine un traducteur entre deux entreprises qui parlent des langues différentes. L'entreprise Faust parle "C++ optimisé pour l'audio" et l'entreprise PyTorch parle "Python pour le machine learning". `faust2pytorch` est le traducteur qui permet aux deux entreprises de travailler ensemble sur un projet commun, sans que l'une doive apprendre la langue de l'autre.

**Ce que faust2pytorch n'est PAS** :

- `faust2pytorch` n'est pas un convertisseur de code Faust en Python. Le code Faust reste compilé en C++ natif. Seule l'interface est exposée à Python/PyTorch.
- `faust2pytorch` n'est pas un outil de production stable (en 2025). C'est un outil de recherche en développement actif. L'API et les fonctionnalités peuvent évoluer.

---

### Qu'est-ce que l'architecture DDSP typique ?

**Définition** : L'architecture DDSP typique est un pipeline en trois parties : un encoder (réseau de neurones) qui analyse un son cible, un décodeur de paramètres qui produit les réglages DSP, et un synthétiseur (modules DSP Faust) qui génère le signal audio final. L'ensemble est entraîné de bout en bout par descente de gradient.

**Le problème que cette architecture résout** :

Sans cette architecture, voici les problèmes rencontrés :

1. **Pas de lien entre analyse et synthèse** : On peut analyser un son (extraire sa fréquence, son timbre) et on peut synthétiser un son (avec un oscillateur), mais connecter automatiquement l'analyse à la synthèse nécessite un humain pour régler les paramètres.
2. **Paramètres DSP non optimaux** : Un humain peut approcher les bons paramètres, mais ne trouvera jamais la combinaison optimale parmi des milliers de possibilités.

**Comment cette architecture résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de lien analyse/synthèse | L'encoder analyse le son et le décodeur produit directement les paramètres |
| Paramètres non optimaux | La descente de gradient explore l'espace des paramètres de manière systématique |

**Schéma du pipeline DDSP** :

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        PIPELINE DDSP                                │
│                                                                     │
│  ┌──────────┐     ┌──────────────┐     ┌───────────────────────┐   │
│  │  AUDIO   │     │   ENCODER    │     │ DÉCODEUR PARAMÈTRES   │   │
│  │  CIBLE   │────>│  (réseau de  │────>│ (couches denses)      │   │
│  │ (entrée) │     │   neurones)  │     │                       │   │
│  └──────────┘     └──────────────┘     └───────────┬───────────┘   │
│                                                     │               │
│                          ┌──────────────────────────┘               │
│                          │ paramètres DSP                           │
│                          │ (f0, amplitudes,                         │
│                          │  coefficients filtre)                    │
│                          v                                          │
│                   ┌──────────────┐                                  │
│                   │ SYNTHÉTISEUR │                                  │
│                   │    FAUST     │                                  │
│                   │ (oscillateur │                                  │
│                   │  + filtre    │     ┌──────────┐                 │
│                   │  + enveloppe)│────>│  AUDIO   │                 │
│                   └──────────────┘     │ GÉNÉRÉ   │                 │
│                                        │ (sortie) │                 │
│                                        └────┬─────┘                 │
│                                             │                       │
│  ┌──────────┐                               │                       │
│  │  AUDIO   │         ┌──────────┐          │                       │
│  │  CIBLE   │────────>│   LOSS   │<─────────┘                       │
│  │ (copie)  │         │ FUNCTION │                                  │
│  └──────────┘         └────┬─────┘                                  │
│                            │                                        │
│                            │ erreur (gradient)                      │
│                            │                                        │
│                            v                                        │
│                   BACKPROPAGATION                                   │
│                   (mise à jour de                                   │
│                   l'encoder et du                                   │
│                   décodeur)                                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Explication pas à pas du pipeline** :

1. **Audio cible** : Un enregistrement du son que l'on veut reproduire (par exemple, une note de violon)
2. **Encoder** : Un réseau de neurones (souvent un CNN ou un RNN) qui extrait des caractéristiques du son cible (fréquence fondamentale, enveloppe spectrale, dynamique)
3. **Décodeur de paramètres** : Des couches denses qui convertissent les caractéristiques en paramètres DSP concrets (fréquence de l'oscillateur, coefficients du filtre, courbe d'enveloppe)
4. **Synthétiseur Faust** : Les modules DSP Faust qui génèrent le signal audio à partir des paramètres reçus. Ces modules sont différentiables
5. **Loss function** : Mesure la différence entre le son cible et le son généré. Typiquement, on compare les spectrogrammes (représentation fréquentielle)
6. **Backpropagation** : Le gradient de l'erreur remonte à travers le synthétiseur Faust, puis le décodeur, puis l'encoder. Chaque composant ajuste ses paramètres pour réduire l'erreur

---

### Qu'est-ce que DiffFaust ?

**Définition** : DiffFaust est une bibliothèque de recherche qui rend les programmes Faust différentiables pour l'entraînement par descente de gradient. Elle fournit les outils pour connecter des programmes Faust au framework PyTorch et calculer les gradients à travers le graphe de signal Faust.

**Le problème que DiffFaust résout** :

Sans DiffFaust, voici les problèmes rencontrés :

1. **Intégration manuelle complexe** : Connecter Faust à PyTorch nécessite d'écrire du code de liaison (bindings) C++/Python, de gérer la mémoire, de synchroniser les buffers audio.
2. **Gradients non disponibles** : Le code C++ généré par Faust n'expose pas ses gradients au framework PyTorch. L'entraînement est impossible.

**Comment DiffFaust résout ces problèmes** :

| Problème | Solution apportée par DiffFaust |
| -------- | ------------------------------- |
| Intégration manuelle | DiffFaust fournit des wrappers PyTorch prêts à l'emploi |
| Gradients non disponibles | DiffFaust utilise l'auto-différentiation de Faust pour exposer les gradients |

**Ce que DiffFaust n'est PAS** :

- DiffFaust n'est pas un produit commercial. C'est un projet de recherche académique, principalement développé au GRAME (Centre national de création musicale, Lyon).
- DiffFaust n'est pas nécessaire pour utiliser Faust dans ses cas d'usage standard (synthèse audio, effets, plugins). Il est uniquement utile pour les projets qui combinent Faust et machine learning.

---

### Quelles sont les applications de DDSP avec Faust ?

**Définition** : Les applications de DDSP avec Faust couvrent tous les cas où l'on veut combiner la qualité du traitement du signal classique avec la capacité d'apprentissage du machine learning. Voici les principales applications.

**Application 1 : Synthèse de voix**

Le système apprend à reproduire une voix humaine à partir d'enregistrements. L'encoder extrait la fréquence fondamentale (f0) et le contenu harmonique. Le synthétiseur Faust utilise un oscillateur additif (somme de sinusoïdes) et un filtre pour reproduire le timbre vocal.

```text
Voix enregistrée ──> [Encoder] ──> f0, harmoniques, enveloppe
                                         │
                                         v
                     [Oscillateur additif Faust] + [Filtre Faust]
                                         │
                                         v
                                   Voix synthétisée
```

**Application 2 : Transfert de timbre**

L'idée : jouer du violon avec sa voix. Tu chantes dans un micro, le système analyse ta voix et rejoue la mélodie avec le timbre d'un violon. L'encoder extrait le pitch et la dynamique de ta voix. Le synthétiseur Faust utilise un modèle de violon (modélisation physique ou synthèse additive) entraîné sur des enregistrements de violon.

**Application 3 : Modélisation d'amplis guitare**

Un amplificateur de guitare à lampes a un comportement non linéaire complexe (saturation, résonances, réponse en fréquence). DDSP permet de modéliser ce comportement en entraînant un synthétiseur Faust (filtre non linéaire + EQ) à reproduire le son de l'ampli réel.

**Application 4 : Suppression de bruit**

Le système apprend à séparer la voix du bruit de fond. L'encoder identifie les composantes de bruit. Le synthétiseur Faust applique un filtre adaptatif qui atténue les fréquences du bruit tout en préservant la voix.

**Application 5 : Séparation de sources**

Séparer les instruments dans un mix audio (extraire la voix, la batterie, la basse). Chaque source est modélisée par un synthétiseur Faust différent. Le système apprend à distribuer les paramètres DSP pour que la somme des synthétiseurs reproduise le mix original.

---

### Quelles sont les limites actuelles de DDSP avec Faust ?

**Définition** : Malgré ses promesses, l'approche DDSP avec Faust présente des limites techniques et pratiques qu'il faut connaître avant de se lancer dans un projet.

**Limite 1 : Temps d'entraînement**

L'entraînement d'un modèle DDSP prend typiquement plusieurs heures sur un GPU moderne. Le passage des gradients à travers le code DSP compilé est plus lent qu'à travers des opérations PyTorch natives.

| Modèle | Données | GPU | Temps d'entraînement |
| ------ | ------- | --- | -------------------- |
| Modèle de voix (DDSP simple) | 10 min d'audio | NVIDIA RTX 3080 | 2-4 heures |
| Modélisation d'ampli | 30 min d'audio | NVIDIA RTX 3080 | 4-8 heures |
| Transfert de timbre | 1h d'audio | NVIDIA A100 | 12-24 heures |

**Limite 2 : Temps réel pas toujours possible**

Le synthétiseur Faust seul fonctionne en temps réel. Mais l'encoder (réseau de neurones) peut être trop lourd pour le temps réel. Il faut un GPU pour l'inférence rapide, ce qui limite le déploiement sur des systèmes embarqués ou des pédales d'effet.

**Limite 3 : Complexité de l'intégration**

Le pipeline complet (collecte de données, pré-traitement, entraînement, export, déploiement) implique plusieurs langages et outils (Python, C++, Faust, PyTorch, CUDA). La mise en place nécessite une expertise dans chacun de ces domaines.

**Limite 4 : Maturité de l'écosystème**

Les outils (faust2pytorch, DiffFaust) sont encore en phase de recherche. La documentation est limitée, les API peuvent changer, et le support communautaire est restreint aux groupes de recherche académique.

**Limite 5 : Sons non harmoniques**

L'architecture DDSP de base (oscillateur additif + bruit filtré) fonctionne bien pour les sons harmoniques (voix, violon, flûte) mais moins bien pour les sons percussifs, les bruits complexes ou les textures non harmoniques.

---

## Étapes Pratiques

### Étape 1 : Comprendre le pipeline DDSP (schéma)

Avant de toucher au code, il faut comprendre comment les différentes parties du pipeline DDSP interagissent.

Le pipeline DDSP se décompose en 5 étapes lors de l'entraînement :

```text
ÉTAPE 1 : PRÉPARATION DES DONNÉES
──────────────────────────────────
Enregistrement audio ──> Découpage en segments ──> Extraction de features
                                                    (f0, loudness, MFCC)

ÉTAPE 2 : FORWARD PASS (propagation avant)
───────────────────────────────────────────
Features ──> [Encoder NN] ──> Paramètres DSP ──> [Synthétiseur Faust] ──> Audio généré

ÉTAPE 3 : CALCUL DE L'ERREUR
─────────────────────────────
Audio cible ──> [Spectrogramme] ──┐
                                   ├──> [Loss = différence spectrale]
Audio généré ──> [Spectrogramme] ──┘

ÉTAPE 4 : BACKWARD PASS (rétropropagation)
──────────────────────────────────────────
Loss ──> gradient à travers [Synthétiseur Faust]
     ──> gradient à travers [Encoder NN]

ÉTAPE 5 : MISE À JOUR
──────────────────────
Paramètres de l'Encoder ──> ajustés par l'optimiseur (Adam, SGD)
```

La particularité de DDSP par rapport à un pipeline de machine learning classique est l'étape 4 : le gradient doit traverser le synthétiseur Faust. C'est pourquoi le synthétiseur doit être différentiable.

Lors de l'inférence (utilisation après entraînement), seules les étapes 2 sont nécessaires :

```text
INFÉRENCE (temps réel possible)
────────────────────────────────
Audio entrée ──> [Encoder NN entraîné] ──> Paramètres DSP ──> [Synthétiseur Faust] ──> Audio sortie
```

---

### Étape 2 : Examiner un programme Faust différentiable

Voici un exemple simple de programme Faust qui peut être rendu différentiable. Ce programme est un synthétiseur additif minimal avec deux paramètres apprenables : la fréquence et l'amplitude.

```faust
import("stdfaust.lib");

// ──────────────────────────────────────────────
// Synthétiseur additif simple (2 harmoniques)
// Ce programme a 4 paramètres :
//   - freq : fréquence fondamentale (Hz)
//   - amp1 : amplitude du 1er harmonique
//   - amp2 : amplitude du 2e harmonique
//   - cutoff : fréquence de coupure du filtre
// ──────────────────────────────────────────────

// Paramètres (en mode normal, contrôlés par des sliders)
// En mode DDSP, ces valeurs sont fournies par le réseau de neurones
freq = hslider("freq [unit:Hz]", 440, 20, 4000, 0.1);
amp1 = hslider("amp1", 0.5, 0, 1, 0.01);
amp2 = hslider("amp2", 0.25, 0, 1, 0.01);
cutoff = hslider("cutoff [unit:Hz]", 2000, 100, 10000, 1);

// Synthèse additive : fondamentale + 2e harmonique
// os.osc(f) produit une sinusoïde à la fréquence f
harmonique1 = os.osc(freq) * amp1;        // Fondamentale
harmonique2 = os.osc(freq * 2) * amp2;    // 2e harmonique (octave)

// Somme des harmoniques
synthese = harmonique1 + harmonique2;

// Filtre passe-bas pour adoucir le timbre
// fi.lowpass(ordre, frequence_coupure)
process = synthese : fi.lowpass(2, cutoff);
```

Ce programme est un bon candidat pour DDSP car :

- Il a des paramètres explicites (freq, amp1, amp2, cutoff)
- Chaque opération (oscillateur, multiplication, addition, filtre) est différentiable
- Le nombre de paramètres est faible (4), donc l'entraînement sera rapide

En mode DDSP, les sliders sont remplacés par les sorties du réseau de neurones. Le gradient de la sortie audio par rapport à chaque paramètre indique comment ajuster les paramètres pour se rapprocher du son cible.

Pour visualiser ce programme :

```bash
# Génère le diagramme SVG du synthétiseur
faust -svg synth-additif.dsp

# Ouvre le diagramme (le fichier est dans synth-additif-svg/process.svg)
```

**Résultat attendu** :

```text
Le diagramme montre :
- Deux oscillateurs (os.osc) recevant freq et freq*2
- Deux multiplications par amp1 et amp2
- Une addition des deux signaux
- Un filtre passe-bas (fi.lowpass) avec le paramètre cutoff
```

---

### Étape 3 : Aperçu de l'export vers PyTorch

Cette étape montre comment un programme Faust peut être intégré dans un pipeline PyTorch. Le code Python ci-dessous est un aperçu simplifié du workflow. Il n'est pas exécutable tel quel car il nécessite l'installation de DiffFaust et de ses dépendances.

Structure du projet :

```text
projet-ddsp/
├── synth.dsp              # Programme Faust (le synthétiseur)
├── train.py               # Script d'entraînement PyTorch
├── data/
│   └── recordings/        # Enregistrements audio cibles
│       ├── note_a4.wav
│       ├── note_c5.wav
│       └── ...
└── models/
    └── encoder.pt         # Modèle entraîné (généré après entraînement)
```

Aperçu du script d'entraînement :

```python
import torch
import torch.nn as nn

# ──────────────────────────────────────────────
# ÉTAPE 1 : Définir l'encoder (réseau de neurones)
# ──────────────────────────────────────────────

class Encoder(nn.Module):
    """
    L'encoder analyse un spectrogramme et produit
    les paramètres DSP pour le synthétiseur Faust.

    Entrée : spectrogramme (représentation fréquentielle du son cible)
    Sortie : 4 paramètres (freq, amp1, amp2, cutoff)
    """
    def __init__(self):
        super().__init__()
        # Trois couches denses (fully connected)
        # 128 bins de fréquence en entrée
        self.fc1 = nn.Linear(128, 256)
        self.fc2 = nn.Linear(256, 128)
        # 4 paramètres DSP en sortie
        self.fc3 = nn.Linear(128, 4)

    def forward(self, spectrogram):
        # Chaque couche applique une transformation linéaire + activation ReLU
        x = torch.relu(self.fc1(spectrogram))
        x = torch.relu(self.fc2(x))
        # La dernière couche utilise sigmoid pour borner les paramètres entre 0 et 1
        params = torch.sigmoid(self.fc3(x))
        return params

# ──────────────────────────────────────────────
# ÉTAPE 2 : Charger le synthétiseur Faust comme module PyTorch
# ──────────────────────────────────────────────

# NOTE : Ce code nécessite DiffFaust installé
# from difffaust import FaustModule
#
# # Charge le programme Faust et le rend différentiable
# synth = FaustModule("synth.dsp")
#
# # Le module expose les paramètres du programme Faust :
# # synth.set_param("freq", value)    -> fréquence de l'oscillateur
# # synth.set_param("amp1", value)    -> amplitude harmonique 1
# # synth.set_param("amp2", value)    -> amplitude harmonique 2
# # synth.set_param("cutoff", value)  -> fréquence de coupure du filtre

# ──────────────────────────────────────────────
# ÉTAPE 3 : Boucle d'entraînement (simplifiée)
# ──────────────────────────────────────────────

# encoder = Encoder()
# optimizer = torch.optim.Adam(encoder.parameters(), lr=0.001)
# loss_fn = nn.MSELoss()  # Mean Squared Error sur les spectrogrammes
#
# for epoch in range(100):
#     for audio_cible in dataset:
#         # 1. Extraire le spectrogramme du son cible
#         spectrogram_cible = extract_spectrogram(audio_cible)
#
#         # 2. L'encoder prédit les paramètres DSP
#         params = encoder(spectrogram_cible)
#
#         # 3. Le synthétiseur Faust génère le son
#         #    Les paramètres sont normalisés [0,1] -> plages réelles
#         audio_genere = synth(
#             freq=params[0] * 3980 + 20,       # [0,1] -> [20, 4000] Hz
#             amp1=params[1],                     # [0,1]
#             amp2=params[2],                     # [0,1]
#             cutoff=params[3] * 9900 + 100       # [0,1] -> [100, 10000] Hz
#         )
#
#         # 4. Calculer la loss (différence spectrale)
#         spectrogram_genere = extract_spectrogram(audio_genere)
#         loss = loss_fn(spectrogram_genere, spectrogram_cible)
#
#         # 5. Backpropagation (le gradient traverse le synthétiseur Faust)
#         optimizer.zero_grad()
#         loss.backward()  # Le gradient remonte à travers synth et encoder
#         optimizer.step()  # Met à jour les poids de l'encoder
#
#     print(f"Epoch {epoch}, Loss: {loss.item():.4f}")
```

Les points importants dans ce code :

- L'encoder est un réseau de neurones classique PyTorch
- Le synthétiseur Faust est chargé comme un module PyTorch via DiffFaust
- `loss.backward()` calcule les gradients à travers le synthétiseur Faust ET l'encoder
- L'optimiseur met à jour uniquement les poids de l'encoder (le DSP ne change pas, seuls ses paramètres d'entrée changent)

---

### Étape 4 : Analyser un cas d'usage - modélisation d'ampli guitare

La modélisation d'ampli guitare est l'un des cas d'usage les plus concrets de DDSP avec Faust. L'objectif : reproduire numériquement le son d'un amplificateur analogique à lampes.

**Pourquoi DDSP est adapté à ce problème** :

Un ampli guitare est fondamentalement un système de traitement du signal : il prend un signal de guitare en entrée, applique de la distorsion (saturation des lampes), un filtre (tone stack) et une simulation de haut-parleur (cabinet). Ces composants correspondent directement à des modules DSP Faust.

**Architecture DDSP pour la modélisation d'ampli** :

```text
┌─────────────────────────────────────────────────────────────────────┐
│                  MODÉLISATION D'AMPLI DDSP                          │
│                                                                     │
│                                                                     │
│  ┌─────────────┐    ┌───────────────────────────────────────────┐   │
│  │   SIGNAL    │    │         SYNTHÉTISEUR FAUST                │   │
│  │   GUITARE   │───>│                                           │   │
│  │  (entrée)   │    │  ┌──────────┐  ┌────────┐  ┌──────────┐  │   │
│  └─────────────┘    │  │ PRÉ-AMP  │  │ TONE   │  │ CABINET  │  │   │
│                     │  │ (wavesh. │─>│ STACK  │─>│ (FIR     │  │   │
│  ┌─────────────┐    │  │  + gain) │  │(3-band │  │  filter) │  │   │
│  │  PARAMÈTRES │───>│  │         │  │  EQ)   │  │         │  │   │
│  │  APPRIS     │    │  └──────────┘  └────────┘  └────┬─────┘  │   │
│  │  (réseau    │    │                                  │        │   │
│  │   de neur.) │    └──────────────────────────────────│────────┘   │
│  └─────────────┘                                       │            │
│                                                        v            │
│                                                 ┌──────────┐       │
│                                                 │  AUDIO   │       │
│                                                 │ AMPLIFIÉ │       │
│                                                 │ (sortie) │       │
│                                                 └──────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

**Modules DSP Faust utilisés** :

```faust
import("stdfaust.lib");

// ──────────────────────────────────────────────
// Module 1 : Pré-amplificateur (distorsion)
// Simule la saturation des lampes avec un waveshaper
// ──────────────────────────────────────────────

// Le gain de pré-amplification contrôle le niveau de distorsion
// Plus le gain est élevé, plus le signal sature
preamp_gain = hslider("preamp_gain", 5.0, 1.0, 50.0, 0.1);

// Fonction de saturation (tangente hyperbolique)
// tanh(x) compresse les valeurs entre -1 et 1
// C'est une approximation du comportement des lampes
waveshaper(x) = ma.tanh(x * preamp_gain);

// ──────────────────────────────────────────────
// Module 2 : Tone Stack (égaliseur 3 bandes)
// Simule les potentiomètres Bass, Mid, Treble de l'ampli
// ──────────────────────────────────────────────

bass = hslider("bass", 0.5, 0, 1, 0.01);
mid = hslider("mid", 0.5, 0, 1, 0.01);
treble = hslider("treble", 0.5, 0, 1, 0.01);

// Filtre passe-bas pour les basses (< 300 Hz)
low_shelf = fi.lowshelf(2, (bass - 0.5) * 12, 300);

// Filtre en cloche pour les médiums (1000 Hz)
mid_peak = fi.peak_eq(mid * 12 - 6, 1000, 1.5);

// Filtre passe-haut pour les aigus (> 3000 Hz)
high_shelf = fi.highshelf(2, (treble - 0.5) * 12, 3000);

tone_stack = low_shelf : mid_peak : high_shelf;

// ──────────────────────────────────────────────
// Module 3 : Cabinet (simulation de haut-parleur)
// Un filtre FIR qui reproduit la réponse impulsionnelle
// du haut-parleur
// ──────────────────────────────────────────────

// Version simplifiée : un passe-bas qui simule
// l'atténuation des aigus par le haut-parleur
cabinet_cutoff = hslider("cabinet_freq [unit:Hz]", 5000, 1000, 8000, 10);
cabinet = fi.lowpass(4, cabinet_cutoff);

// ──────────────────────────────────────────────
// Pipeline complet
// ──────────────────────────────────────────────

// Le signal traverse : waveshaper -> tone stack -> cabinet
process = waveshaper : tone_stack : cabinet;
```

**Dataset nécessaire pour l'entraînement** :

Pour entraîner le modèle DDSP de l'ampli, il faut un dataset apparié (paires entrée/sortie) :

```text
COLLECTE DU DATASET
────────────────────

Guitare ──> [Splitter] ──> Signal DI (Direct Inject) ──> Fichier WAV "dry"
                       └──> [Ampli réel] ──> Micro ──> Fichier WAV "wet"

Exemples de signaux d'entrée :
- Notes individuelles sur chaque corde, chaque frette
- Accords ouverts et barrés
- Arpèges à différentes vitesses
- Strumming rythmique
- Bends, slides, hammer-ons, pull-offs
- Signal de test (sweep sinusoidal 20Hz-20kHz)

Durée recommandée : 15-30 minutes de jeu varié
Format : WAV 44100 Hz, 24 bits, mono
```

**Loss function adaptée** :

```python
# La loss function compare les spectrogrammes du signal cible
# (ampli réel) et du signal généré (synthétiseur Faust)

# On utilise la Multi-Scale Spectral Loss :
# - Compare les spectrogrammes à plusieurs résolutions temporelles
# - Capture les différences dans les basses ET les aigus

# Résolutions utilisées :
# FFT size  |  Ce qu'elle capture
# 2048      |  Basses fréquences (résolution fine en fréquence)
# 1024      |  Médiums
# 512       |  Aigus et transitoires (résolution fine en temps)
```

---

### Étape 5 : Ressources pour aller plus loin

**Documentation officielle** :

| Ressource | URL | Description |
| --------- | --- | ----------- |
| Faust Documentation | `https://faustdoc.grame.fr` | Documentation officielle complète |
| DDSP Paper (Google) | `https://arxiv.org/abs/2001.04643` | Article fondateur de DDSP (Engel et al., 2020) |
| GRAME Research | `https://www.grame.fr/recherche` | Travaux de recherche du GRAME sur Faust |
| Faust GitHub | `https://github.com/grame-cncm/faust` | Code source et exemples |

**Articles de recherche clés** :

| Article | Année | Contribution |
| ------- | ----- | ------------ |
| DDSP: Differentiable Digital Signal Processing | 2020 | Pose les fondations de l'approche DDSP |
| Differentiable Signal Processing in Faust | 2022 | Auto-différentiation dans le compilateur Faust |
| RAVE: A variational autoencoder for audio | 2021 | Auto-encodeur temps réel pour l'audio |
| Neural Amp Modeler | 2023 | Modélisation d'amplis avec DDSP |

**Outils et bibliothèques** :

| Outil | Langage | Description |
| ----- | ------- | ----------- |
| PyTorch | Python | Framework de deep learning principal |
| torchaudio | Python | Traitement audio pour PyTorch |
| librosa | Python | Analyse audio (spectrogrammes, f0, MFCC) |
| DiffFaust | Python/C++ | DSP différentiable avec Faust |
| RAVE | Python | Auto-encodeur audio en temps réel |
| Neutone | Python | Déploiement de modèles audio dans les DAWs |

**Compétences recommandées pour approfondir** :

```text
PARCOURS D'APPRENTISSAGE SUGGÉRÉ
─────────────────────────────────

1. Python de base                     (si pas déjà acquis)
2. NumPy et manipulation de tableaux  (indispensable pour l'audio)
3. PyTorch : tenseurs et autograd     (le moteur de l'entraînement)
4. Traitement du signal en Python     (librosa, scipy.signal)
5. Réseaux de neurones basiques       (MLP, CNN, loss functions)
6. Spectrogrammes et STFT             (représentation fréquentielle)
7. DDSP et DiffFaust                  (intégration Faust/PyTorch)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust -svg fichier.dsp` | Génère le diagramme de signal en SVG |
| `faust -lang c fichier.dsp` | Génère du code C (utile pour l'intégration) |
| `faust -lang cpp fichier.dsp` | Génère du code C++ |
| `faust2jack fichier.dsp` | Compile en application JACK (temps réel) |
| `pip install torch torchaudio` | Installe PyTorch et torchaudio |
| `pip install librosa` | Installe la bibliothèque d'analyse audio |

---

## Pièges Fréquents

### Piège 1 : Confondre DDSP et synthèse neuronale pure

**Problème** : Penser que DDSP génère le signal audio directement avec un réseau de neurones. En réalité, le réseau de neurones produit uniquement des paramètres, et c'est le synthétiseur DSP (Faust) qui génère le son.

**Solution** : Retiens cette règle : dans DDSP, le réseau de neurones est un "conducteur" (il donne les instructions) et le synthétiseur Faust est le "musicien" (il joue la musique). Le conducteur ne produit pas de son lui-même.

```text
❌ Réseau de neurones ──> Signal audio
✅ Réseau de neurones ──> Paramètres ──> Synthétiseur Faust ──> Signal audio
```

---

### Piège 2 : Oublier que le DSP doit être différentiable

**Problème** : Utiliser des opérations non différentiables dans le programme Faust (comme des conditions `if/else` avec des discontinuités, ou des opérations sur des entiers). Le gradient ne peut pas traverser ces opérations.

**Solution** : Utilise des fonctions continues et lisses. Remplace les seuils durs par des transitions douces (sigmoid, tanh).

```faust
// ❌ Non différentiable : seuil dur (discontinuité)
// Le gradient est 0 partout sauf au point de seuil
clipper(x) = min(1, max(-1, x));

// ✅ Différentiable : saturation douce (transition continue)
// Le gradient existe partout, il diminue progressivement
soft_clipper(x) = ma.tanh(x);
```

---

### Piège 3 : Sous-estimer la quantité de données nécessaire

**Problème** : Entraîner un modèle DDSP avec 30 secondes d'audio et espérer un bon résultat. Le modèle n'a pas assez d'exemples pour apprendre les variations du son cible.

**Solution** : Utilise au minimum 10 à 15 minutes d'audio varié pour les cas simples (modèle de voix, ampli guitare). Pour des cas plus complexes (transfert de timbre multi-instruments), prévois 1 heure ou plus.

| Cas d'usage | Durée minimale recommandée |
| ----------- | -------------------------- |
| Modélisation d'ampli | 15 min de jeu varié |
| Synthèse de voix | 10 min de parole |
| Transfert de timbre | 30 min par instrument |
| Séparation de sources | 2h de mix avec stems |

---

### Piège 4 : Négliger le choix de la loss function

**Problème** : Utiliser une simple MSE (Mean Squared Error) sur les échantillons bruts. Deux signaux audio peuvent être perceptuellement identiques mais avoir des échantillons très différents (un simple décalage de phase donne une MSE énorme alors que le son est le même).

**Solution** : Utilise une loss spectrale (comparaison des spectrogrammes) plutôt qu'une loss temporelle (comparaison des échantillons). La Multi-Scale Spectral Loss est le standard actuel.

```text
❌ Loss temporelle : compare les échantillons un par un
   Signal cible :    [0.5, -0.3, 0.8, ...]
   Signal généré :   [0.5, -0.3, 0.8, ...]  <- doit être identique échantillon par échantillon

✅ Loss spectrale : compare les spectrogrammes
   Spectrogramme cible :    [énergie par bande de fréquence]
   Spectrogramme généré :   [énergie par bande de fréquence]  <- compare le contenu fréquentiel
```

---

### Piège 5 : Vouloir faire du temps réel trop tôt

**Problème** : Essayer de déployer le système complet (encoder + synthétiseur) en temps réel avant d'avoir validé la qualité du modèle. L'encoder est souvent trop lourd pour le temps réel sur CPU.

**Solution** : Procède en deux phases. Phase 1 : entraîne et valide le modèle hors ligne (qualité du son). Phase 2 : optimise l'encoder pour le temps réel (distillation, quantization, export ONNX). Le synthétiseur Faust, lui, fonctionne déjà en temps réel.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre Neural Audio Synthesis classique et DDSP
- [ ] Je comprends le rôle de chaque composant du pipeline DDSP (encoder, décodeur, synthétiseur, loss)
- [ ] Je sais ce qu'est l'auto-différentiation et pourquoi elle est nécessaire pour DDSP
- [ ] Je comprends comment Faust génère le code de la dérivée d'un programme
- [ ] Je sais ce que fait faust2pytorch (exporter un programme Faust comme module PyTorch)
- [ ] Je connais les principales applications de DDSP (voix, transfert de timbre, ampli guitare)
- [ ] Je connais les limites actuelles (temps d'entraînement, temps réel, maturité des outils)
- [ ] Je sais distinguer une loss temporelle d'une loss spectrale et pourquoi la spectrale est préférable
- [ ] Je comprends le workflow complet : données -> entraînement -> export -> déploiement

---

## Exercice Pratique

**Enonce** : Concevoir (sur papier) un système DDSP pour la modélisation d'un ampli guitare vintage.

**Cahier des charges** :

1. Décrire l'architecture complète (encoder, modules DSP Faust, loss function)
2. Lister les paramètres apprenables du synthétiseur Faust
3. Décrire le dataset nécessaire (type de signaux, durée, format)
4. Décrire le pipeline d'entraînement (étapes, hyperparamètres)

**Indications** :

- L'ampli cible est un Fender Deluxe Reverb (ampli à lampes, clean et overdrive léger)
- Le synthétiseur Faust doit inclure au minimum : un étage de pré-amplification (waveshaper), un tone stack (3 bandes), une simulation de haut-parleur (filtre)
- L'encoder doit analyser le signal d'entrée (guitare) pour prédire les paramètres DSP optimaux
- La loss function doit comparer le son de l'ampli réel avec le son du synthétiseur Faust
- Pense aux paramètres qui changent selon le réglage du volume de l'ampli (clean vs overdrive)

**Résultat attendu** :

Un document structuré contenant :

- Un schéma de l'architecture (encoder -> paramètres -> synthétiseur -> loss)
- La liste des paramètres apprenables avec leurs plages de valeurs
- La description du dataset (durée, contenu, format)
- Les étapes du pipeline d'entraînement
- Les métriques de succès (comment savoir si le modèle est bon)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Architecture du système

Le schéma reprend l'architecture de l'étape 4 ci-dessus, adaptée au Fender Deluxe Reverb :

```text
Guitare DI ──> [Encoder CNN 1D + GRU] ──> 7 paramètres DSP
                                                │
Guitare DI ──> [Synthétiseur Faust] <───────────┘
               (preamp -> tone stack -> cabinet -> presence)
                         │
                         v
               Audio amplifié ──┐
                                ├──> [Multi-Scale Spectral Loss]
Ampli réel (enregistrement) ────┘
                                         │
                                   BACKPROPAGATION
```

### 2. Paramètres apprenables

Le synthétiseur a 7 paramètres. L'encoder produit ces 7 valeurs à chaque frame audio :

| Paramètre | Plage | Rôle |
| --------- | ----- | ---- |
| `preamp_gain` | 1.0 - 30.0 | Niveau de distorsion (gain avant waveshaper) |
| `bass` | 0.0 - 1.0 | Niveau des basses (< 300 Hz) |
| `mid` | 0.0 - 1.0 | Niveau des médiums (1000 Hz) |
| `treble` | 0.0 - 1.0 | Niveau des aigus (> 3000 Hz) |
| `cab_freq` | 1000 - 8000 Hz | Fréquence de coupure du cabinet |
| `presence` | 0.0 - 1.0 | Boost des aigus post-cabinet |
| `mix_dry_wet` | 0.0 - 1.0 | Balance signal propre / distordu |

Le programme Faust complet est celui de l'étape 4, avec l'ajout du paramètre `presence` (high_shelf) et du mix dry/wet :

```faust
import("stdfaust.lib");

// Paramètres (fournis par l'encoder en mode DDSP, par des sliders en standalone)
preamp_gain = hslider("preamp_gain", 5.0, 1.0, 30.0, 0.1);
bass = hslider("bass", 0.5, 0, 1, 0.01);
mid = hslider("mid", 0.5, 0, 1, 0.01);
treble = hslider("treble", 0.5, 0, 1, 0.01);
cab_freq = hslider("cab_freq [unit:Hz]", 5000, 1000, 8000, 10);
presence = hslider("presence", 0.5, 0, 1, 0.01);
mix = hslider("mix", 0.5, 0, 1, 0.01);

// Pré-amplification : saturation douce (lampes 6V6)
preamp(x) = ma.tanh(x * preamp_gain);

// Tone Stack : circuit de tonalité Fender (3 bandes)
tone = fi.lowshelf(2, (bass - 0.5) * 15, 300)
     : fi.peak_eq((mid - 0.5) * 12, 1000, 1.5)
     : fi.highshelf(2, (treble - 0.5) * 15, 3000);

// Cabinet : simulation haut-parleur 12" Jensen C12R
cab = fi.lowpass(4, cab_freq);

// Presence : boost aigus post-cabinet
pres = fi.highshelf(2, (presence - 0.5) * 8, 4000);

// Pipeline complet avec mix dry/wet
amp_chain = preamp : tone : cab : pres;
process = _ <: (*(1 - mix), amp_chain : *(mix)) :> _;
```

### 3. Dataset

30 minutes de jeu varié, enregistré simultanément en DI (signal direct) et via l'ampli réel (micro SM57) :

- **Notes individuelles** (10 min) : chaque corde/frette, dynamiques variées (pp a ff)
- **Accords et arpèges** (8 min) : accords ouverts, barrés, arpèges
- **Techniques** (7 min) : bends, slides, hammer-ons, palm mute, harmoniques
- **Signaux de test** (5 min) : sweep 20Hz-20kHz, bruit blanc, impulsions, silence
- **Format** : WAV 44100 Hz, 24 bits, mono, deux fichiers synchronisés

### 4. Pipeline d'entraînement

1. **Pré-traitement** : aligner les fichiers, normaliser, découper en segments de 2s (50% overlap), split 80/10/10
2. **Configuration** : Adam (lr=0.001, cosine decay), batch 16, 200 epochs, Multi-Scale Spectral Loss (FFT 512+1024+2048)
3. **Entraînement** (4-8h sur GPU) : encoder -> paramètres -> synthétiseur Faust -> loss -> backpropagation
4. **Validation** : toutes les 10 epochs, sauvegarder le meilleur modèle, écouter des exemples
5. **Déploiement** : export ONNX/TorchScript, intégration dans un plugin VST

### 5. Métriques de succès

| Métrique | Seuil acceptable | Description |
| -------- | ---------------- | ----------- |
| Multi-Scale Spectral Loss | < 0.05 | Différence spectrale globale |
| Log Spectral Distance | < 1.0 dB | Différence en dB par bande |
| Test A/B en aveugle | > 70% de confusion | Indistinguable de l'ampli réel |
| Latence (temps réel) | < 10 ms | Buffer de 256 échantillons |

---

## Navigation

← Fiche précédente : **[04 - MIDI, OSC et capteurs](04-midi-osc-capteurs.md)**
