import { fetchJson } from "./api";
import { LayerManager } from "../map/layer-manager";
import { Map } from "maplibre-gl";
import { radar2geojson } from "../geojson/radar2geojson";
import type { AnimationData, PictureInfo } from "../_types/precipitation";
import type { RadarData } from "../_types/geojson";

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

  getWeekdayFromDate(dateString: String): string {
    const [day, month, year] = dateString.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
    return weekday;
  }

  updateLastUpdated(animationData: AnimationData): void {
    const { day, timepoint } = animationData.map_images[0];
    if (this.updatedOn) {
      const weekday = this.getWeekdayFromDate(day);
      this.updatedOn.textContent = `Updated on ${weekday} ${day}, ${timepoint}`;
    }
  }

  private async updateRadarData(picture: PictureInfo): Promise<void> {
    try {
      const radarData: RadarData = await fetchJson("/api" + picture.radar_url);
      const geojson = radar2geojson(radarData);
      this.layerManager.updateSourceData("precipitation", geojson);
    } catch (error) {
      console.error("Error updating radar data:", error);
      throw error;
    }
  }

  private renderImage(picture: PictureInfo): void {
    if (this.precipitationImage && this.timeDisplay) {
      this.precipitationImage.innerHTML = this.outputImageMetadata(picture);
      const weekday = this.getWeekdayFromDate(picture.day);
      const dataType = this.capitalizeFirstLetter(picture.data_type);
      this.timeDisplay.innerHTML = `${dataType}<br>${weekday}, ${picture.timepoint}`;
    }
  }

  private capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getFilenameFromPath(path: string): string {
    return path.split("/").pop() || path;
  }

  private createHtmlLink(url: string | undefined): string {
    if (!url) return "";
    const filename = this.getFilenameFromPath(url);
    return `<a href="api${url}" target="_blank">${filename}</a>`;
  }

  private outputImageMetadata(picture: PictureInfo): string {
    return `
      <table class="metadata-table">
        <tr><td>Data Type:</td><td>${picture.data_type_string}</td></tr>
        <tr><td>Radar URL:</td><td>${this.createHtmlLink(picture.radar_url)}</td></tr>
        <tr><td>Timepoint:</td><td>${picture.timepoint}</td></tr>
        <tr><td>Day:</td><td>${picture.day}</td></tr>
        <tr><td>Data Type:</td><td>${picture.data_type}</td></tr>
        <tr><td>Timestamp:</td><td>${picture.timestamp}</td></tr>
        ${picture.data_type === "forecast" ? `
          <tr><td>Snow/Rain URL:</td><td>${this.createHtmlLink(picture.snowrain_url)}</td></tr>
          <tr><td>Freezing Rain URL:</td><td>${this.createHtmlLink(picture.freezingrain_url)}</td></tr>
          <tr><td>Snow URL:</td><td>${this.createHtmlLink(picture.snow_url)}</td></tr>
        ` : ""}
      </table>
    `;
  }
}
