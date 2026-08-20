---
tags:
  - Podman
  - Débutant
  - Pratique
description: "Les Pods dans Podman"
estimated_time: "95 min"
fiche_number: 3
total_fiches: 5
cursus: "Podman"
---

# 03 - Les Pods dans Podman

> **En bref** : À la fin de cette fiche, tu sauras créer et gérer des Pods Podman (groupes de conteneurs partageant le même réseau). Lecture estimée : 95 min.


## Prérequis

- Fiche **[02 - Gérer les Images et les Conteneurs](02-images-conteneurs.md)** (`02-images-conteneurs.md`)
- Fiche **[05 - Les Bases de Kubernetes](../../competences-metier/03-cloud-computing/05-kubernetes-bases.md)** pour le concept de Pod Kubernetes
- Savoir utiliser le terminal (ligne de commande)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Podman      | 5.x (exemples compatibles 4.x+) |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et gérer des Pods Podman (groupes de conteneurs partageant le même réseau).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Pod Podman ?

**Définition** : Un Pod Podman est un groupe de conteneurs qui partagent le même espace réseau. Les conteneurs d'un même Pod communiquent entre eux via `localhost`, comme s'ils étaient sur la même machine.

Le nom "Podman" vient de _POD MANager_ (gestionnaire de Pods). La gestion des Pods est une fonctionnalité centrale de Podman.

**Le problème que les Pods résolvent** :

Sans Pods, voici les problèmes rencontrés :

1. **Communication réseau complexe** : Pour que deux conteneurs communiquent, tu dois créer un réseau dédié, y connecter chaque conteneur, puis utiliser les noms de conteneurs comme adresses. Cela demande plusieurs commandes et une bonne compréhension du réseau.

2. **Ports en double** : Chaque conteneur expose ses propres ports. Si deux conteneurs veulent utiliser le port 80, il y a un conflit. Tu dois gérer manuellement les correspondances de ports.

3. **Pas de regroupement logique** : Quand tu as 10 conteneurs, tu ne sais pas lesquels vont ensemble. Arrêter un projet entier demande d'arrêter chaque conteneur un par un.

4. **Pas de compatibilité Kubernetes** : Si tu veux déployer ton application sur un cluster Kubernetes plus tard, tu dois réécrire toute la configuration. Il n'y a pas de pont entre le développement local et la production.

**Comment les Pods résolvent ces problèmes** :

| Problème | Solution apportée par les Pods |
| --- | --- |
| Communication réseau complexe | Les conteneurs du Pod partagent `localhost`. Pas besoin de réseau externe. |
| Ports en double | Les ports sont déclarés une seule fois, sur le Pod. Le Pod gère la distribution. |
| Pas de regroupement logique | Un Pod regroupe les conteneurs liés. Une commande arrête tout le groupe. |
| Pas de compatibilité Kubernetes | `podman generate kube` exporte le Pod en fichier YAML Kubernetes. |

**Analogie concrète** : Un Pod est comme une colocation dans un appartement. Les colocataires (les conteneurs) partagent la même adresse postale (la même adresse IP) et le même réseau Wi-Fi (`localhost`). Chaque colocataire a sa propre chambre (son propre système de fichiers), mais ils partagent la cuisine et le salon (le réseau). Le bail de l'appartement (le conteneur infra) existe même si tous les colocataires sont temporairement absents.

**Ce qu'un Pod Podman n'est PAS** :

- Un Pod n'est pas un `docker-compose`. Docker Compose est un outil qui orchestre plusieurs conteneurs via un fichier YAML. Un Pod Podman est un objet natif qui regroupe des conteneurs au niveau du réseau. Docker Compose gère aussi les volumes, les dépendances de démarrage et les variables d'environnement. Un Pod ne fait que partager le réseau.
- Un Pod Podman n'est pas un cluster Kubernetes. Kubernetes orchestre des Pods sur plusieurs machines (nœuds). Podman gère des Pods sur une seule machine. Podman ne fait pas de mise à l'échelle automatique, ni de redémarrage automatique en cas de panne.
- Un Pod n'est pas un réseau. Un réseau Podman (`podman network`) permet à des conteneurs séparés de communiquer. Un Pod va plus loin : les conteneurs partagent la même interface réseau.

---

