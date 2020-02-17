const mongoose = require("mongoose")
const Schema = mongoose.Schema


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
    character_name: {
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

    equipment: { equipmentSchema },

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