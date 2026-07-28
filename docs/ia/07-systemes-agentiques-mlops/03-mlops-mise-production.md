---
tags:
  - IA
  - Avancé
  - Pratique
description: "MLOps et mise en production : MLflow, serving FastAPI/TorchServe, conteneurisation ML, CI/CD et monitoring"
estimated_time: "45 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 7 - Systèmes agentiques et MLOps"
---

# 03 - MLOps et mise en production

> **En bref** : À la fin de cette fiche, tu sauras mettre un modèle ML en production avec MLflow (tracking, registry, serving), exposer un modèle via FastAPI, conteneuriser un service ML avec Docker, et mettre en place un monitoring de data drift et model drift. Lecture estimée : 45 min.


## Prérequis

- [Phase 3 - scikit-learn](../03-machine-learning-classique/04-scikit-learn-profondeur.md) (entraînement, évaluation, pipelines)
- [Phase 4 - PyTorch](../04-deep-learning-fondamental/01-reseaux-neurones-theorie-pratique.md) (réseaux de neurones, entraînement, sauvegarde de modèles)
- Connaissances en Docker (images, conteneurs, volumes)
- Python 3 installé sur ta machine
- `pip install mlflow fastapi uvicorn scikit-learn torch`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras mettre un modèle ML en production avec MLflow (tracking, registry, serving), exposer un modèle via FastAPI, conteneuriser un service ML avec Docker, et mettre en place un monitoring de data drift et model drift.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que MLflow ?

**Définition** : MLflow est une plateforme open source pour gérer le cycle de vie complet des modèles ML. Elle fournit quatre composants : Tracking (enregistrer les expériences), Models (empaqueter les modèles), Model Registry (versionner et déployer les modèles), et Projects (définir des environnements reproductibles).

**Le problème que MLflow résout** :

Sans MLflow, voici les problèmes rencontrés :

1. **Expériences non tracées** : impossible de retrouver les hyperparamètres et métriques d'un entraînement passé
2. **Modèles non versionnés** : quel modèle est en production ? Quelle version a donné les meilleurs résultats ?
3. **Reproductibilité impossible** : refaire un entraînement identique nécessite de retrouver manuellement la configuration exacte
4. **Déploiement artisanal** : chaque projet invente son propre système de mise en production

**Comment MLflow résout ces problèmes** :

| Problème | Solution apportée par MLflow |
| -------- | ---------------------------- |
| Expériences non tracées | MLflow Tracking enregistre paramètres, métriques et artefacts automatiquement |
| Modèles non versionnés | Le Model Registry versionne chaque modèle avec des tags (staging, production) |
| Reproductibilité impossible | MLflow Projects définit l'environnement et les commandes d'entraînement |
| Déploiement artisanal | MLflow Models empaquette le modèle avec son code de prédiction |

**Analogie concrète** : MLflow est comme un cahier de laboratoire numérique pour un chercheur. Il enregistre chaque expérience (paramètres, résultats, artefacts), permet de retrouver n'importe quelle expérience passée, et stocke les meilleurs résultats dans une vitrine (registry) pour les utiliser en production.

**Ce que MLflow n'est PAS** :

- MLflow n'est pas un outil d'entraînement. Il ne remplace pas PyTorch ou scikit-learn. Il enregistre et organise les résultats des entraînements effectués avec ces outils.
- MLflow n'est pas un orchestrateur de pipelines. Il ne planifie pas l'exécution de tâches (contrairement à Airflow ou Kubeflow Pipelines). Il gère le cycle de vie des modèles.

---

### Qu'est-ce que le model serving ?

**Définition** : Le model serving consiste à exposer un modèle ML entraîné via une API (typiquement REST ou gRPC) pour que d'autres applications puissent envoyer des données et recevoir des prédictions en temps réel ou en batch.

**Le problème que le model serving résout** :

Sans model serving, voici les problèmes rencontrés :

1. **Modèle isolé** : le modèle entraîné reste dans un notebook Jupyter, inaccessible aux autres applications
2. **Pas de prédiction en temps réel** : l'application web ne peut pas obtenir une prédiction à la volée
3. **Pas de scalabilité** : un script Python local ne gère pas des centaines de requêtes simultanées

**Comment le model serving résout ces problèmes** :

