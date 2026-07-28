---
tags:
  - HTML/CSS
  - Intermédiaire
  - Pratique
description: "Flexbox"
estimated_time: "25 min"
fiche_number: 5
total_fiches: 7
cursus: "HTML/CSS"
---

# 05 - Flexbox

> **En bref** : À la fin de cette fiche, tu sauras utiliser Flexbox pour créer des mises en page flexibles et alignées. Lecture estimée : 25 min.


## Prérequis

- Fiche [04-html-css/04 - CSS de base](04-css-base.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser Flexbox pour créer des mises en page flexibles et alignées.

---

## Concepts

### Qu'est-ce que Flexbox ?

**Définition** : Flexbox est un modèle de mise en page CSS qui permet d'aligner et de distribuer l'espace entre les éléments d'un conteneur.

**Analogie concrète** : Flexbox fonctionne comme une étagère réglable. Tu places des livres (les éléments) sur l'étagère (le conteneur), et tu choisis comment les disposer : tous à gauche, centrés, espacés régulièrement, ou répartis sur toute la largeur. Tu peux aussi décider si les livres se placent horizontalement ou verticalement.

**Activation** :

```css
.container {
    display: flex;
}
```

---

### Les axes

```text
Axe principal (main axis)
─────────────────────────────────→

│
│  Axe secondaire (cross axis)
│
↓
```

Par défaut, l'axe principal est horizontal.

---

### Propriétés du conteneur (parent)

| Propriété | Valeurs | Description |
| --------- | ------- | ----------- |
| `display` | `flex` | Active Flexbox |
| `flex-direction` | `row`, `column`, `row-reverse`, `column-reverse` | Direction des éléments |
| `justify-content` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` | Alignement sur l'axe principal |
| `align-items` | `flex-start`, `center`, `flex-end`, `stretch`, `baseline` | Alignement sur l'axe secondaire |
| `flex-wrap` | `nowrap`, `wrap`, `wrap-reverse` | Retour à la ligne |
| `gap` | `10px`, `1rem` | Espacement entre éléments |

---

### Propriétés des éléments (enfants)

| Propriété | Description |
| --------- | ----------- |
| `flex-grow` | Capacité à grandir (0 par défaut) |
| `flex-shrink` | Capacité à rétrécir (1 par défaut) |
| `flex-basis` | Taille de base |
| `flex` | Raccourci : grow shrink basis |
| `align-self` | Alignement individuel |
| `order` | Ordre d'affichage |

---

### Exemples visuels

**justify-content** (axe principal) :

```text
flex-start:     [A][B][C]
center:            [A][B][C]
flex-end:                 [A][B][C]
space-between:  [A]    [B]    [C]
space-around:   [ A ]  [ B ]  [ C ]
space-evenly:   [  A  ][  B  ][  C  ]
```

**align-items** (axe secondaire) :

```text
flex-start:  [A]
             [B]
             [C]

center:         [A]
                [B]
                [C]

flex-end:              [A]
                       [B]
                       [C]
```

---

## Étapes Pratiques

### Navigation horizontale

```html
<nav class="navbar">
    <a href="#" class="logo">Logo</a>
    <ul class="nav-links">
        <li><a href="#">Accueil</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
    </ul>
</nav>
```

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #333;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 20px;
}

.navbar a {
    color: white;
    text-decoration: none;
}
```

### Centrage parfait

```css
.center-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
```

### Grille de cartes

```html
<div class="cards">
    <div class="card">Carte 1</div>
    <div class="card">Carte 2</div>
    <div class="card">Carte 3</div>
</div>
```

```css
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    flex: 1 1 300px;  /* grow, shrink, basis */
    padding: 20px;
    background: #f0f0f0;
    border-radius: 8px;
}
```

### Sidebar + Contenu

```css
.layout {
    display: flex;
}

.sidebar {
    flex: 0 0 250px;  /* Ne grandit pas, ne rétrécit pas, 250px */
}

.content {
    flex: 1;  /* Prend le reste de l'espace */
}
```

---

## Pièges Fréquents

### Piège 1 : Flexbox sur les mauvais éléments

⚠️ **Problème** : `display: flex` sur l'élément qu'on veut aligner.

✅ **Solution** : Flexbox s'applique au **parent**, pas à l'enfant.

### Piège 2 : Oublier flex-wrap

⚠️ **Problème** : Les éléments débordent.

✅ **Solution** : Ajouter `flex-wrap: wrap`.

---

## Checklist de Validation

- [ ] Je sais activer Flexbox avec `display: flex`
- [ ] Je comprends les axes principal et secondaire
- [ ] Je sais utiliser `justify-content` et `align-items`
- [ ] Je sais utiliser `flex-wrap` pour le responsive
- [ ] Je sais utiliser `gap` pour les espacements

---

## Exercice Pratique

**Énoncé** : Crée une barre de navigation horizontale avec Flexbox contenant :

- Un logo à gauche (texte "MonSite")
- 4 liens de navigation centrés (Accueil, Services, Blog, Contact)
- Un bouton "Connexion" à droite
- Les éléments doivent être verticalement centrés
- Quand la fenêtre est trop petite, les liens doivent passer à la ligne (simule en réduisant la largeur de la fenêtre du navigateur)

**Indications** :

- Utilise `display: flex` sur le conteneur `<nav>`
- Utilise `justify-content: space-between` pour espacer les 3 groupes (logo, liens, bouton)
- Utilise `align-items: center` pour centrer verticalement
- Ajoute `flex-wrap: wrap` pour que les éléments passent à la ligne sur petits écrans
- Les liens de navigation doivent eux aussi être dans un conteneur flex (une `<ul>` avec `display: flex` et `gap`)

**Résultat attendu** : Une barre de navigation avec le logo à gauche, les 4 liens au centre et le bouton à droite. En réduisant la fenêtre, les éléments passent à la ligne proprement.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navigation Flexbox</title>
    <style>
        /* Reset basique */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Conteneur principal de la navigation */
        .navbar {
            display: flex;              /* Active Flexbox */
            justify-content: space-between; /* Espace entre logo, liens et bouton */
            align-items: center;        /* Centrage vertical */
            flex-wrap: wrap;            /* Retour à la ligne sur petits écrans */
            padding: 15px 20px;         /* Espacement intérieur */
            background-color: #2c3e50;  /* Fond sombre */
        }

        /* Logo à gauche */
        .logo {
            color: white;               /* Texte blanc */
            font-size: 24px;            /* Taille plus grande */
            font-weight: bold;          /* Texte en gras */
            text-decoration: none;      /* Pas de soulignement */
        }

        /* Conteneur des liens de navigation */
        .nav-links {
            display: flex;              /* Les liens s'alignent horizontalement */
            list-style: none;           /* Supprime les puces de la liste */
            gap: 20px;                  /* Espace de 20px entre chaque lien */
            flex-wrap: wrap;            /* Les liens passent à la ligne si nécessaire */
        }

        /* Style des liens */
        .nav-links a {
            color: white;               /* Texte blanc */
            text-decoration: none;      /* Pas de soulignement */
        }

        /* Effet au survol des liens */
        .nav-links a:hover {
            text-decoration: underline; /* Soulignement au survol */
        }

        /* Bouton de connexion à droite */
        .btn-login {
            padding: 8px 16px;          /* Espacement intérieur du bouton */
            background-color: #3498db;  /* Fond bleu */
            color: white;               /* Texte blanc */
            border: none;               /* Pas de bordure */
            border-radius: 4px;         /* Coins arrondis */
            cursor: pointer;            /* Curseur en forme de main */
        }

        /* Effet au survol du bouton */
        .btn-login:hover {
            background-color: #2980b9;  /* Bleu plus foncé au survol */
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <!-- Logo à gauche -->
        <a href="/" class="logo">MonSite</a>

        <!-- 4 liens de navigation centrés -->
        <ul class="nav-links">
            <li><a href="#">Accueil</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
        </ul>

        <!-- Bouton de connexion à droite -->
        <button class="btn-login">Connexion</button>
    </nav>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[CSS de base](04-css-base.md)**

→ Fiche suivante : **[CSS Grid](06-css-grid.md)**
