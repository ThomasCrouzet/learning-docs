---
tags:
  - IA
  - Débutant
  - Pratique
description: "Environnement de développement ML : venv, Jupyter, Git pour ML, GPU/CUDA et Docker pour la reproductibilité"
estimated_time: "85 min"
fiche_number: 2
total_fiches: 3
cursus: "Phase 2 - Programmation et outils"
id: "ai.artificial-intelligence.programming.environnement-developpement-infrastructure"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.programming"
content_type: "lesson"
order: 2
---

# 02 - Environnement de développement et infrastructure

> **En bref** : À la fin de cette fiche, tu sauras configurer un environnement de développement ML complet avec les environnements virtuels Python, Jupyter Notebook, Git adapté au ML, la détection GPU/CUDA, et Docker pour la reproductibilité. Lecture estimée : 85 min.


## Prérequis

- Fiche **[01 - Python pour l'IA](01-python-pour-ia.md)** (NumPy, Pandas, Matplotlib installés et fonctionnels)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer un environnement de développement ML complet avec les environnements virtuels Python, Jupyter Notebook, Git adapté au ML, la détection GPU/CUDA, et Docker pour la reproductibilité.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un environnement virtuel Python ?

**Définition** : Un environnement virtuel Python (venv) est un dossier isolé contenant une copie de l'interpréteur Python et ses propres packages installés, indépendamment des autres projets et du système.

**Le problème que les environnements virtuels résolvent** :

Sans environnements virtuels, voici les problèmes rencontrés :

1. **Conflits de versions** : le projet A nécessite NumPy 1.24 et le projet B nécessite NumPy 1.26. Les deux ne peuvent pas coexister dans le même Python système
2. **Pollution du système** : installer des packages globalement peut casser des outils système qui dépendent de versions spécifiques
3. **Reproductibilité impossible** : sans liste précise des dépendances et de leurs versions, un collègue ne peut pas reproduire ton environnement

**Comment les environnements virtuels résolvent ces problèmes** :

| Problème | Solution apportée par venv |
| -------- | -------------------------- |
| Conflits de versions | Chaque projet a son propre dossier de packages isolé |
| Pollution du système | Rien n'est installé globalement, le système reste intact |
| Reproductibilité impossible | `pip freeze > requirements.txt` fige les versions exactes |

**Analogie concrète** : Imagine un atelier de bricolage partagé. Sans venv, tous les projets partagent la même boite à outils : si tu remplaces le tournevis cruciforme par un tournevis plat pour ton projet, le projet du voisin ne fonctionne plus. Avec venv, chaque projet a sa propre boite à outils indépendante.

**Ce qu'un venv n'est PAS** :

- Un venv n'est pas un conteneur Docker. Un venv isole uniquement les packages Python. Docker isole tout le système (Python, bibliothèques C, système de fichiers).
- Un venv n'est pas conda. Conda gère aussi les dépendances non-Python (CUDA, compilateurs C). Venv ne gère que les packages Python.

**Comparaison venv vs conda** :

| venv | conda |
| ---- | ----- |
| Intégré à Python (rien à installer) | Nécessite l'installation d'Anaconda ou Miniconda |
| Gère uniquement les packages Python (pip) | Gère Python + bibliothèques C/C++ + CUDA |
| Léger et rapide | Plus lourd mais plus complet |
| Standard dans l'industrie | Populaire en data science |

---

### Qu'est-ce que Jupyter Notebook ?

**Définition** : Jupyter Notebook est un environnement de développement interactif qui permet d'écrire et d'exécuter du code Python dans des cellules individuelles, en alternant code, résultats, graphiques et texte explicatif dans un seul document.

**Le problème que Jupyter résout** :

Sans Jupyter, voici les problèmes rencontrés :

1. **Exploration difficile** : avec un script Python classique, il faut exécuter tout le fichier à chaque modification, même pour tester une seule ligne
2. **Résultats non persistants** : les graphiques et les résultats intermédiaires disparaissent quand le script se termine
3. **Documentation séparée** : le code est dans un fichier `.py`, les explications dans un autre document

**Comment Jupyter résout ces problèmes** :

| Problème | Solution apportée par Jupyter |
| -------- | ----------------------------- |
| Exploration difficile | Exécuter une seule cellule sans relancer tout le script |
| Résultats non persistants | Les résultats (tableaux, graphiques) restent affichés sous chaque cellule |
| Documentation séparée | Les cellules Markdown permettent d'écrire du texte explicatif entre les cellules de code |

**Analogie concrète** : Un script Python classique est un livre que tu dois lire du début à la fin à chaque fois. Un Jupyter Notebook est un cahier de laboratoire : tu peux écrire une expérience (cellule de code), noter les résultats (sortie), ajouter des commentaires (cellule Markdown), et revenir modifier une expérience précédente sans tout recommencer.

**Ce que Jupyter n'est PAS** :

- Jupyter n'est pas un IDE de production. Il est conçu pour l'exploration et le prototypage, pas pour écrire du code de production. Pour la production, utilise VS Code ou PyCharm.
- Jupyter n'est pas seulement pour Python. Il supporte des dizaines de langages (Julia, R, Scala) via des kernels différents. Le nom "Jupyter" vient de Julia, Python, R.

#### Jupyter Notebook vs JupyterLab

| Jupyter Notebook | JupyterLab |
| ---------------- | ---------- |
| Interface simple, un notebook par onglet | Interface multi-panneaux (IDE-like) |
| Suffisant pour débuter | Terminal intégré, explorateur de fichiers, éditeur de texte |
| Package : `notebook` | Package : `jupyterlab` |

---

### Qu'est-ce que Git pour le ML ?

**Définition** : Git pour le ML désigne l'ensemble des bonnes pratiques pour utiliser le contrôle de version Git dans un projet de machine learning, en tenant compte des spécificités ML : gros fichiers de données, modèles binaires volumineux, et expériences multiples.

**Le problème que Git pour le ML résout** :

Sans bonnes pratiques Git ML, voici les problèmes rencontrés :

1. **Dépôt énorme** : commiter un dataset de 2 Go ou un modèle de 500 Mo rend le dépôt Git inutilisable (clonage de plusieurs heures)
2. **Expériences perdues** : impossible de revenir à une configuration précédente qui donnait de bons résultats
3. **Résultats non reproductibles** : le code fonctionne mais les données ou le modèle ont changé entre-temps

**Comment Git pour le ML résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Dépôt énorme | `.gitignore` exclut les données et modèles. DVC (Data Version Control) les versionne séparément |
| Expériences perdues | Chaque expérience est un commit ou une branche avec ses hyperparamètres |
| Résultats non reproductibles | DVC lie le code (Git) aux données exactes utilisées |

**Analogie concrète** : Imagine un laboratoire de chimie. Le cahier de labo (Git) enregistre les protocoles (code) et les résultats (métriques). Mais tu ne colles pas les échantillons de 10 kg dans le cahier (données volumineuses). Tu les ranges dans une armoire numérotée (DVC/stockage externe) et tu notes la référence dans le cahier.

**Ce que Git pour le ML n'est PAS** :

- Git pour le ML n'est pas DVC tout seul. DVC est un outil complémentaire à Git, pas un remplacement. Git versionne le code, DVC versionne les données.
- Git pour le ML n'est pas MLflow. MLflow est un outil de tracking d'expériences (métriques, paramètres). Git versionne le code source.

---

### Qu'est-ce que le GPU et CUDA ?

**Définition** : Le GPU (Graphics Processing Unit) est un processeur spécialisé dans le calcul parallèle massif. CUDA (Compute Unified Device Architecture) est la plateforme logicielle de NVIDIA qui permet d'utiliser le GPU pour des calculs généraux, notamment le machine learning.

**Le problème que le GPU résout** :

Sans GPU, voici les problèmes rencontrés :

1. **Entraînement trop lent** : entraîner un réseau de neurones sur CPU peut prendre des jours ou des semaines
2. **Opérations matricielles séquentielles** : le CPU traite les multiplications de matrices séquentiellement, une opération à la fois
3. **Itérations limitées** : le temps de calcul empêche de tester de nombreuses configurations d'hyperparamètres

**Comment le GPU résout ces problèmes** :

| Problème | Solution apportée par le GPU |
| -------- | ---------------------------- |
| Entraînement trop lent | Le GPU a des milliers de coeurs qui calculent en parallèle (10x à 100x plus rapide) |
| Opérations matricielles séquentielles | Les coeurs CUDA effectuent des milliers de multiplications simultanément |
| Itérations limitées | Le gain de temps permet plus d'expériences dans le même délai |

**Analogie concrète** : Le CPU est un mathématicien expert qui résout des problèmes complexes un par un, très vite. Le GPU est une classe de 5000 élèves de primaire : chacun ne sait faire qu'une addition, mais ils peuvent tous calculer en même temps. Pour additionner 5000 paires de nombres, le GPU est beaucoup plus rapide.

**Ce que le GPU n'est PAS** :

- Le GPU n'est pas toujours plus rapide que le CPU. Pour des tâches séquentielles (une opération après l'autre), le CPU est plus rapide. Le GPU excelle uniquement quand des milliers d'opérations identiques doivent être faites en parallèle.
- Le GPU n'est pas obligatoire pour débuter en ML. Les algorithmes classiques (régression, arbres de décision) fonctionnent bien sur CPU. Le GPU devient nécessaire pour le deep learning.

