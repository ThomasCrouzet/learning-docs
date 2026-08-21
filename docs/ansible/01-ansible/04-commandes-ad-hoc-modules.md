---
tags:
  - Ansible
  - Intermédiaire
  - Pratique
description: "Commandes Ad-Hoc et Modules"
estimated_time: "165 min"
fiche_number: 4
total_fiches: 14
cursus: "Ansible"
id: "infrastructure.ansible.commandes-ad-hoc-modules"
course_id: "infrastructure.ansible"
content_type: "lesson"
order: 4
---

# 04 - Commandes Ad-Hoc et Modules

> **En bref** : À la fin de cette fiche, tu sauras exécuter des commandes ad-hoc Ansible et utiliser les modules les plus courants pour administrer des machines à distance. Lecture estimée : 165 min.


## Prérequis

- Avoir lu la fiche **[01 - Introduction à Ansible](01-introduction-ansible.md)**
- Avoir lu la fiche **[02 - Installation et Configuration](02-installation-configuration.md)**
- Avoir lu la fiche **[03 - L'Inventaire Ansible](03-inventaire.md)**
- Savoir utiliser le terminal Linux (commandes de base, SSH)
- Avoir un inventaire Ansible fonctionnel avec au moins un nœud administré accessible

## Objectif de cette fiche

À la fin de cette fiche, tu sauras exécuter des commandes ad-hoc Ansible et utiliser les modules les plus courants pour administrer des machines à distance.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une commande ad-hoc ?

**Définition** : Une commande ad-hoc est une commande Ansible en une seule ligne que tu exécutes directement dans le terminal, sans écrire de fichier playbook.

**Le problème que les commandes ad-hoc résolvent** :

Sans commandes ad-hoc, voici les problèmes rencontrés :

1. **Tâche unique sur plusieurs serveurs** : Tu veux vérifier l'espace disque sur 10 serveurs. Sans Ansible, tu dois te connecter en SSH à chaque serveur un par un et exécuter la commande manuellement.
2. **Tâche rapide sans fichier** : Tu veux redémarrer un service sur 3 serveurs. Écrire un playbook complet pour une seule action prend plus de temps que la tâche elle-même.
3. **Vérification ponctuelle** : Tu veux savoir si tous tes serveurs sont joignables. Faire un `ping` SSH sur chaque machine est long et répétitif.

**Comment les commandes ad-hoc résolvent ces problèmes** :

| Problème | Solution apportée par les commandes ad-hoc |
| --- | --- |
| Tâche unique sur plusieurs serveurs | Une seule commande touche tous les serveurs en parallèle |
| Tâche rapide sans fichier | Pas besoin de créer un fichier, tu tapes directement dans le terminal |
| Vérification ponctuelle | Résultat immédiat, serveur par serveur, dans le terminal |

**Analogie concrète** : Envoyer un SMS rapide à un groupe de personnes, plutôt que de rédiger une lettre formelle à chacune. Le SMS (commande ad-hoc) est rapide et direct. La lettre (playbook) est plus structurée, plus complète, mais prend plus de temps à préparer. Les deux ont leur utilité selon la situation.

**Syntaxe d'une commande ad-hoc** :

```bash
ansible <pattern> -m <module> -a "<arguments>"
```

**Explication de chaque partie** :

| Partie | Rôle | Exemple |
| --- | --- | --- |
| `ansible` | La commande Ansible | `ansible` |
| `<pattern>` | Sur quelles machines exécuter (groupe, hôte, ou `all`) | `all`, `webservers`, `web1` |
| `-m <module>` | Quel module utiliser | `-m ping`, `-m copy` |
| `-a "<arguments>"` | Les paramètres du module | `-a "name=nginx state=present"` |

**Options supplémentaires courantes** :

| Option | Rôle | Exemple |
| --- | --- | --- |
| `-i <inventaire>` | Spécifier le fichier d'inventaire | `-i inventory.ini` |
| `--become` | Exécuter avec les privilèges root (sudo) | `--become` |
| `-u <utilisateur>` | Se connecter avec un utilisateur spécifique | `-u deploy` |

**Ce qu'une commande ad-hoc n'est PAS** :

- Une commande ad-hoc n'est pas un playbook. Un playbook est un fichier YAML réutilisable qui contient plusieurs tâches organisées. Une commande ad-hoc est jetable : elle fait une seule chose, une seule fois.
- Une commande ad-hoc n'est pas adaptée aux tâches complexes. Si tu as besoin de conditions, de boucles, de variables ou d'enchaîner plusieurs actions, utilise un playbook.

**Comparaison commande ad-hoc vs playbook** :

| Commande ad-hoc | Playbook |
| --- | --- |
| Une seule tâche | Plusieurs tâches organisées |
| Tapée dans le terminal | Écrite dans un fichier YAML |
| Non réutilisable | Réutilisable à volonté |
| Rapide à écrire | Plus long à écrire |
| Pas de conditions ni boucles | Supporte conditions, boucles, variables |
| Pour les tâches ponctuelles | Pour les tâches répétables |

---

### Qu'est-ce qu'un module Ansible ?

**Définition** : Un module Ansible est une unité de code spécialisée qu'Ansible exécute sur les nœuds administrés pour accomplir une tâche précise (copier un fichier, installer un paquet, gérer un service, etc.).

**Le problème que les modules résolvent** :

Sans modules, voici les problèmes rencontrés :

1. **Commandes différentes selon l'OS** : Installer un paquet se fait avec `apt` sur Debian/Ubuntu, `yum` sur CentOS, `dnf` sur Fedora. Tu devrais connaître et adapter la commande pour chaque serveur.
2. **Pas de vérification d'état** : Si tu exécutes `apt install nginx` sur un serveur où Nginx est déjà installé, la commande s'exécute quand même inutilement.
3. **Pas de gestion d'erreur intégrée** : Si une commande échoue, tu dois analyser la sortie pour comprendre le problème.

**Comment les modules résolvent ces problèmes** :

| Problème | Solution apportée par les modules |
| --- | --- |
| Commandes différentes selon l'OS | Le module `apt` gère Debian/Ubuntu, le module `yum` gère CentOS, etc. |
| Pas de vérification d'état | Le module vérifie l'état actuel avant d'agir (idempotence) |
| Pas de gestion d'erreur intégrée | Le module renvoie un statut clair : `changed`, `ok`, ou `failed` |

**Analogie concrète** : Les modules sont comme les outils spécialisés dans une boîte à outils. Tu as un tournevis pour les vis, une clé pour les boulons, un marteau pour les clous. Chaque outil (module) est conçu pour une tâche précise et sait exactement comment l'accomplir. Tu n'utilises pas un marteau pour visser : tu choisis l'outil adapté.

**L'idempotence des modules** :

L'idempotence est une propriété des modules Ansible. Voici ce que cela signifie concrètement :

- **Première exécution** : le module vérifie l'état actuel du système, constate que la modification est nécessaire, et l'applique. Statut : `changed`.
- **Deuxième exécution** (même commande) : le module vérifie l'état actuel, constate que le système est déjà dans l'état souhaité, et ne fait rien. Statut : `ok`.

Exemple concret :

```bash
# Première exécution : installe nginx (changed)
ansible all -m apt -a "name=nginx state=present" --become

# Deuxième exécution : nginx est déjà installé, ne fait rien (ok)
ansible all -m apt -a "name=nginx state=present" --become
```

Cette propriété est importante : tu peux exécuter la même commande autant de fois que tu veux sans risque de casser le système.

**Ce qu'un module n'est PAS** :

- Un module n'est pas un script shell. Un script s'exécute de manière séquentielle sans vérifier l'état du système. Un module vérifie l'état avant d'agir.
- Un module n'est pas un programme que tu installes sur les nœuds. Ansible transfère automatiquement le code du module sur le nœud, l'exécute, puis le supprime.

**Les statuts de retour d'un module** :

| Statut | Signification | Couleur dans le terminal |
| --- | --- | --- |
| `ok` | Le système est déjà dans l'état souhaité, aucune modification | Vert |
| `changed` | Le module a modifié le système pour atteindre l'état souhaité | Jaune |
| `failed` | Le module a rencontré une erreur | Rouge |
| `unreachable` | Ansible ne peut pas se connecter au nœud | Rouge |

---

### L'élévation de privilèges (become)

**Définition** : L'élévation de privilèges (`become`) est un mécanisme Ansible qui permet d'exécuter des tâches en tant qu'un autre utilisateur, le plus souvent `root` (configurable avec `become_user`). Cela correspond à utiliser `sudo` sur un serveur Linux.

**Le problème que become résout** :

Sans élévation de privilèges, voici les problèmes rencontrés :

1. **Installation de paquets impossible** : Un utilisateur normal ne peut pas exécuter `apt install`. Seul `root` (ou un utilisateur avec `sudo`) peut installer des logiciels.
2. **Gestion des services refusée** : Démarrer ou arrêter un service système (comme Nginx) nécessite les droits `root`.
3. **Modification de fichiers système bloquée** : Modifier un fichier dans `/etc/` nécessite les droits `root`.

**Comment become résout ces problèmes** :

| Problème | Solution apportée par become |
| --- | --- |
| Installation de paquets impossible | `--become` exécute la commande en tant que `root` via `sudo` |
| Gestion des services refusée | `--become` donne les droits nécessaires pour gérer les services |
| Modification de fichiers système bloquée | `--become` donne les droits d'écriture sur les fichiers système |

**Analogie concrète** : Imagine un immeuble avec des portes qui nécessitent des badges différents. Avec ton badge personnel (utilisateur normal), tu peux accéder à ton bureau. Avec le badge du gestionnaire de l'immeuble (`root`), tu peux accéder à toutes les pièces : la chaufferie, le local technique, le tableau électrique. L'option `--become` te prête temporairement le badge du gestionnaire pour effectuer une tâche précise.

**Les options de become** :

| Option | Rôle | Valeur par défaut |
| --- | --- | --- |
| `--become` | Active l'élévation de privilèges | Désactivé |
| `--become-method` | Méthode d'élévation utilisée | `sudo` |
| `--become-user` | Utilisateur cible | `root` |
| `--ask-become-pass` | Demande le mot de passe sudo | Non demandé |

**Exemples concrets** :

```bash
# Exécuter en tant que root (cas le plus courant)
ansible all -m apt -a "name=nginx state=present" --become

# Exécuter en tant qu'un utilisateur spécifique
ansible all -m command -a "whoami" --become --become-user=www-data

# Avec demande du mot de passe sudo
ansible all -m apt -a "name=nginx state=present" --become --ask-become-pass
```

**Quand utiliser become ?**

| Tâche | become nécessaire ? |
| --- | --- |
| Tester la connexion (`ping`) | Non |
| Exécuter `uptime` ou `hostname` | Non |
| Lire un fichier accessible à tous | Non |
| Installer ou supprimer un paquet | Oui |
| Démarrer ou arrêter un service | Oui |
| Modifier un fichier dans `/etc/` | Oui |
| Créer ou supprimer un utilisateur | Oui |
| Créer un dossier dans `/var/www/` | Oui (selon les permissions) |

**Ce que become n'est PAS** :

- become n'est pas une connexion en tant que `root`. Ansible se connecte avec ton utilisateur SSH normal, puis utilise `sudo` sur le nœud pour exécuter la commande avec les droits élevés.
- become ne modifie pas les permissions de ton utilisateur. L'élévation est temporaire et limitée à la commande exécutée.

---

## Étapes Pratiques

### Étape 1 : Module ping - Tester la connexion

Le module `ping` vérifie qu'Ansible peut se connecter à un nœud et y exécuter du code Python. Ce n'est pas un ping réseau ICMP : c'est un test complet de la chaîne de connexion Ansible.

Commande :

```bash
# Teste la connexion à tous les noeuds de l'inventaire
ansible all -m ping
```

**Résultat attendu** :

```text
web1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
web2 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

**Comment lire ce résultat** :

- `web1 | SUCCESS` : le nœud `web1` a répondu avec succès
- `"changed": false` : aucune modification n'a été faite sur le nœud (le module `ping` ne modifie rien)
- `"ping": "pong"` : la réponse standard du module `ping`

Si un nœud est injoignable, tu verras :

```text
web3 | UNREACHABLE! => {
    "changed": false,
    "msg": "Failed to connect to the host via ssh: ssh: connect to host 192.168.1.13 port 22: Connection refused",
    "unreachable": true
}
```

---

### Étape 2 : Module command - Exécuter une commande simple

Le module `command` exécute une commande sur les nœuds administrés. C'est le module par défaut : si tu ne spécifies pas de module avec `-m`, Ansible utilise `command`.

Commande :

```bash
# Afficher le temps de fonctionnement de chaque serveur
ansible all -m command -a "uptime"
```

**Résultat attendu** :

```text
web1 | CHANGED | rc=0 >>
 14:32:07 up 12 days,  3:45,  1 user,  load average: 0.08, 0.03, 0.01
web2 | CHANGED | rc=0 >>
 14:32:07 up 5 days, 22:10,  1 user,  load average: 0.15, 0.10, 0.05
```

**Comment lire ce résultat** :

- `CHANGED` : le module `command` retourne toujours `changed` car il ne vérifie pas l'état (il exécute la commande à chaque fois)
- `rc=0` : le code de retour est 0, ce qui signifie que la commande a réussi
- La ligne suivante (`>>`) contient la sortie de la commande

Autres exemples avec le module `command` :

```bash
# Afficher l'espace disque disponible
ansible all -m command -a "df -h"

# Afficher le nom d'hôte de chaque serveur
ansible all -m command -a "hostname"

# Afficher la version du noyau Linux
ansible all -m command -a "uname -r"
```

**Limitation du module command** : Le module `command` n'utilise pas le shell du système. Il exécute directement le binaire. Cela signifie que les fonctionnalités du shell ne sont **pas disponibles** :

| Fonctionnalité shell | Disponible avec `command` ? | Exemple |
| --- | --- | --- |
| Pipes (`\|`) | Non | `cat /etc/os-release \| head -5` |
| Redirections (`>`, `>>`) | Non | `echo "test" > /tmp/file.txt` |
| Variables d'environnement (`$HOME`) | Non | `echo $HOME` |
| Wildcards (`*`, `?`) | Non | `ls /tmp/*.log` |

Si tu as besoin de ces fonctionnalités, utilise le module `shell` (étape 3).

---

### Étape 3 : Module shell - Exécuter une commande avec le shell

Le module `shell` exécute une commande via le shell du système (`/bin/sh`). Il supporte toutes les fonctionnalités du shell : pipes, redirections, variables d'environnement.

Commande :

```bash
# Afficher les 5 premières lignes du fichier os-release via un pipe
ansible all -m shell -a "cat /etc/os-release | head -5"
```

**Résultat attendu** :

```text
web1 | CHANGED | rc=0 >>
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
```

Autres exemples avec le module `shell` :

```bash
# Lister les fichiers log triés par taille
ansible all -m shell -a "ls -lhS /var/log/*.log"

# Compter le nombre de processus en cours
ansible all -m shell -a "ps aux | wc -l"

# Écrire dans un fichier via redirection
ansible all -m shell -a "echo 'Test Ansible' >> /tmp/ansible-test.txt"

# Utiliser une variable d'environnement
ansible all -m shell -a "echo $HOSTNAME"
```

**Comparaison command vs shell** :

| Critère | Module `command` | Module `shell` |
| --- | --- | --- |
| Utilise le shell système | Non (exécution directe) | Oui (`/bin/sh`) |
| Pipes (`\|`) | Non supporté | Supporté |
| Redirections (`>`, `>>`) | Non supporté | Supporté |
| Variables d'environnement | Non supporté | Supporté |
| Wildcards (`*`) | Non supporté | Supporté |
| Sécurité | Plus sûr (pas d'injection shell) | Moins sûr (injection possible) |
| Quand l'utiliser | Commandes simples, sans pipe ni redirection | Quand tu as besoin des fonctionnalités du shell |

**Règle à retenir** : Utilise `command` par défaut. Utilise `shell` uniquement quand tu as besoin des pipes, des redirections ou des variables d'environnement.

---

### Étape 4 : Module copy - Copier un fichier vers les nœuds

Le module `copy` transfère un fichier depuis ta machine de contrôle vers les nœuds administrés. Il est idempotent : si le fichier existe déjà avec le même contenu, il ne le recopie pas.

Crée d'abord un fichier de test sur ta machine de contrôle :

```bash
# Crée un fichier de test à copier
echo "Fichier déployé par Ansible" > hello.txt
```

Commande ad-hoc :

```bash
# Copie le fichier hello.txt vers /tmp/hello.txt sur tous les noeuds
ansible all -m copy -a "src=./hello.txt dest=/tmp/hello.txt mode=0644"
```

**Explication des arguments** :

| Argument | Rôle | Valeur dans l'exemple |
| --- | --- | --- |
| `src` | Chemin du fichier source (sur ta machine) | `./hello.txt` |
| `dest` | Chemin de destination (sur les nœuds) | `/tmp/hello.txt` |
| `mode` | Permissions du fichier en notation octale | `0644` (lecture/écriture pour le propriétaire, lecture seule pour les autres) |

**Résultat attendu (première exécution)** :

```text
web1 | CHANGED => {
    "changed": true,
    "checksum": "a1b2c3d4e5f6...",
    "dest": "/tmp/hello.txt",
    "gid": 1000,
    "group": "deploy",
    "md5sum": "abc123...",
    "mode": "0644",
    "owner": "deploy",
    "size": 28,
    "src": "/home/deploy/.ansible/tmp/.../source",
    "state": "file",
    "uid": 1000
}
```

**Résultat attendu (deuxième exécution, même commande)** :

```text
web1 | SUCCESS => {
    "changed": false,
    "checksum": "a1b2c3d4e5f6...",
    "dest": "/tmp/hello.txt",
    "gid": 1000,
    "group": "deploy",
    "mode": "0644",
    "owner": "deploy",
    "path": "/tmp/hello.txt",
    "size": 28,
    "state": "file",
    "uid": 1000
}
```

Remarque : la deuxième exécution retourne `"changed": false` car le fichier existe déjà avec le même contenu. C'est l'idempotence en action.

Tu peux aussi utiliser le module `copy` pour écrire du contenu directement (sans fichier source) :

```bash
# Écrit du contenu directement dans un fichier sur les noeuds
ansible all -m copy -a "content='Hello from Ansible\n' dest=/tmp/hello-direct.txt mode=0644"
```

---

### Étape 5 : Module apt - Gérer les paquets (Debian/Ubuntu)

Le module `apt` gère les paquets logiciels sur les systèmes Debian et Ubuntu. Il nécessite les droits root, donc tu dois ajouter `--become`.

**Installer un paquet** :

```bash
# Installe le paquet nginx
ansible all -m apt -a "name=nginx state=present" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "cache_update_time": 1708873200,
    "cache_valid_time": 0,
    "stderr": "",
    "stdout": "Reading package lists...\nBuilding dependency tree...\n..."
}
```

**Désinstaller un paquet** :

```bash
# Désinstalle le paquet nginx
ansible all -m apt -a "name=nginx state=absent" --become
```

**Mettre à jour le cache des paquets** :

```bash
# Équivalent de "apt update"
ansible all -m apt -a "update_cache=yes" --become
```

**Installer un paquet avec mise à jour du cache** :

```bash
# Met à jour le cache et installe nginx en une seule commande
ansible all -m apt -a "name=nginx state=present update_cache=yes" --become
```

**Les valeurs de l'argument state** :

| Valeur | Action | Équivalent apt |
| --- | --- | --- |
| `present` | Installe le paquet s'il n'est pas déjà installé | `apt install` |
| `absent` | Désinstalle le paquet s'il est installé | `apt remove` |
| `latest` | Installe ou met à jour le paquet à la dernière version | `apt install --upgrade` |

**Différence entre `present` et `latest`** :

- `state=present` : installe le paquet s'il n'est pas là, ne fait rien s'il est déjà installé (même une version ancienne)
- `state=latest` : installe le paquet s'il n'est pas là, le met à jour s'il existe mais qu'une version plus récente est disponible

---

### Étape 6 : Module service - Gérer les services

Le module `service` gère les services système (démarrage, arrêt, redémarrage, activation au boot). Il nécessite les droits root.

**Démarrer un service et l'activer au démarrage** :

```bash
# Démarre nginx et l'active au démarrage du système
ansible all -m service -a "name=nginx state=started enabled=yes" --become
```

**Explication des arguments** :

| Argument | Rôle | Valeurs possibles |
| --- | --- | --- |
| `name` | Nom du service | `nginx`, `ssh`, `postgresql`, etc. |
| `state` | État souhaité du service | `started`, `stopped`, `restarted`, `reloaded` |
| `enabled` | Activer le service au démarrage du système | `yes`, `no` |

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "enabled": true,
    "name": "nginx",
    "state": "started",
    "status": {
        "ActiveState": "active",
        ...
    }
}
```

**Arrêter un service** :

```bash
# Arrête le service nginx
ansible all -m service -a "name=nginx state=stopped" --become
```

**Redémarrer un service** :

```bash
# Redémarre nginx (arrête puis démarre)
ansible all -m service -a "name=nginx state=restarted" --become
```

**Recharger la configuration d'un service** :

```bash
# Recharge la configuration de nginx sans l'arrêter
ansible all -m service -a "name=nginx state=reloaded" --become
```

**Les valeurs de l'argument state pour les services** :

| Valeur | Action | Équivalent systemctl |
| --- | --- | --- |
| `started` | Démarre le service s'il est arrêté | `systemctl start` |
| `stopped` | Arrête le service s'il est démarré | `systemctl stop` |
| `restarted` | Arrête puis redémarre le service | `systemctl restart` |
| `reloaded` | Recharge la configuration sans arrêter le service | `systemctl reload` |

---

### Étape 7 : Module file - Gérer les fichiers et répertoires

Le module `file` permet de créer, modifier ou supprimer des fichiers et des répertoires, ainsi que de gérer leurs permissions.

**Créer un répertoire** :

```bash
# Crée le répertoire /tmp/testdir avec les permissions 0755
ansible all -m file -a "path=/tmp/testdir state=directory mode=0755"
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "gid": 1000,
    "group": "deploy",
    "mode": "0755",
    "owner": "deploy",
    "path": "/tmp/testdir",
    "size": 4096,
    "state": "directory",
    "uid": 1000
}
```

**Supprimer un fichier ou répertoire** :

```bash
# Supprime le répertoire /tmp/testdir et tout son contenu
ansible all -m file -a "path=/tmp/testdir state=absent"
```

**Créer un fichier vide** :

```bash
# Crée un fichier vide (ou met à jour sa date de modification s'il existe)
ansible all -m file -a "path=/tmp/testfile.txt state=touch mode=0644"
```

**Changer le propriétaire d'un fichier** :

```bash
# Change le propriétaire et le groupe du fichier
ansible all -m file -a "path=/var/www/mysite owner=www-data group=www-data" --become
```

**Créer un lien symbolique** :

```bash
# Crée un lien symbolique /tmp/link vers /tmp/testdir
ansible all -m file -a "src=/tmp/testdir dest=/tmp/link state=link"
```

**Les valeurs de l'argument state pour file** :

| Valeur | Action |
| --- | --- |
| `directory` | Crée un répertoire (et les répertoires parents si nécessaire) |
| `file` | Vérifie que le fichier existe (ne le crée pas) |
| `touch` | Crée un fichier vide ou met à jour sa date de modification |
| `link` | Crée un lien symbolique |
| `absent` | Supprime le fichier ou répertoire |

---

### Étape 8 : Module user - Gérer les utilisateurs

Le module `user` permet de créer, modifier ou supprimer des comptes utilisateurs sur les nœuds. Il nécessite les droits root.

**Créer un utilisateur** :

```bash
# Crée l'utilisateur "deploy" avec le shell bash
ansible all -m user -a "name=deploy state=present shell=/bin/bash" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "comment": "",
    "create_home": true,
    "group": 1001,
    "home": "/home/deploy",
    "name": "deploy",
    "shell": "/bin/bash",
    "state": "present",
    "uid": 1001
}
```

**Créer un utilisateur avec des options supplémentaires** :

```bash
# Crée un utilisateur avec un répertoire home, un commentaire et un groupe supplémentaire
ansible all -m user -a "name=webadmin state=present shell=/bin/bash comment='Web Administrator' groups=sudo append=yes" --become
```

**Explication des arguments** :

| Argument | Rôle | Exemple |
| --- | --- | --- |
| `name` | Nom de l'utilisateur | `deploy` |
| `state` | `present` (créer) ou `absent` (supprimer) | `present` |
| `shell` | Shell de l'utilisateur | `/bin/bash` |
| `comment` | Description de l'utilisateur | `'Web Administrator'` |
| `groups` | Groupes supplémentaires | `sudo,www-data` |
| `append` | Ajouter aux groupes (sans remplacer les groupes existants) | `yes` |
| `create_home` | Créer le répertoire home | `yes` (par défaut) |
| `remove` | Supprimer le répertoire home lors de la suppression | `yes` |

**Supprimer un utilisateur** :

```bash
# Supprime l'utilisateur "deploy" et son répertoire home
ansible all -m user -a "name=deploy state=absent remove=yes" --become
```

---

### Étape 9 : Module setup - Collecter les informations système

Le module `setup` collecte les _facts_ : des informations détaillées sur chaque nœud (système d'exploitation, adresse IP, mémoire, processeur, etc.).

Commande :

```bash
# Collecte toutes les informations système de tous les noeuds
ansible all -m setup
```

Ce module retourne un grand volume de données. Pour filtrer les résultats, utilise le paramètre `filter` :

```bash
# Afficher uniquement la distribution Linux
ansible all -m setup -a "filter=ansible_distribution*"
```

**Résultat attendu** :

```text
web1 | SUCCESS => {
    "ansible_facts": {
        "ansible_distribution": "Debian",
        "ansible_distribution_file_parsed": true,
        "ansible_distribution_file_path": "/etc/os-release",
        "ansible_distribution_file_variety": "Debian",
        "ansible_distribution_major_version": "12",
        "ansible_distribution_release": "bookworm",
        "ansible_distribution_version": "12"
    },
    "changed": false
}
```

**Filtres utiles** :

```bash
# Afficher l'adresse IPv4
ansible all -m setup -a "filter=ansible_default_ipv4"

# Afficher la mémoire totale
ansible all -m setup -a "filter=ansible_memtotal_mb"

# Afficher le nombre de processeurs
ansible all -m setup -a "filter=ansible_processor_vcpus"

# Afficher le nom d'hôte
ansible all -m setup -a "filter=ansible_hostname"
```

---

### Étape 10 : Limiter l'exécution à un groupe ou un hôte

Tu peux cibler des groupes ou des hôtes spécifiques au lieu de `all`.

**Cibler un groupe** :

```bash
# Teste la connexion uniquement aux serveurs du groupe "webservers"
ansible webservers -m ping
```

**Cibler un hôte précis** :

```bash
# Exécute hostname uniquement sur web1
ansible web1 -m command -a "hostname"
```

**Cibler plusieurs groupes** :

```bash
# Cible les groupes webservers ET dbservers
ansible webservers:dbservers -m ping
```

**Exclure un hôte** :

```bash
# Cible tous les webservers sauf web2
ansible 'webservers:!web2' -m ping
```

**Limiter avec l'option --limit** :

```bash
# Cible all mais limite à web1 uniquement
ansible all -m ping --limit web1

# Limite à plusieurs hôtes
ansible all -m ping --limit "web1,web2"
```

**Résumé des patterns de ciblage** :

| Pattern | Signification |
| --- | --- |
| `all` | Tous les nœuds de l'inventaire |
| `webservers` | Tous les nœuds du groupe `webservers` |
| `web1` | Le nœud `web1` uniquement |
| `webservers:dbservers` | Les nœuds des deux groupes |
| `webservers:!web2` | Le groupe `webservers` sauf `web2` |
| `webservers:&staging` | Les nœuds à la fois dans `webservers` ET dans `staging` |

---

## Commandes Utiles

### Récapitulatif des modules couverts dans cette fiche

| Module | Action | Exemple d'utilisation |
| --- | --- | --- |
| `ping` | Teste la connexion Ansible au nœud | `ansible all -m ping` |
| `command` | Exécute une commande (sans shell) | `ansible all -m command -a "uptime"` |
| `shell` | Exécute une commande via le shell | `ansible all -m shell -a "cat /etc/hosts \| head"` |
| `copy` | Copie un fichier vers les nœuds | `ansible all -m copy -a "src=f.txt dest=/tmp/f.txt"` |
| `apt` | Gère les paquets Debian/Ubuntu | `ansible all -m apt -a "name=nginx state=present" --become` |
| `service` | Gère les services système | `ansible all -m service -a "name=nginx state=started" --become` |
| `file` | Gère fichiers, répertoires, permissions | `ansible all -m file -a "path=/tmp/dir state=directory"` |
| `user` | Gère les comptes utilisateurs | `ansible all -m user -a "name=deploy state=present" --become` |
| `setup` | Collecte les informations système (facts) | `ansible all -m setup -a "filter=ansible_distribution"` |

### Commandes ad-hoc fréquentes

| Commande | Action |
| --- | --- |
| `ansible all -m ping` | Vérifier que tous les nœuds sont joignables |
| `ansible all -m command -a "uptime"` | Voir depuis combien de temps chaque serveur tourne |
| `ansible all -m command -a "free -h"` | Voir la mémoire disponible sur chaque serveur |
| `ansible all -m command -a "df -h"` | Voir l'espace disque disponible |
| `ansible all -m shell -a "ps aux \| wc -l"` | Compter le nombre de processus |
| `ansible all -m apt -a "update_cache=yes" --become` | Mettre à jour le cache des paquets |
| `ansible all -m service -a "name=nginx state=restarted" --become` | Redémarrer Nginx sur tous les serveurs |

---

## Pièges Fréquents

### Piège 1 : Utiliser shell quand command suffit

⚠️ **Problème** : Le module `shell` est utilisé systématiquement, même pour des commandes simples. Le module `shell` est moins sécurisé car il passe par le shell système, ce qui expose aux injections de commandes.

✅ **Solution** : Utilise `command` par défaut. Utilise `shell` uniquement quand tu as besoin des pipes (`|`), des redirections (`>`, `>>`), des variables d'environnement (`$HOME`) ou des wildcards (`*`).

```bash
# ❌ Incorrect : shell n'est pas nécessaire ici
ansible all -m shell -a "uptime"

# ✅ Correct : command suffit pour une commande simple
ansible all -m command -a "uptime"

# ✅ Correct : shell est nécessaire ici à cause du pipe
ansible all -m shell -a "ps aux | grep nginx"
```

---

### Piège 2 : Oublier --become pour les tâches nécessitant root

⚠️ **Problème** : La commande échoue avec une erreur de permission car l'utilisateur SSH n'a pas les droits suffisants.

```text
web1 | FAILED! => {
    "changed": false,
    "msg": "Failed to lock apt for exclusive operation\nE: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)"
}
```

✅ **Solution** : Ajoute `--become` à la commande.

```bash
# ❌ Incorrect : pas de droits root
ansible all -m apt -a "name=nginx state=present"

# ✅ Correct : --become donne les droits root
ansible all -m apt -a "name=nginx state=present" --become
```

**Règle** : Si la tâche concerne les paquets, les services, les utilisateurs ou les fichiers système, ajoute toujours `--become`.

---

### Piège 3 : Le module command ne supporte pas les pipes et redirections

⚠️ **Problème** : Tu exécutes une commande avec un pipe via le module `command`, et le pipe est interprété comme un argument de la commande, pas comme un opérateur shell.

```bash
# ❌ Incorrect : le pipe ne fonctionne pas avec command
ansible all -m command -a "cat /etc/passwd | grep root"
```

Le résultat sera une erreur ou un comportement inattendu car `command` passe `|`, `grep` et `root` comme arguments à `cat`.

✅ **Solution** : Utilise le module `shell` pour les commandes avec des pipes ou des redirections.

```bash
# ✅ Correct : le module shell supporte les pipes
ansible all -m shell -a "cat /etc/passwd | grep root"
```

---

### Piège 4 : Confondre state=present et state=latest pour apt

⚠️ **Problème** : Tu utilises `state=present` en pensant que le paquet sera mis à jour si une nouvelle version est disponible. Ce n'est pas le cas.

✅ **Solution** :

- `state=present` : installe le paquet _uniquement_ s'il n'est pas déjà installé. Si le paquet est déjà installé (même une ancienne version), `present` ne fait rien.
- `state=latest` : installe le paquet s'il n'est pas là, _et_ le met à jour si une version plus récente est disponible.

```bash
# Installe nginx s'il n'est pas là, ne met pas à jour
ansible all -m apt -a "name=nginx state=present" --become

# Installe nginx s'il n'est pas là OU le met à jour si une nouvelle version existe
ansible all -m apt -a "name=nginx state=latest" --become
```

**Conseil** : Utilise `state=present` dans la plupart des cas. Utilise `state=latest` uniquement quand tu veux explicitement mettre à jour un paquet.

---

### Piège 5 : Penser que l'idempotence s'applique au module command

⚠️ **Problème** : Les modules `command` et `shell` retournent toujours `changed` car ils ne vérifient pas l'état du système avant d'agir. Ils exécutent la commande à chaque fois, sans savoir si elle est nécessaire.

```text
# Même si le fichier existe déjà, command retourne "changed"
web1 | CHANGED | rc=0 >>
(sortie de la commande)
```

✅ **Solution** : Pour les tâches idempotentes, utilise les modules spécialisés au lieu de `command` ou `shell`.

```bash
# ❌ Non idempotent : crée le dossier à chaque exécution (ou échoue s'il existe)
ansible all -m command -a "mkdir /tmp/testdir"

# ✅ Idempotent : crée le dossier uniquement s'il n'existe pas
ansible all -m file -a "path=/tmp/testdir state=directory"

# ❌ Non idempotent : copie le fichier à chaque exécution
ansible all -m shell -a "cp /home/deploy/hello.txt /tmp/hello.txt"

# ✅ Idempotent : copie uniquement si le contenu a changé
ansible all -m copy -a "src=./hello.txt dest=/tmp/hello.txt"
```

---

## Checklist de Validation

- [ ] J'ai testé le module `ping` et tous mes nœuds répondent `pong`
- [ ] Je connais la différence entre le module `command` et le module `shell`
- [ ] J'ai exécuté une commande simple avec le module `command` (par exemple `uptime`)
- [ ] J'ai exécuté une commande avec un pipe via le module `shell`
- [ ] J'ai copié un fichier vers les nœuds avec le module `copy`
- [ ] J'ai vérifié l'idempotence du module `copy` (deuxième exécution : `changed: false`)
- [ ] J'ai installé un paquet avec le module `apt` et l'option `--become`
- [ ] J'ai désinstallé un paquet avec `state=absent`
- [ ] J'ai démarré et arrêté un service avec le module `service`
- [ ] J'ai créé un répertoire avec le module `file`
- [ ] J'ai ciblé un groupe spécifique au lieu de `all`

---

## Exercice Pratique

**Énoncé** : En utilisant uniquement des commandes ad-hoc Ansible, mets en place un serveur web basique sur tous tes nœuds.

**Étapes à réaliser** :

1. Crée un utilisateur `webadmin` sur tous les serveurs
2. Crée un répertoire `/var/www/mysite` appartenant à l'utilisateur `webadmin`
3. Crée un fichier `index.html` contenant `<h1>Deploye par Ansible</h1>` et copie-le vers `/var/www/mysite/`
4. Installe le paquet `nginx`
5. Démarre le service `nginx` et active-le au démarrage
6. Vérifie que tout fonctionne en utilisant les modules appropriés

**Indications** :

- Toutes les commandes touchant le système nécessitent `--become`
- Utilise les modules spécialisés (`user`, `file`, `copy`, `apt`, `service`) plutôt que `command` ou `shell`
- Pense à l'ordre des opérations : l'utilisateur doit exister avant de lui attribuer un dossier

**Résultat attendu** :

- L'utilisateur `webadmin` existe sur tous les nœuds
- Le répertoire `/var/www/mysite` existe et appartient à `webadmin`
- Le fichier `/var/www/mysite/index.html` contient le contenu HTML
- Nginx est installé, démarré et activé au démarrage

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer l'utilisateur webadmin**

```bash
ansible all -m user -a "name=webadmin state=present shell=/bin/bash comment='Web Administrator'" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "name": "webadmin",
    "shell": "/bin/bash",
    "state": "present",
    ...
}
```

**Étape 2 : Créer le répertoire /var/www/mysite**

```bash
ansible all -m file -a "path=/var/www/mysite state=directory owner=webadmin group=webadmin mode=0755" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "owner": "webadmin",
    "path": "/var/www/mysite",
    "state": "directory",
    ...
}
```

**Étape 3 : Créer et copier le fichier index.html**

Crée d'abord le fichier sur ta machine de contrôle :

```bash
echo '<h1>Deploye par Ansible</h1>' > index.html
```

Copie-le vers les nœuds :

```bash
ansible all -m copy -a "src=./index.html dest=/var/www/mysite/index.html owner=webadmin group=webadmin mode=0644" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "dest": "/var/www/mysite/index.html",
    "owner": "webadmin",
    ...
}
```

**Étape 4 : Installer nginx**

```bash
ansible all -m apt -a "name=nginx state=present update_cache=yes" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    ...
}
```

**Étape 5 : Démarrer nginx et l'activer au démarrage**

```bash
ansible all -m service -a "name=nginx state=started enabled=yes" --become
```

**Résultat attendu** :

```text
web1 | CHANGED => {
    "changed": true,
    "enabled": true,
    "name": "nginx",
    "state": "started",
    ...
}
```

**Étape 6 : Vérifier que tout fonctionne**

Vérifie l'utilisateur :

```bash
ansible all -m command -a "id webadmin"
```

**Résultat attendu** :

```text
web1 | CHANGED | rc=0 >>
uid=1001(webadmin) gid=1001(webadmin) groups=1001(webadmin)
```

Vérifie le répertoire et le fichier :

```bash
ansible all -m command -a "ls -la /var/www/mysite/"
```

**Résultat attendu** :

```text
web1 | CHANGED | rc=0 >>
total 12
drwxr-xr-x 2 webadmin webadmin 4096 Feb 25 10:30 .
drwxr-xr-x 3 root     root     4096 Feb 25 10:29 ..
-rw-r--r-- 1 webadmin webadmin   30 Feb 25 10:30 index.html
```

Vérifie le contenu du fichier :

```bash
ansible all -m command -a "cat /var/www/mysite/index.html"
```

**Résultat attendu** :

```text
web1 | CHANGED | rc=0 >>
<h1>Deploye par Ansible</h1>
```

Vérifie que nginx est actif :

```bash
ansible all -m command -a "systemctl status nginx" --become
```

**Résultat attendu** (extrait) :

```text
web1 | CHANGED | rc=0 >>
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since ...
```

---

## Navigation

← Fiche précédente : **[L'Inventaire Ansible](03-inventaire.md)**

→ Fiche suivante : **[Les Playbooks : Fondamentaux](05-playbooks-fondamentaux.md)**
