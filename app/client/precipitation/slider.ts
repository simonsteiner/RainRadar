import { ParaglidingMode } from "./paragliding-mode";
import { PrecipitationRenderer } from "./render";
import type { AnimationControls, PictureInfo } from "../_types/precipitation";

export class AnimationController {
  private isPlaying = false;
  private animationInterval?: number;
  private animationSpeed = 500;
  private readonly controls: AnimationControls;
  private readonly pictures: PictureInfo[];
  private readonly renderer: PrecipitationRenderer;
  private readonly isParaglidingMode: boolean;

  constructor(
    controls: AnimationControls,
    pictures: PictureInfo[],
    renderer: PrecipitationRenderer,
    isParaglidingMode: boolean
  ) {
    this.controls = controls;
    this.pictures = pictures;
    this.renderer = renderer;
    this.isParaglidingMode = isParaglidingMode;
    this.initializeControls();

    if (ParaglidingMode.getInstance().isEnabled()) {
      this.animationSpeed = 500; // Fixed speed for paragliding
      this.play();
    }
  }

  private initializeControls() {
    const { slider, speedButtons } = this.controls;
    slider.max = (this.pictures.length - 1).toString();
    slider.value = findLatestMeasurementIndex(this.pictures).toString();

    this.setupSpeedControls();
    this.setupPlayButton();
    this.setupSliderInput();
    this.setupNavigationButtons();
  }

  private setupSpeedControls() {
    this.controls.speedButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const button = e.target as HTMLButtonElement;
        this.controls.speedButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        this.animationSpeed = parseInt(button.dataset.speed || "500");
        if (this.isPlaying) {
          this.pause();
          this.play();
        }
      });
    });
  }

  public pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.controls.playButton.textContent = "▶";
      this.controls.playButton.classList.remove("playing");
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }
    }
  }

  private play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.controls.playButton.textContent = "⏸";
      this.controls.playButton.classList.add("playing");
      this.animationInterval = window.setInterval(() => {
        let currentIndex = parseInt(this.controls.slider.value);
        currentIndex =
          currentIndex >= this.pictures.length - 1 ? 0 : currentIndex + 1;
        this.controls.slider.value = currentIndex.toString();
        this.renderer.updateImage(currentIndex, this.pictures);
      }, this.animationSpeed);
    }
  }

  private setupPlayButton() {
    this.controls.playButton?.addEventListener("click", () =>
      this.isPlaying ? this.pause() : this.play()
    );
  }

  private setupSliderInput() {
    this.controls.slider.addEventListener("input", (e) => {
      this.pause();
      const index = parseInt((e.target as HTMLInputElement).value);
      this.renderer.updateImage(index, this.pictures);
    });
  }

  private setupNavigationButtons() {
    this.controls.prevButton?.addEventListener("click", () => {
      this.pause();
      const currentIndex = parseInt(this.controls.slider.value);
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        this.controls.slider.value = newIndex.toString();
        this.renderer.updateImage(newIndex, this.pictures);
      }
    });

    this.controls.nextButton?.addEventListener("click", () => {
      this.pause();
      const currentIndex = parseInt(this.controls.slider.value);
      if (currentIndex < this.pictures.length - 1) {
        const newIndex = currentIndex + 1;
        this.controls.slider.value = newIndex.toString();
        this.renderer.updateImage(newIndex, this.pictures);
      }
    });
  }
}

export function findLatestMeasurementIndex(pictures: PictureInfo[]): number {
  for (let i = pictures.length - 1; i >= 0; i--) {
    if (pictures[i].data_type === "measurement") {
      return i;
    }
  }
  return 0;
}

export function setupSlider(
  pictures: PictureInfo[],
  renderer: PrecipitationRenderer,
): AnimationController | undefined {
  const controls: AnimationControls = {
    slider: document.getElementById("timeSlider") as HTMLInputElement,
    prevButton: document.getElementById("prevStep") as HTMLElement,
    nextButton: document.getElementById("nextStep") as HTMLElement,
    playButton: document.getElementById("playButton") as HTMLElement,
    speedButtons: document.querySelectorAll(".speed-btn"),
  };

  if (controls.slider) {
    return new AnimationController(
      controls,
      pictures,
      renderer,
      ParaglidingMode.getInstance().isEnabled()
    );
  }
  return undefined;
}
