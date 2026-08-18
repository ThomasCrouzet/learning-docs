---
tags:
  - OpenShift
  - Intermédiaire
  - Pratique
description: "Routes et Services"
estimated_time: "160 min"
fiche_number: 4
total_fiches: 6
cursus: "OpenShift"
---

# 04 - Routes et Services

> **En bref** : À la fin de cette fiche, tu sauras exposer une application via les Services et les Routes OpenShift, configurer le TLS, et créer des Routes à partir de fichiers YAML. Lecture estimée : 160 min.


## Prérequis

- Avoir lu la fiche [03 - Déployer une Application](03-deploiement-application.md)
- CRC démarré et `oc login` effectué
- Savoir utiliser le terminal (ouvrir un terminal, taper une commande, lire le résultat)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| OpenShift   | 4.14+   |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras exposer une application via les Services et les Routes OpenShift, configurer le TLS, et créer des Routes à partir de fichiers YAML.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Service OpenShift ?

**Définition** : Un Service est une ressource réseau qui donne un point d'accès stable (une IP fixe et un nom DNS) à un groupe de Pods. Le Service est identique au Service Kubernetes : c'est exactement la même ressource.

**Le problème que les Services résolvent** :

Sans Service, voici les problèmes rencontrés :

1. **IP instable des Pods** : Chaque Pod reçoit une adresse IP interne au cluster. Quand un Pod redémarre (crash, mise à jour, scaling), il reçoit une nouvelle IP. Si ton application se connecte directement à l'IP d'un Pod, la connexion est perdue à chaque redémarrage.

2. **Pas de répartition de charge** : Si tu lances 3 répliques d'une application (3 Pods identiques), il n'existe aucun mécanisme automatique pour distribuer le trafic entre les 3 Pods. Il faudrait gérer manuellement la liste des IP et choisir vers quel Pod envoyer chaque requête.

3. **Pas de nom DNS** : Les Pods n'ont pas de nom DNS utilisable. Pour communiquer avec un Pod, il faut connaître son IP exacte. Dans un cluster avec des dizaines de Pods, retrouver la bonne IP est impossible sans outil.

**Comment les Services résolvent ces problèmes** :

| Problème                  | Solution apportée par le Service                                                      |
| ------------------------- | ------------------------------------------------------------------------------------- |
| IP instable des Pods      | Le Service garde une IP fixe (ClusterIP). Même si les Pods changent d'IP, le Service redirige le trafic vers les bons Pods |
| Pas de répartition de charge | Le Service distribue automatiquement le trafic entre tous les Pods qui lui sont associés (round-robin par défaut) |
| Pas de nom DNS            | Le Service crée un nom DNS interne au cluster : `nom-du-service.nom-du-projet.svc.cluster.local` |

**Les types de Services** :

| Type         | Accès                          | Description                                                    |
| ------------ | ------------------------------ | -------------------------------------------------------------- |
| ClusterIP    | Interne au cluster uniquement  | Type par défaut. Le Service est accessible uniquement depuis l'intérieur du cluster |
| NodePort     | Depuis l'extérieur via un port | Le Service expose un port (30000-32767) sur chaque nœud du cluster |
| LoadBalancer | Depuis l'extérieur via un LB   | Le Service demande un load balancer externe au cloud provider  |

Dans CRC (environnement local), le type le plus utilisé est **ClusterIP** combiné avec une **Route** (expliquée dans le concept suivant).

**Analogie concrète** : Le Service fonctionne comme le standard téléphonique d'une entreprise. Les employés (Pods) changent de bureau (IP) régulièrement : un jour au bureau 201, le lendemain au bureau 305. Le numéro du standard (Service) reste le même : 01 23 45 67 89. Quand un client appelle le standard, l'appel est automatiquement redirigé vers un employé disponible, peu importe dans quel bureau il se trouve.

**Ce qu'un Service n'est PAS** :

- Un Service n'est pas un load balancer externe. Un Service de type ClusterIP n'est accessible que depuis l'intérieur du cluster. Pour rendre une application accessible depuis l'extérieur, il faut utiliser une Route (expliquée ci-dessous) ou un Service de type NodePort/LoadBalancer.
- Un Service n'est pas une Route. Le Service gère la communication **interne** au cluster. La Route gère la communication **externe** (depuis un navigateur, par exemple). Les deux travaillent ensemble mais ont des rôles différents.
- Un Service n'est pas un Pod. Le Service ne contient pas d'application. Il redirige le trafic vers les Pods qui contiennent l'application.

**Comment le Service trouve ses Pods** :

Le Service utilise un **sélecteur** (selector) pour identifier les Pods vers lesquels il doit rediriger le trafic. Le sélecteur est un ensemble de labels (étiquettes) que les Pods doivent posséder.

Exemple : un Service avec le sélecteur `app=mon-nginx` redirige le trafic vers tous les Pods qui portent le label `app=mon-nginx`.

```yaml
# Extrait simplifié d'un Service
spec:
  selector:
    app: mon-nginx    # Le Service cherche les Pods avec ce label
  ports:
    - port: 8080        # Le port exposé par le Service
      targetPort: 8080  # Le port du conteneur dans le Pod
```

