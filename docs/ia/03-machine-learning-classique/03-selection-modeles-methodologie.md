---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "Sélection de modèles : cross-validation, biais-variance, métriques d'évaluation et optimisation d'hyperparamètres"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 3 - Machine learning classique"
---

# 03 - Sélection de modèles et méthodologie

> **En bref** : À la fin de cette fiche, tu sauras utiliser la cross-validation pour estimer la performance réelle d'un modèle, diagnostiquer l'underfitting et l'overfitting avec les learning curves, choisir les bonnes métriques d'évaluation, et optimiser les hyperparamètres avec GridSearchCV, RandomizedSearchCV et Optuna. Lecture estimée : 50 min.


## Prérequis

- Fiche **[01 - Apprentissage supervisé](01-apprentissage-supervise.md)** (cette phase) : régression, classification, train/test split, scikit-learn
- Fiche **[03 - Probabilités et statistiques](../01-fondamentaux-mathematiques/03-probabilites-statistiques.md)** (Phase 1) : espérance, variance, distributions
- Fiche **[01 - Python pour l'IA](../02-programmation-outils/01-python-pour-ia.md)** (Phase 2) : NumPy, Pandas, Matplotlib

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser la cross-validation pour estimer la performance réelle d'un modèle, diagnostiquer l'underfitting et l'overfitting avec les learning curves, choisir les bonnes métriques d'évaluation, et optimiser les hyperparamètres avec GridSearchCV, RandomizedSearchCV et Optuna.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la cross-validation ?

**Définition** : La cross-validation (validation croisée) est une technique d'évaluation qui divise les données en K sous-ensembles (folds). Le modèle est entraîné K fois, chaque fois sur K-1 folds et évalué sur le fold restant. Le score final est la moyenne des K évaluations.

**Le problème que la cross-validation résout** :

Sans cross-validation, voici les problèmes rencontrés :

1. **Un seul split n'est pas fiable** : avec un train/test split unique, le score dépend fortement de quels exemples tombent dans le test set
2. **Gaspillage de données** : mettre 20% de côté pour le test réduit les données d'entraînement
3. **Pas d'intervalle de confiance** : un seul score ne dit pas si le modèle est stable ou fluctuant

**Comment la cross-validation résout ces problèmes** :

| Problème | Solution apportée par la cross-validation |
| -------- | ----------------------------------------- |
| Split non fiable | Chaque exemple sert à la fois pour l'entraînement et l'évaluation |
| Gaspillage de données | Toutes les données sont utilisées pour l'entraînement (sur K-1 folds) |
| Pas d'intervalle de confiance | La moyenne et l'écart-type des K scores donnent une estimation fiable |

**Analogie concrète** : La cross-validation est comme un examen blanc en K versions. L'étudiant (le modèle) passe K examens différents. Chaque examen utilise des questions différentes (fold de test). La note finale est la moyenne des K examens. Un étudiant qui obtient 85, 87, 83, 86, 84 (faible écart-type) est plus fiable qu'un étudiant qui obtient 95, 60, 90, 70, 85 (fort écart-type).

**K-Fold Cross-Validation** :

```text
Données : [1] [2] [3] [4] [5]

Fold 1 : Train=[2,3,4,5]  Test=[1]  → Score 0.85
Fold 2 : Train=[1,3,4,5]  Test=[2]  → Score 0.87
Fold 3 : Train=[1,2,4,5]  Test=[3]  → Score 0.83
Fold 4 : Train=[1,2,3,5]  Test=[4]  → Score 0.86
Fold 5 : Train=[1,2,3,4]  Test=[5]  → Score 0.84

Score final : 0.85 ± 0.01
```

**Stratified K-Fold** : Variante qui garantit que chaque fold a la même proportion de classes. Indispensable quand les classes sont déséquilibrées (ex : 90% classe A, 10% classe B).

**Ce que la cross-validation n'est PAS** :

- La cross-validation n'est pas un algorithme d'apprentissage. C'est une méthode d'évaluation. Elle ne change pas le modèle, elle mesure sa performance de manière fiable.
- La cross-validation n'est pas un remplacement du test set. En pratique, on fait cross-validation sur le train set et on garde un test set final pour l'évaluation ultime.

---

### Qu'est-ce que le compromis biais-variance ?

**Définition** : Le compromis biais-variance décrit le dilemme fondamental en ML entre un modèle trop simple (biais élevé, sous-apprentissage) et un modèle trop complexe (variance élevée, sur-apprentissage). Le meilleur modèle minimise la somme des deux.

**Le problème que la compréhension du biais-variance résout** :

Sans comprendre le biais-variance, voici les problèmes rencontrés :

1. **Diagnostic impossible** : quand un modèle a de mauvaises performances, on ne sait pas si le problème vient de la simplicité ou de la complexité
2. **Ajustements contre-productifs** : augmenter la complexité d'un modèle qui overfitte aggrave le problème
3. **Collecte de données inutile** : ajouter des données n'aide pas si le modèle underfitte (biais élevé)

**Comment le diagnostic biais-variance résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Diagnostic impossible | Les learning curves révèlent si le modèle underfitte ou overfitte |
| Ajustements contre-productifs | On sait dans quelle direction ajuster la complexité |
| Collecte inutile | On sait si plus de données aideront ou non |

**Analogie concrète** : Imagine un tireur à l'arc. Le biais, c'est la précision systématique : toutes les flèches vont en haut à gauche (le modèle se trompe systématiquement). La variance, c'est la dispersion : les flèches sont éparpillées (le modèle change beaucoup selon les données d'entraînement). Le meilleur tireur a un faible biais (vise juste) et une faible variance (tire de manière régulière).