**Comparaison CPU vs GPU** :

| CPU | GPU |
| --- | --- |
| 4-16 coeurs puissants | 2000-16000 coeurs simples |
| Optimisé pour les tâches séquentielles | Optimisé pour le calcul parallèle |
| Mémoire système (RAM) : 16-128 Go | Mémoire dédiée (VRAM) : 8-80 Go |
| Utilisé pour tout | Utilisé pour le calcul matriciel massif |

#### La pile logicielle CUDA

Pour utiliser le GPU en ML, trois couches logicielles sont nécessaires :

| Couche | Rôle | Exemple |
| ------ | ---- | ------- |
| Driver NVIDIA | Permet au système de communiquer avec le GPU | `nvidia-driver-535` |
| CUDA Toolkit | Fournit les outils de compilation et d'exécution GPU | CUDA 12.2 |
| cuDNN | Bibliothèque de réseaux de neurones optimisée pour CUDA | cuDNN 8.9 |

Les frameworks ML (PyTorch, TensorFlow) utilisent cette pile pour déléguer les calculs au GPU de manière transparente.

---

### Qu'est-ce que Docker pour le ML ?

**Définition** : Docker pour le ML est l'utilisation de conteneurs Docker pour encapsuler un environnement ML complet (système d'exploitation, Python, bibliothèques, drivers GPU) dans une image reproductible et portable.

