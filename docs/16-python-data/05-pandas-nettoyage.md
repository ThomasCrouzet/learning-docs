---
tags:
  - Python
  - Data
  - Intermédiaire
  - Pratique
description: "Nettoyer des données avec Pandas : doublons, valeurs aberrantes, normalisation des textes et encodage catégoriel."
estimated_time: "60 min"
fiche_number: 5
total_fiches: 8
cursus: "Python Data"
---

# 05 - Pandas - Nettoyage de données

> **En bref** : Apprendre à détecter et corriger les problèmes courants dans les données : doublons, valeurs aberrantes, texte inconsistant et encodage catégoriel. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [04 - Pandas - Manipulation des données](04-pandas-manipulation.md)
- Savoir filtrer, trier et regrouper un DataFrame
- Savoir gérer les valeurs manquantes (NaN)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras détecter et supprimer les doublons, identifier les valeurs aberrantes, normaliser les textes (majuscules, espaces, formats) et encoder les variables catégorielles pour les rendre exploitables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le nettoyage de données ?

**Définition** : Le nettoyage de données est l'étape qui consiste a détecter et corriger les erreurs, les incoherences et les anomalies dans un jeu de données brut avant de l'analyser.

**Le problème que le nettoyage résout** :

Sans nettoyage, voici les problèmes rencontrés :

1. **Résultats faux** : une moyenne calculee sur des données avec des doublons ou des valeurs aberrantes ne reflete pas la réalité.
2. **Incoherences textuelles** : "Paris", "paris", "PARIS" et " Paris " sont traites comme quatre villes différentes par `groupby`.
3. **Types incorrects** : une colonne de dates stockée en texte empêche les calculs de durée.

**Comment le nettoyage résout ces problèmes** :

| Problème | Solution apportée par le nettoyage |
| --- | --- |
| Résultats faux | Les doublons sont supprimes, les aberrations sont corrigees ou exclues |
| Incoherences textuelles | La normalisation uniformise la casse, les espaces et les formats |
| Types incorrects | La conversion de types garantit des calculs corrects |

**Analogie concrète** : Imagine que tu reçois un carton de legumes pour préparer un repas. Avant de cuisiner, tu tries les legumes : tu jettes ceux qui sont pourris (valeurs aberrantes), tu enleves les doublons (deux carottes identiques comptees deux fois sur la facture), tu laves la terre (normaliser les données) et tu verifies que tu n'as pas reçu des fruits a la place de legumes (types incorrects).

**Ce que le nettoyage n'est PAS** :

- Le nettoyage n'est pas la suppression de toutes les données "bizarres". Certaines valeurs extrêmes sont réelles et significatives. Il faut comprendre les données avant de decider quoi supprimer.
- Le nettoyage n'est pas une étape optionnelle. Analyser des données non nettoyees produit des conclusions fausses. La règle : "Garbage in, garbage out" (déchets en entrée, déchets en sortie).

---

### Qu'est-ce qu'un doublon ?

**Définition** : Un doublon est une ligne qui apparaît plus d'une fois dans un jeu de données, soit de maniere identique (doublon exact), soit avec de legeres differences (doublon partiel).

**Types de doublons** :

| Type | Exemple | Détection |
| --- | --- | --- |
| Exact | Deux lignes 100 % identiques | `df.duplicated()` |
| Partiel | Meme nom et même date, mais adresse différente | `df.duplicated(subset=["nom", "date"])` |

---

### Qu'est-ce qu'une valeur aberrante ?

**Définition** : Une valeur aberrante (outlier) est une donnée qui s'ecarte significativement du reste de la distribution. Elle peut être le résultat d'une erreur de saisie ou d'un événement exceptionnel réel.

**Le problème que la détection des valeurs aberrantes résout** :

Sans détection, voici les problèmes rencontrés :

1. **Moyenne faussee** : un salaire de 1 000 000 EUR dans un jeu de données ou la moyenne est de 35 000 EUR tire la moyenne vers le haut.
2. **Graphiques illisibles** : un point extrême ecrase l'échelle du graphique, rendant les autres points invisibles.

