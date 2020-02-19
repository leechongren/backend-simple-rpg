const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server");

const Character = require("../models/character.model")

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
        const charactersData = [{
            id: "1",
            user_id: "1",
            name: "testchar1",
            job: "Warrior",
            equipments: {
                armor: "cloth",
                weapon: "axe"
            }
        }, {
            id: "2",
            user_id: "1",
            name: "testchar2",
            job: "Thief",
            equipments: {
                armor: "cloth",
                weapon: "knife"
            }
        }];
        await Character.create(charactersData);
    });

    afterEach(async () => {
        await Character.deleteMany()
    })

    describe("/characters", () => {
        it("GET should display all existing characters", async () => {
            const expectedData = [{
                name: "testchar1",
                job: "Warrior",
                level: 1
            }, {
                name: "testchar2",
                job: "Thief",
                level: 1

            }]

            const { body: characters } = await request(app)
                .get("/characters")
                .expect(200)
            expect(characters).toEqual(expectedData)
        })
    })
})