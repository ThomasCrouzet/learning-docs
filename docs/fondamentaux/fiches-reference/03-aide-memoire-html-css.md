---
tags:
  - Référence
  - Débutant
description: "Aide-mémoire HTML/CSS"
estimated_time: "35 min"
fiche_number: 3
total_fiches: 3
cursus: "Aide-mémoires Java, Bash, HTML/CSS"
---

# 03 - Aide-mémoire HTML/CSS

> **En bref** : Aide-mémoire HTML/CSS. Lecture estimée : 35 min.

Référence rapide pour HTML et CSS.

---

## Structure HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Contenu -->
    <script src="script.js"></script>
</body>
</html>
```

---

## Balises HTML courantes

### Structure

| Balise | Description |
| ------ | ----------- |
| `<header>` | En-tête |
| `<nav>` | Navigation |
| `<main>` | Contenu principal |
| `<article>` | Article autonome |
| `<section>` | Section |
| `<aside>` | Contenu secondaire |
| `<footer>` | Pied de page |
| `<div>` | Division générique |
| `<span>` | Inline générique |

### Texte

| Balise | Description |
| ------ | ----------- |
| `<h1>` à `<h6>` | Titres |
| `<p>` | Paragraphe |
| `<strong>` | Importance (gras) |
| `<em>` | Emphase (italique) |
| `<br>` | Retour à la ligne |
| `<hr>` | Ligne horizontale |
| `<blockquote>` | Citation |
| `<code>` | Code inline |
| `<pre>` | Préformaté |

### Listes

```html
<!-- Liste non ordonnée -->
<ul>
    <li>Élément</li>
</ul>

<!-- Liste ordonnée -->
<ol>
    <li>Premier</li>
</ol>
```

### Liens et médias

```html
<a href="url">Lien</a>
<a href="url" target="_blank">Nouvel onglet</a>
<img src="image.jpg" alt="Description">
```

### Formulaires

```html
<form action="/submit" method="POST">
    <label for="email">Email :</label>
    <input type="email" id="email" name="email" required>

    <textarea name="message" rows="5"></textarea>

    <select name="choix">
        <option value="">Choisir</option>
        <option value="a">Option A</option>
    </select>

    <button type="submit">Envoyer</button>
</form>
```

### Types d'input

| Type | Description |
| ---- | ----------- |
| `text` | Texte |
| `email` | Email |
| `password` | Mot de passe |
| `number` | Nombre |
| `tel` | Téléphone |
| `date` | Date |
| `checkbox` | Case à cocher |
| `radio` | Bouton radio |
| `file` | Fichier |
| `submit` | Bouton envoi |

### Attributs de validation

| Attribut | Description |
| -------- | ----------- |
| `required` | Obligatoire |
| `minlength` | Longueur min |
| `maxlength` | Longueur max |
| `min` | Valeur min |
| `max` | Valeur max |
| `pattern` | Regex |
| `placeholder` | Texte indicatif |

---

## Sélecteurs CSS

| Sélecteur | Cible |
| --------- | ----- |
| `element` | Toutes les balises |
| `.classe` | Classe |
| `#id` | ID |
| `*` | Tout |
| `A B` | B descendant de A |
| `A > B` | B enfant direct de A |
| `A + B` | B juste après A |
| `A, B` | A ou B |
| `A:hover` | A survolé |
| `A:focus` | A avec focus |
| `A:first-child` | Premier enfant |
| `A:nth-child(n)` | Nième enfant |
| `A::before` | Avant le contenu |
| `A::after` | Après le contenu |

---

## Propriétés CSS

### Texte

```css
color: #333;
font-size: 16px;
font-family: Arial, sans-serif;
font-weight: bold;        /* normal, bold, 100-900 */
font-style: italic;
text-align: left;         /* center, right, justify */
text-decoration: none;    /* underline, line-through */
line-height: 1.5;
letter-spacing: 1px;
text-transform: uppercase; /* lowercase, capitalize */
```

