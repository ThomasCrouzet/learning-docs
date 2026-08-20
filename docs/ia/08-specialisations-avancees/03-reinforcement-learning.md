---
tags:
  - IA
  - Expert
  - Concept
description: "Reinforcement learning : MDP, Q-learning, DQN, policy gradient, PPO et entraînement d'agents avec Gymnasium"
estimated_time: "55 min"
fiche_number: 3
total_fiches: 5
cursus: "Phase 8 - Spécialisations avancées"
---

# 03 - Reinforcement learning

> **En bref** : À la fin de cette fiche, tu sauras formaliser un problème de RL comme un MDP, implémenter Q-learning tabulaire, construire un DQN avec PyTorch, comprendre les méthodes policy gradient et PPO, et entraîner un agent sur l'environnement CartPole avec Gymnasium. Lecture estimée : 55 min.


## Prérequis

- [Phase 4 - Deep learning fondamental](../04-deep-learning-fondamental/index.md) (réseaux de neurones, backpropagation, PyTorch)
- [Phase 1 - Probabilités et statistiques](../01-fondamentaux-mathematiques/03-probabilites-statistiques.md) (distributions, espérance, variance)
- Python 3 installé sur ta machine
- PyTorch installé (`pip install torch`)
- Gymnasium installé (`pip install gymnasium`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras formaliser un problème de RL comme un MDP, implémenter Q-learning tabulaire, construire un DQN avec PyTorch, comprendre les méthodes policy gradient et PPO, et entraîner un agent sur l'environnement CartPole avec Gymnasium.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le reinforcement learning (RL) ?

**Définition** : Le reinforcement learning (apprentissage par renforcement) est un paradigme d'apprentissage automatique dans lequel un agent apprend à prendre des décisions en interagissant avec un environnement. À chaque pas de temps, l'agent observe un état, choisit une action, reçoit une récompense et passe à un nouvel état. L'objectif est de maximiser la somme des récompenses cumulées sur le long terme.

**Le problème que le RL résout** :

Sans RL, voici les problèmes rencontrés :

1. **Pas de données labellisées** : dans beaucoup de problèmes (jeux, robotique, trading), il n'existe pas de dataset avec les "bonnes" actions à chaque instant
2. **Décisions séquentielles** : une action à l'instant t influence les états futurs, ce que le supervised learning ne capture pas
3. **Exploration nécessaire** : l'agent doit essayer des actions inconnues pour découvrir de meilleures stratégies

**Comment le RL résout ces problèmes** :

| Problème | Solution apportée par le RL |
| -------- | --------------------------- |
| Pas de données labellisées | L'agent apprend par essai-erreur grâce au signal de récompense |
| Décisions séquentielles | Le formalisme MDP modélise les interactions état-action-récompense sur le temps |
| Exploration nécessaire | Les stratégies d'exploration (epsilon-greedy, entropy bonus) poussent l'agent à essayer de nouvelles actions |

**Analogie concrète** : Le RL fonctionne comme un enfant qui apprend à faire du vélo. Personne ne lui donne un dataset de "à l'angle 12 degrés, tourne le guidon de 3 degrés à gauche". L'enfant essaie, tombe (récompense négative), se relève, ajuste et finit par trouver l'équilibre (récompense positive). Chaque chute lui apprend quelque chose sur les conséquences de ses actions.

**Ce que le RL n'est PAS** :

- Le RL n'est pas du supervised learning. En supervised learning, on fournit les bonnes réponses (labels). En RL, l'agent reçoit uniquement un signal de récompense, qui peut être retardé.
- Le RL n'est pas du unsupervised learning. L'unsupervised learning cherche des structures dans les données. Le RL cherche une politique optimale de décision.

**Comparaison RL vs supervised learning** :

| Reinforcement learning | Supervised learning |
| ---------------------- | ------------------- |
| Signal : récompense (scalaire, retardé) | Signal : label (vecteur, immédiat) |
| Données : générées par l'interaction | Données : fournies dans un dataset |
| Objectif : maximiser la récompense cumulée | Objectif : minimiser l'erreur de prédiction |
| L'agent influence les données futures | Les données sont fixes |

---

### Qu'est-ce qu'un MDP (Markov Décision Process) ?

**Définition** : Un MDP est le cadre mathématique formel du RL. Il est défini par un tuple (S, A, P, R, gamma) : S est l'ensemble des états, A est l'ensemble des actions, P(s'|s, a) est la probabilité de transition, R(s, a) est la récompense, et gamma est le facteur de discount (entre 0 et 1).

**Le problème que le MDP résout** :

Sans MDP, voici les problèmes rencontrés :

1. **Pas de formalisation** : impossible de définir rigoureusement ce que signifie "prendre de bonnes décisions"
2. **Pas de propriété de Markov** : sans cette simplification, l'agent devrait mémoriser tout l'historique
3. **Pas de critère d'optimalité** : impossible de comparer deux stratégies de décision

**Comment le MDP résout ces problèmes** :

| Problème | Solution apportée par le MDP |
| -------- | ---------------------------- |
| Pas de formalisation | Le tuple (S, A, P, R, gamma) définit complètement le problème |
| Pas de propriété de Markov | L'état actuel contient toute l'information nécessaire pour décider |
| Pas de critère d'optimalité | La valeur d'un état V(s) et la politique optimale pi* sont bien définies |

**Analogie concrète** : Un MDP est comme un jeu de plateau. L'état est la position de tes pions sur le plateau. Les actions sont les mouvements possibles. La transition dépend parfois d'un lancé de dé (probabiliste). La récompense est le nombre de points gagnés. Le discount factor est la préférence pour gagner des points maintenant plutôt que plus tard.

**Ce qu'un MDP n'est PAS** :

- Un MDP n'est pas un système déterministe. Les transitions peuvent être probabilistes (même action, même état, résultats différents).
- Un MDP n'est pas un problème d'optimisation classique. L'agent ne connaît pas P et R à l'avance : il doit les découvrir en interagissant.

#### Éléments clés du MDP

```text
Agent                    Environnement
  |                           |
  |--- action a_t ----------->|
  |                           |
  |<-- état s_{t+1} ---------|
  |<-- récompense r_t -------|
  |                           |
```

**Le discount factor gamma** :

Le facteur gamma (entre 0 et 1) contrôle l'importance des récompenses futures :

| Gamma | Comportement |
| ----- | ------------ |
| 0.0 | L'agent ne regarde que la récompense immédiate (myope) |
| 0.5 | Les récompenses futures comptent, mais de moins en moins |
| 0.99 | L'agent planifie sur le long terme |
| 1.0 | Toutes les récompenses futures comptent autant (risque de divergence) |

Le retour cumulé G_t est calculé ainsi :

```text
G_t = r_t + gamma * r_{t+1} + gamma^2 * r_{t+2} + ...
```

---

### Qu'est-ce que le Q-learning ?

**Définition** : Le Q-learning est un algorithme de RL qui apprend une fonction Q(s, a) représentant la "qualité" de chaque paire état-action. La valeur Q(s, a) estime le retour cumulé attendu si l'agent prend l'action a dans l'état s, puis suit la politique optimale.

**Le problème que le Q-learning résout** :

Sans Q-learning, voici les problèmes rencontrés :

1. **Pas de valuation des actions** : l'agent ne sait pas quelle action est meilleure dans un état donné
2. **Pas d'apprentissage incrémental** : il faudrait explorer toutes les trajectoires possibles avant de décider
3. **Pas de convergence garantie** : sans règle de mise à jour, l'agent pourrait ne jamais trouver la politique optimale

**Comment le Q-learning résout ces problèmes** :

| Problème | Solution apportée par le Q-learning |
| -------- | ----------------------------------- |
| Pas de valuation des actions | La table Q associe une valeur à chaque paire (état, action) |
| Pas d'apprentissage incrémental | La règle de Bellman met à jour Q après chaque transition |
| Pas de convergence garantie | Avec un taux d'apprentissage décroissant et une exploration suffisante, Q converge vers Q* |

**Analogie concrète** : Le Q-learning est comme un carnet de notes d'un voyageur. À chaque ville (état), il note la qualité de chaque route (action) : "De Paris, la route vers Lyon vaut 8/10, celle vers Marseille vaut 6/10". Au fur et à mesure de ses voyages, il corrige ses notes. Après suffisamment de voyages, son carnet contient la meilleure route depuis n'importe quelle ville.

**Règle de mise à jour** :

```text
Q(s, a) <- Q(s, a) + alpha * [r + gamma * max_a' Q(s', a') - Q(s, a)]
```

Avec :

- `alpha` : taux d'apprentissage (learning rate)
- `r` : récompense reçue
- `gamma` : facteur de discount
- `s'` : nouvel état après l'action a
- `max_a' Q(s', a')` : meilleure valeur Q dans le nouvel état

#### Exploration vs exploitation (epsilon-greedy)

L'agent doit équilibrer :

- **Exploitation** : choisir l'action avec la plus grande valeur Q connue
- **Exploration** : choisir une action aléatoire pour découvrir de meilleures options

La stratégie epsilon-greedy résout ce dilemme :

```python
import numpy as np

def epsilon_greedy(Q, state, epsilon):
    """
    Choisit une action avec la stratégie epsilon-greedy.
    Avec probabilité epsilon : action aléatoire (exploration).
    Avec probabilité 1-epsilon : meilleure action connue (exploitation).
    """
    if np.random.random() < epsilon:
        # Exploration : action aléatoire
        return np.random.randint(Q.shape[1])
    else:
        # Exploitation : meilleure action connue
        return np.argmax(Q[state])
```

---

### Qu'est-ce qu'un DQN (Deep Q-Network) ?

**Définition** : Un DQN utilise un réseau de neurones pour approximer la fonction Q au lieu d'une table. Cela permet de gérer des espaces d'états continus ou très grands (images, coordonnées physiques) où une table serait impossible.

**Le problème que le DQN résout** :

Sans DQN, voici les problèmes rencontrés :

1. **Espaces d'états trop grands** : CartPole a 4 variables continues, soit un nombre infini d'états possibles
2. **Pas de généralisation** : une table Q ne généralise pas entre des états similaires
3. **Pas de traitement d'images** : impossible de stocker Q(pixel_1, pixel_2, ..., pixel_n, action) dans une table

**Comment le DQN résout ces problèmes** :

| Problème | Solution apportée par le DQN |
| -------- | ---------------------------- |
| Espaces d'états trop grands | Le réseau de neurones prend l'état en entrée et produit Q(s, a) pour toutes les actions |
| Pas de généralisation | Le réseau généralise : des états proches ont des valeurs Q proches |
| Pas de traitement d'images | Un CNN en entrée du DQN traite directement les pixels |

**Analogie concrète** : Si le Q-learning tabulaire est un carnet de notes avec une page par ville, le DQN est un GPS intelligent. Le GPS n'a pas besoin d'avoir visité chaque ville. Il comprend les règles générales (les autoroutes sont plus rapides, les routes de montagne sont plus lentes) et peut estimer le meilleur chemin même pour des villes qu'il n'a jamais visitées.

**Ce qu'un DQN n'est PAS** :

- Un DQN n'est pas un simple réseau de neurones supervisé. Le DQN n'a pas de labels fixes : la cible change à chaque mise à jour (bootstrap).
- Un DQN n'est pas stable par défaut. Sans expérience replay et target network, l'entraînement diverge souvent.

#### Techniques de stabilisation du DQN

| Technique | Problème résolu |
| --------- | --------------- |
| Expérience replay | Les transitions sont stockées dans un buffer et échantillonnées aléatoirement, brisant les corrélations temporelles |
| Target network | Un deuxième réseau (copie retardée) calcule les cibles, stabilisant les mises à jour |
| Gradient clipping | Limite la norme du gradient pour éviter les mises à jour trop grandes |

---

### Qu'est-ce que le policy gradient ?

**Définition** : Les méthodes policy gradient apprennent directement une politique pi(a|s) (probabilité de chaque action dans chaque état) au lieu d'apprendre une fonction de valeur Q. L'algorithme REINFORCE est la méthode policy gradient la plus simple : il utilise le retour cumulé G_t comme signal pour augmenter la probabilité des bonnes actions.

**Le problème que les policy gradients résolvent** :

Sans policy gradient, voici les problèmes rencontrés :

1. **Actions continues** : le Q-learning nécessite un argmax sur les actions, impossible si l'espace d'actions est continu (angle de rotation, force appliquée)
2. **Politiques stochastiques** : parfois la politique optimale est probabiliste (pierre-feuille-ciseaux), ce que le Q-learning ne peut pas représenter
3. **Instabilité du DQN** : le bootstrap (cible qui change) rend l'entraînement instable

**Comment les policy gradients résolvent ces problèmes** :

| Problème | Solution apportée par les policy gradients |
| -------- | ------------------------------------------ |
| Actions continues | Le réseau produit les paramètres d'une distribution (moyenne, écart-type) |
| Politiques stochastiques | Le réseau produit directement une distribution de probabilité sur les actions |
| Instabilité du DQN | Pas de bootstrap : le signal utilise le vrai retour cumulé |

**Analogie concrète** : Le Q-learning est comme un conseiller qui dit "dans cette situation, l'action B est la meilleure, fais-la". Le policy gradient est comme un coach qui dit "dans cette situation, fais l'action A avec 60% de chances et l'action B avec 40%". Le coach ajuste ces pourcentages au fil de l'expérience.

**REINFORCE** :

```text
Mise à jour : theta <- theta + alpha * G_t * grad(log pi(a_t | s_t))
```

Le problème principal de REINFORCE est sa **haute variance** : les estimations du gradient sont très bruitées. La réduction de variance (baseline) soustrait une valeur de référence V(s) :

```text
Mise à jour : theta <- theta + alpha * (G_t - V(s_t)) * grad(log pi(a_t | s_t))
```

Le terme `G_t - V(s_t)` est appelé l'**avantage** : il mesure si l'action était meilleure ou pire que la moyenne.

---

### Qu'est-ce que PPO (Proximal Policy Optimization) ?

**Définition** : PPO est un algorithme policy gradient amélioré qui limite la taille des mises à jour de la politique. Il utilise un mécanisme de clipping pour empêcher les changements trop brusques, ce qui rend l'entraînement plus stable. PPO est l'algorithme par défaut pour la plupart des applications de RL modernes (RLHF, robotique, jeux).

**Le problème que PPO résout** :

Sans PPO, voici les problèmes rencontrés :

1. **Mises à jour trop grandes** : un seul batch de données peut changer radicalement la politique, détruisant les progrès précédents
2. **Hyperparamètres sensibles** : TRPO (Trust Region Policy Optimization) résout ce problème mais est complexe à implémenter
3. **Pas de réutilisation des données** : REINFORCE utilise chaque trajectoire une seule fois

**Comment PPO résout ces problèmes** :

| Problème | Solution apportée par PPO |
| -------- | ------------------------- |
| Mises à jour trop grandes | Le ratio pi_new/pi_old est clippé dans [1-eps, 1+eps] |
| Hyperparamètres sensibles | PPO a peu d'hyperparamètres et fonctionne bien avec les valeurs par défaut |
| Pas de réutilisation | PPO permet plusieurs epochs de gradient sur le même batch |

**Analogie concrète** : PPO est comme un thermostat intelligent. Au lieu de pousser le chauffage à fond quand il fait froid (mise à jour trop grande), le thermostat ajuste la température progressivement par petits incréments. Si la température change trop vite, il freine. Cela évite les oscillations et garantit une convergence stable vers la température souhaitée.

**Ce que PPO n'est PAS** :

- PPO n'est pas un algorithme off-policy. PPO est on-policy : il utilise les données collectées par la politique actuelle. Après la mise à jour, les anciennes données sont jetées.
- PPO n'est pas limité au RL classique. PPO est aussi utilisé dans le RLHF (Reinforcement Learning from Human Feedback) pour aligner les grands modèles de langage.

---

### Qu'est-ce que Gymnasium ?

**Définition** : Gymnasium (anciennement OpenAI Gym) est la bibliothèque Python standard pour les environnements de RL. Elle fournit une API uniforme (step, reset, render) et des dizaines d'environnements prédéfinis (CartPole, MountainCar, Atari, MuJoCo).

**API de base** :

```python
import gymnasium as gym

# Créer l'environnement
env = gym.make("CartPole-v1")

# Réinitialiser et obtenir l'état initial
state, info = env.reset()

# Boucle d'interaction
for step in range(100):
    # Choisir une action (0 = gauche, 1 = droite)
    action = env.action_space.sample()  # Action aléatoire

    # Exécuter l'action
    next_state, reward, terminated, truncated, info = env.step(action)
    done = terminated or truncated

    if done:
        state, info = env.reset()
    else:
        state = next_state

env.close()
```

**Environnements classiques** :

| Environnement | Type d'état | Type d'action | Difficulté |
| ------------- | ----------- | ------------- | ---------- |
| CartPole-v1 | Continu (4 variables) | Discret (2 actions) | Facile |
| MountainCar-v0 | Continu (2 variables) | Discret (3 actions) | Moyenne |
| LunarLander-v3 | Continu (8 variables) | Discret (4 actions) | Moyenne |
| Pendulum-v1 | Continu (3 variables) | Continu (1 variable) | Moyenne |
| HalfCheetah-v5 | Continu (17 variables) | Continu (6 variables) | Difficile |

---

## Étapes Pratiques

### Étape 1 : Explorer l'environnement CartPole

Crée un fichier `rl_agent.py` et commence par comprendre l'environnement.

```python
import gymnasium as gym
import numpy as np

# Créer l'environnement CartPole
env = gym.make("CartPole-v1")

# Afficher les espaces d'état et d'action
print(f"Espace d'état : {env.observation_space}")
print(f"  Forme : {env.observation_space.shape}")
print(f"  Min   : {env.observation_space.low}")
print(f"  Max   : {env.observation_space.high}")
print(f"\nEspace d'action : {env.action_space}")
print(f"  Nombre d'actions : {env.action_space.n}")

# Exécuter 5 épisodes avec des actions aléatoires
for episode in range(5):
    state, info = env.reset()
    total_reward = 0
    steps = 0

    while True:
        action = env.action_space.sample()  # Action aléatoire
        next_state, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        steps += 1

        if terminated or truncated:
            break
        state = next_state

    print(f"Épisode {episode + 1} : {steps} steps, récompense totale = {total_reward}")

env.close()
```

**Résultat attendu** :

```text
Espace d'état : Box([-4.8 -inf -0.41887903 -inf], [4.8 inf 0.41887903 inf], (4,), float32)
  Forme : (4,)
  Min   : [-4.8000002e+00 -3.4028235e+38 -4.1887903e-01 -3.4028235e+38]
  Max   : [4.8000002e+00 3.4028235e+38 4.1887903e-01 3.4028235e+38]

Espace d'action : Discrete(2)
  Nombre d'actions : 2

Épisode 1 : 14 steps, récompense totale = 14.0
Épisode 2 : 23 steps, récompense totale = 23.0
Épisode 3 : 11 steps, récompense totale = 11.0
Épisode 4 : 18 steps, récompense totale = 18.0
Épisode 5 : 9 steps, récompense totale = 9.0
```

Les actions aléatoires obtiennent environ 10-25 steps. L'objectif est d'atteindre 500 steps (le maximum).

---

### Étape 2 : Implémenter le Q-learning tabulaire

Pour utiliser le Q-learning tabulaire, il faut discrétiser l'espace d'état continu.

```python
import gymnasium as gym
import numpy as np

# Créer l'environnement
env = gym.make("CartPole-v1")

# Discrétiser l'espace d'état en bins
n_bins = 20
bins = [
    np.linspace(-4.8, 4.8, n_bins),      # Position du chariot
    np.linspace(-4, 4, n_bins),           # Vitesse du chariot
    np.linspace(-0.418, 0.418, n_bins),   # Angle du pendule
    np.linspace(-4, 4, n_bins),           # Vitesse angulaire
]

def discretize(state):
    """Convertit un état continu en indices discrets."""
    indices = []
    for i, val in enumerate(state):
        # np.digitize retourne l'indice du bin
        idx = np.digitize(val, bins[i]) - 1
        # Clamp entre 0 et n_bins-1
        idx = max(0, min(n_bins - 1, idx))
        indices.append(idx)
    return tuple(indices)

# Initialiser la table Q : (n_bins, n_bins, n_bins, n_bins, n_actions)
n_actions = env.action_space.n
Q = np.zeros([n_bins] * 4 + [n_actions])

# Hyperparamètres
alpha = 0.1       # Taux d'apprentissage
gamma = 0.99      # Facteur de discount
epsilon = 1.0     # Exploration initiale
epsilon_min = 0.01
epsilon_decay = 0.995
n_episodes = 2000

# Entraînement
rewards_history = []

for episode in range(n_episodes):
    state, info = env.reset()
    state_d = discretize(state)
    total_reward = 0

    while True:
        # Epsilon-greedy
        if np.random.random() < epsilon:
            action = env.action_space.sample()
        else:
            action = np.argmax(Q[state_d])

        # Exécuter l'action
        next_state, reward, terminated, truncated, info = env.step(action)
        next_state_d = discretize(next_state)
        done = terminated or truncated

        # Mise à jour Q-learning
        best_next = np.max(Q[next_state_d])
        Q[state_d + (action,)] += alpha * (
            reward + gamma * best_next * (1 - done) - Q[state_d + (action,)]
        )

        total_reward += reward
        state_d = next_state_d

        if done:
            break

    # Décroître epsilon
    epsilon = max(epsilon_min, epsilon * epsilon_decay)
    rewards_history.append(total_reward)

    # Afficher la progression
    if (episode + 1) % 200 == 0:
        mean_reward = np.mean(rewards_history[-200:])
        print(f"Épisode {episode + 1:4d} | Récompense moyenne : {mean_reward:.1f} | Epsilon : {epsilon:.3f}")

env.close()
```

**Résultat attendu** :

```text
Épisode  200 | Récompense moyenne : 24.3 | Epsilon : 0.367
Épisode  400 | Récompense moyenne : 48.7 | Epsilon : 0.135
Épisode  600 | Récompense moyenne : 112.4 | Epsilon : 0.049
Épisode  800 | Récompense moyenne : 198.6 | Epsilon : 0.018
Épisode 1000 | Récompense moyenne : 312.5 | Epsilon : 0.010
Épisode 1200 | Récompense moyenne : 421.3 | Epsilon : 0.010
Épisode 1400 | Récompense moyenne : 467.8 | Epsilon : 0.010
Épisode 1600 | Récompense moyenne : 489.2 | Epsilon : 0.010
Épisode 1800 | Récompense moyenne : 496.1 | Epsilon : 0.010
Épisode 2000 | Récompense moyenne : 500.0 | Epsilon : 0.010
```

---

### Étape 3 : Implémenter un DQN avec PyTorch

```python
import gymnasium as gym
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random

# --- Réseau de neurones ---
class DQNetwork(nn.Module):
    """Réseau de neurones qui approxime la fonction Q."""
    def __init__(self, state_size, action_size):
        super().__init__()
        self.fc1 = nn.Linear(state_size, 128)   # Couche cachée 1
        self.fc2 = nn.Linear(128, 128)           # Couche cachée 2
        self.fc3 = nn.Linear(128, action_size)   # Couche de sortie : Q(s, a) pour chaque a

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)  # Pas d'activation en sortie : Q peut être négatif


# --- Experience Replay Buffer ---
class ReplayBuffer:
    """Stocke les transitions pour l'entraînement."""
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        return (
            torch.FloatTensor(np.array(states)),
            torch.LongTensor(actions),
            torch.FloatTensor(rewards),
            torch.FloatTensor(np.array(next_states)),
            torch.FloatTensor(dones),
        )

    def __len__(self):
        return len(self.buffer)


# --- Agent DQN ---
class DQNAgent:
    """Agent DQN avec experience replay et target network."""
    def __init__(self, state_size, action_size):
        self.action_size = action_size
        self.gamma = 0.99
        self.epsilon = 1.0
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.batch_size = 64
        self.target_update = 10  # Mise à jour du target network tous les N épisodes

        # Réseau principal et réseau cible
        self.policy_net = DQNetwork(state_size, action_size)
        self.target_net = DQNetwork(state_size, action_size)
        self.target_net.load_state_dict(self.policy_net.state_dict())

        self.optimizer = optim.Adam(self.policy_net.parameters(), lr=0.001)
        self.buffer = ReplayBuffer()

    def select_action(self, state):
        """Sélectionne une action avec epsilon-greedy."""
        if np.random.random() < self.epsilon:
            return np.random.randint(self.action_size)
        with torch.no_grad():
            state_t = torch.FloatTensor(state).unsqueeze(0)
            q_values = self.policy_net(state_t)
            return q_values.argmax(dim=1).item()

    def train_step(self):
        """Effectue une étape d'entraînement sur un batch du buffer."""
        if len(self.buffer) < self.batch_size:
            return

        states, actions, rewards, next_states, dones = self.buffer.sample(self.batch_size)

        # Q(s, a) pour les actions prises
        q_values = self.policy_net(states).gather(1, actions.unsqueeze(1)).squeeze(1)

        # Cible : r + gamma * max_a' Q_target(s', a')
        with torch.no_grad():
            next_q_values = self.target_net(next_states).max(dim=1)[0]
            targets = rewards + self.gamma * next_q_values * (1 - dones)

        # Loss et backpropagation
        loss = nn.MSELoss()(q_values, targets)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

    def update_target(self):
        """Copie les poids du policy net vers le target net."""
        self.target_net.load_state_dict(self.policy_net.state_dict())

    def decay_epsilon(self):
        """Réduit epsilon après chaque épisode."""
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)
```

---

### Étape 4 : Entraîner l'agent DQN sur CartPole

```python
# Suite du code de l'étape 3

env = gym.make("CartPole-v1")
agent = DQNAgent(state_size=4, action_size=2)

n_episodes = 500
rewards_history = []

for episode in range(n_episodes):
    state, info = env.reset()
    total_reward = 0

    while True:
        # Choisir et exécuter une action
        action = agent.select_action(state)
        next_state, reward, terminated, truncated, info = env.step(action)
        done = terminated or truncated

        # Stocker terminated (pas truncated) pour le bootstrap du DQN
        agent.buffer.push(state, action, reward, next_state, float(terminated))

        # Entraîner
        agent.train_step()

        total_reward += reward
        state = next_state

        if done:
            break

    # Mettre à jour le target network
    if (episode + 1) % agent.target_update == 0:
        agent.update_target()

    agent.decay_epsilon()
    rewards_history.append(total_reward)

    if (episode + 1) % 50 == 0:
        mean_reward = np.mean(rewards_history[-50:])
        print(f"Épisode {episode + 1:4d} | Récompense moyenne : {mean_reward:.1f} | Epsilon : {agent.epsilon:.3f}")

env.close()
```

**Résultat attendu** :

```text
Épisode   50 | Récompense moyenne : 22.4 | Epsilon : 0.778
Épisode  100 | Récompense moyenne : 38.6 | Epsilon : 0.605
Épisode  150 | Récompense moyenne : 87.2 | Epsilon : 0.471
Épisode  200 | Récompense moyenne : 156.3 | Epsilon : 0.367
Épisode  250 | Récompense moyenne : 284.7 | Epsilon : 0.285
Épisode  300 | Récompense moyenne : 398.1 | Epsilon : 0.222
Épisode  350 | Récompense moyenne : 456.3 | Epsilon : 0.173
Épisode  400 | Récompense moyenne : 487.9 | Epsilon : 0.134
Épisode  450 | Récompense moyenne : 498.2 | Epsilon : 0.105
Épisode  500 | Récompense moyenne : 500.0 | Epsilon : 0.081
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install gymnasium` | Installe Gymnasium |
| `pip install gymnasium[classic-control]` | Installe avec les environnements classiques |
| `pip install gymnasium[atari]` | Installe avec les jeux Atari |
| `pip install stable-baselines3` | Installe une bibliothèque RL prête à l'emploi |
| `env = gym.make("CartPole-v1")` | Crée un environnement CartPole |
| `state, info = env.reset()` | Réinitialise l'environnement |
| `next_state, reward, terminated, truncated, info = env.step(action)` | Exécute une action |
| `env.action_space.sample()` | Échantillonne une action aléatoire |

---

## Pièges Fréquents

### Piège 1 : Confondre terminated et truncated

⚠️ **Problème** : Gymnasium renvoie `terminated` (l'épisode est fini par les règles) et `truncated` (l'épisode est coupé par la limite de temps). Traiter les deux de la même manière dans le calcul du retour est une erreur.

✅ **Solution** : Utilise `terminated` pour le calcul du bootstrap, pas `truncated`. Un épisode truncated signifie que l'agent aurait pu continuer.

```python
next_state, reward, terminated, truncated, info = env.step(action)

# Pour le bootstrap dans le Q-learning / DQN
# Ne mettre le futur à 0 que si terminated (pas truncated)
target = reward + gamma * max_q_next * (1 - float(terminated))
```

---

### Piège 2 : Pas assez d'exploration initiale

⚠️ **Problème** : L'agent exploite trop tôt une politique sous-optimale et ne découvre jamais les bonnes stratégies.

✅ **Solution** : Commencer avec epsilon = 1.0 et le décroître lentement. Ne pas remplir le replay buffer uniquement avec les premières transitions (elles sont aléatoires et peu informatives).

```python
# Bon : décroissance lente
epsilon_decay = 0.995  # epsilon atteint 0.01 après ~900 épisodes

# Mauvais : décroissance trop rapide
epsilon_decay = 0.95   # epsilon atteint 0.01 après ~90 épisodes
```

---

### Piège 3 : Target network pas assez synchronisé

⚠️ **Problème** : Si le target network n'est jamais mis à jour, les cibles deviennent obsolètes et l'entraînement stagne.

✅ **Solution** : Mettre à jour le target network toutes les 10-100 épisodes ou utiliser un soft update (polyak averaging).

```python
# Hard update : copie complète tous les N épisodes
if episode % 10 == 0:
    target_net.load_state_dict(policy_net.state_dict())

# Soft update : moyenne pondérée à chaque step
tau = 0.005
for target_param, policy_param in zip(target_net.parameters(), policy_net.parameters()):
    target_param.data.copy_(tau * policy_param.data + (1 - tau) * target_param.data)
```

---

## Checklist de Validation

- [ ] Je sais définir un MDP (états, actions, transitions, récompenses, discount)
- [ ] Je comprends le dilemme exploration vs exploitation
- [ ] Je sais implémenter Q-learning tabulaire avec epsilon-greedy
- [ ] Je comprends pourquoi le DQN utilise un replay buffer et un target network
- [ ] Je sais construire un DQN avec PyTorch
- [ ] Je comprends la différence entre Q-learning (value-based) et policy gradient (policy-based)
- [ ] Je comprends le rôle du clipping dans PPO
- [ ] Je sais utiliser l'API Gymnasium (make, reset, step)
- [ ] Mon agent atteint une récompense moyenne de 400+ sur CartPole

---

## Exercice Pratique

**Énoncé** : Entraîne un agent DQN pour résoudre l'environnement CartPole-v1.

1. Implémente le réseau DQN (2 couches cachées de 128 neurones)
2. Implémente le replay buffer avec une capacité de 10 000 transitions
3. Implémente la boucle d'entraînement avec epsilon-greedy décroissant
4. Entraîne l'agent pendant 500 épisodes
5. Affiche la récompense moyenne sur les 50 derniers épisodes tous les 50 épisodes

**Indications** :

- Utilise `gymnasium.make("CartPole-v1")` pour l'environnement
- Le state_size est 4, le action_size est 2
- Learning rate recommandé : 0.001
- Batch size recommandé : 64
- L'agent doit atteindre une récompense moyenne de 400+ avant la fin de l'entraînement

**Résultat attendu** : L'agent atteint une récompense moyenne de 400+ sur les 50 derniers épisodes en moins de 500 épisodes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import gymnasium as gym
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random

# --- Réseau DQN ---
class DQN(nn.Module):
    def __init__(self, state_size, action_size):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_size, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, action_size),
        )

    def forward(self, x):
        return self.net(x)

