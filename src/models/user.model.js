const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },

    // characters: [characterSchema]
})

userSchema.pre("save", async function (next) {
    const rounds = 10
    this.password = await bcrypt.hash(this.password, rounds)
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User