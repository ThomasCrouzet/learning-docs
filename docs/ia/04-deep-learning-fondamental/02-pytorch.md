---
tags:
  - IA
  - Intermédiaire
  - Pratique
description: "PyTorch : tenseurs, autograd, nn.Module, DataLoader, training loop, sauvegarde et chargement"
estimated_time: "50 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 4 - Deep learning fondamental"
id: "ai.artificial-intelligence.deep-learning.pytorch"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.deep-learning"
content_type: "lesson"
order: 2
---

# 02 - PyTorch

> **En bref** : À la fin de cette fiche, tu sauras créer et manipuler des tenseurs PyTorch, utiliser l'autograd pour calculer des gradients automatiquement, définir un modèle avec nn.Module, charger des données avec DataLoader, et écrire une boucle d'entraînement complète. Lecture estimée : 50 min.


## Prérequis

- [Fiche 01 - Réseaux de neurones : théorie et pratique](01-reseaux-neurones-theorie-pratique.md) (perceptron, backpropagation, loss functions)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et manipuler des tenseurs PyTorch, utiliser l'autograd pour calculer des gradients automatiquement, définir un modèle avec nn.Module, charger des données avec DataLoader, et écrire une boucle d'entraînement complète.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un tenseur PyTorch ?

**Définition** : Un tenseur PyTorch est une structure de données multidimensionnelle (similaire à un array NumPy) qui peut être stockée sur CPU ou GPU et qui supporte le calcul automatique des gradients.

**Le problème que les tenseurs PyTorch résolvent** :

Sans tenseurs PyTorch, voici les problèmes rencontrés :

1. **Pas de GPU** : les arrays NumPy ne fonctionnent que sur CPU, ce qui rend l'entraînement de grands réseaux trop lent
2. **Pas de gradients automatiques** : il faut calculer manuellement les dérivées (comme dans la fiche 01)
3. **Pas de graphe de calcul** : impossible de tracer automatiquement les opérations pour la backpropagation

**Comment les tenseurs PyTorch résolvent ces problèmes** :

| Problème | Solution apportée par les tenseurs PyTorch |
| -------- | ------------------------------------------ |
| Pas de GPU | Un tenseur peut être transféré sur GPU avec `.to("cuda")` |
| Pas de gradients automatiques | `requires_grad=True` active le suivi des opérations pour autograd |
| Pas de graphe de calcul | Chaque opération est enregistrée dans un graphe dynamique |

**Analogie concrète** : Un tenseur PyTorch est comme un conteneur d'expédition intelligent. Comme un array NumPy, il transporte des données (nombres). Mais en plus, il sait dans quel entrepôt il se trouve (CPU ou GPU), il enregistre automatiquement chaque manipulation qu'il subit (graphe de calcul), et il peut remonter la chaîne de ses transformations pour calculer comment chaque étape a influencé le résultat final (gradients).

**Ce qu'un tenseur PyTorch n'est PAS** :

- Un tenseur n'est pas un array NumPy, même s'ils se ressemblent. Un tenseur supporte le GPU et l'autograd. Un array NumPy ne les supporte pas.
- Un tenseur n'est pas une matrice. Une matrice est un tenseur 2D. Un tenseur peut avoir 0 dimension (scalaire), 1 (vecteur), 2 (matrice), 3 (image RGB), ou plus.

**Comparaison NumPy vs PyTorch** :

| NumPy | PyTorch |
| ----- | ------- |
| `np.array([1, 2, 3])` | `torch.tensor([1, 2, 3])` |
| `np.zeros((3, 4))` | `torch.zeros(3, 4)` |
| `a @ b` (CPU uniquement) | `a @ b` (CPU ou GPU) |
| `a.shape` | `a.shape` (identique) |
| Pas de gradients | `requires_grad=True` |

---

### Qu'est-ce que l'autograd ?

**Définition** : L'autograd (automatic gradient) est le système de PyTorch qui enregistre toutes les opérations effectuées sur les tenseurs et calcule automatiquement les gradients par backpropagation quand on appelle `.backward()`.

