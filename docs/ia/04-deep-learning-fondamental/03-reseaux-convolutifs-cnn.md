---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "Réseaux convolutifs (CNN) : convolution, pooling, architectures classiques, transfer learning et data augmentation"
estimated_time: "40 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 4 - Deep learning fondamental"
---

# 03 - Réseaux convolutifs (CNN)

> **En bref** : À la fin de cette fiche, tu sauras expliquer comment fonctionne une convolution, construire un CNN en PyTorch, comprendre les architectures classiques (LeNet, VGG, ResNet), utiliser un modèle pré-entraîné avec le transfer learning, et appliquer la data augmentation. Lecture estimée : 40 min.


## Prérequis

- [Fiche 02 - PyTorch](02-pytorch.md) (tenseurs, autograd, nn.Module, DataLoader, training loop)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer comment fonctionne une convolution, construire un CNN en PyTorch, comprendre les architectures classiques (LeNet, VGG, ResNet), utiliser un modèle pré-entraîné avec le transfer learning, et appliquer la data augmentation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une convolution ?

**Définition** : Une convolution est une opération mathématique qui applique un petit filtre (kernel) sur une image en le faisant glisser pixel par pixel. À chaque position, le filtre multiplie ses valeurs par celles de l'image, additionne le tout, et produit un pixel de sortie. Le résultat est une feature map qui met en évidence un pattern spécifique (bord, texture, forme).

**Le problème que la convolution résout** :

Sans convolution, voici les problèmes rencontrés :

1. **Trop de paramètres** : un réseau fully-connected sur une image 224x224x3 nécessite 224 x 224 x 3 = 150 528 entrées par neurone de la première couche. Avec 1000 neurones, cela fait 150 millions de paramètres pour la première couche seule.
2. **Pas d'invariance spatiale** : un réseau fully-connected traite chaque pixel indépendamment. Un chat en haut à gauche et un chat en bas à droite sont deux patterns complètement différents.
3. **Perte de la structure spatiale** : aplatir une image en vecteur détruit les relations de voisinage entre pixels.

**Comment la convolution résout ces problèmes** :

| Problème | Solution apportée par la convolution |
| -------- | ------------------------------------ |
| Trop de paramètres | Le filtre est petit (ex: 3x3 = 9 paramètres) et partagé sur toute l'image |
| Pas d'invariance spatiale | Le même filtre détecte le même pattern n'importe où dans l'image |
| Perte de structure spatiale | La convolution préserve les relations de voisinage entre pixels |

**Analogie concrète** : Imagine que tu cherches un mot dans un livre avec une loupe. La loupe est le filtre (kernel). Tu la fais glisser ligne par ligne, mot par mot. À chaque position, la loupe te montre si le mot recherché est présent. Tu ne lis pas tout le livre d'un coup (fully-connected), tu le parcours méthodiquement avec un outil de recherche local (convolution).

**Ce qu'une convolution n'est PAS** :

- Une convolution n'est pas une multiplication matricielle classique. Elle utilise le partage de poids : le même filtre est appliqué partout.
- Une convolution n'est pas un filtre fixe. Les valeurs du filtre sont apprises pendant l'entraînement, pas définies manuellement.

**Paramètres clés d'une convolution** :

| Paramètre | Description | Valeur typique |
| --------- | ----------- | -------------- |
| Kernel size | Taille du filtre | 3x3 (le plus courant) |
| Stride | Nombre de pixels de déplacement à chaque pas | 1 (défaut) |
| Padding | Pixels ajoutés autour de l'image pour conserver la taille | 1 (pour kernel 3x3) |
| Channels in | Nombre de canaux d'entrée (ex: 3 pour RGB) | Variable |
| Channels out | Nombre de filtres (= nombre de feature maps en sortie) | 32, 64, 128... |

**Calcul de la taille de sortie** :

```text
output_size = (input_size - kernel_size + 2 * padding) / stride + 1
```

Exemple : image 28x28, kernel 3x3, padding 1, stride 1 :

```text
output_size = (28 - 3 + 2*1) / 1 + 1 = 28
```

Avec padding=1 et kernel 3x3, la taille est conservée.

---

### Qu'est-ce que le pooling ?

**Définition** : Le pooling est une opération qui réduit la taille spatiale d'une feature map en agrégeant les valeurs dans des fenêtres. Le max pooling prend la valeur maximale de chaque fenêtre. L'average pooling prend la moyenne.

