import { Map, MapProps } from './Map';
import { MapSpecs, MapType, PlaneswalkInput, ResolveInput } from './MapInterface';

export class Classic extends Map {
  public constructor(props: MapProps) {
    super(props);
    this.active = props.active ?? [this.deck.drawPlane().card];
  }

  public get specs(): MapSpecs {
    return { type: MapType.CLASSIC };
  }

  public planeswalk(input: PlaneswalkInput): void {
    this.active.forEach(c => c.leave());
    this.deck.setPlayed(...this.active);

    if ('planes' in input) {
      this.active = input.planes;
    } else {
      this.active = [this.deck.draw().card];
    }

    this.active.forEach(c => c.enter(this.walls, input.initiator));
  }

  public resolve(input: ResolveInput): void {
    return this.planeswalk(input);
  }
}
