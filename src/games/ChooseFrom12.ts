import {BigNumber} from "bignumber.js";

import {CHOOSE_FROM_12_NUMS, getNumSelectedCoins, PROBABILITY_DIVISOR} from "../index";
import {IGame} from "./IGame";
import {generateRandomNumber, maxBetFromProbability, profitFromTotalWon} from "./utilities";

function throwOnInvalidNum(num: number) {
    // tslint:disable-next-line:no-bitwise
    if (num <= 0 || num >= (1 << CHOOSE_FROM_12_NUMS) - 1) {
        throw new Error(`Invalid number ${num}`);
    }
}

class ChooseFrom12 implements IGame {
    maxBet(num: number, bankRoll: number) {
        throwOnInvalidNum(num);
        const winProbability = new BigNumber(getNumSelectedCoins(num) * PROBABILITY_DIVISOR)
            .dividedToIntegerBy(CHOOSE_FROM_12_NUMS)
            .toNumber();
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string) {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.mod(CHOOSE_FROM_12_NUMS).toNumber();
    }

    userProfit(num: number, betValue: number, resultNum: number) {
        throwOnInvalidNum(num);
        const won = (num & (1 << resultNum)) > 0; // tslint:disable-line:no-bitwise
        if (won) {
            const totalWon = new BigNumber(betValue)
                .times(CHOOSE_FROM_12_NUMS)
                .dividedToIntegerBy(getNumSelectedCoins(num));
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number) {
        const totalWon = new BigNumber(betValue)
            .times(CHOOSE_FROM_12_NUMS)
            .dividedToIntegerBy(getNumSelectedCoins(num));
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default ChooseFrom12;
