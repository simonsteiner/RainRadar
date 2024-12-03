import { Map } from "maplibre-gl";
import { fetchPrecipitationAnimation } from "./api";
import { extractPictureInfo } from "./utils";
import { PictureInfo } from "./types";
import { setupSlider, findLatestMeasurementIndex } from "./slider";
import { PrecipitationRenderer } from "./render";
import { createLegend } from "./legend";
import { AnimationController } from "./slider";
import { ParaglidingMode } from "./paragliding-mode";

export class PrecipitationDisplayManager {
  private renderer: PrecipitationRenderer;
  private pictures: PictureInfo[] = [];
  private currentIndex = 0;
  private animationController?: AnimationController;

  constructor(map: Map) {
    this.renderer = new PrecipitationRenderer(map);
    ParaglidingMode.getInstance().addChangeListener(() => this.reinitialize());
  }

  private isParaglidingMode(): boolean {
    return ParaglidingMode.getInstance().isEnabled();
  }

  private getPicturesToShow(latestIndex: number): PictureInfo[] {
    const start = Math.max(0, latestIndex - 12);
    const end = Math.min(this.pictures.length, latestIndex + 13);
    return this.pictures.slice(start, end);
  }

  private async reinitialize(): Promise<void> {
    if (this.animationController) {
      this.animationController.pause();
    }
    await this.initialize();
  }

  public async initialize(): Promise<void> {
    try {
      const animationData = await fetchPrecipitationAnimation();
      this.renderer.updateLastUpdated(animationData);
      this.pictures = extractPictureInfo(animationData);
      const latestMeasurementIndex = findLatestMeasurementIndex(this.pictures);

      // Clean up previous animation controller if exists
      if (this.animationController) {
        this.animationController.pause();
      }

      if (this.isParaglidingMode()) {
        const picturesToShow = this.getPicturesToShow(latestMeasurementIndex);
        this.animationController = setupSlider(picturesToShow, this.renderer);
      } else {
        this.animationController = setupSlider(this.pictures, this.renderer);
      }

      createLegend(animationData.legend);
      await this.renderer.updateImage(latestMeasurementIndex, this.pictures);
    } catch (error) {
      console.error(
        "Error initializing precipitation display:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  public getAnimationController(): AnimationController | undefined {
    return this.animationController;
  }
}

export function initializePrecipitationDisplay(map: Map): PrecipitationDisplayManager {
  const precipitationManager = new PrecipitationDisplayManager(map);
  precipitationManager.initialize();
  return precipitationManager;
}
