import { describe, expect, it } from "vitest";
import { Card, type Type } from "./Card";

class TestCard extends Card {
	public get type(): Type {
		throw new Error("Method not implemented.");
	}
	public chaos(): void {
		throw new Error("Method not implemented.");
	}
	public enter(): void {
		throw new Error("Method not implemented.");
	}
	public leave(): void {
		throw new Error("Method not implemented.");
	}
}

describe("Card.dump", () => {
	it("exports the state of the card", () => {
		const card = new TestCard({
			id: "00000000-0000-0000-0000-000000000000",
			name: "Test Card",
			typeLine: "test type",
			oracleText: "some test text",
			isUB: true,
			sets: ["ABC"],
		});

		expect(card.dump()).toEqual({
			id: "00000000-0000-0000-0000-000000000000",
		});
	});
});
