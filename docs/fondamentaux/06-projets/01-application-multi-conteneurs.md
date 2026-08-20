---
tags:
  - Projet
  - Débutant
description: "Application de sondage (Docker)"
estimated_time: "25 min"
fiche_number: 1
total_fiches: 2
cursus: "Projets"
---

# 01 - Application de sondage (Docker)

> **En bref** : À la fin de cette fiche, tu sauras créer une application multi-conteneurs avec Docker Compose. Lecture estimée : 25 min.


## Prérequis

- Connaissances de base en ligne de commande
- Comprendre ce qu'est un serveur web

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une application multi-conteneurs avec Docker Compose.

---

## Concepts

### Qu'est-ce que Docker ?

**Définition** : Docker est un outil qui permet d'exécuter des applications dans des conteneurs isolés.

**Le problème que Docker résout** :

Sans Docker :

1. **Conflits de dépendances** : Deux projets nécessitent des versions différentes de PHP.
2. **"Ça marche sur ma machine"** : Le code fonctionne chez toi mais pas ailleurs.
3. **Installation complexe** : Installer tous les outils prend des heures.

**Comment Docker résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Conflits de dépendances | Chaque conteneur a ses propres dépendances |
| Fonctionne différemment | Même conteneur = même résultat partout |
| Installation complexe | Une commande pour tout lancer |

**Analogie** : Un conteneur Docker est comme une boîte de déménagement étiquetée "Bureau". Elle contient l'ordinateur, la lampe, les stylos. Tu peux déplacer cette boîte n'importe où, le bureau sera identique.

---

### Dockerfile

**Définition** : Un Dockerfile est une recette pour construire une image Docker.

**Analogie concrète** : Un Dockerfile est comme une recette de cuisine écrite étape par étape. La ligne `FROM` indique l'ingrédient de base (la pâte à pizza), les lignes `RUN` ajoutent les garnitures, et le résultat final (l'image) est un plat prêt à être réchauffé (lancé) autant de fois que tu veux.

**Structure** :

```dockerfile
# Image de base
FROM php:8.3-apache

# Installer des dépendances
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copier le code
COPY ./src /var/www/html

# Définir le répertoire de travail
WORKDIR /var/www/html

# Port exposé
EXPOSE 80
```

**Instructions principales** :

| Instruction | Description |
| ----------- | ----------- |
| `FROM` | Image de base |
| `RUN` | Exécute une commande pendant la construction |
| `COPY` | Copie des fichiers dans l'image |
| `WORKDIR` | Définit le répertoire de travail |
| `EXPOSE` | Documente le port utilisé |
| `CMD` | Commande par défaut au démarrage |
| `ENV` | Variable d'environnement |

---

### Docker Compose

**Définition** : Docker Compose permet de définir et gérer plusieurs conteneurs comme une seule application.

**Analogie concrète** : Docker Compose est comme le plan d'un restaurant. Il décrit tous les postes de travail (cuisine, bar, salle) et comment ils communiquent entre eux. Avec une seule commande, tu ouvres ou fermes tout le restaurant d'un coup, au lieu de devoir gérer chaque poste séparément.

**Fichier docker-compose.yml** :

```yaml
services:
  web:
    build: ./web
    ports:
      - "8080:80"
    depends_on:
      - database

  database:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

**Éléments clés** :

| Élément | Description |
| ------- | ----------- |
| `services` | Liste des conteneurs |
| `build` | Chemin vers le Dockerfile |
| `image` | Image Docker Hub à utiliser |
| `ports` | Mapping host:conteneur |
| `environment` | Variables d'environnement |
| `volumes` | Persistance des données |
| `depends_on` | Ordre de démarrage |

---

### Les réseaux Docker

**Par défaut**, Docker Compose crée un réseau où tous les services peuvent communiquer par leur nom.

```yaml
services:
  web:
    # Peut accéder à "database" par son nom
    environment:
      DB_HOST: database

  database:
    image: postgres:16
```

---

### Les volumes

**Définition** : Un volume permet de persister les données au-delà du cycle de vie d'un conteneur.

**Analogie concrète** : Un volume Docker est comme un disque dur externe que tu branches sur ton ordinateur. Si l'ordinateur tombe en panne et que tu le remplaces, tes données sont toujours sur le disque externe. De la même façon, si tu supprimes et recrées un conteneur, les données stockées dans le volume sont préservées.

**Types** :

```yaml
volumes:
  # Volume nommé (géré par Docker)
  - db_data:/var/lib/postgresql/data

  # Bind mount (dossier local)
  - ./src:/var/www/html
```

| Type | Usage |
| ---- | ----- |
| Volume nommé | Données à persister (BDD) |
| Bind mount | Code source en développement |

---

## Étapes Pratiques

### Structure du projet de sondage

```text
voteapp/
├── docker-compose.yml
├── web/
│   ├── Dockerfile
│   └── src/
│       └── index.php
├── database/
│   └── init.sql
└── result/
    ├── Dockerfile
    └── src/
        └── index.php
