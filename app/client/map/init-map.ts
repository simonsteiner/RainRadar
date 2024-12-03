import maplibregl, { Map, MapMouseEvent, GeoJSONSource } from "maplibre-gl";
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
    this.setupEventListeners();
    this.initializeMapLayers();
    setupLocationButton(this.map);
  }

  private setupEventListeners(): void {
    this.setupCoordinateDisplay();
    this.setupZoomDisplay();
  }

  private extractCoordinates(e: MapMouseEvent): { lon: string; lat: string } {
    return {
      lon: e.lngLat.lng.toFixed(6),
      lat: e.lngLat.lat.toFixed(6)
    };
  }

  private setupCoordinateDisplay(): void {
    this.map.on("mousemove", (e: MapMouseEvent) => {
      const coordsElement = document.getElementById("coordinates") as HTMLDivElement;
      const { lon, lat } = this.extractCoordinates(e);
      coordsElement.innerHTML = `Lon: ${lon} Lat: ${lat}`;
    });

    this.map.on("click", (e: MapMouseEvent) => {
      const { lon, lat } = this.extractCoordinates(e);
      const coordinates = `${lon}, ${lat}`;
      navigator.clipboard
        .writeText(coordinates)
        .then(() => {
          const coordsElement = document.getElementById("coordinates") as HTMLDivElement;
          coordsElement.style.background = "rgba(150, 255, 150, 0.8)";
          setTimeout((): void => {
            coordsElement.style.background = "rgba(255, 255, 255, 0.8)";
          }, 200);

          console.info(`Copied coordinates to clipboard: ${coordinates}`);
        })
        .catch((err) => console.error("Failed to copy coordinates:", err));
    });
  }

  private setupZoomDisplay(): void {
    this.map.on("move", (): void => {
      const zoomElement = document.getElementById(
        "zoomlevel"
      ) as HTMLDivElement;
      zoomElement.innerHTML = `Zoom: ${this.map.getZoom().toFixed(2)}`;
    });
  }

  private initializeMapLayers(): void {
    this.map.on("load", (): void => {
      console.log("Map loaded");
      Object.values(LAYER_CONFIGS).forEach((config) => {
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
