let express = require("express");
let { registerController, loginController } = require("../controllers/auth.controllers")
let router = express.Router();


/**
 * @route POST/auth/register
 *@description Handles new user registration
 * Creates a new account after validating user data
 * @access Public
 */
router.post("/register", registerController)


/**
 * @route POST/auth/login
 * @description Handles user login
 * @access Public
 */
router.post("/login", loginController)

module.exports = router