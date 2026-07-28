---
tags:
  - IA
  - Avancé
  - Pratique
description: "Fine-tuning et adaptation de modèles : LoRA, QLoRA, PEFT, quantization GPTQ/AWQ et datasets d'instruction"
estimated_time: "50 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 6 - Large Language Models"
---

# 04 - Fine-tuning et adaptation de modèles

> **En bref** : À la fin de cette fiche, tu pourras expliquer et appliquer les principes de LoRA, QLoRA, la quantization et le fine-tuning de LLM pour adapter un modèle pré-entraîné à tes données et ton cas d'usage spécifique. Lecture estimée : 50 min.


## Prérequis

- [Fiche 01 - Architecture et fonctionnement des LLM](01-architecture-fonctionnement-llm.md) (decoder-only, tokenization, scaling laws, RLHF)
- [Phase 4 - Fiche 01 : Réseaux de neurones](../04-deep-learning-fondamental/01-reseaux-neurones-theorie-pratique.md) (backpropagation, loss functions, optimiseurs)
- Python 3 installé sur ta machine
- `pip install transformers peft bitsandbytes datasets accelerate trl`
- Un GPU avec au moins 8 Go de VRAM (ou Google Colab gratuit)

## Objectif de cette fiche

À la fin de cette fiche, tu pourras expliquer et appliquer les principes de LoRA, QLoRA, la quantization et le fine-tuning de LLM pour adapter un modèle pré-entraîné à tes données et ton cas d'usage spécifique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le fine-tuning full ?

**Définition** : Le fine-tuning full consiste à reprendre un modèle pré-entraîné et à modifier tous ses paramètres (poids) en l'entraînant sur un nouveau jeu de données. Tous les poids du modèle sont mis à jour à chaque étape d'entraînement.

**Le problème que le fine-tuning full résout** :

Sans fine-tuning, voici les problèmes rencontrés :

1. **Modèle généraliste inadapté** : un LLM pré-entraîné ne connaît pas le vocabulaire et les conventions spécifiques d'un domaine
2. **Prompt engineering limité** : certaines tâches complexes ne peuvent pas être résolues par un simple prompt, même avec du few-shot
3. **Format de sortie non contrôlé** : le modèle ne respecte pas systématiquement le format de réponse souhaité

**Comment le fine-tuning full résout ces problèmes** :

| Problème | Solution apportée par le fine-tuning full |
| -------- | ----------------------------------------- |
| Modèle généraliste inadapté | Le modèle apprend le vocabulaire et les patterns du domaine cible |
| Prompt engineering limité | Le modèle internalise le comportement souhaité dans ses poids |
| Format de sortie non contrôlé | Le modèle apprend le format exact à partir des exemples d'entraînement |

**Analogie concrète** : Le fine-tuning full est comme envoyer un employé généraliste suivre une formation complète de reconversion. Il remet à jour toutes ses compétences pour le nouveau poste. C'est efficace mais coûteux en temps et en ressources.

**Ce que le fine-tuning full n'est PAS** :

- Le fine-tuning full n'est pas un entraînement from scratch. On part d'un modèle déjà entraîné, ce qui réduit considérablement le temps et les données nécessaires.
- Le fine-tuning full n'est pas toujours la meilleure approche. Il est coûteux en GPU, risque le catastrophic forgetting (le modèle oublie ses connaissances générales) et nécessite beaucoup de données.

**Limites du fine-tuning full** :

| Limitation | Détail |
| ---------- | ------ |
| Coût GPU | Un LLM de 7B paramètres nécessite 4 GPU A100 (80 Go) pour le fine-tuning full |
| Catastrophic forgetting | Le modèle peut perdre ses capacités générales en se spécialisant trop |
| Stockage | Chaque version fine-tunée stocke une copie complète du modèle (14 Go pour 7B) |
| Données nécessaires | Nécessite typiquement des milliers à dizaines de milliers d'exemples |

---

### Qu'est-ce que LoRA ?

