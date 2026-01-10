import {bytesToHex, ecrecover, fromRPCSig, hexToBytes, stripHexPrefix, toBytes, toRPCSig} from "@ethereumjs/util";
import BN from "bn.js";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import {keccak256} from "viem";
import {publicKeyToAddress} from "viem/accounts";

import {Address, Hex} from "./types";

export function getSetBits(num: number): boolean[] {
    const result: boolean[] = [];

    for (let i = 0; i < 52; i++) {
        if (new BN(1).shln(i).and(new BN(num)).toNumber()) {
            result.push(true);
        } else {
            result.push(false);
        }
    }

    return result;
}

export function getNumSetBits(num: number): number {
    return getSetBits(num).filter((x) => x).length;
}

export function fromWeiToGwei(value: string): number {
    return new BN(value).div(new BN(1e9)).toNumber();
}

export function fromGweiToWei(value: number): string {
    return new BN(value).mul(new BN(1e9)).toString();
}

export function keccak(data: string): Hex {
    return keccak256(data as Hex);
}

export function concatHexStrings(str1: Hex, str2: Hex): Hex {
    const str2Striped = stripHexPrefix(str2);

    return (str1 + str2Striped) as Hex;
}

export function ecSign(data: Hex, privateKey: Hex): Hex {
    const sig = secp256k1.sign(toBytes(data), toBytes(privateKey), {prehash: false});
    const signature = sig.toCompactRawBytes();

    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    const v = sig.recovery + 27;

    return toRPCSig(BigInt(v), r, s) as Hex;
}

export function recoverAddress(data: Hex, signature: Hex): Address {
    const dataBuf = hexToBytes(data);
    const {v, r, s} = fromRPCSig(signature);
    const publicKey = ecrecover(dataBuf, v, r, s);
    // ecrecover removes 0x04 prefix for uncompressed key, so add it here again.
    const publicKeyStr = `0x04${stripHexPrefix(bytesToHex(publicKey))}` as const;
    return publicKeyToAddress(publicKeyStr);
}
