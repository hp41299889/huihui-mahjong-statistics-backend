import { DataSource } from "typeorm";

import { postgresConfig } from '../../configs/config';
import { Player } from '../../apis/player/player.entity';
import { Record } from '../../apis/record/record.entity';
import { Round } from '../../apis/round/round.entity';
import { migration1680509971986 } from "./migrations/1680509971986-migration";

export const Postgres = new DataSource({
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
    ],
    migrations: [migration1680509971986],
    migrationsTableName: 'migrations',
    // synchronize: true
});