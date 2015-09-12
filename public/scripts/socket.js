socket.on('update', function(data) {
  updateMarkerPosition(data);
});

socket.on('updateAllMarkers', function(data) {
  setMarkersNotSelf(data.markers);
});

socket.on('remove', function(data) {
  removeMarkerFromMap(data);
});
