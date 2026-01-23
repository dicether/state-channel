import {expect} from "chai";

import {calcMaxUserProfit, calcNewBalance, calcResultNumber, calcUserProfit, maxBet} from "../src";

export const BANK_ROLL = 9e9;
export const KELLY_FACTOR = 1;

export const InvalidGameTypes = [
    {
        gameType: 1,
        num: 0,
    },
    {
        gameType: 1,
        num: 99,
    },
    {
        gameType: 2,
        num: 0,
    },
    {
        gameType: 2,
        num: 99,
    },
    {
        gameType: 3,
        num: 0,
    },
    {
        gameType: 3,
        num: Math.pow(2, 12) - 1,
    },
    {
        gameType: 4,
        num: 2,
    },
    {
        gameType: 5,
        num: 0,
    },
    {
        gameType: 5,
        num: 1098437885953,
    },
    {
        gameType: 6,
        num: 410,
    },
    {
        gameType: 6,
        num: 130,
    },
    {
        gameType: 7,
        num: 408,
    },
    {
        gameType: 7,
        num: 117,
    },
];

export const ValidGameTypes = [
    {
        gameType: 1,
        num: 1,
        maxBet: 1000000,
    },
    {
        gameType: 2,
        num: 1,
        maxBet: 26470000000,
    },
    {
        gameType: 1,
        num: 98,
        maxBet: 26470000000,
    },
    {
        gameType: 2,
        num: 98,
        maxBet: 1000000,
    },
    {
        gameType: 3,
        num: 1,
        maxBet: 12000000,
    },
    {
        gameType: 3,
        num: Math.pow(2, 12) - 2,
    },
    {
        gameType: 4,
        num: 0,
    },
    {
        gameType: 4,
        num: 1,
    },
    {
        gameType: 5,
        num: 1,
    },
    {
        gameType: 5,
        num: 1098437885952,
    },
    {
        gameType: 6,
        num: 110,
    },
    {
        gameType: 6,
        num: 320,
    },
    {
        gameType: 7,
        num: 108,
    },
    {
        gameType: 7,
        num: 316,
    },
];

const maxBetDictionary: Record<number, Record<number, number>> = {
    1: {1: 1000000, 98: 26470000000},
    2: {1: 26470000000, 98: 1000000},
    3: {1: 12000000, 4094: 1809000000},
    4: {0: 139000000, 1: 139000000},
    5: {1: 45000000, 1098437885952: 9000000},
    6: {110: 568000000, 320: 7000000},
    7: {108: 237000000, 316: 61000000},
};

describe("maxBet", () => {
    ValidGameTypes.forEach(({gameType, num}) => {
        it(`Check max bet for gameType ${gameType} with num ${num}`, () => {
            const maxBetValue = maxBet(gameType, num, BANK_ROLL, KELLY_FACTOR);
            const maxBetExpected = maxBetDictionary[gameType][num];
            expect(maxBetValue).to.equal(maxBetExpected);
        });
    });
});

describe("maxBet invalid num", () => {
    InvalidGameTypes.forEach(({gameType, num}) => {
        it(`Check max bet to fail for gameType ${gameType} with num ${num}`, () => {
            expect(() => maxBet(gameType, num, BANK_ROLL, KELLY_FACTOR)).to.throw();
        });
    });
});

const serverSeed = "0x0000000000000000000000000000000000000000000000000000000000000001";
const userSeed = "0x0000000000000000000000000000000000000000000000000000000000000002";

const expectedResultNumbers: Record<number, Record<number, number>> = {
    1: {1: 36, 98: 36},
    2: {1: 36, 98: 36},
    3: {1: 4, 4094: 4},
    4: {0: 0, 1: 0},
    5: {1: 102840992, 1098437885952: 102840992},
    6: {110: 136, 320: 136},
    7: {108: 224, 316: 49888},
};

