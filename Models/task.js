const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    deadline: {
        type: Date,
        require: false,
        default: null
    },
    important: {
        type: Boolean,
        require: false,
        default: false
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    },
    progress: {
        type: String,
        require: false,
        default: "Prepare"
    },
}, {
    collection: "tasks",
    versionKey: false
})

module.exports = mongoose.model("task", taskSchema);