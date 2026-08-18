---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "Réseaux de neurones : perceptron, backpropagation, fonctions d'activation, loss functions, batch normalization et regularization"
estimated_time: "45 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 4 - Deep learning fondamental"
---

# 01 - Réseaux de neurones : théorie et pratique

> **En bref** : À la fin de cette fiche, tu sauras expliquer le fonctionnement d'un neurone artificiel, choisir la bonne fonction d'activation selon la tâche, comprendre la backpropagation en détail, et implémenter un réseau de neurones from scratch en NumPy. Lecture estimée : 45 min.


## Prérequis

- [Phase 1 - Algèbre linéaire](../01-fondamentaux-mathematiques/01-algebre-lineaire.md) (vecteurs, matrices, produit matriciel)
- [Phase 1 - Calcul différentiel et optimisation](../01-fondamentaux-mathematiques/02-calcul-differentiel-optimisation.md) (dérivées, gradient, chain rule, descente de gradient)
- [Phase 1 - Probabilités et statistiques](../01-fondamentaux-mathematiques/03-probabilites-statistiques.md) (distributions, espérance)
- [Phase 3 - Apprentissage supervisé](../03-machine-learning-classique/01-apprentissage-supervise.md) (régression, classification)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le fonctionnement d'un neurone artificiel, choisir la bonne fonction d'activation selon la tâche, comprendre la backpropagation en détail, et implémenter un réseau de neurones from scratch en NumPy.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un perceptron (neurone artificiel) ?

**Définition** : Un perceptron est l'unité de base d'un réseau de neurones. Il prend plusieurs entrées numériques, les multiplie chacune par un poids, additionne les résultats, ajoute un biais, puis applique une fonction d'activation pour produire une sortie.

**Le problème que le perceptron résout** :

Sans perceptron, voici les problèmes rencontrés :

1. **Pas de modélisation non linéaire** : une régression linéaire ne peut capturer que des relations linéaires entre les données
2. **Pas de composition** : impossible de combiner des unités simples pour modéliser des fonctions complexes
3. **Pas d'apprentissage automatique des poids** : il faudrait définir manuellement l'importance de chaque entrée

**Comment le perceptron résout ces problèmes** :

| Problème | Solution apportée par le perceptron |
| -------- | ----------------------------------- |
| Pas de modélisation non linéaire | La fonction d'activation introduit la non-linéarité |
| Pas de composition | On empile des perceptrons en couches pour former un réseau |
| Pas d'apprentissage des poids | La backpropagation ajuste automatiquement les poids |

**Analogie concrète** : Un perceptron fonctionne comme une balance de cuisine. Chaque ingrédient (entrée) a un poids différent. La balance additionne les poids de tous les ingrédients (somme pondérée). Le biais est comme la tare de la balance (un décalage fixe). La fonction d'activation est un seuil : si le poids total dépasse un certain niveau, la recette est validée (sortie = 1), sinon elle est refusée (sortie = 0).

**Ce que le perceptron n'est PAS** :

- Le perceptron n'est pas un neurone biologique. Un neurone biologique est infiniment plus complexe (dendrites, axone, neurotransmetteurs). Le perceptron est une simplification mathématique grossière.
- Le perceptron n'est pas un réseau de neurones complet. Un seul perceptron ne peut résoudre que des problèmes linéairement séparables. Il faut empiler plusieurs couches pour résoudre des problèmes complexes.

**Formule mathématique du perceptron** :

```text
z = w1*x1 + w2*x2 + ... + wn*xn + b
y = activation(z)
```

Avec :

- `x1, x2, ..., xn` : les entrées
- `w1, w2, ..., wn` : les poids (un par entrée)
- `b` : le biais
- `z` : la somme pondérée (pre-activation)
- `activation()` : la fonction d'activation
- `y` : la sortie du neurone

---

### Qu'est-ce qu'une fonction d'activation ?

**Définition** : Une fonction d'activation est une fonction mathématique appliquée à la sortie d'un neurone. Elle introduit la non-linéarité dans le réseau, ce qui lui permet d'apprendre des relations complexes.

