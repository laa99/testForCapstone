/****************************************************
set TOOL_NODE_FLAGS=--max-old-space-size=2047
****************************************************/

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Submitted_Data } from '../api/submitted_data.js';
import Chart from 'chart.js';

import './body.html';

// BEGIN Google Maps Global Variables
var map_zoom = 11;
var googleMapKey = 'AIzaSyB1fCJ_yz12oq37EQRAsoDXWf_G942FuGg';
var water_stations = [['Rio De Flag at Aspen Valley (south)', 35.198505, -111.594887,
                      '<h3>Rio De Flag at Aspen Valley (south)</h3> <br> <a href="/gaugeone"> Submit Data for this Location </a> <br> <a href="/gaugeonesubmission">View Submitted Data</a>'],
                      ['Rio de Flag at Aspen Valley (north)', 35.210533, -111.587653,
                      '<h3>Rio De Flag at Aspen Valley (north)</h3> <br> <a href="/gaugetwo"> Submit Data for this Location </a> <br> <a href="/gaugetwosubmission">View Submitted Data</a>'],
                      ["Siccs Gauge", 35.18620, -111.65840,
                      '<h3>School of Informatics and Cyber Systems(SICCS)</h3> <br> <a href="/gaugethree"> Submit Data for this Location </a> <br> <a href="/gaugethreesubmission">View Submitted Data</a>']];
var geoMarker;
// END Google Maps Global Variables;


// BEGIN OpenCV Globals
var prefix = "uploaded_images/";
var pole_path = "uploaded_images/";
var pole = null;
var version = "2.0";
var DEBUG = true;
var target_stripe_size = 100;
var PERCENT_TARGET_COLOR = 0.50;

/*###############################################################
 ADJUST PER GAUGE STATION
 ############################################################*/
var real_stripe_height = 4;

var pole_px = 0;
var totalH = 0;

/*###############################################################
 ADJUST PER GAUGE STATION
 ############################################################*/
var real_height_of_pole = 48;

var data_of_image = null;
var imgElement = null;
var myPoleCoords = null;
// END OpenCV Globals


// BEGIN Global Functions
calculateDistanceNotificationOnce = function(geofenceDistance, waitingTime) {
  var geolocationCoord = Geolocation.latLng();
  var geoLat = geolocationCoord.lat;
  var geoLng = geolocationCoord.lng;
  var earthRadius = 6371;
  for (var i = 0; i < water_stations.length; i++) {
    var geoLatRad = (geolocationCoord.lat * Math.PI)/180;
    var lat1Rad = (water_stations[i][1] * Math.PI)/180;

    var difLat = geoLat - water_stations[i][1];
    var difLng = geoLng - water_stations[i][2];

    var radLat = (difLat * Math.PI)/180;
    var radLng = (difLng * Math.PI)/180;

    var a = Math.sin(radLat/2) * Math.sin(radLat/2) +
    Math.cos(lat1Rad) * Math.cos(geoLatRad) *
    Math.sin(radLng/2) * Math.sin(radLng/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = earthRadius * c;
    var distanceInMeters = d * 1000;

    if (distanceInMeters <= geofenceDistance) {
      // Meteor.setInterval(function(){Meteor.call('distanceTextMessage'); }, waitingTime);
      Meteor.setTimeout(function(){Meteor.call('distanceTextMessage'); }, 10000);
    }
  }
}

calculateDistanceNotificationMultiple = function(geofenceDistance, waitingTime) {
  var geolocationCoord = Geolocation.latLng();
  var geoLat = geolocationCoord.lat;
  var geoLng = geolocationCoord.lng;
  var earthRadius = 6371;
  for (var i = 0; i < water_stations.length; i++) {
    var geoLatRad = (geolocationCoord.lat * Math.PI)/180;
    var lat1Rad = (water_stations[i][1] * Math.PI)/180;

    var difLat = geoLat - water_stations[i][1];
    var difLng = geoLng - water_stations[i][2];

    var radLat = (difLat * Math.PI)/180;
    var radLng = (difLng * Math.PI)/180;

    var a = Math.sin(radLat/2) * Math.sin(radLat/2) +
    Math.cos(lat1Rad) * Math.cos(geoLatRad) *
    Math.sin(radLng/2) * Math.sin(radLng/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = earthRadius * c;
    var distanceInMeters = d * 1000;

    if (distanceInMeters <= geofenceDistance) {
      // Meteor.setInterval(function(){Meteor.call('distanceTextMessage'); }, waitingTime);
      Meteor.setInterval(function(){Meteor.call('distanceTextMessage'); }, 60000);

    }
  }
}


Router.route('/', function() {
  this.render('loginregister');
});

Router.route('/Home');

Router.route('/GuestHome');

Router.route('/gaugeone');

Router.route('/gaugeonesubmission');

Router.route('/gaugeonesubmissionGuest');

Router.route('/gaugetwo');

Router.route('/gaugetwosubmission');

Router.route('/gaugetwosubmissionGuest');

Router.route('/gaugethree');

Router.route('/gaugethreesubmission');

Router.route('/gaugethreesubmissionGuest');

Router.route('/Chart');

Router.route('/loginregister');

Router.route('/register');

Router.route('/login');

Router.route('/notificationSettings');

Router.route('/about');



Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
          }, function(error){
            if(error){
                console.log(error.reason); // Output error if registration fails
            } else {
                Router.go("Home"); // Redirect user if registration succeeds
            }
        });
    }
});

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
            window.alert("Login failed, try again");
            console.log(error.reason);
          } else {
            window.alert("Succesfully logged in!");
            console.log("userID here");
            Router.go("Home");
            Meteor.call('getOpenWeather');
          }
        });
    }
});

Template.loginregister.events({
    'submit .userLogin'(event){
      event.preventDefault();
      //Meteor.call('loginSuccessfulTextMessage');
      Router.go('login');
    },

    'submit .guestLogin'(event){
      event.preventDefault();
      Router.go('GuestHome');
    },

    'submit .newRegister'(event){
      event.preventDefault();
      Router.go('register');
    },
});

