---
tags:
  - Certification
  - Intermédiaire
  - Pratique
description: "BC04 - 04 - Les Applications Mobiles et Desktop"
estimated_time: "30 min"
fiche_number: 4
total_fiches: 4
cursus: "BC04 - Développement logiciel"
---

# BC04 - 04 - Les Applications Mobiles et Desktop

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est le responsive design, comment créer des applications multiplateformes (web, mobile, desktop), et tu comprendras les concepts de PWA (Progressive Web App). Lecture estimée : 30 min.


## Prérequis

- Fiche **[BC04 - 01 - L'Architecture Serveur Web](01-architecture-serveur-web.md)**
- Connaissances en HTML/CSS/JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est le responsive design, comment créer des applications multiplateformes (web, mobile, desktop), et tu comprendras les concepts de PWA (Progressive Web App).

---

## Concepts

### Qu'est-ce que le responsive design ?

**Définition** : Le responsive design est une approche de conception web qui permet à un site de s'adapter automatiquement à la taille de l'écran (smartphone, tablette, ordinateur).

**Le problème que le responsive résout** :

Sans responsive, voici les problèmes rencontrés :

1. **Site illisible sur mobile** : Texte trop petit, boutons impossibles à cliquer.
2. **Deux versions à maintenir** : Un site mobile + un site desktop = double travail.
3. **SEO pénalisé** : Google favorise les sites mobile-friendly.

**Comment le responsive résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Site illisible sur mobile | Adaptation automatique de la mise en page |
| Deux versions à maintenir | Un seul code pour tous les écrans |
| SEO pénalisé | Site conforme aux critères Google |

**Analogie concrète** : Le responsive est comme un meuble modulable. Un canapé-lit s'adapte selon le besoin : canapé le jour, lit la nuit. Un site responsive s'adapte selon l'écran : une colonne sur mobile, trois colonnes sur desktop.

---

### Quels sont les breakpoints standard ?

**Définition** : Un breakpoint est un seuil de largeur d'écran où la mise en page change.

| Breakpoint | Largeur | Appareils |
| ---------- | ------- | --------- |
| xs (extra small) | < 576px | Smartphones portrait |
| sm (small) | ≥ 576px | Smartphones paysage |
| md (medium) | ≥ 768px | Tablettes |
| lg (large) | ≥ 992px | Ordinateurs portables |
| xl (extra large) | ≥ 1200px | Écrans larges |
| xxl | ≥ 1400px | Très grands écrans |

---

### Qu'est-ce qu'une PWA (Progressive Web App) ?

**Définition** : Une PWA est une application web qui offre une expérience similaire à une application native : installation sur l'écran d'accueil, fonctionnement hors-ligne, notifications push.

**Le problème que les PWA résolvent** :

| Problème | Solution PWA |
| -------- | ------------ |
| App Store obligatoire | Installation directe depuis le navigateur |
| Développement natif coûteux | Un seul code (web) pour toutes les plateformes |
| Mise à jour lente | Mises à jour automatiques |
| Pas d'accès hors-ligne | Service Worker pour le cache |

**Critères d'une PWA** :

| Critère | Description | Comment l'atteindre |
| ------- | ----------- | ------------------- |
| HTTPS | Site sécurisé | Certificat SSL |
| Manifest | Fichier de configuration | `manifest.json` |
| Service Worker | Script pour le cache et hors-ligne | `sw.js` |
| Responsive | Adapté à tous les écrans | CSS media queries |
| Fast | Chargement rapide | Optimisations |

**Comparaison des approches** :

| Aspect | Site Web | PWA | App Native |
| ------ | -------- | --- | ---------- |
| Installation | Non | Optionnelle | Obligatoire (Store) |
| Hors-ligne | Non | Oui | Oui |
| Notifications | Non | Oui | Oui |
| Accès matériel | Limité | Partiel | Complet |
| Coût développement | Bas | Bas | Élevé (iOS + Android) |
| Distribution | URL | URL | App Store |

---

### Quels sont les frameworks d'applications multiplateformes ?

| Framework | Langage | Plateformes | Usage |
| --------- | ------- | ----------- | ----- |
| **React Native** | JavaScript | iOS, Android | Apps mobiles |
| **Flutter** | Dart | iOS, Android, Web, Desktop | Apps multiplateformes |
| **Electron** | JavaScript | Windows, macOS, Linux | Apps desktop |
| **Tauri** | Rust + JS | Windows, macOS, Linux | Apps desktop légères |
| **Ionic** | JavaScript | iOS, Android, Web | Apps hybrides |
| **Capacitor** | JavaScript | iOS, Android | Wrapper natif pour PWA |

---

## Étapes Pratiques

### Étape 1 : Rendre un site responsive avec CSS

```html
<!-- Viewport obligatoire dans le head -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

```css
/* Mobile first : styles de base pour mobile */
.container {
    padding: 1rem;
}

.card {
    width: 100%;
    margin-bottom: 1rem;
}

/* Tablette et plus */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }

    .card {
        width: 48%;
        display: inline-block;
    }
}

