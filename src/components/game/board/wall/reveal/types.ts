import { Card } from '#/model/card';
import { RevealerWallState } from '#/model/wall';

export type PickedLeft = {
  picked: Array<Card>;
  left: Array<Card>;
}

export interface RevealConfig extends RevealerWallState {
  sendShownTo: 'top' | 'bottom';
  title?: string;
  subTitle?: string;
}
