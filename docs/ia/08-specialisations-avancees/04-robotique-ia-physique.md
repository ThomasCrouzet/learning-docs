---
tags:
  - IA
  - Expert
  - Concept
description: "Robotique et IA physique : sim-to-real, SLAM, foundation models robotique, spatial intelligence et simulateurs (MuJoCo, Isaac Sim)"
estimated_time: "45 min"
fiche_number: 4
total_fiches: 5
cursus: "Phase 8 - Spécialisations avancées"
id: "ai.artificial-intelligence.advanced.robotique-ia-physique"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.advanced"
content_type: "lesson"
order: 4
---

# 04 - Robotique et IA physique

> **En bref** : À la fin de cette fiche, tu sauras expliquer le transfert sim-to-real et ses techniques (domain randomization, reality gap), comprendre le SLAM pour la navigation autonome, connaître les foundation models pour la robotique (RT-2, PaLM-E), appréhender la spatial intelligence et utiliser des simulateurs robotiques (MuJoCo, Isaac Sim, PyBullet). Lecture estimée : 45 min.


## Prérequis

- Fiche **[03 - Reinforcement learning](03-reinforcement-learning.md)** (MDP, Q-learning, DQN, PPO, Gymnasium)
- [Phase 4 - Deep learning fondamental](../04-deep-learning-fondamental/index.md) (CNN, réseaux de neurones, PyTorch)
- Python 3 installé sur ta machine
- Gymnasium installé (`pip install gymnasium`)
- PyTorch installé (`pip install torch`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le transfert sim-to-real et ses techniques (domain randomization, reality gap), comprendre le SLAM pour la navigation autonome, connaître les foundation models pour la robotique (RT-2, PaLM-E), appréhender la spatial intelligence et utiliser des simulateurs robotiques (MuJoCo, Isaac Sim, PyBullet).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le sim-to-real ?

**Définition** : Le sim-to-real est le processus de transfert d'une politique entraînée en simulation vers un robot physique réel. L'idée est d'entraîner un agent RL dans un simulateur (rapide, sûr, pas de casse matérielle) puis de déployer la politique apprise sur le vrai robot.

**Le problème que le sim-to-real résout** :

Sans sim-to-real, voici les problèmes rencontrés :

1. **Entraînement coûteux** : un robot physique coûte cher, s'use et peut se casser pendant l'entraînement par essai-erreur
2. **Entraînement lent** : un épisode de RL en temps réel dure des minutes, alors qu'en simulation il dure des millisecondes
3. **Pas de parallélisation** : on ne peut pas exécuter 1 000 robots physiques en parallèle, mais on peut lancer 1 000 simulations simultanées

**Comment le sim-to-real résout ces problèmes** :

| Problème | Solution apportée par le sim-to-real |
| -------- | ------------------------------------ |
| Entraînement coûteux | L'entraînement se fait dans un simulateur gratuit et sans risque de casse |
| Entraînement lent | Le simulateur fonctionne 100 à 10 000 fois plus vite que le temps réel |
| Pas de parallélisation | Des milliers d'environnements simulés tournent en parallèle sur GPU |

**Analogie concrète** : Le sim-to-real est comme un pilote de ligne qui s'entraîne sur un simulateur de vol. Le simulateur reproduit les conditions de vol (vent, pluie, pannes) dans un environnement sûr. Une fois que le pilote maîtrise le simulateur, il est prêt à piloter un vrai avion. La difficulté est que le simulateur n'est jamais parfaitement identique à la réalité.

**Ce que le sim-to-real n'est PAS** :

- Le sim-to-real n'est pas un simple copier-coller. Une politique qui fonctionne parfaitement en simulation peut échouer complètement sur le robot réel à cause du reality gap.
- Le sim-to-real n'est pas la seule approche. Certains robots apprennent directement dans le monde réel (real-world RL), mais cela nécessite des mécanismes de sécurité stricts.

#### Le reality gap

Le reality gap est l'écart entre la simulation et la réalité :

| Aspect | Simulation | Réalité |
| ------ | ---------- | ------- |
| Physique | Équations simplifiées (pas de friction complexe) | Physique complète avec toutes les forces |
| Capteurs | Données parfaites, sans bruit | Bruit, latence, dérive, occlusions |
| Actionneurs | Réponse instantanée et précise | Délais, jeu mécanique, usure |
| Environnement | Scène 3D simplifiée | Éclairage variable, objets imprévus |

#### Domain randomization

La domain randomization est la technique principale pour combler le reality gap. Elle consiste à varier aléatoirement les paramètres de la simulation pendant l'entraînement :

```python
import numpy as np

def randomize_environment(env_params):
    """
    Randomise les paramètres de la simulation pour
    rendre la politique robuste au reality gap.
    """
    randomized = {}

    # Varier la friction du sol (réalité : entre 0.5 et 1.2)
    randomized["friction"] = np.random.uniform(0.3, 1.5)

    # Varier la masse des objets (+/- 20%)
    randomized["mass"] = env_params["mass"] * np.random.uniform(0.8, 1.2)

    # Ajouter du bruit aux capteurs
    randomized["sensor_noise"] = np.random.uniform(0.0, 0.05)

    # Varier le délai des actionneurs (en millisecondes)
    randomized["actuator_delay"] = np.random.uniform(0, 20)

    # Varier la gravité (+/- 5%)
    randomized["gravity"] = -9.81 * np.random.uniform(0.95, 1.05)

    return randomized

# À chaque épisode d'entraînement, randomiser les paramètres
for episode in range(10000):
    params = randomize_environment({"mass": 1.0})
    # Configurer le simulateur avec ces paramètres
    # Entraîner un épisode avec ces conditions
```

L'idée est que si la politique fonctionne sous des conditions très variées en simulation, elle fonctionnera aussi dans les conditions spécifiques de la réalité.

---

### Qu'est-ce que le SLAM ?

**Définition** : Le SLAM (Simultaneous Localization and Mapping) est la capacité pour un robot de construire une carte de son environnement tout en se localisant dans cette carte en temps réel. Le SLAM est la brique fondamentale de la navigation autonome.

**Le problème que le SLAM résout** :

Sans SLAM, voici les problèmes rencontrés :

1. **Pas de carte** : le robot ne connaît pas la disposition des murs, obstacles et passages dans son environnement
2. **Pas de localisation** : le robot ne sait pas où il se trouve dans l'espace
3. **Problème de l'oeuf et de la poule** : pour se localiser il faut une carte, pour construire une carte il faut être localisé

**Comment le SLAM résout ces problèmes** :

| Problème | Solution apportée par le SLAM |
| -------- | ----------------------------- |
| Pas de carte | Le SLAM construit la carte incrementalement à partir des observations du robot |
| Pas de localisation | Le SLAM estime la position du robot par rapport aux points de repère détectés |
| Oeuf et poule | Le SLAM résout les deux problèmes simultanément avec des techniques probabilistes |

**Analogie concrète** : Le SLAM est comme un explorateur qui entre dans une grotte inconnue avec une lampe frontale et un carnet. À chaque pas, il dessine ce qu'il voit sur son carnet (mapping) et note sa position par rapport aux éléments déjà dessinés (localisation). S'il revient à un endroit déjà visité (loop closure), il corrige les erreurs accumulées sur son plan.

**Ce que le SLAM n'est PAS** :

- Le SLAM n'est pas du GPS. Le GPS utilise des satellites externes. Le SLAM fonctionne sans infrastructure externe, uniquement avec les capteurs embarqués du robot.
- Le SLAM n'est pas de la planification de trajectoire. Le SLAM construit la carte et localise le robot. La planification (comment aller de A à B) est un module séparé qui utilise la carte du SLAM.

#### Types de capteurs pour le SLAM

| Capteur | Type de données | Précision | Coût |
| ------- | --------------- | --------- | ---- |
| LiDAR | Nuage de points 3D | Très haute (cm) | Élevé |
| Caméra stéréo | Images + profondeur | Moyenne | Moyen |
| Caméra monoculaire | Images 2D | Basse (échelle ambiguë) | Faible |
| IMU (accéléromètre + gyroscope) | Accélération + rotation | Haute à court terme, dérive | Faible |
| Encodeurs de roue | Distance parcourue | Moyenne (glissement) | Faible |

#### Types de SLAM

| Méthode | Description | Utilisation |
| ------- | ----------- | ----------- |
| EKF-SLAM | Filtre de Kalman étendu, maintient un vecteur d'état | Petits environnements |
| Particle filter SLAM | Échantillonnage Monte Carlo | Environnements moyens |
| Graph-based SLAM | Optimise un graphe de poses et contraintes | Grands environnements |
| Visual SLAM (ORB-SLAM) | Utilise des features visuelles de caméra | Robots avec caméras |
| LiDAR SLAM | Utilise des scans LiDAR | Véhicules autonomes |

---

### Que sont les foundation models pour la robotique ?

**Définition** : Les foundation models pour la robotique sont de grands modèles pré-entraînés qui combinent vision, langage et action pour permettre aux robots de comprendre des instructions en langage naturel et d'exécuter des tâches physiques. Exemples : RT-2 (Google DeepMind), PaLM-E (Google), et les modèles vision-language-action (VLA).

**Le problème que les foundation models résolvent** :

Sans foundation models, voici les problèmes rencontrés :

1. **Pas de généralisation** : un robot entraîné pour saisir une tasse ne sait pas saisir un verre sans ré-entraînement
2. **Pas de compréhension du langage** : le robot ne comprend pas l'instruction "mets la tasse rouge sur l'étagère du haut"
3. **Données robotiques rares** : collecter des démonstrations robotiques est 1 000 fois plus lent que collecter des images

**Comment les foundation models résolvent ces problèmes** :

| Problème | Solution apportée par les foundation models |
| -------- | -------------------------------------------- |
| Pas de généralisation | Le pré-entraînement sur des milliards d'images et de textes donne une compréhension large du monde |
| Pas de compréhension du langage | Le modèle de langage intégré comprend les instructions en texte libre |
| Données robotiques rares | Le transfert depuis la vision et le langage réduit le besoin en données robotiques |

**Analogie concrète** : Un foundation model robotique est comme un employé polyvalent qui a lu des milliers de livres et vu des millions de vidéos avant son premier jour de travail. Il comprend ce qu'est une tasse, où se trouve une étagère et ce que signifie "mettre dessus". Il lui suffit de quelques démonstrations physiques pour apprendre le geste précis.

**Ce que les foundation models robotiques ne sont PAS** :

- Ils ne sont pas des contrôleurs bas niveau. Ils produisent des commandes de haut niveau (position cible, trajectoire) qu'un contrôleur PID ou un planificateur de mouvement exécute.
- Ils ne sont pas prêts pour le déploiement industriel. La fiabilité n'atteint pas encore les standards requis pour des applications critiques.

#### Modèles de référence

| Modèle | Organisation | Architecture | Capacité |
| ------ | ------------ | ------------ | -------- |
| RT-2 | Google DeepMind | Vision-Language-Action Transformer | Comprend les instructions texte et produit des actions robotiques |
| PaLM-E | Google | Multimodal LLM (texte + images + état robot) | Raisonnement sur le monde physique depuis des images |
| Octo | UC Berkeley | Transformer + diffusion | Politique généraliste pour manipulation |
| pi0 | Physical Intelligence | VLM + flow matching | Manipulation dextère multi-tâches |

---

### Qu'est-ce que la spatial intelligence ?

**Définition** : La spatial intelligence est la capacité d'un système d'IA à comprendre, raisonner et agir dans l'espace 3D. Cela inclut la perception de la profondeur, la compréhension des relations spatiales entre objets, la prédiction des conséquences physiques des actions et la navigation dans des environnements complexes.

**Le problème que la spatial intelligence résout** :

Sans spatial intelligence, voici les problèmes rencontrés :

1. **Pas de compréhension 3D** : un modèle de vision classique traite des images 2D sans comprendre la profondeur ni les occlusions
2. **Pas de raisonnement physique** : le modèle ne peut pas prédire qu'un objet va tomber si on retire le support
3. **Pas de planification spatiale** : le robot ne peut pas planifier comment atteindre un objet derrière un obstacle

**Comment la spatial intelligence résout ces problèmes** :

| Problème | Solution apportée par la spatial intelligence |
| -------- | ---------------------------------------------- |
| Pas de compréhension 3D | Les world models construisent une représentation 3D interne de la scène |
| Pas de raisonnement physique | Les modèles physiques intégrés prédisent les conséquences des actions |
| Pas de planification spatiale | La représentation 3D permet de planifier des trajectoires en évitant les obstacles |

**Analogie concrète** : La spatial intelligence est comme la capacité d'un déménageur professionnel à regarder un meuble et un escalier et à déterminer mentalement s'il peut passer et dans quel angle le tourner. Il raisonne en 3D, anticipe les collisions et planifie ses mouvements avant de les exécuter.

**Ce que la spatial intelligence n'est PAS** :

- Ce n'est pas de la simple vision par ordinateur. La vision détecte des objets dans des images 2D. La spatial intelligence comprend la géométrie 3D complète de la scène.
- Ce n'est pas de la reconstruction 3D passive. La spatial intelligence inclut le raisonnement actif : prédire ce qui va se passer et planifier des actions dans l'espace.

#### Composantes de la spatial intelligence

```text
Spatial Intelligence
├── Perception 3D
│   ├── Estimation de profondeur (monoculaire, stéréo)
│   ├── Reconstruction 3D (NeRF, Gaussian Splatting)
│   └── Détection d'objets 3D
├── Raisonnement spatial
│   ├── Relations entre objets (dessus, dedans, à côté)
│   ├── Physique intuitive (gravité, collisions)
│   └── Affordances (cet objet est saisissable, ce bouton est pressable)
└── Action spatiale
    ├── Planification de trajectoire
    ├── Manipulation d'objets
    └── Navigation
```

---

### Que sont les simulateurs robotiques ?

**Définition** : Les simulateurs robotiques sont des logiciels qui reproduisent la physique du monde réel (gravité, friction, contacts, dynamique des corps rigides et souples) pour permettre l'entraînement et le test de politiques robotiques sans robot physique.

**Le problème que les simulateurs résolvent** :

Sans simulateurs, voici les problèmes rencontrés :

1. **Coût matériel** : un bras robotique coûte entre 5 000 et 100 000 euros
2. **Risque de casse** : un agent RL non entraîné peut endommager le robot ou son environnement
3. **Vitesse** : l'entraînement en temps réel est trop lent pour le RL (des millions d'épisodes nécessaires)

