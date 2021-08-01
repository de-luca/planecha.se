import { Card, Plane } from "@/model/card";
import { Revealed, Tile, Coordinates, Exported, MapSpecs } from "../../MapInterface";
import { DualDeckInterface } from "../DualDeck";

export abstract class BaseVariant implements DualDeckInterface {
  protected map: DualDeckInterface;

  public constructor(map: DualDeckInterface) {
    this.map = map;
  }

  public get specs(): MapSpecs {
    return this.map.specs;
  }

  public get remaining(): number {
    return this.map.remaining;
  }

  public get active(): Card[] {
    return this.map.active;
  }

  public get played(): Card[] {
    return this.map.played;
  }

  public get revealed(): Revealed | undefined {
    return this.map.revealed;
  }

  public get ready(): Promise<void> {
    return this.map.ready;
  }

  public get tiles(): Tile[] {
    return this.map.tiles;
  }

  public get hasStarted(): boolean {
    return this.map.hasStarted;
  }

  public revealUntil(count: number, type?: typeof Card): boolean {
    return this.map.revealUntil(count, type);
  }

  public resolveReveal(top: Card[], bottom: Card[]): void {
    return this.map.resolveReveal(top, bottom);
  }

  public clearRevealed(): void {
    return this.map.clearRevealed();
  }

  public chaos(passive?: boolean, mateId?: string): void {
    return this.map.chaos(passive, mateId);
  }

  public planeswalk(coordinates?: Coordinates, passive?: boolean, mateId?: string): boolean {
    return this.map.planeswalk(coordinates, passive, mateId);
  }

  public customPlaneswalk(planes: Plane[], coordinates?: Coordinates): void {
    return this.map.customPlaneswalk(planes, coordinates);
  }

  public planeswalkFromPhenomenon(passive?: boolean, mateId?: string): boolean {
    return this.map.planeswalkFromPhenomenon(passive, mateId);
  }

  public updateCounter(id: string, change: number): void {
    return this.map.updateCounter(id, change);
  }

  public export(): Exported {
    return this.map.export();
  }

  public applyShuffle(state: Exported): void {
    return this.map.applyShuffle(state);
  }
}
