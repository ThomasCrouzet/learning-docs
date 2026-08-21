---
tags:
  - Testing
  - Audit
  - Avancé
description: "Auditer la couverture de tests d'un projet existant : lire le rapport, prioriser les zones critiques, écrire des characterization tests avant refactoring."
estimated_time: "75 min"
fiche_number: 14
total_fiches: 15
cursus: "Testing et Qualité"
id: "web.testing.audit-couverture-legacy"
course_id: "web.testing"
content_type: "lesson"
order: 14
---

# 14 - Auditer la couverture d'un projet existant

> **En bref** : Un projet en production avec peu de tests demande une stratégie spécifique. Cette fiche te montre comment lire un rapport de couverture, repérer les zones à risque, et écrire des characterization tests qui figent le comportement actuel avant un refactoring. Lecture estimée : 75 min.

## Prérequis

- Fiche 9 : [Couverture de code](09-couverture-code.md)
- Fiche 11 : [Stratégie de test en équipe](11-strategie-test-equipe.md)
- Cursus PHP / Symfony fondamentaux (lecture de classes et méthodes, exécution de PHPUnit en ligne de commande)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras générer un rapport HTML de couverture sur un projet existant, identifier les zones à fort risque non couvertes, et écrire un characterization test qui protège un comportement avant refactoring.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un audit de couverture ?

**Définition** : Un audit de couverture est une démarche qui consiste à mesurer objectivement quelles parties du code source sont exécutées par la suite de tests, puis à interpréter ces mesures pour décider où concentrer l'effort de test à venir.

**Le problème que l'audit de couverture résout** :

Sans audit de couverture, voici les problèmes rencontrés sur un projet legacy :

1. **Point de départ inconnu** : on sait qu'il manque des tests, mais on ne sait pas par où commencer.
2. **Effort mal réparti** : on teste les zones faciles (helpers, accesseurs) au lieu des zones critiques (services métier, contrôleurs de paiement).
3. **Faux sentiment de sécurité** : sans mesure, on pense qu'on est "presque bon" alors que les zones sensibles sont à 0% de couverture.

**Comment l'audit de couverture résout ces problèmes** :

| Problème | Solution apportée par l'audit |
| --- | --- |
| Point de départ inconnu | Le rapport montre les fichiers à 0% triés par dossier |
| Effort mal réparti | On croise couverture et risque pour prioriser |
| Faux sentiment de sécurité | Les chiffres remplacent l'intuition |

**Analogie concrète** : Pense à un audit énergétique d'un vieux bâtiment. Avant d'isoler, le thermicien passe une caméra thermique pour repérer les ponts thermiques. Sans cet audit, tu pourrais isoler une façade déjà étanche et laisser une fenêtre qui laisse passer tout le froid. L'audit de couverture joue le même rôle pour ton code : il te montre où sont les fuites avant que tu décides où poser de l'isolant.

**Ce que l'audit de couverture n'est PAS** :

- Un audit de couverture n'est pas une chasse au 100%. Atteindre 100% de couverture ne garantit pas l'absence de bugs et coûte souvent plus cher que la valeur produite.
- Un audit de couverture n'est pas un substitut au jugement humain. Le rapport indique ce qui est exécuté, pas ce qui est important. C'est à toi de relier les deux.

---

### Couverture de ligne vs couverture de branche

**Définition** : La couverture de ligne mesure le pourcentage de lignes de code exécutées au moins une fois par les tests. La couverture de branche mesure le pourcentage de chemins possibles dans les conditions (`if`, `else`, `match`, `switch`) qui sont parcourus par les tests.

**Le problème que cette distinction résout** :

Sans cette distinction, voici les problèmes rencontrés :

1. **Branches non testées masquées** : une méthode avec un `if/else` peut afficher 100% de couverture de ligne alors qu'une seule des deux branches est testée.
2. **Confiance excessive** : un rapport "85% de couverture" n'a pas le même sens selon qu'il s'agit de lignes ou de branches.
3. **Choix de mesure flou** : sans connaître la différence, on ne sait pas quelle métrique demander à l'outil.