**Comment les simulateurs résolvent ces problèmes** :

| Problème | Solution apportée par les simulateurs |
| -------- | ------------------------------------- |
| Coût matériel | Le simulateur est gratuit ou peu coûteux |
| Risque de casse | Aucun risque : tout est virtuel |
| Vitesse | Simulation 100x à 10 000x plus rapide que le temps réel |

**Analogie concrète** : Un simulateur robotique est comme un jeu vidéo de physique très réaliste. Dans le jeu, tu peux faire tomber des objets, les pousser, les empiler. La physique est simulée avec des équations mathématiques. Si tu casses quelque chose, tu appuies sur "Reset" et tout revient à la normale.

**Comparaison des simulateurs** :

| Simulateur | Organisation | GPU | Vitesse | Spécialité |
| ---------- | ------------ | --- | ------- | ---------- |
| MuJoCo | Google DeepMind | CPU (GPU optionnel) | Rapide | Locomotion, manipulation |
| Isaac Sim | NVIDIA | GPU (CUDA) | Très rapide | Sim-to-real industriel |
| PyBullet | Open-source | CPU | Moyenne | Prototypage rapide |
| Gymnasium Robotics | Farama Foundation | CPU | Rapide | Benchmarks RL standard |
| SAPIEN | UC San Diego | GPU | Rapide | Manipulation d'objets articulés |