**Le problème que Docker pour le ML résout** :

Sans Docker, voici les problèmes rencontrés :

1. **"Ca marche sur ma machine"** : les versions de CUDA, cuDNN, Python et des bibliothèques doivent correspondre exactement. Une différence mineure cause des erreurs incompréhensibles
2. **Installation complexe** : installer CUDA + cuDNN + PyTorch avec les bonnes versions compatibles prend des heures
3. **Pas de reproductibilité** : six mois plus tard, les mêmes commandes pip install installent des versions différentes

**Comment Docker pour le ML résout ces problèmes** :

| Problème | Solution apportée par Docker |
| -------- | ---------------------------- |
| "Ca marche sur ma machine" | Le conteneur embarque exactement le même environnement partout |
| Installation complexe | Une seule commande `docker pull` télécharge tout l'environnement préconfiguré |
| Pas de reproductibilité | L'image Docker est figée : les mêmes versions sont utilisées indéfiniment |

**Analogie concrète** : Imagine que tu dois monter un meuble IKEA. Sans Docker, tu reçois uniquement la notice et tu dois acheter toi-même les outils (tournevis, clé Allen, marteau) en espérant avoir les bons modèles. Avec Docker, tu reçois une boite qui contient le meuble ET tous les outils nécessaires, garantis compatibles.

**Ce que Docker pour le ML n'est PAS** :

- Docker n'est pas une machine virtuelle. Docker partage le noyau du système hôte et est beaucoup plus léger.
- Docker ne remplace pas venv. Docker isole tout le système. Venv isole uniquement les packages Python. On utilise souvent venv DANS un conteneur Docker.

---

## Étapes Pratiques

### Étape 1 : Créer et gérer un environnement virtuel

```bash
# Se placer dans le dossier du projet
mkdir -p ~/projets/mon-projet-ml
cd ~/projets/mon-projet-ml

# Créer un environnement virtuel nommé "venv"
python3 -m venv venv

# Activer l'environnement virtuel
# Le prompt change pour afficher (venv) au début
source venv/bin/activate
```

**Résultat attendu** :

```text
(venv) utilisateur@machine:~/projets/mon-projet-ml$
```

