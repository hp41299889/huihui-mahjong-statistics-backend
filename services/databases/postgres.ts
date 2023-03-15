import { DataSource } from "typeorm";

import { postgresConfig } from '../../configs/config';
import * as entity from '../../entities';

export {
    postgres,
    postgresInit
};

const postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    synchronize: true,
    entities: [
        entity.Player,
        entity.Record,
        entity.Round
    ]
});

const postgresInit = async () => {
    await postgres.initialize()
        .then(() => {
            console.log('postgres connect success');
        })
        .catch((err) => {
            console.log(err);
            console.log('postgres connect fail');
        });
};