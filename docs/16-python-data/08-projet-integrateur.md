---
tags:
  - Python
  - Data
  - Intermédiaire
  - Projet
description: "Projet intégrateur : analyser un jeu de données réel, construire un pipeline complet et produire un rapport avec graphiques."
estimated_time: "120 min"
fiche_number: 8
total_fiches: 8
cursus: "Python Data"
---

# 08 - Projet intégrateur - Dashboard d'analyse

> **En bref** : Mettre en pratique toutes les compétences du cursus en analysant un jeu de données réel, en construisant un pipeline complet et en produisant un rapport professionnel avec graphiques. Lecture estimée : 120 min.

## Prérequis

- Avoir lu la fiche [07 - Pipeline d'analyse complet](07-pipeline-analyse.md)
- Maîtriser NumPy, Pandas (Series, DataFrames, nettoyage, groupby, merge)
- Maîtriser Matplotlib et Seaborn (5 types de graphiques, subplots)
- Savoir construire un pipeline d'analyse reproductible

## Objectif de cette fiche

À la fin de cette fiche, tu auras construit un projet d'analyse complet et autonome qui charge un jeu de données réaliste, le nettoie, répond à des questions métier et produit un dashboard de 6 graphiques avec un rapport exporté.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un projet d'analyse de données ?

**Définition** : Un projet d'analyse de données est un livrable complet qui répond a des questions précises en s'appuyant sur des données. Il comprend le code du pipeline, les données (brutes et nettoyees), les graphiques et un rapport synthetique.

**Le problème qu'un projet d'analyse résout** :

Sans projet structure, voici les problèmes rencontrés :

1. **Code eparpille** : les scripts sont disperses, sans organisation ni documentation. Impossible de savoir par ou commencer.
2. **Résultats non exploitables** : des chiffres bruts sans contexte ni visualisation ne permettent pas de prendre des décisions.
3. **Travail non réutilisable** : quand de nouvelles données arrivent, il faut tout refaire depuis zéro.

**Comment un projet structure résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Code eparpille | Un script principal appelle des fonctions dédiées, dans un ordre logique |
| Résultats non exploitables | Un dashboard avec graphiques et un rapport rendent les résultats comprehensibles |
| Travail non réutilisable | Le pipeline accepte de nouvelles données sans modification du code |

**Analogie concrète** : Un projet d'analyse, c'est comme un rapport d'architecte. Il contient les plans (le code), les mesures du terrain (les données brutes), les calculs de structure (le nettoyage et l'analyse), les dessins 3D (les graphiques) et une synthese pour le client (le rapport). Chaque partie est indispensable et fait référence aux autres.

---

### Qu'est-ce qu'un dashboard ?

**Définition** : Un dashboard (tableau de bord) est une page qui regroupe plusieurs graphiques et indicateurs clés pour donner une vision d'ensemble d'une situation en un coup d'oeil.

**Le problème qu'un dashboard résout** :

Sans dashboard, voici les problèmes rencontrés :

1. **Vision fragmentee** : chaque graphique est un fichier separe. Il faut les ouvrir un par un pour comprendre la situation.
2. **Pas de vision d'ensemble** : des dizaines de tableaux et graphiques isoles ne permettent pas de voir les tendances globales.

**Comment un dashboard résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Vision fragmentee | Tous les graphiques sont regroupes dans une seule figure |
| Pas de vision d'ensemble | Les indicateurs clés (KPIs) et les graphiques complémentaires revelent les tendances |

**Ce qu'un dashboard n'est PAS** :

- Un dashboard n'est pas un rapport detaille. Il montre les points clés et les tendances. Les détails sont dans les fichiers CSV exportes.
- Un dashboard statique (image PNG) n'est pas interactif. Pour de l'interactivite (filtres, zoom), on utilise des outils comme Plotly, Dash ou Streamlit. Ce cursus se concentre sur les dashboards statiques.

---

### Comment structurer un projet d'analyse ?

**Structure recommandée** :

```text
projet-analyse/
├── data/
│   ├── donnees_brutes.csv      # Donnees originales (jamais modifiees)
│   └── donnees_propres.csv     # Donnees apres nettoyage
├── output/
│   ├── dashboard.png           # Figure principale
│   ├── rapport.txt             # Rapport textuel
│   └── resume.csv              # Statistiques exportees
├── analyse.py                  # Script principal du pipeline
├── requirements.txt            # Dependances Python
└── README.txt                  # Description du projet
```

