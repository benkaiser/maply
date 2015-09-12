// list of markers to store. TODO make this a model
var allMarkers = [];

var thisMarker = null;
var firstTime = true;
function updateCurrentPosition(position) {
  
}

function failGettingPosition(msg) {
  console.log(msg);
}

var markerIds = 0;
function addMarker(info) {
  return new google.maps.Marker({
    position: {lat: info.lat, lng: info.lng},
    map: map,
    icon: (info.type && info.type == 'self') ? meIcon : themIcon,
    title: (info.title) ? info.title : '',
  });
}

function getMarkerById(id) {
  for (var i in allMarkers) {
    if (allMarkers[i] && allMarkers[i].id == id) {
      return allMarkers[i];
    }
  }

  return null;
}

function updateMarkerPosition(data) {
  var marker = getMarkerById(data.id);

  if (marker) {
    // update it's location
    var latlng = new google.maps.LatLng(data.lat, data.lng);
    marker.mapRef.setPosition(latlng);
  } else {
    // add it to the map / create it
    allMarkers.push(data);

    // update the reference
    data.mapRef = addMarker(data);

    // rescale the map
    fitMapToMarkers(allMarkers);
  }
}

// used for initially loading in all the other markers
function setMarkersNotSelf(data) {
  // clear all the current markers except current
  for (var i in allMarkers) {
    var item = allMarkers[i];

    if (item.type != 'self') {
      item.mapRef.setMap(null);
      allMarkers.slice(i, 1);
    }
  }

  for (var i in data) {
    var item = data[i];

    allMarkers.push(item);
    item.mapRef = addMarker(item);
  }

  // refit all markers
  fitMapToMarkers(allMarkers);
}

function removeMarkerFromMap(data) {
  var marker = getMarkerById(data.id);

  if (marker) {
    // clear it from the map
    marker.mapRef.setMap(null);
    allMarkers.splice(allMarkers.indexOf(marker), 1);
  }
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
