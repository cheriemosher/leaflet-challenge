function createMap(quakeLocations) {
    
    var lightmap = L.tileLayer(MAPBOX_URL, {
        attribution: ATTRIBUTION,
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    }).addTo(usgsMap);

    var baseMaps = {
        "Light Map": lightmap
    };

    var overlayMaps = {
        "Earthquakes": quakeLocations
    };

    var usgsMap = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 12,
        layers: [lightmap, quakeLocations]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(usgsMap);

}

function createMarkers(response) {

    // Pull the "stations" property off of response.data
    var earthquakes = response.features;
  
    // Initialize an array to hold bike markers
    var quakeMarkers = [];
  
    // Loop through the stations array
    for (var index = 0; index < stations.length; index++) {
      var station = stations[index];
  
      // For each station, create a marker and bind a popup with the station's name
      var bikeMarker = L.marker([station.lat, station.lon])
        .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");
  
      // Add the marker to the bikeMarkers array
      bikeMarkers.push(bikeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(bikeMarkers));
}

// Perform an API call to the USGS API to get station information. Call the createMarkers function when complete.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson", createMarkers);