**Comment cette distinction résout ces problèmes** :

| Problème | Solution apportée par la distinction |
| --- | --- |
| Branches non testées masquées | La couverture de branche les rend visibles |
| Confiance excessive | On lit toujours la métrique avec son nom |
| Choix de mesure flou | On sait quoi demander selon le contexte |

**Analogie concrète** : Pense à un livre dont tu mesurerais la lecture. La couverture de ligne, c'est compter les pages que tu as ouvertes. La couverture de branche, c'est vérifier que tu as bien lu chaque paragraphe, y compris ceux qui se trouvent dans les notes de bas de page. Tu peux feuilleter toutes les pages sans lire la moitié du contenu.

**Comparaison couverture de ligne vs couverture de branche** :

| Couverture de ligne | Couverture de branche |
| --- | --- |
| Compte les lignes exécutées | Compte les chemins conditionnels parcourus |
| Plus rapide à mesurer | Plus coûteuse à mesurer |
| Plus facile à atteindre | Plus difficile à atteindre |
| Métrique par défaut de la plupart des outils | Souvent une option à activer |
| Peut masquer des branches non testées | Révèle les `else` jamais déclenchés |

**Exemple concret de la différence** :

```php
<?php

// Méthode avec deux branches possibles
public function discount(int $age): float
{
    if ($age < 18) {
        return 0.20; // 20% de réduction
    }

    return 0.00;
}

// Test unique
public function testDiscountForAdult(): void
{
    static::assertSame(0.00, $this->service->discount(30));
}
```

Dans cet exemple, le test exécute la ligne du `return 0.00`. La couverture de ligne sur cette méthode est élevée, mais la branche `if ($age < 18)` n'a jamais été testée pour le cas vrai. La couverture de branche le révèle.

---

### Couverture vs risque

**Définition** : La couverture est une mesure quantitative de ce qui est exécuté. Le risque est une évaluation qualitative de l'impact d'un bug à un endroit donné du code. Les deux dimensions doivent être croisées : la couverture seule ne suffit pas à juger la qualité d'une suite de tests.

**Le problème que ce croisement résout** :

Sans croiser couverture et risque, voici les problèmes rencontrés :

1. **Zones à 0% qui ne sont pas critiques** : un dossier `Utils/` à 0% peut contenir du code mort sans impact. Y ajouter des tests serait du gaspillage.
2. **Zones à 80% qui cachent des trous** : un service de paiement à 80% couvre peut-être tous les chemins heureux et aucun chemin d'erreur. Le 20% manquant contient le risque.
3. **Tests superficiels** : un test qui exécute une méthode sans rien vérifier monte la couverture sans apporter de garantie.

**Comment le croisement résout ces problèmes** :

| Problème | Solution apportée par le croisement |
| --- | --- |
| Zones à 0% non critiques | On les laisse, on ne s'épuise pas dessus |
| Zones à 80% trompeuses | On regarde quel 20% est manquant |
| Tests superficiels | On distingue "test qui exécute" et "test qui vérifie" |

**Analogie concrète** : Pense à la sécurité d'une maison. La couverture, c'est compter le nombre de portes et fenêtres avec un verrou. Le risque, c'est savoir lesquelles donnent sur la rue et lesquelles donnent sur un grenier inaccessible. Une maison avec 100% de verrous mais des portes principales fragiles est moins sûre qu'une maison où seules les ouvertures à risque sont solides.

**Ce que le croisement n'est PAS** :

- Le croisement n'est pas un calcul automatique. Aucun outil ne te dira "ce fichier est critique". C'est à toi, avec ta connaissance du métier, de le décider.
- Le croisement n'est pas une excuse pour ignorer les chiffres. Les mesures restent un point de départ objectif.

**Distinction test qui exécute vs test qui vérifie** :

