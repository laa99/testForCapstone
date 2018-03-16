import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Submitted_Data } from '../api/submitted_data.js';
import Chart from 'chart.js';

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

Router.route('/Chart');

Template.gaugeonesubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.gaugeonesubmission.onRendered(function() {
  //getVals();
  var retVals = [];
  for (var i=0; i < 4; i++) {
      retVals[i] = i;
      //retVals[i] = submitted_data.find({},{height:1,_id:0}).value;
  }
  //window.alert(submitted_data.find({},{height:1,_id:0}));
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24",
      "25","26","27","28","29","30","31"],
        //labels: ["1","2","3","4"],
        datasets: [{
            label: 'Height in inches',
            data: [0,0,0,0,0,0,0,0,0,0,5.4,3.6,7.5,4.4,8.0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            //data: retVals,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
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

/*function getVals(){
  //var testVal = NumberData.find({numKey: "colourNums1"});
  //var val = testVal.fetch();
  //var retVal = 0;
  var retVals = [];
  for (var i=0; i < val.length; i++) {
      //retVal = val[i].big_num;
      retVals[0] = 1;
      retVals[1] = 2;
      retVals[2] = 3;
      retVals[3] = 4;
      retVals[4] = 5;
      retVals[5] = 6;
      //window.alert(retVals);
  }
}*/

Template.login.events({
    'submit .login'(event){
      event.preventDefault();
      //Meteor.call('loginSuccessfulTextMessage');
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
        Meteor.call('submissionTextMessage');
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
    var marker;
    // Place gauge's marker 35.18782 -111.6528
    var marker2;
    marker2 = new google.maps.Marker({
      position: new google.maps.LatLng(35.198505, -111.594887),
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
    geofenceDistance = 50000;

    // var geoLatRad = (geolocationCoord.lat * Math.PI)/180;
    // var lat1Rad = (lat1 * Math.PI)/180;
    //
    // var difLat = geoLat - lat1;
    // var difLng = geoLng - lng1;
    //
    // var radLat = (difLat * Math.PI)/180;
    // var radLng = (difLng * Math.PI)/180;
    //
    // var a = Math.sin(radLat/2) * Math.sin(radLat/2) +
    // Math.cos(lat1Rad) * Math.cos(geoLatRad) *
    // Math.sin(radLng/2) * Math.sin(radLng/2);
    //
    // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    // var d = earthRadius * c;
    // var kilometersToMeters = d * 1000;
    //
    // if (kilometersToMeters <= geofenceDistance) {
    //   Meteor.call('distanceTextMessage');
    // }
    return Geolocation.latLng().lat;
  }
});

Template.distance.helpers({
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
    return "The distance from where we are to the gauge is " + kilometersToMeters + "m.";
  }
});
