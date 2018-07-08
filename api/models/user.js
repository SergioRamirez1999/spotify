'use strict'

var mongoose = require('mongoose');

/*TENDREMOS UN USER QUE SE PODRÁ INSTANCIAR Y AUTOMAGICAMENTE GUARDARA EN MONGODB CON EL FORMATO DEL SCHEMA CREADO*/

//definimos el schema
var Schema = mongoose.Schema;

//MONGODB AÑADE EL CAMPO ID DE FORMA AUTOMATICA
//con json definimos los campos del schema
var userSchema = new Schema({
        name: String,
        lastname: String,
        email: String,
        password: String,
        role: String,
        image: String
})

//Exportamos el modelo para poder utilizarlo fuera de este script
module.exports = mongoose.model('User', userSchema);