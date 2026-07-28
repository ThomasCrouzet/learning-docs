---
tags:
  - Audit
  - Méthodologie
  - Stratégie
description: "Prioriser les risques avec une matrice Impact × Probabilité. Décider ce qu'on teste, ce qu'on diffère, et ce qu'on ne teste pas."
estimated_time: "60 min"
fiche_number: 4
total_fiches: 6
cursus: "Audit et Qualité"
---

# 04 - Prioriser les risques

> **En bref** : Tu ne peux pas tester tout. Cette fiche te montre comment scorer chaque fonctionnalité sur Impact × Probabilité, et fixer un seuil objectif au-dessus duquel un test est obligatoire. Fini les débats subjectifs sur "ce qui compte". Lecture estimée : 60 min.

## Prérequis

- Fiche 3 : [Identifier les invariants métier](03-invariants-metier.md)
- Fiche [Stratégie de test en équipe](../09-testing/11-strategie-test-equipe.md) du cursus Testing

## Objectif de cette fiche

À la fin de cette fiche, tu sauras attribuer un score Impact × Probabilité à une fonctionnalité, dessiner une matrice 3×3 et fixer un seuil objectif pour décider quoi tester et quoi laisser de côté.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que prioriser ?

**Définition** : Prioriser, c'est choisir consciemment ce qu'on couvre et ce qu'on laisse, au lieu de tester ce qui tombe sous la main. Le résultat est une décision documentée, datée, et reproductible.

**Le problème que la priorisation résout** :

Sans priorisation, voici les problèmes rencontrés :

1. **Couverture déséquilibrée** : on couvre les zones faciles à tester (accesseurs, formulaires triviaux) et on rate les zones critiques.
2. **Effort dilué** : on écrit beaucoup de tests qui rassurent peu, et trop peu de tests qui protègent vraiment.
3. **Choix non défendables** : quand on demande "pourquoi cette fonction n'est pas testée ?", on n'a pas de réponse claire.

**Comment la priorisation résout ces problèmes** :

| Problème | Solution apportée par la priorisation |
| --- | --- |
| Couverture déséquilibrée | On part des zones les plus risquées vers les moins risquées |
| Effort dilué | On concentre le temps sur ce qui protège réellement |
| Choix non défendables | Chaque décision est traçable et justifiée par un score |

**Analogie concrète** : Pense au triage médical aux urgences. L'infirmier ne soigne pas les patients dans l'ordre d'arrivée. Il évalue chaque patient sur deux axes : gravité de la blessure et chances de récupération. Il soigne d'abord les blessés graves récupérables, puis les blessés graves stabilisés, puis les blessés légers. La priorisation des tests fonctionne pareil.

**Ce que prioriser n'est PAS** :

- Prioriser n'est pas un classement par préférence personnelle. C'est un calcul objectif basé sur deux axes définis à l'avance.
- Prioriser n'est pas une exclusion définitive. Un risque non testé maintenant peut l'être plus tard, quand le contexte change.

---

### Qu'est-ce que le score Impact ?

**Définition** : Le score Impact mesure la gravité des conséquences si la fonctionnalité défaille. Il s'exprime sur une échelle entière de 1 à 3, où 3 correspond à la gravité maximale.

**Le problème que le score Impact résout** :

Sans score Impact, voici les problèmes rencontrés :

1. **Confusion entre gravité et fréquence** : on confond "ça arrive souvent" et "c'est grave".
2. **Sous-évaluation des risques rares** : un bug rare mais catastrophique passe sous le radar.
3. **Discussion sans cadre** : chacun a sa propre échelle mentale, donc les choix divergent.

**Comment le score Impact résout ces problèmes** :

| Problème | Solution apportée par le score Impact |
| --- | --- |
| Confusion gravité / fréquence | Le score Impact ne mesure que la gravité, pas la fréquence |
| Sous-évaluation des risques rares | Un risque grave reste prioritaire même s'il est rare |
| Discussion sans cadre | Tout le monde utilise la même grille de 1 à 3 |

