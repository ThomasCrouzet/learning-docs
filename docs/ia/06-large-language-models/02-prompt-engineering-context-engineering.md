---
tags:
  - IA
  - Avancé
  - Pratique
description: "Prompt engineering et context engineering : zéro/few-shot, Chain-of-Thought, ReAct, system prompts et gestion du contexte"
estimated_time: "40 min"
fiche_number: 2
total_fiches: 5
cursus: "Phase 6 - Large Language Models"
---

# 02 - Prompt engineering et context engineering

> **En bref** : À la fin de cette fiche, tu sauras construire des prompts efficaces en utilisant les techniques zéro-shot, few-shot et Chain-of-Thought, implémenter le pattern ReAct pour des tâches complexes, structurer des system prompts robustes, et gérer le contexte d'un LLM pour maximiser la qualité des réponses. Lecture estimée : 40 min.


## Prérequis

- [Fiche 01 - Architecture et fonctionnement des LLM](01-architecture-fonctionnement-llm.md) (decoder-only, tokenization, next token prediction)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras construire des prompts efficaces en utilisant les techniques zéro-shot, few-shot et Chain-of-Thought, implémenter le pattern ReAct pour des tâches complexes, structurer des system prompts robustes, et gérer le contexte d'un LLM pour maximiser la qualité des réponses.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le zéro-shot et few-shot prompting ?

**Définition** : Le zéro-shot prompting consiste à demander au LLM d'effectuer une tâche sans lui donner d'exemple. Le few-shot prompting consiste à inclure quelques exemples (typiquement 2 à 5) dans le prompt pour montrer au modèle le format et le comportement attendus.

**Le problème que le few-shot prompting résout** :

Sans few-shot prompting, voici les problèmes rencontrés :

1. **Format imprévisible** : le modèle peut répondre dans n'importe quel format, rendant le parsing difficile
2. **Mauvaise compréhension de la tâche** : une instruction textuelle seule peut être ambigue
3. **Qualité variable** : sans exemples, le modèle ne sait pas quel niveau de détail ou de précision est attendu

**Comment le few-shot prompting résout ces problèmes** :

| Problème | Solution apportée par le few-shot |
| -------- | --------------------------------- |
| Format imprévisible | Les exemples montrent exactement le format de sortie attendu |
| Mauvaise compréhension | Les exemples clarifient la tâche mieux que des instructions verbales |
| Qualité variable | Les exemples fixent le niveau de qualité attendu |

**Analogie concrète** : Imagine que tu demandes à quelqu'un de remplir un formulaire administratif. En zéro-shot, tu lui donnes juste le formulaire vierge et une description de ce qu'il faut faire. En few-shot, tu lui montres 2-3 formulaires déjà remplis comme modèle. La deuxième approche produit des résultats beaucoup plus cohérents.

**Ce que le few-shot prompting n'est PAS** :

- Le few-shot n'est pas du fine-tuning. Le modèle ne modifie pas ses poids. Les exemples sont inclus dans le prompt et traités comme du contexte.
- Le few-shot n'est pas de l'apprentissage permanent. Si tu changes de conversation, le modèle "oublie" les exemples.

---

### Qu'est-ce que le Chain-of-Thought (CoT) ?

**Définition** : Le Chain-of-Thought est une technique de prompting qui demande au modèle de raisonner étape par étape avant de donner sa réponse finale. Cela améliore significativement les performances sur les tâches de raisonnement, de mathématiques et de logique.

**Le problème que le CoT résout** :

Sans Chain-of-Thought, voici les problèmes rencontrés :

1. **Réponses directes incorrectes** : le modèle saute des étapes de raisonnement et donne une réponse fausse
2. **Pas de vérifiabilité** : impossible de comprendre comment le modèle est arrivé à sa réponse
3. **Erreurs de raisonnement complexe** : les problèmes multi-étapes sont souvent mal résolus quand le modèle essaie de répondre en un seul pas

**Comment le CoT résout ces problèmes** :

| Problème | Solution apportée par le CoT |
| -------- | ---------------------------- |
| Réponses directes incorrectes | Le raisonnement étape par étape réduit les erreurs de calcul et de logique |
| Pas de vérifiabilité | Chaque étape de raisonnement est visible et vérifiable |
| Erreurs multi-étapes | Chaque sous-problème est résolu séparément |

