---
tags:
  - IA
  - Débutant
  - Pratique
description: "Python scientifique pour l'IA : NumPy (vectorisation, broadcasting), Pandas (DataFrames, filtrage) et Matplotlib (visualisations)"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 3
cursus: "Phase 2 - Programmation et outils"
---

# 01 - Python pour l'IA

> **En bref** : À la fin de cette fiche, tu sauras utiliser NumPy pour manipuler des tableaux multidimensionnels avec la vectorisation et le broadcasting, Pandas pour charger et transformer des DataFrames, et Matplotlib pour créer des visualisations claires. Lecture estimée : 55 min.


## Prérequis

- Connaissances basiques en Python : variables, boucles, fonctions, listes, dictionnaires
- Si tu ne connais pas Python, consulte un tutoriel d'introduction d'abord (par exemple le tutoriel officiel Python)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser NumPy pour manipuler des tableaux multidimensionnels avec la vectorisation et le broadcasting, Pandas pour charger et transformer des DataFrames, et Matplotlib pour créer des visualisations claires.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que NumPy ?

**Définition** : NumPy (Numerical Python) est une bibliothèque Python qui fournit un objet `ndarray` (tableau multidimensionnel) et des fonctions mathématiques optimisées pour le calcul scientifique.

**Le problème que NumPy résout** :

Sans NumPy, voici les problèmes rencontrés :

1. **Listes Python lentes** : les listes Python stockent des objets hétérogènes, ce qui ralentit les calculs numériques
2. **Pas d'opérations vectorisées** : pour additionner deux listes, il faut écrire une boucle `for` explicite
3. **Pas de support matriciel** : Python natif ne fournit pas de type pour les matrices ou les tableaux multidimensionnels

**Comment NumPy résout ces problèmes** :

| Problème | Solution apportée par NumPy |
| -------- | --------------------------- |
| Listes Python lentes | Les `ndarray` stockent des données homogènes en mémoire contiguë, comme en C |
| Pas d'opérations vectorisées | Les opérations s'appliquent élément par élément sans boucle (`a + b`) |
| Pas de support matriciel | Les `ndarray` supportent N dimensions avec indexing et slicing avancés |

**Analogie concrète** : Imagine que tu dois calculer la note moyenne de 1000 élèves. Avec les listes Python, tu ouvres chaque dossier un par un (boucle `for`). Avec NumPy, tu as un tableau Excel où tu sélectionnes toute la colonne et tu cliques sur "Moyenne" : le calcul se fait d'un coup sur toute la colonne.

**Ce que NumPy n'est PAS** :

- NumPy n'est pas Pandas. Pandas est construit au-dessus de NumPy et ajoute des étiquettes (noms de colonnes, index). NumPy travaille uniquement avec des indices numériques.
- NumPy n'est pas une bibliothèque de machine learning. NumPy fournit les briques de base (tableaux, calculs), mais pas les algorithmes de ML. Pour cela, on utilise scikit-learn ou PyTorch.

#### Le ndarray

Le `ndarray` est l'objet central de NumPy. Ses propriétés principales :

| Propriété | Description | Exemple |
| --------- | ----------- | ------- |
| `shape` | Dimensions du tableau | `(3, 4)` = 3 lignes, 4 colonnes |
| `dtype` | Type des éléments | `float64`, `int32`, `bool` |
| `ndim` | Nombre de dimensions | `2` pour une matrice |
| `size` | Nombre total d'éléments | `12` pour un tableau 3x4 |

---

### Qu'est-ce que la vectorisation ?

**Définition** : La vectorisation est le fait d'appliquer une opération à un tableau entier en une seule instruction, sans écrire de boucle `for` explicite. L'opération est déléguée à du code C/Fortran compilé et optimisé.

**Le problème que la vectorisation résout** :

Sans vectorisation, voici les problèmes rencontrés :

1. **Boucles lentes** : une boucle Python `for` sur 1 million d'éléments prend plusieurs secondes
2. **Code verbeux** : il faut écrire la boucle, l'indexation, l'accumulation du résultat
3. **Erreurs d'index** : les boucles manuelles sont sources de bugs (off-by-one, index inversé)

**Comment la vectorisation résout ces problèmes** :

