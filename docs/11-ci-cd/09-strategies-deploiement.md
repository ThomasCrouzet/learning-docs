---
tags:
  - CI/CD
  - Avancé
  - Concept
description: "Comprendre et implémenter les stratégies de déploiement : blue-green, canary et rolling update"
estimated_time: "75 min"
fiche_number: 9
total_fiches: 10
cursus: "CI/CD Pipelines"
---

# 09 - Stratégies de déploiement

> **En bref** : Cette fiche t'apprend les trois principales stratégies de déploiement (blue-green, canary, rolling update), leurs avantages et inconvénients, et comment les implémenter dans un pipeline CI/CD. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [08 - Exécution locale des pipelines](08-execution-locale-pipelines.md)
- Comprendre le fonctionnement d'un pipeline CI/CD complet (lint, test, build, deploy)
- Avoir Docker installé et fonctionnel sur ton ordinateur
- Connaître les bases de Docker Compose (services, réseaux, volumes)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les trois stratégies de déploiement principales (blue-green, canary, rolling update), choisir la stratégie adaptée à ton projet, implémenter chaque stratégie avec Docker Compose, et configurer un pipeline CI/CD qui utilise ces stratégies.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi une stratégie de déploiement ?

**Définition** : Une stratégie de déploiement est un plan qui définit comment une nouvelle version d'une application remplace l'ancienne version en production. L'objectif est de minimiser les interruptions de service et de permettre un retour en arrière rapide en cas de problème.

**Le problème que les stratégies de déploiement résolvent** :

Sans stratégie de déploiement, voici les problèmes rencontrés :

1. **Interruption de service** : Tu arrêtes l'ancienne version, puis tu démarres la nouvelle. Pendant ce temps, l'application est inaccessible. Les utilisateurs voient une page d'erreur.

2. **Retour en arrière difficile** : La nouvelle version contient un bug critique. Tu dois redéployer l'ancienne version manuellement. Le processus prend 30 minutes. Pendant ce temps, les utilisateurs sont impactés.

3. **Pas de validation en production** : La nouvelle version fonctionne en staging, mais pas en production (données différentes, charge différente). Tu découvres les problèmes seulement quand tous les utilisateurs sont impactés.

**Comment les stratégies de déploiement résolvent ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Interruption de service | Les deux versions coexistent pendant la transition, aucune coupure |
| Retour en arrière difficile | L'ancienne version est toujours disponible, le rollback prend quelques secondes |
| Pas de validation en production | On peut tester la nouvelle version avec un petit pourcentage d'utilisateurs avant de généraliser |

**Analogie concrète** : Imagine un restaurant qui rénove sa cuisine. Le déploiement naïf consiste à fermer le restaurant pendant les travaux. Les stratégies de déploiement sont comme des solutions pour continuer à servir les clients pendant la rénovation : installer une cuisine temporaire à côté (blue-green), servir quelques plats de la nouvelle cuisine en test (canary), ou remplacer les équipements un par un sans jamais fermer (rolling update).

---

### Qu'est-ce que le déploiement blue-green ?

**Définition** : Le déploiement blue-green utilise deux environnements identiques : "blue" (la version actuelle en production) et "green" (la nouvelle version). Le trafic est basculé de blue vers green en une seule opération. Si un problème survient, on rebascule vers blue.

**Le problème que le blue-green résout** :

Sans blue-green, voici les problèmes rencontrés :

1. **Downtime lors du déploiement** : L'ancienne version est arrêtée avant que la nouvelle ne soit prête.

2. **Rollback lent** : En cas de bug, tu dois redéployer l'ancienne version, ce qui prend du temps.

**Comment le blue-green résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Downtime | Les deux versions tournent en même temps, le basculement est instantané |
| Rollback lent | L'ancienne version est toujours en cours d'exécution, le rollback est un simple changement de routage |

