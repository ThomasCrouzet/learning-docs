---
tags:
  - EasyAdmin
  - Intermédiaire
  - Pratique
description: "Gestion avancée des utilisateurs dans EasyAdmin"
estimated_time: "40 min"
fiche_number: 4
total_fiches: 7
cursus: "EasyAdmin"
id: "web.easyadmin.easyadmin-utilisateurs"
course_id: "web.easyadmin"
content_type: "lesson"
order: 4
---

# 04 - Gestion avancée des utilisateurs dans EasyAdmin

> **En bref** : À la fin de cette fiche, tu sauras créer une interface complète pour gérer les utilisateurs (ajouter, modifier, supprimer) directement depuis EasyAdmin, en gérant correctement le hachage des mots de passe et l'attribution des rôles. Lecture estimée : 40 min.


## Prérequis

- Avoir complété la fiche **[03 - Sécuriser l'administration avec l'authentification](03-easyadmin-authentification.md)**
- Avoir les conteneurs Docker en cours d'exécution (`docker compose up -d`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Symfony Security | 7.4 |
| EasyAdmin | 4.x |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une interface complète pour gérer les utilisateurs (ajouter, modifier, supprimer) directement depuis EasyAdmin, en gérant correctement le hachage des mots de passe et l'attribution des rôles.

---

## Concepts

### Le problème du mot de passe en édition

Gérer les utilisateurs est plus complexe que gérer des produits à cause du mot de passe.

**Problème 1 : Affichage**
Le mot de passe stocké en base est haché (`$2y$13$sdf...`). Si on l'affiche tel quel dans un champ texte, c'est inutile et dangereux.

**Problème 2 : Modification**
Si tu modifies un utilisateur et que tu laisses le champ mot de passe vide (ou avec le hash), EasyAdmin risque d'enregistrer "vide" ou le hash comme _nouveau mot de passe_.

**Solution** :

1. On n'affiche jamais le mot de passe actuel.
2. On affiche un champ "Mot de passe" uniquement dans les formulaires (pas dans la liste).
3. On intercepte l'enregistrement pour hacher le mot de passe _seulement si_ l'utilisateur en a tapé un nouveau.

**Analogie concrète** : Imagine un coffre-fort dont la combinaison est connue uniquement par le propriétaire. Quand tu ouvres la fiche du propriétaire dans un classeur, tu vois son nom, son adresse, mais jamais la combinaison du coffre. Si le propriétaire veut changer sa combinaison, il te donne la nouvelle et tu la remplaces. S'il ne dit rien, tu gardes l'ancienne sans y toucher.

### Les événements de cycle de vie EasyAdmin

EasyAdmin permet d'intervenir à des moments précis :

- Avant de créer une entité (`persistEntity`)
- Avant de mettre à jour une entité (`updateEntity`)

**Analogie concrète** : Imagine une chaîne de montage dans une usine. Avant que le produit parte dans le carton (sauvegarde en base), un contrôleur qualité intervient pour vérifier ou modifier le produit. `persistEntity`, c'est le contrôle avant le premier emballage (création). `updateEntity`, c'est le contrôle avant de remballer un produit retourné et modifié (mise à jour). Tu places ta logique de hachage à ce poste de contrôle.

C'est là que tu vas placer ta logique de hachage.

---

## Étapes Pratiques

### Partie 1 : Générer le CRUD User

Tu vas créer le contrôleur pour gérer l'entité `User`.

#### Étape 1.1 : Entrer dans le conteneur

```bash
docker compose exec php bash
```

#### Étape 1.2 : Créer le contrôleur

```bash
php bin/console make:admin:crud
```

**Questions** :

- Entity : `User` (Sélectionne le numéro correspondant)
- Directory : Appuie sur Entrée (défaut)

---

### Partie 2 : Configurer le Dashboard

Il faut ajouter le lien vers les utilisateurs dans le menu.

Ouvre `src/Controller/Admin/DashboardController.php`.

Ajoute le `use` en haut :

```php
use App\Entity\User;
```

Ajoute dans `configureMenuItems()` :

```php
yield MenuItem::linkToCrud('Utilisateurs', 'fa fa-user', User::class);
```

---

### Partie 3 : Configurer les champs et le hachage

