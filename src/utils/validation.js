const validator = require('validator');

const validateSignup = async (data) => {
    const allowedFields = ['email', 'firstName', 'lastName', 'password'];
    const fields = Object.keys(data.body);
    for (let i = 0; i < fields.length; i++) {
        if (!allowedFields.includes(fields[i])) {
            return false;
        }
    }

    if (!validator.isEmail(data.body.email)) {
        return false;
    }

    if (!validator.isEmpty(data.body.firstName)) {
        return false;
    }

    if (!validator.isLength(data.body.firstName, { min: 2, max: 20 })) {
        return false;
    }

    if (!validator.isEmpty(data.body.lastName)) {
        return false;
    }

    if (!validator.isStrongPassword(data.body.password)) {
        return false;
    }

    return true;
}

const validateProfileEditData = async (data) => {
    const allowedFields = ['email', 'firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    const fields = Object.keys(data.body);
    for (let i = 0; i < fields.length; i++) {
        if (!allowedFields.includes(fields[i])) {
            return false;
        }
    }

    const { email, firstName, lastName, age, gender, photoUrl, about, skills } = data.body;
    if (!email || !firstName || !lastName || !age || !gender || !photoUrl || !about || !skills) {
        return false;
    }

    if (!validator.isEmail(email)) {
        return false;
    }

    if (!validator.isAlpha(firstName)) {
        return false;
    }

    if (!validator.isAlpha(lastName)) {
        return false;
    }

    if (!validator.isNumeric(age)) {
        return false;
    }

    if (!validator.isAlpha(gender)) {
        return false;
    }

    if (!validator.isURL(photoUrl)) {
        return false;
    }

    if (!validator.isAlpha(about)) {
        return false;
    }

    if (!validator.isAlpha(skills)) {
        return false;
    }

    return true;
}

module.exports = {
    validateSignup,
    validateProfileEditData
}