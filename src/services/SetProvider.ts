/*eslint import/namespace: ['error', { allowComputed: true }]*/

import { Component, markRaw } from 'vue';
import * as setIcons from '#/components/svgs/sets';
import sets from '#assets/sets.json';

interface Set {
  name: string;
  code: string;
  icon: Component;
}

export class SetProvider {
  private static readonly raw: Map<string, Set> = sets.reduce(
    (acc, s) => acc.set(s.code, {
      ...s,
      icon: markRaw(setIcons[s.code as keyof typeof setIcons]),
    }),
    new Map(),
  );

  public static getSets(): Map<string, Set> {
    return SetProvider.raw;
  }
}
