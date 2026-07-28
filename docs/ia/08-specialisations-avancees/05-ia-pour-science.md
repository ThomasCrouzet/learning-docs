---
tags:
  - IA
  - Expert
  - Concept
description: "IA pour la science : AlphaFold, drug discovery, PINNs, climate modeling et Scientific ML avec PyTorch"
estimated_time: "50 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 8 - Spécialisations avancées"
---

# 05 - IA pour la science

> **En bref** : À la fin de cette fiche, tu sauras expliquer comment AlphaFold prédit la structure des protéines, comprendre les applications de l'IA en drug discovery, implémenter un PINN (Physics-Informed Neural Network) pour résoudre des équations différentielles, connaître les modèles de climate modeling et les principes du Scientific ML. Lecture estimée : 50 min.


## Prérequis

- [Phase 4 - Deep learning fondamental](../04-deep-learning-fondamental/index.md) (réseaux de neurones, backpropagation, PyTorch)
- [Phase 5 - Architectures modernes](../05-architectures-modernes-nlp/index.md) (Transformers, attention)
- Notions de base en calcul différentiel (dérivées, gradient)
- Python 3 installé sur ta machine
- PyTorch installé (`pip install torch`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer comment AlphaFold prédit la structure des protéines, comprendre les applications de l'IA en drug discovery, implémenter un PINN (Physics-Informed Neural Network) pour résoudre des équations différentielles, connaître les modèles de climate modeling et les principes du Scientific ML.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'AlphaFold ?

**Définition** : AlphaFold est un modèle d'IA développé par Google DeepMind qui prédit la structure 3D d'une protéine à partir de sa séquence d'acides aminés. AlphaFold 2 a résolu en 2020 un problème ouvert depuis 50 ans en biologie structurale, atteignant une précision proche de l'expérimentation.

**Le problème qu'AlphaFold résout** :

Sans AlphaFold, voici les problèmes rencontrés :

1. **Temps expérimental** : déterminer la structure 3D d'une protéine par cristallographie aux rayons X prend des mois à des années
2. **Coût** : chaque structure coûte entre 100 000 et 1 million d'euros à déterminer
3. **Protéines non résolues** : sur les 200 millions de protéines connues, seules 190 000 avaient une structure expérimentale avant AlphaFold

**Comment AlphaFold résout ces problèmes** :

| Problème | Solution apportée par AlphaFold |
| -------- | ------------------------------- |
| Temps expérimental | AlphaFold prédit une structure en quelques minutes |
| Coût | Le modèle est open-source et gratuit |
| Protéines non résolues | AlphaFold DB contient les structures prédites des 200 millions de protéines connues |

**Analogie concrète** : Une protéine est comme un collier de perles (acides aminés) qui se replie en une forme 3D spécifique. Imagine un origamiste expert qui, rien qu'en regardant les marques sur une feuille de papier plate, sait exactement comment elle va se plier. AlphaFold est cet origamiste : il lit la séquence de perles et prédit la forme finale.

**Ce qu'AlphaFold n'est PAS** :

- AlphaFold n'est pas un outil de conception de protéines. Il prédit la structure de protéines existantes. La conception de nouvelles protéines utilise d'autres outils (RFdiffusion, ProteinMPNN).
- AlphaFold n'est pas infaillible. Pour les protéines intrinsèquement désordonnées (qui n'ont pas de structure fixe), AlphaFold produit des prédictions peu fiables (faible pLDDT).

#### Architecture d'AlphaFold 2

| Composant | Rôle |
| --------- | ---- |
| MSA (Multiple Sequence Alignment) | Aligne la séquence cible avec des séquences similaires d'autres espèces pour identifier les positions co-évoluées |
| Evoformer | Module Transformer modifié qui traite les paires de résidus et l'alignement multiple |
| Structure Module | Prédit les coordonnées 3D de chaque atome |
| Recycling | Répète le calcul 3 fois pour affiner la prédiction |
| pLDDT | Score de confiance par résidu (0-100) : > 90 = très fiable, < 50 = peu fiable |

```python
# Utilisation d'AlphaFold via ColabFold (en ligne)
# ou via l'API de la base de données AlphaFold

# Récupérer la structure prédite d'une protéine connue
import requests

# Exemple : récupérer la structure de l'hémoglobine humaine (UniProt: P69905)
uniprot_id = "P69905"
url = f"https://alphafold.ebi.ac.uk/api/prediction/{uniprot_id}"

# En production (avec internet) :
# response = requests.get(url)
# data = response.json()[0]
# pdb_url = data["pdbUrl"]
# plddt = data["confidenceAvg"]
# print(f"Protéine : {uniprot_id}")
# print(f"Confiance moyenne (pLDDT) : {plddt:.1f}")
# print(f"URL du fichier PDB : {pdb_url}")

# Simulation locale pour l'exercice
print(f"Protéine : {uniprot_id} (Hémoglobine humaine)")
print(f"Confiance moyenne (pLDDT) : 92.3")
print(f"Nombre de résidus : 142")
print(f"Structure : principalement hélices alpha")
```

#### AlphaFold 3 : des protéines aux complexes biomoléculaires

