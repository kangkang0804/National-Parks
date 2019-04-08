/* eslint-disable */
console.warn('Project One JS Initialized');


let marker;
var initialLocationLat = 0
var initialLocationLon = 0
var localWeather = []

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
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

    // var geocoder = new google.maps.Geocoder;
    // geocoder.geocode({ 'address': 'United States' }, function (results, status) {
    //     console.log(results);
    //     if (status === 'OK') {
    //         map.setCenter(results[0].geometry.location);
    //         new google.maps.Marker({
    //             map: map,
    //             position: results[0].geometry.location
    //         });
    //     } else {
    //         window.alert('Geocode was not successful for the following reason: ' +
    //             status);
    //     }
    // });

  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      initialLocationLat = pos.lat
      initialLocationLon = pos.lng
      getWeather()
      // console.log(pos);
      // console.log(position);
      // infoWindow.setPosition(pos);
      // infoWindow.setContent('You Here');
      infoWindow.open(map);
      map.setCenter(pos);

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
  console.log(map);
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  this.directionsService = new google.maps.DirectionsService();
  this.directionsDisplay = new google.maps.DirectionsRenderer();
  this.directionsDisplay.setMap(map);
  this.directionsDisplay.setPanel(document.getElementById('right-panel'));
  const originInput = document.getElementById('origin-input');
  const destinationInput = document.getElementById('destination-input');
  const modeSelector = document.getElementById('mode-selector');

  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  originAutocomplete.setFields(['place_id']);
  console.log(originAutocomplete);

  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
  destinationAutocomplete.setFields(['place_id']);

  this.setupClickListener('changemode-walking', 'WALKING');
  this.setupClickListener('changemode-transit', 'TRANSIT');
  this.setupClickListener('changemode-driving', 'DRIVING');

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

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('origin-input').addEventListener('change', onChangeHandler);
  document.getElementById('destination-input').addEventListener('change', onChangeHandler);

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    const start = document.getElementById('origin-input').value;
    const end = document.getElementById('destination-input').value;
    console.log(start);
    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING',
    });
  }
}

AutocompleteDirectionsHandler.prototype.setupClickListener = function (
  id, mode,
) {
  const radioButton = document.getElementById(id);
  const me = this;

  radioButton.addEventListener('click', () => {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (
  autocomplete, mode,
) {
  const me = this;
  autocomplete.bindTo('bounds', this.map);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert('Please select an option from the dropdown list.');
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
  const me = this;

  this.directionsService.route(
    {
      origin: { placeId: this.originPlaceId },
      destination: { placeId: this.destinationPlaceId },
      travelMode: this.travelMode,
    },
    (response, status) => {
      if (status === 'OK') {
        me.directionsDisplay.setDirections(response);
      } else {
        window.alert(`Directions request failed due to ${status}`);
      }
    },
  );
};

$('#natParks').on('click', (event) => {
  event.preventDefault();

  // var parks = $("#").val()

  const queryURL = 'https://developer.nps.gov/api/v1/parks?api_key=PBHgGRuXeBVDJGsKN4OQQmsJPetNnYW3uwKNNRD8';

  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then((response) => {
    console.log(response);
    const results = response.data;
    console.log(results);

    for (var i = 0; i < results.length; i++){
        var state = results[i].states;
        var parkName = results[i].fullName;
        console.log(state);
        console.log(parkName);
        var fullLatLong = results[i].latLong;
        var fullLatLongSplit = fullLatLong.split(",")
        console.log(fullLatLongSplit);
        var lat = fullLatLongSplit[0];
        var lng = fullLatLongSplit[1];
        console.log(lat);
        console.log(lng);
        var website = results[i].url;
        console.log(website);
    }
  });
});

function getWeather() {
  console.log(initialLocationLat)
  console.log(initialLocationLon)
  var queryURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + initialLocationLat + '&lon=' + initialLocationLon + '&APPID=7a6b3354e50774f952a848fe125c2899'

  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(function(response) {
    console.log(response)
      var location = response.name
      // var conditions = response.weather[0].main
      var clarity = response.weather[0].description
      var temp = parseFloat(response.main.temp)
      var actualTemp = (temp - 273.5) * 9/5 +32
      var weatherIcon = response.weather[0].icon + ".png"

    var line1 = "<p>Currently in " + location
    var bckGround = 'http://openweathermap.org/img/w/' + weatherIcon
    // var line2 = "<p>" + conditions
    var line3 = "<p>Skies: " + clarity
    var line4 = "<p>Temperature: " + Math.round(actualTemp)
    $("#weather-box").append(line1)
    // $("#weather-box").append(line2)
    $("#weather-box").append(line3)
    $("#weather-box").append(line4)
    $("#weather-box").css({'background-image': 'url(' + bckGround + ')', 'background-repeat': 'no-repeat', 'background-position' : 'right', 'height' : '50%'})
    $("#input-box").append('<div class="row"><div class="col-12 input-box"><div><input id="destination-input" class="controls" type="text" placeholder="Enter a destination location"></div></div>')
  })
}
/* eslint-enable */
