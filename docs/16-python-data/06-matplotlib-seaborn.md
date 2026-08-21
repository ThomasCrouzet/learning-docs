---
tags:
  - Python
  - Data
  - Intermédiaire
  - Pratique
description: "Créer des graphiques avec Matplotlib et Seaborn : line, bar, scatter, hist, box, personnalisation et subplots."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 8
cursus: "Python Data"
id: "web.python-data.matplotlib-seaborn"
course_id: "web.python-data"
content_type: "lesson"
order: 6
---

# 06 - Visualisation avec Matplotlib et Seaborn

> **En bref** : Créer et personnaliser des graphiques (ligne, barres, nuage de points, histogramme, boîte à moustaches) avec Matplotlib et Seaborn, et composer des figures multi-graphiques. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [05 - Pandas - Nettoyage de données](05-pandas-nettoyage.md)
- Savoir créer et manipuler un DataFrame Pandas
- Avoir installe Matplotlib et Seaborn

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer les 5 types de graphiques les plus courants, personnaliser les titres, axes et couleurs, composer des figures avec plusieurs graphiques et sauvegarder les graphiques en images.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Matplotlib ?

**Définition** : Matplotlib est la bibliothèque de base pour la visualisation de données en Python. Elle fournit un controle complet sur chaque élément d'un graphique (axes, légendes, couleurs, tailles).

**Le problème que Matplotlib résout** :

Sans Matplotlib, voici les problèmes rencontrés :

1. **Pas de representation visuelle** : des tableaux de chiffres sont difficiles a interpréter. Un graphique revele instantanément des tendances, des anomalies et des distributions.
2. **Outils externes** : sans bibliothèque de graphiques, il faut exporter les données vers Excel ou un logiciel tiers pour les visualiser.

**Comment Matplotlib résout ces problèmes** :

| Problème | Solution apportée par Matplotlib |
| --- | --- |
| Pas de representation visuelle | Des fonctions Python generent des graphiques directement depuis les données |
| Outils externes | Tout se fait dans le même script Python, sans logiciel supplémentaire |

**Analogie concrète** : Matplotlib, c'est une boite de matériel de dessin complete. Tu as des crayons (lignes), des feutres (barres), des compas (cercles), des règles (axes). Tu peux dessiner exactement ce que tu veux, mais il faut tout positionner toi-même. Seaborn, c'est un kit de pochoirs - tu choisis un modèle et le graphique se dessine presque tout seul.

---

### Qu'est-ce que Seaborn ?

**Définition** : Seaborn est une bibliothèque construite au-dessus de Matplotlib qui simplifie la création de graphiques statistiques avec un style visuel soigne par défaut.

**Le problème que Seaborn résout** :

Sans Seaborn, voici les problèmes rencontrés :

1. **Code verbeux** : créer un graphique statistique (distribution, correlation) en Matplotlib pur demande 10 a 20 lignes de code.
2. **Apparence par défaut médiocre** : les graphiques Matplotlib bruts sont fonctionnels mais visuellement austeres.

**Comment Seaborn résout ces problèmes** :

| Problème | Solution apportée par Seaborn |
| --- | --- |
| Code verbeux | Un graphique statistique se créé en une seule ligne de code |
| Apparence par défaut médiocre | Les palettes de couleurs et le style sont soignes par défaut |

**Ce que Seaborn n'est PAS** :

- Seaborn n'est pas un remplacement de Matplotlib. C'est un complement. Pour personnaliser finement un graphique Seaborn, on utilise les fonctions Matplotlib.
- Seaborn n'est pas fait pour les graphiques non statistiques (diagrammes de flux, cartes). Il est specialise dans les graphiques qui revelent des distributions et des relations entre variables.

**Comparaison Matplotlib vs Seaborn** :

| Matplotlib | Seaborn |
| --- | --- |
| Controle total, granulaire | Haut niveau, simplifie |
| Syntaxe verbeuse | Syntaxe concise |
| Style par défaut sobre | Style par défaut elegant |
| Tous types de graphiques | Specialise dans les graphiques statistiques |
| Base de la visualisation | Construit sur Matplotlib |

---

### Quel graphique pour quelle situation ?

**Guide de choix** :