**Règles de la structure** :

| Règle | Pourquoi |
| --- | --- |
| Données brutes jamais modifiees | Possibilite de tout relancer depuis zéro |
| Données nettoyees dans un fichier separe | Tracer ce qui a change |
| Résultats dans `output/` | Separer les entrées des sorties |
| Un seul script principal | Point d'entrée unique et clair |

---

## Étapes Pratiques

### Étape 1 : Générer le jeu de données

Créé un jeu de données réaliste simulant les ventes d'une chaîne de magasins sur un an.

```python
import pandas as pd
import numpy as np

np.random.seed(42)

# Parametres
n = 1000
dates = pd.date_range("2024-01-01", periods=365, freq="D")

# Generer les ventes
lignes = []
magasins = ["Paris Centre", "Lyon Part-Dieu", "Marseille Vieux-Port",
            "Toulouse Capitole", "Bordeaux Sainte-Catherine"]
categories = {
    "Electronique": ["Laptop", "Tablette", "Smartphone", "Ecouteurs"],
    "Maison": ["Lampe", "Coussin", "Cadre", "Bougie"],
    "Vetements": ["T-shirt", "Jean", "Veste", "Chaussures"]
}
prix_base = {
    "Laptop": 899, "Tablette": 449, "Smartphone": 699, "Ecouteurs": 79,
    "Lampe": 45, "Coussin": 25, "Cadre": 35, "Bougie": 12,
    "T-shirt": 29, "Jean": 59, "Veste": 89, "Chaussures": 69
}

for _ in range(n):
    date = np.random.choice(dates)
    magasin = np.random.choice(magasins)
    categorie = np.random.choice(list(categories.keys()))
    produit = np.random.choice(categories[categorie])
    quantite = np.random.randint(1, 15)
    prix = prix_base[produit] * np.random.uniform(0.9, 1.1)  # Variation de prix

    lignes.append({
        "date": date,
        "magasin": magasin,
        "categorie": categorie,
        "produit": produit,
        "quantite": quantite,
        "prix_unitaire": round(prix, 2)
    })

df = pd.DataFrame(lignes)

# Introduire des problemes realistes
# 1. Doublons (5 %)
doublons = df.sample(50, random_state=42)
df = pd.concat([df, doublons], ignore_index=True)

# 2. Valeurs manquantes (3 %)
indices = np.random.choice(df.index, 30, replace=False)
df.loc[indices[:10], "quantite"] = np.nan
df.loc[indices[10:20], "magasin"] = np.nan
df.loc[indices[20:], "prix_unitaire"] = np.nan

# 3. Valeurs aberrantes
df.loc[3, "quantite"] = 500      # Quantite anormale
df.loc[7, "prix_unitaire"] = -10  # Prix negatif
df.loc[12, "quantite"] = -5      # Quantite negative

# Sauvegarder
df.to_csv("data/magasins_brutes.csv", index=False)
print(f"Jeu de donnees genere : {len(df)} lignes, {df.shape[1]} colonnes")
print(f"Fichier : data/magasins_brutes.csv")
```

**Résultat attendu** :

```text
Jeu de donnees genere : 1050 lignes, 6 colonnes
Fichier : data/magasins_brutes.csv
```

---

### Étape 2 : Charger et explorer

Première phase du pipeline : comprendre la structure et les problèmes.

```python
import pandas as pd

# Chargement
df = pd.read_csv("data/magasins_brutes.csv", parse_dates=["date"])

print("=" * 60)
print("PHASE 1 : EXPLORATION")
print("=" * 60)

print(f"\nDimensions : {df.shape}")
print(f"\nApercu :")
print(df.head())

print(f"\nTypes :\n{df.dtypes}")

print(f"\nValeurs manquantes :\n{df.isna().sum()}")

print(f"\nDoublons : {df.duplicated().sum()}")

print(f"\nStatistiques numeriques :")
print(df.describe())

print(f"\nMagasins : {df['magasin'].dropna().unique()}")
print(f"Categories : {df['categorie'].unique()}")
print(f"Produits : {df['produit'].unique()}")

# Detecter les anomalies
print(f"\nQuantites negatives : {(df['quantite'] < 0).sum()}")
print(f"Prix negatifs : {(df['prix_unitaire'] < 0).sum()}")
print(f"Quantites > 100 : {(df['quantite'] > 100).sum()}")
```

**Résultat attendu** (structure) :

