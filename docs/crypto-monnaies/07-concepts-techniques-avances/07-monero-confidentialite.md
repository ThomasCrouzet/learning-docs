---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Monero : confidentialité par défaut, ring signatures, RingCT, stealth addresses et débats de régulation"
estimated_time: "50 min"
fiche_number: 7
total_fiches: 7
cursus: "Phase 7 - Concepts techniques avances"
---

# 07 - Monero et la confidentialité par défaut

> **En bref** : Comprendre pourquoi Bitcoin n'est pas anonyme, comment Monero rend chaque transaction privée par défaut (ring signatures, RingCT, stealth addresses, Dandelion++), et les débats de régulation que cela soulève. Lecture estimée : 50 min.

## Prérequis

- [Fiche 03 - Zéro-knowledge proofs](03-zero-knowledge-proofs-vie-privee.md) : comprendre le problème de la transparence des blockchains et les approches de confidentialité
- Connaître le fonctionnement des transactions Bitcoin (UTXOs, adresses) (Phase 2)
- Connaître les bases de la cryptographie : clés publiques/privées, signatures (Phase 1)
- Comprendre que les transactions Bitcoin sont publiques et traçables

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer pourquoi Bitcoin est pseudonyme et non anonyme, décrire les quatre mécanismes de confidentialité de Monero, comparer Monero, Zcash et Bitcoin de façon factuelle, et comprendre les enjeux de régulation et les limites de cette technologie.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Bitcoin n'est pas anonyme : pseudonyme et traçable

**Définition** : Bitcoin est **pseudonyme**, pas anonyme. Chaque utilisateur est identifié par des adresses (des suites de caractères) plutôt que par son nom, mais toutes les transactions liées à ces adresses sont publiques et enregistrées de façon permanente.

**Le problème que Monero cherche à résoudre** :

La transparence de Bitcoin pose des problèmes de confidentialité concrets :