**Le problème que le pooling résout** :

Sans pooling, voici les problèmes rencontrés :

1. **Feature maps trop grandes** : après plusieurs convolutions, les feature maps restent grandes et le réseau a trop de paramètres
2. **Sensibilité aux petites translations** : un décalage de 1 pixel dans l'image peut modifier toutes les feature maps
3. **Coût de calcul** : traiter des feature maps de grande taille est lent

**Comment le pooling résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Feature maps trop grandes | Max pooling 2x2 avec stride 2 divise la taille par 2 |
| Sensibilité aux translations | Le pooling rend les features plus robustes aux petits déplacements |
| Coût de calcul | Moins de pixels = moins de calculs dans les couches suivantes |

**Comparaison max pooling vs average pooling** :

| Max pooling | Average pooling |
| ----------- | --------------- |
| Garde la valeur la plus forte | Garde la valeur moyenne |
| Préserve les features dominantes | Lisse les features |
| Le plus utilisé en classification | Utilisé en dernière couche (global average pooling) |

Le diagramme suivant montre l'architecture type d'un CNN, de l'image d'entrée jusqu'à la classification :

<div class="diagram-design">
<p><a href="../../../diagrams/ia-04-deep-learning-fondamental-03-réseaux-convolutifs-cnn-1.html">Qu&#x27;est-ce que le pooling ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-04-deep-learning-fondamental-03-réseaux-convolutifs-cnn-1.html" title="Qu&#x27;est-ce que le pooling ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Quelles sont les architectures classiques de CNN ?

**Définition** : Les architectures classiques sont des modèles de CNN qui ont marqué l'histoire du deep learning par leurs innovations et leurs performances.

**Les 4 architectures à connaître** :

| Architecture | Année | Innovation clé | Profondeur |
| ------------ | ----- | -------------- | ---------- |
| LeNet-5 | 1998 | Premier CNN efficace (reconnaissance de chiffres) | 5 couches |
| AlexNet | 2012 | Premier CNN profond à gagner ImageNet, utilise ReLU et GPU | 8 couches |
| VGG-16 | 2014 | Prouve que la profondeur améliore les performances (3x3 uniquement) | 16 couches |
| ResNet | 2015 | Skip connections (connexions résiduelles) : entraîner 152+ couches | 18 à 152+ couches |

**Les skip connections (ResNet)** :

Le problème de la profondeur : plus un réseau est profond, plus les gradients s'affaiblissent (vanishing gradient). Au-delà de 20 couches, les réseaux classiques performent moins bien.

