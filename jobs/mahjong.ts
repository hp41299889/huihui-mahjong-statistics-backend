import { IPlayer } from "@apis/player";
import { EEndType, EWind, IRecord } from "@apis/record";
import { EDeskType, roundModel } from "@apis/round";
import { redisClient } from "services/redis";

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
    roundUid: string;
    deskType: EDeskType;
    base: number;
    point: number;
    records: IAddRecordDto[];
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
        // await setCurrentRound(currentRound);
        // const updatedCurrentRound = { ...currentRound };
        // const calculatePromise = currentRound.records.map(async (record, index) => {
        //     const { winner, losers } = record;
        //     switch (record.endType) {
        //         case EEndType.WINNING: {
        //             console.log('winning');
        //             const winnerWind = await getPlayerWind(winner.name);
        //             const loserWindPromise = losers.map(async loser => {
        //                 const loserWind = await getPlayerWind(loser.name);
        //                 calculateAmount(winnerWind, loserWind, record, updatedCurrentRound);
        //                 updatedCurrentRound.players[loserWind].lose++;
        //             });
        //             updatedCurrentRound.players[winnerWind].win++;
        //             await Promise.all(loserWindPromise);
        //             break;
        //         };
        //         case EEndType.SELF_DRAWN: {
        //             console.log('self');
        //             const winnerWind = await getPlayerWind(winner.name);
        //             const loserWindPromise = losers.map(async loser => {
        //                 const loserWind = await getPlayerWind(loser.name);
        //                 calculateAmount(winnerWind, loserWind, record, updatedCurrentRound);
        //                 updatedCurrentRound.players[loserWind].beSelfDrawn++;
        //             });
        //             updatedCurrentRound.players[winnerWind].selfDrawn++;
        //             await Promise.all(loserWindPromise);
        //             break;
        //         };
        //         case EEndType.DRAW: {
        //             console.log('draw');

        //             break;
        //         };
        //         case EEndType.FAKE: {
        //             console.log('fake');

        //             break;
        //         };
        //     };
        //     await setCurrentRound(updatedCurrentRound);
        //     if (index === currentRound.records.length - 1) {
        //         await updateCurrentRound(lastRecord);
        //     };
        // });
        // await Promise.all(calculatePromise);
        const calculatePromise = latestRound.records.map(async (record) => {
            const { winner, losers, point } = record;
            // await addRecord(currentRound, {});
            // await updateCurrentRound();
        });
        await Promise.all(calculatePromise);
        await setCurrentRound(currentRound);
        console.log(await getCurrentRound());

    };
};

export const updateCurrentRound = async (currentRound: ICurrentRound, addRecordDto: IAddRecordDto) => {
    // const { dealer, circle } = record;
    // const currentRound = await getCurrentRound();
    // const updatedCurrentRound: ICurrentRound = {
    //     ...currentRound,
    //     circle: record.circle,
    //     dealer: record.dealer
    // };
    // await setCurrentRound(updatedCurrentRound);
    const { dealer, circle } = currentRound;
    if (isDealerContinue(currentRound, addRecordDto)) {
        currentRound.dealerCount++;
        // updatedCurrentRound.dealerCount = currentRound.dealerCount + 1;
    } else {
        if (dealer === EWind.NORTH) {
            if (circle === EWind.NORTH) {
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
    console.log(currentRound);
};

export const addRecord = async (currentRound: ICurrentRound, addRecordDto: IAddRecordDto) => {
    currentRound.records = [...currentRound.records, addRecordDto];
    const { winner, losers, endType, point } = addRecordDto;
    switch (endType) {
        case EEndType.WINNING: {
            console.log('winning');
            const winnerWind = getPlayerWind(currentRound, winner);
            const loserWindPromise = losers.map(async loser => {
                const loserWind = getPlayerWind(currentRound, loser);
                // calculateAmount(winnerWind, loserWind, record, updatedCurrentRound);
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
                // calculateAmount(winnerWind, loserWind, record, updatedCurrentRound);
                currentRound.players[loserWind].beSelfDrawn++;
            });
            currentRound.players[winnerWind].selfDrawn++;
            await Promise.all(loserWindPromise);
            break;
        };
        case EEndType.DRAW: {
            console.log('draw');

            break;
        };
        case EEndType.FAKE: {
            console.log('fake');

            break;
        };
    };

    // const currentRound = await getCurrentRound();
    // const record: IRecord = {
    //     uid: '',
    //     round: currentRound,
    //     circle: currentRound.circle,
    //     dealer: currentRound.dealer,
    //     dealerCount: currentRound.dealerCount,
    //     endType: addRecordDto.endType,
    //     point: addRecordDto.point,
    //     createdAt: new Date(),
    //     winner: await getPlayerByName(addRecordDto.winner),
    //     losers: await Promise.all(addRecordDto.loser.map(name => getPlayerByName(name)))
    // };
    // const updatedCurrentRound: ICurrentRound = {
    //     ...currentRound,
    //     records: [...currentRound.records, record]
    // };
    // await setCurrentRound(updatedCurrentRound);
};

const calculateAmount = (winWind: string, loseWind: string, point: number, updatedCurrentRound: ICurrentRound) => {
    // if (isDealer(winWind, loseWind, record)) {
    //     const points = record.point + updatedCurrentRound.dealerCount * 2 + 1;
    //     updatedCurrentRound.players[winWind].amount += (updatedCurrentRound.base + updatedCurrentRound.point * points);
    //     updatedCurrentRound.players[loseWind].amount -= (updatedCurrentRound.base + updatedCurrentRound.point * points);
    // } else {
    //     updatedCurrentRound.players[winWind].amount += (updatedCurrentRound.base + updatedCurrentRound.point * record.point);
    //     updatedCurrentRound.players[loseWind].amount -= (updatedCurrentRound.base + updatedCurrentRound.point * record.point);
    // };
};

const isDealer = (winWind: string, loseWind: string, record: IRecord) => {
    return winWind === record.dealer || loseWind === record.dealer;
};

const isDealerContinue = (currentRound: ICurrentRound, addRecordDto: IAddRecordDto) => {
    return (isDealerWin(currentRound, addRecordDto.winner) || isDraw(addRecordDto.endType) || isFake(addRecordDto.endType));
};

const isDealerWin = (currentRound: ICurrentRound, winnerName: string) => {
    return currentRound.dealer === getPlayerWind(currentRound, winnerName);
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
    redisClient.set(CURRENTROUND, JSON.stringify({}));
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