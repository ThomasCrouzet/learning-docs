---
tags:
  - Ansible
  - Débutant
  - Concept
description: "Introduction à Ansible"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 14
cursus: "Ansible"
id: "infrastructure.ansible.introduction-ansible"
course_id: "infrastructure.ansible"
content_type: "lesson"
order: 1
---

# 01 - Introduction à Ansible

> **En bref** : À la fin de cette fiche, tu sauras expliquer ce qu'est Ansible, pourquoi il est utilisé, et dans quels cas il est pertinent. Lecture estimée : 55 min.


## Prérequis

- Connaissances de base en administration Linux (navigation terminal, gestion de paquets, permissions)
- Connaissances SSH (connexion à une machine distante, clés SSH)
- Aucune connaissance préalable d'Ansible n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est Ansible, pourquoi il est utilisé, et dans quels cas il est pertinent.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'automatisation d'infrastructure ?

**Définition** : L'automatisation d'infrastructure consiste à utiliser du code pour configurer, déployer et gérer des serveurs et des services, au lieu d'exécuter manuellement des commandes une par une sur chaque machine.

**Le problème que l'automatisation d'infrastructure résout** :

Sans automatisation, voici les problèmes rencontrés :

1. **Lenteur** : Configurer un serveur manuellement prend du temps. Si tu as 10 serveurs à configurer de façon identique, tu dois répéter les mêmes commandes 10 fois.

2. **Erreurs humaines** : À chaque commande tapée manuellement, tu peux faire une faute de frappe, oublier une étape, ou appliquer une configuration différente d'un serveur à l'autre.

3. **Non-reproductibilité** : Si tu configures un serveur manuellement et qu'il tombe en panne 6 mois plus tard, tu dois te souvenir de toutes les étapes que tu avais suivies. Sans trace écrite, c'est souvent impossible.

4. **Pas de versioning** : Les commandes tapées dans un terminal ne sont pas enregistrées de façon structurée. Tu ne peux pas revenir à une configuration précédente ni voir qui a changé quoi.

**Comment l'automatisation d'infrastructure résout ces problèmes** :

| Problème             | Solution apportée par l'automatisation                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Lenteur              | Un script s'exécute en parallèle sur tous les serveurs. 10 serveurs prennent le même temps qu'1 |
| Erreurs humaines     | Le code est le même pour chaque serveur. Pas de variation humaine                               |
| Non-reproductibilité | Le code est un fichier texte. Tu peux le relancer à tout moment pour obtenir le même résultat   |
| Pas de versioning    | Les fichiers de configuration sont stockés dans Git, avec historique et traçabilité             |

**Analogie concrète** : Configurer un serveur manuellement, c'est comme cuisiner un plat de mémoire. Le résultat varie à chaque fois. Automatiser, c'est suivre une recette écrite : les ingrédients et les étapes sont toujours les mêmes, le résultat est identique, et tu peux transmettre la recette à quelqu'un d'autre.

---

### Qu'est-ce qu'Ansible ?

**Définition** : Ansible est un outil open-source d'automatisation IT, développé par Red Hat (filiale d'IBM). Il permet de gérer la configuration de serveurs, de déployer des applications et d'orchestrer des tâches sur des dizaines, des centaines ou des milliers de machines.

**Le problème qu'Ansible résout** :

Sans Ansible, voici les problèmes rencontrés :

1. **Répétition manuelle** : Tu dois te connecter en SSH à chaque serveur, un par un, pour installer des paquets, modifier des fichiers de configuration, redémarrer des services. Avec 50 serveurs, cela prend des heures.

2. **Incohérence entre serveurs** : Chaque serveur finit par avoir une configuration légèrement différente (un paquet oublié, une version différente, un fichier de config modifié à la main). On appelle ce phénomène le _configuration drift_.

3. **Documentation obsolète** : Les procédures d'installation sont rarement à jour. Le document PDF qui décrit l'installation date de 2 ans et ne correspond plus à la réalité.

4. **Dépendance à une personne** : Souvent, une seule personne connaît la configuration des serveurs. Si cette personne quitte l'équipe, la connaissance est perdue.

**Comment Ansible résout ces problèmes** :

