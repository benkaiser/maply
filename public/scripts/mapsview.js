var meIcon;
var themIcon;

var MapView = Backbone.View.extend({
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
      navigator.geolocation.getCurrentPosition(this.updateCurrentPosition.bind(this), this.failGettingPosition, {enableHighAccuracy: false});

      // calling watch position will get the high accuracy location
      navigator.geolocation.watchPosition(this.updateCurrentPosition.bind(this), this.failGettingPosition, {enableHighAccuracy: true});
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

      this.myMarker = markersCollection.add(markerInfo);

      // add it to the map and save the map reference into the marker
      this.addMarker(this.myMarker);
    } else {
      // update the marker position
      this.updateMarkerPosition(markerInfo);
      socket.emit('update', {lat: lat, lng: lng});
    }

    if (this.firstTime) {
      // rescale the map
      this.fitMapToMarkers();

      this.firstTime = false;
    }
  },

  failGettingPosition: function(msg) {
    console.log(msg);
    alert('Error fetching your location.');
  },

  addMarker: function(markerModel) {
    // create the new marker
    var markerMapRef = new google.maps.Marker({
      position: {lat: markerModel.get('lat'), lng: markerModel.get('lng')},
      map: this.map,
      icon: (markerModel.get('type') == 'self') ? meIcon : themIcon,
      title: markerModel.get('title'),
    });

    // add the marker to the model
    markerModel.set('mapRef', markerMapRef);
  },

  updateMarkerPosition: function(data) {
    var marker = markersCollection.find({id: data.id});

    if (marker) {
      // update it's location
      var latlng = new google.maps.LatLng(data.lat, data.lng);
      marker.get('mapRef').setPosition(latlng);
    } else {
      // add it to the map / create it
      var newMarkerModel = markersCollection.add(data);

      // add the new marker and store it's map reference
      this.addMarker(newMarkerModel);

      // rescale the map to fit the new marker
      this.fitMapToMarkers();
    }
  },

  // used for initially loading in all the other markers
  setMarkersNotSelf: function(data) {
    // clear all the markers that aren't the self marker
    markersCollection.remove(markersCollection.filter(function(marker) {
      return marker.get('id') != 'THIS';
    }));

    // add all the new markers
    for (var i in data) {
      this.updateMarkerPosition(data[i]);
    }
  },

  removeMarkerFromMap: function(data) {
    // get the marker
    var markerToRemove = markersCollection.find({id: data.id});

    // remove it from the mapview
    markerToRemove.get('mapRef').setMap(null);

    // remove it from the collection
    markersCollection.remove(markerToRemove);
  },

  fitMapToMarkers: function() {
    //  Create a new viewpoint bound
    var bounds = new google.maps.LatLngBounds();

    //  Go through each...
    markersCollection.each(function(marker) {
      bounds.extend(new google.maps.LatLng(marker.get('lat'), marker.get('lng')));
    });

    //  Fit these bounds to the map
    this.map.fitBounds(bounds);
  },
});
