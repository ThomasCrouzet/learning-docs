---
tags:
  - TypeScript
  - Avancé
  - Projet
description: "Créer une application CLI complète en TypeScript qui gère des tâches avec persistance fichier JSON."
estimated_time: "120 min"
fiche_number: 14
total_fiches: 15
cursus: "TypeScript"
---

# 14 - Projet intégrateur

> **En bref** : Créer une application CLI en TypeScript qui gère des tâches avec persistance fichier JSON, en mobilisant toutes les compétences du cursus. Lecture estimée : 120 min.

## Prérequis

- Toutes les fiches précédentes du cursus TypeScript (01 à 13)
- [12 - TypeScript avec Node.js](12-typescript-nodejs.md) pour la configuration du projet
- [13 - Gestion d'erreurs typée](13-gestion-erreurs-typee.md) pour le Result pattern

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé une application CLI complète en TypeScript : un gestionnaire de tâches avec persistance fichier JSON, gestion d'erreurs typée, modules organisés, et types génériques.

---

## Concepts

### Qu'est-ce qu'une application CLI ?

**Définition** : Une application CLI (Command Line Interface) est un programme qui s'exécute dans le terminal. L'utilisateur interagit avec le programme en tapant des commandes avec des arguments. Par exemple : `node dist/index.js ajouter "Ma tâche"`.

**Le problème qu'une application CLI résout** :

Sans interface en ligne de commande, voici les problèmes rencontrés :

1. **Pas d'interaction** : Le programme exécute toujours la même chose. On ne peut pas choisir l'action à effectuer.
2. **Pas de persistance** : Les données sont perdues quand le programme s'arrête.

**Comment une application CLI résout ces problèmes** :

| Problème | Solution apportée par la CLI |
| -------- | ---------------------------- |
| Pas d'interaction | Les arguments en ligne de commande définissent l'action |
| Pas de persistance | Les données sont sauvegardées dans un fichier JSON |

**Analogie concrète** : Une application CLI est comme une télécommande. Chaque bouton (commande) déclenche une action spécifique. Tu choisis l'action en appuyant sur le bon bouton, et le résultat s'affiche à l'écran.

---

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur est un exercice de synthèse qui combine toutes les compétences apprises dans un cursus pour créer une application complète et fonctionnelle. Au lieu de pratiquer chaque concept isolément, on les utilise ensemble dans un contexte réaliste.

**Le problème qu'un projet intégrateur résout** :

Sans projet intégrateur, voici les problèmes rencontrés :

1. **Connaissances fragmentées** : Chaque fiche enseigne un concept isolé. On sait utiliser les generics ou les modules séparément, mais pas les combiner dans un même projet.
2. **Pas de pratique réaliste** : Les exemples de cours sont courts et simplifiés. On ne sait pas comment structurer un vrai projet de A à Z.
3. **Difficulté à évaluer sa progression** : Sans projet complet, on ne peut pas vérifier si on maîtrise toutes les compétences du cursus.

**Comment un projet intégrateur résout ces problèmes** :

| Problème | Solution apportée par le projet intégrateur |
| -------- | ------------------------------------------- |
| Connaissances fragmentées | Toutes les compétences sont utilisées ensemble |
| Pas de pratique réaliste | Le projet a une structure professionnelle complète |
| Difficulté à évaluer sa progression | Le projet fonctionne = les compétences sont acquises |

**Analogie concrète** : Un projet intégrateur est comme un examen de cuisine finale dans une école de restauration. Pendant les cours, tu as appris à couper les légumes (types), préparer les sauces (fonctions), cuire la viande (classes), dresser l'assiette (modules). Le projet intégrateur, c'est préparer un repas complet de l'entrée au dessert : tu dois combiner toutes les techniques apprises pour servir un plat réussi.

**Compétences mobilisées dans ce projet** :

| Fiche | Compétence | Utilisation dans le projet |
| ----- | ---------- | -------------------------- |
| 03 | Types primitifs | Typage de toutes les variables |
| 04 | Tableaux et tuples | Liste de tâches, arguments CLI |
| 05 | Interfaces | Définition des modèles de données |
| 06 | Types union | Statuts, priorités, types d'erreurs |
| 07 | Fonctions typées | Toutes les fonctions du projet |
| 08 | Classes | Service de stockage |
| 09 | Enums et littéraux | Statuts et priorités des tâches |
| 10 | Generics | Service de stockage générique, Result pattern |
| 11 | Modules | Organisation du code en fichiers séparés |
| 12 | Node.js | Configuration du projet, lecture/écriture de fichiers |
| 13 | Gestion d'erreurs | Result pattern, erreurs typées |

---

## Étapes Pratiques

### Étape 1 : Initialiser le projet

Crée un nouveau dossier de projet :

```bash
mkdir gestionnaire-taches
cd gestionnaire-taches
npm init -y
npm install --save-dev typescript @types/node ts-node
```

Crée le fichier `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Ajoute les scripts dans `package.json` :

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "lint": "tsc --noEmit"
  }
}
```

Crée la structure de dossiers :

```bash
mkdir -p src/models src/services src/utils
```

---

### Étape 2 : Créer les types et modèles

Crée `src/models/types.ts` :

```typescript
// src/models/types.ts
// Types et interfaces pour le gestionnaire de tâches

// Priorité d'une tâche (type littéral)
export type Priorite = "haute" | "moyenne" | "basse";

// Statut d'une tâche (type littéral)
export type Statut = "a_faire" | "en_cours" | "terminee";

// Interface principale d'une tâche
export interface Tache {
  id: number;
  titre: string;
  description: string;
  priorite: Priorite;
  statut: Statut;
  dateCreation: string;
  dateModification: string;
}

// Type pour la création d'une tâche (sans id ni dates)
export type CreationTache = Pick<Tache, "titre" | "description" | "priorite">;

// Type pour la mise à jour d'une tâche (tout optionnel sauf id)
export type MiseAJourTache = Partial<Omit<Tache, "id" | "dateCreation">>;

// Filtre pour rechercher des tâches
export interface FiltreTache {
  statut?: Statut;
  priorite?: Priorite;
  recherche?: string;
}

// Statistiques des tâches
export interface StatsTaches {
  total: number;
  aFaire: number;
  enCours: number;
  terminees: number;
  parPriorite: Record<Priorite, number>;
}
```

---

### Étape 3 : Créer le Result pattern réutilisable

Crée `src/utils/result.ts` :

```typescript
// src/utils/result.ts
// Result pattern générique réutilisable

// Type pour un succès
export interface Succes<T> {
  succes: true;
  donnees: T;
}

// Type pour un échec
export interface Echec<E> {
  succes: false;
  erreur: E;
}

// Type union
export type Result<T, E = string> = Succes<T> | Echec<E>;

// Fonctions utilitaires pour créer des résultats
export function ok<T>(donnees: T): Succes<T> {
  return { succes: true, donnees: donnees };
}

export function erreur<E>(erreur: E): Echec<E> {
  return { succes: false, erreur: erreur };
}
```

---

### Étape 4 : Créer le service de stockage fichier

Crée `src/services/stockage.ts` :

```typescript
// src/services/stockage.ts
// Service de stockage générique avec persistance fichier JSON

import * as fs from "fs";
import * as path from "path";
import { Result, ok, erreur } from "../utils/result";

// Classe générique : fonctionne avec n'importe quel type T qui a un id
export class StockageFichier<T extends { id: number }> {
  private cheminFichier: string;
  private donnees: T[] = [];

  constructor(nomFichier: string) {
    // Le fichier de données est créé dans le dossier courant
    this.cheminFichier = path.resolve(process.cwd(), nomFichier);
    this.charger();
  }

  // Charger les données depuis le fichier JSON
  private charger(): void {
    try {
      if (fs.existsSync(this.cheminFichier)) {
        const contenu: string = fs.readFileSync(this.cheminFichier, "utf-8");
        this.donnees = JSON.parse(contenu) as T[];
      }
    } catch {
      // Si le fichier est corrompu, on repart de zéro
      this.donnees = [];
    }
  }

  // Sauvegarder les données dans le fichier JSON
  private sauvegarder(): Result<void> {
    try {
      const contenu: string = JSON.stringify(this.donnees, null, 2);
      fs.writeFileSync(this.cheminFichier, contenu, "utf-8");
      return ok(undefined);
    } catch (e: unknown) {
      const message: string =
        e instanceof Error ? e.message : "Erreur de sauvegarde inconnue";
      return erreur(message);
    }
  }

  // Obtenir le prochain ID disponible
  public prochainId(): number {
    if (this.donnees.length === 0) return 1;
    const ids: number[] = this.donnees.map((item: T): number => item.id);
    return Math.max(...ids) + 1;
  }

  // Ajouter un élément
  public ajouter(element: T): Result<T> {
    this.donnees.push(element);
    const resultat: Result<void> = this.sauvegarder();
    if (!resultat.succes) {
      // Annuler l'ajout si la sauvegarde échoue
      this.donnees.pop();
      return erreur(resultat.erreur);
    }
    return ok(element);
  }

  // Trouver par ID
  public trouverParId(id: number): T | undefined {
    return this.donnees.find((item: T): boolean => item.id === id);
  }

  // Lister tous les éléments
  public listerTout(): T[] {
    return [...this.donnees];
  }

  // Mettre à jour un élément
  public mettreAJour(id: number, modifications: Partial<T>): Result<T> {
    const index: number = this.donnees.findIndex(
      (item: T): boolean => item.id === id
    );

    if (index === -1) {
      return erreur(`Élément #${id} non trouvé`);
    }

    // Fusionner les modifications avec l'élément existant
    this.donnees[index] = { ...this.donnees[index], ...modifications };
    const resultat: Result<void> = this.sauvegarder();

    if (!resultat.succes) {
      return erreur(resultat.erreur);
    }

    return ok(this.donnees[index]);
  }

  // Supprimer un élément
  public supprimer(id: number): Result<T> {
    const index: number = this.donnees.findIndex(
      (item: T): boolean => item.id === id
    );

    if (index === -1) {
      return erreur(`Élément #${id} non trouvé`);
    }

    const supprime: T = this.donnees[index];
    this.donnees.splice(index, 1);
    const resultat: Result<void> = this.sauvegarder();

    if (!resultat.succes) {
      return erreur(resultat.erreur);
    }

    return ok(supprime);
  }
}
```

---

### Étape 5 : Créer le service de tâches

Crée `src/services/tache-service.ts` :

```typescript
// src/services/tache-service.ts
// Service métier pour la gestion des tâches

