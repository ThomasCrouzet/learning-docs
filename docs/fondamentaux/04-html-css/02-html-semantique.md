---
tags:
  - HTML/CSS
  - Débutant
  - Pratique
description: "HTML sémantique"
estimated_time: "25 min"
fiche_number: 2
total_fiches: 7
cursus: "HTML/CSS"
id: "fundamentals.html-css.html-semantique"
course_id: "fundamentals.html-css"
content_type: "lesson"
order: 2
---

# 02 - HTML sémantique

> **En bref** : À la fin de cette fiche, tu sauras utiliser les balises sémantiques HTML5 pour structurer le contenu de manière significative. Lecture estimée : 25 min.


## Prérequis

- Fiche [04-html-css/01 - Structure de base HTML](01-structure-html.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les balises sémantiques HTML5 pour structurer le contenu de manière significative.

---

## Concepts

### Qu'est-ce que le HTML sémantique ?

**Définition** : Le HTML sémantique utilise des balises qui décrivent le sens du contenu, pas seulement son apparence.

**Analogie concrète** : Imagine un classeur avec des intercalaires. Tu pourrais tout ranger dans des pochettes transparentes identiques (comme des `<div>`), mais c'est difficile de retrouver quoi que ce soit. Le HTML sémantique, c'est comme utiliser des intercalaires étiquetés "Factures", "Contrats", "Courriers" : le contenu est le même, mais l'organisation a du sens.

**Comparaison non-sémantique vs sémantique** :

```html
<!-- Non-sémantique -->
<div id="header">...</div>
<div id="nav">...</div>
<div id="content">...</div>
<div id="footer">...</div>

<!-- Sémantique -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

**Avantages du HTML sémantique** :

| Avantage | Description |
| -------- | ----------- |
| Accessibilité | Les lecteurs d'écran comprennent la structure |
| SEO | Les moteurs de recherche comprennent le contenu |
| Maintenance | Le code est plus lisible |
| Cohérence | Structure standardisée |

---

### Les balises de structure

| Balise | Rôle |
| ------ | ---- |
| `<header>` | En-tête de page ou de section |
| `<nav>` | Navigation (menu) |
| `<main>` | Contenu principal (un seul par page) |
| `<article>` | Contenu autonome (article, post) |
| `<section>` | Section thématique |
| `<aside>` | Contenu secondaire (sidebar) |
| `<footer>` | Pied de page ou de section |

**Structure typique** :

```html
<body>
    <header>
        <h1>Mon Site</h1>
        <nav>
            <a href="/">Accueil</a>
            <a href="/about">À propos</a>
        </nav>
    </header>

    <main>
        <article>
            <h2>Titre de l'article</h2>
            <p>Contenu...</p>
        </article>
    </main>

    <aside>
        <h3>Liens utiles</h3>
    </aside>

    <footer>
        <p>&copy; 2024 Mon Site</p>
    </footer>
</body>
```

---

### Les balises de texte

| Balise | Usage | Exemple |
| ------ | ----- | ------- |
| `<h1>` à `<h6>` | Titres (hiérarchie) | `<h1>Titre principal</h1>` |
| `<p>` | Paragraphe | `<p>Mon texte...</p>` |
| `<strong>` | Importance (gras) | `<strong>Important</strong>` |
| `<em>` | Emphase (italique) | `<em>À noter</em>` |
| `<mark>` | Surligné | `<mark>Mis en évidence</mark>` |
| `<blockquote>` | Citation | `<blockquote>Citation...</blockquote>` |
| `<code>` | Code inline | `<code>console.log()</code>` |
| `<pre>` | Texte préformaté | `<pre>   espaces conservés</pre>` |
| `<time>` | Date/heure sémantique | `<time datetime="2024-01-15">15 janvier 2024</time>` |

---

### Les listes

**Liste non ordonnée** :

```html
<ul>
    <li>Élément 1</li>
    <li>Élément 2</li>
    <li>Élément 3</li>
</ul>
```

**Liste ordonnée** :

```html
<ol>
    <li>Premier</li>
    <li>Deuxième</li>
    <li>Troisième</li>
</ol>
```

**Liste de définitions** :

```html
<dl>
    <dt>HTML</dt>
    <dd>Langage de balisage</dd>
    <dt>CSS</dt>
    <dd>Feuilles de style</dd>
</dl>
```

---

### Les liens et images

**Liens** :

```html
<a href="https://example.com">Lien externe</a>
<a href="/page.html">Lien interne</a>
<a href="#section">Lien vers ancre</a>
<a href="mailto:email@example.com">Lien email</a>
```

**Images** :

```html
<img src="photo.jpg" alt="Description de l'image">
```

**L'attribut alt est obligatoire** pour l'accessibilité.

**Image avec légende** :

```html
<figure>
    <img src="photo.jpg" alt="Photo de paysage">
    <figcaption>Un magnifique paysage</figcaption>
</figure>
```

---

## Étapes Pratiques

### Étape 1 : Créer une page avec structure sémantique

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Blog</title>
</head>
<body>
    <header>
        <h1>Mon Blog Personnel</h1>
        <nav>
            <ul>
                <li><a href="/">Accueil</a></li>
                <li><a href="/articles">Articles</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h2>Mon premier article</h2>
                <p>Publié le <time datetime="2024-01-15">15 janvier 2024</time></p>
            </header>
            <p>Contenu de l'article...</p>
            <footer>
                <p>Catégorie : <a href="#">Tutoriels</a></p>
            </footer>
        </article>

        <article>
            <header>
                <h2>Deuxième article</h2>
            </header>
            <p>Autre contenu...</p>
        </article>
    </main>

    <aside>
        <h3>À propos</h3>
        <p>Ce blog parle de développement web.</p>
    </aside>

    <footer>
        <p>&copy; 2024 Mon Blog. Tous droits réservés.</p>
    </footer>
</body>
</html>
```

---

## Commandes Utiles

| Balise | Usage |
| ------ | ----- |
| `<header>` | En-tête |
| `<nav>` | Navigation |
| `<main>` | Contenu principal |
| `<article>` | Contenu autonome |
| `<section>` | Section thématique |
| `<aside>` | Contenu secondaire |
| `<footer>` | Pied de page |

---

## Pièges Fréquents

### Piège 1 : Plusieurs `<main>` dans une page

⚠️ **Problème** : Un document ne doit pas avoir plus d'un `<main>` **visible**. MDN / HTML : un seul `<main>` sans attribut `hidden`.

✅ **Solution** : Un seul `<main>` visible. Utiliser `<section>` pour les autres parties. Ne pas empiler plusieurs `<main>` « pour la sémantique ».

### Piège 2 : Sauter des niveaux de titre

⚠️ **Problème** : Passer de `<h1>` à `<h3>` sans `<h2>`.

✅ **Solution** : Respecter la hiérarchie h1 → h2 → h3.

---

## Checklist de Validation

- [ ] J'utilise les balises sémantiques (header, nav, main, footer)
- [ ] J'ai un seul `<main>` par page
- [ ] Les titres respectent la hiérarchie
- [ ] Mes images ont un attribut alt

---

## Exercice Pratique

**Énoncé** : Crée une page de blog complète en utilisant uniquement les balises sémantiques HTML5. La page doit contenir les éléments suivants :

- Un `<header>` avec un titre H1 et une barre de navigation (`<nav>`) contenant 3 liens
- Un `<main>` contenant un `<article>` avec un titre H2, un paragraphe de texte et une image avec attribut `alt`
- Un `<aside>` avec un titre H3 et une liste non ordonnée de 3 liens utiles
- Un `<footer>` avec un texte de copyright

**Indications** :

- Utilise la structure `<!DOCTYPE html>` complète avec `lang="fr"` et `charset="UTF-8"`
- Chaque balise sémantique remplace un `<div>` : ne pas utiliser de `<div>` dans cet exercice
- L'image peut pointer vers un fichier fictif (`photo.jpg`) mais l'attribut `alt` doit décrire l'image
- Respecte la hiérarchie des titres : H1 pour le site, H2 pour l'article, H3 pour l'aside

**Résultat attendu** : Une page HTML valide qui, ouverte dans un navigateur, affiche un blog structuré avec en-tête, contenu principal, barre latérale et pied de page.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Encodage des caractères pour les accents français -->
    <meta charset="UTF-8">
    <!-- Rendre la page adaptée aux écrans mobiles -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Blog</title>
</head>
<body>
    <!-- En-tête du site avec titre et navigation -->
    <header>
        <h1>Mon Blog Personnel</h1>
        <!-- Barre de navigation avec 3 liens -->
        <nav>
            <a href="/">Accueil</a>
            <a href="/articles">Articles</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>

    <!-- Contenu principal de la page (un seul <main> par page) -->
    <main>
        <!-- Un article autonome avec titre, texte et image -->
        <article>
            <h2>Apprendre le HTML sémantique</h2>
            <p>Le HTML sémantique permet de donner du sens à la structure
            d'une page web. Les balises comme header, main et footer
            remplacent les div génériques et rendent le code plus lisible.</p>
            <!-- Image avec attribut alt obligatoire pour l'accessibilité -->
            <img src="photo.jpg" alt="Capture d'écran d'une page HTML structurée">
        </article>
    </main>

    <!-- Contenu secondaire (barre latérale) -->
    <aside>
        <h3>Liens utiles</h3>
        <!-- Liste non ordonnée de 3 liens -->
        <ul>
            <li><a href="https://developer.mozilla.org">MDN Web Docs</a></li>
            <li><a href="https://validator.w3.org">Validateur W3C</a></li>
            <li><a href="https://web.dev">Web.dev</a></li>
        </ul>
    </aside>

    <!-- Pied de page avec copyright -->
    <footer>
        <p>&copy; 2025 Mon Blog. Tous droits réservés.</p>
    </footer>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[Structure de base HTML](01-structure-html.md)**

→ Fiche suivante : **[Les formulaires HTML](03-formulaires.md)**
