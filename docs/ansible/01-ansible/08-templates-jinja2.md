---
tags:
  - Ansible
  - Avancé
  - Pratique
description: "Templates Jinja2"
estimated_time: "105 min"
fiche_number: 8
total_fiches: 14
cursus: "Ansible"
id: "infrastructure.ansible.templates-jinja2"
course_id: "infrastructure.ansible"
content_type: "lesson"
order: 8
---

# 08 - Templates Jinja2

> **En bref** : À la fin de cette fiche, tu sauras créer des fichiers de configuration dynamiques avec le système de templates Jinja2 d'Ansible. Lecture estimée : 105 min.


## Prérequis

- Fiches [01 - Introduction à Ansible](01-introduction-ansible.md) à [07 - Conditions et Boucles](07-conditions-boucles.md) de ce cursus (lues et pratiquées)
- Savoir écrire un playbook avec des variables et des tâches
- Savoir utiliser le module `ansible.builtin.copy` pour copier des fichiers

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des fichiers de configuration dynamiques avec le système de templates Jinja2 d'Ansible.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un template ?

**Définition** : Un template est un fichier modèle qui contient des emplacements réservés (placeholders). Ansible remplit ces emplacements avec des valeurs réelles au moment du déploiement.

**Le problème que les templates résolvent** :

Sans templates, voici les problèmes rencontrés :

1. **Fichiers de configuration différents par serveur** : Un serveur web en production écoute sur le port 443 avec SSL, un serveur de staging écoute sur le port 80 sans SSL. Le fichier de configuration est presque identique, seuls quelques paramètres changent.

2. **Duplication de fichiers** : Sans template, tu dois maintenir un fichier de configuration par serveur. Si tu as 10 serveurs, tu as 10 fichiers quasi identiques. Modifier une ligne commune oblige à modifier les 10 fichiers.

3. **Erreurs humaines** : Copier-coller un fichier et modifier manuellement les valeurs génère des erreurs. Un port oublié, un chemin incorrect, une faute de frappe.

4. **Informations dynamiques impossibles** : Certaines valeurs dépendent du serveur lui-même (son hostname, son adresse IP). Ces valeurs ne peuvent pas être écrites à l'avance dans un fichier statique.

**Comment les templates résolvent ces problèmes** :

| Problème | Solution apportée par les templates |
| --- | --- |
| Fichiers différents par serveur | Un seul fichier template + des variables par serveur |
| Duplication de fichiers | Un seul template remplace tous les fichiers dupliqués |
| Erreurs humaines | Les variables sont injectées automatiquement par Ansible |
| Informations dynamiques | Le template accède aux facts Ansible (hostname, IP, OS) |

**Analogie concrète** : Un template fonctionne comme un formulaire pré-imprimé. Le formulaire contient le texte fixe (les questions, les cadres, les instructions) et des espaces vides à remplir (nom : ..., adresse : ..., téléphone : ...). Chaque personne qui remplit le formulaire obtient un document différent, mais la structure est toujours la même. Le template Jinja2 est le formulaire vide, les variables Ansible sont les réponses, et le fichier généré est le formulaire rempli.

**Ce qu'un template n'est PAS** :

- Un template n'est pas un fichier de configuration final. C'est un modèle qui doit être traité par Ansible avant de devenir un fichier utilisable. Tu ne peux pas copier un fichier `.j2` directement sur un serveur et l'utiliser tel quel.
- Un template n'est pas la même chose que le module `copy`. Le module `copy` envoie un fichier statique tel quel, sans aucun traitement. Le module `template` lit le fichier, remplace les variables par leurs valeurs, puis envoie le résultat.

**Comparaison module template vs module copy** :

| Module `template` | Module `copy` |
| --- | --- |
| Traite la syntaxe Jinja2 | Envoie le fichier tel quel |
| Les variables `{{ }}` sont remplacées par leurs valeurs | Les variables `{{ }}` restent telles quelles dans le fichier |
| Le fichier source a l'extension `.j2` (convention) | Le fichier source a son extension normale |
| Utilise le paramètre `src` pour un fichier local | Utilise `src` pour un fichier local ou `content` pour du texte |
| Accès aux facts Ansible dans le template | Pas d'accès aux facts |

---

### Qu'est-ce que la syntaxe Jinja2 ?

**Définition** : Jinja2 est un moteur de templates pour Python. Ansible utilise Jinja2 pour traiter les fichiers templates. La syntaxe Jinja2 définit comment écrire les emplacements réservés, les conditions et les boucles dans un template.

**Le problème que la syntaxe Jinja2 résout** :

Sans syntaxe de template, voici les problèmes rencontrés :

1. **Pas de moyen d'insérer des variables** : Comment indiquer dans un fichier texte qu'un mot doit être remplacé par une valeur ?
2. **Pas de logique conditionnelle** : Comment inclure un bloc de configuration uniquement si SSL est activé ?
3. **Pas de répétition automatique** : Comment générer une liste de serveurs sans écrire chaque ligne manuellement ?

**Comment la syntaxe Jinja2 résout ces problèmes** :

| Problème | Syntaxe Jinja2 | Exemple |
| --- | --- | --- |
| Insérer une variable | `{{ variable }}` | `{{ server_name }}` |
| Bloc conditionnel | `{% if %}...{% endif %}` | `{% if enable_ssl %}...{% endif %}` |
| Répétition (boucle) | `{% for %}...{% endfor %}` | `{% for host in servers %}...{% endfor %}` |
| Commentaire | `{# texte #}` | `{# Ce commentaire n'apparaît pas dans le fichier final #}` |

**Les quatre types de délimiteurs Jinja2** :

1. **`{{ expression }}`** : Affiche la valeur d'une expression. Tout ce qui se trouve entre `{{` et `}}` est évalué et remplacé par le résultat dans le fichier final.

   ```jinja2
   # Dans le template
   server_name {{ domain_name }};

   # Résultat si domain_name = "example.com"
   server_name example.com;
   ```

2. **`{% instruction %}`** : Exécute une instruction (condition, boucle, affectation). Ces balises ne produisent pas de texte directement. Elles contrôlent la logique du template.

   ```jinja2
   {% if enable_logging %}
   error_log /var/log/app.log;
   {% endif %}
   ```

