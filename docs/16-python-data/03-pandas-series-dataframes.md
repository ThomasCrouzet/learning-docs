---
tags:
  - Python
  - Data
  - Débutant
  - Pratique
description: "Découvrir les structures Pandas : Series et DataFrames, création, indexation avec .loc et .iloc, types de données."
estimated_time: "75 min"
fiche_number: 3
total_fiches: 8
cursus: "Python Data"
---

# 03 - Pandas - Series et DataFrames

> **En bref** : Découvrir les deux structures fondamentales de Pandas (Series et DataFrame), apprendre a créer, indexer et inspecter des données tabulaires. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [02 - NumPy - Calcul numérique](02-numpy-fondamentaux.md)
- Connaître les dictionnaires Python
- Avoir installe Pandas dans l'environnement virtuel

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des Series et DataFrames, sélectionner des données avec `.loc` et `.iloc`, charger un fichier CSV et inspecter la structure d'un jeu de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une Series Pandas ?

**Définition** : Une Series est un tableau unidimensionnel etiquete. Chaque élément possède un indice (index) qui permet de l'identifier par un nom ou un numéro, contrairement a un ndarray NumPy qui utilise uniquement des indices numériques.

**Le problème que la Series résout** :

Sans Series, voici les problèmes rencontrés :

1. **Indices sans signification** : dans un ndarray, l'élément a l'indice 3 n'a pas de sens par lui-même. Il faut se souvenir que l'indice 3 correspond a "Janvier" ou "Client X".
2. **Pas d'alignement automatique** : quand on additionne deux tableaux NumPy de tailles différentes, le résultat dépend de la position, pas de la signification des données.

**Comment la Series résout ces problèmes** :

| Problème | Solution apportée par la Series |
| --- | --- |
| Indices sans signification | Chaque élément a une etiquette explicite (nom, date, identifiant) |
| Pas d'alignement automatique | Les opérations s'alignent sur les étiquettes, même si les Series ont des ordres différents |

**Analogie concrète** : Imagine un classeur avec des onglets. Chaque onglet a un nom (l'index) et contient une feuille avec une seule valeur. Tu peux accéder a un onglet par son nom ("Janvier") sans connaître sa position dans le classeur. Un ndarray, c'est un classeur sans onglets - tu dois compter les feuilles pour trouver celle que tu cherches.

---

### Qu'est-ce qu'un DataFrame Pandas ?

**Définition** : Un DataFrame est un tableau bidimensionnel etiquete avec des lignes (index) et des colonnes nommees. C'est l'équivalent Python d'une feuille de calcul ou d'une table de base de données.

**Le problème que le DataFrame résout** :

Sans DataFrame, voici les problèmes rencontrés :

1. **Données hétérogènes** : un ndarray NumPy ne peut contenir qu'un seul type. Impossible de stocker des noms (texte) et des prix (nombres) dans le même tableau.
2. **Manipulation complexe** : filtrer, trier, grouper des données avec des listes imbriquées nécessite des dizaines de lignes de code.
3. **Pas de lecture directe des fichiers** : charger un CSV dans un ndarray nécessite d'écrire tout le code de parsing.

**Comment le DataFrame résout ces problèmes** :

| Problème | Solution apportée par le DataFrame |
| --- | --- |
| Données hétérogènes | Chaque colonne peut avoir son propre type (texte, entier, decimal, date) |
| Manipulation complexe | Des méthodes intégrées (indexation booléenne, `.query()`, `.sort_values()`, `.groupby()`) font le travail en une ligne |
| Pas de lecture directe | `pd.read_csv()` charge un fichier CSV en une seule ligne |

**Analogie concrète** : Un DataFrame, c'est une feuille de calcul (type Excel). Chaque colonne a un titre ("Nom", "Age", "Ville"), chaque ligne est un enregistrement, et tu peux filtrer, trier ou calculer des totaux avec des formules simples. La difference : Pandas peut gérer des millions de lignes là où Excel ralentit a quelques centaines de milliers.

**Ce qu'un DataFrame n'est PAS** :

- Un DataFrame n'est pas une base de données. Il vit en mémoire vive et disparaît quand le programme se termine. Pour la persistance, il faut exporter (CSV, SQL, etc.).
- Un DataFrame n'est pas un ndarray. Un ndarray est homogene (un seul type). Un DataFrame est hétérogène (un type par colonne).

**Comparaison Series vs DataFrame** :

| Series | DataFrame |
| --- | --- |
| 1 dimension (colonne unique) | 2 dimensions (lignes et colonnes) |
| Un seul type de données | Un type par colonne |
| Equivalent d'une colonne Excel | Equivalent d'une feuille Excel complete |
| Accès par index | Accès par index (lignes) et noms de colonnes |

---

### Quelle est la différence entre `.loc` et `.iloc` ?

**Définition** : `.loc` sélectionne des données par **étiquettes** (noms d'index et de colonnes). `.iloc` sélectionne des données par **positions numériques** (comme les indices d'un ndarray).

**Règle simple** :

- `.loc` = **l**abel-based (par nom)
- `.iloc` = **i**nteger-based (par position)

| Méthode | Syntaxe | Sélectionne par |
| --- | --- | --- |
| `.loc[etiquette]` | `df.loc["Paris"]` | Nom de l'index |
| `.loc[etiquette, colonne]` | `df.loc["Paris", "Population"]` | Nom de l'index ET nom de la colonne |
| `.iloc[position]` | `df.iloc[0]` | Position numérique (0 = première ligne) |
| `.iloc[position, position]` | `df.iloc[0, 1]` | Position de la ligne ET de la colonne |

**Ce que `.loc` et `.iloc` ne sont PAS** :

- `.loc` n'utilise jamais de positions numériques (sauf si l'index est numérique par coincidence).
- `.iloc` n'utilise jamais de noms de colonnes. Toujours des entiers.

