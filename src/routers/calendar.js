const express = require('express')
const router = new express.Router
const Calendar = require('../models/calendar')
const User = require('../models/user')
const auth = require('../middlewere/auth')

// CREATE CALENDAR ITEM
router.post('/calendar', auth, async (req, res) => {
    const calendar = new Calendar(req.body)
    try {
        await calendar.save()
        res.status(201).send(calendar)

    } catch (e) {
        res.status(400).send(e)
    }
})

// GET CALENDAR 
router.get('/calendar/:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById({_id: id})
        const groups = user.groups.map(group => group.group)

        const calendarItems = await Calendar.find({group: {$in : groups}})

        console.log(calendarItems)

        res.status(200).send(calendarItems)

    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE CALENDAR 
router.delete('/calendar/:id', auth, async (req, res) => {
    const id = req.params.id
    
    try {
        const calendarItem = await Calendar.findByIdAndDelete({_id: id})
        res.status(200).send(calendarItem)

    } catch (e) {
        res.status(400).send(e)
    }
})

// UPDATE CALENDAR
router.patch('/calendar/date/', auth, async (req, res) => {
    const id = req.body.id
    
    try {
        const calendarItem = await Calendar.findById({_id: id})

        calendarItem.startDate = new Date()
        await calendarItem.save()
        
        res.status(200).send(calendarItem)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router