| Problème | Solution apportée par la vectorisation |
| -------- | -------------------------------------- |
| Boucles lentes | L'opération est exécutée en C compilé, 10 à 100 fois plus rapide |
| Code verbeux | Une seule ligne remplace la boucle entière |
| Erreurs d'index | Pas d'index à gérer, l'opération s'applique à tout le tableau |

**Analogie concrète** : Imagine que tu dois tamponner 1000 enveloppes. Sans vectorisation, tu tamponnes chaque enveloppe une par une (boucle). Avec vectorisation, tu empiles les 1000 enveloppes et tu utilises un tampon géant qui les tamponne toutes en un seul geste.

**Ce que la vectorisation n'est PAS** :

- La vectorisation n'est pas de la parallélisation GPU. La vectorisation utilise le CPU de manière optimisée. Le GPU est un autre niveau d'accélération.
- La vectorisation n'est pas magique. Si ton opération nécessite des dépendances entre itérations (chaque résultat dépend du précédent), la vectorisation peut ne pas s'appliquer directement.

#### Benchmark : boucle vs vectorisation

```python
import numpy as np
import time

# Créer un tableau de 1 million d'éléments
taille = 1_000_000
tableau = np.random.rand(taille)

# Méthode 1 : boucle Python
debut = time.time()
resultat_boucle = 0
for valeur in tableau:
    resultat_boucle += valeur * 2 + 1
temps_boucle = time.time() - debut

# Méthode 2 : vectorisation NumPy
debut = time.time()
resultat_numpy = np.sum(tableau * 2 + 1)
temps_numpy = time.time() - debut

print(f"Boucle Python : {temps_boucle:.4f} secondes")
print(f"NumPy vectorisé : {temps_numpy:.4f} secondes")
print(f"Accélération : {temps_boucle / temps_numpy:.0f}x")
```

**Résultat attendu** :

```text
Boucle Python : 0.3512 secondes
NumPy vectorisé : 0.0034 secondes
Accélération : 103x
```

---

### Qu'est-ce que le broadcasting ?

**Définition** : Le broadcasting est un mécanisme NumPy qui permet d'effectuer des opérations arithmétiques entre des tableaux de dimensions différentes, en "étirant" automatiquement le plus petit tableau pour qu'il corresponde au plus grand.

**Le problème que le broadcasting résout** :

Sans broadcasting, voici les problèmes rencontrés :

1. **Dimensions incompatibles** : impossible d'additionner un tableau 3x4 avec un tableau 1x4 directement
2. **Duplication manuelle** : il faut créer une copie agrandie du petit tableau pour que les dimensions correspondent
3. **Gaspillage de mémoire** : la duplication crée des copies inutiles en mémoire

**Comment le broadcasting résout ces problèmes** :

| Problème | Solution apportée par le broadcasting |
| -------- | ------------------------------------- |
| Dimensions incompatibles | NumPy "étire" virtuellement le petit tableau pour correspondre au grand |
| Duplication manuelle | L'étirement est automatique, pas besoin de code supplémentaire |
| Gaspillage de mémoire | L'étirement est virtuel, aucune copie réelle n'est créée |

**Analogie concrète** : Imagine un tableau de notes de 30 élèves pour 5 matières (tableau 30x5). Tu veux ajouter 2 points bonus à chaque matière, mais le bonus est différent par matière : `[2, 0, 1, 3, 0]` (tableau 1x5). Le broadcasting "copie" automatiquement cette ligne de bonus pour chacun des 30 élèves, sans créer 30 copies réelles.

**Règles du broadcasting** :

NumPy compare les dimensions de droite à gauche. Deux dimensions sont compatibles si :

1. Elles sont égales
2. L'une des deux vaut 1

| Tableau A | Tableau B | Compatible ? | Résultat |
| --------- | --------- | ------------ | -------- |
| `(3, 4)` | `(1, 4)` | Oui | `(3, 4)` |
| `(3, 4)` | `(4,)` | Oui | `(3, 4)` |
| `(3, 4)` | `(3, 1)` | Oui | `(3, 4)` |
| `(3, 4)` | `(2, 4)` | Non | Erreur |

---

### Qu'est-ce que Pandas ?

**Définition** : Pandas est une bibliothèque Python construite au-dessus de NumPy qui fournit deux structures de données : `Series` (colonne avec index) et `DataFrame` (tableau avec colonnes nommées et index), conçues pour la manipulation et l'analyse de données tabulaires.

**Le problème que Pandas résout** :

Sans Pandas, voici les problèmes rencontrés :