```python
import gymnasium as gym
import gymnasium_robotics

# Gymnasium Robotics fournit des environnements de manipulation
# Exemple avec FetchReach (bras robotique qui atteint un point cible)
# Installation : pip install gymnasium-robotics
# Les IDs Fetch ne sont pas dans gymnasium de base : il faut les enregistrer.

gym.register_envs(gymnasium_robotics)
env = gym.make("FetchReach-v3")

# Observer l'espace d'observation
obs, info = env.reset()
print(f"Observation keys : {obs.keys()}")
print(f"  observation shape : {obs['observation'].shape}")
print(f"  achieved_goal shape : {obs['achieved_goal'].shape}")
print(f"  desired_goal shape : {obs['desired_goal'].shape}")
print(f"Action shape : {env.action_space.shape}")
```

---

## Étapes Pratiques

### Étape 1 : Créer un environnement robotique avec Gymnasium

Crée un fichier `robotique_ia.py` et commence par explorer un environnement de contrôle continu.

```python
import gymnasium as gym
import numpy as np

# Pendulum : contrôle d'un pendule inversé
# État : [cos(angle), sin(angle), vitesse angulaire]
# Action : couple appliqué (continu, entre -2 et 2)
env = gym.make("Pendulum-v1")

print("=== Environnement Pendulum ===")
print(f"Observation space : {env.observation_space}")
print(f"  Shape : {env.observation_space.shape}")
print(f"  Low   : {env.observation_space.low}")
print(f"  High  : {env.observation_space.high}")
print(f"\nAction space : {env.action_space}")
print(f"  Shape : {env.action_space.shape}")
print(f"  Low   : {env.action_space.low}")
print(f"  High  : {env.action_space.high}")

# Tester avec des actions aléatoires
for episode in range(3):
    state, info = env.reset()
    total_reward = 0
    for step in range(200):
        action = env.action_space.sample()
        next_state, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        state = next_state
        if terminated or truncated:
            break
    print(f"\nÉpisode {episode + 1} : récompense totale = {total_reward:.1f}")

env.close()
```

