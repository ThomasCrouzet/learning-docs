---
tags:
  - IA
  - Avancé
  - Pratique
description: "RAG - Retrieval-Augmented Generation : embeddings, vector stores, chunking, recherche hybride, reranking et architecture complète"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 5
cursus: "Phase 6 - Large Language Models"
---

# 03 - RAG - Retrieval-Augmented Generation

> **En bref** : À la fin de cette fiche, tu sauras construire un système RAG complet avec embeddings, vector store et reranking pour permettre à un LLM de répondre à des questions en s'appuyant sur tes propres documents. Lecture estimée : 50 min.


## Prérequis

- [Fiche 02 - Prompt engineering et context engineering](02-prompt-engineering-context-engineering.md) (zéro/few-shot, system prompts, gestion du contexte)
- [Fiche 01 - Architecture et fonctionnement des LLM](01-architecture-fonctionnement-llm.md) (tokenization, next token prediction)
- Python 3 installé sur ta machine
- `pip install chromadb sentence-transformers openai rank_bm25`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras construire un système RAG complet avec embeddings, vector store et reranking pour permettre à un LLM de répondre à des questions en s'appuyant sur tes propres documents.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un embedding ?

**Définition** : Un embedding est une représentation vectorielle d'un texte (mot, phrase, paragraphe) dans un espace de haute dimension. Chaque texte est converti en un vecteur de nombres (typiquement 384 à 1536 dimensions) de sorte que deux textes sémantiquement proches aient des vecteurs proches dans cet espace.

**Le problème que les embeddings résolvent** :

Sans embeddings, voici les problèmes rencontrés :

1. **Recherche limitée aux mots exacts** : une recherche par mots-clés ne trouve pas "voiture" quand tu cherches "automobile"
2. **Pas de compréhension du sens** : le texte brut est une suite de caractères sans signification numérique pour un algorithme
3. **Impossibilité de mesurer la similarité sémantique** : impossible de quantifier à quel point deux phrases disent la même chose

**Comment les embeddings résolvent ces problèmes** :

| Problème | Solution apportée par les embeddings |
| -------- | ------------------------------------ |
| Recherche limitée aux mots exacts | Les embeddings placent "voiture" et "automobile" proches dans l'espace vectoriel |
| Pas de compréhension du sens | Chaque texte devient un vecteur numérique manipulable par des algorithmes |
| Impossibilité de mesurer la similarité | La distance cosinus entre deux vecteurs quantifie leur proximité sémantique |

**Analogie concrète** : Imagine un plan d'une ville. Chaque commerce est placé selon deux critères : le type de produit vendu (axe horizontal) et le prix moyen (axe vertical). Une boulangerie artisanale et une pâtisserie se retrouvent proches sur le plan, même si leurs noms sont différents. Un embedding fait la même chose, mais avec des centaines de critères au lieu de deux.

**Ce qu'un embedding n'est PAS** :

- Un embedding n'est pas un encodage one-hot. Un encodage one-hot attribue un indice unique à chaque mot sans capturer de sens. Un embedding capture les relations sémantiques entre les mots.
- Un embedding n'est pas fixe pour un mot donné. Selon le modèle d'embedding utilisé, le même mot peut avoir des vecteurs différents. Les modèles contextuels (sentence-transformers) donnent un vecteur différent selon la phrase entière.

```python
from sentence_transformers import SentenceTransformer

# Charger un modèle d'embedding léger
model = SentenceTransformer("all-MiniLM-L6-v2")

# Encoder des phrases en vecteurs
phrases = [
    "Le chat dort sur le canapé",
    "Le félin sommeille sur le sofa",
    "Python est un langage de programmation"
]
embeddings = model.encode(phrases)

# Chaque phrase est maintenant un vecteur de 384 dimensions
print(f"Shape : {embeddings.shape}")  # (3, 384)
```

#### Les familles d'embeddings et de rerankers récents

> **Note** : Cette section décrit l'état de l'art à la date de rédaction. Les classements de modèles d'embeddings évoluent vite (voir le benchmark public MTEB). Vérifie toujours les modèles disponibles au moment où tu construis ton système.

Le modèle `all-MiniLM-L6-v2` utilisé ci-dessus est léger et pratique pour apprendre, mais il est ancien et orienté anglais. Plusieurs familles plus récentes (2024-2025) offrent une bien meilleure qualité, notamment en multilingue. Tu n'as pas besoin de les mémoriser, mais il est utile de savoir qu'elles existent quand tu passes du prototype à un usage sérieux.

**Familles d'embeddings (le bi-encodeur qui produit les vecteurs)** :

| Famille | Origine | Points clés |
| ------- | ------- | ----------- |
| `all-MiniLM-L6-v2` | sentence-transformers | Léger (384 dimensions), anglais, idéal pour apprendre |
| BGE / BGE-M3 (BAAI) | open source | Multilingue, BGE-M3 gère dense + sparse + multi-vecteur dans un seul modèle |
| GTE (Alibaba) | open source | Bonne qualité générale, plusieurs tailles (small à large) |
| `text-embedding-3` (OpenAI) | API propriétaire | Multilingue, dimensions ajustables, simple via API |

