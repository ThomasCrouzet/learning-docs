---
tags:
  - Python
  - Data
  - Intermédiaire
  - Pratique
description: "Construire un pipeline d'analyse complet : charger un CSV, nettoyer, analyser, visualiser et exporter les résultats."
estimated_time: "90 min"
fiche_number: 7
total_fiches: 8
cursus: "Python Data"
id: "web.python-data.pipeline-analyse"
course_id: "web.python-data"
content_type: "lesson"
order: 7
---

# 07 - Pipeline d'analyse complet

> **En bref** : Enchaîner toutes les étapes d'une analyse de données dans un pipeline structuré : chargement, nettoyage, exploration, analyse et export des résultats. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [06 - Visualisation avec Matplotlib et Seaborn](06-matplotlib-seaborn.md)
- Maîtriser NumPy, Pandas (manipulation + nettoyage) et les bases de Matplotlib/Seaborn
- Disposer de l'environnement virtuel avec les 4 bibliothèques installees

## Objectif de cette fiche

À la fin de cette fiche, tu sauras construire un pipeline d'analyse reproductible qui charge des données brutes, les nettoie, les explore, répond a des questions d'analyse et produit des graphiques et un rapport exporte.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un pipeline d'analyse ?

**Définition** : Un pipeline d'analyse est un enchainement ordonne d'étapes de traitement des données, ou la sortie de chaque étape sert d'entrée a la suivante. Le pipeline est conçu pour être reproductible : en le relancant sur les memes données, on obtient les memes résultats.

**Le problème que le pipeline résout** :

Sans pipeline structure, voici les problèmes rencontrés :

1. **Analyses non reproductibles** : si les étapes de nettoyage sont faites manuellement (copier-coller dans Excel), impossible de les reproduire exactement six mois plus tard.
2. **Étapes oubliees** : sans structure, on risque d'oublier une étape de nettoyage ou de validation, ce qui fausse les résultats.
3. **Code spaghetti** : sans organisation, le script devient un enchainement desordonne de cellules sans logique claire.

**Comment le pipeline résout ces problèmes** :

| Problème | Solution apportée par le pipeline |
| --- | --- |
| Analyses non reproductibles | Le script entier peut être relance a l'identique |
| Étapes oubliees | Chaque étape a une fonction dédiée avec un objectif clair |
| Code spaghetti | Le code est organise en fonctions séparées, dans l'ordre du cycle de vie |

**Analogie concrète** : Un pipeline d'analyse, c'est comme une chaîne de montage dans une usine. La matiere première (données brutes) entre d'un cote, passe par des postes de travail successifs (nettoyage, transformation, analyse), et un produit fini (rapport avec graphiques) sort de l'autre cote. Si tu changes la matiere première (nouvelles données), la chaîne produit automatiquement un nouveau produit fini.

**Structure du pipeline** :

<div class="diagram-design">
<p><a href="../../diagrams/16-python-data-07-pipeline-analyse-1.html">Qu&#x27;est-ce qu&#x27;un pipeline d&#x27;analyse ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/16-python-data-07-pipeline-analyse-1.html" title="Qu&#x27;est-ce qu&#x27;un pipeline d&#x27;analyse ?" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que la reproductibilité ?

**Définition** : La reproductibilité garantit qu'une analyse peut être relancee par n'importe qui, a n'importe quel moment, et produire les memes résultats.

**Le problème que la reproductibilité résout** :

Sans reproductibilité, voici les problèmes rencontrés :

1. **Résultats non verifiables** : si quelqu'un conteste tes conclusions, tu ne peux pas prouver qu'elles sont correctes en rejouant l'analyse.
2. **Mise a jour impossible** : quand de nouvelles données arrivent, il faut refaire toute l'analyse manuellement.

**Bonnes pratiques de reproductibilité** :

