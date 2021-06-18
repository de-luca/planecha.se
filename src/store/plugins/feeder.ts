import { 
    MutationTypes, 
    State, 
    Store,
} from "..";
import { MutationPayload } from "vuex";
import { Card, Plane } from "@/model/card";

function handler(store: Store): (mutation: MutationPayload, state: State) => Promise<void> {
    return async function(mutation: MutationPayload, state: State): Promise<void> {
        switch (mutation.type) {
            case MutationTypes.INIT:
                store.state.feed.push(`<b>You</b> created new game <b>Classic</b>`);
                store.state.feed.push(`Game starts on <b>${state.map?.active[0].name}</b>`);
                break;
            case MutationTypes.PLANESWALK: {
                const message = '<b>You</b> ' +
                    (state.map?.active[0].type === 'plane' ? 'planeswalked to ' : 'encountered ') +
                    `<b>${state.map?.active[0].name}</b>`;
                store.state.feed.push(message);
                break;
            }
            case MutationTypes.CUSTOM_PLANESWALK: {
                const message = '<b>You</b> planeswalked to ' +
                    `<b>${state.map?.active.map(c => c.name).join('</b> and <b>')}</b>`;
                store.state.feed.push(message);
                break;
            }
            case MutationTypes.CHAOS:
                store.state.feed.push(`<b>You</b> triggered <b>Chaos</b>`);
                break;
            case MutationTypes.COUNTERS: {
                const payload = mutation.payload as { id: string, change: number };
                const plane = state.map?.active.find(c => c.id === payload.id) as Plane;
                const message = '<b>You</b> ' +
                    `${payload.change > 0 ? 'added ' : 'removed '} <b>${Math.abs(payload.change)}</b> counter on ` +
                    `<b>${plane.name}</b> (<b>${plane.counter?.value}</b>)`;
                store.state.feed.push(message);
                break;
            }
            case MutationTypes.RESOLVE_REVEAL: {
                const payload = mutation.payload as { top: Array<Card>, bottom: Array<Card> };
                if (payload.top.length > 0 ) {
                    store.state.feed.push(
                        `You putted on top <b>${payload.top.map(c => c.name).join('</b>, <b>')}</b>`,
                    );
                }
                if (payload.bottom.length > 0) {
                    store.state.feed.push(
                        `You putted at the bottom <b>${payload.bottom.map(c => c.name).join('</b>, <b>')}</b>`,
                    );
                }
                break;
            }
        }
    };
}

export function createFeeder() {
    return (store: Store) => {
        store.subscribe(handler(store));
    };
};
