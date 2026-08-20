---
tags:
  - Ansible
  - Débutant
  - Pratique
description: "Installation et Configuration"
estimated_time: "150 min"
fiche_number: 2
total_fiches: 14
cursus: "Ansible"
---

# 02 - Installation et Configuration

> **En bref** : À la fin de cette fiche, tu auras installé Ansible sur ta machine de contrôle et configuré une machine cible de test pour exécuter tes premières commandes. Lecture estimée : 150 min.


## Prérequis

- Avoir lu la fiche **[01 - Introduction à Ansible](01-introduction-ansible.md)**
- Un ordinateur sous Linux (Ubuntu/Debian) ou macOS
- Accès administrateur (`sudo`)
- Savoir utiliser le terminal (commandes `cd`, `ls`, `cat`, `nano` ou `vim`)
- Savoir utiliser SSH (connexion à une machine distante)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Ansible | 14.x (ansible-core 2.21) |
| Python | 3.12+ |
| Ubuntu | 24.04 LTS (Python 3.12 par défaut). Ubuntu 22.04 livre Python 3.10 : installer Python 3.12 à part si tu restes sur 22.04 |
| Multipass | dernière version stable |

## Objectif de cette fiche

À la fin de cette fiche, tu auras installé Ansible sur ta machine de contrôle et configuré une machine cible de test pour exécuter tes premières commandes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le nœud de contrôle (control node) ?

**Définition** : Le nœud de contrôle est la machine sur laquelle Ansible est installé. C'est depuis cette machine que tu lances toutes les commandes et tous les playbooks Ansible.

**Le problème que le nœud de contrôle résout** :

Sans nœud de contrôle dédié, voici les problèmes rencontrés :

1. **Pas de point central** : Tu devrais te connecter manuellement à chaque serveur pour exécuter des commandes. Avec 10 serveurs, cela signifie 10 connexions SSH manuelles.
2. **Pas de traçabilité** : Sans point central, tu ne sais pas quelles commandes ont été exécutées sur quels serveurs.
3. **Pas de reproductibilité** : Les commandes tapées manuellement sur chaque serveur ne sont pas enregistrées de manière structurée.

**Comment le nœud de contrôle résout ces problèmes** :

| Problème | Solution apportée par le nœud de contrôle |
| --- | --- |
| Pas de point central | Toutes les commandes partent d'une seule machine |
| Pas de traçabilité | Les playbooks et les logs sont stockés sur le nœud de contrôle |
| Pas de reproductibilité | Les playbooks sont des fichiers versionnés qu'on peut rejouer |

**Analogie concrète** : Le nœud de contrôle est le pupitre du chef d'orchestre. Le chef ne joue d'aucun instrument lui-même. Il se tient à son pupitre, lit la partition (le playbook) et donne des instructions aux musiciens (les nœuds gérés). Tous les musiciens regardent le chef pour savoir quoi jouer et quand.

Le diagramme suivant résume les étapes de configuration initiale d'Ansible, de l'installation jusqu'au premier test de connexion.

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-02-installation-configuration-1.html">Qu&#x27;est-ce que le nœud de contrôle (control node) ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-02-installation-configuration-1.html" title="Qu&#x27;est-ce que le nœud de contrôle (control node) ?" style="width:100%;min-height:616px;border:0;background:transparent"></iframe>
</div>

**Conditions requises pour le nœud de contrôle** :

- Python 3.12 ou supérieur installé (ansible-core 2.21 / Ansible 14.x requiert Python ≥ 3.12 sur le nœud de contrôle ; les anciennes lignes, par exemple ansible-core 2.19 / Ansible 12, acceptaient encore Python 3.11 - contexte historique uniquement)
- Système d'exploitation : Linux ou macOS
- Windows n'est **pas** supporté comme nœud de contrôle (c'est une limitation d'Ansible, pas un choix). Si tu es sous Windows, utilise WSL2 (Windows Subsystem for Linux)
- Connexion SSH vers les nœuds gérés

**Ce que le nœud de contrôle n'est PAS** :

