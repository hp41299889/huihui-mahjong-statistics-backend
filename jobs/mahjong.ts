import { IPlayer, playerModel } from "@apis/player";
import { EEndType, EWind, ICreateOneRecordDto, IRecord, recordModel } from "@apis/record";
import { EDeskType, IRound, roundModel } from "@apis/round";
import { redisClient } from "../services/redis";

const CURRENTROUND = 'currentRound';

export const getCurrentRound = async (): Promise<ICurrentRound> => {
    return JSON.parse(await redisClient.get(CURRENTROUND));
};

export interface IAddRecordDto {
    winner: string,
    losers: string[],
    endType: EEndType,
    point: number
};

interface IPlayerStatistics {
    id: number;
    name: string;
    win?: number;
    lose?: number;
    selfDrawn?: number;
    draw: number;
    beSelfDrawn: number;
    fake?: number;
    amount?: number;
};

export interface ICurrentRound {
    round: IRound;
    roundUid: string;
    deskType: EDeskType;
    base: number;
    point: number;
    records: ICreateOneRecordDto[];
    players: {
        [key: string]: IPlayerStatistics;
        east: IPlayerStatistics;
        south: IPlayerStatistics;
        west: IPlayerStatistics;
        north: IPlayerStatistics;
    };
    circle: EWind;
    dealer: EWind;
    dealerCount: number;
};

export const initCurrentRound = async () => {
    const latestRound = await roundModel.readLatest();
    resetCurrentRound();
    if (latestRound) {
        const currentRound: ICurrentRound = {
            round: latestRound,
            roundUid: latestRound.uid,
            deskType: latestRound.deskType,
            base: latestRound.base,
            point: latestRound.point,
            players: {
                east: {
                    ...latestRound.east,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
                south: {
                    ...latestRound.south,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
                west: {
                    ...latestRound.west,
                    win: 0,
                    lose: 0,
                    selfDrawn: 0,
                    beSelfDrawn: 0,
                    draw: 0,
                    fake: 0,
                    amount: 0
                },
                north: {
                    ...latestRound.north,
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
            dealerCount: 0
        };
        await setCurrentRound(currentRound);
        console.log(await getCurrentRound());
    };
};

export const updateCurrentRound = async (currentRound: ICurrentRound, addRecordDto: IAddRecordDto) => {
    const { roundUid, dealer, circle, records } = currentRound;
    const round = await roundModel.readOneByUid(roundUid);
    if (isDealerContinue(currentRound, addRecordDto)) {
        currentRound.dealerCount++;
    } else {
        currentRound.dealerCount = 0;
        if (dealer === EWind.NORTH) {
            if (circle === EWind.NORTH) {
                await insertRecords(records, currentRound, round);
                await resetCurrentRound();
                currentRound = await getCurrentRound();
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

export const addRecord = async (addRecordDto: IAddRecordDto) => {
    const currentRound = await getCurrentRound();
    const { round, circle, dealer, dealerCount } = currentRound;
    const { winner, losers, endType, point } = addRecordDto;
    const record: ICreateOneRecordDto = {
        winner: await playerModel.readOneByName(winner),
        losers: await playerModel.readManyByNames(losers),
        circle: circle,
        dealer: dealer,
        dealerCount: dealerCount,
        endType: endType,
        point: point,
        round: round
    };
    currentRound.records = [...currentRound.records, record];
    switch (endType) {
        case EEndType.WINNING: {
            console.log('winning');
            const winnerWind = getPlayerWind(currentRound, winner);
            const loserWindPromise = losers.map(async loser => {
                const loserWind = getPlayerWind(currentRound, loser);
                calculateAmount(winnerWind, loserWind, point, dealer, currentRound);
                currentRound.players[loserWind].lose++;
            });
            currentRound.players[winnerWind].win++;
            await Promise.all(loserWindPromise);
            break;
        };
        case EEndType.SELF_DRAWN: {
            console.log('self');
            const winnerWind = getPlayerWind(currentRound, winner);
            const loserWindPromise = losers.map(async loser => {
                const loserWind = getPlayerWind(currentRound, loser);
                calculateAmount(winnerWind, loserWind, point, dealer, currentRound);
                currentRound.players[loserWind].beSelfDrawn++;
            });
            currentRound.players[winnerWind].selfDrawn++;
            await Promise.all(loserWindPromise);
            break;
        };
        case EEndType.DRAW: {
            console.log('draw');
            const keyPromise = Object.keys(currentRound.players).map(async key => {
                console.log('key', key);

                currentRound.players[key].draw++;
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

const insertRecords = async (dtos: ICreateOneRecordDto[], currentRound: ICurrentRound, round: IRound) => {
    const insertPromise = dtos.map(async dto => {
        await recordModel.createOne(dto);
    });
    await Promise.all(insertPromise);
};

const calculateAmount = (winWind: string, loseWind: string, point: number, dealer: string, currentRound: ICurrentRound) => {
    if (isDealer(winWind, loseWind, dealer)) {
        const points = point + currentRound.dealerCount * 2 + 1;
        currentRound.players[winWind].amount += (currentRound.base + currentRound.point * points);
        currentRound.players[loseWind].amount -= (currentRound.base + currentRound.point * points);
    } else {
        currentRound.players[winWind].amount += (currentRound.base + currentRound.point * point);
        currentRound.players[loseWind].amount -= (currentRound.base + currentRound.point * point);
    };
};

const isDealer = (winWind: string, loseWind: string, dealer: string) => {
    return winWind === dealer || loseWind === dealer;
};

const isDealerContinue = (currentRound: ICurrentRound, addRecordDto: IAddRecordDto) => {
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
    return Object.entries(currentRound.players).find(([key, value]) => value.name === name)[0];
};

const setCurrentRound = async (currentRound: ICurrentRound) => {
    redisClient.set(CURRENTROUND, JSON.stringify(currentRound));
};

const resetCurrentRound = async () => {
    redisClient.set(CURRENTROUND, JSON.stringify({
        roundUid: '',
        deskType: EDeskType.AUTO,
        base: 0,
        point: 0,
        players: {
            east: {},
            south: {},
            west: {},
            north: {}
        },
        records: [],
        circle: EWind.EAST,
        dealer: EWind.EAST,
        dealerCount: 0
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