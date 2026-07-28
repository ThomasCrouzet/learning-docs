---
tags:
  - Outils IA
  - Débutant
  - Pratique
description: "Utiliser l'IA pour apprendre et communiquer"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 2
cursus: "Outils IA"
---

# 01 - Utiliser l'IA pour apprendre et communiquer

> **En bref** : À la fin de cette fiche, tu sauras comment fonctionne une IA conversationnelle, formuler des questions précises pour obtenir des réponses utiles, et vérifier si une réponse d'IA est correcte. Lecture estimée : 55 min.


## Prérequis

Aucune connaissance préalable n'est requise (tout est expliqué ci-dessous).

## Objectif de cette fiche

À la fin de cette fiche, tu sauras :

- Comprendre comment fonctionne une IA conversationnelle et ses limites
- Formuler des questions précises pour obtenir des réponses utiles
- Vérifier si une réponse d'IA est correcte
- Utiliser des templates prêts à l'emploi pour le code et les mails professionnels

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux sections pratiques.

### Qu'est-ce qu'une IA conversationnelle ?

**Définition** : Une IA conversationnelle est un programme informatique capable de comprendre des questions en langage naturel et d'y répondre sous forme de texte.

**Le problème que l'IA conversationnelle résout** :

Sans IA conversationnelle, voici les problèmes rencontrés :

1. **Recherche fastidieuse** : Tu dois parcourir de nombreuses pages de documentation pour trouver une réponse.
2. **Pas de personnalisation** : Les tutoriels en ligne ne répondent pas à ton cas précis.
3. **Barrière du jargon** : Les explications techniques sont difficiles à comprendre sans contexte.

**Comment l'IA conversationnelle résout ces problèmes** :

| Problème                | Solution apportée par l'IA                                   |
| ----------------------- | ------------------------------------------------------------ |
| Recherche fastidieuse   | Tu poses ta question et obtiens une réponse directe          |
| Pas de personnalisation | Tu peux donner ton contexte et obtenir une réponse adaptée   |
| Barrière du jargon      | Tu peux demander des explications simples avec des analogies |

**Analogie concrète** : Imagine un assistant qui a lu des millions de livres, articles et documentations. Il peut te résumer ce qu'il a lu et répondre à tes questions. Cependant, il n'a jamais pratiqué lui-même : il répète ce qu'il a appris, avec un risque d'erreurs factuelles (hallucinations).

**Ce qu'une IA conversationnelle n'est PAS** :

- Une IA conversationnelle n'est pas un moteur de recherche. Un moteur de recherche (Google, DuckDuckGo) te donne des liens vers des pages web. Une IA te donne directement une réponse rédigée.
- Une IA conversationnelle n'est pas infaillible. Elle peut donner des réponses fausses avec beaucoup d'assurance.
- Une IA conversationnelle n'est pas connectée à internet en temps réel (sauf si explicitement indiqué). Ses connaissances ont une date limite.

---

### Comment fonctionne une IA (version simplifiée)

**Définition** : Une IA conversationnelle fonctionne par prédiction de mots. Elle calcule, mot après mot, quel est le mot le plus probable à écrire ensuite.

**Le problème que comprendre le fonctionnement résout** :

Sans comprendre comment l'IA fonctionne, voici les problèmes rencontrés :

1. **Confiance aveugle** : Tu crois que l'IA "sait" alors qu'elle "prédit".
2. **Incompréhension des erreurs** : Tu ne comprends pas pourquoi l'IA peut inventer des choses.
3. **Mauvaise utilisation** : Tu poses des questions d'une manière qui produit de mauvaises réponses.

**Comment comprendre le fonctionnement résout ces problèmes** :

| Problème                    | Solution                                              |
| --------------------------- | ----------------------------------------------------- |
| Confiance aveugle           | Tu sais que l'IA prédit, donc tu vérifies             |
| Incompréhension des erreurs | Tu comprends pourquoi elle peut "inventer"            |
| Mauvaise utilisation        | Tu structures tes questions pour guider la prédiction |

**Analogie concrète** : Imagine que tu commences une phrase : "Le chat est sur le..." L'IA va prédire "toit", "canapé" ou "lit" parce que ces mots apparaissent souvent après cette phrase dans les textes qu'elle a lus. Elle ne "voit" pas de chat, elle prédit statistiquement le mot suivant.

