const {
  protectInlineCode,
  protectUrls,
  protectEnglishPhrases,
  restorePlaceholders,
  applyRules,
  processFile,
  stripAccents,
} = require('../lib/accents');

describe('protectInlineCode', () => {
  it('remplace le code inline par des placeholders', () => {
    const result = protectInlineCode('Utiliser `docker run` pour lancer');
    expect(result.line).not.toContain('`docker run`');
    expect(result.placeholders).toHaveLength(1);
    expect(result.placeholders[0].original).toBe('`docker run`');
  });

  it('preserve les lignes sans code inline', () => {
    const result = protectInlineCode('Texte normal sans code');
    expect(result.line).toBe('Texte normal sans code');
    expect(result.placeholders).toHaveLength(0);
  });

  it('gere plusieurs codes inline', () => {
    const result = protectInlineCode('Les commandes `git add` et `git commit`');
    expect(result.placeholders).toHaveLength(2);
  });
});

describe('protectUrls', () => {
  it('protege les URLs http', () => {
    const result = protectUrls('Voir https://example.com/definition pour plus');
    expect(result.line).not.toContain('https://example.com/definition');
    expect(result.placeholders).toHaveLength(1);
  });

  it('protege les chemins de liens Markdown', () => {
    const result = protectUrls('Voir [la fiche](../01-docker/01-definition.md)');
    expect(result.placeholders.length).toBeGreaterThanOrEqual(1);
  });

  it('protege href et src HTML des figures diagram-design', () => {
    const line =
      '<iframe src="../../diagrams/03-symfony-07-relations-entites-1.html" title="Relation">';
    const result = protectUrls(line);
    expect(result.line).not.toContain('relations-entites');
    expect(result.placeholders.some((p) => p.original.includes('src='))).toBe(true);
  });
});

describe('protectEnglishPhrases', () => {
  it('protege "Continuous Integration"', () => {
    const result = protectEnglishPhrases('Mettre en place Continuous Integration');
    expect(result.line).not.toContain('Continuous Integration');
    expect(result.placeholders.length).toBeGreaterThanOrEqual(1);
  });

  it('protege "JSON Schema"', () => {
    const result = protectEnglishPhrases('Valider avec JSON Schema');
    expect(result.line).not.toContain('JSON Schema');
  });
});

describe('restorePlaceholders', () => {
  it('restaure les placeholders dans l\'ordre', () => {
    const placeholders = [
      { placeholder: '\x00CODE0\x00', original: '`test`' },
      { placeholder: '\x00CODE1\x00', original: '`autre`' },
    ];
    const result = restorePlaceholders('avant \x00CODE0\x00 milieu \x00CODE1\x00 fin', placeholders);
    expect(result).toBe('avant `test` milieu `autre` fin');
  });
});

describe('applyRules', () => {
  it('corrige "definition" en "definition" avec accent', () => {
    expect(applyRules('La definition du terme')).toBe('La d\u00e9finition du terme');
  });

  it('corrige "Prerequis" avec accent', () => {
    expect(applyRules('Les prerequis sont :')).toBe('Les pr\u00e9requis sont :');
  });

  it('corrige "etape" avec accent', () => {
    expect(applyRules('Premiere etape du processus')).toBe('Premi\u00e8re \u00e9tape du processus');
  });

  it('ne modifie pas le code inline', () => {
    const input = 'Utiliser `definition` dans le code';
    const result = applyRules(input);
    expect(result).toContain('`definition`');
  });

  it('ne modifie pas les URLs', () => {
    const input = 'Voir https://example.com/definition pour plus';
    const result = applyRules(input);
    expect(result).toContain('https://example.com/definition');
  });

  it('gere les majuscules', () => {
    expect(applyRules('Deploiement en cours')).toBe('D\u00e9ploiement en cours');
  });

  it('applique les regles de phrases en priorite', () => {
    expect(applyRules('Lecture estimee : 15 min')).toBe('Lecture estim\u00e9e : 15 min');
  });

  it('corrige "meme si" en "meme si" avec accent', () => {
    expect(applyRules('meme si le test echoue')).toBe('m\u00eame si le test \u00e9choue');
  });
});

