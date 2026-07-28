---
tags:
  - Python
  - Data
  - Débutant
  - Pratique
description: "Maîtriser les bases de NumPy : ndarray, opérations vectorisees, indexation, reshape et fonctions statistiques."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 8
cursus: "Python Data"
---

# 02 - NumPy - Calcul numérique

> **En bref** : Maîtriser les tableaux NumPy (ndarray), les opérations vectorisees, l'indexation avancée et les fonctions statistiques de base. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Introduction à l'analyse de données](01-introduction-data.md)
- Avoir installe NumPy dans un environnement virtuel
- Connaitre les listes Python et les boucles `for`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et manipuler des tableaux NumPy, effectuer des calculs vectorises sans boucle et calculer des statistiques descriptives.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un ndarray ?

**Définition** : Un ndarray (n-dimensional array) est la structure de données centrale de NumPy. C'est un tableau multidimensionnel dont tous les éléments sont du même type (homogene).

**Le problème que le ndarray résout** :

Sans ndarray, voici les problèmes rencontrés :

1. **Lenteur des listes** : additionner deux listes Python de 1 million d'éléments avec une boucle `for` prend plusieurs secondes.
2. **Code verbeux** : calculer la moyenne d'une liste nécessite d'écrire une boucle, un accumulateur et une division.
3. **Pas de calcul matriciel** : les listes Python ne supportent pas nativement les opérations mathématiques élément par élément.

**Comment le ndarray résout ces problèmes** :

| Problème | Solution apportée par le ndarray |
| --- | --- |
| Lenteur des listes | Le ndarray stocke les données de maniere contigue en mémoire et utilise du code C optimise en interne |
| Code verbeux | Des fonctions intégrées (`np.mean()`, `np.sum()`) remplacent les boucles manuelles |
| Pas de calcul matriciel | Les opérations arithmétiques s'appliquent élément par élément automatiquement |

**Analogie concrète** : Imagine un casier a courrier dans un bureau. Chaque case a exactement la même taille et contient exactement le même type d'objet (une enveloppe). Tu peux accéder a n'importe quelle case instantanément grâce à son numéro. Une liste Python, c'est plutôt un sac ou chaque objet est de taille différente - il faut fouiller pour trouver ce qu'on cherche.

**Ce qu'un ndarray n'est PAS** :

- Un ndarray n'est pas une liste Python. Une liste peut contenir des types différents (`[1, "texte", 3.14]`). Un ndarray contient un seul type.
- Un ndarray n'est pas redimensionnable dynamiquement. Ajouter un élément créé un nouveau tableau en mémoire (coûteux). Pour des données qui changent souvent de taille, Pandas est plus adapte.

**Comparaison liste Python vs ndarray** :

| Liste Python | ndarray NumPy |
| --- | --- |
| Types hétérogènes | Type unique (homogene) |
| Taille dynamique | Taille fixe après création |
| Boucle pour les calculs | Opérations vectorisees |
| Stockage disperse en mémoire | Stockage contigu en mémoire |
| Lent pour les gros volumes | Rapide grâce au code C interne |

---

### Qu'est-ce qu'une opération vectorisee ?

**Définition** : Une opération vectorisee applique un calcul a tous les éléments d'un tableau en une seule instruction, sans écrire de boucle explicite. C'est le coeur de la puissance de NumPy.

**Le problème que les opérations vectorisees résolvent** :

Sans opérations vectorisees, voici les problèmes rencontrés :

1. **Boucles explicites** : pour multiplier chaque élément d'un tableau par 2, il faut écrire une boucle `for` qui parcourt tous les éléments.
2. **Performance médiocre** : les boucles Python sont interpretes et donc lentes sur de gros volumes.

**Comment les opérations vectorisees résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Boucles explicites | L'opération s'écrit en une seule ligne (`tableau * 2`) |
| Performance médiocre | Le calcul est delegue a du code C compile, des centaines de fois plus rapide |

**Analogie concrète** : Imagine que tu dois tamponner 1 000 enveloppes. La méthode "boucle", c'est prendre chaque enveloppe une par une, poser le tampon, reposer l'enveloppe. La méthode "vectorisee", c'est etaler les 1 000 enveloppes sur une grande table et passer un rouleau-tampon géant d'un seul coup.

