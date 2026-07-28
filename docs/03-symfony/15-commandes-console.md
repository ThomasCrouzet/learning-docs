---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Commandes console personnalisées dans Symfony"
estimated_time: "70 min"
fiche_number: 15
total_fiches: 21
cursus: "Symfony"
---

# 15 - Commandes console

> **En bref** : À la fin de cette fiche, tu sauras créer des commandes console personnalisées dans Symfony 7.4, avec des arguments, des options, une sortie stylisée et l'injection de services. Lecture estimée : 70 min.


## Prérequis

- Avoir lu la fiche **[13 - Services et injection de dépendances](13-services-injection-dependances.md)**
- Savoir créer un service et l'injecter par constructeur
- Comprendre l'autowiring et le fichier `config/services.yaml`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des commandes console personnalisées dans Symfony 7.4, avec des arguments, des options, une sortie stylisée et l'injection de services.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une commande console ?

**Définition** : Une commande console est un programme CLI (Command Line Interface) que tu exécutes via `php bin/console`. Elle effectue une tâche précise : importer des données, nettoyer le cache, générer un rapport, envoyer des emails en masse.

**Le problème que les commandes console résolvent** :

Sans commandes console, voici les problèmes rencontrés :

1. **Pas d'interface pour les tâches techniques** : Tu dois créer un contrôleur et une route pour chaque tâche d'administration, ce qui expose ces tâches sur le web.
2. **Tâches automatisées impossibles** : Un cron job ne peut pas naviguer sur une page web. Il a besoin d'une commande exécutable dans le terminal.
3. **Scripts isolés du framework** : Tu écris des scripts PHP indépendants qui n'ont pas accès aux services Symfony (Doctrine, Mailer, Logger).

**Comment les commandes console résolvent ces problèmes** :

| Problème | Solution apportée par les commandes console |
| -------- | -------------------------------------------- |
| Pas d'interface pour les tâches techniques | La commande s'exécute dans le terminal, pas sur le web |
| Tâches automatisées impossibles | Un cron job exécute `php bin/console app:ma-commande` |
| Scripts isolés du framework | La commande est un service Symfony avec accès à tous les autres services |

**Analogie concrète** : Une commande console est comme un raccourci clavier. Au lieu de naviguer dans les menus d'un logiciel (l'interface web), tu tapes une combinaison de touches (la commande) et l'action s'exécute directement. C'est plus rapide, plus précis, et tu peux l'automatiser.

**Ce qu'une commande console n'est PAS** :

- Une commande console n'est pas un contrôleur. Un contrôleur gère une requête HTTP et retourne une réponse HTML/JSON. Une commande s'exécute dans le terminal et affiche du texte.
- Une commande console n'est pas un script PHP classique. Un script classique n'a pas accès aux services Symfony. Une commande est intégrée au framework.

**Comparaison commande console vs contrôleur** :

| Commande console | Contrôleur |
| ---------------- | ---------- |
| S'exécute dans le terminal | S'exécute via une requête HTTP |
| Entrée : arguments et options | Entrée : requête HTTP (URL, formulaire) |
| Sortie : texte dans le terminal | Sortie : réponse HTTP (HTML, JSON) |
| Automatisable via cron | Accessible via navigateur |

---

### Le composant Console de Symfony

