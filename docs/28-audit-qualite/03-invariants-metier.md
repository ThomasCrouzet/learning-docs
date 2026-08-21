---
tags:
  - Audit
  - DDD
  - Méthodologie
description: "Identifier les invariants métier : propriétés toujours vraies qu'il faut absolument protéger par des tests. Méthode pour les détecter et les formaliser."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 6
cursus: "Audit et Qualité"
id: "transversal.audit.invariants-metier"
course_id: "transversal.audit"
content_type: "lesson"
order: 3
---

# 03 - Identifier les invariants métier

> **En bref** : Un invariant est une propriété qui doit TOUJOURS être vraie quelles que soient les opérations. Identifier les bons invariants concentre l'effort de test là où une régression coûterait cher. Cette fiche te donne une méthode et des exemples. Lecture estimée : 60 min.

## Prérequis

- Fiche 2 : [Cartographier une application](02-cartographier-application.md)
- Fiche : [Introduction au DDD](../10-architecture/09-introduction-ddd.md) (notions de DDD)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras formuler un invariant en une phrase, distinguer invariant et règle métier conditionnelle, et trouver des invariants en lisant le code et la base de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un invariant ?

**Définition** : Un invariant est une propriété qui reste vraie quelles que soient les opérations légales effectuées sur le système. Si une opération viole un invariant, c'est qu'elle est interdite, qu'elle contient un bug, ou que l'invariant est mal formulé.

**Le problème que les invariants résolvent** :

Sans invariants explicites, voici les problèmes rencontrés :

1. **Tests fragiles** : tester un comportement spécifique sans invariant produit beaucoup de tests qui cassent au moindre refactoring.
2. **Tests dispersés** : on teste les cas qui viennent à l'esprit, sans garantie d'avoir couvert les propriétés critiques.
3. **Régressions cachées** : un bug peut casser une propriété fondamentale sans qu'aucun test ne s'en aperçoive.

**Comment les invariants résolvent ces problèmes** :

| Problème | Solution apportée par les invariants |
| --- | --- |
| Tests fragiles | Un test d'invariant reste valide même quand l'implémentation change |
| Tests dispersés | La liste d'invariants donne un cadre de couverture systématique |
| Régressions cachées | Casser un invariant fait toujours échouer son test |

**Analogie concrète** : Pense à la règle "la somme des angles d'un triangle plat fait 180°". Peu importe la forme du triangle, peu importe l'ordre dans lequel tu mesures les angles, le résultat est toujours 180°. C'est un invariant. Tu peux construire des théorèmes plus complexes par-dessus en t'appuyant sur cette certitude.

**Ce qu'un invariant n'est PAS** :

- Un invariant n'est pas un cas particulier. Un cas particulier ne se produit que dans certaines conditions, un invariant doit toujours tenir.
- Un invariant n'est pas une règle conditionnelle. "Une commande supérieure à 100 € donne droit à la livraison gratuite" est une règle métier, pas un invariant.
- Un invariant n'est pas une préférence de design. "On préfère injecter les dépendances" est un choix d'architecture, pas une propriété observable du système.

---

### Invariant vs règle métier vs cas limite

**Définition** : Trois notions souvent confondues mais qui se testent différemment.

**Le problème que cette distinction résout** :

Sans distinguer ces trois notions, voici les problèmes rencontrés :

1. **Tests mal nommés** : un test d'invariant et un test de cas limite ont des objectifs différents, les mélanger rend la suite de tests difficile à maintenir.
2. **Couverture trompeuse** : on croit avoir testé un invariant alors qu'on a testé un cas particulier.
3. **Discussions confuses** : sans vocabulaire commun, l'équipe ne sait pas si elle parle de la même chose.

**Comment cette distinction résout ces problèmes** :

| Notion | Quand est-ce vrai ? | Exemple |
| --- | --- | --- |
| Invariant | Toujours | Une commande appartient à exactement un client |
| Règle métier | Dans certaines conditions | Une commande de plus de 100 € donne droit à la livraison gratuite |
| Cas limite | À la frontière d'un cas valide | Commande à exactement 100 €, valeur nulle, tableau vide |

**Analogie concrète** : Pense à une route. L'invariant est "il y a deux côtés à la route". La règle métier est "à droite, c'est l'allée des cyclistes après 8h". Le cas limite est "que se passe-t-il à 8h00 pile ?". Les trois s'observent sur la même route, mais ne se contrôlent pas de la même manière.

**Comparaison des trois notions** :

| Notion | Test typique | Formulation |
| --- | --- | --- |
| Invariant | "doit toujours" | Une propriété sans condition |
| Règle métier | "doit faire X quand Y" | Une implication |
| Cas limite | "que se passe-t-il à la frontière" | Un scénario précis |