1. **Traçabilité complète** : Chaque transaction (montant, adresse d'origine, adresse de destination) est inscrite à jamais dans la blockchain publique. N'importe qui peut suivre le parcours des fonds.
2. **Déanonymisation par recoupement** : Le jour où une adresse est reliée à une identité réelle (via un exchange qui applique le KYC, une boutique en ligne, un don public), tout l'historique de cette adresse devient attribuable à cette personne.
3. **Analyse de chaîne professionnelle** : Des sociétés comme Chainalysis ou Elliptic se spécialisent dans le suivi des flux et le regroupement d'adresses appartenant au même propriétaire (clustering).

**Pourquoi « pseudonyme » n'est pas « anonyme »** :

```text
Bitcoin = pseudonyme :
- Ton identité n'est pas écrite directement dans la blockchain
- MAIS une adresse est un pseudonyme stable et public
- Si on relie une seule fois l'adresse à ton nom, tout l'historique
  passé ET futur de cette adresse t'est attribué

Analogie : un pseudonyme sur un forum public.
- Tant que personne ne sait qui tu es, tu es caché
- Le jour ou quelqu'un fait le lien pseudonyme -> identité réelle,
  TOUS tes messages passes deviennent attribuables à toi

Anonyme = on ne peut PAS faire le lien, même en essayant.
Pseudonyme = on PEUT faire le lien, il suffit d'un seul point de fuite.
```

**Ce que le pseudonymat de Bitcoin n'est PAS** :

- Le pseudonymat n'est pas une protection durable. Une seule fuite (un retrait depuis un exchange à ton nom) suffit à relier une adresse à ton identité.
- Le pseudonymat n'est pas réversible. Une fois une adresse déanonymisée, tu ne peux pas « effacer » son historique de la blockchain.

---

### Qu'est-ce que Monero ?

**Définition** : Monero (symbole XMR) est une crypto-monnaie lancée en 2014 dont l'objectif central est la confidentialité **par défaut** : sauf cas particulier, l'expéditeur, le destinataire et le montant de chaque transaction sont masqués, sans que l'utilisateur ait à activer une option.

**La différence clé avec les autres : par défaut, pas en option** :

| Modèle | Comment fonctionne la confidentialité |
| --- | --- |
| Bitcoin | Aucune confidentialité : tout est public |
| Zcash | Confidentialité **optionnelle** : transactions transparentes ou blindées au choix |
| Monero | Confidentialité **par défaut** : toutes les transactions sont privées, sans choix à faire |

**Pourquoi « par défaut » change tout** :

```text
Problème de la confidentialité optionnelle (Zcash) :
- La plupart des utilisateurs n'activent pas le mode prive
  (vu en fiche 03 : ~15-25% des transactions Zcash sont blindées)
- Les rares transactions privées ressortent comme inhabituelles
- Le faible volume de transactions privées réduit la taille de
  "l'ensemble d'anonymat" (le groupe dans lequel se cachér)

Avantage de la confidentialité par défaut (Monero) :
- TOUTES les transactions sont privées, donc se ressembler est la norme
- Aucune transaction ne se distingue par sa nature privée
- L'ensemble d'anonymat est l'ensemble du réseau

Principe général : on se caché mieux dans une foule
ou tout le monde se ressemble que dans une foule
ou seules quelques personnes portent un masque.
```

**Ce que Monero n'est PAS** :

- Monero n'est pas basé sur les zéro-knowledge proofs. Il utilise d'autres techniques (ring signatures, stealth addresses, RingCT) décrites ci-dessous. C'est une différence majeure avec Zcash.
- Monero n'est pas un outil garantissant l'impunité. La confidentialité protège le contenu des transactions on-chain, mais les comportements en dehors de la blockchain (réutilisation d'identité, erreurs de manipulation, points de contact KYC) peuvent toujours exposer un utilisateur. La loi continue de s'appliquer.

---

### Mécanisme 1 : les ring signatures (cachér l'expéditeur)

**Définition** : Une ring signature (signature de cercle) est une signature produite par un membre d'un groupe, telle qu'un observateur peut vérifier qu'un membre du groupe a signé, sans pouvoir déterminer lequel. Monero l'utilise pour masquer le véritable expéditeur d'une transaction.

**Le problème résolu** : sur Bitcoin, on voit exactement quelle pièce (UTXO) est dépensée, donc qui dépense. Les ring signatures noient le vrai dépensier parmi des leurres.

**Comment ça fonctionne (démonstration conceptuelle)** :

```text
Quand Alice depense de l'argent sur Monero :

1. Sa vraie sortie (l'argent qu'elle possède) est melangee avec
   plusieurs autres sorties anciennes prises sur la blockchain,
   appelées "leurres" (decoys)

2. L'ensemble forme un "cercle" (ring) de sorties possibles :

   Cercle de signature (taille 16 par exemple) :
   [ leurre, leurre, VRAIE sortie d'Alice, leurre, leurre, ... ]
                       ^^^^^^^^^^^^^^^^^^^
                       invisible pour l'observateur

3. La signature prouve que l'UNE des sorties du cercle a été
   legitimement depensee, sans révéler laquelle

4. Un observateur voit 16 sorties candidates et ne peut pas savoir
   laquelle est la vraie. Probabilité de deviner : 1 sur 16.
```

**La taille du cercle (ring size)** : plus le cercle contient de leurres, plus il est difficile d'identifier le vrai expéditeur. Monero impose une taille de cercle minimale obligatoire et identique pour tous (16 depuis la mise à jour d'août 2022), pour que toutes les transactions se ressemblent.

**Le problème de la double dépense** : si l'expéditeur est caché, comment empêcher qu'il dépense deux fois la même pièce ? Monero utilise une **image de clé** (key image) : une empreinte unique dérivée de la vraie sortie dépensée, sans révéler laquelle. Si la même image de clé réapparaît, le réseau détecte la double dépense et rejette la transaction.

---

### Mécanisme 2 : RingCT (cachér le montant)

**Définition** : RingCT (Ring Confidential Transactions) est la technologie qui masque le **montant** d'une transaction Monero, tout en permettant au réseau de vérifier que les comptes sont justes (la somme des entrées égale la somme des sorties, et aucun montant n'est négatif).

**Le problème résolu** : cachér l'expéditeur et le destinataire ne suffit pas si le montant reste visible. Un montant inhabituel (par exemple 13,37 XMR) peut servir à relier des transactions entre elles.

**Comment vérifier sans voir le montant (démonstration conceptuelle)** :

