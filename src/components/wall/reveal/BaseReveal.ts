import { prop } from 'vue-class-component';
import { WallConfig } from '../WallProps';
import { Card } from '@/model/card';
import { Revealed } from '@/model/map/MapInterface';

export type PickedLeft = {
  picked: Array<Card>;
  left: Array<Card>;
}

export interface RevealConfig extends WallConfig {
  sendShownTo: 'top' | 'bottom';
  title?: string;
  subTitle?: string;
}

export class BaseReveal {
  public revealed = prop<Revealed>({ required: true });
  public config = prop<RevealConfig>({ required: true });
}
