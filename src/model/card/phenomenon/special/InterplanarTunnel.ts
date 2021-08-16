import { Revealer, RevealerMode, RevealerSource } from '@/model/state/Revealer';
import { MapState, StateKey } from '@/model/state/MapState';
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
  public enter(state: MapState, { passive = false, initiator }: Passivity = {}): void {
    const revealer: Revealer = {
      source: RevealerSource.INTERPLANAR_TUNNEL,
      component: RevealerMode.PICK,
      sendShownTo: 'top',
      passive,
      initiator,
    };

    state.set(StateKey.REVEALER, revealer);
  }
}
