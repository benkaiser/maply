// if gmaps loaded before this script, then fire the loadComplete event
// otherwise it will already be loaded
if (gmapsReady) {
  loadComplete();
}

window.markersCollection = new Markers();
function loadComplete() {

  window.mapview = new MapView({id: 'map'});
  window.mapview.render();

  window.mapview.geolocate();
}
