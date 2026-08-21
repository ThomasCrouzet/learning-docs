---
tags:
  - IA
  - Débutant
  - Pratique
description: "Manipulation et ingénierie des données : nettoyage, feature engineering, normalisation, pipelines sklearn et split train/test avec Python"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 3
cursus: "Phase 2 - Programmation et outils"
id: "ai.artificial-intelligence.programming.manipulation-ingenierie-donnees"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.programming"
content_type: "lesson"
order: 3
---

# 03 - Manipulation et ingénierie des données

> **En bref** : À la fin de cette fiche, tu sauras appliquer le nettoyage de données, le feature engineering et les pipelines de préparation pour transformer des données brutes en données exploitables par un modèle de machine learning. Lecture estimée : 50 min.


## Prérequis

- Fiche **[01 - Python pour l'IA](01-python-pour-ia.md)** lue et comprise
- Python 3 installé sur ta machine
- Bibliothèques installées : `pip install pandas numpy scikit-learn`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appliquer le nettoyage de données, le feature engineering et les pipelines de préparation pour transformer des données brutes en données exploitables par un modèle de machine learning.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le nettoyage de données ?

**Définition** : Le nettoyage de données est l'ensemble des opérations qui transforment des données brutes (incomplètes, incohérentes, dupliquées) en données propres et exploitables. Cela inclut le traitement des valeurs manquantes, la suppression des doublons et la détection des outliers.

**Le problème que le nettoyage de données résout** :

Sans nettoyage, voici les problèmes rencontrés :

1. **Valeurs manquantes** : un modèle ne peut pas s'entraîner sur des données contenant des trous (NaN). La plupart des algorithmes renvoient une erreur.
2. **Doublons** : des lignes identiques biaisent l'apprentissage en surreprésentant certaines observations.
3. **Outliers** : des valeurs aberrantes (un âge de 500 ans, un salaire négatif) faussent les calculs statistiques et les prédictions.

**Comment le nettoyage résout ces problèmes** :

| Problème | Solution apportée par le nettoyage |
| -------- | ---------------------------------- |
| Valeurs manquantes | Imputation (remplacement par la moyenne, la médiane ou une valeur calculée) ou suppression |
| Doublons | Détection avec `duplicated()` et suppression avec `drop_duplicates()` |
| Outliers | Détection par IQR (interquartile range) ou z-score, puis traitement (suppression, clipping ou transformation) |

**Analogie concrète** : Le nettoyage de données, c'est comme trier et laver des légumes avant de cuisiner. Tu retires les légumes abîmés (outliers), tu complètes ce qui manque (valeurs manquantes : ajouter du sel si un ingrédient manque) et tu vérifies que tu n'as pas deux fois le même ingrédient (doublons).

**Ce que le nettoyage de données n'est PAS** :

- Le nettoyage n'est pas la transformation des features (feature engineering). Le nettoyage rend les données utilisables. Le feature engineering crée de nouvelles informations à partir des données propres.
- Le nettoyage n'est pas la sélection de features. Nettoyer consiste à corriger les données existantes, pas à choisir lesquelles garder.

#### Traitement des valeurs manquantes

Il existe trois stratégies principales :

```python
import pandas as pd
import numpy as np

# Créer un DataFrame avec des valeurs manquantes
df = pd.DataFrame({
    'age': [25, np.nan, 30, 45, np.nan],
    'salaire': [35000, 42000, np.nan, 55000, 38000],
    'ville': ['Paris', 'Lyon', 'Paris', np.nan, 'Lyon']
})

# 1. Voir les valeurs manquantes
print(df.isnull().sum())
# age        2
# salaire    1
# ville      1

# 2. Stratégie 1 : Suppression des lignes avec des NaN
df_supprime = df.dropna()

# 3. Stratégie 2 : Remplacement par la médiane (colonnes numériques)
df['age'] = df['age'].fillna(df['age'].median())

# 4. Stratégie 3 : Remplacement par le mode (colonnes catégorielles)
df['ville'] = df['ville'].fillna(df['ville'].mode()[0])
```

#### Détection des outliers par IQR

```python
# Méthode IQR (Interquartile Range)
Q1 = df['salaire'].quantile(0.25)
Q3 = df['salaire'].quantile(0.75)
IQR = Q3 - Q1

# Les outliers sont en dehors de [Q1 - 1.5*IQR, Q3 + 1.5*IQR]
borne_basse = Q1 - 1.5 * IQR
borne_haute = Q3 + 1.5 * IQR

# Filtrer les outliers
outliers = df[(df['salaire'] < borne_basse) | (df['salaire'] > borne_haute)]
print(f"Nombre d'outliers : {len(outliers)}")
```

---

### Qu'est-ce que le feature engineering ?

**Définition** : Le feature engineering est le processus de création de nouvelles caractéristiques (features) à partir des données brutes pour améliorer les performances d'un modèle. Cela inclut l'encodage des variables catégorielles, la création de features dérivées et la sélection des features pertinentes.

**Le problème que le feature engineering résout** :

Sans feature engineering, voici les problèmes rencontrés :

1. **Variables catégorielles non utilisables** : un modèle ne peut pas traiter des textes comme "Paris" ou "Lyon" directement
2. **Information cachée** : des patterns utiles existent dans les données mais ne sont pas directement accessibles (ex : le jour de la semaine à partir d'une date)
3. **Features à échelles différentes** : un salaire en milliers et un âge en dizaines ne sont pas comparables par le modèle

**Comment le feature engineering résout ces problèmes** :

| Problème | Solution apportée par le feature engineering |
| -------- | -------------------------------------------- |
| Variables catégorielles | Encodage one-hot ou label encoding pour convertir en nombres |
| Information cachée | Création de nouvelles colonnes dérivées (extraction de jour, ratio, agrégation) |
| Échelles différentes | Normalisation ou standardisation (traitée dans le concept suivant) |

**Analogie concrète** : Le feature engineering, c'est comme préparer les ingrédients avant de les mettre dans une recette. Tu ne mets pas une carotte entière dans la soupe : tu la coupes en morceaux (transformation), tu retires la peau (nettoyage) et tu la mélanges avec d'autres ingrédients pour créer quelque chose de nouveau (feature dérivée).

**Ce que le feature engineering n'est PAS** :

- Le feature engineering n'est pas l'entraînement du modèle. Il prépare les données, le modèle les utilise ensuite.
- Le feature engineering n'est pas automatique. Il demande une compréhension du domaine pour créer des features pertinentes.

#### Encodage catégoriel

**Label Encoding** : Chaque catégorie reçoit un numéro unique. Utilisé quand il y a un ordre naturel (petit < moyen < grand).

```python
from sklearn.preprocessing import LabelEncoder

# Label encoding : chaque catégorie reçoit un numéro
le = LabelEncoder()
villes = ['Paris', 'Lyon', 'Marseille', 'Paris', 'Lyon']
villes_encoded = le.fit_transform(villes)
print(villes_encoded)  # [2 0 1 2 0]
print(le.classes_)     # ['Lyon' 'Marseille' 'Paris']
```

**One-Hot Encoding** : Chaque catégorie devient une colonne binaire (0 ou 1). Utilisé quand il n'y a pas d'ordre naturel entre les catégories.

```python
import pandas as pd

df = pd.DataFrame({'ville': ['Paris', 'Lyon', 'Marseille', 'Paris']})

# One-hot encoding avec pandas
df_encoded = pd.get_dummies(df, columns=['ville'], dtype=int)
print(df_encoded)
#    ville_Lyon  ville_Marseille  ville_Paris
# 0           0                0            1
# 1           1                0            0
# 2           0                1            0
# 3           0                0            1
```

**Comparaison Label Encoding vs One-Hot Encoding** :

| Label Encoding | One-Hot Encoding |
| -------------- | ---------------- |
| Une seule colonne | Autant de colonnes que de catégories |
| Introduit un ordre artificiel entre catégories | Pas d'ordre artificiel |
| Adapté aux variables ordinales (taille : S < M < L) | Adapté aux variables nominales (ville, couleur) |
| Consomme peu de mémoire | Peut exploser si beaucoup de catégories |

---

### Qu'est-ce que la normalisation et la standardisation ?

**Définition** : La normalisation (MinMaxScaler) transforme les valeurs pour qu'elles soient comprises entre 0 et 1. La standardisation (StandardScaler) transforme les valeurs pour qu'elles aient une moyenne de 0 et un écart-type de 1.

**Le problème que la normalisation/standardisation résout** :

Sans normalisation, voici les problèmes rencontrés :

1. **Domination par les grandes valeurs** : une feature "salaire" (30 000 - 80 000) domine une feature "âge" (18 - 65) dans le calcul des distances
2. **Convergence lente** : les algorithmes basés sur le gradient (réseaux de neurones, régression logistique) convergent plus lentement avec des échelles différentes
3. **Résultats biaisés** : les algorithmes basés sur la distance (KNN, SVM) donnent plus de poids aux features avec de grandes valeurs

**Comment la normalisation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Domination par les grandes valeurs | Toutes les features sont ramenées à la même échelle |
| Convergence lente | Le gradient descend plus efficacement quand les features ont des échelles similaires |
| Résultats biaisés | Chaque feature contribue équitablement au calcul de distance |

**Analogie concrète** : Comparer un salaire (35 000) et un âge (25) directement, c'est comme comparer des kilomètres et des grammes. La normalisation est une conversion d'unités qui met tout sur la même échelle pour que la comparaison ait du sens.

**Ce que la normalisation n'est PAS** :

- La normalisation n'est pas obligatoire pour tous les modèles. Les arbres de décision et les forêts aléatoires ne sont pas sensibles à l'échelle des features.
- La normalisation ne change pas la distribution des données. Elle change l'échelle mais conserve la forme de la distribution.

**Comparaison MinMaxScaler vs StandardScaler** :

| MinMaxScaler | StandardScaler |
| ------------ | -------------- |
| Transforme en [0, 1] | Transforme en moyenne = 0, écart-type = 1 |
| Sensible aux outliers (min et max) | Aussi sensible aux outliers (moyenne et écart-type) ; pour les outliers, utiliser RobustScaler |
| Adapté quand les données ont des bornes connues | Adapté quand les données suivent une distribution normale |
| Formule : (x - min) / (max - min) | Formule : (x - moyenne) / écart-type |

```python
from sklearn.preprocessing import MinMaxScaler, StandardScaler
import numpy as np

data = np.array([[25, 35000],
                 [30, 42000],
                 [45, 55000],
                 [22, 28000]])

# MinMaxScaler : ramène entre 0 et 1
scaler_mm = MinMaxScaler()
data_mm = scaler_mm.fit_transform(data)
print("MinMaxScaler :")
print(np.round(data_mm, 3))

# StandardScaler : moyenne=0, écart-type=1
scaler_ss = StandardScaler()
data_ss = scaler_ss.fit_transform(data)
print("\nStandardScaler :")
print(np.round(data_ss, 3))
```

---

### Qu'est-ce qu'un Pipeline sklearn ?

**Définition** : Un Pipeline sklearn est une chaîne ordonnée d'étapes de transformation et (optionnellement) un modèle final. Chaque étape est exécutée dans l'ordre : la sortie de la première étape est l'entrée de la deuxième, et ainsi de suite. Un ColumnTransformer permet d'appliquer des transformations différentes à des colonnes différentes.

**Le problème que les Pipelines résolvent** :

Sans Pipeline, voici les problèmes rencontrés :

1. **Code spaghetti** : les étapes de prétraitement sont éparpillées dans le code, difficiles à maintenir
2. **Data leakage** : risque de calculer les statistiques (moyenne, écart-type) sur l'ensemble des données au lieu du seul ensemble d'entraînement
3. **Reproductibilité** : difficile de réappliquer exactement les mêmes transformations sur de nouvelles données

**Comment les Pipelines résolvent ces problèmes** :

| Problème | Solution apportée par les Pipelines |
| -------- | ----------------------------------- |
| Code spaghetti | Toutes les étapes sont enchaînées dans un seul objet |
| Data leakage | `fit` est appelé uniquement sur les données d'entraînement, `transform` sur le test |
| Reproductibilité | Le Pipeline sauvegardé peut être réappliqué tel quel sur de nouvelles données |

**Analogie concrète** : Un Pipeline est comme une chaîne de montage dans une usine. La matière première (données brutes) entre d'un côté, passe par plusieurs postes de travail (imputation, encodage, normalisation) dans un ordre précis, et sort sous forme de produit fini (données prêtes pour le modèle) de l'autre côté.

**Ce qu'un Pipeline n'est PAS** :

- Un Pipeline n'est pas un modèle. Il peut contenir un modèle comme dernière étape, mais son rôle principal est d'organiser les transformations.
- Un Pipeline n'est pas une boucle d'entraînement. Il ne gère pas les epochs ni l'optimisation. Il enchaîne des étapes de transformation.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

# Pipeline simple : imputation puis normalisation
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# fit_transform sur les données d'entraînement
X_train_prepared = pipeline.fit_transform(X_train)

# transform (pas fit_transform) sur les données de test
X_test_prepared = pipeline.transform(X_test)
```

---

### Qu'est-ce que le split train/test/validation ?

**Définition** : Le split train/test/validation est la division du jeu de données en sous-ensembles distincts : un ensemble d'entraînement (train) pour apprendre, un ensemble de validation pour ajuster les hyperparamètres, et un ensemble de test pour évaluer la performance finale du modèle.

**Le problème que le split résout** :

Sans split, voici les problèmes rencontrés :

1. **Overfitting non détecté** : un modèle évalué sur les données d'entraînement semble parfait mais échoue sur de nouvelles données
2. **Data leakage** : si les données de test influencent l'entraînement (même indirectement via le choix des hyperparamètres), les résultats sont faussés
3. **Biais d'évaluation** : sans ensemble séparé, impossible de mesurer la capacité de généralisation du modèle

**Comment le split résout ces problèmes** :

| Problème | Solution apportée par le split |
| -------- | ------------------------------ |
| Overfitting non détecté | L'ensemble de test révèle la vraie performance du modèle sur des données inédites |
| Data leakage | L'ensemble de test est totalement isolé jusqu'à l'évaluation finale |
| Biais d'évaluation | L'ensemble de validation permet d'ajuster les hyperparamètres sans toucher au test |

**Analogie concrète** : Imagine un examen scolaire. L'ensemble d'entraînement, ce sont les exercices d'entraînement que tu fais en cours. L'ensemble de validation, ce sont les examens blancs qui te permettent d'ajuster ta méthode de révision. L'ensemble de test, c'est l'examen final : tu ne le vois qu'une seule fois pour mesurer ta vraie performance.

**Ce que le split n'est PAS** :

- Le split n'est pas un simple découpage aléatoire sans réflexion. Il faut utiliser la stratification pour conserver la même proportion de classes dans chaque sous-ensemble.
- Le split n'est pas une opération qu'on fait après le feature engineering. Le split doit être fait AVANT toute transformation pour éviter le data leakage.

**Proportions classiques** :

| Ensemble | Proportion | Rôle |
| -------- | ---------- | ---- |
| Train | 60-80% | Entraîner le modèle |
| Validation | 10-20% | Ajuster les hyperparamètres |
| Test | 10-20% | Évaluation finale unique |

```python
from sklearn.model_selection import train_test_split

# Split stratifié : conserve la proportion des classes
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y,
    test_size=0.3,        # 30% pour validation + test
    random_state=42,      # Reproductibilité
    stratify=y            # Même proportion de classes dans chaque ensemble
)

# Deuxième split pour séparer validation et test
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp,
    test_size=0.5,        # 50% de 30% = 15% pour le test
    random_state=42,
    stratify=y_temp
)

