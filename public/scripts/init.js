// if gmaps loaded before this script, then fire the loadComplete event
// otherwise it will already be loaded
if (gmapsReady) {
  loadComplete();
}

var map;
var meIcon;
var themIcon;
function loadComplete() {

  window.mapview = new MapView({id: 'map'});

  mapview.geoloate();

}
