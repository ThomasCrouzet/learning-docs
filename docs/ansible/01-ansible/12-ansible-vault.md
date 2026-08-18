---
tags:
  - Ansible
  - Avancé
  - Pratique
description: "Ansible Vault"
estimated_time: "145 min"
fiche_number: 12
total_fiches: 14
cursus: "Ansible"
---

# 12 - Ansible Vault

> **En bref** : À la fin de cette fiche, tu sauras chiffrer et déchiffrer des données sensibles (mots de passe, clés API, certificats) avec Ansible Vault. Lecture estimée : 145 min.


## Prérequis

- Fiches [01 - Introduction à Ansible](01-introduction-ansible.md) à [10 - Les Rôles](10-roles.md) de ce cursus (lues et comprises)
- Fiche **[11 - Ansible Galaxy](11-ansible-galaxy.md)** (recommandée mais pas obligatoire)
- Savoir écrire un playbook Ansible avec des variables et des `vars_files`
- Savoir utiliser `ansible.cfg` pour configurer Ansible
- Avoir un accès SSH fonctionnel vers tes machines cibles

## Objectif de cette fiche

À la fin de cette fiche, tu sauras chiffrer et déchiffrer des données sensibles (mots de passe, clés API, certificats) avec Ansible Vault.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'Ansible Vault ?

**Définition** : Ansible Vault est un outil intégré à Ansible qui permet de chiffrer des fichiers ou des variables individuelles avec l'algorithme AES-256. Il utilise un mot de passe unique (le _vault password_) pour chiffrer et déchiffrer les données.

**Le problème qu'Ansible Vault résout** :

Sans Ansible Vault, voici les problèmes rencontrés :

1. **Mots de passe en clair dans les fichiers** : Les playbooks et fichiers de variables contiennent des mots de passe de base de données, des clés API, des certificats SSL. Si ces fichiers sont versionnés dans Git, tout membre ayant accès au dépôt peut lire ces informations sensibles.

2. **Risque de fuite en cas de compromission du dépôt** : Si le dépôt Git est exposé (erreur de configuration, piratage, dépôt rendu public par erreur), toutes les données sensibles sont immédiatement accessibles à un attaquant.

3. **Pas de versioning des secrets** : Si tu stockes les mots de passe en dehors du dépôt (dans un fichier local, un post-it, un document partagé), tu perds la traçabilité. Tu ne sais plus quel mot de passe était utilisé il y a 3 mois, ni qui l'a changé.

4. **Transmission non sécurisée** : Pour partager un mot de passe avec un collègue, tu l'envoies par e-mail ou par messagerie instantanée. Ces canaux ne sont pas conçus pour transmettre des données sensibles.

**Comment Ansible Vault résout ces problèmes** :

| Problème                          | Solution apportée par Ansible Vault                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| Mots de passe en clair            | Les données sont chiffrées en AES-256. Le fichier est illisible sans le mot de passe Vault  |
| Risque de fuite                   | Même si le dépôt est exposé, les données chiffrées sont inutilisables sans le mot de passe |
| Pas de versioning des secrets     | Les fichiers chiffrés sont versionnés dans Git comme n'importe quel fichier                |
| Transmission non sécurisée        | Seul le mot de passe Vault doit être transmis de façon sécurisée, pas chaque secret         |

**Analogie concrète** : Ansible Vault est un coffre-fort dans ton bureau. Tu ranges tes documents importants (contrats, mots de passe, clés) dans le coffre-fort. Le coffre-fort reste dans le bureau, visible par tous, mais personne ne peut lire son contenu sans la combinaison (le mot de passe Vault). Tu peux déplacer le coffre-fort d'un bureau à un autre (commit Git), il reste verrouillé. Seul celui qui connaît la combinaison peut l'ouvrir.

**Ce qu'Ansible Vault n'est PAS** :

- Ansible Vault n'est pas un gestionnaire de secrets comme HashiCorp Vault (ce sont deux outils différents malgré le nom similaire). HashiCorp Vault est un serveur centralisé qui stocke, distribue et renouvelle automatiquement les secrets. Ansible Vault est un outil de chiffrement de fichiers, intégré à Ansible, sans serveur central.
- Ansible Vault n'est pas un remplacement pour une solution de gestion de secrets en production à grande échelle. Pour des infrastructures complexes avec des centaines de secrets qui changent fréquemment, un outil comme HashiCorp Vault ou AWS Secrets Manager est plus adapté. Ansible Vault reste adapté pour les projets de taille petite à moyenne et les environnements où un gestionnaire de secrets centralisé n'est pas nécessaire.

Le diagramme suivant montre le cycle de vie d'un fichier géré par Ansible Vault.

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-12-ansible-vault-1.html">Qu&#x27;est-ce qu&#x27;Ansible Vault ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-12-ansible-vault-1.html" title="Qu&#x27;est-ce qu&#x27;Ansible Vault ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Comparaison Ansible Vault vs HashiCorp Vault** :

| Critère                    | Ansible Vault                                | HashiCorp Vault                                     |
| -------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Type d'outil               | Chiffrement de fichiers (CLI)                | Serveur centralisé de gestion de secrets            |
| Installation               | Rien à installer (intégré à Ansible)         | Serveur dédié à installer et configurer             |
| Stockage des secrets       | Dans les fichiers du projet (Git)            | Dans un serveur centralisé avec backend de stockage |
| Rotation des secrets       | Manuelle (tu modifies le fichier, re-chiffres) | Automatique (renouvellement programmé)            |
| Contrôle d'accès           | Tout ou rien (tu as le mot de passe ou non)  | Granulaire (politiques d'accès par utilisateur)     |
| Cas d'usage idéal          | Petites à moyennes équipes                   | Grandes infrastructures, environnements critiques   |

