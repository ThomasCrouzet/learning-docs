---
tags:
  - HTML/CSS
  - Débutant
  - Pratique
description: "Structure de base HTML"
estimated_time: "35 min"
fiche_number: 1
total_fiches: 7
cursus: "HTML/CSS"
id: "fundamentals.html-css.structure-html"
course_id: "fundamentals.html-css"
content_type: "lesson"
order: 1
---

# 01 - Structure de base HTML

> **En bref** : À la fin de cette fiche, tu sauras créer une page HTML valide avec la structure de base : DOCTYPE, html, head et body. Lecture estimée : 35 min.


## Prérequis

- Savoir créer un fichier texte avec un éditeur
- Savoir ouvrir un fichier dans un navigateur web
- Aucune connaissance préalable de HTML n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une page HTML valide avec la structure de base : DOCTYPE, html, head et body.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que HTML ?

**Définition** : HTML (HyperText Markup Language) est le langage de balisage utilisé pour structurer le contenu des pages web. Il utilise des balises pour donner du sens aux différentes parties d'un document.

**Le problème que HTML résout** :

Sans HTML, voici les problèmes rencontrés :

1. **Texte brut** : Impossible de distinguer un titre d'un paragraphe, une liste d'un lien.

2. **Pas de structure** : Le navigateur ne sait pas comment afficher le contenu.

3. **Pas de liens** : Impossible de naviguer d'une page à une autre.

**Comment HTML résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Texte brut | Les balises définissent la nature du contenu |
| Pas de structure | Le navigateur interprète les balises pour l'affichage |
| Pas de liens | La balise `<a>` permet de créer des liens |

**Analogie concrète** : HTML est comme les panneaux de signalisation d'une ville. Sans panneaux, tu ne sais pas où tu es (rue, place, parking). Les balises HTML sont ces panneaux : elles indiquent au navigateur "ceci est un titre", "ceci est un paragraphe", "ceci est une image".

**Ce que HTML n'est PAS** :

- HTML n'est pas un langage de programmation. Il ne fait pas de calculs ni de logique.
- HTML ne définit pas l'apparence. C'est le rôle du CSS (tu verras plus tard).

---

### Les balises HTML

**Définition** : Une balise est un élément de code qui encadre le contenu pour lui donner une signification.

**Analogie concrète** : Une balise fonctionne comme une étiquette sur un bocal dans une cuisine. Le bocal contient de la farine, et l'étiquette "Farine" indique ce qu'il y a dedans. En HTML, la balise `<p>` est l'étiquette qui dit "ceci est un paragraphe", et le texte à l'intérieur est le contenu du bocal.

**Structure d'une balise** :

```html
<nombalise>Contenu</nombalise>
```

| Partie | Nom | Description |
| ------ | --- | ----------- |
| `<nombalise>` | Balise ouvrante | Marque le début |
| `Contenu` | Contenu | Le texte ou les éléments à l'intérieur |
| `</nombalise>` | Balise fermante | Marque la fin (avec `/`) |

**Balises auto-fermantes** :

Certaines balises n'ont pas de contenu et se ferment elles-mêmes :

```html
<br>     <!-- Retour à la ligne -->
<img>    <!-- Image -->
<input>  <!-- Champ de formulaire -->
<meta>   <!-- Métadonnées -->
<link>   <!-- Lien vers ressource externe -->
```

---

### La structure minimale d'une page HTML

**Le squelette obligatoire** :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre de la page</title>
</head>
<body>
    <!-- Contenu visible ici -->