---

### Qu'est-ce que l'indexation NumPy ?

**Définition** : L'indexation permet de sélectionner un ou plusieurs éléments d'un tableau en utilisant des indices, des tranches (slices) ou des conditions booleennes.

**Trois types d'indexation** :

| Type | Syntaxe | Exemple | Résultat |
| --- | --- | --- | --- |
| Indice simple | `tableau[i]` | `tableau[0]` | Premier élément |
| Tranche (slice) | `tableau[debut:fin]` | `tableau[1:4]` | Éléments 1, 2 et 3 |
| Booléen (masque) | `tableau[condition]` | `tableau[tableau > 5]` | Éléments supérieurs a 5 |

**Ce que l'indexation n'est PAS** :

- L'indexation booleenne ne modifie pas le tableau original (sauf si on l'utilise pour une affectation). Elle créé une copie des éléments qui satisfont la condition.

---

## Étapes Pratiques

### Étape 1 : Créer des tableaux NumPy

Découvre les différentes facons de créer un ndarray.

```python
import numpy as np

# A partir d'une liste Python
notes = np.array([12, 15, 8, 17, 14, 9, 11, 16])
print(f"Notes : {notes}")
print(f"Type  : {type(notes)}")        # <class 'numpy.ndarray'>
print(f"Dtype : {notes.dtype}")         # int64 (entiers 64 bits)
print(f"Shape : {notes.shape}")         # (8,) = 1 dimension, 8 elements

# Tableau de zeros
zeros = np.zeros(5)
print(f"\nZeros : {zeros}")             # [0. 0. 0. 0. 0.]

# Tableau de uns
uns = np.ones(5)
print(f"Uns   : {uns}")                 # [1. 1. 1. 1. 1.]

# Sequence reguliere (comme range, mais retourne un ndarray)
sequence = np.arange(0, 10, 2)
print(f"Sequence : {sequence}")         # [0 2 4 6 8]

# Valeurs espacees regulierement (5 valeurs entre 0 et 1)
espace = np.linspace(0, 1, 5)
print(f"Espace   : {espace}")           # [0.   0.25 0.5  0.75 1.  ]
```

**Résultat attendu** :

```text
Notes : [12 15  8 17 14  9 11 16]
Type  : <class 'numpy.ndarray'>
Dtype : int64
Shape : (8,)

Zeros : [0. 0. 0. 0. 0.]
Uns   : [1. 1. 1. 1. 1.]
Sequence : [0 2 4 6 8]
Espace   : [0.   0.25 0.5  0.75 1.  ]
```

---

### Étape 2 : Tableaux multidimensionnels

Créé et explore des tableaux a 2 dimensions (matrices).

```python
import numpy as np

# Matrice 3x4 (3 lignes, 4 colonnes)
matrice = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
])

print(f"Matrice :\n{matrice}")
print(f"Shape   : {matrice.shape}")     # (3, 4)
print(f"Nb dimensions : {matrice.ndim}")  # 2
print(f"Nb elements   : {matrice.size}")  # 12

# Acceder a un element : matrice[ligne, colonne]
print(f"\nElement [1, 2] : {matrice[1, 2]}")  # 7 (2e ligne, 3e colonne)

# Acceder a une ligne complete
print(f"Ligne 0 : {matrice[0]}")              # [1 2 3 4]

# Acceder a une colonne complete
print(f"Colonne 1 : {matrice[:, 1]}")         # [2 6 10]
```

**Résultat attendu** :

```text
Matrice :
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]
Shape   : (3, 4)
Nb dimensions : 2
Nb elements   : 12

Element [1, 2] : 7
Ligne 0 : [1 2 3 4]
Colonne 1 : [ 2  6 10]
```

---

### Étape 3 : Opérations vectorisees

Applique des calculs a tous les éléments sans boucle.

