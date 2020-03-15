const express = require('express')
const router = new express.Router
const Task = require('../models/task')
const User = require('../models/user')
const auth = require('../middlewere/auth')

// CREATE TASK
router.post('/tasks', auth, async (req, res) => {
    console.log(req.body)
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

// GET MY TASKS
router.get('/tasks/me/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const tasks = await Task.findTasksByGroup( req.params.id, false, [] )
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET LAB TASKS
router.get('/tasks/lab/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const tasks = await Task.findTasksByGroup( null, false, user.groups )
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET LAB REPORTS
router.get('/tasks/reports/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const tasks = await Task.findTasksByGroup( null, true, user.groups )
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE TASK
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const tasks = await Task.deleteOne({_id: req.params.id})
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router