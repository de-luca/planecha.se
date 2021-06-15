import { Map, Props } from './Map';
import { Card, Plane } from '../card';
import { Coordinates, MapType } from './MapInterface';

export class Classic extends Map {
  public constructor(props: Props) {
    super(props);

    this.active = props.active ?? [this.drawPlane()];
  }

  public get type(): MapType {
    return MapType.CLASSIC;
  }

  private drawPlane(): Plane {
    let card: Card;
    let found = false;

    do {
      // Draw card
      card = this.draw();
      if (card instanceof Plane) {
        // it's a plane
        found = true;
      } else {
        // it's a phenomenon, put it in the bottom
        this.deck.push(card);
      }
    } while (!found);

    return card as Plane;
  }

  public planeswalk(_coordinates?: Coordinates, passive: boolean = false): void {
    this.active.forEach(c => c.leave());
    this.played.push(...this.active);
    this.active = [this.draw()];
    this.active.forEach(c => c.enter(passive));
  }
  
  public customPlaneswalk(
    planes: Array<Plane>,
    _coordinates?: Coordinates,
    passive: boolean = false,
  ): void {
    this.active.forEach(c => c.leave());
    this.played.push(...this.active);
    this.active = planes;
    this.active.forEach(c => c.enter(passive));
  }
}