**Méthode IQR (écart interquartile)** :

La méthode IQR est une approche statistique pour identifier les valeurs aberrantes :

1. Calculer Q1 (25e percentile) et Q3 (75e percentile)
2. Calculer IQR = Q3 - Q1
3. Une valeur est aberrante si elle est inférieure à `Q1 - 1.5 * IQR` ou supérieure à `Q3 + 1.5 * IQR`

**Analogie concrète** : Imagine une classe de 20 élevés dont les notes vont de 8 a 18. Si un élevé a une note de 2 ou de 25 (impossible mais inscrit par erreur), ce sont des valeurs aberrantes. La méthode IQR définit une zone "normale" et signale tout ce qui sort de cette zone.

---

### Qu'est-ce que l'encodage catégoriel ?

**Définition** : L'encodage catégoriel transforme des données textuelles en valeurs numériques pour les rendre utilisables dans des calculs ou des algorithmes.

**Le problème que l'encodage résout** :

Sans encodage, voici les problèmes rencontrés :

1. **Calculs impossibles** : impossible de calculer la moyenne de la colonne "Couleur" qui contient "Rouge", "Bleu", "Vert".
2. **Incompatibilite avec les algorithmes** : la plupart des algorithmes statistiques et de machine learning exigent des entrées numériques.

**Deux méthodes principales** :

| Méthode | Description | Quand l'utiliser |
| --- | --- | --- |
| Label Encoding | Chaque catégorie reçoit un numéro (Rouge=0, Bleu=1, Vert=2) | Quand il y a un ordre naturel (Petit < Moyen < Grand) |
| One-Hot Encoding | Chaque catégorie devient une colonne binaire (0 ou 1) | Quand il n'y a pas d'ordre (Rouge, Bleu, Vert) |

---

## Étapes Pratiques

### Étape 1 : Détecter et supprimer les doublons

Identifie les lignes en double et supprime-les.

```python
import pandas as pd

# DataFrame avec des doublons
df = pd.DataFrame({
    "Nom": ["Alice", "Bob", "Alice", "Charlie", "Bob", "Diana"],
    "Ville": ["Paris", "Lyon", "Paris", "Marseille", "Lyon", "Toulouse"],
    "Age": [25, 30, 25, 35, 30, 28],
    "Salaire": [35000, 42000, 35000, 38000, 42000, 45000]
})

print("DataFrame original :")
print(df)

# Detecter les doublons (True = doublon)
print(f"\nDoublons :\n{df.duplicated()}")
print(f"Nombre de doublons : {df.duplicated().sum()}")

# Voir les lignes en double
print(f"\nLignes dupliquees :")
print(df[df.duplicated(keep=False)])  # keep=False montre toutes les occurrences

# Supprimer les doublons (garde la premiere occurrence)
df_propre = df.drop_duplicates()
print(f"\nApres suppression ({df_propre.shape[0]} lignes) :")
print(df_propre)

# Doublons partiels (meme nom seulement)
df2 = pd.DataFrame({
    "Nom": ["Alice", "Bob", "Alice", "Charlie"],
    "Email": ["alice@mail.com", "bob@mail.com", "alice@pro.com", "charlie@mail.com"],
    "Age": [25, 30, 26, 35]
})
doublons_nom = df2[df2.duplicated(subset=["Nom"], keep=False)]
print(f"\nDoublons partiels (meme nom) :")
print(doublons_nom)
```

**Résultat attendu** :

