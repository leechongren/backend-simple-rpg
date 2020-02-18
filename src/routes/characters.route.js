const express = require("express")
const router = express.Router()

const User = require("../models/user.model")

// Display all existing characters
router.get("/", async (req, res, next) => {
    try {
        const CHARACTERS_FIELD_IN_USER = "characters"
        const NAME_FIELD_IN_CHARACTERS = "name"
        const LEVEL_FIELD_IN_CHARACTERS = "level"
        const JOB_FIELD_IN_CHARACTERS = "job"

        const users = await User
            .find({},
                `${CHARACTERS_FIELD_IN_USER}.${NAME_FIELD_IN_CHARACTERS} 
                ${CHARACTERS_FIELD_IN_USER}.${LEVEL_FIELD_IN_CHARACTERS} 
                ${CHARACTERS_FIELD_IN_USER}.${JOB_FIELD_IN_CHARACTERS}`
            );

        const characters = users.flatMap(user => user.characters).sort()
        res.status(200).json(characters)
    } catch (err) {
        next(err)
    }
})

module.exports = router