import {recoverTypedDataOld, signTypedDataOld, typedDataHashOld} from "@dicether/eip712";

import {BigNumber} from "./bignumber";
import {Bet} from "./types";

const BASE_TO_WEI = 1e9;

export function createTypedDataV1(bet: Bet, contractAddress: string) {
    return [
        {
            type: "uint32",
            name: "Round Id",
            value: bet.roundId,
        },
        {
            type: "uint8",
            name: "Game Type",
            value: bet.gameType,
        },
        {
            type: "uint16",
            name: "Number",
            value: bet.num,
        },
        {
            type: "uint",
            name: "Value (Wei)",
            value: new BigNumber(bet.value).times(BASE_TO_WEI).toString(),
        },
        {
            type: "int",
            name: "Current Balance (Wei)",
            value: new BigNumber(bet.balance).times(BASE_TO_WEI).toString(),
        },
        {
            type: "bytes32",
            name: "Server Hash",
            value: bet.serverHash,
        },
        {
            type: "bytes32",
            name: "Player Hash",
            value: bet.userHash,
        },
        {
            type: "uint",
            name: "Game Id",
            value: bet.gameId,
        },
        {
            type: "address",
            name: "Contract Address",
            value: contractAddress,
        },
    ];
}

export function signBetV1(bet: Bet, contractAddress: string, privateKey: Buffer) {
    const typedData = createTypedDataV1(bet, contractAddress);
    return signTypedDataOld(typedData, privateKey);
}

export function hashBetV1(bet: Bet, contractAddress: string) {
    const typedData = createTypedDataV1(bet, contractAddress);
    return typedDataHashOld(typedData);
}

export function recoverBetSignerV1(bet: Bet, contractAddress: string, signature: string): string {
    const typedData = createTypedDataV1(bet, contractAddress);
    return recoverTypedDataOld(typedData, signature);
}
