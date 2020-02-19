const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server");

const jwt = require("jsonwebtoken")
jest.mock("jsonwebtoken")

const User = require("../models/user.model")

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("test cases for characters route", () => {
    let mongoServer
    beforeAll(async () => {
        try {
            mongoServer = new MongoMemoryServer()
            const mongoUri = await mongoServer.getConnectionString()
            await mongoose.connect(mongoUri)
        } catch (err) {
            console.error(err)
        }
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        const usersData = [{
            id: "1",
            username: "testuser1",
            password: "abcd1234",
            characters: [{
                character_id: "1",
                name: "testchar1",
                job: "Warrior",
                equipments: {
                    armor: "cloth",
                    weapon: "axe"
                }
            }]
        }, {
            id: "2",
            username: "testuser2",
            password: "abcd1234",
            characters: [{
                character_id: "2",
                name: "testchar2",
                job: "Warrior",
                equipments: {
                    armor: "cloth",
                    weapon: "sword"
                }
            }, {
                character_id: "3",
                name: "testchar3",
                job: "Mage",
                equipments: {
                    armor: "cloth",
                    weapon: "wand"
                }
            }]
        }];
        await User.create(usersData);
    });

    afterEach(async () => {
        jest.resetAllMocks()
        await User.deleteMany()
    })

    describe("/users/register", () => {
        test("POST should create a new user", async () => {
            const { body: user } = await request(app)
                .post("/users/register")
                .send({
                    id: 3,
                    username: "testuser3",
                    password: "abcd1234"
                })
                .expect(201)
            expect(user.username).toBe("testuser3")
            expect(user.password).not.toBe("abcd1234")
        })
    })

    describe("/users/login", () => {
        test("POST should login when username and password is correct", async () => {
            const correctUser = {
                username: "testuser1",
                password: "abcd1234"
            }

            const { text: message } = await request(app)
                .post("/users/login")
                .send(correctUser)
                .expect(200)
            expect(message).toEqual("You are now logged in!")
        })

        test("{POST should not login when username is incorrect", async () => {
            const wrongUser = {
                username: "testuser",
                password: "abcd1234"
            }

            const { body: message } = await request(app)
                .post("/users/login")
                .send(wrongUser)
                .expect(400)
            expect(message.error).toEqual("Login failed")

        })

        test("{POST should not login when password is incorrect", async () => {
            const wrongUser = {
                username: "testuser1",
                password: "abcd12345"
            }

            const { body: message } = await request(app)
                .post("/users/login")
                .send(wrongUser)
                .expect(400)
            expect(message.error).toEqual("Login failed")
        })
    })

    describe("/users/:username", () => {
        test("GET username should display correct user details when correct user is logged", async () => {
            const expectedUser = {
                username: "testuser1"
            }
            jwt.verify.mockReturnValueOnce({ name: expectedUser.username })
            const { body: user } = await request(app)
                .get(`/users/${expectedUser.username}`)
                .set("Cookie", "token=valid token")
                .expect(200)
            expect(user).toMatchObject(expectedUser)
        })

        test("GET username should respond with error message 'incorrect user' when different user try to access", async () => {
            const wrongUser = {
                username: "testuser1"
            }
            jwt.verify.mockReturnValueOnce({ name: wrongUser.username })
            const { body: error } = await request(app)
                .get("/users/testuser2")
                .set("Cookie", "token=valid token")
                .expect(403)
            expect(error.error).toEqual("Incorrect user!")
        })

        test("GET should deny access when there are no token assigned/not logged in", async () => {
            const { body: error } = await request(app)
                .get("/users/testuser1")
                .expect(401)
            expect(error.error).toEqual("You are not authorized!")
        })
    })
})