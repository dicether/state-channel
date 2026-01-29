import {expect} from "chai";

import {
    concatHexStrings,
    ecSign,
    fromGweiToWei,
    fromWeiToGwei,
    getNumSetBits,
    getSetBits,
    keccak,
    recoverAddress,
} from "../src";

describe("getSetBits", () => {
    it("setBits", () => {
        const num = 13; // binary 1101
        const setBits = getSetBits(num);
        expect(setBits.slice(0, 4)).to.deep.equal([true, false, true, true]);
    });

    it("no bits", () => {
        const num = 0; // binary 0000
        const setBits = getSetBits(num);
        expect(setBits.slice(0, 4)).to.deep.equal([false, false, false, false]);
    });

    it("all bits", () => {
        const num = 15; // binary 1111
        const setBits = getSetBits(num);
        expect(setBits.slice(0, 4)).to.deep.equal([true, true, true, true]);
    });
});

describe("getNumSetBits", () => {
    it("setBits", () => {
        const num = 13; // binary 1101
        const count = getNumSetBits(num);
        expect(count).to.equal(3);
    });

    it("no bits", () => {
        const num = 0; // binary 0000
        const count = getNumSetBits(num);
        expect(count).to.equal(0);
    });

    it("all bits", () => {
        const num = 15; // binary 1111
        const count = getNumSetBits(num);
        expect(count).to.equal(4);
    });
});

describe("fromWeiToGwei", () => {
    it("conversion", () => {
        const wei = "1000000000";
        const gwei = fromWeiToGwei(wei);
        expect(gwei).to.equal(1);
    });
});

describe("fromGweiToWei", () => {
    it("conversion", () => {
        const gwei = 1;
        const wei = fromGweiToWei(gwei);
        expect(wei).to.equal("1000000000");
    });
});

describe("Wei-Gwei conversion consistency", () => {
    it("should convert Wei to Gwei and back consistently", () => {
        const originalWei = "1234567890000000000";
        const gwei = fromWeiToGwei(originalWei);
        const wei = fromGweiToWei(gwei);
        expect(wei).to.equal(originalWei);
    });
});

describe("Gwei-Wei conversion consistency", () => {
    it("should convert Gwei to Wei and back consistently", () => {
        const originalGwei = 1234567890;
        const wei = fromGweiToWei(originalGwei);
        const gwei = fromWeiToGwei(wei);
        expect(gwei).to.equal(originalGwei);
    });
});

describe("keccak", () => {
    it("check hash", () => {
        const data = "0x1234567890abcdef";
        const hash1 = keccak(data);
        expect(hash1).to.equal("0xed8ab4fde4c4e2749641d9d89de3d920f9845e086abd71e6921319f41f0e784f");
    });
});

describe("concatHexStrings", () => {
    it("concatenation", () => {
        const str1 = "0x1234";
        const str2 = "0x5678";
        const result = concatHexStrings(str1, str2);
        expect(result).to.equal("0x12345678");
    });
});

describe("ecSign and recoverAddress", () => {
    it("sign and recover", () => {
        const data = "0x1234567890abcdef";
        const privateKey = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";

        const signature = ecSign(data, privateKey);
        const address = recoverAddress(data, signature);

        expect(address).to.equal("0x5d46aC553A974ef992A08eeef0A05990802F01F6");
    });
});