---

## Étapes Pratiques

### Étape 1 : Créer et manipuler une Series

Découvre la structure Series avec des exemples concrets.

```python
import pandas as pd

# Creer une Series a partir d'une liste
temperatures = pd.Series([5.2, 8.1, 12.4, 15.7, 20.3])
print("Series avec index par defaut :")
print(temperatures)

# Creer une Series avec un index personnalise
temperatures = pd.Series(
    [5.2, 8.1, 12.4, 15.7, 20.3],
    index=["Janvier", "Fevrier", "Mars", "Avril", "Mai"]
)
print("\nSeries avec index nomme :")
print(temperatures)

# Creer une Series a partir d'un dictionnaire
population = pd.Series({
    "Paris": 2161000,
    "Lyon": 522969,
    "Marseille": 873076,
    "Toulouse": 504078
})
print("\nPopulation :")
print(population)

# Acceder a un element par son etiquette
print(f"\nPopulation de Lyon : {population['Lyon']}")

# Acceder a un element par sa position
print(f"Premiere ville : {population.iloc[0]}")

# Attributs utiles
print(f"\nNombre d'elements : {population.size}")
print(f"Index : {population.index.tolist()}")
print(f"Valeurs : {population.values}")
```

**Résultat attendu** :

```text
Series avec index par defaut :
0     5.2
1     8.1
2    12.4
3    15.7
4    20.3
dtype: float64

Series avec index nomme :
Janvier     5.2
Fevrier     8.1
Mars       12.4
Avril      15.7
Mai        20.3
dtype: float64

Population :
Paris        2161000
Lyon          522969
Marseille     873076
Toulouse      504078
dtype: int64

Population de Lyon : 522969
Premiere ville : 2161000

Nombre d'elements : 4
Index : ['Paris', 'Lyon', 'Marseille', 'Toulouse']
Valeurs : [2161000  522969  873076  504078]
```

---

### Étape 2 : Créer un DataFrame

Créé des DataFrames de plusieurs manieres.

