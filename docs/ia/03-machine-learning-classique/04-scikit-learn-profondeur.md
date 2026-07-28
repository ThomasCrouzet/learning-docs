---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "scikit-learn en profondeur : Pipelines, transformers custom, ColumnTransformer, feature sélection et MLflow"
estimated_time: "50 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 3 - Machine learning classique"
---

# 04 - scikit-learn en profondeur

> **En bref** : À la fin de cette fiche, tu sauras construire des Pipelines scikit-learn complets, créer des transformers custom, utiliser ColumnTransformer pour traiter différemment les features numériques et catégorielles, appliquer la feature sélection, et tracker les expériences avec MLflow. Lecture estimée : 50 min.


## Prérequis

- Fiche **[01 - Apprentissage supervisé](01-apprentissage-supervise.md)** (cette phase) : modèles sklearn, fit/predict, train/test split
- Fiche **[02 - Apprentissage non supervisé](02-apprentissage-non-supervise.md)** (cette phase) : PCA, StandardScaler
- Fiche **[03 - Sélection de modèles et méthodologie](03-selection-modeles-methodologie.md)** (cette phase) : cross-validation, GridSearchCV, métriques
- Fiche **[03 - Manipulation et ingénierie des données](../02-programmation-outils/03-manipulation-ingenierie-donnees.md)** (Phase 2) : nettoyage, feature engineering

## Objectif de cette fiche

À la fin de cette fiche, tu sauras construire des Pipelines scikit-learn complets, créer des transformers custom, utiliser ColumnTransformer pour traiter différemment les features numériques et catégorielles, appliquer la feature sélection, et tracker les expériences avec MLflow.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Pipeline scikit-learn ?

**Définition** : Un Pipeline scikit-learn est un objet qui chaîne une séquence d'étapes de transformation et un estimateur final. Chaque étape (sauf la dernière) est un transformer (avec `fit` et `transform`). La dernière étape est un estimateur (avec `fit` et `predict`).

**Le problème que les Pipelines résolvent** :

Sans Pipelines, voici les problèmes rencontrés :

1. **Data leakage** : si tu normalises les données avant le train/test split, le scaler apprend des informations du test set (sa moyenne et son écart-type), ce qui biaise l'évaluation
2. **Code fragile** : appliquer manuellement chaque transformation (normalisation, imputation, encoding) est source d'erreurs et d'oublis
3. **Reproductibilité impossible** : sans encapsulation, il est difficile de garantir que les mêmes transformations sont appliquées à l'entraînement et à l'inférence

**Comment les Pipelines résolvent ces problèmes** :

| Problème | Solution apportée par les Pipelines |
| -------- | ----------------------------------- |
| Data leakage | Le `fit` de chaque étape est appelé uniquement sur le train set pendant la cross-validation |
| Code fragile | Toutes les étapes sont encapsulées dans un objet unique |
| Reproductibilité | Le même pipeline s'applique identiquement au train, à la validation et à la production |

**Analogie concrète** : Un Pipeline est comme une chaîne de montage dans une usine. La matière première (les données brutes) entre à une extrémité. Chaque poste de travail (transformer) effectue une transformation précise (nettoyer, découper, assembler). À la sortie, le produit final (la prédiction) est prêt. Si tu changes un poste, la chaîne s'adapte automatiquement.

**Structure d'un Pipeline** :

```text
Pipeline([
    ('étape_1', Transformer_1),   # ex: StandardScaler
    ('étape_2', Transformer_2),   # ex: PCA
    ('modèle', Estimateur)        # ex: RandomForestClassifier
])

Quand tu appelles pipeline.fit(X_train, y_train) :
  1. Transformer_1.fit(X_train) puis X_temp = Transformer_1.transform(X_train)
  2. Transformer_2.fit(X_temp) puis X_temp = Transformer_2.transform(X_temp)
  3. Estimateur.fit(X_temp, y_train)

Quand tu appelles pipeline.predict(X_test) :
  1. X_temp = Transformer_1.transform(X_test)  (pas de fit !)
  2. X_temp = Transformer_2.transform(X_temp)  (pas de fit !)
  3. Estimateur.predict(X_temp)
```

**Ce qu'un Pipeline n'est PAS** :

- Un Pipeline n'est pas un simple script séquentiel. C'est un objet scikit-learn qui s'intègre nativement avec `cross_val_score`, `GridSearchCV` et `joblib` (sauvegarde/chargement).
- Un Pipeline n'est pas limité à sklearn. Tu peux y intégrer des transformers custom et des modèles de n'importe quelle bibliothèque (via un wrapper).

