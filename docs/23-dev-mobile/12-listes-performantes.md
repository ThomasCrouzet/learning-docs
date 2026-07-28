---
tags:
  - Mobile
  - Avancé
  - Pratique
description: "Afficher de longues listes fluides en React Native avec FlashList v2 : limites de FlatList, recyclage des vues, New Architecture et migration FlatList vers FlashList."
estimated_time: "75 min"
fiche_number: 12
total_fiches: 13
cursus: "Dev Mobile"
---

# 12 - Listes performantes avec FlashList

> **En bref** : Dépasser les ralentissements de FlatList sur les très longues listes avec `@shopify/flash-list` v2, comprendre le recyclage des vues et la New Architecture, puis migrer une liste FlatList existante vers FlashList. Lecture estimée : 75 min.

## Prérequis

- [Composants de base](03-composants-base.md) terminée : tu sais utiliser `FlatList` avec `data`, `renderItem` et `keyExtractor`
- [API et réseau](06-api-reseau.md) terminée : tu sais charger des données distantes pour les afficher en liste
- Savoir créer des composants React Native avec `StyleSheet`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi FlatList ralentit sur les très longues listes, installer et utiliser `@shopify/flash-list` v2, comprendre le recyclage des vues et la New Architecture, et migrer une liste FlatList existante vers FlashList sans réécrire ta logique.

---

## Concepts

Cette section explique d'abord les limites de FlatList sur de gros volumes, puis comment FlashList y répond. Lis-la entièrement avant les étapes pratiques.

### Les limites de FlatList sur les longues listes

**Définition** : `FlatList` (vue à la fiche 3) est le composant React Native standard pour afficher une liste. Il ne rend que les éléments visibles à l'écran (le "fenêtrage") plutôt que toute la liste d'un coup, ce qui le rend déjà bien meilleur qu'un `ScrollView` rempli d'éléments.

**Le problème que FlatList pose sur de très grandes listes** :

FlatList suffit pour quelques dizaines d'éléments. Mais sur des listes de plusieurs milliers d'éléments, ou avec un défilement rapide, ses limites apparaissent :

1. **Création et destruction de vues** : quand un élément sort de l'écran, FlatList détruit sa vue ; quand un nouvel élément entre, il en crée une neuve. Ces créations répétées coûtent cher au défilement rapide.
2. **Cases blanches au défilement rapide** : si l'utilisateur fait défiler plus vite que FlatList ne peut créer les vues, des zones vides ("blank cells") apparaissent le temps que le contenu se dessine.
3. **Réglages manuels délicats** : pour améliorer les performances, FlatList expose des options comme `windowSize`, `maxToRenderPerBatch` ou `getItemLayout`, difficiles à régler correctement.

**Comment FlashList résout ces problèmes** :

| Limite de FlatList | Solution apportée par FlashList |
| --- | --- |
| Création/destruction de vues | Recyclage : les vues sont réutilisées au lieu d'être recréées |
| Cases blanches au défilement | Le recyclage garde des vues prêtes, réduisant les zones vides |
| Réglages manuels délicats | Aucun réglage de taille manuelle : FlashList v2 mesure automatiquement |

**Analogie concrète** : FlatList, c'est comme jeter chaque assiette sale et en acheter une neuve à chaque service (création/destruction). FlashList, c'est laver l'assiette et la réutiliser pour le client suivant (le recyclage). Quand le restaurant est calme, les deux méthodes se valent. Mais en plein coup de feu (défilement rapide sur une longue liste), réutiliser la vaisselle évite la rupture de stock (les cases blanches).

**Ce que ce problème n'est PAS** :

- Ce n'est pas que FlatList soit "mauvais". Pour une liste courte ou moyenne, FlatList est parfaitement adapté et reste le choix par défaut de React Native. Le besoin de FlashList n'apparaît que sur de gros volumes ou un défilement intensif.

---

### Qu'est-ce que FlashList ?