| Problème                     | Solution apportée par Ansible                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| Répétition manuelle          | Un playbook Ansible s'exécute sur tous les serveurs en une seule commande                        |
| Incohérence entre serveurs   | Ansible applique la même configuration partout. La configuration est définie une seule fois       |
| Documentation obsolète       | Le playbook Ansible _est_ la documentation. Il décrit exactement ce qui est installé et configuré |
| Dépendance à une personne    | Le code Ansible est lisible et stocké dans Git. N'importe quel membre de l'équipe peut le lire   |

**Analogie concrète** : Ansible est une télécommande universelle pour tes serveurs. Au lieu de te déplacer vers chaque appareil (téléviseur, chaîne hi-fi, lecteur DVD) pour appuyer sur les boutons un par un, tu utilises une seule télécommande qui envoie les bonnes instructions à chaque appareil. Tu écris une fois la séquence d'actions, et la télécommande l'exécute sur tous les appareils simultanément.

**Ce qu'Ansible n'est PAS** :

- Ansible n'est pas un outil de conteneurisation comme Docker. Docker crée des environnements isolés pour exécuter des applications. Ansible configure des machines (physiques ou virtuelles) et y installe des logiciels. Les deux outils peuvent être complémentaires : tu peux utiliser Ansible pour installer Docker sur 50 serveurs.
- Ansible n'est pas un outil de monitoring comme Prometheus ou Grafana. Ansible ne surveille pas l'état de tes serveurs en temps réel. Il applique des configurations. Une fois l'exécution terminée, Ansible ne tourne plus.
- Ansible n'est pas un outil de CI/CD comme GitLab CI ou GitHub Actions. Un outil de CI/CD déclenche automatiquement des pipelines (tests, builds, déploiements) à chaque commit. Ansible peut être _appelé par_ un pipeline de CI/CD, mais il ne gère pas le pipeline lui-même.

---

### Qu'est-ce que l'architecture agentless ?

**Définition** : _Agentless_ (sans agent) signifie qu'Ansible ne nécessite aucune installation de logiciel sur les machines cibles. Ansible se connecte aux machines distantes via SSH, exécute les tâches, puis se déconnecte. Les machines cibles ont uniquement besoin d'un serveur SSH et de Python (qui est présent par défaut sur la plupart des distributions Linux).

**Le problème que l'architecture agentless résout** :

