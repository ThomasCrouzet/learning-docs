---
tags:
  - UX
  - Intermédiaire
  - Pratique
description: "Wireframes et maquettes : outils (Figma, Excalidraw), wireframes basse et haute fidélité, prototypage interactif et design responsive mobile-first."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 4
cursus: "UX Design"
---

# 02 - Wireframes et maquettes

> **En bref** : Apprendre à créer des wireframes basse et haute fidélité, utiliser Figma et Excalidraw, réaliser un prototype interactif et appliquer l'approche mobile-first. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Principes UX pour développeurs](01-principes-ux.md) pour connaître les bases de l'UX, les heuristiques de Nielsen et les personas
- Avoir suivi le cursus [HTML / CSS](../fondamentaux/04-html-css/index.md) pour comprendre les concepts de mise en page web (flexbox, grid)
- Savoir ce qu'est un navigateur web et comment inspecter une page (F12)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un wireframe basse fidélité sur papier, le traduire en wireframe haute fidélité avec un outil numérique, construire un prototype interactif navigable et concevoir en mobile-first.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un wireframe ?

**Définition** : Un wireframe est un schéma simplifie d'une page web ou d'un écran d'application. Il montre la structure et la disposition des éléments (navigation, contenu, boutons) sans couleurs, images ni typographie definitive. C'est le "squelette" de l'interface.

**Le problème que les wireframes résolvent** :

Sans wireframes, voici les problèmes rencontrès :

1. **Développer à l'aveugle** : Les développeurs codent directement sans plan. Ils decouvrent en cours de route que la structure ne fonctionne pas et doivent tout recommencer.
2. **Malentendus dans l'équipe** : Le client imagine une interface, le désigner en imagine une autre, le développeur en code une troisième. Sans représentation visuelle commune, chacun part dans sa direction.
3. **Corrections coûteuses** : Modifier une maquette haute fidélité ou du code prend des heures. Modifier un schéma sur papier prend 2 minutes.

**Comment les wireframes résolvent ces problèmes** :

| Problème | Solution apportée par les wireframes |
| --- | --- |
| Développer à l'aveugle | Le wireframe sert de plan avant le code, comme un plan d'architecte avant la construction |
| Malentendus dans l'équipe | Toute l'équipe valide la structure sur un support visuel commun avant de commencer |
| Corrections coûteuses | Les modifications sont rapides et gratuites au stade du wireframe |

**Analogie concrète** : Un wireframe, c'est comme le plan d'étage d'un appartement. Il montre ou se trouvent les pièces, les portes et les fenêtres. Il ne montre pas la couleur des murs ni le style des meubles. Ce plan permet de valider l'agencement avant de construire.

**Ce qu'un wireframe n'est PAS** :

- Un wireframe n'est pas une maquette finale. Il n'inclut ni couleurs, ni images, ni typographie definitive. Il est volontairement sobre pour concentrer l'attention sur la structure.
- Un wireframe n'est pas du code. Il ne décrit pas comment implementer l'interface, seulement comment elle est organisee.

---

### Quelle est la difference entre wireframe basse fidélité et haute fidélité ?

**Définition** : La fidélité d'un wireframe désigne son niveau de détail et de précision par rapport au produit final. Un wireframe basse fidélité (lo-fi) est un schéma rapide et approximatif. Un wireframe haute fidélité (hi-fi) est une représentation precise et détaillée.

**Comparaison basse fidélité vs haute fidélité** :

| Wireframe basse fidélité (lo-fi) | Wireframe haute fidélité (hi-fi) |
| --- | --- |
| Dessine sur papier ou tableau blanc | Realise avec un outil numérique (Figma, Excalidraw) |
| Formes simples : rectangles, lignes, texte griffonne | Éléments précis : tailles réelles, alignement, espacements |
| Fait en 5 a 15 minutes | Fait en 1 a 3 heures |
| Pour explorer des idées rapidement | Pour valider la structure avant le design final |
| Jetable (on le refait facilement) | Réutilisable (sert de base à la maquette) |
| Phase de brainstorming | Phase de conception détaillée |

