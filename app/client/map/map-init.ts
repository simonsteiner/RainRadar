import maplibregl, { Map, MapMouseEvent } from 'maplibre-gl';
import { mapConfig } from './map-config';
import { LAYER_CONFIGS } from './layers-config';
import { LayerManager } from './layer-manager';
import { initializePrecipitationDisplay } from '../precipitation/display-manager';

class MapInitializer {
  private map: Map;
  private layerManager: LayerManager;

  constructor() {
    this.map = new maplibregl.Map(mapConfig);
    this.layerManager = new LayerManager(this.map);
    this.setupEventListeners();
    this.initializeMapLayers();
  }

  private setupEventListeners(): void {
    this.setupCoordinateDisplay();
    this.setupCoordinateCopy();
    this.setupZoomDisplay();
  }

  private setupCoordinateDisplay(): void {
    this.map.on('mousemove', (e: MapMouseEvent) => {
      const coordsElement = document.getElementById('coordinates') as HTMLDivElement;
      coordsElement.innerHTML = `Lon: ${e.lngLat.lng.toFixed(6)} Lat: ${e.lngLat.lat.toFixed(6)}`;
    });
  }

  private setupCoordinateCopy(): void {
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
  }

  private setupZoomDisplay(): void {
    this.map.on('move', (): void => {
      const zoomElement = document.getElementById('zoomlevel') as HTMLDivElement;
      zoomElement.innerHTML = `Zoom: ${this.map.getZoom().toFixed(2)}`;
    });
  }

  private initializeMapLayers(): void {
    this.map.on("load", (): void => {
      console.log("Map loaded");
      Object.values(LAYER_CONFIGS).forEach(config => {
        console.log(`Adding layer: ${config.id}`);
        this.layerManager.addLayer(config);
      });
      
      this.layerManager.createLayerCheckboxes();
      this.layerManager.setupLayerToggles();
      initializePrecipitationDisplay(this.map);
    });
  }

  public getMap(): Map {
    return this.map;
  }
}

// Initialize the map
const mapInitializer = new MapInitializer();