// libraries
var express = require('express');

// create the router and expose it
var router = module.exports.router = express.Router();

// add all the http routes, mainly for serving the home page and room page
router.get('/', function(req, res) {
  res.render('index');
});

// this page is just a middle layer that redirects from the home page
// through to a room page
router.post('/createroom', function(req, res) {
  res.redirect('/' + req.body.roomname);
});

router.get('/:roomname', function(req, res) {
  res.render('room', {room: req.params.roomname});
});
