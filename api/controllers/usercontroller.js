'use strict'

//IMPORT BCRYPT AND USER MODEL
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


function register(req,res){
    let user = new User();
    let params = req.body;

    user.name = params.name;
    user.lastname = params.lastname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        if(user.name != null && user.lastname != null && user.email != null){
            //Encrypt password
            bcrypt.hash(params.password, null, null, (err, hash) => {
                user.password = hash;
            });
            
            //Save user
            user.save((err, userStored) => {
                if(err){
                    res.status(500).send({message: 'enter password'});
                }else {
                    if(!userStored){
                        res.status(404).send({message: 'the user has not been registered'});
                    }else{
                        res.status(200).send({user_stored: userStored});
                    }
                }
            });
        }else
            res.status(200).send({message: 'fill all the fields'});
    }

}

function login(req,res){
    let params = req.body;
    let email = params.email;
    let password = params.password;

    //Find user in db
    User.findOne({email: email.toLowerCase()}, (err,user) => {
        if(err){
            res.status(500).send({message: 'login error'});
        }else{
            if(!user){
                res.status(404).send({message: 'user does not exist'});
            }else{
                //If the email exists
                //Password decoder
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        //return login user data
                        if(params.gethash){
                            //return JWT token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            //if the user login for first time, the request won't have hash... so return user
                            res.status(200).send({user});
                        }

                    }else{
                        res.status(404).send({message: 'password or email is invalid'})
                    }
                });
            }
        }
    });
    
}

function updateUser(req,res){
    let user_id = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(user_id, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'error when updating user'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'error when updating user'})
            }else{
                res.status(200).send({user_updated: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){
    let user_id = req.params.id;
    let file_name = "null";

    if(req.files){
        let file_path = req.files.image.path;
        let file_split = file_path.split('/');
        let file_name = file_split[2]

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(user_id, {image: file_name}, (err, userUpdated) => {

                if(err)
                    res.status(500).send({message: 'error when update user image'});
                else 
                    if(!userUpdated)
                        res.status(404).send({message: 'error when update user image'})
                    else 
                        res.status(200).send({image: file_name, user: userUpdated})
                    
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
    let path_image = './upload/users/'+name_image;
    fs.exists(path_image, exists => {
        if(exists)
            res.sendFile(path.resolve(path_image));
        else
            res.status(404).send({message: 'image do not exists'});
    });
}


//Load controllers
module.exports = {
    register,
    login,
    updateUser,
    uploadImage,
    getImageFile
};