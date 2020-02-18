const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server");

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
            user_id: "1",
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
            user_id: "2",
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
        await User.deleteMany()
    })

    describe("/characters", () => {
        test("GET should display all existing characters", async () => {
            const expectedData = [{
                name: "testchar1",
                job: "Warrior",
                level: 1
            }, {
                name: "testchar2",
                job: "Warrior",
                level: 1

            }, {
                name: "testchar3",
                job: "Mage",
                level: 1
            }]

            const { body: characters } = await request(app)
                .get("/characters")
                .expect(200)
            console.log(characters)
            expect(characters).toEqual(expectedData)
        })
    })
})