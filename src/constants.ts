export const RANGE = 100;
export const HOUSE_EDGE = 150;
export const HOUSE_EDGE_DIVISOR = 10000;
export const PROBABILITY_DIVISOR = 10000;
export const CHOOSE_FROM_12_NUMS = 12;

export enum GameStatus {
    ENDED = 0,
    ACTIVE = 1,
    USER_INITIATED_END = 2,
    SERVER_INITIATED_END = 3,
}

export enum ReasonEnded {
    REGULAR_ENDED = 0,
    SERVER_FORCED_END = 1,
    USER_FORCED_END = 2,
    CONFLICT_ENDED = 3,
}

export enum GameType {
    NO_GAME = 0,
    DICE_LOWER = 1,
    DICE_HIGHER = 2,
    CHOOSE_FROM_12 = 3,
    FLIP_A_COIN = 4,
    KENO = 5,
    WHEEL = 6,
    PLINKO = 7,
}