**Analogie concrète** : Imagine un élève qui résout un problème de mathématiques. Sans CoT, il écrit directement la réponse finale (souvent fausse). Avec CoT, il montre tout son raisonnement sur le brouillon : "D'abord je calcule X, ensuite j'applique Y, ce qui donne Z." Le professeur peut vérifier chaque étape et l'élève fait moins d'erreurs.

#### Self-consistency

La self-consistency est une extension du CoT qui génère plusieurs chaînes de raisonnement indépendantes pour le même problème, puis sélectionne la réponse la plus fréquente (vote majoritaire). Cela réduit l'impact des erreurs aléatoires dans une chaîne de raisonnement particulière.

---

### Qu'est-ce que ReAct ?

**Définition** : ReAct (Reasoning + Acting) est un pattern de prompting qui alterne entre des étapes de raisonnement (Thought), d'action (Action) et d'observation (Observation). Il permet au modèle d'interagir avec des outils externes (recherche, calculatrice, API) dans une boucle itérative.

**Le problème que ReAct résout** :

Sans ReAct, voici les problèmes rencontrés :

1. **Pas d'accès au monde extérieur** : le LLM ne peut répondre qu'à partir de ses connaissances d'entraînement, qui peuvent être obsolètes ou incomplètes
2. **Hallucinations sur les faits** : quand le modèle ne connaît pas une information, il invente plutôt que d'admettre son ignorance
3. **Tâches complexes irréalisables** : certaines tâches nécessitent de combiner raisonnement et interactions avec des systèmes externes

**Comment ReAct résout ces problèmes** :

| Problème | Solution apportée par ReAct |
| -------- | --------------------------- |
| Pas d'accès au monde extérieur | Les Actions permettent d'appeler des outils (recherche, API, BD) |
| Hallucinations | Les Observations fournissent des données réelles pour baser le raisonnement |
| Tâches complexes | La boucle Thought/Action/Observation décompose le problème en étapes vérifiables |

**Analogie concrète** : Imagine un détective qui enquête sur une affaire. Il ne se contente pas de deviner la solution (pure raisonnement). Il réfléchit à ce qu'il doit chercher (Thought), interroge un témoin ou consulte un dossier (Action), analyse ce qu'il a appris (Observation), puis décide de la prochaine étape. ReAct suit exactement cette boucle.

**Ce que ReAct n'est PAS** :

- ReAct n'est pas un agent autonome. C'est un pattern de prompting. L'orchestration (appeler les outils, collecter les résultats) est gérée par le code applicatif.
- ReAct n'est pas du fine-tuning. Le modèle apprend le format ReAct via le prompt, pas via un entraînement spécifique.

#### Format ReAct

```text
Question: Quel est le PIB par habitant de la France en 2024 ?

Thought: Je dois chercher le PIB de la France et sa population en 2024.
Action: search("PIB France 2024")
Observation: Le PIB de la France en 2024 est de 2 923 milliards d'euros.

Thought: J'ai le PIB total. Maintenant je dois trouver la population.
Action: search("population France 2024")
Observation: La population française en 2024 est de 68,4 millions d'habitants.

Thought: Je peux maintenant calculer le PIB par habitant.
Action: calculate("2923000000000 / 68400000")
Observation: 42 749 euros

Thought: J'ai toutes les informations. Le PIB par habitant de la France en 2024 est d'environ 42 749 euros.
Answer: Le PIB par habitant de la France en 2024 est d'environ 42 749 euros.
```

---

### Que sont les system prompts et instructions ?

**Définition** : Le system prompt est un message spécial envoyé au début d'une conversation qui définit le rôle, les contraintes, le comportement et le format de sortie du modèle. Il est traité avec une priorité plus élevée que les messages utilisateur.

**Le problème que les system prompts résolvent** :

Sans system prompts, voici les problèmes rencontrés :

1. **Comportement par défaut générique** : le modèle répond de manière générale, sans personnalisation pour le cas d'usage
2. **Pas de contraintes** : le modèle peut générer du contenu hors sujet ou dans un format inadapté
3. **Incohérence** : entre les messages, le modèle peut changer de style ou de comportement