---

### Qu'est-ce qu'un transformer custom ?

**Définition** : Un transformer custom est une classe Python qui hérite de `BaseEstimator` et `TransformerMixin` de scikit-learn. Il implémente les méthodes `fit` et `transform` pour effectuer une transformation spécifique sur les données.

**Le problème que les transformers custom résolvent** :

Sans transformers custom, voici les problèmes rencontrés :

1. **Transformations non standard** : sklearn ne fournit pas de transformer pour chaque besoin métier (ex : créer un ratio entre deux colonnes, appliquer une règle métier)
2. **Code hors pipeline** : les transformations faites en dehors du pipeline ne bénéficient pas de la protection contre le data leakage
3. **Pas de réutilisation** : sans encapsulation, la même transformation doit être réécrite à chaque fois

**Comment les transformers custom résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Transformations non standard | Tu crées un transformer pour n'importe quelle logique métier |
| Code hors pipeline | Le transformer custom s'intègre dans un Pipeline et est protégé par la cross-validation |
| Pas de réutilisation | Le transformer est une classe réutilisable dans tous tes projets |

**Analogie concrète** : Un transformer custom est comme un outil spécialisé que tu fabriques toi-même pour ta chaîne de montage. L'usine (sklearn) fournit des outils standards (tournevis, marteau), mais pour une opération spécifique à ton produit (plier un composant à 37 degrés), tu crées ton propre outil qui s'emboîte parfaitement dans la chaîne.

**Template d'un transformer custom** :

```python
from sklearn.base import BaseEstimator, TransformerMixin

class MonTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, parametre=1.0):
        # Stocker les paramètres (hyperparamètres du transformer)
        self.parametre = parametre

    def fit(self, X, y=None):
        # Apprendre les paramètres à partir des données d'entraînement
        # Exemple : calculer la moyenne, min, max, etc.
        return self  # Toujours retourner self

    def transform(self, X):
        # Appliquer la transformation
        # Utiliser les paramètres appris dans fit()
        return X_transforme
```

**Ce qu'un transformer custom n'est PAS** :

- Un transformer custom n'est pas une fonction simple. C'est une classe avec un état (les paramètres appris dans `fit`). Si ta transformation n'a pas besoin de `fit`, utilise `FunctionTransformer` à la place.
- Un transformer custom n'a pas besoin de `y`. Le paramètre `y=None` est obligatoire dans la signature de `fit` mais n'est utilisé que si ta transformation dépend de la cible.

---

### Qu'est-ce que ColumnTransformer ?

**Définition** : ColumnTransformer est un transformer scikit-learn qui applique des transformations différentes à des sous-ensembles de colonnes. Il permet de traiter les features numériques (normalisation, imputation) et catégorielles (encoding) dans le même pipeline.

**Le problème que ColumnTransformer résout** :

Sans ColumnTransformer, voici les problèmes rencontrés :

1. **Traitement hétérogène** : les features numériques nécessitent une normalisation, les catégorielles un encoding, mais on ne peut pas appliquer `StandardScaler` à une colonne catégorielle
2. **Code spaghetti** : séparer manuellement les colonnes, les transformer indépendamment, puis les recombiner est complexe et fragile
3. **Pas d'intégration pipeline** : les transformations séparées ne peuvent pas être encapsulées dans un seul Pipeline

**Comment ColumnTransformer résout ces problèmes** :

| Problème | Solution apportée par ColumnTransformer |
| -------- | --------------------------------------- |
| Traitement hétérogène | Chaque groupe de colonnes a sa propre chaîne de transformations |
| Code spaghetti | Un seul objet gère toutes les transformations |
| Pas d'intégration | ColumnTransformer s'intègre dans un Pipeline comme n'importe quel transformer |

**Analogie concrète** : ColumnTransformer est comme un trieur postal. Les lettres (colonnes) sont réparties dans différents bacs (numérique, catégoriel). Chaque bac passe par un traitement différent (les numériques sont pesées et normalisées, les catégorielles sont étiquetées). À la sortie, toutes les lettres sont recombinées dans un seul sac.

**Structure** :

```text
ColumnTransformer([
    ('num', Pipeline_numerique, colonnes_numeriques),
    ('cat', Pipeline_categoriel, colonnes_categorielles)
])
```

**Ce que ColumnTransformer n'est PAS** :

