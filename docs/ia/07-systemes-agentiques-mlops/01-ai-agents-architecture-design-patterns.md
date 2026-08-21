---
tags:
  - IA
  - Avancé
  - Concept
description: "AI Agents : architecture, design patterns (ReAct, tool use, planning, mémoire) et construction d'un agent"
estimated_time: "35 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 7 - Systèmes agentiques et MLOps"
id: "ai.artificial-intelligence.agents-mlops.ai-agents-architecture-design-patterns"
course_id: "ai.artificial-intelligence"
module_id: "ai.artificial-intelligence.agents-mlops"
content_type: "lesson"
order: 1
---

# 01 - AI Agents : architecture et design patterns

> **En bref** : À la fin de cette fiche, tu sauras expliquer les design patterns des agents IA (ReAct, tool use, planning, mémoire), comprendre les architectures mono-agent et multi-agent, et construire un agent simple avec tool calling en Python. Lecture estimée : 35 min.


## Prérequis

- [Phase 6 - Large Language Models](../06-large-language-models/index.md) (fiches 01 à 05)
- Connaissances en Python et en utilisation d'API LLM (OpenAI, Anthropic)
- Compréhension du prompt engineering et du context engineering

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les design patterns des agents IA (ReAct, tool use, planning, mémoire), comprendre les architectures mono-agent et multi-agent, et construire un agent simple avec tool calling en Python.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un agent IA ?

**Définition** : Un agent IA est un système composé d'un LLM (Large Language Model) couplé à des outils et à une boucle de raisonnement. L'agent reçoit un objectif, choisit des actions, les exécute via des outils, observe les résultats et itère **jusqu'à une condition d'arrêt** (réponse finale, budget d'étapes, timeout, ou échec). L'autonomie est **bornée** par les outils, les permissions et les garde-fous que tu configures.

**Le problème que les agents IA résolvent** :

Sans agents IA, voici les problèmes rencontrés :

1. **LLM passif** : un LLM seul ne fait que générer du texte. Il ne peut pas exécuter de code, interroger une base de données ou naviguer sur le web.
2. **Pas de boucle de rétroaction** : un LLM répond en une seule passe. Il ne peut pas appeler un outil, lire le résultat, puis corriger sa stratégie dans le même appel.
3. **Tâches multi-étapes difficiles en un seul appel** : rechercher, analyser puis rédiger nécessite en pratique plusieurs allers-retours (outils + contexte), pas une seule génération.

**Comment les agents IA résolvent ces problèmes** :

| Problème | Solution apportée par les agents IA |
| -------- | ----------------------------------- |
| LLM passif | L'agent dispose d'outils (fonctions, API) qu'il peut invoquer pour agir sur le monde |
| Pas de boucle de rétroaction | La boucle agent observe les résultats de chaque action et ajuste la stratégie |
| Tâches complexes impossibles | Le planning décompose l'objectif en sous-tâches exécutées séquentiellement |

**Analogie concrète** : Un LLM seul est un expert enfermé dans une pièce qui ne peut que parler. Un agent IA est ce même expert avec un téléphone (pour appeler des API), un ordinateur (pour exécuter du code), un carnet de notes (mémoire) et un plan d'action affiché au mur (planning). Il peut agir, observer et s'adapter.

**Ce qu'un agent IA n'est PAS** :

- Un agent IA n'est pas un chatbot. Un chatbot répond à des messages. Un agent choisit et enchaîne des actions via des outils dans une boucle.
- Un agent IA n'est pas un script automatisé. Un script suit un chemin prédéfini. Un agent choisit dynamiquement ses actions selon le contexte, avec un risque d'erreur à chaque étape.
- Un agent IA n'est pas une IA générale (AGI). Un agent est conçu pour un domaine de tâches spécifique avec des outils définis à l'avance.
- Un agent IA n'est pas fiable par défaut. Il peut boucler, appeler le mauvais outil, halluciner un argument, ou déclarer le succès trop tôt. Les limites (`max_iterations`, validation des outils, supervision humaine) sont obligatoires en production.

**Les trois composants fondamentaux d'un agent** :

| Composant | Rôle | Exemple |
| --------- | ---- | ------- |
| LLM (cerveau) | Raisonnement, prise de décision, génération de texte | GPT-4, Claude, Llama |
| Outils (bras) | Exécution d'actions concrètes | Appels API, lecture de fichiers, requêtes SQL |
| Boucle (processus) | Orchestration du cycle raisonnement-action-observation | ReAct loop, plan-and-execute |

---

### Qu'est-ce que le pattern ReAct ?

**Définition** : ReAct (Reasoning + Acting) est un design pattern où l'agent alterne entre trois phases : Thought (raisonnement), Action (exécution d'un outil) et Observation (lecture du résultat). Ce cycle se répète jusqu'à ce que l'agent puisse formuler une réponse finale.