**Définition** : LoRA (Low-Rank Adaptation) est une méthode de fine-tuning qui gèle les poids originaux du modèle et ajoute de petites matrices de faible rang (low-rank) entraînables à côté des couches existantes. Au lieu de modifier les millions de paramètres du modèle, LoRA n'entraîne que quelques milliers de paramètres supplémentaires.

**Le problème que LoRA résout** :

Sans LoRA, voici les problèmes rencontrés :

1. **Fine-tuning trop coûteux** : modifier tous les paramètres d'un LLM de 7B nécessite énormément de mémoire GPU
2. **Catastrophic forgetting** : modifier tous les poids risque de dégrader les capacités existantes du modèle
3. **Pas de modularité** : chaque fine-tuning produit un nouveau modèle complet, impossible de combiner plusieurs adaptations

**Comment LoRA résout ces problèmes** :

| Problème | Solution apportée par LoRA |
| -------- | -------------------------- |
| Fine-tuning trop coûteux | LoRA n'entraîne que 0.1% à 1% des paramètres du modèle |
| Catastrophic forgetting | Les poids originaux sont gelés, les connaissances générales sont préservées |
| Pas de modularité | Les adaptateurs LoRA sont de petits fichiers (quelques Mo) interchangeables |

**Analogie concrète** : LoRA est comme ajouter des post-it sur les pages d'un livre de référence. Le livre original (poids gelés) reste intact. Les post-it (matrices LoRA) ajoutent des notes spécifiques à ton usage. Tu peux changer de jeu de post-it selon la tâche, sans modifier le livre.

**Ce que LoRA n'est PAS** :

- LoRA n'est pas une compression du modèle. Le modèle original reste entier en mémoire. LoRA ajoute des paramètres entraînables, il ne réduit pas la taille du modèle.
- LoRA n'est pas du prompting. Les adaptateurs LoRA modifient le comportement du modèle de façon permanente (une fois entraînés), contrairement au prompting qui agit à chaque requête.

**Fonctionnement technique** :

```text
Couche originale : Y = W * X       (W est une matrice de taille d x d)
Avec LoRA :        Y = W * X + B * A * X

W : poids originaux (gelés, pas de gradient)
A : matrice de taille r x d (r << d, typiquement r = 8 ou 16)
B : matrice de taille d x r
  (ainsi B*A est d x d, comme W)
r : rang de l'adaptation (hyperparamètre clé)

Exemple pour un modèle 7B :
- W a 4096 x 4096 = 16.7M paramètres (par couche)
- A a 16 x 4096 = 65K paramètres
- B a 4096 x 16 = 65K paramètres
- Total LoRA par couche : 130K paramètres (0.8% de W)
```

**Hyperparamètres clés de LoRA** :

| Paramètre | Description | Valeur typique |
| --------- | ----------- | -------------- |
| `r` (rang) | Dimension des matrices LoRA. Plus r est grand, plus le modèle peut apprendre | 8 à 64 |
| `lora_alpha` | Facteur d'échelle appliqué aux matrices LoRA | Souvent égal à r ou 2*r |
| `lora_dropout` | Dropout appliqué aux couches LoRA pour la régularisation | 0.05 à 0.1 |
| `target_modules` | Couches du modèle auxquelles appliquer LoRA | `["q_proj", "v_proj"]` ou `["all-linear"]` |

---

### Qu'est-ce que QLoRA ?

**Définition** : QLoRA (Quantized LoRA) combine la quantization du modèle de base en 4 bits avec l'adaptation LoRA. Le modèle original est chargé en précision réduite (4-bit) pour économiser la mémoire, et les adaptateurs LoRA sont entraînés en précision normale (float16 ou bfloat16).

**Le problème que QLoRA résout** :

Sans QLoRA, voici les problèmes rencontrés :

1. **Mémoire GPU insuffisante** : un modèle 7B en float16 nécessite 14 Go de VRAM, ce qui dépasse la capacité de nombreux GPU grand public
2. **LoRA seul ne suffit pas** : LoRA réduit les paramètres entraînables mais le modèle de base occupe toujours toute la mémoire
3. **Fine-tuning inaccessible** : seules les entreprises avec des GPU haut de gamme peuvent fine-tuner des LLM