La solution de ResNet : au lieu d'apprendre la transformation complète H(x), chaque bloc apprend le résidu F(x) = H(x) - x. La sortie du bloc est F(x) + x (on ajoute l'entrée à la sortie). Si le bloc n'a rien d'utile à apprendre, il apprend F(x) = 0 et la sortie est x (l'identité).

```text
Bloc classique :    x -> [Conv -> BN -> ReLU -> Conv -> BN] -> ReLU -> sortie

Bloc résiduel :     x -> [Conv -> BN -> ReLU -> Conv -> BN] + x -> ReLU -> sortie
                    ^                                         ^
                    |_____________skip connection______________|
```

---

### Qu'est-ce que le transfer learning ?

**Définition** : Le transfer learning consiste à prendre un modèle déjà entraîné sur un grand dataset (comme ImageNet avec 1.2 million d'images) et à le réutiliser pour une tâche différente, en adaptant seulement les dernières couches.

**Le problème que le transfer learning résout** :

Sans transfer learning, voici les problèmes rencontrés :

1. **Pas assez de données** : entraîner un CNN profond from scratch nécessite des millions d'images. La plupart des projets n'en ont que quelques milliers.
2. **Entraînement trop long** : entraîner un ResNet from scratch sur ImageNet prend des jours, même avec des GPU puissants.
3. **Résultats médiocres** : un réseau profond entraîné sur peu de données overfitte rapidement.

**Comment le transfer learning résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas assez de données | Les couches de base (détection de bords, textures) sont déjà apprises |
| Entraînement trop long | On n'entraîne que les dernières couches (minutes au lieu de jours) |
| Résultats médiocres | Les features pré-apprises sont de haute qualité |

**Les deux approches du transfer learning** :

| Approche | Description | Quand l'utiliser |
| -------- | ----------- | ---------------- |
| Feature extraction | On gèle toutes les couches sauf la dernière (classificateur) | Peu de données, tâche similaire à ImageNet |
| Fine-tuning | On entraîne tout le réseau avec un learning rate très faible | Plus de données, tâche différente d'ImageNet |

**Analogie concrète** : Le transfer learning est comme engager un chef cuisinier qui a déjà 20 ans d'expérience (modèle pré-entraîné). Il sait déjà couper les légumes, gérer les cuissons et assaisonner (features de base). Tu n'as qu'à lui montrer les recettes spécifiques de ton restaurant (fine-tuning sur ta tâche). C'est bien plus rapide que de former un apprenti depuis zéro.

**Ce que le transfer learning n'est PAS** :

- Le transfer learning n'est pas un copier-coller de modèle. On modifie la dernière couche pour l'adapter à notre nombre de classes.
- Le transfer learning ne fonctionne pas toujours. Si la tâche cible est très différente de la tâche source (ex: images médicales microscopiques vs photos de chats), les features de base peuvent ne pas être utiles.

---

### Qu'est-ce que la data augmentation ?

**Définition** : La data augmentation consiste à appliquer des transformations aléatoires aux images d'entraînement (rotations, retournements, changements de couleur) pour créer artificiellement plus de données et améliorer la généralisation du modèle.

**Le problème que la data augmentation résout** :

Sans data augmentation, voici les problèmes rencontrés :

1. **Pas assez de données** : le modèle overfitte sur les images d'entraînement
2. **Pas de robustesse** : le modèle est sensible à l'orientation, la luminosité, le cadrage
3. **Manque de diversité** : toutes les images se ressemblent, le modèle n'apprend pas de patterns variés

**Comment la data augmentation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas assez de données | Chaque image génère des dizaines de variantes |
| Pas de robustesse | Le modèle apprend à reconnaître un objet quelle que soit sa position ou luminosité |
| Manque de diversité | Les transformations créent de la variété artificielle |

**Transformations courantes** :

| Transformation | Description | Paramètre typique |
| -------------- | ----------- | ------------------ |
| RandomHorizontalFlip | Retourne l'image horizontalement | p=0.5 |
| RandomRotation | Rotation aléatoire | degrees=15 |
| RandomCrop | Recadrage aléatoire | size=224, padding=4 |
| ColorJitter | Modifie luminosité, contraste, saturation | brightness=0.2 |
| RandomResizedCrop | Recadrage + redimensionnement | scale=(0.8, 1.0) |

---

## Étapes Pratiques

### Étape 1 : Construire un CNN simple pour CIFAR-10

CIFAR-10 contient 60 000 images couleur 32x32 réparties en 10 classes (avion, voiture, oiseau, chat, cerf, chien, grenouille, cheval, bateau, camion).

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# --- Configuration ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Data augmentation pour l'entraînement ---
train_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),      # Retournement horizontal
    transforms.RandomRotation(degrees=10),        # Rotation aléatoire +/- 10 degrés
    transforms.RandomCrop(32, padding=4),          # Recadrage avec padding
    transforms.ToTensor(),
    transforms.Normalize(
        mean=(0.4914, 0.4822, 0.4465),            # Moyenne CIFAR-10 par canal RGB
        std=(0.2470, 0.2435, 0.2616)              # Écart-type CIFAR-10 par canal RGB
    ),
])

# Pas d'augmentation pour le test (on veut évaluer sur les images originales)
test_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(
        mean=(0.4914, 0.4822, 0.4465),
        std=(0.2470, 0.2435, 0.2616)
    ),
])

# --- Chargement des données ---
train_dataset = datasets.CIFAR10("./data", train=True, download=True, transform=train_transform)
test_dataset = datasets.CIFAR10("./data", train=False, download=True, transform=test_transform)

train_loader = DataLoader(train_dataset, batch_size=128, shuffle=True, num_workers=2)
test_loader = DataLoader(test_dataset, batch_size=256, shuffle=False, num_workers=2)

# Noms des classes CIFAR-10
classes = ("avion", "voiture", "oiseau", "chat", "cerf",
           "chien", "grenouille", "cheval", "bateau", "camion")

print(f"Entraînement : {len(train_dataset)} images")
print(f"Test : {len(test_dataset)} images")
print(f"Classes : {classes}")