**Le problème que ReAct résout** :

Sans ReAct, voici les problèmes rencontrés :

1. **Raisonnement sans action** : le chain-of-thought (CoT) permet au LLM de raisonner, mais il ne peut pas vérifier ses hypothèses en interagissant avec le monde réel
2. **Action sans raisonnement** : exécuter des outils sans réfléchir mène à des actions inutiles ou incorrectes
3. **Pas de traçabilité** : impossible de comprendre pourquoi l'agent a pris une décision

**Comment ReAct résout ces problèmes** :

| Problème | Solution apportée par ReAct |
| -------- | --------------------------- |
| Raisonnement sans action | Chaque Thought est suivi d'une Action concrète |
| Action sans raisonnement | Chaque Action est précédée d'un Thought qui justifie le choix |
| Pas de traçabilité | La trace Thought/Action/Observation est entièrement lisible |

**Le cycle ReAct** :

```text
1. Thought: "Je dois trouver la population de la France en 2024."
2. Action: search("population France 2024")
3. Observation: "La population de la France est de 68,4 millions en 2024."
4. Thought: "J'ai la réponse, je peux répondre à l'utilisateur."
5. Final Answer: "La population de la France est de 68,4 millions d'habitants en 2024."
```

Le diagramme suivant illustre la boucle ReAct, qui alterne raisonnement, action et observation :

<div class="diagram-design">
<p><a href="../../../diagrams/ia-07-systemes-agentiques-mlops-01-ai-agents-architecture-design-patterns-1.html">Qu&#x27;est-ce que le pattern ReAct ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-07-systemes-agentiques-mlops-01-ai-agents-architecture-design-patterns-1.html" title="Qu&#x27;est-ce que le pattern ReAct ?" style="width:100%;min-height:660px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : ReAct fonctionne comme un détective qui enquête. Il réfléchit (Thought : "Le suspect était à Paris ce jour-là"), agit (Action : vérifier les caméras de surveillance), observe le résultat (Observation : "Les caméras confirment sa présence"), puis ajuste son raisonnement pour l'étape suivante.

**Ce que ReAct n'est PAS** :

- ReAct n'est pas du chain-of-thought (CoT). Le CoT est du raisonnement pur sans action. ReAct combine raisonnement ET actions.
- ReAct n'est pas un workflow figé. L'agent décide dynamiquement quelle action entreprendre à chaque étape.

---

### Qu'est-ce que le tool use / function calling ?

**Définition** : Le tool use (ou function calling) est le mécanisme qui permet à un LLM d'appeler des fonctions externes. Le LLM génère un appel de fonction structuré (nom de la fonction et arguments au format JSON), le système exécute la fonction, puis renvoie le résultat au LLM.

**Le problème que le tool use résout** :

Sans tool use, voici les problèmes rencontrés :

