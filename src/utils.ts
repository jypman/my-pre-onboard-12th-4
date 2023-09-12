export const getThousandUnit = (int: number): string =>
  new Intl.NumberFormat().format(int);
