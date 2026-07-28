---
tags:
  - JavaScript
  - Intermédiaire
  - Projet
description: "Projet intégrateur : créer une application Node.js de gestion de contacts utilisant toutes les fonctionnalités ES6+."
estimated_time: "120 min"
fiche_number: 12
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 12 - Projet intégrateur

> **En bref** : Créer une application Node.js complète de gestion de contacts en utilisant toutes les fonctionnalités ES6+ apprises : modules, classes, destructuring, async/await, Map, itérateurs et plus encore. Les deux fiches de perfectionnement qui suivent (Temporal et AbortController) approfondissent ensuite des API modernes complémentaires. Lecture estimée : 120 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Fiche 03 : [Destructuring et spread](03-destructuring-spread.md)
- Fiche 04 : [Template literals et nouvelles méthodes](04-template-literals-methodes.md)
- Fiche 05 : [Modules ES (import/export)](05-modules-es.md)
- Fiche 06 : [Classes ES6](06-classes-es6.md)
- Fiche 07 : [Symboles, Map et Set](07-symboles-map-set.md)
- Fiche 08 : [Itérateurs et générateurs](08-iterateurs-generateurs.md)
- Fiche 09 : [Promises](09-promises.md)
- Fiche 10 : [Async/await](10-async-await.md)
- Fiche 11 : [Fetch API et HTTP](11-fetch-api-http.md)

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé une application Node.js complète de gestion de contacts qui lit et écrit dans un fichier JSON, utilise des classes, des modules ES, du destructuring, des template literals, des Map/Set, des itérateurs, et du code asynchrone avec `async`/`await`.

---

## Concepts

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur est un exercice qui combine toutes les compétences apprises dans un cursus pour construire une application complète et fonctionnelle. Chaque fonctionnalité ES6+ apprise dans les fiches précédentes est mise en pratique dans un contexte réaliste.

**Le problème que le projet intégrateur résout** :

Sans projet intégrateur, voici les problèmes rencontrés :

1. **Connaissances isolées** : tu connais chaque fonctionnalité séparément, mais tu ne sais pas comment les combiner.
2. **Manque de pratique réaliste** : les petits exemples des fiches ne reflètent pas la complexité d'un vrai projet.
3. **Confiance insuffisante** : sans avoir construit quelque chose de complet, tu doutes de ta capacité à utiliser ES6+ dans un vrai projet.

**Comment le projet intégrateur résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Connaissances isolées | Toutes les fonctionnalités sont utilisées ensemble |
| Manque de pratique | Un projet complet avec plusieurs fichiers |
| Confiance insuffisante | Un résultat concret et fonctionnel |

**Analogie concrète** : Chaque fiche précédente t'a appris à utiliser un outil : marteau, tournevis, scie, mètre. Le projet intégrateur, c'est construire une étagère complète en utilisant tous ces outils ensemble. Tu découvres comment ils s'articulent et tu gagnes en assurance.

---

### Correspondance fiches / fonctionnalités du projet

Ce tableau montre où chaque fonctionnalité ES6+ est utilisée dans le projet :

| Fiche | Fonctionnalité | Utilisation dans le projet |
| ----- | -------------- | -------------------------- |
| 01 | `let`, `const`, portée | Variables locales, constantes de configuration |
| 02 | Arrow functions | Callbacks, méthodes courtes |
| 03 | Destructuring, spread | Extraction de propriétés, copie d'objets |
| 04 | Template literals | Affichage formaté, messages |
| 05 | Modules ES | Architecture multi-fichiers (import/export) |
| 06 | Classes | Modèle `Contact`, gestionnaire `Repertoire` |
| 07 | Map, Set | Index de recherche, tags uniques |
| 08 | Itérateurs | Parcours personnalisé du répertoire |
| 09 | Promises | Opérations de lecture/écriture de fichiers |
| 10 | Async/await | Toutes les opérations asynchrones |
| 11 | Fetch API | Bonus : export des contacts vers un serveur (optionnel - voir note ci-dessous) |

> **Note sur la fiche 11 (Fetch API)** : Ce projet est une application Node.js CLI. En environnement offline, il n'y a pas de serveur distant disponible pour appeler `fetch()`. L'utilisation de la Fetch API reste en bonus pour les apprenants qui souhaitent tester l'export vers un serveur local ou un service de test. Les fiches 01 à 10 couvrent toutes les fonctionnalités essentielles du projet.

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

Crée l'arborescence du projet :

```bash
mkdir -p ~/js-moderne/projet-contacts
cd ~/js-moderne/projet-contacts
```

Le projet contiendra les fichiers suivants :

```text
projet-contacts/
├── package.json        # Configuration Node.js (type: module)
├── donnees.json        # Fichier de données des contacts
├── contact.mjs         # Classe Contact
├── repertoire.mjs      # Classe Repertoire (gestion des contacts)
├── stockage.mjs        # Lecture/écriture du fichier JSON
├── affichage.mjs       # Fonctions d'affichage formaté
└── main.mjs            # Point d'entrée de l'application
```

