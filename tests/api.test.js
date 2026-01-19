const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
require('dotenv').config();

beforeAll(async () => {
    const dbUrl = process.env.DB_LOCAL_URL || 'mongodb://127.0.0.1:27017/news_project';
    await mongoose.connect(dbUrl);
});

afterAll(async () => {
    await mongoose.connection.close();
});

let adminToken = '';
let writerToken = '';
let testWriterId = '';

const adminCredentials = {
    email: 'shantocse612@gmail.com',
    password: 'shanto612'
};

const writerCredentials = {
    email: 'nibir@gmail.com',
    password: 'shanto612'
};

describe('Authentication & Authorization', () => {
    it('Admin login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send(adminCredentials);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        adminToken = res.body.token;
    });

    it('Writer login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send(writerCredentials);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        writerToken = res.body.token;
    });

    it('Login fails with invalid password', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: adminCredentials.email, password: 'wrong-password' });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid Credentials');
    });

    it('Login fails when email is missing', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ password: adminCredentials.password });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
    });

    it('Login fails when password is missing', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ email: adminCredentials.email });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
    });
});

describe('Admin Functionality', () => {
    it('Admin can create a new writer', async () => {
        const uniqueEmail = `test_writer_${Date.now()}@example.com`;

        const res = await request(app)
            .post('/api/writer/add')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Writer',
                email: uniqueEmail,
                password: 'shanto612',
                category: 'Sports'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('writer');
        testWriterId = res.body.writer._id;
    });

    it('Admin cannot create writer with duplicate email', async () => {
        const res = await request(app)
            .post('/api/writer/add')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Writer Duplicate',
                email: 'nibir@gmail.com',
                password: 'shanto612',
                category: 'Sports'
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
    });

    it('Admin can get writer by id', async () => {
        if (!testWriterId) {
            return;
        }

        const res = await request(app)
            .get(`/api/news/writer/${testWriterId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('writer');
        expect(res.body.writer._id).toBe(testWriterId);
    });

    it('Admin can update writer details', async () => {
        if (!testWriterId) {
            return;
        }

        const res = await request(app)
            .put(`/api/update/writer/${testWriterId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Updated Test Writer',
                email: `updated_${Date.now()}@example.com`,
                category: 'Politics',
                role: 'writer'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('writer');
    });

    it('Admin can delete writer', async () => {
        if (!testWriterId) {
            return;
        }

        const res = await request(app)
            .delete(`/api/delete/writer/${testWriterId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    });

    it('Admin can get writers list', async () => {
        const res = await request(app)
            .get('/api/news/writers')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('writers');
        expect(Array.isArray(res.body.writers)).toBe(true);
    });

    it('Admin can view news statistics', async () => {
        const res = await request(app)
            .get('/api/news-statistics');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('totalNews');
        expect(res.body).toHaveProperty('totalWriters');
    });

    it('Admin can view dashboard news', async () => {
        const res = await request(app)
            .get('/api/news')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
    });

    it('Admin can update news status when news exists', async () => {
        const latest = await request(app).get('/api/latest/news');
        expect(latest.statusCode).toBe(200);

        const list = Array.isArray(latest.body.news) ? latest.body.news : [];
        if (list.length === 0) {
            return;
        }

        const id = list[0]._id;

        const res = await request(app)
            .put(`/api/news/status-update/${id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'active' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    });

    it('Admin can fetch dashboard news details by id', async () => {
        const latest = await request(app).get('/api/latest/news');
        expect(latest.statusCode).toBe(200);

        const list = Array.isArray(latest.body.news) ? latest.body.news : [];
        if (list.length === 0) {
            return;
        }

        const id = list[0]._id;

        const res = await request(app)
            .get(`/api/news/${id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
        expect(res.body.news._id).toBe(id);
    });

    it('Admin can fetch edit dashboard news details by id', async () => {
        const latest = await request(app).get('/api/latest/news');
        expect(latest.statusCode).toBe(200);

        const list = Array.isArray(latest.body.news) ? latest.body.news : [];
        if (list.length === 0) {
            return;
        }

        const id = list[0]._id;

        const res = await request(app)
            .get(`/api/edit/news/${id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
        expect(res.body.news._id).toBe(id);
    });
});

describe('Writer Functionality', () => {
    it('Writer can view own news statistics', async () => {
        const res = await request(app)
            .get('/api/writer/news-statistics')
            .set('Authorization', `Bearer ${writerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('totalNews');
    });

    it('Writer can view own news list', async () => {
        const res = await request(app)
            .get('/api/writer/news')
            .set('Authorization', `Bearer ${writerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
    });

    it('Admin cannot access writer-only statistics', async () => {
        const res = await request(app)
            .get('/api/writer/news-statistics')
            .set('Authorization', `Bearer ${adminToken}`);

        expect([400, 403]).toContain(res.statusCode);
    });
});

describe('Profile API', () => {
    it('Admin can fetch own profile by id', async () => {
        const payload = jwt.decode(adminToken);
        const id = payload && payload.id;

        if (!id) {
            return;
        }

        const res = await request(app)
            .get(`/api/profile/${id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(adminCredentials.email);
    });

    it('Writer can fetch own profile by id', async () => {
        const payload = jwt.decode(writerToken);
        const id = payload && payload.id;

        if (!id) {
            return;
        }

        const res = await request(app)
            .get(`/api/profile/${id}`)
            .set('Authorization', `Bearer ${writerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(writerCredentials.email);
    });
});

describe('Security & Middleware', () => {
    it('Protected route without token returns 401', async () => {
        const res = await request(app).get('/api/news');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('Protected route with invalid token returns 401', async () => {
        const res = await request(app)
            .get('/api/news')
            .set('Authorization', 'Bearer invalid-token');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });
});

describe('Public API Endpoints', () => {
    it('Latest news returns list', async () => {
        const res = await request(app).get('/api/latest/news');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
    });

    it('Popular news returns list', async () => {
        const res = await request(app).get('/api/popular/news');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('popularNews');
    });

    it('All news grouped by category', async () => {
        const res = await request(app).get('/api/all/news');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
    });

    it('Categories summary returns list', async () => {
        const res = await request(app).get('/api/category/all');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('categories');
    });

    it('Recent news returns list', async () => {
        const res = await request(app).get('/api/recent/news');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
    });

    it('Images news returns images', async () => {
        const res = await request(app).get('/api/images/news');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('images');
    });

    it('Search without query value returns 400', async () => {
        const res = await request(app).get('/api/search/news');

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('Search with value returns 200', async () => {
        const res = await request(app).get('/api/search/news?value=test');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
    });

    it('News detail by slug when news exists', async () => {
        const latest = await request(app).get('/api/latest/news');
        expect(latest.statusCode).toBe(200);

        const list = Array.isArray(latest.body.news) ? latest.body.news : [];
        if (list.length === 0) {
            return;
        }

        const slug = list[0].slug;

        const res = await request(app).get(`/api/news/details/${slug}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('news');
        expect(res.body).toHaveProperty('relatedNews');
    });

    it('Category news by category when category exists', async () => {
        const latest = await request(app).get('/api/latest/news');
        expect(latest.statusCode).toBe(200);

        const list = Array.isArray(latest.body.news) ? latest.body.news : [];
        if (list.length === 0) {
            return;
        }

        const category = list[0].category;

        const res = await request(app).get(`/api/category/news/${category}`);

        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('news');
    });
});
