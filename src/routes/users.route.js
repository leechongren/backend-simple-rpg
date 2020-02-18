const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const { createJWToken } = require("../config/jwt")

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

router.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        err.statusCode = 400;
    } else if (err.name === "MongoError") {
        err.statusCode = 422;
    }
    next(err)
})

module.exports = router
