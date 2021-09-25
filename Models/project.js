const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: false,
        default: 'No description'
    },
    important: {
        type: Boolean,
        require: false,
        default: false
    },
    issues: {
        type: Date,
        require: false,
        default: new Date()
    },
    deadline: {
        type: Date,
        require: true
    },
    password: {
        type: String,
        require: false,
        default: 'non'
    },
    persons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "person"
        }
    ],
    tasks: [    
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "task"
        }
    ]
}, {
    collection: "projects",
    versionKey: false
})

module.exports = mongoose.model("project", projectSchema);