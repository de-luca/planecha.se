import { Counter, Props } from '../Card';
import { Plane } from './Plane';
import * as Special from './special';

type SpecialConstructor = { new(props: Props): Plane };

export class PlaneFactory {
  private static readonly specials: Map<string, SpecialConstructor> = new Map([
    ['d6ab4159-e04e-4991-8a9b-9da302c98e9d', Special.Aretopolis],
    ['f133e42a-2962-4781-b413-ce2127f17c26', Special.PoolsOfBecoming],
    ['7a425df4-7010-462e-9cb5-20389bac721c', Special.StairsToInfinity],
    ['ab72ff80-738a-4468-aecf-5d806143f791', Special.NornsSeedcore],
    ['2f3e71b6-0fd6-4ac5-a265-faaabe21177b', Special.TheFertileLandsOfSaulvinia],
  ]);

  private static readonly counter: Map<string, Counter> = new Map([
    // Aretopolis
    ['d6ab4159-e04e-4991-8a9b-9da302c98e9d', {
      name: 'Scroll',
      value: 0,
      start: 0,
      max: 10,
      reset: true,
    }],
    // Kilnspire District
    ['fc650404-991c-4639-b311-c35df81a254a', {
      name: 'Charge',
      value: 0,
      start: 0,
      max: null,
      reset: false,
    }],
    // Mount Keralia
    ['e0dc9986-1099-4189-bfff-8f41bab9019d', {
      name: 'Pressure',
      value: 0,
      start: 0,
      max: null,
      reset: false,
    }],
    // Naar Isle
    ['3e0bcf65-1eaf-440f-a59b-0b11e1106135', {
      name: 'Flame',
      value: 0,
      start: 0,
      max: null,
      reset: false,
    }],
  ]);

  /**
   * I made it! I created the most cursed and stupid factory!
   */
  public static build(props: Props): Plane {
    return new (this.specials.get(props.id) ?? Plane)({
      ...props,
      counter: this.counter.get(props.id),
    });
  }
}
