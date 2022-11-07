import shuffle from 'lodash.shuffle';
import { mixins } from 'vue-class-component';
import { PickedLeft } from '../wall/reveal/BaseReveal';
import { Imgable } from '../Imgable';
import { Op, useMain } from '@/store/main';
import { Plane, PoolOfBecoming, StairsToInfinity } from '@/model/card';

export abstract class Map extends mixins(Imgable) {
  protected store = useMain();
  public showStackWall = false;

  public chaos(): void {
    if (
      this.store.map.active.length > 1 &&
      this.store.map.active.every(
        c => c instanceof PoolOfBecoming || c instanceof StairsToInfinity,
      )
    ) {
      this.showStackWall = true;
    } else {
      this.store.chaos({ card: this.store.map.active[0] });
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