**Comment les system prompts résolvent ces problèmes** :

| Problème | Solution apportée par les system prompts |
| -------- | ---------------------------------------- |
| Comportement générique | Le system prompt définit un rôle et un contexte précis |
| Pas de contraintes | Les instructions fixent les limites (format, ton, sujets autorisés) |
| Incohérence | Le system prompt est envoyé à chaque requête, assurant la cohérence |

**Analogie concrète** : Le system prompt est comme la fiche de poste d'un employé. Avant de commencer à travailler (répondre), il consulte sa fiche qui lui dit : "Tu es un expert en X, tu dois répondre en format Y, tu ne dois jamais faire Z." Cette fiche garantit un comportement cohérent jour après jour.

#### Structure d'un bon system prompt

Un system prompt efficace contient :

1. **Rôle** : qui est le modèle dans ce contexte
2. **Contexte** : informations nécessaires à la tâche
3. **Instructions** : ce que le modèle doit faire
4. **Contraintes** : ce que le modèle ne doit pas faire
5. **Format de sortie** : la structure attendue de la réponse
6. **Exemples** (optionnel) : un ou deux exemples du comportement attendu

---

### Qu'est-ce que la context window ?

**Définition** : La context window (fenêtre de contexte) est le nombre maximum de tokens qu'un LLM peut traiter en une seule fois. Elle inclut le system prompt, l'historique de conversation, le prompt utilisateur et la réponse générée.

**Le problème que la context window pose** :

1. **Limite physique** : au-delà de la fenêtre, les tokens sont ignorés ou tronqués
2. **Dégradation de la qualité** : même dans la fenêtre, les informations au milieu de longs contextes sont moins bien traitées ("lost in the middle")
3. **Coût croissant** : le coût d'inférence croît avec le nombre de tokens (quadratiquement pour l'attention)

**Tailles de context window courantes** :

| Modèle | Context window | Équivalent approximatif |
| ------ | -------------- | ----------------------- |
| GPT-3.5 | 16K tokens | ~12 000 mots |
| GPT-4o | 128K tokens | ~96 000 mots |
| Claude 3.5 Sonnet | 200K tokens | ~150 000 mots |
| Gemini 1.5 Pro | 1M tokens | ~750 000 mots |
| Llama 3.1 | 128K tokens | ~96 000 mots |

**Stratégies de gestion du contexte** :

- **Troncation** : couper les messages les plus anciens de l'historique
- **Résumé** : résumer les messages anciens pour libérer des tokens
- **Sliding window** : garder les N derniers messages
- **RAG** : ne charger que les informations pertinentes à la question

---

### Qu'est-ce que le context engineering ?

**Définition** : Le context engineering est la discipline qui consiste à orchestrer les informations envoyées au LLM pour maximiser la qualité des réponses. C'est l'évolution du prompt engineering : au lieu de se concentrer uniquement sur la formulation de la question, on optimise l'ensemble du contexte (system prompt, exemples, documents récupérés, historique).

**Le problème que le context engineering résout** :

Sans context engineering, voici les problèmes rencontrés :

1. **Informations manquantes** : le modèle n'a pas les données nécessaires pour répondre correctement
2. **Informations non pertinentes** : trop de bruit dans le contexte dilue les informations importantes
3. **Organisation inefficace** : les informations critiques sont noyées au milieu du contexte et mal traitées

**Comment le context engineering résout ces problèmes** :

| Problème | Solution apportée par le context engineering |
| -------- | -------------------------------------------- |
| Informations manquantes | Retrieval ciblé (RAG, tool use) pour injecter les bonnes données |
| Informations non pertinentes | Filtrage et ranking des informations avant injection |
| Organisation inefficace | Placement stratégique (début et fin du contexte) |

**Analogie concrète** : Imagine un avocat qui prépare un dossier pour un procès. Le prompt engineering, c'est rédiger une bonne question au témoin. Le context engineering, c'est tout le travail en amont : sélectionner les bonnes pièces du dossier, les organiser dans le bon ordre, s'assurer que le juge voit les preuves clés en premier et en dernier (effet de primauté et de récence).

**Comparaison prompt engineering vs context engineering** :

