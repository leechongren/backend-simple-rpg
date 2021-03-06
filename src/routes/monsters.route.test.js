const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server");

const Monster = require("../models/monster.model")

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("test cases for monsters route", () => {
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
        const monstersData = [{
            id: "1",
            name: "Rat",
            attack: 12,
            defence: 11,
            loot: ["potion", "cheese"]
        }, {
            id: "2",
            name: "Goblin",
            attack: 12,
            defence: 11,
            loot: ["potion", "short sword"]
        }];
        await Monster.create(monstersData);
    });

    afterEach(async () => {
        await Monster.deleteMany()
    })

    describe("/monsters", () => {
        test("GET should display all monsters info", async () => {
            const expectedData = [{
                id: "1",
                name: "Rat",
                attack: 12,
                defence: 11,
                loot: ["potion", "cheese"]
            }, {
                id: "2",
                name: "Goblin",
                attack: 12,
                defence: 11,
                loot: ["potion", "short sword"]
            }];

            const { body: monsters } = await request(app)
                .get("/monsters")
                .expect(200)
            expect(monsters).toMatchObject(expectedData)
        })

        test("GET should display specific monster by ID", async () => {
            const expectedMonster = [{
                id: "2",
                name: "Goblin",
                attack: 12,
                defence: 11,
                loot: ["potion", "short sword"]
            }]

            const { body: monster } = await request(app)
                .get("/monsters/2")
                .expect(200)
            expect(monster).toMatchObject(expectedMonster)
        })

        test("POST should create a new monster", async () => {
            const { body: monster } = await request(app)
                .post("/monsters")
                .send({
                    id: "3",
                    name: "Wolf",
                    attack: 12,
                    defence: 11,
                    loot: ["meat", "fang sword"]
                }).expect(201)
            expect(monster.name).toBe("Wolf")
            expect(monster.attack).toBe(12)
            expect(monster.defence).toBe(11)
            expect(monster.loot).toEqual(["meat", "fang sword"])
        })
    })
})
