import type { Counter, Props } from "../Card";
import { Plane } from "./Plane";
import * as Special from "./special";

type SpecialConstructor = { new (props: Props): Plane };

const specials: Map<string, SpecialConstructor> = new Map([
	["f133e42a-2962-4781-b413-ce2127f17c26", Special.PoolsOfBecoming],
	["7a425df4-7010-462e-9cb5-20389bac721c", Special.StairsToInfinity],
	["ab72ff80-738a-4468-aecf-5d806143f791", Special.NornsSeedcore],
	["2f3e71b6-0fd6-4ac5-a265-faaabe21177b", Special.TheFertileLandsOfSaulvinia],
]);

const counter: Map<string, Counter> = new Map([
	// Aretopolis
	[
		"d6ab4159-e04e-4991-8a9b-9da302c98e9d",
		{
			name: "Scroll",
			value: 0,
			start: 0,
			max: 10,
			reset: true,
		},
	],
	// Kilnspire District
	[
		"fc650404-991c-4639-b311-c35df81a254a",
		{
			name: "Charge",
			value: 0,
			start: 0,
			max: null,
			reset: false,
		},
	],
	// Mount Keralia
	[
		"e0dc9986-1099-4189-bfff-8f41bab9019d",
		{
			name: "Pressure",
			value: 0,
			start: 0,
			max: null,
			reset: false,
		},
	],
	// Naar Isle
	[
		"3e0bcf65-1eaf-440f-a59b-0b11e1106135",
		{
			name: "Flame",
			value: 0,
			start: 0,
			max: null,
			reset: false,
		},
	],
	// Pompeii
	[
		"5dc1deab-ce04-45c0-a4ff-c526a948e500",
		{
			name: "Eruption",
			value: 0,
			start: 1,
			max: null,
			reset: false,
		},
	],
	// Aplan Mortarium
	[
		"7c9d6193-1d50-4035-8c85-98c384f461be",
		{
			name: "Exposure",
			value: 0,
			start: 1,
			max: null,
			reset: false,
		},
	],
	// No Way Out (Playtest)
	[
		"995eede5-d3aa-42f8-9883-6e47a7c041bc",
		{
			name: "Dread",
			value: 3,
			start: 3,
			max: null,
			reset: true,
		},
	],
]);

export const build = (props: Props): Plane =>
	new (specials.get(props.id) ?? Plane)({
		...props,
		counter: counter.has(props.id) ? { ...counter.get(props.id)! } : undefined,
	});
