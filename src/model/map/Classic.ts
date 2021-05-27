import { Map, Props } from './Map';
import { Card, Plane } from '../card';
import { MapType } from './MapInterface';

export class Classic extends Map {
  public constructor(props: Props) {
    super(props);

    this._active = props.active ?? [this.drawPlane()];
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

  public planeswalk(): void {
    // Put all active cards away
    this.played.push(...this._active);
    this._active = [this.draw()];
  }
}
