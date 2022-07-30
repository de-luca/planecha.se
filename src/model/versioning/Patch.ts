import { Delta } from "@n1ru4l/json-patch-plus";

export interface Patch {
  event: string;
  delta?: Delta;
}