---

### Chiffrement de fichier entier vs variable individuelle

**Définition** : Ansible Vault propose deux modes de chiffrement. Le chiffrement de fichier entier rend tout le fichier illisible. Le chiffrement de variable individuelle (avec `encrypt_string`) chiffre uniquement la valeur d'une variable, le reste du fichier reste lisible.

**Le problème que ces deux modes résolvent** :

Sans ces deux modes, voici les problèmes rencontrés :

1. **Tout ou rien** : Si seul le chiffrement de fichier entier existait, tu devrais chiffrer un fichier entier même si une seule variable est sensible. Cela rend le fichier impossible à lire dans un `git diff` et complique les revues de code.

2. **Pas de contexte** : Avec un fichier entièrement chiffré, tu ne peux pas savoir quelles variables il contient sans le déchiffrer. Un collègue qui consulte le dépôt ne sait même pas que `db_password` existe dans ce fichier.

**Comment ces deux modes résolvent ces problèmes** :

| Problème          | Solution                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Tout ou rien      | `encrypt_string` chiffre uniquement les valeurs sensibles. Les noms de variables restent lisibles |
| Pas de contexte   | Les noms de variables et les valeurs non sensibles restent en clair dans le fichier               |

**Comparaison fichier entier vs variable individuelle** :

| Critère                          | Fichier entier (`encrypt`)                      | Variable individuelle (`encrypt_string`)             |
| -------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| Ce qui est chiffré               | Tout le fichier                                 | Uniquement la valeur de la variable                  |
| Lisibilité dans Git              | Aucune (tout est chiffré)                       | Les noms de variables et valeurs non sensibles restent lisibles |
| Modification                     | Via `ansible-vault edit` uniquement             | Directement dans un éditeur de texte (les valeurs chiffrées sont des blocs de texte) |
| Revue de code (pull request)     | Impossible de voir ce qui a changé              | On voit les noms de variables, seules les valeurs chiffrées changent |
| Facilité d'utilisation           | Simple : une commande pour tout le fichier      | Plus complexe : chaque variable est chiffrée individuellement |
| Cas d'usage idéal                | Fichier contenant uniquement des secrets         | Fichier mixte avec des variables sensibles et non sensibles |

**Analogie concrète** : Le chiffrement de fichier entier, c'est comme mettre tout un classeur dans le coffre-fort. Personne ne peut voir les titres des documents. Le chiffrement de variable individuelle, c'est comme mettre chaque document sensible dans une enveloppe scellée, mais laisser les enveloppes dans le classeur ouvert. Tout le monde peut voir qu'il y a un document intitulé "mot de passe base de données", mais personne ne peut lire son contenu sans ouvrir l'enveloppe.

---

### Qu'est-ce que le fichier vault-password-file ?

**Définition** : Le vault-password-file est un fichier texte qui contient le mot de passe Vault, sur une seule ligne. Il permet d'éviter de taper le mot de passe à chaque exécution d'un playbook ou d'une commande Vault.

**Le problème que le vault-password-file résout** :

Sans vault-password-file, voici les problèmes rencontrés :

1. **Saisie répétitive** : À chaque exécution de `ansible-playbook` avec des secrets, tu dois taper le mot de passe Vault manuellement. Si tu exécutes 20 playbooks dans la journée, tu tapes le mot de passe 20 fois.

2. **Automatisation impossible** : Dans un pipeline CI/CD, il n'y a personne pour taper un mot de passe. Sans fichier de mot de passe, impossible d'automatiser les déploiements qui utilisent des secrets Vault.

**Comment le vault-password-file résout ces problèmes** :

| Problème                  | Solution apportée par le vault-password-file                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Saisie répétitive         | Le mot de passe est lu automatiquement depuis le fichier. Aucune saisie manuelle nécessaire    |
| Automatisation impossible | Le fichier peut être utilisé dans un pipeline CI/CD pour déchiffrer les secrets automatiquement |

**Analogie concrète** : Le vault-password-file, c'est comme laisser la clé du coffre-fort dans le tiroir de ton bureau (fermé à clé). Tu n'as pas besoin de taper la combinaison à chaque fois que tu ouvres le coffre. Mais attention : si quelqu'un accède à ton tiroir, il peut ouvrir le coffre. C'est pour cela que le fichier ne doit jamais être commité dans Git.

**Règle absolue** : Le vault-password-file ne doit **jamais** être commité dans Git. Il doit être ajouté au fichier `.gitignore` du projet.

---

### Qu'est-ce que le rekey ?

**Définition** : Le rekey est l'opération qui change le mot de passe Vault utilisé pour chiffrer un fichier. Le fichier est déchiffré avec l'ancien mot de passe, puis rechiffré avec le nouveau.

**Le problème que le rekey résout** :

Sans rekey, voici les problèmes rencontrés :

1. **Membre qui quitte l'équipe** : Un collègue qui connaissait le mot de passe Vault quitte l'équipe. Sans moyen de changer le mot de passe, il conserve l'accès aux secrets.

