---
tags:
  - Python
  - Data
  - Intermédiaire
  - Pratique
description: "Filtrer, trier, grouper et fusionner des données avec Pandas : groupby, merge, join, pivot et gestion des NaN."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 8
cursus: "Python Data"
---

# 04 - Pandas - Manipulation des données

> **En bref** : Maîtriser le filtrage, le tri, les regroupements (groupby), les fusions (merge/join), les pivots et la gestion des valeurs manquantes. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [03 - Pandas - Series et DataFrames](03-pandas-series-dataframes.md)
- Savoir créer un DataFrame et sélectionner des données avec `.loc` et `.iloc`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras filtrer des données avec des conditions, trier un DataFrame, regrouper des données pour calculer des statistiques, fusionner plusieurs DataFrames et gérer les valeurs manquantes (NaN).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le filtrage de données ?

**Définition** : Le filtrage consiste a sélectionner un sous-ensemble de lignes d'un DataFrame en fonction d'une ou plusieurs conditions. Le résultat est un nouveau DataFrame contenant uniquement les lignes qui satisfont les conditions.

**Le problème que le filtrage résout** :

Sans filtrage, voici les problèmes rencontrés :

1. **Surcharge d'information** : un DataFrame de 100 000 lignes est inutilisable tel quel. On a besoin de se concentrer sur un sous-ensemble pertinent.
2. **Boucles manuelles** : sans filtrage integre, il faut écrire une boucle `for` pour parcourir chaque ligne et vérifier la condition.

**Comment le filtrage résout ces problèmes** :

| Problème | Solution apportée par le filtrage |
| --- | --- |
| Surcharge d'information | Une condition en une ligne extrait exactement les données voulues |
| Boucles manuelles | Le masque booléen remplace la boucle et s'execute beaucoup plus vite |

**Analogie concrète** : Le filtrage, c'est comme un tamis de cuisine. Tu verses toute la farine (les données) dans le tamis, et seuls les grains fins (les données qui satisfont la condition) passent a travers. Les grumeaux (les données non pertinentes) sont retenus.

---

### Qu'est-ce que `groupby` ?

**Définition** : `groupby` separe un DataFrame en groupes selon les valeurs d'une ou plusieurs colonnes, puis applique une fonction d'agrégation (somme, moyenne, comptage) a chaque groupe.

**Le problème que `groupby` résout** :

Sans `groupby`, voici les problèmes rencontrés :

1. **Calculs répétitifs** : pour calculer la moyenne des ventes par catégorie, il faut écrire une boucle qui filtre chaque catégorie, puis calcule la moyenne.
2. **Code fragile** : ajouter une nouvelle catégorie oblige à modifier le code.

**Comment `groupby` résout ces problèmes** :

| Problème | Solution apportée par groupby |
| --- | --- |
| Calculs répétitifs | Une seule ligne calcule l'agrégation pour tous les groupes |
| Code fragile | Les groupes sont detectes automatiquement a partir des données |

**Analogie concrète** : Imagine que tu tries un sac de pièces de monnaie. Tu les separes en piles (1 centime, 2 centimes, 5 centimes...), puis tu comptes le nombre de pièces dans chaque pile. `groupby` fait la même chose : il separe les données en groupes, puis applique un calcul a chaque groupe.

**Ce que `groupby` n'est PAS** :

- `groupby` seul ne retourne pas un DataFrame lisible. Il retourne un objet intermédiaire. Il faut appliquer une fonction d'agrégation (`.sum()`, `.mean()`, `.count()`) pour obtenir un résultat.

---

### Qu'est-ce qu'un merge (fusion) ?

**Définition** : Un merge combine deux DataFrames en un seul, en se basant sur une ou plusieurs colonnes communes (clés de jointure). C'est l'équivalent de la jointure SQL.

**Le problème que le merge résout** :

Sans merge, voici les problèmes rencontrés :

1. **Données dispersees** : les informations sur les clients sont dans un fichier, les commandes dans un autre. Impossible de les croiser sans les fusionner.
2. **Jointure manuelle** : il faut écrire des boucles imbriquées pour associer les données de deux sources.

**Comment le merge résout ces problèmes** :

| Problème | Solution apportée par merge |
| --- | --- |
| Données dispersees | Un merge combine les deux sources en un seul DataFrame |
| Jointure manuelle | `pd.merge()` fait la jointure automatiquement sur la colonne commune |

