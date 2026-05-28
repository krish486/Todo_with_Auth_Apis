let express = require("express")
let authRoutes = require("./routes/auth.routes")

let app = express()


///---accepting data from client
app.use(express.json())


//--connecting routes with app
app.use("/auth", authRoutes)




module.exports = app