```python
import pandas as pd

# A partir d'un dictionnaire de listes
donnees = {
    "Nom": ["Alice", "Bob", "Charlie", "Diana"],
    "Age": [25, 30, 35, 28],
    "Ville": ["Paris", "Lyon", "Marseille", "Toulouse"],
    "Salaire": [35000, 42000, 38000, 45000]
}
df = pd.DataFrame(donnees)
print("DataFrame depuis un dictionnaire :")
print(df)

# A partir d'une liste de dictionnaires
employes = [
    {"Nom": "Eve", "Age": 32, "Poste": "Dev"},
    {"Nom": "Frank", "Age": 27, "Poste": "Design"},
    {"Nom": "Grace", "Age": 41, "Poste": "Manager"},
]
df2 = pd.DataFrame(employes)
print("\nDataFrame depuis une liste de dicts :")
print(df2)

# Avec un index personnalise
df3 = pd.DataFrame(donnees, index=["E001", "E002", "E003", "E004"])
print("\nDataFrame avec index personnalise :")
print(df3)
```

**Résultat attendu** :

```text
DataFrame depuis un dictionnaire :
       Nom  Age      Ville  Salaire
0    Alice   25      Paris    35000
1      Bob   30       Lyon    42000
2  Charlie   35  Marseille    38000
3    Diana   28   Toulouse    45000

DataFrame depuis une liste de dicts :
     Nom  Age    Poste
0    Eve   32      Dev
1  Frank   27   Design
2  Grace   41  Manager

DataFrame avec index personnalise :
          Nom  Age      Ville  Salaire
E001    Alice   25      Paris    35000
E002      Bob   30       Lyon    42000
E003  Charlie   35  Marseille    38000
E004    Diana   28   Toulouse    45000
```

---

### Étape 3 : Inspecter un DataFrame

Découvre les méthodes essentielles pour explorer un jeu de données.

```python
import pandas as pd

# Creer un DataFrame plus grand
donnees = {
    "Produit": ["Pomme", "Banane", "Orange", "Kiwi", "Mangue",
                "Fraise", "Poire", "Ananas", "Cerise", "Peche"],
    "Categorie": ["Fruit", "Fruit", "Agrume", "Exotique", "Exotique",
                  "Baie", "Fruit", "Exotique", "Baie", "Fruit"],
    "Prix": [1.20, 0.80, 1.50, 2.30, 3.50,
             4.00, 1.80, 2.90, 5.50, 2.10],
    "Stock": [150, 200, 80, 45, 30,
              60, 120, 25, 40, 90]
}
df = pd.DataFrame(donnees)

# Voir les 5 premieres lignes
print("head() :")
print(df.head())

# Voir les 3 dernieres lignes
print("\ntail(3) :")
print(df.tail(3))

# Informations sur la structure
print("\ninfo() :")
df.info()

# Statistiques descriptives (colonnes numeriques)
print("\ndescribe() :")
print(df.describe())

# Dimensions
print(f"\nShape : {df.shape}")           # (10, 4)
print(f"Colonnes : {df.columns.tolist()}")
print(f"Types :\n{df.dtypes}")
```

**Résultat attendu** :

```text
head() :
  Produit Categorie  Prix  Stock
0   Pomme     Fruit  1.20    150
1  Banane     Fruit  0.80    200
2  Orange    Agrume  1.50     80
3    Kiwi  Exotique  2.30     45
4  Mangue  Exotique  3.50     30

tail(3) :
  Produit Categorie  Prix  Stock
7  Ananas  Exotique  2.90     25
8  Cerise      Baie  5.50     40
9   Peche     Fruit  2.10     90

info() :
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 10 entries, 0 to 9
Data columns (total 4 columns):
 #   Column     Non-Null Count  Dtype
---  ------     --------------  -----
 0   Produit    10 non-null     object
 1   Categorie  10 non-null     object
 2   Prix       10 non-null     float64
 3   Stock      10 non-null     int64
dtypes: float64(1), int64(1), object(2)

describe() :
           Prix       Stock
count  10.000000   10.000000
mean    2.560000   84.000000
std     1.439290   57.339147
min     0.800000   25.000000
25%     1.575000   41.250000
50%     2.200000   70.000000
75%     3.350000  112.500000
max     5.500000  200.000000

Shape : (10, 4)
Colonnes : ['Produit', 'Categorie', 'Prix', 'Stock']
Types :
Produit      object
Categorie    object
Prix        float64
Stock         int64
dtype: object
```