**Quand utiliser chacun** :

- **Basse fidélité** : Au début du projet, quand tu explores plusieurs options de mise en page. Tu dessines 3 ou 4 variantes sur papier en 30 minutes pour choisir la meilleure direction.
- **Haute fidélité** : Après avoir choisi une direction, quand tu veux préciser la structure avant de passer au design visuel. Tu créés un wireframe numérique qui servira de base au désigner ou au développeur.

---

### Qu'est-ce que Figma ?

**Définition** : Figma est un outil de design d'interface en ligne (accessible depuis un navigateur web). Il permet de créer des wireframes, des maquettes et des prototypes interactifs. Sa version gratuite est suffisante pour un usage individuel ou en petite équipe.

**Le problème que Figma résout** :

Sans outil de design collaboratif, voici les problèmes rencontrès :

1. **Fichiers locaux non partageables** : Les maquettes sont sur l'ordinateur du désigner. Pour les partager, il faut exporter des images qui ne sont pas modifiables.
2. **Pas de prototypage** : Les images statiques ne permettent pas de tester la navigation entre les pages. L'équipe ne peut pas "cliquer" pour vérifier que le parcours utilisateur fonctionne.
3. **Versions multiples** : Chaque modification créé une nouvelle version du fichier. L'équipe ne sait plus quelle version est la bonne.

**Comment Figma résout ces problèmes** :

| Problème | Solution apportée par Figma |
| --- | --- |
| Fichiers non partageables | Tout est en ligne, accessible par URL. Plusieurs personnes peuvent voir et modifier en même temps |
| Pas de prototypage | Le mode Prototype permet de lier les écrans et de simuler la navigation |
| Versions multiples | Un seul fichier avec historique de versions integre |

**Fonctionnalités principales de Figma (version gratuite)** :

| Fonctionnalité | Description |
| --- | --- |
| Frames | Zones de travail qui représentent des écrans (mobile, tablette, desktop) |
| Composants | Éléments réutilisables (boutons, cartes, en-têtes) |
| Auto Layout | Disposition automatique des éléments (équivalent CSS flexbox) |
| Prototype | Liaison entre les écrans pour créer un prototype navigable |
| Commentaires | L'équipe peut commenter directement sur le design |
| Partage par lien | Un simple lien donne accès au fichier en lecture ou en édition |

---

### Qu'est-ce qu'Excalidraw ?

**Définition** : Excalidraw est un outil de dessin en ligne gratuit et open source. Il produit des schémas au style "dessine à la main" qui sont parfaits pour les wireframes basse fidélité. Il est simple, rapide et ne nécessite pas de compte.

**Quand utiliser Excalidraw plutôt que Figma** :

| Excalidraw | Figma |
| --- | --- |
| Wireframes basse fidélité | Wireframes haute fidélité et maquettes |
| Schémas rapides en reunion | Design detaille et prototypage |
| Style "croquis" informel | Design précis et professionnel |
| Pas de compte nécessaire | Compte gratuit requis |
| Export PNG/SVG | Export PNG/SVG/PDF + prototype interactif |

---

### Qu'est-ce qu'un prototype interactif ?

**Définition** : Un prototype interactif est une simulation navigable de l'interface. L'utilisateur peut cliquer sur les boutons, naviguer entre les pages et interagir avec les éléments comme si l'application était fonctionnelle. Rien n'est réellement code : ce sont des écrans lies entre eux par des interactions définies dans l'outil de design.

**Le problème que le prototypage résout** :

Sans prototype, voici les problèmes rencontrès :

1. **Parcours non testable** : Des images statiques ne permettent pas de vérifier si le parcours utilisateur fonctionne. L'équipe doit imaginer le flux.
2. **Retours tardifs** : Les utilisateurs ne peuvent donner un avis réaliste que sur un produit qu'ils peuvent manipuler. Des images ne suffisent pas.
3. **Coût du code** : Coder une interface complete pour la tester, puis la modifier après les retours, est extrêmement coûteux en temps.

