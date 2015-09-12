var meIcon;
var themIcon;

var MapView = Backbone.View.extend({
  events: {
    // "click .icon":          "open",
    // "click .button.edit":   "openEditDialog",
    // "click .button.delete": "destroy"
  },

  initialize: function() {
    // create the custom markers for use in the map later
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
  },

  render: function() {
    // initialise the map
    this.map = new google.maps.Map(document.getElementById(this.id), {
      center: {lat: -37.813, lng: 144.962},
      zoom: 9,
    });
  },

  geolocate: function() {
    // trigger the requests for the current location
    if (!!navigator.geolocation) {
      // set this so the update function knows it's the first time fetching
      this.firstTime = true;

      // this will quickly try and get an innacurate location, so we have something to work off
      navigator.geolocation.getCurrentPosition(this.updateCurrentPosition, this.failGettingPosition);

      // calling watch position will get the high accuracy location
      navigator.geolocation.watchPosition(this.updateCurrentPosition, this.failGettingPosition, {timeout: 60000, enableHighAccuracy: true});
    } else {
      // let the user know their browser doesn't support geolocation
      alert('It appears your browser doesn\'t support geolocation :(');
    }
  },

  updateCurrentPosition: function(position) {
    // for use throughout this function
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    var markerInfo = {lat: lat, lng: lng, type: 'self', id: 'THIS'};

    // if this is our first update, join the room
    if (this.firstTime) {
      // join the room once we have a location for our device
      socket.emit('joinroom', {room: room, lat: lat, lng: lng});

      this.myMarker = markerInfo;

      // add the self marker to the list of markers
      allMarkers.push(this.myMarker);

      // add it to the map and save the map reference into the marker
      this.myMarker.mapRef = addMarker(this.myMarker);
    } else {
      // update the marker position
      updateMarkerPosition(markerInfo);
      socket.emit('update', {lat: lat, lng: lng});
    }

    if (this.firstTime) {
      // rescale the map
      fitMapToMarkers(allMarkers);

      this.firstTime = false;
    }
  },

  failGettingPosition: function(msg) {
    console.log(msg);
    alert('Error fetching your location.');
  },
});
