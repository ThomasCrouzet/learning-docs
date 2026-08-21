---
tags:
  - Audit
  - Communication
  - Méthodologie
description: "Rédiger une issue technique efficace : structure, titre actionnable, procédure de reproduction, hypothèse de cause, correction proposée."
estimated_time: "45 min"
fiche_number: 6
total_fiches: 6
cursus: "Audit et Qualité"
id: "transversal.audit.rediger-issue-technique"
course_id: "transversal.audit"
content_type: "lesson"
order: 6
---

# 06 - Rédiger une issue technique efficace

> **En bref** : Une bonne issue se lit en 30 secondes, se reproduit en 2 minutes et donne au lecteur tout ce qu'il faut pour décider quoi faire. Cette fiche te donne la structure à respecter et des templates copiables. Lecture estimée : 45 min.

## Prérequis

- Fiche 5 : [Lire le code pour repérer les bugs](05-lire-code-detecter-bugs.md)
- Notions Git et GitLab/GitHub

## Objectif de cette fiche

À la fin de cette fiche, tu sauras structurer une issue technique en six sections obligatoires, choisir un titre actionnable, distinguer bug, régression, dette et amélioration, et estimer la sévérité de façon argumentée.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une issue technique ?

**Définition** : Une issue technique est une description structurée d'un problème logiciel destinée à être priorisée et traitée par une équipe. Elle vit dans un outil de suivi (GitLab, GitHub, Jira) et sert de référence partagée entre toutes les personnes impliquées.

**Le problème que l'issue technique résout** :

Sans structure d'issue claire, voici les problèmes rencontrés :

1. **Perte d'information** : un problème évoqué en messagerie disparaît dans le flux des conversations.
2. **Travail dupliqué** : deux personnes corrigent le même bug parce qu'aucune trace centrale n'existe.
3. **Priorisation impossible** : sans description écrite, on ne peut pas comparer deux problèmes ni planifier.

**Comment l'issue technique résout ces problèmes** :

| Problème | Solution apportée par l'issue technique |
| --- | --- |
| Perte d'information | Le problème est consigné par écrit, daté, classé |
| Travail dupliqué | Tout le monde voit qui a pris quoi et où ça en est |
| Priorisation impossible | Les tags et la sévérité permettent de trier |

**Analogie concrète** : Une issue ressemble à une fiche d'admission aux urgences. Tu y notes les symptômes (ce qui se passe), les antécédents (ce qui marchait avant), la gravité (bloquant, urgent, simple confort) et l'action envisagée (examen, traitement, surveillance). Sans cette fiche, le médecin suivant ne saurait pas par où commencer.

**Ce qu'une issue technique n'est PAS** :

- Une issue n'est pas un cri de frustration. Elle décrit un fait, pas une émotion.
- Une issue n'est pas une note privée. Elle est rédigée pour qu'une autre personne puisse comprendre sans contexte oral.
- Une issue n'est pas une suggestion vague. Elle propose au minimum une procédure pour reproduire et une piste de correction.

---

### Quelles sont les six sections obligatoires ?

**Définition** : Une issue exploitable contient toujours les mêmes blocs. La structure est fixe ; seuls le contenu et la longueur varient.

**Le problème que cette structure résout** :

Sans sections standardisées, chaque issue est lue différemment et la moitié des informations clés est oubliée.

**Tableau des sections** :

| Section | Contenu | Longueur typique |
| --- | --- | --- |
| Titre | Action courte et précise | 5 à 12 mots |
| Contexte | Où, quand, qui est concerné | 2 à 5 lignes |
| Comportement observé | Ce qui se passe actuellement | 2 à 6 lignes |
| Comportement attendu | Ce qui devrait se passer | 2 à 6 lignes |
| Procédure de reproduction | Étapes numérotées pour reproduire | 3 à 10 étapes |
| Hypothèse / correction proposée | Explication probable et fix envisagé | 5 à 15 lignes |

**Analogie concrète** : Pense à un formulaire administratif. Chaque champ existe pour une raison. Si tu sautes le champ "adresse", le courrier ne part pas. Si tu sautes "procédure de reproduction", l'issue ne peut pas être traitée.