Les invariants se traduisent en tests de type "doit toujours". Les règles métier en tests "doit faire X quand Y". Les cas limites en tests "que se passe-t-il à la frontière".

---

### Cinq sources d'invariants

**Définition** : Cinq endroits où chercher les invariants dans un projet existant.

**Le problème que cette grille résout** :

Sans grille de recherche, voici les problèmes rencontrés :

1. **Invariants oubliés** : on liste les invariants qui viennent à l'esprit, sans méthode pour vérifier qu'on a couvert l'essentiel.
2. **Effort dispersé** : on regarde un peu partout sans savoir ce qu'on cherche.
3. **Discussion sans support** : difficile de challenger une liste d'invariants si on ne sait pas comment elle a été produite.

**Comment cette grille résout ces problèmes** :

| Source | Comment l'exploiter |
| --- | --- |
| Contraintes en base de données | Lire le schéma (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) |
| Validateurs côté entité | Lire les annotations / attributs Assert |
| Code défensif | Chercher les `throw new \DomainException(...)` |
| Tests existants | Lire les `assertSame`, `assertTrue` actuels |
| Conversation avec le métier | Demander "qu'est-ce qui ne doit jamais arriver ?" |

**Analogie concrète** : Pense à un inspecteur du bâtiment qui visite une maison. Il ne se contente pas de regarder un mur, il consulte les plans, vérifie les normes, interroge l'architecte, examine les fondations. Les cinq sources sont les cinq angles qu'il faut systématiquement consulter pour ne rien laisser passer.

**Ce que cette grille n'est PAS** :

