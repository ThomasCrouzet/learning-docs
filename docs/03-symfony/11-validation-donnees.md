---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Valider les données avec les contraintes Assert"
estimated_time: "65 min"
fiche_number: 11
total_fiches: 21
cursus: "Symfony"
---

# 11 - Validation des données

> **En bref** : À la fin de cette fiche, tu sauras valider des données avec les attributs #[Assert\...] de Symfony 7.4, personnaliser les messages d'erreur, utiliser les groupes de validation et créer des contraintes personnalisées. Lecture estimée : 65 min.


## Prérequis

- Avoir lu la fiche **[09 - Les formulaires](09-formulaires.md)**
- Avoir lu la fiche **[08 - Les classes en détail](../02-php/08-classes-en-detail.md)** (PHP)
- Savoir créer une entité Doctrine et un formulaire Symfony

## Objectif de cette fiche

À la fin de cette fiche, tu sauras valider des données avec les attributs `#[Assert\...]` de Symfony 7.4, personnaliser les messages d'erreur, utiliser les groupes de validation et créer des contraintes personnalisées.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la validation ?

**Définition** : La validation est le processus qui vérifie que les données reçues respectent des règles précises avant d'être enregistrées en base de données.

**Le problème que la validation résout** :

Sans validation côté serveur, voici les problèmes rencontrés :

1. **Données incohérentes** : Un utilisateur envoie un email au format invalide, un prix négatif ou un titre vide.
2. **Failles de sécurité** : Un utilisateur malveillant contourne la validation HTML5 du navigateur en modifiant la requête HTTP directement.
3. **Erreurs en base** : Des données invalides provoquent des erreurs SQL (champ trop long, valeur nulle interdite).

**Comment la validation résout ces problèmes** :

| Problème | Solution apportée par la validation |
| -------- | ----------------------------------- |
| Données incohérentes | Chaque champ a des règles explicites (longueur, format, plage) |
| Failles de sécurité | La vérification se fait côté serveur, impossible à contourner |
| Erreurs en base | Les données sont vérifiées avant toute écriture en base |

**Analogie concrète** : Imagine le contrôle qualité dans une usine. Avant de mettre un produit en boîte, un inspecteur vérifie chaque critère : poids correct, dimensions conformes, étiquette présente. Si un critère échoue, le produit est renvoyé à la production avec une fiche expliquant le défaut. La validation Symfony fonctionne de la même manière : chaque donnée est inspectée selon des critères définis, et les erreurs sont renvoyées au formulaire.

**Ce que la validation n'est PAS** :

- La validation n'est pas la validation HTML5 du navigateur. Les attributs `required`, `maxlength`, `type="email"` dans le HTML sont des aides visuelles pour l'utilisateur, mais elles peuvent être désactivées ou contournées. La validation Symfony se fait côté serveur et ne peut pas être contournée.
- La validation n'est pas les contraintes SQL de la base de données. Les contraintes `NOT NULL` ou `UNIQUE` en base sont un dernier filet de sécurité. La validation Symfony intervient avant, pour renvoyer des messages d'erreur compréhensibles à l'utilisateur.

**Comparaison validation côté client vs côté serveur** :

| Validation HTML5 (client) | Validation Symfony (serveur) |
| ------------------------- | ---------------------------- |
| Exécutée dans le navigateur | Exécutée sur le serveur PHP |
| Peut être désactivée | Impossible à contourner |
| Retour instantané | Nécessite un envoi du formulaire |
| Aide à l'expérience utilisateur | Garantit l'intégrité des données |

---

### Les contraintes de validation

**Définition** : Une contrainte de validation est un attribut PHP `#[Assert\...]` placé sur une propriété d'entité. Cet attribut définit une règle que la valeur de la propriété doit respecter.

**Syntaxe de base** :

```php
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\NotBlank]
private ?string $title = null;
```

**Comment ça fonctionne** :

Le diagramme suivant résume le processus de validation depuis la soumission des données jusqu'au résultat :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-11-validation-données-1.html">Les contraintes de validation (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-11-validation-données-1.html" title="Les contraintes de validation" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