**Les 4 types de merge** :

| Type | Résultat | Equivalent SQL |
| --- | --- | --- |
| `inner` | Garde uniquement les lignes présentes dans les deux DataFrames | INNER JOIN |
| `left` | Garde toutes les lignes du DataFrame de gauche | LEFT JOIN |
| `right` | Garde toutes les lignes du DataFrame de droite | RIGHT JOIN |
| `outer` | Garde toutes les lignes des deux DataFrames | FULL OUTER JOIN |

---

## Étapes Pratiques

### Étape 1 : Filtrer des données

Sélectionne des sous-ensembles avec des conditions.

```python
import pandas as pd

# Creer un DataFrame de ventes
ventes = pd.DataFrame({
    "Produit": ["Pomme", "Banane", "Orange", "Kiwi", "Mangue",
                "Pomme", "Banane", "Orange", "Kiwi", "Mangue"],
    "Region": ["Nord", "Nord", "Sud", "Sud", "Nord",
               "Sud", "Sud", "Nord", "Nord", "Sud"],
    "Quantite": [50, 120, 80, 45, 30, 60, 90, 70, 55, 40],
    "Prix": [1.20, 0.80, 1.50, 2.30, 3.50, 1.20, 0.80, 1.50, 2.30, 3.50]
})

# Filtre simple : quantite superieure a 60
gros_volumes = ventes[ventes["Quantite"] > 60]
print("Quantite > 60 :")
print(gros_volumes)

# Filtre avec condition sur du texte
region_nord = ventes[ventes["Region"] == "Nord"]
print("\nRegion Nord :")
print(region_nord)

# Combiner des conditions (ET)
filtre_et = ventes[(ventes["Region"] == "Nord") & (ventes["Quantite"] > 50)]
print("\nNord ET Quantite > 50 :")
print(filtre_et)

# Combiner des conditions (OU)
filtre_ou = ventes[(ventes["Produit"] == "Pomme") | (ventes["Produit"] == "Orange")]
print("\nPomme OU Orange :")
print(filtre_ou)

# Methode .isin() pour verifier la presence dans une liste
fruits = ["Pomme", "Orange", "Kiwi"]
filtre_isin = ventes[ventes["Produit"].isin(fruits)]
print(f"\nProduits dans {fruits} :")
print(filtre_isin)
```

**Résultat attendu** :

```text
Quantite > 60 :
  Produit Region  Quantite  Prix
1  Banane   Nord       120  0.80
2  Orange    Sud        80  1.50
6  Banane    Sud        90  0.80
7  Orange   Nord        70  1.50

Region Nord :
  Produit Region  Quantite  Prix
0   Pomme   Nord        50  1.20
1  Banane   Nord       120  0.80
4  Mangue   Nord        30  3.50
7  Orange   Nord        70  1.50
8    Kiwi   Nord        55  2.30

Nord ET Quantite > 50 :
  Produit Region  Quantite  Prix
1  Banane   Nord       120  0.80
7  Orange   Nord        70  1.50
8    Kiwi   Nord        55  2.30

Pomme OU Orange :
  Produit Region  Quantite  Prix
0   Pomme   Nord        50  1.20
2  Orange    Sud        80  1.50
5   Pomme    Sud        60  1.20
7  Orange   Nord        70  1.50

Produits dans ['Pomme', 'Orange', 'Kiwi'] :
  Produit Region  Quantite  Prix
0   Pomme   Nord        50  1.20
2  Orange    Sud        80  1.50
3    Kiwi    Sud        45  2.30
5   Pomme    Sud        60  1.20
7  Orange   Nord        70  1.50
8    Kiwi   Nord        55  2.30
```

---

### Étape 2 : Trier un DataFrame

Trie les données par une ou plusieurs colonnes.

```python
import pandas as pd

ventes = pd.DataFrame({
    "Produit": ["Pomme", "Banane", "Orange", "Kiwi", "Mangue"],
    "Quantite": [50, 120, 80, 45, 30],
    "Prix": [1.20, 0.80, 1.50, 2.30, 3.50]
})

# Trier par quantite (croissant)
tri_asc = ventes.sort_values("Quantite")
print("Tri par quantite (croissant) :")
print(tri_asc)

# Trier par prix (decroissant)
tri_desc = ventes.sort_values("Prix", ascending=False)
print("\nTri par prix (decroissant) :")
print(tri_desc)

# Trier par plusieurs colonnes
ventes2 = pd.DataFrame({
    "Region": ["Nord", "Sud", "Nord", "Sud", "Nord"],
    "Produit": ["Pomme", "Banane", "Banane", "Pomme", "Orange"],
    "CA": [60, 96, 96, 72, 120]
})
tri_multi = ventes2.sort_values(["Region", "CA"], ascending=[True, False])
print("\nTri par Region (asc) puis CA (desc) :")
print(tri_multi)
```