- Cette grille n'est pas exhaustive. Selon le projet, d'autres sources existent (configuration, machine d'état).
- Cette grille n'est pas un classement de priorité. Toutes les sources peuvent révéler des invariants critiques.

---

### Trois familles d'invariants

**Définition** : Les invariants se répartissent en trois familles selon ce qu'ils protègent.

**Le problème que cette taxonomie résout** :

Sans classer les invariants, voici les problèmes rencontrés :

1. **Liste désordonnée** : 50 invariants en vrac sont difficiles à exploiter.
2. **Couverture inégale** : on couvre bien une famille et on oublie les autres.
3. **Priorisation difficile** : sans famille, dur de comparer la criticité.

**Comment cette taxonomie résout ces problèmes** :

| Famille | Exemples |
| --- | --- |
| Structurels | Champ obligatoire, type, format (email valide) |
| Relationnels | Une commande a 1 client, un produit appartient à 1 catégorie |
| Métier / comportementaux | Un compte désactivé ne peut pas se connecter, une facture validée ne peut pas être modifiée |

**Analogie concrète** : Pense à une voiture. Les invariants structurels sont "elle a 4 roues, un moteur, un volant". Les invariants relationnels sont "chaque roue est attachée à un essieu". Les invariants comportementaux sont "le frein arrête la voiture, le démarreur ne fonctionne pas si la batterie est vide". Toutes ces familles sont nécessaires pour qu'une voiture soit une voiture.

**Ce que cette taxonomie n'est PAS** :

- Cette taxonomie n'est pas étanche. Un invariant peut appartenir à plusieurs familles (ex : "un Order a un User" est relationnel et structurel).
- Cette taxonomie n'est pas un classement de difficulté. Les invariants comportementaux sont souvent les plus subtils, mais pas systématiquement.

---

### Formuler un bon invariant

**Définition** : Un bon invariant se reconnaît à plusieurs critères objectifs : il tient en une phrase, il est vérifiable par un test automatique, il est inconditionnel et il dit quelque chose de non trivial.

**Le problème que cette formulation résout** :

Sans critères de formulation, voici les problèmes rencontrés :

1. **Invariants intestables** : "le système doit être sécurisé" ne peut pas être traduit en test.
2. **Invariants trop larges** : "les données doivent être correctes" couvre tout et rien.
3. **Faux invariants** : "sauf le mardi, c'est immuable" est en réalité une règle conditionnelle.

**Comment ces critères résolvent ces problèmes** :

| Critère | Bon invariant | Mauvais invariant |
| --- | --- | --- |
| Une phrase | "Une commande appartient à exactement un client" | "Les commandes doivent toujours être traitées correctement" |
| Vérifiable par test | "Un User désactivé ne peut pas s'authentifier" | "Le système doit être sécurisé" |
| Pas conditionnel | "Une transaction validée est immuable" | "Sauf le mardi, les transactions sont immuables" |
| Pas trivial | "Un email contient un `@`" | "Un email est une chaîne" |

**Analogie concrète** : Pense à un cahier des charges chez un menuisier. "Une étagère solide" est une intention vague. "Une étagère supporte 30 kg répartis sur sa longueur sans se déformer de plus de 2 mm" est un invariant testable. La différence entre intention et invariant, c'est la possibilité de mesurer un échec sans débat.

**Ce qu'un bon invariant n'est PAS** :

- Un bon invariant n'est pas une longue description. Si tu ne peux pas tenir en une phrase, tu mélanges probablement plusieurs invariants.
- Un bon invariant n'est pas un voeu pieux. Il doit être déjà vrai dans le code, sinon c'est un objectif à atteindre, pas une propriété à protéger.

---

## Étapes Pratiques

### Étape 1 : Extraire les invariants structurels du schéma de base

Commence par interroger le catalogue PostgreSQL pour lister les contraintes du schéma.

Commande ou code :

```sql
-- Repérer les contraintes NOT NULL
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
  AND is_nullable = 'NO';

-- Repérer les contraintes UNIQUE
SELECT constraint_name, column_name
FROM information_schema.constraint_column_usage
JOIN information_schema.table_constraints USING (constraint_name)
WHERE constraint_type = 'UNIQUE';

-- Repérer les FOREIGN KEY
SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

Chaque ligne renvoyée par ces requêtes correspond à un invariant structurel à recopier dans ta cartographie.

**Résultat attendu** :

```text
Invariants structurels de la table orders :
- orders.user_id NOT NULL → un Order a toujours un User
- orders.email NOT NULL → un Order a toujours un email
- orders.token UNIQUE → deux Orders ne peuvent pas partager le même token
- orders.user_id REFERENCES users(id) → l'utilisateur référencé existe
```

---

### Étape 2 : Extraire les invariants des entités

Lis les annotations ou attributs Assert sur les entités Doctrine.

Commande ou code :

```php
<?php

class Order
{
    #[ORM\Column(length: 64)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 64, max: 64)]
    #[Assert\Regex('/^[a-f0-9]+$/')]
    private string $token;
}
```

Chaque contrainte de validation se traduit en un invariant à protéger.

**Résultat attendu** :

```text
Invariants extraits de Order::token :
- Order::token n'est jamais vide
- Order::token fait exactement 64 caractères
- Order::token ne contient que des caractères hexadécimaux
```

---

### Étape 3 : Chercher le code défensif

Le code applicatif qui lève des exceptions explicites encode souvent des invariants implicites.

Commande ou code :

```bash
# Chercher toutes les exceptions levées explicitement (hors \Exception générique)
grep -rn "throw new" src/ | grep -v "throw new \\\\Exception"
```

Examine chaque résultat et reformule l'invariant qu'il protège.

```php
<?php

public function transitionTo(string $newStatus): void
{
    if ($this->status === 'cancelled') {
        throw new \DomainException('Une commande annulée ne peut pas changer de statut');
    }
    $this->status = $newStatus;
}
```

**Résultat attendu** :

```text
Invariant extrait du code défensif :
- Une commande annulée ne peut pas changer de statut
```

---

### Étape 4 : Compiler dans un tableau

Toutes les sources convergent vers un tableau unique, prolongement de la cartographie de la fiche 2.

Format de référence :

| ID | Invariant | Famille | Source | Test existant ? |
| --- | --- | --- | --- | --- |
| I-01 | Un Order appartient à exactement un User | Relationnel | FK + entité | Non |
| I-02 | Le token d'un Order fait 64 hex | Structurel | Assert | Non |
| I-03 | Un Order annulé est immuable | Métier | Code défensif | Partiel |

**Résultat attendu** :

```text
Cette table devient le squelette de ta suite de tests prioritaires.
Chaque ligne sans test existant est un candidat immédiat pour la prochaine fiche.
```

---

### Étape 5 : Confronter au métier

Tous les invariants identifiés en lisant le code ne sont pas forcément les bons. Présente la liste à une personne qui connaît le métier et pose les questions suivantes.

Questions à poser :

- "Cet invariant correspond-il à une vraie règle métier ou à un choix d'implémentation ?"
- "Y a-t-il un invariant que tu attendais et qui n'apparaît pas ?"
- "L'un de ces invariants te semble-t-il superflu ?"

**Résultat attendu** :

```text
L'écart entre ce qu'encode le code et ce qu'attend le métier est souvent la source de bugs.
Les invariants attendus mais absents du code deviennent des candidats à ajouter.
Les invariants présents dans le code mais inutiles métier sont à supprimer.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `pg_dump --schema-only` | Récupérer le schéma complet |
| `information_schema.columns` | Lister les contraintes NOT NULL |
| `information_schema.table_constraints` | Lister UNIQUE et FOREIGN KEY |
| `grep -rn "Assert\\\\" src/Entity` | Repérer les annotations de validation |
| `grep -rn "throw new" src/` | Repérer le code défensif |
| `php bin/console doctrine:schema:validate` | Vérifier la cohérence schéma / entités |

---

## Pièges Fréquents

### Piège 1 : Confondre invariant et règle métier

⚠️ **Problème** : Tu listes "une commande de plus de 100 € donne livraison gratuite" comme un invariant. Cette propriété est conditionnelle, elle ne tient que pour les commandes supérieures à 100 €.

✅ **Solution** : Reformule la propriété en supprimant la condition. Si tu ne peux pas, c'est une règle métier, pas un invariant. À l'inverse, "une commande appartient à un client" est inconditionnel et reste donc un invariant.

### Piège 2 : Invariants trop vagues

⚠️ **Problème** : Tu formules "le système doit être sécurisé" comme un invariant. Cette formulation ne peut être traduite en aucun test précis.

✅ **Solution** : Décompose en propriétés précises et testables : "un mot de passe stocké n'est jamais en clair", "un utilisateur désactivé ne peut pas s'authentifier", etc.

### Piège 3 : Invariants tirés du code mais incorrects

⚠️ **Problème** : Le code encode involontairement un invariant à cause d'un bug ou d'une contrainte oubliée. Tu prends ce comportement pour vérité.

✅ **Solution** : Toujours confronter la liste à un humain qui connaît le métier. Un invariant légitime doit pouvoir être justifié par une règle métier, pas seulement par une ligne de code.

### Piège 4 : Lister 200 invariants

⚠️ **Problème** : Tu listes tout ce qui pourrait ressembler à un invariant. Si tout est invariant, plus rien n'est prioritaire.

✅ **Solution** : Hiérarchise par criticité (voir fiche 4). Concentre l'effort de test sur les 20 % d'invariants qui couvrent 80 % du risque.

### Piège 5 : Oublier les invariants implicites

⚠️ **Problème** : Tu regardes les colonnes mais pas les index. Un index unique partiel comme `UNIQUE INDEX (email) WHERE deleted_at IS NULL` encode un invariant subtil.

✅ **Solution** : Liste systématiquement les index, les triggers, les contraintes CHECK et les exclusion constraints. Chaque mécanisme du SGBD peut porter un invariant.

---

## Checklist de Validation

- [ ] Je sais distinguer invariant, règle métier et cas limite
- [ ] Je sais formuler un invariant en une phrase testable
- [ ] J'ai listé les invariants structurels d'au moins une table
- [ ] J'ai lu les attributs Assert d'au moins une entité
- [ ] J'ai cherché les `throw new` dans le code applicatif
- [ ] J'ai confronté ma liste à une personne qui connaît le métier

---

## Exercice Pratique

**Énoncé** : Tu disposes du schéma SQL ci-dessous :

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX customers_email_active ON customers(email) WHERE deleted_at IS NULL;

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(16) NOT NULL DEFAULT 'draft',
    issued_at TIMESTAMP NULL
);
```

**Indications** :

- Liste tous les invariants STRUCTURELS extraits du schéma
- Formule 2 invariants MÉTIER probables (à confronter au métier en réalité)
- Donne 2 cas limites à tester (pas des invariants, mais des cas frontaliers)

**Résultat attendu** : Une liste organisée en trois groupes (structurels, métier probables, cas limites) qui couvre tout ce que le schéma révèle.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Invariants structurels** :

- I-01 : Une `customers.id` est unique (PRIMARY KEY)
- I-02 : Un `customer.email` n'est pas null
- I-03 : Deux `customers` actifs (non supprimés) ne peuvent pas avoir le même email (index unique partiel)
- I-04 : Une `invoice` appartient à exactement un `customer`
- I-05 : Le `customer` référencé existe (FOREIGN KEY)
- I-06 : Une `invoice.total` est positive ou nulle (CHECK)
- I-07 : Une `invoice.status` n'est pas null (par défaut `draft`)

**Invariants métier probables** :

- M-01 : Une facture émise (`issued_at` non null) ne devrait pas pouvoir être supprimée par soft delete sans trace
- M-02 : Une facture au statut `paid` est immuable

Ces deux invariants méritent d'être confrontés au métier avant d'écrire des tests : ils ne sont pas garantis par le schéma mais probablement attendus.

**Cas limites** :

- C-01 : Insertion d'une facture avec `total = 0` (accepté par le CHECK, mais a-t-il du sens métier ?)
- C-02 : Soft delete d'un `customer` qui a des factures non payées (que devient l'historique financier ?)

Ces deux cas ne sont pas des invariants : ce sont des scénarios frontaliers qui méritent un test explicite pour clarifier le comportement attendu.

---

## Navigation

← Fiche précédente : **[Cartographier une application](02-cartographier-application.md)**

→ Fiche suivante : **[Prioriser les risques](04-prioriser-risques.md)**