```bash
# Vérifier que Python pointe vers l'environnement virtuel
which python3

# Mettre à jour pip dans l'environnement virtuel
pip install --upgrade pip

# Installer les packages ML de base
pip install numpy pandas matplotlib scikit-learn jupyter

# Vérifier les packages installés
pip list
```

**Résultat attendu** :

```text
/home/utilisateur/projets/mon-projet-ml/venv/bin/python3
```

```bash
# Figer les versions dans requirements.txt
pip freeze > requirements.txt

# Voir le contenu
cat requirements.txt
```

**Résultat attendu** (numéros de version indicatifs ; `pip install` en 2026 peut poser NumPy 2.x et Pandas 3.x) :

```text
matplotlib==3.x
numpy==2.x
pandas==2.x ou 3.x
scikit-learn==1.x
jupyter==1.x
...
```

```bash
# Pour reproduire l'environnement sur une autre machine :
# 1. Créer un venv vierge
# 2. Activer le venv
# 3. Installer depuis requirements.txt
pip install -r requirements.txt

# Pour désactiver l'environnement virtuel
deactivate
```

---

### Étape 2 : Installer et utiliser Jupyter Notebook

```bash
# Activer l'environnement virtuel
source venv/bin/activate

# Installer JupyterLab (inclut Jupyter Notebook)
pip install jupyterlab

# Lancer JupyterLab
jupyter lab --no-browser --port=8888
```

**Résultat attendu** :

```text
[I 2025-01-15 10:30:00 ServerApp] Jupyter Server 2.12.5 is running at:
[I 2025-01-15 10:30:00 ServerApp] http://localhost:8888/lab?token=abc123def456
```

Ouvre l'URL affichée dans ton navigateur. Tu arrives sur l'interface JupyterLab.

#### Commandes Jupyter essentielles (magic commands)

Crée un nouveau notebook et teste ces commandes dans des cellules :

```python
# Magic command : mesurer le temps d'exécution d'une cellule
%%timeit
import numpy as np
a = np.random.rand(1000, 1000)
b = a @ a  # Multiplication matricielle
```

**Résultat attendu** :

```text
3.21 ms +/- 156 us per loop (mean +/- std. dev. of 7 runs, 100 loops each)
```

```python
# Magic command : afficher les variables en mémoire
%who
```

```python
# Magic command : exécuter une commande shell depuis Jupyter
!pip list | head -5
```

```python
# Magic command : écrire le contenu d'une cellule dans un fichier
%%writefile mon_script.py
import numpy as np
print("Hello ML!")
print(f"NumPy version : {np.__version__}")
```

#### Bonnes pratiques Jupyter

| Pratique | Pourquoi |
| -------- | -------- |
| Redémarrer le kernel et tout exécuter avant de partager | Vérifie que les cellules fonctionnent dans l'ordre |
| Pas plus de 10-15 lignes par cellule | Facilite le débogage et la lisibilité |
| Cellules Markdown entre les sections de code | Documente le raisonnement |
| Nommer les notebooks clairement | `01-exploration-donnees.ipynb`, pas `Untitled.ipynb` |

---

### Étape 3 : Configurer Git pour un projet ML

```bash
# Initialiser un dépôt Git
cd ~/projets/mon-projet-ml
git init
```

Crée un fichier `.gitignore` adapté au ML :

```bash
# Créer le .gitignore pour un projet ML
cat > .gitignore << 'EOF'
# Environnement virtuel Python
venv/
env/
.venv/

# Données (trop volumineuses pour Git)
data/raw/
data/processed/
*.csv
*.parquet
*.h5
*.hdf5

# Modèles entraînés (trop volumineux pour Git)
models/
*.pkl
*.joblib
*.pt
*.pth
*.onnx
*.h5

# Jupyter Notebook checkpoints
.ipynb_checkpoints/

# Cache Python
__pycache__/
*.pyc
*.pyo

# IDE
.vscode/
.idea/

# Logs d'entraînement
logs/
runs/
wandb/
mlruns/

# Fichiers système
.DS_Store
Thumbs.db
EOF
```

Crée la structure de dossiers standard d'un projet ML :

```bash
# Créer la structure de dossiers
mkdir -p data/raw data/processed
mkdir -p models
mkdir -p notebooks
mkdir -p src
mkdir -p logs

# Visualiser la structure
find . -type d -not -path './venv/*' -not -path './.git/*' | sort
```

