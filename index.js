var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('file=>', file);
        cb(null, path.resolve('uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('uploads'));

var StoryController = require('./controller/Story.controller');
var VolumeController = require('./controller/Volume.controller');
var CategoryController = require('./controller/Category.controller');
var UserController = require('./controller/Users.controller');

const options = {
    user: 'dev-user',
    pass: 'Dev#2134',
    auth: {
      authdb: 'magic'
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 
};

const uri = "mongodb://127.0.0.1:27017/StoryTeller";

const port = 3000;

mongoose.connect(uri, options).then(
    ()=> {
        console.log('MongoDB Connected successfully!');
    },
    err => {
        console.log('Error : '+err);
    }
);

app.get('/category', CategoryController.all);
app.put('/category', upload.single('categoryImageURL'), CategoryController.create);
app.post('/category', upload.single('categoryImageURL'), CategoryController.update);
app.get('/category/refresh', CategoryController.refresh);
app.put('/upcoming', CategoryController.upcoming);
app.get('/upcoming', CategoryController.getAllUpcoming);

app.get('/volume', VolumeController.all);
app.put('/volume', VolumeController.create);
app.post('/volume', VolumeController.update);

app.get('/stories', StoryController.all);
app.put('/stories', upload.single('storyURL'), StoryController.create);
app.post('/stories', upload.single('storyURL'), StoryController.update);
app.put('/stories/upload', upload.single('storyURL'), StoryController.upload);

app.get('/users', UserController.all);
app.get('/user', UserController.id);
app.put('/user', UserController.create);
app.post('/user', UserController.update);
app.put('/user-purchase', UserController.purchase);

app.get('/', (req, res) => {
    res.send("Home Page");
});

app.listen(port, () => {
    console.log('App is running on port ', port);
});
