---
tags:
  - HTML/CSS
  - Intermédiaire
  - Pratique
description: "Animations CSS"
estimated_time: "35 min"
fiche_number: 7
total_fiches: 7
cursus: "HTML/CSS"
---

# 07 - Animations CSS

> **En bref** : À la fin de cette fiche, tu sauras créer des transitions et des animations CSS pour rendre tes interfaces plus dynamiques. Lecture estimée : 35 min.


## Prérequis

- Fiche [04-html-css/04 - CSS de base](04-css-base.md)
- Fiche [04-html-css/05 - Flexbox](05-flexbox.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des transitions et des animations CSS pour rendre tes interfaces plus dynamiques.

---

## Concepts

### Transitions vs Animations

| Transition | Animation |
| ---------- | --------- |
| État A → État B | Séquence d'états multiples |
| Déclenchée par un changement (hover, focus) | Peut être automatique |
| Simple à mettre en place | Plus de contrôle |

---

### Les transitions

**Définition** : Une transition permet de passer progressivement d'un état CSS à un autre.

**Analogie concrète** : Une transition est comme un variateur de lumière. Au lieu d'allumer ou éteindre d'un coup (passage brutal d'un état à l'autre), le variateur fait monter ou descendre la lumière progressivement. En CSS, la transition fait la même chose : elle passe d'une couleur, une taille ou une position à une autre de manière fluide.

**Syntaxe** :

```css
.element {
    transition: propriété durée timing-function délai;
}
```

**Exemple** :

```css
.bouton {
    background-color: blue;
    transition: background-color 0.3s ease;
}

.bouton:hover {
    background-color: darkblue;
}
```

**Propriétés de transition** :

| Propriété | Description | Exemple |
| --------- | ----------- | ------- |
| `transition-property` | Propriété à animer | `background-color` |
| `transition-duration` | Durée | `0.3s`, `300ms` |
| `transition-timing-function` | Courbe de vitesse | `ease`, `linear` |
| `transition-delay` | Délai avant démarrage | `0.1s` |

**Timing functions** :

| Valeur | Comportement |
| ------ | ------------ |
| `ease` | Lent → Rapide → Lent (défaut) |
| `linear` | Vitesse constante |
| `ease-in` | Lent → Rapide |
| `ease-out` | Rapide → Lent |
| `ease-in-out` | Lent → Rapide → Lent |

---

### Les transformations

**Définition** : `transform` modifie l'apparence d'un élément sans affecter le flux du document.

**Analogie concrète** : `transform` est comme une loupe, un miroir déformant ou un plateau tournant. Tu peux agrandir un objet (scale), le faire pivoter (rotate), le déplacer (translate) ou l'incliner (skew), mais l'objet reste à sa place dans la pièce - les autres objets autour ne bougent pas.

**Fonctions de transformation** :

```css
.element {
    transform: translateX(50px);    /* Déplace horizontalement */
    transform: translateY(20px);    /* Déplace verticalement */
    transform: translate(50px, 20px); /* Déplace X et Y */
    transform: scale(1.5);          /* Agrandit de 50% */
    transform: rotate(45deg);       /* Rotation de 45 degrés */
    transform: skew(10deg);         /* Inclinaison */
}
```

**Combiner les transformations** :

```css
.element {
    transform: translateX(50px) rotate(45deg) scale(1.2);
}
```

**Point d'origine** :

```css
.element {
    transform-origin: center;       /* Par défaut */
    transform-origin: top left;
    transform-origin: 50% 50%;
}
```

---

### Les animations @keyframes

**Définition** : `@keyframes` définit une séquence d'états pour une animation.

**Analogie concrète** : `@keyframes` fonctionne comme un flipbook (ces petits carnets où chaque page montre une position légèrement différente d'un personnage). Tu dessines les étapes clés (0%, 50%, 100%), et le navigateur se charge de créer les images intermédiaires pour que le mouvement soit fluide.

**Syntaxe** :

```css
@keyframes nom-animation {
    from {
        /* État initial */
    }
    to {
        /* État final */
    }
}

/* OU avec pourcentages */
@keyframes nom-animation {
    0% {
        /* État initial */
    }
    50% {
        /* État intermédiaire */
    }
    100% {
        /* État final */
    }
}
```

**Application** :

```css
.element {
    animation: nom-animation durée timing-function délai nombre direction;
}
```

**Propriétés d'animation** :

| Propriété | Description | Valeurs |
| --------- | ----------- | ------- |
| `animation-name` | Nom du @keyframes | `monAnimation` |
| `animation-duration` | Durée | `2s`, `500ms` |
| `animation-timing-function` | Courbe | `ease`, `linear` |
| `animation-delay` | Délai | `0.5s` |
| `animation-iteration-count` | Répétitions | `3`, `infinite` |
| `animation-direction` | Direction | `normal`, `reverse`, `alternate` |
| `animation-fill-mode` | État final | `forwards`, `backwards`, `both` |

---

## Étapes Pratiques

### Bouton avec transition

```css
.btn {
    padding: 12px 24px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

### Carte avec effet de survol

```css
.card {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
```

### Animation de chargement (spinner)

```css
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
```

### Animation de fondu (fade-in)

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.5s ease forwards;
}
```

### Animation de pulsation

```css
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.pulse {
    animation: pulse 2s ease-in-out infinite;
}
```

### Menu hamburger animé

```css
.hamburger {
    width: 30px;
    height: 20px;
    position: relative;
    cursor: pointer;
}

.hamburger span {
    position: absolute;
    width: 100%;
    height: 3px;
    background: #333;
    transition: all 0.3s ease;
}

.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 8px; }
.hamburger span:nth-child(3) { top: 16px; }

.hamburger.active span:nth-child(1) {
    transform: rotate(45deg);
    top: 8px;
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    transform: rotate(-45deg);
    top: 8px;
}
```

---

## Commandes Utiles

| Propriété | Description |
| --------- | ----------- |
| `transition` | Transition entre états |
| `transform` | Transformation visuelle |
| `@keyframes` | Définition d'animation |
| `animation` | Application d'animation |
| `transform-origin` | Point de pivot |

---

## Pièges Fréquents

### Piège 1 : Animer des propriétés coûteuses

⚠️ **Problème** : Animer `width`, `height`, `margin` cause des performances médiocres.

✅ **Solution** : Préférer `transform` et `opacity` qui sont optimisés par le GPU.

```css
/* ❌ Lent */
.element {
    transition: width 0.3s;
}

/* ✅ Performant */
.element {
    transition: transform 0.3s;
}
```

### Piège 2 : Préfixes vendeurs (contexte historique)

⚠️ **Problème** : Des tutoriels anciens recommandent d'ajouter `-webkit-transform`, `-moz-transform`, etc. En 2026, ces préfixes ne sont plus nécessaires pour `transform` et `animation`.

✅ **Solution** : Utilise directement les propriétés standard - elles sont supportées par tous les navigateurs modernes sans préfixe (Chrome 36+, Firefox 16+, Safari 9+).

```css
/* ✅ Correct en 2026 - pas besoin de préfixes */
.element {
    transform: rotate(45deg);
    animation: monAnimation 1s ease;
}
```

> **Note** : Si tu dois supporter des navigateurs très anciens, utilise un outil comme **Autoprefixer** - ne les ajoute jamais manuellement.

### Piège 3 : Animation qui ne démarre pas

⚠️ **Problème** : L'animation ne se joue pas.

✅ **Solution** : Vérifier que `animation-name` correspond au `@keyframes`.

---

## Checklist de Validation

- [ ] Je sais créer une transition avec `transition`
- [ ] Je sais utiliser `transform` pour déplacer/tourner/agrandir
- [ ] Je sais définir une animation avec `@keyframes`
- [ ] Je sais appliquer une animation avec `animation`
- [ ] Je sais utiliser `animation-iteration-count: infinite` pour boucler

---

## Exercice Pratique

**Énoncé** : Crée un bouton avec 3 effets CSS différents :

1. **Transition au survol** : la couleur de fond du bouton change progressivement en 0.3 secondes quand on passe la souris dessus
2. **Transformation au clic** : le bouton s'agrandit légèrement avec `transform: scale(1.1)` quand on clique dessus (pseudo-classe `:active`)
3. **Animation de chargement** : un spinner CSS (cercle qui tourne) affiché à côté du bouton, créé avec `@keyframes` qui effectue une rotation de 360 degrés en boucle infinie (1 seconde, vitesse constante)

**Indications** :

- Le bouton utilise `transition` pour l'effet de survol (propriété `background-color`)
- Utilise la pseudo-classe `:active` pour détecter le clic (le style s'applique tant que le bouton est enfoncé)
- Le spinner est un `<div>` carré avec `border-radius: 50%` pour en faire un cercle
- Le spinner utilise une bordure grise avec un côté coloré (`border-top`) qui tourne grâce à `@keyframes`
- L'animation du spinner utilise `animation: spin 1s linear infinite`

**Résultat attendu** : Un bouton qui change de couleur au survol, grossit au clic, et un cercle animé qui tourne en continu à côté du bouton.

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
    <title>Bouton animé</title>
    <style>
        /* Centrage du contenu pour la démonstration */
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;                            /* Espace entre le bouton et le spinner */
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }

        /* === BOUTON AVEC TRANSITION ET TRANSFORMATION === */
        .btn {
            padding: 14px 28px;                   /* Espacement intérieur */
            background-color: #3498db;            /* Couleur de fond bleue */
            color: white;                         /* Texte blanc */
            border: none;                         /* Pas de bordure */
            border-radius: 6px;                   /* Coins arrondis */
            font-size: 16px;                      /* Taille du texte */
            cursor: pointer;                      /* Curseur en forme de main */
            /* Transition de 0.3s sur la couleur de fond et la transformation */
            transition: background-color 0.3s ease, transform 0.3s ease;
        }

        /* Effet 1 : changement de couleur au survol */
        .btn:hover {
            background-color: #2980b9;            /* Bleu plus foncé au survol */
        }

        /* Effet 2 : agrandissement au clic (tant que le bouton est enfoncé) */
        .btn:active {
            transform: scale(1.1);                /* Agrandit de 10% */
        }

        /* === ANIMATION DE CHARGEMENT (SPINNER) === */

        /* Définition de l'animation : rotation complète de 0 à 360 degrés */
        @keyframes spin {
            from {
                transform: rotate(0deg);          /* Position de départ */
            }
            to {
                transform: rotate(360deg);        /* Rotation complète */
            }
        }

        /* Le spinner : cercle avec un côté coloré qui tourne */
        .spinner {
            width: 40px;                          /* Largeur du cercle */
            height: 40px;                         /* Hauteur du cercle */
            border: 4px solid #ddd;               /* Bordure grise (le cercle de fond) */
            border-top: 4px solid #3498db;        /* Un côté bleu (la partie visible qui tourne) */
            border-radius: 50%;                   /* Transforme le carré en cercle */
            /* Animation : nom, durée 1s, vitesse constante, boucle infinie */
            animation: spin 1s linear infinite;
        }
    </style>
</head>
<body>
    <!-- Bouton avec transition au survol et transformation au clic -->
    <button class="btn">Envoyer</button>

    <!-- Spinner de chargement avec animation @keyframes -->
    <div class="spinner"></div>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[CSS Grid](06-css-grid.md)**
