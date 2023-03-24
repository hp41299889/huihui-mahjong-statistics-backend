import { DataSource } from "typeorm";
import 'dotenv/config';

import { postgresConfig } from '../../configs/config';
import * as entity from './entities/index';

const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: [
        // entity.Player,
        // entity.Record,
        // entity.Round
    ],
    migrations: ['./databases/migrations/*.ts'],
    migrationsTableName: 'migrations',
    // synchronize: true
});

Postgres.initialize()
    .then(() => {
        console.log('postgres connect success');
    });

export default Postgres;