**La particularité de BGE-M3** : la lettre M signale trois capacités réunies (Multi-Functionality, Multi-Linguality, Multi-Granularity). Concrètement, un seul modèle produit à la fois l'embedding dense (le sens global), une représentation sparse façon mots-clés, et des vecteurs multiples par texte. Cela permet de faire de la recherche hybride (voir plus bas) sans empiler plusieurs modèles différents.

**Familles de rerankers (le cross-encodeur qui reclasse, voir la section reranking)** :

| Reranker | Origine | Points clés |
| -------- | ------- | ----------- |
| `bge-reranker` (BAAI) | open source | Cross-encodeur multilingue, exécutable en local |
| Cohere Rerank | API propriétaire | Reranker multilingue performant, appelé via API |

**Analogie concrète** : choisir un modèle d'embedding, c'est comme choisir la langue commune dans laquelle tu traduis tous tes documents avant de les ranger. `all-MiniLM` parle surtout anglais. Les familles récentes comme BGE-M3 sont polyglottes : si tes documents sont en français, elles rangent les textes proches bien plus fidèlement.

**Règle pratique** : pour un prototype, garde `all-MiniLM-L6-v2`. Pour des documents en français ou multilingues, passe à un modèle de la famille BGE-M3, GTE multilingue ou `text-embedding-3`, puis ajoute un reranker (`bge-reranker` ou Cohere Rerank) si la précision du top-k reste insuffisante.

---

### Qu'est-ce qu'un vector store ?

**Définition** : Un vector store (ou base de données vectorielle) est un système de stockage optimisé pour indexer et rechercher des vecteurs de haute dimension. Il permet de retrouver rapidement les k vecteurs les plus proches d'un vecteur de requête (recherche par similarité).

**Le problème que les vector stores résolvent** :

Sans vector store, voici les problèmes rencontrés :

1. **Recherche lente** : comparer un vecteur de requête avec des millions de vecteurs un par un prend trop de temps
2. **Pas de persistance** : recalculer les embeddings à chaque recherche est coûteux
3. **Pas d'indexation** : sans structure de recherche efficace, la complexité est O(n) pour chaque requête

**Comment les vector stores résolvent ces problèmes** :

| Problème | Solution apportée par les vector stores |
| -------- | --------------------------------------- |
| Recherche lente | Des index spécialisés (HNSW, IVF) réduisent la recherche à O(log n) |
| Pas de persistance | Les vecteurs sont stockés sur disque et chargés à la demande |
| Pas d'indexation | Des algorithmes d'approximation (ANN) permettent une recherche quasi-instantanée |

**Analogie concrète** : Un vector store fonctionne comme le catalogue d'une bibliothèque. Au lieu de parcourir tous les livres un par un pour trouver ceux qui traitent d'un sujet, le catalogue organise les livres par thème, auteur et date. Tu peux retrouver les livres pertinents en quelques secondes, même parmi des millions de références.

**Ce qu'un vector store n'est PAS** :

- Un vector store n'est pas une base de données relationnelle. PostgreSQL stocke des lignes et colonnes avec des requêtes SQL. Un vector store stocke des vecteurs et effectue des recherches par similarité.
- Un vector store n'est pas un moteur de recherche textuel. Elasticsearch indexe des mots-clés. Un vector store indexe des représentations sémantiques.

**Comparaison ChromaDB vs FAISS** :

| ChromaDB | FAISS |
| -------- | ----- |
| API Python simple, orientée développeur | Bibliothèque Meta, orientée performance |
| Persistance sur disque intégrée | En mémoire par défaut (persistance manuelle) |
| Supporte les métadonnées et le filtrage | Pas de métadonnées natives |
| Adapté au prototypage et petits projets | Adapté aux gros volumes (millions de vecteurs) |

---

### Qu'est-ce que le chunking ?

**Définition** : Le chunking est le processus de découpage d'un document en morceaux (chunks) de taille contrôlée avant de les convertir en embeddings. Chaque chunk est ensuite indexé séparément dans le vector store.

**Le problème que le chunking résout** :

Sans chunking, voici les problèmes rencontrés :

1. **Documents trop longs** : un embedding d'un document entier de 50 pages perd les détails fins au profit d'un résumé vague
2. **Dépassement de contexte** : les modèles d'embedding ont une limite de tokens (512 pour la plupart)
3. **Réponses imprécises** : si le document entier est retourné, le LLM doit chercher l'information pertinente dans un texte trop long

**Comment le chunking résout ces problèmes** :

| Problème | Solution apportée par le chunking |
| -------- | --------------------------------- |
| Documents trop longs | Chaque chunk couvre un sujet précis et a un embedding ciblé |
| Dépassement de contexte | La taille des chunks est contrôlée pour rester dans les limites du modèle |
| Réponses imprécises | Seuls les chunks pertinents sont envoyés au LLM, pas le document entier |