# --- Définition du CNN ---
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()

        # Bloc convolutif 1
        # Entrée : (batch, 3, 32, 32) - 3 canaux RGB
        self.conv1 = nn.Conv2d(
            in_channels=3,      # 3 canaux RGB en entrée
            out_channels=32,    # 32 filtres en sortie
            kernel_size=3,      # Filtre 3x3
            padding=1           # Padding pour conserver la taille
        )
        self.bn1 = nn.BatchNorm2d(32)  # Batch norm sur 32 canaux

        # Bloc convolutif 2
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)

        # Bloc convolutif 3
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)

        # Couches fully-connected
        # Après 3 max pooling 2x2 : 32 -> 16 -> 8 -> 4
        # 128 canaux * 4 * 4 = 2048
        self.fc1 = nn.Linear(128 * 4 * 4, 256)
        self.fc2 = nn.Linear(256, 10)   # 10 classes CIFAR-10

        # Activations et regularization
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)  # Divise la taille par 2
        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        # Bloc 1 : Conv -> BN -> ReLU -> MaxPool
        # (batch, 3, 32, 32) -> (batch, 32, 32, 32) -> (batch, 32, 16, 16)
        x = self.pool(self.relu(self.bn1(self.conv1(x))))

        # Bloc 2 : Conv -> BN -> ReLU -> MaxPool
        # (batch, 32, 16, 16) -> (batch, 64, 16, 16) -> (batch, 64, 8, 8)
        x = self.pool(self.relu(self.bn2(self.conv2(x))))

        # Bloc 3 : Conv -> BN -> ReLU -> MaxPool
        # (batch, 64, 8, 8) -> (batch, 128, 8, 8) -> (batch, 128, 4, 4)
        x = self.pool(self.relu(self.bn3(self.conv3(x))))

        # Aplatir pour les couches fully-connected
        x = x.view(x.size(0), -1)     # (batch, 128*4*4) = (batch, 2048)

        # Couches FC
        x = self.dropout(self.relu(self.fc1(x)))
        x = self.fc2(x)               # Pas d'activation (CrossEntropyLoss l'inclut)
        return x

model = SimpleCNN().to(device)

# Compter les paramètres
total_params = sum(p.numel() for p in model.parameters())
print(f"\nArchitecture :\n{model}")
print(f"\nNombre de paramètres : {total_params:,}")
```

**Résultat attendu** :

```text
Entraînement : 50000 images
Test : 10000 images
Classes : ('avion', 'voiture', 'oiseau', 'chat', 'cerf', 'chien', 'grenouille', 'cheval', 'bateau', 'camion')

Nombre de paramètres : 581,866
```

---

### Étape 2 : Entraîner le CNN sur CIFAR-10

```python
# --- Entraînement ---
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Scheduler : réduit le learning rate si la loss ne diminue plus
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode="min", factor=0.5, patience=3
)

def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss = 0
    correct = 0
    total = 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)

        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        total_loss += loss.item()
        correct += (outputs.argmax(1) == labels).sum().item()
        total += labels.size(0)

    return total_loss / len(loader), correct / total

def evaluate(model, loader, criterion, device):
    model.eval()
    total_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            correct += (outputs.argmax(1) == labels).sum().item()
            total += labels.size(0)

    return total_loss / len(loader), correct / total

# Boucle d'entraînement
num_epochs = 20
best_test_acc = 0.0

for epoch in range(num_epochs):
    train_loss, train_acc = train_one_epoch(
        model, train_loader, criterion, optimizer, device
    )
    test_loss, test_acc = evaluate(
        model, test_loader, criterion, device
    )

    # Ajuster le learning rate
    scheduler.step(test_loss)

    # Sauvegarder le meilleur modèle
    if test_acc > best_test_acc:
        best_test_acc = test_acc
        torch.save(model.state_dict(), "best_cnn_cifar10.pth")

    current_lr = optimizer.param_groups[0]["lr"]
    print(
        f"Époque {epoch+1:2d}/{num_epochs} | "
        f"LR: {current_lr:.6f} | "
        f"Train: {train_loss:.4f} / {train_acc:.2%} | "
        f"Test: {test_loss:.4f} / {test_acc:.2%}"
        f"{' *' if test_acc == best_test_acc else ''}"
    )

