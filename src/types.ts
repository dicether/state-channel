export type Bet = {
    roundId: number;
    gameType: number;
    num: number;
    value: number; // in gwei
    balance: number; // in gwei
    serverHash: string;
    userHash: string;
    gameId: number;
};
