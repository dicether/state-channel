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
        const winProbability = Number(BigInt(PROBABILITY_DIVISOR) / 2n);
        return maxBetFromProbability(winProbability, bankRoll);
    }

    resultNumber(serverSeed: string, userSeed: string): number {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return Number(randomNumber % 2n);
    }

    userProfit(num: number, betValue: number, resultNumber: number): number {
        throwOnInvalidNum(num);
        const won = resultNumber === num;
        if (won) {
            const totalWon = BigInt(betValue) * 2n;
            return profitFromTotalWon(totalWon, betValue);
        } else {
            return -betValue;
        }
    }

    maxUserProfit(num: number, betValue: number): number {
        throwOnInvalidNum(num);
        const totalWon = BigInt(betValue) * 2n;
        return profitFromTotalWon(totalWon, betValue);
    }
}

export default FlipACoin;
