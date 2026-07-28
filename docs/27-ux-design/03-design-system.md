---
tags:
  - UX
  - Intermédiaire
  - Pratique
description: "Design system : composants réutilisables, tokens de design, échelle typographique, palette de couleurs avec contraste WCAG, grille et espacement."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 4
cursus: "UX Design"
---

# 03 - Design system

> **En bref** : Comprendre et créer un design system avec des tokens de design, une échelle typographique, une palette de couleurs accessible et un système d'espacement cohérent. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [01 - Principes UX pour développeurs](01-principes-ux.md) pour connaître les principes d'accessibilité WCAG et les heuristiques de Nielsen
- Avoir lu la fiche [02 - Wireframes et maquettes](02-wireframes-maquettes.md) pour savoir utiliser Figma et créer des wireframes
- Connaître les bases du CSS : propriétés, sélecteurs, unités (px, rem, em)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras définir des tokens de design (couleurs, typographie, espacement), créer une palette de couleurs conforme aux exigences de contraste WCAG, construire une échelle typographique harmonieuse et organiser tes composants en système réutilisable.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un design system ?

**Définition** : Un design system est un ensemble de règles, composants et outils partagés qui permettent à une équipe de concevoir et développer des interfaces de manière cohérente. Il contient les couleurs, typographies, espacements, composants (boutons, cartes, formulaires) et les règles d'utilisation de chaque élément.

**Le problème qu'un design system résout** :

Sans design system, voici les problèmes rencontrés :

1. **Incohérence visuelle** : Chaque page utilise des couleurs, tailles de police et espacements différents. Le site ressemble à un patchwork sans unité visuelle.
2. **Duplication du travail** : Chaque développeur recrée les mêmes composants (boutons, cartes, formulaires) au lieu de réutiliser des éléments existants. Cela triple le temps de développement et de maintenance.
3. **Communication difficile** : Le désigner dit "bouton primaire" mais chaque développeur l'interprète différemment (couleur, taille, arrondi, ombre).

**Comment un design system résout ces problèmes** :

| Problème | Solution apportée par le design system |
| --- | --- |
| Incohérence visuelle | Des règles communes de couleurs, typographie et espacement appliquées partout |
| Duplication du travail | Des composants réutilisables que chaque développeur utilise sans les recréer |
| Communication difficile | Un vocabulaire partagé et une documentation visuelle de chaque composant |

**Analogie concrète** : Un design system, c'est comme les pièces de LEGO. Chaque pièce à une forme, une taille et des connexions standardisées. Tu peux combiner les pièces pour construire n'importe quoi, mais chaque pièce s'emboite parfaitement avec les autrès parce qu'elles suivent les mêmes règles. Sans standardisation, chaque pièce aurait des dimensions différentes et rien ne s'assemblerait.

**Ce qu'un design system n'est PAS** :

- Un design system n'est pas un fichier Figma avec des composants. Le fichier Figma est un des livrables du design system, mais le système inclut aussi les tokens, la documentation, les règles d'utilisation et le code des composants.
- Un design system n'est pas figé. Il évolue avec le produit. De nouveaux composants sont ajoutés, des règles sont ajustées en fonction des besoins.

---

### Qu'est-ce qu'un token de design ?

**Définition** : Un token de design (design token) est une variable qui stocke une valeur de design. Les tokens représentent les choix de design fondamentaux : couleurs, tailles de police, espacements, rayons d'arrondi, ombres. Ils sont la couche la plus basse du design system.

**Le problème que les tokens résolvent** :

Sans tokens, voici les problèmes rencontrès :

1. **Valeurs magiques** : Le code CSS contient des valeurs en dur (`color: #3B82F6`, `padding: 12px`, `font-size: 14px`) dispersées dans des dizaines de fichiers. Changer la couleur principale nécessite de trouver et modifier toutes les occurrences.
2. **Dérive progressive** : Un développeur utilise `#3B82F6`, un autre utilise `#3A81F5` (presque pareil mais pas exactement). Au fil du temps, le produit accumule des dizaines de variantes de la même couleur.
3. **Pas d'adaptation** : Impossible de passer en mode sombre sans réécrire tout le CSS. Chaque couleur est en dur.

**Comment les tokens résolvent ces problèmes** :

| Problème | Solution apportée par les tokens |
| --- | --- |
| Valeurs magiques | Une seule source de vérité : modifier le token met à jour toutes les utilisations |
| Dérive progressive | Les développeurs utilisent `var(--color-primary)` au lieu de deviner la valeur hexadécimale |
| Pas d'adaptation | Changer les tokens suffit pour passer en mode sombre ou en thème alternatif |

