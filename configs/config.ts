import 'dotenv/config';

const { env } = process;

export {
    appConfig,
    postgresConfig
};

const appConfig = {
    port: env.APP_PORT
};

const postgresConfig = {
    username: env.HUIHUI_POSTGRES_USERNAME,
    password: env.HUIHUI_POSTGRES_PASSWORD,
    host: env.HUIHUI_POSTGRES_HOST,
    port: env.HUIHUI_POSTGRES_PORT || 5432,
    database: env.HUIHUI_POSTGRES_DB
};