# --- Replay Buffer ---
class ReplayBuffer:
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)

    def push(self, transition):
        self.buffer.append(transition)

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        s, a, r, s2, d = zip(*batch)
        return (
            torch.FloatTensor(np.array(s)),
            torch.LongTensor(a),
            torch.FloatTensor(r),
            torch.FloatTensor(np.array(s2)),
            torch.FloatTensor(d),
        )

    def __len__(self):
        return len(self.buffer)

# --- Hyperparamètres ---
GAMMA = 0.99
LR = 0.001
BATCH_SIZE = 64
EPSILON_START = 1.0
EPSILON_MIN = 0.01
EPSILON_DECAY = 0.995
TARGET_UPDATE = 10
N_EPISODES = 500

# --- Initialisation ---
env = gym.make("CartPole-v1")
state_size = env.observation_space.shape[0]  # 4
action_size = env.action_space.n              # 2

policy_net = DQN(state_size, action_size)
target_net = DQN(state_size, action_size)
target_net.load_state_dict(policy_net.state_dict())

optimizer = optim.Adam(policy_net.parameters(), lr=LR)
buffer = ReplayBuffer()
epsilon = EPSILON_START

# --- Entraînement ---
rewards_history = []

for episode in range(N_EPISODES):
    state, info = env.reset()
    total_reward = 0

    while True:
        # Action epsilon-greedy
        if np.random.random() < epsilon:
            action = env.action_space.sample()
        else:
            with torch.no_grad():
                q = policy_net(torch.FloatTensor(state).unsqueeze(0))
                action = q.argmax(dim=1).item()

        # Exécuter l'action
        next_state, reward, terminated, truncated, info = env.step(action)
        done = terminated or truncated

        # Stocker terminated (pas truncated) pour le bootstrap
        buffer.push((state, action, reward, next_state, float(terminated)))

        # Entraîner si assez de transitions
        if len(buffer) >= BATCH_SIZE:
            states, actions, rewards, next_states, dones = buffer.sample(BATCH_SIZE)

            # Q(s, a) actuels
            q_values = policy_net(states).gather(1, actions.unsqueeze(1)).squeeze(1)

            # Cibles : r + gamma * max Q_target(s', a')
            with torch.no_grad():
                next_q = target_net(next_states).max(dim=1)[0]
                targets = rewards + GAMMA * next_q * (1 - dones)

            # Mise à jour
            loss = nn.MSELoss()(q_values, targets)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        total_reward += reward
        state = next_state

        if done:
            break

    # Target network update
    if (episode + 1) % TARGET_UPDATE == 0:
        target_net.load_state_dict(policy_net.state_dict())

    # Decay epsilon
    epsilon = max(EPSILON_MIN, epsilon * EPSILON_DECAY)
    rewards_history.append(total_reward)

    # Affichage
    if (episode + 1) % 50 == 0:
        mean_r = np.mean(rewards_history[-50:])
        print(f"Épisode {episode + 1:4d} | Moyenne(50) : {mean_r:.1f} | Epsilon : {epsilon:.3f}")