Le diagramme suivant illustre les trois zones du compromis biais-variance en fonction de la complexité du modèle.

<div class="diagram-design">
<p><a href="../../../diagrams/ia-03-machine-learning-classique-03-selection-modeles-methodologie-1.html">Qu&#x27;est-ce que le compromis biais-variance ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-03-machine-learning-classique-03-selection-modeles-methodologie-1.html" title="Qu&#x27;est-ce que le compromis biais-variance ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Diagnostic avec les learning curves** :

| Symptôme | Diagnostic | Action |
| -------- | ---------- | ------ |
| Score train élevé, score validation bas | Overfitting (haute variance) | Simplifier le modèle, régulariser, ajouter des données |
| Score train bas, score validation bas | Underfitting (haut biais) | Complexifier le modèle, ajouter des features |
| Score train et validation élevés et proches | Bon compromis | Le modèle est bien calibré |

**Ce que le compromis biais-variance n'est PAS** :

- Le biais-variance n'est pas un paramètre à régler. C'est un concept théorique pour diagnostiquer et orienter les choix de modélisation.
- Un modèle parfait (biais=0, variance=0) n'existe pas en pratique. Il y a toujours du bruit irréductible dans les données.

---

### Qu'est-ce que les métriques de classification ?

**Définition** : Les métriques de classification mesurent la qualité des prédictions d'un modèle de classification. Chaque métrique évalue un aspect différent de la performance.

**Le problème que les métriques résolvent** :

Sans métriques adaptées, voici les problèmes rencontrés :

1. **Accuracy trompeuse** : sur un dataset déséquilibré (99% vs 1%), un modèle qui prédit toujours la classe majoritaire a 99% d'accuracy
2. **Besoins métier différents** : détecter un cancer (minimiser les faux négatifs) n'a pas le même enjeu que filtrer du spam (minimiser les faux positifs)
3. **Pas de vision globale** : une seule métrique ne suffit pas pour comprendre les forces et faiblesses du modèle

**La matrice de confusion** :

```text
                    Prédit Positif    Prédit Négatif
Réel Positif           TP                  FN
Réel Négatif           FP                  TN

TP = True Positive  : correctement prédit comme positif
TN = True Negative  : correctement prédit comme négatif
FP = False Positive : faussement prédit comme positif (fausse alarme)
FN = False Negative : faussement prédit comme négatif (manqué)
```

