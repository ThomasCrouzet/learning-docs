const {
  extractSnippets,
  classifySnippet,
  fragmentSkipReason,
  buildValidationJob,
  runInlineJob,
  processExitCode,
} = require('../lib/snippet-runtime');

describe('extractSnippets', () => {
  it('extrait lang et corps', () => {
    const content = ['# x', '', '```javascript', 'const a = 1;', '```', '', '```text', 'hi', '```', ''].join(
      '\n'
    );
    const s = extractSnippets(content, 't.md');
    expect(s).toHaveLength(2);
    expect(s[0].lang).toBe('javascript');
    expect(s[0].body).toBe('const a = 1;');
    expect(s[1].lang).toBe('text');
  });
});

describe('classifySnippet', () => {
  it('skip mermaid / text', () => {
    expect(classifySnippet({ lang: 'mermaid', body: 'graph TD' }).status).toBe('skipped_lang');
    expect(classifySnippet({ lang: 'text', body: 'hello' }).status).toBe('skipped_lang');
  });

  it('candidate pour js autonome', () => {
    expect(classifySnippet({ lang: 'javascript', body: 'const x = 1;\n' }).status).toBe('candidate');
  });

  it('skip fragment placeholder', () => {
    expect(
      classifySnippet({ lang: 'bash', body: 'cd [COLLER LE CHEMIN]\n' }).status
    ).toBe('skipped_fragment');
  });
});

describe('runInlineJob', () => {
  it('valide JSON correct', () => {
    expect(runInlineJob({ inline: 'json', body: '{"a":1}' }).ok).toBe(true);
  });

  it('rejette JSON invalide', () => {
    expect(runInlineJob({ inline: 'json', body: '{a:}' }).ok).toBe(false);
  });
});

describe('buildValidationJob', () => {
  it('produit node --check pour js', () => {
    const job = buildValidationJob(
      { lang: 'javascript', body: 'const a=1', file: 'a.md', index: 0 },
      '/tmp/w'
    );
    expect(job.argv[0]).toBe('node');
    expect(job.argv).toContain('--check');
    expect(job.files).toHaveLength(1);
  });
});

describe('processExitCode', () => {
  it('strict mode exits non-zero when fail > 0', () => {
    expect(processExitCode({ fail: 1, unclassified: 0, skipped_without_reason: 0 }, { strict: true })).toBe(
      1
    );
    expect(processExitCode({ fail: 0, unclassified: 0, skipped_without_reason: 0 }, { strict: true })).toBe(
      0
    );
  });
});

