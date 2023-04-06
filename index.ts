import express from 'express';
import cors from 'cors';
import routes from './apis';
import { appConfig } from './configs/config';
import { Postgres } from './databases/postgres/postgres';

const app = express();
app.use(express.json());
app.use(cors());

const routeInit = (): void => {
    Object.entries(routes).forEach(([key, router]) => {
        app.use(`${appConfig.prefix}/${key}`, router);
    });
};

const dbInit = (): void => {
    Postgres.initialize()
        .then(() => {
            console.log('postgres connect success');
        });
};

const appInit = async () => {
    try {
        routeInit();
        dbInit();
        app.listen(appConfig.port, () => {
            console.log('app running on port', appConfig.port);
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

appInit();