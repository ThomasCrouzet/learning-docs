---
tags:
  - IA
  - Avancé
  - Concept
description: "Vision Transformers et multimodal : ViT, CLIP, contrastive learning, modèles multimodaux et applications zéro-shot"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 5 - Architectures modernes et NLP"
---

# 03 - Vision Transformers et multimodal

> **En bref** : À la fin de cette fiche, tu sauras comprendre l'architecture Vision Transformer (ViT), le fonctionnement de CLIP et des modèles multimodaux, et réaliser une recherche image-texte avec un modèle pré-entraîné. Lecture estimée : 50 min.


## Prérequis

- Fiche **[01 - Transformers : architecture](01-transformers-architecture.md)** lue et comprise
- [Phase 4, fiche 03](../04-deep-learning-fondamental/03-reseaux-convolutifs-cnn.md) (CNN) lue et comprise
- Connaissances de base en PyTorch (tenseurs, forward pass)
- Python 3 avec `pip install torch torchvision transformers pillow`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comprendre l'architecture Vision Transformer (ViT), le fonctionnement de CLIP et des modèles multimodaux, et réaliser une recherche image-texte avec un modèle pré-entraîné.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Vision Transformer (ViT) ?

**Définition** : Un Vision Transformer (ViT) est un modèle qui applique l'architecture Transformer (initialement conçue pour le texte) au traitement d'images. L'image est découpée en patches (petits carrés), chaque patch est transformé en un vecteur (embedding), et ces vecteurs sont traités par un Transformer standard.

**Le problème que le ViT résout** :

Sans ViT, voici les problèmes rencontrés :

1. **Réceptive field limité des CNN** : un CNN traite l'image par petites zones locales (filtres 3x3, 5x5). Capturer des relations entre des zones éloignées de l'image nécessite d'empiler beaucoup de couches.
2. **Biais inductif rigide** : les CNN imposent un biais de localité (les pixels voisins sont plus importants) qui n'est pas toujours adapté.
3. **Difficulté de transfert texte-image** : les architectures CNN et Transformer étant différentes, il est difficile de partager des techniques entre les deux domaines.

**Comment le ViT résout ces problèmes** :

| Problème | Solution apportée par le ViT |
| -------- | ---------------------------- |
| Réceptive field limité | Le self-attention met en relation chaque patch avec tous les autres dès la première couche |
| Biais inductif rigide | Le ViT n'a pas de biais de localité intégré. Il apprend les relations spatiales à partir des données |
| Difficulté de transfert | Le ViT utilise la même architecture que les Transformers textuels, facilitant les modèles multimodaux |

**Analogie concrète** : Imagine que tu regardes un puzzle. Un CNN examine chaque pièce et ses voisines immédiates pour comprendre l'image. Un ViT découpe le puzzle en patches, pose toutes les pièces sur une table et regarde les relations entre toutes les pièces simultanément, même celles qui sont éloignées.

**Ce qu'un ViT n'est PAS** :

- Un ViT n'est pas un CNN amélioré. Il remplace les convolutions par du self-attention. L'architecture est fondamentalement différente.
- Un ViT n'est pas toujours meilleur qu'un CNN. Sur de petits jeux de données, les CNN restent souvent plus performants car leur biais inductif (localité) compense le manque de données.

**Comparaison ViT vs CNN** :

| ViT | CNN |
| --- | --- |
| Découpe l'image en patches | Applique des filtres locaux |
| Self-attention global | Réceptive field local (élargi couche par couche) |
| Peu de biais inductif | Biais de localité et d'invariance par translation |
| Nécessite beaucoup de données | Performant même avec peu de données |
| Facilement combinable avec du texte | Architecture distincte des modèles textuels |

#### Architecture détaillée du ViT

