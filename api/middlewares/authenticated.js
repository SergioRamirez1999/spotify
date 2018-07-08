'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'BA$H3R';

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization)
        return res.status(403).send({message: 'authorization header not found'});

    //if the token has quotes replace all simple or double quotes for nothing
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        //decode token in payload with user properties(name,email,ext,iat,etc)
        var payload = jwt.decode(token, secret);
        //verify if the token expired
        if(payload.exp <= moment().unix())
            return res.status(401).send({message: 'token expired'});

    } catch (ex) {
        return res.status(404).send({message: 'invalid token'});
    }

    //create a property in req with the user obj
    req.user = payload;

    next();
    
}