**Définition** : FlashList (`@shopify/flash-list`) est un composant de liste créé par Shopify pour remplacer FlatList sur les listes exigeantes. Son interface (props `data`, `renderItem`, `keyExtractor`) est volontairement très proche de celle de FlatList, mais son moteur **recycle** les vues au lieu de les recréer, ce qui le rend plus fluide sur les grands volumes.

**Le problème que FlashList résout** :

1. **Fluidité sur gros volumes** : il maintient un défilement fluide là où FlatList saccade.
2. **Migration coûteuse** : remplacer une liste exigeante ne devrait pas obliger à tout réécrire.

**Comment FlashList résout ces problèmes** :

| Problème | Solution apportée par FlashList |
| --- | --- |
| Fluidité sur gros volumes | Le recyclage des vues réduit le coût du défilement |
| Migration coûteuse | L'interface reprend celle de FlatList (changements minimes) |

**Analogie concrète** : FlashList est comme un tapis roulant de bagages dans un aéroport. Les plateaux (les vues) ne sont pas fabriqués puis jetés à chaque valise : ils tournent en boucle et reçoivent une nouvelle valise (de nouvelles données) à chaque passage (le recyclage). Le système gère un flux continu sans s'arrêter pour produire de nouveaux plateaux.

**Ce que FlashList n'est PAS** :

- FlashList n'est pas un remplacement obligatoire de FlatList partout. Pour une liste de 10 éléments, il n'apporte rien et FlatList suffit.
- FlashList n'est pas une solution à un mauvais rendu d'élément. Si chaque ligne est lourde à dessiner (images non optimisées, calculs coûteux), il faut aussi alléger le composant de ligne, pas seulement changer de liste.

**Comparaison : FlatList vs FlashList** :

| FlatList | FlashList v2 |
| --- | --- |
| Crée et détruit les vues | Recycle les vues |
| Réglages multiples (`windowSize`, `getItemLayout`...) | Aucun réglage de taille : mesure automatique |
| Cases blanches possibles au défilement rapide | Cases blanches fortement réduites |
| Fonctionne sur l'ancienne et la nouvelle architecture | Requiert la New Architecture React Native |
| Idéal pour listes courtes à moyennes | Idéal pour listes longues ou défilement intensif |

---

### Qu'est-ce que le recyclage des vues ?

**Définition** : Le recyclage des vues consiste à réutiliser les composants déjà créés pour afficher de nouvelles données, au lieu de détruire la vue d'un élément qui sort de l'écran et d'en créer une pour celui qui entre. Quand une ligne disparaît en haut, sa vue est "recyclée" pour la ligne qui apparaît en bas, avec de nouvelles données.

**Le problème que le recyclage résout** :

1. **Coût de création** : créer une vue React Native (un composant et ses éléments natifs) prend du temps. Le répéter à chaque défilement sature le fil principal.

**Comment le recyclage résout ce problème** :

| Problème | Solution apportée par le recyclage |
| --- | --- |
| Coût de création répété | On réutilise un nombre limité de vues, sans en recréer |

**Conséquence pratique** : une vue recyclée garde la structure de la ligne précédente jusqu'à recevoir les nouvelles données. Tu dois donc t'assurer que chaque ligne affiche **toujours** ses propres données et ne conserve pas d'état résiduel d'un élément précédent (voir les pièges).

**Analogie concrète** : Le recyclage des vues, c'est le principe des gobelets réutilisables d'une fontaine à eau partagée, lavés entre chaque usage, plutôt que des gobelets jetables. Le même gobelet sert à des dizaines de personnes (les éléments), à condition d'être bien rincé à chaque fois (recevoir les bonnes données).

---

### FlashList v2 et la New Architecture React Native

**Définition** : La New Architecture de React Native (stabilisée en 2024 et activée par défaut dans Expo SDK 52+) est une réécriture des couches de communication entre JavaScript et le code natif. Elle remplace l'ancien "bridge" asynchrone par une interface synchrone beaucoup plus rapide.

**Pourquoi FlashList v2 la requiert** :

FlashList v2 est une réécriture complète, conçue spécifiquement pour tirer parti des mécanismes de la New Architecture :

