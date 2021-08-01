import { EternitiesMapSpecs, EternitiesMapVariant } from "../../MapInterface";
import { BaseVariant } from "./BaseVariant";

export class OnPlaneswalk extends BaseVariant {
  public get specs(): EternitiesMapSpecs {
    const descriptor = this.map.specs as EternitiesMapSpecs;
    descriptor.variants.push(EternitiesMapVariant.ON_PLANESWALK);
    return descriptor;
  }
}