Template.Home.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.about.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.notificationSettings.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.gaugeone.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.gaugetwo.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.gaugethree.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.gaugeonesubmission.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.gaugetwosubmission.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.gaugethreesubmission.events({
  'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('loginregister');
    }
});

Template.NavOne.events({
  'submit .submit1'(event){
    event.preventDefault();
    Router.go('gaugeone');
  },
  'submit .submissions1'(event){
    event.preventDefault();
    Router.go('gaugeonesubmission');
  },
});

Template.GuestNavOne.events({
  'submit .submitGuest1'(event){
    event.preventDefault();
    Router.go('gaugeone');
  },
  'submit .submissionsGuest1'(event){
    event.preventDefault();
    Router.go('gaugeonesubmission');
  },
});

Template.NavTwo.events({
  'submit .submit2'(event){
    event.preventDefault();
    Router.go('gaugetwo');
  },
  'submit .submissions2'(event){
    event.preventDefault();
    Router.go('gaugetwosubmission');
  },
});

Template.GuestNavTwo.events({
  'submit .submitGuest2'(event){
    event.preventDefault();
    Router.go('gaugetwo');
  },
  'submit .submissionsGuest2'(event){
    event.preventDefault();
    Router.go('gaugetwosubmission');
  },
});

Template.NavThree.events({
  'submit .submit3'(event){
    event.preventDefault();
    Router.go('gaugethree');
  },
  'submit .submissions3'(event){
    event.preventDefault();
    Router.go('gaugethreesubmission');
  },
});

Template.GuestNavThree.events({
  'submit .submitGuest3'(event){
    event.preventDefault();
    Router.go('gaugethree');
  },
  'submit .submissionsGuest3'(event){
    event.preventDefault();
    Router.go('gaugethreesubmission');
  },
});

Template.NavNotificationSettings.events({
  'submit .notifsettings'(event){
    event.preventDefault();
    Router.go('notificationSettings');
  },
});

Template.gaugeonesubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.gaugeonesubmission.events({
  'submit .gaugeOneSubmit'(event){
    event.preventDefault();
    Router.go('gaugeone');
  },
});

Template.gaugetwosubmission.events({
  'submit .gaugeTwoSubmit'(event){
    event.preventDefault();
    Router.go('gaugetwo');
  },
});

Template.gaugetwosubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.gaugethreesubmission.helpers({
    submitted_data() {
        // Show newest tasks at the top
        return Submitted_Data.find({}, { sort: { createdAt: -1 } });
    },
});

Template.gaugethreesubmission.events({
  'submit .gaugeThreeSubmit'(event){
    event.preventDefault();
    Router.go('gaugethree');
  },
});

Template.gaugeonesubmission.onRendered(function() {
  var testVal = Submitted_Data.find({gaugename: "RioDeFlagAspenValleySouth"});
  var val = testVal.fetch();
  var userTestVal = Submitted_Data.find({gaugename: "RioDeFlagAspenValleySouth", meteorUserName: Meteor.user().emails[0].address});
  var userVal = userTestVal.fetch();
  var retVal = 0;
  var retVals = [];
  var userRetVals = [];
  var valLabels = [];
  var floodVals = [];
  for (var i=0; i < val.length; i++) {
      valLabels[i] = i+1;
      retVals[i] = val[i].height;
      floodVals[i] = 48;
  };
  for (var j=0; j < userVal.length; j++){
      userRetVals[j] = userVal[j].height;
  };
  var userVals = userRetVals;
  var vals = retVals;
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: valLabels,
        datasets: [
          {
            label: 'All Data',
            data: vals,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Flood',
            data: floodVals,
            backgroundColor: [
                'rgba(99, 255, 0, 0.2)',
            ],
            borderColor: [
                'rgba(99, 255, 0, 1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Your Values',
            data: userVals,
            backgroundColor: [
                'rgba(50, 50, 255, 0.2)',
            ],
            borderColor: [
                'rgba(50, 50, 255, 1)',
            ],
            borderWidth: 1
          }
      ]
    },
    options: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Water Depth'
              },
              ticks: {
                beginAtZero:true
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Submissions in Chronological Order'
              }
            }]
        }
    }
  });
});

Template.gaugetwosubmission.onRendered(function() {
  var testVal = Submitted_Data.find({gaugename: "RioDeFlagAspenValleyNorth"});
  var val = testVal.fetch();
  var userTestVal = Submitted_Data.find({gaugename: "RioDeFlagAspenValleyNorth", meteorUserName: Meteor.user().emails[0].address});
  var userVal = userTestVal.fetch();
  var retVal = 0;
  var retVals = [];
  var userRetVals = [];
  var valLabels = [];
  var floodVals = [];
  for (var i=0; i < val.length; i++) {
      valLabels[i] = i+1;
      retVals[i] = val[i].height;
      floodVals[i] = 48;
  };
  for (var j=0; j < userVal.length; j++){
      userRetVals[j] = userVal[j].height;
  };
  var userVals = userRetVals;
  var vals = retVals;
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: valLabels,
        datasets: [
          {
            label: 'All Data',
            data: vals,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Flood',
            data: floodVals,
            backgroundColor: [
                'rgba(99, 255, 0, 0.2)',
            ],
            borderColor: [
                'rgba(99, 255, 0, 1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Your Values',
            data: userVals,
            backgroundColor: [
                'rgba(50, 50, 255, 0.2)',
            ],
            borderColor: [
                'rgba(50, 50, 255, 1)',
            ],
            borderWidth: 1
          }
      ]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Water Depth'
              },
              ticks: {
                beginAtZero:true
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Submissions in Chronological Order'
              }
            }]
        }
    }
  });
});