1. **Pas d'étiquettes** : avec NumPy, les colonnes sont identifiées par des indices numériques (0, 1, 2), pas par des noms
2. **Types mixtes impossibles** : un `ndarray` NumPy ne peut contenir qu'un seul type de données. Un tableau avec des noms (texte) et des ages (entiers) est impossible
3. **Pas de lecture CSV native** : charger un fichier CSV avec NumPy nécessite du code complexe pour gérer les en-têtes et les types

**Comment Pandas résout ces problèmes** :

| Problème | Solution apportée par Pandas |
| -------- | ---------------------------- |
| Pas d'étiquettes | Les colonnes ont des noms (`df["age"]`) et les lignes un index |
| Types mixtes impossibles | Chaque colonne peut avoir son propre type (str, int, float) |
| Pas de lecture CSV native | `pd.read_csv("fichier.csv")` charge un CSV en une ligne |

**Analogie concrète** : Si NumPy est une grille de calcul sans en-têtes (comme un tableau de nombres bruts), Pandas est un tableur complet (comme LibreOffice Calc) avec des noms de colonnes, des filtres, et la possibilité de mélanger texte et nombres dans le même tableau.

**Ce que Pandas n'est PAS** :

- Pandas n'est pas une base de données. Pandas charge toutes les données en mémoire (RAM). Pour des données de plusieurs Go, il faut utiliser une base de données (PostgreSQL) ou des outils comme Dask.
- Pandas n'est pas fait pour le calcul matriciel. Pour des opérations mathématiques pures sur des matrices, NumPy est plus approprié et plus rapide.

**Comparaison NumPy vs Pandas** :

| NumPy | Pandas |
| ----- | ------ |
| Tableaux homogènes (un seul type) | Colonnes hétérogènes (types mixtes) |
| Accès par indices numériques | Accès par noms de colonnes |
| Rapide pour le calcul numérique pur | Rapide pour la manipulation de données tabulaires |
| Pas de gestion des valeurs manquantes | Gestion native des `NaN` |

---

### Qu'est-ce que Matplotlib ?

**Définition** : Matplotlib est une bibliothèque Python de visualisation de données qui produit des graphiques statiques (courbes, barres, histogrammes, nuages de points) de qualité publication.

**Le problème que Matplotlib résout** :

Sans Matplotlib, voici les problèmes rencontrés :

1. **Pas de visualisation** : les résultats numériques sont difficiles à interpréter sans graphique
2. **Dépendance à des outils externes** : il faut exporter les données vers un tableur pour créer des graphiques
3. **Pas de personnalisation** : les outils simples ne permettent pas de contrôler chaque aspect du graphique

**Comment Matplotlib résout ces problèmes** :

| Problème | Solution apportée par Matplotlib |
| -------- | -------------------------------- |
| Pas de visualisation | Créer des graphiques directement dans le script Python |
| Dépendance externe | Le graphique est généré dans le même environnement que le calcul |
| Pas de personnalisation | Contrôle total : couleurs, axes, légendes, tailles, annotations |

**Analogie concrète** : Matplotlib est un atelier de dessin technique intégré à ton laboratoire. Au lieu de photographier tes résultats et de les envoyer à un graphiste, tu dessines toi-même les graphiques sur place, avec la précision que tu veux.

**Structure d'un graphique Matplotlib** :

| Élément | Description |
| ------- | ----------- |
| `Figure` | Le conteneur principal (la feuille de papier) |
| `Axes` | Une zone de dessin dans la figure (un graphique) |
| `Plot` | Les données dessinées (courbe, barres, points) |
| `Labels` | Les étiquettes des axes et le titre |
| `Legend` | La légende identifiant chaque série de données |

---

## Étapes Pratiques

### Étape 1 : Installer NumPy, Pandas et Matplotlib

Crée un environnement virtuel et installe les trois bibliothèques.

```bash
# Créer un environnement virtuel
python3 -m venv env-ia

# Activer l'environnement virtuel
source env-ia/bin/activate

# Installer les trois bibliothèques
pip install numpy pandas matplotlib

# Vérifier les versions installées
python3 -c "import numpy; import pandas; import matplotlib; print(f'NumPy {numpy.__version__}'); print(f'Pandas {pandas.__version__}'); print(f'Matplotlib {matplotlib.__version__}')"
```

**Résultat attendu** :

