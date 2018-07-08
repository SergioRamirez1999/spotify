'use strict'

var path = require('path');
var fs = require('fs');
var Artist = require('../models/artist');
var Album = require('../models/album')
var Song = require('../models/song');
//module necessary for pagination
var mongoosePagination = require('mongoose-pagination');


function saveArtist(req, res){
    let artist = new Artist();
    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    if(artist.name != null && artist.description != null){
        artist.save((err, artistStored) => {
            if(err)
                res.status(500).send({message: 'error when saving artist'});
            else {
                if(!artistStored)
                    res.status(404).send({message: 'the artist has not been registered'});
                else
                    res.status(200).send({artist: artist});
            }
        });
    }else{
        res.status(200).send({message: 'fill all the fields'});
    }

}

function findArtist(req, res){
    let artist_id = req.params.id;

    Artist.findById(artist_id, (err,artist) => {
        if(err)
            res.status(500).send({message: 'error when finding artist'});
        else {
            if(!artist)
                res.status(404).send({message: 'artist not found'});
            else
                res.status(200).send({artist: artist});
        }
    });
    
}

function getArtists(req,res){
    let page = req.query.page;
    let itemsPerPage = 5;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if(err){
            res.status(500).send({message: 'error when returning artists'});
        }else{
            if(!artists)
                res.status(404).send({message: 'artists not found'});
            else
                return res.status(200).send({
                    page: page,
                    total_items: total,
                    artists: artists
                });
        }
    });
}

function updateArtist(req, res){
    let artist_id = req.params.id;
    let update = req.body;

    Artist.findByIdAndUpdate(artist_id, update, (err, artistUpdated) => {
        if(err)
            res.status(500).send({message: 'error when updating artist'});
        else {
            if(!artistUpdated)
                res.status(404).send({message: 'the artist do not been updated'});
            else 
                res.status(200).send({artist_updated: artistUpdated});
        }
    });
}

function deleteArtist(req, res){
    let artist_id = req.params.id;

    Artist.findByIdAndRemove(artist_id, (err, artistRemoved) => {
        if(err)
            res.status(500).send({message: 'error when deleting artist'})
        else {
            if(!artistRemoved)
                res.status(404).send({message: 'the artist do not been deleted'})
            else {
                Album.find({artist: artist_id}).remove((err, albumRemoved) => {
                    if(err)
                        res.status(500).send({message: 'error when deleting album'});
                    else {
                        if(!albumRemoved)
                            res.status(404).send({message: 'the album do not been deleted'});
                        else {
                            Song.find({album: albumRemoved.id}).remove((err, songRemoved) => {
                                if(err)
                                    res.status(500).send({message: 'error when deleting song'});
                                else {
                                    if(!songRemoved)
                                        res.status(404).send({message: 'the song do not been deleted'});
                                    else 
                                        res.status(200).send({artist_removed: artistRemoved});

                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    let artist_id = req.params.id;
    let file_name = "null";

    if(req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('/');
        let file_name = file_split[2]

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artist_id, {image: file_name}, (err, artistUpdated) => {

                if(err)
                    res.status(500).send({message: 'error when update user image'});
                else 
                    if(!artistUpdated)
                        res.status(404).send({message: 'error when update artist image'})
                    else 
                        res.status(200).send({artist_updated: artistUpdated})
                    
            });

        }else {
            res.status(200).send({message: 'invalid extension'});
        }
            
    }else{
        res.status(200).send({message: 'you haven\'t upload any image'});
    }
}

function getImageFile(req,res){
    let name_image = req.params.imageFile;
    let path_image = './upload/artists/'+name_image;
    fs.exists(path_image, exists => {
        if(exists)
            res.sendFile(path.resolve(path_image));
        else
            res.status(404).send({message: 'image do not exists'});
    });
}

module.exports = {
    findArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}