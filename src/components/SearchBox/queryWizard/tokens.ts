export type Operator = 'and' | 'or';
export type Token =
  | { type: 'string'; value: string }
  | { type: 'logical'; value: Operator }
  | { type: 'operator'; value: '=' }
  | { type: 'bracket'; value: 'opening' | 'closing' }
  | { type: 'anything' };

const tokenRegex = /\s+and\s+|\s+or\s+|\*|=|\(|\)|[\w:]+|"[^"]*"/g;

// TODO: Throw when the string contains something that isn't parsed, currently it is just ignored

export function tokenize(inputValue: string) {
  const matches = Array.from(inputValue.matchAll(tokenRegex));

  const tokens: Token[] = matches.map(([match]) => {
    const value = match.trim();
    switch (value) {
      case 'and':
      case 'or':
        return { type: 'logical', value };
      case '=':
        return { type: 'operator', value };
      case '*':
        return { type: 'anything' };
      case '(':
      case ')':
        const isOpening = value === '(';
        return { type: 'bracket', value: isOpening ? 'opening' : 'closing' };
      default:
        const isQuoted = value.startsWith('"') && value.endsWith('"');
        const string = isQuoted ? value.slice(1, -1) : value;
        return { type: 'string', value: string };
    }
  });

  return tokens;
}