---

### Étape 4 : Sélection avec .loc et .iloc

Maitrise les deux méthodes de sélection de données.

```python
import pandas as pd

df = pd.DataFrame({
    "Nom": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "Age": [25, 30, 35, 28, 32],
    "Ville": ["Paris", "Lyon", "Marseille", "Toulouse", "Nantes"],
    "Salaire": [35000, 42000, 38000, 45000, 40000]
}, index=["E001", "E002", "E003", "E004", "E005"])

print("DataFrame complet :")
print(df)

# --- .iloc : selection par position ---
print("\n--- .iloc (par position) ---")

# Premiere ligne
print(f"Premiere ligne :\n{df.iloc[0]}\n")

# Lignes 1 a 3 (indices 0, 1, 2)
print(f"Lignes 0 a 2 :\n{df.iloc[0:3]}\n")

# Element precis : ligne 1, colonne 2
print(f"Ligne 1, Colonne 2 : {df.iloc[1, 2]}")  # Lyon

# --- .loc : selection par etiquette ---
print("\n--- .loc (par etiquette) ---")

# Ligne par index
print(f"Employe E003 :\n{df.loc['E003']}\n")

# Plusieurs lignes et colonnes specifiques
print(f"E001 et E004, Nom et Salaire :")
print(df.loc[["E001", "E004"], ["Nom", "Salaire"]])

# --- Selection de colonnes ---
print("\n--- Colonnes ---")

# Une colonne (retourne une Series)
print(f"Colonne Age :\n{df['Age']}\n")

# Plusieurs colonnes (retourne un DataFrame)
print(f"Colonnes Nom et Ville :")
print(df[["Nom", "Ville"]])
```

**Résultat attendu** :

```text
DataFrame complet :
          Nom  Age      Ville  Salaire
E001    Alice   25      Paris    35000
E002      Bob   30       Lyon    42000
E003  Charlie   35  Marseille    38000
E004    Diana   28   Toulouse    45000
E005      Eve   32    Nantes    40000

--- .iloc (par position) ---
Premiere ligne :
Nom       Alice
Age          25
Ville     Paris
Salaire   35000
Name: E001, dtype: object

Lignes 0 a 2 :
          Nom  Age      Ville  Salaire
E001    Alice   25      Paris    35000
E002      Bob   30       Lyon    42000
E003  Charlie   35  Marseille    38000

Ligne 1, Colonne 2 : Lyon

--- .loc (par etiquette) ---
Employe E003 :
Nom       Charlie
Age            35
Ville     Marseille
Salaire      38000
Name: E003, dtype: object

E001 et E004, Nom et Salaire :
        Nom  Salaire
E001  Alice    35000
E004  Diana    45000

--- Colonnes ---
Colonne Age :
E001    25
E002    30
E003    35
E004    28
E005    32
Name: Age, dtype: int64

Colonnes Nom et Ville :
          Nom      Ville
E001    Alice      Paris
E002      Bob       Lyon
E003  Charlie  Marseille
E004    Diana   Toulouse
E005      Eve    Nantes
```

---

### Étape 5 : Charger un fichier CSV

Charge le fichier `ventes.csv` créé dans la fiche précédente.

