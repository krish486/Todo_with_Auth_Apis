const { default: mongoose } = require("mongoose")

//creating connection funtion for db 
let connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Db connected successfull")
    } catch (error) {
        console.log("error in connecting DB", error)
    }
}

module.exports = connectDB