**Analogie concrète** : Le chunking est comme découper un livre en fiches individuelles. Au lieu de donner le livre entier à quelqu'un qui te pose une question, tu lui donnes uniquement les 3 fiches les plus pertinentes. Il trouve la réponse plus vite et plus précisément.

**Ce que le chunking n'est PAS** :

- Le chunking n'est pas un simple découpage par nombre de caractères. Un bon chunking respecte les limites logiques du texte (paragraphes, sections, phrases complètes).
- Le chunking n'est pas un résumé. Le texte original est conservé tel quel dans chaque chunk, rien n'est reformulé.

**Paramètres clés du chunking** :

| Paramètre | Description | Valeur typique |
| --------- | ----------- | -------------- |
| `chunk_size` | Nombre de tokens ou caractères par chunk | 256 à 1024 tokens |
| `chunk_overlap` | Nombre de tokens partagés entre deux chunks consécutifs | 10% à 20% de chunk_size |
| Stratégie | Méthode de découpage | Par paragraphe, par phrase, récursif |

```python
# Package dédié (LangChain 0.2+) : pip install langchain-text-splitters
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Découpage récursif : essaie de couper aux paragraphes, puis phrases, puis caractères
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # 500 caractères par chunk
    chunk_overlap=50,     # 50 caractères de chevauchement
    separators=["\n\n", "\n", ". ", " ", ""]  # Priorité des séparateurs
)

texte = """Premier paragraphe sur le sujet A. Il contient plusieurs phrases.

Deuxième paragraphe sur le sujet B. Il est aussi assez long pour être découpé.

Troisième paragraphe sur le sujet C."""

chunks = splitter.split_text(texte)
for i, chunk in enumerate(chunks):
    print(f"Chunk {i}: {chunk[:80]}...")
```

---

### Qu'est-ce que la recherche hybride ?

**Définition** : La recherche hybride combine deux approches de recherche : la recherche dense (par embeddings, basée sur le sens) et la recherche sparse (par mots-clés, typiquement BM25). Les résultats des deux méthodes sont fusionnés pour obtenir un classement final plus robuste.

**Le problème que la recherche hybride résout** :

Sans recherche hybride, voici les problèmes rencontrés :

1. **Recherche dense seule rate les termes exacts** : un embedding peut rater un document qui contient exactement le mot technique recherché si le contexte sémantique diffère
2. **Recherche sparse seule rate le sens** : BM25 ne trouve pas "véhicule électrique" quand tu cherches "voiture propre"
3. **Aucune méthode n'est parfaite seule** : chaque approche a ses angles morts

**Comment la recherche hybride résout ces problèmes** :

| Problème | Solution apportée par la recherche hybride |
| -------- | ------------------------------------------ |
| Dense rate les termes exacts | BM25 rattrape les correspondances exactes de mots-clés |
| Sparse rate le sens | Les embeddings capturent la similarité sémantique |
| Aucune méthode parfaite | La fusion des scores combine les forces des deux approches |

**Analogie concrète** : La recherche hybride fonctionne comme une enquête menée par deux détectives avec des méthodes complémentaires. Le premier (dense) comprend le contexte et les intentions. Le second (sparse) repère les indices concrets et les mots exacts. En combinant leurs conclusions, l'enquête est plus complète.

**Ce que la recherche hybride n'est PAS** :

- La recherche hybride n'est pas deux recherches côte à côte. Les résultats sont fusionnés avec un algorithme (Reciprocal Rank Fusion) qui pondère intelligemment les deux classements.
- La recherche hybride n'est pas toujours nécessaire. Pour des cas simples avec des documents homogènes, une recherche dense seule peut suffire.

```python
from rank_bm25 import BM25Okapi
import numpy as np

# Documents d'exemple
documents = [
    "Python est un langage de programmation interprété",
    "Le serpent python est un reptile non venimeux",
    "La programmation en Python utilise des indentations"
]

# Recherche sparse (BM25)
tokenized_docs = [doc.lower().split() for doc in documents]
bm25 = BM25Okapi(tokenized_docs)
query = "langage python programmation"
scores_bm25 = bm25.get_scores(query.lower().split())

print("Scores BM25 :", np.round(scores_bm25, 2))
# Le document 0 et 2 obtiennent des scores élevés (mots-clés présents)
```

---

### Qu'est-ce que le reranking ?

**Définition** : Le reranking est une étape de réordonnancement qui prend les résultats d'une première recherche (top-k) et les reclasse en utilisant un modèle plus précis, typiquement un cross-encoder. Le cross-encoder prend en entrée la paire (requête, document) et calcule un score de pertinence direct.

**Le problème que le reranking résout** :

Sans reranking, voici les problèmes rencontrés :

1. **Embeddings bi-encodeur imprécis** : le bi-encodeur encode la requête et le document séparément, ce qui peut manquer des interactions fines entre eux
2. **Trop de résultats peu pertinents** : les top-20 de la recherche initiale contiennent souvent des documents tangentiellement liés
3. **Ordre sous-optimal** : le document le plus pertinent n'est pas toujours en première position

