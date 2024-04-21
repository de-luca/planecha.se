import { beforeEach, describe, expect, it } from "bun:test";
import { createPinia, setActivePinia } from "pinia";
import { type BuildProps, MapType, Single } from "#/model/map";
import { useMain } from "./main";

beforeEach(() => {
	setActivePinia(createPinia());
});

describe("default state", () => {
	it("has empty data", () => {
		const store = useMain();
		expect(store.net).toBeUndefined();
		expect(() => {
			store.map;
		}).toThrow();
		expect(store.mates.size).toBe(0);
		expect(store.feed).toHaveLength(0);
	});
});

describe("init", () => {
	it("inits with a map and data", () => {
		const store = useMain();
		const props: BuildProps = { type: MapType.SINGLE };
		store.init(props);
		expect(store.net).toBeUndefined();
		expect(store.map).toBeInstanceOf(Single);
		expect(store.mates.size).toBe(0);
		expect(store.feed).toHaveLength(0);
	});
});

describe("leave", () => {
	it("cleans store", () => {
		const store = useMain();
		const props: BuildProps = { type: MapType.SINGLE };
		store.init(props);
		store.leave();
		expect(store.net).toBeUndefined();
		expect(() => {
			store.map;
		}).toThrow();
		expect(store.mates.size).toBe(0);
		expect(store.feed).toHaveLength(0);
	});
});
