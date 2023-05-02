import { playerModel } from "@apis/player";
import { EEndType, EWind, ICreateOneRecordDto, recordModel } from "@apis/record";
import { IRound, roundModel } from "@apis/round";
import { redisClient } from "../../services/redis";
import { ICurrentRound, IAddRecord } from "./interface";
import { ERoundStatus } from "@apis/round/round.enum";

const CURRENTROUND = 'currentRound';

export const getCurrentRound = async (): Promise<ICurrentRound> => {
    return JSON.parse(await redisClient.get(CURRENTROUND));
};

export const setCurrentRound = async (currentRound: ICurrentRound) => {
    redisClient.set(CURRENTROUND, JSON.stringify(currentRound));
};

export const initCurrentRound = async () => {
    await resetCurrentRound();
    const lastRound = await roundModel.readLastWithPlayers();
    if (lastRound) {
        if (!await checkRound(lastRound)) {
            const currentRound = generateCurrentRound(lastRound);
            await setCurrentRound(currentRound);
        };
    };
};

export const addRecord = async (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    currentRound.records = [...currentRound.records, addRecordDto];
    await calculateScore(currentRound, addRecordDto);
    return currentRound;
};

export const removeLastRecord = async (currentRound: ICurrentRound) => {
    const removed = currentRound.records.pop();
    await recoverScore(currentRound, removed);
    return currentRound;
};

export const updateCurrentRound = async (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    const { dealer, circle } = currentRound;

    if (isDealerContinue(currentRound, addRecordDto)) {
        currentRound.dealerCount++;
    } else {
        currentRound.dealerCount = 0;
        if (dealer === EWind.NORTH) {
            if (circle === EWind.NORTH) {
                const endedCurrentRound: ICurrentRound = {
                    ...currentRound,
                    status: ERoundStatus.END
                };
                return endedCurrentRound;
            } else {
                const nextCircle = updateWind(circle);
                currentRound.circle = nextCircle;
            };
        };
        const nextDealer = updateWind(dealer);
        currentRound.dealer = nextDealer;
    };
    return currentRound;
};

export const recoverCurrentRound = async (currentRound: ICurrentRound, removed: IAddRecord) => {
    const { status } = currentRound;
    if (status === ERoundStatus.END) {
        currentRound.status = ERoundStatus.IN_PROGRESS;
    };
    currentRound.circle = removed.circle;
    currentRound.dealer = removed.dealer;
    currentRound.dealerCount = removed.dealerCount;
    return currentRound;
};

export const saveRecords = async (currentRound: ICurrentRound) => {
    const { records, round } = currentRound;
    const { east, south, west, north } = round;
    const players = {
        east: east,
        south: south,
        west: west,
        north: north
    };
    const insertPromise = records.map(async record => {
        const { winner, losers, point, endType, createdAt } = record;
        const winnerPlayer = Object.values(players).find(player => player.name === winner);
        const loserPlayers = Object.values(players).filter(player => losers.includes(player.name));
        const dto: ICreateOneRecordDto = {
            round: round,
            winner: winnerPlayer,
            losers: loserPlayers,
            endType: endType,
            point: point,
            createdAt: createdAt
        };
        await recordModel.createOne(dto);
    });
    await Promise.all(insertPromise);
};

export const resetCurrentRound = async () => {
    const emptyPlayer = {
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0
    };
    const currentRound: ICurrentRound = {
        status: ERoundStatus.EMPTY,
        round: null,
        records: [],
        circle: EWind.EAST,
        dealer: EWind.EAST,
        dealerCount: 0,
        venue: [],
        players: {}
    };
    redisClient.set(CURRENTROUND, JSON.stringify(currentRound));
};

export const generateCurrentRound = (round: IRound) => {
    const { east, south, west, north } = round;
    const emptyPlayer = {
        win: 0,
        lose: 0,
        selfDrawn: 0,
        beSelfDrawn: 0,
        draw: 0,
        fake: 0,
        amount: 0
    };
    const currentRound: ICurrentRound = {
        status: ERoundStatus.IN_PROGRESS,
        round: round,
        records: [],
        circle: EWind.EAST,
        dealer: EWind.EAST,
        dealerCount: 0,
        venue: [],
        players: {
            east: { ...east, ...emptyPlayer },
            south: { ...south, ...emptyPlayer },
            west: { ...west, ...emptyPlayer },
            north: { ...north, ...emptyPlayer }
        }
    };
    return currentRound;
};

const checkRound = async (round: IRound) => {
    return round.records.length > 1;
};