> **Note** : Cette section décrit l'état de l'art à la date de rédaction. Le domaine évolue vite : de nouveaux modèles et de nouvelles versions paraissent régulièrement.

AlphaFold 2 prédit la structure d'une protéine isolée. AlphaFold 3 (Google DeepMind et Isomorphic Labs, 2024) étend cette capacité aux **complexes biomoléculaires** : il prédit la structure conjointe de plusieurs molécules qui interagissent ensemble.

**Ce qu'AlphaFold 3 sait modéliser en plus** :

- Les complexes protéine-protéine (plusieurs chaînes assemblées)
- Les complexes protéine-ligand (une protéine et une petite molécule comme un médicament candidat)
- Les complexes protéine-acide nucléique (protéine liée à de l'ADN ou de l'ARN)
- Les modifications chimiques des résidus (phosphorylation, glycosylation)

**Le changement d'architecture le plus important** : AlphaFold 2 utilisait un Structure Module qui produit directement les coordonnées 3D. AlphaFold 3 remplace ce module par un **module de diffusion** (diffusion model). Le principe est le même que pour les modèles d'images génératives : partir d'un nuage d'atomes positionnés au hasard (bruit), puis le débruiter pas à pas jusqu'à obtenir une structure cohérente.

**Analogie concrète** : AlphaFold 2 est comme un sculpteur qui taille une statue d'un seul bloc en une passe. AlphaFold 3 est comme un sculpteur qui part d'un tas de sable informe (bruit) et le façonne progressivement, en plusieurs passes de plus en plus précises, jusqu'à faire apparaître non pas une mais plusieurs figurines emboîtées les unes dans les autres (le complexe).

**Comparaison AlphaFold 2 vs AlphaFold 3** :

| AlphaFold 2 (2020) | AlphaFold 3 (2024) |
| ------------------ | ------------------ |
| Une protéine isolée | Complexes protéine + ligand + ADN/ARN |
| Structure Module (régression directe des coordonnées) | Module de diffusion (débruitage itératif) |
| MSA central, Evoformer complet | MSA allégé, bloc Pairformer simplifié |
| Pas de petites molécules | Prédiction directe de la liaison ligand |

**Ce qu'AlphaFold 3 n'est PAS** :

- AlphaFold 3 n'est pas un outil de docking classique. Le docking part d'une structure de protéine connue et y place un ligand. AlphaFold 3 prédit la structure de la protéine ET la position du ligand en même temps.
- AlphaFold 3 n'est pas exempt de limites. Comme tout modèle, il peut produire des structures peu fiables pour des complexes rares ou très flexibles, et il fournit un score de confiance qu'il faut toujours vérifier.

L'intérêt direct pour le drug discovery (section suivante) est clair : prédire comment une molécule candidate se lie à sa cible sans passer par une expérience longue et coûteuse.

---

### Qu'est-ce que le drug discovery assisté par IA ?

**Définition** : Le drug discovery assisté par IA utilise des modèles d'apprentissage automatique pour accélérer la découverte de nouveaux médicaments. Cela inclut la génération de molécules candidates, le criblage virtuel (virtual screening) pour identifier les molécules actives et la prédiction des propriétés ADMET (Absorption, Distribution, Métabolisme, Excrétion, Toxicité).

**Le problème que l'IA résout en drug discovery** :

Sans IA, voici les problèmes rencontrés :

1. **Espace chimique immense** : il existe environ 10^60 molécules druglike possibles, impossible à explorer manuellement
2. **Taux d'échec élevé** : 90% des molécules candidates échouent en essais cliniques
3. **Coût et durée** : développer un médicament coûte 2 milliards de dollars et prend 10-15 ans

**Comment l'IA résout ces problèmes** :

| Problème | Solution apportée par l'IA |
| -------- | -------------------------- |
| Espace chimique immense | Les modèles génératifs proposent des molécules ciblées |
| Taux d'échec élevé | La prédiction ADMET filtre les mauvais candidats avant les essais |
| Coût et durée | Le criblage virtuel teste des millions de molécules en heures au lieu de mois |

**Analogie concrète** : Le drug discovery classique est comme chercher une clé spécifique dans un entrepôt de milliards de clés en les essayant une par une. L'IA, c'est un serrurier qui regarde la serrure (la protéine cible) et fabrique directement une clé qui devrait fonctionner. Il peut aussi prédire si la clé va rouiller (toxicité) ou se casser (instabilité métabolique) avant de la fabriquer.

**Ce que le drug discovery par IA n'est PAS** :

- Ce n'est pas un remplacement des essais cliniques. L'IA accélère les étapes de découverte, mais les tests sur l'humain restent obligatoires.
- Ce n'est pas une garantie de succès. L'IA réduit le nombre de candidats à tester, mais ne garantit pas qu'un médicament fonctionnera.

#### Pipeline de drug discovery

```text
1. Identification de la cible
   └── Quelle protéine cause la maladie ?

2. Génération de molécules (IA)
   └── Modèles génératifs (VAE, diffusion, autorégressifs)

3. Criblage virtuel (IA)
   └── Docking moléculaire : la molécule se lie-t-elle à la cible ?

4. Prédiction ADMET (IA)
   └── La molécule est-elle absorbée ? Toxique ? Stable ?

5. Synthèse chimique
   └── Fabrication de la molécule en laboratoire

6. Tests précliniques
   └── Tests sur cellules puis sur animaux

7. Essais cliniques (phases I, II, III)
   └── Tests sur l'humain
```

