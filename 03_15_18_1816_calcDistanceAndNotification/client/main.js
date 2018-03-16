import '../imports/ui/body.js';







// import { Template } from 'meteor/templating';
// import { GoogleMaps } from 'meteor/dburles:google-maps';
// import { Meteor } from 'meteor/meteor';
// import { ReactiveVar } from 'meteor/reactive-var';
//
// import './main.html';
// import './main.css';
//
// var map_zoom = 15;
// //var water_stations;
// var googleMapKey = 'AIzaSyB1fCJ_yz12oq37EQRAsoDXWf_G942FuGg';
//
// Markers = new Mongo.Collection('markers');
//
// // Before starting the map, we need to load the map.
// Meteor.startup(function() {
//     GoogleMaps.load({ key : googleMapKey, libraries: 'geometry' });
//   });
//
//   // When created, we need to display the map.
//   Template.map.onCreated(function() {
//     var self = this;
//
//     GoogleMaps.ready('map', function(map) {
//       google.maps.event.addListener(map.instance, 'click', function(event) {
//         Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
//       });
//
//       var markers = {};
//       Markers.find().observe({
//         // When a marker is added it will create an id for it with the
//         // coordinates in MongoDB
//         added: function (document) {
//           var marker = new google.maps.Marker({
//             position: new google.maps.LatLng(document.lat, document.lng),
//             map: map.instance,
//             draggable: true,
//             id: document._id
//           });
//
//           //Event allows us to drag markers and update coordinates in MongoDB
//           google.maps.event.addListener(marker, 'dragend', function(event) {
//             Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
//           });
//
//           markers[document._id] = marker;
//         },
//
//         // When a marker's position is changed, it updates the position
//         changed: function (newDocument, oldDocument) {
//           markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
//         },
//
//         // When a marker is deleted.
//         removed: function (oldDocument) {
//           markers[oldDocument._id].setMap(null);
//           google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
//           markers[oldDocument._id];
//         }
//       });
//
//
//       var geoMarker;
//
//       // When the longitude and latitude changes, it will create and move the marker
//       self.autorun(function() {
//         var geolocationCoord = Geolocation.latLng();
//         if (! geolocationCoord)
//           return;
//
//         // If a marker has not been created, we need to create one at the user's position
//         if (! geoMarker) {
//           geoMarker = new google.maps.Marker({
//             position: new google.maps.LatLng(geolocationCoord.lat, geolocationCoord.lng),
//             map: map.instance,
//             draggable: false
//           });
//         }
//
//         // If a marker has been created, set it at the user's position
//         else {
//           geoMarker.setPosition(geolocationCoord);
//         }
//
//         // Once it finds the position, zoom and set it to the center
//         map.instance.setZoom(map_zoom);
//         map.instance.setCenter(geoMarker.getPosition());
//       });
//     });
//   });
//
//   Template.map.helpers({
//     //Displays a geolocation error if coordinates not found
//     geolocationError: function() {
//       var error = Geolocation.error();
//       return error && error.message;
//     },
//
//     // Displays the map at the geolocation.
//     mapOptions: function() {
//       var geolocationCoord = Geolocation.latLng();
//       // When the coordinates are found load the map
//       // and display geolocation cordinates.
//       if (GoogleMaps.loaded() && geolocationCoord) {
//         return {
//            center: new google.maps.LatLng(geolocationCoord.lat, geolocationCoord.lng),
//            zoom: map_zoom
//         };
//       }
//       // If coordinates are not found, display the cordinates in Flagstaff.
//       else {
//         return {
//           center: new google.maps.LatLng(35.198284, -111.651299),
//           zoom: map_zoom
//         };
//       }
//     },
//
//     calculateDistance: function() {
//       var geolocationCoord = Geolocation.latLng();
//       var geoLat = geolocationCoord.lat;
//       var geoLng = geolocationCoord.lng;
//       var lat1 = 32.516261;
//       var lng1 = -114.521811;
//       var earthRadius = 6371;
//
//       var geoLatRad = (geolocationCoord.lat * Math.PI)/180;
//       var lat1Rad = (lat1 * Math.PI)/180;
//
//       var difLat = geoLat - lat1;
//       var difLng = geoLng - lng1;
//
//       var radLat = (difLat * Math.PI)/180;
//       var radLng = (difLng * Math.PI)/180;
//
//       var a = Math.sin(radLat/2) * Math.sin(radLat/2) +
//       Math.cos(lat1Rad) * Math.cos(geoLatRad) *
//       Math.sin(radLng/2) * Math.sin(radLng/2);
//
//       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//       var d = earthRadius * c;
//
//       return "The distance between the user and Yuma is " + d * 1000 + " meters."
//     }
//   });