**Métriques principales** :

| Métrique | Formule | Question à laquelle elle répond |
| -------- | ------- | ------------------------------- |
| Accuracy | (TP+TN) / Total | Quel % de prédictions est correct ? |
| Precision | TP / (TP+FP) | Parmi les prédictions positives, quel % est correct ? |
| Recall (Sensibilité) | TP / (TP+FN) | Parmi les vrais positifs, quel % est détecté ? |
| F1-score | 2*(P*R)/(P+R) | Moyenne harmonique de précision et recall |
| ROC-AUC | Aire sous la courbe ROC | Le modèle classe-t-il bien les positifs avant les négatifs ? |

**Quand utiliser quelle métrique** :

| Situation | Métrique prioritaire | Pourquoi |
| --------- | -------------------- | -------- |
| Classes équilibrées | Accuracy ou F1 | L'accuracy est fiable quand les classes sont équilibrées |
| Détection de maladie | Recall | Il vaut mieux de fausses alarmes que des cas manqués |
| Filtrage de spam | Precision | Il vaut mieux laisser passer un spam que bloquer un vrai email |
| Ranking (recommandation) | ROC-AUC | Mesure la capacité à ordonner les exemples |

**Analogie concrète** : Imagine un filet de pêche. La précision mesure quel % des poissons attrapés est de la bonne espèce (pas de déchets). Le recall mesure quel % de la bonne espèce dans le lac a été attrapé. Un filet très fin (haute précision) attrape peu de poissons mais uniquement les bons. Un filet très large (haut recall) attrape tous les bons poissons mais aussi beaucoup de déchets.

---

### Qu'est-ce que les métriques de régression ?

**Définition** : Les métriques de régression mesurent l'écart entre les valeurs prédites et les valeurs réelles pour les problèmes de régression (prédiction de valeurs continues).

**Métriques principales** :

| Métrique | Formule simplifiée | Interprétation |
| -------- | ------------------- | -------------- |
| MSE | Moyenne((yi - y_pred_i)²) | Erreur quadratique moyenne (pénalise les grosses erreurs) |
| RMSE | Racine(MSE) | Même unité que y (plus interprétable que MSE) |
| MAE | Moyenne(abs(yi - y_pred_i)) | Erreur absolue moyenne (robuste aux outliers) |
| R² | 1 - (MSE / Variance(y)) | % de variance expliqué (1.0 = parfait, 0 = prédit la moyenne) |

**Quand utiliser quelle métrique** :

| Situation | Métrique prioritaire | Pourquoi |
| --------- | -------------------- | -------- |
| Pas d'outliers | MSE / RMSE | Pénalise les grosses erreurs |
| Avec outliers | MAE | Plus robuste aux valeurs extrêmes |
| Comparaison entre datasets | R² | Normalisé entre 0 et 1, indépendant de l'échelle |

---

### Qu'est-ce que l'optimisation d'hyperparamètres ?

**Définition** : L'optimisation d'hyperparamètres est le processus de recherche des meilleurs réglages d'un modèle. Les hyperparamètres (ex : `max_depth`, `learning_rate`) ne sont pas appris par le modèle, ils sont fixés avant l'entraînement.

**Le problème que l'optimisation d'hyperparamètres résout** :

Sans optimisation d'hyperparamètres, voici les problèmes rencontrés :

1. **Valeurs par défaut sous-optimales** : les hyperparamètres par défaut de sklearn ne sont pas adaptés à chaque dataset
2. **Tuning manuel fastidieux** : tester manuellement des combinaisons est lent et non systématique
3. **Overfitting sur le test set** : ajuster les hyperparamètres en regardant le score de test crée un biais

**Comment l'optimisation d'hyperparamètres résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Valeurs par défaut | La recherche explore systématiquement l'espace des hyperparamètres |
| Tuning manuel | GridSearch et RandomizedSearch automatisent le processus |
| Overfitting test set | L'optimisation se fait en cross-validation, le test set reste intact |

