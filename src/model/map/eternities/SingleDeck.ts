import { Map, Props } from '../Map';
import { Phenomenon, Plane } from '../../card';
import {
  Coordinates,
  EternitiesMapDeckType,
  EternitiesMapSpecs,
  EternitiesMapSubType,
  Exported as BaseExported,
  MapType,
  Tile,
  TileStatus,
} from '../MapInterface';

interface Exported extends BaseExported {
  specs: EternitiesMapSpecs;
}

export interface EternitiesProps extends Props {
  deckType: EternitiesMapDeckType;
  tiles?: Array<Tile>;
  hasStarted?: boolean;
}

export class SingleDeck extends Map {
  protected static readonly activeRange = 1;
  protected static readonly maxRange = 3;
  protected static readonly center: Coordinates = { x: 0, y: 0 };

  public destination?: Coordinates;
  protected deckType: EternitiesMapDeckType;

  public constructor(props: EternitiesProps) {
    super(props);

    this.deck = props.deck;
    this.active = props.active ?? [this.deck.drawPlane().card];
    this.tiles = props.tiles ?? this.initializeTiles();
    this.hasStarted = props.hasStarted ?? false;

    this.destination = undefined;
    this.deckType = props.deckType;
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.SINGLE_DECK,
      deckType: this.deckType,
      variants: [],
    };
  }

  private initializeTiles(): Array<Tile> {
    const tiles: Array<Tile> = [{
      state: TileStatus.ACTIVE,
      coordinates: { ...SingleDeck.center },
      plane: this.active as Array<Plane>,
    }];

    for (let y = SingleDeck.activeRange * -1; y <= SingleDeck.activeRange; y++) {
      for (let x = SingleDeck.activeRange * -1; x <= SingleDeck.activeRange; x++) {
        if (
          Math.abs(x) + Math.abs(y) <= SingleDeck.activeRange
          && Math.abs(x) + Math.abs(y) !== 0
        ) {
          tiles.push({
            coordinates: { x, y },
            state: TileStatus.VISIBLE,
            plane: [this.deck.drawPlane().card],
          });
        }
      }
    }

    return tiles;
  }

  private encounterPhenomenon(card: Phenomenon, coordinates: Coordinates): void {
    this.active = [card];
    this.destination = coordinates;
    this.active.forEach(c => c.enter());

    console.log(this);
  }

  public planeswalk(coordinates: Coordinates): boolean {
    let shuffled = false;
    const xOffset = coordinates.x;
    const yOffset = coordinates.y;

    // The active tile is at the center
    const activeTile = this.tiles.find((t) => t.coordinates.x === SingleDeck.center.x
      && t.coordinates.y === SingleDeck.center.y) as Tile;
    // Moove out of the ACTIVE and make if VISIBLE
    activeTile.state = TileStatus.VISIBLE;

    // Look for the tile we are moving to
    let newActiveTile = this.tiles.find((t) => t.coordinates.x === xOffset
      && t.coordinates.y === yOffset);

    if (newActiveTile) {
      // It exists so it become ACTIVE
      newActiveTile.state = TileStatus.ACTIVE;
    } else {
      // It does not exist (HellRiding)
      // Draw a card and put it in place
      const drawn = this.deck.draw();
      shuffled = drawn.shuffled;

      // This is a Phenomenon
      if (drawn.card instanceof Phenomenon) {
        // Special encounter
        this.encounterPhenomenon(drawn.card, {
          x: xOffset,
          y: yOffset,
        });
        // Return imediately
        return shuffled;
      }

      // This is a Plane
      // We add the new tile with the drawn plane
      newActiveTile = {
        coordinates: {
          x: xOffset,
          y: yOffset,
        },
        state: TileStatus.ACTIVE,
        plane: [drawn.card as Plane],
      };

      this.tiles.push(newActiveTile);
    }

    // Actualy change the active pointer
    this.active = newActiveTile.plane;

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
          const tile = this.tiles.find((t) => t.coordinates.x === x && t.coordinates.y === y);
          if (!tile) {
            // NO?!! Then draw and place a plane
            const drawn = this.deck.draw();
            shuffled = drawn.shuffled;

            if (drawn.card instanceof Phenomenon) {
              // Special encounter
              this.encounterPhenomenon(drawn.card, {
                x: xOffset,
                y: yOffset,
              });

              return shuffled;
            }

            this.tiles.push({
              coordinates: { x, y },
              state: TileStatus.VISIBLE,
              plane: [drawn.card as Plane],
            });
          }
        }
      }
    }

    // Move the planes on the table so every body can see
    this.tiles.forEach((t) => {
      t.coordinates.x += xOffset * -1;
      t.coordinates.y += yOffset * -1;
    });

    this.tiles
      .filter(t => Math.abs(t.coordinates.x) + Math.abs(t.coordinates.y) > SingleDeck.maxRange)
      .forEach(t => this.deck.play(...t.plane));

    // Remove all the plan that are too far
    this.tiles = this.tiles.filter((t) => (
      Math.abs(t.coordinates.x) + Math.abs(t.coordinates.y) <= SingleDeck.maxRange
    ));

    this.destination = undefined;
    return shuffled;
  }

  public customPlaneswalk(planes: Array<Plane>): void {
    const xOffset = (this.destination as Coordinates).x;
    const yOffset = (this.destination as Coordinates).y;

    let destinationTile = this.tiles.find(
      t => t.coordinates.x === xOffset && t.coordinates.y === yOffset,
    );

    if (destinationTile) {
      destinationTile.plane = planes;
    } else {
      destinationTile = {
        coordinates: {
          x: xOffset,
          y: yOffset,
        },
        state: TileStatus.ACTIVE,
        plane: planes,
      };
    }
  }

  public planeswalkFromPhenomenon(passive: boolean = false, mateId?: string): boolean {
    console.log(this.active);
    this.deck.play(...this.active);
    const shuffled = this.planeswalk(this.destination as Coordinates);
    console.log(this.played);
    return shuffled;
  }

  public export(): Exported {
    return {
      ...super.export(),
      specs: this.specs,
      tiles: this.tiles.map(t => ({
        coordinates: t.coordinates,
        state: t.state,
        plane: t.plane.map(p => p.id),
      })),
      hasStarted: this.hasStarted,
    };
  }
}
