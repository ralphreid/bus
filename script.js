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


  });


    // Define bus stops api 

  // ne = "51.52783450,-0.04076115";
  // sw = "51.51560467,-0.10225884";

  positionlat = 51.52783450;
  positionlng = -0.04076115;

  factor = 0.0089982311916;

  ne = [positionlat + factor, positionlng + factor];
  sw = [positionlat - factor, positionlng - factor];


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

  bus_stops_request(ne, sw);

  

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








})













