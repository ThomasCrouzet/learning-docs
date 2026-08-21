---
tags:
  - IA
  - Intermédiaire
  - Concept
  - Pratique
description: "Réseaux récurrents et séquences : RNN, LSTM, GRU, Seq2Seq et mécanisme d'attention de Bahdanau"
estimated_time: "50 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 4 - Deep learning fondamental"
id: "ai.artificial-intelligence.deep-learning.reseaux-recurrents-sequences"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.deep-learning"
content_type: "lesson"
order: 4
---

# 04 - Réseaux récurrents et séquences

> **En bref** : À la fin de cette fiche, tu sauras expliquer pourquoi les données séquentielles nécessitent des architectures spéciales, comprendre le fonctionnement des RNN, LSTM et GRU, implémenter un modèle LSTM en PyTorch pour la prédiction de séries temporelles, et comprendre le mécanisme d'attention de Bahdanau. Lecture estimée : 50 min.


## Prérequis

- [Fiche 02 - PyTorch](02-pytorch.md) (tenseurs, autograd, nn.Module, DataLoader, training loop)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi les données séquentielles nécessitent des architectures spéciales, comprendre le fonctionnement des RNN, LSTM et GRU, implémenter un modèle LSTM en PyTorch pour la prédiction de séries temporelles, et comprendre le mécanisme d'attention de Bahdanau.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que des données séquentielles ?

**Définition** : Les données séquentielles sont des données où l'ordre des éléments est important. Chaque élément dépend des éléments précédents. Exemples : texte (chaque mot dépend des mots précédents), séries temporelles (le cours d'une action dépend de son historique), audio (chaque échantillon sonore dépend des précédents).

**Le problème que les données séquentielles posent** :

Sans architecture spécialisée, voici les problèmes rencontrés :

1. **Perte de l'ordre** : un réseau fully-connected ou un CNN traite les entrées de façon indépendante. "Le chat mange la souris" et "La souris mange le chat" produiraient la même sortie.
2. **Taille variable** : les séquences n'ont pas toutes la même longueur. Un réseau FC attend une entrée de taille fixe.
3. **Pas de mémoire** : un réseau FC ne se souvient pas de ce qu'il a vu aux pas de temps précédents.

**Comment les réseaux récurrents résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Perte de l'ordre | Le réseau traite les éléments un par un, dans l'ordre de la séquence |
| Taille variable | Le même réseau traite des séquences de n'importe quelle longueur |
| Pas de mémoire | Le hidden state transporte l'information des pas de temps précédents |

**Exemples de tâches séquentielles** :

| Tâche | Entrée | Sortie |
| ----- | ------ | ------ |
| Prédiction de séries temporelles | Historique de valeurs | Valeur future |
| Traduction automatique | Phrase en français | Phrase en anglais |
| Génération de texte | Début de phrase | Suite de la phrase |
| Reconnaissance vocale | Signal audio | Transcription texte |
| Analyse de sentiment | Texte d'un avis | Positif / Négatif |

---

### Qu'est-ce qu'un RNN vanilla ?

**Définition** : Un RNN (Recurrent Neural Network) vanilla est un réseau de neurones qui possède une boucle temporelle : à chaque pas de temps, il prend en entrée un élément de la séquence et un état caché (hidden state) provenant du pas de temps précédent. Il produit en sortie un nouvel état caché qui résume tout ce qu'il a vu jusqu'ici.

**Le problème que le RNN résout** :

Sans RNN, voici les problèmes rencontrés :

1. **Pas de contexte temporel** : chaque entrée est traitée indépendamment
2. **Pas de mémoire partagée** : impossible de transmettre de l'information d'un pas de temps au suivant
3. **Taille d'entrée fixe** : un réseau FC ne peut pas traiter des séquences de longueur variable

**Comment le RNN résout ces problèmes** :

| Problème | Solution apportée par le RNN |
| -------- | ---------------------------- |
| Pas de contexte temporel | Le hidden state accumule l'information des pas de temps précédents |
| Pas de mémoire partagée | Le même hidden state est passé de pas en pas |
| Taille d'entrée fixe | La boucle temporelle s'exécute autant de fois qu'il y a d'éléments dans la séquence |

**Analogie concrète** : Le RNN est comme un lecteur qui lit un livre mot par mot. À chaque mot, il met à jour son résumé mental (hidden state) de ce qu'il a lu jusqu'ici. Quand il arrive au dernier mot, son résumé mental contient (en théorie) l'essentiel de tout le livre. Il n'a pas besoin de relire le livre pour répondre à une question.

**Formule du RNN vanilla** :

