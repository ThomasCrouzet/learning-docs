---
tags:
  - Référence
  - Ansible
description: "Aide-mémoire Ansible : structure playbook, modules courants et commandes ad-hoc"
estimated_time: "20 min"
fiche_number: 11
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire Ansible

> **En bref** : Aide-mémoire Ansible. Lecture estimée : 20 min.

Fiche de référence rapide pour Ansible : commandes ad-hoc, playbooks, modules et rôles.

---

## Commandes ad-hoc

| Commande | Action |
| -------- | ------ |
| `ansible all -m ping` | Tester la connexion a tous les hôtes |
| `ansible all -m setup` | Collecter les facts de tous les hôtes |
| `ansible web -m command -a "uptime"` | Exécuter une commande sur le groupe web |
| `ansible all -m copy -a "src=file.txt dest=/tmp/"` | Copier un fichier |
| `ansible all -m apt -a "name=nginx state=present" -b` | Installer un paquet (avec sudo) |
| `ansible-inventory --list` | Lister l'inventaire au format JSON |
| `ansible-inventory --graph` | Afficher l'arbre de l'inventaire |

---

## Structure d'un playbook

```yaml
---
- name: Configurer les serveurs web
  hosts: web
  become: true
  vars:
    http_port: 80
    app_name: mon-app

  tasks:
    - name: Installer Nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Copier la configuration
      ansible.builtin.template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/default
        owner: root
        group: root
        mode: "0644"
      notify: Redemarrer Nginx

  handlers:
    - name: Redemarrer Nginx
      ansible.builtin.service:
        name: nginx
        state: restarted
```

---

## Modules courants

### Gestion des fichiers

| Module | Action |
| ------ | ------ |
| `ansible.builtin.copy` | Copier un fichier vers l'hôte |
| `ansible.builtin.template` | Copier un template Jinja2 |
| `ansible.builtin.file` | Gérer les fichiers et répertoires |
| `ansible.builtin.lineinfile` | Modifier une ligne dans un fichier |
| `ansible.builtin.blockinfile` | Insérer un bloc dans un fichier |
| `ansible.builtin.fetch` | Récupérer un fichier depuis l'hôte |
| `ansible.builtin.unarchive` | Extraire une archive |

### Gestion des paquets

| Module | Action |
| ------ | ------ |
| `ansible.builtin.apt` | Paquets Debian/Ubuntu |
| `ansible.builtin.yum` | Paquets RedHat/CentOS |
| `ansible.builtin.dnf` | Paquets Fedora |
| `ansible.builtin.pip` | Paquets Python |
| `ansible.builtin.package` | Gestionnaire générique |

### Gestion des services

| Module | Action |
| ------ | ------ |
| `ansible.builtin.service` | Démarrer, arrêter, redémarrer un service |
| `ansible.builtin.systemd` | Gérer les unités systemd |

### Commandes

| Module | Action |
| ------ | ------ |
| `ansible.builtin.command` | Exécuter une commande (sans shell) |
| `ansible.builtin.shell` | Exécuter une commande (avec shell) |
| `ansible.builtin.script` | Exécuter un script local sur l'hôte |
| `ansible.builtin.raw` | Commande brute (sans Python) |

### Utilisateurs et groupes

| Module | Action |
| ------ | ------ |
| `ansible.builtin.user` | Gérer les utilisateurs |
| `ansible.builtin.group` | Gérer les groupes |
| `ansible.builtin.authorized_key` | Gérer les clés SSH |

---

## Inventaire

### Format INI

```ini
[web]
web1.example.com
web2.example.com

[db]
db1.example.com ansible_port=2222 db_port=5432

[prod:children]
web
db

[prod:vars]
ansible_user=deploy
```

`ansible_port` est le **port SSH** utilisé par Ansible pour se connecter (pas le port PostgreSQL). Le port applicatif de la base se met dans une variable métier (ex. `db_port`).

### Format YAML

```yaml
all:
  children:
    web:
      hosts:
        web1.example.com:
        web2.example.com:
    db:
      hosts:
        db1.example.com:
          ansible_port: 2222
          db_port: 5432
  vars:
    ansible_user: deploy
```

---

## Variables et facts

### Priorité des variables (de la plus faible a la plus forte)

1. Defaults du rôle (`defaults/main.yml`)
2. Variables d'inventaire (group_vars, host_vars)
3. Variables du playbook (`vars:`)
4. Variables de tâche (`vars:` dans une tâche)
5. Extra vars (`-e` en ligne de commande)

### Utilisation dans les templates

```jinja2
server {
    listen {{ http_port }};
    server_name {{ ansible_hostname }};
    root {{ app_root | default('/var/www/html') }};
}
```

---

## Conditions et boucles

### Conditions

```yaml
- name: Installer Nginx (Debian uniquement)
  ansible.builtin.apt:
    name: nginx
    state: present
  when: ansible_os_family == "Debian"

- name: Vérifier si le fichier existe
  ansible.builtin.stat:
    path: /etc/app.conf
  register: app_conf

- name: Créer le fichier si absent
  ansible.builtin.copy:
    src: app.conf
    dest: /etc/app.conf
  when: not app_conf.stat.exists
```

### Boucles

```yaml
- name: Installer plusieurs paquets
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - postgresql
    - redis

- name: Créer des utilisateurs
  ansible.builtin.user:
    name: "{{ item.name }}"
    groups: "{{ item.groups }}"
  loop:
    - { name: "alex", groups: "admin" }
    - { name: "sam", groups: "dev" }
```

---

## Structure d'un rôle

```text
roles/
  webserver/
    defaults/        # Variables par défaut
      main.yml
    files/           # Fichiers statiques
    handlers/        # Handlers
      main.yml
    meta/            # Dépendances du rôle
      main.yml
    tasks/           # Taches principales
      main.yml
    templates/       # Templates Jinja2
    vars/            # Variables du rôle
      main.yml
```

### Utiliser un rôle

```yaml
- name: Configurer le serveur
  hosts: web
  roles:
    - webserver
    - { role: database, db_port: 5432 }
```

---

## Ansible Vault

| Commande | Action |
| -------- | ------ |
| `ansible-vault create secrets.yml` | Créer un fichier chiffré |
| `ansible-vault edit secrets.yml` | Modifier un fichier chiffré |
| `ansible-vault view secrets.yml` | Voir le contenu |
| `ansible-vault encrypt existing.yml` | Chiffrer un fichier existant |
| `ansible-vault decrypt secrets.yml` | Déchiffrer |
| `ansible-playbook site.yml --ask-vault-pass` | Exécuter avec le mot de passe vault |
| `ansible-playbook site.yml --vault-password-file=.vault_pass` | Exécuter avec un fichier de mot de passe |

---

## Navigation

← Fiche précédente : **[Aide-mémoire Kubernetes](10-aide-memoire-kubernetes.md)**

→ Fiche suivante : **[Aide-mémoire TypeScript](12-aide-memoire-typescript.md)**
