---
tags:
  - Référence
  - Débutant
description: "Aide-mémoire Docker"
estimated_time: "30 min"
fiche_number: 1
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire Docker

> **En bref** : Aide-mémoire Docker. Lecture estimée : 30 min.

Fiche de référence rapide pour les commandes Docker Compose.

---

## Commandes de base

| Commande | Action |
| -------- | ------ |
| `docker compose up -d` | Démarrer les conteneurs en arrière-plan |
| `docker compose down` | Arrêter et supprimer les conteneurs |
| `docker compose stop` | Arrêter les conteneurs (sans les supprimer) |
| `docker compose start` | Redémarrer les conteneurs arrêtés |
| `docker compose restart` | Redémarrer tous les conteneurs |

---

## Voir l'état des conteneurs

| Commande | Action |
| -------- | ------ |
| `docker compose ps` | Liste les conteneurs et leur état |
| `docker compose logs` | Voir tous les logs |
| `docker compose logs -f` | Suivre les logs en temps réel |
| `docker compose logs php` | Logs d'un service spécifique |
| `docker compose logs --tail=50 php` | Les 50 dernières lignes |

---

## Exécuter des commandes dans un conteneur

| Commande | Action |
| -------- | ------ |
| `docker compose exec php bash` | Ouvrir un terminal dans le conteneur PHP |
| `docker compose exec php php bin/console ...` | Exécuter une commande Symfony |
| `docker compose exec database psql -U symfony_user -d symfony_db` | Se connecter à PostgreSQL |

**Format général** :

```bash
docker compose exec [service] [commande]
```

---

## Reconstruire les conteneurs

| Commande | Action |
| -------- | ------ |
| `docker compose build` | Reconstruire les images |
| `docker compose up -d --build` | Reconstruire et démarrer |
| `docker compose up -d --force-recreate` | Recréer les conteneurs |

---

## Nettoyer

| Commande | Action |
| -------- | ------ |
| `docker compose down` | Arrêter et supprimer les conteneurs (conserve les volumes) |
| `docker system prune` | Supprimer les ressources inutilisées (demande confirmation) |
| `docker volume prune` | Supprimer uniquement les volumes orphelins (demande confirmation) |

⚠️ **Ne jamais** utiliser `docker compose down -v` comme nettoyage habituel : le `-v` **détruit les volumes** (données PostgreSQL, etc.). Réservé à un reset volontaire et documenté.

---

## Commandes courantes pour ce projet

**Démarrer le projet** :

```bash
docker compose up -d
```

**Voir si tout fonctionne** :

```bash
docker compose ps
```

**Exécuter une commande Symfony** :

```bash
docker compose exec php php bin/console [commande]
```

**Accéder à PostgreSQL** :

```bash
docker compose exec database psql -U symfony_user -d symfony_db
```

**Voir les logs en cas de problème** :

```bash
docker compose logs -f
```

**Redémarrer après modification de docker-compose.yml** :

```bash
docker compose down && docker compose up -d
```

---

## Résolution de problèmes

### Le conteneur ne démarre pas

```bash
# Voir les logs pour comprendre l'erreur
docker compose logs [service]

# Reconstruire le conteneur
docker compose up -d --build [service]
```

### Port déjà utilisé

```bash
# Voir ce qui utilise le port 8080
lsof -i :8080

# Arrêter tous les conteneurs et redémarrer
docker compose down
docker compose up -d
```

### Problème de permissions

```bash
# Recréer les conteneurs
docker compose down
docker compose up -d --force-recreate
```

### Base de données corrompue

```bash
# Supprimer et recréer (PERD LES DONNÉES)
docker compose down -v
docker compose up -d
php bin/console doctrine:migrations:migrate
```

---

## Services du projet

| Service | Port | URL |
| ------- | ---- | --- |
| `php` | - | Application Symfony |
| `nginx` | 8080 | <http://localhost:8080> |
| `database` | 5432 | PostgreSQL |

---

## Raccourci utile

Ajoute cet alias dans ton `~/.bashrc` ou `~/.zshrc` :

```bash
alias dc="docker compose"
```

Puis utilise :

```bash
dc up -d
dc ps
dc logs -f
dc exec php bash
```

---

## Navigation

→ Fiche suivante : **[Aide-mémoire Symfony](02-aide-memoire-symfony.md)**
