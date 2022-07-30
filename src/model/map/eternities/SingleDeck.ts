import { Phenomenon, Plane } from '@/model/card';
import { EternitiesMap, EternitiesMapExported, EternitiesMapProps, EternitiesMapSpecs, EternitiesMapSubType, PlaneswalkInput } from './EternitiesMap';
import {
  CustomEternitiesPlaneswalkInput,
  EternitiesPlaneswalkInput,
  MapType,
  ResolveInput,
} from '../MapInterface';
import { StateKey } from '@/model/wall';
import { Tile, TileStatus } from './Tile';

export interface SingleDeckExported extends EternitiesMapExported {
  destination?: Coordinates;
}

export interface SingleDeckProps extends EternitiesMapProps {
  destination?: Coordinates;
}

export class SingleDeck extends EternitiesMap {
  protected _destination?: Coordinates;

  public constructor(props: SingleDeckProps) {
    super(props);
    this._destination = props.destination;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.SINGLE_DECK,
      deckType: this._deckType,
    };
  }

  public get destination(): Coordinates | undefined {
    return this._destination;
  }

  public planeswalk(input: PlaneswalkInput): void {
    if ('planes' in input) {
      return this.customPlaneswalk(input);
    } else {
      return this.simplePlaneswalk(input);
    }
  }

  private simplePlaneswalk(input: EternitiesPlaneswalkInput): void {
    const xOffset = input.coords.x;
    const yOffset = input.coords.y;

    // The active tile is at the center
    const activeTile = this.tiles.find((t) => t.coords.x === SingleDeck.center.x
      && t.coords.y === SingleDeck.center.y) as Tile;
    // Moove out of the ACTIVE and make if VISIBLE
    activeTile.state = TileStatus.VISIBLE;

    // Look for the tile we are moving to
    let newActiveTile = this.tiles.find((t) => t.coords.x === xOffset
      && t.coords.y === yOffset);

    if (newActiveTile) {
      // It exists so it become ACTIVE
      newActiveTile.state = TileStatus.ACTIVE;
    } else {
      // It does not exist (HellRiding)
      // Draw a card and put it in place
      const drawn = this._deck.draw();

      // This is a Phenomenon
      if (drawn instanceof Phenomenon) {
        // Special encounter
        this.encounterPhenomenon(
          drawn,
          { x: xOffset, y: yOffset },
          input.initiator,
        );
        // Return imediately
        return;
      }

      // This is a Plane
      // We add the new tile with the drawn plane
      newActiveTile = new Tile(
        { x: xOffset, y: yOffset },
        TileStatus.ACTIVE,
        [ drawn as Plane ],
      );

      this.tiles.push(newActiveTile);
    }

    // Actualy change the active pointer
    this._active = newActiveTile.plane;

    // Look over the board
    for (
      let y = (SingleDeck.activeRange * -1) + yOffset;
      y <= SingleDeck.activeRange + yOffset;
      y++
    ) {
      for (
        let x = (SingleDeck.activeRange * -1) + xOffset;
        x <= SingleDeck.activeRange + xOffset;
        x++
      ) {
        // IS THAT AN ADJACENT CARD !??
        if (
          (Math.abs(x - xOffset) + Math.abs(y - yOffset)) <= SingleDeck.activeRange
        ) {
          // IS THAT SPACE TAKEN ?!!
          const tile = this.tiles.find((t) => t.coords.x === x && t.coords.y === y);
          if (!tile) {
            // NO?!! Then draw and place a plane
            const drawn = this._deck.draw();

            if (drawn instanceof Phenomenon) {
              // Special encounter
              this.encounterPhenomenon(
                drawn,
                { x: xOffset, y: yOffset },
                input.initiator,
              );

              return;
            }

            this.tiles.push(new Tile(
              { x, y },
              TileStatus.VISIBLE,
              [ drawn as Plane ],
            ));
          }
        }
      }
    }

    // Move the planes on the table so every body can see
    this.tiles.forEach((t) => {
      t.coords.x += xOffset * -1;
      t.coords.y += yOffset * -1;
    });

    this.tiles
      .filter(t => Math.abs(t.coords.x) + Math.abs(t.coords.y) > SingleDeck.maxRange)
      .forEach(t => this._deck.setPlayed(...t.plane));

    // Remove all the plan that are too far
    this._tiles = this.tiles.filter((t) => (
      Math.abs(t.coords.x) + Math.abs(t.coords.y) <= SingleDeck.maxRange
    ));

    this._destination = undefined;

    this.active.forEach(c => c.enter(this._wallStates, input.initiator));
  }

  private customPlaneswalk(input: CustomEternitiesPlaneswalkInput): void {
    const xOffset = (this._destination as Coordinates).x;
    const yOffset = (this._destination as Coordinates).y;

    let destinationTile = this.tiles.find(
      t => t.coords.x === xOffset && t.coords.y === yOffset,
    );

    if (destinationTile) {
      destinationTile.plane = input.planes;
    } else {
      destinationTile = new Tile(
        { x: xOffset, y: yOffset },
        TileStatus.ACTIVE,
        input.planes,
      );
      this.tiles.push(destinationTile);
    }
  }

  private encounterPhenomenon(
    card: Phenomenon,
    coords: Coordinates,
    initiator: string,
  ): void {
    this._active = [card];
    this._destination = coords;
    this.active.forEach(c => c.enter(this._wallStates, initiator));
    this._wallStates.set(StateKey.PHENOMENON_WALL, { initiator });
  }

  public resolve(input: ResolveInput): void {
    this._deck.setPlayed(...this.active);
    this._wallStates.delete(StateKey.PHENOMENON_WALL);
    this.planeswalk({
      ...input,
      coords: this._destination as Coordinates,
    });
  }

  public override export(): SingleDeckExported {
    return {
      ...super.export(),
      destination: this._destination,
    };
  }

  public override restore(state: SingleDeckExported): void {
    super.restore(state);
    this._destination = state.destination;
  }
}