```text
============================================================
PHASE 1 : EXPLORATION
============================================================

Dimensions : (1050, 6)
...
Valeurs manquantes :
date              0
magasin          10
categorie         0
produit           0
quantite         10
prix_unitaire    10
...
Doublons : 50
...
Quantites negatives : 1
Prix negatifs : 1
Quantites > 100 : 1
```

---

### Étape 3 : Nettoyer les données

Deuxième phase : corriger systematiquement tous les problèmes identifies.

```python
import pandas as pd
import numpy as np

df = pd.read_csv("data/magasins_brutes.csv", parse_dates=["date"])

print("=" * 60)
print("PHASE 2 : NETTOYAGE")
print("=" * 60)
print(f"\nAvant : {len(df)} lignes")

# 1. Supprimer les doublons
doublons = df.duplicated().sum()
df = df.drop_duplicates()
print(f"1. Doublons supprimes : {doublons}")

# 2. Supprimer les valeurs aberrantes
# Quantites negatives ou anormalement elevees (> 100)
aberrantes_q = len(df[(df["quantite"] < 0) | (df["quantite"] > 100)])
df = df[(df["quantite"].isna()) | ((df["quantite"] >= 0) & (df["quantite"] <= 100))]
print(f"2. Quantites aberrantes supprimees : {aberrantes_q}")

# Prix negatifs
aberrantes_p = len(df[df["prix_unitaire"] < 0])
df = df[(df["prix_unitaire"].isna()) | (df["prix_unitaire"] > 0)]
print(f"3. Prix aberrants supprimes : {aberrantes_p}")

# 3. Gerer les valeurs manquantes
# Quantite : remplacer par la mediane du produit
for produit in df["produit"].unique():
    mediane = df.loc[df["produit"] == produit, "quantite"].median()
    masque = (df["produit"] == produit) & (df["quantite"].isna())
    df.loc[masque, "quantite"] = mediane

# Prix : remplacer par la mediane du produit
for produit in df["produit"].unique():
    mediane = df.loc[df["produit"] == produit, "prix_unitaire"].median()
    masque = (df["produit"] == produit) & (df["prix_unitaire"].isna())
    df.loc[masque, "prix_unitaire"] = mediane

# Magasin : supprimer les lignes sans magasin (pas de valeur par defaut logique)
avant = len(df)
df = df.dropna(subset=["magasin"])
print(f"4. Lignes sans magasin supprimees : {avant - len(df)}")

# 4. Ajouter les colonnes calculees
df["quantite"] = df["quantite"].astype(int)
df["chiffre_affaires"] = df["quantite"] * df["prix_unitaire"]
df["mois"] = df["date"].dt.month
df["mois_nom"] = df["date"].dt.strftime("%b")
df["trimestre"] = df["date"].dt.quarter

print(f"\nApres : {len(df)} lignes, NaN restants : {df.isna().sum().sum()}")

# Sauvegarder
df.to_csv("data/magasins_propres.csv", index=False)
print("Donnees nettoyees sauvegardees : data/magasins_propres.csv")
```

**Résultat attendu** (structure) :

```text
============================================================
PHASE 2 : NETTOYAGE
============================================================

Avant : 1050 lignes
1. Doublons supprimes : 50
2. Quantites aberrantes supprimees : 2
3. Prix aberrants supprimes : 1
4. Lignes sans magasin supprimees : 10

Apres : 987 lignes, NaN restants : 0
Donnees nettoyees sauvegardees : data/magasins_propres.csv
```

---

### Étape 4 : Analyser les données

Troisième phase : répondre aux questions metier.

