import { BeaconNet } from "./BeaconNet";
import type { BootParams, CreateParams, NetInterface } from "./NetInterface";
import { TrysteroNet } from "./TrysteroNet";

type NetType = "beacon" | "trystero";
const DEFAULT_NET_TYPE: NetType = "trystero";

export const create = (params: CreateParams): Promise<NetInterface> =>
	(localStorage.getItem("netType") ?? DEFAULT_NET_TYPE) === "trystero"
		? TrysteroNet.create(params)
		: BeaconNet.create(params);

export const boot = (params: BootParams): Promise<NetInterface> =>
	(localStorage.getItem("netType") ?? DEFAULT_NET_TYPE) === "trystero"
		? TrysteroNet.boot(params)
		: BeaconNet.boot(params);
