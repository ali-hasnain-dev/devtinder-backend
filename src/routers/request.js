const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const userAuth = require('../middlewares/auth');
const User = require('../models/user');
const mongoose = require('mongoose');
const requestRouter = express.Router();


requestRouter.post('/send/:status/:receiver', userAuth, async (req, res) => {

    try {
        const allowedStatus = ['interested', 'rejected'];
        if (!allowedStatus.includes(req.params.status)) {
            return res.status(422).send('Invalid status');
        }

        const toUserId = req.params.receiver;

        if (req.user._id.toString() === toUserId) {
            return res.status(400).json({ 'msg': 'Cannot send request to yourself' });
        }

        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ 'msg': 'Invalid User ID' });
        }

        const toReceiver = await User.findById(toUserId);
        console.log(toReceiver);

        if (!toReceiver) {
            return res.status(400).json({ 'msg': 'Receiver not found' });
        }

        const alreadyExists = await ConnectionRequest.findOne({
            $or: [
                { sender: req.user._id, receiver: req.params.receiver },
                { sender: req.params.receiver, receiver: req.user._id }]
        });

        if (alreadyExists) {
            return res.status(400).json({ 'msg': 'Request already sent' });
        }

        const connectionRequest = new ConnectionRequest({
            sender: req.user._id,
            receiver: req.params.receiver,
            status: req.params.status
        });

        const data = await connectionRequest.save();
        res.json({ "msg": "Request sent successfully", "data": connectionRequest });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = requestRouter