| Pratique | Pourquoi |
| --- | --- |
| Fixer le `random_seed` | Les résultats aleatoires sont identiques a chaque exécution |
| Versionner les données | On sait exactement quelles données ont produit quels résultats |
| Utiliser `requirements.txt` | Les versions des bibliothèques sont figees |
| Separer les fonctions | Chaque étape est isolée et testable indépendamment |

---

## Étapes Pratiques

### Étape 1 : Préparer le jeu de données

Créé un fichier CSV réaliste pour servir de base au pipeline.

```python
import pandas as pd
import numpy as np

# Graine globale (API legacy). Pour du code neuf, préfère
# rng = np.random.default_rng(42) puis rng.choice / rng.integers (voir Piège 2).
np.random.seed(42)

# Generer 200 lignes de donnees de ventes
n = 200
dates = pd.date_range("2024-01-01", periods=n, freq="D")
produits = np.random.choice(
    ["Laptop", "Clavier", "Souris", "Ecran", "Casque", "Webcam"], n
)
categories = {
    "Laptop": "Informatique", "Clavier": "Peripherique",
    "Souris": "Peripherique", "Ecran": "Informatique",
    "Casque": "Audio", "Webcam": "Peripherique"
}
regions = np.random.choice(["Nord", "Sud", "Est", "Ouest"], n)
quantites = np.random.randint(1, 50, n)
prix = {
    "Laptop": 899, "Clavier": 45, "Souris": 25,
    "Ecran": 350, "Casque": 80, "Webcam": 65
}

# Construire le DataFrame
df = pd.DataFrame({
    "date": dates,
    "produit": produits,
    "categorie": [categories[p] for p in produits],
    "region": regions,
    "quantite": quantites,
    "prix_unitaire": [prix[p] for p in produits]
})

# Introduire volontairement des problemes (donnees realistes)
# 1. Doublons
doublons = df.sample(10, random_state=42)
df = pd.concat([df, doublons], ignore_index=True)

# 2. Valeurs manquantes
indices_nan = np.random.choice(df.index, 8, replace=False)
df.loc[indices_nan[:4], "quantite"] = np.nan
df.loc[indices_nan[4:], "region"] = np.nan

# 3. Valeurs aberrantes
df.loc[5, "quantite"] = 999
df.loc[15, "prix_unitaire"] = -50

# Sauvegarder
df.to_csv("data/ventes_brutes.csv", index=False)
print(f"Fichier cree : data/ventes_brutes.csv ({len(df)} lignes)")
```

**Résultat attendu** :

```text
Fichier cree : data/ventes_brutes.csv (210 lignes)
```

---

### Étape 2 : Charger et explorer les données brutes

Première étape du pipeline : comprendre ce qu'on a.

```python
import pandas as pd

# --- ETAPE 1 : CHARGEMENT ---
df = pd.read_csv("data/ventes_brutes.csv", parse_dates=["date"])

print("=" * 60)
print("ETAPE 1 : EXPLORATION INITIALE")
print("=" * 60)

# Dimensions
print(f"\nDimensions : {df.shape[0]} lignes, {df.shape[1]} colonnes")

# Apercu
print("\nApercu (5 premieres lignes) :")
print(df.head())

# Types
print(f"\nTypes :\n{df.dtypes}")

# Valeurs manquantes
print(f"\nValeurs manquantes :\n{df.isna().sum()}")
print(f"Total NaN : {df.isna().sum().sum()}")

# Doublons
print(f"\nDoublons exacts : {df.duplicated().sum()}")

# Statistiques
print(f"\nStatistiques numeriques :")
print(df.describe())

# Valeurs uniques des colonnes textuelles
for col in df.select_dtypes(include="object").columns:
    print(f"\n{col} : {df[col].nunique()} valeurs uniques -> {df[col].unique()}")
```

**Résultat attendu** :