Template.gaugethreesubmission.onRendered(function() {
  var testVal = Submitted_Data.find({gaugename: "SICCS"});
  var val = testVal.fetch();
  var userTestVal = Submitted_Data.find({gaugename: "SICCS", meteorUserName: Meteor.user().emails[0].address});
  var userVal = userTestVal.fetch();
  var retVal = 0;
  var retVals = [];
  var userRetVals = [];
  var valLabels = [];
  var floodVals = [];
  for (var i=0; i < val.length; i++) {
      valLabels[i] = i+1;
      retVals[i] = val[i].height;
      floodVals[i] = 48;
  };
  for (var j=0; j < userVal.length; j++){
      userRetVals[j] = userVal[j].height;
  };
  var userVals = userRetVals;
  var vals = retVals;
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: valLabels,
        datasets: [
          {
            label: 'All Data',
            data: vals,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Flood',
            data: floodVals,
            backgroundColor: [
                'rgba(99, 255, 0, 0.2)',
            ],
            borderColor: [
                'rgba(99, 255, 0, 1)',
            ],
            borderWidth: 1
          },
          {
            label: 'Your Values',
            data: userVals,
            backgroundColor: [
                'rgba(50, 50, 255, 0.2)',
            ],
            borderColor: [
                'rgba(50, 50, 255, 1)',
            ],
            borderWidth: 1
          }
      ]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Water Depth'
              },
              ticks: {
                beginAtZero:true
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Submissions in Chronological Order'
              }
            }]
        }
    }
  });
});

Template.gaugeone.onRendered(function(){
    var docWidth = $(document).width();
    $( function() {
        $( "#draggable-top" ).draggable({axis: 'y', containment : "#inputoutput" });
    });

    $( function() {
        $( "#draggable-bottom" ).draggable({axis: 'y', containment : "#inputoutput" });
    });


    imgElement = document.getElementById('imageSrc');
    imgElement.onload = function(){
        success = setTimeout(analyzeImage, 5);
        if (success == -1 || success == -2){
            window.alert("Unable to find enough stripes in the image, please take a new photo");
            x.style.display = "none";
        }else{
            x.style.display = "block";
        }
    }
    var x = document.getElementById("submitButton");
    x.style.display = "none";
});

Template.gaugeone.events({
   'click .starter': function(e, instance){
       window.alert("Please zoom in so that the pole is as large as possible while still remaining on the screen");

          e.preventDefault();

          var cameraOptions = {
            quality: 100,
            correctOrientation: true,
            allowEdit: false,
            destinationType: 1,
            saveToPhotoAlbum: false
          };
          try{
             MeteorCamera.getPicture(cameraOptions, function (error, data) {
                 if (!error) {
                     imgElement.src = data;
                     let my_px = 100; //Math.floor(document.width*.5);
                     window.alert("docwidth = " +docWidth);
                     my_px = Math.floor(docWidth*2);
                     imgElement.width = my_px;
                 }
             });
          }catch(err){
              console.log(err);
          }
    },

    'submit .user_submission'(event) {
        let gaugename = "RioDeFlagAspenValleySouth";
        // Prevent default browser form submit
        event.preventDefault();

        // OpenCV variables
        let myTuple = getPos();
        let newBot = myTuple[0];
        let newTop = myTuple[1];
        let ratio = myTuple[2] / pole_px;
        let newH = real_height_of_pole - (totalH * ratio);
        if(newH < 0){
            window.alert("Something went wrong: newH == :"+newH+"\nSetting newH to 0");
            newH = 0;
          }
        window.alert("Height of visible pole: "+totalH+" inches; Water depth: "+newH+" inches");

        const target = event.target;
        const image = "";//target.image.value;
        var meteorUserName = Meteor.user().emails[0].address;

        try{
          var geolocationCoord = Geolocation.latLng();
          var geoLat = geolocationCoord.lat;
          var geoLong = geolocationCoord.lng;
        }catch(err){
          var geoLat = null;
          var geoLong = null;
        }
        let height = newH;
        // Insert all user submitted data to db collection

        try{
          Submitted_Data.insert({
              gaugename,
              meteorUserName,
              geoLat,
              geoLong,
              height,
              image,
              createdAt: new Date(), // current time
          });
        }catch(err){
          window.alert(err);
        }
        Router.go('gaugeonesubmission');
    }
});

Template.gaugetwo.onRendered(function(){
    var docWidth = $(document).width();
    $( function() {
        $( "#draggable-top" ).draggable({axis: 'y', containment : "#inputoutput" });
    });

    $( function() {
        $( "#draggable-bottom" ).draggable({axis: 'y', containment : "#inputoutput" });
    });


    imgElement = document.getElementById('imageSrc');
    imgElement.onload = function(){
        success = setTimeout(analyzeImage, 5);
        if (success == -1 || success == -2){
            window.alert("Unable to find enough stripes in the image, please take a new photo");
            x.style.display = "none";
        }else{
            x.style.display = "block";
        }
    }
    var x = document.getElementById("submitButton");
    x.style.display = "none";
});


Template.gaugetwo.events({
     'click .starter': function(e, instance){
       window.alert("Please zoom in so that the pole is as large as possible while still remaining on the screen");

          e.preventDefault();

          var cameraOptions = {
            quality: 100,
            correctOrientation: true,
            allowEdit: false,
            destinationType: 1,
            saveToPhotoAlbum: false
          };
          try{
             MeteorCamera.getPicture(cameraOptions, function (error, data) {
                 if (!error) {
                     imgElement.src = data;
                     let my_px = 100; //Math.floor(document.width*.5);
                     window.alert("docwidth = " +docWidth);
                     my_px = Math.floor(docWidth*2);
                     imgElement.width = my_px;
                     /*
                     imgElement.style.display = 'block';
                     imgElement.src = "data:image/jpeg;base64," + data;
                     */
                 }
             });
          }catch(err){
              console.log(err);
          }
    },

    'submit .user_submission'(event) {
        let gaugename = "RioDeFlagAspenValleyNorth";
        // Prevent default browser form submit
        event.preventDefault();

        // OpenCV variables
        let myTuple = getPos();
        let newBot = myTuple[0];
        let newTop = myTuple[1];
        let ratio = myTuple[2] / pole_px;
        let newH = real_height_of_pole - (totalH * ratio);
        if(newH < 0){
            window.alert("Something went wrong: newH == :"+newH+"\nSetting newH to 0");
            newH = 0;
          }
        window.alert("Height of visible pole: "+totalH+" inches; Water depth: "+newH+" inches");

        const target = event.target;
        const image = "";//target.image.value;
        var meteorUserName = Meteor.user().emails[0].address;

        try{
          var geolocationCoord = Geolocation.latLng();
          var geoLat = geolocationCoord.lat;
          var geoLong = geolocationCoord.lng;
        }catch(err){
          var geoLat = null;
          var geoLong = null;
        }
        let height = newH;
        // Insert all user submitted data to db collection

        try{
          Submitted_Data.insert({
              gaugename,
              meteorUserName,
              geoLat,
              geoLong,
              height,
              image,
              createdAt: new Date(), // current time
          });
        }catch(err){
          window.alert(err);
        }
        Router.go('gaugetwosubmission');
    }
});

