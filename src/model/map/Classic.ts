import { Map, Props } from './Map';
import { Card, Plane } from '../card';
import { Coordinates, MapType } from './MapInterface';

export class Classic extends Map {
  public hasStarted = true;

  public constructor(props: Props) {
    super(props);

    this.active = props.active ?? [this.deck.drawPlane().card];
  }

  public get type(): MapType {
    return MapType.CLASSIC;
  }

  public planeswalk(
    _coordinates?: Coordinates,
    passive: boolean = false,
    mateId?: string,
  ): boolean {
    this.active.forEach(c => c.leave());
    this.deck.play(...this.active);

    const { card, shuffled } = this.deck.draw();
    this.active = [ card ];
    this.active.forEach(c => c.enter(passive, mateId));

    return shuffled;
  }

  public customPlaneswalk(planes: Array<Plane>): void {
    this.active.forEach(c => c.leave());
    this.deck.play(...this.active);
    this.active = planes;
    this.active.forEach(c => c.enter());
  }

  public planeswalkFromPhenomenon(passive: boolean = false, mateId?: string): boolean {
    return this.planeswalk(undefined, passive, mateId);
  }
}
