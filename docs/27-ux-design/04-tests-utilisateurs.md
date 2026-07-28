---
tags:
  - UX
  - Intermédiaire
  - Pratique
description: "Tests utilisateurs : tests d'utilisabilité, A/B testing, métriques UX (SUS, NPS, taux de completion), feedback loops et itération basée sur les données."
estimated_time: "60 min"
fiche_number: 4
total_fiches: 4
cursus: "UX Design"
---

# 04 - Tests utilisateurs

> **En bref** : Apprendre à mener des tests d'utilisabilité, comprendre l'A/B testing, mesurer l'UX avec des métriques objectives et itérer sur la base des retours utilisateurs. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [01 - Principes UX pour développeurs](01-principes-ux.md) pour connaître les bases de l'UX, les personas et les parcours utilisateur
- Avoir lu la fiche [02 - Wireframes et maquettes](02-wireframes-maquettes.md) pour savoir créer des prototypes testables
- Avoir lu la fiche [03 - Design system](03-design-system.md) pour connaître les composants et tokens de design

## Objectif de cette fiche

À la fin de cette fiche, tu sauras préparer et animer un test d'utilisabilité, définir une hypothèse A/B testable, calculer les métriques UX (SUS, NPS, taux de completion) et mettre en place un cycle d'itération basée sur les données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test d'utilisabilité ?

**Définition** : Un test d'utilisabilité est une méthode d'évaluation où des utilisateurs réels utilisent un produit (ou un prototype) pour accomplir des tâches précises. Un observateur note les difficultés rencontrées, les erreurs commises et les commentaires émis. L'objectif est d'identifier les problèmes d'utilisabilité avant qu'ils n'affectent les vrais utilisateurs en production.

**Le problème que les tests d'utilisabilité résolvent** :

Sans tests d'utilisabilité, voici les problèmes rencontrès :

1. **Biais de l'équipe** : Les développeurs et designers connaissent le produit par cœur. Ils ne voient plus les problèmes évidents pour un nouvel utilisateur. Ce biais s'appelle la "malédiction du savoir".
2. **Hypothèses non vérifiées** : L'équipe suppose que la navigation est claire et que les utilisateurs comprendront le formulaire. Ces hypothèses ne sont jamais testées.
3. **Problèmes découverts en production** : Les bugs d'utilisabilité sont découverts par les vrais utilisateurs qui se plaignent, abandonnent ou contactent le support. Corriger en production coûte 10 à 100 fois plus cher que corriger au stade du prototype.

**Comment les tests d'utilisabilité résolvent ces problèmes** :

| Problème | Solution apportée par les tests |
| --- | --- |
| Biais de l'équipe | Des utilisateurs externes révèlent les problèmes que l'équipe ne voit plus |
| Hypothèses non vérifiées | Les tâches du test vérifient concrètement si l'interface fonctionne |
| Problèmes en production | Les problèmes sont détectés et corrigés avant le lancement |

**Les types de tests d'utilisabilité** :

| Type | Description | Quand l'utiliser |
| --- | --- | --- |
| Test modéré en présentiel | L'observateur est dans la même pièce que le participant | Phase de découverte, besoin de comprendre le "pourquoi" |
| Test modéré à distance | L'observateur et le participant sont en visioconférence | Participants géographiquement dispersés |
| Test non modéré | Le participant fait le test seul, enregistré par un outil | Besoin de tester avec beaucoup de participants (20+) |
| Test guérilla | Test rapide et informel dans un lieu public (café, coworking) | Budget limite, besoin de retours rapides |

**Analogie concrète** : Un test d'utilisabilité, c'est comme une répétition générale au théâtre. Tu invites un public test pour voir si la pièce fonctionne. Tu observes où les spectateurs rient, ou ils s'ennuient, ou ils sont confus. Ensuite, tu ajustes la mise en scène avant la première officielle.

**Ce qu'un test d'utilisabilité n'est PAS** :

- Un test d'utilisabilité n'est pas une démonstration. Tu ne montrès pas comment utiliser le produit. Tu regardes l'utilisateur essayer par lui-même.
- Un test d'utilisabilité n'est pas un sondage d'opinion. Tu ne demandes pas "Est-ce que vous aimez le design ?". Tu observes si l'utilisateur réussit à accomplir une tâche.

---

### Qu'est-ce que l'A/B testing ?

**Définition** : L'A/B testing est une méthode expérimentale où deux versions d'un même élément (page, bouton, texte) sont présentées à deux groupes d'utilisateurs différents. On mesure laquelle des deux versions produit les meilleurs résultats par rapport à une métrique définie (taux de clic, taux de conversion, taux d'inscription).