**Comment le reranking résout ces problèmes** :

| Problème | Solution apportée par le reranking |
| -------- | ---------------------------------- |
| Bi-encodeur imprécis | Le cross-encoder analyse la requête et le document ensemble, capturant les interactions fines |
| Trop de résultats peu pertinents | Le reranking pousse les documents non pertinents vers le bas du classement |
| Ordre sous-optimal | Le score du cross-encoder est plus précis pour ordonner les résultats |

**Analogie concrète** : Le reranking fonctionne comme un jury de concours. La première phase (recherche initiale) sélectionne 20 candidats parmi 1000. La deuxième phase (reranking) examine chaque candidat en détail pour établir le classement final. Cette deuxième phase est plus lente mais beaucoup plus précise.

**Ce que le reranking n'est PAS** :

- Le reranking n'est pas une nouvelle recherche. Il ne parcourt pas toute la base de données. Il réordonne uniquement les résultats déjà trouvés (top-k).
- Le reranking n'est pas gratuit en performance. Le cross-encoder est plus lent que le bi-encodeur. C'est pourquoi on l'applique uniquement sur 10 à 50 résultats, pas sur toute la base.

**Comparaison bi-encodeur vs cross-encodeur** :

| Bi-encodeur (recherche initiale) | Cross-encodeur (reranking) |
| -------------------------------- | -------------------------- |
| Encode requête et document séparément | Encode la paire (requête, document) ensemble |
| Rapide (vecteurs pré-calculés) | Lent (calcul pour chaque paire) |
| Moins précis | Plus précis |
| Utilisé sur toute la base | Utilisé sur le top-k (10 à 50 résultats) |

---

### Qu'est-ce que l'architecture RAG ?

**Définition** : RAG (Retrieval-Augmented Generation) est une architecture qui combine la recherche d'information (retrieval) avec la génération de texte par un LLM. Au lieu de se fier uniquement à la mémoire interne du LLM, le système récupère des documents pertinents dans une base de connaissances et les inclut dans le contexte du prompt avant de générer la réponse.

**Le problème que le RAG résout** :

Sans RAG, voici les problèmes rencontrés :

1. **Connaissances obsolètes** : le LLM ne connaît que les données de son entraînement (cutoff date)
2. **Hallucinations** : le LLM invente des informations quand il ne sait pas
3. **Pas de sources vérifiables** : impossible de tracer d'où vient une réponse du LLM
4. **Pas de données privées** : le LLM n'a pas accès aux documents internes d'une entreprise

**Comment le RAG résout ces problèmes** :

