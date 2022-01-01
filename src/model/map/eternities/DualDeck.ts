import { Phenomenon } from '@/model/card';
import { Deck, DeckState } from '@/model/deck/Deck';
import { SingleDeckProps, SingleDeck } from './SingleDeck';
import {
  EncounterTriggers,
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  Exported,
  MapType,
} from '../MapInterface';
import { EternitiesMapExported } from './EternitiesMap';
import { StateKey } from '@/model/states';
import { DeckProvider } from '@/services/DeckProvider';
import { Container } from 'typedi';

export interface DualDeckExported extends EternitiesMapExported {
  phenomenaDeck: DeckState;
  encounterTriggers: EncounterTriggers;
}

export interface DualDeckProps extends SingleDeckProps {
  deckType: EternitiesMapDeckType.PLANES;
  phenomenaDeck: Deck<Phenomenon>;
  encounterTriggers: EncounterTriggers;
}

export class DualDeck extends SingleDeck {
  private phenomenaDeck: Deck<Phenomenon>;
  public readonly encounterTriggers: EncounterTriggers;

  public constructor(props: DualDeckProps) {
    super(props);

    this.phenomenaDeck = props.phenomenaDeck;
    this.encounterTriggers = props.encounterTriggers;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.DUAL_DECK,
      deckType: this.deckType,
    };
  }

  public resolve(passivity?: Passivity): boolean {
    this.phenomenaDeck.setPlayed(...this.active as Array<Phenomenon>);
    this.states.delete(StateKey.PHENOMENON_WALL);
    const shuffled = this.planeswalk(this.destination as Coordinates, passivity);
    return shuffled;
  }

  public override encounter(
    coords: Coordinates,
    passivity: Passivity = { passive: false },
  ): boolean {
    this.destination = coords;
    const { card: drawn, shuffled } = this.phenomenaDeck.draw();
    this.active = [ drawn ];
    this.active.forEach(c => c.enter(this.states, passivity));
    this.states.set(StateKey.PHENOMENON_WALL, {
      passive: passivity.passive ?? false,
      initiator: passivity.initiator,
    });
    return shuffled;
  }

  public export(): DualDeckExported {
    return {
      ...super.export(),
      phenomenaDeck: this.phenomenaDeck.export(),
      encounterTriggers: this.encounterTriggers,
    };
  }

  public override applyUndo(state: DualDeckExported): void {
    this.phenomenaDeck = Container.get(DeckProvider).getDeckFromExport(state.phenomenaDeck);
    super.applyUndo(state);
  }
}