En détail :

```text
1. Tu places des attributs #[Assert\...] sur les propriétés de ton entité
2. Quand le formulaire est soumis, Symfony lit ces attributs
3. Symfony vérifie chaque propriété selon ses contraintes
4. Si une contrainte échoue, Symfony crée un message d'erreur
5. Le formulaire affiche les erreurs à côté des champs concernés
```

**Le `use` obligatoire** : Tu dois toujours ajouter cet import en haut du fichier de l'entité :

```php
use Symfony\Component\Validator\Constraints as Assert;
```

Cet import crée un alias `Assert` pour accéder à toutes les contraintes avec `#[Assert\NomDeLaContrainte]`.

---

### Les contraintes courantes

Voici les contraintes que tu utiliseras le plus souvent :

**Contraintes de présence** :

| Contrainte | Vérifie que... | Valeurs rejetées |
| ---------- | -------------- | ---------------- |
| `#[Assert\NotBlank]` | La valeur n'est pas vide | `null`, `""`, `"  "` (espaces seuls) |
| `#[Assert\NotNull]` | La valeur n'est pas null | `null` uniquement |

**Contraintes de texte** :

| Contrainte | Vérifie que... | Exemple |
| ---------- | -------------- | ------- |
| `#[Assert\Length(min: 3, max: 255)]` | La longueur est dans la plage | Titre entre 3 et 255 caractères |
| `#[Assert\Email]` | Le format est un email valide | `user@example.com` |
| `#[Assert\Regex(pattern: '/^[a-z]+$/')]` | La valeur correspond au pattern | Lettres minuscules uniquement |
| `#[Assert\Url]` | Le format est une URL valide | `https://example.com` |

**Contraintes numériques** :

| Contrainte | Vérifie que... | Exemple |
| ---------- | -------------- | ------- |
| `#[Assert\Positive]` | Le nombre est > 0 | Prix d'un produit |
| `#[Assert\PositiveOrZero]` | Le nombre est >= 0 | Quantité en stock |
| `#[Assert\Range(min: 1, max: 100)]` | Le nombre est dans la plage | Note entre 1 et 100 |
| `#[Assert\Type(type: 'integer')]` | La valeur est du bon type | Doit être un entier |

**Contraintes de choix** :

| Contrainte | Vérifie que... | Exemple |
| ---------- | -------------- | ------- |
| `#[Assert\Choice(choices: ['a', 'b'])]` | La valeur est dans la liste | Statut : draft, published |

**Contrainte pour les objets imbriqués** :

| Contrainte | Vérifie que... | Exemple |
| ---------- | -------------- | ------- |
| `#[Assert\Valid]` | L'objet lié est aussi validé | Valider l'adresse d'un utilisateur |

---

### Les groupes de validation

**Définition** : Les groupes de validation permettent d'appliquer des contraintes différentes selon le contexte (création, modification, etc.).

**Le problème que les groupes résolvent** :

Sans groupes de validation, voici le problème :

1. **Règles différentes selon le contexte** : À la création d'un utilisateur, le mot de passe est obligatoire. À la modification du profil, le mot de passe est optionnel (l'utilisateur garde l'ancien).

**Comment les groupes résolvent ce problème** :

| Contexte | Groupe | Contraintes actives |
| -------- | ------ | ------------------- |
| Création | `create` | Tous les champs obligatoires, dont le mot de passe |
| Modification | `edit` | Mot de passe optionnel |
| Par défaut | `Default` | Contraintes sans groupe explicite |