```python
import pandas as pd

df = pd.read_csv("data/magasins_propres.csv", parse_dates=["date"])

print("=" * 60)
print("PHASE 3 : ANALYSE")
print("=" * 60)

# --- KPIs globaux ---
print("\n--- INDICATEURS CLES ---")
ca_total = df["chiffre_affaires"].sum()
nb_transactions = len(df)
panier_moyen = df["chiffre_affaires"].mean()
print(f"CA total         : {ca_total:,.0f} EUR")
print(f"Nb transactions  : {nb_transactions}")
print(f"Panier moyen     : {panier_moyen:,.0f} EUR")

# --- Question 1 : Quel magasin performe le mieux ? ---
print("\n--- CA PAR MAGASIN ---")
ca_magasin = df.groupby("magasin")["chiffre_affaires"].agg(["sum", "mean", "count"])
ca_magasin.columns = ["CA_Total", "CA_Moyen", "Nb_Ventes"]
ca_magasin = ca_magasin.sort_values("CA_Total", ascending=False)
print(ca_magasin.round(0))

# --- Question 2 : Quelle categorie genere le plus de revenus ? ---
print("\n--- CA PAR CATEGORIE ---")
ca_categorie = df.groupby("categorie")["chiffre_affaires"].sum().sort_values(ascending=False)
print(ca_categorie.round(0))
print(f"Part Electronique : {ca_categorie['Electronique'] / ca_total * 100:.1f} %")

# --- Question 3 : Quelle est l'evolution trimestrielle ? ---
print("\n--- CA TRIMESTRIEL ---")
ca_trim = df.groupby("trimestre")["chiffre_affaires"].sum()
print(ca_trim.round(0))
croissance = (ca_trim.iloc[-1] - ca_trim.iloc[0]) / ca_trim.iloc[0] * 100
print(f"Croissance T1 -> T4 : {croissance:+.1f} %")

# --- Question 4 : Top 5 des produits ---
print("\n--- TOP 5 PRODUITS (CA) ---")
ca_produit = df.groupby("produit")["chiffre_affaires"].sum().sort_values(ascending=False)
print(ca_produit.head())

# --- Question 5 : Quel jour de la semaine vend le plus ? ---
print("\n--- CA PAR JOUR DE SEMAINE ---")
jours = {0: "Lundi", 1: "Mardi", 2: "Mercredi", 3: "Jeudi",
         4: "Vendredi", 5: "Samedi", 6: "Dimanche"}
df["jour_semaine"] = df["date"].dt.dayofweek.map(jours)
ca_jour = df.groupby("jour_semaine")["chiffre_affaires"].sum()
# Reordonner
ordre = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
ca_jour = ca_jour.reindex(ordre)
print(ca_jour.round(0))
```

**Résultat attendu** (structure) :

```text
============================================================
PHASE 3 : ANALYSE
============================================================

--- INDICATEURS CLES ---
CA total         : X,XXX,XXX EUR
Nb transactions  : XXX
Panier moyen     : X,XXX EUR

--- CA PAR MAGASIN ---
                              CA_Total  CA_Moyen  Nb_Ventes
magasin
...

--- CA PAR CATEGORIE ---
...
Part Electronique : XX.X %

--- CA TRIMESTRIEL ---
...
Croissance T1 -> T4 : +X.X %

--- TOP 5 PRODUITS (CA) ---
...

--- CA PAR JOUR DE SEMAINE ---
...
```

---

### Étape 5 : Créer le dashboard

Quatrieme phase : produire la visualisation finale.

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("data/magasins_propres.csv", parse_dates=["date"])

sns.set_theme(style="whitegrid")

# Figure 3x2 (6 graphiques)
fig, axes = plt.subplots(3, 2, figsize=(18, 20))

# --- 1. Evolution mensuelle du CA ---
ca_mensuel = df.groupby(df["date"].dt.to_period("M"))["chiffre_affaires"].sum()
axes[0, 0].plot(range(len(ca_mensuel)), ca_mensuel.values,
                marker="o", color="#1976D2", linewidth=2, markersize=6)
axes[0, 0].set_xticks(range(len(ca_mensuel)))
labels_mois = [str(p) for p in ca_mensuel.index]
axes[0, 0].set_xticklabels(labels_mois, rotation=45, ha="right", fontsize=8)
axes[0, 0].set_title("Evolution mensuelle du CA", fontsize=13, fontweight="bold")
axes[0, 0].set_ylabel("CA (EUR)")
axes[0, 0].fill_between(range(len(ca_mensuel)), ca_mensuel.values,
                        alpha=0.15, color="#1976D2")

# --- 2. CA par magasin (barres horizontales) ---
ca_magasin = df.groupby("magasin")["chiffre_affaires"].sum().sort_values()
couleurs_magasin = sns.color_palette("Set2", len(ca_magasin))
axes[0, 1].barh(ca_magasin.index, ca_magasin.values, color=couleurs_magasin)
axes[0, 1].set_title("CA par magasin", fontsize=13, fontweight="bold")
axes[0, 1].set_xlabel("CA (EUR)")
for i, v in enumerate(ca_magasin.values):
    axes[0, 1].text(v + 1000, i, f"{v:,.0f}", va="center", fontsize=9)