**Le problème que les fonctions d'activation résolvent** :

Sans fonction d'activation, voici les problèmes rencontrés :

1. **Tout est linéaire** : empiler des couches linéaires revient à une seule couche linéaire (propriété mathématique : composition de fonctions linéaires = fonction linéaire)
2. **Pas de bornes** : les valeurs de sortie peuvent exploser vers l'infini
3. **Pas de probabilité** : impossible d'interpréter la sortie comme une probabilité entre 0 et 1

**Comment les fonctions d'activation résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Tout est linéaire | Les fonctions non linéaires (ReLU, sigmoid) permettent d'approximer n'importe quelle fonction |
| Pas de bornes | Sigmoid et tanh bornent la sortie entre [0,1] et [-1,1] |
| Pas de probabilité | Sigmoid (binaire) et softmax (multi-classes) produisent des probabilités |

**Analogie concrète** : La fonction d'activation est comme un filtre de douche. L'eau brute (la somme pondérée) entre dans le filtre, et ce qui sort est transformé : certaines impuretés sont retirées, le débit est régulé. Sans filtre, l'eau passe telle quelle (fonction linéaire). Avec un filtre, l'eau est modifiée de manière utile (non-linéarité).

**Les principales fonctions d'activation** :

| Fonction | Formule | Plage de sortie | Quand l'utiliser |
| -------- | ------- | --------------- | ---------------- |
| Sigmoid | 1 / (1 + e^(-z)) | [0, 1] | Dernière couche : classification binaire |
| Tanh | (e^z - e^(-z)) / (e^z + e^(-z)) | [-1, 1] | Couches cachées si les données sont centrées |
| ReLU | max(0, z) | [0, +inf] | Couches cachées (choix par défaut) |
| Leaky ReLU | z si z > 0, sinon 0.01*z | (-inf, +inf) | Couches cachées si ReLU cause des neurones morts |
| Softmax | e^(zi) / somme(e^(zj)) | [0, 1] (somme = 1) | Dernière couche : classification multi-classes |

**Quand utiliser quelle activation** :

- **Couches cachées** : ReLU est le choix par défaut. Si des neurones meurent (sortie toujours 0), utilise Leaky ReLU.
- **Dernière couche, classification binaire** : Sigmoid.
- **Dernière couche, classification multi-classes** : Softmax.
- **Dernière couche, régression** : Aucune activation (sortie linéaire).

Le diagramme suivant montre l'architecture d'un perceptron multi-couche (MLP) avec une couche d'entrée, une couche cachée et une couche de sortie :

<div class="diagram-design">
<p><a href="../../../diagrams/ia-04-deep-learning-fondamental-01-réseaux-neurones-theorie-pratique-1.html">Qu&#x27;est-ce qu&#x27;une fonction d&#x27;activation ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-04-deep-learning-fondamental-01-réseaux-neurones-theorie-pratique-1.html" title="Qu&#x27;est-ce qu&#x27;une fonction d&#x27;activation ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que le forward pass ?

**Définition** : Le forward pass (propagation avant) est le processus qui transforme les données d'entrée en une prédiction, couche par couche, du début à la fin du réseau.

**Le problème que le forward pass résout** :

Sans forward pass, voici les problèmes rencontrés :

1. **Pas de prédiction** : le réseau ne peut pas produire de sortie à partir d'une entrée
2. **Pas de calcul intermédiaire** : impossible de stocker les valeurs nécessaires pour la backpropagation

**Comment le forward pass résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de prédiction | Chaque couche transforme l'entrée et la passe à la suivante |
| Pas de calcul intermédiaire | Les valeurs intermédiaires (activations) sont stockées en mémoire |

**Étapes du forward pass pour un réseau à 2 couches** :

```text
Entrée x
  → Couche 1 : z1 = W1 @ x + b1, puis a1 = relu(z1)
  → Couche 2 : z2 = W2 @ a1 + b2, puis y_pred = sigmoid(z2)
Sortie : y_pred
```

---

### Qu'est-ce que la backpropagation ?

