---
tags:
  - IA
  - Avancé
  - Concept
  - Pratique
description: "Du NLP classique aux LLM : tokenization BPE, Word2Vec, BERT, GPT et écosystème Hugging Face"
estimated_time: "50 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 5 - Architectures modernes et NLP"
id: "ai.artificial-intelligence.modern-architectures.nlp-classique-llm"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.modern-architectures"
content_type: "lesson"
order: 2
---

# 02 - Du NLP classique aux LLM

> **En bref** : À la fin de cette fiche, tu sauras expliquer l'évolution du NLP de Word2Vec jusqu'à GPT, comprendre les différentes méthodes de tokenization (BPE, WordPiece, SentencePiece), distinguer les architectures encoder-only (BERT) et decoder-only (GPT), et utiliser la bibliothèque Hugging Face transformers pour le fine-tuning de modèles pré-entraînés. Lecture estimée : 50 min.


## Prérequis

- Phase 5, fiche 01 - [Transformers : l'architecture](01-transformers-architecture.md) (self-attention, multi-head attention, encoder/decoder)
- Phase 4, fiche 02 - [PyTorch](../04-deep-learning-fondamental/02-pytorch.md) (tenseurs, nn.Module, training loop)
- Phase 1, fiche 03 - [Probabilités et statistiques](../01-fondamentaux-mathematiques/03-probabilites-statistiques.md) (distributions, MLE)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer l'évolution du NLP de Word2Vec jusqu'à GPT, comprendre les différentes méthodes de tokenization (BPE, WordPiece, SentencePiece), distinguer les architectures encoder-only (BERT) et decoder-only (GPT), et utiliser la bibliothèque Hugging Face transformers pour le fine-tuning de modèles pré-entraînés.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la tokenization ?

**Définition** : La tokenization est le processus qui découpe un texte brut en unités plus petites appelées tokens. Ces tokens sont ensuite convertis en identifiants numériques (IDs) que le modèle peut traiter.

**Le problème que la tokenization résout** :

Sans tokenization, voici les problèmes rencontrés :

1. **Les modèles ne comprennent pas le texte** : un réseau de neurones ne traite que des nombres, pas des chaînes de caractères
2. **Vocabulaire infini** : si chaque mot est un token, les fautes d'orthographe, les néologismes et les langues rares créent un vocabulaire illimité
3. **Mots rares non représentés** : les mots peu fréquents n'ont pas assez d'occurrences pour être appris correctement

**Comment la tokenization résout ces problèmes** :

| Problème | Solution apportée par la tokenization |
| -------- | ------------------------------------- |
| Texte incompréhensible pour le modèle | Chaque token est mappé à un ID entier |
| Vocabulaire infini | Un vocabulaire fixe de taille limitée (30 000 à 100 000 tokens) |
| Mots rares | Les mots rares sont découpés en sous-mots connus |

**Analogie concrète** : Imagine que tu dois envoyer un message avec un alphabet de 26 lettres seulement. Un mot inconnu comme "anticonstitutionnellement" peut être découpé en morceaux connus : "anti", "constitution", "nelle", "ment". Chaque morceau a un sens et le destinataire peut reconstituer le mot.

#### Types de tokenization

**Word-level (par mot)** :

- Chaque mot = un token
- Vocabulaire très large (> 100 000 mots)
- Problème : les mots inconnus reçoivent un token `[UNK]` (unknown)
- Exemple : `"Le chat mange"` -> `["Le", "chat", "mange"]`

**BPE (Byte Pair Encoding)** :

- Algorithme itératif qui fusionne les paires de caractères les plus fréquentes
- Utilisé par GPT-2, GPT-3, GPT-4, et LLaMA 3 (tiktoken)
- Vocabulaire typique : 30 000 à 50 000 tokens (GPT-2 : 50 257)
- Exemple : `"lower"` -> `["low", "er"]`

Fonctionnement de BPE :

1. Commencer avec tous les caractères individuels comme vocabulaire de base
2. Compter toutes les paires de tokens adjacentes dans le corpus
3. Fusionner la paire la plus fréquente en un nouveau token
4. Répéter les étapes 2-3 jusqu'à atteindre la taille de vocabulaire souhaitée

**WordPiece** :

- Similaire à BPE mais utilise la vraisemblance au lieu de la fréquence
- Utilisé par BERT
- Préfixe `##` pour les sous-mots qui ne sont pas en début de mot
- Exemple (`bert-base-uncased`) : `"unbelievable"` -> `["un", "##bel", "##ie", "##va", "##ble"]`

**SentencePiece** :

- Traite le texte brut comme une séquence de caractères Unicode (sans pré-tokenization)
- Utilisé par T5, ALBERT, LLaMA 1 et LLaMA 2 (pas LLaMA 3)
- Fonctionne sur n'importe quelle langue sans règles spécifiques
- Utilise BPE ou Unigram comme algorithme de base

**Comparaison des tokenizers** :

| Tokenizer | Utilisé par | Base | Gestion des espaces |
| --------- | ----------- | ---- | ------------------- |
| BPE | GPT-2/3/4, LLaMA 3 | Fréquence des paires | Espace = caractère spécial (Ġ) |
| WordPiece | BERT, DistilBERT | Vraisemblance | Préfixe ## pour continuation |
| SentencePiece | T5, ALBERT, LLaMA 1/2 | BPE ou Unigram | Unicode brut, espace = ▁ |

---

### Qu'est-ce qu'un word embedding ?

**Définition** : Un word embedding est une représentation vectorielle dense d'un mot dans un espace de dimension réduite (typiquement 100 à 768 dimensions). Les mots sémantiquement proches ont des vecteurs proches.

**Le problème que les word embeddings résolvent** :

Sans word embeddings, voici les problèmes rencontrés :

1. **One-hot encoding trop volumineux** : chaque mot est un vecteur de taille V (vocabulaire) avec un seul 1 et V-1 zéros. Pour un vocabulaire de 50 000 mots, chaque vecteur fait 50 000 dimensions
2. **Pas de notion de similarité** : "chat" et "félin" sont aussi éloignés que "chat" et "voiture" en one-hot
3. **Pas de généralisation** : le modèle ne peut pas transférer ce qu'il apprend sur "chat" à "félin"

**Comment les word embeddings résolvent ces problèmes** :

| Problème | Solution apportée par les word embeddings |
| -------- | ----------------------------------------- |
| One-hot trop volumineux | Vecteurs denses de 100-768 dimensions |
| Pas de similarité | Les mots similaires ont des vecteurs proches (cosine similarity) |
| Pas de généralisation | L'espace vectoriel capture les relations sémantiques |

**Analogie concrète** : Imagine une carte géographique. Chaque ville (mot) a des coordonnées (x, y). Les villes proches géographiquement (Paris-Lyon) sont proches sur la carte. Les word embeddings sont une "carte" des mots où la proximité géographique correspond à la proximité sémantique.

#### Word2Vec (2013)

Deux architectures :

- **CBOW (Continuous Bag of Words)** : prédit un mot à partir de son contexte
- **Skip-gram** : prédit le contexte à partir d'un mot

Propriété célèbre : les opérations vectorielles capturent les analogies.

```text
vec("roi") - vec("homme") + vec("femme") ≈ vec("reine")
vec("Paris") - vec("France") + vec("Italie") ≈ vec("Rome")
```

**Limitation** : un mot a toujours le même vecteur, quel que soit le contexte. "Banque" (financière) et "banque" (de rivière) ont le même embedding.

#### GloVe (2014)

- **Global Vectors for Word Representation**
- Combine les statistiques globales de co-occurrence avec l'apprentissage local
- Produit des embeddings de qualité similaire à Word2Vec

#### Embeddings contextuels (2018+)

- **ELMo** : utilise un LSTM bidirectionnel pour produire des embeddings qui dépendent du contexte
- **BERT** : utilise un Transformer encoder pour produire des embeddings contextuels
- "Banque" a un vecteur différent dans "la banque de France" et "la banque du fleuve"

**Ce que les word embeddings ne sont PAS** :

- Les word embeddings ne sont pas des représentations symboliques. Ils ne contiennent pas une définition du mot, mais une position dans un espace géométrique.
- Les word embeddings ne sont pas figés dans les modèles modernes. BERT et GPT produisent des embeddings différents selon le contexte (contrairement à Word2Vec).

Le diagramme suivant résume l'évolution des techniques de NLP, des approches classiques jusqu'aux modèles génératifs actuels.

<div class="diagram-design">
<p><a href="../../../diagrams/ia-05-architectures-modernes-nlp-02-nlp-classique-llm-1.html">Embeddings contextuels (2018+) (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-05-architectures-modernes-nlp-02-nlp-classique-llm-1.html" title="Embeddings contextuels (2018+)" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que BERT ?

**Définition** : BERT (Bidirectional Encoder Representations from Transformers) est un modèle de langage pré-entraîné basé sur l'encoder du Transformer. Il lit le texte dans les deux directions simultanément (bidirectionnel) pour produire des représentations contextuelles riches.

**Le problème que BERT résout** :

Sans BERT, voici les problèmes rencontrés :

1. **Entraînement spécifique par tâche** : chaque tâche NLP (classification, NER, QA) nécessitait un modèle entraîné from scratch
2. **Peu de données annotées** : certaines tâches n'ont que quelques milliers d'exemples annotés, insuffisant pour entraîner un bon modèle
3. **Représentations unidirectionnelles** : les modèles comme GPT-1 ne lisent que de gauche à droite, perdant le contexte droit

**Comment BERT résout ces problèmes** :

| Problème | Solution apportée par BERT |
| -------- | -------------------------- |
| Entraînement par tâche | Pré-entraînement sur un corpus massif, puis fine-tuning sur la tâche cible |
| Peu de données annotées | Le pré-entraînement capture des connaissances linguistiques générales |
| Représentations unidirectionnelles | L'encoder bidirectionnel voit le contexte gauche ET droit |

**Pré-entraînement de BERT** :

BERT est pré-entraîné avec deux objectifs :

1. **MLM (Masked Language Model)** : 15% des tokens sont masqués et le modèle doit les prédire

   ```text
   Entrée : "Le [MASK] mange la souris"
   Sortie attendue : "chat"
   ```

2. **NSP (Next Sentence Prediction)** : le modèle prédit si deux phrases sont consécutives ou non

   ```text
   Phrase A : "Le chat dort."
   Phrase B : "Il ronronne doucement."  → IsNext (consécutives)
   Phrase B : "Paris est en France."    → NotNext (pas consécutives)
   ```

**Fine-tuning de BERT** :

Après le pré-entraînement, on ajoute une couche de classification au-dessus de BERT et on entraîne sur la tâche cible avec peu de données :

| Tâche | Input | Output |
| ----- | ----- | ------ |
| Classification de texte | Texte complet | Classe (positif/négatif) |
| NER (Named Entity Recognition) | Texte avec entités | Label par token (PER, ORG, LOC) |
| Question Answering | Question + contexte | Positions début/fin de la réponse |

**Variantes de BERT** :

| Modèle | Paramètres | Particularité |
| ------ | ---------- | ------------- |
| BERT-base | 110M | 12 couches, 768 dimensions, 12 têtes |
| BERT-large | 340M | 24 couches, 1024 dimensions, 16 têtes |
| DistilBERT | 66M | Version distillée, 97% de la performance, 60% plus rapide |
| RoBERTa | 355M | BERT amélioré (plus de données, pas de NSP, MLM dynamique) |
| CamemBERT | 110M | BERT entraîné sur du texte français |

**Ce que BERT n'est PAS** :

- BERT n'est pas un modèle génératif. Il ne génère pas de texte mot par mot. Il comprend et représente le texte, mais ne le produit pas.
- BERT n'est pas GPT. GPT utilise le decoder (unidirectionnel, gauche à droite). BERT utilise l'encoder (bidirectionnel).

---

### Qu'est-ce que GPT ?

**Définition** : GPT (Generative Pre-trained Transformer) est un modèle de langage basé sur le decoder du Transformer. Il génère du texte de manière autorégressive (un token à la fois, de gauche à droite).

**Le problème que GPT résout** :

Sans GPT, voici les problèmes rencontrés :

1. **Génération de texte de faible qualité** : les modèles RNN produisent du texte incohérent au-delà de quelques phrases
2. **Pas de capacités émergentes** : les petits modèles ne peuvent pas raisonner, résumer ou traduire sans entraînement spécifique
3. **Scaling limité** : les architectures RNN ne bénéficient pas autant de l'augmentation de données et de paramètres

**Comment GPT résout ces problèmes** :

| Problème | Solution apportée par GPT |
| -------- | ------------------------- |
| Génération incohérente | L'architecture Transformer maintient la cohérence sur des milliers de tokens |
| Pas de capacités émergentes | Avec suffisamment de paramètres et de données, GPT développe des capacités non prévues |
| Scaling limité | Le Transformer bénéficie des scaling laws : plus de données + paramètres = meilleure performance |

**Fonctionnement autorégressif** :

```text
Étape 1 : Input "Le" → Prédiction "chat"
Étape 2 : Input "Le chat" → Prédiction "mange"
Étape 3 : Input "Le chat mange" → Prédiction "la"
Étape 4 : Input "Le chat mange la" → Prédiction "souris"
```

**Évolution de GPT** :

| Modèle | Année | Paramètres | Contexte | Données |
| ------ | ----- | ---------- | -------- | ------- |
| GPT-1 | 2018 | 117M | 512 tokens | BookCorpus (5 Go) |
| GPT-2 | 2019 | 1.5B | 1024 tokens | WebText (40 Go) |
| GPT-3 | 2020 | 175B | 2048 tokens | CommonCrawl filtré (570 Go) |
| GPT-4 | 2023 | Non publié (estimations web non officielles) | 8K / 32K puis jusqu'à 128K (variants) | Non publié |

**Comparaison BERT vs GPT** :

| BERT (encoder-only) | GPT (decoder-only) |
| -------------------- | ------------------- |
| Bidirectionnel | Unidirectionnel (gauche à droite) |
| Masked Language Model | Causal Language Model |
| Comprend le texte | Génère du texte |
| Fine-tuning pour chaque tâche | Zéro-shot / Few-shot possible (GPT-3+) |
| 110M-340M paramètres | 117M à > 1T paramètres |
| Classification, NER, QA | Génération, résumé, traduction, code |

---

### Qu'est-ce que l'écosystème Hugging Face ?

**Définition** : Hugging Face est une plateforme et un ensemble de bibliothèques open source qui fournissent un accès simple à des milliers de modèles pré-entraînés, tokenizers et datasets pour le NLP et d'autres domaines de l'IA.

**Le problème que Hugging Face résout** :

Sans Hugging Face, voici les problèmes rencontrés :

1. **Implémentation complexe** : implémenter BERT ou GPT from scratch demande des semaines de travail
2. **Accès aux modèles difficile** : trouver et télécharger des modèles pré-entraînés nécessite de naviguer entre différents repos
3. **Interfaces incompatibles** : chaque modèle a sa propre API, son propre format de données

**Comment Hugging Face résout ces problèmes** :

| Problème | Solution apportée par Hugging Face |
| -------- | ---------------------------------- |
| Implémentation complexe | 3 lignes de code pour charger et utiliser un modèle |
| Accès aux modèles | Hub centralisé avec > 500 000 modèles |
| Interfaces incompatibles | API unifiée (pipeline, AutoModel, AutoTokenizer) |

**Composants principaux** :

| Bibliothèque | Rôle |
| ------------ | ---- |
| `transformers` | Modèles pré-entraînés (BERT, GPT, T5, etc.) |
| `tokenizers` | Tokenizers rapides en Rust |
| `datasets` | Chargement et préparation de datasets |
| `accelerate` | Entraînement distribué simplifié |
| `peft` | Fine-tuning efficace (LoRA, QLoRA) |
| `evaluate` | Métriques d'évaluation standardisées |

**Analogie concrète** : Hugging Face est le "app store" de l'IA. Au lieu de coder ton propre modèle, tu télécharges un modèle pré-entraîné depuis le Hub (comme tu télécharges une application), tu le configures pour ta tâche, et tu l'utilises directement.

---

## Étapes Pratiques

### Étape 1 : Explorer un tokenizer BPE

Cette étape montre comment un tokenizer BPE découpe le texte en sous-mots.

```python
from transformers import AutoTokenizer

# Charger le tokenizer de GPT-2 (utilise BPE)
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# Tokenizer une phrase simple
text = "Le chat mange la souris dans le jardin"
tokens = tokenizer.tokenize(text)
ids = tokenizer.encode(text)

print(f"Texte original : {text}")
print(f"Tokens : {tokens}")
print(f"IDs : {ids}")
print(f"Nombre de tokens : {len(tokens)}")

# Décoder les IDs pour revenir au texte
decoded = tokenizer.decode(ids)
print(f"Texte décodé : {decoded}")
```

**Résultat attendu** :

```text
Texte original : Le chat mange la souris dans le jardin
Tokens : ['Le', ' chat', ' mange', ' la', ' sour', 'is', ' dans', ' le', ' jard', 'in']
IDs : [3123, 8537, 582, 8269, 1553, 271, 288, 9089, 443, 1084]
Nombre de tokens : 10
Texte décodé : Le chat mange la souris dans le jardin
```

Le caractère `Ġ` (affiché comme espace avant le mot) indique le début d'un nouveau mot dans le tokenizer BPE de GPT-2.

---

### Étape 2 : Comparer les tokenizers BERT et GPT-2

```python
from transformers import AutoTokenizer

# Charger les deux tokenizers
tokenizer_bert = AutoTokenizer.from_pretrained("bert-base-uncased")
tokenizer_gpt2 = AutoTokenizer.from_pretrained("gpt2")

text = "unbelievable performance improvements"

# Tokenization BERT (WordPiece)
tokens_bert = tokenizer_bert.tokenize(text)
print(f"BERT (WordPiece) : {tokens_bert}")

# Tokenization GPT-2 (BPE)
tokens_gpt2 = tokenizer_gpt2.tokenize(text)
print(f"GPT-2 (BPE)      : {tokens_gpt2}")

# Taille des vocabulaires
print(f"\nVocabulaire BERT : {tokenizer_bert.vocab_size} tokens")
print(f"Vocabulaire GPT-2 : {tokenizer_gpt2.vocab_size} tokens")
```

**Résultat attendu** :

```text
BERT (WordPiece) : ['un', '##bel', '##ie', '##va', '##ble', 'performance', 'improvements']
GPT-2 (BPE)      : ['un', 'bel', 'iev', 'able', ' performance', ' improvements']

Vocabulaire BERT : 30522 tokens
Vocabulaire GPT-2 : 50257 tokens
```

---

### Étape 3 : Utiliser la pipeline Hugging Face

La pipeline est l'API la plus simple de Hugging Face : une seule ligne pour une tâche complète.

```python
from transformers import pipeline

# Classification de sentiment
classifier = pipeline("sentiment-analysis")
result = classifier("I love this movie, it was absolutely fantastic!")
print(f"Sentiment : {result}")

# Génération de texte
generator = pipeline("text-generation", model="gpt2")
result = generator("The future of artificial intelligence is", max_length=50, num_return_sequences=1)
print(f"\nGénération : {result[0]['generated_text']}")

# Fill-mask (complétion de mots masqués avec BERT)
unmasker = pipeline("fill-mask", model="bert-base-uncased")
result = unmasker("The capital of France is [MASK].")
print(f"\nFill-mask :")
for r in result[:3]:
    print(f"  {r['token_str']} (score: {r['score']:.4f})")
```

**Résultat attendu** :

```text
Sentiment : [{'label': 'POSITIVE', 'score': 0.9998}]

Génération : The future of artificial intelligence is a topic that has been debated for decades...

Fill-mask :
  paris (score: 0.9836)
  lyon (score: 0.0032)
  lille (score: 0.0015)
```

---

### Étape 4 : Fine-tuner BERT pour la classification de texte

Cette étape montre le workflow complet de fine-tuning avec Hugging Face.

```python
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import Trainer, TrainingArguments
from datasets import load_dataset

# Étape 4a : Charger le dataset
# IMDB : 25 000 critiques de films (positif/négatif) pour l'entraînement
dataset = load_dataset("imdb")

# Prendre un sous-ensemble pour accélérer (en production, utiliser tout le dataset)
train_dataset = dataset["train"].shuffle(seed=42).select(range(1000))
eval_dataset = dataset["test"].shuffle(seed=42).select(range(200))

print(f"Train : {len(train_dataset)} exemples")
print(f"Eval : {len(eval_dataset)} exemples")
print(f"Exemple : {train_dataset[0]['text'][:100]}...")
print(f"Label : {train_dataset[0]['label']} (0=négatif, 1=positif)")

# Étape 4b : Charger le tokenizer et le modèle pré-entraîné
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# AutoModelForSequenceClassification ajoute une tête de classification au-dessus de BERT
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

# Étape 4c : Tokenizer le dataset
def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        padding="max_length",   # Padder toutes les séquences à la même longueur
        truncation=True,        # Tronquer les séquences trop longues
        max_length=256          # Longueur maximale en tokens
    )

# Appliquer la tokenization à tout le dataset
train_tokenized = train_dataset.map(tokenize_function, batched=True)
eval_tokenized = eval_dataset.map(tokenize_function, batched=True)

# Étape 4d : Configurer l'entraînement
training_args = TrainingArguments(
    output_dir="./results",              # Dossier de sortie
    num_train_epochs=3,                  # 3 passes sur le dataset
    per_device_train_batch_size=16,      # 16 exemples par batch
    per_device_eval_batch_size=16,       # 16 exemples par batch d'évaluation
    eval_strategy="epoch",               # Évaluer à chaque epoch
    save_strategy="epoch",               # Sauvegarder à chaque epoch
    logging_steps=50,                    # Logger toutes les 50 étapes
    learning_rate=2e-5,                  # Learning rate adapté au fine-tuning
    weight_decay=0.01,                   # Régularisation L2
)

# Étape 4e : Créer le Trainer et lancer l'entraînement
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_tokenized,
    eval_dataset=eval_tokenized,
)

# Lancer l'entraînement
trainer.train()

# Étape 4f : Évaluer le modèle
results = trainer.evaluate()
print(f"\nRésultats : {results}")
```

**Résultat attendu** :

```text
Train : 1000 exemples
Eval : 200 exemples

Epoch 1/3 : loss=0.45, eval_accuracy=0.85
Epoch 2/3 : loss=0.22, eval_accuracy=0.88
Epoch 3/3 : loss=0.12, eval_accuracy=0.90
```

---

### Étape 5 : Utiliser le modèle fine-tuné pour prédire

```python
from transformers import pipeline

# Charger le modèle fine-tuné
classifier = pipeline(
    "sentiment-analysis",
    model="./results/checkpoint-final",  # Chemin vers le modèle sauvegardé
    tokenizer=model_name
)

# Tester sur de nouvelles critiques
tests = [
    "This movie was absolutely terrible. Worst film I've ever seen.",
    "A masterpiece of cinema. Every scene was breathtaking.",
    "It was okay, nothing special but not bad either.",
]

for text in tests:
    result = classifier(text)
    label = "Positif" if result[0]["label"] == "LABEL_1" else "Négatif"
    score = result[0]["score"]
    print(f"{label} ({score:.4f}) : {text[:60]}...")
```

**Résultat attendu** :

```text
Négatif (0.9876) : This movie was absolutely terrible. Worst film I've ever se...
Positif (0.9912) : A masterpiece of cinema. Every scene was breathtaking....
Positif (0.6234) : It was okay, nothing special but not bad either....
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install transformers datasets` | Installer Hugging Face transformers et datasets |
| `pip install accelerate` | Installer le support d'entraînement distribué |
| `pip install tokenizers` | Installer la bibliothèque de tokenizers rapides |
| `huggingface-cli login` | Se connecter au Hub Hugging Face |
| `huggingface-cli download bert-base-uncased` | Télécharger un modèle localement |

---

## Pièges Fréquents

### Piège 1 : Oublier le padding et la troncation

⚠️ **Problème** : Tokenizer des textes de longueurs différentes sans padding. Le batch ne peut pas être formé car les tenseurs ont des tailles différentes.

✅ **Solution** : Toujours spécifier `padding=True` et `truncation=True` dans le tokenizer.

```python
# Incorrect : pas de padding ni troncation
tokens = tokenizer(texts)  # Erreur : tailles différentes

# Correct : padding et troncation activés
tokens = tokenizer(texts, padding=True, truncation=True, max_length=512)
```

---

### Piège 2 : Utiliser BERT pour la génération de texte

⚠️ **Problème** : Essayer de générer du texte avec BERT. BERT est un encoder bidirectionnel, il ne peut pas générer de manière autorégressive.

✅ **Solution** : Utiliser un modèle decoder-only (GPT-2, LLaMA) pour la génération de texte. Utiliser BERT pour la classification, le NER ou le question answering.

---

### Piège 3 : Learning rate trop élevé pour le fine-tuning

⚠️ **Problème** : Utiliser un learning rate de 1e-3 (typique pour un entraînement from scratch) pour le fine-tuning. Le modèle pré-entraîné "oublie" ce qu'il a appris (catastrophic forgetting).

✅ **Solution** : Utiliser un learning rate entre 2e-5 et 5e-5 pour le fine-tuning de modèles BERT-like.

```python
# Incorrect : learning rate trop élevé pour le fine-tuning
training_args = TrainingArguments(learning_rate=1e-3)

# Correct : learning rate adapté au fine-tuning
training_args = TrainingArguments(learning_rate=2e-5)
```

---

### Piège 4 : Ne pas mettre le modèle en mode évaluation

⚠️ **Problème** : Faire des prédictions avec un modèle PyTorch sans appeler `model.eval()`. Le dropout et la batch normalization restent actifs, donnant des résultats instables.

✅ **Solution** : Appeler `model.eval()` avant l'inférence et `model.train()` avant l'entraînement. La pipeline Hugging Face gère cela automatiquement.

```python
# Pour des prédictions manuelles (sans pipeline)
model.eval()
with torch.no_grad():
    outputs = model(**inputs)
```

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre tokenization word-level, BPE et WordPiece
- [ ] Je comprends comment BPE construit son vocabulaire itérativement
- [ ] Je sais expliquer la différence entre Word2Vec et les embeddings contextuels
- [ ] Je connais les deux objectifs de pré-entraînement de BERT (MLM et NSP)
- [ ] Je sais expliquer la différence entre BERT (encoder) et GPT (decoder)
- [ ] Je sais utiliser la pipeline Hugging Face pour la classification et la génération
- [ ] J'ai fine-tuné un modèle BERT sur une tâche de classification
- [ ] Je connais le learning rate recommandé pour le fine-tuning (2e-5 à 5e-5)

---

## Exercice Pratique

**Énoncé** : Fine-tuner un modèle BERT (ou DistilBERT) pour la classification de sentiment sur un dataset de critiques de films, puis évaluer ses performances.

**Indications** :

- Utiliser le dataset IMDB de Hugging Face (`load_dataset("imdb")`)
- Utiliser `distilbert-base-uncased` comme modèle de base (plus rapide que BERT)
- Tokenizer avec padding et troncation à 256 tokens
- Entraîner pendant 3 epochs avec un learning rate de 2e-5
- Évaluer l'accuracy sur le dataset de test
- Tester le modèle sur 5 phrases personnelles

**Résultat attendu** : Une accuracy d'au moins 85% sur le dataset de test (avec seulement 1000 exemples d'entraînement) et des prédictions cohérentes sur tes phrases personnelles.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import numpy as np
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments
)
from datasets import load_dataset