**Les catégories de tokens** :

| Catégorie | Exemples | Convention de nommage |
| --- | --- | --- |
| Couleurs | Primaire, secondaire, erreur, succès, fond, texte | `--color-primary`, `--color-error` |
| Typographie | Tailles de police, graisses, interlignes | `--font-size-base`, `--font-weight-bold` |
| Espacement | Marges et paddings | `--space-xs`, `--space-sm`, `--space-md` |
| Rayons d'arrondi | Coins arrondis des éléments | `--radius-sm`, `--radius-md`, `--radius-full` |
| Ombres | Ombres portées des éléments | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |

**Analogie concrète** : Les tokens de design sont comme les étiquettes dans un atelier de peinture. Au lieu de demander "le bleu qui tire un peu vers le violet, celui qu'on a utilise sur la porte d'entrée", tu demandes le pot etiquete "Bleu Primaire". Tout le monde utilise le même pot, et si tu veux changer la teinte, tu changes le contenu du pot une seule fois.

---

### Qu'est-ce qu'une échelle typographique ?

**Définition** : Une échelle typographique est un ensemble de tailles de police organisees selon un ratio mathématique. Plutôt que de choisir des tailles arbitraires, l'échelle suit une progression harmonieuse (chaque taille est obtenue en multipliant la précédente par un ratio fixe).

**Le problème que l'échelle typographique résout** :

Sans échelle, voici les problèmes rencontrès :

1. **Tailles arbitraires** : Un développeur utilise 13px, un autre 14px, un autre 15px pour du texte courant. Le résultat est visuellement desordonne.
2. **Hiérarchie floue** : Sans ratio clair entre les tailles, les titrès ne se distinguent pas assez du texte courant, ou au contraire sont trop grands.
3. **Trop de variantes** : Sans contrainte, l'équipe finit par utiliser 15 tailles différentes au lieu de 6 ou 7 suffisantes.

**Comment l'échelle typographique résout ces problèmes** :

| Problème | Solution apportée par l'échelle |
| --- | --- |
| Tailles arbitraires | Un nombre fixe de tailles calculees mathématiquement |
| Hiérarchie floue | Un ratio constant entre chaque niveau créé une hiérarchie visuelle claire |
| Trop de variantes | 6 a 8 niveaux suffisent pour couvrir tous les cas |

**Le ratio courant : 1.250 (Major Third)** :

En partant d'une taille de base de 16px (taille par défaut des navigateurs) et en multipliant par 1.250 :

| Niveau | Calcul | Taille | Utilisation |
| --- | --- | --- | --- |
| xs | 16 / 1.250 | 12.8px (0.8rem) | Legende, texte secondaire |
| sm | 16 / 1.125 | 14.2px (0.889rem) | Texte auxiliaire |
| base | - | 16px (1rem) | Texte courant (paragraphes) |
| md | 16 x 1.250 | 20px (1.25rem) | Sous-titre, texte important |
| lg | 16 x 1.250^2 | 25px (1.563rem) | Titre de section (h3) |
| xl | 16 x 1.250^3 | 31.25px (1.953rem) | Titre de page (h2) |
| 2xl | 16 x 1.250^4 | 39.06px (2.441rem) | Titre principal (h1) |

**Analogie concrète** : Une échelle typographique, c'est comme les notes de musique. Chaque note est définie par un rapport mathématique précis avec la précédente. Le résultat sonne harmonieux. Si tu choisis des fréquences au hasard, le résultat est discordant. De la même manière, des tailles de texte choisies au hasard creent un desordre visuel.

---

### Qu'est-ce qu'une palette de couleurs accessible ?

**Définition** : Une palette de couleurs accessible est un ensemble de couleurs organisées qui respectent les ratios de contraste définis par les WCAG 2.2. Le contraste minimum (critère 1.4.3, niveau AA) est de 4.5:1 pour le texte normal et de 3:1 pour le **texte large**. Le texte large au sens WCAG est au moins **18 pt** (environ **24 px** CSS) ou **14 pt en gras** (environ **18.5 px** CSS), et non 18 px / 14 px.

**Le problème qu'une palette accessible résout** :

Sans palette accessible, voici les problèmes rencontrès :

