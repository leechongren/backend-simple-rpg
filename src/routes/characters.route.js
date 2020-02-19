const express = require("express")
const router = express.Router()

const Character = require("../models/character.model")

// Display all existing characters
router.get("/", async (req, res, next) => {
    try {
        const NAME_FIELD_IN_CHARACTERS = "name"
        const LEVEL_FIELD_IN_CHARACTERS = "level"
        const JOB_FIELD_IN_CHARACTERS = "job"

        const characters = await Character
            .find({},
                `-_id ${NAME_FIELD_IN_CHARACTERS} 
                ${LEVEL_FIELD_IN_CHARACTERS} 
                ${JOB_FIELD_IN_CHARACTERS}`
            );
        res.status(200).json(characters)
    } catch (err) {
        next(err)
    }
})

module.exports = router