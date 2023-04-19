import { DataSource } from "typeorm";

import { postgresConfig } from '@configs';

export const Postgres = new DataSource({
    type: 'postgres',
    host: postgresConfig.host,
    port: +postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    entities: ['apis/**/*.entity.ts'],
    migrations: ['build/databases/postgres/migrations/*-migration.js'],
    migrationsTableName: 'migrations',
    // synchronize: true
});