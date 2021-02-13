import BN from "bn.js";
import * as ethUtil from "ethereumjs-util";

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

export function keccak(data: string): string {
    ethUtil.toBuffer(data);
    return ethUtil.bufferToHex(ethUtil.sha3(data));
}
