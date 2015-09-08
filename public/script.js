var allMarkers = [
  {lat: -38.120624, lng: 144.231085, title: 'Bens Place'},
  {lat: -37.801097, lng: 144.956027, title: 'Kris\' Place'},
];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -37.813, lng: 144.962},
    zoom: 9,
  });

  for (var i in allMarkers) {
    addMarker(allMarkers[i]);
  }

  fitMapToMarkers(allMarkers);

  // get current location if supported
  if (!!navigator.geolocation) {
    navigator.geolocation.watchPosition(updateCurrentPosition, failGettingPosition, {timeout:60000});
  } else {
    alert('you suck! get a better browser');
  }
}

var lastMarker = null;
function updateCurrentPosition(position) {
  // if we have a previous marker for our position, null the map (remove it)
  if (lastMarker) {
    lastMarker.setMap(null);
  }

  var newMarker = {lat: position.coords.latitude, lng: position.coords.longitude, title: 'Current Position'};
  allMarkers.push(newMarker);

  // add it to the map and save the marker id
  lastMarker = addMarker(newMarker);
}

function failGettingPosition(msg) {
  console.log(msg);
}

var markerIds = 0;
function addMarker(info) {
  return new google.maps.Marker({
    position: {lat: info.lat, lng: info.lng},
    map: map,
    title: info.title,
  });
}

function fitMapToMarkers(markersArr) {
  //  Create a new viewpoint bound
  var bounds = new google.maps.LatLngBounds();

  //  Go through each...
  for (var i = 0; i < markersArr.length; i++) {
    //  And increase the bounds to take this point
    bounds.extend(new google.maps.LatLng(markersArr[i].lat, markersArr[i].lng));
  }

  //  Fit these bounds to the map
  map.fitBounds(bounds);
}