**Résultat attendu** :

```text
=== Environnement Pendulum ===
Observation space : Box([-1. -1. -8.], [1. 1. 8.], (3,), float32)
  Shape : (3,)
  Low   : [-1. -1. -8.]
  High  : [1. 1. 8.]

Action space : Box([-2.], [2.], (1,), float32)
  Shape : (1,)
  Low   : [-2.]
  High  : [2.]

Épisode 1 : récompense totale = -1234.5
Épisode 2 : récompense totale = -1456.2
Épisode 3 : récompense totale = -1102.8
```

---

### Étape 2 : Implémenter la domain randomization

```python
import numpy as np

class RandomizedEnvironment:
    """
    Wrapper qui applique la domain randomization
    à un environnement Gymnasium.
    """
    def __init__(self, env, randomization_config):
        self.env = env
        self.config = randomization_config
        self.current_params = {}

    def randomize(self):
        """Génère de nouveaux paramètres aléatoires pour cet épisode."""
        self.current_params = {}
        for param_name, (low, high) in self.config.items():
            self.current_params[param_name] = np.random.uniform(low, high)
        return self.current_params

    def add_sensor_noise(self, observation):
        """Ajoute du bruit gaussien aux observations pour simuler des capteurs imparfaits."""
        noise_level = self.current_params.get("sensor_noise", 0.0)
        noise = np.random.normal(0, noise_level, size=observation.shape)
        return observation + noise

    def add_actuator_delay(self, action_history, delay_steps):
        """Simule un délai dans les actionneurs en utilisant une action précédente."""
        if delay_steps > 0 and len(action_history) > delay_steps:
            return action_history[-delay_steps]
        return action_history[-1] if action_history else None

    def reset(self):
        """Reset avec nouveaux paramètres randomisés."""
        params = self.randomize()
        state, info = self.env.reset()
        # Ajouter du bruit aux observations
        state = self.add_sensor_noise(state)
        return state, info, params

    def step(self, action):
        """Step avec bruit ajouté aux observations."""
        next_state, reward, terminated, truncated, info = self.env.step(action)
        next_state = self.add_sensor_noise(next_state)
        return next_state, reward, terminated, truncated, info


# Configuration de la randomisation
randomization_config = {
    "sensor_noise": (0.0, 0.05),     # Bruit capteur : 0 à 5%
    "mass_scale": (0.8, 1.2),        # Masse : 80% à 120%
    "friction": (0.5, 1.5),          # Friction : 0.5 à 1.5
    "gravity_scale": (0.95, 1.05),   # Gravité : 95% à 105%
}

# Démonstration
import gymnasium as gym
env = gym.make("Pendulum-v1")
rand_env = RandomizedEnvironment(env, randomization_config)

for episode in range(5):
    state, info, params = rand_env.reset()
    print(f"Épisode {episode + 1} : noise={params['sensor_noise']:.3f}, "
          f"mass={params['mass_scale']:.2f}, friction={params['friction']:.2f}")

env.close()
```