**Définition** : La backpropagation (rétropropagation) est l'algorithme qui calcule le gradient de la loss par rapport à chaque poids du réseau, en appliquant la chain rule (règle de dérivation en chaîne) de la dernière couche vers la première.

**Le problème que la backpropagation résout** :

Sans backpropagation, voici les problèmes rencontrés :

1. **Pas de direction d'amélioration** : on ne sait pas comment modifier chaque poids pour réduire l'erreur
2. **Calcul prohibitif** : calculer le gradient de chaque poids indépendamment serait trop lent
3. **Pas de lien entre erreur et poids internes** : l'erreur est mesurée à la sortie, mais il faut modifier les poids de toutes les couches

**Comment la backpropagation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de direction d'amélioration | Le gradient indique la direction de la plus forte augmentation de l'erreur (on va dans le sens opposé) |
| Calcul prohibitif | La chain rule permet de réutiliser les calculs intermédiaires (complexité linéaire en nombre de couches) |
| Pas de lien erreur/poids internes | La chain rule propage le gradient de l'erreur couche par couche, de la sortie vers l'entrée |

**Analogie concrète** : Imagine une chaîne de montage dans une usine. Le produit final est défectueux (erreur élevée). Le contrôle qualité (loss function) détecte le défaut. Pour corriger le problème, on remonte la chaîne poste par poste (backpropagation) : le dernier poste ajuste d'abord son réglage, puis le poste précédent, et ainsi de suite jusqu'au premier. Chaque poste ajuste son réglage proportionnellement à sa contribution au défaut (gradient).

**Ce que la backpropagation n'est PAS** :

- La backpropagation n'est pas la descente de gradient. La backpropagation calcule les gradients. La descente de gradient utilise ces gradients pour mettre à jour les poids. Ce sont deux étapes distinctes.
- La backpropagation n'est pas un algorithme d'apprentissage biologique. Le cerveau humain n'utilise probablement pas la backpropagation.

**Formule de la chain rule appliquée** :

```text
dL/dW1 = dL/dy_pred * dy_pred/dz2 * dz2/da1 * da1/dz1 * dz1/dW1
```

Chaque terme correspond à la dérivée d'une étape du forward pass. On les multiplie ensemble pour obtenir l'impact de W1 sur la loss.

---

### Qu'est-ce qu'une loss function ?

**Définition** : Une loss function (fonction de perte) mesure l'écart entre les prédictions du réseau et les valeurs réelles. Plus la loss est basse, meilleures sont les prédictions.

**Les deux loss functions principales** :

| Loss function | Formule | Quand l'utiliser |
| ------------- | ------- | ---------------- |
| MSE (Mean Squared Error) | (1/n) * somme((y_pred - y_true)^2) | Régression (prédire un nombre) |
| Cross-entropy (binaire) | -(1/n) \* somme(y\*log(p) + (1-y)\*log(1-p)) | Classification (prédire une catégorie) |
| Cross-entropy (catégorielle) | -(1/n) \* somme(somme(y_k \* log(p_k))) | Classification multi-classes |

**Ce que la loss function n'est PAS** :

- La loss function n'est pas une métrique d'évaluation. L'accuracy est une métrique facile à comprendre par un humain. La loss est un signal différentiable utilisé par l'optimiseur pour ajuster les poids.

---

### Qu'est-ce que la batch normalization ?

**Définition** : La batch normalization est une technique qui normalise les activations de chaque couche en les recentrant (moyenne 0) et en les mettant à l'échelle (écart-type 1) sur chaque mini-batch.

**Le problème que la batch normalization résout** :

Sans batch normalization, voici les problèmes rencontrés :

1. **Internal covariate shift** : la distribution des activations change à chaque couche pendant l'entraînement, ce qui rend l'optimisation instable
2. **Entraînement lent** : il faut utiliser un learning rate très faible pour éviter la divergence
3. **Sensibilité à l'initialisation** : le réseau peut ne pas converger si les poids initiaux sont mal choisis

**Comment la batch normalization résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Internal covariate shift | Les activations sont normalisées à chaque couche, stabilisant la distribution |
| Entraînement lent | On peut utiliser un learning rate plus élevé sans risque de divergence |
| Sensibilité à l'initialisation | La normalisation réduit l'impact des poids initiaux |

