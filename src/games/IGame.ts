export interface IGame {
    maxBet(num: number, bankroll: number): number;
    resultNumber(serverSeed: string, userSeed: string, num: number): number;
    userProfit(num: number, betValue: number, resultNum: number): number;
    maxUserProfit(num: number, betValue: number): number;
}