```text
h_t = tanh(W_hh @ h_{t-1} + W_xh @ x_t + b_h)
y_t = W_hy @ h_t + b_y
```

Avec :

- `x_t` : entrée au pas de temps t
- `h_{t-1}` : hidden state du pas de temps précédent
- `h_t` : nouveau hidden state
- `W_hh`, `W_xh`, `W_hy` : matrices de poids (partagées à chaque pas de temps)
- `y_t` : sortie au pas de temps t

**Ce que le RNN vanilla n'est PAS** :

- Le RNN n'est pas efficace pour les longues séquences. En pratique, le hidden state "oublie" les informations anciennes à cause du vanishing gradient problem.
- Le RNN n'est pas parallélisable. Chaque pas de temps dépend du précédent, ce qui empêche le calcul en parallèle.

**Le problème du vanishing gradient** :

Quand la séquence est longue (>20 pas de temps), les gradients deviennent exponentiellement petits en remontant dans le temps. Résultat : le réseau ne peut pas apprendre de dépendances à long terme. Par exemple, dans la phrase "Les nuages qui s'étaient accumulés depuis le matin au-dessus de la ville grondaient", le RNN vanilla ne peut pas relier "nuages" à "grondaient" car ils sont trop éloignés.

---

### Qu'est-ce qu'un LSTM ?

**Définition** : Le LSTM (Long Short-Term Memory) est une variante de RNN qui résout le problème du vanishing gradient grâce à un mécanisme de portes (gates). Il maintient deux états : le hidden state (mémoire à court terme) et le cell state (mémoire à long terme).

**Le problème que le LSTM résout** :

Sans LSTM, voici les problèmes rencontrés :

1. **Vanishing gradient** : le RNN vanilla ne peut pas apprendre de dépendances à long terme
2. **Pas de contrôle de la mémoire** : le RNN vanilla écrase systématiquement son hidden state, sans pouvoir choisir quoi garder et quoi oublier
3. **Information non sélective** : toute l'information est mélangée dans un seul vecteur

**Comment le LSTM résout ces problèmes** :

| Problème | Solution apportée par le LSTM |
| -------- | ----------------------------- |
| Vanishing gradient | Le cell state transporte l'information sur de longues distances grâce à un chemin de gradient direct |
| Pas de contrôle de la mémoire | Trois portes (forget, input, output) contrôlent ce qui est oublié, ajouté et lu |
| Information non sélective | Chaque porte filtre sélectivement l'information |

**Analogie concrète** : Le LSTM est comme un carnet de notes avec trois types de surligneurs. Le forget gate est un surligneur rouge qui marque les informations à effacer (elles ne sont plus pertinentes). L'input gate est un surligneur vert qui marque les nouvelles informations à ajouter. L'output gate est un surligneur bleu qui marque les informations à utiliser maintenant. Le carnet lui-même est le cell state : il conserve les notes importantes sur le long terme.

**Ce que le LSTM n'est PAS** :

- Le LSTM n'est pas une solution au problème de parallélisation. Il traite toujours les éléments un par un dans l'ordre. Pour le parallélisme, il faut un Transformer (Phase 5).
- Le LSTM n'est pas toujours meilleur que le RNN vanilla. Pour des séquences courtes (<10 pas de temps), un RNN vanilla peut suffire.

**Les trois portes du LSTM** :

| Porte | Rôle | Formule simplifiée |
| ----- | ---- | ------------------ |
| Forget gate (f_t) | Décide quoi oublier du cell state | f_t = sigmoid(W_f @ [h_{t-1}, x_t]) |
| Input gate (i_t) | Décide quoi ajouter au cell state | i_t = sigmoid(W_i @ [h_{t-1}, x_t]) |
| Output gate (o_t) | Décide quoi sortir du cell state | o_t = sigmoid(W_o @ [h_{t-1}, x_t]) |

**Mise à jour du cell state et du hidden state** :

```text
f_t = sigmoid(W_f @ [h_{t-1}, x_t] + b_f)       # Forget gate
i_t = sigmoid(W_i @ [h_{t-1}, x_t] + b_i)       # Input gate
c_tilde = tanh(W_c @ [h_{t-1}, x_t] + b_c)      # Candidat pour le cell state
c_t = f_t * c_{t-1} + i_t * c_tilde              # Nouveau cell state
o_t = sigmoid(W_o @ [h_{t-1}, x_t] + b_o)       # Output gate
h_t = o_t * tanh(c_t)                             # Nouveau hidden state
```

---

### Qu'est-ce qu'un GRU ?