```text
============================================================
ETAPE 1 : EXPLORATION INITIALE
============================================================

Dimensions : 210 lignes, 6 colonnes

Apercu (5 premieres lignes) :
        date produit     categorie region  quantite  prix_unitaire
0 2024-01-01  Souris  Peripherique   Ouest      39.0             25
1 2024-01-02  Laptop  Informatique    Nord      15.0            899
2 2024-01-03  Casque         Audio     Est       2.0             80
3 2024-01-04  Clavier  Peripherique    Sud      26.0             45
4 2024-01-05  Webcam  Peripherique   Ouest      28.0             65

Types :
date             datetime64[us]
produit                  object
categorie                object
region                   object
quantite                float64
prix_unitaire              int64
dtype: object

Valeurs manquantes :
date             0
produit          0
categorie        0
region           4
quantite         4
prix_unitaire    0
dtype: int64
Total NaN : 8

Doublons exacts : 10

Statistiques numeriques :
         quantite  prix_unitaire
count  206.000000     210.000000
mean    28.975728     192.904762
...
```

---

### Étape 3 : Nettoyer les données

Deuxième étape : corriger tous les problèmes identifies.

```python
import pandas as pd
import numpy as np

# Charger les donnees brutes
df = pd.read_csv("data/ventes_brutes.csv", parse_dates=["date"])
print(f"Avant nettoyage : {len(df)} lignes")

# --- ETAPE 2 : NETTOYAGE ---
print("\n" + "=" * 60)
print("ETAPE 2 : NETTOYAGE")
print("=" * 60)

# 1. Supprimer les doublons
nb_doublons = df.duplicated().sum()
df = df.drop_duplicates()
print(f"\n1. Doublons supprimes : {nb_doublons}")

# 2. Gerer les valeurs manquantes
# Quantite : remplacer par la mediane du produit
for produit in df["produit"].unique():
    mediane = df.loc[df["produit"] == produit, "quantite"].median()
    masque = (df["produit"] == produit) & (df["quantite"].isna())
    df.loc[masque, "quantite"] = mediane

# Region : remplacer par "Inconnue"
df["region"] = df["region"].fillna("Inconnue")
print(f"2. NaN restants : {df.isna().sum().sum()}")

# 3. Corriger les valeurs aberrantes
# Quantite negative ou superieure a 500
nb_aberrantes = len(df[(df["quantite"] < 0) | (df["quantite"] > 500)])
df = df[(df["quantite"] >= 0) & (df["quantite"] <= 500)]
print(f"3. Valeurs aberrantes (quantite) supprimees : {nb_aberrantes}")

# Prix negatif
nb_prix_negatif = len(df[df["prix_unitaire"] < 0])
df = df[df["prix_unitaire"] > 0]
print(f"4. Prix negatifs supprimes : {nb_prix_negatif}")

# 4. Ajouter une colonne calculee
df["chiffre_affaires"] = df["quantite"] * df["prix_unitaire"]

# 5. Convertir quantite en entier (etait float a cause des NaN)
df["quantite"] = df["quantite"].astype(int)

print(f"\nApres nettoyage : {len(df)} lignes")

# Sauvegarder les donnees nettoyees
df.to_csv("data/ventes_propres.csv", index=False)
print("Fichier sauvegarde : data/ventes_propres.csv")
```

**Résultat attendu** :

```text
Avant nettoyage : 210 lignes

============================================================
ETAPE 2 : NETTOYAGE
============================================================

1. Doublons supprimes : 10
2. NaN restants : 0
3. Valeurs aberrantes (quantite) supprimees : 1
4. Prix negatifs supprimes : 1

Apres nettoyage : 198 lignes
Fichier sauvegarde : data/ventes_propres.csv
```

---

### Étape 4 : Analyser les données

Troisième étape : répondre aux questions d'analyse.

