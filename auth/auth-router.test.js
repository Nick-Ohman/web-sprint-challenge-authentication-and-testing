const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");
const { intersect } = require("../database/dbConfig");



beforeEach(async () => {
    await db("users").truncate();
});


describe("POST /api/auth/register to be successful", () => {
    it('should register', () => {
        const name = "Nicko"

        return request(server)
            .post("/api/auth/register")
            .send({ username: name, password: "pass" })
            .then(res => {
                expect(res.body.data.username).toBe(name)
            })
    })
    it('returns a 400 if you dont send valid user', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: "nahhhh" })
            .expect(400)
    })
});

describe('tests the login functionality', () => {
    describe('you can login', () => {
        it('receives a 401 if you dont provide credentials', () => {
            return request(server)
                .post('/api/auth/login')
                .send({username: "notunique", password: "password"})
                .expect(401)
        })
        it('receives a 200 upon successful login', async () => {
            const name = "Nicko"
            const response = await request(server)

                .post('/api/auth/register')
                .send({username: name, password: "pass"}) 
                const loginres = await request(server)
                .post('/api/auth/login')
                .send({username: name, password: "pass"})
                expect(loginres.status).toBe(200)
        })

    })
})


describe('tests the jokes endpoint', () => {
    it('you can get the jokes if youre logged in', () => {
        return request(server)
                .get('/api/jokes')
                .set('Authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6Im5pY2siLCJpYXQiOjE1OTI1ODU4OTgsImV4cCI6MTU5MjY3MjI5OH0.0PzNLfMrGqzuISTIJhHRSvzdnLKmU0EtRO2Q-dxbXfM")
                .expect(200)
    })
    it('gives you a 401 if you dont have a valid token', () => {
        return request(server)
                .get('/api/jokes')
                .set('Authorization', 'a;laskdjf;lkj;')
                .then(response => {
                    expect(response.status).toBe(401)
            })
    })
})
