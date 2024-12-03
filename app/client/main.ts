import { Map } from "maplibre-gl";
import { fetchPrecipitationAnimation } from "./precipitation/api";
import { extractPictureInfo } from "./precipitation/utils";
import { PictureInfo } from "./precipitation/types";
import { setupSlider, findLatestMeasurementIndex } from "./precipitation/slider";
import { updateImage, updateLastUpdatedText } from "./precipitation/display";

class PrecipitationDisplayManager {
  constructor(private map: Map) {}

  public async initialize(): Promise<void> {
    try {
      const animationData = await fetchPrecipitationAnimation();
      updateLastUpdatedText(animationData);
      const pictures: PictureInfo[] = extractPictureInfo(animationData);
      const latestMeasurementIndex = findLatestMeasurementIndex(pictures);
      setupSlider(pictures, this.map);
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