**Grille de scoring Impact** :

| Score | Critères |
| --- | --- |
| 3 | Faille de sécurité, fuite de données, perte financière, non-conformité réglementaire |
| 2 | Fonctionnalité dégradée mais récupérable, perte de temps significative |
| 1 | Inconfort utilisateur, bug visuel, amélioration de qualité |

**Analogie concrète** : C'est l'équivalent du score de gravité aux urgences. Une plaie superficielle marque 1. Une fracture marque 2. Un infarctus marque 3. On ne soigne pas la plaie superficielle avant l'infarctus, peu importe l'ordre d'arrivée.

**Ce que le score Impact n'est PAS** :

- Le score Impact n'est pas la complexité technique du correctif. Un bug grave peut être trivial à corriger une fois identifié.
- Le score Impact n'est pas la difficulté à reproduire. Un bug difficile à reproduire peut être très grave si on le reproduit.

---

### Qu'est-ce que le score Probabilité ?

**Définition** : Le score Probabilité mesure le risque qu'une régression apparaisse dans la fonctionnalité. Il s'exprime sur une échelle entière de 1 à 3, où 3 correspond au risque maximal.

**Le problème que le score Probabilité résout** :

Sans score Probabilité, voici les problèmes rencontrés :

1. **Tests sur du code stable** : on teste massivement des fonctions qui n'ont pas bougé depuis trois ans.
2. **Angles morts sur du code chaud** : on ne teste pas les fonctions modifiées chaque semaine.
3. **Confusion trafic / risque** : on croit qu'une page très visitée est plus risquée, alors qu'elle peut être stable.

**Comment le score Probabilité résout ces problèmes** :

| Problème | Solution apportée par le score Probabilité |
| --- | --- |
| Tests sur du code stable | Un code stable obtient un score bas, donc moins de tests prioritaires |
| Angles morts sur du code chaud | Un code modifié souvent obtient un score haut |
| Confusion trafic / risque | Le score ne dépend pas du trafic mais du risque de régression |

**Grille de scoring Probabilité** :

| Score | Critères |
| --- | --- |
| 3 | Code complexe, dépendances multiples, modifications fréquentes attendues, faible couverture actuelle |
| 2 | Complexité moyenne, modifications occasionnelles |
| 1 | Code stable, simple, rarement modifié |

**Analogie concrète** : Pense à l'entretien d'une voiture. Tu ne contrôles pas tous les composants à la même fréquence. Les freins, qui chauffent à chaque trajet et s'usent vite, marquent 3. Le moteur, surveillé en continu mais robuste, marque 2. Le châssis, qui ne change pratiquement jamais, marque 1.

**Ce que le score Probabilité n'est PAS** :

- Le score Probabilité n'est pas le trafic utilisateur. Une page très visitée peut être très stable.
- Le score Probabilité n'est pas la probabilité d'un bug théorique. C'est le risque concret de régression compte tenu de l'historique et de la complexité actuelle du code.

---

### Qu'est-ce que la matrice Impact × Probabilité ?

**Définition** : La matrice Impact × Probabilité est un tableau à deux axes qui croise les deux scores. La priorité finale d'une fonctionnalité est le produit des deux scores, sur une échelle de 1 à 9.

**Le problème que la matrice résout** :

Sans matrice, voici les problèmes rencontrés :

1. **Décision sur un seul axe** : on priorise uniquement par gravité, on rate les zones à risque modéré mais très volatiles.
2. **Pas de hiérarchie claire** : sans produit, on ne sait pas comparer un (Impact 3, Probabilité 1) avec un (Impact 1, Probabilité 3).
3. **Vue d'ensemble manquante** : on regarde fonction par fonction, sans voir le portefeuille global.

**Comment la matrice résout ces problèmes** :