```python
import pandas as pd

# Charger les donnees nettoyees
df = pd.read_csv("data/ventes_propres.csv", parse_dates=["date"])

print("=" * 60)
print("ETAPE 3 : ANALYSE")
print("=" * 60)

# Question 1 : Quel est le CA total ?
ca_total = df["chiffre_affaires"].sum()
print(f"\n1. CA total : {ca_total:,.0f} EUR")

# Question 2 : Quel produit genere le plus de CA ?
ca_produit = df.groupby("produit")["chiffre_affaires"].sum().sort_values(ascending=False)
print(f"\n2. CA par produit :")
print(ca_produit)
print(f"   Meilleur produit : {ca_produit.index[0]} ({ca_produit.iloc[0]:,.0f} EUR)")

# Question 3 : Quelle region vend le plus ?
ca_region = df.groupby("region")["chiffre_affaires"].sum().sort_values(ascending=False)
print(f"\n3. CA par region :")
print(ca_region)

# Question 4 : Quelle est l'evolution mensuelle du CA ?
df["mois"] = df["date"].dt.to_period("M")
ca_mensuel = df.groupby("mois")["chiffre_affaires"].sum()
print(f"\n4. CA mensuel :")
print(ca_mensuel)

# Question 5 : Quel est le panier moyen par transaction ?
panier_moyen = df["chiffre_affaires"].mean()
print(f"\n5. Panier moyen : {panier_moyen:,.0f} EUR")

# Question 6 : Top 5 des plus grosses ventes
top5 = df.nlargest(5, "chiffre_affaires")[["date", "produit", "region", "quantite", "chiffre_affaires"]]
print(f"\n6. Top 5 des ventes :")
print(top5)
```

**Résultat attendu** (structure) :

```text
============================================================
ETAPE 3 : ANALYSE
============================================================

1. CA total : X,XXX,XXX EUR

2. CA par produit :
produit
Laptop        XXXXXX
Ecran         XXXXXX
...

3. CA par region :
...

4. CA mensuel :
...

5. Panier moyen : X,XXX EUR

6. Top 5 des ventes :
...
```

---

### Étape 5 : Visualiser les résultats

Quatrieme étape : créer les graphiques pour communiquer les résultats.

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Charger les donnees nettoyees
df = pd.read_csv("data/ventes_propres.csv", parse_dates=["date"])
df["mois"] = df["date"].dt.to_period("M").astype(str)

sns.set_theme(style="whitegrid")

# Figure avec 4 graphiques
fig, axes = plt.subplots(2, 2, figsize=(16, 12))

# 1. CA mensuel (evolution)
ca_mensuel = df.groupby("mois")["chiffre_affaires"].sum()
axes[0, 0].plot(range(len(ca_mensuel)), ca_mensuel.values,
                marker="o", color="#1976D2", linewidth=2)
axes[0, 0].set_xticks(range(len(ca_mensuel)))
axes[0, 0].set_xticklabels(ca_mensuel.index, rotation=45, ha="right")
axes[0, 0].set_title("Evolution du CA mensuel", fontsize=13, fontweight="bold")
axes[0, 0].set_ylabel("CA (EUR)")
axes[0, 0].grid(True, alpha=0.3)

# 2. CA par produit (barres)
ca_produit = df.groupby("produit")["chiffre_affaires"].sum().sort_values(ascending=True)
axes[0, 1].barh(ca_produit.index, ca_produit.values, color="#388E3C")
axes[0, 1].set_title("CA par produit", fontsize=13, fontweight="bold")
axes[0, 1].set_xlabel("CA (EUR)")

# 3. Distribution des CA par transaction (histogramme)
sns.histplot(df["chiffre_affaires"], bins=30, kde=True,
             color="#1976D2", ax=axes[1, 0])
axes[1, 0].set_title("Distribution des montants", fontsize=13, fontweight="bold")
axes[1, 0].set_xlabel("Montant (EUR)")

# 4. CA par region (barres)
ca_region = df.groupby("region")["chiffre_affaires"].sum().sort_values(ascending=False)
couleurs = ["#1976D2", "#388E3C", "#FF5722", "#7B1FA2", "#F57C00"]
axes[1, 1].bar(ca_region.index, ca_region.values,
               color=couleurs[:len(ca_region)])
