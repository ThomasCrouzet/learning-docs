---
tags:
  - IA
  - Expert
  - Concept
description: "Frontières de la recherche IA 2026 : reasoning models, Mixture of Experts, world models, Small Language Models, test-time compute et multimodal natif"
estimated_time: "45 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 9 - Expertise, recherche et leadership"
id: "ai.artificial-intelligence.research.frontieres-recherche-2026"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.research"
content_type: "lesson"
order: 3
---

# 03 - Frontières de la recherche 2026

> **En bref** : À la fin de cette fiche, tu sauras comprendre les directions de recherche actuelles en IA : reasoning models, Mixture of Experts, world models, Small Language Models, test-time compute scaling et multimodal natif. Tu sauras aussi analyser un article de recherche récent de manière critique. Lecture estimée : 45 min.

!!! note "Périssable"
    Les noms de modèles (o1, o3, GPT-4o, Gemini, Claude, etc.) et les benchmarks évoluent vite. Cette fiche décrit des **directions de recherche** et des exemples historiques ; ce n'est pas un état de l'art figé ni une garantie d'expertise professionnelle.

## Prérequis

- Phases 1 à 8 du cursus IA lues et comprises : [Phase 1](../01-fondamentaux-mathematiques/index.md) à [Phase 8](../08-specialisations-avancees/index.md)
- Connaissance des architectures Transformer et des LLM
- Familiarité avec les concepts d'entraînement, d'inférence et de scaling
- Compréhension de base des métriques d'évaluation de modèles

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comprendre les directions de recherche actuelles en IA : reasoning models, Mixture of Experts, world models, Small Language Models, test-time compute scaling et multimodal natif. Tu sauras aussi analyser un article de recherche récent de manière critique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Que sont les reasoning models ?

**Définition** : Les reasoning models (modèles de raisonnement) sont des LLM spécialement entraînés pour résoudre des problèmes complexes en décomposant leur raisonnement en étapes intermédiaires avant de produire une réponse finale. Les exemples incluent o1, o3 (OpenAI) et les modèles entraînés avec des techniques de chain-of-thought.

**Le problème que les reasoning models résolvent** :

Sans reasoning models, voici les problèmes rencontrés :

1. **Échec sur les problèmes complexes** : les LLM classiques répondent en une seule passe (un seul forward pass), ce qui les fait échouer sur les problèmes nécessitant plusieurs étapes de raisonnement (maths, logique, programmation)
2. **Pas de vérification interne** : le modèle génère sa réponse sans vérifier sa cohérence, ce qui mène à des erreurs subtiles
3. **Scaling limité au pré-entraînement** : la seule façon d'améliorer un LLM classique est d'augmenter sa taille ou ses données d'entraînement

**Comment les reasoning models résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Échec sur les problèmes complexes | Le modèle décompose le problème en étapes et raisonne à voix haute (chain-of-thought) |
| Pas de vérification interne | Le modèle peut vérifier et corriger ses propres étapes de raisonnement |
| Scaling limité au pré-entraînement | Le test-time compute permet d'améliorer les résultats en augmentant le temps d'inférence |

**Analogie concrète** : Un LLM classique répond à une question de maths comme un élève qui écrit directement la réponse sans montrer son travail. Un reasoning model est comme un élève qui écrit chaque étape de calcul, vérifie chaque résultat intermédiaire et corrige ses erreurs avant d'écrire la réponse finale.

**Ce que les reasoning models ne sont PAS** :

- Les reasoning models ne sont pas des modèles avec une architecture différente. Ils utilisent la même architecture Transformer, mais avec un entraînement et une inférence différents.
- Les reasoning models ne sont pas toujours meilleurs. Pour des tâches simples (résumé, traduction), un modèle classique est plus rapide et aussi bon.

#### Fonctionnement de o1/o3

```text
Question : "Quel est le plus petit nombre premier supérieur à 100 ?"

LLM classique (réponse directe) :
  → "101" (correct par chance, ou "103" si le modèle se trompe)

Reasoning model (chaîne de raisonnement) :
  Étape 1 : Je dois vérifier si 101 est premier.
  Étape 2 : 101 n'est pas divisible par 2 (impair).
  Étape 3 : 101 n'est pas divisible par 3 (1+0+1=2, pas multiple de 3).
  Étape 4 : 101 n'est pas divisible par 5 (ne finit pas par 0 ou 5).
  Étape 5 : 101 n'est pas divisible par 7 (101/7 ≈ 14.4).
  Étape 6 : sqrt(101) ≈ 10.05, donc je dois tester jusqu'à 10.
  Étape 7 : 101 n'est pas divisible par 2, 3, 5, 7.
  Conclusion : 101 est premier.
  → "101"
```