**Définition** : Le composant Console fournit les classes nécessaires pour créer des commandes : `Command` (la classe de base), `InputInterface` (les données entrantes) et `OutputInterface` (l'affichage dans le terminal).

**Comment ça fonctionne** :

```text
1. Tu tapes : php bin/console app:hello John --uppercase
2. Symfony crée un objet InputInterface avec :
   - Argument "name" = "John"
   - Option "uppercase" = true
3. Symfony crée un objet OutputInterface pour écrire dans le terminal
4. Symfony appelle la méthode execute() de ta commande
5. Ta commande lit l'input, fait son travail, et écrit dans l'output
```

---

### Les commandes Symfony intégrées

Symfony fournit de nombreuses commandes prêtes à l'emploi :

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:router` | Lister toutes les routes |
| `php bin/console debug:container` | Lister tous les services |
| `php bin/console doctrine:migrations:migrate` | Exécuter les migrations |
| `php bin/console make:entity` | Créer ou modifier une entité |
| `php bin/console cache:clear` | Vider le cache |
| `php bin/console list` | Afficher toutes les commandes |

---

### Anatomie d'une commande

**Définition** : Une commande Symfony est une classe PHP qui hérite de `Command`, porte l'attribut `#[AsCommand]`, et implémente au minimum la méthode `execute()`.

**Structure minimale** :

```php
<?php
// src/Command/HelloCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:hello',                         // Le nom utilisé dans le terminal
    description: 'Affiche un message de bienvenue',  // La description dans la liste
)]
class HelloCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('Hello World !');

        return Command::SUCCESS;  // Code de sortie 0 (succès)
    }
}
```

**Les éléments clés** :

| Élément | Rôle | Obligatoire |
| ------- | ---- | ----------- |
| `#[AsCommand]` | Déclare le nom et la description | Oui |
| `extends Command` | Hérite de la classe de base | Oui |
| `execute()` | Contient la logique principale | Oui |
| `configure()` | Définit les arguments et options | Non |
| `Command::SUCCESS` | Code de sortie 0 (succès) | Oui (à retourner) |
| `Command::FAILURE` | Code de sortie 1 (erreur) | Si erreur |

---

### Input : arguments et options

**Définition** : Les arguments sont les valeurs positionnelles passées à la commande. Les options sont des drapeaux nommés précédés de `--`.

```bash
php bin/console app:import articles.csv --format=json --verbose
#                         ^^^^^^^^^^^^  ^^^^^^^^^^^^^^ ^^^^^^^^^
#                         argument      option clé=val option flag
```

**Différence entre argument et option** :

| Argument | Option |
| -------- | ------ |
| Positionnel (ordre compte) | Nommé (ordre ne compte pas) |
| Peut être obligatoire | Toujours facultatif par défaut |
| Pas de préfixe | Préfixé par `--` (ou `-` pour le raccourci) |

**Types d'arguments** :

| Type | Constante | Exemple |
| ---- | --------- | ------- |
| Obligatoire | `InputArgument::REQUIRED` | `app:hello John` (erreur si absent) |
| Optionnel | `InputArgument::OPTIONAL` | `app:hello` ou `app:hello John` |
| Tableau | `InputArgument::IS_ARRAY` | `app:hello John Marie` |

**Types d'options** :

| Type | Constante | Exemple |
| ---- | --------- | ------- |
| Flag (sans valeur) | `InputOption::VALUE_NONE` | `--uppercase` (true/false) |
| Valeur obligatoire | `InputOption::VALUE_REQUIRED` | `--format=json` |
| Valeur optionnelle | `InputOption::VALUE_OPTIONAL` | `--log` ou `--log=debug` |

---

### Output : afficher dans le terminal

**Définition** : La classe `SymfonyStyle` ajoute des méthodes de mise en forme prêtes à l'emploi sur la sortie terminal.

| Méthode | Résultat |
| ------- | -------- |
| `$io->title('Titre')` | Titre souligné |
| `$io->success('Message')` | Bloc vert (succès) |
| `$io->error('Message')` | Bloc rouge (erreur) |
| `$io->warning('Message')` | Bloc jaune (avertissement) |
| `$io->note('Message')` | Bloc bleu (information) |
| `$io->table(['Col1'], [...])` | Tableau formaté |
| `$io->progressStart(100)` | Démarrer une barre de progression |
| `$io->ask('Question ?')` | Poser une question |
| `$io->confirm('Continuer ?')` | Question oui/non |
| `$io->choice('Choix ?', [...])` | Choix multiple |

---

### Injection de services dans les commandes

Une commande Symfony est un service comme un autre. Tu peux injecter n'importe quel service dans son constructeur.

```php
class ImportCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private LoggerInterface $logger,
    ) {
        // Appeler le constructeur parent est OBLIGATOIRE dans une commande
        parent::__construct();
    }
}
```

**Règle importante** : Dans une commande, tu dois toujours appeler `parent::__construct()` dans le constructeur. Sans cet appel, Symfony ne peut pas initialiser correctement la commande.

---

## Étapes Pratiques

### Étape 1 : Créer une commande basique

**Objectif** : Créer une commande `app:hello` qui affiche "Hello World !".

```php
<?php
// src/Command/HelloCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:hello',
    description: 'Affiche un message de bienvenue',
)]
class HelloCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->success('Hello World !');

        return Command::SUCCESS;
    }
}
```

```bash
php bin/console app:hello
```

**Résultat attendu** :

```text
 [OK] Hello World !
```

---

### Étape 2 : Ajouter un argument

**Objectif** : Accepter un argument `name` optionnel.

```php
<?php
// src/Command/HelloCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:hello',
    description: 'Affiche un message de bienvenue',
)]
class HelloCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->addArgument(
                'name',                        // Nom de l'argument
                InputArgument::OPTIONAL,       // Optionnel
                'Le nom de la personne à saluer',  // Description
                'World',                       // Valeur par défaut
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Récupérer la valeur de l'argument
        $name = $input->getArgument('name');
        $io->success(sprintf('Hello %s !', $name));

        return Command::SUCCESS;
    }
}
```

```bash
php bin/console app:hello
php bin/console app:hello John
```

**Résultat attendu** :

```text
 [OK] Hello World !

 [OK] Hello John !
```

---

### Étape 3 : Ajouter une option

**Objectif** : Ajouter une option `--uppercase` qui convertit le message en majuscules.

```php
<?php
// src/Command/HelloCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:hello',
    description: 'Affiche un message de bienvenue',
)]
class HelloCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->addArgument('name', InputArgument::OPTIONAL, 'Le nom de la personne', 'World')
            ->addOption(
                'uppercase',                   // Nom (--uppercase)
                'u',                           // Raccourci (-u)
                InputOption::VALUE_NONE,       // Flag on/off
                'Convertir en majuscules',
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $name = $input->getArgument('name');
        $message = sprintf('Hello %s !', $name);

        if ($input->getOption('uppercase')) {
            $message = strtoupper($message);
        }

        $io->success($message);

        return Command::SUCCESS;
    }
}
```

```bash
php bin/console app:hello John
php bin/console app:hello John --uppercase
php bin/console app:hello John -u
```

**Résultat attendu** :

```text
 [OK] Hello John !

 [OK] HELLO JOHN !
```

---

### Étape 4 : Styliser la sortie avec SymfonyStyle

**Objectif** : Montrer les différents styles de sortie disponibles.

```php
<?php
// src/Command/DemoStyleCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:demo-style',
    description: 'Démontre les différents styles de sortie',
)]
class DemoStyleCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Démonstration des styles SymfonyStyle');

        // Messages colorés
        $io->success('Opération réussie.');
        $io->error('Une erreur est survenue.');
        $io->warning('Attention : cette action est irréversible.');
        $io->note('Le traitement peut prendre quelques minutes.');

        // Tableau formaté
        $io->section('Tableau de données');
        $io->table(
            ['ID', 'Titre', 'Statut'],
            [
                [1, 'Premier article', 'Publié'],
                [2, 'Deuxième article', 'Brouillon'],
                [3, 'Troisième article', 'Publié'],
            ]
        );

        // Liste à puces
        $io->listing([
            'Premier élément',
            'Deuxième élément',
            'Troisième élément',
        ]);

        $io->success('Démonstration terminée.');

        return Command::SUCCESS;
    }
}
```

```bash
php bin/console app:demo-style
```

**Résultat attendu** : Des blocs colorés (success en vert, error en rouge, warning en jaune, note en bleu), un tableau formaté avec les articles, et une liste à puces.

---

### Étape 5 : Injecter un service (EntityManagerInterface)

**Objectif** : Créer une commande `app:list-articles` qui affiche les articles en base de données.

```php
<?php
// src/Command/ListArticlesCommand.php

namespace App\Command;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:list-articles',
    description: 'Affiche la liste des articles en base de données',
)]
class ListArticlesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addOption('status', 's', InputOption::VALUE_REQUIRED, 'Filtrer par statut')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Liste des articles');

        $repository = $this->em->getRepository(Article::class);
        $status = $input->getOption('status');

        if ($status !== null) {
            $articles = $repository->findBy(['status' => $status]);
            $io->note(sprintf('Filtre appliqué : statut = %s', $status));
        } else {
            $articles = $repository->findAll();
        }

        if (count($articles) === 0) {
            $io->warning('Aucun article trouvé.');

            return Command::SUCCESS;
        }

        $rows = [];
        foreach ($articles as $article) {
            $rows[] = [
                $article->getId(),
                $article->getTitle(),
                $article->getSlug(),
                $article->getStatus(),
            ];
        }

        $io->table(['ID', 'Titre', 'Slug', 'Statut'], $rows);
        $io->success(sprintf('%d article(s) trouvé(s).', count($articles)));

        return Command::SUCCESS;
    }
}
```

```bash
php bin/console app:list-articles
php bin/console app:list-articles --status=published
```

**Résultat attendu** :

```text
Liste des articles
===================

 ---- -------------------- -------------------- ---------
  ID   Titre                Slug                 Statut
 ---- -------------------- -------------------- ---------
  1    Premier article      premier-article      published
  2    Deuxième article     deuxieme-article     draft
 ---- -------------------- -------------------- ---------

 [OK] 2 article(s) trouvé(s).
```

---

### Étape 6 : Barre de progression pour un traitement batch

**Objectif** : Créer une commande `app:update-slugs` qui recalcule le slug de tous les articles avec une barre de progression.

```php
<?php
// src/Command/UpdateSlugsCommand.php

namespace App\Command;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:update-slugs',
    description: 'Recalcule le slug de tous les articles',
)]
class UpdateSlugsCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Mise à jour des slugs');

        $articles = $this->em->getRepository(Article::class)->findAll();
        $total = count($articles);

        if ($total === 0) {
            $io->warning('Aucun article en base de données.');

            return Command::SUCCESS;
        }

        $io->note(sprintf('%d article(s) à traiter.', $total));

        // Démarrer la barre de progression
        $io->progressStart($total);

        $updated = 0;

        foreach ($articles as $article) {
            $newSlug = $this->generateSlug($article->getTitle());

            if ($article->getSlug() !== $newSlug) {
                $article->setSlug($newSlug);
                $updated++;
            }

            // Avancer la barre d'un cran
            $io->progressAdvance();
        }

        // Terminer la barre de progression
        $io->progressFinish();

        // Sauvegarder tous les changements
        $this->em->flush();

        $io->success(sprintf(
            '%d article(s) traité(s), %d slug(s) mis à jour.',
            $total,
            $updated
        ));

        return Command::SUCCESS;
    }

    private function generateSlug(string $text): string
    {
        $slug = strtolower($text);
        $slug = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $slug);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);

        return trim($slug, '-');
    }
}
```

```bash
php bin/console app:update-slugs
```

**Résultat attendu** :

```text
Mise à jour des slugs
======================

 ! [NOTE] 3 article(s) à traiter.

 3/3 [============================] 100%

 [OK] 3 article(s) traité(s), 1 slug(s) mis à jour.
```

---

### Étape 7 : Commande interactive (poser des questions)

**Objectif** : Créer une commande `app:create-article` qui pose des questions et crée un article.

```php
<?php
// src/Command/CreateArticleCommand.php

namespace App\Command;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:create-article',
    description: 'Crée un article de manière interactive',
)]
class CreateArticleCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Création d\'un article');

        // Poser des questions
        $title = $io->ask('Quel est le titre de l\'article ?');

        if (empty($title)) {
            $io->error('Le titre ne peut pas être vide.');

            return Command::FAILURE;
        }

        $content = $io->ask('Quel est le contenu ?');

        // Proposer un choix
        $status = $io->choice('Quel statut ?', ['draft', 'published'], 'draft');

        // Afficher le résumé
        $io->section('Résumé');
        $io->table(
            ['Champ', 'Valeur'],
            [
                ['Titre', $title],
                ['Contenu', mb_substr($content, 0, 50) . '...'],
                ['Statut', $status],
            ]
        );

        // Demander confirmation
        if (!$io->confirm('Confirmer la création ?', true)) {
            $io->warning('Création annulée.');

            return Command::SUCCESS;
        }

        // Créer et sauvegarder l'article
        $article = new Article();
        $article->setTitle($title);
        $article->setContent($content);
        $article->setStatus($status);

        $slug = strtolower($title);
        $slug = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $slug);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $article->setSlug(trim($slug, '-'));

        $this->em->persist($article);
        $this->em->flush();

        $io->success(sprintf('Article "%s" créé avec l\'ID %d.', $title, $article->getId()));

        return Command::SUCCESS;
    }
}
```

```bash
php bin/console app:create-article
```

**Résultat attendu** : La commande pose les questions une par une (titre, contenu, statut), affiche un résumé en tableau, demande confirmation, puis crée l'article et affiche un message de succès avec l'ID.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console list` | Lister toutes les commandes |
| `php bin/console list app` | Lister les commandes du namespace `app` |
| `php bin/console app:hello --help` | Afficher l'aide d'une commande |
| `php bin/console make:command` | Générer le squelette d'une commande |
| `php bin/console app:hello -v` | Exécuter en mode verbose |
| `php bin/console app:hello -vvv` | Exécuter en mode debug |

---

## Pièges Fréquents

### Piège 1 : Oublier l'attribut #[AsCommand]

**Problème** : La commande n'apparaît pas dans `php bin/console list`.

**Cause** : L'attribut `#[AsCommand]` est manquant en haut de la classe.

```php
// ❌ La commande n'est pas détectée
class HelloCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int { }
}

// ✅ L'attribut enregistre la commande
#[AsCommand(name: 'app:hello', description: 'Mon message')]
class HelloCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int { }
}
```

---

### Piège 2 : Retourner le mauvais code de sortie

**Problème** : Les scripts qui appellent la commande (cron, CI/CD) considèrent qu'elle a échoué.

**Cause** : Tu retournes `Command::FAILURE` au lieu de `Command::SUCCESS`. Sous Unix, le code `0` signifie succès.

| Situation | Code à retourner |
| --------- | ---------------- |
| Exécution normale | `Command::SUCCESS` (0) |
| Erreur survenue | `Command::FAILURE` (1) |
| Utilisation incorrecte | `Command::INVALID` (2) |

---

### Piège 3 : Confondre argument et option

**Problème** : Tu définis un argument mais le lis comme une option, et la valeur est toujours `null`.

```php
// ❌ "name" est un argument mais lu comme option
$this->addArgument('name', InputArgument::REQUIRED);
$name = $input->getOption('name');  // Retourne null !

// ✅ Argument défini et lu correctement
$this->addArgument('name', InputArgument::REQUIRED);
$name = $input->getArgument('name');
```

**Règle** : `addArgument()` avec `getArgument()`, `addOption()` avec `getOption()`.

---

### Piège 4 : Oublier parent::__construct() avec injection de services

**Problème** : Erreur ou comportement inattendu quand tu injectes des services.

```php
// ❌ Le constructeur parent n'est pas appelé
class ListArticlesCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
    }
}

// ✅ Le constructeur parent est appelé
class ListArticlesCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }
}
```

---

### Piège 5 : Ne pas gérer les erreurs dans execute()

**Problème** : La commande plante avec une exception technique incompréhensible.

```php
// ❌ Pas de gestion d'erreur
$content = file_get_contents($filename);  // Plante si fichier absent

// ✅ Gestion d'erreur propre
if (!file_exists($filename)) {
    $io->error(sprintf('Le fichier "%s" n\'existe pas.', $filename));

    return Command::FAILURE;
}
$content = file_get_contents($filename);
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est une commande console et la différence avec un contrôleur
- [ ] Je sais créer une commande avec `#[AsCommand]` et `execute()`
- [ ] Je sais ajouter un argument et le lire avec `getArgument()`
- [ ] Je sais ajouter une option et la lire avec `getOption()`
- [ ] Je sais utiliser `SymfonyStyle` pour les messages, tableaux et barres de progression
- [ ] Je sais injecter un service dans une commande (avec `parent::__construct()`)
- [ ] Je sais créer une commande interactive avec `ask()`, `confirm()` et `choice()`
- [ ] Je comprends les codes de retour : `SUCCESS`, `FAILURE`, `INVALID`

---

## Exercice Pratique

**Énoncé** : Crée une commande `app:import-articles` qui lit un fichier CSV, importe les articles en base avec une barre de progression, et affiche un résumé en tableau.

**Spécifications** :

1. Argument obligatoire `file` (chemin vers le fichier CSV)
2. Option `--delimiter` (délimiteur CSV, par défaut `;`)
3. Format CSV attendu :

```text
title;content;status
Premier article;Contenu du premier article;published
Deuxième article;Contenu du deuxième article;draft
```

1. Pour chaque ligne : créer un Article avec slug auto-généré, afficher la progression
2. Après l'import : tableau récapitulatif (Titre, Slug, Statut) et message de succès
3. Gérer les erreurs : fichier introuvable, CSV vide

**Résultat attendu** :

```text
Import d'articles depuis un CSV
=================================

 ! [NOTE] Fichier : data/articles.csv

 3/3 [============================] 100%

Articles importés
------------------

 -------------------- -------------------- ----------
  Titre                Slug                 Statut
 -------------------- -------------------- ----------
  Premier article      premier-article      published
  Deuxième article     deuxieme-article     draft
  Troisième article    troisieme-article    published
 -------------------- -------------------- ----------

 [OK] 3 article(s) importé(s).
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Command/ImportArticlesCommand.php

namespace App\Command;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import-articles',
    description: 'Importe des articles depuis un fichier CSV',
)]
class ImportArticlesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('file', InputArgument::REQUIRED, 'Chemin vers le fichier CSV')
            ->addOption('delimiter', 'd', InputOption::VALUE_REQUIRED, 'Délimiteur CSV', ';')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Import d\'articles depuis un CSV');

        $filename = $input->getArgument('file');
        $delimiter = $input->getOption('delimiter');

        // Vérifier que le fichier existe
        if (!file_exists($filename)) {
            $io->error(sprintf('Le fichier "%s" n\'existe pas.', $filename));

            return Command::FAILURE;
        }

        $io->note(sprintf('Fichier : %s', $filename));

        // Ouvrir et lire le fichier CSV
        $handle = fopen($filename, 'r');
        $headers = fgetcsv($handle, 0, $delimiter);

        if ($headers === false || count($headers) < 3) {
            $io->error('En-tête CSV invalide.');
            fclose($handle);

            return Command::FAILURE;
        }

        // Lire toutes les lignes
        $rows = [];
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            if (count($row) >= 3) {
                $rows[] = $row;
            }
        }
        fclose($handle);

        if (count($rows) === 0) {
            $io->warning('Le fichier CSV ne contient aucune donnée.');

            return Command::SUCCESS;
        }

        // Barre de progression
        $io->progressStart(count($rows));

        $summary = [];

        foreach ($rows as $row) {
            $title = trim($row[0]);
            $content = trim($row[1]);
            $status = trim($row[2]);

            // Créer l'article
            $article = new Article();
            $article->setTitle($title);
            $article->setContent($content);
            $article->setStatus($status);

            // Générer le slug
            $slug = strtolower($title);
            $slug = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $slug);
            $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
            $article->setSlug(trim($slug, '-'));

            $this->em->persist($article);
            $summary[] = [$title, $article->getSlug(), $status];

            $io->progressAdvance();
        }

        $io->progressFinish();
        $this->em->flush();

        // Tableau récapitulatif
        $io->section('Articles importés');
        $io->table(['Titre', 'Slug', 'Statut'], $summary);
        $io->success(sprintf('%d article(s) importé(s).', count($rows)));

        return Command::SUCCESS;
    }
}
```

**Tester la commande** :

```bash
# Créer le fichier CSV de test
mkdir -p data
echo 'title;content;status
Premier article;Contenu du premier article;published
Deuxième article;Contenu du deuxième article;draft
Troisième article;Contenu du troisième article;published' > data/articles.csv

# Exécuter la commande
php bin/console app:import-articles data/articles.csv

# Vérifier les articles importés
php bin/console app:list-articles
```

---

## Navigation

← Fiche précédente : **[Événements et listeners](14-evenements-listeners.md)**

→ Fiche suivante : **[API JSON](16-api-json.md)**