**Deux concepts importants** :

1. **Les hallucinations** : Quand l'IA prédit une suite de mots qui semble logique mais qui est fausse. Par exemple, elle peut inventer un nom de fonction qui n'existe pas parce que ce nom "semble probable".

2. **La fenêtre de contexte** : L'IA a une mémoire limitée à la conversation en cours. Si la conversation devient trop longue, elle "oublie" le début. C'est comme parler avec quelqu'un qui ne se souvient que des 10 dernières minutes de discussion.

---

### Les hallucinations de l'IA

**Définition** : Une hallucination est une réponse que l'IA génère avec assurance, mais qui est partiellement ou totalement fausse.

**Le problème que les hallucinations posent** :

1. **Code non fonctionnel** : L'IA invente des fonctions ou des classes qui n'existent pas.
2. **Versions obsolètes** : L'IA propose du code pour une ancienne version du langage.
3. **Fausses informations** : L'IA affirme des choses incorrectes avec certitude.

**Exemples concrets d'hallucinations** :

| Type d'hallucination     | Exemple                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| Fonction inventée        | L'IA suggère `$user->getFullName()` alors que cette méthode n'existe pas dans ta classe |
| Version obsolète         | L'IA propose `@Route` (Symfony 5) au lieu de `#[Route]` (Symfony 7)                     |
| Documentation fausse     | L'IA cite une page de documentation qui n'existe pas                                    |
| Bibliothèque inexistante | L'IA recommande d'installer un package qui n'existe pas sur Packagist                   |

**Pourquoi c'est dangereux** : L'IA ne dit jamais "je ne sais pas" ou "je ne suis pas sûre". Elle répond toujours avec le même niveau d'assurance, que la réponse soit correcte ou non.

**Ce qu'une hallucination n'est PAS** :

- Une hallucination n'est pas un bug. C'est le fonctionnement normal de l'IA (prédiction statistique).
- Une hallucination n'est pas détectable par l'IA elle-même. Tu dois vérifier toi-même.

---

## Comparatif des IA disponibles (2025)

Ce tableau présente les principales IA conversationnelles que tu peux utiliser gratuitement.

| IA           | Éditeur             | Accès gratuit   | Forces                                                                 | Faiblesses                                                               | Confidentialité                                |
| ------------ | ------------------- | --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------- |
| **ChatGPT**  | OpenAI (USA)        | Oui, limité     | Polyvalent, très populaire, beaucoup de tutoriels disponibles          | Réponses souvent verbeuses, hallucinations fréquentes                    | Données utilisées pour entraînement par défaut |
| **Claude**   | Anthropic (USA)     | Oui, limité     | Excellent pour le code, réponses structurées, moins verbeux            | Connaissances avec un décalage temporel                                     | Meilleure politique de confidentialité         |
| **Gemini**   | Google (USA)        | Oui             | Intégré à Google, bon rapport qualité/prix, accès à des infos récentes | Fortement lié à l'écosystème Google                                      | Données utilisées par Google                   |
| **Mistral**  | Mistral AI (France) | Oui             | Entreprise française, performant, hébergé en Europe                    | Communauté plus petite, moins de ressources en ligne                     | Hébergé en Europe (RGPD)                       |
| **DeepSeek** | DeepSeek (Chine)    | Oui             | Gratuit, performant                                                    | **100% des données utilisées pour entraînement**, pas de confidentialité | Aucune confidentialité, données en Chine       |
| **Grok**     | xAI (USA)           | Via X (Twitter) | -                                                                      | Résultats peu fiables, biais politiques, qualité insuffisante            | À éviter                                       |

**Recommandations** :

- **Pour du code sensible ou des données personnelles** : Préfère Claude ou Mistral.
- **Pour un usage quotidien général** : ChatGPT ou Gemini sont de bons choix.
- **À éviter** : DeepSeek (aucune confidentialité) et Grok (qualité insuffisante).

**Accès aux IA** :