**Résultat attendu** :

```text
Épisode 1 : noise=0.023, mass=1.12, friction=0.87
Épisode 2 : noise=0.041, mass=0.95, friction=1.23
Épisode 3 : noise=0.008, mass=1.05, friction=0.62
Épisode 4 : noise=0.037, mass=0.83, friction=1.41
Épisode 5 : noise=0.015, mass=1.18, friction=0.98
```

---

### Étape 3 : Entraîner un agent RL sur un environnement robotique

```python
import gymnasium as gym
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

class PolicyNetwork(nn.Module):
    """Réseau de politique pour actions continues."""
    def __init__(self, state_size, action_size):
        super().__init__()
        self.fc1 = nn.Linear(state_size, 256)
        self.fc2 = nn.Linear(256, 256)
        # Moyenne de l'action
        self.mean = nn.Linear(256, action_size)
        # Log de l'écart-type (appris)
        self.log_std = nn.Parameter(torch.zeros(action_size))

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        mean = self.mean(x)
        std = self.log_std.exp()
        return mean, std

    def select_action(self, state):
        """Échantillonne une action depuis la politique."""
        state_t = torch.FloatTensor(state).unsqueeze(0)
        mean, std = self.forward(state_t)
        # Distribution normale pour les actions continues
        dist = torch.distributions.Normal(mean, std)
        action = dist.sample()
        log_prob = dist.log_prob(action).sum(dim=-1)
        return action.squeeze(0).detach().numpy(), log_prob

# Initialiser
env = gym.make("Pendulum-v1")
state_size = env.observation_space.shape[0]   # 3
action_size = env.action_space.shape[0]       # 1

policy = PolicyNetwork(state_size, action_size)
optimizer = optim.Adam(policy.parameters(), lr=0.001)
gamma = 0.99

# Entraînement REINFORCE
for episode in range(500):
    state, info = env.reset()
    log_probs = []
    rewards = []

    for step in range(200):
        action, log_prob = policy.select_action(state)
        # Clipper l'action dans les bornes de l'environnement
        action_clipped = np.clip(action, -2.0, 2.0)

        next_state, reward, terminated, truncated, info = env.step(action_clipped)
        log_probs.append(log_prob)
        rewards.append(reward)

        state = next_state
        if terminated or truncated:
            break

    # Calculer les retours cumulés
    returns = []
    G = 0
    for r in reversed(rewards):
        G = r + gamma * G
        returns.insert(0, G)
    returns = torch.FloatTensor(returns)
    # Normaliser les retours pour réduire la variance
    returns = (returns - returns.mean()) / (returns.std() + 1e-8)

    # Mise à jour de la politique
    loss = 0
    for log_prob, G in zip(log_probs, returns):
        loss -= log_prob * G
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (episode + 1) % 50 == 0:
        total_r = sum(rewards)
        print(f"Épisode {episode + 1:4d} | Récompense : {total_r:.1f}")

env.close()
```

