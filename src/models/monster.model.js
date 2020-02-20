const mongoose = require("mongoose")
const Schema = mongoose.Schema

const monsterSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    name: {
        type: String,
        required: true,
        unique: true
    },

    attack: {
        type: Number,
        required: true
    },

    defence: {
        type: Number,
        required: true
    },

    loot: [String]

})

const Monster = mongoose.model("Monster", monsterSchema)

module.exports = Monster