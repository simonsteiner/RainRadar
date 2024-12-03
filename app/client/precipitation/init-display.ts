import { Map } from "maplibre-gl";
import { fetchPrecipitationAnimation } from "./api";
import { extractPictureInfo } from "./utils";
import { PictureInfo } from "./types";
import { setupSlider, findLatestMeasurementIndex } from "./slider";
import { updateImage, updateLastUpdatedText } from "./display";
import { createLegend } from "./legend";

class PrecipitationDisplayManager {
  constructor(private map: Map) {}

  public async initialize(): Promise<void> {
    try {
      const animationData = await fetchPrecipitationAnimation();
      updateLastUpdatedText(animationData);
      const pictures: PictureInfo[] = extractPictureInfo(animationData);
      const latestMeasurementIndex = findLatestMeasurementIndex(pictures);
      setupSlider(pictures, this.map);
      createLegend(animationData.legend);
      updateImage(latestMeasurementIndex, pictures, this.map);
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
