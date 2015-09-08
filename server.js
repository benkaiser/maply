var express = require('express');
var app = exports.app = express();
var port = process.env.PORT || 6789;

var main = function() {
  // add the routes
  app.use('/', require('./routes').router);

  // serving static files
  app.use('/public', express.static('public'));

  // start the server
  app.listen(port);
  console.log('Server running on port: ' + port);
};

main();