- ColumnTransformer n'est pas un Pipeline. C'est un transformer qui s'utilise comme étape dans un Pipeline. Il ne peut pas contenir un estimateur final.
- ColumnTransformer ne gère pas les colonnes manquantes automatiquement. Si une colonne listée n'existe pas dans les données, il y aura une erreur.

---

### Qu'est-ce que la feature sélection ?

**Définition** : La feature sélection (sélection de features) est le processus de sélection d'un sous-ensemble des features les plus pertinentes pour le modèle. Contrairement à PCA qui crée de nouvelles features, la feature sélection garde les features originales.

**Le problème que la feature sélection résout** :

Sans feature sélection, voici les problèmes rencontrés :

1. **Bruit** : des features non pertinentes ajoutent du bruit et réduisent la performance
2. **Overfitting** : plus de features = plus de paramètres à apprendre = plus de risque d'overfitting
3. **Lenteur** : plus de features = temps d'entraînement plus long

**Comment la feature sélection résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Bruit | Les features non pertinentes sont éliminées |
| Overfitting | Moins de features = modèle plus simple et plus robuste |
| Lenteur | Moins de features = entraînement plus rapide |

**Analogie concrète** : La feature sélection est comme un chef cuisinier qui choisit ses ingrédients. Avec 100 ingrédients disponibles, il sélectionne les 10 qui apportent vraiment du goût au plat. Les 90 autres, même s'ils ne sont pas nocifs, diluent les saveurs et compliquent la recette.

**Trois méthodes principales** :

| Méthode | Principe | Exemple sklearn |
| ------- | -------- | --------------- |
| Filter | Score statistique indépendant du modèle | `SelectKBest(mutual_info_classif, k=10)` |
| Wrapper | Évalue des sous-ensembles de features avec le modèle | `RFE(estimator, n_features_to_select=10)` |
| Embedded | Le modèle lui-même évalue l'importance des features | `SelectFromModel(RandomForestClassifier())` |

**Comparaison des méthodes** :

| Filter | Wrapper (RFE) | Embedded |
| ------ | ------------- | -------- |
| Rapide | Lent (entraîne le modèle plusieurs fois) | Rapide (un seul entraînement) |
| Indépendant du modèle | Dépend du modèle | Dépend du modèle |
| Peut manquer des interactions | Capture les interactions | Capture les interactions |

---

### Qu'est-ce que MLflow ?

**Définition** : MLflow est une plateforme open-source pour le cycle de vie du machine learning. Le composant MLflow Tracking permet de logger les paramètres, métriques et artefacts (modèles, graphiques) de chaque expérience pour les comparer facilement.

**Le problème que MLflow résout** :

Sans MLflow, voici les problèmes rencontrés :

1. **Pas de traçabilité** : après 50 expériences avec différents paramètres, impossible de se rappeler quelle combinaison a donné le meilleur résultat
2. **Comparaison manuelle** : noter les résultats dans un tableur est fastidieux et source d'erreurs
3. **Reproductibilité** : sans les paramètres exacts, impossible de reproduire un résultat

**Comment MLflow résout ces problèmes** :

| Problème | Solution apportée par MLflow |
| -------- | ---------------------------- |
| Pas de traçabilité | Chaque run est enregistré avec ses paramètres, métriques et artefacts |
| Comparaison manuelle | L'interface web permet de comparer visuellement les runs |
| Reproductibilité | Les paramètres et le modèle sont sauvegardés pour chaque run |

**Analogie concrète** : MLflow est comme un carnet de laboratoire numérique. Chaque expérience est consignée avec la date, les ingrédients utilisés (paramètres), les résultats obtenus (métriques) et une photo du résultat (artefacts). Tu peux feuilleter le carnet pour trouver la meilleure recette et la reproduire exactement.

**Vocabulaire MLflow** :

| Terme | Définition |
| ----- | ---------- |
| Experiment | Un groupe d'essais liés au même projet |
| Run | Un essai individuel (un entraînement de modèle) |
| Parameter | Un hyperparamètre logué (`mlflow.log_param`) |
| Metric | Un score logué (`mlflow.log_metric`) |
| Artifact | Un fichier logué (modèle, graphique, csv) (`mlflow.log_artifact`) |

**Ce que MLflow n'est PAS** :