**Comment le prototypage résout ces problèmes** :

| Problème | Solution apportée par le prototypage |
| --- | --- |
| Parcours non testable | Le prototype simule la navigation réelle entre les écrans |
| Retours tardifs | Les utilisateurs testent le prototype et donnent des retours avant le développement |
| Coût du code | Le prototype se modifie en minutes, sans écrire une ligne de code |

**Analogie concrète** : Un prototype, c'est comme une maquette en carton d'un bâtiment. Tu peux la manipuler, regarder à l'intérieur, deplacer les pièces. Ce n'est pas le vrai bâtiment, mais ca suffit pour valider le plan avant de couler le beton.

---

### Qu'est-ce que le design mobile-first ?

**Définition** : Le design mobile-first est une approche de conception qui commence par la version mobile d'une interface, puis l'adapte progressivement aux écrans plus grands (tablette, desktop). C'est l'inverse de l'approche traditionnelle qui part du desktop et réduit ensuite pour mobile.

**Le problème que le mobile-first résout** :

Sans approche mobile-first, voici les problèmes rencontrès :

1. **Surcharge d'information** : La version desktop est riche en contenu et en fonctionnalités. Quand on la réduit pour mobile, tout est compresse, les textes debordent et les boutons sont trop petits.
2. **Expérience mobile degradee** : Le mobile est traite comme un "sous-produit". Les fonctionnalités sont cachees, la navigation est confuse, l'expérience est frustrante.
3. **Trafic mobile ignoré** : Plus de 55% du trafic web mondial vient du mobile. Ignorer cette réalité revient à offrir une mauvaise expérience à la majorité des utilisateurs.

**Comment le mobile-first résout ces problèmes** :

