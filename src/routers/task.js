const express = require('express')
const router = new express.Router
const Task = require('../models/task')
const auth = require('../middlewere/auth')

// CREATE TASK
router.post('/tasks', auth, async (req, res) => {
    const task = new Task(req.body)
    console.log(task)
    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

// GET MY TASKS
router.get('/tasks/me', auth, async (req, res) => {
    try {
        const tasks = await Task.find({personRef: req.body.personRef})
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET LAB TASKS
router.get('/tasks/lab', auth, async (req, res) => {
    try {
        const tasks = await Task.find({personRef: "", report: false})
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET LAB REPORTS
router.get('/tasks/reports', auth, async (req, res) => {
    try {
        const tasks = await Task.find({personRef: "", report: true})
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

// DELETE TASK
router.delete('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.deleteOne({_id: req.body.taskId})
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router