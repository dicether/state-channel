import BN from "bn.js";
import * as ethUtil from "ethereumjs-util";

import {getNumSetBits} from "../index";
import {IGame} from "./IGame";

export const KENO_DIVIDER = 1000;
export const KENO_MAX_BET = [0, 5, 10, 7, 5, 4, 4, 2, 2, 2, 1];
export const KENO_PAY_OUT = [
    [0],
    [0, 3940],
    [0, 2000, 3740],
    [0, 1000, 3150, 9400],
    [0, 800, 1700, 5300, 24500],
    [0, 250, 1400, 4000, 16600, 42000],
    [0, 0, 1000, 3650, 7000, 16000, 46000],
    [0, 0, 460, 3000, 4400, 14000, 39000, 80000],
    [0, 0, 0, 2250, 4000, 11000, 30000, 67000, 90000],
    [0, 0, 0, 1550, 3000, 8000, 14000, 37000, 65000, 100000],
    [0, 0, 0, 1400, 2200, 4400, 8000, 28000, 60000, 120000, 200000],
];
export const KENO_SELECTABLE_FIELDS = 10;
export const KENO_FIELDS = 40;

class Keno implements IGame {
    maxBet(num: number, bankRoll: number) {
        Keno.throwOnInvalidNum(num);

        const fields = getNumSetBits(num);
        return new BN(KENO_MAX_BET[fields])
            .mul(new BN(bankRoll))
            .divn(KENO_DIVIDER)
            .toNumber();
    }

    resultNumber(serverSeed: string, userSeed: string) {
        const resultNum = new BN(0);
        const serverSeedBuf = ethUtil.toBuffer(serverSeed);
        const userSeedBuf = ethUtil.toBuffer(userSeed);

        let seed = ethUtil.sha3(Buffer.concat([serverSeedBuf, userSeedBuf])) as Buffer;

        for (let i = 0; i < KENO_SELECTABLE_FIELDS; i++) {
            const hexSeed = seed.toString("hex");
            const randNum = new BN(hexSeed, 16).modn(KENO_FIELDS - i);

            let resultPos = 0;
            let pos = 0;
            for (;;) {
                if (resultNum.and(new BN(1).shln(resultPos)).toNumber() === 0) {
                    if (pos === randNum) {
                        break;
                    }
                    pos += 1;
                }
                resultPos += 1;
            }

            resultNum.ior(new BN(1).shln(resultPos));

            // update seed
            seed = ethUtil.sha3(seed) as Buffer;
        }

        return resultNum.toNumber();
    }

    userProfit(num: number, betValue: number, resultNum: number) {
        Keno.throwOnInvalidNum(num);
        Keno.throwOnInvalidResultNum(resultNum);

        const hits = getNumSetBits(new BN(num).and(new BN(resultNum)).toNumber());
        const selected = getNumSetBits(num);

        return Keno.calcProfit(betValue, selected, hits);
    }

    maxUserProfit(num: number, betValue: number) {
        Keno.throwOnInvalidNum(num);

        const selected = getNumSetBits(num);
        return Keno.calcProfit(betValue, selected, selected);
    }

    private static calcProfit(betValue: number, selected: number, hits: number) {
        const payOutMultiplier = KENO_PAY_OUT[selected][hits];
        const payout = new BN(betValue).muln(payOutMultiplier).divn(KENO_DIVIDER);
        return payout.sub(new BN(betValue)).toNumber();
    }

    private static throwOnInvalidNum(num: number) {
        const numSetBits = getNumSetBits(num);

        if (num <= 0 || num >= Math.pow(2, KENO_FIELDS) || numSetBits < 1 || numSetBits > KENO_SELECTABLE_FIELDS) {
            throw new Error(`Invalid number ${num}`);
        }
    }

    private static throwOnInvalidResultNum(resultNum: number) {
        const numSetBits = getNumSetBits(resultNum);

        if (resultNum <= 0 || resultNum >= Math.pow(2, KENO_FIELDS) || numSetBits !== KENO_SELECTABLE_FIELDS) {
            throw new Error(`Invalid number ${resultNum}`);
        }
    }
}

export default Keno;
