---
tags:
  - IA
  - Expert
  - Pratique
description: "NLP avancé et traitement de la parole : Whisper (ASR), TTS neuronal, NER, résumé automatique et Document AI avec Python"
estimated_time: "50 min"
fiche_number: 2
total_fiches: 5
cursus: "Phase 8 - Spécialisations avancées"
---

# 02 - NLP avancé et traitement de la parole

> **En bref** : À la fin de cette fiche, tu sauras utiliser Whisper pour transcrire de l'audio en texte, comprendre les systèmes TTS neuronaux, extraire des entités nommées avec le NER, appliquer le résumé automatique et traiter des documents avec OCR et layout analysis. Lecture estimée : 50 min.


## Prérequis

- [Phase 5 - NLP et Transformers](../05-architectures-modernes-nlp/index.md) (tokenization, attention, BERT, GPT)
- Python 3 installé sur ta machine
- PyTorch installé (`pip install torch torchaudio`)
- Transformers installé (`pip install transformers`)
- spaCy installé (`pip install spacy` puis `python -m spacy download fr_core_news_sm`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser Whisper pour transcrire de l'audio en texte, comprendre les systèmes TTS neuronaux, extraire des entités nommées avec le NER, appliquer le résumé automatique et traiter des documents avec OCR et layout analysis.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'ASR (Automatic Speech Recognition) ?

**Définition** : L'ASR (Automatic Speech Recognition) est la tâche qui consiste à convertir un signal audio de parole en texte écrit. Le modèle Whisper d'OpenAI est l'architecture de référence actuelle : un encoder-decoder Transformer entraîné sur 680 000 heures d'audio multilingue.

**Le problème que l'ASR résout** :

Sans ASR, voici les problèmes rencontrés :

1. **Pas de transcription automatique** : transcrire manuellement une heure d'audio prend 4 à 6 heures de travail humain
2. **Pas d'accessibilité** : les personnes sourdes ou malentendantes ne peuvent pas accéder au contenu audio
3. **Pas d'indexation du contenu audio** : impossible de rechercher un mot dans un podcast ou une vidéo

**Comment l'ASR résout ces problèmes** :

| Problème | Solution apportée par l'ASR |
| -------- | --------------------------- |
| Pas de transcription automatique | Le modèle transcrit en temps réel ou quasi temps réel |
| Pas d'accessibilité | Le texte généré sert de sous-titres automatiques |
| Pas d'indexation | Le texte transcrit est indexable et recherchable |

**Analogie concrète** : L'ASR fonctionne comme un sténographe professionnel dans un tribunal. Le sténographe écoute ce qui est dit et produit une transcription écrite en temps réel. Whisper est un sténographe numérique qui comprend 99 langues et peut aussi traduire.

**Ce que l'ASR n'est PAS** :

- L'ASR n'est pas de la compréhension du langage. L'ASR convertit le son en texte, mais ne comprend pas le sens. Pour comprendre, il faut un modèle NLU (Natural Language Understanding) en aval.
- L'ASR n'est pas de l'identification du locuteur. L'ASR produit du texte sans dire qui parle. La diarisation (speaker diarization) est une tâche séparée.

#### Architecture de Whisper

Whisper utilise une architecture encoder-decoder :

1. **Encoder** : reçoit un spectrogramme mel (représentation fréquentielle de l'audio) et le transforme en une séquence de vecteurs contextuels
2. **Decoder** : génère le texte token par token en utilisant l'attention croisée sur les vecteurs de l'encoder
3. **Timestamps** : Whisper peut produire des timestamps au niveau des mots ou des segments, permettant la synchronisation texte-audio

```python
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch

# Charger le modèle Whisper (version small pour l'exemple)
processor = WhisperProcessor.from_pretrained("openai/whisper-small")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")

# En production, on charge un fichier audio réel
# Ici on simule un tableau de features audio
import numpy as np
# Simuler 30 secondes d'audio à 16kHz
audio_array = np.random.randn(16000 * 30).astype(np.float32)

# Préparer l'entrée pour le modèle
input_features = processor(
    audio_array,
    sampling_rate=16000,
    return_tensors="pt"
).input_features

# Générer la transcription
with torch.no_grad():
    predicted_ids = model.generate(input_features)

# Décoder les tokens en texte
transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)
print(f"Transcription : {transcription[0]}")
```

**Tailles de modèles Whisper** :

| Modèle | Paramètres | VRAM requise | Qualité |
| ------ | ---------- | ------------ | ------- |
| tiny | 39 M | ~1 Go | Basique |
| base | 74 M | ~1 Go | Correcte |
| small | 244 M | ~2 Go | Bonne |
| medium | 769 M | ~5 Go | Très bonne |
| large-v3 | 1.55 G | ~10 Go | Excellente |

---

### Qu'est-ce que le TTS (Text-to-Speech) ?

**Définition** : Le TTS (Text-to-Speech) est la tâche inverse de l'ASR : convertir du texte écrit en signal audio de parole. Les modèles neuronaux modernes (VITS, Bark, Tortoise) produisent une voix naturelle et expressive.

**Le problème que le TTS résout** :

Sans TTS, voici les problèmes rencontrés :

1. **Pas de lecture vocale** : les personnes malvoyantes ne peuvent pas accéder au contenu textuel
2. **Voix robotique** : les anciens systèmes concaténatifs produisent une voix artificielle et fatigante à écouter
3. **Pas de personnalisation** : impossible de choisir la voix, le style ou l'émotion

**Comment le TTS résout ces problèmes** :

| Problème | Solution apportée par le TTS neuronal |
| -------- | ------------------------------------- |
| Pas de lecture vocale | Le texte est converti en audio naturel instantanément |
| Voix robotique | Les modèles neuronaux produisent une prosodie naturelle |
| Pas de personnalisation | Le clonage vocal et le contrôle du style sont possibles |

**Analogie concrète** : Le TTS est comme un acteur qui lit un texte à voix haute. Les anciens systèmes étaient comme un robot qui épelle chaque mot. Les modèles neuronaux modernes sont comme un acteur professionnel : ils mettent le ton, respectent les pauses et adaptent l'intonation aux questions et exclamations.

**Ce que le TTS n'est PAS** :

- Le TTS n'est pas de la génération de musique. Le TTS produit de la parole, pas du chant ou de la musique instrumentale. La génération musicale utilise des modèles différents (MusicGen, Jukebox).
- Le TTS n'est pas du clonage vocal par défaut. Le clonage vocal nécessite un échantillon de la voix cible en entrée.

#### Architectures TTS modernes

| Modèle | Type | Particularité |
| ------ | ---- | ------------- |
| VITS | End-to-end | Rapide, qualité élevée, multilingue |
| Bark | Autorégressif | Peut rire, chuchoter, ajouter de la musique |
| Tortoise | Autorégressif | Excellente qualité, lent |
| StyleTTS 2 | Diffusion | Qualité proche de l'humain |

---

### Qu'est-ce que le NER (Named Entity Recognition) ?

**Définition** : Le NER (Named Entity Recognition) est la tâche qui consiste à identifier et classifier les entités nommées dans un texte : personnes, organisations, lieux, dates, montants, etc. Chaque token du texte reçoit un label indiquant s'il fait partie d'une entité et de quel type.

**Le problème que le NER résout** :

Sans NER, voici les problèmes rencontrés :

1. **Pas d'extraction structurée** : un texte brut ne distingue pas les noms de personnes des noms de villes
2. **Pas d'anonymisation** : impossible de masquer automatiquement les données personnelles dans un document
3. **Pas de liaison entre documents** : impossible de relier automatiquement deux articles qui parlent de la même personne

**Comment le NER résout ces problèmes** :

| Problème | Solution apportée par le NER |
| -------- | ---------------------------- |
| Pas d'extraction structurée | Chaque entité est typée (PER, ORG, LOC, DATE, etc.) |
| Pas d'anonymisation | Les entités PER détectées peuvent être automatiquement masquées |
| Pas de liaison | Les entités identiques dans différents documents créent des liens |

**Analogie concrète** : Le NER fonctionne comme un surligneur multicolore sur un texte. Tu utilises le jaune pour les personnes, le bleu pour les lieux, le vert pour les organisations. Après le surlignage, tu peux extraire rapidement toutes les personnes mentionnées.

**Ce que le NER n'est PAS** :

- Le NER n'est pas de la classification de texte. La classification attribue un label global au texte entier ("politique", "sport"). Le NER attribue un label à chaque token.
- Le NER n'est pas de la résolution de coréférences. Le NER identifie "Paris" comme lieu, mais ne sait pas que "la capitale" dans la phrase suivante désigne aussi Paris.

#### Schéma de labelling BIO

Le format BIO (Begin, Inside, Outside) est le standard pour annoter les entités :

```text
Token       | Label
----------- | -----
Marie       | B-PER    (Begin - début d'une entité Personne)
Curie       | I-PER    (Inside - continuation de l'entité)
a           | O        (Outside - pas une entité)
travaillé   | O
à           | O
Paris       | B-LOC    (Begin - début d'une entité Lieu)
en          | O
1903        | B-DATE   (Begin - début d'une entité Date)
```

```python
import spacy

# Charger le modèle français
nlp = spacy.load("fr_core_news_sm")

# Texte à analyser
texte = "Marie Curie a travaillé à Paris en 1903 pour l'Université de Paris."

# Appliquer le NER
doc = nlp(texte)

# Afficher les entités détectées
for ent in doc.ents:
    print(f"{ent.text:30s} | {ent.label_:10s} | {ent.start_char}-{ent.end_char}")
```

**Résultat attendu** :

```text
Marie Curie                    | PER        | 0-11
Paris                          | LOC        | 29-34
1903                           | DATE       | 38-42
Université de Paris            | ORG        | 52-71
```

---

### Qu'est-ce que le résumé automatique (Summarization) ?

**Définition** : Le résumé automatique est la tâche qui consiste à produire une version condensée d'un texte en conservant les informations essentielles. Il existe deux approches : extractive (sélection de phrases existantes) et abstractive (génération de nouvelles phrases).

**Le problème que le résumé automatique résout** :

Sans résumé automatique, voici les problèmes rencontrés :

1. **Surcharge informationnelle** : un humain ne peut pas lire des milliers de documents par jour
2. **Pas de vue d'ensemble rapide** : impossible d'obtenir l'essentiel d'un rapport de 50 pages en 30 secondes
3. **Perte de temps** : les analystes passent des heures à lire des documents pour en extraire 3 phrases clés

**Comment le résumé automatique résout ces problèmes** :

| Problème | Solution apportée par le résumé automatique |
| -------- | -------------------------------------------- |
| Surcharge informationnelle | Le résumé réduit un document à 10-20% de sa taille |
| Pas de vue d'ensemble | Le résumé donne l'essentiel en quelques phrases |
| Perte de temps | Le résumé est généré en quelques secondes |

**Analogie concrète** : Le résumé extractif fonctionne comme un surligneur : tu sélectionnes les 3 phrases les plus importantes d'un texte. Le résumé abstractif fonctionne comme un journaliste qui lit un rapport et rédige un paragraphe de synthèse avec ses propres mots.

**Comparaison extractif vs abstractif** :

| Résumé extractif | Résumé abstractif |
| ---------------- | ----------------- |
| Sélectionne des phrases existantes | Génère de nouvelles phrases |
| Toujours fidèle au texte source | Peut reformuler et synthétiser |
| Ne peut pas combiner des informations | Peut fusionner des informations de différentes parties |
| Plus simple à implémenter | Nécessite un modèle génératif (BART, T5, Pegasus) |
| Résultats parfois incohérents | Résultats plus fluides mais risque d'hallucination |

```python
from transformers import pipeline

# Pipeline de résumé abstractif avec BART
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

texte = """
La conférence internationale sur l'intelligence artificielle s'est tenue
à Paris du 15 au 18 mars 2026. Plus de 3000 chercheurs venus de 45 pays
ont présenté leurs travaux. Les thèmes principaux incluaient les grands
modèles de langage, la vision par ordinateur et le reinforcement learning.
Le prix du meilleur article a été décerné à une équipe de l'INRIA pour
ses travaux sur l'efficacité énergétique des modèles de langage.
"""

# Générer le résumé
resume = summarizer(texte, max_length=60, min_length=20, do_sample=False)
print(f"Résumé : {resume[0]['summary_text']}")
```

---

### Qu'est-ce que le Document AI ?

**Définition** : Le Document AI regroupe les techniques d'IA appliquées à l'analyse automatique de documents : extraction de texte par OCR (Optical Character Recognition), analyse de la mise en page (layout analysis) et extraction structurée d'informations depuis des factures, formulaires ou rapports.

**Le problème que le Document AI résout** :

Sans Document AI, voici les problèmes rencontrés :

1. **Documents non numériques** : les scans et photos de documents ne sont pas exploitables par du code
2. **Pas de structure** : un PDF scanné ne distingue pas le titre, les paragraphes et les tableaux
3. **Saisie manuelle** : extraire les données d'une facture nécessite une saisie humaine

**Comment le Document AI résout ces problèmes** :

| Problème | Solution apportée par le Document AI |
| -------- | ------------------------------------ |
| Documents non numériques | L'OCR convertit les images en texte exploitable |
| Pas de structure | Le layout analysis identifie titres, paragraphes, tableaux, figures |
| Saisie manuelle | L'extraction automatique remplace la saisie humaine |

**Analogie concrète** : Le Document AI fonctionne comme un assistant administratif expert. Tu lui donnes une pile de factures scannées. Il lit chaque facture (OCR), identifie les zones importantes (layout analysis) et remplit un tableur avec les données extraites (montant, date, fournisseur).

**Ce que le Document AI n'est PAS** :

- Le Document AI n'est pas un simple OCR. L'OCR extrait du texte brut. Le Document AI comprend la structure du document et les relations entre les éléments.
- Le Document AI n'est pas de la génération de documents. Il analyse des documents existants, il n'en crée pas.

#### Outils principaux

| Outil | Description |
| ----- | ----------- |
| DocTR | OCR open-source haute qualité (architecture CRNN + Transformer) |
| LayoutLM | Modèle Transformer qui comprend le texte ET la mise en page |
| PaddleOCR | OCR multilingue performant (Baidu) |
| Tesseract | OCR classique open-source (Google), moins précis que les alternatives neuronales |

---

## Étapes Pratiques

### Étape 1 : Transcrire de l'audio avec Whisper

Crée un fichier `nlp_avance.py` et commence par la transcription audio.

```python
from transformers import pipeline
import numpy as np

# Créer le pipeline ASR avec Whisper
asr = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",
    chunk_length_s=30,          # Découper l'audio en segments de 30s
    return_timestamps=True       # Activer les timestamps
)

# Simuler un fichier audio (en production : charger un vrai fichier)
# Format attendu : tableau numpy float32, sample rate 16kHz
audio_sample = np.random.randn(16000 * 10).astype(np.float32)

# Transcrire avec timestamps
result = asr(audio_sample)

# Afficher la transcription complète
print(f"Texte complet : {result['text']}")

# Afficher les segments avec timestamps
if "chunks" in result:
    for chunk in result["chunks"]:
        start = chunk["timestamp"][0]
        end = chunk["timestamp"][1]
        text = chunk["text"]
        print(f"[{start:.1f}s - {end:.1f}s] {text}")
```

**Résultat attendu** :

```text
Texte complet : [transcription du contenu audio]
[0.0s - 3.2s] Premier segment de texte
[3.2s - 6.8s] Deuxième segment de texte
[6.8s - 10.0s] Troisième segment de texte
```

---

### Étape 2 : Extraire des entités nommées (NER)

```python
import spacy
from transformers import pipeline

# --- Méthode 1 : NER avec spaCy ---
nlp = spacy.load("fr_core_news_sm")

texte = """
Le président Emmanuel Macron a rencontré Angela Merkel à Berlin
le 15 mars 2026. La Commission européenne a publié un rapport
sur l'intelligence artificielle. Google et Microsoft investissent
massivement dans ce domaine.
"""

doc = nlp(texte)

print("=== NER avec spaCy ===")
for ent in doc.ents:
    print(f"  {ent.text:30s} | {ent.label_:10s}")

# --- Méthode 2 : NER avec Transformers (plus précis) ---
ner_pipeline = pipeline(
    "ner",
    model="Jean-Baptiste/camembert-ner",
    aggregation_strategy="simple"  # Regrouper les tokens d'une même entité
)

resultats = ner_pipeline(texte)

print("\n=== NER avec CamemBERT ===")
for entite in resultats:
    print(f"  {entite['word']:30s} | {entite['entity_group']:10s} | score: {entite['score']:.3f}")
```

**Résultat attendu** :

```text
=== NER avec spaCy ===
  Emmanuel Macron                | PER
  Angela Merkel                  | PER
  Berlin                         | LOC
  15 mars 2026                   | DATE
  Commission européenne          | ORG
  Google                         | ORG
  Microsoft                      | ORG

=== NER avec CamemBERT ===
  Emmanuel Macron                | PER        | score: 0.987
  Angela Merkel                  | PER        | score: 0.976
  Berlin                         | LOC        | score: 0.991
  Commission européenne          | ORG        | score: 0.945
  Google                         | ORG        | score: 0.963
  Microsoft                      | ORG        | score: 0.958
```

---

### Étape 3 : Résumer un texte automatiquement

```python
from transformers import pipeline

# Pipeline de résumé abstractif
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

article = """
Artificial intelligence has made significant strides in recent years,
particularly in the field of natural language processing. Large language
models like GPT-4 and Claude have demonstrated remarkable capabilities
in understanding and generating human language. These models are trained
on vast amounts of text data and use transformer architectures with
billions of parameters. The applications range from chatbots and virtual
assistants to code generation and scientific research. However, concerns
about bias, hallucination, and energy consumption remain important
challenges that the research community is actively addressing. Recent
work on efficient training methods, such as mixture of experts and
quantization, aims to reduce the computational cost while maintaining
performance.
"""

# Résumé long
resume_long = summarizer(article, max_length=100, min_length=40, do_sample=False)
print(f"Résumé long :\n{resume_long[0]['summary_text']}\n")

# Résumé court
resume_court = summarizer(article, max_length=40, min_length=15, do_sample=False)
print(f"Résumé court :\n{resume_court[0]['summary_text']}")
```

**Résultat attendu** :

```text
Résumé long :
Artificial intelligence has made significant strides in natural language
processing. Large language models demonstrate remarkable capabilities in
understanding and generating human language. Concerns about bias,
hallucination, and energy consumption remain important challenges.

Résumé court :
AI has advanced in NLP with large language models. Challenges include
bias, hallucination, and energy costs.
```

---

### Étape 4 : Pipeline complet ASR + NER + Résumé

Cette étape combine les trois composants en un seul pipeline.

```python
from transformers import pipeline
import spacy
import numpy as np

def pipeline_complet(audio_array, sample_rate=16000):
    """
    Pipeline complet : Audio -> Texte -> Entités -> Résumé
    """
    # Étape 1 : Transcription (ASR)
    asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")
    transcription = asr(audio_array)["text"]
    print(f"1. TRANSCRIPTION :\n{transcription}\n")

    # Étape 2 : Extraction d'entités (NER)
    nlp = spacy.load("fr_core_news_sm")
    doc = nlp(transcription)
    entites = [(ent.text, ent.label_) for ent in doc.ents]
    print("2. ENTITÉS DÉTECTÉES :")
    for texte, label in entites:
        print(f"   {texte:30s} -> {label}")

    # Étape 3 : Résumé
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    if len(transcription.split()) > 30:
        resume = summarizer(transcription, max_length=60, min_length=20)
        print(f"\n3. RÉSUMÉ :\n{resume[0]['summary_text']}")
    else:
        print(f"\n3. RÉSUMÉ : texte trop court pour être résumé")

    return {
        "transcription": transcription,
        "entites": entites,
    }

# Exemple d'utilisation (avec audio simulé)
audio = np.random.randn(16000 * 15).astype(np.float32)
resultat = pipeline_complet(audio)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install transformers torch torchaudio` | Installe les bibliothèques pour ASR et NLP |
| `pip install spacy` | Installe spaCy pour le NER |
| `python -m spacy download fr_core_news_sm` | Télécharge le modèle français de spaCy |
| `pip install doctr-io` | Installe DocTR pour l'OCR |
| `pipeline("automatic-speech-recognition", model="openai/whisper-small")` | Crée un pipeline ASR Whisper |
| `pipeline("ner", aggregation_strategy="simple")` | Crée un pipeline NER avec regroupement |
| `pipeline("summarization")` | Crée un pipeline de résumé automatique |
| `nlp = spacy.load("fr_core_news_sm")` | Charge le modèle NER français spaCy |

---

## Pièges Fréquents

### Piège 1 : Mauvais sample rate pour Whisper

⚠️ **Problème** : Whisper attend de l'audio à 16 kHz. Si tu fournis de l'audio à 44.1 kHz ou 48 kHz sans le rééchantillonner, la transcription sera incorrecte ou vide.

✅ **Solution** : Toujours rééchantillonner l'audio à 16 kHz avant de le passer à Whisper.

```python
import torchaudio

# Charger l'audio (peut être à 44100 Hz)
waveform, sample_rate = torchaudio.load("audio.wav")

# Rééchantillonner à 16000 Hz si nécessaire
if sample_rate != 16000:
    resampler = torchaudio.transforms.Resample(sample_rate, 16000)
    waveform = resampler(waveform)
```

---

### Piège 2 : NER qui découpe les entités multi-tokens

⚠️ **Problème** : Sans `aggregation_strategy`, le pipeline NER Transformers retourne un label par token, ce qui découpe "New York" en deux entités séparées.

✅ **Solution** : Toujours utiliser `aggregation_strategy="simple"` dans le pipeline NER.

```python
# Sans agrégation : "New" = B-LOC, "York" = I-LOC (séparés)
ner_bad = pipeline("ner")

# Avec agrégation : "New York" = LOC (regroupé)
ner_good = pipeline("ner", aggregation_strategy="simple")
```

---

### Piège 3 : Résumé plus long que le texte source

⚠️ **Problème** : Sur des textes courts (moins de 50 mots), le modèle de résumé peut générer un texte plus long que l'original ou répéter des phrases.

✅ **Solution** : Vérifier la longueur du texte source avant de résumer. Ne résumer que les textes de plus de 100 mots.

```python
texte = "Phrase courte."

if len(texte.split()) > 100:
    resume = summarizer(texte, max_length=60)
else:
    resume = texte  # Pas besoin de résumer
```

---

### Piège 4 : OCR sur des images basse résolution

⚠️ **Problème** : L'OCR produit des résultats très mauvais sur des images en dessous de 150 DPI. Les caractères sont mal reconnus et le texte est incohérent.

✅ **Solution** : S'assurer que les images ont une résolution minimale de 300 DPI. Prétraiter les images (binarisation, débruitage) avant l'OCR.

```python
from PIL import Image, ImageFilter

# Charger et améliorer l'image avant OCR
image = Image.open("document.png")

# Convertir en niveaux de gris
image = image.convert("L")

# Augmenter le contraste par binarisation
image = image.point(lambda x: 0 if x < 128 else 255)

# Agrandir si nécessaire (minimum 300 DPI effectif)
if image.width < 2000:
    scale = 2000 / image.width
    image = image.resize((int(image.width * scale), int(image.height * scale)))
```

---

## Checklist de Validation

- [ ] Je sais transcrire de l'audio en texte avec Whisper
- [ ] Je comprends l'architecture encoder-decoder de Whisper
- [ ] Je sais extraire des entités nommées avec spaCy et Transformers
- [ ] Je comprends le schéma de labelling BIO
- [ ] Je sais résumer un texte avec un modèle BART ou T5
- [ ] Je connais la différence entre résumé extractif et abstractif
- [ ] Je sais combiner ASR, NER et résumé dans un pipeline
- [ ] Je comprends les bases du Document AI (OCR, layout analysis)

---

## Exercice Pratique

**Énoncé** : Crée un pipeline complet qui effectue les opérations suivantes.

1. Charge un fichier audio avec `torchaudio` (ou simule un tableau numpy)
2. Transcrit l'audio en texte avec Whisper
3. Extrait les entités nommées du texte transcrit avec le pipeline NER de Transformers
4. Génère un résumé du texte transcrit si celui-ci fait plus de 50 mots
5. Affiche un rapport structuré avec : la transcription, les entités regroupées par type et le résumé

**Indications** :

- Utilise `pipeline("automatic-speech-recognition", model="openai/whisper-small")` pour la transcription
- Utilise `pipeline("ner", aggregation_strategy="simple")` pour le NER
- Utilise `pipeline("summarization", model="facebook/bart-large-cnn")` pour le résumé
- Regroupe les entités par type dans un dictionnaire `{"PER": [...], "LOC": [...], "ORG": [...]}`

**Résultat attendu** : Un script qui affiche un rapport avec trois sections (Transcription, Entités, Résumé) et gère correctement les textes courts.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
from transformers import pipeline
from collections import defaultdict
import numpy as np

def rapport_complet(audio_array, sample_rate=16000):
    """
    Pipeline complet : Audio -> Texte -> Entités -> Résumé -> Rapport
    """
    # --- Étape 1 : Transcription ASR ---
    asr = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-small"
    )
    result = asr(audio_array)
    transcription = result["text"]

    # --- Étape 2 : NER ---
    ner = pipeline(
        "ner",
        model="Jean-Baptiste/camembert-ner",
        aggregation_strategy="simple"
    )
    entites_raw = ner(transcription)

    # Regrouper les entités par type
    entites_par_type = defaultdict(list)
    for e in entites_raw:
        nom = e["word"]
        type_entite = e["entity_group"]
        score = e["score"]
        # Éviter les doublons
        if nom not in entites_par_type[type_entite]:
            entites_par_type[type_entite].append(nom)

    # --- Étape 3 : Résumé (si texte assez long) ---
    nb_mots = len(transcription.split())
    resume_texte = None
    if nb_mots > 50:
        summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )
        resume = summarizer(
            transcription,
            max_length=80,
            min_length=20,
            do_sample=False
        )
        resume_texte = resume[0]["summary_text"]

    # --- Affichage du rapport ---
    print("=" * 60)
    print("RAPPORT D'ANALYSE AUDIO")
    print("=" * 60)

    print(f"\n1. TRANSCRIPTION ({nb_mots} mots) :")
    print(f"   {transcription}")

    print(f"\n2. ENTITÉS NOMMÉES ({len(entites_raw)} détectées) :")
    for type_e, noms in entites_par_type.items():
        print(f"   [{type_e}] : {', '.join(noms)}")

    if resume_texte:
        print(f"\n3. RÉSUMÉ :")
        print(f"   {resume_texte}")
    else:
        print(f"\n3. RÉSUMÉ : texte trop court ({nb_mots} mots, minimum 50)")

    print("\n" + "=" * 60)

    return {
        "transcription": transcription,
        "entites": dict(entites_par_type),
        "resume": resume_texte,
    }


# --- Exécution ---
# Simuler 20 secondes d'audio à 16kHz
audio = np.random.randn(16000 * 20).astype(np.float32)
resultat = rapport_complet(audio)
```

**Résultat** :

```text
============================================================
RAPPORT D'ANALYSE AUDIO
============================================================

1. TRANSCRIPTION (87 mots) :
   [Texte transcrit par Whisper]

2. ENTITÉS NOMMÉES (5 détectées) :
   [PER] : Emmanuel Macron, Angela Merkel
   [LOC] : Paris, Berlin
   [ORG] : Commission européenne

3. RÉSUMÉ :
   [Résumé généré par BART]

============================================================
```

---

## Navigation

← Fiche précédente : **[01 - Computer vision avancée](01-computer-vision-avancee.md)**

→ Fiche suivante : **[03 - Reinforcement learning](03-reinforcement-learning.md)**