**Le problème que l'A/B testing résout** :

Sans A/B testing, voici les problèmes rencontrès :

1. **Décisions basées sur l'opinion** : Le chef de projet préfère le bouton bleu, le désigner préfère le vert, le développeur préfère le noir. La décision est prise par la personne la plus convaincante, pas par les données.
2. **Impact inconnu** : Tu changes le texte du bouton "S'inscrire" en "Commencer gratuitement". Tu ne sais pas si ce changement améliore ou dégrade les inscriptions.
3. **Optimisation au hasard** : Tu modifies plusieurs éléments en même temps (couleur, texte, position). Si les résultats changent, tu ne sais pas quel élément est responsable.

**Comment l'A/B testing résout ces problèmes** :

| Problème | Solution apportée par l'A/B testing |
| --- | --- |
| Décisions d'opinion | Les données réelles des utilisateurs tranchent objectivement |
| Impact inconnu | La comparaison directe entre A et B mesure l'impact exact du changement |
| Optimisation au hasard | Un seul élément change à la fois, donc l'impact est isolable |

**Structure d'un A/B test** :

```text
                    +---> Version A (originale) ---> Mesure metrique
Trafic entrant -----|
                    +---> Version B (variante)  ---> Mesure metrique
                                                         |
                                            Comparaison statistique
                                                         |
                                            Version gagnante deployee
```

**Les éléments clés d'un A/B test** :

| Élément | Description | Exemple |
| --- | --- | --- |
| Hypothèse | Ce que tu penses qu'il va se passer | "Changer le texte du bouton de 'S'inscrire' à 'Commencer gratuitement' augmentera le taux d'inscription de 10%" |
| Variable | L'élément qui change entre A et B | Le texte du bouton d'inscription |
| Métrique | Ce que tu mesures pour déterminer le gagnant | Taux de clic sur le bouton (nombre de clics / nombre de visiteurs) |
| Taille d'échantillon | Le nombre minimum de visiteurs pour un résultat fiable | 1000 visiteurs par version (minimum) |
| Durée | Le temps nécessaire pour collecter assez de données | 1 à 4 semaines selon le trafic |

**Analogie concrète** : L'A/B testing, c'est comme tester deux recettes de gâteau avec un panel de goûteurs. Tu prépares le gâteau A (recette classique) et le gâteau B (avec un ingrédient différent). Tu fais gouter les deux à 50 personnes sans leur dire lequel est lequel. Celui qui reçoit le plus de votes gagne. Tu ne te fies pas à ton propre goût, mais aux données du panel.

**Ce que l'A/B testing n'est PAS** :

