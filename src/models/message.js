const mongoose = require('mongoose')
const validator = require('validator')

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    }
})

// Nastavenie casu a precitania pred ulozenim
messageSchema.pre('save', async function(next) {
    const message = this

    message.timestamp = new Date()
    message.read = false

    next() 
})
const Message = mongoose.model('Message', messageSchema)

module.exports = Message