**Résultat attendu** :

```text
.
./data
./data/processed
./data/raw
./logs
./models
./notebooks
./src
```

```bash
# Premier commit
git add .gitignore requirements.txt
git commit -m "Initialiser le projet ML avec .gitignore et requirements.txt"
```

#### Structure de dossiers recommandée

```text
mon-projet-ml/
├── data/
│   ├── raw/              # Données brutes (jamais modifiées)
│   └── processed/        # Données nettoyées et transformées
├── models/               # Modèles entraînés sauvegardés
├── notebooks/            # Jupyter notebooks d'exploration
├── src/                  # Code source Python
│   ├── __init__.py
│   ├── data.py           # Chargement et préparation des données
│   ├── model.py          # Définition du modèle
│   └── train.py          # Script d'entraînement
├── logs/                 # Logs d'entraînement et métriques
├── .gitignore
├── requirements.txt
└── README.md
```

---

### Étape 4 : Vérifier la présence d'un GPU

```python
# Vérification GPU avec Python
import subprocess
import shutil

# Vérifier si nvidia-smi est disponible
if shutil.which("nvidia-smi"):
    # Exécuter nvidia-smi pour voir les informations GPU
    resultat = subprocess.run(["nvidia-smi"], capture_output=True, text=True)
    print(resultat.stdout)
else:
    print("nvidia-smi non trouvé.")
    print("Soit aucun GPU NVIDIA n'est installé,")
    print("soit les drivers NVIDIA ne sont pas installés.")
```

**Résultat attendu (avec GPU)** :

```text
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.129.03   Driver Version: 535.129.03   CUDA Version: 12.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce RTX 3080  |   00000000:01:00.0  On |                  N/A |
| 30%   45C    P8    25W / 320W |    512MiB / 10240MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+
```

**Résultat attendu (sans GPU)** :

```text
nvidia-smi non trouvé.
Soit aucun GPU NVIDIA n'est installé,
soit les drivers NVIDIA ne sont pas installés.
```

```python
# Vérifier la disponibilité de CUDA via PyTorch (si installé)
try:
    import torch
    print(f"PyTorch version : {torch.__version__}")
    print(f"CUDA disponible : {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"GPU détecté : {torch.cuda.get_device_name(0)}")
        print(f"VRAM totale : {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} Go")
except ImportError:
    print("PyTorch n'est pas installé.")
    print("Installe-le avec : pip install torch")
```

---

### Étape 5 : Créer un Dockerfile pour le ML

Crée un fichier `Dockerfile` à la racine du projet :

```dockerfile
# Image de base avec Python 3.11
FROM python:3.11-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier de dépendances en premier
# Docker met en cache cette couche : si requirements.txt ne change pas,
# les packages ne sont pas réinstallés
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY src/ ./src/
COPY notebooks/ ./notebooks/

# Exposer le port Jupyter
EXPOSE 8888

# Commande par défaut : lancer JupyterLab
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]
```

Pour les projets nécessitant un GPU, utilise une image NVIDIA :

```dockerfile
# Image de base avec CUDA et Python
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

# Installer Python et pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY notebooks/ ./notebooks/

EXPOSE 8888

CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]
```

```bash
# Construire l'image Docker (sans GPU)
docker build -t mon-projet-ml .

# Lancer le conteneur
docker run -p 8888:8888 -v $(pwd)/data:/app/data mon-projet-ml

# Lancer avec support GPU (nécessite nvidia-docker)
docker run --gpus all -p 8888:8888 -v $(pwd)/data:/app/data mon-projet-ml
```

---

### Étape 6 : Créer un fichier `docker-compose.yml` pour le ML

```yaml
services:
  jupyter:
    build: .
    ports:
      - "8888:8888"
    volumes:
      # Monter les données locales dans le conteneur
      - ./data:/app/data
      # Monter les notebooks pour les éditer en direct
      - ./notebooks:/app/notebooks
      # Monter le code source pour le développement
      - ./src:/app/src
    environment:
      - JUPYTER_TOKEN=mon-token-secret
    # Décommenter pour le support GPU
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]
```