```python
import numpy as np

# Tableau de prix en euros
prix = np.array([10.0, 25.0, 15.0, 30.0, 8.0])

# Augmenter tous les prix de 10 %
prix_augmentes = prix * 1.10
print(f"Prix originaux  : {prix}")
print(f"Prix +10 %      : {prix_augmentes}")

# Appliquer une remise de 2 euros
prix_remise = prix - 2
print(f"Prix -2 EUR     : {prix_remise}")

# Operations entre deux tableaux (element par element)
quantites = np.array([3, 1, 5, 2, 10])
totaux = prix * quantites
print(f"\nQuantites : {quantites}")
print(f"Totaux    : {totaux}")
print(f"Total general : {totaux.sum()}")

# Comparaison avec une boucle Python classique
# SANS NumPy (lent et verbeux) :
# totaux_liste = []
# for i in range(len(prix_liste)):
#     totaux_liste.append(prix_liste[i] * quantites_liste[i])

# AVEC NumPy (rapide et lisible) :
# totaux = prix * quantites
```

**Résultat attendu** :

```text
Prix originaux  : [10. 25. 15. 30.  8.]
Prix +10 %      : [11.  27.5 16.5 33.   8.8]
Prix -2 EUR     : [ 8. 23. 13. 28.  6.]

Quantites : [ 3  1  5  2 10]
Totaux    : [ 30.  25.  75.  60.  80.]
Total general : 270.0
```

---

### Étape 4 : Indexation avancée et masques booléens

Sélectionne des sous-ensembles de données avec des conditions.

```python
import numpy as np

notes = np.array([12, 15, 8, 17, 14, 9, 11, 16, 7, 13])

# Masque booleen : quelles notes sont >= 10 ?
masque = notes >= 10
print(f"Notes   : {notes}")
print(f"Masque  : {masque}")
# [True True False True True False True True False True]

# Appliquer le masque pour filtrer
reussites = notes[masque]
print(f"Reussites (>= 10) : {reussites}")

# En une seule ligne (plus idiomatique)
echecs = notes[notes < 10]
print(f"Echecs (< 10)     : {echecs}")

# Combiner des conditions avec & (et) et | (ou)
# Attention : utiliser des parentheses autour de chaque condition
bonnes_notes = notes[(notes >= 12) & (notes <= 16)]
print(f"Entre 12 et 16    : {bonnes_notes}")

# Compter les elements qui satisfont une condition
nb_reussites = np.sum(notes >= 10)
print(f"\nNombre de reussites : {nb_reussites}")
pourcentage = np.mean(notes >= 10) * 100
print(f"Pourcentage reussite : {pourcentage:.0f} %")
```

**Résultat attendu** :

```text
Notes   : [12 15  8 17 14  9 11 16  7 13]
Masque  : [ True  True False  True  True False  True  True False  True]
Reussites (>= 10) : [12 15 17 14 11 16 13]
Echecs (< 10)     : [8 9 7]
Entre 12 et 16    : [12 15 14 16 13]

Nombre de reussites : 7
Pourcentage reussite : 70 %
```

---

### Étape 5 : Reshape et transposition

Change la forme d'un tableau sans modifier ses données.

```python
import numpy as np

# Creer un tableau 1D de 12 elements
donnees = np.arange(1, 13)
print(f"1D : {donnees}")
print(f"Shape : {donnees.shape}")       # (12,)

# Reshape en matrice 3x4
matrice_3x4 = donnees.reshape(3, 4)
print(f"\n3x4 :\n{matrice_3x4}")

# Reshape en matrice 4x3
matrice_4x3 = donnees.reshape(4, 3)
print(f"\n4x3 :\n{matrice_4x3}")

# Utiliser -1 pour laisser NumPy calculer une dimension
matrice_auto = donnees.reshape(2, -1)   # 2 lignes, colonnes calculees
print(f"\n2x? :\n{matrice_auto}")       # 2x6

# Transposer (echanger lignes et colonnes)
transposee = matrice_3x4.T
print(f"\nTransposee (4x3) :\n{transposee}")
```

**Résultat attendu** :

```text
1D : [ 1  2  3  4  5  6  7  8  9 10 11 12]
Shape : (12,)

3x4 :
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]]

4x3 :
[[ 1  2  3]
 [ 4  5  6]
 [ 7  8  9]
 [10 11 12]]

2x? :
[[ 1  2  3  4  5  6]
 [ 7  8  9 10 11 12]]

Transposee (4x3) :
[[ 1  5  9]
 [ 2  6 10]
 [ 3  7 11]
 [ 4  8 12]]
```

