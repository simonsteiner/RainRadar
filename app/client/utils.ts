
import { AnimationData, PictureInfo } from './types';

export function extractPictureInfo(animationData: AnimationData): PictureInfo[] {
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

export function generateImageHtml(picture: PictureInfo): string {
  return `
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
    <!--<img src="/api${picture.radar_url}" alt="${picture.timepoint} (${picture.data_type})">-->
  `;
}