import {expect} from "chai";
import {toBuffer} from "ethereumjs-util";
import {hashBet, recoverBetSigner, signBet} from "../src";

describe("hashBet", () => {
    it("test 1", () => {
        const bet = {
            roundId: 1,
            gameType: 1,
            num: 10,
            value: 10000000, // in gwei
            balance: 0, // in gwei
            serverHash: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
            userHash: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
            gameId: 40,
        };

        const hash = hashBet(bet, 123456789, "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB", 2);
        expect(hash).to.deep.equal(toBuffer("0x9bb213c565dd498f7f88b46c352aab54484e399856bb33dc00ec83dfa4d8748b"));
    });

    it("test 2", () => {
        const bet = {
            roundId: 1,
            gameType: 1,
            num: 10,
            value: 10000000, // in gwei
            balance: -1, // in gwei
            serverHash: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
            userHash: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
            gameId: 40,
        };

        const hash = hashBet(bet, 123456789, "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB", 2);
        expect(hash).to.deep.equal(toBuffer("0xa68fa492829b6c4ff3b831b9c1500632ce2316b5c852812603a1b4a2edd50cd6"));
    });
});

describe("signBet", () => {
    it("sign and recover", () => {
        const bet = {
            roundId: 1,
            gameType: 1,
            num: 10,
            value: 10000000, // in gwei
            balance: 0, // in gwei
            serverHash: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
            userHash: "0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2",
            gameId: 40,
        };

        const address = "0x29C76e6aD8f28BB1004902578Fb108c507Be341b";
        const privKeyHex = "0x4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043e5e2cc3418bb0";
        const privKey = toBuffer(privKeyHex) as Buffer;
        const refSig =
            "0xae9fe52346181191d857a137d60cd075f654d2e1b4b88b7df55f28c308809de0314" +
            "edc28683175daefd1a633fca66a67e4349e7fa57c6f3b721f3cee3d0c3a111c";

        const sig = signBet(bet, 123456789, "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB", privKey, 2);
        const addressRec = recoverBetSigner(bet, 123456789, "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB", sig);

        expect(sig).to.equal(refSig);
        expect(addressRec).to.equal(address);
    });
});