```text
DataFrame original :
       Nom      Ville  Age  Salaire
0    Alice      Paris   25    35000
1      Bob       Lyon   30    42000
2    Alice      Paris   25    35000
3  Charlie  Marseille   35    38000
4      Bob       Lyon   30    42000
5    Diana   Toulouse   28    45000

Doublons :
0    False
1    False
2     True
3    False
4     True
5    False
dtype: bool
Nombre de doublons : 2

Lignes dupliquees :
     Nom  Ville  Age  Salaire
0  Alice  Paris   25    35000
1    Bob   Lyon   30    42000
2  Alice  Paris   25    35000
4    Bob   Lyon   30    42000

Apres suppression (4 lignes) :
       Nom      Ville  Age  Salaire
0    Alice      Paris   25    35000
1      Bob       Lyon   30    42000
3  Charlie  Marseille   35    38000
5    Diana   Toulouse   28    45000

Doublons partiels (meme nom) :
     Nom          Email  Age
0  Alice  alice@mail.com   25
2  Alice   alice@pro.com   26
```

---

### Étape 2 : Normaliser les textes

Uniformise la casse, les espaces et les formats.

```python
import pandas as pd

# DataFrame avec des textes inconsistants
df = pd.DataFrame({
    "Ville": ["Paris", "paris", "PARIS", " Lyon ", "lyon", "  Marseille"],
    "Categorie": ["Fruit ", "FRUIT", "fruit", " Legume", "LEGUME", "legume "],
    "Code_Postal": ["75001", "69001", "75002", "69002", "13001", "13002"]
})

print("Avant normalisation :")
print(df)

# Normaliser la casse (tout en minuscules puis capitaliser)
df["Ville"] = df["Ville"].str.strip()        # Supprimer les espaces autour
df["Ville"] = df["Ville"].str.capitalize()   # Premiere lettre en majuscule

df["Categorie"] = df["Categorie"].str.strip()
df["Categorie"] = df["Categorie"].str.lower()

print("\nApres normalisation :")
print(df)

# Verifier les valeurs uniques
print(f"\nVilles uniques : {df['Ville'].unique()}")
print(f"Categories uniques : {df['Categorie'].unique()}")

# Remplacer des valeurs specifiques
df["Categorie"] = df["Categorie"].replace({
    "fruit": "Fruits",
    "legume": "Legumes"
})
print(f"\nApres remplacement :")
print(df)
```

**Résultat attendu** :

```text
Avant normalisation :
          Ville Categorie Code_Postal
0         Paris    Fruit       75001
1         paris     FRUIT       69001
2         PARIS     fruit       75002
3          Lyon    Legume       69002
4          lyon    LEGUME       13001
5    Marseille   legume        13002

Apres normalisation :
        Ville Categorie Code_Postal
0       Paris     fruit       75001
1       Paris     fruit       69001
2       Paris     fruit       75002
3        Lyon    legume       69002
4        Lyon    legume       13001
5  Marseille    legume       13002

Villes uniques : ['Paris' 'Lyon' 'Marseille']
Categories uniques : ['fruit' 'legume']

Apres remplacement :
        Ville Categorie Code_Postal
0       Paris    Fruits       75001
1       Paris    Fruits       69001
2       Paris    Fruits       75002
3        Lyon   Legumes       69002
4        Lyon   Legumes       13001
5  Marseille   Legumes       13002
```

---

### Étape 3 : Détecter les valeurs aberrantes avec IQR

Identifie les valeurs qui sortent de la plage normale.

```python
import pandas as pd
import numpy as np

# Salaires avec des valeurs aberrantes
salaires = pd.DataFrame({
    "Employe": [f"E{i:03d}" for i in range(1, 16)],
    "Salaire": [32000, 35000, 28000, 42000, 38000,
                31000, 36000, 150000, 34000, 39000,
                33000, 37000, 29000, 41000, 2000]
})

print("Salaires :")
print(salaires)

# Calculer les quartiles et l'IQR
q1 = salaires["Salaire"].quantile(0.25)
q3 = salaires["Salaire"].quantile(0.75)
iqr = q3 - q1

# Definir les bornes
borne_basse = q1 - 1.5 * iqr
borne_haute = q3 + 1.5 * iqr

print(f"\nQ1 = {q1}, Q3 = {q3}, IQR = {iqr}")
print(f"Borne basse = {borne_basse}")
print(f"Borne haute = {borne_haute}")

# Identifier les valeurs aberrantes
aberrantes = salaires[
    (salaires["Salaire"] < borne_basse) |
    (salaires["Salaire"] > borne_haute)
]
print(f"\nValeurs aberrantes ({len(aberrantes)}) :")
print(aberrantes)

# Supprimer les valeurs aberrantes
propre = salaires[
    (salaires["Salaire"] >= borne_basse) &
    (salaires["Salaire"] <= borne_haute)
]
print(f"\nApres suppression ({len(propre)} lignes) :")
print(f"Moyenne avant : {salaires['Salaire'].mean():.0f}")
print(f"Moyenne apres : {propre['Salaire'].mean():.0f}")
```