axes[1, 1].set_title("CA par region", fontsize=13, fontweight="bold")
axes[1, 1].set_ylabel("CA (EUR)")

fig.suptitle("Rapport d'analyse des ventes 2024",
             fontsize=16, fontweight="bold")
plt.tight_layout()
plt.savefig("output/rapport_ventes.png", dpi=150, bbox_inches="tight")
plt.close()

print("Rapport graphique sauvegarde : output/rapport_ventes.png")
```

**Résultat attendu** :

```text
Rapport graphique sauvegarde : output/rapport_ventes.png
```

---

### Étape 6 : Exporter les résultats

Dernière étape : sauvegarder les résultats dans des fichiers réutilisables.

```python
import pandas as pd

# Charger les donnees nettoyees
df = pd.read_csv("data/ventes_propres.csv", parse_dates=["date"])
df["mois"] = df["date"].dt.to_period("M").astype(str)

print("=" * 60)
print("ETAPE 5 : EXPORT")
print("=" * 60)

# 1. Resume par produit
resume_produit = df.groupby("produit").agg(
    nb_ventes=("quantite", "count"),
    quantite_totale=("quantite", "sum"),
    ca_total=("chiffre_affaires", "sum"),
    ca_moyen=("chiffre_affaires", "mean")
).round(2).sort_values("ca_total", ascending=False)

resume_produit.to_csv("output/resume_produit.csv")
print("\n1. Resume par produit sauvegarde : output/resume_produit.csv")
print(resume_produit)

# 2. Resume par region
resume_region = df.groupby("region").agg(
    nb_ventes=("quantite", "count"),
    ca_total=("chiffre_affaires", "sum")
).sort_values("ca_total", ascending=False)

resume_region.to_csv("output/resume_region.csv")
print(f"\n2. Resume par region sauvegarde : output/resume_region.csv")
print(resume_region)

# 3. Evolution mensuelle
ca_mensuel = df.groupby("mois")["chiffre_affaires"].sum()
ca_mensuel.to_csv("output/ca_mensuel.csv")
print(f"\n3. CA mensuel sauvegarde : output/ca_mensuel.csv")

# 4. Resume textuel
with open("output/rapport.txt", "w", encoding="utf-8") as f:
    f.write("RAPPORT D'ANALYSE DES VENTES 2024\n")
    f.write("=" * 40 + "\n\n")
    f.write(f"Periode : {df['date'].min().strftime('%d/%m/%Y')} - {df['date'].max().strftime('%d/%m/%Y')}\n")
    f.write(f"Nombre de transactions : {len(df)}\n")
    f.write(f"CA total : {df['chiffre_affaires'].sum():,.0f} EUR\n")
    f.write(f"Panier moyen : {df['chiffre_affaires'].mean():,.0f} EUR\n\n")
    f.write(f"Meilleur produit : {resume_produit.index[0]}\n")
    f.write(f"Meilleure region : {resume_region.index[0]}\n")

print(f"\n4. Rapport textuel sauvegarde : output/rapport.txt")
print("\nPipeline termine avec succes.")
```

**Résultat attendu** :

```text
============================================================
ETAPE 5 : EXPORT
============================================================

1. Resume par produit sauvegarde : output/resume_produit.csv
...

2. Resume par region sauvegarde : output/resume_region.csv
...

3. CA mensuel sauvegarde : output/ca_mensuel.csv

4. Rapport textuel sauvegarde : output/rapport.txt

Pipeline termine avec succes.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `pd.read_csv(f, parse_dates=[col])` | Charger un CSV avec conversion de dates |
| `df.to_csv(f, index=False)` | Exporter en CSV sans l'index |
| `df.groupby(col).agg(...)` | Agrégation personnalisee |
| `df["date"].dt.to_period("M")` | Extraire le mois d'une date |
| `df.nlargest(n, col)` | Les n plus grandes valeurs |
| `df.nsmallest(n, col)` | Les n plus petites valeurs |
| `plt.tight_layout()` | Ajuster les marges de la figure |
| `plt.savefig(f, dpi=150)` | Sauvegarder en haute qualité |