**Le problème que l'autograd résout** :

Sans autograd, voici les problèmes rencontrés :

1. **Calcul manuel des gradients** : il faut dériver chaque opération à la main (erreur fréquente, long, pénible)
2. **Pas de généralisation** : changer l'architecture du réseau oblige à recalculer toutes les dérivées
3. **Erreurs de dérivation** : les erreurs dans le calcul des gradients sont difficiles à détecter

**Comment l'autograd résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Calcul manuel | `.backward()` calcule tous les gradients automatiquement |
| Pas de généralisation | Le graphe de calcul est reconstruit à chaque forward pass (graphe dynamique) |
| Erreurs de dérivation | Les gradients sont mathématiquement exacts (pas d'approximation numérique) |

**Analogie concrète** : L'autograd est comme un comptable qui note chaque transaction (opération) dans un journal. Quand tu veux savoir l'impact d'une dépense initiale sur le bilan final (gradient), le comptable remonte le journal transaction par transaction et calcule l'impact exact. Tu n'as pas besoin de faire les calculs toi-même.

**Ce que l'autograd n'est PAS** :

- L'autograd n'est pas un approximateur numérique. Il ne calcule pas les gradients en faisant de petites perturbations (comme la différence finie). Il utilise les règles exactes de dérivation.
- L'autograd n'est pas un optimiseur. Il calcule les gradients mais ne met pas à jour les poids. C'est le rôle de l'optimiseur (SGD, Adam).

---

### Qu'est-ce que nn.Module ?

**Définition** : `nn.Module` est la classe de base de PyTorch pour définir un réseau de neurones. Chaque modèle est une sous-classe de `nn.Module` avec une méthode `__init__` (définition des couches) et une méthode `forward` (propagation avant).

**Le problème que nn.Module résout** :

Sans nn.Module, voici les problèmes rencontrés :

1. **Gestion manuelle des poids** : il faut créer, stocker et mettre à jour chaque matrice de poids manuellement
2. **Pas de structure** : le code du réseau est un ensemble de fonctions dispersées, difficile à maintenir
3. **Pas de fonctionnalités intégrées** : pas de sauvegarde, pas de mise en mode évaluation, pas de transfert GPU

**Comment nn.Module résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Gestion manuelle des poids | `.parameters()` renvoie automatiquement tous les poids du modèle |
| Pas de structure | La classe encapsule architecture + forward pass dans un seul objet |
| Pas de fonctionnalités intégrées | `.eval()`, `.train()`, `.state_dict()`, `.to("cuda")` sont hérités |

**Analogie concrète** : `nn.Module` est comme un plan d'architecte pour un bâtiment. Le `__init__` définit les matériaux et les pièces (couches). Le `forward` définit comment on circule dans le bâtiment (de l'entrée à la sortie). Le plan permet aussi de faire l'inventaire de tous les matériaux (`.parameters()`), de déplacer le bâtiment (`.to("cuda")`), et de sauvegarder les plans (`.state_dict()`).

---

### Qu'est-ce qu'un DataLoader et un Dataset ?

**Définition** : Un `Dataset` est un objet qui contient les données et permet d'accéder à un exemple par son index. Un `DataLoader` est un itérateur qui découpe le dataset en mini-batches, mélange les données et les charge en parallèle.

**Le problème que DataLoader résout** :

Sans DataLoader, voici les problèmes rencontrés :

1. **Mémoire insuffisante** : charger toutes les données en mémoire d'un coup peut être impossible
2. **Pas de batching** : il faut découper manuellement les données en mini-batches
3. **Pas de shuffling** : les données sont toujours dans le même ordre, ce qui biaise l'entraînement

**Comment DataLoader résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Mémoire insuffisante | Le DataLoader charge les données batch par batch |
| Pas de batching | `batch_size` découpe automatiquement |
| Pas de shuffling | `shuffle=True` mélange les données à chaque époque |

---

### Qu'est-ce que le training loop ?

