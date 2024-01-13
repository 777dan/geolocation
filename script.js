const cities = [
    ["Addis Ababa", 8.98505, 38.73419],
    ["Manila", 14.59861, 120.9773],
    ["Brazzaville", -4.22792, 15.26713],
    ["Santiago", -33.46036, -70.7246],
    ["Nuuk", 64.17506, -51.72981]
];
let cityInput = document.querySelector('#cityInput');
cityInput.addEventListener('change', function () {
    let city = cityInput.value;

    if (city.trim() !== '') {
        for (let i = 0; i < cities.length; i++) {
            if (cities[i][0] === city.trim()) {
                findLocation(cities[i][1], cities[i][2]);
                // console.log(cities[i][1]);
                // console.log(cities[i][2]);
            }
        }
    } else {
        alert('Select a value from the list.');
    }
});
let longitude = 8.98505;
let latitude = 38.73419;
let zoom = 18;
findLocation(longitude, latitude);
let fromProjection = new OpenLayers.Projection("EPSG:4326");
let toProjection = new OpenLayers.Projection("EPSG:900913");
let position = new OpenLayers.LonLat(longitude, latitude).transform(
    fromProjection,
    toProjection
);
map = new OpenLayers.Map("demoMap");
let mapnik = new OpenLayers.Layer.OSM();
map.addLayer(mapnik);
let markers = new OpenLayers.Layer.Markers("Markers");

function findLocation(latitude, longitude) {
    let status = document.querySelector("#status");
    let mapLink = document.querySelector("#map");
    mapLink.href = "";
    mapLink.innerHTML = "";
    let latitude2 = latitude;
    let longitude2 = longitude;
    function success(position) {
        let latitude1 = position.coords.latitude;
        let longitude1 = position.coords.longitude;
        status.innerHTML = "";
        mapLink.href = "https://www.openstreetmap.org/#map=18/" +
            latitude2 + "/" + longitude2;
        mapLink.innerHTML =
            "Latitude:" + latitude2 + " °, Longitude: " + longitude2 + "°";
        position = new OpenLayers.LonLat(longitude2, latitude2).transform(
            fromProjection, toProjection
        );
        markers.addMarker(new OpenLayers.Marker(position));
        map.setCenter(position, zoom);

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            let R = 6371; // Radius of the earth in km
            let dLat = deg2rad(lat2 - lat1);  // deg2rad below
            let dLon = deg2rad(lon2 - lon1);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c; // Distance in km
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        console.log(getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2));
    }

    function error() {
        status.innerHTML = "It is impossible to obtain geolocation data.";
    }
    status.innerHTML = "Searching...";
    navigator.geolocation.getCurrentPosition(success, error);
}