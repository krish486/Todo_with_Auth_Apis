const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * ============================================================================
 * AUTH SCHEMA
 * Defines the structure of user authentication data in MongoDB
 * ============================================================================
 */
const authSchema = new mongoose.Schema(
    {
        /**
         * User's full name
         */
        name: {
            type: String,
            trim: true,
        },

        /**
         * User's email address
         * Must be unique for every user
         */
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        /**
         * User's password
         * Stored in hashed format before saving to database
         */
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        // Automatically adds createdAt and updatedAt fields
        timestamps: true,
    }
);

/**
 * ============================================================================
 * PRE-SAVE MIDDLEWARE
 * Hashes the password before storing it in the database
 * ============================================================================
 */
authSchema.pre("save", function () {
    this.password = bcrypt.hashSync(this.password, 10);
});

/**
 * ============================================================================
 * INSTANCE METHOD: comparePassword
 * Compares entered password with hashed password stored in database
 *
 * @param {String} password - Plain text password entered by user
 * @returns {Boolean}
 * ============================================================================
 */
authSchema.method.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * ============================================================================
 * INSTANCE METHOD: generateJWT
 * Generates JWT token for authenticated user
 *
 * @returns {String} JWT Token
 * ============================================================================
 */
authSchema.method.generateJWT = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );
};

/**
 * ============================================================================
 * AUTH MODEL
 * Creates and exports the MongoDB model
 * ============================================================================
 */
const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;