| Type de graphique | Quand l'utiliser | Exemple |
| --- | --- | --- |
| Ligne (`plot`) | Évolution dans le temps | Ventes mensuelles sur un an |
| Barres (`bar`) | Comparer des catégories | CA par region |
| Nuage de points (`scatter`) | Relation entre 2 variables | Age vs salaire |
| Histogramme (`hist`) | Distribution d'une variable | Répartition des notes |
| Boîte à moustaches (`boxplot`) | Distribution + valeurs extrêmes | Salaires par département |

---

## Étapes Pratiques

### Étape 1 : Graphique en ligne (évolution temporelle)

Visualise l'évolution d'une donnée dans le temps.

```python
import matplotlib.pyplot as plt
import pandas as pd

# Donnees de ventes mensuelles
mois = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
        "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"]
ventes_2023 = [120, 135, 150, 145, 160, 180,
               170, 165, 190, 200, 210, 250]
ventes_2024 = [130, 140, 155, 160, 175, 195,
               185, 180, 205, 215, 230, 270]

# Creer la figure et les axes
fig, ax = plt.subplots(figsize=(10, 6))

# Tracer les deux lignes
ax.plot(mois, ventes_2023, marker="o", label="2023", color="#2196F3")
ax.plot(mois, ventes_2024, marker="s", label="2024", color="#FF5722")

# Personnaliser
ax.set_title("Ventes mensuelles 2023 vs 2024", fontsize=16, fontweight="bold")
ax.set_xlabel("Mois", fontsize=12)
ax.set_ylabel("Ventes (unites)", fontsize=12)
ax.legend(fontsize=11)
ax.grid(True, alpha=0.3)

# Sauvegarder
plt.tight_layout()
plt.savefig("output/ventes_mensuelles.png", dpi=150)
plt.close()

print("Graphique sauvegarde : output/ventes_mensuelles.png")
```

**Résultat attendu** :

```text
Graphique sauvegarde : output/ventes_mensuelles.png
```

Le fichier PNG contient un graphique avec deux lignes (bleue pour 2023, orange pour 2024), des marqueurs a chaque point, une légende et une grille.

---

### Étape 2 : Graphique en barres (comparaison de catégories)

Compare des valeurs entre catégories.

```python
import matplotlib.pyplot as plt
import numpy as np

# Donnees
categories = ["Electronique", "Vetements", "Alimentaire", "Maison", "Sport"]
ca = [45000, 32000, 58000, 28000, 15000]

# Barres verticales avec couleurs differentes
fig, ax = plt.subplots(figsize=(8, 5))

couleurs = ["#1976D2", "#388E3C", "#F57C00", "#7B1FA2", "#D32F2F"]
barres = ax.bar(categories, ca, color=couleurs, edgecolor="white", width=0.6)

# Ajouter les valeurs au-dessus des barres
for barre in barres:
    hauteur = barre.get_height()
    ax.text(barre.get_x() + barre.get_width() / 2, hauteur + 500,
            f"{hauteur:,.0f}", ha="center", fontsize=10)

ax.set_title("Chiffre d'affaires par categorie", fontsize=14, fontweight="bold")
ax.set_ylabel("CA (EUR)", fontsize=12)
ax.set_ylim(0, max(ca) * 1.15)  # Laisser de la place pour les valeurs

plt.tight_layout()
plt.savefig("output/ca_categories.png", dpi=150)
plt.close()

print("Graphique sauvegarde : output/ca_categories.png")
```

**Résultat attendu** :

```text
Graphique sauvegarde : output/ca_categories.png
```

---

### Étape 3 : Nuage de points (relation entre variables)

Explore la relation entre deux variables numériques.

```python
import matplotlib.pyplot as plt
import numpy as np

# Generer des donnees correlees
np.random.seed(42)
experience = np.random.uniform(1, 20, 50)     # Annees d'experience
salaire = 25000 + experience * 2500 + np.random.normal(0, 5000, 50)

fig, ax = plt.subplots(figsize=(8, 6))

# Nuage de points
ax.scatter(experience, salaire, alpha=0.7, color="#1976D2",
           edgecolors="white", s=60)

# Ajouter une ligne de tendance
coefficients = np.polyfit(experience, salaire, 1)
tendance = np.poly1d(coefficients)
x_tendance = np.linspace(experience.min(), experience.max(), 100)
ax.plot(x_tendance, tendance(x_tendance), color="#D32F2F",
        linestyle="--", linewidth=2, label="Tendance")

ax.set_title("Salaire en fonction de l'experience", fontsize=14, fontweight="bold")
ax.set_xlabel("Annees d'experience", fontsize=12)
ax.set_ylabel("Salaire annuel (EUR)", fontsize=12)
ax.legend()
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("output/salaire_experience.png", dpi=150)
plt.close()

print("Graphique sauvegarde : output/salaire_experience.png")
```

