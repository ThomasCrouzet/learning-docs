---
tags:
  - Faust
  - Expert
  - Pratique
description: "Optimisation et performance - vectorisation, parallélisation, benchmarking et profiling du code Faust"
estimated_time: "105 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 7 - Maîtrise et contribution"
---

# 01 - Optimisation et performance

> **En bref** : À la fin de cette fiche, tu sauras optimiser les performances d'un programme Faust en utilisant la vectorisation, la parallélisation et le profiling, et choisir les bonnes options de compilation pour chaque cible. Lecture estimée : 105 min.


## Prérequis

- Avoir complété la **Phase 4 - DSP appliqué** (oscillateurs, filtres, effets, synthèse)
- Avoir complété la **Phase 5 - Déploiement et architectures** (faust2jack, faust2juce, faust2wasm, etc.)
- Comprendre le fonctionnement du compilateur Faust (code Faust -> code C++ -> binaire)
- Savoir compiler un programme Faust avec différentes architectures cibles

## Objectif de cette fiche

À la fin de cette fiche, tu sauras optimiser les performances d'un programme Faust en utilisant la vectorisation, la parallélisation et le profiling, et choisir les bonnes options de compilation pour chaque cible.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la vectorisation en Faust ?

**Définition** : La vectorisation est une technique de compilation qui transforme le traitement échantillon par échantillon en traitement par blocs de N échantillons (typiquement 32 ou 64). Le compilateur Faust génère du code C++ qui exploite les instructions SIMD (Single Instruction, Multiple Data) du processeur pour calculer plusieurs échantillons en une seule instruction CPU.

**Le problème que la vectorisation résout** :

Sans vectorisation, voici les problèmes rencontrés :

1. **Sous-utilisation du processeur** : Les processeurs modernes possèdent des unités SIMD capables de traiter 4 ou 8 valeurs flottantes en parallèle (SSE traite 4 floats, AVX traite 8 floats). Sans vectorisation, une seule valeur est traitée par instruction, laissant 75% à 87% de la capacité inutilisée.
2. **Overhead de boucle** : Traiter les échantillons un par un signifie que la boucle `for` dans la fonction `compute()` exécute N itérations avec N appels aux calculs. Le coût de gestion de la boucle (incrémentation, comparaison, branchement) devient significatif par rapport au calcul utile.
3. **Cache CPU mal exploité** : Le processeur charge les données par lignes de cache (64 octets typiquement, soit 16 floats). Traiter un seul float par itération gaspille les données déjà chargées en cache.

**Comment la vectorisation résout ces problèmes** :

| Problème | Solution apportée par la vectorisation |
| -------- | -------------------------------------- |
| Sous-utilisation du processeur | Le code généré utilise les instructions SSE/AVX pour traiter 4 ou 8 échantillons par instruction |
| Overhead de boucle | La boucle itère N/4 ou N/8 fois au lieu de N, réduisant le coût de gestion |
| Cache mal exploité | Les données sont traitées par blocs contigus, maximisant l'utilisation du cache |

**Analogie concrète** : Imagine que tu dois remplir 100 bouteilles d'eau. Sans vectorisation, tu remplis chaque bouteille une par une en ouvrant et fermant le robinet 100 fois. Avec vectorisation, tu utilises un entonnoir à 4 sorties : tu remplis 4 bouteilles en même temps, et tu n'ouvres le robinet que 25 fois. Le travail total est le même, mais tu vas 4 fois plus vite.

**Ce que la vectorisation n'est PAS** :

- La vectorisation n'est pas de la parallélisation multi-coeurs. La vectorisation utilise un seul coeur CPU mais traite plusieurs données en parallèle au sein de ce coeur. La parallélisation multi-coeurs (`-sch`, `-omp`) répartit le travail sur plusieurs coeurs.
- La vectorisation n'est pas toujours bénéfique. Pour un programme très simple (un seul gain, par exemple), l'overhead de la vectorisation peut dépasser le gain. Le bénéfice apparaît surtout pour les programmes avec beaucoup de calculs parallèles (filtres en cascade, synthèse additive, reverb).

**Activation** :

```bash
# Activer la vectorisation lors de la compilation
faust -vec programme.dsp -o programme.cpp
```

L'option `-vec` demande au compilateur Faust de générer du code C++ organisé en boucles vectorisables. Le compilateur C++ (g++, clang++) appliquera ensuite les optimisations SIMD lors de la compilation du C++ en binaire.

**Options complémentaires** :

| Option | Effet |
| ------ | ----- |
| `-vec` | Active la vectorisation (traitement par blocs) |
| `-vs N` | Définit la taille du vecteur (par défaut 32). Valeurs typiques : 32, 64, 128 |
| `-lv 0` | Variante de boucle la plus rapide (défaut) : taille de vecteur fixe + boucle de reste |
| `-lv 1` | Variante simple : taille de vecteur variable |
| `-lv 2` | Taille de vecteur fixe, sans boucle de reste |

---

### Qu'est-ce que le scheduling automatique ?

**Définition** : Le scheduling automatique est une technique de compilation qui analyse le graphe de calcul du programme Faust et répartit les tâches indépendantes sur plusieurs coeurs CPU. Le compilateur identifie les branches de calcul qui ne dépendent pas les unes des autres et les assigne à des threads différents.

**Le problème que le scheduling résout** :

Sans scheduling, voici les problèmes rencontrés :

1. **Un seul coeur utilisé** : Par défaut, le code généré par Faust s'exécute sur un seul coeur CPU. Sur un processeur à 8 coeurs, 87.5% de la puissance de calcul est inutilisée.
2. **Programmes complexes trop lents** : Un synthétiseur avec 32 oscillateurs, chacun avec son propre filtre, calcule tout séquentiellement. Si chaque oscillateur prend 1 ms, le total est 32 ms - trop lent pour un buffer de 256 échantillons à 44100 Hz (5.8 ms).
3. **Latence excessive** : Un programme qui dépasse le temps alloué par buffer produit des glitchs audio (craquements, coupures).

**Comment le scheduling résout ces problèmes** :

| Problème | Solution apportée par le scheduling |
| -------- | ----------------------------------- |
| Un seul coeur utilisé | Les calculs indépendants sont répartis sur plusieurs coeurs |
| Programmes complexes trop lents | Les branches parallèles sont calculées simultanément |
| Latence excessive | Le temps de calcul total est divisé par le nombre de coeurs utilisés |

**Analogie concrète** : Imagine une cuisine de restaurant. Un seul cuisinier (un seul coeur) prépare tous les plats séquentiellement : entrée, plat, dessert. Avec le scheduling, tu embauches 3 cuisiniers (3 coeurs) : un prépare l'entrée, un autre le plat, le troisième le dessert, en même temps. Le repas complet est prêt 3 fois plus vite.