| Problème | Solution apportée par le RAG |
| -------- | ---------------------------- |
| Connaissances obsolètes | La base de connaissances peut être mise à jour en continu |
| Hallucinations | Le LLM reçoit des extraits récupérés ; cela **réduit** souvent les inventions, sans les **éliminer** |
| Pas de sources vérifiables | Chaque réponse peut citer les documents sources utilisés (si le pipeline l'impose) |
| Pas de données privées | Les documents internes sont indexés dans le vector store |

**Analogie concrète** : Le RAG fonctionne comme un étudiant qui a le droit de consulter ses notes pendant un examen. Sans ses notes (sans RAG), il répond de mémoire et risque de se tromper. Avec ses notes (avec RAG), il peut s'appuyer sur des fiches pertinentes avant de formuler sa réponse. Même avec des notes, il peut mal citer, mélanger deux fiches, ou inventer un détail absent des notes.

**Ce que le RAG n'est PAS** :

- Le RAG n'est pas du fine-tuning. Le fine-tuning modifie les poids du modèle. Le RAG laisse le modèle intact et lui fournit du contexte externe au moment de la requête.
- Le RAG n'est pas une simple copie de documents. Le LLM synthétise et reformule l'information trouvée pour répondre à la question posée.
- Le RAG n'est pas une garantie d'exactitude. Un mauvais chunking, une retrieval hors sujet, ou une reformulation incorrecte peuvent encore produire des réponses fausses présentées avec confiance.

Le diagramme suivant résume le pipeline RAG lors d'une requête utilisateur :

<div class="diagram-design">
<p><a href="../../../diagrams/ia-06-large-language-models-03-rag-retrieval-augmented-generation-1.html">Qu&#x27;est-ce que l&#x27;architecture RAG ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ia-06-large-language-models-03-rag-retrieval-augmented-generation-1.html" title="Qu&#x27;est-ce que l&#x27;architecture RAG ?" style="width:100%;min-height:784px;border:0;background:transparent"></iframe>
</div>

**Pipeline RAG complet** :

```text
Phase 1 : INGESTION (hors-ligne)
  Document -> Chunking -> Embeddings -> Vector Store

Phase 2 : RETRIEVAL (à chaque requête)
  Question utilisateur -> Embedding -> Recherche dans le Vector Store -> Top-k chunks

Phase 3 : AUGMENTATION
  System prompt + Top-k chunks + Question -> Prompt complet

Phase 4 : GÉNÉRATION
  Prompt complet -> LLM -> Réponse basée sur les documents
```

---

## Étapes Pratiques

### Étape 1 : Installer les dépendances

Crée un dossier de projet et installe les bibliothèques nécessaires.

```bash
# Créer le dossier du projet
mkdir rag-demo && cd rag-demo

# Installer les dépendances
pip install chromadb sentence-transformers openai rank_bm25
```

**Résultat attendu** :

```text
Successfully installed chromadb sentence-transformers openai rank_bm25 ...
```

---

### Étape 2 : Préparer les documents et le chunking

Crée un fichier `rag_pipeline.py` et commence par le découpage des documents.

```python
# rag_pipeline.py

# --- Phase 1 : Préparation des documents ---
documents = [
    {
        "id": "doc1",
        "text": "Docker est une plateforme de conteneurisation. "
                "Un conteneur est un environnement isolé qui contient "
                "un programme et toutes ses dépendances. Docker utilise "
                "des images pour créer des conteneurs. Une image est un "
                "template en lecture seule qui définit le conteneur.",
        "source": "cours-docker.md"
    },
    {
        "id": "doc2",
        "text": "Symfony est un framework PHP pour construire des "
                "applications web. Il utilise le pattern MVC (Modèle-Vue-"
                "Contrôleur). Doctrine est l'ORM de Symfony qui permet "
                "de manipuler la base de données avec des objets PHP "
                "au lieu de requêtes SQL.",
        "source": "cours-symfony.md"
    },
    {
        "id": "doc3",
        "text": "PostgreSQL est un système de gestion de base de données "
                "relationnelle. Il supporte les transactions ACID, les "
                "index B-tree et GiST, et les requêtes complexes avec "
                "des jointures. PostgreSQL utilise le langage SQL pour "
                "manipuler les données.",
        "source": "cours-postgresql.md"
    }
]


def chunk_text(text, chunk_size=200, overlap=30):
    """Découpe un texte en chunks avec chevauchement."""
    chunks = []
    start = 0
    while start < len(text):
        # Trouver la fin du chunk
        end = start + chunk_size

        # Si on n'est pas à la fin, essayer de couper à un point
        if end < len(text):
            # Chercher le dernier point avant la fin du chunk
            last_period = text.rfind(". ", start, end)
            if last_period > start:
                end = last_period + 2  # Inclure le point et l'espace

        chunks.append(text[start:end].strip())
        # Le prochain chunk commence (overlap) caractères avant la fin
        start = end - overlap if end < len(text) else end

    return chunks


# Découper tous les documents
all_chunks = []
for doc in documents:
    chunks = chunk_text(doc["text"])
    for i, chunk in enumerate(chunks):
        all_chunks.append({
            "id": f"{doc['id']}_chunk_{i}",
            "text": chunk,
            "source": doc["source"]
        })

# Afficher les chunks
for chunk in all_chunks:
    print(f"[{chunk['id']}] ({len(chunk['text'])} chars) {chunk['text'][:60]}...")
```

**Résultat attendu** :

```text
[doc1_chunk_0] (196 chars) Docker est une plateforme de conteneurisation. Un conteneur ...
[doc1_chunk_1] (153 chars) Docker utilise des images pour créer des conteneurs. Une ima...
[doc2_chunk_0] (187 chars) Symfony est un framework PHP pour construire des application...
[doc2_chunk_1] (152 chars) Doctrine est l'ORM de Symfony qui permet de manipuler la bas...
[doc3_chunk_0] (194 chars) PostgreSQL est un système de gestion de base de données rela...
[doc3_chunk_1] (140 chars) PostgreSQL utilise le langage SQL pour manipuler les données...
```

---

### Étape 3 : Créer les embeddings et indexer dans ChromaDB

```python
import chromadb
from sentence_transformers import SentenceTransformer

# Charger le modèle d'embedding
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Créer un client ChromaDB persistant (sauvegarde sur disque)
client = chromadb.PersistentClient(path="./chroma_db")

# Créer une collection (équivalent d'une table)
collection = client.get_or_create_collection(
    name="cours",
    metadata={"hnsw:space": "cosine"}  # Distance cosinus pour la similarité
)

# Calculer les embeddings de tous les chunks
texts = [chunk["text"] for chunk in all_chunks]
embeddings = embedding_model.encode(texts).tolist()

# Indexer les chunks dans ChromaDB
collection.add(
    ids=[chunk["id"] for chunk in all_chunks],
    embeddings=embeddings,
    documents=texts,
    metadatas=[{"source": chunk["source"]} for chunk in all_chunks]
)

print(f"Indexé {collection.count()} chunks dans ChromaDB")
```

**Résultat attendu** :

```text
Indexé 6 chunks dans ChromaDB
```

---

### Étape 4 : Rechercher des documents par similarité

```python
# Encoder la question de l'utilisateur
question = "Comment fonctionne Doctrine avec Symfony ?"
question_embedding = embedding_model.encode([question]).tolist()

# Rechercher les 3 chunks les plus proches
results = collection.query(
    query_embeddings=question_embedding,
    n_results=3,
    include=["documents", "distances", "metadatas"]
)

# Afficher les résultats
print(f"Question : {question}\n")
for i in range(len(results["documents"][0])):
    doc = results["documents"][0][i]
    distance = results["distances"][0][i]
    source = results["metadatas"][0][i]["source"]
    print(f"Résultat {i+1} (distance: {distance:.4f}) [{source}]")
    print(f"  {doc[:100]}...\n")
```

**Résultat attendu** :

```text
Question : Comment fonctionne Doctrine avec Symfony ?

Résultat 1 (distance: 0.3421) [cours-symfony.md]
  Doctrine est l'ORM de Symfony qui permet de manipuler la base de données avec des objets PHP au lie...

Résultat 2 (distance: 0.5102) [cours-symfony.md]
  Symfony est un framework PHP pour construire des applications web. Il utilise le pattern MVC (Modèl...

Résultat 3 (distance: 0.7834) [cours-postgresql.md]
  PostgreSQL est un système de gestion de base de données relationnelle. Il supporte les transactions...
```

---

### Étape 5 : Générer une réponse avec le LLM (RAG complet)

```python
from openai import OpenAI

# Initialiser le client (utilise OPENAI_API_KEY de l'environnement)
llm_client = OpenAI()

def rag_query(question, collection, embedding_model, n_results=3):
    """Pipeline RAG complet : retrieval + augmentation + génération."""

    # --- RETRIEVAL : chercher les chunks pertinents ---
    question_embedding = embedding_model.encode([question]).tolist()
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=n_results,
        include=["documents", "metadatas"]
    )

    # --- AUGMENTATION : construire le prompt avec les documents ---
    context_parts = []
    for i, doc in enumerate(results["documents"][0]):
        source = results["metadatas"][0][i]["source"]
        context_parts.append(f"[Source: {source}]\n{doc}")

    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""Tu es un assistant pédagogique. Réponds à la question en te
basant UNIQUEMENT sur les documents fournis ci-dessous.
Si les documents ne contiennent pas la réponse, dis-le clairement.
Cite les sources utilisées.

## Documents

{context}

## Question

{question}

## Réponse"""

    # --- GÉNÉRATION : appeler le LLM ---
    response = llm_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1  # Température basse pour des réponses factuelles
    )

    return response.choices[0].message.content, results


# Utilisation
answer, sources = rag_query(
    "Qu'est-ce que Doctrine et comment il fonctionne ?",
    collection,
    embedding_model
)
print(answer)
```

**Résultat attendu** :

```text
D'après les documents fournis, Doctrine est l'ORM (Object-Relational Mapping)
de Symfony. Il permet de manipuler la base de données avec des objets PHP au
lieu d'écrire des requêtes SQL directement.

[Source: cours-symfony.md]
```

---

### Étape 6 : Ajouter la recherche hybride avec BM25

```python
from rank_bm25 import BM25Okapi
import numpy as np


def hybrid_search(question, collection, embedding_model, documents_texts,
                  n_results=3, alpha=0.5):
    """Recherche hybride : dense (embeddings) + sparse (BM25)."""

    # --- Recherche dense (embeddings) ---
    question_embedding = embedding_model.encode([question]).tolist()
    dense_results = collection.query(
        query_embeddings=question_embedding,
        n_results=n_results * 2,  # Récupérer plus pour la fusion
        include=["documents", "distances"]
    )

    # --- Recherche sparse (BM25) ---
    tokenized_docs = [doc.lower().split() for doc in documents_texts]
    bm25 = BM25Okapi(tokenized_docs)
    bm25_scores = bm25.get_scores(question.lower().split())

    # Récupérer les top-k de BM25
    bm25_top_k = np.argsort(bm25_scores)[::-1][:n_results * 2]

    # --- Reciprocal Rank Fusion (RRF) ---
    k = 60  # Constante RRF standard
    rrf_scores = {}

    # Scores dense
    for rank, doc in enumerate(dense_results["documents"][0]):
        rrf_scores[doc] = rrf_scores.get(doc, 0) + 1 / (k + rank + 1)

    # Scores sparse
    for rank, idx in enumerate(bm25_top_k):
        doc = documents_texts[idx]
        rrf_scores[doc] = rrf_scores.get(doc, 0) + 1 / (k + rank + 1)

    # Trier par score RRF décroissant
    sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)

    return sorted_docs[:n_results]


# Utilisation
texts = [chunk["text"] for chunk in all_chunks]
results = hybrid_search(
    "requêtes SQL PostgreSQL",
    collection,
    embedding_model,
    texts
)

print("Résultats de la recherche hybride :")
for doc, score in results:
    print(f"  Score RRF: {score:.4f} | {doc[:80]}...")
```

**Résultat attendu** :

```text
Résultats de la recherche hybride :
  Score RRF: 0.0328 | PostgreSQL utilise le langage SQL pour manipuler les données...
  Score RRF: 0.0323 | PostgreSQL est un système de gestion de base de données relat...
  Score RRF: 0.0164 | Doctrine est l'ORM de Symfony qui permet de manipuler la base...
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install chromadb` | Installe ChromaDB (vector store) |
| `pip install sentence-transformers` | Installe les modèles d'embedding |
| `pip install rank_bm25` | Installe BM25 pour la recherche sparse |
| `SentenceTransformer("all-MiniLM-L6-v2")` | Charge un modèle d'embedding léger (384 dimensions) |
| `model.encode(["texte"])` | Convertit un texte en vecteur |
| `collection.add(ids, embeddings, documents)` | Indexe des documents dans ChromaDB |
| `collection.query(query_embeddings, n_results)` | Recherche les k plus proches voisins |
| `BM25Okapi(tokenized_docs)` | Crée un index BM25 pour la recherche par mots-clés |

---

## Pièges Fréquents

### Piège 1 : Chunks trop grands ou trop petits

⚠️ **Problème** : Des chunks de 2000 tokens noient l'information pertinente. Des chunks de 50 tokens perdent le contexte.

✅ **Solution** : Utilise des chunks de 256 à 512 tokens avec un overlap de 10% à 20%. Teste différentes tailles sur tes données et mesure la qualité des réponses.

---

### Piège 2 : Ne pas utiliser de métadonnées dans le vector store

⚠️ **Problème** : Indexer les chunks sans métadonnées (source, date, auteur) empêche de filtrer les résultats et de citer les sources.

✅ **Solution** : Ajoute toujours les métadonnées lors de l'indexation.

```python
# Inclure les métadonnées pour chaque chunk
collection.add(
    ids=["chunk_1"],
    embeddings=[embedding],
    documents=["texte du chunk"],
    metadatas=[{"source": "fichier.md", "page": 3, "date": "2025-01-15"}]
)

# Filtrer par métadonnées lors de la recherche
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5,
    where={"source": "fichier.md"}  # Filtrer par source
)
```

---

### Piège 3 : Utiliser un modèle d'embedding inapproprié

⚠️ **Problème** : Utiliser un modèle d'embedding entraîné pour l'anglais sur des documents en français donne des résultats médiocres.

✅ **Solution** : Choisis un modèle d'embedding adapté à ta langue et à ton domaine.

| Modèle | Langues | Dimensions | Usage |
| ------ | ------- | ---------- | ----- |
| `all-MiniLM-L6-v2` | Anglais | 384 | Prototypage rapide |
| `paraphrase-multilingual-MiniLM-L12-v2` | 50+ langues | 384 | Documents multilingues |
| `text-embedding-3-small` (OpenAI) | Multilingue | 1536 | Production |

---

### Piège 4 : Ne pas évaluer la qualité du RAG

⚠️ **Problème** : Construire un RAG sans mesurer si les bons documents sont retrouvés et si les réponses sont correctes.

✅ **Solution** : Crée un jeu de test avec des paires (question, réponse attendue, documents sources attendus). Mesure le recall (pourcentage de documents pertinents retrouvés) et la qualité des réponses.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est un embedding et à quoi il sert
- [ ] Je sais découper un document en chunks avec overlap
- [ ] Je sais indexer des chunks dans ChromaDB avec leurs métadonnées
- [ ] Je sais rechercher des documents par similarité dans un vector store
- [ ] Je comprends la différence entre recherche dense et recherche sparse
- [ ] Je sais implémenter une recherche hybride avec Reciprocal Rank Fusion
- [ ] Je comprends le rôle du reranking et quand l'utiliser
- [ ] Je sais construire un pipeline RAG complet (ingestion, retrieval, augmentation, génération)

---

## Exercice Pratique

**Énoncé** : Construis un système RAG simple qui répond à des questions sur un ensemble de documents texte.

1. Crée 5 documents texte sur un sujet de ton choix (minimum 200 mots chacun)
2. Découpe-les en chunks de 300 caractères avec un overlap de 50 caractères
3. Indexe les chunks dans ChromaDB avec les métadonnées (source, date)
4. Implémente une fonction de recherche hybride (dense + BM25)
5. Construis le pipeline RAG complet qui retourne la réponse et les sources citées

**Indications** :

- Utilise `all-MiniLM-L6-v2` pour les embeddings
- Utilise ChromaDB en mode persistant
- Pour le LLM, utilise l'API OpenAI ou un modèle local via Ollama
- Mesure la distance des résultats pour vérifier la pertinence

**Résultat attendu** : Un script Python qui prend une question en entrée, retrouve les chunks pertinents, et génère une réponse sourcée en utilisant un LLM.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import chromadb
import numpy as np
from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
from openai import OpenAI

# --- Configuration ---
CHUNK_SIZE = 300
CHUNK_OVERLAP = 50
N_RESULTS = 3
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


# --- Fonctions utilitaires ---
def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Découpe un texte en chunks avec chevauchement."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        if end < len(text):
            last_period = text.rfind(". ", start, end)
            if last_period > start:
                end = last_period + 2
        chunks.append(text[start:end].strip())
        start = end - overlap if end < len(text) else end
    return chunks


def reciprocal_rank_fusion(dense_docs, sparse_docs, k=60):
    """Fusionne deux listes de résultats avec RRF."""
    rrf_scores = {}
    for rank, doc in enumerate(dense_docs):
        rrf_scores[doc] = rrf_scores.get(doc, 0) + 1 / (k + rank + 1)
    for rank, doc in enumerate(sparse_docs):
        rrf_scores[doc] = rrf_scores.get(doc, 0) + 1 / (k + rank + 1)
    return sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)


