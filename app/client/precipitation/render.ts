import { PictureInfo } from "./types";

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
      this.precipitationImage.innerHTML = this.outputImageMetadata(picture);
      this.timeDisplay.textContent = `${picture.timepoint} (${picture.data_type})`;
    }
  }

  renderLastUpdated(day: string, timepoint: string): void {
    if (this.updatedOn) {
      this.updatedOn.textContent = `Updated on ${day}, ${timepoint}`;
    }
  }

  private getFilenameFromPath(path: string): string {
    return path.split("/").pop() || path;
  }

  private outputImageMetadata(picture: PictureInfo): string {
    return `
      <table class="metadata-table">
        <tr><td>Data Type:</td><td>${picture.data_type_string}</td></tr>
        <tr>
          <td>Radar URL:</td>
          <td>
            <a href="api${picture.radar_url}" target="_blank">${this.getFilenameFromPath(picture.radar_url)}</a>
          </td>
        </tr>
        <tr><td>Timepoint:</td><td>${picture.timepoint}</td></tr>
        <tr><td>Day:</td><td>${picture.day}</td></tr>
        <tr><td>Data Type:</td><td>${picture.data_type}</td></tr>
        <tr><td>Timestamp:</td><td>${picture.timestamp}</td></tr>
        ${
          picture.data_type === "forecast"
            ? `
          <tr>
            <td>Snow/Rain URL:</td>
            <td>
              <a href="api${picture.snowrain_url}" target="_blank">${picture.snowrain_url ? this.getFilenameFromPath(picture.snowrain_url) : ''}</a>
            </td>
          </tr>
          <tr>
            <td>Freezing Rain URL:</td>
            <td>
              <a href="api${picture.freezingrain_url}" target="_blank">${picture.freezingrain_url ? this.getFilenameFromPath(picture.freezingrain_url) : ''}</a>
            </td>
          </tr>
          <tr>
            <td>Snow URL:</td>
            <td>
              <a href="api${picture.snow_url}" target="_blank">${picture.snow_url ? this.getFilenameFromPath(picture.snow_url) : ''}</a>
            </td>
          </tr>
        `
            : ""
        }
      </table>
    `;
  }
}
