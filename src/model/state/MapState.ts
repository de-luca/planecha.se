export enum StateKey {
  REVEALER = 'REVEALER',
  PHENOMENON_WALL = 'PHENOMENON_WALL',
  ENCOUNTER_WALL = 'ENCOUNTER_WALL',
}

export enum StateOp {
  SET = 'set',
  DELETE = 'delete',
}

export interface State {
  passive: boolean;
}

export interface ExportedMapState {
  hasStarted: boolean;
  states: Array<[StateKey, State]>;
}

export class MapState extends Map<StateKey, State> {
  private hasStarted: boolean;

  public constructor(hasStarted: boolean = false, states?: Array<[StateKey, State]>) {
    super(states);
    this.hasStarted = hasStarted;
  }

  public static from(state: ExportedMapState): MapState {
    return new MapState(state.hasStarted, state.states);
  }

  public start(): void {
    this.hasStarted = true;
  }

  public apply(key: StateKey, op: StateOp, val: State): void {
    this[op](key, val);
  }

  public export(): ExportedMapState {
    return {
      hasStarted: this.hasStarted,
      states: Array.from(this),
    };
  }
}
