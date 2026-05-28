const authModel = require("../models/auth.model");
const noteModel = require("../models/note.model");

const jwt = require("jsonwebtoken");

/**
 * ============================================================================
 * @CONTROLLER     createNoteController
 * @METHOD         POST
 * @ROUTE          /note/create
 * @DESCRIPTION    Creates a new note for the logged-in user
 * ============================================================================
 */

let createNoteController = async (req, res) => {

    try {

        // ---------------------------------------------------------------------
        // Extract title and description from request body
        // ---------------------------------------------------------------------

        let { title, description } = req.body;


        // ---------------------------------------------------------------------
        // Access token from cookies
        // ---------------------------------------------------------------------

        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }


        // ---------------------------------------------------------------------
        // Verify token and extract user id
        // ---------------------------------------------------------------------

        let { id } = jwt.verify(token, process.env.JWT_SECRET);


        // ---------------------------------------------------------------------
        // Find logged-in user from database
        // ---------------------------------------------------------------------

        let user = await authModel.findById(id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        let { email } = user;


        // ---------------------------------------------------------------------
        // Validation checks
        // ---------------------------------------------------------------------

        if (!title) {
            return res.status(400).json({
                error: "Title required"
            });
        }

        if (!description) {
            return res.status(400).json({
                error: "Description required"
            });
        }

        if (title.trim().length < 4) {
            return res.status(400).json({
                error: "Title must be at least 4 characters long"
            });
        }

        if (description.trim().length < 10) {
            return res.status(400).json({
                error: "Description must be at least 10 characters long"
            });
        }


        // ---------------------------------------------------------------------
        // Create new note in database
        // ---------------------------------------------------------------------

        let newNote = await noteModel.create({
            title,
            description,
            email
        });


        // ---------------------------------------------------------------------
        // Success response
        // ---------------------------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            newNote
        });

    } catch (error) {

        // ---------------------------------------------------------------------
        // Server error response
        // ---------------------------------------------------------------------

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            err: error.message
        });
    }
};


/**
 * ============================================================================
 * @CONTROLLER     readNoteController
 * @METHOD         GET
 * @ROUTE          /note/read
 * @DESCRIPTION    Fetches all notes of the logged-in user
 * ============================================================================
 */

let readNoteController = async (req, res) => {

    try {

        // ---------------------------------------------------------------------
        // Access token from cookies
        // ---------------------------------------------------------------------

        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }


        // ---------------------------------------------------------------------
        // Verify token and extract user id
        // ---------------------------------------------------------------------

        let { id } = jwt.verify(token, process.env.JWT_SECRET);


        // ---------------------------------------------------------------------
        // Find logged-in user
        // ---------------------------------------------------------------------

        let user = await authModel.findById(id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        let { email } = user;


        // ---------------------------------------------------------------------
        // Fetch all notes associated with user's email
        // ---------------------------------------------------------------------

        let notes = await noteModel.find({ email });


        // ---------------------------------------------------------------------
        // Success response
        // ---------------------------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            totalNotes: notes.length,
            notes
        });

    } catch (error) {

        // ---------------------------------------------------------------------
        // Server error response
        // ---------------------------------------------------------------------

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            err: error.message
        });
    }
};


/**
 * ============================================================================
 * @CONTROLLER     updateNoteController
 * @METHOD         PATCH
 * @ROUTE          /note/update/:id
 * @DESCRIPTION    Updates an existing note
 * ============================================================================
 */

let updateNoteController = async (req, res) => {

    try {

        // ---------------------------------------------------------------------
        // Extract note id from params
        // ---------------------------------------------------------------------

        let { id } = req.params;


        // ---------------------------------------------------------------------
        // Extract updated data from request body
        // ---------------------------------------------------------------------

        let { title, description } = req.body;


        // ---------------------------------------------------------------------
        // Access token from cookies
        // ---------------------------------------------------------------------

        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }


        // ---------------------------------------------------------------------
        // Verify token and extract user id
        // ---------------------------------------------------------------------

        let decoded = jwt.verify(token, process.env.JWT_SECRET);


        // ---------------------------------------------------------------------
        // Find logged-in user
        // ---------------------------------------------------------------------

        let user = await authModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }


        // ---------------------------------------------------------------------
        // Find note by id
        // ---------------------------------------------------------------------

        let note = await noteModel.findById(id);

        if (!note) {
            return res.status(404).json({
                error: "Note not found"
            });
        }


        // ---------------------------------------------------------------------
        // Security check
        // Prevent users from updating other users' notes
        // ---------------------------------------------------------------------

        if (note.email !== user.email) {
            return res.status(403).json({
                error: "Access denied"
            });
        }


        // ---------------------------------------------------------------------
        // Validation checks
        // ---------------------------------------------------------------------

        if (title && title.trim().length < 4) {
            return res.status(400).json({
                error: "Title must be at least 4 characters long"
            });
        }

        if (description && description.trim().length < 10) {
            return res.status(400).json({
                error: "Description must be at least 10 characters long"
            });
        }


        // ---------------------------------------------------------------------
        // Update note data
        // ---------------------------------------------------------------------

        note.title = title || note.title;

        note.description = description || note.description;


        // ---------------------------------------------------------------------
        // Save updated note
        // ---------------------------------------------------------------------

        await note.save();


        // ---------------------------------------------------------------------
        // Success response
        // ---------------------------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note
        });

    } catch (error) {

        // ---------------------------------------------------------------------
        // Server error response
        // ---------------------------------------------------------------------

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            err: error.message
        });
    }
};


/**
 * ============================================================================
 * @CONTROLLER     deleteNoteController
 * @METHOD         DELETE
 * @ROUTE          /note/delete/:id
 * @DESCRIPTION    Deletes an existing note
 * ============================================================================
 */

let deleteNoteController = async (req, res) => {

    try {

        // ---------------------------------------------------------------------
        // Extract note id from params
        // ---------------------------------------------------------------------

        let { id } = req.params;


        // ---------------------------------------------------------------------
        // Access token from cookies
        // ---------------------------------------------------------------------

        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access"
            });
        }


        // ---------------------------------------------------------------------
        // Verify token and extract user id
        // ---------------------------------------------------------------------

        let decoded = jwt.verify(token, process.env.JWT_SECRET);


        // ---------------------------------------------------------------------
        // Find logged-in user
        // ---------------------------------------------------------------------

        let user = await authModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }


        // ---------------------------------------------------------------------
        // Find note by id
        // ---------------------------------------------------------------------

        let note = await noteModel.findById(id);

        if (!note) {
            return res.status(404).json({
                error: "Note not found"
            });
        }


        // ---------------------------------------------------------------------
        // Security check
        // Prevent users from deleting other users' notes
        // ---------------------------------------------------------------------

        if (note.email !== user.email) {
            return res.status(403).json({
                error: "Access denied"
            });
        }


        // ---------------------------------------------------------------------
        // Delete note
        // ---------------------------------------------------------------------

        await noteModel.findByIdAndDelete(id);


        // ---------------------------------------------------------------------
        // Success response
        // ---------------------------------------------------------------------

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {

        // ---------------------------------------------------------------------
        // Server error response
        // ---------------------------------------------------------------------

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            err: error.message
        });
    }
};


/**
 * ============================================================================
 * EXPORTING CONTROLLERS
 * ============================================================================
 */

module.exports = {
    createNoteController,
    readNoteController,
    updateNoteController,
    deleteNoteController
};