const mongoose = require('mongoose')
const validator = require('validator')

const Project = mongoose.model('Project', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
})

module.exports = Project