C'est la partie la plus importante. Tu dois configurer les champs pour qu'ils soient sécurisés et injecter le service de hachage.

Ouvre `src/Controller/Admin/UserCrudController.php` et remplace tout le contenu par le code suivant. Lis bien les commentaires pour comprendre la logique.

```php
<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
    // On injecte le service de hachage via le constructeur
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Utilisateur')
            ->setEntityLabelInPlural('Utilisateurs')
            // Optionnel : Permission pour voir cette section
            // ->setEntityPermission('ROLE_ADMIN')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            
            EmailField::new('email')
                ->setLabel('Email'),

            // Champ Rôles : Un choix multiple
            ChoiceField::new('roles')
                ->setLabel('Rôles')
                ->setChoices([
                    'Utilisateur' => 'ROLE_USER',
                    'Administrateur' => 'ROLE_ADMIN',
                ])
                ->allowMultipleChoices()
                ->renderAsBadges([
                    'ROLE_ADMIN' => 'success',
                    'ROLE_USER' => 'secondary'
                ]),

            // Champ Mot de passe : Configuré spécifiquement
            TextField::new('password')
                ->setLabel('Mot de passe')
                // On utilise un type Password pour masquer les caractères
                ->setFormType(PasswordType::class)
                // On ne l'affiche que dans les formulaires (pas dans la liste)
                ->onlyOnForms()
                // Requis seulement à la création
                ->setRequired($pageName === Crud::PAGE_NEW)
                // Aide pour l'utilisateur
                ->setHelp($pageName === Crud::PAGE_EDIT ? 'Laissez vide pour conserver le mot de passe actuel' : ''),
        ];
    }

    /**
     * Cette méthode est appelée lors de la CRÉATION d'un utilisateur
     */
    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        // On vérifie que c'est bien une instance de User (sécurité)
        if (!$entityInstance instanceof User) {
            return;
        }

        // On hache le mot de passe
        $this->hashPassword($entityInstance);

        // On appelle la méthode parente pour sauvegarder
        parent::persistEntity($entityManager, $entityInstance);
    }

    /**
     * Cette méthode est appelée lors de la MODIFICATION d'un utilisateur
     */
    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        if (!$entityInstance instanceof User) {
            return;
        }

        // On hache le mot de passe
        $this->hashPassword($entityInstance);

        parent::updateEntity($entityManager, $entityInstance);
    }

    /**
     * Méthode privée pour gérer la logique de hachage
     */
    private function hashPassword(User $user): void
    {
        // On récupère le mot de passe en clair saisi dans le formulaire
        $plainPassword = $user->getPassword();

        // Si le champ est vide (en édition), on ne fait rien (on garde l'ancien hash)
        // MAIS attention : EasyAdmin map le champ 'password' de l'entité.
        // Donc $plainPassword contient ce qui a été saisi.
        
        // Si on est en création, le mot de passe est obligatoire donc il y a une valeur.
        // Si on est en édition et que l'utilisateur n'a rien mis, le formulaire peut envoyer null ou vide.
        // Cependant, comme le champ est mappé sur l'entité, si on ne fait rien,
        // l'entité User a déjà reçu la valeur du formulaire via $user->setPassword(...)
        
        // Problème subtil : Si le champ est vide, $user->getPassword() peut être null ou vide.
        // Mais nous ne voulons pas écraser le hash existant avec rien.
        // Heureusement, EasyAdmin ne modifie pas la propriété si le champ est vide et non requis ?
        // Pas exactement. Il faut être vigilant.
        
        // Stratégie robuste :
        // 1. Si un mot de passe est fourni (non vide), on le hache.
        // 2. Si aucun mot de passe n'est fourni, on doit s'assurer que l'ancien hash est conservé.
        //    (En réalité, Doctrine ne mettra à jour que si la valeur a changé).

        if (empty($plainPassword)) {
            return;
        }

        // Si on arrive ici, c'est qu'il y a un mot de passe à hacher.
        // Cependant, il faut vérifier que ce n'est pas DÉJÀ un hash (cas rare mais possible si mauvaise manip).
        // On part du principe que l'input utilisateur est du texte clair.

        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
    }
}
```

