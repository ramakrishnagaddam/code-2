var mongoose = require('mongoose');
var Category = require('../model/Category.model');
var Volume = require('../model/Volume.model');
var Story = require('../model/Story.model');
var Upcoming = require('../model/Upcoming.model');
var fs = require('fs');
var moment = require('moment');

let CategoryController = {
    all: async(req, res) => {
        try {
            console.log('Getting all the Categories')
            let category = await Category.find({}).sort({"_id": "descending"}).populate({path: "volume", populate: {
                path: "stories",
                model: "Story"
            }});
            res.status(201).json(category);
        }catch(err) {
            res.status(500).json(err);   
        }
    },
    create: async(req, res) => {
        try {    
            console.log(req.file);
            console.log("Adding new category");
            var categoryObject = {
                "_id": new mongoose.Types.ObjectId(),
                "categoryName": req.body.categoryName,
                "categoryImageURL": req.file.filename,
                "categoryDesc": req.body.categoryDesc,
		"subtitle": req.body.subtitle
            }
            var newCategory = new Category(categoryObject);
            await newCategory.save();
            res.status(201).json(newCategory);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    update: async(req, res) => {
        try{
            console.log("Adding new category");
            console.log(req.body);
            var categoryObject = {
                "categoryName": req.body.categoryName,
                "categoryImageURL": req.file.filename,
                "categoryDesc": req.body.categoryDesc,
		"subtitle": req.body.subtitle
            }
            await Category.findByIdAndUpdate(req.body._id, categoryObject, {new: true});
            res.status(200).json(req.body);
        }catch(err) {
            res.status(500).json(err);
        }
    },

    refresh: async(req, res) => {
        try{
            console.log("Refreshing the Categories with new data");
            let category = await Category.find({}).populate({path: "volume"}); 
           
            for (let i = 0; i < category.length; i++) {		
		        let volumes = [];
                let volumeLst = category[i].volume;
		        category[i].volume = [];
                for (let j = 0; j < volumeLst.length; j++) { 
                    let stories = [];
		            let volumeData = await Volume.findById(volumeLst[j]._id);
    		        volumeData.stories = [];
		            let storyLst = volumeLst[j].stories;
		            for (let k = 0; k < storyLst.length; k++) { 
                        let storyData = await Story.findById(storyLst[k]); 
			            volumeData.stories.push(storyData);
                    } 
		            volumeData.save();
		            category[i].volume.push(volumeData);
		        }
                category[i].save();
            }
            res.status(200).json(category);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    upcoming: async(req, res) => {
        try{
            console.log("Adding new Event");
            var upcomingObject = {
                "_id": new mongoose.Types.ObjectId(),
		"upcoming_event": req.body.upcoming_event,
                "fromDate": moment(req.body.fromDate).format("MM/DD/YYYY"),
	 	"toDate": moment(req.body.toDate).format("MM/DD/YYYY")
            }
            var upcoming = new Upcoming(upcomingObject);
            await upcoming.save();
            res.status(200).json(upcoming);
        }catch(err) {
            console.log(err);
	    res.status(500).json(err);
        }
    },
    getAllUpcoming: async(req, res) => {
        try{
            let upcoming = await Upcoming.find({ 
		   $or: [{ "fromDate": { $gte: moment(new Date()).format("MM/DD/YYYY") }},
                    	 { "toDate": { $gte: moment(new Date()).format("MM/DD/YYYY")} }]
		});
            res.status(200).json(upcoming);
        }catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};

module.exports = CategoryController;
