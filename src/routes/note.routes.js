
let express = require("express")
const { createNoteController, readNoteController, updateNoteController, deleteNoteController } = require("../controllers/note.controllers")

let routes = express.Router()


/**
 * @route POST /note/create
 * @description Creates a new note
 * Validates and stores note data in database
 * @access Public
 */
routes.post("/create", createNoteController)

/**
 * @route GET /note/read
 * @description Fetches all notes or a specific note
 * Retrieves note data from database
 * @access Public
 */
routes.get("/read", readNoteController)

/**
 * @route PATCH /note/update
 * @description Updates an existing note
 * Modifies note data based on user request
 * @access Public
 */
routes.patch("/update/:id", updateNoteController)

/**
 * @route DELETE /note/delete
 * @description Deletes an existing note
 * Removes note data from database
 * @access Public
 */
routes.delete("/delete/:id", deleteNoteController)


module.exports = routes