1. **Pas de données en temps réel** : le LLM ne connaît que ses données d'entraînement, figées à une date précise
2. **Pas de calcul fiable** : le LLM fait des erreurs d'arithmétique et ne peut pas exécuter de code
3. **Pas d'action externe** : le LLM ne peut pas envoyer un email, créer un fichier ou interroger une base de données

**Comment le tool use résout ces problèmes** :

| Problème | Solution apportée par le tool use |
| -------- | --------------------------------- |
| Pas de données en temps réel | L'outil `search` interroge le web ou une API pour obtenir des données actuelles |
| Pas de calcul fiable | L'outil `calculator` ou `code_interpreter` effectue les calculs exacts |
| Pas d'action externe | Des outils dédiés (email, fichier, SQL) exécutent les actions demandées |

**Structure d'une définition d'outil** :

```json
{
  "name": "get_weather",
  "description": "Récupère la météo actuelle pour une ville donnée",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "Le nom de la ville"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "L'unité de température"
      }
    },
    "required": ["city"]
  }
}
```

**Analogie concrète** : Le tool use est comme un téléphone pour un employé de bureau. L'employé (LLM) sait qui appeler (description de l'outil), quelles informations donner (paramètres) et interprète la réponse reçue. Il ne fait pas le travail lui-même, il délègue à des spécialistes (les fonctions).

**Ce que le tool use n'est PAS** :

- Le tool use n'est pas l'exécution directe de code par le LLM. Le LLM génère l'appel, mais c'est le système hôte qui exécute la fonction.
- Le tool use n'est pas du RAG. Le RAG récupère des documents pour enrichir le contexte. Le tool use exécute des actions et renvoie des résultats structurés.

---

### Qu'est-ce que le planning ?

**Définition** : Le planning est la capacité d'un agent à décomposer un objectif complexe en sous-tâches ordonnées, à anticiper les dépendances entre ces sous-tâches et à ajuster son plan en fonction des résultats obtenus.

**Le problème que le planning résout** :

Sans planning, voici les problèmes rencontrés :

1. **Approche chaotique** : l'agent exécute des actions sans vision globale, ce qui mène à des impasses
2. **Tâches oubliées** : certaines étapes nécessaires sont omises car l'agent ne planifie pas à l'avance
3. **Pas de priorisation** : l'agent ne sait pas quelle étape effectuer en premier

**Comment le planning résout ces problèmes** :

| Problème | Solution apportée par le planning |
| -------- | --------------------------------- |
| Approche chaotique | L'agent crée un plan structuré avant d'agir |
| Tâches oubliées | Le plan liste toutes les étapes nécessaires |
| Pas de priorisation | Les étapes sont ordonnées par dépendance et priorité |

**Types de planning** :

| Type | Description | Quand l'utiliser |
| ---- | ----------- | ---------------- |
| Plan-and-execute | Créer un plan complet, puis exécuter étape par étape | Tâches bien définies avec étapes prévisibles |
| Adaptive planning | Replanifier après chaque étape selon les résultats | Tâches où les résultats intermédiaires influencent la suite |
| Tree of thoughts | Explorer plusieurs chemins de raisonnement en parallèle | Problèmes complexes avec plusieurs solutions possibles |

**Analogie concrète** : Le planning d'un agent est comme la préparation d'un voyage. Avant de partir (agir), tu listes les destinations (sous-tâches), tu vérifies les horaires de train (dépendances), tu réserves les hôtels dans l'ordre (ordonnancement). Si un train est annulé (résultat inattendu), tu adaptes le plan.

---

### Qu'est-ce que la mémoire d'un agent ?

**Définition** : La mémoire d'un agent est le mécanisme qui lui permet de stocker et de récupérer des informations au-delà de la fenêtre de contexte du LLM. Elle se décline en plusieurs types selon la durée et l'usage.

**Le problème que la mémoire résout** :

Sans mémoire, voici les problèmes rencontrés :

