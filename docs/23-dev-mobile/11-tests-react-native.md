---
tags:
  - Mobile
  - Avancé
  - Pratique
description: "Tester une application React Native avec Jest et Testing Library : render, screen, fireEvent, mocks de navigation et de réseau, snapshot testing."
estimated_time: "90 min"
fiche_number: 11
total_fiches: 13
cursus: "Dev Mobile"
id: "web.mobile.tests-react-native"
course_id: "web.mobile"
content_type: "lesson"
order: 11
---

# 11 - Tests en React Native

> **En bref** : Tester les composants React Native avec Jest et @testing-library/react-native (render, screen, fireEvent), mocker la navigation et les appels réseau, et comprendre le snapshot testing avec ses limites. Lecture estimée : 90 min.

## Prérequis

- [Projet intégrateur](10-projet-integrateur.md) terminé : tu as une application mobile complète à tester
- Avoir lu la fiche [Tests React du cursus React](../08-react/15-tests-react.md) : les concepts de Testing Library y sont introduits
- Savoir créer des composants React Native avec `useState` (fiche [05 - Gestion de l'état et données](05-etat-donnees.md))
- Connaître la navigation (fiche [04 - Navigation](04-navigation.md)) et les appels réseau (fiche [06 - API et réseau](06-api-reseau.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer Jest et @testing-library/react-native, écrire des tests pour tes composants mobiles, simuler les interactions tactiles avec `fireEvent`, mocker la navigation React Navigation et les appels réseau, et utiliser le snapshot testing en connaissant ses limites.

---

## Concepts

Cette section explique les outils de test en React Native et en quoi ils ressemblent (ou diffèrent) de ceux du cursus React. Lis-la entièrement avant les étapes pratiques.

### Pourquoi tester une application mobile ?

**Définition** : Tester une application mobile, c'est écrire du code qui vérifie automatiquement que les écrans et composants se comportent comme prévu : ils affichent le bon contenu, réagissent correctement aux interactions tactiles et gèrent les états de chargement et d'erreur.

**Le problème que les tests mobiles résolvent** :

Sans tests automatisés :

1. **Vérification manuelle répétitive** : à chaque modification, il faut relancer l'application sur un appareil ou un simulateur et tester chaque écran à la main.
2. **Régressions invisibles** : corriger un bug dans un écran peut en casser un autre sans qu'on s'en aperçoive.
3. **Cycle lent** : lancer Expo, attendre le rechargement et naviguer jusqu'à l'écran concerné prend du temps à chaque fois.

**Comment les tests résolvent ces problèmes** :

| Problème | Solution apportée par les tests |
| --- | --- |
| Vérification manuelle répétitive | Les tests s'exécutent en quelques secondes, sans appareil |
| Régressions invisibles | Un test cassé signale immédiatement une régression |
| Cycle lent | Pas besoin de simulateur : Jest tourne dans Node.js |

**Analogie concrète** : Tester une application mobile est comme la liste de vérifications d'un pilote avant le décollage. Plutôt que de se fier à sa mémoire à chaque vol (vérification manuelle), le pilote suit une liste fixe qui garantit que rien d'essentiel n'est oublié. Les tests sont cette liste, exécutée automatiquement à chaque modification.

---

### Qu'est-ce que @testing-library/react-native ?

**Définition** : `@testing-library/react-native` est l'adaptation de Testing Library pour React Native. Elle rend les composants dans un arbre simulé (sans appareil ni simulateur) et fournit des requêtes (`getByText`, `getByRole`...) pour vérifier ce que l'utilisateur voit, exactement comme la version web le fait pour le DOM.

**Le problème qu'elle résout** :

Les composants React Native ne s'affichent pas dans un DOM HTML : il n'y a ni `<div>` ni `<button>`, mais des `<View>` et des `<Pressable>`. La version web de Testing Library ne sait pas les manipuler.

1. **Pas de DOM** : `@testing-library/react` cherche des éléments HTML, absents en React Native.
2. **Composants natifs spécifiques** : `<Text>`, `<View>`, `<TextInput>` ne sont pas des balises HTML.

**Comment elle résout ces problèmes** :

| Problème | Solution apportée par @testing-library/react-native |
| --- | --- |
| Pas de DOM | Elle rend les composants dans un arbre React Native simulé |
| Composants natifs spécifiques | Ses requêtes connaissent `<Text>`, `<TextInput>`, etc. |

**Analogie concrète** : C'est comme deux modèles de la même voiture, l'un pour la route (web, le DOM) et l'autre tout-terrain (mobile, l'arbre natif). Les commandes (volant, pédales) sont identiques (`render`, `screen`, `fireEvent`), mais le châssis est adapté au terrain. Tu réutilises ta façon de conduire ; seule la mécanique sous le capot change.

**Comparaison : Testing Library web vs React Native** :

| @testing-library/react (web) | @testing-library/react-native (mobile) |
| --- | --- |
| Rend dans un DOM (jsdom) | Rend dans un arbre React Native simulé |
| Cible `<div>`, `<button>`, `<input>` | Cible `<View>`, `<Pressable>`, `<TextInput>` |
| Interactions via `userEvent` (recommandé) | Interactions via `userEvent` (recommandé, v12+) ou `fireEvent` |
| `getByRole("button")` | `getByText`, `getByPlaceholderText`, `getByTestId` |

---

### Qu'est-ce que Jest dans React Native ?

**Définition** : Jest est le framework de test utilisé par défaut en React Native. Il exécute les fichiers de test, fournit les fonctions `describe`, `it`, `expect`, et gère les "mocks" (versions simulées de modules). Expo fournit un préréglage Jest prêt à l'emploi : `jest-expo`.

**Le problème que Jest + jest-expo résout** :

1. **Modules natifs absents** : beaucoup de modules Expo (caméra, stockage sécurisé) n'existent pas dans Node.js. Sans préparation, leur import fait échouer les tests.
2. **Syntaxe moderne à transformer** : le code React Native utilise JSX et la syntaxe ESM, que Node.js ne comprend pas tel quel.

**Comment Jest + jest-expo résout ces problèmes** :

| Problème | Solution apportée par jest-expo |
| --- | --- |
| Modules natifs absents | Le préréglage fournit des mocks par défaut pour Expo |
| Syntaxe moderne à transformer | Le préréglage configure la transformation du code |

**Comparaison : Vitest (cursus React) vs Jest (mobile)** :

| Vitest (fiche React 15) | Jest (React Native) |
| --- | --- |
| Lié à Vite (web) | Standard de l'écosystème React Native |
| `import { describe, it } from "vitest"` | `describe`, `it` globaux (pas d'import) |
| Environnement jsdom | Préréglage `jest-expo` |
| `vi.fn()` pour les mocks | `jest.fn()` pour les mocks |

La logique est la même que dans la fiche React 15 ; seuls les noms changent (`jest` au lieu de `vi`, pas d'import des fonctions de test).

---

### Qu'est-ce qu'un mock (simulation) ?

**Définition** : Un mock est une version simulée d'un module ou d'une fonction, utilisée à la place de la vraie pendant un test. Il permet d'isoler le composant testé en remplaçant ses dépendances externes (navigation, réseau, modules natifs) par des versions contrôlées.

**Le problème que les mocks résolvent** :

Un écran réel dépend de choses qu'on ne veut pas exécuter dans un test :

1. **Vrais appels réseau** : lents, dépendants d'internet, et ils renverraient des données imprévisibles.
2. **Navigation réelle** : un test ne change pas vraiment d'écran ; on veut juste vérifier que la navigation a été demandée.
3. **Modules natifs** : la caméra ou le stockage sécurisé n'existent pas hors d'un appareil.

**Comment les mocks résolvent ces problèmes** :

| Problème | Solution apportée par les mocks |
| --- | --- |
| Vrais appels réseau | On simule la réponse, instantanée et prévisible |
| Navigation réelle | On vérifie que `navigate` a été appelé avec les bons arguments |
| Modules natifs | On remplace le module par une version factice |

**Analogie concrète** : Un mock est comme un mannequin de crash-test. Pour tester la sécurité d'une voiture, on n'utilise pas un vrai passager (le vrai module). On utilise un mannequin (le mock) qui reproduit ce qui nous intéresse (la position, le poids) sans les inconvénients (le risque). De même, un mock de réseau reproduit la réponse attendue sans faire de vrai appel.

---

### Qu'est-ce que le snapshot testing ?

**Définition** : Le snapshot testing enregistre une "photographie" textuelle de l'arbre rendu d'un composant dans un fichier. Au prochain lancement, Jest compare le nouveau rendu à la photo enregistrée et signale toute différence.

**Le problème que le snapshot testing résout** :

1. **Détecter les changements inattendus** : si un rendu change sans qu'on l'ait voulu, le snapshot ne correspond plus et le test échoue.

**Comment le snapshot testing aide, et ses limites** :

| Aspect | Détail |
| --- | --- |
| Avantage | Détecte tout changement visuel de structure d'un coup |
| Limite 1 | Un snapshot ne dit pas si le rendu est _correct_, seulement s'il a _changé_ |
| Limite 2 | Les snapshots cassent à chaque modification légitime, créant du bruit |
| Limite 3 | On les met à jour parfois sans les relire, ce qui annule leur intérêt |

**Analogie concrète** : Un snapshot est comme une photo "avant/après" d'une pièce. Elle révèle instantanément qu'un meuble a bougé (un changement), mais elle ne dit pas si la nouvelle disposition est _meilleure_. Et si tu redécores volontairement, la photo de référence devient inutile : il faut en reprendre une, sans réfléchir, ce qui fait perdre sa valeur de contrôle.

**Réserve importante** : le snapshot testing est utile avec modération, pour de petits composants d'affichage stables. Il ne remplace pas les tests de comportement (vérifier qu'un clic déclenche la bonne action). Privilégie toujours les tests qui vérifient ce que fait l'utilisateur.

**Ce que le snapshot testing n'est PAS** :

- Un snapshot n'est pas un test de comportement. Il ne vérifie aucune interaction ni logique : il compare seulement deux rendus.
- Un snapshot n'est pas une garantie de qualité. Un composant bogué a quand même un snapshot stable tant que son rendu ne change pas.

---

## Étapes Pratiques

Pour ces exemples, repars du projet `task-manager` créé dans la fiche [10 - Projet intégrateur](10-projet-integrateur.md), ou de tout projet Expo + TypeScript.

### Étape 1 : Installer et configurer Jest

```bash
# Installe Jest, le préréglage Expo et Testing Library pour React Native
npm install --save-dev jest jest-expo @testing-library/react-native @types/jest
```

**Ce que chaque paquet fait** :

| Paquet | Rôle |
| --- | --- |
| `jest` | Framework de test |
| `jest-expo` | Préréglage Jest adapté à Expo (mocks natifs inclus) |
| `@testing-library/react-native` | Rendu et requêtes pour composants React Native |
| `@types/jest` | Types TypeScript pour `describe`, `it`, `expect` |

Configure Jest dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

**Résultat attendu** :

```text
Les paquets sont installés. La commande npm test s'exécute sans erreur de
configuration (Jest affiche qu'aucun test n'a encore été trouvé tant
qu'aucun fichier .test.tsx n'existe).
```

---

### Étape 2 : Premier test de composant

Crée `components/Salutation.tsx` :

```tsx
// components/Salutation.tsx
import { View, Text } from "react-native";

interface PropsSalutation {
  nom: string;
}

export default function Salutation({ nom }: PropsSalutation) {
  return (
    <View>
      <Text>Bonjour {nom}</Text>
      <Text>Bienvenue dans l'application.</Text>
    </View>
  );
}
```

Crée `components/Salutation.test.tsx` :

```tsx
// components/Salutation.test.tsx
import { render, screen } from "@testing-library/react-native";
import Salutation from "./Salutation";

// Pas besoin d'importer describe/it/expect : Jest les fournit globalement
describe("Salutation", () => {
  it("affiche le nom de l'utilisateur", () => {
    // render affiche le composant dans un arbre React Native simulé
    render(<Salutation nom="Alice" />);

    // screen.getByText cherche un Text contenant le texte donné
    // L'expression régulière /bonjour alice/i ignore la casse
    expect(screen.getByText(/bonjour alice/i)).toBeTruthy();
  });

  it("affiche le message de bienvenue", () => {
    render(<Salutation nom="Bob" />);
    expect(screen.getByText(/bienvenue dans l'application/i)).toBeTruthy();
  });
});
```

**Résultat attendu** :

```text
 PASS  components/Salutation.test.tsx
  Salutation
    ✓ affiche le nom de l'utilisateur
    ✓ affiche le message de bienvenue

Tests:       2 passed, 2 total
```

> **Note** : sur le web, on écrit `toBeInTheDocument()`. En React Native, il n'y a pas de "document", donc on utilise `toBeTruthy()` (l'élément a été trouvé) ou les matchers spécifiques de la bibliothèque.

---

### Étape 3 : Tester les interactions avec fireEvent

Crée `components/Compteur.tsx` :

```tsx
// components/Compteur.tsx
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

export default function Compteur() {
  const [valeur, setValeur] = useState(0);

  return (
    <View>
      <Text>Compteur : {valeur}</Text>

      {/* Pressable est l'équivalent mobile d'un bouton cliquable */}
      <Pressable onPress={() => setValeur((v) => v + 1)}>
        <Text>Incrémenter</Text>
      </Pressable>

      <Pressable onPress={() => setValeur(0)}>
        <Text>Réinitialiser</Text>
      </Pressable>
    </View>
  );
}
```

Crée `components/Compteur.test.tsx` :

```tsx
// components/Compteur.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import Compteur from "./Compteur";

describe("Compteur", () => {
  it("affiche la valeur initiale 0", () => {
    render(<Compteur />);
    expect(screen.getByText(/compteur : 0/i)).toBeTruthy();
  });

  it("incrémente quand on appuie sur Incrémenter", () => {
    render(<Compteur />);

    // fireEvent.press simule une pression sur l'élément trouvé
    fireEvent.press(screen.getByText(/incrémenter/i));

    // La valeur affichée a changé
    expect(screen.getByText(/compteur : 1/i)).toBeTruthy();
  });

  it("réinitialise la valeur à 0", () => {
    render(<Compteur />);

    // Incrémente deux fois
    fireEvent.press(screen.getByText(/incrémenter/i));
    fireEvent.press(screen.getByText(/incrémenter/i));
    expect(screen.getByText(/compteur : 2/i)).toBeTruthy();

    // Réinitialise
    fireEvent.press(screen.getByText(/réinitialiser/i));
    expect(screen.getByText(/compteur : 0/i)).toBeTruthy();
  });
});
```

**Résultat attendu** :

```text
 PASS  components/Compteur.test.tsx
  Compteur
    ✓ affiche la valeur initiale 0
    ✓ incrémente quand on appuie sur Incrémenter
    ✓ réinitialise la valeur à 0
```

> **Note** : `fireEvent.press` est fonctionnel et reste utilisé dans cette fiche pour sa simplicité. Depuis React Native Testing Library v12, la recommandation officielle est d'utiliser `userEvent` pour les interactions tactiles : il reproduit la séquence complète d'événements (pressIn, press, pressOut), ce qui est plus fidèle au comportement réel. Voir l'étape suivante.

---

### Étape 3b : Interactions réalistes avec userEvent (recommandé depuis RNTL v12)

`userEvent` simule l'intégralité de la séquence tactile, là où `fireEvent.press` appelle uniquement le handler `onPress`. Pour des tests plus proches du comportement réel de l'utilisateur, préfère `userEvent`.

Crée `components/Compteur.userevent.test.tsx` :

```tsx
// components/Compteur.userevent.test.tsx
import { render, screen, userEvent } from "@testing-library/react-native";
import Compteur from "./Compteur";

// userEvent.setup() crée un contexte d'interaction réaliste
// Les tests avec userEvent doivent être async
describe("Compteur (userEvent)", () => {
  it("incrémente quand on appuie sur Incrémenter", async () => {
    const user = userEvent.setup();
    render(<Compteur />);

    // user.press() reproduit la séquence pressIn -> press -> pressOut
    await user.press(screen.getByText(/incrémenter/i));

    expect(screen.getByText(/compteur : 1/i)).toBeTruthy();
  });

  it("réinitialise après plusieurs appuis", async () => {
    const user = userEvent.setup();
    render(<Compteur />);

    await user.press(screen.getByText(/incrémenter/i));
    await user.press(screen.getByText(/incrémenter/i));
    expect(screen.getByText(/compteur : 2/i)).toBeTruthy();

    await user.press(screen.getByText(/réinitialiser/i));
    expect(screen.getByText(/compteur : 0/i)).toBeTruthy();
  });
});
```

**Différences clés entre fireEvent et userEvent** :

| Aspect | `fireEvent.press` | `userEvent.press` (recommandé) |
| --- | --- | --- |
| Événements émis | `onPress` uniquement | `pressIn` + `press` + `pressOut` |
| API | Synchrone | Asynchrone (`await`) |
| Fidélité | Partielle | Proche du comportement réel |
| Version requise | Toutes versions RNTL | RNTL v12.2.0+ |

**Résultat attendu** :

```text
 PASS  components/Compteur.userevent.test.tsx
  Compteur (userEvent)
    ✓ incrémente quand on appuie sur Incrémenter
    ✓ réinitialise après plusieurs appuis
```

> **Recommandation** : pour les nouveaux tests, utilise `userEvent` pour les interactions tactiles. `fireEvent` reste valide pour les cas non couverts par `userEvent` (événements personnalisés, composants composites complexes).

---

### Étape 4 : Tester un champ de saisie

Crée `components/ChampNom.tsx` :

```tsx
// components/ChampNom.tsx
import { useState } from "react";
import { View, Text, TextInput } from "react-native";

export default function ChampNom() {
  const [nom, setNom] = useState("");

  return (
    <View>
      <TextInput
        placeholder="Ton prénom"
        value={nom}
        onChangeText={setNom}
      />
      {/* Affiche un aperçu seulement si un nom est saisi */}
      {nom.length > 0 && <Text>Bonjour {nom}</Text>}
    </View>
  );
}
```

Crée `components/ChampNom.test.tsx` :

```tsx
// components/ChampNom.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import ChampNom from "./ChampNom";

describe("ChampNom", () => {
  it("n'affiche pas de salutation au départ", () => {
    render(<ChampNom />);
    // queryByText retourne null si l'élément n'existe pas (pas d'erreur)
    expect(screen.queryByText(/bonjour/i)).toBeNull();
  });

  it("affiche la salutation quand on saisit un nom", () => {
    render(<ChampNom />);

    // getByPlaceholderText cible le TextInput par son placeholder
    const champ = screen.getByPlaceholderText(/ton prénom/i);

    // fireEvent.changeText simule la saisie de texte
    fireEvent.changeText(champ, "Camille");

    expect(screen.getByText(/bonjour camille/i)).toBeTruthy();
  });
});
```

**Résultat attendu** :

```text
 PASS  components/ChampNom.test.tsx
  ChampNom
    ✓ n'affiche pas de salutation au départ
    ✓ affiche la salutation quand on saisit un nom
```

---

### Étape 5 : Mocker la navigation

Un écran utilise souvent `useNavigation` de React Navigation. Dans un test, on remplace ce hook par un mock pour vérifier que la navigation est demandée, sans changer réellement d'écran.

Crée `components/CarteTache.tsx` :

```tsx
// components/CarteTache.tsx
import { Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface PropsCarteTache {
  id: number;
  titre: string;
}

export default function CarteTache({ id, titre }: PropsCarteTache) {
  const navigation = useNavigation<any>();

  return (
    <Pressable onPress={() => navigation.navigate("TaskDetail", { taskId: id })}>
      <Text>{titre}</Text>
    </Pressable>
  );
}
```

Crée `components/CarteTache.test.tsx` :

```tsx
// components/CarteTache.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import CarteTache from "./CarteTache";

// Crée une fonction mock pour observer les appels à navigate
const mockNavigate = jest.fn();

// Remplace tout le module @react-navigation/native par une version simulée
// useNavigation retournera notre objet avec navigate mocké
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe("CarteTache", () => {
  beforeEach(() => {
    // Réinitialise le mock avant chaque test pour éviter les fuites d'état
    mockNavigate.mockClear();
  });

  it("affiche le titre de la tâche", () => {
    render(<CarteTache id={1} titre="Acheter du pain" />);
    expect(screen.getByText("Acheter du pain")).toBeTruthy();
  });

  it("navigue vers le détail au clic, avec le bon identifiant", () => {
    render(<CarteTache id={42} titre="Acheter du pain" />);

    // Simule la pression sur la carte
    fireEvent.press(screen.getByText("Acheter du pain"));

    // Vérifie que navigate a été appelé avec l'écran et les paramètres attendus
    expect(mockNavigate).toHaveBeenCalledWith("TaskDetail", { taskId: 42 });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
```

**Résultat attendu** :

```text
 PASS  components/CarteTache.test.tsx
  CarteTache
    ✓ affiche le titre de la tâche
    ✓ navigue vers le détail au clic, avec le bon identifiant
```

---

### Étape 6 : Mocker les appels réseau

Pour tester un écran qui charge des données, on simule la réponse réseau. Ici, on mocke la fonction globale `fetch`.

Crée `components/ListeTitres.tsx` :

```tsx
// components/ListeTitres.tsx
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface Article {
  id: number;
  title: string;
}

export default function ListeTitres() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Charge les articles depuis l'API au montage
    fetch("https://exemple.test/articles")
      .then((r) => r.json())
      .then((data: Article[]) => setArticles(data))
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {articles.map((a) => (
        <Text key={a.id}>{a.title}</Text>
      ))}
    </View>
  );
}
```

Crée `components/ListeTitres.test.tsx` :

```tsx
// components/ListeTitres.test.tsx
import { render, screen, waitFor } from "@testing-library/react-native";
import ListeTitres from "./ListeTitres";

describe("ListeTitres", () => {
  beforeEach(() => {
    // Remplace fetch par un mock qui renvoie deux articles
    global.fetch = jest.fn(() =>
      Promise.resolve({
        // json renvoie une promesse, comme le vrai fetch
        json: () =>
          Promise.resolve([
            { id: 1, title: "Premier article" },
            { id: 2, title: "Deuxième article" },
          ]),
      })
    ) as jest.Mock;
  });

  it("affiche les titres après le chargement", async () => {
    render(<ListeTitres />);

    // waitFor attend que l'élément apparaisse (le chargement est asynchrone)
    await waitFor(() => {
      expect(screen.getByText("Premier article")).toBeTruthy();
    });

    // Une fois chargé, le second titre est aussi présent
    expect(screen.getByText("Deuxième article")).toBeTruthy();
  });
});
```

**Résultat attendu** :

```text
 PASS  components/ListeTitres.test.tsx
  ListeTitres
    ✓ affiche les titres après le chargement
```

---

### Étape 7 : Snapshot testing (avec réserve)

Crée un test snapshot pour le composant `Salutation` de l'étape 2 :

```tsx
// components/Salutation.snapshot.test.tsx
import { render } from "@testing-library/react-native";
import Salutation from "./Salutation";

describe("Salutation (snapshot)", () => {
  it("correspond au snapshot enregistré", () => {
    // toJSON() retourne l'arbre rendu sous forme sérialisable
    const arbre = render(<Salutation nom="Alice" />).toJSON();

    // Au premier lancement, Jest crée le snapshot de référence
    // Aux lancements suivants, il compare le rendu à ce snapshot
    expect(arbre).toMatchSnapshot();
  });
});
```

**Résultat attendu** :

```text
 PASS  components/Salutation.snapshot.test.tsx
  Salutation (snapshot)
    ✓ correspond au snapshot enregistré

 › 1 snapshot written.
```

Au premier lancement, un fichier `__snapshots__/Salutation.snapshot.test.tsx.snap` est créé. Aux lancements suivants, toute modification du rendu de `Salutation` fera échouer ce test.

> **Réserve** : ce test ne vérifie pas que le rendu est _correct_, seulement qu'il n'a pas _changé_. Réserve les snapshots à de petits composants d'affichage stables, et relis toujours le contenu d'un snapshot avant de le mettre à jour avec `jest --updateSnapshot`. Pour la logique et les interactions, garde les tests de comportement des étapes précédentes.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm test` | Lance tous les tests une fois |
| `npm run test:watch` | Lance Jest en mode surveillance (relance à chaque modification) |
| `npx jest CarteTache` | Lance uniquement les tests dont le fichier contient "CarteTache" |
| `npx jest --updateSnapshot` | Met à jour les snapshots (à utiliser après relecture) |
| `npx jest --coverage` | Lance les tests avec le rapport de couverture |

---

## Pièges Fréquents

### Piège 1 : Importer la mauvaise version de Testing Library

⚠️ **Problème** : Importer depuis `@testing-library/react` (la version web) au lieu de `@testing-library/react-native`. Les requêtes échouent car elles cherchent des éléments du DOM, absents en React Native.

✅ **Solution** : Importe toujours depuis `@testing-library/react-native` dans un projet mobile.

```tsx
// ❌ Incorrect : version web
import { render } from "@testing-library/react";

// ✅ Correct : version React Native
import { render } from "@testing-library/react-native";
```

---

### Piège 2 : Utiliser userEvent.click (web) au lieu des APIs tactiles React Native

⚠️ **Problème** : Reprendre `userEvent.click(...)` du cursus React web. En React Native, il n'y a pas de "clic" : les interactions sont tactiles, et l'API s'appelle `press`.

✅ **Solution** : Utilise `userEvent.press` (recommandé, RNTL v12+) ou `fireEvent.press` pour une pression, et `fireEvent.changeText` pour la saisie.

```tsx
// ❌ Incorrect : "click" est une interaction web, inexistante en React Native
await user.click(bouton);

// ✅ Correct (recommandé) : userEvent.press reproduit la séquence tactile complète
const user = userEvent.setup();
await user.press(bouton);

// ✅ Correct aussi : fireEvent.press, plus simple, appelle onPress directement
fireEvent.press(bouton);
```

---

### Piège 3 : Oublier waitFor pour le contenu asynchrone

⚠️ **Problème** : Chercher avec `getByText` un élément qui n'apparaît qu'après un appel réseau. Le test échoue car l'élément n'existe pas encore au moment de la vérification.

✅ **Solution** : Enveloppe la vérification dans `waitFor`, ou utilise `findByText` (asynchrone), pour laisser le temps au rendu de se mettre à jour.

```tsx
// ❌ Échoue : l'article n'est pas encore chargé
expect(screen.getByText("Premier article")).toBeTruthy();

// ✅ Attend que l'élément apparaisse
await waitFor(() => {
  expect(screen.getByText("Premier article")).toBeTruthy();
});
```

---

### Piège 4 : Mettre à jour un snapshot sans le relire

⚠️ **Problème** : Lancer `jest --updateSnapshot` dès qu'un test snapshot échoue, sans vérifier la différence. On valide ainsi une régression sans s'en rendre compte.

✅ **Solution** : Lis toujours la différence affichée par Jest. Ne mets à jour le snapshot que si le changement est volontaire et correct.

---

## Checklist de Validation

- [ ] Je sais installer et configurer Jest avec le préréglage `jest-expo`
- [ ] Je sais écrire un test de rendu avec `render` et `screen.getByText`
- [ ] Je sais simuler une pression avec `fireEvent.press`
- [ ] Je sais simuler une pression réaliste avec `userEvent.setup()` + `user.press()` (RNTL v12+)
- [ ] Je comprends la différence entre `fireEvent` et `userEvent` et quand préférer l'un ou l'autre
- [ ] Je sais simuler une saisie avec `fireEvent.changeText`
- [ ] Je sais mocker `useNavigation` et vérifier l'appel à `navigate`
- [ ] Je sais mocker `fetch` et tester un chargement asynchrone avec `waitFor`
- [ ] Je comprends le snapshot testing et ses limites

---

## Exercice Pratique

**Énoncé** : Écris une suite de tests pour un écran de connexion mobile `LoginScreen` simplifié, inspiré du projet intégrateur (fiche 10).

Le composant à tester (à créer dans `screens/LoginScreen.tsx`) :

```tsx
// screens/LoginScreen.tsx
import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  const seConnecter = () => {
    // Validation simple de l'email
    if (!email.includes("@")) {
      setErreur("Email invalide");
      return;
    }
    setErreur(null);
    // Navigue vers l'écran d'accueil après connexion
    navigation.navigate("Home");
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {erreur && <Text>{erreur}</Text>}
      <Pressable onPress={seConnecter}>
        <Text>Se connecter</Text>
      </Pressable>
    </View>
  );
}
```

**Indications** :

- Mocke `@react-navigation/native` pour observer les appels à `navigate` (comme à l'étape 5).
- Écris un test qui saisit un email invalide (sans arobase), appuie sur "Se connecter", et vérifie que le message "Email invalide" s'affiche et que `navigate` n'est PAS appelé.
- Écris un test qui saisit un email valide, appuie sur "Se connecter", et vérifie que `navigate` est appelé avec `"Home"`.
- Utilise `fireEvent.changeText` pour la saisie et `fireEvent.press` pour le bouton.
- Réinitialise le mock de navigation dans un `beforeEach`.

**Résultat attendu** : deux tests qui passent, l'un vérifiant le rejet d'un email invalide (avec affichage de l'erreur et absence de navigation), l'autre vérifiant la navigation après un email valide.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée `screens/LoginScreen.test.tsx` :

```tsx
// screens/LoginScreen.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import LoginScreen from "./LoginScreen";

// Fonction mock pour observer les navigations
const mockNavigate = jest.fn();

// Remplace le module de navigation par une version simulée
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    // Réinitialise le mock avant chaque test
    mockNavigate.mockClear();
  });

  it("affiche une erreur et ne navigue pas si l'email est invalide", () => {
    render(<LoginScreen />);

    // Saisit un email sans arobase
    fireEvent.changeText(screen.getByPlaceholderText(/email/i), "alice.exemple");

    // Appuie sur le bouton de connexion
    fireEvent.press(screen.getByText(/se connecter/i));

    // Le message d'erreur s'affiche
    expect(screen.getByText(/email invalide/i)).toBeTruthy();

    // La navigation n'a PAS été déclenchée
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigue vers Home si l'email est valide", () => {
    render(<LoginScreen />);

    // Saisit un email valide
    fireEvent.changeText(
      screen.getByPlaceholderText(/email/i),
      "alice@exemple.fr"
    );

    // Appuie sur le bouton de connexion
    fireEvent.press(screen.getByText(/se connecter/i));

    // Aucun message d'erreur n'est affiché
    expect(screen.queryByText(/email invalide/i)).toBeNull();

    // La navigation vers Home a été déclenchée une fois
    expect(mockNavigate).toHaveBeenCalledWith("Home");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
```

### Vérification

Lance les tests :

```bash
# Lance tous les tests une fois
npm test
```

**Résultat attendu** :

```text
 PASS  screens/LoginScreen.test.tsx
  LoginScreen
    ✓ affiche une erreur et ne navigue pas si l'email est invalide
    ✓ navigue vers Home si l'email est valide

Tests:       2 passed, 2 total
```

Le premier test prouve que la validation bloque un email invalide (erreur affichée, pas de navigation). Le second prouve que la navigation se déclenche avec le bon écran après un email valide. Les deux reposent sur le mock de navigation et `fireEvent`, sans aucun appareil ni simulateur.

---

## Navigation

← Fiche précédente : **[10 - Projet intégrateur](10-projet-integrateur.md)**

→ Fiche suivante : **[12 - Listes performantes avec FlashList](12-listes-performantes.md)**