import { StockageFichier } from "./stockage";
import { Result, ok, erreur } from "../utils/result";
import type {
  Tache,
  CreationTache,
  MiseAJourTache,
  FiltreTache,
  StatsTaches,
  Priorite,
  Statut,
} from "../models/types";

// Valeurs autorisées pour la validation
const PRIORITES_VALIDES: Priorite[] = ["haute", "moyenne", "basse"];
const STATUTS_VALIDES: Statut[] = ["a_faire", "en_cours", "terminee"];

export class TacheService {
  private stockage: StockageFichier<Tache>;

  constructor(nomFichier: string = "taches.json") {
    this.stockage = new StockageFichier<Tache>(nomFichier);
  }

  // Créer une nouvelle tâche
  public creer(donnees: CreationTache): Result<Tache> {
    // Validation
    if (donnees.titre.trim().length === 0) {
      return erreur("Le titre ne peut pas être vide");
    }

    if (!PRIORITES_VALIDES.includes(donnees.priorite)) {
      return erreur(
        `Priorité invalide : "${donnees.priorite}". Valeurs acceptées : ${PRIORITES_VALIDES.join(", ")}`
      );
    }

    const maintenant: string = new Date().toISOString();
    const tache: Tache = {
      id: this.stockage.prochainId(),
      titre: donnees.titre.trim(),
      description: donnees.description.trim(),
      priorite: donnees.priorite,
      statut: "a_faire",
      dateCreation: maintenant,
      dateModification: maintenant,
    };

    return this.stockage.ajouter(tache);
  }

