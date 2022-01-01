import { Phenomenon, Plane } from '@/model/card';
import { EternitiesMap, EternitiesMapProps } from './EternitiesMap';
import {
  EternitiesMapSpecs,
  EternitiesMapSubType,
  MapType,
} from '../MapInterface';
import { StateKey } from '@/model/states';
import { Tile, TileStatus } from '../Tile';

export interface SingleDeckProps extends EternitiesMapProps {}

export class SingleDeck extends EternitiesMap {
  public constructor(props: SingleDeckProps) {
    super(props);
  }

  public get specs(): EternitiesMapSpecs {
    return {
      type: MapType.ETERNITIES,
      subType: EternitiesMapSubType.SINGLE_DECK,
      deckType: this.deckType,
    };
  }

  private encounterPhenomenon(
    card: Phenomenon,
    coords: Coordinates,
    passivity: Passivity = { passive: false },
  ): void {
    this.active = [card];
    this.destination = coords;
    this.active.forEach(c => c.enter(this.states, passivity));
    this.states.set(StateKey.PHENOMENON_WALL, {
      passive: passivity.passive ?? false,
      initiator: passivity.initiator,
    });
  }

  public planeswalk(
    coords: Coordinates,
    passivity?: Passivity,
  ): boolean {
    let shuffled = false;
    const xOffset = coords.x;
    const yOffset = coords.y;

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
      const drawn = this.deck.draw();
      shuffled = drawn.shuffled;

      // This is a Phenomenon
      if (drawn.card instanceof Phenomenon) {
        // Special encounter
        this.encounterPhenomenon(
          drawn.card,
          { x: xOffset, y: yOffset },
          passivity,
        );
        // Return imediately
        return shuffled;
      }

      // This is a Plane
      // We add the new tile with the drawn plane
      newActiveTile = new Tile(
        { x: xOffset, y: yOffset },
        TileStatus.ACTIVE,
        [ drawn.card as Plane ],
      );

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
          const tile = this.tiles.find((t) => t.coords.x === x && t.coords.y === y);
          if (!tile) {
            // NO?!! Then draw and place a plane
            const drawn = this.deck.draw();
            shuffled = drawn.shuffled;

            if (drawn.card instanceof Phenomenon) {
              // Special encounter
              this.encounterPhenomenon(
                drawn.card,
                { x: xOffset, y: yOffset },
                passivity,
              );

              return shuffled;
            }

            this.tiles.push(new Tile(
              { x, y },
              TileStatus.VISIBLE,
              [ drawn.card as Plane ],
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
      .forEach(t => this.deck.setPlayed(...t.plane));

    // Remove all the plan that are too far
    this.tiles = this.tiles.filter((t) => (
      Math.abs(t.coords.x) + Math.abs(t.coords.y) <= SingleDeck.maxRange
    ));

    this.destination = undefined;

    this.active.forEach(c => c.enter(this.states, passivity));

    return shuffled;
  }

  public customPlaneswalk(planes: Array<Plane>): void {
    const xOffset = (this.destination as Coordinates).x;
    const yOffset = (this.destination as Coordinates).y;

    let destinationTile = this.tiles.find(
      t => t.coords.x === xOffset && t.coords.y === yOffset,
    );

    if (destinationTile) {
      destinationTile.plane = planes;
    } else {
      destinationTile = new Tile(
        { x: xOffset, y: yOffset },
        TileStatus.ACTIVE,
        planes,
      );
      this.tiles.push(destinationTile);
    }
  }

  public resolve(passivity?: Passivity): boolean {
    this.deck.setPlayed(...this.active);
    this.states.delete(StateKey.PHENOMENON_WALL);

    const shuffled = this.planeswalk(this.destination as Coordinates, passivity);

    return shuffled;
  }
}