**Analogie concrète** : L'optimisation d'hyperparamètres est comme régler un amplificateur de guitare. Les boutons (basses, aigus, volume) sont les hyperparamètres. GridSearch teste toutes les combinaisons de réglages. RandomizedSearch teste des combinaisons aléatoires (plus rapide). Optuna essaie un réglage, écoute le résultat, et ajuste intelligemment le bouton suivant.

**Trois méthodes** :

| Méthode | Principe | Avantage | Inconvénient |
| ------- | -------- | -------- | ------------ |
| GridSearchCV | Teste toutes les combinaisons | Exhaustif, trouve le meilleur | Lent si beaucoup de paramètres |
| RandomizedSearchCV | Teste N combinaisons aléatoires | Plus rapide que Grid | Peut manquer le meilleur |
| Optuna | Optimisation bayésienne (apprend des résultats précédents) | Intelligent, rapide | Plus complexe à mettre en place |

**Ce que l'optimisation d'hyperparamètres n'est PAS** :

- L'optimisation d'hyperparamètres n'est pas un remplacement pour le choix du bon algorithme. Si un arbre de décision est fondamentalement inadapté au problème, aucun tuning ne le sauvera.
- L'optimisation d'hyperparamètres ne doit pas se faire sur le test set. Les hyperparamètres sont optimisés en cross-validation sur le train set.

---

## Étapes Pratiques

### Étape 1 : Cross-validation de base

```python
import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier

# Charger le dataset
data = load_breast_cancer()
X, y = data.data, data.target

# Cross-validation 5-Fold stratifiée
rf = RandomForestClassifier(n_estimators=100, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Calculer les scores
scores = cross_val_score(rf, X, y, cv=cv, scoring='accuracy')

print("=== Cross-Validation (5-Fold Stratifié) ===")
print(f"Scores par fold : {scores}")
print(f"Accuracy moyenne : {scores.mean():.4f} (+/- {scores.std():.4f})")
```

**Résultat attendu** :

```text
=== Cross-Validation (5-Fold Stratifié) ===
Scores par fold : [0.9474 0.9649 0.9561 0.9649 0.9558]
Accuracy moyenne : 0.9578 (+/- 0.0066)
```

---

### Étape 2 : Tracer les learning curves

```python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

# Calculer les learning curves
train_sizes, train_scores, val_scores = learning_curve(
    RandomForestClassifier(n_estimators=100, random_state=42),
    X, y,
    train_sizes=np.linspace(0.1, 1.0, 10),  # De 10% à 100% des données
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

# Calculer les moyennes et écart-types
train_mean = train_scores.mean(axis=1)
train_std = train_scores.std(axis=1)
val_mean = val_scores.mean(axis=1)
val_std = val_scores.std(axis=1)

# Tracer
plt.figure(figsize=(10, 6))
plt.plot(train_sizes, train_mean, 'o-', label='Score entraînement', color='blue')
plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color='blue')
plt.plot(train_sizes, val_mean, 'o-', label='Score validation', color='orange')
plt.fill_between(train_sizes, val_mean - val_std, val_mean + val_std, alpha=0.1, color='orange')
plt.xlabel('Nombre d\'exemples d\'entraînement')
plt.ylabel('Accuracy')
plt.title('Learning Curves - Random Forest')
plt.legend(loc='lower right')
plt.grid(True, alpha=0.3)
plt.savefig('learning_curves.png', dpi=100, bbox_inches='tight')
plt.show()

# Diagnostic
print(f"Score train final  : {train_mean[-1]:.4f}")
print(f"Score val final    : {val_mean[-1]:.4f}")
gap = train_mean[-1] - val_mean[-1]
print(f"Gap train-val      : {gap:.4f}")
if gap > 0.05:
    print("Diagnostic : Possible overfitting (gap > 0.05)")
elif val_mean[-1] < 0.80:
    print("Diagnostic : Possible underfitting (score val < 0.80)")
else:
    print("Diagnostic : Bon compromis biais-variance")
```

