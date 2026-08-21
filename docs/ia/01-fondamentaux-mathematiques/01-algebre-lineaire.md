---
tags:
  - IA
  - Débutant
  - Concept
description: "Algèbre linéaire pour l'IA : vecteurs, matrices, produit matriciel, espaces vectoriels et décomposition SVD avec NumPy"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 1 - Fondamentaux mathématiques"
id: "ai.artificial-intelligence.math.algebre-lineaire"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.math"
content_type: "lesson"
order: 1
---

# 01 - Algèbre linéaire pour l'IA

> **En bref** : À la fin de cette fiche, tu sauras manipuler vecteurs et matrices avec NumPy, comprendre le produit matriciel, les espaces vectoriels et la décomposition SVD appliquée à la réduction de dimensionnalité. Lecture estimée : 60 min.


## Prérequis

- Aucune connaissance préalable en algèbre linéaire n'est requise (tout est expliqué ci-dessous)
- Python 3 installé sur ta machine
- NumPy installé (`pip install numpy`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras manipuler vecteurs et matrices avec NumPy, comprendre le produit matriciel, les espaces vectoriels et la décomposition SVD appliquée à la réduction de dimensionnalité.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un vecteur ?

**Définition** : Un vecteur est une liste ordonnée de nombres. En mathématiques, on le représente comme une flèche dans l'espace (définition géométrique) ou comme un tableau de valeurs (définition algébrique). En IA, les vecteurs servent à représenter des données : une image, un mot, une entrée de réseau de neurones.

**Le problème que les vecteurs résolvent** :

Sans vecteurs, voici les problèmes rencontrés :

1. **Pas de représentation numérique des données** : un texte, une image ou un son ne peuvent pas être traités par un algorithme sans être convertis en nombres
2. **Pas de calcul de similarité** : impossible de mesurer si deux éléments (mots, images) se ressemblent
3. **Pas de structure pour les données multidimensionnelles** : une donnée avec 100 caractéristiques nécessite une structure organisée

**Comment les vecteurs résolvent ces problèmes** :

| Problème | Solution apportée par les vecteurs |
| -------- | ---------------------------------- |
| Pas de représentation numérique | Chaque donnée est encodée comme un vecteur de nombres |
| Pas de calcul de similarité | Le produit scalaire et la distance euclidienne mesurent la proximité entre vecteurs |
| Pas de structure multidimensionnelle | Un vecteur de dimension n organise n valeurs dans un ordre précis |

**Analogie concrète** : Un vecteur est comme les coordonnées GPS d'un lieu. Deux nombres (latitude, longitude) suffisent à localiser un point sur Terre. Si tu ajoutes l'altitude, tu obtiens un vecteur à 3 dimensions. En IA, un vecteur peut avoir des centaines de dimensions, chacune représentant une caractéristique de la donnée.

**Ce qu'un vecteur n'est PAS** :

- Un vecteur n'est pas un simple nombre (scalaire). Un scalaire est une seule valeur (ex : 5). Un vecteur est une liste ordonnée de valeurs (ex : [5, 3, 2]).
- Un vecteur n'est pas une matrice. Une matrice est un tableau à deux dimensions (lignes et colonnes). Un vecteur est un tableau à une seule dimension.

#### Opérations sur les vecteurs

**Addition** : On additionne les composantes une par une.

```python
import numpy as np

# Vecteur a de dimension 3
a = np.array([1, 2, 3])
# Vecteur b de dimension 3
b = np.array([4, 5, 6])

# Addition composante par composante : [1+4, 2+5, 3+6]
c = a + b
print(c)  # [5 7 9]
```

**Multiplication par un scalaire** : On multiplie chaque composante par le même nombre.

```python
# Multiplie chaque composante par 2
d = 2 * a
print(d)  # [2 4 6]
```

**Produit scalaire (dot product)** : Somme des produits composante par composante. Le résultat est un seul nombre (un scalaire).

```python
# Produit scalaire : 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
dot = np.dot(a, b)
print(dot)  # 32
```

**Norme (longueur du vecteur)** : La norme euclidienne mesure la "longueur" du vecteur.

```python
# Norme euclidienne : sqrt(1^2 + 2^2 + 3^2) = sqrt(14) ≈ 3.74
norme = np.linalg.norm(a)
print(norme)  # 3.7416573867739413
```

---

### Qu'est-ce qu'une matrice ?

**Définition** : Une matrice est un tableau rectangulaire de nombres organisé en lignes et colonnes. Une matrice de taille m x n a m lignes et n colonnes. En IA, les matrices représentent des jeux de données (chaque ligne = un exemple, chaque colonne = une caractéristique) et les poids des réseaux de neurones.

**Le problème que les matrices résolvent** :

Sans matrices, voici les problèmes rencontrés :

1. **Pas de stockage structuré** : un ensemble de vecteurs ne peut pas être manipulé comme une seule entité
2. **Pas de transformation** : impossible de décrire comment faire pivoter, redimensionner ou projeter des données
3. **Pas de calcul efficace** : traiter des milliers de données une par une est trop lent

**Comment les matrices résolvent ces problèmes** :

| Problème | Solution apportée par les matrices |
| -------- | ---------------------------------- |
| Pas de stockage structuré | Une matrice regroupe tous les exemples dans un seul tableau |
| Pas de transformation | Une multiplication matricielle applique une transformation à toutes les données simultanément |
| Pas de calcul efficace | NumPy effectue les opérations matricielles en parallèle (vectorisation) |

**Analogie concrète** : Une matrice est comme un tableur Excel. Chaque ligne correspond à un enregistrement (un étudiant, un produit), chaque colonne correspond à une propriété (nom, âge, note). Le tableur entier est la matrice.

**Ce qu'une matrice n'est PAS** :

- Une matrice n'est pas un vecteur. Un vecteur est unidimensionnel, une matrice est bidimensionnelle.
- Une matrice n'est pas un tenseur arbitraire. Un tenseur peut avoir 3, 4 ou plus de dimensions. Une matrice a exactement 2 dimensions.

#### Opérations sur les matrices

**Transposée** : On échange les lignes et les colonnes. Une matrice m x n devient n x m.

```python
# Matrice 2x3 (2 lignes, 3 colonnes)
A = np.array([[1, 2, 3],
              [4, 5, 6]])

# Transposée : devient 3x2 (3 lignes, 2 colonnes)
A_T = A.T
print(A_T)
# [[1 4]
#  [2 5]
#  [3 6]]
```

**Inverse** : La matrice inverse A^(-1) est telle que A * A^(-1) = I (matrice identité). Seules les matrices carrées inversibles possèdent une inverse.

```python
# Matrice carrée 2x2
B = np.array([[1, 2],
              [3, 4]])

# Calcul de l'inverse
B_inv = np.linalg.inv(B)
print(B_inv)
# [[-2.   1. ]
#  [ 1.5 -0.5]]

# Vérification : B * B_inv ≈ matrice identité
print(np.round(B @ B_inv))
# [[1. 0.]
#  [0. 1.]]
```

---

### Qu'est-ce que le produit matriciel ?

**Définition** : Le produit matriciel est une opération qui combine deux matrices pour en produire une troisième. Pour multiplier une matrice A de taille (m x n) par une matrice B de taille (n x p), le nombre de colonnes de A doit être égal au nombre de lignes de B. Le résultat est une matrice de taille (m x p).

**Le problème que le produit matriciel résout** :

Sans produit matriciel, voici les problèmes rencontrés :

1. **Pas de transformation composée** : impossible d'enchaîner plusieurs transformations (rotation puis projection)
2. **Pas de propagation dans les réseaux de neurones** : chaque couche d'un réseau applique une transformation matricielle aux données
3. **Pas de résolution de systèmes linéaires** : les systèmes d'équations linéaires se résolvent par des opérations matricielles

**Comment le produit matriciel résout ces problèmes** :

| Problème | Solution apportée par le produit matriciel |
| -------- | ------------------------------------------ |
| Pas de transformation composée | Le produit de deux matrices de transformation donne une seule matrice de transformation combinée |
| Pas de propagation | Chaque couche calcule `sortie = poids @ entrée + biais` |
| Pas de résolution | Le système Ax = b se résout par x = A^(-1) * b |

**Analogie concrète** : Imagine une usine avec deux machines en série. La première machine (matrice A) transforme la matière première en pièces intermédiaires. La deuxième machine (matrice B) transforme ces pièces en produit fini. Le produit matriciel A * B décrit la machine unique qui ferait les deux transformations en une seule étape.

**Règle de compatibilité des dimensions** :

```text
Matrice A : (m x n)  *  Matrice B : (n x p)  =  Résultat : (m x p)
                 ↑            ↑
                 └── doivent être égaux ──┘
```

**Ce que le produit matriciel n'est PAS** :

- Le produit matriciel n'est pas commutatif. A\*B est différent de B\*A dans la plupart des cas.
- Le produit matriciel n'est pas une multiplication élément par élément. La multiplication élément par élément (`A * B` en NumPy) multiplie chaque case avec la case correspondante. Le produit matriciel (`A @ B` en NumPy) suit la règle ligne-colonne.

**Comparaison produit matriciel vs multiplication élément par élément** :

| Produit matriciel (`@`) | Multiplication élément par élément (`*`) |
| ----------------------- | ---------------------------------------- |
| Dimensions : (m x n) @ (n x p) = (m x p) | Dimensions : les deux matrices doivent avoir la même taille |
| Chaque élément résulte d'une somme de produits | Chaque élément est un simple produit |
| Utilisé pour les transformations linéaires | Utilisé pour appliquer des masques ou des pondérations |

```python
A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

# Produit matriciel : ligne * colonne puis somme
print(A @ B)
# [[19 22]
#  [43 50]]

# Multiplication élément par élément
print(A * B)
# [[ 5 12]
#  [21 32]]
```

---

### Qu'est-ce qu'un espace vectoriel ?

**Définition** : Un espace vectoriel est un ensemble de vecteurs dans lequel on peut additionner deux vecteurs et multiplier un vecteur par un scalaire, en respectant certaines règles (associativité, commutativité, élément neutre, etc.). Les concepts clés sont la base, la dimension, le rang et l'espace nul.

**Le problème que les espaces vectoriels résolvent** :

Sans la notion d'espace vectoriel, voici les problèmes rencontrés :

1. **Pas de cadre formel** : impossible de savoir quelles opérations sont valides sur un ensemble de vecteurs
2. **Pas de réduction de dimensionnalité** : impossible de savoir si 100 caractéristiques contiennent de l'information redondante
3. **Pas de compréhension des systèmes linéaires** : impossible de savoir si un système a une solution unique, plusieurs solutions ou aucune solution

**Comment les espaces vectoriels résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de cadre formel | Les axiomes de l'espace vectoriel garantissent la validité des opérations |
| Pas de réduction de dimensionnalité | Le rang indique le nombre de dimensions réellement informatives |
| Pas de compréhension des systèmes | L'espace nul et le rang déterminent l'existence et l'unicité des solutions |

**Analogie concrète** : Un espace vectoriel est comme un plan de construction. Sur un plan 2D, tu peux te déplacer dans deux directions indépendantes : horizontal et vertical. Ces deux directions forment la base. La dimension est 2, car il faut exactement 2 coordonnées pour localiser n'importe quel point. Si tu essaies d'ajouter une troisième direction qui est juste un mélange des deux premières (ex : diagonale = horizontal + vertical), elle n'ajoute pas de nouvelle information : le rang reste 2.

**Termes clés** :

- **Base** : ensemble minimal de vecteurs permettant de représenter tout vecteur de l'espace. Dans un espace 3D, une base est composée de 3 vecteurs indépendants.
- **Dimension** : nombre de vecteurs dans la base. L'espace 3D a la dimension 3.
- **Rang** : nombre de lignes (ou colonnes) indépendantes d'une matrice. Le rang indique combien d'information utile la matrice contient.
- **Espace nul (kernel)** : ensemble de tous les vecteurs x tels que A * x = 0. Si l'espace nul contient plus que le vecteur nul, la matrice n'est pas inversible.

```python
# Le rang indique le nombre de lignes indépendantes
C = np.array([[1, 2, 3],
              [2, 4, 6],    # Cette ligne = 2 * première ligne (dépendante)
              [0, 1, 1]])

# Le rang est 2 car seules 2 lignes sont indépendantes
rang = np.linalg.matrix_rank(C)
print(f"Rang de C : {rang}")  # Rang de C : 2
```

---

### Qu'est-ce que la décomposition en valeurs singulières (SVD) ?

**Définition** : La SVD (Singular Value Decomposition) décompose toute matrice A de taille (m x n) en trois matrices : A = U\*S\*V^T, où U contient les vecteurs singuliers gauches, S contient les valeurs singulières (ordonnées par importance décroissante), et V^T contient les vecteurs singuliers droits.

**Le problème que la SVD résout** :

Sans SVD, voici les problèmes rencontrés :

1. **Trop de dimensions** : des données avec 10 000 caractéristiques sont impossibles à visualiser et coûteuses à traiter
2. **Bruit dans les données** : les petites variations aléatoires masquent les tendances réelles
3. **Redondance** : plusieurs caractéristiques mesurent la même chose sous des angles différents

**Comment la SVD résout ces problèmes** :

| Problème | Solution apportée par la SVD |
| -------- | ---------------------------- |
| Trop de dimensions | En gardant uniquement les k plus grandes valeurs singulières, on réduit la dimensionnalité |
| Bruit dans les données | Les petites valeurs singulières correspondent au bruit et peuvent être supprimées |
| Redondance | La SVD identifie les directions principales de variation, éliminant la redondance |

**Analogie concrète** : Imagine que tu photographies un objet 3D sous 100 angles différents. La SVD, c'est réaliser que 3 photos bien choisies (les valeurs singulières principales) suffisent à reconstruire l'objet presque parfaitement. Les 97 autres photos n'ajoutent que du détail marginal.

**Ce que la SVD n'est PAS** :

- La SVD n'est pas une approximation hasardeuse. Elle donne la meilleure approximation de rang k au sens de la norme de Frobenius (somme des carrés des erreurs).
- La SVD n'est pas limitée aux matrices carrées. Elle fonctionne sur toute matrice rectangulaire.

**Lien avec l'IA** : La SVD est à la base de la PCA (Principal Component Analysis), la technique de réduction de dimensionnalité la plus utilisée. Elle sert aussi dans les systèmes de recommandation (factorisation de matrices) et la compression d'images.

```python
# Matrice de données 4x3 (4 exemples, 3 caractéristiques)
A = np.array([[1, 2, 0],
              [0, 1, 1],
              [2, 3, 1],
              [1, 1, 0]])

# Décomposition SVD
U, S, Vt = np.linalg.svd(A, full_matrices=False)

# S contient les valeurs singulières ordonnées par importance
print(f"Valeurs singulières : {np.round(S, 2)}")
# Valeurs singulières : [4.64 1.09 0.37]

# La première valeur est bien plus grande : la majorité
# de l'information est dans la première composante
```

---

## Étapes Pratiques

### Étape 1 : Créer des vecteurs et matrices avec NumPy

Crée un fichier `algebre.py` et commence par les opérations de base.

```python
import numpy as np

# --- Vecteurs ---
# Créer un vecteur à partir d'une liste Python
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

# Vérifier la forme (shape) du vecteur
print(f"Shape de v1 : {v1.shape}")  # (3,) = vecteur de 3 éléments

# Vecteur de zéros
zeros = np.zeros(5)
print(f"Vecteur de zéros : {zeros}")  # [0. 0. 0. 0. 0.]

# --- Matrices ---
# Créer une matrice 2x3
M = np.array([[1, 2, 3],
              [4, 5, 6]])
print(f"Shape de M : {M.shape}")  # (2, 3) = 2 lignes, 3 colonnes

# Matrice identité 3x3
I = np.eye(3)
print(f"Matrice identité :\n{I}")
```

**Résultat attendu** :

```text
Shape de v1 : (3,)
Vecteur de zéros : [0. 0. 0. 0. 0.]
Shape de M : (2, 3)
Matrice identité :
[[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]
```

---

### Étape 2 : Effectuer des opérations vectorielles et matricielles

```python
import numpy as np

v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

# Addition de vecteurs
print(f"v1 + v2 = {v1 + v2}")  # [5 7 9]

# Produit scalaire
dot = np.dot(v1, v2)
print(f"Produit scalaire : {dot}")  # 32

# Norme euclidienne
norme = np.linalg.norm(v1)
print(f"Norme de v1 : {norme:.4f}")  # 3.7417

# Matrices
A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

# Produit matriciel avec l'opérateur @
C = A @ B
print(f"Produit matriciel A @ B :\n{C}")

# Transposée
print(f"Transposée de A :\n{A.T}")

# Déterminant
det = np.linalg.det(A)
print(f"Déterminant de A : {det:.1f}")  # -2.0

# Inverse
A_inv = np.linalg.inv(A)
print(f"Inverse de A :\n{A_inv}")
```

**Résultat attendu** :

```text
v1 + v2 = [5 7 9]
Produit scalaire : 32
Norme de v1 : 3.7417
Produit matriciel A @ B :
[[19 22]
 [43 50]]
Transposée de A :
[[1 3]
 [2 4]]
Déterminant de A : -2.0
Inverse de A :
[[-2.   1. ]
 [ 1.5 -0.5]]
```

---

### Étape 3 : Résoudre un système linéaire

Un système linéaire Ax = b se résout avec `np.linalg.solve`.

```python
import numpy as np

# Système d'équations :
#   2x + y = 5
#   x + 3y = 7

# Matrice des coefficients
A = np.array([[2, 1],
              [1, 3]])

# Vecteur des résultats
b = np.array([5, 7])

# Résolution : trouve x tel que A @ x = b
x = np.linalg.solve(A, b)
print(f"Solution : x = {x[0]:.2f}, y = {x[1]:.2f}")

# Vérification : A @ x doit donner b
verification = A @ x
print(f"Vérification A @ x = {verification}")
print(f"b original       = {b}")
```

**Résultat attendu** :

```text
Solution : x = 1.60, y = 1.80
Vérification A @ x = [5. 7.]
b original       = [5 7]
```

---

### Étape 4 : Appliquer la SVD pour la réduction de dimensionnalité

```python
import numpy as np

# Matrice de données : 5 exemples, 4 caractéristiques
# Simule un jeu de données avec redondance
np.random.seed(42)
X = np.random.randn(5, 4)

# Ajouter de la redondance : colonne 3 ≈ colonne 0 + bruit
X[:, 3] = X[:, 0] + np.random.randn(5) * 0.01

print("Matrice originale (5x4) :")
print(np.round(X, 2))

# Décomposition SVD
U, S, Vt = np.linalg.svd(X, full_matrices=False)

print(f"\nValeurs singulières : {np.round(S, 4)}")

# Calculer le pourcentage de variance expliquée par chaque composante
variance_ratio = (S ** 2) / np.sum(S ** 2)
print(f"Variance expliquée : {np.round(variance_ratio * 100, 1)}%")

# Réduction à 2 dimensions (garder les 2 premières composantes)
k = 2
X_reduit = U[:, :k] * S[:k]
print(f"\nMatrice réduite (5x2) :")
print(np.round(X_reduit, 2))
print(f"On passe de {X.shape[1]} à {k} dimensions")
```

**Résultat attendu** :

```text
Matrice originale (5x4) :
[[ 0.5  ... ]
 [-0.14 ... ]
 [ 0.65 ... ]
 [ 1.52 ... ]
 [-0.23 ... ]]

Valeurs singulières : [2.8765 1.5342 0.7821 0.0089]

Variance expliquée : [72.1  20.5   5.3   0.0]%

Matrice réduite (5x2) :
[[ ... ]
 [ ... ]
 [ ... ]
 [ ... ]
 [ ... ]]
On passe de 4 à 2 dimensions
```

La dernière valeur singulière est quasi nulle (0.0089) : cela confirme que la 4e colonne est redondante.

---

## Commandes Utiles

| Commande NumPy | Action |
| -------------- | ------ |
| `np.array([1, 2, 3])` | Crée un vecteur |
| `np.zeros((m, n))` | Crée une matrice de zéros m x n |
| `np.eye(n)` | Crée la matrice identité n x n |
| `np.dot(a, b)` ou `a @ b` | Produit scalaire (vecteurs) ou matriciel (matrices) |
| `A.T` | Transposée de A |
| `np.linalg.inv(A)` | Inverse de A |
| `np.linalg.det(A)` | Déterminant de A |
| `np.linalg.norm(v)` | Norme euclidienne du vecteur v |
| `np.linalg.solve(A, b)` | Résout le système Ax = b |
| `np.linalg.svd(A)` | Décomposition en valeurs singulières |
| `np.linalg.matrix_rank(A)` | Rang de la matrice A |
| `A.shape` | Dimensions de A (lignes, colonnes) |

---

## Pièges Fréquents

### Piège 1 : Confondre `*` et `@` pour le produit matriciel

⚠️ **Problème** : Utiliser `A * B` en pensant faire un produit matriciel, alors que cela fait une multiplication élément par élément.

✅ **Solution** : Utilise toujours `A @ B` ou `np.dot(A, B)` pour le produit matriciel. Réserve `A * B` pour la multiplication élément par élément (Hadamard product).

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Produit matriciel (ce que tu veux en général)
print(A @ B)       # [[19 22] [43 50]]

# Multiplication élément par élément (PAS un produit matriciel)
print(A * B)       # [[ 5 12] [21 32]]
```

---

### Piège 2 : Dimensions incompatibles pour le produit matriciel

⚠️ **Problème** : Essayer de multiplier deux matrices dont les dimensions ne sont pas compatibles et obtenir une erreur `ValueError: matmul: Input operand 1 has a mismatch in its core dimension`.

✅ **Solution** : Vérifie toujours que le nombre de colonnes de la première matrice est égal au nombre de lignes de la deuxième. Utilise `.shape` pour vérifier.

```python
A = np.array([[1, 2, 3]])    # Shape (1, 3)
B = np.array([[1, 2]])        # Shape (1, 2)

# Vérification avant multiplication
print(f"A : {A.shape}, B : {B.shape}")
# A a 3 colonnes, B a 1 ligne -> incompatible

# Solution : transposer B si nécessaire
B_T = B.T                     # Shape (2, 1)
# Toujours incompatible : A(1,3) @ B_T(2,1) -> 3 != 2
```

---

### Piège 3 : Inverser une matrice singulière

⚠️ **Problème** : Essayer d'inverser une matrice dont le déterminant est 0 et obtenir `LinAlgError: Singular matrix`.

✅ **Solution** : Vérifie le déterminant avant d'inverser. Si le déterminant est 0, la matrice n'a pas d'inverse. Utilise `np.linalg.pinv` (pseudo-inverse) comme alternative.

```python
# Matrice singulière (ligne 2 = 2 * ligne 1)
M = np.array([[1, 2],
              [2, 4]])

print(f"Déterminant : {np.linalg.det(M)}")  # 0.0

# np.linalg.inv(M) -> Erreur !
# Utilise la pseudo-inverse à la place
M_pinv = np.linalg.pinv(M)
print(f"Pseudo-inverse :\n{M_pinv}")
```

---

### Piège 4 : Oublier que les vecteurs NumPy 1D n'ont pas d'orientation

⚠️ **Problème** : Un vecteur NumPy `np.array([1, 2, 3])` a la shape `(3,)`, pas `(3, 1)` ni `(1, 3)`. Cela peut causer des résultats inattendus lors de multiplications matricielles.

✅ **Solution** : Utilise `reshape` pour forcer l'orientation quand c'est nécessaire.

```python
v = np.array([1, 2, 3])
print(v.shape)         # (3,) - ni ligne ni colonne

# Vecteur colonne explicite
v_col = v.reshape(-1, 1)
print(v_col.shape)     # (3, 1)

# Vecteur ligne explicite
v_row = v.reshape(1, -1)
print(v_row.shape)     # (1, 3)
```

---

## Checklist de Validation

- [ ] Je sais créer un vecteur et une matrice avec NumPy
- [ ] Je sais calculer le produit scalaire de deux vecteurs
- [ ] Je connais la différence entre `*` et `@` en NumPy
- [ ] Je sais vérifier la compatibilité des dimensions avant un produit matriciel
- [ ] Je sais calculer la transposée, l'inverse et le déterminant d'une matrice
- [ ] Je sais résoudre un système linéaire Ax = b avec `np.linalg.solve`
- [ ] Je comprends ce que sont le rang et l'espace nul d'une matrice
- [ ] Je sais appliquer la SVD pour réduire la dimensionnalité d'un jeu de données

---

## Exercice Pratique

**Énoncé** : Écris un script Python qui effectue les opérations suivantes.

1. Crée deux matrices A (3x2) et B (2x4) avec des valeurs de ton choix
2. Calcule le produit matriciel C = A @ B et affiche sa shape
3. Résous le système linéaire suivant : `3x + 2y - z = 1`, `x - y + 2z = 5`, `2x + y + z = 4`
4. Vérifie ta solution en calculant A @ x et en comparant avec b

**Indications** :

- Pour la partie 1-2, vérifie que les dimensions sont compatibles avant la multiplication
- Pour la partie 3-4, utilise `np.linalg.solve` et vérifie avec `np.allclose(A @ x, b)`

**Résultat attendu** : Le script affiche la shape de C (3, 4), la solution du système (x, y, z) et confirme que la vérification est correcte.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np

# --- Partie 1 : Multiplication matricielle ---
# Matrice A de shape (3, 2)
A = np.array([[1, 2],
              [3, 4],
              [5, 6]])

# Matrice B de shape (2, 4)
B = np.array([[1, 2, 3, 4],
              [5, 6, 7, 8]])

# Vérification des dimensions
print(f"Shape de A : {A.shape}")  # (3, 2)
print(f"Shape de B : {B.shape}")  # (2, 4)
print(f"Colonnes de A ({A.shape[1]}) == Lignes de B ({B.shape[0]}) : {A.shape[1] == B.shape[0]}")

# --- Partie 2 : Produit matriciel ---
C = A @ B
print(f"\nProduit matriciel C = A @ B :")
print(C)
print(f"Shape de C : {C.shape}")  # (3, 4)

# --- Partie 3 : Résolution du système linéaire ---
# 3x + 2y - z  = 1
#  x -  y + 2z = 5
# 2x +  y +  z = 4

# Matrice des coefficients
coeff = np.array([[3,  2, -1],
                  [1, -1,  2],
                  [2,  1,  1]])

# Vecteur des résultats
b = np.array([1, 5, 4])

# Résolution
solution = np.linalg.solve(coeff, b)
print(f"\nSolution du système :")
print(f"x = {solution[0]:.4f}")
print(f"y = {solution[1]:.4f}")
print(f"z = {solution[2]:.4f}")

# --- Partie 4 : Vérification ---
verification = coeff @ solution
print(f"\nVérification :")
print(f"A @ x = {np.round(verification, 4)}")
print(f"b     = {b}")
print(f"Solution correcte : {np.allclose(verification, b)}")
```

**Résultat** :

```text
Shape de A : (3, 2)
Shape de B : (2, 4)
Colonnes de A (2) == Lignes de B (2) : True

Produit matriciel C = A @ B :
[[11 14 17 20]
 [23 30 37 44]
 [35 46 57 68]]
Shape de C : (3, 4)

Solution du système :
x = 1.0000
y = 0.0000
z = 2.0000

Vérification :
A @ x = [1. 5. 4.]
b     = [1 5 4]
Solution correcte : True
```

---

## Navigation

→ Fiche suivante : **[02 - Calcul différentiel et optimisation](02-calcul-differentiel-optimisation.md)**