/* Desktop */
@media (min-width: 992px) {
    .container {
        max-width: 960px;
    }

    .card {
        width: 31%;
    }
}
```

---

### Étape 2 : Créer une grille responsive avec Flexbox

```css
.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.grid-item {
    /* Mobile : 1 colonne */
    flex: 1 1 100%;
}

@media (min-width: 768px) {
    .grid-item {
        /* Tablette : 2 colonnes */
        flex: 1 1 calc(50% - 0.5rem);
    }
}

@media (min-width: 992px) {
    .grid-item {
        /* Desktop : 3 colonnes */
        flex: 1 1 calc(33.333% - 0.67rem);
    }
}
```

---

### Étape 3 : Créer le manifest d'une PWA

```json
// public/manifest.json
{
    "name": "Mon Application",
    "short_name": "MonApp",
    "description": "Description de mon application",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3498db",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "/icons/icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

```html
<!-- Dans le head -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#3498db">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
```

---

### Étape 4 : Créer un Service Worker basique

```javascript
// public/sw.js

const CACHE_NAME = 'mon-app-v1';
const urlsToCache = [
    '/',
    '/css/app.css',
    '/js/app.js',
    '/icons/icon-192x192.png'
];

// Installation : mise en cache des fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch : servir depuis le cache si disponible
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - retourner la réponse en cache
                if (response) {
                    return response;
                }
                // Pas en cache - faire la requête réseau
                return fetch(event.request);
            })
    );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
```

```javascript
// Dans votre JS principal : enregistrer le Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW enregistré:', registration);
            })
            .catch((error) => {
                console.log('Erreur SW:', error);
            });
    });
}
```

---

### Étape 5 : Tester le responsive

```bash
# Avec Chrome DevTools
# 1. F12 pour ouvrir les DevTools
# 2. Ctrl+Shift+M pour le mode responsive
# 3. Sélectionner différents appareils dans la liste
```

**Outils de test** :

| Outil | Usage |
| ----- | ----- |
| Chrome DevTools | Simuler différents écrans |
| Firefox Responsive Mode | Simuler différents écrans |
| BrowserStack | Tester sur vrais appareils (payant) |
| Lighthouse | Audit PWA et performance |

---

### Étape 6 : Auditer une PWA avec Lighthouse

```bash
# Dans Chrome DevTools > Lighthouse
# Cocher "Progressive Web App"
# Cliquer "Generate report"
```

**Critères vérifiés** :

| Critère | Requis pour PWA |
| ------- | --------------- |
| HTTPS | Oui |
| Manifest valide | Oui |
| Service Worker | Oui |
| Icône 192x192 | Oui |
| Icône 512x512 | Oui |
| Splash screen | Recommandé |
| Responsive | Recommandé |
| Offline fallback | Recommandé |

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx serve` | Serveur local simple pour tester |
| `lighthouse <url>` | Audit depuis la ligne de commande |
| `workbox generateSW` | Générer un Service Worker optimisé |

---

## Pièges Fréquents

### Piège 1 : Oublier le meta viewport

⚠️ **Problème** : Sans viewport, le mobile affiche la version desktop en miniature.

✅ **Solution** : Toujours inclure `<meta name="viewport" content="width=device-width, initial-scale=1">`.

---

### Piège 2 : Cibles tactiles trop petites

⚠️ **Problème** : Boutons de 20px impossibles à toucher sur mobile.

✅ **Solution** : Cibles tactiles de 44x44px minimum (recommandation Apple/Google).

```css
.button {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 24px;
}
```

---

### Piège 3 : Tester uniquement sur son propre téléphone

⚠️ **Problème** : Le site fonctionne sur iPhone mais pas sur Android.

✅ **Solution** : Tester sur plusieurs appareils/navigateurs (Chrome DevTools, BrowserStack).

---

### Piège 4 : Service Worker qui cache tout indéfiniment

⚠️ **Problème** : Les utilisateurs ne voient jamais les mises à jour.

✅ **Solution** : Stratégie de cache avec version (ex: `mon-app-v2`).

---

## Checklist de Validation

- [ ] Je comprends ce qu'est le responsive design
- [ ] Je connais les breakpoints standards
- [ ] Je sais créer des media queries CSS
- [ ] Je comprends ce qu'est une PWA
- [ ] Je sais créer un manifest.json
- [ ] Je comprends le rôle d'un Service Worker
- [ ] Je sais utiliser Lighthouse pour auditer une PWA

---

## Exercice Pratique

**Énoncé** : Crée une page responsive pour un agenda familial qui doit :

- Afficher les événements sur 1 colonne sur mobile
- Afficher sur 2 colonnes sur tablette
- Afficher sur 3 colonnes sur desktop
- Avoir des cartes cliquables de minimum 44px de hauteur

**Résultat attendu** : Code HTML + CSS responsive.

---

## Solution de l'Exercice

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Agenda Familial</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            padding: 1rem;
            background: #f5f5f5;
        }

        h1 {
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }

        .events-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .event-card {
            background: white;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 44px; /* Cible tactile minimum */
            flex: 1 1 100%; /* Mobile : 1 colonne */
            cursor: pointer;
            transition: transform 0.2s;
        }

        .event-card:hover {
            transform: translateY(-2px);
        }

        .event-card h2 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .event-card .date {
            color: #666;
            font-size: 0.9rem;
        }

        .event-card .participant {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-top: 0.5rem;
        }

        /* Tablette : 2 colonnes */
        @media (min-width: 768px) {
            h1 {
                font-size: 2rem;
            }

            .event-card {
                flex: 1 1 calc(50% - 0.5rem);
            }
        }

        /* Desktop : 3 colonnes */
        @media (min-width: 992px) {
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }

            .event-card {
                flex: 1 1 calc(33.333% - 0.67rem);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Agenda Familial</h1>
        <div class="events-grid">
            <article class="event-card">
                <h2>Réunion parents d'élèves</h2>
                <p class="date">Lundi 15 janvier - 18h00</p>
                <span class="participant">Maman</span>
            </article>
            <article class="event-card">
                <h2>Cours de piano</h2>
                <p class="date">Mercredi 17 janvier - 14h00</p>
                <span class="participant">Emma</span>
            </article>
            <article class="event-card">
                <h2>Match de foot</h2>
                <p class="date">Samedi 20 janvier - 10h00</p>
                <span class="participant">Lucas</span>
            </article>
            <article class="event-card">
                <h2>Anniversaire Mamie</h2>
                <p class="date">Dimanche 21 janvier - 12h00</p>
                <span class="participant">Toute la famille</span>
            </article>
            <article class="event-card">
                <h2>Rendez-vous médecin</h2>
                <p class="date">Mardi 23 janvier - 09h30</p>
                <span class="participant">Papa</span>
            </article>
            <article class="event-card">
                <h2>Sortie cinéma</h2>
                <p class="date">Samedi 27 janvier - 15h00</p>
                <span class="participant">Emma + Lucas</span>
            </article>
        </div>
    </div>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[BC04 - 03 - Les Tests et la Qualité Logicielle](03-tests-qualite-logicielle.md)**
