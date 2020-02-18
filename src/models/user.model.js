const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")

const equipmentSchema = new Schema({
    armor: {
        type: String
    },
    weapon: {
        type: String
    }
})

const characterSchema = new Schema({
    character_id: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    job: {
        type: String,
        enum: ["Warrior", "Thief", "Mage"],
        required: true
    },

    equipments: { equipmentSchema },

    level: {
        type: Number,
        default: 1
    },

    exp: {
        type: Number,
        default: 0
    }

})

const userSchema = new Schema({
    user_id: {
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

    characters: [characterSchema]
})

userSchema.pre("save", async function (next) {
    const rounds = 10
    this.password = await bcrypt.hash(this.password, rounds)
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User