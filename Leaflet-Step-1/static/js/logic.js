// function to get colors for markers and the legend
function getColor(d) {
  return d > 5 ? 'OrangeRed' :
         d > 4 ? 'Coral' :
         d > 3 ? 'Orange' :
         d > 2 ? 'Gold' :
         d > 1 ? 'Greenyellow' :
                 'limegreen';
}

function createMap(earthquakes) {
  //tile layer that will be background of the map
  var lightmap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });


  //baseMaps object to hold the lightmap layer and satellite layer
  var baseMaps = {
    "light Map":lightmap,
    "Satellite Map": satellitemap
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


//adding legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
        
      div.innerHTML += "<h4 style = 'margin:4px'> Magnitude </h4>"
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += 
          '<i style="background-color:' + getColor(grades[i] +1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
    return div;
};


legend.addTo(map);
}

// Store our API endpoint inside queryUrl
function createFeatures(earthquakeData){

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function markerSize(mag){
    return mag*30000
  }
  
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng){
      return new L.circle(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.8,
        color:"grey",
        weight:0.5

      })
    }
  });
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  };

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createFeatures);





