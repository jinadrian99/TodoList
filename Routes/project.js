const express = require('express');
const mongoose = require('mongoose');
const person = require('../Models/person');
const project = require('../Models/project');
const task = require('../Models/task');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await project.find();
        console.log(projects);
        return res.send(projects);
    } catch (error) {
        return res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const obj = await project.findById(mongoose.Types.ObjectId(req.params.id));
        return res.send(obj);
    } catch (error) {
        return res.send("Not found");
    }
})

router.post('/', async (req, res) => {
    try {
        var dataProject = req.body;
        dataProject.persons = JSON.parse(dataProject.persons);
        const objProject = await new project(dataProject).save();
        // console.log(objProject);
        
        req.body.persons.map(async item => {
            try {
                var dataPerson = {_id: mongoose.Types.ObjectId(item)};
                var objPerson = await person.findById(dataPerson._id);
                dataPerson.projects = objPerson.projects || [];
                dataPerson.projects.push(objProject._id);
                objPerson = await person.findByIdAndUpdate(dataPerson._id, dataPerson);
            } catch (error) {
                console.error(error);
            }
        })
        
        return res.send(objProject);
    } catch (error) {
        return res.send(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        var _idProject = mongoose.Types.ObjectId(req.params.id);
        var dataProject = req.body;
        dataProject.persons = JSON.parse(dataProject.persons);

        var objProject = await project.findOne({_id: _idProject});
        objProject.tasks.map(async itemTask => {
            objProject.persons.map(async item => {
                if(!dataProject.persons.includes(item)){
                    try {
                        var dataPerson = {_id: mongoose.Types.ObjectId(item)}
                        var objPerson = await person.findOne({_id: dataPerson._id});
                        dataPerson.tasks = objPerson.tasks.filter(x => x + "" != itemTask + "");
        
                        objPerson = await person.findOneAndUpdate({_id: dataPerson._id}, dataPerson);
                    } catch (error) {}
                }
            })
        })

        objProject = await project.findOneAndUpdate({_id: _idProject}, dataProject);
        req.body.persons.map(async item => {
            try {
                var dataPerson = {_id: mongoose.Types.ObjectId(item)};
                var objPerson = await person.findById(dataPerson._id);
                dataPerson.projects = objPerson.projects || [];

                if(!dataPerson.projects.includes(_idProject)){
                    dataPerson.projects.push(_idProject);
                    objPerson = await person.findByIdAndUpdate(dataPerson._id, dataPerson);
                }
            } catch (error) {
                console.error(error);
            }
        })
        
        return res.send(objProject);
    } catch (error) {
        return res.send(error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        var _idProject = mongoose.Types.ObjectId(req.params.id);
        var objProject = await project.findOne({_id: _idProject});

        objProject.persons.map(async item => {
            try {
                var dataPerson = {_id: mongoose.Types.ObjectId(item)}
                var objPerson = await person.findOne({_id: dataPerson._id});
                dataPerson.projects = objPerson.projects.filter(x => x + "" != req.params.id);

                objPerson = await person.findOneAndUpdate({_id: dataPerson._id}, dataPerson);
            } catch (error) {}
        })

        objProject.tasks.map(async itemTask => {
            objProject.persons.map(async item => {
                try {
                    var dataPerson = {_id: mongoose.Types.ObjectId(item)}
                    var objPerson = await person.findOne({_id: dataPerson._id});
                    dataPerson.tasks = objPerson.tasks.filter(x => x + "" != itemTask + "");
    
                    objPerson = await person.findOneAndUpdate({_id: dataPerson._id}, dataPerson);
                } catch (error) {}
            })
        })

        objProject.tasks.map(async itemTask => {
            try {
                var objTask = await task.findOneAndDelete({_id: mongoose.Types.ObjectId(itemTask)});
            } catch (error) {}
        })        
        objProject = await project.findOneAndDelete({_id: _idProject})
        return res.send("Remove successful");
    } catch (error) {
        console.log(error);
        return req.status(404).json("Not found");
    }
})

module.exports = router;
