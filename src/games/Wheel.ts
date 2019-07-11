import BN from "bn.js";

import {IGame} from "./IGame";
import {generateRandomNumber} from "./utilities";

export const MAX_BET_DIVIDER = 10000;

export const WHEEL_MAX_BET: {[key: number]: {[key: number]: number}} = {
    1: {10: 632, 20: 386},
    2: {10: 134, 20: 134},
    3: {10: 17, 20: 8},
};

export const PAYOUT_DIVIDER = 100;

export const WHEEL_PAYOUT: {[key: number]: {[key: number]: number[]}} = {
    1: {
        10: [0, 120, 120, 0, 120, 120, 145, 120, 120, 120],
        20: [0, 120, 120, 0, 120, 120, 145, 120, 0, 120, 240, 120, 0, 120, 120, 145, 120, 0, 120, 120],
    },
    2: {
        10: [0, 165, 0, 160, 0, 300, 0, 160, 0, 200],
        20: [0, 165, 0, 160, 0, 300, 0, 160, 0, 200, 0, 165, 0, 160, 0, 300, 0, 160, 0, 200],
    },
    3: {
        10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 985],
        20: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1970],
    },
};

export const WHEEL_RESULT_RANGE = 600;

class Wheel implements IGame {
    maxBet(num: number, bankRoll: number) {
        Wheel.throwOnInvalidNum(num);

        const risk = Wheel.getRisk(num);
        const segments = Wheel.getSegments(num);
        const maxBet = WHEEL_MAX_BET[risk][segments];

        return new BN(bankRoll)
            .muln(maxBet)
            .divn(MAX_BET_DIVIDER)
            .toNumber();
    }

    resultNumber(serverSeed: string, userSeed: string) {
        const randomNumber = generateRandomNumber(serverSeed, userSeed);
        return randomNumber.modn(WHEEL_RESULT_RANGE);
    }

    userProfit(num: number, betValue: number, resultNum: number) {
        Wheel.throwOnInvalidNum(num);
        Wheel.throwOnInvalidResultNum(resultNum);

        const risk = Wheel.getRisk(num);
        const segments = Wheel.getSegments(num);
        const result = new BN(resultNum)
            .muln(segments)
            .divn(WHEEL_RESULT_RANGE)
            .toNumber();

        return new BN(betValue)
            .mul(new BN(WHEEL_PAYOUT[risk][segments][result]))
            .divn(PAYOUT_DIVIDER)
            .sub(new BN(betValue))
            .toNumber();
    }

    maxUserProfit(num: number, betValue: number) {
        Wheel.throwOnInvalidNum(num);

        const risk = Wheel.getRisk(num);
        const segments = Wheel.getSegments(num);

        const maxPayout = WHEEL_PAYOUT[risk][segments].reduce((a, b) => Math.max(a, b));

        return new BN(betValue)
            .mul(new BN(maxPayout))
            .divn(PAYOUT_DIVIDER)
            .sub(new BN(betValue))
            .toNumber();
    }

    private static getRisk(num: number) {
        return Math.floor(num / 100) % 10;
    }

    private static getSegments(num: number) {
        return num % 100;
    }

    private static throwOnInvalidNum(num: number) {
        const risk = this.getRisk(num);
        const segments = this.getSegments(num);

        if (risk < 1 || risk > 3 || segments > 20 || segments < 10 || segments % 10 !== 0) {
            throw new Error(`Invalid number ${num}`);
        }
    }

    private static throwOnInvalidResultNum(resultNum: number) {
        if (resultNum < 0 || resultNum >= WHEEL_RESULT_RANGE) {
            throw new Error(`Invalid number ${resultNum}`);
        }
    }
}

export default Wheel;