Crée le fichier `package.json` :

```json
{
  "name": "projet-contacts",
  "version": "1.0.0",
  "type": "module",
  "description": "Gestionnaire de contacts ES6+"
}
```

Crée le fichier de données initial `donnees.json` :

```json
{
  "contacts": [
    {
      "id": 1,
      "prenom": "Alice",
      "nom": "Dupont",
      "email": "alice.dupont@example.com",
      "telephone": "06 12 34 56 78",
      "tags": ["famille", "paris"],
      "dateCreation": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "prenom": "Bob",
      "nom": "Martin",
      "email": "bob.martin@example.com",
      "telephone": "06 98 76 54 32",
      "tags": ["travail", "dev"],
      "dateCreation": "2025-02-20T14:00:00.000Z"
    },
    {
      "id": 3,
      "prenom": "Charlie",
      "nom": "Durand",
      "email": "charlie.durand@example.com",
      "telephone": "07 11 22 33 44",
      "tags": ["travail", "paris", "dev"],
      "dateCreation": "2025-03-10T09:15:00.000Z"
    }
  ]
}
```

```bash
# Vérifier la structure
ls ~/js-moderne/projet-contacts/
```

**Résultat attendu** :

```text
donnees.json  package.json
```

---

### Étape 2 : Classe Contact (fiche 06 -- classes, fiche 03 -- destructuring, fiche 07 -- Set)

Crée le fichier `contact.mjs` :