### Qu'est-ce que le conteneur infra (pause) ?

**Définition** : Le conteneur infra (aussi appelé conteneur _pause_) est un conteneur spécial créé automatiquement à chaque création de Pod. Son rôle est de maintenir le namespace réseau du Pod actif.

**Le problème que le conteneur infra résout** :

Sans conteneur infra, voici les problèmes rencontrés :

1. **Réseau instable** : Si le premier conteneur du Pod s'arrête, l'espace réseau partagé disparaît. Les autres conteneurs perdent leur connexion réseau.

2. **Impossible de créer un Pod vide** : Sans conteneur infra, un Pod sans conteneur applicatif n'existerait pas. Tu ne pourrais pas préparer un Pod avant d'y ajouter des conteneurs.

3. **Adresse IP changeante** : Chaque fois qu'un conteneur redémarre, il pourrait obtenir une nouvelle adresse IP. Les autres conteneurs du Pod ne sauraient plus comment le joindre.

**Comment le conteneur infra résout ces problèmes** :

| Problème | Solution apportée par le conteneur infra |
| --- | --- |
| Réseau instable | Le conteneur infra maintient le namespace réseau même si tous les autres conteneurs s'arrêtent |
| Impossible de créer un Pod vide | Le conteneur infra existe dès la création du Pod, avant tout autre conteneur |
| Adresse IP changeante | L'adresse IP est liée au conteneur infra, pas aux conteneurs applicatifs |

**Analogie concrète** : Le conteneur infra est comme le boitier Wi-Fi dans un appartement en colocation. Même si tous les colocataires sont absents (les conteneurs applicatifs sont arrêtés), le boitier Wi-Fi reste allumé et l'adresse réseau de l'appartement reste active. Quand un colocataire revient, il retrouve immédiatement le réseau Wi-Fi fonctionnel.

**Ce que le conteneur infra n'est PAS** :

- Le conteneur infra n'est pas un conteneur que tu crées toi-même. Il est créé automatiquement par Podman quand tu crées un Pod. Tu ne dois jamais le créer manuellement.
- Le conteneur infra n'est pas gourmand en ressources. Il consomme moins de 1 Mo de mémoire et quasiment aucun processeur. Il exécute un processus minimal qui ne fait que "dormir".

**Identifier le conteneur infra** :

Quand tu listes les conteneurs d'un Pod, le conteneur infra apparaît avec l'image `localhost/podman-pause`. Podman 4.x construit cette image localement à partir d'un binaire intégré. Tu peux le reconnaître car son nom contient le mot `infra`.

```bash
# Lister tous les conteneurs, y compris le conteneur infra
podman ps -a --pod
```

```text
CONTAINER ID  IMAGE                          COMMAND     STATUS      NAMES             POD ID        PODNAME
a1b2c3d4e5f6  localhost/podman-pause:4.9.3                       Up          mon-pod-infra     f1e2d3c4b5a6  mon-pod
```

---

### Comment fonctionne le réseau partagé dans un Pod ?

**Définition** : Le réseau partagé d'un Pod signifie que tous les conteneurs du Pod utilisent la même interface réseau et la même adresse IP. Ils communiquent entre eux via `localhost` (adresse `127.0.0.1`).

**Le problème que le réseau partagé résout** :

Sans réseau partagé, voici les problèmes rencontrés :

1. **Résolution de noms complexe** : Pour contacter un autre conteneur, tu dois connaître son nom ou son adresse IP sur le réseau Docker-style. Cette adresse peut changer à chaque redémarrage.

2. **Configuration réseau spécifique** : Chaque outil (Nginx, PHP-FPM, base de données) doit être configuré avec l'adresse exacte de ses voisins. Si un conteneur change de nom, toutes les configurations doivent être mises à jour.

3. **Ports exposés multiples** : Chaque conteneur expose ses propres ports vers la machine hôte. Cela crée des conflits et complique la gestion.

**Comment le réseau partagé résout ces problèmes** :

| Problème | Solution apportée par le réseau partagé |
| --- | --- |
| Résolution de noms complexe | Tous les conteneurs utilisent `localhost`. Pas de nom à retenir. |
| Configuration réseau spécifique | L'adresse est toujours `localhost`. La configuration ne change jamais. |
| Ports exposés multiples | Seul le Pod expose des ports vers l'extérieur. Les conteneurs communiquent en interne sans exposer de ports. |

