---
tags:
  - IA
  - Expert
  - Concept
description: "Lecture et reproduction de papers : naviguer ArXiv, analyser un article de recherche, reproduire des résultats et connaître l'écosystème des conférences et labs"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 9 - Expertise, recherche et leadership"
---

# 01 - Lecture et reproduction de papers

> **En bref** : À la fin de cette fiche, tu sauras lire et analyser un paper de recherche en IA publié sur ArXiv, identifier les contributions clés d'un article, reproduire des résultats expérimentaux à partir du code officiel, et naviguer l'écosystème de la recherche (conférences, labs, outils de veille). Lecture estimée : 40 min.


## Prérequis

- Phases 1 à 6 du cursus IA (mathématiques, ML classique, deep learning, architectures modernes, LLM)
- Python 3 installé avec PyTorch ou TensorFlow
- Connaître les bases de Git et GitHub

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et analyser un paper de recherche en IA publié sur ArXiv, identifier les contributions clés d'un article, reproduire des résultats expérimentaux à partir du code officiel, et naviguer l'écosystème de la recherche (conférences, labs, outils de veille).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un paper de recherche ?

**Définition** : Un paper (article de recherche) est un document scientifique rédigé par des chercheurs pour présenter une nouvelle contribution au domaine. En IA, les papers sont publiés sur ArXiv (pré-publication) puis soumis à des conférences ou revues à comité de lecture.

**Le problème que les papers résolvent** :

Sans papers, voici les problèmes rencontrés :

1. **Pas de diffusion des connaissances** : les avancées restent confidentielles dans les laboratoires
2. **Pas de vérification** : aucun mécanisme pour vérifier la validité des résultats annoncés
3. **Pas de reproductibilité** : impossible pour d'autres chercheurs de construire sur des travaux existants

**Comment les papers résolvent ces problèmes** :

| Problème | Solution apportée par les papers |
| -------- | -------------------------------- |
| Pas de diffusion | Publication ouverte sur ArXiv et dans des conférences |
| Pas de vérification | Le peer review (relecture par des pairs) valide la méthodologie |
| Pas de reproductibilité | La section méthode et le code publié permettent la reproduction |

**Analogie concrète** : Un paper est comme un brevet de cuisine d'un grand chef. Il décrit la recette (méthode), les ingrédients exacts (données, hyperparamètres), le résultat obtenu (métriques) et pourquoi cette recette est meilleure que les précédentes (contributions). D'autres chefs peuvent reproduire la recette et vérifier si elle tient ses promesses.

**Ce qu'un paper n'est PAS** :

- Un paper n'est pas un tutoriel. Il ne vise pas à enseigner un concept de zéro mais à présenter une contribution nouvelle à des lecteurs déjà experts.
- Un paper n'est pas une vérité absolue. Il peut contenir des erreurs, des biais ou des résultats non reproductibles. C'est pourquoi la lecture critique est indispensable.

---

### Qu'est-ce que la structure d'un paper ?

**Définition** : La structure d'un paper de recherche en IA suit une organisation standardisée qui permet au lecteur de trouver rapidement les informations pertinentes.

**Les sections d'un paper** :

| Section | Contenu | Ce qu'il faut y chercher |
| ------- | ------- | ------------------------ |
| Abstract | Résumé en 150-300 mots | Le problème, la méthode et les résultats principaux |
| Introduction | Contexte et motivation | Le problème exact résolu et pourquoi il est important |
| Related Work | Travaux précédents | Comment le paper se positionne par rapport à l'existant |
| Method | Description technique | L'architecture, les équations, les algorithmes |
| Experiments | Résultats expérimentaux | Datasets, métriques, comparaisons, ablation studies |
| Conclusion | Bilan et perspectives | Les limites reconnues et les directions futures |
| Références | Bibliographie | Les papers fondamentaux du domaine |

**Sections supplémentaires fréquentes** :

- **Appendix** : détails techniques, preuves mathématiques, hyperparamètres complets
- **Limitations** : section obligatoire dans la plupart des conférences depuis 2021
- **Broader Impact** : impact sociétal du travail (demandé par NeurIPS depuis 2020)

---

### Qu'est-ce que la méthode des 3 passes ?

