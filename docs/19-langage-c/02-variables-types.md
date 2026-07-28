---
tags:
  - C
  - Débutant
  - Concept
description: "Comprendre les types de données en C : entiers, flottants, caractères, taille en mémoire et constantes."
estimated_time: "60 min"
fiche_number: 2
total_fiches: 10
cursus: "Langage C"
---

# 02 - Variables et types

> **En bref** : Déclarer des variables, comprendre les types primitifs du C (int, char, float, double), utiliser sizeof pour connaître la taille en mémoire, et définir des constantes. Lecture estimée : 60 min.

## Prérequis

- [01 - Introduction au langage C](01-introduction-c.md) : savoir compiler et exécuter un programme C

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des variables de différents types, comprendre la différence entre signed et unsigned, utiliser sizeof et définir des constantes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une variable ?

**Définition** : Une variable est un espace nommé dans la mémoire de l'ordinateur qui stocke une valeur. En C, chaque variable a un type fixe qui détermine la taille de cet espace et la manière dont la valeur est interprétée.

**Le problème que les variables résolvent** :

Sans variables, voici les problèmes rencontrés :

1. **Pas de stockage** : impossible de conserver un résultat intermédiaire pour l'utiliser plus tard.
2. **Valeurs codées en dur** : chaque valeur doit être écrite directement dans le code, rendant tout changement laborieux.
3. **Pas de lisibilité** : sans nom, impossible de savoir ce que représente une valeur dans le programme.

**Comment les variables résolvent ces problèmes** :

| Problème | Solution apportée par les variables |
| --- | --- |
| Pas de stockage | La variable réserve un espace mémoire pour stocker une valeur |
| Valeurs codées en dur | On modifie la variable à un seul endroit |
| Pas de lisibilité | Le nom de la variable décrit ce qu'elle contient |

**Analogie concrète** : Une variable, c'est comme une boîte avec une étiquette. L'étiquette est le nom de la variable (par exemple `age`). La taille de la boîte dépend du type (un `int` est une boîte de 4 octets, un `char` une boîte de 1 octet). Tu peux mettre une valeur dedans, la lire, ou la remplacer par une autre.

**Ce qu'une variable n'est PAS** :

- Une variable n'est pas une constante. Une constante ne peut pas être modifiée après sa création.
- Une variable en C n'est pas initialisée automatiquement. Si tu ne lui donnes pas de valeur, elle contient des données aléatoires (ce qu'il y avait avant dans cette zone mémoire).

---

### Qu'est-ce qu'un type ?

**Définition** : Un type définit la nature d'une donnée : combien d'octets elle occupe en mémoire, quelles valeurs elle peut prendre et quelles opérations sont possibles.

**Le problème que les types résolvent** :

Sans système de types, voici les problèmes rencontrés :

1. **Ambiguïté** : le processeur ne sait pas si les octets `01000001` représentent le nombre 65 ou la lettre 'A'.
2. **Erreurs silencieuses** : sans vérification de type, on pourrait additionner un nombre et une adresse mémoire sans avertissement.

**Comment les types résolvent ces problèmes** :

| Problème | Solution apportée par les types |
| --- | --- |
| Ambiguïté | Le type indique comment interpréter les octets en mémoire |
| Erreurs silencieuses | Le compilateur vérifie la cohérence des opérations entre types |

**Les types primitifs du C** :

| Type | Taille typique | Plage de valeurs | Usage |
| --- | --- | --- | --- |
| `char` | 1 octet | -128 à 127 | Caractère ou petit entier |
| `unsigned char` | 1 octet | 0 à 255 | Caractère ou octet non signé |
| `short` | 2 octets | -32 768 à 32 767 | Petit entier |
| `int` | 4 octets | -2 147 483 648 à 2 147 483 647 | Entier standard |
| `unsigned int` | 4 octets | 0 à 4 294 967 295 | Entier positif uniquement |
| `long` | 4 ou 8 octets | Dépend de la plateforme | Grand entier |
| `float` | 4 octets | ~6-7 chiffres significatifs | Nombre décimal simple précision |
| `double` | 8 octets | ~15-16 chiffres significatifs | Nombre décimal double précision |

**Analogie concrète** : Le type, c'est comme le format d'un formulaire administratif. Un champ "date de naissance" n'accepte que des dates (type `date`). Un champ "nom" n'accepte que du texte (type `char`). Un champ "âge" n'accepte que des nombres entiers positifs (type `unsigned int`). Le format empêche d'écrire un nom là où on attend un nombre.

---