Template.gaugethree.onRendered(function(){
    var docWidth = $(document).width();
    $( function() {
        $( "#draggable-top" ).draggable({axis: 'y', containment : "#inputoutput" });
    });

    $( function() {
        $( "#draggable-bottom" ).draggable({axis: 'y', containment : "#inputoutput" });
    });


    imgElement = document.getElementById('imageSrc');
    imgElement.onload = function(){
        success = setTimeout(analyzeImage, 5);
        if (success == -1 || success == -2){
            window.alert("Unable to find enough stripes in the image, please take a new photo");
            x.style.display = "none";
        }else{
            x.style.display = "block";
        }
    }
    var x = document.getElementById("submitButton");
    x.style.display = "none";
});

Template.gaugethree.events({
   'click .starter': function(e, instance){
       window.alert("Please zoom in so that the pole is as large as possible while still remaining on the screen");

          e.preventDefault();

          var cameraOptions = {
            quality: 100,
            correctOrientation: true,
            allowEdit: false,
            destinationType: 1,
            saveToPhotoAlbum: false
          };
          try{
             MeteorCamera.getPicture(cameraOptions, function (error, data) {
                 if (!error) {
                     imgElement.src = data;
                     let my_px = 100; //Math.floor(document.width*.5);
                     window.alert("docwidth = " +docWidth);
                     my_px = Math.floor(docWidth*2);
                     imgElement.width = my_px;
                     /*
                     imgElement.style.display = 'block';
                     imgElement.src = "data:image/jpeg;base64," + data;
                     */
                 }
             });
          }catch(err){
              console.log(err);
          }
    },

    'submit .user_submission'(event) {
        let gaugename = "SICCS";
        // Prevent default browser form submit
        event.preventDefault();

        // OpenCV variables
        let myTuple = getPos();
        let newBot = myTuple[0];
        let newTop = myTuple[1];
        let ratio = myTuple[2] / pole_px;
        let newH = real_height_of_pole - (totalH * ratio);
        if(newH < 0){
            window.alert("Something went wrong: newH == :"+newH+"\nSetting newH to 0");
            newH = 0;
          }
        window.alert("Height of visible pole: "+totalH+" inches; Water depth: "+newH+" inches");

        const target = event.target;
        const image = "";//target.image.value;
        var meteorUserName = Meteor.user().emails[0].address;

        try{
          var geolocationCoord = Geolocation.latLng();
          var geoLat = geolocationCoord.lat;
          var geoLong = geolocationCoord.lng;
        }catch(err){
          var geoLat = null;
          var geoLong = null;
        }
        let height = newH;
        // Insert all user submitted data to db collection

        try{
          Submitted_Data.insert({
              gaugename,
              meteorUserName,
              geoLat,
              geoLong,
              height,
              image,
              createdAt: new Date(), // current time
          });
        }catch(err){
          window.alert(err);
        }
        Router.go('gaugethreesubmission');
    }
});

var geoMarker;

// Before starting the map, we need to load the map.
Meteor.startup(function() {
    GoogleMaps.load({ key : googleMapKey });
});

