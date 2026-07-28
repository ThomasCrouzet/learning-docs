---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Pratique
description: "Wallets : clés privées, types de portefeuilles et ce que signifie réellement posséder des crypto-monnaies"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 6
cursus: "Phase 5 - Sécurité et survie"
---

# 01 - Wallets : comprendre ce qu'on possède vraiment

> **En bref** : Comprendre ce que signifie réellement posséder des crypto-monnaies, comment fonctionnent les clés privées et les différents types de wallets, et comment choisir en fonction de son usage. Lecture estimée : 40 min.

## Prérequis

- [Fiche 02 - Cryptographie essentielle : clés, hachage et signatures](../01-fondamentaux/02-cryptographie-essentielle.md)
- [Fiche 01 - Bitcoin : contexte de naissance et principes](../02-bitcoin/01-contexte-naissance-principes.md)
- Savoir ce qu'est une clé privée, une clé publique et une adresse sur une blockchain

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi un wallet ne "contient" pas de crypto-monnaies, ce qu'est une seed phrase et pourquoi elle est critique, distinguer les différents types de wallets et choisir celui qui correspond à ton usage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Un wallet ne "contient" rien

**Définition** : Un wallet (portefeuille) est un logiciel ou un appareil qui stocke des clés privées. Il ne contient pas de crypto-monnaies. Les crypto-monnaies n'existent nulle part ailleurs que sur la blockchain elle-même - le wallet donne uniquement le droit d'y accéder.

**Le problème que le wallet résout** :

Sur une blockchain, tes fonds sont associés à une adresse publique. Pour dépenser ces fonds, il faut prouver que tu es le propriétaire de cette adresse en signant une transaction avec la clé privée correspondante. Le wallet stocke cette clé privée et facilite la signature des transactions.

Sans wallet :

1. **Tu devrais mémoriser ta clé privée** : une suite de 256 bits (64 caractères hexadécimaux), ce qui est pratiquement impossible
2. **Tu devrais signer les transactions manuellement** : un calcul cryptographique complexe
3. **Tu devrais construire les transactions toi-même** : définir les entrées, sorties, frais et format

**Analogie concrète** : Un wallet est comme un trousseau de clés. Le trousseau ne contient pas ta maison ni ta voiture. Il contient les clés qui te donnent accès à ta maison et à ta voiture. Si tu perds ton trousseau, ta maison existe toujours - mais tu ne peux plus y entrer. Si quelqu'un copie tes clés, il peut entrer chez toi.

**Ce qu'un wallet n'est PAS** :

- Un wallet n'est pas un compte bancaire. Une banque garde ton argent et tu lui fais confiance pour te le rendre. Un wallet non-custodial te donne un contrôle direct, sans intermédiaire - mais aussi sans recours si tu fais une erreur
- Un wallet n'est pas un coffre-fort physique. Les crypto-monnaies n'ont pas d'existence physique. Le wallet stocke des nombres (les clés privées), pas des objets

---

### "Not your keys, not your coins"

**Définition** : Cette expression signifie que si tu ne contrôles pas les clés privées associées à tes crypto-monnaies, tu ne les possèdes pas réellement. Tu fais confiance à un tiers (une plateforme, un exchange) pour les garder à ta place.

**Le problème que ce principe illustre** :

Quand tu achètes des crypto-monnaies sur une plateforme comme Binance ou Coinbase, les fonds ne sont pas "à toi" au sens technique du terme. La plateforme détient les clés privées. Toi, tu as un solde affiché sur un site web - exactement comme un solde bancaire.

**Cas concrets où des utilisateurs ont perdu leurs fonds** :

| Événement | Année | Fonds perdus | Ce qui s'est passé |
| --------- | ----- | ------------ | ------------------- |
| Mt. Gox | 2014 | 850 000 BTC | La plus grande plateforme d'échange de l'époque a été piratée. Les utilisateurs n'ont rien récupéré pendant 10 ans |
| QuadrigaCX | 2019 | 190 millions USD | Le fondateur est décédé (officiellement). Lui seul avait les clés privées. Tous les fonds sont perdus |
| FTX | 2022 | 8 milliards USD | Le fondateur a détourné les fonds des utilisateurs pour des investissements risqués. Faillite |
| Celsius | 2022 | 4,7 milliards USD | La plateforme de prêt a fait faillite. Les dépôts des utilisateurs sont bloqués |

