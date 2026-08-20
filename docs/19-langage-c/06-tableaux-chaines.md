---
tags:
  - C
  - Intermédiaire
  - Pratique
description: "Maîtriser les tableaux statiques, les chaînes de caractères C, les fonctions de string.h et se prémunir contre les buffer overflows."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 10
cursus: "Langage C"
---

# 06 - Tableaux et chaînes de caractères

> **En bref** : Déclarer et manipuler des tableaux statiques, comprendre les chaînes de caractères en C (terminées par '\0'), utiliser les fonctions de string.h et éviter les buffer overflows. Lecture estimée : 75 min.

## Prérequis

- [05 - Pointeurs](05-pointeurs.md) : comprendre les adresses mémoire et l'arithmétique des pointeurs

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des tableaux, manipuler des chaînes de caractères, utiliser les fonctions de la bibliothèque string.h et identifier les risques de buffer overflow.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un tableau ?

**Définition** : Un tableau est une collection ordonnée d'éléments du même type, stockés de manière contiguë en mémoire. La taille d'un tableau statique est fixée à la compilation et ne peut pas changer.

**Le problème que les tableaux résolvent** :

Sans tableaux, voici les problèmes rencontrés :

1. **Variables multiples** : pour stocker 100 notes d'étudiants, il faudrait déclarer 100 variables séparées (`note1`, `note2`, ..., `note100`).
2. **Pas de boucle possible** : impossible de parcourir les données avec une boucle si chaque donnée a un nom différent.
3. **Passage complexe** : passer 100 variables séparées à une fonction nécessiterait 100 paramètres.

**Comment les tableaux résolvent ces problèmes** :

| Problème | Solution apportée par les tableaux |
| --- | --- |
| Variables multiples | Un seul nom (`notes`) avec un index pour chaque élément |
| Pas de boucle possible | `notes[i]` permet de parcourir tous les éléments dans une boucle |
| Passage complexe | On passe le tableau (un pointeur) et sa taille à la fonction |

**Analogie concrète** : Un tableau, c'est comme un casier de vestiaire numéroté. Chaque case a le même format (même type), un numéro (l'index commençant à 0), et tu peux accéder directement à n'importe quelle case par son numéro sans ouvrir les autres.

**Ce qu'un tableau n'est PAS** :

- Un tableau en C ne connaît pas sa taille. Il n'y a pas de `.length` comme en Java. Tu dois suivre la taille toi-même.
- Un tableau ne vérifie pas les bornes. Accéder à `tab[100]` quand le tableau a 10 éléments ne provoque pas d'erreur de compilation, mais un comportement indéfini à l'exécution.

---

### Qu'est-ce qu'une chaîne de caractères ?

**Définition** : En C, une chaîne de caractères est un tableau de `char` terminé par le caractère nul `'\0'` (valeur 0). Ce caractère spécial marque la fin de la chaîne.

**Le problème que les chaînes C résolvent** :

Sans convention de terminaison, voici le problème rencontré :

1. **Longueur inconnue** : impossible de savoir où se termine le texte dans le tableau de caractères.

**Comment les chaînes C résolvent ce problème** :

| Problème | Solution |
| --- | --- |
| Longueur inconnue | Le caractère `'\0'` marque la fin de la chaîne. Les fonctions parcourent jusqu'à le trouver |

**Analogie concrète** : Le `'\0'`, c'est comme le point final d'une phrase. Sans point, tu ne sais pas quand la phrase se termine et tu continues à lire n'importe quoi. En C, le `'\0'` dit aux fonctions "arrête de lire ici".

**Ce qu'une chaîne C n'est PAS** :

- Une chaîne C n'est pas un objet `String` comme en Java ou Python. Il n'y a pas de méthodes intégrées. Ce n'est qu'un tableau de `char` avec un `'\0'` à la fin.
- Une chaîne C n'est pas redimensionnable. Sa taille est fixée à la déclaration. Pour des chaînes de taille variable, il faut l'allocation dynamique (fiche 07).

**Chaîne C vs String dans les langages modernes** :

| Chaîne C | String (Java, Python) |
| --- | --- |
| Tableau de char + '\0' | Objet avec méthodes intégrées |
| Taille fixe à la déclaration | Taille ajustable automatiquement |
| Pas de vérification des bornes | Vérification automatique |
| Manipulation manuelle (string.h) | Méthodes intégrées (.length(), .concat()) |