```text
NumPy 2.5.2
Pandas 3.0.5
Matplotlib 3.10.x
```

Les numéros exacts évoluent. En 2026, `pip install numpy pandas matplotlib` installe **NumPy 2.x** (pas 1.26), **Pandas 3.x** et Matplotlib 3.10+. L'important est que les trois imports réussissent.

---

### Étape 2 : Créer et manipuler des tableaux NumPy

```python
import numpy as np

# Créer un tableau 1D à partir d'une liste
notes = np.array([12, 15, 8, 17, 14, 9, 11, 16])
print(f"Notes : {notes}")
print(f"Shape : {notes.shape}")       # (8,) = 1 dimension, 8 éléments
print(f"Type : {notes.dtype}")         # int64

# Créer un tableau 2D (matrice)
# 3 élèves, 4 matières
matrice_notes = np.array([
    [12, 15, 8, 14],    # Élève 1
    [17, 11, 13, 16],   # Élève 2
    [9, 14, 10, 12]     # Élève 3
])
print(f"\nMatrice :\n{matrice_notes}")
print(f"Shape : {matrice_notes.shape}")  # (3, 4) = 3 lignes, 4 colonnes

# Fonctions de création courantes
zeros = np.zeros((2, 3))         # Tableau de zéros 2x3
uns = np.ones((3, 3))            # Tableau de uns 3x3
sequence = np.arange(0, 10, 2)   # [0, 2, 4, 6, 8] (comme range)
lineaire = np.linspace(0, 1, 5)  # [0.0, 0.25, 0.5, 0.75, 1.0] (5 points entre 0 et 1)
aleatoire = np.random.rand(3, 3) # Tableau 3x3 de valeurs aléatoires entre 0 et 1

print(f"\nZeros :\n{zeros}")
print(f"Séquence : {sequence}")
print(f"Linéaire : {lineaire}")
```

**Résultat attendu** :

```text
Notes : [12 15  8 17 14  9 11 16]
Shape : (8,)
Type : int64

Matrice :
[[12 15  8 14]
 [17 11 13 16]
 [9 14 10 12]]
Shape : (3, 4)

Zeros :
[[0. 0. 0.]
 [0. 0. 0.]]
Séquence : [0 2 4 6 8]
Linéaire : [0.   0.25 0.5  0.75 1.  ]
```

---

### Étape 3 : Indexing et slicing NumPy

```python
import numpy as np

matrice = np.array([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120]
])

# Accéder à un élément : matrice[ligne, colonne]
print(f"Élément [1, 2] : {matrice[1, 2]}")  # 70

# Slicing : matrice[début_ligne:fin_ligne, début_col:fin_col]
# Récupérer les 2 premières lignes, toutes les colonnes
print(f"2 premières lignes :\n{matrice[:2, :]}")

# Récupérer toutes les lignes, colonnes 1 à 2 (indices 1 et 2)
print(f"Colonnes 1-2 :\n{matrice[:, 1:3]}")

# Indexing booléen : sélectionner les éléments > 50
masque = matrice > 50
print(f"\nMasque (> 50) :\n{masque}")
print(f"Éléments > 50 : {matrice[masque]}")

# Fancy indexing : sélectionner des lignes spécifiques
lignes_choisies = matrice[[0, 2]]  # Lignes 0 et 2
print(f"\nLignes 0 et 2 :\n{lignes_choisies}")
```

**Résultat attendu** :

```text
Élément [1, 2] : 70
2 premières lignes :
[[10 20 30 40]
 [50 60 70 80]]
Colonnes 1-2 :
[[ 20  30]
 [ 60  70]
 [100 110]]

Masque (> 50) :
[[False False False False]
 [False  True  True  True]
 [ True  True  True  True]]
Éléments > 50 : [ 60  70  80  90 100 110 120]

Lignes 0 et 2 :
[[ 10  20  30  40]
 [ 90 100 110 120]]
```

---

### Étape 4 : Opérations vectorisées et broadcasting