**Comment QLoRA résout ces problèmes** :

| Problème | Solution apportée par QLoRA |
| -------- | --------------------------- |
| Mémoire GPU insuffisante | Le modèle 7B passe de 14 Go (float16) à 4 Go (4-bit) |
| LoRA seul ne suffit pas | QLoRA combine la réduction de mémoire (quantization) avec l'efficacité de LoRA |
| Fine-tuning inaccessible | Un GPU de 8 Go (RTX 3070) suffit pour fine-tuner un modèle 7B |

**Analogie concrète** : QLoRA est comme compresser une encyclopédie en format poche (quantization 4-bit) tout en ajoutant des marque-pages annotés (LoRA). L'encyclopédie compressée prend moins de place dans ton sac, et les marque-pages te permettent de la personnaliser pour ton usage.

**Ce que QLoRA n'est PAS** :

- QLoRA n'est pas une dégradation systématiquement catastrophique de qualité. Selon les tâches et les modèles, les papiers QLoRA rapportent souvent une performance **proche** du fine-tuning full (ordres de grandeur couramment cités autour de 95%+), mais ce n'est **pas** une garantie universelle : mesure toujours sur ton jeu d'évaluation.
- QLoRA n'est pas de la quantization seule. La quantization seule réduit la taille du modèle pour l'inférence. QLoRA utilise la quantization pendant l'entraînement, combinée avec LoRA.

**Comparaison des approches de fine-tuning** :

| Méthode | Mémoire GPU (7B) | Paramètres entraînés | Qualité |
| ------- | ----------------- | -------------------- | ------- |
| Fine-tuning full | ~60 Go | 100% (7B) | Référence |
| LoRA (float16) | ~16 Go | 0.1% à 1% | 95% à 99% |
| QLoRA (4-bit) | ~6 Go | 0.1% à 1% | souvent proche du full (à mesurer) |

---

### Qu'est-ce que PEFT ?

**Définition** : PEFT (Parameter-Efficient Fine-Tuning) est une bibliothèque Hugging Face qui implémente plusieurs méthodes de fine-tuning efficace en paramètres : LoRA, QLoRA, Prefix Tuning, P-Tuning, IA3. PEFT fournit une API unifiée pour appliquer ces méthodes à tout modèle Hugging Face.

**Le problème que PEFT résout** :

Sans PEFT, voici les problèmes rencontrés :

1. **Implémentation manuelle** : coder LoRA depuis zéro nécessite de modifier l'architecture du modèle manuellement
2. **Pas de standard** : chaque méthode de fine-tuning efficace a sa propre implémentation, incompatible avec les autres
3. **Gestion des adaptateurs** : sauvegarder, charger et combiner des adaptateurs sans outil dédié est fastidieux

**Comment PEFT résout ces problèmes** :

| Problème | Solution apportée par PEFT |
| -------- | -------------------------- |
| Implémentation manuelle | PEFT applique LoRA automatiquement avec 3 lignes de code |
| Pas de standard | Une seule API pour LoRA, QLoRA, Prefix Tuning, IA3, etc. |
| Gestion des adaptateurs | PEFT sauvegarde/charge les adaptateurs séparément du modèle de base |

**Analogie concrète** : PEFT est comme une boîte à outils standardisée pour un mécanicien. Au lieu de fabriquer ses propres clés, il utilise un jeu de clés normalisé (LoRA, QLoRA, etc.) qui s'adapte à tous les types de boulons (modèles Hugging Face).

**Ce que PEFT n'est PAS** :

- PEFT n'est pas un modèle. C'est une bibliothèque qui modifie des modèles existants pour les rendre plus efficaces à fine-tuner.
- PEFT n'est pas limité à LoRA. Il supporte plus de 10 méthodes différentes de fine-tuning efficace.

---

### Qu'est-ce que la quantization ?