**Ce que le scheduling n'est PAS** :

- Le scheduling n'est pas magique. Si le programme est purement séquentiel (chaque calcul dépend du précédent), il n'y a rien à paralléliser. Le scheduling ne fonctionne bien que quand le graphe de calcul contient des branches indépendantes.
- Le scheduling n'est pas gratuit. La synchronisation entre les threads (mutex, barrières) a un coût. Pour un programme simple, ce coût peut dépasser le gain de la parallélisation.

**Options de scheduling** :

| Option | Effet |
| ------ | ----- |
| `-sch` | Active le scheduling automatique (work-stealing) |
| `-omp` | Utilise OpenMP pour la parallélisation (alternative à `-sch`) |
| `-mcd N` | Max Copy Delay - contrôle la taille maximale des copies de lignes de délai avant de passer à un accès indirect. Valeur par défaut : 16 |

**Différence entre `-sch` et `-omp`** :

| `-sch` (work-stealing) | `-omp` (OpenMP) |
| ---------------------- | --------------- |
| Implémentation propre à Faust | Standard industriel |
| Pas de dépendance externe | Requiert un compilateur supportant OpenMP |
| Bon pour les architectures hétérogènes | Bon pour les architectures classiques |
| Adaptatif (les threads volent du travail) | Statique (répartition fixée à la compilation) |

---

### Qu'est-ce que la compilation en double précision ?

**Définition** : L'option `-double` demande au compilateur Faust de générer du code qui utilise des nombres à virgule flottante sur 64 bits (`double`) au lieu de 32 bits (`float`). Chaque échantillon occupe alors 8 octets au lieu de 4, doublant la précision numérique mais aussi la consommation mémoire.

**Le problème que la double précision résout** :

Sans double précision, voici les problèmes rencontrés :

1. **Erreurs d'arrondi dans les filtres** : Un filtre IIR avec des pôles très proches du cercle unité (filtres à bande étroite, filtres résonants à Q élevé) accumule des erreurs d'arrondi à chaque échantillon. En simple précision (float, 7 chiffres significatifs), ces erreurs s'accumulent et le filtre peut devenir instable ou produire un son différent de ce qui est attendu.
2. **Bruit numérique audible** : Les erreurs d'arrondi en float produisent un bruit de fond (noise floor) autour de -140 dB. En traitement audio professionnel, ce niveau peut être insuffisant pour des traitements avec beaucoup de gain (mastering, traitement dynamique extrême).
3. **Instabilité des oscillateurs récursifs** : Un oscillateur implémenté par récurrence (sin/cos récursif) dérive progressivement en simple précision. Après quelques secondes, la fréquence ou l'amplitude peut se décaler.

**Comment la double précision résout ces problèmes** :

| Problème | Solution apportée par `-double` |
| -------- | ------------------------------- |
| Erreurs d'arrondi dans les filtres | 15 chiffres significatifs au lieu de 7, réduisant les erreurs d'un facteur $\sim 10^8$ |
| Bruit numérique | Le noise floor descend autour de -300 dB, inaudible dans tous les cas |
| Instabilité des oscillateurs | La dérive est si faible qu'elle n'est mesurable qu'après des heures de fonctionnement |

**Analogie concrète** : Imagine que tu mesures la longueur d'une pièce avec un mètre ruban gradué en centimètres (float : 7 chiffres significatifs). Si tu mesures 3.14 mètres et que tu cumules cette mesure 10 000 fois (comme un filtre récursif), l'erreur d'arrondi s'accumule. Avec un mètre laser gradué au micromètre (double : 15 chiffres significatifs), la même opération reste précise.

**Ce que la double précision n'est PAS** :

- La double précision n'est pas toujours nécessaire. Pour la plupart des programmes audio (synthèse, effets courants), la simple précision est suffisante. La double précision est utile principalement pour les filtres à hauts coefficients de récurrence et le traitement professionnel.
- La double précision n'est pas gratuite en performance. Elle consomme 2 fois plus de mémoire et les instructions SIMD traitent 2 fois moins de valeurs par instruction (4 doubles vs 8 floats en AVX).

**Comparaison float vs double** :

| Caractéristique | `float` (32-bit) | `double` (64-bit) |
| --------------- | ----------------- | ------------------ |
| Chiffres significatifs | ~7 | ~15 |
| Mémoire par échantillon | 4 octets | 8 octets |
| Valeurs SIMD par instruction (SSE) | 4 | 2 |
| Valeurs SIMD par instruction (AVX) | 8 | 4 |
| Noise floor théorique | ~-140 dB | ~-300 dB |
| Utilisation typique | Synthèse, effets courants | Filtres critiques, mastering |

**Activation** :

```bash
# Compiler en double précision
faust -double programme.dsp -o programme.cpp
```

---

### Qu'est-ce que le benchmarking Faust ?

**Définition** : Le benchmarking est la mesure systématique des performances d'un programme Faust. L'outil `faust2bench` compile le programme et exécute des tests de performance standardisés, mesurant le nombre d'opérations par seconde (MFlops), le pourcentage d'utilisation CPU et le temps de calcul par buffer audio.

**Le problème que le benchmarking résout** :

Sans benchmarking, voici les problèmes rencontrés :

