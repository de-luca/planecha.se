import { 
    MutationTypes, 
    State, 
    Store,
} from "..";
import { Beacon } from '@/model/net/Beacon';
import { PeerMap } from '@/model/net/PeerMap';
import { MutationPayload } from "vuex";

let beacon: Beacon;
let peers: PeerMap;

function onCreated(store: Store): EventListener {
    return function (event: CustomEvent<string>) {
        console.log('CREATED', event.detail);
        // store.commit('');
    } as EventListener;
}

function handler(store: Store): (mutation: MutationPayload, state: State) => Promise<void> {
    return async function(mutation: MutationPayload, state: State): Promise<void> {
        switch(mutation.type) {
            case MutationTypes.OPEN:
                beacon = await new Promise<Beacon>((resolve) => {
                    const beacon = new Beacon();
                    beacon.addEventListener('ready', _ => resolve(beacon));
                });
                
                peers = new PeerMap(beacon);
                beacon.addEventListener('created', onCreated(store));
                beacon.create();
                break;
        }
    };
}

export default function createNet() {
    return (store: Store) => {
        store.subscribe(handler(store));
    };
};