| Problème | Solution apportée par le model serving |
| -------- | -------------------------------------- |
| Modèle isolé | Le modèle est accessible via une URL (API REST) |
| Pas de prédiction en temps réel | L'API répond en millisecondes à chaque requête |
| Pas de scalabilité | Le serveur peut être répliqué derrière un load balancer |

**Analogie concrète** : Le model serving est comme passer d'un cuisinier qui cuisine uniquement chez lui (notebook) à un restaurant ouvert au public (API). Le cuisinier utilise les mêmes recettes (modèle), mais maintenant n'importe qui peut commander un plat (envoyer une requête) et recevoir le résultat (prédiction).

**Ce que le model serving n'est PAS** :

- Le model serving n'est pas le réentraînement. Servir un modèle signifie utiliser un modèle déjà entraîné pour faire des prédictions. L'entraînement se fait séparément.
- Le model serving n'est pas limité au temps réel. Il peut aussi fonctionner en mode batch (traiter un fichier de données d'un coup).

**Comparaison des outils de serving** :

| Outil | Type de modèle | Avantage principal | Complexité |
| ----- | -------------- | ------------------ | ---------- |
| FastAPI | Tout modèle Python | Simple, flexible, Pythonique | Faible |
| TorchServe | PyTorch | Optimisé pour PyTorch, batching natif | Moyenne |
| vLLM | LLM (Transformers) | Optimisé pour l'inférence LLM (PagedAttention) | Moyenne |
| TensorFlow Serving | TensorFlow | Haute performance, gRPC | Élevée |
| Triton | Multi-framework | GPU, multi-modèle, batching dynamique | Élevée |

---

### Qu'est-ce que la conteneurisation ML ?

**Définition** : La conteneurisation ML consiste à empaqueter un modèle ML, son code de prédiction et toutes ses dépendances (bibliothèques Python, poids du modèle) dans un conteneur Docker. Le conteneur est une image autonome qui fonctionne de façon identique sur toute machine.

**Le problème que la conteneurisation ML résout** :

Sans conteneurisation, voici les problèmes rencontrés :

1. **Dépendances incompatibles** : le modèle fonctionne avec PyTorch 2.1 sur la machine de développement mais le serveur a PyTorch 1.9
2. **Installation complexe** : installer CUDA, cuDNN, PyTorch et toutes les dépendances prend des heures
3. **Environnement non reproductible** : "ça marche sur ma machine" mais pas en production

**Comment la conteneurisation ML résout ces problèmes** :

| Problème | Solution apportée par la conteneurisation |
| -------- | ----------------------------------------- |
| Dépendances incompatibles | Le conteneur embarque les versions exactes de toutes les dépendances |
| Installation complexe | `docker pull` et `docker run` suffisent pour démarrer le service |
| Environnement non reproductible | Le même conteneur fonctionne sur le laptop, le serveur et le cloud |

**Analogie concrète** : La conteneurisation ML est comme emballer un plat cuisiné sous vide. Le plat (modèle), les ingrédients (dépendances) et les instructions de réchauffage (code de serving) sont dans un seul emballage. N'importe qui peut ouvrir l'emballage et servir le plat, sans avoir besoin de connaître la recette originale.

**Ce que la conteneurisation ML n'est PAS** :

- La conteneurisation n'est pas une optimisation du modèle. Mettre un modèle dans Docker ne le rend pas plus rapide. L'optimisation (quantization, TensorRT) est une étape séparée.
- La conteneurisation n'est pas obligatoire. Pour un prototype ou un modèle local, un script Python suffit. La conteneurisation devient nécessaire pour la production.

---

### Qu'est-ce que le CI/CD pour ML ?

**Définition** : Le CI/CD pour ML est l'adaptation des pratiques d'intégration continue (CI) et de déploiement continu (CD) au machine learning. En plus du code, le CI/CD ML teste les données, valide le modèle et automatise le déploiement des nouvelles versions de modèles.

**Le problème que le CI/CD ML résout** :

Sans CI/CD ML, voici les problèmes rencontrés :

1. **Tests manuels** : vérifier la qualité du modèle à la main à chaque modification est long et sujet aux erreurs
2. **Déploiement risqué** : pousser un nouveau modèle en production sans tests automatisés peut casser le service
3. **Pas de validation des données** : un changement dans le format des données d'entrée n'est pas détecté

**Comment le CI/CD ML résout ces problèmes** :