2. **Mot de passe compromis** : Si le mot de passe Vault est exposé (fuité par erreur, trouvé dans un e-mail), tous les fichiers chiffrés avec ce mot de passe sont vulnérables.

**Comment le rekey résout ces problèmes** :

| Problème                   | Solution apportée par le rekey                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Membre qui quitte l'équipe | Tu changes le mot de passe Vault. L'ancien mot de passe ne permet plus de déchiffrer          |
| Mot de passe compromis     | Tu changes le mot de passe immédiatement. Les fichiers sont rechiffrés avec le nouveau        |

---

## Étapes Pratiques

### Étape 1 : Créer un fichier de variables sensibles

Crée un fichier `secrets.yml` contenant des données sensibles (mot de passe de base de données, clé API, clé privée SSL).

```bash
# Crée un fichier de variables sensibles en clair
cat > secrets.yml << 'EOF'
---
db_password: "SuperSecret123!"
api_key: "sk-abc123def456ghi789jkl012"
ssl_private_key: |
  -----BEGIN PRIVATE KEY-----
  MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7z...
  (contenu fictif pour l'exemple)
  -----END PRIVATE KEY-----
EOF
```

Vérifie que le fichier est bien créé et lisible :

```bash
# Affiche le contenu du fichier
cat secrets.yml
```

**Résultat attendu** :

```text
---
db_password: "SuperSecret123!"
api_key: "sk-abc123def456ghi789jkl012"
ssl_private_key: |
  -----BEGIN PRIVATE KEY-----
  MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7z...
  (contenu fictif pour l'exemple)
  -----END PRIVATE KEY-----
```

Ce fichier est en clair. Si tu le commites dans Git, tout le monde peut lire les mots de passe. L'étape suivante le chiffre.

---

### Étape 2 : Chiffrer un fichier entier

Chiffre le fichier `secrets.yml` avec Ansible Vault.

```bash
# Chiffre le fichier secrets.yml
# Ansible te demande de saisir un mot de passe Vault (2 fois pour confirmation)
ansible-vault encrypt secrets.yml
```

**Résultat attendu** :

```text
New Vault password:
Confirm New Vault password:
Encryption successful
```

Vérifie que le fichier est bien chiffré :

```bash
# Affiche le contenu du fichier chiffré
cat secrets.yml
```

**Résultat attendu** :

```text
$ANSIBLE_VAULT;1.1;AES256
33363965626431303762306332313063393531373930303361643762663062623534323930663930
61663231663062373733633237353363303365653464300a623436636131663933373336313365613
32663038363862383938633862343736633137306530623334623462393931666166363731613530
36653237363237640a336166373137633837616433646538373262366264353665316237376564326
```

Le fichier commence par `$ANSIBLE_VAULT;1.1;AES256`. C'est l'en-tête Vault qui indique :

- `$ANSIBLE_VAULT` : c'est un fichier chiffré par Ansible Vault
- `1.1` : la version du format Vault
- `AES256` : l'algorithme de chiffrement utilisé

Le reste est le contenu chiffré, représenté en hexadécimal. Il est totalement illisible sans le mot de passe Vault.

---

### Étape 3 : Visualiser un fichier chiffré

Pour lire le contenu d'un fichier chiffré sans le modifier, utilise `ansible-vault view`.

```bash
# Affiche le contenu déchiffré du fichier (lecture seule)
# Ansible te demande le mot de passe Vault
ansible-vault view secrets.yml
```

**Résultat attendu** :

```text
Vault password:
---
db_password: "SuperSecret123!"
api_key: "sk-abc123def456ghi789jkl012"
ssl_private_key: |
  -----BEGIN PRIVATE KEY-----
  MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7z...
  (contenu fictif pour l'exemple)
  -----END PRIVATE KEY-----
```

Le fichier est déchiffré en mémoire et affiché dans le terminal. Le fichier sur le disque reste chiffré.

---

### Étape 4 : Modifier un fichier chiffré

Pour modifier le contenu d'un fichier chiffré, utilise `ansible-vault edit`.

```bash
# Ouvre le fichier déchiffré dans ton éditeur de texte ($EDITOR)
# Ansible te demande le mot de passe Vault
ansible-vault edit secrets.yml
```

**Ce qui se passe** :

