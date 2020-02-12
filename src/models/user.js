const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'Zadane heslo je prilis kratke'],
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: props => `${props.value} nie je spravny email`
        }

    },
    age: {
        type: Number,
        validate: {
            validator: value => value > 0,
            message: props => `${props.value} nie je spravny vek`
        },
    }
})

module.exports = User