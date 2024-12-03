import maplibregl, { Map, MapMouseEvent } from "maplibre-gl";
import { mapConfig } from "./configs/map-config";
import { LAYER_CONFIGS } from "./layers-config";
import { LayerManager } from "./layer-manager";
import { initializePrecipitationDisplay } from "../precipitation/init-display";
import { setupLocationButton } from "./location-button";

class MapInitializer {
  private map: Map;
  private layerManager: LayerManager;

  constructor() {
    this.map = new maplibregl.Map(mapConfig);
    this.layerManager = new LayerManager(this.map);
    this.initializeMap();
    this.setupViewportHandling();
    this.setupFullscreen();
  }

  private initializeMap(): void {
    this.setupEventListeners();
    setupLocationButton(this.map);
    this.map.on("load", this.onMapLoad.bind(this));
  }

  private setupViewportHandling(): void {

    const updateMapHeight = () => {
      const visualViewport = window.visualViewport;
      const map = document.getElementById('map');
      const heightDifference = window.innerHeight - (visualViewport?.height || 0);

      console.debug('Viewport measurements:', {
        visualViewportHeight: visualViewport?.height,
        windowInnerHeight: window.innerHeight,
        heightDifference,
        mapElement: map ? 'found' : 'not found'
      });

      if (heightDifference != 0) {
        if (map) {
          console.debug(`Address bar detected (${heightDifference}px difference)`);
          map.classList.add('address-bar-visible');
        }
      } else {
        if (map) {
          console.debug('No address bar detected');
          map.classList.remove('address-bar-visible');
        }
      }
    };

    if (window.visualViewport) {
      console.debug('Visual Viewport API available');
      window.visualViewport.addEventListener('resize', updateMapHeight);
    } else {
      console.warn('Visual Viewport API not available');
    }
    window.addEventListener('load', updateMapHeight);
    // Initial call to set correct state
    updateMapHeight();
  }

  private setupFullscreen(): void {
    const fullscreenButton = document.querySelector('.fullscreen-button');
    if (!fullscreenButton) return;

    fullscreenButton.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => {
            document.body.classList.add('fullscreen');
            console.debug('Entered fullscreen mode');
          })
          .catch(err => console.warn('Failed to enter fullscreen:', err));
      } else {
        document.exitFullscreen()
          .then(() => {
            document.body.classList.remove('fullscreen');
            console.debug('Exited fullscreen mode');
          })
          .catch(err => console.warn('Failed to exit fullscreen:', err));
      }
    });
  }

  private setupEventListeners(): void {
    this.map.on("mousemove", this.handleMouseMove.bind(this));
    this.map.on("click", this.handleClick.bind(this));
    this.map.on("move", this.updateZoomDisplay.bind(this));
  }

  private handleMouseMove(e: MapMouseEvent): void {
    const { lon, lat } = this.formatCoordinates(e);
    const coordsElement = document.getElementById("coordinates");
    if (coordsElement) {
      coordsElement.innerHTML = `Lon: ${lon} Lat: ${lat}`;
    }
  }

  private async handleClick(e: MapMouseEvent): Promise<void> {
    const { lon, lat } = this.formatCoordinates(e);
    const coordinates = `${lon}, ${lat}`;
    try {
      await navigator.clipboard.writeText(coordinates);
      this.flashCoordinatesCopied();
      console.info(`Copied coordinates: ${coordinates}`);
    } catch (err) {
      console.error("Failed to copy coordinates:", err);
    }
  }

  private formatCoordinates(e: MapMouseEvent) {
    return {
      lon: e.lngLat.lng.toFixed(6),
      lat: e.lngLat.lat.toFixed(6)
    };
  }

  private flashCoordinatesCopied(): void {
    const coordsElement = document.getElementById("coordinates");
    if (coordsElement) {
      coordsElement.style.background = "rgba(150, 255, 150, 0.8)";
      setTimeout(() => {
        coordsElement.style.background = "rgba(255, 255, 255, 0.8)";
      }, 200);
    }
  }

  private updateZoomDisplay(): void {
    const zoomElement = document.getElementById("zoomlevel");
    if (zoomElement) {
      zoomElement.innerHTML = `Zoom: ${this.map.getZoom().toFixed(2)}`;
    }
  }

  private onMapLoad(): void {
    console.log("Map loaded");
    this.initializeLayers();
    initializePrecipitationDisplay(this.map);
  }

  private initializeLayers(): void {
    Object.values(LAYER_CONFIGS).forEach(config => {
      console.log(`Adding layer: ${config.id}`);
      this.layerManager.addLayer(config);
    });

    this.layerManager.createLayerCheckboxes();
    this.layerManager.setupLayerToggles();
  }

  public getMap(): Map {
    return this.map;
  }
}

export const mapInitializer = new MapInitializer();