**Résultat attendu** :

```text
Épisode   50 | Récompense : -1234.5
Épisode  100 | Récompense : -987.2
Épisode  150 | Récompense : -654.3
Épisode  200 | Récompense : -432.1
Épisode  250 | Récompense : -298.7
Épisode  300 | Récompense : -215.4
Épisode  350 | Récompense : -178.6
Épisode  400 | Récompense : -156.2
Épisode  450 | Récompense : -142.8
Épisode  500 | Récompense : -134.1
```

---

### Étape 4 : Visualiser les résultats de la simulation

```python
import numpy as np

def evaluate_agent(env, policy, n_episodes=10):
    """
    Évalue un agent entraîné sur plusieurs épisodes
    et affiche les statistiques.
    """
    rewards_list = []
    steps_list = []

    for episode in range(n_episodes):
        state, info = env.reset()
        total_reward = 0
        steps = 0

        for step in range(200):
            # Utiliser la politique sans exploration
            with torch.no_grad():
                state_t = torch.FloatTensor(state).unsqueeze(0)
                mean, std = policy(state_t)
                # En évaluation, prendre la moyenne (pas d'échantillonnage)
                action = mean.squeeze(0).numpy()
            action = np.clip(action, -2.0, 2.0)

            next_state, reward, terminated, truncated, info = env.step(action)
            total_reward += reward
            steps += 1
            state = next_state
            if terminated or truncated:
                break

        rewards_list.append(total_reward)
        steps_list.append(steps)

    # Statistiques
    print("=== Évaluation de l'agent ===")
    print(f"Épisodes       : {n_episodes}")
    print(f"Récompense moy : {np.mean(rewards_list):.1f}")
    print(f"Récompense std : {np.std(rewards_list):.1f}")
    print(f"Récompense min : {np.min(rewards_list):.1f}")
    print(f"Récompense max : {np.max(rewards_list):.1f}")
    print(f"Steps moyen    : {np.mean(steps_list):.0f}")

    return rewards_list

# Évaluation (avec le policy network de l'étape 3)
import gymnasium as gym
env = gym.make("Pendulum-v1")
# rewards = evaluate_agent(env, policy, n_episodes=10)
env.close()
```

**Résultat attendu** :

