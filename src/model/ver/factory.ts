import type { InitPayload } from "#/store/main";
import { type BuildProps, MapType } from "../map";
import { LightSyncRepo } from "./LightSyncRepo";
import { Repo } from "./Repo";
import type { RepoInterface } from "./RepoInterface";

export const build = ({ type }: BuildProps): RepoInterface =>
	type === MapType.MULTI ? new LightSyncRepo() : new Repo();

export const restore = ({
	repo,
	mapConfig: { type },
}: InitPayload): RepoInterface =>
	type === MapType.MULTI ? new LightSyncRepo() : new Repo(repo);
