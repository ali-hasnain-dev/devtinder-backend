const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { validateProfileEditData } = require('../utils/validation')
const userAuth = require('../middlewares/auth');
profileRouter.get('/', userAuth, async (req, res) => {
    res.send(req.user)
}).post('/update', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}).patch('/edit', userAuth, async (req, res) => {

    try {

        if (!validateProfileEditData(req)) {
            return res.status(400).send('Invalid data');
        }

        const loggedUser = req.user;
        const { firstName, lastName, age, gender, photoUrl, about, skills } = req.body;
        await User.updateOne({ _id: loggedUser._id }, { firstName, lastName, age, gender, photoUrl, about, skills });
        res.send("Profile updated successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = profileRouter