import { DataSource } from "typeorm";

import { postgresConfig } from '@configs';
import { entities } from "@apis/entities";
import { Migration1681975341557 } from "./migrations/1681975341557-migration";

export const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: entities,
    migrations: [Migration1681975341557],
    migrationsTableName: 'migrations',
    // synchronize: true
});