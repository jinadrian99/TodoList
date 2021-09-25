const express = require('express');
const mongoose = require('mongoose');
const person = require('../Models/person');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const persons = await person.find();
        // console.log(persons);
        return res.send(persons);
    } catch (error) {
        return res.send(error);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const obj = await person.findOne({"_id":  mongoose.Types.ObjectId(req.params.id)});
        return res.send(obj);
    } catch (error) {
        return res.send("Not found");
    }
})

router.post('/', async (req, res) => {
    try {
        const obj = await new person(req.body).save();
        return res.send(obj);
    } catch (error) {
        return res.send(error);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const obj = await person.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.params.id)},
            req.body
        )
        return res.send(obj);
    } catch (error) {
        return res.send(error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const obj = await person.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id));
        return res.send(obj);
    } catch (error) {
        return res.send(error);
    }
})

module.exports = router;