1. **Texte illisible** : Du texte gris clair sur fond blanc est invisible pour les personnes avec une deficience visuelle. Mais même les personnes sans handicap peinent à le lire en plein soleil sur un écran de smartphone.
2. **Couleurs insuffisantes** : L'équipe utilise 2 ou 3 couleurs et se retrouve sans option pour les états (erreur, succès, avertissement, information).
3. **Mode sombre impossible** : Les couleurs choisies pour le fond clair ne fonctionnent pas sur fond sombre. Il n'y a pas de variantes prévues.

**Comment une palette accessible résout ces problèmes** :

| Problème | Solution apportée par la palette |
| --- | --- |
| Texte illisible | Chaque combinaison texte/fond respecte un ratio de contraste minimum |
| Couleurs insuffisantes | La palette prevoit des nuances (50 a 900) pour chaque couleur de base |
| Mode sombre impossible | Chaque couleur à une variante claire et une variante sombre |

**Structure d'une palette de couleurs** :

| Rôle | Description | Exemple |
| --- | --- | --- |
| Primaire | Couleur principale de la marque, utilisée pour les actions principales | Boutons principaux, liens |
| Secondaire | Couleur complémentaire pour les accents et éléments secondaires | Badges, éléments secondaires |
| Neutre | Gamme de gris pour le texte, les fonds et les bordures | Texte, fonds de page, separateurs |
| Erreur | Rouge pour les messages d'erreur et les états invalides | Messages d'erreur, bordures de champs invalides |
| Succès | Vert pour les confirmations et les états valides | Messages de succès, validations |
| Avertissement | Orange/jaune pour les alertes non bloquantes | Alertes, avertissements |
| Information | Bleu pour les messages informatifs | Tooltips, bannieres d'information |

**Analogie concrète** : Une palette de couleurs accessible, c'est comme le code couleur des cables electriques. Chaque couleur à un rôle précis (phase, neutre, terre). Un electricien sait immédiatement à quoi sert chaque cable. De la même manière, dans une interface, le rouge signifie toujours "erreur" et le vert signifie toujours "succès".

---

### Qu'est-ce qu'un système d'espacement ?

**Définition** : Un système d'espacement est un ensemble de valeurs predefinies pour les marges (margin) et les paddings (padding). Comme l'échelle typographique, il suit une progression mathématique pour garantir un rythme visuel harmonieux.

**Le problème qu'un système d'espacement résout** :

Sans système, voici les problèmes rencontrès :

1. **Espacements aleatoires** : Un développeur met 8px de marge, un autre 10px, un autre 12px. La page paraît desalignee et desordonnee.
2. **Pas de rythme vertical** : Les espaces entre les sections varient sans logique. Certaines sections sont collees, d'autrès trop ecartees.
3. **Alignement impossible** : Sans base commune, les éléments ne s'alignent jamais proprement entre eux.

**Comment le système d'espacement résout ces problèmes** :

| Problème | Solution apportée par le système |
| --- | --- |
| Espacements aleatoires | Un nombre limite de valeurs disponibles (8 suffisent) |
| Pas de rythme vertical | Une progression mathématique créé un rythme visuel régulier |
| Alignement impossible | Toutes les valeurs sont des multiples de la base, donc alignees naturellement |

**Échelle d'espacement en base 4** :

| Token | Valeur | Utilisation courante |
| --- | --- | --- |
| `--space-0` | 0px | Pas d'espace |
| `--space-1` | 4px | Espace minimal (entre une icône et un texte) |
| `--space-2` | 8px | Padding interne d'un badge, espace entre éléments proches |
| `--space-3` | 12px | Padding interne d'un bouton, marge entre éléments lies |
| `--space-4` | 16px | Padding standard d'une carte, marge entre paragraphes |
| `--space-6` | 24px | Espace entre sections liees, padding de conteneur |
| `--space-8` | 32px | Espace entre sections principales |
| `--space-12` | 48px | Espace entre blocs de page |
| `--space-16` | 64px | Marge de page, espace entre grandes sections |

**Analogie concrète** : Un système d'espacement, c'est comme le papier à carreaux. Les carreaux forment une grille régulière qui guide l'écriture. Chaque lettre, chaque mot et chaque ligne s'aligne naturellement. Sans carreaux, l'écriture part dans tous les sens. En design, les tokens d'espacement sont ta grille invisible.

---

### Qu'est-ce qu'un composant réutilisable ?

**Définition** : Un composant réutilisable est un élément d'interface encapsule (bouton, carte, champ de formulaire, en-tête) qui est défini une seule fois et utilise partout dans l'application. Il à des propriétés configurables (variantes, tailles, états) mais garde une apparence et un comportement coherents.

**Le problème que les composants réutilisables résolvent** :