**Définition** : La méthode des 3 passes est une technique de lecture systématique d'un paper de recherche, proposée par S. Keshav. Chaque passe a un objectif précis et une durée estimée.

**Le problème que la méthode des 3 passes résout** :

Sans méthode de lecture structurée, voici les problèmes rencontrés :

1. **Lecture linéaire inefficace** : lire un paper de la première à la dernière page prend beaucoup de temps pour un résultat incertain
2. **Noyade dans les détails** : se perdre dans les équations avant de comprendre l'idée générale
3. **Mauvaise sélection** : passer du temps sur des papers non pertinents pour son travail

**Comment la méthode des 3 passes résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Lecture linéaire inefficace | Chaque passe a un objectif clair et une durée limitée |
| Noyade dans les détails | La première passe capture l'idée générale avant d'entrer dans les détails |
| Mauvaise sélection | Après la première passe (5-10 min), tu sais si le paper mérite d'être lu en profondeur |

**Les trois passes** :

**Passe 1 : Survol (5-10 minutes)**

- Lire le titre, l'abstract et l'introduction
- Lire les titres de chaque section
- Regarder les figures et tableaux (sans lire les légendes en détail)
- Lire la conclusion
- Objectif : décider si le paper mérite une lecture approfondie

**Passe 2 : Lecture attentive (30-60 minutes)**

- Lire le paper en entier, sauf les preuves mathématiques complexes
- Annoter les points clés dans la marge
- Identifier les figures et équations clés
- Noter les références importantes à lire plus tard
- Objectif : comprendre le contenu sans maîtriser tous les détails

**Passe 3 : Reproduction mentale (1-5 heures)**

- Re-lire en essayant de recréer mentalement le paper
- Vérifier chaque hypothèse et chaque étape du raisonnement
- Identifier les forces et faiblesses de la méthodologie
- Comparer avec d'autres approches connues
- Objectif : comprendre le paper en profondeur et pouvoir le critiquer

**Analogie concrète** : C'est comme visiter un appartement avant de l'acheter. La première visite (passe 1), tu fais le tour rapidement pour voir si l'appartement te plaît. La deuxième visite (passe 2), tu regardes chaque pièce attentivement, tu ouvres les placards, tu vérifies les fenêtres. La troisième visite (passe 3), tu amènes un expert qui vérifie l'électricité, la plomberie et la structure.

---

### Qu'est-ce qu'ArXiv et Semantic Scholar ?

**Définition** : ArXiv est un serveur de pré-publications scientifiques (preprints) géré par l'université Cornell. Semantic Scholar est un moteur de recherche académique alimenté par l'IA, développé par l'Allen Institute for AI (AI2).

**Le problème que ces outils résolvent** :

Sans outils de recherche académique, voici les problèmes rencontrés :

1. **Accès payant** : les revues scientifiques traditionnelles facturent l'accès aux articles (30-50 USD par article)
2. **Lenteur de publication** : le processus de revue classique prend 6 mois à 2 ans
3. **Difficulté de navigation** : trouver les papers pertinents parmi des millions de publications

**Comment ces outils résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Accès payant | ArXiv est gratuit et en accès libre |
| Lenteur de publication | Les preprints sont disponibles en 24-48h après soumission |
| Difficulté de navigation | Semantic Scholar offre des résumés IA, des graphes de citations et des recommandations |

**Outils complémentaires** :

| Outil | Utilité |
| ----- | ------- |
| ArXiv (arxiv.org) | Publication et accès gratuit aux preprints |
| Semantic Scholar (semanticscholar.org) | Recherche intelligente, résumés IA, alertes |
| Connected Papers (connectedpapers.com) | Visualisation du graphe de citations d'un paper |
| Papers With Code (paperswithcode.com) | Lien entre papers et implémentations, benchmarks |
| Google Scholar (scholar.google.com) | Recherche académique large, comptage de citations |
| Hugging Face Papers (huggingface.co/papers) | Papers récents avec discussions communautaires |

**Ce qu'ArXiv n'est PAS** :

- ArXiv n'est pas une revue à comité de lecture. Les papers sur ArXiv ne sont pas vérifiés par des reviewers. N'importe quel chercheur peut publier un preprint. La qualité est variable.
- ArXiv n'est pas exclusif. Un même paper peut être sur ArXiv et publié dans une conférence. La version conférence est plus aboutie (révisée par les pairs).