**Résultat attendu** :

```text
Salaires :
   Employe  Salaire
0     E001    32000
1     E002    35000
2     E003    28000
3     E004    42000
4     E005    38000
5     E006    31000
6     E007    36000
7     E008   150000
8     E009    34000
9     E010    39000
10    E011    33000
11    E012    37000
12    E013    29000
13    E014    41000
14    E015     2000

Q1 = 31500.0, Q3 = 38500.0, IQR = 7000.0
Borne basse = 21000.0
Borne haute = 49000.0

Valeurs aberrantes (2) :
   Employe  Salaire
7     E008   150000
14    E015     2000

Apres suppression (13 lignes) :
Moyenne avant : 40467
Moyenne apres : 35000
```

---

### Étape 4 : Convertir les types de données

Assure-toi que chaque colonne a le bon type.

```python
import pandas as pd

# DataFrame avec des types incorrects
df = pd.DataFrame({
    "Date": ["2024-01-15", "2024-02-20", "2024-03-10"],
    "Montant": ["1234.56", "789.00", "2345.67"],
    "Quantite": ["10", "5", "20"],
    "Actif": ["true", "false", "true"]
})

print("Types avant conversion :")
print(df.dtypes)

# Convertir les types
df["Date"] = pd.to_datetime(df["Date"])
df["Montant"] = df["Montant"].astype(float)
df["Quantite"] = df["Quantite"].astype(int)
df["Actif"] = df["Actif"].map({"true": True, "false": False})

print("\nTypes apres conversion :")
print(df.dtypes)

print("\nDataFrame converti :")
print(df)

# Maintenant les calculs fonctionnent
print(f"\nMontant total : {df['Montant'].sum():.2f}")
print(f"Duree entre premiere et derniere date : {df['Date'].max() - df['Date'].min()}")
```

**Résultat attendu** :

```text
Types avant conversion :
Date        object
Montant     object
Quantite    object
Actif       object
dtype: object

Types apres conversion :
Date        datetime64[us]
Montant            float64
Quantite             int64
Actif                 bool
dtype: object

DataFrame converti :
        Date  Montant  Quantite  Actif
0 2024-01-15  1234.56        10   True
1 2024-02-20   789.00         5  False
2 2024-03-10  2345.67        20   True

Montant total : 4369.23
Duree entre premiere et derniere date : 55 days 00:00:00
```

---

### Étape 5 : Encoder les variables catégorielles

Transforme les catégories textuelles en valeurs numériques.

```python
import pandas as pd

df = pd.DataFrame({
    "Produit": ["Laptop", "Souris", "Clavier", "Ecran", "Souris"],
    "Couleur": ["Noir", "Blanc", "Noir", "Gris", "Noir"],
    "Taille": ["Grand", "Petit", "Moyen", "Grand", "Petit"]
})

print("DataFrame original :")
print(df)

# Label Encoding (quand il y a un ordre)
taille_ordre = {"Petit": 1, "Moyen": 2, "Grand": 3}
df["Taille_Code"] = df["Taille"].map(taille_ordre)
print("\nApres Label Encoding (Taille) :")
print(df)

# One-Hot Encoding (quand il n'y a pas d'ordre)
# pd.get_dummies cree une colonne binaire par categorie
couleur_encoded = pd.get_dummies(df["Couleur"], prefix="Couleur")
print("\nOne-Hot Encoding (Couleur) :")
print(couleur_encoded)

# Combiner avec le DataFrame original
df_encoded = pd.concat([df, couleur_encoded], axis=1)
df_encoded = df_encoded.drop(columns=["Couleur"])
print("\nDataFrame final avec encodage :")
print(df_encoded)
```

