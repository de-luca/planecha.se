// import { io } from 'socket.io-client';

enum State {
    ACTIVE = 'active',
    VISIBLE = 'visible',
}

interface ImageCollection {
    art_crop: string;
    border_crop: string;
    large: string;
    normal: string;
    png: string;
    small: string;
}

interface Plane {
    id: string; // Scryfall UUID
    name: string;
    multiverse_ids?: Array<number> | null;
    oracle_id: string // UUID oracle ID
    oracle_text: string;
    scryfall_uri: string;
    image_uris: ImageCollection;
}

interface Coordinate {
    x: number;
    y: number;
}

interface Card {
    coordinate: Coordinate;
    plane: Plane;
    state: State;
}

function ready(fn: any) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function shuffleArray<T>(array: Array<T>): Array<T> {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const wrap = document.querySelector('.wrapper') as Element;
const maxRange = 3;
const center = 0;
const activeRange = 1;

let active: Card;
let cards: Array<Card>;
let planes: Array<Plane>;

console.log("COUCOU");

ready(async function () {

    
// // });

// function open(): WebSocket {
//     const ws = new WebSocket('ws://localhost:8999');
//     ws.onopen = ev => console.log(ev);
//     ws.onmessage = ev => console.log(ev.data);

//     return ws;
// }


    const res = await fetch('https://api.scryfall.com/cards/search?q=t:plane');
    planes = shuffleArray<Plane>((await res.json()).data);

    active = {
        coordinate: { x: 0, y: 0 },
        state: State.ACTIVE,
        plane: planes.shift() as Plane,
    };
    cards = [ active ];

    for (let y = activeRange * -1; y <= activeRange; y++) {
        for (let x = activeRange * -1; x <= activeRange; x++) {
            if (
                Math.abs(x) + Math.abs(y) <= activeRange &&
                Math.abs(x) + Math.abs(y) !== 0
            ) {
                cards.push({
                    coordinate: { x, y },
                    state: State.VISIBLE,
                    plane: planes.shift() as Plane,
                });
            }
        }
    }

    paint();
});


function paint() {
    // Remove all content
    wrap.innerHTML = '';

    for (let y = maxRange * -1; y <= maxRange; y++) {
        for (let x = maxRange * -1; x <= maxRange; x++) {
            const card = cards.find((c) => c.coordinate.x === x && c.coordinate.y === y);
            const div = document.createElement('div');

            div.title = `${x}/${y}`;
            div.classList.add('box');
            div.dataset.x = x + '';
            div.dataset.y = y + '';

            if (card) {
                div.classList.add(card.state);
                div.textContent = card.plane.name;

                if (
                    (Math.abs(x) + Math.abs(y)) <= activeRange &&
                    (Math.abs(x) + Math.abs(y)) > 0
                ) {
                    div.classList.add('planewalkable');
                    div.addEventListener('click', move);
                }
            } else {
                if (
                    Math.abs(x) === Math.abs(y) &&
                    (Math.abs(x) + Math.abs(y)) === activeRange + 1
                ) {
                    div.classList.add('planewalkable');
                    div.addEventListener('click', move);
                }
            }

            wrap.appendChild(div);
        }
    }
}


function move() {
    const xOffset = parseInt(this.dataset.x);
    const yOffset = parseInt(this.dataset.y);

    active.state = State.VISIBLE;

    let newActive = cards.find((c) => c.coordinate.x === xOffset && c.coordinate.y === yOffset);
    if (newActive) {
        newActive.state = State.ACTIVE;
    } else {
        newActive = {
            coordinate: { x: xOffset, y: yOffset },
            state: State.ACTIVE,
            plane: planes.shift() as Plane,
        };

        cards.push(newActive);
    }
    active = newActive;


    for (let y = (activeRange * -1) + yOffset; y <= activeRange + yOffset; y++) {
        for (let x = (activeRange * -1) + xOffset; x <= activeRange + xOffset; x++) {
            if (
                (Math.abs(x - xOffset) + Math.abs(y - yOffset)) <= activeRange
            ) {
                const card = cards.find((c) => c.coordinate.x === x && c.coordinate.y === y);
                if (card) {
                    console.log('exist');
                } else {
                    cards.push({
                        coordinate: { x, y },
                        state: State.VISIBLE, 
                        plane: planes.shift() as Plane,
                    });
                }
            }
        }
    }

    cards.forEach(card => {
        card.coordinate.x = card.coordinate.x + (xOffset * -1);
        card.coordinate.y = card.coordinate.y + (yOffset * -1);
    });

    cards = cards.filter(card => Math.abs(card.coordinate.x) + Math.abs(card.coordinate.y) <= maxRange);

    paint();
}