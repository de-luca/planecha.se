import { Card } from '@/model/card';
import { Vue } from 'vue-class-component';

export abstract class Imgable extends Vue {
  protected buildImgSrc(card: Card): string {
    return `/cards/${card.id}.jpg`;
  }
}
