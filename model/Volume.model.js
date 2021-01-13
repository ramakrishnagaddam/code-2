var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Volume', Schema({
    _id: Schema.Types.ObjectId,
    volumeName: String,
    currency: String,
    cost: Number,
    stories: [{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    category: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}))