# --- 3. Repartition par categorie (camembert) ---
ca_cat = df.groupby("categorie")["chiffre_affaires"].sum()
couleurs_cat = ["#1976D2", "#388E3C", "#FF5722"]
axes[1, 0].pie(ca_cat.values, labels=ca_cat.index, autopct="%1.1f%%",
               colors=couleurs_cat, startangle=90, textprops={"fontsize": 11})
axes[1, 0].set_title("Repartition CA par categorie", fontsize=13, fontweight="bold")

# --- 4. Top 10 produits ---
ca_produit = df.groupby("produit")["chiffre_affaires"].sum().sort_values(ascending=True)
axes[1, 1].barh(ca_produit.index, ca_produit.values, color="#7B1FA2")
axes[1, 1].set_title("CA par produit", fontsize=13, fontweight="bold")
axes[1, 1].set_xlabel("CA (EUR)")

# --- 5. Distribution des montants par transaction ---
sns.histplot(df["chiffre_affaires"], bins=40, kde=True,
             color="#1976D2", ax=axes[2, 0])
axes[2, 0].axvline(df["chiffre_affaires"].mean(), color="#D32F2F",
                    linestyle="--", linewidth=2,
                    label=f"Moyenne : {df['chiffre_affaires'].mean():,.0f} EUR")
axes[2, 0].axvline(df["chiffre_affaires"].median(), color="#388E3C",
                    linestyle="--", linewidth=2,
                    label=f"Mediane : {df['chiffre_affaires'].median():,.0f} EUR")
axes[2, 0].set_title("Distribution des montants", fontsize=13, fontweight="bold")
axes[2, 0].set_xlabel("Montant (EUR)")
axes[2, 0].legend(fontsize=10)

# --- 6. Boxplot CA par categorie et magasin ---
sns.boxplot(data=df, x="categorie", y="chiffre_affaires",
            hue="categorie", palette="Set2", legend=False, ax=axes[2, 1])
axes[2, 1].set_title("Distribution CA par categorie", fontsize=13, fontweight="bold")
axes[2, 1].set_ylabel("CA (EUR)")
axes[2, 1].set_xlabel("")

# Titre general
fig.suptitle("Dashboard - Analyse des ventes 2024",
             fontsize=20, fontweight="bold", y=0.98)
plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig("output/dashboard_magasins.png", dpi=150, bbox_inches="tight")
plt.close()

print("Dashboard sauvegarde : output/dashboard_magasins.png")
```

**Résultat attendu** :

```text
Dashboard sauvegarde : output/dashboard_magasins.png
```

Le fichier PNG contient 6 graphiques organises en grille 3x2, avec un titre général et des couleurs coherentes.

---

### Étape 6 : Exporter le rapport final

Cinquieme phase : produire les fichiers de sortie exploitables.

```python
import pandas as pd

df = pd.read_csv("data/magasins_propres.csv", parse_dates=["date"])

print("=" * 60)
print("PHASE 5 : EXPORT")
print("=" * 60)

# 1. Resume par magasin
resume_magasin = df.groupby("magasin").agg(
    nb_ventes=("quantite", "count"),
    quantite_totale=("quantite", "sum"),
    ca_total=("chiffre_affaires", "sum"),
    ca_moyen=("chiffre_affaires", "mean"),
    produit_le_plus_vendu=("produit", lambda x: x.value_counts().index[0])
).round(2).sort_values("ca_total", ascending=False)
resume_magasin.to_csv("output/resume_magasin.csv")
print("\n1. output/resume_magasin.csv")
print(resume_magasin)

# 2. Resume par produit
resume_produit = df.groupby("produit").agg(
    nb_ventes=("quantite", "count"),
    quantite_totale=("quantite", "sum"),
    ca_total=("chiffre_affaires", "sum")
).round(2).sort_values("ca_total", ascending=False)
resume_produit.to_csv("output/resume_produit_detail.csv")
print(f"\n2. output/resume_produit_detail.csv")

# 3. Evolution mensuelle
ca_mensuel = df.groupby(df["date"].dt.to_period("M").astype(str)).agg(
    nb_ventes=("quantite", "count"),
    ca_total=("chiffre_affaires", "sum")
).round(2)
ca_mensuel.to_csv("output/evolution_mensuelle.csv")
print(f"3. output/evolution_mensuelle.csv")

# 4. Rapport textuel complet
ca_total = df["chiffre_affaires"].sum()
ca_cat = df.groupby("categorie")["chiffre_affaires"].sum().sort_values(ascending=False)
ca_mag = df.groupby("magasin")["chiffre_affaires"].sum().sort_values(ascending=False)

