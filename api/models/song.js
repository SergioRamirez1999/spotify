'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
        number: String,
        name: String,
        duration: String,
        file: String,
        //Habra una 'foreign key' al artista. Relacion one to many (album-song)
        album: { type: Schema.ObjectId, ref: 'Album'}

});

module.exports = mongoose.model('Song', songSchema);