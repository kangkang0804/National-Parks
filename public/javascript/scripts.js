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
var stateSelected = ""
var openNow = ""
var waypoint = []
var start = {}
var end = {}
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
      locationLat = pos.lat
      locationLng = pos.lng
      getWeather()
      //Set center of map as current location in map div
      map.setCenter(pos);
      //Listener for state selection
      $(".state").on("click", function () {
        stateSelected = $(this).attr("id");
        map.setCenter();
        var stateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + stateSelected + "&key=AIzaSyC-SbdXGcSyHpgMpMQZGNp71Z_IrHxfCOI";
        $.ajax({
          url: stateURL,
          method: 'GET',
        }).then((response) => {
          var stateCoord = response.results[0].geometry.location;
          initialLocationLat = stateCoord.lat;
          initialLocationLon = stateCoord.lng;
          getWeather()
          map.setCenter(response.results[0].geometry.location);
          console.log(response.results[0].geometry.location);
          map.setZoom(6);
        });
        const parksURL = 'https://developer.nps.gov/api/v1/parks?stateCode=' + stateSelected + '&api_key=PBHgGRuXeBVDJGsKN4OQQmsJPetNnYW3uwKNNRD8';
        $.ajax({
          url: parksURL,
          method: 'GET',
        }).then((parkResults) => {
          var parkLocated = false;
          var results = parkResults.data;
          console.log(results)
          for (i = 0; i < results.length; i++) {
            var existingPark = null;
            var parkState = results[i].states;
            var parkName = results[i].fullName;
            var parkDes = results[i].designation
            var website = results[i].url;
            var parkDescription = results[i].description
            var parkWeather = results[i].weatherInfo
            var fullLatLong = results[i].latLong;
            if (fullLatLong !== "") {
              var fullLatLongSplit = fullLatLong.split(",")
              var lat = fullLatLongSplit[0];
              var lng = fullLatLongSplit[1];
              var latSplit = lat.split(":");
              var lngSplit = lng.split(":");
              var latLiteral = latSplit[1];
              var lngLiteral = lngSplit[1];
              var latLiteralInt = parseFloat(latLiteral);
              var lngLiteralInt = parseFloat(lngLiteral);
              parkLocated = true;
              var fullLatLong = results[i].latLong;
              var fullLatLongSplit = fullLatLong.split(",")
              var lat = fullLatLongSplit[0];
              var lng = fullLatLongSplit[1];
              existingPark = {
                lat: latLiteralInt,
                lng: lngLiteralInt,
              }
            }
            const parkMarker = new google.maps.Marker({
              position: existingPark,
              map: map,
              animation: google.maps.Animation.DROP,
              parkName: parkName,
              parkDescription: parkDescription,
              parkWeather: parkWeather,
              website: website,
              icon: '../static/images/forest.png',
              lat: latLiteralInt,
              lng: lngLiteralInt
            })

            parkMarker.setMap(map);
            var infowindow = new google.maps.InfoWindow()
            parkMarker.addListener('mouseover', function () {
              var html = '<div>' + '<b>' + 'Name: ' + '</b>' + parkMarker.parkName + '</div>' + '<br>' + '<div>' + '<b>' + 'Description: ' + '</b>' + parkMarker.parkDescription + '</div>' + '<br>' + '<div>' + '<b>' + 'Conditions: ' + '</b>' + parkMarker.parkWeather + '</div>'
              infowindow.setContent(html);
              infowindow.open(map, parkMarker);
            })
            parkMarker.addListener('mouseout', function () {
              infowindow.close()
            })
            parkMarker.addListener('click', function(){
              var directionsService = new google.maps.DirectionsService();
              var directionsDisplay = new google.maps.DirectionsRenderer();
              directionsDisplay.setMap(map);
              directionsDisplay.setOptions( { suppressMarkers: true } )
              directionsDisplay.setPanel(document.getElementById('right-panel'));
              endLat = parkMarker.lat
              endLng = parkMarker.lng
              calcRoute()


              function calcRoute() {
                start = {
                  lat: initialLocationLat,
                  lng: initialLocationLon
                }
                end = {
                  lat: endLat,
                  lng: endLng
                }
                var request = {
                  origin:start,
                  destination:end,
                  travelMode: 'DRIVING'
                };
                directionsService.route(request, function(response, status) {
                  if (status == 'OK') {
                    initRouteBoxer()
                    var route = response.routes[0]
                    var rboxer = new RouteBoxer()
                    var path = route.overview_path
                    dist = route.legs[0].distance.value/route_divisor
                    console.log(dist)
                    boxes = rboxer.box(path, dist)
                    directionsDisplay.setDirections(response);
                    $("#interest-point").removeAttr("hidden")
                  }
                  else {

                  }
                });
              }
            })
          }
          if (!parkLocated) {
            var modalText = 'There are no National Parks in your selected state'
            $('#modal-text').text(modalText)
            $('#alert-modal').modal('show')
          }
        })
      })
      //Set marker in center of map
      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: 'Current location',
        animation: google.maps.Animation.DROP,
        icon: '../static/images/noun_Hiker_103614r.png'
      });

      marker.setMap(map);
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
function getWeather() {
  var queryURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + initialLocationLat + '&lon=' + initialLocationLon + '&APPID=7a6b3354e50774f952a848fe125c2899'
  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(function(response) {
    $("#weather-box").text(" ");
    var location = response.name
    var clarity = response.weather[0].description
    var temp = parseFloat(response.main.temp)
    var actualTemp = (temp - 273.5) * 9/5 +32
    var weatherIcon = response.weather[0].icon + ".png"
    var line1 = "<p>State: " + location
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
    request = {
      bounds : boxes[i],
      keyword : interestPoint,
      }
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var x=0; x < results.length; x++)
          place = results[x]
          placeId = place.placeId
          placeName = place.name
          placeIcon = {
            url: place.icon,
            scaledSize: new google.maps.Size(20,20)
          }
          placeAddress = place.vicinity
          placeLat = place.geometry.location.lat()
          placeLng = place.geometry.location.lng()
          pos = {
            lat: placeLat,
            lng: placeLng
          }
          if (place.opening_hours.open_now === undefined) {
            openNow = "Unknown"
          }
          if (place.opening_hours.open_now === false) {
            openNow = "Closed"
          }
          else {
            openNow = "Open"
          }
          // createMarker()
        }
        // function createMarker() {
          const poiMarker = new google.maps.Marker({
            position: pos,
            map,
            title: placeName,
            icon: placeIcon,
            hours: openNow,
            address: placeAddress,
          })
          poiMarker.setMap(map);
          // };
        var poiInfowindow = new google.maps.InfoWindow()
        poiMarker.addListener('mouseover', function () {
          var html = '<div>' + '<b>' + 'Name: ' + '</b>' + poiMarker.title + '</div>' + '<br>' + '<div>' + '<b>' + 'Address: ' + '</b>' + poiMarker.address + '</div>' + '<br>' + '<div>' + '<b>' + 'Currently: ' + '</b>' + poiMarker.hours + '</div>'
          poiInfowindow.setContent(html);
          poiInfowindow.open(map, poiMarker);
          })
          poiMarker.addListener('mouseout', function () {
            poiInfowindow.close()
          })
          poiMarker.addListener('click', function(){
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionsDisplay.setOptions( { suppressMarkers: true } )
            directionsDisplay.setPanel(document.getElementById('right-panel'));
            poiLatLng = poiMarker.position
            calculateAndDisplayRoute()

            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
              waypoint.push({
                location: poiLatLng,
                stopover: true
              })
            }
            directionsService.route({
              origin: start,
              destination : end,
              waypoints : waypoint,
              optimizeWaypoints : true,
              travelMode : 'DRIVING'
            }, function(response, status) {
              if (status == 'OK') {
                directionsDisplay.setDirections(response)
                var route = response.routes[0]
                var summaryPanel = document.getElementById('right-panel')
                summaryPanel.innerHTML = ''
                for (var i = 0; i < route.legs.length; i++) {
                  var routeSegment = i + 1
                  summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>'
                  summaryPanel.innerHTML += route.legs[i].start_address + ' to '
                  summaryPanel.innerHTML += route.legs[i].end_address + '<br>'
                  summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>'
                }
              } else {
                console.warn('nope')
           }
          }
        )
      })
    })
  }
}
