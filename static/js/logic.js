let map = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5
});
// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Store Url
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


d3.json(url).then(function (data) {
  L.geoJSON(data, {
    style: function (feature) {
      let mag = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];

      return {
        weight: 1,
        color: 'black',
        radius: mag * 4,
        fillOpacity: .65,
        fillColor:
          depth < 10 ? 'green' :
            depth < 30 ? 'lime' :
              depth < 50 ? 'yellow' :
                depth < 70 ? 'orange' :
                  depth < 90 ? 'darkkorange' : 'red'
      };
    },
    pointToLayer: (data, latlng) => L.circleMarker(latlng)
  }).bindPopup(function (layer) {
    let { mag, place, time } = layer.feature.properties;
    let depth = layer.feature.geometry.coordinates[2];
    let date = new Date(time).toLocaleString();

    return `<h5>${place}<br>${date}<br>Magnitude: ${mag}<br>Depth: ${depth}</h5>`;
  }).addTo(map);
});

let legend = L.control({position:'bottomright'});

legend.onAdd = function() {
  let div = L.DomUtil.create('div','legend');
  div.innerHTML = `
  <div style="background:green">-10 - 10</div>
  <div style="background:lime">10 - 30</div>
  <div style="background:yellow">30 - 50</div>
  <div style="background:orange">50 - 70</div>
  <div style="background:darkorange">70 - 90</div>
  <div style="background:red">90+</div>
  `;

  return div
}

legend.addTo(map)