```bash
# Démarrer l'environnement
docker compose up -d

# Voir les logs (pour récupérer l'URL Jupyter)
docker compose logs jupyter

# Arrêter l'environnement
docker compose down
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `python3 -m venv venv` | Créer un environnement virtuel |
| `source venv/bin/activate` | Activer l'environnement virtuel |
| `deactivate` | Désactiver l'environnement virtuel |
| `pip freeze > requirements.txt` | Figer les versions des packages |
| `pip install -r requirements.txt` | Installer les packages depuis le fichier |
| `jupyter lab` | Lancer JupyterLab |
| `jupyter notebook` | Lancer Jupyter Notebook classique |
| `nvidia-smi` | Afficher les informations du GPU NVIDIA |
| `docker build -t nom .` | Construire une image Docker |
| `docker run --gpus all nom` | Lancer un conteneur avec GPU |
| `docker compose up -d` | Démarrer les services Docker Compose |
| `git init` | Initialiser un dépôt Git |
| `git add .gitignore` | Ajouter le .gitignore au suivi |
| `pip install dvc` | Installer DVC pour le versioning de données |

---

## Pièges Fréquents

### Piège 1 : Oublier d'activer l'environnement virtuel

⚠️ **Problème** : Tu installes des packages avec `pip install` mais ils ne sont pas disponibles dans ton projet. Ou pire, tu installes des packages dans le Python système.

✅ **Solution** : Vérifie toujours que le prompt affiche `(venv)` au début. Si ce n'est pas le cas, active l'environnement avec `source venv/bin/activate`. Vérifie avec `which python3` que le chemin pointe vers ton venv.

---

### Piège 2 : Commiter le dossier `venv/` ou les données dans Git

⚠️ **Problème** : Le dossier `venv/` contient des milliers de fichiers et peut peser plusieurs centaines de Mo. Les datasets peuvent peser des Go. Les commiter rend le dépôt énorme et lent.

✅ **Solution** : Crée toujours le `.gitignore` AVANT le premier commit. Vérifie avec `git status` que `venv/`, `data/` et `models/` n'apparaissent pas dans les fichiers à commiter.

---

### Piège 3 : Exécuter les cellules Jupyter dans le désordre

⚠️ **Problème** : Tu exécutes la cellule 5, puis la cellule 2, puis la cellule 7. Les variables ne sont pas dans l'état attendu et les résultats sont incohérents.

✅ **Solution** : Avant de partager un notebook ou de valider tes résultats, fais "Kernel > Restart & Run All". Cela exécute toutes les cellules dans l'ordre et garantit la cohérence.

---

### Piège 4 : Incompatibilité CUDA / PyTorch / TensorFlow

⚠️ **Problème** : Tu installes PyTorch avec `pip install torch` mais il ne détecte pas le GPU. `torch.cuda.is_available()` retourne `False`.

✅ **Solution** : PyTorch installé avec `pip install torch` n'inclut pas forcément le support CUDA. Utilise le sélecteur officiel sur `pytorch.org` pour obtenir la commande d'installation adaptée à ta version de CUDA. Exemple :

```bash
# Pour CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

---

### Piège 5 : Le fichier `requirements.txt` contient trop de packages

⚠️ **Problème** : `pip freeze` liste toutes les dépendances, y compris les sous-dépendances. Le fichier contient 200 lignes alors que tu n'as installé que 5 packages.

✅ **Solution** : Crée un fichier `requirements.txt` manuel avec uniquement tes dépendances directes. Utilise `pip freeze` uniquement pour figer les versions exactes dans un fichier séparé `requirements-lock.txt`.

```text
# requirements.txt (dépendances directes)
numpy>=1.26,<2.0
pandas>=2.2,<3.0
matplotlib>=3.8,<4.0
scikit-learn>=1.4,<2.0
jupyterlab>=4.0,<5.0
```

---

## Checklist de Validation

- [ ] Je sais créer et activer un environnement virtuel Python avec `venv`
- [ ] Je sais figer les dépendances dans un fichier `requirements.txt`
- [ ] Je sais lancer Jupyter Notebook/Lab et exécuter des cellules
- [ ] Je connais les magic commands `%%timeit`, `%who` et `!commande`
- [ ] Je sais configurer un `.gitignore` adapté au ML
- [ ] Je connais la structure de dossiers recommandée pour un projet ML
- [ ] Je sais vérifier la présence d'un GPU avec `nvidia-smi` et PyTorch
- [ ] Je comprends les trois couches de la pile CUDA (driver, toolkit, cuDNN)
- [ ] Je sais créer un Dockerfile pour un projet ML
- [ ] Je sais utiliser Docker Compose pour lancer un environnement ML