| Problème | Solution apportée par le mobile-first |
| --- | --- |
| Surcharge d'information | On commence par l'essentiel (contrainte de l'écran petit), puis on enrichit pour les grands écrans |
| Expérience mobile degradee | Le mobile est la première priorité, pas un ajout tardif |
| Trafic mobile ignoré | L'expérience mobile est optimisee des le départ |

**Les 3 breakpoints principaux** :

| Appareil | Largeur | Breakpoint CSS courant |
| --- | --- | --- |
| Mobile | < 768px | Par défaut (pas de media query) |
| Tablette | 768px - 1024px | `@media (min-width: 768px)` |
| Desktop | > 1024px | `@media (min-width: 1024px)` |

**Analogie concrète** : Le mobile-first, c'est comme préparer une valise pour un voyage. Tu commences par l'essentiel (passeport, medicaments, vetements de base). Si tu as de la place, tu ajoutés des extras (livres, vetements supplémentaires). L'inverse - tout empiler puis essayer de réduire - mene à une valise qui ne ferme pas.

**Ce que le mobile-first n'est PAS** :

- Le mobile-first n'est pas "mobile only". L'objectif est de concevoir pour tous les écrans, en commencant par le plus petit pour garantir une expérience de base solide.
- Le mobile-first n'est pas un choix technique uniquement. C'est d'abord une décision de design : quels contenus sont essentiels ? Quelle est la hiérarchie de l'information ?

---

## Étapes Pratiques

### Étape 1 : Dessiner un wireframe basse fidélité sur papier

Tu vas créer un wireframe basse fidélité pour une page d'accueil d'application de recettes de cuisine (le même projet que le persona de la fiche précédente).

Prends une feuille de papier (ou un cahier) et un crayon. Dessine un rectangle représentant un écran de smartphone (environ 6 cm x 12 cm).

À l'intérieur, dessine les éléments suivants en utilisant des formes simples :

```text
+---------------------------+
|  [Logo]    [=] Menu       |   <- En-tete : un rectangle pour le logo,
|                           |      trois traits pour le menu hamburger
+---------------------------+
|                           |
|  [____________________]   |   <- Barre de recherche : un rectangle
|   Rechercher un ingredient|      avec du texte placeholder
|                           |
+---------------------------+
|                           |
|  Recettes populaires      |   <- Titre de section : texte
|                           |
|  +-------+  +-------+    |   <- Cartes : des rectangles avec
|  | [img] |  | [img] |    |      un carre pour l'image
|  | Titre |  | Titre |    |      et du texte pour le titre
|  | 30min |  | 45min |    |      et la duree
|  +-------+  +-------+    |
|                           |
|  +-------+  +-------+    |
|  | [img] |  | [img] |    |
|  | Titre |  | Titre |    |
|  | 20min |  | 60min |    |
|  +-------+  +-------+    |
|                           |
+---------------------------+
|  [Accueil] [Favoris] [+] |   <- Barre de navigation : icones
+---------------------------+      en bas de l'ecran
```

Conventions pour les wireframes papier :

| Élément | Comment le dessiner |
| --- | --- |
| Texte | Des lignes horizontales ondulees |
| Image | Un rectangle avec une croix à l'intérieur (X) |
| Bouton | Un rectangle arrondi avec du texte |
| Champ de saisie | Un rectangle avec du texte grise |
| Icône | Un petit cercle ou carre avec une lettre |
| Lien | Du texte souligne |

**Résultat attendu** :

Un schéma papier qui montre clairement la structure de la page : en-tête, barre de recherche, grille de recettes et barre de navigation. Le schéma ne contient ni couleurs, ni images réelles, ni typographie precise.

---

### Étape 2 : Créer un wireframe haute fidélité avec Excalidraw

Ouvre Excalidraw dans ton navigateur : `https://excalidraw.com`

Reproduis le wireframe papier de l'étape 1 avec ces améliorations :

1. **Cadre de l'écran** : Dessine un rectangle de 375 x 812 pixels (taille iPhone standard). Dans Excalidraw, les dimensions apparaissent quand tu dessines.

2. **En-tete** : Créé un rectangle plein en gris clair pour le fond. Ajoute un texte "RecetteApp" pour le logo et trois traits horizontaux pour le menu hamburger.

3. **Barre de recherche** : Dessine un rectangle arrondi avec le texte "Rechercher par ingrédient..." en gris.

4. **Cartes de recettes** : Dessine des rectangles de taille égale (170 x 200 pixels environ) disposés en grille 2 colonnes. Chaque carte contient un rectangle gris (emplacement image), un texte (titre) et un texte plus petit (durée).

5. **Barre de navigation** : Dessine un rectangle en bas avec 3 icônes représentées par des cercles et des labels texte.

Exporte le résultat en PNG :

1. Menu (icône hamburger en haut à gauche) > Export image
2. Choisis le format PNG
3. Sauvegarde le fichier

**Résultat attendu** :

Un fichier PNG montrant un wireframe au style "dessine à la main" avec les mêmes éléments que le wireframe papier, mais avec des tailles et alignements plus précis.

---

### Étape 3 : Créer un wireframe haute fidélité avec Figma

Créé un compte gratuit sur Figma (`https://www.figma.com`) si tu n'en as pas encore.

1. **Créer un nouveau fichier** : Clique sur "New design file"

2. **Créer un Frame mobile** : Appuie sur F (raccourci Frame), puis dans le panneau de droite, choisis "iPhone 14 & 15 Pro" (393 x 852). Ce Frame représente ton écran mobile.

3. **En-tete** : Dessine un rectangle (R) de la largeur du Frame et de 60px de hauteur. Remplis-le en gris clair (#F5F5F5). Ajoute un texte (T) "RecetteApp" et un texte "≡" pour le menu.

4. **Barre de recherche** : Dessine un rectangle arrondi (R puis change le rayon a 8px dans le panneau de droite). Largeur : 361px (marge de 16px de chaque cote). Hauteur : 44px. Remplissage : blanc. Bordure : 1px gris (#E0E0E0). Ajoute le texte placeholder en gris (#9E9E9E).

5. **Cartes de recettes** : Dessine une carte (rectangle 170 x 220px). À l'intérieur, place un rectangle gris pour l'image (170 x 130px) et deux textes pour le titre et la durée. Selectionne tous les éléments de la carte, fais un clic droit > "Group sélection". Duplique le groupe (Ctrl+D ou Cmd+D) pour créer 4 cartes disposees en grille 2x2.

6. **Barre de navigation** : Rectangle en bas du Frame (393 x 56px), fond blanc, bordure supérieure grise. Ajoute 3 textes centrès : "Accueil", "Favoris", "Ajouter".

7. **Verifier l'alignement** : Selectionne plusieurs éléments et utilise les outils d'alignement dans la barre supérieure (aligner à gauche, centrer, distribuer uniformement).

**Résultat attendu** :

Un wireframe Figma propre et aligne, avec une structure claire de page mobile. Tous les éléments sont correctement dimensionnes et espaces.

---

### Étape 4 : Créer un prototype interactif avec Figma

Tu vas lier les écrans pour créer un prototype navigable.

1. **Dupliquer le Frame** : Selectionne le Frame de l'étape 3. Appuie sur Ctrl+D (ou Cmd+D). Deplace la copie à droite. Tu as maintenant deux écrans côte à cote.

2. **Modifier le second écran** : Le second écran représente la page de détail d'une recette. Modifie-le pour afficher une grande image en haut, un titre de recette, la durée, les ingrédients et les étapes.

3. **Passer en mode Prototype** : Dans le panneau de droite, clique sur l'onglet "Prototype" (au lieu de "Design").

4. **Créer une interaction** : Clique sur la première carte de recette dans le Frame 1. Un petit cercle bleu apparaît sur le cote droit de l'élément. Glisse ce cercle vers le Frame 2 (page de détail).

5. **Configurer l'interaction** : Dans le panneau qui apparaît, configure :
   - Trigger : "On tap" (au clic)
   - Action : "Navigate to" (naviguer vers)
   - Animation : "Smart animate" ou "Slide in" (glissement)
   - Direction : "Left" (de droite à gauche, comme sur mobile)

6. **Ajouter un retour** : Sur le Frame 2, ajoute un bouton "←" (fleche retour) en haut à gauche. En mode Prototype, lie ce bouton au Frame 1 avec l'animation "Slide out" vers là droite.

7. **Tester le prototype** : Clique sur le bouton "Play" (triangle) en haut à droite de Figma. Le prototype s'ouvre dans une nouvelle fenêtre. Clique sur la carte pour naviguer vers le détail, puis sur la fleche retour pour revenir.

**Résultat attendu** :

Un prototype interactif ou tu peux :

- Cliquer sur une carte de recette pour voir le détail
- Cliquer sur la fleche retour pour revenir à l'accueil
- Les transitions sont animees (glissement lateral)

---

### Étape 5 : Adapter le wireframe en version desktop (mobile-first)

Tu as un wireframe mobile. Maintenant, adapte-le pour un écran desktop.

1. **Créer un nouveau Frame desktop** : Appuie sur F et choisis "Desktop" (1440 x 900) dans le panneau de droite.

2. **Adapter l'en-tête** : L'en-tête mobile utilise un menu hamburger. Sur desktop, remplace-le par une barre de navigation horizontale avec les liens en clair : "Accueil", "Favoris", "Ajouter une recette", "Mon profil".

3. **Élargir la barre de recherche** : Sur mobile, la barre occupe toute la largeur. Sur desktop, limite-la a 600px et centre-la.

4. **Passer de 2 à 4 colonnes** : Les cartes de recettes sont en grille 2 colonnes sur mobile. Sur desktop, utilise 4 colonnes pour exploiter l'espace disponible.

5. **Ajouter une sidebar** : Sur desktop, tu as de la place pour une barre laterale avec des filtrès (catégorie, durée, difficulté) que tu n'avais pas sur mobile.

6. **Supprimer la barre de navigation basse** : Sur mobile, la barre de navigation est en bas de l'écran (pouce accessible). Sur desktop, la navigation est dans l'en-tête. Supprime la barre basse.

Resume des adaptations mobile vers desktop :

| Élément | Mobile | Desktop |
| --- | --- | --- |
| Navigation principale | Menu hamburger (≡) | Liens horizontaux dans l'en-tête |
| Barre de recherche | Pleine largeur | 600px centree |
| Grille de recettes | 2 colonnes | 4 colonnes |
| Filtrès | Pas de place (accessible via icône) | Sidebar laterale visible |
| Navigation basse | Barre fixe en bas | Supprimee (navigation dans l'en-tête) |

**Résultat attendu** :

Un wireframe desktop qui reprend tous les éléments du wireframe mobile mais adaptes à la taille de l'écran : navigation horizontale, grille plus large, sidebar de filtrès visible.

---

## Commandes Utiles

| Action | Raccourci Figma |
| --- | --- |
| Créer un Frame | F |
| Dessiner un rectangle | R |
| Ajouter du texte | T |
| Dessiner un cercle/ellipse | O |
| Dessiner une ligne | L |
| Dupliquer un élément | Ctrl+D (Cmd+D sur Mac) |
| Grouper des éléments | Ctrl+G (Cmd+G sur Mac) |
| Degrouper | Ctrl+Shift+G (Cmd+Shift+G sur Mac) |
| Zoomer pour ajuster | Ctrl+1 (Cmd+1 sur Mac) |
| Lancer le prototype | Bouton Play (triangle) en haut à droite |
| Exporter en PNG | Sélectionner le Frame > panneau Export > PNG |

---

## Pièges Fréquents

### Piège 1 : Commencer directement en haute fidélité

⚠️ **Problème** : Tu ouvres Figma et tu commences directement un wireframe detaille sans avoir esquisse sur papier. Tu passes 2 heures sur un premier écran, puis tu realises que la structure ne fonctionne pas.

✅ **Solution** : Commence toujours par un wireframe basse fidélité sur papier (5-10 minutes). Dessine 2 ou 3 variantes. Choisis la meilleure. Ensuite seulement, passe à l'outil numérique. Le papier est jetable et rapide ; l'outil numérique est précis mais lent.

---

### Piège 2 : Ajouter des couleurs et des images dans un wireframe

⚠️ **Problème** : Tu ajoutés des couleurs vives, des photos et des polices decoratives dans ton wireframe. L'équipe discute des couleurs au lieu de la structure.

✅ **Solution** : Un wireframe utilise uniquement du gris, du blanc et du noir. Les images sont représentées par des rectangles gris avec une icône de paysage ou une croix. Cela force l'équipe à se concentrer sur la disposition et le contenu, pas sur l'esthetique.

---

### Piège 3 : Concevoir desktop-first puis réduire pour mobile

⚠️ **Problème** : Tu créés une page desktop riche en contenu (sidebar, colonnes multiples, images larges) puis tu essaies de tout faire rentrer sur un écran mobile. Le résultat est compresse et inutilisable.

✅ **Solution** : Commence par le mobile. Identifie les éléments essentiels qui doivent apparaître sur un petit écran. Ensuite, ajoute des éléments et de l'espace pour les écrans plus grands. C'est plus facile d'ajouter que de retirer.

---

### Piège 4 : Oublier les états intermédiaires

⚠️ **Problème** : Tu dessines l'écran principal mais tu oublies les états intermédiaires : chargement, erreur, liste vide, première utilisation.

✅ **Solution** : Pour chaque écran, dessine au minimum 4 états :

- **État normal** : L'écran avec du contenu
- **État vide** : L'écran sans contenu (première utilisation)
- **État de chargement** : L'écran pendant le chargement des données
- **État d'erreur** : L'écran quand quelque chose ne fonctionne pas

---

## Checklist de Validation

- [ ] J'ai dessine un wireframe basse fidélité sur papier en moins de 15 minutes
- [ ] J'ai créé un wireframe numérique avec Excalidraw ou Figma
- [ ] Mon wireframe montre la structure sans couleurs ni images réelles
- [ ] J'ai créé un prototype interactif avec au moins 2 écrans lies
- [ ] J'ai adapte mon wireframe mobile en version desktop
- [ ] Je connais les 3 breakpoints principaux (mobile, tablette, desktop)
- [ ] J'ai conçu en mobile-first (mobile d'abord, desktop ensuite)

---

## Exercice Pratique

**Énoncé** : Crée les wireframes complets pour une application de gestion de tâches (to-do list) en suivant l'approche mobile-first.

**Partie 1 - Wireframes basse fidélité (papier)** :

Dessine sur papier les 4 écrans suivants en version mobile :

1. **Liste des tâches** : affiche les tâches groupees par statut (a faire, en cours, terminees)
2. **Création d'une tâche** : formulaire avec titre, description, priorité et date limite
3. **Détail d'une tâche** : affiche toutes les informations de la tâche avec un bouton pour changer le statut
4. **Paramètres** : options de tri, filtrès et préférences

**Partie 2 - Wireframe haute fidélité (Figma)** :

Reproduis l'écran "Liste des tâches" dans Figma en version mobile (393 x 852).

**Partie 3 - Prototype interactif** :

Dans Figma, lie les écrans :

- Clic sur une tâche → écran de détail
- Clic sur "+" → écran de création
- Clic sur retour → retour à la liste

**Partie 4 - Adaptation desktop** :

Créé la version desktop (1440 x 900) de l'écran "Liste des tâches" :

- 3 colonnes (a faire, en cours, termine) en style Kanban
- Sidebar avec filtrès et catégories

**Indications** :

- Commence par les schémas papier avant d'ouvrir Figma
- Utilise des rectangles gris pour les images et des lignes pour le texte
- Pour le prototype, 3 écrans lies suffisent

**Résultat attendu** :

- 4 schémas papier (photos acceptees)
- 1 wireframe Figma mobile
- 1 prototype interactif avec 3 écrans navigables
- 1 wireframe Figma desktop

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 - Wireframe papier de l'écran "Liste des tâches" (mobile)** :

```text
+---------------------------+
|  TaskApp           [+]    |   <- En-tete avec bouton d'ajout
+---------------------------+
|  [Toutes] [A faire] [OK]  |   <- Onglets de filtre par statut
+---------------------------+
|                           |
|  A faire (3)              |   <- Section avec compteur
|  +------------------------+
|  | ○ Faire les courses    |   <- Tache non cochee
|  |   Priorite: Haute      |
|  |   Echeance: 15 mars    |
|  +------------------------+
|  | ○ Repondre aux emails  |
|  |   Priorite: Moyenne    |
|  |   Echeance: 14 mars    |
|  +------------------------+
|                           |
|  En cours (1)             |
|  +------------------------+
|  | ◐ Rediger le rapport   |
|  |   Priorite: Haute      |
|  |   Echeance: 16 mars    |
|  +------------------------+
|                           |
|  Termine (2)              |
|  +------------------------+
|  | ● Appeler le medecin   |
|  |   Complete le 12 mars  |
|  +------------------------+
|                           |
+---------------------------+
|  [Liste] [Calendrier] [⚙]|   <- Navigation basse
+---------------------------+
```

**Wireframe papier de l'écran "Création d'une tâche"** :

```text
+---------------------------+
|  ← Nouvelle tache         |
+---------------------------+
|                           |
|  Titre *                  |
|  [____________________]   |
|                           |
|  Description              |
|  [____________________]   |
|  [____________________]   |
|  [____________________]   |
|                           |
|  Priorite                 |
|  ( ) Basse                |
|  (●) Moyenne              |
|  ( ) Haute                |
|                           |
|  Date limite              |
|  [  15 / 03 / 2025    ]  |
|                           |
|  Categorie                |
|  [ Choisir...         v]  |
|                           |
|  +------------------------+
|  |     Créer la tâche     |
|  +------------------------+
|                           |
+---------------------------+
```

**Wireframe papier de l'écran "Détail d'une tâche"** :

```text
+---------------------------+
|  ← Detail       [✏] [🗑] |
+---------------------------+
|                           |
|  Faire les courses        |   <- Titre
|                           |
|  Statut : A faire         |
|  [A faire ▼]              |   <- Menu deroulant
|                           |
|  Priorite : Haute         |
|  Echeance : 15 mars 2025  |
|  Categorie : Personnel    |
|                           |
|  Description :            |
|  Acheter des legumes,     |
|  du pain et du fromage    |
|  pour la semaine.         |
|                           |
|  Cree le : 10 mars 2025   |
|  Modifie le : 12 mars     |
|                           |
+---------------------------+
|  [Liste] [Calendrier] [⚙]|
+---------------------------+
```

**Partie 2 - Wireframe Figma mobile** :

Dans Figma, créé un Frame "iPhone 14 & 15 Pro" (393 x 852) et reproduis l'écran "Liste des tâches" :

1. En-tete : rectangle 393 x 56px, fond #F5F5F5, texte "TaskApp" aligne à gauche, icône "+" à droite
2. Onglets de filtre : 3 rectangles arrondis, fond blanc avec bordure #E0E0E0, le premier en fond bleu clair (#E3F2FD) pour l'onglet actif
3. Sections : texte en gras pour le nom de la section avec le compteur entre parentheses
4. Cartes de tâches : rectangles 361 x 72px (marge 16px), fond blanc, bordure fine #E0E0E0, ombre légère. Contenu : cercle pour le statut, titre en gras, priorité et echeance en gris (#757575)
5. Navigation basse : rectangle 393 x 56px, fond blanc, bordure supérieure #E0E0E0, 3 icônes centrees avec labels

**Partie 3 - Prototype Figma** :

1. Duplique le Frame 3 fois pour avoir 4 écrans (liste, création, détail, paramètres)
2. En mode Prototype, lie le clic sur une carte au Frame de détail ("On tap" > "Navigate to" > "Smart animate")
3. Lie le clic sur "+" au Frame de création
4. Lie les fleches retour "←" au Frame de liste
5. Teste avec le bouton Play

**Partie 4 - Adaptation desktop (1440 x 900)** :

| Élément | Mobile | Desktop |
| --- | --- | --- |
| Navigation | Barre basse (3 icônes) | En-tete horizontal avec liens texte |
| Liste des tâches | Liste verticale groupee | 3 colonnes Kanban côte à cote |
| Filtrès | Onglets horizontaux | Sidebar laterale (250px) avec catégories, priorités et dates |
| Carte de tâche | Pleine largeur | Carte dans une colonne Kanban (drag & drop possible) |
| Bouton "+" | Icône dans l'en-tête | Bouton "Nouvelle tâche" dans l'en-tête |

Structure du wireframe desktop :

```text
+----------------------------------------------------------------+
|  TaskApp    Accueil  Calendrier  Parametres     [Nouvelle tache]|
+----------------------------------------------------------------+
|          |                                                      |
| FILTRES  |   A faire (3)    En cours (1)    Termine (2)         |
|          |                                                      |
| Categorie|   +-----------+  +-----------+  +-----------+        |
| [x] Tous |   | Courses   |  | Rapport   |  | Medecin   |       |
| [ ] Perso|   | Haute     |  | Haute     |  | 12 mars   |       |
| [ ] Pro  |   | 15 mars   |  | 16 mars   |  +-----------+       |
|          |   +-----------+  +-----------+                       |
| Priorite |   | Emails    |                 +-----------+        |
| [x] Tous |   | Moyenne   |                 | Courses 2 |       |
| [ ] Haute|   | 14 mars   |                 | 11 mars   |       |
| [ ] Moyen|   +-----------+                 +-----------+        |
| [ ] Basse|                                                      |
|          |   +-----------+                                      |
| Echeance |   | Planning  |                                      |
| [Choisir]|   | Basse     |                                      |
|          |   | 20 mars   |                                      |
|          |   +-----------+                                      |
+----------------------------------------------------------------+
```

---

## Navigation

← Fiche précédente : **[Principes UX pour développeurs](01-principes-ux.md)**

→ Fiche suivante : **[Design system](03-design-system.md)**