1. **Mesure automatique** : la New Architecture permet à FlashList v2 de mesurer les dimensions de chaque vue en temps réel, sans estimation préalable. La prop `estimatedItemSize` des versions précédentes est supprimée.
2. **Performance accrue** : la synchronisation directe entre JS et le natif réduit les délais de recyclage.
3. **Incompatibilité avec l'ancienne architecture** : FlashList v2 ne peut pas être utilisé sur l'ancienne architecture (celle des projets créés avant Expo SDK 52 sans migration explicite).

**Ce que cela signifie en pratique** :

| Aspect | FlashList v1.x | FlashList v2.x |
| --- | --- | --- |
| Architecture requise | Ancienne ou nouvelle | New Architecture uniquement |
| Réglage de taille | `estimatedItemSize` (prop obligatoire) | Supprimé : mesure automatique |
| Expo SDK recommandé | SDK 45-51 | SDK 52+ (New Architecture activée) |

> **Note** : Expo SDK 52 et supérieur active la New Architecture par défaut. Si tu démarres un nouveau projet avec `npx create-expo-app` en 2025-2026, tu es déjà sur la New Architecture. Si ton projet est plus ancien, consulte le guide de migration Expo avant d'installer FlashList v2.

**Ce que FlashList v2 n'est PAS** :

- La prop `estimatedItemSize` n'est **pas** renommée ou optionnelle en v2 : elle est **supprimée**. FlashList v2 n'en a plus besoin du tout. Si tu la fournis par habitude depuis la v1, elle est ignorée (et peut générer un avertissement).

---

## Étapes Pratiques

Pour ces exemples, repars du projet `task-manager` des fiches précédentes, ou de tout projet Expo + TypeScript (Expo SDK 57, React Native 0.86, ou versions voisines installées par `create-expo-app@latest`).

### Étape 1 : Le point de départ avec FlatList

Voici une liste FlatList classique qui affiche 5000 éléments générés. Crée `components/ListeFlatList.tsx` :

```tsx
// components/ListeFlatList.tsx
import { FlatList, View, Text, StyleSheet } from "react-native";

// Un élément de la liste
interface Produit {
  id: number;
  nom: string;
}

// Génère 5000 produits pour simuler une longue liste
const produits: Produit[] = Array.from({ length: 5000 }, (_, index) => ({
  id: index,
  nom: `Produit ${index}`,
}));

export default function ListeFlatList() {
  return (
    <FlatList
      data={produits}
      // keyExtractor donne une clé stable à chaque élément
      keyExtractor={(item) => String(item.id)}
      // renderItem décrit l'affichage d'une ligne
      renderItem={({ item }) => (
        <View style={styles.ligne}>
          <Text>{item.nom}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  ligne: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
```

**Résultat attendu** : la liste s'affiche et défile. Sur un appareil d'entrée de gamme ou en défilement très rapide, tu peux observer de brèves cases blanches le temps que les nouvelles lignes se dessinent. C'est le comportement que FlashList va améliorer.

---

### Étape 2 : Installer FlashList

```bash
# Installe FlashList via Expo pour une version compatible avec ton SDK
npx expo install @shopify/flash-list
```

**Ce que fait cette commande** :

| Élément | Rôle |
| --- | --- |
| `npx expo install` | Installe une version du paquet compatible avec l'Expo SDK du projet |
| `@shopify/flash-list` | La bibliothèque de liste performante |

**Résultat attendu** :

```text
Le paquet @shopify/flash-list est ajouté aux dépendances. Utiliser
npx expo install (plutôt que npm install) garantit une version compatible
avec Expo SDK 57 (ou la version fournie par ton projet Expo).
```

> **Note** : utilise toujours `npx expo install` pour les paquets qui touchent au natif. Cela évite les incompatibilités de version entre la bibliothèque et le SDK Expo.

---

### Étape 3 : La même liste avec FlashList

