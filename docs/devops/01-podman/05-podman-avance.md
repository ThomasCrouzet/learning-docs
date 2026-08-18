---
tags:
  - Podman
  - Intermédiaire
  - Pratique
description: "Fonctionnalités Avancées de Podman"
estimated_time: "95 min"
fiche_number: 5
total_fiches: 5
cursus: "Podman"
---

# 05 - Fonctionnalités Avancées de Podman

> **En bref** : À la fin de cette fiche, tu sauras inspecter les conteneurs, gérer les ressources, configurer la sécurité rootless, et exporter/importer des images pour un environnement offline. Lecture estimée : 95 min.


## Prérequis

- Fiche [04 - Podman Compose et Quadlet](./04-podman-compose.md)
- Savoir lancer et arrêter des conteneurs avec Podman
- Savoir écrire un Containerfile basique

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Podman      | 5.x (exemples compatibles 4.x+) |

> **Note macOS / Windows** : Sur macOS et Windows, Podman ne tourne pas nativement (il nécessite un noyau Linux). La commande `podman machine` gère une machine virtuelle Linux légère qui héberge le démon Podman. Les commandes principales :
>
> ```bash
> podman machine init      # Initialise la VM (une seule fois)
> podman machine start     # Démarre la VM
> podman machine stop      # Arrête la VM
> podman machine list      # Liste les VMs
> podman machine ssh       # Ouvre un shell dans la VM
> ```
>
> Une fois la VM démarrée (`podman machine start`), toutes les commandes `podman` (build, run, push, etc.) fonctionnent exactement comme sur Linux. La VM est transparente pour l'utilisateur.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras inspecter les conteneurs, gérer les ressources, configurer la sécurité rootless, et exporter/importer des images pour un environnement offline.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'inspection et le débogage des conteneurs ?

**Définition** : L'inspection et le débogage sont un ensemble de commandes Podman qui permettent d'observer ce qui se passe à l'intérieur d'un conteneur. Ces commandes donnent des informations sur la configuration, les journaux, les processus et la consommation de ressources.

**Le problème que l'inspection et le débogage résolvent** :

Sans ces outils, voici les problèmes rencontrés :

1. **Conteneur qui ne démarre pas** : Tu lances un conteneur, il s'arrête immédiatement. Tu ne sais pas pourquoi.
2. **Erreurs silencieuses** : Le conteneur semble fonctionner, mais l'application à l'intérieur produit des erreurs que tu ne vois pas.
3. **Problèmes de configuration** : Tu ne sais pas quelle adresse IP le conteneur utilise, quels volumes sont montés, ou quelles variables d'environnement sont définies.
4. **Surconsommation de ressources** : Un conteneur consomme trop de mémoire ou de CPU, mais tu ne sais pas lequel.

**Comment l'inspection et le débogage résolvent ces problèmes** :

| Problème                      | Commande         | Solution                                                    |
| ----------------------------- | ---------------- | ----------------------------------------------------------- |
| Conteneur qui ne démarre pas  | `podman logs`    | Affiche les messages de sortie (stdout/stderr) du conteneur |
| Erreurs silencieuses          | `podman logs`    | Montre les erreurs même si le conteneur semble fonctionner  |
| Problèmes de configuration    | `podman inspect` | Affiche toute la configuration en format JSON               |
| Surconsommation de ressources | `podman stats`   | Montre la consommation CPU/mémoire en temps réel            |

**Analogie concrète** : Pense au tableau de bord d'une voiture :

- `podman inspect` est le carnet d'entretien : toutes les informations techniques du véhicule
- `podman logs` représente les voyants lumineux : ils t'alertent quand quelque chose ne va pas
- `podman top` est le compte-tours moteur : il montre ce qui tourne en ce moment
- `podman stats` est la jauge d'essence : elle montre la consommation en temps réel

**Ce que l'inspection et le débogage ne sont PAS** :

- Ce ne sont pas des outils de réparation. Ils diagnostiquent un problème, pas le corriger. Pour corriger, tu dois modifier la configuration du conteneur ou de l'image.
- Ce n'est pas du monitoring en production. Pour surveiller des conteneurs 24h/24, on utilise Prometheus ou Grafana. Les commandes Podman sont faites pour du débogage ponctuel.

