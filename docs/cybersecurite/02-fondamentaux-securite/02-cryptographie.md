---
tags:
  - Cybersécurité
  - Intermédiaire
  - Concept
description: "Chiffrement symétrique et asymétrique, hachage, PKI, TLS et attaques cryptographiques"
estimated_time: "55 min"
fiche_number: 2
total_fiches: 4
cursus: "Phase 2 - Fondamentaux sécurité"
---

# 02 - Cryptographie - Fondements et Applications

> **En bref** : À la fin de cette fiche, tu sauras expliquer les principes fondamentaux de la cryptographie, distinguer chiffrement symétrique et asymétrique, comprendre le fonctionnement des fonctions de hachage, et utiliser des outils pratiques pour chiffrer, signer et vérifier des données. Lecture estimée : 55 min.


## Prérequis

- [Phase 2, Fiche 01 - Principes de sécurité de l'information](01-principes-securite.md) (triade CIA, vocabulaire)
- [Phase 1, Fiche 04 - Programmation et scripting](../01-fondamentaux-informatiques/04-programmation-scripting.md) (Python de base pour les exercices)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les principes fondamentaux de la cryptographie, distinguer chiffrement symétrique et asymétrique, comprendre le fonctionnement des fonctions de hachage, et utiliser des outils pratiques pour chiffrer, signer et vérifier des données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la cryptographie ?

**Définition** : La cryptographie est la science qui étudie les techniques de communication sécurisée en présence d'adversaires. Elle permet de chiffrer (rendre illisible), signer (prouver l'origine) et vérifier l'intégrité des données.

**Le problème que la cryptographie résout** :

Sans cryptographie, voici les problèmes rencontrés :

1. **Écoute passive** : n'importe qui sur le réseau peut lire les messages en clair (mots de passe, emails, données bancaires)
2. **Falsification** : un attaquant peut modifier un message en transit sans que le destinataire le détecte
3. **Usurpation d'identité** : impossible de prouver qu'un message vient bien de l'expéditeur annoncé

**Comment la cryptographie résout ces problèmes** :

| Problème | Solution cryptographique | Propriété CIA protégée |
| -------- | ------------------------ | ---------------------- |
| Écoute passive | Chiffrement (AES, RSA) | Confidentialité |
| Falsification | Hachage + signature numérique | Intégrité |
| Usurpation d'identité | Certificats numériques, PKI | Authenticité |

**Analogie concrète** : Imagine que tu envoies une lettre par la poste. Sans cryptographie, c'est une carte postale : tout le monde peut la lire. Le chiffrement, c'est mettre la lettre dans une enveloppe scellée. La signature numérique, c'est un cachet de cire qui prouve que c'est bien toi qui l'as envoyée et que personne ne l'a ouverte.

**Ce que la cryptographie n'est PAS** :

- La cryptographie n'est pas un remède universel. Elle protège les données, mais pas contre un utilisateur qui donne volontairement son mot de passe (ingénierie sociale)
- La cryptographie n'est pas la stéganographie. La stéganographie cache l'existence du message (ex : cacher du texte dans une image). La cryptographie rend le message illisible mais ne cache pas qu'il existe

Le diagramme suivant présente les trois grandes familles de chiffrement et leurs algorithmes principaux.

<div class="diagram-design">
<p><a href="../../../diagrams/cybersecurite-02-fondamentaux-securite-02-cryptographie-1.html">Qu&#x27;est-ce que la cryptographie ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/cybersecurite-02-fondamentaux-securite-02-cryptographie-1.html" title="Qu&#x27;est-ce que la cryptographie ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Fondements mathématiques

Tu n'as pas besoin de maîtriser les mathématiques en profondeur, mais comprendre les bases te permettra de savoir _pourquoi_ certains algorithmes sont sûrs.

#### Arithmétique modulaire

**Définition** : L'arithmétique modulaire est un système de calcul où les nombres "bouclent" après avoir atteint une valeur maximale (le modulo).