**Résultat attendu** :

```text
Score train final  : 1.0000
Score val final    : 0.9578
Gap train-val      : 0.0422
Diagnostic : Bon compromis biais-variance
```

---

### Étape 3 : Matrice de confusion et métriques détaillées

```python
from sklearn.model_selection import train_test_split
from sklearn.metrics import (confusion_matrix, classification_report,
                             ConfusionMatrixDisplay, roc_auc_score)

# Split pour les métriques détaillées
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Entraîner
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)
y_proba = rf.predict_proba(X_test)[:, 1]  # Probabilité de la classe 1

# Matrice de confusion
cm = confusion_matrix(y_test, y_pred)
print("=== Matrice de Confusion ===")
print(f"{'':>15} Prédit Malin  Prédit Bénin")
print(f"{'Réel Malin':>15}    {cm[0,0]:>5}         {cm[0,1]:>5}")
print(f"{'Réel Bénin':>15}    {cm[1,0]:>5}         {cm[1,1]:>5}")

# Rapport de classification
print("\n=== Rapport de Classification ===")
print(classification_report(y_test, y_pred, target_names=data.target_names))

# ROC-AUC
roc = roc_auc_score(y_test, y_proba)
print(f"ROC-AUC : {roc:.4f}")

# Visualiser la matrice de confusion
fig, ax = plt.subplots(figsize=(6, 5))
ConfusionMatrixDisplay.from_predictions(
    y_test, y_pred, display_labels=data.target_names, ax=ax, cmap='Blues'
)
plt.title('Matrice de Confusion')
plt.savefig('confusion_matrix.png', dpi=100, bbox_inches='tight')
plt.show()
```

**Résultat attendu** :

```text
=== Matrice de Confusion ===
                Prédit Malin  Prédit Bénin
    Réel Malin       40             3
    Réel Bénin        1            70

=== Rapport de Classification ===
              precision    recall  f1-score   support

   malignant       0.98      0.93      0.95        43
      benign       0.96      0.99      0.97        71

    accuracy                           0.96       114

ROC-AUC : 0.9953
```

---

### Étape 4 : GridSearchCV

```python
from sklearn.model_selection import GridSearchCV

# Définir la grille d'hyperparamètres
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 10, None],
    'min_samples_leaf': [1, 2, 5]
}
# Nombre total de combinaisons : 3 * 4 * 3 = 36 combinaisons
# Avec 5-fold CV : 36 * 5 = 180 entraînements

# Créer le GridSearch
grid_search = GridSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
    scoring='f1_macro',        # Optimiser le F1 macro
    n_jobs=-1,                  # Tous les coeurs
    verbose=1                   # Afficher la progression
)

# Lancer la recherche
grid_search.fit(X_train, y_train)

# Résultats
print("\n=== GridSearchCV ===")
print(f"Meilleurs hyperparamètres : {grid_search.best_params_}")
print(f"Meilleur F1 (CV) : {grid_search.best_score_:.4f}")

# Évaluer sur le test set
y_pred_best = grid_search.best_estimator_.predict(X_test)
from sklearn.metrics import f1_score
print(f"F1 sur test set : {f1_score(y_test, y_pred_best, average='macro'):.4f}")
```

**Résultat attendu** :

```text
Fitting 5 folds for each of 36 candidates, totalling 180 fits

=== GridSearchCV ===
Meilleurs hyperparamètres : {'max_depth': 10, 'min_samples_leaf': 1, 'n_estimators': 200}
Meilleur F1 (CV) : 0.9575
F1 sur test set : 0.9627
```

---

### Étape 5 : RandomizedSearchCV

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

# Définir les distributions pour la recherche aléatoire
param_distributions = {
    'n_estimators': randint(50, 500),        # Entier entre 50 et 500
    'max_depth': randint(3, 20),             # Entier entre 3 et 20
    'min_samples_leaf': randint(1, 10),      # Entier entre 1 et 10
    'min_samples_split': randint(2, 20),     # Entier entre 2 et 20
    'max_features': uniform(0.3, 0.7)        # Flottant entre 0.3 et 1.0
}

