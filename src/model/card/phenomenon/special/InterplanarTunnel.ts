import { Phenomenon } from '../Phenomenon';
import {
  MapStates,
  RevealerMode,
  RevealerSource,
  RevealerWallState,
  StateKey,
} from '@/model/states';

/**
 * When you encounter Interplanar Tunnel,
 * reveal cards from the top of your planar deck until
 * you reveal five plane cards.
 * Put a plane card from among them on top of your planar deck,
 * then put the rest of the revealed cards on the bottom
 * in a random order.
 */
export class InterplanarTunnel extends Phenomenon {
  public enter(states: MapStates, { passive = false, initiator }: Passivity = {}): void {
    const revealer: RevealerWallState = {
      source: RevealerSource.INTERPLANAR_TUNNEL,
      component: RevealerMode.PICK,
      sendShownTo: 'top',
      passive,
      initiator,
    };

    states.set(StateKey.REVEALER, revealer);
  }
}
