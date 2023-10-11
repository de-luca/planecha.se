import { PiniaPluginContext } from 'pinia';
import { isMain } from '../main';
import { Card, Plane } from '#/model/card';
import {
  ChaosInput,
  MapType,
  UpdateCounterInput,
} from '#/model/map';

const chaos = '<abbr class="symbol chaos" title="chaos">{CHAOS}</abbr>';
const plnwlk = '<abbr class="symbol planeswalk" title="planeswalk">{CHAOS}</abbr>';

function gameType(type: MapType): string {
  switch (type) {
    case MapType.SINGLE:
      return 'Single Deck';
    case MapType.MULTI:
      return 'Multiple Decks';
    case MapType.ETERNITIES:
      return 'Eternities Map';
  }
}

export function createFeeder({ store }: PiniaPluginContext) {
  if (isMain(store)) {
    store.$onAction(({ after, name: action, args, store }) => {
      after((returned) => {
        switch (action) {
          case 'undo':
            return store.pushToFeed(`<b>${store.logName}</b> undid last action`);

          case 'reset':
          case 'init':
            return store.pushToFeed(`<b>${store.logName}</b> created new game <b>${gameType(store.config.type)}</b>`);

          case 'startGame':
            return store.pushToFeed(store.isMulti
              ? 'Game starts'
              : `Game starts on <b>${store.map.active[0].name}</b>`,
            );

          case 'addActivePlane':
            return store.pushToFeed(`<b>${store.logName}</b> ${plnwlk} to ${args[0].plane.name} (added)`);

          case 'planeswalk':
            return store.pushToFeed(
              `<b>${store.logName}</b> ` +
              (store.map?.active[0] instanceof Plane ? `${plnwlk} to` : 'encountered') +
              ` <b>${store.map?.active[0].name}</b>`,
            );

          case 'chaos':
            return store.pushToFeed(
              `<b>${store.logName}</b> triggered ${chaos} ` +
              `on <b>${(args[0] as ChaosInput).card.name}</b>`,
            );

          case 'updateCounters': {
            const payload = args[0] as UpdateCounterInput;
            const plane = store.map.active.find((c: Card) => c.id === payload.planeId) as Plane;
            const message = `<b>${store.logName}</b> ` +
              `${payload.change > 0 ? 'added ' : 'removed '} <b>${Math.abs(payload.change)}</b> ` +
              `(<b>${plane.counter?.value}</b>) counter on ` +
              `<b>${plane.name}</b>`;
            return store.pushToFeed(message);
          }

          case 'privateReveal':
            return store.pushToFeed(
              `<b>${store.logName}</b> ${store.logName === 'You' ? 'are' : 'is'} looking at the top ${args[0].count} cards on top of the planar deck`,
            );

          case 'privateResolveReveal':
            return store.pushToFeed(
              `<b>${store.logName}</b> putted back ${args[0].top.length} card on the top and ${args[0].bottom.length} at the bottom`,
            );

          case 'resolveReveal': {
            if (args[0].top.length > 0) {
              store.pushToFeed(
                `<b>${store.logName}</b> putted on top ` +
                `<b>${args[0].top.map(c => c.name).join('</b>, <b>')}</b>`,
              );
            }
            if (args[0].bottom.length > 0) {
              store.pushToFeed(
                `<b>${store.logName}</b> putted at the bottom ` +
                `<b>${args[0].bottom.map(c => c.name).join('</b>, <b>')}</b>`,
              );
            }
            return;
          }

          case 'rollDice':
            return store.pushToFeed(`<b>${store.logName}</b> rolled a D${args[0]} and got <b>${returned}</b>`);

          case 'rollPlanarDice':
            return store.pushToFeed(
              `<b>${store.logName}</b> rolled the Planar die and got <b>${
                (returned as PlanarDiceResult) === 'PLANESWALK'
                  ? plnwlk
                  : (returned as PlanarDiceResult) === 'CHAOS' ? chaos : 'No Effect'
              }</b>`,
            );

          case 'flipCoin':
            return store.pushToFeed(
              `<b>${store.logName}</b> flipped a coin and got <b>${
                (returned as CoinFlipResult) === 'HEADS' ? 'Heads' : 'Tails'
              }</b>`,
            );
        }
      });
    }, true);
  }
}
