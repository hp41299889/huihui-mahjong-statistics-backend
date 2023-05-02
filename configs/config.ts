import 'dotenv/config';

const { env } = process;

export const appConfig = {
    port: env.APP_PORT,
    prefix: env.APP_API_PREFIX,
    debug: env.APP_DEBUG
};

export const postgresConfig = {
    username: env.HUIHUI_POSTGRES_USER,
    password: env.HUIHUI_POSTGRES_PASSWORD,
    host: env.HUIHUI_POSTGRES_HOST,
    port: env.HUIHUI_POSTGRES_PORT || 5432,
    database: env.HUIHUI_POSTGRES_DB
};

export const redisConfig = {
    host: env.HUIHUI_REDIS_HOST
};