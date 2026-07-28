---
tags:
  - IA
  - Intermédiaire
  - Concept
description: "Probabilités et statistiques pour l'IA : distributions, théorème de Bayes, MLE et compromis biais-variance"
estimated_time: "55 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 1 - Fondamentaux mathématiques"
---

# 03 - Probabilités et statistiques

> **En bref** : À la fin de cette fiche, tu sauras utiliser les distributions de probabilité, appliquer le théorème de Bayes, comprendre l'estimation MLE et analyser le compromis biais-variance. Lecture estimée : 55 min.


## Prérequis

- Fiche **[01 - Algèbre linéaire pour l'IA](01-algebre-lineaire.md)** (vecteurs, matrices)
- Python 3, NumPy et Matplotlib installés (`pip install numpy matplotlib`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les distributions de probabilité, appliquer le théorème de Bayes, comprendre l'estimation MLE et analyser le compromis biais-variance.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une probabilité ?

**Définition** : Une probabilité est un nombre entre 0 et 1 qui mesure la chance qu'un événement se produise. 0 signifie impossible, 1 signifie certain. La probabilité de lancer un 6 sur un dé équilibré est 1/6 (environ 0.167).

**Le problème que les probabilités résolvent** :

Sans probabilités, voici les problèmes rencontrés :

1. **Pas de gestion de l'incertitude** : les données du monde réel sont bruitées et incertaines, impossible de les modéliser
2. **Pas de prédiction** : impossible de quantifier la confiance dans une prédiction (est-ce 51% ou 99% probable ?)
3. **Pas de prise de décision** : impossible de choisir entre deux options sans mesurer les risques

**Comment les probabilités résolvent ces problèmes** :

| Problème | Solution apportée par les probabilités |
| -------- | -------------------------------------- |
| Pas de gestion de l'incertitude | Les distributions modélisent le bruit et la variabilité des données |
| Pas de prédiction | La sortie d'un classificateur est une probabilité par classe |
| Pas de prise de décision | On choisit l'action qui maximise l'espérance de gain |

**Analogie concrète** : Les probabilités sont comme la météo. Quand on dit "80% de chance de pluie", on quantifie une incertitude. De la même façon, un modèle d'IA dit "92% de chance que cette image soit un chat". Ce nombre guide la décision (prendre un parapluie / classer comme chat).

**Ce qu'une probabilité n'est PAS** :

- Une probabilité n'est pas une certitude. P(pluie) = 0.8 ne signifie pas qu'il pleuvra. Cela signifie que dans des conditions similaires, il pleut 8 fois sur 10.
- Une probabilité n'est pas une fréquence obligatoire. P(face) = 0.5 ne signifie pas que 50 lancers sur 100 donneront face. C'est une valeur théorique vers laquelle la fréquence converge sur un grand nombre d'essais.

#### Axiomes de probabilité

Les trois règles fondamentales (axiomes de Kolmogorov) :

1. **Non-négativité** : P(A) >= 0 pour tout événement A
2. **Normalisation** : P(univers) = 1 (quelque chose se passe toujours)
3. **Additivité** : Si A et B sont incompatibles (ne peuvent pas se produire en même temps), alors P(A ou B) = P(A) + P(B)

#### Probabilité conditionnelle

La probabilité conditionnelle P(A|B) est la probabilité de A sachant que B s'est produit.

```text
P(A|B) = P(A et B) / P(B)
```

Exemple : P(malade|test positif) = P(malade ET test positif) / P(test positif)

#### Indépendance

Deux événements A et B sont indépendants si le fait de connaître l'un n'apporte aucune information sur l'autre.

```text
A et B indépendants  <=>  P(A|B) = P(A)  <=>  P(A et B) = P(A) * P(B)
```

---

### Qu'est-ce qu'une distribution de probabilité ?

**Définition** : Une distribution de probabilité décrit comment les probabilités sont réparties entre les différentes valeurs possibles d'une variable aléatoire. Elle indique quelles valeurs sont probables et quelles valeurs sont rares.

**Le problème que les distributions résolvent** :

Sans distributions, voici les problèmes rencontrés :

1. **Pas de modèle pour les données** : impossible de décrire mathématiquement la forme des données (symétrique, biaisée, etc.)
2. **Pas de génération de données** : impossible de créer des données synthétiques pour entraîner un modèle
3. **Pas de calcul de vraisemblance** : impossible de mesurer si un modèle explique bien les données observées

**Comment les distributions résolvent ces problèmes** :

| Problème | Solution apportée par les distributions |
| -------- | --------------------------------------- |
| Pas de modèle | Chaque distribution a une forme caractéristique adaptée à un type de données |
| Pas de génération | On peut tirer des échantillons aléatoires depuis n'importe quelle distribution |
| Pas de vraisemblance | La densité de probabilité donne la vraisemblance de chaque observation |

**Analogie concrète** : Une distribution de probabilité est comme un histogramme idéalisé. Si tu mesures la taille de 1000 personnes et fais un histogramme, tu obtiens une courbe en cloche. La distribution normale (gaussienne) est la version mathématique parfaite de cette courbe. Elle te dit exactement combien de personnes mesurent entre 1m70 et 1m75.

#### Distributions principales

**Distribution uniforme** : Toutes les valeurs dans un intervalle ont la même probabilité.

```python
import numpy as np

# 1000 nombres aléatoires entre 0 et 1 (uniforme)
uniform = np.random.uniform(0, 1, size=1000)
print(f"Moyenne : {uniform.mean():.4f}")    # ≈ 0.5
print(f"Écart-type : {uniform.std():.4f}")  # ≈ 0.289
```

**Distribution normale (gaussienne)** : La plus importante en IA. En forme de cloche, centrée sur la moyenne. 68% des valeurs sont à 1 écart-type de la moyenne, 95% à 2 écarts-types.

```python
# 1000 nombres tirés d'une gaussienne (moyenne=0, écart-type=1)
normal = np.random.normal(loc=0, scale=1, size=1000)
print(f"Moyenne : {normal.mean():.4f}")    # ≈ 0.0
print(f"Écart-type : {normal.std():.4f}")  # ≈ 1.0
```

**Distribution de Bernoulli** : Un seul essai avec deux résultats possibles (succès/échec). P(succès) = p.

```python
# 1000 tirages de Bernoulli avec p = 0.7 (70% de chance de succès)
bernoulli = np.random.binomial(n=1, p=0.7, size=1000)
print(f"Proportion de succès : {bernoulli.mean():.4f}")  # ≈ 0.7
```

**Distribution multinomiale** : Généralisation de Bernoulli à plus de 2 catégories. Exemple : le résultat d'un dé (6 catégories).

```python
# 1000 lancers de dé (6 faces équiprobables)
probas = [1/6] * 6  # Chaque face a la même probabilité
des = np.random.multinomial(n=1, pvals=probas, size=1000)
# Compter les occurrences de chaque face
comptage = des.sum(axis=0)
print(f"Comptage par face : {comptage}")  # ≈ [167, 167, 167, 167, 167, 167]
```

**Comparaison des distributions** :

| Distribution | Valeurs possibles | Paramètres | Usage en IA |
| ------------ | ----------------- | ---------- | ----------- |
| Uniforme | Continues dans [a, b] | a, b (bornes) | Initialisation aléatoire |
| Normale | Continues dans ]-inf, +inf[ | mu (moyenne), sigma (écart-type) | Bruit, poids initiaux, données naturelles |
| Bernoulli | 0 ou 1 | p (probabilité de succès) | Classification binaire |
| Multinomiale | k catégories | p1, p2, ..., pk | Classification multi-classes |

---

### Qu'est-ce que le théorème de Bayes ?

**Définition** : Le théorème de Bayes permet de calculer une probabilité a posteriori (après avoir observé des données) à partir d'une probabilité a priori (avant les données), de la vraisemblance des données et de la probabilité totale des données.

```text
P(H|D) = P(D|H) * P(H) / P(D)
```

Où :

- P(H|D) = **posterior** : probabilité de l'hypothèse H sachant les données D
- P(D|H) = **likelihood** : probabilité des données D si l'hypothèse H est vraie
- P(H) = **prior** : probabilité de l'hypothèse H avant de voir les données
- P(D) = **evidence** : probabilité totale des données (constante de normalisation)

**Le problème que le théorème de Bayes résout** :

Sans théorème de Bayes, voici les problèmes rencontrés :

1. **Inversion de conditionnement** : on connaît P(symptôme|maladie), mais on veut P(maladie|symptôme)
2. **Pas de mise à jour des croyances** : impossible d'intégrer de nouvelles observations pour affiner une estimation
3. **Pas de traitement des connaissances a priori** : impossible d'incorporer ce qu'on sait déjà dans le modèle

**Comment le théorème de Bayes résout ces problèmes** :

| Problème | Solution apportée par Bayes |
| -------- | --------------------------- |
| Inversion de conditionnement | Bayes transforme P(D\|H) en P(H\|D) |
| Pas de mise à jour | Le posterior d'une observation devient le prior de la suivante |
| Pas de connaissances a priori | Le prior encode les connaissances existantes |

**Analogie concrète** : Tu es médecin. Tu sais que la grippe cause de la fièvre dans 90% des cas (likelihood). Tu sais aussi que 5% de la population a la grippe en ce moment (prior). Un patient arrive avec de la fièvre. Le théorème de Bayes te permet de calculer la probabilité que ce patient ait la grippe sachant qu'il a de la fièvre (posterior).

**Ce que le théorème de Bayes n'est PAS** :

- Bayes ne donne pas de certitude. Il donne la meilleure estimation possible étant donné les données disponibles.
- Bayes n'est pas subjectif. Le prior peut être subjectif (opinion initiale), mais la formule mathématique est objective.

**Application en machine learning** : Les classificateurs bayésiens (Naive Bayes) utilisent le théorème de Bayes pour classer des données. Pour chaque classe c et une observation x, on calcule P(c|x) et on choisit la classe avec la plus haute probabilité.

---

### Qu'est-ce que l'espérance, la variance et la covariance ?

**Définition** :

- **Espérance** E[X] : la valeur moyenne théorique d'une variable aléatoire. Pour un dé équilibré, E[X] = 3.5.
- **Variance** Var(X) : mesure de la dispersion des valeurs autour de la moyenne. Plus la variance est grande, plus les valeurs sont étalées.
- **Covariance** Cov(X, Y) : mesure la relation linéaire entre deux variables. Positive si elles varient dans le même sens, négative si elles varient en sens inverse, nulle si elles sont indépendantes.

**Formules** :

```text
Espérance :   E[X] = somme(xi * P(xi))  (théorique, variable discrète)
              Estimation empirique : moyenne = (1/n) * somme(xi)
Variance :    Var(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2
Covariance :  Cov(X, Y) = E[(X - E[X])(Y - E[Y])]
```

**Analogie concrète** : L'espérance est le centre de gravité des données. La variance est la distance moyenne des données par rapport au centre. La covariance indique si deux ensembles de données "bougent ensemble" : la taille et le poids d'un groupe de personnes ont une covariance positive (les grands sont souvent plus lourds).

```python
import numpy as np

# Données
x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 5])

# Espérance (moyenne)
print(f"E[X] = {np.mean(x)}")  # 3.0
print(f"E[Y] = {np.mean(y)}")  # 4.0

# Variance
print(f"Var(X) = {np.var(x)}")  # 2.0
print(f"Var(Y) = {np.var(y)}")  # 1.2

# Covariance
# np.cov retourne la matrice de covariance
cov_matrix = np.cov(x, y, ddof=0)
print(f"Cov(X, Y) = {cov_matrix[0, 1]}")  # 1.2
```

---

### Qu'est-ce que le Maximum Likelihood Estimation (MLE) ?

**Définition** : Le MLE (Maximum Likelihood Estimation) est une méthode pour estimer les paramètres d'un modèle statistique. L'idée est de trouver les paramètres qui rendent les données observées les plus probables (qui maximisent la vraisemblance).

**Le problème que le MLE résout** :

Sans MLE, voici les problèmes rencontrés :

1. **Pas de méthode systématique** : comment choisir les paramètres d'un modèle parmi une infinité de possibilités ?
2. **Pas de critère objectif** : sur quelle base décider qu'un jeu de paramètres est meilleur qu'un autre ?
3. **Pas de lien avec les fonctions de perte** : comment justifier mathématiquement pourquoi on minimise la MSE ou la cross-entropy ?

**Comment le MLE résout ces problèmes** :

| Problème | Solution apportée par le MLE |
| -------- | ---------------------------- |
| Pas de méthode systématique | On maximise la fonction de vraisemblance L(theta) = produit(P(xi\|theta)) |
| Pas de critère objectif | Les paramètres MLE sont ceux qui maximisent la probabilité des données |
| Pas de lien avec les pertes | Minimiser la MSE = MLE pour un bruit gaussien. Minimiser la cross-entropy = MLE pour une classification |

**Pourquoi on minimise la négative log-likelihood** :

Le produit de nombreuses probabilités (toutes < 1) donne un nombre extrêmement petit, ce qui cause des problèmes numériques. Le logarithme transforme ce produit en somme, ce qui est numériquement stable et mathématiquement équivalent.

```text
Vraisemblance :     L(theta) = P(x1|theta) * P(x2|theta) * ... * P(xn|theta)
Log-vraisemblance : log L(theta) = log P(x1|theta) + log P(x2|theta) + ... + log P(xn|theta)
Negative log-likelihood : NLL = -log L(theta)  (on minimise au lieu de maximiser)
```

**Analogie concrète** : Tu lances une pièce 100 fois et obtiens 70 fois face. Le MLE te dit : "La pièce la plus probable pour expliquer ces résultats est une pièce biaisée avec P(face) = 0.70." Le MLE choisit le paramètre (P(face)) qui rend les observations (70 faces sur 100) les plus probables.

**Ce que le MLE n'est PAS** :

- Le MLE n'est pas bayésien. Le MLE ne prend pas en compte de prior. Il utilise uniquement les données.
- Le MLE ne donne pas la probabilité des paramètres. Il donne les paramètres les plus vraisemblables, pas P(paramètres|données).

```python
import numpy as np

# Exemple : estimer la moyenne d'une gaussienne par MLE
# La moyenne MLE correspond à la moyenne empirique des données

# Données générées depuis une gaussienne de moyenne 5 et écart-type 2
np.random.seed(42)
data = np.random.normal(loc=5.0, scale=2.0, size=1000)

# Estimation MLE de la moyenne = moyenne des données
mu_mle = np.mean(data)
# Estimation MLE de l'écart-type = écart-type des données
sigma_mle = np.std(data)

print(f"Paramètres réels   : mu = 5.0, sigma = 2.0")
print(f"Estimations MLE    : mu = {mu_mle:.4f}, sigma = {sigma_mle:.4f}")
```

---

### Qu'est-ce que le compromis biais-variance ?

**Définition** : Le compromis biais-variance est le dilemme fondamental du machine learning. Le biais mesure l'erreur due aux hypothèses simplificatrices du modèle (sous-apprentissage). La variance mesure la sensibilité du modèle aux fluctuations des données d'entraînement (sur-apprentissage). L'erreur totale = biais^2 + variance + bruit irréductible.

**Le problème que le compromis biais-variance résout** :

Sans comprendre ce compromis, voici les problèmes rencontrés :

1. **Sous-apprentissage (underfitting)** : le modèle est trop simple et ne capture pas les tendances des données
2. **Sur-apprentissage (overfitting)** : le modèle est trop complexe et mémorise le bruit au lieu des tendances
3. **Pas de diagnostic** : impossible de savoir si l'erreur vient du modèle ou des données

**Comment le compromis biais-variance résout ces problèmes** :

| Problème | Diagnostic | Solution |
| -------- | ---------- | -------- |
| Sous-apprentissage | Biais élevé, variance faible | Augmenter la complexité du modèle |
| Sur-apprentissage | Biais faible, variance élevée | Régulariser, plus de données, modèle plus simple |
| Erreur incompressible | Bruit irréductible | Améliorer la qualité des données |

**Analogie concrète** : Imagine que tu tires à l'arc sur une cible. Le biais, c'est si toutes tes flèches sont décalées en haut à gauche (erreur systématique). La variance, c'est si tes flèches sont dispersées dans tous les sens (erreur aléatoire). L'idéal est un biais faible (centré sur la cible) ET une variance faible (flèches groupées).

**Ce que le compromis biais-variance n'est PAS** :

- Ce n'est pas un problème à résoudre une fois pour toutes. C'est un équilibre permanent qui dépend du modèle, des données et de la tâche.
- Ce n'est pas spécifique à un algorithme. Tout modèle de ML est soumis à ce compromis.

**Comparaison sous-apprentissage vs sur-apprentissage** :

| Sous-apprentissage | Sur-apprentissage |
| ------------------ | ----------------- |
| Erreur élevée sur train ET test | Erreur faible sur train, élevée sur test |
| Modèle trop simple | Modèle trop complexe |
| Ne capture pas les tendances | Mémorise le bruit |
| Solution : modèle plus complexe | Solution : régularisation, plus de données |

---

## Étapes Pratiques

### Étape 1 : Visualiser des distributions avec Matplotlib

Crée un fichier `probabilites.py`.

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Générer des échantillons ---
uniform = np.random.uniform(0, 1, size=10000)
normal = np.random.normal(loc=0, scale=1, size=10000)
bernoulli = np.random.binomial(n=1, p=0.3, size=10000)

# --- Afficher les distributions ---
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Distribution uniforme
axes[0].hist(uniform, bins=50, density=True, color='steelblue', alpha=0.7)
axes[0].set_title('Distribution Uniforme [0, 1]')
axes[0].set_xlabel('Valeur')
axes[0].set_ylabel('Densité')

# Distribution normale
axes[1].hist(normal, bins=50, density=True, color='coral', alpha=0.7)
axes[1].set_title('Distribution Normale (mu=0, sigma=1)')
axes[1].set_xlabel('Valeur')
axes[1].set_ylabel('Densité')

# Distribution de Bernoulli
axes[2].hist(bernoulli, bins=[-0.5, 0.5, 1.5], density=True, color='seagreen',
             alpha=0.7, rwidth=0.5)
axes[2].set_title('Distribution de Bernoulli (p=0.3)')
axes[2].set_xlabel('Valeur')
axes[2].set_ylabel('Probabilité')
axes[2].set_xticks([0, 1])

plt.tight_layout()
plt.savefig('distributions.png', dpi=100)
plt.show()

print("Graphique sauvegardé dans distributions.png")
```

**Résultat attendu** : Un fichier `distributions.png` avec 3 histogrammes : un rectangle plat (uniforme), une cloche (normale), et deux barres (Bernoulli).

---

### Étape 2 : Calculer des probabilités conditionnelles

```python
import numpy as np

# --- Simulation d'un test médical ---
# P(maladie) = 0.01 (1% de la population est malade)
# P(test+ | malade) = 0.95 (sensibilité du test)
# P(test+ | sain) = 0.05 (faux positifs)

# On simule 100 000 personnes
np.random.seed(42)
n = 100_000

# Statut réel : malade (1) ou sain (0)
malade = np.random.binomial(n=1, p=0.01, size=n)

# Résultat du test
test_positif = np.zeros(n)
for i in range(n):
    if malade[i] == 1:
        # Malade : 95% de chance de test positif
        test_positif[i] = np.random.binomial(1, 0.95)
    else:
        # Sain : 5% de chance de faux positif
        test_positif[i] = np.random.binomial(1, 0.05)

# Calculer P(malade | test+) par comptage
positifs = test_positif == 1
malades_et_positifs = (malade == 1) & (test_positif == 1)

p_malade_si_positif = malades_et_positifs.sum() / positifs.sum()

print(f"Nombre total de personnes : {n}")
print(f"Nombre de malades : {malade.sum()}")
print(f"Nombre de tests positifs : {int(positifs.sum())}")
print(f"Nombre de vrais positifs : {int(malades_et_positifs.sum())}")
print(f"\nP(malade | test+) = {p_malade_si_positif:.4f}")
print(f"Seulement {p_malade_si_positif*100:.1f}% des tests positifs sont de vrais malades")
```

**Résultat attendu** :

```text
Nombre total de personnes : 100000
Nombre de malades : 972
Nombre de tests positifs : 5924
Nombre de vrais positifs : 920

P(malade | test+) = 0.1553
Seulement 15.5% des tests positifs sont de vrais malades
```

Ce résultat surprenant illustre le paradoxe de Bayes : même avec un test fiable (95% de sensibilité), si la maladie est rare (1%), la majorité des tests positifs sont des faux positifs. Les chiffres exacts varient un peu d'un tirage à l'autre, mais restent proches de la valeur analytique (~16,1%).

---

### Étape 3 : Vérifier avec le théorème de Bayes analytique

```python
# --- Calcul analytique avec Bayes ---
p_maladie = 0.01                # Prior : P(malade)
p_test_pos_si_malade = 0.95     # Likelihood : P(test+ | malade)
p_test_pos_si_sain = 0.05       # P(test+ | sain)

# P(test+) = P(test+ | malade) * P(malade) + P(test+ | sain) * P(sain)
p_test_pos = (p_test_pos_si_malade * p_maladie +
              p_test_pos_si_sain * (1 - p_maladie))

# Théorème de Bayes : P(malade | test+) = P(test+ | malade) * P(malade) / P(test+)
p_malade_si_positif_bayes = (p_test_pos_si_malade * p_maladie) / p_test_pos

print(f"Calcul analytique (Bayes) :")
print(f"P(test+) = {p_test_pos:.4f}")
print(f"P(malade | test+) = {p_malade_si_positif_bayes:.4f}")
print(f"Soit {p_malade_si_positif_bayes*100:.1f}%")
```

**Résultat attendu** :

```text
Calcul analytique (Bayes) :
P(test+) = 0.0590
P(malade | test+) = 0.1610
Soit 16.1%
```

---

### Étape 4 : Implémenter un classificateur bayésien naïf

```python
import numpy as np

# --- Données d'entraînement ---
# Classificateur de spam simplifié
# Caractéristiques : [longueur du message, nombre de mots en majuscules]
# Classe 0 = normal, Classe 1 = spam

np.random.seed(42)

# Générer des données
# Messages normaux : courts, peu de majuscules
normal_length = np.random.normal(50, 15, 100)   # Longueur moyenne 50
normal_caps = np.random.normal(2, 1, 100)        # 2 mots en majuscules en moyenne

# Spams : longs, beaucoup de majuscules
spam_length = np.random.normal(120, 30, 100)     # Longueur moyenne 120
spam_caps = np.random.normal(10, 3, 100)          # 10 mots en majuscules en moyenne

# Assembler les données
X_train = np.vstack([
    np.column_stack([normal_length, normal_caps]),
    np.column_stack([spam_length, spam_caps])
])
y_train = np.array([0]*100 + [1]*100)

# --- Entraînement : calculer les paramètres par classe ---
classes = [0, 1]
params = {}

for c in classes:
    mask = y_train == c
    X_c = X_train[mask]
    params[c] = {
        'prior': mask.mean(),           # P(classe)
        'mean': X_c.mean(axis=0),       # Moyenne de chaque feature
        'std': X_c.std(axis=0)          # Écart-type de chaque feature
    }
    print(f"Classe {c} ({'normal' if c == 0 else 'spam'}) :")
    print(f"  Prior : {params[c]['prior']:.2f}")
    print(f"  Moyennes : {params[c]['mean']}")
    print(f"  Écarts-types : {params[c]['std']}")

# --- Prédiction avec Bayes naïf ---
def gaussian_pdf(x, mean, std):
    """Densité de probabilité d'une gaussienne."""
    return (1 / (std * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mean) / std) ** 2)

def predict(x, params):
    """Prédit la classe par Naive Bayes."""
    posteriors = {}
    for c in classes:
        # Log du prior
        log_posterior = np.log(params[c]['prior'])
        # Ajouter la log-vraisemblance de chaque feature
        for i in range(len(x)):
            pdf = gaussian_pdf(x[i], params[c]['mean'][i], params[c]['std'][i])
            log_posterior += np.log(pdf + 1e-300)  # +epsilon pour éviter log(0)
        posteriors[c] = log_posterior

    # Retourner la classe avec le plus grand posterior
    return max(posteriors, key=posteriors.get)

# --- Test ---
test_messages = [
    np.array([45, 1]),     # Message court, peu de majuscules -> normal
    np.array([150, 12]),   # Message long, beaucoup de majuscules -> spam
    np.array([80, 5]),     # Cas ambigu
]

print("\n--- Prédictions ---")
for msg in test_messages:
    pred = predict(msg, params)
    label = 'normal' if pred == 0 else 'spam'
    print(f"Message (longueur={msg[0]}, caps={msg[1]}) -> {label}")
```

**Résultat attendu** :

```text
Classe 0 (normal) :
  Prior : 0.50
  Moyennes : [49.27  1.87]
  Écarts-types : [14.63  0.98]
Classe 1 (spam) :
  Prior : 0.50
  Moyennes : [122.35  10.05]
  Écarts-types : [29.12   2.87]

--- Prédictions ---
Message (longueur=45, caps=1) -> normal
Message (longueur=150, caps=12) -> spam
Message (longueur=80, caps=5) -> normal
```

---

## Commandes Utiles

| Opération | Code Python |
| --------- | ----------- |
| Moyenne | `np.mean(data)` |
| Variance | `np.var(data)` |
| Écart-type | `np.std(data)` |
| Matrice de covariance | `np.cov(X, Y, ddof=0)` |
| Tirage uniforme | `np.random.uniform(a, b, size=n)` |
| Tirage gaussien | `np.random.normal(mu, sigma, size=n)` |
| Tirage Bernoulli | `np.random.binomial(1, p, size=n)` |
| Histogramme | `plt.hist(data, bins=50, density=True)` |
| Densité gaussienne | `(1/(s*sqrt(2*pi))) * exp(-0.5*((x-m)/s)**2)` |

---

## Pièges Fréquents

### Piège 1 : Confondre P(A|B) et P(B|A)

⚠️ **Problème** : Croire que P(maladie|symptôme) = P(symptôme|maladie). Ce sont deux probabilités très différentes. P(fièvre|grippe) = 0.9 ne signifie pas que P(grippe|fièvre) = 0.9.

✅ **Solution** : Utilise toujours le théorème de Bayes pour inverser le conditionnement. P(grippe|fièvre) dépend aussi de la prévalence de la grippe et de la probabilité d'avoir de la fièvre pour d'autres raisons.

---

### Piège 2 : Oublier le prior dans Bayes

⚠️ **Problème** : Ignorer le prior P(H) et ne regarder que la vraisemblance P(D|H). Cela mène à des conclusions erronées quand les classes sont déséquilibrées.

✅ **Solution** : Intègre toujours le prior. Si une maladie touche 1 personne sur 10 000, le prior est 0.0001. Même avec un test très sensible, la plupart des positifs seront des faux positifs.

---

### Piège 3 : Confondre variance d'entraînement et variance du modèle

⚠️ **Problème** : Confondre la variance des données (dispersion des valeurs) avec la variance au sens biais-variance (sensibilité du modèle aux données d'entraînement).

✅ **Solution** : La variance des données est une statistique descriptive. La variance du modèle mesure combien les prédictions changent si on entraîne avec un jeu de données différent. Pour la mesurer, entraîne le modèle plusieurs fois avec des échantillons différents et observe la variation des prédictions.

---

### Piège 4 : Supposer l'indépendance quand ce n'est pas le cas

⚠️ **Problème** : Le classificateur Naive Bayes suppose que toutes les caractéristiques sont indépendantes. En réalité, la longueur d'un message et le nombre de mots en majuscules sont probablement corrélés (un message long a plus de chances d'avoir des majuscules).

✅ **Solution** : Naive Bayes fonctionne souvent bien malgré cette hypothèse simplificatrice, mais garde en tête cette limitation. Pour des corrélations fortes entre features, utilise des modèles qui les capturent (régression logistique, réseaux de neurones).

---

## Checklist de Validation

- [ ] Je connais les 3 axiomes de probabilité
- [ ] Je sais calculer une probabilité conditionnelle P(A|B)
- [ ] Je sais distinguer les distributions uniforme, normale, Bernoulli et multinomiale
- [ ] Je sais appliquer le théorème de Bayes et je comprends le paradoxe du test médical
- [ ] Je sais calculer l'espérance, la variance et la covariance
- [ ] Je comprends pourquoi on minimise la négative log-likelihood (MLE)
- [ ] Je sais expliquer la différence entre sous-apprentissage et sur-apprentissage
- [ ] J'ai implémenté un classificateur Naive Bayes from scratch

---

## Exercice Pratique

**Énoncé** : Implémente un classificateur bayésien naïf from scratch pour classer des fruits.

1. Crée un petit dataset de fruits avec 3 caractéristiques : poids (g), diamètre (cm), couleur (0=vert, 1=jaune, 2=rouge)
2. 3 classes : pomme, banane, raisin
3. Entraîne le classificateur (calcule les moyennes et écarts-types par classe)
4. Classe 3 nouveaux fruits et affiche les probabilités par classe

**Indications** :

- Génère 50 exemples par classe avec `np.random.normal`
- Pommes : poids ~180g, diamètre ~8cm, couleur ~2 (rouge)
- Bananes : poids ~120g, diamètre ~3cm, couleur ~1 (jaune)
- Raisins : poids ~5g, diamètre ~1.5cm, couleur ~0 (vert)
- Utilise le logarithme pour la stabilité numérique

**Résultat attendu** : Le classificateur identifie correctement les 3 fruits de test avec des probabilités supérieures à 90%.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np

np.random.seed(42)

# --- Générer les données ---
n_per_class = 50

# Pommes : poids ~180g, diamètre ~8cm, couleur ~2
pommes = np.column_stack([
    np.random.normal(180, 20, n_per_class),   # Poids
    np.random.normal(8, 1, n_per_class),      # Diamètre
    np.random.normal(2, 0.3, n_per_class)     # Couleur (rouge)
])

# Bananes : poids ~120g, diamètre ~3cm, couleur ~1
bananes = np.column_stack([
    np.random.normal(120, 15, n_per_class),
    np.random.normal(3, 0.5, n_per_class),
    np.random.normal(1, 0.3, n_per_class)
])

# Raisins : poids ~5g, diamètre ~1.5cm, couleur ~0
raisins = np.column_stack([
    np.random.normal(5, 2, n_per_class),
    np.random.normal(1.5, 0.3, n_per_class),
    np.random.normal(0, 0.3, n_per_class)
])

# Assembler
X_train = np.vstack([pommes, bananes, raisins])
y_train = np.array([0]*n_per_class + [1]*n_per_class + [2]*n_per_class)
class_names = ['pomme', 'banane', 'raisin']

# --- Entraîner le modèle ---
params = {}
for c in range(3):
    mask = y_train == c
    X_c = X_train[mask]
    params[c] = {
        'prior': mask.mean(),
        'mean': X_c.mean(axis=0),
        'std': X_c.std(axis=0)
    }
    print(f"{class_names[c]:>8} : prior={params[c]['prior']:.2f}, "
          f"mean={np.round(params[c]['mean'], 1)}, "
          f"std={np.round(params[c]['std'], 1)}")

# --- Fonction de prédiction ---
def gaussian_log_pdf(x, mean, std):
    """Log-densité de probabilité gaussienne."""
    return -0.5 * np.log(2 * np.pi) - np.log(std) - 0.5 * ((x - mean) / std) ** 2

def predict_proba(x, params, n_classes=3):
    """Retourne les probabilités par classe."""
    log_posteriors = np.zeros(n_classes)
    for c in range(n_classes):
        log_posteriors[c] = np.log(params[c]['prior'])
        for i in range(len(x)):
            log_posteriors[c] += gaussian_log_pdf(
                x[i], params[c]['mean'][i], params[c]['std'][i]
            )

    # Convertir en probabilités via softmax
    # Soustraire le max pour la stabilité numérique
    log_posteriors -= log_posteriors.max()
    posteriors = np.exp(log_posteriors)
    posteriors /= posteriors.sum()
    return posteriors

# --- Tester sur 3 nouveaux fruits ---
test_fruits = [
    np.array([175, 7.5, 1.8]),    # Probablement une pomme
    np.array([115, 2.8, 1.1]),    # Probablement une banane
    np.array([4, 1.2, 0.2]),      # Probablement un raisin
]

print("\n--- Prédictions ---")
for fruit in test_fruits:
    probas = predict_proba(fruit, params)
    pred = np.argmax(probas)
    print(f"Fruit (poids={fruit[0]}g, diam={fruit[1]}cm, couleur={fruit[2]:.1f})")
    for c in range(3):
        bar = '#' * int(probas[c] * 50)
        print(f"  {class_names[c]:>8} : {probas[c]*100:6.2f}% {bar}")
    print(f"  -> Prediction : {class_names[pred]}")
    print()
```

**Résultat** :

```text
   pomme : prior=0.33, mean=[179.2   8.   2. ], std=[19.3  0.9  0.3]
  banane : prior=0.33, mean=[119.9   3.   1. ], std=[14.1  0.5  0.3]
  raisin : prior=0.33, mean=[  5.   1.5  0. ], std=[1.9 0.3 0.3]

--- Prédictions ---
Fruit (poids=175g, diam=7.5cm, couleur=1.8)
     pomme : 100.00% ##################################################
    banane :   0.00%
    raisin :   0.00%
  -> Prediction : pomme

Fruit (poids=115g, diam=2.8cm, couleur=1.1)
     pomme :   0.00%
    banane : 100.00% ##################################################
    raisin :   0.00%
  -> Prediction : banane

Fruit (poids=4g, diam=1.2cm, couleur=0.2)
     pomme :   0.00%
    banane :   0.00%
    raisin : 100.00% ##################################################
  -> Prediction : raisin
```

---

## Navigation

← Fiche précédente : **[02 - Calcul différentiel et optimisation](02-calcul-differentiel-optimisation.md)**

→ Fiche suivante : **[04 - Théorie de l'information](04-theorie-information.md)**
