import { Map } from "maplibre-gl";
import { fetchPrecipitationAnimation } from "./api";
import { extractPictureInfo } from "./utils";
import { PictureInfo } from "./types";
import { setupSlider, findLatestMeasurementIndex } from "./slider";
import { updateImage, updateLastUpdatedText } from "./display";

export async function initializePrecipitationDisplay(map: Map): Promise<void> {
  try {
    const animationData = await fetchPrecipitationAnimation();
    updateLastUpdatedText(animationData);
    const pictures: PictureInfo[] = extractPictureInfo(animationData);
    const latestMeasurementIndex = findLatestMeasurementIndex(pictures);
    setupSlider(pictures, map);
    updateImage(latestMeasurementIndex, pictures, map);
  } catch (error) {
    console.error(
      "Error initializing precipitation display:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