**Exemple concret** : Une horloge fonctionne en modulo 12. Après 12h, on revient à 1h. En arithmétique modulaire : 14 mod 12 = 2 (14 heures = 2 heures de l'après-midi).

**Pourquoi c'est utilisé en cryptographie** : Les opérations modulaires sont faciles à calculer dans un sens (multiplier deux grands nombres premiers) mais très difficiles à inverser (retrouver les facteurs d'un grand nombre). Cette asymétrie est la base de RSA.

#### Logarithme discret

**Définition** : Le problème du logarithme discret consiste à trouver l'exposant _x_ tel que g^x mod p = h, connaissant g, p et h. Ce problème est considéré comme très difficile à résoudre pour de grands nombres.

**Pourquoi c'est utilisé** : C'est la base de l'échange de clés Diffie-Hellman et des algorithmes de signature DSA.

#### Courbes elliptiques

**Définition** : La cryptographie sur courbes elliptiques (ECC) utilise les propriétés mathématiques des courbes elliptiques pour créer des clés plus courtes mais tout aussi sécurisées que RSA.

**Comparaison des tailles de clés** :

| Niveau de sécurité (bits) | Taille clé RSA | Taille clé ECC |
| ------------------------- | -------------- | -------------- |
| 128 | 3072 bits | 256 bits |
| 192 | 7680 bits | 384 bits |
| 256 | 15360 bits | 521 bits |

**Avantage** : Des clés beaucoup plus petites pour le même niveau de sécurité. Idéal pour les appareils mobiles et IoT.

### Qu'est-ce que le chiffrement symétrique ?

**Définition** : Le chiffrement symétrique utilise la même clé pour chiffrer et déchiffrer les données. L'expéditeur et le destinataire doivent tous les deux connaître cette clé secrète.

**Le problème que le chiffrement symétrique résout** :

Sans chiffrement symétrique, voici les problèmes rencontrés :

1. **Données lisibles en transit** : les données circulent en clair sur le réseau
2. **Données lisibles au repos** : un disque dur volé expose toutes les données
3. **Performance** : le chiffrement asymétrique est trop lent pour de grandes quantités de données

**Comment le chiffrement symétrique résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Données lisibles en transit | Chiffrement du flux de données (TLS utilise AES) |
| Données lisibles au repos | Chiffrement de disque (LUKS, BitLocker) |
| Performance | AES est très rapide, supporté par le matériel (AES-NI) |

**Analogie concrète** : C'est comme un cadenas à combinaison. Tu fermes le cadenas avec une combinaison (la clé), et seul celui qui connaît la même combinaison peut l'ouvrir. Le problème : il faut trouver un moyen sûr de transmettre la combinaison à l'autre personne.

**Ce que le chiffrement symétrique n'est PAS** :

- Le chiffrement symétrique ne résout pas le problème de la distribution des clés. Comment transmettre la clé secrète de manière sécurisée ? C'est le rôle du chiffrement asymétrique
- Le chiffrement symétrique ne prouve pas l'identité de l'expéditeur. N'importe qui possédant la clé peut chiffrer un message

#### AES (Advanced Encryption Standard)

**Définition** : AES est l'algorithme de chiffrement symétrique standard, adopté par le NIST en 2001. Il fonctionne avec des clés de 128, 192 ou 256 bits.

**Modes de fonctionnement importants** :

| Mode | Nom complet | Usage recommandé |
| ---- | ----------- | ---------------- |
| **GCM** | Galois/Counter Mode | Recommandé : chiffrement authentifié (confidentialité + intégrité) |
| **CBC** | Cipher Block Chaining | Acceptable avec HMAC, mais vulnérable au padding oracle sans précaution |
| **ECB** | Electronic Codebook | À ne jamais utiliser : chaque bloc identique produit le même chiffré |
| **CTR** | Counter Mode | Bon pour le streaming, mais sans authentification intégrée |

**Règle à retenir** : Utilise toujours AES-256-GCM sauf contrainte spécifique. Il fournit à la fois confidentialité et intégrité.

#### ChaCha20-Poly1305

**Définition** : ChaCha20 est un algorithme de chiffrement par flux conçu par Daniel J. Bernstein. Combiné avec Poly1305 (authentificateur), il forme un schéma de chiffrement authentifié.

**Comparaison avec AES-GCM** :