**Définition** : La quantization est le processus de réduction de la précision numérique des poids d'un modèle. Au lieu de stocker chaque poids en float32 (32 bits) ou float16 (16 bits), on les compresse en int8 (8 bits) ou int4 (4 bits). Cela réduit la taille du modèle et la mémoire nécessaire à l'inférence.

**Le problème que la quantization résout** :

Sans quantization, voici les problèmes rencontrés :

1. **Modèles trop volumineux** : un modèle 70B en float16 nécessite 140 Go de VRAM
2. **Inférence lente** : plus les poids sont volumineux, plus la bande passante mémoire est un goulot d'étranglement
3. **Déploiement impossible** : impossible de faire tourner de gros modèles sur du matériel grand public

**Comment la quantization résout ces problèmes** :

| Problème | Solution apportée par la quantization |
| -------- | ------------------------------------- |
| Modèles trop volumineux | Un modèle 70B passe de 140 Go (float16) à 35 Go (4-bit) |
| Inférence lente | Moins de données à lire en mémoire = inférence plus rapide |
| Déploiement impossible | Un modèle 7B en 4-bit tourne sur un laptop avec 8 Go de VRAM |

**Analogie concrète** : La quantization est comme passer d'une photo RAW (haute qualité, gros fichier) à une photo JPEG (qualité réduite, petit fichier). La JPEG perd un peu de détail, mais elle est beaucoup plus facile à stocker et à partager. Pour la plupart des usages, la différence est imperceptible.

**Ce que la quantization n'est PAS** :

- La quantization n'est pas une suppression de paramètres. La pruning (élagage) supprime des paramètres. La quantization réduit la précision de tous les paramètres.
- La quantization n'est pas réversible. Une fois quantifié, le modèle ne peut pas retrouver sa précision originale.

**Méthodes de quantization** :

| Méthode | Précision | Qualité | Vitesse de quantization |
| ------- | --------- | ------- | ----------------------- |
| bitsandbytes (nf4) | 4-bit | Bonne | Instantanée (à la volée) |
| GPTQ | 4-bit | Très bonne | Lente (nécessite un dataset de calibration) |
| AWQ | 4-bit | Très bonne | Moyenne |
| GGUF (llama.cpp) | 2 à 8 bits | Variable selon bits | Rapide |

---

### Qu'est-ce qu'un dataset d'instruction ?

**Définition** : Un dataset d'instruction est un jeu de données formaté pour entraîner un LLM à suivre des instructions. Chaque exemple contient une instruction (la tâche à effectuer), un contexte optionnel, et la réponse attendue. Le format le plus courant est le format Alpaca ou le format conversationnel (chat).

**Le problème que les datasets d'instruction résolvent** :

Sans datasets d'instruction, voici les problèmes rencontrés :

1. **Modèle de base non aligné** : un modèle pré-entraîné prédit le prochain token mais ne sait pas répondre à des questions
2. **Format de réponse inconsistant** : le modèle ne suit pas un format de réponse prévisible
3. **Pas de données structurées** : les données brutes ne sont pas dans un format que le modèle peut apprendre efficacement

**Comment les datasets d'instruction résolvent ces problèmes** :

| Problème | Solution apportée par les datasets d'instruction |
| -------- | ------------------------------------------------- |
| Modèle non aligné | Les exemples montrent au modèle comment répondre à des instructions |
| Format inconsistant | Le format structuré (instruction/réponse) est appris par le modèle |
| Pas de données structurées | Le format Alpaca/Chat fournit un template clair et réutilisable |

**Analogie concrète** : Un dataset d'instruction est comme un cahier d'exercices corrigés pour un étudiant. Chaque exercice montre la question (instruction) et la réponse attendue. En étudiant suffisamment d'exercices, l'étudiant apprend le raisonnement et le format de réponse.

**Ce qu'un dataset d'instruction n'est PAS** :