Crée `components/ListeFlashList.tsx`. Le composant de ligne est identique ; seuls l'import et le nom du composant changent. Avec FlashList v2, il n'y a plus de prop `estimatedItemSize` : la bibliothèque mesure les dimensions automatiquement.

```tsx
// components/ListeFlashList.tsx
import { FlashList } from "@shopify/flash-list";
import { View, Text, StyleSheet } from "react-native";

interface Produit {
  id: number;
  nom: string;
}

const produits: Produit[] = Array.from({ length: 5000 }, (_, index) => ({
  id: index,
  nom: `Produit ${index}`,
}));

export default function ListeFlashList() {
  return (
    <FlashList
      data={produits}
      keyExtractor={(item) => String(item.id)}
      // FlashList v2 mesure la hauteur des lignes automatiquement
      // pas besoin d'estimatedItemSize (supprimée en v2)
      renderItem={({ item }) => (
        <View style={styles.ligne}>
          <Text>{item.nom}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  ligne: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
```

**Résultat attendu** : la liste s'affiche et défile comme avant, mais le défilement rapide est plus fluide et les cases blanches sont fortement réduites, car FlashList recycle les vues au lieu de les recréer. Note que `data`, `keyExtractor` et `renderItem` sont restés identiques à la version FlatList : seuls l'import et le nom du composant ont changé.

---

### Étape 4 : Lignes de hauteurs différentes avec getItemType

Quand une liste mélange plusieurs types de lignes (un en-tête de section et des éléments, par exemple), `getItemType` aide FlashList à recycler ensemble les vues de même type. Crée `components/ListeMixte.tsx` :

```tsx
// components/ListeMixte.tsx
import { FlashList } from "@shopify/flash-list";
import { View, Text, StyleSheet } from "react-native";

// Une ligne est soit un titre de section, soit un produit
type Ligne =
  | { type: "section"; titre: string }
  | { type: "produit"; id: number; nom: string };

// Construit une liste alternant sections et produits
const lignes: Ligne[] = [];
for (let s = 0; s < 50; s++) {
  lignes.push({ type: "section", titre: `Section ${s}` });
  for (let p = 0; p < 20; p++) {
    lignes.push({ type: "produit", id: s * 100 + p, nom: `Produit ${s}-${p}` });
  }
}

export default function ListeMixte() {
  return (
    <FlashList
      data={lignes}
      // getItemType indique le type d'une ligne : FlashList recycle par type
      // estimatedItemSize n'existe plus en v2 : la mesure est automatique
      getItemType={(item) => item.type}
      renderItem={({ item }) => {
        // Selon le type, on affiche un en-tête ou un produit
        if (item.type === "section") {
          return (
            <View style={styles.section}>
              <Text style={styles.titreSection}>{item.titre}</Text>
            </View>
          );
        }
        return (
          <View style={styles.ligne}>
            <Text>{item.nom}</Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  section: { padding: 12, backgroundColor: "#f0f0f0" },
  titreSection: { fontWeight: "bold" },
  ligne: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
```

**Résultat attendu** : la liste affiche des en-têtes de section suivis de produits. Grâce à `getItemType`, FlashList recycle les vues de section entre elles et les vues de produit entre elles, ce qui évite de réutiliser une vue de section pour afficher un produit, et garde le défilement fluide même avec deux mises en page différentes.

---

### Étape 5 : Migrer une liste FlatList existante

Avec FlashList v2, la migration est encore plus simple qu'en v1 : il n'y a plus de prop `estimatedItemSize` à ajouter. Voici la différence entre l'ancien et le nouveau code :

```diff
- import { FlatList, View, Text, StyleSheet } from "react-native";
+ import { View, Text, StyleSheet } from "react-native";
+ import { FlashList } from "@shopify/flash-list";

- <FlatList
+ <FlashList
    data={produits}
    keyExtractor={(item) => String(item.id)}
    renderItem={({ item }) => (
      <View style={styles.ligne}>
        <Text>{item.nom}</Text>
      </View>
    )}
  />
```

**Les deux étapes de la migration (FlashList v2)** :

