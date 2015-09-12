var socket = io.connect();

socket.on('update', function(data) {
  mapview.updateMarkerPosition(data);
});

socket.on('updateAllMarkers', function(data) {
  mapview.setMarkersNotSelf(data.markers);
});

socket.on('remove', function(data) {
  mapview.removeMarkerFromMap(data);
});