# Créer le RandomizedSearch
random_search = RandomizedSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_distributions=param_distributions,
    n_iter=50,                 # Tester 50 combinaisons aléatoires
    cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
    scoring='f1_macro',
    random_state=42,
    n_jobs=-1,
    verbose=1
)

random_search.fit(X_train, y_train)

print("\n=== RandomizedSearchCV ===")
print(f"Meilleurs hyperparamètres : {random_search.best_params_}")
print(f"Meilleur F1 (CV) : {random_search.best_score_:.4f}")

y_pred_rand = random_search.best_estimator_.predict(X_test)
print(f"F1 sur test set : {f1_score(y_test, y_pred_rand, average='macro'):.4f}")
```

**Résultat attendu** :

```text
Fitting 5 folds for each of 50 candidates, totalling 250 fits

=== RandomizedSearchCV ===
Meilleurs hyperparamètres : {'max_depth': 12, 'max_features': 0.58, 'min_samples_leaf': 2, 'min_samples_split': 8, 'n_estimators': 347}
Meilleur F1 (CV) : 0.9618
F1 sur test set : 0.9627
```

---

### Étape 6 : Optimisation avec Optuna

```python
import optuna
from sklearn.model_selection import cross_val_score

# Désactiver les logs verbeux d'Optuna
optuna.logging.set_verbosity(optuna.logging.WARNING)

def objective(trial):
    """Fonction objectif que Optuna va optimiser."""
    # Suggérer des hyperparamètres
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 500),
        'max_depth': trial.suggest_int('max_depth', 3, 20),
        'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
        'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
        'max_features': trial.suggest_float('max_features', 0.3, 1.0),
        'random_state': 42
    }

    # Entraîner et évaluer en cross-validation
    rf = RandomForestClassifier(**params)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(rf, X_train, y_train, cv=cv, scoring='f1_macro')

    return scores.mean()

# Lancer l'optimisation
study = optuna.create_study(direction='maximize')  # Maximiser le F1
study.optimize(objective, n_trials=50)

# Résultats
print("=== Optuna ===")
print(f"Meilleurs hyperparamètres : {study.best_params}")
print(f"Meilleur F1 (CV) : {study.best_value:.4f}")