**Analogie concrète** : Imagine que tu prépares des ingrédients pour une recette. Sans batch normalization, chaque ingrédient arrive dans une unité différente (un en grammes, un en litres, un en tasses). Tu dois constamment convertir. Avec batch normalization, tous les ingrédients sont convertis dans la même unité avant d'être utilisés. Cela rend la recette plus facile à suivre et plus prévisible.

---

### Qu'est-ce que la regularization ?

**Définition** : La regularization regroupe les techniques qui empêchent le réseau de s'adapter trop précisément aux données d'entraînement (overfitting), en le forçant à apprendre des patterns généraux plutôt que du bruit.

**Le problème que la regularization résout** :

Sans regularization, voici les problèmes rencontrés :

1. **Overfitting** : le réseau mémorise les données d'entraînement au lieu d'apprendre des patterns généralisables
2. **Mauvaise généralisation** : la performance sur de nouvelles données est bien pire que sur les données d'entraînement
3. **Poids trop grands** : les poids deviennent très grands pour s'adapter au bruit dans les données

**Comment la regularization résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Overfitting | Dropout désactive aléatoirement des neurones, empêchant la co-adaptation |
| Mauvaise généralisation | Early stopping arrête l'entraînement quand la performance sur la validation se dégrade |
| Poids trop grands | L2 (weight decay) pénalise les poids élevés dans la loss |

**Les trois techniques principales** :

- **Dropout** : pendant l'entraînement, chaque neurone est désactivé avec une probabilité p (typiquement 0.2 à 0.5). Le réseau doit apprendre des représentations redondantes.
- **L2 regularization (weight decay)** : on ajoute un terme lambda * somme(w^2) à la loss. Les poids élevés sont pénalisés.
- **Early stopping** : on surveille la loss sur un jeu de validation. Quand elle commence à remonter, on arrête l'entraînement et on garde les meilleurs poids.

**Comparaison des techniques de regularization** :

| Technique | Mécanisme | Hyperparamètre | Avantage principal |
| --------- | --------- | -------------- | ------------------ |
| Dropout | Désactive des neurones aléatoirement | Probabilité p (0.2-0.5) | Empêche la co-adaptation |
| L2 / Weight decay | Pénalise les gros poids | Coefficient lambda | Lisse les poids |
| Early stopping | Arrête l'entraînement au bon moment | Patience (nombre d'époques) | Pas d'hyperparamètre de regularization |

---

## Étapes Pratiques

### Étape 1 : Implémenter un neurone unique en NumPy

On commence par un seul neurone avec 2 entrées, des poids, un biais et une activation sigmoid.

```python
import numpy as np

# Fonction d'activation sigmoid
def sigmoid(z):
    # Formule : 1 / (1 + e^(-z))
    return 1 / (1 + np.exp(-z))

# Dérivée de sigmoid (nécessaire pour la backpropagation)
def sigmoid_derivative(z):
    s = sigmoid(z)
    # La dérivée de sigmoid(z) est sigmoid(z) * (1 - sigmoid(z))
    return s * (1 - s)

# Entrées : 2 valeurs
x = np.array([0.5, 0.8])

# Poids : un par entrée (initialisés aléatoirement)
np.random.seed(42)
w = np.random.randn(2)  # Exemple : [0.49, -0.13]

# Biais : un seul scalaire
b = 0.0

# Forward pass d'un neurone
z = np.dot(w, x) + b  # Somme pondérée + biais
y = sigmoid(z)         # Activation

print(f"Poids : {w}")
print(f"Somme pondérée z : {z:.4f}")
print(f"Sortie y : {y:.4f}")
```

**Résultat attendu** :

```text
Poids : [ 0.49671415 -0.1382643 ]
Somme pondérée z : 0.1378
Sortie y : 0.5344
```

---

### Étape 2 : Implémenter un réseau 2 couches from scratch

Ce réseau possède une couche cachée (4 neurones) et une couche de sortie (1 neurone).

