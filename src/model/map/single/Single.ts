import { Map, MapProps } from '../Map';
import { AddActivePlaneInput, MapSpecs, MapType, PlaneswalkInput, ResolveInput } from '../MapInterface';

export class Single extends Map {
  public constructor(props: MapProps) {
    super(props);
    this._active = props.active ?? [this._deck.drawPlane()];
  }

  public get specs(): MapSpecs {
    return { type: MapType.SINGLE };
  }

  public planeswalk(input: PlaneswalkInput): void {
    this._active.forEach(c => c.leave());
    this._deck.setPlayed(...this.active);

    if ('planes' in input) {
      this._active = input.planes;
    } else {
      this._active = [this._deck.draw()];
    }

    this.active.forEach(c => c.enter(this._wallStates, input.initiator));
  }

  public addActivePlane(input: AddActivePlaneInput): void {
    this._active.push(input.plane);
    input.plane.enter(this._wallStates, input.initiator);
  }

  public resolve(input: ResolveInput): void {
    return this.planeswalk(input);
  }
}
