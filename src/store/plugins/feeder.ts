import { PiniaPluginContext } from 'pinia';
import { Card, Plane } from '@/model/card';
import {
  BuildProps,
  ChaosInput,
  MapType,
  ResolveRevealInput,
  UpdateCounterInput,
} from '@/model/map';

const chaos = '<abbr class="symbol chaos" title="chaos">{CHAOS}</abbr>';
const plnwlk = '<abbr class="symbol planeswalk" title="planeswalk">{CHAOS}</abbr>';

export function createFeeder(context: PiniaPluginContext) {
  if (context.store.$id === 'main') {
    context.store.$onAction(({ after, name: action, args, store }) => {
      after((returned) => {
        switch (action) {
          case 'revert':
            store.pushToFeed(`<b>${store.selfName}</b> undid last action`);
            break;
          case 'init': {
            const type = (args[0] as BuildProps).type === MapType.CLASSIC
              ? 'Classic'
              : 'Eternities Map';
            store.pushToFeed(`<b>${store.selfName}</b> created new game <b>${type}</b>`);
            break;
          }
          case 'startGame': {
            store.pushToFeed(`Game starts on <b>${store.map.active[0].name}</b>`);
            break;
          }
          case 'planeswalk': {
            store.pushToFeed(
              `<b>${store.selfName}</b> ` +
              (store.map?.active[0] instanceof Plane ? `${plnwlk} to` : 'encountered') +
              ` <b>${store.map?.active[0].name}</b>`,
            );
            break;
          }
          case 'chaos': {
            store.pushToFeed(
              `<b>${store.selfName}</b> triggered ${chaos} ` +
              `on <b>${(args[0] as ChaosInput).card.name}</b>`,
            );
            break;
          }
          case 'updateCounters': {
            const payload = args[0] as UpdateCounterInput;
            const plane = store.map.active.find((c: Card) => c.id === payload.planeId) as Plane;
            const message = `<b>${store.selfName}</b> ` +
              `${payload.change > 0 ? 'added ' : 'removed '} <b>${Math.abs(payload.change)}</b> ` +
              `(<b>${plane.counter?.value}</b>) counter on ` +
              `<b>${plane.name}</b>`;
            store.pushToFeed(message);
            break;
          }
          case 'resolveReveal': {
            const payload = args[0] as ResolveRevealInput;
            if (payload.top.length > 0) {
              store.pushToFeed(
                `<b>${store.selfName}</b> putted on top ` +
                `<b>${payload.top.map(c => c.name).join('</b>, <b>')}</b>`,
              );
            }
            if (payload.bottom.length > 0) {
              store.pushToFeed(
                `<b>${store.selfName}</b> putted at the bottom ` +
                `<b>${payload.bottom.map(c => c.name).join('</b>, <b>')}</b>`,
              );
            }
            break;
          }

          case 'rollDice':
            store.pushToFeed(`<b>${store.selfName}</b> rolled a D${args[0]} and got <b>${returned}</b>`);
            break;
          case 'rollPlanarDice':
            store.pushToFeed(
              `<b>${store.selfName}</b> rolled the Planar die and got <b>${
                (returned as PlanarDiceResult) === 'PLANESWALK'
                  ? plnwlk
                  : (returned as PlanarDiceResult) === 'CHAOS' ? chaos : 'No Effect'
              }</b>`,
            );
            break;
          case 'flipCoin':
            store.pushToFeed(
              `<b>${store.selfName}</b> flipped a coin and got <b>${
                (returned as CoinFlipResult) === 'HEADS' ? 'Heads' : 'Tails'
              }</b>`,
            );
            break;
        }
      });
    }, true);
  }
}