# --- Étape 1 : Préparer les documents ---
documents = [
    {
        "id": "docker-intro",
        "text": (
            "Docker est une plateforme open source qui automatise le déploiement "
            "d'applications dans des conteneurs logiciels. Un conteneur encapsule "
            "une application avec toutes ses dépendances, bibliothèques et fichiers "
            "de configuration. Contrairement aux machines virtuelles, les conteneurs "
            "partagent le noyau du système d'exploitation hôte, ce qui les rend plus "
            "légers et rapides à démarrer. Docker utilise un Dockerfile pour définir "
            "les instructions de construction d'une image. L'image est un template "
            "en lecture seule qui sert de base pour créer des conteneurs."
        ),
        "source": "docker-intro.md",
        "date": "2025-01-10"
    },
    {
        "id": "symfony-intro",
        "text": (
            "Symfony est un framework PHP open source créé par SensioLabs. Il suit "
            "le pattern MVC (Modèle-Vue-Contrôleur) et fournit des composants "
            "réutilisables. Doctrine est l'ORM intégré à Symfony qui permet de "
            "manipuler la base de données via des entités PHP au lieu de requêtes "
            "SQL. Twig est le moteur de templates de Symfony pour générer des vues "
            "HTML. Le système de routing de Symfony associe des URL à des contrôleurs "
            "qui traitent les requêtes HTTP et retournent des réponses."
        ),
        "source": "symfony-intro.md",
        "date": "2025-02-15"
    }
]


