import {CHOOSE_FROM_12_NUMS, PROBABILITY_DIVISOR} from "../constants";
import {getNumSetBits} from "../utilities";
import {IGame} from "./IGame";
import {generateRandomNumber, maxBetFromProbability, profitFromTotalWon} from "./utilities";

function throwOnInvalidNum(num: number) {
    if (num <= 0 || num >= (1 << CHOOSE_FROM_12_NUMS) - 1) {
        throw new Error(`Invalid number ${num}`);
    }
}

class ChooseFrom12 implements IGame {
    maxBet(num: number, bankRoll: number): number {
        throwOnInvalidNum(num);
        const winProbability = Number(
            (BigInt(getNumSetBits(num)) * BigInt(PROBABILITY_DIVISOR)) / BigInt(CHOOSE_FROM_12_NUMS),
        );
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string): number {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return Number(randomNumber % BigInt(CHOOSE_FROM_12_NUMS));
    }

    userProfit(num: number, betValue: number, resultNum: number): number {
        throwOnInvalidNum(num);
        const won = (num & (1 << resultNum)) > 0;
        if (won) {
            const totalWon = (BigInt(betValue) * BigInt(CHOOSE_FROM_12_NUMS)) / BigInt(getNumSetBits(num));
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number): number {
        throwOnInvalidNum(num);
        const totalWon = (BigInt(betValue) * BigInt(CHOOSE_FROM_12_NUMS)) / BigInt(getNumSetBits(num));
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default ChooseFrom12;