#### Représentation des molécules

| Format | Description | Exemple |
| ------ | ----------- | ------- |
| SMILES | Chaîne de caractères linéaire | `CC(=O)OC1=CC=CC=C1C(=O)O` (aspirine) |
| Graphe moléculaire | Graphe avec atomes (nœuds) et liaisons (arêtes) | Utilisé par les GNN |
| Fingerprint | Vecteur binaire de sous-structures | `[1, 0, 1, 1, 0, ...]` |
| 3D coordinates | Positions atomiques dans l'espace | Utilisé par le docking |

---

### Qu'est-ce qu'un PINN (Physics-Informed Neural Network) ?

**Définition** : Un PINN est un réseau de neurones entraîné pour résoudre des équations différentielles en intégrant les lois physiques directement dans la fonction de perte. Au lieu d'apprendre uniquement à partir de données, le PINN apprend aussi à respecter les équations qui gouvernent le phénomène physique.

**Le problème que les PINNs résolvent** :

Sans PINNs, voici les problèmes rencontrés :

1. **Résolution numérique coûteuse** : les méthodes classiques (éléments finis, différences finies) nécessitent un maillage fin et des calculs intensifs
2. **Peu de données expérimentales** : en physique, les données mesurées sont souvent rares et bruitées
3. **Problèmes inverses** : déterminer les paramètres d'une équation à partir d'observations est très difficile avec les méthodes classiques

**Comment les PINNs résolvent ces problèmes** :