Sans composants réutilisables, voici les problèmes rencontrès :

1. **Code duplique** : Le même bouton est code 50 fois dans 50 fichiers différents. Changer le style du bouton nécessite de modifier les 50 fichiers.
2. **Variantes incontrôlees** : Chaque instance du bouton à des differences mineures (padding, couleur, taille de police). Le résultat est visuellement incoherent.
3. **Maintenance impossible** : Corriger un bug dans un composant duplique signifie trouver et corriger toutes les copies.

**Comment les composants résolvent ces problèmes** :

| Problème | Solution apportée par les composants |
| --- | --- |
| Code duplique | Un seul composant source reutilise partout |
| Variantes incontrôlees | Des variantes predefinies (primaire, secondaire, danger) au lieu d'une personnalisation libre |
| Maintenance impossible | Une correction dans le composant source se propage partout automatiquement |

**Anatomie d'un composant bouton** :

| Propriété | Variantes |
| --- | --- |
| Variante | Primaire, Secondaire, Danger, Ghost |
| Taille | Petit (sm), Moyen (md), Grand (lg) |
| État | Normal, Hover, Focus, Actif, Desactive |
| Icône | Sans icône, Icône à gauche, Icône à droite |

**Analogie concrète** : Un composant réutilisable, c'est comme un moule à gâteau. Tu as un seul moule, mais tu peux varier les ingrédients (chocolat, vanille, fruits). Le résultat est toujours de la même forme et de la même taille, mais avec un contenu différent. Si tu veux changer la forme, tu changes le moule une seule fois.

---

## Étapes Pratiques

### Étape 1 : Definir les tokens de couleur

Tu vas créer une palette de couleurs pour l'application de recettes de cuisine utilisée dans les fiches précédentes.

Créé un fichier CSS avec les tokens de couleur :

```css
/* fichier : design-tokens.css */

:root {
  /* Couleur primaire - Vert (thematique cuisine/nature) */
  --color-primary-50: #F0FDF4;   /* Fond tres leger */
  --color-primary-100: #DCFCE7;  /* Fond leger */
  --color-primary-200: #BBF7D0;  /* Fond accentue */
  --color-primary-500: #22C55E;  /* Couleur principale */
  --color-primary-600: #16A34A;  /* Hover des boutons */
  --color-primary-700: #15803D;  /* Texte sur fond clair */
  --color-primary-900: #14532D;  /* Texte accentue */

  /* Neutres - Gamme de gris */
  --color-neutral-50: #FAFAFA;   /* Fond de page */
  --color-neutral-100: #F5F5F5;  /* Fond de carte */
  --color-neutral-200: #E5E5E5;  /* Bordures */
  --color-neutral-400: #A3A3A3;  /* Texte desactive, placeholder */
  --color-neutral-600: #525252;  /* Texte secondaire */
  --color-neutral-800: #262626;  /* Texte principal */
  --color-neutral-900: #171717;  /* Titres */

  /* Couleurs semantiques */
  --color-error-500: #EF4444;    /* Messages d'erreur */
  --color-error-50: #FEF2F2;     /* Fond d'erreur */
  --color-success-500: #22C55E;  /* Messages de succes */
  --color-success-50: #F0FDF4;   /* Fond de succes */
  --color-warning-500: #F59E0B;  /* Avertissements */
  --color-warning-50: #FFFBEB;   /* Fond d'avertissement */
  --color-info-500: #3B82F6;     /* Messages informatifs */
  --color-info-50: #EFF6FF;      /* Fond informatif */
}
```

Vérifie les contrastes de ta palette avec cet outil en ligne : `https://webaim.org/resources/contrastchecker/`

