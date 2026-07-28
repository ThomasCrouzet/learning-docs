---
tags:
  - Mobile
  - Avancé
  - Pratique
description: "Rendre une application React Native accessible : accessibilityLabel, accessibilityRole, accessibilityHint, accessibilityState, lecteurs d'écran, cibles tactiles, contraste et obligations des stores."
estimated_time: "75 min"
fiche_number: 13
total_fiches: 13
cursus: "Dev Mobile"
---

# 13 - Accessibilité mobile

> **En bref** : Rendre une application React Native utilisable au lecteur d'écran avec `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` et `accessibilityState`, comprendre VoiceOver et TalkBack, et respecter les cibles tactiles, le contraste et les obligations des stores. Lecture estimée : 75 min.

## Prérequis

- [Composants de base](03-composants-base.md) terminée : tu sais utiliser `View`, `Text`, `Pressable` et `Image`
- [Formulaires et validation](08-formulaires-validation.md) terminée : tu sais construire des champs de saisie
- [Tests en React Native](11-tests-react-native.md) lue : tu sais cibler des éléments par leur libellé dans un test

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire tes composants pour les lecteurs d'écran avec `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` et `accessibilityState`, tester ton application avec VoiceOver et TalkBack, dimensionner correctement les cibles tactiles, vérifier le contraste, et connaître les obligations d'accessibilité des stores.

---

## Concepts

Cette section explique ce qu'est l'accessibilité mobile et les outils que React Native fournit pour l'assurer. Lis-la entièrement avant les étapes pratiques.

### Pourquoi rendre une application accessible ?

**Définition** : L'accessibilité d'une application mobile, c'est sa capacité à être utilisée par toutes les personnes, y compris celles qui ont un handicap : vision réduite ou nulle, motricité limitée, daltonisme. Concrètement, l'application doit fonctionner avec un lecteur d'écran, avec de grandes tailles de texte, et avec des zones tactiles assez grandes.

**Le problème que l'accessibilité résout** :

Sans travail d'accessibilité, une partie des utilisateurs est exclue :

1. **Éléments muets au lecteur d'écran** : un bouton sans libellé textuel (juste une icône) est annoncé "bouton" sans dire ce qu'il fait.
2. **Cibles tactiles trop petites** : un bouton minuscule est difficile à atteindre pour une personne à motricité réduite.
3. **Contraste insuffisant** : un texte gris clair sur fond blanc est illisible pour une personne malvoyante.

**Comment l'accessibilité résout ces problèmes** :

| Problème | Solution apportée par l'accessibilité |
| --- | --- |
| Éléments muets au lecteur d'écran | Des libellés (`accessibilityLabel`) décrivent chaque élément |
| Cibles tactiles trop petites | Des zones d'au moins 44x44 points |
| Contraste insuffisant | Un rapport de contraste suffisant entre texte et fond |

**Analogie concrète** : Rendre une application accessible, c'est comme construire une rampe à côté d'un escalier. La rampe ne gêne personne (les autres peuvent prendre l'escalier), mais elle rend le bâtiment utilisable par une personne en fauteuil. De même, les libellés d'accessibilité sont invisibles à l'écran, mais ils ouvrent l'application aux personnes qui utilisent un lecteur d'écran.

**Ce que l'accessibilité n'est PAS** :

- L'accessibilité n'est pas une option de fin de projet. C'est une qualité à intégrer dès la conception : rajouter des libellés après coup sur une grosse application est bien plus coûteux.
- L'accessibilité n'est pas réservée à un public restreint. De grandes tailles de texte ou un bon contraste profitent aussi aux personnes sans handicap (plein soleil, fatigue visuelle).

---

### Qu'est-ce qu'un lecteur d'écran (VoiceOver, TalkBack) ?

**Définition** : Un lecteur d'écran est un outil système qui lit à voix haute le contenu affiché et permet de naviguer sans voir l'écran. Sur iOS, il s'appelle **VoiceOver** ; sur Android, **TalkBack**. L'utilisateur fait glisser son doigt ou balaie l'écran, et le lecteur annonce chaque élément rencontré.

**Le problème que le lecteur d'écran résout** :

Une personne aveugle ou très malvoyante ne peut pas lire l'écran ni viser un bouton à l'œil.

1. **Pas de lecture visuelle** : le contenu textuel et les libellés doivent être annoncés vocalement.
2. **Pas de visée précise** : la navigation se fait élément par élément, au balayage.

**Comment le lecteur d'écran résout ces problèmes** :

| Problème | Solution apportée par le lecteur d'écran |
| --- | --- |
| Pas de lecture visuelle | Il énonce le libellé et le rôle de chaque élément |
| Pas de visée précise | Il permet de parcourir les éléments un à un au balayage |

**Comment il lit un élément** : quand l'utilisateur sélectionne un élément, le lecteur annonce en général, dans cet ordre : son **libellé** (ce qu'il est), son **rôle** (bouton, image, en-tête...), son **état** (sélectionné, désactivé...) puis son **indice** (ce qui se passe à l'activation). Ces quatre informations correspondent exactement aux quatre props que React Native expose.

**Analogie concrète** : Un lecteur d'écran est comme un guide de musée pour une visite à l'aveugle. Devant chaque œuvre (chaque élément), le guide annonce son titre (le libellé), sa nature (peinture, sculpture, soit le rôle), son état (en restauration, soit l'état) et ce que tu peux faire (toucher la maquette, soit l'indice). Sans ce guide, la salle serait silencieuse et inexploitable.

---

### Les quatre props d'accessibilité de React Native

**Définition** : React Native expose des props d'accessibilité sur les composants. Quatre sont essentielles : `accessibilityLabel` (le libellé), `accessibilityRole` (le rôle), `accessibilityHint` (l'indice d'action) et `accessibilityState` (l'état). Elles alimentent directement ce que le lecteur d'écran annonce.

**Le problème que ces props résolvent** :

Par défaut, le lecteur d'écran lit le texte d'un `<Text>`, mais il ne sait pas décrire un bouton-icône, ni indiquer qu'une case est cochée, ni annoncer le rôle d'un élément.

**Rôle de chaque prop** :

| Prop | Rôle | Exemple de valeur |
| --- | --- | --- |
| `accessibilityLabel` | Texte lu pour décrire l'élément | `"Supprimer la tâche"` |
| `accessibilityRole` | Nature de l'élément | `"button"`, `"image"`, `"header"` |
| `accessibilityHint` | Ce qui se passe à l'activation | `"Ouvre la fiche de détail"` |
| `accessibilityState` | État courant de l'élément | `{ disabled: true }`, `{ checked: true }` |

**Analogie concrète** : Ces quatre props sont comme les quatre champs d'une étiquette de produit en braille sur un rayon de magasin. Le nom du produit (le libellé), sa catégorie (le rôle), une indication d'usage (l'indice) et sa disponibilité, en stock ou non (l'état). Avec ces quatre informations, une personne aveugle choisit son produit sans aide ; sans elles, le rayon est muet.

**Ce que ces props ne sont PAS** :

- Elles ne sont pas visibles à l'écran. `accessibilityLabel` ne change pas l'affichage : il ne sert qu'au lecteur d'écran. Le texte visible reste le contenu du `<Text>`.
- Elles ne remplacent pas un bon contenu textuel. Si un bouton a déjà un libellé texte clair, le lecteur le lira ; le `accessibilityLabel` sert surtout aux éléments sans texte (icônes) ou à préciser une action.

---

### Cibles tactiles et contraste

**Définition** : Une **cible tactile** est la zone qu'un utilisateur doit toucher pour activer un élément (un bouton, un lien). Le **contraste** est l'écart de luminosité entre un texte et son arrière-plan. Les deux conditionnent l'usage par les personnes à motricité réduite ou à vision faible.

**Le problème qu'ils résolvent** :

1. **Cibles trop petites** : viser un bouton de 20x20 points est difficile, surtout avec un tremblement ou un gros doigt.
2. **Texte peu lisible** : un faible contraste rend le texte illisible au soleil ou pour une personne malvoyante.

**Les règles concrètes** :

| Critère | Règle recommandée |
| --- | --- |
| Taille de cible tactile | Au moins 44x44 points (iOS) / 48x48 dp (Android) |
| Contraste texte normal | Rapport d'au moins 4,5:1 entre texte et fond |
| Contraste texte large | Rapport d'au moins 3:1 (texte de grande taille) |
| Information par la couleur seule | À éviter : doubler par un texte ou une icône |

**Analogie concrète** : Une cible tactile, c'est comme la taille d'un bouton d'ascenseur. Un bouton minuscule est frustrant à viser pour tout le monde, et inutilisable pour une personne âgée ou malvoyante. Un bouton large et bien contrasté avec sa plaque s'utilise du premier coup. La règle des 44 points est la "taille de doigt" minimale confortable.