**Définition** : Le training loop (boucle d'entraînement) est la séquence d'opérations répétée à chaque batch : forward pass, calcul de la loss, backpropagation, mise à jour des poids.

**Les 5 étapes du training loop PyTorch** :

```text
Pour chaque batch :
  1. Forward pass    : y_pred = model(x_batch)
  2. Calcul loss     : loss = criterion(y_pred, y_batch)
  3. Backpropagation : loss.backward()
  4. Mise à jour     : optimizer.step()
  5. Reset gradients : optimizer.zero_grad()
```

**Ce que le training loop n'est PAS** :

- Le training loop n'est pas un algorithme unique. L'ordre des étapes 4 et 5 peut varier (certains appellent `zero_grad()` avant `backward()`). L'important est que `zero_grad()` soit appelé une fois par batch, avant ou après `step()`.

---

### Qu'est-ce que la sauvegarde et le chargement de modèles ?

**Définition** : La sauvegarde consiste à écrire les poids d'un modèle sur le disque. Le chargement consiste à restaurer ces poids dans un modèle existant.

**Les deux méthodes de sauvegarde** :

| Méthode | Commande | Avantage | Inconvénient |
| ------- | -------- | -------- | ------------ |
| state_dict (recommandé) | `torch.save(model.state_dict(), "model.pth")` | Portable, léger | Nécessite de recréer la classe du modèle |
| Modèle complet | `torch.save(model, "model.pth")` | Simple | Dépend de la structure exacte du code |

---

## Étapes Pratiques

### Étape 1 : Créer et manipuler des tenseurs

```python
import torch

# --- Création de tenseurs ---

# Depuis une liste Python
a = torch.tensor([1.0, 2.0, 3.0])
print(f"Tenseur a : {a}")
print(f"Type : {a.dtype}")       # float32 par défaut
print(f"Shape : {a.shape}")      # torch.Size([3])

# Tenseur 2D (matrice)
b = torch.tensor([[1, 2], [3, 4], [5, 6]], dtype=torch.float32)
print(f"\nMatrice b :\n{b}")
print(f"Shape : {b.shape}")      # torch.Size([3, 2])

# Tenseurs spéciaux
zeros = torch.zeros(3, 4)        # Matrice 3x4 de zéros
ones = torch.ones(2, 3)          # Matrice 2x3 de uns
rand = torch.randn(2, 3)         # Matrice 2x3 aléatoire (distribution normale)

print(f"\nZeros shape : {zeros.shape}")
print(f"Ones shape : {ones.shape}")
print(f"Randn :\n{rand}")

# --- Opérations ---

x = torch.tensor([1.0, 2.0, 3.0])
y = torch.tensor([4.0, 5.0, 6.0])

# Opérations élément par élément
print(f"\nx + y = {x + y}")
print(f"x * y = {x * y}")        # Multiplication élément par élément

# Produit matriciel
A = torch.randn(2, 3)
B = torch.randn(3, 4)
C = A @ B                        # Produit matriciel (2,3) @ (3,4) = (2,4)
print(f"\nA @ B shape : {C.shape}")

# --- Conversion NumPy <-> PyTorch ---
import numpy as np

np_array = np.array([1.0, 2.0, 3.0])
tensor_from_np = torch.from_numpy(np_array)    # NumPy -> PyTorch
np_from_tensor = tensor_from_np.numpy()         # PyTorch -> NumPy

print(f"\nNumPy -> Tensor : {tensor_from_np}")
print(f"Tensor -> NumPy : {np_from_tensor}")
```

**Résultat attendu** :

```text
Tenseur a : tensor([1., 2., 3.])
Type : torch.float32
Shape : torch.Size([3])

Matrice b :
tensor([[1., 2.],
        [3., 4.],
        [5., 6.]])
Shape : torch.Size([3, 2])

Zeros shape : torch.Size([3, 4])
Ones shape : torch.Size([2, 3])
Randn :
tensor([[-0.4321,  0.1234, -0.8765],
        [ 0.5678, -0.2345,  0.9876]])

x + y = tensor([5., 7., 9.])
x * y = tensor([ 4., 10., 18.])

A @ B shape : torch.Size([2, 4])

NumPy -> Tensor : tensor([1., 2., 3.], dtype=torch.float64)
Tensor -> NumPy : [1. 2. 3.]
```

---

### Étape 2 : Utiliser l'autograd

```python
import torch

# Créer un tenseur avec suivi des gradients
x = torch.tensor([2.0, 3.0], requires_grad=True)

# Effectuer des opérations (elles sont enregistrées dans le graphe)
y = x ** 2           # y = [4.0, 9.0]
z = y.sum()          # z = 13.0 (scalaire)

print(f"x = {x}")
print(f"y = x^2 = {y}")
print(f"z = sum(y) = {z}")

# Calculer les gradients : dz/dx
z.backward()

# dz/dx = d(x1^2 + x2^2)/dx = [2*x1, 2*x2] = [4.0, 6.0]
print(f"\nGradients dz/dx : {x.grad}")

# --- Exemple plus complexe ---

# Simuler un forward pass simple
w = torch.tensor([1.0, -0.5], requires_grad=True)
x_input = torch.tensor([3.0, 2.0])
y_true = torch.tensor(1.0)

# Forward pass
y_pred = (w * x_input).sum()     # Produit scalaire : 3.0 + (-1.0) = 2.0
loss = (y_pred - y_true) ** 2    # MSE : (2.0 - 1.0)^2 = 1.0

print(f"\ny_pred = {y_pred.item():.4f}")
print(f"loss = {loss.item():.4f}")

# Backpropagation
loss.backward()

# dL/dw = 2 * (y_pred - y_true) * x = 2 * 1.0 * [3.0, 2.0] = [6.0, 4.0]
print(f"Gradients dL/dw : {w.grad}")

# --- Important : remettre les gradients à zéro ---
# Les gradients s'accumulent par défaut
w.grad.zero_()       # Remet à zéro
print(f"Gradients après zero_() : {w.grad}")
```

**Résultat attendu** :

```text
x = tensor([2., 3.], requires_grad=True)
y = x^2 = tensor([4., 9.], grad_fn=<PowBackward0>)
z = sum(y) = tensor(13., grad_fn=<SumBackward0>)

Gradients dz/dx : tensor([4., 6.])

y_pred = 2.0000
loss = 1.0000
Gradients dL/dw : tensor([6., 4.])
Gradients après zero_() : tensor([0., 0.])
```

---

### Étape 3 : Définir un modèle avec nn.Module

```python
import torch
import torch.nn as nn

class MNISTClassifier(nn.Module):
    def __init__(self):
        # Appeler le constructeur de nn.Module (obligatoire)
        super().__init__()

        # Définir les couches du réseau
        # Couche 1 : 784 entrées (images 28x28 aplaties) -> 128 neurones
        self.fc1 = nn.Linear(784, 128)

        # Couche 2 : 128 -> 64 neurones
        self.fc2 = nn.Linear(128, 64)

        # Couche 3 (sortie) : 64 -> 10 classes (chiffres 0-9)
        self.fc3 = nn.Linear(64, 10)

        # Fonction d'activation ReLU
        self.relu = nn.ReLU()

        # Dropout pour la regularization
        self.dropout = nn.Dropout(p=0.2)

    def forward(self, x):
        # Couche 1 : linéaire + ReLU + dropout
        x = self.fc1(x)       # (batch, 784) -> (batch, 128)
        x = self.relu(x)
        x = self.dropout(x)

        # Couche 2 : linéaire + ReLU + dropout
        x = self.fc2(x)       # (batch, 128) -> (batch, 64)
        x = self.relu(x)
        x = self.dropout(x)

        # Couche 3 : linéaire (pas d'activation, CrossEntropyLoss l'inclut)
        x = self.fc3(x)       # (batch, 64) -> (batch, 10)
        return x

# Créer une instance du modèle
model = MNISTClassifier()

# Afficher l'architecture
print(model)

# Compter les paramètres
total_params = sum(p.numel() for p in model.parameters())
print(f"\nNombre total de paramètres : {total_params:,}")

# Test avec une entrée aléatoire
x_test = torch.randn(4, 784)    # Batch de 4 images
output = model(x_test)           # Forward pass
print(f"\nEntrée shape : {x_test.shape}")
print(f"Sortie shape : {output.shape}")
print(f"Sortie (logits) :\n{output}")
```

**Résultat attendu** :

```text
MNISTClassifier(
  (fc1): Linear(in_features=784, out_features=128, bias=True)
  (fc2): Linear(in_features=128, out_features=64, bias=True)
  (fc3): Linear(in_features=64, out_features=10, bias=True)
  (relu): ReLU()
  (dropout): Dropout(p=0.2, inplace=False)
)

Nombre total de paramètres : 109,386

Entrée shape : torch.Size([4, 784])
Sortie shape : torch.Size([4, 10])
Sortie (logits) :
tensor([[ 0.0234, -0.1123,  0.0456, ...],
        ...], grad_fn=<AddmmBackward0>)
```

---

### Étape 4 : Charger MNIST avec DataLoader

```python
import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Définir les transformations appliquées aux images
transform = transforms.Compose([
    transforms.ToTensor(),           # Convertit l'image PIL en tenseur [0, 1]
    transforms.Normalize((0.1307,), (0.3081,))  # Normalise avec moyenne et écart-type de MNIST
])

# Télécharger et charger MNIST
train_dataset = datasets.MNIST(
    root="./data",          # Dossier de stockage
    train=True,             # Données d'entraînement
    download=True,          # Télécharger si absent
    transform=transform     # Appliquer les transformations
)

test_dataset = datasets.MNIST(
    root="./data",
    train=False,
    download=True,
    transform=transform
)

# Créer les DataLoaders
train_loader = DataLoader(
    train_dataset,
    batch_size=64,          # 64 images par batch
    shuffle=True            # Mélanger à chaque époque
)

test_loader = DataLoader(
    test_dataset,
    batch_size=1000,        # Batch plus grand pour l'évaluation (pas de gradients)
    shuffle=False           # Pas besoin de mélanger pour le test
)

# Vérifier les dimensions
images, labels = next(iter(train_loader))
print(f"Batch d'images shape : {images.shape}")    # (64, 1, 28, 28)
print(f"Batch de labels shape : {labels.shape}")    # (64,)
print(f"Valeurs des labels : {labels[:10]}")
print(f"Nombre de batches d'entraînement : {len(train_loader)}")
print(f"Nombre de batches de test : {len(test_loader)}")
```

**Résultat attendu** :

```text
Batch d'images shape : torch.Size([64, 1, 28, 28])
Batch de labels shape : torch.Size([64])
Valeurs des labels : tensor([3, 1, 7, 0, 4, 9, 2, 6, 5, 8])
Nombre de batches d'entraînement : 938
Nombre de batches de test : 10
```

---

### Étape 5 : Écrire le training loop complet

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# --- Préparation ---

# Device : GPU si disponible, sinon CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device : {device}")

# Données
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

train_dataset = datasets.MNIST("./data", train=True, download=True, transform=transform)
test_dataset = datasets.MNIST("./data", train=False, download=True, transform=transform)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=1000, shuffle=False)

