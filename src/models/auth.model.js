const { default: mongoose } = require("mongoose");


///----create auth-schema for user data
let authSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

}, { timestamps: true })

//----create auth-model in mongodb compass
let authModel = mongoose.model("auth", authSchema)


module.exports = authModel