1. **Oubli entre les sessions** : l'agent recommence à zéro à chaque nouvelle conversation
2. **Contexte limité** : la fenêtre de contexte du LLM (128K-1M tokens) ne suffit pas pour des historiques longs
3. **Pas de capitalisation** : l'agent ne réutilise pas les connaissances acquises lors de tâches précédentes

**Comment la mémoire résout ces problèmes** :

| Problème | Solution apportée par la mémoire |
| -------- | -------------------------------- |
| Oubli entre les sessions | La mémoire long-terme persiste les informations clés dans un vector store |
| Contexte limité | La mémoire filtre et résume les informations pertinentes pour tenir dans la fenêtre de contexte |
| Pas de capitalisation | La mémoire long-terme stocke les apprentissages réutilisables |

**Types de mémoire** :

| Type | Durée | Stockage | Exemple |
| ---- | ----- | -------- | ------- |
| Short-term (conversation) | Une session | Historique des messages dans le contexte LLM | Les derniers échanges utilisateur-agent |
| Working memory | Une tâche | Variables et état intermédiaire en cours de traitement | Le plan en cours, les résultats partiels |
| Long-term | Permanent | Vector store (embeddings) ou base de données | Préférences utilisateur, faits appris |
| Episodic | Permanent | Log structuré des interactions passées | "La dernière fois, l'utilisateur a demandé X et la solution était Y" |

**Analogie concrète** : La mémoire d'un agent est comme celle d'un médecin. La mémoire short-term est la conversation en cours avec le patient. La working memory est le diagnostic en cours d'élaboration. La mémoire long-term est le dossier médical du patient stocké dans l'armoire. La mémoire épisodique est le souvenir des cas similaires traités par le passé.

---

### Qu'est-ce que le multi-agent ?

**Définition** : Le multi-agent est un pattern d'architecture où plusieurs agents spécialisés collaborent pour résoudre une tâche complexe. Chaque agent a un rôle défini (recherche, analyse, rédaction) et communique avec les autres via un protocole d'orchestration.

**Le problème que le multi-agent résout** :

Sans multi-agent, voici les problèmes rencontrés :

1. **Agent surchargé** : un seul agent doit maîtriser tous les outils et tous les domaines, ce qui dégrade la qualité
2. **Pas de spécialisation** : le même prompt doit couvrir des compétences contradictoires (créativité vs rigueur)
3. **Pas de parallélisme** : les sous-tâches indépendantes sont exécutées séquentiellement

**Comment le multi-agent résout ces problèmes** :

| Problème | Solution apportée par le multi-agent |
| -------- | ------------------------------------ |
| Agent surchargé | Chaque agent a un rôle limité avec des outils et un prompt spécifiques |
| Pas de spécialisation | Chaque agent a un system prompt optimisé pour sa tâche |
| Pas de parallélisme | Les agents indépendants peuvent travailler en parallèle |

**Patterns d'orchestration multi-agent** :

| Pattern | Description | Exemple |
| ------- | ----------- | ------- |
| Séquentiel (pipeline) | Agent A -> Agent B -> Agent C | Recherche -> Analyse -> Rédaction |
| Superviseur (hierarchical) | Un agent chef distribue les tâches aux agents workers | Chef de projet qui délègue à des spécialistes |
| Débat (adversarial) | Deux agents argumentent, un juge tranche | Revue de code avec auteur et reviewer |
| Essaim (swarm) | Agents autonomes qui se coordonnent dynamiquement | Agents qui se passent le contexte selon les besoins |

**Analogie concrète** : Le multi-agent est comme une équipe de projet. Le chef de projet (orchestrateur) distribue les tâches. Le développeur (agent code) écrit le code. Le testeur (agent test) vérifie le résultat. Le rédacteur (agent doc) documente le travail. Chacun est spécialisé et le résultat final est meilleur que si une seule personne faisait tout.

**Ce que le multi-agent n'est PAS** :