| Problème | Solution apportée par la matrice |
| --- | --- |
| Décision sur un seul axe | Les deux dimensions sont combinées en une seule priorité |
| Pas de hiérarchie claire | Le produit donne un classement total de 1 à 9 |
| Vue d'ensemble manquante | Le tableau montre la distribution des risques |

**La matrice 3×3** :

| Impact \ Proba | 1 (faible) | 2 (moyen) | 3 (élevé) |
| --- | --- | --- | --- |
| 3 (élevé) | 3 | 6 | 9 |
| 2 (moyen) | 2 | 4 | 6 |
| 1 (faible) | 1 | 2 | 3 |

**Lecture** : la priorité est le produit Impact × Probabilité. Plus le produit est grand, plus la priorité est haute. Le 9 est le maximum, le 1 est le minimum.

**Analogie concrète** : Pense à un radiateur. La chaleur ressentie dépend de deux facteurs : la puissance du radiateur (Impact) et le temps que tu passes près (Probabilité). Un petit radiateur 1 heure ne chauffe pas. Un gros radiateur 1 minute non plus. Un gros radiateur toute la journée, oui. La matrice combine les deux.

**Ce que la matrice n'est PAS** :

- La matrice n'est pas une formule sacrée. C'est un outil de décision, pas une vérité absolue.
- La matrice n'est pas figée. Les scores peuvent évoluer dans le temps quand le contexte change.

---

### Qu'est-ce que le seuil objectif ?

**Définition** : Le seuil objectif est le score à partir duquel on s'engage à tester une fonctionnalité. Il est posé avant l'audit, communiqué par écrit, et appliqué sans exception.

**Le problème que le seuil résout** :

Sans seuil fixé à l'avance, voici les problèmes rencontrés :

1. **Biais de motivation** : on baisse le seuil quand on n'a pas envie de tester quelque chose.
2. **Décisions au cas par cas** : chaque ligne fait l'objet d'un débat individuel, l'audit prend trois fois plus de temps.
3. **Engagement non vérifiable** : on dit "on teste ce qui est important" sans pouvoir mesurer si on tient parole.

**Comment le seuil résout ces problèmes** :

| Problème | Solution apportée par le seuil |
| --- | --- |
| Biais de motivation | Le seuil est figé avant le scoring, pas après |
| Décisions au cas par cas | Une seule décision (le seuil) tranche pour toutes les lignes |
| Engagement non vérifiable | On peut compter les fonctionnalités au-dessus et en dessous |

**Grille de seuils selon le contexte** :

| Contexte | Seuil typique | Conséquence |
| --- | --- | --- |
| Audit court (1 semaine) | Priorité ≥ 6 | On teste 5 à 10 fonctionnalités critiques |
| Audit moyen (1 mois) | Priorité ≥ 4 | On élargit aux fonctionnalités sensibles |
| Audit long (3 mois) | Priorité ≥ 3 | Couverture quasi complète sauf trivial |
| Projet neuf | Tout testé | On part propre |

**Règle d'or** : le seuil est posé AVANT l'audit, pas après. Si tu le poses après, tu rationalises tes envies au lieu de cadrer ton effort.

**Analogie concrète** : Pense à la note de passage d'un examen. Le professeur annonce "il faut 10/20 pour valider" avant que les élèves composent. Si le professeur attendait d'avoir corrigé pour décider de la note de passage, il pourrait l'adapter à ses préférences. Le seuil pré-établi est le 10/20 annoncé d'avance.

**Ce que le seuil n'est PAS** :

- Le seuil n'est pas un quota minimal. Si zéro fonctionnalité dépasse le seuil, c'est une information utile, pas un échec.
- Le seuil n'est pas immuable. Tu peux le réviser entre deux audits si le contexte change. Tu ne le révises pas pendant un audit en cours.

---

### Comment choisir le bon type de test selon la priorité ?

**Définition** : Le type de test (unitaire, fonctionnel, intégration) dépend de la priorité de la fonctionnalité. Plus la priorité est haute, plus on combine plusieurs niveaux de protection.

**Le problème que ce choix résout** :