# Modèle
class MNISTClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 10)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(p=0.2)

    def forward(self, x):
        # Aplatir l'image 28x28 en vecteur de 784
        x = x.view(x.size(0), -1)
        x = self.dropout(self.relu(self.fc1(x)))
        x = self.dropout(self.relu(self.fc2(x)))
        x = self.fc3(x)
        return x

model = MNISTClassifier().to(device)  # Envoyer le modèle sur le device

# Loss et optimiseur
criterion = nn.CrossEntropyLoss()      # Loss pour classification multi-classes
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# --- Fonction d'entraînement pour une époque ---

def train_one_epoch(model, train_loader, criterion, optimizer, device):
    model.train()            # Mode entraînement (active le dropout)
    total_loss = 0
    correct = 0
    total = 0

    for batch_idx, (images, labels) in enumerate(train_loader):
        # Envoyer les données sur le device
        images, labels = images.to(device), labels.to(device)

        # 1. Forward pass
        outputs = model(images)

        # 2. Calcul de la loss
        loss = criterion(outputs, labels)

        # 3. Backpropagation
        loss.backward()

        # 4. Mise à jour des poids
        optimizer.step()

        # 5. Remettre les gradients à zéro
        optimizer.zero_grad()

        # Statistiques
        total_loss += loss.item()
        _, predicted = outputs.max(1)    # Classe avec le score le plus élevé
        correct += predicted.eq(labels).sum().item()
        total += labels.size(0)

    avg_loss = total_loss / len(train_loader)
    accuracy = correct / total
    return avg_loss, accuracy

