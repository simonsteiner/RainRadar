import { mapConfig } from './layers/map-config.js';
import { hillshadeLayer } from './layers/hillshade.js';
import { swissBoundaryLayer } from './layers/swiss-boundary.js';
import { swissCantonBoundariesLayer } from './layers/swiss-canton-boundaries.js';
import { swissCitiesLayer } from './layers/swiss-cities.js';
import { swissNutsRegionsLayer } from './layers/swiss-nuts-regions.js';
import { setupWeatherData } from './layers/weather-data.js';

const map = new maplibregl.Map(mapConfig);

// Coordinate display
map.on('mousemove', (e) => {
  document.getElementById('coordinates').innerHTML =
    `Lon: ${e.lngLat.lng.toFixed(6)} Lat: ${e.lngLat.lat.toFixed(6)}`;
});

// Add click handler for coordinates div
document.getElementById('coordinates').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('coordinates').textContent);
    document.getElementById('coordinates').style.background = 'rgba(150, 255, 150, 0.8)';
    setTimeout(() => {
      document.getElementById('coordinates').style.background = 'rgba(255, 255, 255, 0.8)';
    }, 200);
  } catch (err) {
    console.error('Failed to copy coordinates:', err);
  }
});

// // Create a popup but don't add it to the map yet
// const popup = new maplibregl.Popup({
//   closeButton: false,
//   closeOnClick: false
// });

// map.on('click', async (e) => {
//   const coordinates = `${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}`;

//   try {
//     await navigator.clipboard.writeText(coordinates);

//     // Show popup at click location
//     popup
//       .setLngLat(e.lngLat)
//       .setHTML(`<h4>Coordinates copied!</h4>Lon: ${e.lngLat.lng}<br>Lat: ${e.lngLat.lat}`)
//       .addTo(map);

//     // Remove popup after 1 second
//     setTimeout(() => {
//       popup.remove();
//     }, 2000);
//   } catch (err) {
//     console.error('Failed to copy coordinates:', err);
//   }
// });

// zoom level display
map.on('move', () => {
  document.getElementById('zoomlevel').innerHTML =
    `Zoom: ${map.getZoom().toFixed(2)}`;
});

// Initialize map layers when loaded
map.on("load", () => {
  hillshadeLayer(map);
  swissBoundaryLayer(map);
  swissCantonBoundariesLayer(map);
  swissCitiesLayer(map);
  swissNutsRegionsLayer(map);
  setupWeatherData(map);

  map.addSource('location-marker', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer({
    id: 'location-marker',
    type: 'circle',
    source: 'location-marker',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ff0000',
      'circle-opacity': 0.8
    }
  });
});

document.getElementById('locate-button').addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { longitude, latitude } = position.coords;
      
      map.getSource('location-marker').setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }]
      });

      map.flyTo({
        center: [longitude, latitude],
        zoom: 14
      });
    }, error => {
      console.error('Error getting location:', error);
      alert('Unable to retrieve your location');
    });
  } else {
    alert('Geolocation is not supported by your browser');
  }
});