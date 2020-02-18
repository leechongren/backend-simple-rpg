const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
require("dotenv").config() //read the env file


app.use(express.json())
app.use(cookieParser());

const monsterRouter = require("./routes/monsters.route")
app.use("/monsters", monsterRouter)
const characterRouter = require("./routes/characters.route")
app.use("/characters", characterRouter)
const userRouter = require('./routes/users.route')
app.use("/users", userRouter)

app.get("/", (req, res) => {
    res.send({
        "0": "GET /monsters",
        "1": "POST /monsters",
        "2": "GET /characters",
        "3": "GET /characters?name= - find specific character",
        "4": "POST /users/:username/character/create",
        "5": "GET /users/:username - profile page",
        "6": "POST /users/login",
        "7": "POST /users/register",
        "8": "DELETE /users/:username",
        "9": "GET /users/:username/profile",
        "10": "GET /users/:username/stats",
        "11": "GET /users/:username/battle",
        "12": "PATCH /users/:username/profile",
    })
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500)
    console.log(err)
    if (err.statusCode) {
        res.send({ error: err.message })
    } else {
        res.send({ error: "internal server error" })
    }
})

module.exports = app