---

### Qu'est-ce que la reproduction de résultats ?

**Définition** : La reproduction de résultats consiste à ré-exécuter les expériences décrites dans un paper pour vérifier que les résultats annoncés sont corrects et compréhensibles.

**Le problème que la reproduction résout** :

Sans reproduction, voici les problèmes rencontrés :

1. **Résultats invérifiables** : impossible de savoir si les métriques annoncées sont correctes
2. **Détails manquants** : les papers ne décrivent pas toujours tous les hyperparamètres et astuces d'implémentation
3. **Crise de reproductibilité** : de nombreux résultats en ML ne sont pas reproductibles (estimé à 20-30% selon certaines études)

**Comment la reproduction résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Résultats invérifiables | L'exécution du code confirme ou infirme les métriques |
| Détails manquants | La reproduction révèle les détails non documentés |
| Crise de reproductibilité | La communauté identifie les papers dont les résultats tiennent |

**Étapes de reproduction** :

1. **Trouver le code officiel** : chercher le lien GitHub dans le paper ou sur Papers With Code
2. **Vérifier l'environnement** : installer les dépendances exactes (versions Python, PyTorch, CUDA)
3. **Télécharger les données** : obtenir les datasets utilisés dans les expériences
4. **Exécuter l'entraînement** : lancer l'entraînement avec les hyperparamètres du paper
5. **Comparer les résultats** : vérifier si les métriques obtenues correspondent au paper (une marge de 1-2% est acceptable)

