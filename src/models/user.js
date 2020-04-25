const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../emails/account')
const { getRandomInt } = require('../functions/math')


const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
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
    },
    roles: [{
        role: {
            type: String,
            required: true
        },
    }],
    groups: [{
        group: {
            type: String,
        },
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, 'tokengenerator')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.addRoleAndSave = async function(role) {
    const user = this

    user.roles = user.roles.concat({ role })

    await user.save()
    return user
}

userSchema.methods.addGroupAndSave = async function(group) {
    const user = this

    console.log(user.groups)

    user.groups = user.groups.concat({ group })

    console.log(user.groups)

    await user.save()
    return user
}

userSchema.methods.deleteGroupAndSave = async function(group) {
    const user = this

    user.groups = user.groups.filter(singleGroup => singleGroup.group != group)

    await user.save()
    return user
}

userSchema.methods.generatePassword = async function() {
    const user = this
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()'
    let password = ''

    for (let index = 0; index < 8; index++) {
        password += chars[getRandomInt(chars.length)];
    }

    user.password = password
    user.tokens = []
    user.token = null

    const text = `Vážený ${user.login}, Vaše nové heslo je : ${password} . Z hľadiska bezpečnosti prosíme o jeho zmenenie po prihlásení. V prípade otázok, reportov chýb alebo podnetov na zlepšenie nás kontaktujte na e-mail: laboratoria@gmail.com`
    const html = `<h1>Vážený ${user.login},</h1> <p>Vaše nové heslo je : <b>${password}</b> </p> <p>Z hľadiska bezpečnosti prosíme o jeho zmenenie po prihlásení.</p><p>V prípade otázok, reportov chýb alebo podnetov na zlepšenie nás kontaktujte na e-mail: laboratorio@gmail.com</p> <p>Ďakujeme</p>`

    sendEmail(user.email, 'Reset hesla', text, html)

    await user.save()
    return user
}

// mnou vytvorene metody na spracovavanie userov z DB
userSchema.statics.findByCredentials = async (login, password) => {
    const user = await User.findOne({login})
    if (!user) {
        throw new Error('Zadany uzivatel sa nenasiel')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Zadane heslo je nespravne')
    }

    return user;
}

userSchema.statics.findSlaves = async (groups) => {
    // const slaves = await User.find({ "groups.group" :  {$in : groups},  "roles.role" : "ROLE_STUDENT"})
    const slaves = await User.find({"roles.role" : "ROLE_STUDENT"})

    return slaves;
}

// pre hashovanie hesla pred ulozenim
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()  //next pusti funkciu dalej, bez nej by request nikdy neskoncil
})

const User = mongoose.model('User', userSchema)

module.exports = User