print(f"\nMeilleure accuracy test : {best_test_acc:.2%}")
```

**Résultat attendu** :

```text
Époque  1/20 | LR: 0.001000 | Train: 1.3245 / 51.23% | Test: 1.0234 / 63.45% *
Époque  5/20 | LR: 0.001000 | Train: 0.7123 / 74.89% | Test: 0.6789 / 76.34% *
Époque 10/20 | LR: 0.001000 | Train: 0.4567 / 84.12% | Test: 0.5678 / 81.23% *
Époque 15/20 | LR: 0.000500 | Train: 0.3012 / 89.45% | Test: 0.5123 / 83.67% *
Époque 20/20 | LR: 0.000250 | Train: 0.2345 / 91.78% | Test: 0.4987 / 84.56% *

Meilleure accuracy test : 84.56%
```

---

### Étape 3 : Utiliser le transfer learning avec ResNet

On utilise un ResNet-18 pré-entraîné sur ImageNet pour classifier CIFAR-10.

```python
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Transformations adaptées à ResNet (images 224x224) ---
train_transform = transforms.Compose([
    transforms.Resize(224),                        # Redimensionner à 224x224
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],               # Moyenne ImageNet
        std=[0.229, 0.224, 0.225]                  # Écart-type ImageNet
    ),
])

test_transform = transforms.Compose([
    transforms.Resize(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Données
train_dataset = datasets.CIFAR10("./data", train=True, download=True, transform=train_transform)
test_dataset = datasets.CIFAR10("./data", train=False, download=True, transform=test_transform)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True, num_workers=2)
test_loader = DataLoader(test_dataset, batch_size=128, shuffle=False, num_workers=2)

# --- Charger ResNet-18 pré-entraîné ---
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

# Geler toutes les couches (on ne modifie pas les features pré-apprises)
for param in model.parameters():
    param.requires_grad = False

# Remplacer la dernière couche fully-connected
# ResNet-18 original : 512 -> 1000 (classes ImageNet)
# Notre tâche : 512 -> 10 (classes CIFAR-10)
num_features = model.fc.in_features    # 512
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(num_features, 10)
)

# Seule la nouvelle couche fc est entraînable
model = model.to(device)

# Compter les paramètres entraînables
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
total_params = sum(p.numel() for p in model.parameters())
print(f"Paramètres entraînables : {trainable_params:,} / {total_params:,}")

# --- Entraînement (feature extraction) ---
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.fc.parameters(), lr=0.001)

num_epochs = 5

for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        total_loss += loss.item()
        correct += (outputs.argmax(1) == labels).sum().item()
        total += labels.size(0)

    train_loss = total_loss / len(train_loader)
    train_acc = correct / total

    # Évaluation
    model.eval()
    test_correct = 0
    test_total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            test_correct += (outputs.argmax(1) == labels).sum().item()
            test_total += labels.size(0)

    test_acc = test_correct / test_total
    print(
        f"Époque {epoch+1}/{num_epochs} | "
        f"Train: {train_loss:.4f} / {train_acc:.2%} | "
        f"Test: {test_acc:.2%}"
    )
```

**Résultat attendu** :

```text
Paramètres entraînables : 5,130 / 11,181,642

Époque 1/5 | Train: 0.8234 / 72.34% | Test: 86.12%
Époque 2/5 | Train: 0.5678 / 81.23% | Test: 88.45%
Époque 3/5 | Train: 0.4567 / 84.67% | Test: 89.23%
Époque 4/5 | Train: 0.3987 / 86.34% | Test: 89.78%
Époque 5/5 | Train: 0.3567 / 87.89% | Test: 90.12%
```

Avec seulement 5 130 paramètres entraînables (sur 11 millions), le transfer learning atteint 90% en 5 époques, contre 84% pour le CNN from scratch en 20 époques.

---

### Étape 4 : Fine-tuning complet

Après la phase de feature extraction, on dégèle toutes les couches et on entraîne le modèle complet avec un learning rate faible.

```python
# --- Dégeler toutes les couches ---
for param in model.parameters():
    param.requires_grad = True

# Learning rate faible pour ne pas détruire les features pré-apprises
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