```python
import numpy as np

# Fonctions d'activation
def relu(z):
    # ReLU : max(0, z) pour chaque élément
    return np.maximum(0, z)

def relu_derivative(z):
    # Dérivée de ReLU : 1 si z > 0, sinon 0
    return (z > 0).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Architecture du réseau
input_size = 2    # 2 entrées
hidden_size = 4   # 4 neurones cachés
output_size = 1   # 1 sortie

# Initialisation des poids (He / Kaiming, adaptée à ReLU)
np.random.seed(42)
# Couche 1 : (input_size, hidden_size)
W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2.0 / input_size)
b1 = np.zeros((1, hidden_size))

# Couche 2 : (hidden_size, output_size)
W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2.0 / hidden_size)
b2 = np.zeros((1, output_size))

# Forward pass
def forward(X):
    # Couche 1 : somme pondérée + ReLU
    z1 = X @ W1 + b1        # (n, 2) @ (2, 4) = (n, 4)
    a1 = relu(z1)            # Activation ReLU

    # Couche 2 : somme pondérée + sigmoid
    z2 = a1 @ W2 + b2       # (n, 4) @ (4, 1) = (n, 1)
    a2 = sigmoid(z2)         # Activation sigmoid (sortie entre 0 et 1)

    return z1, a1, z2, a2

# Données XOR (problème non linéairement séparable)
X = np.array([[0, 0],
              [0, 1],
              [1, 0],
              [1, 1]])

y = np.array([[0],
              [1],
              [1],
              [0]])

# Test du forward pass
z1, a1, z2, y_pred = forward(X)
print(f"Prédictions avant entraînement : {y_pred.flatten()}")
```

**Résultat attendu** :

```text
Prédictions avant entraînement : [0.5    0.3164 0.2934 0.172 ]
```

Les prédictions sont proches de 0.5 ou biaisées : le réseau non entraîné ne sait pas encore classifier.

---

### Étape 3 : Implémenter la backpropagation et la boucle d'entraînement

```python
import numpy as np

# Fonctions d'activation
def relu(z):
    return np.maximum(0, z)

def relu_derivative(z):
    return (z > 0).astype(float)

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Données XOR
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# Initialisation
np.random.seed(42)
input_size, hidden_size, output_size = 2, 8, 1
W1 = np.random.randn(input_size, hidden_size) * np.sqrt(2.0 / input_size)
b1 = np.zeros((1, hidden_size))
W2 = np.random.randn(hidden_size, output_size) * np.sqrt(2.0 / hidden_size)
b2 = np.zeros((1, output_size))

# Hyperparamètres
learning_rate = 0.5
epochs = 5000

# Boucle d'entraînement
for epoch in range(epochs):
    # --- Forward pass ---
    z1 = X @ W1 + b1           # Pre-activation couche 1
    a1 = relu(z1)              # Activation couche 1
    z2 = a1 @ W2 + b2          # Pre-activation couche 2
    a2 = sigmoid(z2)           # Sortie du réseau

    # --- Calcul de la loss (binary cross-entropy) ---
    n = X.shape[0]
    # On ajoute 1e-8 pour éviter log(0)
    loss = -(1/n) * np.sum(y * np.log(a2 + 1e-8) + (1 - y) * np.log(1 - a2 + 1e-8))

    # --- Backpropagation ---
    # Gradient de la loss par rapport à a2
    dL_da2 = -(y / (a2 + 1e-8)) + ((1 - y) / (1 - a2 + 1e-8))

    # Gradient de sigmoid : a2 * (1 - a2)
    da2_dz2 = a2 * (1 - a2)

    # Gradient par rapport à z2
    dL_dz2 = dL_da2 * da2_dz2   # (4, 1)

    # Gradient par rapport à W2 et b2
    dL_dW2 = a1.T @ dL_dz2 / n  # (4, 1)
    dL_db2 = np.sum(dL_dz2, axis=0, keepdims=True) / n

    # Gradient par rapport à a1
    dL_da1 = dL_dz2 @ W2.T      # (4, 8)

    # Gradient par rapport à z1 (dérivée de ReLU)
    dL_dz1 = dL_da1 * relu_derivative(z1)

    # Gradient par rapport à W1 et b1
    dL_dW1 = X.T @ dL_dz1 / n   # (2, 8)
    dL_db1 = np.sum(dL_dz1, axis=0, keepdims=True) / n

    # --- Mise à jour des poids (descente de gradient) ---
    W2 -= learning_rate * dL_dW2
    b2 -= learning_rate * dL_db2
    W1 -= learning_rate * dL_dW1
    b1 -= learning_rate * dL_db1

    # Affichage toutes les 1000 époques
    if epoch % 1000 == 0:
        print(f"Époque {epoch:5d} | Loss : {loss:.4f}")

# Résultat final
z1 = X @ W1 + b1
a1 = relu(z1)
z2 = a1 @ W2 + b2
y_pred = sigmoid(z2)
print(f"\nPrédictions finales : {y_pred.flatten().round(3)}")
print(f"Valeurs attendues :   {y.flatten()}")
```

