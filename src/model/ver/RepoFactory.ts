import { BuildProps, MapType } from '../map';
import { LightSyncRepo } from './LightSyncRepo';
import { Repo } from './Repo';
import { RepoInterface } from './RepoInterface';
import type { InitPayload } from '#/store/main';

export class RepoFactory {
  public static build({ type }: BuildProps): RepoInterface {
    return type === MapType.MULTI
      ? new LightSyncRepo()
      : new Repo();
  }

  public static restore({ repo, mapConfig: { type } }: InitPayload): RepoInterface {
    return type === MapType.MULTI
      ? new LightSyncRepo()
      : new Repo(repo);
  }
}
