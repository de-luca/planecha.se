import { Plane } from '../card';
import { Map, MapProps } from './Map';
import { MapSpecs, MapType } from './MapInterface';

export class Classic extends Map {
  public constructor(props: MapProps) {
    super(props);
    this.active = props.active ?? [this.deck.drawPlane().card];
  }

  public get specs(): MapSpecs {
    return { type: MapType.CLASSIC };
  }

  public planeswalk(
    _coordinates?: Coordinates,
    passivity?: Passivity,
  ): boolean {
    this.active.forEach(c => c.leave());
    this.deck.setPlayed(...this.active);

    const { card, shuffled } = this.deck.draw();
    this.active = [ card ];
    this.active.forEach(c => c.enter(this.walls, passivity));

    return shuffled;
  }

  public customPlaneswalk(planes: Array<Plane>): void {
    this.active.forEach(c => c.leave());
    this.deck.setPlayed(...this.active);
    this.active = planes;
    this.active.forEach(c => c.enter(this.walls));
  }

  public resolve(passivity: Passivity): boolean {
    return this.planeswalk(undefined, passivity);
  }
}