> **Note** : sur React Native, un `Pressable` peut élargir sa zone tactile sans agrandir son visuel grâce à la prop `hitSlop`. Utile quand l'icône doit rester petite mais la cible doit faire au moins 44 points.

---

### Les obligations des stores

**Définition** : Apple et Google encouragent fortement l'accessibilité, et certaines réglementations la rendent obligatoire pour des catégories d'applications (secteur public, gros acteurs). Les pages de soumission des stores incluent des sections liées à l'accessibilité, et une application inaccessible peut être moins bien classée ou refusée dans certains contextes.

**Ce qu'il faut retenir** :

| Aspect | Détail |
| --- | --- |
| App Store (Apple) | Recommande VoiceOver, Dynamic Type (tailles de texte), bon contraste |
| Google Play | Propose un "Accessibility Scanner" pour auditer l'application |
| Réglementation | En Europe, l'accessibilité numérique est imposée à certains secteurs |
| Bénéfice produit | Une application accessible touche plus d'utilisateurs et est mieux notée |

**Analogie concrète** : Les obligations d'accessibilité sont comme les normes d'accès d'un bâtiment public (rampes, ascenseurs, portes assez larges). Un commerce peut techniquement ouvrir sans elles, mais il s'expose à des sanctions et se prive d'une partie de sa clientèle. Pour une application, viser l'accessibilité dès le départ évite des refus de publication et élargit le public.

---

## Étapes Pratiques

Pour ces exemples, repars du projet `task-manager` des fiches précédentes, ou de tout projet Expo + TypeScript (Expo SDK 57, React Native 0.86, ou versions voisines installées par `create-expo-app@latest`).

### Étape 1 : Un bouton-icône inaccessible, puis corrigé

Voici un bouton de suppression qui n'affiche qu'une icône. Sans libellé, le lecteur d'écran ne peut pas dire ce qu'il fait. Crée `components/BoutonSupprimer.tsx` :

```tsx
// components/BoutonSupprimer.tsx
import { Pressable, Text } from "react-native";

interface PropsBoutonSupprimer {
  onSupprimer: () => void;
}

export default function BoutonSupprimer({ onSupprimer }: PropsBoutonSupprimer) {
  return (
    <Pressable
      onPress={onSupprimer}
      // accessibilityRole : annonce "bouton" au lecteur d'écran
      accessibilityRole="button"
      // accessibilityLabel : sans lui, le lecteur n'a que l'icône à lire (rien d'utile)
      accessibilityLabel="Supprimer la tâche"
      // accessibilityHint : précise l'effet de l'activation
      accessibilityHint="Retire définitivement cette tâche de la liste"
      // hitSlop élargit la zone tactile sans agrandir l'icône
      hitSlop={12}
    >
      {/* L'icône est purement visuelle : le sens vient de accessibilityLabel */}
      <Text style={{ fontSize: 20 }}>🗑️</Text>
    </Pressable>
  );
}
```

**Résultat attendu** : visuellement, le bouton n'affiche qu'une icône de corbeille. Mais avec VoiceOver ou TalkBack actif, l'élément est annoncé "Supprimer la tâche, bouton", suivi de l'indice "Retire définitivement cette tâche de la liste". La zone tactile est élargie par `hitSlop` pour atteindre une taille confortable.

---

### Étape 2 : Annoncer un état avec accessibilityState

Une case à cocher doit annoncer si elle est cochée ou non. Crée `components/CaseTache.tsx` :

```tsx
// components/CaseTache.tsx
import { Pressable, Text, View, StyleSheet } from "react-native";

interface PropsCaseTache {
  titre: string;
  faite: boolean;
  onBasculer: () => void;
}

export default function CaseTache({ titre, faite, onBasculer }: PropsCaseTache) {
  return (
    <Pressable
      onPress={onBasculer}
      accessibilityRole="checkbox"
      accessibilityLabel={titre}
      // accessibilityState annonce l'état "coché" ou "non coché"
      accessibilityState={{ checked: faite }}
      style={styles.ligne}
    >
      {/* L'affichage visuel de la case (texte simple ici) */}
      <Text style={styles.case}>{faite ? "☑" : "☐"}</Text>
      <Text style={faite ? styles.titreFait : styles.titre}>{titre}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // minHeight garantit une cible tactile d'au moins 44 points
  ligne: { flexDirection: "row", alignItems: "center", minHeight: 44, padding: 8 },
  case: { fontSize: 20, marginRight: 8 },
  titre: { fontSize: 16 },
  titreFait: { fontSize: 16, textDecorationLine: "line-through", color: "#888" },
});
```