- Le multi-agent n'est pas toujours meilleur qu'un mono-agent. Pour des tâches simples, un seul agent bien configuré est plus efficace et moins coûteux.
- Le multi-agent n'est pas de l'IA distribuée au sens calcul distribué. Les agents partagent un objectif commun, pas une charge de calcul.

---

## Étapes Pratiques

### Étape 1 : Définir les outils de l'agent

Crée un fichier `tools.py` qui définit les outils disponibles pour l'agent.

```python
# tools.py
# Définition des outils que l'agent pourra utiliser

import math
import json
from datetime import datetime


def calculator(expression: str) -> str:
    """Évalue une expression mathématique et renvoie le résultat."""
    try:
        # ATTENTION PÉDAGOGIQUE : eval() est dangereux (exécution de code).
        # Même avec __builtins__ vide, préfère un parseur math dédié (asteval, numexpr, etc.).
        # Ici : démo uniquement, jamais sur une entrée non fiable en production.
        result = eval(expression, {"__builtins__": {}}, {"math": math})
        return json.dumps({"result": result})
    except Exception as e:
        return json.dumps({"error": str(e)})


def read_file(file_path: str) -> str:
    """Lit le contenu d'un fichier dans un répertoire allowlisté (démo)."""
    import os
    # Contrôle d'accès minimal : refuse les chemins hors du sandbox de démo
    base = os.path.abspath("./agent_sandbox")
    target = os.path.abspath(os.path.join(base, file_path))
    if not target.startswith(base + os.sep) and target != base:
        return json.dumps({"error": "Chemin hors allowlist (sandbox)"})
    try:
        with open(target, "r", encoding="utf-8") as f:
            content = f.read()
        return json.dumps({"content": content})
    except FileNotFoundError:
        return json.dumps({"error": f"Fichier non trouvé : {file_path}"})


def get_current_datetime() -> str:
    """Renvoie la date et l'heure actuelles."""
    now = datetime.now()
    return json.dumps({
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M:%S"),
        "day_of_week": now.strftime("%A")
    })


# Registre des outils : associe le nom de la fonction à la fonction elle-même
TOOLS_REGISTRY = {
    "calculator": calculator,
    "read_file": read_file,
    "get_current_datetime": get_current_datetime,
}

# Définitions des outils au format JSON Schema pour le LLM
TOOLS_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Évalue une expression mathématique. "
                           "Supporte +, -, *, /, **, math.sqrt(), math.pi, etc.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "L'expression mathématique à évaluer"
                    }
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Lit le contenu d'un fichier texte.",
            "parameters": {
                "type": "object",
                "properties": {
                    "file_path": {
                        "type": "string",
                        "description": "Le chemin vers le fichier à lire"
                    }
                },
                "required": ["file_path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_datetime",
            "description": "Renvoie la date et l'heure actuelles.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    }
]
```

---

### Étape 2 : Construire la boucle agent ReAct

Crée un fichier `agent.py` qui implémente la boucle ReAct avec tool calling.

