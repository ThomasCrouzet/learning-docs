const { stripCustomTags } = require('../lib/yaml-utils');

describe('stripCustomTags', () => {
  it('supprime !!python/name: tags', () => {
    const input = 'handler: !!python/name:material.extensions.emoji.twemoji';
    const result = stripCustomTags(input);
    expect(result).toBe('handler: "__python_tag__"');
  });

  it('supprime !ENV [...] tags', () => {
    const input = 'site_url: !ENV [MKDOCS_SITE_URL, ""]';
    const result = stripCustomTags(input);
    expect(result).toBe('site_url: ""');
  });

  it('preserve le reste du YAML', () => {
    const input = 'theme:\n  name: material\n  language: fr';
    expect(stripCustomTags(input)).toBe(input);
  });

  it('gere plusieurs tags dans un document', () => {
    const input = 'a: !!python/name:foo\nb: !ENV [BAR, ""]\nc: normal';
    const result = stripCustomTags(input);
    expect(result).toContain('"__python_tag__"');
    expect(result).toContain('b: ""');
    expect(result).toContain('c: normal');
  });
});