| Problème | Solution apportée par le CI/CD ML |
| -------- | --------------------------------- |
| Tests manuels | Des tests automatisés vérifient le modèle à chaque commit |
| Déploiement risqué | Le pipeline déploie automatiquement seulement si tous les tests passent |
| Pas de validation des données | Des tests de schéma et de distribution valident les données d'entrée |

**Analogie concrète** : Le CI/CD ML est comme le contrôle qualité sur une chaîne de production automobile. Chaque voiture (modèle) passe par des tests automatisés (crash test, contrôle technique) avant d'être livrée au client. Si un test échoue, la voiture est renvoyée en usine pour correction.

**Ce que le CI/CD ML n'est PAS** :

- Le CI/CD ML n'est pas identique au CI/CD logiciel classique. En plus du code, il faut tester les données et le modèle. Le code peut être correct mais le modèle peut être mauvais.
- Le CI/CD ML ne remplace pas le monitoring. Le CI/CD vérifie avant le déploiement. Le monitoring surveille après le déploiement.

**Types de tests en CI/CD ML** :

| Test | Ce qu'il vérifie | Exemple |
| ---- | ---------------- | ------- |
| Test de données | Schéma, valeurs manquantes, distribution | Vérifier que toutes les colonnes sont présentes |
| Test de modèle | Performance sur un golden set | Accuracy >= 95% sur le jeu de test |
| Test d'intégration | L'API de serving fonctionne correctement | POST /predict retourne une réponse valide |
| Test de non-régression | Le nouveau modèle n'est pas pire que l'ancien | Score >= score du modèle en production |

---

### Qu'est-ce que le monitoring ML ?

**Définition** : Le monitoring ML est la surveillance continue d'un modèle en production pour détecter les dégradations de performance. Il surveille deux types de dérive : le data drift (les données d'entrée changent) et le model drift (les prédictions du modèle se dégradent).

**Le problème que le monitoring ML résout** :

Sans monitoring, voici les problèmes rencontrés :

1. **Dégradation silencieuse** : le modèle perd en précision progressivement sans que personne ne le remarque
2. **Données qui changent** : les habitudes des utilisateurs évoluent, les données ne ressemblent plus aux données d'entraînement
3. **Pas d'alerte** : quand le modèle fait des erreurs graves, personne n'est prévenu

**Comment le monitoring ML résout ces problèmes** :

| Problème | Solution apportée par le monitoring ML |
| -------- | -------------------------------------- |
| Dégradation silencieuse | Des métriques de performance sont suivies en temps réel |
| Données qui changent | Des tests statistiques détectent le data drift automatiquement |
| Pas d'alerte | Des seuils configurables déclenchent des alertes |

**Analogie concrète** : Le monitoring ML est comme un tableau de bord de voiture. Le compteur de vitesse (latence), la jauge d'essence (utilisation mémoire), le témoin de pression des pneus (data drift) et le témoin moteur (model drift) t'alertent avant qu'un problème grave ne survienne.

**Ce que le monitoring ML n'est PAS** :

- Le monitoring ML n'est pas du monitoring d'infrastructure. Le monitoring d'infrastructure surveille le CPU, la RAM et le réseau. Le monitoring ML surveille la qualité des prédictions et des données.
- Le monitoring ML ne corrige pas les problèmes. Il détecte et alerte. La correction (réentraînement, mise à jour des données) est une action séparée.

**Types de drift** :

| Type | Description | Détection |
| ---- | ----------- | --------- |
| Data drift | La distribution des données d'entrée change | Test de Kolmogorov-Smirnov, PSI (Population Stability Index) |
| Concept drift | La relation entre les entrées et la sortie change | Mesurer la performance sur des données récentes |
| Model drift | Les prédictions du modèle se dégradent | Comparer les métriques (accuracy, F1) dans le temps |

---

## Étapes Pratiques

### Étape 1 : Configurer MLflow et tracker un entraînement

Crée un fichier `mlops_pipeline.py`.

```python
# mlops_pipeline.py
import mlflow
import mlflow.sklearn
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

# Démarrer le serveur de tracking MLflow (dans un terminal séparé) :
# mlflow server --host 0.0.0.0 --port 5000

# Configurer l'URI du serveur MLflow
mlflow.set_tracking_uri("http://localhost:5000")

# Créer une expérience
mlflow.set_experiment("iris-classification")

# Charger les données
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Entraîner avec tracking MLflow
with mlflow.start_run(run_name="random_forest_v1"):
    # Définir les hyperparamètres
    n_estimators = 100
    max_depth = 5

    # Logger les hyperparamètres
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_depth", max_depth)
    mlflow.log_param("test_size", 0.2)
    mlflow.log_param("random_state", 42)

    # Entraîner le modèle
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Prédire et évaluer
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="weighted")

    # Logger les métriques
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("f1_score", f1)

    # Logger le modèle (argument `name` : nom de l'artefact dans le run)
    mlflow.sklearn.log_model(model, name="model")

    print(f"Accuracy : {accuracy:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"Run ID : {mlflow.active_run().info.run_id}")
```