```text
=== Évaluation de l'agent ===
Épisodes       : 10
Récompense moy : -152.3
Récompense std : 28.4
Récompense min : -198.7
Récompense max : -112.1
Steps moyen    : 200
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install gymnasium` | Installe Gymnasium |
| `pip install gymnasium-robotics` | Installe les environnements robotiques (puis `gym.register_envs(gymnasium_robotics)`) |
| `pip install mujoco` | Installe le simulateur MuJoCo |
| `pip install pybullet` | Installe le simulateur PyBullet |
| `pip install stable-baselines3` | Installe une bibliothèque RL prête à l'emploi |
| `env = gym.make("Pendulum-v1")` | Crée un environnement de contrôle continu |
| `gym.register_envs(gymnasium_robotics)` puis `gym.make("FetchReach-v3")` | Enregistre puis crée un environnement de manipulation robotique |
| `env.action_space.sample()` | Échantillonne une action aléatoire |
| `obs, info = env.reset()` | Réinitialise l'environnement |

---

## Pièges Fréquents

### Piège 1 : Oublier de clipper les actions continues

⚠️ **Problème** : Le réseau de politique peut produire des actions en dehors des bornes de l'environnement (par exemple, un couple de 15.0 alors que la borne est 2.0). L'environnement peut planter ou ignorer silencieusement les valeurs hors limites.

✅ **Solution** : Toujours clipper les actions dans les bornes de l'action space avant de les passer à `env.step()`.

```python
action = policy.select_action(state)

# Clipper dans les bornes de l'environnement
action = np.clip(action, env.action_space.low, env.action_space.high)

next_state, reward, terminated, truncated, info = env.step(action)
```

---

### Piège 2 : Ignorer le reality gap

⚠️ **Problème** : L'agent fonctionne parfaitement en simulation mais échoue sur le robot réel. La politique a exploité des artefacts de la simulation (friction parfaite, pas de bruit capteur).

✅ **Solution** : Appliquer la domain randomization et tester avec des paramètres variés en simulation avant le transfert.

```python
# Tester la robustesse avec différents niveaux de bruit
for noise_level in [0.0, 0.01, 0.05, 0.1]:
    noisy_state = state + np.random.normal(0, noise_level, size=state.shape)
    action = policy.select_action(noisy_state)
    print(f"Bruit {noise_level:.2f} -> action : {action}")
```

---

### Piège 3 : Confondre terminated et truncated dans les environnements robotiques

⚠️ **Problème** : Dans les environnements robotiques avec des objectifs (goal-conditioned), un épisode peut se terminer parce que le but est atteint (terminated) ou parce que la limite de temps est dépassée (truncated). Traiter les deux de la même manière fausse l'estimation de la valeur.

