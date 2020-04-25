const mongoose = require('mongoose')
const validator = require('validator')

const calendarSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    micro: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    period: {
        type: Number,
        required: true
    },
    badge: {
        type: String,
    },
    group: {
        type: String,
        required: true
    },
})

// Nastavenie clasy ok-warn-danger pred ulozenim
calendarSchema.pre('save', async function(next) {
    const calendar = this

    if (calendar.badge.length > 0) {
        next()        
    }
    const diffTime = Math.abs(new Date() - new Date(calendar.startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (calendar.period - diffDays >= 7) {
        calendar.badge = "calendar-ok"
    } else if (calendar.period - diffDays > 2 && calendar.period - diffDays < 7) {
        calendar.badge = "calendar-warn"
    } else {
        calendar.badge = "calendar-danger"
    }
    next() 
})
const Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar