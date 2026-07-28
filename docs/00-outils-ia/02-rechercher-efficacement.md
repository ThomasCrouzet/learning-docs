---
tags:
  - Outils IA
  - Débutant
  - Pratique
description: "Rechercher efficacement avant de demander à l'IA"
estimated_time: "50 min"
fiche_number: 2
total_fiches: 2
cursus: "Outils IA"
---

# 02 - Rechercher efficacement avant de demander à l'IA

> **En bref** : À la fin de cette fiche, tu sauras lire un message d'erreur PHP ou Symfony, chercher dans la documentation officielle, et formuler une recherche efficace. Lecture estimée : 50 min.


## Prérequis

- Fiche [01 - Utiliser l'IA pour apprendre et communiquer](./01-utiliser-ia-pour-apprendre.md)
- Aucune connaissance préalable en recherche technique n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras :

- Lire et décrypter un message d'erreur PHP ou Symfony
- Chercher dans la documentation officielle (php.net, symfony.com)
- Formuler une recherche efficace sur Google ou dans une documentation
- Déterminer QUAND utiliser l'IA (et quand NE PAS l'utiliser)

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux sections pratiques.

### Qu'est-ce qu'un message d'erreur ?

**Définition** : Un message d'erreur est une information structurée que le programme génère quand quelque chose ne fonctionne pas comme prévu. Il contient des indices pour identifier et résoudre le problème.

**Le problème que les messages d'erreur résolvent** :

Sans messages d'erreur, voici les problèmes rencontrés :

1. **Aucune visibilité** : Tu ne saurais pas pourquoi le programme ne fonctionne pas.
2. **Recherche aveugle** : Tu ne saurais pas OÙ se trouve le problème (quel fichier, quelle ligne).
3. **Diagnostic impossible** : Tu ne saurais pas QUEL type de problème c'est.

**Comment les messages d'erreur résolvent ces problèmes** :

| Problème           | Solution apportée par le message d'erreur          |
| ------------------ | -------------------------------------------------- |
| Aucune visibilité  | Le message décrit ce qui ne va pas                 |
| Recherche aveugle  | Le message indique le fichier et la ligne exacts   |
| Diagnostic impossible | Le message indique le type d'erreur (syntaxe, type, etc.) |

**Analogie concrète** : Un message d'erreur est comme le voyant du tableau de bord d'une voiture. Quand le voyant "huile" s'allume, il ne te dit pas "verse 2 litres d'huile dans le moteur". Il te dit QUOI vérifier. Tu dois ensuite ouvrir le capot et regarder toi-même le niveau d'huile.

**Ce qu'un message d'erreur n'est PAS** :

- Un message d'erreur n'est pas une solution. C'est un indice pour trouver la solution. L'erreur te dit ce qui ne va pas, pas comment le corriger.
- Un message d'erreur n'est pas une punition. C'est une aide. Les développeurs expérimentés voient des erreurs tous les jours.
- Un message d'erreur n'est pas toujours à l'endroit exact du problème. Dans certains cas, l'erreur est détectée à la ligne 50, mais la vraie cause est à la ligne 30.

---

### La structure d'un message d'erreur PHP

**Définition** : Un message d'erreur PHP a une structure précise avec 4 parties : le type d'erreur, le message descriptif, le fichier et la ligne, et la stack trace.

**Le problème que comprendre cette structure résout** :

Sans comprendre la structure, voici les problèmes rencontrés :

1. **Lecture confuse** : Tu regardes l'erreur sans savoir où chercher l'information utile.
2. **Copier-coller aveugle** : Tu copies tout dans l'IA sans avoir extrait les informations clés.
3. **Temps perdu** : Tu cherches au mauvais endroit parce que tu n'as pas lu la bonne partie.

**Comment comprendre la structure résout ces problèmes** :

| Problème            | Solution                                              |
| ------------------- | ----------------------------------------------------- |
| Lecture confuse     | Tu sais exactement où regarder pour chaque information |
| Copier-coller aveugle | Tu extrais les informations clés avant de chercher    |
| Temps perdu         | Tu vas directement au fichier et à la ligne indiqués  |