---

### Qu'est-ce qu'une Route OpenShift ?

**Définition** : Une Route est une ressource spécifique à OpenShift qui expose un Service vers l'extérieur du cluster via un nom de domaine (URL). La Route est gérée par le HAProxy Router, un reverse proxy intégré à OpenShift.

**Le problème que les Routes résolvent** :

Sans Route, voici les problèmes rencontrés :

1. **Service inaccessible depuis l'extérieur** : Un Service de type ClusterIP n'est accessible que depuis l'intérieur du cluster. Si tu veux accéder à ton application depuis ton navigateur, tu ne peux pas utiliser directement le Service.

2. **Pas de nom de domaine** : Le Service a un nom DNS interne (`mon-service.mon-projet.svc.cluster.local`), mais ce nom n'est pas résolu en dehors du cluster. Ton navigateur ne peut pas le résoudre.

3. **Pas de TLS automatique** : Le Service ne gère pas le chiffrement HTTPS. Pour sécuriser le trafic, il faudrait configurer le TLS manuellement dans chaque Pod.

**Comment les Routes résolvent ces problèmes** :

| Problème                             | Solution apportée par la Route                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| Service inaccessible depuis l'extérieur | La Route crée une URL accessible depuis l'extérieur du cluster (ton navigateur) |
| Pas de nom de domaine                | La Route génère automatiquement une URL au format `nom-route-projet.apps-crc.testing` |
| Pas de TLS automatique               | La Route peut gérer le TLS (HTTPS) avec différents modes de terminaison         |

**Comparaison Route vs Ingress Kubernetes** :

La Route est une ressource spécifique à OpenShift. Dans Kubernetes standard (sans OpenShift), on utilise une ressource appelée Ingress pour le même usage. OpenShift supporte aussi les Ingress, mais les Routes offrent plus de fonctionnalités.

| Critère                | Route OpenShift                              | Ingress Kubernetes                           |
| ---------------------- | -------------------------------------------- | -------------------------------------------- |
| Création               | `oc expose service mon-service` (une commande) | Fichier YAML obligatoire                    |
| TLS                    | Intégré (Edge, Passthrough, Re-encrypt)      | Nécessite un contrôleur Ingress externe      |
| Certificat par défaut  | Fourni automatiquement par OpenShift         | À configurer manuellement (cert-manager)     |
| Reverse proxy          | HAProxy intégré à OpenShift                  | Nginx, Traefik ou autre (à installer)        |
| Simplicité             | Plus simple à utiliser                       | Plus de configuration requise                |

**Analogie concrète** : La Route fonctionne comme la porte d'entrée d'un immeuble de bureaux. Les entreprises (Services) occupent des bureaux à l'intérieur de l'immeuble. Sans porte d'entrée (Route), personne ne peut entrer depuis la rue. La porte d'entrée a une adresse postale (URL) qui permet aux visiteurs (utilisateurs) de trouver l'immeuble. Le gardien à l'entrée (HAProxy Router) vérifie les badges (TLS) et dirige chaque visiteur vers le bon bureau (Service).

**Ce qu'une Route n'est PAS** :

- Une Route n'est pas un Service. La Route ne fait pas de répartition de charge entre les Pods. Elle redirige le trafic externe vers un Service, qui lui distribue le trafic entre les Pods.
- Une Route n'est pas un DNS public. La Route crée une URL qui fonctionne dans ton environnement (CRC, cluster entreprise). En production, il faut configurer un DNS réel pour pointer vers le cluster.
- Une Route n'est pas un certificat SSL. La Route peut utiliser le TLS, mais elle n'est pas un certificat en elle-même. Le certificat est fourni par OpenShift (auto-signé dans CRC) ou par toi (certificat personnalisé).

Le diagramme suivant montre le cheminement d'une requête depuis l'utilisateur externe jusqu'aux Pods via la Route et le Service.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-02-openshift-04-routes-services-1.html">Qu&#x27;est-ce qu&#x27;une Route OpenShift ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-02-openshift-04-routes-services-1.html" title="Qu&#x27;est-ce qu&#x27;une Route OpenShift ?" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

**Schéma du flux de trafic** :

```text
Navigateur (utilisateur)
        |
        v
   Route (URL externe)
        |
        v
   HAProxy Router (reverse proxy)
        |
        v
   Service (IP interne stable)
        |
        v
   Pod 1 / Pod 2 / Pod 3 (application)
```

---

### Qu'est-ce que la terminaison TLS ?

**Définition** : La terminaison TLS est le point dans le réseau où le chiffrement HTTPS est déchiffré. Dans OpenShift, il y a trois façons de gérer le TLS au niveau des Routes : Edge, Passthrough et Re-encrypt.

**Le problème que la terminaison TLS résout** :

Sans terminaison TLS, voici les problèmes rencontrés :

1. **Trafic en clair** : Les données circulent en HTTP (non chiffré) entre le navigateur et l'application. Toute personne sur le réseau peut lire les données (mots de passe, données personnelles).

