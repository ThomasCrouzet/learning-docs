---
tags:
  - IA
  - Expert
  - Concept
  - Pratique
description: "Computer vision avancée : détection d'objets YOLO, segmentation SAM, vision 3D, analyse vidéo et Edge AI"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 8 - Spécialisations avancées"
id: "ai.artificial-intelligence.advanced.computer-vision-avancee"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.advanced"
content_type: "lesson"
order: 1
---

# 01 - Computer vision avancée

> **En bref** : À la fin de cette fiche, tu sauras utiliser YOLO pour la détection d'objets, appliquer SAM pour la segmentation d'images, comprendre les techniques de vision 3D (NeRF, Gaussian Splatting), analyser des vidéos (tracking, optical flow) et déployer des modèles sur des appareils embarqués avec les techniques d'Edge AI. Lecture estimée : 40 min.


## Prérequis

- [Phase 4 - Deep learning fondamental](../04-deep-learning-fondamental/index.md) (CNN, architectures convolutives)
- [Phase 5 - Architectures modernes](../05-architectures-modernes-nlp/index.md) (Vision Transformer - ViT)
- Python 3 installé sur ta machine
- PyTorch installé (`pip install torch torchvision`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser YOLO pour la détection d'objets, appliquer SAM pour la segmentation d'images, comprendre les techniques de vision 3D (NeRF, Gaussian Splatting), analyser des vidéos (tracking, optical flow) et déployer des modèles sur des appareils embarqués avec les techniques d'Edge AI.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la détection d'objets ?

**Définition** : La détection d'objets est une tâche de vision par ordinateur qui consiste à localiser et identifier chaque objet présent dans une image. Pour chaque objet détecté, le modèle produit une bounding box (rectangle englobant), une classe (type d'objet) et un score de confiance.

**Le problème que la détection d'objets résout** :

Sans détection d'objets, voici les problèmes rencontrés :

1. **Pas de localisation** : un classificateur classique dit "il y a un chat dans l'image" mais ne dit pas où il se trouve
2. **Pas de comptage** : impossible de savoir combien d'objets d'un type donné sont présents
3. **Pas d'interaction spatiale** : impossible de déterminer les relations entre objets (une voiture à côté d'un piéton)

**Comment la détection d'objets résout ces problèmes** :

| Problème | Solution apportée par la détection d'objets |
| -------- | -------------------------------------------- |
| Pas de localisation | Chaque objet est entouré d'une bounding box avec coordonnées (x, y, largeur, hauteur) |
| Pas de comptage | Le modèle retourne une liste de toutes les détections avec leurs classes |
| Pas d'interaction spatiale | Les positions relatives des bounding boxes permettent d'analyser les relations spatiales |

**Analogie concrète** : Imagine que tu regardes une photo de groupe. La classification dit "il y a des personnes sur cette photo". La détection d'objets, c'est dessiner un rectangle autour de chaque personne et écrire son nom en dessous. Tu sais exactement qui est où.

**Ce que la détection d'objets n'est PAS** :

- La détection d'objets n'est pas la segmentation. La détection donne un rectangle grossier autour de l'objet. La segmentation donne le contour exact, pixel par pixel.
- La détection d'objets n'est pas la classification. La classification attribue une seule étiquette à toute l'image. La détection identifie et localise plusieurs objets.

#### IoU - Intersection over Union

L'IoU est la métrique standard pour évaluer la qualité d'une détection. Elle mesure le chevauchement entre la bounding box prédite et la bounding box réelle (ground truth).

```text
IoU = Aire de l'intersection / Aire de l'union

IoU = 1.0  ->  les deux boîtes sont parfaitement superposées
IoU = 0.0  ->  les deux boîtes ne se chevauchent pas du tout
IoU > 0.5  ->  seuil habituel pour considérer une détection comme correcte
```

#### YOLO - You Only Look Once

