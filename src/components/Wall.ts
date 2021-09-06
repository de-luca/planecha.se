import { prop } from 'vue-class-component';
import { Imgable } from './Imgable';

export interface WallConfig {
  passive: boolean;
  mateName?: string;
}

export class WallProps {
  public config = prop<WallConfig>({ required: true });
}


export class Wall extends Imgable {
  protected static readonly fallbackMate = 'Another player';
  public config: WallConfig;

  public get mateName(): string {
    return this.config.mateName ?? Wall.fallbackMate;
  }
}