---

### Qu'est-ce qu'un buffer overflow ?

**Définition** : Un buffer overflow (débordement de tampon) se produit quand on écrit au-delà de la taille allouée à un tableau. Le programme écrase les données voisines en mémoire, provoquant des comportements imprévisibles ou des failles de sécurité.

**Le problème que la prévention des buffer overflows résout** :

Sans prévention, voici les problèmes rencontrés :

1. **Corruption mémoire** : des variables voisines sont écrasées silencieusement.
2. **Failles de sécurité** : un attaquant peut injecter du code malveillant en exploitant le débordement.

**Comment prévenir les buffer overflows** :

| Problème | Solution |
| --- | --- |
| Corruption mémoire | Toujours vérifier la taille avant d'écrire dans un tableau |
| Failles de sécurité | Utiliser des fonctions bornées (`fgets` au lieu de `gets` ; pour les copies, `snprintf` ou `strncpy` **avec** un `'\0'` forcé en fin de buffer, car `strncpy` ne termine pas toujours la chaîne) |

---

## Étapes Pratiques

### Étape 1 : Déclarer et manipuler des tableaux

Crée un fichier `tableaux.c` :

```c
#include <stdio.h>

int main(void)
{
    // Déclaration avec initialisation
    int notes[5] = {12, 18, 7, 15, 9};

    // Déclaration avec taille implicite (le compilateur compte les éléments)
    int pairs[] = {2, 4, 6, 8, 10, 12};

    // Déclaration sans initialisation (valeurs indéterminées)
    int resultats[3];
    resultats[0] = 100;
    resultats[1] = 200;
    resultats[2] = 300;

    // Initialisation partielle (le reste est mis à 0)
    int partiel[5] = {1, 2};
    // partiel = {1, 2, 0, 0, 0}

    // Affichage des notes
    printf("Notes :\n");
    int taille_notes = sizeof(notes) / sizeof(notes[0]);
    for (int i = 0; i < taille_notes; i++)
    {
        printf("  notes[%d] = %d\n", i, notes[i]);
    }

    // Calcul de la taille du tableau
    // sizeof(notes) = taille totale en octets
    // sizeof(notes[0]) = taille d'un élément
    // Le quotient donne le nombre d'éléments
    printf("\nTaille de notes     : %zu octets\n", sizeof(notes));
    printf("Taille d'un element : %zu octets\n", sizeof(notes[0]));
    printf("Nombre d'elements   : %d\n", taille_notes);

    // Tableau partiellement initialisé
    printf("\nTableau partiel :\n");
    for (int i = 0; i < 5; i++)
    {
        printf("  partiel[%d] = %d\n", i, partiel[i]);
    }

    // Tableaux multidimensionnels (matrice 3x3)
    int matrice[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    printf("\nMatrice 3x3 :\n");
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            printf("%2d ", matrice[i][j]);
        }
        printf("\n");
    }

    // Évite l'avertissement de variable non utilisée
    (void)pairs;
    (void)resultats;

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror tableaux.c -o tableaux
./tableaux
```

**Résultat attendu** :

```text
Notes :
  notes[0] = 12
  notes[1] = 18
  notes[2] = 7
  notes[3] = 15
  notes[4] = 9

Taille de notes     : 20 octets
Taille d'un element : 4 octets
Nombre d'elements   : 5

Tableau partiel :
  partiel[0] = 1
  partiel[1] = 2
  partiel[2] = 0
  partiel[3] = 0
  partiel[4] = 0

Matrice 3x3 :
 1  2  3
 4  5  6
 7  8  9
```

---

### Étape 2 : Chaînes de caractères

Crée un fichier `chaines.c` :