# --- Configuration ---
MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 256
EPOCHS = 3
LR = 2e-5
BATCH_SIZE = 16
TRAIN_SIZE = 1000
EVAL_SIZE = 500

# --- Charger le dataset IMDB ---
dataset = load_dataset("imdb")
train_data = dataset["train"].shuffle(seed=42).select(range(TRAIN_SIZE))
eval_data = dataset["test"].shuffle(seed=42).select(range(EVAL_SIZE))

# --- Charger le tokenizer ---
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# --- Tokenizer le dataset ---
def preprocess(examples):
    return tokenizer(
        examples["text"],
        padding="max_length",
        truncation=True,
        max_length=MAX_LENGTH
    )

train_data = train_data.map(preprocess, batched=True)
eval_data = eval_data.map(preprocess, batched=True)

# --- Charger le modèle ---
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=2  # 2 classes : positif et négatif
)

# --- Définir la métrique d'évaluation ---
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    accuracy = (predictions == labels).mean()
    return {"accuracy": accuracy}

# --- Configurer l'entraînement ---
training_args = TrainingArguments(
    output_dir="./imdb-sentiment-model",
    num_train_epochs=EPOCHS,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    logging_steps=25,
    learning_rate=LR,
    weight_decay=0.01,
)

# --- Entraîner ---
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_data,
    eval_dataset=eval_data,
    compute_metrics=compute_metrics,
)

