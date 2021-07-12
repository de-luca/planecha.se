import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { Map, Props } from '.';
import { Card, Plane } from '../card';
import { MapType } from './MapInterface';
import { eventBus } from '@/services/EventBus';

class TestMap extends Map {
  public get type(): MapType {
    return MapType.EMPTY;
  }
  public planeswalk(): boolean {
    throw new Error('Method not implemented.');
  }
  public customPlaneswalk(): void {
    throw new Error('Method not implemented.');
  }
}

describe('Map.ready', () => {
  it('resolves', async() => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });

    let ready = false;
    try {
      await map.ready;
      ready = true;
    } catch (e) {}

    expect(ready).toEqual(true);
  });
});

describe('Map.chaos', () => {
  it('triggers chaos', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    map.active.forEach(card => card.chaos = jest.fn());
    map.chaos();
    map.active.forEach(card => expect(card.chaos).toHaveBeenCalled());
  });
});

describe('Map.updateCounter', () => {
  it('updates card counters', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
    });
    map.active = [ map['draw']().card ];
    map.active.forEach((card) => {
      if (card instanceof Plane) {
        card.updateCounter = jest.fn();
      }
    });
    map.updateCounter(map.active[0].id, 1);
    expect((map.active[0] as Plane).updateCounter).toHaveBeenCalled();
  });
});

describe('Map.draw', () => {
  it('draws a card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const drawn = map['draw']();
    expect(drawn.card).toBeInstanceOf(Card);
    expect(drawn.shuffled).toEqual(false);
    expect(map.deck).toHaveLength(85);
  });

  it('reshuffle and draws a card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    // eslint-disable-next-line prefer-destructuring
    const deck = map.deck;
    map.played = deck;
    map.deck = [];

    const drawn = map['draw']();

    expect(drawn.card).toBeInstanceOf(Card);
    expect(drawn.shuffled).toEqual(true);
    expect(map.deck).toHaveLength(85);
  });
});

describe('Map.shuffleDeck', () => {
  it('shuffled played cards back', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });

    const deck = map.deck;
    map.played = deck;
    map.deck = [];

    map['shuffleDeck']();

    expect(map.deck).toHaveLength(86);
  });
});

describe('Map.revealUntil', () => {
  it('reveals a given number of requested Plane', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    map.revealUntil(2, Plane);
    expect(map.revealed?.relevant).toHaveLength(2);
    for (const card of map.revealed?.relevant ?? []) {
      expect(card).toBeInstanceOf(Plane);
    }
    for (const card of map.revealed?.others ?? []) {
      expect(card).not.toBeInstanceOf(Plane);
    }
  });

  it('reveals a given number of requested Card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    map.revealUntil(2);
    expect(map.revealed?.relevant).toHaveLength(2);
    expect(map.revealed?.others).toHaveLength(0);
    for (const card of map.revealed?.relevant ?? []) {
      expect(card).toBeInstanceOf(Card);
    }
  });
});

describe('Map.resolveReveal', () => {
  it('puts back cards on top and bottom', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });

    const putOnTop = jest.spyOn(map, 'putOnTop');
    const putOnTheBottom = jest.spyOn(map, 'putOnTheBottom');
    const clearRevealed = jest.spyOn(map, 'clearRevealed');
    eventBus.emit = jest.fn();

    map.revealUntil(2);
    const top = map.revealed?.relevant[0] as Card;
    const bottom = map.revealed?.relevant[1] as Card;
    map.resolveReveal([top], [bottom]);
    expect(putOnTop).toHaveBeenCalled();
    expect(putOnTheBottom).toHaveBeenCalled();
    expect(clearRevealed).toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalled();

    expect(map.deck[0]).toEqual(top);
    expect(map.deck[map.deck.length - 1]).toEqual(bottom);
    expect(map.revealed).toBeUndefined();
  });
});

describe('Map.putOnTop', () => {
  it('puts given cards on top of the deck', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    // pick a card from the deck
    const card = map.deck[1];

    map.putOnTop([card]);
    expect(map.deck).toHaveLength(87);
    expect(map.deck[0]).toEqual(card);
  });
});

describe('Map.putOnTheBottom', () => {
  it('puts given cards on the bottom of the deck', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    // pick a card from the deck
    const card = map.deck[1];

    map.putOnTheBottom([card]);
    expect(map.deck).toHaveLength(87);
    expect(map.deck[map.deck.length - 1]).toEqual(card);
  });
});

describe('Map.clearRevealed', () => {
  it('sets revealed to nothing', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    map.revealUntil(5);
    expect(map.revealed).not.toBeUndefined();
    map.clearRevealed();
    expect(map.revealed).toBeUndefined();
  });
});

describe('Map.export', () => {
  it('exports the state of the map', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
    });
    const exported = map.export();
    expect(exported.type).toEqual(MapType.EMPTY);
    expect(exported.deck).toHaveLength(map.deck.length);
    expect(exported.played).toHaveLength(map.played.length);
    expect(exported.active).toHaveLength(map.active.length);
    for (const card of map.active) {
      expect(exported.active).toContain(card.id);
    }
  });
});
