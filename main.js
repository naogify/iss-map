const map = new geolonia.Map('#map');
let marker;

function moveISS(marker) {
  fetch('https://api.wheretheiss.at/v1/satellites/25544')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const cordinates = [data.longitude,data.latitude];
      marker.setLngLat(cordinates).addTo(map);
      map.flyTo({center: cordinates});
    });
  setTimeout(function(){moveISS(marker)}, 5000);
}

map.on('load', () => {
  const container = document.querySelector('#iss');
  container.style.display = 'block';
  marker = new window.geolonia.Marker({
    element: container,
    offset: [-3,-28],
  })
  moveISS(marker);
});
