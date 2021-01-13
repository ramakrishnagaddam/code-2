var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Upcoming', Schema({
    _id: Schema.Types.ObjectId,
    upcoming_event: String,
    fromDate: Date,
    toDate: Date
}))

