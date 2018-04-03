import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Submitted_Data } from '../api/submitted_data.js';
import Chart from 'chart.js';

import './body.html';


// Global variables
var map_zoom = 15;
//var water_stations;
var googleMapKey = 'AIzaSyB1fCJ_yz12oq37EQRAsoDXWf_G942FuGg';
var water_stations = [['Rio De Flag at Aspen Valley (south)', 35.198505, -111.594887],
                      ['Rio de Flag at Aspen Valley (north)', 35.210533, -111.587653],
                      ["Siccs Dummy Gauge", 35.18620, -111.65840]];






// Global Functions
calculateDistanceNotification = function(geofenceDistance, waitingTime) {
  var geolocationCoord = Geolocation.latLng();
  var geoLat = geolocationCoord.lat;
  var geoLng = geolocationCoord.lng;
  var lat1 = 35.18620;
  var lng1 = -111.651299;
  var earthRadius = 6371;
  //geofenceDistance = 30;

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
  var distanceInMeters = d * 1000;

  if (distanceInMeters <= geofenceDistance) {
    Meteor.setInterval(function(){ Meteor.call('distanceTextMessage');}, waitingTime);
  }
  //return "The distance from where we are to the gauge is " + distanceInMeters + "m.";
}









Router.route('/', function() {
  this.render('login');
});

Router.route('/login');

Router.route('/Home');

Router.route('/GuestHome');

Router.route('/gaugeone');

Router.route('/gaugeonesubmission');

Router.route('/gaugeonesubmissionGuest');

Router.route('/gaugetwo');

Router.route('/gaugetwosubmission');

Router.route('/gaugetwosubmissionGuest');

Router.route('/Chart');