describe('processFile', () => {
  it('ne modifie pas les blocs de code', () => {
    const input = 'La definition\n```bash\ndefinition\n```\nLa definition';
    const { content } = processFile(input);
    const lines = content.split('\n');
    expect(lines[0]).toBe('La d\u00e9finition');
    expect(lines[2]).toBe('definition');
    expect(lines[4]).toBe('La d\u00e9finition');
  });

  it('traite les lignes normales', () => {
    const { content, changeCount } = processFile('La definition est importante');
    expect(content).toBe('La d\u00e9finition est importante');
    expect(changeCount).toBe(1);
  });

  it('retourne le nombre de lignes modifiees', () => {
    const input = 'Premiere etape\nDeuxieme etape\nTexte correct';
    const { changeCount } = processFile(input);
    expect(changeCount).toBe(2);
  });

  it('ne reaccentue pas le fichier cible d une iframe diagram-design', () => {
    const input =
      '<iframe src="../../diagrams/03-symfony-07-relations-entites-1.html" title="Relation">';
    const { content, changeCount } = processFile(input);
    expect(content).toContain('relations-entites-1.html');
    expect(content).not.toContain('relations-entités');
    expect(changeCount).toBe(0);
  });

  it('gere le contenu mixte code et texte', () => {
    const input = [
      '## Prerequis',
      '',
      '```php',
      '$definition = "test";',
      '```',
      '',
      'La definition du concept.',
    ].join('\n');
    const { content } = processFile(input);
    expect(content).toContain('Pr\u00e9requis');
    expect(content).toContain('$definition = "test";');
    expect(content).toContain('La d\u00e9finition du concept.');
  });
});

describe('stripAccents', () => {
  it('supprime les accents aigus', () => {
    expect(stripAccents('\u00e9t\u00e9')).toBe('ete');
  });

  it('supprime les accents graves', () => {
    expect(stripAccents('pr\u00e8s')).toBe('pres');
  });

  it('supprime les accents circonflexes', () => {
    expect(stripAccents('fen\u00eatre')).toBe('fenetre');
  });

  it('remplace la ligature oe', () => {
    expect(stripAccents('n\u0153ud')).toBe('noeud');
  });

  it('ne modifie pas les textes sans accent', () => {
    expect(stripAccents('definition')).toBe('definition');
  });
});

describe('collocations anglaises figees (non-regression sur-correction)', () => {
  // Chaque collocation anglaise figee doit ressortir IDENTIQUE apres
  // processFile : les radicaux Operations/Edition/Reference/Resilience/
  // Execution/Generation ne doivent jamais etre francises dans ces contextes.
  const englishPhrases = [
    'Red Team Operations',
    'Operations Security',
    'Security Operations Center',
    'Network Operations Center',
    'Site Operations',
    'Community Edition',
    'Enterprise Edition',
    'Insecure Direct Object Reference',
    'Object Reference',
    'Purdue Enterprise Reference Architecture',
    'Cyber Resilience Act',
    'Resilience Act',
    'Digital Operational Resilience Act',
    'Data Execution Prevention',
    'Suspicious PowerShell Execution',
    'Penetration Testing Execution Standard',
    'Next-Generation Firewall',
    'Token Generation Event',
    'Retrieval-Augmented Generation',
    'Proof of Work',
    'Proof of Stake',
    'Machine Learning',
    'Deep Learning',
  ];

  for (const phrase of englishPhrases) {
    it(`laisse intact : ${phrase}`, () => {
      expect(processFile(phrase).content).toBe(phrase);
    });
  }

  it('protege la collocation meme noyee dans une phrase francaise', () => {
    const input =
      "L'equipe utilise Red Team Operations et Burp Suite Community Edition.";
    const out = processFile(input).content;
    expect(out).toContain('Red Team Operations');
    expect(out).toContain('Community Edition');
  });
});

describe('expressions anglaises figees avec radicaux sur-accentuables (non-regression)', () => {
  // (a) Les expressions anglaises protégées doivent rester IDENTIQUES après processFile.
  const englishProtected = [
    'Project Zero',
    'Flipper Zero',
    'Executive Order',
    'JSON Schema',
    'Next Sentence Prediction',
    'next token prediction',
    'Dense Prediction Transformer',
    'Multiple Sequence Alignment',
    'beginning of sequence',
    'end of sequence',
  ];

  for (const phrase of englishProtected) {
    it(`laisse intact : ${phrase}`, () => {
      expect(processFile(phrase).content).toBe(phrase);
    });
  }

  it('protege les expressions noyees dans une phrase francaise', () => {
    const input =
      "Le modele utilise Next Sentence Prediction et end of sequence comme token special.";
    const out = processFile(input).content;
    expect(out).toContain('Next Sentence Prediction');
    expect(out).toContain('end of sequence');
  });

  // (b) Un mot français isolé hors expression protégée doit TOUJOURS être accentué.
  it('corrige "prediction" francais isole en "prediction" avec accent', () => {
    expect(processFile('la prediction du modele est incorrecte').content).toContain(
      'prédiction',
    );
  });

  it('corrige "sequence" francais isole en "sequence" avec accent', () => {
    expect(processFile('une sequence de caracteres').content).toContain('séquence');
  });

  it('corrige "schema" francais isole en "schema" avec accent', () => {
    expect(processFile('le schema de la base de donnees').content).toContain('schéma');
  });

  it('corrige "zero" francais isole en "zero" avec accent', () => {
    expect(processFile('le resultat est zero').content).toContain('zéro');
  });
});

