export type StackInterface = {
	ops: Array<unknown>;
	currentOp?: unknown;
	size: number;
	push: (payload: unknown) => void;
	pop: () => unknown | undefined;
};

export class Stack implements StackInterface {
	public ops: Array<unknown> = [];
	public currentOp?: unknown = undefined;

	public get size(): number {
		return this.ops.length + (this.currentOp ? 1 : 0);
	}

	public push(payload: unknown) {
		this.ops.push(payload);
	}

	public pop(): unknown | undefined {
		this.currentOp = this.ops.pop();
		return this.currentOp;
	}
}
