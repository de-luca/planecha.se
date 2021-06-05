import { Card } from '../Card';

export class Phenomenon extends Card {
  public get type(): string {
    return 'phenomenon';
  }

  public enter(): void {
    return;
  }

  public leave(): void {
    return;
  }
}
