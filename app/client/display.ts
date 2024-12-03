
import { Map } from "maplibre-gl";
import { AnimationData, PictureInfo } from "./types";
import { fetchJson } from "./api";
import { generateImageHtml } from "./utils";
import { radar2geojson } from "./geojson/radar2geojson";
import { RadarData } from "./geojson/types";
import { displayPrecipitationData } from "./map/layers/weather-data";

export async function updateImage(index: number, pictures: PictureInfo[], map: Map) {
  const picture = pictures[index];
  const precipitationImage = document.getElementById("precipitationImage");
  const timeDisplay = document.getElementById("timeDisplay");

  if (picture && precipitationImage && timeDisplay) {
    precipitationImage.innerHTML = generateImageHtml(picture);
    timeDisplay.textContent = `${picture.timepoint} (${picture.data_type})`;

    try {
      const radarData: RadarData = await fetchJson("/api" + picture.radar_url);
      const geojson = radar2geojson(radarData);
      displayPrecipitationData(map, geojson);
    } catch (error) {
      console.error(
        "Error updating radar data:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

export function updateLastUpdatedText(animationData: AnimationData) {
  const updatedOn = document.getElementById("updatedOn");
  if (updatedOn) {
    updatedOn.textContent = `Updated on ${animationData.map_images[0].day}, ${animationData.map_images[0].timepoint}`;
  }
}