```python
import numpy as np

# Opérations vectorisées sur un tableau entier
notes = np.array([12, 15, 8, 17, 14])
print(f"Notes originales : {notes}")
print(f"Notes + 2 : {notes + 2}")           # Ajouter 2 à chaque note
print(f"Notes * 1.5 : {notes * 1.5}")       # Multiplier chaque note par 1.5
print(f"Moyenne : {notes.mean():.1f}")       # Moyenne
print(f"Écart-type : {notes.std():.1f}")     # Écart-type
print(f"Max : {notes.max()}, Min : {notes.min()}")

# Broadcasting : opération entre tableaux de dimensions différentes
# Tableau 3x4 (3 élèves, 4 matières)
notes_classe = np.array([
    [12, 15, 8, 14],
    [17, 11, 13, 16],
    [9, 14, 10, 12]
])

# Coefficients par matière (tableau 1x4)
coefficients = np.array([3, 2, 2, 1])

# Broadcasting : chaque ligne est multipliée par les coefficients
notes_ponderees = notes_classe * coefficients
print(f"\nNotes pondérées :\n{notes_ponderees}")

# Moyenne pondérée par élève (somme par ligne / somme des coefficients)
moyennes = notes_ponderees.sum(axis=1) / coefficients.sum()
print(f"Moyennes pondérées : {moyennes}")
```

**Résultat attendu** :

```text
Notes originales : [12 15  8 17 14]
Notes + 2 : [14 17 10 19 16]
Notes * 1.5 : [18.  22.5 12.  25.5 21. ]
Moyenne : 13.2
Écart-type : 3.1
Max : 17, Min : 8

Notes pondérées :
[[36 30 16 14]
 [51 22 26 16]
 [27 28 20 12]]
Moyennes pondérées : [12.   14.375 10.875]
```

---

### Étape 5 : Charger et manipuler des données avec Pandas

```python
import pandas as pd
import numpy as np

# Créer un DataFrame manuellement
donnees = {
    "nom": ["Alice", "Bob", "Clara", "David", "Emma"],
    "age": [25, 30, 28, 35, 22],
    "ville": ["Paris", "Lyon", "Paris", "Marseille", "Lyon"],
    "salaire": [35000, 42000, 38000, 55000, 28000]
}
df = pd.DataFrame(donnees)
print("DataFrame :")
print(df)
print(f"\nShape : {df.shape}")    # (5, 4) = 5 lignes, 4 colonnes
print(f"Colonnes : {list(df.columns)}")
print(f"Types :\n{df.dtypes}")

# Accéder à une colonne
print(f"\nAges : {df['age'].values}")

# Filtrer les lignes
parisiens = df[df["ville"] == "Paris"]
print(f"\nParisiens :\n{parisiens}")

# Filtrage combiné : ville == Paris ET salaire > 36000
filtre = df[(df["ville"] == "Paris") & (df["salaire"] > 36000)]
print(f"\nParisiens avec salaire > 36000 :\n{filtre}")

# Statistiques descriptives
print(f"\nStatistiques :\n{df.describe()}")

# Groupby : statistiques par ville
par_ville = df.groupby("ville")["salaire"].agg(["mean", "count"])
print(f"\nSalaire par ville :\n{par_ville}")
```

**Résultat attendu** :

```text
DataFrame :
     nom  age      ville  salaire
0  Alice   25      Paris    35000
1    Bob   30       Lyon    42000
2  Clara   28      Paris    38000
3  David   35  Marseille    55000
4   Emma   22       Lyon    28000

Shape : (5, 4)
Colonnes : ['nom', 'age', 'ville', 'salaire']

Parisiens :
     nom  age  ville  salaire
0  Alice   25  Paris    35000
2  Clara   28  Paris    38000

Salaire par ville :
              mean  count
ville
Lyon       35000.0      2
Marseille  55000.0      1
Paris      36500.0      2
```

---

### Étape 6 : Charger un CSV avec Pandas

```python
import pandas as pd

# Créer un fichier CSV d'exemple pour le test
csv_contenu = """nom,age,note_math,note_info,note_anglais
Alice,25,15,17,12
Bob,30,8,14,16
Clara,28,12,11,9
David,35,18,19,15
Emma,22,10,13,14
Frank,27,14,16,11
"""

# Écrire le CSV dans un fichier
with open("etudiants.csv", "w") as f:
    f.write(csv_contenu)

# Charger le CSV
df = pd.read_csv("etudiants.csv")
print("Données chargées :")
print(df)
print(f"\nTypes :\n{df.dtypes}")

# Ajouter une colonne calculée : moyenne des notes
colonnes_notes = ["note_math", "note_info", "note_anglais"]
df["moyenne"] = df[colonnes_notes].mean(axis=1)
print(f"\nAvec moyenne :\n{df[['nom', 'moyenne']]}")

# Trier par moyenne décroissante
df_trie = df.sort_values("moyenne", ascending=False)
print(f"\nClassement :\n{df_trie[['nom', 'moyenne']]}")

# Sauvegarder le résultat
df_trie.to_csv("etudiants_resultats.csv", index=False)
print("\nFichier sauvegardé : etudiants_resultats.csv")
```

