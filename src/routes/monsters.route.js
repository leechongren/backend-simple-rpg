const express = require("express")
const router = express.Router()

const Monster = require("../models/monster.model")

router.get("/", async (req, res, next) => {
    try {
        const monsters = await Monster.find()
        res.status(200).send(monsters)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const monster = await Monster.find({ id: req.params.id })
        res.status(200).send(monster)
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const monster = new Monster(req.body)
        await Monster.init()
        const newMonster = await monster.save()
        res.status(201).send(newMonster)
    } catch (err) {
        next(err)
    }
})

router.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        err.statusCode = 400;
    } else if (err.name === "MongoError") {
        err.statusCode = 422;
    }
    next(err)
})

module.exports = router