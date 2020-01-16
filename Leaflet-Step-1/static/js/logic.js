function radiusSize(quakeMag) {
  return quakeMag * 8000;
}

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

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
    createFeatures(data.features);
});
  
function createFeatures(quakeData) {
    
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p> Magnitude = " + feature.properties.mag + "</p>" +
      "<hr><p>" + new Date(feature.properties.time) + "</p>");
  }

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

  createMap(quakeLocations);
}

function createMap(quakeLocations) {
  
  var outdoormap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Topography Map": outdoormap,
    "Satellite Map": satellitemap
  };

  var overlayMaps = {
    "Earthquakes": quakeLocations
  };

  var legend = L.control({ position: "bottomleft" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #FFD709"></i><span>0 - 3.9,  Usually not felt</span><br>';
    div.innerHTML += '<i style="background: #FF9D09"></i><span>3.9 - 4.9,  Often felt</span><br>';
    div.innerHTML += '<i style="background: #FF7C09"></i><span>4.9 - 5.9,  Slight damage to structures</span><br>';
    div.innerHTML += '<i style="background: #FF5309"></i><span>5.9 - 6.9,  A lot of damage in populated areas</span><br>';
    div.innerHTML += '<i style="background: #FF3209"></i><span>6.9 - 7.9,  Serious damage</span><br>';
    div.innerHTML += '<i style="background: #FF0909"></i><span>7.9 - 10,  Destroy communities near epicenter</span><br>';
  
    return div;
  };

  
  var usgsMap = L.map("map", {
    center: [
      41, -118
    ],
    zoom: 4.5,
    layers: [outdoormap, quakeLocations]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(usgsMap);

  legend.addTo(usgsMap);

}



