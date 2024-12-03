
import { PictureInfo } from './types';

export class PrecipitationRenderer {
  private precipitationImage: HTMLElement | null;
  private timeDisplay: HTMLElement | null;
  private updatedOn: HTMLElement | null;

  constructor() {
    this.precipitationImage = document.getElementById("precipitationImage");
    this.timeDisplay = document.getElementById("timeDisplay");
    this.updatedOn = document.getElementById("updatedOn");
  }

  renderImage(picture: PictureInfo): void {
    if (this.precipitationImage && this.timeDisplay) {
      this.precipitationImage.innerHTML = this.generateImageHtml(picture);
      this.timeDisplay.textContent = `${picture.timepoint} (${picture.data_type})`;
    }
  }

  renderLastUpdated(day: string, timepoint: string): void {
    if (this.updatedOn) {
      this.updatedOn.textContent = `Updated on ${day}, ${timepoint}`;
    }
  }

  private generateImageHtml(picture: PictureInfo): string {
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
}