3. **`{# commentaire #}`** : Insère un commentaire. Le texte entre `{#` et `#}` est ignoré. Il n'apparaît pas dans le fichier final. Utile pour documenter le template.

   ```jinja2
   {# Cette section configure le SSL si activé #}
   {% if enable_ssl %}
   listen 443 ssl;
   {% endif %}
   ```

4. **`{{ expression | filtre }}`** : Applique un filtre à une expression. Les filtres transforment la valeur avant de l'afficher (expliqué en détail dans la section suivante).

**Analogie concrète** : La syntaxe Jinja2 fonctionne comme les champs de fusion dans un publipostage. Quand tu crées une lettre type dans un traitement de texte, tu insères des champs comme `<<Nom>>` et `<<Adresse>>`. Le logiciel remplace ces champs par les données de chaque destinataire. Jinja2 fait la même chose : `{{ nom }}` est remplacé par la valeur réelle.

**Convention de nommage des fichiers** :

Les fichiers templates Jinja2 portent l'extension `.j2` ajoutée après l'extension normale du fichier :

| Fichier final | Fichier template |
| --- | --- |
| `nginx.conf` | `nginx.conf.j2` |
| `index.html` | `index.html.j2` |
| `my.cnf` | `my.cnf.j2` |
| `application.properties` | `application.properties.j2` |

Cette convention n'est pas obligatoire (Ansible traite le fichier comme un template quelle que soit l'extension), mais elle est fortement recommandée. Elle permet d'identifier immédiatement quels fichiers sont des templates et quels fichiers sont statiques.

---

### Qu'est-ce qu'un filtre Jinja2 ?

**Définition** : Un filtre Jinja2 est une fonction qui transforme la valeur d'une variable avant de l'afficher. Un filtre se place après le symbole pipe `|`.

**Le problème que les filtres résolvent** :

Sans filtres, voici les problèmes rencontrés :

1. **Valeurs non définies** : Si une variable n'existe pas, Ansible échoue avec une erreur. Il faut un moyen de fournir une valeur par défaut.
2. **Format incorrect** : Une variable contient `Mon Serveur` mais le fichier de configuration attend `mon_serveur`. Il faut transformer la valeur.
3. **Manipulation de listes** : Une variable contient une liste `["8.8.8.8", "1.1.1.1"]` mais le fichier de configuration attend chaque élément sur une ligne séparée.

**Comment les filtres résolvent ces problèmes** :

| Problème | Filtre | Exemple |
| --- | --- | --- |
| Variable non définie | `default` | `{{ max_conn \| default(100) }}` |
| Mauvaise casse | `lower`, `upper` | `{{ name \| lower }}` |
| Transformation de liste | `join` | `{{ dns \| join(', ') }}` |

**Syntaxe des filtres** :

```jinja2
# Syntaxe de base : variable | filtre
{{ variable | filtre }}

# Filtre avec argument : variable | filtre(argument)
{{ variable | default(256) }}

# Chaîne de filtres : les filtres s'appliquent de gauche à droite
{{ variable | lower | replace(" ", "-") }}
# Étape 1 : lower transforme "Mon Serveur" en "mon serveur"
# Étape 2 : replace transforme "mon serveur" en "mon-serveur"
```

**Liste des filtres les plus utilisés avec Ansible** :

| Filtre | Rôle | Entrée | Sortie |
| --- | --- | --- | --- |
| `default(valeur)` | Fournit une valeur par défaut si la variable n'est pas définie | `{{ port \| default(80) }}` | `80` (si port non défini) |
| `upper` | Met en majuscules | `{{ "hello" \| upper }}` | `HELLO` |
| `lower` | Met en minuscules | `{{ "HELLO" \| lower }}` | `hello` |
| `capitalize` | Met la première lettre en majuscule | `{{ "hello world" \| capitalize }}` | `Hello world` |
| `replace(ancien, nouveau)` | Remplace une sous-chaîne | `{{ "foo bar" \| replace(" ", "_") }}` | `foo_bar` |
| `join(séparateur)` | Transforme une liste en chaîne | `{{ ["a", "b"] \| join(", ") }}` | `a, b` |
| `int` | Convertit en nombre entier | `{{ "42" \| int }}` | `42` |
| `float` | Convertit en nombre décimal | `{{ "3.14" \| float }}` | `3.14` |
| `length` | Renvoie la longueur (liste ou chaîne) | `{{ [1, 2, 3] \| length }}` | `3` |
| `unique` | Supprime les doublons d'une liste | `{{ [1, 2, 2, 3] \| unique }}` | `[1, 2, 3]` |
| `sort` | Trie une liste | `{{ [3, 1, 2] \| sort }}` | `[1, 2, 3]` |
| `trim` | Supprime les espaces en début et fin | `{{ " hello " \| trim }}` | `hello` |
| `regex_replace(motif, remplacement)` | Remplacement par expression régulière | `{{ "abc123" \| regex_replace("[0-9]+", "") }}` | `abc` |
| `to_yaml` | Convertit en YAML | `{{ ma_liste \| to_yaml }}` | sortie YAML |
| `to_json` | Convertit en JSON | `{{ mon_dict \| to_json }}` | sortie JSON |
| `bool` | Convertit en booléen | `{{ "true" \| bool }}` | `True` |

**Analogie concrète** : Un filtre fonctionne comme un outil de transformation sur une chaîne de montage. La pièce brute (la variable) entre dans l'outil (le filtre), et une pièce transformée sort de l'autre côté. Tu peux enchaîner plusieurs outils : la pièce passe d'un outil au suivant, chaque outil ajoutant sa transformation.

---

## Étapes Pratiques

### Étape 1 : Créer la structure de répertoires

Avant de créer un template, il faut préparer la structure de fichiers. Ansible cherche les templates dans un dossier `templates/` situé au même niveau que le playbook.

Crée cette structure :

```bash
# Crée le dossier du projet
mkdir -p ~/ansible-templates/templates

# Vérifie la structure
tree ~/ansible-templates
```

**Résultat attendu** :

```text
/home/loic/ansible-templates
└── templates
```

---

### Étape 2 : Créer un template simple

Crée un premier template HTML. Ce template utilise des variables Ansible et des facts (informations collectées automatiquement sur le serveur cible).

Crée le fichier `~/ansible-templates/templates/index.html.j2` :