**Schéma du blue-green** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-09-strategies-deploiement-1.html">Qu&#x27;est-ce que le déploiement blue-green ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-09-strategies-deploiement-1.html" title="Qu&#x27;est-ce que le déploiement blue-green ?" style="width:100%;min-height:656px;border:0;background:transparent"></iframe>
</div>

Le basculement est instantané : le Load Balancer redirige 100% du trafic de Blue vers Green. En cas de problème, le rollback est tout aussi instantané.

**Ce que le blue-green n'est PAS** :

- Le blue-green n'est pas un système de test. Les deux environnements sont des environnements de production. Le test se fait avant le basculement.
- Le blue-green ne résout pas les problèmes de migration de base de données. Si la v2.0 modifie le schéma de la base, un rollback vers la v1.0 peut ne pas fonctionner. Les migrations doivent être rétrocompatibles.

---

### Qu'est-ce que le déploiement canary ?

**Définition** : Le déploiement canary consiste à déployer la nouvelle version sur un petit pourcentage de l'infrastructure (par exemple 5%), puis à augmenter progressivement ce pourcentage si tout se passe bien. Le nom vient des canaris utilisés dans les mines pour détecter les gaz toxiques.

**Le problème que le canary résout** :

Sans canary, voici les problèmes rencontrés :

1. **Tout ou rien** : La nouvelle version est déployée sur 100% des serveurs d'un coup. Si un bug existe, il impacte tous les utilisateurs.

2. **Pas de mesure en production** : Tu ne sais pas comment la nouvelle version se comporte en production avant de la déployer pour tout le monde.

**Comment le canary résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Tout ou rien | Seulement 5% des utilisateurs voient la nouvelle version au début |
| Pas de mesure en production | Tu mesures les métriques (erreurs, latence) sur le canary avant de généraliser |

**Schéma du canary** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-09-strategies-deploiement-2.html">Qu&#x27;est-ce que le déploiement canary ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-09-strategies-deploiement-2.html" title="Qu&#x27;est-ce que le déploiement canary ?" style="width:100%;min-height:640px;border:0;background:transparent"></iframe>
</div>

À chaque phase, les métriques (erreurs, latence) sont mesurées sur le canary. Si un problème est détecté, le canary est retiré et 100% du trafic revient sur v1.0.

**Ce que le canary n'est PAS** :

- Le canary n'est pas un test A/B. Un test A/B compare deux fonctionnalités pour mesurer laquelle est meilleure. Le canary valide que la nouvelle version fonctionne correctement avant de la déployer pour tous.
- Le canary ne remplace pas les tests automatisés. Il complète les tests en ajoutant une validation en conditions réelles.

**Comparaison canary vs test A/B** :

| Canary | Test A/B |
| --- | --- |
| Valide la stabilité technique | Compare des fonctionnalités |
| Temporaire (quelques heures) | Long terme (jours ou semaines) |
| Même fonctionnalité, version différente | Fonctionnalités différentes, même version |
| Critères : erreurs, latence | Critères : conversion, engagement |

---

### Qu'est-ce que le rolling update ?

**Définition** : Le rolling update (mise à jour progressive) remplace les instances de l'ancienne version par la nouvelle version une par une. À chaque instant, certaines instances exécutent l'ancienne version et d'autres exécutent la nouvelle.

**Le problème que le rolling update résout** :

Sans rolling update, voici les problèmes rencontrés :

1. **Besoin de double infrastructure** : Le blue-green nécessite deux environnements complets. Cela double les coûts d'infrastructure.

2. **Complexité du routage** : Le canary nécessite un load balancer capable de répartir le trafic par pourcentage.

**Comment le rolling update résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Double infrastructure | Le rolling update réutilise les mêmes serveurs, il remplace une instance à la fois |
| Complexité du routage | Pas besoin de routage par pourcentage, le load balancer répartit naturellement le trafic |

**Schéma du rolling update** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-09-strategies-deploiement-3.html">Qu&#x27;est-ce que le rolling update ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-09-strategies-deploiement-3.html" title="Qu&#x27;est-ce que le rolling update ?" style="width:100%;min-height:640px;border:0;background:transparent"></iframe>
</div>

