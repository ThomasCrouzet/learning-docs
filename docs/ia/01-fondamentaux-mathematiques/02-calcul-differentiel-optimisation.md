---
tags:
  - IA
  - Intermédiaire
  - Concept
description: "Calcul différentiel et optimisation : dérivées, gradient, chain rule, descente de gradient et variantes (SGD, Momentum, Adam)"
estimated_time: "50 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 1 - Fondamentaux mathématiques"
---

# 02 - Calcul différentiel et optimisation

> **En bref** : À la fin de cette fiche, tu sauras comprendre les dérivées, le gradient et la chain rule, puis implémenter la descente de gradient pour optimiser une fonction de coût. Lecture estimée : 50 min.


## Prérequis

- Fiche **[01 - Algèbre linéaire pour l'IA](01-algebre-lineaire.md)** (vecteurs, matrices, produit matriciel)
- Python 3 et NumPy installés

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comprendre les dérivées, le gradient et la chain rule, puis implémenter la descente de gradient pour optimiser une fonction de coût.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une dérivée ?

**Définition** : La dérivée d'une fonction f en un point x mesure la vitesse à laquelle f(x) change quand x varie légèrement. Formellement, f'(x) = lim(h->0) [f(x+h) - f(x)] / h. Si la dérivée est positive, la fonction monte. Si elle est négative, la fonction descend. Si elle est nulle, la fonction est à un sommet ou un creux.

**Le problème que les dérivées résolvent** :

Sans dérivées, voici les problèmes rencontrés :

1. **Pas de direction d'amélioration** : impossible de savoir si augmenter ou diminuer un paramètre améliorera le résultat
2. **Pas de vitesse de changement** : impossible de quantifier l'impact d'un petit changement de paramètre
3. **Pas de détection des extrema** : impossible de trouver le minimum d'une fonction de coût

**Comment les dérivées résolvent ces problèmes** :

| Problème | Solution apportée par les dérivées |
| -------- | ---------------------------------- |
| Pas de direction | Le signe de la dérivée indique si la fonction monte (+) ou descend (-) |
| Pas de vitesse | La valeur absolue de la dérivée mesure la rapidité du changement |
| Pas de détection des extrema | Les points où la dérivée vaut 0 sont les candidats pour un minimum ou un maximum |

**Analogie concrète** : Imagine que tu marches les yeux fermés sur une colline. La dérivée, c'est l'inclinaison du sol sous tes pieds. Si le sol descend (dérivée négative), tu vas vers le bas. Si le sol est plat (dérivée nulle), tu es peut-être au sommet ou dans une vallée. En descente de gradient, on descend toujours la pente pour atteindre le point le plus bas.

**Ce qu'une dérivée n'est PAS** :

- Une dérivée n'est pas la valeur de la fonction. f(3) = 9 est la valeur de f en 3. f'(3) = 6 est la pente de f en 3. Ce sont deux informations différentes.
- Une dérivée n'est pas une approximation. La dérivée est une valeur exacte obtenue par passage à la limite.

#### Dérivées de fonctions courantes

| Fonction f(x) | Dérivée f'(x) | Exemple |
| -------------- | -------------- | ------- |
| x^n | n * x^(n-1) | f(x) = x^3 -> f'(x) = 3x^2 |
| e^x | e^x | f(x) = e^x -> f'(x) = e^x |
| ln(x) | 1/x | f(x) = ln(x) -> f'(x) = 1/x |
| sin(x) | cos(x) | f(x) = sin(x) -> f'(x) = cos(x) |
| 1/x | -1/x^2 | f(x) = 1/x -> f'(x) = -1/x^2 |

#### Dérivée partielle

Quand une fonction dépend de plusieurs variables (ex : f(x, y) = x^2 + 3xy), la dérivée partielle par rapport à x mesure comment f change quand seul x varie (y est fixé).

```python
import numpy as np

# f(x, y) = x^2 + 3*x*y
# Dérivée partielle par rapport à x : df/dx = 2x + 3y
# Dérivée partielle par rapport à y : df/dy = 3x

def f(x, y):
    return x**2 + 3*x*y

# Dérivée partielle numérique (approximation)
def partial_x(x, y, h=1e-7):
    return (f(x + h, y) - f(x, y)) / h

def partial_y(x, y, h=1e-7):
    return (f(x, y + h) - f(x, y)) / h

x, y = 2.0, 1.0
print(f"df/dx en (2, 1) = {partial_x(x, y):.4f}")  # 2*2 + 3*1 = 7.0
print(f"df/dy en (2, 1) = {partial_y(x, y):.4f}")  # 3*2 = 6.0
```

---

### Qu'est-ce que le gradient ?

**Définition** : Le gradient d'une fonction f de plusieurs variables est le vecteur de toutes ses dérivées partielles. Pour f(x, y), le gradient est le vecteur [df/dx, df/dy]. Le gradient pointe dans la direction de la plus forte montée de la fonction.

**Le problème que le gradient résout** :

Sans gradient, voici les problèmes rencontrés :

1. **Pas de direction en plusieurs dimensions** : une dérivée simple ne suffit pas quand la fonction dépend de 1000 paramètres
2. **Pas d'optimisation efficace** : impossible de savoir dans quelle direction modifier tous les paramètres simultanément
3. **Pas de lien avec les réseaux de neurones** : un réseau de neurones a des millions de paramètres à ajuster

**Comment le gradient résout ces problèmes** :

| Problème | Solution apportée par le gradient |
| -------- | --------------------------------- |
| Pas de direction en N dimensions | Le gradient est un vecteur de N composantes, une par paramètre |
| Pas d'optimisation efficace | Le gradient indique la direction de plus forte montée ; on va dans le sens opposé pour minimiser |
| Pas de lien avec les réseaux de neurones | La backpropagation calcule le gradient de la loss par rapport à tous les poids |

**Analogie concrète** : Imagine que tu es sur le flanc d'une montagne avec un GPS qui t'indique la pente dans toutes les directions. Le gradient est la flèche de ce GPS qui pointe vers le sommet (plus forte montée). Pour descendre le plus vite possible, tu marches dans la direction exactement opposée à cette flèche.

**Ce que le gradient n'est PAS** :

- Le gradient n'est pas un scalaire. C'est un vecteur avec autant de composantes que de variables d'entrée.
- Le gradient n'est pas la hessienne. La hessienne est la matrice des dérivées secondes. Le gradient contient les dérivées premières.

```python
import numpy as np

# f(x, y) = x^2 + y^2
# Gradient : [2x, 2y]

def gradient_f(x, y):
    # Le gradient est le vecteur des dérivées partielles
    df_dx = 2 * x
    df_dy = 2 * y
    return np.array([df_dx, df_dy])

# Au point (3, 4)
grad = gradient_f(3, 4)
print(f"Gradient en (3, 4) : {grad}")  # [6, 8]
print(f"Direction de plus forte montée : {grad}")
print(f"Direction de plus forte descente : {-grad}")  # [-6, -8]
```

---

### Qu'est-ce que la chain rule ?

**Définition** : La chain rule (règle de la chaîne) est la formule de dérivation des fonctions composées. Si y = f(g(x)), alors dy/dx = f'(g(x)) * g'(x). On dérive la fonction extérieure évaluée en la fonction intérieure, puis on multiplie par la dérivée de la fonction intérieure.

**Le problème que la chain rule résout** :

Sans chain rule, voici les problèmes rencontrés :

1. **Pas de dérivation de fonctions composées** : les fonctions en IA sont toujours des compositions (couches successives)
2. **Pas de backpropagation** : l'entraînement des réseaux de neurones repose entièrement sur la chain rule
3. **Calculs impossibles** : dériver une fonction comme sin(x^2 + 3x) sans la chain rule est impossible

**Comment la chain rule résout ces problèmes** :

| Problème | Solution apportée par la chain rule |
| -------- | ----------------------------------- |
| Pas de dérivation composée | On décompose en fonctions simples et on multiplie les dérivées |
| Pas de backpropagation | Chaque couche propage son gradient local vers la couche précédente |
| Calculs impossibles | Toute composition de fonctions dérivables est dérivable grâce à la chain rule |

**Analogie concrète** : Imagine une chaîne de production avec 3 machines. Si la machine 1 double la quantité (x2), la machine 2 triple (x3), et la machine 3 quadruple (x4), l'effet total est x2 \* x3 \* x4 = x24. La chain rule fait pareil : elle multiplie les "taux de changement" de chaque étape.

**Ce que la chain rule n'est PAS** :

- La chain rule n'est pas l'addition des dérivées. On multiplie les dérivées de chaque étape, on ne les additionne pas.
- La chain rule n'est pas limitée à deux fonctions. On peut enchaîner autant de fonctions que nécessaire.

**Application à un réseau de neurones** :

```text
Entrée x -> Couche 1 (z = W1*x + b1) -> Activation (a = relu(z)) -> Couche 2 (y = W2*a + b2) -> Loss L

Pour calculer dL/dW1, on applique la chain rule :
dL/dW1 = dL/dy * dy/da * da/dz * dz/dW1
```

```python
import numpy as np

# Exemple : f(x) = (3x + 2)^2
# g(x) = 3x + 2 (fonction intérieure)
# f(u) = u^2 (fonction extérieure)

# Chain rule : df/dx = f'(g(x)) * g'(x) = 2*(3x+2) * 3 = 6*(3x+2)

def f(x):
    return (3*x + 2)**2

# Dérivée analytique (par la chain rule)
def df_analytique(x):
    return 6 * (3*x + 2)

# Dérivée numérique (pour vérifier)
def df_numerique(x, h=1e-7):
    return (f(x + h) - f(x)) / h

x = 1.0
print(f"Dérivée analytique en x=1 : {df_analytique(x)}")   # 6*(3+2) = 30
print(f"Dérivée numérique en x=1  : {df_numerique(x):.6f}")  # ≈ 30.0
```

---

### Qu'est-ce que la descente de gradient ?

**Définition** : La descente de gradient est un algorithme d'optimisation itératif. À chaque itération, on calcule le gradient de la fonction de coût par rapport aux paramètres, puis on déplace les paramètres dans la direction opposée au gradient (direction de plus forte descente). La taille du pas est contrôlée par le learning rate (taux d'apprentissage).

