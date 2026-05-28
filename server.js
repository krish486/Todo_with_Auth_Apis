require("dotenv").config();   //Configuring dotenv
let app = require("./src/app");
const connectDB = require("./src/config/db");

//------connecting DB with server
connectDB()


//-----create server
app.listen(3000, () => {
    console.log("server is running on port 3000")
})