- Un dataset d'instruction n'est pas du texte brut. Le texte brut sert au pré-entraînement (prédiction du prochain token). Le dataset d'instruction sert au fine-tuning supervisé (alignement).
- Un dataset d'instruction n'est pas un prompt few-shot. Le few-shot agit au moment de l'inférence. Le dataset d'instruction modifie les poids du modèle de façon permanente.

**Format Alpaca** :

```json
{
  "instruction": "Résume le texte suivant en une phrase.",
  "input": "Docker est une plateforme open source qui automatise le déploiement d'applications dans des conteneurs logiciels. Les conteneurs encapsulent une application avec toutes ses dépendances.",
  "output": "Docker automatise le déploiement d'applications dans des conteneurs isolés contenant toutes les dépendances nécessaires."
}
```

**Format conversationnel (Chat)** :

```json
{
  "messages": [
    {"role": "system", "content": "Tu es un assistant technique spécialisé en Docker."},
    {"role": "user", "content": "Qu'est-ce qu'un conteneur Docker ?"},
    {"role": "assistant", "content": "Un conteneur Docker est un environnement isolé qui contient une application et toutes ses dépendances. Il partage le noyau de l'OS hôte."}
  ]
}
```

---

## Étapes Pratiques

### Étape 1 : Installer les dépendances

```bash
# Installer les bibliothèques nécessaires
pip install transformers peft bitsandbytes datasets accelerate trl

# Vérifier que le GPU est détecté (si disponible)
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}, GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"Aucun\"}')"
```

**Résultat attendu** :

```text
CUDA: True, GPU: NVIDIA GeForce RTX 3080
```

---

### Étape 2 : Charger un modèle quantifié en 4 bits

Crée un fichier `finetune_lora.py`.

```python
# finetune_lora.py
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig
)

# Configuration de la quantization 4-bit (QLoRA)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,                    # Charger en 4-bit
    bnb_4bit_quant_type="nf4",            # Type de quantization NormalFloat4
    bnb_4bit_compute_dtype=torch.bfloat16, # Calculs en bfloat16
    bnb_4bit_use_double_quant=True         # Double quantization (économise ~0.4 bits)
)

# Nom du modèle (un petit modèle pour le tutoriel)
model_name = "microsoft/phi-2"

# Charger le tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token  # Définir le token de padding

# Charger le modèle quantifié
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto"  # Distribuer automatiquement sur les GPU disponibles
)

# Vérifier la taille du modèle en mémoire
print(f"Modèle chargé sur : {model.device}")
print(f"Mémoire GPU utilisée : {torch.cuda.memory_allocated() / 1e9:.2f} Go")
```

**Résultat attendu** :

```text
Modèle chargé sur : cuda:0
Mémoire GPU utilisée : 1.85 Go
```

---

### Étape 3 : Configurer et appliquer LoRA

```python
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

# Préparer le modèle quantifié pour l'entraînement
model = prepare_model_for_kbit_training(model)

# Configuration LoRA
lora_config = LoraConfig(
    r=16,                   # Rang des matrices LoRA
    lora_alpha=32,          # Facteur d'échelle (souvent 2 * r)
    lora_dropout=0.05,      # Dropout pour la régularisation
    bias="none",            # Ne pas entraîner les biais
    task_type="CAUSAL_LM",  # Type de tâche : génération causale
    target_modules=[        # Couches cibles pour LoRA
        "q_proj",           # Projection des requêtes (attention)
        "k_proj",           # Projection des clés (attention)
        "v_proj",           # Projection des valeurs (attention)
        "dense"             # Couches denses (feed-forward)
    ]
)

# Appliquer LoRA au modèle
model = get_peft_model(model, lora_config)

# Afficher les statistiques des paramètres
model.print_trainable_parameters()
```

**Résultat attendu** :

```text
trainable params: 6,553,600 || all params: 2,786,543,616 || trainable%: 0.2352
```

Le modèle a 2.7 milliards de paramètres au total, mais seulement 6.5 millions (0.23%) sont entraînables grâce à LoRA.

---

### Étape 4 : Préparer le dataset d'instruction