**Analogie concrète** : Le réseau partagé d'un Pod fonctionne comme les prises électriques d'un même appartement. Tous les appareils (conteneurs) sont branchés sur le même réseau électrique (la même interface réseau). Un appareil dans la cuisine peut utiliser le réseau sans avoir besoin de connaître l'adresse de l'appareil dans le salon. Ils sont tous sur le même circuit.

**Ce que le réseau partagé n'est PAS** :

- Le réseau partagé n'est pas un réseau Docker bridge. Un réseau Docker bridge connecte des conteneurs via des adresses IP séparées. Le réseau partagé d'un Pod donne la même adresse IP à tous les conteneurs.
- Le réseau partagé ne signifie pas que les conteneurs partagent leurs fichiers. Le réseau est partagé, mais chaque conteneur conserve son propre système de fichiers isolé.

**Exemple concret de communication** :

Dans un Pod contenant Nginx et PHP-FPM :

- Nginx écoute sur le port 80
- PHP-FPM écoute sur le port 9000
- Nginx contacte PHP-FPM via `localhost:9000`
- Le Pod expose le port 80 vers la machine hôte

<div class="diagram-design">
<p><a href="../../../diagrams/devops-01-podman-03-pods-podman-1.html">Comment fonctionne le réseau partagé dans un Pod ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-01-podman-03-pods-podman-1.html" title="Comment fonctionne le réseau partagé dans un Pod ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Quelle est la différence entre un Pod Podman et un Pod Kubernetes ?

**Définition** : Un Pod Podman et un Pod Kubernetes partagent le même concept fondamental (un groupe de conteneurs partageant le réseau), mais ils fonctionnent dans des environnements différents.

**Le problème que cette distinction résout** :

Sans comprendre la différence, voici les problèmes rencontrés :