trainer.train()

# --- Évaluer ---
results = trainer.evaluate()
print(f"\nAccuracy finale : {results['eval_accuracy']:.4f}")

# --- Tester sur des phrases personnelles ---
from transformers import pipeline

classifier = pipeline(
    "sentiment-analysis",
    model=trainer.model,
    tokenizer=tokenizer
)

test_phrases = [
    "This film is a masterpiece of storytelling and visual beauty.",
    "I wasted two hours of my life watching this garbage.",
    "The acting was decent but the plot was predictable.",
    "Absolutely loved every minute of it. Highly recommended!",
    "The worst movie I have seen this year. Avoid at all costs.",
]

print("\n--- Prédictions sur des phrases personnelles ---")
for phrase in test_phrases:
    result = classifier(phrase)[0]
    label = "Positif" if result["label"] == "LABEL_1" else "Négatif"
    print(f"  {label} ({result['score']:.4f}) : {phrase[:70]}")
```

Pour exécuter cette solution :

```bash
# Installer les dépendances
pip install transformers datasets torch numpy

# Exécuter le script
python fine_tune_bert.py
```

---

## Navigation

← Fiche précédente : **[01 - Transformers : l'architecture fondatrice des modèles modernes](01-transformers-architecture.md)**

→ Fiche suivante : **[03 - Vision Transformers et multimodal](03-vision-transformers-multimodal.md)**
