---
tags:
  - EasyAdmin
  - Intermédiaire
  - Pratique
description: "Sécuriser l'administration avec l'authentification"
estimated_time: "75 min"
fiche_number: 3
total_fiches: 7
cursus: "EasyAdmin"
---

# 03 - Sécuriser l'administration avec l'authentification

> **En bref** : À la fin de cette fiche, tu sauras installer le système de sécurité de Symfony, créer une page de connexion, et restreindre l'accès à ton interface d'administration pour que seuls les administrateurs puissent y accéder. Lecture estimée : 75 min.


## Prérequis

- Avoir complété la fiche **[02 - Champs avancés et organisation des formulaires EasyAdmin](02-easyadmin-champs-avances.md)**
- Avoir les conteneurs Docker en cours d'exécution (`docker compose up -d`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Symfony Security | 7.4 |
| EasyAdmin | 4.x |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer le système de sécurité de Symfony, créer une page de connexion, et restreindre l'accès à ton interface d'administration pour que seuls les administrateurs puissent y accéder.

---

## Concepts

### Authentification vs Autorisation

En sécurité informatique, on distingue deux concepts fondamentaux que les débutants confondent régulièrement :

1. **Authentification (Qui es-tu ?)** : C'est la vérification de ton identité.
    - **Analogie concrète** : C'est comme montrer ta carte d'identité au vigile à l'entrée d'une boîte de nuit. Le vigile vérifie que la photo correspond à ton visage.

2. **Autorisation (Que peux-tu faire ?)** : C'est la vérification de tes droits d'accès.
    - **Analogie concrète** : Une fois entré, le bracelet VIP te donne le droit d'accéder au carré VIP. Ceux qui n'ont pas le bracelet peuvent entrer dans la boîte (authentifiés) mais pas dans la zone VIP (non autorisés).

### L'Entité User

Dans Symfony, l'utilisateur n'est pas juste un "client". C'est une **classe PHP** (Entité) qui représente **toute personne capable de se connecter** à l'application.

- Un administrateur est un `User`.
- Un client est un `User`.
- Un modérateur est un `User`.

Ce qui les différencie, ce sont leurs **Rôles** (le bracelet VIP).

**Analogie concrète** : Imagine un carnet d'adresses partagé dans une entreprise. Chaque fiche du carnet représente une personne (un `User`). Toutes les fiches ont le même format (nom, email, mot de passe), mais chaque fiche porte une étiquette de couleur : rouge pour "Administrateur", bleue pour "Client", verte pour "Modérateur". C'est cette étiquette (le rôle) qui détermine ce que la personne peut faire, pas la fiche elle-même.

### Le Hachage des mots de passe

⚠️ **Règle d'or** : On ne stocke **JAMAIS** les mots de passe en clair dans la base de données.

Si tu stockes le mot de passe "soleil123" tel quel, n'importe qui ayant accès à la base de données peut le lire et voler le compte.

À la place, on "hache" le mot de passe. C'est une transformation mathématique irréversible.

- Mot de passe : `soleil123`
- Hash (en base de données) : `$2y$13$J5...`

Quand l'utilisateur se connecte :

1. Il tape `soleil123`.
2. Le système hache ce qu'il vient de taper.
3. Le système compare ce nouveau hash avec celui stocké en base.
4. S'ils sont identiques, c'est le bon mot de passe.

**Analogie concrète** : C'est comme réduire une pomme en compote. Tu peux facilement faire de la compote avec une pomme, mais il est impossible de refaire la pomme à partir de la compote. Pour vérifier si une autre pomme est identique, tu la réduis aussi en compote et tu compares les deux compotes.

---

## Étapes Pratiques

### Partie 1 : Installer le Security Bundle

Si ce n'est pas déjà fait, tu dois installer le composant de sécurité de Symfony.

#### Étape 1.1 : Entrer dans le conteneur

```bash
docker compose exec php bash
```

#### Étape 1.2 : Installer le paquet

```bash
composer require symfony/security-bundle
```

**Résultat attendu** : Composer installe le paquet et Symfony configure automatiquement les fichiers nécessaires (`config/packages/security.yaml`).

---


### Partie 2 : Créer l'entité User

Tu vas créer la classe qui représentera les utilisateurs.

#### Étape 2.1 : Lancer la commande make:user

```bash
php bin/console make:user
```

#### Étape 2.2 : Répondre aux questions

```text
The name of the security user class (e.g. User) [User]:
> 
```

Appuie sur Entrée pour accepter `User`.

```text
Do you want to store user data in the database (via Doctrine)? (yes/no) [yes]:
> 
```

Appuie sur Entrée pour accepter `yes`.