- MLflow n'est pas un outil d'entraînement. Il ne remplace pas scikit-learn ou PyTorch. Il track et enregistre les résultats des entraînements faits avec ces bibliothèques.
- MLflow n'est pas obligatoire pour commencer. C'est un outil de professionnalisation. Pour un projet personnel simple, un print des résultats suffit. MLflow devient indispensable quand les expériences se multiplient.

---

## Étapes Pratiques

### Étape 1 : Créer un Pipeline simple

```python
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score

# Charger les données
data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Créer un Pipeline : normalisation → PCA → Random Forest
pipeline = Pipeline([
    ('scaler', StandardScaler()),               # Étape 1 : normaliser
    ('pca', PCA(n_components=10)),               # Étape 2 : réduire à 10 dimensions
    ('classifier', RandomForestClassifier(       # Étape 3 : classifier
        n_estimators=100, random_state=42
    ))
])

# Entraîner le pipeline complet
pipeline.fit(X_train, y_train)

# Prédire (les transformations sont appliquées automatiquement)
score = pipeline.score(X_test, y_test)
print(f"Accuracy du pipeline : {score:.4f}")

# Cross-validation (le pipeline est traité comme un seul estimateur)
cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='accuracy')
print(f"CV Accuracy : {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
```

**Résultat attendu** :

```text
Accuracy du pipeline : 0.9561
CV Accuracy : 0.9516 (+/- 0.0186)
```

---

### Étape 2 : Créer un transformer custom

```python
from sklearn.base import BaseEstimator, TransformerMixin

class RatioFeatures(BaseEstimator, TransformerMixin):
    """
    Transformer qui ajoute des ratios entre paires de features.
    Utile quand les ratios entre mesures sont plus informatifs
    que les mesures brutes.
    """

    def __init__(self, feature_pairs=None):
        """
        feature_pairs : liste de tuples (nom_feature_1, nom_feature_2)
        Pour chaque paire, on crée une feature ratio = feature_1 / feature_2
        """
        self.feature_pairs = feature_pairs

    def fit(self, X, y=None):
        # Ce transformer n'a rien à apprendre des données
        # On stocke les noms de colonnes pour la validation
        if isinstance(X, pd.DataFrame):
            self.feature_names_in_ = list(X.columns)
        return self

    def transform(self, X):
        # Copier pour ne pas modifier l'original
        X_copy = X.copy()

        if self.feature_pairs is None:
            return X_copy

        for feat_1, feat_2 in self.feature_pairs:
            if isinstance(X_copy, pd.DataFrame):
                # Ajouter le ratio comme nouvelle colonne
                ratio_name = f"{feat_1}_div_{feat_2}"
                X_copy[ratio_name] = X_copy[feat_1] / (X_copy[feat_2] + 1e-8)
                # + 1e-8 pour éviter la division par zéro
            else:
                # Si c'est un array numpy, ajouter une colonne
                idx_1 = self.feature_names_in_.index(feat_1)
                idx_2 = self.feature_names_in_.index(feat_2)
                ratio = X_copy[:, idx_1] / (X_copy[:, idx_2] + 1e-8)
                X_copy = np.column_stack([X_copy, ratio])

        return X_copy

# Tester le transformer custom
ratio_transformer = RatioFeatures(
    feature_pairs=[
        ('mean radius', 'mean texture'),
        ('mean area', 'mean perimeter')
    ]
)

# Avant transformation
print(f"Features avant : {X_train.shape[1]}")

# Appliquer le transformer
X_train_ratio = ratio_transformer.fit_transform(X_train)
print(f"Features après : {X_train_ratio.shape[1]}")
print(f"Nouvelles colonnes : {list(X_train_ratio.columns[-2:])}")
```

**Résultat attendu** :

```text
Features avant : 30
Features après : 32
Nouvelles colonnes : ['mean radius_div_mean texture', 'mean area_div_mean perimeter']
```

---

### Étape 3 : Utiliser ColumnTransformer

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder

# Créer un dataset de démonstration avec colonnes mixtes
np.random.seed(42)
n = 500
df_demo = pd.DataFrame({
    'age': np.random.randint(18, 70, n),
    'revenu': np.random.normal(45000, 15000, n),
    'nb_achats': np.random.randint(0, 50, n),
    'ville': np.random.choice(['Paris', 'Lyon', 'Marseille', 'Bordeaux'], n),
    'categorie': np.random.choice(['A', 'B', 'C'], n),
    'cible': np.random.randint(0, 2, n)
})

# Introduire des valeurs manquantes
df_demo.loc[np.random.choice(n, 30), 'revenu'] = np.nan
df_demo.loc[np.random.choice(n, 20), 'ville'] = np.nan