**Résultat attendu** :

```text
Tri par quantite (croissant) :
  Produit  Quantite  Prix
4  Mangue        30  3.50
3    Kiwi        45  2.30
0   Pomme        50  1.20
2  Orange        80  1.50
1  Banane       120  0.80

Tri par prix (decroissant) :
  Produit  Quantite  Prix
4  Mangue        30  3.50
3    Kiwi        45  2.30
2  Orange        80  1.50
0   Pomme        50  1.20
1  Banane       120  0.80

Tri par Region (asc) puis CA (desc) :
  Region Produit   CA
4   Nord  Orange  120
2   Nord  Banane   96
0   Nord   Pomme   60
1    Sud  Banane   96
3    Sud   Pomme   72
```

---

### Étape 3 : Regrouper avec `groupby`

Calcule des statistiques par groupe.

```python
import pandas as pd

ventes = pd.DataFrame({
    "Produit": ["Pomme", "Banane", "Pomme", "Banane", "Orange",
                "Orange", "Pomme", "Banane"],
    "Region": ["Nord", "Nord", "Sud", "Sud", "Nord",
               "Sud", "Nord", "Sud"],
    "Quantite": [50, 120, 60, 90, 80, 70, 55, 85],
    "Prix": [1.20, 0.80, 1.20, 0.80, 1.50, 1.50, 1.20, 0.80]
})

# Somme des quantites par produit
par_produit = ventes.groupby("Produit")["Quantite"].sum()
print("Quantite totale par produit :")
print(par_produit)

# Moyenne des quantites par region
par_region = ventes.groupby("Region")["Quantite"].mean()
print("\nQuantite moyenne par region :")
print(par_region)

# Plusieurs agregations
stats = ventes.groupby("Produit")["Quantite"].agg(["sum", "mean", "count"])
print("\nStatistiques par produit :")
print(stats)

# Grouper par plusieurs colonnes
par_produit_region = ventes.groupby(["Produit", "Region"])["Quantite"].sum()
print("\nQuantite par produit et region :")
print(par_produit_region)

# Ajouter une colonne calculee avant le groupby
ventes["CA"] = ventes["Quantite"] * ventes["Prix"]
ca_par_produit = ventes.groupby("Produit")["CA"].sum()
print("\nChiffre d'affaires par produit :")
print(ca_par_produit)
```

**Résultat attendu** :

```text
Quantite totale par produit :
Produit
Banane    295
Orange    150
Pomme     165
Name: Quantite, dtype: int64

Quantite moyenne par region :
Region
Nord    76.25
Sud     76.25
Name: Quantite, dtype: float64

Statistiques par produit :
         sum  mean  count
Produit
Banane   295  98.333333      3
Orange   150  75.000000      2
Pomme    165  55.000000      3

Quantite par produit et region :
Produit  Region
Banane   Nord      120
         Sud       175
Orange   Nord       80
         Sud        70
Pomme    Nord      105
         Sud        60
Name: Quantite, dtype: int64

Chiffre d'affaires par produit :
Produit
Banane    236.0
Orange    225.0
Pomme     198.0
Name: CA, dtype: float64
```

---

### Étape 4 : Fusionner des DataFrames avec `merge`

Combine deux sources de données sur une colonne commune.