```python
from datasets import Dataset

# Créer un dataset d'instruction au format Alpaca
data = [
    {
        "instruction": "Explique ce qu'est Docker.",
        "input": "",
        "output": "Docker est une plateforme de conteneurisation qui permet d'isoler des applications avec toutes leurs dépendances dans des conteneurs légers."
    },
    {
        "instruction": "Quelle est la commande pour lister les conteneurs Docker ?",
        "input": "",
        "output": "La commande pour lister les conteneurs Docker actifs est `docker ps`. Pour voir tous les conteneurs (y compris les arrêtés), utilise `docker ps -a`."
    },
    {
        "instruction": "Écris un Dockerfile pour une application PHP.",
        "input": "L'application utilise PHP 8.3 et Nginx.",
        "output": "```dockerfile\nFROM php:8.3-fpm\nRUN apt-get update && apt-get install -y nginx\nCOPY . /var/www/html\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]\n```"
    }
]

# Convertir en Dataset Hugging Face
dataset = Dataset.from_list(data)


# Formater les exemples pour le modèle
def format_instruction(example):
    """Convertit un exemple Alpaca en prompt formaté."""
    if example["input"]:
        text = (
            f"### Instruction:\n{example['instruction']}\n\n"
            f"### Input:\n{example['input']}\n\n"
            f"### Response:\n{example['output']}"
        )
    else:
        text = (
            f"### Instruction:\n{example['instruction']}\n\n"
            f"### Response:\n{example['output']}"
        )
    return {"text": text}


# Appliquer le formatage
dataset = dataset.map(format_instruction)

# Tokenizer les exemples
def tokenize(example):
    result = tokenizer(
        example["text"],
        truncation=True,
        max_length=512,
        padding="max_length"
    )
    result["labels"] = result["input_ids"].copy()
    return result

tokenized_dataset = dataset.map(tokenize, remove_columns=dataset.column_names)
print(f"Dataset prêt : {len(tokenized_dataset)} exemples")
```

**Résultat attendu** :

```text
Dataset prêt : 3 exemples
```

---

### Étape 5 : Lancer le fine-tuning

```python
from trl import SFTConfig, SFTTrainer

# Configuration de l'entraînement
# SFTConfig remplace TrainingArguments pour le SFT et accueille les
# paramètres spécifiques au fine-tuning comme max_seq_length.
training_args = SFTConfig(
    output_dir="./lora-output",        # Dossier de sortie
    num_train_epochs=3,                # Nombre d'époques
    per_device_train_batch_size=1,     # Batch size par GPU
    gradient_accumulation_steps=4,     # Accumuler 4 steps avant de mettre à jour
    learning_rate=2e-4,                # Learning rate (standard pour LoRA)
    weight_decay=0.01,                 # Régularisation L2
    logging_steps=10,                  # Logger toutes les 10 steps
    save_strategy="epoch",            # Sauvegarder à chaque époque
    fp16=True,                         # Entraînement en précision mixte
    optim="paged_adamw_8bit",          # Optimiseur 8-bit (économise la mémoire)
    warmup_ratio=0.03,                 # Warmup de 3% des steps
    max_seq_length=512                 # Longueur maximale des séquences
)

# Créer le trainer
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    processing_class=tokenizer         # Tokenizer pour le traitement du texte
)

# Lancer l'entraînement
trainer.train()

# Sauvegarder l'adaptateur LoRA (quelques Mo seulement)
model.save_pretrained("./lora-adapter")
tokenizer.save_pretrained("./lora-adapter")
print("Adaptateur LoRA sauvegardé dans ./lora-adapter")
```

**Résultat attendu** :

```text
{'loss': 2.3456, 'learning_rate': 0.0002, 'epoch': 1.0}
{'loss': 1.8765, 'learning_rate': 0.00015, 'epoch': 2.0}
{'loss': 1.2345, 'learning_rate': 0.0001, 'epoch': 3.0}
Adaptateur LoRA sauvegardé dans ./lora-adapter
```

---

### Étape 6 : Charger et utiliser le modèle fine-tuné

