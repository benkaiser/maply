// load up all the routes
module.exports = function(io) {
  io.on('connection', function(socket) {

    socket.on('joinroom', function(data) {
      socket.join(data.room);
      console.log('Client: ' + socket.id + ' joined room ' + data.room);
    });

    socket.on('update', function(data) {
      console.log(data);
      socket.broadcast.to(socket.rooms[1]).emit('update', data);
    });

    socket.on('disconnect', function() {
      console.log('Client: ' + socket.id + ' disconnected');
    });
  });
};