| Étape | Action |
| --- | --- |
| 1 | Importer `FlashList` depuis `@shopify/flash-list` et retirer `FlatList` de l'import `react-native` |
| 2 | Remplacer la balise `<FlatList>` par `<FlashList>` |

**Résultat attendu** : les props `data`, `renderItem` et `keyExtractor` restent identiques. La logique de chargement des données (par exemple un appel réseau de la fiche 6) n'est pas touchée. Seuls l'import et le nom de la balise changent.

> **Prérequis de la migration** : ton projet doit être sur la New Architecture (Expo SDK 52+ ou React Native 0.76+). Si ce n'est pas le cas, garde FlashList v1.x en épinglant la version : `npx expo install @shopify/flash-list@1`.
>
> **Note** : certaines props très spécifiques de FlatList n'ont pas d'équivalent exact dans FlashList, ou portent un autre nom. Pour une liste standard (`data`, `renderItem`, `keyExtractor`, `ListEmptyComponent`, `ListHeaderComponent`), la migration est directe. Vérifie la documentation pour les props avancées.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npx expo install @shopify/flash-list` | Installe FlashList dans une version compatible Expo |
| `npx expo start` | Lance le serveur de développement Expo |
| `npx tsc --noEmit` | Vérifie les types TypeScript |
| `npm test` | Lance les tests (les composants FlashList se testent comme FlatList) |

---

## Pièges Fréquents

### Piège 1 : Garder un FlatList pour une liste de quelques éléments

⚠️ **Problème** : Remplacer **toutes** les FlatList par des FlashList, y compris des listes de 5 ou 10 éléments. FlashList n'apporte alors aucun gain et ajoute une dépendance native inutile.

✅ **Solution** : Réserve FlashList aux listes longues (centaines ou milliers d'éléments) ou au défilement intensif. Pour une liste courte, FlatList suffit.

---

### Piège 2 : Utiliser estimatedItemSize avec FlashList v2

⚠️ **Problème** : Copier un exemple FlashList v1 qui inclut `estimatedItemSize={50}` dans ton code v2. La prop est supprimée en v2 : elle est ignorée et peut générer un avertissement dans la console.

✅ **Solution** : Retire simplement `estimatedItemSize` de ton code. FlashList v2 mesure automatiquement les dimensions ; aucune estimation n'est nécessaire.

```tsx
// ❌ Incorrect avec FlashList v2 : prop supprimée, ignorée
<FlashList data={data} estimatedItemSize={53} renderItem={renderItem} />

// ✅ Correct avec FlashList v2 : pas de prop de taille
<FlashList data={data} renderItem={renderItem} />
```

> **Note** : si tu trouves des tutoriels ou de la documentation mentionnant `estimatedItemSize` sans préciser la version, il s'agit probablement de FlashList v1. La v2 (npm, 2025-2026) n'utilise plus ce mécanisme.

---

### Piège 3 : Conserver de l'état local dans une ligne recyclée

⚠️ **Problème** : Stocker un état dans le composant de ligne (par exemple un `useState` "déplié/replié") sans le rattacher aux données de l'élément. Comme la vue est recyclée, l'état d'une ligne précédente peut réapparaître sur une autre ligne au défilement.

✅ **Solution** : Fais dépendre l'affichage des **données de l'élément**, pas d'un état local résiduel. Si tu as besoin d'un état "déplié", stocke-le hors de la ligne (dans un store ou l'état parent), indexé par l'identifiant de l'élément.

---

### Piège 4 : Envelopper FlashList dans un ScrollView

⚠️ **Problème** : Placer `<FlashList>` à l'intérieur d'un `<ScrollView>` (souvent pour "tout faire défiler ensemble"). FlashList perd alors sa capacité de fenêtrage et de recyclage, car il croit avoir une hauteur infinie.

✅ **Solution** : Laisse FlashList gérer son propre défilement. Pour ajouter du contenu en haut ou en bas, utilise `ListHeaderComponent` et `ListFooterComponent` plutôt qu'un ScrollView englobant.

---

## Checklist de Validation

- [ ] Je sais expliquer pourquoi FlatList ralentit sur les très longues listes
- [ ] Je comprends ce qu'est le recyclage des vues
- [ ] Je comprends pourquoi FlashList v2 requiert la New Architecture React Native
- [ ] Je sais installer FlashList avec `npx expo install`
- [ ] Je sais remplacer une FlatList par une FlashList en deux étapes
- [ ] Je sais que `estimatedItemSize` est supprimée en FlashList v2 (mesure automatique)
- [ ] Je sais utiliser `getItemType` pour des lignes de types différents
- [ ] Je sais quand garder FlatList plutôt que FlashList

---

## Exercice Pratique

**Énoncé** : Pars d'une liste FlatList qui affiche des contacts, et migre-la vers FlashList.

Le composant de départ (à créer dans `components/ListeContacts.tsx`) :

```tsx
// components/ListeContacts.tsx
import { FlatList, View, Text, StyleSheet } from "react-native";

