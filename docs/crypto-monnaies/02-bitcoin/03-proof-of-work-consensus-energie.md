---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Proof of Work : comment le minage sécurise Bitcoin par la dépense d'énergie et ce que cela coûte réellement"
estimated_time: "40 min"
fiche_number: 3
total_fiches: 6
cursus: "Phase 2 - Bitcoin"
id: "specializations.crypto.bitcoin.proof-of-work-consensus-energie"
course_id: "specializations.crypto"
module_id: "specializations.crypto.bitcoin"
content_type: "lesson"
order: 3
---

# 03 - Proof of Work : le consensus par l'énergie

> **En bref** : Comprendre comment le mécanisme de Proof of Work sécurise le réseau Bitcoin, ce que font réellement les mineurs, et combien cela coûte en énergie. Lecture estimée : 40 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complète (fiches 01 à 04)
- [Fiche 01 - Bitcoin : contexte de naissance et principes](01-contexte-naissance-principes.md)
- [Fiche 02 - Transactions Bitcoin : UTXOs, scripts et vérification](02-transactions-utxos-scripts.md)
- Comprendre ce qu'est un hash (fonction de hachage)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le problème du consensus dans un réseau décentralisé, décrire le mécanisme de Proof of Work, comprendre l'ajustement de la difficulté, et évaluer factuellement le coût énergétique du minage Bitcoin.

---

## Concepts

### Le problème du consensus

**Définition** : Le problème du consensus est la question fondamentale suivante : comment un groupe de participants qui ne se font pas confiance peuvent-ils se mettre d'accord sur un état commun (la liste des transactions valides) sans autorité centrale pour trancher ?

**Le problème que le consensus résout** :

Sans mécanisme de consensus, voici les problèmes rencontrès :

1. **Desaccord sur l'état du registre** : chaque participant pourrait avoir une version différente de la blockchain.
2. **Triche** : un participant pourrait insérer de fausses transactions dans sa version du registre.
3. **Double dépense** : sans accord commun, rien n'empêche quelqu'un de dépenser les mêmes fonds deux fois en envoyant des transactions contradictoires a différents participants.

**Comment le consensus résout ces problèmes** :

| Problème | Solution apportée par le consensus |
| --- | --- |
| Desaccord sur l'état | Tous les nœuds suivent la même règle pour déterminer la chaîne valide |
| Triche | Insérer de fausses transactions coûterait plus cher que de jouer le jeu |
| Double dépense | Le réseau entier se met d'accord sur quelle transaction est valide |

**Le problème des généraux byzantins** :

Ce problème classique en informatique illustre la difficulté du consensus. Imagine plusieurs généraux qui assiegent une ville. Ils doivent coordonner une attaque simultanee pour gagner. Mais :

- Ils ne peuvent communiquer que par messagers (qui peuvent être interceptes).
- Certains généraux peuvent être des traitrès (envoyer de faux messages).
- Si les généraux ne sont pas tous d'accord, l'attaque échoue.

La question est : comment les généraux loyaux peuvent-ils se coordonner malgré la presence possible de traitrès ?

Bitcoin résout ce problème en rendant la tricherie extrêmement coûteuse. Pour "mentir" au réseau, il faut dépenser une quantité énorme d'énergie. C'est le Proof of Work.

---

### Le mécanisme de Proof of Work

**Définition** : Le Proof of Work (preuve de travail) est un mécanisme par lequel les mineurs dépensent de l'énergie pour trouver un nombre (appelé nonce) qui, combiné avec les données du bloc, produit un hash commençant par un certain nombre de zéros.

**Le problème que le Proof of Work résout** :

Sans Proof of Work, voici les problèmes rencontrès :

1. **Pas de coût à la tricherie** : n'importe qui pourrait proposer des blocs frauduleux sans conséquence.
2. **Pas de departage** : si deux participants proposent un bloc en même temps, comment choisir ?
3. **Pas de sécurité économique** : sans investissement matériel, le réseau est vulnérable aux attaques.

**Comment le Proof of Work résout ces problèmes** :

| Problème | Solution apportée par le Proof of Work |
| --- | --- |
| Pas de coût à la tricherie | Proposer un bloc exige de dépenser de l'électricité pour trouver le nonce |
| Pas de departage | Le premier mineur qui trouve le nonce valide gagne le droit d'écrire le bloc |
| Pas de sécurité économique | Attaquer le réseau coûte plus cher que de le sécuriser honnement |

