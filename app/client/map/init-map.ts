import { hasZoomParameter, getZoomFromUrl } from "./map-utils";
import { initializeContainerControls } from "../utils/container-controls";
import { initializePrecipitationDisplay } from "../precipitation/init-display";
import { LAYER_CONFIGS } from "./layers-config";
import { LayerManager } from "./layer-manager";
import { mapConfig } from "./configs/map-config";
import { MapUI } from "./map-ui";
import { ParaglidingMode } from "../precipitation/paragliding-mode";
import { setupLocationButton } from "./location-button";
import { ViewportHandler } from "./viewport-handler";
import maplibregl from "maplibre-gl";
import type { Map, MapMouseEvent } from "maplibre-gl";

interface IMapInitializer {
  getMap(): Map;
}

class MapInitializer implements IMapInitializer {
  private readonly map: Map;
  private readonly layerManager: LayerManager;
  private readonly viewportHandler: ViewportHandler;
  private readonly mapUI: MapUI;
  private precipitationManager: import("../precipitation/init-display").PrecipitationDisplayManager;

  constructor() {
    try {
      const urlZoom = getZoomFromUrl();
      const config = {
        ...mapConfig,
        zoom: urlZoom ?? mapConfig.zoom,
        bounds: hasZoomParameter() ? undefined : mapConfig.bounds
      };

      this.map = new maplibregl.Map(config);
      this.layerManager = new LayerManager(this.map);
      this.viewportHandler = new ViewportHandler();
      this.mapUI = new MapUI();

      this.initializeComponents();
      initializeContainerControls();
    } catch (error) {
      console.error("Failed to initialize map:", error);
      throw error;
    }
  }

  private initializeComponents(): void {
    this.initializeMapCore();
    this.initializeParaglidingMode();
  }

  private initializeMapCore(): void {
    this.setupEventHandlers();
    this.setupMapControls();
    this.map.on("load", this.handleMapLoad.bind(this));
  }

  private setupEventHandlers(): void {
    const eventHandlers = {
      mousemove: (e: MapMouseEvent) => this.mapUI.updateCoordinates(e),
      click: (e: MapMouseEvent) => this.mapUI.copyCoordinates(e),
      move: () => this.mapUI.updateZoom(this.map.getZoom())
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      this.map.on(event, handler);
    });
  }

  private setupMapControls(): void {
    setupLocationButton(this.map);
    this.viewportHandler.initialize();
    this.setupFullscreenControl();
  }

  private setupFullscreenControl(): void {
    const fullscreenButton = document.querySelector(".fullscreen-button");
    if (!fullscreenButton) return;

    fullscreenButton.addEventListener("click", this.handleFullscreenToggle);
  }

  private handleFullscreenToggle = async (): Promise<void> => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        document.body.classList.add("fullscreen");
      } else {
        await document.exitFullscreen();
        document.body.classList.remove("fullscreen");
      }
    } catch (error) {
      console.error("Fullscreen operation failed:", error);
    }
  };

  private async handleMapLoad(): Promise<void> {
    try {
      this.initializeLayers();
      this.precipitationManager = initializePrecipitationDisplay(this.map);
    } catch (error) {
      console.error("Failed to initialize map layers:", error);
    }
  }

  private initializeLayers(): void {
    Object.values(LAYER_CONFIGS).forEach(config => {
      this.layerManager.addLayer(config);
    });

    this.layerManager.createLayerCheckboxes();
    this.layerManager.setupLayerToggles();
  }

  private initializeParaglidingMode(): void {
    const paraglidingMode = ParaglidingMode.getInstance();
    paraglidingMode.initialize(this.map);
  }

  public getMap(): Map {
    return this.map;
  }
}

export const mapInitializer = new MapInitializer();
