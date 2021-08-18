import { prop } from 'vue-class-component';
import { Card } from '@/model/card';
import { Revealed } from '@/model/map/MapInterface';

export type PickedLeft = {
  picked: Array<Card>;
  left: Array<Card>;
}

export type RevealConfig = {
  passive: boolean;
  sendShownTo: 'top' | 'bottom';
  title?: string;
  mateName?: string;
}

export class BaseReveal {
  public revealed = prop<Revealed>({ required: true });
  public config = prop<RevealConfig>({ required: true });
}