// When created, we need to display the map.
Template.map.onRendered(function() {
  var self = this;

  
  GoogleMaps.ready('map', function(map) {
    var stationiInfoWindow = new google.maps.InfoWindow();

    // map.instance.setZoom(map_zoom);
    // map.instance.setCenter(marker2.getPosition());
    self.autorun(function() {
      var geolocationCoord = Geolocation.latLng();
      if (! geolocationCoord){
        for (var i = 0; i < water_stations.length; i++) {
          var water_gauge = water_stations[i];
          var marker = new google.maps.Marker({
            position: {lat: water_gauge[1], lng: water_gauge[2]},
            map: map.instance,
            draggable: false
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              stationiInfoWindow.setContent(water_stations[i][3]);
              stationiInfoWindow.open(map, marker);
            }
          })(marker, i));
        }
        return;
      }

  // If a marker has not been created, we need to create one at the user's position
  if (! geoMarker) {
    geoMarker = new google.maps.Marker({
      position: new google.maps.LatLng(geolocationCoord.lat, geolocationCoord.lng),
      map: map.instance,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
      draggable: false
    });
    for (var i = 0; i < water_stations.length; i++) {
      var water_gauge = water_stations[i];
      var marker = new google.maps.Marker({
        position: {lat: water_gauge[1], lng: water_gauge[2]},
        map: map.instance,
        draggable: false
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          stationiInfoWindow.setContent(water_stations[i][3]);
          stationiInfoWindow.open(map, marker);
        }
      })(marker, i));
    }
  }

  // If a marker has been created, set it at the user's position
  else {
    geoMarker.setPosition(geolocationCoord);
  }

  for (var i = 0; i < water_stations.length; i++) {
    var water_gauge = water_stations[i];
    var marker = new google.maps.Marker({
      position: {lat: water_gauge[1], lng: water_gauge[2]},
      map: map.instance,
      draggable: false
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        stationiInfoWindow.setContent(water_stations[i][3]);
        stationiInfoWindow.open(map, marker);
      }
    })(marker, i));
  }

  // Once it finds the position, zoom and set it to the center
  // map.instance.setZoom(map_zoom);
  //map.instance.setCenter(geoMarker.getPosition());
});
  for (var i = 0; i < water_stations.length; i++) {
    var water_gauge = water_stations[i];
    var marker = new google.maps.Marker({
      position: {lat: water_gauge[1], lng: water_gauge[2]},
      map: map.instance,
      draggable: false
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        stationiInfoWindow.setContent(water_stations[i][3]);
        stationiInfoWindow.open(map, marker);
      }
  })(marker, i));
}
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
    var geoLng = geolocationCoord.lng;
    var geoLat = geolocationCoord.lat;
    var earthRadius = 6371;
    geofenceDistance = 30;
    for (var i = 0; i < water_stations.length; i++) {
      // water_gauge_coord = water_stations[i];
      //geofenceDistance = 30;
      var geoLatRad = (geolocationCoord.lat * Math.PI)/180;
      var lat1Rad = (water_stations[i][1] * Math.PI)/180;

      var difLat = geoLat - water_stations[i][1];
      var difLng = geoLng - water_stations[i][2];

      var radLat = (difLat * Math.PI)/180;
      var radLng = (difLng * Math.PI)/180;

      var a = Math.sin(radLat/2) * Math.sin(radLat/2) +
      Math.cos(lat1Rad) * Math.cos(geoLatRad) *
      Math.sin(radLng/2) * Math.sin(radLng/2);

      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = earthRadius * c;
      var distanceMeters = d * 1000;
      return "The distance from where we are to the gauge is " + distanceMeters + "m.";
    }
    // console.log(distanceMeters);
  }
});

Template.notificationSettings.events({
  'submit .notificationTask': function(event) {
    event.preventDefault();
    var radioProximityValue = event.target.notificationProxForm.value;
    var radioToggleValue = event.target.notificationToggleForm.value;

    if (radioToggleValue == "on" && radioProximityValue == "50") {
      // var waitTime = 30000;
      // var waitTime = 300000;
      var geofenceDistance = 50;
      event.target.reset();
      calculateDistanceNotificationOnce(geofenceDistance);
      calculateDistanceNotificationMultiple(geofenceDistance);
    }
    else if (radioToggleValue == "on" && radioProximityValue == "100") {
      // var waitTime = 300000;
      var geofenceDistance = 100;
      event.target.reset();
      calculateDistanceNotification(geofenceDistance);
      calculateDistanceNotificationMultiple(geofenceDistance);
    }
    else if (radioToggleValue == "on" && radioProximityValue == "200") {
      // var waitTime = 300000;
      var geofenceDistance = 200;
      event.target.reset();
      calculateDistanceNotificationOnce(geofenceDistance);
      calculateDistanceNotificationMultiple(geofenceDistance);
    }
    // If the user decides they don't want notifications, it will not do anything
    else if (radioToggleValue == "off") {
      //return "Notifications are turned off";
      event.target.reset();
      console.log("Notifications are turned off");
    }
    else {
      console.log("Incorrect Input");
    }
  }
});

// BEGIN Draggable helper functions:
function getPos(){
    let dragtop = $( "#draggable-top").position().top;
    let dragbottom = $( "#draggable-bottom").position().top;
    let usrIm = $("#imageSrc").position().top;
    let top = Math.min(dragtop, dragbottom);
    let bottom = Math.max(dragtop, dragbottom);

    let drag_height = $( "#draggable-top").height();
    let drag_offset_y = drag_height/2;

    top = top - usrIm+drag_offset_y;
    bottom = bottom - usrIm + drag_offset_y;

    let newdif = bottom - top;
    return [top, bottom, newdif];
}

function setPos(pos_array){
    let x1 = pos_array[0];
    let x2 = pos_array[1];
    let y1 = pos_array[2];
    let y2 = pos_array[3];

    let drag_width = $( "#draggable-top").width();
    let drag_height = $( "#draggable-top").height();
    let drag_offset_x = drag_width/2;
    let drag_offset_y = drag_height/2;

    let new_x = (x1+x2)/2;
    // let new_y = (y1+y2)/2;

    debug("Width: "+drag_width+" Height: "+drag_height);

    let usrIm = $("#imageSrc").position().top;
    let usrIm_y = $("#imageSrc").position().left;

    let top_y = y1+usrIm-drag_offset_y;
    let bottom_y = y2+usrIm-drag_offset_y;
    let both_left = new_x+usrIm_y-drag_offset_x;

    $( "#draggable-top").css({top:top_y, left:both_left});
    $( "#draggable-bottom").css({top:bottom_y, left:both_left});

    debug("Top: "+y1+ ", Bottom: "+y2);
}
// END Draggable helper functions


