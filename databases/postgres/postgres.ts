import { DataSource } from "typeorm";

// import { postgresConfig } from '@configs/config';
// import { Player } from '@apis/player';
// import { Record, RecordLoser } from '@apis/record';
// import { Round } from '@apis/round';
import { Migration1681452210340 } from "./migrations/1681452210340-migration";
import { postgresConfig } from '../../configs/config';
import { Player } from '../../apis/player/player.entity';
import { Record } from '../../apis/record/record.entity';
import { Round } from '../../apis/round/round.entity';

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
    migrations: [Migration1681452210340],
    migrationsTableName: 'migrations',
    synchronize: true
});