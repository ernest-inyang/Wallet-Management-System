import { db } from '../src/config/knex';

process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

afterAll(async () => {
    await db.destroy();
});

jest.setTimeout(10000);