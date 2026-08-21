---
tags:
  - Ansible
  - Débutant
  - Pratique
description: "L'Inventaire Ansible"
estimated_time: "160 min"
fiche_number: 3
total_fiches: 14
cursus: "Ansible"
id: "infrastructure.ansible.inventaire"
course_id: "infrastructure.ansible"
content_type: "lesson"
order: 3
---

# 03 - L'Inventaire Ansible

> **En bref** : À la fin de cette fiche, tu sauras créer et organiser un inventaire Ansible pour décrire ton infrastructure (machines, groupes, variables). Lecture estimée : 160 min.


## Prérequis

- Fiche [01 - Introduction à Ansible](01-introduction-ansible.md) lue et comprise
- Fiche [02 - Installation et Configuration](02-installation-configuration.md) lue et comprise
- Ansible installé et fonctionnel sur ta machine de contrôle
- Savoir se connecter en SSH à des machines distantes
- Savoir utiliser le terminal (commandes `cd`, `ls`, `pwd`, `cat`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et organiser un inventaire Ansible pour décrire ton infrastructure (machines, groupes, variables).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un inventaire Ansible ?

**Définition** : Un inventaire Ansible est un fichier qui liste toutes les machines (appelées "hôtes" ou "nodes") qu'Ansible peut gérer, organisées en groupes logiques et accompagnées de variables de connexion.

**Le problème que l'inventaire résout** :

Sans inventaire, voici les problèmes rencontrés :

1. **Ansible ne sait pas quoi cibler** : Sans liste de machines, Ansible ne peut exécuter aucune commande. Il n'a aucun moyen de deviner quelles machines existent dans ton infrastructure.

2. **Pas d'organisation** : Si tu as 20 machines, tu devrais spécifier manuellement chaque adresse IP à chaque commande. Impossible de dire "lance cette commande sur tous les serveurs web".

3. **Pas de variables centralisées** : Chaque machine a des particularités (port SSH différent, utilisateur différent, rôle différent). Sans inventaire, tu devrais spécifier ces paramètres à chaque exécution.

**Comment l'inventaire résout ces problèmes** :

| Problème | Solution apportée par l'inventaire |
| --- | --- |
| Ansible ne sait pas quoi cibler | L'inventaire liste toutes les machines avec leurs adresses IP ou noms DNS |
| Pas d'organisation | Les machines sont regroupées en groupes logiques (webservers, databases, etc.) |
| Pas de variables centralisées | Chaque machine ou groupe peut avoir des variables définies une seule fois |

**Analogie concrète** : L'inventaire est le carnet d'adresses de ton infrastructure. Chaque contact (machine) a un nom, une adresse (IP), et appartient à un ou plusieurs groupes (famille, travail, amis). Quand tu veux envoyer un message à toute ta famille, tu sélectionnes le groupe "famille" au lieu de taper chaque adresse une par une.

Le diagramme suivant montre la structure hiérarchique d'un inventaire avec des groupes et des hôtes.

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-03-inventaire-1.html">Qu&#x27;est-ce qu&#x27;un inventaire Ansible ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-03-inventaire-1.html" title="Qu&#x27;est-ce qu&#x27;un inventaire Ansible ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce qu'un inventaire n'est PAS** :

- Un inventaire n'est pas une base de données. Il ne stocke pas l'état des machines (sont-elles allumées ? quel logiciel est installé ?). Il stocke uniquement les informations nécessaires pour _se connecter_ aux machines.
- Un inventaire n'est pas un playbook. Un playbook décrit _quoi faire_ sur les machines. L'inventaire décrit _quelles machines_ existent et _comment s'y connecter_.
- Un inventaire statique n'est pas un inventaire dynamique. Un inventaire dynamique interroge un service externe (cloud provider, CMDB) pour générer la liste des machines automatiquement. Cette fiche ne couvre que les inventaires statiques, écrits à la main dans un fichier.

---

### Format INI vs YAML pour l'inventaire

**Définition** : Ansible accepte deux formats de fichier pour écrire un inventaire statique : le format INI et le format YAML. Les deux produisent exactement le même résultat. Le choix est une question de préférence.

**Le problème que les deux formats résolvent** :

Sans format standardisé, voici les problèmes rencontrés :

1. **Incohérence** : Chaque équipe inventerait son propre format de fichier, rendant les inventaires illisibles par d'autres.

2. **Pas d'imbrication facile** : Certaines structures (groupes imbriqués, variables complexes) sont difficiles à exprimer dans un format plat.

**Comment les deux formats résolvent ces problèmes** :

| Problème | Format INI | Format YAML |
| --- | --- | --- |
| Incohérence | Format standardisé, reconnu par Ansible | Format standardisé, reconnu par Ansible |
| Pas d'imbrication facile | Limité pour les structures complexes | Supporte nativement l'imbrication profonde |

**Comparaison INI vs YAML** :

| Critère | Format INI | Format YAML |
| --- | --- | --- |
| Extension de fichier | `.ini` ou sans extension | `.yml` ou `.yaml` |
| Syntaxe de groupe | `[nom_du_groupe]` | `nom_du_groupe:` sous `children:` |
| Syntaxe de variable | `clé=valeur` sur la ligne de l'hôte | `clé: valeur` indenté sous l'hôte |
| Groupes imbriqués | `[parent:children]` | `children:` indenté sous le parent |
| Lisibilité pour des inventaires simples | Très bonne | Bonne |
| Lisibilité pour des inventaires complexes | Moyenne | Très bonne |
| Cohérence avec les playbooks | Non (les playbooks sont en YAML) | Oui (même syntaxe partout) |

**Voici le même inventaire dans les deux formats** :

Format INI :

```ini
[webservers]
web1 ansible_host=192.168.64.2
web2 ansible_host=192.168.64.3

[databases]
db1 ansible_host=192.168.64.4

[production:children]
webservers
databases
```

Format YAML équivalent :

```yaml
all:
  children:
    production:
      children:
        webservers:
          hosts:
            web1:
              ansible_host: 192.168.64.2
            web2:
              ansible_host: 192.168.64.3
        databases:
          hosts:
            db1:
              ansible_host: 192.168.64.4
```

Les deux fichiers ci-dessus décrivent exactement la même infrastructure. Ansible les interprète de façon identique.

**Quelle convention utiliser ?**

- Si ton inventaire est simple (moins de 20 machines, pas de variables complexes) : le format INI est plus rapide à écrire.
- Si ton inventaire est complexe ou si tu veux une cohérence avec tes playbooks (qui sont en YAML) : le format YAML est préférable.
- Dans cette fiche, les deux formats sont montrés systématiquement pour chaque exemple.

---

### Qu'est-ce qu'un groupe d'hôtes ?

**Définition** : Un groupe d'hôtes est un regroupement logique de machines qui partagent un rôle ou une caractéristique commune. Par exemple, toutes les machines qui hébergent un serveur web sont dans le groupe `webservers`.

**Le problème que les groupes résolvent** :

Sans groupes, voici les problèmes rencontrés :

1. **Commandes répétitives** : Pour installer Nginx sur 10 serveurs web, tu devrais exécuter la commande 10 fois, une par machine.

2. **Pas de logique métier** : Impossible de distinguer les serveurs web des serveurs de base de données. Tu ne pourrais pas dire "installe Nginx uniquement sur les serveurs web".

3. **Maintenance difficile** : Quand tu ajoutes une nouvelle machine, tu dois modifier chaque commande ou playbook qui la concerne.

**Comment les groupes résolvent ces problèmes** :

| Problème | Solution apportée par les groupes |
| --- | --- |
| Commandes répétitives | Une seule commande cible tout le groupe en une fois |
| Pas de logique métier | Chaque groupe représente un rôle clair (webservers, databases, etc.) |
| Maintenance difficile | Ajouter une machine à un groupe la rend automatiquement cible de tous les playbooks de ce groupe |

**Les deux groupes spéciaux** :

Ansible crée automatiquement deux groupes que tu ne définis jamais toi-même :

| Groupe | Contenu | Quand l'utiliser |
| --- | --- | --- |
| `all` | Toutes les machines de l'inventaire, sans exception | Pour exécuter une commande sur toutes les machines |
| `ungrouped` | Les machines qui ne sont dans aucun groupe nommé | Rarement utilisé volontairement ; sert à identifier des machines "orphelines" |

**Groupes imbriqués (children)** :

Un groupe peut contenir d'autres groupes. C'est ce qu'on appelle un groupe parent avec des groupes enfants (_children_).

Exemple : le groupe `production` contient les groupes `webservers` et `databases`. Cibler `production` revient à cibler toutes les machines des deux sous-groupes.

```text
production
├── webservers
│   ├── web1
│   └── web2
└── databases
    └── db1
```

**Analogie concrète** : Les groupes fonctionnent comme les dossiers dans un système de fichiers. Tu ranges tes fichiers (machines) dans des dossiers (groupes) par catégorie. Tu peux aussi créer des dossiers contenant d'autres dossiers (groupes imbriqués). Quand tu sélectionnes un dossier, tu sélectionnes tout son contenu.

**Ce qu'un groupe n'est PAS** :

- Un groupe n'est pas exclusif. Une même machine peut appartenir à plusieurs groupes. Par exemple, `web1` peut être dans `webservers` et dans `production` en même temps.
- Un groupe n'est pas un conteneur réseau. Il ne crée aucune isolation réseau entre les machines. C'est un regroupement purement logique, qui existe uniquement dans le fichier d'inventaire.

---

### Qu'est-ce que host_vars et group_vars ?

**Définition** : `host_vars` et `group_vars` sont des mécanismes pour associer des variables à des machines spécifiques (_host_vars_) ou à des groupes de machines (_group_vars_). Ces variables sont ensuite utilisables dans les playbooks et les commandes ad-hoc.

**Le problème que host_vars et group_vars résolvent** :

Sans host_vars et group_vars, voici les problèmes rencontrés :

1. **Variables en vrac** : Tu devrais mettre toutes les variables directement dans l'inventaire, sur la même ligne que chaque machine. Pour des inventaires avec beaucoup de variables, le fichier devient illisible.

2. **Pas de factorisation** : Si 10 machines partagent la même variable (par exemple `http_port: 80`), tu devrais la répéter 10 fois.

3. **Pas de spécialisation** : Impossible de définir une valeur par défaut pour un groupe et une valeur spécifique pour une machine qui fait exception.

**Comment host_vars et group_vars résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Variables en vrac | Les variables sont dans des fichiers séparés, un par hôte ou par groupe |
| Pas de factorisation | `group_vars` définit une variable une seule fois pour tout le groupe |
| Pas de spécialisation | `host_vars` surcharge les `group_vars` pour une machine précise |

**Où placer les fichiers** :

Les fichiers de variables se placent dans des dossiers spéciaux à côté de l'inventaire :

```text
projet-ansible/
├── inventory.yml          # Fichier d'inventaire
├── group_vars/
│   ├── all.yml            # Variables communes à TOUTES les machines
│   ├── webservers.yml     # Variables pour le groupe webservers
│   └── databases.yml      # Variables pour le groupe databases
└── host_vars/
    ├── web1.yml           # Variables spécifiques à web1
    └── db1.yml            # Variables spécifiques à db1
```

**Règles de nommage** :

- Le nom du fichier dans `group_vars/` doit correspondre exactement au nom du groupe dans l'inventaire.
- Le nom du fichier dans `host_vars/` doit correspondre exactement au nom de l'hôte dans l'inventaire.
- L'extension est `.yml` ou `.yaml`.

**Règle de précédence (priorité)** :

Quand une même variable est définie à plusieurs niveaux, Ansible applique un ordre de priorité strict. Voici l'ordre du moins prioritaire au plus prioritaire (les valeurs les plus prioritaires écrasent les autres) :

1. `group_vars/all.yml` (priorité la plus basse)
2. `group_vars/<nom_du_groupe>.yml`
3. `host_vars/<nom_de_l_hote>.yml` (priorité la plus haute)

Exemple concret :

- `group_vars/all.yml` définit `http_port: 80`
- `group_vars/webservers.yml` définit `http_port: 8080`
- `host_vars/web1.yml` définit `http_port: 9090`

Résultat :

- `web1` utilise le port `9090` (host_vars gagne)
- `web2` utilise le port `8080` (group_vars/webservers gagne sur group_vars/all)
- `db1` utilise le port `80` (seul group_vars/all s'applique)

**Analogie concrète** : Les variables fonctionnent comme les règles d'un immeuble. Les règles générales s'appliquent à tout l'immeuble (group_vars/all). Chaque étage peut avoir des règles spécifiques qui remplacent les règles de l'immeuble (group_vars). Et chaque appartement peut avoir ses propres règles qui remplacent celles de l'étage (host_vars).

**Ce que host_vars et group_vars ne sont PAS** :

- Ce ne sont pas des variables d'environnement système. Elles n'existent pas sur les machines distantes. Elles existent uniquement dans Ansible, sur la machine de contrôle, et sont injectées dans les playbooks au moment de l'exécution.
- Ce ne sont pas des secrets chiffrés (par défaut). Les fichiers sont en clair. Pour stocker des mots de passe ou des clés, utilise Ansible Vault (couvert dans une fiche ultérieure).

---

## Étapes Pratiques

### Étape 1 : Créer le dossier de travail

Crée un dossier dédié pour les fichiers de cet exercice.

Commande :

```bash
# Crée le dossier du projet et entre dedans
mkdir -p ~/ansible-inventaire && cd ~/ansible-inventaire
```

**Résultat attendu** :

```text
# Aucune sortie. Le prompt change pour afficher le nouveau répertoire :
~/ansible-inventaire$
```

---

### Étape 2 : Créer un inventaire au format INI

Crée un fichier nommé `inventory.ini` qui décrit trois machines réparties en deux groupes, avec un groupe parent.

Commande :

```bash
# Crée le fichier d'inventaire au format INI
cat > inventory.ini << 'EOF'
# Groupe des serveurs web
[webservers]
web1 ansible_host=192.168.64.2 ansible_user=deploy
web2 ansible_host=192.168.64.3 ansible_user=deploy

# Groupe des serveurs de base de données
[databases]
db1 ansible_host=192.168.64.4 ansible_user=deploy

# Groupe parent "production" qui contient webservers et databases
[production:children]
webservers
databases

# Variables communes à toutes les machines du groupe "production"
[production:vars]
ansible_python_interpreter=/usr/bin/python3
EOF
```

**Résultat attendu** :

```text
# Aucune sortie. Le fichier est créé silencieusement.
```

**Explication ligne par ligne** :

| Ligne | Signification |
| --- | --- |
| `[webservers]` | Début du groupe "webservers" |
| `web1 ansible_host=192.168.64.2 ansible_user=deploy` | L'hôte "web1" a l'IP 192.168.64.2, Ansible s'y connecte avec l'utilisateur "deploy" |
| `[databases]` | Début du groupe "databases" |
| `[production:children]` | Le groupe "production" contient les groupes listés en dessous |
| `[production:vars]` | Variables appliquées à toutes les machines du groupe "production" |
| `ansible_python_interpreter=/usr/bin/python3` | Chemin vers Python 3 sur les machines distantes (nécessaire pour les modules Ansible) |

---

### Étape 3 : Créer le même inventaire au format YAML

Crée un fichier nommé `inventory.yml` qui décrit exactement la même infrastructure que le fichier INI.

Commande :

```bash
# Crée le fichier d'inventaire au format YAML
cat > inventory.yml << 'EOF'
all:
  children:
    production:
      vars:
        ansible_python_interpreter: /usr/bin/python3
      children:
        webservers:
          hosts:
            web1:
              ansible_host: 192.168.64.2
              ansible_user: deploy
            web2:
              ansible_host: 192.168.64.3
              ansible_user: deploy
        databases:
          hosts:
            db1:
              ansible_host: 192.168.64.4
              ansible_user: deploy
EOF
```

**Résultat attendu** :

```text
# Aucune sortie. Le fichier est créé silencieusement.
```

**Explication de la structure YAML** :

| Clé YAML | Signification |
| --- | --- |
| `all:` | Racine de l'inventaire (groupe spécial qui contient tout) |
| `children:` | Liste des sous-groupes |
| `hosts:` | Liste des machines dans un groupe |
| `vars:` | Variables associées au groupe ou à l'hôte |
| `web1:` | Nom de l'hôte (identique au nom dans le format INI) |
| `ansible_host: 192.168.64.2` | Variable de connexion : adresse IP réelle de la machine |

**Règle d'indentation YAML** : Chaque niveau d'imbrication utilise exactement 2 espaces. Pas de tabulations. Une erreur d'indentation provoque une erreur de parsing.

---

### Étape 4 : Vérifier l'inventaire avec ansible-inventory

La commande `ansible-inventory` permet de vérifier que ton inventaire est correctement interprété par Ansible sans exécuter de commande sur les machines distantes.

**Commande 1 : Afficher l'inventaire sous forme de liste YAML** :

```bash
# Affiche l'inventaire complet au format YAML
ansible-inventory -i inventory.yml --list -y
```

**Résultat attendu** :

```yaml
all:
  children:
    production:
      children:
        databases:
          hosts:
            db1:
              ansible_host: 192.168.64.4
              ansible_python_interpreter: /usr/bin/python3
              ansible_user: deploy
        webservers:
          hosts:
            web1:
              ansible_host: 192.168.64.2
              ansible_python_interpreter: /usr/bin/python3
              ansible_user: deploy
            web2:
              ansible_host: 192.168.64.3
              ansible_python_interpreter: /usr/bin/python3
              ansible_user: deploy
    ungrouped: {}
```

Ce résultat montre qu'Ansible a correctement interprété l'inventaire. Chaque hôte a hérité de la variable `ansible_python_interpreter` définie au niveau du groupe `production`. Le groupe `ungrouped` est vide car toutes les machines appartiennent à au moins un groupe.

**Commande 2 : Afficher l'arbre des groupes** :

```bash
# Affiche la hiérarchie des groupes sous forme d'arbre
ansible-inventory -i inventory.yml --graph
```

**Résultat attendu** :

```text
@all:
  |--@production:
  |  |--@databases:
  |  |  |--db1
  |  |--@webservers:
  |  |  |--web1
  |  |  |--web2
  |--@ungrouped:
```

Le préfixe `@` indique un groupe. Les lignes sans `@` sont des hôtes. L'arbre montre clairement la hiérarchie : `all` contient `production`, qui contient `databases` et `webservers`.

**Commande 3 : Afficher les variables d'un hôte spécifique** :

```bash
# Affiche toutes les variables associées à l'hôte web1
ansible-inventory -i inventory.yml --host web1
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.2",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy"
}
```

---

### Étape 5 : Créer des fichiers group_vars et host_vars

Au lieu de mettre toutes les variables dans le fichier d'inventaire, on les sépare dans des fichiers dédiés. C'est la méthode recommandée pour les projets réels.

**Étape 5a : Créer les dossiers** :

```bash
# Crée les dossiers pour les variables de groupes et d'hôtes
mkdir -p group_vars host_vars
```

**Étape 5b : Créer les variables du groupe webservers** :

```bash
# Variables communes à tous les serveurs web
cat > group_vars/webservers.yml << 'EOF'
---
# Port sur lequel le serveur web écoute
http_port: 80

# Nombre maximum de connexions simultanées
max_connections: 1000

# Paquets à installer sur tous les serveurs web
packages:
  - nginx
  - certbot
  - python3-certbot-nginx
EOF
```

**Étape 5c : Créer les variables du groupe databases** :

```bash
# Variables communes à tous les serveurs de base de données
cat > group_vars/databases.yml << 'EOF'
---
# Port sur lequel PostgreSQL écoute
db_port: 5432

# Nom de la base de données principale
db_name: app_production

# Paquets à installer sur tous les serveurs de base de données
packages:
  - postgresql-16
  - postgresql-contrib-16
EOF
```

**Étape 5d : Créer les variables communes à toutes les machines** :

```bash
# Variables communes à TOUTES les machines de l'inventaire
cat > group_vars/all.yml << 'EOF'
---
# Utilisateur de connexion SSH
ansible_user: deploy

# Chemin vers Python sur les machines distantes
ansible_python_interpreter: /usr/bin/python3

# Fuseau horaire des serveurs
timezone: Europe/Paris

# Éditeur de texte par défaut
default_editor: vim
EOF
```

**Étape 5e : Créer les variables spécifiques à web1** :

```bash
# Variables spécifiques à l'hôte web1 (surcharge les group_vars)
cat > host_vars/web1.yml << 'EOF'
---
# web1 est le serveur web principal, il reçoit plus de trafic
max_connections: 2000

# web1 utilise un port HTTPS spécifique pour le monitoring
monitoring_port: 9443
EOF
```

**Étape 5f : Vérifier la structure du projet** :

```bash
# Affiche l'arborescence du projet
find ~/ansible-inventaire -type f | sort
```

**Résultat attendu** :

```text
/home/user/ansible-inventaire/group_vars/all.yml
/home/user/ansible-inventaire/group_vars/databases.yml
/home/user/ansible-inventaire/group_vars/webservers.yml
/home/user/ansible-inventaire/host_vars/web1.yml
/home/user/ansible-inventaire/inventory.ini
/home/user/ansible-inventaire/inventory.yml
```

**Étape 5g : Simplifier l'inventaire YAML** :

Maintenant que les variables sont dans des fichiers séparés, on peut simplifier le fichier `inventory.yml`. Les variables `ansible_user` et `ansible_python_interpreter` sont dans `group_vars/all.yml`, donc il n'est plus nécessaire de les répéter dans l'inventaire.

```bash
# Réécrit l'inventaire simplifié
cat > inventory.yml << 'EOF'
all:
  children:
    production:
      children:
        webservers:
          hosts:
            web1:
              ansible_host: 192.168.64.2
            web2:
              ansible_host: 192.168.64.3
        databases:
          hosts:
            db1:
              ansible_host: 192.168.64.4
EOF
```

L'inventaire est maintenant plus lisible. Les variables de connexion (`ansible_user`, `ansible_python_interpreter`) sont centralisées dans `group_vars/all.yml` et s'appliquent automatiquement à toutes les machines.

---

### Étape 6 : Tester les variables d'inventaire

Vérifie que les variables sont correctement héritées et surchargées.

**Commande 1 : Vérifier les variables de web1** :

```bash
# Affiche toutes les variables de web1 (inclut les group_vars et host_vars)
ansible-inventory -i inventory.yml --host web1
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.2",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy",
    "default_editor": "vim",
    "http_port": 80,
    "max_connections": 2000,
    "monitoring_port": 9443,
    "packages": [
        "nginx",
        "certbot",
        "python3-certbot-nginx"
    ],
    "timezone": "Europe/Paris"
}
```

Points à vérifier dans ce résultat :

- `max_connections` vaut `2000` (pas `1000`), car `host_vars/web1.yml` surcharge `group_vars/webservers.yml`
- `monitoring_port` est présent, car il est défini dans `host_vars/web1.yml`
- `http_port`, `packages` viennent de `group_vars/webservers.yml`
- `ansible_user`, `timezone`, `default_editor` viennent de `group_vars/all.yml`

**Commande 2 : Vérifier les variables de web2** :

```bash
# Affiche toutes les variables de web2 (pas de host_vars pour web2)
ansible-inventory -i inventory.yml --host web2
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.3",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy",
    "default_editor": "vim",
    "http_port": 80,
    "max_connections": 1000,
    "packages": [
        "nginx",
        "certbot",
        "python3-certbot-nginx"
    ],
    "timezone": "Europe/Paris"
}
```

Points à vérifier : `max_connections` vaut `1000` (valeur de `group_vars/webservers.yml`), et `monitoring_port` est absent (pas de `host_vars/web2.yml`).

**Commande 3 : Vérifier les variables de db1** :

```bash
# Affiche toutes les variables de db1
ansible-inventory -i inventory.yml --host db1
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.4",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy",
    "db_name": "app_production",
    "db_port": 5432,
    "default_editor": "vim",
    "packages": [
        "postgresql-16",
        "postgresql-contrib-16"
    ],
    "timezone": "Europe/Paris"
}
```

Points à vérifier : `db1` reçoit les variables de `group_vars/databases.yml` et `group_vars/all.yml`, mais pas celles de `group_vars/webservers.yml`.

---

### Étape 7 : Utiliser le module debug pour afficher des variables

Le module `debug` permet d'afficher la valeur d'une variable sur les machines ciblées. Cette commande ne nécessite pas de connexion SSH réelle : Ansible résout les variables localement quand on utilise `--connection=local`.

```bash
# Affiche la variable http_port pour le groupe webservers
ansible webservers -i inventory.yml -m debug -a "var=http_port" --connection=local
```

**Résultat attendu** :

```text
web1 | SUCCESS => {
    "http_port": 80
}
web2 | SUCCESS => {
    "http_port": 80
}
```

```bash
# Affiche la variable max_connections pour le groupe webservers
ansible webservers -i inventory.yml -m debug -a "var=max_connections" --connection=local
```

**Résultat attendu** :

```text
web1 | SUCCESS => {
    "max_connections": 2000
}
web2 | SUCCESS => {
    "max_connections": 1000
}
```

On voit que `web1` a la valeur `2000` (surcharge par `host_vars/web1.yml`) et `web2` a la valeur `1000` (valeur par défaut de `group_vars/webservers.yml`).

---

### Étape 8 : Cibler des groupes spécifiques avec des patterns

Ansible permet de cibler les machines avec des patterns flexibles. Voici les plus courants.

**Cibler un groupe entier** :

```bash
# Cible toutes les machines du groupe "webservers"
ansible webservers -i inventory.yml --list-hosts
```

**Résultat attendu** :

```text
  hosts (2):
    web1
    web2
```

**Cibler toutes les machines** :

```bash
# Cible toutes les machines de l'inventaire
ansible all -i inventory.yml --list-hosts
```

**Résultat attendu** :

```text
  hosts (3):
    web1
    web2
    db1
```

**Cibler un hôte spécifique** :

```bash
# Cible uniquement l'hôte web1
ansible web1 -i inventory.yml --list-hosts
```

**Résultat attendu** :

```text
  hosts (1):
    web1
```

**Cibler plusieurs groupes** :

```bash
# Cible les machines qui sont dans webservers OU dans databases
ansible 'webservers:databases' -i inventory.yml --list-hosts
```

**Résultat attendu** :

```text
  hosts (3):
    web1
    web2
    db1
```

**Exclure un groupe** :

```bash
# Cible toutes les machines de production SAUF les databases
ansible 'production:!databases' -i inventory.yml --list-hosts
```

**Résultat attendu** :

```text
  hosts (2):
    web1
    web2
```

**Intersection de groupes** :

```bash
# Cible les machines qui sont dans production ET dans webservers
ansible 'production:&webservers' -i inventory.yml --list-hosts
```

**Résultat attendu** :

```text
  hosts (2):
    web1
    web2
```

**Tableau récapitulatif des patterns** :

| Pattern | Signification |
| --- | --- |
| `all` | Toutes les machines |
| `webservers` | Toutes les machines du groupe webservers |
| `web1` | Uniquement l'hôte web1 |
| `webservers:databases` | Machines dans webservers OU databases (union) |
| `production:!databases` | Machines dans production SAUF databases (exclusion) |
| `production:&webservers` | Machines dans production ET webservers (intersection) |
| `web*` | Toutes les machines dont le nom commence par "web" (wildcard) |

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ansible-inventory -i inventory.yml --list -y` | Affiche l'inventaire complet au format YAML |
| `ansible-inventory -i inventory.yml --graph` | Affiche l'arbre hiérarchique des groupes et hôtes |
| `ansible-inventory -i inventory.yml --host web1` | Affiche toutes les variables d'un hôte spécifique |
| `ansible webservers -i inventory.yml --list-hosts` | Liste les hôtes ciblés par un pattern sans exécuter de commande |
| `ansible all -i inventory.yml -m ping` | Teste la connexion SSH vers toutes les machines |
| `ansible webservers -i inventory.yml -m debug -a "var=http_port"` | Affiche la valeur d'une variable pour un groupe |
| `ansible-inventory -i inventory.yml --list --export` | Exporte l'inventaire dans un format réutilisable |

---

## Pièges Fréquents

### Piège 1 : Erreur d'indentation dans un inventaire YAML

**Problème** : YAML est strict sur l'indentation. Une tabulation ou un espace en trop/en moins provoque une erreur de parsing.

**Exemple d'erreur** :

```yaml
# ❌ Incorrect : "hosts" est au même niveau que "children"
all:
  children:
    webservers:
    hosts:
      web1:
        ansible_host: 192.168.64.2
```

```yaml
# ✅ Correct : "hosts" est indenté sous "webservers"
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 192.168.64.2
```

**Solution** :

- Utilise toujours 2 espaces par niveau d'indentation
- Ne mélange jamais tabulations et espaces
- Configure ton éditeur pour afficher les caractères invisibles
- Valide ton fichier avec `ansible-inventory -i inventory.yml --list` avant de l'utiliser

---

### Piège 2 : Oublier ansible_host quand le nom d'hôte n'est pas résolvable

**Problème** : Si tu écris `web1` sans `ansible_host`, Ansible essaie de se connecter à une machine nommée "web1". Si ce nom n'existe pas dans le DNS ou dans `/etc/hosts`, la connexion échoue.

**Message d'erreur typique** :

```text
web1 | UNREACHABLE! => {
    "msg": "Failed to connect to the host via ssh: ssh: Could not resolve hostname web1: Name or service not known",
    "unreachable": true
}
```

**Solution** : Ajoute toujours `ansible_host` avec l'adresse IP réelle quand le nom d'hôte n'est pas résolvable par DNS :

```ini
# ❌ Incorrect si "web1" n'est pas dans le DNS
[webservers]
web1

# ✅ Correct : on précise l'IP avec ansible_host
[webservers]
web1 ansible_host=192.168.64.2
```

---

### Piège 3 : Références circulaires entre groupes

**Problème** : Si un groupe A est enfant de B, et que B est enfant de A, Ansible détecte une boucle et refuse de charger l'inventaire.

**Exemple d'erreur** :

```ini
# ❌ Incorrect : boucle circulaire
[group_a:children]
group_b

[group_b:children]
group_a
```

**Message d'erreur** :

```text
ERROR! Unable to parse /path/to/inventory as an inventory source
```

**Solution** : Dessine la hiérarchie de tes groupes sur papier avant de l'écrire. L'arbre doit être acyclique : un groupe ne peut pas être à la fois ancêtre et descendant d'un autre groupe.

---

### Piège 4 : Confusion sur la précédence des variables

**Problème** : Tu définis la même variable dans `group_vars/all.yml`, `group_vars/webservers.yml` et `host_vars/web1.yml`, et la valeur utilisée n'est pas celle que tu attends.

**Règle** : La valeur la plus spécifique gagne toujours. L'ordre de priorité est (du moins prioritaire au plus prioritaire) :

1. `group_vars/all.yml`
2. `group_vars/<nom_du_groupe>.yml`
3. `host_vars/<nom_de_l_hote>.yml`

**Solution** : Utilise `ansible-inventory --host <nom>` pour vérifier la valeur finale d'une variable sur un hôte donné. En cas de doute, cette commande montre exactement ce qu'Ansible utilise.

```bash
# Vérifie les variables effectives de web1
ansible-inventory -i inventory.yml --host web1
```

---

### Piège 5 : Nom de fichier group_vars ou host_vars incorrect

**Problème** : Le fichier `group_vars/web_servers.yml` (avec un underscore) n'est pas lu si le groupe s'appelle `webservers` (sans underscore). Ansible ne signale pas d'erreur : il ignore le fichier sans afficher d'avertissement.

**Solution** : Le nom du fichier YAML dans `group_vars/` ou `host_vars/` doit correspondre _exactement_ au nom du groupe ou de l'hôte dans l'inventaire. Vérifie l'orthographe et la casse (minuscules/majuscules).

```text
# Inventaire : le groupe s'appelle "webservers"
[webservers]
web1

# ❌ Incorrect : nom de fichier différent
group_vars/web_servers.yml    # underscore en trop
group_vars/Webservers.yml     # majuscule en trop
group_vars/web-servers.yml    # tiret au lieu de rien

# ✅ Correct : nom identique au groupe
group_vars/webservers.yml
```

---

## Checklist de Validation

- [ ] J'ai créé un inventaire avec au moins 2 groupes d'hôtes
- [ ] J'ai créé le même inventaire en format INI et en format YAML
- [ ] `ansible-inventory --graph` affiche ma structure de groupes correctement
- [ ] J'ai créé des fichiers dans `group_vars/` pour au moins 2 groupes
- [ ] J'ai créé un fichier dans `host_vars/` pour au moins 1 hôte
- [ ] J'ai vérifié avec `ansible-inventory --host` que les variables sont correctement héritées et surchargées
- [ ] Je sais la différence entre le format INI et le format YAML
- [ ] Je sais utiliser les patterns pour cibler des groupes spécifiques (`all`, `group:!excluded`, `group:&intersection`)

---

## Exercice Pratique

**Énoncé** : Crée un inventaire complet pour l'infrastructure fictive suivante :

- 3 serveurs web dans un groupe `frontend` : `front1` (192.168.64.10), `front2` (192.168.64.11), `front3` (192.168.64.12)
- 2 serveurs applicatifs dans un groupe `backend` : `app1` (192.168.64.20), `app2` (192.168.64.21)
- 1 serveur de base de données dans un groupe `database` : `dbmaster` (192.168.64.30)
- Un groupe parent `production` qui contient les trois groupes `frontend`, `backend` et `database`
- Des fichiers `group_vars/` pour chaque groupe avec des variables adaptées
- Un fichier `host_vars/` pour `front1` qui surcharge une variable du groupe

**Indications** :

- Crée les deux versions de l'inventaire (INI et YAML)
- Les variables de groupe doivent inclure au moins : un port, une liste de paquets, et un paramètre de configuration spécifique au rôle
- Le fichier `host_vars/front1.yml` doit surcharger au moins une variable du groupe `frontend`
- Vérifie ton travail avec `ansible-inventory --graph` et `ansible-inventory --host`

**Résultat attendu** :

- `ansible-inventory --graph` affiche un arbre avec `production` > `frontend`, `backend`, `database`
- `ansible-inventory --host front1` affiche les variables de `group_vars/all.yml` + `group_vars/frontend.yml` + `host_vars/front1.yml`, avec les surcharges correctes
- `ansible-inventory --host dbmaster` affiche les variables de `group_vars/all.yml` + `group_vars/database.yml`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Structure du projet

```text
exercice-inventaire/
├── inventory.ini
├── inventory.yml
├── group_vars/
│   ├── all.yml
│   ├── frontend.yml
│   ├── backend.yml
│   └── database.yml
└── host_vars/
    └── front1.yml
```

### Inventaire au format INI

```ini
# Serveurs web (reverse proxy + assets statiques)
[frontend]
front1 ansible_host=192.168.64.10
front2 ansible_host=192.168.64.11
front3 ansible_host=192.168.64.12

# Serveurs applicatifs (API + logique métier)
[backend]
app1 ansible_host=192.168.64.20
app2 ansible_host=192.168.64.21

# Serveur de base de données
[database]
dbmaster ansible_host=192.168.64.30

# Groupe parent contenant toute l'infrastructure de production
[production:children]
frontend
backend
database
```

### Inventaire au format YAML

```yaml
all:
  children:
    production:
      children:
        frontend:
          hosts:
            front1:
              ansible_host: 192.168.64.10
            front2:
              ansible_host: 192.168.64.11
            front3:
              ansible_host: 192.168.64.12
        backend:
          hosts:
            app1:
              ansible_host: 192.168.64.20
            app2:
              ansible_host: 192.168.64.21
        database:
          hosts:
            dbmaster:
              ansible_host: 192.168.64.30
```

### Fichier group_vars/all.yml

```yaml
---
# Variables communes à TOUTES les machines
ansible_user: deploy
ansible_python_interpreter: /usr/bin/python3
timezone: Europe/Paris
ntp_server: ntp.ubuntu.com
```

### Fichier group_vars/frontend.yml

```yaml
---
# Variables pour les serveurs web frontend
http_port: 80
https_port: 443

# Nombre maximum de connexions simultanées Nginx
max_connections: 1024

# Paquets à installer sur les serveurs frontend
packages:
  - nginx
  - certbot
  - python3-certbot-nginx
  - logrotate

# Configuration Nginx
nginx_worker_processes: auto
nginx_worker_connections: 1024
```

### Fichier group_vars/backend.yml

```yaml
---
# Variables pour les serveurs applicatifs backend
app_port: 8080

# Nombre de workers de l'application
app_workers: 4

# Paquets à installer sur les serveurs backend
packages:
  - python3
  - python3-pip
  - python3-venv
  - supervisor

# Configuration applicative
app_log_level: info
app_max_request_size: 10m
```

### Fichier group_vars/database.yml

```yaml
---
# Variables pour les serveurs de base de données
db_port: 5432
db_name: app_production
db_max_connections: 200

# Paquets à installer sur les serveurs de base de données
packages:
  - postgresql-16
  - postgresql-contrib-16
  - pg-activity

# Configuration PostgreSQL
postgresql_shared_buffers: 256MB
postgresql_work_mem: 4MB
```

### Fichier host_vars/front1.yml

```yaml
---
# front1 est le serveur frontend principal
# Il reçoit plus de trafic que les autres, donc on augmente les limites
max_connections: 4096
nginx_worker_connections: 4096

# front1 héberge aussi le monitoring Nginx
nginx_status_enabled: true
nginx_status_port: 8081
```

### Vérification avec ansible-inventory

```bash
# Vérifie l'arbre des groupes
ansible-inventory -i inventory.yml --graph
```

**Résultat attendu** :

```text
@all:
  |--@production:
  |  |--@backend:
  |  |  |--app1
  |  |  |--app2
  |  |--@database:
  |  |  |--dbmaster
  |  |--@frontend:
  |  |  |--front1
  |  |  |--front2
  |  |  |--front3
  |--@ungrouped:
```

```bash
# Vérifie les variables de front1 (avec surcharges)
ansible-inventory -i inventory.yml --host front1
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.10",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy",
    "http_port": 80,
    "https_port": 443,
    "max_connections": 4096,
    "nginx_status_enabled": true,
    "nginx_status_port": 8081,
    "nginx_worker_connections": 4096,
    "nginx_worker_processes": "auto",
    "ntp_server": "ntp.ubuntu.com",
    "packages": [
        "nginx",
        "certbot",
        "python3-certbot-nginx",
        "logrotate"
    ],
    "timezone": "Europe/Paris"
}
```

Points importants à vérifier :

- `max_connections` vaut `4096` (host_vars surcharge group_vars/frontend)
- `nginx_worker_connections` vaut `4096` (host_vars surcharge group_vars/frontend)
- `nginx_status_enabled` et `nginx_status_port` sont présents (définis uniquement dans host_vars/front1)
- `timezone` et `ntp_server` viennent de group_vars/all

```bash
# Vérifie les variables de front2 (sans surcharges)
ansible-inventory -i inventory.yml --host front2
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.11",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy",
    "http_port": 80,
    "https_port": 443,
    "max_connections": 1024,
    "nginx_worker_connections": 1024,
    "nginx_worker_processes": "auto",
    "ntp_server": "ntp.ubuntu.com",
    "packages": [
        "nginx",
        "certbot",
        "python3-certbot-nginx",
        "logrotate"
    ],
    "timezone": "Europe/Paris"
}
```

`front2` conserve les valeurs par défaut du groupe (`max_connections: 1024`), car il n'a pas de fichier `host_vars/front2.yml`.

```bash
# Vérifie les variables de dbmaster
ansible-inventory -i inventory.yml --host dbmaster
```

**Résultat attendu** :

```json
{
    "ansible_host": "192.168.64.30",
    "ansible_python_interpreter": "/usr/bin/python3",
    "ansible_user": "deploy",
    "db_max_connections": 200,
    "db_name": "app_production",
    "db_port": 5432,
    "ntp_server": "ntp.ubuntu.com",
    "packages": [
        "postgresql-16",
        "postgresql-contrib-16",
        "pg-activity"
    ],
    "postgresql_shared_buffers": "256MB",
    "postgresql_work_mem": "4MB",
    "timezone": "Europe/Paris"
}
```

`dbmaster` reçoit uniquement les variables de `group_vars/all.yml` et `group_vars/database.yml`. Aucune variable de `group_vars/frontend.yml` ou `group_vars/backend.yml` n'apparaît.

---

## Navigation

← Fiche précédente : **[Installation et Configuration](02-installation-configuration.md)**

→ Fiche suivante : **[Commandes Ad-Hoc et Modules](04-commandes-ad-hoc-modules.md)**