---

## Pièges Fréquents

### Piège 1 : Modifier les données sources

**Problème** : tu modifies le fichier CSV original pendant le nettoyage. Si tu fais une erreur, les données sont perdues.

**Solution** : ne modifie jamais le fichier source. Charge-le, nettoie-le en mémoire, puis sauvegarde le résultat dans un nouveau fichier (ex: `ventes_propres.csv`).

```python
# Charger les donnees brutes (lecture seule)
df = pd.read_csv("data/ventes_brutes.csv")

# Nettoyer en memoire
df = df.drop_duplicates()

# Sauvegarder dans un NOUVEAU fichier
df.to_csv("data/ventes_propres.csv", index=False)
```

### Piège 2 : Ne pas fixer le générateur aléatoire

**Problème** : les résultats changent a chaque exécution a cause de l'aleatoire.

**Solution** : crée un générateur isolé avec une graine fixe, par exemple `rng = np.random.default_rng(42)`, puis utilise `rng.uniform(...)`, `rng.choice(...)`, etc. (`np.random.seed` reste supporté mais est une API legacy qui modifie un état global.)

### Piège 3 : Oublier `index=False` dans `to_csv`

**Problème** : le fichier CSV contient une colonne supplémentaire "Unnamed: 0" quand tu le recharges.

**Solution** : utilise toujours `df.to_csv("fichier.csv", index=False)` pour ne pas sauvegarder l'index.

```python
# Incorrect (ajoute une colonne d'index)
df.to_csv("fichier.csv")

# Correct
df.to_csv("fichier.csv", index=False)
```

---

## Checklist de Validation

- [ ] Je sais structurer un pipeline en étapes claires (charger, explorer, nettoyer, analyser, visualiser, exporter)
- [ ] Je sais identifier les problèmes dans un jeu de données brut (doublons, NaN, aberrantes)
- [ ] Je sais répondre a des questions d'analyse avec `groupby` et `agg`
- [ ] Je sais créer une figure multi-graphiques qui resume les résultats
- [ ] Je sais exporter les résultats en CSV et en rapport textuel
- [ ] Mon pipeline est reproductible (seed fixe, fichier source intact)

---

## Exercice Pratique

**Énoncé** : Créé un pipeline complet pour analyser un fichier de données meteorologiques. Le pipeline doit charger les données, les nettoyer (NaN, aberrantes), répondre a 3 questions d'analyse et produire 2 graphiques.

**Indications** :

- Génère un fichier `data/meteo.csv` avec les colonnes : `date`, `ville` (Paris, Lyon, Marseille), `temperature` (degrés C), `précipitation` (mm), `humidité` (%)
- 365 lignes (une par jour de 2024), avec quelques NaN et aberrantes
- Questions : température moyenne par ville, mois le plus pluvieux, correlation température/humidité
- Graphiques : évolution mensuelle de la température, boxplot des températures par ville

**Résultat attendu** :