Sans règle de choix, voici les problèmes rencontrés :

1. **Sur-tests sur du trivial** : on écrit 3 niveaux de tests pour un getter.
2. **Sous-tests sur du critique** : un test unitaire seul protège mal un parcours métier complet.
3. **Effort mal calibré** : on passe autant de temps à tester une page d'aide qu'à tester une transaction bancaire.

**Comment le choix résout ces problèmes** :

| Problème | Solution apportée par le choix par priorité |
| --- | --- |
| Sur-tests sur du trivial | Sous le seuil, pas de test obligatoire |
| Sous-tests sur du critique | Au-dessus du seuil maximal, plusieurs types de tests combinés |
| Effort mal calibré | L'effort suit le score, pas l'envie |

**Grille de choix par priorité** :

| Priorité | Types de tests recommandés |
| --- | --- |
| 9 (max) | Fonctionnel + unitaire des invariants (double protection) |
| 6 | Fonctionnel OU unitaire selon la zone |
| 4-5 | Unitaire suffisant la plupart du temps |
| 3 et moins | Pas testé dans cette itération |

**Analogie concrète** : Pense aux serrures d'une maison. La porte d'entrée (priorité 9) a une serrure trois points, une chaîne et une alarme. La porte du garage (priorité 6) a une serrure simple. La porte de la cave intérieure (priorité 3) a juste un loquet. Tu n'aurais pas l'idée de mettre une serrure trois points sur la cave, ni un loquet sur l'entrée.

**Ce que ce choix n'est PAS** :

- Ce choix n'est pas une exclusion absolue. Rien n'empêche d'écrire un test unitaire sur une zone à priorité 3 si tu y modifies déjà du code.
- Ce choix n'est pas un substitut à la revue de code. Les tests automatiques ne remplacent pas l'inspection manuelle.

---

## Étapes Pratiques

### Étape 1 : Reprendre ta cartographie

Repars du tableau produit dans la fiche 2 (cartographie). Ajoute deux colonnes : Impact (1-3) et Probabilité (1-3).

Commande pour ouvrir ta cartographie :

```bash
# On suppose une cartographie versionnee dans le depot
# Edite le fichier dans ton editeur
code docs/audit/cartographie.md
```

**Résultat attendu** :

```text
Le fichier de cartographie contient :
- Une ligne par fonctionnalite ou URL
- Une colonne Description claire
- Deux nouvelles colonnes vides : Impact et Probabilite
```

---

### Étape 2 : Scorer chaque ligne

Pour chaque ligne, choisis un score de 1 à 3 sur Impact, puis un score de 1 à 3 sur Probabilité.

Conseil de cadrage : si tu hésites entre deux scores, prends le plus haut. Mieux vaut sur-couvrir un risque moyen que sous-couvrir un risque grave.

Exemple :

| URL | Description | Impact | Proba | Priorité | Type de test |
| --- | --- | --- | --- | --- | --- |
| `/commande/valider` | Validation paiement | 3 | 2 | 6 | Fonctionnel |
| `/admin/users/{id}/supprimer` | Suppression user (RGPD) | 3 | 2 | 6 | Fonctionnel + unitaire |
| `/commande/{id}/suivi/{token}` | Accès anonyme | 3 | 3 | 9 | Fonctionnel + unitaire |
| `/profil` | Affichage profil | 1 | 1 | 1 | Pas testé |
| `/mentions-legales` | Page statique | 1 | 1 | 1 | Pas testé |

**Résultat attendu** :

```text
Toutes les lignes ont un score Impact, un score Probabilite et un produit.
Aucune case n'est vide.
```

---

### Étape 3 : Fixer le seuil et le communiquer

Sur ton tableau, surligne la ligne du seuil. Au-dessus, tu testes. En dessous, tu ne testes pas. Documente cette décision dans le tableau lui-même.

Exemple de note à ajouter en haut du fichier :