```jinja2
<!DOCTYPE html>
<html>
<head>
    <title>{{ app_name }}</title>
</head>
<body>
    <h1>Bienvenue sur {{ app_name }}</h1>

    <h2>Informations du serveur</h2>
    <ul>
        {# ansible_facts contient les informations collectées sur le serveur cible #}
        <li>Hostname : {{ ansible_facts['hostname'] }}</li>
        <li>Adresse IP : {{ ansible_facts['default_ipv4']['address'] }}</li>
        <li>Système : {{ ansible_facts['distribution'] }} {{ ansible_facts['distribution_version'] }}</li>
        <li>Mémoire totale : {{ ansible_facts['memtotal_mb'] }} Mo</li>
    </ul>

    {# La variable deployment_date est définie dans le playbook #}
    <p>Dernière mise à jour : {{ deployment_date }}</p>
</body>
</html>
```

**Explication ligne par ligne** :

- `{{ app_name }}` : Sera remplacé par la valeur de la variable `app_name` définie dans le playbook
- `{{ ansible_facts['hostname'] }}` : Sera remplacé par le nom d'hôte réel du serveur cible
- `{{ ansible_facts['default_ipv4']['address'] }}` : Sera remplacé par l'adresse IPv4 du serveur
- `{# commentaire #}` : Ces lignes n'apparaîtront pas dans le fichier HTML final

---

### Étape 3 : Utiliser le template dans un playbook

Crée le fichier `~/ansible-templates/deploy-page.yml` :

```yaml
---
# Playbook qui déploie une page d'accueil personnalisée
- name: Déployer la page d'accueil
  hosts: webservers
  become: true

  vars:
    # Variables utilisées dans le template index.html.j2
    app_name: "Mon Application"
    deployment_date: "2025-01-15"

  tasks:
    # Le module template lit le fichier .j2, remplace les variables,
    # et envoie le résultat sur le serveur cible
    - name: Générer et déployer index.html
      ansible.builtin.template:
        src: templates/index.html.j2       # Chemin vers le template (relatif au playbook)
        dest: /var/www/html/index.html     # Chemin de destination sur le serveur cible
        owner: www-data                    # Propriétaire du fichier
        group: www-data                    # Groupe du fichier
        mode: '0644'                       # Permissions : lecture pour tous, écriture pour le propriétaire
```

**Exécution** :

```bash
# Exécute le playbook
ansible-playbook -i inventory.ini deploy-page.yml
```

**Résultat attendu** :

```text
PLAY [Déployer la page d'accueil] **********************************************

TASK [Gathering Facts] *********************************************************
ok: [web1]

TASK [Générer et déployer index.html] ******************************************
changed: [web1]

PLAY RECAP *********************************************************************
web1                       : ok=2    changed=1    unreachable=0    failed=0
```

**Ce qui s'est passé** :

1. Ansible a collecté les facts du serveur `web1` (hostname, IP, OS)
2. Ansible a lu le template `index.html.j2`
3. Ansible a remplacé `{{ app_name }}` par `Mon Application`
4. Ansible a remplacé `{{ ansible_facts['hostname'] }}` par le vrai hostname du serveur
5. Ansible a remplacé les autres variables de la même façon
6. Ansible a envoyé le fichier HTML final sur le serveur à l'emplacement `/var/www/html/index.html`

---

### Étape 4 : Créer un template avec des conditions

Les conditions `{% if %}` permettent d'inclure ou d'exclure des blocs entiers de configuration selon la valeur d'une variable.

Crée le fichier `~/ansible-templates/templates/nginx-vhost.conf.j2` :

```jinja2
{# Template de configuration Nginx pour un virtual host #}
server {
    listen {{ http_port | default(80) }};
    server_name {{ server_name }};

{% if enable_ssl | default(false) %}
    # Redirection HTTP vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name {{ server_name }};

    # Certificats SSL
    ssl_certificate {{ ssl_cert_path }};
    ssl_certificate_key {{ ssl_key_path }};

    # Paramètres SSL recommandés
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
{% endif %}

    root {{ document_root | default('/var/www/html') }};
    index index.html index.htm;

{% if enable_logging | default(true) %}
    access_log /var/log/nginx/{{ server_name }}_access.log;
    error_log /var/log/nginx/{{ server_name }}_error.log;
{% endif %}

    location / {
        try_files $uri $uri/ =404;
    }

{% if enable_php | default(false) %}
    # Traitement des fichiers PHP via PHP-FPM
    location ~ \.php$ {
        fastcgi_pass {{ php_fpm_socket | default('unix:/run/php/php-fpm.sock') }};
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
{% endif %}
}
```

**Explication des conditions** :

- `{% if enable_ssl | default(false) %}` : Ce bloc est inclus uniquement si la variable `enable_ssl` vaut `true`. Si la variable n'est pas définie, le filtre `default(false)` lui donne la valeur `false`, donc le bloc est exclu.
- `{% if enable_logging | default(true) %}` : Ce bloc est inclus par défaut (valeur `true`). Il est exclu uniquement si tu définis `enable_logging: false`.
- `{% if enable_php | default(false) %}` : Le bloc PHP-FPM est exclu par défaut. Il faut définir `enable_php: true` pour l'inclure.
- `{% endif %}` : Chaque `{% if %}` doit avoir son `{% endif %}` correspondant. Oublier un `{% endif %}` provoque une erreur de syntaxe.

---

### Étape 5 : Créer un template avec des boucles

Les boucles `{% for %}` permettent de générer du contenu répétitif à partir d'une liste ou d'un dictionnaire.

Crée le fichier `~/ansible-templates/templates/nginx-upstream.conf.j2` :

```jinja2
{# Génère un bloc upstream avec une liste de serveurs backend #}
upstream {{ upstream_name }} {
{% for server in backend_servers %}
    server {{ server.address }}:{{ server.port }} weight={{ server.weight | default(1) }};
{% endfor %}
}

{# Génère les virtual hosts à partir d'une liste #}
{% for vhost in virtual_hosts %}
server {
    listen {{ vhost.port | default(80) }};
    server_name {{ vhost.name }};
    root {{ vhost.root }};

{% if vhost.aliases is defined %}
    # Alias de noms de domaine
{% for alias in vhost.aliases %}
    server_name {{ alias }};
{% endfor %}
{% endif %}
}

{% endfor %}
```

Crée le playbook `~/ansible-templates/deploy-nginx-upstream.yml` :