### Couleurs et fond

```css
color: #ffffff;
color: rgb(255, 255, 255);
color: rgba(255, 255, 255, 0.5);
background-color: #f0f0f0;
background-image: url('image.jpg');
background-size: cover;
background-position: center;
background-repeat: no-repeat;
opacity: 0.8;
```

### Box Model

```css
width: 100%;
max-width: 800px;
min-width: 200px;
height: 100px;

margin: 10px;             /* tous les côtés */
margin: 10px 20px;        /* vertical horizontal */
margin: 10px 20px 10px 20px; /* haut droite bas gauche */
margin-top: 10px;

padding: 15px;
padding: 10px 20px;

border: 1px solid #ccc;
border-radius: 5px;

box-sizing: border-box;   /* width inclut padding et border */
```

### Positionnement

```css
position: static;         /* défaut */
position: relative;       /* relatif à position normale */
position: absolute;       /* relatif au parent positionné */
position: fixed;          /* relatif à la fenêtre */
position: sticky;         /* devient fixed au scroll */

top: 10px;
right: 10px;
bottom: 10px;
left: 10px;

z-index: 100;
```

### Display

```css
display: block;
display: inline;
display: inline-block;
display: none;
display: flex;
display: grid;

visibility: hidden;       /* caché mais occupe l'espace */
```

---

## Flexbox

```css
.container {
    display: flex;
    flex-direction: row;      /* row, column, row-reverse, column-reverse */
    justify-content: center;  /* flex-start, flex-end, space-between, space-around, space-evenly */
    align-items: center;      /* flex-start, flex-end, stretch, baseline */
    flex-wrap: wrap;          /* nowrap, wrap-reverse */
    gap: 10px;
}

.item {
    flex: 1;                  /* grow shrink basis */
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 200px;
    align-self: flex-start;
    order: 1;
}
```

**Centrage parfait** :

```css
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

---

## Grid

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-rows: 100px auto;
    gap: 20px;
    row-gap: 10px;
    column-gap: 20px;
}

.item {
    grid-column: 1 / 3;       /* de ligne 1 à ligne 3 */
    grid-row: 1 / 2;
    grid-column: span 2;      /* occupe 2 colonnes */
}
```

**Zones nommées** :

```css
.container {
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

---

## Transitions et animations

```css
/* Transition */
.element {
    transition: all 0.3s ease;
    transition: background-color 0.3s ease;
}

/* Transform */
transform: translateX(50px);
transform: translateY(20px);
transform: translate(50px, 20px);
transform: scale(1.5);
transform: rotate(45deg);

/* Animation */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.element {
    animation: fadeIn 0.5s ease forwards;
    animation: nom 2s ease 0s infinite alternate;
}
```

---

## Media Queries

```css
/* Mobile first */
.element {
    width: 100%;
}

/* Tablette */
@media (min-width: 768px) {
    .element {
        width: 50%;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .element {
        width: 33.33%;
    }
}
```

---

## Unités

| Unité | Description |
| ----- | ----------- |
| `px` | Pixels |
| `%` | Pourcentage du parent |
| `em` | Relatif à la taille de police du parent |
| `rem` | Relatif à la taille de police root |
| `vw` | 1% de la largeur de la fenêtre |
| `vh` | 1% de la hauteur de la fenêtre |
| `fr` | Fraction (Grid) |

---

## Reset CSS minimal

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
}

img {
    max-width: 100%;
    height: auto;
}

a {
    text-decoration: none;
    color: inherit;
}

ul, ol {
    list-style: none;
}
```

---

## Spécificité

Du moins au plus spécifique :

1. `*` - 0
2. `element` - 1
3. `.classe` - 10
4. `#id` - 100
5. `style=""` - 1000
6. `!important` - Priorité max (éviter)

---

## Navigation

← Fiche précédente : **[Aide-mémoire Bash](02-aide-memoire-bash.md)**