# --- Étape 2 : Chunking ---
all_chunks = []
for doc in documents:
    chunks = chunk_text(doc["text"])
    for i, chunk in enumerate(chunks):
        all_chunks.append({
            "id": f"{doc['id']}_chunk_{i}",
            "text": chunk,
            "source": doc["source"],
            "date": doc["date"]
        })

print(f"Total chunks : {len(all_chunks)}")


# --- Étape 3 : Indexation dans ChromaDB ---
embedder = SentenceTransformer(EMBEDDING_MODEL)
client = chromadb.PersistentClient(path="./chroma_exercice")
collection = client.get_or_create_collection(
    name="exercice_rag",
    metadata={"hnsw:space": "cosine"}
)

texts = [c["text"] for c in all_chunks]
embeddings = embedder.encode(texts).tolist()

collection.add(
    ids=[c["id"] for c in all_chunks],
    embeddings=embeddings,
    documents=texts,
    metadatas=[{"source": c["source"], "date": c["date"]} for c in all_chunks]
)

print(f"Indexé {collection.count()} chunks")


# --- Étape 4 : Recherche hybride ---
def hybrid_search(question, n=N_RESULTS):
    # Dense
    q_emb = embedder.encode([question]).tolist()
    dense = collection.query(query_embeddings=q_emb, n_results=n * 2,
                             include=["documents"])
    dense_docs = dense["documents"][0]

    # Sparse (BM25)
    tokenized = [t.lower().split() for t in texts]
    bm25 = BM25Okapi(tokenized)
    scores = bm25.get_scores(question.lower().split())
    top_indices = np.argsort(scores)[::-1][:n * 2]
    sparse_docs = [texts[i] for i in top_indices]

    # Fusion RRF
    fused = reciprocal_rank_fusion(dense_docs, sparse_docs)
    return [doc for doc, score in fused[:n]]


# --- Étape 5 : Pipeline RAG complet ---
def rag(question):
    # Retrieval
    relevant_chunks = hybrid_search(question)

    # Augmentation
    context = "\n\n---\n\n".join(relevant_chunks)
    prompt = f"""Réponds à la question en te basant UNIQUEMENT sur les documents.
Cite les sources.

## Documents
{context}

## Question
{question}"""

    # Génération
    llm = OpenAI()
    response = llm.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    return response.choices[0].message.content


# Test
answer = rag("Qu'est-ce que Doctrine dans Symfony ?")
print(answer)
```

---

## Navigation

← Fiche précédente : **[02 - Prompt engineering et context engineering](02-prompt-engineering-context-engineering.md)**

→ Fiche suivante : **[04 - Fine-tuning et adaptation de modèles](04-fine-tuning-adaptation-modeles.md)**