```text
Pipeline meteo termine :
- data/meteo_propre.csv (donnees nettoyees)
- output/meteo_rapport.png (graphiques)
- output/meteo_resume.csv (statistiques)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# ==============================
# ETAPE 0 : GENERER LES DONNEES
# ==============================
np.random.seed(42)

dates = pd.date_range("2024-01-01", periods=365, freq="D")
villes = np.random.choice(["Paris", "Lyon", "Marseille"], 365)

# Temperatures saisonnieres (plus chaud en ete)
jour_de_annee = np.arange(365)
base_temp = 10 + 10 * np.sin(2 * np.pi * (jour_de_annee - 80) / 365)
temperatures = base_temp + np.random.normal(0, 3, 365)

precipitations = np.abs(np.random.exponential(3, 365))
humidite = np.clip(60 + precipitations * 3 + np.random.normal(0, 5, 365), 20, 100)

df = pd.DataFrame({
    "date": dates,
    "ville": villes,
    "temperature": np.round(temperatures, 1),
    "precipitation": np.round(precipitations, 1),
    "humidite": np.round(humidite, 1)
})

# Introduire des problemes
df.loc[np.random.choice(df.index, 5, replace=False), "temperature"] = np.nan
df.loc[10, "temperature"] = 55  # Aberrante

df.to_csv("data/meteo.csv", index=False)

# ==============================
# ETAPE 1 : CHARGEMENT
# ==============================
df = pd.read_csv("data/meteo.csv", parse_dates=["date"])
print(f"Chargement : {len(df)} lignes, NaN : {df.isna().sum().sum()}")

# ==============================
# ETAPE 2 : NETTOYAGE
# ==============================
# Supprimer les temperatures aberrantes (hors -20 a 45 pour la France)
df = df[(df["temperature"].isna()) | ((df["temperature"] > -20) & (df["temperature"] < 45))]

# Remplir les NaN de temperature par la mediane de la ville
for ville in df["ville"].unique():
    mediane = df.loc[df["ville"] == ville, "temperature"].median()
    masque = (df["ville"] == ville) & (df["temperature"].isna())
    df.loc[masque, "temperature"] = mediane

print(f"Apres nettoyage : {len(df)} lignes, NaN : {df.isna().sum().sum()}")

# ==============================
# ETAPE 3 : ANALYSE
# ==============================
# Temperature moyenne par ville
temp_ville = df.groupby("ville")["temperature"].mean().round(1)
print(f"\nTemperature moyenne par ville :\n{temp_ville}")

# Mois le plus pluvieux
df["mois"] = df["date"].dt.month
pluie_mensuelle = df.groupby("mois")["precipitation"].sum()
mois_pluvieux = pluie_mensuelle.idxmax()
print(f"\nMois le plus pluvieux : mois {mois_pluvieux} ({pluie_mensuelle[mois_pluvieux]:.0f} mm)")

# Correlation temperature / humidite
corr = df["temperature"].corr(df["humidite"])
print(f"Correlation temperature/humidite : {corr:.3f}")

# ==============================
# ETAPE 4 : VISUALISATION
# ==============================
sns.set_theme(style="whitegrid")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Evolution mensuelle de la temperature
temp_mensuelle = df.groupby("mois")["temperature"].mean()
ax1.plot(temp_mensuelle.index, temp_mensuelle.values,
         marker="o", color="#D32F2F", linewidth=2)
ax1.set_title("Temperature moyenne mensuelle", fontweight="bold")
ax1.set_xlabel("Mois")
ax1.set_ylabel("Temperature (C)")
ax1.set_xticks(range(1, 13))

# Boxplot par ville
sns.boxplot(data=df, x="ville", y="temperature", hue="ville", palette="Set2", legend=False, ax=ax2)
ax2.set_title("Distribution des temperatures par ville", fontweight="bold")

fig.suptitle("Rapport meteo 2024", fontsize=15, fontweight="bold")
plt.tight_layout()
plt.savefig("output/meteo_rapport.png", dpi=150)
plt.close()

# ==============================
# ETAPE 5 : EXPORT
# ==============================
resume = df.groupby("ville").agg(
    temp_moy=("temperature", "mean"),
    pluie_totale=("precipitation", "sum"),
    humidite_moy=("humidite", "mean")
).round(1)
resume.to_csv("output/meteo_resume.csv")
df.to_csv("data/meteo_propre.csv", index=False)

print("\nPipeline meteo termine :")
print("- data/meteo_propre.csv (donnees nettoyees)")
print("- output/meteo_rapport.png (graphiques)")
print("- output/meteo_resume.csv (statistiques)")
```

---

## Navigation

← Fiche précédente : **[Visualisation avec Matplotlib et Seaborn](06-matplotlib-seaborn.md)**

→ Fiche suivante : **[Projet intégrateur - Dashboard d'analyse](08-projet-integrateur.md)**