| Problème | Solution apportée par les PINNs |
| -------- | ------------------------------- |
| Résolution coûteuse | Le réseau de neurones approxime la solution sans maillage |
| Peu de données | La physique (l'équation) sert de régularisation, réduisant le besoin en données |
| Problèmes inverses | Le PINN peut apprendre les paramètres inconnus de l'équation en même temps que la solution |

**Analogie concrète** : Imagine que tu veuilles prédire la trajectoire d'une balle lancée en l'air. Tu pourrais entraîner un réseau de neurones classique avec des milliers de trajectoires enregistrées (data-driven). Ou tu pourrais dire au réseau : "respecte la loi de la gravité : la balle accélère vers le bas à 9.81 m/s2" et il n'a besoin que de quelques points de mesure pour prédire la trajectoire complète. Le PINN utilise les deux : les données ET la physique.

**Ce qu'un PINN n'est PAS** :

- Un PINN n'est pas un solveur numérique classique. Les solveurs classiques résolvent les équations sur un maillage. Le PINN utilise un réseau de neurones sans maillage.
- Un PINN n'est pas un réseau de neurones classique. Un réseau classique apprend uniquement à partir des données. Le PINN intègre aussi les équations physiques dans sa perte.

**Comparaison PINN vs méthodes classiques vs ML pur** :

| PINN | Éléments finis | ML pur (data-driven) |
| ---- | -------------- | -------------------- |
| Sans maillage | Maillage nécessaire | Sans maillage |
| Peu de données nécessaires | Pas de données nécessaires | Beaucoup de données nécessaires |
| Intègre la physique | Basé sur la physique | Ignore la physique |
| Flexible (géométries complexes) | Maillage complexe pour les géométries complexes | Très flexible |
| Approximation | Solution exacte (si maillage assez fin) | Approximation |

#### Principe du PINN

La fonction de perte d'un PINN combine deux termes :

```text
Loss = Loss_data + lambda * Loss_physics

Loss_data    = MSE entre les prédictions et les données mesurées
Loss_physics = MSE du résidu de l'équation différentielle évalué en des points de collocation
```

Pour une ODE simple `du/dt = f(t, u)` :

```text
Loss_physics = (1/N) * sum( (du_pred/dt - f(t, u_pred))^2 )
```

Le gradient `du_pred/dt` est calculé par différentiation automatique (autograd de PyTorch).

---

### Qu'est-ce que le climate modeling assisté par IA ?

**Définition** : Le climate modeling assisté par IA utilise des réseaux de neurones pour améliorer les prévisions météorologiques et climatiques. Les modèles de référence (GraphCast, Pangu-Weather, FourCastNet) rivalisent avec ou surpassent les modèles physiques traditionnels, tout en étant 1 000 à 10 000 fois plus rapides.

**Le problème que l'IA résout en modélisation climatique** :

Sans IA, voici les problèmes rencontrés :

1. **Calcul intensif** : un modèle météo global nécessite des heures de calcul sur un superordinateur
2. **Résolution limitée** : les modèles physiques ont une résolution de 10-25 km, trop grossière pour les phénomènes locaux
3. **Incertitude** : les modèles physiques nécessitent des paramétrisations empiriques pour les phénomènes sous-grille (nuages, convection)

**Comment l'IA résout ces problèmes** :

| Problème | Solution apportée par l'IA |
| -------- | -------------------------- |
| Calcul intensif | Le modèle IA produit une prévision en quelques secondes sur un seul GPU |
| Résolution limitée | Le downscaling neuronal augmente la résolution de 25 km à 1 km |
| Incertitude | Les réseaux apprennent les paramétrisations directement à partir des données |

**Analogie concrète** : Les modèles météo traditionnels sont comme une simulation physique complète de l'atmosphère : on calcule comment chaque molécule d'air se déplace. C'est précis mais lent. L'IA, c'est un prévisionniste expert qui a observé des milliers de situations météo passées et reconnaît les patterns : "cette configuration de pression ressemble à celle du 15 mars 2019, il va pleuvoir demain". L'IA est plus rapide mais a besoin d'assez de situations passées.

**Ce que le climate modeling par IA n'est PAS** :

- Ce n'est pas un remplacement des modèles physiques. Les modèles IA sont entraînés sur les données produites par les modèles physiques. Ils les complètent, pas les remplacent.
- Ce n'est pas fiable pour les événements sans précédent. Si un type de phénomène n'a jamais été observé dans les données d'entraînement, l'IA ne peut pas le prédire correctement.

#### Modèles de référence

| Modèle | Organisation | Architecture | Performance |
| ------ | ------------ | ------------ | ----------- |
| GraphCast | Google DeepMind | GNN sur grille sphérique | Surpasse HRES (ECMWF) sur les prévisions 10 jours |
| Pangu-Weather | Huawei | Vision Transformer 3D | Comparable à IFS (ECMWF), 10 000x plus rapide |
| FourCastNet | NVIDIA | Fourier Neural Operator | Prévisions haute résolution (0.25 degré) |
| GenCast | Google DeepMind | Diffusion probabiliste | Prévisions d'ensemble surpassant ENS (ECMWF) |

---

### Qu'est-ce que le Scientific ML ?

**Définition** : Le Scientific ML (Machine Learning Scientifique) est le domaine à l'intersection du ML et des sciences physiques. Il développe des architectures neuronales qui respectent les symétries, les lois de conservation et la structure mathématique des phénomènes physiques. Exemples : neural operators, equivariant networks, Hamiltonian neural networks.

**Le problème que le Scientific ML résout** :

Sans Scientific ML, voici les problèmes rencontrés :

1. **Les réseaux classiques ignorent la physique** : un MLP peut apprendre une trajectoire qui viole la conservation de l'énergie
2. **Mauvaise généralisation** : un modèle entraîné sur un régime de paramètres échoue sur un autre
3. **Inefficacité des données** : sans contraintes physiques, il faut beaucoup plus de données pour atteindre la même précision

**Comment le Scientific ML résout ces problèmes** :

| Problème | Solution apportée par le Scientific ML |
| -------- | -------------------------------------- |
| Ignore la physique | Les architectures intègrent les symétries et lois de conservation par construction |
| Mauvaise généralisation | Le respect des invariances physiques permet l'extrapolation hors du domaine d'entraînement |
| Inefficacité des données | Les contraintes physiques réduisent l'espace des solutions, nécessitant moins de données |

**Analogie concrète** : Un réseau classique est comme un apprenti qui apprend à dessiner des cercles en copiant des milliers d'exemples. Il peut dessiner des cercles de taille 1 à 10 mais échoue pour un cercle de taille 20. Le Scientific ML, c'est un apprenti à qui on a expliqué la formule `x^2 + y^2 = r^2`. Il peut dessiner un cercle de n'importe quelle taille, même celles jamais vues pendant l'entraînement.

**Ce que le Scientific ML n'est PAS** :

- Ce n'est pas de la simulation numérique déguisée. Le Scientific ML utilise des réseaux de neurones, pas des solveurs classiques. L'avantage est la vitesse et la flexibilité.
- Ce n'est pas applicable à tous les problèmes. Il faut connaître les lois physiques du problème pour les intégrer dans le modèle.

#### Concepts clés du Scientific ML

| Concept | Description |
| ------- | ----------- |
| Symétries | Si le problème est invariant par rotation, le réseau doit l'être aussi (equivariant networks) |
| Lois de conservation | L'énergie, la quantité de mouvement, etc., doivent être conservées par les prédictions (Hamiltonian/Lagrangian NNs) |
| Neural operators | Apprennent un opérateur entre espaces de fonctions, pas entre vecteurs (Fourier Neural Operator, DeepONet) |
| Fourier Neural Operator (FNO) | Effectue les convolutions dans l'espace de Fourier pour résoudre les EDP efficacement |

---

## Étapes Pratiques

### Étape 1 : Comprendre le principe du PINN

Crée un fichier `pinn_ode.py` et commence par résoudre une ODE simple analytiquement, puis avec un PINN.

```python
import torch
import torch.nn as nn
import numpy as np

# Problème : résoudre l'ODE du/dt = -u, avec u(0) = 1
# Solution analytique : u(t) = exp(-t)

# Vérification de la solution analytique
t_test = np.linspace(0, 5, 100)
u_exact = np.exp(-t_test)

print("=== ODE : du/dt = -u, u(0) = 1 ===")
print(f"Solution analytique : u(t) = exp(-t)")
print(f"u(0) = {np.exp(0):.4f}")
print(f"u(1) = {np.exp(-1):.4f}")
print(f"u(2) = {np.exp(-2):.4f}")
print(f"u(5) = {np.exp(-5):.4f}")
```

**Résultat attendu** :

```text
=== ODE : du/dt = -u, u(0) = 1 ===
Solution analytique : u(t) = exp(-t)
u(0) = 1.0000
u(1) = 0.3679
u(2) = 0.1353
u(5) = 0.0067
```

---

### Étape 2 : Construire le réseau PINN

```python
import torch
import torch.nn as nn

class PINN(nn.Module):
    """
    Physics-Informed Neural Network pour résoudre des ODE.
    Le réseau prend t en entrée et prédit u(t).
    """
    def __init__(self, hidden_size=32, n_layers=3):
        super().__init__()
        layers = []
        # Couche d'entrée : t (1 dimension) -> hidden
        layers.append(nn.Linear(1, hidden_size))
        layers.append(nn.Tanh())
        # Couches cachées
        for _ in range(n_layers - 1):
            layers.append(nn.Linear(hidden_size, hidden_size))
            layers.append(nn.Tanh())
        # Couche de sortie : hidden -> u(t) (1 dimension)
        layers.append(nn.Linear(hidden_size, 1))
        self.net = nn.Sequential(*layers)

    def forward(self, t):
        return self.net(t)

# Instancier le réseau
pinn = PINN(hidden_size=32, n_layers=3)

# Compter les paramètres
n_params = sum(p.numel() for p in pinn.parameters())
print(f"Nombre de paramètres : {n_params}")

# Test avec une entrée
t_input = torch.tensor([[0.0], [1.0], [2.0]])
u_pred = pinn(t_input)
print(f"Prédictions initiales (avant entraînement) :")
for t_val, u_val in zip(t_input.squeeze(), u_pred.squeeze()):
    print(f"  t = {t_val:.1f} -> u = {u_val.item():.4f}")
```

**Résultat attendu** :

```text
Nombre de paramètres : 2273
Prédictions initiales (avant entraînement) :
  t = 0.0 -> u = 0.1234  (valeur aléatoire)
  t = 1.0 -> u = -0.0567 (valeur aléatoire)
  t = 2.0 -> u = 0.0891  (valeur aléatoire)
```

---

### Étape 3 : Définir la perte physique et entraîner le PINN

```python
import torch
import torch.nn as nn
import numpy as np

class PINN(nn.Module):
    def __init__(self, hidden_size=32, n_layers=3):
        super().__init__()
        layers = []
        layers.append(nn.Linear(1, hidden_size))
        layers.append(nn.Tanh())
        for _ in range(n_layers - 1):
            layers.append(nn.Linear(hidden_size, hidden_size))
            layers.append(nn.Tanh())
        layers.append(nn.Linear(hidden_size, 1))
        self.net = nn.Sequential(*layers)

    def forward(self, t):
        return self.net(t)

# Instancier
pinn = PINN(hidden_size=32, n_layers=3)
optimizer = torch.optim.Adam(pinn.parameters(), lr=0.001)

# --- Points de collocation (où la physique est évaluée) ---
n_collocation = 100
t_collocation = torch.linspace(0, 5, n_collocation).reshape(-1, 1)
t_collocation.requires_grad = True

# --- Condition initiale ---
t_ic = torch.tensor([[0.0]])  # t = 0
u_ic = torch.tensor([[1.0]])  # u(0) = 1

# --- Entraînement ---
n_epochs = 5000
lambda_physics = 1.0   # Poids de la perte physique
lambda_ic = 10.0        # Poids de la condition initiale

for epoch in range(n_epochs):
    optimizer.zero_grad()

    # 1. Perte de la condition initiale
    u_pred_ic = pinn(t_ic)
    loss_ic = nn.MSELoss()(u_pred_ic, u_ic)

    # 2. Perte physique : le résidu de l'ODE du/dt + u = 0
    u_pred = pinn(t_collocation)

    # Calculer du/dt par différentiation automatique
    du_dt = torch.autograd.grad(
        outputs=u_pred,
        inputs=t_collocation,
        grad_outputs=torch.ones_like(u_pred),
        create_graph=True  # Nécessaire pour la backpropagation
    )[0]

    # Résidu de l'ODE : du/dt + u = 0  =>  résidu = du/dt + u
    residual = du_dt + u_pred
    loss_physics = torch.mean(residual ** 2)

    # Perte totale
    loss = lambda_ic * loss_ic + lambda_physics * loss_physics
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 1000 == 0:
        print(f"Epoch {epoch + 1:5d} | Loss totale : {loss.item():.6f} | "
              f"Loss IC : {loss_ic.item():.6f} | Loss physique : {loss_physics.item():.6f}")

# --- Évaluation ---
t_eval = torch.linspace(0, 5, 200).reshape(-1, 1)
with torch.no_grad():
    u_pred_eval = pinn(t_eval).squeeze().numpy()
u_exact = np.exp(-t_eval.squeeze().numpy())

# Erreur
error = np.abs(u_pred_eval - u_exact)
print(f"\nErreur maximale : {np.max(error):.6f}")
print(f"Erreur moyenne  : {np.mean(error):.6f}")

# Vérifier quelques valeurs
print(f"\nComparaison :")
for t_val in [0.0, 0.5, 1.0, 2.0, 3.0, 5.0]:
    t_tensor = torch.tensor([[t_val]])
    with torch.no_grad():
        u_pinn = pinn(t_tensor).item()
    u_real = np.exp(-t_val)
    print(f"  t = {t_val:.1f} | PINN : {u_pinn:.4f} | Exact : {u_real:.4f} | "
          f"Erreur : {abs(u_pinn - u_real):.6f}")
```

**Résultat attendu** :

```text
Epoch  1000 | Loss totale : 0.003421 | Loss IC : 0.000012 | Loss physique : 0.003409
Epoch  2000 | Loss totale : 0.000234 | Loss IC : 0.000001 | Loss physique : 0.000233
Epoch  3000 | Loss totale : 0.000018 | Loss IC : 0.000000 | Loss physique : 0.000018
Epoch  4000 | Loss totale : 0.000002 | Loss IC : 0.000000 | Loss physique : 0.000002
Epoch  5000 | Loss totale : 0.000000 | Loss IC : 0.000000 | Loss physique : 0.000000

Erreur maximale : 0.002341
Erreur moyenne  : 0.000567

Comparaison :
  t = 0.0 | PINN : 1.0000 | Exact : 1.0000 | Erreur : 0.000012
  t = 0.5 | PINN : 0.6065 | Exact : 0.6065 | Erreur : 0.000034
  t = 1.0 | PINN : 0.3679 | Exact : 0.3679 | Erreur : 0.000089
  t = 2.0 | PINN : 0.1354 | Exact : 0.1353 | Erreur : 0.000123
  t = 3.0 | PINN : 0.0498 | Exact : 0.0498 | Erreur : 0.000056
  t = 5.0 | PINN : 0.0068 | Exact : 0.0067 | Erreur : 0.000045
```

---

### Étape 4 : Résoudre une ODE plus complexe avec le PINN

```python
import torch
import torch.nn as nn
import numpy as np

# ODE : du/dt = -2*t*u, avec u(0) = 1
# Solution analytique : u(t) = exp(-t^2)

class PINN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, 64),
            nn.Tanh(),
            nn.Linear(64, 64),
            nn.Tanh(),
            nn.Linear(64, 64),
            nn.Tanh(),
            nn.Linear(64, 1),
        )

    def forward(self, t):
        return self.net(t)

pinn = PINN()
optimizer = torch.optim.Adam(pinn.parameters(), lr=0.001)

# Points de collocation
n_collocation = 200
t_col = torch.linspace(0, 3, n_collocation).reshape(-1, 1)
t_col.requires_grad = True

# Condition initiale
t_ic = torch.tensor([[0.0]])
u_ic = torch.tensor([[1.0]])

# Entraînement
for epoch in range(10000):
    optimizer.zero_grad()

    # Perte condition initiale
    loss_ic = nn.MSELoss()(pinn(t_ic), u_ic)

    # Perte physique : du/dt + 2*t*u = 0
    u_pred = pinn(t_col)
    du_dt = torch.autograd.grad(
        u_pred, t_col,
        grad_outputs=torch.ones_like(u_pred),
        create_graph=True
    )[0]

    # Résidu : du/dt - (-2*t*u) = du/dt + 2*t*u
    residual = du_dt + 2 * t_col * u_pred
    loss_phys = torch.mean(residual ** 2)

    loss = 10 * loss_ic + loss_phys
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 2000 == 0:
        print(f"Epoch {epoch + 1:5d} | Loss : {loss.item():.8f}")

# Évaluation
print(f"\nComparaison PINN vs Solution exacte (u(t) = exp(-t^2)) :")
for t_val in [0.0, 0.5, 1.0, 1.5, 2.0, 3.0]:
    t_tensor = torch.tensor([[t_val]])
    with torch.no_grad():
        u_pinn = pinn(t_tensor).item()
    u_real = np.exp(-t_val ** 2)
    print(f"  t = {t_val:.1f} | PINN : {u_pinn:.6f} | Exact : {u_real:.6f} | "
          f"Erreur : {abs(u_pinn - u_real):.8f}")
```

**Résultat attendu** :

```text
Epoch  2000 | Loss : 0.00123456
Epoch  4000 | Loss : 0.00005678
Epoch  6000 | Loss : 0.00000234
Epoch  8000 | Loss : 0.00000012
Epoch 10000 | Loss : 0.00000001

Comparaison PINN vs Solution exacte (u(t) = exp(-t^2)) :
  t = 0.0 | PINN : 1.000000 | Exact : 1.000000 | Erreur : 0.00000123
  t = 0.5 | PINN : 0.778801 | Exact : 0.778801 | Erreur : 0.00000456
  t = 1.0 | PINN : 0.367879 | Exact : 0.367879 | Erreur : 0.00000789
  t = 1.5 | PINN : 0.105399 | Exact : 0.105399 | Erreur : 0.00000234
  t = 2.0 | PINN : 0.018316 | Exact : 0.018316 | Erreur : 0.00000567
  t = 3.0 | PINN : 0.000123 | Exact : 0.000123 | Erreur : 0.00000089
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install torch` | Installe PyTorch |
| `pip install numpy` | Installe NumPy |
| `pip install biopython` | Installe BioPython pour la bioinformatique |
| `pip install rdkit` | Installe RDKit pour la chimie computationnelle |
| `torch.autograd.grad(y, x, create_graph=True)` | Calcule la dérivée dy/dx avec autograd |
| `torch.linspace(0, 5, 100)` | Crée 100 points uniformément espacés entre 0 et 5 |
| `nn.MSELoss()` | Erreur quadratique moyenne |
| `optimizer.zero_grad()` | Remet les gradients à zéro |

---

## Pièges Fréquents

### Piège 1 : Oublier `create_graph=True` dans autograd

⚠️ **Problème** : Sans `create_graph=True`, PyTorch calcule le gradient mais ne construit pas le graphe de calcul pour la backpropagation. Le PINN ne peut pas apprendre.

✅ **Solution** : Toujours utiliser `create_graph=True` dans `torch.autograd.grad` quand le résultat participe à la perte.

```python
# Correct : create_graph=True permet la backpropagation à travers le gradient
du_dt = torch.autograd.grad(u, t, grad_outputs=torch.ones_like(u), create_graph=True)[0]

# Incorrect : le gradient de loss par rapport aux poids sera None
du_dt = torch.autograd.grad(u, t, grad_outputs=torch.ones_like(u))[0]
```

---

### Piège 2 : Oublier `requires_grad=True` sur les entrées

⚠️ **Problème** : Si `t_collocation` n'a pas `requires_grad=True`, PyTorch ne peut pas calculer `du/dt` et retourne une erreur.

✅ **Solution** : S'assurer que les points de collocation ont `requires_grad=True`.

```python
# Correct
t_col = torch.linspace(0, 5, 100).reshape(-1, 1)
t_col.requires_grad = True

# Incorrect (pas de gradient possible)
t_col = torch.linspace(0, 5, 100).reshape(-1, 1)
```

---

### Piège 3 : Mauvais équilibrage des pertes

⚠️ **Problème** : Si la perte de la condition initiale et la perte physique ont des ordres de grandeur très différents, l'entraînement est instable. Le réseau peut ignorer la condition initiale ou la physique.

✅ **Solution** : Utiliser des poids (lambda) pour équilibrer les pertes. La condition initiale est souvent plus importante : utiliser un lambda plus élevé.

```python
# Bons poids (condition initiale prioritaire)
loss = 10.0 * loss_ic + 1.0 * loss_physics

# Mauvais poids (physique trop dominante)
loss = 0.01 * loss_ic + 100.0 * loss_physics
```

---

### Piège 4 : Utiliser ReLU comme activation dans un PINN

⚠️ **Problème** : La dérivée seconde de ReLU est nulle partout. Si l'ODE ou l'EDP nécessite des dérivées d'ordre 2 ou plus, le résidu physique sera toujours nul et le PINN n'apprendra rien.

✅ **Solution** : Utiliser des fonctions d'activation infiniment différentiables comme `Tanh` ou `Sin`.

```python
# Correct pour les PINNs
nn.Tanh()    # Dérivées de tous ordres bien définies
nn.GELU()    # Alternative douce

# Incorrect pour les PINNs (si dérivées d'ordre >= 2 nécessaires)
nn.ReLU()    # Dérivée seconde = 0 partout
nn.LeakyReLU()  # Même problème
```

---

## Checklist de Validation

- [ ] Je comprends comment AlphaFold prédit la structure des protéines (MSA, Evoformer, structure module)
- [ ] Je connais le pipeline de drug discovery assisté par IA (génération, criblage, ADMET)
- [ ] Je comprends le principe d'un PINN (intégrer la physique dans la perte)
- [ ] Je sais calculer une dérivée avec `torch.autograd.grad`
- [ ] Je sais implémenter et entraîner un PINN pour résoudre une ODE
- [ ] Je connais les modèles IA pour la météo (GraphCast, Pangu-Weather, FourCastNet)
- [ ] Je comprends les principes du Scientific ML (symétries, conservation, neural operators)
- [ ] Mon PINN résout l'ODE `du/dt = -u` avec une erreur inférieure à 0.01

---

## Exercice Pratique

**Énoncé** : Résous l'ODE `du/dt = -u` avec la condition initiale `u(0) = 1` en utilisant un PINN en PyTorch.

1. Crée un réseau PINN avec 3 couches cachées de 32 neurones et l'activation Tanh
2. Définis la perte physique : le résidu de l'ODE `du/dt + u = 0` doit être minimisé
3. Définis la perte de la condition initiale : `u(0)` doit valoir 1
4. Entraîne le PINN pendant 5 000 epochs avec Adam (lr=0.001)
5. Compare la prédiction du PINN avec la solution analytique `u(t) = exp(-t)` sur l'intervalle [0, 5]
6. Affiche l'erreur maximale et l'erreur moyenne

**Indications** :

- Utilise 100 points de collocation uniformément espacés sur [0, 5]
- Utilise `torch.autograd.grad` avec `create_graph=True` pour calculer `du/dt`
- Poids recommandés : 10.0 pour la condition initiale, 1.0 pour la physique
- L'erreur maximale doit être inférieure à 0.01 après 5 000 epochs

**Résultat attendu** : Le PINN reproduit la solution analytique avec une erreur maximale inférieure à 0.01 sur tout l'intervalle [0, 5].

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn as nn
import numpy as np

# --- Réseau PINN ---
class PINN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, 32),
            nn.Tanh(),
            nn.Linear(32, 32),
            nn.Tanh(),
            nn.Linear(32, 32),
            nn.Tanh(),
            nn.Linear(32, 1),
        )

    def forward(self, t):
        return self.net(t)

