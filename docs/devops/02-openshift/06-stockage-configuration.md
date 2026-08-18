---
tags:
  - OpenShift
  - Intermédiaire
  - Pratique
description: "Stockage et Configuration (Projet Intégrateur)"
estimated_time: "210 min"
fiche_number: 6
total_fiches: 6
cursus: "OpenShift"
---

# 06 - Stockage et Configuration (Projet Intégrateur)

> **En bref** : À la fin de cette fiche, tu sauras utiliser les PersistentVolumeClaims (PVC), les ConfigMaps et les Secrets dans OpenShift, et tu auras déployé une application complète PHP connectée à PostgreSQL avec du stockage persistant. Lecture estimée : 210 min.


## Prérequis

- Fiche **[05 - Builds et ImageStreams](05-builds-imagestreams.md)** (`05-builds-imagestreams.md`)
- Toutes les fiches précédentes du [cursus Podman](../01-podman/index.md)
- Toutes les fiches précédentes du [cursus OpenShift](index.md)
- CRC (CodeReady Containers) installé et démarré sur ta machine

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| OpenShift   | 4.14+   |
| PHP         | 8.3     |
| PostgreSQL  | 16      |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les PersistentVolumeClaims (PVC), les ConfigMaps et les Secrets dans OpenShift, et tu auras déployé une application complète PHP connectée à PostgreSQL avec du stockage persistant.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un PersistentVolumeClaim (PVC) ?

**Définition** : Un PersistentVolumeClaim (PVC) est une demande de stockage persistant adressée au cluster OpenShift. Le PVC réserve un espace disque qui survit au redémarrage et à la suppression des Pods.

**Le problème que les PVC résolvent** :

Sans PVC, voici les problèmes rencontrés :

1. **Données perdues au redémarrage** : Le système de fichiers d'un conteneur est éphémère. Quand un Pod redémarre (crash, mise à jour, suppression), toutes les données écrites dans le conteneur disparaissent. Une base de données PostgreSQL perd toutes ses tables et ses données.

2. **Pas de partage de données** : Deux Pods ne peuvent pas accéder aux mêmes fichiers. Si tu as un Pod qui écrit des fichiers et un autre qui doit les lire, il n'y a pas de mécanisme natif pour partager ces fichiers.

3. **Dépendance au Pod** : Les données sont liées au cycle de vie du Pod. Tu ne peux pas déplacer les données d'un Pod vers un autre sans les copier manuellement.

**Comment les PVC résolvent ces problèmes** :

| Problème                     | Solution apportée par les PVC                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Données perdues au redémarrage | Le PVC stocke les données en dehors du Pod. Le nouveau Pod se reconnecte au PVC       |
| Pas de partage de données    | Un PVC en mode ReadWriteMany peut être monté par plusieurs Pods en même temps          |
| Dépendance au Pod            | Le PVC existe indépendamment du Pod. Tu peux le connecter à n'importe quel Pod         |

**Analogie concrète** : Un PVC fonctionne comme la location d'un garde-meuble. Tu réserves un espace (le PVC) dans un entrepôt (le PersistentVolume). Quand tu déménages (Pod supprimé), tes affaires (données) restent dans le garde-meuble. Quand tu emménages dans un nouvel appartement (nouveau Pod), tu retournes chercher tes affaires dans le même garde-meuble. Le garde-meuble existe indépendamment de ton appartement.

**Ce qu'un PVC n'est PAS** :

- Un PVC n'est pas une sauvegarde (backup). Le PVC stocke les données de manière persistante, mais si le disque physique tombe en panne, les données sont perdues. Pour protéger les données contre les pannes matérielles, tu dois mettre en place des sauvegardes séparées.
- Un PVC n'est pas répliqué automatiquement. Les données ne sont pas copiées sur plusieurs disques par défaut. La réplication dépend du type de stockage configuré par l'administrateur du cluster.
- Un PVC n'est pas un volume Docker classique. Dans Docker, un volume est géré localement par le daemon Docker. Dans OpenShift, un PVC est une ressource Kubernetes gérée par le cluster, avec des politiques d'accès, des quotas et un provisionnement automatique.

**PVC et PV : deux ressources liées** :

| Ressource                   | Rôle                                                                  |
| --------------------------- | --------------------------------------------------------------------- |
| PersistentVolume (PV)       | L'espace de stockage réel disponible sur le cluster (le garde-meuble) |
| PersistentVolumeClaim (PVC) | La demande de stockage faite par ton application (le contrat de location) |

Dans CRC (ton cluster local), un PV est créé automatiquement quand tu crées un PVC. Tu n'as pas besoin de créer le PV manuellement.

**Modes d'accès des PVC** :

| Mode            | Abréviation | Signification                                      |
| --------------- | ----------- | -------------------------------------------------- |
| ReadWriteOnce   | RWO         | Un seul Pod peut lire et écrire sur ce volume      |
| ReadOnlyMany    | ROX         | Plusieurs Pods peuvent lire, mais aucun ne peut écrire |
| ReadWriteMany   | RWX         | Plusieurs Pods peuvent lire et écrire en même temps |

Le mode le plus courant est **ReadWriteOnce** (RWO). C'est le mode utilisé par les bases de données, car une seule instance doit écrire sur le disque.

---

### Qu'est-ce qu'une ConfigMap ?

**Définition** : Une ConfigMap est une ressource Kubernetes/OpenShift qui stocke des paires clé-valeur de configuration non sensible. Elle permet de séparer la configuration du code de l'application.

**Le problème que les ConfigMaps résolvent** :

Sans ConfigMap, voici les problèmes rencontrés :

1. **Configuration dans l'image** : Si tu mets la configuration directement dans l'image du conteneur, tu dois reconstruire l'image à chaque changement de configuration. Changer l'URL de la base de données demande un nouveau build et un nouveau déploiement.

2. **Pas de partage de configuration** : Si trois applications ont besoin de la même configuration (par exemple, l'URL d'un service externe), tu dois dupliquer cette configuration dans chaque image. Un changement d'URL demande de reconstruire trois images.

3. **Pas de séparation des environnements** : La même image doit fonctionner en développement et en production. Si la configuration est dans l'image, tu as besoin d'une image différente pour chaque environnement.

**Comment les ConfigMaps résolvent ces problèmes** :

| Problème                          | Solution apportée par les ConfigMaps                                        |
| --------------------------------- | --------------------------------------------------------------------------- |
| Configuration dans l'image        | La ConfigMap est externe à l'image. Tu modifies la ConfigMap sans rebuild   |
| Pas de partage de configuration   | Plusieurs Pods peuvent utiliser la même ConfigMap                           |
| Pas de séparation des environnements | Une image, plusieurs ConfigMaps (une par environnement)                  |

**Analogie concrète** : Une ConfigMap fonctionne comme un panneau d'affichage dans un bureau. Chaque employé (Pod) peut lire les informations affichées (horaires, numéros de téléphone, adresses). Si une information change, tu modifies le panneau sans modifier les bureaux des employés. Les employés viennent lire le panneau au besoin.

