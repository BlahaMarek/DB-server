const express = require('express')
const router = new express.Router
const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    const user = await User.findById(_id)

    try {
        if (!user) { res.status(404).send() }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password', 'email']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({error : 'Nevhodne parametre na update'})
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
        if (!user) { res.status(404).send() }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router