X_demo = df_demo.drop('cible', axis=1)
y_demo = df_demo['cible']

# Identifier les colonnes par type
cols_numeriques = ['age', 'revenu', 'nb_achats']
cols_categorielles = ['ville', 'categorie']

# Définir les transformations par type de colonne
preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline([
            ('imputer', SimpleImputer(strategy='median')),  # Remplacer NaN par la médiane
            ('scaler', StandardScaler())                     # Normaliser
        ]), cols_numeriques),
        ('cat', Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),  # Remplacer NaN par le mode
            ('encoder', OneHotEncoder(handle_unknown='ignore'))    # One-hot encoding
        ]), cols_categorielles)
    ],
    remainder='drop'  # Ignorer les colonnes non listées
)

# Pipeline complet : preprocessing + modèle
pipeline_complet = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Split et évaluation
X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(
    X_demo, y_demo, test_size=0.2, random_state=42
)

pipeline_complet.fit(X_train_d, y_train_d)
score = pipeline_complet.score(X_test_d, y_test_d)
print(f"Accuracy du pipeline ColumnTransformer : {score:.4f}")

# Vérifier les features générées
preprocessor.fit(X_train_d)
feature_names_num = cols_numeriques
feature_names_cat = preprocessor.named_transformers_['cat']['encoder'].get_feature_names_out(cols_categorielles)
print(f"\nFeatures numériques : {feature_names_num}")
print(f"Features catégorielles : {list(feature_names_cat)}")
print(f"Total features après preprocessing : {len(feature_names_num) + len(feature_names_cat)}")
```

**Résultat attendu** :

```text
Accuracy du pipeline ColumnTransformer : 0.5200

Features numériques : ['age', 'revenu', 'nb_achats']
Features catégorielles : ['ville_Bordeaux', 'ville_Lyon', 'ville_Marseille', 'ville_Paris', 'categorie_A', 'categorie_B', 'categorie_C']
Total features après preprocessing : 10
```

L'accuracy est faible car les données sont aléatoires (pas de relation réelle entre features et cible). Ce qui compte ici, c'est la structure du pipeline.

---

### Étape 4 : Feature sélection avec SelectKBest

```python
from sklearn.feature_selection import SelectKBest, mutual_info_classif