**Ce que cette structure n'est PAS** :

- Ce n'est pas une recette à appliquer mécaniquement. Une issue très simple peut tenir en 10 lignes ; une issue complexe peut en faire 200.
- Ce n'est pas une garantie de qualité. Une issue bien structurée mais sans contenu utile reste inutile.

---

### Bug, régression, dette ou amélioration ?

**Définition** : Ces quatre catégories décrivent la nature du problème signalé. Les confondre conduit à des débats stériles ("c'est un bug ou pas ?") au lieu de discuter de l'action à mener.

**Le problème que cette classification résout** :

Sans catégorisation, on traite de la même manière un bug bloquant (à corriger tout de suite) et une amélioration cosmétique (à planifier).

**Tableau des types** :

| Type | Définition | Tag GitLab/GitHub typique |
| --- | --- | --- |
| Bug | Comportement différent de la spécification | `bug` |
| Régression | Comportement qui marchait avant et qui ne marche plus | `regression` |
| Dette | Code qui marche mais coûtera cher à modifier | `tech-debt` |
| Amélioration | Nouvelle fonctionnalité ou meilleure version d'une existante | `enhancement` |

**Analogie concrète** : Sur un véhicule, un frein qui ne fonctionne pas est un bug, un frein qui marchait hier mais plus aujourd'hui est une régression, des plaquettes usées qui marchent encore mais grincent sont de la dette, et l'ajout d'un assistant de freinage est une amélioration. Les quatre méritent un traitement différent.

**Ce que cette classification n'est PAS** :

- Ce n'est pas une hiérarchie de gravité. Une dette technique peut être plus prioritaire qu'un bug cosmétique.
- Ce n'est pas figé. Une "amélioration" peut devenir un "bug" si la spécification change.

**Comparaison bug vs régression** :

| Bug | Régression |
| --- | --- |
| N'a jamais fonctionné correctement | Fonctionnait avant, ne fonctionne plus |
| Cause potentielle ancienne | Cause potentielle dans un changement récent |
| Recherche du fix dans tout le code | Recherche prioritaire dans les derniers commits |
| Pas forcément urgent | Souvent urgent (impact sur production) |

---

### Comment estimer la sévérité ?

**Définition** : La sévérité décrit l'impact du problème sur les utilisateurs, indépendamment de la difficulté à le corriger. Elle conditionne le délai cible de traitement.

**Le problème que cette échelle résout** :

Sans échelle commune, "urgent" veut dire des choses différentes selon la personne. La sévérité standardise le vocabulaire.

**Tableau des niveaux** :

| Niveau | Définition | Délai cible |
| --- | --- | --- |
| Bloquant | Empêche d'utiliser le système | Immédiat |
| Majeur | Dégrade fortement une fonctionnalité | Moins d'une semaine |
| Mineur | Inconfort sans alternative | Moins d'un mois |
| Cosmétique | Bug visuel sans impact fonctionnel | À planifier |

**Règle clé** : La sévérité se définit par le **comportement**, pas par la **complexité de la correction**. Un bug bloquant qui se corrige en une ligne reste bloquant. Un bug cosmétique qui demande deux jours de travail reste cosmétique.

**Analogie concrète** : Pense à un triage médical. La gravité d'un patient se mesure à ses symptômes (douleur, état de conscience, signes vitaux), pas au temps que le traitement prendra. Un patient avec une plaie ouverte passe avant un patient avec un mal de tête, même si recoudre prend plus de temps qu'écouter.

**Ce que la sévérité n'est PAS** :

- Ce n'est pas la priorité. La priorité combine sévérité, fréquence d'occurrence, nombre d'utilisateurs impactés et coût de la correction.
- Ce n'est pas un avis personnel. C'est un constat sur ce que vit l'utilisateur.

---

### Anatomie d'un bon titre

**Définition** : Le titre d'une issue est la seule chose lue par 90 % des personnes qui voient ta liste de tickets. Il doit suffire à comprendre de quoi il s'agit et à décider si on ouvre ou pas.

**Le problème qu'un bon titre résout** :