```text
Sans RingCT : le montant est visible (comme sur Bitcoin).
Avec RingCT : le montant est remplace par un "engagement" chiffre.

Le défi : comment le réseau vérifie-t-il que la transaction est
valide s'il ne voit pas les montants ?

RingCT permet de prouver, sans révéler les montants, que :
1. La somme des entrées = la somme des sorties
   (personne ne crée de Monero à partir de rien)
2. Chaque montant de sortie est positif
   (pas de montant négatif qui créerait de l'argent par astuce)

Analogie : imagine des enveloppes scellees et opaques contenant
des billets. Un mécanisme mathématique permet de prouver que
"le total des enveloppes entrantes = le total des enveloppes
sortantes" SANS ouvrir aucune enveloppe. Le réseau est convaincu
que les comptes sont justes sans connaître les montants.
```

RingCT est obligatoire sur Monero depuis septembre 2017 : aucun montant n'est visible en clair sur la blockchain.

---

### Mécanisme 3 : les stealth addresses (cachér le destinataire)

**Définition** : Une stealth address (adresse furtive) est une adresse à usage unique générée automatiquement pour chaque transaction. L'adresse publique du destinataire n'apparaît jamais sur la blockchain ; à la place, une adresse unique et jetable est créée à chaque paiement.

**Le problème résolu** : sur Bitcoin, si tu publies ton adresse (pour recevoir des dons, par exemple), tous les paiements vers cette adresse sont visibles et regroupables. Avec les stealth addresses, deux paiements vers la même personne aboutissent à deux adresses différentes sur la blockchain.

**Comment ça fonctionne (démonstration conceptuelle)** :

```text
Bob publie une seule adresse Monero (son adresse publique).

Quand Alice lui envoie de l'argent :
1. Le portefeuille d'Alice génère une adresse a USAGE UNIQUE
   à partir de l'adresse publique de Bob
2. C'est cette adresse jetable qui apparaît sur la blockchain,
   PAS l'adresse publique de Bob
3. Seul Bob peut reconnaître et depenser les fonds recus sur cette
   adresse, grâce a sa clé privée

Résultat :
- Carol envoie aussi de l'argent à Bob -> autre adresse jetable
- Sur la blockchain : deux adresses différentes, sans lien apparent
- Impossible de voir que les deux paiements vont à la même personne

Analogie : une boîte postale qui change de numéro à chaque courrier
reçu, mais dont toi seul possedes la clé pour rélevér le contenu.
```

---

### Mécanisme 4 : Dandelion++ (cachér l'adresse réseau)

**Définition** : Dandelion++ est un protocole de propagation des transactions qui masque l'adresse IP de l'ordinateur d'origine. Il protège la confidentialité au niveau du réseau, pas seulement au niveau de la blockchain.

**Le problème résolu** : même si une transaction est cryptographiquement privée, l'ordinateur qui la diffuse en premier révèle son adresse IP. Un observateur surveillant le réseau pourrait relier une transaction à une localisation ou un fournisseur d'accès.

**Comment ça fonctionne (démonstration conceptuelle)** :

```text
Diffusion classique (Bitcoin) :
- Ton nœud annonce immédiatement la transaction a tous ses voisins
- Le premier nœud à l'annoncer trahit souvent l'origine (ton IP)

Dandelion++ se déroule en deux phases :

Phase "tige" (stem) :
- La transaction est transmise discretement de nœud en nœud,
  en ligne, sur un chemin aleatoire (sans diffusion massive)
- L'origine réelle est noyee dans ce trajet

Phase "fleur" (fluff) :
- A un point aleatoire du chemin, un nœud diffuse largement
  la transaction à tout le réseau
- Le nœud qui diffuse n'est PAS l'origine, ce qui casse le lien
  entre la transaction et l'IP de l'émetteur

Le nom vient du pissenlit (dandelion) : une tige unique,
puis une dispersion en fleur.
```

Dandelion++ complète les trois mécanismes précédents : ring signatures, RingCT et stealth addresses protègent le contenu on-chain ; Dandelion++ protège la couche réseau.

---

### Récapitulatif : ce que chaque mécanisme caché

| Mécanisme | Ce qu'il masque | Couche concernée |
| --- | --- | --- |
| Ring signatures | L'expéditeur (le vrai parmi des leurres) | Blockchain |
| RingCT | Le montant de la transaction | Blockchain |
| Stealth addresses | Le destinataire (adresse à usage unique) | Blockchain |
| Dandelion++ | L'adresse IP d'origine | Réseau |

