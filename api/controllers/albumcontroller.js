'use strict'

var path = require('path');
var fs = require('fs');
var Album = require('../models/album')
var Song = require('../models/song');
//module necessary for pagination
var mongoosePagination = require('mongoose-pagination');

function saveAlbum(req, res) {
    let params = req.body;
    let album = new Album();
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.artist = params.id;
    album.image = 'null';

    if (album.title != null && album.description != null && album.year != null && album.artist != null) {
        album.save((err, albumStored) => {
            if (err)
                res.status(500).send({ message: 'error when saving album' });
            else {
                if (!albumStored)
                    res.status(404).send({ message: 'the artist has not been registered' });
                else
                    res.status(200).send({ album_stored: albumStored });
            }
        });
    } else {
        res.status(200).send({ message: 'fill all the field' });
    }
}

function deleteAlbum(req, res) {
    let album_id = req.params.id;

    Album.findByIdAndRemove(album_id, (err, albumRemoved) => {
        if (err)
            res.status(500).send({ message: 'error when deleting album' });
        else {
            if (!albumRemoved)
                res.status(404).send({ message: 'the album do not been deleting' })
            else {
                Song.find({ album: album_id }).remove((err, songRemoved) => {
                    if (err)
                        res.status(500).send({ message: 'error when deleting song' });
                    else {
                        if (!songRemoved)
                            res.status(404).send({ message: 'the song do not been deleted' });
                        else
                            res.status(200).send({ album_removed: albumRemoved });

                    }
                });
            }
        }
    });
}

function updateAlbum(req, res) {
    let album_id = req.params.id;
    let update = req.body;

    Album.findByIdAndUpdate(album_id, update, (err, albumUpdated) => {
        if (err)
            res.status(500).send({ message: 'error when updating album' });
        else {
            if (!albumUpdated)
                res.status(404).send({ message: 'the album do not been updated' });
            else
                res.status(200).send({ album_updated: albumUpdated });
        }
    });

}

function findAlbum(req, res) {
    let album_id = req.params.id;

    Album.findById(album_id, (err, album) => {
        if (err)
            res.status(500).send({ message: 'error when finding album' });
        else {
            if (!album)
                res.status(404).send({ message: 'album not found' });
            else
                res.status(200).send({ album: album });
        }
    });
}

function getAlbums(req, res) {
    let page = req.query.page;
    let artist_id = req.query.artist;
    let itemPerPage = 5;

    if (page) {
        Album.find().sort('title').paginate(page, itemPerPage, (err, albums, total) => {
            if (err) {
                res.status(500).send({ message: 'error when returning albums' });
            } else {
                if (!albums)
                    res.status(404).send({ message: 'albums not found' });
                else
                    return res.status(200).send({
                        page: page,
                        total_items: total,
                        albums: albums
                    });
            }
        });
    } else if (artist_id) {
        getAlbumsArtist(req, res, artist_id);
    }
    else {
        res.status(200).send({ message: 'page/artist parameter is mandatory' });
    }

}

function getAlbumsArtist(req, res, artist_id) {

    let find = Album.find({ artist: artist_id }).sort('year');
    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err)
            res.status(500).send({ message: 'error when returning artist albums' });
        else {
            if (!albums)
                res.status(404).send({ message: 'artist albums not found ' });
            else
                res.status(200).send({ albums: albums });
        }
    });

}

function uploadImage(req, res){
    let album_id = req.params.id;
    let file_name = "null";

    if(req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('/');
        let file_name = file_split[2]

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(album_id, {image: file_name}, (err, albumUpdated) => {

                if(err)
                    res.status(500).send({message: 'error when update album image'});
                else 
                    if(!albumUpdated)
                        res.status(404).send({message: 'error when update album image'})
                    else 
                        res.status(200).send({album_updated: albumUpdated})
                    
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
    let path_image = './upload/albums/'+name_image;
    fs.exists(path_image, exists => {
        if(exists)
            res.sendFile(path.resolve(path_image));
        else
            res.status(404).send({message: 'image do not exists'});
    });
}

module.exports = {
    saveAlbum,
    updateAlbum,
    findAlbum,
    getAlbums,
    deleteAlbum,
    uploadImage,
    getImageFile
}