✅ **Solution** : Utiliser `terminated` pour le bootstrap (mettre la valeur future à 0 uniquement si l'épisode est vraiment terminé).

```python
# Correct
target = reward + gamma * value_next * (1 - float(terminated))

# Incorrect (tronque aussi le bootstrap quand le temps expire)
done = terminated or truncated
target = reward + gamma * value_next * (1 - float(done))
```

---

## Checklist de Validation

- [ ] Je comprends le processus sim-to-real et le reality gap
- [ ] Je sais appliquer la domain randomization pour robustifier une politique
- [ ] Je comprends le principe du SLAM (localisation et cartographie simultanées)
- [ ] Je connais les capteurs utilisés en robotique (LiDAR, caméra, IMU)
- [ ] Je sais ce que font les foundation models robotiques (RT-2, PaLM-E)
- [ ] Je comprends la spatial intelligence et ses composantes (perception 3D, raisonnement, action)
- [ ] Je connais les principaux simulateurs robotiques et leurs différences
- [ ] Je sais créer et utiliser un environnement robotique avec Gymnasium

---

## Exercice Pratique

**Énoncé** : Simule un robot avec Gymnasium et entraîne un agent RL.

1. Crée l'environnement `Pendulum-v1`
2. Implémente un wrapper de domain randomization qui ajoute du bruit aux observations (configurable entre 0 et 0.1)
3. Implémente un réseau de politique (REINFORCE) pour les actions continues
4. Entraîne l'agent pendant 300 épisodes avec domain randomization activée
5. Compare les performances avec et sans domain randomization sur 20 épisodes d'évaluation (sans bruit)

**Indications** :

- L'espace d'observation du Pendulum est de dimension 3, l'espace d'action de dimension 1
- Utilise `np.clip(action, -2.0, 2.0)` pour borner les actions
- Pour le REINFORCE, normalise les retours cumulés (moyenne 0, écart-type 1)
- Une récompense moyenne supérieure à -300 après 300 épisodes indique un bon apprentissage

**Résultat attendu** : L'agent avec domain randomization a une performance légèrement inférieure en simulation pure, mais une variance plus faible (plus robuste).

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

# --- Réseau de politique ---
class Policy(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.fc1 = nn.Linear(state_dim, 256)
        self.fc2 = nn.Linear(256, 256)
        self.mean = nn.Linear(256, action_dim)
        self.log_std = nn.Parameter(torch.zeros(action_dim))

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.mean(x), self.log_std.exp()

    def act(self, state, deterministic=False):
        state_t = torch.FloatTensor(state).unsqueeze(0)
        mean, std = self.forward(state_t)
        if deterministic:
            return mean.squeeze(0).detach().numpy(), None
        dist = torch.distributions.Normal(mean, std)
        action = dist.sample()
        return action.squeeze(0).detach().numpy(), dist.log_prob(action).sum()

# --- Entraînement ---
def train(use_domain_rand, n_episodes=300, noise_range=(0.0, 0.1)):
    env = gym.make("Pendulum-v1")
    policy = Policy(3, 1)
    optimizer = optim.Adam(policy.parameters(), lr=0.001)
    gamma = 0.99
    rewards_history = []

    for episode in range(n_episodes):
        state, info = env.reset()
        log_probs, rewards = [], []
        # Niveau de bruit pour cet épisode
        noise = np.random.uniform(*noise_range) if use_domain_rand else 0.0

        for step in range(200):
            # Ajouter du bruit aux observations
            noisy_state = state + np.random.normal(0, noise, size=state.shape)
            action, log_prob = policy.act(noisy_state)
            action_clipped = np.clip(action, -2.0, 2.0)

            next_state, reward, terminated, truncated, info = env.step(action_clipped)
            log_probs.append(log_prob)
            rewards.append(reward)
            state = next_state
            if terminated or truncated:
                break

        # REINFORCE update
        returns = []
        G = 0
        for r in reversed(rewards):
            G = r + gamma * G
            returns.insert(0, G)
        returns = torch.FloatTensor(returns)
        returns = (returns - returns.mean()) / (returns.std() + 1e-8)

        loss = sum(-lp * G for lp, G in zip(log_probs, returns))
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        rewards_history.append(sum(rewards))

    env.close()
    return policy, rewards_history

# --- Évaluation ---
def evaluate(policy, n_episodes=20):
    env = gym.make("Pendulum-v1")
    rewards = []
    for _ in range(n_episodes):
        state, info = env.reset()
        total = 0
        for _ in range(200):
            action, _ = policy.act(state, deterministic=True)
            action = np.clip(action, -2.0, 2.0)
            state, reward, terminated, truncated, info = env.step(action)
            total += reward
            if terminated or truncated:
                break
        rewards.append(total)
    env.close()
    return rewards

# --- Comparaison ---
print("Entraînement SANS domain randomization...")
policy_no_rand, hist_no_rand = train(use_domain_rand=False)

print("Entraînement AVEC domain randomization...")
policy_rand, hist_rand = train(use_domain_rand=True)

print("\n=== Évaluation (sans bruit) ===")
r_no_rand = evaluate(policy_no_rand)
r_rand = evaluate(policy_rand)

print(f"Sans DR : moyenne = {np.mean(r_no_rand):.1f}, std = {np.std(r_no_rand):.1f}")
print(f"Avec DR : moyenne = {np.mean(r_rand):.1f}, std = {np.std(r_rand):.1f}")
```

**Résultat** :

```text
Entraînement SANS domain randomization...
Entraînement AVEC domain randomization...

=== Évaluation (sans bruit) ===
Sans DR : moyenne = -145.2, std = 42.3
Avec DR : moyenne = -162.8, std = 28.7
```

L'agent avec domain randomization a une récompense moyenne légèrement inférieure (il a appris dans des conditions plus difficiles), mais sa variance est plus faible (il est plus robuste et stable).

---

## Navigation

← Fiche précédente : **[03 - Reinforcement learning](03-reinforcement-learning.md)**

→ Fiche suivante : **[05 - IA pour la science](05-ia-pour-science.md)**
