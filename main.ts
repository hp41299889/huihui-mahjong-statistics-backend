import express from 'express';
import cors from 'cors';
import { routes } from '@apis/index';
import { appConfig } from '@configs';
import { Postgres } from '@databases';
<<<<<<< HEAD
import { redisConnect } from 'services/redis';
import { initCurrentRound } from 'jobs/mahjong/mahjong';
=======
import { redisConnect } from './services/redis';
import { initCurrentRound } from './jobs/mahjong';
>>>>>>> 5744e4460452ef53cc656fba14b34023bedf334d

const app = express();
app.use(express.json());
app.use(cors());

const dbInit = async () => {
    try {
        await Postgres.initialize()
            .then(() => {
                console.log('postgres connect success');
            }).catch(err => {
                console.log(err);
                throw err;
            });
    } catch (err) {
        throw err;
    }
};

const routeInit = (): void => {
    Object.entries(routes).forEach(([key, router]) => {
        app.use(`${appConfig.prefix}/${key}`, router);
    });
};


const appInit = async () => {
    try {
        await dbInit();
        routeInit();
        await redisConnect();
        await initCurrentRound();
        app.listen(appConfig.port, () => {
            console.log('app running on port', appConfig.port);
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

appInit();