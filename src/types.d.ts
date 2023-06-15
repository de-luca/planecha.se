declare interface Coordinates {
  x: number;
  y: number;
}

declare enum Theme {
  SYS = 'sys',
  DRK = 'drk',
  LGT = 'lgt',
}

declare type Layout = 'x2' | 'x3';

declare type DiceResult = number;
declare type CoinFlipResult = 'HEADS' | 'TAILS';
declare type PlanarDiceResult = 'PLANESWALK' | 'CHAOS' | 'NO_EFFECT';