| AES-256-GCM | ChaCha20-Poly1305 |
| ----------- | ----------------- |
| Rapide avec accélération matérielle (AES-NI) | Rapide sans accélération matérielle |
| Standard NIST | Standard IETF (RFC 8439) |
| Préféré sur serveurs et PC | Préféré sur mobile et appareils sans AES-NI |

### Qu'est-ce que le chiffrement asymétrique ?

**Définition** : Le chiffrement asymétrique utilise une paire de clés liées mathématiquement : une clé publique (que tout le monde peut connaître) et une clé privée (que seul le propriétaire possède). Ce qu'une clé chiffre, seule l'autre peut le déchiffrer.

**Le problème que le chiffrement asymétrique résout** :

Sans chiffrement asymétrique, voici les problèmes rencontrés :

1. **Distribution des clés** : en symétrique, il faut transmettre la clé secrète de manière sécurisée avant de pouvoir communiquer
2. **Nombre de clés explosif** : pour N personnes communicant entre elles, il faut N*(N-1)/2 clés symétriques différentes
3. **Authentification impossible** : en symétrique, impossible de prouver qui a chiffré un message

**Comment le chiffrement asymétrique résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Distribution des clés | La clé publique peut être partagée librement |
| Nombre de clés | Chaque personne n'a qu'une paire de clés (publique + privée) |
| Authentification | La signature avec la clé privée prouve l'identité |

**Analogie concrète** : Imagine une boîte aux lettres avec une fente. N'importe qui peut déposer une lettre dans la fente (chiffrer avec la clé publique), mais seul le propriétaire qui a la clé de la boîte aux lettres (clé privée) peut l'ouvrir et lire les lettres.

#### RSA

**Définition** : RSA (Rivest-Shamir-Adleman, 1977) est l'algorithme de chiffrement asymétrique le plus connu. Sa sécurité repose sur la difficulté de factoriser le produit de deux très grands nombres premiers.

**Tailles de clés recommandées** :

| Taille | Niveau de sécurité | Recommandation |
| ------ | ------------------- | -------------- |
| 1024 bits | Cassé | Ne plus utiliser |
| 2048 bits | Acceptable | Minimum en 2025 |
| 3072 bits | Bon | Recommandé pour les nouvelles clés |
| 4096 bits | Très bon | Pour les données à protéger longtemps |

#### ECC (Elliptic Curve Cryptography) et ECDH

**Définition** : ECC utilise des courbes elliptiques pour le chiffrement asymétrique. ECDH (Elliptic Curve Diffie-Hellman) est le protocole d'échange de clés basé sur ECC.

**Courbes recommandées** :

| Courbe | Taille | Usage |
| ------ | ------ | ----- |
| P-256 (secp256r1) | 256 bits | Standard NIST, TLS |
| P-384 (secp384r1) | 384 bits | Sécurité renforcée |
| Curve25519 | 256 bits | Recommandée par Bernstein, WireGuard, Signal |

### Qu'est-ce que le hachage ?

**Définition** : Une fonction de hachage transforme une entrée de taille quelconque en une sortie de taille fixe (le hash ou empreinte). Cette transformation est à sens unique : il est impossible de retrouver l'entrée à partir du hash.

**Le problème que le hachage résout** :

Sans hachage, voici les problèmes rencontrés :

1. **Stockage des mots de passe** : stocker les mots de passe en clair dans la base de données est catastrophique en cas de fuite
2. **Vérification d'intégrité** : impossible de vérifier qu'un fichier téléchargé n'a pas été modifié
3. **Comparaison rapide** : comparer deux fichiers volumineux octet par octet est lent

**Comment le hachage résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Stockage des mots de passe | On stocke le hash du mot de passe, pas le mot de passe lui-même |
| Vérification d'intégrité | On compare les hash du fichier original et du fichier reçu |
| Comparaison rapide | Comparer deux hash de 256 bits est quasi instantané |

**Analogie concrète** : Un hash, c'est comme une empreinte digitale. Chaque personne a une empreinte unique. À partir de l'empreinte, tu ne peux pas reconstruire la personne. Mais si deux empreintes sont identiques, c'est la même personne (la même donnée).

**Propriétés obligatoires d'une bonne fonction de hachage** :

