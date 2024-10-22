const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const connectionRequest = require('../models/connectionRequest');
const userAuth = require('../middlewares/auth');

userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        const requests = await connectionRequest.find({ receiver: req.user._id, status: 'interested' }).populate('sender',
            'firstName lastName photoUrl age about gender skills');
        res.json({ 'msg': 'Requests fetched successfully', 'data': requests });
    } catch (error) {
        res.status(400).send(error.message);
    }
}).get('/connections', userAuth, async (req, res) => {
    try {
        const connections = await connectionRequest.find({
            $or: [
                { receiver: req.user._id, status: 'accepted' },
                { sender: req.user._id, status: 'accepted' }
            ]
        }).populate('sender', 'firstName lastName photoUrl age about gender skills').populate('receiver', 'firstName lastName photoUrl age about gender skills');

        const data = connections.map((connection) => {
            if (connection.sender._id.toString() === req.user._id.toString()) {
                return connection.receiver
            }
            return connection.sender

        });

        res.json({ 'msg': 'Connections fetched successfully', 'data': data });
    } catch (error) {
        res.status(400).send(error.message);
    }
}).get('/feed', userAuth, async (req, res) => {
    try {
        const page = req.query.page ?? 1;
        let limit = req.query.limit ?? 10;
        limit = limit > 10 ? 10 : limit;
        const skip = (page - 1) * limit;
        const connections = await connectionRequest.find({
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id },
            ]
        }).select('sender receiver');

        const existsUserId = new Set();

        connections.forEach((user) => {
            existsUserId.add(user.receiver.toString());
            existsUserId.add(user.sender.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(existsUserId) }, },
                { _id: { $ne: req.user._id } }
            ]

        }).select('firstName lastName photoUrl age about gender skills').skip(skip).limit(limit);

        res.send(users);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = userRouter;