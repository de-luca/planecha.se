export enum StateKey {
  REVEALER = 'REVEALER',
  PHENOMENON_WALL = 'PHENOMENON_WALL',
  ENCOUNTER_WALL = 'ENCOUNTER_WALL',
}

export enum StateOp {
  SET = 'set',
  DELETE = 'delete',
}

export interface WallState {
  initiator: string;
}

interface ApplySetInput {
  key: StateKey;
  op: StateOp.SET;
  val: WallState;
}
interface ApplyDelInput {
  key: StateKey;
  op: StateOp.DELETE;
}

export type ApplyInput = ApplySetInput | ApplyDelInput;
export type ExportedWallStates = Array<[StateKey, WallState]>;

export class WallStates extends Map<StateKey, WallState> {
  public constructor(states?: Array<[StateKey, WallState]>) {
    super(states);
  }

  public override get<T>(key: StateKey): T | undefined {
    return super.get(key) as T | undefined;
  }

  public apply(input: ApplyInput): void {
    switch(input.op) {
      case StateOp.SET:
        this.set(input.key, input.val);
        break;
      case StateOp.DELETE:
        this.delete(input.key);
        break;
    }
  }

  public export(): ExportedWallStates {
    return Array.from(this);
  }
}