```python
import pandas as pd

# DataFrame des commandes
commandes = pd.DataFrame({
    "commande_id": [1, 2, 3, 4, 5],
    "client_id": [101, 102, 101, 103, 104],
    "produit": ["Laptop", "Clavier", "Souris", "Ecran", "Laptop"],
    "montant": [899, 45, 25, 350, 899]
})

# DataFrame des clients
clients = pd.DataFrame({
    "client_id": [101, 102, 103, 105],
    "nom": ["Alice", "Bob", "Charlie", "Eve"],
    "ville": ["Paris", "Lyon", "Marseille", "Nantes"]
})

print("Commandes :")
print(commandes)
print("\nClients :")
print(clients)

# Inner merge (seuls les clients presents dans les deux DataFrames)
inner = pd.merge(commandes, clients, on="client_id", how="inner")
print("\nInner merge :")
print(inner)
# Remarque : client_id 104 (commande 5) est absent car pas dans 'clients'
# Remarque : client_id 105 (Eve) est absent car pas dans 'commandes'

# Left merge (toutes les commandes, meme sans info client)
left = pd.merge(commandes, clients, on="client_id", how="left")
print("\nLeft merge :")
print(left)
# Remarque : commande 5 (client 104) a NaN pour nom et ville

# Outer merge (tout le monde)
outer = pd.merge(commandes, clients, on="client_id", how="outer")
print("\nOuter merge :")
print(outer)
```

**Résultat attendu** :

```text
Commandes :
   commande_id  client_id  produit  montant
0            1        101   Laptop      899
1            2        102  Clavier       45
2            3        101   Souris       25
3            4        103    Ecran      350
4            5        104   Laptop      899

Clients :
   client_id      nom      ville
0        101    Alice      Paris
1        102      Bob       Lyon
2        103  Charlie  Marseille
3        105      Eve    Nantes

Inner merge :
   commande_id  client_id  produit  montant      nom      ville
0            1        101   Laptop      899    Alice      Paris
1            3        101   Souris       25    Alice      Paris
2            2        102  Clavier       45      Bob       Lyon
3            4        103    Ecran      350  Charlie  Marseille

Left merge :
   commande_id  client_id  produit  montant      nom      ville
0            1        101   Laptop      899    Alice      Paris
1            2        102  Clavier       45      Bob       Lyon
2            3        101   Souris       25    Alice      Paris
3            4        103    Ecran      350  Charlie  Marseille
4            5        104   Laptop      899      NaN        NaN

Outer merge :
   commande_id  client_id  produit  montant      nom      ville
0          1.0        101   Laptop    899.0    Alice      Paris
1          3.0        101   Souris     25.0    Alice      Paris
2          2.0        102  Clavier     45.0      Bob       Lyon
3          4.0        103    Ecran    350.0  Charlie  Marseille
4          5.0        104   Laptop    899.0      NaN        NaN
5          NaN        105      NaN      NaN      Eve    Nantes
```

---

### Étape 5 : Gérer les valeurs manquantes (NaN)

Detecte et traite les données manquantes.

```python
import pandas as pd
import numpy as np

# DataFrame avec des valeurs manquantes
df = pd.DataFrame({
    "Nom": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "Age": [25, np.nan, 35, 28, np.nan],
    "Salaire": [35000, 42000, np.nan, 45000, 40000],
    "Ville": ["Paris", "Lyon", None, "Toulouse", "Nantes"]
})

print("DataFrame avec NaN :")
print(df)

# Detecter les valeurs manquantes
print(f"\nValeurs manquantes par colonne :\n{df.isna().sum()}")
print(f"Total de valeurs manquantes : {df.isna().sum().sum()}")

# Supprimer les lignes avec au moins un NaN
sans_nan = df.dropna()
print(f"\nApres dropna() ({sans_nan.shape[0]} lignes restantes) :")
print(sans_nan)

# Remplir les NaN avec une valeur
rempli = df.copy()
rempli["Age"] = rempli["Age"].fillna(rempli["Age"].mean())
rempli["Salaire"] = rempli["Salaire"].fillna(0)
rempli["Ville"] = rempli["Ville"].fillna("Inconnue")
print("\nApres fillna() :")
print(rempli)
```

**Résultat attendu** :

```text
DataFrame avec NaN :
       Nom   Age   Salaire      Ville
0    Alice  25.0   35000.0      Paris
1      Bob   NaN   42000.0       Lyon
2  Charlie  35.0       NaN       None
3    Diana  28.0   45000.0   Toulouse
4      Eve   NaN   40000.0    Nantes

Valeurs manquantes par colonne :
Nom        0
Age        2
Salaire    1
Ville      1
dtype: int64
Total de valeurs manquantes : 4

Apres dropna() (2 lignes restantes) :
     Nom   Age   Salaire     Ville
0  Alice  25.0   35000.0     Paris
3  Diana  28.0   45000.0  Toulouse

Apres fillna() :
       Nom        Age   Salaire      Ville
0    Alice  25.000000   35000.0      Paris
1      Bob  29.333333   42000.0       Lyon
2  Charlie  35.000000       0.0   Inconnue
3    Diana  28.000000   45000.0   Toulouse
4      Eve  29.333333   40000.0    Nantes
```

