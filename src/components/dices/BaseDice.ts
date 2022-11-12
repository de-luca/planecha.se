import { Vue } from 'vue-facing-decorator';
import { useMain } from '@/store/main';

const STALL_TIME = 500;
const CLEAN_TIME = 2000;

export abstract class BaseDice<T> extends Vue {
  protected store = useMain();
  public rolling = false;
  public rolled: T | null = null;

  public get showFace(): boolean {
    return !this.rolled && !this.rolling;
  }

  public abstract getResult(): T;

  public async fakeStall(): Promise<void> {
    this.rolling = true;
    await new Promise((resolve) => window.setTimeout(resolve, STALL_TIME));
    this.rolling = false;
  }

  public async cleanResult(): Promise<void> {
    await new Promise((resolve) => window.setTimeout(resolve, CLEAN_TIME));
    this.rolled = null;
  }

  public async roll(): Promise<void> {
    await this.fakeStall();
    this.rolled = this.getResult();
    await this.cleanResult();
  }
}
