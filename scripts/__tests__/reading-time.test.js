const { calculateReadingTime } = require('../lib/reading-time');

describe('calculateReadingTime', () => {
  it('retourne "5 min" pour un contenu vide', () => {
    expect(calculateReadingTime('')).toBe('5 min');
  });

  it('retourne "5 min" pour un texte court (minimum)', () => {
    // 100 mots, 0 blocs -> 100/200 = 0.5 min -> arrondi 0 -> max(5,0) = 5
    const words = Array(100).fill('mot').join(' ');
    expect(calculateReadingTime(words)).toBe('5 min');
  });

  it('retourne "10 min" pour 2000 mots sans blocs de code', () => {
    // 2000/200 = 10 -> arrondi 10
    const words = Array(2000).fill('mot').join(' ');
    expect(calculateReadingTime(words)).toBe('10 min');
  });

  it('ajoute 2 min par bloc de code', () => {
    // 200 mots + 5 blocs = 200/200 + 5*2 = 1 + 10 = 11 -> arrondi 10
    const words = Array(200).fill('mot').join(' ');
    const codeBlocks = Array(5).fill('```bash\ncommande\n```').join('\n');
    expect(calculateReadingTime(words + '\n' + codeBlocks)).toBe('10 min');
  });

  it('exclut les mots dans les blocs de code du compte', () => {
    // Le texte dans les blocs de code ne doit pas etre compte comme mots
    const content = 'Mot1 mot2 mot3\n```bash\nlongue commande avec plein de mots\n```\nMot4 mot5';
    const result = calculateReadingTime(content);
    // 5 mots + 1 bloc = 5/200 + 2 = 2.025 -> arrondi 0 -> max(5,0) = 5
    expect(result).toBe('5 min');
  });

  it('arrondit au multiple de 5 le plus proche', () => {
    // 1400 mots, 3 blocs -> 1400/200 + 3*2 = 7 + 6 = 13 -> arrondi 15
    const words = Array(1400).fill('mot').join(' ');
    const codeBlocks = Array(3).fill('```js\ncode\n```').join('\n');
    expect(calculateReadingTime(words + '\n' + codeBlocks)).toBe('15 min');
  });

  it('gere un grand contenu', () => {
    // 4000 mots, 10 blocs -> 4000/200 + 10*2 = 20 + 20 = 40
    const words = Array(4000).fill('mot').join(' ');
    const codeBlocks = Array(10).fill('```php\ncode\n```').join('\n');
    expect(calculateReadingTime(words + '\n' + codeBlocks)).toBe('40 min');
  });
});
