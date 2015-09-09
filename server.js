// libraries to include
var swig = require('swig');
var bodyParser = require('body-parser');
var express = require('express');
var socketio = require('socket.io');

// create the express app
var app = exports.app = express();

// create the socketio server and attach it to the app
app.io = socketio();

// descide on the port to run on
var port = process.env.PORT || 6789;

var main = function() {
  // set templating engine to use
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/public');

  // parse the form bodies
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  // add the routes
  app.use('/', require('./service/httproutes').router);

  // add the websocket routes
  require('./service/socketroutes')(app.io);

  // serving static files
  app.use('/public', express.static('public'));

  // start the server
  var server = require('http').createServer(app).listen(port);
  app.io.listen(server);
  console.log('Server running on port: ' + port);
};

// run the main function
main();

// expose the current app for testing purposes (when this module is loaded from another file)
module.exports = app;
