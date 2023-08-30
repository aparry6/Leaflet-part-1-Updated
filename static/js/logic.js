// Create a map centered at a specific location
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Get the earthquake data from the USGS GeoJSON Feed
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        L.geoJSON(data.features, {
            pointToLayer: function(feature, latlng) {
                // Customize the marker based on earthquake properties
                var radius = feature.properties.mag * 3; // Magnitude determines marker size
                var color = getColor(feature.geometry.coordinates[2]); // Depth determines marker color
                
                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: color,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                }).bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
                              <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                              <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
            }
        }).addTo(map);
    });

// Function to determine color based on earthquake depth
function getColor(depth) {
    return depth > 100 ? "#d73027" :
           depth > 50  ? "#fc8d59" :
           depth > 10  ? "#fee08b" :
                         "#1a9850";
}

// Create a legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Depth</strong>'];
    var colors = ['#1a9850', '#fee08b', '#fc8d59', '#d73027'];
    var ranges = ['<10 km', '10-50 km', '50-100 km', '>100 km'];

    for (var i = 0; i < colors.length; i++) {
        div.innerHTML += labels.push('<i style="background:' + colors[i] + '"></i> ' +
            ranges[i]);
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);
