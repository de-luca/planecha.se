import { prop, Vue } from 'vue-class-component';

export interface WallConfig {
  passive: boolean;
  mateName?: string;
}

export class WallProps {
  public config = prop<WallConfig>({ required: true });
}


export class Wall extends Vue {
  protected static readonly fallbackMate = 'Another player';
  public config: WallConfig;

  public get mateName(): string {
    return this.config.mateName ?? Wall.fallbackMate;
  }
}