```text
Seuil = 6 fixé le 12 mai 2026
Justification : audit de 2 semaines, on cible les fonctionnalites critiques.
Revision prevue : prochaine iteration trimestrielle.
```

**Résultat attendu** :

```text
La decision de seuil est :
- Datee
- Justifiee
- Versionnee dans git (commit dedie)
```

---

### Étape 4 : Trier et étiqueter

Trie le tableau par priorité décroissante. Étiquette les types de tests à produire selon la grille. Le tableau devient ton backlog d'audit.

Commande pour trier :

```bash
# Si ta cartographie est en CSV
sort -t',' -k5,5 -nr cartographie.csv > cartographie-triee.csv
```

**Résultat attendu** :

```text
Le tableau est ordonne du score 9 au score 1.
Les premieres lignes sont les fonctionnalites a tester en priorite.
La derniere ligne au-dessus du seuil marque la frontiere claire.
```

---

### Étape 5 : Itérer pour les nouveaux développements

À chaque nouvelle fonctionnalité ajoutée au projet, score-la avant de la coder. Si la priorité dépasse le seuil, écris les tests dès le début (TDD ou test-after immédiat).

Workflow pour chaque ticket :

```text
1. Lire l'enonce du ticket
2. Estimer Impact (1-3) en se basant sur la grille
3. Estimer Probabilite (1-3) en se basant sur la grille
4. Calculer le produit
5. Si produit >= seuil : prevoir les tests des le debut
6. Si produit < seuil : developpement sans test obligatoire
```

**Résultat attendu** :