**Analogie concrète** : Reproduire un paper, c'est comme suivre une recette d'un livre de cuisine. Si le résultat ne ressemble pas à la photo, soit la recette est mal écrite (paper incomplet), soit tu as raté une étape (erreur d'implémentation), soit la photo est trompeuse (résultats exagérés).

---

### Quelles sont les grandes conférences en IA ?

**Définition** : Les conférences en IA sont des événements académiques annuels où les chercheurs présentent leurs travaux. L'acceptation d'un paper à une conférence de premier plan (tier 1) est un indicateur de qualité.

**Les conférences majeures** :

| Conférence | Domaine | Période | Taux d'acceptation |
| ---------- | ------- | ------- | ------------------ |
| NeurIPS | ML général | Décembre | ~25% |
| ICML | ML théorique et appliqué | Juillet | ~25% |
| ICLR | Représentations apprises | Mai | ~30% |
| CVPR | Vision par ordinateur | Juin | ~25% |
| ACL | Traitement du langage naturel | Juillet | ~25% |
| AAAI | IA générale | Février | ~20% |
| ECCV/ICCV | Vision par ordinateur (alternance) | Octobre | ~25% |
| EMNLP | NLP empirique | Décembre | ~25% |
| COLM | Modèles de langage (depuis 2024) | Octobre | ~30% |

**Processus de review** :

1. **Soumission** : les auteurs soumettent leur paper (souvent en double-blind : anonyme)
2. **Review** : 3-4 reviewers experts évaluent le paper (qualité, nouveauté, clarté, expériences)
3. **Rebuttal** : les auteurs répondent aux critiques des reviewers
4. **Décision** : les area chairs décident d'accepter ou de rejeter
5. **Camera-ready** : les auteurs soumettent la version finale

**Ce que l'acceptation en conférence n'est PAS** :

- L'acceptation n'est pas une garantie de vérité. Des papers acceptés à NeurIPS ont eu des résultats non reproductibles.
- L'acceptation n'est pas le seul critère de qualité. Des papers importants ont été rejetés initialement (ex: le paper original de GANs a été rejeté de NeurIPS 2013 avant d'être accepté en 2014).

---

### Quels sont les principaux labs de recherche en IA ?

**Définition** : Les labs de recherche en IA sont des organisations (industrielles ou académiques) qui produisent les avancées les plus significatives du domaine.

**Labs industriels majeurs** :

| Lab | Organisation | Contributions notables |
| --- | ------------ | ---------------------- |
| Google DeepMind | Google/Alphabet | AlphaGo, AlphaFold, Gemini, Gemma |
| OpenAI | Microsoft (partenaire) | GPT-4, DALL-E, o1/o3, Codex |
| Meta FAIR | Meta | LLaMA, Segment Anything, JEPA |
| Anthropic | Indépendant | Claude, Constitutional AI, Interpretability |
| Mistral AI | Indépendant (France) | Mixtral, Mistral Large |
| xAI | Elon Musk | Grok |
| Cohere | Indépendant (Canada) | Command R, Embed |

**Labs académiques influents** :

| Lab | Université | Spécialité |
| --- | ---------- | ---------- |
| Stanford HAI | Stanford | IA centrée sur l'humain, policy |
| MIT CSAIL | MIT | IA générale, robotique |
| Mila | Université de Montréal | Deep learning (fondé par Yoshua Bengio) |
| Berkeley AI Research (BAIR) | UC Berkeley | RL, robotique, vision |
| Allen Institute for AI (AI2) | Indépendant | NLP, Semantic Scholar |

---

## Étapes Pratiques

### Étape 1 : Trouver et télécharger un paper classique

On va travailler avec le paper "Attention Is All You Need" (Vaswani et al., 2017), le paper fondateur de l'architecture Transformer.

Accède au paper :

```text
URL ArXiv : https://arxiv.org/abs/1706.03762
URL PDF direct : https://arxiv.org/pdf/1706.03762
```

**Résultat attendu** : Tu as le PDF du paper ouvert devant toi.

---

### Étape 2 : Passe 1 - Survol (10 minutes)

Lis les éléments suivants du paper et note tes observations :

```text
Checklist de la Passe 1 :
[ ] Titre : "Attention Is All You Need"
[ ] Abstract : noter le message principal en 1 phrase
[ ] Figures : identifier la Figure 1 (architecture Transformer)
[ ] Tableaux : noter les résultats principaux (Table 2 : BLEU scores)
[ ] Conclusion : noter la phrase de conclusion clé
```

Après cette passe, remplis ce template :

```text
PASSE 1 - SURVOL
================
Paper : Attention Is All You Need
Auteurs : Vaswani et al. (Google Brain, Google Research)
Année : 2017

Message principal (1 phrase) :
_________________________________________________

Nombre de figures : ___
Figure la plus importante : ___

Nombre de tableaux : ___
Résultat principal : ___

Ce paper mérite-t-il une passe 2 ? (oui/non) : ___
Raison : ___
```

**Résultat attendu** : Un survol complété en 10 minutes maximum avec une décision claire sur la suite.

---

### Étape 3 : Passe 2 - Lecture attentive (45 minutes)

Lis le paper en entier en annotant. Concentre-toi sur ces points :

```text
PASSE 2 - LECTURE ATTENTIVE
============================

CONTRIBUTIONS (ce que le paper apporte de nouveau) :
1. ___
2. ___
3. ___

ARCHITECTURE (éléments clés de la Figure 1) :
- Encoder : ___
- Decoder : ___
- Self-attention : ___
- Multi-head attention : ___

RÉSULTATS CLÉS :
- BLEU score EN-DE : ___
- BLEU score EN-FR : ___
- Comparaison avec le meilleur modèle précédent : ___

HYPERPARAMÈTRES IMPORTANTS :
- d_model : ___
- Nombre de heads : ___
- Nombre de couches : ___
- Learning rate schedule : ___

POINTS NON COMPRIS (à approfondir en passe 3) :
1. ___
2. ___
```

**Résultat attendu** : Un formulaire complété avec les informations clés extraites du paper.

---

### Étape 4 : Trouver le code et l'environnement de reproduction

Cherche le code officiel et les implémentations de référence :

```bash
# Créer un dossier de travail pour la reproduction
mkdir -p ~/papers/attention-is-all-you-need
cd ~/papers/attention-is-all-you-need

# Cloner une implémentation de référence annotée
# (le repo officiel de Google utilise TensorFlow 1.x, voici une alternative PyTorch)
git clone https://github.com/harvardnlp/annotated-transformer.git
cd annotated-transformer

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

Vérifie aussi Papers With Code :

```text
URL Papers With Code :
https://paperswithcode.com/paper/attention-is-all-you-need

Ce que tu y trouves :
- Lien vers le code officiel
- Implémentations communautaires classées par étoiles GitHub
- Résultats sur les benchmarks (leaderboards)
- Datasets utilisés
```

**Résultat attendu** : Le code est cloné et l'environnement est prêt.

---

### Étape 5 : Reproduire un résultat simple

Plutôt que de reproduire l'entraînement complet (qui nécessite des GPU puissants et des jours de calcul), on va vérifier que l'architecture fonctionne correctement avec un exemple minimal :

```python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    """Implémentation simplifiée du multi-head attention du paper."""

    def __init__(self, d_model, num_heads):
        super().__init__()
        # d_model doit être divisible par num_heads
        assert d_model % num_heads == 0

        self.d_model = d_model
        self.num_heads = num_heads
        # Dimension de chaque head (d_k dans le paper)
        self.d_k = d_model // num_heads

        # Projections linéaires pour Q, K, V (Section 3.2.2 du paper)
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        # Projection de sortie
        self.W_o = nn.Linear(d_model, d_model)

    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        """Equation 1 du paper : Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V"""
        # Calcul des scores d'attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)

        # Appliquer le masque si fourni (pour le decoder)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)

        # Softmax pour obtenir les poids d'attention
        attention_weights = torch.softmax(scores, dim=-1)

        # Multiplication par V pour obtenir la sortie
        return torch.matmul(attention_weights, V), attention_weights

    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)

        # Projections linéaires et reshape pour multi-head
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)

        # Calcul de l'attention
        output, weights = self.scaled_dot_product_attention(Q, K, V, mask)

        # Concaténation des heads et projection finale
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        return self.W_o(output)