| Prompt engineering | Context engineering |
| ------------------ | ------------------- |
| Se concentre sur la question | Se concentre sur tout le contexte |
| Formulation de l'instruction | Orchestration des informations |
| Statique (le même prompt) | Dynamique (le contexte change selon la requête) |
| "Comment poser la question ?" | "Quelles informations donner au modèle ?" |

---

## Étapes Pratiques

### Étape 1 : Comparer zéro-shot et few-shot

```python
# fichier : zero_few_shot.py
# Compare les résultats zero-shot et few-shot pour une tâche de classification

from openai import OpenAI

# Initialiser le client (nécessite OPENAI_API_KEY dans l'environnement)
client = OpenAI()

# Tâche : classifier le sentiment d'un avis client
avis = "Le produit est arrivé en retard et l'emballage était abîmé, mais la qualité est correcte."

# --- Zero-shot ---
response_zero = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": f"Classifie le sentiment de cet avis en 'positif', 'négatif' ou 'mixte'.\n\nAvis : {avis}",
        }
    ],
    temperature=0,
)

print("=== Zero-shot ===")
print(f"Réponse : {response_zero.choices[0].message.content}")
print()

# --- Few-shot ---
response_few = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": """Classifie le sentiment de chaque avis en 'positif', 'négatif' ou 'mixte'.
Réponds uniquement avec le label, sans explication.

Avis : "Excellent produit, livraison rapide, je recommande !"
Sentiment : positif

Avis : "Produit défectueux, service client inexistant."
Sentiment : négatif

Avis : "Bon rapport qualité-prix mais la livraison a pris 3 semaines."
Sentiment : mixte

Avis : "Le produit est arrivé en retard et l'emballage était abîmé, mais la qualité est correcte."
Sentiment :""",
        }
    ],
    temperature=0,
)

print("=== Few-shot ===")
print(f"Réponse : {response_few.choices[0].message.content}")
```

**Résultat attendu** :

```text
=== Zero-shot ===
Réponse : Le sentiment de cet avis est 'mixte'. L'avis mentionne des aspects négatifs (retard de livraison, emballage abîmé) mais aussi un aspect positif (qualité correcte).

=== Few-shot ===
Réponse : mixte
```

Le few-shot produit une réponse au format exact attendu (juste le label), tandis que le zéro-shot ajoute une explication non demandée.

---

### Étape 2 : Implémenter le Chain-of-Thought

```python
# fichier : chain_of_thought.py
# Compare les réponses avec et sans Chain-of-Thought sur un problème de logique

from openai import OpenAI

client = OpenAI()

probleme = """Un magasin vend des pommes à 2 euros le kilo et des oranges à 3 euros le kilo.
Marie achète 3 kilos de pommes et 2 kilos d'oranges.
Elle paye avec un billet de 20 euros.
Combien lui rend-on ?"""

# --- Sans CoT ---
response_direct = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": probleme}
    ],
    temperature=0,
)

print("=== Sans Chain-of-Thought ===")
print(response_direct.choices[0].message.content)
print()

# --- Avec CoT ---
response_cot = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "Résous le problème étape par étape. Montre chaque étape de ton raisonnement avant de donner la réponse finale.",
        },
        {"role": "user", "content": probleme},
    ],
    temperature=0,
)

print("=== Avec Chain-of-Thought ===")
print(response_cot.choices[0].message.content)
```

**Résultat attendu** :

```text
=== Sans Chain-of-Thought ===
On lui rend 8 euros.

=== Avec Chain-of-Thought ===
Étape 1 : Calculer le prix des pommes
3 kilos × 2 euros/kilo = 6 euros

Étape 2 : Calculer le prix des oranges
2 kilos × 3 euros/kilo = 6 euros

Étape 3 : Calculer le total
6 euros + 6 euros = 12 euros

Étape 4 : Calculer le rendu
20 euros - 12 euros = 8 euros

On lui rend 8 euros.
```

---

### Étape 3 : Construire un system prompt robuste

