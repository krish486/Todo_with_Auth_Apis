let express = require("express")
let authRoutes = require("./routes/auth.routes")
let noteRoutes = require("./routes/note.routes")
let cookieParser = require("cookie-parser")

let app = express()


///---accepting data from client
app.use(express.json())


//----configuring cookie parser
app.use(cookieParser())


/**
 * Registers authentication-related routes
 *@description Handles  registration, and user authentication APIs
 */
app.use("/auth", authRoutes)

/**
 * Registers note-related routes
 * @description Handles CRUD operations for notes
 */
app.use("/note", noteRoutes)



module.exports = app