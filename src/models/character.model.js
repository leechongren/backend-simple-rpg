const mongoose = require("mongoose")
const Schema = mongoose.Schema

const equipmentSchema = new Schema({
    armor: {
        type: String,
        default: "none"
    },
    weapon: {
        type: String,
        default: "none"
    }
}, { _id: false })

const characterSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
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

    HP: {
        type: Number,
        default: 0
    },

    MP: {
        type: Number,
        default: 0
    },

    equipments: { type: equipmentSchema, default: equipmentSchema },

    level: {
        type: Number,
        default: 1
    },

    exp: {
        type: Number,
        default: 0
    }

})

const Character = mongoose.model("Character", characterSchema)

module.exports = Character