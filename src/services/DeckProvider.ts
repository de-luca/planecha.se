import { Container, Service } from 'typedi';
import _shuffle from 'lodash.shuffle';
import {
  CardFactory,
  Card,
  Props,
  Plane,
} from '../model/card';

import cards from '../assets/cards.json';

@Service()
export class DeckProvider {
    private cards: Array<Card>;

    public constructor() {
      const factory = Container.get(CardFactory);
      this.cards = (cards as Array<Props>).map((c) => factory.build(c));
    }

    public getDeck(): Array<Card> {
      return _shuffle(this.cards);
    }

    public getPlaneDeck(): Array<Plane.Plane> {
      return this.getDeck()
        .filter((c) => c instanceof Plane.Plane) as Array<Plane.Plane>;
    }
}
