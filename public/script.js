

// list of markers to store. TODO make this a model
var allMarkers = [];

if (gmapsReady) {
  loadComplete();
}


var map, meIcon, themIcon;
function loadComplete() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -37.813, lng: 144.962},
    zoom: 9,
  });

  // custom markers
  meIcon = new google.maps.MarkerImage('/public/img/position.png',
                  new google.maps.Size(40, 40),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(20, 20),
                  new google.maps.Size(30, 30));

  themIcon = new google.maps.MarkerImage('/public/img/marker.png',
                  new google.maps.Size(40, 40),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(20, 28),
                  new google.maps.Size(30, 30));

  // get current location if supported
  if (!!navigator.geolocation) {
    navigator.geolocation.watchPosition(updateCurrentPosition, failGettingPosition, {timeout: 60000, enableHighAccuracy: true});
    navigator.geolocation.getCurrentPosition(updateCurrentPosition, failGettingPosition);
  } else {
    alert('you suck! get a better browser');
  }
}

var thisMarker = null;
var firstTime = true;
function updateCurrentPosition(position) {
  // for use throughout this function
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  var markerInfo = {lat: lat, lng: lng, type: 'self', id: 'THIS'};

  // if this is our first update, join the room
  if (firstTime) {
    // join the room once we have a location for our device
    socket.emit('joinroom', {room: room, lat: lat, lng: lng});

    thisMarker = markerInfo;

    // add the self marker to the list of markers
    allMarkers.push(thisMarker);

    // add it to the map and save the map reference into the marker
    thisMarker.mapRef = addMarker(thisMarker);
  } else {
    // update the marker position
    updateMarkerPosition(markerInfo);
    socket.emit('update', {lat: lat, lng: lng});
  }

  if (firstTime) {
    // rescale the map
    fitMapToMarkers(allMarkers);

    firstTime = false;
  }
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

var socket = io.connect();

socket.on('update', function(data) {
  updateMarkerPosition(data);
});

socket.on('updateAllMarkers', function(data) {
  setMarkersNotSelf(data.markers);
});

socket.on('remove', function(data) {
  removeMarkerFromMap(data);
});
