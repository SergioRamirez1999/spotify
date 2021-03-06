'use strict'

var express = require('express');
var md_auth = require('../middlewares/authenticated');
var artistController = require('../controllers/artistcontroller');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/artists'});

api.post('/managed-artists', md_auth.ensureAuth, artistController.saveArtist);

api.put('/managed-artists/:id', md_auth.ensureAuth, artistController.updateArtist);
api.put('/managed-artists/image/:id', [md_auth.ensureAuth, md_upload], artistController.uploadImage);

api.delete('/managed-artists/:id', md_auth.ensureAuth, artistController.deleteArtist);

api.get('/managed-artists/image/:imageFile', artistController.getImageFile);
api.get('/managed-artists/:id', md_auth.ensureAuth, artistController.findArtist);
api.get('/managed-artists?:page',  artistController.getArtists);

module.exports = api;