| IA      | URL d'accès       |
| ------- | ----------------- |
| ChatGPT | chat.openai.com   |
| Claude  | claude.ai         |
| Gemini  | gemini.google.com |
| Mistral | chat.mistral.ai   |

---

## Les 4 règles pour bien utiliser l'IA

### Règle 1 : Structurer sa question

**Le problème** : Une question vague produit une réponse vague ou incorrecte.

**Exemple de question vague** :

```text
Mon code marche pas, pourquoi ?
```

**Pourquoi c'est un problème** : L'IA ne connaît pas ton code, ton langage, ta version, ni l'erreur exacte. Elle va deviner et probablement se tromper.

**Structure d'une bonne question** :

```text
[CONTEXTE] + [QUESTION PRÉCISE] + [FORMAT DE RÉPONSE SOUHAITÉ]
```

**Exemple de question structurée** :

```text
Je travaille sur un projet Symfony 7.4 avec PHP 8.3.

Voici mon erreur :
"Call to undefined method App\Entity\User::getFullName()"

Voici mon code :
[coller le code]

Explique-moi :
1. Ce que signifie cette erreur
2. Comment la corriger
```

---

### Règle 2 : Donner du contexte

**Le problème** : Sans contexte, l'IA fait des suppositions qui sont souvent fausses.

**Informations de contexte à toujours donner** :

| Information              | Pourquoi c'est important                                  | Exemple                                            |
| ------------------------ | --------------------------------------------------------- | -------------------------------------------------- |
| Langage et version       | L'IA peut proposer du code pour une mauvaise version      | PHP 8.3, Symfony 7.4                               |
| Message d'erreur exact   | L'IA a besoin du message complet, pas d'un résumé         | Copier-coller l'erreur                             |
| Ce que tu as déjà essayé | Évite que l'IA propose une solution que tu as déjà testée | "J'ai essayé de redémarrer Docker"                 |
| Ce que tu veux obtenir   | L'IA doit comprendre ton objectif                         | "Je veux afficher le nom complet de l'utilisateur" |

---

### Règle 3 : Demander un format de réponse adapté

**Le problème** : Par défaut, l'IA donne des réponses longues et détaillées qui peuvent être difficiles à lire.

**Solutions** : Précise le format que tu veux dans ta question.

| Ce que tu veux         | Ce que tu écris                                     |
| ---------------------- | --------------------------------------------------- |
| Une réponse courte     | "Réponds en 5 points maximum"                       |
| La solution d'abord    | "Donne-moi d'abord la solution, puis l'explication" |
| Un tableau comparatif  | "Utilise un tableau pour comparer"                  |
| Du code commenté       | "Ajoute un commentaire pour chaque ligne"           |
| Une réponse par étapes | "Explique étape par étape, numérotées 1, 2, 3"      |

**Exemple** :

```text
Explique-moi la différence entre une classe et un objet en PHP.

Format souhaité :
- Définition de chaque terme (1 phrase)
- Un tableau comparatif
- Un exemple de code court
```

---

### Règle 4 : Toujours vérifier la réponse

**Le problème** : L'IA peut donner des réponses fausses avec assurance.

**Comment vérifier une réponse** :

1. **Teste le code** : Copie-colle le code et exécute-le. S'il ne fonctionne pas, l'IA s'est trompée.

2. **Vérifie les fonctions/classes** : Si l'IA mentionne une fonction, vérifie qu'elle existe dans la documentation officielle.

3. **Vérifie les versions** : Assure-toi que le code correspond à ta version (PHP 8.3, Symfony 7.4, etc.).

4. **Comprends le code** : Si tu ne comprends pas ce que fait le code, demande une explication ligne par ligne.

**Sources de vérification** :

| Technologie | Documentation officielle                               |
| ----------- | ------------------------------------------------------ |
| PHP         | php.net/manual/fr/                                     |
| Symfony     | symfony.com/doc/current/                               |
| PostgreSQL  | postgresql.org/docs/                                   |
| Doctrine    | doctrine-project.org/projects/doctrine-orm/en/current/ |

---

## Templates pour le code

Ces templates sont prêts à l'emploi. Copie-les et remplace les parties entre crochets `[...]` par tes informations.

### Template 1 : Debug d'une erreur