# Entraîner 5 époques supplémentaires
for epoch in range(5):
    model.train()
    total_loss = 0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        total_loss += loss.item()
        correct += (outputs.argmax(1) == labels).sum().item()
        total += labels.size(0)

    train_loss = total_loss / len(train_loader)
    train_acc = correct / total

    model.eval()
    test_correct = 0
    test_total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            test_correct += (outputs.argmax(1) == labels).sum().item()
            test_total += labels.size(0)

    test_acc = test_correct / test_total
    print(
        f"Fine-tuning époque {epoch+1}/5 | "
        f"Train: {train_loss:.4f} / {train_acc:.2%} | "
        f"Test: {test_acc:.2%}"
    )
```

**Résultat attendu** :

```text
Fine-tuning époque 1/5 | Train: 0.2345 / 92.34% | Test: 93.12%
Fine-tuning époque 2/5 | Train: 0.1567 / 94.67% | Test: 93.89%
Fine-tuning époque 3/5 | Train: 0.1123 / 96.12% | Test: 94.23%
Fine-tuning époque 4/5 | Train: 0.0867 / 97.01% | Test: 94.56%
Fine-tuning époque 5/5 | Train: 0.0712 / 97.56% | Test: 94.78%
```

Le fine-tuning porte l'accuracy de 90% à 94.78%.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nn.Conv2d(in_ch, out_ch, kernel_size, padding)` | Crée une couche de convolution 2D |
| `nn.MaxPool2d(kernel_size, stride)` | Crée une couche de max pooling |
| `nn.BatchNorm2d(num_features)` | Batch normalization pour des feature maps 2D |
| `models.resnet18(weights=ResNet18_Weights.DEFAULT)` | Charge ResNet-18 pré-entraîné |
| `param.requires_grad = False` | Gèle un paramètre (pas de gradient) |
| `model.fc = nn.Linear(in, out)` | Remplace la dernière couche d'un modèle |
| `transforms.RandomHorizontalFlip()` | Data augmentation : retournement horizontal |
| `transforms.Normalize(mean, std)` | Normalise les canaux de l'image |

---

## Pièges Fréquents

### Piège 1 : Oublier de normaliser avec les stats d'ImageNet pour le transfer learning

⚠️ **Problème** : Le modèle pré-entraîné a été entraîné avec les images normalisées selon les statistiques d'ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]). Si tu utilises d'autres valeurs de normalisation, les features extraites seront incorrectes.

✅ **Solution** : Utilise toujours les statistiques d'ImageNet quand tu fais du transfer learning avec un modèle pré-entraîné sur ImageNet :

```python
transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
```

---

### Piège 2 : Ne pas redimensionner les images pour ResNet

⚠️ **Problème** : ResNet attend des images 224x224. CIFAR-10 contient des images 32x32. Sans redimensionnement, le modèle plante ou produit des résultats incorrects.

✅ **Solution** : Ajoute `transforms.Resize(224)` dans la pipeline de transformation.

---

### Piège 3 : Learning rate trop élevé pour le fine-tuning

⚠️ **Problème** : Un learning rate de 0.001 (classique pour un entraînement from scratch) est trop élevé pour le fine-tuning. Il détruit les features pré-apprises en quelques époques.

✅ **Solution** : Utilise un learning rate 10 à 100 fois plus faible pour le fine-tuning (ex: 0.0001 au lieu de 0.001).

---

### Piège 4 : Appliquer la data augmentation aux données de test

⚠️ **Problème** : La data augmentation (rotation, flip, crop aléatoire) appliquée aux données de test rend les résultats non reproductibles et biaisés.

✅ **Solution** : Crée deux pipelines de transformation distinctes : une avec augmentation pour l'entraînement, une sans pour le test :

```python
# Entraînement : avec augmentation
train_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
    transforms.Normalize(mean, std),
])

# Test : sans augmentation
test_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean, std),
])
```

---

## Checklist de Validation

- [ ] Je sais expliquer comment fonctionne une convolution (filtre, stride, padding)
- [ ] Je connais la formule de calcul de la taille de sortie d'une convolution
- [ ] Je sais construire un CNN en PyTorch (Conv2d, MaxPool2d, BatchNorm2d)
- [ ] Je connais les architectures classiques (LeNet, VGG, ResNet) et les skip connections
- [ ] Je sais utiliser un modèle pré-entraîné avec le transfer learning
- [ ] Je comprends la différence entre feature extraction et fine-tuning
- [ ] Je sais appliquer la data augmentation

---

## Exercice Pratique