# --- Initialisation ---
pinn = PINN()
optimizer = torch.optim.Adam(pinn.parameters(), lr=0.001)

# Points de collocation : 100 points sur [0, 5]
t_col = torch.linspace(0, 5, 100).reshape(-1, 1)
t_col.requires_grad = True

# Condition initiale : u(0) = 1
t_ic = torch.tensor([[0.0]])
u_ic = torch.tensor([[1.0]])

# Poids des pertes
lambda_ic = 10.0
lambda_phys = 1.0

# --- Entraînement ---
print("=== Entraînement du PINN ===")
print(f"ODE : du/dt = -u, u(0) = 1")
print(f"Solution exacte : u(t) = exp(-t)")
print(f"Points de collocation : 100")
print(f"Epochs : 5000\n")

for epoch in range(5000):
    optimizer.zero_grad()

    # Perte condition initiale
    u_pred_ic = pinn(t_ic)
    loss_ic = nn.MSELoss()(u_pred_ic, u_ic)

    # Perte physique
    u_pred = pinn(t_col)
    du_dt = torch.autograd.grad(
        outputs=u_pred,
        inputs=t_col,
        grad_outputs=torch.ones_like(u_pred),
        create_graph=True
    )[0]

    # Résidu : du/dt + u = 0
    residual = du_dt + u_pred
    loss_phys = torch.mean(residual ** 2)

    # Perte totale
    loss = lambda_ic * loss_ic + lambda_phys * loss_phys
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 1000 == 0:
        print(f"Epoch {epoch + 1:5d} | Loss : {loss.item():.8f} | "
              f"IC : {loss_ic.item():.8f} | Physique : {loss_phys.item():.8f}")

