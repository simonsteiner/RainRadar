import { Map } from "maplibre-gl";
import { PictureInfo } from "./types";
import { updateImage } from "./display";

interface AnimationControls {
  slider: HTMLInputElement;
  playButton: HTMLElement;
  prevButton: HTMLElement;
  nextButton: HTMLElement;
  speedButtons: NodeListOf<Element>;
}

class AnimationController {
  private isPlaying = false;
  private animationInterval?: number;
  private animationSpeed = 500;
  private readonly controls: AnimationControls;
  private readonly pictures: PictureInfo[];
  private readonly map: Map;

  constructor(controls: AnimationControls, pictures: PictureInfo[], map: Map) {
    this.controls = controls;
    this.pictures = pictures;
    this.map = map;
    this.initializeControls();
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

  private pause() {
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
        updateImage(currentIndex, this.pictures, this.map);
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
      updateImage(index, this.pictures, this.map);
    });
  }

  private setupNavigationButtons() {
    this.controls.prevButton?.addEventListener("click", () => {
      this.pause();
      const currentIndex = parseInt(this.controls.slider.value);
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        this.controls.slider.value = newIndex.toString();
        updateImage(newIndex, this.pictures, this.map);
      }
    });

    this.controls.nextButton?.addEventListener("click", () => {
      this.pause();
      const currentIndex = parseInt(this.controls.slider.value);
      if (currentIndex < this.pictures.length - 1) {
        const newIndex = currentIndex + 1;
        this.controls.slider.value = newIndex.toString();
        updateImage(newIndex, this.pictures, this.map);
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

export function setupSlider(pictures: PictureInfo[], map: Map) {
  const controls: AnimationControls = {
    slider: document.getElementById("timeSlider") as HTMLInputElement,
    prevButton: document.getElementById("prevStep") as HTMLElement,
    nextButton: document.getElementById("nextStep") as HTMLElement,
    playButton: document.getElementById("playButton") as HTMLElement,
    speedButtons: document.querySelectorAll(".speed-btn"),
  };

  if (controls.slider) {
    new AnimationController(controls, pictures, map);
  }
}