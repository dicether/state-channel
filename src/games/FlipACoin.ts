import BN from "bn.js";

import {PROBABILITY_DIVISOR} from "../constants";
import {IGame} from "./IGame";
import {generateRandomNumber, maxBetFromProbability, profitFromTotalWon} from "./utilities";

function throwOnInvalidNum(num: number) {
    if (num < 0 || num > 1) {
        throw new Error(`Invalid number ${num}`);
    }
}

class FlipACoin implements IGame {
    maxBet(num: number, bankRoll: number): number {
        throwOnInvalidNum(num);
        const winProbability = new BN(PROBABILITY_DIVISOR).divn(2).toNumber();
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string): number {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.modn(2);
    }

    userProfit(num: number, betValue: number, resultNumber: number): number {
        throwOnInvalidNum(num);
        const won = resultNumber === num;
        if (won) {
            const totalWon = new BN(betValue).muln(2);
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number): number {
        const totalWon = new BN(betValue).muln(2);
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default FlipACoin;
