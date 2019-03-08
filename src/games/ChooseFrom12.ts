import BN from "bn.js";

import {CHOOSE_FROM_12_NUMS, getNumSetBits, PROBABILITY_DIVISOR} from "../index";
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
        const winProbability = new BN(getNumSetBits(num) * PROBABILITY_DIVISOR)
            .divn(CHOOSE_FROM_12_NUMS)
            .toNumber();
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string) {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.modn(CHOOSE_FROM_12_NUMS);
    }

    userProfit(num: number, betValue: number, resultNum: number) {
        throwOnInvalidNum(num);
        const won = (num & (1 << resultNum)) > 0; // tslint:disable-line:no-bitwise
        if (won) {
            const totalWon = new BN(betValue)
                .muln(CHOOSE_FROM_12_NUMS)
                .divn(getNumSetBits(num));
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number) {
        const totalWon = new BN(betValue)
            .muln(CHOOSE_FROM_12_NUMS)
            .divn(getNumSetBits(num));
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default ChooseFrom12;
