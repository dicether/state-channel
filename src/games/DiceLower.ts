import BN from "bn.js";

import {PROBABILITY_DIVISOR, RANGE} from "../index";
import {IGame} from "./IGame";
import {generateRandomNumber, maxBetFromProbability, profitFromTotalWon} from "./utilities";

function throwOnInvalidNum(num: number) {
    if (num <= 0 || num >= RANGE) {
        throw new Error(`Invalid number ${num}`);
    }
}

class DiceLower implements IGame {
    maxBet(num: number, bankRoll: number) {
        throwOnInvalidNum(num);
        const winProbability = new BN(num * PROBABILITY_DIVISOR).divn(RANGE).toNumber();
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string) {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.modn(RANGE);
    }

    userProfit(num: number, betValue: number, resultNumber: number) {
        throwOnInvalidNum(num);
        const won = resultNumber < num;
        if (won) {
            const totalWon = new BN(betValue).muln(RANGE).divn(num);
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number) {
        const totalWon = new BN(betValue).muln(RANGE).divn(num);
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default DiceLower;
