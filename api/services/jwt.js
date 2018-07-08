'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'BA$H3R';

//probar con alguna logica de creacion de hash aleatoria
exports.createToken = function(user){
    //create a token with user properties, creation moment and expiration date
    let payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        //unix date format
        iat: moment().unix(),
        //duration 1 day 
        exp: moment().add(1, 'days').unix
    }

    return jwt.encode(payload, secret);
}