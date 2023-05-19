import shffl from 'lodash.shuffle';
import type { Card } from '#/model/card';

const defaultLoops = 10;

export function shuffle<T extends Card>(cards: Array<T>, loops = defaultLoops): Array<T> {
  let shuffled = [...cards];
  for (let i = 0; i < loops; i++) {
    shuffled = shffl(shuffled);
  }
  return shuffled;
}
