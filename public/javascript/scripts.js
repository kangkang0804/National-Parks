/* eslint-disable */
console.warn('Project One JS Initialized');
function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    zoom: 12,
  });
  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
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

      const geoMarker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Current location',
      });

      geoMarker.setMap(map);
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
  var state, parkName, fullLatLong, fullLatLongSplit, lat, lng, website;
  // var parks = $("#").val()

  const queryURL = 'https://developer.nps.gov/api/v1/parks?api_key=PBHgGRuXeBVDJGsKN4OQQmsJPetNnYW3uwKNNRD8';

  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then((response) => {
    console.log(response);
    const results = response.data;
    console.log(results);

    for (var i = 0; i < results.length; i++) {
      var statesArray = [];
      state = results[i].states;
      statesArray.push(state);
      console.log(statesArray);
      parkName = results[i].fullName;
      console.log(state);
      console.log(parkName);
      fullLatLong = results[i].latLong;
      fullLatLongSplit = fullLatLong.split(",")
      console.log(fullLatLongSplit);
      lat = fullLatLongSplit[0];
      lng = fullLatLongSplit[1];
      console.log(lat);
      console.log(lng);
      website = results[i].url;
      console.log(website);

    }

  });
});
/* eslint-enable */