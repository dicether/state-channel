import BN from "bn.js";
import * as ethAbi from "ethereumjs-abi";
import * as ethUtil from "ethereumjs-util";

import {getGameImplementation} from "./games";
import {createTypedDataV1, hashBetV1, recoverBetSignerV1, signBetV1} from "./signingV1";
import {createTypedDataV2, hashBetV2, recoverBetSignerV2, signBetV2} from "./signingV2";
import {Bet} from "./types";

export {Bet};
export * from "./games/Keno";
export * from "./games/Wheel";

export const RANGE = 100;
export const HOUSE_EDGE = 150;
export const HOUSE_EDGE_DIVISOR = 10000;
export const PROBABILITY_DIVISOR = 10000;
export const CHOOSE_FROM_12_NUMS = 12;

export enum GameStatus {
    ENDED = 0,
    ACTIVE = 1,
    USER_INITIATED_END = 2,
    SERVER_INITIATED_END = 3,
}

export enum ReasonEnded {
    REGULAR_ENDED = 0,
    SERVER_FORCED_END = 1,
    USER_FORCED_END = 2,
    CONFLICT_ENDED = 3,
}

export enum GameType {
    NO_GAME = 0,
    DICE_LOWER = 1,
    DICE_HIGHER = 2,
    CHOOSE_FROM_12 = 3,
    FLIP_A_COIN = 4,
    KENO = 5,
    WHEEL = 6,
}

export function getSetBits(num: number) {
    const result: boolean[] = [];

    for (let i = 0; i < 52; i++) {
        if (
            new BN(1)
                .shln(i)
                .and(new BN(num))
                .toNumber()
        ) {
            result.push(true);
        } else {
            result.push(false);
        }
    }

    return result;
}

export function getNumSetBits(num: number) {
    return getSetBits(num).filter(x => x === true).length;
}

export function fromWeiToGwei(value: string) {
    return new BN(value).div(new BN(1e9)).toNumber();
}

export function fromGweiToWei(value: number) {
    return new BN(value).mul(new BN(1e9)).toString();
}

export function createHashChain(seed: string, len = 1000): string[] {
    const result = [ethUtil.toBuffer(seed)];
    for (let i = 0; i < len; i++) {
        result.unshift(ethUtil.sha3(result[0]));
    }

    return result.map(val => ethUtil.bufferToHex(val));
}

export function keccak(data: string): string {
    ethUtil.toBuffer(data);
    return ethUtil.bufferToHex(ethUtil.sha3(data));
}

export function verifySeed(seed: string, seedHashRef: string): boolean {
    const seedBuf = ethUtil.toBuffer(seed);
    const seedHashRefBuf = ethUtil.toBuffer(seedHashRef) as Buffer;

    const seedHashBuf = ethUtil.sha3(seedBuf);
    return seedHashRefBuf.equals(seedHashBuf);
}

export function maxBet(gameType: number, num: number, bankRoll: number, k = 2) {
    const maxBetValue = getGameImplementation(gameType).maxBet(num, bankRoll);

    // round to 0.001 Ether
    return new BN(maxBetValue)
        .divn(k)
        .addn(5e5)
        .divn(1e6)
        .muln(1e6)
        .toNumber();
}

export function calcResultNumber(gameType: number, serverSeed: string, userSeed: string, num: number): number {
    return getGameImplementation(gameType).resultNumber(serverSeed, userSeed, num);
}

export function calcUserProfit(gameType: number, num: number, betValue: number, resultNum: number): number {
    return getGameImplementation(gameType).userProfit(num, betValue, resultNum);
}

export function calcMaxUserProfit(gameType: number, num: number, betValue: number): number {
    return getGameImplementation(gameType).maxUserProfit(num, betValue);
}

export function calcNewBalance(
    gameType: number,
    num: number,
    betValue: number,
    serverSeed: string,
    userSeed: string,
    oldBalance: number
): number {
    const resultNum = calcResultNumber(gameType, serverSeed, userSeed, num);
    const profit = calcUserProfit(gameType, num, betValue, resultNum);

    return profit + oldBalance;
}

export function createTypedData(bet: Bet, chainId: number, contractAddress: string, version = 2) {
    switch (version) {
        case 1:
            return createTypedDataV1(bet, contractAddress);
        case 2:
            return createTypedDataV2(bet, "2", chainId, contractAddress);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function hashBet(bet: Bet, chainId: number, contractAddress: string, version = 2) {
    switch (version) {
        case 1:
            return hashBetV1(bet, contractAddress);
        case 2:
            return hashBetV2(bet, "2", chainId, contractAddress);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function signBet(bet: Bet, chainId: number, contractAddress: string, privateKey: Buffer, version = 2) {
    switch (version) {
        case 1:
            return signBetV1(bet, contractAddress, privateKey);
        case 2:
            return signBetV2(bet, "2", chainId, contractAddress, privateKey);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function recoverBetSigner(bet: Bet, chainId: number, contractAddress: string, signature: string, version = 2) {
    switch (version) {
        case 1:
            return recoverBetSignerV1(bet, contractAddress, signature);
        case 2:
            return recoverBetSignerV2(bet, "2", chainId, contractAddress, signature);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function verifySignature(
    bet: Bet,
    chainId: number,
    contractAddress: string,
    signature: string,
    address: string,
    version = 2
) {
    return recoverBetSigner(bet, chainId, contractAddress, signature, version) === address;
}

export function signStartData(
    contractAddress: string,
    user: string,
    lastGameId: number,
    createBefore: number,
    serverEndHash: string,
    serverAccount: string,
    privateKey: Buffer
): string {
    const hash = ethAbi.soliditySHA3(
        ["address", "address", "uint256", "uint256", "bytes32"],
        [contractAddress, user, lastGameId, createBefore, ethUtil.toBuffer(serverEndHash)]
    );

    const sig = ethUtil.ecsign(hash, privateKey);
    return ethUtil.toRpcSig(sig.v, sig.r, sig.s);
}