# --- Fonction d'évaluation ---

def evaluate(model, test_loader, criterion, device):
    model.eval()             # Mode évaluation (désactive le dropout)
    total_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():   # Pas besoin de calculer les gradients
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            _, predicted = outputs.max(1)
            correct += predicted.eq(labels).sum().item()
            total += labels.size(0)

    avg_loss = total_loss / len(test_loader)
    accuracy = correct / total
    return avg_loss, accuracy

# --- Boucle d'entraînement ---

num_epochs = 5

for epoch in range(num_epochs):
    train_loss, train_acc = train_one_epoch(
        model, train_loader, criterion, optimizer, device
    )
    test_loss, test_acc = evaluate(
        model, test_loader, criterion, device
    )
    print(
        f"Époque {epoch+1}/{num_epochs} | "
        f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2%} | "
        f"Test Loss: {test_loss:.4f} | Test Acc: {test_acc:.2%}"
    )
```

**Résultat attendu** :

```text
Device : cpu
Époque 1/5 | Train Loss: 0.3521 | Train Acc: 89.72% | Test Loss: 0.1234 | Test Acc: 96.42%
Époque 2/5 | Train Loss: 0.1543 | Train Acc: 95.42% | Test Loss: 0.0987 | Test Acc: 97.01%
Époque 3/5 | Train Loss: 0.1123 | Train Acc: 96.63% | Test Loss: 0.0856 | Test Acc: 97.34%
Époque 4/5 | Train Loss: 0.0912 | Train Acc: 97.21% | Test Loss: 0.0798 | Test Acc: 97.52%
Époque 5/5 | Train Loss: 0.0756 | Train Acc: 97.68% | Test Loss: 0.0734 | Test Acc: 97.78%
```

---

### Étape 6 : Sauvegarder et charger le modèle

```python
import torch

