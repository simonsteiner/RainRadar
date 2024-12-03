import maplibregl, { Map, MapMouseEvent } from 'maplibre-gl';
import { mapConfig } from './layers/map-config.js';
import { hillshadeLayer } from './layers/hillshade.js';
import { swissBoundaryLayer } from './layers/swiss-boundary.js';
import { swissCantonBoundariesLayer } from './layers/swiss-canton-boundaries.js';
import { swissCitiesLayer } from './layers/swiss-cities.js';
import { swissNutsRegionsLayer } from './layers/swiss-nuts-regions.js';
import { centerAndBounds } from './layers/center-and-bounds.js';
import { initializePrecipitationDisplay } from '../main.js';

const map: Map = new maplibregl.Map(mapConfig);

// Layer toggle functionality
const toggleLayer = (layerId: string, visible: boolean): void => {
  const visibility = visible ? 'visible' : 'none';
  const layers = {
    'precipitation': ['precipitation-rate-layer', 'precipitation-rate-outline'],
    'hillshade': ['hillshade-layer'],
    'boundary': ['swiss-boundary-line', 'swiss-boundary-fill'],
    'cantons': ['swiss-canton-boundaries-layer'],
    'cities': ['swiss-cities-layer', 'swiss-cities-labels'],
    'nuts': ['swiss-nuts-regions-fill', 'swiss-nuts-regions-layer', 'swiss-nuts-regions-labels', 'region-center-labels'],
    'center' : ['center-circle', 'center-labels'],
    'bounds' : ['bounds-line']
  };

  const layersToToggle = layers[layerId as keyof typeof layers];
  layersToToggle?.forEach(layer => {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'visibility', visibility);
    }
  });
};

// Add event listeners for layer toggles
const setupLayerToggles = (): void => {
  ['precipitation', 'hillshade', 'boundary', 'cantons', 'cities', 'nuts', 'center', 'bounds'].forEach(layerId => {
    const checkbox = document.getElementById(layerId) as HTMLInputElement;
    checkbox.addEventListener('change', (e) => {
      toggleLayer(layerId, (e.target as HTMLInputElement).checked);
    });
  });
};

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
  centerAndBounds(map);
  initializePrecipitationDisplay(map);
  setupLayerToggles();
});