Le diagramme suivant montre les principales commandes de débogage et ce qu'elles permettent d'observer sur un conteneur.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-01-podman-05-podman-avance-1.html">Qu&#x27;est-ce que l&#x27;inspection et le débogage des conteneurs ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-01-podman-05-podman-avance-1.html" title="Qu&#x27;est-ce que l&#x27;inspection et le débogage des conteneurs ?" style="width:100%;min-height:532px;border:0;background:transparent"></iframe>
</div>

**Les cinq commandes de débogage** :

| Commande         | Rôle                                           | Format de sortie      |
| ---------------- | ---------------------------------------------- | --------------------- |
| `podman inspect` | Affiche toute la configuration d'un conteneur  | JSON                  |
| `podman logs`    | Affiche les journaux (stdout et stderr)        | Texte brut            |
| `podman top`     | Liste les processus en cours dans le conteneur | Tableau (comme `ps`)  |
| `podman stats`   | Montre l'utilisation CPU/mémoire en temps réel  | Tableau mis à jour    |
| `podman exec`    | Exécute une commande dans un conteneur actif   | Dépend de la commande |

---

### Qu'est-ce que la gestion des ressources ?

**Définition** : La gestion des ressources consiste à limiter la quantité de CPU et de mémoire qu'un conteneur peut utiliser. Ces limites sont définies au lancement du conteneur avec des options de `podman run`.

**Le problème que la gestion des ressources résout** :

Sans limitation de ressources, voici les problèmes rencontrés :

1. **Un conteneur monopolise la machine** : Un conteneur consomme toute la mémoire disponible. Les autres conteneurs et le système hôte manquent de mémoire.
2. **Ralentissement global** : Un conteneur utilise 100% du CPU. Tout le reste de la machine devient lent.
3. **Plantage du système** : Le système d'exploitation tue des processus de manière imprévue (OOM Killer sur Linux).

**Comment la gestion des ressources résout ces problèmes** :

| Problème                       | Solution                                              |
| ------------------------------ | ----------------------------------------------------- |
| Un conteneur monopolise la RAM | `--memory` fixe une limite maximale de mémoire        |
| Un conteneur monopolise le CPU | `--cpus` fixe un nombre maximal de CPUs utilisables   |
| Plantage du système (OOM)      | `--memory-swap` contrôle aussi l'utilisation du swap  |

**Analogie concrète** : Imagine un appartement en colocation avec 4 colocataires. Le réfrigérateur est partagé. Sans règles, un colocataire pourrait remplir tout le réfrigérateur avec ses affaires. La gestion des ressources, c'est attribuer une étagère précise à chaque colocataire. Chacun a un espace défini et ne peut pas déborder.

**Ce que la gestion des ressources n'est PAS** :

- Ce n'est pas de l'orchestration. L'orchestration (Kubernetes, OpenShift) répartit les conteneurs sur plusieurs machines. La gestion des ressources concerne une seule machine.
- Ce n'est pas de la garantie de ressources. `--memory 512m` fixe un maximum, pas un minimum. Le conteneur peut utiliser moins, mais jamais plus.

**Tableau des options de limitation** :

| Option          | Description                                    | Exemple            |
| --------------- | ---------------------------------------------- | ------------------ |
| `--memory`      | Limite maximale de mémoire RAM                 | `--memory 512m`    |
| `--memory-swap` | Limite de mémoire + swap combinée              | `--memory-swap 1g` |
| `--cpus`        | Nombre maximal de CPUs (accepte les décimales) | `--cpus 1.5`       |
| `--cpu-shares`  | Poids relatif de CPU (par défaut : 1024)       | `--cpu-shares 512` |

**Note** : `--cpu-shares` fonctionne différemment selon la version de cgroups. Sur les systèmes modernes (cgroups v2), cette valeur est convertie automatiquement en `cpu.weight`.

**Différence entre `--cpus` et `--cpu-shares`** :

