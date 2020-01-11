function createMap(earthquakes) {
  //tile layer that will be background of the map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  //baseMaps object to hold the lightmap layer
  var baseMaps = {
    "light Map":lightmap
  };

  //An overlayMaps object to hold the earthquake layer
  var overlayMaps = {
    "Earthquake data":earthquakes
  };

  //map object with options
  var map = L.map("map", {
    center: [43.8041, -120.5542],
    zoom:4,
    layers:[lightmap, earthquakes]
  })

  L.control.layers(baseMaps, overlayMaps,{
    collapsed:false
  }).addTo(map)
}
// Store our API endpoint inside queryUrl
function createMarkers(earthquakeData){

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  
  function markerSize(mag){
    return mag*20000
  }

  function markerColor(mag){
  var color = ["Chocolate", "Coral", "Orange", "Gold", "Greenyellow", "limegreen"];
  
  if (mag >5){
    return color[0]
  }else if (mag >4){
    return color[1]
  }else if (mag >3){
    return color[2]
  }else if (mag >2){
    return color[3]
  }else if (mag >1){
  return color[4]
  }else {
  return color[5]}
  }
  
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng){
      return new L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 0.8,
        color:"grey",
        weight:0.5

      })
    }
  });

  //Set up legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"],
    labels = [];

  for (var i = 0; i< categories.length; i++){
    div.innerHTML +=
    labels.push(
      '<i class= "circle" style="background:'+ markerColor(categories[i]+ '"></i>'+
      (categories[i] ? categories[i]: '+')));
  }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  };

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);


// queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 
// // Perform a GET request to the query URL
// d3.json(queryUrl, function(data) {
//   var features = data.features
//   console.log(features)
//   // Once we get a response, send the data.features object to the createFeatures function
//   for(var i = 0; i<features.length; i++){
//     var mag = data.features[i].properties.mag
//     console.log(mag)
//   }

//   //createFeatures(data.features);
// });
