import { Component } from 'vue';
import { useMain } from '#/store/main';
import * as SVGs from '#/components/svgs/dices';

const store = useMain();

export type DiceType = 'planar' | 'coin' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface DiceConf {
  type: DiceType;
  sides: number;
  action: (...params: Array<unknown>) => unknown;
  svg: Component;
}

export const DICES: Array<DiceConf> = [{
  type: 'd4',
  sides: 4,
  action: () => store.rollDice(4),
  svg: SVGs.D4,
}, {
  type: 'd4',
  sides: 4,
  action: () => store.rollDice(4),
  svg: SVGs.D4,
}, {
  type: 'd6',
  sides: 6,
  action: () => store.rollDice(6),
  svg: SVGs.D6,
}, {
  type: 'd8',
  sides: 8,
  action: () => store.rollDice(8),
  svg: SVGs.D8,
}, {
  type: 'd10',
  sides: 10,
  action: () => store.rollDice(10),
  svg: SVGs.D10,
}, {
  type: 'd12',
  sides: 12,
  action: () => store.rollDice(12),
  svg: SVGs.D12,
}, {
  type: 'd20',
  sides: 20,
  action: () => store.rollDice(20),
  svg: SVGs.D20,
}];
