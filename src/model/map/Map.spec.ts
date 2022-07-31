import { describe, it, vi, expect } from 'vitest';
import { Container } from 'typedi';
import { diff } from '@n1ru4l/json-patch-plus';
import { DeckProvider } from '@/services/DeckProvider';
import { eventBus } from '@/services/EventBus';
import { Card, Plane } from '../card';
import { Map, MapSpecs, MapType } from '.';
import { WallStates } from '../wall';
import { Patch } from '../ver';

class TestMap extends Map {
  public get specs(): MapSpecs {
    return { type: MapType.CLASSIC };
  }
  public testActive(): void {
    this._active = [ this._deck.draw() ];
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

describe('Map.ready', () => {
  it('resolves', async() => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      wallStates: new WallStates(),
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
      wallStates: new WallStates(),
    });
    map.testActive();
    map.active.forEach(card => card.chaos = vi.fn());
    map.chaos({ card: map.active[0], initiator: 'foo' });
    expect(map.active[0].chaos).toHaveBeenCalled();
  });
});

describe('Map.updateCounter', () => {
  it('updates card counters', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getPlaneDeck(),
      wallStates: new WallStates(),
    });
    map.testActive();
    map.active.forEach((card) => {
      if (card instanceof Plane) {
        card.updateCounter = vi.fn();
      }
    });
    map.updateCounter({ planeId: map.active[0].id, change: 1 });
    expect((map.active[0] as Plane).updateCounter).toHaveBeenCalled();
  });
});

describe('Map.revealUntil', () => {
  it('reveals a given number of requested Card', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      wallStates: new WallStates(),
    });
    map.revealUntil({ count: 2 });
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
      wallStates: new WallStates(),
    });

    const putOnTop = vi.spyOn(map['_deck'], 'putOnTop');
    const putOnTheBottom = vi.spyOn(map['_deck'], 'putOnTheBottom');
    eventBus.emit = vi.fn();

    map.revealUntil({ count: 2 });
    const top = map.revealed?.relevant[0] as Card;
    const bottom = map.revealed?.relevant[1] as Card;
    map.resolveReveal({top: [top], bottom: [bottom]});
    expect(putOnTop).toHaveBeenCalled();
    expect(putOnTheBottom).toHaveBeenCalled();

    expect(map['_deck']['_cards'][0]).toEqual(top);
    expect(map['_deck']['_cards'][map.remaining - 1]).toEqual(bottom);
    expect(map.revealed).toBeUndefined();
  });
});

describe('Map.export', () => {
  it('exports the state of the map', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      wallStates: new WallStates(),
    });
    const exported = map.export();
    expect(exported.specs.type).toEqual(MapType.CLASSIC);
    expect(exported.deck.cards).toHaveLength(map.remaining);
    expect(exported.deck.played).toHaveLength(map.played.length);
    expect(exported.active).toHaveLength(map.active.length);
    for (const card of map.active) {
      expect(exported.active).toContain(card.id);
    }
  });
});

describe('Map.apply', () => {
  it('applies patch the states of the map', () => {
    const map = new TestMap({
      deck: Container.get(DeckProvider).getDeck(),
      wallStates: new WallStates(),
    });

    // Get a base state
    const base = map.export();

    // Do actions to modify the state
    map.start();
    map.testActive();

    // Get the new state
    const updated = map.export();

    // Get the delta between version
    // Swap left/right to go back to the base
    const delta = diff({ left: updated, right: base });

    const patch: Patch = {
      event: 'test',
      delta,
    };

    // Apply the patch to go back to the base
    map.apply(patch);

    expect(map.export()).toEqual(base);
  });
});
