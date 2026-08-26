import { AnimationController } from "./slider";
import { createLegend } from "./legend";
import { extractPictureInfo } from "./utils";
import { fetchPrecipitationAnimation } from "./api";
import { Map } from "maplibre-gl";
import { ParaglidingMode } from "./paragliding-mode";
import { PrecipitationRenderer } from "./render";
import { setupSlider, findLatestMeasurementIndex } from "./slider";
import type { AnimationData, PictureInfo } from "../_types/precipitation";

export class PrecipitationDisplayManager {
  private renderer: PrecipitationRenderer;
  private pictures: PictureInfo[] = [];
  private animationController?: AnimationController;

  constructor(map: Map) {
    this.renderer = new PrecipitationRenderer(map);
    this.setupParaglidingModeListener();
  }

  private setupParaglidingModeListener(): void {
    ParaglidingMode.getInstance().addChangeListener(() => {
      // The listener is typed `() => void`; reinitialize handles its own
      // errors, so there is nothing to propagate.
      void this.reinitialize();
    });
  }

  private async reinitialize(): Promise<void> {
    this.stopCurrentAnimation();
    await this.initialize();
  }

  private stopCurrentAnimation(): void {
    this.animationController?.pause();
  }

  private setupAnimationController(latestMeasurementIndex: number): void {
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
      this.setupAnimationController(latestMeasurementIndex);
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
  // Deliberately not awaited: callers get the manager straight away and the
  // first render fills in when it arrives. `initialize` logs its own failures.
  void precipitationManager.initialize();
  return precipitationManager;
}