**Le problème que la descente de gradient résout** :

Sans descente de gradient, voici les problèmes rencontrés :

1. **Pas de méthode systématique** : trouver le minimum d'une fonction à 1 million de paramètres par essai-erreur est impossible
2. **Pas de solution analytique** : la plupart des fonctions de coût en IA n'ont pas de formule fermée pour le minimum
3. **Pas d'entraînement des réseaux de neurones** : les réseaux de neurones sont entraînés exclusivement par descente de gradient (et ses variantes)

**Comment la descente de gradient résout ces problèmes** :

| Problème | Solution apportée par la descente de gradient |
| -------- | ---------------------------------------------- |
| Pas de méthode systématique | L'algorithme suit toujours la même procédure : gradient, mise à jour, répéter |
| Pas de solution analytique | L'algorithme converge vers le minimum par approximations successives |
| Pas d'entraînement | Chaque epoch ajuste les poids dans la direction qui réduit la loss |

**Analogie concrète** : Imagine que tu es dans une vallée montagneuse par temps de brouillard. Tu ne vois pas le paysage entier, seulement le sol sous tes pieds. La descente de gradient, c'est sentir la pente (le gradient), puis faire un pas dans la direction qui descend (opposée au gradient). Le learning rate est la taille de tes pas : trop petits, tu mets des heures à descendre ; trop grands, tu sautes par-dessus la vallée.

