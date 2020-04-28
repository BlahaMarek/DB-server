const mongoose = require('mongoose')
const validator = require('validator')

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
    experiments: [{
        person: {
            type: String,
            required: true
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


projectSchema.methods.addDateToProject = async function(date) {
    let project = this
    if (!project.workDates) {
        console.log("tu")
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
    console.log(project.workDates)
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