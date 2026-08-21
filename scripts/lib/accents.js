/**
 * Fonctions pures et regles pour la detection et correction des accents francais.
 */

const PHRASE_RULES = [
  { pattern: /Lecture estimee/g, replacement: 'Lecture estimée' },
  { pattern: /\bA la fin\b/g, replacement: 'À la fin' },
  { pattern: /\bjusqu'a\b/g, replacement: "jusqu'à" },
  { pattern: /\bEnonce\b/g, replacement: 'Énoncé' },
  { pattern: /Mis a jour/g, replacement: 'Mis à jour' },
  { pattern: /Analogie concrete/g, replacement: 'Analogie concrète' },
  { pattern: /! Corrige\b/g, replacement: '! Corrigé' },
  { pattern: /mises a jour/g, replacement: 'mises à jour' },
  { pattern: /mise a jour/g, replacement: 'mise à jour' },
  // "même" via phrases (mot ambigu seul - pourrait être un meme internet)
  { pattern: /\bmeme si\b/g, replacement: 'même si' },
  { pattern: /\bMeme si\b/g, replacement: 'Même si' },
  { pattern: /\bmeme chose\b/g, replacement: 'même chose' },
  { pattern: /\bmeme temps\b/g, replacement: 'même temps' },
  { pattern: /\bmeme type\b/g, replacement: 'même type' },
  { pattern: /\bmeme facon\b/g, replacement: 'même façon' },
  { pattern: /\bmeme maniere\b/g, replacement: 'même manière' },
  { pattern: /\bmeme moment\b/g, replacement: 'même moment' },
  { pattern: /\bmeme pas\b/g, replacement: 'même pas' },
  { pattern: /\bmeme nom\b/g, replacement: 'même nom' },
  { pattern: /\bmeme logique\b/g, replacement: 'même logique' },
  { pattern: /\bmeme principe\b/g, replacement: 'même principe' },
  { pattern: /\bmeme niveau\b/g, replacement: 'même niveau' },
  { pattern: /\bmeme resultat\b/g, replacement: 'même résultat' },
  { pattern: /\bla meme\b/g, replacement: 'la même' },
  { pattern: /\bdu meme\b/g, replacement: 'du même' },
  { pattern: /\bau meme\b/g, replacement: 'au même' },
  { pattern: /\bde meme\b/g, replacement: 'de même' },
  { pattern: /\ben meme\b/g, replacement: 'en même' },
  { pattern: /\bmemes problemes\b/g, replacement: 'mêmes problèmes' },
  { pattern: /\bmemes conditions\b/g, replacement: 'mêmes conditions' },
  { pattern: /\bmemes regles\b/g, replacement: 'mêmes règles' },
  { pattern: /\beux-memes\b/g, replacement: 'eux-mêmes' },
  { pattern: /\belles-memes\b/g, replacement: 'elles-mêmes' },
  { pattern: /\blui-meme\b/g, replacement: 'lui-même' },
  { pattern: /\belle-meme\b/g, replacement: 'elle-même' },
  { pattern: /au-dela\b/g, replacement: 'au-delà' },
  { pattern: /Au-dela\b/g, replacement: 'Au-delà' },
];

// --- Word-level rules ---
// Each rule: { pattern, replacement }
// Patterns use \b word boundaries. Case handling via flags or separate entries.
const WORD_RULES = [
  // Groupe 1 - Noms (sans ambiguïté)
  { pattern: /\bDefinitions?\b/g, replacement: (m) => m.startsWith('D') ? m.replace('Definition', 'Définition') : m },
  { pattern: /\bdefinitions?\b/g, replacement: (m) => m.replace('definition', 'définition') },
  { pattern: /\bPrerequis\b/g, replacement: 'Prérequis' },
  { pattern: /\bprerequis\b/g, replacement: 'prérequis' },
  { pattern: /\bdeploiements?\b/g, replacement: (m) => m.replace('deploiement', 'déploiement') },
  { pattern: /\bDeploiements?\b/g, replacement: (m) => m.replace('Deploiement', 'Déploiement') },
  { pattern: /\bparametres?\b/g, replacement: (m) => m.replace('parametre', 'paramètre') },
  { pattern: /\bParametres?\b/g, replacement: (m) => m.replace('Parametre', 'Paramètre') },
  { pattern: /\betapes?\b/g, replacement: (m) => m.replace('etape', 'étape') },
  { pattern: /\bEtapes?\b/g, replacement: (m) => m.replace('Etape', 'Étape') },
  { pattern: /\bsystemes?\b/g, replacement: (m) => m.replace('systeme', 'système') },
  { pattern: /\bSystemes?\b/g, replacement: (m) => m.replace('Systeme', 'Système') },
  { pattern: /\breseaux?\b/g, replacement: (m) => m.replace('reseau', 'réseau') },
  { pattern: /\bReseaux?\b/g, replacement: (m) => m.replace('Reseau', 'Réseau') },
  { pattern: /\bsecurite\b/g, replacement: 'sécurité' },
  { pattern: /\bSecurite\b/g, replacement: 'Sécurité' },
  { pattern: /\bproblemes?\b/g, replacement: (m) => m.replace('probleme', 'problème') },
  { pattern: /\bProblemes?\b/g, replacement: (m) => m.replace('Probleme', 'Problème') },
  { pattern: /\bmethodes?\b/g, replacement: (m) => m.replace('methode', 'méthode') },
  { pattern: /\bMethodes?\b/g, replacement: (m) => m.replace('Methode', 'Méthode') },
  { pattern: /\breferences?\b/g, replacement: (m) => m.replace('reference', 'référence') },
  { pattern: /\bReferences?\b/g, replacement: (m) => m.replace('Reference', 'Référence') },
  { pattern: /\bmemoires?\b/g, replacement: (m) => m.replace('memoire', 'mémoire') },
  { pattern: /\bMemoires?\b/g, replacement: (m) => m.replace('Memoire', 'Mémoire') },
  { pattern: /\brepertoires?\b/g, replacement: (m) => m.replace('repertoire', 'répertoire') },
  { pattern: /\bRepertoires?\b/g, replacement: (m) => m.replace('Repertoire', 'Répertoire') },
  { pattern: /\bevenements?\b/g, replacement: (m) => m.replace('evenement', 'événement') },
  { pattern: /\bEvenements?\b/g, replacement: (m) => m.replace('Evenement', 'Événement') },
  { pattern: /\belements?\b/g, replacement: (m) => m.replace('element', 'élément') },
  { pattern: /\bElements?\b/g, replacement: (m) => m.replace('Element', 'Élément') },
  { pattern: /\bspecificites?\b/g, replacement: (m) => m.replace('specificite', 'spécificité') },
  { pattern: /\bproprietes?\b/g, replacement: (m) => m.replace('propriete', 'propriété') },
  { pattern: /\bProprietes?\b/g, replacement: (m) => m.replace('Propriete', 'Propriété') },
  { pattern: /\bbibliotheques?\b/g, replacement: (m) => m.replace('bibliotheque', 'bibliothèque') },
  { pattern: /\bBibliotheques?\b/g, replacement: (m) => m.replace('Bibliotheque', 'Bibliothèque') },
  { pattern: /\bstrategies?\b/g, replacement: (m) => m.replace('strategie', 'stratégie') },
  { pattern: /\bStrategies?\b/g, replacement: (m) => m.replace('Strategie', 'Stratégie') },
  { pattern: /\bcategories?\b/g, replacement: (m) => m.replace('categorie', 'catégorie') },
  { pattern: /\bCategories?\b/g, replacement: (m) => m.replace('Categorie', 'Catégorie') },
  { pattern: /\bdebutants?\b/g, replacement: (m) => m.replace('debutant', 'débutant') },
  { pattern: /\bDebutants?\b/g, replacement: (m) => m.replace('Debutant', 'Débutant') },
  { pattern: /\bresultats?\b/g, replacement: (m) => m.replace('resultat', 'résultat') },
  { pattern: /\bResultats?\b/g, replacement: (m) => m.replace('Resultat', 'Résultat') },
  { pattern: /\bfonctionnalites?\b/g, replacement: (m) => m.replace('fonctionnalite', 'fonctionnalité') },
  { pattern: /\bFonctionnalites?\b/g, replacement: (m) => m.replace('Fonctionnalite', 'Fonctionnalité') },
  { pattern: /\bverite\b/g, replacement: 'vérité' },
  { pattern: /\bintegrite\b/g, replacement: 'intégrité' },
  { pattern: /\bIntegrite\b/g, replacement: 'Intégrité' },
  { pattern: /\bheritage\b/g, replacement: 'héritage' },
  { pattern: /\bHeritage\b/g, replacement: 'Héritage' },
  { pattern: /\biterations?\b/g, replacement: (m) => m.replace('iteration', 'itération') },
  { pattern: /\bIterations?\b/g, replacement: (m) => m.replace('Iteration', 'Itération') },
  { pattern: /\boperations?\b/g, replacement: (m) => m.replace('operation', 'opération') },
  { pattern: /\bOperations?\b/g, replacement: (m) => m.replace('Operation', 'Opération') },
  { pattern: /\bcles?\b/g, replacement: (m) => m.replace('cle', 'clé') },
  { pattern: /\bCles?\b/g, replacement: (m) => m.replace('Cle', 'Clé') },
  { pattern: /\bacces\b/g, replacement: 'accès' },
  { pattern: /\bAcces\b/g, replacement: 'Accès' },
  { pattern: /\bdetails?\b/g, replacement: (m) => m.replace('detail', 'détail') },
  { pattern: /(?<!Problem )\bDetails?\b/g, replacement: (m) => m.replace('Detail', 'Détail') },
  { pattern: /\bcommunautes?\b/g, replacement: (m) => m.replace('communaute', 'communauté') },
  { pattern: /\bdeveloppements?\b/g, replacement: (m) => m.replace('developpement', 'développement') },
  { pattern: /\bDeveloppements?\b/g, replacement: (m) => m.replace('Developpement', 'Développement') },
  { pattern: /\bcapacites?\b/g, replacement: (m) => m.replace('capacite', 'capacité') },
  { pattern: /\bconsequences?\b/g, replacement: (m) => m.replace('consequence', 'conséquence') },
  { pattern: /\bConsequences?\b/g, replacement: (m) => m.replace('Consequence', 'Conséquence') },
  { pattern: /\bdependances?\b/g, replacement: (m) => m.replace('dependance', 'dépendance') },
  { pattern: /\bDependances?\b/g, replacement: (m) => m.replace('Dependance', 'Dépendance') },
  { pattern: /\bcomplexite\b/g, replacement: 'complexité' },
  { pattern: /\bqualites?\b/g, replacement: (m) => m.replace('qualite', 'qualité') },
  { pattern: /\bstabilite\b/g, replacement: 'stabilité' },
  { pattern: /\bnumeros?\b/g, replacement: (m) => m.replace('numero', 'numéro') },
  { pattern: /\bNumeros?\b/g, replacement: (m) => m.replace('Numero', 'Numéro') },
  { pattern: /\bvisibilite\b/g, replacement: 'visibilité' },
  { pattern: /\bcompatibilite\b/g, replacement: 'compatibilité' },
  { pattern: /\bdisponibilite\b/g, replacement: 'disponibilité' },
  { pattern: /\bflexibilite\b/g, replacement: 'flexibilité' },
  { pattern: /\bfiabilite\b/g, replacement: 'fiabilité' },
  { pattern: /\bentites?\b/g, replacement: (m) => m.replace('entite', 'entité') },
  { pattern: /\bEntites?\b/g, replacement: (m) => m.replace('Entite', 'Entité') },
  { pattern: /\bsucces\b/g, replacement: 'succès' },
  { pattern: /\bSucces\b/g, replacement: 'Succès' },
  { pattern: /\bpieces?\b/g, replacement: (m) => m.replace('piece', 'pièce') },
  { pattern: /\bPieces?\b/g, replacement: (m) => m.replace('Piece', 'Pièce') },
  { pattern: /\bfenetres?\b/g, replacement: (m) => m.replace('fenetre', 'fenêtre') },
  { pattern: /\bFenetres?\b/g, replacement: (m) => m.replace('Fenetre', 'Fenêtre') },
  { pattern: /\bcaracteres?\b/g, replacement: (m) => m.replace('caractere', 'caractère') },
  { pattern: /\bCaracteres?\b/g, replacement: (m) => m.replace('Caractere', 'Caractère') },
  { pattern: /\bmodeles?\b/g, replacement: (m) => m.replace('modele', 'modèle') },
  { pattern: /\bModeles?\b/g, replacement: (m) => m.replace('Modele', 'Modèle') },
  { pattern: /\bregles?\b/g, replacement: (m) => m.replace('regle', 'règle') },
  { pattern: /\bRegles?\b/g, replacement: (m) => m.replace('Regle', 'Règle') },
  { pattern: /\brequetes?\b/g, replacement: (m) => m.replace('requete', 'requête') },
  { pattern: /\bRequetes?\b/g, replacement: (m) => m.replace('Requete', 'Requête') },
  { pattern: /\breponses?\b/g, replacement: (m) => m.replace('reponse', 'réponse') },
  { pattern: /\bReponses?\b/g, replacement: (m) => m.replace('Reponse', 'Réponse') },
  { pattern: /\bemetteurs?\b/g, replacement: (m) => m.replace('emetteur', 'émetteur') },
  { pattern: /\bEmetteurs?\b/g, replacement: (m) => m.replace('Emetteur', 'Émetteur') },
  { pattern: /\brecepteurs?\b/g, replacement: (m) => m.replace('recepteur', 'récepteur') },
  { pattern: /\binterets?\b/g, replacement: (m) => m.replace('interet', 'intérêt') },
  { pattern: /\bInterets?\b/g, replacement: (m) => m.replace('Interet', 'Intérêt') },
  { pattern: /\bfrequences?\b/g, replacement: (m) => m.replace('frequence', 'fréquence') },
  { pattern: /\bFrequences?\b/g, replacement: (m) => m.replace('Frequence', 'Fréquence') },
  { pattern: /\bsequences?\b/g, replacement: (m) => m.replace('sequence', 'séquence') },
  { pattern: /\bSequences?\b/g, replacement: (m) => m.replace('Sequence', 'Séquence') },
  { pattern: /\btolerances?\b/g, replacement: (m) => m.replace('tolerance', 'tolérance') },
  { pattern: /\bcoherences?\b/g, replacement: (m) => m.replace('coherence', 'cohérence') },
  { pattern: /\bCoherences?\b/g, replacement: (m) => m.replace('Coherence', 'Cohérence') },
  { pattern: /\bindependances?\b/g, replacement: (m) => m.replace('independance', 'indépendance') },
  { pattern: /\bdemarrage\b/g, replacement: 'démarrage' },
  { pattern: /\bDemarrage\b/g, replacement: 'Démarrage' },
  { pattern: /\bdecoupage\b/g, replacement: 'découpage' },
  { pattern: /\bdecouplage\b/g, replacement: 'découplage' },
  // Noms féminins (toujours sans ambiguïté)
  { pattern: /\bdonnees\b/g, replacement: 'données' },
  { pattern: /\bDonnees\b/g, replacement: 'Données' },
  { pattern: /\bentrees?\b/g, replacement: (m) => m.replace('entree', 'entrée') },
  { pattern: /\bEntrees?\b/g, replacement: (m) => m.replace('Entree', 'Entrée') },
  { pattern: /\bportees?\b/g, replacement: (m) => m.replace('portee', 'portée') },
  { pattern: /\bidees?\b/g, replacement: (m) => m.replace('idee', 'idée') },
  { pattern: /\bIdees?\b/g, replacement: (m) => m.replace('Idee', 'Idée') },
  { pattern: /\barrivees?\b/g, replacement: (m) => m.replace('arrivee', 'arrivée') },
  { pattern: /\bdurees?\b/g, replacement: (m) => m.replace('duree', 'durée') },
  { pattern: /\bDurees?\b/g, replacement: (m) => m.replace('Duree', 'Durée') },
  // Participes féminins (toujours sans ambiguïté)
  { pattern: /\bcreees?\b/g, replacement: (m) => m.replace('creee', 'créée') },
  { pattern: /\bgenerees?\b/g, replacement: (m) => m.replace('generee', 'générée') },
  { pattern: /\bexecutees?\b/g, replacement: (m) => m.replace('executee', 'exécutée') },
  { pattern: /\beffectuees?\b/g, replacement: (m) => m.replace('effectuee', 'effectuée') },
  { pattern: /\bappelees?\b/g, replacement: (m) => m.replace('appelee', 'appelée') },

  // Groupe 2 - Adjectifs
  { pattern: /\bnecessaires?\b/g, replacement: (m) => m.replace('necessaire', 'nécessaire') },
  { pattern: /\bNecessaires?\b/g, replacement: (m) => m.replace('Necessaire', 'Nécessaire') },
  { pattern: /\bspecifiques?\b/g, replacement: (m) => m.replace('specifique', 'spécifique') },
  { pattern: /\bSpecifiques?\b/g, replacement: (m) => m.replace('Specifique', 'Spécifique') },
  { pattern: /\bdifferente?s?\b/g, replacement: (m) => m.replace('differen', 'différen') },
  { pattern: /\bDifferente?s?\b/g, replacement: (m) => m.replace('Differen', 'Différen') },
  { pattern: /\bprecedente?s?\b/g, replacement: (m) => m.replace('preceden', 'précéden') },
  { pattern: /\bPrecedente?s?\b/g, replacement: (m) => m.replace('Preceden', 'Précéden') },
  { pattern: /\bgenerale?s?\b/g, replacement: (m) => m.replace('general', 'général') },
  { pattern: /\bGenerale?s?\b/g, replacement: (m) => m.replace('General', 'Général') },
  { pattern: /\bpremieres?\b/g, replacement: (m) => m.replace('premiere', 'première') },
  { pattern: /\bPremieres?\b/g, replacement: (m) => m.replace('Premiere', 'Première') },
  { pattern: /\bdernieres?\b/g, replacement: (m) => m.replace('derniere', 'dernière') },
  { pattern: /\bDernieres?\b/g, replacement: (m) => m.replace('Derniere', 'Dernière') },
  { pattern: /\bparticulieres?\b/g, replacement: (m) => m.replace('particuliere', 'particulière') },
  { pattern: /\bentieres?\b/g, replacement: (m) => m.replace('entiere', 'entière') },
  { pattern: /\bcompletes\b/g, replacement: 'complètes' },
  { pattern: /\bconcretes\b/g, replacement: 'concrètes' },
  { pattern: /\bindependante?s?\b/g, replacement: (m) => m.replace('independan', 'indépendan') },
  { pattern: /\bIndependante?s?\b/g, replacement: (m) => m.replace('Independan', 'Indépendan') },
  { pattern: /\bsupplementaires?\b/g, replacement: (m) => m.replace('supplementaire', 'supplémentaire') },
  { pattern: /\bintermediaires?\b/g, replacement: (m) => m.replace('intermediaire', 'intermédiaire') },
  { pattern: /\bIntermediaires?\b/g, replacement: (m) => m.replace('Intermediaire', 'Intermédiaire') },
  { pattern: /\bnumeriques?\b/g, replacement: (m) => m.replace('numerique', 'numérique') },
  { pattern: /\bNumeriques?\b/g, replacement: (m) => m.replace('Numerique', 'Numérique') },
  { pattern: /\bgeneriques?\b/g, replacement: (m) => m.replace('generique', 'générique') },
  { pattern: /\bregulieres?\b/g, replacement: (m) => m.replace('reguliere', 'régulière') },
  { pattern: /\breguliers?\b/g, replacement: (m) => m.replace('regulier', 'régulier') },
  { pattern: /\belementaires?\b/g, replacement: (m) => m.replace('elementaire', 'élémentaire') },
  // Formes féminines/plurielles de participes (toujours sans ambiguïté)
  { pattern: /\bseparees?\b/g, replacement: (m) => m.replace('separee', 'séparée') },
  { pattern: /\bintegrees?\b/g, replacement: (m) => m.replace('integree', 'intégrée') },
  { pattern: /\bdediees?\b/g, replacement: (m) => m.replace('dediee', 'dédiée') },
  { pattern: /\bdetaillees?\b/g, replacement: (m) => m.replace('detaillee', 'détaillée') },

  // Groupe 3 - Verbes : uniquement les formes sans ambiguïté
  // Infinitifs (toujours sûrs)
  { pattern: /\bcreer\b/g, replacement: 'créer' },
  { pattern: /\bCreer\b/g, replacement: 'Créer' },
  { pattern: /\bgenerer\b/g, replacement: 'générer' },
  { pattern: /\bexecuter\b/g, replacement: 'exécuter' },
  { pattern: /\bverifier\b/g, replacement: 'vérifier' },
  { pattern: /\bdetecter\b/g, replacement: 'détecter' },
  { pattern: /\bdeployer\b/g, replacement: 'déployer' },
  { pattern: /\becrire\b/g, replacement: 'écrire' },
  { pattern: /\bdefinir\b/g, replacement: 'définir' },
  { pattern: /\brecuperer\b/g, replacement: 'récupérer' },
  { pattern: /\bRecuperer\b/g, replacement: 'Récupérer' },
  { pattern: /\brepresenter\b/g, replacement: 'représenter' },
  { pattern: /\bdeclarer\b/g, replacement: 'déclarer' },
  { pattern: /\bseparer\b/g, replacement: 'séparer' },
  { pattern: /\bintegrer\b/g, replacement: 'intégrer' },
  { pattern: /\bdedier\b/g, replacement: 'dédier' },
  // Noms dérivés de verbes (toujours sûrs)
  { pattern: /\bverification\b/g, replacement: 'vérification' },
  { pattern: /\bVerification\b/g, replacement: 'Vérification' },
  { pattern: /\bexecution\b/g, replacement: 'exécution' },
  { pattern: /\bExecution\b/g, replacement: 'Exécution' },
  { pattern: /\bcreation\b/g, replacement: 'création' },
  { pattern: /\bCreation\b/g, replacement: 'Création' },
  { pattern: /\bdeclaration\b/g, replacement: 'déclaration' },
  { pattern: /\bDeclaration\b/g, replacement: 'Déclaration' },
  { pattern: /\bgeneration\b/g, replacement: 'génération' },
  { pattern: /\bGeneration\b/g, replacement: 'Génération' },
  { pattern: /\brecuperation\b/g, replacement: 'récupération' },
  // Formes toujours accentuées (le radical porte l'accent)
  { pattern: /\becrits?\b/g, replacement: (m) => m.replace('ecrit', 'écrit') },
  { pattern: /\bEcrits?\b/g, replacement: (m) => m.replace('Ecrit', 'Écrit') },
  { pattern: /\bdefinis?\b/g, replacement: (m) => m.replace('defini', 'défini') },
  { pattern: /\bDefinis?\b/g, replacement: (m) => m.replace('Defini', 'Défini') },
  { pattern: /\bconnaitre\b/g, replacement: 'connaître' },
  { pattern: /\bConnaitre\b/g, replacement: 'Connaître' },
  { pattern: /\breconnaitre\b/g, replacement: 'reconnaître' },
  { pattern: /\bapparaitre\b/g, replacement: 'apparaître' },
  { pattern: /\bdisparaitre\b/g, replacement: 'disparaître' },
  { pattern: /\bposseder\b/g, replacement: 'posséder' },
  { pattern: /\bconsiderer\b/g, replacement: 'considérer' },
  { pattern: /\bpreferer\b/g, replacement: 'préférer' },
  { pattern: /\brepeter\b/g, replacement: 'répéter' },
  { pattern: /\bempecher\b/g, replacement: 'empêcher' },
  { pattern: /\bdeleguer\b/g, replacement: 'déléguer' },
  { pattern: /\bdeclencher\b/g, replacement: 'déclencher' },
  { pattern: /\bdesigner\b/g, replacement: 'désigner' },
  { pattern: /\binterpreter\b/g, replacement: 'interpréter' },
  { pattern: /\bproteger\b/g, replacement: 'protéger' },
  { pattern: /\bretablir\b/g, replacement: 'rétablir' },
  // Formes verbales avec radical accentué (3e personne - toujours besoin de l'accent radical)
  { pattern: /\bdefinit\b/g, replacement: 'définit' },
  { pattern: /\bDefinit\b/g, replacement: 'Définit' },
  { pattern: /\bdecide\b/g, replacement: 'décide' },
  { pattern: /\bpossede\b/g, replacement: 'possède' },
  { pattern: /\bgere\b/g, replacement: 'gère' },
  { pattern: /\bGere\b/g, replacement: 'Gère' },
  { pattern: /\bempeche\b/g, replacement: 'empêche' },
  { pattern: /\bdeclenche\b/g, replacement: 'déclenche' },
  { pattern: /\bdesigne\b/g, replacement: 'désigne' },
  { pattern: /\brecupere\b/g, replacement: 'récupère' },
  { pattern: /\brepresente\b/g, replacement: 'représente' },
  // Note: "modifie", "configure", "genere", "execute", "verifie", "detecte"
  // sont EXCLUS car ambigus (présent valide sans accent vs participe passé avec accent)

  // Groupe 4 - Adverbes/prépositions
  { pattern: /\bapres\b/g, replacement: 'après' },
  { pattern: /\bApres\b/g, replacement: 'Après' },
  { pattern: /\bgeneralement\b/g, replacement: 'généralement' },
  { pattern: /\bimmediatement\b/g, replacement: 'immédiatement' },
  { pattern: /\bentierement\b/g, replacement: 'entièrement' },
  { pattern: /\bprecisement\b/g, replacement: 'précisément' },
  { pattern: /\bdeja\b/g, replacement: 'déjà' },
  { pattern: /\bDeja\b/g, replacement: 'Déjà' },
  { pattern: /\bfrequemment\b/g, replacement: 'fréquemment' },
  { pattern: /\bprecedemment\b/g, replacement: 'précédemment' },
  { pattern: /\beventuellement\b/g, replacement: 'éventuellement' },
  { pattern: /\bEventuellement\b/g, replacement: 'Éventuellement' },

  // Groupe 5 - Cas spéciaux
  { pattern: /\bnoeuds?\b/g, replacement: (m) => m.replace('noeud', 'nœud') },
  { pattern: /\bNoeuds?\b/g, replacement: (m) => m.replace('Noeud', 'Nœud') },
  { pattern: /\bpredefinis?\b/g, replacement: (m) => m.replace('predefini', 'prédéfini') },
  { pattern: /\bPredefinis?\b/g, replacement: (m) => m.replace('Predefini', 'Prédéfini') },
  // Mots commençant par é- (très fréquents)
  { pattern: /\betats?\b/g, replacement: (m) => m.replace('etat', 'état') },
  { pattern: /\bEtats?\b/g, replacement: (m) => m.replace('Etat', 'État') },
  { pattern: /\bechanges?\b/g, replacement: (m) => m.replace('echange', 'échange') },
  { pattern: /\bEchanges?\b/g, replacement: (m) => m.replace('Echange', 'Échange') },
  { pattern: /\betait\b/g, replacement: 'était' },
  { pattern: /\betant\b/g, replacement: 'étant' },
  { pattern: /\beconomiques?\b/g, replacement: (m) => m.replace('economique', 'économique') },
  { pattern: /\bEconomiques?\b/g, replacement: (m) => m.replace('Economique', 'Économique') },
  { pattern: /\beconomies?\b/g, replacement: (m) => m.replace('economie', 'économie') },
  { pattern: /\bevolutions?\b/g, replacement: (m) => m.replace('evolution', 'évolution') },
  { pattern: /\bEvolutions?\b/g, replacement: (m) => m.replace('Evolution', 'Évolution') },
  { pattern: /\bechecs?\b/g, replacement: (m) => m.replace('echec', 'échec') },
  { pattern: /\bEchecs?\b/g, replacement: (m) => m.replace('Echec', 'Échec') },
  { pattern: /\bepoques?\b/g, replacement: (m) => m.replace('epoque', 'époque') },
  { pattern: /\bequipes?\b/g, replacement: (m) => m.replace('equipe', 'équipe') },
  { pattern: /\bEquipes?\b/g, replacement: (m) => m.replace('Equipe', 'Équipe') },
  { pattern: /\bequivalente?s?\b/g, replacement: (m) => m.replace('equivalen', 'équivalen') },
  { pattern: /\becrans?\b/g, replacement: (m) => m.replace('ecran', 'écran') },
  { pattern: /\becarts?\b/g, replacement: (m) => m.replace('ecart', 'écart') },
  { pattern: /\benumerations?\b/g, replacement: (m) => m.replace('enumeration', 'énumération') },
  { pattern: /\bequilibres?\b/g, replacement: (m) => m.replace('equilibre', 'équilibre') },
  { pattern: /\bechantillons?\b/g, replacement: (m) => m.replace('echantillon', 'échantillon') },
  { pattern: /\beditions?\b/g, replacement: (m) => m.replace('edition', 'édition') },
  { pattern: /\bEditions?\b/g, replacement: (m) => m.replace('Edition', 'Édition') },
  { pattern: /\begalites?\b/g, replacement: (m) => m.replace('egalite', 'égalité') },
  { pattern: /\begalement\b/g, replacement: 'également' },
  { pattern: /\bEgalement\b/g, replacement: 'Également' },
  // Autres noms/adjectifs manquants fréquents
  { pattern: /\bprecis\b/g, replacement: 'précis' },
  { pattern: /\bprecises\b/g, replacement: 'précises' },
  { pattern: /\bprecision\b/g, replacement: 'précision' },
  { pattern: /\bPrecis\b/g, replacement: 'Précis' },
  { pattern: /\bprecautions?\b/g, replacement: (m) => m.replace('precaution', 'précaution') },
  { pattern: /\bmethodologies?\b/g, replacement: (m) => m.replace('methodologie', 'méthodologie') },
  { pattern: /\bserieux\b/g, replacement: 'sérieux' },
  { pattern: /\bserieuses?\b/g, replacement: (m) => m.replace('serieuse', 'sérieuse') },
  { pattern: /\bmefiance\b/g, replacement: 'méfiance' },
  { pattern: /\bmateriaux\b/g, replacement: 'matériaux' },
  { pattern: /\bdefauts?\b/g, replacement: (m) => m.replace('defaut', 'défaut') },
  { pattern: /\bDefauts?\b/g, replacement: (m) => m.replace('Defaut', 'Défaut') },
  { pattern: /\bobsoletes?\b/g, replacement: (m) => m.replace('obsolete', 'obsolète') },
  { pattern: /\breduite?s?\b/g, replacement: (m) => m.replace('reduit', 'réduit') },
  { pattern: /\belargies?\b/g, replacement: (m) => m.replace('elargi', 'élargi') },
  // Infinitifs supplémentaires
  { pattern: /\breveler\b/g, replacement: 'révéler' },
  { pattern: /\bevoluer\b/g, replacement: 'évoluer' },
  { pattern: /\bevaluer\b/g, replacement: 'évaluer' },
  { pattern: /\betablir\b/g, replacement: 'établir' },
  { pattern: /\bpreciser\b/g, replacement: 'préciser' },
  // Formes verbales avec radical accentué
  { pattern: /\bdecrits?\b/g, replacement: (m) => m.replace('decrit', 'décrit') },
  { pattern: /\bDecrits?\b/g, replacement: (m) => m.replace('Decrit', 'Décrit') },
  // "où" seulement dans des phrases spécifiques
  { pattern: /\bla ou\b/g, replacement: 'là où' },
  { pattern: /\bcas ou\b/g, replacement: 'cas où' },
  { pattern: /\bmoment ou\b/g, replacement: 'moment où' },
  { pattern: /\bendroit ou\b/g, replacement: 'endroit où' },

  // ========== Nouvelles règles (vague 2) ==========

  // Groupe 6 - "être" (n'existe pas sans accent en français)
  { pattern: /\betre\b/g, replacement: 'être' },
  { pattern: /\bEtre\b/g, replacement: 'Être' },

  // Groupe 7 - Comparatifs/superlatifs
  { pattern: /\bsuperieure?s?\b/g, replacement: (m) => m.replace('superieur', 'supérieur') },
  { pattern: /\bSuperieure?s?\b/g, replacement: (m) => m.replace('Superieur', 'Supérieur') },
  { pattern: /\binferieure?s?\b/g, replacement: (m) => m.replace('inferieur', 'inférieur') },
  { pattern: /\bInferieure?s?\b/g, replacement: (m) => m.replace('Inferieur', 'Inférieur') },

  // Groupe 8 - Participes féminins/pluriels manquants
  { pattern: /\blimitees?\b/g, replacement: (m) => m.replace('limitee', 'limitée') },
  { pattern: /\bLimitees?\b/g, replacement: (m) => m.replace('Limitee', 'Limitée') },
  { pattern: /\bconsiderees?\b/g, replacement: (m) => m.replace('consideree', 'considérée') },
  { pattern: /\bConsiderees?\b/g, replacement: (m) => m.replace('Consideree', 'Considérée') },
  { pattern: /\bdeposees?\b/g, replacement: (m) => m.replace('deposee', 'déposée') },
  { pattern: /\bDeposees?\b/g, replacement: (m) => m.replace('Deposee', 'Déposée') },
  { pattern: /\bprevues?\b/g, replacement: (m) => m.replace('prevue', 'prévue') },
  { pattern: /\bprevus?\b/g, replacement: (m) => m.replace('prevu', 'prévu') },
  { pattern: /\bPrevues?\b/g, replacement: (m) => m.replace('Prevue', 'Prévue') },
  { pattern: /\belevees?\b/g, replacement: (m) => m.replace('elevee', 'élevée') },
  { pattern: /\bElevees?\b/g, replacement: (m) => m.replace('Elevee', 'Élevée') },
  { pattern: /\bexagerees?\b/g, replacement: (m) => m.replace('exageree', 'exagérée') },
  { pattern: /\baveres?\b/g, replacement: (m) => m.replace('avere', 'avéré') },
  { pattern: /\baverer\b/g, replacement: 'avérer' },
  { pattern: /\bdecentralisees?\b/g, replacement: (m) => m.replace('decentralisee', 'décentralisée') },
  { pattern: /\bsecurisees?\b/g, replacement: (m) => m.replace('securisee', 'sécurisée') },
  { pattern: /\bregulees?\b/g, replacement: (m) => m.replace('regulee', 'régulée') },

  // Groupe 9 - Participe masculin "créé" (n'existe pas sans accent)
  { pattern: /\bcree\b/g, replacement: 'créé' },
  { pattern: /\bCree\b/g, replacement: 'Créé' },
  { pattern: /\bcrees\b/g, replacement: 'créés' },

  // Groupe 10 - Noms manquants
  { pattern: /\bidentites?\b/g, replacement: (m) => m.replace('identite', 'identité') },
  { pattern: /\bIdentites?\b/g, replacement: (m) => m.replace('Identite', 'Identité') },
  { pattern: /\bspeculations?\b/g, replacement: (m) => m.replace('speculation', 'spéculation') },
  { pattern: /\bSpeculations?\b/g, replacement: (m) => m.replace('Speculation', 'Spéculation') },
  { pattern: /\bregulations?\b/g, replacement: (m) => m.replace('regulation', 'régulation') },
  { pattern: /\bRegulations?\b/g, replacement: (m) => m.replace('Regulation', 'Régulation') },
  { pattern: /\bregulateurs?\b/g, replacement: (m) => m.replace('regulateur', 'régulateur') },
  { pattern: /\bRegulateurs?\b/g, replacement: (m) => m.replace('Regulateur', 'Régulateur') },
  { pattern: /\breglementations?\b/g, replacement: (m) => m.replace('reglementation', 'réglementation') },
  { pattern: /\bReglementations?\b/g, replacement: (m) => m.replace('Reglementation', 'Réglementation') },
  { pattern: /\bdecentralisations?\b/g, replacement: (m) => m.replace('decentralisation', 'décentralisation') },
  { pattern: /\bDecentralisations?\b/g, replacement: (m) => m.replace('Decentralisation', 'Décentralisation') },
  { pattern: /\blecons?\b/g, replacement: (m) => m.replace('lecon', 'leçon') },
  { pattern: /\bLecons?\b/g, replacement: (m) => m.replace('Lecon', 'Leçon') },
  { pattern: /\bsocietes?\b/g, replacement: (m) => m.replace('societe', 'société') },
  { pattern: /\bSocietes?\b/g, replacement: (m) => m.replace('Societe', 'Société') },
  { pattern: /\bdesaccords?\b/g, replacement: (m) => m.replace('desaccord', 'désaccord') },
  { pattern: /\brarete\b/g, replacement: 'rareté' },
  { pattern: /\bRarete\b/g, replacement: 'Rareté' },
  { pattern: /\bfiscalite\b/g, replacement: 'fiscalité' },
  { pattern: /\bvolatilite\b/g, replacement: 'volatilité' },
  { pattern: /\bscalabilite\b/g, replacement: 'scalabilité' },
  { pattern: /\binteroperabilite\b/g, replacement: 'interopérabilité' },
  { pattern: /\bmaturite\b/g, replacement: 'maturité' },
  { pattern: /\bliquidites?\b/g, replacement: (m) => m.replace('liquidite', 'liquidité') },
  { pattern: /\bLiquidites?\b/g, replacement: (m) => m.replace('Liquidite', 'Liquidité') },
  { pattern: /\blegitimite\b/g, replacement: 'légitimité' },
  { pattern: /\bperennite\b/g, replacement: 'pérennité' },
  { pattern: /\brentabilite\b/g, replacement: 'rentabilité' },
  { pattern: /\bcredibilite\b/g, replacement: 'crédibilité' },
  { pattern: /\bquantites?\b/g, replacement: (m) => m.replace('quantite', 'quantité') },
  { pattern: /\bQuantites?\b/g, replacement: (m) => m.replace('Quantite', 'Quantité') },
  { pattern: /\billimitees?\b/g, replacement: (m) => m.replace('illimitee', 'illimitée') },
  { pattern: /\bactivites?\b/g, replacement: (m) => m.replace('activite', 'activité') },
  { pattern: /\bActivites?\b/g, replacement: (m) => m.replace('Activite', 'Activité') },
  { pattern: /\bproprietaires?\b/g, replacement: (m) => m.replace('proprietaire', 'propriétaire') },
  { pattern: /\bProprietaires?\b/g, replacement: (m) => m.replace('Proprietaire', 'Propriétaire') },
  { pattern: /\bvalidite\b/g, replacement: 'validité' },
  { pattern: /\bnotoriete\b/g, replacement: 'notoriété' },
  { pattern: /\bpopularite\b/g, replacement: 'popularité' },
  { pattern: /\bintegralite\b/g, replacement: 'intégralité' },
  { pattern: /\btotalite\b/g, replacement: 'totalité' },
  { pattern: /\bcelebres?\b/g, replacement: (m) => m.replace('celebre', 'célèbre') },
  { pattern: /\bCelebres?\b/g, replacement: (m) => m.replace('Celebre', 'Célèbre') },
  { pattern: /\bmajoritaires?\b/g, replacement: (m) => m.replace('majoritaire', 'majoritaire') },
  { pattern: /\bminoritaires?\b/g, replacement: (m) => m.replace('minoritaire', 'minoritaire') },
  { pattern: /\bpriorites?\b/g, replacement: (m) => m.replace('priorite', 'priorité') },
  { pattern: /\bPriorites?\b/g, replacement: (m) => m.replace('Priorite', 'Priorité') },
  { pattern: /\bseverites?\b/g, replacement: (m) => m.replace('severite', 'sévérité') },

  // Groupe 11 - Adjectifs manquants
  { pattern: /\breelles?\b/g, replacement: (m) => m.replace('reelle', 'réelle') },
  { pattern: /\bReelles?\b/g, replacement: (m) => m.replace('Reelle', 'Réelle') },
  { pattern: /\breels?\b/g, replacement: (m) => m.replace('reel', 'réel') },
  { pattern: /\bReels?\b/g, replacement: (m) => m.replace('Reel', 'Réel') },
  { pattern: /\brealistes?\b/g, replacement: (m) => m.replace('realiste', 'réaliste') },
  { pattern: /\bRealistes?\b/g, replacement: (m) => m.replace('Realiste', 'Réaliste') },
  { pattern: /\benormes?\b/g, replacement: (m) => m.replace('enorme', 'énorme') },
  { pattern: /\bEnormes?\b/g, replacement: (m) => m.replace('Enorme', 'Énorme') },
  { pattern: /\bspeculatifs?\b/g, replacement: (m) => m.replace('speculatif', 'spéculatif') },
  // Exception : "speculative decoding" / "speculative sampling" sont des termes techniques anglais (LLM), ne pas accentuer
  { pattern: /\bspeculatives?\b(?! (?:decoding|sampling))/g, replacement: (m) => m.replace('speculative', 'spéculative') },
  { pattern: /\beleves?\b/g, replacement: (m) => m.replace('eleve', 'élevé') },
  { pattern: /\bEleves?\b/g, replacement: (m) => m.replace('Eleve', 'Élevé') },
  { pattern: /\breglementaires?\b/g, replacement: (m) => m.replace('reglementaire', 'réglementaire') },

  // Groupe 12 - Verbes manquants (infinitifs sûrs)
  { pattern: /\bdeposer\b/g, replacement: 'déposer' },
  { pattern: /\bexagerer\b/g, replacement: 'exagérer' },
  { pattern: /\bpretendre\b/g, replacement: 'prétendre' },
  { pattern: /\bdeterminer\b/g, replacement: 'déterminer' },
  { pattern: /\bDeterminer\b/g, replacement: 'Déterminer' },
  { pattern: /\breguler\b/g, replacement: 'réguler' },
  { pattern: /\bdecentraliser\b/g, replacement: 'décentraliser' },
  { pattern: /\bsecuriser\b/g, replacement: 'sécuriser' },
  { pattern: /\brelementer\b/g, replacement: 'réglementer' },
  // Formes conjuguées sûres (3e personne)
  { pattern: /\bpretend\b/g, replacement: 'prétend' },
  { pattern: /\bpretendent\b/g, replacement: 'prétendent' },
  { pattern: /\bdetermine\b/g, replacement: 'détermine' },

  // Groupe 13 - Adverbes manquants
  { pattern: /\bnecessairement\b/g, replacement: 'nécessairement' },
  { pattern: /\bforcement\b/g, replacement: 'forcément' },
  { pattern: /\benormement\b/g, replacement: 'énormément' },
  { pattern: /\bplutot\b/g, replacement: 'plutôt' },
  { pattern: /\bPlutot\b/g, replacement: 'Plutôt' },

  // Groupe 14 - Vague 3 (découverts par --discover)
  // Famille "coût" - lookbehind négatif pour ne jamais matcher dans "écoute".
  // Note: \b ne traite pas les chars accentués comme word chars en JS.
  // L'exclusion couvre é/É (forme précomposée U+00E9/U+00C9), le bare e/E
  // (cas "ecoute" sans accent), et U+0301 (accent aigu combinant, forme
  // décomposée NFD : E + U+0301). Sans U+0301, "Écoute" décomposé devenait
  // "Écoûte" car le lookbehind ne voyait que la marque combinante.
  { pattern: /\bcouts?\b/g, replacement: (m) => m.replace('cout', 'coût') },
  { pattern: /\bCouts?\b/g, replacement: (m) => m.replace('Cout', 'Coût') },
  { pattern: /(?<![éÉeÉ])couter\b/g, replacement: 'coûter' },
  { pattern: /(?<![éÉeÉ])couteux\b/g, replacement: 'coûteux' },
  { pattern: /(?<![éÉeÉ])couteuses?\b/g, replacement: (m) => m.replace('couteuse', 'coûteuse') },
  { pattern: /(?<![éÉeÉ])coute\b/g, replacement: 'coûte' },
  { pattern: /(?<![éÉeÉ])coutes\b/g, replacement: 'coûtes' },
  { pattern: /(?<![éÉeÉ])coutent\b/g, replacement: 'coûtent' },
  // Réparation des "écoute" déjà corrompus en "écoûte" par l'ancien lookbehind.
  { pattern: /Écoûte/g, replacement: 'Écoute' },
  { pattern: /écoûte/g, replacement: 'écoute' },
  { pattern: /Ecoûte/g, replacement: 'Ecoute' },
  { pattern: /ecoûte/g, replacement: 'ecoute' },
  // Famille "chaîne"
  { pattern: /\bchaines?\b/g, replacement: (m) => m.replace('chaine', 'chaîne') },
  { pattern: /\bChaines?\b/g, replacement: (m) => m.replace('Chaine', 'Chaîne') },
  // Participes féminins "privée"
  { pattern: /\bprivees?\b/g, replacement: (m) => m.replace('privee', 'privée') },
  { pattern: /\bPrivees?\b/g, replacement: (m) => m.replace('Privee', 'Privée') },
  // Noms courants
  { pattern: /\butilite\b/g, replacement: 'utilité' },
  { pattern: /\bUtilite\b/g, replacement: 'Utilité' },
  { pattern: /\bzero\b/g, replacement: 'zéro' },
  { pattern: /\bZero\b/g, replacement: 'Zéro' },
  { pattern: /\bmajorite\b/g, replacement: 'majorité' },
  { pattern: /\bMajorite\b/g, replacement: 'Majorité' },
  { pattern: /\bschemas?\b/g, replacement: (m) => m.replace('schema', 'schéma') },
  { pattern: /\bSchemas?\b/g, replacement: (m) => m.replace('Schema', 'Schéma') },
  { pattern: /\brealite\b/g, replacement: 'réalité' },
  { pattern: /\bRealite\b/g, replacement: 'Réalité' },
  { pattern: /\bdecisions?\b/g, replacement: (m) => m.replace('decision', 'décision') },
  { pattern: /\bDecisions?\b/g, replacement: (m) => m.replace('Decision', 'Décision') },
  { pattern: /\bdebats?\b/g, replacement: (m) => m.replace('debat', 'débat') },
  { pattern: /\bDebats?\b/g, replacement: (m) => m.replace('Debat', 'Débat') },
  { pattern: /\bannees?\b/g, replacement: (m) => m.replace('annee', 'année') },
  { pattern: /\bAnnees?\b/g, replacement: (m) => m.replace('Annee', 'Année') },
  { pattern: /\bdetenteurs?\b/g, replacement: (m) => m.replace('detenteur', 'détenteur') },
  { pattern: /\bDetenteurs?\b/g, replacement: (m) => m.replace('Detenteur', 'Détenteur') },
  { pattern: /\bcriteres?\b/g, replacement: (m) => m.replace('critere', 'critère') },
  { pattern: /\bCriteres?\b/g, replacement: (m) => m.replace('Critere', 'Critère') },
  { pattern: /\broles?\b/g, replacement: (m) => m.replace('role', 'rôle') },
  { pattern: /\bRoles?\b/g, replacement: (m) => m.replace('Role', 'Rôle') },
  { pattern: /\bmetriques?\b/g, replacement: (m) => m.replace('metrique', 'métrique') },
  { pattern: /\bMetriques?\b/g, replacement: (m) => m.replace('Metrique', 'Métrique') },
  { pattern: /\bunites?\b/g, replacement: (m) => m.replace('unite', 'unité') },
  { pattern: /\bUnites?\b/g, replacement: (m) => m.replace('Unite', 'Unité') },
  { pattern: /\bfacades?\b/g, replacement: (m) => m.replace('facade', 'façade') },
  { pattern: /\bFacades?\b/g, replacement: (m) => m.replace('Facade', 'Façade') },
  { pattern: /\bconfidentialite\b/g, replacement: 'confidentialité' },
  { pattern: /\bConfidentialite\b/g, replacement: 'Confidentialité' },
  { pattern: /\bdeveloppeurs?\b/g, replacement: (m) => m.replace('developpeur', 'développeur') },
  { pattern: /\bDeveloppeurs?\b/g, replacement: (m) => m.replace('Developpeur', 'Développeur') },
  { pattern: /\bfinancieres?\b/g, replacement: (m) => m.replace('financiere', 'financière') },
  { pattern: /\bFinancieres?\b/g, replacement: (m) => m.replace('Financiere', 'Financière') },
  { pattern: /\bapportees?\b/g, replacement: (m) => m.replace('apportee', 'apportée') },
  { pattern: /\bpredictions?\b/g, replacement: (m) => m.replace('prediction', 'prédiction') },
  { pattern: /\bPredictions?\b/g, replacement: (m) => m.replace('Prediction', 'Prédiction') },
  // "été" (n'existe pas sans accent)
  { pattern: /\bete\b/g, replacement: 'été' },
  // Verbes
  { pattern: /\bdecrire\b/g, replacement: 'décrire' },
  { pattern: /\bDepend\b/g, replacement: 'Dépend' },
  { pattern: /\bdepend\b/g, replacement: 'dépend' },
  { pattern: /\bdependent\b/g, replacement: 'dépendent' },
  { pattern: /\bdetient\b/g, replacement: 'détient' },
  { pattern: /\bdetiennent\b/g, replacement: 'détiennent' },
  { pattern: /\bechanger\b/g, replacement: 'échanger' },
  { pattern: /\barrete\b/g, replacement: 'arrête' },
  { pattern: /\barreter\b/g, replacement: 'arrêter' },
  // Noms/adjectifs supplémentaires
  { pattern: /\breserves?\b/g, replacement: (m) => m.replace('reserve', 'réserve') },
  { pattern: /\bReserves?\b/g, replacement: (m) => m.replace('Reserve', 'Réserve') },
  { pattern: /\bmonetaires?\b/g, replacement: (m) => m.replace('monetaire', 'monétaire') },
  { pattern: /\bMonetaires?\b/g, replacement: (m) => m.replace('Monetaire', 'Monétaire') },
  { pattern: /\btracabilite\b/g, replacement: 'traçabilité' },
  { pattern: /\bimmutabilite\b/g, replacement: 'immutabilité' },
  { pattern: /\bdecentralise\b/g, replacement: 'décentralisé' },
  { pattern: /\bDecentralise\b/g, replacement: 'Décentralisé' },
  { pattern: /\bsecurise\b/g, replacement: 'sécurisé' },
  { pattern: /\bSecurise\b/g, replacement: 'Sécurisé' },
  { pattern: /\bopacite\b/g, replacement: 'opacité' },

  // Groupe 15 - Vague 4 (découverts par --discover, top fréquence)
  { pattern: /\bdifficultes?\b/g, replacement: (m) => m.replace('difficulte', 'difficulté') },
  { pattern: /\bDifficultes?\b/g, replacement: (m) => m.replace('Difficulte', 'Difficulté') },
  { pattern: /\bamericaine?s?\b/g, replacement: (m) => m.replace('americain', 'américain') },
  { pattern: /\bAmericaine?s?\b/g, replacement: (m) => m.replace('Americain', 'Américain') },
  { pattern: /\bechelles?\b/g, replacement: (m) => m.replace('echelle', 'échelle') },
  { pattern: /\bEchelles?\b/g, replacement: (m) => m.replace('Echelle', 'Échelle') },
  { pattern: /\bmoderees?\b/g, replacement: (m) => m.replace('moderee', 'modérée') },
  { pattern: /\bmodere\b/g, replacement: 'modéré' },
  { pattern: /\bmoderes\b/g, replacement: 'modérés' },
  { pattern: /\bautorites?\b/g, replacement: (m) => m.replace('autorite', 'autorité') },
  { pattern: /\bAutorites?\b/g, replacement: (m) => m.replace('Autorite', 'Autorité') },
  { pattern: /\bmalgre\b/g, replacement: 'malgré' },
  { pattern: /\bMalgre\b/g, replacement: 'Malgré' },
  { pattern: /\bgraces?\b/g, replacement: (m) => m.replace('grace', 'grâce') },
  { pattern: /\bGraces?\b/g, replacement: (m) => m.replace('Grace', 'Grâce') },
  { pattern: /\bfinalite\b/g, replacement: 'finalité' },
  { pattern: /\becosystemes?\b/g, replacement: (m) => m.replace('ecosysteme', 'écosystème') },
  { pattern: /\bEcosystemes?\b/g, replacement: (m) => m.replace('Ecosysteme', 'Écosystème') },
  { pattern: /\butilisees?\b/g, replacement: (m) => m.replace('utilisee', 'utilisée') },
  { pattern: /\bUtilisees?\b/g, replacement: (m) => m.replace('Utilisee', 'Utilisée') },
  { pattern: /\bgerer\b/g, replacement: 'gérer' },
  { pattern: /\bGerer\b/g, replacement: 'Gérer' },
  { pattern: /\bacceder\b/g, replacement: 'accéder' },
  { pattern: /\bAcceder\b/g, replacement: 'Accéder' },
  { pattern: /\bdetections?\b/g, replacement: (m) => m.replace('detection', 'détection') },
  { pattern: /\bDetections?\b/g, replacement: (m) => m.replace('Detection', 'Détection') },
  { pattern: /\bexperiences?\b/g, replacement: (m) => m.replace('experience', 'expérience') },
  { pattern: /\bExperiences?\b/g, replacement: (m) => m.replace('Experience', 'Expérience') },
  { pattern: /\bextremement\b/g, replacement: 'extrêmement' },
  { pattern: /\bsymetriques?\b/g, replacement: (m) => m.replace('symetrique', 'symétrique') },
  { pattern: /\basymetriques?\b/g, replacement: (m) => m.replace('asymetrique', 'asymétrique') },
  { pattern: /\benregistrees?\b/g, replacement: (m) => m.replace('enregistree', 'enregistrée') },
  { pattern: /\bprobabilites?\b/g, replacement: (m) => m.replace('probabilite', 'probabilité') },
  { pattern: /\bProbabilites?\b/g, replacement: (m) => m.replace('Probabilite', 'Probabilité') },
  { pattern: /\bemissions?\b/g, replacement: (m) => m.replace('emission', 'émission') },
  { pattern: /\bEmissions?\b/g, replacement: (m) => m.replace('Emission', 'Émission') },
  { pattern: /\bpieges?\b/g, replacement: (m) => m.replace('piege', 'piège') },
  { pattern: /\bPieges?\b/g, replacement: (m) => m.replace('Piege', 'Piège') },
  { pattern: /\bselections?\b/g, replacement: (m) => m.replace('selection', 'sélection') },
  { pattern: /\bSelections?\b/g, replacement: (m) => m.replace('Selection', 'Sélection') },
  { pattern: /\btracage\b/g, replacement: 'traçage' },
  { pattern: /\bdecimale?s?\b/g, replacement: (m) => m.replace('decimal', 'décimal') },
  { pattern: /\binstantanes?\b/g, replacement: (m) => m.replace('instantane', 'instantané') },
  { pattern: /\baccessibilite\b/g, replacement: 'accessibilité' },
  { pattern: /\bdefaillances?\b/g, replacement: (m) => m.replace('defaillance', 'défaillance') },
  { pattern: /\bDefaillances?\b/g, replacement: (m) => m.replace('Defaillance', 'Défaillance') },
  { pattern: /\brecoit\b/g, replacement: 'reçoit' },
  { pattern: /\brecoivent\b/g, replacement: 'reçoivent' },
  { pattern: /\bextremes?\b/g, replacement: (m) => m.replace('extreme', 'extrême') },
  { pattern: /\bExtremes?\b/g, replacement: (m) => m.replace('Extreme', 'Extrême') },
  { pattern: /\blegitimes?\b/g, replacement: (m) => m.replace('legitime', 'légitime') },
  { pattern: /\bLegitimes?\b/g, replacement: (m) => m.replace('Legitime', 'Légitime') },
  { pattern: /\baout\b/g, replacement: 'août' },
  { pattern: /\bAout\b/g, replacement: 'Août' },
  { pattern: /\bfrancaise?s?\b/g, replacement: (m) => m.replace('francais', 'français') },
  { pattern: /\bFrancaise?s?\b/g, replacement: (m) => m.replace('Francais', 'Français') },
  { pattern: /\btresors?\b/g, replacement: (m) => m.replace('tresor', 'trésor') },
  { pattern: /\bTresors?\b/g, replacement: (m) => m.replace('Tresor', 'Trésor') },
  { pattern: /\bscenarios?\b/g, replacement: (m) => m.replace('scenario', 'scénario') },
  { pattern: /\bScenarios?\b/g, replacement: (m) => m.replace('Scenario', 'Scénario') },
  { pattern: /\bdelegations?\b/g, replacement: (m) => m.replace('delegation', 'délégation') },
  { pattern: /\bDelegations?\b/g, replacement: (m) => m.replace('Delegation', 'Délégation') },
  { pattern: /\bintegrations?\b/g, replacement: (m) => m.replace('integration', 'intégration') },
  { pattern: /\bIntegrations?\b/g, replacement: (m) => m.replace('Integration', 'Intégration') },
  { pattern: /\bprets?\b/g, replacement: (m) => m.replace('pret', 'prêt') },
  { pattern: /\bPrets?\b/g, replacement: (m) => m.replace('Pret', 'Prêt') },
  { pattern: /\bmathematiques?\b/g, replacement: (m) => m.replace('mathematique', 'mathématique') },
  { pattern: /\bMathematiques?\b/g, replacement: (m) => m.replace('Mathematique', 'Mathématique') },
  { pattern: /\beuropeenne?s?\b/g, replacement: (m) => m.replace('europeen', 'européen') },
  { pattern: /\bEuropeenne?s?\b/g, replacement: (m) => m.replace('Europeen', 'Européen') },
  { pattern: /\bprotegees?\b/g, replacement: (m) => m.replace('protegee', 'protégée') },
  { pattern: /\bseparees?\b/g, replacement: (m) => m.replace('separee', 'séparée') },
  { pattern: /\bpreservees?\b/g, replacement: (m) => m.replace('preservee', 'préservée') },
  { pattern: /\binteresser\b/g, replacement: 'intéresser' },
  { pattern: /\binteressante?s?\b/g, replacement: (m) => m.replace('interessant', 'intéressant') },
  { pattern: /\bInteressante?s?\b/g, replacement: (m) => m.replace('Interessant', 'Intéressant') },
  { pattern: /\bpreserver\b/g, replacement: 'préserver' },
  { pattern: /\brecommandees?\b/g, replacement: (m) => m.replace('recommandee', 'recommandée') },

  // Groupe 16 - Vague 5 (itération découverte)
  // Noms
  { pattern: /\bmateriels?\b/g, replacement: (m) => m.replace('materiel', 'matériel') },
  { pattern: /\bMateriels?\b/g, replacement: (m) => m.replace('Materiel', 'Matériel') },
  { pattern: /\bresiliences?\b/g, replacement: (m) => m.replace('resilience', 'résilience') },
  { pattern: /\bResiliences?\b/g, replacement: (m) => m.replace('Resilience', 'Résilience') },
  { pattern: /\bresistances?\b/g, replacement: (m) => m.replace('resistance', 'résistance') },
  { pattern: /\bResistances?\b/g, replacement: (m) => m.replace('Resistance', 'Résistance') },
  { pattern: /\bconformite\b/g, replacement: 'conformité' },
  { pattern: /\bConformite\b/g, replacement: 'Conformité' },
  { pattern: /\bexpediteurs?\b/g, replacement: (m) => m.replace('expediteur', 'expéditeur') },
  { pattern: /\brepartitions?\b/g, replacement: (m) => m.replace('repartition', 'répartition') },
  { pattern: /\bRepartitions?\b/g, replacement: (m) => m.replace('Repartition', 'Répartition') },
  { pattern: /\bvulnerabilites?\b/g, replacement: (m) => m.replace('vulnerabilite', 'vulnérabilité') },
  { pattern: /\bVulnerabilites?\b/g, replacement: (m) => m.replace('Vulnerabilite', 'Vulnérabilité') },
  { pattern: /\bcompetences?\b/g, replacement: (m) => m.replace('competence', 'compétence') },
  { pattern: /\bCompetences?\b/g, replacement: (m) => m.replace('Competence', 'Compétence') },
  { pattern: /\bcomplementaires?\b/g, replacement: (m) => m.replace('complementaire', 'complémentaire') },
  { pattern: /\bComplementaires?\b/g, replacement: (m) => m.replace('Complementaire', 'Complémentaire') },
  { pattern: /\bdebits?\b/g, replacement: (m) => m.replace('debit', 'débit') },
  { pattern: /\bDebits?\b/g, replacement: (m) => m.replace('Debit', 'Débit') },
  // Adjectifs
  { pattern: /\bnegatifs?\b/g, replacement: (m) => m.replace('negatif', 'négatif') },
  { pattern: /\bNegatifs?\b/g, replacement: (m) => m.replace('Negatif', 'Négatif') },
  { pattern: /\bnegatives?\b/g, replacement: (m) => m.replace('negative', 'négative') },
  { pattern: /\bcentralisees?\b/g, replacement: (m) => m.replace('centralisee', 'centralisée') },
  { pattern: /\bdeflationnistes?\b/g, replacement: (m) => m.replace('deflationniste', 'déflationniste') },
  { pattern: /\bvulnerables?\b/g, replacement: (m) => m.replace('vulnerable', 'vulnérable') },
  { pattern: /\bVulnerables?\b/g, replacement: (m) => m.replace('Vulnerable', 'Vulnérable') },
  { pattern: /\bfondees?\b/g, replacement: (m) => m.replace('fondee', 'fondée') },
  { pattern: /\binstantanees?\b/g, replacement: (m) => m.replace('instantanee', 'instantanée') },
  // Verbes et formes verbales
  { pattern: /\bindependamment\b/g, replacement: 'indépendamment' },
  { pattern: /\brepresentent\b/g, replacement: 'représentent' },
  { pattern: /\bdisparait\b/g, replacement: 'disparaît' },
  { pattern: /\bconnait\b/g, replacement: 'connaît' },
  { pattern: /\breconnait\b/g, replacement: 'reconnaît' },
  { pattern: /\betaient\b/g, replacement: 'étaient' },
  { pattern: /\bconcu\b/g, replacement: 'conçu' },
  { pattern: /\bconcue\b/g, replacement: 'conçue' },
  { pattern: /\bConcue?\b/g, replacement: (m) => m.startsWith('Concu') ? m.replace('Concu', 'Conçu') : m },
  { pattern: /\bechoue\b/g, replacement: 'échoue' },
  { pattern: /\bechouer\b/g, replacement: 'échouer' },
  { pattern: /\bpresenter\b/g, replacement: 'présenter' },
  { pattern: /\bPresenter\b/g, replacement: 'Présenter' },
  { pattern: /\bdepasse\b/g, replacement: 'dépasse' },
  { pattern: /\bdepasser\b/g, replacement: 'dépasser' },
  { pattern: /\bemis\b/g, replacement: 'émis' },
  { pattern: /\bEmis\b/g, replacement: 'Émis' },
  { pattern: /\bappele\b/g, replacement: 'appelé' },
  { pattern: /\bappeles\b/g, replacement: 'appelés' },
  { pattern: /\bachete\b/g, replacement: 'achète' },
  { pattern: /\bachetent\b/g, replacement: 'achètent' },
  { pattern: /\bacheter\b/g, replacement: 'acheter' },
  // Adverbes
  { pattern: /\bmathematiquement\b/g, replacement: 'mathématiquement' },
  { pattern: /\baupres\b/g, replacement: 'auprès' },
  { pattern: /\bAupres\b/g, replacement: 'Auprès' },
  // Mois
  { pattern: /\bdecembre\b/g, replacement: 'décembre' },
  { pattern: /\bDecembre\b/g, replacement: 'Décembre' },
  { pattern: /\bfevrier\b/g, replacement: 'février' },
  { pattern: /\bFevrier\b/g, replacement: 'Février' },

  // Groupe 17 - Vague 6 (lacunes pluriels + mots courants restants)
  // Pluriels manquants
  { pattern: /\brealites\b/g, replacement: 'réalités' },
  { pattern: /\bdeposes\b/g, replacement: 'déposés' },
  { pattern: /\bexageres\b/g, replacement: 'exagérés' },
  // Noms
  { pattern: /\bcuracao\b/g, replacement: 'curaçao' },
  { pattern: /\bCuracao\b/g, replacement: 'Curaçao' },
  // Adverbes
  { pattern: /\bdefinitivement\b/g, replacement: 'définitivement' },
  { pattern: /\bconcretement\b/g, replacement: 'concrètement' },
  { pattern: /\btheoriquement\b/g, replacement: 'théoriquement' },
  // Verbes (infinitifs sûrs)
  { pattern: /\beviter\b/g, replacement: 'éviter' },
  { pattern: /\bEviter\b/g, replacement: 'Éviter' },
  // Formes verbales sûres
  { pattern: /\bdetruit\b/g, replacement: 'détruit' },
  { pattern: /\bdetruire\b/g, replacement: 'détruire' },
  { pattern: /\benvoye\b/g, replacement: 'envoyé' },
  { pattern: /\benvoyes\b/g, replacement: 'envoyés' },
  { pattern: /\benvoyee\b/g, replacement: 'envoyée' },
  { pattern: /\benvoyees\b/g, replacement: 'envoyées' },
  { pattern: /\bexecutive\b/g, replacement: 'exécutive' },
  { pattern: /\bExecutive\b/g, replacement: 'Exécutive' },
  // Découvertes par spot-check
  { pattern: /\bprevisibilite\b/g, replacement: 'prévisibilité' },
  { pattern: /\bdecident\b/g, replacement: 'décident' },
  { pattern: /\bprotegees?\b/g, replacement: (m) => m.replace('protegee', 'protégée') },
  { pattern: /\bprotege\b/g, replacement: 'protégé' },
  { pattern: /\bProteges?\b/g, replacement: (m) => m.replace('Protege', 'Protégé') },
  // Note: "verifie" exclu car ambigu (présent "vérifie" vs participe "vérifié")
  { pattern: /\brecompenses?\b/g, replacement: (m) => m.replace('recompense', 'récompense') },
  { pattern: /\bRecompenses?\b/g, replacement: (m) => m.replace('Recompense', 'Récompense') },
  { pattern: /\btransferees?\b/g, replacement: (m) => m.replace('transferee', 'transférée') },
  { pattern: /\btransferer\b/g, replacement: 'transférer' },
  { pattern: /\btransfere\b/g, replacement: 'transféré' },

  // Groupe 18 - Vague 7 (découverts par --discover, fréquence >= 5)
  // Exclusions volontaires de cette vague : tout mot dont la forme sans accent
  // est aussi un mot anglais courant (resolution, region, difference, temperature,
  // reception, separation, interpretation, representation, evaluation, prevention,
  // replication, retention, completion, correlation, emulation, evasion, recursive,
  // iterative, video, lateral [« Lateral Movement » MITRE], privilege [« Elevation
  // of Privilege » STRIDE], experimental) ; les verbes ambigus présent/participe en
  // -e (controle, necessite, telephone, etc.) ; et les mots déjà gérés ailleurs.
  // Famille "résoudre" (très fréquente)
  { pattern: /\bresout\b/g, replacement: 'résout' },
  { pattern: /\bResout\b/g, replacement: 'Résout' },
  { pattern: /\bresolvent\b/g, replacement: 'résolvent' },
  { pattern: /\bresoudre\b/g, replacement: 'résoudre' },
  { pattern: /\bResoudre\b/g, replacement: 'Résoudre' },
  { pattern: /\bresolu\b/g, replacement: 'résolu' },
  { pattern: /\bResolu\b/g, replacement: 'Résolu' },
  // Famille "répondre"
  { pattern: /\brepond\b/g, replacement: 'répond' },
  { pattern: /\bRepond\b/g, replacement: 'Répond' },
  { pattern: /\brepondent\b/g, replacement: 'répondent' },
  { pattern: /\brepondre\b/g, replacement: 'répondre' },
  { pattern: /\bRepondre\b/g, replacement: 'Répondre' },
  // Verbes : infinitifs et formes à radical accentué obligatoire (non ambigus)
  { pattern: /\bdemarrer\b/g, replacement: 'démarrer' },
  { pattern: /\bDemarrer\b/g, replacement: 'Démarrer' },
  { pattern: /\bredemarrer\b/g, replacement: 'redémarrer' },
  { pattern: /\bRedemarrer\b/g, replacement: 'Redémarrer' },
  { pattern: /\bdecouvrir\b/g, replacement: 'découvrir' },
  { pattern: /\bDecouvrir\b/g, replacement: 'Découvrir' },
  { pattern: /\bdecouvriras\b/g, replacement: 'découvriras' },
  { pattern: /\bpreparer\b/g, replacement: 'préparer' },
  { pattern: /\bPreparer\b/g, replacement: 'Préparer' },
  { pattern: /\binserer\b/g, replacement: 'insérer' },
  { pattern: /\bInserer\b/g, replacement: 'Insérer' },
  { pattern: /\breduire\b/g, replacement: 'réduire' },
  { pattern: /\bReduire\b/g, replacement: 'Réduire' },
  { pattern: /\bmaitriser\b/g, replacement: 'maîtriser' },
  { pattern: /\bMaitriser\b/g, replacement: 'Maîtriser' },
  { pattern: /\bapparait\b(?!re)/g, replacement: 'apparaît' },
  { pattern: /\brecu\b/g, replacement: 'reçu' },
  { pattern: /\bRecu\b/g, replacement: 'Reçu' },
  { pattern: /\brecois\b/g, replacement: 'reçois' },
  { pattern: /\becris\b/g, replacement: 'écris' },
  { pattern: /\bEcris\b/g, replacement: 'Écris' },
  // Noms (sans collision avec un mot anglais courant)
  { pattern: /\bfrequents\b/g, replacement: 'fréquents' },
  { pattern: /\bFrequents\b/g, replacement: 'Fréquents' },
  { pattern: /\bfrequentes\b/g, replacement: 'fréquentes' },
  { pattern: /\bFrequentes\b/g, replacement: 'Fréquentes' },
  { pattern: /\bconnectivite\b/g, replacement: 'connectivité' },
  { pattern: /\bConnectivite\b/g, replacement: 'Connectivité' },
  { pattern: /\bhebergements?\b/g, replacement: (m) => m.replace('hebergement', 'hébergement') },
  { pattern: /\bHebergements?\b/g, replacement: (m) => m.replace('Hebergement', 'Hébergement') },
  { pattern: /\beteinte\b/g, replacement: 'éteinte' },
  { pattern: /\btraçabilite\b/g, replacement: 'traçabilité' },
  { pattern: /\betrangeres?\b/g, replacement: (m) => m.replace('etrangere', 'étrangère') },
  { pattern: /\bEtrangeres?\b/g, replacement: (m) => m.replace('Etrangere', 'Étrangère') },
  { pattern: /\breferentielle\b/g, replacement: 'référentielle' },
  { pattern: /\bVerifier\b/g, replacement: 'Vérifier' },
  { pattern: /\bintegrateur\b/g, replacement: 'intégrateur' },
  { pattern: /\bIntegrateur\b/g, replacement: 'Intégrateur' },
  { pattern: /\bfidelite\b/g, replacement: 'fidélité' },
  { pattern: /\bFidelite\b/g, replacement: 'Fidélité' },
  { pattern: /\bagregation\b/g, replacement: 'agrégation' },
  { pattern: /\bAgregation\b/g, replacement: 'Agrégation' },
  { pattern: /\bexterieure?s?\b/g, replacement: (m) => m.replace('exterieur', 'extérieur') },
  { pattern: /\bExterieure?s?\b/g, replacement: (m) => m.replace('Exterieur', 'Extérieur') },
  { pattern: /\binterieure?s?\b/g, replacement: (m) => m.replace('interieur', 'intérieur') },
  { pattern: /\bInterieure?s?\b/g, replacement: (m) => m.replace('Interieur', 'Intérieur') },
  { pattern: /\bmecanismes?\b/g, replacement: (m) => m.replace('mecanisme', 'mécanisme') },
  { pattern: /\bMecanismes?\b/g, replacement: (m) => m.replace('Mecanisme', 'Mécanisme') },
  { pattern: /\boperateurs?\b/g, replacement: (m) => m.replace('operateur', 'opérateur') },
  { pattern: /\bOperateurs?\b/g, replacement: (m) => m.replace('Operateur', 'Opérateur') },
  { pattern: /\bcaracteristiques?\b/g, replacement: (m) => m.replace('caracteristique', 'caractéristique') },
  { pattern: /\bCaracteristiques?\b/g, replacement: (m) => m.replace('Caracteristique', 'Caractéristique') },
  { pattern: /\bequipements?\b/g, replacement: (m) => m.replace('equipement', 'équipement') },
  { pattern: /\bEquipements?\b/g, replacement: (m) => m.replace('Equipement', 'Équipement') },
  { pattern: /\btelephoniques?\b/g, replacement: (m) => m.replace('telephonique', 'téléphonique') },
  { pattern: /\bdeuxieme\b/g, replacement: 'deuxième' },
  { pattern: /\bDeuxieme\b/g, replacement: 'Deuxième' },
  { pattern: /\btroisieme\b/g, replacement: 'troisième' },
  { pattern: /\bTroisieme\b/g, replacement: 'Troisième' },
  { pattern: /\bdebut\b/g, replacement: 'début' },
  { pattern: /\bDebut\b/g, replacement: 'Début' },
  { pattern: /\bdeparts?\b/g, replacement: (m) => m.replace('depart', 'départ') },
  { pattern: /\bdepartements?\b/g, replacement: (m) => m.replace('departement', 'département') },
  { pattern: /\bDepartements?\b/g, replacement: (m) => m.replace('Departement', 'Département') },
  { pattern: /\becriture\b/g, replacement: 'écriture' },
  { pattern: /\bEcriture\b/g, replacement: 'Écriture' },
  { pattern: /\breproductibilite\b/g, replacement: 'reproductibilité' },
  { pattern: /\bredemarrages?\b/g, replacement: (m) => m.replace('redemarrage', 'redémarrage') },
  { pattern: /\binterferences?\b/g, replacement: (m) => m.replace('interference', 'interférence') },
  { pattern: /\bInterferences?\b/g, replacement: (m) => m.replace('Interference', 'Interférence') },
  { pattern: /\bbooleens?\b/g, replacement: (m) => m.replace('booleen', 'booléen') },
  { pattern: /\bBooleens?\b/g, replacement: (m) => m.replace('Booleen', 'Booléen') },
  { pattern: /\bcomptabilite\b/g, replacement: 'comptabilité' },
  { pattern: /\bComptabilite\b/g, replacement: 'Comptabilité' },
  { pattern: /\belectricite\b/g, replacement: 'électricité' },
  { pattern: /\bElectricite\b/g, replacement: 'Électricité' },
  { pattern: /\bsecurisation\b/g, replacement: 'sécurisation' },
  { pattern: /\bSecurisation\b/g, replacement: 'Sécurisation' },
  { pattern: /\bcomprehensions?\b/g, replacement: (m) => m.replace('comprehension', 'compréhension') },
  { pattern: /\bComprehensions?\b/g, replacement: (m) => m.replace('Comprehension', 'Compréhension') },
  { pattern: /\binconvenients?\b/g, replacement: (m) => m.replace('inconvenient', 'inconvénient') },
  { pattern: /\bInconvenients?\b/g, replacement: (m) => m.replace('Inconvenient', 'Inconvénient') },
  { pattern: /\bcollegues?\b/g, replacement: (m) => m.replace('collegue', 'collègue') },
  { pattern: /\bCollegues?\b/g, replacement: (m) => m.replace('Collegue', 'Collègue') },
  { pattern: /\bingredients?\b/g, replacement: (m) => m.replace('ingredient', 'ingrédient') },
  { pattern: /\bIngredients?\b/g, replacement: (m) => m.replace('Ingredient', 'Ingrédient') },
  { pattern: /\bdegres\b/g, replacement: 'degrés' },
  { pattern: /\bprocedures?\b/g, replacement: (m) => m.replace('procedure', 'procédure') },
  { pattern: /\bProcedures?\b/g, replacement: (m) => m.replace('Procedure', 'Procédure') },
  { pattern: /\bconferences?\b/g, replacement: (m) => m.replace('conference', 'conférence') },
  { pattern: /\bConferences?\b/g, replacement: (m) => m.replace('Conference', 'Conférence') },
  { pattern: /\bcreateurs?\b/g, replacement: (m) => m.replace('createur', 'créateur') },
  { pattern: /\bCreateurs?\b/g, replacement: (m) => m.replace('Createur', 'Créateur') },
  { pattern: /\bheterogenes?\b/g, replacement: (m) => m.replace('heterogene', 'hétérogène') },
  { pattern: /\bHeterogenes?\b/g, replacement: (m) => m.replace('Heterogene', 'Hétérogène') },
  { pattern: /\blineaires?\b/g, replacement: (m) => m.replace('lineaire', 'linéaire') },
  { pattern: /\bLineaires?\b/g, replacement: (m) => m.replace('Lineaire', 'Linéaire') },
  { pattern: /\bmedianes?\b/g, replacement: (m) => m.replace('mediane', 'médiane') },
  { pattern: /\bmediocres?\b/g, replacement: (m) => m.replace('mediocre', 'médiocre') },
  { pattern: /\bfrontieres?\b/g, replacement: (m) => m.replace('frontiere', 'frontière') },
  { pattern: /\bFrontieres?\b/g, replacement: (m) => m.replace('Frontiere', 'Frontière') },
  { pattern: /\bderriere\b/g, replacement: 'derrière' },
  { pattern: /\bDerriere\b/g, replacement: 'Derrière' },
  { pattern: /\breservations?\b/g, replacement: (m) => m.replace('reservation', 'réservation') },
  { pattern: /\bReservations?\b/g, replacement: (m) => m.replace('Reservation', 'Réservation') },
  { pattern: /\bprenoms?\b/g, replacement: (m) => m.replace('prenom', 'prénom') },
  { pattern: /\bPrenoms?\b/g, replacement: (m) => m.replace('Prenom', 'Prénom') },
  { pattern: /\bhierarchies?\b/g, replacement: (m) => m.replace('hierarchie', 'hiérarchie') },
  { pattern: /\bHierarchies?\b/g, replacement: (m) => m.replace('Hierarchie', 'Hiérarchie') },
  { pattern: /\bbatiments?\b/g, replacement: (m) => m.replace('batiment', 'bâtiment') },
  { pattern: /\bBatiments?\b/g, replacement: (m) => m.replace('Batiment', 'Bâtiment') },
  { pattern: /\bicones?\b/g, replacement: (m) => m.replace('icone', 'icône') },
  { pattern: /\bIcones?\b/g, replacement: (m) => m.replace('Icone', 'Icône') },
  { pattern: /\bdepots?\b/g, replacement: (m) => m.replace('depot', 'dépôt') },
  { pattern: /\bDepots?\b/g, replacement: (m) => m.replace('Depot', 'Dépôt') },
  { pattern: /\bhotes?\b/g, replacement: (m) => m.replace('hote', 'hôte') },
  { pattern: /\bHotes?\b/g, replacement: (m) => m.replace('Hote', 'Hôte') },
  { pattern: /\bhotels?\b/g, replacement: (m) => m.replace('hotel', 'hôtel') },
  { pattern: /\bHotels?\b/g, replacement: (m) => m.replace('Hotel', 'Hôtel') },
  { pattern: /\betude\b/g, replacement: 'étude' },
  { pattern: /\bEtude\b/g, replacement: 'Étude' },
  { pattern: /\becoles?\b/g, replacement: (m) => m.replace('ecole', 'école') },
  { pattern: /\bEcoles?\b/g, replacement: (m) => m.replace('Ecole', 'École') },
  { pattern: /\betoiles?\b/g, replacement: (m) => m.replace('etoile', 'étoile') },
  { pattern: /\bEtoiles?\b/g, replacement: (m) => m.replace('Etoile', 'Étoile') },
  { pattern: /\betages?\b/g, replacement: (m) => m.replace('etage', 'étage') },
  { pattern: /\bEtages?\b/g, replacement: (m) => m.replace('Etage', 'Étage') },
  { pattern: /\btremolos?\b/g, replacement: (m) => m.replace('tremolo', 'trémolo') },
  { pattern: /\bdelais?\b/g, replacement: (m) => m.replace('delai', 'délai') },
  { pattern: /\bDelais?\b/g, replacement: (m) => m.replace('Delai', 'Délai') },
  { pattern: /\bmaterielle?s?\b/g, replacement: (m) => m.replace('materiel', 'matériel') },
  { pattern: /\bavancees?\b/g, replacement: (m) => m.replace('avancee', 'avancée') },
  { pattern: /\bAvancees?\b/g, replacement: (m) => m.replace('Avancee', 'Avancée') },
  { pattern: /\bemployes?\b/g, replacement: (m) => m.replace('employe', 'employé') },
  { pattern: /\bEmployes?\b/g, replacement: (m) => m.replace('Employe', 'Employé') },
  { pattern: /\brecapitulatifs?\b/g, replacement: (m) => m.replace('recapitulatif', 'récapitulatif') },
  { pattern: /\bRecapitulatifs?\b/g, replacement: (m) => m.replace('Recapitulatif', 'Récapitulatif') },
  { pattern: /\breutilisables?\b/g, replacement: (m) => m.replace('reutilisable', 'réutilisable') },
  { pattern: /\bReutilisables?\b/g, replacement: (m) => m.replace('Reutilisable', 'Réutilisable') },
  { pattern: /\bdechets\b/g, replacement: 'déchets' },
  { pattern: /\barrets?\b/g, replacement: (m) => m.replace('arret', 'arrêt') },
  { pattern: /\bArrets?\b/g, replacement: (m) => m.replace('Arret', 'Arrêt') },
  { pattern: /(?<![A-Za-z\u00C0-\u024F\u0300-\u036F])sante\b/g, replacement: 'santé' },
  { pattern: /(?<![A-Za-z\u00C0-\u024F\u0300-\u036F])Sante\b/g, replacement: 'Santé' },
  { pattern: /\bgeneraux\b/g, replacement: 'généraux' },
  { pattern: /\bGeneraux\b/g, replacement: 'Généraux' },
  { pattern: /\blegaux\b/g, replacement: 'légaux' },
  { pattern: /\billegaux\b/g, replacement: 'illégaux' },
  { pattern: /(?<![A-Za-z\u00C0-\u024F\u0300-\u036F])geants?\b/g, replacement: (m) => m.replace('geant', 'géant') },
  { pattern: /(?<![A-Za-z\u00C0-\u024F\u0300-\u036F])Geants?\b/g, replacement: (m) => m.replace('Geant', 'Géant') },
  { pattern: /\bideale?s?\b/g, replacement: (m) => m.replace('ideal', 'idéal') },
  { pattern: /\bIdeale?s?\b/g, replacement: (m) => m.replace('Ideal', 'Idéal') },
  { pattern: /\blegers?\b/g, replacement: (m) => m.replace('leger', 'léger') },
  { pattern: /\bLegers?\b/g, replacement: (m) => m.replace('Leger', 'Léger') },
  { pattern: /\breussites?\b/g, replacement: (m) => m.replace('reussite', 'réussite') },
  { pattern: /\bReussites?\b/g, replacement: (m) => m.replace('Reussite', 'Réussite') },
  { pattern: /\breussi\b/g, replacement: 'réussi' },
  { pattern: /\breussie\b/g, replacement: 'réussie' },
  { pattern: /\breussit\b/g, replacement: 'réussit' },
  { pattern: /\bzeros\b/g, replacement: 'zéros' },
  { pattern: /\bdefis\b/g, replacement: 'défis' },
  // Adverbes
  { pattern: /\bseparement\b/g, replacement: 'séparément' },
  { pattern: /\bindefiniment\b/g, replacement: 'indéfiniment' },
  { pattern: /\binstantanement\b/g, replacement: 'instantanément' },
  { pattern: /\bregulierement\b/g, replacement: 'régulièrement' },
  { pattern: /\breellement\b/g, replacement: 'réellement' },
  // "très" : en JS, \b ne considère pas les lettres accentuées comme des word
  // chars, donc /\btres\b/ matcherait le "tres" final de "paramètres", "fenêtres",
  // "mètres", "êtres"… (le è/ê précédent fait office de frontière). On exclut donc
  // explicitement toute lettre précédente (accentuée ou non) et les diacritiques
  // combinants (forme NFD) via un lookbehind.
  { pattern: /(?<![A-Za-z\u00C0-\u024F\u0300-\u036F])tres\b/g, replacement: "très" },
  // Groupe 19 - Vague 8 (2e passe discover)
  // Participes féminins en -ée(s) : toujours accentués (la marque féminine impose
  // l'accent ; seul le masculin -é serait ambigu et reste exclu).
  { pattern: /\bautorisees?\b/g, replacement: (m) => m.replace("autorisee", "autorisée") },
  { pattern: /\bAutorisees?\b/g, replacement: (m) => m.replace("Autorisee", "Autorisée") },
  { pattern: /\bsimplifiees?\b/g, replacement: (m) => m.replace("simplifiee", "simplifiée") },
  { pattern: /\bmanagees?\b/g, replacement: (m) => m.replace("managee", "managée") },
  { pattern: /\bManagees?\b/g, replacement: (m) => m.replace("Managee", "Managée") },
  { pattern: /\bdonnee\b/g, replacement: "donnée" },
  { pattern: /\bDonnee\b/g, replacement: "Donnée" },
  { pattern: /\bestimee\b/g, replacement: "estimée" },
  { pattern: /\bEstimee\b/g, replacement: "Estimée" },
  { pattern: /\bstockees?\b/g, replacement: (m) => m.replace("stockee", "stockée") },
  { pattern: /\bdefinies?\b/g, replacement: (m) => m.replace("definie", "définie") },
  { pattern: /\bDefinies?\b/g, replacement: (m) => m.replace("Definie", "Définie") },
  { pattern: /\bconfigurees?\b/g, replacement: (m) => m.replace("configuree", "configurée") },
  { pattern: /\bConfigurees?\b/g, replacement: (m) => m.replace("Configuree", "Configurée") },
  { pattern: /\bpartagees?\b/g, replacement: (m) => m.replace("partagee", "partagée") },
  { pattern: /\bPartagees?\b/g, replacement: (m) => m.replace("Partagee", "Partagée") },
  { pattern: /\bbasees?\b/g, replacement: (m) => m.replace("basee", "basée") },
  { pattern: /\bimbriquees?\b/g, replacement: (m) => m.replace("imbriquee", "imbriquée") },
  { pattern: /\bisolees?\b/g, replacement: (m) => m.replace("isolee", "isolée") },
  // Adjectifs / noms (forme unique, sans collision anglaise)
  { pattern: /\billimitee?s?\b/g, replacement: (m) => m.replace("illimite", "illimité") },
  { pattern: /\bIllimitee?s?\b/g, replacement: (m) => m.replace("Illimite", "Illimité") },
  { pattern: /\bverifications\b/g, replacement: "vérifications" },
  { pattern: /\bVerifications\b/g, replacement: "Vérifications" },
  // Adverbe
  { pattern: /\bcompletement\b/g, replacement: "complètement" },
  { pattern: /\bCompletement\b/g, replacement: "Complètement" },
  // Verbes : infinitif + 3e personne du pluriel (radical accentué obligatoire, non ambigus)
  { pattern: /\bselectionner\b/g, replacement: "sélectionner" },
  { pattern: /\bSelectionner\b/g, replacement: "Sélectionner" },
  { pattern: /\bdefinissent\b/g, replacement: "définissent" },
  { pattern: /\bcontroler\b/g, replacement: "contrôler" },
  { pattern: /\bControler\b/g, replacement: "Contrôler" },
  { pattern: /\bcontrolent\b/g, replacement: "contrôlent" },
  { pattern: /\bdecouvre\b/g, replacement: "découvre" },
  { pattern: /\bDecouvre\b/g, replacement: "Découvre" },
];

// --- Processing ---

function protectInlineCode(line) {
  // Replace inline code spans with placeholders to avoid modifying code
  const placeholders = [];
  let idx = 0;
  const protected_ = line.replace(/`[^`]+`/g, (match) => {
    const placeholder = `\x00CODE${idx}\x00`;
    placeholders.push({ placeholder, original: match });
    idx++;
    return placeholder;
  });
  return { line: protected_, placeholders };
}

function protectUrls(line) {
  // Protect URLs and markdown link paths
  const placeholders = [];
  let idx = 0;
  // Protect full URLs
  let protected_ = line.replace(/https?:\/\/[^\s)>\]]+/g, (match) => {
    const placeholder = `\x00URL${idx}\x00`;
    placeholders.push({ placeholder, original: match });
    idx++;
    return placeholder;
  });
  // Protect markdown link paths: the (path) part of [text](path)
  protected_ = protected_.replace(/\]\([^)]+\)/g, (match) => {
    const placeholder = `\x00LINK${idx}\x00`;
    placeholders.push({ placeholder, original: match });
    idx++;
    return placeholder;
  });
  // Chemins HTML (iframes diagram-design) : ne pas accentuer le nom de fichier
  protected_ = protected_.replace(/\b(?:href|src)="[^"]+"/g, (match) => {
    const placeholder = `\x00ATTR${idx}\x00`;
    placeholders.push({ placeholder, original: match });
    idx++;
    return placeholder;
  });
  return { line: protected_, placeholders };
}

// Protect English phrases that contain words the rules would incorrectly accentuate
const ENGLISH_PHRASES = [
  // CI/CD & DevOps
  /Continuous Integration/g, /Continuous Delivery/g, /Continuous Deployment/g,
  /Integration Test(?:s|ing)?/g, /Integration Suite/g,
  /Machine Learning Operations/g, /Security Operations/g,
  /Endpoint Detection/g,
  // JSON/API standards
  /JSON Schema/g, /Schema Definition Language/g, /OpenAPI Schema/g,
  // Design patterns (English names)
  /Model[- ]View[- ]Presenter/g, /Presenter/g,
  // Kubernetes / RBAC
  /\bRole(?:Binding|Ref)?\b/g, /\bClusterRole(?:Binding)?\b/g, /Role-Based/g,
  /\bRoles?\b(?=\s*(?:\||:|\{|=|<|RBAC|Based|Binding|Ref))/g,
  // SQL / Doctrine types
  /\bdecimal\b/gi, /Data Definition/g,
  // Security (OWASP)
  /Vulnerable Components/g, /Known Vulnerabilities/g,
  // UX
  /User Experience/g,
  // Architecture
  /Architecture Decision Record/g, /Decision Record/g,
  // File paths with .rs, .js, etc.
  /\b\w+\.(?:rs|js|ts|py|php|java|go|rb|sh|yml|yaml|json|toml|sql|md)\b/g,
  // Retrieval-Augmented Generation
  /Retrieval-Augmented Generation/g, /Augmented Generation/g,
  // Doctrine / database terms in English context
  /database schema/gi, /mapping schema/gi, /the schema/gi,
  /\bdecimals?\b/g,
  // Test suites (English directory/suite names)
  /\bIntegration\b(?=,?\s*(?:Functional|Test|Suite|test))/g,
  /\b(?:Unit|Smoke|Functional),?\s*Integration\b/g,
  /\|\s*Integration\s*\|/g,
  // Kubernetes Roles in descriptive French text
  /\bRoles?\b(?=\s*(?:définissent|attribuent|permettent|contrôlent|,\s*RoleBinding))/g,
  /\bRoles\b(?=,\s*RoleBindings)/g,
  // Grafana/monitoring English terms
  /Grafana (?:Integration|Alert)/g,
  /\*\*Integration\*\*/g,
  // MVC Presenter pattern
  /\b[Pp]resenter\b/g,
  // Cloud IAM
  /IAM\s+roles?\b/gi,
  // Termes anglais figés (ne pas franciser les radicaux Operations/Edition/
  // Reference/Resilience/Execution/Generation). On protège des COLLOCATIONS
  // multi-mots uniquement : un "operations" français isolé reste corrigé en
  // "opérations" par les WORD_RULES. Ces patterns masquent la collocation avant
  // l'application des règles (ordre garanti dans applyRules).
  // Operations (sécurité offensive/défensive, modèle Purdue OT)
  /Operations Security/g, /Red Team Operations/g,
  /Security Operations Center/g, /Network Operations Center/g,
  /Site Operations/g,
  // Editions de produits
  /Community Edition/g, /Enterprise Edition/g,
  // Reference (OWASP IDOR, modèles de référence)
  /Insecure Direct Object Reference/g, /Object Reference/g,
  /Enterprise Reference Architecture/g,
  // Resilience (réglementations UE)
  /Cyber Resilience Act/g, /Resilience Act/g, /Operational Resilience/g,
  // Execution (sécurité système, standards)
  /Data Execution Prevention/g, /PowerShell Execution/g,
  /Penetration Testing Execution Standard/g,
  // Generation (firewall, blockchain TGE)
  /Next-Generation/g, /Token Generation Event/g,
  // Blockchain (consensus)
  /Proof of Work/g, /Proof of Stake/g,
  // Intelligence artificielle (familles d'apprentissage)
  /Machine Learning/g, /Deep Learning/g,
  // --- Expressions anglaises figées protégées contre sur-accentuation ---
  // Ces collocations contiennent des mots (zero, sequence, schema, prediction,
  // executive) qui sont aussi des mots français accentuables. On les masque ici
  // pour que WORD_RULES ne les transforme pas. Un mot isolé comme "prediction"
  // hors de ces expressions est toujours corrigé en "prédiction".
  /Project Zero/gi,                     // nom de programme de recherche Google
  /Flipper Zero/gi,                     // appareil de pentest (marque propre)
  /Executive Order/gi,                  // terme juridique américain
  /JSON Schema/gi,                      // standard de validation JSON (déjà présent mais sans /i)
  /Next Sentence Prediction/gi,         // tâche NLP BERT
  /next token prediction/gi,            // tâche NLP générative
  /Dense Prediction Transformer/gi,     // architecture vision (DPT)
  /Multiple Sequence Alignment/gi,      // bioinformatique
  /beginning of sequence/gi,            // token spécial NLP ([BOS])
  /end of sequence/gi,                  // token spécial NLP ([EOS])
];

function protectEnglishPhrases(line) {
  const placeholders = [];
  let idx = 0;
  let protected_ = line;
  for (const re of ENGLISH_PHRASES) {
    // Reset regex lastIndex for global patterns
    re.lastIndex = 0;
    protected_ = protected_.replace(re, (match) => {
      const placeholder = `\x00EN${idx}\x00`;
      placeholders.push({ placeholder, original: match });
      idx++;
      return placeholder;
    });
  }
  return { line: protected_, placeholders };
}

function restorePlaceholders(line, allPlaceholders) {
  // Certains placeholders sont imbriques : un lien Markdown protege
  // (\x00LINK\x00) contient le placeholder de son URL (\x00URL\x00). Une seule
  // passe dans l'ordre du tableau laisserait le placeholder interne grave dans
  // le texte (des octets NULL finiraient dans les fiches). On boucle donc
  // jusqu'a stabilite : chaque passe restaure un niveau d'imbrication.
  let previous;
  let guard = 0;
  do {
    previous = line;
    for (const { placeholder, original } of allPlaceholders) {
      // Remplacement par fonction pour neutraliser les $ speciaux dans original
      line = line.replace(placeholder, () => original);
    }
    guard += 1;
  } while (line !== previous && line.includes('\x00') && guard < 10);
  return line;
}

function applyRules(line) {
  // Protect inline code, URLs, and English phrases
  const code = protectInlineCode(line);
  const urls = protectUrls(code.line);
  const eng = protectEnglishPhrases(urls.line);
  let processed = eng.line;

  // Apply phrase rules first (higher priority)
  for (const rule of PHRASE_RULES) {
    processed = processed.replace(rule.pattern, rule.replacement);
  }

  // Apply word rules
  for (const rule of WORD_RULES) {
    processed = processed.replace(rule.pattern, rule.replacement);
  }

  // Restore protected zones
  const allPlaceholders = [...eng.placeholders, ...urls.placeholders, ...code.placeholders];
  processed = restorePlaceholders(processed, allPlaceholders);

  return processed;
}

function processFile(content) {
  const lines = content.split('\n');
  const result = [];
  let inCodeBlock = false;
  let changeCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    // Skip lines inside code blocks
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Les identifiants v2 du frontmatter sont des valeurs techniques ASCII.
    if (/^(?:id|course_id|module_id|content_type|order):\s/.test(line)) {
      result.push(line);
      continue;
    }

    // Process normal lines (including frontmatter - descriptions need accents)
    const fixed = applyRules(line);
    if (fixed !== line) {
      changeCount++;
    }
    result.push(fixed);
  }

  return { content: result.join('\n'), changeCount };
}

// --- Discovery mode ---

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0153/g, 'oe').replace(/\u0152/g, 'Oe');
}

module.exports = {
  PHRASE_RULES,
  WORD_RULES,
  ENGLISH_PHRASES,
  protectInlineCode,
  protectUrls,
  protectEnglishPhrases,
  restorePlaceholders,
  applyRules,
  processFile,
  stripAccents,
};
