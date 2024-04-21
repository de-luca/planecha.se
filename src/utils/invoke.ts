// biome-ignore lint/suspicious/noExplicitAny: ignore
type Fun<TA extends any[] = any[], TR = any> = (...args: TA) => TR;

export const once = <T extends Fun>(fun: T): T => {
	let invs = 0;
	return ((...args: Parameters<T>) => {
		if (invs < 1) {
			invs++;
			return fun(...args);
		}
	}) as T;
};

export const resolveAfter = <T extends Fun, U extends Fun>(
	fun: T,
	times: number,
	resolve: U,
): T => {
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
};
