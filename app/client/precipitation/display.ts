import { Map } from "maplibre-gl";
import { AnimationData, PictureInfo } from "./types";
import { fetchJson } from "./api";
import { radar2geojson } from "../geojson/radar2geojson";
import { RadarData } from "../geojson/types";
import { displayPrecipitationData } from "../map/weather-data";
import { PrecipitationRenderer } from "./render";

const renderer = new PrecipitationRenderer();

export async function updateImage(index: number, pictures: PictureInfo[], map: Map) {
  const picture = pictures[index];
  if (picture) {
    renderer.renderImage(picture);
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
  const { day, timepoint } = animationData.map_images[0];
  renderer.renderLastUpdated(day, timepoint);
}