**Définition** : Le GRU (Gated Recurrent Unit) est une variante simplifiée du LSTM qui fusionne le cell state et le hidden state en un seul vecteur, et utilise deux portes au lieu de trois (reset gate et update gate).

**Comparaison LSTM vs GRU** :

| LSTM | GRU |
| ---- | --- |
| 3 portes (forget, input, output) | 2 portes (reset, update) |
| 2 états (cell state + hidden state) | 1 état (hidden state uniquement) |
| Plus de paramètres | Moins de paramètres (entraînement plus rapide) |
| Meilleur pour les très longues séquences | Suffisant pour la plupart des tâches |
| Plus lent à entraîner | Plus rapide à entraîner |

**Les deux portes du GRU** :

| Porte | Rôle | Equivalent LSTM |
| ----- | ---- | --------------- |
| Reset gate (r_t) | Contrôle combien du passé est oublié | Combine forget + input |
| Update gate (z_t) | Contrôle combien du nouveau est intégré | Combine forget + input |

**Quand utiliser LSTM vs GRU** :

- **LSTM** : séquences très longues (>100 pas de temps), besoin de mémoire à très long terme
- **GRU** : séquences courtes à moyennes, quand la vitesse d'entraînement est importante, ou quand les données sont limitées (moins de paramètres = moins d'overfitting)

---

### Qu'est-ce que le Seq2Seq ?

**Définition** : Seq2Seq (Séquence to Séquence) est une architecture composée de deux réseaux récurrents : un encodeur qui lit la séquence d'entrée et produit un vecteur contexte, et un décodeur qui génère la séquence de sortie à partir de ce vecteur contexte.

**Le problème que le Seq2Seq résout** :

Sans Seq2Seq, voici les problèmes rencontrés :

1. **Taille de sortie différente de l'entrée** : un RNN simple produit une sortie à chaque pas de temps. Pour la traduction, la phrase de sortie n'a pas la même longueur que la phrase d'entrée.
2. **Pas de séparation lecture/écriture** : le réseau doit lire toute l'entrée avant de commencer à produire la sortie.

**Comment Seq2Seq résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Taille de sortie variable | Le décodeur génère des tokens jusqu'à produire un token de fin |
| Pas de séparation lecture/écriture | L'encodeur lit toute l'entrée, puis le décodeur génère la sortie |

**Analogie concrète** : Seq2Seq fonctionne comme un interprète simultané. L'encodeur est l'oreille de l'interprète : il écoute la phrase complète en français et la résume mentalement (vecteur contexte). Le décodeur est la bouche de l'interprète : il produit la traduction en anglais mot par mot, en se basant sur le résumé mental.

**Ce que le Seq2Seq n'est PAS** :

- Seq2Seq n'est pas limité à la traduction. Il s'applique à toute tâche de transformation de séquence : résumé, question-réponse, chatbot.