1. Ansible déchiffre le fichier en mémoire
2. Il ouvre le contenu déchiffré dans ton éditeur (défini par la variable d'environnement `$EDITOR`, par défaut `vi`)
3. Tu modifies le contenu
4. Quand tu enregistres et fermes l'éditeur, Ansible rechiffre le fichier automatiquement

**Pour changer l'éditeur utilisé** :

```bash
# Utiliser nano au lieu de vi
export EDITOR=nano
ansible-vault edit secrets.yml
```

---

### Étape 5 : Déchiffrer un fichier

Pour remettre un fichier en clair (supprimer le chiffrement), utilise `ansible-vault decrypt`.

```bash
# Déchiffre le fichier (le remet en clair)
# Ansible te demande le mot de passe Vault
ansible-vault decrypt secrets.yml
```

**Résultat attendu** :

```text
Vault password:
Decryption successful
```

Le fichier est maintenant en clair sur le disque. Toute personne ayant accès au fichier peut lire son contenu.

**Attention** : Ne commite jamais un fichier déchiffré dans Git. Si tu déchiffres un fichier pour le modifier manuellement, pense à le rechiffrer avant de commiter.

---

### Étape 6 : Chiffrer une variable individuelle avec encrypt_string

Au lieu de chiffrer un fichier entier, tu peux chiffrer uniquement la valeur d'une variable.

```bash
# Chiffre une chaîne de caractères et associe le résultat à un nom de variable
ansible-vault encrypt_string 'SuperSecret123!' --name 'db_password'
```

**Résultat attendu** :

```text
New Vault password:
Confirm New Vault password:
db_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          61326634323866393264336339363034353266383839663463383432633462333532623132313039
          3836643439303862383063393633333830366333613964300a323262633537326235633332383936
          65633532353731646333343465393066373435363531333333366264346365393233383738613533
          3139383465626363370a616436623662653733393963326264336461623561336335326264626530
          3735
Encryption successful
```

Le résultat est un bloc YAML que tu peux copier-coller directement dans un fichier de variables.

**Comment utiliser le résultat** :

Crée un fichier `group_vars/all/vars.yml` et colle le résultat :

```yaml
---
# Variables non sensibles (en clair)
app_name: "mon-application"
app_port: 8080

# Variables sensibles (chiffrées avec Vault)
db_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          61326634323866393264336339363034353266383839663463383432633462333532623132313039
          3836643439303862383063393633333830366333613964300a323262633537326235633332383936
          65633532353731646333343465393066373435363531333333366264346365393233383738613533
          3139383465626363370a616436623662653733393963326264336461623561336335326264626530
          3735

api_key: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          (autre valeur chiffrée)
```

Le nom de la variable (`db_password`, `api_key`) est visible en clair. Seule la valeur est chiffrée. Cela permet de savoir quelles variables existent sans déchiffrer quoi que ce soit.

---

### Étape 7 : Utiliser les secrets dans un playbook

Crée un playbook qui utilise les secrets chiffrés pour configurer une application.

**Fichier `templates/db-config.j2`** (template Jinja2) :

```yaml
# Fichier de configuration de la base de données
# Généré automatiquement par Ansible - ne pas modifier manuellement
database:
  host: "localhost"
  port: 5432
  name: "mon_application"
  user: "app_user"
  password: "{{ db_password }}"
```

**Fichier `deploy.yml`** (playbook) :

```yaml
---
- name: Déployer la configuration de l'application
  hosts: all
  become: true
  vars_files:
    # Ce fichier est chiffré avec Ansible Vault
    - secrets.yml
  tasks:
    - name: Créer le répertoire de configuration
      ansible.builtin.file:
        path: /etc/mon-application
        state: directory
        owner: root
        group: root
        mode: "0755"

    - name: Déployer le fichier de configuration de la base de données
      ansible.builtin.template:
        src: templates/db-config.j2
        dest: /etc/mon-application/database.yml
        owner: root
        group: root
        # Mode 0640 : lecture/écriture pour root, lecture pour le groupe, rien pour les autres
        # Important : les fichiers contenant des mots de passe ne doivent pas être lisibles par tous
        mode: "0640"
```

**Explication** :

- `vars_files: - secrets.yml` : Ansible charge le fichier `secrets.yml`. Si le fichier est chiffré, Ansible le déchiffre automatiquement au moment de l'exécution (à condition d'avoir le mot de passe Vault).
- `{{ db_password }}` : Dans le template Jinja2, la variable `db_password` est remplacée par sa valeur déchiffrée. Le fichier généré sur la machine cible contient le mot de passe en clair.
- `mode: "0640"` : Le fichier de configuration est lisible uniquement par root et le groupe root. Les autres utilisateurs ne peuvent pas le lire. C'est une bonne pratique pour les fichiers contenant des mots de passe.

---

### Étape 8 : Exécuter un playbook avec Vault

Il y a trois façons de fournir le mot de passe Vault à `ansible-playbook`.

**Méthode 1 : Prompt interactif (--ask-vault-pass)**

```bash
# Ansible te demande le mot de passe Vault avant l'exécution
ansible-playbook deploy.yml --ask-vault-pass
```

**Résultat attendu** :

```text
Vault password:

PLAY [Déployer la configuration de l'application] *****************************

TASK [Gathering Facts] *********************************************************
ok: [web1]

TASK [Créer le répertoire de configuration] ************************************
changed: [web1]

TASK [Déployer le fichier de configuration de la base de données] **************
changed: [web1]

PLAY RECAP *********************************************************************
web1                       : ok=3    changed=2    unreachable=0    failed=0    skipped=0
```

**Méthode 2 : Fichier de mot de passe (--vault-password-file)**

```bash
# Ansible lit le mot de passe depuis le fichier .vault_pass
ansible-playbook deploy.yml --vault-password-file .vault_pass
```

**Méthode 3 : Configuration dans ansible.cfg** (voir étape suivante)

```bash
# Aucune option supplémentaire nécessaire
ansible-playbook deploy.yml
```

**Que se passe-t-il si tu oublies de fournir le mot de passe Vault ?**

```bash
# Exécution sans --ask-vault-pass et sans vault_password_file configuré
ansible-playbook deploy.yml
```

**Message d'erreur** :

```text
ERROR! Attempting to decrypt but no vault secrets found
```

Ce message signifie qu'Ansible a détecté un fichier chiffré (dans `vars_files`) mais ne dispose d'aucun mot de passe pour le déchiffrer.

---

### Étape 9 : Configurer vault_password_file dans ansible.cfg

Au lieu de passer `--vault-password-file` à chaque commande, tu peux configurer le chemin du fichier de mot de passe dans `ansible.cfg`.