```c
#include <stdio.h>

int main(void)
{
    // Déclaration avec un littéral de chaîne
    // Le compilateur ajoute automatiquement '\0' à la fin
    char salut[] = "Bonjour";

    // Équivalent explicite (rarement utilisé)
    char salut2[] = {'B', 'o', 'n', 'j', 'o', 'u', 'r', '\0'};

    // Déclaration avec taille fixe (attention : prévoir la place pour '\0')
    char nom[20] = "Thomas";

    // Affichage avec %s
    printf("salut  : %s\n", salut);
    printf("salut2 : %s\n", salut2);
    printf("nom    : %s\n", nom);

    // Taille du tableau vs longueur de la chaîne
    printf("\nsizeof(salut) : %zu (taille du tableau)\n", sizeof(salut));
    printf("salut contient 7 caracteres + 1 '\\0' = 8 octets\n");

    printf("\nsizeof(nom)   : %zu (taille du tableau)\n", sizeof(nom));
    printf("nom contient 6 caracteres + 1 '\\0', mais le tableau fait 20\n");

    // Parcourir caractère par caractère
    printf("\nCaracteres de salut :\n");
    int i = 0;
    while (salut[i] != '\0')
    {
        printf("  salut[%d] = '%c' (code ASCII : %d)\n", i, salut[i], salut[i]);
        i++;
    }
    printf("  salut[%d] = '\\0' (code ASCII : %d)\n", i, salut[i]);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror chaines.c -o chaines
./chaines
```

**Résultat attendu** :

```text
salut  : Bonjour
salut2 : Bonjour
nom    : Thomas

sizeof(salut) : 8 (taille du tableau)
salut contient 7 caracteres + 1 '\0' = 8 octets

sizeof(nom)   : 20 (taille du tableau)
nom contient 6 caracteres + 1 '\0', mais le tableau fait 20

Caracteres de salut :
  salut[0] = 'B' (code ASCII : 66)
  salut[1] = 'o' (code ASCII : 111)
  salut[2] = 'n' (code ASCII : 110)
  salut[3] = 'j' (code ASCII : 106)
  salut[4] = 'o' (code ASCII : 111)
  salut[5] = 'u' (code ASCII : 117)
  salut[6] = 'r' (code ASCII : 114)
  salut[7] = '\0' (code ASCII : 0)
```

---

### Étape 3 : Fonctions de string.h

Crée un fichier `string_fonctions.c` :

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    char source[] = "Bonjour";
    char dest[50];
    char autre[] = " le monde";

    // strlen : retourne la longueur (sans le '\0')
    printf("strlen(\"%s\") = %zu\n", source, strlen(source));

    // strcpy : copie une chaîne dans une autre
    strcpy(dest, source);
    printf("Apres strcpy : dest = \"%s\"\n", dest);

    // strcat : concatène (ajoute à la fin)
    strcat(dest, autre);
    printf("Apres strcat : dest = \"%s\"\n", dest);

    // strcmp : compare deux chaînes
    // Retourne 0 si identiques, < 0 si a < b, > 0 si a > b
    char a[] = "abc";
    char b[] = "abd";
    char c[] = "abc";

    printf("\nstrcmp(\"%s\", \"%s\") = %d\n", a, b, strcmp(a, b));
    printf("strcmp(\"%s\", \"%s\") = %d\n", a, c, strcmp(a, c));
    printf("strcmp(\"%s\", \"%s\") = %d\n", b, a, strcmp(b, a));

    // strchr : cherche un caractère dans une chaîne
    char phrase[] = "Chercher la lettre e";
    char *pos = strchr(phrase, 'e');
    if (pos != NULL)
    {
        printf("\nPremier 'e' trouve a la position %ld\n", pos - phrase);
    }

    // strstr : cherche une sous-chaîne dans une chaîne
    char texte[] = "Le langage C est puissant";
    char *found = strstr(texte, "C est");
    if (found != NULL)
    {
        printf("\"C est\" trouve a la position %ld\n", found - texte);
        printf("Reste de la chaine : \"%s\"\n", found);
    }

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror string_fonctions.c -o string_fonctions
./string_fonctions
```

**Résultat attendu** :

```text
strlen("Bonjour") = 7
Apres strcpy : dest = "Bonjour"
Apres strcat : dest = "Bonjour le monde"

strcmp("abc", "abd") = -1
strcmp("abc", "abc") = 0
strcmp("abd", "abc") = 1

