const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected", "pending"],
            message: '{VALUE} is not supported'
        },
        default: 'pending',
        required: true
    }
}, {
    timestamps: true
})

connectionRequestSchema.index({ sender: 1, receiver: 1 })

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema)