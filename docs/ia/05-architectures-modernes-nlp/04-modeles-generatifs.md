---
tags:
  - IA
  - Avancé
  - Concept
description: "Modèles génératifs : VAE, GAN, modèles de diffusion, Stable Diffusion et ControlNet pour la génération d'images"
estimated_time: "55 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 5 - Architectures modernes et NLP"
id: "ai.artificial-intelligence.modern-architectures.modeles-generatifs"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.modern-architectures"
content_type: "lesson"
order: 4
---

# 04 - Modèles génératifs

> **En bref** : À la fin de cette fiche, tu sauras comprendre le fonctionnement des VAE, des GAN et des modèles de diffusion, et tu sauras générer des images avec un modèle de diffusion pré-entraîné. Lecture estimée : 55 min.


## Prérequis

- Fiche **[01 - Transformers : architecture](01-transformers-architecture.md)** lue et comprise
- [Phase 4 - Deep learning fondamental](../04-deep-learning-fondamental/index.md) lue et comprise
- Connaissances de base en PyTorch (tenseurs, modules, backpropagation)
- Python 3 avec `pip install torch torchvision diffusers transformers pillow`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comprendre le fonctionnement des VAE, des GAN et des modèles de diffusion, et tu sauras générer des images avec un modèle de diffusion pré-entraîné.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un VAE (Variational Autoencoder) ?

**Définition** : Un VAE est un modèle génératif composé de deux parties : un encoder qui compresse les données en une représentation compacte (espace latent) et un decoder qui reconstruit les données à partir de cette représentation. La particularité du VAE est que l'espace latent est structuré comme une distribution de probabilité (gaussienne), ce qui permet de générer de nouvelles données en échantillonnant depuis cet espace.

**Le problème que le VAE résout** :

Sans VAE, voici les problèmes rencontrés :

1. **Pas de génération contrôlée** : un autoencoder classique compresse les données mais son espace latent est irrégulier. Échantillonner un point aléatoire dans cet espace donne des résultats incohérents.
2. **Pas d'interpolation** : impossible de créer des transitions fluides entre deux images (par exemple, transformer un chat en chien progressivement).
3. **Pas de compréhension des variations** : impossible de séparer les facteurs de variation des données (pose, éclairage, identité).

**Comment le VAE résout ces problèmes** :

| Problème | Solution apportée par le VAE |
| -------- | ---------------------------- |
| Pas de génération contrôlée | L'espace latent gaussien est continu et régulier : chaque point donne une sortie cohérente |
| Pas d'interpolation | On peut interpoler linéairement entre deux points de l'espace latent |
| Pas de compréhension des variations | Chaque dimension de l'espace latent peut capturer un facteur de variation |

**Analogie concrète** : Imagine une machine à fabriquer des visages. L'encoder analyse un visage réel et note ses caractéristiques sur des curseurs (sourire, couleur des yeux, longueur des cheveux). Le decoder lit ces curseurs et dessine un nouveau visage. En bougeant un curseur, tu changes une caractéristique précise du visage généré.

**Ce qu'un VAE n'est PAS** :

- Un VAE n'est pas un autoencoder classique. L'autoencoder classique n'a pas de contrainte sur l'espace latent, alors que le VAE force l'espace latent à suivre une distribution gaussienne.
- Un VAE n'est pas un GAN. Le VAE optimise une vraisemblance (ELBO), le GAN utilise un jeu adversarial entre deux réseaux.

**Comparaison VAE vs Autoencoder classique** :

| VAE | Autoencoder classique |
| --- | --------------------- |
| Espace latent régulier (gaussien) | Espace latent irrégulier |
| Peut générer de nouvelles données | Peut uniquement reconstruire les données d'entraînement |
| Optimise la reconstruction + régularisation (ELBO) | Optimise uniquement la reconstruction |
| Images générées légèrement floues | Reconstruction plus nette mais pas de génération |

#### Architecture du VAE

