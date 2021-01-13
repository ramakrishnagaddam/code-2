var mongoose = require('mongoose');
var Category = require('../model/Category.model');
var Volume = require('../model/Volume.model');

let VolumeController = {
    all: async(req, res) => {
        try {
            console.log('Getting all the Volumes')
            let volume = await Volume.find({}).populate("category stories");
            res.status(201).json(volume);
        }catch(err) {
            console.log(err);
            res.status(500).json(err);   
        }
    },
    create: async(req, res) => {
        try {    
            console.log("Adding new Volume");
            var volumeObject = {
                "_id": new mongoose.Types.ObjectId(),
                "volumeName": req.body.volumeName,
                "purchased": req.body.purchased,
                "currency": req.body.currency,
                "cost": req.body.cost,
                "credits": req.body.credits,
                "category": req.body.category
            }

            const category = await Category.findById(req.body.category);

            if(category !== null) {    
                var newVolume = new Volume(volumeObject);
                await newVolume.save();
                category.volume.push(newVolume);
                await category.save();
                res.status(201).json(newVolume);
            }
        } catch(err) {
            res.status(500).json(err);
        }
    },
    update: async(req, res) => {
        try{
            console.log("Update the volume");
            var volumeObject = {
                "volumeName": req.body.volumeName,
                "purchased": req.body.purchased,
                "currency": req.body.currency,
                "credits": req.body.credits,
                "cost": req.body.cost
            }

            const category = await Category.findById(req.body.category);

            console.log("Category Data ", category);
            if(category !== null) {
                await Volume.findByIdAndUpdate(req.body._id, volumeObject, {new: true});
                const volume = await Volume.find({category: req.body.category});
                category.volume = volume;
                console.log(volume);
                await category.save();
                res.status(201).json(volumeObject);
            }
        }catch(err) {
            res.status(500).json(err);
        }
    }
};

module.exports = VolumeController;
