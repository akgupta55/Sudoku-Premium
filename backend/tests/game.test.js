const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Game API', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should generate a new puzzle', async () => {
        const res = await request(app).get('/api/game/puzzle/easy');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('puzzle');
        expect(res.body).toHaveProperty('solution');
    });

    it('should get the leaderboard', async () => {
        const res = await request(app).get('/api/game/leaderboard');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
