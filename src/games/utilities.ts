import {HOUSE_EDGE, HOUSE_EDGE_DIVISOR, PROBABILITY_DIVISOR} from "../constants";
import {Hex} from "../types";
import {concatHexStrings, keccak} from "../utilities";

export function maxBetFromProbability(winProbability: number, bankRoll: number): number {
    const houseEdge = BigInt(HOUSE_EDGE);
    const probabilityDivisor = BigInt(PROBABILITY_DIVISOR);

    const tmp1 = (probabilityDivisor * BigInt(HOUSE_EDGE_DIVISOR)) / BigInt(winProbability);
    const tmp2 = (probabilityDivisor * BigInt(houseEdge)) / BigInt(winProbability);

    const enumerator = houseEdge * BigInt(bankRoll);
    const denominator = tmp1 - tmp2 - BigInt(HOUSE_EDGE_DIVISOR);

    if (denominator < 0n) {
        throw new Error("Invalid winProbability!");
    }

    return Number(enumerator / denominator);
}

export function generateRandomNumber(serverSeed: string, userSeed: string): bigint {
    const seed = keccak(concatHexStrings(serverSeed as Hex, userSeed as Hex));
    return BigInt(seed);
}

export function profitFromTotalWon(totalWon: bigint, betValue: number): number {
    const houseEdge = (totalWon * BigInt(HOUSE_EDGE)) / BigInt(HOUSE_EDGE_DIVISOR);
    return Number(totalWon - houseEdge - BigInt(betValue));
}
