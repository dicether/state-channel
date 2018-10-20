import {BigNumber} from "bignumber.js";

import {PROBABILITY_DIVISOR, RANGE} from "../index";
import {IGame} from "./IGame";
import {generateRandomNumber, maxBetFromProbability, profitFromTotalWon} from "./utilities";

function throwOnInvalidNum(num: number) {
    if (num < 0 || num + 1 >= RANGE) {
        throw new Error(`Invalid number ${num}`);
    }
}

class DiceHigher implements IGame {
    maxBet(num: number, bankRoll: number) {
        throwOnInvalidNum(num);
        const winProbability = new BigNumber((RANGE - num - 1) * PROBABILITY_DIVISOR)
            .dividedToIntegerBy(RANGE)
            .toNumber();
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string, betNum: number) {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.mod(RANGE).toNumber();
    }

    userProfit(num: number, betValue: number, resultNum: number) {
        throwOnInvalidNum(num);
        const won = resultNum > num;
        if (won) {
            const totalWon = new BigNumber(betValue)
                .times(new BigNumber(RANGE))
                .dividedToIntegerBy(new BigNumber(RANGE - num - 1));
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number) {
        const totalWon = new BigNumber(betValue)
            .times(new BigNumber(RANGE))
            .dividedToIntegerBy(new BigNumber(RANGE - num - 1));
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default DiceHigher;