**Comment ca fonctionne, étape par étape** :

1. Le mineur rassemble des transactions du mempool dans un bloc candidat.
2. Le mineur ajoute un en-tête au bloc contenant : le hash du bloc précédent, un timestamp, les transactions, et un nombre arbitraire appelé **nonce**.
3. Le mineur calcule le hash de cet en-tête : `hash = SHA-256(SHA-256(en-tete du bloc))`.
4. Le mineur vérifie si ce hash commence par le nombre requis de zéros (déterminé par la difficulté).
5. Si le hash ne commence pas par assez de zéros, le mineur change le nonce et recommence à l'étape 3.
6. Le mineur répété ce processus des milliards de fois par seconde jusqu'à trouver un hash valide.
7. Quand un hash valide est trouve, le mineur diffuse le bloc au réseau.
8. Les autres nœuds vérifient le bloc (ce qui est très rapide) et l'ajoutent a leur copie de la blockchain.

**Analogie concrète** : Imagine un concours ou l'on te demandé de trouver un nombre entre 1 et 1 milliard. La seule méthode est de tester des nombres au hasard. Celui qui trouve en premier gagne le droit d'écrire la prochaîne page du registre et reçoit une récompense. Pour trouver plus vite, tu peux acheter plus d'ordinateurs (puissance de calcul). Mais tu dépenses de l'électricité a chaque essai, que tu gagnes ou non.

Le diagramme suivant résume le processus de minage Proof of Work :

<div class="diagram-design">
<p><a href="../../../diagrams/crypto-monnaies-02-bitcoin-03-proof-of-work-consensus-energie-1.html">Le mécanisme de Proof of Work (HTML + SVG)</a></p>
<iframe src="../../../diagrams/crypto-monnaies-02-bitcoin-03-proof-of-work-consensus-energie-1.html" title="Le mécanisme de Proof of Work" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

**Ce que le Proof of Work n'est PAS** :

- Le Proof of Work n'est pas un "calcul utile". L'énergie dépensée ne sert a rien d'autre qu'a sécuriser le réseau. Les mineurs ne résolvent pas de problèmes scientifiques ou mathématiques utiles.
- Le Proof of Work n'est pas une preuve que le bloc est correct. Il prouve seulement que quelqu'un a dépense de l'énergie. Les nœuds vérifient ensuite indépendamment que les transactions du bloc sont valides.

**Propriété asymétrique fondamentale** :

| Action | Difficulté |
| --- | --- |
| Trouver un nonce valide (minage) | Extremement difficile (milliards de tentatives) |
| Vérifier qu'un nonce est valide | Instantane (un seul calcul de hash) |

C'est cette asymetrie qui fait fonctionner le système : il est très coûteux de créer un bloc, mais gratuit de vérifier qu'il est valide.

---

### L'ajustement de la difficulté

**Définition** : La difficulté est un paramètre du protocole Bitcoin qui détermine combien de zéros le hash d'un bloc doit commencer. La difficulté s'ajuste automatiquement tous les 2 016 blocs (environ 2 semaines) pour maintenir un rythme moyen d'un bloc toutes les 10 minutes.

**Le problème que l'ajustement résout** :

Sans ajustement de la difficulté, voici les problèmes rencontrès :

1. **Blocs trop rapides** : si la puissance de calcul du réseau augmente, les blocs seraient trouves trop vite, ce qui reduirait la sécurité.
2. **Blocs trop lents** : si des mineurs quittent le réseau, les blocs prendraient trop longtemps a être trouves.

**Comment l'ajustement fonctionne** :

```text
Tous les 2 016 blocs, le réseau vérifie :
- Combien de temps a-t-il fallu pour miner ces 2 016 blocs ?
- Temps cible : 2 016 blocs x 10 minutes = 20 160 minutes (= 2 semaines)

Si les blocs ont été trouves trop vite (moins de 2 semaines) :
  -> La difficulté augmente (il faut plus de zéros au début du hash)

Si les blocs ont été trouves trop lentement (plus de 2 semaines) :
  -> La difficulté diminue (il faut moins de zéros au début du hash)
```