```python
# fichier : system_prompt.py
# Démontre la construction d'un system prompt structuré

from openai import OpenAI

client = OpenAI()

# System prompt structuré pour un assistant d'analyse de code
system_prompt = """Tu es un assistant spécialisé dans la revue de code Python.

## Rôle
Tu analyses du code Python et fournis des suggestions d'amélioration.

## Instructions
1. Identifie les bugs potentiels
2. Suggère des améliorations de performance
3. Vérifie le respect des conventions PEP 8
4. Évalue la lisibilité du code

## Contraintes
- Ne réécris JAMAIS le code complet. Montre uniquement les lignes à modifier.
- Limite tes suggestions à 5 maximum, classées par priorité.
- Si le code est bon, dis-le explicitement.

## Format de sortie
Pour chaque suggestion :
- **Priorité** : Haute/Moyenne/Basse
- **Ligne** : numéro de ligne concerné
- **Problème** : description du problème
- **Correction** : la modification suggérée
"""

# Code à analyser
code_utilisateur = """
def get_users(db, age):
    users = []
    for row in db.execute("SELECT * FROM users WHERE age > " + str(age)):
        user = {}
        user['name'] = row[0]
        user['email'] = row[1]
        user['age'] = row[2]
        users.append(user)
    return users
"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": f"Analyse ce code Python :\n\n```python{code_utilisateur}```",
        },
    ],
    temperature=0,
)

print("=== Analyse de code avec system prompt structuré ===")
print(response.choices[0].message.content)
```

**Résultat attendu** :

```text
=== Analyse de code avec system prompt structuré ===
- **Priorité** : Haute
- **Ligne** : 3
- **Problème** : Injection SQL. La concaténation de chaînes dans la requête SQL est vulnérable.
- **Correction** : `db.execute("SELECT * FROM users WHERE age > ?", (age,))`

- **Priorité** : Moyenne
- **Ligne** : 4-7
- **Problème** : Création manuelle de dictionnaire au lieu d'utiliser un Row factory.
- **Correction** : Configurer `db.row_factory = sqlite3.Row` sur la connexion.

...
```

---

### Étape 4 : Implémenter le pattern ReAct

```python
# fichier : react_pattern.py
# Implémente une boucle ReAct simple avec des outils simulés

import json
import re
from openai import OpenAI

client = OpenAI()

# Définir des outils simulés
def search(query: str) -> str:
    """Simule une recherche web."""
    # En production, cela appellerait une API de recherche
    results = {
        "population france 2024": "La population de la France en 2024 est de 68,4 millions d'habitants.",
        "superficie france": "La superficie de la France métropolitaine est de 551 695 km².",
        "densité population": "La densité de population se calcule : population / superficie.",
    }
    for key, value in results.items():
        if key in query.lower():
            return value
    return f"Aucun résultat pour '{query}'"

def calculate(expression: str) -> str:
    """Évalue une expression mathématique de manière sécurisée."""
    import ast
    import operator

    # Opérateurs autorisés (pas d'exécution de code arbitraire)
    allowed_operators = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
    }

    def _eval_node(node):
        if isinstance(node, ast.Expression):
            return _eval_node(node.body)
        elif isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        elif isinstance(node, ast.BinOp) and type(node.op) in allowed_operators:
            left = _eval_node(node.left)
            right = _eval_node(node.right)
            return allowed_operators[type(node.op)](left, right)
        elif isinstance(node, ast.UnaryOp) and type(node.op) in allowed_operators:
            return allowed_operators[type(node.op)](_eval_node(node.operand))
        else:
            raise ValueError(f"Expression non autorisée : {ast.dump(node)}")

    try:
        tree = ast.parse(expression, mode="eval")
        result = _eval_node(tree)
        return str(result)
    except Exception as e:
        return f"Erreur de calcul : {e}"

# Mapping des outils disponibles
tools = {"search": search, "calculate": calculate}

# System prompt ReAct
react_system = """Tu es un assistant qui résout des problèmes en utilisant des outils.

Tu dois suivre ce format EXACT :

Thought: [ton raisonnement sur ce qu'il faut faire]
Action: [nom_outil]("[argument]")

Après avoir reçu une Observation, continue avec un nouveau Thought/Action ou donne ta réponse finale :

Thought: [raisonnement final]
Answer: [ta réponse]

Outils disponibles :
- search("requête") : recherche des informations
- calculate("expression") : calcule une expression mathématique
"""

question = "Quelle est la densité de population de la France ?"

# Boucle ReAct
messages = [
    {"role": "system", "content": react_system},
    {"role": "user", "content": question},
]

print(f"Question : {question}\n")

for step in range(5):  # Maximum 5 itérations
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0,
        stop=["Observation:"],  # Arrêter avant l'observation (on la fournit)
    )

    assistant_text = response.choices[0].message.content
    print(assistant_text)

    # Vérifier si c'est une réponse finale
    if "Answer:" in assistant_text:
        break

    # Extraire l'action
    action_match = re.search(r'Action:\s*(\w+)\("(.+?)"\)', assistant_text)
    if action_match:
        tool_name = action_match.group(1)
        tool_arg = action_match.group(2)

        # Exécuter l'outil
        if tool_name in tools:
            observation = tools[tool_name](tool_arg)
        else:
            observation = f"Outil '{tool_name}' non disponible"

        print(f"Observation: {observation}\n")

        # Ajouter au contexte
        messages.append({"role": "assistant", "content": assistant_text})
        messages.append({"role": "user", "content": f"Observation: {observation}"})
    else:
        break
```

