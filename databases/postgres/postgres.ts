import { DataSource } from "typeorm";

import { postgresConfig } from '@configs/config';
import { Player, Record, RecordLoser, Round } from './entities/index';

const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: [
        Player,
        Record,
        Round,
        RecordLoser
    ],
    migrations: [],
    migrationsTableName: 'migrations',
    synchronize: true
});

Postgres.initialize()
    .then(() => {
        console.log('postgres connect success');
    });

export default Postgres;