// Only functions pertaining to OpenCV JS belong below this line:
function analyzeImage(){
    console.log("Started Analyzing.")
    let red_mat = cv.imread(imgElement);
    let waterline_data_red = process_image(red_mat, 'RED');
    red_mat.delete();
    if (waterline_data_red[0] == null){
      window.alert("No red stripes found, please try again. Please make sure that the pole is vertically oriented within the image.");
      return -1;
    }else{
      debug("RED: Average stripe height: "+waterline_data_red[0]+"\n"+"Number of stripes: "+waterline_data_red[1]); //+"\n"+"Pole position(x1, x2, y1, y2): "+waterline_data_red[2]);
    }

    let blue_mat = cv.imread(imgElement);
    let waterline_data_blue = process_image(blue_mat, 'BLUE');
    blue_mat.delete();

    if (waterline_data_blue[0] == null){
      window.alert("No blue stripes found, please try again.");
      return -2;
    }else{
      debug("BLUE: Average stripe height: "+waterline_data_blue[0]+"\n"+"Number of stripes: "+waterline_data_blue[1]); //+"\n"+"Pole position(x1, x2, y1, y2): "+waterline_data_blue[2]);
    }

    let num_stripes = Math.floor(waterline_data_red[1] + waterline_data_blue[1]);
    let total_stripes =  num_stripes;      // 2*num_stripes - 1; // From when we only searched for red stripes
    var real_height_guess =  real_stripe_height*total_stripes;

    let newPos = waterline_data_red[2];

    // setPos(waterline_data[2]);
    let y1 = Math.min( waterline_data_red[2][2], waterline_data_blue[2][2]);
    let y2 = Math.max( waterline_data_red[2][3], waterline_data_blue[2][3]);
    newPos[2] = y1;
    newPos[3] = y2;
    setPos(newPos);

    // Globals :(
    pole_px = y2 -y1;
    totalH = real_height_guess;
    debug("Algorithm height guess(px) " + pole_px);
    // window.alert("Algorithm height guess(px) " + pole_px);
    myPoleCoords = newPos;
    window.alert("Please drag the bars to the top and bottom of the pole");
}

function process_image(original_image, target_color){ //Pass an image to the function
    try{
      let ret_list = _process_image(original_image, target_color);
      return ret_list;
    }catch(err){
      debug(err);
      debug("No stripes found.");
      return null;
    }
}