**Limitation du Seq2Seq de base** : Toute l'information de la séquence d'entrée est compressée dans un seul vecteur (le dernier hidden state de l'encodeur). Pour les séquences longues, ce vecteur ne peut pas contenir toute l'information. C'est le problème du goulot d'étranglement (bottleneck).

---

### Qu'est-ce que l'attention de Bahdanau ?

**Définition** : L'attention de Bahdanau est un mécanisme qui permet au décodeur d'accéder directement à tous les hidden states de l'encodeur (pas seulement le dernier). À chaque pas de décodage, le mécanisme calcule un score d'alignement entre l'état du décodeur et chaque hidden state de l'encodeur, puis produit un vecteur contexte pondéré.

**Le problème que l'attention résout** :

Sans attention, voici les problèmes rencontrés :

1. **Bottleneck** : toute l'information est compressée dans un seul vecteur de taille fixe
2. **Perte d'information** : les informations du début de la séquence sont oubliées
3. **Pas d'alignement** : le décodeur ne sait pas quelle partie de l'entrée est pertinente pour le mot qu'il génère

**Comment l'attention résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Bottleneck | Le décodeur accède à tous les hidden states, pas seulement au dernier |
| Perte d'information | Chaque hidden state de l'encodeur est conservé et accessible |
| Pas d'alignement | Les scores d'attention indiquent quelle partie de l'entrée est pertinente |

**Analogie concrète** : L'attention est comme un étudiant qui prend des notes pendant un cours (encodeur) et qui ensuite écrit un résumé (décodeur). Sans attention, l'étudiant jette ses notes et écrit le résumé de mémoire. Avec attention, l'étudiant peut relire ses notes à tout moment et se concentrer sur les passages les plus pertinents pour chaque section du résumé.

**Ce que l'attention n'est PAS** :

- L'attention de Bahdanau n'est pas la self-attention des Transformers. L'attention de Bahdanau relie le décodeur à l'encodeur. La self-attention relie chaque élément d'une séquence à tous les autres éléments de la même séquence.

**Étapes du mécanisme d'attention** :

```text
Pour chaque pas de décodage t :
  1. Calculer les scores d'alignement :
     e_{t,i} = score(s_{t-1}, h_i) pour chaque hidden state h_i de l'encodeur
  2. Normaliser les scores avec softmax :
     a_{t,i} = softmax(e_{t,i})
  3. Calculer le vecteur contexte :
     c_t = somme(a_{t,i} * h_i)
  4. Combiner contexte et hidden state du décodeur :
     s_t = RNN(s_{t-1}, [y_{t-1}, c_t])
```

---

## Étapes Pratiques

### Étape 1 : Générer des données sinusoïdales

On crée un dataset synthétique de séries temporelles sinusoïdales.

```python
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
import matplotlib.pyplot as plt

# --- Génération de données sinusoïdales ---

def generate_sine_data(n_samples=1000, seq_length=50, pred_length=10):
    """
    Génère des séquences sinusoïdales.
    Entrée : seq_length pas de temps
    Sortie : pred_length pas de temps suivants
    """
    X = []  # Séquences d'entrée
    y = []  # Séquences de sortie (à prédire)

    for _ in range(n_samples):
        # Paramètres aléatoires pour chaque séquence
        freq = np.random.uniform(0.5, 2.0)        # Fréquence
        phase = np.random.uniform(0, 2 * np.pi)   # Phase
        amplitude = np.random.uniform(0.5, 1.5)   # Amplitude

        # Générer la séquence complète
        total_length = seq_length + pred_length
        t = np.linspace(0, 4 * np.pi, total_length)
        signal = amplitude * np.sin(freq * t + phase)

        # Séparer entrée et sortie
        X.append(signal[:seq_length])
        y.append(signal[seq_length:])

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)

# Générer les données
X_train, y_train = generate_sine_data(n_samples=2000, seq_length=50, pred_length=10)
X_test, y_test = generate_sine_data(n_samples=400, seq_length=50, pred_length=10)

print(f"X_train shape : {X_train.shape}")    # (2000, 50)
print(f"y_train shape : {y_train.shape}")    # (2000, 10)

# Visualiser un exemple
plt.figure(figsize=(12, 4))
idx = 0
full_seq = np.concatenate([X_train[idx], y_train[idx]])
plt.plot(range(50), X_train[idx], "b-", label="Entrée (50 pas)")
plt.plot(range(50, 60), y_train[idx], "r--", label="À prédire (10 pas)")
plt.axvline(x=49, color="gray", linestyle=":", alpha=0.5)
plt.legend()
plt.title("Exemple de séquence sinusoïdale")
plt.xlabel("Pas de temps")
plt.ylabel("Valeur")
plt.grid(True, alpha=0.3)
plt.savefig("sine_example.png", dpi=100)
plt.show()
```

**Résultat attendu** :

```text
X_train shape : (2000, 50)
y_train shape : (2000, 10)
```

Un graphique montrant une sinusoïde bleue (entrée) suivie d'une sinusoïde rouge en pointillés (à prédire).

---

### Étape 2 : Créer un Dataset custom et un DataLoader

```python
import torch
from torch.utils.data import Dataset, DataLoader

class TimeSeriesDataset(Dataset):
    def __init__(self, X, y):
        # Ajouter une dimension pour les features : (n, seq_len) -> (n, seq_len, 1)
        # LSTM attend l'entrée au format (batch, seq_len, input_size)
        self.X = torch.tensor(X).unsqueeze(-1)   # (n, 50, 1)
        self.y = torch.tensor(y)                   # (n, 10)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# Créer les datasets
train_dataset = TimeSeriesDataset(X_train, y_train)
test_dataset = TimeSeriesDataset(X_test, y_test)

# Créer les DataLoaders
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

# Vérifier les dimensions
x_batch, y_batch = next(iter(train_loader))
print(f"Batch X shape : {x_batch.shape}")    # (64, 50, 1)
print(f"Batch y shape : {y_batch.shape}")    # (64, 10)
```

**Résultat attendu** :

```text
Batch X shape : torch.Size([64, 50, 1])
Batch y shape : torch.Size([64, 10])
```

---

### Étape 3 : Définir le modèle LSTM

```python
import torch
import torch.nn as nn

class LSTMPredictor(nn.Module):
    def __init__(self, input_size=1, hidden_size=64, num_layers=2,
                 output_size=10, dropout=0.2):
        super().__init__()

        self.hidden_size = hidden_size
        self.num_layers = num_layers

        # Couche LSTM
        # input_size : nombre de features par pas de temps (1 pour une série univariée)
        # hidden_size : taille du hidden state
        # num_layers : nombre de couches LSTM empilées
        # batch_first : True signifie que l'entrée est (batch, seq_len, input_size)
        # dropout : dropout entre les couches LSTM (sauf la dernière)
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )

        # Couche fully-connected pour la prédiction
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Linear(32, output_size)   # Prédire output_size pas de temps
        )

    def forward(self, x):
        # x shape : (batch, seq_len, input_size)

        # LSTM renvoie :
        # output : (batch, seq_len, hidden_size) - tous les hidden states
        # (h_n, c_n) : hidden state et cell state du dernier pas de temps
        lstm_out, (h_n, c_n) = self.lstm(x)

        # Prendre uniquement le hidden state du dernier pas de temps
        # h_n shape : (num_layers, batch, hidden_size)
        # On prend la dernière couche : h_n[-1] -> (batch, hidden_size)
        last_hidden = h_n[-1]

        # Prédiction
        output = self.fc(last_hidden)    # (batch, output_size)
        return output

# Créer le modèle
model = LSTMPredictor(
    input_size=1,
    hidden_size=64,
    num_layers=2,
    output_size=10,
    dropout=0.2
)

# Compter les paramètres
total_params = sum(p.numel() for p in model.parameters())
print(f"Architecture :\n{model}")
print(f"\nNombre de paramètres : {total_params:,}")

# Test avec un batch
x_test_batch = torch.randn(4, 50, 1)    # Batch de 4 séquences
output = model(x_test_batch)
print(f"\nEntrée shape : {x_test_batch.shape}")
print(f"Sortie shape : {output.shape}")
```

**Résultat attendu** :

```text
Architecture :
LSTMPredictor(
  (lstm): LSTM(1, 64, num_layers=2, batch_first=True, dropout=0.2)
  (fc): Sequential(
    (0): Linear(in_features=64, out_features=32, bias=True)
    (1): ReLU()
    (2): Linear(in_features=32, out_features=10, bias=True)
  )
)

Nombre de paramètres : 52,842

Entrée shape : torch.Size([4, 50, 1])
Sortie shape : torch.Size([4, 10])
```

---

### Étape 4 : Entraîner le LSTM

```python
import torch
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = LSTMPredictor(input_size=1, hidden_size=64, num_layers=2,
                       output_size=10, dropout=0.2).to(device)

criterion = nn.MSELoss()        # Mean Squared Error pour la régression
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode="min", factor=0.5, patience=5
)

# --- Boucle d'entraînement ---
num_epochs = 50
best_test_loss = float("inf")

for epoch in range(num_epochs):
    # Entraînement
    model.train()
    train_loss = 0

    for x_batch, y_batch in train_loader:
        x_batch, y_batch = x_batch.to(device), y_batch.to(device)

        outputs = model(x_batch)
        loss = criterion(outputs, y_batch)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        train_loss += loss.item()

    train_loss /= len(train_loader)

    # Évaluation
    model.eval()
    test_loss = 0

    with torch.no_grad():
        for x_batch, y_batch in test_loader:
            x_batch, y_batch = x_batch.to(device), y_batch.to(device)
            outputs = model(x_batch)
            loss = criterion(outputs, y_batch)
            test_loss += loss.item()

    test_loss /= len(test_loader)

    # Scheduler
    scheduler.step(test_loss)

    # Sauvegarder le meilleur modèle
    if test_loss < best_test_loss:
        best_test_loss = test_loss
        torch.save(model.state_dict(), "best_lstm_sine.pth")

    if (epoch + 1) % 10 == 0:
        current_lr = optimizer.param_groups[0]["lr"]
        print(
            f"Époque {epoch+1:3d}/{num_epochs} | "
            f"LR: {current_lr:.6f} | "
            f"Train MSE: {train_loss:.6f} | "
            f"Test MSE: {test_loss:.6f}"
        )

print(f"\nMeilleur Test MSE : {best_test_loss:.6f}")
```

**Résultat attendu** :

```text
Époque  10/ 50 | LR: 0.001000 | Train MSE: 0.012345 | Test MSE: 0.015678
Époque  20/ 50 | LR: 0.001000 | Train MSE: 0.003456 | Test MSE: 0.005678
Époque  30/ 50 | LR: 0.000500 | Train MSE: 0.001234 | Test MSE: 0.002345
Époque  40/ 50 | LR: 0.000250 | Train MSE: 0.000678 | Test MSE: 0.001234
Époque  50/ 50 | LR: 0.000125 | Train MSE: 0.000456 | Test MSE: 0.000987

Meilleur Test MSE : 0.000987
```

---

### Étape 5 : Visualiser les prédictions

```python
import matplotlib.pyplot as plt
import torch
import numpy as np

# Charger le meilleur modèle
model.load_state_dict(torch.load("best_lstm_sine.pth", weights_only=True))
model.eval()

# Prédire sur quelques exemples du jeu de test
fig, axes = plt.subplots(2, 3, figsize=(15, 8))
axes = axes.flatten()

with torch.no_grad():
    for i in range(6):
        x_sample = test_dataset[i][0].unsqueeze(0).to(device)   # (1, 50, 1)
        y_true = test_dataset[i][1].numpy()                       # (10,)
        y_pred = model(x_sample).cpu().numpy().flatten()           # (10,)

        # Tracer la séquence complète
        x_input = test_dataset[i][0].numpy().flatten()

        axes[i].plot(range(50), x_input, "b-", label="Entrée")
        axes[i].plot(range(50, 60), y_true, "g-", linewidth=2, label="Réel")
        axes[i].plot(range(50, 60), y_pred, "r--", linewidth=2, label="Prédit")
        axes[i].axvline(x=49, color="gray", linestyle=":", alpha=0.5)
        axes[i].legend(fontsize=8)
        axes[i].set_title(f"Exemple {i+1}")
        axes[i].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("lstm_predictions.png", dpi=100)
plt.show()
print("Graphique sauvegardé dans lstm_predictions.png")
```

**Résultat attendu** : Un graphique 2x3 montrant 6 exemples. Pour chaque exemple, la courbe bleue (entrée), la courbe verte (valeur réelle) et la courbe rouge en pointillés (prédiction) sont superposées. Les prédictions devraient suivre de près les valeurs réelles.

---

### Étape 6 : Comparer RNN, LSTM et GRU

```python
import torch
import torch.nn as nn
import time

class RNNPredictor(nn.Module):
    """RNN vanilla pour comparaison."""
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, output_size=10):
        super().__init__()
        self.rnn = nn.RNN(input_size, hidden_size, num_layers,
                          batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 32), nn.ReLU(), nn.Linear(32, output_size)
        )

    def forward(self, x):
        output, h_n = self.rnn(x)
        return self.fc(h_n[-1])

class GRUPredictor(nn.Module):
    """GRU pour comparaison."""
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, output_size=10):
        super().__init__()
        self.gru = nn.GRU(input_size, hidden_size, num_layers,
                          batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 32), nn.ReLU(), nn.Linear(32, output_size)
        )

    def forward(self, x):
        output, h_n = self.gru(x)
        return self.fc(h_n[-1])

# Comparer les architectures
architectures = {
    "RNN": RNNPredictor(),
    "LSTM": LSTMPredictor(),
    "GRU": GRUPredictor(),
}

print(f"{'Architecture':<12} | {'Paramètres':>12} | {'Temps/époque':>14}")
print("-" * 45)

for name, arch_model in architectures.items():
    n_params = sum(p.numel() for p in arch_model.parameters())

    # Mesurer le temps d'une époque
    arch_model.train()
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(arch_model.parameters(), lr=0.001)

    start = time.time()
    for x_batch, y_batch in train_loader:
        outputs = arch_model(x_batch)
        loss = criterion(outputs, y_batch)
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
    elapsed = time.time() - start

    print(f"{name:<12} | {n_params:>12,} | {elapsed:>12.2f}s")
```

**Résultat attendu** :

```text
Architecture | Paramètres  | Temps/époque
---------------------------------------------
RNN          |      15,018 |         0.42s
LSTM         |      52,842 |         0.67s
GRU          |      40,234 |         0.58s
```

Le RNN a moins de paramètres et est plus rapide, mais il est moins performant sur les séquences longues. Le LSTM a le plus de paramètres. Le GRU est un bon compromis.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)` | Crée une couche LSTM |
| `nn.GRU(input_size, hidden_size, num_layers, batch_first=True)` | Crée une couche GRU |
| `nn.RNN(input_size, hidden_size, num_layers, batch_first=True)` | Crée une couche RNN vanilla |
| `output, (h_n, c_n) = lstm(x)` | Forward pass LSTM (output = tous les h, h_n = dernier h) |
| `output, h_n = gru(x)` | Forward pass GRU (pas de cell state) |
| `tensor.unsqueeze(-1)` | Ajoute une dimension (utile pour input_size=1) |
| `nn.MSELoss()` | Loss pour la régression (séries temporelles) |
| `ReduceLROnPlateau(optimizer, patience=5)` | Réduit le LR quand la loss stagne |

---

## Pièges Fréquents

### Piège 1 : Oublier batch_first=True

⚠️ **Problème** : Par défaut, les couches LSTM/GRU de PyTorch attendent l'entrée au format `(seq_len, batch, input_size)`. Si tu passes un tenseur `(batch, seq_len, input_size)` sans `batch_first=True`, les dimensions sont mélangées et les résultats sont incorrects (sans erreur).

✅ **Solution** : Utilise toujours `batch_first=True` pour des tenseurs au format `(batch, seq_len, input_size)` :

```python
# Correct
lstm = nn.LSTM(input_size=1, hidden_size=64, batch_first=True)
```

---

### Piège 2 : Utiliser tout l'output LSTM au lieu du dernier hidden state

⚠️ **Problème** : `lstm(x)` renvoie `output` (tous les hidden states) et `(h_n, c_n)` (dernier hidden state et cell state). Pour une tâche de prédiction (many-to-one), il faut utiliser `h_n[-1]`, pas `output`.

✅ **Solution** : Pour une tâche many-to-one (séquence en entrée, vecteur en sortie) :

```python
output, (h_n, c_n) = self.lstm(x)
# h_n[-1] : hidden state de la dernière couche, au dernier pas de temps
prediction = self.fc(h_n[-1])   # (batch, hidden_size) -> (batch, output_size)
```

---

### Piège 3 : Ne pas normaliser les données de séries temporelles

⚠️ **Problème** : Si les valeurs de la série temporelle sont très grandes (ex: cours boursier en milliers), les gradients peuvent exploser et l'entraînement diverge.

✅ **Solution** : Normalise les données avant de les passer au modèle :

```python
# Normalisation min-max sur les données d'entraînement
train_min = X_train.min()
train_max = X_train.max()
X_train_norm = (X_train - train_min) / (train_max - train_min)
X_test_norm = (X_test - train_min) / (train_max - train_min)  # Utilise les stats du train
```

---

### Piège 4 : Confondre num_layers et la profondeur du réseau

⚠️ **Problème** : `num_layers=2` dans `nn.LSTM` empile 2 couches LSTM. La sortie de la première couche est l'entrée de la deuxième. Ce n'est pas la même chose qu'ajouter des couches fully-connected après le LSTM.

✅ **Solution** : Commence avec `num_layers=1` ou `num_layers=2`. Au-delà de 3, les gains sont rares et le risque d'overfitting augmente.

---

## Checklist de Validation

- [ ] Je sais expliquer pourquoi les données séquentielles nécessitent une architecture spéciale
- [ ] Je comprends le fonctionnement du RNN vanilla et le problème du vanishing gradient
- [ ] Je sais expliquer les 3 portes du LSTM (forget, input, output)
- [ ] Je connais la différence entre LSTM et GRU
- [ ] Je comprends l'architecture Seq2Seq (encodeur-décodeur)
- [ ] Je sais expliquer le mécanisme d'attention de Bahdanau
- [ ] J'ai implémenté un LSTM pour la prédiction de séries temporelles

---

## Exercice Pratique

**Énoncé** : Implémente un modèle LSTM en PyTorch pour prédire les 10 prochains pas de temps d'une série temporelle sinusoïdale, à partir des 50 pas précédents. Compare les performances d'un RNN vanilla, d'un LSTM et d'un GRU en termes de MSE et de temps d'entraînement.

**Indications** :

- Génère 2000 séquences d'entraînement et 400 de test avec des sinusoïdes de paramètres aléatoires
- Architecture : 2 couches LSTM, hidden_size=64, dropout=0.2
- Loss : MSE (Mean Squared Error)
- Optimiseur : Adam avec lr=0.001
- Entraîne chaque modèle pendant 30 époques
- Affiche le MSE final sur le test pour chaque architecture
- Visualise les prédictions du meilleur modèle sur 4 exemples

**Résultat attendu** : Le LSTM et le GRU atteignent un MSE test inférieur à 0.005. Le RNN vanilla est moins performant.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import matplotlib.pyplot as plt
import time

# --- Génération des données ---

def generate_sine_data(n_samples, seq_length=50, pred_length=10):
    X, y = [], []
    for _ in range(n_samples):
        freq = np.random.uniform(0.5, 2.0)
        phase = np.random.uniform(0, 2 * np.pi)
        amplitude = np.random.uniform(0.5, 1.5)
        total_length = seq_length + pred_length
        t = np.linspace(0, 4 * np.pi, total_length)
        signal = amplitude * np.sin(freq * t + phase)
        X.append(signal[:seq_length])
        y.append(signal[seq_length:])
    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)

class TimeSeriesDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X).unsqueeze(-1)
        self.y = torch.tensor(y)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# Données
X_train, y_train = generate_sine_data(2000)
X_test, y_test = generate_sine_data(400)

train_dataset = TimeSeriesDataset(X_train, y_train)
test_dataset = TimeSeriesDataset(X_test, y_test)
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

# --- Modèles ---

class RNNModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.rnn = nn.RNN(1, 64, 2, batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(nn.Linear(64, 32), nn.ReLU(), nn.Linear(32, 10))

    def forward(self, x):
        _, h_n = self.rnn(x)
        return self.fc(h_n[-1])

class LSTMModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(1, 64, 2, batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(nn.Linear(64, 32), nn.ReLU(), nn.Linear(32, 10))

    def forward(self, x):
        _, (h_n, _) = self.lstm(x)
        return self.fc(h_n[-1])

class GRUModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.gru = nn.GRU(1, 64, 2, batch_first=True, dropout=0.2)
        self.fc = nn.Sequential(nn.Linear(64, 32), nn.ReLU(), nn.Linear(32, 10))

    def forward(self, x):
        _, h_n = self.gru(x)
        return self.fc(h_n[-1])

# --- Entraînement et comparaison ---

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
results = {}

for name, ModelClass in [("RNN", RNNModel), ("LSTM", LSTMModel), ("GRU", GRUModel)]:
    model = ModelClass().to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    start_time = time.time()

    # Entraînement
    for epoch in range(30):
        model.train()
        for x_batch, y_batch in train_loader:
            x_batch, y_batch = x_batch.to(device), y_batch.to(device)
            outputs = model(x_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()

    elapsed = time.time() - start_time

    # Évaluation
    model.eval()
    test_loss = 0
    with torch.no_grad():
        for x_batch, y_batch in test_loader:
            x_batch, y_batch = x_batch.to(device), y_batch.to(device)
            outputs = model(x_batch)
            test_loss += criterion(outputs, y_batch).item()
    test_loss /= len(test_loader)

    n_params = sum(p.numel() for p in model.parameters())
    results[name] = {"mse": test_loss, "time": elapsed, "params": n_params, "model": model}

    print(f"{name:5s} | Params: {n_params:>8,} | Test MSE: {test_loss:.6f} | Temps: {elapsed:.1f}s")

# --- Visualisation des prédictions du meilleur modèle ---

best_name = min(results, key=lambda k: results[k]["mse"])
best_model = results[best_name]["model"]
print(f"\nMeilleur modèle : {best_name}")

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes = axes.flatten()

best_model.eval()
with torch.no_grad():
    for i in range(4):
        x_sample = test_dataset[i][0].unsqueeze(0).to(device)
        y_true = test_dataset[i][1].numpy()
        y_pred = best_model(x_sample).cpu().numpy().flatten()
        x_input = test_dataset[i][0].numpy().flatten()

        axes[i].plot(range(50), x_input, "b-", label="Entrée")
        axes[i].plot(range(50, 60), y_true, "g-", linewidth=2, label="Réel")
        axes[i].plot(range(50, 60), y_pred, "r--", linewidth=2, label="Prédit")
        axes[i].axvline(x=49, color="gray", linestyle=":", alpha=0.5)
        axes[i].legend(fontsize=8)
        axes[i].set_title(f"Exemple {i+1}")
        axes[i].grid(True, alpha=0.3)

plt.suptitle(f"Prédictions {best_name}", fontsize=14)
plt.tight_layout()
plt.savefig("comparison_predictions.png", dpi=100)
plt.show()
```

**Résultat attendu** :

```text
RNN   | Params:   15,018 | Test MSE: 0.023456 | Temps: 12.3s
LSTM  | Params:   52,842 | Test MSE: 0.001234 | Temps: 19.8s
GRU   | Params:   40,234 | Test MSE: 0.001567 | Temps: 17.2s

Meilleur modèle : LSTM
```

Le LSTM et le GRU sont nettement meilleurs que le RNN vanilla. Le LSTM est légèrement meilleur que le GRU mais plus lent.

---

## Navigation

← Fiche précédente : **[03 - Réseaux convolutifs (CNN)](03-reseaux-convolutifs-cnn.md)**
