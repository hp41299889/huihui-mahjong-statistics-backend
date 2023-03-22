import { DataSource } from "typeorm";
import 'dotenv/config';

import { postgresConfig } from '../configs/config';
import * as entity from './entities/index';

const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: [
        entity.Player,
        entity.Record,
        entity.Round
    ],
    migrations: ['migrations/*.ts'],
    migrationsTableName: 'migrations',
});

Postgres.initialize()
    .then(() => {
        console.log('postgres connect success');
    })
    .catch((err) => {
        console.log(err);
        console.log('postgres connect fail');
    });


export default Postgres;