# --- Sauvegarder les poids (méthode recommandée) ---

# Sauvegarder le state_dict (dictionnaire des poids)
torch.save(model.state_dict(), "mnist_model.pth")
print("Modèle sauvegardé dans mnist_model.pth")

# Vérifier la taille du fichier
import os
size_mb = os.path.getsize("mnist_model.pth") / (1024 * 1024)
print(f"Taille du fichier : {size_mb:.2f} Mo")

# --- Charger les poids ---

# Recréer le modèle (même architecture)
loaded_model = MNISTClassifier()

# Charger les poids sauvegardés
loaded_model.load_state_dict(torch.load("mnist_model.pth", weights_only=True))
loaded_model.to(device)

# Vérifier que le modèle chargé fonctionne
test_loss, test_acc = evaluate(loaded_model, test_loader, criterion, device)
print(f"\nModèle chargé - Test Acc: {test_acc:.2%}")

# --- Sauvegarder un checkpoint complet (pour reprendre l'entraînement) ---

checkpoint = {
    "epoch": num_epochs,
    "model_state_dict": model.state_dict(),
    "optimizer_state_dict": optimizer.state_dict(),
    "train_loss": train_loss,
    "test_acc": test_acc,
}
torch.save(checkpoint, "mnist_checkpoint.pth")
print("Checkpoint sauvegardé")

# --- Charger un checkpoint ---

checkpoint = torch.load("mnist_checkpoint.pth", weights_only=False)
model.load_state_dict(checkpoint["model_state_dict"])
optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
start_epoch = checkpoint["epoch"]
print(f"Checkpoint chargé - Reprendre à l'époque {start_epoch + 1}")
```

**Résultat attendu** :

```text
Modèle sauvegardé dans mnist_model.pth
Taille du fichier : 0.42 Mo