**Résultat attendu** :

```text
Graphique sauvegarde : output/salaire_experience.png
```

---

### Étape 4 : Histogramme et boîte à moustaches (distribution)

Visualise la distribution d'une variable.

```python
import matplotlib.pyplot as plt
import numpy as np

# Generer des notes d'etudiants
np.random.seed(42)
notes = np.random.normal(12, 3, 200)  # Moyenne 12, ecart-type 3, 200 eleves
notes = np.clip(notes, 0, 20)         # Borner entre 0 et 20

# Creer deux graphiques cote a cote
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Histogramme
ax1.hist(notes, bins=20, color="#1976D2", edgecolor="white", alpha=0.8)
ax1.axvline(notes.mean(), color="#D32F2F", linestyle="--",
            linewidth=2, label=f"Moyenne : {notes.mean():.1f}")
ax1.set_title("Distribution des notes", fontsize=14, fontweight="bold")
ax1.set_xlabel("Note", fontsize=12)
ax1.set_ylabel("Nombre d'eleves", fontsize=12)
ax1.legend(fontsize=11)

# Boite a moustaches
bp = ax2.boxplot(notes, vert=True, patch_artist=True,
                 boxprops=dict(facecolor="#1976D2", alpha=0.7),
                 medianprops=dict(color="#D32F2F", linewidth=2))
ax2.set_title("Boite a moustaches des notes", fontsize=14, fontweight="bold")
ax2.set_ylabel("Note", fontsize=12)
ax2.set_xticklabels(["Notes"])

plt.tight_layout()
plt.savefig("output/distribution_notes.png", dpi=150)
plt.close()

print("Graphique sauvegarde : output/distribution_notes.png")
```

**Résultat attendu** :

```text
Graphique sauvegarde : output/distribution_notes.png
```

Le fichier contient deux graphiques cote a cote : un histogramme avec la moyenne en ligne rouge et une boîte à moustaches montrant la médiane, les quartiles et les valeurs extrêmes.

---

### Étape 5 : Graphiques Seaborn (statistiques avancées)

Créé des graphiques statistiques en une ligne avec Seaborn.

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Creer un DataFrame d'exemple
np.random.seed(42)
df = pd.DataFrame({
    "Departement": np.random.choice(["RH", "Tech", "Marketing", "Finance"], 100),
    "Salaire": np.random.normal(40000, 8000, 100),
    "Experience": np.random.uniform(1, 15, 100),
    "Satisfaction": np.random.randint(1, 11, 100)
})

# Style Seaborn
sns.set_theme(style="whitegrid")