```python
from peft import PeftModel

# Recharger le modèle de base quantifié
base_model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    device_map="auto"
)

# Appliquer l'adaptateur LoRA sauvegardé
model = PeftModel.from_pretrained(base_model, "./lora-adapter")

# Générer une réponse
prompt = "### Instruction:\nExplique ce qu'est un volume Docker.\n\n### Response:\n"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

outputs = model.generate(
    **inputs,
    max_new_tokens=150,
    temperature=0.7,
    do_sample=True
)

response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(response)
```

**Résultat attendu** :

```text
### Instruction:
Explique ce qu'est un volume Docker.

### Response:
Un volume Docker est un mécanisme de persistance des données. Quand un conteneur
est supprimé, tout son contenu disparaît. Un volume permet de stocker des données
en dehors du conteneur, sur le système hôte, pour qu'elles survivent à la
suppression du conteneur.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install peft bitsandbytes` | Installe PEFT et la quantization bitsandbytes |
| `pip install trl` | Installe TRL (Transformer Reinforcement Learning) pour SFTTrainer |
| `model.print_trainable_parameters()` | Affiche le nombre de paramètres entraînables |
| `model.save_pretrained("./adapter")` | Sauvegarde l'adaptateur LoRA |
| `PeftModel.from_pretrained(base, "./adapter")` | Charge un adaptateur LoRA sur un modèle de base |
| `model.merge_and_unload()` | Fusionne LoRA dans le modèle de base (pour l'export) |

---

## Pièges Fréquents

### Piège 1 : Choisir un rang LoRA trop faible

⚠️ **Problème** : Un rang `r=4` peut être insuffisant pour des tâches complexes, produisant un modèle qui n'apprend pas correctement.

✅ **Solution** : Commence avec `r=16` et ajuste selon les résultats. Pour des tâches simples (classification), `r=8` suffit. Pour des tâches complexes (génération), monte à `r=32` ou `r=64`.

---

### Piège 2 : Oublier de préparer le modèle quantifié pour l'entraînement

⚠️ **Problème** : Appliquer LoRA directement sur un modèle quantifié sans appeler `prepare_model_for_kbit_training()` provoque des erreurs de gradient.

✅ **Solution** : Appelle toujours `prepare_model_for_kbit_training(model)` avant d'appliquer LoRA sur un modèle quantifié.

```python
from peft import prepare_model_for_kbit_training

# Obligatoire avant LoRA sur un modèle quantifié
model = prepare_model_for_kbit_training(model)
```

---

### Piège 3 : Dataset trop petit ou mal formaté

⚠️ **Problème** : Un dataset de 10 exemples produit un modèle qui surapprendt (overfitting). Un format inconsistant (mélange Alpaca et Chat) confond le modèle.

✅ **Solution** : Utilise au minimum 100 exemples pour un fine-tuning correct (1000+ recommandé). Applique un seul format cohérent pour tout le dataset. Vérifie manuellement 10 exemples avant de lancer l'entraînement.

---

### Piège 4 : Ne pas évaluer avant et après le fine-tuning

⚠️ **Problème** : Sans évaluation, impossible de savoir si le fine-tuning a amélioré ou dégradé le modèle.

✅ **Solution** : Mets de côté 10% à 20% des données en dataset de validation. Compare les métriques (loss, qualité des réponses) avant et après le fine-tuning sur ce dataset de validation.

---

## Checklist de Validation

- [ ] Je comprends la différence entre fine-tuning full, LoRA et QLoRA
- [ ] Je sais expliquer pourquoi LoRA est plus efficace que le fine-tuning full
- [ ] Je sais configurer et appliquer LoRA avec la bibliothèque PEFT
- [ ] Je sais charger un modèle en quantization 4-bit avec bitsandbytes
- [ ] Je sais préparer un dataset d'instruction au format Alpaca ou Chat
- [ ] Je sais lancer un fine-tuning avec SFTTrainer
- [ ] Je sais sauvegarder et recharger un adaptateur LoRA
- [ ] Je comprends les hyperparamètres clés de LoRA (r, alpha, target_modules)

---

## Exercice Pratique

**Énoncé** : Fine-tune un petit LLM avec LoRA sur un dataset custom d'au moins 50 exemples.

1. Crée un dataset d'instruction au format Alpaca sur un sujet de ton choix (minimum 50 exemples)
2. Charge un modèle quantifié en 4-bit (ex : `microsoft/phi-2` ou `TinyLlama/TinyLlama-1.1B-Chat-v1.0`)
3. Configure et applique LoRA avec `r=16`, `lora_alpha=32`
4. Entraîne le modèle pendant 3 époques
5. Compare les réponses du modèle avant et après le fine-tuning sur 5 questions test

**Indications** :

- Utilise `datasets.Dataset.from_list()` pour créer le dataset
- Configure `BitsAndBytesConfig` avec `load_in_4bit=True`
- Utilise `SFTTrainer` de la bibliothèque `trl` pour l'entraînement
- Sauvegarde l'adaptateur avec `model.save_pretrained()`

**Résultat attendu** : L'adaptateur LoRA sauvegardé (quelques Mo), et une comparaison visible entre les réponses du modèle de base et du modèle fine-tuné montrant une amélioration sur le domaine ciblé.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import Dataset
from trl import SFTConfig, SFTTrainer

# --- Configuration ---
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
OUTPUT_DIR = "./lora-exercice"

# --- Étape 1 : Créer le dataset (extrait de 50+ exemples) ---
data = []
# Ajouter tes 50+ exemples ici au format Alpaca
# Exemple avec quelques entrées
examples = [
    ("Qu'est-ce que Docker ?",
     "Docker est une plateforme de conteneurisation open source."),
    ("Qu'est-ce qu'un conteneur ?",
     "Un conteneur est un environnement isolé contenant une application et ses dépendances."),
    ("Quelle commande lance un conteneur ?",
     "La commande `docker run` crée et démarre un conteneur à partir d'une image."),
    # ... ajouter 47+ exemples supplémentaires
]

for instruction, output in examples:
    data.append({
        "instruction": instruction,
        "input": "",
        "output": output
    })

dataset = Dataset.from_list(data)


def format_example(example):
    text = (
        f"### Instruction:\n{example['instruction']}\n\n"
        f"### Response:\n{example['output']}"
    )
    return {"text": text}


dataset = dataset.map(format_example)

# --- Étape 2 : Charger le modèle quantifié ---
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=bnb_config,
    device_map="auto"
)

