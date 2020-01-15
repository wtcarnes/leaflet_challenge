
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
   
d3.json(link, function (data) {
    createFeatures(data.features);
});

var legend = L.control({
    position: 'bottomleft'
});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3, 4, 5],
        labels = [];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

function getColor(d) {
	return d >= 5 ? '#993404' :
	    d >= 4 ? '#d95f0e' :
	    d >= 3 ? '#fe9929' :
	    d >= 2 ? '#fec44f' :
	    d >= 1 ? '#fee391' :
	    d >= 0 ? '#ffffd4' :
	    '#f7f7f7';
	};

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 5,
                    fillColor: getColor(feature.properties.mag),
                    color: "white",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.9
                })
                .bindPopup("<h3>" + "Location: " + feature.properties.place +
                    "</h3><hr><p>" + "Date/Time: " + new Date(feature.properties.time) + "<br>" +
                    "Magnitude: " + feature.properties.mag + "</p>");
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    legend.addTo(myMap);
}


