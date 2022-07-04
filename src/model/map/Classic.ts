import { Map, MapProps } from './Map';
import { MapSpecs, MapType, PlaneswalkInput, ResolveInput } from './MapInterface';

export class Classic extends Map {
  public constructor(props: MapProps) {
    super(props);
    this._active = props.active ?? [this._deck.drawPlane().card];
  }

  public get specs(): MapSpecs {
    return { type: MapType.CLASSIC };
  }

  public planeswalk(input: PlaneswalkInput): void {
    this._active.forEach(c => c.leave());
    this._deck.setPlayed(...this.active);

    if ('planes' in input) {
      this._active = input.planes;
    } else {
      this._active = [this._deck.draw().card];
    }

    this.active.forEach(c => c.enter(this._wallStates, input.initiator));
  }

  public resolve(input: ResolveInput): void {
    return this.planeswalk(input);
  }
}
