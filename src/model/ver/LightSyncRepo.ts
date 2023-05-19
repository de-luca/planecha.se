import { Exported } from '../map';
import { Repo } from './Repo';
import { Patch, diff } from '#/utils/delta';

export class LightSyncRepo extends Repo {
  private stage?: Exported;

  public commit(event: string, newVersion: Exported): Patch {
    super.commit(event, newVersion);

    const exportLight = {
      ...newVersion,
      deck: { cards: [], played: [] },
    };
    const patch = {
      event,
      delta: diff(this.stage, exportLight),
    };
    this.stage = exportLight;
    return patch;
  }

  public apply(): void {
    // NOOP
  }
}
