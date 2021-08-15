import { RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { State } from '@/model/state/State';
import { Phenomenon } from '../Phenomenon';

/**
 * When you encounter Interplanar Tunnel,
 * reveal cards from the top of your planar deck until
 * you reveal five plane cards.
 * Put a plane card from among them on top of your planar deck,
 * then put the rest of the revealed cards on the bottom
 * in a random order.
 */
export class InterplanarTunnel extends Phenomenon {
  public enter(state: State, { passive = false, initiator }: Passivity = {}): void {
    state.openRevealer({
      source: RevealerSource.INTERPLANAR_TUNNEL,
      component: RevealerMode.PICK,
      sendShownTo: 'top',
      passive,
      initiator,
    });
  }
}