Sans architecture agentless (c'est-à-dire avec des agents), voici les problèmes rencontrés :

1. **Installation sur chaque machine** : Tu dois installer et configurer un logiciel agent sur chaque serveur cible. Avec 100 serveurs, c'est 100 installations à effectuer et à maintenir.

2. **Maintenance des agents** : Les agents doivent être mis à jour régulièrement. Si un agent plante, les tâches ne sont plus exécutées sur cette machine, et tu dois te connecter manuellement pour le réparer.

3. **Consommation de ressources** : Un agent tourne en permanence sur chaque machine, même quand aucune tâche n'est en cours. Il consomme de la mémoire et du processeur.

4. **Surface d'attaque** : Chaque agent est un programme qui écoute sur le réseau. C'est un point d'entrée potentiel pour un attaquant.

**Comment l'architecture agentless résout ces problèmes** :

| Problème                   | Solution agentless                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| Installation sur chaque machine | Rien à installer. SSH et Python suffisent (déjà présents sur la plupart des serveurs) |
| Maintenance des agents     | Pas d'agent à maintenir. Seul le nœud de contrôle Ansible doit être mis à jour           |
| Consommation de ressources | Pas de processus permanent. Les ressources ne sont utilisées que pendant l'exécution       |
| Surface d'attaque          | Pas de port supplémentaire ouvert. La connexion SSH existe déjà pour l'administration      |

**Analogie concrète** : L'approche avec agent, c'est comme installer une application sur le téléphone de chaque personne que tu veux contacter. L'approche agentless (Ansible), c'est comme envoyer des lettres par la poste (SSH). Le destinataire n'a besoin que d'une boîte aux lettres (SSH), qui est déjà là.

**Ce que l'architecture agentless n'est PAS** :

- Agentless ne signifie pas qu'il n'y a aucun prérequis sur les machines cibles. Python doit être installé (présent par défaut sur la quasi-totalité des distributions Linux). SSH doit être accessible.
- Agentless ne signifie pas moins performant. L'absence d'agent n'affecte pas la vitesse d'exécution des tâches.

**Comparaison agentless (Ansible) vs agent-based (Puppet, Chef)** :

| Critère                   | Agentless (Ansible)                              | Agent-based (Puppet, Chef)                            |
| ------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| Installation sur les cibles | Rien (SSH + Python suffisent)                  | Agent à installer et configurer                       |
| Connexion                 | SSH (déjà disponible)                            | Agent connecté en permanence au serveur central       |
| Consommation de ressources | Uniquement pendant l'exécution                  | Permanente (agent en arrière-plan)                    |
| Maintenance               | Seul le nœud de contrôle à maintenir            | Agent + serveur central à maintenir                   |
| Langage de configuration  | YAML (lisible sans formation)                    | DSL dédié (langage Puppet pour Puppet, Ruby pour Chef) |
| Courbe d'apprentissage    | Faible (YAML + SSH)                              | Moyenne à élevée (DSL + architecture client/serveur)  |

Le schéma suivant illustre l'architecture agentless push-based d'Ansible :

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-01-introduction-ansible-1.html">Qu&#x27;est-ce que l&#x27;architecture agentless ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-01-introduction-ansible-1.html" title="Qu&#x27;est-ce que l&#x27;architecture agentless ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

Le nœud de contrôle (ta machine) est le seul endroit où Ansible est installé. Il lit l'inventaire et le playbook, puis se connecte via SSH à chaque machine cible. Les machines cibles n'ont besoin d'aucun agent.

---

### Qu'est-ce que l'approche Push vs Pull ?

**Définition** : Push et Pull sont deux approches pour appliquer des configurations sur des machines distantes. En mode _push_, le nœud de contrôle envoie les configurations vers les machines cibles. En mode _pull_, les machines cibles vont chercher elles-mêmes leurs configurations sur un serveur central.

**Ansible utilise l'approche Push** : Tu lances une commande depuis ton poste de travail (le nœud de contrôle), et Ansible se connecte en SSH aux machines cibles pour y appliquer les configurations. Tu décides précisément quand l'exécution a lieu.

**Comparaison Push vs Pull** :

| Critère                | Push (Ansible)                                      | Pull (Puppet, Chef)                                         |
| ---------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| Qui initie l'action    | Le nœud de contrôle (toi)                          | Les machines cibles (automatiquement)                       |
| Moment d'exécution     | Quand tu lances la commande                         | À intervalles réguliers (ex : toutes les 30 min)            |
| Connexion              | Le nœud de contrôle se connecte aux cibles via SSH | Les cibles se connectent au serveur central via leur agent  |
| Nouvelle machine       | Ajouter l'IP dans l'inventaire suffit               | Installer l'agent et le configurer pour contacter le serveur |
| Serveur central requis | Non (juste un poste de travail)                     | Oui (Puppet Server, Chef Server)                            |

**Analogie concrète** : Le mode push, c'est comme distribuer le courrier. Le facteur (nœud de contrôle) se déplace jusqu'à chaque boîte aux lettres (machine cible) et y dépose le courrier au moment où il passe. Le mode pull, c'est comme aller chercher son colis au bureau de poste. Chaque destinataire (machine cible) doit se déplacer régulièrement au bureau de poste (serveur central) pour vérifier s'il a du courrier.

**Ce que le mode Push n'est PAS** :

- Le mode push ne signifie pas qu'Ansible ne peut pas être automatisé. Tu peux planifier l'exécution avec un cron job ou un outil de CI/CD.
- Le mode push ne signifie pas que les configurations ne sont appliquées qu'une seule fois. Tu peux relancer un playbook autant de fois que nécessaire.

---

### Qu'est-ce que l'idempotence ?

**Définition** : L'idempotence est la propriété d'une opération qui produit toujours le même résultat, quel que soit le nombre de fois où elle est exécutée. Si l'état souhaité est déjà atteint, Ansible ne fait rien. Si l'état n'est pas atteint, Ansible applique les changements nécessaires.

**Le problème que l'idempotence résout** :

Sans idempotence, voici les problèmes rencontrés :

1. **Scripts qui cassent s'ils sont relancés** : Un script bash qui ajoute une ligne dans un fichier de configuration ajoutera une ligne en double s'il est exécuté deux fois. Un script qui crée un utilisateur échouera s'il est relancé car l'utilisateur existe déjà.

2. **Peur de relancer** : Sans idempotence, tu hésites à relancer un script car tu ne sais pas si cela va casser quelque chose. Tu dois d'abord vérifier manuellement l'état actuel avant chaque exécution.

3. **Résultats imprévisibles** : Deux exécutions successives d'un même script peuvent produire des résultats différents selon l'état initial de la machine.

**Comment l'idempotence résout ces problèmes** :

| Problème                           | Solution apportée par l'idempotence                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------- |
| Scripts qui cassent si relancés    | Ansible vérifie l'état actuel avant d'agir. Si l'état est déjà correct, il ne fait rien |
| Peur de relancer                   | Tu peux relancer un playbook à tout moment sans risque de casser quoi que ce soit        |
| Résultats imprévisibles            | Le résultat final est toujours le même, quel que soit l'état initial de la machine       |

**Analogie concrète** : L'idempotence fonctionne comme un interrupteur de lumière positionné sur "ON". Que tu appuies 1 fois, 5 fois ou 100 fois sur la position "ON", le résultat est toujours le même : la lumière est allumée. Ansible ne dit pas "allume la lumière" (ce qui poserait problème si elle est déjà allumée). Ansible dit "la lumière doit être sur ON". Si elle est déjà sur ON, rien ne se passe. Si elle est sur OFF, Ansible la passe sur ON.

**Ce que l'idempotence n'est PAS** :

- L'idempotence ne signifie pas "ne rien faire". Si l'état actuel ne correspond pas à l'état souhaité, Ansible effectue les changements nécessaires. L'idempotence signifie que les changements ne sont appliqués _que si nécessaire_.
- L'idempotence ne signifie pas que toutes les commandes Ansible sont automatiquement idempotentes. Le module `shell` et le module `command` exécutent des commandes brutes sans vérifier l'état. C'est au rédacteur du playbook d'ajouter des conditions pour rendre ces tâches idempotentes.

**Exemple concret : script bash vs Ansible** :

Script bash (non idempotent) :

```bash
# Ajoute une ligne au fichier à CHAQUE exécution
echo "MaxSessions 10" >> /etc/ssh/sshd_config
```

Si tu exécutes ce script 3 fois, le fichier contiendra 3 lignes identiques `MaxSessions 10`. C'est un problème.

Tâche Ansible (idempotente) :

```yaml
# S'assure que la ligne est présente dans le fichier
# Si elle est déjà là, Ansible ne modifie rien
- name: Configurer le nombre maximum de sessions SSH
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    line: "MaxSessions 10"
    state: present
```

Si tu exécutes cette tâche 3 fois, le fichier contiendra une seule ligne `MaxSessions 10`. Ansible vérifie d'abord si la ligne existe, et ne l'ajoute que si elle est absente.

---

### Qu'est-ce que YAML ?

**Définition** : YAML (_YAML Ain't Markup Language_) est un format de sérialisation de données lisible par les humains. Ansible utilise YAML pour tous ses fichiers de configuration : playbooks, inventaires, variables, rôles.

**Le problème que YAML résout** :

Les autres formats de données (JSON, XML) sont verbeux et difficiles à lire pour un humain. JSON utilise des accolades, des crochets et des guillemets partout, et n'autorise pas les commentaires. XML double la quantité de texte avec ses balises ouvrantes et fermantes. YAML résout ce problème en utilisant l'indentation pour structurer les données, ce qui le rend lisible sans formation préalable.

**Règles de syntaxe de base de YAML** :

| Règle | Détail |
| ----- | ------ |
| Indentation | 2 espaces (jamais de tabulations) |
| Paires clé-valeur | `clé: valeur` (espace obligatoire après les deux-points) |
| Listes | Chaque élément commence par `-` (tiret suivi d'un espace) |
| Commentaires | Ligne commençant par `#` |
| Chaînes de caractères | Guillemets optionnels sauf si la valeur contient des caractères spéciaux (`:`, `#`, `{`, `}`) |
| Booléens | `true` / `false` (en minuscules) |
| Début de fichier | `---` (optionnel mais recommandé, indique le début d'un document YAML) |

**Exemple de fichier YAML** :

```yaml
---
# Informations sur un serveur
serveur:
  nom: "web-prod-01"
  ip: "192.168.1.10"
  port: 22
  actif: true
  roles:
    - nginx
    - php
    - postgresql
  ressources:
    cpu: 4
    ram_go: 16
    disque_go: 100
```

**Ce que YAML n'est PAS** :

- YAML n'est pas un langage de programmation. Tu ne peux pas écrire de boucles, de conditions ou de fonctions en YAML. YAML est un format de _données_, comme JSON ou XML. La logique de programmation est dans Ansible, pas dans YAML.
- YAML n'est pas spécifique à Ansible. De nombreux outils utilisent YAML : Docker Compose, Kubernetes, GitHub Actions, GitLab CI, Spring Boot.

---

### Cas d'usage d'Ansible

Ansible est utilisé pour cinq grandes catégories de tâches :

| Cas d'usage | Description | Exemple concret |
| ----------- | ----------- | --------------- |
| Provisionnement de serveurs | Configurer un serveur neuf pour qu'il soit prêt à l'emploi | Installer nginx, php, postgresql, créer les utilisateurs, configurer le pare-feu |
| Déploiement d'applications | Déployer une application sur un ou plusieurs serveurs | Récupérer le code depuis Git, installer les dépendances, appliquer les migrations |
| Gestion de configuration | Maintenir une configuration identique sur tous les serveurs | Distribuer le même fichier nginx.conf sur 20 serveurs web |
| Orchestration | Coordonner des actions sur plusieurs serveurs dans un ordre précis | Arrêter le serveur web, mettre à jour la BDD, puis redémarrer le web |
| Correctifs de sécurité | Appliquer des mises à jour de sécurité sur tout le parc | Mettre à jour un paquet vulnérable sur 200 serveurs en une commande |

---

## Étapes Pratiques

### Étape 1 : Vérifier les prérequis sur ta machine

Ansible nécessite Python 3 et SSH sur le nœud de contrôle (ta machine). Vérifie que ces deux outils sont installés.

**Vérifier la version de Python** :

```bash
# Affiche la version de Python 3 installée
python3 --version
```

**Résultat attendu** :

```text
Python 3.12.x
```

Le numéro de version peut être différent. Sur le nœud de contrôle, ansible-core 2.21 exige Python 3.12 ou supérieur. Si tu obtiens `command not found`, installe Python 3.12+ avec le gestionnaire de paquets de ta distribution. Les nœuds gérés peuvent rester sur Python 3.9 à 3.14.

**Vérifier la version de SSH** :

```bash
# Affiche la version du client SSH installé
ssh -V
```

**Résultat attendu** :

```text
OpenSSH_9.6p1 Ubuntu-3ubuntu13, OpenSSL 3.0.13 30 Jan 2024
```

Le numéro de version peut être différent. L'important est que la commande s'exécute sans erreur.

---

### Étape 2 : Découvrir un fichier YAML

Dans cette étape, tu vas créer un fichier YAML pour t'entraîner avec la syntaxe. Ce fichier n'est pas un fichier Ansible. Il sert uniquement à pratiquer la syntaxe YAML.

Crée un fichier nommé `infrastructure.yaml` :

```bash
# Crée un répertoire de travail pour les exercices Ansible
mkdir -p ~/ansible-exercices

# Crée le fichier YAML
touch ~/ansible-exercices/infrastructure.yaml
```

Ouvre le fichier `infrastructure.yaml` dans ton éditeur de texte et copie ce contenu :

```yaml
---
# Description de l'infrastructure d'un projet web
projet:
  nom: "mon-application-web"
  environnement: "production"

serveurs_web:
  - nom: "web-01"
    ip: "192.168.1.10"
    systeme: "debian-12"
    services:
      - nginx
      - php-fpm
    ports_ouverts:
      - 80
      - 443

  - nom: "web-02"
    ip: "192.168.1.11"
    systeme: "debian-12"
    services:
      - nginx
      - php-fpm
    ports_ouverts:
      - 80
      - 443

serveur_bdd:
  nom: "db-01"
  ip: "192.168.1.20"
  systeme: "debian-12"
  moteur: "postgresql"
  version: 16
  port: 5432
  sauvegarde_quotidienne: true
```

**Vérifier la syntaxe du fichier** :

Tu peux vérifier que ton fichier YAML est syntaxiquement correct avec Python :

```bash
# Vérifie que le fichier YAML est valide
python3 -c "import yaml; yaml.safe_load(open('$HOME/ansible-exercices/infrastructure.yaml'))" && echo "YAML valide"
```

**Résultat attendu** :

```text
YAML valide
```

Si tu obtiens une erreur, vérifie l'indentation de ton fichier. Les erreurs YAML les plus fréquentes sont liées à l'indentation (voir la section "Pièges Fréquents").

---

### Étape 3 : Comprendre le flux de travail Ansible

Avant d'installer Ansible (ce sera l'objet de la fiche suivante), il est important de comprendre comment il fonctionne. Voici le flux de travail complet :

```text
1. Écrire le playbook (YAML)
            |
            v
2. Définir l'inventaire (liste des machines cibles)
            |
            v
3. Lancer la commande : ansible-playbook
            |
            v
4. Ansible se connecte via SSH ---> Machine cible 1 (web-01)
   (noeud de contrôle)         ---> Machine cible 2 (web-02)
                               ---> Machine cible 3 (db-01)
            |
            v
5. Ansible affiche le résultat : ok / changed / failed
```

**Explication de chaque étape** :

1. **Écrire le playbook** : Tu crées un fichier YAML qui décrit l'état souhaité de tes machines (paquets installés, fichiers de configuration, services démarrés).
2. **Définir l'inventaire** : Tu listes les adresses IP de tes machines cibles, organisées par groupes (serveurs web, bases de données).
3. **Lancer la commande** : Tu exécutes `ansible-playbook` depuis ton nœud de contrôle. C'est la seule machine où Ansible doit être installé.
4. **Ansible se connecte via SSH** : Ansible ouvre une connexion SSH vers chaque machine cible, sans nécessiter d'agent.
5. **Ansible affiche le résultat** : Pour chaque tâche, Ansible indique **ok** (rien modifié), **changed** (modification appliquée) ou **failed** (erreur).

---

## Commandes Utiles

Ces commandes seront détaillées dans les fiches suivantes. Ce tableau est un aperçu pour te familiariser avec les noms.

| Commande | Action |
| -------- | ------ |
| `ansible --version` | Affiche la version d'Ansible installée |
| `ansible --help` | Affiche l'aide générale d'Ansible |
| `ansible all -m ping` | Teste la connexion SSH vers toutes les machines de l'inventaire |
| `ansible-playbook playbook.yaml` | Exécute un playbook sur les machines de l'inventaire |
| `ansible-playbook playbook.yaml --check` | Simule l'exécution sans appliquer de changements (mode dry-run) |
| `ansible-inventory --list` | Affiche l'inventaire au format JSON |
| `ansible-doc <module>` | Affiche la documentation d'un module Ansible |

---

## Pièges Fréquents

### Piège 1 : Confondre Ansible et Docker

**Problème** : Tu penses qu'Ansible remplace Docker ou qu'ils font la même chose.

**Explication** : Ansible et Docker résolvent des problèmes différents :

| Ansible | Docker |
| ------- | ------ |
| Configure des machines existantes | Crée des environnements isolés (conteneurs) |
| Installe des paquets, modifie des fichiers, gère des services | Empaquette une application avec ses dépendances |
| Agit sur des machines physiques ou virtuelles | Crée des conteneurs légers et éphémères |
| S'exécute ponctuellement | Les conteneurs tournent en permanence |

**Solution** : Retiens cette distinction : Ansible _configure des machines_, Docker _empaquette des applications_. Les deux outils sont souvent utilisés ensemble (Ansible installe Docker sur les serveurs, puis déploie les conteneurs).

---

### Piège 2 : Penser qu'Ansible doit être installé sur les machines cibles

**Problème** : Tu essaies d'installer Ansible sur chaque serveur que tu veux configurer.

**Explication** : Ansible est agentless. Il doit être installé uniquement sur le nœud de contrôle (ta machine de travail). Les machines cibles ont besoin uniquement de :

- Un serveur SSH accessible
- Python 3 installé (présent par défaut sur la plupart des distributions Linux)

**Solution** : Installe Ansible sur ta machine uniquement. Vérifie que tu peux te connecter en SSH aux machines cibles. C'est tout.

---

### Piège 3 : Erreurs d'indentation YAML (tabulations vs espaces)

**Problème** : Ton fichier YAML provoque une erreur de syntaxe alors que le contenu semble correct visuellement.

**Explication** : YAML interdit les tabulations. Seuls les espaces sont autorisés pour l'indentation. Les tabulations et les espaces sont visuellement identiques dans la plupart des éditeurs de texte, mais YAML les distingue.

**Solution** : Configure ton éditeur de texte pour utiliser des espaces au lieu des tabulations :

- **VS Code** : Vérifie en bas à droite de la fenêtre que l'indication affiche `Spaces: 2` et non `Tab Size: 2`. Si c'est "Tab", clique dessus et sélectionne "Indent Using Spaces" puis "2".

Exemple d'erreur causée par une tabulation :

```yaml
# Erreur : la deuxième ligne utilise une tabulation (invisible)
serveur:
    nom: "web-01"
```

Dans cet exemple, l'indentation utilise une tabulation au lieu d'espaces. Visuellement identique, mais YAML refuse les tabulations.

```text
yaml.scanner.ScannerError: while scanning for the next token
found character '\t' that cannot start any token
```

Correction :

```yaml
# Correct : la deuxième ligne utilise 2 espaces
serveur:
  nom: "web-01"
```

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est Ansible en une phrase (outil d'automatisation agentless qui configure des machines via SSH)
- [ ] Je comprends la différence entre push (Ansible envoie) et pull (les cibles vont chercher)
- [ ] Je sais ce que signifie "agentless" (rien à installer sur les machines cibles)
- [ ] Je sais ce que signifie "idempotent" (exécuter plusieurs fois produit toujours le même résultat)
- [ ] Je connais la syntaxe de base de YAML (indentation 2 espaces, clé: valeur, listes avec -)
- [ ] Je sais vérifier que Python 3 et SSH sont installés sur ma machine

---

## Exercice Pratique

**Énoncé** : Écris un fichier YAML nommé `parc-informatique.yaml` qui décrit un parc informatique composé de 3 serveurs. Ce fichier n'est pas un fichier Ansible. C'est un exercice de pratique de la syntaxe YAML.

**Spécifications** :

Le fichier doit contenir les informations suivantes :

- Un objet `parc` avec un `nom` ("production") et une `date_inventaire` ("2025-01-15")
- Un groupe `serveurs_web` contenant 2 serveurs :
  - Chaque serveur a un `nom`, une `ip`, un `systeme` ("debian-12"), une liste de `paquets` installés (nginx, php8.3-fpm, php8.3-pgsql), et un booléen `actif`
  - Le premier serveur : nom "web-01", ip "10.0.1.10", actif true
  - Le deuxième serveur : nom "web-02", ip "10.0.1.11", actif true
- Un groupe `serveur_bdd` (un seul serveur) :
  - Nom "db-01", ip "10.0.1.20", système "debian-12", moteur "postgresql", version 16, port 5432, `max_connections` 100, actif true

**Indications** :

- Le fichier doit commencer par `---`
- Utilise 2 espaces pour l'indentation (jamais de tabulations)
- Les listes utilisent `-` (tiret + espace)
- Vérifie la syntaxe avec la commande Python de l'étape 2

**Résultat attendu** :

- Le fichier est syntaxiquement valide (la commande Python affiche "YAML valide")
- Le fichier contient les 3 serveurs avec toutes les propriétés demandées
- L'indentation est correcte et cohérente (2 espaces)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```yaml
---
# Description du parc informatique de production
parc:
  nom: "production"
  date_inventaire: "2025-01-15"

serveurs_web:
  - nom: "web-01"
    ip: "10.0.1.10"
    systeme: "debian-12"
    paquets:
      - nginx
      - php8.3-fpm
      - php8.3-pgsql
    actif: true

  - nom: "web-02"
    ip: "10.0.1.11"
    systeme: "debian-12"
    paquets:
      - nginx
      - php8.3-fpm
      - php8.3-pgsql
    actif: true

serveur_bdd:
  nom: "db-01"
  ip: "10.0.1.20"
  systeme: "debian-12"
  moteur: "postgresql"
  version: 16
  port: 5432
  max_connections: 100
  actif: true
```

**Vérification** :

```bash
# Vérifie que le fichier est valide
python3 -c "import yaml; yaml.safe_load(open('$HOME/ansible-exercices/parc-informatique.yaml'))" && echo "YAML valide"
```

**Résultat attendu** :

```text
YAML valide
```

---

## Navigation

→ Fiche suivante : **[Installation et Configuration](02-installation-configuration.md)**