# Test avec les dimensions du paper
d_model = 512    # Dimension du modèle (Section 3.2.2)
num_heads = 8    # Nombre de heads (Section 3.2.2)
seq_len = 10     # Longueur de séquence (exemple)
batch_size = 2   # Taille du batch (exemple)

# Créer le module
mha = MultiHeadAttention(d_model, num_heads)

# Créer des données de test
x = torch.randn(batch_size, seq_len, d_model)

# Forward pass (self-attention : query = key = value)
output = mha(x, x, x)

# Vérifier les dimensions de sortie
print(f"Entrée : {x.shape}")       # [2, 10, 512]
print(f"Sortie : {output.shape}")   # [2, 10, 512] - même dimension
print(f"d_k par head : {d_model // num_heads}")  # 64
print("Multi-head attention fonctionne correctement.")
```

**Résultat attendu** :

```text
Entrée : torch.Size([2, 10, 512])
Sortie : torch.Size([2, 10, 512])
d_k par head : 64
Multi-head attention fonctionne correctement.
```

---

### Étape 6 : Rédiger une fiche de lecture structurée

Après les 3 passes, rédige une fiche de lecture complète :

```text
FICHE DE LECTURE
================
Titre : Attention Is All You Need
Auteurs : Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin
Conférence : NeurIPS 2017
Citations : > 100 000 (2026)

RÉSUMÉ (3 phrases max) :
Ce paper propose le Transformer, une architecture basée uniquement sur
des mécanismes d'attention, sans récurrence ni convolution. Le modèle
atteint de nouveaux records sur la traduction automatique (EN-DE et EN-FR).
L'architecture est devenue la base de tous les grands modèles de langage.

CONTRIBUTIONS PRINCIPALES :
1. Architecture Transformer sans récurrence
2. Mécanisme de multi-head attention
3. Positional encoding pour capturer l'ordre des tokens
4. Résultats SOTA sur WMT 2014 EN-DE et EN-FR

FORCES :
- Parallélisable (contrairement aux RNN)
- Résultats supérieurs aux modèles existants
- Architecture simple et élégante

FAIBLESSES / LIMITES :
- Complexité quadratique en O(n^2) par rapport à la longueur de séquence
- Testé uniquement sur la traduction automatique
- Coût computationnel élevé pour l'entraînement

IMPACT :
Ce paper a transformé le domaine de l'IA. GPT, BERT, T5, LLaMA et tous
les LLM modernes sont basés sur l'architecture Transformer.

