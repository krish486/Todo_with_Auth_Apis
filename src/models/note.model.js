const { default: mongoose } = require("mongoose");

//----creating note-Schema for notes
let noteSchema = new mongoose.Schema({
    title: String,
    description: String,
}, { timestamps: true })


//----creating note-Model for notes
let noteModel = mongoose.model("note", noteSchema)


module.exports = noteModel