env.close()

# --- Vérification finale ---
mean_final = np.mean(rewards_history[-50:])
print(f"\nRécompense moyenne finale (50 derniers) : {mean_final:.1f}")
if mean_final >= 400:
    print("Objectif atteint : l'agent maîtrise CartPole.")
else:
    print("Objectif non atteint : relancer l'entraînement ou ajuster les hyperparamètres.")
```

**Résultat** :

```text
Épisode   50 | Moyenne(50) : 21.8 | Epsilon : 0.778
Épisode  100 | Moyenne(50) : 42.3 | Epsilon : 0.605
Épisode  150 | Moyenne(50) : 95.1 | Epsilon : 0.471
Épisode  200 | Moyenne(50) : 178.4 | Epsilon : 0.367
Épisode  250 | Moyenne(50) : 302.6 | Epsilon : 0.285
Épisode  300 | Moyenne(50) : 412.3 | Epsilon : 0.222
Épisode  350 | Moyenne(50) : 463.7 | Epsilon : 0.173
Épisode  400 | Moyenne(50) : 489.1 | Epsilon : 0.134
Épisode  450 | Moyenne(50) : 497.6 | Epsilon : 0.105
Épisode  500 | Moyenne(50) : 500.0 | Epsilon : 0.081

Récompense moyenne finale (50 derniers) : 500.0
Objectif atteint : l'agent maîtrise CartPole.
```

---

## Navigation

← Fiche précédente : **[02 - NLP avancé et traitement de la parole](02-nlp-avance-traitement-parole.md)**

→ Fiche suivante : **[04 - Robotique et IA physique](04-robotique-ia-physique.md)**