</body>
</html>
```

**Explication de chaque partie** :

| Élément | Rôle |
| ------- | ---- |
| `<!DOCTYPE html>` | Déclare que c'est un document HTML5 |
| `<html>` | Racine du document, contient tout |
| `lang="fr"` | Attribut indiquant la langue |
| `<head>` | Métadonnées (non visibles) |
| `<meta charset="UTF-8">` | Encodage des caractères (accents) |
| `<meta name="viewport">` | Adaptation aux écrans mobiles (responsive) |
| `<title>` | Titre affiché dans l'onglet du navigateur |
| `<body>` | Contenu visible de la page |

---

### Le DOCTYPE

**Définition** : `<!DOCTYPE html>` indique au navigateur que le document est en HTML5.

**Analogie concrète** : Le DOCTYPE est comme la couverture d'un livre qui indique "Roman" ou "Manuel scolaire". Avant de lire le contenu, tu sais quel type de document tu as entre les mains. Le navigateur fait pareil : il lit le DOCTYPE pour savoir comment interpréter le reste.

**Règles** :

- Doit être sur la toute première ligne
- Pas de balise fermante
- Pas sensible à la casse (`<!doctype html>` fonctionne aussi)

**Ce qui se passe sans DOCTYPE** :

Le navigateur passe en "mode quirks" (mode de compatibilité ancien) et peut afficher la page de manière incorrecte.

---

### La balise html

**Définition** : `<html>` est l'élément racine qui contient tout le document.

**Analogie concrète** : La balise `<html>` est comme le carton principal d'un déménagement. Toutes les autres boîtes (head, body) sont rangées à l'intérieur de ce grand carton. Rien ne peut exister en dehors.

**Attribut lang** :

```html
<html lang="fr">  <!-- Français -->
<html lang="en">  <!-- Anglais -->
```

**Pourquoi lang est important** :

- Les lecteurs d'écran prononcent correctement le texte
- Les moteurs de recherche comprennent la langue
- Les navigateurs peuvent proposer la traduction

---

### La balise head

**Définition** : `<head>` contient les métadonnées du document : informations sur la page qui ne sont pas affichées directement.

**Analogie concrète** : Le `<head>` est comme l'en-tête d'une lettre officielle : le destinataire, la date, la référence du dossier. Ces informations ne font pas partie du message lui-même, mais elles sont indispensables pour que la lettre soit correctement traitée.

**Éléments courants dans head** :

| Balise | Rôle | Exemple |
| ------ | ---- | ------- |
| `<meta charset>` | Encodage des caractères | `<meta charset="UTF-8">` |
| `<title>` | Titre de l'onglet | `<title>Ma Page</title>` |
| `<meta name="description">` | Description pour les moteurs de recherche | `<meta name="description" content="...">` |
| `<link>` | Lien vers CSS | `<link rel="stylesheet" href="style.css">` |
| `<meta name="viewport">` | Responsive design | Voir ci-dessous |

**Le viewport pour les mobiles** :

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Cette ligne rend la page adaptée aux écrans mobiles.

---

### La balise body

**Définition** : `<body>` contient tout le contenu visible de la page.

**Analogie concrète** : Le `<body>` est comme la vitrine d'un magasin : tout ce que le visiteur voit se trouve là. Le `<head>`, en revanche, correspond à l'arrière-boutique - invisible pour le client mais essentiel au fonctionnement du magasin.

**Règles** :

- Un seul `<body>` par document
- Tout ce que l'utilisateur voit est dans `<body>`
- Les scripts peuvent être en fin de body (pour les performances)

---

### Les commentaires HTML

**Définition** : Les commentaires sont ignorés par le navigateur et servent à documenter le code.

**Analogie concrète** : Les commentaires sont comme des post-it collés sur un plan de construction. Les ouvriers (le navigateur) ne construisent pas les post-it, mais ils aident l'architecte (le développeur) à se rappeler pourquoi il a fait tel ou tel choix.

**Syntaxe** :

```html
<!-- Ceci est un commentaire -->

<!--
    Commentaire
    sur plusieurs
    lignes
-->
```

**Attention** : Les commentaires sont visibles dans le code source (clic droit → Afficher le code source). Ne jamais mettre d'informations sensibles dans les commentaires.

---

## Étapes Pratiques

### Étape 1 : Créer le fichier HTML

Crée un dossier de travail et un fichier `index.html` :

```bash
mkdir -p ~/html-exercices
cd ~/html-exercices
touch index.html
```

---

### Étape 2 : Écrire la structure de base

Ouvre `index.html` dans ton éditeur et écris :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ma première page</title>
</head>
<body>
    <h1>Bienvenue</h1>
    <p>Ceci est ma première page HTML.</p>
</body>
</html>
```

---

### Étape 3 : Ouvrir dans le navigateur

Plusieurs méthodes :