Ensemble, ces quatre techniques rendent une transaction Monero opaque par défaut : un observateur de la blockchain ne voit ni qui paie, ni qui reçoit, ni combien.

---

### Comparaison Monero, Zcash et Bitcoin

**Définition** : Les trois projets adoptent des positions différentes sur le compromis entre transparence et confidentialité.

| Critère | Bitcoin | Zcash | Monero |
| --- | --- | --- | --- |
| Confidentialité | Aucune (tout public) | Optionnelle (au choix) | Par défaut (toujours) |
| Technologie principale | Aucune (transparence) | ZK-SNARKs | Ring signatures + RingCT + stealth addresses |
| Trusted setup requis | Non | Oui (pour les transactions blindées) | Non |
| Montants visibles | Oui | Non (si blindé) | Non |
| Auditabilité de la supply totale | Triviale (tout public) | Vérifiable cryptographiquement | Vérifiable cryptographiquement (RingCT) |
| Maturité de la confidentialité | Sans objet | Depuis 2016 | Depuis 2014, renforcée en continu |
| Posture des régulateurs | Largement acceptée | Surveillée | La plus visée par les délistages |

**Note sur l'auditabilité de la supply Monero** : contrairement à Bitcoin où les montants sont publics
et la supply triviale à lire, l'auditabilité de l'offre totale de Monero repose sur les
**engagements cryptographiques Pedersen** (Pedersen commitments) utilisés par RingCT. Ces engagements
permettent de prouver, sans révéler aucun montant individuel, que chaque transaction conserve bien la
somme (entrées = sorties + frais), garantissant l'absence d'inflation cachée. L'audit de la supply
n'est donc pas une lecture directe des montants, mais une vérification de la solidité mathématique
des engagements sur l'ensemble de la chaîne. La mention "cryptographiquement" dans le tableau est
intentionnelle et précise : elle signifie que la garantie repose sur la solidité des hypothèses
cryptographiques sous-jacentes, pas sur une transparence comparable à celle de Bitcoin.

**Un point de nuance important** :

```text
"Confidentialité par défaut" (Monero) et "confidentialité optionnelle"
(Zcash) répondent a des philosophies différentes :

- Monero : la vie privée doit être la norme, pas une option a activer.
  Avantage : grand ensemble d'anonymat. Inconvénient : pas de mode
  transparent simple pour, par exemple, prouver ses revenus à un tiers.

- Zcash : l'utilisateur choisit. Avantage : flexibilité, conformité
  plus facile. Inconvénient : faible adoption du mode prive, donc
  ensemble d'anonymat réduit.

Aucune des deux approches n'est "meilleure" dans l'absolu :
elles répondent a des besoins et des contraintes différents.
```

---

### Régulation, délistages et débats

**Définition** : Les crypto-monnaies axées sur la confidentialité (souvent appelées « privacy coins ») font l'objet d'une attention réglementaire particulière, car leur opacité complique l'application des règles de lutte contre le blanchiment (AML) et de connaissance du client (KYC).

**Les faits sur les délistages** :

```text
Plusieurs plateformes d'échange ont retire Monero, principalement
sous la pression réglementaire dans certaines juridictions :

- Binance a annonce le delistage de Monero (XMR) en février 2024,
  effectif courant 2024
- Kraken a retire Monero pour les utilisateurs de certaines zones
  (par exemple l'Espace économique europeen, la Belgique, l'Irlande)
- D'autres plateformes (OKX, Huobi selon les regions) ont pris des
  décisions similaires selon les juridictions

Cause invoquee : les exigences de conformité AML/KYC, difficiles a
concilier avec une monnaie dont les flux ne sont pas tracables.

Conséquence : Monero reste echangeable, mais davantage via des
plateformes décentralisées (DEX), des échanges pair-a-pair ou des
plateformes specialisees, et moins via les grands exchanges grand public.
```

**Le débat de fond** :

