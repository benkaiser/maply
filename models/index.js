var Sequelize = require('sequelize');

// alias
var DataTypes = Sequelize;

module.exports = openDB();

function openDB(options) {
  var models = {};

  sequelize = new Sequelize('postgres://localhost:5432/maply');

  models.markers = sequelize.define('markers',  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disconnected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    classMethods: {
      getMarkersInRoom: function(room, callback) {
        models.markers.findAll({where: {roomName: room, disconnected: false}, raw: true}).then(function(items) {
          for (var i in items) {
            delete items[i].createdAt;
            delete items[i].updatedAt;
          }

          callback(items);
        });
      },

      addMarker: function(data, callback) {
        models.markers.create({id: data.id, lat: data.lat, lng: data.lng, roomName: data.room}).then(function(item) {
          if (callback) callback(item);
        });
      },

      updateMarkerLocation: function(data, callback) {
        models.markers.update({lat: data.lat, lng: data.lng}, {where: {id: data.id}}).then(callback);
      },

      removeMarker: function(id, callback) {
        models.markers.update({disconnected: true}, {where: {id: id}}).then(callback);
      },
    },
  });

  if (process.env.MAPLY_SYNC_DB) {
    sequelize.sync({force: true});
  }

  // on launch, deactivate all 'active' markers, as the socket connection
  // would have been disconnected on exit
  models.markers.update({disconnected: true}, {where: {}, multi: true});

  // make the sequelize object available elsewhere
  models.sequelize = sequelize;

  return models;
};
