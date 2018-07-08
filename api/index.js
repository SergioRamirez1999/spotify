'use strict'
//MONGODB CONNECTION
//Cargamos los modules
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
   if(err){
       throw err;
   }else{
       console.log("MONGODB RUNNING....");
       //server listening
       app.listen(port, () => {
           console.log("SERVER API REST LISTENING IN http://localhost:"+port);
       });
   }
});