### Qu'est-ce que signed et unsigned ?

**Définition** : `signed` signifie que la variable peut stocker des valeurs négatives et positives. `unsigned` signifie que la variable ne stocke que des valeurs positives (ou zéro), ce qui double la plage positive.

**Le problème que signed/unsigned résout** :

Sans distinction signed/unsigned, voici le problème rencontré :

1. **Gaspillage de plage** : si tu stockes un âge (toujours positif), la moitié de la plage de valeurs (les nombres négatifs) est inutilisée.

**Comment signed/unsigned résout ce problème** :

| Problème | Solution |
| --- | --- |
| Gaspillage de plage | `unsigned` utilise tous les bits pour les valeurs positives, doublant la plage |

**Comparaison signed vs unsigned pour un char (1 octet = 8 bits)** :

| `signed char` | `unsigned char` |
| --- | --- |
| -128 à 127 | 0 à 255 |
| 1 bit pour le signe, 7 bits pour la valeur | 8 bits pour la valeur |
| Par défaut pour `char` (dépend du compilateur) | Doit être explicitement déclaré |

---

## Étapes Pratiques

### Étape 1 : Déclarer et afficher des variables

Crée un fichier `types.c` :

```c
#include <stdio.h>

int main(void)
{
    // Déclaration et initialisation d'un entier
    int age = 25;

    // Déclaration d'un caractère (entre guillemets simples)
    char initiale = 'T';

    // Déclaration d'un nombre à virgule (simple précision)
    float taille = 1.82f;

    // Déclaration d'un nombre à virgule (double précision)
    double pi = 3.14159265358979;

    // Affichage avec les spécificateurs de format
    // %d = entier décimal (int)
    printf("Age : %d\n", age);

    // %c = caractère (char)
    printf("Initiale : %c\n", initiale);

    // %f = nombre flottant (float ou double)
    printf("Taille : %f\n", taille);

    // %.2f = flottant avec 2 décimales
    printf("Taille (2 decimales) : %.2f\n", taille);

    // %lf = double (en lecture avec scanf, %f suffit pour printf)
    printf("Pi : %lf\n", pi);

    // %.10f = 10 décimales pour voir la précision
    printf("Pi (10 decimales) : %.10f\n", pi);

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror types.c -o types
./types
```

**Résultat attendu** :

```text
Age : 25
Initiale : T
Taille : 1.820000
Taille (2 decimales) : 1.82
Pi : 3.141593
Pi (10 decimales) : 3.1415926536
```

---

### Étape 2 : Utiliser sizeof

`sizeof` est un opérateur qui retourne la taille en octets d'un type ou d'une variable.

Crée un fichier `tailles.c` :

```c
#include <stdio.h>

int main(void)
{
    // sizeof retourne un size_t, affiché avec %zu
    printf("Taille de char      : %zu octet(s)\n", sizeof(char));
    printf("Taille de short     : %zu octet(s)\n", sizeof(short));
    printf("Taille de int       : %zu octet(s)\n", sizeof(int));
    printf("Taille de long      : %zu octet(s)\n", sizeof(long));
    printf("Taille de long long : %zu octet(s)\n", sizeof(long long));
    printf("Taille de float     : %zu octet(s)\n", sizeof(float));
    printf("Taille de double    : %zu octet(s)\n", sizeof(double));

    // sizeof fonctionne aussi sur les variables
    int nombre = 42;
    printf("\nTaille de nombre (int) : %zu octet(s)\n", sizeof(nombre));

    // Un char vaut toujours 1 octet par définition
    printf("Un octet = %d bits\n", 8);

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror tailles.c -o tailles
./tailles
```

**Résultat attendu** (sur un système 64 bits) :

```text
Taille de char      : 1 octet(s)
Taille de short     : 2 octet(s)
Taille de int       : 4 octet(s)
Taille de long      : 8 octet(s)
Taille de long long : 8 octet(s)
Taille de float     : 4 octet(s)
Taille de double    : 8 octet(s)

Taille de nombre (int) : 4 octet(s)
Un octet = 8 bits
```

La taille de `long` peut être 4 octets sur un système Windows 64 bits et 8 octets sur Linux/macOS 64 bits.

---

### Étape 3 : Comprendre signed et unsigned

Crée un fichier `signed_unsigned.c` :

