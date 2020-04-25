const mongoose = require('mongoose')
const validator = require('validator')

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
})

projectSchema.methods.addToDescription = async function(comment) {
    const project = this

    project.desc = project.desc.concat(comment)

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