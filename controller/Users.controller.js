var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var Users = require('../model/User.model');
var Volume = require('../model/Volume.model');

let UsersController = {
    all: async(req, res) => {
        try {
            console.log('Getting all the Users')
            let users = await Users.find({});
            res.status(201).json(users);
        }catch(err) {
            res.status(500).json(err);   
        }
    },
    id: async(req, res) => {
        try {
            let user = await Users.find({emailID: req.header('emailID')});
	    let subscription = false;
	    if(user.toDate === null) {
	    	const expireDate = dateFormat(user.toDate, "yyyy-mm-dd");
            	const currentDate = dateFormat(new Date(), "yyyy-mm-dd");
	    	if( currentDate > expireDate ) {
      		    subscription = false;
	    	} else {
		    subscription = true;
	    	}
	    } else {
		subscription = false;
  	    }
 	    var userObject = {
		"_id": user._id,
		"emailID": user.emailID,
		"subscription": subscription
	    }; 
            res.status(201).json(userObject);
        } catch(err) {
            res.status(500).json(err); 
        }
    },
    create: async(req, res) => {
        try {    
            console.log("Adding new user");
            var userObject = {
                "_id": new mongoose.Types.ObjectId(),
                "emailID": req.body.emailID,
                "credits": 0
            }
     	    let user = await Users.find({emailID: req.body.emailID});
            if(user.length === 0) {
	    	var newUser = new Users(userObject);
            	await newUser.save();
            	res.status(201).json(newUser);
	    } else {
		res.status(400).json({ "message": "User Already exists" });
	    }
        } catch(err) {
            res.status(500).json(err);
        }
    },
    update: async (req, res) => {
        try{
            let user = await Users.find({emailID: req.body.emailID});
            var userObject = {
                "emailID": user[0].emailID,
                "credits": req.body.credits
            };
            console.log(user[0]);
            await Users.findByIdAndUpdate(user[0]._id, userObject, {new: true});
            res.status(201).json({message: "user update"});
        } catch(err) {
            res.status(400).json(err);
        }
    },
    purchase: async(req, res) => {
        try{
            let user = await Users.find({emailID: req.body.emailID});
            console.log(user[0]);
            const subscription = req.body.subscription;
            let fromDate = new Date();
	    let toDate = new Date();
	    if(subscription.toLowerCase() === "weekly") {
		toDate.setDate(toDate.getDate() + 7);
	    } else if(subscription.toLowerCase() === "monthly") {
		toDate.setDate(toDate.getDate() + 31);
	    } else if(subscription.toLowerCase() === "yearly") {
		toDate.setDate(toDate.getDate() + 365);
	    } else {
		fromDate = null;
		toDate = null;
	    }
	    user[0].fromDate = fromDate;
	    user[0].toDate = toDate;	       
	    await user[0].save();
            let userData = await Users.find({emailID: req.body.emailID});
	    res.status(200).json(userData);             
        }catch(err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};

module.exports = UsersController;