**Résultat attendu** : la case affiche `☐` ou `☑` selon l'état. Au lecteur d'écran, l'élément est annoncé avec son titre, le rôle "case à cocher", et l'état "coché" ou "non coché". L'utilisateur sait donc, sans voir, si la tâche est faite. La hauteur minimale de 44 points assure une cible tactile confortable.

---

### Étape 3 : Marquer un titre comme en-tête

Les lecteurs d'écran permettent de sauter d'en-tête en en-tête. Marque tes titres avec le rôle `header`. Crée `components/EnTeteSection.tsx` :

```tsx
// components/EnTeteSection.tsx
import { Text, StyleSheet } from "react-native";

interface PropsEnTeteSection {
  texte: string;
}

export default function EnTeteSection({ texte }: PropsEnTeteSection) {
  return (
    <Text
      // accessibilityRole="header" permet la navigation par en-têtes
      accessibilityRole="header"
      style={styles.titre}
    >
      {texte}
    </Text>
  );
}

const styles = StyleSheet.create({
  titre: { fontSize: 22, fontWeight: "bold", marginVertical: 12 },
});
```

**Résultat attendu** : le titre s'affiche en gras. Au lecteur d'écran, il est annoncé comme un en-tête, ce qui permet à l'utilisateur de naviguer rapidement de section en section au lieu de parcourir tout le contenu ligne par ligne.

---

### Étape 4 : Regrouper des éléments pour une lecture unique

Sur une carte composée de plusieurs textes, le lecteur d'écran les lit un par un, ce qui est lent. La prop `accessible` regroupe les enfants en un seul élément lu d'un coup. Crée `components/CarteContact.tsx` :

```tsx
// components/CarteContact.tsx
import { View, Text, StyleSheet } from "react-native";

interface PropsCarteContact {
  nom: string;
  role: string;
  telephone: string;
}

export default function CarteContact({ nom, role, telephone }: PropsCarteContact) {
  return (
    <View
      // accessible regroupe les enfants : le lecteur les lit comme un seul bloc
      accessible
      // accessibilityLabel remplace la lecture séparée par une phrase claire
      accessibilityLabel={`${nom}, ${role}, téléphone ${telephone}`}
      style={styles.carte}
    >
      <Text style={styles.nom}>{nom}</Text>
      <Text style={styles.role}>{role}</Text>
      <Text style={styles.tel}>{telephone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: { padding: 16, borderWidth: 1, borderColor: "#ddd", borderRadius: 8 },
  nom: { fontSize: 18, fontWeight: "bold" },
  role: { fontSize: 14, color: "#555" },
  tel: { fontSize: 14, color: "#555" },
});
```

**Résultat attendu** : la carte affiche trois lignes. Au lecteur d'écran, au lieu de trois annonces séparées, l'utilisateur entend une seule phrase : "Marie Dupont, responsable, téléphone 06 12 34 56 78". La lecture est plus rapide et plus claire.

---

### Étape 5 : Activer et tester avec un lecteur d'écran

Active le lecteur d'écran de ton appareil pour vérifier le rendu sonore.

```text
Activer VoiceOver (iOS) :
  Réglages > Accessibilité > VoiceOver > activer
  Raccourci : triple-clic sur le bouton latéral (à configurer)

Activer TalkBack (Android) :
  Paramètres > Accessibilité > TalkBack > activer

Naviguer :
  Balaie vers la droite/gauche pour passer d'un élément au suivant.
  Double-tape pour activer l'élément sélectionné.
```

**Résultat attendu** :

```text
En balayant l'application, chaque élément interactif est annoncé avec son
libellé, son rôle, son état et son indice. Un bouton-icône sans
accessibilityLabel serait annoncé "bouton" sans plus de précision : c'est
le test qui révèle les éléments muets à corriger.
```

