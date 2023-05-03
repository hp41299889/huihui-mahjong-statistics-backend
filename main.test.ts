import request from 'supertest';
import http from 'http';
import app from './main';
import { Postgres } from '@databases'; // 导入 Postgres 类

let server: http.Server;

beforeAll((done) => {
    server = app.listen(8000, () => {
        done();
    });
});

afterAll(async (done) => {
    server.close(() => {
        done();
    });
    await Postgres.destroy(); // 关闭数据库连接
});
describe('api test', () => {
    test('POST /mahjong/api/player', async () => {
        const res = await request(app).post('/mahjong/api/player').send({
            name: '地殼'
        });

        expect(res.status).toBe(201);
    });
});