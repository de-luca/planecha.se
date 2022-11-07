import { Card, Phenomenon, Plane } from '@/model/card';

export type Scope =  'all' | 'planes' | 'phenomena';

export interface SavedDeck {
  list: Array<string>;
  scope: Scope;
}

export const scopeMap = {
  'all': Card,
  'planes': Plane,
  'phenomena': Phenomenon,
};
