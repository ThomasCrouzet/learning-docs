---
tags:
  - Faust
  - Expert
  - Concept
description: "Aide-mémoire des signatures des bibliothèques Faust - arités exactes de re, pm, fi, co, opérateurs de composition, sources d'erreurs d'arité, lecture de la doc offline"
estimated_time: "55 min"
fiche_number: 5
total_fiches: 5
cursus: "Phase 7 - Maîtrise et contribution"
---

# 05 - Aide-mémoire des signatures de bibliothèque

> **En bref** : À la fin de cette fiche, tu disposeras d'une table de référence des signatures exactes des fonctions Faust les plus utilisées, tu sauras éviter les erreurs d'arité, et tu sauras lire la documentation des bibliothèques en local sans connexion internet. Lecture estimée : 55 min.


## Prérequis

- [Fiche 02 - Contribution au projet Faust](02-contribution-projet.md) : structure du dépôt `faustlibraries`, conventions de nommage des fonctions de bibliothèque
- Phase 4 complète (DSP appliqué) :
  - [Fiche 04 - Modélisation physique](../04-dsp-applique/04-modelisation-physique.md) : bibliothèque `pm.*`, cordes et tubes
  - [Fiche 05 - Bibliothèques Faust](../04-dsp-applique/05-bibliotheques-faust.md) : préfixes de bibliothèque, tour des `.lib`
- [Fiche 02 - Les cinq opérateurs de composition](../03-langage-faust-fondamentaux/02-cinq-operateurs-composition.md) : `:`, `,`, `<:`, `:>`, `~`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras retrouver et appliquer la signature exacte des fonctions Faust courantes (`re.*`, `pm.*`, `fi.*`, `co.*`) et des cinq opérateurs de composition, et tu sauras vérifier une signature dans la documentation locale.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la signature d'une fonction Faust ?

**Définition** : La signature d'une fonction Faust décrit le nom de la fonction, l'ordre et le nombre de ses arguments (son arité), ainsi que le nombre d'entrées et de sorties audio qu'elle attend et produit. En Faust, l'ordre des arguments est strict : il n'existe pas d'argument nommé ni d'argument optionnel.

**Le problème que la connaissance des signatures résout** :

Sans connaître les signatures exactes, voici les problèmes rencontrés :

1. **Erreurs d'arité** : passer trois arguments à une fonction qui en attend quatre provoque une erreur de compilation parfois obscure
2. **Mauvais ordre des arguments** : inverser deux paramètres compile sans erreur mais produit un son incorrect (un bug silencieux)
3. **Confusion entre variantes** : `fi.peak_eq` et `fi.peak_eq_cq` ont des signatures différentes ; les confondre donne un comportement inattendu

**Comment la connaissance des signatures résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Erreurs d'arité | Connaître le nombre exact d'arguments évite l'erreur de compilation |
| Mauvais ordre des arguments | Connaître l'ordre exact évite les bugs silencieux |
| Confusion entre variantes | Distinguer les variantes évite les comportements inattendus |

