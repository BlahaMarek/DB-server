const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = new mongoose.Schema({
    desc: {
        type: String,
        require: true
    },
    done: {
        type: Boolean,
        require: true
    },
    personRef: {
        type: String,
        require: false
    },
    report: {
        type: Boolean,
        require: true
    },
    group: {
        type: String,
        require: true
    }
})

taskSchema.statics.findTasksByGroup = async (personRef, report, groups) => {
    const tasks = await Task.find({personRef, report})
    if (!tasks) {
        return []
    }

    if (report && groups.length > 0) {
        return tasks
    }

    if (groups.length == 0) {
        return tasks.filter(item => item.personRef != null)
    }

    return tasks.filter(item => groups.map(item => item.group).includes(item.group))
}
const Task = mongoose.model('Task', taskSchema)

module.exports = Task