2. **Complexité de configuration** : Configurer le TLS directement dans chaque Pod (chaque conteneur applicatif) demande de gérer les certificats dans chaque image, de les renouveler, et de modifier le code de l'application.

3. **Pas de standard uniforme** : Sans mécanisme centralisé, chaque développeur configure le TLS à sa manière. Cela crée des incohérences et des failles de sécurité.

**Comment la terminaison TLS résout ces problèmes** :

| Problème                   | Solution apportée par la terminaison TLS                                    |
| -------------------------- | --------------------------------------------------------------------------- |
| Trafic en clair            | Le trafic est chiffré entre le navigateur et le point de terminaison TLS    |
| Complexité de configuration | Le Router gère le TLS de manière centralisée. Les Pods n'ont rien à configurer (en mode Edge) |
| Pas de standard uniforme   | OpenShift applique le même mécanisme TLS à toutes les Routes               |

**Les trois types de terminaison TLS** :

| Type       | Où le TLS est terminé | Trafic Router vers Pod | Sécurité       | Complexité | Cas d'usage                        |
| ---------- | --------------------- | ---------------------- | -------------- | ---------- | ---------------------------------- |
| Edge       | Au niveau du Router   | HTTP (non chiffré)     | Bonne          | Faible     | Cas le plus courant. Suffisant pour la majorité des applications |
| Passthrough | Au niveau du Pod     | HTTPS (chiffré)        | Haute          | Haute      | L'application gère elle-même le TLS. Le Router transmet le trafic sans le déchiffrer |
| Re-encrypt | Au niveau du Router   | HTTPS (re-chiffré)     | Très haute     | Haute      | Double chiffrement. Le Router déchiffre puis re-chiffre vers le Pod |

**Détail de chaque type** :

**Edge** (le plus courant) :

```text
Navigateur ---HTTPS---> Router ---HTTP---> Pod
```

- Le Router déchiffre le trafic HTTPS.
- Le trafic entre le Router et le Pod est en HTTP (non chiffré).
- Le Pod n'a pas besoin de gérer de certificat.
- C'est le mode par défaut dans CRC quand tu crées une Route avec TLS.

**Passthrough** :

```text
Navigateur ---HTTPS---> Router ---HTTPS---> Pod
```

- Le Router ne déchiffre pas le trafic. Il le transmet tel quel au Pod.
- Le Pod doit gérer son propre certificat TLS.
- Utile quand l'application a besoin de voir le certificat client (authentification mutuelle).

**Re-encrypt** :

```text
Navigateur ---HTTPS---> Router ---HTTPS---> Pod
                    (déchiffré puis re-chiffré)
```

- Le Router déchiffre le trafic HTTPS du navigateur.
- Le Router re-chiffre le trafic avec un nouveau certificat vers le Pod.
- Le Pod doit gérer son propre certificat TLS.
- Utile quand la politique de sécurité exige que tout le trafic soit chiffré, même à l'intérieur du cluster.

**Analogie concrète** : Le TLS fonctionne comme l'envoi d'une lettre recommandée.

- En mode **Edge**, la lettre arrive dans une enveloppe scellée au gardien de l'immeuble (Router). Le gardien ouvre l'enveloppe, lit l'adresse, et transmet la lettre ouverte au bon bureau (Pod).
- En mode **Passthrough**, le gardien ne touche pas à l'enveloppe : il la transmet scellée au bureau, qui l'ouvre lui-même.
- En mode **Re-encrypt**, le gardien ouvre l'enveloppe, met la lettre dans une nouvelle enveloppe scellée, et la transmet au bureau.

**Ce que la terminaison TLS n'est PAS** :

- La terminaison TLS n'est pas un certificat. La terminaison TLS est le mécanisme qui décide où le chiffrement est géré. Le certificat est le fichier qui permet le chiffrement.
- La terminaison TLS n'est pas obligatoire. Tu peux créer des Routes sans TLS (en HTTP simple). Mais en production, le TLS est fortement recommandé.

**Dans CRC** : Par défaut, CRC utilise un certificat auto-signé. Cela signifie que ton navigateur affichera un avertissement de sécurité quand tu accéderas à une Route HTTPS. C'est normal en environnement local.

---

### Qu'est-ce que le HAProxy Router ?

**Définition** : Le HAProxy Router est le composant OpenShift qui reçoit tout le trafic réseau entrant dans le cluster et le redirige vers les bons Services en lisant les Routes configurées. Il fonctionne comme un reverse proxy.

**Le problème que le HAProxy Router résout** :

Sans HAProxy Router, voici les problèmes rencontrés :

1. **Pas de point d'entrée unique** : Sans reverse proxy, chaque application devrait exposer son propre port sur le réseau externe. Avec 20 applications, tu aurais 20 ports différents à retenir.

2. **Pas de routage par nom de domaine** : Sans reverse proxy, il serait impossible de rediriger `app1.example.com` vers le Service A et `app2.example.com` vers le Service B sur la même adresse IP.

3. **Pas de terminaison TLS centralisée** : Chaque application devrait gérer son propre certificat TLS.

**Comment le HAProxy Router résout ces problèmes** :

