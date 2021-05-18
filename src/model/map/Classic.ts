import { Container } from 'typedi';
import { Map } from './Map';
import { DeckProvider } from '../../services/DeckProvider';
import { Card, Plane } from '../card';

export class Classic extends Map {
  public constructor() {
    super();

    this.deck = Container.get(DeckProvider).getDeck();
    this._played = [];
    this._active = [this.drawPlane()];
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
