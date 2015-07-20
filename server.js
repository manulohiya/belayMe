var express = require('express'),
    app = express(),
    _ = require('underscore-node'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/project1');
// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

// // set up root route to respond with 'hello world'
// app.get('/', function (req, res) {
//   res.send('hello world');
// });

//GET STATIC ROUTES//
app.use(express.static(__dirname + '/public'));
//get static index
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});
//get static js
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/js/route_magic.js');
});
//get statis css
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/css/route_style.css' );
});
// //get static image
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/public/images/honnold.jpg' );
// });


// listen on port 3000
app.listen(3000, function () {
  console.log("It's ALIVE!!");
});


