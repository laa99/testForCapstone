import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Submitted_Data } from '../api/submitted_data.js';


import './body.html';

var map_zoom = 15;
//var water_stations;
var googleMapKey = 'AIzaSyB1fCJ_yz12oq37EQRAsoDXWf_G942FuGg';


Router.route('/', function() {
  this.render('login');
});

Router.route('/login');

Router.route('/Home');

Router.route('/GuestHome');

Router.route('/gaugeone');

Router.route('/gaugeonesubmission');

Router.route('/gaugeonesubmissionGuest');

Template.gaugeonesubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.login.events({
    'submit .login'(event){
      event.preventDefault();
      Router.go('Home');
    },

    'submit .guestLogin'(event){
      event.preventDefault();
      //Meteor.call('sendTextMessage');
      Router.go('GuestHome');
    }
});


Template.gaugeone.events({
    'submit .user_submission'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const height = target.height.value;
        const comments = target.comments.value;
        const image = target.image.value;

        var geolocationCoord = Geolocation.latLng();
        var geoLat = geolocationCoord.lat;
        var geoLong = geolocationCoord.lng;

        // Insert all user submitted data to db collection
        Submitted_Data.insert({
            geoLat,
            geoLong,
            height,
            comments,
            image,
            createdAt: new Date(), // current time
        });
        Meteor.call('submissionTextMessage');

        // Clear form
        target.height.value = '';
        target.comments.value = '';
    },
});

Template.gaugeonesubmissionGuest.events({
    'submit .user_submission'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const height = target.height.value;
        const comments = target.comments.value;
        const image = target.image.value;

        var geolocationCoord = Geolocation.latLng();
        var geoLat = geolocationCoord.lat;
        var geoLong = geolocationCoord.lng;

        // Insert all user submitted data to db collection
        Submitted_Data.insert({
            geoLat,
            geoLong,
            height,
            comments,
            image,
            createdAt: new Date(), // current time
        });

        // Clear form
        target.height.value = '';
        target.comments.value = '';
        Meteor.call('submissionTextMessage');
    },
});

// Before starting the map, we need to load the map.
Meteor.startup(function() {
    GoogleMaps.load({ key : googleMapKey });
  });

  // When created, we need to display the map.
  Template.map.onCreated(function() {
    var self = this;

    GoogleMaps.ready('map', function(map) {
      var marker;
      // Place gauge's marker 35.18782 -111.6528
      var marker2;

      // // When the longitude and latitude changes, it will create and move the marker
      // self.autorun(function() {
      //   var geolocationCoord = Geolocation.latLng();
      //   if (! geolocationCoord)
      //     return;
      //
      //   // If a marker has not been created, we need to create one at the user's position
      //   if (! marker) {
      //     marker = new google.maps.Marker({
      //       position: new google.maps.LatLng(geolocationCoord.lat, geolocationCoord.lng),
      //       map: map.instance
      //     });
      //   }
      //
      //   // If a marker has been created, set it at the user's position
      //   else {
      //     marker.setPosition(geolocationCoord);
      //   }
      //
      //   // Once it finds the position, zoom and set it to the center
      //   map.instance.setZoom(map_zoom);
      //   map.instance.setCenter(marker.getPosition());
      // });
      marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(35.18782, -111.6528),
        map: map.instance,
        draggable: false
      });

      siccsDummyGauge = new google.maps.Marker({
        position: new google.maps.LatLng(35.18620, -111.65840),
        map: map.instance,
        draggable: false
      });

      map.instance.setZoom(map_zoom);
      map.instance.setCenter(marker2.getPosition());
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
    },
    calculateDistance: function() {
      var geolocationCoord = Geolocation.latLng();
      var geoLat = geolocationCoord.lat;
      var geoLng = geolocationCoord.lng;
      var lat1 = 32.516261;
      var lng1 = -111.651299;
      var earthRadius = 6371;
      geofenceDistance = 500;

      var geoLatRad = (geolocationCoord.lat * Math.PI)/180;
      var lat1Rad = (lat1 * Math.PI)/180;

      var difLat = geoLat - lat1;
      var difLng = geoLng - lng1;

      var radLat = (difLat * Math.PI)/180;
      var radLng = (difLng * Math.PI)/180;

      var a = Math.sin(radLat/2) * Math.sin(radLat/2) +
      Math.cos(lat1Rad) * Math.cos(geoLatRad) *
      Math.sin(radLng/2) * Math.sin(radLng/2);

      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = earthRadius * c;
      var kilometersToMeters = d * 1000;

      if (kilometersToMeters <= geofenceDistance) {
        Meteor.call('distanceTextMessage');
      }
      return Session.set('location', location);
    }
  });
