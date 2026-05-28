let express = require("express")
let authRoutes = require("./routes/auth.routes")
let cookieParser = require("cookie-parser")

let app = express()


///---accepting data from client
app.use(express.json())


//----configuring cookie parser
app.use(cookieParser())


//--connecting routes with app
app.use("/auth", authRoutes)




module.exports = app