Le diagramme suivant montre comment un Pod accède aux trois types de ressources de configuration et de stockage.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-02-openshift-06-stockage-configuration-1.html">Qu&#x27;est-ce qu&#x27;une ConfigMap ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-02-openshift-06-stockage-configuration-1.html" title="Qu&#x27;est-ce qu&#x27;une ConfigMap ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Deux façons d'utiliser une ConfigMap** :

| Méthode                     | Description                                                               | Cas d'usage                        |
| --------------------------- | ------------------------------------------------------------------------- | ---------------------------------- |
| Variable d'environnement    | La valeur est injectée comme variable d'environnement dans le conteneur   | Paramètres simples (URL, port)     |
| Fichier monté               | La ConfigMap est montée comme un fichier dans le système de fichiers       | Fichiers de configuration complets |

**Ce qu'une ConfigMap n'est PAS** :

- Une ConfigMap n'est pas faite pour les données sensibles. Les ConfigMaps sont stockées en clair dans etcd (la base de données du cluster). Tout utilisateur ayant accès au namespace peut lire les ConfigMaps. Pour les mots de passe, tokens et clés, utilise un Secret.
- Une ConfigMap n'est pas un système de fichiers partagé. Elle est conçue pour de petites quantités de données (moins de 1 Mo). Pour stocker des fichiers volumineux, utilise un PVC.
- Une ConfigMap n'est pas rechargée automatiquement. Si tu modifies une ConfigMap, les Pods existants ne voient pas le changement immédiatement. Tu dois redémarrer les Pods (ou utiliser un mécanisme de rechargement).

**Comparaison ConfigMap vs variable d'environnement dans le Deployment** :

| Critère                 | Variable dans le Deployment                | ConfigMap                                     |
| ----------------------- | ------------------------------------------ | --------------------------------------------- |
| Emplacement             | Directement dans le fichier YAML du Deployment | Ressource séparée, réutilisable              |
| Partage entre Pods      | Impossible (chaque Deployment a ses propres valeurs) | Possible (plusieurs Deployments partagent)  |
| Modification            | Modifier le Deployment et redéployer       | Modifier la ConfigMap et redémarrer les Pods  |
| Fichiers de config      | Impossible                                 | Possible (montage en volume)                  |
| Lisibilité              | Mélangée avec la définition du Deployment  | Séparée, plus claire                          |

---

### Qu'est-ce qu'un Secret ?

