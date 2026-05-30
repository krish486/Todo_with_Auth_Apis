const authModel = require("../models/auth.model");

let jwt = require("jsonwebtoken")

/**
 * ============================================================================
 * @CONTROLLER     registerController
 * @METHOD         POST
 * @ROUTE          /auth/register
 * @DESCRIPTION    Registers a new user and generates JWT token
 * ============================================================================
 */

const registerController = async (req, res) => {
    try {
        /**
         * Extract user data from request body
         */
        const { name, email, password } = req.body;

        /**
         * ========================================================================
         * BASIC VALIDATION
         * ========================================================================
         */

        if (!name)
            return res.status(400).json({
                message: "Name is required",
            });

        if (!email)
            return res.status(400).json({
                message: "Email is required",
            });

        if (!password)
            return res.status(400).json({
                message: "Password is required",
            });

        /**
         * Email format validation using Regex
         */
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email))
            return res.status(400).json({
                message: "Invalid email format",
            });



        /**
        * checking if user alredy exist or not
        */
        let exist = await authModel.findOne({ email })
        if (exist) {
            return res.status(409).json({
                message: "User already exists",
            });
        }



        /**
         * ========================================================================
         * CREATE NEW USER
         * Password hashing is handled automatically
         * by the schema pre-save middleware
         * ========================================================================
         */
        const newUser = await authModel.create({
            name,
            email,
            password,
        });



        /**
         * Generate JWT token for newly registered user
         */
        const token = newUser.generateJWT();

        /**
         * Store JWT token in browser cookie
         */
        res.cookie("token", token);

        /**
         * Send success response
         */
        return res.status(201).json({
            message: "User registered successfully",
            token,
        });
    } catch (error) {
        /**
         * Handle unexpected server errors
         */
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


let loginController = async (req, res) => {
    try {

        let { email, password } = req.body;
        /**
         * ========================================================================
         * BASIC VALIDATION
         * ========================================================================
         */


        if (!email)
            return res.status(400).json({
                message: "Email is required",
            });

        if (!password)
            return res.status(400).json({
                message: "Password is required",
            });

        /**
         * Email format validation using Regex
         */
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email))
            return res.status(400).json({
                message: "Invalid email format",
            });

        /**
        * checking if user alredy exist or not
        */
        let exist = await authModel.findOne({ email })
        if (!exist) {
            return res.status(409).json({
                message: "User do not exist",
            });
        }


        /**
         * Generate JWT token for existing user
         */
        let token = exist.generateJWT();

        /**
         * Store JWT token in browser cookie
         */
        res.cookie("token", token);

        /**
         * Send success response
         */
        return res.status(201).json({
            message: "User logged-in successfully",
            token,
        });

    } catch (error) {
        /**
         * Handle unexpected server errors
         */
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

module.exports = { registerController, loginController }