const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');
const { validateSignup } = require('../utils/validation')
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {

    try {
        if (!validateSignup(req)) {
            return res.status(400).send('Invalid data');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}).post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await User.getJWTToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.json({ 'message': 'Login successfully', "data": user });
    } catch (error) {
        res.status(400).send(error.message);
    }
}).post('/logout', userAuth, async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()) });
    res.json({ 'message': 'Logged out successfully', "status": "200" });
})

module.exports = authRouter