| Combinaison | Ratio attendu | Conforme AA ? |
| --- | --- | --- |
| Texte principal (#262626) sur fond page (#FAFAFA) | 15.4:1 | Oui (minimum 4.5:1) |
| Texte secondaire (#525252) sur fond page (#FAFAFA) | 8.5:1 | Oui |
| Texte placeholder (#A3A3A3) sur fond blanc (#FFFFFF) | 2.6:1 | Non (decoratif, acceptable pour placeholder) |
| Bouton blanc (#FFFFFF) sur primaire (#22C55E) | 2.1:1 | Non - utiliser primaire-700 (#15803D) pour le texte |
| Texte primaire-700 (#15803D) sur fond page (#FAFAFA) | 5.6:1 | Oui |

**Résultat attendu** :

Un fichier CSS contenant tous les tokens de couleur organises par catégorie, avec les combinaisons texte/fond principales vérifiées pour le contraste WCAG AA.

---

### Étape 2 : Créer une échelle typographique

Ajoute les tokens de typographie au fichier CSS :

```css
/* Suite de design-tokens.css */

:root {
  /* Police de base */
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Echelle typographique - ratio 1.250 (Major Third) */
  --font-size-xs: 0.8rem;      /* 12.8px - legendes */
  --font-size-sm: 0.889rem;    /* 14.2px - texte auxiliaire */
  --font-size-base: 1rem;      /* 16px - texte courant */
  --font-size-md: 1.25rem;     /* 20px - sous-titres */
  --font-size-lg: 1.563rem;    /* 25px - titres h3 */
  --font-size-xl: 1.953rem;    /* 31.25px - titres h2 */
  --font-size-2xl: 2.441rem;   /* 39.06px - titre h1 */

  /* Graisses */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Interlignes */
  --line-height-tight: 1.25;   /* Titres */
  --line-height-normal: 1.5;   /* Texte courant */
  --line-height-relaxed: 1.75; /* Texte long (articles) */
}
```

Pour vérifier que ton échelle fonctionne, créé un fichier HTML de test :

```html
<!-- fichier : test-typo.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test echelle typographique</title>
  <link rel="stylesheet" href="design-tokens.css">
  <style>
    body {
      font-family: var(--font-family-sans);
      color: var(--color-neutral-800);
      background: var(--color-neutral-50);
      padding: 2rem;
    }
    .text-2xl { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight); }
    .text-xl { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight); }
    .text-lg { font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); line-height: var(--line-height-tight); }
    .text-md { font-size: var(--font-size-md); font-weight: var(--font-weight-medium); line-height: var(--line-height-normal); }
    .text-base { font-size: var(--font-size-base); line-height: var(--line-height-normal); }
    .text-sm { font-size: var(--font-size-sm); color: var(--color-neutral-600); line-height: var(--line-height-normal); }
    .text-xs { font-size: var(--font-size-xs); color: var(--color-neutral-400); line-height: var(--line-height-normal); }
  </style>
</head>
<body>
  <p class="text-2xl">Titre principal (2xl - 2.441rem)</p>
  <p class="text-xl">Titre de page (xl - 1.953rem)</p>
  <p class="text-lg">Titre de section (lg - 1.563rem)</p>
  <p class="text-md">Sous-titre (md - 1.25rem)</p>
  <p class="text-base">Texte courant (base - 1rem)</p>
  <p class="text-sm">Texte auxiliaire (sm - 0.889rem)</p>
  <p class="text-xs">Legende (xs - 0.8rem)</p>
</body>
</html>
```

Ouvre ce fichier dans ton navigateur. Tu dois voir une hiérarchie visuelle claire ou chaque niveau se distingue nettement du précédent.

**Résultat attendu** :

Une page HTML affichant 7 niveaux de texte avec une progression harmonieuse. Chaque niveau est clairement plus grand que le précédent.

---

### Étape 3 : Definir le système d'espacement

Ajoute les tokens d'espacement au fichier CSS :

```css
/* Suite de design-tokens.css */

:root {
  /* Espacement - base 4px */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* Rayons d'arrondi */
  --radius-sm: 0.25rem;  /* 4px - badges, tags */
  --radius-md: 0.5rem;   /* 8px - cartes, boutons */
  --radius-lg: 1rem;     /* 16px - conteneurs, modales */
  --radius-full: 9999px; /* Cercle complet - avatars */

  /* Ombres */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

Créé un composant "carte de recette" qui utilise ces tokens :

```css
/* fichier : components.css */

.recipe-card {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.recipe-card:hover {
  box-shadow: var(--shadow-md);
}

.recipe-card__image {
  width: 100%;
  height: 160px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-sm);
}

.recipe-card__title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
}

.recipe-card__meta {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
  display: flex;
  gap: var(--space-2);
}

.recipe-card__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-700);
  background: var(--color-primary-50);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}
```

**Résultat attendu** :

Un composant carte qui utilise exclusivement des tokens. Aucune valeur en dur (pas de `12px`, `#333` ou `8px`) dans le CSS du composant.

---

### Étape 4 : Créer un composant bouton avec variantes

Définis un composant bouton avec 3 variantes (primaire, secondaire, danger) et 3 tailles (petit, moyen, grand) :

```css
/* Suite de components.css */

/* Bouton - styles de base */
.btn {
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: background-color 0.2s, box-shadow 0.2s;
}

/* Bouton - tailles */
.btn--sm {
  font-size: var(--font-size-sm);
  padding: var(--space-1) var(--space-3);
}

.btn--md {
  font-size: var(--font-size-base);
  padding: var(--space-2) var(--space-4);
}

.btn--lg {
  font-size: var(--font-size-md);
  padding: var(--space-3) var(--space-6);
}

/* Bouton - variante primaire
   Fond primary-700 (#15803D) + texte blanc : ratio ~5.6:1 (AA texte normal).
   Évite primary-500 (#22C55E) + blanc (~2.1:1), non conforme WCAG AA. */
.btn--primary {
  background: var(--color-primary-700);
  color: white;
}

.btn--primary:hover {
  background: var(--color-primary-900);
}

.btn--primary:focus {
  outline: 2px solid var(--color-primary-700);
  outline-offset: 2px;
}

/* Bouton - variante secondaire */
.btn--secondary {
  background: transparent;
  color: var(--color-neutral-800);
  border: 1px solid var(--color-neutral-200);
}

.btn--secondary:hover {
  background: var(--color-neutral-100);
}

/* Bouton - variante danger
   error-500 (#EF4444) + blanc ~3.9:1 : OK seulement en texte large.
   Pour un bouton en texte normal (16px), utiliser un rouge plus foncé. */
.btn--danger {
  background: #B91C1C;
  color: white;
}

.btn--danger:hover {
  background: #991B1B;
}

/* Bouton - etat desactive */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Utilisation en HTML :

```html
<!-- Boutons primaires -->
<button class="btn btn--primary btn--sm">Petit primaire</button>
<button class="btn btn--primary btn--md">Moyen primaire</button>
<button class="btn btn--primary btn--lg">Grand primaire</button>

<!-- Boutons secondaires -->
<button class="btn btn--secondary btn--md">Secondaire</button>

<!-- Bouton danger -->
<button class="btn btn--danger btn--md">Supprimer</button>

<!-- Bouton desactive -->
<button class="btn btn--primary btn--md" disabled>Desactive</button>
```

**Résultat attendu** :

Des boutons visuellement coherents avec des variantes claires. Chaque combinaison taille + variante produit un bouton utilisable et reconnaissable.

---

### Étape 5 : Documenter le design system

Créé un fichier HTML qui sert de documentation visuelle pour ton design system :

```html
<!-- fichier : design-system.html -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design System - RecetteApp</title>
  <link rel="stylesheet" href="design-tokens.css">
  <link rel="stylesheet" href="components.css">
  <style>
    body {
      font-family: var(--font-family-sans);
      color: var(--color-neutral-800);
      background: var(--color-neutral-50);
      max-width: 1024px;
      margin: 0 auto;
      padding: var(--space-8);
    }
    section { margin-bottom: var(--space-12); }
    h1 { font-size: var(--font-size-2xl); margin-bottom: var(--space-8); }
    h2 { font-size: var(--font-size-xl); margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-neutral-200); padding-bottom: var(--space-2); }
    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: var(--space-4); }
    .color-swatch { height: 80px; border-radius: var(--radius-md); }
    .color-label { font-size: var(--font-size-xs); color: var(--color-neutral-600); margin-top: var(--space-1); }
    .button-row { display: flex; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-4); }
  </style>
