import { Map as BaseMap, MapProps } from '../Map';
import { AddActivePlaneInput, Exported, MapSpecs, MapType, PlaneswalkInput, ResolveInput } from '../MapInterface';
import { LightMap } from './LightMap';
import { WallStates } from '#/model/wall';
import { Deck } from '#/model/deck/Deck';
import { Patch, patch } from '#/utils/delta';

export class Multi extends BaseMap {
  public readonly mateStates: Map<string, LightMap>;

  public constructor(props: MapProps) {
    super(props);
    this.mateStates = new Map();
    this._active = props.active ?? [this._deck.drawPlane()];
  }

  public get specs(): MapSpecs {
    return { type: MapType.MULTI };
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

  public removeMate(peer: string): void {
    this.mateStates.delete(peer);
  }

  public apply(p: Patch, peer: string): void {
    if (p.event === '__init__') {
      const map = new LightMap({
        deck: new Deck([]),
        wallStates: new WallStates(),
      });
      map.restore(patch({}, p.delta!));
      if (map.hasStarted) {
        this.start();
      }
      this.mateStates.set(peer, map);
      return;
    }

    this.mateStates.get(peer)?.apply(p, peer);
  }

  public resolve(input: ResolveInput): void {
    return this.planeswalk(input);
  }

  public export(): Exported {
    return {
      ...super.dump(),
      deck: { cards: [], played: [] },
    };
  }
}