**Étape 9a : Créer le fichier de mot de passe**

```bash
# Crée le fichier .vault_pass contenant le mot de passe Vault
# Remplace "MonMotDePasseVault" par ton propre mot de passe
echo 'MonMotDePasseVault' > .vault_pass

# Restreindre les permissions : lecture/écriture uniquement pour le propriétaire
chmod 600 .vault_pass
```

**Étape 9b : Ajouter .vault_pass au .gitignore**

```bash
# Ajoute .vault_pass au fichier .gitignore
echo '.vault_pass' >> .gitignore
```

Vérifie que le `.gitignore` contient bien la ligne :

```bash
# Affiche le contenu du .gitignore
cat .gitignore
```

**Résultat attendu** (la dernière ligne doit contenir `.vault_pass`) :

```text
...
.vault_pass
```

**Étape 9c : Configurer ansible.cfg**

Ajoute la directive `vault_password_file` dans la section `[defaults]` de ton fichier `ansible.cfg` :

```ini
[defaults]
inventory = inventory.ini
vault_password_file = .vault_pass
```

À partir de maintenant, toutes les commandes `ansible-vault` et `ansible-playbook` utilisent automatiquement le mot de passe contenu dans `.vault_pass`. Tu n'as plus besoin de passer `--ask-vault-pass` ni `--vault-password-file`.

**Vérification** :

```bash
# Ces commandes fonctionnent sans demander de mot de passe
ansible-vault view secrets.yml
ansible-playbook deploy.yml
```

---

### Étape 10 : Changer le mot de passe Vault (rekey)

Le rekey permet de changer le mot de passe utilisé pour chiffrer un fichier.

```bash
# Change le mot de passe Vault du fichier secrets.yml
# Ansible demande l'ancien mot de passe, puis le nouveau (2 fois)
ansible-vault rekey secrets.yml
```

**Résultat attendu** :

```text
Vault password:
New Vault password:
Confirm New Vault password:
Rekey successful
```

Le fichier est maintenant chiffré avec le nouveau mot de passe. L'ancien mot de passe ne fonctionne plus pour ce fichier.

**Avec un vault-password-file** :

```bash
# L'ancien mot de passe est lu depuis .vault_pass
# Tu dois fournir le nouveau mot de passe via un fichier ou en interactif
ansible-vault rekey secrets.yml --new-vault-password-file .vault_pass_new
```

**Après le rekey, pense à mettre à jour le fichier `.vault_pass`** si tu l'utilises. Sinon, les commandes suivantes échoueront car `.vault_pass` contient encore l'ancien mot de passe.

---

### Étape 11 : Bonnes pratiques de nommage et d'organisation

Ansible recommande une convention d'organisation pour séparer les variables sensibles des variables non sensibles.

**Convention 1 : Séparer les fichiers `vars.yml` et `vault.yml`**

```text
group_vars/
├── all/
│   ├── vars.yml          # Variables non sensibles (en clair)
│   └── vault.yml         # Variables chiffrées avec Vault
├── production/
│   ├── vars.yml          # Variables non sensibles pour la production
│   └── vault.yml         # Secrets de production (chiffrés)
└── staging/
    ├── vars.yml          # Variables non sensibles pour le staging
    └── vault.yml         # Secrets de staging (chiffrés)
```

**Contenu de `group_vars/production/vars.yml`** (en clair) :

```yaml
---
# Variables non sensibles pour l'environnement de production
app_name: "mon-application"
app_port: 8080
db_host: "db.production.internal"
db_port: 5432
db_name: "app_production"
db_user: "app_user"

# Référence à la variable chiffrée dans vault.yml
db_password: "{{ vault_db_password }}"
api_key: "{{ vault_api_key }}"
```

**Contenu de `group_vars/production/vault.yml`** (chiffré) :

```yaml
---
# Ce fichier est chiffré avec ansible-vault encrypt
vault_db_password: "Pr0dP@ssw0rd!"
vault_api_key: "sk-prod-abc123def456"
```

**Convention de nommage** : Les variables chiffrées dans `vault.yml` sont préfixées par `vault_`. Dans `vars.yml`, les variables "publiques" font référence aux variables `vault_` avec `{{ vault_nom_variable }}`. Cette convention a deux avantages :

1. **Traçabilité** : En lisant `vars.yml`, tu sais immédiatement quelles variables sont des secrets (celles qui utilisent `{{ vault_... }}`).
2. **Recherche** : Tu peux faire un `grep vault_` dans le projet pour trouver toutes les références aux secrets.

**Convention 2 : Préfixer les fichiers chiffrés**

Si tu ne sépares pas les fichiers, une autre convention est de nommer les fichiers chiffrés de façon explicite :

```text
group_vars/
├── all.yml                   # Variables non sensibles
├── all_vault.yml             # Variables chiffrées
├── production.yml            # Variables non sensibles
└── production_vault.yml      # Variables chiffrées
```

---

## Commandes Utiles

