// Function to increase the size of the earthquakes' magnitude to be seen on the map.
function radiusSize(quakeMag) {
  return quakeMag * 8000;
}

// Function to add a color array to earthquakes based on magnitude of the earthquake.
function circleColor(quakeMag) {
  if (quakeMag > 7.9) {
    return "#FF0909"
  }
  else if (quakeMag > 6.9) {
    return "#FF3209"
  }
  else if (quakeMag > 5.9) {
    return "#FF5309"
  }
  else if (quakeMag > 4.9) {
    return "#FF7C09"
  }
  else if (quakeMag > 3.9) {
    return "#FF9D09"
  }
  else {
    return "#FFD709"
  }
};

// Create a variable for the USGS API of all earthquakes within the past 7 days.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Call the API and make the data available for the createFeatures function.
d3.json(url, function(data) {
    createFeatures(data.features);
});

// Function to work with earthquake data.
function createFeatures(quakeData) {
  
  // Bind popups to each marker and add info from the API to the popups.  
  // Adjusts date to be more readible.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p> Magnitude = " + feature.properties.mag + "</p>" +
      "<hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create points based on the geoJSON data in the API.
  // Make the markers into different colored and sized circles based on the magnitude.
  var quakeLocations = L.geoJSON(quakeData, {
      pointToLayer: function(quakeData, latlng) {
        return L.circle(latlng, {
          radius: radiusSize(quakeData.properties.mag),
          color: "black",
          weight: .5,
          fillColor: circleColor(quakeData.properties.mag),
          fillOpacity: 1
        });
      },
      onEachFeature: onEachFeature
    });

  // Create a map layer of the earthquake locations
  createMap(quakeLocations);
}

// Function to create maps and add features to the map.
function createMap(quakeLocations) {
  
  // Add the 'outdoors' map from mapbox.
  var outdoormap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Add the 'satellite' map from mapbox.
  var satellitemap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Add the 'outdoors' and 'satellite' maps as base maps.
  var baseMaps = {
    "Topography Map": outdoormap,
    "Satellite Map": satellitemap
  };

  // Add the earthquake locations map layer as an overlay map.
  var overlayMaps = {
    "Earthquakes": quakeLocations
  };

  // Create a legend variable and dictate the location.
  var legend = L.control({ position: "bottomleft" });

  // Add legend attributes including the scales and the related colors.
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #FFD709"></i><span>0 - 3.9  ~  Usually not felt</span><br>';
    div.innerHTML += '<i style="background: #FF9D09"></i><span>3.9 - 4.9  ~  Often felt</span><br>';
    div.innerHTML += '<i style="background: #FF7C09"></i><span>4.9 - 5.9  ~  Slight damage to structures</span><br>';
    div.innerHTML += '<i style="background: #FF5309"></i><span>5.9 - 6.9  ~  A lot of damage in populated areas</span><br>';
    div.innerHTML += '<i style="background: #FF3209"></i><span>6.9 - 7.9  ~  Serious damage</span><br>';
    div.innerHTML += '<i style="background: #FF0909"></i><span>7.9 - 10  ~  Destroy communities near epicenter</span><br>';
    
    return div;
  };

  // Create the map, add it to the html, and zoom in to the western United States.
  var usgsMap = L.map("map", {
    center: [
      41, -118
    ],
    zoom: 4.5,
    layers: [outdoormap, quakeLocations]
  });

  // Add controls to switch between base maps and turn on/off overlay layer.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(usgsMap);

  // Add the legend to the map.
  legend.addTo(usgsMap);

}