print(f"Train : {len(X_train)}, Validation : {len(X_val)}, Test : {len(X_test)}")
```

---

## Étapes Pratiques

### Étape 1 : Charger et explorer un jeu de données brut

Crée un fichier `preparation_donnees.py` et commence par charger un jeu de données avec des imperfections.

```python
import pandas as pd
import numpy as np

# Créer un jeu de données réaliste avec des problèmes
np.random.seed(42)
n = 100

df = pd.DataFrame({
    'age': np.random.randint(18, 65, n).astype(float),
    'salaire': np.random.randint(20000, 80000, n).astype(float),
    'experience': np.random.randint(0, 30, n).astype(float),
    'departement': np.random.choice(['IT', 'RH', 'Finance', 'Marketing'], n),
    'niveau': np.random.choice(['Junior', 'Senior', 'Lead'], n),
    'performance': np.random.choice([0, 1], n, p=[0.3, 0.7])
})

# Ajouter des valeurs manquantes
df.loc[np.random.choice(n, 10, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 5, replace=False), 'salaire'] = np.nan
df.loc[np.random.choice(n, 8, replace=False), 'experience'] = np.nan

# Ajouter des doublons
df = pd.concat([df, df.iloc[:5]], ignore_index=True)

# Ajouter un outlier
df.loc[0, 'salaire'] = 500000