```c
#include <stdio.h>

int main(void)
{
    // Un signed char va de -128 à 127
    signed char s = -42;
    printf("Signed char   : %d\n", s);

    // Un unsigned char va de 0 à 255
    unsigned char u = 200;
    printf("Unsigned char : %u\n", u);

    // Que se passe-t-il si on dépasse la plage ?
    // Un unsigned char à 255 + 1 revient à 0 (débordement)
    unsigned char debordement = 255;
    // Le compilateur peut avertir ici avec -Wextra
    printf("255 en unsigned char      : %u\n", debordement);

    // Entiers signés et non signés
    int negatif = -10;
    unsigned int positif = 3000000000U;

    printf("Int signe     : %d\n", negatif);
    // %u pour afficher un unsigned int
    printf("Unsigned int  : %u\n", positif);

    return 0;
}
```

```bash
gcc -Wall -Wextra signed_unsigned.c -o signed_unsigned
./signed_unsigned
```

**Résultat attendu** :

```text
Signed char   : -42
Unsigned char : 200
255 en unsigned char      : 255
Int signe     : -10
Unsigned int  : 3000000000
```

---

### Étape 4 : Définir des constantes

Il existe deux manières de définir des constantes en C :

Crée un fichier `constantes.c` :

```c
#include <stdio.h>

// Méthode 1 : #define (directive préprocesseur)
// Le préprocesseur remplace PI par 3.14159 avant la compilation
// Pas de point-virgule à la fin, pas de type
#define PI 3.14159
#define TAILLE_MAX 100

// Méthode 2 : const (variable constante)
// La variable existe en mémoire mais ne peut pas être modifiée

int main(void)
{
    const int jours_semaine = 7;
    const double tva = 0.20;

    // Utilisation de #define
    double perimetre = 2 * PI * 5.0;
    printf("Perimetre (rayon 5) : %.2f\n", perimetre);
    printf("Taille max : %d\n", TAILLE_MAX);

    // Utilisation de const
    printf("Jours dans la semaine : %d\n", jours_semaine);
    printf("TVA : %.0f%%\n", tva * 100);

    // Cette ligne provoquerait une erreur de compilation :
    // jours_semaine = 8; // Erreur : assignment of read-only variable

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror constantes.c -o constantes
./constantes
```

**Résultat attendu** :

```text
Perimetre (rayon 5) : 31.42
Taille max : 100
Jours dans la semaine : 7
TVA : 20%
```

---

### Étape 5 : Lire une entrée utilisateur avec scanf

Crée un fichier `saisie.c` :

```c
#include <stdio.h>

int main(void)
{
    int age;
    float taille;
    char initiale;

    // scanf lit une entrée au clavier
    // & signifie "l'adresse de" la variable (expliqué en détail dans la fiche sur les pointeurs)
    printf("Quel est ton age ? ");
    scanf("%d", &age);

    printf("Quelle est ta taille en metres (ex: 1.75) ? ");
    scanf("%f", &taille);

    // Un espace avant %c pour ignorer le retour à la ligne précédent
    printf("Quelle est l'initiale de ton prenom ? ");
    scanf(" %c", &initiale);

    printf("\nRecapitulatif :\n");
    printf("Age : %d ans\n", age);
    printf("Taille : %.2f m\n", taille);
    printf("Initiale : %c\n", initiale);

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror saisie.c -o saisie
./saisie
```

**Résultat attendu** (avec les entrées 25, 1.82, T) :

```text
Quel est ton age ? 25
Quelle est ta taille en metres (ex: 1.75) ? 1.82
Quelle est l'initiale de ton prenom ? T

Recapitulatif :
Age : 25 ans
Taille : 1.82 m
Initiale : T
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `printf("%d", var)` | Affiche un entier signé |
| `printf("%u", var)` | Affiche un entier non signé |
| `printf("%f", var)` | Affiche un flottant |
| `printf("%.2f", var)` | Affiche un flottant avec 2 décimales |
| `printf("%c", var)` | Affiche un caractère |
| `printf("%zu", sizeof(type))` | Affiche la taille d'un type en octets |
| `scanf("%d", &var)` | Lit un entier au clavier |

---

## Pièges Fréquents

### Piège 1 : Variable non initialisée

**Problème** : Une variable non initialisée contient une valeur aléatoire (les données qui se trouvaient déjà dans cette zone mémoire).

**Solution** : Toujours initialiser tes variables lors de la déclaration.

```c
// Dangereux - valeur indéterminée
int compteur;
printf("%d\n", compteur); // Peut afficher n'importe quoi

// Correct - valeur connue
int compteur = 0;
printf("%d\n", compteur); // Affiche 0
```

---

### Piège 2 : Mauvais spécificateur de format

**Problème** : Utiliser `%d` pour afficher un `float` ou `%f` pour un `int` produit des résultats incohérents.

**Solution** : Utiliser le bon spécificateur pour chaque type.

```c
float prix = 19.99f;