  // Lister les tâches avec filtre optionnel
  public lister(filtre?: FiltreTache): Tache[] {
    let taches: Tache[] = this.stockage.listerTout();

    if (filtre !== undefined) {
      // Filtrer par statut
      if (filtre.statut !== undefined) {
        taches = taches.filter(
          (t: Tache): boolean => t.statut === filtre.statut
        );
      }

      // Filtrer par priorité
      if (filtre.priorite !== undefined) {
        taches = taches.filter(
          (t: Tache): boolean => t.priorite === filtre.priorite
        );
      }

      // Filtrer par recherche textuelle
      if (filtre.recherche !== undefined && filtre.recherche.trim().length > 0) {
        const rechercheLower: string = filtre.recherche.toLowerCase();
        taches = taches.filter(
          (t: Tache): boolean =>
            t.titre.toLowerCase().includes(rechercheLower) ||
            t.description.toLowerCase().includes(rechercheLower)
        );
      }
    }

    return taches;
  }

  // Changer le statut d'une tâche
  public changerStatut(id: number, statut: Statut): Result<Tache> {
    if (!STATUTS_VALIDES.includes(statut)) {
      return erreur(
        `Statut invalide : "${statut}". Valeurs acceptées : ${STATUTS_VALIDES.join(", ")}`
      );
    }

    const modifications: MiseAJourTache = {
      statut: statut,
      dateModification: new Date().toISOString(),
    };

    return this.stockage.mettreAJour(id, modifications);
  }