**Les 4 parties d'un message d'erreur** :

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. TYPE D'ERREUR                                                        │
│    Exemple : TypeError, ParseError, RuntimeException                    │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. MESSAGE DESCRIPTIF                                                   │
│    Exemple : "Argument #1 must be of type string, int given"            │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. FICHIER ET LIGNE                                                     │
│    Exemple : in /var/www/html/src/Controller/ProductController.php:42   │
├─────────────────────────────────────────────────────────────────────────┤
│ 4. STACK TRACE (chemin parcouru par le code)                            │
│    #0 ProductController->show()                                         │
│    #1 HttpKernel->handle()                                              │
│    #2 ...                                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tableau des types d'erreur les plus courants** :

| Type d'erreur        | Signification                        | Cause fréquente                              |
| -------------------- | ------------------------------------ | -------------------------------------------- |
| `ParseError`         | Erreur de syntaxe PHP                | Point-virgule oublié, accolade manquante     |
| `TypeError`          | Mauvais type de donnée               | String au lieu de int, null inattendu        |
| `ArgumentCountError` | Mauvais nombre d'arguments           | Paramètre obligatoire non fourni             |
| `RuntimeException`   | Erreur pendant l'exécution           | Fichier introuvable, service non disponible  |
| `LogicException`     | Erreur de logique dans le code       | Appel de méthode dans un mauvais contexte    |
| `Twig\Error\RuntimeError` | Erreur dans un template Twig    | Variable non passée au template              |

**Ce que la stack trace n'est PAS** :

- La stack trace n'est pas une liste d'erreurs multiples. C'est le chemin qu'a suivi le code pour arriver à l'erreur. Une seule erreur, mais plusieurs étapes pour y arriver.
- La première ligne de la stack trace montre souvent TON code (la vraie origine), pas le code du framework.

---

### La documentation officielle

**Définition** : La documentation officielle est le site web maintenu par les créateurs du langage ou du framework. C'est la source d'information la plus fiable et la plus à jour.

**Le problème que la documentation officielle résout** :

Sans consulter la documentation officielle, voici les problèmes rencontrés :

1. **Informations obsolètes** : Les tutoriels en ligne peuvent être pour une ancienne version.
2. **Réponses incorrectes** : Les réponses sur Stack Overflow peuvent être fausses ou pour une autre version.
3. **Hallucinations de l'IA** : L'IA peut inventer des fonctions qui n'existent pas.

**Comment la documentation officielle résout ces problèmes** :

| Problème               | Solution apportée par la doc officielle                    |
| ---------------------- | ---------------------------------------------------------- |
| Informations obsolètes | La doc est mise à jour avec chaque version                 |
| Réponses incorrectes   | La doc officielle est la référence la plus fiable (mais peut être incomplète ou datée : croise avec ta version) |
| Hallucinations de l'IA | Tu vérifies que la fonction/classe existe vraiment         |

**Tableau des documentations officielles** :

| Technologie | URL                                      | Comment chercher                           |
| ----------- | ---------------------------------------- | ------------------------------------------ |
| PHP         | php.net/manual/fr/                       | Barre de recherche en haut à droite        |
| Symfony     | symfony.com/doc/7.4/                     | Menu latéral ou barre de recherche         |
| Doctrine    | doctrine-project.org/projects/orm/en/3.3 | Menu "Documentation" puis recherche        |
| PostgreSQL  | postgresql.org/docs/16/                  | Table des matières ou recherche            |
| Twig        | twig.symfony.com/doc/3.x/                | Menu latéral par catégorie                 |

**Analogie concrète** : La documentation officielle est comme le mode d'emploi fourni avec un appareil électroménager. Ce n'est peut-être pas le plus amusant à lire, mais c'est en général la source la plus fiable pour ton modèle exact, à condition de consulter la version qui correspond à ton logiciel. Un tutoriel YouTube sur "comment utiliser un four", lui, peut être pour un autre modèle.

**Ce que la documentation officielle n'est PAS** :

- La documentation n'est pas un tutoriel pas-à-pas. C'est une référence qui décrit toutes les options, pas un guide pour débutant.
- La documentation n'est pas toujours facile à lire. Mais elle est fiable. Si tu ne comprends pas un passage, c'est normal : demande une explication à l'IA APRÈS avoir lu la doc.

---

### La recherche efficace

**Définition** : Une recherche efficace utilise des mots-clés précis et structurés pour trouver rapidement l'information pertinente, en filtrant les résultats non utiles.

**Le problème que la recherche efficace résout** :