**Définition** : Un Secret est une ressource Kubernetes/OpenShift qui stocke des données sensibles (mots de passe, tokens d'API, clés SSH, certificats TLS) encodées en base64.

**Le problème que les Secrets résolvent** :

Sans Secrets, voici les problèmes rencontrés :

1. **Mots de passe en clair dans le code** : Si tu mets le mot de passe de la base de données directement dans le fichier YAML du Deployment, toute personne ayant accès au code source voit le mot de passe.

2. **Mots de passe dans les images** : Si tu mets les credentials dans l'image du conteneur, toute personne ayant accès à l'image peut les extraire avec une simple commande `podman inspect`.

3. **Pas de contrôle d'accès** : Avec des variables d'environnement en clair, tu ne peux pas limiter qui voit les mots de passe. Tout développeur ayant accès au Deployment voit toutes les données.

**Comment les Secrets résolvent ces problèmes** :

| Problème                        | Solution apportée par les Secrets                                           |
| ------------------------------- | --------------------------------------------------------------------------- |
| Mots de passe en clair          | Les Secrets sont encodés en base64 et stockés séparément du code            |
| Mots de passe dans les images   | Les Secrets sont injectés au démarrage du Pod, pas dans l'image             |
| Pas de contrôle d'accès         | OpenShift permet de restreindre l'accès aux Secrets avec le RBAC            |

**ATTENTION** : base64 n'est PAS du chiffrement. C'est de l'encodage. N'importe qui peut décoder une valeur base64 avec la commande `echo "dmFsZXVy" | base64 -d`. Le base64 sert uniquement à stocker des données binaires dans un format texte. OpenShift peut chiffrer les Secrets au repos dans etcd (etcd encryption), mais ce n'est pas activé par défaut.

**Analogie concrète** : Un Secret fonctionne comme un coffre-fort dans un bureau. Les employés (Pods) qui en ont besoin reçoivent la combinaison (l'accès au Secret). Les autres employés ne voient pas le contenu du coffre. Le coffre existe séparément des bureaux (Pods). Si un employé quitte l'entreprise (Pod supprimé), le coffre et son contenu restent. L'encodage base64, c'est comme écrire le code du coffre à l'envers : ca décourage un regard rapide, mais ce n'est pas une vraie protection.

**Même utilisation que ConfigMap** :

Les Secrets s'utilisent exactement de la même façon que les ConfigMaps :

- Comme variable d'environnement dans le Pod
- Comme fichier monté dans le système de fichiers du Pod

**Ce qu'un Secret n'est PAS** :

- Un Secret n'est pas du chiffrement fort par défaut. L'encodage base64 est réversible instantanément. Pour un chiffrement réel, il faut configurer l'encryption at rest sur le cluster ou utiliser un outil comme HashiCorp Vault.
- Un Secret n'est pas un gestionnaire de mots de passe. Il ne génère pas de mots de passe, ne les fait pas tourner automatiquement, et ne vérifie pas leur force.
- Un Secret n'est pas invisible. Les administrateurs du cluster et les utilisateurs ayant les droits RBAC appropriés peuvent lire les Secrets.

**Comparaison ConfigMap vs Secret** :

| Critère         | ConfigMap                                | Secret                                        |
| --------------- | ---------------------------------------- | --------------------------------------------- |
| Type de données | Configuration non sensible               | Données sensibles (mots de passe, tokens)     |
| Encodage        | Texte en clair                           | Base64                                        |
| Accès RBAC      | Lecture libre dans le namespace           | Accès restreint possible via RBAC             |
| Affichage CLI   | `oc get configmap -o yaml` montre le contenu en clair | `oc get secret -o yaml` montre le base64 |
| Cas d'usage     | URLs, paramètres d'application, fichiers de config | Mots de passe, clés API, certificats TLS |
| Taille maximale | 1 Mo                                     | 1 Mo                                          |

---

### Qu'est-ce que les Security Context Constraints (SCC) ?

**Définition** : Les Security Context Constraints (SCC) sont des politiques de sécurité propres à OpenShift qui contrôlent ce que les Pods ont le droit de faire sur le cluster. Elles définissent les permissions et les restrictions de sécurité appliquées aux conteneurs.

**Le problème que les SCC résolvent** :

Sans SCC, voici les problèmes rencontrés :

1. **Conteneurs root** : Par défaut, beaucoup d'images Docker fonctionnent en tant que root (utilisateur administrateur). Un conteneur root compromis peut accéder aux fichiers du nœud (la machine physique qui héberge le cluster).

2. **Accès au système hôte** : Un conteneur pourrait monter le système de fichiers du nœud (`hostPath`) et lire ou modifier les fichiers de la machine hôte.

3. **Escalade de privilèges** : Un conteneur pourrait obtenir des privilèges supplémentaires (capabilities Linux) et compromettre d'autres conteneurs ou le cluster entier.

4. **Pas de politique uniforme** : Sans règles centrales, chaque développeur déploie ses conteneurs avec les permissions qu'il veut. Il n'y a pas de standard de sécurité.

**Comment les SCC résolvent ces problèmes** :

| Problème                     | Solution apportée par les SCC                                               |
| ---------------------------- | --------------------------------------------------------------------------- |
| Conteneurs root              | Le SCC `restricted-v2` interdit l'exécution en tant que root                |
| Accès au système hôte        | Le SCC `restricted-v2` interdit le montage de volumes `hostPath`            |
| Escalade de privilèges       | Le SCC `restricted-v2` bloque les capabilities dangereuses                  |
| Pas de politique uniforme    | Chaque Pod est soumis à un SCC. Les règles sont appliquées automatiquement  |

**Analogie concrète** : Les SCC fonctionnent comme les règles de sécurité d'un immeuble de bureaux. Par défaut, les employés (conteneurs) ont un badge basique (`restricted-v2`) qui leur donne accès à leur étage uniquement. Certains employés (conteneurs système) ont un badge spécial (`privileged`) qui ouvre toutes les portes. L'agent de sécurité (OpenShift) vérifie le badge de chaque personne avant de la laisser entrer.

**Les SCC principales** :

| SCC              | Exécution root | hostPath | Capabilities      | Cas d'usage                              |
| ---------------- | -------------- | -------- | ------------------ | ---------------------------------------- |
| `restricted-v2`  | Interdit       | Interdit | Minimales + seccomp | Applications standard (par défaut 4.11+) |
| `anyuid`     | Autorisé       | Interdit | Minimales          | Images Docker qui nécessitent root   |
| `privileged` | Autorisé       | Autorisé | Toutes             | Agents système, monitoring, stockage |

**Ce que les SCC ne sont PAS** :

- Les SCC ne sont pas des PodSecurityPolicies Kubernetes. OpenShift utilise son propre système (SCC) qui est plus strict et plus granulaire que les PodSecurityPolicies (désormais dépréciées dans Kubernetes).
- Les SCC ne sont pas un pare-feu réseau. Les SCC contrôlent les permissions système des conteneurs (root, volumes, capabilities). Pour le contrôle du trafic réseau entre Pods, OpenShift utilise les NetworkPolicies.

**Impact pratique** : Certaines images Docker populaires (par exemple, `nginx` officielle) tournent en tant que root. Dans OpenShift, ces images ne fonctionnent pas par défaut car le SCC `restricted-v2` l'interdit. Tu as deux solutions :

1. Utiliser une image adaptée qui ne nécessite pas root (par exemple, `nginx-unprivileged`)
2. Autoriser le SCC `anyuid` pour le service account du Pod (à éviter si possible)

---

### Qu'est-ce qu'un Template OpenShift ?

**Définition** : Un Template OpenShift est une ressource qui regroupe plusieurs objets Kubernetes/OpenShift (Deployment, Service, Route, PVC, Secret, etc.) avec des paramètres configurables. Il permet de déployer une stack complète en une seule commande.

**Le problème que les Templates résolvent** :

Sans Templates, voici les problèmes rencontrés :

1. **Déploiement manuel** : Pour déployer PostgreSQL, tu dois créer séparément un Deployment, un Service, un PVC, un Secret. Cela demande plusieurs fichiers YAML et plusieurs commandes `oc apply`.

2. **Pas de réutilisation** : Si tu veux déployer la même stack dans un autre projet, tu dois copier et modifier tous les fichiers YAML manuellement.

3. **Configuration dispersée** : Les paramètres (nom de la base, mot de passe, taille du stockage) sont dispersés dans plusieurs fichiers. Un oubli entraîne une incohérence.

**Comment les Templates résolvent ces problèmes** :

| Problème                  | Solution apportée par les Templates                                        |
| ------------------------- | -------------------------------------------------------------------------- |
| Déploiement manuel        | Un seul Template crée tous les objets nécessaires en une commande          |
| Pas de réutilisation      | Le même Template peut être utilisé dans plusieurs projets avec des paramètres différents |
| Configuration dispersée   | Les paramètres sont centralisés dans le Template avec des valeurs par défaut |

**Analogie concrète** : Un Template fonctionne comme un formulaire pré-rempli. Quand tu ouvres un compte bancaire, le formulaire (Template) contient déjà la structure : nom, adresse, type de compte. Tu n'as qu'à remplir tes informations personnelles (les paramètres). Le formulaire crée automatiquement tous les documents nécessaires (compte, carte, accès en ligne) en une seule opération.

**Ce qu'un Template n'est PAS** :

- Un Template n'est pas un Helm Chart. Helm est un gestionnaire de paquets Kubernetes avec un système de templating plus avancé (conditions, boucles, dépendances). Les Templates OpenShift sont plus simples : ils remplacent des paramètres par des valeurs.
- Un Template n'est pas un opérateur. Un opérateur gère le cycle de vie complet d'une application (installation, mise à jour, sauvegarde). Un Template crée les ressources initiales mais ne les gère pas ensuite.

**Templates prêts à l'emploi** :

OpenShift fournit des Templates dans le namespace `openshift` pour les applications courantes :

| Template                   | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `postgresql-persistent`    | PostgreSQL avec stockage persistant (PVC)      |
| `postgresql-ephemeral`     | PostgreSQL sans stockage persistant (données perdues au redémarrage) |
| `mysql-persistent`         | MySQL avec stockage persistant                 |
| `redis-ephemeral`          | Redis en mémoire                               |

Pour lister tous les Templates disponibles :

```bash
# Liste les Templates disponibles dans le namespace openshift
oc get templates -n openshift
```

---

## Étapes Pratiques (Projet Intégrateur)

Ce projet intégrateur combine tout ce que tu as appris dans les fiches précédentes. Tu vas déployer une application PHP connectée à une base de données PostgreSQL avec du stockage persistant, des ConfigMaps et des Secrets.

Le projet se compose de :

- Une base de données PostgreSQL avec un PVC pour la persistance des données
- Une ConfigMap pour la configuration non sensible (nom d'hôte, nom de la base)
- Un Secret pour les données sensibles (utilisateur, mot de passe)
- Une application PHP qui se connecte à PostgreSQL
- Une Route pour accéder à l'application depuis le navigateur

---

### Étape 1 : Créer le Project OpenShift

Crée un nouveau Project pour isoler toutes les ressources du projet intégrateur.

```bash
# Crée un nouveau Project nommé "projet-final"
oc new-project projet-final
```

**Résultat attendu** :

```text
Now using project "projet-final" on server "https://api.crc.testing:6443".
```

Vérifie que tu es bien dans le bon Project :

```bash
# Affiche le Project actif
oc project
```

**Résultat attendu** :

```text
Using project "projet-final" on server "https://api.crc.testing:6443".
```

---

### Étape 2 : Déployer PostgreSQL avec un PVC

Utilise le Template prédéfini `postgresql-persistent` pour déployer PostgreSQL avec un stockage persistant.

```bash
# Déploie PostgreSQL avec le Template "postgresql-persistent"
# --param définit les valeurs des paramètres du Template
oc new-app postgresql-persistent \
  --param POSTGRESQL_USER=app \
  --param POSTGRESQL_PASSWORD=secret123 \
  --param POSTGRESQL_DATABASE=mydb \
  --param VOLUME_CAPACITY=1Gi
```

Explication des paramètres :

- `POSTGRESQL_USER=app` : nom de l'utilisateur PostgreSQL
- `POSTGRESQL_PASSWORD=secret123` : mot de passe de l'utilisateur
- `POSTGRESQL_DATABASE=mydb` : nom de la base de données
- `VOLUME_CAPACITY=1Gi` : taille du stockage persistant (1 Go)

**Résultat attendu** :

```text
--> Deploying template "openshift/postgresql-persistent" to project projet-final

     PostgreSQL
     ---------
     PostgreSQL database service, with persistent storage.

     The following service(s) have been created in your project: postgresql.

     Username: app
     Password: secret123
     Database Name: mydb
     Connection URL: postgresql://postgresql:5432/

--> Creating resources ...
    secret "postgresql" created
    service "postgresql" created
    persistentvolumeclaim "postgresql" created
    deploymentconfig.apps.openshift.io "postgresql" created
--> Success
```

Le Template a créé quatre ressources : un Secret (contenant les credentials), un Service, un PVC et un DeploymentConfig.

**Note** : Le Template `postgresql-persistent` crée un DeploymentConfig (l'ancien type, déprécié). C'est normal : les Templates intégrés à OpenShift n'ont pas encore été mis à jour pour utiliser des Deployments. En production, on utiliserait un Operator PostgreSQL qui crée un Deployment standard.

Vérifie que le Pod PostgreSQL est en cours d'exécution :

```bash
# Liste les Pods du projet
oc get pods
```

**Résultat attendu** (attends quelques secondes que le Pod démarre) :

```text
NAME                  READY   STATUS    RESTARTS   AGE
postgresql-1-xxxxx    1/1     Running   0          30s
```

Le STATUS doit être `Running` et READY doit être `1/1`.

Vérifie que le PVC a été créé et lié à un PV :

```bash
# Liste les PersistentVolumeClaims
oc get pvc
```

**Résultat attendu** :

```text
NAME         STATUS   VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgresql   Bound    pv0001    1Gi        RWO            standard       30s
```

Le STATUS doit être `Bound`. Cela signifie que le PVC est lié à un PersistentVolume et que l'espace disque est réservé.

---

### Étape 3 : Créer une ConfigMap pour la configuration PHP

Crée une ConfigMap contenant les informations de connexion non sensibles.

```bash
# Crée une ConfigMap avec les informations de connexion non sensibles
oc create configmap php-config \
  --from-literal=DB_HOST=postgresql \
  --from-literal=DB_NAME=mydb \
  --from-literal=DB_PORT=5432
```

**Résultat attendu** :

```text
configmap/php-config created
```

Vérifie le contenu de la ConfigMap :

```bash
# Affiche le contenu de la ConfigMap au format YAML
oc get configmap php-config -o yaml
```

**Résultat attendu** :

```yaml
apiVersion: v1
data:
  DB_HOST: postgresql
  DB_NAME: mydb
  DB_PORT: "5432"
kind: ConfigMap
metadata:
  name: php-config
  namespace: projet-final
```

Les valeurs sont stockées en clair dans la section `data`. C'est normal pour une ConfigMap (données non sensibles).

---

### Étape 4 : Créer un Secret pour les credentials

Crée un Secret contenant les données de connexion sensibles.

```bash
# Crée un Secret avec les credentials de la base de données
oc create secret generic db-credentials \
  --from-literal=DB_USER=app \
  --from-literal=DB_PASSWORD=secret123
```

**Résultat attendu** :

```text
secret/db-credentials created
```

Vérifie le contenu du Secret :

```bash
# Affiche le contenu du Secret au format YAML
oc get secret db-credentials -o yaml
```

**Résultat attendu** :

```yaml
apiVersion: v1
data:
  DB_PASSWORD: c2VjcmV0MTIz
  DB_USER: YXBw
kind: Secret
metadata:
  name: db-credentials
  namespace: projet-final
type: Opaque
```

Les valeurs sont encodées en base64 (`c2VjcmV0MTIz` est `secret123` encodé, `YXBw` est `app` encodé). Rappel : base64 n'est PAS du chiffrement.

Pour vérifier le décodage :

```bash
# Décode la valeur base64 du mot de passe
echo "c2VjcmV0MTIz" | base64 -d
```

**Résultat attendu** :

```text
secret123
```

---

### Étape 5 : Créer l'application PHP

Crée un répertoire de travail pour le code source de l'application.

```bash
# Crée le répertoire du projet
mkdir -p ~/projet-final
```

Crée le fichier `index.php` qui se connecte à PostgreSQL et affiche les messages :

```bash
# Crée le fichier index.php
cd ~/projet-final
```

Contenu du fichier `index.php` :

```php
<?php
// Récupère les informations de connexion depuis les variables d'environnement
// Ces variables sont injectées par la ConfigMap et le Secret
$host     = getenv('DB_HOST');     // Vient de la ConfigMap
$port     = getenv('DB_PORT');     // Vient de la ConfigMap
$dbname   = getenv('DB_NAME');     // Vient de la ConfigMap
$user     = getenv('DB_USER');     // Vient du Secret
$password = getenv('DB_PASSWORD'); // Vient du Secret

// Construit la chaîne de connexion PostgreSQL
$dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";

try {
    // Se connecte à PostgreSQL avec PDO
    $pdo = new PDO($dsn, $user, $password);

    // Configure PDO pour afficher les erreurs sous forme d'exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crée la table "messages" si elle n'existe pas encore
    // IF NOT EXISTS évite une erreur si la table existe déjà
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            texte VARCHAR(255) NOT NULL,
            date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Vérifie si la table est vide
    $count = $pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();

    // Insère un message initial uniquement si la table est vide
    if ($count == 0) {
        $stmt = $pdo->prepare("INSERT INTO messages (texte) VALUES (:texte)");
        $stmt->execute(['texte' => 'Hello OpenShift !']);
    }

    // Récupère tous les messages de la table, triés par date
    $messages = $pdo->query("SELECT * FROM messages ORDER BY date_creation")->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Affiche l'erreur si la connexion échoue
    echo "<h1>Erreur de connexion</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Projet Final OpenShift</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #ee0000; color: white; }
        .success { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Projet Final - OpenShift</h1>
    <p class="success">Connexion a PostgreSQL reussie.</p>
    <p>Base de donnees : <?php echo htmlspecialchars($dbname); ?></p>
    <p>Hote : <?php echo htmlspecialchars($host); ?>:<?php echo htmlspecialchars($port); ?></p>

    <h2>Messages</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Texte</th>
            <th>Date</th>
        </tr>
        <?php foreach ($messages as $msg): ?>
        <tr>
            <td><?php echo htmlspecialchars($msg['id']); ?></td>
            <td><?php echo htmlspecialchars($msg['texte']); ?></td>
            <td><?php echo htmlspecialchars($msg['date_creation']); ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
    <p>Nombre total de messages : <?php echo count($messages); ?></p>
</body>
</html>
```

Crée le fichier `Containerfile` pour construire l'image :

```dockerfile
# Utilise l'image UBI9 PHP 8.3 de Red Hat (conçue pour OpenShift, tourne en non-root)
FROM registry.access.redhat.com/ubi9/php-83:latest

# Copie le fichier index.php dans le répertoire web
COPY index.php /opt/app-root/src/index.php

# L'extension pdo_pgsql est déjà incluse dans l'image UBI9 PHP
# Le port 8080 est le port par défaut de cette image (non-root)
EXPOSE 8080

# La commande de démarrage est configurée automatiquement par l'image UBI
```

Points importants du Containerfile :

- L'image UBI9 (Universal Base Image) de Red Hat est conçue pour OpenShift : elle tourne en non-root et écoute sur le port 8080
- L'extension `pdo_pgsql` est déjà incluse dans l'image UBI PHP
- Pas besoin de modifier les permissions ni les ports : tout est préconfiguré pour être compatible avec le SCC `restricted-v2`

Crée le build dans OpenShift :

```bash
# Crée un BuildConfig de type Docker (binary) nommé "php-app"
oc new-build --strategy=docker --binary=true --name=php-app
```

**Résultat attendu** :

```text
--> Found Docker image ...
    * A Docker build using binary input will be created
    * The resulting image will be pushed to image stream tag "php-app:latest"

--> Creating resources with label build=php-app ...
    imagestream.image.openshift.io "php-app" created
    buildconfig.build.openshift.io "php-app" created
--> Success
```

Lance le build en envoyant les fichiers sources :

```bash
# Lance le build en envoyant le contenu du répertoire courant
cd ~/projet-final
oc start-build php-app --from-dir=. --follow
```

Le flag `--follow` affiche les logs du build en temps réel.

**Résultat attendu** :

```text
Uploading directory "." as binary input for the build ...
...
Sending build context to Docker daemon  3.072kB
Step 1/3 : FROM registry.access.redhat.com/ubi9/php-83:latest
 ---> abc123def456
Step 2/3 : COPY index.php /opt/app-root/src/index.php
...
Step 3/3 : EXPOSE 8080
 ---> Running in xyz789
Successfully built abc123def456
Pushing image image-registry.openshift-image-registry.svc:5000/projet-final/php-app:latest ...
Push successful
```

Vérifie que le build est terminé :

```bash
# Liste les builds
oc get builds
```

**Résultat attendu** :

```text
NAME        TYPE     FROM     STATUS     STARTED          DURATION
php-app-1   Docker   Binary   Complete   2 minutes ago    1m30s
```

Le STATUS doit être `Complete`.

---

### Étape 6 : Déployer l'application avec ConfigMap et Secret

Crée le fichier `deployment.yaml` qui définit le Deployment de l'application PHP.

```yaml
# deployment.yaml
# Déploiement de l'application PHP avec ConfigMap et Secret
apiVersion: apps/v1
kind: Deployment
metadata:
  # Nom du Deployment
  name: php-app
  labels:
    app: php-app
spec:
  # Nombre de réplicas (Pods) à créer
  replicas: 1
  selector:
    matchLabels:
      app: php-app
  template:
    metadata:
      labels:
        app: php-app
    spec:
      containers:
        - name: php-app
          # Chemin de l'image dans le registre interne OpenShift
          # Format : registre/namespace/nom-image:tag
          image: image-registry.openshift-image-registry.svc:5000/projet-final/php-app:latest
          ports:
            # Port sur lequel le conteneur écoute
            - containerPort: 8080
          envFrom:
            # Injecte TOUTES les clés de la ConfigMap comme variables d'environnement
            # DB_HOST, DB_NAME, DB_PORT seront disponibles dans le conteneur
            - configMapRef:
                name: php-config
            # Injecte TOUTES les clés du Secret comme variables d'environnement
            # DB_USER, DB_PASSWORD seront disponibles dans le conteneur
            - secretRef:
                name: db-credentials
```

Explication de la section `envFrom` :

| Bloc              | Source           | Variables injectées          |
| ----------------- | ---------------- | ---------------------------- |
| `configMapRef`    | `php-config`     | `DB_HOST`, `DB_NAME`, `DB_PORT` |
| `secretRef`       | `db-credentials` | `DB_USER`, `DB_PASSWORD`     |

Ces variables seront accessibles dans le code PHP via `getenv('DB_HOST')`, `getenv('DB_USER')`, etc.

Applique le Deployment :

```bash
# Applique le fichier YAML pour créer le Deployment
cd ~/projet-final
oc apply -f deployment.yaml
```

**Résultat attendu** :

```text
deployment.apps/php-app created
```

Vérifie que le Pod est en cours d'exécution :

```bash
# Liste les Pods du projet
oc get pods
```

**Résultat attendu** :

```text
NAME                       READY   STATUS    RESTARTS   AGE
php-app-5d4f8b7c6-abcde   1/1     Running   0          15s
postgresql-1-xxxxx         1/1     Running   0          5m
```

Les deux Pods doivent avoir le STATUS `Running`.

---

### Étape 7 : Créer le Service et la Route

Crée un Service pour exposer le Deployment à l'intérieur du cluster :

```bash
# Crée un Service qui cible les Pods avec le label "app=php-app" sur le port 8080
oc expose deployment php-app --port=8080
```

**Résultat attendu** :

```text
service/php-app exposed
```

Vérifie le Service :

```bash
# Affiche les détails du Service
oc get service php-app
```

**Résultat attendu** :

```text
NAME      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
php-app   ClusterIP   172.25.100.50   <none>        8080/TCP   10s
```

Crée une Route pour rendre l'application accessible depuis l'extérieur du cluster :

```bash
# Crée une Route HTTP qui pointe vers le Service "php-app"
oc expose service php-app
```

**Résultat attendu** :

```text
route.route.openshift.io/php-app exposed
```

Récupère l'URL de la Route :

```bash
# Affiche les Routes du projet
oc get routes
```

**Résultat attendu** :

```text
NAME      HOST/PORT                                PATH   SERVICES   PORT   TERMINATION   WILDCARD
php-app   php-app-projet-final.apps-crc.testing           php-app    8080                 None
```

Accède à l'application dans ton navigateur :

```bash
# Teste l'accès à l'application avec curl
curl http://php-app-projet-final.apps-crc.testing
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Projet Final OpenShift</title>
    ...
</head>
<body>
    <h1>Projet Final - OpenShift</h1>
    <p class="success">Connexion a PostgreSQL reussie.</p>
    <p>Base de donnees : mydb</p>
    <p>Hote : postgresql:5432</p>

    <h2>Messages</h2>
    <table>
        <tr><th>ID</th><th>Texte</th><th>Date</th></tr>
        <tr><td>1</td><td>Hello OpenShift !</td><td>2025-01-15 14:30:00</td></tr>
    </table>
    <p>Nombre total de messages : 1</p>
</body>
</html>
```

Si tu vois "Connexion a PostgreSQL réussie" et le message "Hello OpenShift !", l'application fonctionne correctement.

---

### Étape 8 : Vérifier la persistance des données

Cette étape vérifie que les données survivent à la suppression du Pod PostgreSQL. C'est le test le plus important de cette fiche.

Identifie le nom exact du Pod PostgreSQL :

```bash
# Liste les Pods pour trouver le nom exact du Pod PostgreSQL
oc get pods
```

**Résultat attendu** :

```text
NAME                       READY   STATUS    RESTARTS   AGE
php-app-5d4f8b7c6-abcde   1/1     Running   0          3m
postgresql-1-xxxxx         1/1     Running   0          8m
```

Supprime le Pod PostgreSQL (remplace `postgresql-1-xxxxx` par le nom exact affiché) :

```bash
# Supprime le Pod PostgreSQL
# OpenShift va automatiquement recréer un nouveau Pod grâce au DeploymentConfig
oc delete pod postgresql-1-xxxxx
```

**Résultat attendu** :

```text
pod "postgresql-1-xxxxx" deleted
```

Attends que le nouveau Pod soit prêt :

```bash
# Observe les Pods en temps réel (Ctrl+C pour quitter)
oc get pods -w
```

**Résultat attendu** :

```text
NAME                       READY   STATUS              RESTARTS   AGE
php-app-5d4f8b7c6-abcde   1/1     Running             0          5m
postgresql-1-yyyyy         0/1     ContainerCreating   0          5s
postgresql-1-yyyyy         1/1     Running             0          15s
```

Le nouveau Pod PostgreSQL (`postgresql-1-yyyyy`) a un nom différent de l'ancien (`postgresql-1-xxxxx`). C'est normal : c'est un nouveau Pod, mais il est connecté au même PVC.

Vérifie que les données sont toujours présentes :

```bash
# Accède à l'application pour vérifier que les messages sont toujours là
curl http://php-app-projet-final.apps-crc.testing
```

**Résultat attendu** : La page affiche toujours le message "Hello OpenShift !" avec la même date. Les données ont survécu à la suppression du Pod grâce au PVC.

Si les données sont toujours là, le PVC fonctionne correctement. Le nouveau Pod PostgreSQL a récupéré les données depuis le volume persistant.

---

### Étape 9 : Nettoyer le projet

Quand tu as terminé, supprime le Project et toutes ses ressources :

```bash
# Supprime le Project et TOUTES les ressources qu'il contient
# (Pods, Services, Routes, PVC, ConfigMaps, Secrets, Builds, ImageStreams)
oc delete project projet-final
```

**Résultat attendu** :

```text
project.project.openshift.io "projet-final" deleted
```

Cette commande supprime tout. Tu n'as pas besoin de supprimer les ressources une par une.

Vérifie que le Project est bien supprimé :

```bash
# Liste les Projects existants
oc projects
```

Le Project `projet-final` ne doit plus apparaître dans la liste.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `oc get pvc` | Liste les PersistentVolumeClaims du projet |
| `oc get pv` | Liste les PersistentVolumes du cluster |
| `oc describe pvc <nom>` | Affiche les détails d'un PVC (taille, mode, PV lié) |
| `oc create configmap <nom> --from-literal=CLE=VALEUR` | Crée une ConfigMap avec une paire clé-valeur |
| `oc create configmap <nom> --from-file=<fichier>` | Crée une ConfigMap depuis un fichier |
| `oc get configmap <nom> -o yaml` | Affiche le contenu d'une ConfigMap |
| `oc create secret generic <nom> --from-literal=CLE=VALEUR` | Crée un Secret avec une paire clé-valeur |
| `oc get secret <nom> -o yaml` | Affiche le contenu d'un Secret (valeurs en base64) |
| `oc set env deployment/<nom> --from=configmap/<cm>` | Injecte une ConfigMap dans un Deployment existant |
| `oc set env deployment/<nom> --from=secret/<secret>` | Injecte un Secret dans un Deployment existant |
| `oc set volume deployment/<nom> --add --type=pvc --claim-name=<pvc> --mount-path=<chemin>` | Monte un PVC dans un Deployment |
| `oc get templates -n openshift` | Liste les Templates disponibles |
| `oc process <template> --parameters` | Affiche les paramètres d'un Template |
| `oc describe scc <nom>` | Affiche les détails d'un SCC |
| `oc get pods -o wide` | Liste les Pods avec des détails supplémentaires (nœud, IP) |

---

## Pièges Fréquents

### Piège 1 : Confondre encodage base64 et chiffrement

**Problème** : Tu penses que les Secrets sont chiffrés et donc protégés. En réalité, n'importe qui peut décoder le base64.

**Explication** : L'encodage base64 transforme des données binaires en texte. Ce n'est pas une protection. La commande suivante décode n'importe quel Secret :

```bash
# Décode une valeur base64 - c'est aussi simple que cela
echo "c2VjcmV0MTIz" | base64 -d
```

**Résultat** :

```text
secret123
```

**Solution** : Ne considère jamais le base64 comme une protection. Les Secrets Kubernetes protègent les données grâce au contrôle d'accès RBAC (qui peut lire les Secrets), pas grâce à l'encodage. Pour un chiffrement réel, configure l'encryption at rest sur le cluster.

---

### Piège 2 : PVC en status Pending

**Problème** : Tu crées un PVC et il reste en status `Pending` au lieu de `Bound`.

```bash
# Le PVC reste en Pending
oc get pvc
```

```text
NAME         STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgresql   Pending                                       standard       2m
```

**Explication** : Le PVC attend qu'un PersistentVolume (PV) correspondant soit disponible. Dans CRC, les PV sont créés automatiquement, mais il peut y avoir un délai.

**Solution** : Vérifie les PV disponibles :

```bash
# Liste les PersistentVolumes du cluster
oc get pv
```

Si aucun PV n'est disponible, attends quelques secondes. Dans CRC, le provisionnement est automatique. Si le problème persiste, vérifie que le StorageClass est correct :

```bash
# Affiche les StorageClasses disponibles
oc get storageclass
```

---

### Piège 3 : SCC restricted bloque le Pod

**Problème** : Tu déploies une image Docker qui tourne en root, et le Pod reste en status `CrashLoopBackOff` ou `Error`.

```bash
# Le Pod ne démarre pas
oc get pods
```

```text
NAME                    READY   STATUS             RESTARTS   AGE
mon-app-abc123-xyz89    0/1     CrashLoopBackOff   3          2m
```

**Explication** : OpenShift applique le SCC `restricted-v2` par défaut. Ce SCC interdit l'exécution en tant que root. Les images Docker officielles (nginx, httpd, etc.) tournent souvent en root.

**Solution 1** (recommandée) : Utilise une image qui ne nécessite pas root. Adapte ton Containerfile comme dans l'étape 5 de cette fiche (port 8080, permissions ajustées).

**Solution 2** (à éviter en production) : Autorise le SCC `anyuid` pour le service account par défaut du projet :

```bash
# Autorise le SCC anyuid pour le service account "default"
# ATTENTION : cela réduit la sécurité du projet
oc adm policy add-scc-to-user anyuid -z default
```

---

### Piège 4 : Modification d'une ConfigMap sans effet

**Problème** : Tu modifies une ConfigMap, mais les Pods utilisent toujours les anciennes valeurs.

**Explication** : Les variables d'environnement sont lues une seule fois au démarrage du Pod. Modifier la ConfigMap ne redémarre pas les Pods automatiquement.

**Solution** : Redémarre les Pods après avoir modifié la ConfigMap :

```bash
# Redémarre tous les Pods du Deployment "php-app"
# Cette commande supprime les Pods existants et en crée de nouveaux
oc rollout restart deployment/php-app
```

Les nouveaux Pods liront les valeurs mises à jour de la ConfigMap.

---

### Piège 5 : Service introuvable depuis un autre Pod

**Problème** : Le code PHP essaie de se connecter à `postgresql` mais obtient une erreur "host not found".

**Explication** : Le Service DNS dans OpenShift utilise le nom du Service comme nom d'hôte. Si le Service s'appelle `postgresql`, alors le nom d'hôte est `postgresql` (ou `postgresql.projet-final.svc.cluster.local` en forme complète).

**Solution** : Vérifie que le Service existe et que son nom correspond à la valeur dans la ConfigMap :

```bash
# Liste les Services du projet
oc get services
```

```text
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
php-app      ClusterIP   172.25.100.50   <none>        8080/TCP   5m
postgresql   ClusterIP   172.25.100.60   <none>        5432/TCP   10m
```

Le nom du Service (`postgresql`) doit correspondre exactement à la valeur `DB_HOST` dans la ConfigMap.

---

## Checklist de Validation

- [ ] PostgreSQL est déployé avec un PVC en status `Bound`
- [ ] La ConfigMap `php-config` est créée avec les clés `DB_HOST`, `DB_NAME`, `DB_PORT`
- [ ] Le Secret `db-credentials` est créé avec les clés `DB_USER`, `DB_PASSWORD`
- [ ] L'application PHP est construite et déployée (Pod en status `Running`)
- [ ] Le Deployment utilise `envFrom` pour injecter la ConfigMap et le Secret
- [ ] La Route est accessible dans le navigateur
- [ ] La page affiche "Connexion a PostgreSQL réussie" et le message "Hello OpenShift !"
- [ ] Après suppression du Pod PostgreSQL, les données sont toujours présentes (PVC fonctionnel)
- [ ] Le Project est nettoyé avec `oc delete project`

---

## Exercice Pratique (Projet Intégrateur Final)

**Énoncé** : Déploie une application PHP complète connectée à PostgreSQL dans OpenShift, avec stockage persistant, ConfigMap et Secret. L'application doit :

1. Se connecter à PostgreSQL en utilisant les variables d'environnement (ConfigMap + Secret)
2. Créer une table `messages` avec les colonnes `id`, `texte` et `date_creation`
3. Insérer un message "Hello OpenShift !" au premier chargement
4. Afficher tous les messages de la table sur la page web

**Vérification de la persistance** : Supprime le Pod PostgreSQL, attends que le nouveau Pod démarre, recharge la page. Les messages doivent toujours être affichés.

**Indications** :

- Utilise le Template `postgresql-persistent` pour déployer PostgreSQL
- Crée une ConfigMap pour `DB_HOST`, `DB_NAME`, `DB_PORT`
- Crée un Secret pour `DB_USER`, `DB_PASSWORD`
- Utilise un Containerfile basé sur l'image UBI9 PHP (`registry.access.redhat.com/ubi9/php-83:latest`)
- L'image UBI écoute sur le port 8080 par défaut (compatible SCC `restricted-v2`)
- Utilise `envFrom` dans le Deployment pour injecter les variables
- Expose l'application via un Service et une Route

**Résultat attendu** :

- L'URL de la Route affiche une page HTML avec le titre "Projet Final - OpenShift"
- La page affiche "Connexion a PostgreSQL réussie"
- La table des messages contient au moins une ligne "Hello OpenShift !"
- Après suppression du Pod PostgreSQL, les messages sont toujours là

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 : Créer le Project**

```bash
# Crée le Project
oc new-project projet-final
```

---

**Partie 2 : Déployer PostgreSQL**

```bash
# Déploie PostgreSQL avec stockage persistant
oc new-app postgresql-persistent \
  --param POSTGRESQL_USER=app \
  --param POSTGRESQL_PASSWORD=secret123 \
  --param POSTGRESQL_DATABASE=mydb \
  --param VOLUME_CAPACITY=1Gi
```

Attends que le Pod soit prêt :

```bash
# Vérifie que le Pod est Running
oc get pods -w
```

Attends de voir `1/1 Running` pour le Pod `postgresql-1-xxxxx`, puis appuie sur Ctrl+C.

---

**Partie 3 : Créer la ConfigMap**

```bash
# Crée la ConfigMap avec les paramètres non sensibles
oc create configmap php-config \
  --from-literal=DB_HOST=postgresql \
  --from-literal=DB_NAME=mydb \
  --from-literal=DB_PORT=5432
```

---

**Partie 4 : Créer le Secret**

```bash
# Crée le Secret avec les credentials
oc create secret generic db-credentials \
  --from-literal=DB_USER=app \
  --from-literal=DB_PASSWORD=secret123
```

---

**Partie 5 : Créer les fichiers sources**

Crée le répertoire :

```bash
# Crée le répertoire de travail
mkdir -p ~/projet-final
cd ~/projet-final
```

Crée le fichier `index.php` avec le contenu suivant :

```php
<?php
// Récupère les informations de connexion depuis les variables d'environnement
$host     = getenv('DB_HOST');
$port     = getenv('DB_PORT');
$dbname   = getenv('DB_NAME');
$user     = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

// Construit la chaîne de connexion PostgreSQL au format DSN
$dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";

try {
    // Se connecte à PostgreSQL
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crée la table si elle n'existe pas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            texte VARCHAR(255) NOT NULL,
            date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Insère le message initial si la table est vide
    $count = $pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();
    if ($count == 0) {
        $stmt = $pdo->prepare("INSERT INTO messages (texte) VALUES (:texte)");
        $stmt->execute(['texte' => 'Hello OpenShift !']);
    }

    // Récupère tous les messages
    $messages = $pdo->query("SELECT * FROM messages ORDER BY date_creation")->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    echo "<h1>Erreur de connexion</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Projet Final OpenShift</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #ee0000; color: white; }
        .success { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Projet Final - OpenShift</h1>
    <p class="success">Connexion a PostgreSQL reussie.</p>
    <p>Base de donnees : <?php echo htmlspecialchars($dbname); ?></p>
    <p>Hote : <?php echo htmlspecialchars($host); ?>:<?php echo htmlspecialchars($port); ?></p>

    <h2>Messages</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Texte</th>
            <th>Date</th>
        </tr>
        <?php foreach ($messages as $msg): ?>
        <tr>
            <td><?php echo htmlspecialchars($msg['id']); ?></td>
            <td><?php echo htmlspecialchars($msg['texte']); ?></td>
            <td><?php echo htmlspecialchars($msg['date_creation']); ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
    <p>Nombre total de messages : <?php echo count($messages); ?></p>
</body>
</html>
```

Crée le fichier `Containerfile` avec le contenu suivant :

```dockerfile
# Image UBI9 PHP 8.3 de Red Hat (conçue pour OpenShift, non-root)
FROM registry.access.redhat.com/ubi9/php-83:latest

# Copie le code source dans le répertoire web
COPY index.php /opt/app-root/src/index.php

# L'extension pdo_pgsql est déjà incluse dans l'image UBI PHP
# Le port 8080 est le port par défaut (non-root, compatible SCC restricted-v2)
EXPOSE 8080
```

---

**Partie 6 : Construire l'image**

```bash
# Crée le BuildConfig
oc new-build --strategy=docker --binary=true --name=php-app
```

```bash
# Lance le build
cd ~/projet-final
oc start-build php-app --from-dir=. --follow
```

Attends que le build soit terminé (message `Push successful`).

---

**Partie 7 : Créer le Deployment**

Crée le fichier `deployment.yaml` avec le contenu suivant :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: php-app
  labels:
    app: php-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: php-app
  template:
    metadata:
      labels:
        app: php-app
    spec:
      containers:
        - name: php-app
          image: image-registry.openshift-image-registry.svc:5000/projet-final/php-app:latest
          ports:
            - containerPort: 8080
          envFrom:
            - configMapRef:
                name: php-config
            - secretRef:
                name: db-credentials
```

Applique le Deployment :

```bash
# Crée le Deployment
cd ~/projet-final
oc apply -f deployment.yaml
```

Vérifie que le Pod est prêt :

```bash
# Vérifie que les Pods sont Running
oc get pods
```

**Résultat attendu** :

```text
NAME                       READY   STATUS    RESTARTS   AGE
php-app-5d4f8b7c6-abcde   1/1     Running   0          15s
postgresql-1-xxxxx         1/1     Running   0          5m
```

---

**Partie 8 : Exposer l'application**

```bash
# Crée le Service
oc expose deployment php-app --port=8080

# Crée la Route
oc expose service php-app
```

Récupère l'URL :

```bash
# Affiche l'URL de la Route
oc get route php-app -o jsonpath='{.spec.host}'
```

**Résultat attendu** :

```text
php-app-projet-final.apps-crc.testing
```

Teste l'application :

```bash
# Accède à l'application
curl http://php-app-projet-final.apps-crc.testing
```

Tu dois voir la page HTML avec "Connexion a PostgreSQL réussie" et le message "Hello OpenShift !".

---

**Partie 9 : Tester la persistance**

```bash
# Identifie le Pod PostgreSQL
oc get pods | grep postgresql
```

```text
postgresql-1-xxxxx   1/1     Running   0          8m
```

```bash
# Supprime le Pod PostgreSQL (remplace xxxxx par le nom réel)
oc delete pod postgresql-1-xxxxx
```

```bash
# Attends que le nouveau Pod soit prêt
oc get pods -w
```

Attends de voir le nouveau Pod `postgresql-1-yyyyy` en status `Running`, puis appuie sur Ctrl+C.

```bash
# Vérifie que les données sont toujours là
curl http://php-app-projet-final.apps-crc.testing
```

Le message "Hello OpenShift !" doit toujours apparaître. Les données ont survécu grâce au PVC.

---

**Partie 10 : Nettoyer**

```bash
# Supprime tout le projet et ses ressources
oc delete project projet-final
```

---

**Récapitulatif des commandes de l'exercice** :

| Étape | Commande |
| --- | --- |
| Créer le Project | `oc new-project projet-final` |
| Déployer PostgreSQL | `oc new-app postgresql-persistent --param ...` |
| Créer la ConfigMap | `oc create configmap php-config --from-literal=...` |
| Créer le Secret | `oc create secret generic db-credentials --from-literal=...` |
| Créer le BuildConfig | `oc new-build --strategy=docker --binary=true --name=php-app` |
| Lancer le build | `oc start-build php-app --from-dir=. --follow` |
| Déployer l'application | `oc apply -f deployment.yaml` |
| Créer le Service | `oc expose deployment php-app --port=8080` |
| Créer la Route | `oc expose service php-app` |
| Tester la persistance | `oc delete pod postgresql-1-xxxxx` |
| Nettoyer | `oc delete project projet-final` |

---

**Récapitulatif des fichiers créés** :

| Fichier | Rôle |
| --- | --- |
| `index.php` | Code PHP qui se connecte à PostgreSQL et affiche les messages |
| `Containerfile` | Instructions pour construire l'image de l'application |
| `deployment.yaml` | Définition du Deployment avec ConfigMap et Secret |

---

## Récapitulatif du Cursus

Tu as terminé le cursus DevOps Podman + OpenShift. Voici ce que tu as appris :

**Podman** :

- Installer et utiliser Podman comme alternative à Docker
- Gérer les images et les conteneurs (Containerfile, registres)
- Créer des Pods (groupes de conteneurs partageant le même réseau)
- Utiliser podman-compose et découvrir Quadlet
- Inspecter, déboguer et travailler offline

**OpenShift** :

- Comprendre les différences entre OpenShift et Kubernetes
- Installer un cluster local avec CRC (CodeReady Containers)
- Déployer des applications (fichiers YAML, `oc new-app`, S2I)
- Exposer des applications avec les Routes et les Services
- Construire des images avec BuildConfig et suivre les versions avec ImageStreams
- Gérer le stockage (PVC), la configuration (ConfigMap, Secret) et la sécurité (SCC)
- Déployer une application complète avec base de données, stockage persistant et configuration externalisée

---

## Navigation

← Fiche précédente : **[Builds et ImageStreams](05-builds-imagestreams.md)**