```yaml
---
- name: Configurer Nginx avec upstream et virtual hosts
  hosts: webservers
  become: true

  vars:
    upstream_name: "app_backend"

    # Liste de serveurs backend pour le load balancing
    backend_servers:
      - address: "192.168.1.10"
        port: 8080
        weight: 3
      - address: "192.168.1.11"
        port: 8080
        weight: 2
      - address: "192.168.1.12"
        port: 8080
        # weight non défini : le filtre default(1) sera utilisé

    # Liste de virtual hosts
    virtual_hosts:
      - name: "www.example.com"
        port: 80
        root: "/var/www/example"
        aliases:
          - "example.com"
          - "web.example.com"
      - name: "api.example.com"
        port: 8080
        root: "/var/www/api"

  tasks:
    - name: Déployer la configuration upstream Nginx
      ansible.builtin.template:
        src: templates/nginx-upstream.conf.j2
        dest: /etc/nginx/conf.d/upstream.conf
        owner: root
        group: root
        mode: '0644'
```

**Résultat généré** (fichier final sur le serveur) :

```text
upstream app_backend {
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=2;
    server 192.168.1.12:8080 weight=1;
}

server {
    listen 80;
    server_name www.example.com;
    root /var/www/example;

    # Alias de noms de domaine
    server_name example.com;
    server_name web.example.com;
}

server {
    listen 8080;
    server_name api.example.com;
    root /var/www/api;

}
```

**Explication des boucles** :

- `{% for server in backend_servers %}` : Ansible parcourt chaque élément de la liste `backend_servers`. À chaque itération, la variable `server` contient un élément de la liste (un dictionnaire avec `address`, `port`, `weight`).
- `{% for vhost in virtual_hosts %}` : Même principe avec la liste `virtual_hosts`.
- `{% for alias in vhost.aliases %}` : Boucle imbriquée dans la boucle des vhosts. Elle parcourt la liste `aliases` de chaque vhost.
- `{% if vhost.aliases is defined %}` : Vérifie que la clé `aliases` existe avant de boucler dessus. Sans cette vérification, Ansible échoue si `aliases` n'est pas défini pour un vhost.

**Variables spéciales disponibles dans les boucles** :

| Variable | Description | Exemple |
| --- | --- | --- |
| `loop.index` | Numéro de l'itération (commence à 1) | 1, 2, 3 |
| `loop.index0` | Numéro de l'itération (commence à 0) | 0, 1, 2 |
| `loop.first` | `true` si c'est la première itération | `true` ou `false` |
| `loop.last` | `true` si c'est la dernière itération | `true` ou `false` |
| `loop.length` | Nombre total d'éléments | 3 |

**Exemple d'utilisation des variables de boucle** :

```jinja2
{% for server in backend_servers %}
# Serveur {{ loop.index }} sur {{ loop.length }}
server {{ server.address }}:{{ server.port }};
{% if not loop.last %}

{% endif %}
{% endfor %}
```

---

### Étape 6 : Utiliser les filtres dans un template réaliste

Crée le fichier `~/ansible-templates/templates/app-config.conf.j2` :

```jinja2
{# Configuration de l'application - généré par Ansible #}
{# Ne pas modifier manuellement ce fichier #}

# Informations générales
APP_NAME={{ app_name | upper }}
APP_ENV={{ app_env | default('production') }}
APP_DEBUG={{ app_debug | default(false) | lower }}
APP_PORT={{ app_port | default(8080) | int }}

# Base de données
DB_HOST={{ db_host | default('localhost') }}
DB_PORT={{ db_port | default(5432) | int }}
DB_NAME={{ db_name | lower | replace(' ', '_') }}
DB_USER={{ db_user | lower }}
DB_PASSWORD={{ db_password }}

# Serveurs DNS
{% if dns_servers is defined and dns_servers | length > 0 %}
{% for server in dns_servers %}
DNS_SERVER_{{ loop.index }}={{ server }}
{% endfor %}
{% else %}
DNS_SERVER_1=8.8.8.8
DNS_SERVER_2=1.1.1.1
{% endif %}

# Liste des hôtes autorisés
ALLOWED_HOSTS={{ allowed_hosts | default(['localhost', '127.0.0.1']) | join(',') }}

# Mémoire (valeurs en Mo)
MAX_MEMORY={{ max_memory | default(512) | int }}

# Journalisation
LOG_LEVEL={{ log_level | default('info') | upper }}
LOG_FILE=/var/log/{{ app_name | lower | replace(' ', '-') }}/app.log

# Serveur
SERVER_NAME={{ ansible_facts['hostname'] | lower }}
SERVER_IP={{ ansible_facts['default_ipv4']['address'] }}
SERVER_OS={{ ansible_facts['distribution'] }} {{ ansible_facts['distribution_version'] }}
```

Crée le playbook `~/ansible-templates/deploy-app-config.yml` :

```yaml
---
- name: Déployer la configuration de l'application
  hosts: appservers
  become: true

  vars:
    app_name: "Mon Application Web"
    app_env: "production"
    app_debug: false
    app_port: 3000

    db_host: "db.internal.example.com"
    db_port: 5432
    db_name: "Mon Application DB"
    db_user: "AppUser"
    db_password: "s3cur3P@ss"

    dns_servers:
      - "10.0.0.1"
      - "10.0.0.2"

    allowed_hosts:
      - "example.com"
      - "www.example.com"
      - "api.example.com"

    max_memory: 1024
    log_level: "warning"

  tasks:
    # Crée le dossier de logs si nécessaire
    - name: Créer le répertoire de logs
      ansible.builtin.file:
        path: "/var/log/{{ app_name | lower | replace(' ', '-') }}"
        state: directory
        owner: root
        group: root
        mode: '0755'

    - name: Déployer le fichier de configuration
      ansible.builtin.template:
        src: templates/app-config.conf.j2
        dest: /etc/myapp/app.conf
        owner: root
        group: root
        mode: '0640'
        backup: true
```

**Résultat généré** (fichier final sur le serveur) :

```text
# Informations générales
APP_NAME=MON APPLICATION WEB
APP_ENV=production
APP_DEBUG=false
APP_PORT=3000

# Base de données
DB_HOST=db.internal.example.com
DB_PORT=5432
DB_NAME=mon_application_db
DB_USER=appuser
DB_PASSWORD=s3cur3P@ss

# Serveurs DNS
DNS_SERVER_1=10.0.0.1
DNS_SERVER_2=10.0.0.2

# Liste des hôtes autorisés
ALLOWED_HOSTS=example.com,www.example.com,api.example.com

# Mémoire (valeurs en Mo)
MAX_MEMORY=1024

# Journalisation
LOG_LEVEL=WARNING
LOG_FILE=/var/log/mon-application-web/app.log

# Serveur
SERVER_NAME=web-prod-01
SERVER_IP=192.168.1.50
SERVER_OS=Debian 12
```

