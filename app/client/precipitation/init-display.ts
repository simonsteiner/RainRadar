import { Map } from "maplibre-gl";
import { fetchPrecipitationAnimation } from "./api";
import { extractPictureInfo } from "./utils";
import { AnimationData, PictureInfo } from "./types";
import { setupSlider, findLatestMeasurementIndex } from "./slider";
import { PrecipitationRenderer } from "./render";
import { createLegend } from "./legend";
import { AnimationController } from "./slider";
import { ParaglidingMode } from "./paragliding-mode";

export class PrecipitationDisplayManager {
  private renderer: PrecipitationRenderer;
  private pictures: PictureInfo[] = [];
  private animationController?: AnimationController;

  constructor(map: Map) {
    this.renderer = new PrecipitationRenderer(map);
    this.setupParaglidingModeListener();
  }

  private setupParaglidingModeListener(): void {
    ParaglidingMode.getInstance().addChangeListener(() => this.reinitialize());
  }

  private async reinitialize(): Promise<void> {
    this.stopCurrentAnimation();
    await this.initialize();
  }

  private stopCurrentAnimation(): void {
    this.animationController?.pause();
  }

  private async setupAnimationController(latestMeasurementIndex: number): Promise<void> {
    this.stopCurrentAnimation();
    const pictures = ParaglidingMode.getInstance().isEnabled()
      ? this.getSubsetPicturesForParaglidingMode(latestMeasurementIndex)
      : this.pictures;
    this.animationController = setupSlider(pictures, this.renderer);
  }

  private getSubsetPicturesForParaglidingMode(latestIndex: number): PictureInfo[] {
    // Show 12 pictures before and 13 pictures after the latest measurement
    // 2hrs of data in total
    const start = Math.max(0, latestIndex - 12);
    const end = Math.min(this.pictures.length, latestIndex + 14);
    return this.pictures.slice(start, end);
  }

  public async initialize(): Promise<void> {
    try {
      const animationData = await fetchPrecipitationAnimation();
      this.updateDisplayData(animationData);
      const latestMeasurementIndex = findLatestMeasurementIndex(this.pictures);
      await this.setupAnimationController(latestMeasurementIndex);
      await this.renderer.updateImage(latestMeasurementIndex, this.pictures);
    } catch (error) {
      this.handleInitializationError(error);
    }
  }

  private updateDisplayData(animationData: AnimationData): void {
    this.renderer.updateLastUpdated(animationData);
    this.pictures = extractPictureInfo(animationData);
    createLegend(animationData.legend);
  }

  private handleInitializationError(error: unknown): void {
    console.error(
      "Error initializing precipitation display:",
      error instanceof Error ? error.message : String(error)
    );
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