// Incorrect - %d attend un int, pas un float
printf("%d\n", prix); // Affiche un nombre absurde

// Correct
printf("%f\n", prix); // Affiche 19.990000
```

---

### Piège 3 : Oublier le suffixe f pour les float

**Problème** : Sans le suffixe `f`, un nombre décimal est traité comme `double`, ce qui peut provoquer un avertissement.

**Solution** : Ajouter `f` à la fin d'un littéral float.

```c
// Avertissement possible - 1.5 est un double, pas un float
float prix = 1.5;

// Correct - 1.5f est explicitement un float
float prix = 1.5f;
```

---

### Piège 4 : Débordement de type

**Problème** : Dépasser la plage d'un type provoque un comportement inattendu (la valeur "boucle").

**Solution** : Choisir un type assez grand pour les valeurs que tu veux stocker.

```c
// Un unsigned char ne peut pas dépasser 255
unsigned char valeur = 255;
valeur = valeur + 1;
// valeur vaut maintenant 0 (débordement silencieux)
```

---

## Checklist de Validation

- [ ] Je sais déclarer des variables de type int, char, float et double
- [ ] Je comprends la différence entre signed et unsigned
- [ ] Je sais utiliser sizeof pour connaître la taille d'un type
- [ ] Je sais utiliser les spécificateurs de format (%d, %f, %c, %u, %zu)
- [ ] Je sais définir des constantes avec `#define` et `const`
- [ ] Je sais lire une entrée utilisateur avec scanf

---

## Exercice Pratique

**Énoncé** : Crée un programme qui calcule l'aire et le périmètre d'un rectangle. Le programme doit :

1. Demander la largeur et la longueur à l'utilisateur (nombres à virgule)
2. Calculer l'aire (largeur x longueur) et le périmètre (2 x (largeur + longueur))
3. Afficher les résultats avec 2 décimales
4. Afficher la taille en mémoire des variables utilisées

**Indications** :

- Utilise des variables de type `double` pour la précision
- Utilise `scanf("%lf", &variable)` pour lire un `double`
- Utilise `sizeof` pour afficher la taille des variables

**Résultat attendu** (avec largeur 5.5 et longueur 3.2) :

```text
Largeur : 5.5
Longueur : 3.2

Aire : 17.60
Perimetre : 17.40
Taille d'un double : 8 octets
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>

int main(void)
{
    // Déclaration des variables pour les dimensions
    double largeur;
    double longueur;

    // Lecture des dimensions
    printf("Largeur : ");
    scanf("%lf", &largeur);

    printf("Longueur : ");
    scanf("%lf", &longueur);

    // Calcul de l'aire et du périmètre
    double aire = largeur * longueur;
    double perimetre = 2 * (largeur + longueur);

    // Affichage des résultats
    printf("\nAire : %.2f\n", aire);
    printf("Perimetre : %.2f\n", perimetre);

    // Affichage de la taille en mémoire
    printf("Taille d'un double : %zu octets\n", sizeof(double));

    return 0;
}
```

---

## Pour Aller Plus Loin

### Types entiers portables avec `<stdint.h>`

Les types `int`, `long`, `unsigned int` ont une taille qui varie selon la plateforme (32 bits vs 64 bits). Pour du code système portable, l'en-tête `<stdint.h>` (C99) définit des types à taille garantie :

```c
#include <stdint.h>

int32_t  compteur = 0;       /* exactement 32 bits signe */
uint8_t  octet    = 255;     /* exactement 8 bits non signe */
uint64_t taille   = 0;       /* exactement 64 bits non signe */
```

| Type | Taille | Plage |
| ---- | ------ | ----- |
| `int8_t` | 8 bits | -128 à 127 |
| `uint8_t` | 8 bits | 0 à 255 |
| `int32_t` | 32 bits | -2 147 483 648 à 2 147 483 647 |
| `uint32_t` | 32 bits | 0 à 4 294 967 295 |
| `int64_t` | 64 bits | très grand |
| `size_t` | dépend de la plateforme | taille d'un objet en mémoire |

Utilise `size_t` pour les tailles et les indices de tableaux (résultat de `sizeof`, paramètre de `malloc`).

---

## Navigation

← Fiche précédente : **[01 - Introduction au langage C](01-introduction-c.md)**

→ Fiche suivante : **[03 - Opérateurs et structures de contrôle](03-operateurs-controle.md)**