```php
<?php

// Test qui EXÉCUTE sans VÉRIFIER (anti-pattern)
public function testProcessOrder(): void
{
    // Ce test fait monter la couverture mais ne garantit rien
    $this->service->process($order);
    static::assertTrue(true); // Assertion fictive
}

// Test qui EXÉCUTE et VÉRIFIE
public function testProcessOrderMarksOrderAsConfirmed(): void
{
    $order = new Order();
    $this->service->process($order);
    static::assertSame('confirmed', $order->getStatus());
}
```

---

### Qu'est-ce qu'un characterization test ?

**Définition** : Un characterization test est un test dont le seul objectif est de figer le comportement actuel d'un morceau de code, indépendamment de son intention métier ou de sa correction. Il sert de filet de sécurité avant un refactoring : si le refactoring change le comportement, le test échoue et tu es prévenu.

**Le problème que le characterization test résout** :

Sans characterization test, voici les problèmes rencontrés sur du code legacy :

1. **Refactoring aveugle** : tu modifies du code sans tests, tu casses un comportement subtil sans t'en apercevoir, le bug arrive en production.
2. **Peur de toucher au code** : par crainte de tout casser, personne ne refactore. Le code se dégrade encore.
3. **Spécification orale perdue** : le comportement actuel est connu uniquement de la personne qui a écrit le code. Quand elle part, le savoir disparaît.

**Comment le characterization test résout ces problèmes** :

| Problème | Solution apportée par le characterization test |
| --- | --- |
| Refactoring aveugle | Le test capture le comportement avant refactoring |
| Peur de toucher au code | Le filet de sécurité libère le refactoring |
| Spécification orale perdue | Le test devient une documentation exécutable |

**Analogie concrète** : Pense à la restauration d'une statue ancienne. Avant de réparer une fissure, le restaurateur fait un moulage de la pièce dans son état actuel. Si la réparation déforme la statue, le moulage permet de revenir en arrière ou de comparer. Le characterization test est ce moulage : il fige l'état présent du code pour pouvoir le restaurer en cas de problème.

**Ce qu'un characterization test n'est PAS** :

- Un characterization test n'est pas un test métier. Il ne dit pas "ce comportement est correct", il dit "ce comportement existe aujourd'hui".
- Un characterization test n'est pas une spécification. Une spécification décrit ce que le code devrait faire. Le characterization test décrit ce qu'il fait réellement, même si c'est surprenant.
- Un characterization test n'est pas définitif. Une fois que la connaissance métier est validée, le test peut être réécrit en test métier explicite.

**Comparaison characterization test vs test métier** :

| Characterization test | Test métier |
| --- | --- |
| Fige le comportement actuel | Décrit le comportement attendu |
| Écrit sans interprétation | Écrit en accord avec une spécification |
| Servira durant le refactoring | Servira durablement comme documentation |
| Acceptable d'avoir des assertions surprenantes | Les assertions reflètent l'intention métier |
| Souvent jeté après refactoring stabilisé | Conservé dans la suite de tests |

---

### Prioriser les tests : matrice risque / effort

**Définition** : La matrice risque/effort est un outil de décision à deux axes qui aide à classer les zones de code à tester. L'axe risque va de "faible impact en cas de bug" à "impact critique". L'axe effort va de "test rapide à écrire" à "test long et coûteux à mettre en place".

**Le problème que la matrice résout** :

Sans matrice, voici les problèmes rencontrés :

1. **Choix arbitraires** : on teste ce qu'on a sous les yeux au lieu de ce qui apporte le plus de valeur.
2. **Effort gaspillé** : on commence par les zones à fort effort, on s'épuise, et on abandonne avant d'avoir couvert les zones simples mais importantes.
3. **Pas de critère commun** : dans une équipe, chacun a sa propre intuition de ce qui est prioritaire.

**Comment la matrice résout ces problèmes** :

| Problème | Solution apportée par la matrice |
| --- | --- |
| Choix arbitraires | Chaque zone est positionnée sur deux axes objectifs |
| Effort gaspillé | On démarre par fort risque et faible effort |
| Pas de critère commun | L'équipe partage le même langage de priorité |