# Explorer les données
print(f"Shape : {df.shape}")
print(f"\nValeurs manquantes :\n{df.isnull().sum()}")
print(f"\nDoublons : {df.duplicated().sum()}")
print(f"\nStatistiques :\n{df.describe()}")
```

**Résultat attendu** :

```text
Shape : (105, 6)

Valeurs manquantes :
age            10
salaire         5
experience      8
departement     0
niveau          0
performance     0
dtype: int64

Doublons : 5

Statistiques :
              age       salaire  experience  performance
count   95.000000  100.000000   97.000000   105.000000
mean    ...        ...          ...          ...
```

---

### Étape 2 : Nettoyer les données

```python
# 1. Supprimer les doublons
print(f"Avant suppression doublons : {len(df)}")
df = df.drop_duplicates()
print(f"Après suppression doublons : {len(df)}")

# 2. Traiter les outliers (méthode IQR sur le salaire)
Q1 = df['salaire'].quantile(0.25)
Q3 = df['salaire'].quantile(0.75)
IQR = Q3 - Q1
borne_basse = Q1 - 1.5 * IQR
borne_haute = Q3 + 1.5 * IQR

print(f"\nBornes IQR salaire : [{borne_basse:.0f}, {borne_haute:.0f}]")
outliers = df[(df['salaire'] < borne_basse) | (df['salaire'] > borne_haute)]
print(f"Outliers détectés : {len(outliers)}")