| `--cpus`                            | `--cpu-shares`                                  |
| ----------------------------------- | ----------------------------------------------- |
| Limite absolue                      | Limite relative                                 |
| `--cpus 1.5` = maximum 1,5 CPU     | `--cpu-shares 512` = moitié du poids par défaut |
| Fonctionne même si le CPU est libre | Ne s'applique que si le CPU est contesté        |
| Utiliser pour des limites strictes  | Utiliser pour des priorités entre conteneurs    |

---

### Qu'est-ce que la sécurité rootless avancée ?

**Définition** : La sécurité rootless avancée regroupe les mécanismes qui renforcent l'isolation d'un conteneur rootless. Cela inclut les labels SELinux pour les volumes et les user namespaces pour le mappage des utilisateurs.

**Le problème que la sécurité rootless avancée résout** :

Sans ces mécanismes, voici les problèmes rencontrés :

1. **Accès non autorisé aux fichiers** : Un conteneur peut lire et modifier des fichiers du système hôte qui ne lui sont pas destinés.
2. **Escalade de privilèges** : Si un attaquant prend le contrôle du conteneur, il pourrait obtenir les droits root sur la machine hôte.
3. **Conflits de permissions** : Les fichiers créés par le conteneur ont des permissions incompatibles avec l'utilisateur hôte.

**Comment la sécurité rootless avancée résout ces problèmes** :

| Problème                | Mécanisme           | Solution                                             |
| ----------------------- | ------------------- | ---------------------------------------------------- |
| Accès non autorisé      | Labels SELinux `:Z` | Restreint l'accès du volume à un seul conteneur      |
| Escalade de privilèges  | User namespaces     | Le root du conteneur est un utilisateur normal dehors |
| Conflits de permissions | `--userns=keep-id`  | L'UID dans le conteneur correspond à l'UID de l'hôte |

**Analogie concrète** : Pense à un immeuble avec des casiers de rangement. Le label `:Z` donne une clé unique à un seul locataire : personne d'autre ne peut ouvrir ce casier. Le label `:z` donne une clé partagée : plusieurs locataires désignés peuvent ouvrir le même casier. Les user namespaces font en sorte que, même si un locataire prétend être le "directeur" dans son appartement, il n'a aucun pouvoir sur le reste de l'immeuble.

**Ce que la sécurité rootless avancée n'est PAS** :

- Ce n'est pas un pare-feu. Les labels SELinux contrôlent l'accès aux fichiers, pas le trafic réseau.
- Ce n'est pas un antivirus. Ces mécanismes limitent les permissions, ils ne détectent pas les logiciels malveillants.

**Labels SELinux pour les volumes bind-mount** :

| Label | Nom        | Comportement                                   | Quand l'utiliser                   |
| ----- | ---------- | ---------------------------------------------- | ---------------------------------- |
| `:z`  | Shared     | Plusieurs conteneurs peuvent accéder au volume | Fichiers partagés entre conteneurs |
| `:Z`  | Private    | Un seul conteneur peut accéder au volume       | Fichiers privés d'un seul conteneur |
| aucun | Sans label | Pas de relabeling SELinux                      | Si SELinux est désactivé           |

**User namespaces** :

Par défaut, le root (UID 0) dans un conteneur rootless est mappé sur ton UID utilisateur sur l'hôte. L'option `--userns=keep-id` fait correspondre ton UID hôte avec le même UID dans le conteneur.

| Option             | UID dans le conteneur | UID sur l'hôte     | Utilisation                              |
| ------------------ | --------------------- | ------------------ | ---------------------------------------- |
| (par défaut)       | 0 (root)              | Ton UID (ex: 1000) | Cas général                              |
| `--userns=keep-id` | Ton UID (ex: 1000)    | Ton UID (ex: 1000) | Fichiers éditables des deux côtés        |

---

### Qu'est-ce que le travail offline avec les images ?

**Définition** : Le travail offline consiste à exporter des images de conteneurs sous forme de fichiers `.tar`, puis à les importer sur une machine sans accès à internet.

**Le problème que le travail offline résout** :

Sans cette fonctionnalité, voici les problèmes rencontrés :