**Résultat attendu** :

```text
Question : Quelle est la densité de population de la France ?

Thought: Je dois trouver la population et la superficie de la France pour calculer la densité.
Action: search("population France 2024")
Observation: La population de la France en 2024 est de 68,4 millions d'habitants.

Thought: J'ai la population. Maintenant je dois trouver la superficie.
Action: search("superficie France")
Observation: La superficie de la France métropolitaine est de 551 695 km².

Thought: J'ai les deux informations. Je peux calculer la densité.
Action: calculate("68400000 / 551695")
Observation: 123.97...

Thought: La densité de population de la France est d'environ 124 habitants par km².
Answer: La densité de population de la France métropolitaine est d'environ 124 habitants par km².
```

---

### Étape 5 : Gérer le contexte avec résumé progressif

```python
# fichier : context_management.py
# Montre comment gérer le contexte quand l'historique dépasse la fenêtre

import tiktoken
from openai import OpenAI

client = OpenAI()
enc = tiktoken.get_encoding("cl100k_base")

def count_tokens(messages: list) -> int:
    """Compte le nombre total de tokens dans une liste de messages."""
    total = 0
    for msg in messages:
        # Chaque message a un overhead de ~4 tokens (role, content markers)
        total += 4
        total += len(enc.encode(msg["content"]))
    return total

def summarize_old_messages(messages: list, max_to_summarize: int = 10) -> str:
    """Résume les anciens messages pour libérer des tokens."""
    # Extraire les messages à résumer (exclure le system prompt)
    to_summarize = messages[1 : max_to_summarize + 1]

    summary_prompt = "Résume cette conversation en 2-3 phrases :\n\n"
    for msg in to_summarize:
        role = "Utilisateur" if msg["role"] == "user" else "Assistant"
        summary_prompt += f"{role} : {msg['content']}\n"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": summary_prompt}],
        temperature=0,
        max_tokens=200,
    )

    return response.choices[0].message.content

def manage_context(messages: list, max_tokens: int = 4000) -> list:
    """Gère le contexte pour rester dans la limite de tokens."""
    current_tokens = count_tokens(messages)
    print(f"Tokens actuels : {current_tokens} / {max_tokens}")

    if current_tokens <= max_tokens:
        return messages

    # Stratégie : résumer les anciens messages
    print("Contexte trop long, résumé en cours...")
    system_msg = messages[0]  # Garder le system prompt
    recent_msgs = messages[-4:]  # Garder les 4 derniers messages

    # Résumer les messages intermédiaires
    summary = summarize_old_messages(messages)
    summary_msg = {
        "role": "system",
        "content": f"Résumé de la conversation précédente : {summary}",
    }

    # Reconstruire le contexte
    new_messages = [system_msg, summary_msg] + recent_msgs
    new_tokens = count_tokens(new_messages)
    print(f"Tokens après résumé : {new_tokens} / {max_tokens}")

    return new_messages

# Démonstration
messages = [
    {"role": "system", "content": "Tu es un assistant Python."},
    {"role": "user", "content": "Comment créer une liste en Python ?"},
    {"role": "assistant", "content": "En Python, tu peux créer une liste avec des crochets : ma_liste = [1, 2, 3]"},
    {"role": "user", "content": "Comment ajouter un élément ?"},
    {"role": "assistant", "content": "Utilise la méthode append() : ma_liste.append(4)"},
    {"role": "user", "content": "Et pour trier la liste ?"},
]

print("=== Gestion du contexte ===")
managed = manage_context(messages, max_tokens=4000)
for msg in managed:
    print(f"[{msg['role']}] {msg['content'][:80]}...")
```

