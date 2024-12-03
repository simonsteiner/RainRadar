import { VersionsData, AnimationData, PictureInfo } from './types';

const API_ENDPOINTS = {
  versions: '/api/versions',
  precipitation: '/api/precipitation'
} as const;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json() as T;
}

async function fetchVersionsData(): Promise<VersionsData> {
  return fetchJson<VersionsData>(API_ENDPOINTS.versions);
}

async function fetchPrecipitationAnimation(): Promise<AnimationData> {
  const versionsData = await fetchVersionsData();
  const precipVersion = versionsData['precipitation/animation'];
  return fetchJson<AnimationData>(`${API_ENDPOINTS.precipitation}/${precipVersion}`);
}

function extractPictureInfo(animationData: AnimationData): PictureInfo[] {
  return animationData.map_images[0].pictures.map(picture => ({
    data_type_string: picture.data_type_string,
    radar_url: picture.radar_url,
    timepoint: picture.timepoint,
    day: picture.day,
    data_type: picture.data_type.includes('forecast') ? 'forecast' : 'measurement',
    timestamp: picture.timestamp,
    ...(picture.data_type.includes('forecast') && {
      snowrain_url: picture.snowrain_url,
      freezingrain_url: picture.freezingrain_url,
      snow_url: picture.snow_url
    })
  }));
}

let currentPictures: PictureInfo[] = [];

function updateImage(index: number) {
  const picture = currentPictures[index];
  const precipitationImage = document.getElementById('precipitationImage');
  const timeDisplay = document.getElementById('timeDisplay');

  if (picture && precipitationImage && timeDisplay) {
    precipitationImage.innerHTML = `
        data_type_string: ${picture.data_type_string}<br>
        radar_url: ${picture.radar_url}<br>
        timepoint: ${picture.timepoint}<br>
        day: ${picture.day}<br>
        data_type: ${picture.data_type}<br>
        timestamp: ${picture.timestamp}<br>
        ${picture.data_type === 'forecast' ? `
          snowrain_url: ${picture.snowrain_url}<br>
          freezingrain_url: ${picture.freezingrain_url}<br>
          snow_url: ${picture.snow_url}<br>
        ` : ''}
        <img src="/api${picture.radar_url}" alt="${picture.timepoint} (${picture.data_type})">
      `;
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

export async function initializePrecipitationDisplay(): Promise<void> {
  try {
    const animationData = await fetchPrecipitationAnimation();
    const updatedOn = document.getElementById('updatedOn');
    if (updatedOn) updatedOn.textContent = `Updated on ${animationData.map_images[0].day}, ${animationData.map_images[0].timepoint}`;
    currentPictures = extractPictureInfo(animationData);
    setupSlider(currentPictures);
    updateImage(0);
  } catch (error) {
    console.error('Error initializing precipitation display:', error instanceof Error ? error.message : String(error));
  }
}