| Problème                            | Solution apportée par le HAProxy Router                             |
| ----------------------------------- | ------------------------------------------------------------------- |
| Pas de point d'entrée unique        | Un seul point d'entrée (ports 80 et 443) pour toutes les applications du cluster |
| Pas de routage par nom de domaine   | Le Router lit le nom de domaine de la requête HTTP et redirige vers le bon Service |
| Pas de terminaison TLS centralisée  | Le Router gère le TLS pour toutes les Routes en un seul endroit     |

**Analogie concrète** : Le HAProxy Router fonctionne comme le standardiste d'un grand hôtel. Tous les appels téléphoniques arrivent sur le même numéro (point d'entrée unique). Le standardiste (Router) écoute le nom du client demandé et transfère l'appel vers la bonne chambre (Service). Si l'appel est confidentiel (HTTPS), le standardiste peut sécuriser la ligne (TLS).

**Ce que le HAProxy Router n'est PAS** :

- Le HAProxy Router n'est pas un Service. Le Router est un composant d'infrastructure qui tourne dans le namespace `openshift-ingress`. Tu ne le crées pas toi-même ; il est installé avec OpenShift.
- Le HAProxy Router n'est pas un load balancer externe. Le Router tourne à l'intérieur du cluster. En production, un load balancer externe (fourni par le cloud provider) redirige le trafic vers le Router.

**Lien avec Nginx** : Si tu as suivi le cours Docker, le HAProxy Router joue le même rôle que Nginx en reverse proxy. La différence est que le Router est géré automatiquement par OpenShift, alors que Nginx nécessite une configuration manuelle.

---

## Étapes Pratiques

### Étape 1 : Créer un projet et déployer Nginx

Crée un nouveau projet pour cette fiche, puis déploie une application Nginx.

```bash
# Crée un nouveau projet nommé demo-routes
oc new-project demo-routes
```

**Résultat attendu** :

```text
Now using project "demo-routes" on server "https://api.crc.testing:6443".
```

Déploie une application Nginx :

```bash
# Crée un déploiement Nginx à partir de l'image officielle
oc new-app --image=docker.io/nginxinc/nginx-unprivileged:alpine --name=mon-nginx
```

**Résultat attendu** :

```text
--> Found container image ... (tag: alpine) from docker.io for "docker.io/nginxinc/nginx-unprivileged:alpine"

    * An image stream tag will be created as "mon-nginx:alpine" that will track this image

--> Creating resources ...
    imagestream.image.openshift.io "mon-nginx" created
    deployment.apps "mon-nginx" created
    service "mon-nginx" created
--> Success
    Application is not exposed. You can expose services to the outside world by executing one or more of the commands:
      'oc expose service/mon-nginx'
    Run 'oc status' for an overview of the project.
```

OpenShift crée automatiquement trois ressources :

- Un **ImageStream** : référence vers l'image Nginx
- Un **Deployment** : gère le déploiement des Pods
- Un **Service** : point d'accès réseau vers les Pods

Attends que le Pod soit en état Running :

```bash
# Affiche les Pods du projet et attend que le STATUS soit Running
oc get pods
```

**Résultat attendu** :

```text
NAME                         READY   STATUS    RESTARTS   AGE
mon-nginx-5d4f6b7c8d-x2k9m  1/1     Running   0          30s
```

Le STATUS doit afficher `Running` et READY doit afficher `1/1`. Si le STATUS affiche `ContainerCreating`, attends quelques secondes et relance la commande.

---

### Étape 2 : Examiner le Service créé automatiquement

La commande `oc new-app` a créé un Service automatiquement. Examine-le.

```bash
# Liste les Services du projet
oc get services
```

**Résultat attendu** :

```text
NAME        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
mon-nginx   ClusterIP   10.217.5.123   <none>        8080/TCP   2m
```

Explication de chaque colonne :

