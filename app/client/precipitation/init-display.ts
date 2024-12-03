import { Map } from "maplibre-gl";
import { fetchPrecipitationAnimation } from "./api";
import { extractPictureInfo } from "./utils";
import { PictureInfo } from "./types";
import { setupSlider, findLatestMeasurementIndex } from "./slider";
import { PrecipitationRenderer } from "./render";
import { createLegend } from "./legend";

class PrecipitationDisplayManager {
  private renderer: PrecipitationRenderer;

  constructor(map: Map) {
    this.renderer = new PrecipitationRenderer(map);
  }

  public async initialize(): Promise<void> {
    try {
      const animationData = await fetchPrecipitationAnimation();
      this.renderer.updateLastUpdated(animationData);
      const pictures: PictureInfo[] = extractPictureInfo(animationData);
      const latestMeasurementIndex = findLatestMeasurementIndex(pictures);
      setupSlider(pictures, this.renderer);
      createLegend(animationData.legend);
      await this.renderer.updateImage(latestMeasurementIndex, pictures);
    } catch (error) {
      console.error(
        "Error initializing precipitation display:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

export function initializePrecipitationDisplay(map: Map): Promise<void> {
  const precipitationManager = new PrecipitationDisplayManager(map);
  return precipitationManager.initialize();
}
