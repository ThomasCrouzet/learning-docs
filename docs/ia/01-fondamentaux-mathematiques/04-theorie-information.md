---
tags:
  - IA
  - Intermédiaire
  - Concept
description: "Théorie de l'information : entropie de Shannon, cross-entropy, divergence KL et information mutuelle pour le machine learning"
estimated_time: "55 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 1 - Fondamentaux mathématiques"
---

# 04 - Théorie de l'information

> **En bref** : À la fin de cette fiche, tu sauras comprendre l'entropie de Shannon, la cross-entropy, la divergence de Kullback-Leibler et l'information mutuelle, et tu sauras expliquer leur rôle dans les fonctions de perte en machine learning. Lecture estimée : 55 min.


## Prérequis

- Fiche **[03 - Probabilités et statistiques](03-probabilites-statistiques.md)** (distributions, théorème de Bayes, MLE)
- Python 3, NumPy et Matplotlib installés

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comprendre l'entropie de Shannon, la cross-entropy, la divergence de Kullback-Leibler et l'information mutuelle, et tu sauras expliquer leur rôle dans les fonctions de perte en machine learning.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'entropie de Shannon ?

**Définition** : L'entropie de Shannon mesure la quantité d'incertitude (ou d'information) contenue dans une variable aléatoire. Plus les événements sont imprévisibles, plus l'entropie est élevée. Pour une variable discrète avec des probabilités p1, p2, ..., pk, l'entropie est H = -somme(pi * log2(pi)).

**Formule** :

```text
H(X) = -somme(i=1 à k) P(xi) * log2(P(xi))
```

Conventions : 0 * log(0) = 0 (par continuité).

**Le problème que l'entropie résout** :

Sans entropie, voici les problèmes rencontrés :

1. **Pas de mesure d'incertitude** : impossible de quantifier si un résultat est prévisible ou surprenant
2. **Pas de limite de compression** : impossible de savoir combien de bits sont nécessaires au minimum pour encoder un message
3. **Pas de critère de pureté** : dans un arbre de décision, impossible de mesurer si un nœud est "pur" (contient une seule classe) ou "mélangé"

**Comment l'entropie résout ces problèmes** :

| Problème | Solution apportée par l'entropie |
| -------- | -------------------------------- |
| Pas de mesure d'incertitude | H = 0 signifie certitude totale, H = log2(k) signifie incertitude maximale (k classes équiprobables) |
| Pas de limite de compression | L'entropie donne le nombre minimal de bits par symbole pour encoder sans perte |
| Pas de critère de pureté | Les arbres de décision utilisent l'entropie pour choisir le meilleur attribut de split |

**Analogie concrète** : L'entropie mesure la "surprise moyenne" d'une source d'information. Si tu vis dans un désert où il fait beau 365 jours par an, la météo a une entropie proche de 0 (aucune surprise). Si tu vis dans une région où il pleut, neige, vente ou fait beau de manière imprévisible, la météo a une entropie élevée (beaucoup de surprise).

**Ce que l'entropie n'est PAS** :

- L'entropie en théorie de l'information n'est pas l'entropie en thermodynamique. Bien que le concept soit similaire (mesure du désordre), les formules et les contextes sont différents.
- L'entropie n'est pas une mesure d'erreur. L'entropie mesure l'incertitude d'une distribution, pas l'écart entre une prédiction et la réalité.

**Exemples de valeurs d'entropie** :

| Distribution | Entropie (bits) | Interprétation |
| ------------ | --------------- | -------------- |
| Pièce truquée : P(face) = 1.0 | 0 | Aucune incertitude |
| Pièce équilibrée : P(face) = 0.5 | 1.0 | 1 bit d'incertitude |
| Dé équilibré : chaque face = 1/6 | 2.585 | ~2.6 bits d'incertitude |
| Pièce légèrement biaisée : P(face) = 0.9 | 0.469 | Peu d'incertitude |

```python
import numpy as np

def entropie(probs):
    """Calcule l'entropie de Shannon en bits."""
    # Filtrer les probabilités nulles (0 * log(0) = 0 par convention)
    probs = np.array(probs)
    probs = probs[probs > 0]
    return -np.sum(probs * np.log2(probs))

# Pièce équilibrée
print(f"Pièce équilibrée : H = {entropie([0.5, 0.5]):.4f} bits")  # 1.0

# Pièce truquée (toujours face)
print(f"Pièce truquée    : H = {entropie([1.0, 0.0]):.4f} bits")  # 0.0

# Dé équilibré (6 faces)
print(f"Dé équilibré     : H = {entropie([1/6]*6):.4f} bits")  # 2.585

# Pièce biaisée (90% face)
print(f"Pièce biaisée    : H = {entropie([0.9, 0.1]):.4f} bits")  # 0.469
```

---

### Qu'est-ce que la cross-entropy ?

**Définition** : La cross-entropy mesure la "distance" entre deux distributions de probabilité p (la distribution réelle) et q (la distribution prédite). Elle quantifie le nombre moyen de bits nécessaires pour encoder des données de p en utilisant le code optimisé pour q.

**Formule** :

```text
H(p, q) = -somme(i=1 à k) p(xi) * log(q(xi))
```

**Le problème que la cross-entropy résout** :

Sans cross-entropy, voici les problèmes rencontrés :

1. **Pas de mesure de qualité des prédictions** : comment savoir si les probabilités prédites par un modèle sont bonnes ?
2. **Pas de gradient utile pour l'entraînement** : la MSE appliquée à des probabilités donne des gradients faibles quand le modèle est très confiant et très faux
3. **Pas de lien avec la théorie de l'information** : impossible de justifier pourquoi telle ou telle loss est optimale

**Comment la cross-entropy résout ces problèmes** :

| Problème | Solution apportée par la cross-entropy |
| -------- | -------------------------------------- |
| Pas de mesure de qualité | La cross-entropy est minimale (= entropie) quand q = p |
| Pas de gradient utile | La cross-entropy pénalise fortement les prédictions confiantes et fausses |
| Pas de lien théorique | Minimiser la cross-entropy est équivalent à maximiser la vraisemblance (MLE) |

**Analogie concrète** : Imagine que tu conçois un code de compression pour un journal en français. Si ton code est optimisé pour le français (les lettres fréquentes comme 'e' et 'a' ont des codes courts), la compression est efficace. Si tu utilises un code optimisé pour le japonais (mauvaise distribution q), tu gaspilles des bits. La cross-entropy mesure ce gaspillage.

**Ce que la cross-entropy n'est PAS** :

- La cross-entropy n'est pas symétrique. H(p, q) est différent de H(q, p).
- La cross-entropy n'est pas une distance au sens mathématique. Elle ne satisfait pas la symétrie ni l'inégalité triangulaire.

**Relation avec l'entropie** :

```text
H(p, q) = H(p) + D_KL(p || q)
```

La cross-entropy est toujours supérieure ou égale à l'entropie. L'écart est la divergence KL.

**Utilisation comme fonction de perte** :

En classification, la cross-entropy est la loss standard. Pour un exemple avec la vraie classe c et des probabilités prédites q :

```text
Binary cross-entropy :    L = -[y * log(q) + (1-y) * log(1-q)]
Categorical cross-entropy : L = -somme(c) y_c * log(q_c)
```

```python
import numpy as np

def cross_entropy(p, q):
    """Cross-entropy entre p (vraie distribution) et q (prédiction)."""
    p = np.array(p)
    q = np.array(q, dtype=np.float64)
    # Clipping pour éviter log(0)
    q = np.clip(q, 1e-15, 1 - 1e-15)
    return -np.sum(p * np.log(q))

# Distribution réelle : la classe 0 est la bonne réponse
p = [1, 0, 0]  # One-hot : classe 0

# Bonne prédiction : le modèle est confiant et correct
q_bonne = [0.9, 0.05, 0.05]
print(f"Bonne prédiction : CE = {cross_entropy(p, q_bonne):.4f}")  # Faible

# Mauvaise prédiction : le modèle est confiant mais faux
q_mauvaise = [0.1, 0.8, 0.1]
print(f"Mauvaise prédiction : CE = {cross_entropy(p, q_mauvaise):.4f}")  # Élevée

# Prédiction uniforme : le modèle ne sait pas
q_uniforme = [0.33, 0.33, 0.34]
print(f"Prédiction uniforme : CE = {cross_entropy(p, q_uniforme):.4f}")  # Moyenne
```

---

### Qu'est-ce que la divergence de Kullback-Leibler (KL) ?

**Définition** : La divergence KL mesure à quel point une distribution de probabilité q diffère d'une distribution de référence p. Elle quantifie la "perte d'information" quand on utilise q pour approximer p. D_KL(p || q) = somme(p(x) * log(p(x) / q(x))).

**Formule** :

```text
D_KL(p || q) = somme(i) p(xi) * log(p(xi) / q(xi))
             = H(p, q) - H(p)
```

**Le problème que la divergence KL résout** :

Sans divergence KL, voici les problèmes rencontrés :

1. **Pas de mesure de divergence entre distributions** : impossible de quantifier à quel point deux distributions diffèrent
2. **Pas de régularisation pour les VAE** : les Variational Autoencoders nécessitent une mesure de distance entre la distribution latente apprise et une gaussienne standard
3. **Pas de distillation de modèle** : impossible de mesurer si un petit modèle (étudiant) imite bien un grand modèle (professeur)

**Comment la divergence KL résout ces problèmes** :

| Problème | Solution apportée par la KL |
| -------- | --------------------------- |
| Pas de mesure de divergence | D_KL = 0 si et seulement si p = q (distributions identiques) |
| Pas de régularisation VAE | La loss VAE = reconstruction + beta * D_KL(q(z\|x) \|\| p(z)) |
| Pas de distillation | On minimise D_KL(prof \|\| élève) pour aligner les distributions |

**Analogie concrète** : Imagine deux cartes routières du même territoire. La divergence KL mesure combien d'erreurs de navigation tu ferais en utilisant la carte q (approximation) au lieu de la carte p (réalité). Si les deux cartes sont identiques, KL = 0. Plus q est différente de p, plus tu te perds.

**Ce que la divergence KL n'est PAS** :

- La divergence KL n'est pas symétrique. D_KL(p || q) est différent de D_KL(q || p). On dit "KL de p par rapport à q".
- La divergence KL n'est pas une distance. Elle ne satisfait pas la symétrie ni l'inégalité triangulaire.

**Propriété clé : l'asymétrie** :

| D_KL(p \|\| q) (forward KL) | D_KL(q \|\| p) (reverse KL) |
| ---------------------------- | ---------------------------- |
| Pénalise quand q est 0 et p est non-nul | Pénalise quand p est 0 et q est non-nul |
| q couvre tout le support de p (mean-seeking) | q se concentre sur les modes de p (mode-seeking) |
| Utilisée pour l'inférence variationnelle | Utilisée pour la distillation de modèle |

```python
import numpy as np

def kl_divergence(p, q):
    """Divergence KL de p par rapport à q."""
    p = np.array(p, dtype=np.float64)
    q = np.array(q, dtype=np.float64)
    # Filtrer les cas où p = 0 (0 * log(0/q) = 0)
    mask = p > 0
    return np.sum(p[mask] * np.log(p[mask] / q[mask]))

# Distribution de référence
p = [0.4, 0.3, 0.2, 0.1]

# Distribution identique
q_identique = [0.4, 0.3, 0.2, 0.1]
print(f"KL(p || p) = {kl_divergence(p, q_identique):.6f}")  # 0.0

# Distribution légèrement différente
q_proche = [0.35, 0.35, 0.2, 0.1]
print(f"KL(p || q_proche) = {kl_divergence(p, q_proche):.6f}")  # Petit

# Distribution très différente
q_loin = [0.1, 0.1, 0.1, 0.7]
print(f"KL(p || q_loin) = {kl_divergence(p, q_loin):.6f}")  # Grand

# Démontrer l'asymétrie
print(f"\nAsymétrie :")
print(f"KL(p || q_proche) = {kl_divergence(p, q_proche):.6f}")
print(f"KL(q_proche || p) = {kl_divergence(q_proche, p):.6f}")
```

---

### Qu'est-ce que l'information mutuelle ?

**Définition** : L'information mutuelle I(X; Y) mesure la quantité d'information que X et Y partagent. Elle quantifie à quel point connaître X réduit l'incertitude sur Y (et inversement). I(X; Y) = H(X) + H(Y) - H(X, Y) = D_KL(P(X,Y) || P(X)*P(Y)).

**Formule** :

```text
I(X; Y) = somme(x, y) P(x, y) * log(P(x, y) / (P(x) * P(y)))
```

**Le problème que l'information mutuelle résout** :

Sans information mutuelle, voici les problèmes rencontrés :

1. **La corrélation ne capture que les relations linéaires** : deux variables peuvent être fortement dépendantes avec une corrélation nulle (ex : Y = X^2)
2. **Pas de sélection de features optimale** : impossible de savoir quelles caractéristiques sont les plus informatives pour prédire la cible
3. **Pas de mesure d'indépendance** : impossible de vérifier si deux variables sont vraiment indépendantes

**Comment l'information mutuelle résout ces problèmes** :

| Problème | Solution apportée par l'information mutuelle |
| -------- | --------------------------------------------- |
| Corrélation limitée | L'information mutuelle capture toutes les dépendances (linéaires et non-linéaires) |
| Pas de sélection de features | On sélectionne les features avec la plus grande information mutuelle avec la cible |
| Pas de mesure d'indépendance | I(X; Y) = 0 si et seulement si X et Y sont indépendants |

**Analogie concrète** : Imagine deux fichiers informatiques. L'information mutuelle mesure le nombre d'octets en commun. Si les fichiers sont identiques, I(X; Y) = H(X) (toute l'information est partagée). Si les fichiers sont totalement différents (indépendants), I(X; Y) = 0. Si un fichier est une version compressée de l'autre, l'information mutuelle est élevée.

**Ce que l'information mutuelle n'est PAS** :

- L'information mutuelle n'est pas la corrélation. La corrélation mesure les relations linéaires. L'information mutuelle mesure toutes les dépendances.
- L'information mutuelle n'est pas directionnelle. I(X; Y) = I(Y; X), contrairement à la KL divergence.

**Comparaison corrélation vs information mutuelle** :

| Corrélation | Information mutuelle |
| ----------- | -------------------- |
| Mesure les relations linéaires | Mesure toutes les dépendances |
| Valeurs entre -1 et 1 | Valeurs >= 0 (pas de borne supérieure fixe) |
| 0 ne signifie pas indépendance | 0 signifie indépendance |
| Rapide à calculer | Plus coûteuse à estimer |

```python
import numpy as np

def information_mutuelle(X, Y, bins=20):
    """Estime l'information mutuelle par histogramme 2D."""
    # Histogramme joint P(X, Y)
    hist_joint, x_edges, y_edges = np.histogram2d(X, Y, bins=bins)
    p_joint = hist_joint / hist_joint.sum()

    # Distributions marginales
    p_x = p_joint.sum(axis=1)  # P(X)
    p_y = p_joint.sum(axis=0)  # P(Y)

    # Information mutuelle
    mi = 0.0
    for i in range(bins):
        for j in range(bins):
            if p_joint[i, j] > 0 and p_x[i] > 0 and p_y[j] > 0:
                mi += p_joint[i, j] * np.log2(p_joint[i, j] / (p_x[i] * p_y[j]))
    return mi

np.random.seed(42)
n = 10000

# Variables indépendantes
X1 = np.random.randn(n)
Y1 = np.random.randn(n)
print(f"Variables indépendantes : I(X, Y) = {information_mutuelle(X1, Y1):.4f} bits")

# Variables liées linéairement
X2 = np.random.randn(n)
Y2 = 2 * X2 + np.random.randn(n) * 0.1  # Y ≈ 2X
print(f"Relation linéaire (Y=2X) : I(X, Y) = {information_mutuelle(X2, Y2):.4f} bits")

# Variables liées non-linéairement
X3 = np.random.randn(n)
Y3 = X3 ** 2 + np.random.randn(n) * 0.1  # Y ≈ X^2
corr = np.corrcoef(X3, Y3)[0, 1]
mi = information_mutuelle(X3, Y3)
print(f"Relation non-linéaire (Y=X^2) : corrélation = {corr:.4f}, I(X, Y) = {mi:.4f} bits")
print(f"  -> La corrélation rate la dépendance, l'information mutuelle la détecte")
```

---

## Étapes Pratiques

### Étape 1 : Calculer l'entropie de textes

Crée un fichier `theorie_info.py`.

```python
import numpy as np
from collections import Counter

def entropie_texte(texte):
    """Calcule l'entropie de Shannon d'un texte (par caractère)."""
    # Compter la fréquence de chaque caractère
    compteur = Counter(texte.lower())
    total = sum(compteur.values())

    # Calculer les probabilités
    probs = np.array([count / total for count in compteur.values()])

    # Entropie
    return -np.sum(probs * np.log2(probs))

# Texte en français (varié)
texte_fr = "le petit chat est assis sur le tapis du salon et regarde les oiseaux"

# Texte répétitif
texte_repetitif = "aaaaaaaaaaaaaaaaaabbbbbbbbbbbbbb"

# Texte aléatoire (toutes les lettres)
texte_aleatoire = "xkqjzmvbwfhgtrdnlypscaoiue" * 3

print(f"Texte français :")
print(f"  '{texte_fr[:50]}...'")
print(f"  Entropie : {entropie_texte(texte_fr):.4f} bits/caractère")
print(f"  Caractères uniques : {len(set(texte_fr))}")

print(f"\nTexte répétitif :")
print(f"  '{texte_repetitif}'")
print(f"  Entropie : {entropie_texte(texte_repetitif):.4f} bits/caractère")
print(f"  Caractères uniques : {len(set(texte_repetitif))}")

print(f"\nTexte aléatoire :")
print(f"  '{texte_aleatoire[:50]}...'")
print(f"  Entropie : {entropie_texte(texte_aleatoire):.4f} bits/caractère")
print(f"  Caractères uniques : {len(set(texte_aleatoire))}")
```

**Résultat attendu** :

```text
Texte français :
  'le petit chat est assis sur le tapis du salon et ...'
  Entropie : 3.6214 bits/caractère
  Caractères uniques : 17

Texte répétitif :
  'aaaaaaaaaaaaaaaaaabbbbbbbbbbbbbb'
  Entropie : 0.9887 bits/caractère
  Caractères uniques : 2

Texte aléatoire :
  'xkqjzmvbwfhgtrdnlypscaoiuexkqjzmvbwfhgtrdnlypsca...'
  Entropie : 4.7004 bits/caractère
  Caractères uniques : 26
```

Le texte répétitif a la plus faible entropie (prévisible), le texte aléatoire la plus élevée (imprévisible).

---

### Étape 2 : Comparer des distributions avec la cross-entropy

```python
import numpy as np

def cross_entropy(p, q):
    """Cross-entropy entre p et q (en nats, base e)."""
    p = np.array(p, dtype=np.float64)
    q = np.array(q, dtype=np.float64)
    q = np.clip(q, 1e-15, 1.0)
    return -np.sum(p * np.log(q))

def entropie(p):
    """Entropie de Shannon (en nats, base e)."""
    p = np.array(p, dtype=np.float64)
    p = p[p > 0]
    return -np.sum(p * np.log(p))

# Distribution réelle : 3 classes [chat, chien, oiseau]
p = [0.7, 0.2, 0.1]

# Différentes prédictions
predictions = {
    'Parfaite (q=p)':     [0.7, 0.2, 0.1],
    'Bonne':              [0.6, 0.25, 0.15],
    'Médiocre':           [0.4, 0.3, 0.3],
    'Uniforme':           [0.33, 0.33, 0.34],
    'Inversée':           [0.1, 0.2, 0.7],
}

h_p = entropie(p)
print(f"Entropie de p : H(p) = {h_p:.4f} nats")
print(f"{'Prédiction':>20} | {'CE(p,q)':>8} | {'KL(p||q)':>10} | {'Écart vs optimal':>18}")
print("-" * 65)

for nom, q in predictions.items():
    ce = cross_entropy(p, q)
    kl = ce - h_p  # KL = CE - H
    print(f"{nom:>20} | {ce:>8.4f} | {kl:>10.4f} | {kl:>18.4f}")
```

**Résultat attendu** :

```text
Entropie de p : H(p) = 0.8018 nats
          Prédiction |   CE(p,q) |   KL(p||q) |     Écart vs optimal
-----------------------------------------------------------------
     Parfaite (q=p) |   0.8018 |     0.0000 |             0.0000
               Bonne |   0.8245 |     0.0227 |             0.0227
            Médiocre |   1.0026 |     0.2008 |             0.2008
            Uniforme |   1.1057 |     0.3039 |             0.3039
            Inversée |   1.9694 |     1.1675 |             1.1675
```

La cross-entropy est minimale quand q = p (elle vaut alors l'entropie de p). La divergence KL mesure l'excès par rapport à cet optimum.

---

### Étape 3 : Visualiser l'impact de la cross-entropy dans un classificateur

```python
import numpy as np
import matplotlib.pyplot as plt

# Simuler un classificateur binaire
# Vraie classe : y = 1
# Prédiction : q varie de 0.01 à 0.99

q = np.linspace(0.01, 0.99, 100)

# Binary cross-entropy quand y = 1 : L = -log(q)
bce_y1 = -np.log(q)

# Binary cross-entropy quand y = 0 : L = -log(1-q)
bce_y0 = -np.log(1 - q)

# MSE quand y = 1 : L = (1 - q)^2
mse_y1 = (1 - q) ** 2

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Graphique 1 : BCE vs MSE quand y=1
axes[0].plot(q, bce_y1, label='Cross-entropy', linewidth=2)
axes[0].plot(q, mse_y1, label='MSE', linewidth=2, linestyle='--')
axes[0].set_xlabel('Prédiction q (quand y=1)')
axes[0].set_ylabel('Loss')
axes[0].set_title('Cross-entropy vs MSE (vraie classe = 1)')
axes[0].legend()
axes[0].grid(True, alpha=0.3)
axes[0].set_ylim(0, 5)

# Graphique 2 : BCE pour y=0 et y=1
axes[1].plot(q, bce_y1, label='y=1 : -log(q)', linewidth=2)
axes[1].plot(q, bce_y0, label='y=0 : -log(1-q)', linewidth=2)
axes[1].set_xlabel('Prédiction q')
axes[1].set_ylabel('Loss')
axes[1].set_title('Binary Cross-Entropy')
axes[1].legend()
axes[1].grid(True, alpha=0.3)
axes[1].set_ylim(0, 5)

plt.tight_layout()
plt.savefig('cross_entropy_vs_mse.png', dpi=100)
plt.show()

print("Graphique sauvegardé dans cross_entropy_vs_mse.png")
print("\nObservation clé :")
print("Quand q est proche de 0 et y=1 (erreur grave), la cross-entropy")
print("pénalise beaucoup plus que la MSE. Cela produit des gradients")
print("plus forts et accélère la correction des erreurs graves.")
```

**Résultat attendu** : Un graphique montrant que la cross-entropy monte beaucoup plus vite que la MSE quand la prédiction est très fausse (q proche de 0 quand y = 1).

---

### Étape 4 : Calculer la divergence KL entre deux gaussiennes

```python
import numpy as np
import matplotlib.pyplot as plt

def gaussian_pdf(x, mu, sigma):
    """Densité de probabilité gaussienne."""
    return (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

def kl_gaussiennes(mu_p, sigma_p, mu_q, sigma_q):
    """KL divergence analytique entre deux gaussiennes."""
    return (np.log(sigma_q / sigma_p) +
            (sigma_p**2 + (mu_p - mu_q)**2) / (2 * sigma_q**2) - 0.5)

# Distribution de référence p : N(0, 1)
mu_p, sigma_p = 0, 1

# Différentes approximations q
approximations = [
    ('q = N(0, 1) (identique)', 0, 1),
    ('q = N(0.5, 1)', 0.5, 1),
    ('q = N(2, 1)', 2, 1),
    ('q = N(0, 2)', 0, 2),
    ('q = N(0, 0.5)', 0, 0.5),
]

x = np.linspace(-6, 6, 1000)
p_pdf = gaussian_pdf(x, mu_p, sigma_p)

fig, axes = plt.subplots(len(approximations), 1, figsize=(10, 3 * len(approximations)))

for idx, (nom, mu_q, sigma_q) in enumerate(approximations):
    q_pdf = gaussian_pdf(x, mu_q, sigma_q)
    kl = kl_gaussiennes(mu_p, sigma_p, mu_q, sigma_q)

    axes[idx].plot(x, p_pdf, label='p = N(0, 1)', linewidth=2, color='blue')
    axes[idx].plot(x, q_pdf, label=f'{nom}', linewidth=2, color='red', linestyle='--')
    axes[idx].fill_between(x, 0, np.abs(p_pdf - q_pdf), alpha=0.2, color='orange')
    axes[idx].set_title(f'{nom} | KL(p || q) = {kl:.4f} nats')
    axes[idx].legend(loc='upper right')
    axes[idx].set_xlim(-6, 6)
    axes[idx].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('kl_divergence_gaussiennes.png', dpi=100)
plt.show()

print("Graphique sauvegardé dans kl_divergence_gaussiennes.png")
print("\nRésumé des KL divergences :")
for nom, mu_q, sigma_q in approximations:
    kl = kl_gaussiennes(mu_p, sigma_p, mu_q, sigma_q)
    print(f"  {nom:>30} : KL = {kl:.4f} nats")
```

**Résultat attendu** :

```text
Résumé des KL divergences :
         q = N(0, 1) (identique) : KL = 0.0000 nats
                    q = N(0.5, 1) : KL = 0.1250 nats
                      q = N(2, 1) : KL = 2.0000 nats
                      q = N(0, 2) : KL = 0.3181 nats
                    q = N(0, 0.5) : KL = 0.8069 nats
```

---

## Commandes Utiles

| Opération | Code Python |
| --------- | ----------- |
| Entropie (bits) | `-np.sum(p * np.log2(p))` (p > 0) |
| Entropie (nats) | `-np.sum(p * np.log(p))` (p > 0) |
| Cross-entropy | `-np.sum(p * np.log(q))` |
| KL divergence | `np.sum(p * np.log(p / q))` (p > 0) |
| Binary cross-entropy | `-y*np.log(q) - (1-y)*np.log(1-q)` |
| Information mutuelle | `H(X) + H(Y) - H(X,Y)` |
| Clipping pour log | `np.clip(q, 1e-15, 1.0)` |
| Compteur de caractères | `from collections import Counter` |

---

## Pièges Fréquents

### Piège 1 : log(0) provoque une erreur

⚠️ **Problème** : Calculer `np.log(0)` renvoie `-inf`, ce qui fait planter les calculs de cross-entropy et KL divergence.

✅ **Solution** : Utilise toujours `np.clip(q, 1e-15, 1.0)` avant de prendre le logarithme. Cela remplace les 0 par un nombre très petit (10^-15) sans affecter significativement le résultat.

```python
q = np.array([0.9, 0.1, 0.0])

# Problème : log(0) = -inf
# print(np.log(q))  # array([-0.105, -2.302, -inf])

# Solution : clipping
q_safe = np.clip(q, 1e-15, 1.0)
print(np.log(q_safe))  # array([-0.105, -2.302, -34.539])
```

---

### Piège 2 : Confondre base 2 et base e pour l'entropie

⚠️ **Problème** : Utiliser `np.log` (base e, en nats) quand on attend des bits (base 2), ou inversement. Les résultats numériques sont différents.

✅ **Solution** : Sois cohérent dans le choix de la base. En théorie de l'information classique, on utilise log2 (bits). En machine learning, on utilise ln (nats) car c'est la base naturelle pour les dérivées.

```python
p = [0.5, 0.5]

# Entropie en bits (log base 2)
h_bits = -sum(pi * np.log2(pi) for pi in p)
print(f"Entropie en bits : {h_bits:.4f}")   # 1.0

# Entropie en nats (log base e)
h_nats = -sum(pi * np.log(pi) for pi in p)
print(f"Entropie en nats : {h_nats:.4f}")   # 0.6931

# Conversion : nats = bits * ln(2)
print(f"Vérification : {h_bits * np.log(2):.4f} nats")  # 0.6931
```

---

### Piège 3 : Oublier l'asymétrie de la KL divergence

⚠️ **Problème** : Écrire D_KL(p || q) en pensant que c'est la même chose que D_KL(q || p). L'asymétrie a des conséquences pratiques importantes.

✅ **Solution** : Retiens que D_KL(p || q) pénalise les endroits où p est non-nul mais q est faible. D_KL(q || p) fait l'inverse. Dans la loss d'un VAE, on utilise D_KL(q || p) pour forcer la distribution apprise q à ne pas s'éloigner du prior p.

---

### Piège 4 : Confondre cross-entropy et divergence KL dans la loss

⚠️ **Problème** : Se demander s'il faut minimiser la cross-entropy ou la KL divergence comme fonction de perte. Les deux donnent-ils le même résultat ?

✅ **Solution** : En classification, minimiser la cross-entropy H(p, q) est équivalent à minimiser la KL divergence D_KL(p || q), car la différence entre les deux est H(p) (l'entropie de la distribution réelle), qui est une constante indépendante des paramètres du modèle.

```text
H(p, q) = H(p) + D_KL(p || q)
         ^^^^^
         constante (ne dépend pas de q)

Donc : argmin_q H(p, q) = argmin_q D_KL(p || q)
```

---

## Checklist de Validation

- [ ] Je sais calculer l'entropie de Shannon d'une distribution discrète
- [ ] Je comprends que l'entropie est maximale pour une distribution uniforme
- [ ] Je sais calculer la cross-entropy entre deux distributions
- [ ] Je comprends pourquoi la cross-entropy est utilisée comme loss en classification
- [ ] Je sais calculer la divergence KL et je comprends son asymétrie
- [ ] Je connais la relation : cross-entropy = entropie + KL divergence
- [ ] Je comprends l'information mutuelle et sa différence avec la corrélation
- [ ] J'ai calculé l'entropie de textes et comparé des distributions

---

## Exercice Pratique

**Énoncé** : Écris un script Python qui réalise les tâches suivantes.

1. Calcule l'entropie de 3 textes de ton choix (un texte répétitif, un texte en français, un texte avec des caractères aléatoires)
2. Compare deux distributions discrètes avec la KL divergence dans les deux sens (forward et reverse) pour illustrer l'asymétrie
3. Implémente la binary cross-entropy et montre qu'elle pénalise plus fortement les prédictions confiantes et fausses que les prédictions incertaines

**Indications** :

- Pour les textes, utilise la fréquence des caractères comme distribution de probabilité
- Pour la KL divergence, utilise p = [0.6, 0.3, 0.1] et q = [0.33, 0.33, 0.34] pour bien voir l'asymétrie
- Pour la binary cross-entropy, compare la loss pour q = 0.01 (confiant et faux) vs q = 0.4 (incertain) quand y = 1
- Utilise `np.clip` pour éviter log(0)

**Résultat attendu** : Le script affiche les 3 entropies (croissantes : répétitif < français < aléatoire), les deux KL divergences (valeurs différentes) et les deux losses de cross-entropy (q=0.01 donne une loss bien plus élevée que q=0.4).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
from collections import Counter

# ===== PARTIE 1 : Entropie de textes =====

def entropie_texte(texte):
    """Calcule l'entropie de Shannon d'un texte (en bits par caractère)."""
    compteur = Counter(texte.lower())
    total = sum(compteur.values())
    probs = np.array([count / total for count in compteur.values()])
    return -np.sum(probs * np.log2(probs))

textes = {
    'Répétitif': 'aaaaaaaaabbbbbbbbb',
    'Français': 'le renard brun rapide saute par-dessus le chien paresseux',
    'Aléatoire': 'xkqjzmvbwfhgtrdnlypscaoiuexkqjzmvbwfhg',
}

print("=" * 50)
print("PARTIE 1 : Entropie de textes")
print("=" * 50)

for nom, texte in textes.items():
    h = entropie_texte(texte)
    n_unique = len(set(texte.lower()))
    print(f"\n  {nom} :")
    print(f"    Texte : '{texte[:40]}{'...' if len(texte) > 40 else ''}'")
    print(f"    Caractères uniques : {n_unique}")
    print(f"    Entropie : {h:.4f} bits/caractère")

# ===== PARTIE 2 : Asymétrie de la KL divergence =====

def kl_divergence(p, q):
    """KL divergence D_KL(p || q) en nats."""
    p = np.array(p, dtype=np.float64)
    q = np.array(q, dtype=np.float64)
    q = np.clip(q, 1e-15, 1.0)
    mask = p > 0
    return np.sum(p[mask] * np.log(p[mask] / q[mask]))

p = [0.6, 0.3, 0.1]
q = [0.33, 0.33, 0.34]

print("\n" + "=" * 50)
print("PARTIE 2 : Asymétrie de la KL divergence")
print("=" * 50)
print(f"\n  p = {p}")
print(f"  q = {q}")
print(f"\n  D_KL(p || q) = {kl_divergence(p, q):.4f} nats")
print(f"  D_KL(q || p) = {kl_divergence(q, p):.4f} nats")
print(f"  Différence   = {abs(kl_divergence(p, q) - kl_divergence(q, p)):.4f} nats")
print(f"  -> Les deux valeurs sont différentes : la KL n'est PAS symétrique")

# ===== PARTIE 3 : Binary cross-entropy =====

def binary_cross_entropy(y, q):
    """Binary cross-entropy pour une seule prédiction."""
    q = np.clip(q, 1e-15, 1 - 1e-15)
    return -(y * np.log(q) + (1 - y) * np.log(1 - q))

print("\n" + "=" * 50)
print("PARTIE 3 : Binary cross-entropy")
print("=" * 50)
print(f"\n  Vraie classe : y = 1")

predictions = [0.01, 0.1, 0.4, 0.6, 0.9, 0.99]
for q_val in predictions:
    bce = binary_cross_entropy(1, q_val)
    bar = '#' * int(min(bce * 10, 50))
    print(f"  q = {q_val:.2f} | Loss = {bce:.4f} {bar}")

print(f"\n  Observation :")
print(f"  q = 0.01 (confiant et faux)  : Loss = {binary_cross_entropy(1, 0.01):.4f}")
print(f"  q = 0.40 (incertain)         : Loss = {binary_cross_entropy(1, 0.40):.4f}")
print(f"  -> La loss est {binary_cross_entropy(1, 0.01) / binary_cross_entropy(1, 0.40):.1f}x "
      f"plus élevée pour la prédiction confiante et fausse")
```

**Résultat** :

```text
==================================================
PARTIE 1 : Entropie de textes
==================================================

  Répétitif :
    Texte : 'aaaaaaaaabbbbbbbbb'
    Caractères uniques : 2
    Entropie : 0.9911 bits/caractère

  Français :
    Texte : 'le renard brun rapide saute par-dessus ...'
    Caractères uniques : 20
    Entropie : 3.9712 bits/caractère

  Aléatoire :
    Texte : 'xkqjzmvbwfhgtrdnlypscaoiuexkqjzmvbwfhg'
    Caractères uniques : 24
    Entropie : 4.4812 bits/caractère

==================================================
PARTIE 2 : Asymétrie de la KL divergence
==================================================

  p = [0.6, 0.3, 0.1]
  q = [0.33, 0.33, 0.34]

  D_KL(p || q) = 0.2077 nats
  D_KL(q || p) = 0.2502 nats
  Différence   = 0.0425 nats
  -> Les deux valeurs sont différentes : la KL n'est PAS symétrique

==================================================
PARTIE 3 : Binary cross-entropy
==================================================

  Vraie classe : y = 1
  q = 0.01 | Loss = 4.6052 ###############################################
  q = 0.10 | Loss = 2.3026 #######################
  q = 0.40 | Loss = 0.9163 #########
  q = 0.60 | Loss = 0.5108 #####
  q = 0.90 | Loss = 0.1054 #
  q = 0.99 | Loss = 0.0101

  Observation :
  q = 0.01 (confiant et faux)  : Loss = 4.6052
  q = 0.40 (incertain)         : Loss = 0.9163
  -> La loss est 5.0x plus élevée pour la prédiction confiante et fausse
```

---

## Navigation

← Fiche précédente : **[03 - Probabilités et statistiques](03-probabilites-statistiques.md)**
