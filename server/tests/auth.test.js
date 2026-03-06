const request = require('supertest');
const app = require('../index'); // We'll need to export app from index.js
const { User } = require('../models');

describe('Authentication API', () => {
    let testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'citizen'
    };

    beforeAll(async () => {
        // Clean up test user if exists
        await User.destroy({ where: { email: testUser.email }, force: true });
    });

    test('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toEqual(testUser.email);
    });

    test('should NOT register a user with duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
    });

    test('should login successfully and return dual tokens', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    });

    test('should block login after too many attempts (simulate lockout)', async () => {
        // This would require 5 failed attempts
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: 'wrongpassword' });
        }

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toContain('Account locked');
    });
});