1. **Pas de référence objective** : "Mon programme semble lent" n'est pas une information exploitable. Sans mesure, impossible de savoir si le programme est réellement trop lent ou si le problème vient d'ailleurs (driver audio, système d'exploitation).
2. **Impossible de comparer les optimisations** : Si tu actives `-vec` et que le programme "semble plus rapide", tu ne sais pas de combien. Sans mesure avant/après, impossible de quantifier le gain.
3. **Pas de seuil clair** : Le temps réel impose un seuil strict - le calcul d'un buffer doit être terminé avant que le buffer suivant commence. Sans benchmarking, tu ne sais pas si tu respectes ce seuil.

**Comment le benchmarking résout ces problèmes** :

| Problème | Solution apportée par le benchmarking |
| -------- | ------------------------------------- |
| Pas de référence objective | Des métriques chiffrées (MFlops, CPU%, temps/buffer) |
| Impossible de comparer | Comparaison avant/après avec des chiffres précis |
| Pas de seuil clair | Le ratio temps_calcul/temps_buffer indique la marge disponible |

**Analogie concrète** : Un chronomètre pour un coureur. Sans chronomètre, le coureur sait qu'il court mais ne sait pas s'il s'améliore. Le benchmarking est le chronomètre du programme : il mesure le temps exact de chaque tour (chaque buffer audio) et permet de comparer les performances entre différentes configurations.

**Ce que le benchmarking n'est PAS** :

- Le benchmarking n'est pas un outil de débogage. Il mesure la vitesse, pas la correction. Un programme rapide peut produire un son incorrect.
- Le benchmarking n'est pas une garantie de performance en conditions réelles. Les résultats dépendent de la charge système, des interruptions matérielles et d'autres facteurs. Le benchmarking donne une estimation dans des conditions contrôlées.

**Métriques principales** :

| Métrique | Signification |
| -------- | ------------- |
| MFlops | Millions d'opérations flottantes par seconde - mesure la puissance brute |
| CPU % | Pourcentage du temps CPU utilisé pour le calcul audio |
| Temps/buffer | Temps en microsecondes pour calculer un buffer complet |
| Marge RT | Rapport entre le temps disponible et le temps utilisé. > 1.0 = OK, < 1.0 = glitchs |

---

### Qu'est-ce que l'analyse du code C++ généré ?

**Définition** : Le compilateur Faust transforme le code Faust en code C++ optimisé. Analyser ce code C++ permet de comprendre exactement ce que le processeur exécute, d'identifier les goulots d'étranglement et de vérifier que les optimisations sont effectivement appliquées.

**Le problème que cette analyse résout** :

Sans analyse du code généré, voici les problèmes rencontrés :

1. **Boîte noire** : Le compilateur Faust est une boîte noire. Tu écris du code Faust, tu obtiens un binaire. Sans regarder le code intermédiaire, tu ne sais pas comment le compilateur a interprété ton programme.
2. **Optimisations non vérifiées** : Tu actives `-vec` mais tu ne sais pas si le compilateur a réellement vectorisé les boucles. Certaines structures de code empêchent la vectorisation (dépendances de données, accès mémoire non alignés).
3. **Goulots d'étranglement invisibles** : Un filtre qui semble simple en Faust peut générer un code C++ complexe avec de nombreuses variables temporaires et des accès mémoire coûteux.

**Comment l'analyse résout ces problèmes** :

| Problème | Solution apportée par l'analyse |
| -------- | ------------------------------- |
| Boîte noire | Lecture directe du code C++ généré |
| Optimisations non vérifiées | Vérification de la structure des boucles (vectorisées ou non) |
| Goulots d'étranglement invisibles | Identification des variables temporaires, des accès mémoire, des opérations coûteuses |

**Analogie concrète** : Un mécanicien qui ouvre le capot d'une voiture. Conduire la voiture (exécuter le programme) te dit si elle est rapide ou lente, mais pas pourquoi. Ouvrir le capot (lire le code C++) te montre le moteur : nombre de cylindres (boucles), type d'injection (accès mémoire), turbo (vectorisation). Tu peux alors identifier ce qui limite la performance.

**Commande** :

```bash
# Générer le code C++ du programme Faust
faust -o programme.cpp programme.dsp

# Générer avec vectorisation pour comparer
faust -vec -o programme_vec.cpp programme.dsp
```

**Structure typique du code C++ généré** :

Le code C++ généré contient principalement :

- **La classe DSP** : hérite de `dsp`, contient l'état du programme
- **`instanceInit()`** : initialisation des variables d'état et des buffers
- **`compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs)`** : la fonction critique - c'est elle qui est appelée à chaque buffer audio et qui doit terminer en temps réel
- **Variables `fRec0`, `fVec0`, etc.** : les lignes de délai et variables d'état

---

### Qu'est-ce que le profiling CPU ?

**Définition** : Le profiling CPU consiste à utiliser des outils système pour mesurer le temps passé dans chaque fonction du programme compilé. Pour un programme Faust, l'objectif principal est de mesurer le temps passé dans la fonction `compute()` et d'identifier les instructions les plus coûteuses.

**Le problème que le profiling résout** :

Sans profiling, voici les problèmes rencontrés :

1. **Pas de localisation du problème** : Le benchmarking dit que le programme est lent, mais pas pourquoi. Le profiling montre exactement quelle partie du code prend le plus de temps.
2. **Optimisation aveugle** : Sans profiling, tu risques d'optimiser une partie du code qui ne consomme que 5% du temps CPU, au lieu de la partie qui en consomme 80%.
3. **Pas de visibilité sur les instructions machine** : Certaines opérations apparemment simples en C++ se traduisent en instructions machine coûteuses (divisions, fonctions trigonométriques, accès mémoire non alignés).

**Comment le profiling résout ces problèmes** :

| Problème | Solution apportée par le profiling |
| -------- | ---------------------------------- |
| Pas de localisation | Le profiler indique le temps passé dans chaque ligne/fonction |
| Optimisation aveugle | Le profiler identifie les "points chauds" (hotspots) qui méritent d'être optimisés |
| Instructions coûteuses invisibles | Le profiler montre le coût réel de chaque instruction machine |

**Analogie concrète** : Un détective qui enquête sur un embouteillage. Le GPS te dit que le trajet prend 2 heures (benchmarking). Le détective se poste à chaque carrefour et chronomètre le temps d'attente à chaque feu rouge (profiling). Il découvre qu'un seul feu rouge cause 45 minutes d'attente sur les 2 heures. C'est ce feu rouge qu'il faut optimiser.

**Outils de profiling** :

| Outil | Plateforme | Usage |
| ----- | ---------- | ----- |
| `perf` | Linux | Profiling CPU, compteurs hardware |
| Instruments | macOS | Profiling CPU, allocations mémoire, Time Profiler |
| `valgrind --tool=callgrind` | Linux/macOS | Profiling basé sur la simulation |
| `gprof` | Linux/macOS | Profiling par instrumentation |

---

### Quelles sont les optimisations algorithmiques en Faust ?

**Définition** : Les optimisations algorithmiques consistent à modifier la logique du programme Faust pour réduire le nombre de calculs par échantillon, sans changer le résultat sonore (ou en l'approximant de manière inaudible). Ces optimisations interviennent au niveau du code Faust, avant la compilation.

**Le problème que les optimisations algorithmiques résolvent** :

Sans optimisations algorithmiques, voici les problèmes rencontrés :

1. **Trop d'opérations par échantillon** : Un filtre d'ordre 16 nécessite 16 multiplications et 16 additions par échantillon. Multiplié par la fréquence d'échantillonnage (44100 ou 48000), cela représente des millions d'opérations par seconde.
2. **Fonctions coûteuses** : Les fonctions trigonométriques (`sin`, `cos`, `tan`) et les divisions sont beaucoup plus lentes que les additions et multiplications. Un oscillateur qui appelle `sin()` à chaque échantillon est coûteux.
3. **Utilisation mémoire excessive** : Des delay lines inutilement longues ou des tables surdimensionnées gaspillent la mémoire et dégradent les performances du cache CPU.

**Comment les optimisations algorithmiques résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Trop d'opérations | Réduire l'ordre des filtres, factoriser les calculs communs |
| Fonctions coûteuses | Utiliser des approximations (lookup tables, polynômes) |
| Mémoire excessive | Réduire la taille des buffers, partager les delay lines |

**Techniques concrètes** :

| Technique | Description | Gain typique |
| --------- | ----------- | ------------ |
| Lookup tables pour sin/cos | Pré-calculer les valeurs dans une `rdtable` | 5x à 10x sur les appels trig |
| Approximation polynomiale | Remplacer `sin(x)` par un polynôme de degré 3-5 | 3x à 5x |
| Réduction d'ordre de filtre | Utiliser un filtre d'ordre 2 au lieu d'ordre 8 | 4x sur les multiplications |
| Éviter les divisions | Remplacer `x / y` par `x * (1.0/y)` quand y est constant | 2x à 4x par division |
| Réduire les delay lines | Utiliser le délai minimum nécessaire | Moins de cache misses |

---

### Qu'est-ce que l'optimisation mémoire en Faust ?

**Définition** : L'optimisation mémoire consiste à minimiser la quantité de RAM utilisée par un programme Faust et à organiser les accès mémoire pour maximiser l'utilisation du cache CPU. En audio temps réel, un accès mémoire lent (cache miss) peut faire la différence entre un programme qui tourne et un programme qui produit des glitchs.

**Le problème que l'optimisation mémoire résout** :

Sans optimisation mémoire, voici les problèmes rencontrés :

1. **Cache misses fréquents** : Des tables et des delay lines dispersées en mémoire provoquent des accès lents au cache L1/L2. Un cache miss coûte 100 à 300 cycles CPU, contre 1 à 4 cycles pour un cache hit.
2. **Mémoire saturée sur cibles embarquées** : Les microcontrôleurs et les DSP embarqués ont souvent moins de 1 Mo de RAM. Un programme Faust avec de longues delay lines peut dépasser cette limite.
3. **Bande passante mémoire saturée** : Même sur un PC de bureau, la bande passante mémoire est partagée entre tous les processus. Un programme Faust qui lit et écrit des mégaoctets par buffer audio monopolise cette bande passante.

**Comment l'optimisation mémoire résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Cache misses fréquents | Réduire la taille des tables pour qu'elles tiennent dans le cache L1 (32-64 Ko) |
| Mémoire saturée | Utiliser `-single` pour les cibles embarquées, réduire la taille des buffers |
| Bande passante saturée | Minimiser les lectures/écritures mémoire par échantillon |

**Analogie concrète** : Un bureau de travail. Le cache L1, c'est la surface du bureau (petite mais accessible instantanément). Le cache L2, c'est l'étagère au-dessus du bureau (proche mais nécessite de lever le bras). La RAM, c'est l'armoire dans le couloir (lente d'accès). L'optimisation mémoire consiste à garder les outils les plus utilisés sur le bureau et à ranger les outils rares dans l'armoire.

**Conseils pratiques** :

| Action | Détail |
| ------ | ------ |
| Minimiser les `rdtable`/`rwtable` | Utiliser la taille minimale nécessaire |
| Utiliser `-single` | Force le float 32-bit pour les cibles embarquées à mémoire limitée |
| Puissance de 2 pour les tables | Les modulos sur des puissances de 2 sont optimisés en masques binaires (AND) |
| Réutiliser les buffers | Factoriser les delay lines communes entre plusieurs effets |

---

### Quelles sont les différences de performance entre les backends Faust ?

**Définition** : Le compilateur Faust peut générer du code pour plusieurs backends (cibles). Chaque backend a des caractéristiques de performance différentes. Le choix du backend influence la vitesse d'exécution, la latence de compilation et la portabilité du programme.

**Comparaison des backends** :

| Backend | Génération | Exécution | Utilisation typique |
| ------- | ---------- | --------- | ------------------- |
| C++ | Code source C++ compilé par g++/clang++ | La plus rapide | Production, plugins VST/AU, embarqué |
| LLVM JIT | Compilation en mémoire via LLVM | Très rapide (95-100% du C++) | IDE Faust, prototypage rapide, libfaust |
| Interpreter | Interpréteur bytecode Faust | 5x à 10x plus lent que C++ | Débogage, environnements sans compilateur |
| WebAssembly | Code Wasm exécuté dans le navigateur | 70-90% du C++ natif | Applications web, Faust IDE en ligne |
| Soul/Cmajor | Code pour le runtime Soul/Cmajor | Proche du natif | Pipeline audio spécialisé |
| Rust | Code source Rust | Comparable au C++ | Intégration dans des projets Rust |

**Quand choisir quel backend** :

- **Performance maximale** : C++ avec `-vec` et optimisations du compilateur (`-O3`)
- **Prototypage rapide** : LLVM JIT (pas besoin de compiler séparément)
- **Web** : WebAssembly (seul choix pour le navigateur)
- **Embarqué** : C++ avec `-single` et taille minimale

---

### Quelles sont les options de contrôle de compilation ?

**Définition** : Le compilateur Faust offre des options pour contrôler le processus de compilation lui-même : temps de compilation, nommage du code généré et niveau de détail des informations produites.

**Options principales** :

| Option | Description |
| ------ | ----------- |
| `-ct 0/1` | Check-table : vérifie les index `rtable`/`rwtable` et génère un accès sûr (1 par défaut). Ce n'est pas un timeout de compilation |
| `-cn name` | Class name - définit le nom de la classe C++ générée (par défaut `mydsp`). Utile quand tu intègres plusieurs programmes Faust dans un même projet C++ |
| `-o file` | Output - écrit le code généré dans un fichier au lieu de stdout |
| `-a arch` | Architecture - utilise un fichier d'architecture spécifique |
| `-t N` | Timeout - arrête la compilation après N secondes (protection contre les explosions combinatoires du compilateur) |
| `-e` | Export - génère un fichier C++ autonome avec toutes les dépendances incluses |

```bash
# Compiler avec un nom de classe personnalisé et un timeout de 30 secondes
faust -cn MonReverb -t 30 -o mon_reverb.cpp reverb.dsp
```

---

## Étapes Pratiques

### Étape 1 : Benchmarker un programme avec et sans `-vec`

Pour cette étape, on va mesurer l'impact de la vectorisation sur un programme de synthèse additive (beaucoup de calculs parallèles = bon candidat pour la vectorisation).

Crée un fichier `bench-synth.dsp` :

```faust
import("stdfaust.lib");

// Synthèse additive : somme de 16 oscillateurs sinusoïdaux
// Chaque oscillateur a une fréquence et une amplitude différentes
// Ce type de programme bénéficie fortement de la vectorisation
// car les 16 oscillateurs sont indépendants les uns des autres

freq = hslider("Freq [unit:Hz]", 220, 50, 1000, 1);

// Génère un harmonique : sin(2π × freq × n × t / SR) × (1/n)
// n = numéro de l'harmonique (1, 2, 3, ...)
// L'amplitude décroît en 1/n (spectre en dents de scie)
harmonique(n) = os.osc(freq * n) * (1.0 / n);

// Somme de 16 harmoniques avec par.
// par(i, 16, ...) crée 16 instances en parallèle
// :> additionne tous les signaux
process = par(i, 16, harmonique(i + 1)) :> _ * 0.3;
```

Compile et benchmarke sans vectorisation, puis avec :

```bash
# Compilation et benchmark SANS vectorisation
faust -o bench-synth-scalar.cpp bench-synth.dsp
echo "=== Code scalaire généré ==="

# Compilation et benchmark AVEC vectorisation
faust -vec -o bench-synth-vec.cpp bench-synth.dsp
echo "=== Code vectorisé généré ==="
```

Pour mesurer les performances avec `faust2bench` (si disponible) :

```bash
# Benchmark sans vectorisation
faust2bench bench-synth.dsp
# Résultat : affiche les MFlops et le CPU%

# Benchmark avec vectorisation
faust2bench -vec bench-synth.dsp
# Résultat : affiche les MFlops et le CPU% (devrait être meilleur)
```

**Résultat attendu** :

```text
=== Sans vectorisation (-scalar) ===
Mesure: XX MFlops
CPU: XX%

=== Avec vectorisation (-vec) ===
Mesure: YY MFlops (YY > XX)
CPU: YY% (inférieur = meilleur)

Le gain typique avec -vec sur un programme de synthèse additive
est de l'ordre de 2x à 4x, selon le processeur et le nombre
d'harmoniques.
```

---

### Étape 2 : Comparer `-double` vs float par défaut

On va comparer les performances et la précision d'un filtre résonant en simple et double précision.

Crée un fichier `bench-filter.dsp` :

```faust
import("stdfaust.lib");

// Filtre résonant avec un Q élevé
// Les filtres à Q élevé sont sensibles aux erreurs d'arrondi
// car les pôles sont très proches du cercle unité
freq_filtre = hslider("Freq [unit:Hz]", 1000, 100, 10000, 1);
q_filtre = hslider("Q", 100, 1, 500, 0.1);

// fi.resonbp : filtre passe-bande résonant
// Avec Q=100, les pôles sont à r ≈ 0.9997 du cercle unité
// En float (32-bit), cette proximité cause des erreurs d'arrondi
process = _ : fi.resonbp(freq_filtre, q_filtre, 1.0);
```

Compile en float et en double :

```bash
# Compilation en simple précision (float, par défaut)
faust -o filter-float.cpp bench-filter.dsp
echo "=== Code float généré ==="

# Compilation en double précision
faust -double -o filter-double.cpp bench-filter.dsp
echo "=== Code double généré ==="
```

Pour mesurer les performances :

```bash
# Benchmark en float
faust2bench bench-filter.dsp
echo "--- float ---"

# Benchmark en double
faust2bench -double bench-filter.dsp
echo "--- double ---"
```

**Résultat attendu** :

```text
=== float (32-bit) ===
Mesure: XX MFlops
Précision: suffisante pour Q < 50
Artefacts: possibles pour Q > 100

=== double (64-bit) ===
Mesure: YY MFlops (YY < XX, environ 10-30% plus lent)
Précision: stable même pour Q > 500
Artefacts: aucun

Règle pratique :
- Q < 50 : float suffit
- Q > 50 : envisager double
- Q > 200 : double recommandé
```

---

### Étape 3 : Lire et analyser le code C++ généré

On va examiner le code C++ pour comprendre ce que le compilateur produit.

Crée un programme simple, puis génère le code C++ :

```bash
# Générer le code C++ d'un filtre passe-bas simple
faust -o lowpass.cpp -cn LowPassFilter lowpass.dsp
```

Si tu n'as pas de fichier `lowpass.dsp`, crée-le :

```faust
import("stdfaust.lib");

// Filtre passe-bas du premier ordre
// y(n) = (1-a) * x(n) + a * y(n-1)
// a = e^(-2π × fc / SR)
fc = hslider("Cutoff [unit:Hz]", 1000, 20, 20000, 1);
process = fi.lowpass(1, fc);
```

Puis examine le code C++ généré :

```bash
# Générer le code C++ avec le nom de classe LowPassFilter
faust -cn LowPassFilter -o lowpass.cpp lowpass.dsp
```

Le code C++ généré contient la fonction `compute()` - c'est la partie critique :

```cpp
// Extrait typique du code C++ généré (simplifié)
virtual void compute(int count, FAUSTFLOAT** inputs, FAUSTFLOAT** outputs) {
    FAUSTFLOAT* input0 = inputs[0];
    FAUSTFLOAT* output0 = outputs[0];

    // Lecture du slider "Cutoff"
    float fSlow0 = float(fHslider0);
    // Calcul du coefficient du filtre
    float fSlow1 = std::exp(-(6.2831855f * (fSlow0 / fConst0)));

    // Boucle principale - appelée une fois par buffer
    for (int i = 0; i < count; i++) {
        // Calcul de l'échantillon de sortie
        // fRec0[0] = état courant du filtre (y(n))
        // input0[i] = échantillon d'entrée (x(n))
        float fTemp0 = float(input0[i]);
        fRec0[0] = fSlow1 * fRec0[1] + (1.0f - fSlow1) * fTemp0;
        output0[i] = FAUSTFLOAT(fRec0[0]);
        // Décalage de l'état pour le prochain échantillon
        fRec0[1] = fRec0[0];
    }
}
```

**Ce qu'il faut regarder dans le code C++ généré** :

| Élément | Signification | Impact sur la performance |
| ------- | ------------- | ------------------------ |
| Nombre de `fRec` | Lignes de délai (mémoire) | Plus de fRec = plus d'accès mémoire |
| Nombre de `fVec` | Buffers internes | Idem |
| Opérations dans la boucle `for` | Calculs par échantillon | Plus d'opérations = plus de CPU |
| `std::exp`, `std::sin`, etc. | Fonctions transcendantes | Très coûteuses (50-100 cycles chacune) |
| `fSlow0`, `fSlow1` | Variables lentes (sliders) | Calculées une fois par buffer (pas critique) |

**Résultat attendu** :

```text
En lisant le code C++ :
1. Les variables fSlow* sont calculées AVANT la boucle for
   → Les sliders ne coûtent rien par échantillon
2. Les opérations dans le for sont : 1 multiplication, 1 addition,
   1 soustraction, 2 accès mémoire
   → Très léger pour un filtre d'ordre 1
3. fRec0 est un tableau de 2 éléments (y(n) et y(n-1))
   → Mémoire minimale
```

---

### Étape 4 : Profiler un programme avec un outil système

On va utiliser un outil de profiling pour mesurer le temps CPU passé dans `compute()`.

**Sur macOS (Instruments)** :

```bash
# Étape 1 : compiler le programme en exécutable avec symboles de débogage
faust2jack -debug bench-synth.dsp

# Étape 2 : lancer l'exécutable
./bench-synth &

# Étape 3 : profiler avec Instruments (Time Profiler)
# Ouvre Instruments depuis Xcode > Open Developer Tool > Instruments
# Choisis le template "Time Profiler"
# Attache-toi au processus bench-synth
# Enregistre pendant 10 secondes
# Arrête l'enregistrement et analyse les résultats
```

**Sur Linux (perf)** :

```bash
# Étape 1 : compiler avec symboles de débogage
faust -o bench-synth.cpp bench-synth.dsp
g++ -O3 -g -o bench-synth bench-synth.cpp \
    -I/usr/share/faust \
    $(pkg-config --cflags --libs jack) -lpthread

# Étape 2 : profiler avec perf
perf record -g ./bench-synth &
# Laisser tourner quelques secondes, puis arrêter avec Ctrl+C

# Étape 3 : analyser les résultats
perf report
```

**Résultat attendu** :

```text
Profiling d'un programme de synthèse additive (16 harmoniques) :

  72.3%  bench-synth  compute()
  │
  ├── 45.1%  sin()          ← Les appels à sin() dominent
  ├── 18.2%  multiply/add   ← Calculs arithmétiques
  └──  9.0%  memory access  ← Accès aux buffers

  15.4%  bench-synth  JACK callback
   8.1%  libsystem     system calls
   4.2%  other

Conclusion : sin() consomme 45% du temps CPU.
Piste d'optimisation : remplacer sin() par une table d'ondes (rdtable).
```

---

### Étape 5 : Optimiser un programme coûteux

On va optimiser un programme de reverb qui utilise beaucoup de ressources.

Crée un fichier `reverb-opti.dsp` avec une reverb non optimisée :

```faust
import("stdfaust.lib");

// Version NON OPTIMISÉE d'une reverb FDN simplifiée
// Utilise des appels directs à sin() et des delay lines longues

// Paramètres
decay = hslider("Decay [unit:s]", 2.0, 0.1, 10.0, 0.1);
mix = hslider("Mix", 0.3, 0, 1, 0.01);

// Modulation des délais avec sin() - COÛTEUX
// sin() est appelé à chaque échantillon pour chaque ligne de délai
mod_depth = 10;  // profondeur de modulation en échantillons
mod_freq(i) = (0.5 + i * 0.1);

// Compteur d'échantillons (compatible toutes versions)
sample_count = +(1) ~ _;

// Delay line modulée (version coûteuse)
delay_mod(i, maxdel, del) = _ @ int(del + sin(2 * ma.PI * mod_freq(i)
    * sample_count / ma.SR) * mod_depth);

// 8 delay lines avec des longueurs premières (pour éviter les modes)
delays = (1597, 1831, 2069, 2281, 2399, 2617, 2797, 3001);

// Feedback matrix simple (Householder)
// Chaque delay line reçoit la somme de toutes les sorties
feedback_gain = 0.85 * pow(0.001, 1.0 / (decay * ma.SR));

// Reverb FDN à 8 lignes
// L'entrée est dupliquée sur 8 lignes de delay en parallèle
// Les sorties sont sommées en mono
fdn = par(i, 8, delay_mod(i, 4096, ba.take(i + 1, delays))
    : *(feedback_gain));

reverb = _ <: par(i, 8, _) : (par(i, 8, +) ~ fdn) :> /(8);

process = _ <: (*(1 - mix), (reverb : *(mix))) :> _;
```

Maintenant, crée la version optimisée `reverb-opti-v2.dsp` :

```faust
import("stdfaust.lib");

// Version OPTIMISÉE de la même reverb

// Paramètres
decay = hslider("Decay [unit:s]", 2.0, 0.1, 10.0, 0.1);
mix = hslider("Mix", 0.3, 0, 1, 0.01);

// OPTIMISATION 1 : Utiliser os.osc() au lieu de sin(2π × f × t / SR)
// os.osc() utilise un oscillateur optimisé en interne
mod_depth = 10;
mod_freq(i) = (0.5 + i * 0.1);

// OPTIMISATION 2 : Delay line avec oscillateur optimisé
delay_mod(i, maxdel, del) = _ @ int(del + os.osc(mod_freq(i)) * mod_depth)
    : max(-1) : min(1);

// Mêmes longueurs premières
delays = (1597, 1831, 2069, 2281, 2399, 2617, 2797, 3001);

// OPTIMISATION 3 : Pré-calculer le gain de feedback UNE SEULE FOIS
// pow() est calculé une fois par buffer (variable "lente"), pas par échantillon
feedback_gain = 0.85 * pow(0.001, 1.0 / (decay * ma.SR));

// OPTIMISATION 4 : Delay fixe au lieu de delay modulé
// La modulation est supprimée pour réduire le coût CPU
// (un sin() + int() en moins par ligne de delay et par échantillon)
fdn = par(i, 8, @(ba.take(i + 1, delays)) : *(feedback_gain));

reverb = _ <: par(i, 8, _) : (par(i, 8, +) ~ fdn) :> /(8);

process = _ <: (*(1 - mix), (reverb : *(mix))) :> _;
```

Compare les performances des deux versions :

```bash
# Benchmark de la version non optimisée
faust2bench reverb-opti.dsp
echo "--- Version non optimisée ---"

# Benchmark de la version optimisée
faust2bench reverb-opti-v2.dsp
echo "--- Version optimisée ---"

# Benchmark avec vectorisation sur la version optimisée
faust2bench -vec reverb-opti-v2.dsp
echo "--- Version optimisée + vectorisation ---"
```

**Résultat attendu** :

```text
=== Version non optimisée ===
CPU: XX% (élevé à cause des appels sin() par échantillon)

=== Version optimisée (sans -vec) ===
CPU: YY% (réduit grâce à os.osc() et structure simplifiée)
Gain: ~30-50% de CPU en moins

=== Version optimisée + vectorisation (-vec) ===
CPU: ZZ% (encore réduit grâce au traitement par blocs)
Gain total: ~50-70% de CPU en moins par rapport à la version initiale
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `faust -vec prog.dsp -o prog.cpp` | Compile avec vectorisation |
| `faust -sch prog.dsp -o prog.cpp` | Compile avec scheduling multi-coeurs |
| `faust -omp prog.dsp -o prog.cpp` | Compile avec parallélisation OpenMP |
| `faust -double prog.dsp -o prog.cpp` | Compile en double précision (64-bit) |
| `faust -vec -vs 64 prog.dsp -o prog.cpp` | Vectorisation avec blocs de 64 échantillons |
| `faust -mcd 0 prog.dsp -o prog.cpp` | Désactive la copie des delay lines |
| `faust -cn MonDSP prog.dsp -o prog.cpp` | Nomme la classe C++ générée `MonDSP` |
| `faust -t 30 prog.dsp -o prog.cpp` | Limite le temps de compilation à 30 secondes |
| `faust2bench prog.dsp` | Benchmarke le programme |
| `faust2bench -vec prog.dsp` | Benchmarke avec vectorisation |
| `faust2bench -double prog.dsp` | Benchmarke en double précision |
| `faust -o prog.cpp prog.dsp` | Génère le code C++ pour analyse |

---

## Pièges Fréquents

### Piège 1 : Vectorisation qui ralentit le programme

**Problème** : Tu actives `-vec` sur un programme simple (un gain ou un passe-bas d'ordre 1) et le programme est plus lent qu'avant.

**Solution** : La vectorisation a un overhead (réorganisation des boucles, variables temporaires). Pour les programmes très simples, cet overhead dépasse le gain. N'utilise `-vec` que pour les programmes avec beaucoup de calculs parallèles (synthèse additive, reverb, modélisation physique).

```bash
# ❌ Inutile : programme trop simple pour bénéficier de -vec
faust -vec -o simple.cpp simple_gain.dsp

# ✅ Bénéfique : beaucoup de calculs parallèles
faust -vec -o synth.cpp synthese_additive_32_harmoniques.dsp
```

---

### Piège 2 : Double précision par défaut "au cas où"

**Problème** : Tu compiles tout en `-double` "par sécurité", même quand ce n'est pas nécessaire. Le programme utilise 2 fois plus de mémoire et les instructions SIMD sont 2 fois moins efficaces.

**Solution** : Utilise `-double` uniquement pour les filtres avec Q > 50 ou les applications professionnelles qui nécessitent un noise floor très bas. Pour la synthèse et les effets courants, `float` suffit.

```bash
# ❌ Inutile : un oscillateur simple n'a pas besoin de double précision
faust -double -o osc.cpp simple_oscillateur.dsp

# ✅ Justifié : filtre résonant avec Q élevé
faust -double -o filtre.cpp filtre_resonant_q200.dsp
```

---

### Piège 3 : Oublier `-O3` lors de la compilation C++

**Problème** : Tu benchmarkes le code C++ généré par Faust, mais tu compiles le C++ sans optimisations. Le résultat est beaucoup plus lent que nécessaire et fausse les mesures.

**Solution** : Toujours compiler le C++ avec `-O3` (optimisations maximales) pour les benchmarks et la production.

```bash
# ❌ Compilation sans optimisation (debug) - 5x à 10x plus lent
g++ -o programme programme.cpp -I/usr/share/faust

# ✅ Compilation avec optimisations maximales
g++ -O3 -o programme programme.cpp -I/usr/share/faust

# ✅ Encore mieux : activer les instructions SIMD du processeur
g++ -O3 -march=native -o programme programme.cpp -I/usr/share/faust
```

---

### Piège 4 : Scheduler sur un programme séquentiel

**Problème** : Tu actives `-sch` ou `-omp` sur un programme dont le graphe de calcul est linéaire (chaque calcul dépend du précédent). Le scheduler ajoute un overhead de synchronisation entre threads sans aucun parallélisme réel.

**Solution** : Le scheduling bénéficie aux programmes avec des branches indépendantes (effets parallèles, synthèse additive, multi-voix). Vérifie le diagramme SVG du programme pour voir s'il y a des branches parallèles.

```bash
# ❌ Inutile : filtre en cascade (séquentiel)
faust -sch -o filtre.cpp cascade_filtres.dsp

# ✅ Bénéfique : 8 voix de synthèse indépendantes
faust -sch -o synth.cpp polyphonique_8_voix.dsp

# Vérifier le parallélisme avec le diagramme SVG
faust -svg programme.dsp
# Si le diagramme montre des branches parallèles → -sch peut aider
```

---

### Piège 5 : Ne pas mesurer avant d'optimiser

**Problème** : Tu passes du temps à optimiser une partie du code qui ne représente que 2% du temps CPU, en ignorant la partie qui en consomme 80%.

**Solution** : Toujours profiler d'abord, optimiser ensuite. La loi d'Amdahl montre que l'accélération maximale est limitée par la fraction non parallélisée : optimiser 2% du code ne peut accélérer le programme que de 2% au maximum.

```bash
# ✅ Séquence correcte d'optimisation :

# 1. Mesurer les performances initiales
faust2bench programme.dsp

# 2. Profiler pour identifier les hotspots
perf record -g ./programme
perf report

# 3. Optimiser les hotspots identifiés
# (modifier le code Faust)

# 4. Mesurer à nouveau pour vérifier le gain
faust2bench programme_optimise.dsp
```

---

## Checklist de Validation

- [ ] Je sais activer la vectorisation avec `-vec` et je comprends son fonctionnement (traitement par blocs, SIMD)
- [ ] Je sais quand la vectorisation est bénéfique (programmes avec beaucoup de calculs parallèles) et quand elle ne l'est pas (programmes simples)
- [ ] Je sais activer le scheduling automatique avec `-sch` ou `-omp`
- [ ] Je comprends la différence entre vectorisation (un coeur, SIMD) et scheduling (multi-coeurs)
- [ ] Je sais compiler en double précision avec `-double` et je sais quand c'est nécessaire (filtres à Q élevé)
- [ ] Je sais benchmarker un programme avec `faust2bench` et interpréter les résultats (MFlops, CPU%)
- [ ] Je sais générer et lire le code C++ produit par Faust (`-o output.cpp`)
- [ ] Je sais identifier les éléments coûteux dans le code C++ (fonctions transcendantes, accès mémoire)
- [ ] Je sais utiliser un outil de profiling (perf ou Instruments) pour localiser les hotspots
- [ ] Je connais les techniques d'optimisation algorithmique (lookup tables, approximations, réduction d'ordre)
- [ ] Je sais optimiser l'utilisation mémoire (taille des tables, puissances de 2, `-single`)
- [ ] Je connais les différences de performance entre les backends (C++, LLVM JIT, Wasm, Interpreter)
- [ ] Je sais utiliser `-cn` et `-t` pour contrôler le nom de classe et le timeout de compilation

---

## Exercice Pratique

**Enonce** : Optimiser une reverb FDN (Feedback Delay Network) complexe en appliquant les techniques de cette fiche.

**Cahier des charges** :

1. Partir d'un programme de reverb FDN à 8 lignes de délai avec modulation
2. Mesurer les performances initiales avec `faust2bench`
3. Activer la vectorisation (`-vec`) et mesurer le gain
4. Analyser le code C++ généré pour identifier les opérations coûteuses
5. Appliquer au moins une optimisation algorithmique (remplacer `sin()` par `os.osc()`, simplifier la structure, etc.)
6. Mesurer les performances finales et calculer le gain total

**Indications** :

- Utilise le fichier `reverb-opti.dsp` de l'Étape 5 comme point de départ
- Pour le benchmarking, utilise `faust2bench` ou, si non disponible, compare les temps de génération du code C++ et la complexité du code généré
- Examine le code C++ avec `faust -o output.cpp` pour identifier les appels à `sin()`, `cos()`, `exp()` dans la boucle `compute()`
- Applique les optimisations progressivement : une seule modification à la fois, avec une mesure entre chaque modification
- Note les résultats dans un tableau pour comparer

**Résultat attendu** :

```text
Tableau de résultats (exemple) :

| Étape                          | CPU %  | Gain vs initial |
| ------------------------------ | ------ | --------------- |
| Version initiale               | 45.2%  | (référence)     |
| + vectorisation (-vec)         | 28.1%  | -38%            |
| + remplacement sin() → os.osc  | 22.4%  | -50%            |
| + simplification structure     | 18.7%  | -59%            |
| + -vec sur version optimisée   | 12.3%  | -73%            |

Le programme final utilise 73% de CPU en moins que la version initiale.
Il respecte largement le budget temps réel pour un buffer de 256
échantillons à 44100 Hz (5.8 ms disponibles).
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Programme de départ (version non optimisée)**

Utilise le fichier `reverb-opti.dsp` créé à l'Étape 5. C'est la version non optimisée avec des appels directs à `sin()`.

**Étape 2 : Mesure initiale**

```bash
# Benchmark de la version initiale
faust2bench reverb-opti.dsp
# Note le CPU% et les MFlops
```

**Étape 3 : Activation de la vectorisation**

```bash
# Benchmark avec vectorisation
faust2bench -vec reverb-opti.dsp
# Compare avec la mesure initiale
```

**Étape 4 : Analyse du code C++ généré**

```bash
# Génère le code C++ pour analyse
faust -o reverb-analyse.cpp reverb-opti.dsp
```

En lisant le fichier `reverb-analyse.cpp`, tu devrais trouver dans la boucle `compute()` :

```cpp
// Extrait du code non optimisé (simplifié)
for (int i = 0; i < count; i++) {
    // ...
    // Appel à sin() pour chaque ligne de délai, à chaque échantillon
    // C'est le hotspot : sin() coûte ~50-100 cycles CPU
    float fTemp1 = std::sin(6.2831855f * fRec_mod[0]);
    // ...8 appels à sin() au total...
}
```

Les 8 appels à `sin()` dans la boucle interne sont le goulot d'étranglement principal.

**Étape 5 : Application des optimisations**

Version optimisée complète :

```faust
import("stdfaust.lib");

// ──────────────────────────────────────────────
// REVERB FDN OPTIMISÉE
// ──────────────────────────────────────────────

// Paramètres utilisateur
decay = hslider("Decay [unit:s]", 2.0, 0.1, 10.0, 0.1);
mix = hslider("Mix", 0.3, 0, 1, 0.01);

// OPTIMISATION 1 : Pas de modulation des delay lines
// La modulation par sin() coûte ~400-800 cycles par échantillon (8 × sin())
// Pour une reverb simple, la modulation est facultative
// Si la modulation est nécessaire, utiliser os.osc() (cf. version intermédiaire)

// Longueurs de delay premières entre elles (évite les modes résonants)
d1 = 1597; d2 = 1831; d3 = 2069; d4 = 2281;
d5 = 2399; d6 = 2617; d7 = 2797; d8 = 3001;

// OPTIMISATION 2 : Calcul du gain de feedback
// pow() est une variable "lente" → calculée une seule fois par buffer
// Le compilateur Faust détecte automatiquement les variables qui ne
// dépendent que des sliders et les sort de la boucle compute()
fb = 0.85 * pow(0.001, 1.0 / (decay * ma.SR));

// OPTIMISATION 3 : Delay lines sans modulation
// Chaque ligne utilise un délai fixe (pas d'appel à sin())
// Le coût par échantillon est : 1 lecture mémoire + 1 multiplication
line(d) = @(d) : *(fb);

// OPTIMISATION 4 : Structure FDN simplifiée
// 8 delay lines en parallèle → somme → redistribution
// La redistribution utilise un simple split au lieu d'une matrice complète
fdn_loop = par(i, 8, line(ba.take(i + 1, (d1,d2,d3,d4,d5,d6,d7,d8))))
    :> _ <: par(i, 8, _);

// Reverb avec feedback
reverb = + ~ fdn_loop;

// Mix sec/mouillé
// (1-mix) × signal sec + mix × signal mouillé
process = _ <: (*(1 - mix), (reverb : *(mix))) :> _;
```

**Étape 6 : Mesure finale**

```bash
# Benchmark de la version optimisée sans vectorisation
faust2bench reverb-opti-v2.dsp
echo "--- Optimisé, scalaire ---"

# Benchmark de la version optimisée avec vectorisation
faust2bench -vec reverb-opti-v2.dsp
echo "--- Optimisé, vectorisé ---"
```

**Vérification du code C++ optimisé** :

```bash
# Générer le code C++ de la version optimisée
faust -o reverb-opti-v2.cpp reverb-opti-v2.dsp
```

En lisant `reverb-opti-v2.cpp`, la boucle `compute()` ne devrait plus contenir d'appels à `sin()`. Les opérations sont réduites à des lectures/écritures mémoire et des multiplications.

```text
Résultat de l'exercice :

| Version                   | Opérations coûteuses/éch. | CPU % estimé |
| ------------------------- | ------------------------- | ------------ |
| Initiale (sin × 8)       | 8 sin + 8 mul + mémoire   | ~45%         |
| os.osc au lieu de sin     | 8 osc + 8 mul + mémoire   | ~25%         |
| Sans modulation           | 8 mul + mémoire           | ~15%         |
| Sans modulation + -vec    | (8 mul + mémoire) / SIMD  | ~8%          |

Le gain total dépend du processeur, de la fréquence d'échantillonnage
et de la taille du buffer. Le facteur le plus impactant est la
suppression des appels à sin() dans la boucle interne.
```

---

## Navigation

→ Fiche suivante : **[02 - Contribution au projet Faust](02-contribution-projet.md)**
