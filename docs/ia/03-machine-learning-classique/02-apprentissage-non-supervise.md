---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "Apprentissage non supervisé : K-Means, DBSCAN, PCA, t-SNE et UMAP avec scikit-learn"
estimated_time: "45 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 3 - Machine learning classique"
id: "ai.artificial-intelligence.ml.apprentissage-non-supervise"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.ml"
content_type: "lesson"
order: 2
---

# 02 - Apprentissage non supervisé

> **En bref** : À la fin de cette fiche, tu sauras expliquer la différence entre apprentissage supervisé et non supervisé, implémenter des algorithmes de clustering (K-Means, DBSCAN), appliquer la réduction de dimensionnalité (PCA, t-SNE, UMAP) et interpréter visuellement les résultats. Lecture estimée : 45 min.


## Prérequis

- Fiche **[01 - Apprentissage supervisé](01-apprentissage-supervise.md)** (cette phase) : concepts de features, train/test, scikit-learn
- Fiche **[01 - Algèbre linéaire](../01-fondamentaux-mathematiques/01-algebre-lineaire.md)** (Phase 1) : vecteurs, matrices, valeurs propres
- Fiche **[01 - Python pour l'IA](../02-programmation-outils/01-python-pour-ia.md)** (Phase 2) : NumPy, Pandas, Matplotlib

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer la différence entre apprentissage supervisé et non supervisé, implémenter des algorithmes de clustering (K-Means, DBSCAN), appliquer la réduction de dimensionnalité (PCA, t-SNE, UMAP) et interpréter visuellement les résultats.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'apprentissage non supervisé ?

**Définition** : L'apprentissage non supervisé est un type de machine learning où l'algorithme travaille avec des données sans étiquettes. Il n'y a pas de "bonne réponse" à apprendre. L'algorithme cherche à découvrir des structures cachées dans les données : des groupes, des patterns, des axes de variation.

**Le problème que l'apprentissage non supervisé résout** :

Sans apprentissage non supervisé, voici les problèmes rencontrés :

1. **Pas de labels disponibles** : étiqueter des millions de données manuellement est coûteux et parfois impossible
2. **Structure inconnue** : on ne sait pas combien de groupes naturels existent dans les données
3. **Trop de dimensions** : avec 100 features, impossible de visualiser les données pour les comprendre

**Comment l'apprentissage non supervisé résout ces problèmes** :

| Problème | Solution apportée par l'apprentissage non supervisé |
| -------- | ---------------------------------------------------- |
| Pas de labels disponibles | Le clustering regroupe automatiquement les données similaires sans étiquettes |
| Structure inconnue | Les algorithmes révèlent les groupes naturels dans les données |
| Trop de dimensions | La réduction de dimensionnalité compresse les données en 2-3 dimensions visualisables |

**Analogie concrète** : Imagine que tu tries une boîte de 500 boutons mélangés (les données). Personne ne t'a dit combien de catégories il y a ni lesquelles. En observant les couleurs, tailles et formes, tu crées naturellement des groupes (les clusters). C'est exactement ce que fait l'apprentissage non supervisé.

**Ce que l'apprentissage non supervisé n'est PAS** :

- L'apprentissage non supervisé n'est pas de la classification. La classification nécessite des étiquettes pour apprendre. Le clustering crée ses propres groupes.
- L'apprentissage non supervisé n'est pas aléatoire. Les algorithmes utilisent des critères mathématiques précis (distance, densité, variance) pour structurer les données.

**Comparaison supervisé vs non supervisé** :

| Supervisé | Non supervisé |
| --------- | ------------- |
| Données étiquetées (X, y) | Données sans étiquettes (X uniquement) |
| Objectif : prédire y | Objectif : découvrir des structures |
| Évaluation : accuracy, F1, MSE | Évaluation : silhouette, inertie, variance expliquée |
| Exemples : régression, classification | Exemples : clustering, réduction de dimension |

**Deux grandes familles** :

| Famille | Objectif | Algorithmes |
| ------- | -------- | ----------- |
| Clustering | Regrouper les données similaires | K-Means, DBSCAN, hierarchical clustering |
| Réduction de dimensionnalité | Réduire le nombre de features | PCA, t-SNE, UMAP |

---

### Qu'est-ce que K-Means ?

**Définition** : K-Means est un algorithme de clustering qui partitionne les données en K groupes (clusters). Chaque cluster est défini par un centroïde (point central). Chaque donnée est assignée au cluster dont le centroïde est le plus proche.

**Le problème que K-Means résout** :

Sans K-Means, voici les problèmes rencontrés :

1. **Segmentation manuelle** : regrouper des milliers de clients à la main est impossible
2. **Critère objectif** : sans algorithme, les groupes sont subjectifs et non reproductibles
3. **Passage à l'échelle** : un humain ne peut pas analyser des millions de points en plusieurs dimensions

**Comment K-Means résout ces problèmes** :

| Problème | Solution apportée par K-Means |
| -------- | ----------------------------- |
| Segmentation manuelle | L'algorithme assigne automatiquement chaque point à un cluster |
| Critère objectif | Minimise l'inertie (somme des distances au carré entre chaque point et son centroïde) |
| Passage à l'échelle | Fonctionne efficacement sur des millions de points |

**Analogie concrète** : K-Means est comme un organisateur de soirée qui doit répartir 100 invités à K tables. Il place K tables (centroïdes) dans la salle. Chaque invité s'assied à la table la plus proche. L'organisateur déplace ensuite chaque table au centre de ses invités. On répète jusqu'à ce que plus personne ne change de table.

**Algorithme étape par étape** :

1. Choisir K centroïdes aléatoirement parmi les données
2. Assigner chaque point au centroïde le plus proche (distance euclidienne)
3. Recalculer chaque centroïde comme la moyenne des points qui lui sont assignés
4. Répéter les étapes 2 et 3 jusqu'à convergence (les assignations ne changent plus)

**Choisir K : la méthode du coude (elbow method)** :

- Entraîner K-Means pour K = 1, 2, 3, ..., 10
- Calculer l'inertie (somme des distances au carré) pour chaque K
- Tracer la courbe inertie vs K
- Le "coude" (point où l'inertie diminue beaucoup moins vite) indique le bon K

**Ce que K-Means n'est PAS** :

- K-Means n'est pas adapté aux clusters non sphériques. Il suppose que les clusters sont de forme ronde et de taille similaire. Pour des clusters de formes variées, utilise DBSCAN.
- K-Means n'est pas déterministe par défaut. Les centroïdes initiaux sont aléatoires, donc deux exécutions peuvent donner des résultats différents. Fixe `random_state` pour la reproductibilité.

---

### Qu'est-ce que DBSCAN ?

**Définition** : DBSCAN (Density-Based Spatial Clustering of Applications with Noise) est un algorithme de clustering basé sur la densité. Il regroupe les points qui sont densément connectés et identifie les points isolés comme du bruit.

**Le problème que DBSCAN résout** :

Sans DBSCAN, voici les problèmes rencontrés :

1. **Clusters non sphériques** : K-Means ne peut pas détecter des groupes en forme de croissant ou de spirale
2. **Nombre de clusters inconnu** : K-Means exige de fixer K à l'avance
3. **Points aberrants** : K-Means assigne tous les points à un cluster, y compris les anomalies

**Comment DBSCAN résout ces problèmes** :

| Problème | Solution apportée par DBSCAN |
| -------- | ---------------------------- |
| Clusters non sphériques | Suit la densité, quelle que soit la forme du cluster |
| Nombre de clusters inconnu | Découvre automatiquement le nombre de clusters |
| Points aberrants | Classifie les points isolés comme "bruit" (label -1) |

**Analogie concrète** : DBSCAN est comme un enfant qui joue dans un jardin avec des groupes d'amis. Si un ami est assez proche (distance < epsilon), ils font partie du même groupe. Si un groupe est assez grand (>= min_samples), c'est un vrai groupe de jeu. Un enfant seul et loin de tout le monde est "pas dans un groupe" (bruit).

**Deux paramètres essentiels** :

| Paramètre | Signification | Impact |
| --------- | ------------- | ------ |
| `eps` (epsilon) | Rayon de voisinage autour de chaque point | Trop petit : beaucoup de bruit. Trop grand : un seul cluster |
| `min_samples` | Nombre minimum de points dans le rayon eps pour former un cluster | Trop petit : clusters bruités. Trop grand : petits clusters perdus |

**Comparaison K-Means vs DBSCAN** :

| K-Means | DBSCAN |
| ------- | ------ |
| Nombre de clusters K fixé à l'avance | Nombre de clusters détecté automatiquement |
| Clusters sphériques uniquement | Clusters de forme arbitraire |
| Tous les points sont assignés | Les points isolés sont classés comme bruit |
| Rapide sur de gros datasets | Plus lent sur de très gros datasets |
| Sensible aux outliers | Robuste aux outliers |

---

### Qu'est-ce que PCA ?

**Définition** : PCA (Principal Component Analysis) est un algorithme de réduction de dimensionnalité qui transforme les features originales en nouvelles features (composantes principales) classées par quantité de variance expliquée. La première composante capture le plus de variance, la deuxième le plus de variance restante, et ainsi de suite.

**Le problème que PCA résout** :

Sans PCA, voici les problèmes rencontrés :

1. **Malédiction de la dimensionnalité** : avec 100 features, les distances entre points deviennent peu significatives et les modèles overfittent
2. **Visualisation impossible** : on ne peut pas tracer un graphique à 100 dimensions
3. **Redondance** : de nombreuses features sont corrélées et portent la même information

**Comment PCA résout ces problèmes** :

| Problème | Solution apportée par PCA |
| -------- | ------------------------- |
| Malédiction de la dimensionnalité | Réduit le nombre de features en gardant l'essentiel de l'information |
| Visualisation impossible | Projette les données en 2 ou 3 dimensions pour les tracer |
| Redondance | Les composantes principales sont non corrélées par construction |

**Analogie concrète** : PCA est comme prendre une photo d'un objet 3D. La photo est en 2D mais capture l'essentiel de la forme. PCA choisit l'angle de vue (la direction de projection) qui montre le maximum de détails (le maximum de variance). La première composante est la meilleure vue, la deuxième est le meilleur angle complémentaire.

**Variance expliquée** :

- Chaque composante principale a un ratio de variance expliquée
- La somme des ratios de toutes les composantes = 100%
- En pratique, on garde assez de composantes pour expliquer 90-95% de la variance

**Ce que PCA n'est PAS** :

- PCA n'est pas une sélection de features. PCA crée de nouvelles features (combinaisons linéaires des originales). La sélection de features garde un sous-ensemble des features existantes.
- PCA n'est pas adapté aux relations non linéaires. PCA cherche des directions linéaires de variance maximale. Pour des structures non linéaires, utilise t-SNE ou UMAP.

---

### Qu'est-ce que t-SNE et UMAP ?

**Définition** : t-SNE (t-distributed Stochastic Neighbor Embedding) et UMAP (Uniform Manifold Approximation and Projection) sont des algorithmes de réduction de dimensionnalité non linéaires, principalement utilisés pour la visualisation en 2D.

**Le problème que t-SNE et UMAP résolvent** :

Sans t-SNE/UMAP, voici les problèmes rencontrés :

1. **PCA insuffisant** : les données réelles ont souvent des structures non linéaires que PCA ne capture pas
2. **Clusters mal séparés** : en projection PCA 2D, des groupes distincts peuvent se chevaucher
3. **Interprétation difficile** : sans bonne visualisation, impossible de comprendre la structure des données

**Comment t-SNE et UMAP résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| PCA insuffisant | Capturent les structures non linéaires (courbes, variétés) |
| Clusters mal séparés | Préservent les relations de voisinage, séparant mieux les clusters en 2D |
| Interprétation difficile | Produisent des visualisations expressives et interprétables |

**Analogie concrète** : Imagine que tu as une feuille de papier froissée en boule (données haute dimension). PCA, c'est écraser la boule à plat : rapide mais les points se chevauchent. t-SNE et UMAP, c'est déplier soigneusement la feuille pour la remettre à plat : plus lent mais les voisinages sont préservés.

**Paramètres importants** :

| Algorithme | Paramètre clé | Rôle | Valeur typique |
| ---------- | -------------- | ---- | -------------- |
| t-SNE | `perplexity` | Nombre de voisins effectifs à préserver | 5-50 (défaut 30) |
| UMAP | `n_neighbors` | Nombre de voisins pour construire le graphe | 5-50 (défaut 15) |
| UMAP | `min_dist` | Distance minimale entre les points en sortie | 0.0-0.5 (défaut 0.1) |

**Comparaison PCA vs t-SNE vs UMAP** :

| PCA | t-SNE | UMAP |
| --- | ----- | ---- |
| Linéaire | Non linéaire | Non linéaire |
| Rapide | Lent (O(n²)) | Rapide |
| Déterministe | Stochastique | Stochastique |
| Préserve les grandes distances | Préserve les petites distances | Préserve petites et grandes distances |
| Utilisable pour transform | Pas de transform natif | Transform possible sur de nouvelles données |

**Ce que t-SNE et UMAP ne sont PAS** :

- t-SNE et UMAP ne sont pas des outils de réduction de features pour un modèle ML. Ils servent à la visualisation, pas comme prétraitement. Pour la réduction de dimension dans un pipeline, utilise PCA.
- Les distances en t-SNE n'ont pas de signification absolue. Deux points proches dans le graphique t-SNE sont réellement proches dans l'espace original, mais des points éloignés ne sont pas nécessairement éloignés en réalité.

---

## Étapes Pratiques

### Étape 1 : Charger et préparer les données

On utilise le dataset Wine de scikit-learn : 178 vins avec 13 features chimiques et 3 classes (qui serviront de référence pour évaluer visuellement le clustering).

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler

# Charger le dataset
wine = load_wine()
X = pd.DataFrame(wine.data, columns=wine.feature_names)
y = wine.target  # On ne l'utilise PAS pour l'entraînement (non supervisé)

# Normaliser les features (indispensable pour K-Means, PCA, t-SNE, UMAP)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print(f"Dataset : {X.shape[0]} exemples, {X.shape[1]} features")
print(f"Classes réelles (pour validation) : {np.unique(y)}")
```

**Résultat attendu** :

```text
Dataset : 178 exemples, 13 features
Classes réelles (pour validation) : [0 1 2]
```

---

### Étape 2 : Appliquer K-Means avec la méthode du coude

```python
from sklearn.cluster import KMeans

# Tester différentes valeurs de K
inertias = []
K_range = range(1, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)  # Somme des distances au carré

# Tracer la courbe du coude
plt.figure(figsize=(8, 5))
plt.plot(K_range, inertias, 'bo-')
plt.xlabel('Nombre de clusters (K)')
plt.ylabel('Inertie')
plt.title('Méthode du coude')
plt.xticks(K_range)
plt.grid(True, alpha=0.3)
plt.savefig('elbow_method.png', dpi=100, bbox_inches='tight')
plt.show()
print("Le coude est visible à K=3")
```

**Résultat attendu** :

```text
Le coude est visible à K=3
```

---

### Étape 3 : Entraîner K-Means avec K=3

```python
from sklearn.metrics import silhouette_score, adjusted_rand_score

# Entraîner K-Means avec 3 clusters
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels_kmeans = kmeans.fit_predict(X_scaled)

# Évaluer la qualité du clustering
sil_score = silhouette_score(X_scaled, labels_kmeans)
ari_score = adjusted_rand_score(y, labels_kmeans)

print("=== K-Means (K=3) ===")
print(f"Silhouette score : {sil_score:.4f}")
# Silhouette : de -1 à 1, plus c'est élevé mieux c'est
print(f"Adjusted Rand Index : {ari_score:.4f}")
# ARI : de -0.5 à 1, mesure la concordance avec les vraies classes
print(f"Inertie : {kmeans.inertia_:.2f}")

# Distribution des clusters
for i in range(3):
    count = np.sum(labels_kmeans == i)
    print(f"  Cluster {i} : {count} points")
```

**Résultat attendu** :

```text
=== K-Means (K=3) ===
Silhouette score : 0.2849
Adjusted Rand Index : 0.8975
Inertie : 1579.82
  Cluster 0 : 69 points
  Cluster 1 : 62 points
  Cluster 2 : 47 points
```

---

### Étape 4 : Appliquer DBSCAN

```python
from sklearn.cluster import DBSCAN

# Entraîner DBSCAN
dbscan = DBSCAN(
    eps=2.5,           # Rayon de voisinage
    min_samples=5      # Nombre minimum de points pour former un cluster
)
labels_dbscan = dbscan.fit_predict(X_scaled)

# Résultats
n_clusters = len(set(labels_dbscan)) - (1 if -1 in labels_dbscan else 0)
n_noise = np.sum(labels_dbscan == -1)

print("=== DBSCAN ===")
print(f"Clusters trouvés : {n_clusters}")
print(f"Points de bruit : {n_noise}")

if n_clusters >= 2:
    # Le silhouette score ne compte pas les points de bruit
    mask = labels_dbscan != -1
    sil_db = silhouette_score(X_scaled[mask], labels_dbscan[mask])
    print(f"Silhouette score (hors bruit) : {sil_db:.4f}")
```

**Résultat attendu** :

```text
=== DBSCAN ===
Clusters trouvés : 2
Points de bruit : 16
Silhouette score (hors bruit) : 0.2712
```

---

### Étape 5 : Appliquer PCA

```python
from sklearn.decomposition import PCA

# PCA avec toutes les composantes pour voir la variance expliquée
pca_full = PCA()
pca_full.fit(X_scaled)

# Variance expliquée par composante
cumulative_var = np.cumsum(pca_full.explained_variance_ratio_)
print("Variance cumulée par composante :")
for i, var in enumerate(cumulative_var):
    marker = " <-- 90%" if i == np.argmax(cumulative_var >= 0.90) else ""
    print(f"  {i+1} composantes : {var:.4f}{marker}")

# PCA en 2 dimensions pour la visualisation
pca_2d = PCA(n_components=2)
X_pca = pca_2d.fit_transform(X_scaled)

print(f"\nVariance expliquée par les 2 premières composantes : "
      f"{pca_2d.explained_variance_ratio_.sum():.4f}")
```

**Résultat attendu** :

```text
Variance cumulée par composante :
  1 composantes : 0.3620
  2 composantes : 0.5518
  3 composantes : 0.6681
  4 composantes : 0.7358
  5 composantes : 0.8016
  6 composantes : 0.8527
  7 composantes : 0.8940
  8 composantes : 0.9206 <-- 90%
  9 composantes : 0.9463
  10 composantes : 0.9668
  11 composantes : 0.9822
  12 composantes : 0.9940
  13 composantes : 1.0000

Variance expliquée par les 2 premières composantes : 0.5518
```

---

### Étape 6 : Visualiser avec PCA et t-SNE

```python
from sklearn.manifold import TSNE

# t-SNE en 2 dimensions
tsne = TSNE(
    n_components=2,
    perplexity=30,     # Nombre de voisins effectifs
    random_state=42,
    max_iter=1000       # Nombre d'itérations d'optimisation
)
X_tsne = tsne.fit_transform(X_scaled)

# Créer les visualisations côte à côte
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# 1. PCA coloré par les vraies classes
axes[0].scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', alpha=0.7, s=30)
axes[0].set_title('PCA (classes réelles)')
axes[0].set_xlabel('PC1')
axes[0].set_ylabel('PC2')

# 2. PCA coloré par les clusters K-Means
axes[1].scatter(X_pca[:, 0], X_pca[:, 1], c=labels_kmeans, cmap='viridis', alpha=0.7, s=30)
axes[1].set_title('PCA (clusters K-Means)')
axes[1].set_xlabel('PC1')
axes[1].set_ylabel('PC2')

# 3. t-SNE coloré par les vraies classes
axes[2].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='viridis', alpha=0.7, s=30)
axes[2].set_title('t-SNE (classes réelles)')
axes[2].set_xlabel('t-SNE 1')
axes[2].set_ylabel('t-SNE 2')

plt.tight_layout()
plt.savefig('clustering_visualization.png', dpi=100, bbox_inches='tight')
plt.show()
print("Visualisations sauvegardées dans clustering_visualization.png")
```

**Résultat attendu** :

```text
Visualisations sauvegardées dans clustering_visualization.png
```

Les trois graphiques montrent que t-SNE sépare mieux les classes visuellement que PCA, car t-SNE capture les structures non linéaires.

---

## Commandes Utiles

| Code Python | Action |
| ----------- | ------ |
| `KMeans(n_clusters=3).fit_predict(X)` | Clustering K-Means |
| `DBSCAN(eps=0.5, min_samples=5).fit_predict(X)` | Clustering DBSCAN |
| `PCA(n_components=2).fit_transform(X)` | Réduction PCA en 2D |
| `TSNE(n_components=2).fit_transform(X)` | Réduction t-SNE en 2D |
| `silhouette_score(X, labels)` | Score de silhouette (qualité du clustering) |
| `adjusted_rand_score(y_true, labels)` | ARI (concordance avec les vraies classes) |
| `pca.explained_variance_ratio_` | Variance expliquée par chaque composante PCA |
| `np.cumsum(ratios)` | Variance cumulée |

---

## Pièges Fréquents

### Piège 1 : Oublier de normaliser avant K-Means

⚠️ **Problème** : K-Means utilise la distance euclidienne. Si une feature va de 0 à 1 000 et une autre de 0 à 1, K-Means se base presque uniquement sur la première.

✅ **Solution** : Toujours appliquer `StandardScaler` avant K-Means, DBSCAN, PCA et t-SNE.

```python
from sklearn.preprocessing import StandardScaler
X_scaled = StandardScaler().fit_transform(X)
```

---

### Piège 2 : Interpréter les distances en t-SNE

⚠️ **Problème** : Conclure que deux clusters éloignés en t-SNE sont très différents dans l'espace original. Les distances globales en t-SNE ne sont pas fiables.

✅ **Solution** : t-SNE préserve les voisinages locaux, pas les distances globales. Deux points proches en t-SNE sont réellement proches. Deux points éloignés ne sont pas nécessairement éloignés. Ne compare jamais les tailles ou écarts entre clusters en t-SNE.

---

### Piège 3 : Choisir epsilon au hasard pour DBSCAN

⚠️ **Problème** : Fixer `eps` arbitrairement donne soit un seul gros cluster, soit tout en bruit.

✅ **Solution** : Utilise la méthode du k-distance graph. Calcule la distance au k-ème voisin le plus proche pour chaque point, trie les distances, et choisis epsilon au "coude" de la courbe.

```python
from sklearn.neighbors import NearestNeighbors

# Calculer la distance au 5e voisin pour chaque point
nn = NearestNeighbors(n_neighbors=5)
nn.fit(X_scaled)
distances, _ = nn.kneighbors(X_scaled)

# Trier les distances au 5e voisin
sorted_distances = np.sort(distances[:, 4])
plt.plot(sorted_distances)
plt.ylabel('Distance au 5e voisin')
plt.xlabel('Points (triés)')
plt.title('k-distance graph pour choisir epsilon')
plt.show()
```

---

### Piège 4 : Utiliser PCA comme outil de clustering

⚠️ **Problème** : Appliquer PCA puis conclure que les données "n'ont pas de clusters" parce que les projections 2D se chevauchent.

✅ **Solution** : PCA maximise la variance, pas la séparation des clusters. Des clusters peuvent exister dans les dimensions que PCA ignore. Utilise t-SNE ou UMAP pour vérifier visuellement, et le silhouette score pour une évaluation quantitative.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre apprentissage supervisé et non supervisé
- [ ] Je comprends le fonctionnement de K-Means (centroïdes, itérations, convergence)
- [ ] Je sais utiliser la méthode du coude pour choisir K
- [ ] Je comprends DBSCAN (epsilon, min_samples, bruit)
- [ ] Je sais quand choisir K-Means vs DBSCAN
- [ ] Je comprends PCA (composantes principales, variance expliquée)
- [ ] Je sais utiliser t-SNE pour la visualisation 2D
- [ ] Je connais les limites de t-SNE (distances globales non fiables)
- [ ] J'ai implémenté un pipeline complet : normalisation, clustering, PCA, t-SNE

---

## Exercice Pratique

**Énoncé** : Réalise une segmentation de clients en utilisant le dataset Iris de scikit-learn (en ignorant les labels). Applique K-Means et DBSCAN, puis visualise les résultats avec PCA et t-SNE.

**Indications** :

- Charge le dataset avec `from sklearn.datasets import load_iris`
- Normalise les données avec `StandardScaler`
- Utilise la méthode du coude pour choisir K (teste K de 1 à 8)
- Entraîne K-Means avec le K optimal
- Entraîne DBSCAN avec `eps=1.0` et `min_samples=5`
- Applique PCA (2 composantes) et t-SNE
- Crée 4 graphiques : PCA + K-Means, PCA + DBSCAN, t-SNE + K-Means, t-SNE + vraies classes
- Calcule le silhouette score pour K-Means et DBSCAN
- Compare visuellement les clusters trouvés avec les vraies classes

**Résultat attendu** : 4 graphiques côte à côte et un tableau comparant les métriques des deux algorithmes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score, adjusted_rand_score

# 1. Charger et normaliser
iris = load_iris()
X = iris.data
y = iris.target  # Pour validation uniquement
X_scaled = StandardScaler().fit_transform(X)

# 2. Méthode du coude
inertias = []
for k in range(1, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

plt.figure(figsize=(8, 4))
plt.plot(range(1, 9), inertias, 'bo-')
plt.xlabel('K')
plt.ylabel('Inertie')
plt.title('Méthode du coude - Iris')
plt.savefig('elbow_iris.png', dpi=100, bbox_inches='tight')
plt.show()
print("Coude visible à K=3")

# 3. K-Means (K=3)
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels_km = kmeans.fit_predict(X_scaled)

# 4. DBSCAN
dbscan = DBSCAN(eps=1.0, min_samples=5)
labels_db = dbscan.fit_predict(X_scaled)

# 5. PCA et t-SNE
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

# 6. Visualisation (4 graphiques)
fig, axes = plt.subplots(2, 2, figsize=(14, 12))

# PCA + K-Means
axes[0, 0].scatter(X_pca[:, 0], X_pca[:, 1], c=labels_km, cmap='viridis', alpha=0.7, s=30)
axes[0, 0].set_title('PCA + K-Means')

# PCA + DBSCAN
axes[0, 1].scatter(X_pca[:, 0], X_pca[:, 1], c=labels_db, cmap='viridis', alpha=0.7, s=30)
axes[0, 1].set_title('PCA + DBSCAN')

# t-SNE + K-Means
axes[1, 0].scatter(X_tsne[:, 0], X_tsne[:, 1], c=labels_km, cmap='viridis', alpha=0.7, s=30)
axes[1, 0].set_title('t-SNE + K-Means')

# t-SNE + Vraies classes
axes[1, 1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='viridis', alpha=0.7, s=30)
axes[1, 1].set_title('t-SNE + Classes réelles')

plt.tight_layout()
plt.savefig('clustering_iris.png', dpi=100, bbox_inches='tight')
plt.show()

# 7. Métriques
print("\n=== Comparaison des métriques ===")
print(f"{'Métrique':<25} {'K-Means':>10} {'DBSCAN':>10}")
print(f"{'-'*45}")

sil_km = silhouette_score(X_scaled, labels_km)
ari_km = adjusted_rand_score(y, labels_km)

# DBSCAN : filtrer le bruit pour le silhouette score
mask_db = labels_db != -1
n_clusters_db = len(set(labels_db)) - (1 if -1 in labels_db else 0)
n_noise = np.sum(labels_db == -1)

if n_clusters_db >= 2:
    sil_db = silhouette_score(X_scaled[mask_db], labels_db[mask_db])
else:
    sil_db = float('nan')
ari_db = adjusted_rand_score(y, labels_db)

print(f"{'Silhouette score':<25} {sil_km:>10.4f} {sil_db:>10.4f}")
print(f"{'Adjusted Rand Index':<25} {ari_km:>10.4f} {ari_db:>10.4f}")
print(f"{'Clusters trouvés':<25} {3:>10} {n_clusters_db:>10}")
print(f"{'Points de bruit':<25} {0:>10} {n_noise:>10}")
```

**Résultat attendu** :

```text
Coude visible à K=3

=== Comparaison des métriques ===
Métrique                    K-Means     DBSCAN
---------------------------------------------
Silhouette score             0.4597     0.3869
Adjusted Rand Index          0.7302     0.5075
Clusters trouvés                  3          2
Points de bruit                   0         14
```

K-Means obtient de meilleures métriques sur ce dataset car les clusters Iris sont relativement sphériques. DBSCAN fusionne deux espèces proches en un seul cluster et identifie 14 points comme bruit.

---

## Navigation

← Fiche précédente : **[01 - Apprentissage supervisé](01-apprentissage-supervise.md)**

→ Fiche suivante : **[03 - Sélection de modèles et méthodologie](03-selection-modeles-methodologie.md)**