with open("output/rapport_final.txt", "w", encoding="utf-8") as f:
    f.write("RAPPORT D'ANALYSE - VENTES MAGASINS 2024\n")
    f.write("=" * 50 + "\n\n")

    f.write("1. INDICATEURS CLES\n")
    f.write("-" * 30 + "\n")
    f.write(f"   Periode          : {df['date'].min().strftime('%d/%m/%Y')} - {df['date'].max().strftime('%d/%m/%Y')}\n")
    f.write(f"   Transactions     : {len(df)}\n")
    f.write(f"   CA total         : {ca_total:,.0f} EUR\n")
    f.write(f"   Panier moyen     : {df['chiffre_affaires'].mean():,.0f} EUR\n\n")

    f.write("2. PERFORMANCE PAR CATEGORIE\n")
    f.write("-" * 30 + "\n")
    for cat, ca in ca_cat.items():
        pct = ca / ca_total * 100
        f.write(f"   {cat:20s} : {ca:>12,.0f} EUR ({pct:.1f} %)\n")

    f.write(f"\n3. PERFORMANCE PAR MAGASIN\n")
    f.write("-" * 30 + "\n")
    for mag, ca in ca_mag.items():
        f.write(f"   {mag:30s} : {ca:>12,.0f} EUR\n")

    f.write(f"\n4. FICHIERS GENERES\n")
    f.write("-" * 30 + "\n")
    f.write("   - output/dashboard_magasins.png (dashboard graphique)\n")
    f.write("   - output/resume_magasin.csv\n")
    f.write("   - output/resume_produit_detail.csv\n")
    f.write("   - output/evolution_mensuelle.csv\n")
    f.write("   - output/rapport_final.txt (ce fichier)\n")

print(f"\n4. output/rapport_final.txt")
print("\n" + "=" * 60)
print("PROJET TERMINE")
print("=" * 60)
print("\nFichiers generes :")
print("  - data/magasins_propres.csv (donnees nettoyees)")
print("  - output/dashboard_magasins.png (6 graphiques)")
print("  - output/resume_magasin.csv")
print("  - output/resume_produit_detail.csv")
print("  - output/evolution_mensuelle.csv")
print("  - output/rapport_final.txt")
```

**Résultat attendu** :

```text
============================================================
PHASE 5 : EXPORT
============================================================

1. output/resume_magasin.csv
...

2. output/resume_produit_detail.csv
3. output/evolution_mensuelle.csv

4. output/rapport_final.txt

============================================================
PROJET TERMINE
============================================================

Fichiers generes :
  - data/magasins_propres.csv (donnees nettoyees)
  - output/dashboard_magasins.png (6 graphiques)
  - output/resume_magasin.csv
  - output/resume_produit_detail.csv
  - output/evolution_mensuelle.csv
  - output/rapport_final.txt
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `pd.read_csv(f, parse_dates=[col])` | Charger un CSV avec dates |
| `df.groupby(col).agg(...)` | Agregations multiples |
| `df["date"].dt.to_period("M")` | Regrouper par mois |
| `df["date"].dt.quarter` | Extraire le trimestre |
| `df["date"].dt.dayofweek` | Jour de la semaine (0=lundi) |
| `x.value_counts().index[0]` | Valeur la plus frequente |
| `plt.subplots(3, 2, figsize=(w, h))` | Grille de 6 graphiques |
| `fig.suptitle("titre", fontsize=20)` | Titre général de la figure |
| `plt.tight_layout(rect=[...])` | Ajuster les marges avec un titre |
| `df.to_csv(f, index=False)` | Exporter en CSV |

---

## Pièges Fréquents

### Piège 1 : Script trop long et monolithique

**Problème** : un script de 500 lignes sans structure est impossible a debugger.

**Solution** : decoupe le pipeline en fonctions. Chaque fonction fait une seule chose et retourne un résultat.

```python
def charger_donnees(chemin):
    """Charge et retourne le DataFrame brut."""
    return pd.read_csv(chemin, parse_dates=["date"])

def nettoyer(df):
    """Nettoie le DataFrame et retourne la version propre."""
    df = df.drop_duplicates()
    # ... autres etapes
    return df

def analyser(df):
    """Calcule et affiche les statistiques."""
    # ...
    return resultats

# Pipeline
df = charger_donnees("data/magasins_brutes.csv")
df = nettoyer(df)
resultats = analyser(df)
```