describe('famille ecoute (non-regression accent coute)', () => {
  // Le correcteur ne doit JAMAIS transformer ecoute/ecouter/etc. en ecoute,
  // quelle que soit la forme Unicode (precomposee ou decomposee NFD) ou la
  // casse. É = E precompose, 'É' = E + accent aigu combinant.
  const intactForms = [
    'ecoute le trafic reseau',
    'il faut ecouter le port',
    'les ecoutes telephoniques',
    'ils ecoutent le canal',
    'en ecoutant le flux',
    "Écoute passive du reseau".normalize('NFC'), // E precompose (U+00C9)
    "Écoute passive du reseau".normalize('NFD'), // E + U+0301 combinant (cas du bug original)
  ];

  for (const form of intactForms) {
    it(`ne corrompt pas : ${JSON.stringify(form)}`, () => {
      expect(processFile(form).content).not.toContain('coût');
    });
  }

  it('repare Écoûte en Écoute', () => {
    expect(processFile('Écoûte passive').content).toBe('Écoute passive');
  });

  it('repare ecoûte (sans accent precompose) en supprimant le û errone', () => {
    // La regle de reparation retire le û injecte a tort. Elle reste
    // conservatrice : elle ne reintroduit pas l'accent aigu sur le e bare
    // (ce role revient au reste du correcteur / a la passe de reparation
    // ponctuelle). L'essentiel : "coût" disparait du mot "ecoute".
    const out = processFile('le serveur ecoûte sur le port').content;
    expect(out).toContain('ecoute');
    expect(out).not.toContain('coût');
  });

  it('corrige toujours un vrai "cout" en "cout"', () => {
    expect(processFile('cela coute cher').content).toContain('coût');
    expect(processFile('ca va couter cher').content).toContain('coûter');
  });
});

describe('accents francais toujours corriges hors collocation anglaise', () => {
  // Un radical ambigu isole dans un contexte francais DOIT etre accentue.
  it('corrige "operations" francais isole', () => {
    expect(processFile('les operations de maintenance').content).toContain(
      'opérations',
    );
  });

  it('corrige "reference" francais isole', () => {
    expect(processFile('la reference au fichier de config').content).toContain(
      'référence',
    );
  });

  it('corrige "edition" francais isole', () => {
    expect(processFile('une nouvelle edition du manuel').content).toContain(
      'édition',
    );
  });

  it('corrige "generation" francais isole', () => {
    expect(processFile('la generation automatique de code').content).toContain(
      'génération',
    );
  });

  it('corrige "resilience" francais isole', () => {
    expect(processFile('la resilience du systeme').content).toContain(
      'résilience',
    );
  });
});

describe('Vague 7 - nouvelles regles (corrections francaises)', () => {
  const corrections = [
    ['Le probleme que NoSQL resout', 'résout'],
    ['les conflits se resolvent', 'résolvent'],
    ['comment resoudre ce probleme', 'résoudre'],
    ['le probleme est resolu', 'résolu'],
    ['le serveur repond a la requete', 'répond'],
    ['les deux services repondent', 'répondent'],
    ['il faut repondre vite', 'répondre'],
    ['demarrer le conteneur', 'démarrer'],
    ['redemarrer le service', 'redémarrer'],
    ['tu vas decouvrir MongoDB', 'découvrir'],
    ['tu decouvriras les concepts', 'découvriras'],
    ['avant d inserer des donnees', 'insérer'],
    ['un mecanisme interne', 'mécanisme'],
    ['les operateurs logiques', 'opérateurs'],
    ['un seul operateur', 'opérateur'],
    ['les caracteristiques du systeme', 'caractéristiques'],
    ["l'equipement reseau", 'équipement'],
    ['plusieurs equipements', 'équipements'],
    ['la deuxieme etape', 'deuxième'],
    ['la troisieme partie', 'troisième'],
    ['au debut du fichier', 'début'],
    ['le departement informatique', 'département'],
    ['un acces en ecriture', 'écriture'],
    ['des donnees heterogenes', 'hétérogènes'],
    ['une regression lineaire', 'linéaire'],
    ['un hote distant', 'hôte'],
    ['les hotes du cluster', 'hôtes'],
    ['un hotel de luxe', 'hôtel'],
    ['le depot git', 'dépôt'],
    ['une icone dans la barre', 'icône'],
    ['la hierarchie des classes', 'hiérarchie'],
    ['un batiment moderne', 'bâtiment'],
    ['topologie en etoile', 'étoile'],
    ['le prenom du client', 'prénom'],
    ['un composant reutilisable', 'réutilisable'],
    ['la frontiere du reseau', 'frontière'],
    ['situe derriere le proxy', 'derrière'],
    ['une reservation statique', 'réservation'],
    ['traiter separement', 'séparément'],
    ['cas d usage ideal', 'idéal'],
    ['un conteneur plus leger', 'léger'],
    ['un test reussi', 'réussi'],
    ['les defis a relever', 'défis'],
    ['la comptabilite analytique', 'comptabilité'],
    ['les inconvenients de la solution', 'inconvénients'],
    ['un resultat tres precis', 'très'],
  ];

  for (const [input, expected] of corrections) {
    it(`corrige "${input}" -> contient "${expected}"`, () => {
      expect(processFile(input).content).toContain(expected);
    });
  }
});

