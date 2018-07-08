'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new Schema({
        name: String,
        description: String,
        image: String
});

module.exports = mongoose.model('Artist', artistSchema);