Les instances sont remplacées une par une. Les deux versions coexistent pendant la transition. C'est pourquoi elles doivent être compatibles entre elles.

**Ce que le rolling update n'est PAS** :

- Le rolling update ne permet pas un rollback instantané. Si un problème est détecté à la phase 2, les instances déjà mises à jour doivent être redéployées en v1.0.
- Le rolling update n'est pas adapté aux changements incompatibles. Pendant la transition, les deux versions coexistent. Elles doivent pouvoir fonctionner ensemble (API compatible, schéma de base de données compatible).

---

### Comparaison des trois stratégies

| Critère | Blue-Green | Canary | Rolling Update |
| --- | --- | --- | --- |
| Downtime | Aucun | Aucun | Aucun |
| Rollback | Instantané | Rapide (retirer le canary) | Lent (redéployer les instances) |
| Coût infrastructure | Élevé (double) | Moyen (1 instance en plus) | Faible (même infrastructure) |
| Complexité | Faible | Moyenne (routage pondéré) | Faible |
| Validation en production | Non (tout ou rien) | Oui (progressive) | Partielle (coexistence) |
| Adapté pour | Applications critiques | Applications web à fort trafic | Applications avec plusieurs instances |

**Comment choisir ?**

- **Blue-green** : tu as les ressources pour doubler l'infrastructure et tu veux un rollback instantané. Idéal pour les applications critiques.
- **Canary** : tu veux valider la nouvelle version en conditions réelles avant de la déployer pour tous. Idéal pour les applications web à fort trafic.
- **Rolling update** : tu as plusieurs instances et tu veux un déploiement simple sans surcoût d'infrastructure. C'est la stratégie la plus courante.

---

### Qu'est-ce qu'un health check ?

**Définition** : Un health check (vérification de santé) est un endpoint HTTP que l'application expose pour indiquer si elle fonctionne correctement. Le load balancer interroge ce endpoint régulièrement pour savoir s'il peut envoyer du trafic à cette instance.

**Le problème que les health checks résolvent** :

Sans health check, le load balancer envoie du trafic à une instance qui est en train de démarrer ou qui a planté. Les utilisateurs reçoivent des erreurs.

**Deux types de health checks** :

| Type | Rôle | Exemple |
| --- | --- | --- |
| **Liveness** | L'application est-elle vivante ? | Retourne 200 si le processus PHP tourne |
| **Readiness** | L'application est-elle prête à recevoir du trafic ? | Retourne 200 si la base de données est connectée et le cache chargé |