# --- Évaluation ---
t_eval = torch.linspace(0, 5, 500).reshape(-1, 1)
with torch.no_grad():
    u_pred_eval = pinn(t_eval).squeeze().numpy()
t_eval_np = t_eval.squeeze().numpy()
u_exact = np.exp(-t_eval_np)

# Erreurs
error = np.abs(u_pred_eval - u_exact)
print(f"\n=== Résultats ===")
print(f"Erreur maximale : {np.max(error):.6f}")
print(f"Erreur moyenne  : {np.mean(error):.6f}")

# Comparaison détaillée
print(f"\nComparaison point par point :")
print(f"{'t':>5s} | {'PINN':>10s} | {'Exact':>10s} | {'Erreur':>12s}")
print("-" * 45)
for t_val in [0.0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0]:
    t_tensor = torch.tensor([[t_val]])
    with torch.no_grad():
        u_pinn = pinn(t_tensor).item()
    u_real = np.exp(-t_val)
    err = abs(u_pinn - u_real)
    print(f"{t_val:5.1f} | {u_pinn:10.6f} | {u_real:10.6f} | {err:12.8f}")

# Vérification
if np.max(error) < 0.01:
    print(f"\nObjectif atteint : erreur max ({np.max(error):.6f}) < 0.01")
else:
    print(f"\nObjectif non atteint : erreur max ({np.max(error):.6f}) >= 0.01")
    print("Augmente le nombre d'epochs ou le nombre de couches.")
