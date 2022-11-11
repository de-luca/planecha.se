import { Vue } from 'vue-class-component';
import { useMain } from '@/store/main';

export class BaseDice<T> extends Vue {
  protected store = useMain();
  public rolling = false;
  public rolled: T | null = null;

  public get showFace(): boolean {
    return !this.rolled && !this.rolling;
  }

  public getResult(): T {
    throw 'IMPLEMENT ME';
  }

  public async fakeStall(): Promise<void> {
    this.rolling = true;
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    this.rolling = false;
  }

  public async cleanResult(): Promise<void> {
    await new Promise((resolve) => window.setTimeout(resolve, 2000));
    this.rolled = null;
  }

  public async roll(): Promise<void> {
    await this.fakeStall();
    this.rolled = this.getResult();
    await this.cleanResult();
  }
}
