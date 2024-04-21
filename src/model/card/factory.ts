import type { Card, Props } from "./Card";
import { build as buildPhenomenon } from "./phenomenon";
import { build as buildPlane } from "./plane";

export const build = (props: Props): Card =>
	props.typeLine === "Phenomenon" ? buildPhenomenon(props) : buildPlane(props);
