// libraries
var express = require('express');

// create the router and expose it
var router = module.exports.router = express.Router();

// add all the routes

router.get('/', function(req, res) {
  res.sendFile('public/index.html', {root: __dirname});
});
