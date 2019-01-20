import {hashTypedDataLegacy, recoverTypedDataLegacy, signTypedDataLegacy} from "@dicether/eip712";

import {fromGweiToWei} from "./index";
import {Bet} from "./types";

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
            value: fromGweiToWei(bet.value),
        },
        {
            type: "int",
            name: "Current Balance (Wei)",
            value: fromGweiToWei(bet.balance),
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
    return signTypedDataLegacy(typedData, privateKey);
}

export function hashBetV1(bet: Bet, contractAddress: string) {
    const typedData = createTypedDataV1(bet, contractAddress);
    return hashTypedDataLegacy(typedData);
}

export function recoverBetSignerV1(bet: Bet, contractAddress: string, signature: string): string {
    const typedData = createTypedDataV1(bet, contractAddress);
    return recoverTypedDataLegacy(typedData, signature);
}