**Détail des filtres appliqués** :

| Expression dans le template | Filtre(s) | Résultat |
| --- | --- | --- |
| `{{ app_name \| upper }}` | `upper` | `MON APPLICATION WEB` |
| `{{ app_env \| default('production') }}` | `default` | `production` |
| `{{ app_debug \| default(false) \| lower }}` | `default` puis `lower` | `false` |
| `{{ db_name \| lower \| replace(' ', '_') }}` | `lower` puis `replace` | `mon_application_db` |
| `{{ allowed_hosts \| join(',') }}` | `join` | `example.com,www.example.com,api.example.com` |
| `{{ log_level \| default('info') \| upper }}` | `default` puis `upper` | `WARNING` |
| `{{ app_name \| lower \| replace(' ', '-') }}` | `lower` puis `replace` | `mon-application-web` |

---

### Étape 7 : Créer un template de fichier de configuration complet

Cet exemple crée un fichier de configuration Nginx complet et réaliste, combinant toutes les techniques vues précédemment.

Crée le fichier `~/ansible-templates/templates/nginx-site.conf.j2` :

```jinja2
{# Configuration Nginx complète pour un site web #}
{# Généré par Ansible - Ne pas modifier manuellement #}
{# Variables requises : server_name, document_root #}

{% if upstream_servers is defined and upstream_servers | length > 0 %}
# Bloc upstream pour le load balancing
upstream {{ upstream_name | default('backend') }} {
{% for server in upstream_servers %}
    server {{ server.host }}:{{ server.port | default(8080) }} weight={{ server.weight | default(1) }}{% if server.backup | default(false) %} backup{% endif %};
{% endfor %}
}
{% endif %}

server {
    listen {{ http_port | default(80) }};
    server_name {{ server_name }};

{% if enable_ssl | default(false) %}
    # Redirection vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen {{ https_port | default(443) }} ssl;
    http2 on;
    server_name {{ server_name }};

    # Configuration SSL
    ssl_certificate {{ ssl_cert_path }};
    ssl_certificate_key {{ ssl_key_path }};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
{% endif %}

    root {{ document_root }};
    index index.html index.htm{% if enable_php | default(false) %} index.php{% endif %};

    # Journalisation
{% if enable_logging | default(true) %}
    access_log /var/log/nginx/{{ server_name }}_access.log;
    error_log /var/log/nginx/{{ server_name }}_error.log {{ log_level | default('warn') }};
{% else %}
    access_log off;
    error_log /dev/null;
{% endif %}

    # En-têtes de sécurité
{% if security_headers | default(true) %}
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
{% if enable_ssl | default(false) %}
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
{% endif %}
{% endif %}

    # Fichiers statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires {{ static_cache_duration | default('30d') }};
        add_header Cache-Control "public, immutable";
    }

{% if upstream_servers is defined and upstream_servers | length > 0 %}
    # Reverse proxy vers le backend
    location / {
        proxy_pass http://{{ upstream_name | default('backend') }};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
{% if enable_ssl | default(false) %}
        proxy_set_header X-Forwarded-Proto https;
{% endif %}
    }
{% else %}
    location / {
        try_files $uri $uri/ {% if enable_php | default(false) %}/index.php?$query_string {% endif %}=404;
    }
{% endif %}

{% if enable_php | default(false) %}
    # Traitement PHP via PHP-FPM
    location ~ \.php$ {
        fastcgi_pass {{ php_fpm_socket | default('unix:/run/php/php-fpm.sock') }};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
{% if php_max_execution_time is defined %}
        fastcgi_read_timeout {{ php_max_execution_time }};
{% endif %}
    }
{% endif %}

{% if custom_locations is defined %}
    # Locations personnalisées
{% for location in custom_locations %}
    location {{ location.path }} {
{% for directive in location.directives %}
        {{ directive }};
{% endfor %}
    }

{% endfor %}
{% endif %}

    # Interdire l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

### Étape 8 : Valider un template avant déploiement

Avant de déployer un template sur un serveur de production, vérifie les changements sans les appliquer. Cela évite d'écraser une configuration fonctionnelle par un template contenant une erreur. Ansible fournit deux options pour cela.

**Option 1 : Mode check (simulation)** :

```bash
# Le flag --check simule l'exécution sans modifier le serveur
ansible-playbook -i inventory.ini deploy-nginx-site.yml --check
```

**Résultat attendu** :

```text
TASK [Déployer la configuration Nginx] *****************************************
changed: [web1]

PLAY RECAP *********************************************************************
web1                       : ok=2    changed=1    unreachable=0    failed=0
```

Le statut `changed` en mode check signifie que le fichier _serait_ modifié, mais aucune modification n'a été faite.

**Option 2 : Mode check avec diff (simulation + aperçu des changements)** :

```bash
# Le flag --diff affiche les différences entre le fichier actuel et le nouveau
ansible-playbook -i inventory.ini deploy-nginx-site.yml --check --diff
```

**Résultat attendu** :

```text
TASK [Déployer la configuration Nginx] *****************************************
--- before: /etc/nginx/sites-available/example.conf
+++ after: /home/loic/.ansible/tmp/ansible-local-12345/tmpabc123
@@ -1,5 +1,5 @@
 server {
-    listen 80;
+    listen 8080;
     server_name example.com;
-    root /var/www/html;
+    root /var/www/example;
 }

changed: [web1]
```

Les lignes qui commencent par `-` sont supprimées. Les lignes qui commencent par `+` sont ajoutées. Cette vue permet de vérifier exactement ce qui va changer sur le serveur.

**Option 3 : Valider la syntaxe du fichier généré** :

Le paramètre `validate` du module `template` permet d'exécuter une commande de validation après la génération du fichier. Si la validation échoue, Ansible ne déploie pas le fichier.

```yaml
- name: Déployer la configuration Nginx avec validation
  ansible.builtin.template:
    src: templates/nginx-site.conf.j2
    dest: /etc/nginx/sites-available/{{ server_name }}.conf
    owner: root
    group: root
    mode: '0644'
    validate: 'nginx -t -c %s'
    # %s est remplacé par le fichier temporaire généré (obligatoire
    # pour que Ansible valide CE fichier, pas la config déjà en place).
    # nginx -t -c %s convient à un nginx.conf COMPLET.
    # Pour un simple virtual host (snippet), ne pas utiliser -c %s :
    # déploie d'abord le fichier, puis teste avec une tâche
    # ansible.builtin.command: nginx -t (voir l'exercice).