| Commande                                                      | Action                                                           |
| ------------------------------------------------------------- | ---------------------------------------------------------------- |
| `ansible-vault encrypt fichier.yml`                           | Chiffrer un fichier entier                                       |
| `ansible-vault decrypt fichier.yml`                           | Déchiffrer un fichier (le remettre en clair)                     |
| `ansible-vault view fichier.yml`                              | Afficher le contenu déchiffré sans modifier le fichier           |
| `ansible-vault edit fichier.yml`                              | Ouvrir le fichier déchiffré dans un éditeur, rechiffrer à la fermeture |
| `ansible-vault rekey fichier.yml`                             | Changer le mot de passe Vault d'un fichier                       |
| `ansible-vault encrypt_string 'valeur' --name 'variable'`    | Chiffrer une variable individuelle                               |
| `ansible-playbook playbook.yml --ask-vault-pass`              | Exécuter un playbook en demandant le mot de passe Vault          |
| `ansible-playbook playbook.yml --vault-password-file .vault_pass` | Exécuter un playbook avec un fichier de mot de passe         |
| `ansible-vault encrypt fichier1.yml fichier2.yml`             | Chiffrer plusieurs fichiers d'un coup                            |
| `ansible-vault rekey fichier1.yml fichier2.yml`               | Changer le mot de passe de plusieurs fichiers d'un coup          |

---

## Pièges Fréquents

### Piège 1 : Commiter le fichier .vault_pass dans Git

**Problème** : Le fichier `.vault_pass` contient le mot de passe Vault en clair. Si tu le commites dans Git, tout membre ayant accès au dépôt peut déchiffrer tous les fichiers Vault. Cela annule complètement l'intérêt du chiffrement.

**Solution** : Ajoute `.vault_pass` à ton fichier `.gitignore` **avant** de créer le fichier `.vault_pass`.

```bash
# Ajoute .vault_pass au .gitignore
echo '.vault_pass' >> .gitignore

# Vérifie que .vault_pass n'est pas suivi par Git
git status
```

Si tu as déjà commité le fichier par erreur :

```bash
# Supprime le fichier du suivi Git (mais le conserve sur le disque)
git rm --cached .vault_pass

# Commite la suppression
git commit -m "Supprime .vault_pass du suivi Git"
```

**Attention** : Même après suppression, le fichier reste dans l'historique Git. Si le dépôt est partagé, change immédiatement le mot de passe Vault (`ansible-vault rekey`).

---

### Piège 2 : Oublier --ask-vault-pass lors de l'exécution du playbook

**Problème** : Tu exécutes un playbook qui utilise des fichiers Vault, mais tu ne fournis pas le mot de passe Vault. L'exécution échoue immédiatement.

**Message d'erreur** :

```text
ERROR! Attempting to decrypt but no vault secrets found
```

**Solution** : Ajoute `--ask-vault-pass` à la commande, ou configure `vault_password_file` dans `ansible.cfg` (voir Étape 9).

```bash
# Solution immédiate
ansible-playbook deploy.yml --ask-vault-pass

# Solution permanente : configurer ansible.cfg
# vault_password_file = .vault_pass
```

---

### Piège 3 : Chiffrer avec un mot de passe, déchiffrer avec un autre

