import { Vue } from 'vue-class-component';
import { Card } from '@/model/card';

export class Imgable extends Vue {
  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.jpg`;
  }
}
