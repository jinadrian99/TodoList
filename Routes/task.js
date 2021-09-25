const express = require('express');
const mongoose = require('mongoose');
const person = require('../Models/person');
const project = require('../Models/project');
const task = require('../Models/task');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tasks = await task.find();
        console.log(tasks);
        return res.send(tasks);
    } catch (error) {
        return res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const obj = await task.findById(mongoose.Types.ObjectId(req.params.id));
        return res.send(obj);
    } catch (error) {
        return res.status(404).json("Not Found");
    }
})

router.post('/', async (req, res) => {
    try {
        var dataTask = req.body;
        const objTask = await new task(dataTask).save();

        var idPerson = mongoose.Types.ObjectId(req.body.idPerson);
        var idProject = mongoose.Types.ObjectId(req.body.idProject);

        try {
            var objPerson = await person.findOne({_id: idPerson});
            let dataTasks = objPerson.tasks;
            dataTasks.push(objTask._id);
            objPerson = await person.findOneAndUpdate({_id: idPerson}, {tasks: dataTasks});
        } catch (error) {}

        try {
            var objProject = await project.findOne({_id: idProject});
            let dataTasks =  objProject.tasks || [];
            dataTasks.push(objTask._id);
            objProject = await project.findOneAndUpdate({_id: idProject}, {tasks: dataTasks});
        } catch (error) {}

        return res.send(objTask);
    } catch (error) {
        return res.send(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        var idTask = mongoose.Types.ObjectId(req.params.id);
        var newIdPerson = mongoose.Types.ObjectId(req.body.idPerson);
        var dataTask = req.body;
        
        var oldObjPerson = await person.findOne({"tasks": idTask});
        if(newIdPerson != oldObjPerson._id){
            try {
                var dataTasks = oldObjPerson.tasks;
                dataTasks = dataTasks.filter(x => x + "" != idTask + "");
                oldObjPerson = await person.findOneAndUpdate({_id: oldObjPerson._id}, {tasks: dataTasks});

                var newObjPerson = await person.findOne({_id: newIdPerson});
                dataTasks = newObjPerson.tasks || [];
                dataTasks.push(idTask);
                newObjPerson = await person.findOneAndUpdate({_id: newIdPerson}, {tasks: dataTasks});
            } catch (error) {}
        }

        var objTask = await task.findOneAndUpdate({_id: idTask}, dataTask);
        return res.send(objTask);
    } catch (error) {
        return res.send(error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        var idTask = mongoose.Types.ObjectId(req.params.id);
        var dataTasks = [];
        try {
            var objPerson = await person.findOne({"tasks": idTask});
            dataTasks = objPerson.tasks.filter(x => x + "" != idTask + "");
            objPerson = await person.findOneAndUpdate({_id: objPerson._id}, {tasks: dataTasks});

            var objProject = await project.findOne({"tasks": idTask});
            dataTasks = objProject.tasks.filter(x => x + "" != idTask + "");
            objProject = await project.findOneAndUpdate({_id: objProject._id}, {tasks: dataTasks});
        } catch (error) {}

        var objTask = await task.findOneAndDelete({_id: idTask});
        return res.send("Remove successful");
    } catch (error) {
        return res.send(error);
    }
})

module.exports = router;