```text
Enter the property name that will be the unique display name for the user (e.g. email, username, uuid) [email]:
> 
```

Appuie sur Entrée pour accepter `email`.

```text
Will this app need to hash/check user passwords? (yes/no) [yes]:
> 
```

Appuie sur Entrée pour accepter `yes`.

**Résultat attendu** :

```text
 created: src/Entity/User.php
 created: src/Repository/UserRepository.php
 updated: src/Entity/User.php
 updated: config/packages/security.yaml
```

---


### Partie 3 : Créer le système de connexion

Symfony peut générer le contrôleur, le template et la configuration `form_login` nécessaires pour la page de connexion.

> **Note** : La commande historique `make:auth` est **dépréciée** depuis MakerBundle 1.59. La commande officielle actuelle (documentation Symfony Security) est `make:security:form-login`. Elle configure l'authenticator intégré `form_login` : elle ne crée plus de classe `AppAuthenticator.php`.

#### Étape 3.1 : Lancer make:security:form-login

```bash
php bin/console make:security:form-login
```

#### Étape 3.2 : Répondre aux questions

```text
Choose a name for the controller class (e.g. SecurityController) [SecurityController]:
> 
```

Appuie sur Entrée pour accepter `SecurityController`.

```text
Do you want to generate a '/logout' URL? (yes/no) [yes]:
> 
```

Appuie sur Entrée.

Le wizard peut aussi te proposer de générer des tests. Réponds `no` si tu n'as pas encore le `symfony/test-pack`.

**Résultat attendu** :

```text
 created: src/Controller/SecurityController.php
 created: templates/security/login.html.twig
 updated: config/packages/security.yaml
```

La configuration `security.yaml` contient maintenant un bloc `form_login` (chemins `app_login`) et, si tu as accepté, un bloc `logout`.

---


### Partie 4 : Mettre à jour la base de données

Tu as créé l'entité `User`, maintenant il faut créer la table correspondante.

#### Étape 4.1 : Créer la migration

```bash
php bin/console make:migration
```

#### Étape 4.2 : Exécuter la migration

```bash
php bin/console doctrine:migrations:migrate
```

---


### Partie 5 : Créer un premier Administrateur

C'est le problème de l'œuf et de la poule : pour créer un utilisateur via l'admin, il faut être admin. Pour être admin, il faut un utilisateur.

Tu vas créer une **commande personnalisée** pour créer ton premier utilisateur via le terminal.

#### Étape 5.1 : Générer la commande

```bash
php bin/console make:command
```

**Question** :

```text
Choose the command name (e.g. app:create-user) [app:create-user]:
> app:create-admin
```

Tape `app:create-admin`.

#### Étape 5.2 : Écrire le code de la commande

Ouvre le fichier `src/Command/CreateAdminCommand.php` et remplace son contenu par :

```php
<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée un nouvel administrateur',
)]
class CreateAdminCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'L\'email de l\'utilisateur')
            ->addArgument('password', InputArgument::REQUIRED, 'Le mot de passe')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');

        // Création de l'utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_ADMIN']); // On lui donne le rôle ADMIN

        // Hachage du mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        // Sauvegarde en base
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $io->success(sprintf('L\'administrateur %s a été créé avec succès.', $email));

        return Command::SUCCESS;
    }
}
```

#### Étape 5.3 : Utiliser la commande

Toujours dans le conteneur, lance ta nouvelle commande :

```bash
php bin/console app:create-admin admin@example.com motdepasse123
```

**Résultat attendu** :

```text
 [OK] L'administrateur admin@example.com a été créé avec succès.
```

---


### Partie 6 : Restreindre l'accès à EasyAdmin

