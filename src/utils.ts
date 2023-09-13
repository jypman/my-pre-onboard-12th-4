export const getThousandUnit = (int: number): string =>
  new Intl.NumberFormat().format(int);

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
