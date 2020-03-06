const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = new mongoose.Schema({
    desc: {
        type: String,
        require: true
    },
    done: {
        type: Boolean,
        require: true
    },
    personRef: {
        type: String,
        require: false
    },
    report: {
        type: Boolean,
        require: true
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task