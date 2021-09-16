import { prop } from "vue-class-component";
import { Tile } from "@/model/map";

export class Props {
  public tile = prop<Tile>({ required: false });
  public hidden = prop<boolean>({ required: true });
}