**La règle** : Si tes crypto-monnaies sont sur une plateforme, tu possèdes une promesse de la plateforme de te les rendre. Si la plateforme disparaît, fait faillite ou se fait pirater, ta promesse ne vaut plus rien.

---

### La seed phrase : la clé de tout

**Définition** : La seed phrase (phrase de récupération) est une suite de 12 ou 24 mots générés aléatoirement selon le standard BIP-39. Elle permet de régénérer toutes les clés privées d'un wallet. C'est la sauvegarde ultime.

**Comment ça fonctionne** :

```text
Exemple de seed phrase (12 mots) :
abandon ability able about above absent absorb abstract absurd abuse access accident

ATTENTION : ceci est un exemple. Ne l'utilise jamais comme vraie seed phrase.
```

**Le processus technique** :

```text
Seed phrase (12 ou 24 mots)
    |
    v
Conversion en nombre de 128 ou 256 bits (via le standard BIP-39)
    |
    v
Génération de la clé privée maitre (via le standard BIP-32)
    |
    v
Derivation de toutes les clés privées du wallet
    |
    v
Calcul des clés publiques correspondantes
    |
    v
Calcul des adresses (Bitcoin, Ethereum, etc.)
```

**Conséquences concrètes** :

| Situation | Conséquence |
| --------- | ----------- |
| Tu perds ta seed phrase ET ton wallet est cassé | Tes fonds sont perdus à jamais. Personne ne peut les récupérer. Il n'existe aucun service client, aucun recours |
| Quelqu'un trouve ta seed phrase | Il peut restaurer ton wallet sur son propre appareil et transférer tous tes fonds. En quelques secondes. Depuis n'importe où dans le monde |
| Tu sauvegardes ta seed phrase correctement | Tu peux restaurer ton wallet sur n'importe quel appareil compatible, même si ton appareil original est détruit |

**Règles absolues pour la seed phrase** :

