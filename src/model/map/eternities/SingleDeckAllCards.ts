import { Map, Props as BaseProps } from '../Map';
import { Card, Phenomenon, Plane } from '../../card';
import {
  Coordinates,
  Exported,
  MapType,
  Tile,
  TileStatus,
} from '../MapInterface';

interface Props extends BaseProps {
  tiles?: Array<Tile>;
  hasStarted?: boolean;
}

export class SingleDeckAllCards extends Map {
  private static readonly activeRange = 1;
  private static readonly maxRange = 3;
  private static readonly center: Coordinates = { x: 0, y: 0 };

  public deck: Array<Card>;
  public played: Array<Card>;
  public active: Array<Card>;
  public tiles: Array<Tile>;

  public destination?: Coordinates;

  public constructor(props: Props) {
    super(props);

    this.deck = props.deck;
    this.played = [];
    this.active = props.active ?? [this.drawPlane().card];
    this.tiles = props.tiles ?? this.initializeTiles();
    this.hasStarted = props.hasStarted ?? false;

    this.destination = undefined;
  }

  public get type(): MapType {
    return MapType.ETERNITIES;
  }

  private initializeTiles(): Array<Tile> {
    const tiles: Array<Tile> = [{
      state: TileStatus.ACTIVE,
      coordinates: { ...SingleDeckAllCards.center },
      plane: this.active as Array<Plane>,
    }];

    for (let y = SingleDeckAllCards.activeRange * -1; y <= SingleDeckAllCards.activeRange; y++) {
      for (let x = SingleDeckAllCards.activeRange * -1; x <= SingleDeckAllCards.activeRange; x++) {
        if (
          Math.abs(x) + Math.abs(y) <= SingleDeckAllCards.activeRange
          && Math.abs(x) + Math.abs(y) !== 0
        ) {
          tiles.push({
            coordinates: { x, y },
            state: TileStatus.VISIBLE,
            plane: [this.drawPlane().card],
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
    const activeTile = this.tiles.find((t) => t.coordinates.x === SingleDeckAllCards.center.x
      && t.coordinates.y === SingleDeckAllCards.center.y) as Tile;
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
      const drawn = this.draw<Plane>();
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
        plane: [drawn.card],
      };

      this.tiles.push(newActiveTile);
    }

    // Actualy change the active pointer
    this.active = newActiveTile.plane;

    // Look over the board
    for (
      let y = (SingleDeckAllCards.activeRange * -1) + yOffset;
      y <= SingleDeckAllCards.activeRange + yOffset;
      y++
    ) {
      for (
        let x = (SingleDeckAllCards.activeRange * -1) + xOffset;
        x <= SingleDeckAllCards.activeRange + xOffset;
        x++
      ) {
        // IS THAT AN ADJACENT CARD !??
        if (
          (Math.abs(x - xOffset) + Math.abs(y - yOffset)) <= SingleDeckAllCards.activeRange
        ) {
          // IS THAT SPACE TAKEN ?!!
          const tile = this.tiles.find((t) => t.coordinates.x === x && t.coordinates.y === y);
          if (!tile) {
            // NO?!! Then draw and place a plane
            const drawn = this.draw<Plane>();
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
              plane: [drawn.card],
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
      .filter(t => Math.abs(t.coordinates.x) + Math.abs(t.coordinates.y) > SingleDeckAllCards.maxRange)
      .forEach(t => this.played.push(...t.plane));

    // Remove all the plan that are too far
    this.tiles = this.tiles.filter((t) => (
      Math.abs(t.coordinates.x) + Math.abs(t.coordinates.y) <= SingleDeckAllCards.maxRange
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
    this.played.push(...this.active);
    const shuffled = this.planeswalk(this.destination as Coordinates);
    console.log(this.played);
    return shuffled;
  }

  public export(): Exported {
    return {
      type: this.type,
      deck: this.deck.map(c => c.id),
      played: this.played.map(c => c.id),
      active: this.active.map(c => c.id),
      revealed: this.revealed === undefined
        ? undefined
        : {
          relevant: this.revealed.relevant.map(c => c.id),
          others: this.revealed.others.map(c => c.id),
        },
      tiles: this.tiles.map(t => ({
        coordinates: t.coordinates,
        state: t.state,
        plane: t.plane.map(p => p.id),
      })),
      hasStarted: this.hasStarted,
    };
  }
}
