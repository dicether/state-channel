import DiceHigher from "./DiceHigher";
import DiceLower from "./DiceLower";
import {IGame} from "./IGame";

const games: {[gameType: number]: IGame} = {
    1: new DiceLower(),
    2: new DiceHigher(),
};

export function getGameImplementation(gameType: number): IGame {
    if (!(gameType in games)) {
        throw new Error(`Unknown gameType ${gameType}`);
    }

    return games[gameType];
}
