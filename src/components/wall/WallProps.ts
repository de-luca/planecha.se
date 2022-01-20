import { prop } from 'vue-class-component';

export interface WallConfig {
  mateName?: string;
}

export class WallProps {
  public config = prop<WallConfig>({ required: true });
}
