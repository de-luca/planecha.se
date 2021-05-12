import { Map } from '../map';

export abstract class Game {
    protected map: Map;

    public constructor(map: Map) {
      this.map = map;
    }
}
