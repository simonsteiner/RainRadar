import { hasZoomParameter, getZoomFromUrl } from "./map-utils";
import { initializeContainerControls } from "../utils/container-controls";
import { initializePrecipitationDisplay } from "../precipitation/init-display";
import { LAYER_CONFIGS } from "./layers-config";
import { LayerManager } from "./layer-manager";
import { mapConfig } from "./configs/map-config";
import { MapUI } from "./map-ui";
import { ParaglidingMode } from "../precipitation/paragliding-mode";
import { setupLocationButton } from "./location-button";
import { showMessageOverlay } from "../utils/message-overlay";
import { ViewportHandler } from "./viewport-handler";
import { GPUInitializationError, Map, setWorkerUrl, type ErrorEvent } from "maplibre-gl";

// MapLibre 6 loads its worker from a real URL instead of a blob, resolved
// against `import.meta.url` — i.e. next to our esbuild bundle, where it is not.
// build.ts vendors the worker (and the chunk it imports) here instead.
setWorkerUrl("/vendor/maplibre-gl-worker.mjs");

interface IMapInitializer {
  getMap(): Map;
}

class MapInitializer implements IMapInitializer {
  private readonly map: Map;
  private readonly layerManager: LayerManager;
  private readonly viewportHandler: ViewportHandler;
  private readonly mapUI: MapUI;
  private precipitationManager?: import("../precipitation/init-display").PrecipitationDisplayManager;

  constructor() {
    try {
      const urlZoom = getZoomFromUrl();
      const config = {
        ...mapConfig,
        zoom: urlZoom ?? mapConfig.zoom,
        bounds: hasZoomParameter() ? undefined : mapConfig.bounds
      };

      this.map = new Map(config);
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
    this.map.on("error", this.handleMapError);
    this.map.on("load", this.handleMapLoad.bind(this));
  }

  // MapLibre 6 dropped WebGL 1, so a context it cannot get is now a hard
  // failure rather than a downgrade. It surfaces as a GPUInitializationError
  // on the error event; without this the user just sees an empty container.
  private handleMapError = (e: ErrorEvent): void => {
    if (e.error instanceof GPUInitializationError) {
      showMessageOverlay(
        "This browser or device does not support WebGL 2, which the map requires."
      );
    }
    console.error("Map error:", e.error);
  };

  private setupEventHandlers(): void {
    // Registered one by one rather than looped over a map of handlers: since
    // MapLibre 6.3 `Map.on` is typed per event name, so this form checks the
    // event names and infers each `e` — a loop erases both back to `string`.
    this.map.on("mousemove", (e) => this.mapUI.updateCoordinates(e));
    this.map.on("click", (e) => this.mapUI.copyCoordinates(e));
    this.map.on("move", () => this.mapUI.updateZoom(this.map.getZoom()));
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
