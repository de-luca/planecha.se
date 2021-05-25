import { OnlineDecorator } from "../game/OnlineDecorator";
import { Classic } from "./Classic";
import { EmptyMap } from "./EmptyMap";
import { EternitiesMap } from "./EternitiesMap";
import { Map } from "./Map";
import { MapInterface, MapType } from "./MapInterface";

export interface AdvancedOptions {}

export interface FactoryProps {
  type: MapType,
  online: boolean,
  advanced?: AdvancedOptions,
}

export class MapFactory {
  private type: MapType;
  private online: boolean;
  private advanced?: AdvancedOptions;

  public constructor(props: FactoryProps) {
    this.type = props.type;
    this.online = props.online;
    this.advanced = props.advanced;
  }

  public build(): MapInterface {
    const map = this.buildMap();

    if (this.online) {
      return new OnlineDecorator(map);
    }

    return map;
  }

  private buildMap(): MapInterface {
    switch (this.type) {
      case MapType.EMPTY:
        return new EmptyMap();
      case MapType.CLASSIC:
        return new Classic();
      case MapType.ETERNITIES:
        return new EternitiesMap();
    }
  }
}