<div class="diagram-design">
<p><a href="../../../diagrams/ia-05-architectures-modernes-nlp-04-modeles-generatifs-1.html">Architecture du VAE (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-05-architectures-modernes-nlp-04-modeles-generatifs-1.html" title="Architecture du VAE" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

#### Reparameterization trick

Le problème : on ne peut pas rétropropager le gradient à travers un échantillonnage aléatoire. La solution : séparer la partie aléatoire (epsilon) de la partie apprise (mu, sigma).

```python
import torch
import torch.nn as nn

class VAE(nn.Module):
    def __init__(self, input_dim=784, latent_dim=20):
        super().__init__()
        # Encoder : image -> mu, log_var
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 400),
            nn.ReLU()
        )
        self.fc_mu = nn.Linear(400, latent_dim)
        self.fc_log_var = nn.Linear(400, latent_dim)

        # Decoder : z -> image reconstruite
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 400),
            nn.ReLU(),
            nn.Linear(400, input_dim),
            nn.Sigmoid()  # Sortie entre 0 et 1 (pixels)
        )

    def reparameterize(self, mu, log_var):
        """Reparameterization trick : z = mu + std * epsilon"""
        std = torch.exp(0.5 * log_var)  # sigma = exp(0.5 * log(sigma^2))
        epsilon = torch.randn_like(std)  # Échantillon de N(0,1)
        return mu + std * epsilon

    def forward(self, x):
        # Encoder
        h = self.encoder(x)
        mu = self.fc_mu(h)
        log_var = self.fc_log_var(h)

        # Reparameterization
        z = self.reparameterize(mu, log_var)

        # Decoder
        reconstruction = self.decoder(z)
        return reconstruction, mu, log_var
```

#### ELBO (Evidence Lower Bound)

La fonction de perte du VAE combine deux termes :

```python
import torch.nn.functional as F

def vae_loss(reconstruction, original, mu, log_var):
    """
    ELBO = Reconstruction loss + KL divergence

    - Reconstruction : force le decoder à reconstruire fidèlement l'entrée
    - KL divergence : force l'espace latent à ressembler à N(0,1)
    """
    # 1. Reconstruction loss (Binary Cross Entropy)
    recon_loss = F.binary_cross_entropy(
        reconstruction, original, reduction='sum'
    )

    # 2. KL divergence : mesure la distance entre q(z|x) et N(0,1)
    # Formule analytique pour deux gaussiennes
    kl_loss = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())

    return recon_loss + kl_loss
```

---

### Qu'est-ce qu'un GAN (Generative Adversarial Network) ?

**Définition** : Un GAN est un modèle génératif composé de deux réseaux qui s'entraînent simultanément en compétition : un Generator (générateur) qui crée de fausses données et un Discriminator (discriminateur) qui essaie de distinguer les vraies données des fausses. Le Generator s'améliore pour tromper le Discriminator, et le Discriminator s'améliore pour détecter les faux.

**Le problème que les GAN résolvent** :

Sans GAN, voici les problèmes rencontrés :

1. **Images floues** : les VAE produisent des images floues car la perte de reconstruction moyenne les détails
2. **Pas de critère de qualité visuelle** : les fonctions de perte classiques (MSE, cross-entropy) ne capturent pas la qualité perceptuelle d'une image
3. **Distribution de données complexe** : modéliser explicitement la distribution des données (images réalistes) est mathématiquement intractable

**Comment les GAN résolvent ces problèmes** :

| Problème | Solution apportée par les GAN |
| -------- | ----------------------------- |
| Images floues | Le discriminateur force le générateur à produire des détails nets |
| Pas de critère de qualité | Le discriminateur apprend lui-même ce qui rend une image réaliste |
| Distribution complexe | Le générateur apprend implicitement la distribution sans la modéliser explicitement |

**Analogie concrète** : Un GAN, c'est comme un faussaire (Generator) et un détective (Discriminator). Le faussaire essaie de créer de faux billets de banque. Le détective apprend à les repérer. À force de compétition, le faussaire produit des billets de plus en plus convaincants, et le détective devient de plus en plus expert. À l'équilibre, les faux billets sont indiscernables des vrais.

**Ce qu'un GAN n'est PAS** :

- Un GAN n'est pas un seul réseau. Il est composé de deux réseaux distincts avec des objectifs opposés.
- Un GAN n'est pas facile à entraîner. L'entraînement est instable par nature (mode collapse, vanishing gradients).

**Comparaison VAE vs GAN** :

| VAE | GAN |
| --- | --- |
| Images floues mais cohérentes | Images nettes mais parfois incohérentes |
| Entraînement stable | Entraînement instable |
| Espace latent structuré | Espace latent moins structuré |
| Optimise une vraisemblance | Optimise un jeu adversarial |
| Peut évaluer la vraisemblance d'une donnée | Pas de mesure directe de vraisemblance |

#### Architecture du GAN

<div class="diagram-design">
<p><a href="../../../diagrams/ia-05-architectures-modernes-nlp-04-modeles-generatifs-2.html">Architecture du GAN (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-05-architectures-modernes-nlp-04-modeles-generatifs-2.html" title="Architecture du GAN" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

```python
import torch
import torch.nn as nn

class Generator(nn.Module):
    """Transforme un vecteur de bruit en image."""
    def __init__(self, latent_dim=100, img_dim=784):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, img_dim),
            nn.Tanh()  # Sortie entre -1 et 1
        )

    def forward(self, z):
        return self.model(z)

class Discriminator(nn.Module):
    """Classifie une image comme réelle ou fausse."""
    def __init__(self, img_dim=784):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(img_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid()  # Probabilité entre 0 et 1
        )

    def forward(self, img):
        return self.model(img)
```

#### Mode collapse

Le mode collapse est le problème principal des GAN : le générateur apprend à produire un seul type d'image qui trompe le discriminateur, au lieu de produire une variété d'images.

| Distribution réelle | Mode collapse |
| ------------------- | ------------- |
| Le Generator produit des images variées qui couvrent toute la distribution des données | Le Generator ne produit qu'un seul type d'image (un seul mode) |
| Exemples : chats, chiens, voitures, paysages | Exemple : uniquement des visages similaires |

---

### Qu'est-ce qu'un modèle de diffusion ?

**Définition** : Un modèle de diffusion est un modèle génératif qui apprend à générer des données en inversant un processus de bruitage progressif. Le processus forward (bruitage) ajoute du bruit gaussien à l'image étape par étape jusqu'à obtenir du bruit pur. Le processus reverse (débruitage) apprend à retirer le bruit étape par étape pour reconstruire une image nette depuis du bruit pur.

**Le problème que les modèles de diffusion résolvent** :

Sans modèles de diffusion, voici les problèmes rencontrés :

1. **Mode collapse des GAN** : les GAN peuvent ne produire qu'un seul type d'image
2. **Images floues des VAE** : les VAE produisent des images manquant de détails
3. **Entraînement instable** : l'entraînement adversarial des GAN est difficile à stabiliser

**Comment les modèles de diffusion résolvent ces problèmes** :

| Problème | Solution apportée par les modèles de diffusion |
| -------- | ----------------------------------------------- |
| Mode collapse | Pas de jeu adversarial, donc pas de mode collapse. La diversité est naturelle |
| Images floues | Le débruitage progressif produit des images très détaillées |
| Entraînement instable | L'entraînement est une simple régression (prédire le bruit), stable et reproductible |

**Analogie concrète** : Imagine un sculpteur qui travaille le marbre. Le processus forward, c'est comme prendre un bloc de marbre sculpté et ajouter progressivement de la poussière jusqu'à ne plus voir la sculpture (bruit pur). Le processus reverse, c'est le sculpteur qui, à partir d'un bloc brut, retire la poussière couche par couche pour révéler la sculpture cachée. Le modèle apprend à sculpter (débruiter) à chaque étape.

**Ce qu'un modèle de diffusion n'est PAS** :

- Un modèle de diffusion n'est pas rapide à l'inférence. Il nécessite de nombreuses étapes de débruitage (typiquement 20 à 1000 steps), ce qui le rend plus lent qu'un GAN (une seule passe).
- Un modèle de diffusion n'est pas un processus physique de diffusion. Le nom vient de l'analogie avec la diffusion thermodynamique, mais c'est une opération purement mathématique sur des distributions de probabilité.

#### Processus forward et reverse

```text
Processus Forward (bruitage progressif) :
x₀ (image nette) → x₁ → x₂ → ... → xₜ → ... → x_T (bruit pur)
    Ajout de bruit gaussien à chaque étape

Processus Reverse (débruitage appris) :
x_T (bruit pur) → x_{T-1} → ... → xₜ → ... → x₁ → x₀ (image générée)
    Le réseau prédit le bruit à retirer à chaque étape
```

```python
import torch
import torch.nn as nn

def forward_diffusion(x_0, t, noise_schedule):
    """
    Ajoute du bruit à l'image originale en une seule étape.

    Args:
        x_0: image originale (batch, channels, height, width)
        t: timestep (batch,) - valeur entre 0 et T
        noise_schedule: dictionnaire avec alpha_bar pour chaque t
    """
    # alpha_bar_t : quantité de signal restant au timestep t
    alpha_bar_t = noise_schedule['alpha_bar'][t]
    # Redimensionner pour le broadcast
    alpha_bar_t = alpha_bar_t.view(-1, 1, 1, 1)

    # Bruit gaussien
    noise = torch.randn_like(x_0)

    # Image bruitée : mélange de l'image originale et du bruit
    # x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise
    x_t = torch.sqrt(alpha_bar_t) * x_0 + torch.sqrt(1 - alpha_bar_t) * noise

    return x_t, noise
```

#### Le réseau de débruitage (U-Net)

```text
Le U-Net prédit le bruit ajouté à chaque timestep :

Entrée : (image bruitée x_t, timestep t)
                │
          ┌─────┴─────┐
          │   U-Net    │ ← architecture en "U" avec skip connections
          │            │
          │ Encoder    │ ← réduit la résolution, augmente les features
          │    ↓       │
          │ Bottleneck │
          │    ↓       │
          │ Decoder    │ ← augmente la résolution, utilise les skip connections
          └─────┬─────┘
                │
          Sortie : bruit prédit ε_θ(x_t, t)
```

```python
# L'entraînement d'un modèle de diffusion en pseudo-code
def training_step(model, x_0, noise_schedule, T):
    """Une étape d'entraînement du modèle de diffusion."""
    # 1. Choisir un timestep aléatoire
    t = torch.randint(0, T, (x_0.shape[0],))

    # 2. Ajouter du bruit à l'image
    x_t, noise = forward_diffusion(x_0, t, noise_schedule)

    # 3. Le modèle prédit le bruit ajouté
    noise_pred = model(x_t, t)

    # 4. La perte est la différence entre le vrai bruit et le bruit prédit
    loss = nn.functional.mse_loss(noise_pred, noise)

    return loss
```

---

### Qu'est-ce que Stable Diffusion ?

**Définition** : Stable Diffusion est un modèle de diffusion latente (Latent Diffusion Model, LDM) développé par Stability AI. Au lieu d'opérer dans l'espace des pixels (haute dimension), il effectue le processus de diffusion dans un espace latent compressé (basse dimension), ce qui réduit considérablement le coût de calcul. Le texte conditionne la génération via des embeddings CLIP.

**Le problème que Stable Diffusion résout** :

Sans latent diffusion, voici les problèmes rencontrés :

1. **Coût de calcul prohibitif** : faire de la diffusion sur des images 512x512x3 (786 432 dimensions) est extrêmement coûteux en mémoire et en temps
2. **Pas de contrôle textuel** : un modèle de diffusion seul génère des images aléatoires, sans guidage
3. **Inaccessible au grand public** : les modèles de diffusion sur pixels nécessitent des GPU très puissants

**Comment Stable Diffusion résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Coût prohibitif | La diffusion opère dans l'espace latent (64x64x4 = 16 384 dimensions au lieu de 786 432) |
| Pas de contrôle textuel | Le texte est encodé par CLIP et injecté via cross-attention dans le U-Net |
| Inaccessible | La compression latente permet de générer sur un GPU grand public (8 Go VRAM) |

**Analogie concrète** : Imagine un architecte qui travaille sur un plan miniature (espace latent) au lieu de construire directement en taille réelle (espace des pixels). C'est plus rapide et moins coûteux de modifier un plan. Une fois le plan terminé, il est agrandi en taille réelle (decoder). Le client donne des instructions textuelles (CLIP) qui guident le dessin du plan.

**Ce que Stable Diffusion n'est PAS** :

- Stable Diffusion n'est pas un modèle de diffusion classique. Le processus de diffusion se fait dans l'espace latent, pas dans l'espace des pixels.
- Stable Diffusion n'est pas propriétaire. C'est un modèle open source, contrairement à DALL-E ou Midjourney.

#### Architecture de Stable Diffusion

<div class="diagram-design">
<p><a href="../../../diagrams/ia-05-architectures-modernes-nlp-04-modeles-generatifs-3.html">Architecture de Stable Diffusion (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-05-architectures-modernes-nlp-04-modeles-generatifs-3.html" title="Architecture de Stable Diffusion" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que ControlNet ?

**Définition** : ControlNet est une architecture qui ajoute un contrôle spatial à Stable Diffusion. En plus du texte, il accepte une image de contrôle (contours, pose, carte de profondeur) qui guide la structure spatiale de l'image générée.

**Le problème que ControlNet résout** :

Sans ControlNet, voici les problèmes rencontrés :

1. **Pas de contrôle spatial** : avec le texte seul, impossible de spécifier la position exacte des objets
2. **Résultats imprévisibles** : la même description textuelle donne des compositions différentes à chaque génération
3. **Difficulté d'édition** : impossible de modifier une partie de l'image tout en conservant la structure globale

**Comment ControlNet résout ces problèmes** :

| Problème | Solution apportée par ControlNet |
| -------- | -------------------------------- |
| Pas de contrôle spatial | L'image de contrôle (Canny, pose, depth) définit la structure |
| Résultats imprévisibles | La structure spatiale est fixée, seul le style/contenu varie |
| Difficulté d'édition | On peut fournir la structure existante et changer le texte |

**Analogie concrète** : ControlNet, c'est comme donner un gabarit (patron) à un couturier en plus de la description du vêtement. Le texte dit "robe rouge en soie" et le gabarit définit la forme exacte (manches longues, col V, longueur au genou).

**Ce que ControlNet n'est PAS** :

- ControlNet n'est pas un modèle indépendant. Il s'ajoute à Stable Diffusion comme une couche de contrôle supplémentaire.
- ControlNet n'est pas limité à un seul type de contrôle. Il existe des versions pour les contours (Canny), la pose (OpenPose), la profondeur (depth), la segmentation et d'autres.

---

## Étapes Pratiques

### Étape 1 : Implémenter un VAE simple

Crée un fichier `generatif.py` et commence par un VAE sur des données simples.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleVAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super().__init__()
        # Encoder
        self.encoder = nn.Linear(input_dim, hidden_dim)
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)
        self.fc_log_var = nn.Linear(hidden_dim, latent_dim)
        # Decoder
        self.decoder_fc = nn.Linear(latent_dim, hidden_dim)
        self.decoder_out = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h = F.relu(self.encoder(x))
        return self.fc_mu(h), self.fc_log_var(h)

    def reparameterize(self, mu, log_var):
        std = torch.exp(0.5 * log_var)
        eps = torch.randn_like(std)
        return mu + std * eps

    def decode(self, z):
        h = F.relu(self.decoder_fc(z))
        return torch.sigmoid(self.decoder_out(h))

    def forward(self, x):
        mu, log_var = self.encode(x)
        z = self.reparameterize(mu, log_var)
        return self.decode(z), mu, log_var

# Instancier le modèle
vae = SimpleVAE()
print(f"Paramètres du VAE : {sum(p.numel() for p in vae.parameters()):,}")

# Test avec une donnée fictive
x = torch.randn(1, 784)
recon, mu, log_var = vae(x)
print(f"Entrée shape  : {x.shape}")
print(f"Sortie shape  : {recon.shape}")
print(f"Mu shape      : {mu.shape}")
print(f"Log_var shape : {log_var.shape}")
```

**Résultat attendu** :

```text
Paramètres du VAE : 652,824
Entrée shape  : torch.Size([1, 784])
Sortie shape  : torch.Size([1, 784])
Mu shape      : torch.Size([1, 20])
Log_var shape : torch.Size([1, 20])
```

---

### Étape 2 : Entraîner le VAE sur MNIST

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Charger MNIST
transform = transforms.Compose([
    transforms.ToTensor()
])
train_dataset = datasets.MNIST(
    root='./data', train=True, download=True, transform=transform
)
train_loader = DataLoader(train_dataset, batch_size=128, shuffle=True)

# Modèle et optimiseur
vae = SimpleVAE(input_dim=784, hidden_dim=400, latent_dim=20)
optimizer = torch.optim.Adam(vae.parameters(), lr=1e-3)

# Boucle d'entraînement (3 epochs pour la démonstration)
for epoch in range(3):
    total_loss = 0
    for batch_idx, (data, _) in enumerate(train_loader):
        # Aplatir les images 28x28 en vecteurs de 784
        data = data.view(-1, 784)

        # Forward pass
        recon, mu, log_var = vae(data)

        # Calcul de la perte ELBO
        recon_loss = F.binary_cross_entropy(recon, data, reduction='sum')
        kl_loss = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
        loss = recon_loss + kl_loss

        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(train_dataset)
    print(f"Epoch {epoch + 1}/3, Loss moyenne : {avg_loss:.2f}")
```

**Résultat attendu** :

```text
Epoch 1/3, Loss moyenne : 164.xx
Epoch 2/3, Loss moyenne : 120.xx
Epoch 3/3, Loss moyenne : 113.xx
```

---

### Étape 3 : Générer des images avec le VAE entraîné

```python
import numpy as np

# Générer des images en échantillonnant l'espace latent
vae.eval()
with torch.no_grad():
    # Échantillonner 16 points de l'espace latent (gaussien standard)
    z = torch.randn(16, 20)

    # Décoder ces points en images
    generated = vae.decode(z)

    # Redimensionner en images 28x28
    generated = generated.view(-1, 28, 28)

    print(f"Images générées shape : {generated.shape}")
    print(f"Plage de valeurs : [{generated.min():.3f}, {generated.max():.3f}]")

    # Interpolation entre deux points
    z1 = torch.randn(1, 20)
    z2 = torch.randn(1, 20)

    # 10 étapes d'interpolation linéaire
    alphas = torch.linspace(0, 1, 10).unsqueeze(1)
    z_interp = z1 * (1 - alphas) + z2 * alphas
    images_interp = vae.decode(z_interp).view(-1, 28, 28)
    print(f"Images interpolées shape : {images_interp.shape}")
```

**Résultat attendu** :

```text
Images générées shape : torch.Size([16, 28, 28])
Plage de valeurs : [0.001, 0.998]
Images interpolées shape : torch.Size([10, 28, 28])
```

---

### Étape 4 : Générer des images avec un modèle de diffusion pré-entraîné

```python
from diffusers import StableDiffusionPipeline
import torch

# Charger Stable Diffusion (version légère pour la démonstration)
pipe = StableDiffusionPipeline.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5",
    torch_dtype=torch.float16  # Réduire la mémoire
)
# Déplacer sur GPU si disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = pipe.to(device)

# Générer une image à partir d'un prompt textuel
prompt = "a serene landscape with mountains and a lake, digital art"
negative_prompt = "blurry, low quality, distorted"

# Génération
image = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=30,      # Nombre d'étapes de débruitage
    guidance_scale=7.5,          # Force du guidage textuel
    width=512,
    height=512
).images[0]

# Sauvegarder
image.save("generated_landscape.png")
print(f"Image générée : {image.size}")
print(f"Sauvegardée dans generated_landscape.png")
```

**Résultat attendu** :

```text
Image générée : (512, 512)
Sauvegardée dans generated_landscape.png
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `torch.randn_like(tensor)` | Génère du bruit gaussien de même shape |
| `F.binary_cross_entropy(pred, target)` | Perte de reconstruction pour le VAE |
| `torch.exp(0.5 * log_var)` | Convertit log-variance en écart-type |
| `StableDiffusionPipeline.from_pretrained(name)` | Charge un modèle Stable Diffusion |
| `pipe(prompt, num_inference_steps=30)` | Génère une image avec Stable Diffusion |
| `image.save("output.png")` | Sauvegarde l'image PIL générée |
| `torch.linspace(0, 1, steps)` | Crée un vecteur d'interpolation |
| `vae.decode(z)` | Décode un vecteur latent en image |
| `model.eval()` | Met le modèle en mode évaluation |
| `torch.no_grad()` | Désactive le calcul des gradients |

---

## Pièges Fréquents

### Piège 1 : Oublier le reparameterization trick dans le VAE

⚠️ **Problème** : Échantillonner directement `z = Normal(mu, sigma).sample()`. Le gradient ne peut pas traverser un échantillonnage aléatoire, donc le modèle ne s'entraîne pas.

✅ **Solution** : Utiliser le reparameterization trick : `z = mu + sigma * epsilon` avec `epsilon ~ N(0,1)`. Le gradient passe par mu et sigma.

---

### Piège 2 : Mode collapse dans les GAN

⚠️ **Problème** : Le générateur produit toujours la même image (ou très similaire), indépendamment du bruit en entrée.

✅ **Solution** : Plusieurs techniques pour atténuer le mode collapse :

- Utiliser des architectures modernes (WGAN-GP, StyleGAN)
- Ajouter du bruit aux labels du discriminateur
- Utiliser un learning rate plus faible pour le discriminateur
- Vérifier régulièrement la diversité des images générées

---

### Piège 3 : Mauvais `guidance_scale` dans Stable Diffusion

⚠️ **Problème** : Un `guidance_scale` trop faible produit des images qui ne correspondent pas au prompt. Un `guidance_scale` trop élevé produit des images saturées et artificielles.

✅ **Solution** : Utiliser une valeur entre 7 et 12. La valeur par défaut de 7.5 est un bon point de départ.

```python
# Trop faible : image aléatoire, ignore le prompt
image = pipe(prompt, guidance_scale=1.0)

# Bon équilibre : suit le prompt sans saturation
image = pipe(prompt, guidance_scale=7.5)

# Trop élevé : image saturée, artefacts
image = pipe(prompt, guidance_scale=20.0)
```

---

### Piège 4 : Manquer de mémoire GPU avec Stable Diffusion

⚠️ **Problème** : Erreur `CUDA out of memory` lors du chargement ou de la génération.

✅ **Solution** : Utiliser `torch_dtype=torch.float16` pour réduire la mémoire de moitié. Activer l'attention efficace avec `pipe.enable_attention_slicing()`. Réduire la résolution (256x256 au lieu de 512x512).

---

## Checklist de Validation

- [ ] Je comprends la différence entre encoder, espace latent et decoder dans un VAE
- [ ] Je sais expliquer le reparameterization trick et pourquoi il est nécessaire
- [ ] Je comprends la perte ELBO (reconstruction + KL divergence)
- [ ] Je sais expliquer le jeu adversarial entre Generator et Discriminator dans un GAN
- [ ] Je connais le problème du mode collapse et des solutions
- [ ] Je comprends le processus forward (bruitage) et reverse (débruitage) de la diffusion
- [ ] Je sais ce qu'est Stable Diffusion et pourquoi il opère dans l'espace latent
- [ ] Je sais utiliser un modèle de diffusion pré-entraîné pour générer des images

---

## Exercice Pratique

**Énoncé** : Génère des images avec un modèle de diffusion pré-entraîné et explore l'espace latent d'un VAE.

1. Entraîne un VAE sur MNIST (5 epochs)
2. Génère une grille de 25 images (5x5) en échantillonnant l'espace latent
3. Crée une interpolation de 10 étapes entre deux chiffres différents
4. Utilise Stable Diffusion (ou un modèle plus petit) pour générer 3 images à partir de prompts différents
5. Compare les résultats en faisant varier `num_inference_steps` (10, 30, 50)

**Indications** :

- Pour le VAE, utilise `latent_dim=2` pour pouvoir visualiser l'espace latent en 2D
- Pour l'interpolation, utilise `torch.linspace(0, 1, 10)` pour créer les coefficients
- Pour Stable Diffusion, si tu n'as pas de GPU, utilise un modèle plus petit comme `hf-internal-testing/tiny-stable-diffusion-pipe`
- Sauvegarde les images avec `torchvision.utils.save_image` ou `PIL`

**Résultat attendu** : Une grille d'images VAE montrant des chiffres reconnaissables, une interpolation fluide entre deux chiffres, et 3 images générées par diffusion avec des niveaux de détail croissants.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.utils import save_image

# --- Partie 1 : VAE sur MNIST ---
class VAE2D(nn.Module):
    """VAE avec espace latent 2D pour visualisation."""
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(784, 400), nn.ReLU(),
            nn.Linear(400, 200), nn.ReLU()
        )
        self.fc_mu = nn.Linear(200, 2)
        self.fc_log_var = nn.Linear(200, 2)
        self.decoder = nn.Sequential(
            nn.Linear(2, 200), nn.ReLU(),
            nn.Linear(200, 400), nn.ReLU(),
            nn.Linear(400, 784), nn.Sigmoid()
        )

    def encode(self, x):
        h = self.encoder(x)
        return self.fc_mu(h), self.fc_log_var(h)

    def reparameterize(self, mu, log_var):
        std = torch.exp(0.5 * log_var)
        return mu + std * torch.randn_like(std)

    def decode(self, z):
        return self.decoder(z)

    def forward(self, x):
        mu, log_var = self.encode(x)
        z = self.reparameterize(mu, log_var)
        return self.decode(z), mu, log_var

# Données
transform = transforms.ToTensor()
train_data = datasets.MNIST('./data', train=True, download=True, transform=transform)
train_loader = DataLoader(train_data, batch_size=128, shuffle=True)

# Entraînement (5 epochs)
vae = VAE2D()
optimizer = torch.optim.Adam(vae.parameters(), lr=1e-3)

for epoch in range(5):
    total_loss = 0
    for data, _ in train_loader:
        data = data.view(-1, 784)
        recon, mu, log_var = vae(data)
        recon_loss = F.binary_cross_entropy(recon, data, reduction='sum')
        kl_loss = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
        loss = recon_loss + kl_loss
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch + 1}/5 - Loss : {total_loss / len(train_data):.2f}")

# --- Partie 2 : Grille 5x5 ---
vae.eval()
with torch.no_grad():
    z = torch.randn(25, 2)
    generated = vae.decode(z).view(-1, 1, 28, 28)
    save_image(generated, "vae_grid_5x5.png", nrow=5)
    print("Grille 5x5 sauvegardée dans vae_grid_5x5.png")

# --- Partie 3 : Interpolation ---
with torch.no_grad():
    # Encoder deux images réelles (un 3 et un 7 par exemple)
    img_3, _ = train_data[2]     # Prendre une image
    img_7, _ = train_data[0]     # Prendre une autre image
    mu_3, _ = vae.encode(img_3.view(1, 784))
    mu_7, _ = vae.encode(img_7.view(1, 784))

    # 10 étapes d'interpolation
    alphas = torch.linspace(0, 1, 10).unsqueeze(1)
    z_interp = mu_3 * (1 - alphas) + mu_7 * alphas
    interp_images = vae.decode(z_interp).view(-1, 1, 28, 28)
    save_image(interp_images, "vae_interpolation.png", nrow=10)
    print("Interpolation sauvegardée dans vae_interpolation.png")

# --- Partie 4 et 5 : Stable Diffusion ---
try:
    from diffusers import StableDiffusionPipeline

    pipe = StableDiffusionPipeline.from_pretrained(
        "stable-diffusion-v1-5/stable-diffusion-v1-5",
        torch_dtype=torch.float16
    )
    device = "cuda" if torch.cuda.is_available() else "cpu"
    pipe = pipe.to(device)

    prompts = [
        "a cozy cabin in the mountains, oil painting",
        "a futuristic city at night, neon lights, cyberpunk",
        "a peaceful zen garden with cherry blossoms, watercolor"
    ]

    for i, prompt in enumerate(prompts):
        for steps in [10, 30, 50]:
            image = pipe(prompt, num_inference_steps=steps,
                        guidance_scale=7.5).images[0]
            image.save(f"diffusion_{i}_steps{steps}.png")
            print(f"Prompt {i + 1}, {steps} steps : sauvegardé")

except ImportError:
    print("diffusers non installé, partie Stable Diffusion ignorée")
```

**Résultat** :

```text
Epoch 1/5 - Loss : 170.xx
Epoch 2/5 - Loss : 130.xx
...
Epoch 5/5 - Loss : 108.xx
Grille 5x5 sauvegardée dans vae_grid_5x5.png
Interpolation sauvegardée dans vae_interpolation.png
Prompt 1, 10 steps : sauvegardé
Prompt 1, 30 steps : sauvegardé
...
```

---

## Navigation

← Fiche précédente : **[03 - Vision Transformers et multimodal](03-vision-transformers-multimodal.md)**