Sans recherche efficace, voici les problèmes rencontrés :

1. **Trop de résultats** : Une recherche vague donne des milliers de résultats non pertinents.
2. **Mauvais résultats** : Copier-coller l'erreur complète ne fonctionne pas toujours.
3. **Solutions obsolètes** : Les premiers résultats ne sont pas toujours pour ta version.

**Comment la recherche efficace résout ces problèmes** :

| Problème           | Solution                                        |
| ------------------ | ----------------------------------------------- |
| Trop de résultats  | Mots-clés précis = moins de résultats, plus pertinents |
| Mauvais résultats  | Extraire le message clé, pas l'erreur complète  |
| Solutions obsolètes | Inclure la version dans la recherche           |

**Anatomie d'une bonne requête de recherche** :

```text
[langage/framework] [version] [type d'erreur ou mot-clé] "[extrait du message]"
```

**Exemples** :

| Recherche inefficace | Recherche efficace |
| -------------------- | ------------------ |
| `mon code marche pas` | `php 8.3 TypeError "must be of type string"` |
| `erreur symfony` | `symfony 7.4 "No route found for GET"` |
| `problème doctrine` | `doctrine 3 "Column not found" entity` |
| Copier l'erreur entière (500 caractères) | Copier le message clé (50 caractères) |

**Comparaison : recherche vague vs précise** :

| Critère        | Recherche vague         | Recherche précise                |
| -------------- | ----------------------- | -------------------------------- |
| Résultats      | 10 000+, peu pertinents | 10-100, majoritairement utiles   |
| Temps passé    | 20+ minutes à trier     | 5 minutes pour trouver           |
| Version        | Mélange de versions     | Résultats pour ta version        |
| Qualité        | Tutoriels débutants     | Solutions spécifiques au problème |

---

## La Règle des 3 Étapes AVANT l'IA

Cette règle est **OBLIGATOIRE**. Tu ne dois utiliser l'IA qu'**APRÈS** avoir complété ces 3 étapes. Il n'y a pas d'exception.

**Temps total maximum : 12 minutes**

---

### Étape 1 : LIRE le message d'erreur (2 minutes maximum)

**Objectif** : Identifier les 4 informations clés du message d'erreur.

**Actions à faire** :