# Clipper les outliers au lieu de les supprimer
df['salaire'] = df['salaire'].clip(lower=borne_basse, upper=borne_haute)

# 3. Vérifier le résultat
print(f"\nSalaire max après clipping : {df['salaire'].max():.0f}")
print(f"Valeurs manquantes restantes :\n{df.isnull().sum()}")
```

**Résultat attendu** :

```text
Avant suppression doublons : 105
Après suppression doublons : 100

Bornes IQR salaire : [... , ...]
Outliers détectés : 1

Salaire max après clipping : ...
Valeurs manquantes restantes :
age            10
salaire         5
experience      8
departement     0
niveau          0
performance     0
dtype: int64
```

---

### Étape 3 : Construire un Pipeline complet avec ColumnTransformer

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split

# Séparer features et cible
X = df.drop('performance', axis=1)
y = df['performance']

# Identifier les types de colonnes
colonnes_numeriques = ['age', 'salaire', 'experience']
colonnes_categoriques_nominales = ['departement']
colonnes_categoriques_ordinales = ['niveau']

# Pipeline pour les colonnes numériques
pipeline_numerique = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Pipeline pour les colonnes catégorielles nominales
pipeline_nominal = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(drop='first', sparse_output=False))
])

# Pipeline pour les colonnes catégorielles ordinales
pipeline_ordinal = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OrdinalEncoder(categories=[['Junior', 'Senior', 'Lead']]))
])

# ColumnTransformer : applique le bon pipeline à chaque groupe de colonnes
preprocessor = ColumnTransformer([
    ('num', pipeline_numerique, colonnes_numeriques),
    ('nom', pipeline_nominal, colonnes_categoriques_nominales),
    ('ord', pipeline_ordinal, colonnes_categoriques_ordinales)
])

# Split train/test AVANT le fit
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# fit_transform sur train, transform sur test
X_train_prepared = preprocessor.fit_transform(X_train)
X_test_prepared = preprocessor.transform(X_test)

print(f"Shape train avant : {X_train.shape}")
print(f"Shape train après : {X_train_prepared.shape}")
print(f"Shape test après  : {X_test_prepared.shape}")

# Afficher les noms des features résultantes
feature_names = (colonnes_numeriques
    + list(preprocessor.named_transformers_['nom']
        .named_steps['encoder'].get_feature_names_out(colonnes_categoriques_nominales))
    + colonnes_categoriques_ordinales)
print(f"\nFeatures résultantes : {feature_names}")
```

