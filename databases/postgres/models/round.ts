import postgres from '@postgres/postgres';
import { EDeskType, IPlayer, Round } from '@postgres/entities';

interface ICreateOneRoundDto {
    deskType: EDeskType;
    base: number;
    point: number;
    east: IPlayer;
    south: IPlayer;
    west: IPlayer;
    north: IPlayer;
};

const repo = postgres.getRepository(Round);

const createOne = async (dto: ICreateOneRoundDto) => {
    try {
        return await repo.save(dto);
    } catch (err) {
        throw err;
    };
};

const readAll = async () => {
    try {
        return repo.find();
    } catch (err) {
        throw err;
    };
};


const readOneByUid = async (uid: string) => {
    try {
        return repo.findOneBy({ uid: uid });
    } catch (err) {
        throw err;
    };
};

const readLast = async () => {
    try {
        return repo.findOne({
            where: {

            },
            order: {
                createdAt: 'DESC'
            }
        });
    } catch (err) {
        throw err;
    };
};

export { ICreateOneRoundDto };
export default {
    createOne,
    readAll,
    readLast,
    readOneByUid
};