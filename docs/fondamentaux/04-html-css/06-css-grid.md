---
tags:
  - HTML/CSS
  - Intermédiaire
  - Pratique
description: "CSS Grid"
estimated_time: "40 min"
fiche_number: 6
total_fiches: 7
cursus: "HTML/CSS"
---

# 06 - CSS Grid

> **En bref** : À la fin de cette fiche, tu sauras utiliser CSS Grid pour créer des mises en page complexes en deux dimensions. Lecture estimée : 40 min.


## Prérequis

- Fiche [04-html-css/04 - CSS de base](04-css-base.md)
- Fiche [04-html-css/05 - Flexbox](05-flexbox.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser CSS Grid pour créer des mises en page complexes en deux dimensions.

---

## Concepts

### Qu'est-ce que CSS Grid ?

**Définition** : CSS Grid est un système de mise en page en deux dimensions (lignes ET colonnes) qui permet de créer des grilles complexes.

**Analogie concrète** : CSS Grid fonctionne comme un tableur (type Excel). Tu définis des lignes et des colonnes, puis tu places chaque contenu dans une ou plusieurs cases. Tu peux fusionner des cases pour qu'un élément occupe plus de place, exactement comme quand tu fusionnes des cellules dans un tableur.

**Comparaison Flexbox vs Grid** :

| Flexbox | Grid |
| ------- | ---- |
| 1 dimension (ligne OU colonne) | 2 dimensions (lignes ET colonnes) |
| Idéal pour alignement | Idéal pour mises en page |
| Contenu dicte la taille | Grille définie à l'avance |

---

### Terminologie

```text
┌─────────────────────────────────────────────┐
│                 Grid Container              │
│  ┌─────────┬─────────┬─────────┐           │
│  │  Cell   │  Cell   │  Cell   │ ← Row     │
│  ├─────────┼─────────┼─────────┤           │
│  │  Cell   │  Cell   │  Cell   │           │
│  └─────────┴─────────┴─────────┘           │
│      ↑         ↑         ↑                 │
│   Column    Column    Column               │
└─────────────────────────────────────────────┘
```

| Terme | Description |
| ----- | ----------- |
| Grid Container | L'élément parent avec `display: grid` |
| Grid Item | Les enfants directs du container |
| Grid Line | Les lignes qui séparent les cellules |
| Grid Cell | Une case de la grille |
| Grid Track | Une ligne ou une colonne entière |
| Grid Area | Plusieurs cellules groupées |

---

### Propriétés du conteneur

**Activation** :

```css
.container {
    display: grid;
}
```

**Définir les colonnes et lignes** :

```css
.container {
    display: grid;
    grid-template-columns: 200px 200px 200px;  /* 3 colonnes de 200px */
    grid-template-rows: 100px 100px;           /* 2 lignes de 100px */
}
```

**Unité fr (fraction)** :

```css
.container {
    grid-template-columns: 1fr 2fr 1fr;  /* Ratio 1:2:1 */
}
```

**Fonction repeat()** :

```css
.container {
    grid-template-columns: repeat(3, 1fr);  /* 3 colonnes égales */
    grid-template-columns: repeat(4, 100px);  /* 4 colonnes de 100px */
}
```

**Espacement** :

```css
.container {
    gap: 20px;              /* Espacement uniforme */
    row-gap: 10px;          /* Espacement entre lignes */
    column-gap: 20px;       /* Espacement entre colonnes */
}
```

---

### Propriétés des éléments

**Positionner un élément** :

```css
.item {
    grid-column-start: 1;   /* Ligne de grille verticale n° 1 (début) */
    grid-column-end: 3;     /* Ligne de grille n° 3 : occupe 2 colonnes (1 et 2) */
    grid-row-start: 1;
    grid-row-end: 2;
}
```

**Raccourcis** :

```css
.item {
    grid-column: 1 / 3;     /* De la ligne 1 à la ligne 3 = 2 pistes, pas 3 */
    grid-row: 1 / 2;        /* De la ligne 1 à la ligne 2 = 1 piste */
}
```

**Spanning** :

```css
.item {
    grid-column: span 2;    /* Occupe 2 colonnes */
    grid-row: span 3;       /* Occupe 3 lignes */
}
```

---

### Zones nommées

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 60px 1fr 40px;
    grid-template-areas:
        "header header"
        "sidebar content"
        "footer footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }
```

---

### Alignement

**Alignement du contenu dans les cellules** :

```css
.container {
    justify-items: center;  /* Horizontal */
    align-items: center;    /* Vertical */
    place-items: center;    /* Les deux */
}
```

**Alignement de la grille dans le conteneur** :

```css
.container {
    justify-content: center;  /* Horizontal */
    align-content: center;    /* Vertical */
}
```

---

## Étapes Pratiques

### Layout basique 3 colonnes

```html
<div class="grid-container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
</div>
```

```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.item {
    background: #3498db;
    color: white;
    padding: 20px;
    text-align: center;
}
```

### Layout de page complet

```html
<div class="page">
    <header class="header">Header</header>
    <nav class="nav">Navigation</nav>
    <main class="main">Contenu principal</main>
    <footer class="footer">Footer</footer>
</div>
```

```css
.page {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 60px 1fr 40px;
    grid-template-areas:
        "header header"
        "nav main"
        "footer footer";
    min-height: 100vh;
    gap: 10px;
}

.header { grid-area: header; background: #2c3e50; }
.nav    { grid-area: nav; background: #34495e; }
.main   { grid-area: main; background: #ecf0f1; }
.footer { grid-area: footer; background: #2c3e50; }
```

### Grille responsive avec auto-fit

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

`auto-fit` + `minmax()` crée une grille qui s'adapte automatiquement au nombre d'éléments.

> **Note** : `auto-fill` et `auto-fit` se ressemblent mais diffèrent avec peu d'éléments. `auto-fill` conserve les pistes vides (utile pour réserver de l'espace), `auto-fit` les collapse (les colonnes s'étirent pour remplir l'espace). Avec de nombreux éléments, ils se comportent de façon identique.

---

## Commandes Utiles

| Propriété | Valeurs | Description |
| --------- | ------- | ----------- |
| `display` | `grid` | Active Grid |
| `grid-template-columns` | `100px 1fr auto` | Définit les colonnes |
| `grid-template-rows` | `100px 1fr` | Définit les lignes |
| `gap` | `10px` | Espacement |
| `grid-column` | `1 / 3` | Position colonne |
| `grid-row` | `1 / 2` | Position ligne |
| `grid-area` | `header` | Zone nommée |

---

## Pièges Fréquents

### Piège 1 : Confondre Grid et Flexbox

⚠️ **Problème** : Utiliser Grid pour un simple alignement.

✅ **Solution** : Grid pour les layouts 2D, Flexbox pour l'alignement 1D.

### Piège 2 : Oublier que les lignes commencent à 1

⚠️ **Problème** : `grid-column: 0 / 2` ne fonctionne pas. Autre confusion : `grid-column: 1 / 3` n'occupe **pas** 3 colonnes.

✅ **Solution** : Les lignes Grid commencent à 1, pas à 0. Les nombres sont des **lignes de grille**, pas des numéros de colonnes. `1 / 3` va de la ligne 1 à la ligne 3, donc **2 pistes**. Pour occuper 3 colonnes : `1 / 4` ou `span 3`. Docs : [MDN, line-based placement](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Line-based_placement).

### Piège 3 : Zones grid-template-areas mal formées

⚠️ **Problème** : Erreur si les zones ne forment pas un rectangle.

✅ **Solution** : Chaque zone doit être rectangulaire.

```css
/* ❌ Incorrect : la zone "a" forme un L (non rectangulaire) */
grid-template-areas:
    "a a b"
    "a c c";

/* ✅ Correct : chaque zone forme un rectangle */
grid-template-areas:
    "a a b"
    "c c b";
```

---

## Checklist de Validation

- [ ] Je sais activer Grid avec `display: grid`
- [ ] Je sais définir colonnes et lignes avec `grid-template-*`
- [ ] Je sais utiliser `fr` et `repeat()`
- [ ] Je sais positionner des éléments avec `grid-column` et `grid-row`
- [ ] Je sais créer des zones nommées avec `grid-template-areas`

---

## Exercice Pratique

**Énoncé** : Crée un layout de page complet avec CSS Grid contenant :

- Un `<header>` qui occupe toute la largeur
- Une `<aside>` (sidebar) à gauche de 250px de large
- Un `<main>` (contenu principal) qui occupe l'espace restant
- Un `<footer>` qui occupe toute la largeur
- Utilise `grid-template-areas` pour nommer et positionner chaque zone

**Indications** :

- Utilise `display: grid` sur un conteneur parent qui englobe les 4 éléments
- Définis les colonnes avec `grid-template-columns: 250px 1fr` (sidebar fixe, contenu flexible)
- Définis les lignes avec `grid-template-rows: 60px 1fr 50px` (header, contenu, footer)
- Utilise `grid-template-areas` avec les noms : `"header header"`, `"sidebar content"`, `"footer footer"`
- Assigne chaque élément à sa zone avec `grid-area`
- Ajoute `min-height: 100vh` pour que la page occupe toute la hauteur de l'écran
- Ajoute un `gap: 10px` pour l'espacement entre les zones

**Résultat attendu** : Une page avec un header en haut sur toute la largeur, une sidebar à gauche, le contenu principal à droite, et un footer en bas sur toute la largeur. La page occupe toute la hauteur de l'écran.

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
    <title>Layout CSS Grid</title>
    <style>
        /* Reset basique */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Conteneur Grid principal */
        .page {
            display: grid;                          /* Active CSS Grid */
            grid-template-columns: 250px 1fr;       /* Sidebar 250px, contenu flexible */
            grid-template-rows: 60px 1fr 50px;      /* Header 60px, contenu flexible, footer 50px */
            grid-template-areas:                     /* Nommage des zones */
                "header  header"                     /* Header sur 2 colonnes */
                "sidebar content"                    /* Sidebar à gauche, contenu à droite */
                "footer  footer";                    /* Footer sur 2 colonnes */
            min-height: 100vh;                       /* Occupe toute la hauteur de l'écran */
            gap: 10px;                               /* Espacement entre les zones */
        }

        /* Header : occupe la zone "header" */
        .header {
            grid-area: header;                       /* Assignation à la zone nommée */
            background-color: #2c3e50;               /* Fond bleu foncé */
            color: white;                            /* Texte blanc */
            display: flex;                           /* Flexbox pour centrer le contenu */
            align-items: center;                     /* Centrage vertical */
            padding: 0 20px;                         /* Espacement horizontal */
        }

        /* Sidebar : occupe la zone "sidebar" */
        .sidebar {
            grid-area: sidebar;                      /* Assignation à la zone nommée */
            background-color: #34495e;               /* Fond gris foncé */
            color: white;                            /* Texte blanc */
            padding: 20px;                           /* Espacement intérieur */
        }

        /* Contenu principal : occupe la zone "content" */
        .content {
            grid-area: content;                      /* Assignation à la zone nommée */
            background-color: #ecf0f1;               /* Fond gris clair */
            padding: 20px;                           /* Espacement intérieur */
        }

        /* Footer : occupe la zone "footer" */
        .footer {
            grid-area: footer;                       /* Assignation à la zone nommée */
            background-color: #2c3e50;               /* Fond bleu foncé */
            color: white;                            /* Texte blanc */
            display: flex;                           /* Flexbox pour centrer le contenu */
            align-items: center;                     /* Centrage vertical */
            justify-content: center;                 /* Centrage horizontal */
        }

        /* Style de la liste dans la sidebar */
        .sidebar ul {
            list-style: none;                        /* Supprime les puces */
            margin-top: 10px;                        /* Espace au-dessus de la liste */
        }

        /* Espacement entre les éléments de la sidebar */
        .sidebar li {
            margin-bottom: 8px;                      /* Espace entre chaque lien */
        }

        /* Style des liens de la sidebar */
        .sidebar a {
            color: #ecf0f1;                          /* Texte clair */
            text-decoration: none;                   /* Pas de soulignement */
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header sur toute la largeur -->
        <header class="header">
            <h1>Mon Site</h1>
        </header>

        <!-- Sidebar à gauche (250px) -->
        <aside class="sidebar">
            <h3>Navigation</h3>
            <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#">Articles</a></li>
                <li><a href="#">Projets</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </aside>

        <!-- Contenu principal à droite -->
        <main class="content">
            <h2>Bienvenue</h2>
            <p>Ceci est le contenu principal de la page, créé avec CSS Grid.</p>
            <p>La sidebar à gauche fait 250px de large. Ce contenu occupe
            tout l'espace restant grâce à l'unité <code>1fr</code>.</p>
        </main>

        <!-- Footer sur toute la largeur -->
        <footer class="footer">
            <p>&copy; 2025 Mon Site. Tous droits réservés.</p>
        </footer>
    </div>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[Flexbox](05-flexbox.md)**

→ Fiche suivante : **[Animations CSS](07-animations-css.md)**