---

### Étape 6 : Fonctions statistiques

Calcule des statistiques descriptives en une ligne.

```python
import numpy as np

# Notes d'une classe de 15 eleves
notes = np.array([12, 15, 8, 17, 14, 9, 11, 16, 7, 13, 18, 10, 14, 6, 15])

# Statistiques de base
print(f"Notes : {notes}")
print(f"Nombre   : {notes.size}")
print(f"Somme    : {notes.sum()}")
print(f"Moyenne  : {notes.mean():.2f}")
print(f"Mediane  : {np.median(notes):.2f}")
print(f"Ecart-type : {notes.std():.2f}")
print(f"Minimum  : {notes.min()}")
print(f"Maximum  : {notes.max()}")

# Position du min et du max
print(f"Indice du min : {notes.argmin()}")  # 13 (6 est en position 13)
print(f"Indice du max : {notes.argmax()}")  # 10 (18 est en position 10)

# Tri
notes_triees = np.sort(notes)
print(f"\nNotes triees : {notes_triees}")

# Percentiles (utile pour comprendre la distribution)
q25 = np.percentile(notes, 25)
q75 = np.percentile(notes, 75)
print(f"25e percentile : {q25}")
print(f"75e percentile : {q75}")
```

**Résultat attendu** :

```text
Notes : [12 15  8 17 14  9 11 16  7 13 18 10 14  6 15]
Nombre   : 15
Somme    : 185
Moyenne  : 12.33
Mediane  : 13.00
Ecart-type : 3.54
Minimum  : 6
Maximum  : 18
Indice du min : 13
Indice du max : 10

Notes triees : [ 6  7  8  9 10 11 12 13 14 14 15 15 16 17 18]
25e percentile : 9.5
75e percentile : 15.0
```

---

## Commandes Utiles

| Fonction | Action |
| --- | --- |
| `np.array(liste)` | Créer un ndarray depuis une liste |
| `np.zeros(n)` | Tableau de n zéros |
| `np.ones(n)` | Tableau de n uns |
| `np.arange(debut, fin, pas)` | Séquence régulière |
| `np.linspace(debut, fin, n)` | n valeurs espacees régulièrement |
| `tableau.shape` | Dimensions du tableau |
| `tableau.dtype` | Type des éléments |
| `tableau.reshape(l, c)` | Changer la forme |
| `tableau.T` | Transposer |
| `tableau.sum()` | Somme |
| `tableau.mean()` | Moyenne |
| `np.median(tableau)` | Mediane |
| `tableau.std()` | Ecart-type |
| `tableau.min()` / `.max()` | Minimum / Maximum |
| `np.sort(tableau)` | Trier |

---

## Pièges Fréquents

### Piège 1 : Modifier une vue au lieu d'une copie

**Problème** : un slice NumPy est une **vue** (pas une copie). Modifier la vue modifie le tableau original.

**Solution** : utilise `.copy()` si tu veux un tableau indépendant.

```python
import numpy as np

original = np.array([1, 2, 3, 4, 5])
vue = original[1:4]        # Vue (pas une copie)
vue[0] = 99                # Modifie aussi l'original !
print(original)            # [1 99 3 4 5]

# Solution : creer une copie explicite
original2 = np.array([1, 2, 3, 4, 5])
copie = original2[1:4].copy()
copie[0] = 99              # Ne modifie PAS l'original
print(original2)           # [1 2 3 4 5]
```

### Piège 2 : Oublier les parentheses dans les conditions combinees

**Problème** : `notes >= 12 & notes <= 16` provoque une erreur car `&` est evalue avant `>=`.

**Solution** : entoure chaque condition de parentheses.

```python
# Incorrect (erreur)
# resultat = notes >= 12 & notes <= 16

# Correct
resultat = (notes >= 12) & (notes <= 16)
```

### Piège 3 : Utiliser `and`/`or` au lieu de `&`/`|`

**Problème** : `and` et `or` Python ne fonctionnent pas avec les tableaux NumPy.

**Solution** : utilise `&` (et), `|` (ou), `~` (non) pour les opérations élément par élément.

