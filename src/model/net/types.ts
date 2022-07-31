import { Exported, MapInterface } from '../map';
import { Clone, RepoInterface } from '../ver';

export type RequestInitOutput = [
  MapInterface,
  RepoInterface,
  Array<string>,
];

export enum Event {
  REQUEST_INIT = 'REQUEST_INIT',
  INIT = 'INIT',
  HEY = 'HEY',
  SYNC = 'SYNC',
  REVERT = 'REVERT',
  FEED = 'FEED',
}

export interface Payload<T> {
  event: Event,
  data: T,
}

export interface Hey {
  name: string;
}

export interface InitPayload {
  repo: Clone;
  map: Exported;
  feed: Array<string>;
}
