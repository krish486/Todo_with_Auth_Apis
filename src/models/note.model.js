const { default: mongoose } = require("mongoose");

/**
 * ============================================================================
 * NOTE SCHEMA
 * Defines the structure of note documents stored in MongoDB
 * ============================================================================
 */
const noteSchema = new mongoose.Schema(
    {
        /**
         * Title of the note
         */
        title: {
            type: String,
            trim: true,
        },

        /**
         * Main content / description of the note
         */
        description: {
            type: String,
            trim: true,
        },

        /**
         * Email of the user who owns the note
         */
        email: {
            type: String,
            trim: true,
        },
    },
    {
        /**
         * Automatically adds:
         * createdAt
         * updatedAt
         */
        timestamps: true,
    }
);

/**
 * ============================================================================
 * NOTE MODEL
 * Creates and exports the Note collection model
 * ============================================================================
 */
const noteModel = mongoose.model("note", noteSchema);

module.exports = noteModel;