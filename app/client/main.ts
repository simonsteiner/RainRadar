import { fetchJson, fetchPrecipitationAnimation } from "./api";
import { Map } from "maplibre-gl";
import { extractPictureInfo, generateImageHtml } from "./utils";
import { PictureInfo, AnimationData } from "./types";
import { radar2geojson } from "./geojson/radar2geojson";
import { RadarData } from "./geojson/types";
import { displayPrecipitationData } from "./map/layers/weather-data";

let currentPictures: PictureInfo[] = [];

async function updateImage(index: number, map: Map) {
  const picture = currentPictures[index];
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

function findLatestMeasurementIndex(pictures: PictureInfo[]): number {
  for (let i = pictures.length - 1; i >= 0; i--) {
    if (pictures[i].data_type === 'measurement') {
      return i;
    }
  }
  return 0;
}

function setupSlider(pictures: PictureInfo[], map: Map) {
  const slider = document.getElementById("timeSlider") as HTMLInputElement;
  if (slider) {
    slider.max = (pictures.length - 1).toString();
    const latestMeasurementIndex = findLatestMeasurementIndex(pictures);
    slider.value = latestMeasurementIndex.toString();
    slider.addEventListener("input", (e) => {
      const index = parseInt((e.target as HTMLInputElement).value);
      updateImage(index, map);
    });
  }
}

function updateLastUpdatedText(animationData: AnimationData) {
  const updatedOn = document.getElementById("updatedOn");
  if (updatedOn) {
    updatedOn.textContent = `Updated on ${animationData.map_images[0].day}, ${animationData.map_images[0].timepoint}`;
  }
}

export async function initializePrecipitationDisplay(map: Map): Promise<void> {
  try {
    const animationData = await fetchPrecipitationAnimation();
    updateLastUpdatedText(animationData);
    currentPictures = extractPictureInfo(animationData);
    const latestMeasurementIndex = findLatestMeasurementIndex(currentPictures);
    setupSlider(currentPictures, map);
    updateImage(latestMeasurementIndex, map);
  } catch (error) {
    console.error(
      "Error initializing precipitation display:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