```python
import pandas as pd

# Charger le fichier CSV en une seule ligne
df = pd.read_csv("data/ventes.csv")

# Inspecter le resultat
print("Apercu du fichier :")
print(df.head())

print(f"\nDimensions : {df.shape}")
print(f"Colonnes : {df.columns.tolist()}")

# Verifier les types (Pandas devine automatiquement)
print(f"\nTypes :")
print(df.dtypes)

# Convertir la colonne date en type datetime
df["date"] = pd.to_datetime(df["date"])
print(f"\nApres conversion de 'date' :")
print(df.dtypes)
```

**Résultat attendu** :

```text
Apercu du fichier :
         date produit    categorie  quantite  prix_unitaire
0  2024-01-15   Pomme        Fruit        50           1.20
1  2024-01-15    Pain  Boulangerie        30           1.10
2  2024-01-16  Banane        Fruit       120           0.80
3  2024-01-16    Lait     Cremerie        45           1.30
4  2024-01-17   Pomme        Fruit        60           1.20

Dimensions : (10, 5)
Colonnes : ['date', 'produit', 'categorie', 'quantite', 'prix_unitaire']

Types :
date              object
produit           object
categorie         object
quantite           int64
prix_unitaire    float64
dtype: object

Apres conversion de 'date' :
date             datetime64[us]
produit                  object
categorie                object
quantite                  int64
prix_unitaire           float64
dtype: object
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `pd.Series(donnees, index=...)` | Créer une Series |
| `pd.DataFrame(donnees)` | Créer un DataFrame |
| `pd.read_csv("fichier.csv")` | Charger un CSV |
| `df.head(n)` | Premières n lignes (défaut 5) |
| `df.tail(n)` | Dernières n lignes (défaut 5) |
| `df.info()` | Structure et types |
| `df.describe()` | Statistiques descriptives |
| `df.shape` | Dimensions (lignes, colonnes) |
| `df.columns` | Noms des colonnes |
| `df.dtypes` | Types de chaque colonne |
| `df.loc[etiquette]` | Sélection par etiquette |
| `df.iloc[position]` | Sélection par position |
| `df["colonne"]` | Sélectionner une colonne |

---

## Pièges Fréquents

### Piège 1 : Confondre `.loc` et `.iloc`

**Problème** : utiliser `.loc` avec des positions numériques quand l'index est textuel, ou inversement.

**Solution** : retiens que `.loc` utilise les **noms** et `.iloc` utilise les **numéros de position**.

```python
import pandas as pd

df = pd.DataFrame({"A": [10, 20, 30]}, index=["x", "y", "z"])

# .loc avec une etiquette (correct)
print(df.loc["y"])     # A    20

# .iloc avec une position (correct)
print(df.iloc[1])      # A    20

# .loc avec un entier sur un index textuel (erreur)
# print(df.loc[1])     # KeyError: 1
```

### Piège 2 : Modifier un DataFrame via une copie implicite

**Problème** : le message `SettingWithCopyWarning` apparaît quand on modifie un sous-ensemble du DataFrame (comportement historique de Pandas 1.x / 2.x sans Copy-on-Write).

**Solution** : utilise `.loc` pour les modifications, ou `.copy()` pour travailler sur une copie explicite.

```python
import pandas as pd

df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})

# Incorrect (peut declencher un warning sous Pandas 1.x / 2.x)
# sous_ensemble = df[df["A"] > 1]
# sous_ensemble["B"] = 99

# Correct : modifier via .loc
df.loc[df["A"] > 1, "B"] = 99

# Ou : travailler sur une copie
copie = df[df["A"] > 1].copy()
copie["B"] = 99
```

> **Note (Pandas 2.2+ / 3.x)** : le mode Copy-on-Write (CoW) est activable en 2.2 et **toujours actif** à partir de Pandas 3.0. Avec CoW, la modification d'une vue n'altère plus silencieusement le DataFrame d'origine et le `SettingWithCopyWarning` disparaît dans la plupart des cas. La bonne pratique reste d'écrire `df.loc[...] = ...` ou d'appeler `.copy()` explicitement quand tu travailles sur un sous-ensemble.

### Piège 3 : Oublier que `df["colonne"]` retourne une Series

**Problème** : `df["Nom"]` retourne une Series, pas un DataFrame. Certaines opérations ne fonctionnent que sur un DataFrame.

**Solution** : utilise des doubles crochets `df[["Nom"]]` pour obtenir un DataFrame à une colonne.

```python
import pandas as pd