### Piège 2 : Graphiques illisibles par surcharge

**Problème** : trop d'informations sur un seul graphique le rendent illisible.

**Solution** : un graphique = une question. Si tu as 6 questions, fais 6 graphiques dans un subplot, pas un seul graphique avec 6 series.

### Piège 3 : Oublier d'encoder les fichiers en UTF-8

**Problème** : les accents dans le rapport textuel sont mal affiches sur certains systèmes.

**Solution** : precise toujours `encoding="utf-8"` a l'ouverture des fichiers texte.

```python
# Correct
with open("rapport.txt", "w", encoding="utf-8") as f:
    f.write("Resume des resultats")
```

---

## Checklist de Validation

- [ ] J'ai généré un jeu de données réaliste avec des problèmes volontaires
- [ ] J'ai explore les données et identifie tous les problèmes (doublons, NaN, aberrantes)
- [ ] J'ai nettoyé les données de maniere méthodique et documentée
- [ ] J'ai répondu à au moins 5 questions d'analyse avec des calculs
- [ ] J'ai créé un dashboard avec au moins 6 graphiques coherents
- [ ] J'ai exporte les résultats en CSV et en rapport textuel
- [ ] Mon pipeline est reproductible (seed fixe, fichier source intact)
- [ ] Mon code est organise en phases claires

---

## Exercice Pratique

**Énoncé** : Reprends le pipeline complet du projet en modifiant le jeu de données : utilise un contexte différent (bibliothèque municipale avec emprunts de livres, ou restaurant avec commandes, ou salle de sport avec inscriptions). Construis un pipeline complet avec les memes 5 phases et produis un dashboard de 6 graphiques.

**Indications** :

- Choisis un contexte qui t'interesse
- Genere au moins 500 lignes avec `np.random.seed(42)`
- Introduis les memes types de problèmes (doublons, NaN, aberrantes)
- Reponds a au moins 5 questions d'analyse pertinentes pour ton contexte
- Créé un dashboard 3x2 avec des graphiques varies
- Exporte un rapport textuel et des CSV de resume

**Résultat attendu** :

