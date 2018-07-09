'use strict'


var express = require('express');
var bodyParser = require('body-parser');


var app = express();

//ROUTES

var user_routes = require('./routes/userroute');
var artist_routes = require('./routes/artistroute');
var album_routes = require('./routes/albumroute');
var song_routes = require('./routes/songroute');


//convertir a obj json los datos que llegan por http
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//conigurar headers http
//middleware
app.use((req, res, next) => {
    //All domains can access the api
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //Methods allowed
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});


//ROUTE BASE
//Creamos un middleware para que toda peticion pase primero por un path determinado
app.use('/api/user-management/', user_routes);
app.use('/api/artist-management/', artist_routes);
app.use('/api/album-management/', album_routes);
app.use('/api/song-management/', song_routes);

module.exports = app;