- Le nœud de contrôle n'est pas un serveur de production. C'est ta machine de travail (ton ordinateur portable ou un serveur d'administration dédié).
- Le nœud de contrôle n'est pas un agent. Ansible ne fonctionne pas avec un agent installé sur les machines. Le nœud de contrôle se connecte en SSH aux machines cibles et exécute les commandes à distance.

---

### Qu'est-ce qu'un nœud géré (managed node) ?

**Définition** : Un nœud géré est toute machine qu'Ansible administre à distance. Ansible se connecte au nœud géré par SSH, exécute des commandes, puis se déconnecte.

**Le problème que les nœuds gérés résolvent** :

Le concept de "nœud géré" dans Ansible permet de traiter n'importe quelle machine accessible en SSH comme une cible d'automatisation, sans rien installer dessus au préalable (pas d'agent).

**Conditions requises pour un nœud géré** :

- Python 3 installé (la plupart des distributions Linux l'incluent par défaut)
- Un serveur SSH actif (sshd)
- Un compte utilisateur auquel Ansible peut se connecter
- Les droits `sudo` si les tâches nécessitent des privilèges administrateur

**Analogie concrète** : Les nœuds gérés sont les musiciens de l'orchestre. Chaque musicien possède son propre instrument (son système d'exploitation, ses logiciels). Le musicien n'a besoin de rien de spécial pour recevoir les instructions du chef d'orchestre : il suffit qu'il soit présent (SSH actif) et qu'il sache lire (Python installé).

**Ce qu'un nœud géré n'est PAS** :

- Un nœud géré n'a pas besoin d'avoir Ansible installé. Seul le nœud de contrôle a besoin d'Ansible.
- Un nœud géré n'est pas limité à Linux. Ansible peut gérer des machines Windows (via WinRM au lieu de SSH), des équipements réseau, des instances cloud. Dans cette fiche, on se concentre sur les nœuds Linux.

**Comparaison nœud de contrôle vs nœud géré** :

| Nœud de contrôle | Nœud géré |
| --- | --- |
| Ansible installé dessus | Ansible **pas** installé dessus |
| Lance les commandes | Reçoit et exécute les commandes |
| Contient les playbooks et l'inventaire | Ne contient rien d'Ansible |
| Un seul par projet | Un ou plusieurs (jusqu'à des milliers) |
| Nécessite Python 3.12+ | Nécessite Python 3 (n'importe quelle version récente supportée) |
| Linux ou macOS uniquement | Linux, Windows, macOS, équipements réseau |

---

### Qu'est-ce que le fichier ansible.cfg ?

**Définition** : Le fichier `ansible.cfg` est le fichier de configuration central d'Ansible. Il définit le comportement par défaut d'Ansible : quel inventaire utiliser, quel utilisateur SSH utiliser, quelles options activer.

**Le problème que ansible.cfg résout** :

Sans fichier `ansible.cfg`, voici les problèmes rencontrés :

1. **Répétition des options** : Tu devrais passer les mêmes options en ligne de commande à chaque exécution. Par exemple : `ansible all -i ./inventory.ini -u ubuntu --become -m ping`. C'est long et source d'erreurs.
2. **Incohérence entre exécutions** : Si tu oublies une option une fois, le comportement change. Par exemple, oublier `--become` fait échouer les tâches qui nécessitent `sudo`.
3. **Configuration par défaut inadaptée** : Les valeurs par défaut d'Ansible ne correspondent pas toujours à ton environnement.

**Comment ansible.cfg résout ces problèmes** :

| Problème | Solution apportée par ansible.cfg |
| --- | --- |
| Répétition des options | Les options sont définies une fois dans le fichier |
| Incohérence entre exécutions | Le comportement est identique à chaque exécution |
| Configuration inadaptée | Tu définis tes propres valeurs par défaut |

**Analogie concrète** : Le fichier `ansible.cfg` est le panneau de réglages d'une application. Quand tu ouvres une application pour la première fois, tu vas dans les préférences pour régler la langue, le thème, les notifications. Ensuite, ces réglages s'appliquent automatiquement à chaque utilisation. Le fichier `ansible.cfg` fonctionne de la même façon : tu définis tes préférences une fois, et Ansible les applique à chaque commande.

**Ordre de recherche du fichier ansible.cfg** :

Ansible cherche le fichier de configuration dans cet ordre précis. Il utilise **le premier fichier trouvé** et ignore les suivants :

1. **Variable d'environnement `ANSIBLE_CONFIG`** : Si cette variable est définie, Ansible utilise le fichier qu'elle indique. Exemple : `export ANSIBLE_CONFIG=/chemin/vers/mon/ansible.cfg`
2. **`./ansible.cfg`** : Dans le répertoire courant (celui où tu exécutes la commande `ansible`)
3. **`~/.ansible.cfg`** : Dans ton répertoire personnel
4. **`/etc/ansible/ansible.cfg`** : Configuration globale du système

**Recommandation** : Utilise toujours un fichier `ansible.cfg` dans le répertoire de ton projet (option 2). Cela garantit que chaque projet a sa propre configuration, indépendante des autres.

**Les paramètres importants** :

| Paramètre | Section | Signification |
| --- | --- | --- |
| `inventory` | `[defaults]` | Chemin vers le fichier d'inventaire |
| `remote_user` | `[defaults]` | Utilisateur SSH par défaut |
| `host_key_checking` | `[defaults]` | Vérification de la clé SSH du serveur (`True`/`False`) |
| `roles_path` | `[defaults]` | Chemin vers les rôles Ansible |
| `become` | `[privilege_escalation]` | Activer l'élévation de privilèges (`True`/`False`) |
| `become_method` | `[privilege_escalation]` | Méthode d'élévation (`sudo`, `su`) |
| `become_ask_pass` | `[privilege_escalation]` | Demander le mot de passe sudo (`True`/`False`) |

---

### Qu'est-ce que la connexion SSH sans mot de passe ?

**Définition** : La connexion SSH sans mot de passe est un mécanisme d'authentification basé sur une paire de clés cryptographiques (une clé privée et une clé publique) qui permet de se connecter à un serveur distant sans saisir de mot de passe.

**Le problème que la connexion SSH sans mot de passe résout** :

Sans connexion SSH par clé, voici les problèmes rencontrés :

1. **Blocage de l'automatisation** : Ansible se connecte en SSH aux nœuds gérés. Si SSH demande un mot de passe, Ansible ne peut pas fonctionner automatiquement (il faudrait saisir le mot de passe pour chaque machine, à chaque commande).
2. **Sécurité faible** : Un mot de passe peut être deviné par force brute. Une clé SSH de 4096 bits est virtuellement impossible à deviner.
3. **Gestion difficile** : Avec 50 serveurs, gérer 50 mots de passe différents est ingérable.

**Comment la connexion SSH par clé résout ces problèmes** :

| Problème | Solution apportée par les clés SSH |
| --- | --- |
| Blocage de l'automatisation | La connexion est automatique, sans interaction humaine |
| Sécurité faible | La clé cryptographique est extrêmement difficile à compromettre |
| Gestion difficile | Une seule clé publique déployée sur tous les serveurs |

**Comment fonctionne l'authentification par clé SSH** :

Le processus se déroule en deux phases :

**Phase 1 : Préparation (une seule fois)**

1. Tu génères une paire de clés sur le nœud de contrôle : une clé **privée** (secrète, reste sur ta machine) et une clé **publique** (partageable)
2. Tu copies la clé publique sur chaque nœud géré, dans le fichier `~/.ssh/authorized_keys` de l'utilisateur cible

**Phase 2 : Connexion (à chaque fois)**

1. Tu lances une connexion SSH (ou Ansible le fait pour toi)
2. Le serveur distant envoie un défi chiffré avec ta clé publique
3. Ton ordinateur déchiffre le défi avec ta clé privée
4. Le serveur vérifie la réponse et autorise la connexion

**Analogie concrète** : L'authentification par clé SSH fonctionne comme un verrou et sa clé dans la vie courante. Tu fais fabriquer une serrure (clé publique) et une clé (clé privée). Tu installes la serrure sur la porte du serveur. Seule ta clé peut ouvrir cette serrure. Tu peux installer des copies de la même serrure sur plusieurs portes (plusieurs serveurs), mais il n'existe qu'une seule clé qui les ouvre toutes.

**Ce que la connexion SSH sans mot de passe n'est PAS** :

- Ce n'est pas une connexion sans sécurité. Au contraire, les clés SSH sont plus sécurisées que les mots de passe.
- Ce n'est pas définitif. Tu peux révoquer l'accès à tout moment en supprimant la clé publique du fichier `authorized_keys` du serveur.

---

## Étapes Pratiques

### Étape 1 : Vérifier la version de Python

Ansible est écrit en Python. Le nœud de contrôle nécessite Python 3.12 ou supérieur (requis par ansible-core 2.21 / Ansible 14.x).

Commande :

```bash
# Affiche la version de Python installée
python3 --version
```

**Résultat attendu** :

```text
Python 3.12.3
```

Le numéro exact peut varier. L'important est d'avoir Python **3.12** ou supérieur (3.**12**, 3.**13**, 3.**14**...).

Si Python n'est pas installé ou si la version est trop ancienne, installe-le.

Sur **Ubuntu 24.04 LTS**, `python3` est déjà en 3.12 :

```bash
# Met à jour la liste des paquets disponibles
sudo apt update

# Installe Python 3, pip (gestionnaire de paquets Python) et venv (environnements virtuels)
sudo apt install -y python3 python3-pip python3-venv
```

Sur **Ubuntu 22.04 LTS**, `apt install python3` installe Python **3.10**, trop ancien pour ansible-core 2.21. Installe Python 3.12 (paquet `python3.12` / PPA deadsnakes, ou passe à Ubuntu 24.04), puis crée le venv avec `python3.12 -m venv ~/ansible-env`.

**Sur macOS**, Python 3 est inclus avec les outils en ligne de commande Xcode :

```bash
# Installe les outils en ligne de commande (inclut Python 3)
xcode-select --install
```

---

### Étape 2 : Créer un environnement virtuel Python

Un environnement virtuel Python est un dossier isolé qui contient sa propre copie de Python et de ses paquets. Cela évite de polluer le système avec des paquets installés globalement.

**Pourquoi un environnement virtuel ?**

- Sans environnement virtuel, `pip install ansible` installe Ansible dans les dossiers système de Python. Cela peut créer des conflits avec d'autres logiciels.
- Avec un environnement virtuel, Ansible est isolé. Tu peux le supprimer sans affecter le reste du système.

Commande :

```bash
# Crée un environnement virtuel dans le dossier ~/ansible-env
python3 -m venv ~/ansible-env
```

Cette commande crée le dossier `~/ansible-env` avec la structure suivante :

```text
~/ansible-env/
├── bin/           # Contient les exécutables (python, pip, ansible après installation)
├── include/       # Fichiers d'en-tête C (tu n'y toucheras pas)
├── lib/           # Les paquets Python installés dans cet environnement
└── pyvenv.cfg     # Configuration de l'environnement virtuel
```

Active l'environnement virtuel :

```bash
# Active l'environnement virtuel
source ~/ansible-env/bin/activate
```

**Résultat attendu** : Le prompt de ton terminal change pour indiquer que l'environnement est actif :

```text
(ansible-env) utilisateur@machine:~$
```

Le préfixe `(ansible-env)` confirme que l'environnement est actif. Toutes les commandes `pip install` installeront les paquets dans cet environnement, pas dans le système.

**Pour désactiver l'environnement** (ne le fais pas maintenant) :

```bash
# Désactive l'environnement virtuel (à ne pas exécuter maintenant)
deactivate
```

**Astuce** : Pour activer automatiquement l'environnement à chaque ouverture de terminal, ajoute la ligne `source ~/ansible-env/bin/activate` à la fin de ton fichier `~/.bashrc` (ou `~/.zshrc` si tu utilises zsh).

---

### Étape 3 : Installer Ansible via pip

Maintenant que l'environnement virtuel est actif, installe Ansible :

```bash
# Installe Ansible 14.x (ansible-core 2.21) dans l'environnement virtuel
# Epingle la serie 14.x pour coller aux versions de reference de ce cursus.
# Sans borne, pip installe la derniere version majeure (comportements et Python
# minimum peuvent differer de ceux documentes ici).
pip install 'ansible>=14.0,<15.0'
```

L'installation prend quelques minutes. pip télécharge Ansible et toutes ses dépendances.

Vérifie que l'installation a fonctionné :

```bash
# Affiche la version d'Ansible et les informations de configuration
ansible --version
```

**Résultat attendu** :

```text
ansible [core 2.21.x]
  config file = None
  configured module search path = ['/home/utilisateur/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /home/utilisateur/ansible-env/lib/python3.12/site-packages/ansible
  ansible collection location = /home/utilisateur/.ansible/collections:/usr/share/ansible/collections
  executable location = /home/utilisateur/ansible-env/bin/ansible
  python version = 3.12.x (main, ...) [GCC ...]
  jinja version = 3.1.x
  libyaml = True
```

Les points à vérifier :

- `ansible [core 2.21.x]` : La version d'ansible-core
- `config file = None` : Normal, on n'a pas encore créé de fichier `ansible.cfg`
- `python version = 3.12+` : Python 3.12 ou supérieur (requis par ansible-core 2.21)
- `executable location` contient `ansible-env` : Ansible est bien dans l'environnement virtuel

**Pourquoi pip et pas apt ?**

| Installation via apt | Installation via pip |
| --- | --- |
| `sudo apt install ansible` | `pip install 'ansible>=14.0,<15.0'` |
| Version souvent ancienne (dépend de la distribution) | Version controlée (ici Ansible 14 / core 2.21) |
| Installé globalement sur le système | Isolé dans l'environnement virtuel |
| Mise à jour liée à la distribution | Mise à jour contrôlée avec une borne de version |

Recommandation : Utilise **toujours** pip pour installer Ansible, avec une **borne de version** (`>=14.0,<15.0` pour ce cursus). La version disponible via apt est souvent en retard de plusieurs versions majeures. Sans borne, `pip install ansible` prend la dernière majeure, qui peut exiger un Python plus recent et differer des exemples de ce cours.

---

### Étape 4 : Créer une VM de test avec Multipass

Pour tester Ansible, tu as besoin d'au moins un nœud géré. Multipass est un outil de Canonical (les créateurs d'Ubuntu) qui permet de créer des machines virtuelles Ubuntu en une seule commande.

**Installer Multipass** :

Sur Ubuntu :

```bash
# Installe Multipass via snap
sudo snap install multipass
```

Sur macOS :

```bash
# Installe Multipass via Homebrew
brew install --cask multipass
```

**Créer une VM de test** :

```bash
# Crée une VM Ubuntu nommée "ansible-target"
# Par défaut : 1 CPU, 1 Go de RAM, 5 Go de disque
multipass launch --name ansible-target
```

Cette commande télécharge une image Ubuntu (la première fois) et crée une VM. L'opération prend 1 à 3 minutes selon ta connexion internet.

**Vérifier que la VM fonctionne** :

```bash
# Affiche les informations de la VM (dont l'adresse IP)
multipass info ansible-target
```

**Résultat attendu** :

```text
Name:           ansible-target
State:          Running
IPv4:           10.110.48.53
Release:        Ubuntu 24.04 LTS
Image hash:     abcdef123456 (Ubuntu 24.04 LTS)
CPU(s):         1
Load:           0.00 0.00 0.00
Disk usage:     1.5GiB out of 4.8GiB
Memory usage:   200.0MiB out of 966.1MiB
Mounts:         --
```

**Note l'adresse IPv4** (ici `10.110.48.53`). Tu en auras besoin dans les étapes suivantes. L'adresse sera différente sur ta machine.

**Commandes Multipass utiles** :

| Commande | Action |
| --- | --- |
| `multipass launch --name <nom>` | Crée et démarre une nouvelle VM |
| `multipass info <nom>` | Affiche les informations d'une VM |
| `multipass list` | Liste toutes les VM |
| `multipass shell <nom>` | Ouvre un terminal dans la VM |
| `multipass stop <nom>` | Arrête une VM |
| `multipass start <nom>` | Démarre une VM arrêtée |
| `multipass delete <nom> --purge` | Supprime définitivement une VM |

**Alternative : Vagrant**

Si tu utilises déjà Vagrant avec VirtualBox, tu peux l'utiliser à la place de Multipass. L'important est d'avoir une VM Ubuntu accessible en SSH. Multipass est recommandé dans cette fiche car il est plus simple à utiliser pour des VM Ubuntu.

---

### Étape 5 : Configurer l'accès SSH à la VM cible

Ansible se connecte aux nœuds gérés par SSH. Tu dois configurer l'authentification par clé SSH entre ton nœud de contrôle et la VM de test.

**Étape 5a : Vérifier si tu as déjà une clé SSH**

```bash
# Liste les clés SSH existantes
ls -la ~/.ssh/
```

**Résultat attendu si une clé existe** :

```text
-rw-------  1 utilisateur utilisateur 3381 jan  1 12:00 id_ed25519
-rw-r--r--  1 utilisateur utilisateur  741 jan  1 12:00 id_ed25519.pub
```

Si tu vois des fichiers `id_ed25519` et `id_ed25519.pub` (ou `id_rsa` et `id_rsa.pub`), tu as déjà une clé SSH. Passe à l'étape 5b.

**Si aucune clé n'existe**, génère-en une :

```bash
# Génère une paire de clés SSH de type Ed25519
# -t ed25519 : type de clé (plus moderne et sécurisé que RSA)
# -C : commentaire pour identifier la clé
ssh-keygen -t ed25519 -C "ansible-control-node"
```

Le terminal pose trois questions :

```text
Enter file in which to save the key (/home/utilisateur/.ssh/id_ed25519):
```

Appuie sur **Entrée** pour accepter le chemin par défaut.

```text
Enter passphrase (empty for no passphrase):
```

Appuie sur **Entrée** pour ne pas mettre de passphrase (nécessaire pour l'automatisation Ansible).

```text
Enter same passphrase again:
```

Appuie sur **Entrée** une dernière fois.

**Étape 5b : Copier la clé publique sur la VM**

Avec Multipass, la méthode la plus simple est d'utiliser `multipass transfer` et `multipass exec` :

```bash
# Copie ta clé publique dans un fichier temporaire sur la VM
multipass transfer ~/.ssh/id_ed25519.pub ansible-target:/tmp/control_key.pub

# Ajoute la clé publique au fichier authorized_keys de l'utilisateur ubuntu sur la VM
multipass exec ansible-target -- bash -c "cat /tmp/control_key.pub >> ~/.ssh/authorized_keys"

# Supprime le fichier temporaire
multipass exec ansible-target -- rm /tmp/control_key.pub
```

Explication de chaque commande :

- `multipass transfer` : Copie un fichier de ta machine vers la VM
- `multipass exec` : Exécute une commande à l'intérieur de la VM
- `cat ... >> ~/.ssh/authorized_keys` : Ajoute le contenu de la clé publique à la fin du fichier `authorized_keys` (le fichier qui liste les clés autorisées à se connecter)

**Étape 5c : Tester la connexion SSH**

Récupère l'adresse IP de la VM (notée à l'étape 4), puis teste la connexion :

```bash
# Remplace 10.110.48.53 par l'adresse IP de ta VM
ssh ubuntu@10.110.48.53
```

**Résultat attendu** :

```text
Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.x.x-xx-generic x86_64)
...
ubuntu@ansible-target:~$
```

Si la connexion fonctionne sans demander de mot de passe, l'authentification par clé est correctement configurée.

Tape `exit` pour revenir sur ton nœud de contrôle :

```bash
# Quitte la session SSH et reviens sur ta machine
exit
```

**Si la connexion demande un mot de passe** :

Cela signifie que la clé publique n'a pas été correctement copiée. Vérifie :

- Que le fichier `~/.ssh/authorized_keys` sur la VM contient bien ta clé publique :

```bash
multipass exec ansible-target -- cat ~/.ssh/authorized_keys
```

- Que les permissions du dossier `.ssh` sur la VM sont correctes :

```bash
multipass exec ansible-target -- chmod 700 ~/.ssh
multipass exec ansible-target -- chmod 600 ~/.ssh/authorized_keys
```

---

### Étape 6 : Créer le répertoire du projet et le fichier ansible.cfg

Crée un répertoire dédié pour ton projet Ansible :

```bash
# Crée le répertoire du projet
mkdir -p ~/projets/ansible-lab

# Entre dans le répertoire
cd ~/projets/ansible-lab
```

Crée le fichier `ansible.cfg` :

```bash
# Crée le fichier ansible.cfg dans le répertoire du projet
nano ~/projets/ansible-lab/ansible.cfg
```

Copie ce contenu dans le fichier :

```ini
[defaults]
# Chemin vers le fichier d'inventaire (liste des machines à gérer)
inventory = ./inventory.ini

# Utilisateur SSH utilisé pour se connecter aux noeuds gérés
# "ubuntu" est l'utilisateur par défaut des VM Multipass
remote_user = ubuntu

# Désactive la vérification de la clé SSH du serveur
# En production, cette option doit être True pour la sécurité
# En environnement de test, False évite les erreurs de première connexion
host_key_checking = False

[privilege_escalation]
# Active l'élévation de privilèges par défaut (équivalent de sudo)
become = True

# Méthode d'élévation de privilèges
become_method = sudo

# Ne pas demander le mot de passe sudo
# L'utilisateur ubuntu sur les VM Multipass peut utiliser sudo sans mot de passe
become_ask_pass = False
```

Sauvegarde le fichier (dans nano : `Ctrl+O`, `Entrée`, `Ctrl+X`).

**Explication détaillée de chaque paramètre** :

| Paramètre | Valeur | Explication |
| --- | --- | --- |
| `inventory` | `./inventory.ini` | Ansible cherchera la liste des machines dans le fichier `inventory.ini` du répertoire courant |
| `remote_user` | `ubuntu` | Ansible se connectera en SSH avec l'utilisateur `ubuntu` |
| `host_key_checking` | `False` | Ansible ne demandera pas de confirmer l'empreinte SSH des serveurs. En test uniquement. |
| `become` | `True` | Ansible exécutera les tâches avec `sudo` par défaut |
| `become_method` | `sudo` | La méthode d'élévation de privilèges est `sudo` (et non `su` ou `pbrun`) |
| `become_ask_pass` | `False` | Ansible ne demandera pas le mot de passe sudo (l'utilisateur ubuntu a le droit sudo sans mot de passe) |

Vérifie que Ansible détecte bien le fichier de configuration :

```bash
# Vérifie qu'Ansible utilise le bon fichier de configuration
# Exécute cette commande depuis ~/projets/ansible-lab/
cd ~/projets/ansible-lab && ansible --version
```

**Résultat attendu** (extrait) :

```text
ansible [core 2.21.x]
  config file = /home/utilisateur/projets/ansible-lab/ansible.cfg
```

La ligne `config file` doit maintenant pointer vers ton fichier `ansible.cfg`. Si elle affiche `None`, vérifie que tu es bien dans le répertoire `~/projets/ansible-lab/`.

---

### Étape 7 : Créer un inventaire minimal

L'inventaire est le fichier qui liste les machines qu'Ansible doit gérer. Crée un fichier `inventory.ini` dans le répertoire du projet :

```bash
# Crée le fichier d'inventaire
nano ~/projets/ansible-lab/inventory.ini
```

Copie ce contenu (remplace `10.110.48.53` par l'adresse IP de ta VM) :

```ini
[test]
# Remplace cette adresse IP par celle de ta VM (affichée par "multipass info ansible-target")
10.110.48.53
```

Sauvegarde le fichier.

**Explication** :

- `[test]` : Définit un groupe nommé "test". Les groupes permettent d'organiser les machines par rôle (serveurs web, bases de données, etc.)
- `10.110.48.53` : L'adresse IP de la VM. C'est la seule machine dans ce groupe

**Structure du répertoire à ce stade** :

```text
~/projets/ansible-lab/
├── ansible.cfg        # Configuration d'Ansible
└── inventory.ini      # Liste des machines à gérer
```

**Vérifier que l'inventaire est correctement lu** :

```bash
# Affiche la liste des machines dans l'inventaire
cd ~/projets/ansible-lab && ansible-inventory --list
```

**Résultat attendu** :

```text
{
    "_meta": {
        "hostvars": {}
    },
    "all": {
        "children": [
            "ungrouped",
            "test"
        ]
    },
    "test": {
        "hosts": [
            "10.110.48.53"
        ]
    }
}
```

Tu dois voir ta VM listée dans le groupe "test". Le groupe "all" contient automatiquement toutes les machines de tous les groupes.

---

### Étape 8 : Tester la connexion avec Ansible

C'est le moment de vérifier que tout fonctionne. Le module `ping` d'Ansible se connecte à chaque machine de l'inventaire et vérifie que la connexion SSH fonctionne et que Python est disponible sur le nœud géré.

**Le module `ping` d'Ansible n'est PAS un ping réseau (ICMP).** C'est un module qui :

1. Se connecte en SSH à la machine cible
2. Vérifie que Python est installé et fonctionnel
3. Retourne `pong` si tout fonctionne

Commande :

```bash
# Teste la connexion Ansible vers toutes les machines de l'inventaire
cd ~/projets/ansible-lab && ansible all -m ping
```

Explication de la commande :

- `ansible` : La commande principale d'Ansible
- `all` : Cible toutes les machines de l'inventaire. Tu pourrais aussi écrire `test` pour cibler uniquement le groupe "test"
- `-m ping` : Utilise le module `ping`

**Résultat attendu** :

```text
10.110.48.53 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

Les points à vérifier :

- `SUCCESS` : La connexion a réussi
- `"ping": "pong"` : Le module ping a fonctionné correctement
- `"changed": false` : Le module n'a rien modifié sur la machine cible (normal pour un ping)
- `discovered_interpreter_python` : Ansible a trouvé Python sur le nœud géré

**Si le test échoue**, consulte la section "Pièges Fréquents" ci-dessous.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `python3 --version` | Affiche la version de Python installée |
| `source ~/ansible-env/bin/activate` | Active l'environnement virtuel Ansible |
| `deactivate` | Désactive l'environnement virtuel |
| `pip install 'ansible>=14.0,<15.0'` | Installe Ansible 14.x (core 2.21) dans l'environnement virtuel actif |
| `pip install --upgrade ansible` | Met à jour Ansible vers la dernière version |
| `ansible --version` | Affiche la version d'Ansible et le fichier de configuration utilisé |
| `ansible-inventory --list` | Affiche l'inventaire au format JSON |
| `ansible all -m ping` | Teste la connexion vers toutes les machines de l'inventaire |
| `ansible <groupe> -m ping` | Teste la connexion vers un groupe spécifique |
| `ssh-keygen -t ed25519` | Génère une paire de clés SSH Ed25519 |
| `ssh-copy-id utilisateur@ip` | Copie la clé publique sur un serveur distant |
| `multipass launch --name <nom>` | Crée une VM Ubuntu avec Multipass |
| `multipass info <nom>` | Affiche les informations d'une VM (dont l'IP) |
| `multipass list` | Liste toutes les VM Multipass |
| `multipass delete <nom> --purge` | Supprime définitivement une VM |

---

## Pièges Fréquents

### Piège 1 : Installer Ansible avec apt au lieu de pip

**Problème** : La commande `sudo apt install ansible` installe une version souvent ancienne d'Ansible. Par exemple, Ubuntu 22.04 fournit encore une version datée, alors que le paquet communautaire actuel (maintenu) est Ansible 14.x (ansible-core 2.21). Vérifié le 20 août 2026 : PyPI publie `ansible` 14.3.1 (`ansible-core~=2.21.3`). La table « Releases and maintenance » de docs.ansible.com peut rester en retard sur PyPI.

**Solution** : Installe toujours Ansible avec `pip install 'ansible>=14.0,<15.0'` dans un environnement virtuel Python, comme décrit dans les étapes 2 et 3.

```bash
# ❌ Ne pas faire
sudo apt install ansible

# ✅ Faire à la place
source ~/ansible-env/bin/activate
pip install 'ansible>=14.0,<15.0'
```

---

### Piège 2 : Oublier d'activer l'environnement virtuel

**Problème** : Tu ouvres un nouveau terminal et tu tapes `ansible --version`. Le terminal répond `command not found: ansible` ou utilise une ancienne version système.

**Cause** : L'environnement virtuel n'est pas actif. Ansible est installé dans `~/ansible-env`, pas dans le système.

**Solution** : Active l'environnement virtuel avant chaque session de travail.

```bash
# Active l'environnement virtuel
source ~/ansible-env/bin/activate

# Vérifie
which ansible
```

**Résultat attendu** :

```text
/home/utilisateur/ansible-env/bin/ansible
```

Si le chemin contient `ansible-env`, l'environnement est actif. Si le chemin est `/usr/bin/ansible`, tu utilises la version système.

---

### Piège 3 : Échec de la vérification de la clé SSH du serveur

**Problème** : Lors de la première connexion SSH à un serveur, tu obtiens ce message :

```text
The authenticity of host '10.110.48.53' can't be established.
ED25519 key fingerprint is SHA256:xxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Ansible ne peut pas répondre "yes" automatiquement et la commande échoue avec :

```text
UNREACHABLE! => {"msg": "Failed to connect to the host via ssh: Host key verification failed."}
```

**Solution** : Deux options :

1. **Option recommandée en test** : Ajoute `host_key_checking = False` dans ton `ansible.cfg` (déjà fait à l'étape 6)
2. **Option recommandée en production** : Connecte-toi manuellement une première fois en SSH pour accepter la clé, puis garde `host_key_checking = True`

```bash
# Se connecter manuellement pour accepter la clé (option production)
ssh ubuntu@10.110.48.53
# Tape "yes" quand le message apparaît, puis "exit" pour revenir
```

---

### Piège 4 : Python non installé sur le nœud géré

**Problème** : Le module `ping` échoue avec ce message :

```text
FAILED! => {"msg": "ansible requires a JSON module to be installed on the remote host"}
```

Ou :

```text
MODULE FAILURE
```

**Cause** : Python 3 n'est pas installé sur le nœud géré, ou Ansible ne le trouve pas.

**Solution** : Installe Python 3 sur le nœud géré.

```bash
# Se connecter à la VM et installer Python
multipass exec ansible-target -- sudo apt update
multipass exec ansible-target -- sudo apt install -y python3
```

Les VM Multipass Ubuntu incluent Python 3 par défaut. Ce piège est plus fréquent avec des images minimales ou des conteneurs Docker.

---

### Piège 5 : Mauvais utilisateur SSH dans ansible.cfg

**Problème** : Ansible échoue avec :

```text
UNREACHABLE! => {"msg": "Failed to connect to the host via ssh: Permission denied (publickey)."}
```

**Cause** : Le paramètre `remote_user` dans `ansible.cfg` ne correspond pas à un utilisateur existant sur le nœud géré, ou la clé SSH n'est pas configurée pour cet utilisateur.

**Solution** : Vérifie que l'utilisateur existe et que la clé SSH est dans son fichier `authorized_keys`.

```bash
# Vérifie l'utilisateur configuré dans ansible.cfg
cd ~/projets/ansible-lab && grep remote_user ansible.cfg
```

**Résultat attendu** :

```text
remote_user = ubuntu
```

Pour les VM Multipass, l'utilisateur par défaut est `ubuntu`. Pour d'autres types de VM, il peut être `root`, `vagrant`, ou un nom personnalisé.

```bash
# Vérifie que la clé est bien présente pour cet utilisateur sur la VM
multipass exec ansible-target -- cat /home/ubuntu/.ssh/authorized_keys
```

Tu dois voir ta clé publique dans la sortie.

---

## Checklist de Validation

- [ ] Python 3.12+ est installé (`python3 --version` affiche 3.12 ou supérieur)
- [ ] L'environnement virtuel est créé et activé (`which ansible` pointe vers `~/ansible-env/bin/ansible`)
- [ ] Ansible est installé et `ansible --version` affiche la version 14.x (core 2.21.x)
- [ ] Une VM de test est créée et en cours d'exécution (`multipass list` montre la VM en état "Running")
- [ ] Ma VM de test est accessible en SSH sans mot de passe (`ssh ubuntu@<IP>` se connecte sans demander de mot de passe)
- [ ] Mon fichier `ansible.cfg` est configuré dans `~/projets/ansible-lab/`
- [ ] Mon fichier `inventory.ini` contient l'adresse IP de ma VM
- [ ] `ansible all -m ping` retourne SUCCESS avec `"ping": "pong"`

---

## Exercice Pratique

**Énoncé** : Crée une deuxième VM de test, ajoute-la à ton inventaire dans un nouveau groupe, configure l'accès SSH, et vérifie que Ansible peut communiquer avec les deux VM.

**Indications** :

- Utilise `multipass launch --name ansible-target-2` pour créer la deuxième VM
- Récupère son adresse IP avec `multipass info ansible-target-2`
- Copie ta clé SSH publique sur cette nouvelle VM (même méthode qu'à l'étape 5)
- Ajoute un nouveau groupe `[web]` dans `inventory.ini` avec l'IP de cette deuxième VM
- Teste la connexion vers toutes les machines avec `ansible all -m ping`
- Teste la connexion vers un seul groupe avec `ansible test -m ping` et `ansible web -m ping`

**Résultat attendu** :

- `ansible all -m ping` retourne SUCCESS pour les deux machines
- `ansible test -m ping` retourne SUCCESS uniquement pour la première VM
- `ansible web -m ping` retourne SUCCESS uniquement pour la deuxième VM

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer la deuxième VM**

```bash
# Crée une deuxième VM
multipass launch --name ansible-target-2
```

Attends que la VM soit prête (1 à 3 minutes).

**Étape 2 : Récupérer l'adresse IP**

```bash
# Affiche les informations de la deuxième VM
multipass info ansible-target-2
```

Note l'adresse IP (par exemple `10.110.48.54`).

**Étape 3 : Configurer l'accès SSH**

```bash
# Copie la clé publique sur la deuxième VM
multipass transfer ~/.ssh/id_ed25519.pub ansible-target-2:/tmp/control_key.pub

# Ajoute la clé au fichier authorized_keys
multipass exec ansible-target-2 -- bash -c "cat /tmp/control_key.pub >> ~/.ssh/authorized_keys"

# Supprime le fichier temporaire
multipass exec ansible-target-2 -- rm /tmp/control_key.pub
```

**Étape 4 : Tester la connexion SSH**

```bash
# Teste la connexion SSH (remplace par l'IP réelle)
ssh ubuntu@10.110.48.54
```

La connexion doit fonctionner sans mot de passe. Tape `exit` pour revenir.

**Étape 5 : Modifier l'inventaire**

Ouvre le fichier `~/projets/ansible-lab/inventory.ini` et modifie-le :

```ini
[test]
# Première VM (remplace par l'IP réelle)
10.110.48.53

[web]
# Deuxième VM (remplace par l'IP réelle)
10.110.48.54
```

**Étape 6 : Vérifier l'inventaire**

```bash
# Vérifie que les deux groupes et les deux machines apparaissent
cd ~/projets/ansible-lab && ansible-inventory --list
```

**Résultat attendu** (simplifié) :

```text
{
    "all": {
        "children": [
            "ungrouped",
            "test",
            "web"
        ]
    },
    "test": {
        "hosts": [
            "10.110.48.53"
        ]
    },
    "web": {
        "hosts": [
            "10.110.48.54"
        ]
    }
}
```

**Étape 7 : Tester la connexion**

```bash
# Teste toutes les machines
cd ~/projets/ansible-lab && ansible all -m ping
```

**Résultat attendu** :

```text
10.110.48.53 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
10.110.48.54 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

Les deux machines répondent SUCCESS.

```bash
# Teste uniquement le groupe "test"
cd ~/projets/ansible-lab && ansible test -m ping
```

**Résultat attendu** : Seule la première VM (10.110.48.53) répond.

```bash
# Teste uniquement le groupe "web"
cd ~/projets/ansible-lab && ansible web -m ping
```

**Résultat attendu** : Seule la deuxième VM (10.110.48.54) répond.

---

## Navigation

← Fiche précédente : **[Introduction à Ansible](01-introduction-ansible.md)**

→ Fiche suivante : **[L'Inventaire Ansible](03-inventaire.md)**