**Différence de scaling** :

| Scaling classique (pré-entraînement) | Test-time compute scaling |
| ------------------------------------ | ------------------------- |
| Plus de paramètres | Plus de tokens de raisonnement à l'inférence |
| Plus de données d'entraînement | Plus de temps de calcul par question |
| Coût fixe par requête | Coût variable selon la difficulté |
| Amélioration logarithmique | Amélioration potentiellement plus efficace |

---

### Qu'est-ce que le Mixture of Experts (MoE) ?

**Définition** : Le Mixture of Experts (MoE) est une architecture de réseau de neurones où chaque couche contient plusieurs sous-réseaux (experts) et un routeur qui sélectionne les experts pertinents pour chaque entrée. Seuls quelques experts sont activés par token, ce qui réduit le coût de calcul tout en maintenant une grande capacité totale.

**Le problème que le MoE résout** :

Sans MoE, voici les problèmes rencontrés :

1. **Coût proportionnel à la taille** : un modèle dense de 1 000 milliards de paramètres utilise tous ses paramètres pour chaque token, ce qui est prohibitif
2. **Compromis taille/vitesse** : un modèle plus grand est plus performant mais plus lent et plus coûteux
3. **Spécialisation impossible** : dans un modèle dense, les mêmes neurones traitent tous les types de tâches

**Comment le MoE résout ces problèmes** :

| Problème | Solution apportée par le MoE |
| -------- | ---------------------------- |
| Coût proportionnel | Seuls 2-4 experts sur 16-64 sont activés par token. Le coût est celui d'un petit modèle |
| Compromis taille/vitesse | Capacité totale de 1 000 milliards de paramètres mais vitesse d'un modèle de 100 milliards |
| Spécialisation impossible | Chaque expert peut se spécialiser sur un type de tâche ou de donnée |

**Analogie concrète** : Un MoE, c'est comme un hôpital avec des spécialistes. Quand un patient arrive (un token), l'accueil (routeur) l'oriente vers les spécialistes pertinents (experts). Un patient avec un problème cardiaque ne voit que le cardiologue, pas le dermatologue. L'hôpital a la capacité totale de tous les spécialistes, mais chaque patient ne mobilise que quelques-uns.

**Ce que le MoE n'est PAS** :

- Le MoE n'est pas un ensemble de modèles. Les experts partagent le même backbone et sont entraînés conjointement. C'est un seul modèle avec une activation sélective.
- Le MoE ne réduit pas le nombre total de paramètres. Il a autant (voire plus) de paramètres qu'un modèle dense, mais n'en utilise qu'une fraction à chaque inférence.

#### Architecture du MoE

```text
Token d'entrée
      │
      ▼
┌─────────────┐
│   Routeur   │ ─── calcule un score pour chaque expert
│  (gating)   │     et sélectionne les top-k
└──────┬──────┘
       │
  ┌────┼────┬────┬────┐
  ▼    ▼    ▼    ▼    ▼
┌───┐┌───┐┌───┐┌───┐┌───┐
│E1 ││E2 ││E3 ││E4 ││E5 │  ← 5 experts (FFN)
└─┬─┘└─┬─┘└───┘└───┘└───┘
  │    │                      ← seuls E1 et E2 sont activés (top-2)
  │    │
  ▼    ▼
[Somme pondérée]
      │
      ▼
Token de sortie
```

**Exemples de modèles MoE** :

| Modèle | Total paramètres | Paramètres actifs | Nombre d'experts | Top-k |
| ------ | ---------------- | ----------------- | ----------------- | ----- |
| Mixtral 8x7B | 46.7B | ~12.9B | 8 | 2 |
| Mixtral 8x22B | 141B | ~39B | 8 | 2 |
| GPT-4 (rumeur non confirmée) | chiffres non officiels | non confirmé | non confirmé | non confirmé |
| DeepSeek-V3 | 671B | ~37B | 256 | 8 |

