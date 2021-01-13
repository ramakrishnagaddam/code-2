var mongoose = require('mongoose');
var Category = require('../model/Category.model');
var Volume = require('../model/Volume.model');
var Story = require('../model/Story.model');
var fs = require('fs');

let StoryController = {
    all: async(req, res) => {
        try {
            console.log('Getting all the Stories')
            let stories = await Story.find({}).populate("volume");
            res.status(201).json(stories);
        }catch(err) {
            console.log(err);
            res.status(500).json(err);   
        }
    },
    create: async(req, res) => {
        try { 
            console.log("Adding new Story");
            var storyObject = {
                "_id": new mongoose.Types.ObjectId(),
                "storyName": req.body.storyName,
                "storyDesc": req.body.storyDesc,
                "credits": req.body.credits,
		        "duration": req.body.duration,
                "storyURL": req.file.filename,
                "volume": req.body.volume
            }

            const volume = await Volume.findById(req.body.volume);

            if(volume !== null) {    
                var newStory = new Story(storyObject);
                await newStory.save();
                volume.stories.push(newStory);
                await volume.save();
                const volumes = await Volume.find({category: volume.category});
                const category = await Category.findById(volume.category);
                category.volume = volumes;
                await category.save();
                res.status(201).json(newStory);
            }
        } catch(err) {
	    console.log(err);
            res.status(500).json(err);
        }
    },
    update: async(req, res) => {
        try{
            console.log("Update the story");
            var file = fs.readFileSync(req.file.path);
            var encode_file = file.toString('base64');
            var storyObject = {
                "storyName": req.body.storyName,
                "storyDesc": req.body.storyDesc,
                "credits": req.body.credits,
                "duration": req.body.duration,
		        "storyURL": req.file.filename,
            }

            const volume = await Volume.findById(req.body.volume);

            console.log("Volume Data: ", volume);
            if(volume !== null) {
                await Story.findByIdAndUpdate(req.body._id, storyObject, {new: true});
                const stories = await Story.find({volume: req.body.volume});
                volume.stories = stories;
                console.log(stories);
                await volume.save();
                const volumes = await Volume.find({category: volume.category});
                const category = await Category.findById(volume.category);
                category.volume = volumes;
                await category.save();
                res.status(201).json(storyObject);
            }
        }catch(err) {
            res.status(500).json(err);
        }
    },
    upload: async(req, res) => {
        try { 
            console.log(req.file);
            res.status(201).json(req.file.filename);
        } catch(err) {
            res.status(500).json(err);
        }
    }
};

module.exports = StoryController;