**Résultat attendu** :

```text
Accuracy : 1.0000
F1 Score : 1.0000
Run ID : abc123def456...
```

---

### Étape 2 : Enregistrer le modèle dans le Model Registry

```python
import mlflow

# Récupérer le run_id du dernier entraînement
# On utilise mlflow.last_active_run() car le bloc "with mlflow.start_run()"
# est terminé à ce stade
last_run = mlflow.last_active_run()
run_id = last_run.info.run_id

# Enregistrer le modèle dans le registry
model_uri = f"runs:/{run_id}/model"
model_version = mlflow.register_model(model_uri, "iris-classifier")

print(f"Modèle enregistré : {model_version.name} v{model_version.version}")

# Promouvoir en production avec un alias (méthode recommandée)
client = mlflow.tracking.MlflowClient()
client.set_registered_model_alias(
    name="iris-classifier",
    alias="production",
    version=model_version.version
)

print(f"Modèle promu en Production")
```

**Résultat attendu** :

```text
Modèle enregistré : iris-classifier v1
Modèle promu en Production
```

---

### Étape 3 : Créer une API de serving avec FastAPI

Crée un fichier `serve_model.py`.

```python
# serve_model.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mlflow.sklearn
import numpy as np

# Charger le modèle au démarrage
MODEL = None
CLASS_NAMES = ["setosa", "versicolor", "virginica"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Cycle de vie de l'application : code avant le `yield` exécuté au
    démarrage, code après le `yield` exécuté à l'arrêt. Remplace les
    handlers `@app.on_event(...)` dépréciés dans FastAPI récent."""
    global MODEL
    # Charger le modèle en production depuis le registry (via l'alias)
    MODEL = mlflow.sklearn.load_model("models:/iris-classifier@production")
    print("Modèle chargé depuis MLflow")
    yield
    # Code de nettoyage à l'arrêt (rien à libérer ici)


# Le lifespan est passé à l'application au moment de sa création
app = FastAPI(title="ML Model API", version="1.0", lifespan=lifespan)


# Schéma de la requête
class PredictionRequest(BaseModel):
    features: list[float]  # 4 features pour Iris


# Schéma de la réponse
class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    class_name: str


@app.get("/health")
def health():
    """Endpoint de healthcheck."""
    return {"status": "ok", "model_loaded": MODEL is not None}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """Effectue une prédiction."""
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")

    # Vérifier le nombre de features
    if len(request.features) != 4:
        raise HTTPException(
            status_code=400,
            detail=f"4 features attendues, {len(request.features)} reçues"
        )

    # Prédire
    features = np.array(request.features).reshape(1, -1)
    prediction = int(MODEL.predict(features)[0])
    probability = float(MODEL.predict_proba(features).max())

    return PredictionResponse(
        prediction=prediction,
        probability=probability,
        class_name=CLASS_NAMES[prediction]
    )


# Démarrer avec : uvicorn serve_model:app --host 0.0.0.0 --port 8000
```

Pour lancer le serveur :

```bash
# Démarrer l'API de serving
uvicorn serve_model:app --host 0.0.0.0 --port 8000
```

Pour tester l'API :

```bash
# Test du healthcheck
curl http://localhost:8000/health

# Test de prédiction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

**Résultat attendu** :

```json
{
  "prediction": 0,
  "probability": 0.98,
  "class_name": "setosa"
}
```

---

### Étape 4 : Conteneuriser le service ML avec Docker

Crée un fichier `Dockerfile`.

```dockerfile
# Image de base Python
FROM python:3.11-slim

# Répertoire de travail
WORKDIR /app

# Copier les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY serve_model.py .

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "serve_model:app", "--host", "0.0.0.0", "--port", "8000"]
```

Crée le fichier `requirements.txt` :

```text
fastapi==0.115.0
uvicorn==0.30.0
mlflow==2.16.0
scikit-learn==1.5.0
numpy==1.26.0
```

```bash
# Construire l'image Docker
docker build -t ml-serving:v1 .

