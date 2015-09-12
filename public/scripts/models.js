// schema isn't defined, they are initialised with objects sent over the socket
var Marker = Backbone.Model.extend({});

var Markers = Backbone.Collection.extend({
  model: Marker,
});