| Propriété | Signification |
| --------- | ------------- |
| Déterministe | La même entrée produit toujours le même hash |
| Résistance à la préimage | Impossible de retrouver l'entrée à partir du hash |
| Résistance aux collisions | Impossible de trouver deux entrées différentes avec le même hash |
| Effet avalanche | Un changement d'un seul bit dans l'entrée change environ 50% du hash |

#### SHA-256

**Définition** : SHA-256 (Secure Hash Algorithm) produit un hash de 256 bits (32 octets). C'est le standard actuel pour la vérification d'intégrité.

**Usage** : Vérification d'intégrité de fichiers, signatures numériques, blockchain. Ne pas utiliser pour les mots de passe (trop rapide, voir ci-dessous).

#### Fonctions de hachage pour les mots de passe

Les fonctions de hachage standard (SHA-256) sont trop rapides pour les mots de passe : un attaquant peut tester des milliards de combinaisons par seconde. Les fonctions dédiées sont volontairement lentes.

| Fonction | Caractéristique | Recommandation |
| -------- | --------------- | -------------- |
| **Argon2id** | Coûteux en mémoire et en CPU | Recommandé (vainqueur PHC 2015) |
| **bcrypt** | Coûteux en CPU, facteur de coût ajustable | Bon choix, largement supporté |
| **scrypt** | Coûteux en mémoire | Bon choix, utilisé par les cryptomonnaies |
| MD5 | Rapide, cassé | Ne jamais utiliser |
| SHA-1 | Rapide, collisions trouvées | Ne jamais utiliser |

### Qu'est-ce que la PKI ?

**Définition** : La PKI (Public Key Infrastructure) est l'ensemble des rôles, politiques, logiciels et procédures nécessaires pour gérer les certificats numériques et le chiffrement à clé publique.

**Le problème que la PKI résout** :

Sans PKI, voici les problèmes rencontrés :

1. **Confiance dans les clés publiques** : comment savoir si une clé publique appartient vraiment à la personne annoncée ?
2. **Révocation** : comment invalider une clé compromise ?
3. **Passage à l'échelle** : comment gérer les clés de millions d'utilisateurs ?

**Comment la PKI résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Confiance | Les autorités de certification (CA) vérifient l'identité et signent les certificats |
| Révocation | Les listes CRL et le protocole OCSP permettent de vérifier si un certificat est révoqué |
| Passage à l'échelle | Hiérarchie de CA (racine, intermédiaire) permet de déléguer la certification |

**Analogie concrète** : La PKI fonctionne comme un système de pièces d'identité. Le gouvernement (CA racine) ne délivre pas directement les cartes d'identité : il délègue aux mairies (CA intermédiaires). La mairie vérifie ton identité et te donne une carte (certificat). Quand tu montres ta carte, on fait confiance à la chaîne : carte signée par la mairie, mairie autorisée par le gouvernement.

#### Certificats X.509

**Définition** : X.509 est le standard qui définit le format des certificats numériques utilisés dans la PKI. Un certificat X.509 contient :

| Champ | Contenu |
| ----- | ------- |
| Subject | Identité du propriétaire (nom de domaine, organisation) |
| Issuer | Autorité de certification qui a signé le certificat |
| Public Key | Clé publique du propriétaire |
| Validity | Dates de début et de fin de validité |
| Serial Number | Identifiant unique du certificat |
| Signature | Signature numérique de la CA |

### TLS 1.3

**Définition** : TLS 1.3 (Transport Layer Security) est le protocole qui sécurise les communications sur Internet (HTTPS). La version 1.3, publiée en 2018 (RFC 8446), est la plus récente et la plus sécurisée.

**Améliorations de TLS 1.3 par rapport à TLS 1.2** :

| Aspect | TLS 1.2 | TLS 1.3 |
| ------ | ------- | ------- |
| Handshake | 2 aller-retours (2-RTT) | 1 aller-retour (1-RTT) |
| Cipher suites | Nombreuses, dont certaines faibles | 5 cipher suites sécurisées uniquement |
| Forward secrecy | Optionnel | Obligatoire |
| 0-RTT | Non supporté | Supporté (avec précautions) |

