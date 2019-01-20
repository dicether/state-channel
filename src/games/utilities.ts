import BN from "bn.js";
import * as ethUtil from "ethereumjs-util";

import {HOUSE_EDGE, HOUSE_EDGE_DIVISOR, PROBABILITY_DIVISOR} from "../index";

export function maxBetFromProbability(winProbability: number, bankRoll: number) {
    const houseEdge = new BN(HOUSE_EDGE);
    const probabilityDivisor = new BN(PROBABILITY_DIVISOR);

    const tmp1 = probabilityDivisor.muln(HOUSE_EDGE_DIVISOR).divn(winProbability);
    const tmp2 = probabilityDivisor.mul(houseEdge).divn(winProbability);

    const enumerator = houseEdge.mul(new BN(bankRoll));
    const denominator = tmp1.sub(tmp2).subn(HOUSE_EDGE_DIVISOR);

    if (denominator.ltn(0)) {
        throw new Error("Invalid winProbability!");
    }

    return enumerator.div(denominator).toNumber();
}

export function generateRandomNumber(serverSeed: string, userSeed: string): BN {
    const serverSeedBuf = ethUtil.toBuffer(serverSeed);
    const userSeedBuf = ethUtil.toBuffer(userSeed);

    const seed = ethUtil.sha3(Buffer.concat([serverSeedBuf, userSeedBuf])) as Buffer;
    const hexSeed = seed.toString("hex");
    return new BN(hexSeed, 16);
}

export function profitFromTotalWon(totalWon: BN, betValue: number) {
    const houseEdge = totalWon.muln(HOUSE_EDGE).divn(HOUSE_EDGE_DIVISOR);
    return totalWon
        .sub(houseEdge)
        .sub(new BN(betValue))
        .toNumber();
}
