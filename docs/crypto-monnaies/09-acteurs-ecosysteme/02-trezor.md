---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Trezor : premier hardware wallet, approche open source, comparaison factuelle avec Ledger"
estimated_time: "35 min"
fiche_number: 2
total_fiches: 8
cursus: "Phase 9 - Acteurs de l'écosystème"
---

# 02 - Trezor : le pionnier des hardware wallets

> **En bref** : Comprendre l'histoire de Trezor, son approche open source, ses forces et vulnérabilités, et comparer factuellement Trezor et Ledger pour faire un choix eclaire. Lecture estimée : 35 min.

## Prérequis

- [Phase 9, fiche 01 - Ledger](01-ledger.md) (comprendre les hardware wallets et le Secure Élément)
- [Phase 5, fiche 01 - Wallets : comprendre ce qu'on possède](../05-securite-survie/01-wallets-comprendre-possession.md) (clés privées, seed phrase)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras décrire l'histoire de SatoshiLabs et Trezor, expliquer la philosophie open source et ses conséquences sur la sécurité, identifier les vulnérabilités connues des anciens modèles et comparer factuellement Trezor et Ledger.

---

## Concepts

### Histoire : SatoshiLabs et la naissance du hardware wallet

**Définition** : Trezor est un hardware wallet créé par SatoshiLabs, une entreprise basée a Prague (Republique tcheque). Le Trezor One, sorti en 2014, est le premier hardware wallet commercialise au monde.

**Le fondateur : Marek Palatinus (alias Slush)** :

Marek Palatinus est une figure importante de l'écosystème Bitcoin. Avant de créer Trezor, il avait déjà créé en 2010 le premier pool de minage au monde (Slush Pool, renomme Braiins Pool). Un pool de minage permet a plusieurs mineurs de combiner leur puissance de calcul pour avoir plus de chances de miner un bloc et de partager la récompense.

**Chronologie** :

| Année | Événement |
| ----- | --------- |
| 2010 | Marek Palatinus créé le premier pool de minage (Slush Pool) |
| 2013 | Fondation de SatoshiLabs a Prague |
| 2014 | Lancement du Trezor One - premier hardware wallet au monde |
| 2019 | Lancement du Trezor Model T (écran tactile couleur) |
| 2024 | Lancement du Trezor Safe 3 et Trezor Safe 5 |

**Analogie concrète** : Si Ledger est comparable a Apple (design soigne, écosystème ferme, marketing agressif), Trezor est comparable à un projet Linux (code ouvert, communauté technique, transparence maximale). Les deux approches ont des avantages et des inconvénients.

---

### La philosophie open source : transparence contre sécurité par l'obscurite

**Définition** : Le firmware et le hardware de Trezor sont open source. Le code est publie sur GitHub, vérifiable par quiconque. N'importe quel développeur peut lire, auditer et proposer des modifications au code qui gère les clés privées.

**Le problème que l'open source résout** :

1. **Vérification indépendante** : avec un code ferme (propriétaire), l'utilisateur fait confiance à l'entreprise. Avec un code ouvert, n'importe quel expert peut vérifier qu'il n'y a pas de backdoor ou de faille.
2. **Pas de fonctionnalité cachée** : la controverse Ledger Recover a montre que du code propriétaire peut contenir des fonctionnalités que l'utilisateur ne soupconnaît pas. Avec du code open source, tout est visible.
3. **Résilience** : si SatoshiLabs disparaît, la communauté peut continuer a maintenir et ameliorer le firmware.

**Le débat : transparence vs sécurité par l'obscurite** :

| Open source (Trezor) | Code propriétaire (Ledger) |
| --------------------- | -------------------------- |
| Tout le monde peut lire le code et trouver des failles | Les attaquants doivent faire du reverse engineering, ce qui est plus difficile |
| Les failles sont corrigees plus vite car plus de gens les cherchent | Les failles restent cachées tant que personne ne les découvre |
| L'utilisateur peut vérifier ce que fait le firmware | L'utilisateur fait confiance à l'entreprise |
| Un attaquant connaît le code et peut chercher des failles methodiquement | Un attaquant ne connaît pas le code (mais peut le reverser) |

**Point important** : "open source" ne signifie pas "automatiquement plus sécurisé". Cela signifie "vérifiable". La sécurité dépend de la qualité du code et de la communauté qui l'audite, pas du simple fait d'être ouvert.

---

### Produits : la gamme Trezor

**Définition** : SatoshiLabs propose plusieurs modèles de hardware wallets, chacun avec des caractéristiques différentes.

**Comparaison des produits** :

| Modèle | Année | Prix (~) | Ecran | Connexion | Secure Élément |
| ------ | ----- | -------- | ----- | --------- | -------------- |
| Trezor One | 2014 | 60 euros | Petit OLED | USB | Non |
| Trezor Model T | 2019 | 180 euros | Tactile couleur | USB-C | Non |
| Trezor Safe 3 | 2024 | 80 euros | Petit OLED | USB-C | Oui (EAL6+) |
| Trezor Safe 5 | 2024 | 170 euros | Tactile couleur | USB-C | Oui (EAL6+) |

**Évolution notable** : les anciens modèles (Trezor One et Model T) n'avaient pas de Secure Élément. C'était un choix delibere de SatoshiLabs : ils consideraient que l'open source était plus important que le Secure Élément. Les Secure Éléments disponibles à l'époque necessitaient des accords de non-divulgation qui empechaient le code d'être open source.

Les modèles Safe 3 et Safe 5 de 2024 incluent enfin un Secure Élément tout en restant open source. Ce compromis a été rendu possible par de nouveaux composants disponibles sur le marche.

**Trezor Suite** : équivalent de Ledger Live chez Trezor. Application officielle pour gérer ses crypto-monnaies, envoyer des transactions et accéder à des fonctionnalités comme le coin control (choisir quels UTXOs utiliser dans une transaction Bitcoin) ou la connexion à un nœud Tor pour plus de confidentialité.

Trezor Suite existe en version bureau (Windows, macOS, Linux) et en version mobile (Android et iOS). Sur iOS, la compatibilité matérielle est plus limitée que sur Android : le Trezor Safe 7 se connecte en Bluetooth, les autres modèles ont une compatibilité restreinte.

---

### Vulnérabilités connues : le coût de l'absence de Secure Élément

**Définition** : L'absence de Secure Élément dans les anciens modèles Trezor (One et Model T) les rend vulnérables a certaines attaques physiques documentees.

**Attaque par voltage glitching** :

En 2020, des chercheurs en sécurité (Kraken Security Labs et Wallet.fail) ont demontre qu'il était possible d'extraire la seed phrase d'un Trezor One et d'un Model T en environ 15 minutes d'accès physique à l'appareil.

**Comment fonctionne l'attaque** :

1. L'attaquant ouvre physiquement le Trezor (devisser le boitier).
2. Il connecte des sondes électriques aux puces internes.
3. Il envoie des impulsions électriques anormales (voltage glitching) pendant le démarrage de l'appareil.
4. Ces impulsions provoquent des erreurs qui permettent de contourner les protections de lecture de la mémoire.
5. La seed phrase est extraite de la mémoire.

**Conditions requises** :

| Condition | Détail |
| --------- | ------ |
| Accès physique | L'attaquant doit avoir le Trezor en main |
| Équipement spécialisé | Oscilloscope, generateur de signaux, sondes (~quelques centaines d'euros) |
| Temps | 15 minutes environ |
| Compétences | Connaissances en électronique et en sécurité embarquee |

**Ce que cela signifie en pratique** :

- Si quelqu'un te vole ton Trezor One ou Model T, il peut potentiellement extraire ta seed phrase.
- La protection par code PIN ne suffit pas : l'attaque contourne le PIN.
- Le passphrase (25eme mot optionnel) protège contre cette attaque, car il n'est pas stocke sur l'appareil.

**Réponse de SatoshiLabs** : ils recommandent d'utiliser un passphrase en complement du PIN. Les nouveaux modèles (Safe 3, Safe 5) incluent un Secure Élément qui bloque ce type d'attaque.

**Ce que ce n'est PAS** :

- Ce n'est pas une attaque a distance. Personne ne peut voler ta seed phrase via internet.
- Ce n'est pas une attaque courante. Elle nécessite du matériel, des compétences et un accès physique.

---

### Comparaison factuelle Ledger vs Trezor

**Définition** : Ledger et Trezor sont les deux principaux fabricants de hardware wallets. Ils ont des philosophies différentes. Voici une comparaison basée sur des faits vérifiables.

| Critère | Ledger | Trezor |
| ------- | ------ | ------ |
| Fondation | 2014, Paris (France) | 2013, Prague (Republique tcheque) |
| Premier produit | 2016 (Nano S) | 2014 (Trezor One - premier hardware wallet au monde) |
| Code source | Propriétaire (partiellement open source) | Entierement open source |
| Secure Élément | Oui, depuis le premier produit | Oui, depuis 2024 (Safe 3/Safe 5) |
| Certification | CC EAL5+/6+ | CC EAL6+ (modèles Safe uniquement) |
| Vulnérabilité physique connue | Pas de voltage glitching documente (Secure Élément protège) | Voltage glitching documente sur les anciens modèles |
| Controverse majeure | Fuite de données 2020 + Ledger Recover 2023 | Vulnérabilité physique des anciens modèles |
| Application compagnon | Ledger Live (desktop + mobile) | Trezor Suite (desktop + mobile Android/iOS ; iOS plus limité selon le modèle) |
| Bluetooth | Oui (Nano X, Stax, Flex) | Non |
| Prix d'entrée | ~80 euros (Nano S Plus) | ~60 euros (Trezor One) / ~80 euros (Safe 3) |
| Crypto-monnaies supportees | 5 500+ | 8 000+ |
| Nombre d'unités vendues | 6+ millions (communique par Ledger) | Non communique publiquement |

**Points importants sur cette comparaison** :

- **Il n'y a pas de "meilleur" wallet universel.** Le choix dépend de ce qui compte le plus pour toi : transparence du code (Trezor) ou écosystème complet (Ledger).
- **Les deux protègent efficacement contre les attaques en ligne.** La différence porte sur les attaques physiques et la philosophie de l'entreprise.
- **Les deux ont eu des problèmes.** Ledger : fuite de données et Recover. Trezor : vulnérabilité physique des anciens modèles.
- **Les modèles 2024 de Trezor** comblent l'écart sur le Secure Élément, tout en maintenant l'open source.

---

### Contribution réelle et verdict factuel

**Ce que Trezor a apporte à l'écosystème** :

- **Innovation pionniere** : le Trezor One est le premier hardware wallet au monde. Sans Trezor, le concept même de hardware wallet n'existerait peut-être pas sous cette forme.
- **Standard open source** : Trezor a prouve qu'un hardware wallet pouvait être open source, permettant des audits indépendants.
- **Pression concurrentielle** : la concurrence entre Trezor et Ledger a pousse les deux a ameliorer leurs produits.

**Les limites** :

- **Vulnérabilité physique historique** : l'absence de Secure Élément pendant 10 ans (2014-2024) était un risque réel pour les utilisateurs qui n'utilisaient pas de passphrase.
- **Écosystème moins complet** : Bluetooth limité aux modèles récents (Safe 7), moins de partenariats avec des services DeFi, et l'application mobile iOS reste plus limitée que Ledger Live.
- **Communication moins visible** : SatoshiLabs communique moins que Ledger, ce qui limite la portée de la marque.

**Verdict factuel** : Trezor est le pionnier des hardware wallets et le champion de l'approche open source. Cette transparence à un coût (vulnérabilités physiques documentees sur les anciens modèles) et un bénéfice (tout est vérifiable). Les modèles 2024 combinent enfin Secure Élément et open source, offrant le meilleur des deux mondes. Le choix entre Trezor et Ledger est un compromis entre philosophies, pas entre niveaux de sécurité.

---

## Checklist de Validation

- [ ] Je connais l'histoire de SatoshiLabs et Marek Palatinus (premier pool de minage, premier hardware wallet)
- [ ] Je comprends la philosophie open source de Trezor et ses conséquences (vérifiable, mais code visible par les attaquants aussi)
- [ ] Je sais que les anciens modèles (One, Model T) n'avaient pas de Secure Élément et étaient vulnérables au voltage glitching
- [ ] Je connais les conditions de l'attaque physique (accès physique, 15 min, équipement spécialisé)
- [ ] Je sais que le passphrase protège contre cette attaque
- [ ] Je peux comparer factuellement Ledger et Trezor (open source, Secure Élément, controverses, prix)
- [ ] Je comprends que le choix entre les deux est un compromis entre philosophies, pas un choix objectivement supérieur

---

## Navigation

← Fiche précédente : **[Ledger : sécuriser ses clés avec du hardware français](01-ledger.md)**

→ Fiche suivante : **[Coinbase : l'exchange qui a choisi la régulation](03-coinbase.md)**
