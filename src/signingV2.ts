import {hashTypedData} from "viem";

import {Address, Bet, Hex} from "./types";
import {ecSign, fromGweiToWei, recoverAddress} from "./utilities";

const types = {
    EIP712Domain: [
        {name: "name", type: "string"},
        {name: "version", type: "string"},
        {name: "chainId", type: "uint256"},
        {name: "verifyingContract", type: "address"},
    ],
    Bet: [
        {name: "roundId", type: "uint32"},
        {name: "gameType", type: "uint8"},
        {name: "number", type: "uint256"},
        {name: "value", type: "uint256"},
        {name: "balance", type: "int256"},
        {name: "serverHash", type: "bytes32"},
        {name: "userHash", type: "bytes32"},
        {name: "gameId", type: "uint256"},
    ],
} as const;

type Types = typeof types;

interface Domain {
    name: string;
    version: string;
    chainId: bigint;
    verifyingContract: Address;
}

function createDomain(version: string, chainId: number, contractAddress: string): Domain {
    return {
        name: "Dicether",
        version,
        chainId: BigInt(chainId),
        verifyingContract: contractAddress as Address,
    };
}

interface ConvertedBet {
    roundId: number;
    gameType: number;
    number: bigint;
    value: bigint; // in wei
    balance: bigint; // in wei
    serverHash: Hex;
    userHash: Hex;
    gameId: bigint;
}

function convertBet(bet: Bet): ConvertedBet {
    return {
        ...bet,
        gameId: BigInt(bet.gameId),
        value: BigInt(fromGweiToWei(bet.value).toString()),
        balance: BigInt(fromGweiToWei(bet.balance).toString()),
        number: BigInt(bet.num),
    } as ConvertedBet;
}

export interface TypedData {
    types: Types;
    primaryType: "Bet";
    domain: Domain;
    message: ConvertedBet;
}

export function createTypedDataV2(bet: Bet, version: string, chainId: number, contractAddress: string): TypedData {
    const domain = createDomain(version, chainId, contractAddress);
    return {
        types,
        primaryType: "Bet",
        domain,
        message: convertBet(bet),
    };
}

export function signBetV2(
    bet: Bet,
    version: string,
    chainId: number,
    contractAddress: string,
    privateKey: string,
): string {
    const hash = hashBetV2(bet, version, chainId, contractAddress);
    return ecSign(hash, privateKey as Hex);
}

export function hashBetV2(bet: Bet, version: string, chainId: number, contractAddress: string): Hex {
    const data = createTypedDataV2(bet, version, chainId, contractAddress);
    const hash = hashTypedData(data);
    return hash;
}

export function recoverBetSignerV2(
    bet: Bet,
    version: string,
    chainId: number,
    contractAddress: string,
    signature: string,
): string {
    const hash = hashBetV2(bet, version, chainId, contractAddress);
    return recoverAddress(hash, signature as Hex);
}