**Résultat attendu** :

```text
DataFrame original :
   Produit Couleur Taille
0   Laptop    Noir  Grand
1   Souris   Blanc  Petit
2  Clavier    Noir  Moyen
3    Ecran    Gris  Grand
4   Souris    Noir  Petit

Apres Label Encoding (Taille) :
   Produit Couleur Taille  Taille_Code
0   Laptop    Noir  Grand            3
1   Souris   Blanc  Petit            1
2  Clavier    Noir  Moyen            2
3    Ecran    Gris  Grand            3
4   Souris    Noir  Petit            1

One-Hot Encoding (Couleur) :
   Couleur_Blanc  Couleur_Gris  Couleur_Noir
0          False         False          True
1           True         False         False
2          False         False          True
3          False          True         False
4          False         False          True

DataFrame final avec encodage :
   Produit Taille  Taille_Code  Couleur_Blanc  Couleur_Gris  Couleur_Noir
0   Laptop  Grand            3          False         False          True
1   Souris  Petit            1           True         False         False
2  Clavier  Moyen            2          False         False          True
3    Ecran  Grand            3          False          True         False
4   Souris  Petit            1          False         False          True
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `df.duplicated()` | Détecter les doublons |
| `df.drop_duplicates()` | Supprimer les doublons |
| `df["col"].str.strip()` | Supprimer les espaces autour du texte |
| `df["col"].str.lower()` | Convertir en minuscules |
| `df["col"].str.capitalize()` | Première lettre en majuscule |
| `df["col"].replace(dict)` | Remplacer des valeurs |
| `df["col"].quantile(0.25)` | Calculer un percentile |
| `pd.to_datetime(col)` | Convertir en date |
| `df["col"].astype(type)` | Convertir le type d'une colonne |
| `pd.get_dummies(col)` | One-Hot Encoding |
| `df["col"].map(dict)` | Label Encoding (via dictionnaire) |

---

## Pièges Fréquents

### Piège 1 : Supprimer des doublons sans vérifier

**Problème** : `drop_duplicates()` supprime des lignes sans te prevenir. Si les "doublons" sont en fait des données légitimes (deux commandes identiques le même jour), tu perds des données valides.

**Solution** : avant de supprimer, affiche les doublons avec `df[df.duplicated(keep=False)]` pour vérifier qu'ils sont bien des erreurs.

```python
# Toujours verifier avant de supprimer
doublons = df[df.duplicated(keep=False)]
print(f"Doublons trouves : {len(doublons)}")
print(doublons)
# Verifier manuellement, puis supprimer si confirme
```

### Piège 2 : Confondre suppression et remplacement des aberrantes

**Problème** : supprimer systematiquement les valeurs aberrantes réduit la taille du jeu de données et peut introduire un biais.

**Solution** : si la valeur aberrante est une erreur de saisie, remplace-la par la médiane ou NaN. Si c'est une valeur réelle extrême, garde-la et documente-la.

```python
import numpy as np