<div class="diagram-design">
<p><a href="../../../diagrams/ia-05-architectures-modernes-nlp-03-vision-transformers-multimodal-1.html">Architecture détaillée du ViT (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-05-architectures-modernes-nlp-03-vision-transformers-multimodal-1.html" title="Architecture détaillée du ViT" style="width:100%;min-height:868px;border:0;background:transparent"></iframe>
</div>

```python
import torch
import torch.nn as nn

class PatchEmbedding(nn.Module):
    """Découpe une image en patches et projette chaque patch."""

    def __init__(self, img_size=224, patch_size=16, in_channels=3, embed_dim=768):
        super().__init__()
        self.num_patches = (img_size // patch_size) ** 2
        # Conv2d avec kernel_size = stride = patch_size
        # Cela découpe l'image en patches non-chevauchants
        self.projection = nn.Conv2d(
            in_channels, embed_dim,
            kernel_size=patch_size, stride=patch_size
        )

    def forward(self, x):
        # x : (batch, 3, 224, 224)
        x = self.projection(x)   # (batch, 768, 14, 14)
        x = x.flatten(2)         # (batch, 768, 196)
        x = x.transpose(1, 2)    # (batch, 196, 768) = (batch, num_patches, embed_dim)
        return x

# Test
patch_embed = PatchEmbedding()
img = torch.randn(1, 3, 224, 224)  # Une image fictive
patches = patch_embed(img)
print(f"Patches shape : {patches.shape}")  # (1, 196, 768)
```

---

### Qu'est-ce que CLIP ?

**Définition** : CLIP (Contrastive Language-Image Pre-training) est un modèle développé par OpenAI qui apprend à associer des images et des textes dans un même espace vectoriel. Il est entraîné sur 400 millions de paires image-texte collectées sur internet, en utilisant le contrastive learning.

**Le problème que CLIP résout** :

Sans CLIP, voici les problèmes rencontrés :

1. **Classification rigide** : un modèle de vision classique est entraîné sur un ensemble fixe de classes (ex : 1000 classes ImageNet). Pour ajouter une nouvelle classe, il faut ré-entraîner le modèle.
2. **Données annotées coûteuses** : créer un jeu de données avec des labels manuels est long et cher.
3. **Pas de lien image-texte** : les modèles de vision et de texte vivent dans des espaces séparés, rendant impossible la recherche d'images par description textuelle.

**Comment CLIP résout ces problèmes** :

| Problème | Solution apportée par CLIP |
| -------- | -------------------------- |
| Classification rigide | CLIP fait du zéro-shot : il classifie des images dans des catégories jamais vues à l'entraînement |
| Données annotées coûteuses | CLIP apprend à partir de paires image-texte trouvées sur internet (supervision naturelle) |
| Pas de lien image-texte | CLIP projette images et textes dans le même espace vectoriel |

**Analogie concrète** : Imagine un traducteur universel qui parle deux langues : la "langue des images" et la "langue des textes". Il traduit chaque image et chaque texte dans une langue commune. Une fois traduits, tu peux comparer directement une image et un texte pour savoir s'ils parlent de la même chose.

**Ce que CLIP n'est PAS** :

- CLIP n'est pas un modèle génératif. Il ne génère ni images ni textes. Il mesure la compatibilité entre une image et un texte.
- CLIP n'est pas un détecteur d'objets. Il associe une image entière à un texte, sans localiser les objets dans l'image.

#### Fonctionnement de CLIP

<div class="diagram-design">
<p><a href="../../../diagrams/ia-05-architectures-modernes-nlp-03-vision-transformers-multimodal-2.html">Fonctionnement de CLIP (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-05-architectures-modernes-nlp-03-vision-transformers-multimodal-2.html" title="Fonctionnement de CLIP" style="width:100%;min-height:532px;border:0;background:transparent"></iframe>
</div>

Objectif : maximiser la diagonale de la matrice (chaque image associée à son texte).

**Zéro-shot classification avec CLIP** :

```python
# Principe du zero-shot : pas d'entraînement sur les classes cibles
# 1. Encoder l'image
# 2. Encoder chaque description de classe ("a photo of a cat", "a photo of a dog")
# 3. Calculer la similarité cosinus entre l'image et chaque description
# 4. La classe avec la plus haute similarité est la prédiction

labels = ["a photo of a cat", "a photo of a dog", "a photo of a car"]
# L'image d'un chat aura la plus haute similarité avec "a photo of a cat"
```

---

### Qu'est-ce que le contrastive learning ?

**Définition** : Le contrastive learning est une méthode d'apprentissage qui rapproche les représentations des paires positives (image et son texte correspondant) et éloigne les représentations des paires négatives (image et un texte non correspondant) dans l'espace vectoriel.

**Le problème que le contrastive learning résout** :

Sans contrastive learning, voici les problèmes rencontrés :

1. **Pas de supervision naturelle** : les méthodes classiques nécessitent des labels discrets (classe 0, 1, 2...), peu adaptés aux données multimodales
2. **Effondrement des représentations** : sans mécanisme de contraste, le modèle peut apprendre à mapper toutes les entrées vers le même vecteur (solution triviale)
3. **Espace vectoriel non structuré** : les embeddings ne capturent pas les relations sémantiques entre les données

**Comment le contrastive learning résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de supervision naturelle | La paire image-texte elle-même est le signal de supervision |
| Effondrement des représentations | Les paires négatives forcent le modèle à différencier les entrées |
| Espace non structuré | Le contrastive learning organise l'espace : éléments similaires proches, différents éloignés |

**Analogie concrète** : Imagine un professeur qui montre des cartes à un élève. Pour chaque image de chat, il dit "chat" (paire positive). Quand l'élève confond un chien avec un chat, le professeur corrige (paire négative). À force de voir des paires positives et négatives, l'élève apprend à distinguer les concepts.

**Ce que le contrastive learning n'est PAS** :

- Le contrastive learning n'est pas du supervised learning classique. Il n'utilise pas de labels de classe mais des paires de similarité.
- Le contrastive learning n'est pas limité au multimodal. Il est aussi utilisé en vision seule (SimCLR, MoCo) et en NLP.

#### InfoNCE Loss

La fonction de perte utilisée par CLIP est l'InfoNCE (Noise Contrastive Estimation) :

```python
import torch
import torch.nn.functional as F

def info_nce_loss(image_embeddings, text_embeddings, temperature=0.07):
    """
    Calcule la perte InfoNCE pour un batch de paires image-texte.

    Args:
        image_embeddings: (batch_size, embed_dim) - vecteurs normalisés
        text_embeddings: (batch_size, embed_dim) - vecteurs normalisés
        temperature: facteur d'échelle (plus petit = distribution plus piquée)
    """
    # Normaliser les embeddings (norme L2 = 1)
    image_embeddings = F.normalize(image_embeddings, dim=-1)
    text_embeddings = F.normalize(text_embeddings, dim=-1)

    # Matrice de similarité cosinus (batch_size x batch_size)
    # Chaque élément (i, j) = similarité entre image_i et texte_j
    logits = image_embeddings @ text_embeddings.T / temperature

    # Les labels : la diagonale (paire i avec texte i)
    labels = torch.arange(len(logits), device=logits.device)

    # Cross-entropy dans les deux directions
    loss_i2t = F.cross_entropy(logits, labels)      # image vers texte
    loss_t2i = F.cross_entropy(logits.T, labels)     # texte vers image

    # Moyenne des deux pertes
    return (loss_i2t + loss_t2i) / 2
```

---

### Qu'est-ce qu'un modèle multimodal ?

**Définition** : Un modèle multimodal est un modèle capable de traiter et de mettre en relation plusieurs types de données (modalités) : texte, image, audio, vidéo. Il apprend des représentations partagées entre ces modalités pour effectuer des tâches qui nécessitent la compréhension combinée de plusieurs types d'entrées.

**Le problème que les modèles multimodaux résolvent** :

Sans modèles multimodaux, voici les problèmes rencontrés :

1. **Modèles cloisonnés** : un modèle texte et un modèle image vivent dans des mondes séparés, incapables de se compléter
2. **Tâches cross-modal impossibles** : répondre à une question sur une image (VQA), sous-titrer une image, ou chercher une image par description textuelle nécessitent de comprendre les deux modalités
3. **Perte d'information** : traiter chaque modalité séparément perd les interactions entre elles (le contexte textuel enrichit la compréhension de l'image et inversement)

**Comment les modèles multimodaux résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Modèles cloisonnés | Un espace vectoriel commun permet aux modalités de communiquer |
| Tâches cross-modal | Le cross-attention permet à une modalité de "questionner" l'autre |
| Perte d'information | La fusion des modalités capture les interactions et le contexte partagé |

**Analogie concrète** : Un modèle multimodal, c'est comme un interprète lors d'une réunion internationale. Chaque participant parle sa langue (image, texte, audio), et l'interprète traduit tout dans une langue commune pour que chacun comprenne les autres.

**Ce qu'un modèle multimodal n'est PAS** :

- Un modèle multimodal n'est pas deux modèles mis côte à côte. Il apprend activement les relations entre les modalités.
- Un modèle multimodal n'est pas forcément meilleur sur une seule modalité. Un modèle spécialisé texte peut surpasser la branche texte d'un modèle multimodal.

#### Techniques de fusion

```text
1. Early Fusion         2. Late Fusion          3. Cross-Attention
   ┌─────┐                ┌─────┐ ┌─────┐        ┌─────┐ ┌─────┐
   │Image│                │Image│ │Texte│        │Image│ │Texte│
   │Texte│ concaténés     └──┬──┘ └──┬──┘        └──┬──┘ └──┬──┘
   └──┬──┘                   │       │              │       │
     │                   Encoder  Encoder       Encoder  Encoder
   Encoder               commun   commun          │       │
   commun                   │       │           ┌──┴───────┴──┐
     │                   └──┬──┘ └──┬──┘        │Cross-Attend │
   Sortie                Fusion tardive         └──────┬──────┘
                              │                     Sortie
                           Sortie
```

---

### Applications du multimodal

Les modèles multimodaux ouvrent de nombreuses applications pratiques :

| Application | Description | Exemple de modèle |
| ----------- | ----------- | ----------------- |
| Zéro-shot classification | Classifier une image sans entraînement sur les classes cibles | CLIP |
| Image retrieval | Chercher des images à partir d'une description textuelle | CLIP |
| Visual Question Answering (VQA) | Répondre à une question posée sur une image | LLaVA, GPT-4o |
| Image captioning | Générer une description textuelle d'une image | BLIP-2 |
| Text-to-image | Générer une image à partir d'une description | Stable Diffusion (utilise CLIP) |

---

## Étapes Pratiques

### Étape 1 : Comprendre le découpage en patches du ViT

Crée un fichier `vit_clip.py` et commence par visualiser le découpage en patches.

```python
import torch
import torch.nn as nn

# Paramètres du ViT
img_size = 224       # Taille de l'image en pixels
patch_size = 16      # Taille d'un patch en pixels
in_channels = 3      # 3 canaux (RGB)
embed_dim = 768      # Dimension de l'embedding

# Nombre de patches
num_patches = (img_size // patch_size) ** 2
print(f"Image {img_size}x{img_size} découpée en patches {patch_size}x{patch_size}")
print(f"Nombre de patches : {num_patches}")
print(f"Grille : {img_size // patch_size} x {img_size // patch_size}")

# Projection linéaire des patches avec Conv2d
projection = nn.Conv2d(in_channels, embed_dim,
                        kernel_size=patch_size, stride=patch_size)

# Image fictive (batch=1, channels=3, height=224, width=224)
image = torch.randn(1, 3, img_size, img_size)

# Projeter les patches
patches = projection(image)        # (1, 768, 14, 14)
patches = patches.flatten(2)       # (1, 768, 196)
patches = patches.transpose(1, 2)  # (1, 196, 768)

print(f"\nShape après projection : {patches.shape}")
print(f"Chaque patch est un vecteur de dimension {embed_dim}")
```

**Résultat attendu** :

```text
Image 224x224 découpée en patches 16x16
Nombre de patches : 196
Grille : 14 x 14

Shape après projection : torch.Size([1, 196, 768])
Chaque patch est un vecteur de dimension 768
```

---

### Étape 2 : Ajouter le CLS token et les positional embeddings

```python
# CLS token : vecteur appris ajouté en position 0
cls_token = nn.Parameter(torch.randn(1, 1, embed_dim))
print(f"CLS token shape : {cls_token.shape}")

# Répéter le CLS token pour chaque image du batch
batch_size = patches.shape[0]
cls_tokens = cls_token.expand(batch_size, -1, -1)  # (batch, 1, 768)

# Concaténer le CLS token devant les patches
tokens = torch.cat([cls_tokens, patches], dim=1)  # (batch, 197, 768)
print(f"Tokens avec CLS : {tokens.shape}")

# Positional embeddings : un vecteur appris par position
pos_embed = nn.Parameter(torch.randn(1, num_patches + 1, embed_dim))
print(f"Positional embeddings shape : {pos_embed.shape}")

# Ajouter les positional embeddings
tokens = tokens + pos_embed
print(f"Tokens finaux : {tokens.shape}")
```

**Résultat attendu** :

```text
CLS token shape : torch.Size([1, 1, 768])
Tokens avec CLS : torch.Size([1, 197, 768])
Positional embeddings shape : torch.Size([1, 197, 768])
Tokens finaux : torch.Size([1, 197, 768])
```

---

### Étape 3 : Utiliser CLIP pré-entraîné pour le zéro-shot

```python
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

# Charger le modèle CLIP pré-entraîné
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Créer une image de test (en pratique, charge une vraie image)
# image = Image.open("mon_image.jpg")
# Pour le test, on crée une image aléatoire
import numpy as np
image_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
image = Image.fromarray(image_array)

# Définir les descriptions candidates
descriptions = [
    "a photo of a cat",
    "a photo of a dog",
    "a photo of a car",
    "a photo of a building"
]

# Préparer les entrées
inputs = processor(
    text=descriptions,
    images=image,
    return_tensors="pt",
    padding=True
)

# Inférence
with torch.no_grad():
    outputs = model(**inputs)

# Récupérer les similarités image-texte
logits_per_image = outputs.logits_per_image  # (1, 4)
probs = logits_per_image.softmax(dim=1)       # Probabilités

# Afficher les résultats
print("Similarités image-texte :")
for desc, prob in zip(descriptions, probs[0]):
    print(f"  {desc} : {prob.item():.4f}")
```

**Résultat attendu** :

```text
Similarités image-texte :
  a photo of a cat : 0.2534
  a photo of a dog : 0.2412
  a photo of a car : 0.2567
  a photo of a building : 0.2487
```

Les probabilités sont proches car l'image est aléatoire. Avec une vraie photo de chat, la probabilité "a photo of a cat" serait nettement plus élevée.

---

### Étape 4 : Recherche image-texte (image retrieval)

```python
import torch
import torch.nn.functional as F
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
import numpy as np

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Simuler une base de 5 images (en pratique, charge de vraies images)
images = [Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
          for _ in range(5)]
image_labels = ["chat roux", "voiture bleue", "montagne enneigée",
                "plage tropicale", "rue de ville"]

# Encoder toutes les images
with torch.no_grad():
    image_inputs = processor(images=images, return_tensors="pt", padding=True)
    image_embeddings = model.get_image_features(**image_inputs)
    image_embeddings = F.normalize(image_embeddings, dim=-1)

# Requête textuelle
query = "a snowy mountain landscape"

with torch.no_grad():
    text_inputs = processor(text=[query], return_tensors="pt", padding=True)
    text_embedding = model.get_text_features(**text_inputs)
    text_embedding = F.normalize(text_embedding, dim=-1)

# Calculer les similarités cosinus
similarities = (text_embedding @ image_embeddings.T).squeeze(0)

# Trier par similarité décroissante
sorted_indices = similarities.argsort(descending=True)

print(f"Requête : '{query}'")
print(f"\nRésultats classés par pertinence :")
for rank, idx in enumerate(sorted_indices):
    print(f"  {rank + 1}. {image_labels[idx]} (score : {similarities[idx]:.4f})")
```

**Résultat attendu** :

```text
Requête : 'a snowy mountain landscape'

Résultats classés par pertinence :
  1. montagne enneigée (score : 0.xxxx)
  2. ...
  3. ...
  4. ...
  5. ...
```

Avec de vraies images, "montagne enneigée" devrait avoir le score le plus élevé.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nn.Conv2d(3, 768, kernel_size=16, stride=16)` | Projection des patches ViT |
| `tensor.flatten(2)` | Aplatit les dimensions spatiales |
| `tensor.transpose(1, 2)` | Échange les dimensions 1 et 2 |
| `CLIPModel.from_pretrained(name)` | Charge un modèle CLIP pré-entraîné |
| `CLIPProcessor.from_pretrained(name)` | Charge le processeur CLIP (tokenizer + image processor) |
| `model.get_image_features(**inputs)` | Extrait les embeddings d'images |
| `model.get_text_features(**inputs)` | Extrait les embeddings de textes |
| `F.normalize(tensor, dim=-1)` | Normalise les vecteurs (norme L2 = 1) |
| `embeddings @ embeddings.T` | Matrice de similarité cosinus entre vecteurs normalisés |
| `probs = logits.softmax(dim=1)` | Convertit les logits en probabilités |

---

## Pièges Fréquents

### Piège 1 : Oublier de normaliser les embeddings avant la similarité cosinus

⚠️ **Problème** : Calculer `embeddings_a @ embeddings_b.T` sans normaliser. Le résultat n'est pas une similarité cosinus mais un produit scalaire non borné.

✅ **Solution** : Toujours normaliser avec `F.normalize(embeddings, dim=-1)` avant de calculer la similarité.

```python
# INCORRECT
sim = image_emb @ text_emb.T  # Pas une similarité cosinus

# CORRECT
image_emb = F.normalize(image_emb, dim=-1)
text_emb = F.normalize(text_emb, dim=-1)
sim = image_emb @ text_emb.T  # Similarité cosinus ∈ [-1, 1]
```

---

### Piège 2 : Utiliser des prompts inadaptés pour CLIP

⚠️ **Problème** : Utiliser un seul mot ("cat") au lieu d'une phrase complète ("a photo of a cat"). CLIP a été entraîné sur des paires image-texte, pas sur des mots isolés.

✅ **Solution** : Utiliser des prompts au format "a photo of a [classe]" pour la classification zéro-shot. Ce format correspond aux données d'entraînement de CLIP.

---

### Piège 3 : Confondre taille des patches et résolution

⚠️ **Problème** : Utiliser un ViT entraîné avec des patches 16x16 sur des images de taille différente sans adapter les positional embeddings.

✅ **Solution** : Les positional embeddings sont liés au nombre de patches. Si tu changes la taille de l'image, le nombre de patches change et les positional embeddings doivent être interpolés.

---

### Piège 4 : Oublier `torch.no_grad()` en inférence

⚠️ **Problème** : Faire de l'inférence sans `torch.no_grad()`, ce qui consomme inutilement de la mémoire pour stocker les gradients.

✅ **Solution** : Toujours encapsuler l'inférence dans `with torch.no_grad():`.

```python
# INCORRECT : gaspille de la mémoire
outputs = model(**inputs)

# CORRECT : pas de calcul de gradient
with torch.no_grad():
    outputs = model(**inputs)
```

---

## Checklist de Validation

- [ ] Je comprends comment un ViT découpe une image en patches et les projette en embeddings
- [ ] Je sais expliquer le rôle du CLS token et des positional embeddings
- [ ] Je comprends le fonctionnement de CLIP (contrastive learning, espace partagé)
- [ ] Je sais ce qu'est le zéro-shot classification et comment CLIP le permet
- [ ] Je connais la différence entre early fusion, late fusion et cross-attention
- [ ] Je sais utiliser CLIP pré-entraîné pour la classification et la recherche d'images
- [ ] Je sais calculer une similarité cosinus entre embeddings normalisés

---

## Exercice Pratique

**Énoncé** : Implémente un système de recherche image-texte avec CLIP.

1. Charge le modèle CLIP (`openai/clip-vit-base-patch32`)
2. Prépare une collection de 10 images (tu peux utiliser des images du dataset CIFAR-10 ou créer des images synthétiques)
3. Encode toutes les images en embeddings normalisés
4. Implémente une fonction `search(query: str, top_k: int) -> list` qui retourne les k images les plus similaires à la requête textuelle
5. Teste avec 3 requêtes différentes et affiche les scores de similarité

**Indications** :

- Utilise `model.get_image_features()` et `model.get_text_features()` pour obtenir les embeddings
- N'oublie pas de normaliser avec `F.normalize`
- La similarité cosinus se calcule par un produit matriciel entre vecteurs normalisés
- Utilise `torch.no_grad()` pour l'inférence

**Résultat attendu** : Pour chaque requête, le script affiche les images triées par score de similarité décroissant.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn.functional as F
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
import numpy as np

# --- Étape 1 : Charger CLIP ---
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

# --- Étape 2 : Préparer les images ---
# En pratique, remplace par de vraies images
np.random.seed(42)
image_descriptions = [
    "chat noir", "chien blanc", "voiture rouge",
    "arbre en automne", "plage au coucher de soleil",
    "montagne enneigée", "bureau avec ordinateur",
    "assiette de sushi", "vélo dans la rue", "livre ouvert"
]

images = []
for _ in range(10):
    img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    images.append(Image.fromarray(img_array))

# --- Étape 3 : Encoder les images ---
with torch.no_grad():
    image_inputs = processor(images=images, return_tensors="pt", padding=True)
    image_embeddings = model.get_image_features(**image_inputs)
    image_embeddings = F.normalize(image_embeddings, dim=-1)

print(f"Base d'images encodée : {image_embeddings.shape}")

# --- Étape 4 : Fonction de recherche ---
def search(query: str, top_k: int = 3) -> list:
    """
    Recherche les images les plus similaires à la requête textuelle.

    Args:
        query: description textuelle de l'image recherchée
        top_k: nombre de résultats à retourner

    Returns:
        Liste de tuples (index, description, score)
    """
    with torch.no_grad():
        text_inputs = processor(text=[query], return_tensors="pt", padding=True)
        text_embedding = model.get_text_features(**text_inputs)
        text_embedding = F.normalize(text_embedding, dim=-1)

    # Similarité cosinus avec toutes les images
    similarities = (text_embedding @ image_embeddings.T).squeeze(0)

    # Trier par score décroissant
    top_indices = similarities.argsort(descending=True)[:top_k]

    results = []
    for idx in top_indices:
        results.append((
            idx.item(),
            image_descriptions[idx],
            similarities[idx].item()
        ))
    return results

# --- Étape 5 : Tester avec 3 requêtes ---
queries = [
    "a cute black cat sitting on a couch",
    "a snowy mountain landscape",
    "delicious Japanese food"
]

for query in queries:
    print(f"\nRequête : '{query}'")
    results = search(query, top_k=3)
    for rank, (idx, desc, score) in enumerate(results, 1):
        print(f"  {rank}. [{idx}] {desc} (score : {score:.4f})")
```

**Résultat** :

```text
Base d'images encodée : torch.Size([10, 512])

Requête : 'a cute black cat sitting on a couch'
  1. [0] chat noir (score : 0.xxxx)
  2. [1] chien blanc (score : 0.xxxx)
  3. [7] assiette de sushi (score : 0.xxxx)

Requête : 'a snowy mountain landscape'
  1. [5] montagne enneigée (score : 0.xxxx)
  ...

Requête : 'delicious Japanese food'
  1. [7] assiette de sushi (score : 0.xxxx)
  ...
```

Avec de vraies images, les résultats seraient nettement plus pertinents. Les scores ci-dessus sont approximatifs car les images sont aléatoires.

---

## Navigation

← Fiche précédente : **[02 - Du NLP classique aux LLM](02-nlp-classique-llm.md)**

→ Fiche suivante : **[04 - Modèles génératifs](04-modeles-generatifs.md)**