**Résultat attendu** :

```text
Données chargées :
     nom  age  note_math  note_info  note_anglais
0  Alice   25         15         17            12
1    Bob   30          8         14            16
2  Clara   28         12         11             9
3  David   35         18         19            15
4   Emma   22         10         13            14
5  Frank   27         14         16            11

Avec moyenne :
     nom    moyenne
0  Alice  14.666667
1    Bob  12.666667
2  Clara  10.666667
3  David  17.333333
4   Emma  12.333333
5  Frank  13.666667

Classement :
     nom    moyenne
3  David  17.333333
0  Alice  14.666667
5  Frank  13.666667
1    Bob  12.666667
4   Emma  12.333333
2  Clara  10.666667
```

---

### Étape 7 : Créer des visualisations avec Matplotlib

```python
import matplotlib.pyplot as plt
import numpy as np

# Graphique 1 : Courbe simple (line plot)
x = np.linspace(0, 10, 100)       # 100 points entre 0 et 10
y_sin = np.sin(x)                   # Sinus
y_cos = np.cos(x)                   # Cosinus

fig, ax = plt.subplots(figsize=(8, 5))  # Créer une figure de 8x5 pouces
ax.plot(x, y_sin, label="sin(x)", color="blue", linewidth=2)
ax.plot(x, y_cos, label="cos(x)", color="red", linestyle="--", linewidth=2)
ax.set_xlabel("x")                  # Étiquette axe X
ax.set_ylabel("y")                  # Étiquette axe Y
ax.set_title("Fonctions trigonométriques")  # Titre
ax.legend()                          # Afficher la légende
ax.grid(True, alpha=0.3)            # Grille transparente
plt.tight_layout()                   # Ajuster les marges
plt.savefig("courbes.png", dpi=150)  # Sauvegarder en PNG
plt.show()
```

```python
# Graphique 2 : Nuage de points (scatter plot)
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
tailles = np.random.normal(170, 10, 100)    # 100 tailles (moyenne 170, écart-type 10)
poids = tailles * 0.5 + np.random.normal(0, 5, 100)  # Relation linéaire avec bruit

fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(tailles, poids, alpha=0.6, color="teal", edgecolors="black", linewidth=0.5)
ax.set_xlabel("Taille (cm)")
ax.set_ylabel("Poids (kg)")
ax.set_title("Relation taille-poids")
plt.tight_layout()
plt.savefig("scatter.png", dpi=150)
plt.show()
```

```python
# Graphique 3 : Histogramme et subplots
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
notes_math = np.random.normal(12, 3, 200)       # 200 notes de math
notes_info = np.random.normal(14, 2, 200)        # 200 notes d'info

# Créer 2 graphiques côte à côte
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Histogramme des notes de math
ax1.hist(notes_math, bins=20, color="steelblue", edgecolor="black", alpha=0.7)
ax1.set_xlabel("Note")
ax1.set_ylabel("Fréquence")
ax1.set_title("Distribution des notes de math")
ax1.axvline(notes_math.mean(), color="red", linestyle="--", label=f"Moyenne : {notes_math.mean():.1f}")
ax1.legend()

# Histogramme des notes d'info
ax2.hist(notes_info, bins=20, color="coral", edgecolor="black", alpha=0.7)
ax2.set_xlabel("Note")
ax2.set_ylabel("Fréquence")
ax2.set_title("Distribution des notes d'info")
ax2.axvline(notes_info.mean(), color="red", linestyle="--", label=f"Moyenne : {notes_info.mean():.1f}")
ax2.legend()

plt.tight_layout()
plt.savefig("histogrammes.png", dpi=150)
plt.show()
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `np.array([1, 2, 3])` | Créer un tableau NumPy 1D |
| `np.zeros((3, 4))` | Créer un tableau de zéros 3x4 |
| `np.ones((2, 2))` | Créer un tableau de uns 2x2 |
| `np.arange(0, 10, 2)` | Créer une séquence [0, 2, 4, 6, 8] |
| `np.linspace(0, 1, 5)` | Créer 5 points uniformément espacés entre 0 et 1 |
| `np.random.rand(3, 3)` | Créer un tableau 3x3 de valeurs aléatoires |
| `tableau.shape` | Dimensions du tableau |
| `tableau.mean(axis=0)` | Moyenne par colonne |
| `tableau.sum(axis=1)` | Somme par ligne |
| `pd.read_csv("f.csv")` | Charger un fichier CSV en DataFrame |
| `df.head()` | Afficher les 5 premières lignes |
| `df.describe()` | Statistiques descriptives |
| `df.groupby("col")` | Grouper par colonne |
| `df.sort_values("col")` | Trier par colonne |
| `plt.subplots()` | Créer une figure et des axes |
| `ax.plot(x, y)` | Tracer une courbe |
| `ax.scatter(x, y)` | Tracer un nuage de points |
| `ax.hist(data, bins=20)` | Tracer un histogramme |
| `plt.savefig("f.png")` | Sauvegarder le graphique |

---

## Pièges Fréquents

### Piège 1 : Modifier un slice NumPy modifie le tableau original

⚠️ **Problème** : Un slice NumPy est une vue (view), pas une copie. Modifier le slice modifie le tableau original.

```python
import numpy as np