```python
# agent.py
# Agent simple avec boucle ReAct et tool calling

import json
from openai import OpenAI
from tools import TOOLS_REGISTRY, TOOLS_DEFINITIONS

# Initialisation du client OpenAI
client = OpenAI()

# Le system prompt définit le comportement de l'agent
SYSTEM_PROMPT = """Tu es un assistant capable d'utiliser des outils pour répondre
aux questions. Tu disposes des outils suivants :
- calculator : pour les calculs mathématiques
- read_file : pour lire le contenu de fichiers
- get_current_datetime : pour connaître la date et l'heure actuelles

Raisonne étape par étape avant d'utiliser un outil. Si tu as la réponse,
réponds directement sans utiliser d'outil."""


def run_agent(user_message: str, max_iterations: int = 10) -> str:
    """Exécute la boucle agent jusqu'à obtenir une réponse finale."""

    # Initialisation de l'historique des messages
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message}
    ]

    for iteration in range(max_iterations):
        print(f"\n--- Itération {iteration + 1} ---")

        # Appel au LLM avec les outils disponibles
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=TOOLS_DEFINITIONS,
            tool_choice="auto"  # Le LLM décide s'il utilise un outil
        )

        assistant_message = response.choices[0].message

        # Ajouter la réponse de l'assistant à l'historique
        messages.append(assistant_message)

        # Cas 1 : Le LLM veut utiliser des outils
        if assistant_message.tool_calls:
            for tool_call in assistant_message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)

                print(f"Action: {function_name}({arguments})")

                # Exécuter l'outil
                if function_name in TOOLS_REGISTRY:
                    result = TOOLS_REGISTRY[function_name](**arguments)
                else:
                    result = json.dumps({"error": f"Outil inconnu: {function_name}"})

                print(f"Observation: {result}")

                # Ajouter le résultat de l'outil à l'historique
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result
                })

        # Cas 2 : Le LLM donne une réponse finale (pas d'appel d'outil)
        else:
            print(f"Réponse finale: {assistant_message.content}")
            return assistant_message.content

    return "Nombre maximum d'itérations atteint."


# Point d'entrée
if __name__ == "__main__":
    question = "Quel est le résultat de (15 * 23) + math.sqrt(144) ?"
    result = run_agent(question)
    print(f"\nRéponse: {result}")
```

**Résultat attendu** :

```text
--- Itération 1 ---
Action: calculator({"expression": "(15 * 23) + math.sqrt(144)"})
Observation: {"result": 357.0}

--- Itération 2 ---
Réponse finale: Le résultat de (15 * 23) + sqrt(144) est 357.0.

Réponse: Le résultat de (15 * 23) + sqrt(144) est 357.0.
```

---

### Étape 3 : Ajouter la mémoire conversationnelle

Modifie l'agent pour conserver l'historique entre les appels.

```python
# agent_with_memory.py
# Agent avec mémoire conversationnelle persistante entre les échanges

import json
from openai import OpenAI
from tools import TOOLS_REGISTRY, TOOLS_DEFINITIONS

client = OpenAI()

SYSTEM_PROMPT = """Tu es un assistant avec mémoire. Tu te souviens de tout
ce que l'utilisateur t'a dit dans cette conversation. Utilise tes outils
quand c'est nécessaire."""


class Agent:
    """Agent avec mémoire conversationnelle."""

    def __init__(self):
        # L'historique persiste entre les appels à chat()
        self.messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

    def chat(self, user_message: str, max_iterations: int = 10) -> str:
        """Envoie un message à l'agent et récupère sa réponse."""
        self.messages.append({"role": "user", "content": user_message})

        for _ in range(max_iterations):
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=self.messages,
                tools=TOOLS_DEFINITIONS,
                tool_choice="auto"
            )

            assistant_message = response.choices[0].message
            self.messages.append(assistant_message)

            if assistant_message.tool_calls:
                for tool_call in assistant_message.tool_calls:
                    fn_name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    result = TOOLS_REGISTRY.get(fn_name, lambda **k: '{"error": "unknown"}')(**args)
                    self.messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": result
                    })
            else:
                return assistant_message.content

        return "Nombre maximum d'itérations atteint."


if __name__ == "__main__":
    agent = Agent()

    # Premier échange : l'agent apprend une information
    print(agent.chat("Mon prénom est John et j'apprends l'IA."))

    # Deuxième échange : l'agent se souvient
    print(agent.chat("Quel est mon prénom ?"))

    # Troisième échange : utilisation d'un outil + mémoire
    print(agent.chat("Calcule 42 * 7 et dis-moi bonjour avec mon prénom."))
```

**Résultat attendu** :

```text
Bonjour John ! Ravi de t'accompagner dans ton apprentissage de l'IA.
Ton prénom est John.
Bonjour John ! Le résultat de 42 * 7 est 294.
```

