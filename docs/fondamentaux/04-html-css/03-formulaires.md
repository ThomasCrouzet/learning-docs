---
tags:
  - HTML/CSS
  - Débutant
  - Pratique
description: "Les formulaires HTML"
estimated_time: "20 min"
fiche_number: 3
total_fiches: 7
cursus: "HTML/CSS"
---

# 03 - Les formulaires HTML

> **En bref** : À la fin de cette fiche, tu sauras créer des formulaires HTML avec différents types de champs et de validation. Lecture estimée : 20 min.


## Prérequis

- Fiche [04-html-css/01 - Structure de base HTML](01-structure-html.md)
- Fiche [04-html-css/02 - HTML sémantique](02-html-semantique.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des formulaires HTML avec différents types de champs et de validation.

---

## Concepts

### La balise form

**Structure de base** :

```html
<form action="/submit" method="POST">
    <!-- Champs ici -->
</form>
```

| Attribut | Rôle |
| -------- | ---- |
| `action` | URL où envoyer les données |
| `method` | GET (URL) ou POST (corps de requête) |

---

### Les types de champs input

| Type | Usage | Exemple |
| ---- | ----- | ------- |
| `text` | Texte court | `<input type="text">` |
| `email` | Adresse email | `<input type="email">` |
| `password` | Mot de passe | `<input type="password">` |
| `number` | Nombre | `<input type="number">` |
| `tel` | Téléphone | `<input type="tel">` |
| `date` | Date | `<input type="date">` |
| `checkbox` | Case à cocher | `<input type="checkbox">` |
| `radio` | Choix unique | `<input type="radio">` |
| `file` | Fichier | `<input type="file">` |
| `submit` | Bouton d'envoi | `<input type="submit">` |

---

### Les labels

**Toujours associer un label à un champ** :

```html
<!-- Méthode 1 : for/id -->
<label for="email">Email :</label>
<input type="email" id="email" name="email">

<!-- Méthode 2 : imbrication -->
<label>
    Email :
    <input type="email" name="email">
</label>
```

---

### La validation HTML5

Ces attributs participent à la validation de contraintes du navigateur (le formulaire peut être bloqué à l'envoi) :

| Attribut | Effet |
| -------- | ----- |
| `required` | Champ obligatoire |
| `minlength` | Longueur minimale |
| `maxlength` | Longueur maximale |
| `min` | Valeur minimale (nombres et dates) |
| `max` | Valeur maximale (nombres et dates) |
| `pattern` | Expression régulière |

**Ce que la validation HTML5 n'est PAS** : `placeholder` n'est pas un attribut de validation. C'est un texte d'exemple affiché tant que le champ est vide. Il disparaît dès que l'utilisateur saisit une valeur et ne remplace pas un `<label>`.

**Exemple** :

```html
<input type="text" name="username"
       required
       minlength="3"
       maxlength="20"
       pattern="[a-zA-Z0-9]+"
       placeholder="Votre pseudo">
```

---

### Autres éléments de formulaire

**Textarea** (texte multiligne) :

```html
<textarea name="message" rows="5" cols="30"></textarea>
```

**Select** (liste déroulante) :

```html
<select name="pays">
    <option value="">Choisir un pays</option>
    <option value="fr">France</option>
    <option value="be">Belgique</option>
</select>
```

**Grouper avec fieldset** :

```html
<fieldset>
    <legend>Informations personnelles</legend>
    <label>Nom : <input type="text" name="nom"></label>
    <label>Email : <input type="email" name="email"></label>
</fieldset>
```

---

## Étapes Pratiques

### Formulaire complet

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Formulaire de contact</title>
</head>
<body>
    <h1>Contactez-nous</h1>

    <form action="/contact" method="POST">
        <fieldset>
            <legend>Vos informations</legend>

            <p>
                <label for="nom">Nom :</label>
                <input type="text" id="nom" name="nom" required>
            </p>

            <p>
                <label for="email">Email :</label>
                <input type="email" id="email" name="email" required>
            </p>

            <p>
                <label for="tel">Téléphone :</label>
                <input type="tel" id="tel" name="tel" pattern="[0-9]{10}">
            </p>
        </fieldset>

        <fieldset>
            <legend>Votre message</legend>

            <p>
                <label for="sujet">Sujet :</label>
                <select id="sujet" name="sujet" required>
                    <option value="">-- Choisir --</option>
                    <option value="info">Demande d'information</option>
                    <option value="support">Support technique</option>
                    <option value="autre">Autre</option>
                </select>
            </p>

            <p>
                <label for="message">Message :</label><br>
                <textarea id="message" name="message" rows="5" cols="40" required></textarea>
            </p>

            <p>
                <label>
                    <input type="checkbox" name="newsletter">
                    S'inscrire à la newsletter
                </label>
            </p>
        </fieldset>

        <p>
            <button type="submit">Envoyer</button>
            <button type="reset">Effacer</button>
        </p>
    </form>
</body>
</html>
```

---

## Pièges Fréquents

### Piège 1 : Oublier l'attribut name

⚠️ **Problème** : Les données ne sont pas envoyées.

✅ **Solution** : Chaque champ doit avoir `name="..."`.

### Piège 2 : Radio sans même name

⚠️ **Problème** : Plusieurs choix possibles au lieu d'un seul.

✅ **Solution** : Les radios d'un même groupe doivent avoir le même `name`.

```html
<input type="radio" name="genre" value="m"> Homme
<input type="radio" name="genre" value="f"> Femme
```

---

### Piège 3 : La validation HTML5 n'est pas une sécurité

⚠️ **Problème** : La validation `required`, `minlength`, `pattern`, etc. peut être désactivée par l'utilisateur (DevTools, requête directe sans navigateur). Ne jamais s'y fier pour la sécurité des données.

✅ **Solution** : La validation HTML5 améliore l'expérience utilisateur, mais la validation côté serveur est obligatoire pour la sécurité.

```html
<!-- Côté client : améliore l'UX, mais contournable -->
<input type="email" required minlength="5">

<!-- Côté serveur (PHP, Node.js...) : obligatoire -->
<!-- Valider, filtrer, et échapper TOUTES les données reçues -->
```

---

## Checklist de Validation

- [ ] Chaque champ a un `name`
- [ ] Chaque champ a un `label` associé
- [ ] Les champs obligatoires ont `required`
- [ ] Les emails utilisent `type="email"`
- [ ] La validation HTML5 est utilisée

---

## Exercice Pratique

**Énoncé** : Crée un formulaire d'inscription complet avec les champs suivants :

- Nom complet (champ texte, obligatoire)
- Adresse email (type email, obligatoire)
- Mot de passe (type password, minimum 8 caractères)
- Date de naissance (type date)
- Pays (liste déroulante `<select>` avec 3 options : France, Belgique, Suisse)
- Acceptation des conditions d'utilisation (checkbox, obligatoire)
- Bouton "S'inscrire"

**Indications** :

- Chaque champ doit avoir un `<label>` associé avec l'attribut `for`
- Utilise les attributs de validation HTML5 : `required`, `type`, `minlength`
- Regroupe les champs dans un `<fieldset>` avec un `<legend>`
- Chaque champ doit avoir un attribut `name` (sinon les données ne seront pas envoyées)
- Le formulaire doit utiliser `method="POST"` et `action="/inscription"`

**Résultat attendu** : Un formulaire qui, à l'ouverture dans un navigateur, empêche l'envoi si un champ obligatoire est vide, si l'email est invalide, ou si le mot de passe fait moins de 8 caractères.

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
    <title>Inscription</title>
</head>
<body>
    <h1>Créer un compte</h1>

    <!-- Formulaire envoyé en POST vers /inscription -->
    <form action="/inscription" method="POST">
        <!-- Groupe de champs pour les informations personnelles -->
        <fieldset>
            <legend>Informations personnelles</legend>

            <!-- Champ nom : texte obligatoire -->
            <p>
                <label for="nom">Nom complet :</label>
                <input type="text" id="nom" name="nom" required>
            </p>

            <!-- Champ email : validation automatique du format -->
            <p>
                <label for="email">Adresse email :</label>
                <input type="email" id="email" name="email" required>
            </p>

            <!-- Champ mot de passe : minimum 8 caractères -->
            <p>
                <label for="password">Mot de passe :</label>
                <input type="password" id="password" name="password"
                       minlength="8" required>
            </p>

            <!-- Champ date de naissance : affiche un calendrier -->
            <p>
                <label for="naissance">Date de naissance :</label>
                <input type="date" id="naissance" name="naissance">
            </p>

            <!-- Liste déroulante pour le pays -->
            <p>
                <label for="pays">Pays :</label>
                <select id="pays" name="pays">
                    <!-- Option vide par défaut pour forcer un choix -->
                    <option value="">-- Choisir un pays --</option>
                    <option value="fr">France</option>
                    <option value="be">Belgique</option>
                    <option value="ch">Suisse</option>
                </select>
            </p>
        </fieldset>

        <!-- Checkbox obligatoire pour les conditions -->
        <p>
            <label>
                <!-- required empêche l'envoi si la case n'est pas cochée -->
                <input type="checkbox" name="conditions" required>
                J'accepte les conditions d'utilisation
            </label>
        </p>

        <!-- Bouton d'envoi du formulaire -->
        <p>
            <button type="submit">S'inscrire</button>
        </p>
    </form>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[HTML sémantique](02-html-semantique.md)**

→ Fiche suivante : **[CSS de base](04-css-base.md)**
