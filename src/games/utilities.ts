import {stripHexPrefix} from "@ethereumjs/util";
import BN from "bn.js";

import {HOUSE_EDGE, HOUSE_EDGE_DIVISOR, PROBABILITY_DIVISOR} from "../constants";
import {Hex} from "../types";
import {concatHexStrings, keccak} from "../utilities";

export function maxBetFromProbability(winProbability: number, bankRoll: number): number {
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
    const seed = keccak(concatHexStrings(serverSeed as Hex, userSeed as Hex));
    return new BN(stripHexPrefix(seed), 16);
}

export function profitFromTotalWon(totalWon: BN, betValue: number): number {
    const houseEdge = totalWon.muln(HOUSE_EDGE).divn(HOUSE_EDGE_DIVISOR);
    return totalWon.sub(houseEdge).sub(new BN(betValue)).toNumber();
}
