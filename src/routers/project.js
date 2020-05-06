const express = require('express')
const router = new express.Router
const Project = require('../models/project')
const Calibration = require('../models/calibration')
const auth = require('../middlewere/auth')
const regression = require('regression')


// POST PROJECT
router.post('/projects',auth, async (req, res) => {
    const project = new Project(req.body)

    try {
        await project.save()
        res.status(201).send(project)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET PROJECTS 
router.get('/projects', auth, async (req, res) => {
    try {
        const myStringGroups = req.user.groups.map(group => group.group)
        const projects = await Project.findMyProjects(myStringGroups)
        res.status(200).send(projects)

    } catch (e) {
        res.status(400).send(e)
    }
})

// GET PROJECT DIVIDED TO DAYS BY ID
router.get('/projects/:id', auth, async (req, res) => {
    const id = req.params.id
    
    try {
        const projectDays = await Project.findById({_id: id})
        res.status(200).send(projectDays)

    } catch (e) {
        res.status(400).send(e)
    }
})

// ADD DATE TO PROJECT
router.post('/projects/newdate/:id/', auth, async (req, res) => {
    const id = req.params.id
    const date = req.body.date

    try {
        const project = await Project.findById({_id: id})
        const newProject = await project.addDateToProject(date)

        res.status(200).send(newProject)

    } catch (e) {
        res.status(400).send(e)
    }
})
// POST comment to  PROJECT BY ID
router.post('/projects/:id/comment', auth, async (req, res) => {
    const id = req.params.id
    const comment = req.body.comment
    const date = req.body.date

    try {
        const project = await Project.findById({_id: id})
        const newProject = await project.addToDescription(comment, date)
    
        res.status(200).send(newProject)

    } catch (e) {
        res.status(400).send(e)
    }
})

// POST experiemnt to PROJECT BY ID
router.post('/projects/:id/experiment', auth, async (req, res) => {
    const id = req.params.id
    const experiment = req.body.experiment
    const date = req.body.date

    try {
        const project = await Project.findById({_id: id})
        const newProject = await project.addToExperiment(experiment, date)
    
        res.status(200).send(newProject)

    } catch (e) {
        res.status(400).send(e)
    }
})

// CALCULATE CALIBRATION
router.post('/projects/regression', auth, async (req, res) => {
    const data = req.body
    try {
        const result = regression.linear(data, {order: 2, precision: 4})
        res.status(200).send(result)

    } catch (e) {
        res.status(400).send(e)
    }
})

// POST CALIBRATION
router.post('/calibrations', auth, async (req, res) => {
    try {
        const calibration = new Calibration(req.body)
        const newCalibration = await calibration.save();
        res.status(200).send(newCalibration)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/calibrations', auth, async (req, res) => {
    try {
        const calibrations = await Calibration.find({})
        const sorted = calibrations.sort((function(a,b) {return b.date - a.date}))

        res.status(200).send(sorted)

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/calibrations/:name', auth, async (req, res) => {
    try {
        const name = req.params.name
        const calibrations = await Calibration.find({name})

        res.status(200).send(calibrations)

    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router