  // Terminer une tâche (raccourci)
  public terminer(id: number): Result<Tache> {
    return this.changerStatut(id, "terminee");
  }

  // Supprimer une tâche
  public supprimer(id: number): Result<Tache> {
    return this.stockage.supprimer(id);
  }

  // Obtenir les statistiques
  public stats(): StatsTaches {
    const taches: Tache[] = this.stockage.listerTout();

    const parPriorite: Record<Priorite, number> = {
      haute: 0,
      moyenne: 0,
      basse: 0,
    };

    let aFaire: number = 0;
    let enCours: number = 0;
    let terminees: number = 0;

    taches.forEach((tache: Tache): void => {
      parPriorite[tache.priorite]++;

      switch (tache.statut) {
        case "a_faire":
          aFaire++;
          break;
        case "en_cours":
          enCours++;
          break;
        case "terminee":
          terminees++;
          break;
      }
    });

    return {
      total: taches.length,
      aFaire: aFaire,
      enCours: enCours,
      terminees: terminees,
      parPriorite: parPriorite,
    };
  }
}
```

---

### Étape 6 : Créer l'affichage

Crée `src/utils/affichage.ts` :

```typescript
// src/utils/affichage.ts
// Fonctions d'affichage pour le terminal

import type { Tache, StatsTaches } from "../models/types";

// Icônes pour les statuts
const ICONES_STATUT: Record<string, string> = {
  a_faire: "[ ]",
  en_cours: "[~]",
  terminee: "[x]",
};

// Labels pour les priorités
const LABELS_PRIORITE: Record<string, string> = {
  haute: "HAUTE",
  moyenne: "MOY.",
  basse: "basse",
};

export function afficherTache(tache: Tache): void {
  const icone: string = ICONES_STATUT[tache.statut] || "[?]";
  const priorite: string = LABELS_PRIORITE[tache.priorite] || tache.priorite;
  const description: string =
    tache.description.length > 0 ? ` - ${tache.description}` : "";

  console.log(`  ${icone} #${tache.id} ${tache.titre} (${priorite})${description}`);
}

export function afficherListeTaches(taches: Tache[]): void {
  if (taches.length === 0) {
    console.log("  Aucune tâche trouvée.");
    return;
  }

  taches.forEach(afficherTache);
  console.log(`\n  Total : ${taches.length} tâche(s)`);
}

