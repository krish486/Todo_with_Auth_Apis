let express = require("express");
const authController = require("../controllers/auth.controllers");
let router = express.Router();


/**
 * @route POST/auth/register
 *@description Handles new user registration
 * Creates a new account after validating user data
 * @access Public
 */
router.post("/register", authController)


module.exports = router