**Forward secrecy** : même si la clé privée du serveur est compromise dans le futur, les communications passées restent protégées. Chaque session utilise une clé éphémère unique.

### Protocoles cryptographiques

#### Échange de clés Diffie-Hellman

**Définition** : Diffie-Hellman permet à deux parties de se mettre d'accord sur une clé secrète partagée en communiquant uniquement sur un canal non sécurisé.

**Principe simplifié** :

1. Alice et Bob choisissent publiquement un nombre premier _p_ et un générateur _g_
2. Alice choisit un secret _a_, calcule A = g^a mod p, et envoie A à Bob
3. Bob choisit un secret _b_, calcule B = g^b mod p, et envoie B à Alice
4. Alice calcule la clé partagée : K = B^a mod p
5. Bob calcule la clé partagée : K = A^b mod p
6. Les deux obtiennent la même clé K, sans jamais l'avoir transmise

#### Signatures numériques

**Définition** : Une signature numérique utilise la clé privée de l'expéditeur pour signer un message, et n'importe qui peut vérifier la signature avec la clé publique.

**Processus** :

1. L'expéditeur calcule le hash du message
2. Il chiffre le hash avec sa clé privée (c'est la signature)
3. Il envoie le message + la signature
4. Le destinataire déchiffre la signature avec la clé publique de l'expéditeur
5. Il calcule le hash du message reçu et compare les deux hash

#### HMAC (Hash-based Message Authentication Code)

**Définition** : HMAC combine une fonction de hachage avec une clé secrète pour produire un code d'authentification. Il garantit à la fois l'intégrité et l'authenticité du message.

**Différence avec un simple hash** :

| Hash simple (SHA-256) | HMAC-SHA256 |
| --------------------- | ----------- |
| Pas de clé secrète | Utilise une clé secrète partagée |
| Prouve l'intégrité uniquement | Prouve l'intégrité et l'authenticité |
| Vulnérable à l'attaque par extension de longueur | Protégé contre cette attaque |

### Attaques cryptographiques

| Attaque | Principe | Cible |
| ------- | -------- | ----- |
| **Brute-force** | Tester toutes les clés possibles | Clés trop courtes, mots de passe faibles |
| **Birthday attack** | Exploiter le paradoxe des anniversaires pour trouver des collisions | Fonctions de hachage avec sortie trop courte |
| **Padding oracle** | Exploiter les messages d'erreur de padding pour déchiffrer | AES-CBC sans authentification |
| **Downgrade** | Forcer l'utilisation d'un protocole ou algorithme plus faible | Négociation TLS (ex : POODLE, FREAK) |
| **Rainbow tables** | Tables pré-calculées de hash pour inverser le hachage | Mots de passe hashés sans sel (salt) |
| **Side-channel** | Exploiter le temps d'exécution, la consommation électrique | Implémentations matérielles et logicielles |

---

## Étapes Pratiques

### Étape 1 : Générer des hash avec OpenSSL

```bash
# Créer un fichier de test
echo "Bonjour, ceci est un message de test." > message.txt

# Calculer le hash SHA-256 du fichier
openssl dgst -sha256 message.txt

# Calculer le hash SHA-512
openssl dgst -sha512 message.txt

# Modifier un seul caractère et recalculer (effet avalanche)
echo "Bonjour, ceci est un message de tesx." > message-modifie.txt
openssl dgst -sha256 message-modifie.txt
```

**Résultat attendu** :

```text
SHA2-256(message.txt)= a1b2c3... (hash de 64 caractères hexadécimaux)
SHA2-512(message.txt)= d4e5f6... (hash de 128 caractères hexadécimaux)
SHA2-256(message-modifie.txt)= x7y8z9... (hash complètement différent du premier)
```

Les deux hash SHA-256 sont totalement différents malgré un seul caractère changé : c'est l'effet avalanche.

### Étape 2 : Chiffrement symétrique avec OpenSSL

```bash
# Chiffrer un fichier avec AES-256-CBC (mot de passe demandé)
openssl enc -aes-256-cbc -salt -pbkdf2 -in message.txt -out message.enc

# Déchiffrer le fichier
openssl enc -aes-256-cbc -d -pbkdf2 -in message.enc -out message-dechiffre.txt

# Vérifier que le fichier déchiffré est identique à l'original
diff message.txt message-dechiffre.txt && echo "Fichiers identiques"
```

**Résultat attendu** :

```text
enter AES-256-CBC encryption password: ********
Verifying - enter AES-256-CBC encryption password: ********
enter AES-256-CBC decryption password: ********
Fichiers identiques
```

### Étape 3 : Générer une paire de clés RSA

```bash
# Générer une clé privée RSA de 4096 bits
openssl genpkey -algorithm RSA -out cle-privee.pem -pkeyopt rsa_keygen_bits:4096

# Extraire la clé publique correspondante
openssl pkey -in cle-privee.pem -pubout -out cle-publique.pem

# Afficher les informations de la clé
openssl pkey -in cle-privee.pem -text -noout | head -5
```

**Résultat attendu** :

```text
RSA Private-Key: (4096 bit, 2 primes)
modulus:
    00:b3:4a:...
publicExponent: 65537 (0x10001)
privateExponent:
```

### Étape 4 : Signer et vérifier un fichier

```bash
# Signer le fichier avec la clé privée
openssl dgst -sha256 -sign cle-privee.pem -out signature.bin message.txt

# Vérifier la signature avec la clé publique
openssl dgst -sha256 -verify cle-publique.pem -signature signature.bin message.txt

# Tenter de vérifier avec un fichier modifié (doit échouer)
openssl dgst -sha256 -verify cle-publique.pem -signature signature.bin message-modifie.txt
```

**Résultat attendu** :

```text
Verified OK
Verification failure
```

### Étape 5 : Examiner un certificat TLS

```bash
# Télécharger et afficher le certificat d'un site web
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | \
  openssl x509 -text -noout | head -30
```

**Résultat attendu** :

```text
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: ...
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = US, O = DigiCert Inc, CN = DigiCert Global G2 TLS RSA SHA256 2020 CA1
        Validity
            Not Before: Jan 13 00:00:00 2025 GMT
            Not After : Feb 13 23:59:59 2027 GMT
        Subject: C = US, ST = California, L = Los Angeles, O = Internet Corporation for Assigned Names and Numbers, CN = www.example.org
```

### Étape 6 : Calculer un HMAC

```bash
# Générer une clé secrète aléatoire (32 octets en hexadécimal)
openssl rand -hex 32 > cle-hmac.txt

# Calculer le HMAC-SHA256 du message
openssl dgst -sha256 -hmac "$(cat cle-hmac.txt)" message.txt
```

**Résultat attendu** :

```text
HMAC-SHA256(message.txt)= a1b2c3d4... (hash de 64 caractères hexadécimaux)
```

### Étape 7 : Tester la force d'un hash avec Hashcat (démonstration)

```bash
# Créer un hash MD5 d'un mot de passe faible (pour démonstration uniquement)
echo -n "password123" | md5sum | cut -d ' ' -f 1 > hash-md5.txt

# Afficher le hash
cat hash-md5.txt

# Avec Hashcat, on pourrait le casser ainsi (ne pas exécuter sans GPU) :
# hashcat -m 0 hash-md5.txt /chemin/vers/wordlist.txt
# -m 0 = mode MD5
# Le résultat serait trouvé en quelques secondes
echo "MD5 de 'password123' : $(cat hash-md5.txt)"
echo "Ce hash serait cassé en moins d'une seconde par Hashcat"
```

**Résultat attendu** :

```text
482c811da5d5b4bc6d497ffa98491e38
MD5 de 'password123' : 482c811da5d5b4bc6d497ffa98491e38
Ce hash serait cassé en moins d'une seconde par Hashcat
```

### Étape 8 : Générer une paire de clés ECC

```bash
# Générer une clé privée avec la courbe P-256
openssl ecparam -genkey -name prime256v1 -noout -out cle-ecc-privee.pem

# Extraire la clé publique
openssl ec -in cle-ecc-privee.pem -pubout -out cle-ecc-publique.pem

# Comparer les tailles de fichiers entre RSA 4096 et ECC P-256
echo "Taille clé privée RSA 4096 :"
wc -c < cle-privee.pem
echo "Taille clé privée ECC P-256 :"
wc -c < cle-ecc-privee.pem
```

**Résultat attendu** :

```text
Taille clé privée RSA 4096 :
3272
Taille clé privée ECC P-256 :
227
```

La clé ECC est environ 14 fois plus petite que la clé RSA pour un niveau de sécurité équivalent.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `openssl dgst -sha256 fichier` | Calculer le hash SHA-256 d'un fichier |
| `openssl enc -aes-256-cbc -salt -pbkdf2 -in f -out f.enc` | Chiffrer un fichier avec AES-256 |
| `openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:4096` | Générer une clé privée RSA 4096 bits |
| `openssl pkey -in key.pem -pubout -out pub.pem` | Extraire la clé publique d'une clé privée |
| `openssl dgst -sha256 -sign key.pem -out sig.bin fichier` | Signer un fichier |
| `openssl dgst -sha256 -verify pub.pem -signature sig.bin fichier` | Vérifier une signature |
| `openssl s_client -connect host:443` | Se connecter à un serveur TLS et afficher le certificat |
| `openssl x509 -text -noout -in cert.pem` | Afficher le contenu d'un certificat X.509 |
| `openssl rand -hex 32` | Générer 32 octets aléatoires en hexadécimal |
| `openssl ecparam -genkey -name prime256v1 -noout -out key.pem` | Générer une clé ECC P-256 |

---

## Pièges Fréquents

### Piège 1 : Utiliser MD5 ou SHA-1 pour la sécurité

**Problème** : MD5 est cassé depuis 2004 (collisions trouvées). SHA-1 est cassé depuis 2017 (attaque SHAttered par Google). Des outils comme Hashcat cassent des milliards de hash MD5 par seconde.

**Solution** : Utilise SHA-256 minimum pour l'intégrité. Pour les mots de passe, utilise Argon2id ou bcrypt, jamais un hash rapide.

### Piège 2 : Stocker les mots de passe avec SHA-256 sans sel

**Problème** : Sans sel (salt), deux utilisateurs avec le même mot de passe ont le même hash. Un attaquant peut utiliser des rainbow tables pré-calculées pour inverser les hash.

**Solution** : Utilise une fonction dédiée (Argon2id, bcrypt) qui intègre automatiquement un sel aléatoire unique par mot de passe.

### Piège 3 : Utiliser AES-ECB

**Problème** : En mode ECB, chaque bloc identique produit le même chiffré. Un attaquant peut identifier des patterns dans les données chiffrées (l'exemple classique est le pingouin ECB : une image chiffrée en ECB reste reconnaissable).

**Solution** : Utilise AES-GCM (chiffrement authentifié) ou AES-CBC avec un IV aléatoire et un HMAC.

### Piège 4 : Confondre chiffrement et hachage

**Problème** : Le chiffrement est réversible (on peut déchiffrer avec la clé). Le hachage est irréversible (on ne peut pas retrouver l'entrée). Certains développeurs "chiffrent" les mots de passe au lieu de les hacher, ce qui permet de les retrouver en clair.

**Solution** : Les mots de passe sont **hashés** (irréversible). Les données à transmettre sont **chiffrées** (réversible). Ne confonds jamais les deux.

### Piège 5 : Ignorer la taille minimale des clés

**Problème** : Une clé RSA de 1024 bits est considérée comme cassable. Utiliser des clés trop courtes donne une fausse impression de sécurité.

**Solution** : RSA minimum 2048 bits (idéalement 3072). ECC minimum 256 bits. AES minimum 128 bits (idéalement 256).

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre chiffrement symétrique et asymétrique
- [ ] Je sais pourquoi AES-GCM est préféré à AES-ECB et AES-CBC seul
- [ ] Je connais la différence entre RSA et ECC et leurs tailles de clés recommandées
- [ ] Je sais pourquoi il ne faut pas utiliser SHA-256 pour les mots de passe
- [ ] Je sais expliquer le principe de Diffie-Hellman en termes simples
- [ ] Je sais ce qu'est une signature numérique et comment elle fonctionne
- [ ] Je sais ce qu'est la PKI et le rôle d'une autorité de certification
- [ ] Je connais les améliorations de TLS 1.3 par rapport à TLS 1.2
- [ ] Je sais utiliser OpenSSL pour hacher, chiffrer, signer et vérifier
- [ ] Je connais au moins 4 types d'attaques cryptographiques

---

## Exercice Pratique

**Énoncé** : Tu développes une application web qui stocke des données sensibles. Réalise les tâches suivantes :

1. Génère une paire de clés RSA 4096 bits et une paire de clés ECC (P-256)
2. Crée un fichier `secret.txt` contenant "Données confidentielles de l'entreprise"
3. Chiffre ce fichier avec AES-256-CBC (chiffrement symétrique)
4. Signe le fichier original avec ta clé privée RSA
5. Vérifie la signature avec la clé publique
6. Calcule le hash SHA-256 du fichier original et du fichier chiffré, et compare-les
7. Crée un script Python qui démontre pourquoi MD5 est dangereux en comparant le temps de calcul de 100 000 hash MD5 vs 100 000 hash SHA-256

**Indications** :

- Utilise OpenSSL pour toutes les opérations de cryptographie
- Le script Python peut utiliser le module `hashlib` intégré
- Compare les tailles des clés RSA et ECC générées

**Résultat attendu** : Tous les fichiers générés (clés, fichier chiffré, signature) et les vérifications réussies. Le script Python montre que MD5 est plus rapide que SHA-256 (et donc plus facilement brute-forcé).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Générer les paires de clés
openssl genpkey -algorithm RSA -out rsa-privee.pem -pkeyopt rsa_keygen_bits:4096
openssl pkey -in rsa-privee.pem -pubout -out rsa-publique.pem
openssl ecparam -genkey -name prime256v1 -noout -out ecc-privee.pem
openssl ec -in ecc-privee.pem -pubout -out ecc-publique.pem

# 2. Créer le fichier secret
echo "Données confidentielles de l'entreprise" > secret.txt

# 3. Chiffrer avec AES-256-CBC
openssl enc -aes-256-cbc -salt -pbkdf2 -in secret.txt -out secret.enc -pass pass:MonMotDePasse123

# 4. Signer le fichier original
openssl dgst -sha256 -sign rsa-privee.pem -out secret.sig secret.txt

# 5. Vérifier la signature
openssl dgst -sha256 -verify rsa-publique.pem -signature secret.sig secret.txt

# 6. Comparer les hash
echo "Hash du fichier original :"
openssl dgst -sha256 secret.txt
echo "Hash du fichier chiffré :"
openssl dgst -sha256 secret.enc
echo "(Les hash sont différents : le chiffrement transforme complètement le contenu)"

# Comparer les tailles des clés
echo ""
echo "Taille clé privée RSA 4096 : $(wc -c < rsa-privee.pem) octets"
echo "Taille clé privée ECC P-256 : $(wc -c < ecc-privee.pem) octets"
```

```python
#!/usr/bin/env python3
"""Comparaison de vitesse entre MD5 et SHA-256."""
import hashlib
import time

NB_HASH = 100_000
DONNEE = b"password123"

# Test MD5
debut = time.time()
for i in range(NB_HASH):
    hashlib.md5(DONNEE + str(i).encode()).hexdigest()
temps_md5 = time.time() - debut

# Test SHA-256
debut = time.time()
for i in range(NB_HASH):
    hashlib.sha256(DONNEE + str(i).encode()).hexdigest()
temps_sha256 = time.time() - debut

print(f"Temps pour {NB_HASH:,} hash MD5    : {temps_md5:.3f} secondes")
print(f"Temps pour {NB_HASH:,} hash SHA-256 : {temps_sha256:.3f} secondes")
print(f"Ratio : MD5 est {temps_sha256/temps_md5:.1f}x plus rapide que SHA-256")
print()
print("Conclusion : MD5 étant plus rapide, un attaquant peut tester")
print("plus de combinaisons par seconde. C'est pourquoi on utilise")
print("des fonctions volontairement lentes (Argon2id, bcrypt) pour")
print("les mots de passe.")
```

---

## Navigation

← Fiche précédente : **[01 - Principes de sécurité de l'information](01-principes-securite.md)**

→ Fiche suivante : **[03 - Sécurité des réseaux - Fondamentaux](03-securite-reseaux.md)**
