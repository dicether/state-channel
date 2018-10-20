import ChooseFrom12 from "./ChooseFrom12";
import DiceHigher from "./DiceHigher";
import DiceLower from "./DiceLower";
import FlipACoin from "./FlipACoin";
import {IGame} from "./IGame";

const games: {[gameType: number]: IGame} = {
    1: new DiceLower(),
    2: new DiceHigher(),
    3: new ChooseFrom12(),
    4: new FlipACoin(),
};

export function getGameImplementation(gameType: number): IGame {
    if (!(gameType in games)) {
        throw new Error(`Unknown gameType ${gameType}`);
    }

    return games[gameType];
}
