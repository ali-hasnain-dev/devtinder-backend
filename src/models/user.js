const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 20
    },
    lastName: {
        type: String,
        trim: true,
        min: 2,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
    },
    gender: {
        type: String
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

userSchema.statics.findByCredentials = async function (email, password) {
    const userData = await this.findOne({ email });

    if (!userData) {
        throw new Error('Invlaid login credentials');
    }
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
        throw new Error('Invlaid login credentials');
    }

    return userData;
}

userSchema.statics.getJWTToken = function (user) {

    return jwt.sign({ _id: user._id }, "devtinder@1234$");
}

module.exports = mongoose.model('User', userSchema);