**Résultat attendu** :

```text
Shape train avant : (80, 5)
Shape train après : (80, 7)
Shape test après  : (20, 7)

Features résultantes : ['age', 'salaire', 'experience', 'departement_IT',
'departement_Marketing', 'departement_RH', 'niveau']
```

---

### Étape 4 : Vérifier l'absence de data leakage

```python
import numpy as np

# Vérifier que les statistiques du scaler viennent uniquement du train
scaler = preprocessor.named_transformers_['num'].named_steps['scaler']
print("Moyennes apprises (train uniquement) :")
for col, mean in zip(colonnes_numeriques, scaler.mean_):
    print(f"  {col} : {mean:.2f}")

print("\nÉcarts-types appris (train uniquement) :")
for col, std in zip(colonnes_numeriques, scaler.scale_):
    print(f"  {col} : {std:.2f}")

# Vérifier que le train est bien centré-réduit
print(f"\nMoyenne des features train : {np.round(X_train_prepared[:, :3].mean(axis=0), 6)}")
print(f"Écart-type des features train : {np.round(X_train_prepared[:, :3].std(axis=0), 2)}")

# Le test n'est PAS forcément centré-réduit (c'est normal)
print(f"Moyenne des features test : {np.round(X_test_prepared[:, :3].mean(axis=0), 2)}")
```

