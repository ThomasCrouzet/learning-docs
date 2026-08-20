---
tags:
  - IA
  - Avancé
  - Concept
description: "Architecture Transformer : self-attention, multi-head attention, positional encoding, encoder/decoder et le papier Attention Is All You Need"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 5 - Architectures modernes et NLP"
---

# 01 - Transformers : l'architecture fondatrice des modèles modernes

> **En bref** : À la fin de cette fiche, tu sauras décrire l'architecture Transformer complète (encoder et decoder), expliquer le mécanisme de self-attention avec Query/Key/Value, implémenter le scaled dot-product attention et le multi-head attention en PyTorch, et comprendre le rôle du positional encoding. Lecture estimée : 60 min.


## Prérequis

- Phase 4, fiche 01 - [Réseaux de neurones : théorie et pratique](../04-deep-learning-fondamental/01-reseaux-neurones-theorie-pratique.md) (backpropagation, loss functions, activations)
- Phase 4, fiche 02 - [PyTorch](../04-deep-learning-fondamental/02-pytorch.md) (tenseurs, autograd, nn.Module, training loop)
- Phase 4, fiche 04 - [Réseaux récurrents et séquences](../04-deep-learning-fondamental/04-reseaux-recurrents-sequences.md) (RNN, LSTM, Seq2Seq, attention de Bahdanau)
- Phase 1, fiche 01 - [Algèbre linéaire](../01-fondamentaux-mathematiques/01-algebre-lineaire.md) (produit matriciel, transposée)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire l'architecture Transformer complète (encoder et decoder), expliquer le mécanisme de self-attention avec Query/Key/Value, implémenter le scaled dot-product attention et le multi-head attention en PyTorch, et comprendre le rôle du positional encoding.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la self-attention ?

**Définition** : La self-attention est un mécanisme qui permet à chaque élément d'une séquence (par exemple chaque mot d'une phrase) de calculer un score de pertinence par rapport à tous les autres éléments de la même séquence. Ce score détermine combien d'attention chaque élément accorde aux autres.

**Le problème que la self-attention résout** :

Sans self-attention, voici les problèmes rencontrés :

1. **Les RNN traitent séquentiellement** : chaque mot doit attendre que le précédent soit traité, ce qui empêche la parallélisation et ralentit l'entraînement
2. **Les dépendances à longue distance sont perdues** : dans un RNN, l'information d'un mot en début de phrase se dégrade au fur et à mesure que la séquence avance (vanishing gradient)
3. **L'attention de Bahdanau est limitée** : elle calcule l'attention entre le decoder et l'encoder, mais pas entre les mots d'une même séquence

**Comment la self-attention résout ces problèmes** :

| Problème | Solution apportée par la self-attention |
| -------- | --------------------------------------- |
| Traitement séquentiel | Tous les mots sont traités en parallèle (multiplication matricielle) |
| Dépendances à longue distance | Chaque mot peut directement accéder à n'importe quel autre mot, quelle que soit la distance |
| Attention limitée encoder-decoder | La self-attention opère au sein d'une même séquence |

**Analogie concrète** : Imagine une réunion de 10 personnes assises en cercle. Chaque personne (mot) peut regarder et écouter directement chaque autre personne, sans devoir passer par un intermédiaire. La self-attention, c'est le moment où chaque personne décide à qui elle prête le plus attention en fonction du sujet discuté.

**Ce que la self-attention n'est PAS** :

- La self-attention n'est pas l'attention de Bahdanau. L'attention de Bahdanau calcule un score entre le decoder et l'encoder (cross-attention). La self-attention calcule un score entre les éléments d'une même séquence.
- La self-attention n'est pas une convolution. Une convolution regarde un voisinage local fixe. La self-attention regarde toute la séquence.

#### Query, Key et Value

Le mécanisme de self-attention utilise trois vecteurs pour chaque élément de la séquence :

- **Query (Q)** : "Ce que je cherche". Représente la question posée par un mot.
- **Key (K)** : "Ce que je propose". Représente l'identité ou le contenu d'un mot.
- **Value (V)** : "Ce que je donne". Représente l'information que le mot transmet.

Ces trois vecteurs sont obtenus en multipliant l'embedding de chaque mot par trois matrices de poids apprenables : W_Q, W_K et W_V.

