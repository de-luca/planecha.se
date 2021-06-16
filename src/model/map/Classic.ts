import { Map, Props } from './Map';
import { Card, Plane } from '../card';
import { Coordinates, MapType } from './MapInterface';

export class Classic extends Map {
  public constructor(props: Props) {
    super(props);

    this.active = props.active ?? [this.drawPlane().card];
  }

  public get type(): MapType {
    return MapType.CLASSIC;
  }

  private drawPlane(): { card: Plane, shuffled: boolean } {
    let card: Card;
    let shuffled: boolean;
    let found = false;

    do {
      // Draw card
      ({ card, shuffled } = this.draw());
      if (card instanceof Plane) {
        // it's a plane
        found = true;
      } else {
        // it's a phenomenon, put it in the bottom
        this.deck.push(card);
      }
    } while (!found);

    return { card: card as Plane, shuffled };
  }

  public planeswalk(_coordinates?: Coordinates, passive: boolean = false): boolean {
    this.active.forEach(c => c.leave());
    this.played.push(...this.active);
    
    const { card, shuffled } = this.draw();
    this.active = [card];
    this.active.forEach(c => c.enter(passive));
    
    return shuffled;
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
