import { Card, Type } from '../Card';
import { WallManager } from '#/model/wall';

export class Phenomenon extends Card {
  public get type(): Type {
    return 'Phenomenon';
  }

  public chaos(): void {
    return;
  }

  public enter(_w: WallManager, _i: string): void {
    return;
  }

  public leave(): void {
    return;
  }
}