df = pd.DataFrame({"Nom": ["Alice", "Bob"], "Age": [25, 30]})

# Series (1D)
print(type(df["Nom"]))       # <class 'pandas.core.series.Series'>

# DataFrame (2D, une seule colonne)
print(type(df[["Nom"]]))     # <class 'pandas.core.frame.DataFrame'>
```

---

## Checklist de Validation

- [ ] Je sais créer une Series avec et sans index personnalisé
- [ ] Je sais créer un DataFrame depuis un dictionnaire et une liste de dictionnaires
- [ ] Je sais utiliser `head()`, `tail()`, `info()`, `describe()` et `shape`
- [ ] Je comprends la différence entre `.loc` (étiquettes) et `.iloc` (positions)
- [ ] Je sais charger un fichier CSV avec `pd.read_csv()`
- [ ] Je sais sélectionner une ou plusieurs colonnes

---

## Exercice Pratique

**Énoncé** : Créé un DataFrame représentant 8 livres d'une bibliothèque (titre, auteur, année de publication, nombre de pages, genre). Puis affiche les informations suivantes : les 3 premiers livres, les livres publiés après 2010, uniquement les colonnes "titre" et "année", et les statistiques descriptives des colonnes numériques.

**Indications** :

- Créé le DataFrame à partir d'un dictionnaire de listes
- Utilise un index personnalisé (ex: "L001" à "L008")
- Utilise `.loc` avec un masque booléen pour filtrer par année
- Utilise `df[["col1", "col2"]]` pour sélectionner plusieurs colonnes

**Résultat attendu** (structure) :

```text
3 premiers livres :
      Titre              Auteur  Annee  Pages    Genre
L001  Le Petit Prince    Saint-Exupery  1943   96  Conte
L002  1984               Orwell         1949  328  SF
L003  Dune               Herbert        1965  412  SF

Livres publies apres 2010 :
      Titre              Auteur    Annee  Pages    Genre
L006  ...                ...       ...    ...   ...
...

Titres et annees :
...

Statistiques :
...
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import pandas as pd

# Creer le DataFrame avec 8 livres
livres = pd.DataFrame({
    "Titre": [
        "Le Petit Prince", "1984", "Dune",
        "Harry Potter 1", "Le Seigneur des Anneaux",
        "Sapiens", "Devenir", "Projet Hail Mary"
    ],
    "Auteur": [
        "Saint-Exupery", "Orwell", "Herbert",
        "Rowling", "Tolkien",
        "Harari", "Obama", "Weir"
    ],
    "Annee": [1943, 1949, 1965, 1997, 1954, 2011, 2018, 2021],
    "Pages": [96, 328, 412, 309, 1216, 512, 448, 496],
    "Genre": [
        "Conte", "SF", "SF",
        "Fantasy", "Fantasy",
        "Essai", "Autobiographie", "SF"
    ]
}, index=["L001", "L002", "L003", "L004", "L005", "L006", "L007", "L008"])

# Les 3 premiers livres
print("3 premiers livres :")
print(livres.head(3))

# Livres publies apres 2010 (masque booleen avec .loc)
print("\nLivres publies apres 2010 :")
recents = livres.loc[livres["Annee"] > 2010]
print(recents)

# Colonnes specifiques
print("\nTitres et annees :")
print(livres[["Titre", "Annee"]])

# Statistiques descriptives
print("\nStatistiques :")
print(livres.describe())
```

---

## Navigation

← Fiche précédente : **[NumPy - Calcul numérique](02-numpy-fondamentaux.md)**

→ Fiche suivante : **[Pandas - Manipulation des données](04-pandas-manipulation.md)**
