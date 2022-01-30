import { mixins, Options } from 'vue-class-component';
import { Imgable } from '@/components/Imgable';
import { BaseReveal } from './BaseReveal';

@Options({
  emits: ['done'],
})
export class BaseShow extends mixins(Imgable).with(BaseReveal) {
  private static readonly fanAngle = 5;

  private mediaQuery: MediaQueryList;

  protected activeTab: string = 'relevant';
  protected isVertical: Boolean = false;

  public created(): void {
    this.mediaQuery = window.matchMedia(
      'screen and (max-width: 800px) and (orientation: portrait)'
    );
    this.isVertical = this.mediaQuery.matches;
    this.mediaQuery.addEventListener('change', this.computeVerticality);
  }

  public unmounted(): void {
    this.mediaQuery.removeEventListener('change', this.computeVerticality);
  }

  private computeVerticality(ev: MediaQueryListEvent): void {
    this.isVertical = ev.matches;
  }

  public cardTransform(i: number, total: number): Record<string, string> {
    if (this.isVertical) {
      return this.cardStack(i);
    }

    return this.cardAngle(i, total);
  }

  private cardStack(i: number): Record<string, string> {
    if (i === 0) {
      return {};
    }

    return {
      position: 'absolute',
      top: `${i * 2}rem`,
    };
  }

  private cardAngle(i: number, total: number): Record<string, string> {
    const angle = (BaseShow.fanAngle * i) - ((BaseShow.fanAngle * (total - 1)) / 2);

    return { transform: `rotate(${angle.toFixed(2)}deg)` };
  }
}
