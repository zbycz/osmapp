export const roundNumber = (number: number, digits: number = 3) => {
  const squaredDigits = 10 ** digits;
  return Math.round((number + Number.EPSILON) * squaredDigits) / squaredDigits;
};
