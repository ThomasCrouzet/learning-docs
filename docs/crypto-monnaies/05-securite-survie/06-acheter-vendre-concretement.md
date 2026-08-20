---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Pratique
description: "Acheter et vendre des crypto-monnaies concrètement en France : PSAN, KYC, premier achat, retrait vers son wallet et justificatifs"
estimated_time: "40 min"
fiche_number: 6
total_fiches: 6
cursus: "Phase 5 - Sécurité et survie"
---

# 06 - Acheter et vendre concrètement (France)

> **En bref** : Connaître le geste pratique d'entrée et de sortie en crypto-monnaies en France : choisir une plateforme agréée PSCA (liste blanche AMF), passer le KYC, faire un premier achat étape par étape, retirer vers son propre wallet et conserver les justificatifs pour la déclaration fiscale. Lecture estimée : 40 min.

## Prérequis

- [Fiche 01 - Wallets : comprendre ce qu'on possède vraiment](01-wallets-comprendre-possession.md)
- [Fiche 02 - Arnaques, scams et manipulation : le guide de survie](02-arnaques-scams-manipulation.md)
- [Fiche 04 - Régulation : ce que dit la loi en France et en Europe](04-regulation-loi-france-europe.md)
- [Fiche 05 - Fiscalité : déclarer et comprendre l'imposition](05-fiscalite-imposition-crypto.md)
- Savoir ce qu'est une adresse, une clé privée et une seed phrase
- Savoir ce qu'est le statut PSAN et le KYC (vus dans la fiche 04)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir une plateforme agréée PSCA (liste blanche AMF), comprendre pourquoi le KYC est demandé et ce qu'il implique, réaliser un premier achat par virement SEPA en distinguant ordre au marché et ordre à cours limité, retirer tes crypto-monnaies vers ton propre wallet en sécurité, revendre vers des euros, et conserver les justificatifs nécessaires à ta déclaration fiscale.

Cette fiche décrit un geste technique. Elle ne constitue **pas un conseil d'investissement**, ni un avis fiscal ou juridique : aucun montant, aucun token et aucun moment d'achat ou de vente n'y sont recommandés. Vérifie le statut d'enregistrement sur `amf-france.org` et tes obligations sur `impots.gouv.fr` avant toute opération.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Avertissement préalable

**IMPORTANT** : Acheter des crypto-monnaies, c'est exposer de l'argent à un actif dont le prix peut perdre une grande partie de sa valeur. Rien dans cette fiche n'incite à acheter ou à vendre. La règle de la fiche 02 reste valable : ne jamais engager plus que ce que tu acceptes de perdre à 100%.

Les noms de plateformes cités le sont à titre d'exemple factuel (présence ou non sur la liste blanche **PSCA** de l'AMF), pas comme recommandation.

---

### Qu'est-ce qu'un prestataire autorisé (PSCA / CASP) ?

**Définition** : Un **PSCA** (prestataire de services sur crypto-actifs, **CASP** en anglais) est une entreprise **agréée** au titre de MiCA pour fournir des services sur crypto-actifs dans l'Union. En France, l'AMF publie la liste blanche des PSCA. L'ancien statut national **PSAN** (loi PACTE) n'est plus le régime vivant depuis le 1er juillet 2026 : les PSAN sans agrément MiCA ont été radiés. Le cadre est détaillé dans la [fiche 04](04-regulation-loi-france-europe.md).

**Le problème que l'agrément PSCA résout** :

Sans liste officielle, voici les problèmes rencontrés au moment d'acheter :

1. **Impossible de distinguer une vraie plateforme d'une fausse** : n'importe quel site peut se présenter comme un échange crypto
2. **Aucune obligation légale opposable** : une plateforme non enregistrée n'a aucun compte à rendre à un régulateur français
3. **Aucun recours identifié** : en cas de litige, tu ne sais ni à qui t'adresser ni quelle autorité saisir

**Comment l'agrément PSCA aide à résoudre ces problèmes** :

| Problème | Apport de l'agrément PSCA |
| -------- | ------------------------- |
| Distinguer vraie et fausse plateforme | La liste blanche PSCA sur `amf-france.org` fait foi |
| Absence d'obligation opposable | Un PSCA est soumis au contrôle de l'AMF et aux obligations LCB-FT / MiCA |
| Absence de recours | Un acteur agréé a une existence légale identifiable |

**Analogie concrète** : Choisir un PSCA agréé, c'est comme choisir un commerce qui affiche un numéro SIRET vérifiable plutôt qu'un vendeur sur un marché qui plie son étal et disparaît. Le numéro ne garantit pas la qualité du produit, mais il prouve que le vendeur existe légalement et peut être retrouvé.

**Ce que l'agrément PSCA n'est PAS** :

- Ce n'est pas une garantie que tu gagneras de l'argent. Il encadre la plateforme, pas la valeur de ce que tu achètes
- Ce n'est pas une assurance contre la faillite ou le piratage. Une plateforme agréée peut tout de même faire faillite ou être piratée (la fiche 01 cite FTX, qui appliquait pourtant le KYC)
- Ce n'est pas l'ancien enregistrement PSAN. Le PSAN est un statut historique ; le contrôle vivant est la liste blanche PSCA (voir la [fiche 04](04-regulation-loi-france-europe.md))

**Pourquoi privilégier un PSCA agréé** : à risque équivalent sur l'actif, une plateforme agréée t'offre une existence légale identifiable, des obligations de conformité contrôlées et une autorité (l'AMF) à qui signaler un problème. Une plateforme absente de la liste blanche n'a aucune de ces trois propriétés.

---

### Le KYC : ce qu'on te demandé et pourquoi

**Définition** : Le KYC (Know Your Customer, "connais ton client") est la procédure par laquelle une plateforme vérifie ton identité avant de te laisser acheter ou retirer des fonds. C'est une obligation légale issue de la réglementation LCB-FT (lutte contre le blanchiment de capitaux et le financement du terrorisme), déjà présentée dans la [fiche 04](04-regulation-loi-france-europe.md).

**Ce qu'on te demandé concrètement** :

| Élément | Détail | Toujours demandé ? |
| ------- | ------ | ------------------ |
| Pièce d'identité | Carte d'identité, passeport ou permis de conduire en cours de validité | Oui |
| Justificatif de domicile | Facture (énergie, internet) ou avis d'imposition de moins de 3 mois | Souvent |
| Selfie ou vidéo | Photo de toi tenant ta pièce, ou courte vidéo de vérification | Souvent |
| Origine des fonds | Déclaration de la provenance de l'argent (salaire, épargne) | Si les montants sont importants |

**Pourquoi c'est légalement obligatoire** :

| Raison | Explication |
| ------ | ----------- |
| Lutte contre le blanchiment | Empêcher de convertir de l'argent illicite en crypto-monnaies (ou l'inverse) |
| Lutte contre le financement du terrorisme | Tracer les flux financiers suspects |
| Traçabilité fiscale | Permettre à l'administration de rapprocher tes comptes de tes déclarations |

**Délais à anticiper** :

```text
Validation du KYC : de quelques minutes a quelques jours ouvres
  - Vérification automatique des documents : souvent en quelques minutes
  - Vérification manuelle (si doute ou forte affluence) : 24 a 72 heures

Premier virement SEPA entrant : 1 à 2 jours ouvres
  - Le virement bancaire classique n'est pas instantané
  - Certaines banques bloquent ou ralentissent les virements vers
    les plateformes crypto (vérification anti-fraude)

Premier retrait de fonds : parfois bloque 24 a 72 heures après
le premier dépôt (mesure anti-fraude de la plateforme)
```

**Ce que le KYC n'est PAS** :

- Le KYC n'est pas optionnel sur une plateforme enregistrée. Une plateforme qui te propose d'acheter "sans aucune vérification d'identité" n'est pas conforme à la réglementation française
- Le KYC n'est pas un gage de fiabilité de la plateforme. Il prouve qu'elle vérifie ton identité, pas qu'elle gère bien tes fonds

---

### Ordre au marché et ordre à cours limité

**Définition** : Quand tu achètes ou vends, tu passes un ordre. Un ordre au marché s'exécute immédiatement au meilleur prix disponible. Un ordre à cours limité (ou ordre limite) ne s'exécute que si le marché atteint le prix exact que tu as fixé.

**Comment les deux fonctionnent** :

| Type d'ordre | Quand il s'exécute | Prix obtenu | Risque |
| ------------ | ------------------ | ----------- | ------ |
| Au marché | Immédiatement | Le meilleur prix disponible à cet instant | Le prix peut être un peu différent de celui affiché (le marché bouge entre le clic et l'exécution) |
| À cours limité | Seulement si le marché atteint ton prix | Exactement le prix que tu as fixé (ou meilleur) | L'ordre peut ne jamais s'exécuter si le prix n'est pas atteint |

**Analogie concrète** : Un ordre au marché, c'est entrer dans une boulangerie et acheter le pain au prix affiché, tout de suite. Un ordre à cours limité, c'est laisser un mot au boulanger : "Je prends le pain seulement s'il descend à 1 euro." Tu repars peut-être les mains vides, mais tu ne paieras jamais plus que ton prix.

**Ce qu'un ordre au marché n'est PAS** :

- Un ordre au marché n'est pas un achat "au prix affiché à l'écran". L'écran affiche le dernier prix échangé ; le tien s'exécute au prix réellement disponible, qui peut légèrement différer (phénomène de slippage, surtout sur les marchés peu liquides)

**Les frais à repérer** :

| Frais | Quand il s'applique | Ordre de grandeur courant |
| ----- | ------------------- | ------------------------- |
| Frais de transaction de la plateforme | À chaque achat ou vente | Souvent entre 0,1% et 2% selon la plateforme et le type d'ordre |
| Spread (écart achat/vente) | Implicite, surtout sur les achats "simplifiés" par carte | Variable, parfois plusieurs pour cent, non affiché comme un "frais" |
| Frais de dépôt | Sur certains moyens de paiement (carte bancaire) | Variable ; le virement SEPA est souvent gratuit ou peu cher |
| Frais de retrait crypto (frais de réseau) | À chaque retrait vers un wallet externe | Dépend du réseau blockchain, pas de la plateforme (voir plus bas) |

**Point essentiel** : un achat "en un clic" par carte bancaire est rapide mais cumule souvent un spread large et des frais de carte. Un ordre passé via le carnet d'ordres (achat classique) après un virement SEPA coûte généralement moins cher.

---

### Le retrait vers son propre wallet

**Définition** : Le retrait (withdrawal) consiste à envoyer tes crypto-monnaies depuis la plateforme vers une adresse que tu contrôles, dans ton propre wallet. C'est l'application directe du principe "not your keys, not your coins" vu dans la [fiche 01](01-wallets-comprendre-possession.md) : tant que tes fonds restent sur la plateforme, c'est elle qui détient les clés.

**Le problème que le retrait résout** :

Tant que tes crypto-monnaies sont sur la plateforme :

1. **La plateforme détient les clés** : tu possèdes une promesse, pas les fonds eux-mêmes (rappel des cas Mt. Gox, FTX, Celsius en fiche 01)
2. **La plateforme peut bloquer ton compte** : maintenance, litige KYC, faillite, gel réglementaire
3. **Tu dépends de sa sécurité** : un piratage de la plateforme expose tes fonds

**Les notions techniques du retrait** :

| Notion | Détail |
| ------ | ------ |
| Adresse de destination | L'adresse publique de ton wallet, à copier-coller (jamais à taper à la main) |
| Réseau (chaîne) | Le réseau blockchain emprunté (Bitcoin, Ethereum, etc.). Doit correspondre à l'adresse |
| Frais de réseau | Coût payé aux validateurs du réseau pour traiter la transaction. Indépendant de la plateforme |
| Confirmation | La transaction est inscrite sur la blockchain après un ou plusieurs blocs |

**Analogie concrète** : Retirer vers ton wallet, c'est récupérer ton argent du coffre d'une banque pour le mettre dans ton propre coffre, chez toi. Tant qu'il est à la banque, tu fais confiance à la banque ; une fois chez toi, c'est toi qui en es entièrement responsable, sans recours si tu te trompes de destinataire.

**Ce qu'un retrait n'est PAS** :

- Un retrait n'est pas réversible. Une transaction blockchain confirmée ne peut pas être annulée (rappel de la fiche 02 : les transactions sont irréversibles)
- Le "frais de réseau" n'est pas un frais de la plateforme. Il rémunère le réseau blockchain lui-même ; il varie selon l'encombrément du réseau, pas selon la plateforme

**La règle du réseau** : envoyer des fonds sur un réseau qui ne correspond pas à l'adresse de destination peut entraîner une perte définitive. Le réseau choisi au retrait doit correspondre exactement au réseau attendu par ton wallet.

---

### La revente vers des euros (sortie)

**Définition** : La revente (off-ramp) est l'opération inverse de l'achat : tu vends tes crypto-monnaies contre des euros sur la plateforme, puis tu transfères ces euros vers ton compte bancaire par virement SEPA.

**Le point fiscal essentiel** : c'est cette conversion crypto vers euros qui déclenche l'imposition en France. L'échange crypto contre crypto, lui, n'est pas un fait générateur. Ce mécanisme est détaillé dans la [fiche 05](05-fiscalite-imposition-crypto.md).

**Ce qu'une revente n'est PAS** :

- Échanger une crypto-monnaie contre une autre sans soulte (par exemple Bitcoin contre Ethereum) n'est en principe pas une cession imposable immédiate : c'est un **sursis d'imposition** (voir fiche 05 et `impots.gouv.fr`), pas une exonération définitive
- Transférer tes propres fonds d'un wallet à un autre n'est PAS une vente : aucune plus-value n'est en jeu

---

### Conserver les justificatifs pour la déclaration

**Définition** : Pour calculer une plus-value et la déclarer correctement, tu dois conserver l'historique complet de tes opérations. C'est une obligation pratique liée à la fiscalité (voir [fiche 05](05-fiscalite-imposition-crypto.md)) : en cas de contrôle, c'est à toi de justifier le prix d'acquisition.

**Ce qu'il faut conserver, opération par opération** :

| À conserver | Pourquoi |
| ----------- | -------- |
| Date de chaque achat et de chaque vente | Reconstituer la chronologie des opérations |
| Montant en euros engagé ou reçu | Base du calcul du prix d'acquisition et de cession |
| Frais payés (plateforme et réseau) | Ils entrent dans le prix d'acquisition |
| Identifiant de transaction blockchain (TXID) | Prouver un retrait ou un transfert sur la blockchain |
| Relevés et exports de la plateforme | Justifier l'origine et le détail des opérations |

**Rappel chiffré (2026)** : en France, la plus-value des particuliers (activité non professionnelle) est soumise à la flat tax (PFU) de **31,4%** en 2026 (12,8% d'impôt sur le revenu + 18,6% de prélèvements sociaux). Le détail, les formulaires (2086, 3916-bis) et l'option pour le barème progressif sont dans la [fiche 05](05-fiscalite-imposition-crypto.md).

**Seuil d'exonération** : l'article 150 VH bis du CGI prévoit une exonération d'imposition lorsque le
**total des prix de cession de l'année est inférieur ou égal à 305 €**. En dessous de ce seuil annuel
global, aucune plus-value n'est imposée. Important : ce seuil concerne uniquement l'imposition - il ne
dispense pas de conserver les justificatifs. Si tes cessions annuelles dépassent 305 €, la totalité des
gains est imposable, y compris les opérations dont le prix individuel était faible. Ce seuil est détaillé
dans la [fiche 05](05-fiscalite-imposition-crypto.md).

**Ce que la conservation des justificatifs n'est PAS** :

- Conserver les justificatifs n'est pas facultatif "parce que les montants sont petits". L'administration fiscale n'applique aucun seuil minimum pour l'obligation de conservation (voir fiche 05)
- Un solde affiché sur la plateforme n'est pas un justificatif suffisant : une plateforme peut fermer ou perdre des données. Exporte tes historiques régulièrement

---

### Les arnaques spécifiques à l'achat et à la vente

**Définition** : Au-delà des arnaques générales de la [fiche 02](02-arnaques-scams-manipulation.md), le moment précis de l'achat et de la vente expose à deux pièges ciblés : le faux PSAN et le faux support.

**Le faux PSAN (fausse plateforme)** :

```text
Mécanisme :
1. Un site se presente comme une plateforme d'échange régulière
2. Il affiche parfois un faux numéro d'enregistrement ou un faux logo AMF
3. L'URL imite celle d'une vraie plateforme (lettre changee, extension différente)
4. Tu déposés des fonds ; tu vois un solde s'afficher (fictif)
5. Au moment de retirer, on te demande des "frais" ou des "taxes" a payér d'avance
6. Les fonds ne sortent jamais ; le site finit par disparaître

Defense :
- Verifier le nom EXACT sur la liste blanche PSCA de l'AMF (amf-france.org)
- Verifier la liste noire de l'AMF (amf-france.org, espace epargnants)
- Ne jamais faire confiance à un logo ou un numéro affiche sur le site lui-même :
  toujours remonter à la source officielle (l'AMF), jamais l'inverse
```

**Le faux support technique** :

```text
Mécanisme :
1. Tu cherches de l'aide (problème de retrait, question KYC)
2. Tu poses ta question sur un réseau social, un forum, un Discord
3. Un faux "support" te contacte en message prive
4. Il te demande tes identifiants, ton code de double authentification,
   ou te dirige vers un faux site de "vérification"
5. Il vide ton compte ou ton wallet

Defense :
- Le vrai support ne contacte JAMAIS en premier en message prive
- Ne jamais communiquer un mot de passe, un code 2FA ou une seed phrase
  (rappel des fiches 01 et 02 : la seed phrase ne se partage avec PERSONNE)
- Toujours passer par le canal de support officiel depuis le site officiel
```

**Ce que ces arnaques exploitent** : l'urgence (un retrait "bloqué") et la confiance dans un logo ou un interlocuteur. La défense est toujours la même : remonter à la source officielle (l'AMF, le site officiel de la plateforme), jamais faire confiance à ce qui s'affiche ou à qui te contacte.

---

## Étapes Pratiques

Les étapes ci-dessous décrivent un parcours type. Les libellés exacts des boutons varient d'une plateforme à l'autre, mais la logique est commune.

### Étape 1 : vérifier que la plateforme est un PSCA agréé

Avant toute inscription, vérifie l'agrément à la source officielle.

```text
1. Va sur amf-france.org
2. Ouvre Espace épargnants > Listes blanches > catégorie PSCA
3. Vérifie que le nom EXACT de la plateforme figure dans cette liste
4. Consulte aussi la liste noire (espace epargnants) pour t'assurer
   que la plateforme n'y est PAS
5. Si la plateforme n'est pas sur la liste blanche PSCA : ne l'utilise pas
```

**Résultat attendu** :

```text
Tu as confirme, depuis le site de l'AMF (et non depuis le site de la
plateforme), que la plateforme figure sur la liste blanche PSCA et
est absente de la liste noire.
```

---

### Étape 2 : créer le compte et passer le KYC

Prépare tes documents avant de commencer pour éviter une procédure interrompue.

```text
1. Crée le compte avec une adresse email dédiée et un mot de passe unique
2. Active immédiatement la double authentification (2FA) par application
   d'authentification (pas par SMS si une application est proposee)
3. Lance la procédure KYC :
   - Photographie ta pièce d'identité en cours de validité
   - Fournis un justificatif de domicile de moins de 3 mois si demande
   - Realise le selfie ou la video de vérification si demande
4. Attends la validation (de quelques minutes a 72 heures)
```

**Résultat attendu** :

```text
Ton compte est crée, la 2FA est active, et ton identité est vérifiee.
La plateforme t'autorisé desormais a déposer des fonds.
```

---

### Étape 3 : déposer des euros par virement SEPA

Le virement SEPA est généralement le moyen le moins coûteux de déposer des euros.

```text
1. Dans la section "Dépôt" ou "Deposit", choisis "Virement SEPA" en euros
2. La plateforme affiche un IBAN et une référence de virement OBLIGATOIRE
3. Depuis ta banque, fais un virement vers cet IBAN
   en indiquant EXACTEMENT la référence fournie
4. Attends la reception (1 a 2 jours ouvres en général)
```

**Résultat attendu** :

```text
Le solde en euros apparaît sur la plateforme après reception du virement.
Tu n'as encore achète aucune crypto-monnaie a ce stade.
```

---

### Étape 4 : passer un premier ordre d'achat

Privilégie l'achat via le carnet d'ordres plutôt que l'achat "en un clic" par carte, souvent plus cher.

```text
1. Choisis le marche (par exemple BTC/EUR)
2. Choisis le type d'ordre :
   - Ordre au marche : exécution immediate au meilleur prix disponible
   - Ordre a cours limite : exécution seulement si ton prix est atteint
3. Saisis le montant en euros que tu souhaites engager
4. Vérifie les frais affiches avant de valider
5. Confirme l'ordre
```

**Résultat attendu** :

```text
L'ordre est exécute (immédiatement pour un ordre au marche, ou plus tard
pour un ordre a cours limite atteint). Le solde en crypto-monnaie apparaît,
et le solde en euros diminue du montant engage et des frais.
```

---

### Étape 5 : retirer vers son propre wallet (test petit montant d'abord)

Avant de retirer une somme importante, fais un test avec un très petit montant. C'est la même logique de vérification que pour la sauvegarde de la seed phrase (fiche 01).

```text
1. Dans ton wallet, copie ton adresse de reception (jamais la taper à la main)
2. Sur la plateforme, va dans "Retrait" / "Withdraw"
3. Colle l'adresse de destination
4. Selectionne le RÉSEAU qui correspond exactement à ton adresse
5. Saisis un TRÈS petit montant (montant de test minimal)
6. Vérifie les frais de réseau affiches
7. Confirme (avec la 2FA)
8. Attends la confirmation sur la blockchain et vérifie que les fonds
   sont bien arrives dans ton wallet
9. Si le test arrive correctement : recommence pour le montant réel
   en reutilisant la même adresse et le même réseau
```

**Résultat attendu** :

```text
Le petit montant de test arrive dans ton wallet, confirme sur la blockchain.
Tu peux alors retirer le montant réel en toute confiance, sur la même
adresse et le même réseau. Tes crypto-monnaies sont desormais sous ton
contrôle direct (not your keys, not your coins).
```

---

### Étape 6 : revendre vers des euros et conserver les justificatifs

La revente est l'opération inverse. C'est elle qui déclenche l'imposition (voir fiche 05).

```text
1. Si nécessaire, renvoie les crypto-monnaies de ton wallet vers la
   plateforme (même précaution d'adresse et de réseau qu'a l'étape 5)
2. Passe un ordre de vente (au marche ou a cours limite) contre des euros
3. Demande un retrait des euros vers ton compte bancaire (virement SEPA)
4. Exporte et archive l'historique complet :
   dates, montants en euros, frais, identifiants de transaction (TXID)
```

**Résultat attendu** :

```text
Les euros arrivent sur ton compte bancaire. Tu disposes d'un historique
complet et archive de toutes les opérations, prêt pour ta déclaration
fiscale (flat tax 31,4% en 2026, voir fiche 05).
```

---

## Tableau Récapitulatif

| Étape | Action | Point de vigilance |
| ----- | ------ | ------------------ |
| Vérifier le PSCA | Liste blanche PSCA AMF + liste noire | Vérifier le nom exact, depuis le site de l'AMF |
| KYC | Pièce, domicile, selfie | Anticiper de quelques minutes à 72 heures |
| Dépôt | Virement SEPA en euros | Indiquer la référence exacte ; compter 1 à 2 jours |
| Achat | Ordre au marché ou à cours limité | Vérifier les frais ; éviter l'achat carte plus cher |
| Retrait | Vers son propre wallet | Adresse copiée, bon réseau, test petit montant d'abord |
| Revente | Vente puis virement SEPA sortant | C'est la sortie vers fiat qui est imposable |
| Justificatifs | Exporter et archiver l'historique | Dates, montants, frais, TXID ; aucun seuil minimum |

---

## Pièges Fréquents

### Piège 1 : choisir une plateforme non enregistrée parce qu'elle est "moins chère"

⚠️ **Problème** : Une plateforme non agréée PSCA affiche parfois des frais plus bas ou un achat "sans vérification d'identité" pour attirer.

✅ **Solution** : Vérifier le nom exact sur la liste blanche PSCA de l'AMF (`amf-france.org`) et consulter la liste noire. Une plateforme absente de cette liste n'est pas autorisée à opérer en France : l'économie de frais ne compense pas l'absence totale de recours.

### Piège 2 : se tromper de réseau au moment du retrait

⚠️ **Problème** : Tu choisis un réseau qui ne correspond pas à l'adresse de destination de ton wallet. La transaction est irréversible.

✅ **Solution** : Toujours vérifier que le réseau sélectionné sur la plateforme correspond exactement au réseau attendu par ton wallet, et faire un test avec un très petit montant avant le montant réel.

### Piège 3 : taper l'adresse de destination à la main

⚠️ **Problème** : Une adresse blockchain est longue et illisible. Une faute de frappe envoie les fonds à une adresse inexistante ou à un inconnu, sans retour possible.

✅ **Solution** : Toujours copier-coller l'adresse, et vérifier les premiers et derniers caractères après le collage. Méfie-toi des logiciels malveillants qui remplacent l'adresse copiée (vérifie l'adresse réellement collée).

### Piège 4 : payér des "frais de déblocage" pour retirer ses fonds

⚠️ **Problème** : Une plateforme (souvent un faux PSAN) ou un faux support te demandé de payér une "taxe" ou des "frais" en plus pour débloquer un retrait.

✅ **Solution** : Sur une plateforme légitime, les frais sont prélevés sur le retrait lui-même, jamais réclamés comme un paiement séparé à effectuer d'avance. Une demandé de paiement préalable pour "débloquer" des fonds est un signal d'arnaque (rappel fiche 02).

### Piège 5 : ne pas conserver l'historique des petites opérations

⚠️ **Problème** : Tu penses que les petits montants ne comptent pas et tu n'archives pas l'historique.

✅ **Solution** : L'administration fiscale n'applique aucun seuil minimum (voir fiche 05). Exporte et archive l'historique de toutes les opérations, dès la première, frais inclus.

---

## Checklist de Validation

- [ ] Je sais vérifier qu'une plateforme figure sur la liste blanche PSCA de l'AMF, et pourquoi privilégier un prestataire agréé
- [ ] Je sais ce que le KYC me demandé (pièce, domicile, selfie) et pourquoi il est légalement obligatoire (LCB-FT)
- [ ] J'anticipe les délais (KYC, virement SEPA, premier retrait)
- [ ] Je distingue un ordre au marché d'un ordre à cours limité
- [ ] Je sais repérer les frais (plateforme, spread, réseau) et pourquoi l'achat par carte est souvent plus cher
- [ ] Je sais retirer vers mon propre wallet : adresse copiée, bon réseau, test petit montant d'abord
- [ ] Je comprends que la revente vers des euros déclenche l'imposition, et que l'échange crypto-crypto sans soulte relève en principe d'un sursis (pas d'imposition immédiate ; voir fiche 05)
- [ ] Je conserve l'historique complet de mes opérations pour la déclaration fiscale (flat tax 31,4% en 2026)
- [ ] Je sais reconnaître un faux PSAN et un faux support, et je ne paie jamais de "frais de déblocage"

---

## Exercice Pratique

**Énoncé** : Une connaissance te dit avoir trouvé une plateforme "géniale" pour acheter ses premières crypto-monnaies. Elle te montre le site : achat possible immédiatement, sans aucune vérification d'identité, frais annoncés très bas, et un logo "AMF" affiché en bas de page. Elle a déposé 200 euros, voit déjà un "gain" de 40 euros sur son tableau de bord, mais quand elle a voulu retirer, le site lui demandé de payér 60 euros de "frais de déblocage" d'abord.

Liste les signaux d'alerte présents dans cette situation, et indique la démarché correcte qu'elle aurait dû suivre avant de déposer le moindre euro.

**Indications** :

- Pense à la vérification d'identité obligatoire sur une plateforme conforme
- Pense à la source qui fait foi pour l'agrément PSCA
- Pense à la manière dont les frais légitimes sont prélevés
- Relie chaque signal à un concept des fiches 02, 04 ou de cette fiche

**Résultat attendu** : Une liste de signaux d'alerte justifiés, et une procédure de vérification correcte en quelques étapes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Les signaux d'alerte présents** :

| Signal observé | Pourquoi c'est suspect |
| -------------- | ---------------------- |
| Achat "sans aucune vérification d'identité" | Une plateforme conforme applique obligatoirement le KYC (LCB-FT, fiche 04). L'absence de KYC indique une plateforme non conforme |
| Logo "AMF" affiché sur le site lui-même | Un logo affiché ne prouve rien : il faut remonter à la source (la liste de l'AMF), jamais faire confiance à ce qu'affiche le site |
| Frais "très bas" mis en avant pour attirer | Argument classique d'un faux PSAN (piège 1 de cette fiche) |
| "Gain" de 40 euros affiché très vite | Solde fictif typique du faux PSAN et du pig butchering (fiche 02) : le tableau de bord est sous le contrôle de l'arnaqueur |
| "Frais de déblocage" à payér d'avance pour retirer | Signal d'arnaque caractéristique : les frais légitimes sont prélevés sur le retrait, jamais réclamés en paiement séparé d'avance (piège 4) |

**La démarché correcte avant de déposer le moindre euro** :

```text
1. Aller sur amf-france.org (le site officiel de l'AMF, pas un lien fourni
   par la plateforme ou par un tiers)
2. Chercher le nom EXACT de la plateforme dans la liste blanche PSCA
3. Verifier que la plateforme ne figure PAS dans la liste noire de l'AMF
4. Si elle est absente de la liste positive : ne pas l'utiliser, ne rien déposer
5. Ne jamais payér de "frais" ou de "taxe" reclames d'avance pour debloquer un retrait
```

**Conclusion** : la situation cumule plusieurs signaux d'un faux PSAN. La somme de 200 euros déjà déposée est très probablement perdue, et les 60 euros de "frais de déblocage" demandés ne feraient qu'aggraver la perte. La seule action utile désormais est de ne plus rien envoyer et, le cas échéant, de signaler le site à l'AMF.

---

## Navigation

← Fiche précédente : **[05 - Fiscalité : déclarer et comprendre l'imposition](05-fiscalite-imposition-crypto.md)**

→ Phase suivante : **[Phase 6 - Analyse critique et due diligence](../06-analyse-critique-due-diligence/index.md)**