# Lancer le conteneur
docker run -d --name ml-api -p 8000:8000 ml-serving:v1

# Vérifier que le conteneur fonctionne
curl http://localhost:8000/health
```

**Résultat attendu** :

```json
{"status": "ok", "model_loaded": true}
```

---

### Étape 5 : Implémenter le monitoring de data drift

```python
# monitoring.py
import numpy as np
from scipy import stats


def detect_data_drift(reference_data, current_data, threshold=0.05):
    """Détecte le data drift avec le test de Kolmogorov-Smirnov.

    Args:
        reference_data: données d'entraînement (array n_samples x n_features)
        current_data: données récentes en production (array n_samples x n_features)
        threshold: seuil de p-value pour détecter un drift (défaut: 0.05)

    Returns:
        dict avec les résultats par feature
    """
    n_features = reference_data.shape[1]
    results = {}

    for i in range(n_features):
        # Test de Kolmogorov-Smirnov pour chaque feature
        statistic, p_value = stats.ks_2samp(
            reference_data[:, i],
            current_data[:, i]
        )

        drift_detected = p_value < threshold
        results[f"feature_{i}"] = {
            "statistic": round(statistic, 4),
            "p_value": round(p_value, 4),
            "drift_detected": drift_detected
        }

    # Résumé global
    n_drifted = sum(1 for r in results.values() if r["drift_detected"])
    results["summary"] = {
        "total_features": n_features,
        "drifted_features": n_drifted,
        "global_drift": n_drifted > 0
    }

    return results


# Exemple d'utilisation
np.random.seed(42)

# Données de référence (entraînement)
reference = np.random.randn(1000, 4)

# Données actuelles (production) - avec drift sur la feature 2
current = np.random.randn(200, 4)
current[:, 2] += 1.5  # Ajout d'un décalage sur la feature 2

# Détecter le drift
drift_results = detect_data_drift(reference, current)

print("=== Résultats du Monitoring ===")
for feature, result in drift_results.items():
    if feature == "summary":
        print(f"\nRésumé : {result['drifted_features']}/{result['total_features']} features en drift")
        if result["global_drift"]:
            print("ALERTE : Data drift détecté !")
    else:
        status = "DRIFT" if result["drift_detected"] else "OK"
        print(f"  {feature} : p={result['p_value']:.4f} [{status}]")
```

**Résultat attendu** :

```text
=== Résultats du Monitoring ===
  feature_0 : p=0.5432 [OK]
  feature_1 : p=0.3211 [OK]
  feature_2 : p=0.0000 [DRIFT]
  feature_3 : p=0.4567 [OK]

Résumé : 1/4 features en drift
ALERTE : Data drift détecté !
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `mlflow server --host 0.0.0.0 --port 5000` | Démarrer le serveur MLflow |
| `mlflow.log_param("key", value)` | Logger un hyperparamètre |
| `mlflow.log_metric("key", value)` | Logger une métrique |
| `mlflow.sklearn.log_model(model, name="model")` | Logger un modèle scikit-learn |
| `mlflow.register_model(uri, name)` | Enregistrer dans le Model Registry |
| `uvicorn app:app --host 0.0.0.0 --port 8000` | Démarrer FastAPI |
| `docker build -t name:tag .` | Construire une image Docker |
| `docker run -d -p 8000:8000 name:tag` | Lancer un conteneur |

---

## Pièges Fréquents

### Piège 1 : Ne pas versionner les données avec le modèle

⚠️ **Problème** : Versionner le modèle sans les données d'entraînement rend impossible la reproduction exacte de l'entraînement.

✅ **Solution** : Logge le hash du dataset avec `mlflow.log_param("data_hash", hashlib.md5(data).hexdigest())`. Utilise un outil de versionnement de données comme DVC pour les gros datasets.

---

### Piège 2 : Oublier le healthcheck dans l'API de serving

⚠️ **Problème** : Sans endpoint de healthcheck, le load balancer ne sait pas si le service est opérationnel et envoie du trafic à un conteneur défaillant.

✅ **Solution** : Implémente toujours un endpoint `/health` qui vérifie que le modèle est chargé et fonctionnel.

```python
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": MODEL is not None,
        "version": "1.0.0"
    }
```

---

### Piège 3 : Ne pas tester le modèle dans le pipeline CI/CD