---

### Étape 6 : Créer un tableau croisé (pivot)

Réorganise les données pour les analyser sous un angle différent.

```python
import pandas as pd

ventes = pd.DataFrame({
    "Mois": ["Jan", "Jan", "Fev", "Fev", "Mar", "Mar"],
    "Region": ["Nord", "Sud", "Nord", "Sud", "Nord", "Sud"],
    "CA": [1200, 1500, 1100, 1600, 1300, 1400]
})

print("Donnees originales :")
print(ventes)

# Pivot : lignes = Mois, colonnes = Region, valeurs = CA
pivot = ventes.pivot(index="Mois", columns="Region", values="CA")
print("\nTableau croise (pivot) :")
print(pivot)

# Pivot table avec agregation (quand il y a des doublons)
ventes2 = pd.DataFrame({
    "Mois": ["Jan", "Jan", "Jan", "Fev", "Fev", "Fev"],
    "Region": ["Nord", "Nord", "Sud", "Nord", "Sud", "Sud"],
    "CA": [500, 700, 1500, 1100, 800, 800]
})

pivot2 = pd.pivot_table(ventes2, values="CA", index="Mois",
                        columns="Region", aggfunc="sum")
print("\nPivot table avec somme :")
print(pivot2)
```

**Résultat attendu** :

```text
Donnees originales :
  Mois Region    CA
0  Jan   Nord  1200
1  Jan    Sud  1500
2  Fev   Nord  1100
3  Fev    Sud  1600
4  Mar   Nord  1300
5  Mar    Sud  1400

Tableau croise (pivot) :
Region  Nord   Sud
Mois
Fev     1100  1600
Jan     1200  1500
Mar     1300  1400

Pivot table avec somme :
Region  Nord   Sud
Mois
Fev     1100  1600
Jan     1200  1500
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `df[condition]` | Filtrer les lignes selon une condition |
| `df[col].isin(liste)` | Verifier si les valeurs sont dans une liste |
| `df.sort_values(col)` | Trier par une colonne |
| `df.groupby(col)` | Regrouper par une colonne |
| `.agg(["sum", "mean"])` | Appliquer plusieurs agrégations |
| `pd.merge(df1, df2, on=col)` | Fusionner sur une colonne commune |
| `df.isna().sum()` | Compter les valeurs manquantes |
| `df.dropna()` | Supprimer les lignes avec NaN |
| `df.fillna(valeur)` | Remplacer les NaN par une valeur |
| `df.pivot(index, columns, values)` | Créer un tableau croisé |

---

## Pièges Fréquents

### Piège 1 : Oublier `how` dans `merge`

**Problème** : par défaut, `pd.merge()` effectue un `inner` join. Des lignes disparaissent sans prevenir si les clés ne correspondent pas.

**Solution** : specifie toujours le paramètre `how` et vérifie le nombre de lignes avant et après le merge.

```python
# Toujours preciser how
resultat = pd.merge(df1, df2, on="id", how="left")

# Verifier
print(f"Avant : {len(df1)} lignes")
print(f"Apres : {len(resultat)} lignes")
```

### Piège 2 : `groupby` retourne un objet, pas un DataFrame

**Problème** : `df.groupby("col")` seul ne retourne rien d'affichable.

**Solution** : chaîne toujours une aggregation après `groupby`.

```python
# Incorrect (n'affiche rien d'utile)
# print(df.groupby("Region"))

# Correct
print(df.groupby("Region")["CA"].sum())
```

### Piège 3 : Confondre `NaN` et `None`

**Problème** : `NaN` (Not a Number) est un float, `None` est un objet Python. Pandas convertit `None` en `NaN` dans les colonnes numériques.

**Solution** : utilise toujours `isna()` ou `notna()` pour tester les valeurs manquantes. Ne compare jamais avec `==`.

```python
import numpy as np
import pandas as pd

# Ne fonctionne PAS (NaN n'est egal a rien, meme pas a lui-meme)
# df[df["Age"] == np.nan]     # Retourne un DataFrame vide