# Revenir au dataset Breast Cancer
# Pipeline avec feature selection
pipeline_fs = Pipeline([
    ('scaler', StandardScaler()),
    ('selector', SelectKBest(                   # Sélectionner les K meilleures features
        score_func=mutual_info_classif,          # Score : information mutuelle
        k=10                                     # Garder 10 features
    )),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Évaluer
cv_scores_fs = cross_val_score(pipeline_fs, X_train, y_train, cv=5, scoring='accuracy')
print(f"CV Accuracy (30 features) : {cv_scores.mean():.4f}")
print(f"CV Accuracy (10 features) : {cv_scores_fs.mean():.4f}")

# Identifier les features sélectionnées
pipeline_fs.fit(X_train, y_train)
selector = pipeline_fs.named_steps['selector']
selected_mask = selector.get_support()
selected_features = X.columns[selected_mask]
print(f"\nFeatures sélectionnées ({len(selected_features)}) :")
for f in selected_features:
    print(f"  - {f}")
```

**Résultat attendu** :

```text
CV Accuracy (30 features) : 0.9516
CV Accuracy (10 features) : 0.9560

Features sélectionnées (10) :
  - mean radius
  - mean perimeter
  - mean area
  - mean concavity
  - mean concave points
  - worst radius
  - worst perimeter
  - worst area
  - worst concavity
  - worst concave points
```

---

### Étape 5 : RFE (Recursive Feature Elimination)

```python
from sklearn.feature_selection import RFE

# RFE avec un Random Forest comme estimateur
rfe = RFE(
    estimator=RandomForestClassifier(n_estimators=50, random_state=42),
    n_features_to_select=10,   # Garder 10 features
    step=1                      # Éliminer 1 feature à chaque itération
)

# Pipeline avec RFE
pipeline_rfe = Pipeline([
    ('scaler', StandardScaler()),
    ('rfe', rfe),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

cv_scores_rfe = cross_val_score(pipeline_rfe, X_train, y_train, cv=5, scoring='accuracy')
print(f"CV Accuracy (RFE, 10 features) : {cv_scores_rfe.mean():.4f}")

# Features sélectionnées par RFE
pipeline_rfe.fit(X_train, y_train)
rfe_step = pipeline_rfe.named_steps['rfe']
selected_rfe = X.columns[rfe_step.support_]
print(f"\nFeatures sélectionnées par RFE ({len(selected_rfe)}) :")
for f in selected_rfe:
    print(f"  - {f}")
```

**Résultat attendu** :

```text
CV Accuracy (RFE, 10 features) : 0.9538

Features sélectionnées par RFE (10) :
  - mean texture
  - mean perimeter
  - mean smoothness
  - mean concave points
  - worst radius
  - worst texture
  - worst perimeter
  - worst smoothness
  - worst concave points
  - worst symmetry
```

---

### Étape 6 : Tracking avec MLflow

```python
import mlflow
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import accuracy_score, f1_score

# Configurer MLflow (stockage local)
mlflow.set_tracking_uri("file:./mlruns")
mlflow.set_experiment("breast-cancer-classification")

# Définir les modèles à comparer
experiments = [
    {
        'name': 'RF_baseline',
        'pipeline': Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ]),
        'params': {'n_estimators': 100, 'feature_selection': 'none'}
    },
    {
        'name': 'RF_PCA',
        'pipeline': Pipeline([
            ('scaler', StandardScaler()),
            ('pca', PCA(n_components=10)),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ]),
        'params': {'n_estimators': 100, 'feature_selection': 'PCA_10'}
    },
    {
        'name': 'RF_SelectKBest',
        'pipeline': Pipeline([
            ('scaler', StandardScaler()),
            ('selector', SelectKBest(mutual_info_classif, k=10)),
            ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
        ]),
        'params': {'n_estimators': 100, 'feature_selection': 'SelectKBest_10'}
    }
]

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Logger chaque expérience
for exp in experiments:
    with mlflow.start_run(run_name=exp['name']):
        # Logger les paramètres
        for key, value in exp['params'].items():
            mlflow.log_param(key, value)

        # Cross-validation
        scores_acc = cross_val_score(exp['pipeline'], X_train, y_train, cv=cv, scoring='accuracy')
        scores_f1 = cross_val_score(exp['pipeline'], X_train, y_train, cv=cv, scoring='f1_macro')

        # Logger les métriques
        mlflow.log_metric('cv_accuracy_mean', scores_acc.mean())
        mlflow.log_metric('cv_accuracy_std', scores_acc.std())
        mlflow.log_metric('cv_f1_mean', scores_f1.mean())
        mlflow.log_metric('cv_f1_std', scores_f1.std())

        # Entraîner sur le train complet et évaluer sur le test
        exp['pipeline'].fit(X_train, y_train)
        y_pred = exp['pipeline'].predict(X_test)
        test_acc = accuracy_score(y_test, y_pred)
        test_f1 = f1_score(y_test, y_pred, average='macro')
        mlflow.log_metric('test_accuracy', test_acc)
        mlflow.log_metric('test_f1', test_f1)

        print(f"{exp['name']:20s} | CV Acc: {scores_acc.mean():.4f} | "
              f"Test Acc: {test_acc:.4f} | Test F1: {test_f1:.4f}")

print("\nPour voir les résultats dans l'interface web :")
print("  mlflow ui --port 5000")
print("  Puis ouvrir http://localhost:5000")
```

**Résultat attendu** :

```text
RF_baseline          | CV Acc: 0.9516 | Test Acc: 0.9649 | Test F1: 0.9601
RF_PCA               | CV Acc: 0.9516 | Test Acc: 0.9561 | Test F1: 0.9498
RF_SelectKBest       | CV Acc: 0.9560 | Test Acc: 0.9561 | Test F1: 0.9498

Pour voir les résultats dans l'interface web :
  mlflow ui --port 5000
  Puis ouvrir http://localhost:5000
```

---

## Commandes Utiles

| Code Python | Action |
| ----------- | ------ |
| `Pipeline([('name', transformer), ...])` | Créer un pipeline |
| `pipeline.named_steps['name']` | Accéder à une étape du pipeline |
| `ColumnTransformer([('name', pipe, cols)])` | Transformer par colonnes |
| `SelectKBest(score_func, k=10)` | Sélectionner les K meilleures features |
| `RFE(estimator, n_features_to_select=10)` | Élimination récursive de features |
| `mlflow.set_experiment('nom')` | Créer/sélectionner une expérience MLflow |
| `mlflow.start_run(run_name='nom')` | Démarrer un run MLflow |
| `mlflow.log_param('key', value)` | Logger un paramètre |
| `mlflow.log_metric('key', value)` | Logger une métrique |
| `mlflow.log_artifact('path')` | Logger un fichier (modèle, graphique) |

---

## Pièges Fréquents

### Piège 1 : Appliquer le scaler en dehors du Pipeline

⚠️ **Problème** : Normaliser les données avant de les passer au Pipeline ou à la cross-validation. Le scaler apprend la moyenne et l'écart-type sur l'ensemble des données, y compris le test set (data leakage).

✅ **Solution** : Toujours mettre le scaler dans le Pipeline. La cross-validation appliquera `fit_transform` uniquement sur le train fold.

```python
# Mauvais
X_scaled = StandardScaler().fit_transform(X)  # Data leakage !
scores = cross_val_score(model, X_scaled, y, cv=5)

# Bon
pipeline = Pipeline([('scaler', StandardScaler()), ('model', model)])
scores = cross_val_score(pipeline, X, y, cv=5)
```

---

### Piège 2 : Oublier de retourner self dans fit()

⚠️ **Problème** : Un transformer custom dont la méthode `fit()` ne retourne pas `self`. Le Pipeline ne peut pas chaîner les appels.

✅ **Solution** : La méthode `fit()` doit toujours se terminer par `return self`.

```python
def fit(self, X, y=None):
    self.mean_ = X.mean()
    return self  # Obligatoire !
```

---

### Piège 3 : Utiliser GridSearch sur les paramètres du ColumnTransformer

⚠️ **Problème** : La syntaxe pour accéder aux hyperparamètres dans un Pipeline imbriqué n'est pas intuitive.

✅ **Solution** : Utilise le format `étape__sous_étape__paramètre` avec des doubles underscores.

```python
param_grid = {
    'preprocessor__num__scaler__with_mean': [True, False],
    'classifier__n_estimators': [100, 200],
    'classifier__max_depth': [5, 10, None]
}
```

---

### Piège 4 : Ne pas loguer assez d'informations dans MLflow

⚠️ **Problème** : Logger uniquement l'accuracy finale, sans les paramètres ni les métriques intermédiaires. Quand tu reviens 2 semaines plus tard, tu ne sais plus quel modèle correspond à quel run.

✅ **Solution** : Logger systématiquement tous les hyperparamètres, les métriques de cross-validation (moyenne et écart-type), les métriques de test, et le nom descriptif du run.

---

## Checklist de Validation

- [ ] Je sais créer un Pipeline scikit-learn avec scaler + modèle
- [ ] Je comprends pourquoi le scaler doit être dans le Pipeline (data leakage)
- [ ] Je sais créer un transformer custom avec BaseEstimator et TransformerMixin
- [ ] Je sais utiliser ColumnTransformer pour traiter numériques et catégorielles
- [ ] Je sais utiliser SelectKBest et RFE pour la feature sélection
- [ ] Je sais utiliser GridSearchCV avec un Pipeline (syntaxe double underscore)
- [ ] Je sais logger des paramètres et métriques dans MLflow
- [ ] Je sais lancer l'interface web MLflow pour comparer les runs

---

## Exercice Pratique

**Énoncé** : Construis un pipeline scikit-learn de bout en bout sur le dataset Titanic (ou un dataset similaire avec colonnes mixtes). Le pipeline doit inclure un ColumnTransformer, un transformer custom, du feature sélection, et le tracking MLflow.

**Indications** :

- Crée un DataFrame de démonstration avec des colonnes numériques (age, revenu, anciennete), catégorielles (ville, profession) et une cible binaire
- Crée un `ColumnTransformer` avec :
  - Pipeline numérique : `SimpleImputer(median)` + `StandardScaler`
  - Pipeline catégoriel : `SimpleImputer(most_frequent)` + `OneHotEncoder`
- Crée un transformer custom qui ajoute une feature `revenu_par_annee = revenu / (anciennete + 1)`
- Ajoute un `SelectKBest(k=10)` après le preprocessing
- Compare 3 modèles (LogisticRegression, RandomForest, XGBoost) dans le même pipeline
- Logue chaque run dans MLflow avec paramètres, CV accuracy et test accuracy
- Affiche le tableau comparatif final

**Résultat attendu** : Un tableau comparant les 3 modèles avec leurs métriques, et les runs visibles dans MLflow.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
import pandas as pd
import mlflow
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import accuracy_score, f1_score

# 1. Créer un dataset de démonstration
np.random.seed(42)
n = 1000
df = pd.DataFrame({
    'age': np.random.randint(20, 65, n).astype(float),
    'revenu': np.random.normal(40000, 12000, n),
    'anciennete': np.random.randint(0, 30, n).astype(float),
    'nb_produits': np.random.randint(1, 8, n),
    'ville': np.random.choice(['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'], n),
    'profession': np.random.choice(['Ingénieur', 'Commercial', 'Manager', 'Technicien'], n),
})

# Créer une cible avec une vraie relation
score = (df['revenu'] / 40000 + df['anciennete'] / 15 + df['nb_produits'] / 5
         + np.random.normal(0, 0.5, n))
df['cible'] = (score > score.median()).astype(int)

# Introduire des valeurs manquantes
df.loc[np.random.choice(n, 50), 'age'] = np.nan
df.loc[np.random.choice(n, 40), 'revenu'] = np.nan
df.loc[np.random.choice(n, 30), 'ville'] = np.nan

X = df.drop('cible', axis=1)
y = df['cible']

# 2. Transformer custom
class RevenuParAnnee(BaseEstimator, TransformerMixin):
    """Ajoute la feature revenu / (ancienneté + 1)."""

    def __init__(self, revenu_col=1, anciennete_col=2):
        self.revenu_col = revenu_col
        self.anciennete_col = anciennete_col

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_arr = np.array(X)
        ratio = X_arr[:, self.revenu_col] / (X_arr[:, self.anciennete_col] + 1)
        return np.column_stack([X_arr, ratio])

# 3. Définir le ColumnTransformer
cols_num = ['age', 'revenu', 'anciennete', 'nb_produits']
cols_cat = ['ville', 'profession']

preprocessor = ColumnTransformer([
    ('num', Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ]), cols_num),
    ('cat', Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ]), cols_cat)
])

# 4. Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 5. Comparer 3 modèles avec MLflow
mlflow.set_tracking_uri("file:./mlruns")
mlflow.set_experiment("pipeline-complet-exercice")

models = {
    'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42),
    'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': XGBClassifier(n_estimators=100, eval_metric='logloss', random_state=42)
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = []

for name, model in models.items():
    # Pipeline complet
    full_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('add_ratio', RevenuParAnnee(revenu_col=1, anciennete_col=2)),
        ('selector', SelectKBest(mutual_info_classif, k=10)),
        ('classifier', model)
    ])

    with mlflow.start_run(run_name=name):
        # Logger les paramètres
        mlflow.log_param('model', name)
        mlflow.log_param('feature_selection', 'SelectKBest_10')
        mlflow.log_param('custom_feature', 'revenu_par_annee')

        # Cross-validation
        cv_scores = cross_val_score(full_pipeline, X_train, y_train, cv=cv, scoring='accuracy')
        mlflow.log_metric('cv_accuracy_mean', cv_scores.mean())
        mlflow.log_metric('cv_accuracy_std', cv_scores.std())

        # Test set
        full_pipeline.fit(X_train, y_train)
        y_pred = full_pipeline.predict(X_test)
        test_acc = accuracy_score(y_test, y_pred)
        test_f1 = f1_score(y_test, y_pred, average='macro')
        mlflow.log_metric('test_accuracy', test_acc)
        mlflow.log_metric('test_f1', test_f1)

        results.append({
            'Modèle': name,
            'CV Accuracy': f"{cv_scores.mean():.4f} +/- {cv_scores.std():.4f}",
            'Test Accuracy': round(test_acc, 4),
            'Test F1': round(test_f1, 4)
        })

# 6. Tableau comparatif
print("\n=== Comparaison des modèles ===")
df_results = pd.DataFrame(results)
print(df_results.to_string(index=False))

print("\nPour voir les résultats : mlflow ui --port 5000")
```

**Résultat attendu** :

```text
=== Comparaison des modèles ===
             Modèle           CV Accuracy  Test Accuracy  Test F1
 LogisticRegression  0.7525 +/- 0.0279         0.7550   0.7548
       RandomForest  0.7888 +/- 0.0253         0.7900   0.7896
            XGBoost  0.7850 +/- 0.0187         0.8100   0.8097

Pour voir les résultats : mlflow ui --port 5000
```

---

## Navigation

← Fiche précédente : **[03 - Sélection de modèles et méthodologie](03-selection-modeles-methodologie.md)**