```

---

## Commandes Utiles

### Paramètres du module template

| Paramètre | Obligatoire | Description | Exemple |
| --- | --- | --- | --- |
| `src` | Oui | Chemin du template (relatif au playbook ou au dossier `templates/`) | `templates/nginx.conf.j2` |
| `dest` | Oui | Chemin de destination sur le serveur cible | `/etc/nginx/nginx.conf` |
| `owner` | Non | Propriétaire du fichier | `root` |
| `group` | Non | Groupe du fichier | `root` |
| `mode` | Non | Permissions du fichier (notation octale entre quotes) | `'0644'` |
| `validate` | Non | Commande de validation (`%s` = chemin du fichier temporaire) | `'visudo -cf %s'` |
| `backup` | Non | Crée une copie de sauvegarde avant modification (`true`/`false`) | `true` |
| `force` | Non | Remplace le fichier même s'il est identique (`true` par défaut) | `false` |
| `newline_sequence` | Non | Séquence de fin de ligne (`\n`, `\r\n`, `\r`) | `\n` |

### Recherche de fichiers templates

Le module `template` cherche le fichier source dans cet ordre :

1. Chemin absolu (si le `src` commence par `/`)
2. Relatif au dossier `templates/` du rôle (si utilisé dans un rôle)
3. Relatif au dossier `templates/` à côté du playbook
4. Relatif au dossier du playbook

### Filtres Jinja2 les plus utiles avec Ansible

| Filtre | Utilisation | Exemple |
| --- | --- | --- |
| `default(valeur)` | Valeur par défaut | `{{ port \| default(80) }}` |
| `lower` | Minuscules | `{{ name \| lower }}` |
| `upper` | Majuscules | `{{ env \| upper }}` |
| `replace(a, b)` | Remplacement | `{{ name \| replace(' ', '-') }}` |
| `join(sep)` | Liste vers chaîne | `{{ items \| join(', ') }}` |
| `int` | Conversion en entier | `{{ port \| int }}` |
| `length` | Longueur | `{{ list \| length }}` |
| `unique` | Dédoublonner | `{{ list \| unique }}` |
| `sort` | Trier | `{{ list \| sort }}` |
| `trim` | Supprimer espaces | `{{ text \| trim }}` |
| `to_yaml` | Conversion YAML | `{{ dict \| to_yaml }}` |
| `to_json` | Conversion JSON | `{{ dict \| to_json }}` |
| `regex_replace(p, r)` | Remplacement regex | `{{ text \| regex_replace('[0-9]+', '') }}` |
| `bool` | Conversion booléen | `{{ val \| bool }}` |
| `mandatory` | Erreur si non défini | `{{ db_host \| mandatory }}` |
| `ansible.utils.ipaddr` | Validation IP (collection `ansible.utils`, pas un filtre Jinja2 de base) | `{{ ip \| ansible.utils.ipaddr }}` |

### Commandes Ansible utiles pour les templates

| Commande | Action |
| --- | --- |
| `ansible-playbook playbook.yml --check` | Simule l'exécution sans appliquer les changements |
| `ansible-playbook playbook.yml --check --diff` | Simule et affiche les différences |
| `ansible-playbook playbook.yml --diff` | Exécute et affiche les différences |
| `ansible-playbook playbook.yml -e "var=value"` | Passe une variable en ligne de commande |
| `ansible-playbook playbook.yml --start-at-task="nom"` | Démarre à une tâche spécifique |

---

## Pièges Fréquents

### Piège 1 : Oublier l'extension .j2

**Problème** : Tu nommes le fichier template `nginx.conf` au lieu de `nginx.conf.j2`.

**Conséquence** : Le fichier fonctionne quand même (Ansible traite tout fichier passé au module `template` comme un template Jinja2, quelle que soit l'extension). Mais sans l'extension `.j2`, il est impossible de distinguer visuellement les templates des fichiers statiques dans le répertoire `templates/`.

**Solution** : Toujours ajouter `.j2` à la fin du nom de fichier template.

```text
# Structure correcte
templates/
├── nginx.conf.j2          # Template : contient {{ variables }}
├── index.html.j2           # Template : contient {{ variables }}
└── robots.txt              # Fichier statique : pas de variables
```

---

### Piège 2 : Template non trouvé

**Problème** : Ansible affiche l'erreur `Could not find or access 'templates/nginx.conf.j2'`.

**Causes possibles** :

1. Le fichier n'existe pas à l'emplacement indiqué
2. Le chemin est incorrect (faute de frappe)
3. Le dossier `templates/` n'est pas au bon endroit

**Solution** : Vérifie la structure des fichiers. Le dossier `templates/` doit être au même niveau que le playbook.

```text
# Structure correcte
projet/
├── deploy.yml              # Le playbook
├── templates/              # Le dossier templates (même niveau que le playbook)
│   └── nginx.conf.j2       # Le template
└── inventory.ini

# Structure incorrecte (templates dans un sous-dossier)
projet/
├── playbooks/
│   └── deploy.yml          # Le playbook est ici
├── templates/              # Le dossier templates n'est pas au même niveau
│   └── nginx.conf.j2
└── inventory.ini
```

**Si le playbook est dans un sous-dossier**, utilise un chemin relatif correct :

```yaml
# Si le playbook est dans playbooks/ et le template dans templates/
- name: Déployer la configuration
  ansible.builtin.template:
    src: ../templates/nginx.conf.j2
    dest: /etc/nginx/nginx.conf