> **Note d'honnêteté** : l'architecture exacte de GPT-4 (MoE ou non, nombre d'experts) n'a pas été publiée officiellement par OpenAI. Les chiffres qui circulent sur le web sont des estimations de tiers. Traite-les comme des hypothèses, pas comme des faits.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MoELayer(nn.Module):
    """Couche Mixture of Experts simplifiée."""

    def __init__(self, input_dim, hidden_dim, num_experts=8, top_k=2):
        super().__init__()
        self.num_experts = num_experts
        self.top_k = top_k

        # Créer les experts (chaque expert est un petit FFN)
        self.experts = nn.ModuleList([
            nn.Sequential(
                nn.Linear(input_dim, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, input_dim)
            )
            for _ in range(num_experts)
        ])

        # Routeur : projette l'entrée vers un score par expert
        self.router = nn.Linear(input_dim, num_experts)

    def forward(self, x):
        # x : (batch, seq_len, input_dim)
        batch_size, seq_len, dim = x.shape

        # Calculer les scores du routeur
        router_logits = self.router(x)  # (batch, seq_len, num_experts)
        router_probs = F.softmax(router_logits, dim=-1)

        # Sélectionner les top-k experts
        top_k_probs, top_k_indices = router_probs.topk(self.top_k, dim=-1)

        # Normaliser les probabilités des experts sélectionnés
        top_k_probs = top_k_probs / top_k_probs.sum(dim=-1, keepdim=True)

        # Calculer la sortie comme somme pondérée des experts sélectionnés
        output = torch.zeros_like(x)
        for k in range(self.top_k):
            expert_idx = top_k_indices[:, :, k]  # (batch, seq_len)
            weight = top_k_probs[:, :, k].unsqueeze(-1)  # (batch, seq_len, 1)
            for e in range(self.num_experts):
                mask = (expert_idx == e)  # Tokens assignés à cet expert
                if mask.any():
                    expert_input = x[mask]
                    expert_output = self.experts[e](expert_input)
                    output[mask] += weight[mask] * expert_output

        return output

# Test
moe = MoELayer(input_dim=512, hidden_dim=2048, num_experts=8, top_k=2)
x = torch.randn(2, 10, 512)  # batch=2, seq_len=10
out = moe(x)
print(f"Entrée : {x.shape}")
print(f"Sortie : {out.shape}")
print(f"Nombre total de paramètres : {sum(p.numel() for p in moe.parameters()):,}")
```

---

### Que sont les world models ?

**Définition** : Un world model est un modèle d'IA qui apprend une représentation interne du fonctionnement du monde. Il peut prédire ce qui va se passer dans un environnement donné, comprendre les relations causales entre événements et planifier des actions. L'approche JEPA (Joint-Embedding Predictive Architecture) proposée par Yann LeCun est un exemple de direction de recherche dans ce domaine.

**Le problème que les world models résolvent** :

Sans world models, voici les problèmes rencontrés :

1. **Pas de compréhension du monde physique** : les LLM actuels manipulent des tokens sans comprendre les lois physiques (gravité, permanence des objets)
2. **Planification limitée** : sans modèle interne du monde, un agent ne peut pas anticiper les conséquences de ses actions
3. **Apprentissage inefficace** : un robot qui apprend par essai-erreur dans le monde réel gaspille du temps et des ressources

**Comment les world models résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de compréhension physique | Le world model apprend les lois implicites de l'environnement à partir d'observations |
| Planification limitée | L'agent peut simuler des actions dans le world model avant d'agir dans le monde réel |
| Apprentissage inefficace | L'agent s'entraîne principalement dans le monde simulé (imagination) |

**Analogie concrète** : Un world model, c'est comme la capacité d'un joueur d'échecs à visualiser les coups suivants dans sa tête. Avant de déplacer une pièce, il simule mentalement plusieurs séquences de coups et choisit la meilleure. Le world model est cette simulation mentale.

**Ce que les world models ne sont PAS** :

- Un world model n'est pas un moteur physique programmé (comme dans un jeu vidéo). Il apprend les lois du monde à partir d'observations, sans les programmer explicitement.
- Un world model n'est pas un LLM. Les LLM prédisent des tokens, les world models prédisent des états futurs de l'environnement dans un espace de représentation.

#### JEPA (Joint-Embedding Predictive Architecture)

```text
Architecture JEPA :

  Observation x         Observation y (future)
       │                      │
       ▼                      ▼
  ┌──────────┐          ┌──────────┐
  │ Encoder  │          │ Encoder  │
  │    x     │          │    y     │  (target encoder, EMA)
  └────┬─────┘          └────┬─────┘
       │                      │
  Représentation sx      Représentation sy
       │                      │
       ▼                      │
  ┌──────────┐                │
  │Predictor │                │
  │          │                │
  └────┬─────┘                │
       │                      │
  Prédiction ŝy               │
       │                      │
       └──── Perte = ||ŝy - sy|| ────┘

  Le modèle prédit la représentation future,
  PAS les pixels futurs (plus robuste au bruit)
```

**Différence avec les modèles génératifs** :

| World Model (JEPA) | Modèle génératif (diffusion, GAN) |
| ------------------- | --------------------------------- |
| Prédit dans l'espace des représentations | Prédit dans l'espace des pixels |
| Ignore les détails non pertinents | Doit générer tous les détails |
| Focalisé sur la compréhension | Focalisé sur la génération |
| Pas de mode collapse ni de bruit | Sujet au mode collapse (GAN) ou au bruit (diffusion) |

---

### Que sont les Small Language Models ?

**Définition** : Les Small Language Models (SLM) sont des modèles de langage de petite taille (1B à 7B de paramètres) qui atteignent des performances proches des grands modèles (70B+) grâce à des données d'entraînement de meilleure qualité, la distillation de connaissances et des optimisations architecturales. Exemples : Phi (Microsoft), Gemma (Google), Mistral 7B.

**Le problème que les SLM résolvent** :

Sans SLM, voici les problèmes rencontrés :

1. **Coût d'inférence prohibitif** : un modèle de 70B de paramètres nécessite des GPU coûteux pour chaque requête
2. **Latence élevée** : les grands modèles sont lents, incompatibles avec les applications temps réel
3. **Pas de déploiement local** : impossible de faire tourner un LLM de 70B sur un téléphone, un PC ou un appareil embarqué

**Comment les SLM résolvent ces problèmes** :

| Problème | Solution apportée par les SLM |
| -------- | ----------------------------- |
| Coût prohibitif | Un modèle de 3B coûte 10-20x moins cher à l'inférence qu'un modèle de 70B |
| Latence élevée | Moins de paramètres = moins de calcul = réponse plus rapide |
| Pas de déploiement local | Un modèle de 3B quantifié en 4 bits tient dans 2 Go de RAM |

**Analogie concrète** : Les SLM, c'est comme un couteau suisse compact face à une boîte à outils complète. Le couteau suisse ne fait pas tout ce que la boîte à outils fait, mais il couvre 80% des tâches quotidiennes et il tient dans ta poche.

**Ce que les SLM ne sont PAS** :

- Les SLM ne sont pas de simples versions réduites des grands modèles. Ils sont souvent entraînés avec des techniques spécifiques (données synthétiques de haute qualité, distillation) qui compensent leur petite taille.
- Les SLM ne remplacent pas les grands modèles pour les tâches complexes (raisonnement multi-étapes, génération de code complexe).

#### Techniques clés des SLM

| Technique | Description | Exemple |
| --------- | ----------- | ------- |
| Données de haute qualité | Filtrer et sélectionner rigoureusement les données d'entraînement | Phi utilise des données "textbook quality" |
| Distillation | Transférer les connaissances d'un grand modèle vers un petit | GPT-4 génère des données pour entraîner un modèle de 3B |
| Quantification | Réduire la précision des poids (FP16 -> INT4) | GGUF, AWQ, GPTQ |
| Architecture optimisée | Adapter l'architecture pour l'efficacité | Grouped Query Attention, SwiGLU |

---

### Qu'est-ce que le test-time compute ?

**Définition** : Le test-time compute (TTC) est l'idée d'allouer plus de calcul au moment de l'inférence (test) plutôt qu'uniquement au moment de l'entraînement (train). Au lieu de répondre en un seul forward pass, le modèle peut générer plusieurs réponses candidates, les évaluer, les raffiner et sélectionner la meilleure.

**Le problème que le test-time compute résout** :

Sans TTC, voici les problèmes rencontrés :

1. **Calcul fixe par question** : un modèle classique utilise le même temps de calcul pour "2+2" et pour un théorème mathématique complexe
2. **Pas d'auto-correction** : une fois la réponse générée, le modèle ne peut pas revenir en arrière
3. **Plafond de performance** : augmenter la taille du modèle donne des rendements décroissants (scaling laws)

**Comment le TTC résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Calcul fixe | Le modèle peut allouer plus de calcul aux questions difficiles |
| Pas d'auto-correction | Le modèle génère, vérifie et corrige ses réponses |
| Plafond de performance | Le scaling de l'inférence ouvre une nouvelle dimension d'amélioration |

**Analogie concrète** : Le test-time compute, c'est comme un examen où tu peux relire et corriger tes réponses. Un étudiant qui a 3 heures pour 10 questions peut passer 5 minutes sur une question facile et 30 minutes sur une question difficile. Le temps de réflexion supplémentaire améliore la qualité des réponses.

**Ce que le test-time compute n'est PAS** :

- Le TTC n'est pas un simple retry. Ce n'est pas relancer la même requête plusieurs fois. C'est un processus structuré de raisonnement, vérification et correction.
- Le TTC n'est pas gratuit. Plus de calcul à l'inférence = plus de coût et plus de latence. Il faut équilibrer qualité et budget.

#### Techniques de test-time compute

| Technique | Description | Coût |
| --------- | ----------- | ---- |
| Chain-of-Thought | Générer les étapes de raisonnement intermédiaires | Modéré (plus de tokens) |
| Self-consistency | Générer N réponses et voter pour la plus fréquente | Élevé (N forward passes) |
| Self-correction | Générer, critiquer et réviser la réponse | Modéré (2-3 passes) |
| Tree of Thought | Explorer plusieurs branches de raisonnement | Très élevé |
| Vérifier/Reward model | Un modèle séparé évalue la qualité de chaque réponse | Élevé |

---

### Qu'est-ce que le multimodal natif ?

**Définition** : Un modèle multimodal natif est un modèle entraîné dès le départ pour traiter simultanément plusieurs modalités (texte, image, audio, vidéo) dans une architecture unifiée, contrairement aux modèles multimodaux composites qui assemblent des encodeurs séparés. Exemples : Gemini (Google), GPT-4o (OpenAI).

**Le problème que le multimodal natif résout** :

Sans multimodal natif, voici les problèmes rencontrés :

1. **Assemblage fragile** : connecter un encodeur image (CLIP) à un LLM via un adaptateur crée des goulots d'étranglement et perd de l'information
2. **Pas de raisonnement cross-modal profond** : un modèle composite ne peut pas raisonner aussi finement sur les relations entre image et texte
3. **Latence de traitement** : chaque modalité est traitée séparément avant d'être fusionnée, ce qui ajoute de la latence

**Comment le multimodal natif résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Assemblage fragile | Une architecture unique traite toutes les modalités sans adaptateur |
| Raisonnement cross-modal limité | L'attention cross-modal est intégrée à chaque couche du modèle |
| Latence | Le traitement est parallèle et intégré, sans étape intermédiaire |

**Analogie concrète** : Un modèle multimodal composite, c'est comme une personne qui porte des lunettes de traduction : elle lit un texte en anglais, le traduit mentalement, puis comprend. Un modèle multimodal natif, c'est une personne bilingue de naissance : elle comprend directement dans les deux langues sans traduction intermédiaire.

**Ce que le multimodal natif n'est PAS** :

- Le multimodal natif n'est pas un LLM avec un encodeur image attaché. C'est une architecture fondamentalement conçue pour traiter plusieurs modalités ensemble.
- Le multimodal natif ne remplace pas les modèles spécialisés. Pour une tâche purement textuelle, un LLM spécialisé peut être plus efficace.

**Comparaison multimodal composite vs natif** :

| Multimodal composite | Multimodal natif |
| -------------------- | ---------------- |
| Encodeurs séparés + adaptateur | Architecture unifiée |
| Perte d'information à l'interface | Pas de goulot d'étranglement |
| Plus facile à construire (réutilise des composants existants) | Plus difficile à entraîner (données multi-modales nécessaires) |
| Exemples : LLaVA, BLIP-2 | Exemples : Gemini, GPT-4o |

---

## Étapes Pratiques

### Étape 1 : Comparer un raisonnement classique vs chain-of-thought

Crée un fichier `recherche_2026.py` et explore le raisonnement.

```python
# Simulation de la différence entre réponse directe et chain-of-thought

def reponse_directe(question):
    """Simule un LLM classique : réponse en un seul pas."""
    # Le modèle tente de répondre directement
    return "42"  # Réponse potentiellement incorrecte

def chain_of_thought(question):
    """Simule un reasoning model : décomposition en étapes."""
    steps = []

    steps.append("Étape 1 : Identifier le problème")
    steps.append(f"  Question : {question}")

    steps.append("Étape 2 : Décomposer en sous-problèmes")
    steps.append("  Sous-problème 1 : ...")
    steps.append("  Sous-problème 2 : ...")

    steps.append("Étape 3 : Résoudre chaque sous-problème")
    steps.append("  Solution 1 : ...")
    steps.append("  Solution 2 : ...")

    steps.append("Étape 4 : Vérifier la cohérence")
    steps.append("  Vérification : les résultats sont cohérents")

    steps.append("Étape 5 : Réponse finale")

    return steps

# Test
question = "Combien de nombres premiers y a-t-il entre 1 et 50 ?"

print("=== Réponse directe ===")
print(f"Réponse : {reponse_directe(question)}")

print("\n=== Chain-of-Thought ===")
for step in chain_of_thought(question):
    print(step)
```

**Résultat attendu** :

```text
=== Réponse directe ===
Réponse : 42

=== Chain-of-Thought ===
Étape 1 : Identifier le problème
  Question : Combien de nombres premiers y a-t-il entre 1 et 50 ?
Étape 2 : Décomposer en sous-problèmes
  ...
```

---

### Étape 2 : Implémenter un routeur MoE simplifié

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleRouter(nn.Module):
    """Routeur qui sélectionne les top-k experts."""
    def __init__(self, input_dim, num_experts, top_k=2):
        super().__init__()
        self.top_k = top_k
        self.gate = nn.Linear(input_dim, num_experts)

    def forward(self, x):
        # Calculer les scores
        logits = self.gate(x)       # (batch, num_experts)
        probs = F.softmax(logits, dim=-1)

        # Sélectionner les top-k
        top_k_probs, top_k_ids = probs.topk(self.top_k, dim=-1)

        # Normaliser
        top_k_probs = top_k_probs / top_k_probs.sum(dim=-1, keepdim=True)

        return top_k_probs, top_k_ids

# Test : 8 experts, top-2
router = SimpleRouter(input_dim=256, num_experts=8, top_k=2)
x = torch.randn(4, 256)  # 4 tokens
probs, ids = router(x)

print("Experts sélectionnés pour chaque token :")
for i in range(4):
    experts = ids[i].tolist()
    weights = probs[i].tolist()
    print(f"  Token {i} : experts {experts} (poids : {[f'{w:.3f}' for w in weights]})")
```

**Résultat attendu** :

```text
Experts sélectionnés pour chaque token :
  Token 0 : experts [3, 5] (poids : ['0.612', '0.388'])
  Token 1 : experts [1, 7] (poids : ['0.543', '0.457'])
  Token 2 : experts [0, 4] (poids : ['0.701', '0.299'])
  Token 3 : experts [2, 6] (poids : ['0.528', '0.472'])
```

---

### Étape 3 : Comparer les coûts de calcul des SLM vs grands modèles

```python
# Estimation des coûts de calcul
models = {
    'Phi-3 Mini (3.8B)': {
        'params': 3.8e9, 'active_params': 3.8e9,
        'ram_fp16': 7.6, 'ram_int4': 2.4,
        'tokens_per_sec_gpu': 120, 'on_device': True
    },
    'Gemma 2 (9B)': {
        'params': 9e9, 'active_params': 9e9,
        'ram_fp16': 18, 'ram_int4': 5.6,
        'tokens_per_sec_gpu': 80, 'on_device': True
    },
    'Mixtral 8x7B (MoE)': {
        'params': 46.7e9, 'active_params': 12.9e9,
        'ram_fp16': 93.4, 'ram_int4': 29.2,
        'tokens_per_sec_gpu': 50, 'on_device': False
    },
    'Llama 3 70B': {
        'params': 70e9, 'active_params': 70e9,
        'ram_fp16': 140, 'ram_int4': 43.8,
        'tokens_per_sec_gpu': 15, 'on_device': False
    }
}

print(f"{'Modèle':<25} {'Params':>10} {'Actifs':>10} {'RAM INT4':>10} "
      f"{'Tok/s':>8} {'On-device':>10}")
print("-" * 75)

for name, info in models.items():
    params_str = f"{info['params']/1e9:.1f}B"
    active_str = f"{info['active_params']/1e9:.1f}B"
    ram_str = f"{info['ram_int4']:.1f} Go"
    tok_str = f"{info['tokens_per_sec_gpu']}"
    device_str = "Oui" if info['on_device'] else "Non"
    print(f"{name:<25} {params_str:>10} {active_str:>10} {ram_str:>10} "
          f"{tok_str:>8} {device_str:>10}")
```

**Résultat attendu** :

```text
Modèle                       Params     Actifs   RAM INT4    Tok/s  On-device
---------------------------------------------------------------------------
Phi-3 Mini (3.8B)             3.8B       3.8B     2.4 Go      120        Oui
Gemma 2 (9B)                  9.0B       9.0B     5.6 Go       80        Oui
Mixtral 8x7B (MoE)          46.7B      12.9B    29.2 Go       50        Non
Llama 3 70B                  70.0B      70.0B    43.8 Go       15        Non
```

---

### Étape 4 : Simuler le self-consistency (vote majoritaire)

```python
import numpy as np

def simulate_self_consistency(correct_answer, accuracy_per_sample, n_samples):
    """
    Simule le self-consistency : générer N réponses et voter.

    Args:
        correct_answer: la bonne réponse
        accuracy_per_sample: probabilité qu'un seul échantillon soit correct
        n_samples: nombre de réponses générées
    """
    np.random.seed(42)
    wrong_answers = ["A", "B", "C", "D"]
    wrong_answers.remove(correct_answer)

    results = []
    for _ in range(1000):  # 1000 simulations
        samples = []
        for _ in range(n_samples):
            if np.random.random() < accuracy_per_sample:
                samples.append(correct_answer)
            else:
                samples.append(np.random.choice(wrong_answers))

        # Vote majoritaire
        from collections import Counter
        vote = Counter(samples).most_common(1)[0][0]
        results.append(vote == correct_answer)

    return np.mean(results)

# Comparer accuracy avec 1, 5, 10, 20 échantillons
print("Self-consistency : amélioration avec le nombre d'échantillons")
print(f"{'N échantillons':>15} {'Accuracy':>10}")
print("-" * 30)

base_accuracy = 0.6  # 60% de chance de répondre correctement par échantillon
for n in [1, 3, 5, 10, 20]:
    acc = simulate_self_consistency("B", base_accuracy, n)
    print(f"{n:>15} {acc:>10.1%}")
```

**Résultat attendu** :

```text
Self-consistency : amélioration avec le nombre d'échantillons
  N échantillons   Accuracy
------------------------------
              1      60.x%
              3      70.x%
              5      76.x%
             10      85.x%
             20      92.x%
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `F.softmax(logits, dim=-1)` | Convertit les scores du routeur en probabilités |
| `probs.topk(k, dim=-1)` | Sélectionne les k plus grandes valeurs |
| `Counter(list).most_common(1)` | Vote majoritaire pour self-consistency |
| `torch.randn(batch, dim)` | Génère des vecteurs aléatoires pour les tests |
| `nn.ModuleList([...])` | Liste de modules PyTorch (pour les experts) |

---

## Pièges Fréquents

### Piège 1 : Confondre paramètres totaux et paramètres actifs dans les MoE

⚠️ **Problème** : Comparer Mixtral 8x7B (46.7B total) avec Llama 2 70B et conclure que Mixtral est plus petit. En réalité, Mixtral a plus de capacité totale, mais utilise seulement ~13B par token.

✅ **Solution** : Toujours distinguer les paramètres totaux (capacité du modèle) des paramètres actifs par token (coût de calcul). Le coût d'inférence dépend des paramètres actifs.

---

### Piège 2 : Penser que le test-time compute est toujours bénéfique

⚠️ **Problème** : Utiliser un reasoning model pour des tâches simples (résumé, traduction) augmente le coût sans améliorer la qualité.

✅ **Solution** : Adapter le budget de calcul à la difficulté de la tâche. Utiliser un routing qui détecte si la question nécessite un raisonnement étendu ou une réponse directe.

---

### Piège 3 : Surestimer les SLM sur les tâches complexes

⚠️ **Problème** : Déployer un modèle de 3B sur une tâche de raisonnement multi-étapes et s'attendre à des performances comparables à un modèle de 70B.

✅ **Solution** : Évaluer chaque modèle sur les benchmarks spécifiques à la tâche visée. Les SLM excellent sur les tâches ciblées (classification, extraction, tâches simples) mais restent limités sur le raisonnement complexe.

---

### Piège 4 : Traiter les papers de recherche comme des vérités établies

⚠️ **Problème** : Accepter les résultats d'un paper sans esprit critique, surtout quand les benchmarks sont choisis par les auteurs et les conditions expérimentales favorisent leur approche.

✅ **Solution** : Toujours vérifier : le dataset de test est-il standard ? Les baselines sont-elles équitables ? Les résultats ont-ils été reproduits par d'autres équipes ? L'ablation study est-elle complète ?

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre un LLM classique et un reasoning model
- [ ] Je comprends le fonctionnement du Mixture of Experts (routeur, experts, top-k)
- [ ] Je connais la différence entre paramètres totaux et paramètres actifs dans un MoE
- [ ] Je sais expliquer l'approche JEPA et la différence avec les modèles génératifs
- [ ] Je connais les techniques clés des Small Language Models (distillation, quantification)
- [ ] Je comprends le concept de test-time compute et ses techniques principales
- [ ] Je sais distinguer un modèle multimodal natif d'un modèle multimodal composite
- [ ] Je sais analyser un paper de recherche avec esprit critique

---

## Exercice Pratique

**Énoncé** : Analyse critique d'un article de recherche récent (2025-2026).

1. Choisis un article de recherche récent sur l'un des sujets de cette fiche (reasoning models, MoE, SLM, diffusion, etc.)
2. Lis l'article et remplis la grille d'analyse ci-dessous
3. Rédige un résumé critique de 500-800 mots

**Grille d'analyse** :

| Critère | Évaluation |
| ------- | ---------- |
| Problème adressé | Quel problème spécifique l'article résout-il ? |
| Approche proposée | Quelle méthode est proposée ? En quoi est-elle nouvelle ? |
| Expériences | Quels benchmarks sont utilisés ? Sont-ils standards ? |
| Baselines | Les modèles de comparaison sont-ils équitables ? |
| Ablation | Les auteurs montrent-ils quels composants sont essentiels ? |
| Reproductibilité | Le code et les données sont-ils disponibles ? |
| Limitations | Les auteurs discutent-ils les limitations de leur approche ? |
| Impact | Quel impact cette recherche pourrait-elle avoir ? |

**Indications** :

- Sources recommandées : arXiv, OpenReview, blogs officiels (Google AI, OpenAI, Meta AI)
- Concentre-toi sur l'abstract, l'introduction, les expériences et la conclusion
- Pour les formules mathématiques complexes, décris l'intuition plutôt que les détails
- Compare toujours avec l'état de l'art existant

**Résultat attendu** : Un rapport structuré avec la grille remplie et un résumé critique argumenté.

---

## Solution de l'Exercice

> **Note** : Cette section contient un exemple de solution. Ton analyse portera sur un article de ton choix.

---

```text
EXEMPLE D'ANALYSE CRITIQUE
===========================

Article : "Scaling LLM Test-Time Compute Optimally can be More Effective
than Scaling Model Parameters" (2024)

1. PROBLÈME ADRESSÉ
   Comment améliorer les performances d'un LLM sans augmenter sa taille ?
   Les auteurs explorent si investir plus de calcul à l'inférence (test-time)
   peut être plus efficace qu'augmenter les paramètres du modèle.

2. APPROCHE PROPOSÉE
   Deux stratégies de test-time compute :
   - Process Reward Model (PRM) : un modèle évalue chaque étape de raisonnement
   - Self-refinement : le modèle corrige ses propres réponses itérativement
   L'originalité est de montrer que ces stratégies ont un point de rendement
   optimal au-delà duquel ajouter du calcul ne sert plus.

3. EXPÉRIENCES
   Benchmarks : MATH (mathématiques), GSM8K (arithmétique)
   Standards et largement utilisés dans la communauté.

4. BASELINES
   Comparaison avec des modèles plus grands (scaling de paramètres) et
   avec le best-of-N sampling naïf. Les baselines sont équitables.

5. ABLATION
   Complète : les auteurs testent différentes stratégies de sélection,
   différents budgets de calcul et différentes tailles de modèles.

6. REPRODUCTIBILITÉ
   Les détails expérimentaux sont fournis. Le code n'est pas encore public
   au moment de la publication.

7. LIMITATIONS
   - Les résultats dépendent de la qualité du reward model
   - La stratégie optimale varie selon la tâche et le modèle
   - Le coût total (entraînement du reward model + inférence) n'est pas
     toujours inférieur au scaling de paramètres

8. IMPACT
   Ce travail ouvre une nouvelle dimension de scaling (inférence vs
   entraînement) qui pourrait changer la façon dont on conçoit les
   systèmes d'IA en production.

RÉSUMÉ CRITIQUE
   Article solide avec une question de recherche pertinente et des
   expériences convaincantes. La principale limitation est que le
   reward model lui-même est coûteux à entraîner, ce qui relativise
   l'avantage du test-time compute. Néanmoins, les résultats montrent
   clairement que pour les tâches de raisonnement, investir dans le
   test-time compute est souvent plus efficace que d'augmenter la taille
   du modèle.
```

---

## Navigation

← Fiche précédente : **[02 - AI Safety, alignement et éthique](02-ai-safety-alignement-ethique.md)**

→ Fiche suivante : **[04 - Contribution et leadership](04-contribution-leadership.md)**
