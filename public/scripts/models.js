var Marker = Backbone.Model.extend({
  addToMap: function(map) {

  },

  removeFromMap: function() {

  },
});

var Markers = Backbone.Collection.extend({
  model: Marker,

  onModelRemoved: function(model, collection, options) {
    model.removeFromMap();
  },
});
