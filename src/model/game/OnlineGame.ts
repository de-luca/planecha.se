import { Game } from './Game';
import { Player } from '../player';

export class OnlineGame extends Game {
    private name: string;

    private players: Array<Player>;
}
