import { Vue } from 'vue-facing-decorator';
import { Card } from '#/model/card';

export abstract class Imgable extends Vue {
  public buildImgSrc(card: Card): string {
    return `/cards/${card.id}.jpg`;
  }
}
