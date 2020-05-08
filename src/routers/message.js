const express = require('express')
const router = new express.Router
const Message = require('../models/message')
const User = require('../models/user')
const auth = require('../middlewere/auth')

// CREATE MESSAGE ITEM
router.post('/messages', auth, async (req, res) => {
    const message = new Message(req.body)
    try {
        const postedMessage = await message.save()
        res.status(201).send(postedMessage)

    } catch (e) {
        res.status(400).send(e)
    }
})

// GET MESSAGE 
router.get('/messages', auth, async (req, res) => {
    const from = req.query.from
    const to = req.query.to
    try {
        const messages = await Message.find( {
            $or : [
                { $and : [ { from : from }, { to : to   } ] },
                { $and : [ { from : to },   { to : from } ] }
            ]
        } ).limit( 500 )
        
        res.status(200).send(messages)

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