# --- Étape 3 : Configurer LoRA ---
model = prepare_model_for_kbit_training(model)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"]
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# --- Étape 4 : Entraîner ---
training_args = SFTConfig(
    output_dir=OUTPUT_DIR,
    num_train_epochs=3,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=5,
    save_strategy="epoch",
    optim="paged_adamw_8bit",
    warmup_ratio=0.03,
    max_seq_length=512
)

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    processing_class=tokenizer
)

trainer.train()
model.save_pretrained(f"{OUTPUT_DIR}/adapter")
tokenizer.save_pretrained(f"{OUTPUT_DIR}/adapter")

# --- Étape 5 : Comparer avant/après ---
questions_test = [
    "Qu'est-ce qu'une image Docker ?",
    "Comment arrêter un conteneur ?",
    "Qu'est-ce qu'un Dockerfile ?",
    "Qu'est-ce qu'un volume ?",
    "Comment lister les images Docker ?"
]

print("\n=== Comparaison avant/après fine-tuning ===")
for q in questions_test:
    prompt = f"### Instruction:\n{q}\n\n### Response:\n"
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=100, temperature=0.7)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"\nQ: {q}")
    print(f"R: {response.split('### Response:')[-1].strip()}")
```

---

## Navigation

← Fiche précédente : **[03 - RAG - Retrieval-Augmented Generation](03-rag-retrieval-augmented-generation.md)**

→ Fiche suivante : **[05 - Évaluation des LLM](05-evaluation-llm.md)**
