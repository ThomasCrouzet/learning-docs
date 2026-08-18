---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Cryptographie essentielle : clés publiques, clés privées, fonctions de hachage et signatures numériques"
estimated_time: "45 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 1 - Fondamentaux"
---

# 02 - Cryptographie essentielle : clés, hachage et signatures

> **En bref** : Cette fiche explique les bases de la cryptographie nécessaires pour comprendre les crypto-monnaies : chiffrement symétrique, chiffrement asymétrique, fonctions de hachage et signatures numériques. Lecture estimée : 45 min.

## Prérequis

- [Phase 1, Fiche 01 - La monnaie : fonctions, confiance et limites](01-monnaie-fonctions-confiance-limites.md) (comprendre pourquoi on cherche des alternatives au système actuel)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer la différence entre chiffrement symétrique et asymétrique, décrire le fonctionnement d'une fonction de hachage, comprendre ce qu'est une signature numérique, et visualiser comment ces éléments s'assemblent pour créer une adresse crypto.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce que la cryptographie ?

**Définition** : La cryptographie est l'ensemble des techniques qui permettent de sécuriser l'information. Le mot vient du grec _kryptos_ (caché) et _graphein_ (écrire). En pratique, elle répond à trois questions : comment s'assurer que personne d'autre ne peut lire un message ? Comment prouver que le message n'a pas été modifié ? Comment prouver qui l'a envoyé ?

**Le problème que la cryptographie résout** :

Sans cryptographie, voici les problèmes rencontrés :

1. **Confidentialité** : n'importe qui peut lire tes messages et tes données
2. **Intégrité** : n'importe qui peut modifier un message en transit sans que tu le saches
3. **Authenticité** : impossible de prouver qu'un message vient bien de la personne qui prétend l'avoir envoyé

**Comment la cryptographie résout ces problèmes** :

| Problème | Technique cryptographique | Résultat |
| -------- | ------------------------- | -------- |
| Confidentialité | Chiffrement (symétrique ou asymétrique) | Seul le destinataire peut lire le message |
| Intégrité | Fonctions de hachage | Toute modification est détectée immédiatement |
| Authenticite | Signatures numériques | L'expéditeur est identifié de manière certaine |

