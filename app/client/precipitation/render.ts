import { Map } from "maplibre-gl";
import { AnimationData, PictureInfo } from "./types";
import { fetchJson } from "./api";
import { radar2geojson } from "../geojson/radar2geojson";
import { LayerManager } from "../map/layer-manager";
import { RadarData } from "../geojson/types";

export class PrecipitationRenderer {
  private precipitationImage: HTMLElement | null;
  private timeDisplay: HTMLElement | null;
  private updatedOn: HTMLElement | null;
  private layerManager: LayerManager;

  constructor(map: Map) {
    this.precipitationImage = document.getElementById("precipitationImage");
    this.timeDisplay = document.getElementById("timeDisplay");
    this.updatedOn = document.getElementById("updatedOn");
    this.layerManager = new LayerManager(map);
  }

  async updateImage(index: number, pictures: PictureInfo[]): Promise<void> {
    const picture = pictures[index];
    if (!picture) return;

    this.renderImage(picture);
    await this.updateRadarData(picture);
  }

  updateLastUpdated(animationData: AnimationData): void {
    const { day, timepoint } = animationData.map_images[0];
    if (this.updatedOn) {
      this.updatedOn.textContent = `Updated on ${day}, ${timepoint}`;
    }
  }

  private async updateRadarData(picture: PictureInfo): Promise<void> {
    try {
      const radarData: RadarData = await fetchJson("/api" + picture.radar_url);
      const geojson = radar2geojson(radarData);
      this.layerManager.updateSourceData('precipitation', geojson);
    } catch (error) {
      console.error("Error updating radar data:", error);
      throw error;
    }
  }

  private renderImage(picture: PictureInfo): void {
    if (this.precipitationImage && this.timeDisplay) {
      this.precipitationImage.innerHTML = this.outputImageMetadata(picture);
      this.timeDisplay.textContent = `${picture.timepoint} (${picture.data_type})`;
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
