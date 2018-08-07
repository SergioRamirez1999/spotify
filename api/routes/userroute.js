'use strict'

var express = require('express');
var userController = require('../controllers/usercontroller');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/users'});

var api = express.Router();

//Si pegan a esta url, ejecutar el method del script usercontroller
//second param is our middleware
api.post('/managed-users/register', userController.register);
api.post('/managed-users/login', userController.login);

//param 'id' is mandatory. param '?' is optional
api.put('/managed-users/:id', md_auth.ensureAuth, userController.updateUser);
api.put('/managed-users/image/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);

api.get('/managed-users/image/:imageFile', userController.getImageFile);
api.get('/managed-users?:page', md_auth.ensureAuth, userController.getUsers);

module.exports = api;