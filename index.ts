import express from 'express';
import cors from 'cors';
import * as routes from './apis';
import * as services from './services';
import { appConfig } from './configs/config';

const app = express();
app.use(express.json());
app.use(cors());

const routeInit = () => {
    app.use('/player', routes.player);
    app.use('/record', routes.record);
    app.use('/round', routes.round);
};

const serviceInit = () => {
    services.postgresInit();
};

const appInit = async () => {
    routeInit();
    serviceInit();
};

appInit()
    .then(() => {
        app.listen(appConfig.port, () => {
            console.log('app running on port', appConfig.port);

        });
    });