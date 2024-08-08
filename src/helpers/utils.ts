export const encodeUrl = (
  strings: TemplateStringsArray,
  ...values: (string | number)[]
) =>
  strings.reduce((result, string, i) => {
    const value = values[i];
    return result + string + (value ? encodeURIComponent(value) : '');
  }, '');