1. Double-cliquer sur le fichier
2. Dans le terminal : `open index.html` (macOS) ou `xdg-open index.html` (Linux)
3. Glisser-déposer le fichier dans le navigateur

---

### Étape 4 : Vérifier le titre de l'onglet

Regarde l'onglet du navigateur. Tu dois voir "Ma première page".

---

### Étape 5 : Ajouter du contenu dans body

Modifie le fichier pour ajouter plus de contenu :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ma première page</title>
</head>
<body>
    <h1>Bienvenue sur mon site</h1>
    <p>Ceci est ma première page HTML.</p>

    <h2>À propos</h2>
    <p>Je suis en train d'apprendre le HTML.</p>

    <h2>Contact</h2>
    <p>Vous pouvez me contacter par email.</p>
</body>
</html>
```

Rafraîchis la page dans le navigateur (F5 ou Ctrl+R).

---

### Étape 6 : Voir le code source

Dans le navigateur, fais clic droit → "Afficher le code source" (ou Ctrl+U).

Tu verras ton code HTML tel que tu l'as écrit.

---

## Commandes Utiles

| Action | Méthode |
| ------ | ------- |
| Rafraîchir la page | F5 ou Ctrl+R |
| Voir le code source | Ctrl+U |
| Inspecter un élément | Clic droit → Inspecter |
| Ouvrir les outils de développement | F12 |

---

## Pièges Fréquents

### Piège 1 : Oublier de fermer une balise

⚠️ **Problème** : L'affichage est incorrect.

✅ **Solution** : Vérifier que chaque balise ouvrante a sa balise fermante.

```html
<!-- Incorrect -->
<p>Mon paragraphe
<p>Autre paragraphe

<!-- Correct -->
<p>Mon paragraphe</p>
<p>Autre paragraphe</p>
```

---

### Piège 2 : Mauvais imbrication des balises

⚠️ **Problème** : Comportement imprévisible.

✅ **Solution** : Les balises doivent se fermer dans l'ordre inverse d'ouverture.

```html
<!-- Incorrect -->
<p><strong>Texte</p></strong>

<!-- Correct -->
<p><strong>Texte</strong></p>
```

---

### Piège 3 : Caractères spéciaux sans encodage

⚠️ **Problème** : Les accents s'affichent mal (Ã© au lieu de é).

✅ **Solution** : Toujours inclure `<meta charset="UTF-8">` dans `<head>`.

---

### Piège 4 : DOCTYPE oublié ou mal placé

⚠️ **Problème** : La page s'affiche en mode de compatibilité.

✅ **Solution** : DOCTYPE en première ligne, avant tout.

```html
<!-- Correct -->
<!DOCTYPE html>
<html>

<!-- Incorrect -->
<html>
<!DOCTYPE html>
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est une balise HTML
- [ ] J'ai compris la différence entre head et body
- [ ] J'ai créé un fichier HTML avec la structure de base
- [ ] J'ai inclus DOCTYPE, html, head, et body
- [ ] J'ai ajouté meta charset et title dans head
- [ ] J'ai vu ma page dans le navigateur
- [ ] J'ai vérifié le titre dans l'onglet

---

## Exercice Pratique

**Énoncé** : Crée une page HTML de présentation personnelle.

**Indications** :

- Structure HTML5 complète
- Titre de page : "Présentation - [Ton prénom]"
- Un titre principal `<h1>` avec ton prénom
- Un paragraphe de présentation
- Un titre secondaire `<h2>` "Mes compétences"
- Un autre paragraphe
- Au moins un commentaire HTML

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
    <title>Présentation - Sophie</title>
</head>
<body>
    <!-- Titre principal -->
    <h1>Sophie Martin</h1>

    <p>Bonjour ! Je suis étudiante en informatique à Lyon.
    Je suis passionnée par le développement web et les nouvelles technologies.</p>

    <!-- Section compétences -->
    <h2>Mes compétences</h2>

    <p>J'apprends actuellement HTML, CSS et JavaScript.
    Je maîtrise aussi Java et les bases de Unix.</p>
</body>
</html>
```

---

## Navigation

→ Fiche suivante : **[HTML sémantique](02-html-semantique.md)**