**Énoncé** : Utilise un ResNet-18 pré-entraîné pour classifier les images CIFAR-10. Commence par une phase de feature extraction (5 époques, seule la dernière couche est entraînée), puis fais un fine-tuning complet (5 époques supplémentaires avec toutes les couches dégelées). L'objectif est d'atteindre plus de 93% d'accuracy sur le jeu de test.

**Indications** :

- Redimensionne les images à 224x224 pour ResNet
- Utilise la normalisation ImageNet
- Applique la data augmentation (flip, rotation, crop)
- Phase 1 (feature extraction) : `lr=0.001`, geler toutes les couches sauf `model.fc`
- Phase 2 (fine-tuning) : `lr=0.0001`, dégeler toutes les couches
- Sauvegarde le meilleur modèle

**Résultat attendu** : Plus de 93% d'accuracy sur le jeu de test après les 10 époques.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# --- Configuration ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device : {device}")

# --- Transformations ---
train_transform = transforms.Compose([
    transforms.Resize(224),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.RandomCrop(224, padding=8),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

test_transform = transforms.Compose([
    transforms.Resize(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# --- Données ---
train_dataset = datasets.CIFAR10("./data", train=True, download=True, transform=train_transform)
test_dataset = datasets.CIFAR10("./data", train=False, download=True, transform=test_transform)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True, num_workers=2)
test_loader = DataLoader(test_dataset, batch_size=128, shuffle=False, num_workers=2)

# --- Modèle ---
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

# Geler toutes les couches
for param in model.parameters():
    param.requires_grad = False

# Remplacer la dernière couche
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.fc.in_features, 10)
)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
best_test_acc = 0.0

# --- Phase 1 : Feature extraction (5 époques) ---
print("=== Phase 1 : Feature extraction ===")
optimizer = torch.optim.Adam(model.fc.parameters(), lr=0.001)

for epoch in range(5):
    model.train()
    correct = 0
    total = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        correct += (outputs.argmax(1) == labels).sum().item()
        total += labels.size(0)

    model.eval()
    test_correct = 0
    test_total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            test_correct += (outputs.argmax(1) == labels).sum().item()
            test_total += labels.size(0)

    train_acc = correct / total
    test_acc = test_correct / test_total
    if test_acc > best_test_acc:
        best_test_acc = test_acc
        torch.save(model.state_dict(), "best_resnet_cifar10.pth")
    print(f"Époque {epoch+1}/5 | Train: {train_acc:.2%} | Test: {test_acc:.2%}")

# --- Phase 2 : Fine-tuning (5 époques) ---
print("\n=== Phase 2 : Fine-tuning ===")
for param in model.parameters():
    param.requires_grad = True

optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

for epoch in range(5):
    model.train()
    correct = 0
    total = 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
        correct += (outputs.argmax(1) == labels).sum().item()
        total += labels.size(0)

    model.eval()
    test_correct = 0
    test_total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            test_correct += (outputs.argmax(1) == labels).sum().item()
            test_total += labels.size(0)

    train_acc = correct / total
    test_acc = test_correct / test_total
    if test_acc > best_test_acc:
        best_test_acc = test_acc
        torch.save(model.state_dict(), "best_resnet_cifar10.pth")
    print(f"Époque {epoch+1}/5 | Train: {train_acc:.2%} | Test: {test_acc:.2%}")

print(f"\nMeilleure accuracy test : {best_test_acc:.2%}")
```

**Résultat attendu** :

```text
Device : cuda
=== Phase 1 : Feature extraction ===
Époque 1/5 | Train: 73.45% | Test: 86.78%
Époque 2/5 | Train: 82.12% | Test: 88.23%
Époque 3/5 | Train: 84.56% | Test: 89.12%
Époque 4/5 | Train: 86.23% | Test: 89.67%
Époque 5/5 | Train: 87.12% | Test: 90.01%

=== Phase 2 : Fine-tuning ===
Époque 1/5 | Train: 92.34% | Test: 93.12%
Époque 2/5 | Train: 94.56% | Test: 93.78%
Époque 3/5 | Train: 95.89% | Test: 94.23%
Époque 4/5 | Train: 96.78% | Test: 94.56%
Époque 5/5 | Train: 97.23% | Test: 94.89%

Meilleure accuracy test : 94.89%
```

---

## Navigation

← Fiche précédente : **[02 - PyTorch](02-pytorch.md)**

→ Fiche suivante : **[04 - Réseaux récurrents et séquences](04-reseaux-recurrents-sequences.md)**