**Résultat attendu** :

```text
Époque     0 | Loss : 0.9568
Époque  1000 | Loss : 0.0014
Époque  2000 | Loss : 0.0006
Époque  3000 | Loss : 0.0004
Époque  4000 | Loss : 0.0002

Prédictions finales : [0. 1. 1. 0.]
Valeurs attendues :   [0 1 1 0]
```

Le réseau a appris XOR : il prédit correctement les 4 cas.

---

### Étape 4 : Visualiser les fonctions d'activation

```python
import numpy as np
import matplotlib.pyplot as plt

z = np.linspace(-5, 5, 200)

# Calcul des activations
sigmoid_vals = 1 / (1 + np.exp(-z))
tanh_vals = np.tanh(z)
relu_vals = np.maximum(0, z)
leaky_relu_vals = np.where(z > 0, z, 0.01 * z)

# Affichage sur une grille 2x2
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(z, sigmoid_vals, color='blue')
axes[0, 0].set_title("Sigmoid")
axes[0, 0].axhline(y=0, color='gray', linestyle='--', linewidth=0.5)
axes[0, 0].axhline(y=1, color='gray', linestyle='--', linewidth=0.5)
axes[0, 0].grid(True, alpha=0.3)

axes[0, 1].plot(z, tanh_vals, color='green')
axes[0, 1].set_title("Tanh")
axes[0, 1].axhline(y=0, color='gray', linestyle='--', linewidth=0.5)
axes[0, 1].grid(True, alpha=0.3)

axes[1, 0].plot(z, relu_vals, color='red')
axes[1, 0].set_title("ReLU")
axes[1, 0].axhline(y=0, color='gray', linestyle='--', linewidth=0.5)
axes[1, 0].grid(True, alpha=0.3)

axes[1, 1].plot(z, leaky_relu_vals, color='purple')
axes[1, 1].set_title("Leaky ReLU (alpha=0.01)")
axes[1, 1].axhline(y=0, color='gray', linestyle='--', linewidth=0.5)
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("activations.png", dpi=100)
plt.show()
print("Graphique sauvegardé dans activations.png")
```

**Résultat attendu** : Un graphique 2x2 montrant les 4 fonctions d'activation avec leurs formes caractéristiques.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `np.random.randn(rows, cols)` | Crée une matrice de poids avec distribution normale |
| `np.dot(a, b)` ou `a @ b` | Produit matriciel (forward pass) |
| `np.maximum(0, z)` | Applique ReLU élément par élément |
| `np.exp(-z)` | Exponentielle (utilisée dans sigmoid) |
| `np.sum(array, axis=0)` | Somme sur l'axe 0 (pour les gradients du biais) |
| `np.sqrt(2.0 / n)` | Facteur d'initialisation He (ReLU) ; Xavier utilise plutôt `sqrt(1/n)` ou `sqrt(2/(fan_in+fan_out))` |

---

## Pièges Fréquents

### Piège 1 : Utiliser sigmoid dans les couches cachées

⚠️ **Problème** : Sigmoid sature pour les valeurs extrêmes (sortie proche de 0 ou 1), ce qui rend le gradient quasi nul. C'est le problème du vanishing gradient. L'entraînement devient extrêmement lent.