Un titre vague oblige à ouvrir chaque ticket pour comprendre, ce qui ralentit la navigation et le tri.

**Tableau d'exemples** :

| Mauvais titre | Bon titre |
| --- | --- |
| "Bug dans le login" | "Le login renvoie 500 quand l'email contient un + (signe plus)" |
| "Problème de performance" | "La liste des produits prend 12s sur la page admin (catalogue > 5000 items)" |
| "À corriger" | "Le formulaire de contact ne valide pas le format du téléphone" |
| "Question" | "Faut-il garder le workflow permissif sur les commandes ?" |

**Règle de composition** : Un bon titre contient au moins trois éléments :

- Sujet (quoi)
- Symptôme (comment)
- Condition (quand)

**Analogie concrète** : Un bon titre ressemble à un titre de journal local. "Accident grave route nationale 7" est utile. "Incident" ne l'est pas. Le lecteur doit savoir, sans cliquer, ce qui s'est passé, où et à quel point c'est sérieux.

**Ce qu'un bon titre n'est PAS** :

- Ce n'est pas une description complète. La description vit dans le corps de l'issue.
- Ce n'est pas une émotion. "Ce truc est complètement cassé" ne dit rien d'exploitable.

---

## Étapes Pratiques

### Étape 1 : Écrire le titre en dernier

Paradoxe utile : commence par décrire le problème (sections 2 à 6), puis condense en titre à la fin. Tu sais ce que tu veux titrer après avoir écrit l'analyse.

L'ordre de rédaction recommandé est :

1. Procédure de reproduction
2. Comportement observé / attendu
3. Contexte
4. Hypothèse / correction proposée
5. Titre
6. Sévérité et tags

**Résultat attendu** :

```text
Le titre final résume précisément les sections 2 à 6.
Il devient un point d'entrée fidèle pour le lecteur.
```

---

### Étape 2 : Décrire le contexte

Quatre questions à couvrir :

- Où (URL, fichier, fonction)
- Quand (depuis quel commit, à quelle version)
- Qui (quels rôles utilisateurs sont concernés)
- Quoi (quelle fonctionnalité métier est impliquée)

Exemple :

```text
**Contexte** : Le bouton "Valider la commande" sur la page `/panier/finaliser`
ne fonctionne plus depuis le commit a1b2c3d (refactor des formulaires).
Tous les utilisateurs sont concernés. Fonctionnalité : finalisation d'achat.
```

**Résultat attendu** :

```text
Le lecteur sait, sans ouvrir le code, où chercher et qui contacter.
```

---

### Étape 3 : Documenter la procédure de reproduction

Format numéroté, étapes minimales :

```text
1. Se connecter en tant qu'utilisateur (`test@example.com` / `password123`)
2. Aller sur `/catalogue`
3. Cliquer sur "Ajouter au panier" sur n'importe quel produit
4. Aller sur `/panier/finaliser`
5. Cliquer sur "Valider la commande"

**Résultat observé** : page blanche, console JS affiche "Cannot read property X of undefined".
**Résultat attendu** : redirection vers `/confirmation/{id}` avec message succès.
```

Règle : si tu ne peux pas reproduire toi-même, l'issue est faible. Demande à un collègue d'essayer avec tes étapes avant de soumettre.

**Résultat attendu** :

```text
Un mainteneur peut reproduire le bug en moins de 2 minutes
en suivant les étapes telles quelles.
```

---

### Étape 4 : Inclure les preuves techniques

Selon le cas :

- Capture d'écran ou GIF pour les bugs UI
- Stack trace complète pour les erreurs serveur
- Log d'erreur filtré pour les bugs intermittents
- Lien vers le commit ou la PR qui a probablement causé le bug

Exemple de bloc preuve :

```text
**Stack trace** (extrait, fichier `var/log/app.log` ligne 1284) :

TypeError: Cannot read property 'amount' of undefined
    at OrderController.validate (src/Controller/OrderController.php:87)
    at Symfony\Component\HttpKernel\HttpKernel.handleRaw (...)

**Commit suspect** : a1b2c3d "refactor: simplify cart cleanup"
```

