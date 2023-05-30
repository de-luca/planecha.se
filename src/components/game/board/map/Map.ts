import shuffle from 'lodash.shuffle';
import { PickedLeft } from '#board/wall/reveal/types';
import { Imgable } from '#/components/Imgable';
import { Op, useMain } from '#/store/main';
import { Plane, PoolsOfBecoming, StairsToInfinity } from '#/model/card';

export abstract class Map extends Imgable {
  protected store = useMain();
  public showStackWall = false;

  public planeswalk(..._params: Array<unknown>): void {
    throw new Error('Implement Me!');
  }

  public chaos(): void {
    if (
      this.store.map.active.length > 1 &&
      this.store.map.active.every(
        c => c instanceof PoolsOfBecoming || c instanceof StairsToInfinity,
      )
    ) {
      this.showStackWall = true;
    } else {
      this.store.map.active.forEach(card => this.store.chaos({ card }));
    }
  }

  public customChaos(planes: Array<Plane>): void {
    this.showStackWall = false;
    planes
      .reverse()
      .forEach(card => this.store.pushOpToStack(Op.CHAOS, { card }));
    this.store.resolveOpStack();
  }

  protected putBack(choices: PickedLeft): void {
    const payload = {
      top: choices.picked,
      bottom: shuffle(choices.left),
    };

    this.store.resolveReveal(payload);
  }
}