```javascript
// Classe Contact -- utilise les classes ES6, le destructuring et Set
// Fonctionnalités ES6+ : class, #private, destructuring, Set, spread, template literals

export class Contact {
  // Champs privés (ES2022) -- ne sont pas accessibles depuis l'extérieur
  #id;
  #prenom;
  #nom;
  #email;
  #telephone;
  #tags; // Set pour éviter les doublons
  #dateCreation;

  // Le constructeur utilise le destructuring pour extraire les propriétés
  constructor({ id, prenom, nom, email, telephone = "", tags = [], dateCreation = null }) {
    this.#id = id;
    this.#prenom = prenom;
    this.#nom = nom;
    this.#email = email;
    this.#telephone = telephone;
    this.#tags = new Set(tags); // Conversion du tableau en Set (pas de doublons)
    this.#dateCreation = dateCreation ? new Date(dateCreation) : new Date();
  }

  // Getters -- accès en lecture seule aux champs privés
  get id() {
    return this.#id;
  }

  get prenom() {
    return this.#prenom;
  }

  get nom() {
    return this.#nom;
  }

  get nomComplet() {
    // Template literal (fiche 04)
    return `${this.#prenom} ${this.#nom}`;
  }

  get email() {
    return this.#email;
  }

  get telephone() {
    return this.#telephone;
  }

  get tags() {
    // Retourne un tableau (copie) à partir du Set
    return [...this.#tags];
  }

  get dateCreation() {
    return this.#dateCreation;
  }

  // Méthodes pour gérer les tags
  ajouterTag(tag) {
    // Set.add() ignore automatiquement les doublons
    this.#tags.add(tag.toLowerCase());
  }

  supprimerTag(tag) {
    this.#tags.delete(tag.toLowerCase());
  }

  aTag(tag) {
    return this.#tags.has(tag.toLowerCase());
  }

  // Mettre à jour les informations du contact
  // Utilise le spread operator pour fusionner les données (fiche 03)
  mettreAJour({ prenom, nom, email, telephone }) {
    if (prenom !== undefined) this.#prenom = prenom;
    if (nom !== undefined) this.#nom = nom;
    if (email !== undefined) this.#email = email;
    if (telephone !== undefined) this.#telephone = telephone;
  }

  // Convertir en objet simple (pour la sérialisation JSON)
  versObjet() {
    return {
      id: this.#id,
      prenom: this.#prenom,
      nom: this.#nom,
      email: this.#email,
      telephone: this.#telephone,
      tags: [...this.#tags], // Spread du Set vers un tableau
      dateCreation: this.#dateCreation.toISOString(),
    };
  }

  // Affichage formaté avec template literals (fiche 04)
  toString() {
    const tagsStr = this.#tags.size > 0
      ? `[${[...this.#tags].join(", ")}]`
      : "[aucun tag]";
    return `#${this.#id} ${this.nomComplet} | ${this.#email} | ${this.#telephone || "pas de tél."} | ${tagsStr}`;
  }

  // Méthode statique pour créer un Contact à partir d'un objet JSON
  static depuis(donnees) {
    return new Contact(donnees);
  }
}
```

---

### Étape 3 : Module de stockage (fiche 05 -- modules, fiche 10 -- async/await, fiche 09 -- Promises)

Crée le fichier `stockage.mjs` :

```javascript
// Module de stockage -- lecture/écriture du fichier JSON
// Fonctionnalités ES6+ : modules (import/export), async/await, Promises, template literals

import { readFile, writeFile } from "node:fs/promises";

// Chemin par défaut du fichier de données
const CHEMIN_DEFAUT = new URL("./donnees.json", import.meta.url);

// Lire les contacts depuis le fichier JSON
export async function lireContacts(chemin = CHEMIN_DEFAUT) {
  try {
    // readFile retourne une Promise -- on utilise await
    const contenu = await readFile(chemin, "utf-8");
    const { contacts } = JSON.parse(contenu); // Destructuring (fiche 03)
    return contacts;
  } catch (erreur) {
    // Si le fichier n'existe pas, retourner un tableau vide
    if (erreur.code === "ENOENT") {
      console.log("Fichier de données introuvable, création d'un nouveau fichier.");
      return [];
    }
    throw new Error(`Erreur de lecture : ${erreur.message}`);
  }
}

// Sauvegarder les contacts dans le fichier JSON
export async function sauvegarderContacts(contacts, chemin = CHEMIN_DEFAUT) {
  try {
    const donnees = JSON.stringify({ contacts }, null, 2);
    await writeFile(chemin, donnees, "utf-8");
  } catch (erreur) {
    throw new Error(`Erreur de sauvegarde : ${erreur.message}`);
  }
}

// Créer une sauvegarde du fichier
export async function creerSauvegarde(chemin = CHEMIN_DEFAUT) {
  try {
    const contenu = await readFile(chemin, "utf-8");
    const cheminSauvegarde = new URL("./donnees.backup.json", import.meta.url);
    await writeFile(cheminSauvegarde, contenu, "utf-8");
    return cheminSauvegarde;
  } catch (erreur) {
    throw new Error(`Erreur de sauvegarde : ${erreur.message}`);
  }
}
```

---

### Étape 4 : Classe Répertoire (fiche 06 -- classes, fiche 07 -- Map/Set, fiche 08 -- itérateurs)

Crée le fichier `repertoire.mjs` :

```javascript
// Classe Repertoire -- gestionnaire de contacts
// Fonctionnalités ES6+ : class, Map, Set, Symbol.iterator, generators, arrow functions,
//                         destructuring, spread, template literals, async/await

import { Contact } from "./contact.mjs";
import { lireContacts, sauvegarderContacts, creerSauvegarde } from "./stockage.mjs";

export class Repertoire {
  // Map pour stocker les contacts (clé = id, valeur = Contact)
  #contacts = new Map();
  // Map pour l'index de recherche par tag
  #indexTags = new Map();
  // Compteur pour les IDs
  #prochainId = 1;

  // Charger les contacts depuis le fichier (async/await -- fiche 10)
  async charger() {
    const donnees = await lireContacts();

    for (const d of donnees) {
      const contact = Contact.depuis(d);
      this.#contacts.set(contact.id, contact);

      // Construire l'index des tags
      for (const tag of contact.tags) {
        this.#ajouterAIndex(tag, contact.id);
      }

      // Mettre à jour le compteur d'IDs
      if (contact.id >= this.#prochainId) {
        this.#prochainId = contact.id + 1;
      }
    }

    return this.#contacts.size;
  }

  // Sauvegarder tous les contacts dans le fichier
  async sauvegarder() {
    // Spread du Map.values() pour obtenir un tableau (fiche 03)
    const tableau = [...this.#contacts.values()].map((c) => c.versObjet());
    await sauvegarderContacts(tableau);
  }

  // Créer une sauvegarde avant une opération importante
  async sauvegarderCopie() {
    await creerSauvegarde();
  }

  // Ajouter un contact (destructuring -- fiche 03)
  ajouter({ prenom, nom, email, telephone = "", tags = [] }) {
    const id = this.#prochainId++;
    const contact = new Contact({ id, prenom, nom, email, telephone, tags });
    this.#contacts.set(id, contact);

    // Indexer les tags
    for (const tag of contact.tags) {
      this.#ajouterAIndex(tag, id);
    }

    return contact;
  }

  // Récupérer un contact par ID
  obtenir(id) {
    const contact = this.#contacts.get(id);
    if (!contact) {
      throw new Error(`Contact #${id} introuvable`);
    }
    return contact;
  }

  // Supprimer un contact
  supprimer(id) {
    const contact = this.obtenir(id);

    // Retirer des index de tags
    for (const tag of contact.tags) {
      this.#retirerDeIndex(tag, id);
    }

    this.#contacts.delete(id);
    return contact;
  }

  // Modifier un contact (spread -- fiche 03)
  modifier(id, modifications) {
    const contact = this.obtenir(id);
    contact.mettreAJour(modifications);
    return contact;
  }

  // Rechercher par nom ou prénom (arrow function -- fiche 02)
  rechercherParNom(texte) {
    const recherche = texte.toLowerCase();
    return [...this.#contacts.values()].filter((c) => {
      return c.nomComplet.toLowerCase().includes(recherche);
    });
  }

  // Rechercher par tag (Map -- fiche 07)
  rechercherParTag(tag) {
    const ids = this.#indexTags.get(tag.toLowerCase());
    if (!ids || ids.size === 0) return [];

    // Convertir les IDs en contacts
    return [...ids].map((id) => this.#contacts.get(id)).filter(Boolean);
  }

  // Rechercher par tags multiples (Set -- fiche 07)
  rechercherParTags(tags, mode = "ET") {
    if (mode === "ET") {
      // Tous les tags doivent être présents
      return [...this.#contacts.values()].filter((c) => {
        return tags.every((tag) => c.aTag(tag));
      });
    }
    // Au moins un tag doit être présent (mode "OU")
    const resultats = new Set();
    for (const tag of tags) {
      const ids = this.#indexTags.get(tag.toLowerCase());
      if (ids) {
        for (const id of ids) resultats.add(id);
      }
    }
    return [...resultats].map((id) => this.#contacts.get(id)).filter(Boolean);
  }

  // Obtenir tous les tags uniques (Set -- fiche 07)
  get tousLesTags() {
    const tags = new Set();
    for (const contact of this.#contacts.values()) {
      for (const tag of contact.tags) {
        tags.add(tag);
      }
    }
    return [...tags].sort();
  }

  // Nombre de contacts
  get taille() {
    return this.#contacts.size;
  }

  // Obtenir tous les contacts sous forme de tableau
  get tous() {
    return [...this.#contacts.values()];
  }

  // Statistiques (destructuring, template literals -- fiches 03 et 04)
  statistiques() {
    const total = this.#contacts.size;
    const tags = this.tousLesTags;
    const avecTelephone = [...this.#contacts.values()].filter(
      (c) => c.telephone.length > 0
    ).length;
    const sansTelephone = total - avecTelephone;

    return { total, tags, nombreTags: tags.length, avecTelephone, sansTelephone };
  }

  // Itérateur personnalisé (fiche 08)
  // Permet d'utiliser for...of directement sur le répertoire
  *[Symbol.iterator]() {
    // Le générateur yield chaque contact trié par nom
    const tries = [...this.#contacts.values()].sort((a, b) =>
      a.nomComplet.localeCompare(b.nomComplet)
    );
    for (const contact of tries) {
      yield contact;
    }
  }

  // Générateur pour parcourir les contacts par tag (fiche 08)
  *parTag(tag) {
    const contacts = this.rechercherParTag(tag);
    for (const contact of contacts) {
      yield contact;
    }
  }

  // Méthode privée : ajouter un contact à l'index des tags
  #ajouterAIndex(tag, contactId) {
    const tagNorm = tag.toLowerCase();
    if (!this.#indexTags.has(tagNorm)) {
      this.#indexTags.set(tagNorm, new Set());
    }
    this.#indexTags.get(tagNorm).add(contactId);
  }

  // Méthode privée : retirer un contact de l'index des tags
  #retirerDeIndex(tag, contactId) {
    const tagNorm = tag.toLowerCase();
    const ids = this.#indexTags.get(tagNorm);
    if (ids) {
      ids.delete(contactId);
      if (ids.size === 0) this.#indexTags.delete(tagNorm);
    }
  }
}
```

---

### Étape 5 : Module d'affichage (fiche 04 -- template literals, fiche 02 -- arrow functions)

Crée le fichier `affichage.mjs` :

```javascript
// Module d'affichage -- fonctions de formatage et d'affichage
// Fonctionnalités ES6+ : export, arrow functions, template literals, destructuring

// Afficher un titre encadré
export const titre = (texte) => {
  const ligne = "=".repeat(texte.length + 4);
  console.log(`\n${ligne}`);
  console.log(`| ${texte} |`);
  console.log(ligne);
};

// Afficher un sous-titre
export const sousTitre = (texte) => {
  console.log(`\n--- ${texte} ---`);
};

// Afficher un contact formaté
export const afficherContact = (contact) => {
  console.log(`  ${contact.toString()}`);
};

// Afficher une liste de contacts
export const afficherListe = (contacts, message = "") => {
  if (message) console.log(message);

  if (contacts.length === 0) {
    console.log("  (aucun contact)");
    return;
  }

  contacts.forEach((c) => afficherContact(c));
  console.log(`  → ${contacts.length} contact(s)`);
};

// Afficher les statistiques (destructuring -- fiche 03)
export const afficherStats = ({ total, nombreTags, tags, avecTelephone, sansTelephone }) => {
  console.log(`  Contacts      : ${total}`);
  console.log(`  Tags uniques  : ${nombreTags} (${tags.join(", ")})`);
  console.log(`  Avec téléphone: ${avecTelephone}`);
  console.log(`  Sans téléphone: ${sansTelephone}`);
};

// Afficher un message de succès
export const succes = (message) => {
  console.log(`  [OK] ${message}`);
};

// Afficher un message d'erreur
export const erreur = (message) => {
  console.error(`  [ERREUR] ${message}`);
};
```

---

### Étape 6 : Point d'entrée principal (toutes les fiches combinées)

Crée le fichier `main.mjs` :

```javascript
// Point d'entrée -- combine toutes les fonctionnalités ES6+
// Fonctionnalités utilisées : modules, classes, destructuring, spread, template literals,
//                             arrow functions, Map, Set, itérateurs, async/await

import { Repertoire } from "./repertoire.mjs";
import {
  titre,
  sousTitre,
  afficherListe,
  afficherContact,
  afficherStats,
  succes,
  erreur,
} from "./affichage.mjs";

async function main() {
  const repertoire = new Repertoire();

  // ============================================
  // 1. Charger les contacts depuis le fichier
  // ============================================
  titre("Gestionnaire de Contacts ES6+");

  sousTitre("Chargement des données");
  try {
    const nombre = await repertoire.charger();
    succes(`${nombre} contact(s) chargé(s) depuis le fichier`);
  } catch (e) {
    erreur(`Impossible de charger les données : ${e.message}`);
    return;
  }

  // ============================================
  // 2. Afficher tous les contacts
  // ============================================
  sousTitre("Liste complète");
  afficherListe(repertoire.tous);

  // ============================================
  // 3. Ajouter de nouveaux contacts
  // ============================================
  sousTitre("Ajout de contacts");

  // Destructuring dans les paramètres (fiche 03)
  const diana = repertoire.ajouter({
    prenom: "Diana",
    nom: "Leclerc",
    email: "diana.leclerc@example.com",
    telephone: "06 55 66 77 88",
    tags: ["famille", "lyon"],
  });
  succes(`Ajouté : ${diana.nomComplet} (id: ${diana.id})`);

  const eve = repertoire.ajouter({
    prenom: "Eve",
    nom: "Moreau",
    email: "eve.moreau@example.com",
    // Pas de téléphone -- la valeur par défaut "" sera utilisée
    tags: ["travail", "dev", "lyon"],
  });
  succes(`Ajouté : ${eve.nomComplet} (id: ${eve.id})`);

  afficherListe(repertoire.tous, "\nListe après ajouts :");

  // ============================================
  // 4. Recherche par nom
  // ============================================
  sousTitre("Recherche par nom");

  const resultatsNom = repertoire.rechercherParNom("du");
  afficherListe(resultatsNom, `Résultats pour "du" :`);

  // ============================================
  // 5. Recherche par tag (Map -- fiche 07)
  // ============================================
  sousTitre("Recherche par tag");

  const contactsDev = repertoire.rechercherParTag("dev");
  afficherListe(contactsDev, `Contacts avec le tag "dev" :`);

  const contactsParis = repertoire.rechercherParTag("paris");
  afficherListe(contactsParis, `\nContacts avec le tag "paris" :`);

  // ============================================
  // 6. Recherche par tags multiples (Set -- fiche 07)
  // ============================================
  sousTitre("Recherche par tags multiples");

  const devEtParis = repertoire.rechercherParTags(["dev", "paris"], "ET");
  afficherListe(devEtParis, `Tags "dev" ET "paris" :`);

  const devOuLyon = repertoire.rechercherParTags(["dev", "lyon"], "OU");
  afficherListe(devOuLyon, `\nTags "dev" OU "lyon" :`);

  // ============================================
  // 7. Modifier un contact (spread -- fiche 03)
  // ============================================
  sousTitre("Modification");

  const aliceModifiee = repertoire.modifier(1, {
    email: "alice.new@example.com",
    telephone: "06 00 00 00 01",
  });
  succes(`Modifié : ${aliceModifiee.nomComplet}`);
  afficherContact(aliceModifiee);

  // Ajouter un tag
  aliceModifiee.ajouterTag("dev");
  succes(`Tag "dev" ajouté à ${aliceModifiee.nomComplet}`);

  // ============================================
  // 8. Supprimer un contact
  // ============================================
  sousTitre("Suppression");

  try {
    const supprime = repertoire.supprimer(2);
    succes(`Supprimé : ${supprime.nomComplet}`);
  } catch (e) {
    erreur(e.message);
  }

  // Tenter de supprimer un contact inexistant
  try {
    repertoire.supprimer(999);
  } catch (e) {
    erreur(e.message);
  }

  // ============================================
  // 9. Itérateur -- parcourir le répertoire (fiche 08)
  // ============================================
  sousTitre("Parcours avec itérateur (trié par nom)");

  // for...of fonctionne grâce à Symbol.iterator
  for (const contact of repertoire) {
    afficherContact(contact);
  }

  // ============================================
  // 10. Générateur -- parcourir par tag (fiche 08)
  // ============================================
  sousTitre("Parcours par tag avec générateur");

  console.log(`Contacts "dev" (via générateur) :`);
  for (const contact of repertoire.parTag("dev")) {
    console.log(`  → ${contact.nomComplet}`);
  }

  // ============================================
  // 11. Statistiques (destructuring -- fiche 03)
  // ============================================
  sousTitre("Statistiques");
  const stats = repertoire.statistiques();
  afficherStats(stats);

  // ============================================
  // 12. Tous les tags uniques (Set -- fiche 07)
  // ============================================
  sousTitre("Tags disponibles");
  console.log(`  ${repertoire.tousLesTags.join(", ")}`);

  // ============================================
  // 13. Sauvegarder les modifications
  // ============================================
  sousTitre("Sauvegarde");

  try {
    await repertoire.sauvegarderCopie();
    succes("Sauvegarde de sécurité créée (donnees.backup.json)");

    await repertoire.sauvegarder();
    succes("Contacts sauvegardés dans donnees.json");
  } catch (e) {
    erreur(`Impossible de sauvegarder : ${e.message}`);
  }

  // ============================================
  // Résumé final
  // ============================================
  titre("Terminé");
  console.log(`  ${repertoire.taille} contacts dans le répertoire`);
  console.log(`  ${repertoire.tousLesTags.length} tags uniques`);
  console.log("  Données sauvegardées avec succès\n");
}

// Lancer l'application
main().catch((e) => {
  console.error("Erreur fatale :", e.message);
  process.exit(1);
});
```

---

### Étape 7 : Exécuter le projet complet

```bash
cd ~/js-moderne/projet-contacts && node main.mjs
```

**Résultat attendu** :

```text
==============================
| Gestionnaire de Contacts ES6+ |
==============================

--- Chargement des données ---
  [OK] 3 contact(s) chargé(s) depuis le fichier

--- Liste complète ---
  #1 Alice Dupont | alice.dupont@example.com | 06 12 34 56 78 | [famille, paris]
  #2 Bob Martin | bob.martin@example.com | 06 98 76 54 32 | [travail, dev]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  → 3 contact(s)

--- Ajout de contacts ---
  [OK] Ajouté : Diana Leclerc (id: 4)
  [OK] Ajouté : Eve Moreau (id: 5)

Liste après ajouts :
  #1 Alice Dupont | alice.dupont@example.com | 06 12 34 56 78 | [famille, paris]
  #2 Bob Martin | bob.martin@example.com | 06 98 76 54 32 | [travail, dev]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  #4 Diana Leclerc | diana.leclerc@example.com | 06 55 66 77 88 | [famille, lyon]
  #5 Eve Moreau | eve.moreau@example.com | pas de tél. | [travail, dev, lyon]
  → 5 contact(s)

--- Recherche par nom ---
Résultats pour "du" :
  #1 Alice Dupont | alice.dupont@example.com | 06 12 34 56 78 | [famille, paris]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  → 2 contact(s)

--- Recherche par tag ---
Contacts avec le tag "dev" :
  #2 Bob Martin | bob.martin@example.com | 06 98 76 54 32 | [travail, dev]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  #5 Eve Moreau | eve.moreau@example.com | pas de tél. | [travail, dev, lyon]
  → 3 contact(s)

Contacts avec le tag "paris" :
  #1 Alice Dupont | alice.dupont@example.com | 06 12 34 56 78 | [famille, paris]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  → 2 contact(s)

--- Recherche par tags multiples ---
Tags "dev" ET "paris" :
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  → 1 contact(s)

Tags "dev" OU "lyon" :
  #2 Bob Martin | bob.martin@example.com | 06 98 76 54 32 | [travail, dev]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  #4 Diana Leclerc | diana.leclerc@example.com | 06 55 66 77 88 | [famille, lyon]
  #5 Eve Moreau | eve.moreau@example.com | pas de tél. | [travail, dev, lyon]
  → 4 contact(s)

--- Modification ---
  [OK] Modifié : Alice Dupont
  #1 Alice Dupont | alice.new@example.com | 06 00 00 00 01 | [famille, paris]
  [OK] Tag "dev" ajouté à Alice Dupont

--- Suppression ---
  [OK] Supprimé : Bob Martin
  [ERREUR] Contact #999 introuvable

--- Parcours avec itérateur (trié par nom) ---
  #1 Alice Dupont | alice.new@example.com | 06 00 00 00 01 | [famille, paris, dev]
  #3 Charlie Durand | charlie.durand@example.com | 07 11 22 33 44 | [travail, paris, dev]
  #4 Diana Leclerc | diana.leclerc@example.com | 06 55 66 77 88 | [famille, lyon]
  #5 Eve Moreau | eve.moreau@example.com | pas de tél. | [travail, dev, lyon]

--- Parcours par tag avec générateur ---
Contacts "dev" (via générateur) :
  → Charlie Durand
  → Eve Moreau
  → Alice Dupont

--- Statistiques ---
  Contacts      : 4
  Tags uniques  : 5 (dev, famille, lyon, paris, travail)
  Avec téléphone: 3
  Sans téléphone: 1

--- Tags disponibles ---
  dev, famille, lyon, paris, travail

--- Sauvegarde ---
  [OK] Sauvegarde de sécurité créée (donnees.backup.json)
  [OK] Contacts sauvegardés dans donnees.json

=============
| Terminé |
=============
  4 contacts dans le répertoire
  5 tags uniques
  Données sauvegardées avec succès
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `node main.mjs` | Lancer l'application |
| `cat donnees.json` | Voir les données sauvegardées |
| `cat donnees.backup.json` | Voir la sauvegarde |
| `node -e "import('./contact.mjs')"` | Vérifier qu'un module s'importe sans erreur |

---

## Pièges Fréquents

### Piège 1 : Oublier `"type": "module"` dans package.json

⚠️ **Problème** : Tu obtiens l'erreur `SyntaxError: Cannot use import statement outside a module` en lançant `node main.mjs`.

✅ **Solution** : Vérifie que `package.json` contient `"type": "module"`. Sans cette ligne, Node.js traite les fichiers `.js` comme du CommonJS. Alternative : utilise l'extension `.mjs` pour chaque fichier (ce qui est déjà le cas dans ce projet).

---

### Piège 2 : Oublier `await` devant les opérations de fichier

⚠️ **Problème** : Tu appelles `repertoire.charger()` ou `repertoire.sauvegarder()` sans `await`, et les données ne sont pas encore chargées quand tu les utilises.

✅ **Solution** : Ajoute toujours `await` devant les appels à des fonctions `async`.

```javascript
// ❌ Sans await : les données ne sont pas chargées
repertoire.charger();
console.log(repertoire.taille); // 0 -- pas encore chargé

// ✅ Avec await : on attend que le chargement soit terminé
await repertoire.charger();
console.log(repertoire.taille); // 3
```

---

### Piège 3 : Modifier le Set directement au lieu d'utiliser les méthodes

⚠️ **Problème** : Tu tentes d'accéder aux champs privés d'un contact ou de modifier le Set de tags directement.

✅ **Solution** : Utilise les méthodes publiques `ajouterTag()`, `supprimerTag()`, `aTag()`. Les champs privés (`#tags`) ne sont pas accessibles depuis l'extérieur de la classe.

```javascript
// ❌ Accès direct au champ privé (erreur)
contact.#tags.add("nouveau"); // SyntaxError: Private field

// ✅ Utiliser la méthode publique
contact.ajouterTag("nouveau");
```

---

### Piège 4 : Ne pas gérer les erreurs de fichier

⚠️ **Problème** : Si le fichier `donnees.json` n'existe pas ou est corrompu, l'application plante sans message clair.

✅ **Solution** : Encadre toujours les opérations de lecture/écriture avec `try`/`catch` et affiche un message explicite.

```javascript
// ❌ Sans gestion d'erreur : l'application plante si le fichier est absent
const contenu = await readFile("donnees.json", "utf-8");
const donnees = JSON.parse(contenu);

// ✅ Avec try/catch : message clair en cas de problème
try {
  const contenu = await readFile("donnees.json", "utf-8");
  const donnees = JSON.parse(contenu);
} catch (erreur) {
  if (erreur.code === "ENOENT") {
    console.error("Le fichier donnees.json est introuvable.");
  } else if (erreur instanceof SyntaxError) {
    console.error("Le fichier donnees.json contient du JSON invalide.");
  } else {
    console.error(`Erreur inattendue : ${erreur.message}`);
  }
}
```

---

## Checklist de Validation

- [ ] Le projet contient 7 fichiers : `package.json`, `donnees.json`, `contact.mjs`, `stockage.mjs`, `repertoire.mjs`, `affichage.mjs`, `main.mjs`
- [ ] `node main.mjs` s'exécute sans erreur
- [ ] Les contacts sont chargés depuis `donnees.json`
- [ ] L'ajout, la modification et la suppression fonctionnent
- [ ] La recherche par nom et par tag retourne les bons résultats
- [ ] L'itérateur `for...of` parcourt les contacts triés par nom
- [ ] Le générateur `parTag()` filtre correctement par tag
- [ ] Les modifications sont sauvegardées dans `donnees.json`
- [ ] Les erreurs (contact inexistant, fichier manquant) sont gérées proprement
- [ ] Chaque module utilise `import`/`export` (pas de `require`)

---

## Exercice Pratique

**Énoncé** : Ajoute les fonctionnalités suivantes au projet :

1. **Export CSV** : crée une fonction `exporterCSV()` dans un nouveau module `export.mjs` qui convertit les contacts en format CSV (séparateur `;`).
2. **Recherche avancée** : ajoute une méthode `rechercherAvance(criteres)` au répertoire qui accepte un objet `{ nom, email, tags, avecTelephone }` et filtre selon tous les critères fournis.
3. **Tri configurable** : ajoute un paramètre de tri à l'itérateur (par nom, par date, par nombre de tags).

**Indications** :

- Pour le CSV, utilise `Object.values()` et `Array.join()`.
- Pour la recherche avancée, utilise `Array.filter()` avec des conditions combinées.
- Pour le tri configurable, accepte un paramètre dans le générateur.

**Résultat attendu pour l'export CSV** :

```text
id;prenom;nom;email;telephone;tags
1;Alice;Dupont;alice.new@example.com;06 00 00 00 01;famille|paris|dev
3;Charlie;Durand;charlie.durand@example.com;07 11 22 33 44;travail|paris|dev
4;Diana;Leclerc;diana.leclerc@example.com;06 55 66 77 88;famille|lyon
5;Eve;Moreau;eve.moreau@example.com;;travail|dev|lyon
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Export CSV (`export.mjs`)

```javascript
// Module d'export CSV
// Fonctionnalités ES6+ : modules, arrow functions, template literals, destructuring

import { writeFile } from "node:fs/promises";

// Convertir les contacts en CSV
export const versCSV = (contacts) => {
  // En-tête
  const entete = "id;prenom;nom;email;telephone;tags";

  // Lignes de données
  const lignes = contacts.map((c) => {
    const obj = c.versObjet();
    // Les tags sont joints par | (pipe) car ; est le séparateur CSV
    const { id, prenom, nom, email, telephone, tags } = obj;
    return `${id};${prenom};${nom};${email};${telephone};${tags.join("|")}`;
  });

  return [entete, ...lignes].join("\n");
};

// Exporter vers un fichier
export const exporterCSV = async (contacts, chemin) => {
  const csv = versCSV(contacts);
  await writeFile(chemin, csv, "utf-8");
  return csv;
};
```

### 2. Recherche avancée (à ajouter dans `repertoire.mjs`)

```javascript
// Recherche avancée avec critères multiples
// Ajouter cette méthode dans la classe Repertoire
rechercherAvance({ nom, email, tags, avecTelephone } = {}) {
  return [...this.#contacts.values()].filter((c) => {
    // Filtre par nom (partiel, insensible à la casse)
    if (nom && !c.nomComplet.toLowerCase().includes(nom.toLowerCase())) {
      return false;
    }

    // Filtre par email (partiel)
    if (email && !c.email.toLowerCase().includes(email.toLowerCase())) {
      return false;
    }

    // Filtre par tags (tous doivent être présents)
    if (tags && tags.length > 0) {
      if (!tags.every((tag) => c.aTag(tag))) {
        return false;
      }
    }

    // Filtre par présence de téléphone
    if (avecTelephone !== undefined) {
      const aTelephone = c.telephone.length > 0;
      if (avecTelephone !== aTelephone) {
        return false;
      }
    }

    return true;
  });
}
```

### 3. Tri configurable (à modifier dans `repertoire.mjs`)

```javascript
// Remplacer l'itérateur existant par cette version
*[Symbol.iterator]() {
  yield* this.#trierPar("nom");
}