```python
# Chaque mot a un embedding de dimension d_model
# On projette dans un espace de dimension d_k pour Q et K, d_v pour V
Q = X @ W_Q  # (seq_len, d_k)
K = X @ W_K  # (seq_len, d_k)
V = X @ W_V  # (seq_len, d_v)
```

**Analogie concrète** : Imagine une bibliothèque. Tu arrives avec une question (Query) : "Je cherche un livre sur les dinosaures". Chaque livre a une étiquette (Key) : "Biologie", "Histoire", "Dinosaures du Jurassique". Tu compares ta question à chaque étiquette pour trouver les livres pertinents (score d'attention). Ensuite, tu lis le contenu (Value) des livres qui correspondent le mieux.

#### Scaled dot-product attention

La formule de l'attention est :

```text
Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
```

Les étapes :

1. **Calcul des scores** : multiplication matricielle Q * K^T donne un score pour chaque paire de mots
2. **Scaling** : division par sqrt(d_k) pour éviter que les scores soient trop grands (ce qui rendrait le softmax trop "pointu")
3. **Softmax** : normalisation des scores en probabilités (somme = 1)
4. **Pondération** : multiplication par V pour obtenir la sortie pondérée

---

### Qu'est-ce que le multi-head attention ?

**Définition** : Le multi-head attention consiste à exécuter plusieurs mécanismes de self-attention en parallèle (appelés "têtes"), chacun avec ses propres matrices de poids W_Q, W_K, W_V. Les résultats sont ensuite concaténés et projetés.

**Le problème que le multi-head attention résout** :

Sans multi-head attention, voici les problèmes rencontrés :

1. **Un seul type de relation** : une seule tête d'attention ne peut capturer qu'un seul type de relation entre les mots (par exemple la relation sujet-verbe)
2. **Représentation limitée** : un seul espace d'attention compresse toute l'information
3. **Instabilité** : une seule tête peut se concentrer sur un aspect au détriment des autres

**Comment le multi-head attention résout ces problèmes** :

| Problème | Solution apportée par le multi-head attention |
| -------- | ---------------------------------------------- |
| Un seul type de relation | Chaque tête apprend un type de relation différent (syntaxe, sémantique, coréférence) |
| Représentation limitée | h espaces d'attention parallèles capturent plus d'information |
| Instabilité | L'ensemble des têtes est plus robuste qu'une seule |

**Fonctionnement** :

```text
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O

où head_i = Attention(Q * W_Q_i, K * W_K_i, V * W_V_i)
```

Dans le papier original : h = 8 têtes, d_model = 512, donc d_k = d_v = 512 / 8 = 64 par tête.

**Analogie concrète** : Imagine que tu analyses une photo de groupe. Un premier regard (tête 1) identifie les visages. Un second regard (tête 2) identifie les vêtements. Un troisième regard (tête 3) identifie les positions spatiales. En combinant ces regards, tu obtiens une compréhension complète de la scène.

**Ce que le multi-head attention n'est PAS** :

- Le multi-head attention n'est pas une simple répétition. Chaque tête a ses propres poids apprenables et apprend des patterns différents.
- Le multi-head attention n'est pas un ensemble de modèles. Toutes les têtes font partie du même modèle et sont entraînées conjointement.

---

### Qu'est-ce que le positional encoding ?

**Définition** : Le positional encoding est un vecteur ajouté à l'embedding de chaque token pour lui fournir une information de position dans la séquence. Sans lui, le Transformer ne saurait pas si un mot est au début ou à la fin de la phrase.

**Le problème que le positional encoding résout** :

Sans positional encoding, voici les problèmes rencontrés :

1. **Pas de notion d'ordre** : la self-attention traite tous les mots en parallèle, donc "le chat mange la souris" et "la souris mange le chat" auraient la même représentation
2. **Perte de la structure séquentielle** : les relations de position (avant/après, proche/éloigné) sont invisibles
3. **Ambiguïté sémantique** : des phrases avec les mêmes mots mais un ordre différent deviennent indistinguables

**Comment le positional encoding résout ces problèmes** :

| Problème | Solution apportée par le positional encoding |
| -------- | --------------------------------------------- |
| Pas de notion d'ordre | Chaque position reçoit un vecteur unique |
| Perte de structure | Les vecteurs encodent les distances relatives entre positions |
| Ambiguïté sémantique | L'embedding final = embedding du mot + encoding de position |

**Encodage sinusoïdal (papier original)** :

```text
PE(pos, 2i)     = sin(pos / 10000^(2i/d_model))
PE(pos, 2i + 1) = cos(pos / 10000^(2i/d_model))
```

- `pos` : position du token dans la séquence (0, 1, 2, ...)
- `i` : indice de la dimension (0, 1, 2, ..., d_model/2)
- Les dimensions paires utilisent le sinus, les dimensions impaires le cosinus
- Les fréquences varient de hautes (dimensions basses) à basses (dimensions hautes)

**Alternatives** :

- **Positional encoding apprenable** : les vecteurs de position sont des paramètres apprenables (utilisé dans BERT et GPT)
- **RoPE (Rotary Position Embedding)** : encode les positions par des rotations dans l'espace d'embedding (utilisé dans LLaMA)
- **ALiBi (Attention with Linear Biases)** : ajoute un biais linéaire aux scores d'attention basé sur la distance

**Analogie concrète** : Imagine des chaises numérotées dans une salle de cinéma. Chaque spectateur (mot) a un billet (embedding) qui décrit ses préférences. Le numéro de siège (positional encoding) indique sa position dans la rangée. Sans numéro de siège, on ne saurait pas qui est assis à côté de qui.

---

### Qu'est-ce que l'architecture encoder ?

**Définition** : L'encoder du Transformer est une pile de N couches identiques (N = 6 dans le papier original). Chaque couche contient deux sous-couches : un multi-head self-attention et un réseau feed-forward, chacune avec une connexion résiduelle et une layer normalization.

**Structure d'une couche encoder** :

1. **Multi-head self-attention** : chaque token attend à tous les autres tokens
2. **Add & Norm** : connexion résiduelle (x + sublayer(x)) suivie de layer normalization
3. **Feed-forward network** : deux couches linéaires avec une activation ReLU entre les deux (dimension interne d_ff = 2048)
4. **Add & Norm** : seconde connexion résiduelle et normalisation

```text
Input → [Multi-Head Attention] → Add & Norm → [Feed-Forward] → Add & Norm → Output
  ↑______________|                   ↑______________|
  (résiduelle)                       (résiduelle)
```

**Connexions résiduelles** : elles permettent au gradient de circuler directement à travers les couches, évitant le vanishing gradient dans les réseaux profonds. Le principe est le même que dans ResNet (Phase 4, fiche 03).

**Layer normalization** : normalise les activations sur la dimension des features (pas sur le batch). Cela stabilise l'entraînement.

**Comparaison Batch Norm vs Layer Norm** :

| Batch Normalization | Layer Normalization |
| ------------------- | ------------------- |
| Normalise sur le batch | Normalise sur les features |
| Dépend de la taille du batch | Indépendant de la taille du batch |
| Utilisé en CNN | Utilisé en Transformers |
| Comportement différent train/test | Même comportement train/test |

---

### Qu'est-ce que l'architecture decoder ?

**Définition** : Le decoder du Transformer est une pile de N couches identiques. Chaque couche contient trois sous-couches : un masked multi-head self-attention, un multi-head cross-attention (vers l'encoder), et un réseau feed-forward.

**Structure d'une couche decoder** :

1. **Masked multi-head self-attention** : chaque token ne peut voir que les tokens précédents (pas les futurs)
2. **Add & Norm**
3. **Multi-head cross-attention** : les queries viennent du decoder, les keys et values viennent de la sortie de l'encoder
4. **Add & Norm**
5. **Feed-forward network**
6. **Add & Norm**

**Masked self-attention** : le masque empêche le decoder de "tricher" en regardant les tokens futurs pendant l'entraînement. On applique un masque triangulaire inférieur qui met les positions futures à -infini avant le softmax.

```text
Masque :
[[0,    -inf, -inf, -inf],
 [0,    0,    -inf, -inf],
 [0,    0,    0,    -inf],
 [0,    0,    0,    0   ]]
```

**Cross-attention** : c'est le pont entre l'encoder et le decoder. Les queries Q viennent du decoder (ce que le decoder cherche), les keys K et values V viennent de l'encoder (ce que l'encoder propose). Cela permet au decoder d'accéder à l'information de la séquence source.

**Génération autorégressive** : le decoder génère un token à la fois. À chaque pas, il prend les tokens déjà générés comme entrée et produit le token suivant. La génération s'arrête quand un token spécial de fin est produit.

**Comparaison encoder vs decoder** :

| Encoder | Decoder |
| ------- | ------- |
| Voit toute la séquence | Ne voit que les tokens précédents |
| Self-attention bidirectionnelle | Self-attention masquée (causale) |
| Pas de cross-attention | Cross-attention vers l'encoder |
| Produit des représentations | Génère des tokens un par un |

---

### Le papier "Attention Is All You Need"

**Contexte historique** : Publié en juin 2017 par Vaswani et al. (Google Brain / Google Research), ce papier a introduit l'architecture Transformer. Le titre affirme que le mécanisme d'attention seul suffit, sans RNN ni CNN.

**Apports majeurs** :

1. **Parallélisation** : contrairement aux RNN, le Transformer traite toute la séquence en parallèle
2. **Performance** : il a établi un nouveau record sur la traduction anglais-allemand et anglais-français
3. **Efficacité** : entraînement 10 à 100 fois plus rapide que les modèles à base de RNN

**Impact** : cette architecture est la base de la plupart des grands modèles de langage et de vision actuels :

| Modèle | Année | Type | Basé sur le Transformer |
| ------ | ----- | ---- | ----------------------- |
| BERT | 2018 | Encoder-only | Oui (encoder du Transformer) |
| GPT-2 | 2019 | Decoder-only | Oui (decoder du Transformer) |
| T5 | 2019 | Encoder-decoder | Oui (Transformer complet) |
| ViT | 2020 | Vision | Oui (encoder adapté aux images) |
| GPT-4 | 2023 | Decoder-only (détails non publiés) | Oui (hypothèse publique) |
| Claude | 2024-2025 | Decoder-only (détails non publiés) | Oui (hypothèse publique) |

**Hyperparamètres du modèle original** :

| Paramètre | Valeur |
| --------- | ------ |
| d_model (dimension des embeddings) | 512 |
| h (nombre de têtes) | 8 |
| d_k = d_v (dimension par tête) | 64 |
| N (nombre de couches encoder/decoder) | 6 |
| d_ff (dimension du feed-forward) | 2048 |
| Paramètres totaux | 65 millions |

---

## Étapes Pratiques

### Étape 1 : Implémenter le scaled dot-product attention

Cette étape implémente la formule fondamentale de l'attention.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Calcule l'attention scaled dot-product.

    Args:
        Q: Queries, shape (batch, seq_len, d_k)
        K: Keys, shape (batch, seq_len, d_k)
        V: Values, shape (batch, seq_len, d_v)
        mask: Masque optionnel, shape (batch, seq_len, seq_len)

    Returns:
        output: Résultat pondéré, shape (batch, seq_len, d_v)
        attention_weights: Poids d'attention, shape (batch, seq_len, seq_len)
    """
    # d_k est la dernière dimension de K
    d_k = K.size(-1)

    # Étape 1 : Calcul des scores (Q * K^T)
    # K.transpose(-2, -1) transpose les deux dernières dimensions
    scores = torch.matmul(Q, K.transpose(-2, -1))  # (batch, seq_len, seq_len)

    # Étape 2 : Scaling par sqrt(d_k) pour stabiliser les gradients
    scores = scores / math.sqrt(d_k)

    # Étape 3 : Appliquer le masque si fourni
    # Les positions masquées reçoivent -inf pour que le softmax les mette à 0
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))

    # Étape 4 : Softmax pour obtenir des poids normalisés (somme = 1)
    attention_weights = F.softmax(scores, dim=-1)  # (batch, seq_len, seq_len)

    # Étape 5 : Pondération des values
    output = torch.matmul(attention_weights, V)  # (batch, seq_len, d_v)

    return output, attention_weights
```

**Test de la fonction** :

```python
# Créer des données de test
batch_size = 1
seq_len = 4  # 4 tokens dans la séquence
d_k = 8      # Dimension des queries et keys

# Initialiser Q, K, V avec des valeurs aléatoires
Q = torch.randn(batch_size, seq_len, d_k)
K = torch.randn(batch_size, seq_len, d_k)
V = torch.randn(batch_size, seq_len, d_k)

# Calculer l'attention
output, weights = scaled_dot_product_attention(Q, K, V)

# Vérifier les dimensions
print(f"Output shape: {output.shape}")      # (1, 4, 8)
print(f"Weights shape: {weights.shape}")    # (1, 4, 4)

# Vérifier que les poids somment à 1 sur la dernière dimension
print(f"Somme des poids: {weights.sum(dim=-1)}")  # Doit être ~1.0 pour chaque ligne
```

**Résultat attendu** :

```text
Output shape: torch.Size([1, 4, 8])
Weights shape: torch.Size([1, 4, 4])
Somme des poids: tensor([[1.0000, 1.0000, 1.0000, 1.0000]])
```

---

### Étape 2 : Implémenter le multi-head attention

Cette étape crée un module PyTorch réutilisable pour le multi-head attention.

```python
class MultiHeadAttention(nn.Module):
    """
    Multi-Head Attention : exécute h têtes d'attention en parallèle.
    """

    def __init__(self, d_model, num_heads):
        """
        Args:
            d_model: Dimension du modèle (ex: 512)
            num_heads: Nombre de têtes d'attention (ex: 8)
        """
        super().__init__()

        # Vérifier que d_model est divisible par num_heads
        assert d_model % num_heads == 0, "d_model doit être divisible par num_heads"

        self.d_model = d_model
        self.num_heads = num_heads
        # Dimension par tête : 512 / 8 = 64
        self.d_k = d_model // num_heads

        # Matrices de projection pour Q, K, V et la sortie
        # Chaque matrice projette de d_model vers d_model
        self.W_Q = nn.Linear(d_model, d_model)  # Poids pour les queries
        self.W_K = nn.Linear(d_model, d_model)  # Poids pour les keys
        self.W_V = nn.Linear(d_model, d_model)  # Poids pour les values
        self.W_O = nn.Linear(d_model, d_model)  # Projection de sortie

    def forward(self, Q, K, V, mask=None):
        """
        Args:
            Q: (batch, seq_len, d_model)
            K: (batch, seq_len, d_model)
            V: (batch, seq_len, d_model)
            mask: optionnel (batch, 1, 1, seq_len) ou (batch, 1, seq_len, seq_len)

        Returns:
            output: (batch, seq_len, d_model)
        """
        batch_size = Q.size(0)

        # Étape 1 : Projections linéaires
        Q = self.W_Q(Q)  # (batch, seq_len, d_model)
        K = self.W_K(K)  # (batch, seq_len, d_model)
        V = self.W_V(V)  # (batch, seq_len, d_model)

        # Étape 2 : Reshape pour séparer les têtes
        # De (batch, seq_len, d_model) vers (batch, num_heads, seq_len, d_k)
        Q = Q.view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = K.view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = V.view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)

        # Étape 3 : Scaled dot-product attention pour chaque tête
        d_k = self.d_k
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)

        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))

        attention_weights = F.softmax(scores, dim=-1)
        context = torch.matmul(attention_weights, V)  # (batch, num_heads, seq_len, d_k)

        # Étape 4 : Concaténer les têtes
        # De (batch, num_heads, seq_len, d_k) vers (batch, seq_len, d_model)
        context = context.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)

        # Étape 5 : Projection de sortie
        output = self.W_O(context)  # (batch, seq_len, d_model)

        return output
```

**Test du module** :

```python
# Paramètres du modèle
d_model = 512
num_heads = 8
seq_len = 10
batch_size = 2

# Créer le module multi-head attention
mha = MultiHeadAttention(d_model, num_heads)

# Créer une séquence d'entrée aléatoire
x = torch.randn(batch_size, seq_len, d_model)

# La self-attention utilise x comme Q, K et V
output = mha(x, x, x)

print(f"Input shape: {x.shape}")      # (2, 10, 512)
print(f"Output shape: {output.shape}")  # (2, 10, 512)
print(f"Nombre de paramètres: {sum(p.numel() for p in mha.parameters())}")
```

**Résultat attendu** :

```text
Input shape: torch.Size([2, 10, 512])
Output shape: torch.Size([2, 10, 512])
Nombre de paramètres: 1050624
```

---

### Étape 3 : Implémenter le positional encoding

```python
class PositionalEncoding(nn.Module):
    """
    Positional encoding sinusoïdal (papier original).
    Ajoute une information de position aux embeddings.
    """

    def __init__(self, d_model, max_seq_len=5000):
        """
        Args:
            d_model: Dimension des embeddings (ex: 512)
            max_seq_len: Longueur maximale de séquence supportée
        """
        super().__init__()

        # Créer une matrice de positional encoding (max_seq_len, d_model)
        pe = torch.zeros(max_seq_len, d_model)

        # Vecteur de positions : [0, 1, 2, ..., max_seq_len-1]
        position = torch.arange(0, max_seq_len, dtype=torch.float).unsqueeze(1)

        # Termes de division : 10000^(2i/d_model)
        # On utilise exp(log) pour la stabilité numérique
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )

        # Dimensions paires : sinus
        pe[:, 0::2] = torch.sin(position * div_term)
        # Dimensions impaires : cosinus
        pe[:, 1::2] = torch.cos(position * div_term)

        # Ajouter la dimension batch : (1, max_seq_len, d_model)
        pe = pe.unsqueeze(0)

        # Enregistrer comme buffer (pas un paramètre, mais sauvegardé avec le modèle)
        self.register_buffer('pe', pe)

    def forward(self, x):
        """
        Args:
            x: (batch, seq_len, d_model)

        Returns:
            x + positional_encoding : (batch, seq_len, d_model)
        """
        # On ajoute le PE uniquement pour les positions utilisées
        seq_len = x.size(1)
        x = x + self.pe[:, :seq_len, :]
        return x
```

**Test du positional encoding** :

```python
d_model = 512
pe = PositionalEncoding(d_model)

# Simuler un embedding de 6 tokens
x = torch.zeros(1, 6, d_model)

# Appliquer le positional encoding
x_with_pos = pe(x)

# Vérifier que les valeurs ne sont plus nulles (le PE a été ajouté)
print(f"Avant PE - somme: {x.sum().item():.4f}")
print(f"Après PE - somme: {x_with_pos.sum().item():.4f}")
print(f"PE position 0, dims 0-5: {x_with_pos[0, 0, :6].tolist()}")
print(f"PE position 1, dims 0-5: {x_with_pos[0, 1, :6].tolist()}")
```

**Résultat attendu** :

```text
Avant PE - somme: 0.0000
Après PE - somme: 1549.1528
PE position 0, dims 0-5: [0.0, 1.0, 0.0, 1.0, 0.0, 1.0]
PE position 1, dims 0-5: [0.8415, 0.5403, 0.8219, 0.5697, 0.8020, 0.5974]
```

---

### Étape 4 : Assembler une couche encoder complète

```python
class EncoderLayer(nn.Module):
    """
    Une couche de l'encoder Transformer.
    Contient : Multi-Head Attention + Feed-Forward, chacun avec Add & Norm.
    """

    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        """
        Args:
            d_model: Dimension du modèle (512)
            num_heads: Nombre de têtes (8)
            d_ff: Dimension du feed-forward (2048)
            dropout: Taux de dropout (0.1)
        """
        super().__init__()

        # Sous-couche 1 : Multi-Head Self-Attention
        self.self_attention = MultiHeadAttention(d_model, num_heads)
        self.norm1 = nn.LayerNorm(d_model)

        # Sous-couche 2 : Feed-Forward Network
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),    # Projection vers d_ff (2048)
            nn.ReLU(),                    # Activation non linéaire
            nn.Linear(d_ff, d_model)     # Retour vers d_model (512)
        )
        self.norm2 = nn.LayerNorm(d_model)

        # Dropout pour la régularisation
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        """
        Args:
            x: (batch, seq_len, d_model)
            mask: optionnel

        Returns:
            output: (batch, seq_len, d_model)
        """
        # Sous-couche 1 : Self-Attention + Add & Norm
        attn_output = self.self_attention(x, x, x, mask)  # Self-attention : Q=K=V=x
        x = self.norm1(x + self.dropout(attn_output))     # Connexion résiduelle + norm

        # Sous-couche 2 : Feed-Forward + Add & Norm
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_output))       # Connexion résiduelle + norm

        return x
```

**Test de la couche encoder** :

```python
# Créer une couche encoder avec les paramètres du papier original
encoder_layer = EncoderLayer(d_model=512, num_heads=8, d_ff=2048)

# Entrée : batch de 2 séquences de 10 tokens
x = torch.randn(2, 10, 512)

# Passer à travers la couche encoder
output = encoder_layer(x)

print(f"Input shape: {x.shape}")      # (2, 10, 512)
print(f"Output shape: {output.shape}")  # (2, 10, 512)
```

**Résultat attendu** :

```text
Input shape: torch.Size([2, 10, 512])
Output shape: torch.Size([2, 10, 512])
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install torch` | Installer PyTorch |
| `python -c "import torch; print(torch.__version__)"` | Vérifier la version de PyTorch |
| `python -c "import torch; print(torch.cuda.is_available())"` | Vérifier la disponibilité du GPU |
| `torchinfo.summary(model)` | Afficher un résumé du modèle (après `pip install torchinfo`) |

---

## Pièges Fréquents

### Piège 1 : Oublier le scaling dans l'attention

⚠️ **Problème** : Calculer Q * K^T sans diviser par sqrt(d_k). Les scores deviennent très grands, le softmax produit des valeurs proches de 0 et 1 (saturées), et les gradients deviennent quasi nuls.

✅ **Solution** : Toujours diviser par sqrt(d_k). C'est le "scaled" dans "scaled dot-product attention".

```python
# Incorrect : pas de scaling
scores = torch.matmul(Q, K.transpose(-2, -1))

# Correct : avec scaling
scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
```

---

### Piège 2 : Confondre self-attention et cross-attention

⚠️ **Problème** : Utiliser les mêmes entrées pour Q, K, V quand on veut faire de la cross-attention (encoder-decoder), ou l'inverse.

✅ **Solution** : En self-attention, Q = K = V = x (même séquence). En cross-attention, Q vient du decoder, K et V viennent de l'encoder.

---

### Piège 3 : Masque mal appliqué dans le decoder

⚠️ **Problème** : Ne pas appliquer de masque causal dans le decoder pendant l'entraînement. Le modèle "triche" en regardant les tokens futurs et ne fonctionne pas en inférence.

✅ **Solution** : Créer un masque triangulaire inférieur et l'appliquer avant le softmax.

```python
# Créer un masque causal pour une séquence de longueur seq_len
def create_causal_mask(seq_len):
    # tril = triangulaire inférieur : 1 en bas et sur la diagonale, 0 en haut
    mask = torch.tril(torch.ones(seq_len, seq_len))
    return mask  # (seq_len, seq_len)
```

---

### Piège 4 : Oublier les connexions résiduelles

⚠️ **Problème** : Appliquer l'attention et le feed-forward sans ajouter l'entrée originale. Le réseau profond souffre de vanishing gradient.

✅ **Solution** : Toujours ajouter l'entrée avant la layer norm : `x = norm(x + sublayer(x))`.

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle de Query, Key et Value dans la self-attention
- [ ] Je comprends pourquoi on divise par sqrt(d_k)
- [ ] Je sais expliquer pourquoi on utilise plusieurs têtes d'attention
- [ ] Je comprends le rôle du positional encoding et la formule sinusoïdale
- [ ] Je connais la différence entre self-attention et cross-attention
- [ ] Je sais pourquoi le decoder utilise un masque causal
- [ ] J'ai implémenté scaled dot-product attention en PyTorch
- [ ] J'ai implémenté multi-head attention en PyTorch
- [ ] Je connais les hyperparamètres du Transformer original (d_model=512, h=8, N=6)

---

## Exercice Pratique

**Énoncé** : Implémenter le mécanisme de self-attention from scratch en PyTorch et visualiser les scores d'attention sur une phrase simple.

**Indications** :

- Créer un vocabulaire simple de 10 mots
- Créer des embeddings aléatoires pour chaque mot (dimension 64)
- Implémenter le scaled dot-product attention
- Appliquer l'attention sur une phrase de 5 mots
- Visualiser la matrice des poids d'attention avec matplotlib (heatmap)
- Tester avec et sans masque causal

**Résultat attendu** : Une heatmap montrant quels mots prêtent attention à quels autres mots. Sans masque, la matrice est complète. Avec masque causal, le triangle supérieur est à zéro.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn.functional as F
import math
import matplotlib.pyplot as plt

# Étape 1 : Définir un vocabulaire simple
vocab = {
    "le": 0, "chat": 1, "mange": 2, "la": 3, "souris": 4,
    "chien": 5, "dort": 6, "dans": 7, "jardin": 8, "un": 9
}

# Étape 2 : Créer des embeddings aléatoires
d_model = 64
embedding = torch.nn.Embedding(len(vocab), d_model)

# Étape 3 : Encoder une phrase
phrase = ["le", "chat", "mange", "la", "souris"]
token_ids = torch.tensor([vocab[mot] for mot in phrase]).unsqueeze(0)  # (1, 5)
x = embedding(token_ids)  # (1, 5, 64)

# Étape 4 : Créer les matrices de projection
W_Q = torch.nn.Linear(d_model, d_model, bias=False)
W_K = torch.nn.Linear(d_model, d_model, bias=False)
W_V = torch.nn.Linear(d_model, d_model, bias=False)

# Étape 5 : Calculer Q, K, V
Q = W_Q(x)  # (1, 5, 64)
K = W_K(x)  # (1, 5, 64)
V = W_V(x)  # (1, 5, 64)

# Étape 6 : Scaled dot-product attention SANS masque
d_k = Q.size(-1)
scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
weights_no_mask = F.softmax(scores, dim=-1)

# Étape 7 : Scaled dot-product attention AVEC masque causal
seq_len = len(phrase)
causal_mask = torch.tril(torch.ones(seq_len, seq_len))  # Masque triangulaire inférieur
scores_masked = scores.masked_fill(causal_mask.unsqueeze(0) == 0, float('-inf'))
weights_with_mask = F.softmax(scores_masked, dim=-1)

# Étape 8 : Visualiser les deux matrices d'attention
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Heatmap sans masque
im1 = axes[0].imshow(
    weights_no_mask[0].detach().numpy(),
    cmap='Blues',
    vmin=0,
    vmax=1
)
axes[0].set_title("Self-Attention (sans masque)")
axes[0].set_xticks(range(seq_len))
axes[0].set_yticks(range(seq_len))
axes[0].set_xticklabels(phrase, rotation=45)
axes[0].set_yticklabels(phrase)
axes[0].set_xlabel("Key (ce qui est observé)")
axes[0].set_ylabel("Query (ce qui observe)")
plt.colorbar(im1, ax=axes[0])

# Heatmap avec masque causal
im2 = axes[1].imshow(
    weights_with_mask[0].detach().numpy(),
    cmap='Blues',
    vmin=0,
    vmax=1
)
axes[1].set_title("Self-Attention (masque causal)")
axes[1].set_xticks(range(seq_len))
axes[1].set_yticks(range(seq_len))
axes[1].set_xticklabels(phrase, rotation=45)
axes[1].set_yticklabels(phrase)
axes[1].set_xlabel("Key (ce qui est observé)")
axes[1].set_ylabel("Query (ce qui observe)")
plt.colorbar(im2, ax=axes[1])

plt.tight_layout()
plt.savefig("attention_heatmap.png", dpi=150)
plt.show()

# Afficher les poids numériques
print("Poids d'attention (sans masque) :")
print(weights_no_mask[0].detach().numpy().round(3))
print("\nPoids d'attention (masque causal) :")
print(weights_with_mask[0].detach().numpy().round(3))
```

Pour exécuter cette solution :

```bash
# Installer les dépendances nécessaires
pip install torch matplotlib

# Exécuter le script
python attention_exercise.py
```

**Résultat attendu** : Deux heatmaps côte à côte. La première montre une matrice complète de poids d'attention. La seconde montre une matrice triangulaire inférieure (les tokens ne regardent que les tokens précédents et eux-mêmes).

---

## Navigation

→ Fiche suivante : **[02 - Du NLP classique aux LLM](02-nlp-classique-llm.md)**