⚠️ **Problème** : Tester uniquement le code (linting, tests unitaires) sans tester la qualité du modèle laisse passer des régressions de performance.

✅ **Solution** : Ajoute un test de non-régression dans le pipeline CI/CD qui évalue le modèle sur un golden set et vérifie que les métriques sont au-dessus du seuil minimum.

---

### Piège 4 : Ignorer le data drift en production

⚠️ **Problème** : Le modèle a une accuracy de 95% au déploiement mais chute à 70% après 3 mois parce que les données ont changé. Personne ne le remarque.

✅ **Solution** : Configure un monitoring de data drift avec des alertes automatiques. Planifie un réentraînement périodique ou déclenché par un drift détecté.

---

## Checklist de Validation

- [ ] Je sais configurer et utiliser MLflow Tracking pour enregistrer des expériences
- [ ] Je sais enregistrer un modèle dans le MLflow Model Registry
- [ ] Je sais créer une API de serving avec FastAPI (endpoints /health et /predict)
- [ ] Je sais conteneuriser un service ML avec Docker
- [ ] Je comprends les types de tests en CI/CD ML (données, modèle, intégration, non-régression)
- [ ] Je sais détecter le data drift avec le test de Kolmogorov-Smirnov
- [ ] Je comprends la différence entre data drift, concept drift et model drift

---

## Exercice Pratique

**Énoncé** : Construis un pipeline MLOps complet pour un modèle de classification.

1. Entraîne un modèle scikit-learn sur le dataset Iris avec tracking MLflow (paramètres, métriques, modèle)
2. Enregistre le meilleur modèle dans le Model Registry et promeus-le en Production
3. Crée une API FastAPI avec les endpoints `/health` et `/predict`
4. Conteneurise l'API dans un Docker
5. Implémente un script de monitoring qui détecte le data drift

**Indications** :

- Utilise `mlflow.set_tracking_uri()` pour pointer vers le serveur local
- L'endpoint `/predict` doit retourner la prédiction, la probabilité et le nom de la classe
- Le Dockerfile doit utiliser `python:3.11-slim` comme image de base
- Pour le monitoring, simule un drift en décalant une feature des données de test

**Résultat attendu** : Un service ML conteneurisé accessible via API, avec tracking MLflow et monitoring de data drift.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# solution_mlops.py - Pipeline MLOps complet
import mlflow
import mlflow.sklearn
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from scipy import stats

# --- Étape 1 : Entraînement avec tracking MLflow ---
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("iris-mlops-exercice")

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Tester plusieurs configurations
configs = [
    {"n_estimators": 50, "max_depth": 3},
    {"n_estimators": 100, "max_depth": 5},
    {"n_estimators": 200, "max_depth": 10},
]

best_run_id = None
best_accuracy = 0

for config in configs:
    with mlflow.start_run(run_name=f"rf_n{config['n_estimators']}_d{config['max_depth']}"):
        mlflow.log_params(config)

        model = RandomForestClassifier(**config, random_state=42)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average="weighted")

        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("f1_score", f1)
        mlflow.sklearn.log_model(model, name="model")

        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_run_id = mlflow.active_run().info.run_id

        print(f"Config {config} -> Accuracy: {accuracy:.4f}")

# --- Étape 2 : Registry ---
model_version = mlflow.register_model(f"runs:/{best_run_id}/model", "iris-classifier")
client = mlflow.tracking.MlflowClient()
client.set_registered_model_alias(
    name="iris-classifier",
    alias="production",
    version=model_version.version
)
print(f"\nMeilleur modèle (v{model_version.version}) promu en Production")

# --- Étape 5 : Monitoring ---
print("\n=== Monitoring Data Drift ===")
reference = X_train
current = X_test.copy()
current[:, 2] += 2.0  # Simuler un drift

for i in range(X_train.shape[1]):
    stat, p_value = stats.ks_2samp(reference[:, i], current[:, i])
    status = "DRIFT" if p_value < 0.05 else "OK"
    print(f"  Feature {i} : p={p_value:.4f} [{status}]")
```

Pour l'API FastAPI et le Dockerfile, reprends le code des étapes 3 et 4 ci-dessus.

---

## Navigation

← Fiche précédente : **[02 - Frameworks d'agents](02-frameworks-agents.md)**

→ Fiche suivante : **[04 - LLMOps : spécificités de la production LLM](04-llmops-specificites-production.md)**