**Résultat attendu** :

```text
Moyennes apprises (train uniquement) :
  age : ...
  salaire : ...
  experience : ...

Écarts-types appris (train uniquement) :
  age : ...
  salaire : ...
  experience : ...

Moyenne des features train : [-0. -0. -0.]
Écart-type des features train : [1. 1. 1.]
Moyenne des features test : [...]
```

Les moyennes du train sont proches de 0 et les écarts-types de 1 : le StandardScaler fonctionne correctement. Les moyennes du test ne sont pas forcément 0, ce qui est normal et attendu.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `df.isnull().sum()` | Compte les valeurs manquantes par colonne |
| `df.duplicated().sum()` | Compte les lignes dupliquées |
| `df.drop_duplicates()` | Supprime les doublons |
| `df.dropna()` | Supprime les lignes avec des NaN |
| `df.fillna(valeur)` | Remplace les NaN par une valeur |
| `df['col'].clip(lower, upper)` | Borne les valeurs entre lower et upper |
| `pd.get_dummies(df, columns=[...])` | Encodage one-hot avec pandas |
| `LabelEncoder().fit_transform(col)` | Encodage label (catégorie vers numéro) |
| `MinMaxScaler().fit_transform(X)` | Normalisation [0, 1] |
| `StandardScaler().fit_transform(X)` | Standardisation (moyenne=0, std=1) |
| `train_test_split(X, y, stratify=y)` | Split stratifié train/test |
| `Pipeline([('nom', transformer)])` | Crée un pipeline d'étapes |
| `ColumnTransformer([('nom', pipe, cols)])` | Applique des pipelines différents par colonne |