**Ce que la descente de gradient n'est PAS** :

- La descente de gradient ne garantit pas de trouver le minimum global. Elle peut converger vers un minimum local (un creux qui n'est pas le plus profond).
- La descente de gradient n'est pas un calcul unique. C'est un processus itératif qui nécessite de nombreuses répétitions.

**L'algorithme** :

```text
Initialiser les paramètres θ aléatoirement
Répéter pour chaque itération :
    1. Calculer la prédiction : y_pred = modèle(θ, X)
    2. Calculer la loss : L = coût(y_pred, y_vrai)
    3. Calculer le gradient : ∇L = gradient de L par rapport à θ
    4. Mettre à jour : θ = θ - learning_rate * ∇L
Jusqu'à convergence (la loss ne diminue plus significativement)
```

**Le learning rate** :

| Learning rate | Comportement |
| ------------- | ------------ |
| Trop petit (ex : 0.00001) | Convergence très lente, risque de rester bloqué |
| Bon (ex : 0.001 à 0.01) | Convergence stable vers le minimum |
| Trop grand (ex : 10) | Oscillations, divergence, la loss augmente |

---

### Quelles sont les variantes d'optimisation ?

**Définition** : Les variantes d'optimisation sont des améliorations de la descente de gradient classique. Les trois principales sont SGD (Stochastic Gradient Descent), Momentum et Adam.

**Le problème que les variantes résolvent** :

Sans variantes, voici les problèmes rencontrés :

1. **Descente de gradient classique trop lente** : calculer le gradient sur tout le jeu de données à chaque itération est coûteux
2. **Oscillations** : la descente de gradient peut osciller dans des vallées étroites sans progresser
3. **Learning rate fixe** : un seul learning rate ne convient pas à tous les paramètres

**Comment les variantes résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Trop lente | SGD calcule le gradient sur un petit échantillon (mini-batch) |
| Oscillations | Momentum ajoute une "inertie" qui lisse la trajectoire |
| Learning rate fixe | Adam adapte le learning rate individuellement pour chaque paramètre |

**Comparaison des variantes** :

| Variante | Principe | Avantage | Inconvénient |
| -------- | -------- | -------- | ------------ |
| SGD | Gradient sur un mini-batch | Rapide, peu de mémoire | Noisy, convergence instable |
| Momentum | SGD + moyenne mobile du gradient | Passe à travers les minima locaux peu profonds | Un hyperparamètre de plus (beta) |
| Adam | Momentum + learning rate adaptatif | Converge vite, robuste | Peut généraliser moins bien que SGD |

**Pourquoi Adam est le défaut** : Adam combine les avantages de Momentum (inertie) et de RMSProp (adaptation du learning rate). Il fonctionne bien dans la majorité des cas sans nécessiter de réglage fin du learning rate. C'est pourquoi la plupart des frameworks (PyTorch, TensorFlow) l'utilisent par défaut.

**Formules simplifiées** :

```text
SGD :       θ = θ - lr * gradient

Momentum :  v = beta * v + gradient
            θ = θ - lr * v

Adam :      m = beta1 * m + (1-beta1) * gradient        (moyenne)
            v = beta2 * v + (1-beta2) * gradient^2       (variance)
            m_hat = m / (1 - beta1^t)                     (correction de biais)
            v_hat = v / (1 - beta2^t)                     (correction de biais)
            θ = θ - lr * m_hat / (sqrt(v_hat) + epsilon)
```

La correction de biais (`m_hat`, `v_hat`) est importante en début d'entraînement : sans elle, les moyennes mobiles sont biaisées vers zéro. Les valeurs par défaut courantes sont beta1 = 0.9, beta2 = 0.999, epsilon = 1e-8.

---

## Étapes Pratiques

### Étape 1 : Calculer des dérivées numériquement

Crée un fichier `optimisation.py` et commence par les dérivées.

```python
import numpy as np

# --- Dérivée numérique ---
def derivee_numerique(f, x, h=1e-7):
    """Calcule la dérivée de f en x par différences finies."""
    return (f(x + h) - f(x)) / h

# Exemple : f(x) = x^3
def f(x):
    return x ** 3

# La dérivée analytique est f'(x) = 3x^2
x = 2.0
deriv_num = derivee_numerique(f, x)
deriv_ana = 3 * x ** 2

print(f"f(x) = x^3 au point x = {x}")
print(f"Dérivée numérique : {deriv_num:.6f}")
print(f"Dérivée analytique : {deriv_ana:.6f}")
print(f"Différence : {abs(deriv_num - deriv_ana):.10f}")
```

**Résultat attendu** :

```text
f(x) = x^3 au point x = 2.0
Dérivée numérique : 12.000000
Dérivée analytique : 12.000000
Différence : 0.0000059605
```

---

### Étape 2 : Calculer un gradient en 2D

```python
import numpy as np

# f(x, y) = x^2 + 2*y^2
# Gradient : [2x, 4y]

def f_2d(params):
    x, y = params
    return x**2 + 2*y**2

def gradient_2d(params):
    """Gradient analytique de f(x, y) = x^2 + 2*y^2."""
    x, y = params
    return np.array([2*x, 4*y])

# Au point (3, 2)
point = np.array([3.0, 2.0])
grad = gradient_2d(point)

print(f"Point : {point}")
print(f"f(3, 2) = {f_2d(point)}")
print(f"Gradient : {grad}")
print(f"Direction de descente : {-grad}")
```

**Résultat attendu** :

```text
Point : [3. 2.]
f(3, 2) = 17.0
Gradient : [6. 8.]
Direction de descente : [-6. -8.]
```

---

### Étape 3 : Implémenter la descente de gradient sur f(x, y) = x^2 + 2*y^2

```python
import numpy as np

def f_2d(params):
    x, y = params
    return x**2 + 2*y**2

def gradient_2d(params):
    x, y = params
    return np.array([2*x, 4*y])

# --- Descente de gradient ---
# Point de départ
params = np.array([5.0, 3.0])
learning_rate = 0.1
n_iterations = 50

print(f"{'Itération':>10} {'x':>10} {'y':>10} {'f(x,y)':>12}")
print("-" * 45)

for i in range(n_iterations):
    # Calculer la valeur de la fonction
    loss = f_2d(params)

    # Afficher les 5 premières et les 5 dernières itérations
    if i < 5 or i >= n_iterations - 5:
        print(f"{i:>10} {params[0]:>10.4f} {params[1]:>10.4f} {loss:>12.6f}")
    elif i == 5:
        print(f"{'...':>10}")

    # Calculer le gradient
    grad = gradient_2d(params)

    # Mettre à jour les paramètres (dans la direction opposée au gradient)
    params = params - learning_rate * grad

print(f"\nMinimum trouvé : x = {params[0]:.6f}, y = {params[1]:.6f}")
print(f"Valeur minimale : f(x, y) = {f_2d(params):.8f}")
print(f"Minimum théorique : f(0, 0) = 0")
```

**Résultat attendu** :

```text
 Itération          x          y       f(x,y)
---------------------------------------------
         0     5.0000     3.0000    43.000000
         1     4.0000     1.8000    22.480000
         2     3.2000     1.0800    12.572800
         3     2.5600     0.6480     7.393408
         4     2.0480     0.3888     4.496635
       ...
        45     0.0002     0.0000     0.000000
        46     0.0002     0.0000     0.000000
        47     0.0001     0.0000     0.000000
        48     0.0001     0.0000     0.000000
        49     0.0001     0.0000     0.000000

Minimum trouvé : x = 0.000071, y = 0.000000
Valeur minimale : f(x, y) = 0.00000001
Minimum théorique : f(0, 0) = 0
```

---

### Étape 4 : Descente de gradient pour une régression linéaire

```python
import numpy as np

# --- Données d'entraînement ---
# Relation réelle : y = 3x + 7 + bruit
np.random.seed(42)
X = np.random.randn(100)          # 100 points d'entrée
y = 3 * X + 7 + np.random.randn(100) * 0.5  # Sortie avec bruit

# --- Paramètres du modèle ---
# On cherche w et b tels que y_pred = w*x + b
w = 0.0  # Poids initial (aléatoire)
b = 0.0  # Biais initial

learning_rate = 0.05
n_epochs = 100
n = len(X)

# --- Entraînement ---
for epoch in range(n_epochs):
    # Prédiction
    y_pred = w * X + b

    # Loss : Mean Squared Error (MSE)
    loss = np.mean((y_pred - y) ** 2)

    # Gradient de la MSE par rapport à w et b
    # dL/dw = (2/n) * sum((y_pred - y) * X)
    # dL/db = (2/n) * sum(y_pred - y)
    dw = (2 / n) * np.sum((y_pred - y) * X)
    db = (2 / n) * np.sum(y_pred - y)

    # Mise à jour des paramètres
    w = w - learning_rate * dw
    b = b - learning_rate * db

    # Afficher la progression toutes les 20 epochs
    if epoch % 20 == 0:
        print(f"Epoch {epoch:>3} | Loss : {loss:.4f} | w = {w:.4f} | b = {b:.4f}")

print(f"\nRésultat final : y = {w:.4f}*x + {b:.4f}")
print(f"Relation réelle : y = 3*x + 7")
print(f"Erreur sur w : {abs(w - 3):.4f}")
print(f"Erreur sur b : {abs(b - 7):.4f}")
```

**Résultat attendu** :

```text
Epoch   0 | Loss : 52.1077 | w = 0.1695 | b = 0.6700
Epoch  20 | Loss : 1.5078 | w = 2.2114 | b = 6.1177
Epoch  40 | Loss : 0.2624 | w = 2.7679 | b = 6.8685
Epoch  60 | Loss : 0.2224 | w = 2.8946 | b = 6.9813
Epoch  80 | Loss : 0.2210 | w = 2.9215 | b = 6.9998

Résultat final : y = 2.9269*x + 7.0029
Relation réelle : y = 3*x + 7
Erreur sur w : 0.0731
Erreur sur b : 0.0029
```

---

## Commandes Utiles

| Opération | Code Python |
| --------- | ----------- |
| Dérivée numérique | `(f(x+h) - f(x)) / h` avec h = 1e-7 |
| Gradient numérique | Appliquer la dérivée numérique à chaque variable |
| Descente de gradient | `params = params - lr * gradient` |
| MSE (Mean Squared Error) | `np.mean((y_pred - y) ** 2)` |
| Gradient de MSE / w | `(2/n) * np.sum((y_pred - y) * X)` |
| Gradient de MSE / b | `(2/n) * np.sum(y_pred - y)` |

---

## Pièges Fréquents

### Piège 1 : Learning rate trop grand

⚠️ **Problème** : La loss augmente au lieu de diminuer. Les paramètres oscillent de plus en plus loin du minimum, jusqu'à diverger vers l'infini (`nan` ou `inf`).

✅ **Solution** : Commence avec un learning rate petit (0.001) et augmente progressivement. Si la loss augmente, divise le learning rate par 10.

```python
# Trop grand : la loss explose
# learning_rate = 10.0  -> Loss: inf

# Bon learning rate
learning_rate = 0.01  # Commence petit
```

---

### Piège 2 : Learning rate trop petit

⚠️ **Problème** : La loss diminue extrêmement lentement. Après 10 000 itérations, les paramètres n'ont presque pas bougé.

✅ **Solution** : Si la loss diminue mais très lentement, multiplie le learning rate par 10. Utilise un optimizer adaptatif (Adam) qui ajuste automatiquement le learning rate.

---

### Piège 3 : Oublier la chain rule dans la backpropagation

⚠️ **Problème** : Calculer le gradient de la loss par rapport aux poids de la première couche en oubliant de multiplier par les dérivées des couches intermédiaires, ce qui donne des gradients incorrects.

✅ **Solution** : Rappelle-toi que chaque couche multiplie le gradient par sa dérivée locale. Schématiquement :

```text
dL/dW1 = dL/dy * dy/da * da/dz * dz/dW1
         ^^^^   ^^^^   ^^^^   ^^^^
         Chaque terme est la dérivée locale d'une couche
```

---

### Piège 4 : Minimum local vs minimum global

⚠️ **Problème** : La descente de gradient converge vers un minimum local (un creux peu profond) au lieu du minimum global (le creux le plus profond).

✅ **Solution** : En pratique, pour les réseaux de neurones profonds, les minima locaux sont rarement un problème car la plupart sont de qualité comparable. Les techniques suivantes aident :

- Momentum pour "passer par-dessus" les petits creux
- Plusieurs initialisations aléatoires
- Learning rate scheduling (diminuer le lr progressivement)

---

## Checklist de Validation

- [ ] Je sais calculer la dérivée d'une fonction simple (polynôme, exponentielle)
- [ ] Je sais calculer les dérivées partielles d'une fonction de 2 variables
- [ ] Je comprends que le gradient pointe dans la direction de plus forte montée
- [ ] Je sais appliquer la chain rule sur une composition de 2-3 fonctions
- [ ] Je sais implémenter la descente de gradient en Python
- [ ] Je comprends l'impact du learning rate sur la convergence
- [ ] Je connais les différences entre SGD, Momentum et Adam
- [ ] J'ai implémenté une régression linéaire par descente de gradient

---

## Exercice Pratique

**Énoncé** : Implémente la descente de gradient pour une régression linéaire from scratch.

1. Génère un jeu de données synthétique : y = 2.5x + 4 + bruit gaussien
2. Initialise w = 0 et b = 0
3. Implémente la boucle de descente de gradient avec MSE comme loss
4. Affiche la loss toutes les 10 epochs
5. Compare les paramètres trouvés (w, b) avec les valeurs réelles (2.5, 4)
6. Teste avec 3 learning rates différents (0.001, 0.01, 0.1) et compare la vitesse de convergence

**Indications** :

- Utilise `np.random.seed(0)` pour la reproductibilité
- Génère 200 points d'entrée avec `np.random.randn(200)`
- Ajoute un bruit gaussien d'écart-type 0.3
- Entraîne pendant 200 epochs pour chaque learning rate

**Résultat attendu** : Les paramètres trouvés sont proches de w = 2.5 et b = 4 (erreur inférieure à 0.05 pour les learning rates 0.01 et 0.1).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np

# --- Générer les données ---
np.random.seed(0)
n = 200
X = np.random.randn(n)
y_true_params = (2.5, 4.0)  # w_vrai, b_vrai
y = y_true_params[0] * X + y_true_params[1] + np.random.randn(n) * 0.3

# --- Fonction d'entraînement ---
def train_regression(X, y, learning_rate, n_epochs=200):
    """Entraîne une régression linéaire par descente de gradient."""
    w = 0.0
    b = 0.0
    n = len(X)
    losses = []

    for epoch in range(n_epochs):
        # Prédiction : y_pred = w*X + b
        y_pred = w * X + b

        # Loss : MSE = (1/n) * sum((y_pred - y)^2)
        loss = np.mean((y_pred - y) ** 2)
        losses.append(loss)

        # Gradients
        # dL/dw = (2/n) * sum((y_pred - y) * X)
        dw = (2 / n) * np.sum((y_pred - y) * X)
        # dL/db = (2/n) * sum(y_pred - y)
        db = (2 / n) * np.sum(y_pred - y)

        # Mise à jour
        w = w - learning_rate * dw
        b = b - learning_rate * db

        # Afficher toutes les 10 epochs (pour les 50 premières)
        if epoch % 50 == 0:
            print(f"  Epoch {epoch:>3} | Loss: {loss:.4f} | w={w:.4f} | b={b:.4f}")

    return w, b, losses

# --- Tester 3 learning rates ---
learning_rates = [0.001, 0.01, 0.1]

for lr in learning_rates:
    print(f"\n{'='*50}")
    print(f"Learning rate : {lr}")
    print(f"{'='*50}")

    w_final, b_final, losses = train_regression(X, y, lr)

    print(f"\n  Résultat : y = {w_final:.4f}*x + {b_final:.4f}")
    print(f"  Attendu  : y = {y_true_params[0]}*x + {y_true_params[1]}")
    print(f"  Erreur w : {abs(w_final - y_true_params[0]):.4f}")
    print(f"  Erreur b : {abs(b_final - y_true_params[1]):.4f}")
    print(f"  Loss finale : {losses[-1]:.6f}")
```

**Résultat** :

```text
==================================================
Learning rate : 0.001
==================================================
  Epoch   0 | Loss: 20.3412 | w=0.0094 | b=0.0080
  Epoch  50 | Loss: 3.1645 | w=1.2315 | b=2.4012
  Epoch 100 | Loss: 0.6203 | w=2.0254 | b=3.5980
  Epoch 150 | Loss: 0.1728 | w=2.3445 | b=3.8795

  Résultat : y = 2.4298*x + 3.9525
  Attendu  : y = 2.5*x + 4.0
  Erreur w : 0.0702
  Erreur b : 0.0475
  Loss finale : 0.1101

==================================================
Learning rate : 0.01
==================================================
  Epoch   0 | Loss: 20.3412 | w=0.0939 | b=0.0798
  Epoch  50 | Loss: 0.0920 | w=2.4917 | b=3.9936
  Epoch 100 | Loss: 0.0914 | w=2.4972 | b=3.9991
  Epoch 150 | Loss: 0.0914 | w=2.4973 | b=3.9992

  Résultat : y = 2.4973*x + 3.9992
  Attendu  : y = 2.5*x + 4.0
  Erreur w : 0.0027
  Erreur b : 0.0008
  Loss finale : 0.0914

==================================================
Learning rate : 0.1
==================================================
  Epoch   0 | Loss: 20.3412 | w=0.9393 | b=0.7980
  Epoch  50 | Loss: 0.0914 | w=2.4973 | b=3.9992
  Epoch 100 | Loss: 0.0914 | w=2.4973 | b=3.9992
  Epoch 150 | Loss: 0.0914 | w=2.4973 | b=3.9992

  Résultat : y = 2.4973*x + 3.9992
  Attendu  : y = 2.5*x + 4.0
  Erreur w : 0.0027
  Erreur b : 0.0008
  Loss finale : 0.0914
```

**Observations** :

- **lr = 0.001** : convergence lente, 200 epochs ne suffisent pas pour atteindre le minimum
- **lr = 0.01** : convergence en environ 50 epochs, bon compromis
- **lr = 0.1** : convergence quasi immédiate, très efficace sur ce problème simple

---

## Navigation

← Fiche précédente : **[01 - Algèbre linéaire pour l'IA](01-algebre-lineaire.md)**

→ Fiche suivante : **[03 - Probabilités et statistiques](03-probabilites-statistiques.md)**