// Générateur avec tri configurable
*trierPar(critere = "nom") {
  const contacts = [...this.#contacts.values()];

  // Fonction de tri selon le critère
  const fonctionsTri = {
    nom: (a, b) => a.nomComplet.localeCompare(b.nomComplet),
    date: (a, b) => a.dateCreation - b.dateCreation,
    tags: (a, b) => b.tags.length - a.tags.length,
  };

  const fn = fonctionsTri[critere] || fonctionsTri.nom;
  const tries = contacts.sort(fn);

  for (const contact of tries) {
    yield contact;
  }
}
```

**Utilisation** :

```javascript
// Tri par nom (par défaut, via for...of)
for (const c of repertoire) {
  console.log(c.nomComplet);
}

// Tri par date de création
for (const c of repertoire.trierPar("date")) {
  console.log(`${c.nomComplet} -- ${c.dateCreation.toLocaleDateString()}`);
}

// Tri par nombre de tags (décroissant)
for (const c of repertoire.trierPar("tags")) {
  console.log(`${c.nomComplet} -- ${c.tags.length} tags`);
}
```

---

## Navigation

← Fiche précédente : **[Fetch API et HTTP](11-fetch-api-http.md)**

→ Fiche suivante : **[Temporal API (la nouvelle gestion des dates)](13-temporal-api.md)**