---

## Pièges Fréquents

### Piège 1 : Data leakage par normalisation avant le split

⚠️ **Problème** : Appeler `fit_transform` sur l'ensemble des données (train + test) avant de faire le split. Le scaler apprend la moyenne et l'écart-type sur des données qui incluent le test.

✅ **Solution** : Toujours faire le split AVANT le fit. Appeler `fit_transform` sur le train et `transform` (sans fit) sur le test.

```python
# INCORRECT : leakage
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # Apprend sur tout le dataset
X_train, X_test = train_test_split(X_scaled)

# CORRECT : pas de leakage
X_train, X_test = train_test_split(X)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # Apprend sur le train
X_test_scaled = scaler.transform(X_test)         # Applique sans apprendre
```

---

### Piège 2 : Utiliser le Label Encoding pour des variables nominales

⚠️ **Problème** : Encoder des villes (Paris=0, Lyon=1, Marseille=2) avec LabelEncoder. Le modèle interprète 2 > 1 > 0, comme si Marseille était "supérieure" à Lyon.

✅ **Solution** : Utiliser le One-Hot Encoding pour les variables nominales (sans ordre naturel). Réserver le Label/Ordinal Encoding aux variables ordinales (Junior < Senior < Lead).

---

### Piège 3 : Oublier la stratification dans le split

⚠️ **Problème** : Sur un jeu de données déséquilibré (90% classe 0, 10% classe 1), un split aléatoire peut créer un ensemble de test sans aucun exemple de la classe 1.

✅ **Solution** : Utiliser le paramètre `stratify=y` dans `train_test_split` pour conserver les proportions des classes.

```python
# Sans stratification : proportions aléatoires
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Avec stratification : proportions conservées
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y
)
```

---

### Piège 4 : Encoder la cible (target) avec le même pipeline que les features

⚠️ **Problème** : Inclure la colonne cible dans le ColumnTransformer. La cible est normalisée ou encodée de manière inattendue.

✅ **Solution** : Toujours séparer X (features) et y (cible) AVANT de construire le pipeline. Le pipeline ne transforme que X.

---

## Checklist de Validation

- [ ] Je sais détecter et traiter les valeurs manquantes avec pandas
- [ ] Je sais détecter et supprimer les doublons
- [ ] Je sais détecter les outliers avec la méthode IQR
- [ ] Je connais la différence entre Label Encoding et One-Hot Encoding
- [ ] Je sais quand utiliser MinMaxScaler vs StandardScaler
- [ ] Je sais construire un Pipeline sklearn avec ColumnTransformer
- [ ] Je fais le split train/test AVANT toute transformation (pas de data leakage)
- [ ] Je sais utiliser la stratification dans train_test_split

---

## Exercice Pratique

**Énoncé** : Construis un pipeline complet de préparation de données à partir d'un jeu de données brut.

1. Crée un DataFrame avec 200 lignes contenant : age (int, avec 15 NaN), revenu (float, avec 10 NaN et 3 outliers > 200000), categorie_emploi (4 catégories nominales), niveau_etude (3 niveaux ordinaux : Bac, Licence, Master), et une cible binaire "achat" (0/1)
2. Nettoie les données : supprime les doublons, traite les outliers par clipping
3. Construis un ColumnTransformer avec : imputation médiane + StandardScaler pour les numériques, imputation mode + OneHotEncoder pour les nominales, imputation mode + OrdinalEncoder pour les ordinales
4. Fais un split stratifié 70/15/15 (train/validation/test)
5. Applique le pipeline et affiche les shapes résultantes

**Indications** :

