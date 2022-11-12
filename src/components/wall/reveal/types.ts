import { WallConfig } from '../types';
import { Card } from '@/model/card';

export type PickedLeft = {
  picked: Array<Card>;
  left: Array<Card>;
}

export interface RevealConfig extends WallConfig {
  sendShownTo: 'top' | 'bottom';
  title?: string;
  subTitle?: string;
}