**Problème** : Tu chiffres un fichier avec un mot de passe, puis tu essaies de le déchiffrer (ou d'exécuter un playbook) avec un mot de passe différent. L'opération échoue.

**Message d'erreur** :

```text
ERROR! Decryption failed (no vault secrets would found that could decrypt)
```

ou :

```text
ERROR! Attempting to decrypt but no vault secrets found
```

**Solution** : Utilise le même mot de passe que celui qui a servi au chiffrement. Si tu ne te souviens plus du mot de passe, il n'existe aucun moyen de récupérer les données. AES-256 est un algorithme de chiffrement fort : sans le mot de passe, les données sont perdues.

**Prévention** : Note le mot de passe Vault dans un gestionnaire de mots de passe (KeePass, Bitwarden, 1Password). Ne le stocke pas dans un fichier texte non protégé.

---

### Piège 4 : Chiffrer un fichier entier alors qu'une seule variable est sensible

**Problème** : Tu chiffres un fichier contenant 20 variables alors qu'une seule est un mot de passe. Résultat :

- `git diff` est inutilisable (tout le fichier change à chaque modification)
- Les revues de code sont impossibles
- Tu dois utiliser `ansible-vault edit` pour modifier une simple variable non sensible

**Solution** : Utilise `encrypt_string` pour chiffrer uniquement les variables sensibles, ou sépare les variables en deux fichiers (`vars.yml` et `vault.yml`).

```yaml
---
# ❌ Incorrect : tout le fichier est chiffré alors qu'une seule variable est sensible
# (fichier chiffré entièrement avec ansible-vault encrypt)
app_name: "mon-application"
app_port: 8080
db_host: "localhost"
db_password: "SuperSecret123!"

# ✅ Correct : seul le mot de passe est chiffré
app_name: "mon-application"
app_port: 8080
db_host: "localhost"
db_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          (valeur chiffrée)
```

---

### Piège 5 : Perdre le mot de passe Vault

**Problème** : Tu perds le mot de passe Vault. Les fichiers chiffrés sont inaccessibles. AES-256 n'a pas de "mot de passe oublié". Il n'existe aucune backdoor, aucune procédure de récupération.

**Solution** : Il n'y a pas de solution de récupération. La seule option est de recréer les secrets (nouveaux mots de passe de base de données, nouvelles clés API, etc.) et de chiffrer de nouveaux fichiers.

**Prévention** :

- Stocke le mot de passe Vault dans un gestionnaire de mots de passe sécurisé
- Assure-toi qu'au moins deux personnes de l'équipe connaissent le mot de passe (ou ont accès au gestionnaire de mots de passe)
- Documente la procédure de changement de mot de passe Vault dans le README du projet

---

## Checklist de Validation

- [ ] J'ai chiffré un fichier entier avec `ansible-vault encrypt`
- [ ] J'ai visualisé un fichier chiffré avec `ansible-vault view`
- [ ] J'ai modifié un fichier chiffré avec `ansible-vault edit`
- [ ] J'ai déchiffré un fichier avec `ansible-vault decrypt`
- [ ] J'ai utilisé `encrypt_string` pour chiffrer une variable individuelle
- [ ] J'ai copié une variable chiffrée avec `encrypt_string` dans un fichier YAML
- [ ] J'ai exécuté un playbook utilisant des secrets Vault avec `--ask-vault-pass`
- [ ] J'ai créé un fichier `.vault_pass` et l'ai ajouté au `.gitignore`
- [ ] J'ai configuré `vault_password_file` dans `ansible.cfg`
- [ ] J'ai exécuté un playbook sans `--ask-vault-pass` grâce à la configuration `ansible.cfg`
- [ ] J'ai changé le mot de passe Vault avec `ansible-vault rekey`

---

## Exercice Pratique

**Énoncé** : Configure un déploiement sécurisé d'une application web en utilisant Ansible Vault pour protéger les données sensibles.

Le projet doit avoir la structure suivante :

```text
exercice-vault/
├── ansible.cfg
├── inventory.ini
├── deploy-app.yml
├── templates/
│   └── app-config.j2
├── group_vars/
│   └── all/
│       ├── vars.yml
│       └── vault.yml
├── .vault_pass
└── .gitignore
```

**Tâches à réaliser** :

**Partie A : Créer les fichiers de secrets**

1. Crée le répertoire `exercice-vault/` et les sous-répertoires nécessaires

2. Crée un fichier `group_vars/all/vault.yml` contenant :
   - `vault_db_password` : un mot de passe de base de données de ton choix
   - `vault_api_key` : une clé API fictive de ton choix
   - `vault_smtp_password` : un mot de passe SMTP fictif de ton choix

3. Chiffre le fichier `vault.yml` avec `ansible-vault encrypt`

---

**Partie B : Créer les fichiers de variables**

1. Crée un fichier `group_vars/all/vars.yml` contenant :

   Variables en clair :

   - `app_name` : `"exercice-vault-app"`
   - `app_port` : `3000`
   - `db_host` : `"localhost"`
   - `db_name` : `"exercice_db"`
   - `db_user` : `"app_user"`

   Références aux secrets :

   - `db_password` : `"{{ vault_db_password }}"`
   - `api_key` : `"{{ vault_api_key }}"`
   - `smtp_password` : `"{{ vault_smtp_password }}"`

---

**Partie C : Créer le playbook et le template**

1. Crée un template `templates/app-config.j2` qui génère un fichier de configuration YAML contenant toutes les variables (nom de l'application, base de données, clé API, SMTP)

2. Crée un playbook `deploy-app.yml` qui :
   - Crée le répertoire `/etc/exercice-vault-app/`
   - Déploie le fichier de configuration depuis le template
   - Applique les permissions `0640` au fichier de configuration

---

**Partie D : Configurer et exécuter**

1. Crée un fichier `.vault_pass` contenant le mot de passe Vault
2. Configure `ansible.cfg` pour utiliser le fichier `.vault_pass` automatiquement
3. Crée un `.gitignore` contenant `.vault_pass`
4. Exécute le playbook et vérifie que le fichier de configuration sur la machine cible contient les mots de passe en clair

**Indications** :

- Utilise le module `ansible.builtin.file` pour créer le répertoire
- Utilise le module `ansible.builtin.template` pour déployer le fichier de configuration
- Le template doit utiliser les variables `{{ db_password }}`, `{{ api_key }}` et `{{ smtp_password }}` (pas les variables `vault_`)
- Vérifie le fichier généré sur la machine cible avec `cat /etc/exercice-vault-app/config.yml`

**Résultat attendu** :

Après exécution du playbook, le fichier `/etc/exercice-vault-app/config.yml` sur la machine cible doit contenir les mots de passe en clair (car le template est rendu avec les valeurs déchiffrées) :

```text
# Configuration de l'application exercice-vault-app
# Généré par Ansible - ne pas modifier manuellement
app:
  name: "exercice-vault-app"
  port: 3000

database:
  host: "localhost"
  name: "exercice_db"
  user: "app_user"
  password: "(ton mot de passe ici)"

api:
  key: "(ta clé API ici)"

smtp:
  password: "(ton mot de passe SMTP ici)"
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer la structure du projet**

```bash
# Crée le répertoire principal et les sous-répertoires
mkdir -p exercice-vault/templates
mkdir -p exercice-vault/group_vars/all
```

**Étape 2 : Créer le fichier vault.yml (avant chiffrement)**

```bash
# Crée le fichier contenant les secrets en clair (sera chiffré ensuite)
cat > exercice-vault/group_vars/all/vault.yml << 'EOF'
---
vault_db_password: "M0nSuperM0tDePasse!"
vault_api_key: "sk-exercice-abc123def456ghi789"
vault_smtp_password: "SmtpP@ss2024"
EOF
```

**Étape 3 : Chiffrer vault.yml**

```bash
# Chiffre le fichier avec Ansible Vault
cd exercice-vault
ansible-vault encrypt group_vars/all/vault.yml
```

**Résultat attendu** :

```text
New Vault password:
Confirm New Vault password:
Encryption successful
```

**Étape 4 : Créer le fichier vars.yml**

```bash
# Crée le fichier de variables non sensibles
cat > group_vars/all/vars.yml << 'EOF'
---
# Variables non sensibles
app_name: "exercice-vault-app"
app_port: 3000
db_host: "localhost"
db_name: "exercice_db"
db_user: "app_user"

# Références aux variables chiffrées dans vault.yml
db_password: "{{ vault_db_password }}"
api_key: "{{ vault_api_key }}"
smtp_password: "{{ vault_smtp_password }}"
EOF
```

**Étape 5 : Créer le template**

```bash
# Crée le template Jinja2 pour le fichier de configuration
cat > templates/app-config.j2 << 'EOF'
# Configuration de l'application {{ app_name }}
# Généré par Ansible - ne pas modifier manuellement
app:
  name: "{{ app_name }}"
  port: {{ app_port }}

database:
  host: "{{ db_host }}"
  name: "{{ db_name }}"
  user: "{{ db_user }}"
  password: "{{ db_password }}"

api:
  key: "{{ api_key }}"

smtp:
  password: "{{ smtp_password }}"
EOF
```

**Étape 6 : Créer le playbook**

```bash
# Crée le playbook de déploiement
cat > deploy-app.yml << 'EOF'
---
- name: Déployer la configuration sécurisée de l'application
  hosts: all
  become: true
  tasks:
    - name: Créer le répertoire de configuration
      ansible.builtin.file:
        path: /etc/exercice-vault-app
        state: directory
        owner: root
        group: root
        mode: "0755"

    - name: Déployer le fichier de configuration depuis le template
      ansible.builtin.template:
        src: templates/app-config.j2
        dest: /etc/exercice-vault-app/config.yml
        owner: root
        group: root
        mode: "0640"
EOF
```

Le playbook n'a pas besoin de `vars_files` car les fichiers dans `group_vars/all/` sont chargés automatiquement par Ansible.

**Étape 7 : Créer le fichier .vault_pass**

```bash
# Crée le fichier de mot de passe Vault
# Utilise le même mot de passe que celui saisi à l'étape 3
echo 'MonMotDePasseVault' > .vault_pass

# Restreindre les permissions
chmod 600 .vault_pass
```

**Étape 8 : Configurer ansible.cfg**

```bash
# Crée le fichier ansible.cfg
cat > ansible.cfg << 'EOF'
[defaults]
inventory = inventory.ini
vault_password_file = .vault_pass
EOF
```

**Étape 9 : Créer le .gitignore**

```bash
# Crée le fichier .gitignore
cat > .gitignore << 'EOF'
.vault_pass
EOF
```

**Étape 10 : Créer un fichier d'inventaire minimal**

```bash
# Crée un fichier d'inventaire avec tes machines
cat > inventory.ini << 'EOF'
[all]
web1 ansible_host=192.168.56.11 ansible_user=deploy
EOF
```

Adapte l'adresse IP et le nom d'utilisateur à tes machines.

**Étape 11 : Exécuter le playbook**

```bash
# Exécute le playbook (le mot de passe Vault est lu depuis .vault_pass)
ansible-playbook deploy-app.yml
```

**Résultat attendu** :

```text
PLAY [Déployer la configuration sécurisée de l'application] ********************

TASK [Gathering Facts] *********************************************************
ok: [web1]

TASK [Créer le répertoire de configuration] ************************************
changed: [web1]

TASK [Déployer le fichier de configuration depuis le template] *****************
changed: [web1]

PLAY RECAP *********************************************************************
web1                       : ok=3    changed=2    unreachable=0    failed=0    skipped=0
```

**Étape 12 : Vérifier le résultat sur la machine cible**

```bash
# Vérifie le contenu du fichier de configuration sur la machine cible
ansible all -m command -a "cat /etc/exercice-vault-app/config.yml" --become
```

**Résultat attendu** :

```text
web1 | CHANGED | rc=0 >>
# Configuration de l'application exercice-vault-app
# Généré par Ansible - ne pas modifier manuellement
app:
  name: "exercice-vault-app"
  port: 3000

database:
  host: "localhost"
  name: "exercice_db"
  user: "app_user"
  password: "M0nSuperM0tDePasse!"

api:
  key: "sk-exercice-abc123def456ghi789"

smtp:
  password: "SmtpP@ss2024"
```

Les mots de passe sont en clair dans le fichier de configuration de la machine cible. C'est le comportement attendu : Vault protège les secrets dans le dépôt Git, pas sur les machines de destination.

**Structure finale du projet** :

```text
exercice-vault/
├── ansible.cfg              # Configuration Ansible (vault_password_file)
├── inventory.ini            # Inventaire des machines
├── deploy-app.yml           # Playbook de déploiement
├── templates/
│   └── app-config.j2        # Template du fichier de configuration
├── group_vars/
│   └── all/
│       ├── vars.yml          # Variables non sensibles + références vault_
│       └── vault.yml         # Variables chiffrées avec Ansible Vault
├── .vault_pass              # Mot de passe Vault (NON commité)
└── .gitignore               # Exclut .vault_pass du dépôt Git
```

---

## Navigation

← Fiche précédente : **[Ansible Galaxy](11-ansible-galaxy.md)**

→ Fiche suivante : **[Gestion Multi-Environnement](13-gestion-multi-environnement.md)**