1. **Pas d'accès à internet** : La commande `podman pull` ne fonctionne pas. Tu ne peux télécharger aucune image.
2. **Réseau instable** : Le téléchargement d'une image de 500 Mo échoue à mi-chemin.
3. **Reproductibilité** : Tu veux garantir que la même image exacte est utilisée sur plusieurs machines.

**Comment le travail offline résout ces problèmes** :

| Problème               | Solution                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| Pas d'accès à internet | Exporter l'image en `.tar`, la copier sur clé USB                  |
| Réseau instable        | Le fichier `.tar` est copié une seule fois, pas de téléchargement  |
| Reproductibilité       | Le fichier `.tar` contient une copie exacte et immuable de l'image |

**Analogie concrète** : Pense à une bibliothèque municipale. Tu trouves un livre qui t'intéresse, mais tu ne peux pas l'emporter. Tu peux photocopier le livre entier. `podman save` est la photocopie : elle crée une copie complète de l'image. `podman load` est le moment où tu ranges la copie dans ta bibliothèque personnelle chez toi.

**Ce que le travail offline n'est PAS** :

- Ce n'est pas une sauvegarde de données. `podman save` exporte l'image (le modèle), pas les données du conteneur (les volumes). Pour sauvegarder les données, il faut sauvegarder les volumes séparément.
- Ce n'est pas un système de versioning. Pour gérer les versions d'images, on utilise des tags et un registre. Le fichier `.tar` est une copie figée à un instant donné.

**Workflow offline complet** :

1. Sur la machine connectée : `podman pull` pour télécharger l'image
2. Sur la machine connectée : `podman save` pour exporter en fichier `.tar`
3. Transfert : copier le fichier `.tar` sur une clé USB
4. Sur la machine offline : `podman load` pour importer le fichier `.tar`

**Différence entre `podman save` et `podman export`** :

| Critère                | `podman save`                          | `podman export`                         |
| ---------------------- | -------------------------------------- | --------------------------------------- |
| Source                 | Une image                              | Un conteneur                            |
| Contenu du `.tar`      | Image complète avec toutes les couches | Système de fichiers à plat du conteneur |
| Métadonnées            | Conservées (CMD, ENV, EXPOSE, etc.)    | Perdues                                 |
| Réimportation          | `podman load`                          | `podman import`                         |
| Utilisation principale | Transférer une image entre machines    | Exporter le contenu d'un conteneur      |

---

### Qu'est-ce que le travail avec les registres privés ?

**Définition** : Un registre privé est un serveur qui stocke des images de conteneurs et dont l'accès est restreint par authentification (identifiant et mot de passe).

**Le problème que les registres privés résolvent** :

Sans registre privé, voici les problèmes rencontrés :

1. **Images publiques** : Tes images contenant du code propriétaire sont accessibles à tout le monde.
2. **Pas de contrôle d'accès** : N'importe qui peut télécharger ou modifier tes images.
3. **Dépendance externe** : Tu dépends de docker.io ou quay.io, qui peuvent être indisponibles.

**Comment les registres privés résolvent ces problèmes** :

| Problème               | Solution                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| Images publiques       | Le registre privé est accessible uniquement aux utilisateurs autorisés |
| Pas de contrôle d'accès | Chaque utilisateur a des droits spécifiques (lecture, écriture)      |
| Dépendance externe     | Le registre privé est hébergé par ton entreprise                     |

**Analogie concrète** : Un registre public est comme une bibliothèque municipale : tout le monde peut entrer et emprunter des livres. Un registre privé est comme la bibliothèque interne d'une entreprise : tu as besoin d'un badge d'employé pour y accéder.

**Ce que les registres privés ne sont PAS** :

- Ce n'est pas un outil de construction d'images. Le registre stocke des images déjà construites. Pour construire, tu utilises `podman build`.
- Ce n'est pas un système de sauvegarde. Tu dois avoir une stratégie de sauvegarde séparée.

**Registres privés courants** :

