import { fetchJson, fetchPrecipitationAnimation } from './api';
import { extractPictureInfo, generateImageHtml } from './utils';
import { PictureInfo, AnimationData } from './types';
import { radar2geojson } from './geojson/radar2geojson';
import { RadarData } from './geojson/types';
import { displayPrecipitationData } from './map/layers/weather-data';

let currentPictures: PictureInfo[] = [];

function updateImage(index: number) {
  const picture = currentPictures[index];
  const precipitationImage = document.getElementById('precipitationImage');
  const timeDisplay = document.getElementById('timeDisplay');

  if (picture && precipitationImage && timeDisplay) {
    precipitationImage.innerHTML = generateImageHtml(picture);
    timeDisplay.textContent = `${picture.timepoint} (${picture.data_type})`;
  }
}

function setupSlider(pictures: PictureInfo[]) {
  const slider = document.getElementById('timeSlider') as HTMLInputElement;
  if (slider) {
    slider.max = (pictures.length - 1).toString();
    slider.value = '0';
    slider.addEventListener('input', (e) => {
      const index = parseInt((e.target as HTMLInputElement).value);
      updateImage(index);
    });
  }
}

function updateLastUpdatedText(animationData: AnimationData) {
  const updatedOn = document.getElementById('updatedOn');
  if (updatedOn) {
    updatedOn.textContent = `Updated on ${animationData.map_images[0].day}, ${animationData.map_images[0].timepoint}`;
  }
}

export async function initializePrecipitationDisplay(map): Promise<void> {
  try {
    const animationData = await fetchPrecipitationAnimation();
    updateLastUpdatedText(animationData);
    currentPictures = extractPictureInfo(animationData);
    const radarData: RadarData = await fetchJson('/api' + currentPictures[0].radar_url);
    const geojson = radar2geojson(radarData);
    displayPrecipitationData(map, geojson);
    setupSlider(currentPictures);
    updateImage(0);
  } catch (error) {
    console.error('Error initializing precipitation display:', error instanceof Error ? error.message : String(error));
  }
}