Modèle chargé - Test Acc: 97.78%
Checkpoint sauvegardé
Checkpoint chargé - Reprendre à l'époque 6
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `torch.tensor([1, 2, 3])` | Crée un tenseur depuis une liste |
| `torch.zeros(3, 4)` | Crée un tenseur de zéros (3x4) |
| `torch.randn(3, 4)` | Crée un tenseur aléatoire (distribution normale) |
| `tensor.to("cuda")` | Envoie le tenseur sur GPU |
| `tensor.requires_grad_(True)` | Active le suivi des gradients |
| `loss.backward()` | Calcule les gradients par backpropagation |
| `optimizer.step()` | Met à jour les poids avec les gradients |
| `optimizer.zero_grad()` | Remet les gradients à zéro |
| `model.train()` | Active le mode entraînement (dropout actif) |
| `model.eval()` | Active le mode évaluation (dropout inactif) |
| `torch.no_grad()` | Désactive le calcul des gradients (évaluation) |
| `torch.save(obj, path)` | Sauvegarde un objet sur le disque |
| `torch.load(path)` | Charge un objet depuis le disque |
| `model.state_dict()` | Renvoie le dictionnaire des poids |
| `model.load_state_dict(d)` | Charge un dictionnaire de poids |

---

## Pièges Fréquents

### Piège 1 : Oublier optimizer.zero_grad()

⚠️ **Problème** : Les gradients s'accumulent par défaut dans PyTorch. Si tu oublies `zero_grad()`, les gradients du batch actuel s'ajoutent à ceux du batch précédent. L'entraînement diverge.

✅ **Solution** : Appelle `optimizer.zero_grad()` une fois par batch, avant ou après `optimizer.step()` :

```python
# Pattern correct
for images, labels in train_loader:
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()   # Remet les gradients à zéro
```

---

### Piège 2 : Oublier model.eval() pendant l'évaluation

⚠️ **Problème** : En mode `.train()`, le dropout désactive aléatoirement des neurones et la batch normalization utilise les statistiques du batch. Les résultats d'évaluation sont instables et sous-estimés.

✅ **Solution** : Toujours appeler `model.eval()` avant l'évaluation et `model.train()` avant l'entraînement :

```python
# Évaluation
model.eval()
with torch.no_grad():
    # Remplacer par ton code d'évaluation (sortie du modèle, métriques, etc.)
    pass

# Reprendre l'entraînement
model.train()
```

---

### Piège 3 : Ne pas envoyer les données sur le même device que le modèle

⚠️ **Problème** : Si le modèle est sur GPU (`cuda`) et les données sur CPU, PyTorch lance une erreur `RuntimeError: Expected all tensors to be on the same device`.

✅ **Solution** : Envoie toujours les données et le modèle sur le même device :

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

for images, labels in train_loader:
    images = images.to(device)     # Envoyer sur le même device
    labels = labels.to(device)
    outputs = model(images)
```

---

### Piège 4 : Utiliser torch.save(model) au lieu de state_dict

⚠️ **Problème** : `torch.save(model, path)` sérialise le modèle complet avec pickle, y compris le code Python. Si tu modifies la classe du modèle ou déplaces le fichier, le chargement échoue.

✅ **Solution** : Sauvegarde toujours le `state_dict` :

```python
# Correct : portable et robuste
torch.save(model.state_dict(), "model.pth")

