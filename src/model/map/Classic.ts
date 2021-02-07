import { Container } from 'typedi';
import { Map } from './Map';
import { DeckProvider } from '../../services/DeckProvider';
import { Card, Plane } from '../card';
import { shuffle as _shuffle } from 'lodash';

export class Classic extends Map {
    public constructor() {
        super();
        
        this.deck = Container.get(DeckProvider).getDeck();
        this.played = [];
        this.active = [this.drawPlane()];
    }

    private drawPlane(): Plane.Plane {
        let card: Card;
        let found = false;

        do {
            // Draw card
            card = this.draw();
            if (card instanceof Plane.Plane) {
                // it's a plane
                found = true;
            } else {
                // it's a phenomenon, put it in the bottom
                this.deck.push(card);
            }
        } while (!found);

        return card as Plane.Plane;
    }

    public planeswalk(): void {
        // Put all active cards away
        this.played.push(...this.active);
        this.active = [this.draw()];
    }
}