**Analogie concrète** : Imagine un formulaire administratif. Pour une première inscription, tu dois fournir toutes les pièces (carte d'identité, justificatif de domicile, photo). Pour un renouvellement, tu fournis seulement la carte d'identité. Les groupes de validation fonctionnent comme ces deux procédures : selon le contexte, les pièces demandées changent.

---

### Les contraintes personnalisées

**Définition** : Une contrainte personnalisée est une règle de validation que tu crées toi-même quand les contraintes intégrées ne suffisent pas.

**Le problème que les contraintes personnalisées résolvent** :

Les contraintes intégrées couvrent les cas courants (email, longueur, regex...), mais certaines règles métier sont spécifiques à ton application :

1. **Vérifier qu'un texte ne contient pas de spam** : Aucune contrainte intégrée ne fait cela.
2. **Vérifier qu'une date est un jour ouvrable** : Aucune contrainte intégrée ne fait cela.

**Structure d'une contrainte personnalisée** :

```text
1. Classe Constraint     → Définit la contrainte et son message d'erreur
2. Classe ConstraintValidator → Contient la logique de vérification
```

---

### Les messages d'erreur personnalisés

Chaque contrainte accepte un paramètre `message` qui remplace le message par défaut :

```php
#[Assert\NotBlank(message: 'Le titre ne peut pas être vide.')]
#[Assert\Length(
    min: 3,
    max: 255,
    minMessage: 'Le titre doit contenir au moins {{ limit }} caractères.',
    maxMessage: 'Le titre ne peut pas dépasser {{ limit }} caractères.'
)]
```

**Les variables disponibles dans les messages** :

| Variable | Signification |
| -------- | ------------- |
| `{{ value }}` | La valeur soumise |
| `{{ limit }}` | La limite (min ou max) |
| `{{ min }}` | La valeur minimale (Range) |
| `{{ max }}` | La valeur maximale (Range) |

---

## Étapes Pratiques

### Étape 1 : Ajouter des contraintes sur une entité Article

Ouvre le fichier `src/Entity/Article.php` et ajoute les attributs de validation :

```php
<?php
// src/Entity/Article.php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le titre est obligatoire.')]
    #[Assert\Length(
        min: 5,
        max: 255,
        minMessage: 'Le titre doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'Le titre ne peut pas dépasser {{ limit }} caractères.'
    )]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: 'Le contenu est obligatoire.')]
    #[Assert\Length(
        min: 50,
        minMessage: 'Le contenu doit contenir au moins {{ limit }} caractères.'
    )]
    private ?string $content = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "L'email de l'auteur est obligatoire.")]
    #[Assert\Email(message: "L'email '{{ value }}' n'est pas un email valide.")]
    private ?string $authorEmail = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Assert\Choice(
        choices: ['draft', 'published', 'archived'],
        message: 'Le statut "{{ value }}" n\'est pas valide.'
    )]
    private ?string $status = 'draft';

    // Getters et setters pour chaque propriété (getId, getTitle/setTitle,
    // getContent/setContent, getAuthorEmail/setAuthorEmail, getStatus/setStatus)
}
```

**Résultat attendu** : Si tu soumets le formulaire avec un titre vide, le message "Le titre est obligatoire." apparaît sous le champ.

---

### Étape 2 : Valider dans un formulaire

Symfony valide automatiquement les données quand tu utilises `$form->isValid()`. Tu n'as rien de plus à faire si les contraintes sont définies sur l'entité.

Voici le contrôleur qui utilise la validation :

```php
<?php
// src/Controller/ArticleController.php

namespace App\Controller;

use App\Entity\Article;
use App\Form\ArticleType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticleController extends AbstractController
{
    #[Route('/articles/new', name: 'article_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $article = new Article();

        $form = $this->createForm(ArticleType::class, $article);
        $form->handleRequest($request);

        // isValid() déclenche automatiquement la validation
        // Si les contraintes échouent, isValid() retourne false
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($article);
            $em->flush();

            $this->addFlash('success', 'Article créé.');

            return $this->redirectToRoute('article_show', [
                'id' => $article->getId(),
            ]);
        }

        // Si le formulaire est invalide, Symfony réaffiche le formulaire
        // avec les messages d'erreur à côté de chaque champ
        return $this->render('article/new.html.twig', [
            'form' => $form,
        ]);
    }
}
```

**Ce qui se passe étape par étape** :

```text
1. handleRequest() remplit l'entité $article avec les données du formulaire
2. isSubmitted() vérifie que le formulaire a bien été soumis en POST
3. isValid() lit les attributs #[Assert\...] sur l'entité Article
4. Symfony vérifie chaque propriété selon ses contraintes
5. Si toutes les contraintes passent : isValid() retourne true
6. Si une contrainte échoue : isValid() retourne false
   → Symfony stocke les erreurs dans le formulaire
   → Le template les affiche automatiquement
```

---

### Étape 3 : Afficher les erreurs dans Twig

Les erreurs s'affichent automatiquement avec `form_row()`. Tu peux aussi les afficher manuellement :

```twig
{# templates/article/new.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Nouvel article{% endblock %}

{% block body %}
    <h1>Créer un nouvel article</h1>

    {# Afficher les erreurs globales du formulaire (non liées à un champ) #}
    {% if form.vars.errors|length > 0 %}
        <div class="alert alert-danger">
            {{ form_errors(form) }}
        </div>
    {% endif %}

    {{ form_start(form) }}

        {# form_row affiche : label + champ + erreurs #}
        {{ form_row(form.title) }}

        {{ form_row(form.content) }}

        {{ form_row(form.authorEmail) }}

        {{ form_row(form.status) }}

        {# Afficher les erreurs d'un champ séparément #}
        <div class="mb-3">
            {{ form_label(form.title) }}
            {{ form_widget(form.title) }}

            {# Les erreurs du champ title #}
            {% if form.title.vars.errors|length > 0 %}
                <div class="text-danger">
                    {{ form_errors(form.title) }}
                </div>
            {% endif %}
        </div>

        <button type="submit" class="btn btn-primary">Enregistrer</button>

    {{ form_end(form) }}
{% endblock %}
```

**Fonctions Twig pour les erreurs** :

| Fonction | Ce qu'elle affiche |
| -------- | ------------------ |
| `form_errors(form)` | Erreurs globales du formulaire |
| `form_errors(form.title)` | Erreurs du champ title |
| `form_row(form.title)` | Label + champ + erreurs (tout inclus) |

---

### Étape 4 : Utiliser les groupes de validation

**Situation** : À la création d'un utilisateur, le mot de passe est obligatoire. À la modification, il est optionnel.

**Étape 4a** : Définir les groupes sur l'entité :

```php
<?php
// src/Entity/User.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "L'email est obligatoire.")]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'Le mot de passe est obligatoire.',
        groups: ['create']  // Uniquement lors de la création
    )]
    #[Assert\Length(
        min: 8,
        minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.',
        groups: ['create', 'edit']  // En création ET en modification
    )]
    private ?string $password = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
    private ?string $name = null;

    // Getters et setters...
}
```

**Explication des groupes** :

| Contrainte | Groupe | Quand elle est vérifiée |
| ---------- | ------ | ----------------------- |
| `NotBlank` sur email | `Default` (aucun groupe) | Toujours |
| `NotBlank` sur password | `create` | Seulement à la création |
| `Length` sur password | `create`, `edit` | En création et en modification |
| `NotBlank` sur name | `Default` (aucun groupe) | Toujours |

**Étape 4b** : Configurer le groupe dans le formulaire :

```php
<?php
// src/Form/UserCreateType.php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserCreateType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class)
            ->add('password', PasswordType::class)
            ->add('name', TextType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            // Active les groupes Default ET create
            'validation_groups' => ['Default', 'create'],
        ]);
    }
}
```

```php
<?php
// src/Form/UserEditType.php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserEditType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class)
            ->add('password', PasswordType::class, [
                'required' => false,  // Champ optionnel dans le HTML
            ])
            ->add('name', TextType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            // Active les groupes Default ET edit
            // NotBlank sur password (groupe create) ne sera PAS vérifié
            'validation_groups' => ['Default', 'edit'],
        ]);
    }
}
```

---

### Étape 5 : Créer une contrainte personnalisée

**Objectif** : Créer une contrainte `ContainsNoSpam` qui vérifie qu'un texte ne contient pas certains mots interdits.

**Étape 5a** : Créer la classe Constraint :

```php
<?php
// src/Validator/ContainsNoSpam.php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

// L'attribut #[Attribute] permet d'utiliser cette contrainte comme attribut PHP
#[\Attribute]
class ContainsNoSpam extends Constraint
{
    // Le message d'erreur par défaut
    public string $message = 'Le texte contient un mot interdit : "{{ word }}".';

    // Les mots interdits (configurable)
    public array $forbiddenWords = ['spam', 'viagra', 'casino'];
}
```

**Étape 5b** : Créer le validateur :

```php
<?php
// src/Validator/ContainsNoSpamValidator.php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class ContainsNoSpamValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        // Vérifier que la contrainte est du bon type
        if (!$constraint instanceof ContainsNoSpam) {
            throw new UnexpectedTypeException($constraint, ContainsNoSpam::class);
        }

        // Si la valeur est vide, ne pas valider (c'est le rôle de NotBlank)
        if (null === $value || '' === $value) {
            return;
        }

        // Convertir le texte en minuscules pour la comparaison
        $lowerValue = strtolower((string) $value);

        // Vérifier chaque mot interdit
        foreach ($constraint->forbiddenWords as $word) {
            if (str_contains($lowerValue, strtolower($word))) {
                // Ajouter une violation (= une erreur de validation)
                $this->context->buildViolation($constraint->message)
                    ->setParameter('{{ word }}', $word)
                    ->addViolation();

                return;
            }
        }
    }
}
```

**Étape 5c** : Utiliser la contrainte sur une entité :

```php
<?php
// src/Entity/Comment.php

namespace App\Entity;

use App\Validator as AppAssert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class Comment
{
    // ...

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank(message: 'Le commentaire ne peut pas être vide.')]
    #[AppAssert\ContainsNoSpam]
    private ?string $content = null;

    // Tu peux aussi personnaliser les mots interdits :
    // #[AppAssert\ContainsNoSpam(forbiddenWords: ['pub', 'promo', 'gratuit'])]
}
```

**Explication** :

- `use App\Validator as AppAssert;` crée un alias pour tes contraintes personnalisées
- `#[AppAssert\ContainsNoSpam]` applique ta contrainte sur la propriété
- Symfony trouve automatiquement le validateur `ContainsNoSpamValidator` grâce à la convention de nommage

---

### Étape 6 : Valider manuellement dans un contrôleur

Dans certains cas (API, commande console, import de données), tu veux valider un objet sans passer par un formulaire. Utilise le service `ValidatorInterface` :

```php
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/articles', methods: ['POST'])]
public function create(
    Request $request,
    ValidatorInterface $validator,
    EntityManagerInterface $em,
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    $article = new Article();
    $article->setTitle($data['title'] ?? '');
    $article->setContent($data['content'] ?? '');

    // Valider manuellement l'entité
    $errors = $validator->validate($article);

    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = [
                'field' => $error->getPropertyPath(),
                'message' => $error->getMessage(),
            ];
        }

        return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
    }

    $em->persist($article);
    $em->flush();

    return $this->json(['id' => $article->getId()], Response::HTTP_CREATED);
}
```

**Valider avec un groupe spécifique** :

```php
// Valider uniquement les contraintes du groupe "create"
$errors = $validator->validate($article, null, ['create']);

// Valider les contraintes Default ET create
$errors = $validator->validate($article, null, ['Default', 'create']);
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:validator Article` | Afficher les contraintes d'une entité |
| `php bin/console debug:validator` | Lister toutes les entités avec des contraintes |
| `php bin/console debug:container validator` | Afficher les services de validation disponibles |

---

## Pièges Fréquents

### Piège 1 : Confondre NotBlank et NotNull

**Problème** : Tu utilises `#[Assert\NotNull]` alors que tu veux interdire les chaînes vides.

**Explication** :

| Contrainte | Accepte `null` | Accepte `""` | Accepte `"  "` |
| ---------- | -------------- | ------------ | --------------- |
| `NotNull` | Non | Oui | Oui |
| `NotBlank` | Non | Non | Non |

**Solution** : Utilise `NotBlank` pour les champs texte de formulaire. `NotBlank` est plus strict : il rejette `null`, les chaînes vides et les chaînes contenant uniquement des espaces.

```php
// ❌ Accepte une chaîne vide ""
#[Assert\NotNull]
private ?string $title = null;

// ✅ Rejette null, "" et "   "
#[Assert\NotBlank]
private ?string $title = null;
```

---

### Piège 2 : Oublier le use pour les attributs

**Problème** : Erreur `Attribute class "Assert\NotBlank" not found`.

**Cause** : Tu as oublié l'import en haut du fichier.

**Solution** : Ajouter le `use` :

```php
// ❌ L'import manque
#[Assert\NotBlank]

// ✅ Ajouter en haut du fichier
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\NotBlank]
```

---

### Piège 3 : Compter uniquement sur la validation côté client

**Problème** : Tu relies sur `required` dans le formulaire HTML sans ajouter de contrainte serveur.

**Cause** : L'attribut `required` dans le HTML empêche l'envoi du formulaire depuis le navigateur, mais un utilisateur peut le contourner avec les outils de développement ou une requête HTTP directe.

**Solution** : Toujours ajouter la contrainte côté serveur en plus :

```php
// Dans le formulaire
->add('title', TextType::class, [
    'required' => true,  // Validation HTML (aide UX)
])

// Dans l'entité (obligatoire)
#[Assert\NotBlank]  // Validation serveur (sécurité)
private ?string $title = null;
```

---

### Piège 4 : Groupes de validation mal configurés

**Problème** : Les contraintes sans groupe ne sont pas vérifiées quand tu spécifies un groupe.

**Cause** : Quand tu définis `validation_groups` dans le formulaire, seules les contraintes appartenant à ces groupes sont vérifiées. Les contraintes sans groupe appartiennent au groupe `Default`.

**Solution** : Toujours inclure `Default` dans la liste des groupes :

```php
// ❌ Les contraintes sans groupe (Default) ne seront PAS vérifiées
'validation_groups' => ['create'],

// ✅ Les contraintes Default ET create seront vérifiées
'validation_groups' => ['Default', 'create'],
```

---

### Piège 5 : Contrainte personnalisée introuvable

**Problème** : Erreur "No validator found for constraint App\Validator\ContainsNoSpam".

**Cause** : Le validateur ne suit pas la convention de nommage.

**Solution** : Le validateur doit s'appeler `[NomDeLaContrainte]Validator` et être dans le même namespace :

```text
src/Validator/
├── ContainsNoSpam.php           ← La contrainte
└── ContainsNoSpamValidator.php  ← Le validateur (même nom + Validator)
```

---

## Checklist de Validation

- [ ] Je sais ajouter des contraintes `#[Assert\...]` sur une entité
- [ ] Je connais la différence entre `NotBlank` et `NotNull`
- [ ] Je sais personnaliser les messages d'erreur
- [ ] Je sais afficher les erreurs dans Twig avec `form_errors()`
- [ ] Je comprends le fonctionnement des groupes de validation
- [ ] Je sais créer une contrainte personnalisée (Constraint + ConstraintValidator)
- [ ] Je sais valider manuellement avec `ValidatorInterface`

---

## Exercice Pratique

**Énoncé** : Crée une entité `Product` avec une validation complète.

**Spécifications de l'entité** :

- `name` (string, 255) : obligatoire, entre 2 et 255 caractères
- `price` (decimal, 10,2) : obligatoire, strictement positif
- `description` (text, nullable) : si renseignée, au moins 20 caractères et maximum 2000 caractères
- `category` (string, 50) : obligatoire, doit être une des valeurs suivantes : `electronics`, `clothing`, `food`, `books`
- `sku` (string, 20) : obligatoire, doit correspondre au format `PROD-` suivi de 4 chiffres (regex : `/^PROD-\d{4}$/`)
- `stock` (integer) : obligatoire, supérieur ou égal à 0

**Ce que tu dois faire** :

1. Créer l'entité `Product` avec toutes les contraintes de validation
2. Personnaliser chaque message d'erreur en français
3. Créer un formulaire `ProductType`
4. Créer un contrôleur avec une route `/products/new`
5. Créer un template qui affiche le formulaire avec les erreurs

**Résultat attendu** :

- Si tu soumets le formulaire vide, chaque champ obligatoire affiche son message d'erreur
- Si tu entres un SKU au mauvais format (ex: "ABC123"), le message "Le SKU doit suivre le format PROD-XXXX" apparaît
- Si tu entres un prix négatif, le message "Le prix doit être positif" apparaît

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Entité `src/Entity/Product.php`** :

```php
<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom du produit est obligatoire.')]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'Le nom doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères.'
    )]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\NotBlank(message: 'Le prix est obligatoire.')]
    #[Assert\Positive(message: 'Le prix doit être positif.')]
    private ?string $price = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(
        min: 20,
        max: 2000,
        minMessage: 'La description doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'La description ne peut pas dépasser {{ limit }} caractères.'
    )]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank(message: 'La catégorie est obligatoire.')]
    #[Assert\Choice(
        choices: ['electronics', 'clothing', 'food', 'books'],
        message: 'La catégorie "{{ value }}" n\'est pas valide. Choix possibles : electronics, clothing, food, books.'
    )]
    private ?string $category = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank(message: 'Le SKU est obligatoire.')]
    #[Assert\Regex(
        pattern: '/^PROD-\d{4}$/',
        message: 'Le SKU doit suivre le format PROD-XXXX (ex : PROD-0042).'
    )]
    private ?string $sku = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'Le stock est obligatoire.')]
    #[Assert\PositiveOrZero(message: 'Le stock ne peut pas être négatif.')]
    private ?int $stock = null;

    // Getters et setters pour chaque propriété (getId, getName/setName,
    // getPrice/setPrice, getDescription/setDescription,
    // getCategory/setCategory, getSku/setSku, getStock/setStock)
}
```

**Formulaire `src/Form/ProductType.php`** :

```php
<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom du produit',
                'attr' => ['placeholder' => 'Ex : Clavier mécanique'],
            ])
            ->add('price', MoneyType::class, [
                'label' => 'Prix',
                'currency' => 'EUR',
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'required' => false,
                'attr' => [
                    'rows' => 5,
                    'placeholder' => 'Description détaillée du produit...',
                ],
            ])
            ->add('category', ChoiceType::class, [
                'label' => 'Catégorie',
                'choices' => [
                    'Électronique' => 'electronics',
                    'Vêtements' => 'clothing',
                    'Alimentation' => 'food',
                    'Livres' => 'books',
                ],
                'placeholder' => 'Choisir une catégorie',
            ])
            ->add('sku', TextType::class, [
                'label' => 'SKU',
                'attr' => ['placeholder' => 'Ex : PROD-0042'],
                'help' => 'Format : PROD- suivi de 4 chiffres',
            ])
            ->add('stock', IntegerType::class, [
                'label' => 'Stock',
                'attr' => ['min' => 0],
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Enregistrer',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
```

**Contrôleur `src/Controller/ProductController.php`** :

```php
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    #[Route('/products/new', name: 'product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $product = new Product();

        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($product);
            $em->flush();

            $this->addFlash('success', 'Produit créé.');

            return $this->redirectToRoute('product_new');
        }

        return $this->render('product/new.html.twig', [
            'form' => $form,
        ]);
    }
}
```

**Template `templates/product/new.html.twig`** :

```twig
{% extends 'base.html.twig' %}

{% block title %}Nouveau produit{% endblock %}

{% block body %}
    <h1>Créer un nouveau produit</h1>

    {% for message in app.flashes('success') %}
        <div class="alert alert-success">{{ message }}</div>
    {% endfor %}

    {{ form_start(form) }}

        {{ form_row(form.name) }}
        {{ form_row(form.price) }}
        {{ form_row(form.description) }}
        {{ form_row(form.category) }}
        {{ form_row(form.sku) }}
        {{ form_row(form.stock) }}

        {{ form_row(form.save) }}

    {{ form_end(form) }}
{% endblock %}
```

---

## Navigation

← Fiche précédente : **[Personnaliser EasyAdmin](10-personnaliser-easyadmin.md)**

→ Fiche suivante : **[Sécurité et utilisateurs](12-securite-utilisateurs.md)**