export function afficherStats(stats: StatsTaches): void {
  console.log("  Statistiques :");
  console.log(`    Total       : ${stats.total}`);
  console.log(`    À faire     : ${stats.aFaire}`);
  console.log(`    En cours    : ${stats.enCours}`);
  console.log(`    Terminées   : ${stats.terminees}`);
  console.log("    Par priorité :");
  console.log(`      Haute     : ${stats.parPriorite.haute}`);
  console.log(`      Moyenne   : ${stats.parPriorite.moyenne}`);
  console.log(`      Basse     : ${stats.parPriorite.basse}`);

  if (stats.total > 0) {
    const taux: number = Math.round((stats.terminees / stats.total) * 100);
    console.log(`    Progression : ${taux}%`);
  }
}

export function afficherAide(): void {
  console.log("Gestionnaire de Tâches - TypeScript CLI");
  console.log("");
  console.log("Commandes disponibles :");
  console.log("");
  console.log("  ajouter <titre> [description] [priorite]");
  console.log("    Ajouter une nouvelle tâche");
  console.log("    Priorités : haute, moyenne (défaut), basse");
  console.log("");
  console.log("  lister [statut] [priorite]");
  console.log("    Lister les tâches (filtre optionnel)");
  console.log("    Statuts : a_faire, en_cours, terminee");
  console.log("");
  console.log("  terminer <id>");
  console.log("    Marquer une tâche comme terminée");
  console.log("");
  console.log("  commencer <id>");
  console.log("    Marquer une tâche comme en cours");
  console.log("");
  console.log("  supprimer <id>");
  console.log("    Supprimer une tâche");
  console.log("");
  console.log("  stats");
  console.log("    Afficher les statistiques");
  console.log("");
  console.log("  aide");
  console.log("    Afficher cette aide");
  console.log("");
  console.log("Exemples :");
  console.log('  npm start -- ajouter "Apprendre TypeScript" "Fiche 14" haute');
  console.log("  npm start -- lister");
  console.log("  npm start -- lister a_faire haute");
  console.log("  npm start -- terminer 1");
  console.log("  npm start -- stats");
}

export function afficherErreur(message: string): void {
  console.log(`  Erreur : ${message}`);
}

export function afficherSucces(message: string): void {
  console.log(`  ${message}`);
}
```

---

### Étape 7 : Créer le point d'entrée

Crée `src/index.ts` :

```typescript
// src/index.ts
// Point d'entrée de l'application CLI

import { TacheService } from "./services/tache-service";
import {
  afficherListeTaches,
  afficherStats,
  afficherAide,
  afficherErreur,
  afficherSucces,
  afficherTache,
} from "./utils/affichage";
import type { Priorite, Statut, FiltreTache, CreationTache } from "./models/types";

// Initialiser le service
const service = new TacheService("taches.json");

// Lire les arguments de la ligne de commande
// process.argv = [node, script.js, commande, ...args]
const args: string[] = process.argv.slice(2);
const commande: string = args[0] || "aide";