1. **Confusion des fonctionnalités** : Tu pourrais croire que Podman fait tout ce que Kubernetes fait (mise à l'échelle, haute disponibilité, orchestration multi-nœuds). Ce n'est pas le cas.

2. **Mauvais choix d'outil** : Tu pourrais utiliser Podman en production pour un projet qui nécessite Kubernetes, ou inversement utiliser Kubernetes pour un simple développement local.

**Comparaison Pod Podman vs Pod Kubernetes** :

| Critère | Pod Podman | Pod Kubernetes |
| --- | --- | --- |
| Environnement | Machine locale (développement) | Cluster de serveurs (production) |
| Orchestration | Aucune. Tu gères manuellement. | Automatique. Kubernetes gère tout. |
| Mise à l'échelle | Manuelle. Tu crées les Pods un par un. | Automatique. Kubernetes ajoute des Pods selon la charge. |
| Haute disponibilité | Non. Si le Pod s'arrête, il reste arrêté. | Oui. Kubernetes redémarre les Pods automatiquement. |
| Réseau | Réseau local simple | Réseau virtuel complexe entre plusieurs machines |
| Stockage | Volumes locaux | Volumes persistants distribués |
| Fichier de configuration | Commandes CLI ou YAML | Fichiers YAML (manifests) |

**Le pont entre Podman et Kubernetes** :

Podman propose deux commandes pour faire le lien entre les deux mondes :

- `podman kube generate` : exporte un Pod Podman existant en fichier YAML compatible Kubernetes (ancienne syntaxe : `podman generate kube`, toujours acceptée)
- `podman kube play` : importe un fichier YAML Kubernetes et crée les Pods correspondants dans Podman (ancienne syntaxe : `podman play kube`, toujours acceptée)

Ces commandes permettent de développer localement avec Podman, puis de déployer sur Kubernetes sans réécrire la configuration.

---

## Étapes Pratiques

### Étape 1 : Créer un Pod vide

Un Pod vide est un Pod qui contient uniquement le conteneur infra. Tu y ajouteras des conteneurs applicatifs dans les étapes suivantes.

La commande `podman pod create` crée un nouveau Pod. L'option `-p` expose un port du Pod vers ta machine.

```bash
# Créer un Pod nommé "mon-pod" qui expose le port 8080 de ta machine vers le port 80 du Pod
podman pod create --name mon-pod -p 8080:80
```

L'option `-p 8080:80` signifie :

- `8080` : le port sur ta machine (tu accèderas à l'application via `http://localhost:8080`)
- `80` : le port à l'intérieur du Pod (Nginx écoute sur ce port)

**Résultat attendu** :

```text
f1e2d3c4b5a6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
```

Ce texte est l'identifiant unique du Pod. Tu n'as pas besoin de le retenir.

Vérifie que le Pod est bien créé :

```bash
# Lister tous les Pods
podman pod ls
```

**Résultat attendu** :

```text
POD ID        NAME     STATUS   CREATED        INFRA ID      # OF CONTAINERS
f1e2d3c4b5a6  mon-pod  Created  5 seconds ago  a1b2c3d4e5f6  1
```

Le Pod contient 1 conteneur : c'est le conteneur infra (pause), créé automatiquement.

---

### Étape 2 : Ajouter un conteneur Nginx au Pod

Tu vas maintenant ajouter un conteneur Nginx dans le Pod. L'option `--pod` indique dans quel Pod placer le conteneur.

```bash
# Ajouter un conteneur Nginx Alpine dans le Pod "mon-pod"
podman run -d --pod mon-pod --name nginx-web docker.io/library/nginx:alpine
```

Détail des options :

- `-d` : lance le conteneur en arrière-plan (mode détaché)
- `--pod mon-pod` : place le conteneur dans le Pod "mon-pod"
- `--name nginx-web` : donne le nom "nginx-web" au conteneur
- `docker.io/library/nginx:alpine` : utilise l'image Nginx Alpine (version légère)

Vérifie que Nginx fonctionne en ouvrant ton navigateur à l'adresse `http://localhost:8080`. Tu dois voir la page d'accueil Nginx ("Welcome to nginx!").

---

### Étape 3 : Ajouter un conteneur PHP-FPM au Pod

Tu vas ajouter un deuxième conteneur dans le même Pod. PHP-FPM écoute sur le port 9000.

```bash
# Ajouter un conteneur PHP-FPM dans le Pod "mon-pod"
podman run -d --pod mon-pod --name php-fpm docker.io/library/php:8.3-fpm
```

Détail des options :

- `-d` : arrière-plan
- `--pod mon-pod` : place le conteneur dans le Pod "mon-pod"
- `--name php-fpm` : nom du conteneur
- `docker.io/library/php:8.3-fpm` : image PHP 8.3 avec FPM (FastCGI Process Manager)

---

### Étape 4 : Vérifier les conteneurs du Pod

Plusieurs commandes permettent de vérifier l'état du Pod et de ses conteneurs.

```bash
# Voir l'état du Pod
podman pod ps
```

**Résultat attendu** :

```text
POD ID        NAME     STATUS   CREATED         INFRA ID      # OF CONTAINERS
f1e2d3c4b5a6  mon-pod  Running  2 minutes ago   a1b2c3d4e5f6  3
```

Le Pod contient maintenant 3 conteneurs : le conteneur infra + Nginx + PHP-FPM.

```bash
# Voir tous les conteneurs avec leur Pod d'appartenance
podman ps --pod
```

**Résultat attendu** :

```text
CONTAINER ID  IMAGE                          COMMAND               STATUS      NAMES           POD ID        PODNAME
a1b2c3d4e5f6  localhost/podman-pause:4.9.3                                 Up          mon-pod-infra   f1e2d3c4b5a6  mon-pod
b2c3d4e5f6a7  docker.io/library/nginx:alpine  nginx -g daemon off;  Up          nginx-web       f1e2d3c4b5a6  mon-pod
c3d4e5f6a7b8  docker.io/library/php:8.3-fpm   php-fpm               Up          php-fpm         f1e2d3c4b5a6  mon-pod
```

---

### Étape 5 : Vérifier la communication entre conteneurs

Les conteneurs du même Pod communiquent via `localhost`. Tu vas le vérifier en contactant PHP-FPM depuis le conteneur Nginx.

```bash
# Depuis le conteneur Nginx, envoyer une requête vers PHP-FPM sur localhost:9000
podman exec nginx-web sh -c "echo '' | nc -w 1 localhost 9000 && echo 'Connexion réussie' || echo 'Connexion échouée'"
```

**Résultat attendu** :

```text
Connexion réussie
```

Si tu vois "Connexion réussie", cela confirme que Nginx peut contacter PHP-FPM via `localhost:9000` sans réseau externe.

---

### Étape 6 : Exporter le Pod en YAML Kubernetes

Podman peut convertir un Pod existant en fichier YAML compatible Kubernetes. Ce fichier peut ensuite être utilisé pour déployer la même configuration sur un cluster Kubernetes.

```bash
# Générer un fichier YAML Kubernetes à partir du Pod "mon-pod"
podman generate kube mon-pod > mon-pod.yaml
```

**Résultat attendu** : un fichier `mon-pod.yaml` est créé dans le répertoire courant.

**Contenu du fichier généré** (simplifié) :

```yaml
# Fichier généré automatiquement par Podman
apiVersion: v1
kind: Pod
metadata:
  # Nom du Pod dans Kubernetes
  name: mon-pod
spec:
  containers:
    # Premier conteneur : Nginx
    - name: nginx-web
      image: docker.io/library/nginx:alpine
      ports:
        # Port exposé par le Pod
        - containerPort: 80
          hostPort: 8080
    # Deuxième conteneur : PHP-FPM
    - name: php-fpm
      image: docker.io/library/php:8.3-fpm
```

Explication de chaque section du YAML :

| Champ | Signification |
| --- | --- |
| `apiVersion: v1` | Version de l'API Kubernetes utilisée |
| `kind: Pod` | Type de ressource Kubernetes (ici un Pod) |
| `metadata.name` | Nom du Pod |
| `spec.containers` | Liste des conteneurs du Pod |
| `containers[].name` | Nom du conteneur |
| `containers[].image` | Image utilisée par le conteneur |
| `containers[].ports` | Ports exposés par le conteneur |

Tu peux aussi tester l'opération inverse : recréer un Pod à partir d'un fichier YAML :

```bash
# Supprimer le Pod existant avant de le recréer
podman pod rm -f mon-pod

# Recréer le Pod à partir du fichier YAML
podman play kube mon-pod.yaml
```

---

### Étape 7 : Nettoyer

Quand tu as terminé, supprime le Pod et tous ses conteneurs.

```bash
# Arrêter le Pod (arrête tous ses conteneurs)
podman pod stop mon-pod

# Supprimer le Pod (supprime tous ses conteneurs)
podman pod rm mon-pod
```

Vérifie que tout est bien supprimé :

```bash
# Vérifier qu'il n'y a plus de Pod
podman pod ls
```

**Résultat attendu** : la liste est vide. Le Pod et tous ses conteneurs ont été supprimés.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `podman pod create --name NOM -p PORT_HOTE:PORT_POD` | Créer un nouveau Pod avec un port exposé |
| `podman pod ls` | Lister tous les Pods |
| `podman pod ps` | Lister tous les Pods (alias de `pod ls`) |
| `podman pod start NOM` | Démarrer un Pod et tous ses conteneurs |
| `podman pod stop NOM` | Arrêter un Pod et tous ses conteneurs |
| `podman pod restart NOM` | Redémarrer un Pod et tous ses conteneurs |
| `podman pod rm NOM` | Supprimer un Pod et tous ses conteneurs |
| `podman pod rm -f NOM` | Forcer la suppression d'un Pod (même s'il tourne) |
| `podman pod inspect NOM` | Afficher les détails d'un Pod au format JSON |
| `podman ps --pod` | Lister les conteneurs avec leur Pod d'appartenance |
| `podman run -d --pod NOM --name CONTENEUR IMAGE` | Ajouter un conteneur dans un Pod existant |
| `podman generate kube NOM > fichier.yaml` | Exporter un Pod en fichier YAML Kubernetes |
| `podman play kube fichier.yaml` | Créer un Pod à partir d'un fichier YAML Kubernetes |

---

## Pièges Fréquents

### Piège 1 : Déclarer les ports sur le conteneur au lieu du Pod

**Problème** : Tu utilises `-p 8080:80` sur la commande `podman run` au lieu de la commande `podman pod create`.

```bash
# Incorrect : le port est déclaré sur le conteneur
podman run -d --pod mon-pod -p 8080:80 --name nginx-web nginx:alpine
```

L'erreur suivante apparaît :

```text
Error: cannot set port bindings on an existing pod network
```

**Solution** : Les ports doivent toujours être déclarés lors de la création du Pod, pas lors de l'ajout d'un conteneur.

```bash
# Correct : le port est déclaré sur le Pod
podman pod create --name mon-pod -p 8080:80
podman run -d --pod mon-pod --name nginx-web nginx:alpine
```

**Pourquoi** : Dans un Pod, c'est le conteneur infra qui gère le réseau. Les ports sont configurés sur le conteneur infra au moment de la création du Pod. Une fois le Pod créé, la configuration réseau ne peut plus être modifiée.

---

### Piège 2 : Oublier l'option --pod

**Problème** : Tu oublies `--pod mon-pod` dans la commande `podman run`. Le conteneur est créé en dehors du Pod.

```bash
# Incorrect : pas de --pod
podman run -d --name nginx-web nginx:alpine
```

Le conteneur fonctionne, mais il n'est pas dans le Pod. Il ne peut pas communiquer avec les autres conteneurs via `localhost`.

**Solution** : Vérifie toujours que l'option `--pod` est présente quand tu ajoutes un conteneur à un Pod.

```bash
# Correct : --pod est présent
podman run -d --pod mon-pod --name nginx-web nginx:alpine
```

**Comment détecter ce piège** : Utilise `podman ps --pod` pour vérifier que chaque conteneur est bien associé à un Pod. Si la colonne PODNAME est vide, le conteneur est isolé.

---

### Piège 3 : Supprimer le conteneur infra

**Problème** : Tu essaies de supprimer le conteneur infra manuellement.

```bash
# Incorrect : tentative de suppression du conteneur infra
podman rm mon-pod-infra
```

**Conséquence** : Supprimer le conteneur infra détruit tout le Pod et tous ses conteneurs. Le conteneur infra est le pilier du Pod.

**Solution** : Ne supprime jamais le conteneur infra directement. Pour supprimer un Pod, utilise `podman pod rm`.

```bash
# Correct : supprimer le Pod entier
podman pod rm mon-pod
```

---

### Piège 4 : Utiliser le nom du conteneur au lieu de localhost

**Problème** : Tu configures Nginx pour contacter PHP-FPM via le nom du conteneur, comme tu le ferais avec Docker Compose.

```nginx
# Incorrect : utilise le nom du conteneur (fonctionne avec Docker Compose, pas avec les Pods)
fastcgi_pass php-fpm:9000;
```

**Conséquence** : Nginx ne trouve pas PHP-FPM. Le message d'erreur est :

```text
upstream "php-fpm" could not be resolved
```

**Solution** : Dans un Pod, tous les conteneurs partagent `localhost`. Utilise `localhost` au lieu du nom du conteneur.

```nginx
# Correct : utilise localhost (fonctionnement Pod)
fastcgi_pass localhost:9000;
```

**Rappel** : Cette règle est spécifique aux Pods. En dehors d'un Pod (conteneurs isolés connectés via un réseau), tu utilises bien le nom du conteneur.

---

## Checklist de Validation

- J'ai compris qu'un Pod est un groupe de conteneurs partageant le même réseau
- J'ai compris le rôle du conteneur infra (pause)
- J'ai créé un Pod avec `podman pod create`
- J'ai ajouté au moins deux conteneurs dans un Pod avec `--pod`
- J'ai vérifié que les conteneurs communiquent via `localhost`
- J'ai listé les Pods avec `podman pod ls`
- J'ai listé les conteneurs avec `podman ps --pod`
- J'ai exporté un Pod en YAML avec `podman generate kube`
- J'ai nettoyé avec `podman pod stop` et `podman pod rm`
- Je sais que les ports se déclarent sur le Pod, pas sur les conteneurs

---

## Exercice Pratique

**Objectif** : Créer un Pod fonctionnel avec Nginx et PHP-FPM. Configurer Nginx pour transmettre les requêtes PHP à PHP-FPM via `localhost:9000`. Vérifier que la page PHP s'affiche dans le navigateur. Exporter le Pod en YAML Kubernetes.

**Étapes de l'exercice** :

1. Créer un Pod nommé `web-app` qui expose le port `8080` vers le port `80`
2. Ajouter un conteneur Nginx Alpine dans le Pod
3. Ajouter un conteneur PHP 8.3 FPM dans le Pod
4. Créer un fichier de configuration Nginx qui transmet les requêtes `.php` à PHP-FPM via `localhost:9000`
5. Créer un fichier `index.php` qui affiche `phpinfo()`
6. Copier les fichiers de configuration dans les conteneurs
7. Vérifier que `http://localhost:8080/index.php` affiche les informations PHP
8. Exporter le Pod en fichier YAML Kubernetes

**Indications** :

- Le fichier de configuration Nginx doit se trouver dans `/etc/nginx/conf.d/default.conf`
- Le fichier `index.php` doit se trouver dans `/var/www/html/` (dans les deux conteneurs : Nginx pour le servir, PHP-FPM pour l'exécuter)
- PHP-FPM écoute sur le port `9000` par défaut
- Utilise `podman cp` pour copier des fichiers dans un conteneur

**Résultat attendu** : La page `http://localhost:8080/index.php` affiche les informations PHP (version, extensions, configuration).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Créer le Pod

```bash
# Créer le Pod "web-app" avec le port 8080 exposé vers le port 80
podman pod create --name web-app -p 8080:80
```

### 2. Ajouter les conteneurs

```bash
# Ajouter Nginx dans le Pod
podman run -d --pod web-app --name web-nginx docker.io/library/nginx:alpine

# Ajouter PHP-FPM dans le Pod
podman run -d --pod web-app --name web-php docker.io/library/php:8.3-fpm
```

### 3. Créer le fichier de configuration Nginx

Crée un fichier `default.conf` sur ta machine avec ce contenu :

```nginx
server {
    # Nginx écoute sur le port 80
    listen 80;

    # Répertoire racine des fichiers web
    root /var/www/html;

    # Fichier par défaut
    index index.php index.html;

    # Traitement des fichiers PHP
    location ~ \.php$ {
        # Transmettre les requêtes PHP à PHP-FPM via localhost (réseau partagé du Pod)
        fastcgi_pass localhost:9000;

        # Fichier à exécuter
        fastcgi_index index.php;

        # Paramètre obligatoire : chemin du script PHP
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;

        # Inclure les paramètres FastCGI standard
        include fastcgi_params;
    }
}
```

### 4. Créer le fichier PHP

Crée un fichier `index.php` sur ta machine avec ce contenu :

```php
<?php
// Affiche toutes les informations de configuration PHP
phpinfo();
```

### 5. Copier les fichiers dans les conteneurs

```bash
# Copier la configuration Nginx dans le conteneur Nginx
podman cp default.conf web-nginx:/etc/nginx/conf.d/default.conf

# Copier le fichier PHP dans le conteneur Nginx (pour que Nginx puisse le servir)
podman cp index.php web-nginx:/var/www/html/index.php

# Copier le fichier PHP dans le conteneur PHP-FPM (pour que PHP-FPM puisse l'exécuter)
podman cp index.php web-php:/var/www/html/index.php
```

### 6. Redémarrer Nginx pour prendre en compte la configuration

```bash
# Redémarrer le conteneur Nginx pour appliquer la nouvelle configuration
podman restart web-nginx
```

### 7. Vérifier le résultat

Ouvre ton navigateur et accède à `http://localhost:8080/index.php`.

Tu dois voir la page d'informations PHP (version 8.3.x, extensions installées, configuration).

Si la page ne s'affiche pas, vérifie :

```bash
# Vérifier que tous les conteneurs tournent
podman ps --pod

# Vérifier les logs de Nginx en cas d'erreur
podman logs web-nginx

# Vérifier les logs de PHP-FPM en cas d'erreur
podman logs web-php
```

### 8. Exporter en YAML Kubernetes

```bash
# Exporter le Pod en fichier YAML compatible Kubernetes
podman generate kube web-app > web-app.yaml
```

### 9. Nettoyer

```bash
# Arrêter le Pod
podman pod stop web-app

# Supprimer le Pod et tous ses conteneurs
podman pod rm web-app

# Vérifier que tout est supprimé
podman pod ls
```

---

## Navigation

← Fiche précédente : **[Gérer les Images et les Conteneurs](02-images-conteneurs.md)**

→ Fiche suivante : **[Podman Compose et Quadlet](04-podman-compose.md)**