**Résultat attendu** :

```text
=== Gestion du contexte ===
Tokens actuels : 95 / 4000
[system] Tu es un assistant Python....
[user] Comment créer une liste en Python ?...
[assistant] En Python, tu peux créer une liste avec des crochets : ma_liste = [1, 2,...
[user] Comment ajouter un élément ?...
[assistant] Utilise la méthode append() : ma_liste.append(4)...
[user] Et pour trier la liste ?...
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install openai` | Installe le client OpenAI Python |
| `pip install tiktoken` | Installe le compteur de tokens |
| `export OPENAI_API_KEY="sk-..."` | Configure la clé API dans l'environnement |
| `client.chat.completions.create(...)` | Envoie une requête de complétion chat |
| `enc.encode("texte")` | Encode du texte en tokens pour compter |
| `response.choices[0].message.content` | Accède au texte de la réponse |

---

## Pièges Fréquents

### Piège 1 : Trop d'instructions dans le system prompt

⚠️ **Problème** : Un system prompt de 2000 mots avec des dizaines d'instructions contradictoires. Le modèle ne sait pas quelle instruction prioriser et les résultats sont incohérents.

✅ **Solution** : Limite le system prompt à 500 mots maximum. Organise les instructions par priorité. Teste le prompt avec des cas limites pour vérifier que les instructions ne se contredisent pas.

---

### Piège 2 : Ne pas compter les tokens

⚠️ **Problème** : Envoyer un contexte qui dépasse la fenêtre du modèle. Les tokens en excès sont silencieusement tronqués, ce qui coupe des informations critiques (souvent le début du contexte).

✅ **Solution** : Utilise `tiktoken` pour compter les tokens avant d'envoyer la requête. Réserve toujours 1000-2000 tokens pour la réponse du modèle. Implémente une stratégie de gestion du contexte (troncation, résumé, RAG).

---

### Piège 3 : Few-shot avec des exemples biaisés

⚠️ **Problème** : Donner des exemples few-shot qui ne sont pas représentatifs de la variété des cas réels. Le modèle sur-ajuste aux patterns des exemples.

✅ **Solution** : Choisis des exemples diversifiés qui couvrent les cas limites. Si tu classifies en 3 catégories, donne au moins un exemple par catégorie. Vérifie que les exemples ne partagent pas des patterns accidentels.

---

### Piège 4 : Oublier le "lost in the middle"

⚠️ **Problème** : Placer les informations critiques au milieu d'un long contexte. Les LLM traitent mieux les informations au début et à la fin du contexte.

✅ **Solution** : Place les informations les plus importantes au début du contexte (juste après le system prompt) et à la fin (juste avant la question). Le milieu est réservé aux informations complémentaires.

---

## Checklist de Validation

- [ ] Je sais construire un prompt zéro-shot et few-shot
- [ ] Je comprends quand utiliser le Chain-of-Thought et comment le déclencher
- [ ] Je peux expliquer le cycle Thought/Action/Observation de ReAct
- [ ] Je sais structurer un system prompt avec rôle, instructions, contraintes et format
- [ ] Je connais les limites de context window des principaux modèles
- [ ] Je comprends la différence entre prompt engineering et context engineering
- [ ] J'ai implémenté une stratégie de gestion du contexte (comptage de tokens, résumé)
- [ ] J'ai exécuté les scripts Python et analysé les résultats

---

## Exercice Pratique

**Énoncé** : Construis un système complet de prompts pour extraire des informations structurées à partir de descriptions de produits. Le système doit extraire : le nom du produit, le prix, la catégorie, et les caractéristiques principales, puis retourner le résultat en JSON.

**Indications** :

- Écris un system prompt structuré avec rôle, contraintes et format de sortie
- Utilise le few-shot prompting avec 3 exemples diversifiés (électronique, vêtement, alimentaire)
- Teste avec 3 descriptions que le modèle n'a jamais vues
- Valide que le JSON retourné est parsable avec `json.loads()`
- Gère les cas limites : description vague, informations manquantes (prix non mentionné)

