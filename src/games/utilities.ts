import {BigNumber} from "bignumber.js";
import * as ethUtil from "ethereumjs-util";

import {HOUSE_EDGE, HOUSE_EDGE_DIVISOR, PROBABILITY_DIVISOR} from "../index";

export function maxBetFromProbability(winProbability: number, bankRoll: number, k = 2) {
    const houseEdge = new BigNumber(HOUSE_EDGE);
    const probabilityDivisor = new BigNumber(PROBABILITY_DIVISOR);

    const tmp1 = probabilityDivisor.times(HOUSE_EDGE_DIVISOR).dividedToIntegerBy(winProbability);
    const tmp2 = probabilityDivisor.times(houseEdge).dividedToIntegerBy(winProbability);

    const enumerator = houseEdge.mul(bankRoll);
    const denominator = tmp1.sub(tmp2).sub(HOUSE_EDGE_DIVISOR);

    if (denominator.lt(0)) {
        throw new Error("Invalid winProbability!");
    }

    const maxBetVal = enumerator.dividedToIntegerBy(denominator);

    // round to 0.001 Ether
    return maxBetVal
        .dividedToIntegerBy(k)
        .add(5e5)
        .dividedToIntegerBy(1e6)
        .mul(1e6)
        .toNumber();
}

export function generateRandomNumber(serverSeed: string, userSeed: string): BigNumber {
    const serverSeedBuf = ethUtil.toBuffer(serverSeed);
    const userSeedBuf = ethUtil.toBuffer(userSeed);

    const seed = ethUtil.sha3(Buffer.concat([serverSeedBuf, userSeedBuf])) as Buffer;
    const hexSeed = seed.toString("hex");
    return new BigNumber(hexSeed, 16);
}

export function profitFromTotalWon(totalWon: BigNumber, betValue: number) {
    const houseEdge = totalWon.times(HOUSE_EDGE).dividedToIntegerBy(HOUSE_EDGE_DIVISOR);
    return totalWon
        .minus(houseEdge)
        .minus(betValue)
        .toNumber();
}
