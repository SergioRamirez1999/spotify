'use strict'

var express = require('express');
var md_auth = require('../middlewares/authenticated');
var albumController = require('../controllers/albumcontroller');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/albums'});

api.post('/managed-albums', md_auth.ensureAuth, albumController.saveAlbum);
api.put('/managed-albums/:id', md_auth.ensureAuth, albumController.updateAlbum);
api.delete('/managed-albums/:id', md_auth.ensureAuth, albumController.deleteAlbum);
api.post('/managed-albums/image/:id', [md_auth.ensureAuth, md_upload], albumController.uploadImage);

api.get('/managed-albums/:id', md_auth.ensureAuth, albumController.findAlbum);
api.get('/managed-albums?:page', md_auth.ensureAuth, albumController.getAlbums);
api.get('/managed-albums/image/:imageFile', md_auth.ensureAuth, albumController.getImageFile);


module.exports = api;