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
  passive: boolean;
  initiator?: string;
}

export type ExportedWallStates = Array<[StateKey, WallState]>;

export class WallStates extends Map<StateKey, WallState> {
  public constructor(states?: Array<[StateKey, WallState]>) {
    super(states);
  }

  public override get<T>(key: StateKey): T | undefined {
    return super.get(key) as T | undefined;
  }

  public apply(key: StateKey, op: StateOp, val?: WallState): void {
    switch(op) {
      case StateOp.SET:
        this.set(key, val as WallState);
        break;
      case StateOp.DELETE:
        this.delete(key);
        break;
    }
  }

  public export(): ExportedWallStates {
    return Array.from(this);
  }
}