| Argument « pour » la confidentialité | Argument « contre » / inquiétude des régulateurs |
| --- | --- |
| La vie privée financière est un droit, comme le secret de la correspondance | L'opacité facilite le blanchiment et le financement d'activités illégales |
| La transparence totale expose à la surveillance et au profilage commercial | Les règles AML/KYC supposent une traçabilité des flux |
| Connaître le solde de quelqu'un crée un risque de sécurité (vol ciblé) | Difficulté à appliquer les sanctions internationales |
| L'argent liquide est déjà privé et largement accepté | Pression sur les exchanges qui craignent des sanctions |

**Une posture factuelle** :

```text
Ce qui est verifiable :
- Monero offre une confidentialité forte et par défaut (faits techniques)
- Plusieurs exchanges ont delisté Monero pour raisons de conformité (faits)
- La confidentialité financière est un sujet de droit et de société légitime

Ce qui rélevé de l'opinion (a ne pas presenter comme un fait) :
- "Les privacy coins servent surtout au crime" : non etabli ; les
  données disponibles montrent que la majorité des flux illicites
  passent encore par des cryptos transparentes et des monnaies
  classiques, plus liquides
- "La vie privée justifie tout" : ne dispense pas du respect de la loi

Conclusion neutre : Monero est un outil de confidentialité financière.
Comme tout outil, ses usages vont du parfaitement légitime (protection
de la vie privée) à l'illégal (blanchiment). La technologie elle-même
ne tranche pas ce débat ; le droit et l'usage le font.
```

---

### Les limites de Monero

**Définition** : La confidentialité par défaut à un coût et des limites qu'il faut connaître pour évaluer honnêtement le projet.

| Limite | Explication |
| --- | --- |
| Transactions plus volumineuses | Les ring signatures et RingCT alourdissent chaque transaction par rapport à Bitcoin, ce qui pèse sur la taille de la blockchain. |
| Liquidité réduite | Les délistages des grands exchanges rendent Monero plus difficile à acheter et à vendre que Bitcoin ou Ethereum. |
| Pression réglementaire continue | L'avenir de Monero sur les plateformes régulées reste incertain et dépend des décisions des autorités. |
| Confidentialité non absolue | La confidentialité on-chain est forte, mais des erreurs d'usage (réutilisation d'identité, points de contact KYC, analyses statistiques avancées) peuvent toujours réduire l'anonymat réel. |
| Complexité d'audit | Comme pour toute cryptographie avancée, peu de personnes sont capables d'auditer en profondeur les protocoles, ce qui concentre la confiance sur quelques experts. |

**Un mot sur la confidentialité « parfaite »** :

```text
Aucune technologie ne garantit un anonymat absolu et definitif.

Monero élevé fortement le coût et la difficulté de la
deanonymisation par rapport a Bitcoin, mais :
- La recherche sur l'analyse des transactions Monero progresse
- Des erreurs d'utilisation peuvent exposer un utilisateur
- Les points de contact avec le monde réglementaire (achat, vente)
  restent des sources potentielles de fuite

Posture réaliste : Monero offre une confidentialité très supérieure
a celle de Bitcoin, mais "très supérieure" ne signifie pas
"infaillible". La prudence reste de mise.
```

---

## Checklist de Validation

- [ ] Je comprends que Bitcoin est pseudonyme et non anonyme (traçable, déanonymisable)
- [ ] Je sais expliquer la différence entre confidentialité par défaut (Monero) et optionnelle (Zcash)
- [ ] Je sais ce que masquent les ring signatures (l'expéditeur) et ce qu'est l'image de clé
- [ ] Je sais que RingCT masque les montants tout en permettant de vérifier les comptes
- [ ] Je sais que les stealth addresses masquent le destinataire avec des adresses à usage unique
- [ ] Je sais que Dandelion++ protège l'adresse IP au niveau réseau
- [ ] Je sais comparer Monero, Zcash et Bitcoin de façon factuelle
- [ ] Je connais les faits sur les délistages (Binance 2024, Kraken selon régions) et leurs causes
- [ ] Je distingue les faits techniques des opinions dans le débat sur les privacy coins
- [ ] Je connais les limites de Monero (taille, liquidité, régulation, confidentialité non absolue)

---

## Navigation

← Fiche précédente : **[Blockchains alternatives : Solana, Cosmos, Polkadot, Cardano, Avalanche](06-blockchains-alternatives-comparaison.md)**

→ Phase suivante : **[Phase 8 - Perspective et avenir réaliste](../08-perspective-avenir-realiste/index.md)**