```python
import numpy as np

tableau = np.array([1, 2, 3, 4, 5])

# Incorrect (erreur ValueError)
# resultat = (tableau > 2) and (tableau < 5)

# Correct
resultat = (tableau > 2) & (tableau < 5)
print(resultat)  # [False False  True  True False]
```

### Piège 4 : Utiliser `np.random.seed` (API legacy)

**Problème** : `np.random.seed()` et les fonctions `np.random.*` s'appuient sur un générateur **global**. C'est encore supporté, mais NumPy le classe comme API legacy : un autre morceau de code peut re-semer le générateur et casser la reproductibilité.

**Solution** : préfère un générateur isolé avec `np.random.default_rng(seed)` :

```python
import numpy as np

# Recommande (Generator isole)
rng = np.random.default_rng(42)
valeurs = rng.uniform(-5, 15, 31)

# Legacy (fonctionne encore, mais partage un etat global)
# np.random.seed(42)
# valeurs = np.random.uniform(-5, 15, 31)
```

Documentation NumPy : le preferred best practice est d'instancier un `Generator` et de le passer explicitement.

---

## Checklist de Validation

- [ ] Je sais créer un ndarray à partir d'une liste, de zéros, de uns ou d'une séquence
- [ ] Je comprends la différence entre une liste Python et un ndarray
- [ ] Je sais effectuer des opérations arithmétiques sur un tableau sans boucle
- [ ] Je sais filtrer un tableau avec un masque booléen
- [ ] Je sais changer la forme d'un tableau avec `reshape`
- [ ] Je sais calculer moyenne, médiane, écart-type, min et max

---

## Exercice Pratique

**Énoncé** : Tu disposes des températures quotidiennes (en degrés Celsius) d'un mois de janvier (31 jours). Créé un script qui calcule et affiche les statistiques suivantes : température moyenne, écart-type, jours les plus froid et chaud (avec leur date), nombre de jours de gel (température < 0), et les températures du deuxième semaine (jours 8 à 14).

**Indications** :

- Utilise `rng = np.random.default_rng(42)` puis `rng.uniform(-5, 15, 31)` pour générer les températures
- Utilise `argmin()` et `argmax()` pour trouver les positions des extrêmes
- Utilise un masque booléen pour compter les jours de gel
- Utilise une tranche (slice) pour extraire la deuxième semaine

**Résultat attendu** (avec `default_rng(42)` ; les valeurs exactes dépendent de la version de NumPy) :

```text
Temperatures de janvier (31 jours)
Moyenne     : ... C
Ecart-type  : ... C
Jour le plus froid : jour ... (... C)
Jour le plus chaud : jour ... (... C)
Jours de gel (< 0) : ...
Semaine 2 (jours 8-14) : [...]
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np

# Generateur isole (pratique recommandee NumPy moderne)
rng = np.random.default_rng(42)

# Generer 31 temperatures entre -5 et 15 degres
temperatures = rng.uniform(-5, 15, 31)

# Arrondir a 2 decimales pour la lisibilite
temperatures = np.round(temperatures, 2)

print("Temperatures de janvier (31 jours)")

# Statistiques de base
print(f"Moyenne     : {temperatures.mean():.2f} C")
print(f"Ecart-type  : {temperatures.std():.2f} C")

# Jours extremes (argmin/argmax donnent l'indice, +1 pour le jour)
jour_froid = temperatures.argmin()
jour_chaud = temperatures.argmax()
print(f"Jour le plus froid : jour {jour_froid + 1} ({temperatures[jour_froid]:.2f} C)")
print(f"Jour le plus chaud : jour {jour_chaud + 1} ({temperatures[jour_chaud]:.2f} C)")

# Jours de gel avec masque booleen
jours_gel = np.sum(temperatures < 0)
print(f"Jours de gel (< 0) : {jours_gel}")

# Deuxieme semaine (indices 7 a 13 = jours 8 a 14)
semaine_2 = temperatures[7:14]
print(f"Semaine 2 (jours 8-14) : {semaine_2}")
```

---

## Navigation

← Fiche précédente : **[Introduction à l'analyse de données](01-introduction-data.md)**

→ Fiche suivante : **[Pandas - Series et DataFrames](03-pandas-series-dataframes.md)**
