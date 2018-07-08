'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var albumSchema = new Schema({
        title: String,
        description: String,
        year: Number,
        image: String,
        //Habra una 'foreign key' al artista. Relacion one to many (artist-album)
        artist: { type: Schema.ObjectId, ref: 'Artist'}
});

module.exports = mongoose.model('Album', albumSchema);