**Résultat attendu** : Un script Python qui prend une description de produit en entrée et retourne un JSON structuré et validé.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# fichier : exercice_extraction.py
# Système d'extraction d'informations structurées avec few-shot prompting

import json
from openai import OpenAI

client = OpenAI()

# System prompt structuré
system_prompt = """Tu es un assistant spécialisé dans l'extraction d'informations produit.

## Rôle
Tu extrais des informations structurées à partir de descriptions de produits en langage naturel.

## Instructions
1. Extrais le nom du produit, le prix, la catégorie et les caractéristiques principales
2. Retourne le résultat en JSON valide

## Contraintes
- Retourne UNIQUEMENT le JSON, sans texte avant ou après
- Si une information est absente, utilise null
- Le prix doit être un nombre (sans symbole monétaire)
- Les caractéristiques sont une liste de chaînes

## Format de sortie
{
  "nom": "string",
  "prix": number ou null,
  "devise": "EUR" ou "USD" ou null,
  "categorie": "string",
  "caracteristiques": ["string", ...]
}"""

# Exemples few-shot
few_shot_examples = [
    {
        "role": "user",
        "content": "Casque audio Sony WH-1000XM5, réduction de bruit active, Bluetooth 5.2, autonomie 30h. Prix : 349,99 euros.",
    },
    {
        "role": "assistant",
        "content": '{"nom": "Sony WH-1000XM5", "prix": 349.99, "devise": "EUR", "categorie": "Électronique - Audio", "caracteristiques": ["Réduction de bruit active", "Bluetooth 5.2", "Autonomie 30 heures"]}',
    },
    {
        "role": "user",
        "content": "Veste imperméable The North Face, tissu Gore-Tex, capuche ajustable, poches zippées. Taille M. 279 USD.",
    },
    {
        "role": "assistant",
        "content": '{"nom": "Veste imperméable The North Face", "prix": 279, "devise": "USD", "categorie": "Vêtements - Outdoor", "caracteristiques": ["Tissu Gore-Tex", "Capuche ajustable"]}',
    },
    {
        "role": "user",
        "content": "Lot de 6 yaourts bio à la vanille, fabrication artisanale, sans conservateurs.",
    },
    {
        "role": "assistant",
        "content": '{"nom": "Yaourts bio vanille", "prix": null, "devise": null, "categorie": "Alimentaire - Produits laitiers", "caracteristiques": ["Lot de 6", "Bio", "Vanille", "Artisanal"]}',
    },
]

def extract_product_info(description: str) -> dict:
    """Extrait les informations structurées d'une description de produit."""
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(few_shot_examples)
    messages.append({"role": "user", "content": description})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0,
    )

    raw_response = response.choices[0].message.content

    # Valider que le JSON est parsable
    try:
        result = json.loads(raw_response)
        return result
    except json.JSONDecodeError as e:
        print(f"Erreur de parsing JSON : {e}")
        print(f"Réponse brute : {raw_response}")
        return None

# Tester avec des descriptions inédites
descriptions_test = [
    "MacBook Pro 14 pouces, puce M3 Pro, 18 Go RAM, 512 Go SSD, écran Liquid Retina XDR. 2 399 euros.",
    "Chaussures de running Adidas Ultraboost, semelle Boost, tige Primeknit, drop 10mm.",
    "Description vague : un truc rouge qui fait du bruit.",
]

for desc in descriptions_test:
    print(f"Description : {desc}")
    result = extract_product_info(desc)
    if result:
        print(f"Résultat : {json.dumps(result, ensure_ascii=False, indent=2)}")
    print()
```

Pour exécuter :

```bash
# Configurer la clé API (remplace par ta clé)
export OPENAI_API_KEY="sk-..."

# Exécuter le script
python exercice_extraction.py
```

---

## Navigation

← Fiche précédente : **[01 - Architecture et fonctionnement des LLM](01-architecture-fonctionnement-llm.md)**

→ Fiche suivante : **[03 - RAG - Retrieval-Augmented Generation](03-rag-retrieval-augmented-generation.md)**
