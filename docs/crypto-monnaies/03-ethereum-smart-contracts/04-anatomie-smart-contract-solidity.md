---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Anatomie d'un smart contract : lire et comprendre un contrat écrit en Solidity sans déployer"
estimated_time: "50 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 3 - Ethereum et les smart contracts"
---

# 04 - Anatomie d'un smart contract : lire et comprendre du Solidity

> **En bref** : Apprendre à lire et comprendre un smart contract écrit en Solidity, sans déployer ni coder, en analysant ligne par ligne un token ERC-20 et un contrat de vote. Lecture estimée : 50 min.

## Prérequis

- [Fiche 01 - Ethereum : ce que Bitcoin ne fait pas](01-ethereum-au-dela-de-bitcoin.md)
- [Fiche 02 - Smart contracts : du code, pas de la magie](02-smart-contracts-du-code.md)
- [Fiche 03 - Gas, EVM et les coûts réels d'utilisation](03-gas-evm-couts-reels.md)
- Savoir ce qu'est un smart contract, le gas et l'EVM
- Aucune connaissance préalable en programmation n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les éléments structurels d'un smart contract Solidity (pragma, contract, variables, fonctions, events, modifiers), lire et comprendre un token ERC-20 minimal et un contrat de vote simple, et reconnaître les vulnérabilités courantes.

---

## Concepts

### Solidity : le langage de programmation d'Ethereum

**Définition** : Solidity est le langage de programmation le plus utilise pour écrire des smart contracts sur Ethereum. Sa syntaxe ressemble à JavaScript et C++. Il a été créé spécifiquement pour l'EVM.

**Le problème que Solidity résout** :

L'EVM comprend uniquement du bytecode (une suite de nombres). Ecrire directement en bytecode serait comme écrire un livre en binaire (des 0 et des 1). Solidity permet d'écrire dans un langage lisible par les humains, qui est ensuite compile (traduit) en bytecode EVM.

**Analogie concrète** : Solidity est comme le français que tu lis en ce moment. Le bytecode EVM est comme le code Morse. Les deux transmettent de l'information, mais l'un est fait pour les humains et l'autre pour les machines. Un compilateur traduit du français vers le Morse.

**Ce que Solidity n'est PAS** :

- Solidity n'est pas le seul langage pour Ethereum. Vyper (syntaxe proche de Python) est une alternative utilisée par certains projets. Mais Solidity représente plus de 90% des smart contracts.
- Solidity n'est pas un langage generaliste. Tu ne peux pas écrire un site web ou une application mobile en Solidity. Il sert uniquement à écrire des smart contracts.

---

### La structure d'un smart contract

**Définition** : Chaque smart contract Solidity suit une structure precise avec des éléments bien définis. Voici les éléments, dans l'ordre où ils apparaissent généralement dans un fichier.

**Les éléments structurels** :

| Élément | Rôle | Obligatoire ? |
| --- | --- | --- |
| `pragma` | Specifie la version du compilateur Solidity | Oui |
| `import` | Importe du code depuis d'autres fichiers | Non |
| `contract` | Declare le smart contract (comme une classe en programmation objet) | Oui |
| Variables d'état | Données stockées de manière permanente sur la blockchain | Non (mais un contrat sans données est rare) |
| `constructor` | Fonction exécutée une seule fois, au moment du déploiement | Non |
| Fonctions | Actions que le contrat peut effectuer | Oui (sinon le contrat ne fait rien) |
| `modifier` | Conditions préalables réutilisables pour les fonctions | Non |
| `event` | Signaux émis par le contrat, lisibles par les applications externes | Non |

**Structure minimale** :

```solidity
// 1. Version du compilateur : le contrat exige Solidity 0.8.20 ou superieur
pragma solidity ^0.8.20;

// 2. Declaration du contrat : "MonContrat" est le nom du smart contract
contract MonContrat {

    // 3. Variable d'etat : stockee de maniere permanente sur la blockchain
    uint256 public compteur;

    // 4. Constructor : execute une seule fois au deploiement
    constructor() {
        compteur = 0; // Initialise le compteur a zero
    }

    // 5. Fonction : peut etre appelee par n'importe qui
    function incrementer() public {
        compteur = compteur + 1; // Ajoute 1 au compteur
    }
}
```

**Explication ligne par ligne** :

| Ligne | Signification |
| --- | --- |
| `pragma solidity ^0.8.20;` | Ce contrat doit être compile avec Solidity version 0.8.20 ou supérieur (mais inférieur à 0.9.0) |
| `contract MonContrat {` | Début de la définition du smart contract, nomme "MonContrat" |
| `uint256 public compteur;` | Variable entière non signée de 256 bits, accessible en lecture par tous (`public`) |
| `constructor()` | Fonction speciale exécutée une seule fois, au moment du déploiement |
| `function incrementer() public` | Fonction nommee "incrementer", accessible par tous (`public`) |
| `compteur = compteur + 1;` | Modifie la variable d'état (coût : 5 000 gas pour modifier une valeur existante) |

---

### Les types de visibilité

**Définition** : Chaque fonction et variable dans Solidity à une visibilité qui détermine qui peut y accéder.

| Visibilite | Qui peut appeler ? | Utilisation typique |
| --- | --- | --- |
| `public` | Tout le monde (externe et interne) | Fonctions que les utilisateurs doivent appeler |
| `external` | Seulement depuis l'extérieur du contrat | Fonctions d'interface |
| `internal` | Seulement le contrat lui-même et ses heritiers | Fonctions utilitaires internes |
| `private` | Seulement le contrat lui-même | Fonctions strictement internes |

**Attention** : `private` ne signifie pas "secret". Toutes les données sur la blockchain sont publiques et lisibles par n'importe qui. `private` signifie seulement que d'autres contrats ne peuvent pas appeler cette fonction directement. Un humain peut toujours lire la valeur en inspectant la blockchain.

---

### Les types de fonctions

**Définition** : Solidity distingue les fonctions selon ce qu'elles font avec l'état du contrat.

| Type | Mot-clé | Effet | Coût en gas |
| --- | --- | --- | --- |
| Lecture seule | `view` | Lit des données mais ne modifie rien | Gratuit (si appelée depuis l'extérieur, sans transaction) |
| Calcul pur | `pure` | Ne lit ni ne modifie rien, fait un calcul | Gratuit (si appelée depuis l'extérieur) |
| Modification | (aucun mot-clé) | Modifie l'état du contrat | Payant (nécessite une transaction) |
| Reception d'ETH | `payable` | Peut recevoir de l'ETH | Payant |

**Règle fondamentale** : lire des données sur la blockchain est gratuit. Ecrire des données coûte du gas. C'est pourquoi les fonctions `view` et `pure` sont gratuites quand elles sont appelées directement.

---

### Lire un contrat concret : un token ERC-20 minimal

**Définition** : ERC-20 est un standard qui définit comment un token fongible (chaque unité est identique) doit fonctionner sur Ethereum. USDC, USDT, UNI, LINK sont tous des tokens ERC-20.

**Le standard ERC-20 exige les fonctions suivantes** :

| Fonction | Rôle |
| --- | --- |
| `totalSupply()` | Renvoie le nombre total de tokens en circulation |
| `balanceOf(address)` | Renvoie le solde d'une adresse |
| `transfer(to, amount)` | Transfere des tokens à une adresse |
| `approve(spender, amount)` | Autorise une autre adresse a dépenser tes tokens |
| `allowance(owner, spender)` | Renvoie le montant qu'un spender est autorisé a dépenser |
| `transferFrom(from, to, amount)` | Transfere des tokens au nom de quelqu'un (après approbation) |

**Token ERC-20 minimal commente ligne par ligne** :

```solidity
// Version du compilateur
pragma solidity ^0.8.20;

// Declaration du contrat : "MonToken" est un token ERC-20
contract MonToken {

    // --- Variables d'etat ---

    // Nom du token (ex: "Mon Token")
    string public name;

    // Symbole du token (ex: "MTK")
    string public symbol;

    // Nombre de decimales (18 est le standard, comme l'ETH)
    uint8 public decimals = 18;

    // Nombre total de tokens en circulation
    uint256 public totalSupply;

    // Solde de chaque adresse : adresse -> montant
    mapping(address => uint256) public balanceOf;

    // Autorisations : proprietaire -> (autorisé -> montant)
    mapping(address => mapping(address => uint256)) public allowance;

    // --- Events ---

    // Emis a chaque transfert de tokens
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Emis a chaque approbation
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // --- Constructor ---

    // Execute une seule fois au deploiement
    // Cree tous les tokens et les attribue au deploieur
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;                          // Enregistre le nom du token
        symbol = _symbol;                      // Enregistre le symbole
        totalSupply = _totalSupply;            // Fixe le nombre total de tokens
        balanceOf[msg.sender] = _totalSupply;  // Tous les tokens vont au createur
        emit Transfer(address(0), msg.sender, _totalSupply); // Signal : tokens crees
    }

    // --- Fonctions ---

    // Transfere des tokens de l'appelant vers une autre adresse
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Solde insuffisant");  // Verifie le solde
        balanceOf[msg.sender] -= amount;    // Deduit du solde de l'expediteur
        balanceOf[to] += amount;            // Ajoute au solde du destinataire
        emit Transfer(msg.sender, to, amount); // Emet un signal de transfert
        return true;                        // Indique que le transfert a reussi
    }

    // Autorise une autre adresse a depenser des tokens en ton nom
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount; // Enregistre l'autorisation
        emit Approval(msg.sender, spender, amount); // Emet un signal d'approbation
        return true;
    }

    // Transfere des tokens au nom de quelqu'un (necessite une approbation prealable)
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Solde insuffisant");           // Verifie le solde
        require(allowance[from][msg.sender] >= amount, "Non autorisé");   // Verifie l'autorisation
        balanceOf[from] -= amount;              // Deduit du solde de l'expediteur
        balanceOf[to] += amount;                // Ajoute au solde du destinataire
        allowance[from][msg.sender] -= amount;  // Reduit l'autorisation restante
        emit Transfer(from, to, amount);        // Emet un signal de transfert
        return true;
    }
}
```

**Éléments clés a retenir** :

| Élément | Signification |
| --- | --- |
| `mapping(address => uint256)` | Un tableau associatif qui associe une adresse à un nombre (comme un dictionnaire) |
| `msg.sender` | L'adresse de la personne qui a envoyé la transaction |
| `require(condition, message)` | Si la condition est fausse, la transaction est annulee et le message d'erreur est affiche |
| `emit` | Émet un événement (event) qui peut être lu par les applications externes |
| `address(0)` | L'adresse zéro (0x000...000), utilisée par convention pour représenter la "création" de tokens |

---

### Lire un contrat plus complexe : un vote simple

**Définition** : Ce contrat permet à un propriétaire de créer un vote et a des adresses autorisées de voter pour une proposition. Il illustre l'utilisation de modifiers, de structs et de controles d'accès.

```solidity
pragma solidity ^0.8.20;

contract VoteSimple {

    // --- Structures de donnees ---

    // Une proposition a un nom et un compteur de votes
    struct Proposition {
        string nom;        // Nom de la proposition (ex: "Proposition A")
        uint256 nbVotes;   // Nombre de votes recus
    }

    // --- Variables d'etat ---

    // L'adresse du createur du contrat (celui qui l'a deploye)
    address public proprietaire;

    // Liste de toutes les propositions
    Proposition[] public propositions;

    // Enregistre si une adresse a deja vote (true = a vote)
    mapping(address => bool) public aVote;

    // Enregistre si une adresse est autorisee a voter
    mapping(address => bool) public estAutorise;

    // --- Events ---

    // Emis quand quelqu'un vote
    event VoteEnregistre(address indexed votant, uint256 indexProposition);

    // --- Modifier ---

    // Ce modifier restreint l'acces : seul le proprietaire peut executer la fonction
    modifier seulProprietaire() {
        require(msg.sender == proprietaire, "Seul le proprietaire peut faire cela");
        _; // Le "_" represente le code de la fonction qui utilise ce modifier
    }

    // --- Constructor ---

    // Au deploiement, on fixe le proprietaire et on cree les propositions
    constructor(string[] memory nomsPropositions) {
        proprietaire = msg.sender; // Le deploieur devient le proprietaire

        // Pour chaque nom de proposition fourni, on cree une Proposition
        for (uint256 i = 0; i < nomsPropositions.length; i++) {
            propositions.push(Proposition({
                nom: nomsPropositions[i],  // Le nom fourni
                nbVotes: 0                 // Zero votes au depart
            }));
        }
    }

    // --- Fonctions ---

    // Le proprietaire autorisé une adresse a voter
    function autoriserVotant(address votant) public seulProprietaire {
        require(!aVote[votant], "Cette adresse a deja vote");
        estAutorise[votant] = true; // Marque l'adresse comme autorisee
    }

    // Un votant autorisé enregistre son vote
    function voter(uint256 indexProposition) public {
        require(estAutorise[msg.sender], "Vous n'etes pas autorisé a voter");
        require(!aVote[msg.sender], "Vous avez deja vote");
        require(indexProposition < propositions.length, "Proposition inexistante");

        aVote[msg.sender] = true;                           // Marque comme ayant vote
        propositions[indexProposition].nbVotes += 1;        // Incremente le compteur
        emit VoteEnregistre(msg.sender, indexProposition);  // Emet le signal
    }

    // Renvoie l'index de la proposition gagnante
    function propositionGagnante() public view returns (uint256 indexGagnant) {
        uint256 maxVotes = 0;

        // Parcourt toutes les propositions pour trouver celle avec le plus de votes
        for (uint256 i = 0; i < propositions.length; i++) {
            if (propositions[i].nbVotes > maxVotes) {
                maxVotes = propositions[i].nbVotes;
                indexGagnant = i;
            }
        }
    }
}
```

**Éléments clés a retenir** :

| Élément | Signification |
| --- | --- |
| `struct` | Un type de données personnalisé qui regroupe plusieurs champs |
| `Proposition[]` | Un tableau dynamique (liste) de Propositions |
| `modifier seulProprietaire()` | Une condition préalable : vérifie que l'appelant est le propriétaire avant d'exécuter la fonction |
| `_;` | Dans un modifier, représente "exécute le code de la fonction ici" |
| `public seulProprietaire` | La fonction est publique MAIS le modifier `seulProprietaire` bloque toute personne autre que le propriétaire |

---

### Les vulnérabilités courantes

**Définition** : Les smart contracts sont sujets à des catégories de bugs spécifiques. Ces vulnérabilités ont causé des pertes de centaines de millions de dollars.

**Vulnérabilité 1 : la reentrancy**

C'est le bug qui a permis le hack de The DAO (voir fiche 02).

```solidity
// CODE VULNERABLE - ne jamais ecrire ceci
function retirer(uint256 montant) public {
    require(soldes[msg.sender] >= montant);

    // PROBLEME : on envoie les fonds AVANT de mettre a jour le solde
    (bool ok, ) = msg.sender.call{value: montant}("");
    require(ok);

    // Cette ligne arrive trop tard : l'attaquant a deja rappele retirer()
    soldes[msg.sender] -= montant;
}
```

```solidity
// CODE CORRIGE - pattern "checks-effects-interactions"
function retirer(uint256 montant) public {
    require(soldes[msg.sender] >= montant);   // 1. Verifier (check)

    soldes[msg.sender] -= montant;            // 2. Modifier l'etat (effect)

    (bool ok, ) = msg.sender.call{value: montant}(""); // 3. Interagir (interaction)
    require(ok);
}
```

**La règle d'or** : toujours modifier l'état du contrat AVANT d'interagir avec un contrat externe. C'est le pattern "checks-effects-interactions" (vérifier, modifier, interagir).

**Vulnérabilité 2 : integer overflow (avant Solidity 0.8)**

Avant la version 0.8, Solidity ne verifiait pas les depassements d'entiers.

```text
Exemple :
- Une variable uint8 peut stocker des valeurs de 0 a 255.
- Si tu ajoutes 1 a 255, le résultat revient a 0 (au lieu de 256).
- Un attaquant pouvait utiliser ce comportement pour transformer un solde
  de 0 en un nombre énorme.

Depuis Solidity 0.8 (2021) :
- Les depassements provoquent automatiquement une erreur.
- Cette vulnérabilité est eliminee pour tout contrat compile avec Solidity 0.8+.
```

**Vulnérabilité 3 : front-running**

```text
Le problème :
1. Alice envoie une transaction pour acheter un token sur un DEX.
2. La transaction est visible dans le mempool (file d'attente) avant d'être confirmee.
3. Bob voit la transaction d'Alice, envoie la même transaction avec un gas plus élevé.
4. Bob passe avant Alice, achète le token, puis le revend à Alice plus cher.

C'est legal sur la blockchain (il n'y a pas de règle contre) mais ethiquement
discutable. On appelle aussi cela le MEV (Maximal Extractable Value).
```

**Vulnérabilité 4 : accès non protège**

```solidity
// CODE VULNERABLE : n'importe qui peut s'attribuer tous les tokens
function attribuerTokens(address dest, uint256 montant) public {
    balanceOf[dest] += montant;
}

// CODE CORRIGE : seul le proprietaire peut attribuer des tokens
function attribuerTokens(address dest, uint256 montant) public seulProprietaire {
    balanceOf[dest] += montant;
}
```

**Tableau récapitulatif des vulnérabilités** :

| Vulnérabilité | Description | Prevention |
| --- | --- | --- |
| Reentrancy | Un contrat externe rappelle la fonction avant la fin | Pattern checks-effects-interactions |
| Integer overflow | Un nombre dépasse sa capacité et revient à zéro | Utiliser Solidity 0.8+ |
| Front-running | Un attaquant copie ta transaction et passe avant toi | Mécanismes anti-MEV, commit-reveal |
| Accès non protégé | Une fonction critique est accessible à tous | Utiliser des modifiers (`onlyOwner`) |

---

### Vérifier un contrat sur Etherscan

**Définition** : Etherscan (etherscan.io) est un explorateur de blocs qui permet de consulter les transactions, les adresses et les smart contracts sur Ethereum. Il permet aussi de lire le code source des contrats vérifies.

**Comment savoir si un contrat est fiable** :

| Indicateur | Signification |
| --- | --- |
| "Verified" (coche verte) sur Etherscan | Le code source correspond au bytecode déployé. Tu peux lire le code réel |
| "Not Verified" | Tu ne peux voir que le bytecode (illisible). Impossible de savoir ce que fait le contrat |
| Audit par une société reconnue (Trail of Bits, OpenZeppelin, Certora) | Le code a été examine par des experts en sécurité |
| Pas d'audit | Le code n'a pas été examine. Le risque est plus élevé |

**Lire un contrat sur Etherscan** :

```text
1. Va sur etherscan.io
2. Entre l'adresse du contrat dans la barre de recherche
3. Clique sur l'onglet "Contract"
4. Si le contrat est vérifie, tu verras :
   - "Read Contract" : appeler les fonctions view (lecture gratuite)
   - "Write Contract" : appeler les fonctions qui modifient l'état (nécessite un wallet)
   - "Code" : le code source complet en Solidity
```

**Point important** : cette fiche est purement théorique. En environnement offline, tu ne peux pas accéder a Etherscan. L'objectif est de savoir que cet outil existe et comment il fonctionne pour le jour où tu auras accès à internet.

**Ce que la vérification sur Etherscan n'est PAS** :

- La vérification ne garantit pas que le code est correct ou sécurisé. Elle garantit seulement que le code source correspond au bytecode déployé.
- Un contrat vérifié peut contenir des bugs ou des portes derobees. La vérification permet de lire le code, pas de prouver qu'il est fiable.

---

### Les standards de tokens ERC

**Définition** : Les ERC (Ethereum Request for Comments) sont des standards techniques qui définissent comment certains types de smart contracts doivent fonctionner. Un standard ERC garantit que tous les tokens qui le respectent sont compatibles entre eux et avec l'écosystème existant (wallets, DEX, plateformes).

**Pourquoi standardiser les tokens ?**

Sans standard commun :

1. **Incompatibilite** : chaque token aurait sa propre interface. Les wallets devraient écrire du code spécifique pour chaque token.
2. **Pas d'écosystème** : les DEX, les protocoles de lending et les wallets ne pourraient pas fonctionner avec des tokens non standardises.
3. **Confusion** : impossible de savoir à l'avance ce qu'un token peut faire ou comment interagir avec lui.

Avec un standard, un wallet comme MetaMask peut afficher n'importe quel token ERC-20 automatiquement, et un DEX comme Uniswap peut échanger n'importe quel token ERC-20 sans configuration spécifique.

**Les standards principaux** :

| Standard | Type de token | Description | Exemples |
| --- | --- | --- | --- |
| ERC-20 | Fongible | Chaque unité est identique et interchangeable (comme des billets) | USDC, UNI, LINK, DAI |
| ERC-721 | Non fongible (NFT) | Chaque token est unique et non interchangeable | CryptoPunks, Bored Apes, art numérique |
| ERC-1155 | Multi-token | Un seul contrat peut gérer des tokens fongibles ET non fongibles | Items de jeu (10 epees identiques + 1 armure unique) |
| ERC-4626 | Vault tokenisee | Standard pour les coffres-forts défi qui génèrent du rendement | Vaults Yearn, stratégies de lending |

**ERC-20 en détail** : C'est le standard le plus utilise. Il définit 6 fonctions obligatoires (vues dans la section précédente : `totalSupply`, `balanceOf`, `transfer`, `approve`, `allowance`, `transferFrom`) et 2 événements (`Transfer`, `Approval`). Tout token qui implémente ces fonctions est "ERC-20 compatible".

**ERC-721 en détail** : Chaque token à un identifiant unique (`tokenId`). Contrairement à l'ERC-20 où tu peux envoyer "50 tokens", avec l'ERC-721 tu envoies "le token numéro 42". C'est la base technique des NFTs.

**ERC-1155 en détail** : Combine les deux précédents dans un seul contrat. Utile pour les jeux ou les places de marché où tu geres des milliers de types d'objets différents - certains en plusieurs exemplaires (fongibles), d'autres uniques (non fongibles).

**ERC-4626 en détail** : Standardise la facon dont les protocoles DeFi créent des "vaults" (coffres-forts) qui investissent les fonds déposés et redistribuent les rendements. Avant ce standard, chaque protocole avait sa propre interface, rendant l'intégration difficile.

**Ce que les standards ERC ne garantissent PAS** :

- Un token ERC-20 conforme au standard peut malgré tout être une arnaque. Le standard définit l'interface technique, pas la qualité ou l'honnetete du projet.
- Les standards n'empechent pas les bugs. Un token peut implementer le standard mais contenir des erreurs dans sa logique interne.

---

## Checklist de Validation

- [ ] Je sais que Solidity est le langage principal pour écrire des smart contracts Ethereum
- [ ] Je connais les éléments structurels d'un contrat (pragma, contract, variables, constructor, fonctions, events, modifiers)
- [ ] Je sais distinguer les visibilites (public, external, internal, private) et que `private` ne signifie pas "secret"
- [ ] Je sais lire un token ERC-20 minimal et identifier le rôle de chaque fonction (transfer, approve, transferFrom)
- [ ] Je comprends ce que fait `require` (annuler la transaction si la condition est fausse)
- [ ] Je comprends ce que fait `msg.sender` (l'adresse de l'appelant)
- [ ] Je sais reconnaître un modifier et expliquer son rôle (condition préalable)
- [ ] Je connais les 4 vulnérabilités principales (reentrancy, overflow, front-running, accès non protège)
- [ ] Je sais que Etherscan permet de lire le code source des contrats vérifies
- [ ] Je sais qu'un contrat vérifié n'est pas forcément un contrat sécurisé

---

## Navigation

← Fiche précédente : **[Gas, EVM et les coûts réels d'utilisation](03-gas-evm-couts-reels.md)**

→ Phase suivante : **[Phase 4 - L'écosystème crypto : trier le signal du bruit](../04-ecosysteme-signal-bruit/index.md)**