| Registre                  | Type            | URL par défaut              |
| ------------------------- | --------------- | --------------------------- |
| Quay.io                   | Cloud (Red Hat) | `quay.io`                   |
| Docker Hub                | Cloud           | `docker.io`                 |
| GitHub Container Registry | Cloud           | `ghcr.io`                   |
| Harbor                    | Auto-hébergé    | URL interne de l'entreprise |

---

## Étapes Pratiques

### Étape 1 : Inspecter un conteneur

```bash
# Lancer un conteneur Nginx en arrière-plan
podman run -d --name mon-nginx -p 8080:80 docker.io/library/nginx:alpine
```

```bash
# Afficher toutes les informations du conteneur au format JSON
podman inspect mon-nginx
```

**Résultat attendu** (extrait) :

```json
[
    {
        "Id": "a1b2c3d4...",
        "Name": "mon-nginx",
        "State": {
            "Status": "running",
            "Running": true
        },
        "NetworkSettings": {
            "IPAddress": "10.88.0.2"
        }
    }
]
```

Pour extraire une information précise :

```bash
# Extraire uniquement l'adresse IP du conteneur
podman inspect --format '{{.NetworkSettings.Networks.podman.IPAddress}}' mon-nginx
```

```bash
# Afficher les journaux du conteneur
podman logs mon-nginx
```

```bash
# Suivre les journaux en continu (Ctrl+C pour arrêter)
podman logs -f mon-nginx
```

```bash
# Lister les processus en cours dans le conteneur
podman top mon-nginx
```

```bash
# Afficher les statistiques CPU/mémoire (Ctrl+C pour arrêter)
podman stats mon-nginx
```

**Résultat attendu** :

```text
ID            NAME        CPU %   MEM USAGE / LIMIT   MEM %   NET I/O       BLOCK I/O   PIDS
a1b2c3d4e5f6  mon-nginx   0.07%   3.45MB / 8.00GB     0.04%   1.23kB/456B   0B/0B       2
```

```bash
# Ouvrir un shell interactif dans le conteneur
podman exec -it mon-nginx /bin/sh

# Dans le conteneur : vérifier la version de Nginx
nginx -v

# Quitter le shell du conteneur
exit
```

---

### Étape 2 : Limiter les ressources d'un conteneur

```bash
# Lancer un conteneur avec des limites de ressources
# --memory 256m : maximum 256 Mo de mémoire
# --cpus 0.5 : maximum la moitié d'un CPU
podman run -d --name nginx-limite --memory 256m --cpus 0.5 docker.io/library/nginx:alpine
```

```bash
# Vérifier les limites avec stats (--no-stream : affiche une seule fois)
podman stats nginx-limite --no-stream
```

**Résultat attendu** :

```text
ID            NAME           CPU %   MEM USAGE / LIMIT   MEM %   NET I/O   BLOCK I/O   PIDS
b2c3d4e5f6g7  nginx-limite   0.03%   2.10MB / 256MB      0.82%   0B/0B     0B/0B       2
```

Le champ `MEM USAGE / LIMIT` montre `256MB` comme limite.

```bash
# Nettoyer les conteneurs de test
podman stop mon-nginx nginx-limite
podman rm mon-nginx nginx-limite
```

---

### Étape 3 : Utiliser les labels SELinux

```bash
# Créer un dossier avec un fichier HTML de test
mkdir -p ~/podman-test/html
cat > ~/podman-test/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Test SELinux</title></head>
<body><h1>Le label SELinux fonctionne</h1></body>
</html>
EOF
```

```bash
# Monter le dossier avec le label :Z (privé : un seul conteneur)
podman run -d --name nginx-prive \
  -p 8081:80 \
  -v ~/podman-test/html:/usr/share/nginx/html:Z \
  docker.io/library/nginx:alpine
```

```bash
# Vérifier que le conteneur fonctionne
curl http://localhost:8081
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html>
<head><title>Test SELinux</title></head>
<body><h1>Le label SELinux fonctionne</h1></body>
</html>
```

```bash
# Nettoyer
podman stop nginx-prive && podman rm nginx-prive
```

---

### Étape 4 : Exporter une image pour usage offline

