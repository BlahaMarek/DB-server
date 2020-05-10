const mongoose = require('mongoose')
const validator = require('validator')
const regression = require('regression')

const projectContentSchema = new mongoose.Schema({
    desc: [{
        date: {
            type: Date,
            required: true
        },
        person: {
            type: String,
            required: true
        },
        comentBody: {
            type: String,
            required: true
        },
    }],
    photos: [{
        photo: {
            type: String,
        },
    }],
    experiments: [{
        person: {
            type: String,
        },
        desc: {
            type: String,
        },
        calibration: {
            type: String,
        },
        data: [{
            x: {
                type: Number,
            },
            y: {
                type: Number,
            },
            z: {
                type: Number,
            }
        }],
        func: {
            type: String,
        },
        r: {
            type: Number,
        },
        activity: {
            type: Number,
        }
    }]
})

const projectSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    workDates: {
        type: Map,
        of: projectContentSchema
    },
})

projectSchema.methods.addToDescription = async function(comment, date) {
    const project = this

    project.workDates.get(date).desc = project.workDates.get(date).desc.concat(comment)

    await project.save()
    
    return project
}


projectSchema.methods.addToExperiment = async function(experiment, date) {
    const project = this

    project.workDates.get(date).experiments = project.workDates.get(date).experiments.concat(experiment)

    await project.save()
    
    return project
}

projectSchema.methods.addToPhotos = async function(photo, date) {
    const project = this
    console.log("###########")
    project.workDates.get(date).photos = project.workDates.get(date).photos.concat({photo})
    console.log("###########")

    await project.save()
    
    return project
}

projectSchema.methods.addDateToProject = async function(date) {
    let project = this
    if (!project.workDates) {
        project.set('workDates', {})
    }

    const datesArray = Array.from(project.workDates.keys())
    if (datesArray.includes(date)) {
        return project
    }

    let obj = {
        desc : [],
        experiments : []
    }

    project.workDates.set(date, obj)
    await project.save()
    
    return project
}

projectSchema.methods.countLinearRegression = async function(date, data) {
    const project = this
    const experiments = project.workDates.get(date).experiments

    const result = regression.linear(data)
    console.log(result.string) 

    await project.save()
    
    return project
}

projectSchema.statics.findMyProjects = async (myGroups) => {
    // const slaves = await User.find({ "groups.group" :  {$in : groups},  "roles.role" : "ROLE_STUDENT"})
    const projects = await Project.find({"group": {$in : myGroups}})
    return projects;
}




const Project = mongoose.model('Project', projectSchema)
module.exports = Project