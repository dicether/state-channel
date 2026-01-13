import {PROBABILITY_DIVISOR, RANGE} from "../constants";
import {IGame} from "./IGame";
import {generateRandomNumber, maxBetFromProbability, profitFromTotalWon} from "./utilities";

function throwOnInvalidNum(num: number) {
    if (num <= 0 || num + 1 >= RANGE) {
        throw new Error(`Invalid number ${num}`);
    }
}

class DiceLower implements IGame {
    maxBet(num: number, bankRoll: number): number {
        throwOnInvalidNum(num);
        const winProbability = Number(BigInt(num * PROBABILITY_DIVISOR) / BigInt(RANGE));
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string): number {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return Number(randomNumber % BigInt(RANGE));
    }

    userProfit(num: number, betValue: number, resultNumber: number): number {
        throwOnInvalidNum(num);
        const won = resultNumber < num;
        if (won) {
            const totalWon = (BigInt(betValue) * BigInt(RANGE)) / BigInt(num);
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number): number {
        throwOnInvalidNum(num);
        const totalWon = (BigInt(betValue) * BigInt(RANGE)) / BigInt(num);
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default DiceLower;