```

### Fichier docker-compose.yml

```yaml
services:
  # Base de données PostgreSQL
  db:
    image: postgres:16
    container_name: voteapp_db
    environment:
      POSTGRES_USER: voteapp
      POSTGRES_PASSWORD: spinach
      POSTGRES_DB: polls
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - voteapp_network

  # Application de vote
  poll:
    build: ./poll
    container_name: voteapp_poll
    ports:
      - "5000:80"
    depends_on:
      - redis
    networks:
      - voteapp_network

  # Cache Redis
  redis:
    image: redis:7
    container_name: voteapp_redis
    networks:
      - voteapp_network

  # Worker de traitement
  worker:
    build: ./worker
    container_name: voteapp_worker
    depends_on:
      - db
      - redis
    networks:
      - voteapp_network

  # Application de résultats
  result:
    build: ./result
    container_name: voteapp_result
    ports:
      - "5001:80"
    depends_on:
      - db
    networks:
      - voteapp_network

networks:
  voteapp_network:
    driver: bridge

volumes:
  db_data:
```

### Dockerfile pour l'application web

`poll/Dockerfile` :

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

CMD ["python", "app.py"]
```

### Script d'initialisation de la base

`database/init.sql` :

```sql
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    vote VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Commandes Utiles

| Commande | Description |
| -------- | ----------- |
| `docker compose up` | Démarre tous les services |
| `docker compose up -d` | Démarre en arrière-plan |
| `docker compose down` | Arrête et supprime les conteneurs |
| `docker compose build` | Reconstruit les images |
| `docker compose logs` | Affiche les logs |
| `docker compose logs -f web` | Suit les logs d'un service |
| `docker compose ps` | Liste les conteneurs |
| `docker compose exec web bash` | Ouvre un shell dans un conteneur |

---

## Pièges Fréquents

### Piège 1 : depends_on ne garantit pas que le service est prêt

⚠️ **Problème** : `depends_on` démarre les conteneurs dans l'ordre, mais n'attend pas que le service soit opérationnel.

✅ **Solution** : Utiliser un script d'attente ou `healthcheck`.

```yaml
db:
  image: postgres:16
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U voteapp"]
    interval: 5s
    timeout: 5s
    retries: 5

web:
  depends_on:
    db:
      condition: service_healthy
```

### Piège 2 : Permissions sur les volumes bind mount

⚠️ **Problème** : Erreurs de permission lors de l'accès aux fichiers montés.

✅ **Solution** : Vérifier que l'utilisateur dans le conteneur a les bons droits.

### Piège 3 : Cache lors du build

⚠️ **Problème** : Les modifications ne sont pas prises en compte.

✅ **Solution** : Utiliser `docker compose build --no-cache`.

---

## Checklist de Validation

- [ ] J'ai créé un Dockerfile pour chaque service
- [ ] J'ai défini les services dans docker-compose.yml
- [ ] J'ai configuré les volumes pour la persistance
- [ ] J'ai configuré les réseaux pour la communication
- [ ] Tous les services démarrent avec `docker compose up`
- [ ] Les services communiquent entre eux

---

## Exercice Pratique

**Énoncé** : Étendre le projet de sondage en ajoutant un service Nginx en reverse proxy devant l'application poll. Le Nginx doit écouter sur le port 80 et rediriger le trafic vers le service poll. Ajouter un healthcheck Docker sur le service Nginx.

**Indications** :

- Crée un fichier `nginx/nginx.conf` avec une directive `proxy_pass` vers le service `poll`
- Ajoute un service `nginx` dans le `docker-compose.yml` qui monte le fichier de configuration
- Le service Nginx doit dépendre du service `poll`
- Utilise `curl -f http://localhost` comme commande de healthcheck

**Résultat attendu** : L'application poll est accessible via `http://localhost:80` au lieu de `http://localhost:5000`. Le healthcheck est visible avec `docker compose ps`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`nginx/nginx.conf` :

```nginx
server {
    # Nginx écoute sur le port 80
    listen 80;

    # Nom du serveur (accepte tout)
    server_name _;

    # Toutes les requêtes sont redirigées vers le service poll
    location / {
        # proxy_pass utilise le nom du service Docker Compose
        proxy_pass http://poll:80;

        # Transmettre les en-têtes du client au service poll
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Service à ajouter dans `docker-compose.yml` (dans la section `services`) :

```yaml
  # Reverse proxy Nginx devant l'application poll
  nginx:
    image: nginx:1.26
    container_name: voteapp_nginx
    ports:
      - "80:80"
    volumes:
      # Monter le fichier de configuration Nginx
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - poll
    networks:
      - voteapp_network
    healthcheck:
      # Vérifier que Nginx répond sur le port 80
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s
```

Pense aussi à retirer le mapping de port `"5000:80"` du service `poll`, puisque le trafic passe maintenant par Nginx.

---

## Navigation

→ Fiche suivante : **[Jeu 2D Java](02-jeu-2d-java.md)**
