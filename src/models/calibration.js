const mongoose = require('mongoose')
const validator = require('validator')


const calibrationSchema = new mongoose.Schema({
    a: {
        type: Number,
        require: true
    },
    b: {
        type: Number,
        require: true
    },
    r: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    date: {
        type: Date
    },
    data: [{
        x: {
            type: String,
        },
        y: {
            type: String,
        }
    }]
})

calibrationSchema.pre('save', async function(next) {
    const calibration = this

    calibration.date = new Date()

    next()  //next pusti funkciu dalej, bez nej by request nikdy neskoncil
})

const Calibration = mongoose.model('Calibration', calibrationSchema)

module.exports = Calibration