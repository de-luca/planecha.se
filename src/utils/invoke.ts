// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fun<TA extends any[] = any[], TR = any> = (...args: TA) => TR;

export function once<T extends Fun>(fun: T): T {
  let invs = 0;
  return ((...args: Parameters<T>) => {
    if (invs < 1) {
      invs++;
      return fun(...args);
    }
  }) as T;
}

export function resolveAfter<T extends Fun, U extends Fun>(fun: T, times: number, resolve: U): T {
  let invs = 0;
  return ((...args: Parameters<T>) => {
    if (invs < times) {
      invs++;
      const out = fun(...args);
      if (invs === times) {
        resolve(...args);
      }
      return out;
    }
  }) as T;
}
