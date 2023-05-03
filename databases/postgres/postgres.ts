import { DataSource } from "typeorm";

import { appConfig, postgresConfig } from '@configs';
import { entities } from "@apis/entities";
import { Migration1683031452292 } from "./migrations/1683031452292-migration";

export const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: entities,
    migrations: [Migration1683031452292],
    migrationsTableName: 'migrations',
    synchronize: appConfig.debug === 'true' ? true : false
});