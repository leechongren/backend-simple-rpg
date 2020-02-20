const express = require("express")
const router = express.Router()
const { protectRoute } = require("../middlewares/authentication")
const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const { createJWToken } = require("../config/jwt")
const Character = require("../models/character.model")
const statsAssignTool = require("../config/statsAssignTool")

const INCORRECT_USER_MSG = "Incorrect user!"
//register new user
router.post("/register", async (req, res, next) => {
    try {
        const user = new User(req.body)
        await User.init()
        const newUser = await user.save()
        res.status(201).send(newUser)
    } catch (err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            throw new Error('Login failed')
        }
        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            throw new Error('Login failed')
        }

        const token = createJWToken(user.username)
        const oneDay = 24 * 60 * 60 * 1000;
        const expiryDate = new Date(Date.now() + oneDay);

        res.cookie("token", token, {
            expires: expiryDate,
            httpOnly: true,
        });

        res.send("You are now logged in!");
    } catch (err) {
        if (err.message === "Login failed") {
            err.statusCode = 400;
        }
        next(err);
    }
})

router.get("/:username", protectRoute, async (req, res, next) => {
    try {
        const username = req.params.username
        if (req.user.name !== username) {
            throw new Error(INCORRECT_USER_MSG)
        }

        const user = await User.findOne({ username })
        res.send(user)
    } catch (err) {
        if (err.message === INCORRECT_USER_MSG) {
            err.statusCode = 403;
        }

        next(err)
    }
})

router.get("/:username/characters", protectRoute, async (req, res, next) => {
    try {
        const username = req.params.username
        if (req.user.name !== username) {
            throw new Error(INCORRECT_USER_MSG)
        }
        const user = await User.findOne({ username })
        const USER_ID_FIELD_IN_CHARACTER_MODEL = "user_id"
        const characters = await Character.find({ user_id: user.id }, `-_id -__v -${USER_ID_FIELD_IN_CHARACTER_MODEL}`)
        res.status(200).json(characters)
    } catch (err) {
        next(err)
    }
})

router.post("/:username/characters", protectRoute, async (req, res, next) => {
    try {
        const username = req.params.username
        if (req.user.name !== username) {
            throw new Error(INCORRECT_USER_MSG)
        }
        const user = await User.findOne({ username })
        const character = new Character(req.body)
        character.user_id = user.id
        const job = character.job
        const statsArray = statsAssignTool(job)
        character.HP = statsArray[0]
        character.MP = statsArray[1]
        await Character.init()
        const newCharacter = await character.save()
        res.status(201).send(newCharacter)
    } catch (err) {
        next(err)
    }
})

router.get("/:username/characters/:character_id", protectRoute, async (req, res, next) => {
    try {
        const username = req.params.username
        if (req.user.name !== username) {
            throw new Error(INCORRECT_USER_MSG)
        }
        const user = await User.findOne({ username })
        const character = await Character.findOne({ user_id: user.id, id: req.params.character_id })
        res.status(200).json(character)
    } catch (err) {
        next(err)
    }
})

router.patch("/:username/characters/:character_id", protectRoute, async (req, res, next) => {
    try {
        const username = req.params.username
        if (req.user.name !== username) {
            throw new Error(INCORRECT_USER_MSG)
        }
        const update = {
            level: req.body.level,
            exp: req.body.exp,
            HP: req.body.HP,
            MP: req.body.MP,
            equipments: {
                armor: req.body.equipments.armor,
                weapon: req.body.equipments.weapon
            }
        }
        const user = await User.findOne({ username })
        const filter = { user_id: user.id, id: req.params.character_id }
        const newCharacterStats = await Character.findOneAndUpdate(filter, update, { new: true })
        res.status(201).json(newCharacterStats)

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