# Remplacer par NaN plutot que supprimer
df.loc[df["Salaire"] > borne_haute, "Salaire"] = np.nan
# Puis remplir avec la mediane
df["Salaire"] = df["Salaire"].fillna(df["Salaire"].median())
```

### Piège 3 : Appliquer `str.strip()` sur des colonnes non-textuelles

**Problème** : `df["Age"].str.strip()` provoque une erreur si la colonne contient des nombres.

**Solution** : vérifie le type de la colonne avec `df.dtypes` avant d'appliquer des méthodes `.str`.

---

## Checklist de Validation

- [ ] Je sais détecter les doublons exacts et partiels
- [ ] Je sais normaliser les textes (casse, espaces, remplacement)
- [ ] Je sais détecter les valeurs aberrantes avec la méthode IQR
- [ ] Je sais convertir les types de colonnes (texte vers date, nombre, booléen)
- [ ] Je sais encoder des variables catégorielles (Label et One-Hot)
- [ ] Je comprends quand supprimer vs remplacer une valeur aberrante

---

## Exercice Pratique

**Énoncé** : Tu reçois un fichier de données clients avec les problèmes suivants : doublons exacts, noms avec des espaces et casses différentes, âges aberrants (négatifs ou supérieurs a 150), et une colonne "Statut" textuelle ("actif"/"inactif") a encoder. Nettoie ce DataFrame et affiche les statistiques avant et après nettoyage.

**Indications** :

- Utilise le DataFrame fourni ci-dessous
- Étapes : doublons -> normalisation texte -> valeurs aberrantes (IQR ou bornes logiques) -> encodage
- Compare les moyennes d'age et le nombre de lignes avant/après

**Données** :

```python
df = pd.DataFrame({
    "Nom": ["Alice", "  bob", "CHARLIE", "alice", "Diana",
            "  bob", " Eve ", "Frank", "Alice", "Grace"],
    "Age": [25, 30, -5, 25, 180, 30, 28, 35, 25, 42],
    "Ville": ["Paris", "lyon", "MARSEILLE", "paris", "Toulouse",
              "lyon", "Nantes", "Bordeaux", "Paris", "Nice"],
    "Statut": ["actif", "inactif", "actif", "actif", "inactif",
               "inactif", "actif", "actif", "actif", "inactif"]
})
```

**Résultat attendu** (structure) :

```text
Avant nettoyage : 10 lignes, Age moyen = XX.X
Apres nettoyage : X lignes, Age moyen = XX.X
DataFrame propre :
...
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import pandas as pd
import numpy as np

# Donnees brutes
df = pd.DataFrame({
    "Nom": ["Alice", "  bob", "CHARLIE", "alice", "Diana",
            "  bob", " Eve ", "Frank", "Alice", "Grace"],
    "Age": [25, 30, -5, 25, 180, 30, 28, 35, 25, 42],
    "Ville": ["Paris", "lyon", "MARSEILLE", "paris", "Toulouse",
              "lyon", "Nantes", "Bordeaux", "Paris", "Nice"],
    "Statut": ["actif", "inactif", "actif", "actif", "inactif",
               "inactif", "actif", "actif", "actif", "inactif"]
})

print(f"Avant nettoyage : {len(df)} lignes, Age moyen = {df['Age'].mean():.1f}")

# Etape 1 : normaliser les textes avant de chercher les doublons
df["Nom"] = df["Nom"].str.strip().str.capitalize()
df["Ville"] = df["Ville"].str.strip().str.capitalize()
df["Statut"] = df["Statut"].str.strip().str.lower()

# Etape 2 : supprimer les doublons exacts
df = df.drop_duplicates()
print(f"Apres doublons : {len(df)} lignes")

# Etape 3 : supprimer les ages aberrants (bornes logiques : 0-120 ans)
df = df[(df["Age"] > 0) & (df["Age"] <= 120)]
print(f"Apres aberrants : {len(df)} lignes")

# Etape 4 : encoder le statut
df["Statut_Code"] = df["Statut"].map({"actif": 1, "inactif": 0})

print(f"\nApres nettoyage : {len(df)} lignes, Age moyen = {df['Age'].mean():.1f}")
print("\nDataFrame propre :")
print(df)
```

---

## Navigation

← Fiche précédente : **[Pandas - Manipulation des données](04-pandas-manipulation.md)**

→ Fiche suivante : **[Visualisation avec Matplotlib et Seaborn](06-matplotlib-seaborn.md)**