```bash
# Télécharger l'image Nginx Alpine
podman pull docker.io/library/nginx:alpine

# Exporter l'image dans un fichier tar
podman save -o nginx-alpine.tar docker.io/library/nginx:alpine

# Vérifier la taille du fichier
ls -lh nginx-alpine.tar
```

**Résultat attendu** :

```text
-rw-r--r--. 1 user user 43M Jan 15 10:45 nginx-alpine.tar
```

---

### Étape 5 : Supprimer et réimporter l'image

```bash
# Supprimer l'image locale
podman rmi docker.io/library/nginx:alpine

# Vérifier que l'image a été supprimée
podman images
```

L'image `nginx:alpine` ne doit plus apparaître dans la liste.

```bash
# Réimporter l'image depuis le fichier tar
podman load -i nginx-alpine.tar
```

**Résultat attendu** :

```text
Getting image source signatures
Copying blob a1b2c3d4e5f6 done
Copying config c3d4e5f6g7h8 done
Writing manifest to image destination
Loaded image: docker.io/library/nginx:alpine
```

```bash
# Vérifier que l'image est revenue
podman images
```

---

### Étape 6 : Lancer un conteneur depuis l'image réimportée

```bash
# Lancer un conteneur depuis l'image réimportée
podman run -d --name nginx-offline -p 8080:80 docker.io/library/nginx:alpine

# Vérifier que le conteneur fonctionne
curl http://localhost:8080
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
</html>
```

```bash
# Nettoyer
podman stop nginx-offline && podman rm nginx-offline
rm nginx-alpine.tar
```

---

## Commandes Utiles

| Commande                               | Action                                                   |
| -------------------------------------- | -------------------------------------------------------- |
| `podman inspect <conteneur>`           | Affiche la configuration du conteneur en JSON            |
| `podman inspect --format '<template>'` | Extrait une information précise avec un template Go      |
| `podman logs <conteneur>`              | Affiche les journaux (stdout/stderr) du conteneur        |
| `podman logs -f <conteneur>`           | Suit les journaux en temps réel                          |
| `podman top <conteneur>`               | Liste les processus en cours dans le conteneur           |
| `podman stats <conteneur>`             | Affiche la consommation CPU/mémoire en temps réel        |
| `podman stats --no-stream`             | Affiche les stats une seule fois (sans rafraîchissement) |
| `podman exec -it <conteneur> /bin/sh`  | Ouvre un shell interactif dans le conteneur              |
| `podman run --memory 512m`             | Limite la mémoire à 512 Mo                               |
| `podman run --cpus 1.5`               | Limite à 1,5 CPU                                         |
| `podman save -o fichier.tar <image>`   | Exporte une image en fichier tar                         |
| `podman load -i fichier.tar`           | Importe une image depuis un fichier tar                  |
| `podman login <registre>`              | Se connecte à un registre privé                          |

---

## Pièges Fréquents

### Piège 1 : `podman stats` ne montre rien

**Problème** : Tu lances `podman stats mon-conteneur` et la commande ne montre aucune ligne.

**Solution** : Le conteneur doit être en cours d'exécution (status "running"). Vérifie avec `podman ps` et redémarre-le avec `podman start` si nécessaire.

---

### Piège 2 : Utiliser `:Z` sur un volume partagé entre conteneurs

**Problème** : Tu montes le même dossier dans deux conteneurs avec `:Z`. Le deuxième conteneur ne peut pas accéder aux fichiers.

**Solution** : `:Z` (majuscule) est privé. Quand le deuxième conteneur ré-étiquette le dossier, le premier perd l'accès. Utiliser `:z` (minuscule) pour les volumes partagés :

```bash
# Correct : :z pour partager entre conteneurs
podman run -d -v ./html:/usr/share/nginx/html:z --name web1 nginx:alpine
podman run -d -v ./html:/usr/share/nginx/html:z --name web2 nginx:alpine
```

---

### Piège 3 : Confondre `podman save` et `podman export`

**Problème** : Tu utilises `podman export` pour transférer une image. Les métadonnées (CMD, ENV) sont perdues.

**Solution** : `podman save` pour les images, `podman export` pour le contenu d'un conteneur :