---

### Étape 4 : Tester l'agent avec différentes requêtes

```python
# test_agent.py
# Script de test pour vérifier le comportement de l'agent

from agent import run_agent

# Test 1 : Calcul mathématique (doit utiliser l'outil calculator)
print("=== Test 1 : Calcul ===")
run_agent("Combien font 2**10 ?")

# Test 2 : Date actuelle (doit utiliser l'outil get_current_datetime)
print("\n=== Test 2 : Date ===")
run_agent("Quel jour sommes-nous ?")

# Test 3 : Question simple (ne doit PAS utiliser d'outil)
print("\n=== Test 3 : Question directe ===")
run_agent("Qu'est-ce que Python ?")

# Test 4 : Tâche multi-étapes (doit chaîner plusieurs outils)
print("\n=== Test 4 : Multi-étapes ===")
run_agent("Lis le fichier data.txt et calcule la somme des nombres qu'il contient.")
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install openai` | Installe le client Python OpenAI |
| `pip install anthropic` | Installe le client Python Anthropic |
| `export OPENAI_API_KEY="sk-..."` | Configure la clé API OpenAI |
| `python agent.py` | Exécute l'agent |
| `pip install langchain langgraph` | Installe LangChain et LangGraph |

---

## Pièges Fréquents

### Piège 1 : Boucle infinie de l'agent

**Problème** : L'agent appelle le même outil en boucle sans progresser vers une réponse finale.

**Solution** : Toujours définir un `max_iterations` dans la boucle agent. Ajouter dans le system prompt une instruction explicite : "Si tu as assez d'informations, donne ta réponse finale sans utiliser d'outil."

---

### Piège 2 : Outils mal définis

**Problème** : Le LLM n'utilise pas les outils ou les utilise avec de mauvais arguments.

**Solution** : La description de chaque outil doit être claire et précise. Les noms des paramètres doivent être explicites. Ajouter des exemples dans la description si nécessaire.

```json
{
  "description": "Cherche des informations sur le web. Exemple : search('population France 2024')"
}
```

---

### Piège 3 : Ne pas gérer les erreurs des outils

**Problème** : Un outil renvoie une erreur (fichier introuvable, API indisponible) et l'agent ne sait pas quoi faire.

**Solution** : Chaque outil doit renvoyer un message d'erreur structuré (JSON avec un champ `error`). Le system prompt doit indiquer à l'agent comment réagir aux erreurs.

---

### Piège 4 : Context window saturée

**Problème** : Après de nombreuses itérations, l'historique des messages dépasse la fenêtre de contexte du LLM.

**Solution** : Implémenter une stratégie de gestion de la mémoire : résumer les échanges anciens, ne conserver que les N derniers messages, ou utiliser un vector store pour la mémoire long-terme.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est un agent IA et ses trois composants (LLM, outils, boucle)
- [ ] Je comprends le pattern ReAct (Thought/Action/Observation)
- [ ] Je sais définir un outil au format JSON Schema
- [ ] Je sais implémenter une boucle agent avec tool calling en Python
- [ ] Je comprends la différence entre mémoire short-term, working et long-term
- [ ] Je sais expliquer les patterns multi-agent (pipeline, superviseur, débat)
- [ ] Mon agent s'arrête correctement (pas de boucle infinie)

---

## Exercice Pratique

**Énoncé** : Construis un agent avec trois outils :

1. `calculator` : évalue des expressions mathématiques
2. `search_web` : simule une recherche web (renvoie des résultats fictifs)
3. `read_file` : lit le contenu d'un fichier

L'agent doit être capable de répondre à des questions qui nécessitent de chaîner plusieurs outils. Par exemple : "Lis le fichier 'prix.txt' et calcule le total des prix."

**Indications** :

