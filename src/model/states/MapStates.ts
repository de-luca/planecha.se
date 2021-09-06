export enum StateKey {
  REVEALER = 'REVEALER',
  PHENOMENON_WALL = 'PHENOMENON_WALL',
  ENCOUNTER_WALL = 'ENCOUNTER_WALL',
}

export enum StateOp {
  SET = 'set',
  DELETE = 'delete',
}

export interface MapState {
  passive: boolean;
  initiator?: string;
}

export type ExportedMapState = Array<[StateKey, MapState]>;

export class MapStates extends Map<StateKey, MapState> {
  public constructor(states?: Array<[StateKey, MapState]>) {
    super(states);
  }

  public override get<T>(key: StateKey): T | undefined {
    return super.get(key) as T | undefined;
  }

  public apply(key: StateKey, op: StateOp, val?: MapState): void {
    switch(op) {
      case StateOp.SET:
        this.set(key, val as MapState);
        break;
      case StateOp.DELETE:
        this.delete(key);
        break;
    }
  }

  public export(): ExportedMapState {
    return Array.from(this);
  }
}
