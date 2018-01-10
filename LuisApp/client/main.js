import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './main.css';

var map_zoom = 15;
var googleMapKey = 'AIzaSyB1fCJ_yz12oq37EQRAsoDXWf_G942FuGg';

// Before starting the map, we need to load the map.
Meteor.startup(function() {
    GoogleMaps.load({ key : googleMapKey });
  });

  // When created, we need to display the map.
  Template.map.onCreated(function() {
    var self = this;

    GoogleMaps.ready('map', function(map) {
      var marker;

      // When the longitude and latitude changes, it will create and move the marker
      self.autorun(function() {
        var geolocationCoord = Geolocation.latLng();
        if (! geolocationCoord)
          return;

        // If a marker has not been created, we need to create one at the user's position
        if (! marker) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(geolocationCoord.lat, geolocationCoord.lng),
            map: map.instance
          });
        }

        // If a marker has been created, set it at the user's position
        else {
          marker.setPosition(geolocationCoord);
        }

        // Once it finds the position, zoom and set it to the center
        map.instance.setZoom(map_zoom);
        map.instance.setCenter(marker.getPosition());
      });
    });
  });

  Template.map.helpers({
    //Displays a geolocation error if coordinates not found
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },

    // Displays the map at the geolocation.
    mapOptions: function() {
      var geolocationCoord = Geolocation.latLng();
      // When the coordinates are found load the map
      // and display geolocation cordinates.
      if (GoogleMaps.loaded() && geolocationCoord) {
        return {
          center: new google.maps.LatLng(geolocationCoord.lat, geolocationCoord.lng),
          zoom: map_zoom
        };
      }
      // If coordinates are not found, display the cordinates in Flagstaff.
      else {
        return {
          center: new google.maps.LatLng(35.198284, -111.651299),
          zoom: map_zoom
        };
      }
    }
  });





// Template.body.helpers({
//     exampleMapOptions: function() {
//       // Make sure the maps API has loaded
//       if (GoogleMaps.loaded()) {
//         // Map initialization options
//         return {
//           center: new google.maps.LatLng(-37.8136, 144.9631),
//           zoom: 8
//         };
//       }
//     }
//   });
//
//
// Template.body.onCreated(function() {
//   // We can use the `ready` callback to interact with the map API once the map is ready.
//   GoogleMaps.ready('exampleMap', function(map) {
//     // Add a marker to the map once it's ready
//     var marker = new google.maps.Marker({
//       position: map.options.center,
//       draggable: true,
//       map: map.instance
//     });
//   });
// });









// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