**Analogie concrète** : Pense à une liste de courses à faire avec un budget limité de temps et d'argent. Tu listes les articles selon deux critères : à quel point ils sont indispensables et combien ils coûtent en temps ou en argent. Tu commences par ce qui est indispensable et bon marché, puis tu traites l'indispensable et cher, et tu laisses tomber le superflu cher. La matrice risque/effort fonctionne exactement de cette manière pour tes tests.

**Matrice à quatre cases** :

| | Faible effort | Fort effort |
| --- | --- | --- |
| **Fort risque** | À faire en premier | À planifier sur plusieurs sprints |
| **Faible risque** | Bonus quand on a du temps | À éviter (mauvais rapport coût / valeur) |

**Critères pour évaluer le risque d'une zone de code** :

- La zone manipule-t-elle de l'argent, des données personnelles ou de la sécurité ?
- La zone est-elle appelée par de nombreuses autres parties du code ?
- Un bug ici serait-il visible immédiatement par l'utilisateur final ?
- La zone a-t-elle déjà été source d'incidents par le passé ?

**Critères pour évaluer l'effort d'écriture d'un test** :

- Combien de dépendances faut-il mocker pour tester cette méthode ?
- Les entrées et sorties sont-elles simples (types primitifs) ou complexes (objets imbriqués) ?
- La méthode est-elle pure (mêmes entrées, mêmes sorties) ou dépend-elle de l'horloge, du système de fichiers, du réseau ?
- Le comportement actuel est-il documenté quelque part ?

---

## Étapes Pratiques

### Étape 1 : Générer un rapport de couverture HTML

Tu vas générer un rapport HTML détaillé qui te permettra de naviguer dans la couverture fichier par fichier.

Commande à exécuter à la racine du projet :

```bash
# XDEBUG_MODE=coverage active la collecte de couverture par Xdebug
# Sans cette variable, PHPUnit produit un rapport vide
XDEBUG_MODE=coverage php bin/phpunit --coverage-html var/coverage
```

**Résultat attendu** :

```text
PHPUnit 12.x by Sebastian Bergmann and contributors.

Runtime:       PHP 8.3.x with Xdebug 3.x.x
Configuration: /var/www/html/phpunit.dist.xml

........................................................         56 / 56 (100%)

Time: 00:04.231, Memory: 142.50 MB

OK (56 tests, 142 assertions)

Generating code coverage report in HTML format ... done [00:01.890]
```

Ouvre ensuite le fichier dans un navigateur :

```bash
# Sur macOS
open var/coverage/index.html

# Sur Linux (gnome)
xdg-open var/coverage/index.html
```

Ce que tu vois à l'ouverture :

- Un tableau avec une ligne par dossier de `src/`
- Trois colonnes principales : Classes, Methods, Lines (chacune avec un pourcentage)
- Un code couleur : vert (couvert), jaune (partiellement couvert), rouge (non couvert)
- La possibilité de cliquer sur un dossier puis un fichier pour voir la couverture ligne par ligne

**Lecture ligne par ligne** : dans la vue d'un fichier, les lignes en vert ont été exécutées par au moins un test, les lignes en rouge ne l'ont jamais été. Les lignes en jaune sont des conditions partiellement couvertes (uniquement visible avec la couverture de branche activée).

---

### Étape 2 : Identifier les zones non couvertes critiques

Ouvre le rapport HTML et fais le tri. Tu vas remplir un tableau qui te servira de plan d'action.

Méthode :

1. Note tous les fichiers à 0% de couverture qui sont dans `src/Service/`, `src/Controller/`, `src/Domain/` ou tout autre dossier métier.
2. Ignore pour l'instant les fichiers à 0% dans `src/Entity/` (souvent des accesseurs) et `src/Helpers/` (souvent du code utilitaire pur).
3. Pour chaque fichier retenu, évalue le risque (1 à 3) et l'effort (en heures ou en jours).

Exemple de tableau à compléter :

| Fichier | Couverture | Risque (1-3) | Effort estimé | Priorité |
| --- | --- | --- | --- | --- |
| `src/Service/OrderService.php` | 0% | 3 | 2 jours | Haute |
| `src/Service/PaymentGateway.php` | 0% | 3 | 3 jours | Haute |
| `src/Controller/CheckoutController.php` | 15% | 3 | 1 jour | Haute |
| `src/Helpers/StringUtils.php` | 0% | 1 | 1 heure | Basse |
| `src/Service/Notification.php` | 50% | 2 | 4 heures | Moyenne |

