import BN from "bn.js";

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
        const winProbability = new BN((RANGE - num - 1) * PROBABILITY_DIVISOR)
            .divn(RANGE)
            .toNumber();
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string, betNum: number) {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.modn(RANGE);
    }

    userProfit(num: number, betValue: number, resultNum: number) {
        throwOnInvalidNum(num);
        const won = resultNum > num;
        if (won) {
            const totalWon = new BN(betValue)
                .muln(RANGE)
                .divn(RANGE - num - 1);
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number) {
        const totalWon = new BN(betValue)
            .muln(RANGE)
            .divn(RANGE - num - 1);
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default DiceHigher;
