---
tags:
  - IA
  - Avancé
  - Concept
description: "Architecture et fonctionnement des LLM : decoder-only, KV-cache, scaling laws, tokenization BPE, RLHF et DPO"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 6 - Large Language Models"
---

# 01 - Architecture et fonctionnement des LLM

> **En bref** : À la fin de cette fiche, tu sauras décrire l'architecture decoder-only des LLM modernes, expliquer le rôle du KV-cache dans l'inférence, comprendre les scaling laws qui guident l'entraînement, analyser le fonctionnement de la tokenization BPE, et distinguer les méthodes d'alignement RLHF et DPO. Lecture estimée : 40 min.


## Prérequis

- [Phase 5 - Fiche 01 : Transformers - l'architecture](../05-architectures-modernes-nlp/01-transformers-architecture.md) (self-attention, multi-head attention, positional encoding)
- [Phase 5 - Fiche 02 : Du NLP classique aux LLM](../05-architectures-modernes-nlp/02-nlp-classique-llm.md) (tokenization, Word2Vec, BERT, GPT)
- [Phase 4 - Fiche 01 : Réseaux de neurones](../04-deep-learning-fondamental/01-reseaux-neurones-theorie-pratique.md) (backpropagation, loss functions)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire l'architecture decoder-only des LLM modernes, expliquer le rôle du KV-cache dans l'inférence, comprendre les scaling laws qui guident l'entraînement, analyser le fonctionnement de la tokenization BPE, et distinguer les méthodes d'alignement RLHF et DPO.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'architecture decoder-only ?

**Définition** : L'architecture decoder-only est une variante du Transformer qui n'utilise que la partie décodeur. Elle prédit le prochain token en se basant uniquement sur les tokens précédents, grâce à un masque d'attention causale qui empêche le modèle de "regarder dans le futur".

**Le problème que l'architecture decoder-only résout** :

Sans architecture decoder-only, voici les problèmes rencontrés :

1. **Complexité inutile** : l'architecture encoder-decoder complète est plus lourde et plus lente pour la génération de texte
2. **Pas de génération autoregressive efficace** : les modèles bidirectionnels (comme BERT) ne peuvent pas générer du texte mot par mot de manière naturelle
3. **Difficulté à scaler** : les architectures plus complexes sont plus difficiles à entraîner à grande échelle

**Comment l'architecture decoder-only résout ces problèmes** :

| Problème | Solution apportée par le decoder-only |
| -------- | ------------------------------------- |
| Complexité inutile | Un seul bloc (le décodeur) suffit pour la génération de texte |
| Pas de génération autoregressive | Le masque causal permet de prédire le prochain token à chaque étape |
| Difficulté à scaler | L'architecture simplifiée scale mieux avec plus de paramètres et de données |

**Analogie concrète** : Imagine que tu écris une histoire mot par mot sur un tableau noir. Tu ne peux lire que ce que tu as déjà écrit (les mots à gauche) pour décider du mot suivant. Tu ne peux pas "tricher" en regardant les mots qui viendront après. C'est exactement ce que fait le masque causal : il cache tous les tokens futurs.

**Ce que l'architecture decoder-only n'est PAS** :

- Ce n'est pas un encoder-decoder comme le Transformer original. Le Transformer original a un encodeur qui lit l'entrée et un décodeur qui génère la sortie. Le decoder-only fait les deux en un seul bloc.
- Ce n'est pas un modèle bidirectionnel comme BERT. BERT lit le texte dans les deux sens simultanément. Le decoder-only ne lit que de gauche à droite.

**Comparaison des architectures Transformer** :

| Encoder-only (BERT) | Encoder-decoder (T5) | Decoder-only (GPT) |
| -------------------- | -------------------- | ------------------- |
| Attention bidirectionnelle | Cross-attention entre encoder et decoder | Attention causale (gauche à droite) |
| Classification, NER, embeddings | Traduction, résumé | Génération de texte, chat, code |
| Ne génère pas de texte | Génère à partir d'une entrée structurée | Génère token par token |

Le diagramme suivant illustre le flux de données dans un modèle decoder-only, des tokens d'entrée jusqu'à la prédiction du token suivant :

<div class="diagram-design">
<p><a href="../../../diagrams/ia-06-large-language-models-01-architecture-fonctionnement-llm-1.html">Qu&#x27;est-ce que l&#x27;architecture decoder-only ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-06-large-language-models-01-architecture-fonctionnement-llm-1.html" title="Qu&#x27;est-ce que l&#x27;architecture decoder-only ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

#### Fonctionnement du masque causal

Le masque causal (causal attention mask) est une matrice triangulaire inférieure appliquée aux scores d'attention. Pour une séquence de 4 tokens :

```text
Token:    [Le]  [chat] [mange] [du]
[Le]       1      0      0      0
[chat]     1      1      0      0
[mange]    1      1      1      0
[du]       1      1      1      1
```

- `1` signifie que le token de la ligne peut "voir" le token de la colonne
- `0` signifie que l'attention est bloquée (mis à -infini avant le softmax)

#### Next token prediction

L'objectif d'entraînement est simple : prédire le prochain token. Pour la phrase "Le chat mange du poisson", le modèle apprend :

- Entrée : `[Le]` -> Prédiction : `[chat]`
- Entrée : `[Le, chat]` -> Prédiction : `[mange]`
- Entrée : `[Le, chat, mange]` -> Prédiction : `[du]`
- Entrée : `[Le, chat, mange, du]` -> Prédiction : `[poisson]`

La loss est la cross-entropy entre la distribution prédite et le token réel.

---

### Qu'est-ce que le KV-cache ?

**Définition** : Le KV-cache (Key-Value cache) est une technique d'optimisation qui stocke en mémoire les vecteurs de clés (K) et de valeurs (V) déjà calculés pour les tokens précédents, évitant de les recalculer à chaque nouveau token généré.

**Le problème que le KV-cache résout** :

Sans KV-cache, voici les problèmes rencontrés :

1. **Recalcul redondant** : à chaque nouveau token, il faut recalculer l'attention pour tous les tokens précédents, ce qui est du gaspillage
2. **Complexité quadratique** : le coût de l'attention croît en O(n^2) avec la longueur de la séquence, rendant l'inférence très lente pour les longues séquences
3. **Latence élevée** : générer chaque token prend de plus en plus de temps à mesure que la séquence s'allonge

**Comment le KV-cache résout ces problèmes** :

| Problème | Solution apportée par le KV-cache |
| -------- | --------------------------------- |
| Recalcul redondant | Les K et V des tokens précédents sont stockés et réutilisés |
| Complexité quadratique | Seul le nouveau token calcule ses Q, K, V ; les anciens K/V sont lus depuis le cache |
| Latence élevée | Le temps par token devient quasi-constant (O(n) au lieu de O(n^2)) |

**Analogie concrète** : Imagine un professeur qui corrige des copies. Sans KV-cache, il relit toutes les copies depuis le début à chaque nouvelle correction. Avec le KV-cache, il note les points importants de chaque copie sur des post-it (le cache). Pour la copie suivante, il consulte ses post-it au lieu de tout relire.

**Ce que le KV-cache n'est PAS** :

- Le KV-cache n'est pas un cache disque. Il est stocké en mémoire GPU et existe uniquement pendant l'inférence.
- Le KV-cache n'est pas un paramètre du modèle. Les paramètres sont fixes après l'entraînement. Le KV-cache est dynamique et change à chaque requête.

#### Taille du KV-cache

La taille du KV-cache dépend de :

- Nombre de couches (L)
- Nombre de têtes d'attention (H)
- Dimension par tête (d)
- Longueur de la séquence (n)

Formule : `taille = 2 * L * H * d * n * taille_type`

Pour un modèle comme Llama 2 70B (80 couches, 64 têtes, dimension 128, en float16) avec 4096 tokens :
Pour un modèle **MHA** de 80 couches, 64 têtes, d=128, float16, 4096 tokens : `2 * L * H * d * n * 2 ≈ 10 Go`. Llama 2 70B utilise GQA (64 têtes query, **8 têtes KV**) : remplacer H par n_kv_heads=8 donne ≈ 1,25 Go, pas 10 Go.

#### Le speculative decoding

> **Note** : Cette section décrit des techniques d'optimisation de l'inférence à la date de rédaction. Les outils (serveurs d'inférence, bibliothèques) évoluent vite.

Le KV-cache supprime le recalcul redondant, mais un problème reste : un LLM decoder-only génère les tokens **un par un** (de façon autoregressive). Chaque token nécessite une passe complète dans le réseau. Pour un gros modèle, chaque passe est lente, et on ne peut pas en lancer la suivante avant d'avoir le token courant.

**Le speculative decoding** (décodage spéculatif) attaque ce goulot d'étranglement avec deux modèles :

1. Un petit modèle rapide (le "draft model", ou modèle brouillon) propose d'un coup plusieurs tokens à l'avance (par exemple 4 ou 5).
2. Le gros modèle (celui dont on veut la qualité) vérifie ces tokens proposés **en une seule passe**, en parallèle, au lieu de les générer un par un.
3. Tous les tokens proposés qui coïncident avec ce que le gros modèle aurait produit sont acceptés d'un bloc. Au premier désaccord, on rejette le reste et le gros modèle reprend la main.

Le résultat est **identique** à ce que le gros modèle aurait généré seul (aucune perte de qualité), mais on produit souvent plusieurs tokens par passe au lieu d'un seul, donc plus vite.

**Analogie concrète** : imagine un expert (le gros modèle) qui valide une lettre mot par mot, ce qui est lent. Un assistant rapide (le petit modèle) devine les prochains mots et les écrit au crayon. L'expert relit ce brouillon d'un coup d'oeil : tant que les mots lui conviennent, il les valide tous d'un trait. Au premier mot incorrect, il le corrige et l'assistant repart de là. L'expert garde le contrôle total du résultat : il valide par blocs au lieu de mot par mot.

**Ce que le speculative decoding n'est PAS** :

- Ce n'est pas une approximation. La sortie est exactement celle du gros modèle. On accélère sans dégrader la qualité.
- Ce n'est pas du KV-cache. Le KV-cache évite de recalculer le passé d'un seul modèle. Le speculative decoding fait collaborer deux modèles pour avancer plus vite sur le futur.

**Une autre optimisation complémentaire, le continuous batching** : sur un serveur qui reçoit de nombreuses requêtes en même temps, le continuous batching regroupe dynamiquement les requêtes en cours pour occuper le GPU au maximum, sans attendre que toutes les requêtes d'un lot soient terminées. Des serveurs d'inférence comme **vLLM** combinent ce continuous batching avec une gestion mémoire fine du KV-cache (PagedAttention) pour maximiser le débit (tokens par seconde sur l'ensemble des utilisateurs).

| Optimisation | Ce qu'elle vise | Idée |
| ------------ | --------------- | ---- |
| KV-cache | Latence d'une requête | Réutiliser les K/V des tokens déjà calculés |
| Speculative decoding | Latence d'une requête | Proposer plusieurs tokens via un petit modèle, vérifiés en bloc |
| Continuous batching (vLLM) | Débit global du serveur | Regrouper dynamiquement les requêtes pour saturer le GPU |

---

### Que sont les scaling laws ?

**Définition** : Les scaling laws sont des lois empiriques qui décrivent la relation entre les performances d'un LLM et trois facteurs : le nombre de paramètres (N), la taille du dataset d'entraînement (D) et le budget de calcul (C, en FLOPs).

**Le problème que les scaling laws résolvent** :

Sans scaling laws, voici les problèmes rencontrés :

1. **Allocation aveugle des ressources** : impossible de savoir s'il vaut mieux augmenter la taille du modèle ou la quantité de données
2. **Gaspillage de compute** : on risque d'entraîner un modèle trop gros sur trop peu de données, ou l'inverse
3. **Pas de prédiction** : impossible d'estimer les performances avant un entraînement coûteux

**Comment les scaling laws résolvent ces problèmes** :

| Problème | Solution apportée par les scaling laws |
| -------- | -------------------------------------- |
| Allocation aveugle | Les lois donnent le ratio optimal paramètres/données pour un budget donné |
| Gaspillage de compute | Chinchilla montre qu'il faut ~20 tokens par paramètre |
| Pas de prédiction | La loss suit une loi de puissance prévisible en fonction de N, D et C |

**Analogie concrète** : Imagine que tu construis une maison avec un budget fixe. Les scaling laws sont comme un architecte qui te dit : "Avec ce budget, voici la surface optimale (paramètres) et la qualité des matériaux optimale (données). Si tu fais une maison trop grande avec des matériaux bon marché, elle sera fragile. Si tu fais une maison trop petite avec des matériaux luxueux, tu gaspilles ton budget."

#### Lois de Chinchilla (2022)

L'article "Training Compute-Optimal Large Language Models" (Hoffmann et al., DeepMind) a montré que :

- Les modèles précédents (comme GPT-3 175B entraîné sur 300B tokens) étaient **sous-entraînés** : trop de paramètres pour trop peu de données
- Le ratio optimal est d'environ **20 tokens par paramètre**
- Un modèle plus petit entraîné sur plus de données peut surpasser un modèle plus gros entraîné sur moins de données

| Modèle | Paramètres | Tokens d'entraînement | Ratio tokens/paramètres |
| ------ | ---------- | --------------------- | ----------------------- |
| GPT-3 | 175B | 300B | 1.7 (sous-optimal) |
| Chinchilla | 70B | 1400B | 20 (optimal) |
| Llama 2 | 70B | 2000B | 28.6 (sur-optimal pour l'inférence) |

---

### Qu'est-ce que la tokenization avancée (BPE) ?

**Définition** : La tokenization Byte Pair Encoding (BPE) est un algorithme qui découpe le texte en sous-unités (subwords) apprises statistiquement à partir d'un corpus. Elle permet de représenter n'importe quel texte avec un vocabulaire de taille fixe.

**Le problème que BPE résout** :

Sans tokenization BPE, voici les problèmes rencontrés :

1. **Vocabulaire trop grand** : une tokenization par mot nécessite un vocabulaire de centaines de milliers de mots, plus tous les mots hors vocabulaire (OOV)
2. **Mots inconnus** : les mots rares ou les fautes de frappe sont impossibles à représenter
3. **Pas de partage morphologique** : "jouer", "joueur", "jouait" sont traités comme trois mots complètement indépendants

**Comment BPE résout ces problèmes** :

| Problème | Solution apportée par BPE |
| -------- | ------------------------- |
| Vocabulaire trop grand | Le vocabulaire est fixé (32K-128K tokens typiquement) |
| Mots inconnus | Tout mot peut être décomposé en sous-unités connues |
| Pas de partage morphologique | "jou" + "er", "jou" + "eur", "jou" + "ait" partagent le même préfixe |

**Analogie concrète** : Imagine des blocs LEGO. Au lieu d'avoir une pièce unique pour chaque objet (une voiture complète, une maison complète), tu as des briques de base que tu assembles. BPE apprend les briques les plus utiles : les combinaisons de lettres les plus fréquentes deviennent des briques.

#### Vocabulaire optimal et tokens spéciaux

Les LLM modernes utilisent des tokens spéciaux :

| Token | Rôle | Exemple |
| ----- | ---- | ------- |
| `<bos>` | Début de séquence (beginning of sequence) | Placé au début de chaque texte |
| `<eos>` | Fin de séquence (end of sequence) | Signal d'arrêt de la génération |
| `<pad>` | Remplissage pour aligner les séquences dans un batch | Ajouté à la fin des séquences courtes |
| `<unk>` | Token inconnu (rare avec BPE) | Caractères hors vocabulaire |
| `<\|im_start\|>` | Début de message (chat models) | Délimite les rôles dans une conversation |

La taille du vocabulaire est un compromis :

- **Trop petit** (8K) : les mots sont découpés en trop de tokens, les séquences sont longues
- **Trop grand** (256K) : l'embedding matrix est énorme, beaucoup de tokens rares mal appris
- **Optimal** (32K-128K) : bon équilibre entre compression et qualité des représentations

---

### Qu'est-ce que le RLHF ?

**Définition** : Le RLHF (Reinforcement Learning from Human Feedback) est une technique d'alignement qui utilise les préférences humaines pour affiner un LLM pré-entraîné. Le processus implique trois étapes : le supervised fine-tuning (SFT), l'entraînement d'un reward model, et l'optimisation par PPO.

**Le problème que le RLHF résout** :

Sans RLHF, voici les problèmes rencontrés :

1. **Réponses non alignées** : un LLM pré-entraîné génère du texte statistiquement probable mais pas forcément utile, honnête ou inoffensif
2. **Comportements indésirables** : le modèle peut générer du contenu toxique, des hallucinations présentées avec confiance, ou refuser de répondre à des questions légitimes
3. **Pas de notion de qualité** : le modèle ne distingue pas une bonne réponse d'une mauvaise ; il optimise uniquement la probabilité du prochain token

**Comment le RLHF résout ces problèmes** :

| Problème | Solution apportée par le RLHF |
| -------- | ----------------------------- |
| Réponses non alignées | Les préférences humaines guident le modèle vers des réponses utiles |
| Comportements indésirables | Le reward model pénalise les réponses toxiques ou incorrectes |
| Pas de notion de qualité | PPO optimise une récompense apprise, pas juste la log-vraisemblance |

**Analogie concrète** : Imagine un cuisinier apprenti (le LLM pré-entraîné) qui sait cuisiner mais ne sait pas ce que les clients préfèrent. Le RLHF, c'est un système où des clients goûtent deux plats et disent lequel ils préfèrent (le reward model). Le cuisinier ajuste ensuite ses recettes pour maximiser la satisfaction des clients (PPO).

**Les trois étapes du RLHF** :

1. **SFT (Supervised Fine-Tuning)** : on affine le modèle pré-entraîné sur des exemples de conversations de haute qualité, écrits par des humains
2. **Reward Model** : des annotateurs comparent des paires de réponses et indiquent laquelle est meilleure. Un modèle de récompense apprend à prédire ces préférences
3. **PPO (Proximal Policy Optimization)** : le LLM est optimisé pour maximiser la récompense prédite, avec une contrainte KL pour ne pas trop s'éloigner du modèle SFT

**Ce que le RLHF n'est PAS** :

- Le RLHF n'est pas du fine-tuning supervisé classique. Le SFT est une étape préparatoire, mais le coeur du RLHF est l'optimisation par RL avec un reward model.
- Le RLHF ne garantit pas un modèle parfaitement aligné. Le reward model lui-même peut avoir des biais, et l'optimisation peut conduire à du "reward hacking" (le modèle trouve des failles dans le reward model).

---

### Qu'est-ce que le DPO ?

**Définition** : Le DPO (Direct Preference Optimization) est une alternative au RLHF qui élimine le besoin d'un reward model séparé et de l'optimisation par RL (PPO). Il optimise directement le modèle à partir des paires de préférences humaines en reformulant le problème comme une classification.

**Le problème que le DPO résout** :

Sans DPO, voici les problèmes rencontrés :

1. **Complexité du pipeline RLHF** : il faut entraîner un reward model séparé, puis faire du RL avec PPO, ce qui est instable et coûteux
2. **Instabilité de PPO** : l'entraînement par RL est notoirement instable (hyperparamètres sensibles, effondrement du mode, reward hacking)
3. **Coût computationnel** : le RLHF nécessite de maintenir quatre modèles en mémoire simultanément (policy, référence, reward, critic)

**Comment le DPO résout ces problèmes** :

| Problème | Solution apportée par le DPO |
| -------- | ---------------------------- |
| Complexité du pipeline | Un seul objectif d'entraînement, pas de reward model séparé |
| Instabilité de PPO | DPO est une loss de classification stable et bien comprise |
| Coût computationnel | Seulement deux modèles nécessaires (policy et référence) |

**Analogie concrète** : Imagine que tu formes un serveur de restaurant. Avec le RLHF, tu embauches d'abord un critique gastronomique (reward model) qui note les plats, puis tu demandes au serveur d'optimiser les notes du critique (PPO). Avec le DPO, tu montres directement au serveur des paires de plats en disant "les clients préfèrent celui-ci" et il apprend directement de ces comparaisons, sans intermédiaire.

**Comparaison RLHF vs DPO** :

| RLHF | DPO |
| ---- | --- |
| 3 étapes (SFT, Reward Model, PPO) | 2 étapes (SFT, DPO) |
| Reward model séparé nécessaire | Pas de reward model |
| Instable (RL) | Stable (classification) |
| 4 modèles en mémoire | 2 modèles en mémoire |
| Plus flexible (reward model réutilisable) | Plus simple à implémenter |

---

## Étapes Pratiques

### Étape 1 : Explorer un tokenizer BPE

Installe la bibliothèque `tiktoken` (tokenizer utilisé par les modèles OpenAI) et `transformers` (Hugging Face).

```bash
# Installer les bibliothèques nécessaires
pip install tiktoken transformers
```

Crée un script Python pour analyser la tokenization :

```python
# fichier : explore_tokenizer.py
# Ce script montre comment un tokenizer BPE découpe du texte en tokens

import tiktoken

# Charger le tokenizer de GPT-4 (cl100k_base)
enc = tiktoken.get_encoding("cl100k_base")

# Texte à tokenizer
texte = "Les Large Language Models sont des réseaux de neurones entraînés sur du texte."

# Encoder le texte en tokens (liste d'identifiants numériques)
tokens = enc.encode(texte)

# Afficher les résultats
print(f"Texte original : {texte}")
print(f"Nombre de tokens : {len(tokens)}")
print(f"Identifiants des tokens : {tokens}")

# Décoder chaque token individuellement pour voir le découpage
for token_id in tokens:
    # decode_single_token_bytes retourne les octets du token
    token_bytes = enc.decode_single_token_bytes(token_id)
    print(f"  ID {token_id:>6} -> '{token_bytes.decode('utf-8', errors='replace')}'")
```

**Résultat attendu** :

```text
Texte original : Les Large Language Models sont des réseaux de neurones entraînés sur du texte.
Nombre de tokens : 18
Identifiants des tokens : [9829, 20902, 11688, 27972, 4269, 951, ...]
  ID   9829 -> 'Les'
  ID  20902 -> ' Large'
  ID  11688 -> ' Language'
  ID  27972 -> ' Models'
  ...
```

---

### Étape 2 : Comparer la tokenization de différents textes

```python
# fichier : compare_tokens.py
# Compare le nombre de tokens pour différents types de texte

import tiktoken

enc = tiktoken.get_encoding("cl100k_base")

# Liste de textes à comparer
textes = [
    "Hello, world!",                           # Anglais simple
    "Bonjour, le monde !",                     # Français simple
    "Les réseaux de neurones convolutifs",     # Français technique
    "def fibonacci(n): return n if n < 2 else fibonacci(n-1) + fibonacci(n-2)",  # Code Python
    "SELECT * FROM users WHERE age > 18;",     # SQL
    "🎉🎊🎈",                                  # Emojis
    "こんにちは世界",                             # Japonais
]

print(f"{'Texte':<60} {'Tokens':>7} {'Ratio':>7}")
print("-" * 76)

for texte in textes:
    tokens = enc.encode(texte)
    # Le ratio caractères/tokens indique l'efficacité de la tokenization
    ratio = len(texte) / len(tokens)
    print(f"{texte:<60} {len(tokens):>7} {ratio:>7.1f}")
```

**Résultat attendu** :

```text
Texte                                                        Tokens   Ratio
----------------------------------------------------------------------------
Hello, world!                                                      4     3.3
Bonjour, le monde !                                                6     3.2
Les réseaux de neurones convolutifs                               10     3.6
def fibonacci(n): return n if n < 2 else fibonacci(n-1)...        22     3.3
SELECT * FROM users WHERE age > 18;                                9     3.8
🎉🎊🎈                                                             6     1.0
こんにちは世界                                                       7     1.0
```

Le ratio montre que les langues non latines et les emojis nécessitent plus de tokens par caractère.

---

### Étape 3 : Visualiser le masque causal d'attention

```python
# fichier : causal_mask.py
# Visualise le masque d'attention causale utilisé dans les LLM decoder-only

import torch

# Créer une séquence de 6 tokens
seq_len = 6
tokens = ["Le", "chat", "mange", "du", "pois", "son"]

# Créer le masque causal : matrice triangulaire inférieure
# torch.tril crée une matrice triangulaire inférieure remplie de 1
causal_mask = torch.tril(torch.ones(seq_len, seq_len))

print("Masque causal d'attention :")
print(f"{'':>8}", end="")
for t in tokens:
    print(f"{t:>8}", end="")
print()

for i, row_token in enumerate(tokens):
    print(f"{row_token:>8}", end="")
    for j in range(seq_len):
        val = causal_mask[i, j].item()
        # 1.0 = le token peut voir, 0.0 = bloqué
        print(f"{'  OK':>8}" if val == 1.0 else f"{'  --':>8}", end="")
    print()

print()
print("OK = le token de la ligne peut 'voir' le token de la colonne")
print("-- = attention bloquée (le token ne peut pas voir le futur)")
```

**Résultat attendu** :

```text
Masque causal d'attention :
              Le    chat   mange      du    pois     son
      Le      OK      --      --      --      --      --
    chat      OK      OK      --      --      --      --
   mange      OK      OK      OK      --      --      --
      du      OK      OK      OK      OK      --      --
    pois      OK      OK      OK      OK      OK      --
     son      OK      OK      OK      OK      OK      OK

OK = le token de la ligne peut 'voir' le token de la colonne
-- = attention bloquée (le token ne peut pas voir le futur)
```

---

### Étape 4 : Explorer la structure d'un LLM avec Hugging Face

```python
# fichier : explore_llm.py
# Explore la structure d'un petit LLM pour comprendre les composants

from transformers import AutoModelForCausalLM, AutoTokenizer

# Charger un petit modèle pour l'exploration (GPT-2 : 124M paramètres)
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Afficher le nombre total de paramètres
total_params = sum(p.numel() for p in model.parameters())
print(f"Modèle : {model_name}")
print(f"Paramètres totaux : {total_params:,}")
print()

# Afficher l'architecture couche par couche
print("Architecture du modèle :")
for name, param in model.named_parameters():
    # Afficher le nom de chaque couche et sa taille
    print(f"  {name:<50} {str(list(param.shape)):<20} ({param.numel():>10,} params)")

print()

# Compter les paramètres par type de couche
embedding_params = sum(
    p.numel() for n, p in model.named_parameters() if "wte" in n or "wpe" in n
)
attention_params = sum(
    p.numel() for n, p in model.named_parameters() if "attn" in n
)
mlp_params = sum(
    p.numel() for n, p in model.named_parameters() if "mlp" in n
)

print(f"Paramètres d'embedding : {embedding_params:>12,} ({embedding_params/total_params*100:.1f}%)")
print(f"Paramètres d'attention : {attention_params:>12,} ({attention_params/total_params*100:.1f}%)")
print(f"Paramètres MLP :         {mlp_params:>12,} ({mlp_params/total_params*100:.1f}%)")
```

**Résultat attendu** :

```text
Modèle : gpt2
Paramètres totaux : 124,439,808

Architecture du modèle :
  transformer.wte.weight                             [50257, 768]         (38,597,376 params)
  transformer.wpe.weight                             [1024, 768]          (   786,432 params)
  transformer.h.0.attn.c_attn.weight                 [768, 2304]          ( 1,769,472 params)
  ...

Paramètres d'embedding :  39,383,808 (31.6%)
Paramètres d'attention :  28,311,552 (22.7%)
Paramètres MLP :          56,623,104 (45.5%)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install tiktoken` | Installe le tokenizer utilisé par les modèles OpenAI |
| `pip install transformers` | Installe la bibliothèque Hugging Face pour charger des modèles |
| `pip install torch` | Installe PyTorch pour les opérations tensorielles |
| `tiktoken.get_encoding("cl100k_base")` | Charge le tokenizer GPT-4 |
| `AutoModelForCausalLM.from_pretrained("gpt2")` | Charge un modèle causal (decoder-only) |
| `model.named_parameters()` | Liste toutes les couches et paramètres d'un modèle |

---

## Pièges Fréquents

### Piège 1 : Confondre paramètres et tokens d'entraînement

⚠️ **Problème** : Penser qu'un modèle avec plus de paramètres est toujours meilleur. Un modèle 70B entraîné sur 300B tokens peut être moins bon qu'un modèle 7B entraîné sur 2000B tokens.

✅ **Solution** : Applique les scaling laws de Chinchilla. Le ratio optimal est d'environ 20 tokens par paramètre. Vérifie toujours la quantité de données d'entraînement, pas seulement le nombre de paramètres.

---

### Piège 2 : Oublier le coût mémoire du KV-cache

⚠️ **Problème** : Lancer un modèle avec un long contexte (128K tokens) sans vérifier si le GPU a assez de mémoire pour le KV-cache. Le KV-cache peut consommer plus de mémoire que le modèle lui-même.

✅ **Solution** : Calcule la taille du KV-cache avant de lancer l'inférence. Pour un modèle 7B en float16 avec 32K tokens de contexte, le KV-cache fait environ 2 Go. Utilise des techniques comme GQA (Grouped-Query Attention) qui réduisent la taille du KV-cache.

---

### Piège 3 : Confondre pré-entraînement et alignement

⚠️ **Problème** : Penser qu'un modèle pré-entraîné (base model) peut être utilisé directement comme assistant. Un modèle base génère du texte statistiquement probable, pas des réponses utiles.

✅ **Solution** : Utilise toujours un modèle aligné (instruct/chat) pour les applications utilisateur. Le modèle base est utile pour la recherche et comme point de départ pour le fine-tuning.

---

### Piège 4 : Sous-estimer l'impact de la tokenization

⚠️ **Problème** : Ne pas vérifier combien de tokens consomme un texte. Un texte en français consomme typiquement 20-30% plus de tokens qu'un texte équivalent en anglais, car les tokenizers sont majoritairement entraînés sur de l'anglais.

✅ **Solution** : Compte toujours les tokens avant d'envoyer un prompt à un LLM. Utilise `tiktoken` ou le tokenizer du modèle pour avoir un décompte exact.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre encoder-only, encoder-decoder et decoder-only
- [ ] Je comprends le rôle du masque causal dans l'attention
- [ ] Je sais expliquer ce que fait le KV-cache et pourquoi il est nécessaire
- [ ] Je connais les scaling laws de Chinchilla et le ratio optimal tokens/paramètres
- [ ] Je sais comment BPE découpe un texte en tokens
- [ ] Je peux décrire les trois étapes du RLHF (SFT, Reward Model, PPO)
- [ ] Je comprends comment DPO simplifie le RLHF
- [ ] J'ai exécuté les scripts Python et analysé les résultats

---

## Exercice Pratique

**Énoncé** : Analyse un tokenizer BPE en profondeur. Tu dois écrire un script Python qui compare la tokenization de textes dans différentes langues et différents formats, puis qui calcule des statistiques.

**Indications** :

- Utilise `tiktoken` avec l'encoding `cl100k_base`
- Tokenize au moins 5 textes différents : anglais, français, code Python, JSON, texte avec des nombres
- Pour chaque texte, affiche : le texte, le nombre de tokens, le ratio caractères/token, et la liste des tokens décodés
- Calcule la moyenne et l'écart type du ratio caractères/token
- Identifie quel type de texte est le plus "coûteux" en tokens

**Résultat attendu** : Un script qui affiche un tableau comparatif et une conclusion sur l'efficacité de la tokenization selon le type de contenu.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# fichier : exercice_tokenizer.py
# Analyse comparative de la tokenization BPE sur différents types de texte

import tiktoken
import math

# Charger le tokenizer cl100k_base (GPT-4)
enc = tiktoken.get_encoding("cl100k_base")

# Définir les textes à analyser
textes = {
    "Anglais simple": "The quick brown fox jumps over the lazy dog.",
    "Français simple": "Le rapide renard brun saute par-dessus le chien paresseux.",
    "Français technique": "L'apprentissage par renforcement avec feedback humain optimise l'alignement.",
    "Code Python": "def compute_loss(logits, labels): return F.cross_entropy(logits, labels)",
    "JSON": '{"name": "Claude", "version": "3.5", "capabilities": ["text", "code", "analysis"]}',
    "Nombres": "La température est de 3.14159, le résultat est 42, et pi vaut 3.14159265358979.",
    "URL": "https://huggingface.co/meta-llama/Llama-2-70b-chat-hf/blob/main/config.json",
    "Texte mixte": (
        "En 2024, OpenAI n'a pas publié officiellement le nombre de paramètres de GPT-4 ; "
        "les coûts d'entraînement des grands modèles se chiffrent souvent en dizaines "
        "ou centaines de millions de dollars."
    ),
}

# Analyser chaque texte
resultats = []

print(f"{'Type':<25} {'Chars':>6} {'Tokens':>7} {'Ratio':>7}")
print("=" * 47)

for nom, texte in textes.items():
    # Encoder le texte en tokens
    tokens = enc.encode(texte)
    nb_chars = len(texte)
    nb_tokens = len(tokens)
    ratio = nb_chars / nb_tokens if nb_tokens > 0 else 0

    resultats.append({"nom": nom, "chars": nb_chars, "tokens": nb_tokens, "ratio": ratio})
    print(f"{nom:<25} {nb_chars:>6} {nb_tokens:>7} {ratio:>7.2f}")

print("=" * 47)

# Calculer les statistiques
ratios = [r["ratio"] for r in resultats]
moyenne = sum(ratios) / len(ratios)
ecart_type = math.sqrt(sum((r - moyenne) ** 2 for r in ratios) / len(ratios))

print(f"\nMoyenne du ratio chars/token : {moyenne:.2f}")
print(f"Écart type :                   {ecart_type:.2f}")

# Identifier le texte le plus coûteux (ratio le plus bas = plus de tokens par caractère)
plus_couteux = min(resultats, key=lambda r: r["ratio"])
plus_efficace = max(resultats, key=lambda r: r["ratio"])

print(f"\nPlus coûteux en tokens :  {plus_couteux['nom']} (ratio {plus_couteux['ratio']:.2f})")
print(f"Plus efficace en tokens : {plus_efficace['nom']} (ratio {plus_efficace['ratio']:.2f})")

# Afficher le détail de la tokenization du texte le plus coûteux
print(f"\nDétail de la tokenization de '{plus_couteux['nom']}' :")
tokens_detail = enc.encode(textes[plus_couteux["nom"]])
for token_id in tokens_detail:
    token_bytes = enc.decode_single_token_bytes(token_id)
    token_str = token_bytes.decode("utf-8", errors="replace")
    print(f"  ID {token_id:>6} -> '{token_str}'")
```

Pour exécuter :

```bash
# Exécuter le script d'analyse
python exercice_tokenizer.py
```

---

## Navigation

→ Fiche suivante : **[02 - Prompt engineering et context engineering](02-prompt-engineering-context-engineering.md)**
