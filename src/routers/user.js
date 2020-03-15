const express = require('express')
const router = new express.Router
const User = require('../models/user')
const auth = require('../middlewere/auth')

// CREATE USER
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(req.body)
    console.log("registruj")
    try {
        await user.addRoleAndSave('ROLE_STUDENT')
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// LOGIN USER
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.login, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})    
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

// LOGOUT USER
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// RESET USER PASSWORD
router.post('/users/reset', async (req, res) => {
    try {
        const oldUser = await User.findOne({login: req.body.login})
        const newUser = oldUser.generatePassword()
        console.log(newUser)
        res.send(req.newUser)
    } catch (e) {
        res.status(500).send()
    }
})

// DELETE ALL TOKENS FROM USER
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// GET ALL USERS
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

//GET USER BY ID
router.get('/users/:id',auth, async (req, res) => {
    const _id = req.params.id
    const user = await User.findById(_id)

    try {
        if (!user) { res.status(404).send() }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// UPDATE USER
router.patch('/users/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password', 'email']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate) {
        return res.status(400).send({error : 'Nevhodne parametre na update'})
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        if (!user) { res.status(404).send() }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router