> **Note** : le simulateur iOS (Xcode 14+) supporte VoiceOver et permet de tester la plupart des comportements d'accessibilité. Pour les tests de production ou la validation des gestes complexes (balayages, rotors), un appareil réel reste préférable car certains gestes tactiles sont difficiles à reproduire avec la souris.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npx expo start` | Lance le serveur de développement Expo |
| `npx tsc --noEmit` | Vérifie les types TypeScript |
| `npm test` | Lance les tests (les libellés d'accessibilité sont aussi testables) |

> **Note** : l'accessibilité se vérifie surtout sur l'appareil (VoiceOver/TalkBack) et avec l'Accessibility Scanner de Google Play, pas seulement en ligne de commande.

---

## Pièges Fréquents

### Piège 1 : Un bouton-icône sans accessibilityLabel

⚠️ **Problème** : Créer un bouton qui n'affiche qu'une icône (corbeille, crayon) sans `accessibilityLabel`. Le lecteur d'écran annonce "bouton" sans dire ce qu'il fait, rendant l'action inutilisable sans la vue.

✅ **Solution** : Donne toujours un `accessibilityLabel` clair aux éléments sans texte visible.

```tsx
// ❌ Incorrect : le lecteur ne sait pas ce que fait ce bouton
<Pressable onPress={supprimer}>
  <Text>🗑️</Text>
</Pressable>

// ✅ Correct : le libellé décrit l'action
<Pressable onPress={supprimer} accessibilityRole="button" accessibilityLabel="Supprimer">
  <Text>🗑️</Text>
</Pressable>
```

---

### Piège 2 : Transmettre une information par la couleur seule

⚠️ **Problème** : Indiquer un statut uniquement par une couleur (un point rouge pour "erreur", vert pour "ok"). Une personne daltonienne ou un lecteur d'écran ne perçoit pas cette différence.

✅ **Solution** : Double toujours la couleur par un texte ou une icône explicite.

```tsx
// ❌ Incorrect : seul un point coloré indique l'état
<View style={{ backgroundColor: enErreur ? "red" : "green", width: 12, height: 12 }} />

// ✅ Correct : un texte accompagne la couleur
<Text style={{ color: enErreur ? "red" : "green" }}>
  {enErreur ? "Erreur" : "Validé"}
</Text>
```

---

### Piège 3 : Des cibles tactiles trop petites

⚠️ **Problème** : Créer un bouton ou une icône cliquable de moins de 44 points. Il est difficile à viser, surtout pour une personne à motricité réduite.

✅ **Solution** : Assure une cible d'au moins 44x44 points, avec `minHeight`/`minWidth` ou `hitSlop` pour élargir la zone sans grossir le visuel.

```tsx
// ❌ Incorrect : zone tactile minuscule
<Pressable onPress={action} style={{ width: 20, height: 20 }}>
  <Text>✕</Text>
</Pressable>

// ✅ Correct : hitSlop élargit la zone tactile autour de l'icône
<Pressable onPress={action} hitSlop={16} style={{ width: 20, height: 20 }}>
  <Text>✕</Text>
</Pressable>
```

---

### Piège 4 : Lire chaque texte d'une carte séparément

⚠️ **Problème** : Laisser une carte de plusieurs `<Text>` sans regroupement. Le lecteur d'écran annonce chaque ligne séparément, ce qui ralentit la navigation et fragmente l'information.

✅ **Solution** : Regroupe les éléments d'un même bloc logique avec `accessible` et un `accessibilityLabel` synthétique, comme à l'étape 4.

---

## Checklist de Validation

- [ ] Je comprends pourquoi l'accessibilité est nécessaire et profite à tous
- [ ] Je sais ce que font VoiceOver et TalkBack
- [ ] Je sais ajouter un `accessibilityLabel` à un bouton-icône
- [ ] Je sais utiliser `accessibilityRole` pour annoncer la nature d'un élément
- [ ] Je sais préciser une action avec `accessibilityHint`
- [ ] Je sais annoncer un état avec `accessibilityState` (coché, désactivé)
- [ ] Je sais regrouper des éléments avec `accessible` pour une lecture unique
- [ ] Je connais les règles de cible tactile (44 points) et de contraste (4,5:1)
- [ ] Je sais tester avec un lecteur d'écran et je connais les attentes des stores

---

## Exercice Pratique

**Énoncé** : Rends accessible une barre d'actions d'une fiche de tâche, composée de trois boutons-icônes : modifier, marquer comme favori et supprimer.

Le composant de départ (à créer dans `components/BarreActions.tsx`), inaccessible en l'état :

```tsx
// components/BarreActions.tsx
import { View, Pressable, Text, StyleSheet } from "react-native";

interface PropsBarreActions {
  estFavori: boolean;
  onModifier: () => void;
  onFavori: () => void;
  onSupprimer: () => void;
}

export default function BarreActions({
  estFavori,
  onModifier,
  onFavori,
  onSupprimer,
}: PropsBarreActions) {
  return (
    <View style={styles.barre}>
      <Pressable onPress={onModifier}>
        <Text style={styles.icone}>✏️</Text>
      </Pressable>
      <Pressable onPress={onFavori}>
        <Text style={styles.icone}>{estFavori ? "★" : "☆"}</Text>
      </Pressable>
      <Pressable onPress={onSupprimer}>
        <Text style={styles.icone}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barre: { flexDirection: "row", gap: 16 },
  icone: { fontSize: 22 },
});
```

**Indications** :

- Ajoute `accessibilityRole="button"` à chacun des trois `Pressable`.
- Donne un `accessibilityLabel` clair à chaque bouton : "Modifier la tâche", "Ajouter aux favoris", "Supprimer la tâche".
- Sur le bouton favori, ajoute `accessibilityState={{ checked: estFavori }}` pour annoncer s'il est déjà en favori, et adapte le libellé ("Retirer des favoris" quand il l'est déjà). Utilise `checked` plutôt que `selected` : `checked` est sémantiquement adapté aux éléments bascule (on/off), alors que `selected` est réservé aux éléments sélectionnés dans une liste (onglet actif, option de menu).
- Ajoute un `accessibilityHint` au bouton supprimer pour avertir que l'action est définitive.
- Assure une cible tactile d'au moins 44 points avec `hitSlop` ou un `minHeight`/`minWidth`.