</head>
<body>
  <h1>Design System - RecetteApp</h1>

  <section>
    <h2>Couleurs</h2>
    <h3>Primaire</h3>
    <div class="color-grid">
      <div>
        <div class="color-swatch" style="background: var(--color-primary-50);"></div>
        <div class="color-label">primary-50</div>
      </div>
      <div>
        <div class="color-swatch" style="background: var(--color-primary-500);"></div>
        <div class="color-label">primary-500</div>
      </div>
      <div>
        <div class="color-swatch" style="background: var(--color-primary-700);"></div>
        <div class="color-label">primary-700</div>
      </div>
      <div>
        <div class="color-swatch" style="background: var(--color-primary-900);"></div>
        <div class="color-label">primary-900</div>
      </div>
    </div>
  </section>

  <section>
    <h2>Typographie</h2>
    <p style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);">Titre principal (2xl)</p>
    <p style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">Titre de page (xl)</p>
    <p style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">Titre de section (lg)</p>
    <p style="font-size: var(--font-size-md); font-weight: var(--font-weight-medium);">Sous-titre (md)</p>
    <p style="font-size: var(--font-size-base);">Texte courant (base)</p>
    <p style="font-size: var(--font-size-sm); color: var(--color-neutral-600);">Texte auxiliaire (sm)</p>
    <p style="font-size: var(--font-size-xs); color: var(--color-neutral-400);">Legende (xs)</p>
  </section>

  <section>
    <h2>Boutons</h2>
    <div class="button-row">
      <button class="btn btn--primary btn--sm">Petit</button>
      <button class="btn btn--primary btn--md">Moyen</button>
      <button class="btn btn--primary btn--lg">Grand</button>
    </div>
    <div class="button-row">
      <button class="btn btn--secondary btn--md">Secondaire</button>
      <button class="btn btn--danger btn--md">Danger</button>
      <button class="btn btn--primary btn--md" disabled>Desactive</button>
    </div>
  </section>