# Correct
df[df["Age"].isna()]          # Retourne les lignes ou Age est manquant
```

---

## Checklist de Validation

- [ ] Je sais filtrer un DataFrame avec une ou plusieurs conditions
- [ ] Je sais utiliser `.isin()` pour filtrer sur une liste de valeurs
- [ ] Je sais trier un DataFrame par une ou plusieurs colonnes
- [ ] Je sais utiliser `groupby` avec `sum()`, `mean()` et `agg()`
- [ ] Je sais fusionner deux DataFrames avec `pd.merge()` et je comprends les types de jointure
- [ ] Je sais détecter, supprimer et remplacer les valeurs manquantes (NaN)
- [ ] Je sais créer un tableau croisé avec `pivot`

---

## Exercice Pratique

**Énoncé** : À partir de deux DataFrames (commandes et produits), fusionne-les, calcule le chiffre d'affaires par catégorie de produit, identifie la catégorie la plus rentable, et affiche un tableau croisé des quantités vendues par mois et par catégorie.

**Indications** :

- DataFrame `commandes` : colonnes `commande_id`, `produit_id`, `quantite`, `mois`
- DataFrame `produits` : colonnes `produit_id`, `nom`, `categorie`, `prix_unitaire`
- Fusionne avec `merge` sur `produit_id`
- Calcule le CA : `quantite * prix_unitaire`
- Utilise `groupby("categorie")["CA"].sum()` pour le CA par catégorie
- Utilise `pd.pivot_table()` pour le tableau croisé

**Données** :

```python
commandes = pd.DataFrame({
    "commande_id": [1, 2, 3, 4, 5, 6, 7, 8],
    "produit_id": [101, 102, 103, 101, 104, 102, 103, 104],
    "quantite": [2, 1, 3, 1, 2, 4, 1, 3],
    "mois": ["Jan", "Jan", "Jan", "Fev", "Fev", "Fev", "Mar", "Mar"]
})

produits = pd.DataFrame({
    "produit_id": [101, 102, 103, 104],
    "nom": ["Clavier", "Souris", "Ecran", "Casque"],
    "categorie": ["Peripherique", "Peripherique", "Ecran", "Audio"],
    "prix_unitaire": [45, 25, 350, 80]
})
```

**Résultat attendu** (structure) :

```text
CA par categorie :
categorie
Audio            400
Ecran           1400
Peripherique     260

Categorie la plus rentable : Ecran (1400 EUR)

Tableau croise quantites par mois et categorie :
categorie  Audio  Ecran  Peripherique
mois
Fev          2.0    NaN           5.0
Jan          NaN    3.0           3.0
Mar          3.0    1.0           NaN
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import pandas as pd

# Donnees des commandes
commandes = pd.DataFrame({
    "commande_id": [1, 2, 3, 4, 5, 6, 7, 8],
    "produit_id": [101, 102, 103, 101, 104, 102, 103, 104],
    "quantite": [2, 1, 3, 1, 2, 4, 1, 3],
    "mois": ["Jan", "Jan", "Jan", "Fev", "Fev", "Fev", "Mar", "Mar"]
})

# Donnees des produits
produits = pd.DataFrame({
    "produit_id": [101, 102, 103, 104],
    "nom": ["Clavier", "Souris", "Ecran", "Casque"],
    "categorie": ["Peripherique", "Peripherique", "Ecran", "Audio"],
    "prix_unitaire": [45, 25, 350, 80]
})

# Fusionner les deux DataFrames sur produit_id
df = pd.merge(commandes, produits, on="produit_id", how="inner")

# Calculer le chiffre d'affaires
df["CA"] = df["quantite"] * df["prix_unitaire"]

# CA par categorie
ca_categorie = df.groupby("categorie")["CA"].sum()
print("CA par categorie :")
print(ca_categorie)

# Categorie la plus rentable
meilleure = ca_categorie.idxmax()
print(f"\nCategorie la plus rentable : {meilleure} ({ca_categorie[meilleure]} EUR)")

# Tableau croise : quantites par mois et categorie
pivot = pd.pivot_table(df, values="quantite", index="mois",
                       columns="categorie", aggfunc="sum")
print("\nTableau croise quantites par mois et categorie :")
print(pivot)
```

---

## Navigation

← Fiche précédente : **[Pandas - Series et DataFrames](03-pandas-series-dataframes.md)**

→ Fiche suivante : **[Pandas - Nettoyage de données](05-pandas-nettoyage.md)**