// Traiter la commande
switch (commande) {
  case "ajouter": {
    const titre: string = args[1] || "";
    const description: string = args[2] || "";
    const priorite: Priorite = (args[3] as Priorite) || "moyenne";

    if (titre.length === 0) {
      afficherErreur('Le titre est requis. Exemple : npm start -- ajouter "Mon titre"');
      break;
    }

    const donnees: CreationTache = {
      titre: titre,
      description: description,
      priorite: priorite,
    };

    const resultat = service.creer(donnees);

    if (resultat.succes) {
      afficherSucces(`Tâche #${resultat.donnees.id} créée :`);
      afficherTache(resultat.donnees);
    } else {
      afficherErreur(resultat.erreur);
    }
    break;
  }

  case "lister": {
    const filtre: FiltreTache = {};

    // Argument optionnel : statut
    if (args[1] !== undefined) {
      filtre.statut = args[1] as Statut;
    }

    // Argument optionnel : priorité
    if (args[2] !== undefined) {
      filtre.priorite = args[2] as Priorite;
    }

    const taches = service.lister(filtre);
    afficherListeTaches(taches);
    break;
  }

  case "terminer": {
    const id: number = parseInt(args[1], 10);

    if (isNaN(id)) {
      afficherErreur("L'ID doit être un nombre. Exemple : npm start -- terminer 1");
      break;
    }

    const resultat = service.terminer(id);

    if (resultat.succes) {
      afficherSucces(`Tâche #${id} terminée :`);
      afficherTache(resultat.donnees);
    } else {
      afficherErreur(resultat.erreur);
    }
    break;
  }

  case "commencer": {
    const id: number = parseInt(args[1], 10);

    if (isNaN(id)) {
      afficherErreur("L'ID doit être un nombre. Exemple : npm start -- commencer 1");
      break;
    }

    const resultat = service.changerStatut(id, "en_cours");

    if (resultat.succes) {
      afficherSucces(`Tâche #${id} en cours :`);
      afficherTache(resultat.donnees);
    } else {
      afficherErreur(resultat.erreur);
    }
    break;
  }

  case "supprimer": {
    const id: number = parseInt(args[1], 10);

    if (isNaN(id)) {
      afficherErreur("L'ID doit être un nombre. Exemple : npm start -- supprimer 1");
      break;
    }

    const resultat = service.supprimer(id);

    if (resultat.succes) {
      afficherSucces(`Tâche #${id} supprimée : "${resultat.donnees.titre}"`);
    } else {
      afficherErreur(resultat.erreur);
    }
    break;
  }

  case "stats": {
    const stats = service.stats();
    afficherStats(stats);
    break;
  }

  case "aide":
  default: {
    afficherAide();
    break;
  }
}
```

---

### Étape 8 : Compiler et tester

Compile le projet :

```bash
npm run build
```

**Résultat attendu** : Aucune erreur. Le dossier `dist/` contient les fichiers compilés.

Affiche l'aide :

```bash
npm start -- aide
```

**Résultat attendu** :

```text
Gestionnaire de Tâches - TypeScript CLI

Commandes disponibles :

  ajouter <titre> [description] [priorite]
    Ajouter une nouvelle tâche
    Priorités : haute, moyenne (défaut), basse

  lister [statut] [priorite]
    Lister les tâches (filtre optionnel)
    Statuts : a_faire, en_cours, terminee

  terminer <id>
    Marquer une tâche comme terminée

  commencer <id>
    Marquer une tâche comme en cours

  supprimer <id>
    Supprimer une tâche

  stats
    Afficher les statistiques

  aide
    Afficher cette aide

Exemples :
  npm start -- ajouter "Apprendre TypeScript" "Fiche 14" haute
  npm start -- lister
  npm start -- lister a_faire haute
  npm start -- terminer 1
  npm start -- stats
```

---

### Étape 9 : Tester toutes les fonctionnalités

Ajoute des tâches :

```bash
npm start -- ajouter "Apprendre TypeScript" "Terminer le cursus" haute
npm start -- ajouter "Configurer ESLint" "Ajouter le linting" moyenne
npm start -- ajouter "Écrire des tests" "Tests unitaires" haute
npm start -- ajouter "Documenter le projet" "README et commentaires" basse
```

**Résultat attendu** (pour chaque commande) :

```text
  Tâche #1 créée :
  [ ] #1 Apprendre TypeScript (HAUTE) - Terminer le cursus
```

Liste les tâches :

```bash
npm start -- lister
```

**Résultat attendu** :

```text
  [ ] #1 Apprendre TypeScript (HAUTE) - Terminer le cursus
  [ ] #2 Configurer ESLint (MOY.) - Ajouter le linting
  [ ] #3 Écrire des tests (HAUTE) - Tests unitaires
  [ ] #4 Documenter le projet (basse) - README et commentaires

  Total : 4 tâche(s)