```text
Chaque ticket arrive en developpement avec :
- Un score Impact documente
- Un score Probabilite documente
- Une decision claire : avec ou sans test
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| Score Impact 1-3 | Quantifier les conséquences d'une défaillance |
| Score Probabilité 1-3 | Quantifier le risque de régression |
| Produit Impact × Probabilité | Priorité finale |
| Seuil fixé à l'avance | Éviter le biais de motivation |
| Tableau versionné dans git | Permettre l'audit ultérieur des décisions |

---

## Pièges Fréquents

### Piège 1 : Scorer à la louche

⚠️ **Problème** : Si tu mets 3-3 partout par prudence, le tableau ne sert plus à rien. Toutes les fonctionnalités sont prioritaires, ce qui revient à ne plus prioriser du tout.

✅ **Solution** : Force-toi à différencier. Relis la grille de scoring avant chaque ligne. Si tu as cinq fois le score 3 d'affilée, demande-toi si tu n'es pas en train d'arrondir vers le haut par confort.

---

### Piège 2 : Seuil fixé après le scoring

⚠️ **Problème** : Tu finis le scoring, tu vois qu'il y a trop de lignes au-dessus de 6, donc tu remontes le seuil à 8 pour avoir moins de travail. C'est une rationalisation a posteriori.

✅ **Solution** : Toujours fixer le seuil avant de scorer. Si après scoring tu as trop de lignes au-dessus, c'est une information utile : ton projet a beaucoup de risques, et il faut soit allonger l'audit, soit assumer la non-couverture.

---

### Piège 3 : Confondre fréquence d'usage et probabilité de bug

⚠️ **Problème** : Tu mets un score Probabilité élevé sur les pages très visitées en pensant "c'est utilisé donc c'est risqué". Or une fonction très utilisée peut être très stable, parce qu'elle a été polie au fil du temps.

✅ **Solution** : Le score Probabilité mesure le risque de régression, pas le trafic. Base-le sur la complexité du code, la fréquence des modifications, et la couverture de tests actuelle.

---

### Piège 4 : Sous-évaluer l'impact réglementaire

⚠️ **Problème** : Tu mets un Impact 2 sur un bug RGPD parce que "ça ne fait pas perdre d'argent directement". En réalité, une non-conformité réglementaire est un risque maximal : amendes, atteinte à la réputation, obligation de notification.

✅ **Solution** : Toujours scorer 3 sur les sujets réglementaires : RGPD, accessibilité légale, conformité bancaire, sécurité des données médicales, traçabilité fiscale.

---

### Piège 5 : Réviser le score sans traçabilité

⚠️ **Problème** : Tu rebaisses un score de 6 à 4 pour ne pas avoir à tester la ligne, et tu ne notes pas pourquoi. Trois mois plus tard, personne ne se souvient de la justification, et la zone devient un angle mort silencieux.

✅ **Solution** : Si tu révises un score, note la date, l'ancienne valeur, la nouvelle valeur, et la raison du changement. Le tableau garde la mémoire de toutes les décisions.

---

## Checklist de Validation

- [ ] J'ai ajouté Impact et Probabilité à ma cartographie
- [ ] J'ai scoré toutes les fonctionnalités sur les deux axes
- [ ] J'ai fixé un seuil objectif AVANT le scoring
- [ ] J'ai trié le tableau par priorité décroissante
- [ ] J'ai identifié au moins 3 fonctionnalités au-dessus du seuil
- [ ] La décision de seuil est documentée et datée

---

## Exercice Pratique

**Énoncé** : Scorer les fonctionnalités ci-dessous d'une application de réservation de salles.

| URL | Description |
| --- | --- |
| `/connexion` | Login utilisateur |
| `/profil/changer-mot-de-passe` | Changement de mot de passe |
| `/salles` | Liste des salles disponibles |
| `/salles/{id}/reserver` | Création d'une réservation |
| `/admin/salles/{id}/supprimer` | Suppression d'une salle (admin) |
| `/admin/utilisateurs/exporter` | Export RGPD (admin) |
| `/aide` | Page d'aide statique |
| `/profil/notifications` | Préférences de notification |

**Indications** :

1. Attribue Impact et Probabilité à chaque ligne en suivant les grilles vues plus haut.
2. Calcule la priorité (produit des deux scores).
3. Fixe un seuil cohérent pour une mission de 2 semaines.
4. Liste les fonctionnalités au-dessus du seuil.

**Résultat attendu** : Un tableau complet avec les scores, le produit, le seuil documenté et la liste des fonctionnalités à tester en priorité.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Une proposition possible :

| URL | Impact | Proba | Priorité | Justification |
| --- | --- | --- | --- | --- |
| `/connexion` | 3 | 2 | 6 | Sécurité critique mais code souvent stable |
| `/profil/changer-mot-de-passe` | 3 | 2 | 6 | Touche au secret du compte |
| `/salles` | 1 | 1 | 1 | Lecture publique, simple |
| `/salles/{id}/reserver` | 2 | 3 | 6 | Cœur métier, logique complexe (disponibilités, conflits) |
| `/admin/salles/{id}/supprimer` | 3 | 1 | 3 | Destruction de données, code probablement simple |
| `/admin/utilisateurs/exporter` | 3 | 2 | 6 | RGPD, format complexe |
| `/aide` | 1 | 1 | 1 | Statique |
| `/profil/notifications` | 1 | 2 | 2 | Préférences, peu critique |

**Seuil pour 2 semaines** : 6 (ce qui donne environ 4 à 5 fonctionnalités à tester).

**Au-dessus du seuil** :

- `/connexion`
- `/profil/changer-mot-de-passe`
- `/salles/{id}/reserver`
- `/admin/utilisateurs/exporter`

Quatre fonctionnalités, environ 3 jours par fonctionnalité à raison de 2 à 3 tests par fonctionnalité, l'audit est tenable en 2 semaines.

**Discussion** : la ligne `/admin/salles/{id}/supprimer` est à 3, donc en dessous du seuil. Tu peux choisir de la tester quand même si c'est rapide, mais ce n'est pas un engagement de l'audit. Si tu décides de la tester, note-le comme "test bonus", pas comme "test obligatoire".

---

## Navigation

← Fiche précédente : **[Identifier les invariants métier](03-invariants-metier.md)**

→ Fiche suivante : **[Lire le code pour repérer les bugs](05-lire-code-detecter-bugs.md)**