**Critère de priorité** :

- Haute : risque 3 et effort moyen ou faible
- Moyenne : risque 2 quelle que soit la taille, ou risque 3 avec effort élevé
- Basse : risque 1

**Résultat attendu** : un fichier `audit-couverture.md` à la racine du projet avec ce tableau, daté, partagé avec l'équipe. Tu auras un plan d'attaque clair.

---

### Étape 3 : Écrire un characterization test

Tu as identifié une méthode à protéger. Avant d'y toucher, tu vas figer son comportement.

Méthode pas à pas :

1. Lis le code de la méthode cible sans chercher à comprendre son intention.
2. Identifie les entrées (paramètres) et les sorties observables (valeur de retour, exceptions, effets de bord).
3. Choisis trois à cinq entrées typiques qui couvrent les principaux chemins.
4. Pour chaque entrée, exécute la méthode mentalement (ou réellement, dans un script de test) pour observer la sortie.
5. Écris un test qui appelle la méthode avec cette entrée et compare la sortie à ce que la méthode produit aujourd'hui, même si ce résultat te paraît étrange.

Exemple complet :

Code à protéger (extrait d'un projet existant) :

```php
<?php

namespace App\Service;

// Service legacy de formatage d'étiquettes
// Comportement actuel : met le prénom en majuscules, garde le nom de famille tel quel
class LabelFormatter
{
    public function format(string $fullName): string
    {
        $parts = explode(' ', $fullName);

        if (count($parts) < 2) {
            return strtoupper($fullName);
        }

        $firstName = strtoupper($parts[0]);
        $lastName = $parts[1];

        return $firstName . ' ' . $lastName;
    }
}
```

Characterization tests qui figent ce comportement :

```php
<?php

namespace App\Tests\Service;

use App\Service\LabelFormatter;
use PHPUnit\Framework\TestCase;

// On fige le comportement observé, sans le justifier
final class LabelFormatterCharacterizationTest extends TestCase
{
    private LabelFormatter $service;

    protected function setUp(): void
    {
        $this->service = new LabelFormatter();
    }

    public function testFormatKeepsCurrentBehaviorForMixedCase(): void
    {
        // Comportement observé : prénom en majuscules, nom inchangé
        static::assertSame(
            'JEAN dupont',
            $this->service->format('Jean DUPONT'),
        );
    }

    public function testFormatHandlesSingleWordWithUppercase(): void
    {
        // Comportement observé : un seul mot est entièrement passé en majuscules
        static::assertSame(
            'MARTIN',
            $this->service->format('Martin'),
        );
    }

    public function testFormatIgnoresThirdNamePart(): void
    {
        // Comportement observé : les parties au-delà de la deuxième sont ignorées
        static::assertSame(
            'JEAN-PIERRE dupont',
            $this->service->format('Jean-Pierre dupont de la Tour'),
        );
    }
}
```

**Résultat attendu** :

```text
PHPUnit 12.x by Sebastian Bergmann and contributors.

...                                                                 3 / 3 (100%)

Time: 00:00.142, Memory: 14.50 MB

OK (3 tests, 3 assertions)
```

Le test passe. Le comportement actuel est protégé. Tu peux maintenant refactorer sans crainte.

---

### Étape 4 : Refactorer sous protection du test

Le filet de sécurité est en place. Tu peux modifier le code.

Code refactoré (extrait de la même méthode) :

```php
<?php

namespace App\Service;

// Version refactorée : extraction d'une méthode pour la lisibilité
class LabelFormatter
{
    public function format(string $fullName): string
    {
        $parts = $this->splitName($fullName);

        if ($this->isSingleWord($parts)) {
            return strtoupper($fullName);
        }

        return strtoupper($parts[0]) . ' ' . $parts[1];
    }

    private function splitName(string $fullName): array
    {
        return explode(' ', $fullName);
    }

    private function isSingleWord(array $parts): bool
    {
        return count($parts) < 2;
    }
}
```

Relance les tests :

```bash
php bin/phpunit tests/Service/LabelFormatterCharacterizationTest.php
```

**Résultat attendu** :

```text
OK (3 tests, 3 assertions)
```

Les tests passent encore : le refactoring n'a pas modifié le comportement observable. Si un test avait échoué, deux interprétations possibles :

1. Le refactoring change involontairement un comportement. À corriger avant de continuer.
2. Le comportement initial était surprenant et le refactoring l'a rendu plus cohérent. À discuter avec l'équipe et le métier pour valider si le nouveau comportement est acceptable.

---

### Étape 5 : Mesurer la progression de la couverture

Au fil des semaines, tu veux savoir si tu progresses. Relance régulièrement le rapport.

Commande pour un suivi rapide en mode texte :

```bash
# Rapport texte rapide, idéal pour un suivi régulier
XDEBUG_MODE=coverage php bin/phpunit --coverage-text
```

**Résultat attendu** :

```text
Code Coverage Report:
  2026-05-18 09:42:11

 Summary:
  Classes: 42.50% (17/40)
  Methods: 51.30% (118/230)
  Lines:   48.20% (1245/2583)

\App\Service::OrderService
  Methods: 100.00% ( 8/ 8)   Lines:  95.40% (124/130)

\App\Service::PaymentGateway
  Methods:  62.50% ( 5/ 8)   Lines:  58.20% ( 74/127)

\App\Service::LabelFormatter
  Methods: 100.00% ( 3/ 3)   Lines: 100.00% ( 18/ 18)
```

Tableau de suivi à tenir, par exemple dans un fichier `audit-couverture.md` :

| Semaine | Couverture globale | Tests ajoutés | Characterization tests | Refactorings effectués |
| --- | --- | --- | --- | --- |
| S01 | 32% | 0 | 0 | 0 |
| S02 | 38% | 12 | 8 | 1 |
| S03 | 44% | 20 | 14 | 3 |
| S04 | 48% | 26 | 18 | 5 |

**Principe de suivi** : ne fixe pas un objectif chiffré absolu (genre "80% obligatoire"). Trace une tendance positive sur les zones identifiées comme prioritaires. La progression vaut plus que la valeur instantanée.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `XDEBUG_MODE=coverage php bin/phpunit --coverage-html var/coverage` | Génère un rapport HTML détaillé navigable |
| `XDEBUG_MODE=coverage php bin/phpunit --coverage-text` | Rapport texte rapide pour suivi quotidien |
| `XDEBUG_MODE=coverage php bin/phpunit --coverage-clover coverage.xml` | Rapport machine-readable pour intégration CI |
| `XDEBUG_MODE=coverage php bin/phpunit --coverage-text --coverage-filter src/Service` | Limite la mesure à un sous-dossier (option `--whitelist` supprimée depuis PHPUnit 10) |
| `php bin/phpunit --testsuite characterization` | Exécute uniquement la suite de characterization tests |
| `php -dpcov.enabled=1 vendor/bin/phpunit --coverage-text` | Utilise PCOV (alternative plus rapide à Xdebug pour la couverture) |

---

## Pièges Fréquents

### Piège 1 : Viser 100% de couverture comme objectif

⚠️ **Problème** : Tu décides que toute la suite doit atteindre 100%. Tu passes des heures à écrire des tests sur des accesseurs triviaux et tu ajoutes du code mort pour faire monter le chiffre.

✅ **Solution** : Vise une couverture significative sur le code critique. Un service de paiement à 90% bien testé vaut mille fois mieux qu'un projet à 100% rempli de tests qui exécutent sans vérifier.

```php
<?php

// À ne PAS tester explicitement : accesseur trivial
public function getId(): int
{
    return $this->id;
}
```

---

### Piège 2 : Tester des accesseurs sans logique

⚠️ **Problème** : Tu écris des tests qui vérifient que `getId()` retourne bien ce que tu as injecté avec `setId()`. La couverture monte mais aucune valeur n'est ajoutée.

✅ **Solution** : Concentre ton effort sur les méthodes qui contiennent une logique conditionnelle, des calculs, des appels à des services externes. Laisse les accesseurs triviaux non testés (ils seront couverts indirectement par les tests des méthodes qui les utilisent).

---

### Piège 3 : Confondre characterization test et spécification métier

⚠️ **Problème** : Tu mélanges dans le même fichier de tests des assertions qui figent un comportement bizarre observé et des assertions qui décrivent un comportement métier attendu. Plus tard, personne ne sait quels tests sont à conserver et quels tests sont à réécrire.

✅ **Solution** : Sépare physiquement les deux familles de tests. Place les characterization tests dans `tests/Characterization/` avec un suffixe `CharacterizationTest` clair, et les tests métier dans `tests/Unit/` ou `tests/Integration/`.

```text
tests/
├── Characterization/
│   └── Service/
│       └── LabelFormatterCharacterizationTest.php
├── Unit/
│   └── Service/
│       └── LabelFormatterTest.php
└── Integration/
    └── ...
```

---

### Piège 4 : Refactorer avant d'avoir écrit le characterization test

⚠️ **Problème** : Tu commences par "nettoyer un peu" la méthode avant d'écrire le test. Le test que tu écris ensuite fige le comportement déjà modifié, pas le comportement original. Si un bug existait dans le code initial et qu'il a été déplacé par ton nettoyage, personne ne le verra.

✅ **Solution** : Discipline stricte : test d'abord, refactoring ensuite. Si tu te surprends à modifier le code avant le test, reviens en arrière (`git checkout -- fichier.php`) et recommence dans le bon ordre.

---

### Piège 5 : Tester du code qu'on ne contrôle pas

⚠️ **Problème** : Tu écris des tests qui vérifient le comportement de Doctrine, Symfony, EasyAdmin ou une bibliothèque tierce. Ces tests deviennent fragiles à chaque mise à jour de la dépendance, et tu rejoues un travail déjà fait par leurs équipes.

✅ **Solution** : Teste ton code, pas le code des bibliothèques. Si tu utilises un repository Doctrine, ne teste pas que `findBy()` retourne les bonnes lignes (c'est le travail des tests de Doctrine). Teste que ton code utilise correctement le repository et réagit bien à ses retours.

---

## Checklist de Validation

- [ ] Je sais générer un rapport de couverture HTML avec PHPUnit et Xdebug
- [ ] Je sais lire un rapport et identifier les zones critiques non couvertes
- [ ] Je distingue couverture de ligne et couverture de branche
- [ ] Je sais que la couverture ne suffit pas : je la croise toujours avec le risque
- [ ] Je sais écrire un characterization test sans interpréter le code
- [ ] Je connais la matrice risque/effort et je l'utilise pour prioriser
- [ ] Je sais quand un code à 0% de couverture n'est pas un problème (accesseurs, code mort)
- [ ] Je distingue un test qui exécute (qui fait monter la couverture) et un test qui vérifie (qui apporte une garantie)
- [ ] Je sais relancer la mesure régulièrement pour suivre une tendance

---

## Exercice Pratique

**Énoncé** : Tu reprends un service legacy non testé, `PriceFormatter`. Ton objectif est d'écrire des characterization tests pour figer son comportement avant de pouvoir le refactorer en confiance.

Code à étudier :

```php
<?php

namespace App\Service;

class PriceFormatter
{
    public function format(?float $price, string $currency = 'EUR'): string
    {
        if ($price === null) {
            return '';
        }

        if ($price < 0) {
            return '-' . number_format(abs($price), 2, ',', ' ') . ' ' . $currency;
        }

        return number_format($price, 2, ',', ' ') . ' ' . $currency;
    }
}
```

**Indications** :

- Écris quatre characterization tests qui figent le comportement actuel : une entrée nulle, une entrée positive standard, une entrée négative, une entrée avec une devise différente de l'euro.
- Ne juge pas le comportement actuel. Fige uniquement ce que la méthode produit aujourd'hui.
- Identifie ensuite un cas limite douteux (par exemple : valeur zéro, valeur très grande, valeur avec plus de deux décimales) et écris un cinquième test pour ce cas.
- Note dans un commentaire les comportements que tu trouves surprenants et qui mériteraient une discussion avec le métier avant refactoring.

**Résultat attendu** : un fichier de tests `PriceFormatterCharacterizationTest.php` avec cinq méthodes de test, toutes passantes, et au moins un commentaire qui signale un cas à clarifier.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier de characterization tests :

```php
<?php

namespace App\Tests\Characterization\Service;

use App\Service\PriceFormatter;
use PHPUnit\Framework\TestCase;

// Tests qui figent le comportement actuel de PriceFormatter
// Aucun test ne juge si le comportement est correct ou non
final class PriceFormatterCharacterizationTest extends TestCase
{
    private PriceFormatter $service;

    protected function setUp(): void
    {
        $this->service = new PriceFormatter();
    }

    public function testFormatReturnsEmptyStringForNullPrice(): void
    {
        // Comportement observé : null produit une chaîne vide
        // À clarifier avec le métier : faut-il plutôt retourner "Prix indisponible" ?
        static::assertSame(
            '',
            $this->service->format(null),
        );
    }

    public function testFormatHandlesStandardPositivePriceInEuros(): void
    {
        // Comportement observé : 1234.56 devient "1 234,56 EUR"
        // Espace insécable comme séparateur de milliers, virgule pour les décimales
        static::assertSame(
            '1 234,56 EUR',
            $this->service->format(1234.56),
        );
    }

    public function testFormatPrependsMinusSignForNegativePrice(): void
    {
        // Comportement observé : -50.00 devient "-50,00 EUR"
        // La valeur absolue est formatée puis préfixée d'un signe moins
        static::assertSame(
            '-50,00 EUR',
            $this->service->format(-50.00),
        );
    }

    public function testFormatUsesProvidedCurrency(): void
    {
        // Comportement observé : la devise passée en paramètre remplace EUR
        static::assertSame(
            '100,00 USD',
            $this->service->format(100.00, 'USD'),
        );
    }

    public function testFormatHandlesZeroAsPositiveValue(): void
    {
        // Cas limite douteux : zéro est traité comme un nombre positif (pas comme une entrée nulle)
        // Le code utilise `< 0` pour détecter le négatif, donc 0 tombe dans la branche positive
        // À clarifier avec le métier : faut-il afficher "Gratuit" plutôt que "0,00 EUR" ?
        static::assertSame(
            '0,00 EUR',
            $this->service->format(0),
        );
    }
}
```

Résultat de l'exécution :

```text
PHPUnit 12.x by Sebastian Bergmann and contributors.

.....                                                               5 / 5 (100%)

Time: 00:00.124, Memory: 14.50 MB

OK (5 tests, 5 assertions)
```

**Comportements à clarifier avec le métier avant refactoring** :

| Comportement observé | Question à poser au métier |
| --- | --- |
| `format(null)` retourne une chaîne vide | Faut-il un message explicite "Prix indisponible" ? |
| `format(0)` retourne "0,00 EUR" | Faut-il afficher "Gratuit" pour les produits à prix nul ? |
| Espace utilisé comme séparateur de milliers | Est-ce conforme à la charte d'affichage des prix sur le site ? |
| La devise par défaut est "EUR" en clair | Faudrait-il un symbole "€" plutôt que les trois lettres "EUR" ? |

Une fois ces points clarifiés avec le métier :

- Si le métier valide le comportement actuel, les characterization tests peuvent être convertis en tests métier explicites (en réécrivant les messages d'assertion et les noms de méthodes).
- Si le métier demande un changement, on modifie le code, on met à jour les tests, et on documente la décision dans le changelog du projet.

---

## Navigation

← Fiche précédente : **[Réflexion pour les tests](13-reflection-tests.md)**

→ Fiche suivante : **[Projet intégrateur](15-projet-integrateur.md)**