**Analogie concrète** : C'est comme un thermostat. Si la température (vitesse de minage) est trop haute, le thermostat (la difficulté) monte pour ralentir. Si la température est trop basse, le thermostat descend pour accélérer. L'objectif est de maintenir une température constante (un bloc toutes les 10 minutes).

**Conséquence importante** : ajouter plus de puissance de calcul au réseau ne produit PAS plus de bitcoins. Cela augmente uniquement la difficulté. Le rythme de création des bitcoins reste constant : un bloc toutes les 10 minutes en moyenne, quelle que soit la puissance totale du réseau.

---

### La sécurité du Proof of Work : l'attaque 51%

**Définition** : Une attaque 51% est une situation théorique ou un attaquant possède plus de la moitié de la puissance de calcul totale du réseau. Cela lui permettrait de créer une chaîne alternative plus longue que la chaîne honnete.

**Ce qu'un attaquant a 51% pourrait faire** :

- **Double dépense** : dépenser des bitcoins, attendre la confirmation, puis créer une chaîne alternative ou cette transaction n'existe pas.
- **Censurer des transactions** : refuser d'inclure certaines transactions dans ses blocs.
- **Reorganiser les blocs recents** : remplacer les derniers blocs par ses propres blocs.

**Ce qu'un attaquant a 51% ne pourrait PAS faire** :

- créer des bitcoins à partir de rien (les nœuds rejetteraient les blocs invalides).
- Voler des bitcoins d'adresses qui ne lui appartiennent pas (il faudrait les clés privées).
- Modifier des transactions anciennes (le coût augmente exponentiellement avec le nombre de blocs a remplacer).

**Pourquoi cette attaque est improbable sur Bitcoin** :

| Facteur | Détail |
| --- | --- |
| Coût du matériel | Des milliards de dollars en équipement de minage spécialisé (ASICs) |
| Coût énergétique | Des millions de dollars d'électricité par jour |
| Conséquence sur le prix | Une attaque réussie ferait chuter le prix du bitcoin, rendant l'investissement de l'attaquant sans valeur |
| Détection immediate | Le réseau détecterait la reorganisation en temps réel |

L'argument économique est le suivant : il est plus rentable d'utiliser cette puissance de calcul pour miner honnement que pour attaquer le réseau.

---

### Le coût énergétique du minage

**Définition** : Le minage Bitcoin consomme de l'électricité parce que les mineurs font tourner des machines specialisees (ASICs) 24 heures sur 24 pour trouver des nonces valides. Cette consommation est mesurable et fait l'objet d'estimations régulières.

**Chiffres factuels** (sources : Cambridge Centre for Alternative Finance, IEA) :

| Métrique | Estimation |
| --- | --- |
| Consommation annuelle du réseau Bitcoin | Snapshot CBECI : 138,2 TWh annualisés au 30 juin 2024 (Cambridge Digital Mining Industry Report, avril 2025). L'ordre de grandeur 2024-2025 reste ~100-150 TWh ; le chiffre exact bouge chaque semaine. |
| Equivalent pays | Comparable à la consommation de la Pologne ou des Pays-Bas |
| Nombre de transactions par seconde | Environ 7 (couche de base) |
| Consommation par transaction (couche de base) | Environ 700-1 000 kWh |
| Pour comparaison : une transaction Visa | Environ 0,001 kWh |

**Remarque importante** : la consommation par transaction est un indicateur trompeur. L'énergie sécurise l'ensemble du réseau (tous les blocs, tous les UTXOs), pas une transaction individuelle. Que le réseau traite 1 ou 7 transactions par bloc, la consommation énergétique reste la même.

**Le débat énergétique présenté factuellement** :

**Arguments avances par les partisans** :

- L'énergie dépensée sécurisé un réseau financier mondial décentralisé. D'autres systèmes (banques, datacenters) consomment aussi beaucoup d'énergie.
- Une partie des mineurs utilise de l'énergie renouvelable ou de l'énergie qui serait autrement gaspillee (gaz torche, surplus hydroelectrique dans des zones isolées).
- Le minage peut inciter au développement d'infrastructures énergétiques dans des zones reculees.
- Le Cambridge Centre for Alternative Finance estimé que 37 a 60% de l'énergie du minage provient de sources renouvelables (les estimations varient).

