import { playerModel } from "@apis/player";
import { EEndType, EWind, ICreateOneRecordDto, recordModel } from "@apis/record";
import { IRound, roundModel } from "@apis/round";
import { redisClient } from "../../services/redis";
import { ICurrentRound, IAddRecord } from "./interface";

const CURRENTROUND = 'currentRound';

export const getCurrentRound = async (): Promise<ICurrentRound> => {
    return JSON.parse(await redisClient.get(CURRENTROUND));
};

export const initCurrentRound = async () => {
    const lastRound = await roundModel.readLastWithPlayers();
    await resetCurrentRound();
    if (lastRound) {
        const currentRound: ICurrentRound = {
            round: lastRound,
            players: {
                east: {
                    id: lastRound.east.id,
                    name: lastRound.east.name,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
                south: {
                    id: lastRound.south.id,
                    name: lastRound.south.name,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
                west: {
                    id: lastRound.west.id,
                    name: lastRound.west.name,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
                north: {
                    id: lastRound.north.id,
                    name: lastRound.north.name,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
            },
            records: [],
            circle: EWind.EAST,
            dealer: EWind.EAST,
            dealerCount: 0,
            venue: []
        };
        await setCurrentRound(currentRound);
        console.log(await getCurrentRound());
    };
};

export const addRecord = async (addRecordDto: IAddRecord) => {
    const currentRound = await getCurrentRound();
    currentRound.records = [...currentRound.records, addRecordDto];
    const { round, dealer, dealerCount, players } = currentRound;
    const { winner, losers, endType, point } = addRecordDto;
    console.log('dto', addRecordDto);

    switch (endType) {
        case EEndType.WINNING: {
            console.log('winning');
            const winnerWind = getPlayerWind(currentRound, winner);
            const loserWind = getPlayerWind(currentRound, losers[0]);
            players[winnerWind].win++;
            players[loserWind].lose++;
            players[winnerWind].amount += (round.base + round.point * point);
            players[loserWind].amount -= (round.base + round.point * point);
            break;
        };
        case EEndType.SELF_DRAWN: {
            console.log('self');
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
            console.log('draw');
            const keyPromise = Object.keys(players).map(async key => {
                players[key].draw++;
            });
            await Promise.all(keyPromise);
            break;
        };
        case EEndType.FAKE: {
            console.log('fake');

            break;
        };
    };
    await setCurrentRound(currentRound);
    await updateCurrentRound(currentRound, addRecordDto);
    console.log(currentRound);
};

export const popLastRecord = async () => {
    // const currentRound = await getCurrentRound();
    // const { records } = currentRound;
    // const poped = records.pop();
    // switch
};

const updateCurrentRound = async (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    const { dealer, circle } = currentRound;
    if (isDealerContinue(currentRound, addRecordDto)) {
        currentRound.dealerCount++;
    } else {
        currentRound.dealerCount = 0;
        if (dealer === EWind.NORTH) {
            if (circle === EWind.NORTH) {
                await insertRecords(currentRound);
                await resetCurrentRound();
            } else {
                const nextCircle = updateWind(circle);
                currentRound.circle = nextCircle;
            };
        };
        const nextDealer = updateWind(dealer);
        currentRound.dealer = nextDealer;
    };
    await setCurrentRound(currentRound);
};

const recoverCurrentRound = async () => {

};

const insertRecords = async (currentRound: ICurrentRound) => {
    const { records, round } = currentRound;
    const insertPromise = records.map(async record => {
        const { winner, losers, point, endType } = record;
        //TODO 從cr找，可以不需要進DB
        const winnerPlayer = await playerModel.readOneByName(winner);
        const loserPlayers = await playerModel.readManyByNames(losers);
        const dto: ICreateOneRecordDto = {
            round: round,
            winner: winnerPlayer,
            losers: loserPlayers,
            endType: endType,
            point: point
        };
        await recordModel.createOne(dto);
    });
    await Promise.all(insertPromise);
};

const calculateVenue = async (currentRound: ICurrentRound, addRecordDto: IAddRecord) => {
    const { venue, players } = currentRound;
    const { winner } = addRecordDto;
    const winnerWind = getPlayerWind(currentRound, winner);
    if (winnerWind) {
        if (venue.length < 4) {
            venue.push(winner);
            players[winnerWind].amount -= 50;
        };
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

const setCurrentRound = async (currentRound: ICurrentRound) => {
    redisClient.set(CURRENTROUND, JSON.stringify(currentRound));
};

const resetCurrentRound = async () => {
    redisClient.set(CURRENTROUND, JSON.stringify({
        round: {
            uid: '',
            records: []
        },
        players: {
            east: {
                draw: 0
            }
        }
    }));
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