- **NAME** : le nom du Service (`mon-nginx`)
- **TYPE** : le type de Service (`ClusterIP` = accessible uniquement depuis l'intérieur du cluster)
- **CLUSTER-IP** : l'IP fixe attribuée au Service (`10.217.5.123`). Cette IP est stable tant que le Service existe
- **EXTERNAL-IP** : `<none>` car le type ClusterIP n'a pas d'IP externe
- **PORT(S)** : le port exposé par le Service (`8080/TCP`). L'image `nginx-unprivileged` écoute sur le port 8080 (pas 80)

Pour voir plus de détails :

```bash
# Affiche les détails complets du Service mon-nginx
oc describe service mon-nginx
```

**Résultat attendu** :

```text
Name:              mon-nginx
Namespace:         demo-routes
Labels:            app=mon-nginx
                   app.kubernetes.io/component=mon-nginx
                   app.kubernetes.io/instance=mon-nginx
Annotations:       <none>
Selector:          deployment=mon-nginx
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.217.5.123
IPs:               10.217.5.123
Port:              8080-tcp  8080/TCP
TargetPort:        8080/TCP
Endpoints:         10.217.0.45:8080
Session Affinity:  None
Events:            <none>
```

Les informations importantes :

- **Selector** : `deployment=mon-nginx`. Le Service redirige le trafic vers tous les Pods qui portent le label `deployment=mon-nginx`
- **IP** : `10.217.5.123`. C'est l'IP fixe du Service
- **Port** : `8080/TCP`. Le port sur lequel le Service écoute (nginx-unprivileged écoute sur 8080, pas 80)
- **TargetPort** : `8080/TCP`. Le port du conteneur vers lequel le trafic est redirigé
- **Endpoints** : `10.217.0.45:8080`. L'IP actuelle du Pod. Cette IP changera si le Pod redémarre, mais l'IP du Service restera la même

---

### Étape 3 : Créer une Route HTTP

Le Service est accessible uniquement depuis l'intérieur du cluster. Pour y accéder depuis ton navigateur, crée une Route.

```bash
# Expose le Service mon-nginx via une Route HTTP
oc expose service mon-nginx
```

**Résultat attendu** :

```text
route.route.openshift.io/mon-nginx exposed
```

Vérifie que la Route est créée :

```bash
# Liste les Routes du projet
oc get routes
```

**Résultat attendu** :

```text
NAME        HOST/PORT                                PATH   SERVICES    PORT      TERMINATION   WILDCARD
mon-nginx   mon-nginx-demo-routes.apps-crc.testing          mon-nginx   8080-tcp                None
```

Explication de chaque colonne :

- **NAME** : le nom de la Route (`mon-nginx`)
- **HOST/PORT** : l'URL générée automatiquement (`mon-nginx-demo-routes.apps-crc.testing`). Le format est `nom-route-nom-projet.apps-crc.testing`
- **SERVICES** : le Service vers lequel la Route redirige (`mon-nginx`)
- **PORT** : le port du Service utilisé (`8080-tcp`)
- **TERMINATION** : vide car cette Route est en HTTP (pas de TLS)

---

### Étape 4 : Accéder à l'application via la Route

Utilise `curl` pour accéder à l'application via l'URL de la Route :

```bash
# Envoie une requête HTTP à l'URL de la Route
curl http://mon-nginx-demo-routes.apps-crc.testing
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>
...
</body>
</html>
```

Tu peux aussi ouvrir cette URL dans ton navigateur : `http://mon-nginx-demo-routes.apps-crc.testing`

Si tu vois la page d'accueil Nginx, la Route fonctionne correctement. Le trafic suit ce chemin :

```text
Ton navigateur --> Route (URL) --> HAProxy Router --> Service (ClusterIP) --> Pod (Nginx)
```

---

### Étape 5 : Créer une Route avec TLS (Edge)

Crée une deuxième Route, cette fois avec le chiffrement TLS en mode Edge :

```bash
# Crée une Route Edge TLS nommée mon-nginx-secure qui pointe vers le Service mon-nginx
oc create route edge mon-nginx-secure --service=mon-nginx
```

**Résultat attendu** :

```text
route.route.openshift.io/mon-nginx-secure created
```

Vérifie les Routes existantes :

```bash
# Liste toutes les Routes du projet
oc get routes
```

**Résultat attendu** :

```text
NAME               HOST/PORT                                       PATH   SERVICES    PORT    TERMINATION   WILDCARD
mon-nginx          mon-nginx-demo-routes.apps-crc.testing                  mon-nginx   80-tcp                None
mon-nginx-secure   mon-nginx-secure-demo-routes.apps-crc.testing           mon-nginx   80-tcp  edge          None
```

La colonne **TERMINATION** affiche `edge` pour la Route sécurisée.

Accède à l'application via HTTPS :

```bash
# Envoie une requête HTTPS à la Route sécurisée
# -k ignore l'erreur de certificat auto-signé (normal dans CRC)
curl -k https://mon-nginx-secure-demo-routes.apps-crc.testing
```

**Résultat attendu** : La même page d'accueil Nginx que l'étape précédente.

L'option `-k` (ou `--insecure`) est nécessaire parce que CRC utilise un certificat auto-signé. Le certificat n'est pas reconnu par `curl` ni par ton navigateur, mais le chiffrement fonctionne quand même.

Dans un navigateur, tu verras un avertissement "Votre connexion n'est pas privée". Clique sur "Avancé" puis "Continuer vers le site" pour accéder à la page.

---

### Étape 6 : Examiner les détails d'une Route

Affiche les détails de la Route sécurisée :

```bash
# Affiche les détails complets de la Route mon-nginx-secure
oc describe route mon-nginx-secure
```

**Résultat attendu** :

```text
Name:             mon-nginx-secure
Namespace:        demo-routes
Created:          2 minutes ago
Labels:           app=mon-nginx
                  app.kubernetes.io/component=mon-nginx
                  app.kubernetes.io/instance=mon-nginx
Annotations:      <none>
Requested Host:   mon-nginx-secure-demo-routes.apps-crc.testing
                    exposed on router default (host router-default.apps-crc.testing) 2 minutes ago
Path:             <none>
TLS Termination:  edge
Insecure Policy:  <none>
Endpoint Port:    80-tcp

Service:  mon-nginx
Weight:   100 (100%)
Endpoints: 10.217.0.45:80
```

Les informations importantes :

- **TLS Termination** : `edge`. Le TLS est terminé au niveau du Router
- **Insecure Policy** : `<none>`. Par défaut, le trafic HTTP n'est pas redirigé vers HTTPS
- **Service** : `mon-nginx`. La Route pointe vers ce Service
- **Weight** : `100 (100%)`. Tout le trafic va vers ce Service (utile pour les déploiements blue/green)

---

### Étape 7 : Créer une Route via un fichier YAML

Tu peux aussi créer une Route en écrivant un fichier YAML. Cela permet de versionner la configuration dans Git.

Crée un fichier nommé `route.yaml` avec ce contenu :

```yaml
# Fichier route.yaml - Définition d'une Route OpenShift
apiVersion: route.openshift.io/v1   # Version de l'API OpenShift pour les Routes
kind: Route                          # Type de ressource : Route
metadata:
  name: mon-nginx-yaml               # Nom de la Route
  namespace: demo-routes              # Projet dans lequel créer la Route
  labels:
    app: mon-nginx                    # Label pour identifier cette Route
spec:
  host: mon-nginx-yaml-demo-routes.apps-crc.testing  # URL de la Route (optionnel, généré automatiquement si absent)
  to:
    kind: Service                     # La Route pointe vers un Service
    name: mon-nginx                   # Nom du Service cible
    weight: 100                       # Pourcentage du trafic dirigé vers ce Service (100 = tout le trafic)
  port:
    targetPort: 8080-tcp              # Port du Service à utiliser
  tls:
    termination: edge                 # Type de terminaison TLS : edge, passthrough ou reencrypt
    insecureEdgeTerminationPolicy: Redirect  # Redirige le HTTP vers HTTPS automatiquement
```

Explication de chaque champ :

- **apiVersion** : `route.openshift.io/v1`. C'est la version de l'API pour les Routes OpenShift
- **kind** : `Route`. Indique qu'on crée une Route
- **metadata.name** : le nom de la Route. Doit être unique dans le projet
- **metadata.namespace** : le projet dans lequel créer la Route
- **spec.host** : l'URL de la Route. Si tu ne le précises pas, OpenShift génère une URL automatiquement
- **spec.to.kind** : `Service`. La Route redirige vers un Service
- **spec.to.name** : le nom du Service cible
- **spec.to.weight** : `100`. Pourcentage du trafic (utile pour les déploiements progressifs)
- **spec.port.targetPort** : le port du Service à utiliser
- **spec.tls.termination** : `edge`. Le TLS est terminé au niveau du Router
- **spec.tls.insecureEdgeTerminationPolicy** : `Redirect`. Les requêtes HTTP sont automatiquement redirigées vers HTTPS

Applique le fichier :

```bash
# Crée la Route à partir du fichier YAML
oc apply -f route.yaml
```

**Résultat attendu** :

```text
route.route.openshift.io/mon-nginx-yaml created
```

Vérifie que la Route est créée :

```bash
# Liste toutes les Routes du projet
oc get routes
```

**Résultat attendu** :

```text
NAME               HOST/PORT                                       PATH   SERVICES    PORT    TERMINATION     WILDCARD
mon-nginx          mon-nginx-demo-routes.apps-crc.testing                  mon-nginx   8080-tcp                  None
mon-nginx-secure   mon-nginx-secure-demo-routes.apps-crc.testing           mon-nginx   8080-tcp  edge            None
mon-nginx-yaml     mon-nginx-yaml-demo-routes.apps-crc.testing             mon-nginx   8080-tcp  edge/Redirect   None
```

La Route `mon-nginx-yaml` affiche `edge/Redirect` dans la colonne TERMINATION. Cela signifie que le TLS est en mode Edge et que le HTTP est redirigé vers HTTPS.

Teste la redirection HTTP vers HTTPS :

```bash
# Teste la redirection HTTP -> HTTPS (option -L suit les redirections)
curl -k -L http://mon-nginx-yaml-demo-routes.apps-crc.testing
```

**Résultat attendu** : La page d'accueil Nginx, obtenue après une redirection automatique de HTTP vers HTTPS.

---

### Étape 8 : Nettoyer les ressources

Supprime le projet et toutes les ressources qu'il contient :

```bash
# Supprime le projet demo-routes et toutes ses ressources
oc delete project demo-routes
```

**Résultat attendu** :

```text
project.project.openshift.io "demo-routes" deleted
```

Cette commande supprime le projet et toutes les ressources qui lui appartiennent : Pods, Services, Routes, Deployments, ImageStreams.

---

## Commandes Utiles

| Commande                                      | Action                                                        |
| --------------------------------------------- | ------------------------------------------------------------- |
| `oc expose service <nom>`                     | Crée une Route HTTP qui expose un Service                     |
| `oc create route edge <nom> --service=<svc>`  | Crée une Route HTTPS avec terminaison TLS Edge                |
| `oc create route passthrough <nom> --service=<svc>` | Crée une Route HTTPS avec terminaison TLS Passthrough   |
| `oc get routes`                               | Liste toutes les Routes du projet                             |
| `oc get services`                             | Liste tous les Services du projet                             |
| `oc describe route <nom>`                     | Affiche les détails d'une Route                               |
| `oc describe service <nom>`                   | Affiche les détails d'un Service                              |
| `oc delete route <nom>`                       | Supprime une Route                                            |
| `oc delete service <nom>`                     | Supprime un Service                                           |
| `oc get endpoints`                            | Liste les endpoints (IP des Pods) associés aux Services       |
| `oc apply -f <fichier.yaml>`                  | Crée ou met à jour une ressource à partir d'un fichier YAML  |

---

## Pièges Fréquents

### Piège 1 : Route qui pointe vers un Service inexistant

**Problème** : Tu crées une Route qui pointe vers un Service qui n'existe pas. La Route est créée sans erreur, mais l'accès à l'URL renvoie une erreur 503 (Service Unavailable).

**Solution** : Vérifie que le Service existe avant de créer la Route :

```bash
# Vérifie que le Service existe
oc get services
```

Si le Service n'apparaît pas dans la liste, crée-le d'abord ou vérifie le nom exact.

```bash
# Vérifie les détails de la Route pour voir vers quel Service elle pointe
oc describe route <nom-de-la-route>
```

Le champ "Service" dans la sortie doit correspondre à un Service existant.

---

### Piège 2 : Certificat auto-signé dans CRC

**Problème** : Quand tu accèdes à une Route HTTPS dans CRC, ton navigateur affiche un avertissement :

```text
Votre connexion n'est pas privée
NET::ERR_CERT_AUTHORITY_INVALID
```

**Explication** : CRC utilise un certificat auto-signé. Ce certificat chiffre le trafic correctement, mais il n'est pas signé par une autorité de certification reconnue. Le navigateur ne peut pas vérifier l'identité du serveur.

**Solution** : Ce comportement est normal en environnement local. Clique sur "Avancé" puis "Continuer vers le site". Pour `curl`, utilise l'option `-k` :

```bash
# -k ignore l'erreur de certificat auto-signé
curl -k https://mon-nginx-secure-demo-routes.apps-crc.testing
```

En production, tu utiliserais un certificat signé par une autorité reconnue (Let's Encrypt, DigiCert, etc.).

---

### Piège 3 : URL de la Route non résolue

**Problème** : Tu tapes l'URL de la Route dans ton navigateur et tu obtiens une erreur "Impossible de trouver le site" (DNS_PROBE_FINISHED_NXDOMAIN).

```text
Le site mon-nginx-demo-routes.apps-crc.testing est inaccessible
```

**Explication** : Le DNS de CRC n'est pas configuré sur ta machine. Ton navigateur ne sait pas que `*.apps-crc.testing` doit pointer vers CRC.

**Solution** : Relance la configuration de CRC :

```bash
# Configure le DNS et les prérequis de CRC
crc setup
```

Si `crc setup` ne résout pas le problème, vérifie que CRC est démarré :

```bash
# Vérifie l'état de CRC
crc status
```

**Résultat attendu** :

```text
CRC VM:          Running
OpenShift:       Running (v4.14.x)
...
```

Si CRC n'est pas en état Running, démarre-le :

```bash
# Démarre CRC
crc start
```

---

### Piège 4 : Port incorrect dans la Route

**Problème** : La Route est créée, l'URL est accessible, mais tu obtiens une erreur 502 (Bad Gateway) ou une page vide.

**Explication** : La Route utilise le port du Service, pas le port du conteneur. Si le Service est configuré sur un port différent du port réel de l'application, le trafic ne peut pas atteindre le Pod.

**Solution** : Vérifie que le port du Service correspond au port de l'application dans le conteneur :

```bash
# Vérifie le port du Service
oc describe service mon-nginx
```

Regarde les champs :

- **Port** : le port sur lequel le Service écoute (ex: `8080/TCP`)
- **TargetPort** : le port du conteneur vers lequel le Service redirige (ex: `8080/TCP`)

Ces deux valeurs doivent correspondre au port sur lequel l'application écoute dans le conteneur. Pour `nginx-unprivileged`, c'est le port 8080 (et non 80 comme pour l'image Nginx standard).

```bash
# Vérifie le port exposé par le conteneur
oc describe pod <nom-du-pod> | grep -i port
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est un Service et son rôle (point d'accès stable vers les Pods)
- [ ] J'ai compris ce qu'est une Route et son rôle (exposer un Service vers l'extérieur)
- [ ] J'ai compris la différence entre un Service et une Route
- [ ] J'ai créé une Route HTTP avec `oc expose service`
- [ ] J'ai accédé à l'application via l'URL de la Route
- [ ] J'ai créé une Route HTTPS avec `oc create route edge`
- [ ] J'ai accédé à l'application via HTTPS (avec l'avertissement de certificat auto-signé)
- [ ] J'ai compris les trois types de terminaison TLS (Edge, Passthrough, Re-encrypt)
- [ ] J'ai créé une Route à partir d'un fichier YAML
- [ ] J'ai nettoyé les ressources avec `oc delete project`

---

## Exercice Pratique

**Énoncé** : Déploie une application Nginx dans un nouveau projet, crée un Service, expose-la via une Route HTTP et une Route HTTPS (Edge TLS), accède aux deux URLs et vérifie le résultat.

**Indications** :

- Crée un projet nommé `exercice-routes`
- Utilise l'image `docker.io/nginxinc/nginx-unprivileged:alpine`
- Nomme l'application `web-test`
- Crée une Route HTTP nommée `web-test-http` avec `oc expose`
- Crée une Route HTTPS nommée `web-test-https` avec `oc create route edge`
- Vérifie les deux URLs avec `curl`
- Nettoie le projet à la fin

**Résultat attendu** :

- La Route HTTP répond avec la page d'accueil Nginx en HTTP
- La Route HTTPS répond avec la page d'accueil Nginx en HTTPS
- Les deux Routes sont visibles avec `oc get routes`
- Le projet est supprimé à la fin

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 : Créer le projet**

```bash
# Crée un nouveau projet pour l'exercice
oc new-project exercice-routes
```

**Résultat attendu** :

```text
Now using project "exercice-routes" on server "https://api.crc.testing:6443".
```

---

**Partie 2 : Déployer l'application**

```bash
# Déploie Nginx avec le nom web-test
oc new-app --image=docker.io/nginxinc/nginx-unprivileged:alpine --name=web-test
```

**Résultat attendu** :

```text
--> Creating resources ...
    imagestream.image.openshift.io "web-test" created
    deployment.apps "web-test" created
    service "web-test" created
--> Success
```

Attends que le Pod soit prêt :

```bash
# Vérifie que le Pod est en état Running
oc get pods
```

**Résultat attendu** :

```text
NAME                        READY   STATUS    RESTARTS   AGE
web-test-6b7c8d9e0f-a1b2c  1/1     Running   0          30s
```

---

**Partie 3 : Vérifier le Service**

```bash
# Liste les Services
oc get services
```

**Résultat attendu** :

```text
NAME       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
web-test   ClusterIP   10.217.4.200    <none>        80/TCP    1m
```

Le Service `web-test` de type ClusterIP est créé automatiquement.

---

**Partie 4 : Créer la Route HTTP**

```bash
# Expose le Service web-test via une Route HTTP
oc expose service web-test --name=web-test-http
```

**Résultat attendu** :

```text
route.route.openshift.io/web-test-http exposed
```

---

**Partie 5 : Créer la Route HTTPS (Edge TLS)**

```bash
# Crée une Route Edge TLS nommée web-test-https
oc create route edge web-test-https --service=web-test
```

**Résultat attendu** :

```text
route.route.openshift.io/web-test-https created
```

---

**Partie 6 : Vérifier les Routes**

```bash
# Liste toutes les Routes
oc get routes
```

**Résultat attendu** :

```text
NAME             HOST/PORT                                          PATH   SERVICES   PORT    TERMINATION   WILDCARD
web-test-http    web-test-http-exercice-routes.apps-crc.testing            web-test   80-tcp                None
web-test-https   web-test-https-exercice-routes.apps-crc.testing           web-test   80-tcp  edge          None
```

Les deux Routes sont créées. La Route HTTP n'a pas de terminaison TLS. La Route HTTPS a la terminaison `edge`.

---

**Partie 7 : Tester la Route HTTP**

```bash
# Accède à l'application via la Route HTTP
curl http://web-test-http-exercice-routes.apps-crc.testing
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

---

**Partie 8 : Tester la Route HTTPS**

```bash
# Accède à l'application via la Route HTTPS
# -k ignore l'erreur de certificat auto-signé de CRC
curl -k https://web-test-https-exercice-routes.apps-crc.testing
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

---

**Partie 9 : Nettoyer**

```bash
# Supprime le projet et toutes ses ressources
oc delete project exercice-routes
```

**Résultat attendu** :

```text
project.project.openshift.io "exercice-routes" deleted
```

---

**Récapitulatif des commandes de l'exercice** :

| Étape                    | Commande                                                    |
| ------------------------ | ----------------------------------------------------------- |
| Créer le projet          | `oc new-project exercice-routes`                            |
| Déployer Nginx           | `oc new-app --image=docker.io/nginxinc/nginx-unprivileged:alpine --name=web-test` |
| Vérifier les Pods        | `oc get pods`                                               |
| Vérifier le Service      | `oc get services`                                           |
| Créer la Route HTTP      | `oc expose service web-test --name=web-test-http`           |
| Créer la Route HTTPS     | `oc create route edge web-test-https --service=web-test`    |
| Lister les Routes        | `oc get routes`                                             |
| Tester la Route HTTP     | `curl http://web-test-http-exercice-routes.apps-crc.testing` |
| Tester la Route HTTPS    | `curl -k https://web-test-https-exercice-routes.apps-crc.testing` |
| Nettoyer                 | `oc delete project exercice-routes`                         |

---

## Navigation

← Fiche précédente : **[Déployer une Application](03-deploiement-application.md)**

→ Fiche suivante : **[Builds et ImageStreams](05-builds-imagestreams.md)**
