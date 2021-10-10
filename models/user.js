const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxLength: 32
    },
    hashed_password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        maxLength: 32
    },
    about: {
        type: String,
        maxLength: 1000
    },
    salt: String,
    access: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }

}, {timestamps: true});


// Virtual fields
userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    })

userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);