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
// // Create a legend to display information in the bottom right
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function(map) {

//   var div = L.DomUtil.create('div','info legend'),
//       magnitudes = [0,1,2,3,4,5],
//       labels = [];

//   div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>" 
//   // loop through our density intervals and generate a label for each interval
//   for (var i=0; i < magnitudes.length; i++){
//     div.innerHTML +=
//       '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
//       magnitudes[i] + (magnitudes[i+1]?'&ndash;' + magnitudes[i+1] +'<br>': '+');
//     }
//     return div;
// };
// legend.addTo(myMap);

//Set up legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var colors = geojson.options.colors;
  var labels = [];

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
// legend.addTo(myMap);

// //Set legend
// var legend = L.control({position: "bottomright" });

// legend.onAdd = function() {
//   var div = L.DomUtil.create("div", "info legend"),
//   categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"],
//   labels = [];

// div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>" 

// for (var i = 0; i< categories.length; i++){
//   div.innerHTML +=
//     '<i style="background:'+ markerColor(categories[i])+ '"></i> '+
//     (categories[i] ? categories[i]: '+');
// }

//   div.innerHTML = labels.join('<br>');
//   return div;
// };

// legend.addTo(map);
  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  };

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

