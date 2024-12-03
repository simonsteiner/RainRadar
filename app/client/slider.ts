
import { Map } from "maplibre-gl";
import { PictureInfo } from "./types";
import { updateImage } from "./display";

export function findLatestMeasurementIndex(pictures: PictureInfo[]): number {
  for (let i = pictures.length - 1; i >= 0; i--) {
    if (pictures[i].data_type === 'measurement') {
      return i;
    }
  }
  return 0;
}

export function setupSlider(pictures: PictureInfo[], map: Map) {
  const slider = document.getElementById("timeSlider") as HTMLInputElement;
  const prevButton = document.getElementById("prevStep");
  const nextButton = document.getElementById("nextStep");

  if (slider) {
    slider.max = (pictures.length - 1).toString();
    const latestMeasurementIndex = findLatestMeasurementIndex(pictures);
    slider.value = latestMeasurementIndex.toString();
    
    slider.addEventListener("input", (e) => {
      const index = parseInt((e.target as HTMLInputElement).value);
      updateImage(index, pictures, map);
    });

    prevButton?.addEventListener("click", () => {
      const currentIndex = parseInt(slider.value);
      if (currentIndex > 0) {
        slider.value = (currentIndex - 1).toString();
        updateImage(currentIndex - 1, pictures, map);
      }
    });

    nextButton?.addEventListener("click", () => {
      const currentIndex = parseInt(slider.value);
      if (currentIndex < pictures.length - 1) {
        slider.value = (currentIndex + 1).toString();
        updateImage(currentIndex + 1, pictures, map);
      }
    });
  }
}