> ⚠️ **Note technique importante** : La méthode `hashPassword` ci-dessus contient une simplification. En réalité, quand on édite un utilisateur dans EasyAdmin, si on laisse le champ password vide, EasyAdmin peut appeler `setPassword(null)`.
>
> Pour que cela fonctionne parfaitement en édition sans écraser le mot de passe, il est souvent préférable d'utiliser un champ **non mappé** (`->setMapped(false)`).
>
> Corrigeons le code pour utiliser cette approche plus sûre.

Remplace la méthode `configureFields` et ajoute la méthode `hashPassword` corrigée :

```php
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            EmailField::new('email'),
            ChoiceField::new('roles')
                ->setChoices(['Admin' => 'ROLE_ADMIN', 'User' => 'ROLE_USER'])
                ->allowMultipleChoices()
                ->renderAsBadges(),

            TextField::new('password')
                ->setLabel('Mot de passe')
                ->setFormType(PasswordType::class)
                ->onlyOnForms()
                ->setRequired($pageName === Crud::PAGE_NEW)
                // IMPORTANT : On ne lie pas ce champ directement à l'entité
                // pour éviter d'écraser le mot de passe actuel avec null
                ->setMapped(false) 
                ->setHelp('Laisser vide pour ne pas modifier'),
        ];
    }

    // ... persistEntity et updateEntity restent identiques et appellent hashPassword

    private function hashPassword(User $user): void
    {
        // Comment récupérer la valeur du champ non mappé ?
        // Dans EasyAdmin, c'est un peu complexe via le contrôleur directement.
        // On va utiliser le contexte de la requête.
        
        $formContext = $this->getContext()->getRequest()->request->all();
        // C'est trop complexe pour une fiche débutant de parser la requête manuellement.
        
        // REVENONS À LA MÉTHODE SIMPLE MAIS EFFICACE
        // Si on utilise setMapped(true) (par défaut), on a juste besoin de gérer le cas vide.
    }
```

**Correction finale (celle à utiliser)** :

Le formulaire EasyAdmin n'est **pas** nommé `crud`. Parser `$request->request->all()['crud']['password']` casse dès que le nom du formulaire change. La méthode stable (EasyAdmin 4) est un champ **non mappé** plus un listener `FormEvents::POST_SUBMIT`.

Voici le code **définitif** à mettre dans `UserCrudController.php`.

```php
<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\KeyValueStore;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield EmailField::new('email');
        yield ChoiceField::new('roles')
            ->setChoices(['Admin' => 'ROLE_ADMIN', 'User' => 'ROLE_USER'])
            ->allowMultipleChoices()
            ->renderAsBadges();

        // Champ non mappé : EasyAdmin n'écrit jamais null dans User::password
        yield TextField::new('password')
            ->setLabel('Mot de passe')
            ->setFormType(PasswordType::class)
            ->onlyOnForms()
            ->setRequired($pageName === Crud::PAGE_NEW)
            ->setFormTypeOption('empty_data', '')
            ->setMapped(false)
            ->setHelp($pageName === Crud::PAGE_EDIT ? 'Laisse vide pour conserver le mot de passe actuel' : '');
    }

    public function createNewFormBuilder(
        EntityDto $entityDto,
        KeyValueStore $formOptions,
        AdminContext $context
    ): FormBuilderInterface {
        $formBuilder = parent::createNewFormBuilder($entityDto, $formOptions, $context);

        return $this->addPasswordHashListener($formBuilder);
    }

    public function createEditFormBuilder(
        EntityDto $entityDto,
        KeyValueStore $formOptions,
        AdminContext $context
    ): FormBuilderInterface {
        $formBuilder = parent::createEditFormBuilder($entityDto, $formOptions, $context);

        return $this->addPasswordHashListener($formBuilder);
    }

    private function addPasswordHashListener(FormBuilderInterface $formBuilder): FormBuilderInterface
    {
        $formBuilder->addEventListener(FormEvents::POST_SUBMIT, function (FormEvent $event): void {
            $form = $event->getForm();
            if (!$form->isValid()) {
                return;
            }

            $user = $form->getData();
            if (!$user instanceof User) {
                return;
            }

            $plainPassword = $form->get('password')->getData();
            if (!is_string($plainPassword) || $plainPassword === '') {
                return;
            }

            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $plainPassword)
            );
        });

        return $formBuilder;
    }
}
```