**Analogie concrète** : Une signature de fonction Faust est comme la notice de branchement d'un appareil électrique. La notice indique combien de fils il y a (l'arité), dans quel ordre les brancher (phase, neutre, terre) et ce qui entre et sort (l'alimentation et la sortie). Brancher dans le mauvais ordre ne déclenche pas toujours une alarme : parfois l'appareil fonctionne mal sans le signaler. D'où l'importance de suivre la notice exacte.

**Ce qu'une signature n'est PAS** :

- Une signature Faust n'est pas typée comme en C++ ou TypeScript. Faust ne distingue pas `int` de `float` dans la signature visible. Le compilateur infère les types.
- Une signature Faust ne comporte pas d'arguments optionnels. Si une fonction attend quatre arguments, tu dois en fournir exactement quatre.

---

### Qu'est-ce qu'une erreur d'arité ?

**Définition** : Une erreur d'arité survient quand tu fournis à une fonction un nombre d'arguments différent de celui qu'elle attend. En Faust, comme les fonctions peuvent être partiellement appliquées et combinées avec des opérateurs, une erreur d'arité ne produit pas toujours un message clair.

**Pourquoi l'arité est piégeuse en Faust** :

1. **Application partielle** : une fonction appelée avec trop peu d'arguments devient une fonction partielle, ce qui peut compiler mais brancher de travers
2. **Arguments par le signal** : certains arguments sont fournis par le flux de signal (via `:`) plutôt qu'entre parenthèses, ce qui brouille le compte
3. **Messages d'erreur indirects** : l'erreur se manifeste souvent ailleurs (nombre d'entrées/sorties incohérent), loin de la vraie cause

**Exemple d'erreur d'arité** :

```faust
// re.mono_freeverb attend 4 arguments. Ici on n'en fournit que 3.
process = re.mono_freeverb(0.5, 0.5, 0.5);   // ERREUR ou comportement faux
```

**Analogie concrète** : Une erreur d'arité est comme une recette qui demande quatre ingrédients alors que tu n'en mets que trois. Parfois le plat est juste fade (bug silencieux), parfois il ne prend pas du tout (erreur de compilation). Dans les deux cas, le résultat ne correspond pas à la recette.

---

### Signatures de référence : reverbs.lib (re)

**Définition** : `reverbs.lib` (préfixe `re.`) fournit les réverbérations. Les fonctions Freeverb sont les plus utilisées. Leurs signatures, confirmées par la documentation GRAME, sont les suivantes.

| Fonction | Signature exacte | Entrées / Sorties |
| -------- | ---------------- | ----------------- |
| Freeverb mono | `re.mono_freeverb(fb1, fb2, damp, spread)` | 1 entrée, 1 sortie |
| Freeverb stéréo | `re.stereo_freeverb(fb1, fb2, damp, spread)` | 2 entrées, 2 sorties |

**Signification des paramètres Freeverb** :

| Paramètre | Rôle | Plage typique |
| --------- | ---- | ------------- |
| `fb1` | Feedback du combfilter (longueur de réverbération) | 0 à 1 |
| `fb2` | Feedback de l'allpass | 0 à 1 |
| `damp` | Amortissement des hautes fréquences | 0 à 1 |
| `spread` | Décalage de longueur entre les canaux (largeur stéréo) | entier (échantillons) |

```faust
import("stdfaust.lib");

// Reverb stereo : feedback 0.8, allpass 0.5, amortissement 0.4, spread 23
process = re.stereo_freeverb(0.8, 0.5, 0.4, 23);
```

**Note importante** : `re.stereo_freeverb` attend deux entrées et produit deux sorties. Pour réverbérer une source mono, il faut d'abord la dupliquer en stéréo avec `<:`.

---

### Signatures de référence : physmodels.lib (pm)

**Définition** : `physmodels.lib` (préfixe `pm.`) fournit la modélisation physique : cordes, tubes, excitateurs et instruments complets. Ses signatures sont une source fréquente d'erreurs d'arité, car les fonctions ont souvent de nombreux arguments.

**Cordes et tubes (briques de base)** :

| Fonction | Signature exacte | Rôle |
| -------- | ---------------- | ---- |
| Corde idéale | `pm.idealString(length, pluckPosition, excitation)` | Corde simple sans pertes |
| Tube ouvert | `pm.openTube(maxLength, length)` | Segment de tube (vent) |

**Excitateurs (sources d'énergie)** :

| Fonction | Signature exacte | Rôle |
| -------- | ---------------- | ---- |
| Pincement de corde | `pm.pluckString(stringLength, cutoff, maxFreq, sharpness, gain, trigger)` | Excitation de type pincé |
| Frappe (mailloche) | `pm.strike(exPos, sharpness, gain, trigger)` | Excitation de type percuté |

**Instruments complets** :

| Fonction | Signature exacte | Rôle |
| -------- | ---------------- | ---- |
| Corde nylon | `pm.nylonString(length, pluckPosition, excitation)` | Corde de guitare classique |
| Corde acier | `pm.steelString(length, pluckPosition, excitation)` | Corde de guitare folk |
| Modèle clarinette | `pm.clarinetModel(length, pressure, reedStiffness, bellOpening)` | Clarinette physique |

**Signification des paramètres pm courants** :

| Paramètre | Rôle |
| --------- | ---- |
| `length` / `stringLength` | Longueur de la corde ou du tube (détermine la hauteur de la note) |
| `pluckPosition` | Position du pincement le long de la corde (0 à 1) |
| `excitation` | Signal d'excitation injecté dans le modèle |
| `maxLength` | Longueur maximale (constante connue à la compilation) |
| `trigger` | Signal de déclenchement (0 ou 1) |
| `gain` | Intensité de l'excitation |
| `cutoff` | Ratio de fréquence de coupure du filtre de pincement (1 par défaut) |
| `maxFreq` | Ratio de fréquence maximale du pincement (1 par défaut) |
| `sharpness` | Netteté de l'attaque et du relâchement (1 par défaut ; mailloche dure ou molle pour `pm.strike`) |

```faust
import("stdfaust.lib");

// Corde nylon : longueur depuis MIDI, pincee au quart, excitee par une impulsion bruitee
freq = hslider("freq [unit:Hz]", 220, 50, 1000, 0.1);
length = freq : pm.f2l;   // conversion frequence -> longueur de corde
trigger = button("pluck");
excitation = trigger : pm.impulseExcitation;
process = pm.nylonString(length, 0.25, excitation) <: _, _;
```

**Note importante** : `pm.openTube(maxLength, length)` exige que `maxLength` soit une constante connue à la compilation (comme `maxdel` pour les delays). Seul `length` peut varier dynamiquement.

---

### Signatures de référence : filters.lib (fi)

**Définition** : `filters.lib` (préfixe `fi.`) fournit les filtres. Deux pièges d'arité fréquents concernent les égaliseurs paramétriques et les filtres en plateau (shelf).

**Égaliseur paramétrique (peak EQ) : deux variantes à ne pas confondre** :

| Fonction | Signature exacte | Troisième paramètre |
| -------- | ---------------- | ------------------- |
| Peak EQ par bande passante | `fi.peak_eq(gain, fc, bw)` | `bw` = bande passante en Hz |
| Peak EQ par facteur Q | `fi.peak_eq_cq(gain, fc, Q)` | `Q` = facteur de qualité (sans unité) |

La différence est uniquement sur le troisième paramètre :

| `fi.peak_eq(gain, fc, bw)` | `fi.peak_eq_cq(gain, fc, Q)` |
| -------------------------- | ---------------------------- |
| Largeur exprimée en Hz (bande passante) | Largeur exprimée par le facteur Q |
| Largeur constante en Hz quelle que soit `fc` | Largeur proportionnelle à `fc` |
| Utile pour cibler une plage fixe | Utile pour un comportement "musical" |

**Filtres en plateau (shelf) : deux orthographes coexistent** :

| Fonction | Signature exacte | Remarque |
| -------- | ---------------- | -------- |
| Low shelf (forme directe) | `fi.lowshelf(N, gain, fc)` | `N` = ordre du filtre |
| Low shelf (forme simplifiée) | `fi.low_shelf(gain, fc)` | Ordre fixe interne |

**Important sur les shelf** : selon la version des bibliothèques, on rencontre `fi.lowshelf` (avec un argument d'ordre `N`) et `fi.low_shelf` (sans ordre). Ce sont deux fonctions distinctes, pas un alias. Toujours vérifier dans `filters.lib` quelle forme est disponible et quelle est son arité exacte.

```faust
import("stdfaust.lib");

// Peak EQ : +6 dB a 1000 Hz, largeur 200 Hz (par bande passante)
boost_hz = fi.peak_eq(6, 1000, 200);

// Peak EQ equivalent par facteur Q : +6 dB a 1000 Hz, Q = 5
boost_q = fi.peak_eq_cq(6, 1000, 5);

process = boost_hz;
```

---

### Signatures de référence : compressors.lib (co)

**Définition** : `compressors.lib` (préfixe `co.`) fournit les outils de dynamique. Le compresseur mono est le plus utilisé.

| Fonction | Signature exacte | Entrées / Sorties |
| -------- | ---------------- | ----------------- |
| Compresseur mono | `co.compressor_mono(ratio, thresh, att, rel)` | 1 entrée, 1 sortie |
| Compresseur stéréo | `co.compressor_stereo(ratio, thresh, att, rel)` | 2 entrées, 2 sorties |

**Signification des paramètres** :

| Paramètre | Rôle | Plage typique |
| --------- | ---- | ------------- |
| `ratio` | Taux de compression (ex. 4 pour 4:1) | 1 à 20 |
| `thresh` | Seuil de déclenchement en dB | -60 à 0 |
| `att` | Temps d'attaque en secondes | 0.001 à 0.1 |
| `rel` | Temps de relâchement en secondes | 0.05 à 0.5 |

```faust
import("stdfaust.lib");

// Compresseur mono : ratio 4:1, seuil -20 dB, attaque 5 ms, relachement 100 ms
process = co.compressor_mono(4, -20, 0.005, 0.1);
```

**Note importante** : l'ordre est toujours `ratio, thresh, att, rel`. Inverser `att` et `rel` compile sans erreur mais donne une compression au comportement inversé (un bug silencieux typique).

---

### Les cinq opérateurs de composition

**Définition** : Faust possède exactement cinq opérateurs de composition pour relier des blocs de traitement. Chacun impose une règle d'arité entre la sortie du bloc de gauche et l'entrée du bloc de droite.

| Opérateur | Nom | Règle d'arité | Effet |
| --------- | --- | ------------- | ----- |
| `:` | Séquentiel | sorties(A) = entrées(B) | Branche A vers B (en série) |
| `,` | Parallèle | aucune contrainte | Place A et B côte à côte |
| `<:` | Split (division) | sorties(B) = k × sorties(A) | Duplique la sortie de A vers B |
| `:>` | Merge (fusion) | sorties(A) = k × entrées(B) | Additionne les sorties de A vers B |
| `~` | Récursif (feedback) | voir ci-dessous | Crée une boucle de rétroaction |

**Règle détaillée de l'opérateur récursif `~`** :

L'expression `A ~ B` crée une boucle. La sortie de `A` repasse par `B` puis revient en entrée de `A` (avec un échantillon de retard automatique). Les contraintes d'arité sont :

```text
A ~ B :
  - les sorties de B doivent egaler les premieres entrees de A
  - les sorties de A doivent egaler les entrees de B
  - un retard d'un echantillon est insere automatiquement dans la boucle
```

**Analogie concrète** : Les cinq opérateurs sont comme cinq façons de relier des tuyaux de plomberie. Le séquentiel (`:`) raccorde deux tuyaux bout à bout. Le parallèle (`,`) pose deux tuyaux côte à côte sans les relier. Le split (`<:`) est un répartiteur en Y qui envoie l'eau d'un tuyau vers plusieurs. Le merge (`:>`) est un collecteur qui réunit plusieurs tuyaux en un seul (en additionnant les débits). Le récursif (`~`) est une boucle qui renvoie une partie de l'eau en amont.

```faust
import("stdfaust.lib");

// Exemple des cinq operateurs combines :
// source dupliquee (<:), filtree en parallele (,), refusionnee (:>),
// avec un echo en boucle (~), le tout en serie (:)
echo = + ~ (de.fdelay(48000, 12000) : *(0.4));   // boucle de feedback
process = os.sawtooth(220)
    <: fi.lowpass(2, 2000), fi.highpass(2, 500)   // split puis parallele
    :> echo                                        // merge puis echo
    : *(0.3);                                       // sequentiel : gain final
```

---

### Comment lire la documentation des bibliothèques en local (offline)

**Définition** : La documentation des fonctions Faust est intégrée directement dans les fichiers `.lib` sous forme de commentaires structurés. En environnement offline, ces fichiers sont la source de vérité : chaque fonction publique y est documentée avec sa signature exacte.

**Le problème que la documentation locale résout** :

1. **Pas d'accès internet** : impossible de consulter le site de documentation en ligne
2. **Version exacte** : la documentation en ligne peut correspondre à une version différente de celle installée sur la machine
3. **Vérification rapide** : trouver une signature dans le code est plus rapide que de chercher en ligne

**Format de documentation dans les fichiers `.lib`** :

Chaque fonction est précédée d'un bloc de commentaire structuré :

```text
//-------------------`(re.)mono_freeverb`-------------------
// A simple Freeverb implementation (mono).
//
// #### Usage
//
// ```
// _ : mono_freeverb(fb1, fb2, damp, spread) : _
// ```
//
// Where:
//
// * `fb1`: coefficient of the lowpass comb filters (0-1)
// * `fb2`: coefficient of the allpass comb filters (0-1)
// * `damp`: damping of the lowpass comb filters (0-1)
// * `spread`: spatial spread in number of samples
//----------------------------------------------------------
```

Le bloc `#### Usage` contient la signature exacte. La section `Where:` décrit chaque paramètre dans l'ordre.

**Où trouver les fichiers `.lib`** :

| Système | Emplacement typique |
| ------- | ------------------- |
| Linux | `/usr/local/share/faust/` |
| macOS (Homebrew) | `/usr/local/share/faust/` ou `/opt/homebrew/share/faust/` |
| Compilation depuis les sources | `<dépôt>/libraries/` |

**Analogie concrète** : Lire la documentation locale, c'est comme consulter la notice papier rangée dans le tiroir plutôt que de chercher la version PDF sur internet. La notice papier (le fichier `.lib`) correspond exactement à l'appareil que tu as entre les mains (la version installée), alors que la version en ligne peut décrire un modèle plus récent ou plus ancien.

---

## Étapes Pratiques

### Étape 1 : Localiser les fichiers de bibliothèque sur ta machine

On retrouve l'emplacement des fichiers `.lib` installés.

```bash
# Chercher le repertoire des bibliotheques Faust
find /usr/local/share/faust /opt/homebrew/share/faust -name "*.lib" 2>/dev/null | sort
```

**Résultat attendu** :

```text
/usr/local/share/faust/analyzers.lib
/usr/local/share/faust/basics.lib
/usr/local/share/faust/compressors.lib
/usr/local/share/faust/delays.lib
/usr/local/share/faust/envelopes.lib
/usr/local/share/faust/filters.lib
/usr/local/share/faust/oscillators.lib
/usr/local/share/faust/physmodels.lib
/usr/local/share/faust/reverbs.lib
...
/usr/local/share/faust/stdfaust.lib
```

---

### Étape 2 : Vérifier une signature dans un fichier .lib

On vérifie la signature exacte de `mono_freeverb` directement dans `reverbs.lib`.

```bash
# Afficher le bloc de documentation et la definition de mono_freeverb.
# L'option -A 20 montre les 20 lignes suivant la correspondance.
grep -n -A 20 "(re.)mono_freeverb" /usr/local/share/faust/reverbs.lib
```

**Résultat attendu** :

```text
//-------------------`(re.)mono_freeverb`-------------------
// A simple Freeverb (mono).
//
// #### Usage
//
// ```
// _ : mono_freeverb(fb1, fb2, damp, spread) : _
// ```
//
// Where:
//
// * `fb1`: ...
// * `fb2`: ...
// * `damp`: ...
// * `spread`: ...
```

Tu confirmes ainsi l'arité : quatre arguments dans l'ordre `fb1, fb2, damp, spread`.

---

### Étape 3 : Compiler un exemple correct pour chaque famille

On vérifie qu'un exemple par famille (re, pm, fi, co) compile sans erreur.

```faust
// Fichier : signatures_ok.dsp
import("stdfaust.lib");

// re : reverb stereo (4 arguments)
reverb = re.stereo_freeverb(0.8, 0.5, 0.4, 23);

// fi : peak EQ par bande passante (3 arguments) puis par Q (3 arguments)
eq = fi.peak_eq(6, 1000, 200) : fi.peak_eq_cq(-3, 3000, 5);

// co : compresseur mono (4 arguments)
comp = co.compressor_mono(4, -20, 0.005, 0.1);

// Chaine mono : EQ -> compresseur -> duplication stereo -> reverb
process = eq : comp <: reverb;
```

```bash
faust signatures_ok.dsp -o /dev/null && echo "Toutes les signatures sont correctes"
```

**Résultat attendu** :

```text
Toutes les signatures sont correctes
```

---

### Étape 4 : Provoquer puis corriger une erreur d'arité

On provoque volontairement une erreur d'arité, puis on la corrige.

```faust
// Fichier : erreur_arite.dsp
import("stdfaust.lib");

// ERREUR : mono_freeverb attend 4 arguments, on n'en fournit que 3
process = re.mono_freeverb(0.5, 0.5, 0.5);
```

```bash
# Cette compilation doit echouer
faust erreur_arite.dsp -o /dev/null
```

**Résultat attendu** :

```text
ERROR : ... (message indiquant un probleme d'arite ou d'entrees/sorties)
```

Correction :

```faust
// Fichier : erreur_arite_corrigee.dsp
import("stdfaust.lib");

// CORRECT : les 4 arguments fb1, fb2, damp, spread
process = re.mono_freeverb(0.5, 0.5, 0.5, 23);
```

```bash
faust erreur_arite_corrigee.dsp -o /dev/null && echo "Corrige"
```

**Résultat attendu** :

```text
Corrige
```

---

### Étape 5 : Distinguer peak_eq et peak_eq_cq par l'écoute du code

On vérifie que les deux variantes de peak EQ produisent des largeurs différentes pour des paramètres analogues.

```faust
// Fichier : peak_eq_comparaison.dsp
import("stdfaust.lib");

source = no.noise * 0.3;   // bruit blanc pour entendre la forme du filtre

// Variante 1 : largeur fixe de 100 Hz (par bande passante)
par_bw = fi.peak_eq(12, 1000, 100);

// Variante 2 : largeur definie par Q = 10
par_q = fi.peak_eq_cq(12, 1000, 10);

choix = checkbox("par Q (coche) vs par bande passante (decoche)");
process = source : select2(choix, par_bw, par_q);
```

```bash
faust2jaqt peak_eq_comparaison.dsp
```

**Résultat attendu** :

```text
- par bande passante (fi.peak_eq) : bosse de largeur fixe (100 Hz) autour de 1000 Hz
- par Q (fi.peak_eq_cq) : bosse dont la largeur depend du rapport fc/Q
- A 1000 Hz, les deux sonnent proches ; en changeant fc, les comportements divergent
```

---

## Commandes Utiles

| Commande / Expression | Action |
| --------------------- | ------ |
| `find /usr/local/share/faust -name "*.lib"` | Localiser les fichiers de bibliothèque installés |
| `grep -n -A 20 "(re.)mono_freeverb" reverbs.lib` | Lire le bloc de doc et la signature d'une fonction |
| `grep -rn "peak_eq" filters.lib` | Trouver toutes les variantes d'une fonction |
| `faust fichier.dsp -o /dev/null` | Vérifier qu'un fichier compile (test d'arité) |
| `re.mono_freeverb(fb1, fb2, damp, spread)` | Freeverb mono (4 arguments) |
| `re.stereo_freeverb(fb1, fb2, damp, spread)` | Freeverb stéréo (4 arguments, 2 entrées/sorties) |
| `pm.idealString(length, pluckPosition, excitation)` | Corde idéale (3 arguments) |
| `pm.openTube(maxLength, length)` | Tube ouvert (`maxLength` constant) |
| `pm.strike(exPos, sharpness, gain, trigger)` | Excitation de frappe (4 arguments) |
| `fi.peak_eq(gain, fc, bw)` | Peak EQ par bande passante (Hz) |
| `fi.peak_eq_cq(gain, fc, Q)` | Peak EQ par facteur Q |
| `co.compressor_mono(ratio, thresh, att, rel)` | Compresseur mono (4 arguments) |

---

## Pièges Fréquents

### Piège 1 : Confondre fi.peak_eq et fi.peak_eq_cq

⚠️ **Problème** : Passer un facteur Q (par exemple 5) à `fi.peak_eq` comme s'il s'agissait d'une bande passante donne une bosse de seulement 5 Hz de large, donc quasi inaudible.

✅ **Solution** : Le troisième paramètre de `fi.peak_eq` est une bande passante en Hz ; celui de `fi.peak_eq_cq` est un facteur Q. Choisir la fonction selon l'unité voulue.

```faust
// Probleme : 5 interprete comme 5 Hz de large -> bosse invisible
process = fi.peak_eq(6, 1000, 5);

// Solution : utiliser peak_eq_cq pour un facteur Q
process = fi.peak_eq_cq(6, 1000, 5);
```

---

### Piège 2 : Inverser att et rel dans un compresseur

⚠️ **Problème** : Écrire `co.compressor_mono(4, -20, 0.1, 0.005)` inverse l'attaque (devenue 100 ms) et le relâchement (devenu 5 ms). Le compresseur compile mais réagit à l'envers.

✅ **Solution** : Respecter l'ordre `ratio, thresh, att, rel`. L'attaque est presque toujours plus courte que le relâchement.

```faust
// Probleme : att=0.1 et rel=0.005 (inverses)
process = co.compressor_mono(4, -20, 0.1, 0.005);

// Solution : att court (5 ms), rel long (100 ms)
process = co.compressor_mono(4, -20, 0.005, 0.1);
```

---

### Piège 3 : Oublier que maxLength de pm.openTube doit être constant

⚠️ **Problème** : Passer un `hslider` comme `maxLength` à `pm.openTube` provoque une erreur de compilation, car la longueur maximale doit être connue à la compilation.

✅ **Solution** : Utiliser une constante pour `maxLength` et laisser varier seulement `length`.

```faust
import("stdfaust.lib");

// Probleme : maxLength variable interdit
maxlen = hslider("maxlen", 2, 0.5, 4, 0.1);
process = pm.openTube(maxlen, 1);   // erreur

// Solution : maxLength constant
length = hslider("length", 1, 0.5, 2, 0.01);
process = pm.openTube(4, length);   // 4 = constante
```

---

### Piège 4 : Donner une source mono à une fonction stéréo

⚠️ **Problème** : Brancher une source mono dans `re.stereo_freeverb` (qui attend deux entrées) provoque une erreur d'arité d'entrées.

✅ **Solution** : Dupliquer la source mono en stéréo avec `<:` avant la réverbération stéréo.

```faust
import("stdfaust.lib");

// Probleme : 1 entree fournie a une fonction qui en attend 2
process = os.sawtooth(220) : re.stereo_freeverb(0.8, 0.5, 0.4, 23);

// Solution : duplication mono -> stereo avec <:
process = os.sawtooth(220) <: re.stereo_freeverb(0.8, 0.5, 0.4, 23);
```

---

### Piège 5 : Confondre fi.lowshelf et fi.low_shelf

⚠️ **Problème** : Appeler `fi.low_shelf(N, gain, fc)` avec un argument d'ordre `N`, alors que cette forme n'en attend pas, provoque une erreur d'arité (ou inversement pour `fi.lowshelf`).

✅ **Solution** : Vérifier dans `filters.lib` quelle forme est disponible. `fi.lowshelf` prend un ordre `N` ; `fi.low_shelf` n'en prend pas.

```faust
import("stdfaust.lib");

// fi.lowshelf attend un ordre N en premier
shelf_avec_ordre = fi.lowshelf(3, 6, 200);

// fi.low_shelf n'attend pas d'ordre
shelf_sans_ordre = fi.low_shelf(6, 200);

process = shelf_sans_ordre;
```

---

### Piège 6 : Compter les arguments fournis par le signal

⚠️ **Problème** : Oublier que certaines fonctions reçoivent leur entrée audio par le flux de signal (`:`) en plus des arguments entre parenthèses, ce qui fausse le compte d'arité.

✅ **Solution** : Distinguer les arguments de configuration (entre parenthèses) de l'entrée audio (fournie par `:`). Le bloc `#### Usage` du fichier `.lib` montre cette distinction avec les `_`.

```text
Dans la doc :  _ : mono_freeverb(fb1, fb2, damp, spread) : _

Le "_" a gauche est l'entree audio (par le signal).
Les 4 valeurs entre parentheses sont les arguments de configuration.
```

---

## Checklist de Validation

- [ ] Je sais qu'une signature Faust impose un ordre strict, sans argument optionnel ni nommé
- [ ] Je connais la signature `re.mono_freeverb(fb1, fb2, damp, spread)` et sa variante stéréo
- [ ] Je connais les signatures `pm.idealString`, `pm.openTube`, `pm.pluckString`, `pm.strike`
- [ ] Je sais que `pm.openTube` exige un `maxLength` constant à la compilation
- [ ] Je sais distinguer `fi.peak_eq(gain, fc, bw)` de `fi.peak_eq_cq(gain, fc, Q)`
- [ ] Je sais que `fi.lowshelf` (avec ordre) et `fi.low_shelf` (sans ordre) sont deux fonctions distinctes
- [ ] Je connais l'ordre `ratio, thresh, att, rel` de `co.compressor_mono`
- [ ] Je connais les cinq opérateurs de composition (`:`, `,`, `<:`, `:>`, `~`) et leurs règles d'arité
- [ ] Je sais localiser les fichiers `.lib` sur ma machine
- [ ] Je sais lire une signature dans le bloc `#### Usage` d'un fichier `.lib` en local

---

## Exercice Pratique

**Énoncé** : Construis une chaîne de traitement complète qui assemble une fonction de chaque famille étudiée, en respectant les signatures exactes. La chaîne doit :

1. Générer une corde nylon excitée par une impulsion (`pm.nylonString`)
2. Égaliser le résultat avec un peak EQ par facteur Q (`fi.peak_eq_cq`)
3. Compresser le signal (`co.compressor_mono`)
4. Dupliquer en stéréo et ajouter une réverbération stéréo (`re.stereo_freeverb`)

**Indications** :

- Utilise un `button` pour déclencher le pincement
- Convertis la fréquence en longueur de corde avec `pm.f2l`
- Crée l'excitation avec `pm.impulseExcitation`
- Respecte l'ordre exact des arguments de chaque fonction (relis les tables de signatures)
- N'oublie pas le `<:` avant la réverbération stéréo (sortie mono vers entrée stéréo)
- Vérifie d'abord la compilation avec `faust fichier.dsp -o /dev/null`

**Résultat attendu** : Un fichier `chaine_signatures.dsp` qui compile sans erreur d'arité et produit une corde pincée, égalisée, compressée et réverbérée en stéréo.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```faust
// Fichier : chaine_signatures.dsp
import("stdfaust.lib");

// === Parametres d'interface ===
freq = hslider("[0]freq [unit:Hz]", 220, 50, 1000, 0.1);
pluckPos = hslider("[1]position pincement", 0.25, 0, 1, 0.01);

// === 1. Corde nylon (pm) ===
// pm.nylonString(length, pluckPosition, excitation)
// length : conversion frequence -> longueur via pm.f2l
length = freq : pm.f2l;
// excitation : impulsion declenchee par un bouton
trigger = button("[2]pluck");
excitation = trigger : pm.impulseExcitation;
corde = pm.nylonString(length, pluckPos, excitation);

// === 2. Peak EQ par facteur Q (fi) ===
// fi.peak_eq_cq(gain, fc, Q) : +4 dB a 2000 Hz, Q = 4
eq = fi.peak_eq_cq(4, 2000, 4);

// === 3. Compresseur mono (co) ===
// co.compressor_mono(ratio, thresh, att, rel)
comp = co.compressor_mono(3, -18, 0.005, 0.12);

// === 4. Reverb stereo (re) ===
// re.stereo_freeverb(fb1, fb2, damp, spread) : 2 entrees, 2 sorties
reverb = re.stereo_freeverb(0.85, 0.5, 0.4, 23);

// === Assemblage : corde (mono) -> EQ -> comp -> duplication stereo -> reverb ===
process = corde : eq : comp <: reverb;
```

**Vérification de la compilation** :

```bash
# Verifier l'absence d'erreur d'arite
faust chaine_signatures.dsp -o /dev/null && echo "Chaine valide"

# Compiler avec interface audio pour ecouter
faust2jaqt chaine_signatures.dsp
```

**Résultat attendu** :

```text
Chaine valide

A l'ecoute (apres appui sur "pluck") :
- Une corde nylon pincee (attaque douce, harmoniques de corde)
- Un leger renforcement autour de 2000 Hz (peak EQ par Q)
- Une dynamique controlee (compresseur)
- Une queue de reverberation stereo naturelle
```

**Points à observer dans la solution** :

- Chaque fonction respecte sa signature exacte : `pm.nylonString` (3 arguments), `fi.peak_eq_cq` (3 arguments avec Q), `co.compressor_mono` (4 arguments dans l'ordre `ratio, thresh, att, rel`), `re.stereo_freeverb` (4 arguments, 2 entrées/sorties).
- Le `<:` avant `reverb` est indispensable : la chaîne est mono jusqu'au compresseur, et `re.stereo_freeverb` attend deux entrées.
- L'ordre des opérateurs (`:` puis `<:`) suit les règles d'arité : séquentiel tant que mono, split au moment de passer en stéréo.
- En cas de doute sur une signature, le réflexe est de la vérifier dans le fichier `.lib` correspondant avec `grep -A 20`.

---

Félicitations ! Tu as terminé le cursus Faust. Tu maîtrises maintenant un langage unique qui connecte la rigueur mathématique, le traitement du signal et la création musicale.

---

## Navigation

← Fiche précédente : **[04 - Projets créatifs](04-projets-creatifs.md)**
