import { Container } from 'typedi';
import { DeckProvider } from '@/services/DeckProvider';
import { eventBus } from '@/services/EventBus';
import { Card, Plane } from '../card';
import { Map, MapSpecs, MapType } from '.';
import { WallStates } from '../wall';

class TestMap extends Map {
  public get specs(): MapSpecs {
    return { type: MapType.EMPTY };
  }
  public testActive(): void {
    this.active = [ this.deck.draw().card ];
  }
  public planeswalk(): boolean {
    throw new Error('Method not implemented.');
  }
  public customPlaneswalk(): void {
    throw new Error('Method not implemented.');
  }
  public resolve(): boolean {
    throw new Error('Method not implemented.');
  }
}

jest.mock('@/services/getEnv');

describe('Map.ready', () => {
  it('resolves', async() => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      states: new WallStates(),
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
      states: new WallStates(),
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
      states: new WallStates(),
    });
    map.testActive();
    map.active.forEach((card) => {
      if (card instanceof Plane) {
        card.updateCounter = jest.fn();
      }
    });
    map.updateCounter(map.active[0].id, 1);
    expect((map.active[0] as Plane).updateCounter).toHaveBeenCalled();
  });
});

describe('Map.revealUntil', () => {
  it('reveals a given number of requested Card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      states: new WallStates(),
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
      states: new WallStates(),
    });

    const putOnTop = jest.spyOn(map['deck'], 'putOnTop');
    const putOnTheBottom = jest.spyOn(map['deck'], 'putOnTheBottom');
    const clearRevealed = jest.spyOn(map, 'clearRevealed');
    eventBus.emit = jest.fn();

    map.revealUntil(2);
    const top = map.revealed?.relevant[0] as Card;
    const bottom = map.revealed?.relevant[1] as Card;
    map.resolveReveal([ top ], [ bottom ]);
    expect(putOnTop).toHaveBeenCalled();
    expect(putOnTheBottom).toHaveBeenCalled();
    expect(clearRevealed).toHaveBeenCalled();

    expect(map['deck']['cards'][0]).toEqual(top);
    expect(map['deck']['cards'][map.remaining - 1]).toEqual(bottom);
    expect(map.revealed).toBeUndefined();
  });
});

describe('Map.clearRevealed', () => {
  it('sets revealed to nothing', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      states: new WallStates(),
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
      states: new WallStates(),
    });
    const exported = map.export();
    expect(exported.specs.type).toEqual(MapType.EMPTY);
    expect(exported.deck.cards).toHaveLength(map.remaining);
    expect(exported.deck.played).toHaveLength(map.played.length);
    expect(exported.active).toHaveLength(map.active.length);
    for (const card of map.active) {
      expect(exported.active).toContain(card.id);
    }
  });
});