# Chargement
model = MNISTClassifier()
model.load_state_dict(torch.load("model.pth", weights_only=True))
```

---

## Checklist de Validation

- [ ] Je sais créer des tenseurs PyTorch et les manipuler (opérations, reshape, device)
- [ ] Je comprends l'autograd : `requires_grad`, `.backward()`, `.grad`
- [ ] Je sais définir un modèle avec `nn.Module` (`__init__` + `forward`)
- [ ] Je sais utiliser `DataLoader` pour charger des données par batch
- [ ] Je connais les 5 étapes du training loop (forward, loss, backward, step, zero_grad)
- [ ] Je sais sauvegarder et charger un modèle avec `state_dict`
- [ ] Mon modèle MNIST atteint plus de 95% d'accuracy

---

## Exercice Pratique

**Énoncé** : Entraîne un classificateur MNIST en PyTorch avec un réseau fully-connected qui atteint plus de 97% d'accuracy sur le jeu de test. Le réseau doit utiliser au moins 2 couches cachées, du dropout, et l'optimiseur Adam.

**Indications** :

- Architecture suggérée : 784 -> 256 (ReLU, Dropout 0.2) -> 128 (ReLU, Dropout 0.2) -> 10
- Utilise `nn.CrossEntropyLoss` comme loss
- Utilise `torch.optim.Adam` avec `lr=0.001`
- Entraîne pendant 10 époques
- Affiche la loss et l'accuracy à chaque époque (train et test)
- Sauvegarde le meilleur modèle (celui avec la meilleure accuracy test)

**Résultat attendu** : Le modèle atteint au moins 97.5% d'accuracy sur le jeu de test après 10 époques.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# --- Configuration ---

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device : {device}")

# --- Données ---

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

train_dataset = datasets.MNIST("./data", train=True, download=True, transform=transform)
test_dataset = datasets.MNIST("./data", train=False, download=True, transform=transform)

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=1000, shuffle=False)

# --- Modèle ---

class MNISTNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Flatten(),              # (batch, 1, 28, 28) -> (batch, 784)
            nn.Linear(784, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 10),
        )

    def forward(self, x):
        return self.network(x)

model = MNISTNet().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# --- Fonctions d'entraînement et d'évaluation ---

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

# --- Entraînement avec sauvegarde du meilleur modèle ---

best_test_acc = 0.0
num_epochs = 10

for epoch in range(num_epochs):
    train_loss, train_acc = train_one_epoch(
        model, train_loader, criterion, optimizer, device
    )
    test_loss, test_acc = evaluate(
        model, test_loader, criterion, device
    )

    # Sauvegarder si meilleur modèle
    if test_acc > best_test_acc:
        best_test_acc = test_acc
        torch.save(model.state_dict(), "best_mnist_model.pth")

    print(
        f"Époque {epoch+1:2d}/{num_epochs} | "
        f"Train: {train_loss:.4f} / {train_acc:.2%} | "
        f"Test: {test_loss:.4f} / {test_acc:.2%}"
        f"{' *' if test_acc == best_test_acc else ''}"
    )

print(f"\nMeilleure accuracy test : {best_test_acc:.2%}")
```

**Résultat attendu** :

```text
Device : cpu
Époque  1/10 | Train: 0.3245 / 90.45% | Test: 0.1312 / 96.12% *
Époque  2/10 | Train: 0.1456 / 95.67% | Test: 0.0945 / 97.23% *
Époque  3/10 | Train: 0.1078 / 96.78% | Test: 0.0823 / 97.45% *
Époque  4/10 | Train: 0.0867 / 97.34% | Test: 0.0756 / 97.67% *
Époque  5/10 | Train: 0.0723 / 97.78% | Test: 0.0712 / 97.82% *
Époque  6/10 | Train: 0.0612 / 98.12% | Test: 0.0698 / 97.89% *
Époque  7/10 | Train: 0.0534 / 98.34% | Test: 0.0687 / 97.91% *
Époque  8/10 | Train: 0.0478 / 98.56% | Test: 0.0701 / 97.85%
Époque  9/10 | Train: 0.0423 / 98.67% | Test: 0.0695 / 97.93% *
Époque 10/10 | Train: 0.0389 / 98.78% | Test: 0.0712 / 97.88%

Meilleure accuracy test : 97.93%
```

---

## Navigation

← Fiche précédente : **[01 - Réseaux de neurones : théorie et pratique](01-reseaux-neurones-theorie-pratique.md)**

→ Fiche suivante : **[03 - Réseaux convolutifs (CNN)](03-reseaux-convolutifs-cnn.md)**