1. Copie le message d'erreur complet dans un fichier texte (pour le garder)
2. Identifie le **TYPE** d'erreur (première ligne, ex: TypeError)
3. Identifie le **MESSAGE** descriptif (ce qui ne va pas)
4. Identifie le **FICHIER** et la **LIGNE** (ex: ProductController.php:42)
5. Lis la **première ligne de la stack trace** (c'est souvent ton code)
6. Ouvre le fichier concerné à la ligne indiquée

**Checklist Étape 1** :

- [ ] Je connais le type d'erreur
- [ ] Je comprends le message (même partiellement)
- [ ] Je sais quel fichier est concerné
- [ ] Je sais quelle ligne regarder
- [ ] J'ai ouvert le fichier à cette ligne dans VS Code

**Si tu bloques** : Si après 2 minutes tu ne comprends pas le type d'erreur, note ce que tu as trouvé et passe à l'Étape 2.

---

### Étape 2 : CHERCHER dans la documentation (5 minutes maximum)

**Objectif** : Vérifier si le problème ou l'élément mentionné est documenté.

**Actions à faire selon le type d'erreur** :

| Si l'erreur mentionne... | Alors cherche dans...                     | Ce que tu cherches                           |
| ------------------------ | ----------------------------------------- | -------------------------------------------- |
| Une fonction PHP         | php.net + nom de la fonction              | Les paramètres attendus, les types           |
| Une classe Symfony       | symfony.com/doc/7.4/ + nom de la classe   | Comment l'utiliser correctement              |
| Une erreur Doctrine      | doctrine-project.org + le mot-clé         | La configuration correcte                    |
| Une erreur Twig          | twig.symfony.com + le mot-clé             | La syntaxe correcte                          |

**Exemple concret** :

Si tu as l'erreur `TypeError: array_map(): Argument #1 must be callable` :

1. Va sur php.net
2. Tape "array_map" dans la recherche
3. Lis la section "Parameters" : le premier paramètre doit être une fonction (callable)
4. Compare avec ton code : as-tu bien passé une fonction en premier ?

**Checklist Étape 2** :

- [ ] J'ai identifié l'élément à chercher (fonction, classe, composant)
- [ ] J'ai ouvert la documentation officielle correspondante
- [ ] J'ai trouvé la page de cet élément
- [ ] J'ai lu les paramètres attendus / la configuration requise
- [ ] J'ai comparé avec mon code

**Si tu bloques** : Si après 5 minutes tu n'as pas trouvé d'information utile dans la doc, note ce que tu as cherché et passe à l'Étape 3.

---

### Étape 3 : RECHERCHER sur Google (5 minutes maximum)

**Objectif** : Trouver si quelqu'un a eu le même problème et l'a résolu.

**Formule de recherche à utiliser** :

```text
[framework] [version] "[extrait du message d'erreur entre guillemets]"
```

**Exemples** :

| Message d'erreur | Recherche Google |
| ---------------- | ---------------- |
| `TypeError: must be of type string, int given` | `php 8.3 "must be of type string, int given"` |
| `No route found for "GET /products"` | `symfony 7.4 "No route found for GET"` |
| `Variable "user" does not exist` | `twig "Variable does not exist" symfony 7` |

**Sites à privilégier dans les résultats** (dans cet ordre) :

1. **Documentation officielle** (symfony.com, php.net) - Toujours fiable
2. **Stack Overflow** - Privilégier les réponses avec beaucoup de votes positifs
3. **GitHub Issues** - Problèmes signalés sur le projet officiel
4. **Blogs techniques récents** (de préférence 2024-2026, et alignés sur ta version) - Vérifier la date

**Sites à éviter ou vérifier avec prudence** :

- Résultats de forums anciens (avant 2020)
- Sites qui copient Stack Overflow sans valeur ajoutée
- Tutoriels sans mention de version

**Checklist Étape 3** :

- [ ] J'ai utilisé la formule de recherche avec version et guillemets
- [ ] J'ai lu au moins 3 résultats différents
- [ ] J'ai vérifié que les solutions sont pour ma version (PHP 8.3, Symfony 7.4)
- [ ] J'ai noté ce que j'ai appris (même si ça n'a pas résolu le problème)

**Si tu bloques** : Si après 5 minutes tu n'as pas trouvé de solution, tu as maintenant assez de contexte pour utiliser l'IA efficacement.

---

## Quand utiliser l'IA (et quand NE PAS l'utiliser)

### Utilise l'IA APRÈS les 3 étapes SI

| Situation                                          | Pourquoi l'IA peut aider                              |
| -------------------------------------------------- | ----------------------------------------------------- |
| Tu as complété les 3 étapes sans trouver de solution | L'IA peut proposer des pistes que tu n'as pas vues    |
| Tu as trouvé une solution mais tu ne la comprends pas | L'IA peut expliquer le code ou le concept             |
| Tu veux comparer plusieurs approches                | L'IA peut synthétiser les avantages de chaque option  |
| Le message d'erreur est très cryptique              | L'IA peut "traduire" en langage simple                |
| Tu as besoin d'un exemple de code adapté à ton cas  | L'IA peut générer du code personnalisé (à vérifier)   |

### N'utilise PAS l'IA SI

| Situation                                    | Pourquoi l'IA n'est pas appropriée                         |
| -------------------------------------------- | ---------------------------------------------------------- |
| Tu n'as pas lu le message d'erreur           | L'IA ne peut pas deviner ton contexte précis               |
| Tu n'as pas ouvert le fichier concerné       | Tu dois voir le code toi-même pour comprendre              |
| C'est une erreur de syntaxe simple           | La solution est dans le message (";", "}", etc.)           |
| Tu n'as pas vérifié la doc officielle        | L'IA peut inventer des fonctions qui n'existent pas        |
| Tu veux juste "que ça marche" sans comprendre | Tu ne progresseras pas et tu referas la même erreur        |

### La question à te poser AVANT de coller dans l'IA

Avant de copier une erreur dans l'IA, pose-toi cette question :

> **"Est-ce que je pourrais expliquer à quelqu'un OÙ est le problème et ce que j'ai déjà essayé ?"**

- **Si OUI** : Tu peux utiliser l'IA avec un contexte précis. Tu as fait les 3 étapes.
- **Si NON** : Retourne aux 3 étapes. Tu n'as pas assez d'informations.

---

## Templates de recherche

Ces templates sont prêts à l'emploi. Copie-les et remplace les parties entre crochets `[...]` par tes informations.

### Template 1 : Recherche Google pour erreur PHP

```text
php 8.3 [type d'erreur] "[extrait du message entre guillemets]"
```

**Exemple** :

```text
php 8.3 TypeError "must be of type string"
```

---

### Template 2 : Recherche Google pour erreur Symfony

```text
symfony 7.4 "[composant ou erreur]" [mot-clé supplémentaire]
```

**Exemple** :

```text
symfony 7.4 "No route found" controller
```

---

### Template 3 : Recherche dans la documentation Symfony

1. Va sur symfony.com/doc/7.4/
2. Utilise la barre de recherche ou Ctrl+F dans la page
3. Cherche : `[nom du composant]` ou `[nom de la classe sans le namespace]`

**Exemple** : Pour une erreur avec `#[Route]`, cherche "routing" dans la doc.

---

### Template 4 : Question à l'IA (APRÈS les 3 étapes)

```text
J'ai une erreur dans mon projet Symfony 7.4 / PHP 8.3.

ERREUR (type et message) :
[Coller UNIQUEMENT le type + la première ligne du message]

FICHIER ET LIGNE :
[Fichier et ligne indiqués]

CE QUE J'AI DÉJÀ FAIT :
1. J'ai lu le message : il indique que [ta compréhension du problème]
2. J'ai regardé le code à la ligne [X] : [ce que tu as vu]
3. J'ai vérifié dans la doc [php.net/symfony.com] : [ce que tu as trouvé ou pas trouvé]
4. J'ai cherché sur Google avec "[ta requête]" : [ce que tu as trouvé ou pas trouvé]

MA QUESTION PRÉCISE :
[Ta question spécifique, pas "pourquoi ça marche pas"]
```

**Pourquoi ce template fonctionne** :

- L'IA a le contexte complet
- L'IA sait ce que tu as déjà essayé
- L'IA peut donner une réponse ciblée, pas générique

---

## Étapes pratiques

### Étape pratique 1 : Décrypter une erreur PHP

Voici un message d'erreur réel. Applique l'Étape 1 (LIRE) pour extraire les informations.

**Message d'erreur** :

```text
TypeError: App\Controller\ProductController::show(): Argument #1 ($id) must be of type int, string given, called in /var/www/html/vendor/symfony/http-kernel/HttpKernel.php on line 163
```

**Ta mission** : Remplis ce tableau avec les informations extraites.

| Information à trouver     | Ta réponse                |
| ------------------------- | ------------------------- |
| Type d'erreur             | _________________         |
| Fichier de TON code       | _________________         |
| Méthode concernée         | _________________         |
| Paramètre problématique   | _________________         |
| Type attendu              | _________________         |
| Type reçu                 | _________________         |

**Résultat attendu** : Tu as identifié que le paramètre `$id` attend un `int` mais reçoit un `string`.

---

### Étape pratique 2 : Chercher sur php.net

**Contexte** : Tu as une erreur avec la fonction `array_map` et tu veux vérifier ses paramètres.

**Ta mission** :

1. Va sur php.net/manual/fr/
2. Tape "array_map" dans la barre de recherche
3. Trouve la page de la fonction
4. Réponds à ces questions :

| Question                                      | Ta réponse |
| --------------------------------------------- | ---------- |
| Quel est le premier paramètre attendu ?       | __________ |
| Quel est le type du premier paramètre ?       | __________ |
| Quel est le deuxième paramètre attendu ?      | __________ |
| La fonction retourne quoi ?                   | __________ |

**Résultat attendu** : Tu sais que `array_map` attend une fonction (callable) en premier, puis un tableau.

---

### Étape pratique 3 : Formuler une recherche Google efficace

**Contexte** : Tu as cette erreur Symfony :

```text
Twig\Error\RuntimeError: Variable "products" does not exist in "product/list.html.twig" at line 12.
```

**Ta mission** : Transforme cette erreur en requête de recherche efficace.

**Étape A** : Identifie les éléments clés

| Élément            | Valeur extraite          |
| ------------------ | ------------------------ |
| Framework          | _________________        |
| Message clé        | _________________        |
| Fichier concerné   | _________________        |

**Étape B** : Construis ta requête avec le template

```text
[framework] [version] "[message clé]"
```

**Ta requête** : _______________________________________________

**Résultat attendu** : Une requête comme `symfony 7.4 "Variable does not exist" twig`

---

## Pièges fréquents

### Piège 1 : Copier l'erreur entière dans l'IA sans la lire

**Problème** : Tu colles l'erreur entière (50 lignes) dans l'IA en disant "ça marche pas".

**Pourquoi c'est un problème** :

- L'IA va deviner ton contexte et souvent se tromper
- L'IA peut proposer des solutions qui ne s'appliquent pas à ton cas
- Tu perds du temps avec des allers-retours inutiles

**Solution** :

1. Lis d'abord les 4 parties du message (2 minutes)
2. Ouvre le fichier à la ligne indiquée
3. ENSUITE, si tu ne comprends toujours pas, utilise l'IA avec le Template 4

---

### Piège 2 : Chercher avec des termes trop vagues

**Problème** : Tu cherches "erreur symfony" ou "php marche pas".

**Pourquoi c'est un problème** :

- Google retourne des millions de résultats non pertinents
- Tu passes 20 minutes à trier au lieu de 2 minutes à trouver

**Solution** : Utilise le template de recherche :

```text
[framework] [version] "[extrait du message entre guillemets]"
```

| Mauvaise recherche | Bonne recherche                           |
| ------------------ | ----------------------------------------- |
| "erreur symfony"   | `symfony 7.4 "No route found"`            |
| "php marche pas"   | `php 8.3 TypeError "must be of type int"` |

---

### Piège 3 : Ignorer la stack trace

**Problème** : Tu regardes seulement la première ligne de l'erreur et ignores les lignes suivantes.

**Pourquoi c'est un problème** :

- La stack trace montre le CHEMIN parcouru par le code
- La première ligne de la stack trace montre souvent TON code, pas le framework
- Tu manques l'origine réelle du problème

**Solution** :

- Lis au moins les 3 premières lignes de la stack trace
- Cherche la première ligne qui mentionne `src/` (ton code)
- C'est souvent là que se trouve la vraie cause

---

### Piège 4 : Ne pas vérifier la version

**Problème** : Tu trouves une solution sur Stack Overflow qui utilise `@Route` au lieu de `#[Route]`.

**Pourquoi c'est un problème** :

- L'ancienne syntaxe (`@Route`) était pour Symfony 5
- La nouvelle syntaxe (`#[Route]`) est pour Symfony 6 et 7
- Le code copié ne fonctionnera pas

**Solution** :

- TOUJOURS vérifier la date de la réponse (préférer des contenus récents, idéalement 2024-2026, et compatibles avec ta version)
- Vérifier si la version est mentionnée
- Croiser avec la documentation officielle

---

### Piège 5 : Abandonner après 1 seul résultat

**Problème** : Tu lis le premier résultat Google et tu abandonnes s'il ne résout pas ton problème.

**Pourquoi c'est un problème** :

- Le premier résultat n'est pas toujours le meilleur
- Souvent, le 2e ou 3e résultat est plus pertinent
- Tu manques des solutions alternatives

**Solution** :

- Lis **au moins 3 résultats différents**
- Compare les solutions proposées
- Cherche les points communs entre les réponses

---

## Checklist de validation

Avant de passer à la suite, vérifie que tu maîtrises ces points :

- [ ] Je sais identifier les 4 parties d'un message d'erreur PHP (type, message, fichier:ligne, stack trace)
- [ ] Je connais les URLs des documentations officielles (php.net, symfony.com, doctrine-project.org)
- [ ] Je sais formuler une recherche Google avec le template : `[framework] [version] "[message]"`
- [ ] Je comprends la Règle des 3 Étapes et je m'engage à la suivre (LIRE → DOC → RECHERCHE)
- [ ] Je sais QUAND utiliser l'IA (après les 3 étapes, avec contexte)
- [ ] Je sais QUAND NE PAS utiliser l'IA (avant les 3 étapes, sans avoir lu l'erreur)
- [ ] Je connais la question à me poser : "Puis-je expliquer OÙ est le problème ?"

---

## Exercice pratique

### Énoncé

Tu travailles sur ton projet Symfony et tu obtiens cette erreur :

```text
Twig\Error\RuntimeError: Variable "produit" does not exist in "product/show.html.twig" at line 5.
```

**Ta mission** : Applique la Règle des 3 Étapes pour résoudre ce problème **SANS utiliser l'IA**.

### Étape 1 - LIRE (2 minutes)

Remplis ce tableau :

| Information          | Ta réponse     |
| -------------------- | -------------- |
| Type d'erreur        | ______________ |
| Template concerné    | ______________ |
| Ligne du problème    | ______________ |
| Variable mentionnée  | ______________ |
| Ce que dit le message| ______________ |

### Étape 2 - DOC (5 minutes)

1. Va sur symfony.com/doc/7.4/templates.html
2. Cherche comment on passe une variable du contrôleur au template
3. Note la syntaxe trouvée : ______________________________________________

### Étape 3 - RECHERCHE (5 minutes)

1. Écris ta requête Google : ______________________________________________
2. Quel site apparaît en premier ? ______________________________________________
3. Quelle solution est proposée ? ______________________________________________

### Résultat attendu

- Tu as identifié que la variable `produit` n'existe pas dans le template
- Tu as trouvé dans la doc Symfony la syntaxe : `$this->render('template.twig', ['variable' => $valeur])`
- Tu comprends que le contrôleur ne passe pas la variable au template
- Tu n'as **PAS** eu besoin de l'IA

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 - LIRE (Solution)

| Information          | Réponse                                              |
| -------------------- | ---------------------------------------------------- |
| Type d'erreur        | `Twig\Error\RuntimeError`                            |
| Template concerné    | `product/show.html.twig`                             |
| Ligne du problème    | 5                                                    |
| Variable mentionnée  | `produit`                                            |
| Ce que dit le message| La variable "produit" n'existe pas dans le template  |

**Analyse** : L'erreur est de type RuntimeError Twig. Elle se produit parce que le template essaie d'utiliser une variable `produit` qui n'a pas été passée par le contrôleur.

---

### Étape 2 - DOC (Solution)

Sur symfony.com/doc/7.4/templates.html, section "Passing Variables to Templates" :

```php
// Dans le contrôleur
return $this->render('product/show.html.twig', [
    'produit' => $produit,  // La clé 'produit' devient disponible dans Twig
]);
```

**Ce que tu as appris** : Le deuxième paramètre de `render()` est un tableau associatif. Les clés de ce tableau deviennent les noms des variables dans Twig.

---

### Étape 3 - RECHERCHE (Solution)

**Requête efficace** : `symfony 7 twig "Variable does not exist"`

**Résultats pertinents** :

1. Documentation Symfony (symfony.com) - Confirme la syntaxe de `render()`
2. Stack Overflow - Explique que l'erreur vient d'une variable non passée au template

**Solution trouvée** : Vérifier le contrôleur qui rend ce template et s'assurer qu'il passe la variable `produit`.

---

### Diagnostic final

Le problème vient du contrôleur. Il faut vérifier :

1. Que le contrôleur récupère bien le produit (ex: depuis la base de données)
2. Que le contrôleur passe le produit au template avec la bonne clé

**Code du contrôleur corrigé** :

```php
#[Route('/product/{id}', name: 'product_show')]
public function show(Product $product): Response
{
    // Le paramètre s'appelle $product, mais le template attend 'produit'
    return $this->render('product/show.html.twig', [
        'produit' => $product,  // Clé 'produit' = variable {{ produit }} dans Twig
    ]);
}
```

**OU modifier le template** pour utiliser `product` au lieu de `produit` :

```twig
{# Ligne 5 du template - avant #}
{{ produit.name }}

{# Ligne 5 du template - après #}
{{ product.name }}
```

---

### Pourquoi tu n'as pas eu besoin de l'IA

| Étape     | Ce que tu as trouvé seul(e)                           |
| --------- | ----------------------------------------------------- |
| LIRE      | Variable `produit` manquante, fichier `show.html.twig`|
| DOC       | Syntaxe de `render()` avec passage de variables       |
| RECHERCHE | Confirmation que l'erreur = variable non passée       |

L'IA n'aurait fait que te dire la même chose, mais tu aurais perdu l'opportunité de **comprendre** le problème et de savoir le résoudre la prochaine fois.

---

## Navigation

← Fiche précédente : **[Utiliser l'IA pour apprendre et communiquer](01-utiliser-ia-pour-apprendre.md)**