```

---

### Piège 3 : Erreur de syntaxe Jinja2

**Problème** : Ansible affiche une erreur comme `TemplateSyntaxError: unexpected end of template`.

**Causes fréquentes** :

1. **`{% endif %}` manquant** : Chaque `{% if %}` doit avoir un `{% endif %}` correspondant
2. **`{% endfor %}` manquant** : Chaque `{% for %}` doit avoir un `{% endfor %}` correspondant
3. **Accolades non fermées** : `{{ variable }` au lieu de `{{ variable }}`
4. **Mélange de syntaxes** : `{% variable %}` au lieu de `{{ variable }}`

**Solution** : Vérifie que chaque balise ouvrante a sa balise fermante.

```jinja2
{# Incorrect : endif manquant #}
{% if enable_ssl %}
listen 443 ssl;

{# Correct #}
{% if enable_ssl %}
listen 443 ssl;
{% endif %}
```

**Astuce** : Compte les `{% if %}` et les `{% endif %}` dans ton template. Ils doivent être en nombre égal. Même chose pour `{% for %}` et `{% endfor %}`.

---

### Piège 4 : Lignes vides indésirables

**Problème** : Le fichier généré contient des lignes vides là où se trouvaient les instructions Jinja2.

**Exemple** :

```jinja2
{# Template #}
server {
{% if enable_ssl %}
    listen 443 ssl;
{% endif %}
    server_name example.com;
}
```

**Résultat quand `enable_ssl` est `false`** :

```text
server {

    server_name example.com;
}
```

La ligne vide apparaît parce que les lignes `{% if %}` et `{% endif %}` sont supprimées, mais les retours à la ligne restent.

**Solution** : Utilise le tiret `-` pour supprimer les espaces blancs.

```jinja2
{# Le tiret supprime l'espace blanc après la balise #}
server {
{% if enable_ssl -%}
    listen 443 ssl;
{% endif -%}
    server_name example.com;
}
```

**Règles du contrôle d'espaces** :

| Syntaxe | Effet |
| --- | --- |
| `{%- instruction %}` | Supprime les espaces **avant** la balise |
| `{% instruction -%}` | Supprime les espaces **après** la balise |
| `{%- instruction -%}` | Supprime les espaces **avant et après** la balise |

---

### Piège 5 : Utiliser copy au lieu de template

**Problème** : Tu utilises le module `copy` pour envoyer un fichier `.j2` sur le serveur. Les variables `{{ }}` ne sont pas remplacées et apparaissent telles quelles dans le fichier final.

**Exemple** :

```yaml
# Incorrect : copy n'interprète pas Jinja2
- name: Copier la configuration
  ansible.builtin.copy:
    src: templates/nginx.conf.j2
    dest: /etc/nginx/nginx.conf

# Le fichier sur le serveur contient littéralement :
# server_name {{ server_name }};
```

**Solution** : Utilise le module `template` au lieu de `copy`.

```yaml
# Correct : template interprète Jinja2
- name: Déployer la configuration
  ansible.builtin.template:
    src: templates/nginx.conf.j2
    dest: /etc/nginx/nginx.conf

# Le fichier sur le serveur contient :
# server_name example.com;
```

**Règle simple** : Si le fichier contient `{{ }}`, `{% %}` ou `{# #}`, utilise le module `template`. Si le fichier ne contient aucune syntaxe Jinja2, utilise le module `copy`.

---

## Checklist de Validation

- [ ] J'ai créé un template `.j2` avec des variables `{{ }}`
- [ ] J'ai utilisé le module `template` dans un playbook pour déployer le template
- [ ] J'ai utilisé des conditions `{% if %}...{% endif %}` dans un template
- [ ] J'ai utilisé des boucles `{% for %}...{% endfor %}` dans un template
- [ ] J'ai appliqué au moins 3 filtres Jinja2 différents (`default`, `lower`, `join`, etc.)
- [ ] J'ai vérifié un déploiement avec `--check --diff` avant de l'appliquer
- [ ] J'ai compris la différence entre le module `template` et le module `copy`

---

## Exercice Pratique

**Énoncé** : Crée une configuration Nginx complète pour un site web, déployable sur plusieurs serveurs avec des paramètres différents.

**Fichiers à créer** :

1. Un fichier template `templates/nginx-exercise.conf.j2`
2. Un fichier de variables pour le serveur de production `host_vars/prod-web.yml`
3. Un fichier de variables pour le serveur de staging `host_vars/staging-web.yml`
4. Un playbook `deploy-exercise.yml`

**Exigences du template** :

- Le `server_name` est une variable obligatoire
- Le `port` a une valeur par défaut de `80`
- Le `document_root` a une valeur par défaut de `/var/www/html`
- Si `enable_ssl` est `true`, ajouter le bloc SSL (certificat, clé, protocoles)
- Si `upstream_servers` est défini et non vide, générer un bloc `upstream` avec une boucle sur les serveurs
- Chaque serveur upstream a un `host`, un `port` (défaut `8080`), et un `weight` (défaut `1`)
- Si `enable_php` est `true`, ajouter le bloc de configuration PHP-FPM
- Les noms de fichiers de log utilisent le `server_name` en minuscules
- Ajouter un commentaire Jinja2 en haut du template indiquant qu'il est généré par Ansible

**Variables pour le serveur de production** :

- `server_name: "www.production.example.com"`
- `enable_ssl: true`
- `ssl_cert_path: "/etc/ssl/certs/prod.crt"`
- `ssl_key_path: "/etc/ssl/private/prod.key"`
- `enable_php: true`
- 3 serveurs upstream avec des poids différents

**Variables pour le serveur de staging** :

- `server_name: "staging.example.com"`
- `enable_ssl: false`
- `enable_php: true`
- 1 seul serveur upstream

**Résultat attendu** :

- Le playbook déploie un fichier Nginx différent sur chaque serveur
- Le fichier de production contient le bloc SSL et 3 serveurs upstream
- Le fichier de staging ne contient pas de bloc SSL et a 1 seul serveur upstream
- Les deux fichiers contiennent le bloc PHP-FPM

**Indications** :

- Commence par le template, en ajoutant les fonctionnalités une par une
- Teste avec `--check --diff` après chaque modification
- Utilise `default()` pour toutes les variables optionnelles
- Utilise `is defined` pour vérifier l'existence des listes avant de boucler

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier 1 : `templates/nginx-exercise.conf.j2`**

```jinja2
{# Configuration Nginx - Généré par Ansible #}
{# Ne pas modifier manuellement ce fichier #}
{# Template : templates/nginx-exercise.conf.j2 #}

{% if upstream_servers is defined and upstream_servers | length > 0 -%}
upstream {{ upstream_name | default('app_backend') }} {
{% for server in upstream_servers %}
    server {{ server.host }}:{{ server.port | default(8080) }} weight={{ server.weight | default(1) }};
{% endfor %}
}

{% endif -%}
server {
    listen {{ port | default(80) }};
    server_name {{ server_name | mandatory }};

{% if enable_ssl | default(false) %}
    # Redirection HTTP vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen {{ https_port | default(443) }} ssl;
    http2 on;
    server_name {{ server_name }};

    # Configuration SSL
    ssl_certificate {{ ssl_cert_path | mandatory }};
    ssl_certificate_key {{ ssl_key_path | mandatory }};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
{% endif %}

    root {{ document_root | default('/var/www/html') }};
    index index.html{% if enable_php | default(false) %} index.php{% endif %};

    # Journalisation
    access_log /var/log/nginx/{{ server_name | lower }}_access.log;
    error_log /var/log/nginx/{{ server_name | lower }}_error.log;

{% if upstream_servers is defined and upstream_servers | length > 0 %}
    # Reverse proxy vers le backend
    location / {
        proxy_pass http://{{ upstream_name | default('app_backend') }};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
{% if enable_ssl | default(false) %}
        proxy_set_header X-Forwarded-Proto https;
{% endif %}
    }
{% else %}
    location / {
        try_files $uri $uri/ {% if enable_php | default(false) %}/index.php?$query_string {% endif %}=404;
    }
{% endif %}

{% if enable_php | default(false) %}
    # Traitement PHP via PHP-FPM
    location ~ \.php$ {
        fastcgi_pass {{ php_fpm_socket | default('unix:/run/php/php-fpm.sock') }};
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
{% endif %}

    # Fichiers statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires {{ static_cache_duration | default('30d') }};
    }

    # Interdire l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
    }
}
```

**Fichier 2 : `host_vars/prod-web.yml`**

```yaml
---
server_name: "www.production.example.com"
port: 80
document_root: "/var/www/production"

# SSL activé en production
enable_ssl: true
ssl_cert_path: "/etc/ssl/certs/prod.crt"
ssl_key_path: "/etc/ssl/private/prod.key"

# PHP activé
enable_php: true
php_fpm_socket: "unix:/run/php/php8.3-fpm.sock"

# 3 serveurs backend avec des poids différents
upstream_name: "prod_backend"
upstream_servers:
  - host: "10.0.1.10"
    port: 8080
    weight: 5
  - host: "10.0.1.11"
    port: 8080
    weight: 3
  - host: "10.0.1.12"
    port: 8080
    weight: 1

static_cache_duration: "90d"
```

**Fichier 3 : `host_vars/staging-web.yml`**

```yaml
---
server_name: "staging.example.com"
port: 80
document_root: "/var/www/staging"

# Pas de SSL en staging
enable_ssl: false

# PHP activé
enable_php: true
php_fpm_socket: "unix:/run/php/php8.3-fpm.sock"

# 1 seul serveur backend
upstream_name: "staging_backend"
upstream_servers:
  - host: "10.0.2.10"
    port: 8080
```

**Fichier 4 : `deploy-exercise.yml`**

```yaml
---
- name: Déployer la configuration Nginx
  hosts: webservers
  become: true

  tasks:
    - name: Créer le répertoire sites-available
      ansible.builtin.file:
        path: /etc/nginx/sites-available
        state: directory
        owner: root
        group: root
        mode: '0755'

    - name: Déployer la configuration du virtual host
      ansible.builtin.template:
        src: templates/nginx-exercise.conf.j2
        dest: "/etc/nginx/sites-available/{{ server_name }}.conf"
        owner: root
        group: root
        mode: '0644'
        backup: true

    - name: Activer le virtual host (lien symbolique)
      ansible.builtin.file:
        src: "/etc/nginx/sites-available/{{ server_name }}.conf"
        dest: "/etc/nginx/sites-enabled/{{ server_name }}.conf"
        state: link

    - name: Vérifier la syntaxe Nginx
      ansible.builtin.command:
        cmd: nginx -t
      changed_when: false
```

**Vérification avant déploiement** :

```bash
# Vérifie les changements sans les appliquer
ansible-playbook -i inventory.ini deploy-exercise.yml --check --diff
```

**Exécution** :

```bash
# Déploie la configuration
ansible-playbook -i inventory.ini deploy-exercise.yml --diff
```

**Résultat sur le serveur de production** (`/etc/nginx/sites-available/www.production.example.com.conf`) :

```text
upstream prod_backend {
    server 10.0.1.10:8080 weight=5;
    server 10.0.1.11:8080 weight=3;
    server 10.0.1.12:8080 weight=1;
}

server {
    listen 80;
    server_name www.production.example.com;

    # Redirection HTTP vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name www.production.example.com;

    # Configuration SSL
    ssl_certificate /etc/ssl/certs/prod.crt;
    ssl_certificate_key /etc/ssl/private/prod.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;

    root /var/www/production;
    index index.html index.php;

    # Journalisation
    access_log /var/log/nginx/www.production.example.com_access.log;
    error_log /var/log/nginx/www.production.example.com_error.log;

    # Reverse proxy vers le backend
    location / {
        proxy_pass http://prod_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Traitement PHP via PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Fichiers statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 90d;
    }

    # Interdire l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
    }
}
```

**Résultat sur le serveur de staging** (`/etc/nginx/sites-available/staging.example.com.conf`) :

```text
upstream staging_backend {
    server 10.0.2.10:8080 weight=1;
}

server {
    listen 80;
    server_name staging.example.com;

    root /var/www/staging;
    index index.html index.php;

    # Journalisation
    access_log /var/log/nginx/staging.example.com_access.log;
    error_log /var/log/nginx/staging.example.com_error.log;

    # Reverse proxy vers le backend
    location / {
        proxy_pass http://staging_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Traitement PHP via PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Fichiers statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
    }

    # Interdire l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
    }
}
```

**Points de vérification** :

- Le fichier de production contient le bloc `upstream` avec 3 serveurs et des poids différents
- Le fichier de production contient le bloc SSL avec redirection HTTP vers HTTPS
- Le fichier de staging contient le bloc `upstream` avec 1 seul serveur (poids par défaut `1`)
- Le fichier de staging ne contient pas de bloc SSL
- Les deux fichiers contiennent le bloc PHP-FPM
- Les noms de fichiers de log utilisent le `server_name` en minuscules

---

## Navigation

← Fiche précédente : **[Conditions et Boucles](07-conditions-boucles.md)**

→ Fiche suivante : **[Handlers et Tags](09-handlers-tags.md)**