- L'A/B testing n'est pas un sondage. Tu ne demandes pas aux utilisateurs ce qu'ils préfèrent. Tu mesures ce qu'ils font réellement (cliquer, s'inscrire, acheter).
- L'A/B testing n'est pas instantané. Un test nécessite assez de trafic pour être statistiquement significatif. Tirer des conclusions après 50 visiteurs n'a aucune valeur.

---

### Qu'est-ce que le score SUS (System Usability Scale) ?

**Définition** : Le SUS est un questionnaire standardisé de 10 questions qui mesure l'utilisabilité perçue d'un système. Chaque question est notée de 1 (pas du tout d'accord) à 5 (tout à fait d'accord). Le score final va de 0 à 100. C'est la métrique UX la plus utilisée dans le monde depuis 1986.

**Le problème que le SUS résout** :

Sans métrique standardisée, voici les problèmes rencontrès :

1. **Pas de mesure objective** : L'équipe dit "les utilisateurs ont l'air contents" mais n'a aucun chiffre pour le prouver.
2. **Pas de comparaison possible** : Sans échelle commune, impossible de comparer l'utilisabilité entre deux versions ou deux produits.
3. **Retours vagues** : Les utilisateurs disent "c'est bien" ou "c'est compliqué" sans précision.

**Comment le SUS résout ces problèmes** :

| Problème | Solution apportée par le SUS |
| --- | --- |
| Pas de mesure objective | Un score de 0 à 100, calculable et comparable |
| Pas de comparaison | Le score moyen mondial est 68. Au-dessus = supérieur à la moyenne |
| Retours vagues | 10 questions précises couvrant les aspects clés de l'utilisabilité |

**Les 10 questions du SUS** :

| # | Question | Orientation |
| --- | --- | --- |
| 1 | Je pense que j'aimerais utiliser ce système fréquemment | Positive |
| 2 | J'ai trouve le système inutilement complexe | Negative |
| 3 | J'ai trouve le système facile à utiliser | Positive |
| 4 | Je pense que j'aurais besoin d'aide technique pour utiliser ce système | Negative |
| 5 | J'ai trouve les différentes fonctions du système bien intégrées | Positive |
| 6 | J'ai trouve qu'il y avait trop d'incoherences dans ce système | Negative |
| 7 | J'imagine que la plupart des gens apprendraient à utiliser ce système rapidement | Positive |
| 8 | J'ai trouve le système très lourd à utiliser | Negative |
| 9 | Je me suis senti(e) en confiance en utilisant le système | Positive |
| 10 | J'ai eu besoin d'apprendre beaucoup de choses avant de pouvoir utiliser ce système | Negative |

**Calcul du score** :

1. Questions positives (1, 3, 5, 7, 9) : score de la question - 1
2. Questions négatives (2, 4, 6, 8, 10) : 5 - score de la question
3. Additionner les 10 résultats
4. Multiplier par 2.5

**Interpretation du score** :

| Score | Interpretation | Équivalent lettre |
| --- | --- | --- |
| 0 - 25 | Pire imaginable | F |
| 25 - 50 | Mauvais | D |
| 50 - 68 | Passable | C |
| 68 - 80 | Bon | B |
| 80 - 90 | Excellent | A |
| 90 - 100 | Meilleur imaginable | A+ |

---

### Qu'est-ce que le NPS (Net Promoter Score) ?

**Définition** : Le NPS est une métrique de satisfaction qui mesure la probabilité que les utilisateurs recommandent un produit à leur entourage. Il repose sur une seule question : "Sur une échelle de 0 à 10, quelle est la probabilité que vous recommandiez ce produit à un ami ou un collègue ?".

**Calcul du NPS** :

| Catégorie | Score | Description |
| --- | --- | --- |
| Promoteurs | 9 - 10 | Utilisateurs enthousiastes qui recommanderont le produit |
| Passifs | 7 - 8 | Utilisateurs satisfaits mais non engagés, vulnérables à la concurrence |
| Detracteurs | 0 - 6 | Utilisateurs insatisfaits qui risquent de decourager d'autrès personnes |

**Formule** : NPS = % Promoteurs - % Detracteurs

**Interpretation** :

| NPS | Interpretation |
| --- | --- |
| -100 a 0 | Mauvais (plus de detracteurs que de promoteurs) |
| 0 a 30 | Correct |
| 30 a 70 | Bon |
| 70 à 100 | Excellent |

**Comparaison SUS vs NPS** :

| SUS | NPS |
| --- | --- |
| Mesure l'utilisabilité | Mesure la satisfaction et la fidélité |
| 10 questions | 1 question |
| Score de 0 à 100 | Score de -100 a +100 |
| Après un test d'utilisabilité | Après une utilisation réelle du produit |
| Identifie les problèmes d'ergonomie | Identifie le niveau de satisfaction global |

---

### Qu'est-ce que le taux de completion ?

**Définition** : Le taux de completion (task completion rate) est le pourcentage d'utilisateurs qui reussissent à accomplir une tâche donnée. C'est la métrique UX la plus directe : soit l'utilisateur réussit, soit il échoue.

**Formule** : Taux de completion = (Nombre de réussites / Nombre de tentatives) x 100

**Interpretation** :

| Taux | Interpretation |
| --- | --- |
| > 90% | Excellent : la tâche est intuitive |
| 70% - 90% | Acceptable : des améliorations mineures nécessaires |
| 50% - 70% | Problematique : des améliorations importantes nécessaires |
| < 50% | Critique : la tâche est fondamentalement mal conçue |

---

### Qu'est-ce qu'un feedback loop ?

**Définition** : Un feedback loop (boucle de retour) est un processus cyclique ou les retours des utilisateurs alimentent les décisions d'amélioration du produit. Chaque itération du cycle produit une version amelioree qui est à son tour testee et evaluee.

**Le problème que les feedback loops résolvent** :

Sans feedback loop, voici les problèmes rencontrès :

1. **Amelioration ponctuelle** : L'équipe fait un test utilisateur une fois, corrige les problèmes trouvés, puis ne reteste jamais. De nouveaux problèmes s'accumulent avec chaque nouvelle fonctionnalité.
2. **Décisions deconnectees** : Les nouvelles fonctionnalités sont concues sans consulter les retours des utilisateurs précédents. Les mêmes erreurs sont repetees.
3. **Pas d'apprentissage** : L'équipe ne sait pas si les corrections précédentes ont réellement améliore l'expérience. Elle ne mesure pas l'impact de ses décisions.

**Comment les feedback loops résolvent ces problèmes** :

| Problème | Solution apportée par les feedback loops |
| --- | --- |
| Amelioration ponctuelle | Un cycle continu garantit que chaque version est testee et amelioree |
| Décisions deconnectees | Les retours utilisateurs sont centralises et consultables par toute l'équipe |
| Pas d'apprentissage | Chaque cycle mesure l'impact des modifications précédentes |

**Le cycle d'un feedback loop** :

```text
    +-----------+
    |  Mesurer  |  <- Collecter les donnees (metriques, tests, retours)
    +-----+-----+
          |
          v
    +-----------+
    |  Analyser |  <- Identifier les problemes et les opportunites
    +-----+-----+
          |
          v
    +-----------+
    | Concevoir |  <- Proposer des solutions (wireframes, prototypes)
    +-----+-----+
          |
          v
    +-----------+
    |  Tester   |  <- Valider les solutions avec des utilisateurs
    +-----+-----+
          |
          v
    +-----------+
    | Deployer  |  <- Mettre en production la version amelioree
    +-----+-----+
          |
          +--------> Retour a "Mesurer"
```

**Analogie concrète** : Un feedback loop, c'est comme l'entrainement d'un sportif. Il court (déployer), mesure son temps (mesurer), identifie les points faibles (analyser), ajuste sa technique (concevoir), teste en entrainement (tester), puis court à nouveau. Chaque cycle le rend un peu meilleur. Un sportif qui ne mesure jamais ses performances ne progressera pas.

---

## Étapes Pratiques

### Étape 1 : Préparer un test d'utilisabilité

Tu vas préparer un test d'utilisabilité pour l'application de recettes de cuisine des fiches précédentes. Le prototype créé dans la fiche 02 sera le support du test.

Remplis ce document de planification :

```text
PLAN DE TEST D'UTILISABILITÉ
=============================

Produit : Application de recettes de cuisine (prototype Figma)
Date : [Date prevue]
Animateur : [Ton nom]

OBJECTIF
--------
Verifier si les utilisateurs arrivent a trouver une recette
à partir d'ingredients disponibles et a suivre les étapes de preparation.

PROFIL DES PARTICIPANTS
-----------------------
- Nombre : 5 participants
- Critères : Personnes qui cuisinent au moins 3 fois par semaine
- Exclusion : Personne ayant déjà vu le prototype ou travaillant dans le design

TÂCHES A TESTER
---------------
Tâche 1 : Trouver une recette avec du poulet et des tomates
  - Critère de succes : L'utilisateur arrive sur la page de detail d'une recette
  - Temps maximum : 2 minutes

Tâche 2 : Ajouter une recette aux favoris
  - Critère de succes : L'utilisateur clique sur l'icone favoris
  - Temps maximum : 1 minute

Tâche 3 : Accéder à la liste des courses
  - Critère de succes : L'utilisateur trouve la section "Liste de courses"
  - Temps maximum : 1 minute 30

MATERIEL
--------
- Prototype Figma (lien de partage)
- Ordinateur ou smartphone pour le participant
- Feuille de notes pour l'observateur
- Chronometre

SCRIPT D'INTRODUCTION
---------------------
"Merci d'avoir accepte de participer. Je travaille sur une application
de recettes de cuisine et j'aimerais que tu l'essaies. Ce n'est pas
toi qu'on teste, c'est l'application. Il n'y a pas de bonne ou
mauvaise réponse. Dis a voix haute ce que tu penses pendant que tu
utilises l'application."
```

**Résultat attendu** :

Un document de planification complet avec l'objectif, le profil des participants, les tâches à tester avec critères de succès, le matériel et le script d'introduction.

---

### Étape 2 : Animer un test d'utilisabilité

Tu vas maintenant simuler un test d'utilisabilité. Demande à quelqu'un de ton entourage (ami, famille, collègue) de tester ton prototype Figma. Si personne n'est disponible, fais le test toi-même en te mettant dans la peau d'une personne qui découvre l'application.

Pendant le test, remplis cette grille d'observation :

```text
GRILLE D'OBSERVATION
====================

Participant : [Prenom]
Date : [Date]

TÂCHE 1 : Trouver une recette avec du poulet et des tomates
-----------------------------------------------------------
Reussite : [ ] Oui  [ ] Non  [ ] Partiel
Temps : [__] minutes [__] secondes
Chemin suivi : [Decrire les étapes que le participant a suivies]
Difficultes observees : [Ce qui a pose problème]
Commentaires du participant : [Ce qu'il a dit a voix haute]
Severite : [ ] Critique  [ ] Importante  [ ] Mineure

TÂCHE 2 : Ajouter une recette aux favoris
------------------------------------------
Reussite : [ ] Oui  [ ] Non  [ ] Partiel
Temps : [__] minutes [__] secondes
Chemin suivi : [...]
Difficultes observees : [...]
Commentaires du participant : [...]
Severite : [ ] Critique  [ ] Importante  [ ] Mineure

TÂCHE 3 : Accéder à la liste des courses
-----------------------------------------
Reussite : [ ] Oui  [ ] Non  [ ] Partiel
Temps : [__] minutes [__] secondes
Chemin suivi : [...]
Difficultes observees : [...]
Commentaires du participant : [...]
Severite : [ ] Critique  [ ] Importante  [ ] Mineure

OBSERVATIONS GENERALES
----------------------
Points positifs : [Ce qui a bien fonctionne]
Points negatifs : [Ce qui n'a pas fonctionne]
Suggestions du participant : [Idées proposees]
```

**Règles à respecter pendant le test** :

| Règle | Explication |
| --- | --- |
| Ne pas aider | Si le participant bloque, ne lui dis pas quoi faire. Note la difficulté. |
| Ne pas justifier | Si le participant critique un élément, ne le defends pas. Note le retour. |
| Encourager à penser à voix haute | Rappelle régulièrement : "Dis-moi ce que tu penses." |
| Ne pas poser de questions orientees | Mauvais : "Tu as vu le bouton favoris ?" Bon : "Qu'est-ce que tu ferais maintenant ?" |
| Chronométrer chaque tâche | Note le temps même si le participant ne réussit pas |

**Résultat attendu** :

Une grille d'observation remplie pour chaque tâche avec la réussite, le temps, les difficultés et les commentaires.

---

### Étape 3 : Calculer le score SUS

Après le test d'utilisabilité, fais remplir le questionnaire SUS à ton participant.

Voici le questionnaire à imprimer ou afficher :

```text
QUESTIONNAIRE SUS
=================

Pour chaque affirmation, entoure un chiffre de 1 à 5.
1 = Pas du tout d'accord   5 = Tout à fait d'accord

 1. Je pense que j'aimerais utiliser ce système fréquemment.
    1   2   3   4   5

 2. J'ai trouve le système inutilement complexe.
    1   2   3   4   5

 3. J'ai trouve le système facile à utiliser.
    1   2   3   4   5

 4. Je pense que j'aurais besoin d'aide technique pour utiliser ce système.
    1   2   3   4   5

 5. J'ai trouve les differentes fonctions du système bien integrees.
    1   2   3   4   5

 6. J'ai trouve qu'il y avait trop d'incoherences dans ce système.
    1   2   3   4   5

 7. J'imagine que la plupart des gens apprendraient à utiliser ce système rapidement.
    1   2   3   4   5

 8. J'ai trouve le système très lourd à utiliser.
    1   2   3   4   5

 9. Je me suis senti(e) en confiance en utilisant le système.
    1   2   3   4   5

10. J'ai eu besoin d'apprendre beaucoup de choses avant de pouvoir utiliser ce système.
    1   2   3   4   5
```

Calcule le score avec cette méthode :

```text
CALCUL DU SCORE SUS
====================

Réponses brutes : Q1=[_] Q2=[_] Q3=[_] Q4=[_] Q5=[_] Q6=[_] Q7=[_] Q8=[_] Q9=[_] Q10=[_]

Questions positives (score - 1) :
  Q1 : [_] - 1 = [_]
  Q3 : [_] - 1 = [_]
  Q5 : [_] - 1 = [_]
  Q7 : [_] - 1 = [_]
  Q9 : [_] - 1 = [_]

Questions negatives (5 - score) :
  Q2 : 5 - [_] = [_]
  Q4 : 5 - [_] = [_]
  Q6 : 5 - [_] = [_]
  Q8 : 5 - [_] = [_]
  Q10: 5 - [_] = [_]

Somme des 10 valeurs : [_]
Score SUS = somme x 2.5 = [_]
```

**Résultat attendu** :

Un score SUS calculé. Si le score est supérieur à 68, l'utilisabilité est supérieure à la moyenne. Si le score est inférieur à 68, des améliorations sont nécessaires.

---

### Étape 4 : Concevoir un A/B test

Tu vas concevoir un A/B test pour ameliorer un élément spécifique de l'application de recettes.

Remplis cette fiche :

```text
FICHE A/B TEST
==============

Nom du test : [Nom descriptif]
Date de debut : [Date]
Duree prevue : [Nombre de jours/semaines]

HYPOTHÈSE
---------
"Si je [change X], alors [métrique Y] augmentera/diminuera de [Z%]
parce que [raison]."

Exemple :
"Si je remplace le texte 'Rechercher' par 'Que veux-tu cuisiner ?'
dans la barre de recherche, alors le taux d'utilisation de la
recherche augmentera de 15% parce que la question invite
l'utilisateur a interagir."

VERSION A (contrôle)
--------------------
Description : [L'élément tel qu'il existe actuellement]
Capture d'écran : [Decrire ou dessiner l'élément A]

VERSION B (variante)
--------------------
Description : [L'élément modifie]
Capture d'écran : [Decrire ou dessiner l'élément B]

MÉTRIQUE PRINCIPALE
-------------------
Nom : [Ce que tu mesures]
Formule : [Comment tu le calcules]
Valeur actuelle : [Mesure de référence avant le test]

MÉTRIQUES SECONDAIRES
---------------------
- [Métrique 2 : pour verifier les effets secondaires]
- [Métrique 3 : autre indicateur a surveiller]

TAILLE D'ECHANTILLON
--------------------
Minimum par version : 1000 visiteurs
Repartition : 50% / 50%

CRITÈRE DE DECISION
-------------------
Le test est concluant si :
- La difference est statistiquement significative (p < 0.05)
- La version B est superieure de plus de [seuil minimum]%
```

**Résultat attendu** :

```text
FICHE A/B TEST
==============

Nom du test : Texte de la barre de recherche
Date de debut : 1er avril 2025
Duree prevue : 2 semaines

HYPOTHESE
---------
"Si je remplace le texte 'Rechercher' par 'Que veux-tu cuisiner
ce soir ?' dans la barre de recherche, alors le taux d'utilisation
de la recherche augmentera de 15% parce que la question engageante
invite l'utilisateur a interagir avec la barre."

VERSION A (controle)
--------------------
Texte du placeholder : "Rechercher"

VERSION B (variante)
--------------------
Texte du placeholder : "Que veux-tu cuisiner ce soir ?"

METRIQUE PRINCIPALE
-------------------
Nom : Taux d'utilisation de la recherche
Formule : Nombre de recherches / Nombre de visiteurs x 100
Valeur actuelle : 23%

METRIQUES SECONDAIRES
---------------------
- Taux de clic sur les resultats de recherche
- Nombre moyen de caracteres saisis dans la recherche

TAILLE D'ECHANTILLON
--------------------
Minimum par version : 1000 visiteurs
Repartition : 50% / 50%

CRITERE DE DECISION
-------------------
Le test est concluant si :
- La difference est statistiquement significative (p < 0.05)
- La version B est superieure de plus de 5%
```

---

### Étape 5 : Créer un rapport d'itération

À partir des résultats du test d'utilisabilité et du score SUS, crée un rapport d'itération qui documente les problèmes trouvés et les solutions proposées.

```text
RAPPORT D'ITERATION
====================

Version testee : v1.0 (prototype Figma)
Date : [Date]
Nombre de participants : [Nombre]
Score SUS : [Score]

RESUME
------
[Resume en 2-3 phrases des resultats principaux]

PROBLEMES IDENTIFIES
--------------------

Probleme 1 : [Titre]
- Severite : Critique / Importante / Mineure
- Taches impactees : [Liste des taches]
- Description : [Ce qui s'est passe]
- Nombre de participants impactes : [X sur Y]
- Solution proposee : [Comment corriger]
- Effort estime : [Faible / Moyen / Eleve]

Probleme 2 : [Titre]
- Severite : [...]
- Taches impactees : [...]
- Description : [...]
- Nombre de participants impactes : [...]
- Solution proposee : [...]
- Effort estime : [...]

PRIORISATION
------------

| # | Probleme | Severite | Effort | Priorite |
| - | -------- | -------- | ------ | -------- |
| 1 | [Titre]  | Critique | Faible | P0 (urgent) |
| 2 | [Titre]  | Important| Moyen  | P1 (important) |
| 3 | [Titre]  | Mineur   | Faible | P2 (amelioration) |

PLAN D'ACTION
-------------
Sprint 1 : Corriger les problemes P0
Sprint 2 : Corriger les problemes P1
Backlog : Problemes P2 a traiter quand possible

PROCHAINE ETAPE
---------------
- Corriger les problemes P0 dans le prototype
- Retester avec 3 nouveaux participants
- Mesurer le nouveau score SUS
```

**Résultat attendu** :

Un rapport d'itération structure avec les problèmes identifies, les solutions proposées, une priorisation claire et un plan d'action concret.

---

## Commandes Utiles

| Outil / Action | Description |
| --- | --- |
| Figma - mode Prototype | Créer un prototype testable (panneau droit > onglet Prototype) |
| Figma - partage de lien | Partager le prototype avec un participant (bouton Share > Copy link) |
| Google Forms | Créer le questionnaire SUS en ligne pour le distribuer facilement |
| Chronometre du telephone | Mesurer le temps par tâche pendant le test |
| Feuille de calcul (Calc, Sheets) | Calculer le score SUS et compiler les résultats de plusieurs participants |

---

## Pièges Fréquents

### Piège 1 : Guider le participant pendant le test

⚠️ **Problème** : Le participant bloque et tu lui dis "Le bouton est en haut à droite" ou "Il faut cliquer sur le menu". Tu biais complètement le test.

✅ **Solution** : Si le participant bloque plus de 2 minutes, dis "Qu'est-ce que tu essaierais dans la vraie vie ?". Si le blocage persiste, note la tâche comme échouée et passe à la suivante. Le blocage est une donnée précieuse : il révèle un problème d'utilisabilité.

---

### Piège 2 : Tirer des conclusions avec trop peu de participants

⚠️ **Problème** : Tu testes avec 1 seul participant et tu conclus que le design est bon parce qu'il a réussi toutes les tâches.

✅ **Solution** : Une étude classique de Jakob Nielsen estime qu'environ 5 participants suffisent pour détecter une grande part des problèmes d'utilisabilité (souvent citée à ~85%). C'est une règle empirique utile pour démarrer, pas une garantie statistique. En dessous de 3 à 5, les résultats sont très fragiles. Pour l'A/B testing, il faut beaucoup plus de participants (souvent 1000+ par version, selon le trafic et l'effet attendu).

---

### Piège 3 : Tester tout en même temps

⚠️ **Problème** : Tu changes 5 éléments en même temps (couleur du bouton, texte, position, taille, icône) et tu fais un A/B test. Les résultats s'ameliorent mais tu ne sais pas quel changement est responsable.

✅ **Solution** : Un A/B test change un seul élément à la fois. Si tu veux tester plusieurs changements, fais des tests successifs. Chaque test isole un seul facteur pour mesurer son impact propre.

---

### Piège 4 : Ne pas mesurer avant de changer

⚠️ **Problème** : Tu ameliores l'interface sans avoir mesure les performances de la version précédente. Tu ne peux pas savoir si tes modifications ont réellement améliore les choses.

✅ **Solution** : Avant toute modification, mesure la version actuelle (score SUS, taux de completion, taux de conversion). Cette mesure de référence (baseline) est indispensable pour quantifier l'amélioration apportée par les changements.

---

## Checklist de Validation

- [ ] Je sais préparer un plan de test d'utilisabilité (objectif, profil, tâches, matériel)
- [ ] Je connais les règles d'animation d'un test (ne pas guider, ne pas justifier)
- [ ] Je sais calculer un score SUS et l'interpréter
- [ ] Je connais la difference entre SUS et NPS
- [ ] Je sais concevoir un A/B test avec une hypothèse, une variable et une métrique
- [ ] Je sais calculer un taux de completion
- [ ] Je comprends le cycle d'un feedback loop (mesurer, analyser, concevoir, tester, déployer)
- [ ] J'ai crée un rapport d'itération avec priorisation et plan d'action

---

## Exercice Pratique

**Énoncé** : Mène un cycle complet de test et d'itération sur un site web ou une application existante.

**Partie 1 - Test d'utilisabilité** :

- Choisis un site web ou une application
- Définis 3 tâches à tester
- Recrute 3 participants (amis, famille, collègues)
- Anime les tests et remplis les grilles d'observation
- Fais remplir le questionnaire SUS à chaque participant

**Partie 2 - Analyse des résultats** :

- Calcule le score SUS moyen des 3 participants
- Calcule le taux de completion pour chaque tâche
- Identifie les 3 problèmes les plus graves

**Partie 3 - Conception d'un A/B test** :

- Choisis le problème le plus impactant
- Redige une hypothèse A/B testable
- Définis la métrique principale et la taille d'échantillon

**Partie 4 - Rapport d'itération** :

- Redige un rapport complet avec les problèmes identifies
- Priorise les problèmes (P0, P1, P2)
- Propose un plan d'action en 2 sprints

**Indications** :

- Si tu ne peux pas recruter 3 participants, fais le test toi-même 3 fois sur 3 tâches différentes
- Pour le SUS, utilise un tableur pour calculer les scores
- Le rapport d'itération est le livrable principal de cet exercice

**Résultat attendu** :

- 3 grilles d'observation remplies
- 3 questionnaires SUS avec le score calcule
- 1 fiche A/B test complete
- 1 rapport d'itération avec priorisation et plan d'action

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Voici un exemple de solution pour le site **GitLab** (interface de gestion de code) :

**Partie 1 - Tâches définies** :

| Tâche | Description | Critère de succès | Temps max |
| --- | --- | --- | --- |
| 1 | Créer un nouveau projet | L'utilisateur arrive sur la page du projet créé | 3 min |
| 2 | Ouvrir un merge request | L'utilisateur créé un MR avec titre et description | 4 min |
| 3 | Trouver les pipelines CI/CD d'un projet | L'utilisateur voit la liste des pipelines | 2 min |

**Partie 2 - Résultats du test** :

Résultats bruts pour 3 participants :

| Tâche | Participant 1 | Participant 2 | Participant 3 |
| --- | --- | --- | --- |
| 1 - Créer un projet | Reussi (1m30) | Reussi (2m10) | Reussi (1m45) |
| 2 - Ouvrir un MR | Reussi (3m20) | Echoue (temps dépasse) | Reussi (3m50) |
| 3 - Trouver les pipelines | Reussi (0m45) | Reussi (1m30) | Echoue (temps dépasse) |

**Taux de completion** :

| Tâche | Réussites | Taux |
| --- | --- | --- |
| 1 | 3/3 | 100% |
| 2 | 2/3 | 67% |
| 3 | 2/3 | 67% |

**Scores SUS** :

| Participant | Score SUS |
| --- | --- |
| 1 | 72.5 |
| 2 | 55.0 |
| 3 | 65.0 |
| **Moyenne** | **64.2** |

Le score moyen de 64.2 est inférieur à 68 (moyenne mondiale). L'utilisabilité est passable et nécessite des améliorations.

**Partie 3 - Fiche A/B test** :

```text
Hypothese : "Si j'ajoute un bouton 'Nouveau merge request' visible
directement sur la page du projet (au lieu de l'enfouir dans le menu),
alors le taux de completion de la tâche 'Ouvrir un MR' passera de
67% a 90% parce que l'action sera immediatement visible."

Version A : Bouton MR accessible uniquement via le menu lateral
Version B : Bouton "Nouveau MR" visible dans l'en-tete du projet

Metrique principale : Taux de completion de la creation de MR
Taille d'echantillon : 1000 utilisateurs par version
```

**Partie 4 - Rapport d'itération** :

```text
RAPPORT D'ITERATION
====================

Version testee : GitLab 16.x (interface web)
Score SUS moyen : 64.2 (passable)
Taux de completion moyen : 78%

PROBLEMES IDENTIFIES

Probleme 1 : Action "Merge Request" difficile a trouver
- Severite : Critique
- Taches impactees : Tache 2
- Participants impactes : 1 sur 3 (echec), 2 sur 3 (temps eleve)
- Solution : Ajouter un bouton visible dans l'en-tete du projet
- Effort : Faible

Probleme 2 : Menu CI/CD peu visible dans la sidebar
- Severite : Importante
- Taches impactees : Tache 3
- Participants impactes : 1 sur 3 (echec)
- Solution : Ajouter une icone distinctive et un badge avec le nombre de pipelines
- Effort : Faible

Probleme 3 : Formulaire de creation de projet long
- Severite : Mineure
- Taches impactees : Tache 1
- Participants impactes : 0 echec mais temps moyen de 1m48
- Solution : Afficher uniquement les champs obligatoires, cacher les options avancees
- Effort : Moyen

PRIORISATION

| # | Probleme | Severite | Effort | Priorite |
| - | -------- | -------- | ------ | -------- |
| 1 | Bouton MR invisible | Critique | Faible | P0 |
| 2 | Menu CI/CD peu visible | Importante | Faible | P1 |
| 3 | Formulaire creation long | Mineure | Moyen | P2 |

PLAN D'ACTION
Sprint 1 : Corriger P0 (bouton MR) + P1 (menu CI/CD)
Sprint 2 : Retester avec 5 participants, mesurer le nouveau score SUS
Backlog : P2 (formulaire simplifie)
```

---

## Navigation

← Fiche précédente : **[Design system](03-design-system.md)**
