const mongoose = require("mongoose")
const Schema = mongoose.Schema


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
        enum["Warrior", "Thief", "Mage"]
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
    }


})