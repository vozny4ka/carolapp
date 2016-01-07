// load express
var express = require('express');
var app = express();
var server = require('http').Server(app);

// Path module
// var path = require('path');
// Using the filesystem module
// var fs = require('fs');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
server.listen(port);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

console.log('node running on port ' + port);