describe("calcResultNumber", () => {
    ValidGameTypes.forEach(({gameType, num}) => {
        it(`Check calcResultNumber for gameType ${gameType} with num ${num}`, () => {
            const resultNumber = calcResultNumber(gameType, serverSeed, userSeed, num);
            const expectedResultNumber = expectedResultNumbers[gameType][num];
            expect(resultNumber).to.equal(expectedResultNumber);
        });
    });
});

const expectedUserProfits: Record<number, Record<number, number>> = {
    1: {1: -1000000, 98: 5102},
    2: {1: 5102, 98: -1000000},
    3: {1: -1000000, 4094: 74546},
    4: {0: 970000, 1: -1000000},
    5: {1: -1000000, 1098437885952: -1000000},
    6: {110: 200000, 320: -1000000},
    7: {108: -100000, 316: 100000},
};

describe("calcUserProfit", () => {
    const betValue = 1e6; // 0.001 Ether
    ValidGameTypes.forEach(({gameType, num}) => {
        it(`Check calcUserProfit for gameType ${gameType} with num ${num}`, () => {
            const resultNum = calcResultNumber(gameType, serverSeed, userSeed, num);
            const userProfit = calcUserProfit(gameType, num, betValue, resultNum);
            const expectedUserProfit = expectedUserProfits[gameType][num];
            expect(userProfit).to.equal(expectedUserProfit);
        });
    });
});

const expectedMaxUserProfits: Record<number, Record<number, number>> = {
    1: {1: 97500000, 98: 5102},
    2: {1: 5102, 98: 97500000},
    3: {1: 10820000, 4094: 74546},
    4: {0: 970000, 1: 970000},
    5: {1: 2940000, 1098437885952: 199000000},
    6: {110: 450000, 320: 18700000},
    7: {108: 6300000, 316: 79000000},
};

describe("calcMaxUserProfit", () => {
    const betValue = 1e6; // 0.001 Ether
    ValidGameTypes.forEach(({gameType, num}) => {
        it(`Check max user profit for gameType ${gameType} with num ${num}`, () => {
            const maxUserProfit = calcMaxUserProfit(gameType, num, betValue);
            // console.log(`GameType ${gameType} Num: ${num}: Resultnumber: ${maxUserProfit}`);
            const expectedMaxUserProfit = expectedMaxUserProfits[gameType][num];
            expect(maxUserProfit).to.equal(expectedMaxUserProfit);
        });
    });
});

describe("calcMaxUserProfit invalid num", () => {
    const betValue = 1e6; // 0.001 Ether
    InvalidGameTypes.forEach(({gameType, num}) => {
        it(`Check max user profit to fail for gameType ${gameType} with num ${num}`, () => {
            expect(() => calcMaxUserProfit(gameType, num, betValue)).to.throw();
        });
    });
});

const expectedBalances: Record<number, Record<number, number>> = {
    1: {1: 9000000, 98: 10005102},
    2: {1: 10005102, 98: 9000000},
    3: {1: 9000000, 4094: 10074546},
    4: {0: 10970000, 1: 9000000},
    5: {1: 9000000, 1098437885952: 9000000},
    6: {110: 10200000, 320: 9000000},
    7: {108: 9900000, 316: 10100000},
};

describe("calcNewBalance", () => {
    const betValue = 1e6; // 0.001 Ether
    const oldBalance = 1e7; // 0.01 Ether
    ValidGameTypes.forEach(({gameType, num}) => {
        it(`Check new balance for gameType ${gameType} with num ${num}`, () => {
            const newBalance = calcNewBalance(gameType, num, betValue, serverSeed, userSeed, oldBalance);
            const expectedBalance = expectedBalances[gameType][num];
            expect(newBalance).to.equal(expectedBalance);
        });
    });
});

describe("calcNewBalance invalid num", () => {
    const betValue = 1e6; // 0.001 Ether
    const oldBalance = 1e7; // 0.01 Ether
    InvalidGameTypes.forEach(({gameType, num}) => {
        it(`Check calcNewBalance to fail for gameType ${gameType} with num ${num}`, () => {
            expect(() => calcNewBalance(gameType, num, betValue, serverSeed, userSeed, oldBalance)).to.throw();
        });
    });
});