```

Commence et termine des tâches :

```bash
npm start -- commencer 1
npm start -- terminer 2
```

**Résultat attendu** :

```text
  Tâche #1 en cours :
  [~] #1 Apprendre TypeScript (HAUTE) - Terminer le cursus
```

```text
  Tâche #2 terminée :
  [x] #2 Configurer ESLint (MOY.) - Ajouter le linting
```

Filtre les tâches :

```bash
npm start -- lister a_faire haute
```

**Résultat attendu** :

```text
  [ ] #3 Écrire des tests (HAUTE) - Tests unitaires

  Total : 1 tâche(s)
```

Affiche les statistiques :

```bash
npm start -- stats
```

**Résultat attendu** :

```text
  Statistiques :
    Total       : 4
    À faire     : 2
    En cours    : 1
    Terminées   : 1
    Par priorité :
      Haute     : 2
      Moyenne   : 1
      Basse     : 1
    Progression : 25%
```

Supprime une tâche :

```bash
npm start -- supprimer 4
```

**Résultat attendu** :

```text
  Tâche #4 supprimée : "Documenter le projet"
```

Teste une erreur :

```bash
npm start -- terminer 99
```

**Résultat attendu** :

```text
  Erreur : Élément #99 non trouvé
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm run build` | Compile le projet |
| `npm start -- aide` | Affiche l'aide |
| `npm start -- ajouter "titre" "desc" haute` | Ajoute une tâche |
| `npm start -- lister` | Liste toutes les tâches |
| `npm start -- lister a_faire` | Liste les tâches à faire |
| `npm start -- terminer 1` | Termine la tâche #1 |
| `npm start -- commencer 1` | Commence la tâche #1 |
| `npm start -- supprimer 1` | Supprime la tâche #1 |
| `npm start -- stats` | Affiche les statistiques |
| `npm run lint` | Vérifie les types |

---

## Pièges Fréquents

### Piège 1 : Oublier `--` après `npm start`

⚠️ **Problème** : Les arguments ne sont pas transmis au script Node.js.

```bash
# Les arguments "ajouter" et "titre" vont à npm, pas au script
npm start ajouter "titre"
```

✅ **Solution** : Utilise `--` pour séparer les arguments npm des arguments du script.

```bash
# Les arguments après -- sont transmis au script
npm start -- ajouter "titre"
```

---

### Piège 2 : Le fichier JSON corrompu

⚠️ **Problème** : Si tu modifies manuellement le fichier `taches.json` et que le JSON est invalide, le programme plante.

✅ **Solution** : Le service `StockageFichier` gère ce cas dans la méthode `charger()`. Si le fichier est corrompu, il repart avec un tableau vide. Supprime le fichier `taches.json` pour recommencer à zéro.

```bash
rm taches.json
```

---

### Piège 3 : Cast `as Priorite` sans validation

⚠️ **Problème** : Dans le point d'entrée, `args[3] as Priorite` ne vérifie pas que la valeur est valide.

✅ **Solution** : La validation est faite dans `TacheService.creer()`. Si la priorité est invalide, le Result pattern retourne une erreur. Dans un projet plus complet, on ajouterait une validation des arguments CLI dans le point d'entrée.

---

## Checklist de Validation

- [ ] Le projet compile sans erreur (`npm run lint`)
- [ ] Je peux ajouter une tâche avec titre, description et priorité
- [ ] Je peux lister toutes les tâches
- [ ] Je peux filtrer les tâches par statut et priorité
- [ ] Je peux commencer et terminer une tâche
- [ ] Je peux supprimer une tâche
- [ ] Les statistiques sont correctes
- [ ] Les erreurs sont gérées proprement (tâche inexistante, titre vide)
- [ ] Les données persistent entre les exécutions (fichier JSON)
- [ ] Le code utilise des types stricts (pas de `any`)

---

## Exercice Pratique

**Énoncé** : Étends le gestionnaire de tâches avec les fonctionnalités suivantes :

1. **Recherche** : Ajoute une commande `chercher <texte>` qui recherche dans les titres et descriptions
2. **Modification** : Ajoute une commande `modifier <id> <titre> [description]` qui modifie le titre et la description d'une tâche
3. **Export** : Ajoute une commande `exporter` qui affiche toutes les tâches au format JSON indenté dans le terminal
4. **Tri** : Modifie la commande `lister` pour trier par priorité (haute en premier) puis par date de création

**Indications** :

- Pour la recherche, utilise le `FiltreTache.recherche` existant
- Pour la modification, utilise `StockageFichier.mettreAJour()`
- Pour l'export, utilise `JSON.stringify(taches, null, 2)`
- Pour le tri, définis un poids par priorité : haute = 3, moyenne = 2, basse = 1

**Résultat attendu pour la recherche** :

```bash
npm start -- chercher "TypeScript"
```

```text
  [ ] #1 Apprendre TypeScript (HAUTE) - Terminer le cursus

  Total : 1 tâche(s)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Ajoute `MiseAJourTache` à l'import des types dans `src/index.ts` :