function _process_image(original_image, target_color){ //Could also pass an image to the function
  var return_list = [];

  var image = new cv.Mat();
  cv.cvtColor(original_image, image, cv.COLOR_RGBA2BGR);
  //var image = original_image;
  var width = image.size().width;
  var height = image.size().height;

  var gimg  = cv.Mat.zeros(height, width, cv.CV_8UC1);
  cv.cvtColor(image, gimg, cv.COLOR_BGR2GRAY);
  debug(gimg.data);

  debug("Image: ("+image.size().width+", "+image.size().height+", "+image.channels()+"\n");
  debug("Grayscale Image: ("+gimg.size().width+", "+gimg.size().height+", "+gimg.channels()+"\n");

  // extract the color channels

  var red = cv.Mat.zeros(height, width, cv.CV_8UC1);
  var green = cv.Mat.zeros(height, width, cv.CV_8UC1);
  var blue  = cv.Mat.zeros(height, width, cv.CV_8UC1);

  var colors = new cv.MatVector();
  cv.split(image, colors);

  // order is BGR
  red   = colors.get(2);
  green = colors.get(1);
  blue  = colors.get(0);

  // Must delete matrices once you are sure that you will not use them again.
  // Matrices are allocated using the Emscripten heap and must be deallocated using .delete
  // Works on:
  // --> cv.Mat()
  // --> cv.MatVector()
  // --> cv.OtherShit()

  colors.delete();

  debug("Red:   ("+String(red.size().width)+ ", "+String(red.size().height)+", "+String(red.channels())+")");
  debug("Green:   ("+String(green.size().width)+ ", "+String(green.size().height)+", "+String(green.channels())+")");
  debug("Blue:   ("+String(blue.size().width)+ ", "+String(blue.size().height)+", "+String(blue.channels())+")");

  // calculate the sum
  // 16 bit as it has to store up to 255 + 255 + 255 (white)
  //
  var sum = new cv.Mat(height, width, cv.CV_16UC1);
  //Mat acc(height,width,CV_32FC3,Scalar::all(0));

  debug("Sum: ("+String(sum.size().width)+", "+String(sum.size().height)+", "+String(sum.channels())+")");

  debug("Sum: ("+String(sum.size().width)+", "+String(sum.size().height)+", "+String(sum.channels())+")");
  var addition_mask = new cv.Mat.ones(height, width, cv.CV_8UC1);
  cv.add(red,   sum, sum, addition_mask, cv.CV_16UC1);
  cv.add(green, sum, sum, addition_mask,  cv.CV_16UC1);
  cv.add(blue, sum, sum, addition_mask, cv.CV_16UC1);

  // calculate the percentage of target_color
  let ptc = PERCENT_TARGET_COLOR;
  var percentage = cv.Mat.zeros(height, width, cv.CV_64FC1);//CV_64FC1
  ///window.alert(target_color);
  if(target_color == 'RED'){
      cv.divide(red, sum, percentage, 1.0, cv.CV_64FC1);//CV_64FC1
      ptc = .50;

  }else if(target_color == 'BLUE'){
      cv.divide(blue, sum, percentage, 1.0, cv.CV_64FC1);//CV_64FC1
      ptc = .34;
  }else{
    console.log("Invalid color choice");
    return -1;
  }

  var mask = cv.Mat.zeros(height, width, cv.CV_8UC1);

  try{
    cv.compare(percentage, new cv.matFromArray(1, 1, cv.CV_64FC1, [ptc]), mask, cv.CMP_GT); //Was "...new cv.Scalar(PERCENT_TARGET_COLOR)..."
  }catch(err){
    window.alert("Failed to compare!");
    debug(err);
    return -1;
  }

  try{
    debug("Results\n");
    randInt = 0;
    for (i = 0; i < height; i++) // only first couple
    {
        if(target_color == 'RED'){
          console.log("%d: %10f / %10f = %10f (%10f) \n", i+1, red.ucharPtr(i, randInt)[0],
                  sum.ushortPtr(i, randInt)[0],
                  percentage.doublePtr(i, randInt)[0],
                  mask.ucharPtr(i, randInt)[0]);

        }else if(target_color == 'BLUE'){

          console.log("%d: %10f / %10f = %10f (%10f) \n", i+1, blue.ucharPtr(i, randInt)[0],
                  sum.ushortPtr(i, randInt)[0],
                  percentage.doublePtr(i, randInt)[0],
                  mask.ucharPtr(i, randInt)[0]);
        }else{
          debug("'"+target_color+"' is not a valid color option");
          return -1;
        }
    }
  }catch(err){
    debug("Failed to print color percentages!");
    debug(err);
  }
  // Everything above works just fine


  //Written by Ryan: //cv.imwrite(prefix + "target_color_mask_no_processing.png", mask);
  // dilate the image to remove small light reflections
  // see image file 1575 for an example of this
  // objects around a width of 10 should be removed (e.g light reflections)
  var target_color_areas = mask.clone();
  var erosion_kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5)); // width, height
  cv.erode(mask, mask, erosion_kernel);

  // bring it back to cover original areas
  var dilate_kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  cv.dilate(mask, mask, dilate_kernel);
  cv.bitwise_and(target_color_areas, mask, mask);



  //Written by Ryan: //cv.imwrite(prefix + "target_color_mask_imperfections_processing.png", mask);
  // solidity filter
  var contours = new cv.MatVector();
  var hierarchy = new cv.Mat();
  try{
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    debug("Found Contours");
  }catch(err){
    debug(mask.type());
    debug("Failed to find contours");
    debug(err);
    return -1;
  }
  // area of image that is interesting and of the proper 'target_color'
  var target_color_mask = cv.Mat.zeros(image.size(), cv.CV_8UC1);
  //Mat red_out = Mat.zeros(image.size(), cv.CV_8UC3);

  var areas_of_interest = [];
  var sum_height = 0;
  var number_of_stripes = 0.0001; // prevent division by zero
  // copies to target_color_mask, results
  debug("Contours.size() = " + contours.size());
  for (i = 0; i < contours.size(); i++)
  {
      var c = contours.get(i);
      var object_rect = cv.boundingRect(c);
      var contour_mask = cv.Mat.zeros(image.size(), cv.CV_8UC1); // canvas to copy only the contour on
      // but drawContours seems to need the same size
      // receiving mat as the mat from which the
      // contours were generated from
      // probably because of MAtOfPoint is in reference
      // to points on original image
      cv.drawContours(contour_mask, contours, i, new cv.Scalar(255), -1);
      // now move only the small area

      try{
          var object = cv.Mat.zeros(object_rect.width, object_rect.height, cv.CV_8UC1);
          // isolated contour
          contour_mask.roi(object_rect).copyTo(object); //replaced "submat" with "roi"
      }catch(err){
          console.log(err);
          return -1;
      }

      //Imgcodecs.imwrite(prefix+"object"+i+".png", object);
      // area of the contour is moment 00
      var area = cv.contourArea(c);
      ///window.alert(area);
      // filter out objects that have an area < 250(original algorithm)
      console.log(area);
      // window.alert("Area: " + area);
      if (area >= 75) {
          console.log("Object Parameters: (x:%4d y:%4d) %4d x %4d = %5f\n",
                  object_rect.x,
                  object_rect.y,
                  object.size().width,
                  object.size().height,
                  area);

          // calculate soliditiy
          var solidity = calculate_soliditiy(c);
          ///window.alert("Solidity: " + solidity);

          // filter out solidities less than 0.5
          // so non squarish masks
          // window.alert(solidity);
          if (solidity >= 0.5) {
              // now run a scanning window to make sure there is a neighbor
              // stripe above or below
              console.log("Image: (%d,%d)\n", image.size().width, image.size().height);
              // now run target_color scanning window
              var rect = object_rect;
              height = rect.height;
              width = rect.width;
              // get the area above it (top)
              var window_height = height * 4;
              var x1 = rect.x;
              var y1 = rect.y - window_height;
              if (y1 < 0) {
                  window_height = rect.y;
                  y1 = 0;
              }

              var top_rect = new cv.Rect(x1, y1, width, window_height);
              debug("Top:    (%d,%d,%d,%d)\n", x1, y1, width, window_height);

              // bottom
              window_height = height * 4; // reset it incase it was clip on the top view
              x1 = rect.x;
              y1 = rect.y + height;
              if (y1 > image.size().height) {
                  y1 = image.size().height;
              }
              if ((y1 + window_height) > image.size().height) {
                  window_height = image.size().height - y1;
              }
              var bottom_rect = new cv.Rect(x1, y1, width, window_height);
              debug("Bottom: (%d,%d,%d,%d)\n", x1, y1, width, window_height);

              var top = mask.roi(top_rect);  //replaced "submat" with "roi"
              var bottom = mask.roi(bottom_rect);    //replaced "submat" with "roi"

              var t_px = cv.countNonZero(top);
              var b_px = cv.countNonZero(bottom);
              debug("Area:          %f\n", area);
              debug("Top Pixels:    %f\n", t_px);
              debug("Bottom Pixels: %f\n", b_px);
              debug("Shift: %f\n", (area * 0.5));
              debug("Top Diff:    %b\n", t_px > (area * 0.5));
              debug("Bottom Diff: %b\n", b_px > (area * 0.5));
              if ((t_px > (area * 0.5)) ||
                      (b_px > (area * 0.5))) {

                  // Used in the original debugging/development process
                  // var red_out = cv.Mat.zeros(image.size(), cv.CV_8UC3);

                  areas_of_interest.push(rect);

                  var sub = target_color_mask.roi(rect);  //replaced "submat" with "roi"
                  object.copyTo(sub);

                  // calculate average height of a stripe
                  sum_height = sum_height + rect.height;
                  number_of_stripes = number_of_stripes + 1;
                  // window.alert("New Stripe found!");
                  //Imgcodecs.imwrite(prefix+"target_color_mask_solidity"+i+".png", red_out);
              }
          }
      }
  }

  // calculate the average kept object height
  var average_height = sum_height / number_of_stripes;
  console.log("Sum of stripe height: %f\n", sum_height);
  console.log("Number of stripes: %f\n", number_of_stripes);

  debug("First push to 'return_list':\n average_height\n number_of_stripes");

  return_list.push(average_height);
  return_list.push(number_of_stripes);

  // record filtering of windowing and soliditiy

  // OLD: cv.multiply(target_color_mask, new cv.Scalar(255.0), target_color_mask);
  // NEW:
  cv.multiply(target_color_mask, new cv.matFromArray(1, 1, cv.CV_64FC1, [255.0]), target_color_mask);
  //Written by Ryan: ////Written by Ryan: //cv.imwrite(prefix+"target_color_mask_solidity.png", target_color_mask);

  // detect if no pole is present
  if (average_height < 10 || number_of_stripes < 2)
  {
      console.log("Average Height: %f\n", average_height);
      console.log("Stripes: %f\n", number_of_stripes);
      console.log("No Poll Found. Sorry.\n");
      return -1;
  }

  // isolate biggest grouping
  // dilate near groups together

  var kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, Math.round(average_height*5))); // * 5 because avg_height could be inaccurate

  var dilate_mask = new cv.Mat();
  cv.dilate(target_color_mask, dilate_mask, kernel);

  //Written by Ryan: //cv.imwrite(prefix+"dilate_mask.png", dilate_mask);

  // find biggest section
  // label contours and find the one with the biggest height
  var big_contours = new cv.MatVector();
  cv.findContours(dilate_mask, big_contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  var length = 0;
  var biggest_contour = null;
  var index = 0;

  for (i = 0; i < big_contours.size(); i++)
  {
      var blob_length = cv.boundingRect(big_contours.get(i)).height;
      if (blob_length > length)
      {
          biggest_contour = big_contours.get(i);
          length = blob_length;
          index = i;
      }
  }
  // copy over the biggest dilation
  // create a mask the same size as the image
  // but with only the biggest object on it
  var biggest_area_mask = cv.Mat.zeros(image.size(), cv.CV_8UC1);
  console.log("%s\n", biggest_area_mask.size().toString());
  // submat based on bounding rect not a tight contour boundary
  var bbox = cv.boundingRect(biggest_contour);
  // copy over just the bounding box area
  var cont = dilate_mask.roi(cv.boundingRect(biggest_contour)); //replaced "submat" with "roi"
  // draw the big contour on to the mat as white, -1 thickness means fill
  cv.drawContours(biggest_area_mask, big_contours, index, new cv.Scalar(1), -1);

  // OLD:
  // ---cv.multiply(biggest_area_mask, new cv.Scalar(255.0), biggest_area_mask);
  // NEW:
  cv.multiply(biggest_area_mask, new cv.matFromArray(1, 1, cv.CV_64FC1, [255.0]), biggest_area_mask);
  //Written by Ryan: //cv.imwrite(prefix+"biggest_area_mask.png", biggest_area_mask);

  // side clean
  var side_kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, average_height)); // width, height
  cv.erode(biggest_area_mask, biggest_area_mask, side_kernel);
  cv.dilate(biggest_area_mask, biggest_area_mask, side_kernel);
  cv.bitwise_and(biggest_area_mask, target_color_mask, target_color_mask);
  cv.multiply(biggest_area_mask, new cv.matFromArray(1, 1, cv.CV_64FC1, [255.0]), biggest_area_mask);
  //Written by Ryan: //cv.imwrite(prefix+"side_clean.png", biggest_area_mask);

  cv.multiply(biggest_area_mask, new cv.matFromArray(1, 1, cv.CV_64FC1, [255.0]), biggest_area_mask);
  //Written by Ryan: //cv.imwrite(prefix+"rotated.png", biggest_area_mask);

  cv.multiply(mask, new cv.matFromArray(1, 1, cv.CV_64FC1, [255.0]), mask);
  cv.multiply(dilate_mask, new cv.matFromArray(1, 1, cv.CV_64FC1, [255.0]), dilate_mask);

  //Written by Ryan: //cv.imwrite(prefix+"mask.png", mask);
  //Written by Ryan: //cv.imwrite(prefix+"rotated_image.png", image);
  //Written by Ryan: //cv.imwrite(prefix+"dilate_mask.png", dilate_mask);
  //Written by Ryan: //cv.imwrite(prefix+"target_color_mask_cleaned.png", target_color_mask);

  // now find coordinates of the pole
  // defaults, the 1 coords are left most
  // the 2s are right most
  var pole_x1 = image.size().width;
  var pole_x2 = 0;
  var pole_y1 = image.size().height;
  var pole_y2 = 0;
  var pole_contours = new cv.MatVector();

  cv.findContours(target_color_mask, pole_contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  // re do stripe calculations with cleaned image
  sum_height = 0;
  number_of_stripes = 0;
  for (i = 0; i < pole_contours.size(); i++)
  {
      var c = pole_contours.get(i);
      var rect = cv.boundingRect(c);

      // stripe height
      sum_height = sum_height + rect.height;
      number_of_stripes = number_of_stripes + 1;

      // check if we need to update any coords
      if (rect.x < pole_x1)
      {
          pole_x1 = rect.x;
      }
      if (rect.y < pole_y1)
      {
          pole_y1 = rect.y;
      }
      if ((rect.x + rect.width) > pole_x2)
      {
          pole_x2 = rect.x + rect.width - 1;
      }
      if ((rect.y + rect.height) > pole_y2)
      {
          pole_y2 = rect.y + rect.height - 1;
      }
  }
  average_height = sum_height / number_of_stripes;

  debug("Final push to 'return_list':\n Pole location");
  return_list.push([pole_x1, pole_x2, pole_y1, pole_y2]);

  console.log("Pole is located at %d %d %d %d\n", pole_x1, pole_x2, pole_y1, pole_y2);
  console.log("Pole shit:");
  return return_list;
}

function calculate_soliditiy(c){
  // basic formula, uses opencv's method
  //------------------------------------------------------------------------------------
  // JavaScript:
  // Taken from: https://docs.opencv.org/3.3.1/da/dc1/tutorial_js_contour_properties.html
  var hull = new cv.Mat();
  var area = cv.contourArea(c, false);
  cv.convexHull(c, hull, false, true);
  var hullArea = cv.contourArea(hull, false);
  var solidity = area / hullArea;
  return solidity;
}

function debug(stuff){
  if (DEBUG)
  {
    console.log(stuff);
  }
}
