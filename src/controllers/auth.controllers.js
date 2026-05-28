const authModel = require("../models/auth.model");

let jwt = require("jsonwebtoken")

///----CREATING CONTROLLER FOR REGISTER
let authController = async (req, res) => {
    try {
        let { name, email } = req.body;

        ///----------validation--------------------------------------
        if (!name) return req.status(400).json({ message: "name required" })
        if (!email) return req.status(400).json({ message: "email required" });

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        //----checking email format ----------------------
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" })


        let newUser = await authModel.create({
            name,
            email
        })

        let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.cookie("token", token)

        return res.status(201).json({
            message: "user register successfully",
            newUser
        })

    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

module.exports = authController