</body>
</html>
```

Ouvre ce fichier dans ton navigateur. C'est la page de référence de ton design system.

**Résultat attendu** :

Une page HTML qui documente visuellement toutes les couleurs, tailles de texte et variantes de boutons de ton design system. Cette page sert de référence pour toute l'équipe.

---

## Commandes Utiles

| Action | Description |
| --- | --- |
| WebAIM Contrast Checker | Verifier le ratio de contraste entre deux couleurs (`https://webaim.org/resources/contrastchecker/`) |
| Chrome DevTools > Éléments | Inspecter les variables CSS appliquées à un élément |
| Chrome DevTools > Computed | Voir les valeurs calculees (tailles réelles en pixels) |
| Type Scale (`https://typescale.com`) | Visualiser et tester différentes échelles typographiques |
| Open Props (`https://open-props.style`) | Bibliothèque open source de tokens CSS prêts à l'emploi |

---

## Pièges Fréquents

### Piège 1 : Trop de tokens

⚠️ **Problème** : Tu créés 50 variantes de gris, 30 tailles de police et 20 niveaux d'espacement. Personne ne sait lequel utiliser.

✅ **Solution** : Limite tes tokens. 7 tailles de police, 8 niveaux d'espacement et 7 nuances par couleur suffisent pour 95% des cas. Si tu as besoin d'une valeur qui n'existe pas, c'est probablement que tu n'en as pas besoin.

---

### Piège 2 : Ne pas vérifier les contrastes

⚠️ **Problème** : Tu choisis des couleurs esthetiques sans vérifier les ratios de contraste. Le texte secondaire en gris clair est illisible pour une partie des utilisateurs.

✅ **Solution** : Vérifie chaque combinaison texte/fond avec le contrast checker. Le minimum WCAG 2.2 (AA) est 4.5:1 pour le texte normal et 3:1 pour le texte large (au moins 18 pt / ~24 px, ou 14 pt gras / ~18.5 px). Intègre cette vérification dans ton processus de création de palette.

---

### Piège 3 : Utiliser des valeurs en dur au lieu des tokens

⚠️ **Problème** : Tu définis des tokens mais tu continues à écrire `padding: 12px` et `color: #333` dans le code des composants.

✅ **Solution** : Applique une règle stricte : aucune valeur en dur dans les composants. Chaque valeur doit référence un token (`padding: var(--space-3)`, `color: var(--color-neutral-800)`). En revue de code, rejette tout code qui contient des valeurs magiques.

---

### Piège 4 : Créer un design system trop tot

⚠️ **Problème** : Tu passes 3 semaines à créer un design system complet avant d'avoir code une seule page. Le design system ne correspond pas aux besoins réels du projet.

✅ **Solution** : Commence par les tokens (couleurs, typo, espacement). Ajoute les composants un par un au fur et à mesure que tu en as besoin. Un design system se construit progressivement, pas en une seule fois. Commence petit, itere souvent.

---

## Checklist de Validation

- [ ] J'ai défini une palette de couleurs avec au moins 4 rôles (primaire, neutre, erreur, succès)
- [ ] J'ai vérifié les contrastes WCAG AA pour les combinaisons texte/fond principales
- [ ] J'ai créé une échelle typographique avec un ratio mathématique
- [ ] J'ai défini un système d'espacement en base 4 ou 8
- [ ] J'ai créé au moins un composant (bouton) qui utilise exclusivement des tokens
- [ ] J'ai documenté mon design system dans une page HTML de référence
- [ ] Aucune valeur en dur dans mes composants CSS

---

## Exercice Pratique

**Énoncé** : Crée le design system complet pour l'application de gestion de tâches (to-do list) de la fiche précédente.

**Partie 1 - Tokens** :

