import maplibregl, { Map, MapMouseEvent } from 'maplibre-gl';
import { mapConfig } from './layers/map-config';
import { LAYER_CONFIGS } from './layers/layers-config';
import { LayerManager } from './layers/layer-manager';
import { initializePrecipitationDisplay } from '../main';

const map: Map = new maplibregl.Map(mapConfig);
const layerManager = new LayerManager(map);

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
  console.log("Map loaded");
  // Initialize all layers
  Object.values(LAYER_CONFIGS).forEach(config => {
    console.log(`Adding layer: ${config.id}`);
    layerManager.addLayer(config);
  });
  
  layerManager.createLayerCheckboxes();
  layerManager.setupLayerToggles();
  initializePrecipitationDisplay(map);
});