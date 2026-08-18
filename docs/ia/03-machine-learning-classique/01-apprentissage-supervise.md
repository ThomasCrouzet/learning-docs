---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "Apprentissage supervisé : régression linéaire/logistique, arbres de décision, Random Forest et XGBoost avec scikit-learn"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 3 - Machine learning classique"
---

# 01 - Apprentissage supervisé

> **En bref** : À la fin de cette fiche, tu sauras expliquer le principe de l'apprentissage supervisé, implémenter les algorithmes classiques (régression linéaire, régression logistique, arbres de décision, Random Forest, XGBoost) avec scikit-learn, interpréter leurs résultats et comparer leurs performances sur un jeu de données réel. Lecture estimée : 55 min.


## Prérequis

- Fiche **[01 - Algèbre linéaire](../01-fondamentaux-mathematiques/01-algebre-lineaire.md)** (Phase 1) : vecteurs, matrices, produit matriciel
- Fiche **[02 - Calcul différentiel et optimisation](../01-fondamentaux-mathematiques/02-calcul-differentiel-optimisation.md)** (Phase 1) : dérivées, gradient, descente de gradient
- Fiche **[03 - Probabilités et statistiques](../01-fondamentaux-mathematiques/03-probabilites-statistiques.md)** (Phase 1) : distributions, espérance, variance
- Fiche **[01 - Python pour l'IA](../02-programmation-outils/01-python-pour-ia.md)** (Phase 2) : NumPy, Pandas, Matplotlib
- Fiche **[03 - Manipulation et ingénierie des données](../02-programmation-outils/03-manipulation-ingenierie-donnees.md)** (Phase 2) : nettoyage, normalisation, train/test split

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le principe de l'apprentissage supervisé, implémenter les algorithmes classiques (régression linéaire, régression logistique, arbres de décision, Random Forest, XGBoost) avec scikit-learn, interpréter leurs résultats et comparer leurs performances sur un jeu de données réel.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'apprentissage supervisé ?

**Définition** : L'apprentissage supervisé est un type de machine learning où l'algorithme apprend à partir de données étiquetées. Chaque exemple d'entraînement est une paire (entrée, sortie attendue). L'algorithme cherche une fonction qui associe les entrées aux sorties correctes.

**Le problème que l'apprentissage supervisé résout** :

Sans apprentissage supervisé, voici les problèmes rencontrés :

1. **Règles manuelles impossibles** : pour prédire le prix d'une maison à partir de 50 caractéristiques, écrire des règles if/else à la main est irréaliste
2. **Patterns invisibles** : les relations entre variables sont souvent non linéaires et trop complexes pour l'intuition humaine
3. **Pas de généralisation** : un expert peut analyser 100 cas, mais pas 100 000

**Comment l'apprentissage supervisé résout ces problèmes** :

| Problème | Solution apportée par l'apprentissage supervisé |
| -------- | ------------------------------------------------ |
| Règles manuelles impossibles | L'algorithme découvre automatiquement les règles à partir des données |
| Patterns invisibles | L'algorithme détecte des relations complexes entre variables |
| Pas de généralisation | Une fois entraîné, le modèle prédit sur de nouvelles données en millisecondes |

**Analogie concrète** : Imagine un apprenti cuisinier qui goûte 1 000 plats notés par un jury (les données étiquetées). Chaque plat a une recette (les features : quantité de sel, temps de cuisson, température). Après avoir analysé les notes du jury (le target), l'apprenti peut prédire la note d'un nouveau plat sans le goûter, uniquement à partir de sa recette.

**Ce que l'apprentissage supervisé n'est PAS** :

- L'apprentissage supervisé n'est pas de l'apprentissage non supervisé. En non supervisé, il n'y a pas d'étiquettes : l'algorithme cherche des structures (groupes, patterns) sans savoir ce qui est "correct".
- L'apprentissage supervisé n'est pas de la programmation classique. En programmation, tu écris les règles. En ML supervisé, l'algorithme découvre les règles à partir des exemples.

**Vocabulaire essentiel** :

| Terme | Définition | Exemple |
| ----- | ---------- | ------- |
| Features (X) | Les variables d'entrée | Surface, nombre de pièces, quartier |
| Target (y) | La variable à prédire | Prix de la maison |
| Train set | Données utilisées pour l'apprentissage | 80% du dataset |
| Test set | Données réservées pour l'évaluation | 20% du dataset |
| fit() | Entraîner le modèle sur les données | `model.fit(X_train, y_train)` |
| predict() | Faire des prédictions sur de nouvelles données | `model.predict(X_test)` |

**Deux types de problèmes supervisés** :

| Régression | Classification |
| ---------- | -------------- |
| Prédire une valeur continue | Prédire une catégorie |
| Prix d'une maison : 250 000 EUR | Spam ou pas spam : oui/non |
| Température demain : 22.5°C | Type de fleur : setosa/versicolor/virginica |
| Métrique : MSE, RMSE, R² | Métrique : accuracy, précision, recall, F1 |

Le diagramme suivant montre le pipeline classique d'un projet de ML supervisé, de la collecte des données à la prédiction.

<div class="diagram-design">
<p><a href="../../../diagrams/ia-03-machine-learning-classique-01-apprentissage-supervise-1.html">Qu&#x27;est-ce que l&#x27;apprentissage supervisé ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-03-machine-learning-classique-01-apprentissage-supervise-1.html" title="Qu&#x27;est-ce que l&#x27;apprentissage supervisé ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que la régression linéaire ?

**Définition** : La régression linéaire est un algorithme qui modélise la relation entre des variables d'entrée (features) et une variable de sortie continue (target) par une équation linéaire : y = w1*x1 + w2*x2 + ... + wn*xn + b.

**Le problème que la régression linéaire résout** :

Sans régression linéaire, voici les problèmes rencontrés :

1. **Pas de prédiction quantitative** : impossible d'estimer une valeur numérique à partir de variables explicatives
2. **Pas d'interprétation** : impossible de savoir quel facteur influence le plus le résultat
3. **Pas de baseline** : sans modèle simple de référence, impossible de savoir si un modèle complexe apporte vraiment un gain

**Comment la régression linéaire résout ces problèmes** :

| Problème | Solution apportée par la régression linéaire |
| -------- | --------------------------------------------- |
| Pas de prédiction quantitative | L'équation y = wX + b donne une prédiction numérique pour chaque entrée |
| Pas d'interprétation | Chaque coefficient w indique l'influence de sa variable sur le résultat |
| Pas de baseline | La régression linéaire sert de modèle de référence simple et rapide |

**Analogie concrète** : La régression linéaire est comme une balance à plateaux. Chaque feature est un poids posé sur un plateau. Le coefficient (w) indique la lourdeur de chaque poids. Le biais (b) est le poids initial de la balance à vide. Le résultat final est la somme de tous les poids.

**Équation et termes** :

```text
y = w1*x1 + w2*x2 + ... + wn*xn + b

y  : la prédiction (target)
xi : les features (variables d'entrée)
wi : les coefficients (poids) - appris par l'algorithme
b  : le biais (intercept) - valeur quand toutes les features sont à 0
```

**Fonction de coût : MSE (Mean Squared Error)** :

```text
MSE = (1/n) * Somme((yi_réel - yi_prédit)²)

- On calcule l'erreur pour chaque exemple (différence entre réel et prédit)
- On met cette erreur au carré (pour pénaliser les grosses erreurs)
- On fait la moyenne sur tous les exemples
```

**Ce que la régression linéaire n'est PAS** :

- La régression linéaire n'est pas adaptée aux relations non linéaires. Si la relation entre X et y est une courbe (quadratique, exponentielle), la régression linéaire donnera de mauvais résultats.
- La régression linéaire n'est pas un classificateur. Elle prédit des valeurs continues, pas des catégories.

---

### Qu'est-ce que la régression logistique ?

**Définition** : La régression logistique est un algorithme de classification binaire qui utilise la fonction sigmoïde pour transformer une combinaison linéaire de features en probabilité (entre 0 et 1).

**Le problème que la régression logistique résout** :

Sans régression logistique, voici les problèmes rencontrés :

1. **Pas de probabilité** : la régression linéaire peut prédire des valeurs en dehors de [0, 1], ce qui n'a pas de sens pour une probabilité
2. **Pas de décision boundary** : impossible de tracer une frontière de décision entre deux classes
3. **Pas de classification interprétable** : les modèles plus complexes (forêts, réseaux) sont des boîtes noires

**Comment la régression logistique résout ces problèmes** :

| Problème | Solution apportée par la régression logistique |
| -------- | ----------------------------------------------- |
| Pas de probabilité | La sigmoïde compresse toute valeur dans [0, 1] |
| Pas de décision boundary | Le seuil (par défaut 0.5) sépare les deux classes |
| Pas de classification interprétable | Les coefficients indiquent l'influence de chaque feature sur la probabilité |

**Analogie concrète** : La régression logistique est comme un détecteur de fumée réglable. Le capteur mesure la concentration de fumée (combinaison linéaire). La sigmoïde transforme cette mesure en probabilité d'incendie (0% à 100%). Le seuil (0.5) déclenche l'alarme ou non.

**Fonction sigmoïde** :

```text
sigma(z) = 1 / (1 + exp(-z))

- z = w1*x1 + w2*x2 + ... + wn*xn + b  (combinaison linéaire)
- Si z est très positif → sigma(z) ≈ 1 (classe positive)
- Si z est très négatif → sigma(z) ≈ 0 (classe négative)
- Si z = 0 → sigma(z) = 0.5 (frontière de décision)
```

**Ce que la régression logistique n'est PAS** :

- La régression logistique n'est pas une régression. Malgré son nom, c'est un algorithme de classification.
- La régression logistique n'est pas limitée au binaire. Avec la stratégie One-vs-Rest, elle gère aussi la classification multi-classes.

---

### Qu'est-ce qu'un arbre de décision ?

**Définition** : Un arbre de décision est un algorithme qui apprend des règles de décision sous forme d'arbre. À chaque nœud, il pose une question sur une feature (ex. : "surface > 50 m² ?") et oriente vers la branche gauche (oui) ou droite (non) jusqu'à atteindre une feuille qui donne la prédiction.

**Le problème que les arbres de décision résolvent** :

Sans arbres de décision, voici les problèmes rencontrés :

1. **Relations non linéaires** : la régression linéaire et logistique ne captent pas les interactions complexes entre variables
2. **Pas d'explicabilité visuelle** : impossible de montrer visuellement les règles de décision
3. **Données mixtes** : certains algorithmes ne gèrent pas bien le mélange de features numériques et catégorielles

**Comment les arbres de décision résolvent ces problèmes** :

| Problème | Solution apportée par les arbres de décision |
| -------- | --------------------------------------------- |
| Relations non linéaires | Les splits successifs capturent des interactions complexes |
| Pas d'explicabilité visuelle | L'arbre se dessine et les règles se lisent de haut en bas |
| Données mixtes | Les arbres gèrent nativement numériques et catégorielles |

**Analogie concrète** : Un arbre de décision est comme le jeu de devinettes "Qui est-ce ?". À chaque tour, tu poses une question binaire ("a-t-il des lunettes ?") pour éliminer des candidats. Après quelques questions bien choisies, tu identifies la bonne personne. L'arbre fait pareil avec les données.

**Critères de split** :

| Critère | Formule simplifiée | Utilisation |
| ------- | ------------------- | ----------- |
| Gini impurity | Gini = 1 - Somme(pi²) | Classification (défaut sklearn) |
| Entropy | Entropy = -Somme(pi * log2(pi)) | Classification |
| MSE | Moyenne des erreurs quadratiques | Régression |

**Hyperparamètres importants** :

| Paramètre | Rôle | Valeur par défaut |
| --------- | ---- | ----------------- |
| `max_depth` | Profondeur maximale de l'arbre | None (pas de limite) |
| `min_samples_split` | Nombre minimum d'exemples pour couper un nœud | 2 |
| `min_samples_leaf` | Nombre minimum d'exemples dans une feuille | 1 |
| `max_features` | Nombre de features à considérer pour chaque split | None (toutes) |

**Ce que les arbres de décision ne sont PAS** :

- Un arbre de décision n'est pas robuste seul. Un arbre unique overfitte facilement. C'est pourquoi on utilise des ensembles d'arbres (Random Forest, XGBoost).
- Un arbre de décision n'est pas linéaire. Contrairement à la régression, il crée des frontières de décision rectangulaires.

---

### Qu'est-ce que Random Forest ?

**Définition** : Random Forest est un algorithme d'ensemble qui entraîne plusieurs arbres de décision sur des sous-échantillons aléatoires des données (bagging) et combine leurs prédictions par vote majoritaire (classification) ou moyenne (régression).

**Le problème que Random Forest résout** :

Sans Random Forest, voici les problèmes rencontrés :

1. **Overfitting d'un arbre seul** : un arbre unique mémorise le bruit des données d'entraînement
2. **Instabilité** : changer un seul exemple peut modifier tout l'arbre
3. **Pas de mesure d'importance** : on ne sait pas quelles features contribuent le plus

**Comment Random Forest résout ces problèmes** :

| Problème | Solution apportée par Random Forest |
| -------- | ------------------------------------ |
| Overfitting | La moyenne de plusieurs arbres réduit la variance |
| Instabilité | Le bagging (Bootstrap AGGregatING) rend le modèle robuste aux variations |
| Pas de mesure d'importance | La feature importance mesure la contribution de chaque variable |

**Analogie concrète** : Random Forest est comme un jury dans un procès. Chaque juré (arbre) voit une partie des preuves (sous-échantillon) et se concentre sur certains indices (sous-ensemble de features). Le verdict final (prédiction) est le résultat du vote de tous les jurés. Un juré peut se tromper, mais le groupe a raison plus souvent qu'un individu seul.

**Fonctionnement du bagging** :

1. Créer N sous-échantillons en tirant aléatoirement avec remise (bootstrap)
2. Entraîner un arbre sur chaque sous-échantillon
3. À chaque split, ne considérer qu'un sous-ensemble aléatoire de features
4. Combiner les prédictions : vote majoritaire (classification) ou moyenne (régression)

**Out-of-bag (OOB) score** : Chaque arbre est entraîné sur environ 63% des données (à cause du tirage avec remise). Les 37% restants (out-of-bag) servent de jeu de test gratuit pour estimer la performance sans cross-validation.

**Ce que Random Forest n'est PAS** :

- Random Forest n'est pas un seul arbre amélioré. C'est un ensemble de plusieurs centaines d'arbres indépendants.
- Random Forest n'est pas du boosting. Le bagging entraîne les arbres en parallèle et indépendamment. Le boosting les entraîne séquentiellement.

---

### Qu'est-ce que XGBoost / Gradient Boosting ?

**Définition** : Le Gradient Boosting est un algorithme d'ensemble qui entraîne des arbres de décision séquentiellement. Chaque nouvel arbre corrige les erreurs du précédent en se concentrant sur les résidus (différences entre prédictions et valeurs réelles).

**Le problème que le Gradient Boosting résout** :

Sans Gradient Boosting, voici les problèmes rencontrés :

1. **Erreurs systématiques** : Random Forest réduit la variance mais pas le biais
2. **Pas d'apprentissage progressif** : chaque arbre de Random Forest ignore les erreurs des autres
3. **Performances plafonnées** : pour les données tabulaires complexes, Random Forest atteint un plateau

**Comment le Gradient Boosting résout ces problèmes** :

| Problème | Solution apportée par le Gradient Boosting |
| -------- | ------------------------------------------- |
| Erreurs systématiques | Chaque arbre corrige les erreurs résiduelles du modèle actuel |
| Pas d'apprentissage progressif | Les arbres sont ajoutés séquentiellement, chacun apprenant des échecs précédents |
| Performances plafonnées | XGBoost/LightGBM dominent les compétitions Kaggle sur données tabulaires |

**Analogie concrète** : Le Gradient Boosting est comme un étudiant qui révise un examen en plusieurs passes. À la première lecture, il comprend l'essentiel. À la deuxième, il se concentre sur ce qu'il n'a pas compris. À la troisième, il travaille les détails restants. Chaque passe corrige les lacunes de la précédente.

**Hyperparamètres importants** :

| Paramètre | Rôle | Valeur typique |
| --------- | ---- | -------------- |
| `n_estimators` | Nombre d'arbres séquentiels | 100-1000 |
| `learning_rate` | Contribution de chaque arbre (plus petit = plus lent mais plus précis) | 0.01-0.3 |
| `max_depth` | Profondeur de chaque arbre (faible : voir colonne valeur) | 3-8 |
| `subsample` | Fraction des données utilisées par arbre | 0.7-1.0 |
| `reg_alpha` | Régularisation L1 (réduit les features inutiles) | 0-10 |
| `reg_lambda` | Régularisation L2 (réduit la complexité) | 0-10 |

**Comparaison Random Forest vs XGBoost** :

| Random Forest | XGBoost |
| ------------- | ------- |
| Arbres en parallèle (bagging) | Arbres séquentiels (boosting) |
| Réduit la variance | Réduit le biais et la variance |
| Peu de tuning nécessaire | Nécessite un tuning fin des hyperparamètres |
| Robuste à l'overfitting | Peut overfitter sans régularisation |
| Entraînement parallélisable | Entraînement séquentiel (mais XGBoost parallélise les splits) |

---

## Étapes Pratiques

### Étape 1 : Charger et préparer le dataset

On utilise le dataset Breast Cancer de scikit-learn : classification binaire (tumeur maligne ou bénigne) avec 30 features numériques.

```python
# Importer les bibliothèques nécessaires
import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

# Charger le dataset
data = load_breast_cancer()

# Créer un DataFrame pour une meilleure lisibilité
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target  # 0 = maligne, 1 = bénigne

# Vérifier les dimensions
print(f"Nombre d'exemples : {X.shape[0]}")
print(f"Nombre de features : {X.shape[1]}")
print(f"Distribution des classes : {np.bincount(y)}")
# bincount compte le nombre d'occurrences de chaque valeur dans y

# Séparer en train (80%) et test (20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,       # 20% pour le test
    random_state=42,     # Reproductibilité : même split à chaque exécution
    stratify=y           # Garde la même proportion de classes dans train et test
)

print(f"Train : {X_train.shape[0]} exemples")
print(f"Test : {X_test.shape[0]} exemples")
```

**Résultat attendu** :

```text
Nombre d'exemples : 569
Nombre de features : 30
Distribution des classes : [212 357]
Train : 455 exemples
Test : 114 exemples
```

---

### Étape 2 : Entraîner une régression logistique

```python
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

# Normaliser les features (important pour la régression logistique)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # fit + transform sur le train
X_test_scaled = scaler.transform(X_test)         # transform uniquement sur le test

# Créer et entraîner le modèle
log_reg = LogisticRegression(
    max_iter=1000,     # Nombre maximum d'itérations pour la convergence
    random_state=42
)
log_reg.fit(X_train_scaled, y_train)

# Prédire sur le test set
y_pred_lr = log_reg.predict(X_test_scaled)

# Évaluer les performances
print("=== Régression Logistique ===")
print(f"Accuracy : {accuracy_score(y_test, y_pred_lr):.4f}")
print(classification_report(y_test, y_pred_lr, target_names=data.target_names))
```

**Résultat attendu** :

```text
=== Régression Logistique ===
Accuracy : 0.9737

              precision    recall  f1-score   support

   malignant       0.98      0.95      0.96        43
      benign       0.97      0.99      0.98        71

    accuracy                           0.97       114
```

---

### Étape 3 : Entraîner un arbre de décision

```python
from sklearn.tree import DecisionTreeClassifier

# Créer et entraîner l'arbre de décision
tree = DecisionTreeClassifier(
    max_depth=5,           # Limiter la profondeur pour éviter l'overfitting
    min_samples_leaf=5,    # Au moins 5 exemples par feuille
    random_state=42
)
# Les arbres ne nécessitent pas de normalisation
tree.fit(X_train, y_train)

# Prédire
y_pred_tree = tree.predict(X_test)

# Évaluer
print("=== Arbre de Décision ===")
print(f"Accuracy : {accuracy_score(y_test, y_pred_tree):.4f}")

# Afficher les 5 features les plus importantes
importances = pd.Series(tree.feature_importances_, index=X.columns)
print("\nTop 5 features :")
print(importances.nlargest(5))
```

**Résultat attendu** :

```text
=== Arbre de Décision ===
Accuracy : 0.9386

Top 5 features :
worst perimeter           0.7204
worst concave points      0.1038
mean texture              0.0584
area error                0.0362
worst texture             0.0327
```

---

### Étape 4 : Entraîner un Random Forest

```python
from sklearn.ensemble import RandomForestClassifier

# Créer et entraîner le Random Forest
rf = RandomForestClassifier(
    n_estimators=200,       # 200 arbres dans la forêt
    max_depth=10,           # Profondeur maximale de chaque arbre
    min_samples_leaf=2,     # Au moins 2 exemples par feuille
    oob_score=True,         # Calculer le score out-of-bag
    random_state=42,
    n_jobs=-1               # Utiliser tous les coeurs du CPU
)
rf.fit(X_train, y_train)

# Prédire
y_pred_rf = rf.predict(X_test)

# Évaluer
print("=== Random Forest ===")
print(f"Accuracy test : {accuracy_score(y_test, y_pred_rf):.4f}")
print(f"OOB score     : {rf.oob_score_:.4f}")

# Feature importance
importances_rf = pd.Series(rf.feature_importances_, index=X.columns)
print("\nTop 5 features :")
print(importances_rf.nlargest(5))
```

**Résultat attendu** :

```text
=== Random Forest ===
Accuracy test : 0.9649
OOB score     : 0.9604

Top 5 features :
worst perimeter           0.1452
worst concave points      0.1381
mean concave points       0.1120
worst radius              0.1053
mean perimeter            0.0612
```

---

### Étape 5 : Entraîner un XGBoost

```python
from xgboost import XGBClassifier

# Créer et entraîner le modèle XGBoost
xgb = XGBClassifier(
    n_estimators=200,       # 200 arbres séquentiels
    learning_rate=0.1,      # Pas d'apprentissage
    max_depth=5,            # Profondeur maximale de chaque arbre
    subsample=0.8,          # 80% des données par arbre
    colsample_bytree=0.8,   # 80% des features par arbre
    reg_alpha=0.1,          # Régularisation L1
    reg_lambda=1.0,         # Régularisation L2
    random_state=42,
    eval_metric='logloss'   # Métrique d'évaluation interne
)
xgb.fit(X_train, y_train)

# Prédire
y_pred_xgb = xgb.predict(X_test)

# Évaluer
print("=== XGBoost ===")
print(f"Accuracy : {accuracy_score(y_test, y_pred_xgb):.4f}")

# Feature importance
importances_xgb = pd.Series(
    xgb.feature_importances_, index=X.columns
)
print("\nTop 5 features :")
print(importances_xgb.nlargest(5))
```

**Résultat attendu** :

```text
=== XGBoost ===
Accuracy : 0.9737

Top 5 features :
worst concave points      0.2314
worst perimeter           0.1487
mean concave points       0.0892
worst radius              0.0651
area error                0.0438
```

---

### Étape 6 : Comparer tous les modèles

```python
from sklearn.metrics import f1_score

# Récapitulatif des performances
results = pd.DataFrame({
    'Modèle': ['Régression Logistique', 'Arbre de Décision', 'Random Forest', 'XGBoost'],
    'Accuracy': [
        accuracy_score(y_test, y_pred_lr),
        accuracy_score(y_test, y_pred_tree),
        accuracy_score(y_test, y_pred_rf),
        accuracy_score(y_test, y_pred_xgb)
    ],
    'F1 (macro)': [
        f1_score(y_test, y_pred_lr, average='macro'),
        f1_score(y_test, y_pred_tree, average='macro'),
        f1_score(y_test, y_pred_rf, average='macro'),
        f1_score(y_test, y_pred_xgb, average='macro')
    ]
})

# Trier par accuracy décroissante
results = results.sort_values('Accuracy', ascending=False)
print(results.to_string(index=False))
```

**Résultat attendu** :

```text
               Modèle  Accuracy  F1 (macro)
Régression Logistique    0.9737      0.9706
              XGBoost    0.9737      0.9706
        Random Forest    0.9649      0.9601
    Arbre de Décision    0.9386      0.9333
```

---

## Commandes Utiles

| Code Python | Action |
| ----------- | ------ |
| `model.fit(X_train, y_train)` | Entraîner le modèle |
| `model.predict(X_test)` | Prédire les classes |
| `model.predict_proba(X_test)` | Prédire les probabilités par classe |
| `model.feature_importances_` | Importance des features (arbres uniquement) |
| `model.coef_` | Coefficients du modèle (régression linéaire/logistique) |
| `accuracy_score(y_true, y_pred)` | Calculer l'accuracy |
| `classification_report(y_true, y_pred)` | Rapport complet (précision, recall, F1) |
| `train_test_split(X, y, test_size=0.2)` | Séparer en train et test |

---

## Pièges Fréquents

### Piège 1 : Oublier de normaliser les features pour la régression logistique

⚠️ **Problème** : La régression logistique (et les SVM, KNN) est sensible à l'échelle des features. Si une feature va de 0 à 1 000 et une autre de 0 à 1, l'algorithme donne plus de poids à la première.

✅ **Solution** : Toujours utiliser `StandardScaler` ou `MinMaxScaler` avant la régression logistique. Les arbres de décision, Random Forest et XGBoost ne nécessitent pas de normalisation.

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # fit sur train uniquement
X_test_scaled = scaler.transform(X_test)         # pas de fit sur test
```

---

### Piège 2 : Utiliser fit_transform sur le test set

⚠️ **Problème** : Appeler `scaler.fit_transform(X_test)` au lieu de `scaler.transform(X_test)`. Cela recalcule la moyenne et l'écart-type sur le test set, ce qui crée un data leakage.

✅ **Solution** : Le scaler doit apprendre les paramètres (fit) uniquement sur le train. Sur le test, on applique seulement la transformation (transform).

---

### Piège 3 : Ne pas limiter la profondeur d'un arbre de décision

⚠️ **Problème** : Un arbre sans `max_depth` grandit jusqu'à classer parfaitement chaque exemple d'entraînement, ce qui signifie qu'il mémorise le bruit (overfitting).

✅ **Solution** : Toujours fixer `max_depth` (3 à 10 typiquement) ou `min_samples_leaf` (5 à 20 typiquement) pour limiter la complexité de l'arbre.

---

### Piège 4 : Ignorer le class imbalance

⚠️ **Problème** : Si 95% des exemples sont de classe A et 5% de classe B, un modèle qui prédit toujours A obtient 95% d'accuracy mais ne détecte jamais B.

✅ **Solution** : Utiliser `class_weight='balanced'` dans les modèles sklearn, ou `scale_pos_weight` dans XGBoost. Évaluer avec F1, précision et recall plutôt que l'accuracy seule.

```python
# sklearn
rf = RandomForestClassifier(class_weight='balanced')

# XGBoost
xgb = XGBClassifier(scale_pos_weight=ratio_negatifs_sur_positifs)
```

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre apprentissage supervisé et non supervisé
- [ ] Je comprends la différence entre régression et classification
- [ ] Je sais implémenter et interpréter une régression linéaire
- [ ] Je sais implémenter et interpréter une régression logistique
- [ ] Je comprends les critères de split des arbres de décision (Gini, entropy)
- [ ] Je sais expliquer la différence entre bagging (Random Forest) et boosting (XGBoost)
- [ ] Je sais utiliser `feature_importances_` pour interpréter un modèle
- [ ] J'ai entraîné et comparé 4 modèles sur un dataset réel

---

## Exercice Pratique

**Énoncé** : Compare 4 modèles de classification (régression logistique, arbre de décision, Random Forest, XGBoost) sur le dataset Wine de scikit-learn. Produis un tableau comparatif et identifie le meilleur modèle.

**Indications** :

- Charge le dataset avec `from sklearn.datasets import load_wine`
- Ce dataset contient 178 vins classés en 3 catégories (multi-classes) avec 13 features chimiques
- Normalise les données pour la régression logistique
- Utilise un split 80/20 stratifié avec `random_state=42`
- Évalue chaque modèle avec accuracy et F1-score (macro)
- Affiche les 3 features les plus importantes pour le Random Forest

**Résultat attendu** : Un tableau comparatif des 4 modèles trié par accuracy décroissante, et la liste des 3 features les plus importantes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, f1_score

# 1. Charger le dataset
wine = load_wine()
X = pd.DataFrame(wine.data, columns=wine.feature_names)
y = wine.target

print(f"Dataset : {X.shape[0]} vins, {X.shape[1]} features, {len(np.unique(y))} classes")

# 2. Split train/test stratifié
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Normalisation pour la régression logistique
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Entraîner les 4 modèles
models = {
    'Régression Logistique': LogisticRegression(max_iter=1000, random_state=42),
    'Arbre de Décision': DecisionTreeClassifier(max_depth=5, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1),
    'XGBoost': XGBClassifier(n_estimators=200, learning_rate=0.1, random_state=42,
                              eval_metric='mlogloss')
}

results = []

for name, model in models.items():
    # La régression logistique utilise les données normalisées
    if 'Logistique' in name:
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='macro')
    results.append({'Modèle': name, 'Accuracy': round(acc, 4), 'F1 (macro)': round(f1, 4)})

# 5. Afficher le tableau comparatif
df_results = pd.DataFrame(results).sort_values('Accuracy', ascending=False)
print("\n=== Comparaison des modèles ===")
print(df_results.to_string(index=False))

# 6. Top 3 features (Random Forest)
rf_model = models['Random Forest']
importances = pd.Series(rf_model.feature_importances_, index=X.columns)
print("\n=== Top 3 features (Random Forest) ===")
print(importances.nlargest(3))
```

**Résultat attendu** :

```text
Dataset : 178 vins, 13 features, 3 classes

=== Comparaison des modèles ===
               Modèle  Accuracy  F1 (macro)
              XGBoost    1.0000      1.0000
        Random Forest    1.0000      1.0000
Régression Logistique    0.9722      0.9714
    Arbre de Décision    0.9167      0.9122

=== Top 3 features (Random Forest) ===
flavanoids                0.1685
color_intensity           0.1534
proline                   0.1327
```

---

## Navigation

→ Fiche suivante : **[02 - Apprentissage non supervisé](02-apprentissage-non-supervise.md)**