```text
Projet [ton contexte] termine :
- data/[contexte]_propres.csv
- output/dashboard_[contexte].png (6 graphiques)
- output/rapport_[contexte].txt
- output/resume_[contexte].csv
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete pour le contexte "Bibliothèque municipale". Essaie d'abord avec ton propre contexte avant de consulter cette solution.

---

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(42)

# ========================================
# GENERATION DES DONNEES (bibliotheque)
# ========================================
n = 600
dates = pd.date_range("2024-01-01", periods=365, freq="D")
genres = ["Roman", "Science-fiction", "Policier", "Essai", "BD", "Jeunesse"]
auteurs = {
    "Roman": ["Hugo", "Zola", "Camus", "Dumas"],
    "Science-fiction": ["Asimov", "Herbert", "Clarke", "Verne"],
    "Policier": ["Christie", "Conan Doyle", "Simenon", "Vargas"],
    "Essai": ["Harari", "Piketty", "Onfray", "Morin"],
    "BD": ["Herge", "Uderzo", "Franquin", "Peyo"],
    "Jeunesse": ["Rowling", "Saint-Exupery", "Dahl", "Goscinny"]
}

lignes = []
for _ in range(n):
    date = np.random.choice(dates)
    genre = np.random.choice(genres)
    auteur = np.random.choice(auteurs[genre])
    duree_emprunt = max(1, int(np.random.normal(14, 5)))
    adherent_age = np.random.choice(["Enfant", "Ado", "Adulte", "Senior"],
                                    p=[0.15, 0.20, 0.45, 0.20])

    lignes.append({
        "date_emprunt": date,
        "genre": genre,
        "auteur": auteur,
        "duree_jours": duree_emprunt,
        "tranche_age": adherent_age
    })

df = pd.DataFrame(lignes)

# Problemes
doublons = df.sample(30, random_state=42)
df = pd.concat([df, doublons], ignore_index=True)
indices = np.random.choice(df.index, 15, replace=False)
df.loc[indices[:8], "duree_jours"] = np.nan
df.loc[indices[8:], "genre"] = np.nan
df.loc[2, "duree_jours"] = 200  # Aberrante
df.to_csv("data/biblio_brutes.csv", index=False)

# ========================================
# PIPELINE COMPLET
# ========================================
df = pd.read_csv("data/biblio_brutes.csv", parse_dates=["date_emprunt"])

# Nettoyage
df = df.drop_duplicates()
df = df.dropna(subset=["genre"])
df["duree_jours"] = df["duree_jours"].fillna(df["duree_jours"].median())
df = df[(df["duree_jours"] > 0) & (df["duree_jours"] <= 60)]
df["duree_jours"] = df["duree_jours"].astype(int)
df["mois"] = df["date_emprunt"].dt.month

# Analyse
print(f"Emprunts : {len(df)}")
print(f"Duree moyenne d'emprunt : {df['duree_jours'].mean():.1f} jours")
print(f"\nEmprunts par genre :\n{df['genre'].value_counts()}")
print(f"\nAuteurs les plus empruntes :\n{df['auteur'].value_counts().head(5)}")

# Dashboard
sns.set_theme(style="whitegrid")
fig, axes = plt.subplots(3, 2, figsize=(16, 18))

# 1. Emprunts mensuels
emprunts_mois = df.groupby("mois").size()
axes[0, 0].bar(emprunts_mois.index, emprunts_mois.values, color="#1976D2")
axes[0, 0].set_title("Emprunts par mois", fontweight="bold")
axes[0, 0].set_xlabel("Mois")
axes[0, 0].set_xticks(range(1, 13))

# 2. Repartition par genre
genre_counts = df["genre"].value_counts()
axes[0, 1].pie(genre_counts.values, labels=genre_counts.index,
               autopct="%1.1f%%", colors=sns.color_palette("Set2"))
axes[0, 1].set_title("Repartition par genre", fontweight="bold")

# 3. Distribution duree d'emprunt
sns.histplot(df["duree_jours"], bins=25, kde=True, color="#388E3C", ax=axes[1, 0])
axes[1, 0].set_title("Distribution des durees d'emprunt", fontweight="bold")
axes[1, 0].set_xlabel("Jours")

# 4. Emprunts par tranche d'age
sns.countplot(data=df, x="tranche_age",
              order=["Enfant", "Ado", "Adulte", "Senior"],
              hue="tranche_age", palette="Set2", legend=False, ax=axes[1, 1])
axes[1, 1].set_title("Emprunts par tranche d'age", fontweight="bold")

# 5. Boxplot duree par genre
sns.boxplot(data=df, x="genre", y="duree_jours", hue="genre", palette="Set2", legend=False, ax=axes[2, 0])
axes[2, 0].set_title("Duree d'emprunt par genre", fontweight="bold")
axes[2, 0].tick_params(axis="x", rotation=45)

# 6. Top auteurs
top_auteurs = df["auteur"].value_counts().head(8)
axes[2, 1].barh(top_auteurs.index, top_auteurs.values, color="#7B1FA2")
axes[2, 1].set_title("Top 8 auteurs", fontweight="bold")
axes[2, 1].set_xlabel("Nombre d'emprunts")

fig.suptitle("Dashboard - Bibliotheque municipale 2024",
             fontsize=18, fontweight="bold")
plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig("output/dashboard_biblio.png", dpi=150, bbox_inches="tight")
plt.close()

# Export
df.to_csv("data/biblio_propres.csv", index=False)
resume = df.groupby("genre").agg(
    nb_emprunts=("duree_jours", "count"),
    duree_moyenne=("duree_jours", "mean")
).round(1)
resume.to_csv("output/resume_biblio.csv")

print("\nProjet Bibliotheque termine :")
print("  - data/biblio_propres.csv")
print("  - output/dashboard_biblio.png")
print("  - output/resume_biblio.csv")
```

---

## Pour aller plus loin

Tu as termine le cursus Python Data. Tu maitrises maintenant les outils fondamentaux pour analyser des données avec Python : NumPy pour le calcul numérique, Pandas pour la manipulation de données, et Matplotlib/Seaborn pour la visualisation.

**Prochaines étapes possibles** :

- **Cursus Intelligence Artificielle** : le cursus [Intelligence Artificielle](../ia/index.md) utilise les memes outils (NumPy, Pandas, Matplotlib) pour aller plus loin avec le machine learning et le deep learning
- **Bibliothèques complémentaires** : Plotly (graphiques interactifs), Polars (alternative rapide a Pandas), Scikit-learn (machine learning)
- **Projets personnels** : analyse de tes propres données (finances, sport, musique, meteo)

---

## Navigation

← Fiche précédente : **[Pipeline d'analyse complet](07-pipeline-analyse.md)**
