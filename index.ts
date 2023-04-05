import express from 'express';
import cors from 'cors';
import routes from './apis';
import { appConfig } from './configs/config';
import { Postgres } from './databases/postgres/postgres';

const app = express();
app.use(express.json());
app.use(cors());

const routeInit = () => {
    app.use('/player', routes.player);
    app.use('/record', routes.record);
    app.use('/round', routes.round);
};

const serviceInit = () => {
    // services.postgresInit();
};

const appInit = async () => {
    routeInit();
    serviceInit();
};

appInit()
    .then(() => {
        Postgres.initialize()
            .then(() => {
                console.log('postgres connect success');

            })
    })
    .then(() => {
        app.listen(appConfig.port, () => {
            console.log('app running on port', appConfig.port);

        });
    })
    .catch(err => {
        console.log(err);

    })