# --- Graphique 1 : Distribution par categorie ---
fig, ax = plt.subplots(figsize=(10, 6))
sns.boxplot(data=df, x="Departement", y="Salaire", hue="Departement", palette="Set2", legend=False, ax=ax)
ax.set_title("Salaires par departement", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("output/seaborn_boxplot.png", dpi=150)
plt.close()

# --- Graphique 2 : Histogramme avec courbe de densite ---
fig, ax = plt.subplots(figsize=(8, 5))
sns.histplot(data=df, x="Salaire", kde=True, bins=20, color="#1976D2", ax=ax)
ax.set_title("Distribution des salaires", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("output/seaborn_histplot.png", dpi=150)
plt.close()

# --- Graphique 3 : Nuage de points avec regression ---
fig, ax = plt.subplots(figsize=(8, 6))
sns.regplot(data=df, x="Experience", y="Salaire",
            scatter_kws={"alpha": 0.5}, color="#1976D2", ax=ax)
ax.set_title("Salaire vs Experience (avec regression)", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("output/seaborn_regplot.png", dpi=150)
plt.close()

# --- Graphique 4 : Matrice de correlation ---
fig, ax = plt.subplots(figsize=(8, 6))
colonnes_num = df.select_dtypes(include="number")
correlation = colonnes_num.corr()
sns.heatmap(correlation, annot=True, cmap="coolwarm", center=0,
            fmt=".2f", ax=ax)
ax.set_title("Matrice de correlation", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("output/seaborn_heatmap.png", dpi=150)
plt.close()

print("4 graphiques Seaborn sauvegardes dans output/")
```

**Résultat attendu** :

```text
4 graphiques Seaborn sauvegardes dans output/
```

---

### Étape 6 : Composer une figure multi-graphiques (subplots)

Combine plusieurs graphiques dans une seule figure.

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    "Mois": ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun"] * 2,
    "Region": ["Nord"] * 6 + ["Sud"] * 6,
    "CA": [120, 135, 150, 145, 160, 180,
           100, 115, 125, 130, 140, 155]
})

# Figure avec 4 sous-graphiques (2x2)
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Graphique 1 : Lignes (haut gauche)
for region in df["Region"].unique():
    donnees = df[df["Region"] == region]
    axes[0, 0].plot(donnees["Mois"], donnees["CA"], marker="o", label=region)
axes[0, 0].set_title("Evolution du CA par region")
axes[0, 0].legend()
axes[0, 0].grid(True, alpha=0.3)

# Graphique 2 : Barres groupees (haut droit)
ca_region = df.groupby("Region")["CA"].sum()
axes[0, 1].bar(ca_region.index, ca_region.values, color=["#1976D2", "#FF5722"])
axes[0, 1].set_title("CA total par region")

# Graphique 3 : Histogramme (bas gauche)
axes[1, 0].hist(df["CA"], bins=8, color="#388E3C", edgecolor="white")
axes[1, 0].set_title("Distribution des CA mensuels")
axes[1, 0].set_xlabel("CA")

# Graphique 4 : Boite a moustaches (bas droit)
nord = df[df["Region"] == "Nord"]["CA"]
sud = df[df["Region"] == "Sud"]["CA"]
axes[1, 1].boxplot([nord, sud], tick_labels=["Nord", "Sud"],
                   patch_artist=True,
                   boxprops=dict(facecolor="#1976D2", alpha=0.5))
axes[1, 1].set_title("Distribution CA par region")

# Titre general
fig.suptitle("Tableau de bord des ventes", fontsize=16, fontweight="bold")
plt.tight_layout()
plt.savefig("output/dashboard_ventes.png", dpi=150)
plt.close()

print("Dashboard sauvegarde : output/dashboard_ventes.png")
```

**Résultat attendu** :

```text
Dashboard sauvegarde : output/dashboard_ventes.png
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `plt.subplots(figsize=(w, h))` | Créer une figure |
| `ax.plot(x, y)` | Graphique en ligne |
| `ax.bar(x, y)` | Graphique en barres |
| `ax.scatter(x, y)` | Nuage de points |
| `ax.hist(donnees, bins=n)` | Histogramme |
| `ax.boxplot(donnees)` | Boîte à moustaches |
| `ax.set_title("titre")` | Titre du graphique |
| `ax.set_xlabel("label")` | Label de l'axe X |
| `ax.legend()` | Afficher la légende |
| `plt.tight_layout()` | Ajuster les marges |
| `plt.savefig("fichier.png", dpi=150)` | Sauvegarder |
| `sns.boxplot(data=df, x=..., y=...)` | Boxplot Seaborn |
| `sns.histplot(data=df, x=..., kde=True)` | Histogramme Seaborn |
| `sns.regplot(data=df, x=..., y=...)` | Regression Seaborn |
| `sns.heatmap(matrice, annot=True)` | Carte de chaleur |

---

## Pièges Fréquents

### Piège 1 : Graphique qui ne s'affiche pas

**Problème** : le graphique ne s'affiche pas a l'écran après `plt.plot()`.

**Solution** : dans un script Python (pas un notebook), il faut appeler `plt.show()` pour afficher le graphique a l'écran, ou `plt.savefig()` pour le sauvegarder dans un fichier. Dans ce cursus, on utilise `plt.savefig()` car l'environnement est offline.

```python
# Pour afficher a l'ecran
plt.show()

# Pour sauvegarder en fichier
plt.savefig("graphique.png", dpi=150)
plt.close()  # Liberer la memoire
```

### Piège 2 : Graphiques qui se superposent

**Problème** : les graphiques de plusieurs scripts se melangent.

**Solution** : appelle `plt.close()` ou `plt.clf()` après chaque graphique pour vider la figure courante.

```python
# Bonne pratique : toujours fermer apres sauvegarde
plt.savefig("graphique1.png")
plt.close()  # Nettoie la figure

# Le graphique suivant commence sur une figure vierge
plt.plot(...)
```

### Piège 3 : Textes coupes dans les graphiques sauvegardes

**Problème** : les labels des axes ou le titre sont coupes dans le fichier PNG.

**Solution** : appelle `plt.tight_layout()` avant `plt.savefig()`. Cette fonction ajuste automatiquement les marges.

```python
plt.tight_layout()  # Ajuster les marges
plt.savefig("graphique.png", dpi=150, bbox_inches="tight")
```

---

## Checklist de Validation

- [ ] Je sais créer un graphique en ligne avec `ax.plot()`
- [ ] Je sais créer un graphique en barres avec `ax.bar()`
- [ ] Je sais créer un nuage de points avec `ax.scatter()`
- [ ] Je sais créer un histogramme et une boîte à moustaches
- [ ] Je sais personnaliser les titres, labels, couleurs et légendes
- [ ] Je sais utiliser Seaborn pour des graphiques statistiques en une ligne
- [ ] Je sais composer une figure avec plusieurs sous-graphiques (`subplots`)
- [ ] Je sais sauvegarder un graphique en fichier PNG

---

## Exercice Pratique

**Énoncé** : À partir d'un DataFrame de 50 etudiants (nom, note en maths, note en français, filiere), créé une figure avec 4 sous-graphiques : un histogramme des notes de maths, un boxplot des notes par filiere, un nuage de points maths vs français avec regression, et un bar chart de la note moyenne par filiere.

**Indications** :

- Utilise `np.random.seed(42)` pour la reproductibilité
- 3 filieres : "Scientifique", "Litteraire", "Économique"
- Notes entre 0 et 20
- Utilise `plt.subplots(2, 2, figsize=(14, 10))`
- Sauvegarde dans `output/dashboard_etudiants.png`

**Résultat attendu** :

```text
Dashboard sauvegarde : output/dashboard_etudiants.png
Figure contenant 4 graphiques :
- Histogramme des notes de maths
- Boxplot des notes par filiere
- Scatter plot maths vs francais avec regression
- Bar chart note moyenne par filiere
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Generer les donnees
np.random.seed(42)
n = 50
filieres = np.random.choice(["Scientifique", "Litteraire", "Economique"], n)
maths = np.clip(np.random.normal(12, 3, n), 0, 20)
francais = np.clip(np.random.normal(13, 2.5, n), 0, 20)

df = pd.DataFrame({
    "Filiere": filieres,
    "Maths": np.round(maths, 1),
    "Francais": np.round(francais, 1)
})

# Style Seaborn
sns.set_theme(style="whitegrid")

# Figure 2x2
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Histogramme des notes de maths
axes[0, 0].hist(df["Maths"], bins=15, color="#1976D2", edgecolor="white")
axes[0, 0].axvline(df["Maths"].mean(), color="#D32F2F", linestyle="--",
                   label=f"Moyenne : {df['Maths'].mean():.1f}")
axes[0, 0].set_title("Distribution des notes de maths")
axes[0, 0].set_xlabel("Note")
axes[0, 0].set_ylabel("Effectif")
axes[0, 0].legend()

# 2. Boxplot par filiere
sns.boxplot(data=df, x="Filiere", y="Maths", hue="Filiere", palette="Set2", legend=False, ax=axes[0, 1])
axes[0, 1].set_title("Notes de maths par filiere")

# 3. Scatter maths vs francais avec regression
sns.regplot(data=df, x="Maths", y="Francais",
            scatter_kws={"alpha": 0.6}, color="#1976D2", ax=axes[1, 0])
axes[1, 0].set_title("Maths vs Francais (regression)")

# 4. Note moyenne par filiere
moyennes = df.groupby("Filiere")["Maths"].mean().sort_values(ascending=False)
axes[1, 1].bar(moyennes.index, moyennes.values,
               color=["#1976D2", "#388E3C", "#FF5722"])
axes[1, 1].set_title("Note moyenne en maths par filiere")
axes[1, 1].set_ylabel("Moyenne")

# Titre general et sauvegarde
fig.suptitle("Dashboard etudiants", fontsize=16, fontweight="bold")
plt.tight_layout()
plt.savefig("output/dashboard_etudiants.png", dpi=150)
plt.close()

print("Dashboard sauvegarde : output/dashboard_etudiants.png")
```

---

## Navigation

← Fiche précédente : **[Pandas - Nettoyage de données](05-pandas-nettoyage.md)**

→ Fiche suivante : **[Pipeline d'analyse complet](07-pipeline-analyse.md)**
