const config = {
  apiKey: 'AIzaSyBwldV5vacrhPy7vPijBLaiTO7JGyg1P4o',
  authDomain: 'parks-n-stops.firebaseapp.com',
  databaseURL: 'https://parks-n-stops.firebaseio.com',
  projectId: 'parks-n-stops',
  storageBucket: 'parks-n-stops.appspot.com',
  messagingSenderId: '929275240522',
};

/* eslint-disable */
var opening = document.getElementById('opening-container');
opening.addEventListener('webkitAnimationEnd',function(event) {
  setTimeout(function(){
    opening.style.display = 'none';
  }, 3500)
}, false);

var initialLocationLat = 0
var initialLocationLon = 0
var route_divisor = 22000
var interestPoint = ""
var interestPoints = []
var request = {}
var place = ""
var placeLat = 0
var placeLng = 0
var placeLatLng = {}
var pos = {}
var map;
//Firebase sign-in area
firebase.initializeApp(config);

function getUserName() {
  return firebase.auth().currentUser.displayName
}
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL // || '/images/profile_placeholder.png'
}
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=40';
  }
  return url;
}
$("#sign-in").on('click', event => {
  var provider = new firebase.auth.GoogleAuthProvider()
  firebase.auth().signInWithPopup(provider)
})

$("#sign-in-btn-anon").on('click', event => {
  firebase.auth().signInAnonymously()
})

$("#sign-out-btn").on('click', event => {
  firebase.auth().signOut()
})

firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    var userName = getUserName()
    var picUrl = getProfilePicUrl()
    if (userName === null) {
      userName = "Signed in as guest"
      $("#user-pic").html('<i class="material-icons">account_circle</i>')
    }
    else if (userName != null) {
    $("#user-pic").html('<img src=' + addSizeToGoogleProfilePic(picUrl) + '>')
    }
    $("#user-name").text(userName)
    $("#sign-in").attr("hidden", "true")
    $("#sign-in-btn-anon").attr("hidden", "true")
    $("#sign-out-btn").removeAttr("hidden")
    $("#user-pic").removeAttr("hidden")
    $("#user-name").removeAttr("hidden")
  }
  else {
    $("#sign-in").removeAttr("hidden")
    $("#sign-in-btn-anon").removeAttr("hidden")
    $("#sign-out-btn").attr("hidden", "true")
    $("#user-pic").attr("hidden", "true")
    $("#user-name").attr("hidden", "true")
  }
})
//End firebase section
console.warn('Project One JS Initialized');

//Render the Map, set the marker for user location
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    zoom: 12,

styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ]
  });


  //Check that browser geolocation is on
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      //Run weather API
      initialLocationLat = pos.lat
      initialLocationLon = pos.lng
      getWeather()
      //Set center of map as current location in map div
      map.setCenter(pos);
      //Check for national parks near me when Near Me button is clicked
      $("#near-me").on("click", function () {
        var parkState, parkName, geoFullState, geoShortState;
        let geoURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.lat + ',' + pos.lng + '&key=AIzaSyC-SbdXGcSyHpgMpMQZGNp71Z_IrHxfCOI'
        $.ajax({
          url: geoURL,
          method: 'GET',
        }).then((geoResults) => {
          geoFullState = geoResults.results[0].address_components[4].long_name;
          geoShortState = geoResults.results[0].address_components[4].short_name;
          console.log(geoFullState);
          console.log(geoShortState);
        });
        const parksURL = 'https://developer.nps.gov/api/v1/parks?api_key=PBHgGRuXeBVDJGsKN4OQQmsJPetNnYW3uwKNNRD8';
        $.ajax({
          url: parksURL,
          method: 'GET',
        }).then((parkResults) => {
          var results = parkResults.data;
          for (i = 0; i < results.length; i++) {
            parkState = results[i].states;
            parkName = results[i].fullName;
            console.log(parkState);
            console.log(parkName);
          }
          if (parkState === geoShortState) {
            console.log(parkName);
          } else {
            var parksDisplayDiv = $("<p>");
            parksDisplayDiv.text("There are no National Parks in " + geoFullState);
            $("#parks-view").append(parksDisplayDiv);
          }
        })
      })
      // end function to find parks inside current state
      //Check for parks in state selected from menu
      $(".state").on("click", function () {
        var stateSelected;
        stateSelected = $(this).attr("id");
        map.setCenter();
        const parksURL = 'https://developer.nps.gov/api/v1/parks?api_key=PBHgGRuXeBVDJGsKN4OQQmsJPetNnYW3uwKNNRD8';
        $.ajax({
          url: parksURL,
          method: 'GET',
        }).then((parkResults) => {
          var results = parkResults.data;
          for (i = 0; i < results.length; i++) {
            parkState = results[i].states;
            parkName = results[i].fullName;
            website = results[i].url;
            fullLatLong = results[i].latLong;
            fullLatLongSplit = fullLatLong.split(",")
            if (stateSelected === parkState) {
              var parkNameDiv = $("<p>");
              parkNameDiv.text(parkName);
              var parkUrlDiv = $("<a>").text(website);
              parkUrlDiv.attr("href", website)
              $("#parks-view").append(parkNameDiv, parkUrlDiv);
              var fullLatLong = results[i].latLong;
              var fullLatLongSplit = fullLatLong.split(",")
              var lat = fullLatLongSplit[0];
              var lng = fullLatLongSplit[1];
            } else {
              console.log('no parks in the selected state');
            }
          }
        })
      })
      //Set marker in center of map
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: 'Current location',
        animation: google.maps.Animation.DROP,
        icon: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Push-Pin-1-Pink-icon.png'
      });

      marker.setMap(map);
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  new AutocompleteDirectionsHandler(map);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  this.directionsService = new google.maps.DirectionsService();
  this.directionsDisplay = new google.maps.DirectionsRenderer();
  this.directionsDisplay.setMap(map);
  this.directionsDisplay.setPanel(document.getElementById('right-panel'));
  const originInput = document.getElementById('origin-input');
  const destinationInput = document.getElementById('destination-input');
  const modeSelector = document.getElementById('mode-selector');
  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  originAutocomplete.setFields(['place_id']);
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
  destinationAutocomplete.setFields(['place_id']);
  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
    destinationInput,
  );
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
  const control = document.getElementById('floating-panel');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);


}

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode,) {
  const me = this;
  autocomplete.bindTo('bounds', this.map);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.place_id) {
      alert('Please select an option from the dropdown list.');
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function () {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  else if (this.originPlaceId === this.destinationPlaceId) {
    this.destinationPlaceId = ""
    alert("Please select a different destination")
  }
  const me = this;

  this.directionsService.route(
    {
      origin: { placeId: this.originPlaceId },
      destination: { placeId: this.destinationPlaceId },
      travelMode: this.travelMode,
    },
    (response, status) => {
      if (status === 'OK') {
        initRB()
        var route = response.routes[0]
        var rboxer = new RouteBoxer()
        var path = route.overview_path
        dist = route.legs[0].distance.value/route_divisor
        console.log(dist)
        boxes = rboxer.box(path, dist)
        me.directionsDisplay.setDirections(response);
        $("#interest-point").removeAttr("hidden")


      } else {
        window.alert(`Directions request failed due to ${status}`);
      }
    },
  );
};



function getWeather() {
  var queryURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + initialLocationLat + '&lon=' + initialLocationLon + '&APPID=7a6b3354e50774f952a848fe125c2899'

  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(function(response) {
    var location = response.name
    var clarity = response.weather[0].description
    var temp = parseFloat(response.main.temp)
    var actualTemp = (temp - 273.5) * 9/5 +32
    var weatherIcon = response.weather[0].icon + ".png"
    var line1 = "<p>Currently in " + location
    var bckGround = 'http://openweathermap.org/img/w/' + weatherIcon
    var line3 = "<p>Skies: " + clarity
    var line4 = "<p>Temperature: " + Math.round(actualTemp)
    $("#weather-box").append(line1)
    $("#weather-box").append(line3)
    $("#weather-box").append(line4)
    $("#weather-box").css({'background-image': 'url(' + bckGround + ')', 'background-repeat': 'no-repeat', 'background-position' : 'right', 'height' : '50%'})
    })
}
//listener for interest point
$("#interest-point").on("keypress", (event) => {
  if (event.which === 13) {
    interestPoint = $("#interest-point").val().trim()
    $("#interest-point").val("")
    getPlaces()
  }
})

function getPlaces() {

  service = new google.maps.places.PlacesService(map);

  for (i=0; i<boxes.length; i++) {
    console.log("box " + i)
    request = {
      bounds : boxes[i],
      keyword : interestPoint,
      }
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results.length)
        for (var x=0; x < results.length; x++)
          place = results[x]
          console.log(place)
          console.log("Something at: " + x)
          placeName = place.name
          placeLat = place.geometry.location.lat()
          placeLng = place.geometry.location.lng()
          pos = {
            lat: placeLat,
            lng: placeLng
          }
          createMarker()
        }

      })



  }
  function createMarker() {
    console.log("setting marker")
    const marker = new google.maps.Marker({
    position: pos,
    map,
    title: placeName,
    })
  // animation: google.maps.Animation.DROP,
  // icon: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Push-Pin-1-Pink-icon.png'
};

// marker.setMap(map);
}

/* eslint-enable */
