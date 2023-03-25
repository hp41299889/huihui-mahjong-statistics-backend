import 'dotenv/config';

const { env } = process;

const appConfig = {
    port: env.APP_PORT
};

const postgresConfig = {
    username: env.HUIHUI_POSTGRES_USER,
    password: env.HUIHUI_POSTGRES_PASSWORD,
    host: env.HUIHUI_POSTGRES_HOST,
    port: env.HUIHUI_POSTGRES_PORT || 5432,
    database: env.HUIHUI_POSTGRES_DB
};

export {
    appConfig,
    postgresConfig
};