import maplibregl, { Map, MapMouseEvent } from "maplibre-gl";
import { mapConfig } from "./configs/map-config";
import { LAYER_CONFIGS } from "./layers-config";
import { LayerManager } from "./layer-manager";
import { initializePrecipitationDisplay } from "../precipitation/init-display";
import { setupLocationButton } from "./location-button";
import { ViewportHandler } from "./viewport-handler";
import { MapUI } from "./map-ui";

class MapInitializer {
  private map: Map;
  private layerManager: LayerManager;
  private viewportHandler: ViewportHandler;
  private mapUI: MapUI;

  constructor() {
    this.map = new maplibregl.Map(mapConfig);
    this.layerManager = new LayerManager(this.map);
    this.viewportHandler = new ViewportHandler();
    this.mapUI = new MapUI();
    
    this.initializeMap();
  }

  private initializeMap(): void {
    this.setupEventListeners();
    setupLocationButton(this.map);
    this.viewportHandler.initialize();
    this.setupFullscreen();
    this.map.on("load", this.onMapLoad.bind(this));
  }

  private setupEventListeners(): void {
    this.map.on("mousemove", (e: MapMouseEvent) => this.mapUI.updateCoordinates(e));
    this.map.on("click", (e: MapMouseEvent) => this.mapUI.copyCoordinates(e));
    this.map.on("move", () => this.mapUI.updateZoom(this.map.getZoom()));
  }

  private setupFullscreen(): void {
    const fullscreenButton = document.querySelector('.fullscreen-button');
    if (!fullscreenButton) return;

    fullscreenButton.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          document.body.classList.add('fullscreen');
        } else {
          await document.exitFullscreen();
          document.body.classList.remove('fullscreen');
        }
      } catch (err) {
        console.warn('Fullscreen operation failed:', err);
      }
    });
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