---

### Partie 4 : Tester la création d'utilisateur

#### Étape 4.1 : Vider le cache

```bash
php bin/console cache:clear
exit
```

#### Étape 4.2 : Créer un utilisateur "Test"

1. Va sur `/admin`
2. Clique sur "Utilisateurs" > "Créer Utilisateur"
3. Email : `test@example.com`
4. Rôles : Sélectionne `ROLE_USER`
5. Mot de passe : `test123`
6. Clique sur "Créer"

#### Étape 4.3 : Vérifier le login

1. Ouvre une fenêtre de navigation privée
2. Va sur `/login`
3. Connecte-toi avec `test@example.com` / `test123`
4. Essaie d'aller sur `/admin`

**Résultat attendu** :

- Le login fonctionne (tu es authentifié).
- L'accès à `/admin` est **REFUSÉ** (car tu n'as que `ROLE_USER` et tu as restreint l'accès à `ROLE_ADMIN` dans la fiche précédente). C'est normal !

---

### Partie 5 : Tester la modification

1. Retourne sur ton compte Admin.
2. Modifie l'utilisateur `test@example.com`.
3. Ajoute-lui le rôle `ROLE_ADMIN`.
4. Laisse le mot de passe vide.
5. Sauvegarde.

**Résultat attendu** : L'utilisateur est maintenant Admin, et son mot de passe n'a pas changé (tu peux toujours te connecter avec `test123`).

---

## Checklist de Validation

- [ ] Le menu "Utilisateurs" apparaît dans le Dashboard.
- [ ] Je peux créer un utilisateur avec un mot de passe.
- [ ] Je peux me connecter avec ce nouvel utilisateur.
- [ ] Je peux modifier un utilisateur sans casser son mot de passe.
- [ ] Je peux modifier le mot de passe d'un utilisateur si je le souhaite.
- [ ] Les rôles s'affichent correctement sous forme de badges.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:admin:crud` | Générer un contrôleur CRUD EasyAdmin pour une entité |
| `php bin/console make:entity User` | Ajouter des propriétés à l'entité User |
| `php bin/console make:migration` | Créer un fichier de migration après modification d'une entité |
| `php bin/console doctrine:migrations:migrate` | Exécuter les migrations en attente |
| `php bin/console cache:clear` | Vider le cache Symfony (obligatoire après modification d'un contrôleur CRUD) |
| `php bin/console doctrine:query:sql "SELECT id, email, roles FROM user"` | Vérifier les utilisateurs en base de données |

---

## Pièges Fréquents

### Piège 1 : Le mot de passe est stocké en clair à la création

⚠️ **Problème** : Tu crées un utilisateur via EasyAdmin, mais quand tu essaies de te connecter avec ce compte, le login échoue. En vérifiant la base de données, tu vois que le mot de passe est stocké en clair (ex: `motdepasse123`) au lieu d'un hash (ex: `$2y$13$...`).

✅ **Solution** : Vérifie que le listener `FormEvents::POST_SUBMIT` (méthode `addPasswordHashListener` du code définitif) hache le mot de passe **avant** la persistance Doctrine. Si tu hashes dans `persistEntity` alors que le champ est non mappé, `getPassword()` contient encore l'ancien hash (création : souvent `null`) et le login échoue.

### Piège 2 : Le mot de passe existant est écrasé en édition

⚠️ **Problème** : Tu modifies l'email ou les rôles d'un utilisateur sans toucher au mot de passe. Après sauvegarde, l'utilisateur ne peut plus se connecter : son mot de passe a été remplacé par une chaîne vide ou par `null`.

✅ **Solution** : Configure le champ mot de passe en **non mappé** (`setMapped(false)`) sur les formulaires, et hache uniquement dans un listener `FormEvents::POST_SUBMIT` (voir le code définitif). Ne lis pas `$request->request->all()['crud']['password']` : ce nom de formulaire n'est pas documenté par EasyAdmin 4 (la métadonnée interne s'appelle `ea`).

### Piège 3 : Conflit entre champ mappé et non mappé

