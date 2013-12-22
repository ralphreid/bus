$(function(){


  // google maps functions

  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(51.508, -0.120),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  canvas = document.getElementById("googleMap");
  map = new google.maps.Map(canvas, mapOptions);

  function updateLocation(position) {
    var coords = position.coords;
    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
    bounded_box_ne(coords.latitude, coords.longitude);
    bounded_box_sw(coords.latitude, coords.longitude);
    bus_stops_request(ne, sw);

    var marker = new google.maps.Marker({
      position: latlng,
      map: map
    })
    map.setCenter(latlng);
    map.setZoom(17);
  }

  function handleErrorLocation(error) {
    console.log(error);
  }

  $('#current_location').on('click', function() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(updateLocation, handleErrorLocation);
      navigator.geolocation.watchPosition(updateLocation, handleErrorLocation);
    } else {
      alert("Can not find location");
    }
  })

  // Autocomplete
  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map
  });

  var input = document.getElementById('autocomplete');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo("bounds", map);

  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    var place = autocomplete.getPlace();
    marker.setVisible(false);
    infowindow.close();

    if(place.geometry.viewport){
      map.fitBounds(place.geometry.viewport)
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(18);
    }

    marker.setIcon({
      url: place.icon
    });
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = "";
    if(place.address_components) {
      address = (place.address_components[0] && place.address_components[0].short_name || "")
    };

    infowindow.setContent("<div>"+place.name+"</div><br />" + address);
    infowindow.open(map, marker);
    // console.log(place.address_components);
    console.log(place.geometry.location.nb);
    console.log(place.geometry.location.ob);
    // bounded_box_ne(coords.latitude, coords.longitude);
    // bounded_box_sw(coords.latitude, coords.longitude);
    // bus_stops_request(ne, sw);
    // console.log("get current location");
    // console.log(coords.latitude);
    // console.log(coords.longitude);

  });

  // Calculate bounded box parameters based on simple deg calculations (research recommended factor of 0.0089982311916)
  // http://gis.stackexchange.com/questions/19760/how-do-i-calculate-the-bounding-box-for-given-a-distance-and-latitude-longitude

  factor = 0.0049982311916;

  function bounded_box_ne (positionlat, positionlng){
    return ne = [positionlat + factor, positionlng + factor];
  }

  function bounded_box_sw (positionlat, positionlng){
    return sw = [positionlat - factor, positionlng - factor];
  }

  // Define bus stops api 

  function bus_stops_api_url(northEast, southWest){
    var callback_name = "callback=bus_stops";
    var url = "http://digitaslbi-id-test.herokuapp.com/bus-stops";
  
    return [url, "?", "northEast=", northEast, "&", "southWest=", southWest,].join("")
  }

  function bus_stops_request(northEast, southWest){
    var url = bus_stops_api_url(northEast, southWest);
    $.ajax({
      type: "GET",
      url: url,
      jsonpCallback: 'bus_stops',
      dataType: 'jsonp',
        success:function(data){
          console.log(data);
        }
    });
    
  }


  
  

  // Place Bus Stop Markers

  function create_bus_stop_markers(){
    var myLatlng = new google.maps.LatLng(51.536086,-0.153809);

    var marker = new google.maps.Marker({
      map: map,
      title:"Hello World!",
      position: myLatlng
    })

  }

  // List Arrial Data for Near-by Buses




// testing area

// plat = 51.52783450;
// plng = -0.04076115;

// bounded_box_ne (plat, plng);
// bounded_box_sw (plat, plng);

// bus_stops_request(ne, sw);






})













