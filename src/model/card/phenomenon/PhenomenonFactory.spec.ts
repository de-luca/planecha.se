import { describe, expect, it } from "vitest";
import { Phenomenon, PhenomenonFactory } from ".";
import type { Props } from "..";
import { InterplanarTunnel } from "./special";

const props: Props = {
	id: "00000000-0000-0000-000000000000",
	name: "Sip Coffee",
	typeLine: "Phenomenon",
	oracleText: "When you encounter Sip Coffee, take a sip of coffee.",
	isUB: true,
	sets: ["ABC"],
};

describe("PhenomenonFactory.build", () => {
	it("builds a simple Phenomenon", () => {
		expect(PhenomenonFactory.build(props)).toBeInstanceOf(Phenomenon);
	});

	it("builds a special Phenomenon", () => {
		props.id = "7812174b-2dc1-43e8-b98f-639905e20ab7";
		expect(PhenomenonFactory.build(props)).toBeInstanceOf(InterplanarTunnel);
	});
});
