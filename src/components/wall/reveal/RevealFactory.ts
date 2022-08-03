import { Component } from 'vue';

import Pick from './Pick.vue';
import Show from './Show.vue';
import Scry from './Scry.vue';
import { RevealerMode } from '@/model/wall';

export class RevealFactory {
  private static readonly map: Record<RevealerMode, Component> = {
    [RevealerMode.SCRY]: Scry,
    [RevealerMode.SHOW]: Show,
    [RevealerMode.PICK]: Pick,
  };

  public static get(mode: RevealerMode): Component {
    return RevealFactory.map[mode];
  }
}