**Analogie concrète** : Imagine un restaurant. Le health check "liveness" vérifie que le restaurant est ouvert (lumières allumées, porte ouverte). Le health check "readiness" vérifie que le restaurant est prêt à servir (cuisine opérationnelle, serveurs en place, plats disponibles). Un restaurant peut être ouvert mais pas encore prêt à servir (le cuisinier n'est pas arrivé).

---

## Étapes Pratiques

### Étape 1 : Créer une application web simple pour les tests

Crée un dossier pour le projet :

```bash
# Crée le dossier du projet
mkdir -p deploy-strategies/app

# Entre dans le dossier
cd deploy-strategies
```

Crée un fichier `app/index.php` qui servira d'application de test :

```php
<?php
// app/index.php
// Application simple qui affiche sa version et un health check

// La version est définie par une variable d'environnement
$version = getenv('APP_VERSION') ?: 'inconnue';

// Couleur d'affichage selon la version (pour distinguer visuellement)
$color = getenv('APP_COLOR') ?: '#333';

// Route : health check
if ($_SERVER['REQUEST_URI'] === '/health') {
    // Retourne 200 si l'application fonctionne
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'ok',
        'version' => $version,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Route : page d'accueil
header('Content-Type: text/html; charset=utf-8');
echo "<!DOCTYPE html>
<html>
<head><title>App v{$version}</title></head>
<body style='background: {$color}; color: white; font-family: sans-serif;
  display: flex; justify-content: center; align-items: center; height: 100vh;'>
  <div style='text-align: center;'>
    <h1>Version {$version}</h1>
    <p>Serveur : " . gethostname() . "</p>
    <p>Date : " . date('H:i:s') . "</p>
  </div>
</body>
</html>";
```

---

### Étape 2 : Implémenter le blue-green avec Docker Compose

Crée le fichier `docker-compose.blue-green.yml` :

```yaml
# docker-compose.blue-green.yml
# Stratégie Blue-Green avec Nginx comme load balancer

services:
  # Load balancer Nginx qui route le trafic
  loadbalancer:
    image: nginx:1.26-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-blue-green.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - blue
      - green

  # Environnement Blue (version actuelle)
  blue:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "1.0"
      APP_COLOR: "#2196F3"
    command: php -S 0.0.0.0:80 /app/index.php

  # Environnement Green (nouvelle version)
  green:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "2.0"
      APP_COLOR: "#4CAF50"
    command: php -S 0.0.0.0:80 /app/index.php
```

Crée le fichier de configuration Nginx `nginx-blue-green.conf` :

```nginx
# nginx-blue-green.conf
# Configuration pour le déploiement blue-green

# Le trafic est envoyé vers blue (version actuelle)
# Pour basculer vers green : remplace "blue" par "green" ci-dessous
upstream app {
    server blue:80;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check du load balancer
    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
```

Démarre l'environnement :

```bash
# Démarre le blue-green
docker compose -f docker-compose.blue-green.yml up -d
```

Vérifie que le trafic va vers blue :

```bash
# Appelle l'application
curl http://localhost:8080/health
```

**Résultat attendu** :

```text
{"status":"ok","version":"1.0","timestamp":"2026-03-20 10:30:00"}
```

---

### Étape 3 : Basculer de blue vers green

Pour basculer le trafic de blue (v1.0) vers green (v2.0), modifie la configuration Nginx :

Crée un fichier `nginx-blue-green-switch.conf` :

```nginx
# nginx-blue-green-switch.conf
# Après basculement : le trafic va vers green (v2.0)

upstream app {
    # Blue est remplacé par green
    server green:80;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
```

Applique la nouvelle configuration :

```bash
# Copie la nouvelle configuration
cp nginx-blue-green-switch.conf nginx-blue-green.conf

# Recharge Nginx sans interruption
docker compose -f docker-compose.blue-green.yml exec loadbalancer nginx -s reload
```

Vérifie que le trafic va maintenant vers green :

```bash
# Appelle l'application
curl http://localhost:8080/health
```

**Résultat attendu** :

```text
{"status":"ok","version":"2.0","timestamp":"2026-03-20 10:31:00"}
```

Le basculement est instantané. Si un problème est détecté, tu peux revenir vers blue en remettant la configuration originale et en rechargeant Nginx.

---

### Étape 4 : Implémenter le canary avec Docker Compose

Crée le fichier `docker-compose.canary.yml` :

```yaml
# docker-compose.canary.yml
# Stratégie Canary avec répartition pondérée du trafic

services:
  # Load balancer Nginx avec répartition pondérée
  loadbalancer:
    image: nginx:1.26-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-canary.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - stable
      - canary

  # Version stable (v1.0) -- reçoit la majorité du trafic
  stable:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "1.0"
      APP_COLOR: "#2196F3"
    command: php -S 0.0.0.0:80 /app/index.php

  # Version canary (v2.0) -- reçoit un petit pourcentage du trafic
  canary:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "2.0"
      APP_COLOR: "#FF9800"
    command: php -S 0.0.0.0:80 /app/index.php
```

Crée le fichier `nginx-canary.conf` :

```nginx
# nginx-canary.conf
# Répartition pondérée : 90% stable, 10% canary

upstream app {
    # weight=9 signifie 9 requêtes sur 10 vont vers stable
    server stable:80 weight=9;
    # weight=1 signifie 1 requête sur 10 va vers canary
    server canary:80 weight=1;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
```

Démarre l'environnement canary :

```bash
# Arrête l'environnement précédent
docker compose -f docker-compose.blue-green.yml down

# Démarre le canary
docker compose -f docker-compose.canary.yml up -d
```

Vérifie la répartition en envoyant plusieurs requêtes :

```bash
# Envoie 20 requêtes et compte les versions
for i in $(seq 1 20); do
  curl -s http://localhost:8080/health | grep -o '"version":"[^"]*"'
done | sort | uniq -c
```

**Résultat attendu** :

```text
  18 "version":"1.0"
   2 "version":"2.0"
```

Environ 90% des requêtes vont vers la v1.0 (stable) et 10% vers la v2.0 (canary). Les nombres exacts peuvent varier légèrement.

---

### Étape 5 : Augmenter progressivement le trafic canary

Pour passer de 10% à 50% canary, modifie les poids dans la configuration Nginx :

```nginx
# nginx-canary-50.conf
# Répartition : 50% stable, 50% canary

upstream app {
    server stable:80 weight=1;
    server canary:80 weight=1;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
```

Applique la nouvelle configuration :

```bash
# Copie la configuration 50/50
cp nginx-canary-50.conf nginx-canary.conf

# Recharge Nginx
docker compose -f docker-compose.canary.yml exec loadbalancer nginx -s reload
```

Vérifie la nouvelle répartition :

```bash
# Envoie 20 requêtes et compte les versions
for i in $(seq 1 20); do
  curl -s http://localhost:8080/health | grep -o '"version":"[^"]*"'
done | sort | uniq -c
```

**Résultat attendu** :

```text
  10 "version":"1.0"
  10 "version":"2.0"
```

Si tout va bien, passe à 100% canary puis supprime la version stable.

---

### Étape 6 : Implémenter le rolling update avec Docker Compose

Crée le fichier `docker-compose.rolling.yml` :

```yaml
# docker-compose.rolling.yml
# Stratégie Rolling Update avec 3 instances

services:
  # Load balancer Nginx
  loadbalancer:
    image: nginx:1.26-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-rolling.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app1
      - app2
      - app3

  # Instance 1
  app1:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "1.0"
      APP_COLOR: "#2196F3"
    command: php -S 0.0.0.0:80 /app/index.php

  # Instance 2
  app2:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "1.0"
      APP_COLOR: "#2196F3"
    command: php -S 0.0.0.0:80 /app/index.php

  # Instance 3
  app3:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      APP_VERSION: "1.0"
      APP_COLOR: "#2196F3"
    command: php -S 0.0.0.0:80 /app/index.php
```

Crée le fichier `nginx-rolling.conf` :

```nginx
# nginx-rolling.conf
# Load balancing entre les 3 instances

upstream app {
    server app1:80;
    server app2:80;
    server app3:80;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
```

Démarre l'environnement :

```bash
# Arrête l'environnement précédent
docker compose -f docker-compose.canary.yml down

# Démarre le rolling update
docker compose -f docker-compose.rolling.yml up -d
```

---

### Étape 7 : Simuler un rolling update

Mets à jour les instances une par une. Commence par l'instance 1 :

```bash
# Met à jour l'instance 1 vers v2.0
docker compose -f docker-compose.rolling.yml stop app1
APP_VERSION=2.0 APP_COLOR="#4CAF50" docker compose -f docker-compose.rolling.yml up -d app1
```

Vérifie que les deux versions coexistent :

```bash
# Envoie 12 requêtes et observe les versions
for i in $(seq 1 12); do
  curl -s http://localhost:8080/health | grep -o '"version":"[^"]*"'
done | sort | uniq -c
```

**Résultat attendu** :

```text
   4 "version":"1.0"
   8 "version":"2.0"
```

Environ un tiers des requêtes va vers la v2.0 (1 instance sur 3).

Continue avec les instances 2 et 3 :

```bash
# Met à jour l'instance 2
docker compose -f docker-compose.rolling.yml stop app2
APP_VERSION=2.0 APP_COLOR="#4CAF50" docker compose -f docker-compose.rolling.yml up -d app2

# Met à jour l'instance 3
docker compose -f docker-compose.rolling.yml stop app3
APP_VERSION=2.0 APP_COLOR="#4CAF50" docker compose -f docker-compose.rolling.yml up -d app3
```

Vérifie que toutes les instances sont en v2.0 :

```bash
# Vérifie les versions
for i in $(seq 1 9); do
  curl -s http://localhost:8080/health | grep -o '"version":"[^"]*"'
done | sort | uniq -c
```

**Résultat attendu** :

```text
   9 "version":"2.0"
```

---

### Étape 8 : Implémenter un health check dans le pipeline

Crée un workflow GitHub Actions qui vérifie le health check avant de finaliser le déploiement :

```yaml
# .github/workflows/deploy-with-healthcheck.yml
# Workflow qui vérifie le health check après déploiement

name: Deploy avec Health Check

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Déployer la nouvelle version
        run: |
          echo "Déploiement de la version ${{ github.sha }}..."
          # Ici, tu lancerais la commande de déploiement réelle
          # Exemple : docker compose up -d

      - name: Attendre le démarrage
        run: |
          echo "Attente de 10 secondes pour le démarrage..."
          sleep 10

      - name: Vérifier le health check
        run: |
          # Nombre maximum de tentatives
          MAX_RETRIES=10
          RETRY_INTERVAL=5

          for i in $(seq 1 $MAX_RETRIES); do
            echo "Tentative $i/$MAX_RETRIES..."

            # Envoie une requête au health check
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
              http://localhost:8080/health || echo "000")

            if [ "$HTTP_CODE" = "200" ]; then
              echo "Health check OK (HTTP 200)"
              exit 0
            fi

            echo "Health check échoué (HTTP $HTTP_CODE). Nouvelle tentative dans ${RETRY_INTERVAL}s..."
            sleep $RETRY_INTERVAL
          done

          echo "Health check échoué après $MAX_RETRIES tentatives"
          exit 1

      - name: Rollback en cas d'échec
        if: failure()
        run: |
          echo "Rollback vers la version précédente..."
          # Ici, tu lancerais la commande de rollback
          # Exemple : docker compose down && docker compose -f docker-compose.previous.yml up -d
```

**Résultat attendu** :

```text
Le pipeline :
1. Déploie la nouvelle version
2. Attend 10 secondes
3. Vérifie le health check (jusqu'à 10 tentatives)
4. Si le health check échoue → rollback automatique
```

---

### Étape 9 : Nettoyage des environnements

Après les tests, arrête et supprime tous les conteneurs :

```bash
# Arrête tous les environnements de test
docker compose -f docker-compose.blue-green.yml down 2>/dev/null
docker compose -f docker-compose.canary.yml down 2>/dev/null
docker compose -f docker-compose.rolling.yml down 2>/dev/null

# Vérifie qu'il ne reste aucun conteneur
docker ps -a --filter "name=deploy-strategies" --format "{{.Names}}"
```

**Résultat attendu** :

```text
Aucun conteneur affiché = tout est nettoyé.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose up -d` | Démarre les services en arrière-plan |
| `docker compose down` | Arrête et supprime les conteneurs |
| `docker compose exec loadbalancer nginx -s reload` | Recharge Nginx sans interruption |
| `curl -s http://localhost:8080/health` | Vérifie le health check de l'application |
| `docker compose stop <service>` | Arrête un service sans le supprimer |
| `docker compose up -d <service>` | Redémarre un service spécifique |

---

## Pièges Fréquents

### Piège 1 : Migration de base de données incompatible avec le rollback

⚠️ **Problème** : La v2.0 ajoute une colonne obligatoire dans la base de données. Après le basculement blue-green, un bug est détecté. Tu rebascules vers blue (v1.0), mais la v1.0 ne connaît pas la nouvelle colonne. Des erreurs SQL apparaissent.

✅ **Solution** : Les migrations de base de données doivent être rétrocompatibles. Applique les migrations en deux phases :

1. Phase 1 (v2.0) : ajoute la colonne en tant que nullable (pas obligatoire)
2. Phase 2 (v2.1) : rends la colonne obligatoire une fois la v2.0 validée

```sql
-- Phase 1 : ajout rétrocompatible
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;

-- Phase 2 (après validation) : rendre obligatoire
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

---

### Piège 2 : Canary sans métriques

⚠️ **Problème** : Tu déploies un canary à 10%, mais tu ne mesures pas les erreurs ni la latence. Tu augmentes à 50% sans savoir que le canary génère des erreurs 500 sur certaines routes.

✅ **Solution** : Définis les métriques à surveiller avant de déployer le canary :

- Taux d'erreurs HTTP (5xx) : doit rester en dessous de 1%
- Temps de réponse moyen : ne doit pas augmenter de plus de 20%
- Nombre de requêtes en erreur par minute

Si une métrique dépasse le seuil, annule le canary automatiquement.

---

### Piège 3 : Rolling update avec sessions en mémoire

⚠️ **Problème** : L'application stocke les sessions en mémoire (sur le serveur PHP). Pendant un rolling update, un utilisateur connecté à l'instance 1 (v1.0) est redirigé vers l'instance 2 (v2.0) après le redémarrage. Sa session est perdue.

✅ **Solution** : Stocke les sessions dans un stockage partagé (Redis, base de données) plutôt qu'en mémoire :

```yaml
# Dans le docker-compose.yml, ajoute Redis pour les sessions
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

### Piège 4 : Health check qui retourne toujours 200

⚠️ **Problème** : Le health check retourne 200 même quand la base de données est inaccessible. Le load balancer pense que l'instance est saine, mais les requêtes échouent.

✅ **Solution** : Le health check doit vérifier toutes les dépendances critiques :

```php
<?php
// health.php -- health check complet

$checks = [];

// Vérifier la connexion à la base de données
try {
    $pdo = new PDO('pgsql:host=database;dbname=app', 'app', 'secret');
    $checks['database'] = 'ok';
} catch (PDOException $e) {
    $checks['database'] = 'error: ' . $e->getMessage();
    http_response_code(503);
}

// Vérifier la connexion à Redis
try {
    $redis = new Redis();
    $redis->connect('redis', 6379);
    $redis->ping();
    $checks['redis'] = 'ok';
} catch (Exception $e) {
    $checks['redis'] = 'error: ' . $e->getMessage();
    http_response_code(503);
}

header('Content-Type: application/json');
echo json_encode($checks);
```

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre blue-green, canary et rolling update
- [ ] Je sais choisir la stratégie adaptée à un projet donné
- [ ] Je sais implémenter un déploiement blue-green avec Docker Compose et Nginx
- [ ] Je sais configurer une répartition pondérée du trafic pour un canary
- [ ] Je sais simuler un rolling update en mettant à jour les instances une par une
- [ ] Je sais implémenter un health check dans une application PHP
- [ ] Je sais intégrer un health check dans un pipeline CI/CD
- [ ] Je comprends l'importance des migrations rétrocompatibles

---

## Exercice Pratique

**Énoncé** : Mets en place un déploiement canary complet avec les éléments suivants :

1. Une application PHP avec un health check qui vérifie le statut de l'application
2. Un Docker Compose avec un load balancer Nginx, une version stable (v1.0) et un canary (v2.0)
3. La répartition initiale : 95% stable, 5% canary
4. Un script bash `canary-promote.sh` qui augmente progressivement le trafic canary : 5% -> 25% -> 50% -> 100%
5. Un script bash `canary-rollback.sh` qui remet 100% du trafic vers la version stable

**Indications** :

- Utilise le template Nginx avec `weight` pour la répartition
- Le script `canary-promote.sh` doit modifier la configuration Nginx et recharger Nginx à chaque étape
- Le script `canary-rollback.sh` doit remettre `weight=1` sur stable et `weight=0` sur canary (ou retirer canary de l'upstream)
- Vérifie le health check entre chaque augmentation de trafic

**Résultat attendu** : Tu peux exécuter `./canary-promote.sh` pour augmenter progressivement le trafic vers le canary, et `./canary-rollback.sh` pour revenir à la version stable à tout moment.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Le fichier `docker-compose.canary.yml` est le même que celui de l'étape 4.

Script `canary-promote.sh` :

```bash
#!/bin/bash
# canary-promote.sh
# Augmente progressivement le trafic canary

# Fonction qui génère la configuration Nginx
generate_config() {
  local stable_weight=$1
  local canary_weight=$2

  cat > nginx-canary.conf << EOF
upstream app {
    server stable:80 weight=${stable_weight};
    server canary:80 weight=${canary_weight};
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
EOF
}

# Fonction qui vérifie le health check du canary
check_health() {
  local max_retries=5
  for i in $(seq 1 $max_retries); do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)
    if [ "$HTTP_CODE" = "200" ]; then
      echo "  Health check OK"
      return 0
    fi
    echo "  Tentative $i/$max_retries échouée (HTTP $HTTP_CODE)"
    sleep 2
  done
  echo "  Health check ÉCHOUÉ"
  return 1
}

# Étapes de promotion
STEPS=("95:5" "75:25" "50:50" "0:100")

for step in "${STEPS[@]}"; do
  IFS=':' read -r stable canary <<< "$step"
  echo "=== Canary à ${canary}% (stable: ${stable}%) ==="

  # Génère la configuration
  generate_config "$stable" "$canary"

  # Recharge Nginx
  docker compose -f docker-compose.canary.yml exec loadbalancer nginx -s reload

  # Vérifie le health check
  if ! check_health; then
    echo "ERREUR : health check échoué. Arrêt de la promotion."
    echo "Exécute ./canary-rollback.sh pour revenir en arrière."
    exit 1
  fi

  echo "  Répartition appliquée. Attente de 10 secondes..."
  sleep 10
done

echo "=== Promotion terminée : 100% canary ==="
```

Script `canary-rollback.sh` :

```bash
#!/bin/bash
# canary-rollback.sh
# Remet 100% du trafic vers la version stable

echo "=== Rollback : 100% stable ==="

# Génère la configuration avec 100% stable
cat > nginx-canary.conf << 'EOF'
upstream app {
    server stable:80 weight=1;
    server canary:80 down;
}

server {
    listen 80;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /lb-health {
        return 200 '{"status": "ok"}';
        add_header Content-Type application/json;
    }
}
EOF

# Recharge Nginx
docker compose -f docker-compose.canary.yml exec loadbalancer nginx -s reload

echo "Rollback terminé. Tout le trafic va vers la version stable."
```

Rends les scripts exécutables et teste-les :

```bash
# Rends les scripts exécutables
chmod +x canary-promote.sh canary-rollback.sh

# Démarre l'environnement
docker compose -f docker-compose.canary.yml up -d

# Lance la promotion progressive
./canary-promote.sh

# Si un problème survient, annule avec le rollback
./canary-rollback.sh
```

**Résultat attendu** :

```text
=== Canary à 5% (stable: 95%) ===
  Health check OK
  Répartition appliquée. Attente de 10 secondes...
=== Canary à 25% (stable: 75%) ===
  Health check OK
  Répartition appliquée. Attente de 10 secondes...
=== Canary à 50% (stable: 50%) ===
  Health check OK
  Répartition appliquée. Attente de 10 secondes...
=== Canary à 100% (stable: 0%) ===
  Health check OK
  Répartition appliquée. Attente de 10 secondes...
=== Promotion terminée : 100% canary ===
```

---

## Navigation

← Fiche précédente : **[Exécution locale des pipelines](08-execution-locale-pipelines.md)**

→ Fiche suivante : **[Projet intégrateur](10-projet-integrateur.md)**