describe('fragmentSkipReason', () => {
  it('skips PHP method fragments without a class', () => {
    expect(
      fragmentSkipReason('php', 'public function getRoles(): array\n{\n    return [];\n}\n')
    ).toBe('fragment_method_with_modifier_without_class');
    expect(
      fragmentSkipReason(
        'php',
        '<?php\n#[ORM\\Column]\nprivate ?int $id = null;\n'
      )
    ).toBe('fragment_method_with_modifier_without_class');
    expect(
      fragmentSkipReason('php', '<?php\nclass User {\n    public function id(): int { return 1; }\n}\n')
    ).toBeNull();
    expect(
      fragmentSkipReason('php', '<?php\n#[Route("/products", "product_list")]\n')
    ).toBe('php_attribute_fragment');
    expect(
      fragmentSkipReason(
        'php',
        'function calculatePrice($a){return $a;}\nfunction calculatePrice(int $a): int {return $a;}\n'
      )
    ).toBe('duplicate_decl_before_after_demo');
    expect(
      fragmentSkipReason('php', "ChoiceField::new('status')->setChoices(\$choices)\n")
    ).toBe('php_missing_terminator');
  });

  it('detecte shell session', () => {
    expect(fragmentSkipReason('bash', '$ ls -la\n')).toBe('shell_session_prompt');
  });

  it('detecte session REPL Node', () => {
    expect(fragmentSkipReason('javascript', '> 2 + 2\n4\n')).toBe('nodejs_repl_session');
  });

  it('detecte catalogue multi-objets (filtres Mongo)', () => {
    expect(
      fragmentSkipReason(
        'javascript',
        '// filtre\n{ nom: "Alice" }\n\n// autre\n{ age: { $gt: 25 } }\n'
      )
    ).toBe('multi_object_literal_catalog');
  });

  it('detecte ellipsis pedagogique', () => {
    expect(fragmentSkipReason('javascript', "app.get('/x', ...);\n")).toBe('ellipsis_placeholder');
  });

  it('detecte session HTTP', () => {
    expect(fragmentSkipReason('javascript', 'PUT /books/1\n{ "a": 1 }\n')).toBe('http_session_not_js');
  });

  it('detecte magic Jupyter', () => {
    expect(fragmentSkipReason('python', '%%timeit\nimport numpy as np\n')).toBe('jupyter_magic');
    expect(fragmentSkipReason('python', '%who\n')).toBe('jupyter_magic');
    expect(fragmentSkipReason('python', '!pip list\n')).toBe('jupyter_magic');
  });

  it('detecte elif sans if (insertion)', () => {
    expect(
      fragmentSkipReason('python', 'elif args.commande == "search":\n    print(1)\n')
    ).toBe('python_elif_without_if');
  });

  it('detecte return hors fonction (extrait handler)', () => {
    expect(fragmentSkipReason('python', 'return {"ok": True}\n')).toBe(
      'python_return_outside_function'
    );
  });

  it('detecte fragment CDK', () => {
    expect(
      fragmentSkipReason(
        'typescript',
        'new s3.Bucket(this, "Bucket", { encryption: s3.BucketEncryption.S3_MANAGED });\n'
      )
    ).toBe('cdk_construct_fragment');
  });

  it('detecte methode public sans class', () => {
    expect(
      fragmentSkipReason(
        'typescript',
        '  public listerTriees(filtre?: Filtre): Tache[] {\n    return [];\n  }\n'
      )
    ).toBe('fragment_method_with_modifier_without_class');
  });

  it('detecte sujet if non declare (suite de fiche)', () => {
    expect(
      fragmentSkipReason(
        'typescript',
        'if (config.port !== undefined) {\n  console.log(config.port);\n}\n'
      )
    ).toBe('fragment_undeclared_subject');
  });

  it('detecte helper non defini', () => {
    expect(
      fragmentSkipReason(
        'typescript',
        'const resultat = parserConfig(json);\nif (resultat.succes) {\n  console.log(resultat.donnees);\n}\n'
      )
    ).toBe('fragment_calls_undefined_helper');
  });
});

describe('syntax errors must not be auto-skipped as fragments', () => {
  it('classifie un JS autonome comme candidate même s il est syntaxiquement faux', () => {
    // Le runner doit ensuite le marquer fail, pas skipped_fragment
    const c = classifySnippet({
      lang: 'javascript',
      body: 'const x = ;\n',
    });
    expect(c.status).toBe('candidate');
  });

  it('classifie un Python indenté faux comme candidate (doit fail à l exécution)', () => {
    const c = classifySnippet({
      lang: 'python',
      body: 'if True:\nprint(1)\n',
    });
    expect(c.status).toBe('candidate');
  });

  it('ne pre-skip pas IndentationError Python (doit rester candidate)', () => {
    // Le runner exécute py_compile : IndentationError → fail, jamais soft-skip
    expect(
      classifySnippet({
        lang: 'python',
        body: 'def f():\nreturn 1\n',
      }).status
    ).toBe('candidate');
  });

  it('skip un header Python seul', () => {
    const c = classifySnippet({ lang: 'python', body: 'if True:\n' });
    expect(c.status).toBe('skipped_fragment');
  });

  it('ne soft-skip pas un SyntaxError JS genérique via un motif trop large', () => {
    // Doit rester candidate : le harness le marquera fail
    expect(
      classifySnippet({
        lang: 'javascript',
        body: 'function broken( {\n  return 1;\n}\n',
      }).status
    ).toBe('candidate');
  });

  it('ne traite pas le HTML dans du jQuery comme du TSX', () => {
    expect(
      classifySnippet({
        lang: 'javascript',
        body: "$(function() {\n  $('#liste').append('<li>x</li>');\n});\n",
      }).status
    ).toBe('candidate');
  });

  it('ne skip pas un for-loop autonome comme méthode de classe', () => {
    expect(
      classifySnippet({
        lang: 'javascript',
        body: 'for (var i = 0; i < 3; i++) {\n  console.log(i);\n}\nconsole.log(i);\n',
      }).status
    ).toBe('candidate');
  });

  it('JS syntax-only : appel a un helper non defini reste candidate', () => {
    expect(
      classifySnippet({
        lang: 'javascript',
        body: 'const profil2 = creerProfil("Bob", "trente");\n',
      }).status
    ).toBe('candidate');
  });
});