Premier 'e' trouve a la position 2
"C est" trouve a la position 11
Reste de la chaine : "C est puissant"
```

Les valeurs exactes de `strcmp` peuvent être -1/0/1 ou tout nombre négatif/0/positif selon le compilateur.

---

### Étape 4 : Fonctions sécurisées (prévenir les buffer overflows)

Crée un fichier `securite.c` :

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    // --- DANGER : strcpy sans vérification de taille ---
    // char petit[5];
    // strcpy(petit, "Cette chaine est beaucoup trop longue");
    // -> Buffer overflow ! Écrit au-delà des 5 octets

    // --- SÉCURISÉ : strncpy avec taille maximale ---
    char dest[10];
    strncpy(dest, "Bonjour le monde", sizeof(dest) - 1);
    // Forcer le '\0' à la fin (strncpy ne le fait pas si la source est trop longue)
    dest[sizeof(dest) - 1] = '\0';
    printf("strncpy securise : \"%s\"\n", dest);

    // --- DANGER : gets (JAMAIS UTILISER) ---
    // char buffer[10];
    // gets(buffer); // Aucune limite de taille, buffer overflow garanti
    // gets a été retiré du standard C11

    // --- SÉCURISÉ : fgets avec taille maximale ---
    char ligne[50];
    printf("\nEntre une ligne de texte : ");
    // fgets lit au maximum sizeof(ligne) - 1 caractères
    // et ajoute '\0' à la fin
    if (fgets(ligne, sizeof(ligne), stdin) != NULL)
    {
        // fgets conserve le '\n' en fin de ligne, on le retire
        size_t len = strlen(ligne);
        if (len > 0 && ligne[len - 1] == '\n')
        {
            ligne[len - 1] = '\0';
        }
        printf("Tu as ecrit : \"%s\"\n", ligne);
        printf("Longueur : %zu\n", strlen(ligne));
    }

    // --- strncat sécurisé ---
    char resultat[20] = "Hello";
    // Le 3e argument est le nombre max de caractères à ajouter
    strncat(resultat, " World!", sizeof(resultat) - strlen(resultat) - 1);
    printf("\nstrncat securise : \"%s\"\n", resultat);

    // --- snprintf : printf sécurisé dans un buffer ---
    char message[30];
    int age = 25;
    snprintf(message, sizeof(message), "J'ai %d ans", age);
    printf("snprintf : \"%s\"\n", message);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror securite.c -o securite
echo "Test de fgets" | ./securite
```

**Résultat attendu** :

```text
strncpy securise : "Bonjour l"

Entre une ligne de texte : Tu as ecrit : "Test de fgets"
Longueur : 13

strncat securise : "Hello World!"
snprintf : "J'ai 25 ans"
```

---

## Commandes Utiles

| Fonction | Action |
| --- | --- |
| `strlen(s)` | Longueur de la chaîne (sans '\0') |
| `strcpy(dest, src)` | Copie src dans dest |
| `strncpy(dest, src, n)` | Copie au maximum n caractères |
| `strcat(dest, src)` | Concatène src à la fin de dest |
| `strncat(dest, src, n)` | Concatène au maximum n caractères |
| `strcmp(a, b)` | Compare deux chaînes (0 si identiques) |
| `strncmp(a, b, n)` | Compare les n premiers caractères |
| `strchr(s, c)` | Cherche le caractère c dans s |
| `strstr(s, sub)` | Cherche la sous-chaîne sub dans s |
| `fgets(buf, size, stdin)` | Lit une ligne (sécurisé) |
| `snprintf(buf, size, fmt, ...)` | Printf sécurisé dans un buffer |

---

## Pièges Fréquents

### Piège 1 : Oublier la place pour '\0'

**Problème** : Déclarer `char nom[5] = "Hello"` ne laisse pas de place pour le '\0'. La chaîne n'est pas terminée correctement.

**Solution** : Toujours prévoir un octet de plus que la longueur du texte.

```c
// Incorrect pour une chaîne C : 5 caractères dans un tableau de 5.
// L'initialisation est autorisée (le '\0' n'entre pas). Utiliser
// nom avec %s, strlen, etc. est un comportement indéfini.
char nom[5] = "Hello";

// Correct - 6 octets pour 5 caractères + '\0'
char nom[6] = "Hello";

// Plus simple - laisser le compilateur calculer
char nom[] = "Hello"; // Taille automatique : 6
```

---

### Piège 2 : Comparer des chaînes avec ==

**Problème** : `==` compare les adresses des pointeurs, pas le contenu des chaînes.

**Solution** : Toujours utiliser `strcmp` pour comparer des chaînes.

```c
char a[] = "test";
char b[] = "test";

// Incorrect - compare les adresses (toujours faux ici)
if (a == b) // Faux car a et b sont à des adresses différentes

// Correct - compare le contenu
if (strcmp(a, b) == 0) // Vrai car le contenu est identique
```

---

### Piège 3 : Accès hors limites du tableau

**Problème** : Accéder à `tab[10]` quand le tableau a 5 éléments compile sans erreur mais provoque un comportement indéfini.