✅ **Solution** : Utilise ReLU (ou Leaky ReLU) pour les couches cachées. Réserve sigmoid uniquement pour la dernière couche en classification binaire.

---

### Piège 2 : Oublier de diviser les gradients par la taille du batch

⚠️ **Problème** : Si tu calcules la loss sans diviser par `n` (nombre d'exemples), les gradients sont proportionnels à la taille du batch. Changer la taille du batch modifie l'amplitude des mises à jour.

✅ **Solution** : Divise toujours la loss et les gradients par `n` :

```python
# Correct : division par n
loss = -(1/n) * np.sum(y * np.log(a2 + 1e-8) + (1 - y) * np.log(1 - a2 + 1e-8))
dL_dW2 = a1.T @ dL_dz2 / n
```

---

### Piège 3 : Ne pas ajouter epsilon dans le log

⚠️ **Problème** : `np.log(0)` renvoie `-inf`, ce qui casse le calcul de la loss. Cela arrive quand le réseau prédit exactement 0 ou 1.

✅ **Solution** : Ajoute un petit epsilon (1e-8) à l'argument du log :

```python
# Incorrect : risque de log(0)
loss = -np.sum(y * np.log(a2))

# Correct : epsilon empêche log(0)
loss = -np.sum(y * np.log(a2 + 1e-8))
```

---

### Piège 4 : Mauvaise initialisation des poids

⚠️ **Problème** : Initialiser tous les poids à zéro fait que tous les neurones d'une couche calculent exactement la même chose (symétrie). Le réseau n'apprend pas.

✅ **Solution** : Utilise l'initialisation Xavier (pour sigmoid/tanh) ou He (pour ReLU) :

```python
# Initialisation He (recommandée avec ReLU)
W = np.random.randn(input_size, output_size) * np.sqrt(2.0 / input_size)
```

---

## Checklist de Validation

- [ ] Je sais expliquer le fonctionnement d'un perceptron (entrées, poids, biais, activation)
- [ ] Je connais les 5 fonctions d'activation principales et quand les utiliser
- [ ] Je comprends la différence entre forward pass et backpropagation
- [ ] Je sais appliquer la chain rule pour calculer les gradients
- [ ] Je connais la différence entre MSE et cross-entropy
- [ ] Je sais expliquer ce que font batch normalization et dropout
- [ ] J'ai implémenté un réseau from scratch qui résout XOR

---

## Exercice Pratique

**Énoncé** : Implémente un réseau de neurones from scratch en NumPy (sans PyTorch ni framework) capable de classifier les chiffres 0 et 1 du dataset MNIST simplifié. Le réseau doit avoir 2 couches cachées (64 et 32 neurones), utiliser ReLU comme activation cachée, sigmoid en sortie, et atteindre au moins 95% d'accuracy.

**Indications** :

- Utilise `sklearn.datasets.load_digits` pour charger un dataset MNIST simplifié (images 8x8)
- Filtre uniquement les chiffres 0 et 1
- Normalise les entrées en divisant par 16 (valeur maximale des pixels)
- Sépare en 80% entraînement / 20% test
- Architecture : 64 entrées -> 64 neurones (ReLU) -> 32 neurones (ReLU) -> 1 sortie (sigmoid)
- Utilise binary cross-entropy comme loss
- Entraîne pendant 1000 époques avec un learning rate de 0.1

**Résultat attendu** : Le réseau atteint plus de 95% d'accuracy sur les données de test.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

# --- Chargement et préparation des données ---

# Charger le dataset de chiffres 8x8
digits = load_digits()
X_all = digits.data      # (1797, 64) : images 8x8 aplaties
y_all = digits.target     # (1797,) : étiquettes 0-9

# Filtrer uniquement les chiffres 0 et 1
mask = (y_all == 0) | (y_all == 1)
X = X_all[mask]           # (360, 64)
y = y_all[mask].reshape(-1, 1)  # (360, 1)

# Normaliser les entrées entre 0 et 1
X = X / 16.0

# Séparer en entraînement (80%) et test (20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Entraînement : {X_train.shape[0]} exemples")
print(f"Test : {X_test.shape[0]} exemples")

# --- Fonctions utilitaires ---

def relu(z):
    return np.maximum(0, z)

def relu_derivative(z):
    return (z > 0).astype(float)

def sigmoid(z):
    # Clipping pour éviter les overflows
    z = np.clip(z, -500, 500)
    return 1 / (1 + np.exp(-z))

# --- Initialisation du réseau ---

np.random.seed(42)

# Couche 1 : 64 -> 64
W1 = np.random.randn(64, 64) * np.sqrt(2.0 / 64)
b1 = np.zeros((1, 64))

# Couche 2 : 64 -> 32
W2 = np.random.randn(64, 32) * np.sqrt(2.0 / 64)
b2 = np.zeros((1, 32))

# Couche 3 (sortie) : 32 -> 1
W3 = np.random.randn(32, 1) * np.sqrt(2.0 / 32)
b3 = np.zeros((1, 1))

# --- Hyperparamètres ---
learning_rate = 0.1
epochs = 1000

# --- Boucle d'entraînement ---

for epoch in range(epochs):
    n = X_train.shape[0]

    # Forward pass
    z1 = X_train @ W1 + b1
    a1 = relu(z1)
    z2 = a1 @ W2 + b2
    a2 = relu(z2)
    z3 = a2 @ W3 + b3
    a3 = sigmoid(z3)

    # Loss (binary cross-entropy)
    loss = -(1/n) * np.sum(
        y_train * np.log(a3 + 1e-8) +
        (1 - y_train) * np.log(1 - a3 + 1e-8)
    )

    # Backpropagation
    # Couche 3
    dL_dz3 = (a3 - y_train) / n
    dL_dW3 = a2.T @ dL_dz3
    dL_db3 = np.sum(dL_dz3, axis=0, keepdims=True)

    # Couche 2
    dL_da2 = dL_dz3 @ W3.T
    dL_dz2 = dL_da2 * relu_derivative(z2)
    dL_dW2 = a1.T @ dL_dz2
    dL_db2 = np.sum(dL_dz2, axis=0, keepdims=True)

    # Couche 1
    dL_da1 = dL_dz2 @ W2.T
    dL_dz1 = dL_da1 * relu_derivative(z1)
    dL_dW1 = X_train.T @ dL_dz1
    dL_db1 = np.sum(dL_dz1, axis=0, keepdims=True)

    # Mise à jour des poids
    W3 -= learning_rate * dL_dW3
    b3 -= learning_rate * dL_db3
    W2 -= learning_rate * dL_dW2
    b2 -= learning_rate * dL_db2
    W1 -= learning_rate * dL_dW1
    b1 -= learning_rate * dL_db1

    if epoch % 200 == 0:
        # Accuracy sur l'entraînement
        predictions = (a3 > 0.5).astype(int)
        accuracy = np.mean(predictions == y_train)
        print(f"Époque {epoch:4d} | Loss : {loss:.4f} | Accuracy : {accuracy:.2%}")

# --- Évaluation sur le jeu de test ---

z1 = X_test @ W1 + b1
a1 = relu(z1)
z2 = a1 @ W2 + b2
a2 = relu(z2)
z3 = a2 @ W3 + b3
a3 = sigmoid(z3)

predictions = (a3 > 0.5).astype(int)
test_accuracy = np.mean(predictions == y_test)
print(f"\nAccuracy sur le test : {test_accuracy:.2%}")
```

**Résultat attendu** :

```text
Entraînement : 288 exemples
Test : 72 exemples
Époque    0 | Loss : 0.6931 | Accuracy : 50.00%
Époque  200 | Loss : 0.0312 | Accuracy : 99.31%
Époque  400 | Loss : 0.0098 | Accuracy : 100.00%
Époque  600 | Loss : 0.0051 | Accuracy : 100.00%
Époque  800 | Loss : 0.0033 | Accuracy : 100.00%

Accuracy sur le test : 98.61%
```

---

## Navigation

→ Fiche suivante : **[02 - PyTorch](02-pytorch.md)**