```text
Je travaille sur un projet avec les technologies suivantes :
- PHP 8.3
- Symfony 7.4
- PostgreSQL 16
- Doctrine ORM 3.x

Voici l'erreur que j'obtiens :
[COLLER LE MESSAGE D'ERREUR EXACT ICI]

Voici le code concerné :
[COLLER TON CODE ICI]

Explique-moi :
1. Ce que signifie cette erreur (en termes simples)
2. Pourquoi elle se produit dans mon cas
3. Comment la corriger (avec le code corrigé)
```

---

### Template 2 : Comprendre un concept

```text
Explique-moi [NOM DU CONCEPT] pour quelqu'un qui débute en programmation.

Structure ta réponse ainsi :
1. Définition en une phrase simple
2. Le problème que ce concept résout (pourquoi ça existe)
3. Une analogie avec un objet du quotidien (pas de métaphore abstraite)
4. Un exemple de code simple en [PHP/JavaScript/autre] avec un commentaire pour chaque ligne
5. Ce que ce concept n'est PAS (pour éviter les confusions)
```

---

### Template 3 : Générer du code

```text
Je veux créer [DESCRIPTION DE LA FONCTIONNALITÉ].

Contexte technique :
- Langage : PHP 8.3
- Framework : Symfony 7.4
- Base de données : PostgreSQL 16 avec Doctrine ORM 3.x
- [Autres contraintes éventuelles]

Génère le code avec :
- Un commentaire expliquant chaque partie importante
- La gestion des erreurs
- Un exemple d'utilisation

Ne propose PAS de code pour des versions antérieures.
```

---

### Template 4 : Demander une explication ligne par ligne

````text
Explique-moi ce code ligne par ligne :

```php
[COLLER LE CODE ICI]
```

Pour chaque ligne, indique :

1. Ce qu'elle fait
2. Pourquoi elle est nécessaire
````

---

## Templates pour les mails professionnels

### Le problème à résoudre

Écrire un mail professionnel peut être difficile pour plusieurs raisons :

- Le mail est trop long et le destinataire ne le lit pas entièrement
- Le mail contient des éléments personnels ou émotionnels qui ne sont pas appropriés dans un contexte professionnel
- Le ton n'est pas adapté au destinataire (trop formel ou pas assez)
- L'objectif du mail n'est pas clair

### Adapter le ton selon l'interlocuteur

| Interlocuteur      | Ton         | Formule d'ouverture              | Formule de fin       | Tutoiement/Vouvoiement   |
| ------------------ | ----------- | -------------------------------- | -------------------- | ------------------------ |
| Tuteur entreprise  | Semi-formel | "Bonjour [Prénom],"              | "Cordialement,"      | Selon l'habitude établie |
| Formateur école    | Formel      | "Bonjour Madame/Monsieur [Nom]," | "Bien cordialement," | Vouvoiement              |
| RH / Administratif | Formel      | "Bonjour,"                       | "Bien cordialement," | Vouvoiement              |
| Collègue technique | Cordial     | "Salut [Prénom]," ou "Hello,"    | "Merci !" ou "À+"    | Tutoiement               |

---

### Template : Reformuler un mail

```text
Reformule ce mail de manière professionnelle et concise.

Contexte :
- Destinataire : [tuteur entreprise / formateur / RH / collègue technique]
- Objectif du mail : [demande / information / question / remerciement]
- Ton souhaité : [formel / semi-formel / cordial]
- Vouvoiement ou tutoiement : [vouvoiement / tutoiement]

Mon mail original :
"""
[COLLER TON MAIL ICI]
"""

Règles à respecter :
- Maximum 5-7 phrases
- Supprimer tous les éléments personnels ou émotionnels
- Aller droit au but dès la première phrase
- Terminer par une action claire (ce que j'attends de la personne)
- Ne pas ajouter de formules excessives ("je me permets de...", "je vous serais reconnaissante de bien vouloir...")
```

---

### Template : Rédiger un mail de demande

```text
Rédige un mail professionnel avec ces informations :

- Destinataire : [qui]
- Objet du mail : [sujet]
- Ce que je demande : [demande précise]
- Contexte/raison : [pourquoi je fais cette demande]
- Délai éventuel : [si applicable]
- Ton : [formel / semi-formel / cordial]

Format du mail :
- Objet de mail clair et précis
- 5-7 phrases maximum
- Une action claire à la fin (ce que j'attends)
```

