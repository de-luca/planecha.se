/*
eslint no-param-reassign: [
  "error",
  { "props": true, "ignorePropertyModificationsFor": ["t"] }
]
*/

import { Map } from './Map';
import { Plane } from '../card';
import { Coordinates, MapType } from './MapInterface';

export enum TileStatus {
    ACTIVE = 'active',
    VISIBLE = 'visible',
}

export interface Tile {
    coordinates: Coordinates;
    state: TileStatus;
    plane: Array<Plane>;
}

interface Props {
  deck: Array<Plane>;
  played?: Array<Plane>;
  active?: Array<Plane>;
}

export class EternitiesMap extends Map {
  private static readonly activeRange = 1;
  private static readonly maxRange = 3;
  private static readonly center: Coordinates = { x: 0, y: 0 };

  public deck: Array<Plane>;
  public played: Array<Plane>;
  public active: Array<Plane>;
  private tiles: Array<Tile>;

  public constructor(props: Props) {
    super(props);

    this.deck = props.deck;
    this.played = [];
    this.active = props.active ?? [this.draw<Plane>().card];
    this.tiles = this.initializeTiles();
  }

  public get type(): MapType {
    return MapType.ETERNITIES;
  }

  private initializeTiles(): Array<Tile> {
    const tiles: Array<Tile> = [{
      state: TileStatus.ACTIVE,
      coordinates: { ...EternitiesMap.center },
      plane: this.active,
    }];

    for (let y = EternitiesMap.activeRange * -1; y <= EternitiesMap.activeRange; y++) {
      for (let x = EternitiesMap.activeRange * -1; x <= EternitiesMap.activeRange; x++) {
        if (
          Math.abs(x) + Math.abs(y) <= EternitiesMap.activeRange
                  && Math.abs(x) + Math.abs(y) !== 0
        ) {
          tiles.push({
            coordinates: { x, y },
            state: TileStatus.VISIBLE,
            plane: [this.draw<Plane>().card],
          });
        }
      }
    }

    return tiles;
  }

  public planeswalk(coordinates: Coordinates, passive: boolean = false): boolean {
    let shuffled = false;
    const xOffset = coordinates.x;
    const yOffset = coordinates.y;

    // The active tile is at the center
    const activeTile = this.tiles.find((t) => t.coordinates.x === EternitiesMap.center.x
              && t.coordinates.y === EternitiesMap.center.y) as Tile;
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
      let y = (EternitiesMap.activeRange * -1) + yOffset;
      y <= EternitiesMap.activeRange + yOffset;
      y++
    ) {
      for (
        let x = (EternitiesMap.activeRange * -1) + xOffset;
        x <= EternitiesMap.activeRange + xOffset;
        x++
      ) {
        // IS THAT AN ADJACENT CARD !??
        if (
          (Math.abs(x - xOffset) + Math.abs(y - yOffset)) <= EternitiesMap.activeRange
        ) {
          // IS THAT SPACE TAKEN ?!!
          const tile = this.tiles.find((t) => t.coordinates.x === x && t.coordinates.y === y);
          if (!tile) {
            // NO?!! Then draw and place a plane
            const drawn = this.draw<Plane>();
            shuffled = drawn.shuffled;

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

    // Remove all the plan that are too far
    this.tiles = this.tiles.filter((t) => (
      Math.abs(t.coordinates.x) + Math.abs(t.coordinates.y) <= EternitiesMap.maxRange
    ));

    return shuffled;
  }

  public customPlaneswalk(
    planes: Array<Plane>,
    coordinates?: Coordinates, 
    passive: boolean = false,
  ): void {
    throw new Error('Method not implemented.');
  }
}