```typescript
import type { Priorite, Statut, FiltreTache, CreationTache, MiseAJourTache } from "./models/types";
```

Ajoute une méthode `modifier()` dans `TacheService` :

```typescript
  // Modifier le titre et/ou la description d'une tâche
  public modifier(id: number, modifications: MiseAJourTache): Result<Tache> {
    const tacheExistante: Tache | undefined = this.stockage.trouverParId(id);

    if (tacheExistante === undefined) {
      return erreur(`Tâche #${id} non trouvée`);
    }

    // Ajouter la date de modification
    const miseAJour: MiseAJourTache = {
      ...modifications,
      dateModification: new Date().toISOString(),
    };

    return this.stockage.mettreAJour(id, miseAJour);
  }
```

Ajoute ces cas dans le `switch` de `src/index.ts` :

```typescript
  case "chercher": {
    const texte: string = args[1] || "";

    if (texte.length === 0) {
      afficherErreur(
        'Le texte de recherche est requis. Exemple : npm start -- chercher "TypeScript"'
      );
      break;
    }

    const filtre: FiltreTache = { recherche: texte };
    const taches = service.lister(filtre);
    afficherListeTaches(taches);
    break;
  }

  case "modifier": {
    const id: number = parseInt(args[1], 10);
    const nouveauTitre: string = args[2] || "";

    if (isNaN(id) || nouveauTitre.length === 0) {
      afficherErreur(
        'Usage : npm start -- modifier <id> "nouveau titre" ["nouvelle description"]'
      );
      break;
    }

    const modifications: MiseAJourTache = {
      titre: nouveauTitre,
    };

    if (args[3] !== undefined) {
      modifications.description = args[3];
    }

    const resultat = service.modifier(id, modifications);

    if (resultat.succes) {
      afficherSucces(`Tâche #${id} modifiée :`);
      afficherTache(resultat.donnees);
    } else {
      afficherErreur(resultat.erreur);
    }
    break;
  }

  case "exporter": {
    const taches = service.lister();
    console.log(JSON.stringify(taches, null, 2));
    break;
  }
```

Pour le tri par priorité, ajoute cette méthode dans `TacheService` :

```typescript
  // Lister les tâches triées par priorité puis date
  public listerTriees(filtre?: FiltreTache): Tache[] {
    const poids: Record<Priorite, number> = {
      haute: 3,
      moyenne: 2,
      basse: 1,
    };

    const taches: Tache[] = this.lister(filtre);

    return taches.sort((a: Tache, b: Tache): number => {
      // Tri par priorité décroissante
      const diffPriorite: number = poids[b.priorite] - poids[a.priorite];
      if (diffPriorite !== 0) return diffPriorite;

      // À priorité égale, tri par date de création croissante
      return a.dateCreation.localeCompare(b.dateCreation);
    });
  }
```

---

## Navigation

← Fiche précédente : **[13 - Gestion d'erreurs typée](13-gestion-erreurs-typee.md)**

→ Fiche suivante : **[15 - Types avancés (mapped, conditional, template literal)](15-types-avances.md)**