**Résultat attendu** :

```text
Le lecteur dispose de preuves directement utilisables,
sans avoir à reconstituer la scène.
```

---

### Étape 5 : Proposer une cause et une correction

Format type :

```text
**Hypothèse** : la méthode `OrderController::validate` appelle
`$cart->getTotal()` après que le panier a été vidé par `clearCart()`
plus haut, donc `$total` vaut 0.

**Correction proposée** :
- Soit déplacer `clearCart()` après la création de la commande
- Soit calculer `$total` AVANT `clearCart()` et le stocker dans une variable

Préférence : option 2, plus défensive et compatible avec une éventuelle
annulation de commande.
```

Cette section transforme l'issue de "il y a un problème" en "voilà une piste à valider ou réfuter".

**Résultat attendu** :

```text
Le mainteneur peut accepter, raffiner ou rejeter l'hypothèse
au lieu de partir de zéro.
```

---

### Étape 6 : Étiqueter et assigner

Tags suggérés :

- Type : `bug`, `regression`, `tech-debt`, `enhancement`
- Sévérité : `severity:blocker`, `severity:major`, `severity:minor`, `severity:cosmetic`
- Domaine : `cart`, `auth`, `admin`, `catalog`, etc.

Assignation : à toi-même si tu prends le ticket, à l'équipe pertinente sinon. Ne jamais laisser une issue sans propriétaire identifié.

**Résultat attendu** :

```text
L'issue apparaît dans les bons filtres, son responsable est connu,
sa sévérité est lisible d'un coup d'œil.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `git log --oneline -20` | Voir les 20 derniers commits |
| `git bisect` | Trouver le commit qui a introduit un bug |
| `git blame fichier.php` | Voir qui a modifié chaque ligne |
| Template d'issue | Fichier `.gitlab/issue_templates/bug.md` ou équivalent GitHub |
| Lien de commit | `https://gitlab.example/repo/-/commit/<sha>` |

---

## Template d'issue (copiable)

```markdown
## Contexte
[Où, quand, qui, quoi]

## Comportement observé
[Ce qui se passe]

## Comportement attendu
[Ce qui devrait se passer]

## Procédure de reproduction
1. ...
2. ...
3. ...

**Résultat observé** : ...
**Résultat attendu** : ...

## Hypothèse / cause probable
[Analyse du code]

## Correction proposée
[Options envisagées, préférence justifiée]

## Sévérité
[Bloquant / Majeur / Mineur / Cosmétique]

## Liens
- Commit suspect : ...
- Test concerné : ...
- Documentation liée : ...
```

---

## Pièges Fréquents

### Piège 1 : Titre vague

⚠️ **Problème** : "Bug dans la commande" oblige à ouvrir l'issue pour comprendre. Le lecteur perd du temps à chaque passage dans la liste.

✅ **Solution** : Investir une minute sur le titre fait gagner du temps à chaque lecteur. Sujet + symptôme + condition.

### Piège 2 : Pas de procédure de reproduction

⚠️ **Problème** : Un mainteneur ne peut rien faire sans pouvoir reproduire le bug. Sans étapes, l'issue stagne.

✅ **Solution** : Toujours fournir des étapes minimales. Si le bug est intermittent, fournir les conditions probables et les logs.

### Piège 3 : Mélanger plusieurs bugs

⚠️ **Problème** : Une issue qui regroupe trois bugs distincts est impossible à fermer correctement. L'un est corrigé, l'autre non, et le ticket reste flou.

✅ **Solution** : Une issue = un bug. Si tu en trouves trois, ouvre trois issues distinctes et relie-les entre elles si nécessaire.

### Piège 4 : Diagnostiquer avant de décrire

⚠️ **Problème** : Commencer par "C'est sûrement à cause de X" sans avoir d'abord décrit le symptôme oriente le lecteur à tort. La discussion part sur une hypothèse au lieu du fait.

✅ **Solution** : Symptôme d'abord (objectif), hypothèse ensuite (subjectif). Le lecteur peut alors juger l'hypothèse à partir des mêmes faits.

### Piège 5 : Sévérité gonflée

