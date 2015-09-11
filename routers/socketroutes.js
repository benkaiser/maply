// the controllers containing the logic
var markerController = require('../controllers/markercontroller.js');

// load up all the routes
module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on('joinroom', forwardRequestWithSocket(markerController.addMarkerToRoom));

    socket.on('update', forwardRequestWithSocket(markerController.updateMarkerLocation));

    socket.on('disconnect', forwardRequestWithSocket(markerController.removeMarkerFromRoom));
  });
};

// this wraps a method call and makes sure that the socket and the data passed into the endpoint
// are both passed on. This allows the above to just be configuration, considering they all had
// the same logic before (taking the data, passing on the socket and the data)
function forwardRequestWithSocket(funcToBind) {
  return function(data) {
    funcToBind(this, data);
  };
}