Template.gaugeonesubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.gaugetwosubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.gaugeonesubmission.onRendered(function() {
  var testVal = Submitted_Data.find({gaugename: "RioDeFlagAspenValleySouth"});
  var val = testVal.fetch();
  var retVal = 0;
  var retVals = [];
  for (var i=0; i < val.length; i++) {
      retVals[i] = val[i].height;
  }
  var vals = retVals
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: vals,//["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24",
                 //"25","26","27","28","29","30","31"],
        datasets: [{
            label: 'Height in inches',
            data: vals,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                //'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                //'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  });
});

Template.gaugetwosubmission.onRendered(function() {
  var testVal = Submitted_Data.find({gaugename: "RioDeFlagAspenValleyNorth"});
  var val = testVal.fetch();
  var retVal = 0;
  var retVals = [];
  for (var i=0; i < val.length; i++) {
      retVals[i] = val[i].height;
  }
  var vals = retVals
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: vals,//["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24",
                 //"25","26","27","28","29","30","31"],
        datasets: [{
            label: 'Height in inches',
            data: vals,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                //'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                //'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  });
});

Template.login.events({
    'submit .login'(event){
      event.preventDefault();
      Router.go('Home');
    },

    'submit .guestLogin'(event){
      event.preventDefault();
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
        const gaugename = "RioDeFlagAspenValleySouth";

        var geolocationCoord = Geolocation.latLng();
        var geoLat = geolocationCoord.lat;
        var geoLong = geolocationCoord.lng;

        // Insert all user submitted data to db collection
        Submitted_Data.insert({
            gaugename,
            geoLat,
            geoLong,
            height,
            comments,
            image,
            createdAt: new Date(), // current time
        });
        //Meteor.call('submissionTextMessage');

        // Clear form
        target.height.value = '';
        target.comments.value = '';
    },
});

Template.gaugetwo.events({
    'submit .user_submission'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const height = target.height.value;
        const comments = target.comments.value;
        const image = target.image.value;
        const gaugename = "RioDeFlagAspenValleyNorth";

        var geolocationCoord = Geolocation.latLng();
        var geoLat = geolocationCoord.lat;
        var geoLong = geolocationCoord.lng;

        // Insert all user submitted data to db collection
        Submitted_Data.insert({
            gaugename,
            geoLat,
            geoLong,
            height,
            comments,
            image,
            createdAt: new Date(), // current time
        });
        //Meteor.call('submissionTextMessage');

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
        const gaugename = "RioDeFlagAspenValleySouth";

        var geolocationCoord = Geolocation.latLng();
        var geoLat = geolocationCoord.lat;
        var geoLong = geolocationCoord.lng;

        // Insert all user submitted data to db collection
        Submitted_Data.insert({
            gaugename,
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
    },
});

Template.gaugetwosubmissionGuest.events({
    'submit .user_submission'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const height = target.height.value;
        const comments = target.comments.value;
        const image = target.image.value;
        const gaugename = "RioDeFlagAspenValleyNorth";

        var geolocationCoord = Geolocation.latLng();
        var geoLat = geolocationCoord.lat;
        var geoLong = geolocationCoord.lng;

        // Insert all user submitted data to db collection
        Submitted_Data.insert({
            gaugename,
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
    var stationiInfoWindow = new google.maps.InfoWindow();
    for (var i = 0; i < water_stations.length; i++) {
      var water_gauge = water_stations[i];
      var marker = new google.maps.Marker({
        position: {lat: water_gauge[1], lng: water_gauge[2]},
        map: map.instance,
        draggable: false
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          stationiInfoWindow.setContent(water_stations[i][0]);
          stationiInfoWindow.open(map, marker);
        }
      })(marker, i));
    }
    // map.instance.setZoom(map_zoom);
    // map.instance.setCenter(marker2.getPosition());

    // marker2 = new google.maps.Marker({
    //   position: new google.maps.LatLng(35.198505, -111.594887),
    //   map: map.instance,
    //   draggable: false
    // });
    //
    // siccsdummy = new google.maps.Marker({
    //   position: new google.maps.LatLng(35.18620, -111.65840),
    //   map: map.instance,
    //   draggable: false
    // });
    //
    // map.instance.setZoom(map_zoom);
    // map.instance.setCenter(marker2.getPosition());
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

Template.distance.helpers({
  calculateDistance: function() {
    var geolocationCoord = Geolocation.latLng();
    var geoLat = geolocationCoord.lat;
    var geoLng = geolocationCoord.lng;
    var lat1 = 35.18620;
    var lng1 = -111.65840;
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
      //Meteor.call('distanceTextMessage');
    }
    return "The distance from where we are to the gauge is " + kilometersToMeters + "m.";
  }
});



Template.notificationButton.events({
  'submit .notificationTask': function(event) {
    event.preventDefault();
    var radioTimeValue = event.target.notificationTimeForm.value;
    var radioProximityValue = event.target.notificationProxForm.value;
    var radioToggleValue = event.target.notificationToggleForm.value;

    if (radioToggleValue == "on" && radioTimeValue == "5" && radioProximityValue == "50") {
      var waitTime = 300000;
      //var waitTime = 60000;
      var geofenceDistance = 50;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "5" && radioProximityValue == "100") {
      var waitTime = 300000;
      var geofenceDistance = 100;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "5" && radioProximityValue == "300") {
      var waitTime = 300000;
      var geofenceDistance = 300;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "30" && radioProximityValue == "50") {
      var waitTime = 1800000;
      var geofenceDistance = 50;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "30" && radioProximityValue == "100") {
      var waitTime = 1800000;
      var geofenceDistance = 100;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
      // console.log(radioTimeValue);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "30" && radioProximityValue == "300") {
      var waitTime = 1800000;
      var geofenceDistance = 300;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "60" && radioProximityValue == "50") {
      var waitTime = 3600000;
      var geofenceDistance = 50;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "60" && radioProximityValue == "100") {
      var waitTime = 3600000;
      var geofenceDistance = 100;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
    }
    else if (radioToggleValue == "on" && radioTimeValue == "60" && radioProximityValue == "300") {
      var waitTime = 3600000;
      var geofenceDistance = 100;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance, waitTime);
      // console.log(radioProximityValue);
    }
    // If the user decides they don't want notifications, it will not do anything
    else if (radioToggleValue == "off") {
      //return "Notifications are turned off";
      event.target.reset();
    }
    else {
      return;
    }
  }
});