original = np.array([1, 2, 3, 4, 5])
vue = original[1:4]     # [2, 3, 4] - c'est une VUE, pas une copie
vue[0] = 99             # Modifie aussi original !
print(original)          # [1, 99, 3, 4, 5] - original est modifié
```

✅ **Solution** : Utiliser `.copy()` pour créer une copie indépendante.

```python
copie = original[1:4].copy()  # Copie indépendante
copie[0] = 99                  # Ne modifie PAS original
```

---

### Piège 2 : Confondre `axis=0` et `axis=1`

⚠️ **Problème** : `axis=0` opère le long des lignes (résultat par colonne) et `axis=1` opère le long des colonnes (résultat par ligne). C'est contre-intuitif.

✅ **Solution** : Retenir cette règle : `axis=0` "écrase" les lignes (le résultat a autant d'éléments que de colonnes). `axis=1` "écrase" les colonnes (le résultat a autant d'éléments que de lignes).

```python
import numpy as np

m = np.array([[1, 2], [3, 4], [5, 6]])
print(m.sum(axis=0))  # [9, 12] - somme par colonne (3 lignes écrasées)
print(m.sum(axis=1))  # [3, 7, 11] - somme par ligne (2 colonnes écrasées)
```

---

### Piège 3 : Comparer des DataFrames avec `==` au lieu de `.equals()`

⚠️ **Problème** : L'opérateur `==` sur un DataFrame retourne un DataFrame de booléens, pas un seul booléen.

✅ **Solution** : Utiliser `df1.equals(df2)` pour comparer deux DataFrames entiers.

```python
import pandas as pd

df1 = pd.DataFrame({"a": [1, 2]})
df2 = pd.DataFrame({"a": [1, 2]})

# Mauvais : retourne un DataFrame de booléens
print(df1 == df2)