PAPERS LIÉS À LIRE :
- BERT (Devlin et al., 2018)
- GPT-2 (Radford et al., 2019)
- Scaling Laws (Kaplan et al., 2020)
```

**Résultat attendu** : Une fiche de lecture complète et réutilisable pour tes notes.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install arxiv` | Installe la bibliothèque Python pour requêter ArXiv |
| `pip install semanticscholar` | Installe le client Python pour Semantic Scholar |
| `git clone <url>` | Clone un repo de code officiel |
| `python -m venv venv` | Crée un environnement virtuel isolé |
| `pip install -r requirements.txt` | Installe les dépendances d'un projet |
| `pip freeze > requirements.txt` | Exporte les dépendances installées |

---

## Pièges Fréquents

### Piège 1 : Lire un paper de façon linéaire

⚠️ **Problème** : Lire un paper de la première à la dernière page comme un roman. On se perd dans les détails dès la section 2 et on abandonne.

✅ **Solution** : Utilise la méthode des 3 passes. La passe 1 (survol en 10 minutes) te permet de décider si le paper mérite ton temps avant d'investir des heures de lecture.

---

### Piège 2 : Ignorer les ablation studies

⚠️ **Problème** : Ne lire que les résultats principaux et ignorer les ablation studies (expériences où on retire un composant pour mesurer son impact).

✅ **Solution** : Les ablation studies révèlent quelles parties de la méthode sont réellement importantes. Dans "Attention Is All You Need", la Table 3 montre que réduire d_k dégrade les performances. C'est une information critique pour comprendre l'architecture.

---

### Piège 3 : Essayer de reproduire un paper complet sans GPU

⚠️ **Problème** : Tenter de reproduire l'entraînement complet d'un Transformer sur un CPU. L'entraînement prendrait des semaines.

✅ **Solution** : Commence par reproduire une version réduite (petit dataset, moins de couches, moins d'epochs). Vérifie que le code fonctionne et que les tendances sont correctes, même si les résultats absolus sont inférieurs.

---

### Piège 4 : Confondre preprint et paper publié

⚠️ **Problème** : Citer un preprint ArXiv comme source validée sans vérifier s'il a été accepté dans une conférence.

✅ **Solution** : Vérifie toujours si le paper a été accepté dans une conférence. Sur Semantic Scholar, le champ "Venue" indique où le paper a été publié. Un paper accepté à NeurIPS ou ICML a été relu par des experts, un preprint ArXiv non.

---

## Checklist de Validation

- [ ] Je connais les 6 sections standard d'un paper de recherche
- [ ] Je sais appliquer la méthode des 3 passes pour lire un paper efficacement
- [ ] Je sais utiliser ArXiv, Semantic Scholar et Papers With Code
- [ ] Je peux identifier les contributions principales d'un paper
- [ ] Je sais trouver et exécuter le code officiel d'un paper
- [ ] Je connais les principales conférences en IA (NeurIPS, ICML, ICLR, CVPR, ACL)
- [ ] Je connais les principaux labs de recherche (DeepMind, OpenAI, Meta FAIR, Anthropic)
- [ ] J'ai lu et analysé le paper "Attention Is All You Need"

---

## Exercice Pratique

**Énoncé** : Reproduire les résultats d'un réseau de neurones simple sur MNIST et rédiger un résumé structuré comme si tu rédigeais une fiche de lecture d'un paper.

**Indications** :

- Utilise PyTorch pour implémenter un réseau de neurones simple (2-3 couches fully connected)
- Entraîne-le sur MNIST (disponible via `torchvision.datasets.MNIST`)
- Mesure la précision sur le jeu de test
- Rédige une fiche de lecture structurée (résumé, méthode, résultats, forces, faiblesses)
- Compare ton résultat avec les benchmarks connus (un simple MLP atteint ~98% sur MNIST)

**Résultat attendu** : Un script Python fonctionnel qui atteint au moins 97% de précision sur MNIST, accompagné d'une fiche de lecture structurée.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Hyperparamètres (équivalent de la section "Experimental Setup" d'un paper)
BATCH_SIZE = 64        # Nombre d'images par batch
EPOCHS = 10            # Nombre de passes sur le dataset complet
LEARNING_RATE = 0.001  # Taux d'apprentissage
HIDDEN_SIZE = 256      # Nombre de neurones dans la couche cachée