**Arguments avances par les critiques** :

- La consommation est disproportionnee par rapport au nombre de transactions traitees. Visa traite des milliers de fois plus de transactions avec une fraction de l'énergie.
- L'énergie "autrement gaspillee" ne représente qu'une fraction du total. La majorité du minage utilise le réseau électrique classique.
- Chaque kilowattheure utilise pour le minage est un kilowattheure non disponible pour d'autres usages.
- D'autres mécanismes de consensus (Proof of Stake) securisent des réseaux avec 99,9% d'énergie en moins.

**Fait objectif** : le Proof of Work consomme de l'énergie par conception. C'est le mécanisme de sécurité fondamental de Bitcoin. Supprimer cette consommation signifierait changer le mécanisme de consensus, ce que la communauté Bitcoin a choisi de ne pas faire.

---

### La récompense de bloc et le halving

**Définition** : La récompense de bloc est le nombre de bitcoins créés et attribués au mineur qui trouve un bloc valide. Cette récompense est divisée par deux environ tous les 4 ans (tous les 210 000 blocs). Cet événement s'appelle le "halving".

**Le principe** : au lancement de Bitcoin (2009), la récompense était de 50 BTC par bloc. Depuis le 4e halving (avril 2024), elle est de **3,125 BTC** par bloc. Le prochain halving est prévu vers 2028 (1,5625 BTC). Pour l'historique complet des halvings et leurs conséquences, voir la [fiche 05 - Bitcoin en chiffres](05-bitcoin-chiffres-adoption-reelle.md).

**La récompense totale d'un mineur** :

```text
Récompense totale = Récompense de bloc + Frais des transactions du bloc

Exemple (2025) :
  Récompense de bloc : 3,125 BTC
  Frais des transactions : variable (0,1 a 1+ BTC selon la congestion)
  Total : 3,225 a 4,125+ BTC par bloc
```

**Pourquoi le halving existe** :

Le halving garantit que le nombre total de bitcoins ne dépassera jamais 21 millions. La récompense diminue de moitié régulièrement jusqu'à atteindre zéro (prévu vers 2140). À ce moment-là, les mineurs seront rémunérés uniquement par les frais de transaction.

**Conséquence directe** : a mesure que la récompense de bloc diminue, les frais de transaction devront augmenter pour que le minage reste rentable. Si les frais ne suffisent pas, des mineurs quitteront le réseau, ce qui reduira la sécurité. C'est un sujet de débat actif dans la communauté Bitcoin.

**Ce que le halving n'est PAS** :

- Le halving n'est pas un événement qui "fait monter le prix". La corrélation historique entre halvings et hausses de prix existe, mais corrélation n'est pas causalité. De nombreux autres facteurs influencent le prix.
- Le halving n'est pas une surprise. Il est programme dans le code depuis le premier jour. Tout le monde sait quand il aura lieu.

---

## Checklist de Validation

- [ ] Je sais expliquer le problème du consensus dans un réseau décentralisé
- [ ] Je sais décrire le problème des généraux byzantins en termes simples
- [ ] Je comprends le mécanisme du Proof of Work (trouver un nonce, hash avec des zéros)
- [ ] Je sais expliquer l'asymetrie fondamentale : difficile a trouver, facile a vérifier
- [ ] Je sais expliquer l'ajustement de la difficulté (tous les 2 016 blocs, cible de 10 min)
- [ ] Je comprends qu'ajouter de la puissance de calcul ne produit pas plus de bitcoins
- [ ] Je sais décrire ce qu'une attaque 51% peut et ne peut pas faire
- [ ] Je connais l'ordre de grandeur de la consommation énergétique de Bitcoin (100-150 TWh/an)
- [ ] Je sais présenter les arguments des deux côtés du débat énergétique
- [ ] Je connais la récompense de bloc actuelle (3,125 BTC) et le principe du halving

---

## Navigation

← Fiche précédente : **[Transactions Bitcoin : UTXOs, scripts et vérification](02-transactions-utxos-scripts.md)**

→ Fiche suivante : **[Le réseau Bitcoin : nœuds, mineurs et pools](04-reseau-noeuds-mineurs-pools.md)**