# Entraîner avec les meilleurs hyperparamètres
best_rf = RandomForestClassifier(**study.best_params, random_state=42)
best_rf.fit(X_train, y_train)
y_pred_optuna = best_rf.predict(X_test)
print(f"F1 sur test set : {f1_score(y_test, y_pred_optuna, average='macro'):.4f}")
```

**Résultat attendu** :

```text
=== Optuna ===
Meilleurs hyperparamètres : {'n_estimators': 284, 'max_depth': 15, 'min_samples_leaf': 1, 'min_samples_split': 5, 'max_features': 0.72}
Meilleur F1 (CV) : 0.9619
F1 sur test set : 0.9627
```

---

## Commandes Utiles

| Code Python | Action |
| ----------- | ------ |
| `cross_val_score(model, X, y, cv=5)` | Cross-validation 5-Fold |
| `StratifiedKFold(n_splits=5, shuffle=True)` | K-Fold stratifié |
| `learning_curve(model, X, y, cv=5)` | Calculer les learning curves |
| `confusion_matrix(y_true, y_pred)` | Matrice de confusion |
| `classification_report(y_true, y_pred)` | Rapport complet (précision, recall, F1) |
| `roc_auc_score(y_true, y_proba)` | Score ROC-AUC |
| `GridSearchCV(model, param_grid, cv=5)` | Recherche exhaustive d'hyperparamètres |
| `RandomizedSearchCV(model, param_dist, n_iter=50)` | Recherche aléatoire d'hyperparamètres |
| `optuna.create_study(direction='maximize')` | Créer une étude Optuna |

---

## Pièges Fréquents

### Piège 1 : Évaluer les hyperparamètres sur le test set

⚠️ **Problème** : Ajuster les hyperparamètres en regardant le score sur le test set. Le modèle "apprend" indirectement les caractéristiques du test set, ce qui fausse l'évaluation finale.

✅ **Solution** : Toujours utiliser la cross-validation pour optimiser les hyperparamètres. Le test set ne sert qu'une seule fois, pour l'évaluation finale.

```text
Données totales
├── Train set (80%)  → Cross-validation pour tuning + entraînement final
└── Test set (20%)   → Évaluation finale (une seule fois)
```

---

### Piège 2 : Se fier uniquement à l'accuracy

⚠️ **Problème** : Un dataset avec 95% de classe A donne 95% d'accuracy avec un modèle qui prédit toujours A. Le modèle est inutile mais l'accuracy semble excellente.

✅ **Solution** : Toujours vérifier la matrice de confusion et les métriques par classe (précision, recall, F1). Utiliser F1-macro pour un score unique qui tient compte de toutes les classes.

---

### Piège 3 : Oublier de fixer random_state en cross-validation

⚠️ **Problème** : Sans `random_state`, les folds changent à chaque exécution. Deux runs du même code donnent des résultats différents, rendant la comparaison de modèles impossible.

✅ **Solution** : Toujours fixer `random_state` dans `StratifiedKFold` et dans le modèle pour la reproductibilité.

```python
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
model = RandomForestClassifier(random_state=42)
```

---

### Piège 4 : Confondre GridSearch et RandomizedSearch

⚠️ **Problème** : Utiliser GridSearch avec 5 paramètres ayant chacun 10 valeurs = 100 000 combinaisons. Avec 5-fold CV = 500 000 entraînements. Le calcul prend des heures.

✅ **Solution** : Utiliser GridSearch pour 2-3 paramètres avec peu de valeurs. Utiliser RandomizedSearch ou Optuna pour des espaces de recherche plus grands.

---

## Checklist de Validation

- [ ] Je sais implémenter une cross-validation 5-Fold stratifiée
- [ ] Je sais tracer et interpréter les learning curves
- [ ] Je comprends la différence entre underfitting et overfitting
- [ ] Je sais calculer et interpréter la matrice de confusion
- [ ] Je connais la différence entre accuracy, précision, recall, F1 et ROC-AUC
- [ ] Je sais quand utiliser quelle métrique selon le contexte
- [ ] Je sais utiliser GridSearchCV et RandomizedSearchCV
- [ ] Je sais utiliser Optuna pour l'optimisation bayésienne
- [ ] Je comprends pourquoi on n'optimise jamais les hyperparamètres sur le test set

---

## Exercice Pratique

**Énoncé** : Construis un pipeline complet de sélection de modèle pour le dataset Digits de scikit-learn (classification de chiffres manuscrits 0-9). Compare 3 modèles avec cross-validation, optimise le meilleur avec GridSearchCV, et produis un rapport de métriques complet.

**Indications** :

- Charge le dataset avec `from sklearn.datasets import load_digits`
- Ce dataset contient 1 797 images 8x8 de chiffres (10 classes) avec 64 features
- Compare : Régression Logistique, Random Forest, XGBoost
- Utilise 5-Fold stratifié avec `scoring='f1_macro'`
- Optimise le meilleur modèle avec GridSearchCV (au moins 3 hyperparamètres)
- Évalue le modèle optimisé sur un test set (20%) avec : matrice de confusion, classification_report, ROC-AUC (one-vs-rest)
- Trace les learning curves du modèle final

**Résultat attendu** : Un tableau comparatif des 3 modèles, les meilleurs hyperparamètres, et un rapport de métriques complet.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.model_selection import (train_test_split, cross_val_score,
                                     StratifiedKFold, GridSearchCV, learning_curve)
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (classification_report, confusion_matrix,
                             ConfusionMatrixDisplay, f1_score, roc_auc_score)

# 1. Charger et préparer
digits = load_digits()
X, y = digits.data, digits.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Normaliser pour la régression logistique
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"Dataset : {X.shape[0]} images, {X.shape[1]} features, {len(np.unique(y))} classes")

# 2. Comparer 3 modèles en cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
models = {
    'Régression Logistique': (LogisticRegression(max_iter=5000, random_state=42), X_train_scaled),
    'Random Forest': (RandomForestClassifier(n_estimators=100, random_state=42), X_train),
    'XGBoost': (XGBClassifier(n_estimators=100, eval_metric='mlogloss', random_state=42), X_train)
}

print("\n=== Comparaison par cross-validation ===")
results = []
for name, (model, X_data) in models.items():
    scores = cross_val_score(model, X_data, y_train, cv=cv, scoring='f1_macro')
    results.append({'Modèle': name, 'F1 moyen': round(scores.mean(), 4),
                    'Écart-type': round(scores.std(), 4)})
    print(f"{name:30s} : F1 = {scores.mean():.4f} (+/- {scores.std():.4f})")

# 3. Optimiser le meilleur (XGBoost ou celui qui a le meilleur F1)
print("\n=== Optimisation XGBoost avec GridSearchCV ===")
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.05, 0.1, 0.2]
}

grid = GridSearchCV(
    XGBClassifier(eval_metric='mlogloss', random_state=42),
    param_grid, cv=cv, scoring='f1_macro', n_jobs=-1, verbose=1
)
grid.fit(X_train, y_train)

print(f"Meilleurs hyperparamètres : {grid.best_params_}")
print(f"Meilleur F1 (CV) : {grid.best_score_:.4f}")

# 4. Évaluer sur le test set
y_pred = grid.best_estimator_.predict(X_test)
y_proba = grid.best_estimator_.predict_proba(X_test)

print("\n=== Rapport de Classification (Test Set) ===")
print(classification_report(y_test, y_pred))

# ROC-AUC one-vs-rest
roc = roc_auc_score(y_test, y_proba, multi_class='ovr')
print(f"ROC-AUC (one-vs-rest) : {roc:.4f}")

# 5. Matrice de confusion
fig, ax = plt.subplots(figsize=(10, 8))
ConfusionMatrixDisplay.from_predictions(y_test, y_pred, ax=ax, cmap='Blues')
plt.title('Matrice de Confusion - XGBoost optimisé')
plt.savefig('confusion_digits.png', dpi=100, bbox_inches='tight')
plt.show()

# 6. Learning curves
train_sizes, train_scores, val_scores = learning_curve(
    grid.best_estimator_, X_train, y_train,
    train_sizes=np.linspace(0.1, 1.0, 10), cv=5, scoring='f1_macro', n_jobs=-1
)

plt.figure(figsize=(10, 6))
plt.plot(train_sizes, train_scores.mean(axis=1), 'o-', label='Train', color='blue')
plt.plot(train_sizes, val_scores.mean(axis=1), 'o-', label='Validation', color='orange')
plt.xlabel("Nombre d'exemples")
plt.ylabel('F1 macro')
plt.title('Learning Curves - XGBoost optimisé')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('learning_curves_digits.png', dpi=100, bbox_inches='tight')
plt.show()
```

**Résultat attendu** :

```text
Dataset : 1797 images, 64 features, 10 classes

=== Comparaison par cross-validation ===
Régression Logistique          : F1 = 0.9602 (+/- 0.0085)
Random Forest                  : F1 = 0.9557 (+/- 0.0102)
XGBoost                        : F1 = 0.9577 (+/- 0.0098)

=== Optimisation XGBoost avec GridSearchCV ===
Meilleurs hyperparamètres : {'learning_rate': 0.2, 'max_depth': 5, 'n_estimators': 200}
Meilleur F1 (CV) : 0.9687

ROC-AUC (one-vs-rest) : 0.9992
```

---

## Navigation

← Fiche précédente : **[02 - Apprentissage non supervisé](02-apprentissage-non-supervise.md)**

→ Fiche suivante : **[04 - scikit-learn en profondeur](04-scikit-learn-profondeur.md)**