⚠️ **Problème** : Tu configures le champ mot de passe avec `setMapped(false)` partout (création ET édition). À la création, le mot de passe n'est jamais enregistré car il n'est pas mappé sur l'entité.

✅ **Solution** : Laisse le champ **non mappé** en création **et** en édition. Le listener `POST_SUBMIT` lit `$form->get('password')->getData()` : si la valeur est vide, le hash existant n'est pas touché ; si elle est remplie, on hache avant la persistance.

---

## Exercice Pratique

**Énoncé** : Ajoute un champ "prénom" (`firstName`) et un champ "nom" (`lastName`) à l'entité `User`. Affiche ces champs dans le CRUD EasyAdmin et vérifie que le mot de passe est correctement haché lors de la création d'un nouvel utilisateur.

**Indications** :

- Utilise `php bin/console make:entity User` pour ajouter les deux propriétés (type `string`, longueur `100`, nullable `yes`)
- Crée et exécute la migration
- Ajoute les champs `TextField::new('firstName')` et `TextField::new('lastName')` dans la méthode `configureFields` du `UserCrudController`
- Place ces champs entre l'email et les rôles pour une mise en page logique
- Crée un utilisateur de test avec prénom, nom, email, rôle et mot de passe
- Vérifie en base de données que le mot de passe est bien haché (il commence par `$2y$`)

**Résultat attendu** : Le formulaire de création affiche 5 champs (email, prénom, nom, rôles, mot de passe). Après création, l'utilisateur apparaît dans la liste avec ses nom et prénom, et il peut se connecter avec son mot de passe.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 : Ajouter les propriétés à l'entité

```bash
docker compose exec php bash
php bin/console make:entity User
```

Ajoute les champs suivants :

```text
New property name: firstName
Field type: string
Field length [255]: 100
Can this field be null (nullable) (yes/no) [no]: yes

New property name: lastName
Field type: string
Field length [255]: 100
Can this field be null (nullable) (yes/no) [no]: yes
```

### Étape 2 : Créer et exécuter la migration

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

**Résultat attendu** :

```text
[notice] Migrating up to DoctrineMigrations\VersionXXXXXXXXXXXXXX
[notice] finished in XXXms, used XXM memory, 1 migrations executed
```

### Étape 3 : Modifier le UserCrudController

Ouvre `src/Controller/Admin/UserCrudController.php`.

Modifie la méthode `configureFields` pour ajouter les nouveaux champs :

```php
public function configureFields(string $pageName): iterable
{
    $fields = [
        IdField::new('id')->hideOnForm(),
        EmailField::new('email'),
        // Nouveaux champs : prénom et nom
        TextField::new('firstName')->setLabel('Prénom'),
        TextField::new('lastName')->setLabel('Nom'),
        ChoiceField::new('roles')
            ->setChoices(['Admin' => 'ROLE_ADMIN', 'User' => 'ROLE_USER'])
            ->allowMultipleChoices()
            ->renderAsBadges(),
    ];

    // Configuration du champ mot de passe
    $password = TextField::new('password')
        ->setLabel('Mot de passe')
        ->setFormType(PasswordType::class)
        ->onlyOnForms()
        ->setRequired($pageName === Crud::PAGE_NEW)
        ->setFormTypeOption('empty_data', '')
        ->setMapped(false);

    $fields[] = $password;

    return $fields;
}
```

### Étape 4 : Tester

1. Vide le cache : `php bin/console cache:clear`
2. Va sur `/admin` > Utilisateurs > Créer Utilisateur
3. Remplis tous les champs :
   - Email : `marie@example.com`
   - Prénom : `Marie`
   - Nom : `Dupont`
   - Rôles : `ROLE_USER`
   - Mot de passe : `marie123`
4. Clique sur "Créer"

Vérifie en base de données que le mot de passe est haché :

```bash
php bin/console doctrine:query:sql "SELECT email, first_name, last_name, password FROM user WHERE email='marie@example.com'"
```

**Résultat attendu** : La colonne `password` contient un hash commençant par `$2y$13$...`, pas le texte `marie123`.

---

## Navigation

← Fiche précédente : **[Sécuriser l'administration avec l'authentification](03-easyadmin-authentification.md)**

→ Fiche suivante : **[Gestion des images et filtres de recherche](05-easyadmin-images-filtres.md)**