**Solution** : Toujours vérifier que l'index est dans les bornes `[0, taille - 1]`.

```c
int tab[5] = {1, 2, 3, 4, 5};

// Dangereux - l'index 5 est hors limites (valide : 0 à 4)
// printf("%d\n", tab[5]); // Comportement indéfini

// Correct - vérification
int index = 3;
if (index >= 0 && index < 5)
{
    printf("%d\n", tab[index]);
}
```

---

### Piège 4 : Utiliser scanf pour lire une chaîne avec espaces

**Problème** : `scanf("%s", ...)` s'arrête au premier espace. "Bonjour monde" ne lit que "Bonjour".

**Solution** : Utiliser `fgets` pour lire des lignes complètes.

```c
char ligne[100];

// scanf s'arrête au premier espace
// scanf("%s", ligne); // Ne lit que le premier mot

// fgets lit la ligne entière
fgets(ligne, sizeof(ligne), stdin);
```

---

## Checklist de Validation

- [ ] Je sais déclarer et initialiser des tableaux statiques
- [ ] Je sais calculer le nombre d'éléments avec `sizeof(tab) / sizeof(tab[0])`
- [ ] Je comprends le rôle du caractère '\0' dans les chaînes C
- [ ] Je sais utiliser strlen, strcpy, strcat, strcmp, strchr et strstr
- [ ] Je sais utiliser les fonctions sécurisées (strncpy, fgets, snprintf)
- [ ] Je comprends le risque de buffer overflow et comment l'éviter

---

## Exercice Pratique

**Énoncé** : Crée un programme qui gère un carnet de contacts simplifié.

1. Déclare un tableau de 3 noms (tableaux de char de 50 caractères chacun)
2. Demande à l'utilisateur de saisir 3 noms avec `fgets`
3. Affiche les noms saisis
4. Demande un nom à rechercher et affiche s'il est présent dans le carnet (utilise `strcmp`)
5. Affiche la longueur de chaque nom

**Indications** :

- Utilise `fgets` pour la saisie (sécurisé)
- Retire le `'\n'` ajouté par fgets
- Utilise `strcmp` pour la recherche

**Résultat attendu** :

```text
Saisie de 3 contacts :
Contact 1 : Alice
Contact 2 : Bob
Contact 3 : Charlie

Carnet :
  1. Alice (5 caracteres)
  2. Bob (3 caracteres)
  3. Charlie (7 caracteres)

Rechercher un nom : Bob
Bob est dans le carnet (position 2)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>
#include <string.h>

#define MAX_CONTACTS 3
#define MAX_NOM 50

int main(void)
{
    char contacts[MAX_CONTACTS][MAX_NOM];

    // Saisie des contacts
    printf("Saisie de %d contacts :\n", MAX_CONTACTS);
    for (int i = 0; i < MAX_CONTACTS; i++)
    {
        printf("Contact %d : ", i + 1);
        fgets(contacts[i], MAX_NOM, stdin);

        // Retirer le '\n' ajouté par fgets
        size_t len = strlen(contacts[i]);
        if (len > 0 && contacts[i][len - 1] == '\n')
        {
            contacts[i][len - 1] = '\0';
        }
    }

    // Affichage du carnet
    printf("\nCarnet :\n");
    for (int i = 0; i < MAX_CONTACTS; i++)
    {
        printf("  %d. %s (%zu caracteres)\n",
               i + 1, contacts[i], strlen(contacts[i]));
    }

    // Recherche
    char recherche[MAX_NOM];
    printf("\nRechercher un nom : ");
    fgets(recherche, MAX_NOM, stdin);
    size_t len = strlen(recherche);
    if (len > 0 && recherche[len - 1] == '\n')
    {
        recherche[len - 1] = '\0';
    }

    int trouve = 0;
    for (int i = 0; i < MAX_CONTACTS; i++)
    {
        if (strcmp(contacts[i], recherche) == 0)
        {
            printf("%s est dans le carnet (position %d)\n",
                   recherche, i + 1);
            trouve = 1;
            break;
        }
    }

    if (!trouve)
    {
        printf("%s n'est pas dans le carnet\n", recherche);
    }

    return 0;
}
```

---

## Navigation

← Fiche précédente : **[05 - Pointeurs](05-pointeurs.md)**

→ Fiche suivante : **[07 - Allocation dynamique](07-allocation-dynamique.md)**