describe('Vague 7 - non-regression mots anglais / exclus', () => {
  // Mots anglais identiques a un mot francais accentuable : doivent rester INTACTS.
  const intact = [
    ['Lateral Movement via PsExec', 'Latéral'],
    ['Elevation of Privilege', 'Privilège'],
    ['screen resolution settings', 'résolution'],
    ['AWS region selection', 'région'],
    ['database replication and retention', 'réplication'],
    ['Set evaluation behavior', 'évaluation'],
    ['Data Execution Prevention', 'Prévention'],
    ['reflection in Java', 'réflection'],
    ['the meme is funny', 'mémé'],
    ['shell completion script', 'complétion'],
  ];

  for (const [input, forbidden] of intact) {
    it(`laisse intact "${input}" (pas de "${forbidden}")`, () => {
      expect(processFile(input).content).not.toContain(forbidden);
    });
  }

  // La regle "tres" -> "tres" ne doit JAMAIS corrompre un mot deja accentue
  // qui se termine par "...tres" (parametres, fenetres, metres, etres...).
  const tresEdgeCases = ['paramètres', 'fenêtres', 'mètres', 'êtres', 'hyperparamètres'];
  for (const word of tresEdgeCases) {
    it(`ne corrompt pas "${word}" en "...très"`, () => {
      expect(processFile(`les ${word} ici`).content).toContain(word);
      expect(processFile(`les ${word} ici`).content).not.toContain('très');
    });
  }

  // La regle "geant" -> "géant" et "sante" -> "santé" ne doivent JAMAIS matcher le
  // suffixe d'un mot deja accentue (en JS, \b ne voit pas les lettres accentuees :
  // "agrégeant" = "agré" + "geant"). Lookbehind requis.
  const geantSanteEdgeCases = [
    'agrégeant',
    'protégeant',
    'siégeant',
    'piégeant',
    'désagrégeant',
    'lésante',
    'archaïsante',
  ];
  for (const word of geantSanteEdgeCases) {
    it(`ne corrompt pas "${word}"`, () => {
      expect(processFile(`en ${word} ici`).content).toContain(word);
    });
  }

  // Mais les formes isolees restent corrigees.
  it('corrige "geant" isole en "géant"', () => {
    expect(processFile('un geant du web').content).toContain('géant');
  });

  it('corrige "sante" isole en "santé"', () => {
    expect(processFile('la sante publique').content).toContain('santé');
  });
});

describe('liens Markdown et URLs (non-regression octets NULL)', () => {
  it('preserve un lien Markdown [texte](URL) sans laisser de placeholder NULL', () => {
    const { content } = processFile('Voir [la doc](https://symfony.com/doc/operation) ici.');
    expect(content).not.toContain('\x00');
    expect(content).toContain('](https://symfony.com/doc/operation)');
  });

  it('accentue le libelle du lien mais laisse l\'URL et le texte intacts', () => {
    const result = applyRules('Voir [la definition](https://x.com/operation) du systeme');
    expect(result).toBe('Voir [la définition](https://x.com/operation) du système');
    expect(result).not.toContain('\x00');
  });

  it('gere plusieurs liens sur une meme ligne sans corruption', () => {
    const { content } = processFile('Voir [A](https://a.com/x) et [B](https://b.com/y).');
    expect(content).not.toContain('\x00');
    expect(content).toContain('https://a.com/x');
    expect(content).toContain('https://b.com/y');
  });

  it('preserve un lien relatif vers une fiche', () => {
    const { content } = processFile('Lire [la fiche](../01-docker/02-installation.md) avant.');
    expect(content).not.toContain('\x00');
    expect(content).toContain('](../01-docker/02-installation.md)');
  });

  it('ne laisse aucun octet NULL meme avec URL nue et code inline melanges', () => {
    const { content } = processFile('Doc `git config` sur https://example.com/definition et [lien](https://y.io/z).');
    expect(content).not.toContain('\x00');
    expect(content).toContain('`git config`');
    expect(content).toContain('https://example.com/definition');
  });
});
