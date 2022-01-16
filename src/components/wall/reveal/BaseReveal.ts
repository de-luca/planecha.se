import { prop } from 'vue-class-component';
import { Card } from '@/model/card';
import { Revealed } from '@/model/map/MapInterface';
import { WallConfig } from '../Wall';

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