- Utilise `np.random.seed(42)` pour la reproductibilité
- Le split en 3 se fait en deux étapes : d'abord 70/30, puis 50/50 sur les 30%
- Vérifie que les moyennes du train sont proches de 0 après standardisation

**Résultat attendu** : Le script affiche les shapes de X_train, X_val et X_test après transformation, et confirme que les moyennes du train sont proches de 0.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split

# --- Étape 1 : Créer le jeu de données ---
np.random.seed(42)
n = 200

df = pd.DataFrame({
    'age': np.random.randint(18, 65, n).astype(float),
    'revenu': np.random.uniform(15000, 80000, n),
    'categorie_emploi': np.random.choice(
        ['Tech', 'Santé', 'Finance', 'Éducation'], n
    ),
    'niveau_etude': np.random.choice(['Bac', 'Licence', 'Master'], n),
    'achat': np.random.choice([0, 1], n, p=[0.4, 0.6])
})

# Ajouter des valeurs manquantes
df.loc[np.random.choice(n, 15, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 10, replace=False), 'revenu'] = np.nan

# Ajouter des outliers
df.loc[0, 'revenu'] = 250000
df.loc[1, 'revenu'] = 300000
df.loc[2, 'revenu'] = 220000

print(f"Shape initiale : {df.shape}")
print(f"Valeurs manquantes :\n{df.isnull().sum()}\n")

# --- Étape 2 : Nettoyer ---
# Supprimer les doublons
df = df.drop_duplicates()

# Clipping des outliers sur le revenu
Q1 = df['revenu'].quantile(0.25)
Q3 = df['revenu'].quantile(0.75)
IQR = Q3 - Q1
df['revenu'] = df['revenu'].clip(
    lower=Q1 - 1.5 * IQR,
    upper=Q3 + 1.5 * IQR
)

print(f"Revenu max après clipping : {df['revenu'].max():.0f}")

# --- Étape 3 : Définir les pipelines ---
X = df.drop('achat', axis=1)
y = df['achat']

cols_num = ['age', 'revenu']
cols_nom = ['categorie_emploi']
cols_ord = ['niveau_etude']

pipe_num = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

pipe_nom = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(drop='first', sparse_output=False))
])

pipe_ord = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OrdinalEncoder(categories=[['Bac', 'Licence', 'Master']]))
])

preprocessor = ColumnTransformer([
    ('num', pipe_num, cols_num),
    ('nom', pipe_nom, cols_nom),
    ('ord', pipe_ord, cols_ord)
])

# --- Étape 4 : Split stratifié 70/15/15 ---
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
)

print(f"\nTrain : {len(X_train)}, Val : {len(X_val)}, Test : {len(X_test)}")

# --- Étape 5 : Appliquer le pipeline ---
X_train_prep = preprocessor.fit_transform(X_train)
X_val_prep = preprocessor.transform(X_val)
X_test_prep = preprocessor.transform(X_test)

print(f"\nShape train préparé : {X_train_prep.shape}")
print(f"Shape val préparé   : {X_val_prep.shape}")
print(f"Shape test préparé  : {X_test_prep.shape}")

# Vérification : moyennes du train proches de 0 pour les colonnes numériques
print(f"\nMoyennes train (num) : {np.round(X_train_prep[:, :2].mean(axis=0), 6)}")
print(f"Écarts-types train (num) : {np.round(X_train_prep[:, :2].std(axis=0), 2)}")
```

**Résultat** :

```text
Shape initiale : (200, 5)
Valeurs manquantes :
age       15
revenu    10
...

Revenu max après clipping : ...

Train : 140, Val : 30, Test : 30

Shape train préparé : (140, 6)
Shape val préparé   : (30, 6)
Shape test préparé  : (30, 6)

Moyennes train (num) : [-0. -0.]
Écarts-types train (num) : [1. 1.]
```

---

## Navigation

← Fiche précédente : **[02 - Environnement de développement et infrastructure](02-environnement-developpement-infrastructure.md)**