- Utilise le format JSON Schema pour définir tes outils
- Implémente la boucle ReAct avec un maximum de 10 itérations
- Gère les erreurs des outils (fichier introuvable, expression invalide)
- Teste avec au moins 3 requêtes différentes

**Résultat attendu** : Un script Python fonctionnel qui exécute un agent capable de chaîner des appels d'outils et de fournir une réponse finale.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# exercise_agent.py
# Solution : Agent avec 3 outils (calculator, search_web, read_file)

import json
import math
from openai import OpenAI

client = OpenAI()

# --- Définition des outils ---

def calculator(expression: str) -> str:
    """Évalue une expression mathématique."""
    try:
        result = eval(expression, {"__builtins__": {}}, {"math": math})
        return json.dumps({"result": result})
    except Exception as e:
        return json.dumps({"error": f"Expression invalide : {e}"})


def search_web(query: str) -> str:
    """Simule une recherche web avec des résultats fictifs."""
    # En production, ceci appellerait une vraie API de recherche
    fake_results = {
        "population france": "La population de la France est de 68,4 millions en 2024.",
        "python langage": "Python est un langage de programmation créé en 1991 par Guido van Rossum.",
        "tour eiffel hauteur": "La Tour Eiffel mesure 330 mètres avec son antenne.",
    }
    # Recherche par correspondance partielle dans les résultats fictifs
    query_lower = query.lower()
    for key, value in fake_results.items():
        if key in query_lower:
            return json.dumps({"results": [value]})
    return json.dumps({"results": ["Aucun résultat trouvé pour cette recherche."]})


def read_file(file_path: str) -> str:
    """Lit le contenu d'un fichier."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.dumps({"content": f.read()})
    except FileNotFoundError:
        return json.dumps({"error": f"Fichier non trouvé : {file_path}"})
    except PermissionError:
        return json.dumps({"error": f"Permission refusée : {file_path}"})


# Registre des fonctions
REGISTRY = {
    "calculator": calculator,
    "search_web": search_web,
    "read_file": read_file,
}

# Définitions JSON Schema des outils
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Évalue une expression mathématique Python.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "Expression mathématique"}
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Recherche des informations sur le web.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "La requête de recherche"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Lit le contenu d'un fichier texte.",
            "parameters": {
                "type": "object",
                "properties": {
                    "file_path": {"type": "string", "description": "Chemin du fichier"}
                },
                "required": ["file_path"]
            }
        }
    }
]

SYSTEM_PROMPT = """Tu es un assistant qui utilise des outils pour répondre.
Raisonne étape par étape. Si tu as la réponse, réponds directement.
En cas d'erreur d'un outil, explique le problème à l'utilisateur."""


def run_agent(user_message: str, max_iterations: int = 10) -> str:
    """Boucle agent ReAct."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message}
    ]

    for i in range(max_iterations):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto"
        )
        msg = response.choices[0].message
        messages.append(msg)

        if msg.tool_calls:
            for tc in msg.tool_calls:
                fn = tc.function.name
                args = json.loads(tc.function.arguments)
                print(f"  [Outil] {fn}({args})")
                result = REGISTRY.get(fn, lambda **k: '{"error": "inconnu"}')(**args)
                print(f"  [Résultat] {result}")
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": result
                })
        else:
            return msg.content

    return "Max itérations atteint."


if __name__ == "__main__":
    # Test 1 : Calcul simple
    print("=== Test 1 ===")
    print(run_agent("Combien font 15 * 23 + 12 ?"))

    # Test 2 : Recherche web
    print("\n=== Test 2 ===")
    print(run_agent("Quelle est la hauteur de la Tour Eiffel ?"))

    # Test 3 : Chaînage d'outils (lecture + calcul)
    print("\n=== Test 3 ===")
    print(run_agent("Lis le fichier 'prix.txt' et calcule la somme des prix."))
```

---

## Navigation

→ Fiche suivante : **[02 - Frameworks d'agents](02-frameworks-agents.md)**
