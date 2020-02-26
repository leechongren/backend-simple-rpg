const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
require("dotenv").config() //read the env file
const cors = require("cors")

const corsOptions = {
    origin: [process.env.FRONTEND_URL, "http://localhost:3001", "http://localhost:3000"],
    credentials: true,
}

app.use(express.json())
app.use(cors(corsOptions));
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
        "3": "POST /users/register",
        "4": "POST /users/login",
        "5": "GET /users/:username",
        "6": "GET /users/:username/characters",
        "7": "POST /users/:username/characters",
        "8": "POST /users/:username/characters",
        "9": "GET /users/:username/characters/:character_id",
        "10": "PATCH /users/:username/characters/:character_id"
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

