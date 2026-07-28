import request from 'supertest';
import app from '../../src/app';
import { env } from 'node:process';

const token =
    env.NODE_ENV === 'development' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiZXJuZXN0QGdtYWlsLmNvbSIsImlhdCI6MTc4NTE3OTE2NywiZXhwIjoxNzg1NzgzOTY3fQ.qlSdFmYXj6BywiFaubvrBimSrbef3GJEihk9nk_-xvc'
        : 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibWFyeUBnbWFpbC5jb20iLCJpYXQiOjE3ODUyMjg5MzYsImV4cCI6MTc4NTMxNTMzNn0.fptjlQDB3VX8miibcG0jHym5q73dFjxA9ySNe_q-IsU';

describe('Health Check', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/api/v1/health');
        expect(response.status).toBe(200);
    });
});


describe('POST /users/register', () => {
    it('should validate required fields', async () => {
        const response = await request(app).post('/api/v1/users/register').send({});
        expect(response.status).toBe(422);
    });
});


describe('POST /users/login', () => {
    it('should reject invalid credentials', async () => {
        const response = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'wrong@test.com',
                password: '123456',
            });
        expect(response.status).toBe(422);

    });

});


describe('GET /users/profile', () => {
    it('should reject missing token', async () => {
        const response = await request(app).get('/api/v1/users');
        expect(response.status).toBe(401);
    });

});


describe('POST /transactions/fund', () => {
    it('should reject unauthenticated requests', async () => {
        const response = await request(app).post('/api/v1/transactions/fund').send({ amount: 1000 });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Authorization header missing.');
    });

});


describe('POST /transactions/transfer', () => {
    it('should validate payload', async () => {
        const response = await request(app)
            .post('/api/v1/transactions/transfer')
            .send({});

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Authorization header missing.');

    });

});


describe('POST /transactions/withdraw', () => {

    it('should validate payload', async () => {
        const response = await request(app)
            .post('/api/v1/transactions/withdraw')
            .send({});

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Authorization header missing.');

    });

});
