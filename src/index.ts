import BN from "bn.js";
import * as ethAbi from "ethereumjs-abi";
import * as ethUtil from "ethereumjs-util";

import {getGameImplementation} from "./games";
import {createTypedDataV2, hashBetV2, recoverBetSignerV2, signBetV2, TypedData} from "./signingV2";
import {Bet} from "./types";

export {Bet};
export * from "./games/Keno";
export * from "./games/Wheel";
export * from "./games/Plinko";
export * from "./constants";
export * from "./utilities";

export function createHashChain(seed: string, len = 1000): string[] {
    const result = [ethUtil.toBuffer(seed)];
    for (let i = 0; i < len; i++) {
        result.unshift(ethUtil.sha3(result[0]));
    }

    return result.map((val) => ethUtil.bufferToHex(val));
}

export function verifySeed(seed: string, seedHashRef: string): boolean {
    const seedBuf = ethUtil.toBuffer(seed);
    const seedHashRefBuf = ethUtil.toBuffer(seedHashRef) as Buffer;

    const seedHashBuf = ethUtil.sha3(seedBuf);
    return seedHashRefBuf.equals(seedHashBuf);
}

export function maxBet(gameType: number, num: number, bankRoll: number, k: number): number {
    const maxBetValue = getGameImplementation(gameType).maxBet(num, bankRoll);

    // round down to 0.001 Ether
    return new BN(maxBetValue).divn(k).divn(1e6).muln(1e6).toNumber();
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

export function createTypedData(bet: Bet, chainId: number, contractAddress: string, version = 2): TypedData {
    switch (version) {
        case 2:
            return createTypedDataV2(bet, "2", chainId, contractAddress);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function hashBet(bet: Bet, chainId: number, contractAddress: string, version = 2): Buffer {
    switch (version) {
        case 2:
            return hashBetV2(bet, "2", chainId, contractAddress);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function signBet(bet: Bet, chainId: number, contractAddress: string, privateKey: Buffer, version = 2): string {
    switch (version) {
        case 2:
            return signBetV2(bet, "2", chainId, contractAddress, privateKey);
        default:
            throw new Error("Invalid signature version!");
    }
}

export function recoverBetSigner(
    bet: Bet,
    chainId: number,
    contractAddress: string,
    signature: string,
    version = 2
): string {
    switch (version) {
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
): boolean {
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
