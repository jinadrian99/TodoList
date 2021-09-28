const express = require('express');
const mongoose = require('mongoose');
const person = require('../Models/person');
const router = express.Router();

router.post('/sign-in/', async (req, res) => {
    // try {
    //     var email = req.body.email;
    //     var password = req.body.password;

    //     const objPerson = await person.findOne({ "email": req.body.email });
    //     return res.send(objPerson);
    // } catch (error) {
    //     return res.send("Fail");
    // }
    try {
        const obj = await person.findOne({ "email": req.body.email, "password": req.body.password });
        return res.send(obj ? obj : "Fail");
    } catch (error) {
        return res.send("Fail");
    }
})

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
        //Whare mà không phải id -> tìm ko thấy sẽ ko có obj, nếu là id -> tìm ko thấy sẽ vào try catch
        const obj = await person.findOne({ "email": req.body.email });
        if(obj) {
            return res.send("Exist");
        } else {
            // return res.send("Make");
            try {
                const obj = await new person(req.body).save();
                return res.send(obj);
            } catch (error) {
                return res.send(error);
            }
        }
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