- Définis une palette de couleurs avec : primaire (bleu), neutre (gris), erreur, succès, avertissement
- Créé une échelle typographique avec le ratio 1.250
- Définis le système d'espacement en base 4

**Partie 2 - Composants** :

Créé les composants CSS suivants en utilisant exclusivement des tokens :

- Bouton (3 variantes : primaire, secondaire, danger)
- Carte de tâche (avec titre, priorité et date)
- Badge de priorité (3 variantes : haute, moyenne, basse)
- Champ de formulaire (avec label et état d'erreur)

**Partie 3 - Documentation** :

Créé une page HTML de documentation qui affiche :

- La palette de couleurs avec les noms des tokens
- L'échelle typographique
- Toutes les variantes des boutons
- Un exemple de carte de tâche
- Les 3 badges de priorité

**Indications** :

- Utilise des variables CSS (custom properties) pour tous les tokens
- Vérifie le contraste de chaque combinaison texte/fond
- Nomme tes classes CSS avec le pattern BEM : `bloc__element--modificateur`

**Résultat attendu** :

- Un fichier `design-tokens.css` avec toutes les variables
- Un fichier `components.css` avec les composants
- Un fichier `design-system.html` qui documente visuellement le tout

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 - Tokens (`design-tokens.css`)** :

```css
:root {
  /* Primaire - Bleu (primary-700 pour texte/boutons sur fond clair : contraste AA) */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-900: #1E3A5F;

  /* Neutre */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-400: #A3A3A3;
  --color-neutral-600: #525252;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Semantiques */
  --color-error-50: #FEF2F2;
  --color-error-500: #EF4444;
  --color-success-50: #F0FDF4;
  --color-success-500: #22C55E;
  --color-warning-50: #FFFBEB;
  --color-warning-500: #F59E0B;

  /* Typographie */
  --font-family-sans: 'Inter', -apple-system, sans-serif;
  --font-size-xs: 0.8rem;
  --font-size-sm: 0.889rem;
  --font-size-base: 1rem;
  --font-size-md: 1.25rem;
  --font-size-lg: 1.563rem;
  --font-size-xl: 1.953rem;
  --font-size-2xl: 2.441rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;

  /* Espacement */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Rayons et ombres */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
}
```

**Partie 2 - Composants (`components.css`)** :

```css
/* Carte de tache */
.task-card {
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-200);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.task-card:hover {
  box-shadow: var(--shadow-sm);
}

.task-card__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-900);
}

.task-card__meta {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-600);
}

/* Badges de priorite */
.badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  display: inline-block;
}

/* Couleurs de texte assez foncées pour le contraste AA en petite taille (xs) */
.badge--haute {
  color: #B91C1C;
  background: var(--color-error-50);
}

.badge--moyenne {
  color: #B45309;
  background: var(--color-warning-50);
}

.badge--basse {
  color: #15803D;
  background: var(--color-success-50);
}

/* Champ de formulaire */
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-field__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-800);
}

.form-field__input {
  font-size: var(--font-size-base);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  outline: none;
}

.form-field__input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.form-field--error .form-field__input {
  border-color: var(--color-error-500);
}

.form-field__error {
  font-size: var(--font-size-xs);
  color: var(--color-error-500);
}
```

**Partie 3 - Vérification des contrastes** :

Rappel WCAG 2.2 AA : **4.5:1** pour le texte normal, **3:1** seulement pour le **texte large** (au moins 18 pt / ~24 px, ou 14 pt gras / ~18.5 px). Un badge en `font-size-xs` (~12.8 px) et un bouton en `font-size-base` (16 px) sont du **texte normal** : le seuil 3:1 ne s'applique pas.

| Combinaison | Ratio approx. | Conforme AA (texte normal) | Action |
| --- | --- | --- | --- |
| Texte (#262626) sur fond (#FAFAFA) | 15.4:1 | Oui | - |
| Texte secondaire (#525252) sur fond (#FAFAFA) | 8.5:1 | Oui | - |
| Badge haute - texte (#EF4444) sur fond (#FEF2F2) | ~3.9:1 | Non | Utiliser un rouge plus foncé (ex. `#B91C1C`) pour atteindre ≥ 4.5:1 |
| Bouton primaire blanc sur (#3B82F6) | ~3.9:1 | Non | Utiliser un bleu plus foncé (ex. `#1D4ED8` / primary-700) pour le fond du bouton |

---

## Navigation

← Fiche précédente : **[Wireframes et maquettes](02-wireframes-maquettes.md)**

→ Fiche suivante : **[Tests utilisateurs](04-tests-utilisateurs.md)**