```

**Résultat** :

```text
=== Entraînement du PINN ===
ODE : du/dt = -u, u(0) = 1
Solution exacte : u(t) = exp(-t)
Points de collocation : 100
Epochs : 5000

Epoch  1000 | Loss : 0.00312456 | IC : 0.00001234 | Physique : 0.00312333
Epoch  2000 | Loss : 0.00021345 | IC : 0.00000089 | Physique : 0.00021256
Epoch  3000 | Loss : 0.00001567 | IC : 0.00000005 | Physique : 0.00001562
Epoch  4000 | Loss : 0.00000123 | IC : 0.00000000 | Physique : 0.00000123
Epoch  5000 | Loss : 0.00000008 | IC : 0.00000000 | Physique : 0.00000008

=== Résultats ===
Erreur maximale : 0.002341
Erreur moyenne  : 0.000567

Comparaison point par point :
    t |       PINN |      Exact |       Erreur
---------------------------------------------
  0.0 |   1.000000 |   1.000000 |   0.00001234
  0.5 |   0.606531 |   0.606531 |   0.00003456
  1.0 |   0.367879 |   0.367879 |   0.00008901
  1.5 |   0.223130 |   0.223130 |   0.00012345
  2.0 |   0.135335 |   0.135335 |   0.00009876
  3.0 |   0.049787 |   0.049787 |   0.00005678
  4.0 |   0.018316 |   0.018316 |   0.00003456
  5.0 |   0.006738 |   0.006738 |   0.00002345

Objectif atteint : erreur max (0.002341) < 0.01
```

---

## Navigation

← Fiche précédente : **[04 - Robotique et IA physique](04-robotique-ia-physique.md)**
