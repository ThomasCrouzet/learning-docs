---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Arnaques et manipulation dans l'écosystème crypto : les schémas courants et comment les repérer"
estimated_time: "45 min"
fiche_number: 2
total_fiches: 6
cursus: "Phase 5 - Sécurité et survie"
---

# 02 - Arnaques, scams et manipulation : le guide de survie

> **En bref** : Identifier les principales catégories d'arnaques dans l'écosystème crypto, reconnaître les signaux d'alerte universels et appliquer des règles concrètes pour se protéger. Lecture estimée : 45 min.

## Prérequis

- [Fiche 01 - Wallets : comprendre ce qu'on possède vraiment](01-wallets-comprendre-possession.md)
- Savoir ce qu'est un wallet, une clé privée et une seed phrase
- Savoir ce qu'est un token et un smart contract (notions de base)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras classifier les principales arnaques crypto par catégorie, identifier les signaux d'alerte avant de perdre de l'argent, et appliquer des règles de survie concrètes face aux tentatives de manipulation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### L'ampleur du problème

**Définition** : L'écosystème crypto est un environnement où les arnaques représentent une proportion significative de l'activité économique. Ce n'est pas un phénomène marginal.

**Quelques chiffres factuels** :

| Année | Montant perdu en arnaques crypto (estimation) | Source |
| ----- | ---------------------------------------------- | ------ |
| 2021 | 7,8 milliards USD | Chainalysis |
| 2022 | 3,8 milliards USD (hacks) + 5,9 milliards USD (arnaques) | Chainalysis, FTC |
| 2023 | 1,7 milliard USD (hacks DeFi) | Chainalysis |

**Pourquoi les arnaques sont si répandues en crypto** :

1. **Transactions irreversibles** : une fois les fonds envoyés, il n'existe aucun mécanisme d'annulation. Pas de service client, pas de charge-back
2. **Pseudo-anonymat** : les arnaqueurs sont difficiles à identifier et à poursuivre
3. **Absence de régulation uniforme** : les réglementations varient entre pays, laissant des zones grises
4. **Complexité technique** : la plupart des utilisateurs ne comprennent pas ce qu'ils signent quand ils interagissent avec un smart contract
5. **FOMO généralisée** : la peur de rater une opportunité pousse à agir sans réfléchir (voir fiche 03)

---

### Catégorie 1 : schémas de Ponzi et pyramidaux

**Définition** : Un schéma de Ponzi est un système où les rendements versés aux anciens investisseurs proviennent de l'argent apporté par les nouveaux investisseurs. Il n'y a aucune création de valeur réelle. Le système s'effondre mathématiquement quand les nouveaux entrants ne suffisent plus à payer les anciens.

**Le problème que les schémas de Ponzi exploitent** :

La promesse de rendements élevés et réguliers attire les victimes. Les premiers participants gagnent effectivement de l'argent (payé par les suivants), ce qui renforce la crédibilité du système et attire encore plus de monde.

**Cas concrets** :

| Projet | Année | Montant perdu | Promesse | Réalité |
| ------ | ----- | ------------- | -------- | ------- |
| Bitconnect | 2016-2018 | 2,4 milliards USD | Rendements quotidiens de 0,5% à 1% grâce à un "robot de trading" | Ponzi classique. Le robot n'existait pas |
| OneCoin | 2014-2019 | 4 milliards USD | "Le futur du Bitcoin". Vendu via du marketing multi-niveaux | Il n'y avait même pas de blockchain. Purement fictif |
| PlusToken | 2018-2019 | 2 milliards USD | Rendements de 10% à 30% par mois via un "portefeuille intelligent" | Ponzi. Les fondateurs ont fui avec les fonds |

**Comment reconnaître un Ponzi** :

- Rendements "garantis" ou "fixes" (aucun investissement n'est garanti, jamais)
- Les rendements sont anormalement élevés par rapport au marché
- Le mécanisme de génération de profit est vague ou inexplicable
- L'accent est mis sur le recrutement de nouveaux membres
- Les retraits deviennent de plus en plus difficiles avec le temps

**Analogie concrète** : Imagine une chaîne de lettrès où chaque participant doit envoyer 10 euros à la personne au-dessus de lui et recruter 5 nouvelles personnes. Les premiers gagnent effectivement de l'argent. Mais au bout de 10 niveaux, il faut 9,7 millions de participants. Au bout de 13 niveaux, il faut plus de personnes que la population mondiale. Le système s'effondre inévitablement.

---

### Catégorie 2 : rug pulls

**Définition** : Un rug pull ("tirer le tapis") se produit quand l'équipe d'un projet crypto abandonne le projet et disparaît avec les fonds des investisseurs. C'est possible quand l'équipe contrôle la liquidité ou a des privilèges spéciaux dans le smart contract.

**Le mécanisme technique** :

```text
1. L'équipe crée un token et un pool de liquidité sur un DEX (exchange décentralisé)
2. Le marketing fait monter le prix du token (hype, influenceurs, faux partenariats)
3. Des investisseurs achètent le token, augmentant la liquidité du pool
4. A un moment choisi, l'équipe retire TOUTE la liquidité du pool
5. Le token ne vaut plus rien car il n'y a plus de liquidité pour le vendre
6. L'équipe disparaît avec les fonds
```

**Cas concret : Squid Game Token (2021)** :

```text
- Un token crée pour surfer sur la popularité de la serie Netflix
- Le prix a monte de 0,01 USD a 2 861 USD en quelques jours
- Les acheteurs ne pouvaient PAS vendre (fonction de vente desactivee dans le smart contract)
- Les créateurs ont retire la liquidité : 3,4 millions USD
- Le prix est passe de 2 861 USD a 0 en quelques minutes
- Les créateurs n'ont jamais été identifies
```

**Signaux d'alerte d'un rug pull** :

| Signal | Explication |
| ------ | ----------- |
| Équipe anonyme | Si personne ne met son nom et sa réputation en jeu, le risque est élevé |
| Liquidité non verrouillée | Si l'équipe peut retirer la liquidité à tout moment, c'est un signal critique |
| Impossible de vendre | Si le smart contract empêche la vente (honeypot), c'est une arnaque certaine |
| Token créé depuis quelques jours | Les projets sérieux mettent des mois ou des années à se développer |
| Marketing agressif sans produit | Si le budget marketing est plus élevé que le budget développement |

---

### Catégorie 3 : phishing

**Définition** : Le phishing est une technique d'arnaque où l'attaquant se fait passer pour un service légitime (une plateforme, un wallet, un protocole) pour voler tes identifiants ou ta seed phrase.

**Les formes de phishing en crypto** :

| Forme | Description | Exemple |
| ----- | ----------- | ------- |
| Faux site web | Un site identique à l'original, avec une URL légèrement différente | `metamaask.io` au lieu de `metamask.io` |
| Faux email | Un email qui imite une plateforme officielle | "Votre compte Binance a été compromis, cliquez ici pour sécuriser vos fonds" |
| Faux support technique | Quelqu'un se fait passer pour le support d'un wallet ou d'une plateforme | Sur Discord : "Je suis du support MetaMask, envoyez-moi votre seed phrase pour débloquer votre compte" |
| Faux airdrop | Un message te promet des tokens gratuits si tu connectes ton wallet | "Réclamez vos 500 UNI gratuits sur [faux-site].com" |
| Transaction malveillante | On te fait signer une transaction qui autorisé le transfert de tous tes tokens | Un smart contract demandé une approbation "illimitée" (approve unlimited) |

**Règle absolue** : Aucun service légitime ne te demandera JAMAIS ta seed phrase. Si quelqu'un la demande, c'est une arnaque. Sans exception.

---

### Catégorie 4 : pump and dump

**Définition** : Un pump and dump est une manipulation de marché coordonnée où un groupe achète massivement un token pour faire monter son prix (pump), puis revend au sommet (dump), laissant les derniers acheteurs avec des tokens sans valeur.

**Le mécanisme** :

```text
Phase 1 - Accumulation :
- Le groupe achète discretement un token a faible capitalisation
- Le prix commence a monter légerement

Phase 2 - Pump (montee) :
- Le groupe lance des messages enthousiastes sur Telegram, Discord, Twitter
- "Ce token va faire x100 !", "Les développeurs preparent un partenariat énorme"
- De nouveaux acheteurs arrivent, attires par la hausse et les promesses
- Le prix monte fortement

Phase 3 - Dump (chute) :
- Le groupe vend ses tokens au sommet
- Le prix s'effondre brutalement
- Les derniers acheteurs se retrouvent avec des tokens sans valeur
- Le groupe a empoche la difference
```

**Où ça se passe** : groupes Telegram privés, serveurs Discord, comptes Twitter/X avec beaucoup d'abonnés. Certains groupes vendent même l'accès à leurs "signaux" de pump.

---

### Catégorie 5 : romance scams et pig butchering

**Définition** : Le "pig butchering" (engraissement du cochon) est une arnaque où l'escroc construit une relation de confiance sur plusieurs semaines ou mois (amicale ou romantique) avant de convaincre la victime d'investir dans une "opportunité" crypto.

**Le processus** :

```text
1. Premier contact : message "accidentel" sur WhatsApp, Instagram, Tinder ou LinkedIn
2. Construction de la relation : conversations quotidiennes pendant des semaines
3. Introduction du sujet : "J'ai un oncle/ami qui gagne beaucoup en crypto"
4. Demonstration : l'escroc montre de faux gains sur une fausse plateforme
5. Petit investissement : la victime investit un petit montant et "gagne"
   (les gains sont fictifs, affiches sur un faux site)
6. Investissement croissant : encourage par les "gains", la victime investit de plus en plus
7. Demande de retrait : quand la victime veut retirer ses fonds,
   on lui demande de payér des "frais" ou des "taxes"
8. Disparition : l'escroc coupe tout contact
```

**Ampleur** : Le rapport IC3 2022 du FBI recense 3,31 milliards USD de pertes pour les arnaques d'investissement aux États-Unis (catégorie qui inclut le pig butchering). Les arnaques d'investissement en crypto-monnaies représentent 2,57 milliards USD de ce total. Ce type d'arnaque est souvent opéré par des réseaux criminels organisés.

---

### Catégorie 6 : faux airdrops et approbations malveillantes

**Définition** : Des tokens apparaissent "spontanément" dans ton wallet, ou tu reçois un message t'invitant à "réclamer" des tokens gratuits sur un site. En tentant de les vendre ou de les réclamer, tu signes une transaction qui autorisé l'attaquant à vider ton wallet.

**Le mécanisme technique** :

```text
1. L'attaquant envoie des tokens sans valeur a des milliers d'adresses
2. Tu vois ces tokens dans ton wallet
3. Tu vas sur le "site officiel" du token pour les vendre
4. Le site te demande de "connecter" ton wallet et de signer une transaction
5. La transaction contient une approbation (approve) qui autorisé un smart contract
   a transférer TOUS tes vrais tokens
6. Tu signes sans lire les détails de la transaction
7. L'attaquant exécute le smart contract et transfère tous tes fonds
```

**Règle** : Ne jamais interagir avec des tokens que tu n'as pas achetés ou demandés toi-même. Ignore-les complètement.

---

### Les influenceurs crypto et les conflits d'intérêt

**Définition** : De nombreux influenceurs crypto sont payés pour promouvoir des projets auprès de leur audience. Ce conflit d'intérêt est rarement déclaré explicitement.

**Comment ça fonctionne** :

| Ce que l'influenceur dit | Ce qui se passe en réalité |
| ------------------------ | -------------------------- |
| "Je crois vraiment en ce projet" | Il a été payé entre 5 000 et 500 000 USD pour en parler |
| "J'ai investi mon propre argent" | Il a reçu des tokens gratuits, souvent avant le lancement public |
| "Ce n'est pas un conseil financier" | Cette mention n'a aucune valeur légale. Il fait bien de la promotion |
| "Ce token va faire x100" | Il prévoit de vendre ses tokens quand les prix montent grâce à sa promotion |

**Cas concret : FTX et les célébrités** : Avant sa faillite en 2022, FTX a payé des millions de dollars à des célébrités (Tom Brady, Larry David, Shaquille O'Neal) pour promouvoir la plateforme. Les utilisateurs qui ont fait confiance à ces promotions ont perdu leurs fonds.

---

### Les signaux d'alerte universels

**Définition** : Quel que soit le type d'arnaque, certains signaux sont communs et doivent déclencher un réflexe de méfiance immédiate.

| Signal d'alerte | Pourquoi c'est suspect |
| --------------- | ---------------------- |
| Rendements garantis | Aucun investissement n'offre de rendement garanti. Aucun |
| Urgence artificielle | "Offre limitée", "Dernière chance", "Plus que 2 heures" |
| Équipe anonyme ou invérifiable | Les projets sérieux ont des équipes identifiées et vérifiables |
| Tokenomics obscures | Si tu ne comprends pas d'où vient le rendement, il vient probablement de toi |
| Marketing supérieur à la technologie | Plus de vidéos YouTube que de lignes de code |
| Communauté qui censure les critiques | Les questions critiques sont supprimées ou les utilisateurs sont bannis |
| "Tu ne peux pas perdre" | Si quelqu'un dit que tu ne peux pas perdre, tu vas perdre |
| Pression sociale | "Tout le monde achète", "Ne reste pas sur le quai" |
| Demande de seed phrase | Arnaque certaine, dans 100% des cas |
| Gains trop beaux pour être vrais | S'ils le sont, c'est qu'ils le sont |

---

### Règles de survie concrètes

**Définition** : Voici des règles pratiques et sans exception pour se protéger.

**Les 10 règles** :

1. **Ne jamais investir plus que ce que tu acceptes de perdre à 100%**. Si perdre ce montant te causerait un problème financier, ne l'investis pas
2. **Ne jamais partager ta seed phrase**. Avec personne. Sous aucun prétexte
3. **Vérifier l'URL avant de connecter ton wallet**. Lettre par lettre. Les faux sites sont visuellement identiques aux vrais
4. **Ne jamais cliquer sur des liens dans des DMs** (messages privés). Les projets légitimes communiquent via des canaux officiels
5. **Ignorer les tokens inconnus qui apparaissent dans ton wallet**. Ne jamais essayer de les vendre ou de les transférer
6. **Vérifier les approbations avant de signer une transaction**. Lire ce que le smart contract demande. Si tu ne comprends pas, ne signe pas
7. **Se méfier de toute urgence artificielle**. Les bonnes opportunités ne disparaissent pas en 5 minutes
8. **Vérifier les informations sur plusieurs sources indépendantes**. Pas seulement le site du projet et sa communauté
9. **Ne jamais investir sur la recommandation d'un inconnu rencontré en ligne**. Même après des semaines de conversation amicale
10. **Considérer que tout projet est une arnaque jusqu'à preuve du contraire**. La charge de la preuve repose sur le projet, pas sur toi

---

## Checklist de Validation

- [ ] Je sais identifier un schéma de Ponzi (rendements garantis, argent des nouveaux qui paie les anciens)
- [ ] Je sais ce qu'est un rug pull et quels signaux le trahissent (liquidité non verrouillée, équipe anonyme)
- [ ] Je connais les formes de phishing spécifiques à la crypto (faux site, faux support, faux airdrop)
- [ ] Je sais ce qu'est un pump and dump et comment il est organisé
- [ ] Je sais reconnaître un pig butchering (relation construite sur des semaines avant la demandé d'investissement)
- [ ] Je sais pourquoi il ne faut jamais interagir avec des tokens inconnus dans mon wallet
- [ ] Je connais les conflits d'intérêt des influenceurs crypto
- [ ] Je peux citer au moins 5 signaux d'alerte universels
- [ ] Je connais les 10 règles de survie et je m'engage à les appliquer

---

## Navigation

← Fiche précédente : **[01 - Wallets : comprendre ce qu'on possède vraiment](01-wallets-comprendre-possession.md)**

→ Fiche suivante : **[03 - FOMO, FUD et biais cognitifs : pourquoi ton cerveau te piège](03-fomo-fud-biais-cognitifs.md)**