```bash
# Correct : save pour les images
podman save -o mon-image.tar mon-image:latest
podman load -i mon-image.tar

# export est pour exporter le filesystem d'un conteneur (cas rare)
podman export mon-conteneur -o contenu.tar
```

---

### Piège 4 : Fichier `.tar` volumineux

**Problème** : Le fichier `.tar` fait plusieurs Go.

**Solution** : Utiliser des images basées sur Alpine Linux :

```bash
# Image lourde : ~150 Mo
podman pull docker.io/library/php:8.3-fpm

# Image légère : ~30 Mo
podman pull docker.io/library/php:8.3-fpm-alpine
```

---

### Piège 5 : `podman login` échoue en mode rootless

**Problème** : Erreur de permissions sur le fichier d'authentification.

**Solution** : Créer le répertoire manuellement :

```bash
mkdir -p ${XDG_RUNTIME_DIR}/containers/
podman login quay.io
```

---

## Checklist de Validation

- [ ] J'ai inspecté un conteneur avec `podman inspect`
- [ ] J'ai consulté les journaux avec `podman logs`
- [ ] J'ai listé les processus avec `podman top`
- [ ] J'ai affiché les statistiques avec `podman stats`
- [ ] J'ai exécuté une commande avec `podman exec`
- [ ] J'ai lancé un conteneur avec des limites de mémoire et de CPU
- [ ] J'ai utilisé le label SELinux `:Z` sur un volume bind-mount
- [ ] J'ai exporté une image avec `podman save`
- [ ] J'ai réimporté une image avec `podman load`
- [ ] J'ai lancé un conteneur depuis l'image réimportée

---

## Exercice Pratique

**Énoncé** : Exporter une image PHP personnalisée en fichier `.tar`, la supprimer, la réimporter, et relancer un conteneur pour vérifier qu'elle fonctionne.

**Indications** :

- Crée un `Containerfile` qui part de `docker.io/library/php:8.3-cli-alpine` et ajoute un fichier `info.php` contenant `<?php phpinfo(); ?>`
- Construis l'image avec `podman build`
- Exporte l'image avec `podman save`
- Supprime l'image locale avec `podman rmi`
- Réimporte l'image avec `podman load`
- Lance un conteneur et vérifie que `php info.php` fonctionne

**Résultat attendu** : Le conteneur réimporté affiche les informations PHP, prouvant que l'image exportée/importée est intacte.

---

## Solution de l'Exercice

> **Note** : Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Créer le dossier de travail et le Containerfile :

```bash
mkdir -p ~/exercice-offline
cd ~/exercice-offline
```

```dockerfile
# Containerfile
FROM docker.io/library/php:8.3-cli-alpine

WORKDIR /app

# Créer le fichier info.php directement dans l'image
RUN echo '<?php phpinfo(); ?>' > /app/info.php

# Commande par défaut : exécuter le fichier info.php
CMD ["php", "/app/info.php"]
```

Construire et tester l'image :

```bash
# Construire l'image avec le tag "mon-php:offline"
podman build -t mon-php:offline .

# Vérifier que l'image fonctionne
podman run --rm mon-php:offline
```

**Résultat attendu** (extrait) :

```text
phpinfo()
PHP Version => 8.3.x
System => Linux ... x86_64
```

Exporter, supprimer, réimporter :

```bash
# Exporter l'image en fichier tar
podman save -o mon-php-offline.tar localhost/mon-php:offline

# Supprimer l'image locale
podman rmi localhost/mon-php:offline

# Vérifier la suppression (aucune sortie attendue)
podman images | grep mon-php

# Réimporter l'image
podman load -i mon-php-offline.tar
```

Vérifier que l'image réimportée fonctionne :

```bash
# Lancer un conteneur depuis l'image réimportée
podman run --rm mon-php:offline
```

**Résultat attendu** : La sortie est identique à celle obtenue avant l'export. L'image fonctionne.

Nettoyage :

```bash
rm -rf ~/exercice-offline
```

---

## Navigation

← Fiche précédente : **[Podman Compose et Quadlet](04-podman-compose.md)**
