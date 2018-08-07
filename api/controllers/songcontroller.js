'use strict'

var path = require('path');
var fs = require('fs');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('mongoose-pagination');

function saveSong(req, res) {
    let params = req.body;
    let song = new Song();
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    console.log(song);

    if (song.number != null && song.name != null && song.duration != null && song.album != null) {
        song.save((err, songStored) => {
            if (err)
                res.status(500).send({ message: 'error when saving song' });
            else {
                if (!songStored)
                    res.status(404).send({ message: 'the album has not been registered' });
                else
                    res.status(200).send({ song_stored: songStored });
            }
        });
    } else {
        res.status(200).send({ message: 'fill all the field' });
    }
}

function deleteSong(req, res) {
    let song_id = req.params.id;

    Song.findByIdAndRemove(song_id, (err, songRemoved) => {
        if (err)
            res.status(500).send({ message: 'error when deleting song' });
        else {
            if (!songRemoved)
                res.status(404).send({ message: 'the song do not been deleting' })
            else
                res.status(200).send({ song_removed: songRemoved });
        }
    });


}

function updateSong(req, res) {
    let song_id = req.params.id;
    let update = req.body;

    Song.findByIdAndUpdate(song_id, update, (err, songUpdated) => {
        if (err)
            res.status(500).send({ message: 'error when updating song' });
        else {
            if (!songUpdated)
                res.status(404).send({ message: 'the song do not been updated' });
            else
                res.status(200).send({ song_updated: songUpdated });
        }
    });

}

function findSong(req, res) {
    let song_id = req.params.id;

    Song.findById(song_id).populate({ path: 'album' }).exec((err, song) => {
        if (err)
            res.status(500).send({ message: 'error when finding song' });
        else {
            if (!song)
                res.status(404).send({ message: 'song not found' });
            else
                res.status(200).send({ song: song });
        }
    });
}

function getSongs(req, res) {
    let page = req.query.page;
    let album_id = req.query.album;
    let itemPerPage = 5;

    if (page) {
        Song.find().sort('name').paginate(page, itemPerPage, (err, songs, total) => {
            if (err) {
                res.status(500).send({ message: 'error when returning songs' });
            } else {
                if (!songs)
                    res.status(404).send({ message: 'songs not found' });
                else
                    return res.status(200).send({
                        page: page,
                        total_items: total,
                        songs: songs
                    });
            }
        });
    } else if (album_id) {
        getSongsAlbum(req, res, album_id);
    }
    else {
        res.status(200).send({ message: 'page/album parameter is mandatory' });
    }

}

function getSongsAlbum(req, res, album_id) {

    let find = Song.find({ album: album_id }).sort('number');
    //get songs and artist by Album id
    find.populate(
        {
            path: 'album',
            populate: {
                path: 'artist',
                model: 'Artist'
            }
        }
    ).exec((err, songs) => {
        if (err)
            res.status(500).send({ message: 'error when returning album songs' });
        else {
            if (!songs)
                res.status(404).send({ message: 'album songs not found ' });
            else
                res.status(200).send({ songs: songs });
        }
    });

}

function uploadFile(req, res){
    let song_id = req.params.id;
    let file_name = "null";

    if(req.files){
        let file_path = req.files.file.path;
        let file_split = file_path.split('/');
        let file_name = file_split[2]

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        
        if(file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(song_id, {file: file_name}, (err, songUpdated) => {

                if(err)
                    res.status(500).send({message: 'error when update song file'});
                else 
                    if(!songUpdated)
                        res.status(404).send({message: 'error when update song file'});
                    else 
                        res.status(200).send({song_updated: songUpdated});
                    
            });

        }else {
            res.status(200).send({message: 'invalid extension'});
        }
            
    }else{
        res.status(200).send({message: 'you haven\'t upload any file'});
    }
}

function getSongFile(req,res){
    let name_song = req.params.fileName;
    let path_song = './upload/songs/'+name_song;
    fs.exists(path_song, exists => {
        if(exists)
            res.sendFile(path.resolve(path_song));
        else
            res.status(404).send({message: 'file do not exists'});
    });
}

module.exports = {
    saveSong,
    deleteSong,
    updateSong,
    findSong,
    getSongs,
    uploadFile,
    getSongFile
}