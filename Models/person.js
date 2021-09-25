const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: String,
    email: String,
    password: {
        type: String,
        default: "non"
    },
    active: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/porfolio-hiraadrian.appspot.com/o/local%2FAvatar_03.png?alt=media&token=ebf76a85-3409-4f94-83cb-cf28763ac01c"
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project"
        }
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "task"
        }
    ]
}, {
    collection: "persons",
    versionKey: false
})

module.exports = mongoose.model("person", personSchema);