---

## Exercice Pratique

**Énoncé** : Configure un projet ML complet depuis zéro avec la structure standard, un environnement virtuel, un `.gitignore` adapté, un `requirements.txt` et un premier notebook d'exploration.

**Indications** :

- Crée un dossier `projet-ml-exercice/`
- Crée un environnement virtuel et installe NumPy, Pandas, Matplotlib, scikit-learn, JupyterLab
- Crée la structure de dossiers standard (data/raw, data/processed, models, notebooks, src, logs)
- Crée un `.gitignore` complet pour le ML
- Fige les dépendances dans `requirements.txt`
- Initialise un dépôt Git et fais un premier commit
- Crée un notebook `notebooks/01-exploration.ipynb` qui :
  - Importe NumPy, Pandas, Matplotlib
  - Affiche les versions installées
  - Crée un petit DataFrame d'exemple et affiche un graphique

**Résultat attendu** : Un dossier de projet avec la structure complète, un dépôt Git initialisé, et un notebook fonctionnel.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
#!/bin/bash
# Script de setup complet d'un projet ML

# Créer le dossier du projet
mkdir -p ~/projets/projet-ml-exercice
cd ~/projets/projet-ml-exercice

# Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les packages
pip install --upgrade pip
pip install numpy pandas matplotlib scikit-learn jupyterlab

# Créer la structure de dossiers
mkdir -p data/raw data/processed
mkdir -p models
mkdir -p notebooks
mkdir -p src
mkdir -p logs

# Créer le fichier __init__.py pour le package src
touch src/__init__.py

# Créer le .gitignore
cat > .gitignore << 'GITIGNORE'
# Environnement virtuel
venv/
env/
.venv/

# Données volumineuses
data/raw/
data/processed/
*.csv
*.parquet
*.h5

# Modèles entraînés
models/
*.pkl
*.joblib
*.pt
*.pth

# Jupyter
.ipynb_checkpoints/

# Python
__pycache__/
*.pyc

# IDE
.vscode/
.idea/

# Logs
logs/
runs/
wandb/

# Système
.DS_Store
GITIGNORE

# Figer les dépendances
pip freeze > requirements.txt

# Initialiser Git
git init
git add .gitignore requirements.txt src/__init__.py
git commit -m "Initialiser le projet ML avec structure et dépendances"

echo "Projet ML initialisé avec succès !"
echo "Structure :"
find . -type d -not -path './venv/*' -not -path './.git/*' | sort
```

Crée ensuite le notebook d'exploration. Ouvre Jupyter et crée `notebooks/01-exploration.ipynb` avec ces cellules :

```python
# Cellule 1 : Imports et versions
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sklearn

print(f"NumPy     : {np.__version__}")
print(f"Pandas    : {pd.__version__}")
print(f"Matplotlib: {plt.matplotlib.__version__}")
print(f"Scikit-learn: {sklearn.__version__}")
```

```python
# Cellule 2 : Créer un DataFrame d'exemple
np.random.seed(42)
n = 30

df = pd.DataFrame({
    "experience_annees": np.random.uniform(0, 15, n).round(1),
    "salaire_annuel": np.random.normal(45000, 12000, n).round(0)
})

# Ajouter une relation réaliste : salaire corrélé à l'expérience
df["salaire_annuel"] = (30000 + df["experience_annees"] * 2500
                         + np.random.normal(0, 5000, n)).round(0)

print("Aperçu des données :")
print(df.head(10))
print(f"\nStatistiques :")
print(df.describe().round(1))
```

```python
# Cellule 3 : Visualisation
fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(df["experience_annees"], df["salaire_annuel"],
           alpha=0.6, color="teal", edgecolors="black", linewidth=0.5)
ax.set_xlabel("Expérience (années)")
ax.set_ylabel("Salaire annuel (euros)")
ax.set_title("Relation expérience-salaire")
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("../logs/exploration-scatter.png", dpi=150)
plt.show()
print("Graphique sauvegardé dans logs/exploration-scatter.png")
```

---

## Navigation

← Fiche précédente : **[01 - Python pour l'IA](01-python-pour-ia.md)**

→ Fiche suivante : **[03 - Manipulation et ingénierie des données](03-manipulation-ingenierie-donnees.md)**
