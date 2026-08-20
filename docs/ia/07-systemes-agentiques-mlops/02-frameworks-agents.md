---
tags:
  - IA
  - Avancé
  - Pratique
description: "Frameworks d'agents IA : LangChain, LangGraph, CrewAI, PydanticAI et MCP (Model Context Protocol)"
estimated_time: "35 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 7 - Systèmes agentiques et MLOps"
---

# 02 - Frameworks d'agents

> **En bref** : À la fin de cette fiche, tu sauras comparer les frameworks d'agents (LangChain, LangGraph, CrewAI, PydanticAI), comprendre le standard MCP (Model Context Protocol) et construire un workflow multi-agent avec LangGraph. Lecture estimée : 35 min.


## Prérequis

- Fiche **[01 - AI Agents : architecture et design patterns](01-ai-agents-architecture-design-patterns.md)** (concepts d'agent, ReAct, tool use)
- Python et utilisation d'API LLM
- Compréhension des graphes orientés (nœuds, arêtes) est un plus

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comparer les frameworks d'agents (LangChain, LangGraph, CrewAI, PydanticAI), comprendre le standard MCP (Model Context Protocol) et construire un workflow multi-agent avec LangGraph.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que LangChain ?

**Définition** : LangChain est un framework Python qui fournit des abstractions pour construire des applications basées sur les LLM. Il propose des composants réutilisables : chains (enchaînement d'opérations), prompts templates, output parsers, tools et memory.

**Le problème que LangChain résout** :

Sans LangChain, voici les problèmes rencontrés :

1. **Code boilerplate** : chaque application LLM nécessite de réécrire le même code de gestion des prompts, des appels API et du parsing des réponses
2. **Intégration manuelle** : connecter un LLM à une base de données, un vector store ou un outil externe demande du code custom à chaque fois
3. **Pas de standard** : chaque développeur invente ses propres abstractions, rendant le code difficile à maintenir

**Comment LangChain résout ces problèmes** :

| Problème | Solution apportée par LangChain |
| -------- | ------------------------------- |
| Code boilerplate | Composants préfabriqués (PromptTemplate, ChatModel, OutputParser) |
| Intégration manuelle | Connecteurs intégrés pour 700+ services (vector stores, APIs, bases de données) |
| Pas de standard | Abstractions uniformes (Runnable interface) qui standardisent les composants |

**Les composants clés de LangChain** :

| Composant | Rôle | Exemple |
| --------- | ---- | ------- |
| ChatModel | Interface unifiée vers les LLM | `ChatOpenAI`, `ChatAnthropic` |
| PromptTemplate | Template de prompt réutilisable | `"Traduis {text} en {language}"` |
| OutputParser | Parse la sortie du LLM en structure | `JsonOutputParser`, `PydanticOutputParser` |
| Tool | Encapsule une fonction comme outil LLM | `@tool` decorator |
| Retriever | Récupère des documents depuis un store | `VectorStoreRetriever` |
| Chain (LCEL) | Compose des composants avec l'opérateur pipe | `prompt \| llm \| parser` |

**Analogie concrète** : LangChain est une boîte de LEGO pour applications LLM. Chaque brique (composant) s'emboîte avec les autres selon une interface standard. Tu peux construire rapidement en assemblant des briques existantes au lieu de tout fabriquer à la main.

**Ce que LangChain n'est PAS** :

- LangChain n'est pas un LLM. C'est un framework qui orchestre des LLM. Le LLM (GPT-4, Claude) est un composant utilisé par LangChain.
- LangChain n'est pas indispensable. Pour des cas simples, appeler directement l'API du LLM est suffisant. LangChain est utile quand l'application devient complexe.

---

### Qu'est-ce que LangGraph ?

**Définition** : LangGraph est une extension de LangChain qui modélise les workflows d'agents sous forme de graphes d'états. Chaque nœud du graphe est une étape (appel LLM, exécution d'outil, décision), et les arêtes définissent les transitions entre les étapes, avec des conditions possibles.

**Le problème que LangGraph résout** :

Sans LangGraph, voici les problèmes rencontrés :

1. **Workflows linéaires uniquement** : les chains LangChain classiques sont séquentielles (A -> B -> C). Les workflows avec boucles, branches ou parallélisme nécessitent du code custom complexe
2. **Pas de gestion d'état** : dans une boucle agent, l'état (messages, résultats intermédiaires) doit être géré manuellement
3. **Pas de persistance** : impossible de sauvegarder l'état d'un workflow en cours pour le reprendre plus tard

**Comment LangGraph résout ces problèmes** :

| Problème | Solution apportée par LangGraph |
| -------- | ------------------------------- |
| Workflows linéaires uniquement | Le graphe permet des boucles, branches conditionnelles et parallélisme |
| Pas de gestion d'état | Le `State` est un objet typé partagé entre tous les nœuds |
| Pas de persistance | Le checkpointer sauvegarde l'état à chaque étape pour reprise |

**Les composants clés de LangGraph** :

| Composant | Rôle | Exemple |
| --------- | ---- | ------- |
| State | Objet typé partagé entre les nœuds | `{"messages": [], "plan": []}` |
| Node | Fonction qui lit et modifie le State | Nœud `agent`, nœud `tools` |
| Edge | Transition entre deux nœuds | `agent -> tools` |
| Conditional Edge | Transition conditionnelle | "Si tool_calls alors tools, sinon END" |
| Checkpointer | Persistance de l'état | `MemorySaver`, `SqliteSaver` |

**Analogie concrète** : LangGraph est un plan de métro pour ton agent. Chaque station (nœud) est une étape du workflow. Les lignes (arêtes) relient les stations. Les aiguillages (conditional edges) orientent le trajet selon les conditions. Le ticket (state) accompagne le voyageur tout au long du parcours.

**Comparaison LangChain Chains vs LangGraph** :

| LangChain Chains (LCEL) | LangGraph |
| ------------------------ | --------- |
| Séquentiel (pipeline) | Graphe avec boucles et branches |
| Pas de gestion d'état native | State typé partagé |
| Pas de persistance | Checkpointing intégré |
| Simple et rapide | Plus puissant, plus verbeux |

---

### Qu'est-ce que CrewAI ?

**Définition** : CrewAI est un framework Python spécialisé dans l'orchestration multi-agent. Il modélise les agents comme des membres d'une équipe (crew), chacun avec un rôle, un objectif et des outils. Les agents collaborent pour accomplir des tâches (tasks) définies par le développeur.

**Le problème que CrewAI résout** :

Sans CrewAI, voici les problèmes rencontrés :

1. **Orchestration manuelle** : coordonner plusieurs agents (qui parle quand, qui fait quoi) nécessite du code complexe
2. **Pas de rôles** : définir les spécialisations des agents et leur mode de collaboration est laissé au développeur
3. **Délégation difficile** : un agent qui a besoin de l'aide d'un autre ne sait pas comment la demander

**Comment CrewAI résout ces problèmes** :

| Problème | Solution apportée par CrewAI |
| -------- | ---------------------------- |
| Orchestration manuelle | Le `Crew` gère automatiquement l'ordre d'exécution et la communication |
| Pas de rôles | Chaque `Agent` a un `role`, un `goal` et un `backstory` |
| Délégation difficile | Un agent peut déléguer une sous-tâche à un autre agent via `allow_delegation=True` |

**Les composants clés de CrewAI** :

| Composant | Rôle | Exemple |
| --------- | ---- | ------- |
| Agent | Membre spécialisé de l'équipe | Agent "Chercheur", Agent "Rédacteur" |
| Task | Tâche assignée à un agent | "Rechercher les tendances IA 2026" |
| Crew | Équipe qui orchestre agents et tâches | Crew séquentiel ou hiérarchique |
| Tool | Outil assigné à un agent | `SerperDevTool`, `FileReadTool` |

**Analogie concrète** : CrewAI est comme un studio de cinéma. Le réalisateur (Crew) coordonne l'équipe. Le scénariste (Agent) écrit l'histoire. Le caméraman (Agent) filme. Le monteur (Agent) assemble. Chacun a son rôle, ses outils et ses livrables. Le réalisateur s'assure que tout se déroule dans l'ordre.

**Comparaison LangGraph vs CrewAI** :

| LangGraph | CrewAI |
| --------- | ------ |
| Graphe d'états bas niveau | Abstraction haut niveau (rôles, tâches) |
| Contrôle total sur le flux | Orchestration automatique |
| Courbe d'apprentissage moyenne | Prise en main rapide |
| Flexible (mono ou multi-agent) | Spécialisé multi-agent |

---

### Qu'est-ce que PydanticAI ?

**Définition** : PydanticAI est un framework d'agents développé par l'équipe Pydantic. Il met l'accent sur le typage strict (type-safe), les sorties structurées (structured outputs) validées par des modèles Pydantic et l'injection de dépendances pour les outils.

**Le problème que PydanticAI résout** :

Sans PydanticAI, voici les problèmes rencontrés :

1. **Sorties non typées** : les réponses du LLM sont des chaînes de caractères sans garantie de structure
2. **Validation manuelle** : vérifier que la réponse du LLM contient les bons champs et les bons types nécessite du code custom
3. **Dépendances non gérées** : injecter des services (base de données, API) dans les outils d'un agent est laissé au développeur

**Comment PydanticAI résout ces problèmes** :

| Problème | Solution apportée par PydanticAI |
| -------- | -------------------------------- |
| Sorties non typées | Le `output_type` est un modèle Pydantic que le LLM doit respecter |
| Validation manuelle | Pydantic valide automatiquement la structure et les types |
| Dépendances non gérées | Le `deps_type` injecte les dépendances dans les outils via le contexte |

**Exemple de sortie structurée** :

```python
from pydantic import BaseModel
from pydantic_ai import Agent


# Modèle Pydantic qui définit la structure attendue de la réponse
class CityInfo(BaseModel):
    name: str
    country: str
    population: int
    description: str


# L'agent est typé : il DOIT renvoyer un objet CityInfo valide
agent = Agent(
    "openai:gpt-4o",
    output_type=CityInfo,
    system_prompt="Tu es un expert en géographie."
)

# Le résultat est un objet CityInfo, pas une chaîne de caractères
result = agent.run_sync("Parle-moi de Lyon.")
print(result.output.name)        # "Lyon"
print(result.output.population)  # 522250
```

**Analogie concrète** : PydanticAI est comme un formulaire administratif strict. Au lieu de laisser le LLM répondre librement (lettre ouverte), tu lui donnes un formulaire (modèle Pydantic) avec des champs obligatoires et des types précis. S'il remplit mal le formulaire, Pydantic le rejette et demande une correction.

---

### Qu'est-ce que MCP (Model Context Protocol) ?

**Définition** : MCP (Model Context Protocol) est un standard ouvert (créé par Anthropic) qui définit comment un LLM accède à des sources de contexte externes (fichiers, bases de données, API) via des serveurs standardisés. Un serveur MCP expose des outils, des ressources et des prompts que tout client MCP compatible peut utiliser.

**Le problème que MCP résout** :

Sans MCP, voici les problèmes rencontrés :

1. **Intégrations N x M** : chaque application LLM (N clients) doit écrire un connecteur spécifique pour chaque service (M serveurs), ce qui crée N*M intégrations à maintenir
2. **Pas de standard** : chaque framework (LangChain, CrewAI) invente ses propres abstractions pour les outils, rendant les outils non portables
3. **Contexte fragmenté** : les sources de données (fichiers, BDD, API) sont connectées de manière ad hoc sans protocole commun

**Comment MCP résout ces problèmes** :

| Problème | Solution apportée par MCP |
| -------- | ------------------------- |
| Intégrations N x M | Un protocole standard réduit à N + M intégrations (chaque client parle MCP, chaque serveur expose MCP) |
| Pas de standard | Les outils MCP sont portables : un serveur MCP fonctionne avec tout client compatible |
| Contexte fragmenté | Le protocole unifie l'accès aux outils, ressources et prompts |

**Architecture MCP** :

```text
┌─────────────┐     MCP Protocol     ┌──────────────────┐
│  Client MCP │◄────────────────────►│  Serveur MCP     │
│  (Claude,   │     (JSON-RPC)       │  (fichiers, BDD, │
│   VS Code,  │                      │   API, GitHub...) │
│   LangChain)│                      │                    │
└─────────────┘                      └──────────────────┘
```

**Les trois primitives MCP** :

| Primitive | Direction | Description | Exemple |
| --------- | --------- | ----------- | ------- |
| Tools | Serveur -> Client | Fonctions invocables par le LLM | `search_files`, `run_query` |
| Resources | Serveur -> Client | Données accessibles en lecture | Fichiers, tables de BDD, documents |
| Prompts | Serveur -> Client | Templates de prompts réutilisables | "Résume ce document", "Analyse ce code" |

**Analogie concrète** : MCP est comme la prise USB-C. Avant USB-C, chaque appareil avait son propre câble (micro-USB, Lightning, mini-USB). Avec USB-C, un seul standard connecte tous les appareils à tous les accessoires. MCP est l'USB-C des intégrations LLM : un seul protocole pour connecter tout client à tout serveur.

**Ce que MCP n'est PAS** :

- MCP n'est pas un framework d'agents. C'est un protocole de communication. LangChain, CrewAI et PydanticAI sont des frameworks. MCP est la couche de transport qui les connecte aux sources de données.
- MCP n'est pas une API REST. MCP utilise JSON-RPC sur des transports variés : stdio (local) et Streamable HTTP (distant). Le transport HTTP+SSE de la spec 2024-11-05 est déprécié (rétrocompatibilité seulement).

---

## Étapes Pratiques

### Étape 1 : Installer les dépendances

```bash
# Installer LangChain et LangGraph
pip install langchain langchain-openai langgraph

# Installer CrewAI (optionnel, pour comparaison)
pip install crewai crewai-tools

# Installer PydanticAI (optionnel, pour comparaison)
pip install pydantic-ai
```

---

### Étape 2 : Construire un agent simple avec LangGraph

Crée un fichier `langgraph_agent.py` qui implémente un agent avec boucle ReAct.

```python
# langgraph_agent.py
# Agent ReAct avec LangGraph : graphe d'états avec boucle outil

from typing import Annotated
from typing_extensions import TypedDict

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode


# --- Étape 2a : Définir le State ---
# Le State est l'objet partagé entre tous les noeuds du graphe
class AgentState(TypedDict):
    # add_messages est un reducer : il ajoute les nouveaux messages
    # au lieu de remplacer la liste entière
    messages: Annotated[list, add_messages]


# --- Étape 2b : Définir les outils ---
@tool
def calculator(expression: str) -> str:
    """Évalue une expression mathématique Python.
    Exemples : '2 + 3', '15 * 23', '2**10'."""
    import math
    try:
        # Démo uniquement : eval() reste risqué même avec builtins vides.
        # En production, utilise un parseur math dédié (pas eval sur entrée modèle).
        result = eval(expression, {"__builtins__": {}}, {"math": math})
        return f"Résultat : {result}"
    except Exception as e:
        return f"Erreur : {e}"


@tool
def get_weather(city: str) -> str:
    """Récupère la météo actuelle pour une ville (données simulées)."""
    # En production, ceci appellerait une vraie API météo
    weather_data = {
        "paris": "Paris : 18°C, ensoleillé",
        "lyon": "Lyon : 15°C, nuageux",
        "marseille": "Marseille : 22°C, ensoleillé",
    }
    return weather_data.get(city.lower(), f"Météo non disponible pour {city}")


# Liste des outils disponibles pour l'agent
tools = [calculator, get_weather]

# --- Étape 2c : Configurer le LLM avec les outils ---
llm = ChatOpenAI(model="gpt-4o")
# bind_tools indique au LLM quels outils il peut appeler
llm_with_tools = llm.bind_tools(tools)


# --- Étape 2d : Définir les noeuds du graphe ---
def agent_node(state: AgentState) -> dict:
    """Noeud agent : appelle le LLM avec l'historique des messages."""
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}


# ToolNode exécute automatiquement les outils appelés par le LLM
tool_node = ToolNode(tools)


# --- Étape 2e : Définir la condition de routage ---
def should_continue(state: AgentState) -> str:
    """Détermine si l'agent doit appeler un outil ou s'arrêter."""
    last_message = state["messages"][-1]
    # Si le dernier message contient des appels d'outils, continuer
    if last_message.tool_calls:
        return "tools"
    # Sinon, l'agent a donné sa réponse finale
    return END


# --- Étape 2f : Construire le graphe ---
# Création du graphe avec le type de State
graph = StateGraph(AgentState)

# Ajouter les noeuds
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)

# Définir le point d'entrée
graph.add_edge(START, "agent")

# Ajouter l'arête conditionnelle depuis le noeud agent
graph.add_conditional_edges("agent", should_continue, ["tools", END])

# Après l'exécution des outils, revenir au noeud agent
graph.add_edge("tools", "agent")

# Compiler le graphe en application exécutable
app = graph.compile()


# --- Étape 2g : Exécuter l'agent ---
if __name__ == "__main__":
    # Envoyer un message à l'agent
    result = app.invoke({
        "messages": [HumanMessage(content="Calcule 42 * 17 puis donne-moi la météo à Paris.")]
    })

    # Afficher la réponse finale
    final_message = result["messages"][-1]
    print(f"Réponse : {final_message.content}")
```

**Résultat attendu** :

```text
Réponse : Le résultat de 42 * 17 est 714. La météo à Paris est 18°C, ensoleillé.
```

---

### Étape 3 : Construire un workflow multi-agent avec LangGraph

Crée un fichier `multi_agent.py` avec trois agents spécialisés.

```python
# multi_agent.py
# Workflow multi-agent : Chercheur -> Analyste -> Rédacteur

from typing import Annotated, Literal
from typing_extensions import TypedDict

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages


# --- State partagé entre les agents ---
class MultiAgentState(TypedDict):
    messages: Annotated[list, add_messages]
    research_data: str       # Données collectées par le chercheur
    analysis: str            # Analyse produite par l'analyste
    final_report: str        # Rapport final rédigé par le rédacteur
    current_step: str        # Étape actuelle du workflow


llm = ChatOpenAI(model="gpt-4o")


# --- Noeud Chercheur ---
def researcher_node(state: MultiAgentState) -> dict:
    """Agent chercheur : collecte des informations sur le sujet."""
    system = SystemMessage(content=(
        "Tu es un chercheur expert. Ta mission : collecter des informations "
        "factuelles et des données clés sur le sujet demandé. "
        "Fournis des faits, des chiffres et des sources."
    ))
    # Le dernier message utilisateur contient le sujet
    user_msg = state["messages"][-1]
    response = llm.invoke([system, user_msg])
    return {
        "research_data": response.content,
        "current_step": "research_done"
    }


# --- Noeud Analyste ---
def analyst_node(state: MultiAgentState) -> dict:
    """Agent analyste : analyse les données collectées par le chercheur."""
    system = SystemMessage(content=(
        "Tu es un analyste expert. Ta mission : analyser les données de recherche "
        "ci-dessous et en tirer des conclusions structurées. "
        "Identifie les tendances, les risques et les opportunités."
    ))
    user_msg = HumanMessage(
        content=f"Voici les données de recherche à analyser :\n\n{state['research_data']}"
    )
    response = llm.invoke([system, user_msg])
    return {
        "analysis": response.content,
        "current_step": "analysis_done"
    }


# --- Noeud Rédacteur ---
def writer_node(state: MultiAgentState) -> dict:
    """Agent rédacteur : produit un rapport final à partir de l'analyse."""
    system = SystemMessage(content=(
        "Tu es un rédacteur expert. Ta mission : rédiger un rapport final clair "
        "et structuré à partir des données de recherche et de l'analyse. "
        "Le rapport doit avoir une introduction, des sections et une conclusion."
    ))
    user_msg = HumanMessage(content=(
        f"Données de recherche :\n{state['research_data']}\n\n"
        f"Analyse :\n{state['analysis']}\n\n"
        "Rédige le rapport final."
    ))
    response = llm.invoke([system, user_msg])
    return {
        "final_report": response.content,
        "current_step": "report_done"
    }


# --- Construction du graphe ---
graph = StateGraph(MultiAgentState)

# Ajouter les noeuds (un par agent)
graph.add_node("researcher", researcher_node)
graph.add_node("analyst", analyst_node)
graph.add_node("writer", writer_node)

# Définir le flux : START -> Chercheur -> Analyste -> Rédacteur -> END
graph.add_edge(START, "researcher")
graph.add_edge("researcher", "analyst")
graph.add_edge("analyst", "writer")
graph.add_edge("writer", END)

# Compiler
app = graph.compile()


if __name__ == "__main__":
    result = app.invoke({
        "messages": [HumanMessage(content="L'impact de l'IA sur l'emploi en 2026")],
        "research_data": "",
        "analysis": "",
        "final_report": "",
        "current_step": "start"
    })

    print("=== RAPPORT FINAL ===")
    print(result["final_report"])
```

**Résultat attendu** :

```text
=== RAPPORT FINAL ===
# L'impact de l'IA sur l'emploi en 2026

## Introduction
L'intelligence artificielle transforme profondément le marché du travail...

## Tendances clés
1. Automatisation des tâches répétitives...
2. Création de nouveaux métiers...

## Conclusion
...
```

---

### Étape 4 : Exemple CrewAI (comparaison)

```python
# crewai_example.py
# Même workflow multi-agent, mais avec CrewAI

from crewai import Agent, Task, Crew, Process

# --- Définir les agents ---
researcher = Agent(
    role="Chercheur",
    goal="Collecter des données factuelles sur le sujet demandé",
    backstory="Tu es un chercheur universitaire avec 15 ans d'expérience.",
    verbose=True
)

analyst = Agent(
    role="Analyste",
    goal="Analyser les données et identifier tendances et risques",
    backstory="Tu es un analyste stratégique dans un cabinet de conseil.",
    verbose=True
)

writer = Agent(
    role="Rédacteur",
    goal="Rédiger un rapport clair et structuré",
    backstory="Tu es un rédacteur technique spécialisé en rapports exécutifs.",
    verbose=True
)

# --- Définir les tâches ---
research_task = Task(
    description="Recherche les données sur l'impact de l'IA sur l'emploi en 2026.",
    expected_output="Un document avec des faits, chiffres et sources.",
    agent=researcher
)

analysis_task = Task(
    description="Analyse les données de recherche et identifie les tendances clés.",
    expected_output="Une analyse structurée avec tendances, risques et opportunités.",
    agent=analyst
)

writing_task = Task(
    description="Rédige un rapport final à partir de la recherche et de l'analyse.",
    expected_output="Un rapport structuré avec introduction, sections et conclusion.",
    agent=writer
)

# --- Créer le Crew et exécuter ---
crew = Crew(
    agents=[researcher, analyst, writer],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential,  # Exécution séquentielle
    verbose=True
)

if __name__ == "__main__":
    result = crew.kickoff()
    print(result)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install langchain langchain-openai langgraph` | Installe LangChain et LangGraph |
| `pip install crewai crewai-tools` | Installe CrewAI |
| `pip install pydantic-ai` | Installe PydanticAI |
| `pip install mcp` | Installe le SDK MCP Python |
| `python -c "from langgraph.graph import StateGraph; print('OK')"` | Vérifie l'installation LangGraph |
| `pip list \| grep lang` | Liste les packages LangChain installés |

---

## Pièges Fréquents

### Piège 1 : Confondre LangChain et LangGraph

**Problème** : Utiliser des chains LangChain (LCEL) quand le workflow nécessite des boucles ou des branches.

**Solution** : LangChain chains (LCEL) est pour les pipelines linéaires simples (prompt -> LLM -> parser). LangGraph est pour les workflows avec boucles (agent ReAct), branches conditionnelles ou état partagé. Règle : si tu as besoin d'une boucle, utilise LangGraph.

---

### Piège 2 : Surcharger les agents multi-agent

**Problème** : Créer trop d'agents spécialisés pour une tâche simple, ce qui augmente la latence et le coût.

**Solution** : Commence avec un seul agent. Ajoute des agents supplémentaires uniquement si la qualité est insuffisante ou si la tâche nécessite des compétences contradictoires.

---

### Piège 3 : Ne pas typer le State LangGraph

**Problème** : Utiliser un dictionnaire non typé comme State, ce qui mène à des erreurs silencieuses (clés mal nommées, types incorrects).

**Solution** : Toujours utiliser un `TypedDict` pour définir le State. Cela permet à l'IDE de détecter les erreurs et rend le code plus lisible.

```python
# Correct : State typé
class MyState(TypedDict):
    messages: Annotated[list, add_messages]
    count: int
```

---

### Piège 4 : Ignorer les coûts multi-agent

**Problème** : Un workflow à 3 agents fait 3 appels LLM par itération. Si chaque agent boucle, les coûts explosent.

**Solution** : Monitorer les tokens consommés par chaque agent. Utiliser des modèles plus petits pour les agents simples (recherche, validation) et réserver les modèles puissants pour les agents complexes (analyse, rédaction).

---

## Checklist de Validation

- [ ] Je sais expliquer les différences entre LangChain, LangGraph, CrewAI et PydanticAI
- [ ] Je comprends les composants de LangGraph (State, Node, Edge, Conditional Edge)
- [ ] Je sais construire un graphe d'agent avec LangGraph
- [ ] Je comprends le standard MCP et ses trois primitives (Tools, Resources, Prompts)
- [ ] Je sais quand utiliser un mono-agent vs un multi-agent
- [ ] J'ai exécuté un workflow multi-agent avec LangGraph ou CrewAI

---

## Exercice Pratique

**Énoncé** : Construis un workflow multi-agent avec LangGraph comprenant trois agents :

1. **Agent Chercheur** : reçoit un sujet et collecte des informations (simulées ou via outil)
2. **Agent Analyste** : reçoit les données du chercheur et produit une analyse structurée
3. **Agent Rédacteur** : produit un rapport final à partir de la recherche et de l'analyse

Le workflow doit passer par les trois agents séquentiellement et retourner le rapport final.

**Indications** :

- Utilise un `TypedDict` pour le State avec les champs : `messages`, `research_data`, `analysis`, `final_report`
- Chaque agent a un system prompt spécialisé
- Le graphe a trois nœuds reliés séquentiellement
- Teste avec le sujet : "Les tendances de l'IA générative en 2026"

**Résultat attendu** : Un script Python qui produit un rapport structuré en passant par les trois étapes (recherche -> analyse -> rédaction).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

La solution complète est le fichier `multi_agent.py` de l'étape 3 ci-dessus. Pour l'adapter à l'exercice, modifie uniquement le message d'entrée :

```python
# Modifier le sujet dans le __main__
if __name__ == "__main__":
    result = app.invoke({
        "messages": [HumanMessage(
            content="Les tendances de l'IA générative en 2026"
        )],
        "research_data": "",
        "analysis": "",
        "final_report": "",
        "current_step": "start"
    })

    print("=== RAPPORT FINAL ===")
    print(result["final_report"])

    # Pour voir les résultats intermédiaires
    print("\n=== DONNÉES DE RECHERCHE ===")
    print(result["research_data"][:500])  # 500 premiers caractères

    print("\n=== ANALYSE ===")
    print(result["analysis"][:500])
```

Pour aller plus loin, ajoute un nœud de validation qui vérifie la qualité du rapport :

```python
def validator_node(state: MultiAgentState) -> dict:
    """Noeud de validation : vérifie que le rapport contient les sections requises."""
    report = state["final_report"]
    required_sections = ["Introduction", "Conclusion"]
    missing = [s for s in required_sections if s.lower() not in report.lower()]

    if missing:
        # Renvoyer au rédacteur pour correction
        return {"current_step": "needs_revision"}
    return {"current_step": "validated"}
```

---

## Navigation

← Fiche précédente : **[01 - AI Agents : architecture et design patterns](01-ai-agents-architecture-design-patterns.md)**

→ Fiche suivante : **[03 - MLOps et mise en production](03-mlops-mise-production.md)**