---

### Exemples de transformation

**Avant (mail trop personnel)** :

```text
Bonjour Sophie,

J'espère que tu vas bien ! Moi ça va, même si j'ai eu une semaine assez chargée
avec le projet sur lequel je travaille. D'ailleurs, en parlant de ça, j'aurais
une question à te poser. Je suis en train de développer une fonctionnalité
et je me suis retrouvée bloquée sur un truc. Je me demandais si tu avais
5 minutes pour m'aider parce que là je suis vraiment perdue et ça me stresse
un peu. Si tu n'as pas le temps, je comprendrais, je sais que tu es
débordée aussi. Mais si tu pouvais m'aider, ça serait vraiment super gentil
de ta part !

Merci beaucoup d'avance !

Bisous,
Alex
```

**Ce qui pose problème dans ce mail** :

- Trop de contenu personnel ("j'ai eu une semaine chargée", "ça me stresse")
- La demande réelle arrive trop tard (après 5 lignes d'introduction)
- Le ton est trop informel pour un contexte professionnel ("super gentil", "Bisous")
- Pas de description du problème technique

**Après (mail professionnel)** :

```text
Salut Sophie,

Je suis bloquée sur une fonctionnalité du projet [nom]. Est-ce que tu aurais
15 minutes cette semaine pour qu'on en discute ensemble ?

Le problème : [description courte du problème technique].

Merci !
Alex
```

---

## Pièges fréquents

### Piège 1 : Copier-coller sans comprendre

⚠️ **Problème** : Le code fonctionne, mais tu ne sais pas pourquoi. Si une erreur survient plus tard, tu ne sauras pas la corriger.

✅ **Solution** : Après avoir obtenu du code de l'IA, demande toujours une explication :

```text
Explique-moi ce code ligne par ligne. Pour chaque ligne, dis-moi ce qu'elle fait
et pourquoi elle est nécessaire.
```

---

### Piège 2 : Versions obsolètes

⚠️ **Problème** : L'IA propose du code pour une ancienne version du langage ou du framework.

**Exemples courants** :

| Code obsolète                        | Code actuel (2025)                    |
| ------------------------------------ | ------------------------------------- |
| `@Route("/path")` (annotation)       | `#[Route('/path')]` (attribut PHP 8)  |
| `$this->getDoctrine()`               | Injection de `EntityManagerInterface` |
| `return $this->render()` sans typage | Typage `Response` obligatoire         |

✅ **Solution** : Précise toujours les versions dans ta question :

```text
Je travaille avec PHP 8.3 et Symfony 7.4. Ne me propose PAS de code
pour des versions antérieures.
```

---

### Piège 3 : Fonctions ou classes inventées

⚠️ **Problème** : L'IA invente des fonctions, méthodes ou classes qui n'existent pas.

**Exemples** :

- `$user->getFullName()` alors que cette méthode n'existe pas dans ta classe User
- `Symfony\Component\FakeBundle` qui n'existe pas
- `array_super_merge()` qui n'est pas une fonction PHP

✅ **Solution** : Vérifie toujours dans la documentation officielle que la fonction/classe existe :

1. Copie le nom de la fonction ou classe
2. Cherche dans la documentation officielle (php.net, symfony.com)
3. Si tu ne trouves pas, c'est probablement une hallucination

---

### Piège 4 : Conversations trop longues

⚠️ **Problème** : Plus la conversation est longue, plus l'IA "oublie" ce qui a été dit au début. Elle peut se contredire ou répéter des erreurs déjà corrigées.

✅ **Solution** :

- Si la conversation dépasse 10-15 échanges, commence une nouvelle conversation
- Résume le contexte au début de la nouvelle conversation :

```text
Contexte : Je travaille sur [projet]. J'ai déjà essayé [solutions].
Le problème actuel est [description].
```

---

### Piège 5 : Faire confiance au premier résultat

⚠️ **Problème** : Tu acceptes la première réponse sans la questionner, même si elle semble étrange.

✅ **Solution** : Si quelque chose te semble bizarre :

```text
Es-tu sûr de cette réponse ? Peux-tu vérifier et me donner une source
ou une explication plus détaillée ?
```

Attention : L'IA peut confirmer une erreur avec assurance. La vraie vérification doit se faire avec la documentation officielle ou en testant le code.

---

## Checklist de validation d'une réponse IA

Avant d'utiliser du code fourni par une IA, vérifie ces points :

- [ ] **Versions correctes** : Le code utilise PHP 8.3, Symfony 7.4, Doctrine 3.x (pas des versions antérieures)
- [ ] **Fonctions existantes** : Les fonctions et classes mentionnées existent dans la documentation officielle
- [ ] **Code testé** : J'ai exécuté le code et il fonctionne sans erreur
- [ ] **Code compris** : Je comprends ce que fait chaque ligne du code
- [ ] **Pas de failles** : Le code ne contient pas de failles de sécurité évidentes (injection SQL, XSS)

**Si un point n'est pas validé** : Ne pas utiliser le code. Demander des clarifications à l'IA ou chercher dans la documentation officielle.

---

## Exercice pratique

### Énoncé

Transforme cette question vague en question structurée, puis pose-la à une IA de ton choix.

**Question vague** :

```text
Mon code marche pas, pourquoi ?
```

**Contexte pour l'exercice** :

- Tu travailles sur un projet Symfony 7.4 avec PHP 8.3
- Tu as une entité `Product` avec un champ `price`
- Tu veux afficher le prix formaté (avec le symbole €)
- Tu obtiens l'erreur : `Call to undefined method App\Entity\Product::getFormattedPrice()`

### Résultat attendu

Une question qui inclut :

1. Le contexte technique (versions)
2. L'erreur exacte (copiée-collée)
3. Le code concerné
4. Le format de réponse souhaité

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Question structurée** :

```text
Je travaille sur un projet avec les technologies suivantes :
- PHP 8.3
- Symfony 7.4
- Doctrine ORM 3.x

J'ai une entité Product avec un champ price (type decimal). Je veux afficher
le prix formaté avec le symbole € dans mes templates Twig.

Voici l'erreur que j'obtiens :
```

Call to undefined method App\Entity\Product::getFormattedPrice()

Voici mon entité :

```php
#[ORM\Entity]
class Product
{
    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $price = null;

    public function getPrice(): ?string
    {
        return $this->price;
    }
}
```

Et mon template Twig :

```twig
{{ product.formattedPrice }}
```

Explique-moi :

1. Pourquoi cette erreur se produit
2. Comment afficher un prix formaté avec le symbole € (deux solutions possibles :
   dans l'entité ou dans Twig)
3. Quelle solution est recommandée et pourquoi

**Pourquoi cette question est meilleure** :

| Élément            | Question vague | Question structurée                |
| ------------------ | -------------- | ---------------------------------- |
| Contexte technique | Absent         | PHP 8.3, Symfony 7.4, Doctrine 3.x |
| Erreur exacte      | "marche pas"   | Message complet copié-collé        |
| Code concerné      | Absent         | Entité et template fournis         |
| Format de réponse  | Non spécifié   | 3 points numérotés demandés        |

---

## Résumé des templates

| Usage                       | Template à utiliser |
| --------------------------- | ------------------- |
| Debug d'erreur              | Template 1          |
| Comprendre un concept       | Template 2          |
| Générer du code             | Template 3          |
| Explication ligne par ligne | Template 4          |
| Reformuler un mail          | Template mail 1     |
| Rédiger un mail de demande  | Template mail 2     |

---

## Points clés à retenir

1. **L'IA prédit, elle ne sait pas** : Vérifie toujours ses réponses.
2. **Le contexte est essentiel** : Plus tu donnes d'informations, meilleure sera la réponse.
3. **Demande le format** : Précise comment tu veux la réponse (points, tableau, code commenté).
4. **Les hallucinations existent** : L'IA peut inventer des fonctions ou des informations.
5. **Teste et comprends** : Ne copie jamais du code sans le tester et le comprendre.

---

## Navigation

→ Fiche suivante : **[Rechercher efficacement avant de demander à l'IA](02-rechercher-efficacement.md)**
