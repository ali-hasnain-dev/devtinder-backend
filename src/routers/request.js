const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
requestRouter.post('/send', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
module.exports = requestRouter