- Ne jamais la saisir sur un site web ou dans une application autre que ton wallet
- Ne jamais la stocker sous forme numérique (pas de photo, pas de fichier texte, pas de cloud, pas d'email)
- L'écrire sur papier (ou mieux, la graver sur une plaque métallique)
- La stocker dans un endroit physiquement sécurisé (coffre-fort)
- Ne jamais la communiquer à qui que ce soit. Aucun service technique légitime ne te demandera jamais ta seed phrase

---

### Les types de wallets

**Définition** : Les wallets se classent selon deux critères principaux : leur connexion à internet (hot vs cold) et qui contrôle les clés privées (custodial vs non-custodial).

#### Critère 1 : connexion à internet

| Type | Définition | Exemples | Avantage | Risque |
| ---- | ---------- | -------- | -------- | ------ |
| Hot wallet | Connecté à internet en permanence ou régulièrement | MetaMask, Trust Wallet, Exodus, Phantom | Accès rapide, pratique pour les transactions quotidiennes | Vulnérable aux attaques à distance (malware, phishing, piratage) |
| Cold wallet | Jamais connecté à internet directement | Ledger, Trezor, Keystone, paper wallet | Très difficile à pirater à distance | Moins pratique. Risque de perte physique |

#### Critère 2 : contrôle des clés

| Type | Qui contrôle les clés ? | Exemples | Avantage | Risque |
| ---- | ----------------------- | -------- | -------- | ------ |
| Custodial | La plateforme | Binance, Coinbase, Kraken, Revolut | Simple à utiliser. Si tu oublies ton mot de passe, le support peut t'aider | La plateforme peut bloquer tes fonds, faire faillite ou se faire pirater |
| Non-custodial | Toi | MetaMask, Ledger, Trezor, Exodus | Tu as le contrôle total. Personne ne peut bloquer tes fonds | Si tu perds tes clés et ta seed phrase, personne ne peut t'aider |

#### Comparaison détaillée des types de wallets

| Critère | Hot wallet (MetaMask) | Cold wallet (Ledger) | Custodial (Binance) |
| ------- | --------------------- | -------------------- | ------------------- |
| Sécurité | Moyenne | Élevée | Dépend de la plateforme |
| Facilité d'utilisation | Élevée | Moyenne | Très élevée |
| Contrôle des clés | Toi | Toi | La plateforme |
| Accès rapide | Oui | Non (il faut brancher l'appareil) | Oui |
| Vulnérable au piratage à distance | Oui | Non (les clés ne quittent jamais l'appareil) | Oui (la plateforme peut être piratée) |
| Coût | Gratuit | 60 à 200 euros | Gratuit |
| Recours en cas de perte des clés | Aucun (sauf seed phrase) | Aucun (sauf seed phrase) | Support client (mot de passe réinitialisé) |

---

### Comment fonctionne un cold wallet (hardware wallet)

**Définition** : Un hardware wallet est un petit appareil électronique dédié dont le seul rôle est de stocker les clés privées et de signer les transactions dans un environnement isolé d'internet.

**Le processus de transaction avec un cold wallet** :

```text
1. Tu prepares la transaction sur ton ordinateur (destinataire, montant)
2. Les détails de la transaction sont envoyés au hardware wallet via USB ou Bluetooth
3. Tu vérifies les détails sur l'écran du hardware wallet (pas sur l'écran de l'ordinateur)
4. Tu confirmes physiquement en appuyant sur un bouton de l'appareil
5. Le hardware wallet signe la transaction avec la clé privée
6. La transaction signee est renvoyee à l'ordinateur
7. L'ordinateur diffuse la transaction signee sur le réseau

A aucun moment la clé privée ne quitte le hardware wallet.
Même si ton ordinateur est infecte par un malware, la clé reste protégée.
```

**Ce qu'un hardware wallet n'est PAS** :

- Un hardware wallet n'est pas inviolable. Si quelqu'un à un accès physique à l'appareil ET connaît ton code PIN, il peut signer des transactions. Certains appareils ont aussi eu des vulnérabilités matérielles (ex : attaque par canal auxiliaire sur certains modèles de Ledger en 2023)
- Un hardware wallet n'est pas utile sans la seed phrase. Si ton appareil est cassé ou perdu, tu restaures tes clés sur un nouvel appareil grâce à la seed phrase

---

### Comment choisir son wallet

**Définition** : Le choix dépend de deux facteurs : le montant et la fréquence d'utilisation.

**Guide de choix** :

| Situation | Wallet recommandé | Raison |
| --------- | ----------------- | ------ |
| Tu expérimentes avec de petits montants (moins de 100 euros) | Hot wallet gratuit (MetaMask, Trust Wallet) | Pas besoin d'investir dans un hardware wallet pour de petits montants |
| Tu conserves un montant significatif à long terme | Cold wallet (Ledger, Trezor) | La sécurité justifie le coût de l'appareil |
| Tu fais des transactions quotidiennes sur des protocoles DeFi | Hot wallet pour les montants du jour + cold wallet pour le reste | Compromis entre praticité et sécurité |
| Tu débutes complètement | Plateforme régulée (Coinbase, Kraken) pour commencer, puis transfert vers un wallet personnel | Simplicité d'abord, autonomie ensuite |

**Règle fondamentale** : Ne garde JAMAIS tout sur un seul point. Répartis tes fonds comme tu répartirais de l'argent physique - un peu sur toi pour les dépenses courantes, le reste dans un endroit sécurisé.

---

## Étapes Pratiques

### Étape 1 : comprendre la structure de tes clés

Avant de configurer un wallet, il faut comprendre ce que tu vas manipuler.

```text
Ce que tu vas obtenir en creant un wallet :

1. Une seed phrase (12 ou 24 mots) - c'est la sauvegarde maitre
2. Une ou plusieurs clés privées - derivees de la seed phrase
3. Les clés publiques correspondantes - calculees à partir des clés privées
4. Les adresses - calculees à partir des clés publiques

Exemple d'adresse Ethereum :
0x71C7656EC7ab88b098defB751B7401B5f6d8976F

Exemple d'adresse Bitcoin :
bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

**Résultat attendu** :

```text
Tu comprends que :
- La seed phrase génère TOUT le reste
- Une seed phrase = accès a TOUTES les adresses du wallet
- L'adresse est publique (tu peux la partager pour recevoir des fonds)
- La clé privée est secrète (ne jamais la partager)
```

---

### Étape 2 : sécuriser la seed phrase

Voici la procédure pour sauvegarder correctement une seed phrase.

```text
Matériel nécessaire :
- Deux feuilles de papier (ou une plaque metallique)
- Un stylo (pas un crayon - le graphite s'efface avec le temps)

Procédure :
1. Écris les mots dans l'ordre exact, numerotes de 1 a 12 (ou 1 a 24)
2. Vérifie chaque mot deux fois
3. Fais une deuxième copie identique
4. Stocke les deux copies dans des lieux DIFFERENTS (ex : chez toi + chez un proche de confiance)
5. Ne prends JAMAIS de photo de la seed phrase
6. Ne la tape JAMAIS dans un fichier, un email ou un message
```

**Résultat attendu** :

```text
Tu as deux copies physiques de ta seed phrase stockées dans deux lieux
distincts et sécurisés. Aucune copie numérique n'existe.
```

---

### Étape 3 : vérifier la sauvegarde

Avant de recevoir des fonds, vérifie que ta sauvegarde fonctionne.

```text
Procédure de vérification :
1. Crée le wallet et note la seed phrase
2. Recois un TRÈS petit montant (quelques euros maximum)
3. Supprime le wallet de l'appareil
4. Restaure le wallet à partir de la seed phrase
5. Vérifie que le solde est toujours visible
6. Si le solde est la : ta sauvegarde fonctionne
7. Si le solde n'est pas la : tu as fait une erreur dans la seed phrase.
   Recommence depuis le début AVANT de recevoir des montants plus importants
```

**Résultat attendu** :

```text
Tu as la preuve concrete que ta seed phrase permet de récupérer tes fonds.
Tu peux maintenant utiliser le wallet avec confiance dans ta sauvegarde.
```

---

## Commandes Utiles

| Action | Comment faire |
| ------ | ------------- |
| Vérifier le solde d'une adresse Ethereum | Aller sur `etherscan.io` et entrer l'adresse |
| Vérifier le solde d'une adresse Bitcoin | Aller sur `mempool.space` et entrer l'adresse |
| Vérifier si une plateforme est régulée en France | Consulter le registre PSAN sur le site de l'AMF (`amf-france.org`) |

---

## Pièges Fréquents

### Piège 1 : stocker la seed phrase en numérique

**Problème** : Tu prends une photo de ta seed phrase ou tu la mets dans un fichier texte sur ton ordinateur.

**Conséquence** : Un malware, un piratage de ton cloud'où un vol de téléphone donne accès à ta seed phrase. Tes fonds sont volés.

**Solution** : Uniquement des copies physiques (papier ou métal), stockées dans des lieux sécurisés.

### Piège 2 : saisir la seed phrase sur un faux site

**Problème** : Tu reçois un email ou tu vois une popup qui te demandé de "vérifier" ou "synchroniser" ton wallet en entrant ta seed phrase.

**Conséquence** : C'est une arnaque dans 100% des cas. Tu perds tout.

**Solution** : Ta seed phrase ne doit JAMAIS être saisie ailleurs que dans ton logiciel de wallet lors d'une restauration. Aucun service légitime ne la demande.

### Piège 3 : confondre "mot de passe du wallet" et "seed phrase"

**Problème** : Le mot de passe (ou PIN) protège l'accès au wallet sur un appareil spécifique. La seed phrase permet de restaurer le wallet sur N'IMPORTE quel appareil.

**Conséquence** : Changer le mot de passe ne protège pas la seed phrase. Si quelqu'un à la seed phrase, ton mot de passe est inutile.

**Solution** : Protège le mot de passé ET la seed phrase comme deux éléments distincts et critiques.

---

## Checklist de Validation

- [ ] Je sais qu'un wallet ne contient pas de crypto-monnaies mais des clés privées
- [ ] Je peux expliquer "Not your keys, not your coins" avec un exemple concret
- [ ] Je sais ce qu'est une seed phrase et pourquoi elle est critique
- [ ] Je connais les règles de sauvegarde de la seed phrase (papier, deux copies, lieux différents, jamais en numérique)
- [ ] Je sais distinguer hot wallet, cold wallet, custodial et non-custodial
- [ ] Je comprends comment un hardware wallet protège les clés privées
- [ ] Je sais choisir un type de wallet en fonction de mon usage
- [ ] Je connais la procédure pour vérifier que ma sauvegarde fonctionne
- [ ] Je sais que PERSONNE ne doit JAMAIS me demander ma seed phrase

---

## Navigation

← Phase précédente : **[Phase 4 - L'écosystème crypto : trier le signal du bruit](../04-ecosysteme-signal-bruit/index.md)**

→ Fiche suivante : **[02 - Arnaques, scams et manipulation : le guide de survie](02-arnaques-scams-manipulation.md)**
