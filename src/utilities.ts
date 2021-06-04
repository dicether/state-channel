import BN from "bn.js";
import * as ethUtil from "ethereumjs-util";

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

export function keccak(data: string): string {
    return ethUtil.bufferToHex(ethUtil.keccakFromHexString(data));
}
