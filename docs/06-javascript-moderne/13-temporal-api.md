---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Comprendre les limites de Date, manipuler les dates avec l'API Temporal (PlainDate, ZonedDateTime, Duration), l'immutabilité et les fuseaux horaires."
estimated_time: "75 min"
fiche_number: 13
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 13 - Temporal API (la nouvelle gestion des dates)

> **En bref** : Fiche de perfectionnement (après le projet intégrateur). Comprendre pourquoi l'objet `Date` historique pose problème, et découvrir l'API Temporal (`Temporal.Now`, `PlainDate`, `ZonedDateTime`, `Duration`) qui apporte des objets de date immuables, sûrs et adaptés aux fuseaux horaires. Lecture estimée : 75 min.

## Prérequis

- Fiche 06 : [Classes ES6](06-classes-es6.md)
- Fiche 10 : [Async/await](10-async-await.md)
- Fiche 12 : [Projet intégrateur](12-projet-integrateur.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les limites de l'objet `Date`, installer et activer le polyfill Temporal, créer des dates immuables avec `Temporal.PlainDate` et `Temporal.ZonedDateTime`, calculer des durées avec `Temporal.Duration`, et choisir le bon type Temporal selon le besoin.

---

## Concepts

### Qu'est-ce que l'API Temporal ?

**Définition** : L'API Temporal est un ensemble standardisé d'objets JavaScript dédiés à la manipulation des dates et des heures. Elle est conçue pour remplacer l'objet `Date` historique, qui présente de nombreux défauts. Temporal fournit des objets immuables (qui ne changent jamais après leur création) et explicites (tu choisis si tu travailles avec ou sans fuseau horaire).

**Le problème que Temporal résout** :

L'objet `Date` existe depuis 1995 et a été copié sur une vieille bibliothèque Java, elle-même abandonnée depuis. Sans Temporal, voici les problèmes rencontrés avec `Date` :

1. **Mutabilité dangereuse** : un objet `Date` peut être modifié sur place. Une fonction qui reçoit une `Date` peut la changer sans que tu le saches, ce qui crée des bugs difficiles à trouver.
2. **Mois comptés à partir de 0** : dans `Date`, janvier est le mois `0` et décembre le mois `11`. C'est une source d'erreurs constante.
3. **Pas de gestion claire des fuseaux horaires** : `Date` ne stocke qu'un instant en temps universel (UTC) plus le fuseau local de la machine. Travailler avec un fuseau précis (Tokyo, New York) est très compliqué.
4. **Parsing imprévisible** : `new Date("2026-03-15")` et `new Date("03/15/2026")` peuvent donner des résultats différents selon le navigateur ou le système.

**Comment Temporal résout ces problèmes** :

| Problème | Solution apportée par Temporal |
| -------- | ------------------------------ |
| Mutabilité dangereuse | Tous les objets Temporal sont immuables ; chaque opération renvoie un nouvel objet |
| Mois comptés à partir de 0 | Les mois vont de `1` (janvier) à `12` (décembre) |
| Pas de gestion des fuseaux | `ZonedDateTime` stocke explicitement le fuseau horaire (`Europe/Paris`, `Asia/Tokyo`) |
| Parsing imprévisible | Format unique et strict basé sur la norme ISO 8601 |

**Analogie concrète** : L'objet `Date`, c'est comme une montre unique que tu prêtes à tout le monde. Si un collègue avance les aiguilles, tout le monde voit la mauvaise heure, car c'est la même montre physique. Temporal, c'est comme distribuer une photo de l'heure à chacun : si quelqu'un veut une autre heure, il prend une nouvelle photo, mais l'originale reste intacte. Personne ne peut casser l'heure des autres.

**Ce que Temporal n'est PAS** :

- Temporal n'est pas une bibliothèque externe comme Moment.js ou date-fns. C'est une API standardisée du langage JavaScript lui-même (stade 4 TC39 depuis mars 2026, publication ECMAScript attendue en 2027) et déjà disponible nativement dans Chrome 144+, Firefox 139+ et Node.js 26.
- Temporal n'est pas un remplacement automatique de `Date`. Le code existant qui utilise `Date` continue de fonctionner. Tu choisis Temporal pour les nouveaux développements.
- Temporal n'est pas un objet unique. C'est une famille d'objets (`PlainDate`, `PlainTime`, `ZonedDateTime`, `Duration`, etc.), chacun pour un usage précis.

---

### Le statut de Temporal (important)

**Définition** : Temporal est une API standardisée du langage JavaScript, adoptée par le comité TC39 au **stade 4** (stage 4) le 11 mars 2026. Le stade 4 signifie que la spécification est figée et intégrée au brouillon ECMA-262. La liste officielle des propositions terminées (consultée le 13 août 2026) indique une **année de publication ECMAScript attendue : 2027**, pas 2026.

| Statut | Signification |
| ------ | ------------- |
| Stade de la proposition | Stage 4 (11 mars 2026) |
| Cible de standardisation | Publication ECMAScript attendue en 2027 (liste TC39 finished-proposals, 13 août 2026) |
| Support natif Chrome 144+ | Oui, sans flag (depuis janvier 2026) |
| Support natif Firefox 139+ | Oui, sans flag (depuis mai 2025) |
| Support natif Edge 144+ | Oui, sans flag |
| Support natif Safari | Partiel (Technology Preview) - support complet attendu fin 2026 |
| Support natif Node.js 26 | Oui, sans flag (depuis mai 2026) |
| Support natif Node.js 24 | Derrière `--harmony-temporal` |
| Support natif Node.js 22 LTS | Non |
| Solution recommandée sur Node.js 22 | Le polyfill officiel `@js-temporal/polyfill` |

**Règle pour ce cursus** : ce cursus cible Node.js 22 LTS, qui n'expose pas encore Temporal nativement. Tu vas donc utiliser le polyfill officiel `@js-temporal/polyfill`. Un polyfill est un paquet qui ajoute une fonctionnalité manquante en la réimplémentant. L'API du polyfill est identique à l'API native : ton code restera valide sans modification sur Node.js 26+ ou dans Chrome 144+.

---

### Les principaux objets Temporal

**Définition** : Temporal sépare les concepts qui étaient mélangés dans `Date`. Chaque objet a une responsabilité unique.

| Objet | Contient | Exemple d'usage |
| ----- | -------- | --------------- |
| `Temporal.Now` | Point d'entrée pour obtenir l'instant courant | Récupérer la date du jour |
| `Temporal.PlainDate` | Une date sans heure ni fuseau (année, mois, jour) | Une date d'anniversaire |
| `Temporal.PlainTime` | Une heure sans date ni fuseau | Une heure d'ouverture (09:00) |
| `Temporal.PlainDateTime` | Une date et une heure, sans fuseau | Un rendez-vous local, sans préciser le fuseau |
| `Temporal.ZonedDateTime` | Une date, une heure ET un fuseau horaire | Un événement précis (réunion à 14h à Paris) |
| `Temporal.Duration` | Une durée (jours, heures, minutes) | "3 jours et 2 heures" |
| `Temporal.Instant` | Un instant précis sur la ligne du temps (UTC) | Un horodatage technique (log) |

**Analogie concrète** : Imagine une fiche de rendez-vous chez le médecin. La date "15 mars" sans heure, c'est un `PlainDate`. L'heure "14:00" seule, c'est un `PlainTime`. "15 mars à 14:00" écrit sur la fiche, c'est un `PlainDateTime`. Mais si tu prends l'avion et que ce rendez-vous est "15 mars à 14:00 à Tokyo", il te faut un `ZonedDateTime` pour savoir à quel moment réel cela correspond chez toi.

**Ce que `PlainDate` n'est PAS** :

- Un `PlainDate` n'est pas un instant universel. Il ne sait pas à quelle heure UTC il correspond, car il n'a ni heure ni fuseau. C'est une date "sur le calendrier", comme une case dans un agenda papier.
- Un `PlainDate` n'est pas un `ZonedDateTime`. Pour passer de l'un à l'autre, tu dois fournir explicitement une heure et un fuseau.

**Comparaison `Date` vs Temporal** :

| Objet `Date` | API Temporal |
| ------------ | ------------ |
| Mutable (modifiable sur place) | Immuable (chaque opération crée un nouvel objet) |
| Mois de 0 à 11 | Mois de 1 à 12 |
| Un seul type pour tout | Un type par usage précis |
| Fuseau implicite (machine) | Fuseau explicite avec `ZonedDateTime` |
| Méthodes `setX()` qui modifient | Méthodes `withX()` qui renvoient une copie |

---

### L'immutabilité, en pratique

**Définition** : Un objet immuable ne peut jamais être modifié après sa création. Pour "changer" une valeur, tu crées un nouvel objet à partir de l'ancien. C'est le principe central de Temporal.

Avec `Date`, une méthode comme `setMonth()` modifie l'objet existant :

```javascript
// Comportement de Date : MUTATION (l'objet change sur place)
const dateAncienne = new Date(2026, 0, 15); // 15 janvier 2026 (mois 0 = janvier)
dateAncienne.setMonth(5); // L'objet dateAncienne est MODIFIE
console.log(dateAncienne.getMonth()); // 5 (juin) -- l'original a changé !
```

Avec Temporal, l'objet d'origine reste intact :

```javascript
import { Temporal } from "@js-temporal/polyfill";

// Comportement de Temporal : IMMUTABILITE (un nouvel objet est créé)
const dateOrigine = Temporal.PlainDate.from("2026-01-15"); // 15 janvier 2026
const dateModifiee = dateOrigine.with({ month: 6 }); // Renvoie un NOUVEL objet

console.log(dateOrigine.month); // 1 (janvier) -- inchangé
console.log(dateModifiee.month); // 6 (juin) -- nouvel objet
```

**Règle** : avec Temporal, retiens que toute méthode commençant par `with`, `add`, `subtract` ou `round` renvoie un **nouvel** objet. L'objet d'origine n'est jamais modifié.

---

## Étapes Pratiques

### Étape 1 : Installer le polyfill Temporal

Crée un dossier de travail et installe le polyfill officiel.

```bash
# Créer le dossier de travail et s'y placer
mkdir -p ~/js-moderne/temporal
cd ~/js-moderne/temporal
```

Crée un fichier `package.json` minimal :

```json
{
  "name": "demo-temporal",
  "version": "1.0.0",
  "type": "module"
}
```

Installe le polyfill :

```bash
npm install @js-temporal/polyfill
```

**Résultat attendu** :

```text
added 2 packages, and audited 3 packages in 2s

found 0 vulnerabilities
```

---

### Étape 2 : Obtenir la date et l'heure courantes

Crée le fichier `13-temporal.mjs` :

```javascript
// Import du polyfill -- expose l'objet Temporal
import { Temporal } from "@js-temporal/polyfill";

// Temporal.Now est le point d'entrée pour "maintenant"

// Date du jour (sans heure ni fuseau)
const aujourdhui = Temporal.Now.plainDateISO();
console.log("Date du jour :", aujourdhui.toString());

// Heure courante (sans date ni fuseau)
const maintenant = Temporal.Now.plainTimeISO();
console.log("Heure courante :", maintenant.toString());

// Date et heure dans un fuseau précis
const aParis = Temporal.Now.zonedDateTimeISO("Europe/Paris");
console.log("À Paris :", aParis.toString());

// Accéder aux composants individuels (mois de 1 à 12)
console.log("Année :", aujourdhui.year);
console.log("Mois :", aujourdhui.month); // 1 = janvier, 12 = décembre
console.log("Jour :", aujourdhui.day);
```

```bash
node ~/js-moderne/temporal/13-temporal.mjs
```

**Résultat attendu** (les valeurs dépendent du jour et de l'heure d'exécution) :

```text
Date du jour : 2026-05-27
Heure courante : 14:32:08.123456789
À Paris : 2026-05-27T14:32:08.123456789+02:00[Europe/Paris]
Année : 2026
Mois : 5
Jour : 27
```

---

### Étape 3 : Créer des dates explicites avec PlainDate

Remplace le contenu de `13-temporal.mjs` par le code suivant :

```javascript
import { Temporal } from "@js-temporal/polyfill";

// Créer une date depuis une chaîne ISO 8601 (format strict et unique)
const noel = Temporal.PlainDate.from("2026-12-25");
console.log("Noël :", noel.toString());

// Créer une date depuis un objet (mois lisible : 12 = décembre)
const anniversaire = Temporal.PlainDate.from({
  year: 2026,
  month: 7, // juillet -- pas de piège du mois 0
  day: 14,
});
console.log("Anniversaire :", anniversaire.toString());

// Obtenir le jour de la semaine (1 = lundi, 7 = dimanche)
console.log("Jour de la semaine de Noël :", noel.dayOfWeek);

// Nombre de jours dans le mois
console.log("Jours en décembre :", noel.daysInMonth);

// L'année est-elle bissextile ?
console.log("2026 bissextile ?", noel.inLeapYear);

// Formater pour un humain (locale française)
console.log("Format FR :", noel.toLocaleString("fr-FR", { dateStyle: "long" }));
```

```bash
node ~/js-moderne/temporal/13-temporal.mjs
```

**Résultat attendu** :

```text
Noël : 2026-12-25
Anniversaire : 2026-07-14
Jour de la semaine de Noël : 5
Jours en décembre : 31
2026 bissextile ? false
Format FR : 25 décembre 2026
```

---

### Étape 4 : Calculer avec Duration (ajouter et soustraire)

Remplace le contenu de `13-temporal.mjs` par le code suivant :

```javascript
import { Temporal } from "@js-temporal/polyfill";

const depart = Temporal.PlainDate.from("2026-01-01");

// add() renvoie un NOUVEL objet -- depart reste inchangé
const dansTroisMois = depart.add({ months: 3 });
console.log("Départ :", depart.toString()); // inchangé : 2026-01-01
console.log("Dans 3 mois :", dansTroisMois.toString());

// Soustraire une durée
const ilYaDixJours = depart.subtract({ days: 10 });
console.log("10 jours avant :", ilYaDixJours.toString());

// Créer une durée explicite avec Temporal.Duration
const duree = Temporal.Duration.from({ days: 7, hours: 12 });
console.log("Durée :", duree.toString()); // P7DT12H (format ISO)

// Mesurer l'écart entre deux dates avec until()
const finProjet = Temporal.PlainDate.from("2026-06-15");
const ecart = depart.until(finProjet, { largestUnit: "month" });
console.log("Écart départ -> fin :", ecart.toString());
console.log(`Soit ${ecart.months} mois et ${ecart.days} jours`);
```

```bash
node ~/js-moderne/temporal/13-temporal.mjs
```

**Résultat attendu** :

```text
Départ : 2026-01-01
Dans 3 mois : 2026-04-01
10 jours avant : 2025-12-22
Durée : P7DT12H
Écart départ -> fin : P5M14D
Soit 5 mois et 14 jours
```

---

### Étape 5 : Travailler avec les fuseaux horaires (ZonedDateTime)

Remplace le contenu de `13-temporal.mjs` par le code suivant :

```javascript
import { Temporal } from "@js-temporal/polyfill";

// Une réunion à 14h00 à Paris le 15 mars 2026
const reunionParis = Temporal.ZonedDateTime.from({
  timeZone: "Europe/Paris",
  year: 2026,
  month: 3,
  day: 15,
  hour: 14,
  minute: 0,
});
console.log("Réunion à Paris :", reunionParis.toString());

// À quelle heure correspond cette réunion à Tokyo ?
const reunionTokyo = reunionParis.withTimeZone("Asia/Tokyo");
console.log("Même instant à Tokyo :", reunionTokyo.toString());

// À New York ?
const reunionNewYork = reunionParis.withTimeZone("America/New_York");
console.log("Même instant à New York :", reunionNewYork.toString());

// Le décalage horaire de Paris ce jour-là
console.log("Décalage Paris :", reunionParis.offset);

// Ajouter 25 heures gère automatiquement le changement d'heure (DST)
const plusTard = reunionParis.add({ hours: 25 });
console.log("25 heures plus tard à Paris :", plusTard.toString());
```

```bash
node ~/js-moderne/temporal/13-temporal.mjs
```

**Résultat attendu** :

```text
Réunion à Paris : 2026-03-15T14:00:00+01:00[Europe/Paris]
Même instant à Tokyo : 2026-03-15T22:00:00+09:00[Asia/Tokyo]
Même instant à New York : 2026-03-15T09:00:00-04:00[America/New_York]
Décalage Paris : +01:00
25 heures plus tard à Paris : 2026-03-16T15:00:00+01:00[Europe/Paris]
```

---

### Étape 6 : Comparer et trier des dates

Remplace le contenu de `13-temporal.mjs` par le code suivant :

```javascript
import { Temporal } from "@js-temporal/polyfill";

const dateA = Temporal.PlainDate.from("2026-05-10");
const dateB = Temporal.PlainDate.from("2026-05-20");

// Temporal.PlainDate.compare renvoie -1, 0 ou 1
const resultat = Temporal.PlainDate.compare(dateA, dateB);
console.log("Comparaison A vs B :", resultat); // -1 (A est avant B)

// Égalité avec equals()
console.log("A égale B ?", dateA.equals(dateB)); // false

// Trier un tableau de dates avec la fonction compare
const dates = [
  Temporal.PlainDate.from("2026-12-25"),
  Temporal.PlainDate.from("2026-01-01"),
  Temporal.PlainDate.from("2026-07-14"),
];

const triees = [...dates].sort(Temporal.PlainDate.compare);
console.log("Dates triées :");
triees.forEach((d) => console.log(`  ${d.toString()}`));
```

```bash
node ~/js-moderne/temporal/13-temporal.mjs
```

**Résultat attendu** :

```text
Comparaison A vs B : -1
A égale B ? false
Dates triées :
  2026-01-01
  2026-07-14
  2026-12-25
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm install @js-temporal/polyfill` | Installe le polyfill Temporal |
| `Temporal.Now.plainDateISO()` | Date du jour (sans heure) |
| `Temporal.Now.zonedDateTimeISO("Europe/Paris")` | Date et heure dans un fuseau |
| `Temporal.PlainDate.from("2026-12-25")` | Crée une date depuis une chaîne ISO |
| `date.with({ month: 6 })` | Renvoie une copie avec le mois changé |
| `date.add({ days: 7 })` | Renvoie une copie 7 jours plus tard |
| `date.subtract({ months: 1 })` | Renvoie une copie 1 mois plus tôt |
| `date.until(autreDate)` | Renvoie la `Duration` entre deux dates |
| `Temporal.PlainDate.compare(a, b)` | Renvoie -1, 0 ou 1 pour le tri |
| `zoned.withTimeZone("Asia/Tokyo")` | Convertit vers un autre fuseau |
| `date.toLocaleString("fr-FR")` | Formate pour un humain |

---

## Pièges Fréquents

### Piège 1 : Croire que Temporal est disponible partout nativement

⚠️ **Problème** : Tu écris `Temporal.Now.plainDateISO()` sans import et tu obtiens `ReferenceError: Temporal is not defined`. Bien que Temporal soit natif dans Chrome 144+, Firefox 139+ et Node.js 26+, il n'est pas disponible par défaut dans Node.js 22 LTS ni dans Safari (fin 2026 attendue).

✅ **Solution** : Importe le polyfill officiel si tu cibles Node.js 22, Safari ou les navigateurs non mis à jour.

```javascript
// ❌ Sans import : Temporal n'existe pas encore
const d = Temporal.Now.plainDateISO(); // ReferenceError

// ✅ Avec le polyfill
import { Temporal } from "@js-temporal/polyfill";
const d2 = Temporal.Now.plainDateISO(); // fonctionne
```

---

### Piège 2 : Vouloir modifier un objet Temporal sur place

⚠️ **Problème** : Tu cherches une méthode `setMonth()` comme sur `Date`, ou tu penses que `add()` modifie l'objet d'origine. Les objets Temporal sont immuables : ils n'ont aucune méthode qui modifie l'objet.

✅ **Solution** : Récupère la valeur de retour des méthodes `with`, `add` et `subtract` dans une nouvelle variable.

```javascript
// ❌ La valeur de retour est ignorée, date ne change pas
const date = Temporal.PlainDate.from("2026-01-01");
date.add({ days: 5 }); // le résultat est perdu
console.log(date.toString()); // toujours 2026-01-01

// ✅ On stocke le nouvel objet retourné
const plusTard = date.add({ days: 5 });
console.log(plusTard.toString()); // 2026-01-06
```

---

### Piège 3 : Confondre PlainDateTime et ZonedDateTime

⚠️ **Problème** : Tu utilises `PlainDateTime` pour un événement international, puis tu es surpris que le calcul de décalage horaire ne fonctionne pas. Un `PlainDateTime` n'a pas de fuseau : il ne sait pas à quel instant réel il correspond.

✅ **Solution** : Utilise `ZonedDateTime` dès qu'un fuseau horaire compte (réunions, vols, événements internationaux). Réserve `PlainDateTime` aux dates locales sans ambiguïté de fuseau.

```javascript
// ❌ Pas de fuseau : impossible de convertir vers Tokyo
const sansF = Temporal.PlainDateTime.from("2026-03-15T14:00");
// sansF.withTimeZone(...) n'existe pas

// ✅ Avec fuseau : conversion possible
const avecF = Temporal.ZonedDateTime.from({
  timeZone: "Europe/Paris",
  year: 2026, month: 3, day: 15, hour: 14,
});
console.log(avecF.withTimeZone("Asia/Tokyo").toString());
```

---

### Piège 4 : Mélanger des types Temporal incompatibles

⚠️ **Problème** : Tu compares ou soustrais un `PlainDate` avec un `ZonedDateTime`, et tu obtiens une erreur `RangeError`. Temporal refuse les opérations entre types incompatibles, ce qui est volontaire pour éviter les bugs silencieux.

✅ **Solution** : Convertis explicitement vers un type commun avant de comparer. Par exemple, extrais le `PlainDate` d'un `ZonedDateTime` avec `.toPlainDate()`.

```javascript
const jour = Temporal.PlainDate.from("2026-03-15");
const evenement = Temporal.Now.zonedDateTimeISO("Europe/Paris");

// ❌ Types incompatibles
// Temporal.PlainDate.compare(jour, evenement); // RangeError

// ✅ On ramène le ZonedDateTime à un PlainDate
const jourEvenement = evenement.toPlainDate();
console.log(Temporal.PlainDate.compare(jour, jourEvenement));
```

---

## Checklist de Validation

- [ ] Je sais citer au moins trois défauts de l'objet `Date`
- [ ] Je sais que Temporal est au stade 4 depuis mars 2026 (publication ECMAScript attendue en 2027) et nécessite encore un polyfill sur Node.js 22
- [ ] Je sais installer et importer `@js-temporal/polyfill`
- [ ] Je sais que les objets Temporal sont immuables
- [ ] Je sais créer une `PlainDate` depuis une chaîne ISO et depuis un objet
- [ ] Je sais ajouter et soustraire des durées avec `add()` et `subtract()`
- [ ] Je sais utiliser `ZonedDateTime` pour gérer les fuseaux horaires
- [ ] Je sais comparer et trier des dates avec `Temporal.PlainDate.compare`
- [ ] Je sais pourquoi éviter `Date` dans les nouveaux projets

---

## Exercice Pratique

**Énoncé** : Crée un planificateur de visioconférences internationales.

1. Crée un fichier `exercice-temporal.mjs` qui importe le polyfill.
2. Définis une réunion avec `ZonedDateTime` : le 10 juin 2026 à 09:00, fuseau `Europe/Paris`.
3. Crée une fonction `afficherDansFuseaux(reunion, fuseaux)` qui affiche l'heure de cette réunion dans une liste de fuseaux (par exemple `Asia/Tokyo`, `America/New_York`, `Australia/Sydney`).
4. Crée une fonction `compteARebours(reunion)` qui calcule la durée restante entre maintenant (`Temporal.Now`) et la réunion, et l'affiche en jours et heures.
5. Affiche un récapitulatif clair.

**Indications** :

- Utilise `reunion.withTimeZone(fuseau)` pour convertir l'heure.
- Utilise `Temporal.Now.zonedDateTimeISO("Europe/Paris")` pour l'instant courant.
- Utilise `until()` avec `{ largestUnit: "day" }` pour la durée restante.
- Pense à l'immutabilité : chaque conversion renvoie un nouvel objet.

**Résultat attendu** (les valeurs du compte à rebours dépendent du jour d'exécution) :

```text
=== Réunion internationale ===
Référence (Paris) : 2026-06-10T09:00:00+02:00[Europe/Paris]

Heures locales :
  Asia/Tokyo       : 2026-06-10T16:00:00+09:00[Asia/Tokyo]
  America/New_York : 2026-06-10T03:00:00-04:00[America/New_York]
  Australia/Sydney : 2026-06-10T17:00:00+10:00[Australia/Sydney]

Compte à rebours : 14 jours et 18 heures
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
import { Temporal } from "@js-temporal/polyfill";

// Réunion de référence : 10 juin 2026 à 09:00, fuseau Paris
const reunion = Temporal.ZonedDateTime.from({
  timeZone: "Europe/Paris",
  year: 2026,
  month: 6,
  day: 10,
  hour: 9,
  minute: 0,
});

// Afficher l'heure de la réunion dans plusieurs fuseaux
function afficherDansFuseaux(reunionRef, fuseaux) {
  console.log("\nHeures locales :");
  for (const fuseau of fuseaux) {
    // withTimeZone renvoie un NOUVEL objet (immutabilité)
    const locale = reunionRef.withTimeZone(fuseau);
    // padEnd aligne les noms de fuseaux pour un affichage propre
    console.log(`  ${fuseau.padEnd(16)} : ${locale.toString()}`);
  }
}

// Calculer la durée restante avant la réunion
function compteARebours(reunionRef) {
  // Instant courant dans le même fuseau que la référence
  const maintenant = Temporal.Now.zonedDateTimeISO("Europe/Paris");

  // until() renvoie une Duration ; largestUnit "day" regroupe en jours + heures
  const restant = maintenant.until(reunionRef, { largestUnit: "day" });

  return `${restant.days} jours et ${restant.hours} heures`;
}

function main() {
  console.log("=== Réunion internationale ===");
  console.log(`Référence (Paris) : ${reunion.toString()}`);

  afficherDansFuseaux(reunion, [
    "Asia/Tokyo",
    "America/New_York",
    "Australia/Sydney",
  ]);

  console.log(`\nCompte à rebours : ${compteARebours(reunion)}`);
}

main();
```

---

## Navigation

← Fiche précédente : **[Projet intégrateur](12-projet-integrateur.md)**

→ Fiche suivante : **[AbortController et annulation](14-abortcontroller.md)**
