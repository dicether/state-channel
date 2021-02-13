import {hashTypedData, recoverTypedData, signTypedData} from "@dicether/eip712";

import {Bet} from "./types";
import {fromGweiToWei} from "./utilities";

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
};

function createDomain(version: string, chainId: number, contractAddress: string) {
    return {
        name: "Dicether",
        version,
        chainId,
        verifyingContract: contractAddress,
    };
}

function convertBet(bet: Bet) {
    return {
        ...bet,
        userHash: bet.userHash,
        value: fromGweiToWei(bet.value).toString(),
        balance: fromGweiToWei(bet.balance).toString(),
        number: bet.num,
    };
}

export function createTypedDataV2(bet: Bet, version: string, chainId: number, contractAddress: string) {
    const domain = createDomain(version, chainId, contractAddress);
    return {
        types,
        primaryType: "Bet",
        domain,
        message: convertBet(bet),
    };
}

export function signBetV2(bet: Bet, version: string, chainId: number, contractAddress: string, privateKey: Buffer) {
    const data = createTypedDataV2(bet, version, chainId, contractAddress);
    return signTypedData(data, privateKey);
}

export function hashBetV2(bet: Bet, version: string, chainId: number, contractAddress: string) {
    const data = createTypedDataV2(bet, version, chainId, contractAddress);
    return hashTypedData(data);
}

export function recoverBetSignerV2(
    bet: Bet,
    version: string,
    chainId: number,
    contractAddress: string,
    signature: string
) {
    const data = createTypedDataV2(bet, version, chainId, contractAddress);
    return recoverTypedData(data, signature);
}