interface Contact {
  id: number;
  nom: string;
  telephone: string;
}

// Génère 2000 contacts pour simuler une longue liste
const contacts: Contact[] = Array.from({ length: 2000 }, (_, index) => ({
  id: index,
  nom: `Contact ${index}`,
  telephone: `06 00 00 ${String(index).padStart(4, "0")}`,
}));

export default function ListeContacts() {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.carte}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.tel}>{item.telephone}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  carte: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  nom: { fontWeight: "bold" },
  tel: { color: "#555" },
});
```

**Indications** :

- Installe FlashList avec `npx expo install @shopify/flash-list`.
- Importe `FlashList` depuis `@shopify/flash-list` et retire `FlatList` de l'import `react-native`.
- Remplace la balise `<FlatList>` par `<FlashList>`.
- Ne fournis PAS `estimatedItemSize` : FlashList v2 mesure les dimensions automatiquement.
- Garde `data`, `keyExtractor` et `renderItem` strictement identiques.

**Résultat attendu** : la liste des contacts s'affiche comme avant, mais défile de façon plus fluide grâce au recyclage des vues, sans aucune modification de la logique d'affichage des lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Installer FlashList

```bash
# Installe FlashList dans une version compatible avec l'Expo SDK
npx expo install @shopify/flash-list
```

### 2. Le composant migré

Modifie `components/ListeContacts.tsx` :

```tsx
// components/ListeContacts.tsx
// 1. FlatList retiré de l'import react-native, FlashList importé
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";

interface Contact {
  id: number;
  nom: string;
  telephone: string;
}

const contacts: Contact[] = Array.from({ length: 2000 }, (_, index) => ({
  id: index,
  nom: `Contact ${index}`,
  telephone: `06 00 00 ${String(index).padStart(4, "0")}`,
}));

export default function ListeContacts() {
  return (
    // 2. La balise FlatList est devenue FlashList
    <FlashList
      data={contacts}
      keyExtractor={(item) => String(item.id)}
      // FlashList v2 mesure les dimensions automatiquement
      // pas de estimatedItemSize : prop supprimée en v2
      // data, keyExtractor et renderItem sont identiques à la version FlatList
      renderItem={({ item }) => (
        <View style={styles.carte}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.tel}>{item.telephone}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  carte: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  nom: { fontWeight: "bold" },
  tel: { color: "#555" },
});
```

### 3. Vérification

Lance l'application :

```bash
# Lance le serveur de développement Expo
npx expo start
```

Comportement attendu :

1. La liste des 2000 contacts s'affiche comme avec FlatList.
2. Le défilement rapide est plus fluide et les cases blanches sont réduites.
3. Seuls deux éléments ont changé : l'import et le nom de la balise. Aucune prop de taille à ajouter. La logique d'affichage d'une ligne (`renderItem`) est inchangée.
4. La vérification des types passe avec `npx tsc --noEmit`.

---

## Navigation

← Fiche précédente : **[11 - Tests en React Native](11-tests-react-native.md)**

→ Fiche suivante : **[13 - Accessibilité mobile](13-accessibilite-mobile.md)**
