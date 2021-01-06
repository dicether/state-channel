import BN from "bn.js";

import {IGame} from "./IGame";
import {generateRandomNumber} from "./utilities";

export const PLINKO_MAX_BET_DIVIDER = 10000;

export const PLINKO_MAX_BET: {[key: number]: {[key: number]: number}} = {
    1: {8: 264, 12: 607, 16: 758},
    2: {8: 55, 12: 175, 16: 208},
    3: {8: 24, 12: 77, 16: 68},
};

export const PLINKO_PAYOUT_DIVIDER = 10;

export const PLINKO_PAYOUT: {[key: number]: {[key: number]: number[]}} = {
    1: {
        8: [4, 9, 14, 19, 73],
        12: [4, 10, 11, 15, 18, 31, 100],
        16: [4, 10, 11, 12, 16, 17, 18, 75, 130],
    },
    2: {
        8: [3, 5, 15, 37, 160],
        12: [3, 6, 14, 20, 30, 42, 220],
        16: [2, 5, 14, 17, 19, 40, 63, 96, 250],
    },
    3: {
        8: [1, 3, 10, 71, 210],
        12: [1, 4, 11, 31, 46, 81, 270],
        16: [1, 3, 11, 20, 32, 56, 100, 260, 800],
    },
};

class Plinko implements IGame {
    public maxBet(num: number, bankRoll: number): number {
        Plinko.throwOnInvalidNum(num);

        const risk = Plinko.getRisk(num);
        const rows = Plinko.getRows(num);
        const maxBet = PLINKO_MAX_BET[risk][rows];

        return new BN(bankRoll)
            .muln(maxBet)
            .divn(PLINKO_MAX_BET_DIVIDER)
            .toNumber();
    }

    public resultNumber(serverSeed: string, userSeed: string, num: number): number {
        Plinko.throwOnInvalidNum(num);

        const rows = Plinko.getRows(num);
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        // tslint:disable-next-line:no-bitwise
        return randomNumber.and(new BN((1 << rows) - 1)).toNumber();
    }

    public userProfit(num: number, betValue: number, resultNum: number): number {
        Plinko.throwOnInvalidNum(num);
        Plinko.throwOnInvalidResultNum(num, resultNum);

        const risk = Plinko.getRisk(num);
        const rows = Plinko.getRows(num);

        let numBitsSet = 0;
        for (let i = 0; i < rows; i++) {
            // tslint:disable-next-line:no-bitwise
            if ((resultNum & (1 << i)) > 0) {
                numBitsSet++;
            }
        }

        const halfRows = Math.floor(rows / 2);
        const resultIndex = numBitsSet < halfRows ? halfRows - numBitsSet : numBitsSet - halfRows;
        const payout = PLINKO_PAYOUT[risk][rows][resultIndex];

        return Plinko.calculateProfit(betValue, payout);
    }

    public maxUserProfit(num: number, betValue: number): number {
        Plinko.throwOnInvalidNum(num);

        const risk = Plinko.getRisk(num);
        const rows = Plinko.getRows(num);

        const maxPayout = PLINKO_PAYOUT[risk][rows].reduce((a, b) => Math.max(a, b));

        return Plinko.calculateProfit(betValue, maxPayout);
    }

    private static calculateProfit(betValue: number, payout: number): number {
        return new BN(betValue)
            .mul(new BN(payout))
            .divn(PLINKO_PAYOUT_DIVIDER)
            .sub(new BN(betValue))
            .toNumber();
    }

    private static getRisk(num: number): number {
        return Math.floor(num / 100) % 10;
    }

    private static getRows(num: number) {
        return num % 100;
    }

    private static throwOnInvalidNum(num: number) {
        const risk = this.getRisk(num);
        const rows = this.getRows(num);

        if ((risk !== 1 && risk !== 2 && risk !== 3) || (rows !== 8 && rows !== 12 && rows !== 16)) {
            throw new Error(`Invalid number ${num}`);
        }
    }

    private static throwOnInvalidResultNum(num: number, resultNum: number) {
        const rows = this.getRows(num);
        // tslint:disable-next-line:no-bitwise
        if (resultNum < 0 || resultNum >= 1 << rows) {
            throw new Error(`Invalid result number ${resultNum}`);
        }
    }
}

export default Plinko;
