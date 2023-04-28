import { DataSource } from "typeorm";

import { postgresConfig } from '@configs';
import { entities } from "@apis/entities";
import { Migration1682650316761 } from "./migrations/1682650316761-migration";

export const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: entities,
    migrations: [Migration1682650316761],
    migrationsTableName: 'migrations',
    // synchronize: true
});