# Chargement des données MNIST
# transforms.ToTensor() convertit les images en tenseurs [0, 1]
# transforms.Normalize() normalise avec la moyenne et l'écart-type de MNIST
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

# Téléchargement des datasets d'entraînement et de test
train_dataset = datasets.MNIST('./data', train=True, download=True, transform=transform)
test_dataset = datasets.MNIST('./data', train=False, transform=transform)

# Création des DataLoaders pour itérer par batch
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)


class SimpleMLP(nn.Module):
    """Réseau fully connected à 3 couches pour la classification MNIST."""

    def __init__(self, input_size=784, hidden_size=256, num_classes=10):
        super().__init__()
        # Couche 1 : entrée (784 pixels) -> couche cachée
        self.fc1 = nn.Linear(input_size, hidden_size)
        # Couche 2 : couche cachée -> couche cachée
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        # Couche 3 : couche cachée -> sortie (10 classes)
        self.fc3 = nn.Linear(hidden_size, num_classes)
        # Activation ReLU entre les couches
        self.relu = nn.ReLU()

    def forward(self, x):
        # Aplatir l'image 28x28 en vecteur de 784
        x = x.view(x.size(0), -1)
        # Passer dans les couches avec activation ReLU
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        # Pas d'activation sur la dernière couche (CrossEntropyLoss inclut softmax)
        x = self.fc3(x)
        return x


# Initialisation du modèle, de la loss et de l'optimiseur
model = SimpleMLP(hidden_size=HIDDEN_SIZE)
criterion = nn.CrossEntropyLoss()  # Loss pour la classification multi-classes
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# Boucle d'entraînement
for epoch in range(EPOCHS):
    model.train()  # Mode entraînement (active dropout, batchnorm si utilisés)
    total_loss = 0

    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()       # Remettre les gradients à zéro
        output = model(data)        # Forward pass
        loss = criterion(output, target)  # Calcul de la loss
        loss.backward()             # Calcul des gradients (backpropagation)
        optimizer.step()            # Mise à jour des poids
        total_loss += loss.item()

    avg_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch+1}/{EPOCHS} - Loss moyenne : {avg_loss:.4f}")

# Évaluation sur le jeu de test
model.eval()  # Mode évaluation (désactive dropout, batchnorm)
correct = 0
total = 0

with torch.no_grad():  # Pas de calcul de gradients en évaluation
    for data, target in test_loader:
        output = model(data)
        # La classe prédite est celle avec la plus grande valeur de sortie
        _, predicted = torch.max(output, 1)
        total += target.size(0)
        correct += (predicted == target).sum().item()

accuracy = 100 * correct / total
print(f"\nPrécision sur le jeu de test : {accuracy:.2f}%")
print(f"Résultat attendu : > 97%")
```

**Résultat attendu** :

```text
Epoch 1/10 - Loss moyenne : 0.2834
Epoch 2/10 - Loss moyenne : 0.1142
...
Epoch 10/10 - Loss moyenne : 0.0198

Précision sur le jeu de test : 97.85%
Résultat attendu : > 97%
```

**Fiche de lecture structurée** :

```text
FICHE DE LECTURE - Reproduction MNIST MLP
==========================================
Méthode : MLP 3 couches (784 -> 256 -> 256 -> 10) avec ReLU
Dataset : MNIST (60 000 train, 10 000 test)
Optimiseur : Adam (lr=0.001)
Epochs : 10

RÉSULTATS :
- Précision test : ~97.8%
- Loss finale : ~0.02

FORCES :
- Simple à implémenter (< 50 lignes de modèle)
- Entraînement rapide (< 2 min sur CPU)
- Résultat solide pour une architecture basique

FAIBLESSES :
- Ne capture pas la structure spatiale des images (un CNN serait meilleur)
- Performance plafonnée autour de 98% (un CNN atteint 99.5%+)
- Aplatit l'image, perdant l'information de voisinage des pixels

COMPARAISON AVEC BENCHMARKS CONNUS :
- MLP simple : ~98% (notre résultat)
- CNN (LeNet-5) : ~99.3%
- État de l'art : ~99.8%
```

---

## Navigation

→ Fiche suivante : **[02 - AI Safety, alignement et éthique](02-ai-safety-alignement-ethique.md)**