**Résultat attendu** : chaque bouton est annoncé par le lecteur d'écran avec un libellé clair, son rôle et, pour le favori, son état. Les cibles tactiles sont confortables. L'icône seule ne porte plus le sens : le libellé le fait.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Le composant accessible

Modifie `components/BarreActions.tsx` :

```tsx
// components/BarreActions.tsx
import { View, Pressable, Text, StyleSheet } from "react-native";

interface PropsBarreActions {
  estFavori: boolean;
  onModifier: () => void;
  onFavori: () => void;
  onSupprimer: () => void;
}

export default function BarreActions({
  estFavori,
  onModifier,
  onFavori,
  onSupprimer,
}: PropsBarreActions) {
  return (
    <View style={styles.barre}>
      {/* Bouton modifier : rôle + libellé clair */}
      <Pressable
        onPress={onModifier}
        accessibilityRole="button"
        accessibilityLabel="Modifier la tâche"
        hitSlop={12}
        style={styles.cible}
      >
        <Text style={styles.icone}>✏️</Text>
      </Pressable>

      {/* Bouton favori : libellé et état adaptés selon estFavori */}
      <Pressable
        onPress={onFavori}
        accessibilityRole="button"
        accessibilityLabel={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
        // checked est sémantiquement correct pour un bouton bascule (on/off)
        // selected est réservé aux éléments sélectionnés dans une liste
        accessibilityState={{ checked: estFavori }}
        hitSlop={12}
        style={styles.cible}
      >
        <Text style={styles.icone}>{estFavori ? "★" : "☆"}</Text>
      </Pressable>

      {/* Bouton supprimer : indice avertissant du caractère définitif */}
      <Pressable
        onPress={onSupprimer}
        accessibilityRole="button"
        accessibilityLabel="Supprimer la tâche"
        accessibilityHint="Retire définitivement cette tâche"
        hitSlop={12}
        style={styles.cible}
      >
        <Text style={styles.icone}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barre: { flexDirection: "row", gap: 16 },
  // minHeight et minWidth garantissent une cible tactile d'au moins 44 points
  cible: { minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" },
  icone: { fontSize: 22 },
});
```

### Vérification

1. Active VoiceOver (iOS) ou TalkBack (Android) sur l'appareil de test.
2. Balaie vers chaque bouton : il est annoncé avec son libellé et le rôle "bouton".
3. Le bouton favori annonce "Ajouter aux favoris" ou "Retirer des favoris" selon `estFavori`, avec l'état coché (`checked`) quand il l'est.
4. Le bouton supprimer énonce son indice "Retire définitivement cette tâche".
5. Chaque cible mesure au moins 44 points (via `minHeight`/`minWidth` et `hitSlop`), donc reste facile à viser.

L'application est maintenant utilisable sans la vue : chaque action a un sens explicite, un état annoncé et une zone tactile confortable.

---

## Navigation

← Fiche précédente : **[12 - Listes performantes avec FlashList](12-listes-performantes.md)**
