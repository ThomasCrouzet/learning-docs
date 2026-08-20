---
tags:
  - HTML/CSS
  - Intermédiaire
  - Pratique
description: "CSS de base"
estimated_time: "35 min"
fiche_number: 4
total_fiches: 7
cursus: "HTML/CSS"
---

# 04 - CSS de base

> **En bref** : À la fin de cette fiche, tu sauras écrire des règles CSS, utiliser les sélecteurs de base, et lier une feuille de style à une page HTML. Lecture estimée : 35 min.


## Prérequis

- Fiche [04-html-css/01 - Structure de base HTML](01-structure-html.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des règles CSS, utiliser les sélecteurs de base, et lier une feuille de style à une page HTML.

---

## Concepts

### Qu'est-ce que CSS ?

**Définition** : CSS (Cascading Style Sheets) est le langage qui définit l'apparence des pages web : couleurs, polices, espacements, mise en page.

**Analogie concrète** : Si HTML est le squelette d'une maison (murs, portes, fenêtres), CSS est la décoration intérieure (peinture, papier peint, choix des meubles). La structure reste la même, mais l'apparence change complètement selon les choix de décoration.

**Séparation des responsabilités** :

| HTML | CSS |
| ---- | --- |
| Structure et contenu | Apparence et mise en forme |
| "Quoi" | "Comment ça se présente" |

---

### Syntaxe CSS

```css
selecteur {
    propriete: valeur;
    autre-propriete: valeur;
}
```

**Exemple** :

```css
h1 {
    color: blue;
    font-size: 24px;
}
```

---

### Les trois façons d'intégrer CSS

**1. CSS externe (recommandé)** :

```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

**2. CSS interne** :

```html
<head>
    <style>
        h1 { color: blue; }
    </style>
</head>
```

**3. CSS inline (à éviter)** :

```html
<h1 style="color: blue;">Titre</h1>
```

---

### Les sélecteurs de base

| Sélecteur | Cible | Exemple |
| --------- | ----- | ------- |
| `element` | Toutes les balises de ce type | `p { }` |
| `.classe` | Éléments avec cette classe | `.highlight { }` |
| `#id` | L'élément avec cet ID | `#header { }` |
| `*` | Tous les éléments | `* { }` |
| `A B` | B descendant de A | `nav a { }` |
| `A > B` | B enfant direct de A | `ul > li { }` |
| `A, B` | A ou B | `h1, h2 { }` |

---

### Propriétés courantes

**Texte** :

```css
color: #333;              /* Couleur du texte */
font-size: 16px;          /* Taille */
font-family: Arial, sans-serif;
font-weight: bold;        /* Gras */
text-align: center;       /* Alignement */
line-height: 1.5;         /* Interligne */
text-decoration: none;    /* Souligné, etc. */
```

**Couleurs et fond** :

```css
background-color: #f0f0f0;
background-image: url('image.jpg');
opacity: 0.8;             /* Transparence */
```

**Espacement** :

```css
margin: 10px;             /* Marge extérieure */
padding: 15px;            /* Marge intérieure */
/* margin: haut droite bas gauche */
margin: 10px 20px 10px 20px;
/* Raccourci vertical/horizontal */
padding: 10px 20px;
```

**Dimensions** :

```css
width: 100%;
max-width: 800px;
height: 200px;
```

**Bordures** :

```css
border: 1px solid #ccc;
border-radius: 5px;       /* Coins arrondis */
```

---

### Le modèle de boîte (Box Model)

```text
┌─────────────────────────────────────┐
│             margin                  │
│   ┌─────────────────────────────┐   │
│   │         border              │   │
│   │   ┌─────────────────────┐   │   │
│   │   │      padding        │   │   │
│   │   │   ┌─────────────┐   │   │   │
│   │   │   │   content   │   │   │   │
│   │   │   └─────────────┘   │   │   │
│   │   └─────────────────────┘   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**box-sizing** :

```css
* {
    box-sizing: border-box;  /* width inclut padding et border */
}
```

---

### La cascade et la spécificité

**Ordre de priorité (du plus faible au plus fort)** :

1. Styles du navigateur
2. CSS externe/interne (même priorité - c'est l'ordre dans le `<head>` qui détermine lequel s'applique)
3. CSS inline
4. `!important` (à éviter)

> **Note** : Le CSS externe (`<link>`) et le CSS interne (`<style>`) ont exactement la même priorité. Si tu déclares les deux dans `<head>`, c'est le dernier déclaré qui l'emporte à spécificité égale.

**Spécificité des sélecteurs** :

La spécificité se compare en **trois colonnes** (ID - CLASSE - TYPE), pas comme un nombre en base 10. Un ID gagne toujours face à n'importe quel nombre de classes.

| Sélecteur | Poids (ID-CLASSE-TYPE) |
| --------- | ---------------------- |
| `*` | 0-0-0 (aucun poids) |
| `element` | 0-0-1 |
| `.classe`, `[attr]`, `:hover` | 0-1-0 |
| `#id` | 1-0-0 |
| `style=""` (inline) | gagne sur les sélecteurs, sauf `!important` |

Exemple : `#titre` (1-0-0) bat `.a .b .c .d` (0-4-0). Le modèle "100 / 10 / 1" est un mémo incorrect dès que tu as 11 classes.

---

## Étapes Pratiques

### Fichier style.css

```css
/* Reset basique */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Corps */
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

/* Titres */
h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}

h2 {
    color: #34495e;
    margin: 15px 0;
}

/* Paragraphes */
p {
    margin-bottom: 10px;
}

/* Liens */
a {
    color: #3498db;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Classes utilitaires */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.highlight {
    background-color: #ffffcc;
    padding: 5px;
}

/* Boutons */
.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: #2980b9;
}
```

### Fichier index.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS de base</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Bienvenue</h1>
        <p>Ceci est un paragraphe avec du style CSS.</p>
        <p class="highlight">Ce texte est surligné.</p>
        <h2>Section</h2>
        <p>Visitez <a href="#">ce lien</a> pour plus d'informations.</p>
        <button class="btn">Cliquez ici</button>
    </div>
</body>
</html>
```

---

## Pièges Fréquents

### Piège 1 : Oublier le lien vers le CSS

⚠️ **Problème** : Les styles ne s'appliquent pas.

✅ **Solution** : Vérifier le chemin dans `<link href="...">`.

### Piège 2 : Spécificité trop faible

⚠️ **Problème** : Un style ne s'applique pas.

✅ **Solution** : Utiliser un sélecteur plus spécifique.

---

## Checklist de Validation

- [ ] J'ai créé un fichier CSS externe
- [ ] Je l'ai lié avec `<link rel="stylesheet">`
- [ ] J'utilise des classes plutôt que des IDs
- [ ] Je comprends le modèle de boîte
- [ ] J'utilise `box-sizing: border-box`

---

## Exercice Pratique

**Énoncé** : Crée une feuille de style CSS pour une page de blog. Le fichier CSS doit appliquer les styles suivants :

- Couleur de fond de la page : gris clair (`#f5f5f5`)
- Contenu centré avec une largeur maximale de `800px` et des marges automatiques
- Titres H1 et H2 en bleu foncé (`#2c3e50`)
- Liens sans soulignement qui deviennent soulignés au survol (`:hover`)
- Bordure grise (`1px solid #ddd`) autour des articles avec un padding de `20px`
- Texte du corps en police `Arial, sans-serif` avec un interligne de `1.6`

**Indications** :

- Crée deux fichiers : `index.html` et `style.css`
- Lie le CSS avec `<link rel="stylesheet" href="style.css">` dans le `<head>`
- Utilise `max-width` et `margin: 0 auto` pour centrer le contenu
- Pense à ajouter `box-sizing: border-box` sur tous les éléments avec le sélecteur `*`
- Utilise la pseudo-classe `:hover` pour le style des liens au survol

**Résultat attendu** : Une page de blog lisible avec un fond gris clair, du contenu centré, des titres bleus, des liens stylisés et un article encadré.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier `style.css`** :

```css
/* Reset basique pour uniformiser le rendu entre navigateurs */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* width inclut padding et border */
}

/* Styles du corps de la page */
body {
    background-color: #f5f5f5;       /* Fond gris clair */
    font-family: Arial, sans-serif;  /* Police lisible */
    line-height: 1.6;                /* Interligne confortable */
    color: #333;                     /* Texte gris foncé */
}

/* Conteneur principal centré */
.container {
    max-width: 800px;     /* Largeur maximale du contenu */
    margin: 0 auto;       /* Centrage horizontal automatique */
    padding: 20px;        /* Espacement intérieur */
}

/* Titres en bleu foncé */
h1 {
    color: #2c3e50;          /* Bleu foncé */
    margin-bottom: 20px;     /* Espace sous le titre principal */
}

h2 {
    color: #2c3e50;          /* Même bleu foncé que H1 */
    margin-bottom: 15px;     /* Espace sous les sous-titres */
}

/* Liens sans soulignement par défaut */
a {
    color: #3498db;            /* Bleu pour les liens */
    text-decoration: none;     /* Supprime le soulignement */
}

/* Liens soulignés au survol de la souris */
a:hover {
    text-decoration: underline;  /* Soulignement au survol */
}

/* Style des articles avec bordure */
article {
    border: 1px solid #ddd;     /* Bordure grise légère */
    padding: 20px;              /* Espacement intérieur */
    margin-bottom: 20px;        /* Espace entre les articles */
    background-color: white;    /* Fond blanc pour contraster */
    border-radius: 4px;         /* Coins légèrement arrondis */
}

/* Paragraphes avec espace en bas */
p {
    margin-bottom: 10px;  /* Espace entre les paragraphes */
}
```

**Fichier `index.html`** :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Blog</title>
    <!-- Lien vers la feuille de style externe -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Mon Blog</h1>

        <article>
            <h2>Premier article</h2>
            <p>Ceci est le contenu de mon premier article de blog.</p>
            <p>Consulte <a href="#">ce lien</a> pour en savoir plus.</p>
        </article>

        <article>
            <h2>Deuxième article</h2>
            <p>Un autre article avec du contenu intéressant.</p>
        </article>
    </div>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[Les formulaires HTML](03-formulaires.md)**

→ Fiche suivante : **[Flexbox](05-flexbox.md)**
