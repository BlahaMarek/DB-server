const express = require('express')
const router = new express.Router
const Project = require('../models/project')

router.post('/projects', async (req, res) => {
    const project = new Project(req.body)

    try {
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router