const calculateScore = async (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    const { round, dealer, dealerCount, players } = currentRound;
    const { winner, losers, endType, point } = addRecordDto;
    switch (endType) {
        case EEndType.WINNING: {
            const winnerWind = getPlayerWind(currentRound, winner);
            const loserWind = getPlayerWind(currentRound, losers[0]);
            players[winnerWind].win++;
            players[loserWind].lose++;
            players[winnerWind].amount += (round.base + round.point * point);
            players[loserWind].amount -= (round.base + round.point * point);
            break;
        };
        case EEndType.SELF_DRAWN: {
            const winnerWind = getPlayerWind(currentRound, winner);
            currentRound.players[winnerWind].selfDrawn++;
            if (isDealer(winnerWind, dealer)) {
                const loserWindPromise = losers.map(async loser => {
                    const loserWind = getPlayerWind(currentRound, loser);
                    players[winnerWind].amount += (round.base + round.point * point);
                    players[loserWind].amount -= (round.base + round.point * point);
                    players[loserWind].beSelfDrawn++;
                });
                await Promise.all(loserWindPromise);
            } else {
                const loserWindPromise = losers.map(async loser => {
                    const loserWind = getPlayerWind(currentRound, loser);
                    const dealerPoints = isDealer(loserWind, dealer) ? dealerCount * 2 + 1 : 0;
                    const totalPoints = point + dealerPoints;
                    players[winnerWind].amount += (round.base + round.point * totalPoints);
                    players[loserWind].amount -= (round.base + round.point * totalPoints);
                    players[loserWind].beSelfDrawn++;
                });
                await Promise.all(loserWindPromise);
            };
            await calculateVenue(currentRound, addRecordDto);
            break;
        };
        case EEndType.DRAW: {
            const keyPromise = Object.keys(players).map(async key => {
                players[key].draw++;
            });
            await Promise.all(keyPromise);
            break;
        };
        case EEndType.FAKE: {

            break;
        };
    };
    return currentRound;
};

const recoverScore = async (currentRound: ICurrentRound, removed: IAddRecord) => {
    const { round, dealer, dealerCount, players } = currentRound;
    const { winner, losers, endType, point } = removed;
    switch (endType) {
        case EEndType.WINNING: {
            const winnerWind = getPlayerWind(currentRound, winner);
            const loserWind = getPlayerWind(currentRound, losers[0]);
            players[winnerWind].win--;
            players[loserWind].lose--;
            players[winnerWind].amount -= (round.base + round.point * point);
            players[loserWind].amount += (round.base + round.point * point);
            break;
        };
        case EEndType.SELF_DRAWN: {
            const winnerWind = getPlayerWind(currentRound, winner);
            currentRound.players[winnerWind].selfDrawn--;
            if (isDealer(winnerWind, dealer)) {
                const loserWindPromise = losers.map(async loser => {
                    const loserWind = getPlayerWind(currentRound, loser);
                    players[winnerWind].amount -= (round.base + round.point * point);
                    players[loserWind].amount += (round.base + round.point * point);
                    players[loserWind].beSelfDrawn--;
                });
                await Promise.all(loserWindPromise);
            } else {
                const loserWindPromise = losers.map(async loser => {
                    const loserWind = getPlayerWind(currentRound, loser);
                    const dealerPoints = isDealer(loserWind, dealer) ? dealerCount * 2 + 1 : 0;
                    const totalPoints = point + dealerPoints;
                    players[winnerWind].amount -= (round.base + round.point * totalPoints);
                    players[loserWind].amount += (round.base + round.point * totalPoints);
                    players[loserWind].beSelfDrawn--;
                });
                await Promise.all(loserWindPromise);
            };
            await recoverVenue(currentRound, removed);
            break;
        };
        case EEndType.DRAW: {
            const keyPromise = Object.keys(players).map(async key => {
                players[key].draw--;
            });
            await Promise.all(keyPromise);
            break;
        };
        case EEndType.FAKE: {

            break;
        };
    };
    return currentRound;
};

const calculateVenue = async (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    const { venue, players } = currentRound;
    const { winner } = addRecordDto;
    const winnerWind = getPlayerWind(currentRound, winner);
    if (winnerWind) {
        if (venue.length < 4) {
            venue.push(addRecordDto);
            players[winnerWind].amount -= 50;
        };
    };
};

const recoverVenue = (currentRound: ICurrentRound, removed: IAddRecord) => {
    const { venue, players } = currentRound;
    const { winner } = removed;
    const winnerWind = getPlayerWind(currentRound, winner);
    if (venue[-1] == removed) {
        venue.pop();
        players[winnerWind].amount += 50;
    };
};

const isDealer = (wind: string, dealer: string) => {
    return wind === dealer;
};

const isDealerContinue = (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    return (isDealerWin(currentRound, addRecordDto.winner) || isDraw(addRecordDto.endType) || isFake(addRecordDto.endType));
};

const isDealerWin = (currentRound: ICurrentRound, winnerName: string) => {
    return winnerName ? currentRound.dealer === getPlayerWind(currentRound, winnerName) : false;
};

const isDraw = (endType: EEndType) => {
    return endType === EEndType.DRAW;
};

const isFake = (endType: EEndType) => {
    return endType === EEndType.FAKE;
};

const getPlayerWind = (currentRound: ICurrentRound, name: string) => {
    return name ? Object.entries(currentRound.players).find(([key, value]) => value.name === name)[0] : null;
};

const updateWind = (currentWind: EWind) => {
    switch (currentWind) {
        case EWind.EAST:
            return EWind.SOUTH;
        case EWind.SOUTH:
            return EWind.WEST;
        case EWind.WEST:
            return EWind.NORTH;
        case EWind.NORTH:
            return EWind.EAST;
    };
};