**Analogie concrète** : Pense à un courrier postal. La cryptographie, c'est trois choses : une enveloppe opaque (chiffrement - personne ne peut lire), un sceau de cire (hachage - on voit si quelqu'un a ouvert), et ta signature manuscrite (signature numérique - on sait que c'est toi).

**Ce que la cryptographie n'est PAS** :

- La cryptographie ne rend pas les données invisibles. Un message chiffré est visible sur le réseau - il est juste illisible sans la clé. Tout le monde voit qu'un message existe, mais personne ne peut en lire le contenu
- La cryptographie ne protège pas contre l'erreur humaine. Si tu donnes ta clé privée à quelqu'un, toute la sécurité s'effondre, même si les algorithmes sont parfaits

### Qu'est-ce que le chiffrement symétrique ?

**Définition** : Le chiffrement symétrique utilise une seule et même clé pour chiffrer (rendre illisible) et déchiffrer (rendre lisible) un message. L'expéditeur et le destinataire doivent tous les deux posséder cette clé.

**Le problème que le chiffrement symétrique résout** :

Sans chiffrement symétrique, voici les problèmes rencontrés :

1. **Messages lisibles par tous** : quiconque intercepte le message peut le lire
2. **Besoin de rapidité** : certaines situations nécessitent de chiffrer de grandes quantités de données très rapidement

**Comment le chiffrement symétrique fonctionne** :

```text
Message original : "Bonjour"
         |
         v
   [ Chiffrement avec la clé secrète "ABC123" ]
         |
         v
Message chiffre : "x7$kQ9#mP"
         |
         v
   [ Déchiffrement avec la même clé "ABC123" ]
         |
         v
Message original : "Bonjour"
```

**Analogie concrète** : Un cadenas à code. Tu mets un document dans un coffre, tu le fermes avec le code 4-7-2-1. Pour l'ouvrir, ton correspondant doit connaître exactement le même code : 4-7-2-1. Le problème : comment lui transmettre le code sans que quelqu'un d'autre l'intercepte ?

**Limite fondamentale** : Le chiffrement symétrique à un défaut majeur appelé le _problème de distribution des clés_. Pour échanger en sécurité, les deux personnes doivent d'abord partager la clé secrète. Mais comment partager cette clé en sécurité si on n'a pas encore de canal sécurisé ? C'est un problème circulaire.

**Algorithme courant** : AES (Advanced Encryption Standard) avec des clés de 128 ou 256 bits. C'est l'algorithme utilisé par les banques, les gouvernements et les services de messagerie.

### Qu'est-ce que le chiffrement asymétrique ?

**Définition** : Le chiffrement asymétrique utilise deux clés différentes mais mathématiquement liées. La _clé publique_ sert à chiffrer. La _clé privée_ sert à déchiffrer. N'importe qui peut chiffrer avec la clé publique, mais seul le propriétaire de la clé privée peut déchiffrer.

**Le problème que le chiffrement asymétrique résout** :

Sans chiffrement asymétrique, voici les problèmes rencontrés :

1. **Distribution des clés** : le chiffrement symétrique oblige à transmettre la clé secrète par un canal sécurisé qui n'existe pas encore
2. **Passage à l'échelle** : avec N personnes, il faut N x (N-1) / 2 clés symétriques différentes. Pour 1 000 personnes, cela fait 499 500 clés à gérer

**Comment le chiffrement asymétrique fonctionne** :

```text
Alice veut envoyer un message secret à Bob.

1. Bob génère une paire de clés :
   - Clé publique : donne à tout le monde (comme une adresse postale)
   - Clé privée : garde secrète (comme la clé de sa boîte aux lettres)

2. Alice chiffre son message avec la clé publique de Bob :
   "Bonjour Bob" + clé publique de Bob -> "x7$kQ9#mP"

3. Alice envoie le message chiffre à Bob

4. Bob déchiffre avec sa clé privée :
   "x7$kQ9#mP" + clé privée de Bob -> "Bonjour Bob"

5. Personne d'autre ne peut déchiffrer, car personne d'autre
   ne possède la clé privée de Bob.
```

Le schéma suivant illustre le flux de chiffrement asymétrique entre Alice et Bob :

<div class="diagram-design">
<p><a href="../../../diagrams/crypto-monnaies-01-fondamentaux-02-cryptographie-essentielle-1.html">Qu&#x27;est-ce que le chiffrement asymétrique ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/crypto-monnaies-01-fondamentaux-02-cryptographie-essentielle-1.html" title="Qu&#x27;est-ce que le chiffrement asymétrique ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : Une boîte aux lettrès dans la rue. Tout le monde connaît son emplacement (clé publique) et peut y déposer du courrier par la fente. Mais seul le propriétaire possède la clé physique (clé privée) pour ouvrir la boîte et lire le courrier. Déposer un courrier est facile. L'extraire sans la clé est impossible.

**Propriété mathématique essentielle** : La clé publique est calculée à partir de la clé privée grâce à une opération mathématique facile à faire dans un sens mais pratiquement impossible à inverser. C'est comme mélanger deux couleurs de peinture : facile à faire, impossible à défaire.

**Comparaison chiffrement symétrique vs asymétrique** :

| Chiffrement symétrique | Chiffrement asymétrique |
| ---------------------- | ----------------------- |
| Une seule clé | Deux clés (publique + privée) |
| Très rapide | Plus lent (100 à 1 000 fois) |
| Problème de distribution de la clé | Pas de problème de distribution |
| Idéal pour chiffrer de gros volumes | Idéal pour échanger des clés et signer |
| Exemple : AES | Exemple : RSA, ECDSA |

**En pratique** : Les deux sont utilisés ensemble. Le chiffrement asymétrique sert à échanger une clé symétrique temporaire. Ensuite, la communication utilise le chiffrement symétrique (plus rapide) avec cette clé. C'est exactement ce qui se passe quand tu visites un site HTTPS.

### Qu'est-ce qu'une fonction de hachage ?

**Définition** : Une fonction de hachage prend une donnée de n'importe quelle taille (un mot, un fichier, un livre entier) et produit une empreinte de taille fixe. Cette empreinte s'appelle un _hash_ ou _empreinte numérique_.

**Le problème que les fonctions de hachage résolvent** :

Sans fonctions de hachage, voici les problèmes rencontrés :

1. **Vérification d'intégrité** : impossible de savoir si un fichier a été modifié pendant un transfert
2. **Stockage des mots de passe** : les stocker en clair est dangereux, mais il faut pouvoir les vérifier
3. **Identification rapide** : comparer deux fichiers volumineux octet par octet est extrêmement lent

**Les quatre propriétés d'une bonne fonction de hachage** :

| Propriété | Signification | Exemple |
| --------- | ------------- | ------- |
| Déterministe | La même entrée produit toujours la même sortie | "Bonjour" donne toujours le même hash |
| Rapide | Le calcul prend une fraction de seconde | Calculer le hash d'un fichier de 1 Go prend moins d'une seconde |
| Irréversible | Impossible de retrouver l'entrée à partir du hash | Connaître le hash ne permet pas de retrouver "Bonjour" |
| Résistante aux collisions | Deux entrées différentes ne produisent (presque) jamais le même hash | "Bonjour" et "bonjour" donnent des hash complètement différents |

**Exemples concrets avec SHA-256** :

SHA-256 est la fonction de hachage utilisée par Bitcoin. Elle produit toujours une empreinte de 64 caractères hexadécimaux (256 bits).

```text
Entrée : "Bonjour"
Hash   : 9172e8eec99f144f72eca9a568759580edadb2cfd154857f07e657569493bc44

Entrée : "bonjour" (juste la majuscule en moins)
Hash   : 2cb4b1431b84ec15d35ed83bb927e27e8967d75f4bcd9cc4b25c8d879ae23e18

Entrée : "Bonjour " (un espace en plus à la fin)
Hash   : e936a4435f081c22b62895b2c31c1bb52c0ed44a39f3d28305abe59d03393051
```

**Observation importante** : Un seul caractère de différence produit un hash complètement différent. Il n'y a aucune ressemblance entre les deux hash. C'est cette propriété qui rend les fonctions de hachage utiles pour détecter la moindre modification.

**Analogie concrète** : Un mixeur irréversible. Tu mets des fruits dans un mixeur et tu obtiens un smoothie d'une couleur précise. Si tu changes un seul fruit, la couleur du smoothie change complètement. Et surtout : il est impossible de "démixer" le smoothie pour retrouver les fruits d'origine.

**Ce qu'une fonction de hachage n'est PAS** :

- Une fonction de hachage n'est pas un chiffrement. Le chiffrement est réversible (tu peux déchiffrer avec la clé). Le hachage est irréversible - il n'existe aucune "clé" pour retrouver l'entrée
- Une fonction de hachage ne compresse pas les données. La compression permet de reconstruire les données originales. Le hachage détruit délibérément l'information pour ne garder qu'une empreinte

**Vérification avec un terminal** :

Si tu as accès à un terminal (Linux, macOS ou Windows avec Git Bash), tu peux tester toi-même :

```bash
# Calculer le hash SHA-256 du texte "Bonjour"
echo -n "Bonjour" | sha256sum
```

```text
9172e8eec99f144f72eca9a568759580edadb2cfd154857f07e657569493bc44  -
```

```bash
# Calculer le hash SHA-256 du texte "bonjour" (sans majuscule)
echo -n "bonjour" | sha256sum
```

```text
2cb4b1431b84ec15d35ed83bb927e27e8967d75f4bcd9cc4b25c8d879ae23e18  -
```

### Qu'est-ce qu'une signature numérique ?

**Définition** : Une signature numérique est un mécanisme qui permet de prouver qu'un message a bien été envoyé par une personne précise et qu'il n'a pas été modifié. Elle utilise la clé privée de l'expéditeur pour signer et sa clé publique pour que n'importe qui puisse vérifier.

**Le problème que les signatures numériques résolvent** :

Sans signatures numériques, voici les problèmes rencontrés :

1. **Usurpation** : n'importe qui peut prétendre être l'auteur d'un message
2. **Répudiation** : l'auteur d'un message peut nier l'avoir envoyé
3. **Falsification** : un intermédiaire peut modifier le message en transit

**Comment la signature numérique fonctionne** :

```text
Alice veut envoyer un message signe à Bob.

Étape 1 - Alice calcule le hash du message :
   "Je transfère 10 euros à Bob" -> hash : "a3f8..."

Étape 2 - Alice chiffre le hash avec SA CLE PRIVEE :
   hash "a3f8..." + clé privée d'Alice -> signature "7x9k..."

Étape 3 - Alice envoie le message + la signature :
   "Je transfère 10 euros à Bob" + signature "7x9k..."

Étape 4 - Bob vérifie avec LA CLE PUBLIQUE d'Alice :
   a) Bob déchiffre la signature avec la clé publique d'Alice -> hash "a3f8..."
   b) Bob calcule lui-même le hash du message -> hash "a3f8..."
   c) Les deux hash sont identiques -> le message est authentique et intact
```

**Analogie concrète** : Un sceau personnel unique. Au Moyen Âge, chaque seigneur avait un sceau gravé avec un motif unique. Il pressait ce sceau dans la cire chaude pour fermer une lettre. N'importe qui pouvait voir le motif du sceau (clé publique) et vérifier que la lettre venait bien du seigneur. Mais seul le seigneur possédait le sceau physique (clé privée) pour créer cette empreinte.

**Propriétés de la signature numérique** :

| Propriété | Signification |
| --------- | ------------- |
| Authentique | Prouve que le message vient bien du signataire |
| Infalsifiable | Impossible de fabriquer la signature de quelqu'un d'autre sans sa clé privée |
| Non réutilisable | La signature est liée au message exact - elle ne peut pas être copiée sur un autre message |
| Non répudiable | Le signataire ne peut pas nier avoir signé (sauf si sa clé privée a été compromise) |
| Intègre | Toute modification du message invalide la signature |

**Ce qu'une signature numérique n'est PAS** :

- Une signature numérique ne chiffre pas le message. Le message reste lisible par tous. La signature prouve seulement qui l'a envoyé et qu'il n'a pas été modifié
- Une signature numérique n'est pas une signature manuscrite scannée. Une image de signature peut être copiée et collée. Une signature numérique est mathématiquement liée au contenu exact du message

### Comment tout cela s'assemble dans les crypto-monnaies

Les quatre concepts ci-dessus sont les briques de base des crypto-monnaies. Voici comment ils s'assemblent :

**La chaîne clé privée -> clé publique -> adresse** :

```text
Étape 1 : Génération de la clé privée
   Un nombre aleatoire de 256 bits, qui s'écrit en 64 caractères hexadecimaux.
   Exemple (forme hexadecimale brute) :
   1e99423a4 ... 8c54d7c2da53e6f8b1c0a... (64 caractères 0-9 a-f)
   Pour faciliter la sauvegarde, ce même nombre est souvent encode au
   format WIF (Base58), qui commence par un 5 : 5HueCGU8rMjxEXxiPuD5BDk...
   Hexadecimal et WIF représentent la même clé, sous deux écritures.

Étape 2 : Calcul de la clé publique
   On applique une opération mathématique (courbe elliptique)
   à la clé privée pour obtenir la clé publique.
   Clé privée -> Clé publique  (sens unique, irreversible)

Étape 3 : Calcul de l'adresse
   On applique une ou plusieurs fonctions de hachage
   à la clé publique pour obtenir l'adresse.
   Clé publique -> Hash -> Adresse  (sens unique, irreversible)
```

**Ce que chaque élément fait dans une transaction** :

| Élément | Rôle dans une transaction | Qui le connaît |
| ------- | ------------------------ | -------------- |
| Clé privée | Signe la transaction (prouve que tu autorises le transfert) | Toi seul - ne la partage JAMAIS |
| Clé publique | Permet à tous de vérifier ta signature | Tout le monde (elle est dérivée de la clé privée) |
| Adresse | Identifiant pour recevoir des fonds (comme un IBAN) | Tout le monde (elle est dérivée de la clé publique) |
| Signature | Preuve mathématique que le propriétaire de la clé privée a autorisé la transaction | Tout le monde (elle est jointe à la transaction) |
| Hash de la transaction | Identifiant unique de la transaction, garantit son intégrité | Tout le monde (il est calculé par le réseau) |

**Pourquoi cet ordre est important** :

- À partir de la clé privée, on peut calculer la clé publique et l'adresse
- À partir de la clé publique, on peut calculer l'adresse mais PAS la clé privée
- À partir de l'adresse, on ne peut retrouver NI la clé publique NI la clé privée

C'est la propriété d'irréversibilité des fonctions de hachage et des courbes elliptiques qui rend ce système sécurisé.

**Conséquence critique** : Si tu perds ta clé privée, tu perds l'accès à tes fonds. Il n'existe pas de bouton "Mot de passe oublié". Personne - aucune entreprise, aucun gouvernement, aucun service client - ne peut récupérer une clé privée perdue. C'est à la fois la force et la faiblesse de ce système.

**Pour aller plus loin** : Pour une exploration approfondie de la cryptographie (algorithmes, attaques, PKI, TLS), consulte la [fiche Cryptographie du cursus Cybersécurité](../../cybersecurite/02-fondamentaux-securite/02-cryptographie.md).

---

### Encodage des adresses

**Définition** : Une adresse crypto-monnaie n'est pas le hash brut de la clé publique. Elle est encodée dans un format lisible par les humains, conçu pour éviter les erreurs de saisie et les confusions de caractères.

**Pourquoi un encodage spécial est nécessaire** :

Un hash brut en hexadécimal ressemble à ceci : `0x62e907b15cbf27d5425399ebf6f0fb50ebb88f18`. Ce format pose deux problèmes :

1. **Confusion de caractères** : le `0` (zéro) et le `O` (lettre O) se ressemblent, tout comme le `l` (L minuscule) et le `I` (i majuscule). Une seule erreur de copie et les fonds sont envoyés à une adresse inexistante - perdus définitivement.
2. **Pas de détection d'erreur** : si tu te trompes d'un caractère dans un hash hexadécimal, rien ne t'avertit.

**Les trois formats principaux** :

| Format | Utilisation | Exemple de début d'adresse | Particularité |
| --- | --- | --- | --- |
| Base58 | Adresses Bitcoin legacy (P2PKH) | `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` | Supprime les caractères ambigus (0, O, l, I) |
| Base58Check | Adresses Bitcoin legacy avec vérification | `1A1zP1...` (même apparence que Base58) | Ajoute un checksum de 4 octets - détecte les erreurs de copie |
| Bech32 | Adresses Bitcoin SegWit | `bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4` | Détection d'erreurs améliorée, entièrement en minuscules |

**Base58 en détail** :

Base58 utilise 58 caractères : tous les chiffres et lettrès de l'alphabet SAUF les caractères ambigus.

```text
Caractères utilisés par Base58 :
1 2 3 4 5 6 7 8 9
A B C D E F G H J K L M N P Q R S T U V W X Y Z
a b c d e f g h i j k m n o p q r s t u v w x y z

Caractères exclus (et pourquoi) :
0 (zéro)  - confondu avec O (lettre O)
O (lettre) - confondu avec 0 (zéro)
l (L min)  - confondu avec I (i maj) et 1 (chiffre un)
I (i maj)  - confondu avec l (L min) et 1 (chiffre un)
```

**Base58Check** : ajoute un checksum (somme de contrôle) à la fin de l'adresse. Si tu te trompes d'un caractère en copiant l'adresse, le wallet détecte l'erreur et refuse d'envoyer la transaction. C'est une protection contre les erreurs de saisie, pas contre les arnaques.

**Bech32** : introduit avec SegWit, ce format utilise uniquement des minuscules et des chiffres. Sa détection d'erreurs est supérieure à Base58Check : il peut détecter jusqu'à 4 erreurs et localiser leur position. Les adresses commencent par `bc1` (pour Bitcoin mainnet).

**Ce que l'encodage n'est PAS** :

- L'encodage n'est pas du chiffrement. L'adresse reste publique et lisible par tous. L'encodage transforme uniquement la représentation du hash pour la rendre plus pratique et plus sûre à manipuler.
- L'encodage ne protège pas contre l'envoi à une mauvaise adresse valide. Si tu copies l'adresse d'un escroc au lieu de celle du destinataire, le checksum ne t'aidera pas - l'adresse de l'escroc est techniquement valide.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre chiffrement symétrique (une clé) et asymétrique (deux clés)
- [ ] Je comprends le problème de distribution des clés et comment le chiffrement asymétrique le résout
- [ ] Je sais décrire les quatre propriétés d'une fonction de hachage (déterministe, rapide, irréversible, résistante aux collisions)
- [ ] Je peux expliquer ce que fait une signature numérique sans confondre avec le chiffrement
- [ ] Je comprends la chaîne clé privée -> clé publique -> adresse et pourquoi elle est irréversible
- [ ] Je comprends pourquoi perdre sa clé privée signifie perdre ses fonds définitivement

---

## Navigation

← Fiche précédente : **[01 - La monnaie : fonctions, confiance et limites](01-monnaie-fonctions-confiance-limites.md)**

→ Fiche suivante : **[03 - Réseaux pair-à-pair et décentralisation](03-reseaux-pair-a-pair-decentralisation.md)**
