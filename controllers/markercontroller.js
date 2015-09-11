var models = require('../models/');

module.exports = {
  addMarkerToRoom: function(socket, data) {
    // set the socket room name for future use
    socket.currentRoom = data.room;

    // join the room, used for later broadcasting
    socket.join(socket.currentRoom);

    // fetch all the other markers in the room to send to the newly joined socket
    models.markers.getMarkersInRoom(socket.currentRoom, function callback(items) {
      // emit the existing markers down to the client
      socket.emit('updateAllMarkers', {markers: items});

      // insert the current new marker
      data.id = socket.id;
      models.markers.addMarker(data);
    });
  },

  updateMarkerLocation: function(socket, data) {
    data.id = socket.id;

    // update the model
    models.markers.updateMarkerLocation(data);

    // broadcast to other members of the room the updated location
    // including the id of the socket
    socketRoom(socket).emit('update', data);
  },

  removeMarkerFromRoom: function(socket) {
    // remove the marker from the model
    models.markers.removeMarker(socket.id);

    // let the other clients know of it's removal
    socketRoom(socket).emit('remove', {id: socket.id});
  },

  getMarkersInRoom: function(socket, data) {

  },
};

function socketRoom(socket) {
  return socket.broadcast.to(socket.currentRoom);
}