Maintenant que tu as une porte (le login) et une clé (l'utilisateur admin), tu peux verrouiller l'entrée de l'administration.

#### Étape 6.1 : Configurer security.yaml

Ouvre le fichier `config/packages/security.yaml`.

Cherche la section `access_control`. Par défaut, Symfony la génère commentée. Décommente ou ajoute la ligne suivante :

```yaml
    access_control:
        # Nécessite le rôle ADMIN pour accéder à tout ce qui commence par /admin
        - { path: ^/admin, roles: ROLE_ADMIN }
```

**Explication** :

- `path: ^/admin` : "Toutes les URLs qui commencent par /admin"
- `roles: ROLE_ADMIN` : "Il faut avoir le badge ROLE_ADMIN pour entrer"

---


### Partie 7 : Tester la sécurité

#### Étape 7.1 : Sortir du conteneur

```bash
exit
```

#### Étape 7.2 : Tester l'accès direct (Échec attendu)

1. Ouvre ton navigateur en mode **Navigation Privée** (pour être sûr de ne pas être déjà connecté).
2. Tente d'accéder à `http://localhost:8080/admin`.

**Résultat attendu** : Tu es automatiquement redirigé vers `/login`. Tu ne peux plus accéder à l'admin directement.

#### Étape 7.3 : Se connecter

1. Sur la page de login, entre :
   - Email : `admin@example.com`
   - Password : `motdepasse123`
2. Clique sur "Sign in".

**Résultat attendu** : Tu es redirigé vers le Dashboard EasyAdmin.

---


### Partie 8 : Redirection après login

Par défaut, Symfony redirige vers la page d'accueil après le login. Avec `form_login`, la redirection se configure dans `security.yaml` (pas dans une classe authenticator personnalisée).

Ouvre `config/packages/security.yaml`.

Dans le firewall `main`, sous `form_login`, ajoute `default_target_path` :

```yaml
            form_login:
                login_path: app_login
                check_path: app_login
                default_target_path: admin
```

`admin` est le nom de route du Dashboard EasyAdmin (valeur par défaut). Vérifie-le dans `DashboardController.php` si tu l'as changé.

---

## Récapitulatif

Tu as sécurisé ton application :

1. **Entité User** : La structure pour stocker les utilisateurs.
2. **form_login** : L'authenticator intégré qui vérifie le mot de passe haché.
3. **Command** : Un outil pour créer le premier admin "par la porte de service".
4. **Access Control** : Le vigile qui empêche l'accès à `/admin` aux non-admins.

---

## Checklist de Validation

- [ ] Le Security Bundle est installé.
- [ ] L'entité User existe et la table est créée en base.
- [ ] La page `/login` s'affiche quand j'essaie d'aller sur `/admin`.
- [ ] Je peux me connecter avec l'utilisateur créé via la commande.
- [ ] Je ne peux pas accéder à l'admin sans être connecté.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:user` | Générer l'entité User avec l'interface de sécurité |
| `php bin/console make:security:form-login` | Générer le formulaire de login et configurer `form_login` |
| `php bin/console security:hash-password` | Hacher un mot de passe manuellement (utile pour vérifier) |
| `php bin/console debug:router` | Lister toutes les routes (vérifier que `/login` et `/logout` existent) |
| `php bin/console debug:config security` | Afficher la configuration de sécurité active |
| `php bin/console app:create-admin email password` | Créer un administrateur via la commande personnalisée |

---

## Pièges Fréquents

### Piège 1 : Stocker le mot de passe en clair

⚠️ **Problème** : Tu crées un utilisateur en SQL ou via un script en écrivant directement `INSERT INTO user (..., password) VALUES (..., 'motdepasse123')`. Le login échoue systématiquement, même avec le bon mot de passe.

✅ **Solution** : Le mot de passe doit **toujours** être haché avant d'être stocké. Utilise la commande `php bin/console security:hash-password` pour obtenir le hash, ou passe par la commande `app:create-admin` qui hache automatiquement.

```bash
# Générer un hash manuellement
php bin/console security:hash-password motdepasse123
```

### Piège 2 : Oublier ROLE_ADMIN dans security.yaml

⚠️ **Problème** : Tu te connectes avec le bon email et le bon mot de passe, mais tu obtiens une erreur 403 (Access Denied) en allant sur `/admin`.

✅ **Solution** : Vérifie deux choses :

1. L'utilisateur a bien le rôle `ROLE_ADMIN` dans sa propriété `roles` en base de données.
2. La section `access_control` dans `config/packages/security.yaml` contient bien la règle :

```yaml
access_control:
    - { path: ^/admin, roles: ROLE_ADMIN }
```

### Piège 3 : Le formulaire de login affiche une page blanche

⚠️ **Problème** : Tu vas sur `/login` et tu obtiens une page blanche ou une erreur Twig.

✅ **Solution** : Vérifie que le fichier `templates/security/login.html.twig` existe bien. Si tu l'as supprimé par erreur, relance `php bin/console make:security:form-login` pour le régénérer (réponds aux questions du wizard).

### Piège 4 : La redirection après login ne fonctionne pas

⚠️ **Problème** : Après connexion, tu es redirigé vers la page d'accueil `/` au lieu de `/admin`.

✅ **Solution** : Ajoute `default_target_path: admin` sous `form_login` dans `config/packages/security.yaml` :

```yaml
form_login:
    login_path: app_login
    check_path: app_login
    default_target_path: admin
```

---

## Exercice Pratique

**Énoncé** : Crée un second utilisateur avec le rôle `ROLE_EDITOR` (un rôle personnalisé) et vérifie que les restrictions d'accès fonctionnent correctement.

**Indications** :

- Modifie la commande `app:create-admin` pour accepter un troisième argument optionnel : le rôle (par défaut `ROLE_ADMIN`)
- Crée un utilisateur `editeur@example.com` avec le rôle `ROLE_EDITOR`
- Connecte-toi avec cet utilisateur et vérifie que l'accès à `/admin` est refusé (car seul `ROLE_ADMIN` est autorisé)

_Note : en EasyAdmin, toutes les pages partagent la même URL `/admin` (le CRUD ciblé est choisi par un paramètre interne, pas par le chemin). Comme `access_control` filtre uniquement le chemin, il ne peut pas autoriser une entité sans les autres. Restreindre l'éditeur aux seuls produits se fait côté PHP dans le CRUD (par exemple `#[IsGranted]` sur les actions ou un voter), ce qui sort du périmètre de cette fiche._

**Résultat attendu** : L'utilisateur `editeur@example.com` avec `ROLE_EDITOR` obtient une erreur 403 sur `/admin`, tandis que l'utilisateur `admin@example.com` avec `ROLE_ADMIN` y accède sans restriction.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 : Modifier la commande pour accepter un rôle

Ouvre `src/Command/CreateAdminCommand.php` et modifie-le :

```php
protected function configure(): void
{
    $this
        ->addArgument('email', InputArgument::REQUIRED, 'L\'email de l\'utilisateur')
        ->addArgument('password', InputArgument::REQUIRED, 'Le mot de passe')
        // Ajout du troisième argument optionnel
        ->addArgument('role', InputArgument::OPTIONAL, 'Le rôle (défaut: ROLE_ADMIN)', 'ROLE_ADMIN')
    ;
}

protected function execute(InputInterface $input, OutputInterface $output): int
{
    $io = new SymfonyStyle($input, $output);
    $email = $input->getArgument('email');
    $password = $input->getArgument('password');
    // Récupération du rôle (ROLE_ADMIN par défaut)
    $role = $input->getArgument('role');

    $user = new User();
    $user->setEmail($email);
    // On utilise le rôle passé en argument
    $user->setRoles([$role]);

    $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
    $user->setPassword($hashedPassword);

    $this->entityManager->persist($user);
    $this->entityManager->flush();

    $io->success(sprintf('L\'utilisateur %s avec le rôle %s a été créé.', $email, $role));

    return Command::SUCCESS;
}
```

### Étape 2 : Créer l'utilisateur éditeur

```bash
docker compose exec php bash
php bin/console app:create-admin editeur@example.com editeur123 ROLE_EDITOR
```

**Résultat attendu** :

```text
 [OK] L'utilisateur editeur@example.com avec le rôle ROLE_EDITOR a été créé.
```

### Étape 3 : Tester l'accès

1. Ouvre une fenêtre de navigation privée.
2. Va sur `http://localhost:8080/admin`.
3. Tu es redirigé vers `/login`.
4. Connecte-toi avec `editeur@example.com` / `editeur123`.
5. Tu obtiens une erreur **403 Access Denied**.

C'est le comportement attendu : `ROLE_EDITOR` n'est pas `ROLE_ADMIN`, donc `access_control` bloque l'accès.

### Étape 4 : Ouvrir tout `/admin` à `ROLE_EDITOR` (bonus)

Si tu veux donner à l'éditeur l'accès à l'admin, sache que `access_control` ouvre **tout** `/admin` d'un coup (il ne sait pas filtrer par entité). Avant cela, tu peux comprendre la hiérarchie des rôles dans `config/packages/security.yaml` :

```yaml
security:
    role_hierarchy:
        # ROLE_ADMIN hérite de ROLE_EDITOR (un admin peut faire tout ce qu'un éditeur peut faire)
        ROLE_ADMIN: ROLE_EDITOR
```

Cette hiérarchie ne donne PAS accès à `/admin` pour `ROLE_EDITOR`. Elle signifie uniquement que tout utilisateur ayant `ROLE_ADMIN` a automatiquement aussi `ROLE_EDITOR`.

Pour autoriser `ROLE_EDITOR` à accéder à l'admin, modifie `access_control` :

```yaml
access_control:
    - { path: ^/admin, roles: ROLE_EDITOR }
```

Avec cette règle, les utilisateurs ayant `ROLE_EDITOR` **ou** `ROLE_ADMIN` (qui hérite de `ROLE_EDITOR`) peuvent accéder à `/admin`.

---

## Navigation

← Fiche précédente : **[Champs avancés et organisation des formulaires EasyAdmin](02-easyadmin-champs-avances.md)**

→ Fiche suivante : **[Gestion avancée des utilisateurs dans EasyAdmin](04-easyadmin-utilisateurs.md)**