YOLO est une famille de modèles de détection d'objets en temps réel. Contrairement aux approches en deux étapes (comme Faster R-CNN qui propose d'abord des régions puis les classifie), YOLO traite l'image entière en une seule passe.

**Principe de fonctionnement** :

1. L'image est divisée en une grille de cellules
2. Chaque cellule prédit plusieurs bounding boxes avec leurs scores de confiance
3. Le NMS (Non-Maximum Suppression) élimine les détections redondantes
4. Le résultat final est une liste de bounding boxes, classes et scores

**Évolution de YOLO** :

| Version | Année | Amélioration principale |
| ------- | ----- | ----------------------- |
| YOLOv1 | 2016 | Première détection en une seule passe |
| YOLOv3 | 2018 | Détection multi-échelle, Darknet-53 |
| YOLOv5 | 2020 | Implémentation PyTorch, facilité d'utilisation |
| YOLOv8 | 2023 | Architecture anchor-free, meilleure précision |
| YOLOv11 | 2024 | Efficacité accrue, nouvelles têtes de détection |
| YOLOv12 | 2025 | Architecture attention-centric (mécanismes d'attention intégrés au coeur du réseau) |

> **Note** : Cette liste reflète l'état de l'art à la date de rédaction. La famille YOLO évolue vite : de nouvelles versions paraissent presque chaque année, et leurs gains de précision réels dépendent du jeu de données et du matériel.

Jusqu'à YOLOv11, la famille reposait essentiellement sur des convolutions (héritées des CNN). YOLOv12 marque un changement : il place des mécanismes d'**attention** (les mêmes que ceux des Vision Transformers vus en Phase 5) au coeur du réseau, d'où le qualificatif "attention-centric". L'objectif est de mieux capter les relations entre zones éloignées de l'image tout en restant assez rapide pour la détection en temps réel.

#### Détection anchor-free

Les versions récentes de YOLO (v8+) utilisent une approche anchor-free. Au lieu de prédéfinir des formes de référence (anchors) pour les bounding boxes, le modèle prédit directement les distances entre le centre de l'objet et les bords de la boîte. Cela simplifie l'architecture et élimine le besoin de régler manuellement les anchors.

---

### Qu'est-ce que la segmentation ?

**Définition** : La segmentation est une tâche de vision par ordinateur qui consiste à attribuer une étiquette à chaque pixel d'une image, produisant ainsi un masque qui délimite les contours exacts des objets.

**Le problème que la segmentation résout** :

Sans segmentation, voici les problèmes rencontrés :

1. **Contours imprécis** : les bounding boxes incluent beaucoup d'arrière-plan autour de l'objet
2. **Pas de forme exacte** : impossible de connaître la silhouette précise d'un objet
3. **Pas de séparation fine** : deux objets proches sont difficiles à distinguer avec des rectangles

**Comment la segmentation résout ces problèmes** :

| Problème | Solution apportée par la segmentation |
| -------- | ------------------------------------- |
| Contours imprécis | Chaque pixel est classifié : on obtient le contour exact de l'objet |
| Pas de forme exacte | Le masque de segmentation épouse parfaitement la silhouette |
| Pas de séparation fine | Chaque instance reçoit un masque distinct |

**Analogie concrète** : Si la détection d'objets consiste à entourer des mots au surligneur dans un texte (rectangles grossiers), la segmentation consiste à découper chaque mot avec des ciseaux en suivant précisément le contour de chaque lettre.

**Types de segmentation** :

| Type | Ce qu'il fait | Exemple |
| ---- | ------------- | ------- |
| Sémantique | Classe chaque pixel (chat, chien, fond) sans distinguer les instances | Tous les pixels "chat" ont la même couleur |
| D'instance | Distingue chaque objet individuel | Chat 1 = bleu, Chat 2 = rouge |
| Panoptique | Combine sémantique + instance : classifie chaque pixel ET distingue les instances | Chat 1 = bleu, Chat 2 = rouge, fond = gris |

#### SAM - Segment Anything Model

SAM est un modèle de fondation pour la segmentation développé par Meta AI (2023). Il peut segmenter n'importe quel objet dans n'importe quelle image, même des types d'objets jamais vus pendant l'entraînement.

**Principe** :

1. Un encodeur d'image (ViT) produit des embeddings de l'image
2. Un prompt (point, boîte, texte) indique l'objet à segmenter
3. Un décodeur de masque léger produit le masque de segmentation

**Ce que SAM n'est PAS** :

- SAM n'est pas un classificateur. Il segmente l'objet pointé mais ne dit pas ce que c'est.
- SAM n'est pas limité à des catégories prédéfinies. Il fonctionne en zéro-shot sur n'importe quel objet.

---

### Qu'est-ce que la vision 3D ?

**Définition** : La vision 3D regroupe les techniques qui permettent de reconstruire ou de comprendre la structure tridimensionnelle d'une scène à partir d'images 2D.

**Le problème que la vision 3D résout** :

Sans vision 3D, voici les problèmes rencontrés :

1. **Perte de profondeur** : une photo 2D ne contient pas d'information de distance
2. **Pas de reconstruction** : impossible de créer un modèle 3D d'un objet à partir de photos
3. **Pas de nouveaux points de vue** : impossible de voir une scène sous un angle non photographié

**Comment la vision 3D résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Perte de profondeur | Le depth estimation prédit la distance de chaque pixel à la caméra |
| Pas de reconstruction | NeRF et Gaussian Splatting reconstruisent la scène en 3D |
| Pas de nouveaux points de vue | La novel view synthesis génère des images depuis n'importe quel angle |

**Analogie concrète** : Imagine que tu visites un appartement et que tu prends 50 photos depuis différents angles. La vision 3D, c'est un logiciel qui assemble toutes ces photos pour créer une visite virtuelle en 3D, où tu peux te déplacer librement, même dans des positions où tu n'as pas pris de photo.

#### NeRF - Neural Radiance Fields

NeRF représente une scène 3D comme un champ de radiance continu, modélisé par un réseau de neurones. Pour chaque point 3D et direction de vue, le réseau prédit la couleur et la densité. En accumulant ces prédictions le long de rayons, NeRF produit des images photoréalistes depuis n'importe quel angle.

#### Gaussian Splatting

Le 3D Gaussian Splatting (2023) est une alternative à NeRF qui représente la scène comme un ensemble de gaussiennes 3D. Chaque gaussienne a une position, une forme (covariance), une couleur et une opacité. Le rendu est plus rapide que NeRF car il ne nécessite pas de passer par un réseau de neurones à l'inférence.

**Comparaison NeRF vs Gaussian Splatting** :

| NeRF | Gaussian Splatting |
| ---- | ------------------ |
| Représentation implicite (réseau de neurones) | Représentation explicite (ensemble de gaussiennes) |
| Rendu lent (sampling le long de rayons) | Rendu rapide (rasterisation différentiable) |
| Qualité élevée | Qualité comparable, parfois supérieure |
| Entraînement lent (heures) | Entraînement rapide (minutes) |

#### Depth estimation

Le depth estimation (estimation de profondeur) prédit une carte de profondeur à partir d'une seule image (monoculaire) ou de deux images (stéréo). Les modèles récents comme DPT (Dense Prediction Transformer) et Depth Anything utilisent des transformers pour produire des cartes de profondeur précises.

---

### Qu'est-ce que l'analyse vidéo ?

**Définition** : L'analyse vidéo applique les techniques de vision par ordinateur aux séquences d'images (frames) pour comprendre le mouvement, suivre des objets et interpréter des actions dans le temps.

**Le problème que l'analyse vidéo résout** :

Sans analyse vidéo, voici les problèmes rencontrés :

1. **Pas de suivi** : un objet détecté dans une frame n'est pas relié à sa détection dans la frame suivante
2. **Pas de compréhension du mouvement** : impossible de savoir dans quelle direction les objets se déplacent
3. **Pas de reconnaissance d'actions** : impossible de distinguer "marcher" de "courir" sans analyser la séquence temporelle

**Comment l'analyse vidéo résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de suivi | Le tracking associe les détections frame par frame avec un identifiant unique |
| Pas de compréhension du mouvement | L'optical flow calcule le déplacement de chaque pixel entre deux frames |
| Pas de reconnaissance d'actions | Le video understanding analyse des séquences de frames pour classifier des actions |

**Techniques principales** :

- **Tracking multi-objets (MOT)** : associe les détections entre frames en utilisant des algorithmes comme SORT, DeepSORT ou ByteTrack
- **Optical flow** : calcule un vecteur de déplacement pour chaque pixel entre deux frames consécutives (RAFT, FlowNet)
- **Video understanding** : modèles qui analysent des clips vidéo pour comprendre les actions (Video Swin Transformer, TimeSformer)

---

### Qu'est-ce que l'Edge AI ?

**Définition** : L'Edge AI désigne l'exécution de modèles d'intelligence artificielle directement sur des appareils embarqués (smartphones, caméras, microcontrôleurs) au lieu de serveurs distants.

**Le problème que l'Edge AI résout** :

Sans Edge AI, voici les problèmes rencontrés :

1. **Latence réseau** : envoyer une image à un serveur et attendre la réponse prend du temps
2. **Dépendance à internet** : sans connexion, le modèle est inutilisable
3. **Coût cloud** : traiter des millions d'images sur des serveurs GPU coûte cher
4. **Vie privée** : les données sensibles (visages, documents) quittent l'appareil

**Comment l'Edge AI résout ces problèmes** :

| Problème | Solution apportée par l'Edge AI |
| -------- | ------------------------------- |
| Latence réseau | Inférence locale en millisecondes |
| Dépendance à internet | Fonctionne hors ligne |
| Coût cloud | Pas de serveur à payer |
| Vie privée | Les données restent sur l'appareil |

**Analogie concrète** : L'inférence sur serveur, c'est envoyer une lettre par la poste et attendre la réponse. L'Edge AI, c'est avoir un assistant directement à côté de toi qui répond instantanément, sans envoyer la lettre nulle part.

**Ce que l'Edge AI n'est PAS** :

- L'Edge AI n'est pas du cloud computing. Le cloud traite les données sur des serveurs distants. L'Edge AI traite les données localement.
- L'Edge AI n'est pas nécessairement moins précise. Avec les bonnes techniques d'optimisation, la perte de précision est souvent négligeable.

**Techniques d'optimisation pour l'Edge AI** :

| Technique | Description | Gain typique |
| --------- | ----------- | ------------ |
| Quantization | Convertir les poids de float32 vers int8 | Modèle 4x plus petit, 2-3x plus rapide |
| Pruning | Supprimer les connexions (poids) les moins importantes | 50-90% des poids supprimés |
| Knowledge distillation | Entraîner un petit modèle à imiter un grand modèle | Modèle 10x plus petit |
| ONNX | Format standard d'export pour exécuter sur différents matériels | Compatible CPU, GPU, NPU |

---

## Étapes Pratiques

### Étape 1 : Détection d'objets avec YOLOv8

Installe la bibliothèque Ultralytics qui fournit YOLOv8.

```bash
# Installer ultralytics (inclut YOLOv8)
pip install ultralytics
```

Crée un fichier `detection_yolo.py` :

```python
from ultralytics import YOLO

# Charger le modèle YOLOv8 pré-entraîné (nano = le plus léger)
# Le modèle est téléchargé automatiquement la première fois
model = YOLO("yolov8n.pt")

# Lancer la détection sur une image
# results est une liste (une entrée par image)
results = model("image.jpg")

# Parcourir les détections de la première image
for result in results:
    # result.boxes contient toutes les bounding boxes détectées
    for box in result.boxes:
        # Coordonnées de la bounding box [x1, y1, x2, y2]
        coords = box.xyxy[0].tolist()
        # Score de confiance (entre 0 et 1)
        confidence = box.conf[0].item()
        # Identifiant de la classe détectée
        class_id = int(box.cls[0].item())
        # Nom de la classe (ex : "person", "car", "dog")
        class_name = model.names[class_id]

        print(f"{class_name}: {confidence:.2f} at {coords}")

# Sauvegarder l'image avec les détections dessinées
result.save("result_detection.jpg")
```

**Résultat attendu** :

```text
person: 0.92 at [120.5, 45.2, 340.8, 510.3]
car: 0.87 at [400.1, 200.5, 650.3, 380.7]
dog: 0.76 at [50.0, 300.2, 180.4, 450.6]
```

---

### Étape 2 : Entraîner YOLOv8 sur des données custom

Pour entraîner YOLO sur tes propres images, tu dois préparer un dataset au format YOLO.

```python
from ultralytics import YOLO

# Charger un modèle pré-entraîné comme point de départ
model = YOLO("yolov8n.pt")

# Entraîner sur un dataset custom
# Le fichier data.yaml décrit le dataset (chemins, classes)
results = model.train(
    data="data.yaml",   # Fichier de configuration du dataset
    epochs=50,          # Nombre d'époques d'entraînement
    imgsz=640,          # Taille des images (redimensionnées à 640x640)
    batch=16,           # Nombre d'images par batch
    name="mon_modele"   # Nom du dossier de résultats
)

# Évaluer le modèle sur le jeu de validation
metrics = model.val()
print(f"mAP50: {metrics.box.map50:.4f}")
print(f"mAP50-95: {metrics.box.map:.4f}")
```

**Structure du fichier `data.yaml`** :

```yaml
# Chemins vers les dossiers d'images et labels
train: ./dataset/train/images
val: ./dataset/val/images

# Nombre de classes
nc: 3

# Noms des classes
names: ["chat", "chien", "oiseau"]
```

**Format des labels YOLO** (un fichier `.txt` par image) :

```text
# classe  x_centre  y_centre  largeur  hauteur  (valeurs normalisées entre 0 et 1)
0 0.45 0.32 0.12 0.25
1 0.78 0.61 0.15 0.30
```

---

### Étape 3 : Segmentation avec SAM

```bash
# Installer segment-anything
pip install segment-anything
```

```python
import torch
import numpy as np
from segment_anything import sam_model_registry, SamPredictor
from PIL import Image

# Charger le modèle SAM (vit_b = version base, plus légère)
# Télécharge le checkpoint depuis le repo officiel de Meta
sam = sam_model_registry["vit_b"](checkpoint="sam_vit_b.pth")
# Placer le modèle sur GPU si disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
sam.to(device)

# Créer le prédicteur
predictor = SamPredictor(sam)

# Charger l'image et la passer au prédicteur
image = np.array(Image.open("image.jpg"))
predictor.set_image(image)

# Segmenter en donnant un point comme prompt
# Le point (x=500, y=375) indique l'objet à segmenter
# label=1 signifie "premier plan" (l'objet)
input_point = np.array([[500, 375]])
input_label = np.array([1])

# Prédire le masque
masks, scores, logits = predictor.predict(
    point_coords=input_point,
    point_labels=input_label,
    multimask_output=True  # Retourne 3 masques possibles
)

# masks.shape = (3, H, W) : 3 masques de la taille de l'image
# scores : score de qualité de chaque masque
print(f"Nombre de masques : {masks.shape[0]}")
for i, (mask, score) in enumerate(zip(masks, scores)):
    print(f"Masque {i}: score={score:.4f}, pixels={mask.sum()}")
```

**Résultat attendu** :

```text
Nombre de masques : 3
Masque 0: score=0.9812, pixels=45230
Masque 1: score=0.8534, pixels=78420
Masque 2: score=0.7201, pixels=123500
```

---

### Étape 4 : Sauvegarder et visualiser le masque

```python
import matplotlib.pyplot as plt

# Sélectionner le meilleur masque (score le plus élevé)
best_mask_idx = np.argmax(scores)
best_mask = masks[best_mask_idx]

# Visualiser l'image avec le masque superposé
fig, axes = plt.subplots(1, 2, figsize=(12, 6))

# Image originale
axes[0].imshow(image)
axes[0].set_title("Image originale")
axes[0].axis("off")

# Image avec masque superposé
axes[1].imshow(image)
# Le masque est affiché en bleu semi-transparent
axes[1].imshow(best_mask, alpha=0.5, cmap="Blues")
axes[1].set_title(f"Segmentation (score: {scores[best_mask_idx]:.4f})")
axes[1].axis("off")

plt.tight_layout()
plt.savefig("result_segmentation.png", dpi=150)
plt.show()
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install ultralytics` | Installe YOLOv8 |
| `pip install segment-anything` | Installe SAM |
| `pip install onnxruntime` | Installe le runtime ONNX pour l'Edge AI |
| `yolo detect predict model=yolov8n.pt source=image.jpg` | Détection YOLO en ligne de commande |
| `yolo detect train data=data.yaml model=yolov8n.pt epochs=50` | Entraînement YOLO en ligne de commande |
| `yolo export model=yolov8n.pt format=onnx` | Exporter un modèle YOLO au format ONNX |
| `model.predict(source=0)` | Détection en temps réel depuis la webcam |

---

## Pièges Fréquents

### Piège 1 : Confondre détection et segmentation

⚠️ **Problème** : Utiliser YOLO pour obtenir les contours exacts d'un objet. YOLO produit des rectangles (bounding boxes), pas des masques pixel par pixel.

✅ **Solution** : Pour des contours précis, utilise YOLOv8-seg (variante segmentation de YOLO) ou SAM. Pour de simples localisations, les bounding boxes de YOLO suffisent.

---

### Piège 2 : Oublier le NMS dans la détection

⚠️ **Problème** : Obtenir des dizaines de détections redondantes pour un même objet (bounding boxes qui se chevauchent).

✅ **Solution** : Le Non-Maximum Suppression (NMS) est intégré dans YOLO par défaut. Si tu implémentes ton propre détecteur, applique le NMS avec un seuil IoU (typiquement 0.5) pour ne garder que la meilleure détection par objet.

---

### Piège 3 : Quantifier sans calibrer

⚠️ **Problème** : Convertir un modèle en int8 sans calibration et obtenir une forte dégradation de précision.

✅ **Solution** : La quantification post-entraînement nécessite un petit jeu de données de calibration (quelques centaines d'images représentatives). Le processus de calibration détermine les plages de valeurs optimales pour la conversion float32 vers int8.

---

### Piège 4 : Utiliser les mauvaises coordonnées de bounding box

⚠️ **Problème** : Confondre les formats de coordonnées : (x_centre, y_centre, w, h) vs (x1, y1, x2, y2) vs coordonnées normalisées vs coordonnées en pixels.

✅ **Solution** : YOLO utilise des coordonnées normalisées (0-1) avec (x_centre, y_centre, w, h) dans les fichiers de labels. L'API Python retourne des coordonnées en pixels avec (x1, y1, x2, y2). Vérifie toujours le format attendu.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre détection et segmentation
- [ ] Je comprends ce qu'est l'IoU et comment il évalue une détection
- [ ] Je sais utiliser YOLOv8 pour détecter des objets dans une image
- [ ] Je sais préparer un dataset au format YOLO et lancer un entraînement
- [ ] Je connais les trois types de segmentation (sémantique, instance, panoptique)
- [ ] Je sais utiliser SAM pour segmenter un objet avec un prompt (point ou boîte)
- [ ] Je comprends la différence entre NeRF et Gaussian Splatting
- [ ] Je connais les techniques d'Edge AI (quantization, pruning, ONNX)

---

## Exercice Pratique

**Énoncé** : Crée un pipeline complet de détection d'objets avec YOLOv8 sur des images custom.

**Indications** :

- Télécharge ou crée un petit dataset de 20-30 images contenant 2-3 classes d'objets
- Annote les images au format YOLO (tu peux utiliser l'outil en ligne Roboflow ou CVAT)
- Crée le fichier `data.yaml` avec les chemins et noms de classes
- Entraîne YOLOv8n pendant 50 époques
- Évalue le modèle et affiche les métriques (mAP50, mAP50-95)
- Lance l'inférence sur 5 nouvelles images et sauvegarde les résultats

**Résultat attendu** : Un modèle YOLOv8 entraîné sur tes données, avec un mAP50 supérieur à 0.5 après 50 époques, et des images annotées avec les détections.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
from ultralytics import YOLO
import os

# --- Étape 1 : Préparer la structure du dataset ---
# Structure attendue :
# dataset/
#   train/
#     images/    (fichiers .jpg)
#     labels/    (fichiers .txt au format YOLO)
#   val/
#     images/
#     labels/

# --- Étape 2 : Créer le fichier data.yaml ---
data_yaml = """
train: ./dataset/train/images
val: ./dataset/val/images

nc: 3
names: ["chat", "chien", "oiseau"]
"""

# Écrire le fichier data.yaml
with open("data.yaml", "w") as f:
    f.write(data_yaml)

# --- Étape 3 : Entraîner le modèle ---
# Charger YOLOv8 nano pré-entraîné
model = YOLO("yolov8n.pt")

# Lancer l'entraînement
results = model.train(
    data="data.yaml",
    epochs=50,
    imgsz=640,
    batch=16,
    name="detection_custom",
    patience=10,       # Arrêt anticipé si pas d'amélioration pendant 10 époques
    save=True,         # Sauvegarder les checkpoints
    plots=True         # Générer les graphiques d'entraînement
)

# --- Étape 4 : Évaluer le modèle ---
metrics = model.val()
print(f"mAP50     : {metrics.box.map50:.4f}")
print(f"mAP50-95  : {metrics.box.map:.4f}")
print(f"Précision : {metrics.box.mp:.4f}")
print(f"Rappel    : {metrics.box.mr:.4f}")

# --- Étape 5 : Inférence sur de nouvelles images ---
# Charger le meilleur modèle sauvegardé
best_model = YOLO("runs/detect/detection_custom/weights/best.pt")

# Lancer l'inférence sur un dossier d'images de test
test_results = best_model.predict(
    source="dataset/test/images",
    save=True,           # Sauvegarder les images annotées
    conf=0.25,           # Seuil de confiance minimum
    iou=0.45,            # Seuil IoU pour le NMS
    name="test_results"
)

# Afficher les résultats pour chaque image
for result in test_results:
    print(f"\nImage : {os.path.basename(result.path)}")
    for box in result.boxes:
        class_name = best_model.names[int(box.cls[0].item())]
        confidence = box.conf[0].item()
        print(f"  {class_name}: {confidence:.2f}")
```

**Résultat** :

```text
mAP50     : 0.7234
mAP50-95  : 0.5123
Précision : 0.8012
Rappel    : 0.6845

Image : test_01.jpg
  chat: 0.89
  chien: 0.76

Image : test_02.jpg
  oiseau: 0.92
  chat: 0.61
```

---

## Navigation

→ Fiche suivante : **[02 - NLP avancé et traitement de la parole](02-nlp-avance-traitement-parole.md)**