⚠️ **Problème** : Tout marquer "majeur" ou "bloquant" pour faire passer son issue en priorité finit par neutraliser le signal. Plus rien n'est prioritaire.

✅ **Solution** : Garder la catégorie "bloquant" pour ce qui empêche vraiment le travail. Argumenter la sévérité en termes de comportement et d'impact utilisateur.

---

## Checklist de Validation

- [ ] Mon titre contient sujet, symptôme et condition
- [ ] J'ai documenté le contexte (où, quand, qui, quoi)
- [ ] J'ai donné une procédure de reproduction reproductible
- [ ] J'ai distingué comportement observé et comportement attendu
- [ ] J'ai proposé au moins une hypothèse de cause
- [ ] J'ai proposé au moins une correction
- [ ] J'ai estimé la sévérité par le comportement, pas par la difficulté de fix
- [ ] J'ai posé les bons tags (type, sévérité, domaine)
- [ ] J'ai assigné l'issue à une personne ou une équipe

---

## Exercice Pratique

**Énoncé** : Lis ce résumé technique :

> "Dans le code de gestion des commandes, j'ai vu que la méthode `processOrder` utilisait une variable `$discount` qui n'est jamais déclarée. Du coup quand un client a un coupon, le système ne l'applique jamais. Ça arrive sur toutes les commandes avec coupon. C'est probablement parce que la variable a été renommée mais qu'on a oublié un endroit."

Transforme-le en issue GitLab structurée, avec titre actionnable, sections obligatoires et sévérité justifiée.

**Indications** :

- Rédige d'abord les sections, puis le titre
- Cherche les quatre dimensions du contexte (où, quand, qui, quoi)
- Distingue clairement observé et attendu
- Argumente la sévérité en termes d'impact utilisateur

**Résultat attendu** : Une issue prête à coller dans GitLab, lisible en 30 secondes, reproductible par un développeur en deux minutes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```markdown
### Titre
Le coupon de réduction n'est jamais appliqué lors d'une commande (variable `$discount` non déclarée)

## Contexte
**Où** : `App\Service\OrderService::processOrder` (fichier `src/Service/OrderService.php`).
**Quand** : à chaque commande contenant un coupon.
**Qui** : tous les utilisateurs concernés (client final + gestionnaire qui voit un montant erroné).
**Quoi** : application des coupons de réduction lors du calcul du total commande.

## Comportement observé
Le total de la commande ne tient jamais compte du coupon. Le client paye le prix plein malgré la saisie d'un coupon valide.

## Comportement attendu
Le total doit être diminué du montant du coupon (montant fixe ou pourcentage selon la configuration du coupon).

## Procédure de reproduction
1. Se connecter avec un compte utilisateur
2. Ajouter un produit au panier (10,00 €)
3. Aller sur `/panier/finaliser`
4. Saisir le coupon `PROMO10` (valide, -10 %)
5. Cliquer sur "Valider"

**Résultat observé** : commande créée à 10,00 €.
**Résultat attendu** : commande à 9,00 € (10 % de réduction).

## Hypothèse / cause probable
La variable `$discount` est référencée dans `processOrder` mais n'apparaît dans aucune assignation antérieure.
Hypothèse : renommage ou suppression accidentels lors d'un refactoring.
La valeur lue est silencieusement traitée comme `null`, ce qui fait que la soustraction n'a aucun effet.

## Correction proposée
- Restaurer le calcul `$discount = $couponService->compute($coupon, $total);` avant l'utilisation.
- Ajouter un test fonctionnel `testProcessOrderAppliesPercentageCoupon` qui prévient la régression.

## Sévérité
**Majeur** : impact financier direct, tous les utilisateurs avec coupon concernés. Pas bloquant car la commande passe quand même.

## Liens
- Méthode : `src/Service/OrderService.php:processOrder`
- Test à ajouter : `tests/Functional/Order/CouponTest.php`
```

---

## Navigation

← Fiche précédente : **[Lire le code pour repérer les bugs](05-lire-code-detecter-bugs.md)**

→ Retour à l'index : **[Cursus Audit et Qualité](index.md)**
