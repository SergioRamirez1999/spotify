'use strict'

var express = require('express');
var md_auth = require('../middlewares/authenticated');
var songController = require('../controllers/songcontroller');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/songs'});

api.post('/managed-songs', md_auth.ensureAuth, songController.saveSong);

api.delete('/managed-songs/:id', md_auth.ensureAuth, songController.deleteSong);

api.put('/managed-songs/:id', md_auth.ensureAuth, songController.updateSong);
api.put('/managed-songs/file/:id', [md_auth.ensureAuth, md_upload], songController.uploadFile);

api.get('/managed-songs/:id', md_auth.ensureAuth, songController.findSong);
api.get('/managed-songs?:page', md_auth.ensureAuth, songController.getSongs);
api.get('/managed-songs/file/:fileName', songController.getSongFile);

module.exports = api;