# Bon : retourne un seul booléen
print(df1.equals(df2))  # True
```

---

### Piège 4 : Oublier `plt.tight_layout()` et avoir des labels coupés

⚠️ **Problème** : Les étiquettes des axes ou le titre sont coupés dans l'image sauvegardée.

✅ **Solution** : Toujours appeler `plt.tight_layout()` avant `plt.savefig()` pour ajuster automatiquement les marges.

---

## Checklist de Validation

- [ ] Je sais créer des tableaux NumPy 1D et 2D avec `np.array()`, `np.zeros()`, `np.ones()`
- [ ] Je sais utiliser l'indexing et le slicing sur un ndarray (y compris le masque booléen)
- [ ] Je comprends la vectorisation et pourquoi elle est plus rapide qu'une boucle `for`
- [ ] Je sais expliquer les règles du broadcasting
- [ ] Je sais créer un DataFrame Pandas et charger un fichier CSV
- [ ] Je sais filtrer, trier et grouper des données avec Pandas
- [ ] Je sais créer une courbe, un nuage de points et un histogramme avec Matplotlib
- [ ] Je sais utiliser les subplots pour afficher plusieurs graphiques

---

## Exercice Pratique

**Énoncé** : Crée un pipeline NumPy/Pandas/Matplotlib complet. Tu vas charger un dataset, le transformer, calculer des statistiques et visualiser les résultats.

**Indications** :

- Crée un fichier CSV avec 50 enregistrements (tu peux utiliser NumPy pour générer des données aléatoires)
- Le CSV doit contenir : `id`, `age`, `heures_etude`, `note_examen`
- Charge le CSV avec Pandas
- Calcule la moyenne et l'écart-type de chaque colonne numérique
- Ajoute une colonne `mention` : "TB" si note >= 16, "B" si >= 14, "AB" si >= 12, "Passable" sinon
- Crée 3 graphiques en subplots :
  - Scatter plot : heures d'étude vs note d'examen
  - Histogramme des notes
  - Bar chart : nombre d'étudiants par mention

**Résultat attendu** : Un script Python qui produit un fichier `analyse_etudiants.png` contenant les 3 graphiques et affiche les statistiques descriptives dans le terminal.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Étape 1 : Générer un dataset CSV réaliste
np.random.seed(42)  # Pour des résultats reproductibles
n = 50

# Générer les données
ids = np.arange(1, n + 1)
ages = np.random.randint(18, 35, size=n)
heures_etude = np.random.uniform(1, 20, size=n)

# La note dépend des heures d'étude (relation linéaire + bruit)
note_base = heures_etude * 0.7 + np.random.normal(5, 2, size=n)
notes = np.clip(note_base, 0, 20)  # Limiter entre 0 et 20

# Créer le DataFrame et sauvegarder en CSV
df = pd.DataFrame({
    "id": ids,
    "age": ages,
    "heures_etude": heures_etude.round(1),
    "note_examen": notes.round(1)
})
df.to_csv("etudiants_ia.csv", index=False)
print("CSV créé : etudiants_ia.csv")

# Étape 2 : Charger et analyser
df = pd.read_csv("etudiants_ia.csv")
print(f"\nDimensions : {df.shape}")
print(f"\nStatistiques descriptives :")
print(df.describe().round(2))

# Étape 3 : Ajouter la colonne mention
def attribuer_mention(note):
    """Attribue une mention en fonction de la note."""
    if note >= 16:
        return "TB"
    elif note >= 14:
        return "B"
    elif note >= 12:
        return "AB"
    else:
        return "Passable"

df["mention"] = df["note_examen"].apply(attribuer_mention)
print(f"\nRépartition des mentions :")
print(df["mention"].value_counts())

# Étape 4 : Créer les 3 graphiques
fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(18, 5))

# Graphique 1 : Scatter plot heures d'étude vs note
ax1.scatter(df["heures_etude"], df["note_examen"], alpha=0.6,
            color="teal", edgecolors="black", linewidth=0.5)
ax1.set_xlabel("Heures d'étude")
ax1.set_ylabel("Note d'examen")
ax1.set_title("Heures d'étude vs Note")
ax1.grid(True, alpha=0.3)

# Graphique 2 : Histogramme des notes
ax2.hist(df["note_examen"], bins=15, color="steelblue",
         edgecolor="black", alpha=0.7)
ax2.axvline(df["note_examen"].mean(), color="red", linestyle="--",
            label=f"Moyenne : {df['note_examen'].mean():.1f}")
ax2.set_xlabel("Note")
ax2.set_ylabel("Nombre d'étudiants")
ax2.set_title("Distribution des notes")
ax2.legend()

# Graphique 3 : Bar chart des mentions
# Ordonner les mentions logiquement
ordre_mentions = ["TB", "B", "AB", "Passable"]
comptage = df["mention"].value_counts().reindex(ordre_mentions, fill_value=0)
couleurs = ["gold", "silver", "orange", "lightgray"]
ax3.bar(comptage.index, comptage.values, color=couleurs, edgecolor="black")
ax3.set_xlabel("Mention")
ax3.set_ylabel("Nombre d'étudiants")
ax3.set_title("Répartition des mentions")

# Ajouter les valeurs au-dessus des barres
for i, v in enumerate(comptage.values):
    ax3.text(i, v + 0.3, str(v), ha="center", fontweight="bold")

plt.tight_layout()
plt.savefig("analyse_etudiants.png", dpi=150)
plt.show()
print("\nGraphique sauvegardé : analyse_etudiants.png")
```

---

## Navigation

→ Fiche suivante : **[02 - Environnement de développement et infrastructure](02-environnement-developpement-infrastructure.md)**
