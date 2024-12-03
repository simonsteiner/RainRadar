import maplibregl, { Map, MapMouseEvent } from 'maplibre-gl';
import { mapConfig } from './layers/map-config.js';
import { hillshadeLayer } from './layers/hillshade.js';
import { swissBoundaryLayer } from './layers/swiss-boundary.js';
import { swissCantonBoundariesLayer } from './layers/swiss-canton-boundaries.js';
import { swissCitiesLayer } from './layers/swiss-cities.js';
import { swissNutsRegionsLayer } from './layers/swiss-nuts-regions.js';
import { initializePrecipitationDisplay } from '../main.js';

const map: Map = new maplibregl.Map(mapConfig);

// Coordinate display
map.on('mousemove', (e: MapMouseEvent) => {
  const coordsElement = document.getElementById('coordinates') as HTMLDivElement;
  coordsElement.innerHTML = `Lon: ${e.lngLat.lng.toFixed(6)} Lat: ${e.lngLat.lat.toFixed(6)}`;
});

// Add click handler for coordinates div
const coordsElement = document.getElementById('coordinates') as HTMLDivElement;
coordsElement.addEventListener('click', async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(coordsElement.textContent || '');
    coordsElement.style.background = 'rgba(150, 255, 150, 0.8)';
    setTimeout((): void => {
      coordsElement.style.background = 'rgba(255, 255, 255, 0.8)';
    }, 200);
  } catch (err) {
    console.error('Failed to copy coordinates:', err);
  }
});

// zoom level display
map.on('move', (): void => {
  const zoomElement = document.getElementById('zoomlevel') as HTMLDivElement;
  zoomElement.innerHTML = `Zoom: ${map.getZoom().toFixed(2)}`;
});

// Initialize map layers when loaded
map.on("load", (): void => {
  hillshadeLayer(map);
  swissBoundaryLayer(map);
  swissCantonBoundariesLayer(map);
  swissCitiesLayer(map);
  swissNutsRegionsLayer(map);
  initializePrecipitationDisplay(map);
});